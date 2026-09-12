import { c as s, d, e as f } from "@nf-internal/chunk-KTNUIOPA";
import { k as a } from "@nf-internal/chunk-NG3GO5GG";
import { a as l } from "@nf-internal/chunk-J5343RMQ";
var A = (m, h) => { let e, r, u = (t, n, c) => { if (typeof document > "u")
    return; let o = document.elementFromPoint(t, n); if (!o || !h(o) || o.disabled) {
    i();
    return;
} o !== e && (i(), p(o, c)); }, p = (t, n) => { e = t, r || (r = e); let c = e; a(() => c.classList.add("ion-activated")), n(); }, i = (t = !1) => { if (!e)
    return; let n = e; a(() => n.classList.remove("ion-activated")), t && r !== e && e.click(), e = void 0; }; return l({ el: m, gestureName: "buttonActiveDrag", threshold: 0, onStart: t => u(t.currentX, t.currentY, s), onMove: t => u(t.currentX, t.currentY, d), onEnd: () => { i(!0), f(), r = void 0; } }); };
export { A as a };
/*! Bundled license information:

@ionic/core/dist/esm/button-active-CXXy0FIE.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
