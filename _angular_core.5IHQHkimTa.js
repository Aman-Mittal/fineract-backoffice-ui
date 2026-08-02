import { a as bM } from "@nf-internal/chunk-CO263U2P";
import { $ as Cp, $a as Me, $b as hc, $c as St, A as Mn, Aa as Ao, Ab as te, Ac as Sc, Ad as kn, B as li, Ba as Rp, Bb as Hp, Bc as Ti, Bd as IM, C as ui, Ca as lM, Cb as Wt, Cc as Ci, Cd as _i, D as ec, Da as V, Db as wt, Dc as Vo, Dd as jc, E as Qe, Ea as m, Eb as Lo, Ec as _c, Ed as lh, F as jt, Fa as A, Fb as de, Fc as Mi, Fd as uh, G as Mo, Ga as Y, Gb as jp, Gc as bc, Gd as Vc, H as di, Ha as ue, Hb as Vp, Hc as Ni, Hd as bi, I as W, Ia as ie, Ib as Bp, Ic as Xp, Id as Bc, J as Re, Ja as ce, Jb as fe, Jc as oe, Jd as Uc, K as Ye, Ka as Ut, Kb as dc, Kc as nt, Kd as DM, L as No, La as P, Lb as Po, Lc as we, Ld as TM, M as N, Ma as R, Mb as Up, Mc as Ac, Md as Zt, N as ke, Na as Ze, Nb as Fo, Nc as Rc, Nd as dh, O as Ip, Oa as C, Ob as Ei, Oc as kc, Od as CM, P as tc, Pa as Ct, Pb as Ii, Pc as wi, Pd as MM, Q as Vt, Qa as Ro, Qb as Ho, Qc as Bo, Qd as fh, R as Dp, Ra as wn, Rb as fc, Rc as Ge, Rd as NM, S as Te, Sa as X, Sb as Je, Sc as An, Sd as wM, T as je, Ta as Mt, Tb as $p, Tc as uM, Td as SM, U as fi, Ua as Sn, Ub as Gp, Uc as eh, Ud as ph, V as I, Va as Ke, Vb as zp, Vc as th, Vd as _M, W as nc, Wa as Ce, Wb as Wp, Wc as me, Wd as hh, X as Nn, Xa as ac, Xb as qp, Xc as Rn, Xd as Uo, Y as pi, Ya as cc, Yb as pc, Yc as qt, Yd as gh, Z as Tp, Za as yi, Zb as Di, Zc as nh, Zd as $c, _ as Ve, _a as ko, _b as jo, _c as oh, a as nM, aa as oc, ab as $t, ac as gc, ad as dM, b as mp, ba as wo, bb as xe, bc as Qp, bd as rh, c as Qa, ca as So, cb as E, cc as mc, cd as ih, d as ii, da as rc, db as Ne, dc as vc, dd as xc, e as S, ea as Mp, eb as Ue, ec as g, ed as B, f as vp, fa as _o, fb as xo, fc as w, fd as Oc, g as Ya, ga as hi, gb as Gt, gc as yc, gd as Lc, h as yp, ha as gi, hb as H, hc as Ec, hd as Qt, i as si, ia as st, ib as ee, ic as M, id as Pc, j as ai, ja as j, jb as Z, jc as Yp, jd as fM, k as oM, ka as Tt, kb as lc, kc as bn, kd as pM, l as Za, la as ic, lb as ve, lc as Xe, ld as Fc, m as z, ma as Np, mb as _n, mc as Ic, md as sh, n as ci, na as bo, nb as Oe, nc as Dc, nd as ct, o as Ep, oa as Be, ob as $e, oc as Tc, od as Hc, p as Ka, pa as wp, pb as uc, pc as Cc, pd as hM, q as ae, qa as cM, qb as kp, qc as Mc, qd as gM, r as Co, ra as sc, rb as Nt, rc as pe, rd as mM, s as rM, sa as Sp, sb as xp, sc as et, sd as vM, t as iM, ta as mi, tb as Op, tc as Nc, td as yM, u as Ja, ua as _p, ub as Lp, uc as ge, ud as ah, v as Cn, va as bp, vb as Pp, vc as tt, vd as Yt, w as Xa, wa as vi, wb as Fp, wc as Zp, wd as ch, x as b, xa as at, xb as x, xc as wc, xd as EM, y as sM, ya as Bt, yb as Oo, yc as Kp, yd as Si, z as aM, za as Ap, zb as zt, zc as Jp, zd as _t } from "@nf-internal/chunk-FZ6GFVYX";
import { b as tM } from "@nf-internal/chunk-X4HXWS2T";
import { B as Wa, E as qa, a as qe, b as L, c as pp, f as za, g as ni, n as Do, p as oi, r as ri, s as To, w as hp, x as gp } from "@nf-internal/chunk-TBG2VGBV";
import { a as G, b as be, d as fp, e as Ae, f as Ga } from "@nf-internal/chunk-IQO3VMP7";
import { setActiveConsumer as Ln } from "@angular/core/primitives/signals";
import { Subject as Vg, Subscription as AM } from "rxjs";
import { map as RM } from "rxjs/operators";
var xn = { JSACTION: "jsaction" };
function rt(e) { return { toString: e }.toString(); }
var k = (function (e) { return e[e.TemplateCreateStart = 0] = "TemplateCreateStart", e[e.TemplateCreateEnd = 1] = "TemplateCreateEnd", e[e.TemplateUpdateStart = 2] = "TemplateUpdateStart", e[e.TemplateUpdateEnd = 3] = "TemplateUpdateEnd", e[e.LifecycleHookStart = 4] = "LifecycleHookStart", e[e.LifecycleHookEnd = 5] = "LifecycleHookEnd", e[e.OutputStart = 6] = "OutputStart", e[e.OutputEnd = 7] = "OutputEnd", e[e.BootstrapApplicationStart = 8] = "BootstrapApplicationStart", e[e.BootstrapApplicationEnd = 9] = "BootstrapApplicationEnd", e[e.BootstrapComponentStart = 10] = "BootstrapComponentStart", e[e.BootstrapComponentEnd = 11] = "BootstrapComponentEnd", e[e.ChangeDetectionStart = 12] = "ChangeDetectionStart", e[e.ChangeDetectionEnd = 13] = "ChangeDetectionEnd", e[e.ChangeDetectionSyncStart = 14] = "ChangeDetectionSyncStart", e[e.ChangeDetectionSyncEnd = 15] = "ChangeDetectionSyncEnd", e[e.AfterRenderHooksStart = 16] = "AfterRenderHooksStart", e[e.AfterRenderHooksEnd = 17] = "AfterRenderHooksEnd", e[e.ComponentStart = 18] = "ComponentStart", e[e.ComponentEnd = 19] = "ComponentEnd", e[e.DeferBlockStateStart = 20] = "DeferBlockStateStart", e[e.DeferBlockStateEnd = 21] = "DeferBlockStateEnd", e[e.DynamicComponentStart = 22] = "DynamicComponentStart", e[e.DynamicComponentEnd = 23] = "DynamicComponentEnd", e[e.HostBindingsUpdateStart = 24] = "HostBindingsUpdateStart", e[e.HostBindingsUpdateEnd = 25] = "HostBindingsUpdateEnd", e; })(k || {}), Ki = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, o) { this.previousValue = t, this.currentValue = n, this.firstChange = o; }
    isFirstChange() { return this.firstChange; }
};
function Bg(e, t, n, o) { t !== null ? t.applyValueToInputSignal(t, o) : e[n] = o; }
var Ug = null, $g = (() => { Ug = mh; let e = () => mh; return e.ngInherit = !0, e; })();
function kM() { return Ug; }
function mh(e) { return e.type.prototype.ngOnChanges && (e.setInput = OM), xM; }
function xM() { let e = Gg(this), t = e?.current; if (t) {
    let n = e.previous;
    if (n === st)
        e.previous = t;
    else
        for (let o in t)
            n[o] = t[o];
    e.current = null, this.ngOnChanges(t);
} }
function OM(e, t, n, o, r) { let i = this.declaredInputs[o], s = Gg(e) || LM(e, { previous: st, current: null }), a = s.current || (s.current = {}), c = s.previous, l = c[i]; a[i] = new Ki(l && l.currentValue, n, c === st), Bg(e, t, r, n); }
var hl = "__ngSimpleChanges__";
function Gg(e) { return Object.hasOwn(e, hl) && e[hl] || null; }
function LM(e, t) { return e[hl] = t; }
var vh = [];
var O = function (e, t = null, n) { for (let o = 0; o < vh.length; o++) {
    let r = vh[o];
    r(e, t, n);
} };
function PM(e, t, n) { let { ngOnChanges: o, ngOnInit: r, ngDoCheck: i } = t.type.prototype; if (o) {
    let s = kM()(t);
    (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s);
} r && (n.preOrderHooks ??= []).push(0 - e, r), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i)); }
function zg(e, t) { for (let n = t.directiveStart, o = t.directiveEnd; n < o; n++) {
    let i = e.data[n].type.prototype, { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: c, ngAfterViewChecked: l, ngOnDestroy: u } = i;
    s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), c && (e.viewHooks ??= []).push(-n, c), l && ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)), u != null && (e.destroyHooks ??= []).push(n, u);
} }
function Ui(e, t, n) { Wg(e, t, 3, n); }
function $i(e, t, n, o) { (e[A] & 3) === n && Wg(e, t, n, o); }
function Gc(e, t) { let n = e[A]; (n & 3) === t && (n &= 16383, n += 1, e[A] = n); }
function Wg(e, t, n, o) { let r = o !== void 0 ? e[Sn] & 65535 : 0, i = o ?? -1, s = t.length - 1, a = 0; for (let c = r; c < s; c++)
    if (typeof t[c + 1] == "number") {
        if (a = t[c], o != null && a >= o)
            break;
    }
    else
        t[c] < 0 && (e[Sn] += 65536), (a < i || i == -1) && (FM(e, n, t, c), e[Sn] = (e[Sn] & 4294901760) + c + 2), c++; }
function yh(e, t) { O(k.LifecycleHookStart, e, t); let n = L(null); try {
    t.call(e);
}
finally {
    L(n), O(k.LifecycleHookEnd, e, t);
} }
function FM(e, t, n, o) { let r = n[o] < 0, i = n[o + 1], s = r ? -n[o] : n[o], a = e[s]; r ? e[A] >> 14 < e[Sn] >> 16 && (e[A] & 3) === t && (e[A] += 16384, yh(a, i)) : yh(a, i); }
var Bn = -1, on = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, o, r) { this.factory = t, this.name = r, this.canSeeViewProviders = n, this.injectImpl = o; }
};
function ws(e) { return e != null && typeof e == "object" && (e.insertBeforeIndex === null || typeof e.insertBeforeIndex == "number" || Array.isArray(e.insertBeforeIndex)); }
function qg(e) { return !!(e.type & 128); }
function HM(e) { return (e.flags & 8) !== 0; }
function jM(e) { return (e.flags & 16) !== 0; }
function VM(e, t, n) { let o = 0; for (; o < n.length;) {
    let r = n[o];
    if (typeof r == "number") {
        if (r !== 0)
            break;
        o++;
        let i = n[o++], s = n[o++], a = n[o++];
        e.setAttribute(t, s, a, i);
    }
    else {
        let i = r, s = n[++o];
        BM(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), o++;
    }
} return o; }
function Qg(e) { return e === 3 || e === 4 || e === 6; }
function BM(e) { return e.charCodeAt(0) === 64; }
function Wn(e, t) { if (!(t === null || t.length === 0))
    if (e === null || e.length === 0)
        e = t.slice();
    else {
        let n = -1;
        for (let o = 0; o < t.length; o++) {
            let r = t[o];
            typeof r == "number" ? n = r : n === 0 || (n === -1 || n === 2 ? Eh(e, n, r, null, t[++o]) : Eh(e, n, r, null, null));
        }
    } return e; }
function Eh(e, t, n, o, r) { let i = 0, s = e.length; if (t === -1)
    s = -1;
else
    for (; i < e.length;) {
        let a = e[i++];
        if (typeof a == "number") {
            if (a === t) {
                s = -1;
                break;
            }
            else if (a > t) {
                s = i - 1;
                break;
            }
        }
    } for (; i < e.length;) {
    let a = e[i];
    if (typeof a == "number")
        break;
    if (a === n) {
        r !== null && (e[i + 1] = r);
        return;
    }
    i++, r !== null && i++;
} s !== -1 && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), r !== null && e.splice(i++, 0, r); }
function Yg(e) { return e !== Bn; }
function Ji(e) { return e & 32767; }
function UM(e) { return e >> 16; }
function Xi(e, t) { let n = UM(e), o = t; for (; n > 0;)
    o = o[wn], n--; return o; }
var gl = !0;
function es(e) { let t = gl; return gl = e, t; }
var $M = 256, Zg = $M - 1, Kg = 5, GM = 0, ot = {};
function zM(e, t, n) { let o; typeof n == "string" ? o = n.charCodeAt(0) || 0 : n.hasOwnProperty(jt) && (o = n[jt]), o == null && (o = n[jt] = GM++); let r = o & Zg, i = 1 << r; t.data[e + (r >> Kg)] |= i; }
function ts(e, t) { let n = Jg(e, t); if (n !== -1)
    return n; let o = t[m]; o.firstCreatePass && (e.injectorIndex = t.length, zc(o.data, e), zc(t, null), zc(o.blueprint, null)); let r = Du(e, t), i = e.injectorIndex; if (Yg(r)) {
    let s = Ji(r), a = Xi(r, t), c = a[m].data;
    for (let l = 0; l < 8; l++)
        t[i + l] = a[s + l] | c[s + l];
} return t[i + 8] = r, i; }
function zc(e, t) { e.push(0, 0, 0, 0, 0, 0, 0, 0, t); }
function Jg(e, t) { return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex; }
function Du(e, t) { if (e.parent && e.parent.injectorIndex !== -1)
    return e.parent.injectorIndex; let n = 0, o = null, r = t; for (; r !== null;) {
    if (o = rm(r), o === null)
        return Bn;
    if (n++, r = r[wn], o.injectorIndex !== -1)
        return o.injectorIndex | n << 16;
} return Bn; }
function ml(e, t, n) { zM(e, t, n); }
function WM(e, t) { if (t === "class")
    return e.classes; if (t === "style")
    return e.styles; let n = e.attrs; if (n) {
    let o = n.length, r = 0;
    for (; r < o;) {
        let i = n[r];
        if (Qg(i))
            break;
        if (i === 0)
            r = r + 2;
        else if (typeof i == "number")
            for (r++; r < o && typeof n[r] == "string";)
                r++;
        else {
            if (i === t)
                return n[r + 1];
            r = r + 2;
        }
    }
} return null; }
function Xg(e, t, n) { if (n & 8 || e !== void 0)
    return e; tc(t, "NodeInjector"); }
function em(e, t, n, o) { if (n & 8 && o === void 0 && (o = null), (n & 3) === 0) {
    let r = e[R], i = Vt(void 0);
    try {
        return r ? r.get(t, o, n & 8) : Dp(t, o, n & 8);
    }
    finally {
        Vt(i);
    }
} return Xg(o, t, n); }
function tm(e, t, n, o = 0, r) { if (e !== null) {
    if (t[A] & 2048 && !(o & 2)) {
        let s = ZM(e, t, n, o, ot);
        if (s !== ot)
            return s;
    }
    let i = nm(e, t, n, o, ot);
    if (i !== ot)
        return i;
} return em(t, n, o, r); }
function nm(e, t, n, o, r) { let i = QM(n); if (typeof i == "function") {
    if (!_c(t, e, o))
        return o & 1 ? Xg(r, n, o) : em(t, n, o, r);
    try {
        let s;
        if (s = i(o), s == null && !(o & 8))
            tc(n);
        else
            return s;
    }
    finally {
        bc();
    }
}
else if (typeof i == "number") {
    let s = null, a = Jg(e, t), c = Bn, l = o & 1 ? t[X][ie] : null;
    for ((a === -1 || o & 4) && (c = a === -1 ? Du(e, t) : t[a + 8], c === Bn || !Dh(o, !1) ? a = -1 : (s = t[m], a = Ji(c), t = Xi(c, t))); a !== -1;) {
        let u = t[m];
        if (Ih(i, a, u.data)) {
            let d = qM(a, t, n, s, o, l);
            if (d !== ot)
                return d;
        }
        c = t[a + 8], c !== Bn && Dh(o, t[m].data[a + 8] === l) && Ih(i, a, t) ? (s = u, a = Ji(c), t = Xi(c, t)) : a = -1;
    }
} return r; }
function qM(e, t, n, o, r, i) { let s = t[m], a = s.data[e + 8], c = o == null ? ve(a) && gl : o != s && (a.type & 3) !== 0, l = r & 1 && i === a, u = Gi(a, s, n, c, l); return u !== null ? sr(t, s, u, a, r) : ot; }
function Gi(e, t, n, o, r) { let i = e.providerIndexes, s = t.data, a = i & 1048575, c = e.directiveStart, l = e.directiveEnd, u = i >> 20, d = o ? a : a + u, f = r ? a + u : l; for (let p = d; p < f; p++) {
    let h = s[p];
    if (p < c && n === h || p >= c && h.type === n)
        return p;
} if (r) {
    let p = s[c];
    if (p && Oe(p) && p.type === n)
        return c;
} return null; }
function sr(e, t, n, o, r) { let i = e[n], s = t.data; if (i instanceof on) {
    let a = i;
    if (a.resolving)
        throw Ip("");
    let c = es(a.canSeeViewProviders);
    a.resolving = !0;
    let l = s[n].type || s[n], u, d = a.injectImpl ? Vt(a.injectImpl) : null, f = _c(e, o, 0);
    try {
        i = e[n] = a.factory(void 0, r, s, e, o), t.firstCreatePass && n >= o.directiveStart && PM(n, s[n], t);
    }
    finally {
        d !== null && Vt(d), es(c), a.resolving = !1, bc();
    }
} return i; }
function QM(e) { if (typeof e == "string")
    return e.charCodeAt(0) || 0; let t = e.hasOwnProperty(jt) ? e[jt] : void 0; return typeof t == "number" ? t >= 0 ? t & Zg : YM : t; }
function Ih(e, t, n) { let o = 1 << e; return !!(n[t + (e >> Kg)] & o); }
function Dh(e, t) { return !(e & 2) && !(e & 1 && t); }
function Tu(e) { return e._lView; }
function Sr(e) { return e._tNode; }
var ye = class {
    _tNode;
    _lView;
    constructor(t, n) { this._tNode = t, this._lView = n; }
    get(t, n, o) { return tm(this._tNode, this._lView, t, nc(o), n); }
};
function YM() { return new ye(M(), g()); }
function om(e) { return rt(() => { let t = e.prototype.constructor, n = t[Qe] || vl(t), o = Object.prototype, r = Object.getPrototypeOf(e.prototype).constructor; for (; r && r !== o;) {
    let i = r[Qe] || vl(r);
    if (i && i !== n)
        return i;
    r = Object.getPrototypeOf(r);
} return i => new i; }); }
function vl(e) { return ci(e) ? () => { let t = vl(z(e)); return t && t(); } : pi(e); }
function ZM(e, t, n, o, r) { let i = e, s = t; for (; i !== null && s !== null && s[A] & 2048 && !$e(s);) {
    let a = nm(i, s, n, o | 2, ot);
    if (a !== ot)
        return a;
    let c = i.parent;
    if (!c) {
        let l = s[ac];
        if (l) {
            let u = l.get(n, ot, o & -5);
            if (u !== ot)
                return u;
        }
        c = rm(s), s = s[wn];
    }
    i = c;
} return r; }
function rm(e) { let t = e[m], n = t.type; return n === 2 ? t.declTNode : n === 1 ? e[ie] : null; }
function Ss(e) { return WM(M(), e); }
var KM = () => (typeof requestIdleCallback < "u" ? requestIdleCallback : e => setTimeout(e)).bind(globalThis), JM = () => (typeof requestIdleCallback < "u" ? cancelIdleCallback : clearTimeout).bind(globalThis), _s = new b("", { factory: () => new yl });
function XM(e) { return Be([{ provide: _s, useExisting: e }]); }
var yl = class {
    requestIdleCallback = KM();
    cancelIdleCallback = JM();
    requestOnIdle(t, n) { return this.requestIdleCallback(t, n); }
    cancelOnIdle(t) { return this.cancelIdleCallback(t); }
}, Pn = "__annotations__", Fn = "__parameters__", Hn = "__prop__metadata__";
function eo(e, t, n, o, r) { return rt(() => { let i = Cu(t); function s(...a) { if (this instanceof s)
    return i.call(this, ...a), this; let c = new s(...a); return function (u) { return r && r(u, ...a), (u.hasOwnProperty(Pn) ? u[Pn] : Object.defineProperty(u, Pn, { value: [] })[Pn]).push(c), u; }; } return n && (s.prototype = Object.create(n.prototype)), s.prototype.ngMetadataName = e, s.annotationCls = s, s; }); }
function Cu(e) { return function (...n) { if (e) {
    let o = e(...n);
    for (let r in o)
        this[r] = o[r];
} }; }
function to(e, t, n) { return rt(() => { let o = Cu(t); function r(...i) { if (this instanceof r)
    return o.apply(this, i), this; let s = new r(...i); return a.annotation = s, a; function a(c, l, u) { let d = c.hasOwnProperty(Fn) ? c[Fn] : Object.defineProperty(c, Fn, { value: [] })[Fn]; for (; d.length <= u;)
    d.push(null); return (d[u] = d[u] || []).push(s), c; } } return r.prototype.ngMetadataName = e, r.annotationCls = r, r; }); }
function ht(e, t, n, o) { return rt(() => { let r = Cu(t); function i(...s) { if (this instanceof i)
    return r.apply(this, s), this; let a = new i(...s); function c(l, u) { if (l === void 0)
    throw new Error("Standard Angular field decorators are not supported in JIT mode."); let d = l.constructor, f = d.hasOwnProperty(Hn) ? d[Hn] : Object.defineProperty(d, Hn, { value: {} })[Hn]; f[u] = f.hasOwnProperty(u) && f[u] || [], f[u].unshift(a); } return c; } return n && (i.prototype = Object.create(n.prototype)), i.prototype.ngMetadataName = e, i.annotationCls = i, i; }); }
function Q(e) { let t = Te.ng; if (t && t.\u0275compilerFacade)
    return t.\u0275compilerFacade; throw new Error("JIT compiler unavailable"); }
function gt(e) { return { token: e.token, providedIn: e.autoProvided === !1 ? null : "root", factory: e.factory, value: void 0 }; }
var ns = { \u0275\u0275defineInjectable: ae, \u0275\u0275defineInjector: Co, \u0275\u0275defineService: gt, \u0275\u0275inject: je, \u0275\u0275invalidFactoryDep: fi, resolveForwardRef: z }, im = Function;
function Ai(e) { return typeof e == "function"; }
var eN = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*(arguments|(?:[^()]+\(\[\],)?[^()]+\(arguments\).*)\)/, tN = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{/, nN = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(/, oN = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(\)\s*{[^}]*super\(\.\.\.arguments\)/;
function rN(e) { return eN.test(e) || oN.test(e) || tN.test(e) && !nN.test(e); }
var os = class {
    _reflect;
    constructor(t) { this._reflect = t || Te.Reflect; }
    factory(t) { return (...n) => new t(...n); }
    _zipTypesAndAnnotations(t, n) { let o; typeof t > "u" ? o = So(n.length) : o = So(t.length); for (let r = 0; r < o.length; r++)
        typeof t > "u" ? o[r] = [] : t[r] && t[r] != Object ? o[r] = [t[r]] : o[r] = [], n && n[r] != null && (o[r] = o[r].concat(n[r])); return o; }
    _ownParameters(t, n) { let o = t.toString(); if (rN(o))
        return null; if (t.parameters && t.parameters !== n.parameters)
        return t.parameters; let r = t.ctorParameters; if (r && r !== n.ctorParameters) {
        let a = typeof r == "function" ? r() : r, c = a.map(u => u && u.type), l = a.map(u => u && Wc(u.decorators));
        return this._zipTypesAndAnnotations(c, l);
    } let i = t.hasOwnProperty(Fn) && t[Fn], s = this._reflect && this._reflect.getOwnMetadata && this._reflect.getOwnMetadata("design:paramtypes", t); return s || i ? this._zipTypesAndAnnotations(s, i) : So(t.length); }
    parameters(t) { if (!Ai(t))
        return []; let n = Ri(t), o = this._ownParameters(t, n); return !o && n !== Object && (o = this.parameters(n)), o || []; }
    _ownAnnotations(t, n) { if (t.annotations && t.annotations !== n.annotations) {
        let o = t.annotations;
        return typeof o == "function" && o.annotations && (o = o.annotations), o;
    } return t.decorators && t.decorators !== n.decorators ? Wc(t.decorators) : t.hasOwnProperty(Pn) ? t[Pn] : null; }
    annotations(t) { if (!Ai(t))
        return []; let n = Ri(t), o = this._ownAnnotations(t, n) || []; return (n !== Object ? this.annotations(n) : []).concat(o); }
    _ownPropMetadata(t, n) { if (t.propMetadata && t.propMetadata !== n.propMetadata) {
        let o = t.propMetadata;
        return typeof o == "function" && o.propMetadata && (o = o.propMetadata), o;
    } if (t.propDecorators && t.propDecorators !== n.propDecorators) {
        let o = t.propDecorators, r = {};
        return Object.keys(o).forEach(i => { r[i] = Wc(o[i]); }), r;
    } return t.hasOwnProperty(Hn) ? t[Hn] : null; }
    propMetadata(t) { if (!Ai(t))
        return {}; let n = Ri(t), o = {}; if (n !== Object) {
        let i = this.propMetadata(n);
        Object.keys(i).forEach(s => { o[s] = i[s]; });
    } let r = this._ownPropMetadata(t, n); return r && Object.keys(r).forEach(i => { let s = []; o.hasOwnProperty(i) && s.push(...o[i]), s.push(...r[i]), o[i] = s; }), o; }
    ownPropMetadata(t) { return Ai(t) ? this._ownPropMetadata(t, Ri(t)) || {} : {}; }
    hasLifecycleHook(t, n) { return t instanceof im && n in t.prototype; }
};
function Wc(e) { return e ? e.map(t => { let o = t.type.annotationCls, r = t.args ? t.args : []; return new o(...r); }) : []; }
function Ri(e) { let t = e.prototype ? Object.getPrototypeOf(e.prototype) : null; return (t ? t.constructor : null) || Object; }
var sm = Nn(to("Inject", e => ({ token: e })), -1), am = Nn(to("Optional"), 8), cm = Nn(to("Self"), 2), lm = Nn(to("SkipSelf"), 4), um = Nn(to("Host"), 1), dm = to("Attribute", e => ({ attributeName: e, __NG_ELEMENT_ID__: () => Ss(e) })), Th = null;
function Mu() { return Th = Th || new os; }
function _r(e) { return fm(Mu().parameters(e)); }
function fm(e) { return e.map(t => iN(t)); }
function iN(e) { let t = { token: null, attribute: null, host: !1, optional: !1, self: !1, skipSelf: !1 }; if (Array.isArray(e) && e.length > 0)
    for (let n = 0; n < e.length; n++) {
        let o = e[n];
        if (o === void 0)
            continue;
        let r = Object.getPrototypeOf(o);
        if (o instanceof am || r.ngMetadataName === "Optional")
            t.optional = !0;
        else if (o instanceof lm || r.ngMetadataName === "SkipSelf")
            t.skipSelf = !0;
        else if (o instanceof cm || r.ngMetadataName === "Self")
            t.self = !0;
        else if (o instanceof um || r.ngMetadataName === "Host")
            t.host = !0;
        else if (o instanceof sm)
            t.token = o.token;
        else if (o instanceof dm) {
            if (o.attributeName === void 0)
                throw new S(-204, !1);
            t.attribute = o.attributeName;
        }
        else
            t.token = o;
    }
else
    e === void 0 || Array.isArray(e) && e.length === 0 ? t.token = null : t.token = e; return t; }
function sN(e, t) { let n = null, o = null; e.hasOwnProperty(Cn) || Object.defineProperty(e, Cn, { get: () => (n === null && (n = Q({ usage: 0, kind: "injectable", type: e }).compileInjectable(ns, `ng:///${e.name}/\u0275prov.js`, uN(e, t))), n) }), e.hasOwnProperty(Qe) || Object.defineProperty(e, Qe, { get: () => { if (o === null) {
        let r = Q({ usage: 0, kind: "injectable", type: e });
        o = r.compileFactory(ns, `ng:///${e.name}/\u0275fac.js`, { name: e.name, type: e, typeArgumentCount: 0, deps: _r(e), target: r.FactoryTarget.Injectable });
    } return o; }, configurable: !0 }); }
var aN = Ya({ provide: String, useValue: Ya });
function Ch(e) { return e.useClass !== void 0; }
function cN(e) { return aN in e; }
function Mh(e) { return e.useFactory !== void 0; }
function lN(e) { return e.useExisting !== void 0; }
function uN(e, t) { let n = t || { providedIn: null }, o = { name: e.name, type: e, typeArgumentCount: 0, providedIn: n.providedIn }; return (Ch(n) || Mh(n)) && n.deps !== void 0 && (o.deps = fm(n.deps)), Ch(n) ? o.useClass = n.useClass : cN(n) ? o.useValue = n.useValue : Mh(n) ? o.useFactory = n.useFactory : lN(n) && (o.useExisting = n.useExisting), o; }
var dN = eo("Injectable", void 0, void 0, void 0, (e, t) => sN(e, t));
function fN(e, t) { let n = null, o = null; e.hasOwnProperty(Cn) || Object.defineProperty(e, Cn, { get: () => (n === null && (n = Q({ usage: 0, kind: "service", type: e }).compileService(ns, `ng:///${e.name}/\u0275prov.js`, pN(e, t))), n) }), e.hasOwnProperty(Qe) || Object.defineProperty(e, Qe, { get: () => { if (o === null) {
        let r = Q({ usage: 0, kind: "service", type: e });
        o = r.compileFactory(ns, `ng:///${e.name}/\u0275fac.js`, { name: e.name, type: e, typeArgumentCount: 0, deps: _r(e), target: r.FactoryTarget.Service });
    } return o; }, configurable: !0 }); }
function pN(e, t) { return { name: e.name, type: e, typeArgumentCount: 0, autoProvided: t?.autoProvided, factory: t?.factory }; }
var hN = eo("Service", void 0, void 0, void 0, (e, t) => fN(e, t));
function gN() { return no(M(), g()); }
function no(e, t) { return new br(te(e, t)); }
var br = (() => { class e {
    nativeElement;
    constructor(n) { this.nativeElement = n; }
    static __NG_ELEMENT_ID__ = gN;
} return e; })();
function pm(e) { return e instanceof br ? e.nativeElement : e; }
function mN() { return this._results[Symbol.iterator](); }
var rs = class {
    _emitDistinctChangesOnly;
    dirty = !0;
    _onDirty = void 0;
    _results = [];
    _changesDetected = !1;
    _changes = void 0;
    length = 0;
    first = void 0;
    last = void 0;
    get changes() { return this._changes ??= new Vg; }
    constructor(t = !1) { this._emitDistinctChangesOnly = t; }
    get(t) { return this._results[t]; }
    map(t) { return this._results.map(t); }
    filter(t) { return this._results.filter(t); }
    find(t) { return this._results.find(t); }
    reduce(t, n) { return this._results.reduce(t, n); }
    forEach(t) { this._results.forEach(t); }
    some(t) { return this._results.some(t); }
    toArray() { return this._results.slice(); }
    toString() { return this._results.toString(); }
    reset(t, n) { this.dirty = !1; let o = Ve(t); (this._changesDetected = !Tp(this._results, o, n)) && (this._results = o, this.length = o.length, this.last = o[this.length - 1], this.first = o[0]); }
    notifyOnChanges() { this._changes !== void 0 && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.next(this); }
    onDirty(t) { this._onDirty = t; }
    setDirty() { this.dirty = !0, this._onDirty?.(); }
    destroy() { this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe()); }
    [Symbol.iterator] = mN;
}, mn = "ngSkipHydration", vN = "ngskiphydration";
function Nu(e) { let t = e.mergedAttrs; if (t === null)
    return !1; for (let n = 0; n < t.length; n += 2) {
    let o = t[n];
    if (typeof o == "number")
        return !1;
    if (typeof o == "string" && o.toLowerCase() === vN)
        return !0;
} return !1; }
function hm(e) { return e.hasAttribute(mn); }
function ar(e) { return (e.flags & 128) === 128; }
function oo(e) { if (ar(e))
    return !0; let t = e.parent; for (; t;) {
    if (ar(e) || Nu(t))
        return !0;
    t = t.parent;
} return !1; }
function gm(e) { return ar(e) || Nu(e) || oo(e); }
var bs = (function (e) { return e[e.OnPush = 0] = "OnPush", e[e.Eager = 1] = "Eager", e[e.Default = 1] = "Default", e; })(bs || {}), As = new Map, yN = 0;
function EN() { return yN++; }
function IN(e) { As.set(e[Ce], e); }
function mm(e) { return As.get(e) || null; }
function El(e) { As.delete(e[Ce]); }
function DN() { return As; }
var is = class {
    lViewId;
    nodeIndex;
    native;
    component;
    directives;
    localRefs;
    get lView() { return mm(this.lViewId); }
    constructor(t, n, o) { this.lViewId = t, this.nodeIndex = n, this.native = o; }
};
function Ee(e) { let t = zi(e); if (t) {
    if (ee(t)) {
        let n = t, o, r, i;
        if (vm(e)) {
            if (o = NN(n, e), o == -1)
                throw new Error("The provided component was not found in the application");
            r = e;
        }
        else if (CN(e)) {
            if (o = wN(n, e), o == -1)
                throw new Error("The provided directive was not found in the application");
            i = ym(o, n);
        }
        else if (o = wh(n, e), o == -1)
            return null;
        let s = x(n[o]), a = zi(s), c = a && !Array.isArray(a) ? a : Nh(n, o, s);
        if (r && c.component === void 0 && (c.component = r, Le(c.component, c)), i && c.directives === void 0) {
            c.directives = i;
            for (let l = 0; l < i.length; l++)
                Le(i[l], c);
        }
        Le(c.native, c), t = c;
    }
}
else {
    let n = e, o = n;
    for (; o = o.parentNode;) {
        let r = zi(o);
        if (r) {
            let i = Array.isArray(r) ? r : r.lView;
            if (!i)
                return null;
            let s = wh(i, n);
            if (s >= 0) {
                let a = x(i[s]), c = Nh(i, s, a);
                Le(a, c), t = c;
                break;
            }
        }
    }
} return t || null; }
function Nh(e, t, n) { return new is(e[Ce], t, n); }
var Il = "__ngContext__";
function Le(e, t) { ee(t) ? (e[Il] = t[Ce], IN(t)) : e[Il] = t; }
function zi(e) { let t = e[Il]; return typeof t == "number" ? mm(t) : t || null; }
function TN(e) { let t = zi(e); return t ? ee(t) ? t : t.lView : null; }
function vm(e) { return e && e.constructor && e.constructor.\u0275cmp; }
function CN(e) { return e && e.constructor && e.constructor.\u0275dir; }
function wh(e, t) { let n = e[m]; for (let o = E; o < n.bindingStartIndex; o++)
    if (x(e[o]) === t)
        return o; return -1; }
function MN(e) { if (e.child)
    return e.child; if (e.next)
    return e.next; for (; e.parent && !e.parent.next;)
    e = e.parent; return e.parent && e.parent.next; }
function NN(e, t) { let n = e[m].components; if (n)
    for (let o = 0; o < n.length; o++) {
        let r = n[o];
        if (de(r, e)[P] === t)
            return r;
    }
else if (de(E, e)[P] === t)
    return E; return -1; }
function wN(e, t) { let n = e[m].firstChild; for (; n;) {
    let o = n.directiveStart, r = n.directiveEnd;
    for (let i = o; i < r; i++)
        if (e[i] === t)
            return n.index;
    n = MN(n);
} return -1; }
function ym(e, t) { let n = t[m].data[e]; if (n.directiveStart === 0)
    return j; let o = []; for (let r = n.directiveStart; r < n.directiveEnd; r++) {
    let i = t[r];
    vm(i) || o.push(i);
} return o; }
function SN(e, t) { let n = t[m].data[e]; return ve(n) ? t[n.directiveStart + n.componentOffset] : null; }
function _N(e, t) { let n = e[m].data[t]; if (n && n.localNames) {
    let o = {}, r = n.index + 1;
    for (let i = 0; i < n.localNames.length; i += 2)
        o[n.localNames[i]] = e[r], r++;
    return o;
} return null; }
function Em(e) { return Dm(e[Ct]); }
function Im(e) { return Dm(e[ue]); }
function Dm(e) { for (; e !== null && !Z(e);)
    e = e[ue]; return e; }
function* bN(e, t) { let n = e.child; for (; n;)
    yield [n, t], n = n.next; if (e.componentOffset > -1) {
    let r = de(e.index, t);
    if (ee(r)) {
        let s = r[m].firstChild;
        for (; s;)
            yield [s, r], s = s.next;
    }
} let o = t[e.index]; if (Z(o))
    for (let r = H; r < o.length; r++) {
        let i = o[r], a = i[m].firstChild;
        for (; a;)
            yield [a, i], a = a.next;
    } }
function* AN(e) { let n = e[m].firstChild; for (; n;)
    yield* Ga(Tm(n, e)), n = n.next; }
function* Tm(e, t) { yield [e, t]; for (let [n, o] of bN(e, t))
    yield* Ga(Tm(n, o)); }
function* wu(e) { for (let [t, n] of AN(e))
    t.directiveEnd > t.directiveStart && (yield [t, n]); }
function Sh(e) { let t = Ee(e); if (t === null)
    return null; if (t.component === void 0) {
    let n = t.lView;
    if (n === null)
        return null;
    t.component = SN(t.nodeIndex, n);
} return t.component; }
function RN(e) { VN(e); let t = Ee(e), n = t ? t.lView : null; return n === null ? null : n[P]; }
function kN(e) { let t = Ee(e), n = t ? t.lView : null; if (n === null)
    return null; let o; for (; n[m].type === 2 && (o = Je(n));)
    n = o; return $e(n) ? null : n[P]; }
function Su(e) { let t = Ee(e), n = t ? t.lView : null; if (n === null)
    return me.NULL; let o = n[m].data[t.nodeIndex]; return new ye(o, n); }
function xN(e) { let t = Ee(e), n = t ? t.lView : null; if (n === null)
    return []; let o = n[m], r = o.data[t.nodeIndex], i = [], s = r.providerIndexes & 1048575, a = r.directiveEnd; for (let c = s; c < a; c++) {
    let l = o.data[c];
    jN(l) && (l = l.type), i.push(l);
} return i; }
function ON(e) { if (e instanceof Text)
    return []; let t = Ee(e), n = t ? t.lView : null; if (n === null)
    return []; let o = n[m], r = t.nodeIndex; return o?.data[r] ? (t.directives === void 0 && (t.directives = ym(r, n)), t.directives === null ? [] : [...t.directives]) : []; }
var Cm = (function (e) { return e[e.Default = 0] = "Default", e[e.OnPush = 1] = "OnPush", e; })(Cm || {}), Mm = (function (e) { return e[e.Emulated = 0] = "Emulated", e[e.None = 1] = "None", e; })(Mm || {});
function LN(e) { let t = Ee(e); if (t === null)
    return {}; if (t.localRefs === void 0) {
    let n = t.lView;
    if (n === null)
        return {};
    t.localRefs = _N(n, t.nodeIndex);
} return t.localRefs || {}; }
function PN(e) { return Ee(e).native; }
function FN(e) { let t = Ee(e), n = t === null ? null : t.lView; if (n === null)
    return []; let o = n[m], r = n[Ut], i = o.cleanup, s = []; if (i && r)
    for (let a = 0; a < i.length;) {
        let c = i[a++], l = i[a++];
        if (typeof c == "string") {
            let u = c, d = x(n[l]), f = r[i[a++]], p = i[a++], h = typeof p == "boolean" || p >= 0 ? "dom" : "output", v = typeof p == "boolean" ? p : !1;
            e == d && s.push({ element: e, name: u, callback: f, useCapture: v, type: h });
        }
    } return s.sort(HN), s; }
function HN(e, t) { return e.name == t.name ? 0 : e.name < t.name ? -1 : 1; }
function jN(e) { return e.type !== void 0 && e.declaredInputs !== void 0 && e.resolveHostDirectives !== void 0; }
function VN(e) { if (typeof Element < "u" && !(e instanceof Element))
    throw new Error("Expecting instance of DOM Element"); }
var Dl;
function BN(e) { Dl = e; }
function Ar() { if (Dl !== void 0)
    return Dl; if (typeof document < "u")
    return document; throw new S(210, !1); }
var _u = "h", bu = "b", Nm = "f", wm = "n", Rr = "e", Rs = "t", ro = "c", kr = "x", ft = "r", ks = "i", xr = "n", io = "d", xs = "l", Os = "di", Or = "s", Au = "p", Lr = "t", vn = new b(""), Sm = !1, Ru = new b("", { factory: () => Sm }), ku = new b(""), Ls = new b(""), xu = !1, _m = new b("", { factory: () => [] }), Ou = new b(""), Pr = new b("", { factory: () => new Map }), UN = new b(""), ss = { passive: !0, capture: !0 }, qc = new WeakMap, Qc = new WeakMap, Rt = new WeakMap, as = ["click", "keydown"], cs = ["mouseenter", "mouseover", "focusin"], ki = new Map, cr = class {
    callbacks = new Set;
    listener = () => { for (let t of this.callbacks)
        t(); };
};
function bm(e, t) { let n = Qc.get(e); if (!n) {
    n = new cr, Qc.set(e, n);
    for (let o of as)
        e.addEventListener(o, n.listener, ss);
} return n.callbacks.add(t), () => { let { callbacks: o, listener: r } = n; if (o.delete(t), o.size === 0) {
    Qc.delete(e);
    for (let i of as)
        e.removeEventListener(i, r, ss);
} }; }
function Am(e, t) { let n = qc.get(e); if (!n) {
    n = new cr, qc.set(e, n);
    for (let o of cs)
        e.addEventListener(o, n.listener, ss);
} return n.callbacks.add(t), () => { let { callbacks: o, listener: r } = n; if (o.delete(t), o.size === 0) {
    for (let i of cs)
        e.removeEventListener(i, r, ss);
    qc.delete(e);
} }; }
function $N(e) { let t = Rm(e); return new IntersectionObserver(n => { for (let o of n)
    o.isIntersecting && Rt.has(o.target) && Rt.get(o.target)?.get(t)?.listener(); }, e); }
function GN(e, t, n, o) { let r = Rm(o), i = Rt.get(e)?.get(r); ki.has(r) || ki.set(r, { observer: n(o), count: 0 }); let s = ki.get(r); if (!i) {
    i = new cr, s.observer.observe(e);
    let a = Rt.get(e);
    a ? a.set(r, i) : (a = new Map, Rt.set(e, a)), a.set(r, i), s.count++;
} return i.callbacks.add(t), () => { if (Rt.get(e)?.has(r)) {
    if (i.callbacks.delete(t), i.callbacks.size === 0) {
        s.observer.unobserve(e), s.count--;
        let a = Rt.get(e);
        a && (a.delete(r), a.size === 0 && Rt.delete(e));
    }
    s.count === 0 && (s.observer.disconnect(), ki.delete(r));
} }; }
function Rm(e) {
    return e ? `${e.rootMargin}/${typeof e.threshold == "number" ? e.threshold : e.threshold?.join(`
`)}` : "";
}
var so = "ngb";
function Lu(e, t, n = null) { if (t.length === 0 || e.nodeType !== Node.ELEMENT_NODE)
    return; let o = e.getAttribute(xn.JSACTION), r = t.reduce((s, a) => (o?.indexOf(a) ?? -1) === -1 ? s + a + ":;" : s, ""); e.setAttribute(xn.JSACTION, `${o ?? ""}${r}`); let i = n ?? ""; i !== "" && r.length > 0 && e.setAttribute(so, i); }
var km = (e, t, n) => { let o = e, r = o.__jsaction_fns ?? new Map, i = r.get(t) ?? []; i.push(n), r.set(t, i), o.__jsaction_fns = r; }, Pu = (e, t) => { let n = e, o = n.getAttribute(so) ?? "", r = t.get(o) ?? new Set; r.has(n) || r.add(n), t.set(o, r); };
function zN(e, t) { if (e.length > 0) {
    let n = [];
    for (let r of e)
        t.has(r) && (n = [...n, ...t.get(r)]);
    new Set(n).forEach(Fu);
} }
var Fu = e => { e.removeAttribute(xn.JSACTION), e.removeAttribute(so), e.__jsaction_fns = void 0; }, Hu = new b("", { factory: () => ({}) }), Tl = new WeakMap;
function WN(e, t) { if (e == null || typeof e != "object")
    return; let n = Tl.get(e); n || (n = new WeakSet, Tl.set(e, n)), n.add(t); }
function ju(e, t) { let n = t?.__jsaction_fns?.get(e.type); if (!(!n || !t?.isConnected) && !(t && Tl.get(e)?.has(t)))
    for (let o of n)
        o(e); }
var Cl = new Map;
function xm(e, t) { return Cl.set(e, t), () => Cl.delete(e); }
var _h = !1, Om = (e, t, n, o) => { };
function qN(e, t, n, o) { Om(e, t, n, o); }
function Lm() { _h || (Om = (e, t, n, o) => { let r = e[R].get(ct); Cl.get(r)?.(t, n, o); }, _h = !0); }
var mt = new b(""), QN = (() => { class e {
    registry = new Map;
    cleanupFns = new Map;
    jsActionMap = I(Pr);
    contract = I(Hu);
    add(n, o) { if (this.registry.set(n, o), this.awaitingCallbacks.has(n)) {
        let r = this.awaitingCallbacks.get(n);
        for (let i of r)
            i();
    } }
    get(n) { return this.registry.get(n) ?? null; }
    has(n) { return this.registry.has(n); }
    cleanup(n) { zN(n, this.jsActionMap); for (let o of n)
        this.registry.delete(o), this.jsActionMap.delete(o), this.invokeTriggerCleanupFns(o), this.hydrating.delete(o), this.awaitingCallbacks.delete(o); this.size === 0 && this.contract.instance?.cleanUp(); }
    get size() { return this.registry.size; }
    addCleanupFn(n, o) { let r = []; this.cleanupFns.has(n) && (r = this.cleanupFns.get(n)), r.push(o), this.cleanupFns.set(n, r); }
    invokeTriggerCleanupFns(n) { let o = this.cleanupFns.get(n) ?? []; for (let r of o)
        r(); this.cleanupFns.delete(n); }
    hydrating = new Map;
    awaitingCallbacks = new Map;
    awaitParentBlock(n, o) { let r = this.awaitingCallbacks.get(n) ?? []; r.push(o), this.awaitingCallbacks.set(n, r); }
    static \u0275prov = ae({ token: e, providedIn: null, factory: () => new e });
} return e; })();
function ao(e) { return (e.flags & 32) === 32; }
var Pm = "__nghData__", Ps = Pm, Fm = "__nghDeferData__", Fs = Fm;
function YN(e) { return e === Pm || e === Fm; }
var Un = "ngh", Hm = "nghm", jm = () => null;
function ZN(e, t, n = !1) { let o = e.getAttribute(Un); if (o == null)
    return null; let [r, i] = o.split("|"); if (o = n ? i : r, !o)
    return null; let s = i ? `|${i}` : "", a = n ? r : s, c = {}; if (o !== "") {
    let u = t.get(Yt, null, { optional: !0 });
    u !== null && (c = u.get(Ps, [])[Number(o)]);
} let l = { data: c, firstChild: e.firstChild ?? null }; return n && (l.firstChild = e, Hs(l, 0, e.nextSibling)), a ? e.setAttribute(Un, a) : e.removeAttribute(Un), l; }
function Vm() { jm = ZN; }
function Bm(e, t, n = !1) { return jm(e, t, n); }
function Vu(e) { let t = e._lView; return t[m].type === 2 ? null : ($e(t) && (t = t[E]), t); }
function KN(e) { return e.textContent?.replace(/\s/gm, ""); }
function JN(e) { let t = Ar(), n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, { acceptNode(i) { let s = KN(i); return s === "ngetn" || s === "ngtns" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } }), o, r = []; for (; o = n.nextNode();)
    r.push(o); for (let i of r)
    i.textContent === "ngetn" ? i.replaceWith(t.createTextNode("")) : i.remove(); }
var Um = (function (e) { return e.Hydrated = "hydrated", e.Skipped = "skipped", e.Mismatched = "mismatched", e; })(Um || {}), XN = "__ngDebugHydrationInfo__";
function ew(e) { return e[XN] ?? null; }
function Hs(e, t, n) { e.segmentHeads ??= {}, e.segmentHeads[t] = n; }
function Ml(e, t) { return e.segmentHeads?.[t] ?? null; }
function Fr(e) { return e.get(Ou, !1, { optional: !0 }); }
var tw = !1;
function nw() { tw = !1; }
function $m(e, t) { let n = e.data, o = n[Rr]?.[t] ?? null; return o === null && n[ro]?.[t] && (o = Bu(e, t)), o; }
function ow(e, t) { return e.data[Rr]?.[t] !== void 0; }
function Gm(e, t) { return e.data[ro]?.[t] ?? null; }
function Bu(e, t) { let n = Gm(e, t) ?? [], o = 0; for (let r of n)
    o += r[ft] * (r[kr] ?? 1); return o; }
function zm(e) { if (typeof e.disconnectedNodes > "u") {
    let t = e.data[io];
    e.disconnectedNodes = t ? new Set(t) : null;
} return e.disconnectedNodes; }
function js(e, t) { if (typeof e.disconnectedNodes > "u") {
    let n = e.data[io];
    e.disconnectedNodes = n ? new Set(n) : null;
} return !!zm(e)?.has(t); }
function Vs(e, t) { let n = e[ce]; return n !== null && !jo() && !ao(t) && !js(n, t.index - E); }
function Uu(e, t) { let n = t, o = e.corruptedTextNodes; n.textContent === "" ? o.set(n, "ngetn") : n.nextSibling?.nodeType === Node.TEXT_NODE && o.set(n, "ngtns"); }
function Wm(e) { let t = []; return e !== null && (e.has(4) && t.push(...cs), e.has(3) && t.push(...as)), t; }
function rw(e, t) { let n = t.get(mt), r = t.get(Yt).get(Fs, {}), i = !1, s = e, a = null, c = []; for (; !i && s;) {
    i = n.has(s);
    let l = n.hydrating.get(s);
    if (a === null && l != null) {
        a = l.promise;
        break;
    }
    c.unshift(s), s = r[s][Au];
} return { parentBlockPromise: a, hydrationQueue: c }; }
function iw(e) { let t = e.body.querySelectorAll("[jsaction]"), n = new Set, o = [cs.join(":;"), as.join(":;")].join("|"); for (let r of t) {
    let i = r.getAttribute("jsaction"), s = r.getAttribute("ngb");
    i?.match(o) && s !== null && n.add(r);
} return n; }
function sw(e, t) { let n = iw(e), o = t.get(Pr); for (let r of n)
    Pu(r, o); }
var qm = () => ({});
function aw(e) { let t = e.get(Yt, null, { optional: !0 }); return t !== null ? t.get(Fs, {}) : {}; }
function cw() { qm = aw; }
function lw(e) { return qm(e); }
function uw(e) { return typeof e == "object" && e.trigger === 5; }
function dw(e) { return e[Lr]?.find(n => uw(n))?.delay ?? null; }
function fw(e) { let t = e[Lr]; if (t)
    for (let n of t) {
        if (n === 2)
            return !0;
        if (typeof n == "object" && n.trigger === 2)
            return n.intersectionObserverOptions || !0;
    } return null; }
function bh(e, t) { return e[Lr]?.includes(t) ?? !1; }
function pw(e) { return { data: e, hydrate: { idle: bh(e, 0), immediate: bh(e, 1), timer: dw(e), viewport: fw(e) } }; }
function hw(e) { let t = lw(e), n = new Map; for (let o in t)
    n.set(o, pw(t[o])); return n; }
function Yc(e) { return !!e && e.nodeType === Node.COMMENT_NODE && e.textContent?.trim() === Hm; }
function Ah(e) { for (; e && e.nodeType === Node.TEXT_NODE;)
    e = e.previousSibling; return e; }
function Qm(e) { for (let o of e.body.childNodes)
    if (Yc(o))
        return; let t = Ah(e.body.previousSibling); if (Yc(t))
    return; let n = Ah(e.head.lastChild); if (!Yc(n))
    throw new S(-507, !1); }
function Ym(e, t) { let n = e.contentQueries; if (n !== null) {
    let o = L(null);
    try {
        for (let r = 0; r < n.length; r += 2) {
            let i = n[r], s = n[r + 1];
            if (s !== -1) {
                let a = e.data[s];
                Vo(i), a.contentQueries(2, t[s], s);
            }
        }
    }
    finally {
        L(o);
    }
} }
function Nl(e, t, n) { Vo(0); let o = L(null); try {
    t(e, n);
}
finally {
    L(o);
} }
function $u(e, t, n) { if (lc(t)) {
    let o = L(null);
    try {
        let r = t.directiveStart, i = t.directiveEnd;
        for (let s = r; s < i; s++) {
            let a = e.data[s];
            if (a.contentQueries) {
                let c = n[s];
                a.contentQueries(1, c, s);
            }
        }
    }
    finally {
        L(o);
    }
} }
var Pe = (function (e) { return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e[e.ExperimentalIsolatedShadowDom = 4] = "ExperimentalIsolatedShadowDom", e; })(Pe || {}), gw = { name: "custom-elements" }, mw = { name: "no-errors-schema" }, Zm = !1;
function vw(e) { Zm = e; }
function yw() { return Zm; }
var Km = !1;
function Ew(e) { Km = e; }
function Iw() { return Km; }
var xi;
function Jm() { if (xi === void 0 && (xi = null, Te.trustedTypes))
    try {
        xi = Te.trustedTypes.createPolicy("angular", { createHTML: e => e, createScript: e => e, createScriptURL: e => e });
    }
    catch { } return xi; }
function co(e) { return Jm()?.createHTML(e) || e; }
function Dw(e) { return Jm()?.createScriptURL(e) || e; }
var Oi;
function Gu() { if (Oi === void 0 && (Oi = null, Te.trustedTypes))
    try {
        Oi = Te.trustedTypes.createPolicy("angular#unsafe-bypass", { createHTML: e => e, createScript: e => e, createScriptURL: e => e });
    }
    catch { } return Oi; }
function Rh(e) { return Gu()?.createHTML(e) || e; }
function kh(e) { return Gu()?.createScript(e) || e; }
function xh(e) { return Gu()?.createScriptURL(e) || e; }
var pt = class {
    changingThisBreaksApplicationSecurity;
    constructor(t) { this.changingThisBreaksApplicationSecurity = t; }
    toString() { return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${ii})`; }
}, wl = class extends pt {
    getTypeName() { return "HTML"; }
}, Sl = class extends pt {
    getTypeName() { return "Style"; }
}, _l = class extends pt {
    getTypeName() { return "Script"; }
}, bl = class extends pt {
    getTypeName() { return "URL"; }
}, Al = class extends pt {
    getTypeName() { return "ResourceURL"; }
};
function vt(e) { return e instanceof pt ? e.changingThisBreaksApplicationSecurity : e; }
function lo(e, t) { let n = Xm(e); if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL")
        return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${ii})`);
} return n === t; }
function Xm(e) { return e instanceof pt && e.getTypeName() || null; }
function Tw(e) { return new wl(e); }
function Cw(e) { return new Sl(e); }
function Mw(e) { return new _l(e); }
function Nw(e) { return new bl(e); }
function ww(e) { return new Al(e); }
function ev(e) { let t = new kl(e); return Sw() ? new Rl(t) : t; }
var Rl = class {
    inertDocumentHelper;
    constructor(t) { this.inertDocumentHelper = t; }
    getInertBodyElement(t) { t = "<body><remove></remove>" + t; try {
        let n = new window.DOMParser().parseFromString(co(t), "text/html").body;
        return n === null ? this.inertDocumentHelper.getInertBodyElement(t) : (n.firstChild?.remove(), n);
    }
    catch {
        return null;
    } }
}, kl = class {
    defaultDoc;
    inertDocument;
    constructor(t) { this.defaultDoc = t, this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert"); }
    getInertBodyElement(t) { let n = this.inertDocument.createElement("template"); return n.innerHTML = co(t), n; }
};
function Sw() { try {
    return !!new window.DOMParser().parseFromString(co(""), "text/html");
}
catch {
    return !1;
} }
var _w = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Bs(e) { return e = String(e), e.match(_w) ? e : "unsafe:" + e; }
function yt(e) { let t = {}; for (let n of e.split(","))
    t[n] = !0; return t; }
function Hr(...e) { let t = {}; for (let n of e)
    for (let o in n)
        n.hasOwnProperty(o) && (t[o] = !0); return t; }
var tv = yt("area,br,col,hr,img,wbr"), nv = yt("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"), ov = yt("rp,rt"), bw = Hr(ov, nv), Aw = Hr(nv, yt("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")), Rw = Hr(ov, yt("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")), xl = Hr(tv, Aw, Rw, bw), rv = yt("background,cite,href,itemtype,longdesc,poster,src,xlink:href"), kw = yt("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"), xw = yt("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"), Ol = Hr(rv, kw, xw), Ow = yt("script,style,template"), Ll = class {
    sanitizedSomething = !1;
    buf = [];
    sanitizeChildren(t) { let n = t.firstChild, o = !0, r = []; for (; n;) {
        if (n.nodeType === Node.ELEMENT_NODE ? o = this.startElement(n) : n.nodeType === Node.TEXT_NODE ? this.chars(n.nodeValue) : this.sanitizedSomething = !0, o && n.firstChild) {
            r.push(n), n = Fw(n);
            continue;
        }
        for (; n;) {
            n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
            let i = Pw(n);
            if (i) {
                n = i;
                break;
            }
            n = r.pop();
        }
    } return this.buf.join(""); }
    startElement(t) { let n = Oh(t).toLowerCase(); if (!xl.hasOwnProperty(n))
        return this.sanitizedSomething = !0, !Ow.hasOwnProperty(n); this.buf.push("<"), this.buf.push(n); let o = t.attributes; for (let r = 0; r < o.length; r++) {
        let i = o.item(r), s = i.name, a = s.toLowerCase();
        if (!Ol.hasOwnProperty(a)) {
            this.sanitizedSomething = !0;
            continue;
        }
        let c = i.value;
        rv[a] && (c = Bs(c)), this.buf.push(" ", s, '="', Lh(c), '"');
    } return this.buf.push(">"), !0; }
    endElement(t) { let n = Oh(t).toLowerCase(); xl.hasOwnProperty(n) && !tv.hasOwnProperty(n) && (this.buf.push("</"), this.buf.push(n), this.buf.push(">")); }
    chars(t) { this.buf.push(Lh(t)); }
};
function Lw(e, t) { return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !== Node.DOCUMENT_POSITION_CONTAINED_BY; }
function Pw(e) { let t = e.nextSibling; if (t && e !== t.previousSibling)
    throw iv(t); return t; }
function Fw(e) { let t = e.firstChild; if (t && Lw(e, t))
    throw iv(t); return t; }
function Oh(e) { let t = e.nodeName; return typeof t == "string" ? t : "FORM"; }
function iv(e) { return new Error(`Failed to sanitize html because the element is clobbered: ${e.outerHTML}`); }
var Hw = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, jw = /([^\#-~ |!])/g;
function Lh(e) { return e.replace(/&/g, "&amp;").replace(Hw, function (t) { let n = t.charCodeAt(0), o = t.charCodeAt(1); return "&#" + ((n - 55296) * 1024 + (o - 56320) + 65536) + ";"; }).replace(jw, function (t) { return "&#" + t.charCodeAt(0) + ";"; }).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
var Li;
function sv(e, t) { let n = null; try {
    Li = Li || ev(e);
    let o = t ? String(t) : "";
    n = Li.getInertBodyElement(o);
    let r = 5, i = o;
    do {
        if (r === 0)
            throw new Error("Failed to sanitize html because the input is unstable");
        r--, o = i, i = n.innerHTML, n = Li.getInertBodyElement(o);
    } while (o !== i);
    let a = new Ll().sanitizeChildren(Pl(n) || n);
    return co(a);
}
finally {
    if (n) {
        let o = Pl(n) || n;
        for (; o.firstChild;)
            o.firstChild.remove();
    }
} }
function Pl(e) { return "content" in e && Vw(e) ? e.content : null; }
function Vw(e) { return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE"; }
var Bw = /^>|^->|<!--|-->|--!>|<!-$/g, Uw = /(<|>)/g, $w = "\u200B$1\u200B";
function Gw(e) { return e.replace(Bw, t => t.replace(Uw, $w)); }
function zu(e, t) { return e.createText(t); }
function av(e, t, n) { e.setValue(t, n); }
function Wu(e, t) { return e.createComment(Gw(t)); }
function Us(e, t, n) { return e.createElement(t, n); }
function rn(e, t, n, o, r) { e.insertBefore(t, n, o, r); }
function cv(e, t, n) { e.appendChild(t, n); }
function Ph(e, t, n, o, r) { o !== null ? rn(e, t, n, o, r) : cv(e, t, n); }
function jr(e, t, n, o) { e.removeChild(null, t, n, o); }
function lv(e) { e.textContent = ""; }
function zw(e, t, n) { e.setAttribute(t, "style", n); }
function Ww(e, t, n) { n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n); }
function uv(e, t, n) { let { mergedAttrs: o, classes: r, styles: i } = n; o !== null && VM(e, t, o), r !== null && Ww(e, t, r), i !== null && zw(e, t, i); }
function qw(e) { let t = g(); e.src = "", e.srcdoc = co(""), jr(t[C], e); }
var q = (function (e) { return e[e.NONE = 0] = "NONE", e[e.HTML = 1] = "HTML", e[e.STYLE = 2] = "STYLE", e[e.SCRIPT = 3] = "SCRIPT", e[e.URL = 4] = "URL", e[e.RESOURCE_URL = 5] = "RESOURCE_URL", e[e.ATTRIBUTE_NO_BINDING = 6] = "ATTRIBUTE_NO_BINDING", e; })(q || {}), zo, Fh = "svg", Qw = "math", dv = "", Hh = "*", Fl = () => Object.create(null);
function Yw() { return zo || (zo = Fl(), bt(q.HTML, void 0, [["iframe", ["srcdoc"]], ["*", ["innerHTML", "outerHTML"]]]), bt(q.STYLE, void 0, [["*", ["style"]]]), bt(q.URL, void 0, [["*", ["formAction"]], ["area", ["href"]], ["a", ["href", "xlink:href"]], ["form", ["action"]], ["img", ["src"]], ["video", ["src"]]]), bt(q.URL, Qw, [["*", ["href", "xlink:href"]]]), bt(q.RESOURCE_URL, void 0, [["base", ["href"]], ["embed", ["src"]], ["frame", ["src"]], ["iframe", ["src"]], ["link", ["href"]], ["object", ["codebase", "data"]]]), bt(q.URL, Fh, [["a", ["href", "xlink:href"]]]), bt(q.ATTRIBUTE_NO_BINDING, Fh, [["animate", ["attributeName", "values", "to", "from"]], ["set", ["to", "attributeName"]], ["animateMotion", ["attributeName"]], ["animateTransform", ["attributeName"]]]), bt(q.ATTRIBUTE_NO_BINDING, void 0, [["unknown", ["attributeName", "values", "to", "from", "sandbox", "allow", "allowFullscreen", "referrerPolicy", "csp", "fetchPriority", "credentialless"]], ["iframe", ["sandbox", "allow", "allowFullscreen", "referrerPolicy", "csp", "fetchPriority", "credentialless"]]]), zo); }
function bt(e, t, n) { let o = t ?? dv; for (let [r, i] of n) {
    let s = r.toLowerCase();
    for (let a of i) {
        let c = a.toLowerCase(), l = zo[c] ??= Fl(), u = l[o] ??= Fl();
        u[s] = e;
    }
} }
function jh(e, t, n) { let r = Yw()[t.toLowerCase()]; if (!r)
    return q.NONE; let i = e.toLowerCase(), s; if (n) {
    let a = r[n];
    a && (s = a[i] ?? a[Hh]);
} if (s === void 0) {
    let a = r[dv];
    a && (s = a[i] ?? a[Hh]);
} return s ?? q.NONE; }
function qu(e) { let t = Vr(); return t ? Rh(t.sanitize(q.HTML, e) || "") : lo(e, "HTML") ? Rh(vt(e)) : sv(Ar(), N(e)); }
function Qu(e) { let t = Vr(); return t ? t.sanitize(q.STYLE, e) || "" : lo(e, "Style") ? vt(e) : N(e); }
function Yu(e) { let t = Vr(); return t ? t.sanitize(q.URL, e) || "" : lo(e, "URL") ? vt(e) : Bs(N(e)); }
function $s(e) { let t = Vr(); if (t)
    return xh(t.sanitize(q.RESOURCE_URL, e) || ""); if (lo(e, "ResourceURL"))
    return xh(vt(e)); throw new S(904, !1); }
function Zu(e) { let t = Vr(); if (t)
    return kh(t.sanitize(q.SCRIPT, e) || ""); if (lo(e, "Script"))
    return kh(vt(e)); throw new S(905, !1); }
function fv(e) { return co(e[0]); }
function pv(e) { return Dw(e[0]); }
var Zw = { embed: { src: !0 }, frame: { src: !0 }, iframe: { src: !0 }, media: { src: !0 }, base: { href: !0 }, link: { href: !0 }, object: { data: !0, codebase: !0 } };
function Kw(e, t) { return Zw[e.toLowerCase()]?.[t.toLowerCase()] === !0 ? $s : Yu; }
function hv(e, t, n) { return Kw(t, n)(e); }
function Vr() { let e = g(); return e && e[Ze].sanitizer; }
var Pi = new Set(["href", "xlink:href"]), Jw = ["attributeName", "attributename"], Xw = { iframe: { sandbox: !0, allow: !0, allowfullscreen: !0, referrerpolicy: !0, csp: !0, fetchpriority: !0, credentialless: !0 }, ":svg:animate": { attributename: !0, to: Pi, values: Pi, from: Pi }, ":svg:set": { attributename: !0, to: Pi }, ":svg:animatemotion": { attributename: !0 }, ":svg:animatetransform": { attributename: !0 } };
function Ku(e, t, n) { let o = t.toLowerCase(), r = n.toLowerCase(), s = oe() === -1 ? null : we(); if (s && s.type !== 2)
    return e; let a = o[0] !== ":" && s?.namespace ? `:${s.namespace}:${o}` : o, c = Xw[a]?.[r]; if (!c)
    return e; let l = g(); if (s && o === "iframe") {
    let f = te(s, l);
    qw(f);
} let u = t[0] === ":" ? t.split(":").pop() : t; if (typeof c != "boolean") {
    if (!s)
        throw new S(-910, !1);
    let f = te(s, l);
    if (eS(f, c))
        throw new S(-910, !1);
    return e;
} let d = !1; throw new S(-910, d); }
function eS(e, t) { for (let n of Jw) {
    let o = e.getAttribute(n);
    if (o !== null && t.has(o.toLowerCase()))
        return o;
} return null; }
function tS() { return Be([]); }
function gv(e) { return e.ownerDocument.defaultView; }
function mv(e) { return e.ownerDocument; }
function Ju(e) { return e.ownerDocument.body; }
var nS = "\uFFFD";
function Wo(e) { return e instanceof Function ? e() : e; }
function oS(e, t, n) { let o = e.length; for (;;) {
    let r = e.indexOf(t, n);
    if (r === -1)
        return r;
    if (r === 0 || e.charCodeAt(r - 1) <= 32) {
        let i = t.length;
        if (r + i === o || e.charCodeAt(r + i) <= 32)
            return r;
    }
    n = r + 1;
} }
var vv = "ng-template";
function rS(e, t, n, o) { let r = 0; if (o) {
    for (; r < t.length && typeof t[r] == "string"; r += 2)
        if (t[r] === "class" && oS(t[r + 1].toLowerCase(), n, 0) !== -1)
            return !0;
}
else if (Xu(e))
    return !1; if (r = t.indexOf(1, r), r > -1) {
    let i;
    for (; ++r < t.length && typeof (i = t[r]) == "string";)
        if (i.toLowerCase() === n)
            return !0;
} return !1; }
function Xu(e) { return e.type === 4 && e.value !== vv; }
function iS(e, t, n) { let o = e.type === 4 && !n ? vv : e.value; return t === o; }
function sS(e, t, n) { let o = 4, r = e.attrs, i = r !== null ? lS(r) : 0, s = !1; for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
        if (!s && !ze(o) && !ze(c))
            return !1;
        if (s && ze(c))
            continue;
        s = !1, o = c | o & 1;
        continue;
    }
    if (!s)
        if (o & 4) {
            if (o = 2 | o & 1, c !== "" && !iS(e, c, n) || c === "" && t.length === 1) {
                if (ze(o))
                    return !1;
                s = !0;
            }
        }
        else if (o & 8) {
            if (r === null || !rS(e, r, c, n)) {
                if (ze(o))
                    return !1;
                s = !0;
            }
        }
        else {
            let l = t[++a], u = aS(c, r, Xu(e), n);
            if (u === -1) {
                if (ze(o))
                    return !1;
                s = !0;
                continue;
            }
            if (l !== "") {
                let d;
                if (u > i ? d = "" : d = r[u + 1].toLowerCase(), o & 2 && l !== d) {
                    if (ze(o))
                        return !1;
                    s = !0;
                }
            }
        }
} return ze(o) || s; }
function ze(e) { return (e & 1) === 0; }
function aS(e, t, n, o) { if (t === null)
    return -1; let r = 0; if (o || !n) {
    let i = !1;
    for (; r < t.length;) {
        let s = t[r];
        if (s === e)
            return r;
        if (s === 3 || s === 6)
            i = !0;
        else if (s === 1 || s === 2) {
            let a = t[++r];
            for (; typeof a == "string";)
                a = t[++r];
            continue;
        }
        else {
            if (s === 4)
                break;
            if (s === 0) {
                r += 4;
                continue;
            }
        }
        r += i ? 1 : 2;
    }
    return -1;
}
else
    return uS(t, e); }
function yv(e, t, n = !1) { for (let o = 0; o < t.length; o++)
    if (sS(e, t[o], n))
        return !0; return !1; }
function cS(e) { let t = e.attrs; if (t != null) {
    let n = t.indexOf(5);
    if ((n & 1) === 0)
        return t[n + 1];
} return null; }
function lS(e) { for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Qg(n))
        return t;
} return e.length; }
function uS(e, t) { let n = e.indexOf(4); if (n > -1)
    for (n++; n < e.length;) {
        let o = e[n];
        if (typeof o == "number")
            return -1;
        if (o === t)
            return n;
        n++;
    } return -1; }
function dS(e, t) { e: for (let n = 0; n < t.length; n++) {
    let o = t[n];
    if (e.length === o.length) {
        for (let r = 0; r < e.length; r++)
            if (e[r] !== o[r])
                continue e;
        return !0;
    }
} return !1; }
function Vh(e, t) { return e ? ":not(" + t.trim() + ")" : t; }
function fS(e) { let t = e[0], n = 1, o = 2, r = "", i = !1; for (; n < e.length;) {
    let s = e[n];
    if (typeof s == "string")
        if (o & 2) {
            let a = e[++n];
            r += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
        }
        else
            o & 8 ? r += "." + s : o & 4 && (r += " " + s);
    else
        r !== "" && !ze(s) && (t += Vh(i, r), r = ""), o = s, i = i || !ze(o);
    n++;
} return r !== "" && (t += Vh(i, r)), t; }
function pS(e) { return e.map(fS).join(","); }
function hS(e) { let t = [], n = [], o = 1, r = 2; for (; o < e.length;) {
    let i = e[o];
    if (typeof i == "string")
        r === 2 ? i !== "" && t.push(i, e[++o]) : r === 8 && n.push(i);
    else {
        if (!ze(r))
            break;
        r = i;
    }
    o++;
} return n.length && t.push(1, ...n), t; }
var F = {}, ls = (function (e) { return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e; })(ls || {}), Hl;
function ed(e, t) { return Hl(e, t); }
function gS(e) { Hl === void 0 && (Hl = e()); }
var Ev = new b("", { factory: () => !1 }), Iv = new b("", { factory: () => mS }), mS = 4e3, vS = !1, yn = (typeof ngServerMode > "u" || !ngServerMode) && typeof document < "u" && typeof document?.documentElement?.getAnimations == "function";
function Gs(e) { return e[R].get(Ev, vS); }
function yS(e, t, n) { let o = qn.get(e); if (o) {
    for (let r of t)
        o.classList.push(r);
    for (let r of n)
        o.cleanupFns.push(r);
}
else
    qn.set(e, { classList: t, cleanupFns: n }); }
function td(e) { let t = qn.get(e); if (t) {
    for (let n of t.cleanupFns)
        n();
    qn.delete(e);
} nn.delete(e); }
var ES = () => { }, qn = new WeakMap, nn = new WeakMap, lr = new WeakMap;
function Dv(e) { return e ? e[wn] ?? e : null; }
var qo = new WeakSet;
function jl(e, t) { let n = lr.get(e); if (n && n.length > 0) {
    let o = n.findIndex(r => r.el === t);
    o > -1 && n.splice(o, 1);
} n?.length === 0 && lr.delete(e); }
function IS(e, t, n) { let o = lr.get(e); if (!o || o.length === 0)
    return; let r = t.parentNode, i = t.previousSibling, s = Dv(n); for (let a = o.length - 1; a >= 0; a--) {
    let { el: c, declarationView: l } = o[a], u = c.parentNode;
    c === t ? (o.splice(a, 1), qo.add(c), c.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: !0 } }))) : i && c === i ? (o.splice(a, 1), c.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: !0 } })), c.parentNode?.removeChild(c)) : u && r && u !== r && (s === null || l === null || s === l) && (o.splice(a, 1), c.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: !0 } })), c.parentNode?.removeChild(c));
} }
function nd(e, t, n) { let o = Dv(n), r = lr.get(e); r ? r.some(i => i.el === t) || r.push({ el: t, declarationView: o }) : lr.set(e, [{ el: t, declarationView: o }]); }
function us(e) { let t = e[xe] ??= {}; return t.enter ??= new Map; }
function sn(e) { let t = e[xe] ??= {}; return t.leave ??= new Map; }
function Tv(e) { let t = typeof e == "function" ? e() : e, n = Array.isArray(t) ? t : null; return typeof t == "string" && (n = t.trim().split(/\s+/).filter(o => o)), n; }
function DS(e, t) { if (!yn)
    return; let n = qn.get(e); if (n && n.classList.length > 0 && TS(e, n.classList))
    for (let o of n.classList)
        t.removeClass(e, o); td(e); }
function TS(e, t) { for (let n of t)
    if (e.classList.contains(n))
        return !0; return !1; }
function ur(e) { return e.composedPath ? e.composedPath()[0] : e.target; }
function od(e, t) { let n = nn.get(t); return n === void 0 ? !0 : t === ur(e) && (n.animationName !== void 0 && e.animationName === n.animationName || n.propertyName !== void 0 && (n.propertyName === "all" || e.propertyName === n.propertyName)); }
function zs(e, t, n) { let o = e.get(t.index) ?? { animateFns: [] }; o.animateFns.push(n), e.set(t.index, o); }
function Vl(e, t) { if (e)
    for (let n of e)
        n(); for (let n of t)
    n(); }
function Bl(e, t) { let n = sn(e).get(t.index); n && (n.resolvers = void 0); }
function Fi(e, t, n, o, r) { jl(t, n), Vl(o, r), Bl(e, t); }
function ds(e) { if (!e)
    return 0; let t = e.toLowerCase().indexOf("ms") > -1 ? 1 : 1e3; return parseFloat(e) * t; }
function en(e, t) { return e.getPropertyValue(t).split(",").map(o => o.trim()); }
function CS(e) { let t = en(e, "transition-property"), n = en(e, "transition-duration"), o = en(e, "transition-delay"), r = { propertyName: "", duration: 0, animationName: void 0 }; for (let i = 0; i < t.length; i++) {
    let s = ds(o[i]) + ds(n[i]);
    s > r.duration && (r.propertyName = t[i], r.duration = s);
} return r; }
function MS(e) { let t = en(e, "animation-name"), n = en(e, "animation-delay"), o = en(e, "animation-duration"), r = en(e, "animation-iteration-count"), i = { animationName: "", propertyName: void 0, duration: 0 }; for (let s = 0; s < t.length; s++) {
    let a = ds(n[s]) + ds(o[s]), c = r[s];
    a > i.duration && c !== "infinite" && (i.animationName = t[s], i.duration = a);
} return i; }
function Cv(e, t) { return e !== void 0 && e.duration > t.duration; }
function Mv(e) { return (e.animationName != null || e.propertyName != null) && e.duration > 0; }
function NS(e, t) { let n = getComputedStyle(e), o = MS(n), r = CS(n), i = o.duration > r.duration ? o : r; Cv(t.get(e), i) || Mv(i) && t.set(e, i); }
function Nv(e, t, n) { if (!n)
    return; let o = e.getAnimations(); return o.length === 0 ? NS(e, t) : wS(e, t, o); }
function wS(e, t, n) { let o = { animationName: void 0, propertyName: void 0, duration: 0 }; for (let r of n) {
    let i = r.effect?.getTiming();
    if (i?.iterations === 1 / 0)
        continue;
    let s = typeof i?.duration == "number" ? i.duration : 0, a = (i?.delay ?? 0) + s, c = r.playbackRate;
    c !== void 0 && c !== 0 && c !== 1 && (a /= Math.abs(c));
    let l, u;
    r.animationName ? u = r.animationName : l = r.transitionProperty, a >= o.duration && (o = { animationName: u, propertyName: l, duration: a });
} Cv(t.get(e), o) || Mv(o) && t.set(e, o); }
var Ot = new Set, Ws = (function (e) { return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e; })(Ws || {}), En = new b(""), Bh = new Set;
function K(e) { Bh.has(e) || (Bh.add(e), performance?.mark?.("mark_feature_usage", { detail: { feature: e } })); }
var qs = (() => { class e {
    impl = null;
    execute() { this.impl?.execute(); }
    static \u0275prov = ae({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), rd = [0, 1, 2, 3], id = (() => { class e {
    ngZone = I(B);
    scheduler = I(_t);
    errorHandler = I(Lc, { optional: !0 });
    sequences = new Set;
    deferredRegistrations = new Set;
    executing = !1;
    constructor() { I(En, { optional: !0 }); }
    execute() { let n = this.sequences.size > 0; n && O(k.AfterRenderHooksStart), this.executing = !0; for (let o of rd)
        for (let r of this.sequences)
            if (!(r.erroredOrDestroyed || !r.hooks[o]))
                try {
                    r.pipelinedValue = this.ngZone.runOutsideAngular(() => this.maybeTrace(() => { let i = r.hooks[o]; return i(r.pipelinedValue); }, r.snapshot));
                }
                catch (i) {
                    r.erroredOrDestroyed = !0, this.errorHandler?.handleError(i);
                } this.executing = !1; for (let o of this.sequences)
        o.afterRun(), o.once && (this.sequences.delete(o), o.destroy()); for (let o of this.deferredRegistrations)
        this.sequences.add(o); this.deferredRegistrations.size > 0 && this.scheduler.notify(7), this.deferredRegistrations.clear(), n && O(k.AfterRenderHooksEnd); }
    register(n) { let { view: o } = n; o !== void 0 ? ((o[$t] ??= []).push(n), Ii(o), o[A] |= 8192) : this.executing ? this.deferredRegistrations.add(n) : this.addSequence(n); }
    addSequence(n) { this.sequences.add(n), this.scheduler.notify(7); }
    unregister(n) { this.executing && this.sequences.has(n) ? (n.erroredOrDestroyed = !0, n.pipelinedValue = void 0, n.once = !0) : (this.sequences.delete(n), this.deferredRegistrations.delete(n)); }
    maybeTrace(n, o) { return o ? o.run(Ws.AFTER_NEXT_RENDER, n) : n(); }
    static \u0275prov = ae({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), dr = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, o, r, i, s = null) { this.impl = t, this.hooks = n, this.view = o, this.once = r, this.snapshot = s, this.unregisterOnDestroy = i?.onDestroy(() => this.destroy()); }
    afterRun() { this.erroredOrDestroyed = !1, this.pipelinedValue = void 0, this.snapshot?.dispose(), this.snapshot = null; }
    destroy() { this.impl.unregister(this), this.unregisterOnDestroy?.(); let t = this.view?.[$t]; t && (this.view[$t] = t.filter(n => n !== this)); }
};
function wv(e, t) { let n = t?.injector ?? I(me); return typeof ngServerMode < "u" && ngServerMode ? Qs : (K("NgAfterRender"), Sv(e, n, t, !1)); }
function sd(e, t) { let n = t?.injector ?? I(me); return typeof ngServerMode < "u" && ngServerMode ? Qs : (K("NgAfterNextRender"), Sv(e, n, t, !0)); }
function SS(e) { return e instanceof Function ? [void 0, void 0, e, void 0] : [e.earlyRead, e.write, e.mixedReadWrite, e.read]; }
function Sv(e, t, n, o) { let r = t.get(qs); r.impl ??= t.get(id); let i = t.get(En, null, { optional: !0 }), s = n?.manualCleanup !== !0 ? t.get(qt) : null, a = t.get(Si, null, { optional: !0 }), c = new dr(r.impl, SS(e), a?.view, o, s, i?.snapshot(null)); return r.impl.register(c), c; }
var Qs = { destroy() { } }, Br = new b("", { factory: () => { let e = I(at), t = new Set; return e.onDestroy(() => t.clear()), { queue: t, isScheduled: !1, scheduler: null, injector: e }; } });
function _v(e, t, n) { let o = e.get(Br); if (Array.isArray(t))
    for (let r of t)
        o.queue.add(r), n?.detachedLeaveAnimationFns?.push(r);
else
    o.queue.add(t), n?.detachedLeaveAnimationFns?.push(t); o.scheduler && o.scheduler(e); }
function _S(e, t) { let n = e.get(Br); if (Array.isArray(t))
    for (let o of t)
        n.queue.delete(o);
else
    n.queue.delete(t); }
function bS(e, t) { let n = e.get(Br); if (t.detachedLeaveAnimationFns) {
    for (let o of t.detachedLeaveAnimationFns)
        n.queue.delete(o);
    t.detachedLeaveAnimationFns = void 0;
} }
function AS(e) { let t = e.get(Br); t.isScheduled || (sd(() => { t.isScheduled = !1; for (let n of t.queue)
    n(); t.queue.clear(); }, { injector: t.injector }), t.isScheduled = !0); }
function Ys(e) { let t = e.get(Br); t.scheduler = AS, t.scheduler(e); }
function ad(e, t) { for (let [n, o] of t)
    _v(e, o.animateFns); }
function Uh(e, t, n, o) { let r = e?.[xe]?.enter; t !== null && r && r.has(n.index) && ad(o, r); }
function $h(e, t, n, o) { try {
    n.get(ic);
}
catch {
    return o(!1);
} let r = e?.[xe]; r?.enter?.has(t.index) && _S(n, r.enter.get(t.index).animateFns); let i = RS(e, t, r); if (i.size === 0) {
    let s = !1;
    if (e) {
        let a = [];
        Zs(e, t, a), s = a.length > 0;
    }
    if (!s)
        return o(!1);
} e && Ot.add(e[Ce]), _v(n, () => kS(e, t, r || void 0, i, o), r || void 0); }
function RS(e, t, n) { let o = new Map, r = n?.leave; if (r && r.has(t.index) && o.set(t.index, r.get(t.index)), e && r)
    for (let [i, s] of r) {
        if (o.has(i))
            continue;
        let c = e[m].data[i].parent;
        for (; c;) {
            if (c === t) {
                o.set(i, s);
                break;
            }
            c = c.parent;
        }
    } return o; }
function kS(e, t, n, o, r) { let i = []; if (n && n.leave)
    for (let [s] of o) {
        if (!n.leave.has(s))
            continue;
        let a = n.leave.get(s);
        for (let c of a.animateFns) {
            let { promise: l } = c();
            i.push(l);
        }
        n.detachedLeaveAnimationFns = void 0;
    } if (e && Zs(e, t, i), i.length > 0) {
    let s = n || e?.[xe];
    if (s) {
        let a = s.running;
        a && i.push(a), s.running = Promise.allSettled(i), OS(e, s.running, r);
    }
    else
        Promise.allSettled(i).then(() => { e && Ot.delete(e[Ce]), r(!0); });
}
else
    e && Ot.delete(e[Ce]), r(!1); }
function Zs(e, t, n) { if (t.type & 12) {
    let r = e[t.index];
    if (Z(r))
        for (let i = H; i < r.length; i++) {
            let s = r[i];
            s[m].type === 2 && xS(s, n);
        }
} let o = t.child; for (; o;)
    Zs(e, o, n), o = o.next; }
function xS(e, t) { let n = e[xe]; if (n && n.leave)
    for (let r of n.leave.values())
        for (let i of r.animateFns) {
            let { promise: s } = i();
            t.push(s);
        } let o = e[m].firstChild; for (; o;)
    Zs(e, o, t), o = o.next; }
function OS(e, t, n) { t.then(() => { e[xe]?.running === t && (e[xe].running = void 0, Ot.delete(e[Ce])), n(!0); }); }
function jn(e, t, n, o, r, i, s, a) { if (r != null) {
    let c, l = !1;
    Z(r) ? c = r : ee(r) && (l = !0, r = r[V]);
    let u = x(r);
    e === 0 && o !== null ? (Uh(a, o, i, n), s == null ? cv(t, o, u) : rn(t, o, u, s || null, !0)) : e === 1 && o !== null ? (Uh(a, o, i, n), rn(t, o, u, s || null, !0), IS(i, u, a)) : e === 2 ? (a?.[xe]?.leave?.has(i.index) && nd(i, u, a), qo.delete(u), $h(a, i, n, d => { if (qo.has(u)) {
        qo.delete(u);
        return;
    } jr(t, u, l, d); })) : e === 3 && (qo.delete(u), $h(a, i, n, () => { t.destroyNode(u); })), c != null && VS(t, e, n, c, i, o, s);
} }
function bv(e, t) { Av(e, t), t[V] = null, t[ie] = null; }
function LS(e, t, n, o, r, i) { o[V] = r, o[ie] = t, Ks(e, o, n, 1, r, i); }
function Av(e, t) { t[Ze].changeDetectionScheduler?.notify(9), Ks(e, t, t[C], 2, null, null); }
function PS(e) { let t = e[Ct]; if (!t)
    return Zc(e[m], e); for (; t;) {
    let n = null;
    if (ee(t))
        n = t[Ct];
    else {
        let o = t[H];
        o && (n = o);
    }
    if (!n) {
        for (; t && !t[ue] && t !== e;)
            ee(t) && Zc(t[m], t), t = t[Y];
        t === null && (t = e), ee(t) && Zc(t[m], t), n = t && t[ue];
    }
    t = n;
} }
function cd(e, t) { let n = e[Gt], o = n.indexOf(t); n.splice(o, 1); }
function Ur(e, t) { if (Nt(t))
    return; let n = t[C]; n.destroyNode && Ks(e, t, n, 3, null, null), PS(t); }
function Zc(e, t) { if (Nt(t))
    return; let n = L(null); try {
    t[A] &= -129, t[A] |= 256, t[Me] && To(t[Me]), HS(e, t), FS(e, t), t[m].type === 1 && t[C].destroy();
    let o = t[Mt];
    if (o !== null && Z(t[Y])) {
        o !== t[Y] && cd(o, t);
        let r = t[Ke];
        r !== null && r.detachView(e);
    }
    El(t);
}
finally {
    L(n);
} }
function FS(e, t) { let n = e.cleanup, o = t[Ut]; if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
        if (typeof n[s] == "string") {
            let a = n[s + 3];
            a >= 0 ? o[a]() : o[-a].unsubscribe(), s += 2;
        }
        else {
            let a = o[n[s + 1]];
            n[s].call(a);
        } o !== null && (t[Ut] = null); let r = t[cc]; if (r !== null) {
    t[cc] = null;
    for (let s = 0; s < r.length; s++) {
        let a = r[s];
        a();
    }
} let i = t[ko]; if (i !== null) {
    t[ko] = null;
    for (let s of i)
        s.destroy();
} }
function HS(e, t) { let n; if (e != null && (n = e.destroyHooks) != null)
    for (let o = 0; o < n.length; o += 2) {
        let r = t[n[o]];
        if (!(r instanceof on)) {
            let i = n[o + 1];
            if (Array.isArray(i))
                for (let s = 0; s < i.length; s += 2) {
                    let a = r[i[s]], c = i[s + 1];
                    O(k.LifecycleHookStart, a, c);
                    try {
                        c.call(a);
                    }
                    finally {
                        O(k.LifecycleHookEnd, a, c);
                    }
                }
            else {
                O(k.LifecycleHookStart, r, i);
                try {
                    i.call(r);
                }
                finally {
                    O(k.LifecycleHookEnd, r, i);
                }
            }
        }
    } }
function ld(e, t, n) { return Rv(e, t.parent, n); }
function Rv(e, t, n) { let o = t; for (; o !== null && o.type & 168;)
    t = o, o = t.parent; if (o === null)
    return n[V]; if (ve(o)) {
    let { encapsulation: r } = e.data[o.directiveStart + o.componentOffset];
    if (r === Pe.None || r === Pe.Emulated)
        return null;
} return te(o, n); }
function kv(e, t, n) { return Ov(e, t, n); }
function xv(e, t, n) { return e.type & 40 ? te(e, n) : null; }
var Ov = xv, Ul;
function Lv(e, t) { Ov = e, Ul = t; }
function ud(e, t, n, o) { let r = ld(e, o, t), i = t[C], s = o.parent || t[ie], a = kv(s, o, t); if (r != null)
    if (Array.isArray(n))
        for (let c = 0; c < n.length; c++)
            Ph(i, r, n[c], a, !1);
    else
        Ph(i, r, n, a, !1); Ul !== void 0 && Ul(i, o, t, n, r); }
function tn(e, t) { if (t !== null) {
    let n = t.type;
    if (n & 3)
        return te(t, e);
    if (n & 4)
        return $l(-1, e[t.index]);
    if (n & 8) {
        let o = t.child;
        if (o !== null)
            return tn(e, o);
        {
            let r = e[t.index];
            return Z(r) ? $l(-1, r) : x(r);
        }
    }
    else {
        if (n & 128)
            return tn(e, t.next);
        if (n & 32)
            return ed(t, e)() || x(e[t.index]);
        {
            let o = Pv(e, t);
            if (o !== null) {
                if (Array.isArray(o))
                    return o[0];
                let r = Je(e[X]);
                return tn(r, o);
            }
            else
                return tn(e, t.next);
        }
    }
} return null; }
function Pv(e, t) { if (t !== null) {
    let o = e[X][ie], r = t.projection;
    return o.projection[r];
} return null; }
function $l(e, t) { let n = H + e + 1; if (n < t.length) {
    let o = t[n], r = o[m].firstChild;
    if (r !== null)
        return tn(o, r);
} return t[Ue]; }
function dd(e, t, n, o, r, i, s) { for (; n != null;) {
    let a = o[R];
    if (n.type === 128) {
        n = n.next;
        continue;
    }
    let c = o[n.index], l = n.type;
    if (s && t === 0 && (c && Le(x(c), o), n.flags |= 2), !ao(n))
        if (l & 8)
            dd(e, t, n.child, o, r, i, !1), jn(t, e, a, r, c, n, i, o);
        else if (l & 32) {
            let u = ed(n, o), d;
            for (; d = u();)
                jn(t, e, a, r, d, n, i, o);
            jn(t, e, a, r, c, n, i, o);
        }
        else
            l & 16 ? Fv(e, t, o, n, r, i) : jn(t, e, a, r, c, n, i, o);
    n = s ? n.projectionNext : n.next;
} }
function Ks(e, t, n, o, r, i) { dd(n, o, e.firstChild, t, r, i, !1); }
function jS(e, t, n) { let o = t[C], r = ld(e, n, t), i = n.parent || t[ie], s = kv(i, n, t); Fv(o, 0, t, n, r, s); }
function Fv(e, t, n, o, r, i) { let s = n[X], c = s[ie].projection[o.projection]; if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
        let u = c[l];
        jn(t, e, n[R], r, u, o, i, n);
    }
else {
    let l = c, u = s[Y];
    ar(o) && (l.flags |= 128), dd(e, t, l, u, r, i, !0);
} }
function VS(e, t, n, o, r, i, s) { let a = o[Ue], c = x(o); a !== c && jn(t, e, n, i, a, r, s); for (let l = H; l < o.length; l++) {
    let u = o[l];
    Ks(u[m], u, e, t, i, a);
} }
function BS(e, t, n, o, r) { if (t)
    r ? e.addClass(n, o) : e.removeClass(n, o);
else {
    let i = o.indexOf("-") === -1 ? void 0 : ls.DashCase;
    r == null ? e.removeStyle(n, o, i) : (typeof r == "string" && r.endsWith("!important") && (r = r.slice(0, -10), i |= ls.Important), e.setStyle(n, o, r, i));
} }
function fd(e, t, n, o, r, i, s, a, c, l, u) { let d = E + o, f = d + r, p = US(d, f), h = typeof l == "function" ? l() : l; return p[m] = { type: e, blueprint: p, template: n, queries: null, viewQuery: a, declTNode: t, data: p.slice().fill(null, d), bindingStartIndex: d, expandoStartIndex: f, hostBindingOpCodes: null, firstCreatePass: !0, firstUpdatePass: !0, staticViewQueries: !1, staticContentQueries: !1, preOrderHooks: null, preOrderCheckHooks: null, contentHooks: null, contentCheckHooks: null, viewHooks: null, viewCheckHooks: null, destroyHooks: null, cleanup: null, contentQueries: null, components: null, directiveRegistry: typeof i == "function" ? i() : i, pipeRegistry: typeof s == "function" ? s() : s, firstChild: null, schemas: c, consts: h, incompleteFirstPass: !1, ssrId: u }; }
function US(e, t) { let n = []; for (let o = 0; o < t; o++)
    n.push(o < e ? null : F); return n; }
function Hv(e) { let t = e.tView; return t === null || t.incompleteFirstPass ? e.tView = fd(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t; }
function Js(e, t, n, o, r, i, s, a, c, l, u) { let d = t.blueprint.slice(); return d[V] = r, d[A] = o | 4 | 128 | 8 | 64 | 1024, (l !== null || e && e[A] & 2048) && (d[A] |= 2048), dc(d), d[Y] = d[wn] = e, d[P] = n, d[Ze] = s || e && e[Ze], d[C] = a || e && e[C], d[R] = c || e && e[R] || null, d[ie] = i, d[Ce] = EN(), d[ce] = u, d[ac] = l, d[X] = t.type == 2 ? e[X] : d, d; }
function $S(e, t, n) { let o = te(t, e), r = Hv(n), i = e[Ze].rendererFactory, s = hd(e, Js(e, r, null, pd(n), o, t, null, i.createRenderer(o, n), null, null, null)); return e[t.index] = s; }
function pd(e) { let t = 16; return e.signals ? t = 4096 : e.onPush && (t = 64), t; }
function $r(e, t, n, o) { if (n === 0)
    return -1; let r = t.length; for (let i = 0; i < n; i++)
    t.push(o), e.blueprint.push(o), e.data.push(null); return r; }
function hd(e, t) { return e[Ct] ? e[Ro][ue] = t : e[Ct] = t, e[Ro] = t, t; }
function jv(e = 1) { Vv(w(), g(), oe() + e, !1); }
function Vv(e, t, n, o) { if (!o)
    if ((t[A] & 3) === 3) {
        let i = e.preOrderCheckHooks;
        i !== null && Ui(t, i, n);
    }
    else {
        let i = e.preOrderHooks;
        i !== null && $i(t, i, 0, n);
    } nt(n); }
var Xs = (function (e) { return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e; })(Xs || {});
function an(e, t, n, o) { let r = L(null); try {
    let [i, s, a] = e.inputs[n], c = null;
    (s & Xs.SignalBased) !== 0 && (c = t[i][qe]), c !== null && c.transformFn !== void 0 ? o = c.transformFn(o) : a !== null && (o = a.call(t, o)), e.setInput !== null ? e.setInput(t, c, o, n, i) : Bg(t, c, i, o);
}
finally {
    L(r);
} }
function Bv(e, t, n, o, r) { let i = oe(), s = o & 2; try {
    nt(-1), s && t.length > E && Vv(e, t, E, !1);
    let a = s ? k.TemplateUpdateStart : k.TemplateCreateStart;
    O(a, r, n), n(o, r);
}
finally {
    nt(i);
    let a = s ? k.TemplateUpdateEnd : k.TemplateCreateEnd;
    O(a, r, n);
} }
function ea(e, t, n) { QS(e, t, n), (n.flags & 64) === 64 && YS(e, t, n); }
function uo(e, t, n = te) { let o = t.localNames; if (o !== null) {
    let r = t.index + 1;
    for (let i = 0; i < o.length; i += 2) {
        let s = o[i + 1], a = s === -1 ? n(t, e) : e[s];
        e[r++] = a;
    }
} }
function GS(e, t, n, o) { let i = o.get(Ru, Sm) || n === Pe.ShadowDom || n === Pe.ExperimentalIsolatedShadowDom, s = e.selectRootElement(t, i); return zS(s), s; }
function zS(e) { Uv(e); }
var Uv = () => null;
function WS(e) { hm(e) ? lv(e) : JN(e); }
function $v() { Uv = WS; }
function qS(e) { return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e; }
function gd(e, t, n, o, r, i) { let s = t[m]; if (ra(e, s, t, n, o)) {
    ve(e) && Gv(t, e.index);
    return;
} e.type & 3 && (n = qS(n)), md(e, t, n, o, r, i); }
function md(e, t, n, o, r, i) { if (e.type & 3) {
    let s = te(e, t);
    o = i != null ? i(o, e.value || "", n) : o, r.setProperty(s, n, o);
}
else
    e.type & 12; }
function Gv(e, t) { let n = de(t, e); n[A] & 16 || (n[A] |= 64); }
function QS(e, t, n) { let o = n.directiveStart, r = n.directiveEnd; ve(n) && $S(t, n, e.data[o + n.componentOffset]), e.firstCreatePass || ts(n, t); let i = n.initialInputs; for (let s = o; s < r; s++) {
    let a = e.data[s], c = sr(t, e, s, n);
    if (Le(c, t), i !== null && JS(t, s - o, c, a, n, i), Oe(a)) {
        let l = de(n.index, t);
        l[P] = sr(t, e, s, n);
    }
} }
function YS(e, t, n) { let o = n.directiveStart, r = n.directiveEnd, i = n.index, s = Jp(); try {
    nt(i);
    for (let a = o; a < r; a++) {
        let c = e.data[a], l = t[a];
        Sc(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && ZS(c, l);
    }
}
finally {
    nt(-1), Sc(s);
} }
function ZS(e, t) { e.hostBindings !== null && e.hostBindings(1, t); }
function vd(e, t) { let n = e.directiveRegistry, o = null; if (n)
    for (let r = 0; r < n.length; r++) {
        let i = n[r];
        yv(t, i.selectors, !1) && (o ??= [], Oe(i) ? o.unshift(i) : o.push(i));
    } return o; }
function KS(e, t, n, o, r, i) { let s = te(e, t); ta(t[C], s, i, e.value, n, o, r); }
function ta(e, t, n, o, r, i, s) { if (i == null)
    s?.(i, o || "", r), e.removeAttribute(t, r, n);
else {
    let a = s == null ? N(i) : s(i, o || "", r);
    e.setAttribute(t, r, a, n);
} }
function JS(e, t, n, o, r, i) { let s = i[t]; if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
        let c = s[a], l = s[a + 1];
        an(o, n, c, l);
    } }
function na(e, t, n, o, r) { let i = E + n, s = t[m], a = r(s, t, e, o, n); t[i] = a, Xe(e, !0); let c = e.type === 2; return c ? (uv(t[C], a, e), (Wp() === 0 || _n(e)) && Le(a, t), qp()) : Le(a, t), Bo() && (!c || !ao(e)) && ud(s, t, a, e), e; }
function oa(e) { let t = e; return Ic() ? Dc() : (t = t.parent, Xe(t, !1)), t; }
function zv(e, t, n) { return (e === null || Oe(e)) && (n = Oo(n[t.index])), n[C]; }
function yd(e, t) { let n = e[R]; if (!n)
    return; let o; try {
    o = n.get(Qt, null);
}
catch {
    o = null;
} o?.(t); }
function ra(e, t, n, o, r) { let i = e.inputs?.[o], s = e.hostDirectiveInputs?.[o], a = !1; if (s)
    for (let c = 0; c < s.length; c += 2) {
        let l = s[c], u = s[c + 1], d = t.data[l];
        an(d, n[l], u, r), a = !0;
    } if (i)
    for (let c of i) {
        let l = n[c], u = t.data[c];
        an(u, l, o, r), a = !0;
    } return a; }
function Wv(e, t, n, o, r, i) { let s = null, a = null, c = null, l = !1, u = e.directiveToIndex.get(o.type); if (typeof u == "number" ? s = u : [s, a, c] = u, a !== null && c !== null && e.hostDirectiveInputs?.hasOwnProperty(r)) {
    let d = e.hostDirectiveInputs[r];
    for (let f = 0; f < d.length; f += 2) {
        let p = d[f];
        if (p >= a && p <= c) {
            let h = t.data[p], v = d[f + 1];
            an(h, n[p], v, i), l = !0;
        }
        else if (p > c)
            break;
    }
} return s !== null && o.inputs.hasOwnProperty(r) && (an(o, n[s], r, i), l = !0), l; }
function XS(e, t) { let n = de(t, e), o = n[m]; e_(o, n); let r = n[V]; r !== null && n[ce] === null && (n[ce] = Bm(r, n[R])), O(k.ComponentStart); try {
    ia(o, n, n[P]);
}
finally {
    O(k.ComponentEnd, n[P]);
} }
function e_(e, t) { for (let n = t.length; n < e.blueprint.length; n++)
    t.push(e.blueprint[n]); }
function ia(e, t, n) { Mi(t); try {
    let o = e.viewQuery;
    o !== null && Nl(1, o, n);
    let r = e.template;
    r !== null && Bv(e, t, r, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), t[Ke]?.finishViewCreation(e), e.staticContentQueries && Ym(e, t), e.staticViewQueries && Nl(2, e.viewQuery, n);
    let i = e.components;
    i !== null && t_(t, i);
}
catch (o) {
    throw e.firstCreatePass && (e.incompleteFirstPass = !0, e.firstCreatePass = !1), o;
}
finally {
    t[A] &= -5, Ni();
} }
function t_(e, t) { for (let n = 0; n < t.length; n++)
    XS(e, t[n]); }
function fo(e, t, n, o) { let r = L(null); try {
    let i = t.tView, a = e[A] & 4096 ? 4096 : 16, c = Js(e, i, n, a, null, t, null, null, o?.injector ?? null, o?.embeddedViewInjector ?? null, o?.dehydratedView ?? null), l = e[t.index];
    c[Mt] = l;
    let u = e[Ke];
    return u !== null && (c[Ke] = u.createEmbeddedView(i)), ia(i, c, n), c;
}
finally {
    L(r);
} }
function cn(e, t) { return !t || t.firstChild === null || ar(e); }
function Qn(e, t, n, o, r = !1) { for (; n !== null;) {
    if (n.type === 128) {
        n = r ? n.projectionNext : n.next;
        continue;
    }
    let i = t[n.index];
    i !== null && o.push(x(i)), Z(i) && sa(i, o);
    let s = n.type;
    if (s & 8)
        Qn(e, t, n.child, o);
    else if (s & 32) {
        let a = ed(n, t), c;
        for (; c = a();)
            o.push(c);
    }
    else if (s & 16) {
        let a = Pv(t, n);
        if (Array.isArray(a))
            o.push(...a);
        else {
            let c = Je(t[X]);
            Qn(c[m], c, a, o, !0);
        }
    }
    n = r ? n.projectionNext : n.next;
} return o; }
function sa(e, t) { for (let n = H; n < e.length; n++) {
    let o = e[n], r = o[m].firstChild;
    r !== null && Qn(o[m], o, r, t);
} e[Ue] !== e[V] && t.push(e[Ue]); }
function qv(e) { if (e[$t] !== null) {
    for (let t of e[$t])
        t.impl.addSequence(t);
    e[$t].length = 0;
} }
var Qv = [];
function n_(e) { return e[Me] ?? o_(e); }
function o_(e) { let t = Qv.pop() ?? Object.create(i_); return t.lView = e, t; }
function r_(e) { e.lView[Me] !== e && (e.lView = null, Qv.push(e)); }
var i_ = be(G({}, za), { consumerIsAlwaysLive: !0, kind: "template", consumerMarkedDirty: e => { Ii(e.lView); }, consumerOnSignalRead() { this.lView[Me] = this; } });
function s_(e) { let t = e[Me] ?? Object.create(a_); return t.lView = e, t; }
var a_ = be(G({}, za), { consumerIsAlwaysLive: !0, kind: "template", consumerMarkedDirty: e => { let t = Je(e.lView); for (; t && !Yv(t[m]);)
        t = Je(t); t && Po(t); }, consumerOnSignalRead() { this.lView[Me] = this; } });
function Yv(e) { return e.type !== 2; }
function Zv(e) { if (e[ko] === null)
    return; let t = !0; for (; t;) {
    let n = !1;
    for (let o of e[ko])
        o.dirty && (n = !0, o.zone === null || Zone.current === o.zone ? o.run() : o.zone.run(() => o.run()));
    t = n && !!(e[A] & 8192);
} }
var c_ = 100;
function Kv(e, t = 0) { let o = e[Ze].rendererFactory, r = !1; r || o.begin?.(); try {
    l_(e, t);
}
finally {
    r || o.end?.();
} }
function l_(e, t) { let n = Cc(); try {
    Mc(!0), Gl(e, t);
    let o = 0;
    for (; Fo(e);) {
        if (o === c_)
            throw new S(103, !1);
        o++, Gl(e, 1);
    }
}
finally {
    Mc(n);
} }
function Jv(e, t, n, o) { if (Nt(t))
    return; let r = t[A], i = !1, s = !1; Mi(t); let a = !0, c = null, l = null; i || (Yv(e) ? (l = n_(t), c = Do(l)) : pp() === null ? (a = !1, l = s_(t), c = Do(l)) : t[Me] && (To(t[Me]), t[Me] = null)); try {
    dc(t), Nc(e.bindingStartIndex), n !== null && Bv(e, t, n, 2, o);
    let u = (r & 3) === 3;
    if (!i)
        if (u) {
            let p = e.preOrderCheckHooks;
            p !== null && Ui(t, p, null);
        }
        else {
            let p = e.preOrderHooks;
            p !== null && $i(t, p, 0, null), Gc(t, 0);
        }
    if (s || u_(t), Zv(t), Xv(t, 0), e.contentQueries !== null && Ym(e, t), !i)
        if (u) {
            let p = e.contentCheckHooks;
            p !== null && Ui(t, p);
        }
        else {
            let p = e.contentHooks;
            p !== null && $i(t, p, 1), Gc(t, 1);
        }
    f_(e, t);
    let d = e.components;
    d !== null && ty(t, d, 0);
    let f = e.viewQuery;
    if (f !== null && Nl(2, f, o), !i)
        if (u) {
            let p = e.viewCheckHooks;
            p !== null && Ui(t, p);
        }
        else {
            let p = e.viewHooks;
            p !== null && $i(t, p, 2), Gc(t, 2);
        }
    if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[yi]) {
        for (let p of t[yi])
            p();
        t[yi] = null;
    }
    i || (qv(t), t[A] &= -73);
}
catch (u) {
    throw i || Ii(t), u;
}
finally {
    l !== null && (oi(l, c), a && r_(l)), Ni();
} }
function Xv(e, t) { for (let n = Em(e); n !== null; n = Im(n))
    for (let o = H; o < n.length; o++) {
        let r = n[o];
        ey(r, t);
    } }
function u_(e) { for (let t = Em(e); t !== null; t = Im(t)) {
    if (!(t[A] & 2))
        continue;
    let n = t[Gt];
    for (let o = 0; o < n.length; o++) {
        let r = n[o];
        Po(r);
    }
} }
function d_(e, t, n) { O(k.ComponentStart); let o = de(t, e); try {
    ey(o, n);
}
finally {
    O(k.ComponentEnd, o[P]);
} }
function ey(e, t) { Vp(e) && Gl(e, t); }
function Gl(e, t) { let o = e[m], r = e[A], i = e[Me], s = !!(t === 0 && r & 16); if (s ||= !!(r & 64 && t === 0), s ||= !!(r & 1024), s ||= !!(i?.dirty && ri(i)), s ||= !1, i && (i.dirty = !1), e[A] &= -9217, s)
    Jv(o, e, o.template, e[P]);
else if (r & 8192) {
    let a = L(null);
    try {
        Zv(e), Xv(e, 1);
        let c = o.components;
        c !== null && ty(e, c, 1), qv(e);
    }
    finally {
        L(a);
    }
} }
function ty(e, t, n) { for (let o = 0; o < t.length; o++)
    d_(e, t[o], n); }
function f_(e, t) { let n = e.hostBindingOpCodes; if (n !== null)
    try {
        for (let o = 0; o < n.length; o++) {
            let r = n[o];
            if (r < 0)
                nt(~r);
            else {
                let i = r, s = n[++o], a = n[++o];
                Kp(s, i);
                let c = t[i];
                O(k.HostBindingsUpdateStart, c);
                try {
                    a(2, c);
                }
                finally {
                    O(k.HostBindingsUpdateEnd, c);
                }
            }
        }
    }
    finally {
        nt(-1);
    } }
function aa(e, t) { let n = Cc() ? 64 : 1088; for (e[Ze].changeDetectionScheduler?.notify(t); e;) {
    e[A] |= n;
    let o = Je(e);
    if ($e(e) && !o)
        return e;
    e = o;
} return null; }
function ny(e, t, n, o) { return [e, !0, 0, t, null, o, null, n, null, null]; }
function oy(e, t) { let n = H + t; if (n < e.length)
    return e[n]; }
function po(e, t, n, o = !0) { let r = t[m]; if (p_(r, t, e, n), o) {
    let s = $l(n, e), a = t[C], c = a.parentNode(e[Ue]);
    c !== null && LS(r, e[ie], a, t, c, s);
} let i = t[ce]; i !== null && i.firstChild !== null && (i.firstChild = null); }
function Ed(e, t) { let n = fr(e, t); return n !== void 0 && Ur(n[m], n), n; }
function fr(e, t) { if (e.length <= H)
    return; let n = H + t, o = e[n]; if (o) {
    let r = o[Mt];
    r !== null && r !== e && cd(r, o), t > 0 && (e[n - 1][ue] = o[ue]);
    let i = wo(e, H + t);
    bv(o[m], o);
    let s = i[Ke];
    s !== null && s.detachView(i[m]), o[Y] = null, o[ue] = null, o[A] &= -129;
} return o; }
function p_(e, t, n, o) { let r = H + o, i = n.length; o > 0 && (n[r - 1][ue] = t), o < i - H ? (t[ue] = n[r], oc(n, H + o, t)) : (n.push(t), t[ue] = null), t[Y] = n; let s = t[Mt]; s !== null && n !== s && ry(s, t); let a = t[Ke]; a !== null && a.insertView(e), Ei(t), t[A] |= 128; }
function ry(e, t) { let n = e[Gt], o = t[Y]; if (ee(o))
    e[A] |= 2;
else {
    let r = o[Y][X];
    t[X] !== r && (e[A] |= 2);
} n === null ? e[Gt] = [t] : n.push(t); }
var Lt = class {
    _lView;
    _cdRefInjectingView;
    _appRef = null;
    _attachedToViewContainer = !1;
    exhaustive;
    get rootNodes() { let t = this._lView, n = t[m]; return Qn(n, t, n.firstChild, []); }
    constructor(t, n) { this._lView = t, this._cdRefInjectingView = n; }
    get context() { return this._lView[P]; }
    set context(t) { this._lView[P] = t; }
    get destroyed() { return Nt(this._lView); }
    destroy() { if (this._appRef)
        this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
        let t = this._lView[Y];
        if (Z(t)) {
            let n = t[xo], o = n ? n.indexOf(this) : -1;
            o > -1 && (fr(t, o), wo(n, o));
        }
        this._attachedToViewContainer = !1;
    } Ur(this._lView[m], this._lView); }
    onDestroy(t) { Ho(this._lView, t); }
    markForCheck() { aa(this._cdRefInjectingView || this._lView, 4); }
    detach() { this._lView[A] &= -129; }
    reattach() { Ei(this._lView), this._lView[A] |= 128; }
    detectChanges() { this._lView[A] |= 1024, Kv(this._lView); }
    checkNoChanges() { }
    attachToViewContainerRef() { if (this._appRef)
        throw new S(902, !1); this._attachedToViewContainer = !0; }
    detachFromAppRef() { this._appRef = null; let t = $e(this._lView), n = this._lView[Mt]; n !== null && !t && cd(n, this._lView), Av(this._lView[m], this._lView); }
    attachToAppRef(t) { if (this._attachedToViewContainer)
        throw new S(902, !1); this._appRef = t; let n = $e(this._lView), o = this._lView[Mt]; o !== null && !n && ry(o, this._lView), Ei(this._lView); }
};
function h_(e) { return Fo(e._lView) || !!(e._lView[A] & 64); }
function g_(e) { Po(e._lView); }
var pr = (() => { class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = m_;
    constructor(n, o, r) { this._declarationLView = n, this._declarationTContainer = o, this.elementRef = r; }
    get ssrId() { return this._declarationTContainer.tView?.ssrId || null; }
    createEmbeddedView(n, o) { return this.createEmbeddedViewImpl(n, o); }
    createEmbeddedViewImpl(n, o, r) { let i = fo(this._declarationLView, this._declarationTContainer, n, { embeddedViewInjector: o, dehydratedView: r }); return new Lt(i); }
} return e; })();
function m_() { return ca(M(), g()); }
function ca(e, t) { return e.type & 4 ? new pr(t, e, no(e, t)) : null; }
var zl = "<-- AT THIS LOCATION", v_ = "/guide/hydration#third-party-scripts-with-dom-manipulation";
function y_(e) { switch (e) {
    case 4: return "view container";
    case 2: return "element";
    case 8: return "ng-container";
    case 32: return "icu";
    case 64: return "i18n";
    case 16: return "projection";
    case 1: return "text";
    case 128: return "@let";
    default: return "<unknown>";
} }
function E_(e, t) {
    let n = `During serialization, Angular was unable to find an element in the DOM:

`, o = `${C_(e, t, !1)}

`, r = N_();
    throw new S(-502, n + o + r);
}
function iy(e) {
    let t = "During serialization, Angular detected DOM nodes that were created outside of Angular context and provided as projectable nodes (likely via `ViewContainerRef.createComponent` or `createComponent` APIs). Hydration is not supported for such cases, consider refactoring the code to avoid this pattern or using `ngSkipHydration` on the host element of the component.\n\n", n = `${M_(e)}

`, o = t + n + w_();
    return new S(-503, o);
}
function I_(e) { let t = []; if (e.attrs)
    for (let n = 0; n < e.attrs.length;) {
        let o = e.attrs[n++];
        if (typeof o == "number")
            break;
        let r = e.attrs[n++];
        t.push(`${o}="${fs(r)}"`);
    } return t.join(" "); }
var D_ = new Set(["ngh", "ng-version", "ng-server-context"]);
function T_(e) { let t = []; for (let n = 0; n < e.attributes.length; n++) {
    let o = e.attributes[n];
    D_.has(o.name) || t.push(`${o.name}="${fs(o.value)}"`);
} return t.join(" "); }
function Kc(e, t = "\u2026") { switch (e.type) {
    case 1: return `#text${e.value ? `(${e.value})` : ""}`;
    case 2:
        let o = I_(e), r = e.value.toLowerCase();
        return `<${r}${o ? " " + o : ""}>${t}</${r}>`;
    case 8: return "<!-- ng-container -->";
    case 4: return "<!-- container -->";
    default: return `#node(${y_(e.type)})`;
} }
function Wi(e, t = "\u2026") { let n = e; switch (n.nodeType) {
    case Node.ELEMENT_NODE:
        let o = n.tagName.toLowerCase(), r = T_(n);
        return `<${o}${r ? " " + r : ""}>${t}</${o}>`;
    case Node.TEXT_NODE:
        let i = n.textContent ? fs(n.textContent) : "";
        return `#text${i ? `(${i})` : ""}`;
    case Node.COMMENT_NODE: return `<!-- ${fs(n.textContent ?? "")} -->`;
    default: return `#node(${n.nodeType})`;
} }
function C_(e, t, n) {
    let r = "";
    t.prev ? (r += `  \u2026
`, r += "  " + Kc(t.prev) + `
`) : t.type && t.type & 12 && (r += `  \u2026
`), n ? (r += "  " + Kc(t) + `
`, r += `  <!-- container -->  ${zl}
`) : r += "  " + Kc(t) + `  ${zl}
`, r += `  \u2026
`;
    let i = t.type ? ld(e[m], t, e) : null;
    return i && (r = Wi(i, `
` + r)), r;
}
function M_(e) {
    let n = "", o = e;
    return o.previousSibling && (n += `  \u2026
`, n += "  " + Wi(o.previousSibling) + `
`), n += "  " + Wi(o) + `  ${zl}
`, e.nextSibling && (n += `  \u2026
`), e.parentNode && (n = Wi(o.parentNode, `
` + n)), n;
}
function N_(e) {
    return `To fix this problem:
  * check ${e ? `the "${e}"` : "corresponding"} component for hydration-related issues
  * check to see if your template has valid HTML structure
  * check if there are any third-party scripts that manipulate the DOM. More info: ${Qa}${v_}
  * or skip hydration by adding the \`ngSkipHydration\` attribute to its host node in a template

`;
}
function w_() {
    return `Note: attributes are only displayed to better represent the DOM but have no effect on hydration mismatches.

`;
}
function S_(e) { return e.replace(/\s+/gm, ""); }
function fs(e, t = 50) { return e ? (e = S_(e), e.length > t ? `${e.substring(0, t - 1)}\u2026` : e) : ""; }
function sy(e, t, n) { let o = t.insertBeforeIndex, r = Array.isArray(o) ? o[0] : o; return r === null ? xv(e, t, n) : x(n[r]); }
function ay(e, t, n, o, r) { let i = t.insertBeforeIndex; if (Array.isArray(i)) {
    let s = o, a = null;
    if (t.type & 3 || (a = s, s = r), s !== null && t.componentOffset === -1)
        for (let c = 1; c < i.length; c++) {
            let l = n[i[c]];
            rn(e, s, l, a, !1);
        }
} }
function In(e, t, n, o, r) { let i = e.data[t]; if (i === null)
    i = Id(e, t, n, o, r), Zp() && (i.flags |= 32);
else if (i.type & 64) {
    i.type = n, i.value = o, i.attrs = r;
    let s = bn();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
} return Xe(i, !0), i; }
function Id(e, t, n, o, r) { let i = Yp(), s = Ic(), a = s ? i : i && i.parent, c = e.data[t] = b_(e, a, n, t, o, r); return __(e, c, i, s), c; }
function __(e, t, n, o) { e.firstChild === null && (e.firstChild = t), n !== null && (o ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t, t.prev = n)); }
function b_(e, t, n, o, r, i) { let s = t ? t.injectorIndex : -1, a = 0; return jo() && (a |= 128), { type: n, index: o, insertBeforeIndex: null, injectorIndex: s, directiveStart: -1, directiveEnd: -1, directiveStylingLast: -1, componentOffset: -1, controlDirectiveIndex: -1, customControlIndex: -1, propertyBindings: null, flags: a, providerIndexes: 0, value: r, namespace: wi(), attrs: i, mergedAttrs: null, localNames: null, initialInputs: null, inputs: null, hostDirectiveInputs: null, outputs: null, hostDirectiveOutputs: null, directiveToIndex: null, tView: null, next: null, prev: null, projectionNext: null, child: null, parent: t, projection: null, styles: null, stylesWithoutHost: null, residualStyles: void 0, classes: null, classesWithoutHost: null, residualClasses: void 0, classBindings: 0, styleBindings: 0 }; }
function cy(e, t) { if (e.push(t), e.length > 1)
    for (let n = e.length - 2; n >= 0; n--) {
        let o = e[n];
        ly(o) || A_(o, t) && R_(o) === null && k_(o, t.index);
    } }
function ly(e) { return !(e.type & 64); }
function A_(e, t) { return ly(t) || e.index > t.index; }
function R_(e) { let t = e.insertBeforeIndex; return Array.isArray(t) ? t[0] : t; }
function k_(e, t) { let n = e.insertBeforeIndex; Array.isArray(n) ? n[0] = t : (Lv(sy, ay), e.insertBeforeIndex = t); }
function Yo(e, t) { let n = e.data[t]; return n === null || typeof n == "string" ? null : n.hasOwnProperty("currentCaseLViewIndex") ? n : n.value; }
function x_(e, t, n) { let o = e.data[t]; o === null ? e.data[t] = n : o.value = n; }
function O_(e, t) { let n = e.insertBeforeIndex; n === null ? (Lv(sy, ay), n = e.insertBeforeIndex = [null, t]) : (Ep(Array.isArray(n), !0, "Expecting array here"), n.push(t)); }
function L_(e, t, n) { let o = Id(e, n, 64, null, null); return cy(t, o), o; }
function la(e, t) { let n = t[e.currentCaseLViewIndex]; return n === null ? n : n < 0 ? ~n : n; }
function P_(e) { return e >>> 17; }
function F_(e) { return (e & 131070) >>> 1; }
function H_(e, t, n) { return e | t << 17 | n << 1; }
function uy(e) { return e === -1; }
function Dd(e, t, n) { e.index = 0; let o = la(t, n); o !== null ? e.removes = t.remove[o] : e.removes = j; }
function ps(e) { if (e.index < e.removes.length) {
    let t = e.removes[e.index++];
    if (t > 0)
        return e.lView[t];
    {
        e.stack.push(e.index, e.removes);
        let n = ~t, o = e.lView[m].data[n];
        return Dd(e, o, e.lView), ps(e);
    }
}
else
    return e.stack.length === 0 ? (e.lView = void 0, null) : (e.removes = e.stack.pop(), e.index = e.stack.pop(), ps(e)); }
function j_() { let e = { stack: [], index: -1 }; function t(n, o) { for (e.lView = o; e.stack.length;)
    e.stack.pop(); return Dd(e, n.value, o), ps.bind(null, e); } return t; }
function V_(e, t) { let n = { stack: [], index: -1, lView: t }; return Dd(n, e, t), ps.bind(null, n); }
var B_ = new RegExp(`^(\\d+)*(${bu}|${_u})*(.*)`);
function U_(e, t) { let n = [e]; for (let o of t) {
    let r = n.length - 1;
    if (r > 0 && n[r - 1] === o) {
        let i = n[r] || 1;
        n[r] = i + 1;
    }
    else
        n.push(o, "");
} return n.join(""); }
function $_(e) { let t = e.match(B_), [n, o, r, i] = t, s = o ? parseInt(o, 10) : r, a = []; for (let [c, l, u] of i.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
} return [s, ...a]; }
function G_(e) { return !e.prev && e.parent?.type === 8; }
function Jc(e) { return e.index - E; }
function ho(e, t) { return !(e.type & 144) && !!t[e.index] && dy(x(t[e.index])); }
function dy(e) { return !!e && !e.isConnected; }
function fy(e, t) { let n = e.i18nNodes; if (n)
    return n.get(t); }
function z_(e, t, n) { let r = e.data[xr]?.[n]; return r ? py(r, t) : null; }
function Gr(e, t, n, o) { let r = Jc(o), i = fy(e, r); if (i === void 0) {
    let s = e.data[xr];
    if (s?.[r])
        i = py(s[r], n);
    else if (t.firstChild === o)
        i = e.firstChild;
    else {
        let a = o.prev === null, c = o.prev ?? o.parent;
        if (G_(o)) {
            let l = Jc(o.parent);
            i = Ml(e, l);
        }
        else {
            let l = te(c, n);
            if (a)
                i = l.firstChild;
            else {
                let u = Jc(c), d = Ml(e, u);
                if (c.type === 2 && d) {
                    let p = Bu(e, u) + 1;
                    i = ua(p, d);
                }
                else
                    i = l.nextSibling;
            }
        }
    }
} return i; }
function ua(e, t) { let n = t; for (let o = 0; o < e; o++)
    n = n.nextSibling; return n; }
function W_(e, t) { let n = e; for (let o = 0; o < t.length; o += 2) {
    let r = t[o], i = t[o + 1];
    for (let s = 0; s < i; s++)
        switch (r) {
            case Nm:
                n = n.firstChild;
                break;
            case wm:
                n = n.nextSibling;
                break;
        }
} return n; }
function py(e, t) { let [n, ...o] = $_(e), r; if (n === _u)
    r = t[X][V];
else if (n === bu)
    r = Ju(t[X][V]);
else {
    let i = Number(n);
    r = x(t[i + E]);
} return W_(r, o); }
function Wl(e, t) { if (e === t)
    return []; if (e.parentElement == null || t.parentElement == null)
    return null; if (e.parentElement === t.parentElement)
    return q_(e, t); {
    let n = t.parentElement, o = Wl(e, n), r = Wl(n.firstChild, t);
    return !o || !r ? null : [...o, Nm, ...r];
} }
function q_(e, t) { let n = [], o = null; for (o = e; o != null && o !== t; o = o.nextSibling)
    n.push(wm); return o == null ? null : n; }
function Gh(e, t, n) { let o = Wl(e, t); return o === null ? null : U_(n, o); }
function hy(e, t, n) { let o = e.parent, r, i, s; for (; o !== null && (ho(o, t) || n?.has(o.index));)
    o = o.parent; o === null || !(o.type & 3) ? (r = s = _u, i = t[X][V]) : (r = o.index, i = x(t[r]), s = N(r - E)); let a = x(t[e.index]); if (e.type & 44) {
    let l = tn(t, e);
    l && (a = l);
} let c = Gh(i, a, s); if (c === null && i !== a) {
    let l = i.ownerDocument.body;
    if (c = Gh(l, a, bu), c === null)
        throw E_(t, e);
} return c; }
function Q_(e, t) { let n = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, { acceptNode: Y_ }), o, r = new Map; for (; o = n.nextNode();) {
    let i = "ngh=", s = o?.textContent, a = s?.indexOf(i) ?? -1;
    if (a > -1) {
        let c = s.substring(a + i.length).trim();
        r.set(c, o);
    }
} return r; }
function Y_(e) { return e.textContent?.trimStart().startsWith("ngh=") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
var gy = !1, my = () => { };
function Td(e) { gy = e; }
function da() { return gy; }
function Z_(e, t, n, o) { my(e, t, n, o); }
function vy() { my = tb; }
function yy(e) { return e = e ?? I(me), e.get(ku, !1); }
function Ey(e, t) { let n = t.i18nChildren.get(e); return n === void 0 && (n = K_(e), t.i18nChildren.set(e, n)), n; }
function K_(e) { let t = new Set; function n(o) { switch (t.add(o.index), o.kind) {
    case 1:
    case 2: {
        for (let r of o.children)
            n(r);
        break;
    }
    case 3: {
        for (let r of o.cases)
            for (let i of r)
                n(i);
        break;
    }
} } for (let o = E; o < e.bindingStartIndex; o++) {
    let r = e.data[o];
    if (!(!r || !r.ast))
        for (let i of r.ast)
            n(i);
} return t.size === 0 ? null : t; }
function Iy(e, t, n) { if (!n.isI18nHydrationEnabled)
    return null; let o = e[m], r = o.data[t]; if (!r || !r.ast)
    return null; let i = o.data[r.parentTNodeIndex]; if (i && gm(i))
    return null; let s = { caseQueue: [], disconnectedNodes: new Set, disjointNodes: new Set }; return ql(e, s, n, r.ast), s.caseQueue.length === 0 && s.disconnectedNodes.size === 0 && s.disjointNodes.size === 0 ? null : s; }
function ql(e, t, n, o) { let r = null; for (let i of o) {
    let s = X_(e, t, n, i);
    s && (J_(r, s) && t.disjointNodes.add(i.index - E), r = s);
} return r; }
function J_(e, t) { return e && e.nextSibling !== t; }
function X_(e, t, n, o) { let r = x(e[o.index]); if (!r || dy(r))
    return t.disconnectedNodes.add(o.index - E), null; let i = r; switch (o.kind) {
    case 0: {
        Uu(n, i);
        break;
    }
    case 1:
    case 2: {
        ql(e, t, n, o.children);
        break;
    }
    case 3: {
        let s = e[o.currentCaseLViewIndex];
        if (s != null) {
            let a = s < 0 ? ~s : s;
            t.caseQueue.push(a), ql(e, t, n, o.cases[a]);
        }
        break;
    }
} return eb(e, o); }
function eb(e, t) { let o = e[m].data[t.index]; return ws(o) ? tn(e, o) : t.kind === 3 ? V_(o, e)() ?? x(e[t.index]) : x(e[t.index]) ?? null; }
function Kt(e, t) { e.currentNode = t; }
function $o(e, t, n) { let o = n.index - E, { disconnectedNodes: r } = e, i = t.currentNode; return t.isConnected ? (e.i18nNodes.set(o, i), r.delete(o)) : r.add(o), i; }
function Xc(e, t) { let n = e.currentNode; for (let o = 0; o < t && n; o++)
    n = n?.nextSibling ?? null; return n; }
function el(e, t) { return { currentNode: t, isConnected: e.isConnected }; }
function tb(e, t, n, o) { let r = e[ce]; if (!r || !da() || n && (gm(n) || js(r, n.index - E)))
    return; let i = e[m], s = i.data[t]; function a() { if (uy(o)) {
    let p = Gr(r, i, e, n);
    return n.type & 8 ? p : p.firstChild;
} return r?.firstChild; } let c = a(), l = zm(r) ?? new Set, u = r.i18nNodes ??= new Map, d = r.data[xs]?.[t - E] ?? [], f = r.dehydratedIcuData ??= new Map; On({ hydrationInfo: r, lView: e, i18nNodes: u, disconnectedNodes: l, caseQueue: d, dehydratedIcuData: f }, { currentNode: c, isConnected: !0 }, s.ast), r.disconnectedNodes = l.size === 0 ? null : l; }
function On(e, t, n) { if (Array.isArray(n)) {
    let o = t;
    for (let r of n) {
        let i = z_(e.hydrationInfo, e.lView, r.index - E);
        i && (o = el(t, i)), On(e, o, r);
    }
}
else {
    if (e.disconnectedNodes.has(n.index - E))
        return;
    switch (n.kind) {
        case 0: {
            let o = $o(e, t, n);
            Kt(t, o?.nextSibling ?? null);
            break;
        }
        case 1: {
            On(e, el(t, t.currentNode?.firstChild ?? null), n.children);
            let o = $o(e, t, n);
            Kt(t, o?.nextSibling ?? null);
            break;
        }
        case 2: {
            let o = n.index - E, { hydrationInfo: r } = e, i = $m(r, o);
            switch (n.type) {
                case 0: {
                    let s = $o(e, t, n);
                    if (ow(r, o)) {
                        On(e, t, n.children);
                        let a = Xc(t, 1);
                        Kt(t, a);
                    }
                    else if (On(e, el(t, t.currentNode?.firstChild ?? null), n.children), Kt(t, s?.nextSibling ?? null), i !== null) {
                        let a = Xc(t, i + 1);
                        Kt(t, a);
                    }
                    break;
                }
                case 1: {
                    $o(e, t, n);
                    let s = Xc(t, i + 1);
                    Kt(t, s);
                    break;
                }
            }
            break;
        }
        case 3: {
            let o = t.isConnected ? e.caseQueue.shift() : null, r = { currentNode: null, isConnected: !1 };
            for (let s = 0; s < n.cases.length; s++)
                On(e, s === o ? t : r, n.cases[s]);
            o !== null && e.dehydratedIcuData.set(n.index, { case: o, node: n });
            let i = $o(e, t, n);
            Kt(t, i?.nextSibling ?? null);
            break;
        }
    }
} }
var Dy = () => { };
function nb(e, t, n) { Dy(e, t, n); }
function Ty() { Dy = ob; }
function ob(e, t, n) { let o = e[ce]?.dehydratedIcuData; o && o.get(t)?.case === n && o.delete(t); }
function rb(e) { let t = e[ce]; if (t) {
    let { i18nNodes: n, dehydratedIcuData: o } = t;
    if (n && o) {
        let r = e[C];
        for (let i of o.values())
            ib(r, n, i);
    }
    t.i18nNodes = void 0, t.dehydratedIcuData = void 0;
} }
function ib(e, t, n) { for (let o of n.node.cases[n.case]) {
    let r = t.get(o.index - E);
    r && jr(e, r, !1);
} }
function fa(e) { let t = e[Ne] ?? [], o = e[Y][C], r = []; for (let i of t)
    i.data[Os] !== void 0 ? r.push(i) : Cy(i, o); e[Ne] = r; }
function sb(e) { let { lContainer: t } = e, n = t[Ne]; if (n === null)
    return; let r = t[Y][C]; for (let i of n)
    Cy(i, r); }
function Cy(e, t) { let n = 0, o = e.firstChild; if (o) {
    let r = e.data[ft];
    for (; n < r;) {
        let i = o.nextSibling;
        jr(t, o, !1), o = i, n++;
    }
} }
function pa(e) { fa(e); let t = e[V]; ee(t) && hr(t); for (let n = H; n < e.length; n++)
    hr(e[n]); }
function hr(e) { rb(e); let t = e[m]; for (let n = E; n < t.bindingStartIndex; n++)
    if (Z(e[n])) {
        let o = e[n];
        pa(o);
    }
    else
        ee(e[n]) && hr(e[n]); }
function Cd(e) { let t = e._views; for (let n of t) {
    let o = Vu(n);
    o !== null && o[V] !== null && (ee(o) ? hr(o) : pa(o));
} }
function ab(e, t, n, o) { e !== null && (n.cleanup(t), pa(e.lContainer), Cd(o)); }
function cb(e, t) { let n = []; for (let o of t)
    for (let r = 0; r < (o[kr] ?? 1); r++) {
        let i = { data: o, firstChild: null };
        o[ft] > 0 && (i.firstChild = e, e = ua(o[ft], e)), n.push(i);
    } return [e, n]; }
var My = () => null, Ny = () => null;
function wy() { My = lb, Ny = ub; }
function lb(e, t) { return _y(e, t) ? e[Ne].shift() : (fa(e), null); }
function gr(e, t) { return My(e, t); }
function ub(e, t, n) { if (t.tView.ssrId === null)
    return null; let o = gr(e, t.tView.ssrId); return n[m].firstUpdatePass && o === null && db(n, t), o; }
function Sy(e, t, n) { return Ny(e, t, n); }
function db(e, t) { let n = t; for (; n;) {
    if (zh(e, n))
        return;
    if ((n.flags & 256) === 256)
        break;
    n = n.prev;
} for (n = t.next; n && (n.flags & 512) === 512;) {
    if (zh(e, n))
        return;
    n = n.next;
} }
function _y(e, t) { let n = e[Ne]; return !t || n === null || n.length === 0 ? !1 : n[0].data[ks] === t; }
function zh(e, t) { let n = t.tView?.ssrId; if (n == null)
    return !1; let o = e[t.index]; return Z(o) && _y(o, n) ? (fa(o), !0) : !1; }
var by = class {
}, mr = class {
}, fb = (() => { class e {
    destroyNode = null;
    static __NG_ELEMENT_ID__ = () => pb();
} return e; })();
function pb() { let e = g(), t = M(), n = de(t.index, e); return (ee(n) ? n : e)[C]; }
var Ay = (() => { class e {
    static \u0275prov = ae({ token: e, providedIn: "root", factory: () => null });
} return e; })();
function Md(e) { return e.ngModule !== void 0; }
function Jt(e) { return !!Mo(e); }
function Hi(e) { return !!Ye(e); }
function Wh(e) { return !!Re(e); }
function Zo(e) { return !!W(e); }
function hb(e) { return W(e) ? "component" : Re(e) ? "directive" : Ye(e) ? "pipe" : "type"; }
function gb(e, t) { if (ci(e) && (e = z(e), !e))
    throw new Error(`Expected forwardRef function, imported from "${ke(t)}", to return a standalone entity or NgModule but got "${ke(e) || e}".`); if (Mo(e) == null) {
    let n = W(e) || Re(e) || Ye(e);
    if (n != null) {
        if (!n.standalone) {
            let o = hb(e);
            throw new Error(`The "${ke(e)}" ${o}, imported from "${ke(t)}", is not standalone. Does the ${o} have the standalone: false flag?`);
        }
    }
    else
        throw Md(e) ? new Error(`A module with providers was imported from "${ke(t)}". Modules with providers are not supported in standalone components imports.`) : new Error(`The "${ke(e)}" type, imported from "${ke(t)}", must be a standalone component / directive / pipe or an NgModule. Did you forget to add the required @Component / @Directive / @Pipe or @NgModule annotation?`);
} }
var Ql = class {
    ownerNgModule = new WeakMap;
    ngModulesWithSomeUnresolvedDecls = new Set;
    ngModulesScopeCache = new WeakMap;
    standaloneComponentsScopeCache = new WeakMap;
    resolveNgModulesDecls() { if (this.ngModulesWithSomeUnresolvedDecls.size !== 0) {
        for (let t of this.ngModulesWithSomeUnresolvedDecls) {
            let n = Mo(t);
            if (n?.declarations)
                for (let o of Wo(n.declarations))
                    Zo(o) && this.ownerNgModule.set(o, t);
        }
        this.ngModulesWithSomeUnresolvedDecls.clear();
    } }
    getComponentDependencies(t, n) { this.resolveNgModulesDecls(); let o = W(t); if (o === null)
        throw new Error(`Attempting to get component dependencies for a type that is not a component: ${t}`); if (o.standalone) {
        let r = this.getStandaloneComponentScope(t, n);
        return r.compilation.isPoisoned ? { dependencies: [] } : { dependencies: [...r.compilation.directives, ...r.compilation.pipes, ...r.compilation.ngModules] };
    }
    else {
        if (!this.ownerNgModule.has(t))
            return { dependencies: [] };
        let r = this.getNgModuleScope(this.ownerNgModule.get(t));
        return r.compilation.isPoisoned ? { dependencies: [] } : { dependencies: [...r.compilation.directives, ...r.compilation.pipes] };
    } }
    registerNgModule(t, n) { if (!Jt(t))
        throw new Error(`Attempting to register a Type which is not NgModule as NgModule: ${t}`); this.ngModulesWithSomeUnresolvedDecls.add(t); }
    clearScopeCacheFor(t) { this.ngModulesScopeCache.delete(t), this.standaloneComponentsScopeCache.delete(t); }
    getNgModuleScope(t) { if (this.ngModulesScopeCache.has(t))
        return this.ngModulesScopeCache.get(t); let n = this.computeNgModuleScope(t); return this.ngModulesScopeCache.set(t, n), n; }
    computeNgModuleScope(t) { let n = di(t), o = { exported: { directives: new Set, pipes: new Set }, compilation: { directives: new Set, pipes: new Set } }; for (let r of Wo(n.imports))
        if (Jt(r)) {
            let i = this.getNgModuleScope(r);
            At(i.exported.directives, o.compilation.directives), At(i.exported.pipes, o.compilation.pipes);
        }
        else if (No(r))
            if (Wh(r) || Zo(r))
                o.compilation.directives.add(r);
            else if (Hi(r))
                o.compilation.pipes.add(r);
            else
                throw new S(980, "The standalone imported type is neither a component nor a directive nor a pipe");
        else {
            o.compilation.isPoisoned = !0;
            break;
        } if (!o.compilation.isPoisoned)
        for (let r of Wo(n.declarations)) {
            if (Jt(r) || No(r)) {
                o.compilation.isPoisoned = !0;
                break;
            }
            Hi(r) ? o.compilation.pipes.add(r) : o.compilation.directives.add(r);
        } for (let r of Wo(n.exports))
        if (Jt(r)) {
            let i = this.getNgModuleScope(r);
            At(i.exported.directives, o.exported.directives), At(i.exported.pipes, o.exported.pipes), At(i.exported.directives, o.compilation.directives), At(i.exported.pipes, o.compilation.pipes);
        }
        else
            Hi(r) ? o.exported.pipes.add(r) : o.exported.directives.add(r); return o; }
    getStandaloneComponentScope(t, n) { if (this.standaloneComponentsScopeCache.has(t))
        return this.standaloneComponentsScopeCache.get(t); let o = this.computeStandaloneComponentScope(t, n); return this.standaloneComponentsScopeCache.set(t, o), o; }
    computeStandaloneComponentScope(t, n) { let o = { compilation: { directives: new Set([t]), pipes: new Set, ngModules: new Set } }; for (let r of Ve(n ?? [])) {
        let i = z(r);
        try {
            gb(i, t);
        }
        catch {
            return o.compilation.isPoisoned = !0, o;
        }
        if (Jt(i)) {
            o.compilation.ngModules.add(i);
            let s = this.getNgModuleScope(i);
            if (s.exported.isPoisoned)
                return o.compilation.isPoisoned = !0, o;
            At(s.exported.directives, o.compilation.directives), At(s.exported.pipes, o.compilation.pipes);
        }
        else if (Hi(i))
            o.compilation.pipes.add(i);
        else if (Wh(i) || Zo(i))
            o.compilation.directives.add(i);
        else
            return o.compilation.isPoisoned = !0, o;
    } return o; }
    isOrphanComponent(t) { let n = W(t); return !n || n.standalone ? !1 : (this.resolveNgModulesDecls(), !this.ownerNgModule.has(t)); }
};
function At(e, t) { for (let n of e)
    t.add(n); }
var Yn = new Ql;
function mb(e, t) { let n = e; for (; n;) {
    let o = TN(n);
    if (o !== null)
        for (let r = E; r < o.length; r++) {
            let i = o[r];
            if (!ee(i) && !Z(i) || i[V] !== n)
                continue;
            let s = o[m], a = Wt(s, r);
            if (ve(a)) {
                let c = s.data[a.directiveStart + a.componentOffset], l = Nd(c);
                if (l !== null && (!t || t(n, l)))
                    return l;
                break;
            }
        }
    n = n.parentNode;
} return null; }
function Nd(e) { return e.debugInfo?.className || e.type.name || null; }
var qi = {}, kt = class {
    injector;
    parentInjector;
    constructor(t, n) { this.injector = t, this.parentInjector = n; }
    get(t, n, o) { let r = this.injector.get(t, qi, o); return r !== qi || n === qi ? r : this.parentInjector.get(t, n, o); }
};
function vr(e) { return ha(e) ? Array.isArray(e) || !(e instanceof Map) && Symbol.iterator in e : !1; }
function vb(e, t, n) { let o = e[Symbol.iterator](), r = t[Symbol.iterator](); for (;;) {
    let i = o.next(), s = r.next();
    if (i.done && s.done)
        return !0;
    if (i.done || s.done || !n(i.value, s.value))
        return !1;
} }
function Ry(e, t) { if (Array.isArray(e))
    for (let n = 0; n < e.length; n++)
        t(e[n]);
else {
    let n = e[Symbol.iterator](), o;
    for (; !(o = n.next()).done;)
        t(o.value);
} }
function ha(e) { return e !== null && (typeof e == "function" || typeof e == "object"); }
function ky(e, t) { let n = vr(e), o = vr(t); return n && o ? vb(e, t, ky) : !n && (e && (typeof e == "object" || typeof e == "function")) && !o && (t && (typeof t == "object" || typeof t == "function")) ? !0 : Object.is(e, t); }
function We(e, t, n) { return e[t] = n; }
function go(e, t) { return e[t]; }
function $(e, t, n) { if (n === F)
    return !1; let o = e[t]; return Object.is(o, n) ? !1 : (e[t] = n, !0); }
function ln(e, t, n, o) { let r = $(e, t, n); return $(e, t + 1, o) || r; }
function ga(e, t, n, o, r) { let i = ln(e, t, n, o); return $(e, t + 2, r) || i; }
function Fe(e, t, n, o, r, i) { let s = ln(e, t, n, o); return ln(e, t + 2, r, i) || s; }
function xt(e, t, n) { return function o(r) { let i = o.__ngNativeEl__; i !== void 0 && WN(r, i); let s = ve(e) ? de(e.index, t) : t; aa(s, 5); let a = t[P], c = qh(t, a, n, r), l = o.__ngNextListenerFn__; for (; l;)
    c = qh(t, a, l, r) && c, l = l.__ngNextListenerFn__; return c; }; }
function qh(e, t, n, o) { let r = Ln(null); try {
    return O(k.OutputStart, t, n), n(o) !== !1;
}
catch (i) {
    return yd(e, i), !1;
}
finally {
    O(k.OutputEnd, t, n), Ln(r);
} }
function wd(e, t, n, o, r, i, s, a) { let c = _n(e), l = !1, u = null; if (!o && c && (u = Eb(t, n, i, e.index)), u !== null) {
    let d = u.__ngLastListenerFn__ || u;
    d.__ngNextListenerFn__ = s, u.__ngLastListenerFn__ = s, l = !0;
}
else {
    let d = te(e, n), f = o ? o(d) : d;
    qN(n, f, i, a), o || (a.__ngNativeEl__ = d);
    let p = r.listen(f, i, a);
    if (!yb(i)) {
        let h = o ? v => o(x(v[e.index])) : e.index;
        xy(h, t, n, i, a, p, !1);
    }
} return l; }
function yb(e) { return e.startsWith("animation") || e.startsWith("transition"); }
function Eb(e, t, n, o) { let r = e.cleanup; if (r != null)
    for (let i = 0; i < r.length - 1; i += 2) {
        let s = r[i];
        if (s === n && r[i + 1] === o) {
            let a = t[Ut], c = r[i + 2];
            return a && a.length > c ? a[c] : null;
        }
        typeof s == "string" && (i += 2);
    } return null; }
function xy(e, t, n, o, r, i, s) { let a = t.firstCreatePass ? Gp(t) : null, c = $p(n), l = c.length; c.push(r, i), a && a.push(o, e, l, (l + 1) * (s ? -1 : 1)); }
function Ib(e, t, n, o, r) { let i = xt(e, t, n), s = Yl(e, t, o, r, i); }
function Yl(e, t, n, o, r) { let i = null, s = null, a = null, c = !1, l = e.directiveToIndex.get(n.type); if (typeof l == "number" ? i = l : [i, s, a] = l, s !== null && a !== null && e.hostDirectiveOutputs?.hasOwnProperty(o)) {
    let u = e.hostDirectiveOutputs[o];
    for (let d = 0; d < u.length; d += 2) {
        let f = u[d];
        if (f >= s && f <= a)
            c = !0, hs(e, t, f, u[d + 1], o, r);
        else if (f > a)
            break;
    }
} return n.outputs.hasOwnProperty(o) && (c = !0, hs(e, t, i, o, o, r)), c; }
function hs(e, t, n, o, r, i) { let s = t[n], a = t[m], l = a.data[n].outputs[o], d = s[l].subscribe(i); xy(e.index, a, t, r, i, d, !0); }
function Oy() { Ly(); }
function Ly() { let e = g(), t = w(), n = M(); if (t.firstCreatePass && Db(t, n), n.controlDirectiveIndex === -1)
    return; K("NgSignalForms"); let o = e[n.controlDirectiveIndex]; t.data[n.controlDirectiveIndex].controlDef.create(o, new gs(e, t, n)); }
function Py() { Fy(); }
function Fy() { let e = g(), t = w(), n = we(); if (n.controlDirectiveIndex === -1)
    return; let o = t.data[n.controlDirectiveIndex].controlDef, r = e[n.controlDirectiveIndex]; o.update(r, new gs(e, t, n)); }
var gs = class {
    lView;
    tView;
    tNode;
    hasPassThrough;
    constructor(t, n, o) { this.lView = t, this.tView = n, this.tNode = o, this.hasPassThrough = !!(o.flags & 4096); }
    get customControl() { return this.tNode.customControlIndex !== -1 ? this.lView[this.tNode.customControlIndex] : void 0; }
    get nativeElement() { return te(this.tNode, this.lView); }
    get descriptor() { return `<${this.tNode.value}>`; }
    listenToCustomControlOutput(t, n) { let o = this.tView.data[this.tNode.customControlIndex]; Yl(this.tNode, this.lView, o, t, xt(this.tNode, this.lView, n)); }
    listenToCustomControlModel(t) { let n = this.tNode.flags & 1024 ? "valueChange" : "checkedChange", o = this.tView.data[this.tNode.customControlIndex]; Yl(this.tNode, this.lView, o, n, xt(this.tNode, this.lView, t)); }
    listenToDom(t, n) { wd(this.tNode, this.tView, this.lView, void 0, this.lView[C], t, n, xt(this.tNode, this.lView, n)); }
    setInputOnDirectives(t, n) { let o = this.tNode.inputs?.[t], r = this.tNode.hostDirectiveInputs?.[t]; if (!o && !r)
        return !1; let i = !1; if (o)
        for (let s of o) {
            if (s === this.tNode.controlDirectiveIndex)
                continue;
            let a = this.tView.data[s], c = this.lView[s];
            an(a, c, t, n), i = !0;
        } if (r)
        for (let s = 0; s < r.length; s += 2) {
            let a = r[s];
            if (a === this.tNode.controlDirectiveIndex)
                continue;
            let c = r[s + 1], l = this.tView.data[a], u = this.lView[a];
            an(l, u, c, n), i = !0;
        } return i; }
    setCustomControlModelInput(t) { let n = this.tView.data[this.tNode.customControlIndex], o = this.tNode.flags & 1024 ? "value" : "checked"; Wv(this.tNode, this.tView, this.lView, n, o, t); }
    customControlHasInput(t) { if (this.tNode.customControlIndex === -1)
        return !1; let n = this.tView.data[this.tNode.customControlIndex]; return (n.signalFormsInputPresence ??= this._buildCustomControlInputCache(n))[t] === !0; }
    _buildCustomControlInputCache(t) { let n = {}; for (let o in t.inputs)
        n[o] = !0; if (t.hostDirectives !== null) {
        let o = [...t.hostDirectives];
        for (; o.length > 0;) {
            let r = o.shift();
            if (typeof r != "function") {
                for (let s in r.inputs)
                    n[r.inputs[s]] = !0;
                let i = Qh(r.directive);
                i !== null && o.push(...i);
                continue;
            }
            for (let i of r()) {
                if (typeof i == "function")
                    continue;
                if (i.inputs)
                    for (let a = 0; a < i.inputs.length; a += 2) {
                        let c = i.inputs[a + 1] || i.inputs[a];
                        n[c] = !0;
                    }
                let s = Qh(i.directive);
                s !== null && o.push(...s);
            }
        }
    } return n; }
};
function Qh(e) { return typeof e == "function" && "\u0275dir" in e ? e.\u0275dir.hostDirectives ?? null : null; }
function Db(e, t, n) { for (let r = t.directiveStart; r < t.directiveEnd; r++)
    if (e.data[r].controlDef) {
        t.controlDirectiveIndex = r;
        break;
    } if (t.controlDirectiveIndex === -1)
    return; let o = e.data[t.controlDirectiveIndex].controlDef; if (o.passThroughInput && (t.inputs?.[o.passThroughInput]?.length ?? 0) > 1) {
    t.flags |= 4096;
    return;
} Tb(e, t); }
function Tb(e, t) { for (let n = t.directiveStart; n < t.directiveEnd; n++) {
    let o = e.data[n];
    if (!(t.directiveToIndex && !t.directiveToIndex.has(o.type))) {
        if (Yh(o, "value")) {
            t.flags |= 1024, t.customControlIndex = n;
            return;
        }
        if (Yh(o, "checked")) {
            t.flags |= 2048, t.customControlIndex = n;
            return;
        }
    }
} if (t.hostDirectiveInputs !== null && t.hostDirectiveOutputs !== null && t.directiveToIndex !== null) {
    let n = (o, r) => { let i = t.hostDirectiveInputs[o], s = t.hostDirectiveOutputs[o + "Change"]; if (!i || !s)
        return !1; for (let a = 0; a < i.length; a += 2) {
        let c = i[a];
        for (let l = 0; l < s.length; l += 2) {
            let u = s[l];
            if (c === u)
                for (let d of t.directiveToIndex.values()) {
                    if (!Array.isArray(d))
                        continue;
                    let [f, p, h] = d;
                    if (c >= p && c <= h)
                        return t.flags |= r, t.customControlIndex = f, !0;
                }
        }
    } return !1; };
    if (n("value", 1024) || n("checked", 2048))
        return;
} }
function Yh(e, t) { return Cb(e, t) && Mb(e, t + "Change"); }
function Cb(e, t) { return t in e.inputs; }
function Mb(e, t) { return t in e.outputs; }
var dt = Symbol("BINDING"), Zh = { kind: "input", requiredVars: 1 }, Nb = { kind: "output", requiredVars: 0 };
function Kh(e, t, n) { let o = g(), r = ge(); if ($(o, r, n)) {
    let i = o[m], s = we(), a = de(s.index, o);
    aa(a, 1);
    let c = i.directiveRegistry[e], l = Wv(s, i, o, c, t, n);
} }
function Hy(e, t) { if (e === "formField") {
    let o = { [dt]: Zh, create: () => { Ly(); }, update: () => { Kh(o.targetIdx, e, t()), Fy(); } };
    return o;
} let n = { [dt]: Zh, update: () => Kh(n.targetIdx, e, t()) }; return n; }
function jy(e, t) { let n = { [dt]: Nb, create: () => { let o = g(), r = M(), s = o[m].directiveRegistry[n.targetIdx]; Ib(r, o, t, s, e); } }; return n; }
function wb(e, t) { let n = Hy(e, t), o = jy(e + "Change", i => t.set(i)); return { [dt]: { kind: "twoWay", requiredVars: n[dt].requiredVars + o[dt].requiredVars }, set targetIdx(i) { n.targetIdx = i, o.targetIdx = i; }, create: o.create, update: n.update }; }
var Vy = new b("");
function ms(e, t, n) { let o = n ? e.styles : null, r = n ? e.classes : null, i = 0; if (t !== null)
    for (let s = 0; s < t.length; s++) {
        let a = t[s];
        if (typeof a == "number")
            i = a;
        else if (i == 1)
            r = ai(r, a);
        else if (i == 2) {
            let c = a, l = t[++s];
            o = ai(o, c + ": " + l + ";");
        }
    } n ? e.styles = o : e.stylesWithoutHost = o, n ? e.classes = r : e.classesWithoutHost = r; }
function mo(e, t = 0) { let n = g(); if (n === null)
    return je(e, t); let o = M(); return tm(o, n, z(e), t); }
function By() { let e = "invalid"; throw new Error(e); }
function Uy(e, t, n, o, r) { let i = o === null ? null : { "": -1 }, s = r(e, n); if (s !== null) {
    let a = s, c = null, l = null;
    for (let u of s)
        if (u.resolveHostDirectives !== null) {
            [a, c, l] = u.resolveHostDirectives(s);
            break;
        }
    bb(e, t, n, a, i, c, l);
} i !== null && o !== null && Sb(n, o, i); }
function Sb(e, t, n) { let o = e.localNames = []; for (let r = 0; r < t.length; r += 2) {
    let i = n[t[r + 1]];
    if (i == null)
        throw new S(-301, !1);
    o.push(t[r], i);
} }
function _b(e, t, n) { t.componentOffset = n, (e.components ??= []).push(t.index); }
function bb(e, t, n, o, r, i, s) { let a = o.length, c = null; for (let f = 0; f < a; f++) {
    let p = o[f];
    c === null && Oe(p) && (c = p, _b(e, n, f)), ml(ts(n, t), e, p.type);
} Lb(n, e.data.length, a), c?.viewProvidersResolver && c.viewProvidersResolver(c); for (let f = 0; f < a; f++) {
    let p = o[f];
    p.providersResolver && p.providersResolver(p);
} let l = !1, u = !1, d = $r(e, t, a, null); a > 0 && (n.directiveToIndex = new Map); for (let f = 0; f < a; f++) {
    let p = o[f];
    if (n.mergedAttrs = Wn(n.mergedAttrs, p.hostAttrs), Rb(e, n, t, d, p), Ob(d, p, r), s !== null && s.has(p)) {
        let [v, y] = s.get(p);
        n.directiveToIndex.set(p.type, [d, v + n.directiveStart, y + n.directiveStart]);
    }
    else
        (i === null || !i.has(p)) && n.directiveToIndex.set(p.type, d);
    p.contentQueries !== null && (n.flags |= 4), (p.hostBindings !== null || p.hostAttrs !== null || p.hostVars !== 0) && (n.flags |= 64);
    let h = p.type.prototype;
    !l && (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), l = !0), !u && (h.ngOnChanges || h.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), u = !0), d++;
} Ab(e, n, i); }
function Ab(e, t, n) { for (let o = t.directiveStart; o < t.directiveEnd; o++) {
    let r = e.data[o];
    if (n === null || !n.has(r))
        Jh(0, t, r, o), Jh(1, t, r, o), eg(t, o, !1);
    else {
        let i = n.get(r);
        Xh(0, t, i, o), Xh(1, t, i, o), eg(t, o, !0);
    }
} }
function Jh(e, t, n, o) { let r = e === 0 ? n.inputs : n.outputs; for (let i in r)
    if (r.hasOwnProperty(i)) {
        let s;
        e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {}, s[i] ??= [], s[i].push(o), $y(t, i);
    } }
function Xh(e, t, n, o) { let r = e === 0 ? n.inputs : n.outputs; for (let i in r)
    if (r.hasOwnProperty(i)) {
        let s = r[i], a;
        e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {}, a[s] ??= [], a[s].push(o, i), $y(t, s);
    } }
function $y(e, t) { t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16); }
function eg(e, t, n) { let { attrs: o, inputs: r, hostDirectiveInputs: i } = e; if (o === null || !n && r === null || n && i === null || Xu(e)) {
    e.initialInputs ??= [], e.initialInputs.push(null);
    return;
} let s = null, a = 0; for (; a < o.length;) {
    let c = o[a];
    if (c === 0) {
        a += 4;
        continue;
    }
    else if (c === 5) {
        a += 2;
        continue;
    }
    else if (typeof c == "number")
        break;
    if (!n && r.hasOwnProperty(c)) {
        let l = r[c];
        for (let u of l)
            if (u === t) {
                s ??= [], s.push(c, o[a + 1]);
                break;
            }
    }
    else if (n && i.hasOwnProperty(c)) {
        let l = i[c];
        for (let u = 0; u < l.length; u += 2)
            if (l[u] === t) {
                s ??= [], s.push(l[u + 1], o[a + 1]);
                break;
            }
    }
    a += 2;
} e.initialInputs ??= [], e.initialInputs.push(s); }
function Rb(e, t, n, o, r) { e.data[o] = r; let i = r.factory || (r.factory = pi(r.type, !0)), s = new on(i, Oe(r), mo, null); e.blueprint[o] = s, n[o] = s, kb(e, t, o, $r(e, n, r.hostVars, F), r); }
function kb(e, t, n, o, r) { let i = r.hostBindings; if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    xb(s) != a && s.push(a), s.push(n, o, i);
} }
function xb(e) { let t = e.length; for (; t > 0;) {
    let n = e[--t];
    if (typeof n == "number" && n < 0)
        return n;
} return 0; }
function Ob(e, t, n) { if (n) {
    if (t.exportAs)
        for (let o = 0; o < t.exportAs.length; o++)
            n[t.exportAs[o]] = e;
    Oe(t) && (n[""] = e);
} }
function Lb(e, t, n) { e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t; }
function Sd(e, t, n, o, r, i, s, a) { let c = t[m], l = c.consts, u = fe(l, s), d = In(c, e, n, o, u); return i && Uy(c, t, d, fe(l, a), r), d.mergedAttrs = Wn(d.mergedAttrs, d.attrs), d.attrs !== null && ms(d, d.attrs, !1), d.mergedAttrs !== null && ms(d, d.mergedAttrs, !0), c.queries !== null && c.queries.elementStart(c, d), d; }
function _d(e, t) { zg(e, t), lc(t) && e.queries.elementEnd(t); }
function Gy(e, t, n, o, r, i) { let s = t.consts, a = fe(s, r), c = In(t, e, n, o, a); if (c.mergedAttrs = Wn(c.mergedAttrs, c.attrs), i != null) {
    let l = fe(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2)
        c.localNames.push(l[u], -1);
} return c.attrs !== null && ms(c, c.attrs, !1), c.mergedAttrs !== null && ms(c, c.mergedAttrs, !0), t.queries !== null && t.queries.elementStart(t, c), c; }
var zy = typeof ShadowRoot < "u", Pb = typeof Document < "u";
function Fb(e) { return Object.keys(e).map(t => { let [n, o, r] = e[t], i = { propName: n, templateName: t, isSignal: (o & Xs.SignalBased) !== 0 }; return r && (i.transform = r), i; }); }
function Hb(e) { return Object.keys(e).map(t => ({ propName: e[t], templateName: t })); }
function jb(e, t, n) { let o = t instanceof at ? t : t?.injector; return o && e.getStandaloneInjector !== null && (o = e.getStandaloneInjector(o) || o), o ? new kt(n, o) : n; }
function Vb(e) { let t = e.get(mr, null); if (t === null)
    throw new S(407, !1); let n = e.get(Ay, null), o = e.get(_t, null), r = e.get(En, null, { optional: !0 }); return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: o, ngReflect: !1, tracingService: r }; }
function Bb(e, t) { let n = Wy(e); return Us(t, n, n === "svg" ? Pp : n === "math" ? Fp : null); }
function Ub(e) { if (e?.toLowerCase() === "script")
    throw new S(905, !1); }
function Wy(e) { return (e.selectors[0][0] || "div").toLowerCase(); }
var un = class {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    cachedInputs = null;
    cachedOutputs = null;
    get inputs() { return this.cachedInputs ??= Fb(this.componentDef.inputs), this.cachedInputs; }
    get outputs() { return this.cachedOutputs ??= Hb(this.componentDef.outputs), this.cachedOutputs; }
    constructor(t, n) { this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = pS(t.selectors), this.ngContentSelectors = t.ngContentSelectors ?? [], this.isBoundToModule = !!n; }
    create(t, n, o, r, i, s) { O(k.DynamicComponentStart); let a = L(null); try {
        let c = this.componentDef, l = jb(c, r || this.ngModule, t), u = Vb(l), d = u.tracingService;
        return d && d.componentCreate ? d.componentCreate(Nd(c), () => this.createComponentRef(u, l, n, o, i, s)) : this.createComponentRef(u, l, n, o, i, s);
    }
    finally {
        L(a);
    } }
    createComponentRef(t, n, o, r, i, s) { let a = this.componentDef, c = $b(r, a, s, i), l = t.rendererFactory.createRenderer(null, a), u = r ? GS(l, r, a.encapsulation, n) : Bb(a, l); Ub(u?.tagName); let d = n.get(Vy, null), f = Gb(u, () => n.get(Rn, null) ?? Ar()); d && d.addHost(f); let p = s?.some(tg) || i?.some(y => typeof y != "function" && y.bindings.some(tg)), h = Js(null, c, null, 512 | pd(a), null, null, t, l, n, null, Bm(u, n, !0)); d && zy && f instanceof ShadowRoot && Ho(h, () => { d.removeHost(f); }), h[E] = u, Mi(h); let v = null; try {
        let y = Sd(E, h, 2, "#host", () => c.directiveRegistry, !0, 0);
        uv(l, u, y), Le(u, h), ea(c, h, y), $u(c, y, h), _d(c, y), o !== void 0 && Wb(y, this.ngContentSelectors, o), v = de(y.index, h), h[P] = v[P], ia(c, h, null);
    }
    catch (y) {
        throw v !== null && El(v), El(h), y;
    }
    finally {
        O(k.DynamicComponentEnd), Ni();
    } return new vs(this.componentType, h, !!p); }
};
function $b(e, t, n, o) { let r = e ? ["ng-version", "22.0.7"] : hS(t.selectors[0]), i = null, s = null, a = 0; if (n)
    for (let u of n)
        a += u[dt].requiredVars, u.create && (u.targetIdx = 0, (i ??= []).push(u)), u.update && (u.targetIdx = 0, (s ??= []).push(u)); if (o)
    for (let u = 0; u < o.length; u++) {
        let d = o[u];
        if (typeof d != "function")
            for (let f of d.bindings) {
                a += f[dt].requiredVars;
                let p = u + 1;
                f.create && (f.targetIdx = p, (i ??= []).push(f)), f.update && (f.targetIdx = p, (s ??= []).push(f));
            }
    } let c = [t]; if (o)
    for (let u of o) {
        let d = typeof u == "function" ? u : u.type, f = Re(d);
        c.push(f);
    } return fd(0, null, zb(i, s), 1, a, c, null, null, null, [r], null); }
function Gb(e, t) { let n = e.getRootNode?.(); return Pb && n instanceof Document ? n.head : n && zy && n instanceof ShadowRoot ? n : t().head; }
function zb(e, t) { return !e && !t ? null : n => { if (n & 1 && e)
    for (let o of e)
        o.create(); if (n & 2 && t)
    for (let o of t)
        o.update(); }; }
function tg(e) { let t = e[dt].kind; return t === "input" || t === "twoWay"; }
var vs = class extends by {
    _rootLView;
    _hasInputBindings;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    location;
    previousInputValues = null;
    _tNode;
    constructor(t, n, o) { super(), this._rootLView = n, this._hasInputBindings = o, this._tNode = Wt(n[m], E), this.location = no(this._tNode, n), this.instance = de(this._tNode.index, n)[P], this.hostView = this.changeDetectorRef = new Lt(n, void 0), this.componentType = t; }
    setInput(t, n) { this._hasInputBindings; let o = this._tNode; if (this.previousInputValues ??= new Map, this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
        return; let r = this._rootLView, i = ra(o, r[m], r, t, n); this.previousInputValues.set(t, n); let s = de(o.index, r); aa(s, 1); }
    get injector() { return new ye(this._tNode, this._rootLView); }
    destroy() { this.hostView.destroy(); }
    onDestroy(t) { this.hostView.onDestroy(t); }
};
function Wb(e, t, n) { let o = e.projection = []; for (let r = 0; r < t.length; r++) {
    let i = n[r];
    o.push(i != null && i.length ? Array.from(i) : null);
} }
var ma = (() => { class e {
    static __NG_ELEMENT_ID__ = qb;
} return e; })();
function qb() { let e = M(); return qy(e, g()); }
var Zl = class e extends ma {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, o) { super(), this._lContainer = t, this._hostTNode = n, this._hostLView = o; }
    get element() { return no(this._hostTNode, this._hostLView); }
    get injector() { return new ye(this._hostTNode, this._hostLView); }
    get parentInjector() { let t = Du(this._hostTNode, this._hostLView); if (Yg(t)) {
        let n = Xi(t, this._hostLView), o = Ji(t), r = n[m].data[o + 8];
        return new ye(r, n);
    }
    else
        return new ye(null, this._hostLView); }
    clear() { for (; this.length > 0;)
        this.remove(this.length - 1); }
    get(t) { let n = ng(this._lContainer); return n !== null && n[t] || null; }
    get length() { return this._lContainer.length - H; }
    createEmbeddedView(t, n, o) { let r, i; typeof o == "number" ? r = o : o != null && (r = o.index, i = o.injector); let s = gr(this._lContainer, t.ssrId), a = t.createEmbeddedViewImpl(n || {}, i, s); return this.insertImpl(a, r, cn(this._hostTNode, s)), a; }
    createComponent(t, n, o, r, i, s, a) { let c, l = n || {}; c = l.index, o = l.injector, r = l.projectableNodes, i = l.environmentInjector || l.ngModuleRef, s = l.directives, a = l.bindings; let u = new un(W(t)), d = o || this.parentInjector; if (!i && u.ngModule == null) {
        let D = this.parentInjector.get(at, null);
        D && (i = D);
    } let f = W(u.componentType ?? {}), p = gr(this._lContainer, f?.id ?? null), h = p?.firstChild ?? null, v = u.create(d, r, h, i, s, a); return this.insertImpl(v.hostView, c, cn(this._hostTNode, p)), v; }
    insert(t, n) { return this.insertImpl(t, n, !0); }
    insertImpl(t, n, o) { let r = t._lView; if (Bp(r)) {
        let a = this.indexOf(t);
        if (a !== -1)
            this.detach(a);
        else {
            let c = r[Y], l = new e(c, c[ie], c[Y]);
            l.detach(l.indexOf(t));
        }
    } let i = this._adjustIndex(n), s = this._lContainer; return po(s, r, i, o), t.attachToViewContainerRef(), oc(tl(s), i, t), t; }
    move(t, n) { return this.insert(t, n); }
    indexOf(t) { let n = ng(this._lContainer); return n !== null ? n.indexOf(t) : -1; }
    remove(t) { let n = this._adjustIndex(t, -1), o = fr(this._lContainer, n); o && (wo(tl(this._lContainer), n), Ur(o[m], o)); }
    detach(t) { let n = this._adjustIndex(t, -1), o = fr(this._lContainer, n); return o && wo(tl(this._lContainer), n) != null ? new Lt(o) : null; }
    _adjustIndex(t, n = 0) { return t ?? this.length + n; }
};
function ng(e) { return e[xo]; }
function tl(e) { return e[xo] || (e[xo] = []); }
function qy(e, t) { let n, o = t[e.index]; return Z(o) ? n = o : (n = ny(o, t, null, e), t[e.index] = n, hd(t, n)), Qy(n, t, e, o), new Zl(n, e, t); }
function Qb(e, t) { let n = e[C], o = n.createComment(""), r = te(t, e), i = n.parentNode(r); return rn(n, i, o, n.nextSibling(r), !1), o; }
var Qy = Zy, bd = () => !1;
function Yy(e, t, n) { return bd(e, t, n); }
function Zy(e, t, n, o) { if (e[Ue])
    return; let r; n.type & 8 ? r = x(o) : r = Qb(t, n), e[Ue] = r; }
function Yb(e, t, n) { if (e[Ue] && e[Ne])
    return !0; let o = n[ce], r = t.index - E; if (!o || oo(t) || js(o, r))
    return !1; let s = Ml(o, r), a = o.data[ro]?.[r]; if (a === void 0)
    return !1; let [c, l] = cb(s, a); return e[Ue] = c, e[Ne] = l, !0; }
function Zb(e, t, n, o) { bd(e, n, t) || Zy(e, t, n, o); }
function Ky() { Qy = Zb, bd = Yb; }
var Kl = class e {
    queryList;
    matches = null;
    constructor(t) { this.queryList = t; }
    clone() { return new e(this.queryList); }
    setDirty() { this.queryList.setDirty(); }
}, Jl = class e {
    queries;
    constructor(t = []) { this.queries = t; }
    createEmbeddedView(t) { let n = t.queries; if (n !== null) {
        let o = t.contentQueries !== null ? t.contentQueries[0] : n.length, r = [];
        for (let i = 0; i < o; i++) {
            let s = n.getByIndex(i), a = this.queries[s.indexInDeclarationView];
            r.push(a.clone());
        }
        return new e(r);
    } return null; }
    insertView(t) { this.dirtyQueriesWithMatches(t); }
    detachView(t) { this.dirtyQueriesWithMatches(t); }
    finishViewCreation(t) { this.dirtyQueriesWithMatches(t); }
    dirtyQueriesWithMatches(t) { for (let n = 0; n < this.queries.length; n++)
        Rd(t, n).matches !== null && this.queries[n].setDirty(); }
}, ys = class {
    flags;
    read;
    predicate;
    constructor(t, n, o = null) { this.flags = n, this.read = o, typeof t == "string" ? this.predicate = tA(t) : this.predicate = t; }
}, Xl = class e {
    queries;
    constructor(t = []) { this.queries = t; }
    elementStart(t, n) { for (let o = 0; o < this.queries.length; o++)
        this.queries[o].elementStart(t, n); }
    elementEnd(t) { for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(t); }
    embeddedTView(t) { let n = null; for (let o = 0; o < this.length; o++) {
        let r = n !== null ? n.length : 0, i = this.getByIndex(o).embeddedTView(t, r);
        i && (i.indexInDeclarationView = o, n !== null ? n.push(i) : n = [i]);
    } return n !== null ? new e(n) : null; }
    template(t, n) { for (let o = 0; o < this.queries.length; o++)
        this.queries[o].template(t, n); }
    getByIndex(t) { return this.queries[t]; }
    get length() { return this.queries.length; }
    track(t) { this.queries.push(t); }
}, eu = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n = -1) { this.metadata = t, this._declarationNodeIndex = n; }
    elementStart(t, n) { this.isApplyingToNode(n) && this.matchTNode(t, n); }
    elementEnd(t) { this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1); }
    template(t, n) { this.elementStart(t, n); }
    embeddedTView(t, n) { return this.isApplyingToNode(t) ? (this.crossesNgTemplate = !0, this.addMatch(-t.index, n), new e(this.metadata)) : null; }
    isApplyingToNode(t) { if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex, o = t.parent;
        for (; o !== null && o.type & 8 && o.index !== n;)
            o = o.parent;
        return n === (o !== null ? o.index : -1);
    } return this._appliesToNextNode; }
    matchTNode(t, n) { let o = this.metadata.predicate; if (Array.isArray(o))
        for (let r = 0; r < o.length; r++) {
            let i = o[r];
            this.matchTNodeWithReadOption(t, n, Kb(n, i)), this.matchTNodeWithReadOption(t, n, Gi(n, t, i, !1, !1));
        }
    else
        o === pr ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1) : this.matchTNodeWithReadOption(t, n, Gi(n, t, o, !1, !1)); }
    matchTNodeWithReadOption(t, n, o) { if (o !== null) {
        let r = this.metadata.read;
        if (r !== null)
            if (r === br || r === ma || r === pr && n.type & 4)
                this.addMatch(n.index, -2);
            else {
                let i = Gi(n, t, r, !1, !1);
                i !== null && this.addMatch(n.index, i);
            }
        else
            this.addMatch(n.index, o);
    } }
    addMatch(t, n) { this.matches === null ? this.matches = [t, n] : this.matches.push(t, n); }
};
function Kb(e, t) { let n = e.localNames; if (n !== null) {
    for (let o = 0; o < n.length; o += 2)
        if (n[o] === t)
            return n[o + 1];
} return null; }
function Jb(e, t) { return e.type & 11 ? no(e, t) : e.type & 4 ? ca(e, t) : null; }
function Xb(e, t, n, o) { return n === -1 ? Jb(t, e) : n === -2 ? eA(e, t, o) : sr(e, e[m], n, t); }
function eA(e, t, n) { if (n === br)
    return no(t, e); if (n === pr)
    return ca(t, e); if (n === ma)
    return qy(t, e); }
function Jy(e, t, n, o) { let r = t[Ke].queries[o]; if (r.matches === null) {
    let i = e.data, s = n.matches, a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
        let l = s[c];
        if (l < 0)
            a.push(null);
        else {
            let u = i[l];
            a.push(Xb(t, u, s[c + 1], n.metadata.read));
        }
    }
    r.matches = a;
} return r.matches; }
function tu(e, t, n, o) { let r = e.queries.getByIndex(n), i = r.matches; if (i !== null) {
    let s = Jy(e, t, r, n);
    for (let a = 0; a < i.length; a += 2) {
        let c = i[a];
        if (c > 0)
            o.push(s[a / 2]);
        else {
            let l = i[a + 1], u = t[-c];
            for (let d = H; d < u.length; d++) {
                let f = u[d];
                f[Mt] === f[Y] && tu(f[m], f, l, o);
            }
            if (u[Gt] !== null) {
                let d = u[Gt];
                for (let f = 0; f < d.length; f++) {
                    let p = d[f];
                    tu(p[m], p, l, o);
                }
            }
        }
    }
} return o; }
function Ad(e, t) { return e[Ke].queries[t].queryList; }
function Xy(e, t, n) { let o = new rs((n & 4) === 4); return zp(e, t, o, o.destroy), (t[Ke] ??= new Jl).queries.push(new Kl(o)) - 1; }
function eE(e, t, n) { let o = w(); return o.firstCreatePass && (nE(o, new ys(e, t, n), -1), (t & 2) === 2 && (o.staticViewQueries = !0)), Xy(o, g(), t); }
function tE(e, t, n, o) { let r = w(); if (r.firstCreatePass) {
    let i = M();
    nE(r, new ys(t, n, o), i.index), nA(r, e), (n & 2) === 2 && (r.staticContentQueries = !0);
} return Xy(r, g(), n); }
function tA(e) { return e.split(",").map(t => t.trim()); }
function nE(e, t, n) { e.queries === null && (e.queries = new Xl), e.queries.track(new eu(t, n)); }
function nA(e, t) { let n = e.contentQueries || (e.contentQueries = []), o = n.length ? n[n.length - 1] : -1; t !== o && n.push(e.queries.length - 1, t); }
function Rd(e, t) { return e.queries.getByIndex(t); }
function oE(e, t) { let n = e[m], o = Rd(n, t); return o.crossesNgTemplate ? tu(n, e, t, []) : Jy(n, e, o, t); }
function kd(e, t, n) { let o, r = hp(() => { o._dirtyCounter(); let i = oA(o, e); if (t && i === void 0)
    throw new S(-951, !1); return i; }); return o = r[qe], o._dirtyCounter = Fc(0), o._flatValue = void 0, r; }
function xd(e) { return kd(!0, !1, e); }
function Od(e) { return kd(!0, !0, e); }
function Ld(e) { return kd(!1, !1, e); }
function rE(e, t) { let n = e[qe]; n._lView = g(), n._queryIndex = t, n._queryList = Ad(n._lView, t), n._queryList.onDirty(() => n._dirtyCounter.update(o => o + 1)); }
function oA(e, t) { let n = e._lView, o = e._queryIndex; if (n === void 0 || o === void 0 || n[A] & 4)
    return t ? void 0 : j; let r = Ad(n, o), i = oE(n, o); return r.reset(i, pm), t ? r.first : r._changesDetected || e._flatValue === void 0 ? e._flatValue = r.toArray() : e._flatValue; }
function Pd(e) { return !!e && typeof e.then == "function"; }
function iE(e) { return !!e && typeof e.subscribe == "function"; }
var dn = class {
}, sE = class {
};
function rA(e, t) { return new Zn(e, t ?? null, []); }
var Zn = class extends dn {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    constructor(t, n, o, r = !0) { super(), this.ngModuleType = t, this._parent = n; let i = Mo(t); this._bootstrapComponents = Wo(i.bootstrap), this._r3Injector = eh(t, n, [{ provide: dn, useValue: this }, ...o], si(t), new Set(["environment"])), r && this.resolveInjectorInitializers(); }
    resolveInjectorInitializers() { this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(this.ngModuleType); }
    get injector() { return this._r3Injector; }
    destroy() { let t = this._r3Injector; !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null; }
    onDestroy(t) { this.destroyCbs.push(t); }
}, Kn = class extends sE {
    moduleType;
    constructor(t) { super(), this.moduleType = t; }
    create(t) { return new Zn(this.moduleType, t, []); }
};
function aE(e, t, n) { return new Zn(e, t, n, !1); }
var yr = class extends dn {
    injector;
    instance = null;
    constructor(t) { super(); let n = new Bt([...t.providers, { provide: dn, useValue: this }], t.parent || vi(), t.debugName, new Set(["environment"])); this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers(); }
    destroy() { this.injector.destroy(); }
    onDestroy(t) { this.injector.onDestroy(t); }
};
function Fd(e, t, n = null) { return new yr({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0 }).injector; }
var iA = (() => { class e {
    _injector;
    cachedInjectors = new Map;
    constructor(n) { this._injector = n; }
    getOrCreateStandaloneInjector(n) { if (!n.standalone)
        return null; if (!this.cachedInjectors.has(n)) {
        let o = sc(!1, n.type), r = o.length > 0 ? Fd([o], this._injector, "") : null;
        this.cachedInjectors.set(n, r);
    } return this.cachedInjectors.get(n); }
    ngOnDestroy() { try {
        for (let n of this.cachedInjectors.values())
            n !== null && n.destroy();
    }
    finally {
        this.cachedInjectors.clear();
    } }
    static \u0275prov = ae({ token: e, providedIn: "environment", factory: () => new e(je(at)) });
} return e; })();
function cE(e) { return rt(() => { let t = fE(e), n = be(G({}, t), { decls: e.decls, vars: e.vars, template: e.template, consts: e.consts || null, ngContentSelectors: e.ngContentSelectors, onPush: e.changeDetection !== bs.Eager, directiveDefs: null, pipeDefs: null, dependencies: t.standalone && e.dependencies || null, getStandaloneInjector: t.standalone ? r => r.get(iA).getOrCreateStandaloneInjector(n) : null, getExternalStyles: null, signals: e.signals ?? !1, data: e.data || {}, encapsulation: e.encapsulation || Pe.Emulated, styles: e.styles || j, _: null, schemas: e.schemas || null, tView: null, id: "" }); t.standalone && K("NgStandalone"), pE(n); let o = e.dependencies; return n.directiveDefs = Es(o, lE), n.pipeDefs = Es(o, Ye), n.id = lA(n), n; }); }
function lE(e) { return W(e) || Re(e); }
function Hd(e) { return rt(() => ({ type: e.type, bootstrap: e.bootstrap || j, declarations: e.declarations || j, imports: e.imports || j, exports: e.exports || j, transitiveCompileScopes: null, schemas: e.schemas || null, id: e.id || null })); }
function sA(e, t) { if (e == null)
    return st; let n = {}; for (let o in e)
    if (e.hasOwnProperty(o)) {
        let r = e[o], i, s, a, c;
        Array.isArray(r) ? (a = r[0], i = r[1], s = r[2] ?? i, c = r[3] || null) : (i = r, s = r, a = Xs.None, c = null), n[i] = [o, a, c], t[i] = s;
    } return n; }
function aA(e) { if (e == null)
    return st; let t = {}; for (let n in e)
    e.hasOwnProperty(n) && (t[e[n]] = n); return t; }
function uE(e) { return rt(() => { let t = fE(e); return pE(t), t; }); }
function dE(e) { return { type: e.type, name: e.name, factory: null, pure: e.pure !== !1, standalone: e.standalone ?? !0, onDestroy: e.type.prototype.ngOnDestroy || null }; }
function fE(e) { let t = {}; return { type: e.type, providersResolver: null, viewProvidersResolver: null, factory: null, hostBindings: e.hostBindings || null, hostVars: e.hostVars || 0, hostAttrs: e.hostAttrs || null, contentQueries: e.contentQueries || null, declaredInputs: t, inputConfig: e.inputs || st, exportAs: e.exportAs || null, standalone: e.standalone ?? !0, signals: e.signals === !0, selectors: e.selectors || j, viewQuery: e.viewQuery || null, features: e.features || null, setInput: null, resolveHostDirectives: null, hostDirectives: null, controlDef: null, signalFormsInputPresence: null, inputs: sA(e.inputs, t), outputs: aA(e.outputs), debugInfo: null }; }
function pE(e) { e.features?.forEach(t => t(e)); }
function Es(e, t) { return e ? () => { let n = typeof e == "function" ? e() : e, o = []; for (let r of n) {
    let i = t(r);
    i !== null && o.push(i);
} return o; } : null; }
var cA = new Map;
function lA(e) { let t = 0, n = typeof e.consts == "function" ? "" : e.consts, o = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery]; for (let i of o.join("|"))
    t = Math.imul(31, t) + i.charCodeAt(0) << 0; return t += 2147483648, "c" + t; }
var Ko = "__ngAsyncComponentMetadataFn__", hE = "__ngAsyncMetadataLoaded__";
function uA(e) { let t = e; return t[Ko] === hE ? null : t[Ko] ?? null; }
function gE(e, t, n) { let o = e; return o[Ko] = () => Promise.all(t()).then(r => (n(...r), o[Ko] = hE, r)), o[Ko]; }
function jd(e, t, n, o) { return rt(() => { let r = e; t !== null && (r.hasOwnProperty("decorators") && r.decorators !== void 0 ? r.decorators.push(...t) : r.decorators = t), n !== null && (r.ctorParameters = n), o !== null && (r.hasOwnProperty("propDecorators") && r.propDecorators !== void 0 ? r.propDecorators = G(G({}, r.propDecorators), o) : r.propDecorators = o); }); }
var Vd = new b("");
function mE(e) { return Be([{ provide: Vd, multi: !0, useValue: e }]); }
var Bd = (() => { class e {
    resolve;
    reject;
    initialized = !1;
    done = !1;
    donePromise = new Promise((n, o) => { this.resolve = n, this.reject = o; });
    appInits = I(Vd, { optional: !0 }) ?? [];
    injector = I(me);
    constructor() { }
    runInitializers() { if (this.initialized)
        return; let n = []; for (let r of this.appInits) {
        let i = Ao(this.injector, r);
        if (Pd(i))
            n.push(i);
        else if (iE(i)) {
            let s = new Promise((a, c) => { i.subscribe({ complete: a, error: c }); });
            n.push(s);
        }
    } let o = () => { this.done = !0, this.resolve(); }; Promise.all(n).then(() => { o(); }).catch(r => { this.reject(r); }), n.length === 0 && o(), this.initialized = !0; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = gt({ token: e, factory: e.\u0275fac });
} return e; })(), fn = new Map, Er = new Set;
function vE(e) { return Ae(this, null, function* () { let t = fn; fn = new Map; let n = new Map; function o(i) { let s = n.get(i); if (s)
    return s; let a = e(i).then(c => gA(i, c)); return n.set(i, a), a; } let r = Array.from(t).map(a => Ae(null, [a], function* ([i, s]) { if (s.styleUrl && s.styleUrls?.length)
    throw new Error("@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"); let c = []; s.templateUrl && c.push(o(s.templateUrl).then(f => { s.template = f; })); let l = typeof s.styles == "string" ? [s.styles] : s.styles ?? []; s.styles = l; let { styleUrl: u, styleUrls: d } = s; if (u && (d = [u], s.styleUrl = void 0), d?.length) {
    let f = Promise.all(d.map(p => o(p))).then(p => { l.push(...p), s.styleUrls = void 0; });
    c.push(f);
} yield Promise.all(c), Er.delete(i); })); yield Promise.all(r); }); }
function dA(e, t) { yE(t) && (fn.set(e, t), Er.add(e)); }
function fA(e) { return Er.has(e); }
function yE(e) { return !!(e.templateUrl && !e.hasOwnProperty("template") || e.styleUrls?.length || e.styleUrl); }
function pA() { let e = fn; return fn = new Map, e; }
function hA(e) { Er.clear(); for (let t of e.keys())
    Er.add(t); fn = e; }
function EE() { return fn.size === 0; }
function gA(e, t) { return Ae(this, null, function* () { if (typeof t == "string")
    return t; if (t.status !== void 0 && t.status !== 200)
    throw new S(918, !1); return t.text(); }); }
var nu = new Map, IE = !0;
function mA(e, t, n) { if (t && t !== n && IE)
    throw new S(921, !1); }
function Ud(e, t) { let n = nu.get(t) || null; mA(t, n, e), nu.set(t, e); }
function $d(e) { return nu.get(e); }
function vA(e) { IE = !e; }
function DE(e) { return t => { t.controlDef = { create: (n, o) => { n?.\u0275ngControlCreate(o); }, update: (n, o) => { n?.\u0275ngControlUpdate?.(o); }, passThroughInput: e }; }; }
function TE(e) { let t = n => { let o = Array.isArray(e); n.hostDirectives === null ? (n.resolveHostDirectives = yA, n.hostDirectives = o ? e.map(ou) : [e]) : o ? n.hostDirectives.unshift(...e.map(ou)) : n.hostDirectives.unshift(e); }; return t.ngInherit = !0, t; }
function yA(e) { let t = [], n = !1, o = null, r = null; for (let i = 0; i < e.length; i++) {
    let s = e[i];
    if (s.hostDirectives !== null) {
        let a = t.length;
        o ??= new Map, r ??= new Map, CE(s, t, o, e), r.set(s, [a, t.length - 1]);
    }
    i === 0 && Oe(s) && (n = !0, t.push(s));
} for (let i = n ? 1 : 0; i < e.length; i++)
    t.push(e[i]); return o !== null && o.forEach((i, s) => { EA(s.declaredInputs, i.inputs); }), [t, o, r]; }
function CE(e, t, n, o) { if (e.hostDirectives !== null)
    for (let r of e.hostDirectives)
        if (typeof r == "function") {
            let i = r();
            for (let s of i)
                og(ou(s), t, n, o);
        }
        else
            og(r, t, n, o); }
function og(e, t, n, o) { let r = Re(e.directive); if (CE(r, t, n, o), n.has(r)) {
    let i = n.get(r);
    rg(i, e.inputs, "input"), rg(i, e.outputs, "output");
}
else
    o.includes(r) || (n.set(r, e), t.push(r)); }
function rg(e, t, n) { let o = n === "input" ? e.inputs : e.outputs; Object.keys(t).forEach(r => { let i = t[r]; (!o.hasOwnProperty(r) || o[r] === i) && (o[r] = i); }); }
function ou(e) { return typeof e == "function" ? { directive: z(e), inputs: {}, outputs: {} } : { directive: z(e.directive), inputs: ig(e.inputs), outputs: ig(e.outputs) }; }
function ig(e) { let t = {}; if (e !== void 0 && e.length > 0)
    for (let n = 0; n < e.length; n += 2)
        t[e[n]] = e[n + 1]; return t; }
function EA(e, t) { for (let n in t)
    if (t.hasOwnProperty(n)) {
        let o = t[n], r = e[n];
        e[o] = r;
    } }
function IA(e) { return Object.getPrototypeOf(e.prototype).constructor; }
function Gd(e) { let t = IA(e.type), n = !0, o = [e]; for (; t;) {
    let r;
    if (Oe(e))
        r = t.\u0275cmp || t.\u0275dir;
    else {
        if (t.\u0275cmp)
            throw new S(903, !1);
        r = t.\u0275dir;
    }
    if (r) {
        if (n) {
            o.push(r);
            let s = e;
            s.inputs = nl(e.inputs), s.declaredInputs = nl(e.declaredInputs), s.outputs = nl(e.outputs);
            let a = r.hostBindings;
            a && NA(e, a);
            let c = r.viewQuery, l = r.contentQueries;
            if (c && CA(e, c), l && MA(e, l), DA(e, r), yp(e.outputs, r.outputs), Oe(r) && r.data.animation) {
                let u = e.data;
                u.animation = (u.animation || []).concat(r.data.animation);
            }
        }
        let i = r.features;
        if (i)
            for (let s = 0; s < i.length; s++) {
                let a = i[s];
                a && a.ngInherit && a(e), a === Gd && (n = !1);
            }
    }
    t = Object.getPrototypeOf(t);
} TA(o); }
function DA(e, t) { for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n))
        continue;
    let o = t.inputs[n];
    o !== void 0 && (e.inputs[n] = o, e.declaredInputs[n] = t.declaredInputs[n]);
} }
function TA(e) { let t = 0, n = null; for (let o = e.length - 1; o >= 0; o--) {
    let r = e[o];
    r.hostVars = t += r.hostVars, r.hostAttrs = Wn(r.hostAttrs, n = Wn(n, r.hostAttrs));
} }
function nl(e) { return e === st ? {} : e === j ? [] : e; }
function CA(e, t) { let n = e.viewQuery; n ? e.viewQuery = (o, r) => { t(o, r), n(o, r); } : e.viewQuery = t; }
function MA(e, t) { let n = e.contentQueries; n ? e.contentQueries = (o, r, i) => { t(o, r, i), n(o, r, i); } : e.contentQueries = t; }
function NA(e, t) { let n = e.hostBindings; n ? e.hostBindings = (o, r) => { t(o, r), n(o, r); } : e.hostBindings = t; }
function ME(e, t, n, o, r, i, s, a) { if (n.firstCreatePass) {
    e.mergedAttrs = Wn(e.mergedAttrs, e.attrs);
    let u = e.tView = fd(2, e, r, i, s, n.directiveRegistry, n.pipeRegistry, null, n.schemas, n.consts, null);
    n.queries !== null && (n.queries.template(n, e), u.queries = n.queries.embeddedTView(e));
} a && (e.flags |= a), Xe(e, !1); let c = NE(n, t, e, o); Bo() && ud(n, t, c, e), Le(c, t); let l = ny(c, t, c, e); t[o + E] = l, hd(t, l), Yy(l, e, t); }
function wA(e, t, n, o, r, i, s, a, c, l, u) { let d = n + E, f; return t.firstCreatePass ? (f = In(t, d, 4, s || null, a || null), Di() && Uy(t, e, f, fe(t.consts, l), vd), zg(t, f)) : f = t.data[d], ME(f, e, t, n, o, r, i, c), _n(f) && ea(t, e, f), l != null && uo(e, f, u), f; }
function pn(e, t, n, o, r, i, s, a, c, l, u) { let d = n + E, f; if (t.firstCreatePass) {
    if (f = In(t, d, 4, s || null, a || null), l != null) {
        let p = fe(t.consts, l);
        f.localNames = [];
        for (let h = 0; h < p.length; h += 2)
            f.localNames.push(p[h], -1);
    }
}
else
    f = t.data[d]; return ME(f, e, t, n, o, r, i, c), l != null && uo(e, f, u), f; }
function zd(e, t, n, o, r, i, s, a) { let c = g(), l = w(), u = fe(l.consts, i); return wA(c, l, e, t, n, o, r, u, void 0, s, a), zd; }
function Wd(e, t, n, o, r, i, s, a) { let c = g(), l = w(), u = fe(l.consts, i); return pn(c, l, e, t, n, o, r, u, void 0, s, a), Wd; }
var NE = wE;
function wE(e, t, n, o) { return Ge(!0), t[C].createComment(""); }
function SA(e, t, n, o) { let r = !Vs(t, n); Ge(r); let i = t[ce]?.data[Rs]?.[o] ?? null; if (i !== null && n.tView !== null && n.tView.ssrId === null && (n.tView.ssrId = i), r)
    return wE(e, t); let s = t[ce], a = Gr(s, e, t, n); Hs(s, o, a); let c = Bu(s, o); return ua(c, a); }
function SE() { NE = SA; }
var re = (function (e) { return e[e.NOT_STARTED = 0] = "NOT_STARTED", e[e.IN_PROGRESS = 1] = "IN_PROGRESS", e[e.COMPLETE = 2] = "COMPLETE", e[e.FAILED = 3] = "FAILED", e; })(re || {}), sg = 0, _A = 1, U = (function (e) { return e[e.Placeholder = 0] = "Placeholder", e[e.Loading = 1] = "Loading", e[e.Complete = 2] = "Complete", e[e.Error = 3] = "Error", e; })(U || {}), Ir = (function (e) { return e[e.Initial = -1] = "Initial", e; })(Ir || {}), $n = 0, Et = 1, Qo = 2, ji = 3, bA = 4, AA = 5, va = 6, RA = 7, Gn = 8, kA = 9, qd = (function (e) { return e[e.Manual = 0] = "Manual", e[e.Playthrough = 1] = "Playthrough", e; })(qd || {});
function zr(e, t, n) { let o = bE(e); t[o] === null && (t[o] = []), t[o].push(n); }
function Qi(e, t) { let n = bE(e), o = t[n]; if (o !== null) {
    for (let r of o)
        r();
    t[n] = null;
} }
function _E(e) { Qi(1, e), Qi(0, e), Qi(2, e); }
function bE(e) { let t = bA; return e === 1 ? t = AA : e === 2 && (t = kA), t; }
function Wr(e) { return e + 1; }
function Ie(e, t) { let n = e[m], o = Wr(t.index); return e[o]; }
function xA(e, t, n) { let o = e[m], r = Wr(t); e[r] = n; }
function le(e, t) { let n = Wr(t.index); return e.data[n]; }
function OA(e, t, n) { let o = Wr(t); e.data[o] = n; }
function LA(e, t, n) { let o = t[m], r = le(o, n); switch (e) {
    case U.Complete: return r.primaryTmplIndex;
    case U.Loading: return r.loadingTmplIndex;
    case U.Error: return r.errorTmplIndex;
    case U.Placeholder: return r.placeholderTmplIndex;
    default: return null;
} }
function ru(e, t) { return t === U.Placeholder ? e.placeholderBlockConfig?.[sg] ?? null : t === U.Loading ? e.loadingBlockConfig?.[sg] ?? null : null; }
function AE(e) { return e.loadingBlockConfig?.[_A] ?? null; }
function ag(e, t) { if (!e || e.length === 0)
    return t; let n = new Set(e); for (let o of t)
    n.add(o); return e.length === n.size ? e : Array.from(n); }
function PA(e, t) { let n = t.primaryTmplIndex + E; return Wt(e, n); }
function RE(e) { return e !== null && typeof e == "object" && typeof e.primaryTmplIndex == "number"; }
function kE(e, t) { let n = null, o = Wr(t.index); return E < o && o < e.bindingStartIndex && (n = le(e, t)), !!n && RE(n); }
var FA = (() => { class e {
    cachedInjectors = new Map;
    getOrCreateInjector(n, o, r, i) { if (!this.cachedInjectors.has(n)) {
        let s = r.length > 0 ? Fd(r, o, i) : null;
        this.cachedInjectors.set(n, s);
    } return this.cachedInjectors.get(n); }
    ngOnDestroy() { try {
        for (let n of this.cachedInjectors.values())
            n !== null && n.destroy();
    }
    finally {
        this.cachedInjectors.clear();
    } }
    static \u0275prov = ae({ token: e, providedIn: "environment", factory: () => new e });
} return e; })();
function ya(e) { return (t, n) => xE(e, t, n); }
function xE(e, t, n) { let o = n.get(OE), r = n.get(B), i = () => o.remove(t); return o.add(e, t, r), i; }
var OE = (() => { class e {
    executingCallbacks = !1;
    timeoutId = null;
    invokeTimerAt = null;
    current = [];
    deferred = [];
    add(n, o, r) { let i = this.executingCallbacks ? this.deferred : this.current; this.addToQueue(i, Date.now() + n, o), this.scheduleTimer(r); }
    remove(n) { let { current: o, deferred: r } = this; this.removeFromQueue(o, n) === -1 && this.removeFromQueue(r, n), o.length === 0 && r.length === 0 && this.clearTimeout(); }
    addToQueue(n, o, r) { let i = n.length; for (let s = 0; s < n.length; s += 2)
        if (n[s] > o) {
            i = s;
            break;
        } Mp(n, i, o, r); }
    removeFromQueue(n, o) { let r = -1; for (let i = 0; i < n.length; i += 2)
        if (n[i + 1] === o) {
            r = i;
            break;
        } return r > -1 && rc(n, r, 2), r; }
    scheduleTimer(n) { let o = () => { this.clearTimeout(), this.executingCallbacks = !0; let i = [...this.current], s = Date.now(); for (let c = 0; c < i.length; c += 2) {
        let l = i[c], u = i[c + 1];
        if (l <= s)
            u();
        else
            break;
    } let a = -1; for (let c = 0; c < this.current.length && this.current[c] <= s; c += 2)
        a = c + 1; if (a >= 0 && rc(this.current, 0, a + 1), this.executingCallbacks = !1, this.deferred.length > 0) {
        for (let c = 0; c < this.deferred.length; c += 2) {
            let l = this.deferred[c], u = this.deferred[c + 1];
            this.addToQueue(this.current, l, u);
        }
        this.deferred.length = 0;
    } this.scheduleTimer(n); }; if (this.current.length > 0) {
        let i = Date.now(), s = this.current[0];
        if (this.timeoutId === null || this.invokeTimerAt && this.invokeTimerAt - s > 16) {
            this.clearTimeout();
            let a = Math.max(s - i, 16);
            this.invokeTimerAt = s, this.timeoutId = n.runOutsideAngular(() => setTimeout(() => n.run(o), a));
        }
    } }
    clearTimeout() { this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null); }
    ngOnDestroy() { this.clearTimeout(), this.current.length = 0, this.deferred.length = 0; }
    static \u0275prov = ae({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), HA = new b("DEFER_BLOCK_DEPENDENCY_INTERCEPTOR"), LE = new b("");
function ol(e, t, n) { return e.get(FA).getOrCreateInjector(t, e, n, ""); }
function jA(e, t, n) { if (e instanceof kt) {
    let r = e.injector, i = e.parentInjector, s = ol(i, t, n);
    return new kt(r, s);
} let o = e.get(at); if (o !== e) {
    let r = ol(o, t, n);
    return new kt(e, r);
} return ol(e, t, n); }
function ut(e, t, n, o = !1) { let r = n[Y], i = r[m]; if (Nt(r))
    return; let s = Ie(r, t), a = s[Et], c = s[RA]; if (!(c !== null && e < c) && lg(a, e) && lg(s[$n] ?? -1, e)) {
    let l = le(i, t), d = !o && (typeof ngServerMode > "u" || !ngServerMode) && (AE(l) !== null || ru(l, U.Loading) !== null || ru(l, U.Placeholder)) ? iu : PE;
    try {
        d(e, s, n, t, r);
    }
    catch (f) {
        yd(r, f);
    }
} }
function VA(e, t) { let n = e[Ne]?.findIndex(r => r.data[Or] === t[Et]) ?? -1; return { dehydratedView: n > -1 ? e[Ne][n] : null, dehydratedViewIx: n }; }
function PE(e, t, n, o, r) { O(k.DeferBlockStateStart); let i = LA(e, r, o); if (i !== null) {
    t[Et] = e;
    let s = r[m], a = i + E, c = Wt(s, a), l = 0;
    Ed(n, l);
    let u;
    if (e === U.Complete) {
        let h = le(s, o), v = h.providers;
        v && v.length > 0 && (u = jA(r[R], h, v));
    }
    let { dehydratedView: d, dehydratedViewIx: f } = VA(n, t), p = fo(r, c, null, { injector: u, dehydratedView: d });
    if (po(n, p, l, cn(c, d)), Po(p), f > -1 && n[Ne]?.splice(f, 1), (e === U.Complete || e === U.Error) && Array.isArray(t[Gn])) {
        for (let h of t[Gn])
            h();
        t[Gn] = null;
    }
} O(k.DeferBlockStateEnd); }
function BA(e, t, n, o, r) { let i = Date.now(), s = r[m], a = le(s, o); if (t[Qo] === null || t[Qo] <= i) {
    t[Qo] = null;
    let c = AE(a), l = t[ji] !== null;
    if (e === U.Loading && c !== null && !l) {
        t[$n] = e;
        let u = cg(c, t, o, n, r);
        t[ji] = u;
    }
    else {
        e > U.Loading && l && (t[ji](), t[ji] = null, t[$n] = null), PE(e, t, n, o, r);
        let u = ru(a, e);
        u !== null && (t[Qo] = i + u, cg(u, t, o, n, r));
    }
}
else
    t[$n] = e; }
function cg(e, t, n, o, r) { return xE(e, () => { let s = t[$n]; t[Qo] = null, t[$n] = null, s !== null && ut(s, n, o); }, r[R]); }
function lg(e, t) { return e < t; }
function vo(e, t) { let n = e[t.index]; ut(U.Placeholder, t, n); }
function ug(e, t, n) { e.loadingPromise.then(() => { e.loadingState === re.COMPLETE ? ut(U.Complete, t, n) : e.loadingState === re.FAILED && ut(U.Error, t, n); }); }
var iu = null;
function FE(e, t, n, o) { let r = e.consts; n != null && (t.placeholderBlockConfig = fe(r, n)), o != null && (t.loadingBlockConfig = fe(r, o)), iu === null && (iu = BA); }
function Qd(e, t) { return !(e === 0 && typeof ngServerMode < "u" && ngServerMode || t[R].get(LE, null, { optional: !0 })?.behavior === qd.Manual); }
function Yd(e, t, n, o) { let r = n.get(B); return GN(e, () => r.run(t), i => r.runOutsideAngular(() => $N(i)), o); }
function UA(e, t, n) { return n == null ? e : n >= 0 ? Up(n, e) : e[t.index][H] ?? null; }
function $A(e, t) { return zt(E + t, e); }
function yo(e, t, n, o, r, i, s, a) { if (!Qd(s, e))
    return; let c = e[R], l = c.get(B), u; function d() { if (Nt(e)) {
    u.destroy();
    return;
} let f = Ie(e, t), p = f[Et]; if (p !== Ir.Initial && p !== U.Placeholder) {
    u.destroy();
    return;
} let h = UA(e, t, o); if (!h || (u.destroy(), Nt(h)))
    return; let v = $A(h, n), y = r(v, () => { l.run(() => { e !== h && fc(h, y), i(); }); }, c, a); e !== h && Ho(h, y), zr(s, f, y); } u = wv({ read: d }, { injector: c }); }
var GA = (() => { class e {
    log(n) { console.log(n); }
    warn(n) { console.warn(n); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = ae({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })(), su = class {
    resolverToTokenToDependencies = new WeakMap;
    resolverToProviders = new WeakMap;
    resolverToEffects = new WeakMap;
    standaloneInjectorToComponent = new WeakMap;
    reset() { this.resolverToTokenToDependencies = new WeakMap, this.resolverToProviders = new WeakMap, this.standaloneInjectorToComponent = new WeakMap; }
}, zA = new su;
function Ea() { return zA; }
var HE = (function (e) { return e[e.Defer = 0] = "Defer", e[e.For = 1] = "For", e; })(HE || {});
function WA(e) { let { standaloneInjectorToComponent: t } = Ea(); if (t.has(e))
    return t.get(e); let n = e.get(dn, null, { self: !0, optional: !0 }); return n === null || n.instance === null ? null : n.instance.constructor; }
function qA(e) { let t = Sr(e), { resolverToProviders: n } = Ea(), o = n.get(t) ?? [], r = Array.from(th()).map(i => ({ token: i, isViewProvider: !1, provider: i })); return [...o, ...r]; }
function QA(e) { let t = new Map, o = YA(t, new Set); return Sp(e, o, [], new Set), t; }
function YA(e, t) { return (n, o) => { if (e.has(n) || e.set(n, [o]), !t.has(o))
    for (let r of e.keys()) {
        let i = e.get(r), s = Ja(o);
        if (!s) {
            let l = o.ngModule;
            s = Ja(l);
        }
        if (!s)
            return;
        let a = i[0], c = !1;
        Cp(s.imports, l => { c || (c = l.ngModule === a || l === a, c && e.get(r)?.unshift(o)); });
    } t.add(o); }; }
function ZA(e) { let t = Ea().resolverToProviders.get(e) ?? []; if (KA(e))
    return t; let n = WA(e); if (n === null)
    return t; let o = QA(n), r = []; for (let i of t) {
    let s = i.provider, a = s.provide;
    if (a === Tt || a === Np)
        continue;
    let c = o.get(s) ?? [];
    W(n)?.standalone && (c = [n, ...c]), r.push(be(G({}, i), { importPath: c }));
} return r; }
function KA(e) { return e instanceof Bt && e.scopes.has("platform"); }
function jE(e) { if (e instanceof ye)
    return qA(e); if (e instanceof at)
    return ZA(e); Ka("getInjectorProviders only supports NodeInjector and EnvironmentInjector"); }
function VE(e) { if (e instanceof ye) {
    let t = Tu(e), n = Sr(e);
    return xp(n, t), { type: "element", source: te(n, t) };
} return e instanceof Bt ? { type: "environment", source: e.source ?? null } : e instanceof bo ? { type: "null", source: null } : null; }
function JA(e) { return e.kind === "computed"; }
function XA(e) { return e.kind === "template"; }
function eR(e) { return e.kind === "signal"; }
function tR(e) { let t = Sr(e); Op(t); let n = Tu(e); Lp(n); let o = n[t.index]; return ee(o) ? o[Me] ?? null : null; }
var dg = new WeakMap, fg = 0;
function nR(e) { let t = Array.from(e.keys()), n = [], o = []; for (let [r, i] of e.entries()) {
    let s = t.indexOf(r), a = dg.get(r);
    a || (fg++, a = fg.toString(), dg.set(r, a)), JA(r) ? n.push({ label: r.debugName, value: r.value, kind: r.kind, epoch: r.version, debuggableFn: r.computation, id: a }) : eR(r) ? n.push({ label: r.debugName, value: r.value, kind: r.kind, epoch: r.version, id: a }) : XA(r) ? n.push({ label: r.debugName ?? r.lView?.[V]?.tagName?.toLowerCase?.(), kind: r.kind, epoch: r.version, debuggableFn: r.lView?.[P]?.constructor, id: a }) : n.push({ label: r.debugName, kind: r.kind, epoch: r.version, id: a });
    for (let c of i)
        o.push({ consumer: s, producer: t.indexOf(c) });
} return { nodes: n, edges: o }; }
function oR(e) { let t = e; return e instanceof ye && (t = Tu(e)), (Ea().resolverToEffects.get(t) ?? []).map(r => r instanceof lh ? r[qe] : r.signal[qe]); }
function BE(e, t = new Map) { for (let n of e) {
    if (t.has(n))
        continue;
    let o = [];
    for (let r = n.producers; r !== void 0; r = r.nextProducer) {
        let i = r.producer;
        o.push(i);
    }
    t.set(n, o), BE(o, t);
} return t; }
function UE(e) { let t = null; if (!(e instanceof ye) && !(e instanceof Bt))
    return Ka("getSignalGraph must be called with a NodeInjector or R3Injector"); e instanceof ye && (t = tR(e)); let n = oR(e), o = t ? [t, ...n] : n, r = BE(o); return nR(r); }
function rR() { return K("Chrome DevTools profiling"), () => { }; }
function iR(e) { let t = e.get(Rn), n = e.get(ct), o = ch(t, n), r = {}; for (let [i, s] of Object.entries(o))
    YN(i) || (r[i] = s); return r; }
var pg = "ng";
function sR(e, t) { aR(e, t); }
function aR(e, t) { if (typeof COMPILED > "u" || !COMPILED) {
    let n = Te;
    n[pg] ??= {}, n[pg][e] = t;
} }
var $E = new b(""), GE = new b(""), zE = new b("USE_PENDING_TASKS", { providedIn: "root", factory: () => typeof Zone > "u" }), cR = (() => { class e {
    _ngZone;
    registry;
    _isZoneStable = !0;
    _callbacks = [];
    _taskTrackingZone = null;
    _destroyRef;
    pendingTasksInternal = I(St);
    _usePendingTasks = I(zE);
    constructor(n, o, r) { this._ngZone = n, this.registry = o, Rp() && (this._destroyRef = I(qt, { optional: !0 }) ?? void 0), Zd || (qE(r), r.addToWindow(o)), this._watchAngularEvents(), n.run(() => { this._taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone"); }); }
    _watchAngularEvents() { let n = this._ngZone.onUnstable.subscribe({ next: () => { this._isZoneStable = !1; } }), o, r; this._ngZone.runOutsideAngular(() => { this._usePendingTasks && (o = this.pendingTasksInternal.hasPendingTasksObservable.subscribe(() => { this.isStable() && this._ngZone.runOutsideAngular(() => { this._runCallbacksIfReady(); }); })), r = this._ngZone.onStable.subscribe({ next: () => { B.assertNotInAngularZone(), queueMicrotask(() => { this._isZoneStable = !0, this._runCallbacksIfReady(); }); } }); }), this._destroyRef?.onDestroy(() => { n.unsubscribe(), o?.unsubscribe(), r.unsubscribe(); }); }
    isStable() { return this._isZoneStable && !this._ngZone.hasPendingMacrotasks && (!this._usePendingTasks || !this.pendingTasksInternal.hasPendingTasks); }
    _runCallbacksIfReady() { if (this.isStable())
        queueMicrotask(() => { for (; this._callbacks.length !== 0;) {
            let n = this._callbacks.pop();
            clearTimeout(n.timeoutId), n.doneCb();
        } });
    else {
        let n = this.getPendingTasks();
        this._callbacks = this._callbacks.filter(o => o.updateCb && o.updateCb(n) ? (clearTimeout(o.timeoutId), !1) : !0);
    } }
    getPendingTasks() { return this._taskTrackingZone ? this._taskTrackingZone.macroTasks.map(n => ({ source: n.source, creationLocation: n.creationLocation, data: n.data })) : []; }
    addCallback(n, o, r) { let i = -1; o && o > 0 && (i = setTimeout(() => { this._callbacks = this._callbacks.filter(s => s.timeoutId !== i), n(); }, o)), this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: r }); }
    whenStable(n, o, r) { if (r && !this._taskTrackingZone)
        throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'); this.addCallback(n, o, r), this._runCallbacksIfReady(); }
    registerApplication(n) { this.registry.registerApplication(n, this); }
    unregisterApplication(n) { this.registry.unregisterApplication(n); }
    findProviders(n, o, r) { return []; }
    static \u0275fac = function (o) { return new (o || e)(je(B), je(WE), je(GE)); };
    static \u0275prov = ae({ token: e, factory: e.\u0275fac });
} return e; })(), WE = (() => { class e {
    _applications = new Map;
    registerApplication(n, o) { this._applications.set(n, o); }
    unregisterApplication(n) { this._applications.delete(n); }
    unregisterAllApplications() { this._applications.clear(); }
    getTestability(n) { return this._applications.get(n) || null; }
    getAllTestabilities() { return Array.from(this._applications.values()); }
    getAllRootElements() { return Array.from(this._applications.keys()); }
    findTestabilityInTree(n, o = !0) { return Zd?.findTestabilityInTree(this, n, o) ?? null; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = ae({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })();
function qE(e) { Zd = e; }
var Zd, qr = new b("");
function Kd() { gp(() => { let e = ""; throw new S(600, e); }); }
var lR = 10;
function Jd(e, t) { return Array.isArray(t) ? t.reduce(Jd, e) : G(G({}, e), t); }
var Se = (() => { class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = I(Qt);
    afterRenderManager = I(qs);
    zonelessEnabled = I(kn);
    rootEffectScheduler = I(jc);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set;
    autoDetectTestViews = new Set;
    includeAllTestViews = !1;
    afterTick = new Vg;
    get allViews() { return [...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(), ...this._views]; }
    get destroyed() { return this._destroyed; }
    componentTypes = [];
    components = [];
    internalPendingTask = I(St);
    get isStable() { return this.internalPendingTask.hasPendingTasksObservable.pipe(RM(n => !n)); }
    constructor() { I(En, { optional: !0 }); }
    whenStable() { let n; return new Promise(o => { n = this.isStable.subscribe({ next: r => { r && o(); } }); }).finally(() => { n.unsubscribe(); }); }
    _injector = I(at);
    _rendererFactory = null;
    get injector() { return this._injector; }
    bootstrap(n, o) { return this.bootstrapImpl(n, o); }
    bootstrapImpl(n, o, r = me.NULL) { return this._injector.get(B).run(() => { if (O(k.BootstrapComponentStart), !this._injector.get(Bd).done) {
        let D = "";
        throw new S(405, D);
    } let a = W(n), c = this._injector.get(dn), l = new un(a, c); this.componentTypes.push(n); let { hostElement: u, directives: d, bindings: f } = uR(o), p = u || l.selector, h = l.create(r, [], p, c.injector, d, f), v = h.location.nativeElement, y = h.injector.get($E, null); return y?.registerApplication(v), h.onDestroy(() => { this.detachView(h.hostView), Jo(this.components, h), y?.unregisterApplication(v); }), this._loadComponent(h), O(k.BootstrapComponentEnd, h), h; }); }
    tick() { this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick(); }
    _tick() { O(k.ChangeDetectionStart), this.tracingSnapshot !== null ? this.tracingSnapshot.run(Ws.CHANGE_DETECTION, this.tickImpl) : this.tickImpl(); }
    tickImpl = () => { if (this._runningTick)
        throw O(k.ChangeDetectionEnd), new S(101, !1); let n = L(null); try {
        this._runningTick = !0, this.synchronize();
    }
    finally {
        this._runningTick = !1, this.tracingSnapshot?.dispose(), this.tracingSnapshot = null, L(n), this.afterTick.next(), O(k.ChangeDetectionEnd);
    } };
    synchronize() { this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(mr, null, { optional: !0 })); let n = 0; for (; this.dirtyFlags !== 0 && n++ < lR;) {
        O(k.ChangeDetectionSyncStart);
        try {
            this.synchronizeOnce();
        }
        finally {
            O(k.ChangeDetectionSyncEnd);
        }
    } }
    synchronizeOnce() { this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush()); let n = !1; if (this.dirtyFlags & 7) {
        let o = !!(this.dirtyFlags & 1);
        this.dirtyFlags &= -8, this.dirtyFlags |= 8;
        for (let { _lView: r } of this.allViews) {
            if (!o && !Fo(r))
                continue;
            let i = o && !this.zonelessEnabled ? 0 : 1;
            Kv(r, i), n = !0;
        }
        if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)
            return;
    } n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()), this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews(); }
    syncDirtyFlagsWithViews() { if (this.allViews.some(({ _lView: n }) => Fo(n))) {
        this.dirtyFlags |= 2;
        return;
    }
    else
        this.dirtyFlags &= -8; }
    attachView(n) { let o = n; this._views.push(o), o.attachToAppRef(this); }
    detachView(n) { let o = n; Jo(this._views, o), o.detachFromAppRef(); }
    _loadComponent(n) { this.attachView(n.hostView); try {
        this.tick();
    }
    catch (r) {
        this.internalErrorHandler(r);
    } this.components.push(n), this._injector.get(qr, []).forEach(r => r(n)); }
    ngOnDestroy() { if (!this._destroyed)
        try {
            this._destroyListeners.forEach(n => n()), this._views.slice().forEach(n => n.destroy());
        }
        finally {
            this._destroyed = !0, this._views = [], this._destroyListeners = [];
        } }
    onDestroy(n) { return this._destroyListeners.push(n), () => Jo(this._destroyListeners, n); }
    destroy() { if (this._destroyed)
        throw new S(406, !1); let n = this._injector; n.destroy && !n.destroyed && n.destroy(); }
    get viewCount() { return this._views.length; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = gt({ token: e, factory: e.\u0275fac });
} return e; })();
function uR(e) { return e === void 0 || typeof e == "string" || e instanceof Element ? { hostElement: e } : e; }
function Jo(e, t) { let n = e.indexOf(t); n > -1 && e.splice(n, 1); }
function QE(e, t, n) { let o = t.get(dR), r = () => o.remove(e); return o.add(e, n), r; }
function Xd(e) { return (t, n) => QE(t, n, e); }
var dR = (() => { class e {
    buckets = new Map;
    callbackBucket = new Map;
    applicationRef = I(Se);
    ngZone = I(B);
    idleService = I(_s);
    add(n, o) { let r = hg(o); this.callbackBucket.set(n, r); let i = this.buckets.get(r); i == null && (i = { idleId: null, queue: new Set }, this.buckets.set(r, i)), i.queue.add(n), this.scheduleBucket(i, o); }
    remove(n) { let o = this.callbackBucket.get(n); if (o === void 0)
        return; this.callbackBucket.delete(n); let r = this.buckets.get(o); r && (r.queue.delete(n), r.queue.size === 0 && (this.cancelBucket(r), this.buckets.delete(o))); }
    scheduleBucket(n, o) { if (n.idleId !== null)
        return; let r = hg(o), i = s => { this.cancelBucket(n); for (let a of n.queue)
        if (a(), this.applicationRef._tick(), n.queue.delete(a), this.callbackBucket.delete(a), s && s.timeRemaining() === 0 && !s.didTimeout)
            break; n.queue.size > 0 ? this.scheduleBucket(n, o) : this.buckets.delete(r); }; n.idleId = this.idleService.requestOnIdle(s => this.ngZone.run(() => i(s)), o); }
    cancelBucket(n) { n.idleId !== null && (this.idleService.cancelOnIdle(n.idleId), n.idleId = null); }
    ngOnDestroy() { for (let n of this.buckets.values())
        this.cancelBucket(n); this.buckets.clear(), this.callbackBucket.clear(); }
    static \u0275prov = ae({ token: e, providedIn: "root", factory: () => new e });
} return e; })();
function hg(e) { return !e || e.timeout == null ? "" : `${e.timeout}`; }
function YE(e) { let t = g(), n = M(); if (vo(t, n), !Qd(0, t))
    return; let o = t[R], r = Ie(t, n), i = e(() => De(0, t, n), o); zr(0, r, i); }
function ZE(e) { if (typeof ngServerMode < "u" && ngServerMode)
    return; let t = g(), n = t[R], o = M(), r = t[m], i = le(r, o); if (i.loadingState === re.NOT_STARTED) {
    let s = Ie(t, o), c = e(() => Qr(i, t, o), n);
    zr(1, s, c);
} }
function KE(e, t, n) { if (typeof ngServerMode < "u" && ngServerMode)
    return; let o = t[R], r = Ie(t, n), i = r[va], s = e(() => It(o, i), o); zr(2, r, s); }
function Qr(e, t, n) { Ia(e, t, n); }
function Ia(e, t, n) { let o = t[R], r = t[m]; if (e.loadingState !== re.NOT_STARTED)
    return e.loadingPromise ?? Promise.resolve(); let i = Ie(t, n), s = PA(r, e); e.loadingState = re.IN_PROGRESS, Qi(1, i); let a = e.dependencyResolverFn, c = o.get(Bc).add(); return a ? (e.loadingPromise = Promise.allSettled(a()).then(l => { let u = !1, d = null, f = [], p = []; for (let h = 0; h < l.length; h++) {
    let v = l[h];
    if (v.status === "fulfilled") {
        let y = v.value, D = W(y) || Re(y);
        if (D)
            f.push(D);
        else {
            let _ = Ye(y);
            _ && p.push(_);
        }
    }
    else {
        u = !0, d = v.reason instanceof Error ? v.reason : new Error(String(v.reason));
        break;
    }
} if (u) {
    if (e.loadingState = re.FAILED, e.errorTmplIndex === null) {
        let v = "", y = new S(-750, v);
        yd(t, y);
    }
}
else {
    e.loadingState = re.COMPLETE;
    let h = s.tView;
    if (f.length > 0) {
        h.directiveRegistry = ag(h.directiveRegistry, f);
        let v = f.map(D => D.type), y = sc(!1, ...v);
        e.providers = y;
    }
    p.length > 0 && (h.pipeRegistry = ag(h.pipeRegistry, p));
} }), e.loadingPromise.finally(() => { e.loadingPromise = null, c(); })) : (e.loadingPromise = Promise.resolve().then(() => { e.loadingPromise = null, e.loadingState = re.COMPLETE, c(); }), e.loadingPromise); }
function De(e, t, n) { let o = t[m], r = t[n.index]; if (!Qd(e, t))
    return; let i = Ie(t, n), s = le(o, n); switch (_E(i), s.loadingState) {
    case re.NOT_STARTED:
        ut(U.Loading, n, r), Ia(s, t, n), s.loadingState === re.IN_PROGRESS && ug(s, n, r);
        break;
    case re.IN_PROGRESS:
        ut(U.Loading, n, r), ug(s, n, r);
        break;
    case re.COMPLETE:
        ut(U.Complete, n, r);
        break;
    case re.FAILED:
        ut(U.Error, n, r);
        break;
    default:
} }
function It(e, t, n) { return Ae(this, null, function* () { let o = e.get(mt); if (o.hydrating.has(t))
    return; let { parentBlockPromise: i, hydrationQueue: s } = rw(t, e); if (s.length === 0)
    return; i !== null && s.shift(), hR(o, s), i !== null && (yield i); let a = s[0]; o.has(a) ? yield gg(e, s, n) : o.awaitParentBlock(a, () => Ae(null, null, function* () { return yield gg(e, s, n); })); }); }
function gg(e, t, n) { return Ae(this, null, function* () { let o = e.get(mt), r = o.hydrating, i = e.get(St), s = i.add(); for (let c = 0; c < t.length; c++) {
    let l = t[c], u = o.get(l);
    if (u != null) {
        if (yield mR(u), yield gR(e), fR(u)) {
            sb(u), mg(t.slice(c), o);
            break;
        }
        r.get(l).resolve();
    }
    else {
        pR(c, t, o), mg(t.slice(c), o);
        break;
    }
} let a = t[t.length - 1]; yield r.get(a)?.promise, i.remove(s), n && n(t), ab(o.get(a), t, o, e.get(Se)); }); }
function fR(e) { return Ie(e.lView, e.tNode)[Et] === U.Error; }
function pR(e, t, n) { let o = e - 1, r = o > -1 ? n.get(t[o]) : null; r && pa(r.lContainer); }
function mg(e, t) { let n = t.hydrating; for (let o in e)
    n.get(o)?.reject(); t.cleanup(e); }
function hR(e, t) { for (let n of t)
    e.hydrating.set(n, An()); }
function gR(e) { return new Promise(t => sd(t, { injector: e })); }
function mR(e) { return Ae(this, null, function* () { let { tNode: t, lView: n } = e, o = Ie(n, t); return new Promise(r => { vR(o, r), De(2, n, t); }); }); }
function vR(e, t) { Array.isArray(e[Gn]) || (e[Gn] = []), e[Gn].push(t); }
function J(e, t, n) { return e === 0 ? vg(t, n) : e === 2 ? !vg(t, n) : !(typeof ngServerMode < "u" && ngServerMode); }
function yR(e) { return e != null && (e & 1) === 1; }
function vg(e, t) { let n = e[R], o = le(e[m], t), r = Fr(n), i = yR(o.flags); if (typeof ngServerMode < "u" && ngServerMode)
    return !r || !i; let a = Ie(e, t)[va] !== null; return !(i && a && r); }
function Pt(e, t) { let n = le(e, t); return n.hydrateTriggers ??= new Map; }
function ER(e, t, n) { let o = [], r = [], i = [], s = []; for (let [a, c] of t) {
    let l = n.get(a);
    if (l !== void 0) {
        let u = c.data[ft], d = l;
        for (let f = 0; f < u; f++) {
            if (d = d.previousSibling, d.nodeType !== Node.ELEMENT_NODE)
                continue;
            let p = { el: d, blockName: a };
            c.hydrate.idle && o.push(p), c.hydrate.immediate && s.push(p), c.hydrate.timer !== null && (p.delay = c.hydrate.timer, r.push(p)), c.hydrate.viewport && (typeof c.hydrate.viewport != "boolean" && (p.intersectionObserverOptions = c.hydrate.viewport), i.push(p));
        }
    }
} IR(e, o), CR(e, s), DR(e, i), TR(e, r); }
function IR(e, t) { for (let n of t) {
    let o = e.get(mt), i = QE(() => It(e, n.blockName), e);
    o.addCleanupFn(n.blockName, i);
} }
function DR(e, t) { if (t.length > 0) {
    let n = e.get(mt);
    for (let o of t) {
        let r = Yd(o.el, () => It(e, o.blockName), e, o.intersectionObserverOptions);
        n.addCleanupFn(o.blockName, r);
    }
} }
function TR(e, t) { for (let n of t) {
    let o = e.get(mt), r = () => It(e, n.blockName), s = ya(n.delay)(r, e);
    o.addCleanupFn(n.blockName, s);
} }
function CR(e, t) { for (let n of t)
    It(e, n.blockName); }
function JE(e, t, n, o, r, i, s, a, c, l) { let u = g(), d = w(), f = e + E, p = pn(u, d, e, null, 0, 0), h = u[R], v = Fr(h); if (d.firstCreatePass) {
    K("NgDefer");
    let it = { primaryTmplIndex: t, loadingTmplIndex: o ?? null, placeholderTmplIndex: r ?? null, errorTmplIndex: i ?? null, placeholderBlockConfig: null, loadingBlockConfig: null, dependencyResolverFn: n ?? null, loadingState: re.NOT_STARTED, loadingPromise: null, providers: null, hydrateTriggers: null, debug: null, flags: l ?? 0 };
    c?.(d, it, a, s), OA(d, f, it);
} let y = u[f]; Yy(y, p, u); let D = null, _ = null; if (y[Ne]?.length > 0) {
    let it = y[Ne][0].data;
    _ = it[Os] ?? null, D = it[Or];
} let ne = [null, Ir.Initial, null, null, null, null, _, D, null, null]; xA(u, f, ne); let He = null; _ !== null && v && (He = h.get(mt), He.add(_, { lView: u, tNode: p, lContainer: y })); let _e = () => { _E(ne), _ !== null && He?.cleanup([_]); }; zr(0, ne, () => fc(u, _e)), Ho(u, _e); }
function XE(e) { let t = g(), n = we(); if (!J(0, t, n))
    return; let o = ge(); if ($(t, o, e)) {
    let r = L(null);
    try {
        let i = !!e, a = Ie(t, n)[Et];
        i === !1 && a === Ir.Initial ? vo(t, n) : i === !0 && (a === Ir.Initial || a === U.Placeholder) && De(0, t, n);
    }
    finally {
        L(r);
    }
} }
function eI(e) { let t = g(), n = we(); if (!J(1, t, n))
    return; let o = ge(); if ($(t, o, e)) {
    let r = L(null);
    try {
        let i = !!e, s = t[m], a = le(s, n);
        i === !0 && a.loadingState === re.NOT_STARTED && Qr(a, t, n);
    }
    finally {
        L(r);
    }
} }
function tI(e) { let t = g(), n = we(); if (!J(2, t, n))
    return; let o = ge(), r = w(); if (Pt(r, n).set(6, null), $(t, o, e))
    if (typeof ngServerMode < "u" && ngServerMode)
        De(2, t, n);
    else {
        let s = t[R], a = L(null);
        try {
            if (!!e === !0) {
                let u = Ie(t, n)[va];
                It(s, u);
            }
        }
        finally {
            L(a);
        }
    } }
function nI() { let e = g(), t = M(); if (!J(2, e, t))
    return; Pt(w(), t).set(7, null), typeof ngServerMode < "u" && ngServerMode && De(2, e, t); }
function oI(e) { let t = g(), n = M(); J(0, t, n) && YE(Xd({ timeout: e })); }
function rI(e) { let t = g(), n = M(); J(1, t, n) && ZE(Xd({ timeout: e })); }
function iI(e) { let t = g(), n = M(); if (!J(2, t, n))
    return; Pt(w(), n).set(0, null), typeof ngServerMode < "u" && ngServerMode ? De(2, t, n) : KE(Xd({ timeout: e }), t, n); }
function sI() { let e = g(), t = M(); if (!J(0, e, t))
    return; le(e[m], t).loadingTmplIndex === null && vo(e, t), De(0, e, t); }
function aI() { let e = g(), t = M(); if (!J(1, e, t))
    return; let n = e[m], o = le(n, t); o.loadingState === re.NOT_STARTED && Ia(o, e, t); }
function cI() { let e = g(), t = M(); if (!J(2, e, t))
    return; if (Pt(w(), t).set(1, null), typeof ngServerMode < "u" && ngServerMode)
    De(2, e, t);
else {
    let o = e[R], i = Ie(e, t)[va];
    It(o, i);
} }
function lI(e) { let t = g(), n = M(); J(0, t, n) && YE(ya(e)); }
function uI(e) { let t = g(), n = M(); J(1, t, n) && ZE(ya(e)); }
function dI(e) { let t = g(), n = M(); if (!J(2, t, n))
    return; Pt(w(), n).set(5, { type: 5, delay: e }), typeof ngServerMode < "u" && ngServerMode ? De(2, t, n) : KE(ya(e), t, n); }
function fI(e, t) { let n = g(), o = M(); J(0, n, o) && (vo(n, o), typeof ngServerMode < "u" && ngServerMode || yo(n, o, e, t, Am, () => De(0, n, o), 0)); }
function pI(e, t) { let n = g(), o = M(); if (!J(1, n, o))
    return; let r = n[m], i = le(r, o); i.loadingState === re.NOT_STARTED && yo(n, o, e, t, Am, () => Qr(i, n, o), 1); }
function hI() { let e = g(), t = M(); if (!J(2, e, t))
    return; Pt(w(), t).set(4, null), typeof ngServerMode < "u" && ngServerMode && De(2, e, t); }
function gI(e, t) { let n = g(), o = M(); J(0, n, o) && (vo(n, o), typeof ngServerMode < "u" && ngServerMode || yo(n, o, e, t, bm, () => De(0, n, o), 0)); }
function mI(e, t) { let n = g(), o = M(); if (!J(1, n, o))
    return; let r = n[m], i = le(r, o); i.loadingState === re.NOT_STARTED && yo(n, o, e, t, bm, () => Qr(i, n, o), 1); }
function vI() { let e = g(), t = M(); if (!J(2, e, t))
    return; Pt(w(), t).set(3, null), typeof ngServerMode < "u" && ngServerMode && De(2, e, t); }
function yI(e, t, n) { let o = g(), r = M(); J(0, o, r) && (vo(o, r), typeof ngServerMode < "u" && ngServerMode || yo(o, r, e, t, Yd, () => De(0, o, r), 0, n)); }
function EI(e, t, n) { let o = g(), r = M(); if (!J(1, o, r))
    return; let i = o[m], s = le(i, r); s.loadingState === re.NOT_STARTED && yo(o, r, e, t, Yd, () => Qr(s, o, r), 1, n); }
function II(e) { let t = g(), n = M(); if (!J(2, t, n))
    return; Pt(w(), n).set(2, e ? { type: 2, intersectionObserverOptions: e } : null), typeof ngServerMode < "u" && ngServerMode && De(2, t, n); }
function ef(e, t) { let n = g(), o = ge(); if ($(n, o, t)) {
    let r = w(), i = we();
    if (ra(i, r, n, e, t))
        ve(i) && Gv(n, i.index);
    else {
        let a = te(i, n);
        ta(n[C], a, null, i.value, e, t, null);
    }
} return ef; }
function tf(e, t, n, o) { let r = g(), i = ge(); if ($(r, i, t)) {
    let s = w(), a = we();
    KS(a, r, e, t, n, o);
} return tf; }
function Xo(e) { if (K("NgAnimateEnter"), typeof ngServerMode < "u" && ngServerMode || !yn)
    return Xo; let t = g(); if (Gs(t))
    return Xo; let n = M(), o = t[R].get(B); return zs(us(t), n, () => MR(t, n, e, o)), Ys(t[R]), ad(t[R], us(t)), Xo; }
function MR(e, t, n, o) { let r = te(t, e), i = e[C], s = Tv(n), a = [], c = !1, l = d => { if (ur(d) !== r)
    return; let f = d instanceof AnimationEvent ? "animationend" : "transitionend"; o.runOutsideAngular(() => { i.listen(r, f, u); }); }, u = d => { ur(d) === r && (od(d, r) && (c = !0), NR(d, r, i)); }; if (s && s.length > 0) {
    o.runOutsideAngular(() => { a.push(i.listen(r, "animationstart", l)), a.push(i.listen(r, "transitionstart", l)); }), yS(r, s, a);
    for (let d of s)
        i.addClass(r, d);
    o.runOutsideAngular(() => { requestAnimationFrame(() => { if (!c && (Nv(r, nn, yn), !nn.has(r))) {
        for (let d of s)
            i.removeClass(r, d);
        td(r);
    } }); });
} }
function NR(e, t, n) { let o = qn.get(t); if (!(ur(e) !== t || !o) && od(e, t)) {
    e.stopPropagation();
    for (let r of o.classList)
        n.removeClass(t, r);
    td(t);
} }
function er(e) { if (K("NgAnimateEnter"), typeof ngServerMode < "u" && ngServerMode || !yn)
    return er; let t = g(); if (Gs(t))
    return er; let n = M(); return zs(us(t), n, () => wR(t, n, e)), Ys(t[R]), ad(t[R], us(t)), er; }
function wR(e, t, n) { let o = te(t, e); n.call(e[P], { target: o, animationComplete: ES }); }
function tr(e) { if (K("NgAnimateLeave"), typeof ngServerMode < "u" && ngServerMode || !yn)
    return tr; let t = g(); if (Gs(t))
    return tr; let o = M(), r = t[R].get(B); return zs(sn(t), o, () => SR(t, o, e, r)), Ys(t[R]), tr; }
function SR(e, t, n, o) { let { promise: r, resolve: i } = An(), s = te(t, e), a = e[C]; Ot.add(e[Ce]), (sn(e).get(t.index).resolvers ??= []).push(i); let c = Tv(n); return c && c.length > 0 ? _R(s, t, e, c, a, o) : i(), { promise: r, resolve: i }; }
function _R(e, t, n, o, r, i) { DS(e, r); let s = [], a = sn(n).get(t.index)?.resolvers, c, l = !1, u = d => { if (!(ur(d) !== e && d.type !== "animation-fallback") && (d.type === "animation-fallback" || od(d, e))) {
    if (l = !0, c && clearTimeout(c), d.type !== "animation-fallback" && d.stopPropagation(), nn.delete(e), jl(t, e), Array.isArray(t.projection))
        for (let p of o)
            r.removeClass(e, p);
    Vl(a, s), Bl(n, t);
} }; i.runOutsideAngular(() => { s.push(r.listen(e, "animationend", u)), s.push(r.listen(e, "transitionend", u)); }), nd(t, e); for (let d of o)
    r.addClass(e, d); i.runOutsideAngular(() => { requestAnimationFrame(() => { if (l)
    return; Nv(e, nn, yn); let d = nn.get(e); d ? (c = setTimeout(() => { u(new CustomEvent("animation-fallback")); }, d.duration + 50), s.push(() => clearTimeout(c))) : (jl(t, e), Vl(a, s), Bl(n, t)); }); }); }
function Is(e) { if (K("NgAnimateLeave"), typeof ngServerMode < "u" && ngServerMode || !yn)
    return Is; let t = g(), n = M(); Ot.add(t[Ce]); let o = t[R].get(B), r = t[R].get(Iv); return zs(sn(t), n, () => bR(t, n, e, o, r)), Ys(t[R]), Is; }
function bR(e, t, n, o, r) { let { promise: i, resolve: s } = An(), a = te(t, e), c = [], l = e[C], u = Gs(e); (sn(e).get(t.index).resolvers ??= []).push(s); let d = sn(e).get(t.index)?.resolvers; if (u)
    Fi(e, t, a, d, c);
else {
    let f = setTimeout(() => Fi(e, t, a, d, c), r), p = { target: a, animationComplete: () => { Fi(e, t, a, d, c), clearTimeout(f); } };
    nd(t, a), o.runOutsideAngular(() => { c.push(l.listen(a, "animationend", () => { Fi(e, t, a, d, c), clearTimeout(f); }, { once: !0 })); }), n.call(e[P], p);
} return { promise: i, resolve: s }; }
function DI() { return g()[X][P]; }
var au = class {
    destroy(t) { }
    updateValue(t, n) { }
    swap(t, n) { let o = Math.min(t, n), r = Math.max(t, n), i = this.detach(r); if (r - o > 1) {
        let s = this.detach(o);
        this.attach(o, i), this.attach(r, s);
    }
    else
        this.attach(o, i); }
    move(t, n) { this.attach(n, this.detach(t)); }
};
function rl(e, t, n, o, r) { return e === n && Object.is(t, o) ? 1 : Object.is(r(e, t), r(n, o)) ? -1 : 0; }
function AR(e, t, n, o) { let r, i, s = 0, a = e.length - 1, c = void 0; if (Array.isArray(t)) {
    Ln(o);
    let l = t.length - 1;
    for (Ln(null); s <= a && s <= l;) {
        let u = e.at(s), d = t[s], f = rl(s, u, s, d, n);
        if (f !== 0) {
            f < 0 && e.updateValue(s, d), s++;
            continue;
        }
        let p = e.at(a), h = t[l], v = rl(a, p, l, h, n);
        if (v !== 0) {
            v < 0 && e.updateValue(a, h), a--, l--;
            continue;
        }
        let y = n(s, u), D = n(a, p), _ = n(s, d);
        if (Object.is(_, D)) {
            let ne = n(l, h);
            Object.is(ne, y) ? (e.swap(s, a), e.updateValue(a, h), l--, a--) : e.move(a, s), e.updateValue(s, d), s++;
            continue;
        }
        if (r ??= new Ds, i ??= Eg(e, s, a, n), cu(e, r, s, _))
            e.updateValue(s, d), s++, a++;
        else if (i.has(_))
            r.set(y, e.detach(s)), a--;
        else {
            let ne = e.create(s, t[s]);
            e.attach(s, ne), s++, a++;
        }
    }
    for (; s <= l;)
        yg(e, r, n, s, t[s]), s++;
}
else if (t != null) {
    Ln(o);
    let l = t[Symbol.iterator]();
    Ln(null);
    let u = l.next();
    for (; !u.done && s <= a;) {
        let d = e.at(s), f = u.value, p = rl(s, d, s, f, n);
        if (p !== 0)
            p < 0 && e.updateValue(s, f), s++, u = l.next();
        else {
            r ??= new Ds, i ??= Eg(e, s, a, n);
            let h = n(s, f);
            if (cu(e, r, s, h))
                e.updateValue(s, f), s++, a++, u = l.next();
            else if (!i.has(h))
                e.attach(s, e.create(s, f)), s++, a++, u = l.next();
            else {
                let v = n(s, d);
                r.set(v, e.detach(s)), a--;
            }
        }
    }
    for (; !u.done;)
        yg(e, r, n, e.length, u.value), u = l.next();
} for (; s <= a;)
    e.destroy(e.detach(a--)); r?.forEach(l => { e.destroy(l); }); }
function cu(e, t, n, o) { return t !== void 0 && t.has(o) ? (e.attach(n, t.get(o)), t.delete(o), !0) : !1; }
function yg(e, t, n, o, r) { if (cu(e, t, o, n(o, r)))
    e.updateValue(o, r);
else {
    let i = e.create(o, r);
    e.attach(o, i);
} }
function Eg(e, t, n, o) { let r = new Set; for (let i = t; i <= n; i++)
    r.add(o(i, e.at(i))); return r; }
var Ds = class {
    kvMap = new Map;
    _vMap = void 0;
    has(t) { return this.kvMap.has(t); }
    delete(t) { if (!this.has(t))
        return !1; let n = this.kvMap.get(t); return this._vMap !== void 0 && this._vMap.has(n) ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n)) : this.kvMap.delete(t), !0; }
    get(t) { return this.kvMap.get(t); }
    set(t, n) { if (this.kvMap.has(t)) {
        let o = this.kvMap.get(t);
        this._vMap === void 0 && (this._vMap = new Map);
        let r = this._vMap;
        for (; r.has(o);)
            o = r.get(o);
        r.set(o, n);
    }
    else
        this.kvMap.set(t, n); }
    forEach(t) { for (let [n, o] of this.kvMap)
        if (t(o, n), this._vMap !== void 0) {
            let r = this._vMap;
            for (; r.has(o);)
                o = r.get(o), t(o, n);
        } }
};
function TI(e, t, n, o, r, i, s, a) { K("NgControlFlow"); let c = g(), l = w(), u = fe(l.consts, i); return pn(c, l, e, t, n, o, r, u, 256, s, a), Da; }
function Da(e, t, n, o, r, i, s, a) { K("NgControlFlow"); let c = g(), l = w(), u = fe(l.consts, i); return pn(c, l, e, t, n, o, r, u, 512, s, a), Da; }
function CI(e, t) { K("NgControlFlow"); let n = g(), o = ge(), r = n[o] !== F ? n[o] : -1, i = r !== -1 ? Ts(n, E + r) : void 0, s = 0; if ($(n, o, e)) {
    let a = L(null);
    try {
        if (i !== void 0 && Ed(i, s), e !== -1) {
            let c = E + e, l = Ts(n, c), u = fu(n[m], c), d = Sy(l, u, n), f = fo(n, u, t, { dehydratedView: d });
            po(l, f, s, cn(u, d));
        }
    }
    finally {
        L(a);
    }
}
else if (i !== void 0) {
    let a = oy(i, s);
    a !== void 0 && (a[P] = t);
} }
var lu = class {
    lContainer;
    $implicit;
    $index;
    constructor(t, n, o) { this.lContainer = t, this.$implicit = n, this.$index = o; }
    get $count() { return this.lContainer.length - H; }
};
function MI(e) { return e; }
function NI(e, t) { return t; }
var uu = class {
    hasEmptyBlock;
    trackByFn;
    liveCollection;
    constructor(t, n, o) { this.hasEmptyBlock = t, this.trackByFn = n, this.liveCollection = o; }
};
function wI(e, t, n, o, r, i, s, a, c, l, u, d, f) { K("NgControlFlow"); let p = g(), h = w(), v = c !== void 0, y = g(), D = a ? s.bind(y[X][P]) : s, _ = new uu(v, D); y[E + e] = _, pn(p, h, e + 1, t, n, o, r, fe(h.consts, i), 256), v && pn(p, h, e + 2, c, l, u, d, fe(h.consts, f), 512); }
var du = class extends au {
    lContainer;
    hostLView;
    templateTNode;
    operationsCounter = void 0;
    needsIndexUpdate = !1;
    constructor(t, n, o) { super(), this.lContainer = t, this.hostLView = n, this.templateTNode = o; }
    get length() { return this.lContainer.length - H; }
    at(t) { return this.getLView(t)[P].$implicit; }
    attach(t, n) { let o = n[ce]; this.needsIndexUpdate ||= t !== this.length, po(this.lContainer, n, t, cn(this.templateTNode, o)), RR(this.lContainer, t); }
    detach(t) { return this.needsIndexUpdate ||= t !== this.length - 1, kR(this.lContainer, t), xR(this.lContainer, t); }
    create(t, n) { let o = gr(this.lContainer, this.templateTNode.tView.ssrId); return fo(this.hostLView, this.templateTNode, new lu(this.lContainer, n, t), { dehydratedView: o }); }
    destroy(t) { Ur(t[m], t); }
    updateValue(t, n) { this.getLView(t)[P].$implicit = n; }
    reset() { this.needsIndexUpdate = !1; }
    updateIndexes() { if (this.needsIndexUpdate)
        for (let t = 0; t < this.length; t++)
            this.getLView(t)[P].$index = t; }
    getLView(t) { return OR(this.lContainer, t); }
};
function SI(e) { let t = L(null), n = oe(); try {
    let o = g(), r = o[m], i = o[n], s = n + 1, a = Ts(o, s);
    if (i.liveCollection === void 0) {
        let l = fu(r, s);
        i.liveCollection = new du(a, o, l);
    }
    else
        i.liveCollection.reset();
    let c = i.liveCollection;
    if (AR(c, e, i.trackByFn, t), c.updateIndexes(), i.hasEmptyBlock) {
        let l = ge(), u = c.length === 0;
        if ($(o, l, u)) {
            let d = n + 2, f = Ts(o, d);
            if (u) {
                let p = fu(r, d), h = Sy(f, p, o), v = fo(o, p, void 0, { dehydratedView: h });
                po(f, v, 0, cn(p, h));
            }
            else
                r.firstUpdatePass && fa(f), Ed(f, 0);
        }
    }
}
finally {
    L(t);
} }
function Ts(e, t) { return e[t]; }
function RR(e, t) { if (e.length <= H)
    return; let n = H + t, o = e[n], r = o ? o[xe] : void 0; if (o && r && r.detachedLeaveAnimationFns && r.detachedLeaveAnimationFns.length > 0) {
    let i = o[R];
    bS(i, r), Ot.delete(o[Ce]), r.detachedLeaveAnimationFns = void 0;
} }
function kR(e, t) { if (e.length <= H)
    return; let n = H + t, o = e[n], r = o ? o[xe] : void 0; r && r.leave && r.leave.size > 0 && (r.detachedLeaveAnimationFns = []); }
function xR(e, t) { return fr(e, t); }
function OR(e, t) { return oy(e, t); }
function fu(e, t) { return Wt(e, t); }
function nf(e, t, n) { let o = g(), r = ge(); if ($(o, r, t)) {
    let i = w(), s = we();
    gd(s, o, e, t, o[C], n);
} return nf; }
function pu(e, t, n, o, r) { ra(t, e, n, r ? "class" : "style", o); }
function Dr(e, t, n, o) { let r = g(), i = r[m], s = e + E, a = i.firstCreatePass ? Sd(s, r, 2, t, vd, Di(), n, o) : i.data[s]; if (ve(a)) {
    let c = r[Ze].tracingService;
    if (c && c.componentCreate) {
        let l = i.data[a.directiveStart + a.componentOffset];
        return c.componentCreate(Nd(l), () => (Ig(e, t, r, a, o), Dr));
    }
} return Ig(e, t, r, a, o), Dr; }
function Ig(e, t, n, o, r) { if (na(o, n, e, t, sf), _n(o)) {
    let i = n[m];
    ea(i, n, o), $u(i, o, n);
} r != null && uo(n, o); }
function Ta() { let e = w(), t = M(), n = oa(t); return e.firstCreatePass && _d(e, n), hc(n) && vc(), pc(), n.classesWithoutHost != null && HM(n) && pu(e, n, g(), n.classesWithoutHost, !0), n.stylesWithoutHost != null && jM(n) && pu(e, n, g(), n.stylesWithoutHost, !1), Ta; }
function of(e, t, n, o) { return Dr(e, t, n, o), Ta(), of; }
function Ca(e, t, n, o) { let r = g(), i = r[m], s = e + E, a = i.firstCreatePass ? Gy(s, i, 2, t, n, o) : i.data[s]; return na(a, r, e, t, sf), o != null && uo(r, a), Ca; }
function Ma() { let e = M(), t = oa(e); return hc(t) && vc(), pc(), Ma; }
function rf(e, t, n, o) { return Ca(e, t, n, o), Ma(), rf; }
var sf = (e, t, n, o, r) => (Ge(!0), Us(t[C], o, wi()));
function LR(e, t, n, o, r) { let i = !Vs(t, n); if (Ge(i), i)
    return Us(t[C], o, wi()); let s = t[ce], a = Gr(s, e, t, n); return Gm(s, r) && Hs(s, r, a.nextSibling), s && (Nu(n) || hm(a)) && ve(n) && (Qp(n), lv(a)), a; }
function _I() { sf = LR; }
function Na(e, t, n) { let o = g(), r = o[m], i = e + E, s = r.firstCreatePass ? Sd(i, o, 8, "ng-container", vd, Di(), t, n) : r.data[i]; if (na(s, o, e, "ng-container", uf), _n(s)) {
    let a = o[m];
    ea(a, o, s), $u(a, s, o);
} return n != null && uo(o, s), Na; }
function Yr() { let e = w(), t = M(), n = oa(t); return e.firstCreatePass && _d(e, n), Yr; }
function af(e, t, n) { return Na(e, t, n), Yr(), af; }
function wa(e, t, n) { let o = g(), r = o[m], i = e + E, s = r.firstCreatePass ? Gy(i, r, 8, "ng-container", t, n) : r.data[i]; return na(s, o, e, "ng-container", uf), n != null && uo(o, s), wa; }
function cf() { let e = M(), t = oa(e); return Yr; }
function lf(e, t, n) { return wa(e, t, n), cf(), lf; }
var uf = (e, t, n, o, r) => (Ge(!0), Wu(t[C], ""));
function PR(e, t, n, o, r) { let i, s = !Vs(t, n); if (Ge(s), s)
    return Wu(t[C], ""); let a = t[ce], c = Gr(a, e, t, n), l = $m(a, r); return Hs(a, r, c), i = ua(l, c), i; }
function bI() { uf = PR; }
function AI() { return g(); }
function df(e, t, n) { let o = g(), r = ge(); if ($(o, r, t)) {
    let i = w(), s = we();
    md(s, o, e, t, o[C], n);
} return df; }
function ff(e, t, n) { let o = g(), r = ge(); if ($(o, r, t)) {
    let i = w(), s = we(), a = Ti(i.data), c = zv(a, s, o);
    md(s, o, e, t, c, n);
} return ff; }
var Go = void 0;
function FR(e) { let t = Math.floor(Math.abs(e)), n = e.toString().replace(/^[^.]*\.?/, "").length; return t === 1 && n === 0 ? 1 : 5; }
var HR = ["en", [["a", "p"], ["AM", "PM"]], [["AM", "PM"]], [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]], Go, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]], Go, [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]], 0, [6, 0], ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"], ["h:mm\u202Fa", "h:mm:ss\u202Fa", "h:mm:ss\u202Fa z", "h:mm:ss\u202Fa zzzz"], ["{1}, {0}", Go, Go, Go], [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"], "USD", "$", "US Dollar", {}, "ltr", FR], zn = Object.create(null);
function jR(e, t, n) { typeof t != "string" && (n = t, t = e[Tr.LocaleId]), t = t.toLowerCase().replace(/_/g, "-"), zn[t] = e, n && (zn[t][Tr.ExtraData] = n); }
function pf(e) { let t = UR(e), n = Dg(t); if (n)
    return n; let o = t.split("-")[0]; if (n = Dg(o), n)
    return n; if (o === "en")
    return HR; throw new S(701, !1); }
function VR(e) { return pf(e)[Tr.CurrencyCode] || null; }
function RI(e) { return pf(e)[Tr.PluralCase]; }
function Dg(e) { if (!(e in zn)) {
    let t = Te.ng && Te.ng.common && Te.ng.common.locales && Te.ng.common.locales[e];
    return t !== void 0 && (zn[e] = t), t;
} return zn[e]; }
function BR() { zn = Object.create(null); }
var Tr = { LocaleId: 0, DayPeriodsFormat: 1, DayPeriodsStandalone: 2, DaysFormat: 3, DaysStandalone: 4, MonthsFormat: 5, MonthsStandalone: 6, Eras: 7, FirstDayOfWeek: 8, WeekendRange: 9, DateFormat: 10, TimeFormat: 11, DateTimeFormat: 12, NumberSymbols: 13, NumberFormats: 14, CurrencyCode: 15, CurrencySymbol: 16, CurrencyName: 17, Currencies: 18, Directionality: 19, PluralCase: 20, ExtraData: 21 };
function UR(e) { return e.toLowerCase().replace(/_/g, "-"); }
var $R = ["zero", "one", "two", "few", "many"];
function GR(e, t) { let n = RI(t)(parseInt(e, 10)), o = $R[n]; return o !== void 0 ? o : "other"; }
var Zr = "en-US", zR = "USD", kI = { marker: "element" }, xI = { marker: "ICU" }, lt = (function (e) { return e[e.SHIFT = 2] = "SHIFT", e[e.APPEND_EAGERLY = 1] = "APPEND_EAGERLY", e[e.COMMENT = 2] = "COMMENT", e; })(lt || {}), OI = Zr;
function LI(e) { typeof e == "string" && (OI = e.toLowerCase().replace(/_/g, "-")); }
function WR() { return OI; }
var Cr = 0, nr = 0;
function qR(e) { e && (Cr = Cr | 1 << Math.min(nr, 31)), nr++; }
function QR(e, t, n) { try {
    if (nr > 0) {
        let o = e.data[n], r = Array.isArray(o) ? o : o.update, i = et() - nr - 1;
        jI(e, t, r, i, Cr);
    }
}
finally {
    Cr = 0, nr = 0;
} }
function PI(e, t, n) { let o = e[C]; switch (n) {
    case Node.COMMENT_NODE: return Wu(o, t);
    case Node.TEXT_NODE: return zu(o, t);
    case Node.ELEMENT_NODE: return Us(o, t, null);
} }
var or = (e, t, n, o) => (Ge(!0), PI(e, n, o));
function YR(e, t, n, o) { let r = e[ce], i = t - E, s = !da() || !r || jo() || js(r, i); return Ge(s), s ? PI(e, n, o) : fy(r, i); }
function FI() { or = YR; }
function ZR(e, t, n, o) { let r = e[C]; for (let i = 0; i < t.length; i++) {
    let s = t[i++], a = t[i], c = (s & lt.COMMENT) === lt.COMMENT, l = (s & lt.APPEND_EAGERLY) === lt.APPEND_EAGERLY, u = s >>> lt.SHIFT, d = e[u], f = !1;
    d === null && (d = e[u] = or(e, u, a, c ? Node.COMMENT_NODE : Node.TEXT_NODE), f = Bo()), l && n !== null && f && rn(r, n, d, o, !1);
} }
function HI(e, t, n, o) { let r = n[C], i = null, s; for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "string") {
        let l = t[++a];
        n[l] === null && (n[l] = or(n, l, c, Node.TEXT_NODE));
    }
    else if (typeof c == "number")
        switch (c & 1) {
            case 0:
                let l = P_(c);
                i === null && (i = l, s = r.parentNode(o));
                let u, d;
                if (l === i ? (u = o, d = s) : (u = null, d = x(n[l])), d !== null) {
                    let v = F_(c), y = n[v];
                    rn(r, d, y, u, !1);
                    let D = Yo(e, v);
                    if (D !== null && typeof D == "object") {
                        let _ = la(D, n);
                        _ !== null && HI(e, D.create[_], n, n[D.anchorIdx]);
                    }
                }
                break;
            case 1:
                let f = c >>> 1, p = t[++a], h = t[++a];
                ta(r, zt(f, n), null, null, p, h, null);
                break;
            default:
        }
    else
        switch (c) {
            case xI:
                let l = t[++a], u = t[++a];
                if (n[u] === null) {
                    let p = n[u] = or(n, u, l, Node.COMMENT_NODE);
                    Le(p, n);
                }
                break;
            case kI:
                let d = t[++a], f = t[++a];
                if (n[f] === null) {
                    let p = n[f] = or(n, f, d, Node.ELEMENT_NODE);
                    Le(p, n);
                }
                break;
            default:
        }
} }
function jI(e, t, n, o, r) { for (let i = 0; i < n.length; i++) {
    let s = n[i], a = n[++i];
    if (s & r) {
        let c = "";
        for (let l = i + 1; l <= i + a; l++) {
            let u = n[l];
            if (typeof u == "string")
                c += u;
            else if (typeof u == "number")
                if (u < 0)
                    c += N(t[o - u]);
                else {
                    let d = u >>> 2;
                    switch (u & 3) {
                        case 1:
                            let f = n[++l], p = n[++l], h = e.data[d];
                            if (typeof h == "string")
                                ta(t[C], t[d], null, h, f, c, p);
                            else {
                                let y = oe();
                                nt(d);
                                try {
                                    gd(h, t, f, c, t[C], p);
                                }
                                finally {
                                    nt(y);
                                }
                            }
                            break;
                        case 0:
                            let v = t[d];
                            v !== null && av(t[C], v, c);
                            break;
                        case 2:
                            KR(e, Yo(e, d), t, c);
                            break;
                        case 3:
                            Tg(e, Yo(e, d), o, t);
                            break;
                    }
                }
        }
    }
    else {
        let c = n[i + 1];
        if (c > 0 && (c & 3) === 3) {
            let l = c >>> 2, u = Yo(e, l);
            t[u.currentCaseLViewIndex] < 0 && Tg(e, u, o, t);
        }
    }
    i += a;
} }
function Tg(e, t, n, o) { let r = o[t.currentCaseLViewIndex]; if (r !== null) {
    let i = Cr;
    r < 0 && (r = o[t.currentCaseLViewIndex] = ~r, i = -1), jI(e, o, t.update[r], n, i);
} }
function KR(e, t, n, o) { let r = JR(t, o); if (la(t, n) !== r && (VI(e, t, n), n[t.currentCaseLViewIndex] = r === null ? null : ~r, r !== null)) {
    let s = n[t.anchorIdx];
    s && HI(e, t.create[r], n, s), nb(n, t.anchorIdx, r);
} }
function VI(e, t, n) { let o = la(t, n); if (o !== null) {
    let r = t.remove[o];
    for (let i = 0; i < r.length; i++) {
        let s = r[i];
        if (s > 0) {
            let a = zt(s, n);
            a !== null && jr(n[C], a);
        }
        else
            VI(e, Yo(e, ~s), n);
    }
} }
function JR(e, t) { let n = e.cases.indexOf(t); if (n === -1)
    switch (e.type) {
        case 1: {
            let o = GR(t, WR());
            n = e.cases.indexOf(o), n === -1 && o !== "other" && (n = e.cases.indexOf("other"));
            break;
        }
        case 0: {
            n = e.cases.indexOf("other");
            break;
        }
    } return n === -1 ? null : n; }
var Cs = /�(\d+):?\d*�/gi, XR = /({\s*�\d+:?\d*�\s*,\s*\S{6}\s*,[\s\S]*})/gi, ek = /�(\d+)�/, BI = /^\s*(�\d+:?\d*�)\s*,\s*(select|plural)\s*,/, rr = "\uFFFD", tk = /�\/?\*(\d+:\d+)�/gi, nk = /�(\/?[#*]\d+):?\d*�/gi, ok = /\uE500/g;
function rk(e) { return e.replace(ok, " "); }
function ik(e, t, n, o, r, i) { let s = bn(), a = [], c = [], l = [[]], u = [[]]; r = lk(r, i); let d = rk(r).split(nk); for (let f = 0; f < d.length; f++) {
    let p = d[f];
    if ((f & 1) === 0) {
        let h = hu(p);
        for (let v = 0; v < h.length; v++) {
            let y = h[v];
            if ((v & 1) === 0) {
                let D = y;
                D !== "" && sk(u[0], e, s, l[0], a, c, n, D);
            }
            else {
                let D = y;
                if (typeof D != "object")
                    throw new Error(`Unable to parse ICU expression in "${r}" message.`);
                let ne = UI(e, s, l[0], n, a, "", !0).index;
                GI(u[0], e, n, c, t, D, ne);
            }
        }
    }
    else {
        let h = p.charCodeAt(0) === 47, v = p.charCodeAt(h ? 1 : 0), y = E + Number.parseInt(p.substring(h ? 2 : 1));
        if (h)
            l.shift(), u.shift(), Xe(bn(), !1);
        else {
            let D = L_(e, l[0], y);
            l.unshift([]), Xe(D, !0);
            let _ = { kind: 2, index: y, children: [], type: v === 35 ? 0 : 1 };
            u[0].push(_), u.unshift(_.children);
        }
    }
} e.data[o] = { create: a, update: c, ast: u[0], parentTNodeIndex: t }; }
function UI(e, t, n, o, r, i, s) { let a = $r(e, o, 1, null), c = a << lt.SHIFT, l = bn(); t === l && (l = null), l === null && (c |= lt.APPEND_EAGERLY), s && (c |= lt.COMMENT, gS(j_)), r.push(c, i === null ? "" : i); let u = Id(e, a, s ? 32 : 1, i === null ? "" : i, null); cy(n, u); let d = u.index; return Xe(u, !1), l !== null && t !== l && O_(l, d), u; }
function sk(e, t, n, o, r, i, s, a) { let c = a.match(Cs), u = UI(t, n, o, s, r, c ? null : a, !1).index; c && Ms(i, a, u, null, 0, null), e.push({ kind: 0, index: u }); }
function ak(e, t, n) { let o = M(), r = o.index, i = []; if (e.firstCreatePass && e.data[t] === null) {
    for (let s = 0; s < n.length; s += 2) {
        let a = n[s], c = n[s + 1];
        if (c !== "") {
            if (XR.test(c))
                throw new Error(`ICU expressions are not supported in attributes. Message: "${c}".`);
            let l = o.namespace ? `:${o.namespace}:${o.value}` : o.value;
            Ms(i, c, r, a, ck(i), gu(a, l));
        }
    }
    e.data[t] = i;
} }
function Ms(e, t, n, o, r, i) { let s = e.length, a = s + 1; e.push(null, null); let c = s + 2, l = t.split(Cs), u = 0; for (let d = 0; d < l.length; d++) {
    let f = l[d];
    if (d & 1) {
        let p = r + parseInt(f, 10);
        e.push(-1 - p), u = u | $I(p);
    }
    else
        f !== "" && e.push(f);
} return e.push(n << 2 | (o ? 1 : 0)), o && e.push(o, i), e[s] = u, e[a] = e.length - c, u; }
function ck(e) { let t = 0; for (let n = 0; n < e.length; n++) {
    let o = e[n];
    typeof o == "number" && o < 0 && t++;
} return t; }
function $I(e) { return 1 << Math.min(e, 31); }
function Cg(e) { let t, n = "", o = 0, r = !1, i; for (; (t = tk.exec(e)) !== null;)
    r ? t[0] === `${rr}/*${i}${rr}` && (o = t.index, r = !1) : (n += e.substring(o, t.index + t[0].length), i = t[1], r = !0); return n += e.slice(o), n; }
function lk(e, t) { if (uy(t))
    return Cg(e); {
    let n = e.indexOf(`:${t}${rr}`) + 2 + t.toString().length, o = e.search(new RegExp(`${rr}\\/\\*\\d+:${t}${rr}`));
    return Cg(e.substring(n, o));
} }
function GI(e, t, n, o, r, i, s) { let a = 0, c = { type: i.type, currentCaseLViewIndex: $r(t, n, 1, null), anchorIdx: s, cases: [], create: [], remove: [], update: [] }; pk(o, i, s), x_(t, s, c); let l = i.values, u = []; for (let d = 0; d < l.length; d++) {
    let f = l[d], p = [];
    for (let v = 0; v < f.length; v++) {
        let y = f[v];
        if (typeof y != "string") {
            let D = p.push(y) - 1;
            f[v] = `<!--\uFFFD${D}\uFFFD-->`;
        }
    }
    let h = [];
    u.push(h), a = dk(h, t, c, n, o, r, i.cases[d], f.join(""), p) | a;
} a && hk(o, a, s), e.push({ kind: 3, index: s, cases: u, currentCaseLViewIndex: c.currentCaseLViewIndex }); }
function uk(e) { let t = [], n = [], o = 1, r = 0; e = e.replace(BI, function (s, a, c) { return c === "select" ? o = 0 : o = 1, r = parseInt(a.slice(1), 10), ""; }); let i = hu(e); for (let s = 0; s < i.length;) {
    let a = i[s++].trim();
    o === 1 && (a = a.replace(/\s*(?:=)?(\w+)\s*/, "$1")), a.length && t.push(a);
    let c = hu(i[s++]);
    t.length > n.length && n.push(c);
} return { type: o, mainBinding: r, cases: t, values: n }; }
function hu(e) { if (!e)
    return []; let t = 0, n = [], o = [], r = /[{}]/g; r.lastIndex = 0; let i; for (; i = r.exec(e);) {
    let a = i.index;
    if (i[0] == "}") {
        if (n.pop(), n.length == 0) {
            let c = e.substring(t, a);
            BI.test(c) ? o.push(uk(c)) : o.push(c), t = a + 1;
        }
    }
    else {
        if (n.length == 0) {
            let c = e.substring(t, a);
            o.push(c), t = a + 1;
        }
        n.push("{");
    }
} let s = e.substring(t); return o.push(s), o; }
function dk(e, t, n, o, r, i, s, a, c) { let l = [], u = [], d = []; n.cases.push(s), n.create.push(l), n.remove.push(u), n.update.push(d); let p = ev(Ar()).getInertBodyElement(a), h = Pl(p) || p; return h ? zI(e, t, n, o, r, l, u, d, h, i, c, 0) : 0; }
function zI(e, t, n, o, r, i, s, a, c, l, u, d) { let f = 0, p = c.firstChild; for (; p;) {
    let h = $r(t, o, 1, null);
    switch (p.nodeType) {
        case Node.ELEMENT_NODE:
            let v = p, y = v.tagName.toLowerCase();
            if (xl.hasOwnProperty(y)) {
                il(i, kI, y, l, h), t.data[h] = y;
                let He = v.attributes;
                for (let it = 0; it < He.length; it++) {
                    let Ht = He.item(it), ti = Ht.name.toLowerCase(), XC = !!Ht.value.match(Cs), up = v.namespaceURI, dp = up === "http://www.w3.org/2000/svg" ? `:svg:${y}` : up === "http://www.w3.org/1998/Math/MathML" ? `:math:${y}` : y;
                    if (XC)
                        Ol.hasOwnProperty(ti) && Ms(a, Ht.value, h, Ht.name, 0, gu(ti, dp));
                    else if (Ol[ti]) {
                        let eM = Ht.value;
                        gu(ti, dp) ? Ng(i, h, Ht.name, "unsafe:blocked") : Ng(i, h, Ht.name, eM);
                    }
                }
                let _e = { kind: 1, index: h, children: [] };
                e.push(_e), f = zI(_e.children, t, n, o, r, i, s, a, p, h, u, d + 1) | f, Mg(s, h, d);
            }
            break;
        case Node.TEXT_NODE:
            let D = p.textContent || "", _ = D.match(Cs);
            il(i, null, _ ? "" : D, l, h), Mg(s, h, d), _ && (f = Ms(a, D, h, null, 0, null) | f), e.push({ kind: 0, index: h });
            break;
        case Node.COMMENT_NODE:
            let ne = ek.exec(p.textContent || "");
            if (ne) {
                let He = parseInt(ne[1], 10), _e = u[He];
                il(i, xI, "", l, h), GI(e, t, o, r, l, _e, h), fk(s, h, d);
            }
            break;
    }
    p = p.nextSibling;
} return f; }
function Mg(e, t, n) { n === 0 && e.push(t); }
function fk(e, t, n) { n === 0 && (e.push(~t), e.push(t)); }
function pk(e, t, n) { e.push($I(t.mainBinding), 2, -1 - t.mainBinding, n << 2 | 2); }
function hk(e, t, n) { e.push(t, 1, n << 2 | 3); }
function il(e, t, n, o, r) { t !== null && e.push(t), e.push(n, r, H_(0, o, r)); }
function Ng(e, t, n, o) { e.push(t << 1 | 1, n, o); }
function gk(e, t = !0) { if (e[0] != ":")
    return [null, e]; let n = e.indexOf(":", 1); if (n === -1) {
    if (t)
        throw new Error(`Unsupported format "${e}" expecting ":namespace:name"`);
    return [null, e];
} return [e.slice(1, n), e.slice(n + 1)]; }
function gu(e, t) { let n; if (t) {
    let [o, r] = gk(t, !1);
    n = jh(r, e, o);
}
else
    n = jh("*", e); switch (n) {
    case q.HTML: return qu;
    case q.STYLE: return Qu;
    case q.SCRIPT: return Zu;
    case q.URL: return Bs;
    case q.RESOURCE_URL: return $s;
    case q.ATTRIBUTE_NO_BINDING: return Ku;
    default: return null;
} }
var wg = 0, mk = /\[(�.+?�?)\]/, vk = /\[(�.+?�?)\]|(�\/?\*\d+:\d+�)/g, yk = /({\s*)(VAR_(PLURAL|SELECT)(_\d+)?)(\s*,)/g, Ek = /{([A-Z0-9_]+)}/g, Ik = /�I18N_EXP_(ICU(_\d+)?)�/g, Dk = /\/\*/, Tk = /\d+\:(\d+)/;
function Ck(e, t = {}) { let n = e; if (mk.test(e)) {
    let o = {}, r = [wg];
    n = n.replace(vk, (i, s, a) => { let c = s || a, l = o[c] || []; if (l.length || (c.split("|").forEach(v => { let y = v.match(Tk), D = y ? parseInt(y[1], 10) : wg, _ = Dk.test(v); l.push([D, _, v]); }), o[c] = l), !l.length)
        throw new Error(`i18n postprocess: unmatched placeholder - ${c}`); let u = r[r.length - 1], d = 0; for (let v = 0; v < l.length; v++)
        if (l[v][0] === u) {
            d = v;
            break;
        } let [f, p, h] = l[d]; return p ? r.pop() : u !== f && r.push(f), l.splice(d, 1), h; });
} return Object.keys(t).length && (n = n.replace(yk, (o, r, i, s, a, c) => t.hasOwnProperty(i) ? `${r}${t[i]}${c}` : o), n = n.replace(Ek, (o, r) => t.hasOwnProperty(r) ? t[r] : o), n = n.replace(Ik, (o, r) => { if (t.hasOwnProperty(r)) {
    let i = t[r];
    if (!i.length)
        throw new Error(`i18n postprocess: unmatched ICU - ${o} with key: ${r}`);
    return i.shift();
} return o; })), n; }
function hf(e, t, n = -1) { let o = w(), r = g(), i = E + e, s = fe(o.consts, t), a = bn(); if (o.firstCreatePass && ik(o, a === null ? 0 : a.index, r, i, s, n), o.type === 2) {
    let f = r[X];
    f[A] |= 32;
}
else
    r[A] |= 32; let c = o.data[i], l = a === r[ie] ? null : a, u = Rv(o, l, r), d = a && a.type & 8 ? r[a.index] : null; Z_(r, i, a, n), ZR(r, c.create, u, d), wc(!0); }
function gf() { wc(!1); }
function WI(e, t, n) { hf(e, t, n), gf(); }
function qI(e, t) { let n = w(), o = fe(n.consts, t); ak(n, e + E, o); }
function mf(e) { let t = g(); return qR($(t, ge(), e)), mf; }
function QI(e) { QR(w(), g(), e + E); }
function YI(e, t = {}) { return Ck(e, t); }
function vf(e, t, n) { let o = g(), r = w(), i = M(); return If(r, o, o[C], i, e, t, n), vf; }
function yf(e, t) { let n = M(), o = g(), r = w(), i = Ti(r.data), s = zv(i, n, o); return If(r, o, s, n, e, t), yf; }
function Ef(e, t, n) { let o = g(), r = w(), i = M(); return (i.type & 3 || n) && wd(i, r, o, n, o[C], e, t, xt(i, o, t)), Ef; }
function If(e, t, n, o, r, i, s) { let a = !0, c = null; if ((o.type & 3 || s) && (c ??= xt(o, t, i), wd(o, e, t, s, n, r, i, c) && (a = !1)), a) {
    let l = o.outputs?.[r], u = o.hostDirectiveOutputs?.[r];
    if (u && u.length)
        for (let d = 0; d < u.length; d += 2) {
            let f = u[d], p = u[d + 1];
            c ??= xt(o, t, i), hs(o, t, f, p, r, c);
        }
    if (l && l.length)
        for (let d of l)
            c ??= xt(o, t, i), hs(o, t, d, r, r, c);
} }
function ZI(e = 1) { return Xp(e); }
function Mk(e, t) { let n = null, o = cS(e); for (let r = 0; r < t.length; r++) {
    let i = t[r];
    if (i === "*") {
        n = r;
        continue;
    }
    if (o === null ? yv(e, i, !0) : dS(o, i))
        return r;
} return n; }
function KI(e) { let t = g()[X][ie]; if (!t.projection) {
    let n = e ? e.length : 1, o = t.projection = So(n, null), r = o.slice(), i = t.child;
    for (; i !== null;) {
        if (i.type !== 128) {
            let s = e ? Mk(i, e) : 0;
            s !== null && (r[s] ? r[s].projectionNext = i : o[s] = i, r[s] = i);
        }
        i = i.next;
    }
} }
function JI(e, t = 0, n, o, r, i) { let s = g(), a = w(), c = o ? e + 1 : null; c !== null && pn(s, a, c, o, r, i, null, n); let l = In(a, E + e, 16, null, n || null); l.projection === null && (l.projection = t), Dc(); let d = !s[ce] || jo(); s[X][ie].projection[l.projection] === null && c !== null ? Nk(s, a, c) : d && !ao(l) && jS(a, s, l); }
function Nk(e, t, n) { let o = E + n, r = t.data[o], i = e[o], s = gr(i, r.tView.ssrId), a = fo(e, r, void 0, { dehydratedView: s }); po(i, a, 0, cn(r, s)); }
function Df(e, t, n, o) { return tE(e, t, n, o), Df; }
function Tf(e, t, n) { return eE(e, t, n), Tf; }
function XI(e) { let t = g(), n = w(), o = Ci(); Vo(o + 1); let r = Rd(n, o); if (e.dirty && jp(t) === ((r.metadata.flags & 2) === 2)) {
    if (r.matches === null)
        e.reset([]);
    else {
        let i = oE(t, o);
        e.reset(i, pm), e.notifyOnChanges();
    }
    return !0;
} return !1; }
function eD() { return Ad(g(), Ci()); }
function Cf(e, t, n, o, r) { return rE(t, tE(e, n, o, r)), Cf; }
function Mf(e, t, n, o) { return rE(e, eE(t, n, o)), Mf; }
function tD(e = 1) { Vo(Ci() + e); }
function nD(e) { let t = Tc(); return wt(t, E + e); }
function Vi(e, t) { return e << 17 | t << 2; }
function hn(e) { return e >> 17 & 32767; }
function wk(e) { return (e & 2) == 2; }
function Sk(e, t) { return e & 131071 | t << 17; }
function mu(e) { return e | 2; }
function Jn(e) { return (e & 131068) >> 2; }
function sl(e, t) { return e & -131069 | t << 2; }
function _k(e) { return (e & 1) === 1; }
function vu(e) { return e | 1; }
function bk(e, t, n, o, r, i) { let s = i ? t.classBindings : t.styleBindings, a = hn(s), c = Jn(s); e[o] = n; let l = !1, u; if (Array.isArray(n)) {
    let d = n;
    u = d[1], (u === null || gi(d, u) > 0) && (l = !0);
}
else
    u = n; if (r)
    if (c !== 0) {
        let f = hn(e[a + 1]);
        e[o + 1] = Vi(f, a), f !== 0 && (e[f + 1] = sl(e[f + 1], o)), e[a + 1] = Sk(e[a + 1], o);
    }
    else
        e[o + 1] = Vi(a, 0), a !== 0 && (e[a + 1] = sl(e[a + 1], o)), a = o;
else
    e[o + 1] = Vi(c, 0), a === 0 ? a = o : e[c + 1] = sl(e[c + 1], o), c = o; l && (e[o + 1] = mu(e[o + 1])), Sg(e, u, o, !0), Sg(e, u, o, !1), Ak(t, u, e, o, i), s = Vi(a, c), i ? t.classBindings = s : t.styleBindings = s; }
function Ak(e, t, n, o, r) { let i = r ? e.residualClasses : e.residualStyles; i != null && typeof t == "string" && gi(i, t) >= 0 && (n[o + 1] = vu(n[o + 1])); }
function Sg(e, t, n, o) { let r = e[n + 1], i = t === null, s = o ? hn(r) : Jn(r), a = !1; for (; s !== 0 && (a === !1 || i);) {
    let c = e[s], l = e[s + 1];
    Rk(c, t) && (a = !0, e[s + 1] = o ? vu(l) : mu(l)), s = o ? hn(l) : Jn(l);
} a && (e[n + 1] = o ? mu(r) : vu(r)); }
function Rk(e, t) { return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? !0 : Array.isArray(e) && typeof t == "string" ? gi(e, t) >= 0 : !1; }
var se = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function oD(e) { return e.substring(se.key, se.keyEnd); }
function kk(e) { return e.substring(se.value, se.valueEnd); }
function xk(e) { return sD(e), rD(e, Xn(e, 0, se.textEnd)); }
function rD(e, t) { let n = se.textEnd; return n === t ? -1 : (t = se.keyEnd = Lk(e, se.key = t, n), Xn(e, t, n)); }
function Ok(e) { return sD(e), iD(e, Xn(e, 0, se.textEnd)); }
function iD(e, t) { let n = se.textEnd, o = se.key = Xn(e, t, n); return n === o ? -1 : (o = se.keyEnd = Pk(e, o, n), o = _g(e, o, n, 58), o = se.value = Xn(e, o, n), o = se.valueEnd = Fk(e, o, n), _g(e, o, n, 59)); }
function sD(e) { se.key = 0, se.keyEnd = 0, se.value = 0, se.valueEnd = 0, se.textEnd = e.length; }
function Xn(e, t, n) { for (; t < n && e.charCodeAt(t) <= 32;)
    t++; return t; }
function Lk(e, t, n) { for (; t < n && e.charCodeAt(t) > 32;)
    t++; return t; }
function Pk(e, t, n) { let o; for (; t < n && ((o = e.charCodeAt(t)) === 45 || o === 95 || (o & -33) >= 65 && (o & -33) <= 90 || o >= 48 && o <= 57);)
    t++; return t; }
function _g(e, t, n, o) { return t = Xn(e, t, n), t < n && t++, t; }
function Fk(e, t, n) { let o = -1, r = -1, i = -1, s = t, a = s; for (; s < n;) {
    let c = e.charCodeAt(s++);
    if (c === 59)
        return a;
    c === 34 || c === 39 ? a = s = bg(e, c, s, n) : t === s - 4 && i === 85 && r === 82 && o === 76 && c === 40 ? a = s = bg(e, 41, s, n) : c > 32 && (a = s), i = r, r = o, o = c & -33;
} return a; }
function bg(e, t, n, o) { let r = -1, i = n; for (; i < o;) {
    let s = e.charCodeAt(i++);
    if (s == t && r !== 92)
        return i;
    s == 92 && r === 92 ? r = 0 : r = s;
} throw new Error; }
function Nf(e, t, n) { return lD(e, t, n, !1), Nf; }
function wf(e, t) { return lD(e, t, null, !0), wf; }
function aD(e) { uD(pD, Hk, e, !1); }
function Hk(e, t) { for (let n = Ok(t); n >= 0; n = iD(t, n))
    pD(e, oD(t), kk(t)); }
function cD(e) { uD(zk, jk, e, !0); }
function jk(e, t) { for (let n = xk(t); n >= 0; n = rD(t, n))
    _o(e, oD(t), !0); }
function lD(e, t, n, o) { let r = g(), i = w(), s = tt(2); if (i.firstUpdatePass && fD(i, e, s, o), t !== F && $(r, s, t)) {
    let a = i.data[oe()];
    hD(i, a, r, r[C], e, r[s + 1] = qk(t, n), o, s);
} }
function uD(e, t, n, o) { let r = w(), i = tt(2); r.firstUpdatePass && fD(r, null, i, o); let s = g(); if (n !== F && $(s, i, n)) {
    let a = r.data[oe()];
    if (gD(a, o) && !dD(r, i)) {
        let c = o ? a.classesWithoutHost : a.stylesWithoutHost;
        c !== null && (n = ai(c, n || "")), pu(r, a, s, n, o);
    }
    else
        Wk(r, a, s, s[C], s[i + 1], s[i + 1] = Gk(e, t, n), o, i);
} }
function dD(e, t) { return t >= e.expandoStartIndex; }
function fD(e, t, n, o) { let r = e.data; if (r[n + 1] === null) {
    let i = r[oe()], s = dD(e, n);
    gD(i, o) && t === null && !s && (t = !1), t = Vk(r, i, t, o), bk(r, i, t, n, s, o);
} }
function Vk(e, t, n, o) { let r = Ti(e), i = o ? t.residualClasses : t.residualStyles; if (r === null)
    (o ? t.classBindings : t.styleBindings) === 0 && (n = al(null, e, t, n, o), n = Mr(n, t.attrs, o), i = null);
else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== r)
        if (n = al(r, e, t, n, o), i === null) {
            let c = Bk(e, t, o);
            c !== void 0 && Array.isArray(c) && (c = al(null, e, t, c[1], o), c = Mr(c, t.attrs, o), Uk(e, t, o, c));
        }
        else
            i = $k(e, t, o);
} return i !== void 0 && (o ? t.residualClasses = i : t.residualStyles = i), n; }
function Bk(e, t, n) { let o = n ? t.classBindings : t.styleBindings; if (Jn(o) !== 0)
    return e[hn(o)]; }
function Uk(e, t, n, o) { let r = n ? t.classBindings : t.styleBindings; e[hn(r)] = o; }
function $k(e, t, n) { let o, r = t.directiveEnd; for (let i = 1 + t.directiveStylingLast; i < r; i++) {
    let s = e[i].hostAttrs;
    o = Mr(o, s, n);
} return Mr(o, t.attrs, n); }
function al(e, t, n, o, r) { let i = null, s = n.directiveEnd, a = n.directiveStylingLast; for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a], o = Mr(o, i.hostAttrs, r), i !== e);)
    a++; return e !== null && (n.directiveStylingLast = a), o; }
function Mr(e, t, n) { let o = n ? 1 : 2, r = -1; if (t !== null)
    for (let i = 0; i < t.length; i++) {
        let s = t[i];
        typeof s == "number" ? r = s : r === o && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]), _o(e, s, n ? !0 : t[++i]));
    } return e === void 0 ? null : e; }
function Gk(e, t, n) { if (n == null || n === "")
    return j; let o = [], r = vt(n); if (Array.isArray(r))
    for (let i = 0; i < r.length; i++)
        e(o, r[i], !0);
else if (r instanceof Set)
    for (let i of r)
        e(o, i, !0);
else if (typeof r == "object")
    for (let i in r)
        Object.hasOwn(r, i) && e(o, i, r[i]);
else
    typeof r == "string" && t(o, r); return o; }
function pD(e, t, n) { _o(e, t, vt(n)); }
function zk(e, t, n) { let o = String(t); o !== "" && !o.includes(" ") && _o(e, o, n); }
function Wk(e, t, n, o, r, i, s, a) { r === F && (r = j); let c = 0, l = 0, u = 0 < r.length ? r[0] : null, d = 0 < i.length ? i[0] : null; for (; u !== null || d !== null;) {
    let f = c < r.length ? r[c + 1] : void 0, p = l < i.length ? i[l + 1] : void 0, h = null, v;
    u === d ? (c += 2, l += 2, f !== p && (h = d, v = p)) : d === null || u !== null && u < d ? (c += 2, h = u) : (l += 2, h = d, v = p), h !== null && hD(e, t, n, o, h, v, s, a), u = c < r.length ? r[c] : null, d = l < i.length ? i[l] : null;
} }
function hD(e, t, n, o, r, i, s, a) { if (!(t.type & 3))
    return; let c = e.data, l = c[a + 1], u = _k(l) ? Ag(c, t, n, r, Jn(l), s) : void 0; if (!Ns(u)) {
    Ns(i) || wk(l) && (i = Ag(c, null, n, r, a, s));
    let d = zt(oe(), n);
    BS(o, s, d, r, i);
} }
function Ag(e, t, n, o, r, i) { let s = t === null, a; for (; r > 0;) {
    let c = e[r], l = Array.isArray(c), u = l ? c[1] : c, d = u === null, f = n[r + 1];
    f === F && (f = d ? j : void 0);
    let p = d ? hi(f, o) : u === o ? f : void 0;
    if (l && !Ns(p) && (p = hi(c, o)), Ns(p) && (a = p, s))
        return a;
    let h = e[r + 1];
    r = s ? hn(h) : Jn(h);
} if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = hi(c, o));
} return a; }
function Ns(e) { return e !== void 0; }
function qk(e, t) { return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = si(vt(e)))), e; }
function gD(e, t) { return (e.flags & (t ? 8 : 16)) !== 0; }
function mD(e, t = "") { let n = g(), o = w(), r = e + E, i = o.firstCreatePass ? In(o, r, 1, t, null) : o.data[r], s = vD(o, n, i, t); n[r] = s, Bo() && ud(o, n, s, i), Xe(i, !1); }
var vD = (e, t, n, o) => (Ge(!0), zu(t[C], o));
function Qk(e, t, n, o) { let r = !Vs(t, n); if (Ge(r), r)
    return zu(t[C], o); let i = t[ce]; return Gr(i, e, t, n); }
function yD() { vD = Qk; }
function ED(e, t) { let n = !1, o = et(); for (let i = 1; i < t.length; i += 2)
    n = $(e, o++, t[i]) || n; if (Nc(o), !n)
    return F; let r = t[0]; for (let i = 1; i < t.length; i += 2)
    r += N(t[i]) + (i + 1 !== t.length ? t[i + 1] : ""); return r; }
function ID(e, t, n, o = "") { return $(e, ge(), n) ? t + N(n) + o : F; }
function DD(e, t, n, o, r, i = "") { let s = et(), a = ln(e, s, n, r); return tt(2), a ? t + N(n) + o + N(r) + i : F; }
function TD(e, t, n, o, r, i, s, a = "") { let c = et(), l = ga(e, c, n, r, s); return tt(3), l ? t + N(n) + o + N(r) + i + N(s) + a : F; }
function CD(e, t, n, o, r, i, s, a, c, l = "") { let u = et(), d = Fe(e, u, n, r, s, c); return tt(4), d ? t + N(n) + o + N(r) + i + N(s) + a + N(c) + l : F; }
function MD(e, t, n, o, r, i, s, a, c, l, u, d = "") { let f = et(), p = Fe(e, f, n, r, s, c); return p = $(e, f + 4, u) || p, tt(5), p ? t + N(n) + o + N(r) + i + N(s) + a + N(c) + l + N(u) + d : F; }
function ND(e, t, n, o, r, i, s, a, c, l, u, d, f, p = "") { let h = et(), v = Fe(e, h, n, r, s, c); return v = ln(e, h + 4, u, f) || v, tt(6), v ? t + N(n) + o + N(r) + i + N(s) + a + N(c) + l + N(u) + d + N(f) + p : F; }
function wD(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v = "") { let y = et(), D = Fe(e, y, n, r, s, c); return D = ga(e, y + 4, u, f, h) || D, tt(7), D ? t + N(n) + o + N(r) + i + N(s) + a + N(c) + l + N(u) + d + N(f) + p + N(h) + v : F; }
function SD(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y, D = "") { let _ = et(), ne = Fe(e, _, n, r, s, c); return ne = Fe(e, _ + 4, u, f, h, y) || ne, tt(8), ne ? t + N(n) + o + N(r) + i + N(s) + a + N(c) + l + N(u) + d + N(f) + p + N(h) + v + N(y) + D : F; }
function Sf(e) { return Sa("", e), Sf; }
function Sa(e, t, n) { let o = g(), r = ID(o, e, t, n); return r !== F && Dt(o, oe(), r), Sa; }
function _f(e, t, n, o, r) { let i = g(), s = DD(i, e, t, n, o, r); return s !== F && Dt(i, oe(), s), _f; }
function bf(e, t, n, o, r, i, s) { let a = g(), c = TD(a, e, t, n, o, r, i, s); return c !== F && Dt(a, oe(), c), bf; }
function Af(e, t, n, o, r, i, s, a, c) { let l = g(), u = CD(l, e, t, n, o, r, i, s, a, c); return u !== F && Dt(l, oe(), u), Af; }
function Rf(e, t, n, o, r, i, s, a, c, l, u) { let d = g(), f = MD(d, e, t, n, o, r, i, s, a, c, l, u); return f !== F && Dt(d, oe(), f), Rf; }
function kf(e, t, n, o, r, i, s, a, c, l, u, d, f) { let p = g(), h = ND(p, e, t, n, o, r, i, s, a, c, l, u, d, f); return h !== F && Dt(p, oe(), h), kf; }
function xf(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h) { let v = g(), y = wD(v, e, t, n, o, r, i, s, a, c, l, u, d, f, p, h); return y !== F && Dt(v, oe(), y), xf; }
function Of(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y) { let D = g(), _ = SD(D, e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y); return _ !== F && Dt(D, oe(), _), Of; }
function Lf(e) { let t = g(), n = ED(t, e); return n !== F && Dt(t, oe(), n), Lf; }
function Dt(e, t, n) { let o = zt(t, e); av(e[C], o, n); }
function Pf(e, t, n) { bi(t) && (t = t()); let o = g(), r = ge(); if ($(o, r, t)) {
    let i = w(), s = we();
    gd(s, o, e, t, o[C], n);
} return Pf; }
function _D(e, t) { let n = bi(e); return n && e.set(t), n; }
function Ff(e, t) { let n = g(), o = w(), r = M(); return If(o, n, n[C], r, e, t), Ff; }
var bD = {};
function Hf(e) { K("NgLet"); let t = w(), n = g(), o = e + E, r = In(t, o, 128, null, null); return Xe(r, !1), Lo(t, n, o, bD), Hf; }
function AD(e) { let t = w(), n = g(), o = oe(); return Lo(t, n, o, e), e; }
function RD(e) { let t = Tc(), n = wt(t, E + e); if (n === bD)
    throw new S(314, !1); return n; }
function kD(e, t) { let n = w(), o = g(), r = o[C], i = "data-ng-source-location"; for (let [s, a, c, l] of t) {
    let u = Wt(n, s + E), d = zt(s + E, o);
    if (!d.hasAttribute(i)) {
        let f = `${e}@o:${a},l:${c},c:${l}`;
        r.setAttribute(d, i, f);
    }
} }
function xD(e) { return $(g(), ge(), e) ? N(e) : F; }
function OD(e, t, n = "") { return ID(g(), e, t, n); }
function LD(e, t, n, o, r = "") { return DD(g(), e, t, n, o, r); }
function PD(e, t, n, o, r, i, s = "") { return TD(g(), e, t, n, o, r, i, s); }
function FD(e, t, n, o, r, i, s, a, c = "") { return CD(g(), e, t, n, o, r, i, s, a, c); }
function HD(e, t, n, o, r, i, s, a, c, l, u = "") { return MD(g(), e, t, n, o, r, i, s, a, c, l, u); }
function jD(e, t, n, o, r, i, s, a, c, l, u, d, f = "") { return ND(g(), e, t, n, o, r, i, s, a, c, l, u, d, f); }
function VD(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h = "") { return wD(g(), e, t, n, o, r, i, s, a, c, l, u, d, f, p, h); }
function BD(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y = "") { return SD(g(), e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, v, y); }
function UD(e) { return ED(g(), e); }
function $D(e, t, n) { let o = pe() + e, r = g(); return r[o] === F ? We(r, o, t(n, r)) : go(r, o); }
function Rg(e, t, n) { let o = w(); o.firstCreatePass && GD(t, o.data, o.blueprint, Oe(e), n); }
function GD(e, t, n, o, r) { if (e = z(e), Array.isArray(e))
    for (let i = 0; i < e.length; i++)
        GD(e[i], t, n, o, r);
else {
    let i = w(), s = g(), a = M(), c = mi(e) ? e : z(e.provide), l = Ap(e), u = a.providerIndexes & 1048575, d = a.directiveStart, f = a.providerIndexes >> 20;
    if (mi(e) || !e.multi) {
        let p = new on(l, r, mo, null), h = ll(c, t, r ? u : u + f, d);
        h === -1 ? (ml(ts(a, s), i, c), cl(i, e, t.length), t.push(c), a.directiveStart++, a.directiveEnd++, r && (a.providerIndexes += 1048576), n.push(p), s.push(p)) : (n[h] = p, s[h] = p);
    }
    else {
        let p = ll(c, t, u + f, d), h = ll(c, t, u, u + f), v = p >= 0 && n[p], y = h >= 0 && n[h];
        if (r && !y || !r && !v) {
            ml(ts(a, s), i, c);
            let D = Kk(r ? Zk : Yk, n.length, r, o, l, e);
            !r && y && (n[h].providerFactory = D), cl(i, e, t.length, 0), t.push(c), a.directiveStart++, a.directiveEnd++, r && (a.providerIndexes += 1048576), n.push(D), s.push(D);
        }
        else {
            let D = zD(n[r ? h : p], l, !r && o);
            cl(i, e, p > -1 ? p : h, D);
        }
        !r && o && y && n[h].componentProviders++;
    }
} }
function cl(e, t, n, o) { let r = mi(t), i = _p(t); if (r || i) {
    let c = (i ? z(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
        let l = e.destroyHooks || (e.destroyHooks = []);
        if (!r && t.multi) {
            let u = l.indexOf(n);
            u === -1 ? l.push(n, [o, c]) : l[u + 1].push(o, c);
        }
        else
            l.push(n, c);
    }
} }
function zD(e, t, n) { return n && e.componentProviders++, e.multi.push(t) - 1; }
function ll(e, t, n, o) { for (let r = n; r < o; r++)
    if (t[r] === e)
        return r; return -1; }
function Yk(e, t, n, o, r) { return yu(this.multi, []); }
function Zk(e, t, n, o, r) { let i = this.multi, s; if (this.providerFactory) {
    let a = this.providerFactory.componentProviders, c = sr(o, o[m], this.providerFactory.index, r);
    s = c.slice(0, a), yu(i, s);
    for (let l = a; l < c.length; l++)
        s.push(c[l]);
}
else
    s = [], yu(i, s); return s; }
function yu(e, t) { for (let n = 0; n < e.length; n++) {
    let o = e[n];
    t.push(o());
} return t; }
function Kk(e, t, n, o, r, i) { let s = new on(e, n, mo, null); return s.multi = [], s.index = t, s.componentProviders = 0, zD(s, r, o && !n), s; }
function WD(e, t) { return n => { n.providersResolver = (o, r) => Rg(o, r ? r(e) : e, !1), t && (n.viewProvidersResolver = (o, r) => Rg(o, r ? r(t) : t, !0)); }; }
function qD(e) { return t => { e.length < 1 || (t.getExternalStyles = n => e.map(r => r + "?ngcomp" + (n ? "=" + encodeURIComponent(n) : "") + "&e=" + t.encapsulation)); }; }
function QD(e, t, n) { let o = e.\u0275cmp; o.directiveDefs = Es(t, lE), o.pipeDefs = Es(n, Ye); }
function YD(e, t) { return rt(() => { let n = di(e); n.declarations = Bi(t.declarations || j), n.imports = Bi(t.imports || j), n.exports = Bi(t.exports || j), t.bootstrap && (n.bootstrap = Bi(t.bootstrap)), Yn.registerNgModule(e, t); }); }
function Bi(e) { if (typeof e == "function")
    return e; let t = Ve(e); return t.some(ci) ? () => t.map(z).map(kg) : t.map(kg); }
function kg(e) { return Md(e) ? e.ngModule : e; }
var ZD = () => null, KD = () => { }, xg = !1;
function JD() { return ZD(); }
function XD(e, t) { KD(e, t); }
function eT() { xg || (xg = !0, cw(), K("NgIncrementalHydration"), ZD = () => new QN, KD = (e, t) => { let n = hw(e), o = Q_(t, t.body); ER(e, n, o), sw(t, e); }); }
function tT(e, t) { let n = pe() + e, o = g(); return o[n] === F ? We(o, n, t()) : go(o, n); }
function nT(e, t, n) { return dT(g(), pe(), e, t, n); }
function oT(e, t, n, o) { return fT(g(), pe(), e, t, n, o); }
function rT(e, t, n, o, r) { return pT(g(), pe(), e, t, n, o, r); }
function iT(e, t, n, o, r, i, s) { return hT(g(), pe(), e, t, n, o, r, i); }
function sT(e, t, n, o, r, i, s) { let a = pe() + e, c = g(), l = Fe(c, a, n, o, r, i); return $(c, a + 4, s) || l ? We(c, a + 5, t(n, o, r, i, s)) : go(c, a + 5); }
function aT(e, t, n, o, r, i, s, a) { let c = pe() + e, l = g(), u = Fe(l, c, n, o, r, i); return ln(l, c + 4, s, a) || u ? We(l, c + 6, t(n, o, r, i, s, a)) : go(l, c + 6); }
function cT(e, t, n, o, r, i, s, a, c) { let l = pe() + e, u = g(), d = Fe(u, l, n, o, r, i); return ga(u, l + 4, s, a, c) || d ? We(u, l + 7, t(n, o, r, i, s, a, c)) : go(u, l + 7); }
function lT(e, t, n, o, r, i, s, a, c, l) { let u = pe() + e, d = g(), f = Fe(d, u, n, o, r, i); return Fe(d, u + 4, s, a, c, l) || f ? We(d, u + 8, t(n, o, r, i, s, a, c, l)) : go(d, u + 8); }
function uT(e, t, n) { return gT(g(), pe(), e, t, n); }
function Kr(e, t) { let n = e[t]; return n === F ? void 0 : n; }
function dT(e, t, n, o, r, i) { let s = t + n; return $(e, s, r) ? We(e, s + 1, i ? o.call(i, r) : o(r)) : Kr(e, s + 1); }
function fT(e, t, n, o, r, i, s) { let a = t + n; return ln(e, a, r, i) ? We(e, a + 2, s ? o.call(s, r, i) : o(r, i)) : Kr(e, a + 2); }
function pT(e, t, n, o, r, i, s, a) { let c = t + n; return ga(e, c, r, i, s) ? We(e, c + 3, a ? o.call(a, r, i, s) : o(r, i, s)) : Kr(e, c + 3); }
function hT(e, t, n, o, r, i, s, a, c) { let l = t + n; return Fe(e, l, r, i, s, a) ? We(e, l + 4, c ? o.call(c, r, i, s, a) : o(r, i, s, a)) : Kr(e, l + 4); }
function gT(e, t, n, o, r, i) { let s = t + n, a = !1; for (let c = 0; c < r.length; c++)
    $(e, s++, r[c]) && (a = !0); return a ? We(e, s, o.apply(i, r)) : Kr(e, s); }
function mT(e, t) { let n = w(), o, r = e + E; n.firstCreatePass ? (o = Jk(t, n.pipeRegistry), n.data[r] = o, o.onDestroy && (n.destroyHooks ??= []).push(r, o.onDestroy)) : o = n.data[r]; let i = o.factory || (o.factory = pi(o.type, !0)), s, a = Vt(mo); try {
    let c = es(!1), l = i();
    return es(c), Lo(n, g(), r, l), l;
}
finally {
    Vt(a);
} }
function Jk(e, t) { if (t)
    for (let n = t.length - 1; n >= 0; n--) {
        let o = t[n];
        if (e === o.name)
            return o;
    } }
function vT(e, t, n) { let o = e + E, r = g(), i = wt(r, o); return Jr(r, o) ? dT(r, pe(), t, i.transform, n, i) : i.transform(n); }
function yT(e, t, n, o) { let r = e + E, i = g(), s = wt(i, r); return Jr(i, r) ? fT(i, pe(), t, s.transform, n, o, s) : s.transform(n, o); }
function ET(e, t, n, o, r) { let i = e + E, s = g(), a = wt(s, i); return Jr(s, i) ? pT(s, pe(), t, a.transform, n, o, r, a) : a.transform(n, o, r); }
function IT(e, t, n, o, r, i) { let s = e + E, a = g(), c = wt(a, s); return Jr(a, s) ? hT(a, pe(), t, c.transform, n, o, r, i, c) : c.transform(n, o, r, i); }
function DT(e, t, n) { let o = e + E, r = g(), i = wt(r, o); return Jr(r, o) ? gT(r, pe(), t, i.transform, n, i) : i.transform.apply(i, n); }
function Jr(e, t) { return e[m].data[t].pure; }
function TT(e, t) { return ca(e, t); }
function CT(e, t) { return () => { try {
    return Yn.getComponentDependencies(e, t).dependencies;
}
catch (n) {
    throw console.error(`Computing dependencies in local compilation mode for the component "${e.name}" failed with the exception:`, n), n;
} }; }
function MT(e, t) { let n = W(e); n !== null && (n.debugInfo = t); }
function NT(e, t, n) { let o = `./@ng/component?c=${e}&t=${encodeURIComponent(t)}`; return new URL(o, n).href; }
function wT(e, t, n, o, r = null, i = null) { let s = W(e); t.apply(null, [e, n, ...o]); let { newDef: a, oldDef: c } = Xk(s, W(e)); if (e[Mn] = a, c.tView) {
    let l = DN().values();
    for (let u of l)
        $e(u) && u[Y] === null && Yi(r, i, a, c, u);
} }
function Xk(e, t) { let n = G({}, e); return { newDef: Object.assign(e, t, { directiveDefs: n.directiveDefs, pipeDefs: n.pipeDefs, setInput: n.setInput, type: n.type }), oldDef: n }; }
function Yi(e, t, n, o, r) { let i = r[m]; if (i === o.tView) {
    tx(e, t, n, o, r);
    return;
} for (let s = E; s < i.bindingStartIndex; s++) {
    let a = r[s];
    if (Z(a)) {
        ee(a[V]) && Yi(e, t, n, o, a[V]);
        for (let c = H; c < a.length; c++)
            Yi(e, t, n, o, a[c]);
    }
    else
        ee(a) && Yi(e, t, n, o, a);
} }
function ex(e, t) { e.componentReplaced?.(t.id); }
function tx(e, t, n, o, r) { let i = r[P], s = r[V], a = r[Y], c = r[ie], l = r[R].get(B, null), u = () => { if (o.encapsulation === Pe.ShadowDom || o.encapsulation === Pe.ExperimentalIsolatedShadowDom) {
    let h = s.cloneNode(!1);
    s.replaceWith(h), s = h;
} let d = Hv(n), f = Js(a, d, i, pd(n), s, c, null, null, null, null, null); nx(a, r, f, c.index), Ur(r[m], r), hr(r); let p = r[Ze].rendererFactory; ex(p, o), f[C] = p.createRenderer(s, n), bv(r[m], r), ox(c), ia(d, f, i), Jv(d, f, d.template, i); }; l === null ? Og(e, t, u) : l.run(() => Og(e, t, u)); }
function Og(e, t, n) {
    try {
        n();
    }
    catch (o) {
        let r = o;
        if (t !== null && r.message) {
            let i = r.message + (r.stack ? `
` + r.stack : "");
            e?.hot?.send?.("angular:invalidate", { id: t, message: i, error: !0 });
        }
        throw o;
    }
}
function nx(e, t, n, o) { for (let r = E; r < e[m].bindingStartIndex; r++) {
    let i = e[r];
    if ((ee(i) || Z(i)) && i[ue] === t) {
        i[ue] = n;
        break;
    }
} e[Ct] === t && (e[Ct] = n), e[Ro] === t && (e[Ro] = n), n[ue] = t[ue], t[ue] = null, e[o] = n; }
function ox(e) { if (e.projection !== null) {
    for (let t of e.projection)
        ws(t) && (t.projectionNext = null, t.flags &= -3);
    e.projection = null;
} }
var he = { \u0275\u0275animateEnter: Xo, \u0275\u0275animateEnterListener: er, \u0275\u0275animateLeave: tr, \u0275\u0275animateLeaveListener: Is, \u0275\u0275attribute: tf, \u0275\u0275defineComponent: cE, \u0275\u0275defineDirective: uE, \u0275\u0275defineInjectable: ae, \u0275\u0275defineInjector: Co, \u0275\u0275defineNgModule: Hd, \u0275\u0275defineService: gt, \u0275\u0275definePipe: dE, \u0275\u0275directiveInject: mo, \u0275\u0275getInheritedFactory: om, \u0275\u0275inject: je, \u0275\u0275injectAttribute: Ss, \u0275\u0275invalidFactory: By, \u0275\u0275invalidFactoryDep: fi, \u0275\u0275templateRefExtractor: TT, \u0275\u0275resetView: Ec, \u0275\u0275HostDirectivesFeature: TE, \u0275\u0275NgOnChangesFeature: $g, \u0275\u0275ControlFeature: DE, \u0275\u0275ProvidersFeature: WD, \u0275\u0275InheritDefinitionFeature: Gd, \u0275\u0275ExternalStylesFeature: qD, \u0275\u0275nextContext: ZI, \u0275\u0275namespaceHTML: kc, \u0275\u0275namespaceMathML: Rc, \u0275\u0275namespaceSVG: Ac, \u0275\u0275enableBindings: gc, \u0275\u0275disableBindings: mc, \u0275\u0275elementStart: Dr, \u0275\u0275elementEnd: Ta, \u0275\u0275element: of, \u0275\u0275elementContainerStart: Na, \u0275\u0275elementContainerEnd: Yr, \u0275\u0275domElement: rf, \u0275\u0275domElementStart: Ca, \u0275\u0275domElementEnd: Ma, \u0275\u0275domElementContainer: lf, \u0275\u0275domElementContainerStart: wa, \u0275\u0275domElementContainerEnd: cf, \u0275\u0275domTemplate: Wd, \u0275\u0275domListener: Ef, \u0275\u0275elementContainer: af, \u0275\u0275pureFunction0: tT, \u0275\u0275pureFunction1: nT, \u0275\u0275pureFunction2: oT, \u0275\u0275pureFunction3: rT, \u0275\u0275pureFunction4: iT, \u0275\u0275pureFunction5: sT, \u0275\u0275pureFunction6: aT, \u0275\u0275pureFunction7: cT, \u0275\u0275pureFunction8: lT, \u0275\u0275pureFunctionV: uT, \u0275\u0275getCurrentView: AI, \u0275\u0275restoreView: yc, \u0275\u0275listener: vf, \u0275\u0275projection: JI, \u0275\u0275syntheticHostProperty: ff, \u0275\u0275syntheticHostListener: yf, \u0275\u0275pipeBind1: vT, \u0275\u0275pipeBind2: yT, \u0275\u0275pipeBind3: ET, \u0275\u0275pipeBind4: IT, \u0275\u0275pipeBindV: DT, \u0275\u0275projectionDef: KI, \u0275\u0275domProperty: df, \u0275\u0275ariaProperty: ef, \u0275\u0275property: nf, \u0275\u0275control: Py, \u0275\u0275controlCreate: Oy, \u0275\u0275pipe: mT, \u0275\u0275queryRefresh: XI, \u0275\u0275queryAdvance: tD, \u0275\u0275viewQuery: Tf, \u0275\u0275viewQuerySignal: Mf, \u0275\u0275loadQuery: eD, \u0275\u0275contentQuery: Df, \u0275\u0275contentQuerySignal: Cf, \u0275\u0275reference: nD, \u0275\u0275classMap: cD, \u0275\u0275styleMap: aD, \u0275\u0275styleProp: Nf, \u0275\u0275classProp: wf, \u0275\u0275advance: jv, \u0275\u0275template: zd, \u0275\u0275conditional: CI, \u0275\u0275conditionalCreate: TI, \u0275\u0275conditionalBranchCreate: Da, \u0275\u0275defer: JE, \u0275\u0275deferWhen: XE, \u0275\u0275deferOnIdle: oI, \u0275\u0275deferOnImmediate: sI, \u0275\u0275deferOnTimer: lI, \u0275\u0275deferOnHover: fI, \u0275\u0275deferOnInteraction: gI, \u0275\u0275deferOnViewport: yI, \u0275\u0275deferPrefetchWhen: eI, \u0275\u0275deferPrefetchOnIdle: rI, \u0275\u0275deferPrefetchOnImmediate: aI, \u0275\u0275deferPrefetchOnTimer: uI, \u0275\u0275deferPrefetchOnHover: pI, \u0275\u0275deferPrefetchOnInteraction: mI, \u0275\u0275deferPrefetchOnViewport: EI, \u0275\u0275deferHydrateWhen: tI, \u0275\u0275deferHydrateNever: nI, \u0275\u0275deferHydrateOnIdle: iI, \u0275\u0275deferHydrateOnImmediate: cI, \u0275\u0275deferHydrateOnTimer: dI, \u0275\u0275deferHydrateOnHover: hI, \u0275\u0275deferHydrateOnInteraction: vI, \u0275\u0275deferHydrateOnViewport: II, \u0275\u0275deferEnableTimerScheduling: FE, \u0275\u0275enableIncrementalHydrationRuntime: eT, \u0275\u0275repeater: SI, \u0275\u0275repeaterCreate: wI, \u0275\u0275repeaterTrackByIndex: MI, \u0275\u0275repeaterTrackByIdentity: NI, \u0275\u0275componentInstance: DI, \u0275\u0275text: mD, \u0275\u0275textInterpolate: Sf, \u0275\u0275textInterpolate1: Sa, \u0275\u0275textInterpolate2: _f, \u0275\u0275textInterpolate3: bf, \u0275\u0275textInterpolate4: Af, \u0275\u0275textInterpolate5: Rf, \u0275\u0275textInterpolate6: kf, \u0275\u0275textInterpolate7: xf, \u0275\u0275textInterpolate8: Of, \u0275\u0275textInterpolateV: Lf, \u0275\u0275i18n: WI, \u0275\u0275i18nAttributes: qI, \u0275\u0275i18nExp: mf, \u0275\u0275i18nStart: hf, \u0275\u0275i18nEnd: gf, \u0275\u0275i18nApply: QI, \u0275\u0275i18nPostprocess: YI, \u0275\u0275resolveWindow: gv, \u0275\u0275resolveDocument: mv, \u0275\u0275resolveBody: Ju, \u0275\u0275setComponentScope: QD, \u0275\u0275setNgModuleScope: YD, \u0275\u0275registerNgModuleType: Ud, \u0275\u0275getComponentDepsFactory: CT, \u0275setClassDebugInfo: MT, \u0275\u0275declareLet: Hf, \u0275\u0275storeLet: AD, \u0275\u0275arrowFunction: $D, \u0275\u0275readContextLet: RD, \u0275\u0275attachSourceLocations: kD, \u0275\u0275interpolate: xD, \u0275\u0275interpolate1: OD, \u0275\u0275interpolate2: LD, \u0275\u0275interpolate3: PD, \u0275\u0275interpolate4: FD, \u0275\u0275interpolate5: HD, \u0275\u0275interpolate6: jD, \u0275\u0275interpolate7: VD, \u0275\u0275interpolate8: BD, \u0275\u0275interpolateV: UD, \u0275\u0275sanitizeHtml: qu, \u0275\u0275sanitizeStyle: Qu, \u0275\u0275sanitizeResourceUrl: $s, \u0275\u0275sanitizeScript: Zu, \u0275\u0275validateAttribute: Ku, \u0275\u0275sanitizeUrl: Yu, \u0275\u0275sanitizeUrlOrResourceUrl: hv, \u0275\u0275trustConstantHtml: fv, \u0275\u0275trustConstantResourceUrl: pv, forwardRef: Za, resolveForwardRef: z, \u0275\u0275twoWayProperty: Pf, \u0275\u0275twoWayBindingSet: _D, \u0275\u0275twoWayListener: Ff, \u0275\u0275replaceMetadata: wT, \u0275\u0275getReplaceMetadataURL: NT }, Vn = null;
function ST(e) { Vn !== null && (e.defaultEncapsulation !== Vn.defaultEncapsulation || e.preserveWhitespaces !== Vn.preserveWhitespaces) || (Vn = e); }
function rx() { return Vn; }
function ix() { Vn = null; }
var ir = [];
function sx(e, t) { ir.push({ moduleType: e, ngModule: t }); }
var ul = !1;
function _T() { if (!ul) {
    ul = !0;
    try {
        for (let e = ir.length - 1; e >= 0; e--) {
            let { moduleType: t, ngModule: n } = ir[e];
            n.declarations && n.declarations.every(bT) && (ir.splice(e, 1), dx(t, n));
        }
    }
    finally {
        ul = !1;
    }
} }
function bT(e) { return Array.isArray(e) ? e.every(bT) : !!z(e); }
function AT(e, t = {}) { RT(e, t), t.id !== void 0 && Ud(e, t.id), sx(e, t); }
function RT(e, t, n = !1) { let o = Ve(t.declarations || j), r = null; Object.defineProperty(e, ec, { configurable: !0, get: () => (r === null && (r = Q({ usage: 0, kind: "NgModule", type: e }).compileNgModule(he, `ng:///${e.name}/\u0275mod.js`, { type: e, bootstrap: Ve(t.bootstrap || j).map(z), declarations: o.map(z), imports: Ve(t.imports || j).map(z).map(Lg), exports: Ve(t.exports || j).map(z).map(Lg), schemas: t.schemas ? Ve(t.schemas) : null, id: t.id || null }), r.schemas || (r.schemas = [])), r) }); let i = null; Object.defineProperty(e, Qe, { get: () => { if (i === null) {
        let a = Q({ usage: 0, kind: "NgModule", type: e });
        i = a.compileFactory(he, `ng:///${e.name}/\u0275fac.js`, { name: e.name, type: e, deps: _r(e), target: a.FactoryTarget.NgModule, typeArgumentCount: 0 });
    } return i; }, configurable: !1 }); let s = null; Object.defineProperty(e, Xa, { get: () => { if (s === null) {
        let a = { name: e.name, type: e, providers: t.providers || j, imports: [(t.imports || j).map(z), (t.exports || j).map(z)] };
        s = Q({ usage: 0, kind: "NgModule", type: e }).compileInjector(he, `ng:///${e.name}/\u0275inj.js`, a);
    } return s; }, configurable: !1 }); }
function ax(e, t) { let n = `Unexpected "${ke(e)}" found in the "declarations" array of the`, o = `"${ke(e)}" is marked as standalone and can't be declared in any NgModule - did you intend to import it instead (by adding it to the "imports" array)?`; return `${n} ${t}, ${o}`; }
var cx = new WeakMap, lx = new WeakMap;
function ux() { cx = new WeakMap, lx = new WeakMap, ir.length = 0, cA.clear(); }
function dx(e, t) { let n = Ve(t.declarations || j), o = Vf(e); n.forEach(r => { if (r = z(r), r.hasOwnProperty(Mn)) {
    let s = W(r);
    jf(s, o);
}
else
    !r.hasOwnProperty(li) && !r.hasOwnProperty(ui) && (r.ngSelectorScope = e); }); }
function jf(e, t) { e.directiveDefs = () => Array.from(t.compilation.directives).map(n => n.hasOwnProperty(Mn) ? W(n) : Re(n)).filter(n => !!n), e.pipeDefs = () => Array.from(t.compilation.pipes).map(n => Ye(n)), e.schemas = t.schemas, e.tView = null; }
function Vf(e) { if (Jt(e)) {
    let t = Yn.getNgModuleScope(e), n = di(e);
    return G({ schemas: n.schemas || null }, t);
}
else if (No(e)) {
    if ((W(e) || Re(e)) !== null)
        return { schemas: null, compilation: { directives: new Set, pipes: new Set }, exported: { directives: new Set([e]), pipes: new Set } };
    if (Ye(e) !== null)
        return { schemas: null, compilation: { directives: new Set, pipes: new Set }, exported: { directives: new Set, pipes: new Set([e]) } };
} throw new Error(`${e.name} does not have a module def (\u0275mod property)`); }
function Lg(e) { return Md(e) ? e.ngModule : e; }
var dl = 0;
function kT(e, t) {
    let n = null;
    dA(e, t), OT(e, t), Object.defineProperty(e, Mn, { get: () => {
            if (n === null) {
                let o = Q({ usage: 0, kind: "component", type: e });
                if (yE(t)) {
                    let u = [`Component '${e.name}' is not resolved:`];
                    throw t.templateUrl && u.push(` - templateUrl: ${t.templateUrl}`), t.styleUrls && t.styleUrls.length && u.push(` - styleUrls: ${JSON.stringify(t.styleUrls)}`), t.styleUrl && u.push(` - styleUrl: ${t.styleUrl}`), u.push("Did you run and wait for 'resolveComponentResources()'?"), new Error(u.join(`
`));
                }
                let r = rx(), i = t.preserveWhitespaces;
                i === void 0 && (r !== null && r.preserveWhitespaces !== void 0 ? i = r.preserveWhitespaces : i = !1);
                let s = t.encapsulation;
                s === void 0 && (r !== null && r.defaultEncapsulation !== void 0 ? s = r.defaultEncapsulation : s = Pe.Emulated);
                let a = t.templateUrl || `ng:///${e.name}/template.html`, c = LT(e, t), l = be(G({}, c), { typeSourceSpan: o.createParseSourceSpan("Component", e.name, a), template: t.template || "", preserveWhitespaces: i, styles: typeof t.styles == "string" ? [t.styles] : t.styles || j, animations: t.animations, declarations: [], changeDetection: t.changeDetection, encapsulation: s, viewProviders: t.viewProviders || null, hasDirectiveDependencies: !c.isStandalone || t.imports != null && t.imports.length > 0 });
                dl++;
                try {
                    if (l.usesInheritance && PT(e), n = o.compileComponent(he, a, l), l.isStandalone) {
                        let u = Ve(t.imports || j), { directiveDefs: d, pipeDefs: f } = fx(e, u);
                        n.directiveDefs = d, n.pipeDefs = f, n.dependencies = () => u.map(z);
                    }
                }
                finally {
                    dl--;
                }
                if (dl === 0 && _T(), px(e)) {
                    let u = Vf(e.ngSelectorScope);
                    jf(n, u);
                }
                if (t.schemas)
                    if (l.isStandalone)
                        n.schemas = t.schemas;
                    else
                        throw new Error(`The 'schemas' was specified for the ${ke(e)} but is only valid on a component that is standalone.`);
                else
                    l.isStandalone && (n.schemas = []);
            }
            return n;
        }, set: o => { n = o; }, configurable: !1 });
}
function fx(e, t) { return { directiveDefs: () => Zo(e) ? [...Yn.getStandaloneComponentScope(e, t).compilation.directives].map(i => W(i) || Re(i)).filter(i => i !== null) : [], pipeDefs: () => Zo(e) ? [...Yn.getStandaloneComponentScope(e, t).compilation.pipes].map(i => Ye(i)).filter(i => i !== null) : [] }; }
function px(e) { return e.ngSelectorScope !== void 0; }
function Bf(e, t) { let n = null; OT(e, t || {}), Object.defineProperty(e, li, { get: () => { if (n === null) {
        let o = xT(e, t || {});
        n = Q({ usage: 0, kind: "directive", type: e }).compileDirective(he, o.sourceMapUrl, o.metadata);
    } return n; }, configurable: !1 }); }
function xT(e, t) { let n = e && e.name, o = `ng:///${n}/\u0275dir.js`, r = Q({ usage: 0, kind: "directive", type: e }), i = LT(e, t); return i.typeSourceSpan = r.createParseSourceSpan("Directive", n, o), i.usesInheritance && PT(e), { metadata: i, sourceMapUrl: o }; }
function OT(e, t) { let n = null; Object.defineProperty(e, Qe, { get: () => { if (n === null) {
        let o = xT(e, t), r = Q({ usage: 0, kind: "directive", type: e });
        n = r.compileFactory(he, `ng:///${e.name}/\u0275fac.js`, { name: o.metadata.name, type: o.metadata.type, typeArgumentCount: 0, deps: _r(e), target: r.FactoryTarget.Directive });
    } return n; }, configurable: !1 }); }
function hx(e) { return Object.getPrototypeOf(e.prototype) === Object.prototype; }
function LT(e, t) { let n = Mu(), o = n.ownPropMetadata(e); return { name: e.name, legacyOptionalChaining: !1, type: e, selector: t.selector !== void 0 ? t.selector : null, host: t.host || st, propMetadata: o, inputs: t.inputs || j, outputs: t.outputs || j, queries: Pg(e, o, FT), lifecycle: { usesOnChanges: n.hasLifecycleHook(e, "ngOnChanges") }, controlCreate: n.hasLifecycleHook(e, "\u0275ngControlCreate") ? { passThroughInput: null } : null, typeSourceSpan: null, usesInheritance: !hx(e), exportAs: vx(t.exportAs), providers: t.providers || null, viewQueries: Pg(e, o, HT), isStandalone: t.standalone === void 0 ? !0 : !!t.standalone, isSignal: !!t.signals, hostDirectives: t.hostDirectives?.map(r => typeof r == "function" ? { directive: r } : r) || null }; }
function PT(e) { let t = Object.prototype, n = Object.getPrototypeOf(e.prototype).constructor; for (; n && n !== t;)
    !Re(n) && !W(n) && Ex(n) && Bf(n, null), n = Object.getPrototypeOf(n); }
function gx(e) { return typeof e == "string" ? VT(e) : z(e); }
function mx(e, t) { return { propertyName: e, predicate: gx(t.selector), descendants: t.descendants, first: t.first, read: t.read ? t.read : null, static: !!t.static, emitDistinctChangesOnly: !!t.emitDistinctChangesOnly, isSignal: !!t.isSignal }; }
function Pg(e, t, n) { let o = [], r = []; for (let i in t)
    if (t.hasOwnProperty(i)) {
        let s = t[i];
        s.forEach(a => { if (n(a)) {
            if (!a.selector)
                throw new Error(`Can't construct a query for the property "${i}" of "${ke(e)}" since the query selector wasn't defined.`);
            if (s.some(jT))
                throw new Error("Cannot combine @Input decorators with query decorators");
            let c = mx(i, a);
            c.isSignal ? o.push(c) : r.push(c);
        } });
    } return [...o, ...r]; }
function vx(e) { return e === void 0 ? null : VT(e); }
function FT(e) { let t = e.ngMetadataName; return t === "ContentChild" || t === "ContentChildren"; }
function HT(e) { let t = e.ngMetadataName; return t === "ViewChild" || t === "ViewChildren"; }
function jT(e) { return e.ngMetadataName === "Input"; }
function VT(e) { return e.split(",").map(t => t.trim()); }
var yx = ["ngOnChanges", "ngOnInit", "ngOnDestroy", "ngDoCheck", "ngAfterViewInit", "ngAfterViewChecked", "ngAfterContentInit", "ngAfterContentChecked"];
function Ex(e) { let t = Mu(); if (yx.some(o => t.hasLifecycleHook(e, o)))
    return !0; let n = t.propMetadata(e); for (let o in n) {
    let r = n[o];
    for (let i = 0; i < r.length; i++) {
        let s = r[i], a = s.ngMetadataName;
        if (jT(s) || FT(s) || HT(s) || a === "Output" || a === "HostBinding" || a === "HostListener")
            return !0;
    }
} return !1; }
function BT(e, t) { let n = null, o = null; Object.defineProperty(e, Qe, { get: () => { if (o === null) {
        let r = Fg(e, t), i = Q({ usage: 0, kind: "pipe", type: r.type });
        o = i.compileFactory(he, `ng:///${r.name}/\u0275fac.js`, { name: r.name, type: r.type, typeArgumentCount: 0, deps: _r(e), target: i.FactoryTarget.Pipe });
    } return o; }, configurable: !1 }), Object.defineProperty(e, ui, { get: () => { if (n === null) {
        let r = Fg(e, t);
        n = Q({ usage: 0, kind: "pipe", type: r.type }).compilePipe(he, `ng:///${r.name}/\u0275pipe.js`, r);
    } return n; }, configurable: !1 }); }
function Fg(e, t) { return { type: e, name: e.name, pipeName: t.name, pure: t.pure !== void 0 ? t.pure : !0, isStandalone: t.standalone === void 0 ? !0 : !!t.standalone }; }
var UT = eo("Directive", (e = {}) => e, void 0, void 0, (e, t) => Bf(e, t)), Ix = eo("Component", (e = {}) => G({ changeDetection: bs.Eager }, e), UT, void 0, (e, t) => kT(e, t)), Dx = eo("Pipe", e => G({ pure: !0 }, e), void 0, void 0, (e, t) => BT(e, t)), Tx = ht("Input", e => e ? typeof e == "string" ? { alias: e } : e : {}), Cx = ht("Output", e => ({ alias: e })), Mx = ht("HostBinding", e => ({ hostPropertyName: e })), Nx = ht("HostListener", (e, t) => ({ eventName: e, args: t })), wx = eo("NgModule", e => e, void 0, void 0, (e, t) => AT(e, t));
var $T = (() => { class e {
    applicationErrorHandler = I(Qt);
    appRef = I(Se);
    taskService = I(St);
    ngZone = I(B);
    zonelessEnabled = I(kn);
    tracing = I(En, { optional: !0 });
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new AM;
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(xc) : null;
    scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (I(_i, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() { this.subscriptions.add(this.appRef.afterTick.subscribe(() => { let n = this.taskService.add(); if (!this.runningTick && (this.cleanup(), !this.zonelessEnabled || this.appRef.includeAllTestViews)) {
        this.taskService.remove(n);
        return;
    } this.switchToMicrotaskScheduler(), this.taskService.remove(n); })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => { this.runningTick || this.cleanup(); })); }
    switchToMicrotaskScheduler() { this.ngZone.runOutsideAngular(() => { let n = this.taskService.add(); this.useMicrotaskScheduler = !0, queueMicrotask(() => { this.useMicrotaskScheduler = !1, this.taskService.remove(n); }); }); }
    notify(n) { if (!this.zonelessEnabled && n === 5)
        return; switch (n) {
        case 0:
        case 2: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 3:
        case 4:
        case 5:
        case 1: {
            this.appRef.dirtyFlags |= 4;
            break;
        }
        case 6: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 12: {
            this.appRef.dirtyFlags |= 16;
            break;
        }
        case 13: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 11: break;
        default: this.appRef.dirtyFlags |= 8;
    } if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null, !this.shouldScheduleTick())
        return; let o = this.useMicrotaskScheduler ? ih : rh; this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick())); }
    shouldScheduleTick() { return !(this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(xc + this.angularZoneId)); }
    tick() { if (this.runningTick || this.appRef.destroyed)
        return; if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
    } !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1); let n = this.taskService.add(); try {
        this.ngZone.run(() => { this.runningTick = !0, this.appRef._tick(); }, void 0, this.schedulerTickApplyArgs);
    }
    catch (o) {
        this.applicationErrorHandler(o);
    }
    finally {
        this.taskService.remove(n), this.cleanup();
    } }
    ngOnDestroy() { this.subscriptions.unsubscribe(), this.cleanup(); }
    cleanup() { if (this.runningTick = !1, this.cancelScheduledCallback?.(), this.cancelScheduledCallback = null, this.pendingRenderTaskId !== null) {
        let n = this.pendingRenderTaskId;
        this.pendingRenderTaskId = null, this.taskService.remove(n);
    } }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = gt({ token: e, factory: e.\u0275fac });
} return e; })();
function Sx() { return K("NgZoneless"), Be([..._a(), []]); }
function _a() { return [{ provide: _t, useExisting: $T }, { provide: B, useClass: Oc }, { provide: kn, useValue: !0 }]; }
var _x = (() => { class e {
    compileModuleSync(n) { return new Kn(n); }
    compileModuleAsync(n) { return Promise.resolve(this.compileModuleSync(n)); }
    clearCache() { }
    clearCacheFor(n) { }
    getModuleId(n) { }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = gt({ token: e, factory: e.\u0275fac });
} return e; })(), GT = new b(""), Eu = class {
};
function bx() { return typeof ngI18nClosureMode < "u" && ngI18nClosureMode && typeof goog < "u" && goog.LOCALE !== "en" ? goog.LOCALE : typeof $localize < "u" && $localize.locale || Zr; }
var Uf = new b("", { factory: () => I(Uf, { optional: !0, skipSelf: !0 }) || bx() }), Ax = new b("", { factory: () => zR }), Rx = new b(""), kx = new b(""), zT = (function (e) { return e[e.Error = 0] = "Error", e[e.Warning = 1] = "Warning", e[e.Ignore = 2] = "Ignore", e; })(zT || {});
function Zi(e, t) { let n = e[m]; for (let o = E; o < n.bindingStartIndex; o++)
    if (Z(e[o])) {
        let r = e[o];
        if (!(o === n.bindingStartIndex - 1)) {
            let s = n.data[o], a = le(n, s);
            if (RE(a)) {
                t.push({ lContainer: r, lView: e, tNode: s, tDetails: a });
                continue;
            }
        }
        ee(r[V]) && Zi(r[V], t);
        for (let s = H; s < r.length; s++)
            Zi(r[s], t);
    }
    else
        ee(e[o]) && Zi(e[o], t); }
var Iu = class {
    name;
    callback;
    constructor(t, n) { this.name = t, this.callback = n; }
};
function xx(e) { return e.map(t => t.nativeElement); }
var Nr = class {
    nativeNode;
    constructor(t) { this.nativeNode = t; }
    get parent() { let t = this.nativeNode.parentNode; return t ? new gn(t) : null; }
    get injector() { return Su(this.nativeNode); }
    get componentInstance() { let t = this.nativeNode; return t && (Sh(t) || kN(t)); }
    get context() { return Sh(this.nativeNode) || RN(this.nativeNode); }
    get listeners() { return FN(this.nativeNode).filter(t => t.type === "dom"); }
    get references() { return LN(this.nativeNode); }
    get providerTokens() { return xN(this.nativeNode); }
}, gn = class extends Nr {
    constructor(t) { super(t); }
    get nativeElement() { return this.nativeNode.nodeType == Node.ELEMENT_NODE ? this.nativeNode : null; }
    get name() { let t = Ee(this.nativeNode), n = t ? t.lView : null; return n !== null ? n[m].data[t.nodeIndex].value : this.nativeNode.nodeName; }
    get properties() { let t = Ee(this.nativeNode), n = t ? t.lView : null; if (n === null)
        return {}; let o = n[m].data, r = o[t.nodeIndex], i = {}; return Ox(this.nativeElement, i), Px(i, r, n, o), i; }
    get attributes() { let t = {}, n = this.nativeElement; if (!n)
        return t; let o = Ee(n), r = o ? o.lView : null; if (r === null)
        return {}; let i = r[m].data[o.nodeIndex].attrs, s = []; if (i) {
        let a = 0;
        for (; a < i.length;) {
            let c = i[a];
            if (typeof c != "string")
                break;
            let l = i[a + 1];
            t[c] = l, s.push(c.toLowerCase()), a += 2;
        }
    } for (let a of n.attributes)
        s.includes(a.name) || (t[a.name] = a.value); return t; }
    get styles() { return this.nativeElement?.style ?? {}; }
    get classes() { let t = {}, o = this.nativeElement.className; return (typeof o != "string" ? o.baseVal.split(" ") : o.split(" ")).forEach(i => t[i] = !0), t; }
    get childNodes() { let t = this.nativeNode.childNodes, n = []; for (let o = 0; o < t.length; o++) {
        let r = t[o];
        n.push(wr(r));
    } return n; }
    get children() { let t = this.nativeElement; if (!t)
        return []; let n = t.children, o = []; for (let r = 0; r < n.length; r++) {
        let i = n[r];
        o.push(wr(i));
    } return o; }
    query(t) { return this.queryAll(t)[0] || null; }
    queryAll(t) { let n = []; return Hg(this, t, n, !0), n; }
    queryAllNodes(t) { let n = []; return Hg(this, t, n, !1), n; }
    triggerEventHandler(t, n) { let o = this.nativeNode, r = []; this.listeners.forEach(i => { if (i.name === t) {
        let s = i.callback;
        s.call(o, n), r.push(s);
    } }), typeof o.eventListeners == "function" && o.eventListeners(t).forEach(i => { if (i.toString().indexOf("__ngUnwrap__") !== -1) {
        let s = i("__ngUnwrap__");
        return r.indexOf(s) === -1 && s.call(o, n);
    } }); }
};
function Ox(e, t) { if (e) {
    let n = Object.getPrototypeOf(e), o = Node.prototype;
    for (; n !== null && n !== o;) {
        let r = Object.getOwnPropertyDescriptors(n);
        for (let i in r)
            if (!i.startsWith("__") && !i.startsWith("on")) {
                let s = e[i];
                Lx(s) && (t[i] = s);
            }
        n = Object.getPrototypeOf(n);
    }
} }
function Lx(e) { return typeof e == "string" || typeof e == "boolean" || typeof e == "number" || e === null; }
function Hg(e, t, n, o) { let r = Ee(e.nativeNode), i = r ? r.lView : null; if (i !== null) {
    let s = i[m].data[r.nodeIndex];
    Xt(s, i, t, n, o, e.nativeNode);
}
else
    $f(e.nativeNode, t, n, o); }
function Xt(e, t, n, o, r, i) { let s = Hp(e, t); if (e.type & 11) {
    if (fl(s, n, o, r, i), ve(e)) {
        let c = de(e.index, t);
        c && c[m].firstChild && Xt(c[m].firstChild, c, n, o, r, i);
    }
    else
        e.child && Xt(e.child, t, n, o, r, i), s && $f(s, n, o, r);
    let a = t[e.index];
    Z(a) && jg(a, n, o, r, i);
}
else if (e.type & 4) {
    let a = t[e.index];
    fl(a[Ue], n, o, r, i), jg(a, n, o, r, i);
}
else if (e.type & 16) {
    let a = t[X], l = a[ie].projection[e.projection];
    if (Array.isArray(l))
        for (let u of l)
            fl(u, n, o, r, i);
    else if (l) {
        let u = a[Y], d = u[m].data[l.index];
        Xt(d, u, n, o, r, i);
    }
}
else
    e.child && Xt(e.child, t, n, o, r, i); if (i !== s) {
    let a = e.flags & 2 ? e.projectionNext : e.next;
    a && Xt(a, t, n, o, r, i);
} }
function jg(e, t, n, o, r) { for (let i = H; i < e.length; i++) {
    let s = e[i], a = s[m].firstChild;
    a && Xt(a, s, t, n, o, r);
} }
function fl(e, t, n, o, r) { if (r !== e) {
    let i = wr(e);
    if (!i)
        return;
    (o && i instanceof gn && t(i) && n.indexOf(i) === -1 || !o && t(i) && n.indexOf(i) === -1) && n.push(i);
} }
function $f(e, t, n, o) { let r = e.childNodes, i = r.length; for (let s = 0; s < i; s++) {
    let a = r[s], c = wr(a);
    c && ((o && c instanceof gn && t(c) && n.indexOf(c) === -1 || !o && t(c) && n.indexOf(c) === -1) && n.push(c), $f(a, t, n, o));
} }
function Px(e, t, n, o) { let r = t.propertyBindings; if (r !== null)
    for (let i = 0; i < r.length; i++) {
        let s = r[i], c = o[s].split(nS), l = c[0];
        if (c.length > 1) {
            let u = c[1];
            for (let d = 1; d < c.length - 1; d++)
                u += N(n[s + d - 1]) + c[d + 1];
            e[l] = u;
        }
        else
            e[l] = n[s];
    } }
var pl = "__ng_debug__";
function wr(e) { return e instanceof Node ? (e.hasOwnProperty(pl) || (e[pl] = e.nodeType == Node.ELEMENT_NODE ? new gn(e) : new Nr(e)), e[pl]) : null; }
import { Subscription as mO } from "rxjs";
var Qf = { JSACTION: "__jsaction", OWNER: "__owner" }, YT = {};
function Fx(e) { return e[Qf.JSACTION]; }
function WT(e, t) { e[Qf.JSACTION] = t; }
function Hx(e) { return YT[e]; }
function jx(e, t) { YT[e] = t; }
var T = { CLICK: "click", CLICKMOD: "clickmod", DBLCLICK: "dblclick", FOCUS: "focus", FOCUSIN: "focusin", BLUR: "blur", FOCUSOUT: "focusout", SUBMIT: "submit", KEYDOWN: "keydown", KEYPRESS: "keypress", KEYUP: "keyup", MOUSEOVER: "mouseover", MOUSEOUT: "mouseout", MOUSEENTER: "mouseenter", MOUSELEAVE: "mouseleave", POINTEROVER: "pointerover", POINTEROUT: "pointerout", POINTERENTER: "pointerenter", POINTERLEAVE: "pointerleave", ERROR: "error", LOAD: "load", TOUCHSTART: "touchstart", TOUCHEND: "touchend", TOUCHMOVE: "touchmove", TOGGLE: "toggle" }, Vx = [T.MOUSEENTER, T.MOUSELEAVE, "pointerenter", "pointerleave"], Bx = [T.CLICK, T.DBLCLICK, T.FOCUSIN, T.FOCUSOUT, T.KEYDOWN, T.KEYUP, T.KEYPRESS, T.MOUSEOVER, T.MOUSEOUT, T.SUBMIT, T.TOUCHSTART, T.TOUCHEND, T.TOUCHMOVE, "touchcancel", "auxclick", "change", "compositionstart", "compositionupdate", "compositionend", "beforeinput", "input", "select", "copy", "cut", "paste", "mousedown", "mouseup", "wheel", "contextmenu", "dragover", "dragenter", "dragleave", "drop", "dragstart", "dragend", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout", "gotpointercapture", "lostpointercapture", "ended", "loadedmetadata", "pagehide", "pageshow", "visibilitychange", "beforematch"], ZT = [T.FOCUS, T.BLUR, T.ERROR, T.LOAD, T.TOGGLE], Oa = e => ZT.indexOf(e) >= 0, Ux = Bx.concat(ZT), KT = e => Ux.indexOf(e) >= 0;
function $x(e) { return e === T.MOUSEENTER ? T.MOUSEOVER : e === T.MOUSELEAVE ? T.MOUSEOUT : e === T.POINTERENTER ? T.POINTEROVER : e === T.POINTERLEAVE ? T.POINTEROUT : e; }
function Gx(e, t, n, o) { let r = !1; Oa(t) && (r = !0); let i = typeof o == "boolean" ? { capture: r, passive: o } : r; return e.addEventListener(t, n, i), { eventType: t, handler: n, capture: r, passive: o }; }
function zx(e, t) { if (e.removeEventListener) {
    let n = typeof t.passive == "boolean" ? { capture: t.capture } : t.capture;
    e.removeEventListener(t.eventType, t.handler, n);
}
else
    e.detachEvent && e.detachEvent(`on${t.eventType}`, t.handler); }
function Wx(e) { e.preventDefault ? e.preventDefault() : e.returnValue = !1; }
var qT = typeof navigator < "u" && /Macintosh/.test(navigator.userAgent);
function qx(e) { return e.which === 2 || e.which == null && e.button === 4; }
function Qx(e) { return qT && e.metaKey || !qT && e.ctrlKey || qx(e) || e.shiftKey; }
function Yx(e, t, n) { let o = e.relatedTarget; return (e.type === T.MOUSEOVER && t === T.MOUSEENTER || e.type === T.MOUSEOUT && t === T.MOUSELEAVE || e.type === T.POINTEROVER && t === T.POINTERENTER || e.type === T.POINTEROUT && t === T.POINTERLEAVE) && (!o || o !== n && !n.contains(o)); }
function Zx(e, t) { let n = {}; for (let o in e) {
    if (o === "srcElement" || o === "target")
        continue;
    let r = o, i = e[r];
    typeof i != "function" && (n[r] = i);
} return e.type === T.MOUSEOVER ? n.type = T.MOUSEENTER : e.type === T.MOUSEOUT ? n.type = T.MOUSELEAVE : e.type === T.POINTEROVER ? n.type = T.POINTERENTER : n.type = T.POINTERLEAVE, n.target = n.srcElement = t, n.bubbles = !1, n._originalEvent = e, n; }
var ka = class {
    element;
    handlerInfos = [];
    constructor(t) { this.element = t; }
    addEventListener(t, n, o) { this.handlerInfos.push(Gx(this.element, t, n(this.element), o)); }
    cleanUp() { for (let t = 0; t < this.handlerInfos.length; t++)
        zx(this.element, this.handlerInfos[t]); this.handlerInfos = []; }
}, Kx = { EVENT_ACTION_SEPARATOR: ":" };
function Ft(e) { return e.eventType; }
function Yf(e, t) { e.eventType = t; }
function Aa(e) { return e.event; }
function JT(e, t) { e.event = t; }
function XT(e) { return e.targetElement; }
function eC(e, t) { e.targetElement = t; }
function tC(e) { return e.eic; }
function Jx(e, t) { e.eic = t; }
function Xx(e) { return e.timeStamp; }
function eO(e, t) { e.timeStamp = t; }
function Ra(e) { return e.eia; }
function nC(e, t, n) { e.eia = [t, n]; }
function Gf(e) { e.eia = void 0; }
function ba(e) { return e[1]; }
function tO(e) { return e.eirp; }
function oC(e, t) { e.eirp = t; }
function rC(e) { return e.eir; }
function iC(e, t) { e.eir = t; }
function sC(e) { return { eventType: e.eventType, event: e.event, targetElement: e.targetElement, eic: e.eic, eia: e.eia, timeStamp: e.timeStamp, eirp: e.eirp, eiack: e.eiack, eir: e.eir }; }
function nO(e, t, n, o, r, i, s, a) { return { eventType: e, event: t, targetElement: n, eic: o, timeStamp: r, eia: i, eirp: s, eiack: a }; }
var zf = class e {
    eventInfo;
    constructor(t) { this.eventInfo = t; }
    getEventType() { return Ft(this.eventInfo); }
    setEventType(t) { Yf(this.eventInfo, t); }
    getEvent() { return Aa(this.eventInfo); }
    setEvent(t) { JT(this.eventInfo, t); }
    getTargetElement() { return XT(this.eventInfo); }
    setTargetElement(t) { eC(this.eventInfo, t); }
    getContainer() { return tC(this.eventInfo); }
    setContainer(t) { Jx(this.eventInfo, t); }
    getTimestamp() { return Xx(this.eventInfo); }
    setTimestamp(t) { eO(this.eventInfo, t); }
    getAction() { let t = Ra(this.eventInfo); if (t)
        return { name: t[0], element: t[1] }; }
    setAction(t) { if (!t) {
        Gf(this.eventInfo);
        return;
    } nC(this.eventInfo, t.name, t.element); }
    getIsReplay() { return tO(this.eventInfo); }
    setIsReplay(t) { oC(this.eventInfo, t); }
    getResolved() { return rC(this.eventInfo); }
    setResolved(t) { iC(this.eventInfo, t); }
    clone() { return new e(sC(this.eventInfo)); }
}, oO = {}, rO = /\s*;\s*/, iO = T.CLICK, Wf = class {
    a11yClickSupport = !1;
    clickModSupport = !0;
    syntheticMouseEventSupport;
    updateEventInfoForA11yClick = void 0;
    preventDefaultForA11yClick = void 0;
    populateClickOnlyAction = void 0;
    constructor({ syntheticMouseEventSupport: t = !1, clickModSupport: n = !0 } = {}) { this.syntheticMouseEventSupport = t, this.clickModSupport = n; }
    resolveEventType(t) { this.clickModSupport && Ft(t) === T.CLICK && Qx(Aa(t)) ? Yf(t, T.CLICKMOD) : this.a11yClickSupport && this.updateEventInfoForA11yClick(t); }
    resolveAction(t) { rC(t) || (this.populateAction(t, XT(t)), iC(t, !0)); }
    resolveParentAction(t) { let n = Ra(t), o = n && ba(n); Gf(t); let r = o && this.getParentNode(o); r && this.populateAction(t, r); }
    populateAction(t, n) { let o = n; for (; o && o !== tC(t) && (o.nodeType === Node.ELEMENT_NODE && this.populateActionOnElement(o, t), !Ra(t));)
        o = this.getParentNode(o); let r = Ra(t); if (r && (this.a11yClickSupport && this.preventDefaultForA11yClick(t), this.syntheticMouseEventSupport && (Ft(t) === T.MOUSEENTER || Ft(t) === T.MOUSELEAVE || Ft(t) === T.POINTERENTER || Ft(t) === T.POINTERLEAVE)))
        if (Yx(Aa(t), Ft(t), ba(r))) {
            let i = Zx(Aa(t), ba(r));
            JT(t, i), eC(t, ba(r));
        }
        else
            Gf(t); }
    getParentNode(t) { let n = t[Qf.OWNER]; if (n)
        return n; let o = t.parentNode; return o?.nodeName === "#document-fragment" ? o?.host ?? null : o; }
    populateActionOnElement(t, n) { let o = this.parseActions(t), r = o[Ft(n)]; r !== void 0 && nC(n, r, t), this.a11yClickSupport && this.populateClickOnlyAction(t, n, o); }
    parseActions(t) { let n = Fx(t); if (!n) {
        let o = t.getAttribute(xn.JSACTION);
        if (!o)
            n = oO, WT(t, n);
        else {
            if (n = Hx(o), !n) {
                n = {};
                let r = o.split(rO);
                for (let i = 0; i < r.length; i++) {
                    let s = r[i];
                    if (!s)
                        continue;
                    let a = s.indexOf(Kx.EVENT_ACTION_SEPARATOR), c = a !== -1, l = c ? s.substr(0, a).trim() : iO, u = c ? s.substr(a + 1).trim() : s;
                    n[l] = u;
                }
                jx(o, n);
            }
            WT(t, n);
        }
    } return n; }
    addA11yClickSupport(t, n, o) { this.a11yClickSupport = !0, this.updateEventInfoForA11yClick = t, this.preventDefaultForA11yClick = n, this.populateClickOnlyAction = o; }
}, aC = (function (e) { return e[e.I_AM_THE_JSACTION_FRAMEWORK = 0] = "I_AM_THE_JSACTION_FRAMEWORK", e; })(aC || {}), qf = class {
    dispatchDelegate;
    actionResolver;
    eventReplayer;
    eventReplayScheduled = !1;
    replayEventInfoWrappers = [];
    constructor(t, { actionResolver: n, eventReplayer: o } = {}) { this.dispatchDelegate = t, this.actionResolver = n, this.eventReplayer = o; }
    dispatch(t) { let n = new zf(t); this.actionResolver?.resolveEventType(t), this.actionResolver?.resolveAction(t); let o = n.getAction(); if (o && sO(o.element, n) && Wx(n.getEvent()), this.eventReplayer && n.getIsReplay()) {
        this.scheduleEventInfoWrapperReplay(n);
        return;
    } this.dispatchDelegate(n); }
    scheduleEventInfoWrapperReplay(t) { this.replayEventInfoWrappers.push(t), !this.eventReplayScheduled && (this.eventReplayScheduled = !0, Promise.resolve().then(() => { this.eventReplayScheduled = !1, this.eventReplayer(this.replayEventInfoWrappers); })); }
};
function sO(e, t) { return e.tagName === "A" && (t.getEventType() === T.CLICK || t.getEventType() === T.CLICKMOD); }
var cC = Symbol.for("propagationStopped"), Zf = { REPLAY: 101 };
var aO = "`preventDefault` called during event replay.";
var cO = "`composedPath` called during event replay.", xa = class {
    dispatchDelegate;
    clickModSupport;
    actionResolver;
    dispatcher;
    constructor(t, n = !0) { this.dispatchDelegate = t, this.clickModSupport = n, this.actionResolver = new Wf({ clickModSupport: n }), this.dispatcher = new qf(o => { this.dispatchToDelegate(o); }, { actionResolver: this.actionResolver }); }
    dispatch(t) { this.dispatcher.dispatch(t); }
    dispatchToDelegate(t) { for (t.getIsReplay() && dO(t), lO(t); t.getAction();) {
        if (fO(t), Oa(t.getEventType()) && t.getAction().element !== t.getTargetElement() || (this.dispatchDelegate(t.getEvent(), t.getAction().name), uO(t)))
            return;
        this.actionResolver.resolveParentAction(t.eventInfo);
    } }
};
function lO(e) { let t = e.getEvent(), n = e.getEvent().stopPropagation.bind(t), o = () => { t[cC] = !0, n(); }; Dn(t, "stopPropagation", o), Dn(t, "stopImmediatePropagation", o); }
function uO(e) { return !!e.getEvent()[cC]; }
function dO(e) { let t = e.getEvent(), n = e.getTargetElement(), o = t.preventDefault.bind(t); Dn(t, "target", n), Dn(t, "eventPhase", Zf.REPLAY), Dn(t, "preventDefault", () => { throw o(), new Error(aO + ""); }), Dn(t, "composedPath", () => { throw new Error(cO + ""); }); }
function fO(e) { let t = e.getEvent(), n = e.getAction()?.element; n && Dn(t, "currentTarget", n, { configurable: !0 }); }
function Dn(e, t, n, { configurable: o = !1 } = {}) { Object.defineProperty(e, t, { value: n, configurable: o }); }
function lC(e, t) { e.ecrd(n => { t.dispatch(n); }, aC.I_AM_THE_JSACTION_FRAMEWORK); }
function pO(e) { return e?.q ?? []; }
function hO(e) { e && (QT(e.c, e.et, e.h), QT(e.c, e.etc, e.h, !0)); }
function QT(e, t, n, o) { for (let r = 0; r < t.length; r++)
    e.removeEventListener(t[r], n, o); }
var gO = !1, uC = (() => { class e {
    static MOUSE_SPECIAL_SUPPORT = gO;
    containerManager;
    eventHandlers = {};
    browserEventTypeToExtraEventTypes = {};
    dispatcher = null;
    queuedEventInfos = [];
    constructor(n) { this.containerManager = n; }
    handleEvent(n, o, r) { let i = nO(n, o, o.target, r, Date.now()); this.handleEventInfo(i); }
    handleEventInfo(n) { if (!this.dispatcher) {
        oC(n, !0), this.queuedEventInfos?.push(n);
        return;
    } this.dispatcher(n); }
    addEvent(n, o, r) { if (n in this.eventHandlers || !this.containerManager || !e.MOUSE_SPECIAL_SUPPORT && Vx.indexOf(n) >= 0)
        return; let i = (a, c, l) => { this.handleEvent(a, c, l); }; this.eventHandlers[n] = i; let s = $x(o || n); if (s !== n) {
        let a = this.browserEventTypeToExtraEventTypes[s] || [];
        a.push(n), this.browserEventTypeToExtraEventTypes[s] = a;
    } this.containerManager.addEventListener(s, a => c => { i(n, c, a); }, r); }
    replayEarlyEvents(n = window._ejsa) { n && (this.replayEarlyEventInfos(n.q), hO(n), delete window._ejsa); }
    replayEarlyEventInfos(n) { for (let o = 0; o < n.length; o++) {
        let r = n[o], i = this.getEventTypesForBrowserEventType(r.eventType);
        for (let s = 0; s < i.length; s++) {
            let a = sC(r);
            Yf(a, i[s]), this.handleEventInfo(a);
        }
    } }
    getEventTypesForBrowserEventType(n) { let o = []; return this.eventHandlers[n] && o.push(n), this.browserEventTypeToExtraEventTypes[n] && o.push(...this.browserEventTypeToExtraEventTypes[n]), o; }
    handler(n) { return this.eventHandlers[n]; }
    cleanUp() { this.containerManager?.cleanUp(), this.containerManager = null, this.eventHandlers = {}, this.browserEventTypeToExtraEventTypes = {}, this.dispatcher = null, this.queuedEventInfos = []; }
    registerDispatcher(n, o) { this.ecrd(n, o); }
    ecrd(n, o) { if (this.dispatcher = n, this.queuedEventInfos?.length) {
        for (let r = 0; r < this.queuedEventInfos.length; r++)
            this.handleEventInfo(this.queuedEventInfos[r]);
        this.queuedEventInfos = null;
    } }
} return e; })();
function dC(e, t = window) { return pO(t._ejsas?.[e]); }
function Kf(e, t = window) { t._ejsas && (t._ejsas[e] = void 0); }
import "@angular/core/primitives/signals";
import "@angular/core/primitives/di";
import "rxjs/operators";
typeof globalThis.ngServerMode > "u" && (globalThis.ngServerMode = typeof window > "u");
var Ba = Symbol("InputSignalNode#UNSET"), RC = be(G({}, qa), { transformFn: void 0, applyValueToInputSignal(e, t) { Wa(e, t); } }), KP = Symbol();
function kC(e, t) { let n = Object.create(RC); n.value = e, n.transformFn = t?.transform; function o() { if (ni(n), n.value === Ba) {
    let r = null;
    throw new S(-950, r);
} return n.value; } return o[qe] = n, o; }
var vO = (function (e) { return e.Angular = "angular", e.ACX = "acx", e.Wiz = "wiz", e; })(vO || {}), fC = class {
    attributeName;
    constructor(t) { this.attributeName = t; }
    __NG_ELEMENT_ID__ = () => Ss(this.attributeName);
    toString() { return `HostAttributeToken ${this.attributeName}`; }
}, JP = (() => { let e = new b(""); return e.__NG_ELEMENT_ID__ = t => { let n = M(); if (n === null)
    throw new S(-204, !1); if (n.type & 2)
    return n.value; if (t & 8)
    return null; throw new S(-204, !1); }, e; })();
function yO(e) { return EO(e) ? e.default : e; }
function EO(e) { return e && typeof e == "object" && "default" in e; }
function XP(e, t) { let n = I(me), o = null, r = () => (o || (o = e()), o); return t?.prefetch && t.prefetch().then(() => r()).catch(() => { }), () => r().then(i => n.get(yO(i))); }
function e1(e) { let t = I(_s), { promise: n, resolve: o } = An(); return t.requestOnIdle(() => o(), e), n; }
var Tn = (function (e) { return e[e.Directive = 0] = "Directive", e[e.Component = 1] = "Component", e[e.Injectable = 2] = "Injectable", e[e.Pipe = 3] = "Pipe", e[e.NgModule = 4] = "NgModule", e[e.Service = 5] = "Service", e; })(Tn || {});
function t1(e) { return new Uc; }
function pC(e, t) { return kC(e, t); }
function IO(e) { return kC(Ba, e); }
var n1 = (pC.required = IO, pC);
function xC(e, t) { let n = Object.create(RC), o = new Uc; n.value = e; function r() { return ni(n), hC(n.value), n.value; } return r[qe] = n, r.asReadonly = sh.bind(r), r.set = i => { n.equal(n.value, i) || (Wa(n, i), o.emit(i)); }, r.update = i => { hC(n.value), r.set(i(n.value)); }, r.subscribe = o.subscribe.bind(o), r.destroyRef = o.destroyRef, r; }
function hC(e) { if (e === Ba)
    throw new S(952, !1); }
function gC(e, t) { return xC(e, t); }
function DO(e) { return xC(Ba, e); }
var o1 = (gC.required = DO, gC);
function mC(e, t) { return xd(t); }
function TO(e, t) { return Od(t); }
var r1 = (mC.required = TO, mC);
function i1(e, t) { return Ld(t); }
function vC(e, t) { return xd(t); }
function CO(e, t) { return Od(t); }
var s1 = (vC.required = CO, vC);
function a1(e, t) { return Ld(t); }
function c1(...e) { return e.reduce((t, n) => Object.assign(t, n, { providers: [...t.providers, ...n.providers] }), { providers: [] }); }
var OC = !0, Io = class {
}, l1 = ht("ContentChildren", (e, t = {}) => G({ selector: e, first: !1, isViewQuery: !1, descendants: !1, emitDistinctChangesOnly: OC }, t), Io), u1 = ht("ContentChild", (e, t = {}) => G({ selector: e, first: !0, isViewQuery: !1, descendants: !0 }, t), Io), d1 = ht("ViewChildren", (e, t = {}) => G({ selector: e, first: !1, isViewQuery: !0, descendants: !0, emitDistinctChangesOnly: OC }, t), Io), f1 = ht("ViewChild", (e, t) => G({ selector: e, first: !0, isViewQuery: !0, descendants: !0 }, t), Io), p1 = (() => { class e {
    constructor(n) { }
    static \u0275fac = function (o) { return new (o || e)(je(Se)); };
    static \u0275mod = Hd({ type: e });
    static \u0275inj = Co({});
} return e; })(), h1 = new b("", { providedIn: "platform", factory: () => null }), g1 = new b("", { providedIn: "platform", factory: () => null }), m1 = new b("", { providedIn: "platform", factory: () => null }), La = new WeakSet, yC = "";
function EC(e) { return e.get(Ls, xu); }
function MO() { let e = [{ provide: Ls, useFactory: () => { let t = !0; if (typeof ngServerMode > "u" || !ngServerMode) {
            let n = I(ct);
            t = !!window._ejsas?.[n];
        } return t && K("NgEventReplay"), t; } }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: Tt, useValue: () => { let t = I(Se), { injector: n } = t; if (!La.has(t)) {
        let o = I(Pr);
        if (EC(n)) {
            Lm();
            let r = n.get(ct), i = xm(r, (s, a, c) => { s.nodeType === Node.ELEMENT_NODE && (km(s, a, c), Pu(s, o)); });
            t.onDestroy(i);
        }
    } }, multi: !0 }, { provide: qr, useFactory: () => { let t = I(Se), { injector: n } = t; return () => { if (!EC(n) || La.has(t))
        return; La.add(t); let o = n.get(ct); t.onDestroy(() => { La.delete(t), typeof ngServerMode < "u" && !ngServerMode && Kf(o); }), t.whenStable().then(() => { if (t.destroyed)
        return; let r = n.get(Hu); NO(r, n); let i = n.get(Pr); i.get(yC)?.forEach(Fu), i.delete(yC); let s = r.instance; Fr(n) ? t.onDestroy(() => s.cleanUp()) : s.cleanUp(); }); }; }, multi: !0 }), e; }
var NO = (e, t) => { let n = t.get(ct), o = window._ejsas[n], r = e.instance = new uC(new ka(o.c)); for (let a of o.et)
    r.addEvent(a); for (let a of o.etc)
    r.addEvent(a); let i = dC(n); r.replayEarlyEventInfos(i), Kf(n); let s = new xa(a => { SO(t, a, a.currentTarget); }); lC(r, s); };
function wO(e, t, n) { let o = new Map, r = t[Ut], i = e.cleanup; if (!i || !r)
    return o; for (let s = 0; s < i.length;) {
    let a = i[s++], c = i[s++];
    if (typeof a != "string")
        continue;
    let l = a;
    if (!KT(l))
        continue;
    Oa(l) ? n.capture.add(l) : n.regular.add(l);
    let u = x(t[c]);
    s++;
    let d = i[s++];
    (typeof d == "boolean" || d >= 0) && (o.has(u) ? o.get(u).push(l) : o.set(u, [l]));
} return o; }
function SO(e, t, n) { let o = (n && n.getAttribute(so)) ?? ""; /d\d+/.test(o) ? _O(o, e, t, n) : t.eventPhase === Zf.REPLAY && ju(t, n); }
function _O(e, t, n, o) { let r = t.get(_m); r.push({ event: n, currentTarget: o }), It(t, e, bO(r)); }
function bO(e) { return t => { let n = new Set(t), o = []; for (let { event: r, currentTarget: i } of e) {
    let s = i.getAttribute(so);
    n.has(s) ? ju(r, i) : o.push({ event: r, currentTarget: i });
} e.length = 0, e.push(...o); }; }
var IC = !1, DC = !1, AO = 1e4;
function RO() { IC || (IC = !0, Vm(), _I(), yD(), bI(), SE(), Ky(), wy(), $v()); }
function kO() { DC || (DC = !0, FI(), vy(), Ty()); }
function xO(e) { return e.whenStable(); }
var v1 = "ngcm";
function y1() { let e = [{ provide: vn, useFactory: () => { let t = !0; return (typeof ngServerMode > "u" || !ngServerMode) && (t = !!I(Yt, { optional: !0 })?.get(Ps, null)), t && K("NgHydration"), t; } }, { provide: Tt, useValue: () => { if (Td(!1), typeof ngServerMode < "u" && ngServerMode)
            return; let t = I(Rn); I(vn) && (Qm(t), RO()); }, multi: !0 }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: Ru, useFactory: () => I(vn) }, { provide: qr, useFactory: () => { let t = I(_t); if (I(vn)) {
        let n = I(Se);
        return () => { xO(n).then(() => { n.destroyed || (Cd(n), t.notify(7)); }); };
    } return () => { }; }, multi: !0 }), Be(e); }
function E1() { return [{ provide: ku, useFactory: () => I(vn) }, { provide: Tt, useValue: () => { I(vn) && (kO(), Td(!0), K("NgI18nHydration")); }, multi: !0 }]; }
function I1() { let e = [MO(), { provide: Ou, useValue: !0 }, { provide: mt, useFactory: JD }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: qr, useFactory: () => { let t = I(me), n = I(Rn); return () => { XD(t, n); }; }, multi: !0 }), e; }
var TC = AO - 1e3, ep = class {
    openTasks = new Map;
    add(t) { this.openTasks.set(t, new Error("Task stack tracking error")); }
    remove(t) { this.openTasks.delete(t); }
};
function D1() { let e = new ep, { openTasks: t } = e; return Be([{ provide: oh, useValue: e }, mE(() => { console.warn("Stability debugging utility was provided in production mode. This will cause debug code to be included in production bundles. If this is intentional because you are debugging stability issues in a production environment, you can ignore this warning."); let n = I(B), o = I(Se), r = null; typeof Zone < "u" && n.run(() => { r = Zone.current.get("TaskTrackingZone"); }), n.runOutsideAngular(() => { let i = setTimeout(() => { if (console.debug(`---- Application did not stabilize within ${TC / 1e3} seconds ----`), typeof Zone < "u" && !r && console.info('Zone.js is present but no TaskTrackingZone found. To enable better debugging of tasks in the Angular Zone, import "zone.js/plugins/task-tracking" in your application.'), r?.macroTasks?.length) {
        console.group("Macrotasks keeping Angular Zone unstable:");
        for (let s of r?.macroTasks ?? [])
            console.debug(s.creationLocation.stack);
        console.groupEnd();
    } console.group("PendingTasks keeping application unstable:"); for (let s of t.values())
        console.debug(s.stack); console.groupEnd(); }, TC); o.whenStable().then(() => { clearTimeout(i); }); }); })]); }
var Pa = class {
    supports(t) { return vr(t); }
    create(t) { return new tp(t); }
}, OO = (e, t) => t, tp = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(t) { this._trackByFn = t || OO; }
    forEachItem(t) { let n; for (n = this._itHead; n !== null; n = n._next)
        t(n); }
    forEachOperation(t) { let n = this._itHead, o = this._removalsHead, r = 0, i = null; for (; n || o;) {
        let s = !o || n && n.currentIndex < CC(o, r, i) ? n : o, a = CC(s, r, i), c = s.currentIndex;
        if (s === o)
            r--, o = o._nextRemoved;
        else if (n = n._next, s.previousIndex == null)
            r++;
        else {
            i || (i = []);
            let l = a - r, u = c - r;
            if (l != u) {
                for (let f = 0; f < l; f++) {
                    let p = f < i.length ? i[f] : i[f] = 0, h = p + f;
                    u <= h && h < l && (i[f] = p + 1);
                }
                let d = s.previousIndex;
                i[d] = u - l;
            }
        }
        a !== c && t(s, a, c);
    } }
    forEachPreviousItem(t) { let n; for (n = this._previousItHead; n !== null; n = n._nextPrevious)
        t(n); }
    forEachAddedItem(t) { let n; for (n = this._additionsHead; n !== null; n = n._nextAdded)
        t(n); }
    forEachMovedItem(t) { let n; for (n = this._movesHead; n !== null; n = n._nextMoved)
        t(n); }
    forEachRemovedItem(t) { let n; for (n = this._removalsHead; n !== null; n = n._nextRemoved)
        t(n); }
    forEachIdentityChange(t) { let n; for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        t(n); }
    diff(t) { if (t == null && (t = []), !vr(t))
        throw new S(900, !1); return this.check(t) ? this : null; }
    onDestroy() { }
    check(t) { this._reset(); let n = this._itHead, o = !1, r, i, s; if (Array.isArray(t)) {
        this.length = t.length;
        for (let a = 0; a < this.length; a++)
            i = t[a], s = this._trackByFn(a, i), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, i, s, a), o = !0) : (o && (n = this._verifyReinsertion(n, i, s, a)), Object.is(n.item, i) || this._addIdentityChange(n, i)), n = n._next;
    }
    else
        r = 0, Ry(t, a => { s = this._trackByFn(r, a), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, a, s, r), o = !0) : (o && (n = this._verifyReinsertion(n, a, s, r)), Object.is(n.item, a) || this._addIdentityChange(n, a)), n = n._next, r++; }), this.length = r; return this._truncate(n), this.collection = t, this.isDirty; }
    get isDirty() { return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null; }
    _reset() { if (this.isDirty) {
        let t;
        for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
            t._nextPrevious = t._next;
        for (t = this._additionsHead; t !== null; t = t._nextAdded)
            t.previousIndex = t.currentIndex;
        for (this._additionsHead = this._additionsTail = null, t = this._movesHead; t !== null; t = t._nextMoved)
            t.previousIndex = t.currentIndex;
        this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null;
    } }
    _mismatch(t, n, o, r) { let i; return t === null ? i = this._itTail : (i = t._prev, this._remove(t)), t = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(o, null), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, r)) : (t = this._linkedRecords === null ? null : this._linkedRecords.get(o, r), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, r)) : t = this._addAfter(new np(n, o), i, r)), t; }
    _verifyReinsertion(t, n, o, r) { let i = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(o, null); return i !== null ? t = this._reinsertAfter(i, t._prev, r) : t.currentIndex != r && (t.currentIndex = r, this._addToMoves(t, r)), t; }
    _truncate(t) { for (; t !== null;) {
        let n = t._next;
        this._addToRemovals(this._unlink(t)), t = n;
    } this._unlinkedRecords !== null && this._unlinkedRecords.clear(), this._additionsTail !== null && (this._additionsTail._nextAdded = null), this._movesTail !== null && (this._movesTail._nextMoved = null), this._itTail !== null && (this._itTail._next = null), this._removalsTail !== null && (this._removalsTail._nextRemoved = null), this._identityChangesTail !== null && (this._identityChangesTail._nextIdentityChange = null); }
    _reinsertAfter(t, n, o) { this._unlinkedRecords !== null && this._unlinkedRecords.remove(t); let r = t._prevRemoved, i = t._nextRemoved; return r === null ? this._removalsHead = i : r._nextRemoved = i, i === null ? this._removalsTail = r : i._prevRemoved = r, this._insertAfter(t, n, o), this._addToMoves(t, o), t; }
    _moveAfter(t, n, o) { return this._unlink(t), this._insertAfter(t, n, o), this._addToMoves(t, o), t; }
    _addAfter(t, n, o) { return this._insertAfter(t, n, o), this._additionsTail === null ? this._additionsTail = this._additionsHead = t : this._additionsTail = this._additionsTail._nextAdded = t, t; }
    _insertAfter(t, n, o) { let r = n === null ? this._itHead : n._next; return t._next = r, t._prev = n, r === null ? this._itTail = t : r._prev = t, n === null ? this._itHead = t : n._next = t, this._linkedRecords === null && (this._linkedRecords = new Fa), this._linkedRecords.put(t), t.currentIndex = o, t; }
    _remove(t) { return this._addToRemovals(this._unlink(t)); }
    _unlink(t) { this._linkedRecords !== null && this._linkedRecords.remove(t); let n = t._prev, o = t._next; return n === null ? this._itHead = o : n._next = o, o === null ? this._itTail = n : o._prev = n, t; }
    _addToMoves(t, n) { return t.previousIndex === n || (this._movesTail === null ? this._movesTail = this._movesHead = t : this._movesTail = this._movesTail._nextMoved = t), t; }
    _addToRemovals(t) { return this._unlinkedRecords === null && (this._unlinkedRecords = new Fa), this._unlinkedRecords.put(t), t.currentIndex = null, t._nextRemoved = null, this._removalsTail === null ? (this._removalsTail = this._removalsHead = t, t._prevRemoved = null) : (t._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = t), t; }
    _addIdentityChange(t, n) { return t.item = n, this._identityChangesTail === null ? this._identityChangesTail = this._identityChangesHead = t : this._identityChangesTail = this._identityChangesTail._nextIdentityChange = t, t; }
}, np = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(t, n) { this.item = t, this.trackById = n; }
}, op = class {
    _head = null;
    _tail = null;
    add(t) { this._head === null ? (this._head = this._tail = t, t._nextDup = null, t._prevDup = null) : (this._tail._nextDup = t, t._prevDup = this._tail, t._nextDup = null, this._tail = t); }
    get(t, n) { let o; for (o = this._head; o !== null; o = o._nextDup)
        if ((n === null || n <= o.currentIndex) && Object.is(o.trackById, t))
            return o; return null; }
    remove(t) { let n = t._prevDup, o = t._nextDup; return n === null ? this._head = o : n._nextDup = o, o === null ? this._tail = n : o._prevDup = n, this._head === null; }
}, Fa = class {
    map = new Map;
    put(t) { let n = t.trackById, o = this.map.get(n); o || (o = new op, this.map.set(n, o)), o.add(t); }
    get(t, n) { let o = t, r = this.map.get(o); return r ? r.get(t, n) : null; }
    remove(t) { let n = t.trackById; return this.map.get(n).remove(t) && this.map.delete(n), t; }
    get isEmpty() { return this.map.size === 0; }
    clear() { this.map.clear(); }
};
function CC(e, t, n) { let o = e.previousIndex; if (o === null)
    return o; let r = 0; return n && o < n.length && (r = n[o]), o + t + r; }
var Ha = class {
    supports(t) { return t instanceof Map || ha(t); }
    create() { return new rp; }
}, rp = class {
    _records = new Map;
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    get isDirty() { return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null; }
    forEachItem(t) { let n; for (n = this._mapHead; n !== null; n = n._next)
        t(n); }
    forEachPreviousItem(t) { let n; for (n = this._previousMapHead; n !== null; n = n._nextPrevious)
        t(n); }
    forEachChangedItem(t) { let n; for (n = this._changesHead; n !== null; n = n._nextChanged)
        t(n); }
    forEachAddedItem(t) { let n; for (n = this._additionsHead; n !== null; n = n._nextAdded)
        t(n); }
    forEachRemovedItem(t) { let n; for (n = this._removalsHead; n !== null; n = n._nextRemoved)
        t(n); }
    diff(t) { if (!t)
        t = new Map;
    else if (!(t instanceof Map || ha(t)))
        throw new S(900, !1); return this.check(t) ? this : null; }
    check(t) { this._reset(); let n = this._mapHead; if (this._appendAfter = null, this._forEach(t, (o, r) => { if (n && n.key === r)
        this._maybeAddToChanges(n, o), this._appendAfter = n, n = n._next;
    else {
        let i = this._getOrCreateRecordForKey(r, o);
        n = this._insertBeforeOrAppend(n, i);
    } }), n) {
        n._prev && (n._prev._next = null), this._removalsHead = n;
        for (let o = n; o !== null; o = o._nextRemoved)
            o === this._mapHead && (this._mapHead = null), this._records.delete(o.key), o._nextRemoved = o._next, o.previousValue = o.currentValue, o.currentValue = null, o._prev = null, o._next = null;
    } return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty; }
    _insertBeforeOrAppend(t, n) { if (t) {
        let o = t._prev;
        return n._next = t, n._prev = o, t._prev = n, o && (o._next = n), t === this._mapHead && (this._mapHead = n), this._appendAfter = t, t;
    } return this._appendAfter ? (this._appendAfter._next = n, n._prev = this._appendAfter) : this._mapHead = n, this._appendAfter = n, null; }
    _getOrCreateRecordForKey(t, n) { if (this._records.has(t)) {
        let r = this._records.get(t);
        this._maybeAddToChanges(r, n);
        let i = r._prev, s = r._next;
        return i && (i._next = s), s && (s._prev = i), r._next = null, r._prev = null, r;
    } let o = new ip(t); return this._records.set(t, o), o.currentValue = n, this._addToAdditions(o), o; }
    _reset() { if (this.isDirty) {
        let t;
        for (this._previousMapHead = this._mapHead, t = this._previousMapHead; t !== null; t = t._next)
            t._nextPrevious = t._next;
        for (t = this._changesHead; t !== null; t = t._nextChanged)
            t.previousValue = t.currentValue;
        for (t = this._additionsHead; t != null; t = t._nextAdded)
            t.previousValue = t.currentValue;
        this._changesHead = this._changesTail = null, this._additionsHead = this._additionsTail = null, this._removalsHead = null;
    } }
    _maybeAddToChanges(t, n) { Object.is(n, t.currentValue) || (t.previousValue = t.currentValue, t.currentValue = n, this._addToChanges(t)); }
    _addToAdditions(t) { this._additionsHead === null ? this._additionsHead = this._additionsTail = t : (this._additionsTail._nextAdded = t, this._additionsTail = t); }
    _addToChanges(t) { this._changesHead === null ? this._changesHead = this._changesTail = t : (this._changesTail._nextChanged = t, this._changesTail = t); }
    _forEach(t, n) { t instanceof Map ? t.forEach(n) : Object.keys(t).forEach(o => n(t[o], o)); }
}, ip = class {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(t) { this.key = t; }
};
function MC() { return new LC([new Pa]); }
var LC = (() => { class e {
    factories;
    static \u0275prov = ae({ token: e, providedIn: "root", factory: MC });
    constructor(n) { this.factories = n; }
    static create(n, o) { if (o != null) {
        let r = o.factories.slice();
        n = n.concat(r);
    } return new e(n); }
    static extend(n) { return { provide: e, useFactory: () => { let o = I(e, { optional: !0, skipSelf: !0 }); return e.create(n, o || MC()); } }; }
    find(n) { let o = this.factories.find(r => r.supports(n)); if (o != null)
        return o; throw new S(901, !1); }
} return e; })();
function NC() { return new PC([new Ha]); }
var PC = (() => { class e {
    static \u0275prov = ae({ token: e, providedIn: "root", factory: NC });
    factories;
    constructor(n) { this.factories = n; }
    static create(n, o) { if (o) {
        let r = o.factories.slice();
        n = n.concat(r);
    } return new e(n); }
    static extend(n) { return { provide: e, useFactory: () => { let o = I(e, { optional: !0, skipSelf: !0 }); return e.create(n, o || NC()); } }; }
    find(n) { let o = this.factories.find(r => r.supports(n)); if (o)
        return o; throw new S(901, !1); }
} return e; })(), LO = (() => { class e {
    static __NG_ELEMENT_ID__ = PO;
} return e; })();
function PO(e) { return FO(M(), g(), (e & 16) === 16); }
function FO(e, t, n) { if (ve(e) && !n) {
    let o = de(e.index, t);
    return new Lt(o, o);
}
else if (e.type & 175) {
    let o = t[X];
    return new Lt(o, t);
} return null; }
var HO = [new Ha], jO = [new Pa], T1 = new LC(jO), C1 = new PC(HO);
function M1(e) { return Be([]); }
var VO = (() => { class e {
    zone = I(B);
    changeDetectionScheduler = I(_t);
    applicationRef = I(Se);
    applicationErrorHandler = I(Qt);
    _onMicrotaskEmptySubscription;
    initialize() { this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({ next: () => { this.changeDetectionScheduler.runningTick || this.zone.run(() => { try {
            this.applicationRef.dirtyFlags |= 1, this.applicationRef._tick();
        }
        catch (n) {
            this.applicationErrorHandler(n);
        } }); } })); }
    ngOnDestroy() { this._onMicrotaskEmptySubscription?.unsubscribe(); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = gt({ token: e, factory: e.\u0275fac });
} return e; })(), BO = new b("", { factory: () => !1 });
function UO({ ngZoneFactory: e, scheduleInRootZone: t }) { return e ??= () => new B(be(G({}, FC()), { scheduleInRootZone: t })), [{ provide: kn, useValue: !1 }, { provide: B, useFactory: e }, { provide: Tt, multi: !0, useFactory: () => { let n = I(VO, { optional: !0 }); return () => n.initialize(); } }, { provide: Tt, multi: !0, useFactory: () => { let n = I($O); return () => { n.initialize(); }; } }, { provide: _i, useValue: t ?? nh }]; }
function N1(e) { let t = e?.scheduleInRootZone, n = UO({ ngZoneFactory: () => { let o = FC(e); return o.scheduleInRootZone = t, o.shouldCoalesceEventChangeDetection && K("NgZone_CoalesceEvent"), new B(o); }, scheduleInRootZone: t }); return Be([{ provide: BO, useValue: !0 }, n]); }
function FC(e) { return { enableLongStackTrace: !1, shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1, shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1 }; }
var $O = (() => { class e {
    subscription = new mO;
    initialized = !1;
    zone = I(B);
    pendingTasks = I(St);
    initialize() { if (this.initialized)
        return; this.initialized = !0; let n = null; !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (n = this.pendingTasks.add()), this.zone.runOutsideAngular(() => { this.subscription.add(this.zone.onStable.subscribe(() => { B.assertNotInAngularZone(), queueMicrotask(() => { n !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(n), n = null); }); })); }), this.subscription.add(this.zone.onUnstable.subscribe(() => { B.assertInAngularZone(), n ??= this.pendingTasks.add(); })); }
    ngOnDestroy() { this.subscription.unsubscribe(); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = gt({ token: e, factory: e.\u0275fac });
} return e; })();
function GO(e, t, n) { let o = new Kn(n); return Promise.resolve(o); }
function wC(e) { for (let t = e.length - 1; t >= 0; t--)
    if (e[t] !== void 0)
        return e[t]; }
var ja = new b(""), zO = new b("");
function Xr(e) { return !e.moduleRef; }
function HC(e) { let t = Xr(e) ? e.r3Injector : e.moduleRef.injector, n = t.get(B); return n.run(() => { Xr(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers(); let o = t.get(Qt), r; if (n.runOutsideAngular(() => { r = n.onError.subscribe({ next: o }); }), Xr(e)) {
    let i = () => t.destroy(), s = e.platformInjector.get(ja);
    s.add(i), t.onDestroy(() => { r.unsubscribe(), s.delete(i); });
}
else {
    let i = () => e.moduleRef.destroy(), s = e.platformInjector.get(ja);
    s.add(i), e.moduleRef.onDestroy(() => { Jo(e.allPlatformModules, e.moduleRef), r.unsubscribe(), s.delete(i); });
} return qO(o, n, () => { let i = t.get(St), s = i.add(), a = t.get(Bd); return a.runInitializers(), a.donePromise.then(() => { let c = t.get(Uf, Zr); if (LI(c || Zr), !t.get(zO, !0))
    return Xr(e) ? t.get(Se) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef); if (Xr(e)) {
    let u = t.get(Se);
    return e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u;
}
else
    return jC?.(e.moduleRef, e.allPlatformModules), e.moduleRef; }).finally(() => { i.remove(s); }); }); }); }
var jC;
function SC() { jC = WO; }
function WO(e, t) { let n = e.injector.get(Se); if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach(o => n.bootstrap(o));
else if (e.instance.ngDoBootstrap)
    e.instance.ngDoBootstrap(n);
else
    throw new S(-403, !1); t.push(e); }
function qO(e, t, n) { try {
    let o = n();
    return Pd(o) ? o.catch(r => { throw t.runOutsideAngular(() => e(r)), r; }) : o;
}
catch (o) {
    throw t.runOutsideAngular(() => e(o)), o;
} }
var VC = (() => { class e {
    _injector;
    _modules = [];
    _destroyListeners = [];
    _destroyed = !1;
    constructor(n) { this._injector = n; }
    bootstrapModuleFactory(n, o) { let r = [_a(), ...o?.applicationProviders ?? [], Pc], i = aE(n.moduleType, this.injector, r); return SC(), HC({ moduleRef: i, allPlatformModules: this._modules, platformInjector: this.injector }); }
    bootstrapModule(n, o = []) { let r = Jd({}, o); return SC(), GO(this.injector, r, n).then(i => this.bootstrapModuleFactory(i, r)); }
    onDestroy(n) { this._destroyListeners.push(n); }
    get injector() { return this._injector; }
    destroy() { if (this._destroyed)
        throw new S(404, !1); this._modules.slice().forEach(o => o.destroy()), this._destroyListeners.forEach(o => o()); let n = this._injector.get(ja, null); n && (n.forEach(o => o()), n.clear()), this._destroyed = !0; }
    get destroyed() { return this._destroyed; }
    static \u0275fac = function (o) { return new (o || e)(je(me)); };
    static \u0275prov = ae({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })();
function BC(e) { let t = VE(e); if (t?.type === "null")
    return { name: "Null Injector", type: "null", providers: [], children: [] }; let n = []; if ((t?.type === "element" || t?.type === "environment") && (n = jE(e).map(o => ({ token: o.token, value: e.get(o.token, null, { optional: !0, self: !0 }) }))), t?.type === "element") {
    let o = Sr(e), r = o ? o.providerIndexes >> 20 : 0, i = n.slice(0, r), s = n.slice(r);
    return { name: e.constructor.name, type: "element", providers: s, viewProviders: i, children: [], hostElement: t.source };
} return { name: t?.source ?? e.constructor.name ?? "Unknown Injector", type: "environment", providers: n, children: [] }; }
var w1 = { name: "angular:di_graph", description: "\nExposes the Angular Dependency Injection (DI) graph of the application.\n\nThis tool extracts both the element injector tree (associated with DOM elements and components)\nand the environment injector tree (associated with modules and standalone application roots).\nIt captures the relationship structure and the providers resolved at each level.\n\nReturns:\n- `elementInjectorRoots`: An array of root element injectors (one for each Angular application\n  root found). Each node forms a tree hierarchy:\n  - `name`: The constructor name of this injector.\n  - `type`: 'element'.\n  - `providers`: Array of providers configured on this injector.\n    - `token`: The DI token.\n    - `value`: The resolved value of that provider if it was instantiated.\n  - `hostElement`: The DOM element that this injector is associated with.\n  - `children`: Array of child element injectors.\n- `environmentInjectorRoot`: The root environment injector. It forms a tree hierarchy of nodes\n  representing all environment injectors:\n  - `name`: The identifier for the environment injector.\n  - `type`: 'environment' or 'null'.\n  - `providers`: Array of providers configured on this injector.\n    - `token`: The DI token.\n    - `value`: The resolved value of that provider if it was instantiated.\n  - `children`: Array of child environment injectors.\n  ".trim(), inputSchema: { type: "object", properties: {} }, execute: () => Ae(null, null, function* () { let e = Array.from(document.querySelectorAll("[ng-version]")); if (e.length === 0)
        throw new Error("Could not find Angular root element ([ng-version]) on the page."); return QO(e); }) };
function QO(e) { let t = e.map(n => { let o = Ee(n); if (!o?.lView)
    throw new Error(`Could not find an \`LView\` for root \`<${n.tagName.toLowerCase()}>\`, is it an Angular component?`); return o.lView; }); return { elementInjectorRoots: t.map(n => YO(n)), environmentInjectorRoot: ZO(t) }; }
function YO(e) { if (e[m].type !== 0)
    throw new Error(`Expected a root LView but got type: \`${e[m].type}\`.`); let t = []; for (let [o, r] of wu(e)) {
    let i = new ye(o, r), s = BC(i);
    for (; t.length > 0;) {
        let [a, c, l] = t[t.length - 1], u = UC(o, a), d = KO(r, c, a);
        if (u || d) {
            l.children.push(s);
            break;
        }
        else
            t.pop();
    }
    t.push([o, r, s]);
} if (t.length === 0)
    throw new Error("Expected at least one component/directive in the root `LView`."); let [, , n] = t[0]; return n; }
function ZO(e) { let t = new Map, n; function o(r) { let i = t.get(r); if (i)
    return i; let s = BC(r); t.set(r, s); let a = JO(r); if (a)
    o(a).children.push(s);
else if (!n)
    n = s;
else if (n !== s)
    throw new Error("Expected only one root environment injector, but found multiple.", { cause: { firstRoot: n, secondRoot: s } }); return s; } for (let r of e)
    for (let [, i] of wu(r))
        o(i[R]); if (!n)
    throw new Error("Expected a root environment injector but did not find one."); return n; }
function UC(e, t) { let n = e; for (; n;) {
    if (n === t)
        return !0;
    n = n.parent;
} return !1; }
function KO(e, t, n) { let o = e, r = null; for (; o && o !== t;)
    r = o[ie], o = Je(o); return o === t && r !== null && UC(r, n); }
function JO(e) { if (e instanceof kt)
    return e.parentInjector; if (e instanceof Bt)
    return e.parent; if (e instanceof bo)
    return; throw new Error(`Unknown injector type: "${e.constructor.name}".`); }
var S1 = { name: "angular:signal_graph", description: "\nExposes the Angular signal dependency graph for a given DOM element.\n\nThis tool extracts the reactive dependency graph (signals, computeds, and effects) that\nare transitive dependencies of the effects of that element. It will include signals\nauthored in other components/services and depended upon by the target component, but\nwill *not* include signals only used in descendant components effects.\n\nParams:\n- `target`: The element to get the signal graph for. Must be the host element of an\n  Angular component.\n\nReturns:\n- `nodes`: An array of reactive nodes discovered in the context. Each node contains:\n  - `kind`: The type of reactive node ('signal', 'computed', 'effect', or 'template'\n    for component template effects).\n  - `value`: The current evaluated value of the node (if applicable).\n  - `label`: The symbol name of the associated signal if available (ex.\n    `const foo = signal(0);` has `label: 'foo'`).\n  - `epoch`: The internal version number of the node's value.\n- `edges`: An array of dependency links representing which nodes read from which other\n  nodes.\n  - `consumer`: The index in the `nodes` array of the node that depends on the value.\n  - `producer`: The index in the `nodes` array of the node that provides the value.\n\nExample: An edge with `{consumer: 2, producer: 0}` means that `nodes[2]` (e.g. an\n`effect`) reads the value of `nodes[0]` (e.g. a `signal`).\n  ".trim(), inputSchema: { type: "object", properties: { target: { type: "object", description: "The element to get the signal graph for.", "x-mcp-type": "HTMLElement" } }, required: ["target"] }, execute: t => Ae(null, [t], function* ({ target: e }) { if (!(e instanceof HTMLElement))
        throw new Error('Invalid input: "target" must be an HTMLElement.'); let n = Su(e); if (n instanceof bo)
        throw new Error('Invalid input: "target" is not the host element of an Angular component.'); let o = UE(n); return { nodes: o.nodes.map(a => { var c = a, { id: r, debuggableFn: i } = c, s = fp(c, ["id", "debuggableFn"]); return s; }), edges: o.edges }; }) };
var Eo = null;
function XO(e) { if (Ua())
    throw new S(400, !1); Kd(), Eo = typeof ngServerMode > "u" || !ngServerMode ? e : null; let t = e.get(VC); return GC(e), t; }
function eL(e, t, n = []) { let o = `Platform: ${t}`, r = new b(o); return (i = []) => { let s = Ua(); if (!s) {
    let a = [...n, ...i, { provide: r, useValue: !0 }];
    s = e?.(a) ?? XO($C(a, o));
} return typeof ngServerMode < "u" && ngServerMode ? s : tL(r); }; }
function $C(e = [], t) { return me.create({ name: t, providers: [{ provide: bp, useValue: "platform" }, { provide: ja, useValue: new Set([() => Eo = null]) }, ...e] }); }
function tL(e) { let t = Ua(); if (!t)
    throw new S(-401, !1); return t; }
function Ua() { return typeof ngServerMode < "u" && ngServerMode ? null : Eo?.get(VC) ?? null; }
function _1() { Ua()?.destroy(); }
function nL(e = []) { if (Eo)
    return Eo; let t = $C(e); return (typeof ngServerMode > "u" || !ngServerMode) && (Eo = t), Kd(), GC(t), t; }
function b1(e) { return { provide: Hc, useValue: e, multi: !0 }; }
function GC(e) { let t = e.get(Hc, null); Ao(e, () => { t?.forEach(n => n()); }); }
function A1(e) { let { rootComponent: t, appProviders: n, platformProviders: o, platformRef: r } = e; if (O(k.BootstrapApplicationStart), typeof ngServerMode < "u" && ngServerMode && !r)
    throw new S(-401, !1); try {
    let i = r?.injector ?? nL(o), s = [_a(), Pc, ...n || []], a = new yr({ providers: s, parent: i, debugName: "", runEnvironmentInitializers: !1 });
    return HC({ r3Injector: a.injector, platformInjector: i, rootComponent: t });
}
catch (i) {
    return Promise.reject(i);
}
finally {
    O(k.BootstrapApplicationEnd);
} }
var sp = class {
    views = [];
    indexByContent = new Map;
    add(t) { let n = JSON.stringify(t); if (!this.indexByContent.has(n)) {
        let o = this.views.length;
        return this.views.push(t), this.indexByContent.set(n, o), o;
    } return this.indexByContent.get(n); }
    getAll() { return this.views; }
}, oL = 0;
function zC(e) { return e.ssrId || (e.ssrId = `t${oL++}`), e.ssrId; }
function WC(e, t, n) { let o = []; return Qn(e, t, n, o), o.length; }
function rL(e) { let t = []; return sa(e, t), t.length; }
function qC(e, t) { let n = e[V]; return n && !n.hasAttribute(mn) ? Va(n, e, null, t) : null; }
function QC(e, t) { let n = Oo(e[V]), o = qC(n, t); if (o === null)
    return; let r = x(n[V]), i = e[Y], s = Va(r, i, null, t), a = n[C], c = `${o}|${s}`; a.setAttribute(r, Un, c); }
function R1(e, t) { let n = e.injector, o = yy(n), r = Fr(n), i = new sp, s = new Map, a = e._views, c = n.get(Ls, xu), l = { regular: new Set, capture: new Set }, u = new Map; e.injector.get(ct); for (let p of a) {
    let h = Vu(p);
    if (h !== null) {
        let v = { serializedViewCollection: i, corruptedTextNodes: s, isI18nHydrationEnabled: o, isIncrementalHydrationEnabled: r, i18nChildren: new Map, eventTypesToReplay: l, shouldReplayEvents: c, deferBlocks: u };
        Z(h) ? QC(h, v) : qC(h, v), lL(s, t);
    }
} let d = i.getAll(), f = n.get(Yt); if (f.set(Ps, d), u.size > 0) {
    let p = {};
    for (let [h, v] of u.entries())
        p[h] = v;
    f.set(Fs, p);
} return l; }
function iL(e, t, n, o, r) { let i = [], s = ""; for (let a = H; a < e.length; a++) {
    let c = e[a], l, u, d;
    if ($e(c) && (c = c[E], Z(c))) {
        u = rL(c) + 1, QC(c, r);
        let p = Oo(c[V]);
        d = { [ks]: p[m].ssrId, [ft]: u };
    }
    if (!d) {
        let p = c[m];
        p.type === 1 ? (l = p.ssrId, u = 1) : (l = zC(p), u = WC(p, c, p.firstChild)), d = { [ks]: l, [ft]: u };
        let h = !1;
        if (kE(n[m], t)) {
            let v = Ie(n, t), y = le(n[m], t);
            if (r.isIncrementalHydrationEnabled && y.hydrateTriggers !== null) {
                let D = `d${r.deferBlocks.size}`;
                y.hydrateTriggers.has(7) && (h = !0);
                let _ = [];
                sa(e, _);
                let ne = { [ft]: _.length, [Or]: v[Et] }, He = sL(y.hydrateTriggers);
                He.length > 0 && (ne[Lr] = He), o !== null && (ne[Au] = o), r.deferBlocks.set(D, ne);
                let _e = x(e);
                _e !== void 0 ? _e.nodeType === Node.COMMENT_NODE && _C(_e, D) : _C(_e, D), h || dL(y, _, D, r), o = D, d[Os] = D;
            }
            d[Or] = v[Et];
        }
        if (!h) {
            let v = x(c[V]);
            (c[m].type !== 1 || v === null || !v.hasAttribute(mn)) && Object.assign(d, YC(e[a], o, r));
        }
    }
    let f = JSON.stringify(d);
    if (i.length > 0 && f === s) {
        let p = i[i.length - 1];
        p[kr] ??= 1, p[kr]++;
    }
    else
        s = f, i.push(d);
} return i; }
function sL(e) { let t = new Set([0, 1, 2, 5]), n = []; for (let [o, r] of e)
    t.has(o) && (r === null ? n.push(o) : r.type === 5 ? n.push({ trigger: o, delay: r.delay }) : n.push({ trigger: o, intersectionObserverOptions: r.intersectionObserverOptions })); return n; }
function ei(e, t, n, o) { let r = t.index - E; e[xr] ??= {}, e[xr][r] ??= hy(t, n, o); }
function Jf(e, t) { let n = typeof t == "number" ? t : t.index - E; e[io] ??= [], e[io].includes(n) || e[io].push(n); }
function YC(e, t = null, n) { let o = {}, r = e[m], i = Ey(r, n), s = n.shouldReplayEvents ? wO(r, e, n.eventTypesToReplay) : null; for (let a = E; a < r.bindingStartIndex; a++) {
    let c = r.data[a], l = a - E, u = Iy(e, a, n);
    if (u) {
        o[xs] ??= {}, o[xs][l] = u.caseQueue;
        for (let d of u.disconnectedNodes)
            Jf(o, d);
        for (let d of u.disjointNodes) {
            let f = r.data[d + E];
            ei(o, f, e, i);
        }
        continue;
    }
    if (ws(c) && !ao(c)) {
        if (Z(e[a]) && c.tView && (o[Rs] ??= {}, o[Rs][l] = zC(c.tView)), ho(c, e) && uL(c)) {
            Jf(o, c);
            continue;
        }
        if (Array.isArray(c.projection)) {
            for (let d of c.projection)
                if (d)
                    if (!Array.isArray(d))
                        !uc(d) && !oo(d) && (ho(d, e) ? Jf(o, d) : ei(o, d, e, i));
                    else
                        throw iy(x(e[a]));
        }
        if (aL(o, c, e, i), Z(e[a])) {
            let d = e[a][V];
            if (Array.isArray(d)) {
                let f = x(d);
                f.hasAttribute(mn) || Va(f, d, t, n);
            }
            o[ro] ??= {}, o[ro][l] = iL(e[a], c, e, t, n);
        }
        else if (Array.isArray(e[a]) && !qg(c)) {
            let d = x(e[a][V]);
            d.hasAttribute(mn) || Va(d, e[a], t, n);
        }
        else if (c.type & 8)
            o[Rr] ??= {}, o[Rr][l] = WC(r, e, c.child);
        else if (c.type & 144) {
            let d = c.next;
            for (; d !== null && d.type & 144;)
                d = d.next;
            d && !oo(d) && ei(o, d, e, i);
        }
        else if (c.type & 1) {
            let d = x(e[a]);
            Uu(n, d);
        }
        if (s && c.type & 2) {
            let d = x(e[a]);
            s.has(d) && Lu(d, s.get(d), t);
        }
    }
} return o; }
function aL(e, t, n, o) { uc(t) || (t.projectionNext && t.projectionNext !== t.next && !oo(t.projectionNext) && ei(e, t.projectionNext, n, o), t.prev === null && t.parent !== null && ho(t.parent, n) && !ho(t, n) && ei(e, t, n, o)); }
function cL(e) { let t = e[P]; if (!t?.constructor)
    return !1; let n = W(t.constructor); return n?.encapsulation === Pe.ShadowDom || n?.encapsulation === Pe.ExperimentalIsolatedShadowDom; }
function Va(e, t, n, o) { let r = t[C]; if (kp(t) && !da() || cL(t))
    return r.setAttribute(e, mn, ""), null; {
    let i = YC(t, n, o), s = o.serializedViewCollection.add(i);
    return r.setAttribute(e, Un, s.toString()), s;
} }
function _C(e, t) { e.textContent = `ngh=${t}`; }
function lL(e, t) { for (let [n, o] of e)
    n.after(t.createComment(o)); }
function uL(e) { let t = e; for (; t != null;) {
    if (ve(t))
        return !0;
    t = t.parent;
} return !1; }
function dL(e, t, n, o) { let r = Wm(e.hydrateTriggers); for (let i of r)
    o.eventTypesToReplay.regular.add(i); if (r.length > 0) {
    let i = t.filter(s => s.nodeType === Node.ELEMENT_NODE);
    for (let s of i)
        Lu(s, r, n);
} }
function k1(e) { let t = g(); for (; t;) {
    if (t[m].type === 1 && e(t[P]))
        return t[P];
    if ($e(t))
        break;
    t = Je(t);
} return null; }
var fL = "\u{1F170}\uFE0F", $a = !1;
function x1(e) { if (!$a)
    return; let { startLabel: t } = ZC(e); performance.mark(t); }
function O1(e) { if (!$a)
    return; let { startLabel: t, labelName: n, endLabel: o } = ZC(e); performance.mark(o), performance.measure(n, t, o), performance.clearMarks(t), performance.clearMarks(o); }
function ZC(e) { let t = `${fL}:${e}`; return { labelName: t, startLabel: `start:${t}`, endLabel: `end:${t}` }; }
var bC = !1;
function L1() { if (!bC && (typeof performance > "u" || !performance.mark || !performance.measure)) {
    bC = !0, console.warn("Performance API is not supported on this platform");
    return;
} $a = !0; }
function P1() { $a = !1; }
function F1(e) { }
function H1(e) { return typeof e == "boolean" ? e : e != null && e !== "false"; }
function j1(e, t = NaN) { return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t; }
var Xf = Symbol("NOT_SET"), KC = new Set, pL = be(G({}, qa), { kind: "afterRenderEffectPhase", consumerIsAlwaysLive: !0, consumerAllowSignalWrites: !0, value: Xf, cleanup: null, consumerMarkedDirty() { if (this.sequence.impl.executing) {
        if (this.sequence.lastPhase === null || this.sequence.lastPhase < this.phase)
            return;
        this.sequence.erroredOrDestroyed = !0;
    } this.sequence.scheduler.notify(7); }, phaseFn(e) { if (this.sequence.lastPhase = this.phase, !this.dirty)
        return this.signal; if (this.dirty = !1, this.value !== Xf && !ri(this))
        return this.signal; try {
        for (let r of this.cleanup ?? KC)
            r();
    }
    finally {
        this.cleanup?.clear();
    } let t = []; e !== void 0 && t.push(e), t.push(this.registerCleanupFn); let n = Do(this), o; try {
        o = this.userFn.apply(null, t);
    }
    finally {
        oi(this, n);
    } return (this.value === Xf || !this.equal(this.value, o)) && (this.value = o, this.version++), this.signal; } }), ap = class extends dr {
    scheduler;
    lastPhase = null;
    nodes = [void 0, void 0, void 0, void 0];
    onDestroyFns = null;
    constructor(t, n, o, r, i, s = null) { super(t, [void 0, void 0, void 0, void 0], o, !1, i.get(qt), s), this.scheduler = r; for (let a of rd) {
        let c = n[a];
        if (c === void 0)
            continue;
        let l = Object.create(pL);
        l.sequence = this, l.phase = a, l.userFn = c, l.dirty = !0, l.signal = () => (ni(l), l.value), l.signal[qe] = l, l.registerCleanupFn = u => (l.cleanup ??= new Set).add(u), this.nodes[a] = l, this.hooks[a] = u => l.phaseFn(u);
    } }
    afterRun() { super.afterRun(), this.lastPhase = null; }
    destroy() { if (this.onDestroyFns !== null)
        for (let t of this.onDestroyFns)
            t(); super.destroy(); for (let t of this.nodes)
        if (t)
            try {
                for (let n of t.cleanup ?? KC)
                    n();
            }
            finally {
                To(t);
            } }
};
function V1(e, t) { if (typeof ngServerMode < "u" && ngServerMode)
    return Qs; let n = t?.injector ?? I(me), o = n.get(_t), r = n.get(qs), i = n.get(En, null, { optional: !0 }); r.impl ??= n.get(id); let s = e; typeof s == "function" && (s = { mixedReadWrite: e }); let a = n.get(Si, null, { optional: !0 }), c = new ap(r.impl, [s.earlyRead, s.write, s.mixedReadWrite, s.read], a?.view, o, n, i?.snapshot(null)); return r.impl.register(c), c; }
function B1(e) { return Q({ usage: 1, kind: "directive", type: e.type }).compileDirectiveDeclaration(he, `ng:///${e.type.name}/\u0275fac.js`, e); }
function U1(e) { jd(e.type, e.decorators, e.ctorParameters ?? null, e.propDecorators ?? null); }
function $1(e) { gE(e.type, e.resolveDeferredDeps, (...t) => { let n = e.resolveMetadata(...t); jd(e.type, n.decorators, n.ctorParameters, n.propDecorators); }); }
function G1(e) { return Q({ usage: 1, kind: "component", type: e.type }).compileComponentDeclaration(he, `ng:///${e.type.name}/\u0275cmp.js`, e); }
function z1(e) { return Q({ usage: 1, kind: hL(e.target), type: e.type }).compileFactoryDeclaration(he, `ng:///${e.type.name}/\u0275fac.js`, e); }
function hL(e) { switch (e) {
    case Tn.Directive: return "directive";
    case Tn.Component: return "component";
    case Tn.Injectable: return "injectable";
    case Tn.Pipe: return "pipe";
    case Tn.NgModule: return "NgModule";
    case Tn.Service: return "service";
} }
function W1(e) { return Q({ usage: 1, kind: "injectable", type: e.type }).compileInjectableDeclaration(he, `ng:///${e.type.name}/\u0275prov.js`, e); }
function q1(e) { return Q({ usage: 1, kind: "NgModule", type: e.type }).compileInjectorDeclaration(he, `ng:///${e.type.name}/\u0275inj.js`, e); }
function Q1(e) { return Q({ usage: 1, kind: "NgModule", type: e.type }).compileNgModuleDeclaration(he, `ng:///${e.type.name}/\u0275mod.js`, e); }
function Y1(e) { return Q({ usage: 1, kind: "pipe", type: e.type }).compilePipeDeclaration(he, `ng:///${e.type.name}/\u0275pipe.js`, e); }
function Z1(e) { return Q({ usage: 1, kind: "service", type: e.type }).compileServiceDeclaration(he, `ng:///${e.type.name}/\u0275prov.js`, e); }
function K1(e) { let t = $d(e); if (!t)
    throw JC(e); return new Kn(t); }
function J1(e) { let t = $d(e); if (!t)
    throw JC(e); return t; }
function JC(e) { return new S(920, !1); }
var cp = class extends LO {
}, AC = class extends cp {
}, X1 = eL(null, "core", []);
function eF(e, t) { let n = W(e), o = t.elementInjector || vi(); return new un(n).create(o, t.projectableNodes, t.hostElement, t.environmentInjector, t.directives, t.bindings); }
function tF(e) { let t = W(e); if (!t)
    return null; let n = new un(t); return { get selector() { return n.selector; }, get type() { return n.componentType; }, get inputs() { return n.inputs; }, get outputs() { return n.outputs; }, get ngContentSelectors() { return n.ngContentSelectors; }, get isStandalone() { return t.standalone; }, get isSignal() { return t.signals; } }; }
function gL(e) { return new lp(Vc(e) ? e : Zt(e)); }
var lp = class {
    snapshot;
    constructor(t) { this.snapshot = t; }
    get state() { return this.snapshot(); }
    value = Zt(() => { if (this.state.status === "error")
        throw new ph(this.state.error); return this.state.value; });
    status = Zt(() => this.state.status);
    error = Zt(() => this.state.status === "error" ? this.state.error : void 0);
    isLoading = Zt(() => this.state.status === "loading" || this.state.status === "reloading");
    isValueDefined = Zt(() => this.state.status !== "error" && this.state.value !== void 0);
    hasValue() { return this.isValueDefined(); }
};
function nF(e, t, n) { if (hh())
    throw gh(); let o = n?.injector ?? I(me), r, i; o.get(qt).onDestroy(() => { r = void 0; }); let s = fh({ source: () => { try {
        return Uo(!0), { value: e(), thrown: !1 };
    }
    catch (a) {
        return $c(a), { error: a, thrown: !0 };
    }
    finally {
        Uo(!1);
    } }, computation: (a, c) => c !== void 0 ? c.value : a.thrown ? { status: "error", error: a.error } : { status: "resolved", value: a.value } }); return uh(() => { let a; try {
    Uo(!0), a = e();
}
catch (f) {
    $c(f), s.set({ status: "error", error: f }), r = i = void 0;
    return;
}
finally {
    Uo(!1);
} let c = dh(s), l = n?.equal ?? Object.is; if (c.status === "reloading" || c.status === "loading") {
    if (l(a, i))
        return;
}
else if (c.status === "resolved" && l(a, c.value))
    return; let d = (typeof t == "number" ? () => new Promise(f => setTimeout(f, t)) : t)(a, c); d === void 0 ? (s.set({ status: "resolved", value: a }), r = i = void 0) : (c.status !== "loading" && c.status !== "error" && s.set({ status: "loading", value: c.value }), r = d, i = a, d.then(() => { r === d && (s.set({ status: "resolved", value: a }), r = i = void 0); })); }, { injector: o }), gL(s); }
function oF() { return !1; }
function rF() { }
function mL(e, t) { return Ae(this, null, function* () { if (typeof ngServerMode < "u" && ngServerMode)
    return; let n = globalThis.document.modelContext ?? globalThis.navigator.modelContext; if (!n || typeof n.registerTool != "function")
    return; let o = t ?? I(me), r = o.get(qt), i = new AbortController, s = be(G({}, e), { execute: (a, c) => Ao(o, () => e.execute(a, be(G({}, c), { signal: i.signal }))) }); r.onDestroy(() => { i.abort(); }), yield n.registerTool(s, { signal: i.signal }); }); }
function iF(e) { return Be([wp(() => { for (let t of e)
        mL(t); })]); }
export { gM as ANIMATION_MODULE_TYPE, qr as APP_BOOTSTRAP_LISTENER, ct as APP_ID, Vd as APP_INITIALIZER, Bd as ApplicationInitStatus, p1 as ApplicationModule, Se as ApplicationRef, dm as Attribute, GT as COMPILER_OPTIONS, mM as CSP_NONCE, gw as CUSTOM_ELEMENTS_SCHEMA, bs as ChangeDetectionStrategy, LO as ChangeDetectorRef, _x as Compiler, Eu as CompilerFactory, Ix as Component, by as ComponentRef, u1 as ContentChild, l1 as ContentChildren, Ax as DEFAULT_CURRENCY_CODE, Rn as DOCUMENT, gn as DebugElement, Iu as DebugEventListener, Nr as DebugNode, tp as DefaultIterableDiffer, qt as DestroyRef, UT as Directive, Tt as ENVIRONMENT_INITIALIZER, br as ElementRef, AC as EmbeddedViewRef, at as EnvironmentInjector, Lc as ErrorHandler, dM as EventEmitter, JP as HOST_TAG_NAME, um as Host, fC as HostAttributeToken, Mx as HostBinding, Nx as HostListener, ic as INJECTOR, sm as Inject, dN as Injectable, b as InjectionToken, me as Injector, Tx as Input, LC as IterableDiffers, PC as KeyValueDiffers, Uf as LOCALE_ID, Iv as MAX_ANIMATION_TIMEOUT, zT as MissingTranslationStrategy, mw as NO_ERRORS_SCHEMA, wx as NgModule, sE as NgModuleFactory, dn as NgModuleRef, B as NgZone, am as Optional, Cx as Output, Uc as OutputEmitterRef, hM as PLATFORM_ID, Hc as PLATFORM_INITIALIZER, Bc as PendingTasks, Dx as Pipe, VC as PlatformRef, Io as Query, rs as QueryList, h1 as REQUEST, m1 as REQUEST_CONTEXT, g1 as RESPONSE_INIT, fb as Renderer2, mr as RendererFactory2, ls as RendererStyleFlags2, CM as ResourceDependencyError, MM as ResourceParamsStatus, Ay as Sanitizer, q as SecurityContext, cm as Self, hN as Service, Ki as SimpleChange, lm as SkipSelf, Rx as TRANSLATIONS, kx as TRANSLATIONS_FORMAT, pr as TemplateRef, cR as Testability, WE as TestabilityRegistry, Yt as TransferState, im as Type, mp as VERSION, nM as Version, f1 as ViewChild, d1 as ViewChildren, ma as ViewContainerRef, Pe as ViewEncapsulation, cp as ViewRef, wv as afterEveryRender, sd as afterNextRender, V1 as afterRenderEffect, xx as asNativeElements, lM as assertInInjectionContext, EM as assertNotInReactiveContext, tL as assertPlatform, H1 as booleanAttribute, Zt as computed, s1 as contentChild, a1 as contentChildren, eF as createComponent, Fd as createEnvironmentInjector, rA as createNgModule, XO as createPlatform, eL as createPlatformFactory, nF as debounced, mL as declareExperimentalWebMcpTool, _1 as destroyPlatform, uh as effect, rF as enableProdMode, rR as enableProfiling, Za as forwardRef, wr as getDebugNode, K1 as getModuleFactory, J1 as getNgModuleById, Ua as getPlatform, cM as importProvidersFrom, I as inject, XP as injectAsync, n1 as input, Hy as inputBinding, oF as isDevMode, Vc as isSignal, No as isStandalone, bi as isWritableSignal, fh as linkedSignal, Be as makeEnvironmentProviders, ah as makeStateKey, c1 as mergeApplicationConfig, o1 as model, j1 as numberAttribute, e1 as onIdle, t1 as output, jy as outputBinding, X1 as platformCore, mE as provideAppInitializer, fM as provideBrowserGlobalErrorListeners, M1 as provideCheckNoChangesConfig, wp as provideEnvironmentInitializer, iF as provideExperimentalWebMcpTools, XM as provideIdleServiceWith, tS as provideNgReflectAttributes, b1 as providePlatformInitializer, D1 as provideStabilityDebugging, N1 as provideZoneChangeDetection, Sx as provideZonelessChangeDetection, tF as reflectComponentType, z as resolveForwardRef, NM as resource, gL as resourceFromSnapshots, Ao as runInInjectionContext, qE as setTestabilityGetter, Fc as signal, wb as twoWayBinding, dh as untracked, r1 as viewChild, i1 as viewChildren, Ev as \u0275ANIMATIONS_DISABLED, Cm as \u0275AcxChangeDetectionStrategy, Mm as \u0275AcxViewEncapsulation, qs as \u0275AfterRenderManager, TM as \u0275CACHE_ACTIVE, v1 as \u0275CLIENT_RENDER_MODE_FLAG, H as \u0275CONTAINER_HEADER_OFFSET, _t as \u0275ChangeDetectionScheduler, GA as \u0275Console, HE as \u0275ControlFlowBlockType, Zr as \u0275DEFAULT_LOCALE_ID, LE as \u0275DEFER_BLOCK_CONFIG, HA as \u0275DEFER_BLOCK_DEPENDENCY_INTERCEPTOR, mt as \u0275DEHYDRATED_BLOCK_REGISTRY, qd as \u0275DeferBlockBehavior, U as \u0275DeferBlockState, zO as \u0275ENABLE_ROOT_COMPONENT_BOOTSTRAP, _m as \u0275EVENT_REPLAY_QUEUE, jc as \u0275EffectScheduler, vO as \u0275Framework, Um as \u0275HydrationStatus, yM as \u0275IMAGE_CONFIG, vM as \u0275IMAGE_CONFIG_DEFAULTS, bp as \u0275INJECTOR_SCOPE, KP as \u0275INPUT_SIGNAL_BRAND_WRITE_TYPE, Qt as \u0275INTERNAL_APPLICATION_ERROR_HANDLER, UN as \u0275IS_ENABLED_BLOCKING_INITIAL_NAVIGATION, vn as \u0275IS_HYDRATION_DOM_REUSE_ENABLED, Ou as \u0275IS_INCREMENTAL_HYDRATION_ENABLED, Pr as \u0275JSACTION_BLOCK_ELEMENT_MAP, Hu as \u0275JSACTION_EVENT_CONTRACT, is as \u0275LContext, Tr as \u0275LocaleDataIndex, Mn as \u0275NG_COMP_DEF, li as \u0275NG_DIR_DEF, jt as \u0275NG_ELEMENT_ID, Xa as \u0275NG_INJ_DEF, ec as \u0275NG_MOD_DEF, ui as \u0275NG_PIPE_DEF, Cn as \u0275NG_PROV_DEF, qi as \u0275NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, F as \u0275NO_CHANGE, Kn as \u0275NgModuleFactory, Oc as \u0275NoopNgZone, fL as \u0275PERFORMANCE_MARK_PREFIX, BO as \u0275PROVIDED_NG_ZONE, IM as \u0275PROVIDED_ZONELESS, St as \u0275PendingTasksInternal, k as \u0275ProfilerEvent, Bt as \u0275R3Injector, os as \u0275ReflectionCapabilities, un as \u0275Render3ComponentFactory, vs as \u0275Render3ComponentRef, Zn as \u0275Render3NgModuleRef, wM as \u0275ResourceImpl, S as \u0275RuntimeError, Vy as \u0275SHARED_STYLES_HOST, qe as \u0275SIGNAL, Hm as \u0275SSR_CONTENT_INTEGRITY_MARKER, $E as \u0275TESTABILITY, GE as \u0275TESTABILITY_GETTER, OE as \u0275TimerScheduler, Ws as \u0275TracingAction, En as \u0275TracingService, zE as \u0275USE_PENDING_TASKS, Lt as \u0275ViewRef, ii as \u0275XSS_SECURITY_URL, kn as \u0275ZONELESS_ENABLED, sv as \u0275_sanitizeHtml, Bs as \u0275_sanitizeUrl, Ot as \u0275allLeavingAnimations, lo as \u0275allowSanitizationBypassAndThrow, R1 as \u0275annotateForHydration, F1 as \u0275assertType, Tw as \u0275bypassSanitizationTrustHtml, ww as \u0275bypassSanitizationTrustResourceUrl, Mw as \u0275bypassSanitizationTrustScript, Cw as \u0275bypassSanitizationTrustStyle, Nw as \u0275bypassSanitizationTrustUrl, _M as \u0275chain, pA as \u0275clearResolutionOfComponentResourcesQueue, kT as \u0275compileComponent, Bf as \u0275compileDirective, AT as \u0275compileNgModule, RT as \u0275compileNgModuleDefs, GO as \u0275compileNgModuleFactory, BT as \u0275compilePipe, nc as \u0275convertToBitFlags, uM as \u0275createInjector, nL as \u0275createOrReusePlatformInjector, T1 as \u0275defaultIterableDiffers, C1 as \u0275defaultKeyValueDiffers, Yn as \u0275depsTracker, ky as \u0275devModeEqual, P1 as \u0275disableProfiling, L1 as \u0275enableProfiling, SM as \u0275encapsulateResourceError, pf as \u0275findLocaleData, _T as \u0275flushModuleScopingQueueAsMuchAsPossible, vp as \u0275formatRuntimeError, ax as \u0275generateStandaloneInDeclarationsError, uA as \u0275getAsyncClassMetadataFn, mb as \u0275getClosestComponentName, W as \u0275getComponentDef, k1 as \u0275getCurrentClosestComponentInstance, Zi as \u0275getDeferBlocks, ON as \u0275getDirectives, Ar as \u0275getDocument, PN as \u0275getHostElement, rM as \u0275getInjectableDef, Ee as \u0275getLContext, VR as \u0275getLocaleCurrencyCode, RI as \u0275getLocalePluralCase, DM as \u0275getOutputDestroyRef, Xm as \u0275getSanitizationBypassType, iR as \u0275getTransferState, yw as \u0275getUnknownElementStrictMode, Iw as \u0275getUnknownPropertyStrictMode, Te as \u0275global, Wy as \u0275inferTagNameFromDefinition, PO as \u0275injectChangeDetectorRef, A1 as \u0275internalCreateApplication, UO as \u0275internalProvideZoneChangeDetection, fA as \u0275isComponentDefPendingResolution, aM as \u0275isEnvironmentProviders, hh as \u0275isInParamsFunction, iM as \u0275isInjectable, Jt as \u0275isNgModule, Pd as \u0275isPromise, iE as \u0275isSubscribable, h_ as \u0275isViewDirty, g_ as \u0275markForRefresh, yO as \u0275maybeUnwrapDefaultExport, rt as \u0275noSideEffects, jf as \u0275patchComponentDefWithScope, K as \u0275performanceMarkFeature, An as \u0275promiseWithResolvers, _a as \u0275provideZonelessChangeDetectionInternal, sR as \u0275publishNonCoreGlobalUtil, ew as \u0275readHydrationInfo, jR as \u0275registerLocaleData, ut as \u0275renderDeferBlockState, ux as \u0275resetCompiledComponents, nw as \u0275resetIncrementalHydrationEnabledWarnedForTests, ix as \u0275resetJitOptions, vE as \u0275resolveComponentResources, hA as \u0275restoreComponentResolutionQueue, vA as \u0275setAllowDuplicateNgModuleIdsForTest, bM as \u0275setAlternateWeakRefImpl, MT as \u0275setClassDebugInfo, jd as \u0275setClassMetadata, gE as \u0275setClassMetadataAsync, tM as \u0275setCurrentInjector, BN as \u0275setDocument, Uo as \u0275setInParamsFunction, sM as \u0275setInjectorProfilerContext, LI as \u0275setLocaleId, vw as \u0275setUnknownElementStrictMode, Ew as \u0275setUnknownPropertyStrictMode, x1 as \u0275startMeasuring, O1 as \u0275stopMeasuring, Lo as \u0275store, si as \u0275stringify, Vf as \u0275transitiveScopesFor, Ia as \u0275triggerResourceLoading, oM as \u0275truncateMiddle, BR as \u0275unregisterLocaleData, vt as \u0275unwrapSafeValue, pM as \u0275unwrapWritableSignal, y1 as \u0275withDomHydration, MO as \u0275withEventReplay, E1 as \u0275withI18nSupport, I1 as \u0275withIncrementalHydration, DE as \u0275\u0275ControlFeature, qD as \u0275\u0275ExternalStylesFeature, Tn as \u0275\u0275FactoryTarget, TE as \u0275\u0275HostDirectivesFeature, Gd as \u0275\u0275InheritDefinitionFeature, $g as \u0275\u0275NgOnChangesFeature, WD as \u0275\u0275ProvidersFeature, jv as \u0275\u0275advance, Xo as \u0275\u0275animateEnter, er as \u0275\u0275animateEnterListener, tr as \u0275\u0275animateLeave, Is as \u0275\u0275animateLeaveListener, ef as \u0275\u0275ariaProperty, $D as \u0275\u0275arrowFunction, kD as \u0275\u0275attachSourceLocations, tf as \u0275\u0275attribute, cD as \u0275\u0275classMap, wf as \u0275\u0275classProp, DI as \u0275\u0275componentInstance, CI as \u0275\u0275conditional, Da as \u0275\u0275conditionalBranchCreate, TI as \u0275\u0275conditionalCreate, Df as \u0275\u0275contentQuery, Cf as \u0275\u0275contentQuerySignal, Py as \u0275\u0275control, Oy as \u0275\u0275controlCreate, Hf as \u0275\u0275declareLet, JE as \u0275\u0275defer, FE as \u0275\u0275deferEnableTimerScheduling, nI as \u0275\u0275deferHydrateNever, hI as \u0275\u0275deferHydrateOnHover, iI as \u0275\u0275deferHydrateOnIdle, cI as \u0275\u0275deferHydrateOnImmediate, vI as \u0275\u0275deferHydrateOnInteraction, dI as \u0275\u0275deferHydrateOnTimer, II as \u0275\u0275deferHydrateOnViewport, tI as \u0275\u0275deferHydrateWhen, fI as \u0275\u0275deferOnHover, oI as \u0275\u0275deferOnIdle, sI as \u0275\u0275deferOnImmediate, gI as \u0275\u0275deferOnInteraction, lI as \u0275\u0275deferOnTimer, yI as \u0275\u0275deferOnViewport, pI as \u0275\u0275deferPrefetchOnHover, rI as \u0275\u0275deferPrefetchOnIdle, aI as \u0275\u0275deferPrefetchOnImmediate, mI as \u0275\u0275deferPrefetchOnInteraction, uI as \u0275\u0275deferPrefetchOnTimer, EI as \u0275\u0275deferPrefetchOnViewport, eI as \u0275\u0275deferPrefetchWhen, XE as \u0275\u0275deferWhen, cE as \u0275\u0275defineComponent, uE as \u0275\u0275defineDirective, ae as \u0275\u0275defineInjectable, Co as \u0275\u0275defineInjector, Hd as \u0275\u0275defineNgModule, dE as \u0275\u0275definePipe, gt as \u0275\u0275defineService, mo as \u0275\u0275directiveInject, mc as \u0275\u0275disableBindings, rf as \u0275\u0275domElement, lf as \u0275\u0275domElementContainer, cf as \u0275\u0275domElementContainerEnd, wa as \u0275\u0275domElementContainerStart, Ma as \u0275\u0275domElementEnd, Ca as \u0275\u0275domElementStart, Ef as \u0275\u0275domListener, df as \u0275\u0275domProperty, Wd as \u0275\u0275domTemplate, of as \u0275\u0275element, af as \u0275\u0275elementContainer, Yr as \u0275\u0275elementContainerEnd, Na as \u0275\u0275elementContainerStart, Ta as \u0275\u0275elementEnd, Dr as \u0275\u0275elementStart, gc as \u0275\u0275enableBindings, eT as \u0275\u0275enableIncrementalHydrationRuntime, CT as \u0275\u0275getComponentDepsFactory, AI as \u0275\u0275getCurrentView, om as \u0275\u0275getInheritedFactory, NT as \u0275\u0275getReplaceMetadataURL, WI as \u0275\u0275i18n, QI as \u0275\u0275i18nApply, qI as \u0275\u0275i18nAttributes, gf as \u0275\u0275i18nEnd, mf as \u0275\u0275i18nExp, YI as \u0275\u0275i18nPostprocess, hf as \u0275\u0275i18nStart, je as \u0275\u0275inject, Ss as \u0275\u0275injectAttribute, xD as \u0275\u0275interpolate, OD as \u0275\u0275interpolate1, LD as \u0275\u0275interpolate2, PD as \u0275\u0275interpolate3, FD as \u0275\u0275interpolate4, HD as \u0275\u0275interpolate5, jD as \u0275\u0275interpolate6, VD as \u0275\u0275interpolate7, BD as \u0275\u0275interpolate8, UD as \u0275\u0275interpolateV, By as \u0275\u0275invalidFactory, fi as \u0275\u0275invalidFactoryDep, vf as \u0275\u0275listener, eD as \u0275\u0275loadQuery, kc as \u0275\u0275namespaceHTML, Rc as \u0275\u0275namespaceMathML, Ac as \u0275\u0275namespaceSVG, ZI as \u0275\u0275nextContext, U1 as \u0275\u0275ngDeclareClassMetadata, $1 as \u0275\u0275ngDeclareClassMetadataAsync, G1 as \u0275\u0275ngDeclareComponent, B1 as \u0275\u0275ngDeclareDirective, z1 as \u0275\u0275ngDeclareFactory, W1 as \u0275\u0275ngDeclareInjectable, q1 as \u0275\u0275ngDeclareInjector, Q1 as \u0275\u0275ngDeclareNgModule, Y1 as \u0275\u0275ngDeclarePipe, Z1 as \u0275\u0275ngDeclareService, mT as \u0275\u0275pipe, vT as \u0275\u0275pipeBind1, yT as \u0275\u0275pipeBind2, ET as \u0275\u0275pipeBind3, IT as \u0275\u0275pipeBind4, DT as \u0275\u0275pipeBindV, JI as \u0275\u0275projection, KI as \u0275\u0275projectionDef, nf as \u0275\u0275property, tT as \u0275\u0275pureFunction0, nT as \u0275\u0275pureFunction1, oT as \u0275\u0275pureFunction2, rT as \u0275\u0275pureFunction3, iT as \u0275\u0275pureFunction4, sT as \u0275\u0275pureFunction5, aT as \u0275\u0275pureFunction6, cT as \u0275\u0275pureFunction7, lT as \u0275\u0275pureFunction8, uT as \u0275\u0275pureFunctionV, tD as \u0275\u0275queryAdvance, XI as \u0275\u0275queryRefresh, RD as \u0275\u0275readContextLet, nD as \u0275\u0275reference, Ud as \u0275\u0275registerNgModuleType, SI as \u0275\u0275repeater, wI as \u0275\u0275repeaterCreate, NI as \u0275\u0275repeaterTrackByIdentity, MI as \u0275\u0275repeaterTrackByIndex, wT as \u0275\u0275replaceMetadata, Ec as \u0275\u0275resetView, Ju as \u0275\u0275resolveBody, mv as \u0275\u0275resolveDocument, gv as \u0275\u0275resolveWindow, yc as \u0275\u0275restoreView, qu as \u0275\u0275sanitizeHtml, $s as \u0275\u0275sanitizeResourceUrl, Zu as \u0275\u0275sanitizeScript, Qu as \u0275\u0275sanitizeStyle, Yu as \u0275\u0275sanitizeUrl, hv as \u0275\u0275sanitizeUrlOrResourceUrl, QD as \u0275\u0275setComponentScope, YD as \u0275\u0275setNgModuleScope, AD as \u0275\u0275storeLet, aD as \u0275\u0275styleMap, Nf as \u0275\u0275styleProp, yf as \u0275\u0275syntheticHostListener, ff as \u0275\u0275syntheticHostProperty, zd as \u0275\u0275template, TT as \u0275\u0275templateRefExtractor, mD as \u0275\u0275text, Sf as \u0275\u0275textInterpolate, Sa as \u0275\u0275textInterpolate1, _f as \u0275\u0275textInterpolate2, bf as \u0275\u0275textInterpolate3, Af as \u0275\u0275textInterpolate4, Rf as \u0275\u0275textInterpolate5, kf as \u0275\u0275textInterpolate6, xf as \u0275\u0275textInterpolate7, Of as \u0275\u0275textInterpolate8, Lf as \u0275\u0275textInterpolateV, fv as \u0275\u0275trustConstantHtml, pv as \u0275\u0275trustConstantResourceUrl, _D as \u0275\u0275twoWayBindingSet, Ff as \u0275\u0275twoWayListener, Pf as \u0275\u0275twoWayProperty, Ku as \u0275\u0275validateAttribute, Tf as \u0275\u0275viewQuery, Mf as \u0275\u0275viewQuerySignal };
/*! Bundled license information:

@angular/core/fesm2022/_attribute-chunk.mjs:
@angular/core/fesm2022/_debug_node-chunk.mjs:
@angular/core/fesm2022/primitives-event-dispatch.mjs:
@angular/core/fesm2022/core.mjs:
  (**
   * @license Angular v22.0.7
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
