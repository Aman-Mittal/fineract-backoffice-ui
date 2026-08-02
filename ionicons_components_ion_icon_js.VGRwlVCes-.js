import { e as x } from "@nf-internal/chunk-IQO3VMP7";
var Tt = "ionicons", U = { hydratedSelectorName: "hydrated", lazyLoad: !1, updatable: !0 }, Pt = Object.defineProperty, Ht = (t, e) => { for (var s in e)
    Pt(t, s, { get: e[s], enumerable: !0 }); }, y = t => { if (t.__stencil__getHostRef)
    return t.__stencil__getHostRef(); }, Ut = (t, e) => { let s = { $flags$: 0, $hostElement$: t, $cmpMeta$: e, $instanceValues$: new Map }; s.$onReadyPromise$ = new Promise(o => s.$onReadyResolve$ = o), t["s-p"] = [], t["s-rc"] = []; let n = s; return t.__stencil__getHostRef = () => n, n; }, tt = (t, e) => e in t, C = (t, e) => (0, console.error)(t, e), P = new Map, Ct = "slot-fb{display:contents}slot-fb[hidden]{display:none}", et = "http://www.w3.org/1999/xlink", p = typeof window < "u" ? window : {}, ft = p.HTMLElement || class {
}, g = { $flags$: 0, $resourcesUrl$: "", jmp: t => t(), raf: t => requestAnimationFrame(t), ael: (t, e, s, n) => t.addEventListener(e, s, n), rel: (t, e, s, n) => t.removeEventListener(e, s, n), ce: (t, e) => new CustomEvent(t, e) }, Mt = t => Promise.resolve(t), $t = (() => { try {
    return new CSSStyleSheet, typeof new CSSStyleSheet().replaceSync == "function";
}
catch { } return !1; })(), D = !1, st = [], dt = [], jt = (t, e) => s => { t.push(s), D || (D = !0, e && g.$flags$ & 4 ? M(q) : g.raf(q)); }, nt = t => { for (let e = 0; e < t.length; e++)
    try {
        t[e](performance.now());
    }
    catch (s) {
        C(s);
    } t.length = 0; }, q = () => { nt(st), nt(dt), (D = st.length > 0) && g.raf(q); }, M = t => Mt().then(t), zt = jt(dt, !0), Rt = t => { let e = new URL(t, g.$resourcesUrl$); return e.origin !== p.location.origin ? e.href : e.pathname; };
var X = t => (t = typeof t, t === "object" || t === "function");
function Dt(t) { var e, s, n; return (n = (s = (e = t.head) == null ? void 0 : e.querySelector('meta[name="csp-nonce"]')) == null ? void 0 : s.getAttribute("content")) != null ? n : void 0; }
var qt = t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Wt = {};
Ht(Wt, { err: () => ut, map: () => Bt, ok: () => W, unwrap: () => Xt, unwrapErr: () => Ft });
var W = t => ({ isOk: !0, isErr: !1, value: t }), ut = t => ({ isOk: !1, isErr: !0, value: t });
function Bt(t, e) { if (t.isOk) {
    let s = e(t.value);
    return s instanceof Promise ? s.then(n => W(n)) : W(s);
} if (t.isErr) {
    let s = t.value;
    return ut(s);
} throw "should never get here"; }
var Xt = t => { if (t.isOk)
    return t.value; throw t.value; }, Ft = t => { if (t.isErr)
    return t.value; throw t.value; };
var L;
function Gt(t) { var e; let s = this.attachShadow({ mode: "open" }); L === void 0 && (L = (e = void 0) != null ? e : null), L && s.adoptedStyleSheets.push(L); }
var S = (t, e = "") => () => { }, w = new WeakMap, Kt = (t, e, s) => { let n = P.get(t); $t && s ? (n = n || new CSSStyleSheet, typeof n == "string" ? n = e : n.replaceSync(e)) : n = e, P.set(t, n); }, Zt = (t, e, s) => { var n; let o = ht(e), r = P.get(o); if (!p.document)
    return o; if (t = t.nodeType === 11 ? t : p.document, r)
    if (typeof r == "string") {
        t = t.head || t;
        let c = w.get(t), i;
        if (c || w.set(t, c = new Set), !c.has(o)) {
            {
                i = p.document.createElement("style"), i.innerHTML = r;
                let a = (n = g.$nonce$) != null ? n : Dt(p.document);
                if (a != null && i.setAttribute("nonce", a), !(e.$flags$ & 1))
                    if (t.nodeName === "HEAD") {
                        let l = t.querySelectorAll("link[rel=preconnect]"), f = l.length > 0 ? l[l.length - 1].nextSibling : t.querySelector("style");
                        t.insertBefore(i, f?.parentNode === t ? f : null);
                    }
                    else if ("host" in t)
                        if ($t) {
                            let l = new CSSStyleSheet;
                            l.replaceSync(r), t.adoptedStyleSheets.unshift(l);
                        }
                        else {
                            let l = t.querySelector("style");
                            l ? l.innerHTML = r + l.innerHTML : t.prepend(i);
                        }
                    else
                        t.append(i);
                e.$flags$ & 1 && t.insertBefore(i, null);
            }
            e.$flags$ & 4 && (i.innerHTML += Ct), c && c.add(o);
        }
    }
    else
        t.adoptedStyleSheets.includes(r) || t.adoptedStyleSheets.push(r); return o; }, Yt = t => { let e = t.$cmpMeta$, s = t.$hostElement$, n = e.$flags$, o = S("attachStyles", e.$tagName$), r = Zt(s.shadowRoot ? s.shadowRoot : s.getRootNode(), e); n & 10 && (s["s-sc"] = r, s.classList.add(r + "-h")), o(); }, ht = (t, e) => "sc-" + t.$tagName$, A = (t, e, ...s) => { let n = null, o = null, r = !1, c = !1, i = [], a = f => { for (let $ = 0; $ < f.length; $++)
    n = f[$], Array.isArray(n) ? a(n) : n != null && typeof n != "boolean" && ((r = typeof t != "function" && !X(n)) && (n = String(n)), r && c ? i[i.length - 1].$text$ += n : i.push(r ? B(null, n) : n), c = r); }; if (a(s), e) {
    e.key && (o = e.key);
    {
        let f = e.className || e.class;
        f && (e.class = typeof f != "object" ? f : Object.keys(f).filter($ => f[$]).join(" "));
    }
} let l = B(t, null); return l.$attrs$ = e, i.length > 0 && (l.$children$ = i), l.$key$ = o, l; }, B = (t, e) => { let s = { $flags$: 0, $tag$: t, $text$: e, $elm$: null, $children$: null }; return s.$attrs$ = null, s.$key$ = null, s; }, F = {}, Jt = t => t && t.$tag$ === F, G = t => { let e = qt(t); return new RegExp(`(^|[^@]|@(?!supports\\s+selector\\s*\\([^{]*?${e}))(${e}\\b)`, "g"); };
G("::slotted");
G(":host");
G(":host-context");
var pt = (t, e, s) => t != null && !X(t) ? e & 4 ? t === "false" ? !1 : t === "" || !!t : e & 1 ? String(t) : t : t, Qt = (t, e, s) => { let n = g.ce(e, s); return t.dispatchEvent(n), n; }, ot = (t, e, s, n, o, r, c) => { if (s === n)
    return; let i = tt(t, e), a = e.toLowerCase(); if (e === "class") {
    let l = t.classList, f = rt(s), $ = rt(n);
    l.remove(...f.filter(d => d && !$.includes(d))), l.add(...$.filter(d => d && !f.includes(d)));
}
else if (e === "style") {
    for (let l in s)
        (!n || n[l] == null) && (l.includes("-") ? t.style.removeProperty(l) : t.style[l] = "");
    for (let l in n)
        (!s || n[l] !== s[l]) && (l.includes("-") ? t.style.setProperty(l, n[l]) : t.style[l] = n[l]);
}
else if (e !== "key")
    if (e === "ref")
        n && n(t);
    else if (!t.__lookupSetter__(e) && e[0] === "o" && e[1] === "n") {
        if (e[2] === "-" ? e = e.slice(3) : tt(p, a) ? e = a.slice(2) : e = a[2] + e.slice(3), s || n) {
            let l = e.endsWith(gt);
            e = e.replace(Vt, ""), s && g.rel(t, e, s, l), n && g.ael(t, e, n, l);
        }
    }
    else {
        let l = X(n);
        if (i || l && n !== null)
            try {
                if (t.tagName.includes("-"))
                    t[e] !== n && (t[e] = n);
                else {
                    let $ = n ?? "";
                    e === "list" ? i = !1 : (s == null || t[e] != $) && (typeof t.__lookupSetter__(e) == "function" ? t[e] = $ : t.setAttribute(e, $));
                }
            }
            catch { }
        let f = !1;
        a !== (a = a.replace(/^xlink\:?/, "")) && (e = a, f = !0), n == null || n === !1 ? (n !== !1 || t.getAttribute(e) === "") && (f ? t.removeAttributeNS(et, e) : t.removeAttribute(e)) : (!i || r & 4 || o) && !l && t.nodeType === 1 && (n = n === !0 ? "" : n, f ? t.setAttributeNS(et, e, n) : t.setAttribute(e, n));
    } }, Nt = /\s/, rt = t => (typeof t == "object" && t && "baseVal" in t && (t = t.baseVal), !t || typeof t != "string" ? [] : t.split(Nt)), gt = "Capture", Vt = new RegExp(gt + "$"), vt = (t, e, s, n) => { let o = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, r = t && t.$attrs$ || {}, c = e.$attrs$ || {}; for (let i of it(Object.keys(r)))
    i in c || ot(o, i, r[i], void 0, s, e.$flags$); for (let i of it(Object.keys(c)))
    ot(o, i, r[i], c[i], s, e.$flags$); };
function it(t) { return t.includes("ref") ? [...t.filter(e => e !== "ref"), "ref"] : t; }
var K, yt = !1, H = (t, e, s) => { let n = e.$children$[s], o = 0, r, c; if (n.$text$ !== null)
    r = n.$elm$ = p.document.createTextNode(n.$text$);
else {
    if (!p.document)
        throw new Error("You are trying to render a Stencil component in an environment that doesn't support the DOM. Make sure to populate the [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window/window) object before rendering a component.");
    if (r = n.$elm$ = p.document.createElement(n.$tag$), vt(null, n, yt), n.$children$)
        for (o = 0; o < n.$children$.length; ++o)
            c = H(t, n, o), c && r.appendChild(c);
} return r["s-hn"] = K, r; }, St = (t, e, s, n, o, r) => { let c = t, i; for (c.shadowRoot && c.tagName === K && (c = c.shadowRoot); o <= r; ++o)
    n[o] && (i = H(null, s, o), i && (n[o].$elm$ = i, T(c, i, e))); }, bt = (t, e, s) => { for (let n = e; n <= s; ++n) {
    let o = t[n];
    if (o) {
        let r = o.$elm$;
        wt(o), r && r.remove();
    }
} }, te = (t, e, s, n, o = !1) => { let r = 0, c = 0, i = 0, a = 0, l = e.length - 1, f = e[0], $ = e[l], d = n.length - 1, u = n[0], h = n[d], v, E; for (; r <= l && c <= d;)
    if (f == null)
        f = e[++r];
    else if ($ == null)
        $ = e[--l];
    else if (u == null)
        u = n[++c];
    else if (h == null)
        h = n[--d];
    else if (O(f, u, o))
        b(f, u, o), f = e[++r], u = n[++c];
    else if (O($, h, o))
        b($, h, o), $ = e[--l], h = n[--d];
    else if (O(f, h, o))
        b(f, h, o), T(t, f.$elm$, $.$elm$.nextSibling), f = e[++r], h = n[--d];
    else if (O($, u, o))
        b($, u, o), T(t, $.$elm$, f.$elm$), $ = e[--l], u = n[++c];
    else {
        for (i = -1, a = r; a <= l; ++a)
            if (e[a] && e[a].$key$ !== null && e[a].$key$ === u.$key$) {
                i = a;
                break;
            }
        i >= 0 ? (E = e[i], E.$tag$ !== u.$tag$ ? v = H(e && e[c], s, i) : (b(E, u, o), e[i] = void 0, v = E.$elm$), u = n[++c]) : (v = H(e && e[c], s, c), u = n[++c]), v && T(f.$elm$.parentNode, v, f.$elm$);
    } r > l ? St(t, n[d + 1] == null ? null : n[d + 1].$elm$, s, n, c, d) : c > d && bt(e, r, l); }, O = (t, e, s = !1) => t.$tag$ === e.$tag$ ? s ? (s && !t.$key$ && e.$key$ && (t.$key$ = e.$key$), !0) : t.$key$ === e.$key$ : !1, b = (t, e, s = !1) => { let n = e.$elm$ = t.$elm$, o = t.$children$, r = e.$children$, c = e.$text$; c === null ? (vt(t, e, yt), o !== null && r !== null ? te(n, o, e, r, s) : r !== null ? (t.$text$ !== null && (n.textContent = ""), St(n, null, e, r, 0, r.length - 1)) : !s && U.updatable && o !== null && bt(o, 0, o.length - 1)) : t.$text$ !== c && (n.data = c); }, wt = t => { t.$attrs$ && t.$attrs$.ref && t.$attrs$.ref(null), t.$children$ && t.$children$.map(wt); }, T = (t, e, s) => t?.insertBefore(e, s), ee = (t, e, s = !1) => { let n = t.$hostElement$, o = t.$cmpMeta$, r = t.$vnode$ || B(null, null), i = Jt(e) ? e : A(null, null, e); if (K = n.tagName, o.$attrsToReflect$ && (i.$attrs$ = i.$attrs$ || {}, o.$attrsToReflect$.map(([a, l]) => i.$attrs$[l] = n[a])), s && i.$attrs$)
    for (let a of Object.keys(i.$attrs$))
        n.hasAttribute(a) && !["key", "ref", "style", "class"].includes(a) && (i.$attrs$[a] = n[a]); i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, b(r, i, s); }, mt = (t, e) => { if (e && !t.$onRenderResolve$ && e["s-p"]) {
    let s = e["s-p"].push(new Promise(n => t.$onRenderResolve$ = () => { e["s-p"].splice(s - 1, 1), n(); }));
} }, Z = (t, e) => { if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
} return mt(t, t.$ancestorComponent$), zt(() => se(t, e)); }, se = (t, e) => { let s = t.$hostElement$, n = S("scheduleUpdate", t.$cmpMeta$.$tagName$), o = s; if (!o)
    throw new Error(`Can't render component <${s.tagName.toLowerCase()} /> with invalid Stencil runtime! Make sure this imported component is compiled with a \`externalRuntime: true\` flag. For more information, please refer to https://stenciljs.com/docs/custom-elements#externalruntime`); let r; return e ? r = m(o, "componentWillLoad", void 0, s) : r = m(o, "componentWillUpdate", void 0, s), r = lt(r, () => m(o, "componentWillRender", void 0, s)), n(), lt(r, () => oe(t, o, e)); }, lt = (t, e) => ne(t) ? t.then(e).catch(s => { console.error(s), e(); }) : e(), ne = t => t instanceof Promise || t && t.then && typeof t.then == "function", oe = (t, e, s) => x(null, null, function* () { var n; let o = t.$hostElement$, r = S("update", t.$cmpMeta$.$tagName$), c = o["s-rc"]; s && Yt(t); let i = S("render", t.$cmpMeta$.$tagName$); re(t, e, o, s), c && (c.map(a => a()), o["s-rc"] = void 0), i(), r(); {
    let a = (n = o["s-p"]) != null ? n : [], l = () => ie(t);
    a.length === 0 ? l() : (Promise.all(a).then(l), t.$flags$ |= 4, a.length = 0);
} }), re = (t, e, s, n) => { try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, ee(t, e, n);
}
catch (o) {
    C(o, t.$hostElement$);
} return null; }, ie = t => { let e = t.$cmpMeta$.$tagName$, s = t.$hostElement$, n = S("postUpdate", e), o = s, r = t.$ancestorComponent$; m(o, "componentDidRender", void 0, s), t.$flags$ & 64 ? (m(o, "componentDidUpdate", void 0, s), n()) : (t.$flags$ |= 64, ce(s), m(o, "componentDidLoad", void 0, s), n(), t.$onReadyResolve$(s), r || le()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && M(() => Z(t, !1)), t.$flags$ &= -517; }, le = t => { M(() => Qt(p, "appload", { detail: { namespace: Tt } })); }, m = (t, e, s, n) => { if (t && t[e])
    try {
        return t[e](s);
    }
    catch (o) {
        C(o, n);
    } }, ce = t => { var e; return t.classList.add((e = U.hydratedSelectorName) != null ? e : "hydrated"); }, ae = (t, e) => y(t).$instanceValues$.get(e), ct = (t, e, s, n) => { let o = y(t), r = t, c = o.$instanceValues$.get(e), i = o.$flags$, a = r; s = pt(s, n.$members$[e][0]); let l = Number.isNaN(c) && Number.isNaN(s); if (s !== c && !l) {
    o.$instanceValues$.set(e, s);
    {
        if (n.$watchers$ && i & 128) {
            let $ = n.$watchers$[e];
            $ && $.map(d => { try {
                a[d](s, c, e);
            }
            catch (u) {
                C(u, r);
            } });
        }
        if ((i & 18) === 2) {
            if (a.componentShouldUpdate && a.componentShouldUpdate(s, c, e) === !1)
                return;
            Z(o, !1);
        }
    }
} }, fe = (t, e, s) => { var n, o; let r = t.prototype; if (e.$members$ || e.$watchers$ || t.watchers) {
    t.watchers && !e.$watchers$ && (e.$watchers$ = t.watchers);
    let c = Object.entries((n = e.$members$) != null ? n : {});
    c.map(([i, [a]]) => { if (a & 31 || a & 32) {
        let { get: l, set: f } = Object.getOwnPropertyDescriptor(r, i) || {};
        l && (e.$members$[i][0] |= 2048), f && (e.$members$[i][0] |= 4096), Object.defineProperty(r, i, { get() { return l ? l.apply(this) : ae(this, i); }, configurable: !0, enumerable: !0 }), Object.defineProperty(r, i, { set($) { let d = y(this); if (f) {
                let u = a & 32 ? this[i] : d.$hostElement$[i];
                typeof u > "u" && d.$instanceValues$.get(i) ? $ = d.$instanceValues$.get(i) : !d.$instanceValues$.get(i) && u && d.$instanceValues$.set(i, u), f.apply(this, [pt($, a)]), $ = a & 32 ? this[i] : d.$hostElement$[i], ct(this, i, $, e);
                return;
            } {
                ct(this, i, $, e);
                return;
            } } });
    } });
    {
        let i = new Map;
        r.attributeChangedCallback = function (a, l, f) { g.jmp(() => { var $; let d = i.get(a); if (!(this.hasOwnProperty(d) && U.lazyLoad)) {
            if (r.hasOwnProperty(d) && typeof this[d] == "number" && this[d] == f)
                return;
            if (d == null) {
                let h = y(this), v = h?.$flags$;
                if (v && !(v & 8) && v & 128 && f !== l) {
                    let j = this, N = ($ = e.$watchers$) == null ? void 0 : $[a];
                    N?.forEach(V => { j[V] != null && j[V].call(j, f, l, a); });
                }
                return;
            }
        } let u = Object.getOwnPropertyDescriptor(r, d); f = f === null && typeof this[d] == "boolean" ? !1 : f, f !== this[d] && (!u.get || u.set) && (this[d] = f); }); }, t.observedAttributes = Array.from(new Set([...Object.keys((o = e.$watchers$) != null ? o : {}), ...c.filter(([a, l]) => l[0] & 15).map(([a, l]) => { var f; let $ = l[1] || a; return i.set($, a), l[0] & 512 && ((f = e.$attrsToReflect$) == null || f.push([a, $])), $; })]));
    }
} return t; }, at = (t, e, s, n) => x(null, null, function* () { let o; if ((e.$flags$ & 32) === 0) {
    e.$flags$ |= 32;
    {
        o = t.constructor;
        let i = t.localName;
        customElements.whenDefined(i).then(() => e.$flags$ |= 128);
    }
    if (o && o.style) {
        let i;
        typeof o.style == "string" && (i = o.style);
        let a = ht(s);
        if (!P.has(a)) {
            let l = S("registerStyles", s.$tagName$);
            Kt(a, i, !!(s.$flags$ & 1)), l();
        }
    }
} let r = e.$ancestorComponent$, c = () => Z(e, !0); r && r["s-rc"] ? r["s-rc"].push(c) : c(); }), $e = (t, e) => { }, de = t => { if ((g.$flags$ & 1) === 0) {
    let e = y(t), s = e.$cmpMeta$, n = S("connectedCallback", s.$tagName$);
    if (e.$flags$ & 1)
        e?.$lazyInstance$ || e?.$onReadyPromise$ && e.$onReadyPromise$.then(() => $e());
    else {
        e.$flags$ |= 1;
        {
            let o = t;
            for (; o = o.parentNode || o.host;)
                if (o["s-p"]) {
                    mt(e, e.$ancestorComponent$ = o);
                    break;
                }
        }
        s.$members$ && Object.entries(s.$members$).map(([o, [r]]) => { if (r & 31 && t.hasOwnProperty(o)) {
            let c = t[o];
            delete t[o], t[o] = c;
        } }), U.initializeNextTick ? M(() => at(t, e, s)) : at(t, e, s);
    }
    n();
} }, ue = t => x(null, null, function* () { (g.$flags$ & 1) === 0 && y(t), w.has(t) && w.delete(t), t.shadowRoot && w.has(t.shadowRoot) && w.delete(t.shadowRoot); }), kt = (t, e) => { let s = { $flags$: e[0], $tagName$: e[1] }; s.$members$ = e[2], s.$watchers$ = t.$watchers$, s.$attrsToReflect$ = []; let n = t.prototype.connectedCallback, o = t.prototype.disconnectedCallback; return Object.assign(t.prototype, { __hasHostListenerAttached: !1, __registerHost() { Ut(this, s); }, connectedCallback() { this.__hasHostListenerAttached || (y(this), this.__hasHostListenerAttached = !0), de(this), n && n.call(this); }, disconnectedCallback() { ue(this), o && o.call(this); }, __attachShadow() { if (!this.shadowRoot)
        Gt.call(this, s);
    else if (this.shadowRoot.mode !== "open")
        throw new Error(`Unable to re-use existing shadow root for ${s.$tagName$}! Mode is set to ${this.shadowRoot.mode} but Stencil only supports open shadow roots.`); } }), t.is = s.$tagName$, fe(t, s); };
var z, he = () => { if (typeof window > "u")
    return new Map; if (!z) {
    let t = window;
    t.Ionicons = t.Ionicons || {}, z = t.Ionicons.map = t.Ionicons.map || new Map;
} return z; };
var Et = t => { let e = R(t.src); return e || (e = Y(t.name, t.icon, t.mode, t.ios, t.md), e ? pe(e, t) : t.icon && (e = R(t.icon), e || (e = R(t.icon[t.mode]), e)) ? e : null); }, pe = (t, e) => { let s = he().get(t); if (s)
    return s; try {
    return Rt(`svg/${t}.svg`);
}
catch (n) {
    console.log("e", n), console.warn(`[Ionicons Warning]: Could not load icon with name "${t}". Ensure that the icon is registered using addIcons or that the icon SVG data is passed directly to the icon component.`, e);
} }, Y = (t, e, s, n, o) => (s = (s && I(s)) === "ios" ? "ios" : "md", n && s === "ios" ? t = I(n) : o && s === "md" ? t = I(o) : (!t && e && !_t(e) && (t = e), _(t) && (t = I(t))), !_(t) || t.trim() === "" || t.replace(/[a-z]|-|\d/gi, "") !== "" ? null : t), R = t => _(t) && (t = t.trim(), _t(t)) ? t : null, _t = t => t.length > 0 && /(\/|\.)/.test(t), _ = t => typeof t == "string", I = t => t.toLowerCase(), At = (t, e = []) => { let s = {}; return e.forEach(n => { t.hasAttribute(n) && (t.getAttribute(n) !== null && (s[n] = t.getAttribute(n)), t.removeAttribute(n)); }), s; }, xt = t => t && t.dir !== "" ? t.dir.toLowerCase() === "rtl" : document?.dir.toLowerCase() === "rtl";
var ge = t => { let e = document.createElement("div"); e.innerHTML = t; for (let n = e.childNodes.length - 1; n >= 0; n--)
    e.childNodes[n].nodeName.toLowerCase() !== "svg" && e.removeChild(e.childNodes[n]); let s = e.firstElementChild; if (s && s.nodeName.toLowerCase() === "svg") {
    let n = s.getAttribute("class") || "";
    if (s.setAttribute("class", (n + " s-ion-icon").trim()), Lt(s))
        return e.innerHTML;
} return ""; }, Lt = t => { if (t.nodeType === 1) {
    if (t.nodeName.toLowerCase() === "script")
        return !1;
    for (let e = 0; e < t.attributes.length; e++) {
        let s = t.attributes[e].name;
        if (_(s) && s.toLowerCase().indexOf("on") === 0)
            return !1;
    }
    for (let e = 0; e < t.childNodes.length; e++)
        if (!Lt(t.childNodes[e]))
            return !1;
} return !0; }, ve = t => t.startsWith("data:image/svg+xml"), ye = t => t.indexOf(";utf8,") !== -1, k = new Map, Ot = new Map, J;
function Q(t) { return k.set(t, ""), ""; }
var Se = (t, e) => { let s = Ot.get(t); return s || (typeof fetch < "u" && typeof document < "u" ? ve(t) && ye(t) ? Promise.resolve(be(t)) : we(t, e) : Promise.resolve(Q(t))); };
function be(t) { J || (J = new DOMParser); let s = J.parseFromString(t, "text/html").querySelector("svg"); if (s)
    return k.set(t, s.outerHTML), s.outerHTML; throw new Error(`Could not parse svg from ${t}`); }
function we(t, e) { let s = fetch(t).then(n => n.text().then(o => { o && e !== !1 && (o = ge(o)); let r = o || ""; return k.set(t, r), r; }).catch(() => Q(t))).catch(() => Q(t)); return Ot.set(t, s), s; }
var me = ":host{display:inline-block;width:1em;height:1em;contain:strict;fill:currentColor;box-sizing:content-box !important}:host .ionicon{stroke:currentColor}.ionicon-fill-none{fill:none}.ionicon-stroke-width{stroke-width:var(--ionicon-stroke-width, 32px)}.icon-inner,.ionicon,svg{display:block;height:100%;width:100%}@supports (background: -webkit-named-image(i)){:host(.icon-rtl) .icon-inner{transform:scaleX(-1)}}@supports not selector(:dir(rtl)) and selector(:host-context([dir='rtl'])){:host(.icon-rtl) .icon-inner{transform:scaleX(-1)}}:host(.flip-rtl):host-context([dir='rtl']) .icon-inner{transform:scaleX(-1)}@supports selector(:dir(rtl)){:host(.flip-rtl:dir(rtl)) .icon-inner{transform:scaleX(-1)}:host(.flip-rtl:dir(ltr)) .icon-inner{transform:scaleX(1)}}:host(.icon-small){font-size:1.125rem !important}:host(.icon-large){font-size:2rem !important}:host(.ion-color){color:var(--ion-color-base) !important}:host(.ion-color-primary){--ion-color-base:var(--ion-color-primary, #3880ff)}:host(.ion-color-secondary){--ion-color-base:var(--ion-color-secondary, #0cd1e8)}:host(.ion-color-tertiary){--ion-color-base:var(--ion-color-tertiary, #f4a942)}:host(.ion-color-success){--ion-color-base:var(--ion-color-success, #10dc60)}:host(.ion-color-warning){--ion-color-base:var(--ion-color-warning, #ffce00)}:host(.ion-color-danger){--ion-color-base:var(--ion-color-danger, #f14141)}:host(.ion-color-light){--ion-color-base:var(--ion-color-light, #f4f5f8)}:host(.ion-color-medium){--ion-color-base:var(--ion-color-medium, #989aa2)}:host(.ion-color-dark){--ion-color-base:var(--ion-color-dark, #222428)}", It = kt(class extends ft {
    constructor() { super(), this.__registerHost(), this.__attachShadow(), this.iconName = null, this.inheritedAttributes = {}, this.didLoadIcon = !1, this.isVisible = !1, this.mode = ke(), this.lazy = !1, this.sanitize = !0; }
    componentWillLoad() { this.inheritedAttributes = At(this.el, ["aria-label"]); }
    connectedCallback() { this.waitUntilVisible(this.el, "50px", () => { this.isVisible = !0, this.loadIcon(); }); }
    componentDidLoad() { this.didLoadIcon || this.loadIcon(); }
    disconnectedCallback() { this.io && (this.io.disconnect(), this.io = void 0); }
    waitUntilVisible(e, s, n) { if (!!!(this.lazy && typeof window < "u" && window.IntersectionObserver))
        return n(); let r = this.io = new window.IntersectionObserver(c => { c[0].isIntersecting && (r.disconnect(), this.io = void 0, n()); }, { rootMargin: s }); r.observe(e); }
    loadIcon() { if (this.isVisible) {
        let e = Et(this);
        e && (k.has(e) ? this.svgContent = k.get(e) : Se(e, this.sanitize).then(() => this.svgContent = k.get(e)), this.didLoadIcon = !0);
    } this.iconName = Y(this.name, this.icon, this.mode, this.ios, this.md); }
    render() { let { flipRtl: e, iconName: s, inheritedAttributes: n, el: o } = this, r = this.mode || "md", c = s ? (s.includes("arrow") || s.includes("chevron")) && e !== !1 : !1, i = e || c; return A(F, Object.assign({ key: "0578c899781ca145dd8205acd9670af39b57cf2e", role: "img", class: Object.assign(Object.assign({ [r]: !0 }, Ee(this.color)), { [`icon-${this.size}`]: !!this.size, "flip-rtl": i, "icon-rtl": i && xt(o) }) }, n), this.svgContent ? A("div", { class: "icon-inner", innerHTML: this.svgContent }) : A("div", { class: "icon-inner" })); }
    static get assetsDirs() { return ["svg"]; }
    get el() { return this; }
    static get watchers() { return { name: ["loadIcon"], src: ["loadIcon"], icon: ["loadIcon"], ios: ["loadIcon"], md: ["loadIcon"] }; }
    static get style() { return me; }
}, [1, "ion-icon", { mode: [1025], color: [1], ios: [1], md: [1], flipRtl: [4, "flip-rtl"], name: [513], src: [1], icon: [8], size: [1], lazy: [4], sanitize: [4], svgContent: [32], isVisible: [32] }, void 0, { name: ["loadIcon"], src: ["loadIcon"], icon: ["loadIcon"], ios: ["loadIcon"], md: ["loadIcon"] }]), ke = () => typeof document < "u" && document.documentElement.getAttribute("mode") || "md", Ee = t => t ? { "ion-color": !0, [`ion-color-${t}`]: !0 } : null;
function _e() { if (typeof customElements > "u")
    return; ["ion-icon"].forEach(e => { e === "ion-icon" && (customElements.get(e) || customElements.define(e, It)); }); }
var Te = It, Pe = _e;
export { Te as IonIcon, Pe as defineCustomElement };
