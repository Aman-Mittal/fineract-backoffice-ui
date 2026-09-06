# Issue screenshots

Screenshots referenced from issues on `apache/fineract-backoffice-ui`.
Captured against a live Fineract instance (`apache/fineract:latest`) at 1440x620.

This branch carries no application code — it exists only so issues can embed images.

## Live UI verification pass, 2026-09-06

Captured against a clean worktree of `apache/main` served with `ng serve`, backend
`sandbox.mifos.community`, logged in as `mifos`. Viewports noted per file.

- `login-signin-clipped-1280x560.png` — 1280x560
- `contrast-header-dashboard-light.png` — 1366x900, light theme
- `offices-pagination-of-many.png` — 1366x900
- `mobile-stepper-step3-offscreen-368.png` — 368x691
- `mobile-paginator-garbled-368.png` — 368x691
- `mobile-dashboard-2col-390.png` — 390x844
- `profile-read-only.png` — 1366x900
- `advanced-client-search-single-field.png` — 1366x900

## Loan capability-gap evidence, 2026-09-06

Captured against two real Active loans (one cumulative, one progressive) seeded into a local
`apache/fineract` stack via the repository's own `e2e/utils/seed-api.ts` helpers. 1366x900.

- `loan-actions-progressive.png` — the Actions menu on a progressive Active loan (17 entries)
- `loan-actions-cumulative.png` — the same menu on a cumulative Active loan (14 entries)
- `loan-transactions-tab.png` — the Transactions tab; the only row-level affordance is view
- `loan-delinquency-tab.png` — the read-only delinquency tab on a regular loan

## Refund by Cash (PR for #506)

Captured end to end against a local `apache/fineract` stack, on a loan deliberately paid ahead of
schedule so the platform would accept the refund.

- `refund-by-cash-menu.png` — the action offered on an advance-paid Active loan
- `refund-by-cash-form.png` — the shared transaction form under the `refundByCash` type

## PR #509 — disbursement tranche edit, 2026-09-06

Captured at 1440x950 against the local docker stack (`apache/fineract:latest`,
`sha256:6da0292e`) on loan 24, a two-tranche loan on a `multiDisburseLoan` product.

- `disbursement-tranche-raw-array.png` — the loaded tranche on `main`: the expected
  disbursement text box shows `2026,8,25`, the raw year/month/day array.
- `disbursement-tranche-save-rejected.png` — Save on `main`: 400, `principal` and
  `note` reported as unsupported parameters.
- `disbursement-tranche-save-fixed.png` — Save on the PR branch: 200, and the
  reloaded tranche carries the new date and principal.
- `disbursement-tranche-edit-before.webm` / `disbursement-tranche-edit-fixed.webm` —
  the same run recorded end to end.
