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

import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastController: jasmine.SpyObj<ToastController>;
  let present: jasmine.Spy;

  beforeEach(() => {
    present = jasmine.createSpy('present').and.resolveTo();
    toastController = jasmine.createSpyObj<ToastController>('ToastController', ['create']);
    toastController.create.and.resolveTo({ present } as unknown as HTMLIonToastElement);

    TestBed.configureTestingModule({
      providers: [
        { provide: ToastController, useValue: toastController },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('presents the toast it creates', async () => {
    await service.show('hello');

    expect(toastController.create).toHaveBeenCalled();
    expect(present).toHaveBeenCalled();
  });

  it('uses a short duration and success styling for success()', async () => {
    await service.success('saved');

    expect(toastController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'saved', duration: 3000, cssClass: 'success-toast' }),
    );
  });

  it('uses a long duration and error styling for error()', async () => {
    await service.error('boom');

    expect(toastController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'boom', duration: 10000, cssClass: 'error-toast' }),
    );
  });

  it('preserves multi-line messages verbatim', async () => {
    const stacked = 'Validation failed\n\n• [username] already exists';
    await service.error(stacked);

    expect(toastController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: stacked }),
    );
  });

  it('adds a translated dismiss button by default', async () => {
    await service.show('hello');

    const config = toastController.create.calls.mostRecent().args[0]!;
    expect(config.buttons).toEqual([{ text: 'COMMON.CLOSE', role: 'cancel' }]);
  });

  it('omits the dismiss button when the label is empty', async () => {
    await service.show('hello', { dismissLabel: '' });

    const config = toastController.create.calls.mostRecent().args[0]!;
    expect(config.buttons).toEqual([]);
  });

  it('lets callers override the default duration', async () => {
    await service.error('boom', { duration: 500 });

    expect(toastController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ duration: 500 }),
    );
  });
});
