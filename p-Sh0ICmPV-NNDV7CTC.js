import { a as l } from "@nf-internal/chunk-YCZWIBUX";
import { m as h } from "@nf-internal/chunk-6V6Z65ZI";
import { c as p } from "@nf-internal/chunk-3IHVGUEN";
import "@nf-internal/chunk-CQE4ZXWS";
import "@nf-internal/chunk-JHI3MBHO";
var W = (o, X, w, g, v) => { let s = o.ownerDocument.defaultView, n = l(o), m = t => n ? -t.deltaX : t.deltaX; return p({ el: o, gestureName: "goback-swipe", gesturePriority: 101, threshold: 10, canStart: t => (n = l(o), (e => { let { startX: r } = e; return n ? r >= s.innerWidth - 50 : r <= 50; })(t) && X()), onStart: w, onMove: t => { let e = m(t); g(e / s.innerWidth); }, onEnd: t => { let e = m(t), r = s.innerWidth, a = e / r, c = (i => n ? -i.velocityX : i.velocityX)(t), d = c >= 0 && (c > .2 || e > r / 2), u = (d ? 1 - a : a) * r, f = 0; if (u > 5) {
        let i = u / Math.abs(c);
        f = Math.min(i, 540);
    } v(d, a <= 0 ? .01 : h(0, a, .9999), f); } }); };
export { W as createSwipeBackGesture };
/*! Bundled license information:

@ionic/core/components/p-Sh0ICmPV.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
