import { c as g } from "@nf-internal/chunk-IQO3VMP7";
var R = g({ "./ion-icon.entry.js": () => import("@nf-internal/ion-icon.entry-WH6NNF3W") });
var A = { hotModuleReplacement: !1, hydratedSelectorName: "hydrated", lazyLoad: !0, propChangeCallback: !0, state: !0, updatable: !0 };
function b(t, e, n) { let s = typeof HTMLElement < "u" ? HTMLElement.prototype : null; for (; t && t !== s;) {
    let o = Object.getOwnPropertyDescriptor(t, e);
    if (o && (!n || o.get))
        return o;
    t = Object.getPrototypeOf(t);
} }
var z = (t, e) => { var n; let s = e.$cmpMeta$; Object.entries((n = s.$members$) != null ? n : {}).map(([r, [$]]) => { if ($ & 31 || $ & 32) {
    let i = t[r], c = b(Object.getPrototypeOf(t), r, !0) || Object.getOwnPropertyDescriptor(t, r);
    c && Object.defineProperty(t, r, { get() { return c.get.call(this); }, set(a) { c.set.call(this, a); }, configurable: !0, enumerable: !0 }), e.$instanceValues$.has(r) ? t[r] = e.$instanceValues$.get(r) : i !== void 0 && (t[r] = i);
} }); }, w = t => { if (t.__stencil__getHostRef)
    return t.__stencil__getHostRef(); }, C = (t, e) => { e && (t.__stencil__getHostRef = () => e, e.$lazyInstance$ = t, e.$cmpMeta$.$flags$ & 512 && A.state && z(t, e)); };
var x = typeof window < "u" ? window : {}, y = { $flags$: 0, $resourcesUrl$: "", jmp: t => t(), raf: t => requestAnimationFrame(t), ael: (t, e, n, s) => t.addEventListener(e, n, s), rel: (t, e, n, s) => t.removeEventListener(e, n, s), ce: (t, e) => new CustomEvent(t, e) };
var S = t => { let e = new URL(t, y.$resourcesUrl$); return e.origin !== x.location.origin ? e.href : e.pathname; }, H = t => y.$resourcesUrl$ = t;
var L = t => (t = typeof t, t === "object" || t === "function"), D = (t, e, ...n) => { typeof t == "string" && (t = t); let s = null, o = null, r = !1, $ = !1, i = [], c = l => { for (let f = 0; f < l.length; f++)
    s = l[f], Array.isArray(s) ? c(s) : s != null && typeof s != "boolean" && ((r = typeof t != "function" && !L(s)) && (s = String(s)), r && $ ? i[i.length - 1].$text$ += s : i.push(r ? v(null, s) : s), $ = r); }; if (c(n), e) {
    e.key && (o = e.key);
    {
        let l = e.className || e.class;
        l && (e.class = typeof l != "object" ? l : Object.keys(l).filter(f => l[f]).join(" "));
    }
} let a = v(t, null); return a.$attrs$ = e, i.length > 0 && (a.$children$ = i), a.$key$ = o, a; }, v = (t, e) => { let n = { $flags$: 0, $tag$: t, $text$: e ?? null, $elm$: null, $children$: null }; return n.$attrs$ = null, n.$key$ = null, n; }, B = {};
var W = t => { var e; return (e = w(t)) == null ? void 0 : e.$hostElement$; };
var I = "Capture", q = new RegExp(I + "$");
var d, k = () => { if (typeof window > "u")
    return new Map; if (!d) {
    let t = window;
    t.Ionicons = t.Ionicons || {}, d = t.Ionicons.map = t.Ionicons.map || new Map;
} return d; }, Z = t => { Object.keys(t).forEach(e => { E(e, t[e]); let n = e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z0-9])/g, "$1-$2").toLowerCase(); e !== n && E(n, t[e]); }); }, E = (t, e) => { let n = k(), s = n.get(t); s === void 0 ? n.set(t, e) : s !== e && console.warn(`[Ionicons Warning]: Multiple icons were mapped to name "${t}". Ensure that multiple icons are not mapped to the same icon name.`); }, K = t => { let e = p(t.src); return e || (e = P(t.name, t.icon, t.mode, t.ios, t.md), e ? T(e, t) : t.icon && (e = p(t.icon), e || (e = p(t.icon[t.mode]), e)) ? e : null); }, T = (t, e) => { let n = k().get(t); if (n)
    return n; try {
    return S(`svg/${t}.svg`);
}
catch (s) {
    console.log("e", s), console.warn(`[Ionicons Warning]: Could not load icon with name "${t}". Ensure that the icon is registered using addIcons or that the icon SVG data is passed directly to the icon component.`, e);
} }, P = (t, e, n, s, o) => (n = (n && u(n)) === "ios" ? "ios" : "md", s && n === "ios" ? t = u(s) : o && n === "md" ? t = u(o) : (!t && e && !_(e) && (t = e), h(t) && (t = u(t))), !h(t) || t.trim() === "" || t.replace(/[a-z]|-|\d/gi, "") !== "" ? null : t), p = t => h(t) && (t = t.trim(), _(t)) ? t : null, _ = t => t.length > 0 && /(\/|\.)/.test(t), h = t => typeof t == "string", u = t => t.toLowerCase(), Y = (t, e = []) => { let n = {}; return e.forEach(s => { t.hasAttribute(s) && (t.getAttribute(s) !== null && (n[s] = t.getAttribute(s)), t.removeAttribute(s)); }), n; }, Q = t => t && t.dir !== "" ? t.dir.toLowerCase() === "rtl" : document?.dir.toLowerCase() === "rtl";
export { Z as a, K as b, P as c, h as d, Y as e, Q as f, C as g, H as h, D as i, B as j, W as k };
