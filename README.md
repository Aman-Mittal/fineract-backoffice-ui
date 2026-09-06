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
