import { a as _, b as T } from "@nf-internal/chunk-IQO3VMP7";
import { DOCUMENT as A, \u0275getDOM as j } from "@angular/common";
import * as a from "@angular/core";
import { InjectionToken as H, \u0275RuntimeError as M, APP_ID as x, CSP_NONCE as N, PLATFORM_ID as k, ViewEncapsulation as p, \u0275SHARED_STYLES_HOST as B, \u0275TracingService as $, RendererStyleFlags2 as v, \u0275allLeavingAnimations as F } from "@angular/core";
var C = class {
    _doc;
    constructor(n) { this._doc = n; }
    manager;
}, R = (() => { class o extends C {
    constructor(e) { super(e); }
    supports(e) { return !0; }
    addEventListener(e, t, s, r) { return e.addEventListener(t, s, r), () => this.removeEventListener(e, t, s, r); }
    removeEventListener(e, t, s, r) { return e.removeEventListener(t, s, r); }
    static \u0275fac = function (t) { return new (t || o)(a.\u0275\u0275inject(A)); };
    static \u0275prov = a.\u0275\u0275defineInjectable({ token: o, factory: o.\u0275fac });
} return o; })(), Z = new H(""), G = (() => { class o {
    _zone;
    _plugins;
    _eventNameToPlugin = new Map;
    constructor(e, t) { this._zone = t, e.forEach(i => { i.manager = this; }); let s = e.filter(i => !(i instanceof R)); this._plugins = s.slice().reverse(); let r = e.find(i => i instanceof R); r && this._plugins.push(r); }
    addEventListener(e, t, s, r) { return this._findPluginFor(t).addEventListener(e, t, s, r); }
    getZone() { return this._zone; }
    _findPluginFor(e) { let t = this._eventNameToPlugin.get(e); if (t)
        return t; if (t = this._plugins.find(r => r.supports(e)), !t)
        throw new M(-5101, !1); return this._eventNameToPlugin.set(e, t), t; }
    static \u0275fac = function (t) { return new (t || o)(a.\u0275\u0275inject(Z), a.\u0275\u0275inject(a.NgZone)); };
    static \u0275prov = a.\u0275\u0275defineInjectable({ token: o, factory: o.\u0275fac });
} return o; })(), m = "ng-app-id";
function P(o) { for (let n of o)
    n.remove(); }
function b(o, n) { let e = n.createElement("style"); return e.textContent = o, e; }
function V(o, n, e, t) { let s = o.head?.querySelectorAll(`style[${m}="${n}"],link[${m}="${n}"]`); if (!s || s.length === 0)
    return !1; for (let r of s)
    r.removeAttribute(m), r instanceof HTMLLinkElement ? t.set(r.href.slice(r.href.lastIndexOf("/") + 1), { usage: 0, elements: [r] }) : r.textContent && e.set(r.textContent, { usage: 0, elements: [r] }); return !0; }
function D(o, n) { let e = n.createElement("link"); return e.setAttribute("rel", "stylesheet"), e.setAttribute("href", o), e; }
var se = (() => { class o {
    doc;
    appId;
    nonce;
    inline = new Map;
    external = new Map;
    hosts = new Set;
    constructor(e, t, s, r = {}) { this.doc = e, this.appId = t, this.nonce = s, V(e, t, this.inline, this.external) && this.hosts.add(e.head); }
    addStyles(e, t) { for (let s of e)
        this.addUsage(s, this.inline, b); t?.forEach(s => this.addUsage(s, this.external, D)); }
    removeStyles(e, t) { for (let s of e)
        this.removeUsage(s, this.inline); t?.forEach(s => this.removeUsage(s, this.external)); }
    addUsage(e, t, s) { let r = t.get(e); r ? r.usage++ : t.set(e, { usage: 1, elements: [...this.hosts].map(i => this.addElement(i, s(e, this.doc))) }); }
    removeUsage(e, t) { let s = t.get(e); s && (s.usage--, s.usage <= 0 && (P(s.elements), t.delete(e))); }
    ngOnDestroy() { for (let [, { elements: e }] of [...this.inline, ...this.external])
        P(e); this.hosts.clear(); }
    addHost(e) { if (!this.hosts.has(e)) {
        this.hosts.add(e);
        for (let [t, { elements: s }] of this.inline)
            s.push(this.addElement(e, b(t, this.doc)));
        for (let [t, { elements: s }] of this.external)
            s.push(this.addElement(e, D(t, this.doc)));
    } }
    removeHost(e) { this.hosts.delete(e); for (let t of [...this.inline.values(), ...this.external.values()]) {
        let s = [];
        for (let r of t.elements)
            r.parentNode === e ? r.remove() : s.push(r);
        t.elements = s;
    } }
    addElement(e, t) { return this.nonce && t.setAttribute("nonce", this.nonce), typeof ngServerMode < "u" && ngServerMode && t.setAttribute(m, this.appId), e.appendChild(t); }
    static \u0275fac = function (t) { return new (t || o)(a.\u0275\u0275inject(A), a.\u0275\u0275inject(x), a.\u0275\u0275inject(N, 8), a.\u0275\u0275inject(k)); };
    static \u0275prov = a.\u0275\u0275defineInjectable({ token: o, factory: o.\u0275fac });
} return o; })(), w = { svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml", xlink: "http://www.w3.org/1999/xlink", xml: "http://www.w3.org/XML/1998/namespace", xmlns: "http://www.w3.org/2000/xmlns/", math: "http://www.w3.org/1998/Math/MathML" }, O = /%COMP%/g;
var I = "%COMP%", Y = `_nghost-${I}`, z = `_ngcontent-${I}`, X = !0, q = new H("", { factory: () => X });
function W(o) { return z.replace(O, o); }
function J(o) { return Y.replace(O, o); }
function U(o, n) { return n.map(e => e.replace(O, o)); }
var re = (() => { class o {
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
    constructor(e, t, s, r, i, l, c = null, d = null) { this.eventManager = e, this.sharedStylesHost = t, this.appId = s, this.removeStylesOnCompDestroy = r, this.doc = i, this.ngZone = l, this.nonce = c, this.tracingService = d, this.defaultRenderer = new g(e, i, l, this.tracingService); }
    createRenderer(e, t) { if (!e || !t)
        return this.defaultRenderer; typeof ngServerMode < "u" && ngServerMode && (t.encapsulation === p.ShadowDom || t.encapsulation === p.ExperimentalIsolatedShadowDom) && (t = T(_({}, t), { encapsulation: p.Emulated })); let s = this.getOrCreateRenderer(e, t); return s instanceof E ? s.applyToHost(e) : s instanceof y && s.applyStyles(), s; }
    getOrCreateRenderer(e, t) { let s = this.rendererByCompId, r = s.get(t.id); if (!r) {
        let i = this.doc, l = this.ngZone, c = this.eventManager, d = this.sharedStylesHost, u = this.removeStylesOnCompDestroy, h = this.tracingService;
        switch (t.encapsulation) {
            case p.Emulated:
                r = new E(c, d, t, this.appId, u, i, l, h);
                break;
            case p.ShadowDom: return new S(c, e, t, i, l, this.nonce, h, d);
            case p.ExperimentalIsolatedShadowDom: return new S(c, e, t, i, l, this.nonce, h);
            default:
                r = new y(c, d, t, u, i, l, h);
                break;
        }
        s.set(t.id, r);
    } return r; }
    ngOnDestroy() { this.rendererByCompId.clear(); }
    componentReplaced(e) { this.rendererByCompId.delete(e); }
    static \u0275fac = function (t) { return new (t || o)(a.\u0275\u0275inject(G), a.\u0275\u0275inject(B), a.\u0275\u0275inject(x), a.\u0275\u0275inject(q), a.\u0275\u0275inject(A), a.\u0275\u0275inject(a.NgZone), a.\u0275\u0275inject(N), a.\u0275\u0275inject($, 8)); };
    static \u0275prov = a.\u0275\u0275defineInjectable({ token: o, factory: o.\u0275fac });
} return o; })(), g = class {
    eventManager;
    doc;
    ngZone;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(n, e, t, s) { this.eventManager = n, this.doc = e, this.ngZone = t, this.tracingService = s; }
    destroy() { }
    destroyNode = null;
    createElement(n, e) { return e ? this.doc.createElementNS(w[e] || e, n) : this.doc.createElement(n); }
    createComment(n) { return this.doc.createComment(n); }
    createText(n) { return this.doc.createTextNode(n); }
    appendChild(n, e) { (L(n) ? n.content : n).appendChild(e); }
    insertBefore(n, e, t) { n && (L(n) ? n.content : n).insertBefore(e, t); }
    removeChild(n, e) { e.remove(); }
    selectRootElement(n, e) { let t = typeof n == "string" ? this.doc.querySelector(n) : n; if (!t)
        throw new M(-5104, !1); return e || (t.textContent = ""), t; }
    parentNode(n) { return n.parentNode; }
    nextSibling(n) { return n.nextSibling; }
    setAttribute(n, e, t, s) { if (s) {
        e = s + ":" + e;
        let r = w[s];
        r ? n.setAttributeNS(r, e, t) : n.setAttribute(e, t);
    }
    else
        n.setAttribute(e, t); }
    removeAttribute(n, e, t) { if (t) {
        let s = w[t];
        s ? n.removeAttributeNS(s, e) : n.removeAttribute(`${t}:${e}`);
    }
    else
        n.removeAttribute(e); }
    addClass(n, e) { n.classList.add(e); }
    removeClass(n, e) { n.classList.remove(e); }
    setStyle(n, e, t, s) { s & (v.DashCase | v.Important) ? n.style.setProperty(e, t, s & v.Important ? "important" : "") : n.style[e] = t; }
    removeStyle(n, e, t) { t & v.DashCase ? n.style.removeProperty(e) : n.style[e] = ""; }
    setProperty(n, e, t) { n != null && (n[e] = t); }
    setValue(n, e) { n.nodeValue = e; }
    listen(n, e, t, s) { if (typeof n == "string" && (n = j().getGlobalEventTarget(this.doc, n), !n))
        throw new M(-5102, !1); let r = this.decoratePreventDefault(t); return this.tracingService?.wrapEventListener && (r = this.tracingService.wrapEventListener(n, e, r)), this.eventManager.addEventListener(n, e, r, s); }
    decoratePreventDefault(n) { return e => { if (e === "__ngUnwrap__")
        return n; (typeof ngServerMode < "u" && ngServerMode ? this.ngZone.runGuarded(() => n(e)) : n(e)) === !1 && e.preventDefault(); }; }
};
function L(o) { return o.tagName === "TEMPLATE" && o.content !== void 0; }
var S = class extends g {
    hostEl;
    sharedStylesHost;
    shadowRoot;
    constructor(n, e, t, s, r, i, l, c) { super(n, s, r, l), this.hostEl = e, this.sharedStylesHost = c, this.shadowRoot = e.attachShadow({ mode: "open" }), this.sharedStylesHost && this.sharedStylesHost.addHost(this.shadowRoot); let d = t.styles; d = U(t.id, d); for (let h of d) {
        let f = document.createElement("style");
        i && f.setAttribute("nonce", i), f.textContent = h, this.shadowRoot.appendChild(f);
    } let u = t.getExternalStyles?.(); if (u)
        for (let h of u) {
            let f = D(h, s);
            i && f.setAttribute("nonce", i), this.shadowRoot.appendChild(f);
        } }
    nodeOrShadowRoot(n) { return n === this.hostEl ? this.shadowRoot : n; }
    appendChild(n, e) { return super.appendChild(this.nodeOrShadowRoot(n), e); }
    insertBefore(n, e, t) { return super.insertBefore(this.nodeOrShadowRoot(n), e, t); }
    removeChild(n, e) { return super.removeChild(null, e); }
    parentNode(n) { return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n))); }
    destroy() { this.sharedStylesHost && this.sharedStylesHost.removeHost(this.shadowRoot); }
}, y = class extends g {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(n, e, t, s, r, i, l, c) { super(n, r, i, l), this.sharedStylesHost = e, this.removeStylesOnCompDestroy = s; let d = t.styles; this.styles = c ? U(c, d) : d, this.styleUrls = t.getExternalStyles?.(c); }
    applyStyles() { this.sharedStylesHost.addStyles(this.styles, this.styleUrls); }
    destroy() { this.removeStylesOnCompDestroy && F.size === 0 && this.sharedStylesHost.removeStyles(this.styles, this.styleUrls); }
}, E = class extends y {
    contentAttr;
    hostAttr;
    constructor(n, e, t, s, r, i, l, c) { let d = s + "-" + t.id; super(n, e, t, r, i, l, c, d), this.contentAttr = W(d), this.hostAttr = J(d); }
    applyToHost(n) { this.applyStyles(), this.setAttribute(n, this.hostAttr, ""); }
    createElement(n, e) { let t = super.createElement(n, e); return super.setAttribute(t, this.contentAttr, ""), t; }
};
export { C as a, R as b, Z as c, G as d, se as e, q as f, re as g };
/*! Bundled license information:

@angular/platform-browser/fesm2022/_dom_renderer-chunk.mjs:
  (**
   * @license Angular v22.0.7
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
