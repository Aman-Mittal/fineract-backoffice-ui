import { Hd as M, Kd as k, Md as I, Od as O, Pd as m, Td as S, Uc as j, V as d, Vd as C, Yc as p, _c as l, e as a, nd as f } from "@nf-internal/chunk-XUCLUT7V";
import "@nf-internal/chunk-3V5PQWON";
import "@nf-internal/chunk-LBEDJUZW";
import { a as x, b as w } from "@nf-internal/chunk-IQO3VMP7";
import { Observable as D, ReplaySubject as R } from "rxjs";
import { takeUntil as q } from "rxjs/operators";
import "@angular/core/primitives/signals";
import "@angular/core/primitives/di";
function E(t) { t || (t = d(l)); let e = new D(n => { if (t.destroyed) {
    n.next();
    return;
} return t.onDestroy(n.next.bind(n)); }); return n => n.pipe(q(e)); }
var y = class {
    source;
    destroyed = !1;
    destroyRef = d(l);
    constructor(e) { this.source = e, this.destroyRef.onDestroy(() => { this.destroyed = !0; }); }
    subscribe(e) { if (this.destroyed)
        throw new a(953, !1); let n = this.source.pipe(E(this.destroyRef)).subscribe({ next: r => e(r) }); return { unsubscribe: () => n.unsubscribe() }; }
};
function W(t, e) { return new y(t); }
function z(t) { let e = I(t); return new D(n => { let r = e?.onDestroy(() => n.complete()), i = t.subscribe(o => n.next(o)); return () => { i.unsubscribe(), r?.(); }; }); }
function B(t, e) { let n = e?.injector ?? d(p), r = new R(1), i = M(() => { let o; try {
    o = t();
}
catch (u) {
    m(() => r.error(u));
    return;
} m(() => r.next(o)); }, { injector: n, manualCleanup: !0 }); return n.get(l).onDestroy(() => { i.destroy(), r.complete(); }), r.asObservable(); }
function G(t, e) { let r = !e?.manualCleanup ? e?.injector?.get(l) ?? d(l) : null, i = N(e?.equal), o; e?.requireSync ? o = f({ kind: 0 }, { equal: i }) : o = f({ kind: 1, value: e?.initialValue }, { equal: i }); let u, c = t.subscribe({ next: s => o.set({ kind: 1, value: s }), error: s => { o.set({ kind: 2, error: s }), u?.(); }, complete: () => { u?.(); } }); if (e?.requireSync && o().kind === 0)
    throw new a(601, !1); return u = r?.onDestroy(c.unsubscribe.bind(c)), O(() => { let s = o(); switch (s.kind) {
    case 1: return s.value;
    case 2: throw s.error;
    case 0: throw new a(601, !1);
} }, { equal: e?.equal }); }
function N(t = Object.is) { return (e, n) => e.kind === 1 && n.kind === 1 && t(e.value, n.value); }
function H(t) { t === void 0 && (t = d(p)); let e = t.get(k); return n => new D(r => { let i = e.add(), o = !1; function u() { o || (i(), o = !0); } let c = n.subscribe({ next: s => { r.next(s), u(); }, complete: () => { r.complete(), u(); }, error: s => { r.error(s), u(); } }); return c.add(() => { r.unsubscribe(), u(); }), c; }); }
function J(t) { return S(w(x({}, t), { loader: void 0, stream: e => { let n, r = !1, i = f({ value: void 0 }), { resolve: o, promise: u } = j(), c = !1; function s() { c || (c = !0, o(i)); } let v = () => { r = !0, n?.unsubscribe(), e.abortSignal.removeEventListener("abort", v), s(); }; e.abortSignal.addEventListener("abort", v); function g(b) { i.set(b), s(); } let h = t.stream; if (h === void 0)
        throw new a(990, !1); return n = h(e).subscribe({ next: b => g({ value: b }), error: b => { g({ error: C(b) }), e.abortSignal.removeEventListener("abort", v); }, complete: () => { c || g({ error: new a(991, !1) }), e.abortSignal.removeEventListener("abort", v); } }), r && n.unsubscribe(), c ? i : u; } })); }
export { W as outputFromObservable, z as outputToObservable, H as pendingUntilEvent, J as rxResource, E as takeUntilDestroyed, B as toObservable, G as toSignal };
/*! Bundled license information:

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v22.1.0
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
