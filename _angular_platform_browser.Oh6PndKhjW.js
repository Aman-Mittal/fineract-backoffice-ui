import { a as b, b as ne, e as F } from "@nf-internal/chunk-IQO3VMP7";
import { \u0275DomAdapter as Je, \u0275setRootDomAdapter as Xe, \u0275parseCookieValue as qe, \u0275getDOM as he, DOCUMENT as me, CommonModule as Qe, \u0275PLATFORM_BROWSER_ID as et } from "@angular/common";
import * as g from "@angular/core";
import { \u0275global as v, \u0275RuntimeError as tt, InjectionToken as tn, ApplicationModule as nt, \u0275INJECTOR_SCOPE as rt, ErrorHandler as ge, \u0275SHARED_STYLES_HOST as de, RendererFactory2 as ot, \u0275TESTABILITY_GETTER as J, NgZone as ue, TestabilityRegistry as fe, Testability as X, \u0275TESTABILITY as st, \u0275internalCreateApplication as ve, createPlatformFactory as it, platformCore as at, PLATFORM_ID as ct, PLATFORM_INITIALIZER as lt, \u0275USE_PENDING_TASKS as dt, \u0275resolveComponentResources as nn, \u0275setDocument as ut } from "@angular/core";
import { DOCUMENT as Y, \u0275getDOM as Ue } from "@angular/common";
import * as c from "@angular/core";
import { InjectionToken as K, \u0275RuntimeError as z, APP_ID as Z, CSP_NONCE as ie, PLATFORM_ID as xe, makeEnvironmentProviders as Be, ViewEncapsulation as E, \u0275SHARED_STYLES_HOST as Ve, \u0275TracingService as je, RendererStyleFlags2 as N, \u0275allLeavingAnimations as Fe } from "@angular/core";
var S = class {
    _doc;
    constructor(r) { this._doc = r; }
    manager;
}, _ = (() => { class n extends S {
    constructor(e) { super(e); }
    supports(e) { return !0; }
    addEventListener(e, t, o, s) { return e.addEventListener(t, o, s), () => this.removeEventListener(e, t, o, s); }
    removeEventListener(e, t, o, s) { return e.removeEventListener(t, o, s); }
    static \u0275fac = function (t) { return new (t || n)(c.\u0275\u0275inject(Y)); };
    static \u0275prov = c.\u0275\u0275defineInjectable({ token: n, factory: n.\u0275fac });
} return n; })(), D = new K(""), k = (() => { class n {
    _zone;
    _plugins;
    _eventNameToPlugin = new Map;
    constructor(e, t) { this._zone = t, e.forEach(i => { i.manager = this; }); let o = e.filter(i => !(i instanceof _)); this._plugins = o.slice().reverse(); let s = e.find(i => i instanceof _); s && this._plugins.push(s); }
    addEventListener(e, t, o, s) { return this._findPluginFor(t).addEventListener(e, t, o, s); }
    getZone() { return this._zone; }
    _findPluginFor(e) { let t = this._eventNameToPlugin.get(e); if (t)
        return t; if (t = this._plugins.find(s => s.supports(e)), !t)
        throw new z(-5101, !1); return this._eventNameToPlugin.set(e, t), t; }
    static \u0275fac = function (t) { return new (t || n)(c.\u0275\u0275inject(D), c.\u0275\u0275inject(c.NgZone)); };
    static \u0275prov = c.\u0275\u0275defineInjectable({ token: n, factory: n.\u0275fac });
} return n; })(), L = "ng-app-id";
function re(n) { for (let r of n)
    r.remove(); }
function oe(n, r) { let e = r.createElement("style"); return e.textContent = n, e; }
function $e(n, r, e, t) { let o = n.head?.querySelectorAll(`style[${L}="${r}"],link[${L}="${r}"]`); if (!o || o.length === 0)
    return !1; for (let s of o)
    s.removeAttribute(L), s instanceof HTMLLinkElement ? t.set(s.href.slice(s.href.lastIndexOf("/") + 1), { usage: 0, elements: [s] }) : s.textContent && e.set(s.textContent, { usage: 0, elements: [s] }); return !0; }
function G(n, r) { let e = r.createElement("link"); return e.setAttribute("rel", "stylesheet"), e.setAttribute("href", n), e; }
var U = (() => { class n {
    doc;
    appId;
    nonce;
    inline = new Map;
    external = new Map;
    hosts = new Set;
    constructor(e, t, o, s = {}) { this.doc = e, this.appId = t, this.nonce = o, $e(e, t, this.inline, this.external) && this.hosts.add(e.head); }
    addStyles(e, t) { for (let o of e)
        this.addUsage(o, this.inline, oe); t?.forEach(o => this.addUsage(o, this.external, G)); }
    removeStyles(e, t) { for (let o of e)
        this.removeUsage(o, this.inline); t?.forEach(o => this.removeUsage(o, this.external)); }
    addUsage(e, t, o) { let s = t.get(e); s ? s.usage++ : t.set(e, { usage: 1, elements: [...this.hosts].map(i => this.addElement(i, o(e, this.doc))) }); }
    removeUsage(e, t) { let o = t.get(e); o && (o.usage--, o.usage <= 0 && (re(o.elements), t.delete(e))); }
    ngOnDestroy() { for (let [, { elements: e }] of [...this.inline, ...this.external])
        re(e); this.hosts.clear(); }
    addHost(e) { if (!this.hosts.has(e)) {
        this.hosts.add(e);
        for (let [t, { elements: o }] of this.inline)
            o.push(this.addElement(e, oe(t, this.doc)));
        for (let [t, { elements: o }] of this.external)
            o.push(this.addElement(e, G(t, this.doc)));
    } }
    removeHost(e) { this.hosts.delete(e); for (let t of [...this.inline.values(), ...this.external.values()]) {
        let o = [];
        for (let s of t.elements)
            s.parentNode === e ? s.remove() : o.push(s);
        t.elements = o;
    } }
    addElement(e, t) { return this.nonce && t.setAttribute("nonce", this.nonce), typeof ngServerMode < "u" && ngServerMode && t.setAttribute(L, this.appId), e.appendChild(t); }
    static \u0275fac = function (t) { return new (t || n)(c.\u0275\u0275inject(Y), c.\u0275\u0275inject(Z), c.\u0275\u0275inject(ie, 8), c.\u0275\u0275inject(xe)); };
    static \u0275prov = c.\u0275\u0275defineInjectable({ token: n, factory: n.\u0275fac });
} return n; })(), $ = { svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml", xlink: "http://www.w3.org/1999/xlink", xml: "http://www.w3.org/XML/1998/namespace", xmlns: "http://www.w3.org/2000/xmlns/", math: "http://www.w3.org/1998/Math/MathML" }, W = /%COMP%/g;
var ae = "%COMP%", ze = `_nghost-${ae}`, Ge = `_ngcontent-${ae}`, Ye = !0, ce = new K("", { factory: () => Ye }), x = new K("");
function Ke(n) { return Be([{ provide: x, useFactory: r => `${n ?? r}_`, deps: [Z] }]); }
function Ze(n) { return Ge.replace(W, n); }
function We(n) { return ze.replace(W, n); }
function le(n, r) { return r.map(e => e.replace(W, n)); }
var B = (() => { class n {
    eventManager;
    sharedStylesHost;
    appId;
    removeStylesOnCompDestroy;
    doc;
    ngZone;
    nonce;
    tracingService;
    rendererByCompId = new Map;
    defaultRenderer;
    cssVarNamespace;
    constructor(e, t, o, s, i, a, l = null, u = null, d = null) { this.eventManager = e, this.sharedStylesHost = t, this.appId = o, this.removeStylesOnCompDestroy = s, this.doc = i, this.ngZone = a, this.nonce = l, this.tracingService = u, this.cssVarNamespace = d ?? "", this.defaultRenderer = new M(e, i, a, this.tracingService, this.cssVarNamespace); }
    createRenderer(e, t) { if (!e || !t)
        return this.defaultRenderer; typeof ngServerMode < "u" && ngServerMode && (t.encapsulation === E.ShadowDom || t.encapsulation === E.ExperimentalIsolatedShadowDom) && (t = ne(b({}, t), { encapsulation: E.Emulated })); let o = this.getOrCreateRenderer(e, t); return o instanceof H ? o.applyToHost(e) : o instanceof R && o.applyStyles(), o; }
    getOrCreateRenderer(e, t) { let o = this.rendererByCompId, s = o.get(t.id); if (!s) {
        let i = this.doc, a = this.ngZone, l = this.eventManager, u = this.sharedStylesHost, d = this.removeStylesOnCompDestroy, h = this.tracingService;
        switch (t.encapsulation) {
            case E.Emulated:
                s = new H(l, u, t, this.appId, d, i, a, h, this.cssVarNamespace);
                break;
            case E.ShadowDom: return new P(l, e, t, i, a, this.nonce, h, this.cssVarNamespace, u);
            case E.ExperimentalIsolatedShadowDom: return new P(l, e, t, i, a, this.nonce, h, this.cssVarNamespace);
            default:
                s = new R(l, u, t, d, i, a, h, this.cssVarNamespace);
                break;
        }
        o.set(t.id, s);
    } return s; }
    ngOnDestroy() { this.rendererByCompId.clear(); }
    componentReplaced(e) { this.rendererByCompId.delete(e); }
    static \u0275fac = function (t) { return new (t || n)(c.\u0275\u0275inject(k), c.\u0275\u0275inject(Ve), c.\u0275\u0275inject(Z), c.\u0275\u0275inject(ce), c.\u0275\u0275inject(Y), c.\u0275\u0275inject(c.NgZone), c.\u0275\u0275inject(ie), c.\u0275\u0275inject(je, 8), c.\u0275\u0275inject(x, 8)); };
    static \u0275prov = c.\u0275\u0275defineInjectable({ token: n, factory: n.\u0275fac });
} return n; })(), M = class {
    eventManager;
    doc;
    ngZone;
    tracingService;
    cssVarNamespace;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(r, e, t, o, s = "") { this.eventManager = r, this.doc = e, this.ngZone = t, this.tracingService = o, this.cssVarNamespace = s; }
    destroy() { }
    destroyNode = null;
    createElement(r, e) { return e ? this.doc.createElementNS($[e] || e, r) : this.doc.createElement(r); }
    createComment(r) { return this.doc.createComment(r); }
    createText(r) { return this.doc.createTextNode(r); }
    appendChild(r, e) { (se(r) ? r.content : r).appendChild(e); }
    insertBefore(r, e, t) { r && (se(r) ? r.content : r).insertBefore(e, t); }
    removeChild(r, e) { e.remove(); }
    selectRootElement(r, e) { let t = typeof r == "string" ? this.doc.querySelector(r) : r; if (!t)
        throw new z(-5104, !1); return e || (t.textContent = ""), t; }
    parentNode(r) { return r.parentNode; }
    nextSibling(r) { return r.nextSibling; }
    setAttribute(r, e, t, o) { if (o) {
        e = o + ":" + e;
        let s = $[o];
        s ? r.setAttributeNS(s, e, t) : r.setAttribute(e, t);
    }
    else
        r.setAttribute(e, t); }
    removeAttribute(r, e, t) { if (t) {
        let o = $[t];
        o ? r.removeAttributeNS(o, e) : r.removeAttribute(`${t}:${e}`);
    }
    else
        r.removeAttribute(e); }
    addClass(r, e) { r.classList.add(e); }
    removeClass(r, e) { r.classList.remove(e); }
    setStyle(r, e, t, o) { let s = e.startsWith("--"); s && (e = e.replace("%NS%", this.cssVarNamespace)), s || o & (N.DashCase | N.Important) ? r.style.setProperty(e, t, o & N.Important ? "important" : "") : r.style[e] = t; }
    removeStyle(r, e, t) { let o = e.startsWith("--"); o && (e = e.replace("%NS%", this.cssVarNamespace)), o || t & N.DashCase ? r.style.removeProperty(e) : r.style[e] = ""; }
    setProperty(r, e, t) { r != null && (r[e] = t); }
    setValue(r, e) { r.nodeValue = e; }
    listen(r, e, t, o) { if (typeof r == "string" && (r = Ue().getGlobalEventTarget(this.doc, r), !r))
        throw new z(-5102, !1); let s = this.decoratePreventDefault(t); return this.tracingService?.wrapEventListener && (s = this.tracingService.wrapEventListener(r, e, s)), this.eventManager.addEventListener(r, e, s, o); }
    decoratePreventDefault(r) { return e => { if (e === "__ngUnwrap__")
        return r; (typeof ngServerMode < "u" && ngServerMode ? this.ngZone.runGuarded(() => r(e)) : r(e)) === !1 && e.preventDefault(); }; }
};
function se(n) { return n.tagName === "TEMPLATE" && n.content !== void 0; }
var P = class extends M {
    hostEl;
    sharedStylesHost;
    shadowRoot;
    constructor(r, e, t, o, s, i, a, l, u) { super(r, o, s, a, l), this.hostEl = e, this.sharedStylesHost = u, this.shadowRoot = e.attachShadow({ mode: "open" }), this.sharedStylesHost && this.sharedStylesHost.addHost(this.shadowRoot); let d = t.styles; d = le(t.id, d).map(m => m.replace(/%NS%/g, l)); for (let m of d) {
        let y = document.createElement("style");
        i && y.setAttribute("nonce", i), y.textContent = m, this.shadowRoot.appendChild(y);
    } let h = t.getExternalStyles?.(); if (h)
        for (let m of h) {
            let y = G(m, o);
            i && y.setAttribute("nonce", i), this.shadowRoot.appendChild(y);
        } }
    nodeOrShadowRoot(r) { return r === this.hostEl ? this.shadowRoot : r; }
    appendChild(r, e) { return super.appendChild(this.nodeOrShadowRoot(r), e); }
    insertBefore(r, e, t) { return super.insertBefore(this.nodeOrShadowRoot(r), e, t); }
    removeChild(r, e) { return super.removeChild(null, e); }
    parentNode(r) { return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(r))); }
    destroy() { this.sharedStylesHost && this.sharedStylesHost.removeHost(this.shadowRoot); }
}, R = class extends M {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(r, e, t, o, s, i, a, l, u) { super(r, s, i, a, l), this.sharedStylesHost = e, this.removeStylesOnCompDestroy = o; let d = t.styles, h = u ? le(u, d) : d; this.styles = h.map(m => m.replace(/%NS%/g, l)), this.styleUrls = t.getExternalStyles?.(u); }
    applyStyles() { this.sharedStylesHost.addStyles(this.styles, this.styleUrls); }
    destroy() { this.removeStylesOnCompDestroy && Fe.size === 0 && this.sharedStylesHost.removeStyles(this.styles, this.styleUrls); }
}, H = class extends R {
    contentAttr;
    hostAttr;
    constructor(r, e, t, o, s, i, a, l, u) { let d = o + "-" + t.id; super(r, e, t, s, i, a, l, u, d), this.contentAttr = Ze(d), this.hostAttr = We(d); }
    applyToHost(r) { this.applyStyles(), this.setAttribute(r, this.hostAttr, ""); }
    createElement(r, e) { let t = super.createElement(r, e); return super.setAttribute(t, this.contentAttr, ""), t; }
};
var V = class n extends Je {
    supportsDOMEvents = !0;
    static makeCurrent() { Xe(new n); }
    onAndCancel(r, e, t, o) { return r.addEventListener(e, t, o), () => { r.removeEventListener(e, t, o); }; }
    dispatchEvent(r, e) { r.dispatchEvent(e); }
    remove(r) { r.remove(); }
    createElement(r, e) { return e = e || this.getDefaultDocument(), e.createElement(r); }
    createHtmlDocument() { return document.implementation.createHTMLDocument("fakeTitle"); }
    getDefaultDocument() { return document; }
    isElementNode(r) { return r.nodeType === Node.ELEMENT_NODE; }
    isShadowRoot(r) { return r instanceof DocumentFragment; }
    getGlobalEventTarget(r, e) { return e === "window" ? window : e === "document" ? r : e === "body" ? r.body : null; }
    getBaseHref(r) { let e = ft(); return e == null ? null : pt(e); }
    resetBaseElement() { C = null; }
    getUserAgent() { return window.navigator.userAgent; }
    getCookie(r) { return qe(document.cookie, r); }
}, C = null;
function ft() { return C = C || document.head.querySelector("base"), C ? C.getAttribute("href") : null; }
function pt(n) { return new URL(n, document.baseURI).pathname; }
var j = class {
    addToWindow(r) { v.getAngularTestability = (t, o = !0) => { let s = r.findTestabilityInTree(t, o); if (s == null)
        throw new tt(5103, !1); return s; }, v.getAllAngularTestabilities = () => r.getAllTestabilities(), v.getAllAngularRootElements = () => r.getAllRootElements(); let e = t => { let o = v.getAllAngularTestabilities(), s = o.length, i = function () { s--, s == 0 && t(); }; o.forEach(a => { a.whenStable(i); }); }; v.frameworkStabilizers || (v.frameworkStabilizers = []), v.frameworkStabilizers.push(e); }
    findTestabilityInTree(r, e, t) { if (e == null)
        return null; let o = r.getTestability(e); return o ?? (t ? he().isShadowRoot(e) ? this.findTestabilityInTree(r, e.host, !0) : this.findTestabilityInTree(r, e.parentElement, !0) : null); }
}, pe = ["alt", "control", "meta", "shift"], ht = { "\b": "Backspace", "	": "Tab", "\x7F": "Delete", "\x1B": "Escape", Del: "Delete", Esc: "Escape", Left: "ArrowLeft", Right: "ArrowRight", Up: "ArrowUp", Down: "ArrowDown", Menu: "ContextMenu", Scroll: "ScrollLock", Win: "OS" }, mt = { alt: n => n.altKey, control: n => n.ctrlKey, meta: n => n.metaKey, shift: n => n.shiftKey }, ye = (() => { class n extends S {
    constructor(e) { super(e); }
    supports(e) { return n.parseEventName(e) != null; }
    addEventListener(e, t, o, s) { let i = n.parseEventName(t), a = n.eventCallback(i.fullKey, o, this.manager.getZone()); return this.manager.getZone().runOutsideAngular(() => he().onAndCancel(e, i.domEventName, a, s)); }
    static parseEventName(e) { let t = e.toLowerCase().split("."), o = t.shift(); if (t.length === 0 || !(o === "keydown" || o === "keyup"))
        return null; let s = n._normalizeKey(t.pop()), i = "", a = t.indexOf("code"); if (a > -1 && (t.splice(a, 1), i = "code."), pe.forEach(u => { let d = t.indexOf(u); d > -1 && (t.splice(d, 1), i += u + "."); }), i += s, t.length != 0 || s.length === 0)
        return null; let l = {}; return l.domEventName = o, l.fullKey = i, l; }
    static matchEventFullKeyCode(e, t) { let o = ht[e.key] || e.key, s = ""; return t.indexOf("code.") > -1 && (o = e.code, s = "code."), o == null || !o ? !1 : (o = o.toLowerCase(), o === " " ? o = "space" : o === "." && (o = "dot"), pe.forEach(i => { if (i !== o) {
        let a = mt[i];
        a(e) && (s += i + ".");
    } }), s += o, s === t); }
    static eventCallback(e, t, o) { return s => { n.matchEventFullKeyCode(s, e) && o.runGuarded(() => t(s)); }; }
    static _normalizeKey(e) { return e === "esc" ? "escape" : e; }
    static \u0275fac = function (t) { return new (t || n)(g.\u0275\u0275inject(me)); };
    static \u0275prov = g.\u0275\u0275defineInjectable({ token: n, factory: n.\u0275fac });
} return n; })();
function gt(n, r, e) { return F(this, null, function* () { let t = b({ rootComponent: n }, Ee(r, e)); return ve(t); }); }
function vt(n, r) { return F(this, null, function* () { return ve(Ee(n, r)); }); }
function Ee(n, r) { return { platformRef: r?.platformRef, appProviders: [...we, ...n?.providers ?? []], platformProviders: Se }; }
function yt(n = {}) { return [...Te, n?.usePendingTasksForStability !== void 0 ? { provide: dt, useValue: n.usePendingTasksForStability ?? !1 } : []]; }
function Et() { V.makeCurrent(); }
function St() { return new ge; }
function Tt() { return ut(document), document; }
var Se = [{ provide: ct, useValue: et }, { provide: lt, useValue: Et, multi: !0 }, { provide: me, useFactory: Tt }], wt = it(at, "browser", Se);
var Te = [{ provide: J, useClass: j }, { provide: st, useClass: X, deps: [ue, fe, J] }, { provide: X, useClass: X, deps: [ue, fe, J] }], we = [{ provide: rt, useValue: "root" }, { provide: ge, useFactory: St }, { provide: D, useClass: _, multi: !0 }, { provide: D, useClass: ye, multi: !0 }, B, { provide: de, useClass: U }, { provide: U, useExisting: de }, k, { provide: ot, useExisting: B }, []], _t = (() => { class n {
    constructor() { }
    static \u0275fac = function (t) { return new (t || n); };
    static \u0275mod = g.\u0275\u0275defineNgModule({ type: n });
    static \u0275inj = g.\u0275\u0275defineInjector({ providers: [...we, ...Te], imports: [Qe, nt] });
} return n; })();
import { DOCUMENT as te, \u0275getDOM as Oe } from "@angular/common";
import { \u0275getDOM as xn } from "@angular/common";
import * as p from "@angular/core";
import { inject as O, \u0275global as _e, ApplicationRef as be, \u0275RuntimeError as q, makeEnvironmentProviders as Mt, \u0275CACHE_ACTIVE as Me, APP_BOOTSTRAP_LISTENER as Rt, \u0275withDomHydration as Dt, \u0275withIncrementalHydration as Ne, \u0275withEventReplay as Ct, \u0275withI18nSupport as At, ENVIRONMENT_INITIALIZER as hn, \u0275IS_ENABLED_BLOCKING_INITIAL_NAVIGATION as mn, \u0275Console as gn, \u0275formatRuntimeError as vn, SecurityContext as T, \u0275allowSanitizationBypassAndThrow as A, \u0275unwrapSafeValue as I, \u0275_sanitizeUrl as It, \u0275_sanitizeHtml as Ot, \u0275bypassSanitizationTrustHtml as bt, \u0275bypassSanitizationTrustStyle as Nt, \u0275bypassSanitizationTrustScript as Lt, \u0275bypassSanitizationTrustUrl as Pt, \u0275bypassSanitizationTrustResourceUrl as Ht, Version as kt } from "@angular/core";
import { \u0275withHttpTransferCache as Le } from "@angular/common/http";
var wn = (() => { class n {
    _doc = O(te);
    _dom = Oe();
    _cachedHead;
    addTag(e, t = !1) { return e ? this._getOrCreateElement(e, t) : null; }
    addTags(e, t = !1) { return e.filter(o => !!o).map(o => this._getOrCreateElement(o, t)); }
    getTag(e) { if (!e)
        return null; let t = this._doc.querySelector(Re(e)); return Ae(t) ? t : null; }
    getTags(e) { if (!e)
        return []; let t = this._doc.querySelectorAll(Re(e)); return t ? Array.from(t).filter(o => Ae(o)) : []; }
    updateTag(e, t) { t ??= Ce(e); let o = this.getTag(t); return o ? (De(e, o), o) : this._getOrCreateElement(e, !0); }
    removeTag(e) { this.removeTagElement(this.getTag(e)); }
    removeTagElement(e) { e && this._dom.remove(e); }
    _getOrCreateElement(e, t = !1) { if (!t) {
        let i = Ce(e), a = this.getTags(i).filter(l => xt(e, l))[0];
        if (a !== void 0)
            return a;
    } let o = this._dom.createElement("meta"); return De(e, o), this._doc.getElementsByTagName("head")[0].appendChild(o), o; }
    static \u0275fac = function (t) { return new (t || n); };
    static \u0275prov = p.\u0275\u0275defineService({ token: n, factory: n.\u0275fac });
} return n; })();
function Re(n) { return `meta[${n}]`; }
function De(n, r) { Object.keys(n).forEach(e => r.setAttribute(Pe(e), n[e])); }
function Ce(n) { let r = n.name ? "name" : "property"; return `${r}=${Ut(String(n[r]))}`; }
function Ut(n) { return `"${n.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`; }
function xt(n, r) { return Object.keys(n).every(e => r.getAttribute(Pe(e)) === n[e]); }
function Pe(n) { return Bt[n] || n; }
function Ae(n) { return n?.nodeName.toLowerCase() === "meta"; }
var Bt = { httpEquiv: "http-equiv" }, _n = (() => { class n {
    _doc;
    constructor(e) { this._doc = e; }
    getTitle() { return this._doc.title; }
    setTitle(e) { this._doc.title = e || ""; }
    static \u0275fac = function (t) { return new (t || n)(p.\u0275\u0275inject(te)); };
    static \u0275prov = p.\u0275\u0275defineInjectable({ token: n, factory: n.\u0275fac, providedIn: "root" });
} return n; })();
function He(n, r) { if (typeof COMPILED > "u" || !COMPILED) {
    let e = _e.ng = _e.ng || {};
    e[n] = r;
} }
var Q = class {
    msPerTick;
    numTicks;
    constructor(r, e) { this.msPerTick = r, this.numTicks = e; }
}, ee = class {
    appRef;
    constructor(r) { this.appRef = r.injector.get(be); }
    timeChangeDetection(r) { let e = r && r.record, t = "Change Detection"; e && "profile" in console && typeof console.profile == "function" && console.profile(t); let o = performance.now(), s = 0; for (; s < 5 || performance.now() - o < 500;)
        this.appRef.tick(), s++; let i = performance.now(); e && "profileEnd" in console && typeof console.profileEnd == "function" && console.profileEnd(t); let a = (i - o) / s; return console.log(`ran ${s} change detection cycles`), console.log(`${a.toFixed(2)} ms per check`), new Q(a, s); }
}, ke = "profiler";
function Mn(n) { return He(ke, new ee(n)), n; }
function Rn() { He(ke, null); }
var Ie = class {
    static all() { return () => !0; }
    static css(r) { return e => e.nativeElement != null ? Vt(e.nativeElement, r) : !1; }
    static directive(r) { return e => e.providerTokens.indexOf(r) !== -1; }
};
function Vt(n, r) { return Oe().isElementNode(n) ? n.matches && n.matches(r) || n.msMatchesSelector && n.msMatchesSelector(r) || n.webkitMatchesSelector && n.webkitMatchesSelector(r) : !1; }
var Dn = (() => { class n {
    namespacePrefix = O(x, { optional: !0 }) ?? "";
    namespace(e) { return this.namespacePrefix ? `--${this.namespacePrefix}${e.substring(2)}` : e; }
    static \u0275fac = function (t) { return new (t || n); };
    static \u0275prov = p.\u0275\u0275defineService({ token: n, factory: n.\u0275fac });
} return n; })(), f = (function (n) { return n[n.NoHttpTransferCache = 0] = "NoHttpTransferCache", n[n.HttpTransferCacheOptions = 1] = "HttpTransferCacheOptions", n[n.I18nSupport = 2] = "I18nSupport", n[n.EventReplay = 3] = "EventReplay", n[n.IncrementalHydration = 4] = "IncrementalHydration", n[n.NoIncrementalHydration = 5] = "NoIncrementalHydration", n; })(f || {});
function w(n, r = [], e = {}) { return { \u0275kind: n, \u0275providers: r }; }
function Cn() { return w(f.NoHttpTransferCache); }
function An(n) { return w(f.HttpTransferCacheOptions, Le(n)); }
function In() { return w(f.I18nSupport, At()); }
function On() { return w(f.EventReplay, Ct()); }
function bn() { return w(f.IncrementalHydration, Ne()); }
function Nn() { return w(f.NoIncrementalHydration); }
function Ln(...n) { let r = [], e = new Set; for (let { \u0275providers: o, \u0275kind: s } of n)
    e.add(s), o.length && r.push(o); let t = e.has(f.HttpTransferCacheOptions); return Mt([[], [], Dt(), e.has(f.NoHttpTransferCache) || t ? [] : Le({}), e.has(f.NoIncrementalHydration) ? [] : Ne(), r, { provide: Me, useValue: { isActive: !0 } }, { provide: Rt, multi: !0, useFactory: () => { let o = O(be), s = O(Me); return () => { o.whenStable().then(() => { s.isActive = !1; }); }; } }]); }
var jt = (() => { class n {
    static \u0275fac = function (t) { return new (t || n); };
    static \u0275prov = p.\u0275\u0275defineInjectable({ token: n, factory: function (t) { let o = null; return t ? o = new (t || n) : o = p.\u0275\u0275inject(Ft), o; }, providedIn: "root" });
} return n; })(), Ft = (() => { class n extends jt {
    _doc = O(te);
    sanitize(e, t) { if (t == null)
        return null; switch (e) {
        case T.NONE: return t;
        case T.HTML: return A(t, "HTML") ? I(t) : Ot(this._doc, String(t)).toString();
        case T.STYLE: return A(t, "Style") ? I(t) : t;
        case T.SCRIPT:
            if (A(t, "Script"))
                return I(t);
            throw new q(5200, !1);
        case T.URL: return A(t, "URL") ? I(t) : It(String(t));
        case T.RESOURCE_URL:
            if (A(t, "ResourceURL"))
                return I(t);
            throw new q(-5201, !1);
        default: throw new q(5202, !1);
    } }
    bypassSecurityTrustHtml(e) { return bt(e); }
    bypassSecurityTrustStyle(e) { return Nt(e); }
    bypassSecurityTrustScript(e) { return Lt(e); }
    bypassSecurityTrustUrl(e) { return Pt(e); }
    bypassSecurityTrustResourceUrl(e) { return Ht(e); }
    static \u0275fac = function (t) { return new (t || n); };
    static \u0275prov = p.\u0275\u0275defineService({ token: n, factory: n.\u0275fac });
} return n; })(), Pn = new kt("22.1.0");
export { _t as BrowserModule, Ie as By, Dn as CssVarNamespacer, jt as DomSanitizer, D as EVENT_MANAGER_PLUGINS, k as EventManager, S as EventManagerPlugin, f as HydrationFeatureKind, wn as Meta, ce as REMOVE_STYLES_ON_COMPONENT_DESTROY, _n as Title, Pn as VERSION, gt as bootstrapApplication, vt as createApplication, Rn as disableDebugTools, Mn as enableDebugTools, wt as platformBrowser, Ln as provideClientHydration, Ke as provideCssVarNamespacing, yt as provideProtractorTestingSupport, On as withEventReplay, An as withHttpTransferCacheOptions, In as withI18nSupport, bn as withIncrementalHydration, Cn as withNoHttpTransferCache, Nn as withNoIncrementalHydration, V as \u0275BrowserDomAdapter, j as \u0275BrowserGetTestability, _ as \u0275DomEventsPlugin, B as \u0275DomRendererFactory2, Ft as \u0275DomSanitizerImpl, ye as \u0275KeyEventsPlugin, U as \u0275SharedStylesHost, xn as \u0275getDOM };
/*! Bundled license information:

@angular/platform-browser/fesm2022/_dom_renderer-chunk.mjs:
@angular/platform-browser/fesm2022/_browser-chunk.mjs:
@angular/platform-browser/fesm2022/platform-browser.mjs:
  (**
   * @license Angular v22.1.0
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
