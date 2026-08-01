/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from './dialog.service';

@Component({ selector: 'app-stub-dialog', standalone: true, template: '' })
class StubDialogComponent {}

/** The class DialogService puts on every modal; see src/styles/_dialogs.scss. */
const APP_DIALOG_CLASS = 'app-dialog';
/** Stand-in for whatever a caller passes through. */
const WIDE_CLASS = 'wide';

describe('DialogService', () => {
  let service: DialogService;
  let modalController: jasmine.SpyObj<ModalController>;
  let present: jasmine.Spy;
  let onWillDismiss: jasmine.Spy;

  beforeEach(() => {
    present = jasmine.createSpy('present').and.resolveTo();
    onWillDismiss = jasmine.createSpy('onWillDismiss').and.resolveTo({ data: undefined });

    modalController = jasmine.createSpyObj<ModalController>('ModalController', ['create']);
    modalController.create.and.resolveTo({
      present,
      onWillDismiss,
    } as unknown as HTMLIonModalElement);

    TestBed.configureTestingModule({
      providers: [
        { provide: ModalController, useValue: modalController },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });

    service = TestBed.inject(DialogService);
  });

  describe('open', () => {
    it('presents the modal and resolves with the dismiss payload', async () => {
      onWillDismiss.and.resolveTo({ data: { id: 7 } });

      const result = await service.open(StubDialogComponent, { foo: 'bar' });

      expect(modalController.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          component: StubDialogComponent,
          componentProps: { foo: 'bar' },
        }),
      );
      expect(present).toHaveBeenCalled();
      expect(result).toEqual({ id: 7 });
    });

    const cssClassOfLastModal = () => modalController.create.calls.mostRecent().args[0]!.cssClass;

    /*
     * `app-dialog` is what gives a dialog's body its scroll container
     * (src/styles/_dialogs.scss). Losing it puts the action buttons of any
     * dialog taller than the viewport out of reach, which is invisible until
     * someone opens a long one — so pin the composition here rather than
     * relying on an e2e to notice.
     */
    it('always applies the app-dialog class', async () => {
      await service.open(StubDialogComponent);

      expect(cssClassOfLastModal()).toEqual([APP_DIALOG_CLASS]);
    });

    it('keeps a caller-supplied class, as a string or an array', async () => {
      await service.open(StubDialogComponent, undefined, WIDE_CLASS);
      expect(cssClassOfLastModal()).toEqual([APP_DIALOG_CLASS, WIDE_CLASS]);

      await service.open(StubDialogComponent, undefined, [WIDE_CLASS, 'tall']);
      expect(cssClassOfLastModal()).toEqual([APP_DIALOG_CLASS, WIDE_CLASS, 'tall']);
    });

    it('resolves undefined when dismissed without a payload', async () => {
      const result = await service.open(StubDialogComponent);

      expect(result).toBeUndefined();
    });
  });

  /* eslint-disable sonarjs/assertions-in-tests --
     These assert with expectAsync().toBeResolvedTo(), which the rule does not
     recognise as an assertion. Rewriting them would only satisfy the check. */
  describe('confirm', () => {
    it('resolves true only when the dialog reports confirmation', async () => {
      onWillDismiss.and.resolveTo({ data: true });

      await expectAsync(service.confirm({ title: 'T', message: 'M' })).toBeResolvedTo(true);
    });

    it('resolves false when cancelled', async () => {
      onWillDismiss.and.resolveTo({ data: false });

      await expectAsync(service.confirm({ title: 'T', message: 'M' })).toBeResolvedTo(false);
    });

    it('resolves false when dismissed via backdrop with no result', async () => {
      onWillDismiss.and.resolveTo({ data: undefined });

      await expectAsync(service.confirm({ title: 'T', message: 'M' })).toBeResolvedTo(false);
    });

    it('supplies translated default button labels that callers can override', async () => {
      await service.confirm({ title: 'T', message: 'M', confirmText: 'Delete it' });

      const props = modalController.create.calls.mostRecent().args[0]!.componentProps!;
      expect(props['data']).toEqual(
        jasmine.objectContaining({
          title: 'T',
          message: 'M',
          confirmText: 'Delete it',
          cancelText: 'COMMON.CANCEL',
        }),
      );
    });
  });
});
