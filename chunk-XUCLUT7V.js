import { a as fe, b as E, f as he } from "@nf-internal/chunk-3V5PQWON";
import { F as on, G as sn, H as ge, I as pe, J as an, K as un, a as D, b as w, c as nn, s as le, w as tn, y as rn } from "@nf-internal/chunk-LBEDJUZW";
import { a as Z, b as W, e as de } from "@nf-internal/chunk-IQO3VMP7";
import { setActiveConsumer as S } from "@angular/core/primitives/signals";
import { isNotFound as vt } from "@angular/core/primitives/di";
import { BehaviorSubject as yt, Observable as Dt, Subject as It, Subscription as Et } from "rxjs";
var ve = class {
    full;
    major;
    minor;
    patch;
    constructor(n) { this.full = n; let t = n.split("."); this.major = t[0], this.minor = t[1], this.patch = t.slice(2).join("."); }
}, cn = new ve("22.1.0"), Tt = (() => { let e = cn.full; return `https://${e.includes("-next") || e.includes("-rc") || e === "0.0.0-PLACEHOLDER" ? "next" : `v${cn.major}`}.angular.dev`; })(), mo = `${Tt}/errors`, vo = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss", h = class extends Error {
    code;
    constructor(n, t) { super(je(n, t)), this.code = n; }
};
function wt(e) { return `NG0${Math.abs(e)}`; }
function je(e, n) { return `${wt(e)}${n ? ": " + n : ""}`; }
function l(e) { for (let n in e)
    if (e[n] === l)
        return n; throw Error(""); }
function yo(e, n) { for (let t in n)
    n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]); }
function Nt(e) {
    if (typeof e == "string")
        return e;
    if (Array.isArray(e))
        return `[${e.map(Nt).join(", ")}]`;
    if (e == null)
        return "" + e;
    let n = e.overriddenName || e.name;
    if (n)
        return `${n}`;
    let t = e.toString();
    if (t == null)
        return "" + t;
    let r = t.indexOf(`
`);
    return r >= 0 ? t.slice(0, r) : t;
}
function Do(e, n) { return e ? n ? `${e} ${n}` : e : n || ""; }
function Io(e, n = 100) { if (!e || n < 1 || e.length <= n)
    return e; if (n == 1)
    return e.substring(0, 1) + "..."; let t = Math.round(n / 2); return e.substring(0, t) + "..." + e.substring(e.length - t); }
var Mt = l({ __forward_ref__: l });
function Nn(e) { return e.__forward_ref__ = Nn, e; }
function I(e) { return bt(e) ? e() : e; }
function bt(e) { return typeof e == "function" && e.hasOwnProperty(Mt) && e.__forward_ref__ === Nn; }
function _t(e, n, t) { e != n && U(t, e, n, "=="); }
function Mn(e, n) { e == null && U(n, e, null, "!="); }
function U(e, n, t, r) { throw new Error(`ASSERTION ERROR: ${e}` + (r == null ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`)); }
function j(e) { return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 }; }
function Eo(e) { return { providers: e.providers || [], imports: e.imports || [] }; }
function re(e) { return Ct(e, bn); }
function To(e) { return re(e) !== null; }
function Ct(e, n) { return e.hasOwnProperty(n) && e[n] || null; }
function xt(e) { let n = e?.[bn] ?? null; return n || null; }
function dn(e) { return e && e.hasOwnProperty(ln) ? e[ln] : null; }
var bn = l({ \u0275prov: l }), ln = l({ \u0275inj: l }), g = class {
    _desc;
    ngMetadataName = "InjectionToken";
    \u0275prov;
    constructor(n, t) { this._desc = n, this.\u0275prov = void 0, typeof t == "number" ? this.__NG_ELEMENT_ID__ = t : t !== void 0 && (this.\u0275prov = j({ token: this, providedIn: t.providedIn || "root", factory: t.factory })); }
    get multi() { return this; }
    toString() { return `InjectionToken ${this._desc}`; }
}, fn;
function wo(e) { U("setInjectorProfilerContext should never be called in production mode"); let n = fn; return fn = e, n; }
function _n(e) { return e && !!e.\u0275providers; }
var Rt = l({ \u0275cmp: l }), St = l({ \u0275dir: l }), Ft = l({ \u0275pipe: l }), kt = l({ \u0275mod: l }), hn = l({ \u0275fac: l }), No = l({ __NG_ELEMENT_ID__: l }), gn = l({ __NG_ENV_ID__: l });
function Ot(e) { return oe(e, "@NgModule"), e[kt] || null; }
function Mo(e) { let n = Ot(e); if (!n)
    throw new h(915, !1); return n; }
function Cn(e) { return oe(e, "@Component"), e[Rt] || null; }
function Pt(e) { return oe(e, "@Directive"), e[St] || null; }
function jt(e) { return oe(e, "@Pipe"), e[Ft] || null; }
function oe(e, n) { if (e == null)
    throw new h(-919, !1); }
function bo(e) { let n = Cn(e) || Pt(e) || jt(e); return n !== null && n.standalone; }
function Lt(e) { return typeof e == "string" ? e : e == null ? "" : String(e); }
function _o(e) { return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : Lt(e); }
var xn = l({ ngErrorCode: l }), At = l({ ngErrorMessage: l }), Vt = l({ ngTokenPath: l });
function $t(e, n) { return Rn("", -200, n); }
function Ht(e, n) { throw new h(-201, !1); }
function Rn(e, n, t) { let r = new h(n, e); return r[xn] = n, r[At] = e, t && (r[Vt] = t), r; }
function qt(e) { return e[xn]; }
var ye;
function Sn() { return ye; }
function M(e) { let n = ye; return ye = e, n; }
function Gt(e, n, t) { let r = re(e); if (r && r.providedIn == "root")
    return r.value === void 0 ? r.value = r.factory() : r.value; if (t & 8)
    return null; if (n !== void 0)
    return n; Ht(e, ""); }
var Co = globalThis;
var Ut = {}, C = Ut, De = "__NG_DI_FLAG__", Ie = class {
    injector;
    constructor(n) { this.injector = n; }
    retrieve(n, t) { let r = J(t) || 0; try {
        return this.injector.get(n, r & 8 ? null : C, r);
    }
    catch (o) {
        if (he(o))
            return o;
        throw o;
    } }
};
function Bt(e, n = 0) { let t = fe(); if (t === void 0)
    throw new h(-203, !1); if (t === null)
    return Gt(e, void 0, n); {
    let r = Zt(n), o = t.retrieve(e, r);
    if (he(o)) {
        if (r.optional)
            return null;
        throw o;
    }
    return o;
} }
function O(e, n = 0) { return (Sn() || Bt)(I(e), n); }
function xo(e) { throw new h(202, !1); }
function p(e, n) { return O(e, J(n)); }
function J(e) { return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4); }
function Zt(e) { return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) }; }
function Ee(e) { let n = []; for (let t = 0; t < e.length; t++) {
    let r = I(e[t]);
    if (Array.isArray(r)) {
        if (r.length === 0)
            throw new h(900, !1);
        let o, i = 0;
        for (let s = 0; s < r.length; s++) {
            let c = r[s], u = Wt(c);
            typeof u == "number" ? u === -1 ? o = c.token : i |= u : o = c;
        }
        n.push(O(o, i));
    }
    else
        n.push(O(r));
} return n; }
function Ro(e, n) { return e[De] = n, e.prototype[De] = n, e; }
function Wt(e) { return e[De]; }
function K(e, n) { let t = e.hasOwnProperty(hn); return t ? e[hn] : null; }
function So(e, n, t) { if (e.length !== n.length)
    return !1; for (let r = 0; r < e.length; r++) {
    let o = e[r], i = n[r];
    if (t && (o = t(o), i = t(i)), i !== o)
        return !1;
} return !0; }
function Fo(e) { return e.flat(Number.POSITIVE_INFINITY); }
function Le(e, n) { e.forEach(t => Array.isArray(t) ? Le(t, n) : n(t)); }
function ko(e, n, t) { n >= e.length ? e.push(t) : e.splice(n, 0, t); }
function Oo(e, n) { return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0]; }
function Po(e, n) { let t = []; for (let r = 0; r < e; r++)
    t.push(n); return t; }
function jo(e, n, t) { let r = e.length - t; for (; n < r;)
    e[n] = e[n + t], n++; for (; t--;)
    e.pop(); }
function Yt(e, n, t, r) { let o = e.length; if (o == n)
    e.push(t, r);
else if (o === 1)
    e.push(r, e[0]), e[0] = t;
else {
    for (o--, e.push(e[o - 1], e[o]); o > n;) {
        let i = o - 2;
        e[o] = e[i], o--;
    }
    e[n] = t, e[n + 1] = r;
} }
function Lo(e, n, t) { let r = Fn(e, n); return r >= 0 ? e[r | 1] = t : (r = ~r, Yt(e, r, n, t)), r; }
function Ao(e, n) { let t = Fn(e, n); if (t >= 0)
    return e[t | 1]; }
function Fn(e, n) { return Jt(e, n, 1); }
function Jt(e, n, t) { let r = 0, o = e.length >> t; for (; o !== r;) {
    let i = r + (o - r >> 1), s = e[i << t];
    if (n === s)
        return i << t;
    s > n ? o = i : r = i + 1;
} return ~(o << t); }
var Vo = {}, Q = [], ie = new g(""), kn = new g("", -1), On = new g(""), X = class {
    get(n, t = C) { if (t === C) {
        let o = Rn("", -201);
        throw o.name = "\u0275NotFound", o;
    } return t; }
};
function Pn(e) { return { \u0275providers: e }; }
function Kt(e) { return Pn([{ provide: ie, multi: !0, useValue: e }]); }
function Qt(...e) { return { \u0275providers: Xt(!0, e), \u0275fromNgModule: !0 }; }
function Xt(e, ...n) { let t = [], r = new Set, o, i = s => { t.push(s); }; return Le(n, s => { let c = s; Te(c, i, [], r) && (o ||= [], o.push(c)); }), o !== void 0 && jn(o, i), t; }
function jn(e, n) { for (let t = 0; t < e.length; t++) {
    let { ngModule: r, providers: o } = e[t];
    Ae(o, i => { n(i, r); });
} }
function Te(e, n, t, r) { if (e = I(e), !e)
    return !1; let o = null, i = dn(e), s = !i && Cn(e); if (!i && !s) {
    let u = e.ngModule;
    if (i = dn(u), i)
        o = u;
    else
        return !1;
}
else {
    if (s && !s.standalone)
        return !1;
    o = e;
} let c = r.has(o); if (s) {
    if (c)
        return !1;
    if (r.add(o), s.dependencies) {
        let u = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
        for (let d of u)
            Te(d, n, t, r);
    }
}
else if (i) {
    if (i.imports != null && !c) {
        r.add(o);
        let d;
        Le(i.imports, f => { Te(f, n, t, r) && (d ||= [], d.push(f)); }), d !== void 0 && jn(d, n);
    }
    if (!c) {
        let d = K(o) || (() => new o);
        n({ provide: o, useFactory: d, deps: Q }, o), n({ provide: On, useValue: o, multi: !0 }, o), n({ provide: ie, useValue: () => O(o), multi: !0 }, o);
    }
    let u = i.providers;
    if (u != null && !c) {
        let d = e;
        Ae(u, f => { n(f, d); });
    }
}
else
    return !1; return o !== e && e.providers !== void 0; }
function Ae(e, n) { for (let t of e)
    _n(t) && (t = t.\u0275providers), Array.isArray(t) ? Ae(t, n) : n(t); }
var zt = l({ provide: String, useValue: l });
function Ln(e) { return e !== null && typeof e == "object" && zt in e; }
function er(e) { return !!(e && e.useExisting); }
function nr(e) { return !!(e && e.useFactory); }
function we(e) { return typeof e == "function"; }
function $o(e) { return !!e.useClass; }
var tr = new g(""), Y = {}, pn = {}, me;
function An() { return me === void 0 && (me = new X), me; }
var q = class {
}, z = class extends q {
    parent;
    source;
    scopes;
    records = new Map;
    _ngOnDestroyHooks = new Set;
    _onDestroyHooks = [];
    get destroyed() { return this._destroyed; }
    _destroyed = !1;
    injectorDefTypes;
    constructor(n, t, r, o) { super(), this.parent = t, this.source = r, this.scopes = o, Me(n, s => this.processProvider(s)), this.records.set(kn, F(void 0, this)), o.has("environment") && this.records.set(q, F(void 0, this)); let i = this.records.get(tr); i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(On, Q, { self: !0 })); }
    retrieve(n, t) { let r = J(t) || 0; try {
        return this.get(n, C, r);
    }
    catch (o) {
        if (vt(o))
            return o;
        throw o;
    } }
    destroy() { $(this), this._destroyed = !0; let n = S(null); try {
        for (let r of this._ngOnDestroyHooks)
            r.ngOnDestroy();
        let t = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of t)
            r();
    }
    finally {
        this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), S(n);
    } }
    onDestroy(n) { return $(this), this._onDestroyHooks.push(n), () => this.removeOnDestroy(n); }
    runInContext(n) { $(this); let t = E(this), r = M(void 0), o; try {
        return n();
    }
    finally {
        E(t), M(r);
    } }
    get(n, t = C, r) { if ($(this), n.hasOwnProperty(gn))
        return n[gn](this); let o = J(r), i, s = E(this), c = M(void 0); try {
        if (!(o & 4)) {
            let d = this.records.get(n);
            if (d === void 0) {
                let f = ur(n) && re(n);
                f && this.injectableDefInScope(f) ? d = F(Ne(n), Y) : d = null, this.records.set(n, d);
            }
            if (d != null)
                return this.hydrate(n, d, o);
        }
        let u = o & 2 ? An() : this.parent;
        return t = o & 8 && t === C ? null : t, u.get(n, t);
    }
    catch (u) {
        let d = qt(u);
        throw d === -200 || d === -201 ? new h(d, null) : u;
    }
    finally {
        M(c), E(s);
    } }
    resolveInjectorInitializers() { let n = S(null), t = E(this), r = M(void 0), o; try {
        let i = this.get(ie, Q, { self: !0 });
        for (let s of i)
            s();
    }
    finally {
        E(t), M(r), S(n);
    } }
    toString() { return "R3Injector[...]"; }
    processProvider(n) { n = I(n); let t = we(n) ? n : I(n && n.provide), r = or(n); if (!we(n) && n.multi === !0) {
        let o = this.records.get(t);
        o || (o = F(void 0, Y, !0), o.factory = () => Ee(o.multi), this.records.set(t, o)), t = n, o.multi.push(n);
    } this.records.set(t, r); }
    hydrate(n, t, r) { let o = S(null); try {
        if (t.value === pn)
            throw $t("");
        return t.value === Y && (t.value = pn, t.value = t.factory(void 0, r)), typeof t.value == "object" && t.value && ar(t.value) && this._ngOnDestroyHooks.add(t.value), t.value;
    }
    finally {
        S(o);
    } }
    injectableDefInScope(n) { if (!n.providedIn)
        return !1; let t = I(n.providedIn); return typeof t == "string" ? t === "any" || this.scopes.has(t) : this.injectorDefTypes.has(t); }
    removeOnDestroy(n) { let t = this._onDestroyHooks.indexOf(n); t !== -1 && this._onDestroyHooks.splice(t, 1); }
};
function Ne(e) { let n = re(e), t = n !== null ? n.factory : K(e); if (t !== null)
    return t; if (e instanceof g)
    throw new h(-204, !1); if (e instanceof Function)
    return rr(e); throw new h(-204, !1); }
function rr(e) { if (e.length > 0)
    throw new h(-204, !1); let t = xt(e); return t !== null ? () => t.factory(e) : () => new e; }
function or(e) { if (Ln(e))
    return F(void 0, e.useValue); {
    let n = ir(e);
    return F(n, Y);
} }
function ir(e, n, t) { let r; if (we(e)) {
    let o = I(e);
    return K(o) || Ne(o);
}
else if (Ln(e))
    r = () => I(e.useValue);
else if (nr(e))
    r = () => e.useFactory(...Ee(e.deps || []));
else if (er(e))
    r = (o, i) => O(I(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
else {
    let o = I(e && (e.useClass || e.provide));
    if (sr(e))
        r = () => new o(...Ee(e.deps));
    else
        return K(o) || Ne(o);
} return r; }
function $(e) { if (e.destroyed)
    throw new h(-205, !1); }
function F(e, n, t = !1) { return { factory: e, value: n, multi: t ? [] : void 0 }; }
function sr(e) { return !!e.deps; }
function ar(e) { return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"; }
function ur(e) { return typeof e == "function" || typeof e == "object" && e.ngMetadataName === "InjectionToken"; }
function Me(e, n) { for (let t of e)
    Array.isArray(t) ? Me(t, n) : t && _n(t) ? Me(t.\u0275providers, n) : n(t); }
function Ho(e, n) { let t; e instanceof z ? ($(e), t = e) : t = new Ie(e); let r, o = E(t), i = M(void 0); try {
    return n();
}
finally {
    E(o), M(i);
} }
function Vn() { return Sn() !== void 0 || fe() != null; }
function qo(e) { if (!Vn())
    throw new h(-203, !1); }
var Ve = 0, $e = 1, m = 2, be = 3, Go = 4, cr = 5, Uo = 6, dr = 7, $n = 8, Bo = 9, Hn = 10, Zo = 11, Wo = 12, Yo = 13, qn = 14, Jo = 15, Ko = 16, lr = 17, Qo = 18, Xo = 19, zo = 20, k = 21, ei = 22, _e = 23, fr = 24, ni = 25, ti = 26, hr = 27, He = 1, ri = 6, oi = 7, ii = 8, si = 9, ai = 10;
function Gn(e) { return Array.isArray(e) && typeof e[He] == "object"; }
function Un(e) { return Array.isArray(e) && e[He] === !0; }
function ui(e) { return (e.flags & 4) !== 0; }
function ci(e) { return e.componentOffset > -1; }
function di(e) { return (e.flags & 1) === 1; }
function li(e) { return !!e.template; }
function fi(e) { return (e[m] & 512) !== 0; }
function hi(e) { return (e.type & 16) === 16; }
function gi(e) { return (e[m] & 32) === 32; }
function Bn(e) { return (e[m] & 256) === 256; }
function pi(e, n) { gr(e, n[$e]); }
function gr(e, n) { pr(e); let t = n.data; for (let r = hr; r < t.length; r++)
    if (t[r] === e)
        return; U("This TNode does not belong to this TView."); }
function pr(e) { Mn(e, "TNode must be defined"), e && typeof e == "object" && e.hasOwnProperty("directiveStylingLast") || U("Not of type TNode, got: " + e); }
function mi(e) { Mn(e, "LView must be defined"), _t(Gn(e), !0, "Expecting LView"); }
var y = (function (e) { return e[e.NONE = 0] = "NONE", e[e.HTML = 1] = "HTML", e[e.STYLE = 2] = "STYLE", e[e.SCRIPT = 3] = "SCRIPT", e[e.URL = 4] = "URL", e[e.RESOURCE_URL = 5] = "RESOURCE_URL", e[e.ATTRIBUTE_NO_BINDING = 6] = "ATTRIBUTE_NO_BINDING", e; })(y || {}), H, Ce = "svg", Zn = "math", Wn = "", mn = "*", xe = () => Object.create(null);
function mr() { return H || (H = xe(), N(y.HTML, void 0, [["iframe", ["srcdoc"]], ["*", ["innerHTML", "outerHTML"]]]), N(y.STYLE, void 0, [["*", ["style"]]]), N(y.URL, void 0, [["*", ["formAction"]], ["area", ["href"]], ["a", ["href", "xlink:href"]], ["form", ["action"]], ["img", ["src"]], ["video", ["src"]]]), N(y.URL, Zn, [["*", ["href", "xlink:href"]]]), N(y.RESOURCE_URL, void 0, [["base", ["href"]], ["embed", ["src"]], ["frame", ["src"]], ["iframe", ["src"]], ["link", ["href"]], ["object", ["codebase", "data"]]]), N(y.URL, Ce, [["a", ["href", "xlink:href"]]]), N(y.ATTRIBUTE_NO_BINDING, Ce, [["animate", ["attributeName", "values", "to", "from"]], ["set", ["to", "attributeName"]], ["animateMotion", ["attributeName"]], ["animateTransform", ["attributeName"]]]), N(y.ATTRIBUTE_NO_BINDING, void 0, [["unknown", ["attributeName", "values", "to", "from", "sandbox", "allow", "allowFullscreen", "referrerPolicy", "csp", "fetchPriority", "credentialless"]], ["iframe", ["sandbox", "allow", "allowFullscreen", "referrerPolicy", "csp", "fetchPriority", "credentialless"]]]), H); }
function N(e, n, t) { let r = n ?? Wn; for (let [o, i] of t) {
    let s = o.toLowerCase();
    for (let c of i) {
        let u = c.toLowerCase(), d = H[u] ??= xe(), f = d[r] ??= xe();
        f[s] = e;
    }
} }
function vi(e, n, t) { let o = mr()[n.toLowerCase()]; if (!o)
    return y.NONE; let i = e.toLowerCase(), s; if (t) {
    let c = o[t];
    c && (s = c[i] ?? c[mn]);
} if (s === void 0) {
    let c = o[Wn];
    c && (s = c[i] ?? c[mn]);
} return s ?? y.NONE; }
function qe(e) { for (; Array.isArray(e);)
    e = e[Ve]; return e; }
function yi(e) { for (; Array.isArray(e);) {
    if (typeof e[He] == "object")
        return e;
    e = e[Ve];
} return null; }
function Di(e, n) { return qe(n[e]); }
function Ii(e, n) { return qe(n[e.index]); }
function Ei(e, n) { let t = e === null ? -1 : e.index; return t !== -1 ? qe(n[t]) : null; }
function vr(e, n) { return e.data[n]; }
function Ti(e, n) { return e[n]; }
function wi(e, n, t, r) { t >= e.data.length && (e.data[t] = null, e.blueprint[t] = null), n[t] = r; }
function Ni(e, n) { let t = n[e]; return Gn(t) ? t : t[Ve]; }
function Mi(e) { return (e[m] & 4) === 4; }
function Yn(e) { return (e[m] & 128) === 128; }
function bi(e) { return Un(e[be]); }
function _i(e, n) { return n == null ? null : e[n]; }
function Ci(e) { e[lr] = 0; }
function xi(e) { e[m] & 1024 || (e[m] |= 1024, Yn(e) && Ge(e)); }
function yr(e, n) { for (; e > 0;)
    n = n[qn], e--; return n; }
function Dr(e) { return !!(e[m] & 9216 || e[fr]?.dirty); }
function Ri(e) { e[Hn].changeDetectionScheduler?.notify(8), e[m] & 64 && (e[m] |= 1024), Dr(e) && Ge(e); }
function Ge(e) { e[Hn].changeDetectionScheduler?.notify(0); let n = vn(e); for (; n !== null && !(n[m] & 8192 || (n[m] |= 8192, !Yn(n)));)
    n = vn(n); }
function Ir(e, n) { if (Bn(e))
    throw new h(911, !1); e[k] === null && (e[k] = []), e[k].push(n); }
function Er(e, n) { if (e[k] === null)
    return; let t = e[k].indexOf(n); t !== -1 && e[k].splice(t, 1); }
function vn(e) { let n = e[be]; return Un(n) ? n[be] : n; }
function Tr(e) { return e[dr] ??= []; }
function wr(e) { return e.cleanup ??= []; }
function Si(e, n, t, r) { let o = Tr(n); o.push(t), e.firstCreatePass && wr(e).push(r, o.length - 1); }
var a = { lFrame: Qn(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var Re = !1;
function Fi() { return a.lFrame.elementDepthCount; }
function ki() { a.lFrame.elementDepthCount++; }
function Oi() { a.lFrame.elementDepthCount--; }
function Pi() { return a.bindingsEnabled; }
function ji() { return a.skipHydrationRootTNode !== null; }
function Li(e) { return a.skipHydrationRootTNode === e; }
function Ai() { a.bindingsEnabled = !0; }
function Vi(e) { a.skipHydrationRootTNode = e; }
function $i() { a.bindingsEnabled = !1; }
function Hi() { a.skipHydrationRootTNode = null; }
function Jn() { return a.lFrame.lView; }
function qi() { return a.lFrame.tView; }
function Gi(e) { return a.lFrame.contextLView = e, e[$n]; }
function Ui(e) { return a.lFrame.contextLView = null, e; }
function Nr() { let e = Mr(); for (; e !== null && e.type === 64;)
    e = e.parent; return e; }
function Mr() { return a.lFrame.currentTNode; }
function Bi() { let e = a.lFrame, n = e.currentTNode; return e.isParent ? n : n.parent; }
function Zi(e, n) { let t = a.lFrame; t.currentTNode = e, t.isParent = n; }
function Wi() { return a.lFrame.isParent; }
function Yi() { a.lFrame.isParent = !1; }
function Ji() { return a.lFrame.contextLView; }
function Ki() { return Re; }
function yn(e) { let n = Re; return Re = e, n; }
function Qi() { let e = a.lFrame, n = e.bindingRootIndex; return n === -1 && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n; }
function Xi() { return a.lFrame.bindingIndex; }
function zi(e) { return a.lFrame.bindingIndex = e; }
function es() { return a.lFrame.bindingIndex++; }
function ns(e) { let n = a.lFrame, t = n.bindingIndex; return n.bindingIndex = n.bindingIndex + e, t; }
function ts() { return a.lFrame.inI18n; }
function rs(e) { a.lFrame.inI18n = e; }
function os(e, n) { let t = a.lFrame; t.bindingIndex = t.bindingRootIndex = e, br(n); }
function is() { return a.lFrame.currentDirectiveIndex; }
function br(e) { a.lFrame.currentDirectiveIndex = e; }
function ss(e) { let n = a.lFrame.currentDirectiveIndex; return n === -1 ? null : e[n]; }
function as() { return a.lFrame.currentQueryIndex; }
function us(e) { a.lFrame.currentQueryIndex = e; }
function _r(e) { let n = e[$e]; return n.type === 2 ? n.declTNode : n.type === 1 ? e[cr] : null; }
function cs(e, n, t) { if (t & 4) {
    let o = n, i = e;
    for (; o = o.parent, o === null && !(t & 1);)
        if (o = _r(i), o === null || (i = i[qn], o.type & 10))
            break;
    if (o === null)
        return !1;
    n = o, e = i;
} let r = a.lFrame = Kn(); return r.currentTNode = n, r.lView = e, !0; }
function ds(e) { let n = Kn(), t = e[$e]; a.lFrame = n, n.currentTNode = t.firstChild, n.lView = e, n.tView = t, n.contextLView = e, n.bindingIndex = t.bindingStartIndex, n.inI18n = !1; }
function Kn() { let e = a.lFrame, n = e === null ? null : e.child; return n === null ? Qn(e) : n; }
function Qn(e) { let n = { currentTNode: null, isParent: !0, lView: null, tView: null, selectedIndex: -1, contextLView: null, elementDepthCount: 0, currentNamespace: null, currentDirectiveIndex: -1, bindingRootIndex: -1, bindingIndex: -1, currentQueryIndex: 0, parent: e, child: null, inI18n: !1 }; return e !== null && (e.child = n), n; }
function Xn() { let e = a.lFrame; return a.lFrame = e.parent, e.currentTNode = null, e.lView = null, e; }
var ls = Xn;
function fs() { let e = Xn(); e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0; }
function hs(e) { return (a.lFrame.contextLView = yr(e, a.lFrame.contextLView))[$n]; }
function gs() { return a.lFrame.selectedIndex; }
function ps(e) { a.lFrame.selectedIndex = e; }
function ms() { let e = a.lFrame; return vr(e.tView, e.selectedIndex); }
function vs() { a.lFrame.currentNamespace = Ce; }
function ys() { a.lFrame.currentNamespace = Zn; }
function Ds() { Cr(); }
function Cr() { a.lFrame.currentNamespace = null; }
function Is() { return a.lFrame.currentNamespace; }
var zn = !0;
function Es() { return zn; }
function Ts(e) { zn = e; }
function ws() { let e, n; return { promise: new Promise((r, o) => { e = r, n = o; }), resolve: e, reject: n }; }
function Dn(e, n = null, t = null, r) { let o = xr(e, n, t, r); return o.resolveInjectorInitializers(), o; }
function xr(e, n = null, t = null, r, o = new Set) { let i = [t || Q, Qt(e)], s; return new z(i, n || An(), s || null, o); }
var Rr = new Set;
function Ns() { return Rr; }
var G = class e {
    static THROW_IF_NOT_FOUND = C;
    static NULL = new X;
    static create(n, t) { if (Array.isArray(n))
        return Dn({ name: "" }, t, n, ""); {
        let r = n.name ?? "";
        return Dn({ name: r }, n.parent, n.providers, r);
    } }
    static \u0275prov = j({ token: e, providedIn: "any", factory: () => O(kn) });
    static __NG_ELEMENT_ID__ = -1;
}, Ue = new g(""), T = class {
    static __NG_ELEMENT_ID__ = Sr;
    static __NG_ENV_ID__ = n => n;
}, ee = class extends T {
    _lView;
    constructor(n) { super(), this._lView = n; }
    get destroyed() { return Bn(this._lView); }
    onDestroy(n) { let t = this._lView; return Ir(t, n), () => Er(t, n); }
};
function Sr() { return new ee(Jn()); }
var Fr = !1, kr = new g(""), et = (() => { class e {
    taskId = 0;
    pendingTasks = new Set;
    destroyed = !1;
    pendingTask = new yt(!1);
    debugTaskTracker = p(kr, { optional: !0 });
    get hasPendingTasks() { return this.destroyed ? !1 : this.pendingTask.value; }
    get hasPendingTasksObservable() { return this.destroyed ? new Dt(t => { t.next(!1), t.complete(); }) : this.pendingTask; }
    add() { !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0); let t = this.taskId++; return this.pendingTasks.add(t), this.debugTaskTracker?.add(t), t; }
    has(t) { return this.pendingTasks.has(t); }
    remove(t) { this.pendingTasks.delete(t), this.debugTaskTracker?.remove(t), this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1); }
    ngOnDestroy() { this.pendingTasks.clear(), this.hasPendingTasks && this.pendingTask.next(!1), this.destroyed = !0, this.pendingTask.unsubscribe(); }
    static \u0275prov = j({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), Se = class extends It {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(n = !1) { super(), this.__isAsync = n, Vn() && (this.destroyRef = p(T, { optional: !0 }) ?? void 0, this.pendingTasks = p(et, { optional: !0 }) ?? void 0); }
    emit(n) { let t = w(null); try {
        super.next(n);
    }
    finally {
        w(t);
    } }
    subscribe(n, t, r) { let o = n, i = t || (() => null), s = r; if (n && typeof n == "object") {
        let u = n;
        o = u.next?.bind(u), i = u.error?.bind(u), s = u.complete?.bind(u);
    } this.__isAsync && (i = this.wrapInTimeout(i), o && (o = this.wrapInTimeout(o)), s && (s = this.wrapInTimeout(s))); let c = super.subscribe({ next: o, error: i, complete: s }); return n instanceof Et && n.add(c), c; }
    wrapInTimeout(n) { return t => { let r = this.pendingTasks?.add(); setTimeout(() => { try {
        n(t);
    }
    finally {
        r !== void 0 && this.pendingTasks?.remove(r);
    } }); }; }
}, b = Se;
function ne(...e) { }
function Or(e) { let n, t; function r() { e = ne; try {
    t !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(t), n !== void 0 && clearTimeout(n);
}
catch { } } return n = setTimeout(() => { e(), r(); }), typeof requestAnimationFrame == "function" && (t = requestAnimationFrame(() => { e(), r(); })), () => r(); }
function Ms(e) { return queueMicrotask(() => e()), () => { e = ne; }; }
var Be = "isAngularZone", In = Be + "_ID", Pr = 0, Fe = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new b(!1);
    onMicrotaskEmpty = new b(!1);
    onStable = new b(!1);
    onError = new b(!1);
    constructor(n) { let { enableLongStackTrace: t = !1, shouldCoalesceEventChangeDetection: r = !1, shouldCoalesceRunChangeDetection: o = !1, scheduleInRootZone: i = Fr } = n; if (typeof Zone > "u")
        throw new h(908, !1); Zone.assertZonePatched(); let s = this; s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)), t && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !o && r, s.shouldCoalesceRunChangeDetection = o, s.callbackScheduled = !1, s.scheduleInRootZone = i, Ar(s); }
    static isInAngularZone() { return typeof Zone < "u" && Zone.current.get(Be) === !0; }
    static assertInAngularZone() { if (!e.isInAngularZone())
        throw new h(909, !1); }
    static assertNotInAngularZone() { if (e.isInAngularZone())
        throw new h(909, !1); }
    run(n, t, r) { return this._inner.run(n, t, r); }
    runTask(n, t, r, o) { let i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + o, n, jr, ne, ne); try {
        return i.runTask(s, t, r);
    }
    finally {
        i.cancelTask(s);
    } }
    runGuarded(n, t, r) { return this._inner.runGuarded(n, t, r); }
    runOutsideAngular(n) { return this._outer.run(n); }
}, jr = {};
function Ze(e) { if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
        e._nesting++, e.onMicrotaskEmpty.emit(null);
    }
    finally {
        if (e._nesting--, !e.hasPendingMicrotasks)
            try {
                e.runOutsideAngular(() => e.onStable.emit(null));
            }
            finally {
                e.isStable = !0;
            }
    } }
function Lr(e) { if (e.isCheckStableRunning || e.callbackScheduled)
    return; e.callbackScheduled = !0; function n() { Or(() => { e.callbackScheduled = !1, ke(e), e.isCheckStableRunning = !0, Ze(e), e.isCheckStableRunning = !1; }); } e.scheduleInRootZone ? Zone.root.run(() => { n(); }) : e._outer.run(() => { n(); }), ke(e); }
function Ar(e) { let n = () => { Lr(e); }, t = Pr++; e._inner = e._inner.fork({ name: "angular", properties: { [Be]: !0, [In]: t, [In + t]: !0 }, onInvokeTask: (r, o, i, s, c, u) => { if (Vr(u))
        return r.invokeTask(i, s, c, u); try {
        return En(e), r.invokeTask(i, s, c, u);
    }
    finally {
        (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && n(), Tn(e);
    } }, onInvoke: (r, o, i, s, c, u, d) => { try {
        return En(e), r.invoke(i, s, c, u, d);
    }
    finally {
        e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !$r(u) && n(), Tn(e);
    } }, onHasTask: (r, o, i, s) => { r.hasTask(i, s), o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, ke(e), Ze(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask)); }, onHandleError: (r, o, i, s) => (r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1) }); }
function ke(e) { e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1; }
function En(e) { e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null)); }
function Tn(e) { e._nesting--, Ze(e); }
var wn = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new b;
    onMicrotaskEmpty = new b;
    onStable = new b;
    onError = new b;
    run(n, t, r) { return n.apply(t, r); }
    runGuarded(n, t, r) { return n.apply(t, r); }
    runOutsideAngular(n) { return n(); }
    runTask(n, t, r, o) { return n.apply(t, r); }
};
function Vr(e) { return nt(e, "__ignore_ng_zone__"); }
function $r(e) { return nt(e, "__scheduler_tick__"); }
function nt(e, n) { return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[n] === !0; }
var P = class {
    _console = console;
    handleError(n) { this._console.error("ERROR", n); }
}, tt = new g("", { factory: () => { let e = p(Fe), n = p(q), t; return r => { e.runOutsideAngular(() => { n.destroyed && !t ? setTimeout(() => { throw r; }) : (t ??= n.get(P), t.handleError(r)); }); }; } }), bs = { provide: ie, useValue: () => { let e = p(P, { optional: !0 }); }, multi: !0 }, Hr = new g("", { factory: () => { if (typeof ngServerMode < "u" && ngServerMode)
        return; let e = p(Ue).defaultView; if (!e)
        return; let n = p(tt), t = i => { n(i.reason), i.preventDefault(); }, r = i => { i.error ? n(i.error) : n(new Error(i.message, { cause: i })), i.preventDefault(); }, o = () => { e.addEventListener("unhandledrejection", t), e.addEventListener("error", r); }; typeof Zone < "u" ? Zone.root.run(o) : o(), p(T).onDestroy(() => { e.removeEventListener("error", r), e.removeEventListener("unhandledrejection", t); }); } });
function _s() { return Pn([Kt(() => { p(Hr); })]); }
function Cs(e) { return null; }
function x(e, n) { let [t, r, o] = rn(e, n?.equal), i = t, s = i[D]; return i.set = r, i.update = o, i.asReadonly = se.bind(i), i; }
function se() { let e = this[D]; if (e.readonlyFn === void 0) {
    let n = () => this();
    n[D] = e, e.readonlyFn = n;
} return e.readonlyFn; }
var qr = new g("", { factory: () => Gr }), Gr = "ng";
var xs = new g(""), Rs = new g("", { providedIn: "platform", factory: () => "unknown" }), Ss = new g(""), Fs = new g("", { factory: () => p(Ue).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null }), Ur = { breakpoints: [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840], placeholderResolution: 30, disableImageSizeWarning: !1, disableImageLazyLoadWarning: !1 }, ks = new g("", { factory: () => Ur });
function Os(e) { return e; }
var rt = (() => { class e {
    static \u0275prov = j({ token: e, providedIn: "root", factory: () => { let t = new e; return (typeof ngServerMode > "u" || !ngServerMode) && (t.store = Br(p(Ue), p(qr))), t; } });
    store = {};
    onSerializeCallbacks = {};
    get(t, r) { return this.store[t] !== void 0 ? this.store[t] : r; }
    set(t, r) { this.store[t] = r; }
    remove(t) { delete this.store[t]; }
    hasKey(t) { return this.store.hasOwnProperty(t); }
    get isEmpty() { return Object.keys(this.store).length === 0; }
    onSerialize(t, r) { this.onSerializeCallbacks[t] = r; }
    toJson() { for (let t in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(t))
            try {
                this.store[t] = this.onSerializeCallbacks[t]();
            }
            catch (r) {
                console.warn("Exception in onSerialize callback: ", r);
            } return JSON.stringify(this.store).replace(/</g, "\\u003C").replace(/\//g, "\\u002F"); }
} return e; })();
function Br(e, n) { let t = e.getElementById(n + "-state"); if (t?.tagName === "SCRIPT" && t.textContent)
    try {
        return JSON.parse(t.textContent);
    }
    catch (r) {
        console.warn("Exception while restoring TransferState for app " + n, r);
    } return {}; }
function Ps(e, n) { if (nn() !== null)
    throw new h(-602, !1); }
var ot = (() => { class e {
    view;
    node;
    constructor(t, r) { this.view = t, this.node = r; }
    static __NG_ELEMENT_ID__ = Zr;
} return e; })();
function Zr() { return new ot(Jn(), Nr()); }
var te = class {
}, js = new g("", { factory: () => !0 }), Ls = new g("", { factory: () => !1 }), As = new g(""), Wr = (() => { class e {
    static \u0275prov = j({ token: e, providedIn: "root", factory: () => new Oe });
} return e; })(), Oe = class {
    dirtyEffectCount = 0;
    queues = new Map;
    add(n) { this.enqueue(n), this.schedule(n); }
    schedule(n) { n.dirty && this.dirtyEffectCount++; }
    remove(n) { let t = n.zone, r = this.queues.get(t); r.has(n) && (r.delete(n), n.dirty && this.dirtyEffectCount--); }
    enqueue(n) { let t = n.zone; this.queues.has(t) || this.queues.set(t, new Set); let r = this.queues.get(t); r.has(n) || r.add(n); }
    flush() { for (; this.dirtyEffectCount > 0;) {
        let n = !1;
        for (let [t, r] of this.queues)
            t === null ? n ||= this.flushQueue(r) : n ||= t.run(() => this.flushQueue(r));
        n || (this.dirtyEffectCount = 0);
    } }
    flushQueue(n) { let t = !1; for (let r of n)
        r.dirty && (this.dirtyEffectCount--, t = !0, r.run()); return t; }
}, Pe = class {
    [D];
    constructor(n) { this[D] = n; }
    destroy() { this[D].destroy(); }
};
function it(e, n) { let t = n?.injector ?? p(G), r = n?.manualCleanup !== !0 ? t.get(T) : null, o, i = t.get(ot, null, { optional: !0 }), s = t.get(te); return i !== null ? (o = Kr(i.view, s, e), r instanceof ee && r._lView === i.view && (r = null)) : o = Qr(e, t.get(Wr), s), o.injector = t, r !== null && (o.onDestroyFns = [r.onDestroy(() => o.destroy())]), new Pe(o); }
var st = W(Z({}, on), { cleanupFns: void 0, zone: null, onDestroyFns: null, run() { let e = yn(!1); try {
        sn(this);
    }
    finally {
        yn(e);
    } }, cleanup() { if (!this.cleanupFns?.length)
        return; let e = w(null); try {
        for (; this.cleanupFns.length;)
            this.cleanupFns.pop()();
    }
    finally {
        this.cleanupFns = [], w(e);
    } } }), Yr = W(Z({}, st), { consumerMarkedDirty() { this.scheduler.schedule(this), this.notifier.notify(12); }, destroy() { if (le(this), this.onDestroyFns !== null)
        for (let e of this.onDestroyFns)
            e(); this.cleanup(), this.scheduler.remove(this); } }), Jr = W(Z({}, st), { consumerMarkedDirty() { this.view[m] |= 8192, Ge(this.view), this.notifier.notify(13); }, destroy() { if (le(this), this.onDestroyFns !== null)
        for (let e of this.onDestroyFns)
            e(); this.cleanup(), this.view[_e]?.delete(this); } });
function Kr(e, n, t) { let r = Object.create(Jr); return r.view = e, r.zone = typeof Zone < "u" ? Zone.current : null, r.notifier = n, r.fn = at(r, t), e[_e] ??= new Set, e[_e].add(r), r.consumerMarkedDirty(r), r; }
function Qr(e, n, t) { let r = Object.create(Yr); return r.fn = at(r, e), r.scheduler = n, r.notifier = t, r.zone = typeof Zone < "u" ? Zone.current : null, r.scheduler.add(r), r.notifier.notify(12), r; }
function at(e, n) { return () => { n(t => (e.cleanupFns ??= []).push(t)); }; }
function We(e) { return typeof e == "function" && e[D] !== void 0; }
function Vs(e) { return We(e) && typeof e.set == "function"; }
var ut = (() => { class e {
    internalPendingTasks = p(et);
    scheduler = p(te);
    errorHandler = p(tt);
    add() { let t = this.internalPendingTasks.add(); return () => { this.internalPendingTasks.has(t) && (this.scheduler.notify(11), this.internalPendingTasks.remove(t)); }; }
    run(t) { let r = this.add(); try {
        t().catch(this.errorHandler).finally(r);
    }
    catch (o) {
        this.errorHandler(o), r();
    } }
    static \u0275prov = j({ token: e, providedIn: "root", factory: () => new e });
} return e; })();
var ct = class {
    destroyed = !1;
    listeners = null;
    errorHandler = p(P, { optional: !0 });
    isEmitting = !1;
    hasNullListeners = !1;
    destroyRef = p(T);
    constructor() { this.destroyRef.onDestroy(() => { this.destroyed = !0, this.listeners = null; }); }
    subscribe(n) { if (this.destroyed)
        throw new h(953, !1); return (this.listeners ??= []).push(n), { unsubscribe: () => { let t = this.listeners ? this.listeners.indexOf(n) : -1; t > -1 && (this.isEmitting ? (this.hasNullListeners = !0, this.listeners[t] = null) : this.listeners.splice(t, 1)); } }; }
    emit(n) { if (this.destroyed) {
        console.warn(je(953, !1));
        return;
    } if (this.listeners === null)
        return; this.isEmitting = !0; let t = w(null); try {
        for (let r of this.listeners)
            try {
                r !== null && r(n);
            }
            catch (o) {
                this.errorHandler?.handleError(o);
            }
    }
    finally {
        this.hasNullListeners && (this.hasNullListeners = !1, this.listeners && Xr(this.listeners)), w(t), this.isEmitting = !1;
    } }
};
function Xr(e) { let n = e.length - 1; for (; n > -1;)
    e[n] === null && e.splice(n, 1), n--; }
function Zs(e) { return e.destroyRef; }
var zr = new g("");
function R(e, n) { return tn(e, n?.equal); }
function v(e) { return un(e); }
var Ye = class extends Error {
    dependency;
    constructor(n) { super("Dependency error", { cause: n.error() }), this.name = "ResourceDependencyError", this.dependency = n; }
}, L = class e extends Error {
    _brand;
    constructor(n) { super(n); }
    static IDLE = new e("IDLE");
    static LOADING = new e("LOADING");
}, eo = e => e;
function dt(e, n) { if (typeof e == "function") {
    let t = ge(e, eo, n?.equal);
    return lt(t, n?.debugName, n?.set);
}
else {
    let t = ge(e.source, e.computation, e.equal);
    return lt(t, e.debugName, e.set);
} }
function lt(e, n, t) { let r = e[D], o = e; if (t !== void 0) {
    let i = s => pe(r, s);
    o.set = s => t(s, i), o.update = s => t(s(v(e)), i);
}
else
    o.set = i => pe(r, i), o.update = i => an(r, i); return o.asReadonly = se.bind(e), o; }
function Ws(e) { let n = e.request, t = e.params ?? n ?? (() => null); return new Ke(t, to(e), e.defaultValue, e.equal ? no(e.equal) : void 0, e.debugName, e.injector ?? p(G), e.id); }
var Je = class {
    value;
    isLoading;
    constructor(n, t) { this.value = n, this.value.set = this.set.bind(this), this.value.update = this.update.bind(this), this.value.asReadonly = se, this.isLoading = R(() => this.status() === "loading" || this.status() === "reloading", void 0); }
    isError = R(() => this.status() === "error");
    update(n) { this.set(n(v(this.value))); }
    isValueDefined = R(() => this.isError() ? !1 : this.value() !== void 0);
    _snapshot;
    get snapshot() { return this._snapshot ??= R(() => { let n = this.status(); return n === "error" ? { status: "error", error: this.error() } : { status: n, value: this.value() }; }); }
    hasValue() { return this.isValueDefined(); }
    asReadonly() { return this; }
}, Ke = class extends Je {
    loaderFn;
    equal;
    debugName;
    transferCacheKey;
    pendingTasks;
    state;
    extRequest;
    effectRef;
    pendingController;
    resolvePendingTask = void 0;
    destroyed = !1;
    unregisterOnDestroy;
    status;
    error;
    transferState;
    constructor(n, t, r, o, i, s, c, u) { if (ao())
        throw uo(); super(R(() => { let f = this.state().stream?.(); if (!f || this.state().status === "loading" && this.error())
        return r; if (!ae(f))
        throw new Xe(this.error()); return f.value; }, { equal: o }), i), this.loaderFn = t, this.equal = o, this.debugName = i, this.transferCacheKey = c; let d = s.get(zr, void 0, { optional: !0 }) ?? { isActive: !1 }; this.transferState = s.get(rt, void 0, { optional: !0 }) ?? void 0, this.extRequest = dt(() => { try {
        return gt(!0), { request: n(so), reload: 0 };
    }
    catch (f) {
        return pt(f), f === L.IDLE ? { status: "idle", reload: 0 } : f === L.LOADING ? { status: "loading", reload: 0 } : { error: f, reload: 0 };
    }
    finally {
        gt(!1);
    } }, void 0), this.state = dt({ source: this.extRequest, computation: (f, A) => { let { request: B, status: V, error: en } = f, _; if (en)
            V = "resolved", _ = x({ error: Qe(en) }, void 0);
        else if (!V)
            if (A)
                V = B === void 0 ? "idle" : "loading", A.value.extRequest.request === B && (_ = A.value.stream);
            else {
                let ue = this.transferState, ce = this.transferCacheKey;
                d.isActive && ce && ue && B !== void 0 && ue.hasKey(ce) && (_ = x({ value: ue.get(ce, r) }, void 0)), _ || (_ = u?.(f.request)), u = void 0, V = B === void 0 ? "idle" : _ ? "resolved" : "loading";
            } return { extRequest: f, status: V, previousStatus: A ? ht(A.value) : "idle", stream: _ }; } }), this.effectRef = it(this.loadEffect.bind(this), { injector: s, manualCleanup: !0 }), this.pendingTasks = s.get(ut), this.unregisterOnDestroy = s.get(T).onDestroy(() => this.destroy()), this.status = R(() => ht(this.state()), void 0), this.error = R(() => { let f = this.state().stream?.(); return f && !ae(f) ? f.error : void 0; }, void 0); }
    set(n) { if (this.destroyed)
        return; let t = v(this.error), r = v(this.state); if (!t) {
        let o = v(this.value);
        if (r.status === "local" && (this.equal ? this.equal(o, n) : o === n))
            return;
    } this.state.set({ extRequest: r.extRequest, status: "local", previousStatus: "local", stream: x({ value: n }, void 0) }), this.abortInProgressLoad(); }
    reload() { let { status: n } = v(this.state); return n === "idle" || n === "loading" ? !1 : (this.extRequest.update(({ request: t, reload: r }) => ({ request: t, reload: r + 1 })), !0); }
    destroy() { this.destroyed = !0, this.unregisterOnDestroy(), this.effectRef.destroy(), this.abortInProgressLoad(), this.state.set({ extRequest: { request: void 0, reload: 0 }, status: "idle", previousStatus: "idle", stream: void 0 }); }
    loadEffect() { return de(this, null, function* () { let n = this.extRequest(), { status: t, previousStatus: r } = v(this.state); if (n.request === void 0)
        return; if (t !== "loading")
        return; this.abortInProgressLoad(); let o = this.resolvePendingTask = this.pendingTasks.add(), { signal: i } = this.pendingController = new AbortController; try {
        let s = v(() => this.loaderFn({ params: n.request, abortSignal: i, previous: { status: r } })), c = () => i.aborted || v(this.extRequest) !== n;
        if (We(s)) {
            if (c())
                return;
            this.state.set({ extRequest: n, status: "resolved", previousStatus: "resolved", stream: s });
            let u = v(s);
            typeof ngServerMode < "u" && ngServerMode && ft(u, this.transferCacheKey, this.transferState);
        }
        else {
            let u = yield s;
            if (c())
                return;
            this.state.set({ extRequest: n, status: "resolved", previousStatus: "resolved", stream: u });
            let d = u ? v(u) : void 0;
            typeof ngServerMode < "u" && ngServerMode && ft(d, this.transferCacheKey, this.transferState);
        }
    }
    catch (s) {
        if (pt(s), i.aborted || v(this.extRequest) !== n)
            return;
        this.state.set({ extRequest: n, status: "resolved", previousStatus: "error", stream: x({ error: Qe(s) }, void 0) });
    }
    finally {
        o?.(), o = void 0;
    } }); }
    abortInProgressLoad() { v(() => this.pendingController?.abort()), this.pendingController = void 0, this.resolvePendingTask?.(), this.resolvePendingTask = void 0; }
};
function ft(e, n, t) { n && t && e && ae(e) && t.set(n, e.value); }
function no(e) { return (n, t) => n === void 0 || t === void 0 ? n === t : e(n, t); }
function to(e) { return ro(e) ? e.stream : n => de(null, null, function* () { try {
    return x({ value: yield e.loader(n) }, void 0);
}
catch (t) {
    return x({ error: Qe(t) }, void 0);
} }); }
function ro(e) { return !!e.stream; }
function ht(e) { switch (e.status) {
    case "loading": return e.extRequest.reload === 0 ? "loading" : "reloading";
    case "resolved": return ae(e.stream()) ? "resolved" : "error";
    default: return e.status;
} }
function ae(e) { return e.error === void 0; }
function Qe(e) { return oo(e) ? e : new ze(e); }
function oo(e) { return e instanceof Error || typeof e == "object" && typeof e.name == "string" && typeof e.message == "string"; }
var Xe = class extends Error {
    constructor(n) { super(n.message, { cause: n }); }
}, ze = class extends Error {
    constructor(n) { super(String(n), { cause: n }); }
};
function io(e) { switch (e.status()) {
    case "idle": throw L.IDLE;
    case "error": throw new Ye(e);
    case "loading":
    case "reloading": throw L.LOADING;
} return e.value(); }
var so = { chain: io }, mt = !1;
function ao() { return mt; }
function gt(e) { mt = e; }
function uo() { return new h(992, !1); }
function pt(e) { if (e instanceof h && e.code === 992)
    throw e; }
export { ve as a, cn as b, Tt as c, vo as d, h as e, je as f, l as g, yo as h, Nt as i, Do as j, Io as k, Nn as l, I as m, bt as n, _t as o, U as p, j as q, Eo as r, re as s, To as t, dn as u, bn as v, ln as w, g as x, wo as y, _n as z, Rt as A, St as B, Ft as C, kt as D, hn as E, No as F, Ot as G, Mo as H, Cn as I, Pt as J, jt as K, bo as L, Lt as M, _o as N, $t as O, Ht as P, M as Q, Gt as R, Co as S, O as T, xo as U, p as V, J as W, Ro as X, K as Y, So as Z, Fo as _, Le as $, ko as aa, Oo as ba, Po as ca, jo as da, Yt as ea, Lo as fa, Ao as ga, Fn as ha, Vo as ia, Q as ja, ie as ka, kn as la, On as ma, X as na, Pn as oa, Kt as pa, Qt as qa, Xt as ra, Te as sa, we as ta, $o as ua, tr as va, An as wa, q as xa, z as ya, ir as za, Ho as Aa, Vn as Ba, qo as Ca, Ve as Da, $e as Ea, m as Fa, be as Ga, Go as Ha, cr as Ia, Uo as Ja, dr as Ka, $n as La, Bo as Ma, Hn as Na, Zo as Oa, Wo as Pa, Yo as Qa, qn as Ra, Jo as Sa, Ko as Ta, lr as Ua, Qo as Va, Xo as Wa, zo as Xa, k as Ya, ei as Za, _e as _a, fr as $a, ni as ab, ti as bb, hr as cb, ri as db, oi as eb, ii as fb, si as gb, ai as hb, Gn as ib, Un as jb, ui as kb, ci as lb, di as mb, li as nb, fi as ob, hi as pb, gi as qb, Bn as rb, pi as sb, pr as tb, mi as ub, y as vb, Ce as wb, Zn as xb, vi as yb, qe as zb, yi as Ab, Di as Bb, Ii as Cb, Ei as Db, vr as Eb, Ti as Fb, wi as Gb, Ni as Hb, Mi as Ib, Yn as Jb, bi as Kb, _i as Lb, Ci as Mb, xi as Nb, yr as Ob, Dr as Pb, Ri as Qb, Ge as Rb, Ir as Sb, Er as Tb, vn as Ub, Tr as Vb, wr as Wb, Si as Xb, Fi as Yb, ki as Zb, Oi as _b, Pi as $b, ji as ac, Li as bc, Ai as cc, Vi as dc, $i as ec, Hi as fc, Jn as gc, qi as hc, Gi as ic, Ui as jc, Nr as kc, Mr as lc, Bi as mc, Zi as nc, Wi as oc, Yi as pc, Ji as qc, Ki as rc, yn as sc, Qi as tc, Xi as uc, zi as vc, es as wc, ns as xc, ts as yc, rs as zc, os as Ac, is as Bc, br as Cc, ss as Dc, as as Ec, us as Fc, cs as Gc, ds as Hc, ls as Ic, fs as Jc, hs as Kc, gs as Lc, ps as Mc, ms as Nc, vs as Oc, ys as Pc, Ds as Qc, Is as Rc, Es as Sc, Ts as Tc, ws as Uc, Dn as Vc, xr as Wc, Ns as Xc, G as Yc, Ue as Zc, T as _c, Fr as $c, kr as ad, et as bd, b as cd, Or as dd, Ms as ed, In as fd, Fe as gd, wn as hd, P as id, tt as jd, bs as kd, _s as ld, Cs as md, x as nd, se as od, qr as pd, xs as qd, Rs as rd, Ss as sd, Fs as td, Ur as ud, ks as vd, Os as wd, rt as xd, Br as yd, Ps as zd, ot as Ad, te as Bd, js as Cd, Ls as Dd, As as Ed, Wr as Fd, Pe as Gd, it as Hd, We as Id, Vs as Jd, ut as Kd, ct as Ld, Zs as Md, zr as Nd, R as Od, v as Pd, Ye as Qd, L as Rd, dt as Sd, Ws as Td, Ke as Ud, Qe as Vd, Xe as Wd, io as Xd, ao as Yd, gt as Zd, uo as _d, pt as $d };
/*! Bundled license information:

@angular/core/fesm2022/_pending_tasks-chunk.mjs:
@angular/core/fesm2022/_resource-chunk.mjs:
  (**
   * @license Angular v22.1.0
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
