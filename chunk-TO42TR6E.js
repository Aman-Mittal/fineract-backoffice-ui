import { c as y } from "@nf-internal/chunk-IQO3VMP7";
var M = y({ "./ion-icon.entry.js": () => import("@nf-internal/ion-icon.entry-X2ZZ3FZT") });
var I = Object.defineProperty, P = (t, e) => { for (var n in e)
    I(t, n, { get: e[n], enumerable: !0 }); }, b = t => { if (t.__stencil__getHostRef)
    return t.__stencil__getHostRef(); }, G = (t, e) => { t.__stencil__getHostRef = () => e, e.$lazyInstance$ = t; };
var L = typeof window < "u" ? window : {}, E = { $flags$: 0, $resourcesUrl$: "", jmp: t => t(), raf: t => requestAnimationFrame(t), ael: (t, e, n, s) => t.addEventListener(e, n, s), rel: (t, e, n, s) => t.removeEventListener(e, n, s), ce: (t, e) => new CustomEvent(t, e) };
var k = t => { let e = new URL(t, E.$resourcesUrl$); return e.origin !== L.location.origin ? e.href : e.pathname; }, X = t => E.$resourcesUrl$ = t, T = t => (t = typeof t, t === "object" || t === "function");
var z = t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), j = {};
P(j, { err: () => w, map: () => O, ok: () => f, unwrap: () => U, unwrapErr: () => H });
var f = t => ({ isOk: !0, isErr: !1, value: t }), w = t => ({ isOk: !1, isErr: !0, value: t });
function O(t, e) { if (t.isOk) {
    let n = e(t.value);
    return n instanceof Promise ? n.then(s => f(s)) : f(n);
} if (t.isErr) {
    let n = t.value;
    return w(n);
} throw "should never get here"; }
var U = t => { if (t.isOk)
    return t.value; throw t.value; }, H = t => { if (t.isErr)
    return t.value; throw t.value; };
var K = (t, e, ...n) => { let s = null, o = null, i = !1, g = !1, l = [], v = r => { for (let a = 0; a < r.length; a++)
    s = r[a], Array.isArray(s) ? v(s) : s != null && typeof s != "boolean" && ((i = typeof t != "function" && !T(s)) && (s = String(s)), i && g ? l[l.length - 1].$text$ += s : l.push(i ? S(null, s) : s), g = i); }; if (v(n), e) {
    e.key && (o = e.key);
    {
        let r = e.className || e.class;
        r && (e.class = typeof r != "object" ? r : Object.keys(r).filter(a => r[a]).join(" "));
    }
} let c = S(t, null); return c.$attrs$ = e, l.length > 0 && (c.$children$ = l), c.$key$ = o, c; }, S = (t, e) => { let n = { $flags$: 0, $tag$: t, $text$: e, $elm$: null, $children$: null }; return n.$attrs$ = null, n.$key$ = null, n; }, Y = {};
var u = t => { let e = z(t); return new RegExp(`(^|[^@]|@(?!supports\\s+selector\\s*\\([^{]*?${e}))(${e}\\b)`, "g"); };
u("::slotted");
u(":host");
u(":host-context");
var Z = t => b(t).$hostElement$;
var R = "Capture", F = new RegExp(R + "$");
var d, x = () => { if (typeof window > "u")
    return new Map; if (!d) {
    let t = window;
    t.Ionicons = t.Ionicons || {}, d = t.Ionicons.map = t.Ionicons.map || new Map;
} return d; }, N = t => { Object.keys(t).forEach(e => { _(e, t[e]); let n = e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z0-9])/g, "$1-$2").toLowerCase(); e !== n && _(n, t[e]); }); }, _ = (t, e) => { let n = x(), s = n.get(t); s === void 0 ? n.set(t, e) : s !== e && console.warn(`[Ionicons Warning]: Multiple icons were mapped to name "${t}". Ensure that multiple icons are not mapped to the same icon name.`); }, tt = t => { let e = p(t.src); return e || (e = B(t.name, t.icon, t.mode, t.ios, t.md), e ? C(e, t) : t.icon && (e = p(t.icon), e || (e = p(t.icon[t.mode]), e)) ? e : null); }, C = (t, e) => { let n = x().get(t); if (n)
    return n; try {
    return k(`svg/${t}.svg`);
}
catch (s) {
    console.log("e", s), console.warn(`[Ionicons Warning]: Could not load icon with name "${t}". Ensure that the icon is registered using addIcons or that the icon SVG data is passed directly to the icon component.`, e);
} }, B = (t, e, n, s, o) => (n = (n && $(n)) === "ios" ? "ios" : "md", s && n === "ios" ? t = $(s) : o && n === "md" ? t = $(o) : (!t && e && !A(e) && (t = e), h(t) && (t = $(t))), !h(t) || t.trim() === "" || t.replace(/[a-z]|-|\d/gi, "") !== "" ? null : t), p = t => h(t) && (t = t.trim(), A(t)) ? t : null, A = t => t.length > 0 && /(\/|\.)/.test(t), h = t => typeof t == "string", $ = t => t.toLowerCase(), et = (t, e = []) => { let n = {}; return e.forEach(s => { t.hasAttribute(s) && (t.getAttribute(s) !== null && (n[s] = t.getAttribute(s)), t.removeAttribute(s)); }), n; }, nt = t => t && t.dir !== "" ? t.dir.toLowerCase() === "rtl" : document?.dir.toLowerCase() === "rtl";
export { N as a, tt as b, B as c, h as d, et as e, nt as f, G as g, X as h, K as i, Y as j, Z as k };
