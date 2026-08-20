import { a as w, b as D, c as T, d as M, e as y, f as ue, g as S } from "@nf-internal/chunk-E4H4WIO7";
import { a as P, e as I } from "@nf-internal/chunk-IQO3VMP7";
import { \u0275DomAdapter as de, \u0275setRootDomAdapter as fe, \u0275parseCookieValue as pe, \u0275getDOM as z, DOCUMENT as F, CommonModule as me, \u0275PLATFORM_BROWSER_ID as Ee } from "@angular/common";
import * as u from "@angular/core";
import { \u0275global as d, \u0275RuntimeError as he, InjectionToken as lt, ApplicationModule as ge, \u0275INJECTOR_SCOPE as Te, ErrorHandler as j, \u0275SHARED_STYLES_HOST as B, RendererFactory2 as ye, \u0275TESTABILITY_GETTER as A, NgZone as U, TestabilityRegistry as V, Testability as b, \u0275TESTABILITY as Se, \u0275internalCreateApplication as G, createPlatformFactory as ve, platformCore as _e, PLATFORM_ID as Re, PLATFORM_INITIALIZER as Ie, \u0275USE_PENDING_TASKS as we, \u0275resolveComponentResources as ut, \u0275setDocument as De } from "@angular/core";
var v = class e extends de {
    supportsDOMEvents = !0;
    static makeCurrent() { fe(new e); }
    onAndCancel(r, t, n, o) { return r.addEventListener(t, n, o), () => { r.removeEventListener(t, n, o); }; }
    dispatchEvent(r, t) { r.dispatchEvent(t); }
    remove(r) { r.remove(); }
    createElement(r, t) { return t = t || this.getDefaultDocument(), t.createElement(r); }
    createHtmlDocument() { return document.implementation.createHTMLDocument("fakeTitle"); }
    getDefaultDocument() { return document; }
    isElementNode(r) { return r.nodeType === Node.ELEMENT_NODE; }
    isShadowRoot(r) { return r instanceof DocumentFragment; }
    getGlobalEventTarget(r, t) { return t === "window" ? window : t === "document" ? r : t === "body" ? r.body : null; }
    getBaseHref(r) { let t = Me(); return t == null ? null : Ae(t); }
    resetBaseElement() { E = null; }
    getUserAgent() { return window.navigator.userAgent; }
    getCookie(r) { return pe(document.cookie, r); }
}, E = null;
function Me() { return E = E || document.head.querySelector("base"), E ? E.getAttribute("href") : null; }
function Ae(e) { return new URL(e, document.baseURI).pathname; }
var _ = class {
    addToWindow(r) { d.getAngularTestability = (n, o = !0) => { let i = r.findTestabilityInTree(n, o); if (i == null)
        throw new he(5103, !1); return i; }, d.getAllAngularTestabilities = () => r.getAllTestabilities(), d.getAllAngularRootElements = () => r.getAllRootElements(); let t = n => { let o = d.getAllAngularTestabilities(), i = o.length, a = function () { i--, i == 0 && n(); }; o.forEach(s => { s.whenStable(a); }); }; d.frameworkStabilizers || (d.frameworkStabilizers = []), d.frameworkStabilizers.push(t); }
    findTestabilityInTree(r, t, n) { if (t == null)
        return null; let o = r.getTestability(t); return o ?? (n ? z().isShadowRoot(t) ? this.findTestabilityInTree(r, t.host, !0) : this.findTestabilityInTree(r, t.parentElement, !0) : null); }
}, x = ["alt", "control", "meta", "shift"], be = { "\b": "Backspace", "	": "Tab", "\x7F": "Delete", "\x1B": "Escape", Del: "Delete", Esc: "Escape", Left: "ArrowLeft", Right: "ArrowRight", Up: "ArrowUp", Down: "ArrowDown", Menu: "ContextMenu", Scroll: "ScrollLock", Win: "OS" }, Ce = { alt: e => e.altKey, control: e => e.ctrlKey, meta: e => e.metaKey, shift: e => e.shiftKey }, Y = (() => { class e extends w {
    constructor(t) { super(t); }
    supports(t) { return e.parseEventName(t) != null; }
    addEventListener(t, n, o, i) { let a = e.parseEventName(n), s = e.eventCallback(a.fullKey, o, this.manager.getZone()); return this.manager.getZone().runOutsideAngular(() => z().onAndCancel(t, a.domEventName, s, i)); }
    static parseEventName(t) { let n = t.toLowerCase().split("."), o = n.shift(); if (n.length === 0 || !(o === "keydown" || o === "keyup"))
        return null; let i = e._normalizeKey(n.pop()), a = "", s = n.indexOf("code"); if (s > -1 && (n.splice(s, 1), a = "code."), x.forEach(H => { let k = n.indexOf(H); k > -1 && (n.splice(k, 1), a += H + "."); }), a += i, n.length != 0 || i.length === 0)
        return null; let m = {}; return m.domEventName = o, m.fullKey = a, m; }
    static matchEventFullKeyCode(t, n) { let o = be[t.key] || t.key, i = ""; return n.indexOf("code.") > -1 && (o = t.code, i = "code."), o == null || !o ? !1 : (o = o.toLowerCase(), o === " " ? o = "space" : o === "." && (o = "dot"), x.forEach(a => { if (a !== o) {
        let s = Ce[a];
        s(t) && (i += a + ".");
    } }), i += o, i === n); }
    static eventCallback(t, n, o) { return i => { e.matchEventFullKeyCode(i, t) && o.runGuarded(() => n(i)); }; }
    static _normalizeKey(t) { return t === "esc" ? "escape" : t; }
    static \u0275fac = function (n) { return new (n || e)(u.\u0275\u0275inject(F)); };
    static \u0275prov = u.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })();
function Oe(e, r, t) { return I(this, null, function* () { let n = P({ rootComponent: e }, K(r, t)); return G(n); }); }
function Ne(e, r) { return I(this, null, function* () { return G(K(e, r)); }); }
function K(e, r) { return { platformRef: r?.platformRef, appProviders: [...$, ...e?.providers ?? []], platformProviders: J }; }
function Le(e = {}) { return [...W, e?.usePendingTasksForStability !== void 0 ? { provide: we, useValue: e.usePendingTasksForStability ?? !1 } : []]; }
function He() { v.makeCurrent(); }
function ke() { return new j; }
function Pe() { return De(document), document; }
var J = [{ provide: Re, useValue: Ee }, { provide: Ie, useValue: He, multi: !0 }, { provide: F, useFactory: Pe }], Be = ve(_e, "browser", J);
var W = [{ provide: A, useClass: _ }, { provide: Se, useClass: b, deps: [U, V, A] }, { provide: b, useClass: b, deps: [U, V, A] }], $ = [{ provide: Te, useValue: "root" }, { provide: j, useFactory: ke }, { provide: T, useClass: D, multi: !0 }, { provide: T, useClass: Y, multi: !0 }, S, { provide: B, useClass: y }, { provide: y, useExisting: B }, M, { provide: ye, useExisting: S }, []], Ue = (() => { class e {
    constructor() { }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275mod = u.\u0275\u0275defineNgModule({ type: e });
    static \u0275inj = u.\u0275\u0275defineInjector({ providers: [...$, ...W], imports: [me, ge] });
} return e; })();
import { DOCUMENT as L, \u0275getDOM as re } from "@angular/common";
import { \u0275getDOM as jt } from "@angular/common";
import * as l from "@angular/core";
import { inject as R, \u0275global as q, ApplicationRef as oe, \u0275RuntimeError as C, makeEnvironmentProviders as Ve, \u0275CACHE_ACTIVE as X, APP_BOOTSTRAP_LISTENER as xe, \u0275withDomHydration as ze, \u0275withIncrementalHydration as ie, \u0275withEventReplay as Fe, \u0275withI18nSupport as je, ENVIRONMENT_INITIALIZER as vt, \u0275IS_ENABLED_BLOCKING_INITIAL_NAVIGATION as _t, \u0275Console as Rt, \u0275formatRuntimeError as It, SecurityContext as f, \u0275allowSanitizationBypassAndThrow as h, \u0275unwrapSafeValue as g, \u0275_sanitizeUrl as Ge, \u0275_sanitizeHtml as Ye, \u0275bypassSanitizationTrustHtml as Ke, \u0275bypassSanitizationTrustStyle as Je, \u0275bypassSanitizationTrustScript as We, \u0275bypassSanitizationTrustUrl as $e, \u0275bypassSanitizationTrustResourceUrl as qe, Version as Xe } from "@angular/core";
import { \u0275withHttpTransferCache as ae } from "@angular/common/http";
var At = (() => { class e {
    _doc = R(L);
    _dom = re();
    _cachedHead;
    addTag(t, n = !1) { return t ? this._getOrCreateElement(t, n) : null; }
    addTags(t, n = !1) { return t.filter(o => !!o).map(o => this._getOrCreateElement(o, n)); }
    getTag(t) { if (!t)
        return null; let n = this._doc.querySelector(Z(t)); return te(n) ? n : null; }
    getTags(t) { if (!t)
        return []; let n = this._doc.querySelectorAll(Z(t)); return n ? Array.from(n).filter(o => te(o)) : []; }
    updateTag(t, n) { n ??= ee(t); let o = this.getTag(n); return o ? (Q(t, o), o) : this._getOrCreateElement(t, !0); }
    removeTag(t) { this.removeTagElement(this.getTag(t)); }
    removeTagElement(t) { t && this._dom.remove(t); }
    _getOrCreateElement(t, n = !1) { if (!n) {
        let a = ee(t), s = this.getTags(a).filter(m => Qe(t, m))[0];
        if (s !== void 0)
            return s;
    } let o = this._dom.createElement("meta"); return Q(t, o), this._doc.getElementsByTagName("head")[0].appendChild(o), o; }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = l.\u0275\u0275defineService({ token: e, factory: e.\u0275fac });
} return e; })();
function Z(e) { return `meta[${e}]`; }
function Q(e, r) { Object.keys(e).forEach(t => r.setAttribute(se(t), e[t])); }
function ee(e) { let r = e.name ? "name" : "property"; return `${r}=${Ze(String(e[r]))}`; }
function Ze(e) { return `"${e.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`; }
function Qe(e, r) { return Object.keys(e).every(t => r.getAttribute(se(t)) === e[t]); }
function se(e) { return et[e] || e; }
function te(e) { return e?.nodeName.toLowerCase() === "meta"; }
var et = { httpEquiv: "http-equiv" }, bt = (() => { class e {
    _doc;
    constructor(t) { this._doc = t; }
    getTitle() { return this._doc.title; }
    setTitle(t) { this._doc.title = t || ""; }
    static \u0275fac = function (n) { return new (n || e)(l.\u0275\u0275inject(L)); };
    static \u0275prov = l.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })();
function ce(e, r) { if (typeof COMPILED > "u" || !COMPILED) {
    let t = q.ng = q.ng || {};
    t[e] = r;
} }
var O = class {
    msPerTick;
    numTicks;
    constructor(r, t) { this.msPerTick = r, this.numTicks = t; }
}, N = class {
    appRef;
    constructor(r) { this.appRef = r.injector.get(oe); }
    timeChangeDetection(r) { let t = r && r.record, n = "Change Detection"; t && "profile" in console && typeof console.profile == "function" && console.profile(n); let o = performance.now(), i = 0; for (; i < 5 || performance.now() - o < 500;)
        this.appRef.tick(), i++; let a = performance.now(); t && "profileEnd" in console && typeof console.profileEnd == "function" && console.profileEnd(n); let s = (a - o) / i; return console.log(`ran ${i} change detection cycles`), console.log(`${s.toFixed(2)} ms per check`), new O(s, i); }
}, le = "profiler";
function Ct(e) { return ce(le, new N(e)), e; }
function Ot() { ce(le, null); }
var ne = class {
    static all() { return () => !0; }
    static css(r) { return t => t.nativeElement != null ? tt(t.nativeElement, r) : !1; }
    static directive(r) { return t => t.providerTokens.indexOf(r) !== -1; }
};
function tt(e, r) { return re().isElementNode(e) ? e.matches && e.matches(r) || e.msMatchesSelector && e.msMatchesSelector(r) || e.webkitMatchesSelector && e.webkitMatchesSelector(r) : !1; }
var c = (function (e) { return e[e.NoHttpTransferCache = 0] = "NoHttpTransferCache", e[e.HttpTransferCacheOptions = 1] = "HttpTransferCacheOptions", e[e.I18nSupport = 2] = "I18nSupport", e[e.EventReplay = 3] = "EventReplay", e[e.IncrementalHydration = 4] = "IncrementalHydration", e[e.NoIncrementalHydration = 5] = "NoIncrementalHydration", e; })(c || {});
function p(e, r = [], t = {}) { return { \u0275kind: e, \u0275providers: r }; }
function Nt() { return p(c.NoHttpTransferCache); }
function Lt(e) { return p(c.HttpTransferCacheOptions, ae(e)); }
function Ht() { return p(c.I18nSupport, je()); }
function kt() { return p(c.EventReplay, Fe()); }
function Pt() { return p(c.IncrementalHydration, ie()); }
function Bt() { return p(c.NoIncrementalHydration); }
function Ut(...e) { let r = [], t = new Set; for (let { \u0275providers: o, \u0275kind: i } of e)
    t.add(i), o.length && r.push(o); let n = t.has(c.HttpTransferCacheOptions); return Ve([[], [], ze(), t.has(c.NoHttpTransferCache) || n ? [] : ae({}), t.has(c.NoIncrementalHydration) ? [] : ie(), r, { provide: X, useValue: { isActive: !0 } }, { provide: xe, multi: !0, useFactory: () => { let o = R(oe), i = R(X); return () => { o.whenStable().then(() => { i.isActive = !1; }); }; } }]); }
var nt = (() => { class e {
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = l.\u0275\u0275defineInjectable({ token: e, factory: function (n) { let o = null; return n ? o = new (n || e) : o = l.\u0275\u0275inject(rt), o; }, providedIn: "root" });
} return e; })(), rt = (() => { class e extends nt {
    _doc = R(L);
    sanitize(t, n) { if (n == null)
        return null; switch (t) {
        case f.NONE: return n;
        case f.HTML: return h(n, "HTML") ? g(n) : Ye(this._doc, String(n)).toString();
        case f.STYLE: return h(n, "Style") ? g(n) : n;
        case f.SCRIPT:
            if (h(n, "Script"))
                return g(n);
            throw new C(5200, !1);
        case f.URL: return h(n, "URL") ? g(n) : Ge(String(n));
        case f.RESOURCE_URL:
            if (h(n, "ResourceURL"))
                return g(n);
            throw new C(-5201, !1);
        default: throw new C(5202, !1);
    } }
    bypassSecurityTrustHtml(t) { return Ke(t); }
    bypassSecurityTrustStyle(t) { return Je(t); }
    bypassSecurityTrustScript(t) { return We(t); }
    bypassSecurityTrustUrl(t) { return $e(t); }
    bypassSecurityTrustResourceUrl(t) { return qe(t); }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = l.\u0275\u0275defineService({ token: e, factory: e.\u0275fac });
} return e; })(), Vt = new Xe("22.0.7");
export { Ue as BrowserModule, ne as By, nt as DomSanitizer, T as EVENT_MANAGER_PLUGINS, M as EventManager, w as EventManagerPlugin, c as HydrationFeatureKind, At as Meta, ue as REMOVE_STYLES_ON_COMPONENT_DESTROY, bt as Title, Vt as VERSION, Oe as bootstrapApplication, Ne as createApplication, Ot as disableDebugTools, Ct as enableDebugTools, Be as platformBrowser, Ut as provideClientHydration, Le as provideProtractorTestingSupport, kt as withEventReplay, Lt as withHttpTransferCacheOptions, Ht as withI18nSupport, Pt as withIncrementalHydration, Nt as withNoHttpTransferCache, Bt as withNoIncrementalHydration, v as \u0275BrowserDomAdapter, _ as \u0275BrowserGetTestability, D as \u0275DomEventsPlugin, S as \u0275DomRendererFactory2, rt as \u0275DomSanitizerImpl, Y as \u0275KeyEventsPlugin, y as \u0275SharedStylesHost, jt as \u0275getDOM };
/*! Bundled license information:

@angular/platform-browser/fesm2022/_browser-chunk.mjs:
@angular/platform-browser/fesm2022/platform-browser.mjs:
  (**
   * @license Angular v22.0.7
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
