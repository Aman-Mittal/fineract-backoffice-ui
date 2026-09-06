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

## Interest-pause edit screen, 2026-09-06

Captured at 1440x950 against the local docker stack, loan 26 — a progressive,
interest-recalculating loan carrying one pause (2026-08-17 to 2026-08-27).

- `interest-pause-edit-nan-blank.png` — `/loans/26/interest-pauses/edit/abc`: the card says
  "Edit Interest Pause" but both pickers sit on today, not on the stored pause.
- `interest-pause-edit-nan-duplicated.png` — the list after saving that screen: two pauses,
  because the save went out as a create.
- `interest-pause-edit-nan.webm` — the run end to end.
- `interest-pause-overwrite-picked.png` — dates the user chose while the populating GET was
  still in flight (Oct 10 / Oct 20).
- `interest-pause-overwrite-reverted.png` — the same screen once that GET landed: back to
  Aug 17 / Aug 27, with no indication anything was discarded.
- `interest-pause-overwrite.webm` — the run end to end.

## Date shift west of Greenwich (#496), 2026-09-06

Captured at 1440x950 from a Chromium context pinned to `America/New_York`, at 07:31 local —
nowhere near midnight, so the shift is not an edge-of-day artifact. Closing an Active group,
leaving the dialog's own default date untouched, against the local docker stack.

- `date-utc-shift-dialog-shows-today.png` — the Close Group dialog reading "Sep 6, 2026", the
  browser's local date, on the run that then sent `05 September 2026`.
- `date-utc-shift-before.webm` — `main` at `e6b31e4d`: the platform recorded `[2026, 9, 5]`.
- `date-utc-shift-after.webm` — the same action on the fix branch: `[2026, 9, 6]`.
