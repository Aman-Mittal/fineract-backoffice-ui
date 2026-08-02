import { a as ce, b as I, f as de } from "@nf-internal/chunk-X4HXWS2T";
import { F as Xe, G as ze, H as le, I as en, J as nn, K as tn, a as y, b as E, c as Je, s as ue, w as Ke, y as Qe } from "@nf-internal/chunk-TBG2VGBV";
import { a as G, b as Z, e as ae } from "@nf-internal/chunk-IQO3VMP7";
import { setActiveConsumer as x } from "@angular/core/primitives/signals";
import { isNotFound as ct } from "@angular/core/primitives/di";
import { BehaviorSubject as dt, Observable as lt, Subject as ft, Subscription as gt } from "rxjs";
var ge = class {
    full;
    major;
    minor;
    patch;
    constructor(n) { this.full = n; let t = n.split("."); this.major = t[0], this.minor = t[1], this.patch = t.slice(2).join("."); }
}, rn = new ge("22.0.7"), ht = (() => { let e = rn.full; return `https://${e.includes("-next") || e.includes("-rc") || e === "0.0.0-PLACEHOLDER" ? "next" : `v${rn.major}`}.angular.dev`; })(), uo = `${ht}/errors`, co = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss", g = class extends Error {
    code;
    constructor(n, t) { super(Fe(n, t)), this.code = n; }
};
function pt(e) { return `NG0${Math.abs(e)}`; }
function Fe(e, n) { return `${pt(e)}${n ? ": " + n : ""}`; }
function c(e) { for (let n in e)
    if (e[n] === c)
        return n; throw Error(""); }
function lo(e, n) { for (let t in n)
    n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]); }
function mt(e) {
    if (typeof e == "string")
        return e;
    if (Array.isArray(e))
        return `[${e.map(mt).join(", ")}]`;
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
function fo(e, n) { return e ? n ? `${e} ${n}` : e : n || ""; }
function go(e, n = 100) { if (!e || n < 1 || e.length <= n)
    return e; if (n == 1)
    return e.substring(0, 1) + "..."; let t = Math.round(n / 2); return e.substring(0, t) + "..." + e.substring(e.length - t); }
var vt = c({ __forward_ref__: c });
function yn(e) { return e.__forward_ref__ = yn, e; }
function D(e) { return yt(e) ? e() : e; }
function yt(e) { return typeof e == "function" && e.hasOwnProperty(vt) && e.__forward_ref__ === yn; }
function Dt(e, n, t) { e != n && q(t, e, n, "=="); }
function Dn(e, n) { e == null && q(n, e, null, "!="); }
function q(e, n, t, r) { throw new Error(`ASSERTION ERROR: ${e}` + (r == null ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`)); }
function j(e) { return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 }; }
function ho(e) { return { providers: e.providers || [], imports: e.imports || [] }; }
function ee(e) { return It(e, In); }
function po(e) { return ee(e) !== null; }
function It(e, n) { return e.hasOwnProperty(n) && e[n] || null; }
function Et(e) { let n = e?.[In] ?? null; return n || null; }
function on(e) { return e && e.hasOwnProperty(sn) ? e[sn] : null; }
var In = c({ \u0275prov: c }), sn = c({ \u0275inj: c }), h = class {
    _desc;
    ngMetadataName = "InjectionToken";
    \u0275prov;
    constructor(n, t) { this._desc = n, this.\u0275prov = void 0, typeof t == "number" ? this.__NG_ELEMENT_ID__ = t : t !== void 0 && (this.\u0275prov = j({ token: this, providedIn: t.providedIn || "root", factory: t.factory })); }
    get multi() { return this; }
    toString() { return `InjectionToken ${this._desc}`; }
}, an;
function mo(e) { q("setInjectorProfilerContext should never be called in production mode"); let n = an; return an = e, n; }
function En(e) { return e && !!e.\u0275providers; }
var wt = c({ \u0275cmp: c }), Tt = c({ \u0275dir: c }), Mt = c({ \u0275pipe: c }), Nt = c({ \u0275mod: c }), un = c({ \u0275fac: c }), vo = c({ __NG_ELEMENT_ID__: c }), cn = c({ __NG_ENV_ID__: c });
function bt(e) { return ne(e, "@NgModule"), e[Nt] || null; }
function yo(e) { let n = bt(e); if (!n)
    throw new g(915, !1); return n; }
function wn(e) { return ne(e, "@Component"), e[wt] || null; }
function Ct(e) { return ne(e, "@Directive"), e[Tt] || null; }
function _t(e) { return ne(e, "@Pipe"), e[Mt] || null; }
function ne(e, n) { if (e == null)
    throw new g(-919, !1); }
function Do(e) { let n = wn(e) || Ct(e) || _t(e); return n !== null && n.standalone; }
function xt(e) { return typeof e == "string" ? e : e == null ? "" : String(e); }
function Io(e) { return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : xt(e); }
var Tn = c({ ngErrorCode: c }), Ft = c({ ngErrorMessage: c }), Rt = c({ ngTokenPath: c });
function St(e, n) { return Mn("", -200, n); }
function kt(e, n) { throw new g(-201, !1); }
function Mn(e, n, t) { let r = new g(n, e); return r[Tn] = n, r[Ft] = e, t && (r[Rt] = t), r; }
function jt(e) { return e[Tn]; }
var he;
function Nn() { return he; }
function w(e) { let n = he; return he = e, n; }
function Pt(e, n, t) { let r = ee(e); if (r && r.providedIn == "root")
    return r.value === void 0 ? r.value = r.factory() : r.value; if (t & 8)
    return null; if (n !== void 0)
    return n; kt(e, ""); }
var Eo = globalThis;
var Ot = {}, N = Ot, pe = "__NG_DI_FLAG__", me = class {
    injector;
    constructor(n) { this.injector = n; }
    retrieve(n, t) { let r = U(t) || 0; try {
        return this.injector.get(n, r & 8 ? null : N, r);
    }
    catch (o) {
        if (de(o))
            return o;
        throw o;
    } }
};
function At(e, n = 0) { let t = ce(); if (t === void 0)
    throw new g(-203, !1); if (t === null)
    return Pt(e, void 0, n); {
    let r = Lt(n), o = t.retrieve(e, r);
    if (de(o)) {
        if (r.optional)
            return null;
        throw o;
    }
    return o;
} }
function S(e, n = 0) { return (Nn() || At)(D(e), n); }
function wo(e) { throw new g(202, !1); }
function p(e, n) { return S(e, U(n)); }
function U(e) { return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4); }
function Lt(e) { return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) }; }
function ve(e) { let n = []; for (let t = 0; t < e.length; t++) {
    let r = D(e[t]);
    if (Array.isArray(r)) {
        if (r.length === 0)
            throw new g(900, !1);
        let o, i = 0;
        for (let s = 0; s < r.length; s++) {
            let d = r[s], u = Vt(d);
            typeof u == "number" ? u === -1 ? o = d.token : i |= u : o = d;
        }
        n.push(S(o, i));
    }
    else
        n.push(S(r));
} return n; }
function To(e, n) { return e[pe] = n, e.prototype[pe] = n, e; }
function Vt(e) { return e[pe]; }
function W(e, n) { let t = e.hasOwnProperty(un); return t ? e[un] : null; }
function Mo(e, n, t) { if (e.length !== n.length)
    return !1; for (let r = 0; r < e.length; r++) {
    let o = e[r], i = n[r];
    if (t && (o = t(o), i = t(i)), i !== o)
        return !1;
} return !0; }
function No(e) { return e.flat(Number.POSITIVE_INFINITY); }
function Re(e, n) { e.forEach(t => Array.isArray(t) ? Re(t, n) : n(t)); }
function bo(e, n, t) { n >= e.length ? e.push(t) : e.splice(n, 0, t); }
function Co(e, n) { return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0]; }
function _o(e, n) { let t = []; for (let r = 0; r < e; r++)
    t.push(n); return t; }
function xo(e, n, t) { let r = e.length - t; for (; n < r;)
    e[n] = e[n + t], n++; for (; t--;)
    e.pop(); }
function $t(e, n, t, r) { let o = e.length; if (o == n)
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
function Fo(e, n, t) { let r = bn(e, n); return r >= 0 ? e[r | 1] = t : (r = ~r, $t(e, r, n, t)), r; }
function Ro(e, n) { let t = bn(e, n); if (t >= 0)
    return e[t | 1]; }
function bn(e, n) { return qt(e, n, 1); }
function qt(e, n, t) { let r = 0, o = e.length >> t; for (; o !== r;) {
    let i = r + (o - r >> 1), s = e[i << t];
    if (n === s)
        return i << t;
    s > n ? o = i : r = i + 1;
} return ~(o << t); }
var So = {}, Y = [], te = new h(""), Cn = new h("", -1), _n = new h(""), J = class {
    get(n, t = N) { if (t === N) {
        let o = Mn("", -201);
        throw o.name = "\u0275NotFound", o;
    } return t; }
};
function xn(e) { return { \u0275providers: e }; }
function Ht(e) { return xn([{ provide: te, multi: !0, useValue: e }]); }
function Gt(...e) { return { \u0275providers: Zt(!0, e), \u0275fromNgModule: !0 }; }
function Zt(e, ...n) { let t = [], r = new Set, o, i = s => { t.push(s); }; return Re(n, s => { let d = s; ye(d, i, [], r) && (o ||= [], o.push(d)); }), o !== void 0 && Fn(o, i), t; }
function Fn(e, n) { for (let t = 0; t < e.length; t++) {
    let { ngModule: r, providers: o } = e[t];
    Se(o, i => { n(i, r); });
} }
function ye(e, n, t, r) { if (e = D(e), !e)
    return !1; let o = null, i = on(e), s = !i && wn(e); if (!i && !s) {
    let u = e.ngModule;
    if (i = on(u), i)
        o = u;
    else
        return !1;
}
else {
    if (s && !s.standalone)
        return !1;
    o = e;
} let d = r.has(o); if (s) {
    if (d)
        return !1;
    if (r.add(o), s.dependencies) {
        let u = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
        for (let l of u)
            ye(l, n, t, r);
    }
}
else if (i) {
    if (i.imports != null && !d) {
        r.add(o);
        let l;
        Re(i.imports, f => { ye(f, n, t, r) && (l ||= [], l.push(f)); }), l !== void 0 && Fn(l, n);
    }
    if (!d) {
        let l = W(o) || (() => new o);
        n({ provide: o, useFactory: l, deps: Y }, o), n({ provide: _n, useValue: o, multi: !0 }, o), n({ provide: te, useValue: () => S(o), multi: !0 }, o);
    }
    let u = i.providers;
    if (u != null && !d) {
        let l = e;
        Se(u, f => { n(f, l); });
    }
}
else
    return !1; return o !== e && e.providers !== void 0; }
function Se(e, n) { for (let t of e)
    En(t) && (t = t.\u0275providers), Array.isArray(t) ? Se(t, n) : n(t); }
var Bt = c({ provide: String, useValue: c });
function Rn(e) { return e !== null && typeof e == "object" && Bt in e; }
function Ut(e) { return !!(e && e.useExisting); }
function Wt(e) { return !!(e && e.useFactory); }
function De(e) { return typeof e == "function"; }
function ko(e) { return !!e.useClass; }
var Yt = new h(""), B = {}, dn = {}, fe;
function Sn() { return fe === void 0 && (fe = new J), fe; }
var V = class {
}, K = class extends V {
    parent;
    source;
    scopes;
    records = new Map;
    _ngOnDestroyHooks = new Set;
    _onDestroyHooks = [];
    get destroyed() { return this._destroyed; }
    _destroyed = !1;
    injectorDefTypes;
    constructor(n, t, r, o) { super(), this.parent = t, this.source = r, this.scopes = o, Ee(n, s => this.processProvider(s)), this.records.set(Cn, F(void 0, this)), o.has("environment") && this.records.set(V, F(void 0, this)); let i = this.records.get(Yt); i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(_n, Y, { self: !0 })); }
    retrieve(n, t) { let r = U(t) || 0; try {
        return this.get(n, N, r);
    }
    catch (o) {
        if (ct(o))
            return o;
        throw o;
    } }
    destroy() { L(this), this._destroyed = !0; let n = x(null); try {
        for (let r of this._ngOnDestroyHooks)
            r.ngOnDestroy();
        let t = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of t)
            r();
    }
    finally {
        this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), x(n);
    } }
    onDestroy(n) { return L(this), this._onDestroyHooks.push(n), () => this.removeOnDestroy(n); }
    runInContext(n) { L(this); let t = I(this), r = w(void 0), o; try {
        return n();
    }
    finally {
        I(t), w(r);
    } }
    get(n, t = N, r) { if (L(this), n.hasOwnProperty(cn))
        return n[cn](this); let o = U(r), i, s = I(this), d = w(void 0); try {
        if (!(o & 4)) {
            let l = this.records.get(n);
            if (l === void 0) {
                let f = er(n) && ee(n);
                f && this.injectableDefInScope(f) ? l = F(Ie(n), B) : l = null, this.records.set(n, l);
            }
            if (l != null)
                return this.hydrate(n, l, o);
        }
        let u = o & 2 ? Sn() : this.parent;
        return t = o & 8 && t === N ? null : t, u.get(n, t);
    }
    catch (u) {
        let l = jt(u);
        throw l === -200 || l === -201 ? new g(l, null) : u;
    }
    finally {
        w(d), I(s);
    } }
    resolveInjectorInitializers() { let n = x(null), t = I(this), r = w(void 0), o; try {
        let i = this.get(te, Y, { self: !0 });
        for (let s of i)
            s();
    }
    finally {
        I(t), w(r), x(n);
    } }
    toString() { return "R3Injector[...]"; }
    processProvider(n) { n = D(n); let t = De(n) ? n : D(n && n.provide), r = Kt(n); if (!De(n) && n.multi === !0) {
        let o = this.records.get(t);
        o || (o = F(void 0, B, !0), o.factory = () => ve(o.multi), this.records.set(t, o)), t = n, o.multi.push(n);
    } this.records.set(t, r); }
    hydrate(n, t, r) { let o = x(null); try {
        if (t.value === dn)
            throw St("");
        return t.value === B && (t.value = dn, t.value = t.factory(void 0, r)), typeof t.value == "object" && t.value && zt(t.value) && this._ngOnDestroyHooks.add(t.value), t.value;
    }
    finally {
        x(o);
    } }
    injectableDefInScope(n) { if (!n.providedIn)
        return !1; let t = D(n.providedIn); return typeof t == "string" ? t === "any" || this.scopes.has(t) : this.injectorDefTypes.has(t); }
    removeOnDestroy(n) { let t = this._onDestroyHooks.indexOf(n); t !== -1 && this._onDestroyHooks.splice(t, 1); }
};
function Ie(e) { let n = ee(e), t = n !== null ? n.factory : W(e); if (t !== null)
    return t; if (e instanceof h)
    throw new g(-204, !1); if (e instanceof Function)
    return Jt(e); throw new g(-204, !1); }
function Jt(e) { if (e.length > 0)
    throw new g(-204, !1); let t = Et(e); return t !== null ? () => t.factory(e) : () => new e; }
function Kt(e) { if (Rn(e))
    return F(void 0, e.useValue); {
    let n = Qt(e);
    return F(n, B);
} }
function Qt(e, n, t) { let r; if (De(e)) {
    let o = D(e);
    return W(o) || Ie(o);
}
else if (Rn(e))
    r = () => D(e.useValue);
else if (Wt(e))
    r = () => e.useFactory(...ve(e.deps || []));
else if (Ut(e))
    r = (o, i) => S(D(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
else {
    let o = D(e && (e.useClass || e.provide));
    if (Xt(e))
        r = () => new o(...ve(e.deps));
    else
        return W(o) || Ie(o);
} return r; }
function L(e) { if (e.destroyed)
    throw new g(-205, !1); }
function F(e, n, t = !1) { return { factory: e, value: n, multi: t ? [] : void 0 }; }
function Xt(e) { return !!e.deps; }
function zt(e) { return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"; }
function er(e) { return typeof e == "function" || typeof e == "object" && e.ngMetadataName === "InjectionToken"; }
function Ee(e, n) { for (let t of e)
    Array.isArray(t) ? Ee(t, n) : t && En(t) ? Ee(t.\u0275providers, n) : n(t); }
function jo(e, n) { let t; e instanceof K ? (L(e), t = e) : t = new me(e); let r, o = I(t), i = w(void 0); try {
    return n();
}
finally {
    I(o), w(i);
} }
function kn() { return Nn() !== void 0 || ce() != null; }
function Po(e) { if (!kn())
    throw new g(-203, !1); }
var ke = 0, je = 1, m = 2, we = 3, Oo = 4, nr = 5, Ao = 6, tr = 7, jn = 8, Lo = 9, Pn = 10, Vo = 11, $o = 12, qo = 13, On = 14, Ho = 15, Go = 16, rr = 17, Zo = 18, Bo = 19, Uo = 20, R = 21, Wo = 22, Te = 23, or = 24, Yo = 25, Jo = 26, ir = 27, Pe = 1, Ko = 6, Qo = 7, Xo = 8, zo = 9, ei = 10;
function An(e) { return Array.isArray(e) && typeof e[Pe] == "object"; }
function Ln(e) { return Array.isArray(e) && e[Pe] === !0; }
function ni(e) { return (e.flags & 4) !== 0; }
function ti(e) { return e.componentOffset > -1; }
function ri(e) { return (e.flags & 1) === 1; }
function oi(e) { return !!e.template; }
function ii(e) { return (e[m] & 512) !== 0; }
function si(e) { return (e.type & 16) === 16; }
function ai(e) { return (e[m] & 32) === 32; }
function Vn(e) { return (e[m] & 256) === 256; }
function ui(e, n) { sr(e, n[je]); }
function sr(e, n) { ar(e); let t = n.data; for (let r = ir; r < t.length; r++)
    if (t[r] === e)
        return; q("This TNode does not belong to this TView."); }
function ar(e) { Dn(e, "TNode must be defined"), e && typeof e == "object" && e.hasOwnProperty("directiveStylingLast") || q("Not of type TNode, got: " + e); }
function ci(e) { Dn(e, "LView must be defined"), Dt(An(e), !0, "Expecting LView"); }
var ur = "svg", cr = "math";
function Oe(e) { for (; Array.isArray(e);)
    e = e[ke]; return e; }
function di(e) { for (; Array.isArray(e);) {
    if (typeof e[Pe] == "object")
        return e;
    e = e[ke];
} return null; }
function li(e, n) { return Oe(n[e]); }
function fi(e, n) { return Oe(n[e.index]); }
function gi(e, n) { let t = e === null ? -1 : e.index; return t !== -1 ? Oe(n[t]) : null; }
function dr(e, n) { return e.data[n]; }
function hi(e, n) { return e[n]; }
function pi(e, n, t, r) { t >= e.data.length && (e.data[t] = null, e.blueprint[t] = null), n[t] = r; }
function mi(e, n) { let t = n[e]; return An(t) ? t : t[ke]; }
function vi(e) { return (e[m] & 4) === 4; }
function $n(e) { return (e[m] & 128) === 128; }
function yi(e) { return Ln(e[we]); }
function Di(e, n) { return n == null ? null : e[n]; }
function Ii(e) { e[rr] = 0; }
function Ei(e) { e[m] & 1024 || (e[m] |= 1024, $n(e) && Ae(e)); }
function lr(e, n) { for (; e > 0;)
    n = n[On], e--; return n; }
function fr(e) { return !!(e[m] & 9216 || e[or]?.dirty); }
function wi(e) { e[Pn].changeDetectionScheduler?.notify(8), e[m] & 64 && (e[m] |= 1024), fr(e) && Ae(e); }
function Ae(e) { e[Pn].changeDetectionScheduler?.notify(0); let n = ln(e); for (; n !== null && !(n[m] & 8192 || (n[m] |= 8192, !$n(n)));)
    n = ln(n); }
function gr(e, n) { if (Vn(e))
    throw new g(911, !1); e[R] === null && (e[R] = []), e[R].push(n); }
function hr(e, n) { if (e[R] === null)
    return; let t = e[R].indexOf(n); t !== -1 && e[R].splice(t, 1); }
function ln(e) { let n = e[we]; return Ln(n) ? n[we] : n; }
function pr(e) { return e[tr] ??= []; }
function mr(e) { return e.cleanup ??= []; }
function Ti(e, n, t, r) { let o = pr(n); o.push(t), e.firstCreatePass && mr(e).push(r, o.length - 1); }
var a = { lFrame: Gn(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var Me = !1;
function Mi() { return a.lFrame.elementDepthCount; }
function Ni() { a.lFrame.elementDepthCount++; }
function bi() { a.lFrame.elementDepthCount--; }
function Ci() { return a.bindingsEnabled; }
function _i() { return a.skipHydrationRootTNode !== null; }
function xi(e) { return a.skipHydrationRootTNode === e; }
function Fi() { a.bindingsEnabled = !0; }
function Ri(e) { a.skipHydrationRootTNode = e; }
function Si() { a.bindingsEnabled = !1; }
function ki() { a.skipHydrationRootTNode = null; }
function qn() { return a.lFrame.lView; }
function ji() { return a.lFrame.tView; }
function Pi(e) { return a.lFrame.contextLView = e, e[jn]; }
function Oi(e) { return a.lFrame.contextLView = null, e; }
function vr() { let e = yr(); for (; e !== null && e.type === 64;)
    e = e.parent; return e; }
function yr() { return a.lFrame.currentTNode; }
function Ai() { let e = a.lFrame, n = e.currentTNode; return e.isParent ? n : n.parent; }
function Li(e, n) { let t = a.lFrame; t.currentTNode = e, t.isParent = n; }
function Vi() { return a.lFrame.isParent; }
function $i() { a.lFrame.isParent = !1; }
function qi() { return a.lFrame.contextLView; }
function Hi() { return Me; }
function fn(e) { let n = Me; return Me = e, n; }
function Gi() { let e = a.lFrame, n = e.bindingRootIndex; return n === -1 && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n; }
function Zi() { return a.lFrame.bindingIndex; }
function Bi(e) { return a.lFrame.bindingIndex = e; }
function Ui() { return a.lFrame.bindingIndex++; }
function Wi(e) { let n = a.lFrame, t = n.bindingIndex; return n.bindingIndex = n.bindingIndex + e, t; }
function Yi() { return a.lFrame.inI18n; }
function Ji(e) { a.lFrame.inI18n = e; }
function Ki(e, n) { let t = a.lFrame; t.bindingIndex = t.bindingRootIndex = e, Dr(n); }
function Qi() { return a.lFrame.currentDirectiveIndex; }
function Dr(e) { a.lFrame.currentDirectiveIndex = e; }
function Xi(e) { let n = a.lFrame.currentDirectiveIndex; return n === -1 ? null : e[n]; }
function zi() { return a.lFrame.currentQueryIndex; }
function es(e) { a.lFrame.currentQueryIndex = e; }
function Ir(e) { let n = e[je]; return n.type === 2 ? n.declTNode : n.type === 1 ? e[nr] : null; }
function ns(e, n, t) { if (t & 4) {
    let o = n, i = e;
    for (; o = o.parent, o === null && !(t & 1);)
        if (o = Ir(i), o === null || (i = i[On], o.type & 10))
            break;
    if (o === null)
        return !1;
    n = o, e = i;
} let r = a.lFrame = Hn(); return r.currentTNode = n, r.lView = e, !0; }
function ts(e) { let n = Hn(), t = e[je]; a.lFrame = n, n.currentTNode = t.firstChild, n.lView = e, n.tView = t, n.contextLView = e, n.bindingIndex = t.bindingStartIndex, n.inI18n = !1; }
function Hn() { let e = a.lFrame, n = e === null ? null : e.child; return n === null ? Gn(e) : n; }
function Gn(e) { let n = { currentTNode: null, isParent: !0, lView: null, tView: null, selectedIndex: -1, contextLView: null, elementDepthCount: 0, currentNamespace: null, currentDirectiveIndex: -1, bindingRootIndex: -1, bindingIndex: -1, currentQueryIndex: 0, parent: e, child: null, inI18n: !1 }; return e !== null && (e.child = n), n; }
function Zn() { let e = a.lFrame; return a.lFrame = e.parent, e.currentTNode = null, e.lView = null, e; }
var rs = Zn;
function os() { let e = Zn(); e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0; }
function is(e) { return (a.lFrame.contextLView = lr(e, a.lFrame.contextLView))[jn]; }
function ss() { return a.lFrame.selectedIndex; }
function as(e) { a.lFrame.selectedIndex = e; }
function us() { let e = a.lFrame; return dr(e.tView, e.selectedIndex); }
function cs() { a.lFrame.currentNamespace = ur; }
function ds() { a.lFrame.currentNamespace = cr; }
function ls() { Er(); }
function Er() { a.lFrame.currentNamespace = null; }
function fs() { return a.lFrame.currentNamespace; }
var Bn = !0;
function gs() { return Bn; }
function hs(e) { Bn = e; }
function ps() { let e, n; return { promise: new Promise((r, o) => { e = r, n = o; }), resolve: e, reject: n }; }
function gn(e, n = null, t = null, r) { let o = wr(e, n, t, r); return o.resolveInjectorInitializers(), o; }
function wr(e, n = null, t = null, r, o = new Set) { let i = [t || Y, Gt(e)], s; return new K(i, n || Sn(), s || null, o); }
var Tr = new Set;
function ms() { return Tr; }
var $ = class e {
    static THROW_IF_NOT_FOUND = N;
    static NULL = new J;
    static create(n, t) { if (Array.isArray(n))
        return gn({ name: "" }, t, n, ""); {
        let r = n.name ?? "";
        return gn({ name: r }, n.parent, n.providers, r);
    } }
    static \u0275prov = j({ token: e, providedIn: "any", factory: () => S(Cn) });
    static __NG_ELEMENT_ID__ = -1;
}, Le = new h(""), b = (() => { class e {
    static __NG_ELEMENT_ID__ = Mr;
    static __NG_ENV_ID__ = t => t;
} return e; })(), Q = class extends b {
    _lView;
    constructor(n) { super(), this._lView = n; }
    get destroyed() { return Vn(this._lView); }
    onDestroy(n) { let t = this._lView; return gr(t, n), () => hr(t, n); }
};
function Mr() { return new Q(qn()); }
var Nr = !1, br = new h(""), Un = (() => { class e {
    taskId = 0;
    pendingTasks = new Set;
    destroyed = !1;
    pendingTask = new dt(!1);
    debugTaskTracker = p(br, { optional: !0 });
    get hasPendingTasks() { return this.destroyed ? !1 : this.pendingTask.value; }
    get hasPendingTasksObservable() { return this.destroyed ? new lt(t => { t.next(!1), t.complete(); }) : this.pendingTask; }
    add() { !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0); let t = this.taskId++; return this.pendingTasks.add(t), this.debugTaskTracker?.add(t), t; }
    has(t) { return this.pendingTasks.has(t); }
    remove(t) { this.pendingTasks.delete(t), this.debugTaskTracker?.remove(t), this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1); }
    ngOnDestroy() { this.pendingTasks.clear(), this.hasPendingTasks && this.pendingTask.next(!1), this.destroyed = !0, this.pendingTask.unsubscribe(); }
    static \u0275prov = j({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), Ne = class extends ft {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(n = !1) { super(), this.__isAsync = n, kn() && (this.destroyRef = p(b, { optional: !0 }) ?? void 0, this.pendingTasks = p(Un, { optional: !0 }) ?? void 0); }
    emit(n) { let t = E(null); try {
        super.next(n);
    }
    finally {
        E(t);
    } }
    subscribe(n, t, r) { let o = n, i = t || (() => null), s = r; if (n && typeof n == "object") {
        let u = n;
        o = u.next?.bind(u), i = u.error?.bind(u), s = u.complete?.bind(u);
    } this.__isAsync && (i = this.wrapInTimeout(i), o && (o = this.wrapInTimeout(o)), s && (s = this.wrapInTimeout(s))); let d = super.subscribe({ next: o, error: i, complete: s }); return n instanceof gt && n.add(d), d; }
    wrapInTimeout(n) { return t => { let r = this.pendingTasks?.add(); setTimeout(() => { try {
        n(t);
    }
    finally {
        r !== void 0 && this.pendingTasks?.remove(r);
    } }); }; }
}, T = Ne;
function X(...e) { }
function Cr(e) { let n, t; function r() { e = X; try {
    t !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(t), n !== void 0 && clearTimeout(n);
}
catch { } } return n = setTimeout(() => { e(), r(); }), typeof requestAnimationFrame == "function" && (t = requestAnimationFrame(() => { e(), r(); })), () => r(); }
function vs(e) { return queueMicrotask(() => e()), () => { e = X; }; }
var Ve = "isAngularZone", hn = Ve + "_ID", _r = 0, be = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new T(!1);
    onMicrotaskEmpty = new T(!1);
    onStable = new T(!1);
    onError = new T(!1);
    constructor(n) { let { enableLongStackTrace: t = !1, shouldCoalesceEventChangeDetection: r = !1, shouldCoalesceRunChangeDetection: o = !1, scheduleInRootZone: i = Nr } = n; if (typeof Zone > "u")
        throw new g(908, !1); Zone.assertZonePatched(); let s = this; s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)), t && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !o && r, s.shouldCoalesceRunChangeDetection = o, s.callbackScheduled = !1, s.scheduleInRootZone = i, Rr(s); }
    static isInAngularZone() { return typeof Zone < "u" && Zone.current.get(Ve) === !0; }
    static assertInAngularZone() { if (!e.isInAngularZone())
        throw new g(909, !1); }
    static assertNotInAngularZone() { if (e.isInAngularZone())
        throw new g(909, !1); }
    run(n, t, r) { return this._inner.run(n, t, r); }
    runTask(n, t, r, o) { let i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + o, n, xr, X, X); try {
        return i.runTask(s, t, r);
    }
    finally {
        i.cancelTask(s);
    } }
    runGuarded(n, t, r) { return this._inner.runGuarded(n, t, r); }
    runOutsideAngular(n) { return this._outer.run(n); }
}, xr = {};
function $e(e) { if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
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
function Fr(e) { if (e.isCheckStableRunning || e.callbackScheduled)
    return; e.callbackScheduled = !0; function n() { Cr(() => { e.callbackScheduled = !1, Ce(e), e.isCheckStableRunning = !0, $e(e), e.isCheckStableRunning = !1; }); } e.scheduleInRootZone ? Zone.root.run(() => { n(); }) : e._outer.run(() => { n(); }), Ce(e); }
function Rr(e) { let n = () => { Fr(e); }, t = _r++; e._inner = e._inner.fork({ name: "angular", properties: { [Ve]: !0, [hn]: t, [hn + t]: !0 }, onInvokeTask: (r, o, i, s, d, u) => { if (Sr(u))
        return r.invokeTask(i, s, d, u); try {
        return pn(e), r.invokeTask(i, s, d, u);
    }
    finally {
        (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && n(), mn(e);
    } }, onInvoke: (r, o, i, s, d, u, l) => { try {
        return pn(e), r.invoke(i, s, d, u, l);
    }
    finally {
        e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !kr(u) && n(), mn(e);
    } }, onHasTask: (r, o, i, s) => { r.hasTask(i, s), o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, Ce(e), $e(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask)); }, onHandleError: (r, o, i, s) => (r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1) }); }
function Ce(e) { e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1; }
function pn(e) { e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null)); }
function mn(e) { e._nesting--, $e(e); }
var vn = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new T;
    onMicrotaskEmpty = new T;
    onStable = new T;
    onError = new T;
    run(n, t, r) { return n.apply(t, r); }
    runGuarded(n, t, r) { return n.apply(t, r); }
    runOutsideAngular(n) { return n(); }
    runTask(n, t, r, o) { return n.apply(t, r); }
};
function Sr(e) { return Wn(e, "__ignore_ng_zone__"); }
function kr(e) { return Wn(e, "__scheduler_tick__"); }
function Wn(e, n) { return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[n] === !0; }
var k = class {
    _console = console;
    handleError(n) { this._console.error("ERROR", n); }
}, Yn = new h("", { factory: () => { let e = p(be), n = p(V), t; return r => { e.runOutsideAngular(() => { n.destroyed && !t ? setTimeout(() => { throw r; }) : (t ??= n.get(k), t.handleError(r)); }); }; } }), ys = { provide: te, useValue: () => { let e = p(k, { optional: !0 }); }, multi: !0 }, jr = new h("", { factory: () => { if (typeof ngServerMode < "u" && ngServerMode)
        return; let e = p(Le).defaultView; if (!e)
        return; let n = p(Yn), t = i => { n(i.reason), i.preventDefault(); }, r = i => { i.error ? n(i.error) : n(new Error(i.message, { cause: i })), i.preventDefault(); }, o = () => { e.addEventListener("unhandledrejection", t), e.addEventListener("error", r); }; typeof Zone < "u" ? Zone.root.run(o) : o(), p(b).onDestroy(() => { e.removeEventListener("error", r), e.removeEventListener("unhandledrejection", t); }); } });
function Ds() { return xn([Ht(() => { p(jr); })]); }
function Is(e) { return null; }
function C(e, n) { let [t, r, o] = Qe(e, n?.equal), i = t, s = i[y]; return i.set = r, i.update = o, i.asReadonly = re.bind(i), i; }
function re() { let e = this[y]; if (e.readonlyFn === void 0) {
    let n = () => this();
    n[y] = e, e.readonlyFn = n;
} return e.readonlyFn; }
var Pr = new h("", { factory: () => Or }), Or = "ng";
var Es = new h(""), ws = new h("", { providedIn: "platform", factory: () => "unknown" }), Ts = new h(""), Ms = new h("", { factory: () => p(Le).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null }), Ar = { breakpoints: [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840], placeholderResolution: 30, disableImageSizeWarning: !1, disableImageLazyLoadWarning: !1 }, Ns = new h("", { factory: () => Ar });
function bs(e) { return e; }
var Jn = (() => { class e {
    static \u0275prov = j({ token: e, providedIn: "root", factory: () => { let t = new e; return (typeof ngServerMode > "u" || !ngServerMode) && (t.store = Lr(p(Le), p(Pr))), t; } });
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
function Lr(e, n) { let t = e.getElementById(n + "-state"); if (t?.tagName === "SCRIPT" && t.textContent)
    try {
        return JSON.parse(t.textContent);
    }
    catch (r) {
        console.warn("Exception while restoring TransferState for app " + n, r);
    } return {}; }
function Cs(e, n) { if (Je() !== null)
    throw new g(-602, !1); }
var Kn = (() => { class e {
    view;
    node;
    constructor(t, r) { this.view = t, this.node = r; }
    static __NG_ELEMENT_ID__ = Vr;
} return e; })();
function Vr() { return new Kn(qn(), vr()); }
var z = class {
}, _s = new h("", { factory: () => !0 }), xs = new h("", { factory: () => !1 }), Fs = new h(""), $r = (() => { class e {
    static \u0275prov = j({ token: e, providedIn: "root", factory: () => new _e });
} return e; })(), _e = class {
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
}, xe = class {
    [y];
    constructor(n) { this[y] = n; }
    destroy() { this[y].destroy(); }
};
function Qn(e, n) { let t = n?.injector ?? p($), r = n?.manualCleanup !== !0 ? t.get(b) : null, o, i = t.get(Kn, null, { optional: !0 }), s = t.get(z); return i !== null ? (o = Gr(i.view, s, e), r instanceof Q && r._lView === i.view && (r = null)) : o = Zr(e, t.get($r), s), o.injector = t, r !== null && (o.onDestroyFns = [r.onDestroy(() => o.destroy())]), new xe(o); }
var Xn = Z(G({}, Xe), { cleanupFns: void 0, zone: null, onDestroyFns: null, run() { let e = fn(!1); try {
        ze(this);
    }
    finally {
        fn(e);
    } }, cleanup() { if (!this.cleanupFns?.length)
        return; let e = E(null); try {
        for (; this.cleanupFns.length;)
            this.cleanupFns.pop()();
    }
    finally {
        this.cleanupFns = [], E(e);
    } } }), qr = Z(G({}, Xn), { consumerMarkedDirty() { this.scheduler.schedule(this), this.notifier.notify(12); }, destroy() { if (ue(this), this.onDestroyFns !== null)
        for (let e of this.onDestroyFns)
            e(); this.cleanup(), this.scheduler.remove(this); } }), Hr = Z(G({}, Xn), { consumerMarkedDirty() { this.view[m] |= 8192, Ae(this.view), this.notifier.notify(13); }, destroy() { if (ue(this), this.onDestroyFns !== null)
        for (let e of this.onDestroyFns)
            e(); this.cleanup(), this.view[Te]?.delete(this); } });
function Gr(e, n, t) { let r = Object.create(Hr); return r.view = e, r.zone = typeof Zone < "u" ? Zone.current : null, r.notifier = n, r.fn = zn(r, t), e[Te] ??= new Set, e[Te].add(r), r.consumerMarkedDirty(r), r; }
function Zr(e, n, t) { let r = Object.create(qr); return r.fn = zn(r, e), r.scheduler = n, r.notifier = t, r.zone = typeof Zone < "u" ? Zone.current : null, r.scheduler.add(r), r.notifier.notify(12), r; }
function zn(e, n) { return () => { n(t => (e.cleanupFns ??= []).push(t)); }; }
function qe(e) { return typeof e == "function" && e[y] !== void 0; }
function Rs(e) { return qe(e) && typeof e.set == "function"; }
var et = (() => { class e {
    internalPendingTasks = p(Un);
    scheduler = p(z);
    errorHandler = p(Yn);
    add() { let t = this.internalPendingTasks.add(); return () => { this.internalPendingTasks.has(t) && (this.scheduler.notify(11), this.internalPendingTasks.remove(t)); }; }
    run(t) { let r = this.add(); try {
        t().catch(this.errorHandler).finally(r);
    }
    catch (o) {
        this.errorHandler(o), r();
    } }
    static \u0275prov = j({ token: e, providedIn: "root", factory: () => new e });
} return e; })();
var nt = class {
    destroyed = !1;
    listeners = null;
    errorHandler = p(k, { optional: !0 });
    isEmitting = !1;
    hasNullListeners = !1;
    destroyRef = p(b);
    constructor() { this.destroyRef.onDestroy(() => { this.destroyed = !0, this.listeners = null; }); }
    subscribe(n) { if (this.destroyed)
        throw new g(953, !1); return (this.listeners ??= []).push(n), { unsubscribe: () => { let t = this.listeners ? this.listeners.indexOf(n) : -1; t > -1 && (this.isEmitting ? (this.hasNullListeners = !0, this.listeners[t] = null) : this.listeners.splice(t, 1)); } }; }
    emit(n) { if (this.destroyed) {
        console.warn(Fe(953, !1));
        return;
    } if (this.listeners === null)
        return; this.isEmitting = !0; let t = E(null); try {
        for (let r of this.listeners)
            try {
                r !== null && r(n);
            }
            catch (o) {
                this.errorHandler?.handleError(o);
            }
    }
    finally {
        this.hasNullListeners && (this.hasNullListeners = !1, this.listeners && Br(this.listeners)), E(t), this.isEmitting = !1;
    } }
};
function Br(e) { let n = e.length - 1; for (; n > -1;)
    e[n] === null && e.splice(n, 1), n--; }
function Ls(e) { return e.destroyRef; }
var Ur = new h("");
function _(e, n) { return Ke(e, n?.equal); }
function v(e) { return tn(e); }
var He = class extends Error {
    dependency;
    constructor(n) { super("Dependency error", { cause: n.error() }), this.name = "ResourceDependencyError", this.dependency = n; }
}, P = class e extends Error {
    _brand;
    constructor(n) { super(n); }
    static IDLE = new e("IDLE");
    static LOADING = new e("LOADING");
}, Wr = e => e;
function tt(e, n) { if (typeof e == "function") {
    let t = le(e, Wr, n?.equal);
    return rt(t, n?.debugName);
}
else {
    let t = le(e.source, e.computation, e.equal);
    return rt(t, e.debugName);
} }
function rt(e, n) { let t = e[y], r = e; return r.set = o => en(t, o), r.update = o => nn(t, o), r.asReadonly = re.bind(e), r; }
function Vs(e) { let n = e.request, t = e.params ?? n ?? (() => null); return new Ze(t, Jr(e), e.defaultValue, e.equal ? Yr(e.equal) : void 0, e.debugName, e.injector ?? p($), e.id); }
var Ge = class {
    value;
    isLoading;
    constructor(n, t) { this.value = n, this.value.set = this.set.bind(this), this.value.update = this.update.bind(this), this.value.asReadonly = re, this.isLoading = _(() => this.status() === "loading" || this.status() === "reloading", void 0); }
    isError = _(() => this.status() === "error");
    update(n) { this.set(n(v(this.value))); }
    isValueDefined = _(() => this.isError() ? !1 : this.value() !== void 0);
    _snapshot;
    get snapshot() { return this._snapshot ??= _(() => { let n = this.status(); return n === "error" ? { status: "error", error: this.error() } : { status: n, value: this.value() }; }); }
    hasValue() { return this.isValueDefined(); }
    asReadonly() { return this; }
}, Ze = class extends Ge {
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
    constructor(n, t, r, o, i, s, d, u) { if (eo())
        throw no(); super(_(() => { let f = this.state().stream?.(); if (!f || this.state().status === "loading" && this.error())
        return r; if (!oe(f))
        throw new Ue(this.error()); return f.value; }, { equal: o }), i), this.loaderFn = t, this.equal = o, this.debugName = i, this.transferCacheKey = d; let l = s.get(Ur, void 0, { optional: !0 }) ?? { isActive: !1 }; this.transferState = s.get(Jn, void 0, { optional: !0 }) ?? void 0, this.extRequest = tt(() => { try {
        return st(!0), { request: n(zr), reload: 0 };
    }
    catch (f) {
        return at(f), f === P.IDLE ? { status: "idle", reload: 0 } : f === P.LOADING ? { status: "loading", reload: 0 } : { error: f, reload: 0 };
    }
    finally {
        st(!1);
    } }, void 0), this.state = tt({ source: this.extRequest, computation: (f, O) => { let { request: H, status: A, error: Ye } = f, M; if (Ye)
            A = "resolved", M = C({ error: Be(Ye) }, void 0);
        else if (!A)
            if (O)
                A = H === void 0 ? "idle" : "loading", O.value.extRequest.request === H && (M = O.value.stream);
            else {
                let ie = this.transferState, se = this.transferCacheKey;
                l.isActive && se && ie && H !== void 0 && ie.hasKey(se) && (M = C({ value: ie.get(se, r) }, void 0)), M || (M = u?.(f.request)), u = void 0, A = H === void 0 ? "idle" : M ? "resolved" : "loading";
            } return { extRequest: f, status: A, previousStatus: O ? it(O.value) : "idle", stream: M }; } }), this.effectRef = Qn(this.loadEffect.bind(this), { injector: s, manualCleanup: !0 }), this.pendingTasks = s.get(et), this.unregisterOnDestroy = s.get(b).onDestroy(() => this.destroy()), this.status = _(() => it(this.state()), void 0), this.error = _(() => { let f = this.state().stream?.(); return f && !oe(f) ? f.error : void 0; }, void 0); }
    set(n) { if (this.destroyed)
        return; let t = v(this.error), r = v(this.state); if (!t) {
        let o = v(this.value);
        if (r.status === "local" && (this.equal ? this.equal(o, n) : o === n))
            return;
    } this.state.set({ extRequest: r.extRequest, status: "local", previousStatus: "local", stream: C({ value: n }, void 0) }), this.abortInProgressLoad(); }
    reload() { let { status: n } = v(this.state); return n === "idle" || n === "loading" ? !1 : (this.extRequest.update(({ request: t, reload: r }) => ({ request: t, reload: r + 1 })), !0); }
    destroy() { this.destroyed = !0, this.unregisterOnDestroy(), this.effectRef.destroy(), this.abortInProgressLoad(), this.state.set({ extRequest: { request: void 0, reload: 0 }, status: "idle", previousStatus: "idle", stream: void 0 }); }
    loadEffect() { return ae(this, null, function* () { let n = this.extRequest(), { status: t, previousStatus: r } = v(this.state); if (n.request === void 0)
        return; if (t !== "loading")
        return; this.abortInProgressLoad(); let o = this.resolvePendingTask = this.pendingTasks.add(), { signal: i } = this.pendingController = new AbortController; try {
        let s = v(() => this.loaderFn({ params: n.request, abortSignal: i, previous: { status: r } })), d = () => i.aborted || v(this.extRequest) !== n;
        if (qe(s)) {
            if (d())
                return;
            this.state.set({ extRequest: n, status: "resolved", previousStatus: "resolved", stream: s });
            let u = v(s);
            typeof ngServerMode < "u" && ngServerMode && ot(u, this.transferCacheKey, this.transferState);
        }
        else {
            let u = yield s;
            if (d())
                return;
            this.state.set({ extRequest: n, status: "resolved", previousStatus: "resolved", stream: u });
            let l = u ? v(u) : void 0;
            typeof ngServerMode < "u" && ngServerMode && ot(l, this.transferCacheKey, this.transferState);
        }
    }
    catch (s) {
        if (at(s), i.aborted || v(this.extRequest) !== n)
            return;
        this.state.set({ extRequest: n, status: "resolved", previousStatus: "error", stream: C({ error: Be(s) }, void 0) });
    }
    finally {
        o?.(), o = void 0;
    } }); }
    abortInProgressLoad() { v(() => this.pendingController?.abort()), this.pendingController = void 0, this.resolvePendingTask?.(), this.resolvePendingTask = void 0; }
};
function ot(e, n, t) { n && t && e && oe(e) && t.set(n, e.value); }
function Yr(e) { return (n, t) => n === void 0 || t === void 0 ? n === t : e(n, t); }
function Jr(e) { return Kr(e) ? e.stream : n => ae(null, null, function* () { try {
    return C({ value: yield e.loader(n) }, void 0);
}
catch (t) {
    return C({ error: Be(t) }, void 0);
} }); }
function Kr(e) { return !!e.stream; }
function it(e) { switch (e.status) {
    case "loading": return e.extRequest.reload === 0 ? "loading" : "reloading";
    case "resolved": return oe(e.stream()) ? "resolved" : "error";
    default: return e.status;
} }
function oe(e) { return e.error === void 0; }
function Be(e) { return Qr(e) ? e : new We(e); }
function Qr(e) { return e instanceof Error || typeof e == "object" && typeof e.name == "string" && typeof e.message == "string"; }
var Ue = class extends Error {
    constructor(n) { super(n.message, { cause: n }); }
}, We = class extends Error {
    constructor(n) { super(String(n), { cause: n }); }
};
function Xr(e) { switch (e.status()) {
    case "idle": throw P.IDLE;
    case "error": throw new He(e);
    case "loading":
    case "reloading": throw P.LOADING;
} return e.value(); }
var zr = { chain: Xr }, ut = !1;
function eo() { return ut; }
function st(e) { ut = e; }
function no() { return new g(992, !1); }
function at(e) { if (e instanceof g && e.code === 992)
    throw e; }
export { ge as a, rn as b, ht as c, co as d, g as e, Fe as f, c as g, lo as h, mt as i, fo as j, go as k, yn as l, D as m, yt as n, Dt as o, q as p, j as q, ho as r, ee as s, po as t, on as u, In as v, sn as w, h as x, mo as y, En as z, wt as A, Tt as B, Mt as C, Nt as D, un as E, vo as F, bt as G, yo as H, wn as I, Ct as J, _t as K, Do as L, xt as M, Io as N, St as O, kt as P, w as Q, Pt as R, Eo as S, S as T, wo as U, p as V, U as W, To as X, W as Y, Mo as Z, No as _, Re as $, bo as aa, Co as ba, _o as ca, xo as da, $t as ea, Fo as fa, Ro as ga, bn as ha, So as ia, Y as ja, te as ka, Cn as la, _n as ma, J as na, xn as oa, Ht as pa, Gt as qa, Zt as ra, ye as sa, De as ta, ko as ua, Yt as va, Sn as wa, V as xa, K as ya, Qt as za, jo as Aa, kn as Ba, Po as Ca, ke as Da, je as Ea, m as Fa, we as Ga, Oo as Ha, nr as Ia, Ao as Ja, tr as Ka, jn as La, Lo as Ma, Pn as Na, Vo as Oa, $o as Pa, qo as Qa, On as Ra, Ho as Sa, Go as Ta, rr as Ua, Zo as Va, Bo as Wa, Uo as Xa, R as Ya, Wo as Za, Te as _a, or as $a, Yo as ab, Jo as bb, ir as cb, Ko as db, Qo as eb, Xo as fb, zo as gb, ei as hb, An as ib, Ln as jb, ni as kb, ti as lb, ri as mb, oi as nb, ii as ob, si as pb, ai as qb, Vn as rb, ui as sb, ar as tb, ci as ub, ur as vb, cr as wb, Oe as xb, di as yb, li as zb, fi as Ab, gi as Bb, dr as Cb, hi as Db, pi as Eb, mi as Fb, vi as Gb, $n as Hb, yi as Ib, Di as Jb, Ii as Kb, Ei as Lb, lr as Mb, fr as Nb, wi as Ob, Ae as Pb, gr as Qb, hr as Rb, ln as Sb, pr as Tb, mr as Ub, Ti as Vb, Mi as Wb, Ni as Xb, bi as Yb, Ci as Zb, _i as _b, xi as $b, Fi as ac, Ri as bc, Si as cc, ki as dc, qn as ec, ji as fc, Pi as gc, Oi as hc, vr as ic, yr as jc, Ai as kc, Li as lc, Vi as mc, $i as nc, qi as oc, Hi as pc, fn as qc, Gi as rc, Zi as sc, Bi as tc, Ui as uc, Wi as vc, Yi as wc, Ji as xc, Ki as yc, Qi as zc, Dr as Ac, Xi as Bc, zi as Cc, es as Dc, ns as Ec, ts as Fc, rs as Gc, os as Hc, is as Ic, ss as Jc, as as Kc, us as Lc, cs as Mc, ds as Nc, ls as Oc, fs as Pc, gs as Qc, hs as Rc, ps as Sc, gn as Tc, wr as Uc, ms as Vc, $ as Wc, Le as Xc, b as Yc, Nr as Zc, br as _c, Un as $c, T as ad, Cr as bd, vs as cd, hn as dd, be as ed, vn as fd, k as gd, Yn as hd, ys as id, Ds as jd, Is as kd, C as ld, re as md, Pr as nd, Es as od, ws as pd, Ts as qd, Ms as rd, Ar as sd, Ns as td, bs as ud, Jn as vd, Lr as wd, Cs as xd, Kn as yd, z as zd, _s as Ad, xs as Bd, Fs as Cd, $r as Dd, xe as Ed, Qn as Fd, qe as Gd, Rs as Hd, et as Id, nt as Jd, Ls as Kd, Ur as Ld, _ as Md, v as Nd, He as Od, P as Pd, tt as Qd, Vs as Rd, Ze as Sd, Be as Td, Ue as Ud, Xr as Vd, eo as Wd, st as Xd, no as Yd, at as Zd };
/*! Bundled license information:

@angular/core/fesm2022/_pending_tasks-chunk.mjs:
@angular/core/fesm2022/_resource-chunk.mjs:
  (**
   * @license Angular v22.0.7
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
