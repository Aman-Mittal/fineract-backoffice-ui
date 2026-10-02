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

import { createSpyObj } from '../../../testing/mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import {
  ExternalAssetOwnerLoanProductAttributesService,
  ExternalAssetOwnersService,
} from '../../../api';
import { provideTranslateTesting } from '../../../testing/i18n-testing';
import { expectLookedUp } from '../../../testing/translated-text';
import { AssetOwnerViewComponent } from './asset-owner-view.component';

describe('AssetOwnerViewComponent', () => {
  let fixture: ComponentFixture<AssetOwnerViewComponent>;

  beforeEach(async () => {
    const owners = createSpyObj<ExternalAssetOwnersService>([
      'getExternalAssetOwnersTransfers',
      'getExternalAssetOwnersTransfersTransferIdJournalEntries',
    ]);
    owners.getExternalAssetOwnersTransfers.mockReturnValue(
      of({
        content: [{ transferId: 7, status: 'ACTIVE', owner: { externalId: 'OWNER-1' } }],
      }) as unknown as ReturnType<ExternalAssetOwnersService['getExternalAssetOwnersTransfers']>,
    );
    owners.getExternalAssetOwnersTransfersTransferIdJournalEntries.mockReturnValue(
      of({ journalEntryData: { content: [] } }) as unknown as ReturnType<
        ExternalAssetOwnersService['getExternalAssetOwnersTransfersTransferIdJournalEntries']
      >,
    );

    await TestBed.configureTestingModule({
      imports: [AssetOwnerViewComponent],
      providers: [
        ...provideTranslateTesting(),
        provideRouter([]),
        provideNoopAnimations(),
        { provide: ExternalAssetOwnersService, useValue: owners },
        {
          provide: ExternalAssetOwnerLoanProductAttributesService,
          useValue: createSpyObj<ExternalAssetOwnerLoanProductAttributesService>([
            'getExternalAssetOwnersLoanProductLoanProductIdAttributes',
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetOwnerViewComponent);
    fixture.detectChanges();
  });

  it('renders the loan link and the journal entries tab through the translation adapter', () => {
    expectLookedUp(fixture.nativeElement, ['ASSET_OWNERS.VIEW_LOAN_ACCOUNT', 'nav.journalEntries']);
  });
});
