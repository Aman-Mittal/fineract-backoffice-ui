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

import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ProductAccountingSectionComponent } from './product-accounting-section.component';
import {
  ACCOUNTING_RULE,
  GlAccountOptions,
  LOAN_ACCOUNTING_FIELDS,
  SHARE_ACCOUNTING_FIELDS,
  SHARE_ACCOUNTING_RULES,
  fieldsForRule,
  mappingsForRule,
  mappingsFromResponse,
} from './product-accounting.model';
import { provideFakeAdapters } from '../../../testing/adapters';

const OPTIONS: GlAccountOptions = {
  assetAccountOptions: [{ id: 1, name: 'Loan Portfolio', glCode: '10201' }],
  liabilityAccountOptions: [{ id: 2, name: 'Overpayment', glCode: '20101' }],
  incomeAccountOptions: [{ id: 3, name: 'Interest Income', glCode: '40101' }],
  expenseAccountOptions: [{ id: 4, name: 'Write-off', glCode: '50101' }],
};

/** The nine slots cash accounting requires, as the platform enumerates them. */
const CASH_KEYS = [
  'fundSourceAccountId',
  'loanPortfolioAccountId',
  'transfersInSuspenseAccountId',
  'interestOnLoanAccountId',
  'incomeFromFeeAccountId',
  'incomeFromPenaltyAccountId',
  'incomeFromRecoveryAccountId',
  'writeOffAccountId',
  'overpaymentLiabilityAccountId',
];

const RECEIVABLE_KEYS = [
  'receivableInterestAccountId',
  'receivableFeeAccountId',
  'receivablePenaltyAccountId',
];

describe('ProductAccountingSectionComponent', () => {
  let fixture: ComponentFixture<ProductAccountingSectionComponent>;
  let component: ProductAccountingSectionComponent;

  async function setup(rule: number, options: GlAccountOptions = OPTIONS): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [ProductAccountingSectionComponent],
      providers: [provideNoopAnimations(), ...provideFakeAdapters().providers],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductAccountingSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fields', LOAN_ACCOUNTING_FIELDS);
    fixture.componentRef.setInput('accountOptions', options);
    fixture.componentRef.setInput('accountingRule', rule);
    fixture.detectChanges();
  }

  /** Every slot the section is currently showing, in render order. */
  function renderedKeys(): string[] {
    return component.groups().flatMap((group) => group.fields.map((field) => field.key));
  }

  it('shows no mapping fields at all under NONE', async () => {
    await setup(ACCOUNTING_RULE.NONE);

    expect(component.groups()).toEqual([]);
    expect(fixture.nativeElement.querySelector('app-gl-account-select')).toBeNull();
  });

  it('shows the nine cash slots under CASH, and none of the receivables', async () => {
    await setup(ACCOUNTING_RULE.CASH);

    expect(renderedKeys().toSorted()).toEqual([...CASH_KEYS].toSorted());
    for (const key of RECEIVABLE_KEYS) {
      expect(renderedKeys()).not.toContain(key);
    }
  });

  it('adds the receivables under both accrual rules', async () => {
    for (const rule of [ACCOUNTING_RULE.ACCRUAL_PERIODIC, ACCOUNTING_RULE.ACCRUAL_UPFRONT]) {
      await setup(rule);
      expect(renderedKeys().toSorted()).toEqual([...CASH_KEYS, ...RECEIVABLE_KEYS].toSorted());
      TestBed.resetTestingModule();
    }
  });

  it('groups slots by account class and offers only accounts of that class', async () => {
    await setup(ACCOUNTING_RULE.ACCRUAL_PERIODIC);

    const groups = component.groups();
    expect(groups.map((group) => group.accountType)).toEqual([
      'asset',
      'liability',
      'income',
      'expense',
    ]);
    // Pointing a slot at the wrong class is a 403 from the platform, so the picker must not
    // offer accounts it would refuse.
    expect(component.optionsFor('asset').map((account) => account.id)).toEqual([1]);
    expect(component.optionsFor('income').map((account) => account.id)).toEqual([3]);
  });

  it('says so when the tenant has no accounts of a class the rule needs', async () => {
    await setup(ACCOUNTING_RULE.CASH, { assetAccountOptions: OPTIONS.assetAccountOptions });

    const empty = component.groups().filter((group) => !group.hasOptions);
    expect(empty.map((group) => group.accountType)).toEqual(['liability', 'income', 'expense']);
    expect(
      fixture.nativeElement.querySelector('[data-testid="accounting-empty-income"]'),
    ).toBeTruthy();
  });

  it('records a selection without mutating the previous mappings object', async () => {
    await setup(ACCOUNTING_RULE.CASH);
    const before = component.mappings();

    component.setMapping('fundSourceAccountId', 1);

    expect(component.mappings()).toEqual({ fundSourceAccountId: 1 });
    // A new object, so a parent holding this in a signal actually sees the change.
    expect(component.mappings()).not.toBe(before);
    expect(before).toEqual({});
  });

  it('clears every selection when the rule goes back to NONE', async () => {
    await setup(ACCOUNTING_RULE.CASH);
    component.setMapping('fundSourceAccountId', 1);

    component.onRuleChange(ACCOUNTING_RULE.NONE);

    // Otherwise the user sees no accounting on screen while the model still holds ids.
    expect(component.mappings()).toEqual({});
  });

  it('keeps selections when moving between two posting rules', async () => {
    await setup(ACCOUNTING_RULE.ACCRUAL_PERIODIC);
    component.setMapping('fundSourceAccountId', 1);
    component.setMapping('receivableFeeAccountId', 1);

    component.onRuleChange(ACCOUNTING_RULE.CASH);

    // Comparing cash against accrual should not mean filling the nine shared slots twice.
    expect(component.mappings()['fundSourceAccountId']).toBe(1);
  });
});

describe('product accounting payload', () => {
  it('sends nothing under NONE, even when ids were picked earlier', () => {
    const picked = { fundSourceAccountId: 1, loanPortfolioAccountId: 2 };

    // A stray mapping key is a validation error from the platform, not a no-op.
    expect(mappingsForRule(LOAN_ACCOUNTING_FIELDS, ACCOUNTING_RULE.NONE, picked)).toEqual({});
  });

  it('drops receivables when the rule moved from accrual to cash', () => {
    const picked = {
      fundSourceAccountId: 1,
      receivableFeeAccountId: 9,
    };

    const payload = mappingsForRule(LOAN_ACCOUNTING_FIELDS, ACCOUNTING_RULE.CASH, picked);

    expect(payload).toEqual({ fundSourceAccountId: 1 });
  });

  it('omits a slot the user has not filled rather than sending null', () => {
    const payload = mappingsForRule(LOAN_ACCOUNTING_FIELDS, ACCOUNTING_RULE.CASH, {
      fundSourceAccountId: 1,
      loanPortfolioAccountId: undefined,
    });

    expect(Object.keys(payload)).toEqual(['fundSourceAccountId']);
  });

  it('reads a configured product back into the form', () => {
    // The response nests each account under a key without the `Id` suffix.
    const mappings = mappingsFromResponse(LOAN_ACCOUNTING_FIELDS, {
      fundSourceAccount: { id: 3, name: 'Probe ASSET' },
      loanPortfolioAccount: { id: 3, name: 'Probe ASSET' },
      overpaymentLiabilityAccount: { id: 4, name: 'Probe LIAB' },
    });

    expect(mappings).toEqual({
      fundSourceAccountId: 3,
      loanPortfolioAccountId: 3,
      overpaymentLiabilityAccountId: 4,
    });
  });

  it('reads an unconfigured product as no mappings rather than throwing', () => {
    expect(mappingsFromResponse(LOAN_ACCOUNTING_FIELDS, undefined)).toEqual({});
  });
});

/**
 * Share products, which differ from the other four families in three ways that all bite.
 */
describe('share product accounting', () => {
  it('maps four slots under cash, including the only equity slot in the application', () => {
    const fields = fieldsForRule(SHARE_ACCOUNTING_FIELDS, ACCOUNTING_RULE.CASH);

    expect(fields.map((field) => field.key)).toEqual([
      'shareReferenceId',
      'shareSuspenseId',
      'shareEquityId',
      'incomeFromFeeAccountId',
    ]);
    // Pointing this at a liability is refused with 403 validation.msg.domain.rule.violation.
    expect(fields.find((field) => field.key === 'shareEquityId')?.accountType).toBe('equity');
  });

  it('maps nothing under none', () => {
    expect(fieldsForRule(SHARE_ACCOUNTING_FIELDS, ACCOUNTING_RULE.NONE)).toEqual([]);
  });

  /**
   * The platform's validator accepts 1, 2 and 3, but a share product created under rule 3 asks
   * for no mappings and reads back with `accountingMappings: {}` — configured-looking and
   * posting nothing. Only the rules that mean what they say are offered.
   */
  it('offers none and cash only', () => {
    expect(SHARE_ACCOUNTING_RULES).toEqual([ACCOUNTING_RULE.NONE, ACCOUNTING_RULE.CASH]);
    expect(SHARE_ACCOUNTING_RULES).not.toContain(ACCOUNTING_RULE.ACCRUAL_PERIODIC);
  });

  /**
   * Share products read back under the same keys they are written with; every other family drops
   * the `Id` suffix on the way out.
   */
  it('reads a configured product back from identically named keys', () => {
    const mappings = mappingsFromResponse(SHARE_ACCOUNTING_FIELDS, {
      shareReferenceId: { id: 7, name: 'Share reference' },
      shareSuspenseId: { id: 8, name: 'Share suspense' },
      shareEquityId: { id: 27, name: 'Share equity' },
      incomeFromFeeAccountId: { id: 9, name: 'Fee income' },
    });

    expect(mappings).toEqual({
      shareReferenceId: 7,
      shareSuspenseId: 8,
      shareEquityId: 27,
      incomeFromFeeAccountId: 9,
    });
  });

  it('sends the four ids under cash and none under none', () => {
    const chosen = {
      shareReferenceId: 7,
      shareSuspenseId: 8,
      shareEquityId: 27,
      incomeFromFeeAccountId: 9,
    };

    expect(mappingsForRule(SHARE_ACCOUNTING_FIELDS, ACCOUNTING_RULE.CASH, chosen)).toEqual(chosen);
    expect(mappingsForRule(SHARE_ACCOUNTING_FIELDS, ACCOUNTING_RULE.NONE, chosen)).toEqual({});
  });
});

/**
 * The section inside a form, which is how every product form uses it.
 *
 * `NgModel` looks for its `ControlContainer` with `@Host()`, so a control declared in a child
 * component's template cannot reach the `ngForm` it visually sits in — Angular logs NG01354 and
 * the control is simply not registered. That had two consequences worth a test each: the
 * console filled with NG01354 on every product form, and `required` on a mandatory GL slot
 * never reached the form, so Save stayed enabled with the slot empty.
 */
@Component({
  standalone: true,
  imports: [FormsModule, ProductAccountingSectionComponent],
  template: `
    <form #hostForm="ngForm">
      <app-product-accounting-section
        [fields]="fields"
        [accountOptions]="options"
        [(accountingRule)]="rule"
        [(mappings)]="mappings"
      ></app-product-accounting-section>
    </form>
  `,
})
class FormHostComponent {
  readonly form = viewChild.required<NgForm>('hostForm');
  fields = LOAN_ACCOUNTING_FIELDS;
  options = OPTIONS;
  rule: number = ACCOUNTING_RULE.CASH;
  mappings: Record<string, number | undefined> = {};
}

describe('ProductAccountingSectionComponent in a form', () => {
  let host: ComponentFixture<FormHostComponent>;
  /** Kept only to keep the run quiet; what the fix does is asserted structurally below. */
  let errors: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [FormHostComponent],
      providers: [provideNoopAnimations(), ...provideFakeAdapters().providers],
    }).compileComponents();

    host = TestBed.createComponent(FormHostComponent);
    host.detectChanges();
    await host.whenStable();
  });

  afterEach(() => errors.mockRestore());

  it('registers the rule and every mapping slot with the parent form', () => {
    const controls = host.componentInstance.form().controls;

    expect(Object.keys(controls)).toContain('accountingRule');
    for (const key of CASH_KEYS) {
      expect(Object.keys(controls)).toContain(key);
    }
  });

  it('holds the form invalid while a required slot is empty, and releases it when filled', async () => {
    expect(host.componentInstance.form().invalid).toBe(true);

    const controls = host.componentInstance.form().controls;
    for (const key of CASH_KEYS) {
      controls[key].setValue(1);
    }
    host.detectChanges();
    await host.whenStable();

    expect(host.componentInstance.form().invalid).toBe(false);
  });
});
