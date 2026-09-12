import { c as i } from "@nf-internal/chunk-AFC3S5XK";
import { g as a } from "@nf-internal/chunk-OU2VS4HL";
import { e as c } from "@nf-internal/chunk-JHI3MBHO";
var l = "ion-content", t = ".ion-content-scroll-host", u = `${l}, ${t}`, o = e => e.tagName === "ION-CONTENT", h = e => c(null, null, function* () { return o(e) ? (yield new Promise((r => i(e, r))), e.getScrollElement()) : e; }), p = e => e.querySelector(t) || e.querySelector(u), v = e => e.closest(u), f = e => e.querySelector(t), P = e => { if (o(e))
    return e.querySelector("ion-refresher"); let r = e.closest(l); if (r === null)
    return null; let s = f(r); return s !== null && s.contains(e) ? r.querySelector("ion-refresher") : null; }, S = (e, r) => o(e) ? e.scrollToTop(r) : Promise.resolve(e.scrollTo({ top: 0, left: 0, behavior: "smooth" })), q = (e, r, s, n) => o(e) ? e.scrollByPoint(r, s, n) : Promise.resolve(e.scrollBy({ top: s, left: r, behavior: n > 0 ? "smooth" : "auto" })), T = e => a(e, l), w = e => { if (o(e)) {
    let r = e.scrollY;
    return e.scrollY = !1, r;
} return e.style.setProperty("overflow", "hidden"), !0; }, N = (e, r) => { o(e) ? e.scrollY = r : e.style.removeProperty("overflow"); };
export { l as a, t as b, o as c, h as d, p as e, v as f, f as g, P as h, S as i, q as j, T as k, w as l, N as m };
/*! Bundled license information:

@ionic/core/components/p-6J0vc7Z8.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
