import { f as r, g as i } from "@nf-internal/chunk-NFBH7NN2";
import { b as s } from "@nf-internal/chunk-WQ3B42TK";
import { j as a, k as c } from "@nf-internal/chunk-M37FMPZ3";
import { e as n } from "@nf-internal/chunk-JHI3MBHO";
var h = () => { let e = window; e.addEventListener("statusTap", () => { a(() => { let m = e.innerWidth, d = e.innerHeight, o = document.elementFromPoint(m / 2, d / 2); if (!o)
    return; let t = r(o); t && new Promise(l => s(t, l)).then(() => { c(() => n(null, null, function* () { t.style.setProperty("--overflow", "hidden"), yield i(t, 300), t.style.removeProperty("--overflow"); })); }); }); }); };
export { h as startStatusTap };
/*! Bundled license information:

@ionic/core/dist/esm/status-tap-Kan2W7sh.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
