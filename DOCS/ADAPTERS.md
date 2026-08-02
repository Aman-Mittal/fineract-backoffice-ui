<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# Adapters

Day-to-day use of `src/app/core/adapters/`. `DOCS/adr/0003-adapter-boundary.md` records why
the boundary exists; this is what to do at a keyboard.

## The four adapters

| Token      | Import instead of                         | Usually reached through                |
| ---------- | ----------------------------------------- | -------------------------------------- |
| `I18N`     | `TranslateService`, `\| translate`        | directly, or `\| appTranslate`         |
| `OVERLAY`  | `ToastController`, `ModalController`      | `NotificationService`, `DialogService` |
| `STORAGE`  | `localStorage`, `sessionStorage`          | directly                               |
| `DOWNLOAD` | `URL.createObjectURL` + a download anchor | directly                               |

All four resolve without a provider. You inject the token and it works, in the app and in a
TestBed alike.

```ts
import { I18N, STORAGE, DOWNLOAD } from '../../core/adapters';

private readonly i18n = inject(I18N);
private readonly storage = inject(STORAGE);
private readonly download = inject(DOWNLOAD);
```

## Translation

In a template, swap the pipe and its import:

```ts
// before
import { TranslateModule } from '@ngx-translate/core';
imports: [TranslateModule],
// {{ 'LOANS.APPROVE' | translate }}

// after
import { TranslatePipe } from '../../core/adapters';
imports: [TranslatePipe],
// {{ 'LOANS.APPROVE' | appTranslate }}
```

In TypeScript, `translate.instant(key)` becomes `i18n.translate(key)`. The language is a
signal (`i18n.currentLang()`), so a template that switches on it re-renders without a
subscription.

`translate()` returns the key itself when there is no translation — never an empty string. A
blank label in a banking UI is indistinguishable from a field with no value, whereas a visible
`LOANS.APPROVE` diagnoses itself.

Use `translateAsync()` when the call runs before the HTTP-loaded catalogue has arrived, which
in practice means bootstrap.

## Overlays

Prefer `NotificationService` and `DialogService` — they sit on `OVERLAY` and carry the
project's duration, styling and `app-dialog` conventions. Reach for `OVERLAY` directly only
when writing something at that level.

```ts
await this.dialogService.open<Result>(MyDialogComponent, { data });

// When you must be able to take the dialog down yourself:
const handle = await this.dialogService.present<boolean>(WarningComponent, undefined, {
  dismissible: false,
});
await handle.dismiss();
```

`dismissible: false` covers backdrop **and** Escape. Ionic splits those across two flags; the
contract has one, because no caller has wanted them to disagree.

## Storage

Every key is declared in `core/adapters/storage/storage-keys.ts`. The type admits nothing
else, so **adding a key means editing that file** — which is the point: it is the reviewable
inventory of what this origin persists (`security.md` §4).

```ts
this.storage.write('session', normalized); // JSON
this.storage.read<UserSession | null>('session', null);
this.storage.writeRaw('tenant', tenantId); // plain string
this.storage.clearScope('session'); // everything tab-scoped
```

Two behaviours worth relying on:

- **Reads never throw.** A value that will not parse reads as absent and you get your
  fallback. `AuthService` previously parsed unguarded, so one bad character in
  `fineract_session` left the app blank at bootstrap with no route to the login page.
- **Writes never throw.** Safari Private Browsing has a zero quota and enterprise policy can
  deny an origin storage outright. Persistence is lost; the tab keeps working.

Choose the scope by lifetime, not by API: `session` is the tab, `device` survives restarts and
is shared across tabs.

## Downloads

```ts
this.download.save(blob, doc?.fileName ?? 'document');
this.download.saveText(csv, 'Report.csv', 'text/csv;charset=utf-8;');
```

Filenames are sanitised, so a server-supplied one can be passed straight through: the basename
is taken (`../../etc/passwd` → `passwd`), characters Windows refuses are replaced, spaces are
kept, and an over-long name is truncated with its extension intact. The object URL is revoked
in a `finally`, so a failure part-way through does not leak it.

## Testing

```ts
import { provideFakeAdapters } from '../../testing/adapters';

const fakes = provideFakeAdapters();
TestBed.configureTestingModule({ providers: [...fakes.providers] });

// assert on what the code asked for, not on what a library rendered
expect(fakes.overlay.lastModal!.dismissible).toBe(false);
expect(fakes.storage.readRaw('theme')).toBe('dark');
expect(fakes.download.lastSaved!.filename).toBe('Report.csv');
```

A spec using the fakes needs neither `provideIonicTesting()` nor a translation catalogue.
Prefer this to mocking `ModalController` or spying on `localStorage`: the fake asserts on the
request the code made, which is the thing the code is responsible for.

## Adding an adapter

Follow the shape of the existing four:

1. `contract.adapter.ts` — the interface, plus an `InjectionToken` with
   `providedIn: 'root'` and a factory pointing at the default implementation.
2. `impl.adapter.ts` — one class, `@Injectable({ providedIn: 'root' })`, importing its
   contract with **`import type`**. The token names the class, so a value import back would
   close a runtime cycle.
3. Export both from `core/adapters/index.ts`.
4. Add the restriction to `eslint.config.js` and record the existing violations with
   `npx eslint src --suppressions-location eslint-suppressions.json --suppress-rule <rule>`.
5. Add a fake to `src/app/testing/adapters.ts`.

State the contract in terms of what the application needs, not what the library offers.
`I18nAdapter` has nine members because that is what a count of the call sites found, not
because `TranslateService` has thirty.

## What is deliberately not adapted

- **`<ion-*>` components.** They are the UI layer (`AGENTS.md`), 250 files, and migrate one
  component at a time. Only Ionic's imperative controllers are behind the boundary.
- **The generated OpenAPI client.** ADR 0001 considered a facade over its ~54 services and
  rejected it on maintenance cost. `npm run api:surface` is the complement — it verifies the
  dependency rather than wrapping it.
