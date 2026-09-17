import { e as M } from "@nf-internal/chunk-IQO3VMP7";
function ge(e, t, n) { let o = typeof HTMLElement < "u" ? HTMLElement.prototype : null; for (; e && e !== o;) {
    let r = Object.getOwnPropertyDescriptor(e, t);
    if (r && (!n || r.get))
        return r;
    e = Object.getPrototypeOf(e);
} }
var x, Me = (e, t) => { var n; Object.entries((n = t.o.t) != null ? n : {}).map((([o, [r]]) => { if (31 & r || 32 & r) {
    let d = e[o], i = ge(Object.getPrototypeOf(e), o, !0) || Object.getOwnPropertyDescriptor(e, o);
    i && Object.defineProperty(e, o, { get() { return i.get.call(this); }, set(l) { i.set.call(this, l); }, configurable: !0, enumerable: !0 }), t.l.has(o) ? e[o] = t.l.get(o) : d !== void 0 && (e[o] = d);
} })); }, k = e => { if (e.__stencil__getHostRef)
    return e.__stencil__getHostRef(); }, se = (e, t) => t in e, $ = (e, t) => (0, console.error)(e, t), D = new Map, re = "http://www.w3.org/1999/xlink", C = typeof window < "u" ? window : {}, ye = C.HTMLElement || class {
}, _ = { i: 0, u: "", jmp: e => e(), raf: e => requestAnimationFrame(e), ael: (e, t, n, o) => e.addEventListener(t, n, o), rel: (e, t, n, o) => e.removeEventListener(t, n, o), ce: (e, t) => new CustomEvent(e, t) }, Y = (() => { try {
    return !!C.document.adoptedStyleSheets && (new CSSStyleSheet, typeof new CSSStyleSheet().replaceSync == "function");
}
catch { } return !1; })(), q = !!Y && !!C.document && Object.getOwnPropertyDescriptor(C.document.adoptedStyleSheets, "length").writable, B = !1, le = [], be = [], ze = (e, t) => n => { e.push(n), B || (B = !0, t && 4 & _.i ? J(X) : _.raf(X)); }, ce = e => { for (let t = 0; t < e.length; t++)
    try {
        e[t](performance.now());
    }
    catch (n) {
        $(n);
    } e.length = 0; }, X = () => { ce(le), ce(be), (B = le.length > 0) && _.raf(X); }, J = e => Promise.resolve(void 0).then(e), He = ze(be, !0), De = e => { let t = new URL(e, _.u); return t.origin !== C.location.origin ? t.href : t.pathname; };
function Te() { let e = this.attachShadow({ mode: "open" }); x === void 0 && (x = null), x && (q ? e.adoptedStyleSheets.push(x) : e.adoptedStyleSheets = [...e.adoptedStyleSheets, x]); }
var W, A = new WeakMap, we = e => "sc-" + e.p, K = e => (e = typeof e) == "object" || e === "function", L = (e, t, ...n) => { let o = null, r = null, d = !1, i = !1, l = [], c = a => { for (let s = 0; s < a.length; s++)
    o = a[s], Array.isArray(o) ? c(o) : o != null && typeof o != "boolean" && ((d = typeof e != "function" && !K(o)) && (o += ""), d && i ? l[l.length - 1].h += o : l.push(d ? F(null, o) : o), i = d); }; if (c(n), t) {
    t.key && (r = t.key);
    {
        let a = t.className || t.class;
        a && (t.class = typeof a != "object" ? a : Object.keys(a).filter((s => a[s])).join(" "));
    }
} let h = F(e, null); return h.m = t, l.length > 0 && (h.$ = l), h.v = r, h; }, F = (e, t) => ({ i: 0, j: e, h: t ?? null, O: null, $: null, m: null, v: null }), Q = {}, ve = e => { if (!e)
    return; let t = Object.keys(e); if (t.length === 0)
    return; let n = !1; for (let r of t) {
    if (n)
        break;
    for (let d of e[r])
        if (typeof d == "string") {
            n = !0;
            break;
        }
} if (!n)
    return e; let o = {}; for (let r of t)
    o[r] = e[r].map((d => typeof d == "string" ? { [d]: 0 } : d)); return o; }, Se = (e, t) => e == null || K(e) ? e : 4 & t ? e !== "false" && (e === "" || !!e) : 1 & t ? e + "" : e, ae = (e, t, n, o, r, d) => { if (n === o)
    return; let i = se(e, t), l = t.toLowerCase(); if (t === "class") {
    let c = e.classList, h = de(n), a = de(o);
    c.remove(...h.filter((s => s && !a.includes(s)))), c.add(...a.filter((s => s && !h.includes(s))));
}
else if (t === "style") {
    for (let c in n)
        o && o[c] != null || (c.includes("-") ? e.style.removeProperty(c) : e.style[c] = "");
    for (let c in o)
        n && o[c] === n[c] || (c.includes("-") ? e.style.setProperty(c, o[c]) : e.style[c] = o[c]);
}
else if (t !== "key") {
    if (t === "ref")
        o && Ue(o, e);
    else if (e.__lookupSetter__(t) || t[0] !== "o" || t[1] !== "n") {
        if (t[0] === "a" && t.startsWith("attr:")) {
            let c = t.slice(5), h;
            {
                let a = k(e);
                if (a && a.o && a.o.t) {
                    let s = a.o.t[c];
                    s && s[1] && (h = s[1]);
                }
            }
            return h || (h = c.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()), void (o == null || o === !1 ? o === !1 && e.getAttribute(h) !== "" || e.removeAttribute(h) : e.setAttribute(h, o === !0 ? "" : o));
        }
        if (t[0] === "p" && t.startsWith("prop:")) {
            let c = t.slice(5);
            try {
                e[c] = o;
            }
            catch { }
            return;
        }
        {
            let c = K(o);
            if ((i || c && o !== null) && !r)
                try {
                    if (e.tagName.includes("-"))
                        e[t] !== o && (e[t] = o);
                    else {
                        let a = o ?? "";
                        t === "list" ? i = !1 : n != null && e[t] === a || (typeof e.__lookupSetter__(t) == "function" ? e[t] = a : e.setAttribute(t, a));
                    }
                }
                catch { }
            let h = !1;
            l !== (l = l.replace(/^xlink\:?/, "")) && (t = l, h = !0), o == null || o === !1 ? o === !1 && e.getAttribute(t) !== "" || (h ? e.removeAttributeNS(re, t) : e.removeAttribute(t)) : (!i || 4 & d || r) && !c && e.nodeType === 1 && (o = o === !0 ? "" : o, h ? e.setAttributeNS(re, t, o) : e.setAttribute(t, o));
        }
    }
    else if (t = t[2] === "-" ? t.slice(3) : se(C, l) ? l.slice(2) : l[2] + t.slice(3), n || o) {
        let c = t.endsWith(Oe);
        t = t.replace(Ve, ""), n && _.rel(e, t, n, c), o && _.ael(e, t, o, c);
    }
} }, We = /\s/, de = e => (typeof e == "object" && e && "baseVal" in e && (e = e.baseVal), e && typeof e == "string" ? e.split(We) : []), Oe = "Capture", Ve = RegExp(Oe + "$"), Ce = (e, t, n) => { let o = t.O.nodeType === 11 && t.O.host ? t.O.host : t.O, r = e && e.m || {}, d = t.m || {}; for (let i of he(Object.keys(r)))
    i in d || ae(o, i, r[i], void 0, n, t.i); for (let i of he(Object.keys(d)))
    ae(o, i, r[i], d[i], n, t.i); };
function he(e) { return e.includes("ref") ? [...e.filter((t => t !== "ref")), "ref"] : e; }
var _e = !1, je = !1, Z = [], G = [], T = (e, t, n) => { let o = t.$[n], r, d, i = 0; if (o.h != null)
    r = o.O = C.document.createTextNode(o.h);
else {
    if (!C.document)
        throw Error("You are trying to render a Stencil component in an environment that doesn't support the DOM.");
    if (r = o.O = C.document.createElement(o.j), Ce(null, o, je), o.$) {
        let l = o.j === "template" ? r.content : r;
        for (i = 0; i < o.$.length; ++i)
            d = T(e, o, i), d && l.appendChild(d);
    }
} return r["s-hn"] = W, r; }, ue = (e, t, n, o, r, d) => { let i, l = e; for (l.shadowRoot && l.tagName === W && (l = l.shadowRoot), n.j === "template" && (l = l.content); r <= d; ++r)
    o[r] && (i = T(null, n, r), i && (o[r].O = i, P(l, i, t))); }, fe = (e, t, n) => { for (let o = t; o <= n; ++o) {
    let r = e[o];
    if (r) {
        let d = r.O;
        Ae(r), d && d.remove();
    }
} }, z = (e, t, n = !1) => e.j === t.j && (n ? (n && !e.v && t.v && (e.v = t.v), !0) : e.v === t.v), E = (e, t, n = !1) => { let o = t.O = e.O, r = e.$, d = t.$, i = t.h; i == null ? (t.j !== "slot" || _e || e.S !== t.S && (t.O["s-sn"] = t.S || "", (l => { _.i |= 1; let c = l.closest(W.toLowerCase()); if (c != null) {
    let h = Array.from(c.__childNodes || c.childNodes).find((s => s["s-cr"])), a = Array.from(l.__childNodes || l.childNodes);
    for (let s of h ? a.reverse() : a)
        s["s-sh"] != null && (P(c, s, h ?? null), s["s-sh"] = void 0);
} _.i &= -2; })(t.O.parentElement)), Ce(e, t, je), r !== null && d !== null ? ((l, c, h, a, s = !1) => { let f, S, O = 0, v = 0, w = 0, g = 0, p = c.length - 1, m = c[0], y = c[p], u = a.length - 1, b = a[0], j = a[u], ie = h.j === "template" ? l.content : l; for (; O <= p && v <= u;)
    if (m == null)
        m = c[++O];
    else if (y == null)
        y = c[--p];
    else if (b == null)
        b = a[++v];
    else if (j == null)
        j = a[--u];
    else if (z(m, b, s))
        E(m, b, s), m = c[++O], b = a[++v];
    else if (z(y, j, s))
        E(y, j, s), y = c[--p], j = a[--u];
    else if (z(m, j, s))
        E(m, j, s), P(ie, m.O, y.O.nextSibling), m = c[++O], j = a[--u];
    else if (z(y, b, s))
        E(y, b, s), P(ie, y.O, m.O), y = c[--p], b = a[++v];
    else {
        for (w = -1, g = O; g <= p; ++g)
            if (c[g] && c[g].v !== null && c[g].v === b.v) {
                w = g;
                break;
            }
        w >= 0 ? (S = c[w], S.j !== b.j ? f = T(c && c[v], h, w) : (E(S, b, s), c[w] = void 0, f = S.O), b = a[++v]) : (f = T(c && c[v], h, v), b = a[++v]), f && P(m.O.parentNode, f, m.O);
    } O > p ? ue(l, a[u + 1] == null ? null : a[u + 1].O, h, a, v, u) : v > u && fe(c, O, p); })(o, r, t, d, n) : d !== null ? (e.h !== null && (o.textContent = ""), ue(o, null, t, d, 0, d.length - 1)) : !n && r !== null && fe(r, 0, r.length - 1)) : e.h !== i && (o.data = i); }, Ae = e => { e.m && e.m.ref && Z.push((() => e.m.ref(null))), e.$ && e.$.map(Ae); }, Ue = (e, t) => { G.push((() => e(t))); }, P = (e, t, n) => e.__insertBefore ? e.__insertBefore(t, n) : e?.insertBefore(t, n), qe = (e, t, n = !1) => { let o = e.$hostElement$, r = e.o, d = e.M || F(null, null), i = (l => l && l.j === Q)(t) ? t : L(null, null, t); if (W = o.tagName, r.k && (i.m = i.m || {}, r.k.forEach((([l, c]) => { i.m[c] = o[l]; }))), n && i.m)
    for (let l of Object.keys(i.m))
        o.hasAttribute(l) && !["key", "ref", "style", "class"].includes(l) && (i.m[l] = o[l]); i.j = null, i.i |= 4, e.M = i, i.O = d.O = o.shadowRoot || o, _e = !(!(1 & r.i) || 128 & r.i), E(d, i, n), Z.forEach((l => l())), Z.length = 0, G.forEach((l => l())), G.length = 0; }, ke = (e, t) => { if (t && !e.A && t["s-p"]) {
    let n = t["s-p"].push(new Promise((o => e.A = () => { t["s-p"].splice(n - 1, 1), o(); })));
} }, ee = (e, t) => { if (e.i |= 16, 4 & e.i)
    return void (e.i |= 512); ke(e, e.C); let n = () => Be(e, t); if (!t)
    return He(n); queueMicrotask((() => { n(); })); }, Be = (e, t) => { let n = e.$hostElement$, o = n; if (!o)
    throw Error(`Can't render component <${n.tagName.toLowerCase()} /> with invalid Stencil runtime! Make sure this imported component is compiled with a \`externalRuntime: true\` flag. For more information, please refer to https://stenciljs.com/docs/custom-elements#externalruntime`); let r; return r = I(o, t ? "componentWillLoad" : "componentWillUpdate", void 0, n), r = pe(r, (() => I(o, "componentWillRender", void 0, n))), pe(r, (() => Fe(e, o, t))); }, pe = (e, t) => Xe(e) ? e.then(t).catch((n => { console.error(n), t(); })) : t(), Xe = e => e instanceof Promise || e && e.then && typeof e.then == "function", Fe = (e, t, n) => M(null, null, function* () { var o; let r = e.$hostElement$, d = r["s-rc"]; n && (i => { let l = i.o, c = i.$hostElement$, h = l.i, a = ((s, f) => { var S, O, v; let w = we(f), g = D.get(w); if (!C.document)
    return w; if (s = s.nodeType === 11 ? s : C.document, g)
    if (typeof g == "string") {
        let p, m = A.get(s = s.head || s);
        if (m || A.set(s, m = new Set), !m.has(w)) {
            p = C.document.createElement("style"), p.textContent = g;
            let y = (S = _.W) != null ? S : (function () { var u, b, j; return (j = (b = (u = C.document.head) == null ? void 0 : u.querySelector('meta[name="csp-nonce"]')) == null ? void 0 : b.getAttribute("content")) != null ? j : void 0; })();
            if (y != null && p.setAttribute("nonce", y), !(1 & f.i))
                if (s.nodeName === "HEAD") {
                    let u = s.querySelectorAll("link[rel=preconnect]"), b = u.length > 0 ? u[u.length - 1].nextSibling : s.querySelector("style");
                    s.insertBefore(p, b?.parentNode === s ? b : null);
                }
                else if ("host" in s)
                    if (Y) {
                        let u = new ((O = s.defaultView) != null ? O : s.ownerDocument.defaultView).CSSStyleSheet;
                        u.replaceSync(g), q ? s.adoptedStyleSheets.unshift(u) : s.adoptedStyleSheets = [u, ...s.adoptedStyleSheets];
                    }
                    else {
                        let u = s.querySelector("style");
                        u ? u.textContent = g + u.textContent : s.prepend(p);
                    }
                else
                    s.append(p);
            1 & f.i && s.insertBefore(p, null), 4 & f.i && (p.textContent += "slot-fb{display:contents}slot-fb[hidden]{display:none}"), m && m.add(w);
        }
    }
    else {
        let p = A.get(s);
        if (p || A.set(s, p = new Set), !p.has(w)) {
            let m = (v = s.defaultView) != null ? v : s.ownerDocument.defaultView, y;
            if (g.constructor === m.CSSStyleSheet)
                y = g;
            else {
                y = new m.CSSStyleSheet;
                for (let u = 0; u < g.cssRules.length; u++)
                    y.insertRule(g.cssRules[u].cssText, u);
            }
            q ? s.adoptedStyleSheets.push(y) : s.adoptedStyleSheets = [...s.adoptedStyleSheets, y], p.add(w);
        }
    } return w; })(c.shadowRoot ? c.shadowRoot : c.getRootNode(), l); 10 & h && (c["s-sc"] = a, c.classList.add(a + "-h")); })(e), Ze(e, t, r, n), d && (d.map((i => i())), r["s-rc"] = void 0); {
    let i = (o = r["s-p"]) != null ? o : [], l = () => Ge(e);
    i.length === 0 ? l() : (Promise.all(i).then(l).catch(l), e.i |= 4, i.length = 0);
} }), Ze = (e, t, n, o) => { try {
    t = t.render(), e.i &= -17, e.i |= 2, qe(e, t, o);
}
catch (r) {
    $(r, e.$hostElement$);
} return null; }, Ge = e => { let t = e.$hostElement$, n = t, o = e.C; I(n, "componentDidRender", void 0, t), 64 & e.i ? I(n, "componentDidUpdate", void 0, t) : (e.i |= 64, Je(t), I(n, "componentDidLoad", void 0, t), e.L(t), o || Ye()), e.A && (e.A(), e.A = void 0), 512 & e.i && J((() => ee(e, !1))), e.i &= -517; }, Ye = () => { J((() => (e => { let t = _.ce("appload", { detail: { namespace: "ionicons" } }); return e.dispatchEvent(t), t; })(C))); }, I = (e, t, n, o) => { if (e && e[t])
    try {
        return e[t](n);
    }
    catch (r) {
        $(r, o);
    } }, Je = e => e.classList.add("hydrated"), me = (e, t, n, o) => { let r = k(e); if (!r)
    return; let d = e, i = r.l.get(t), l = r.i, c = d; if (!((n = Se(n, o.t[t][0])) === i || Number.isNaN(i) && Number.isNaN(n))) {
    if (r.l.set(t, n), o._) {
        let h = o._[t];
        h && h.map((a => { try {
            let [[s, f]] = Object.entries(a);
            (128 & l || 1 & f) && (c ? c[s](n, i, t) : r.D.push((() => { r.H[s](n, i, t); })));
        }
        catch (s) {
            $(s, d);
        } }));
    }
    if (2 & l) {
        if (c.componentShouldUpdate && c.componentShouldUpdate(n, i, t) === !1 && !(16 & l))
            return;
        16 & l || ee(r, !1);
    }
} }, Ke = (e, t) => { var n, o; let r = e.prototype; {
    e.watchers && !t._ && (t._ = ve(e.watchers)), e.deserializers && !t.P && (t.P = e.deserializers), e.serializers && !t.R && (t.R = e.serializers);
    let d = Object.entries((n = t.t) != null ? n : {});
    d.map((([i, [l]]) => { if (31 & l || 32 & l) {
        let { get: c, set: h } = ge(r, i) || {};
        c && (t.t[i][0] |= 2048), h && (t.t[i][0] |= 4096), Object.defineProperty(r, i, { get() { return c ? c.apply(this) : ((a, s) => k(this).l.get(s))(0, i); }, configurable: !0, enumerable: !0 }), Object.defineProperty(r, i, { set(a) { let s = k(this); if (s) {
                if (h)
                    return (32 & l ? this[i] : s.$hostElement$[i]) === void 0 && s.l.get(i) && (a = s.l.get(i)), h.call(this, Se(a, l)), void me(this, i, a = 32 & l ? this[i] : s.$hostElement$[i], t);
                me(this, i, a, t);
            } } });
    } }));
    {
        let i = new Map;
        r.attributeChangedCallback = function (l, c, h) { _.jmp((() => { var a; let s = i.get(l), f = k(this); if (this.hasOwnProperty(s), r.hasOwnProperty(s) && typeof this[s] == "number" && this[s] == h)
            return; if (s == null) {
            let g = f?.i;
            if (f && g && !(8 & g) && h !== c) {
                let p = this, m = (a = t._) == null ? void 0 : a[l];
                m?.forEach((y => { let [[u, b]] = Object.entries(y); p[u] != null && (128 & g || 1 & b) && p[u].call(p, h, c, l); }));
            }
            return;
        } let S = d.find((([g]) => g === s)), O = S && 4 & S[1][0], v = O && h === null && this[s] === void 0; O && (h = h !== null && h !== "false"); let w = Object.getOwnPropertyDescriptor(r, s); v || h == this[s] || w.get && !w.set || (this[s] = h); })); }, e.observedAttributes = Array.from(new Set([...Object.keys((o = t._) != null ? o : {}), ...d.filter((([l, c]) => 31 & c[0])).map((([l, c]) => { var h; let a = c[1] || l; return i.set(a, l), 512 & c[0] && ((h = t.k) == null || h.push([l, a])), a; }))]));
    }
} return e; }, Ee = (e, t) => { let n = { i: t[0], p: t[1] }; try {
    n.t = t[2], n._ = ve(e._), n.P = e.P, n.R = e.R, n.k = [];
    let o = e.prototype.connectedCallback, r = e.prototype.disconnectedCallback;
    return Object.assign(e.prototype, { __hasHostListenerAttached: !1, __registerHost() { ((d, i) => { let l = { i: 0, $hostElement$: d, o: i, l: new Map, U: new Map }; l.N = new Promise((h => l.L = h)), d["s-p"] = [], d["s-rc"] = []; let c = l; d.__stencil__getHostRef = () => c, 512 & i.i && Me(d, l); })(this, n); }, connectedCallback() { if (!this.__hasHostListenerAttached) {
            if (!k(this))
                return;
            this.__hasHostListenerAttached = !0;
        } (d => { if (!(1 & _.i)) {
            let i = k(d);
            if (!i)
                return;
            let l = i.o, c = () => { };
            if (1 & i.i)
                i?.H || i?.N && i.N.then((() => { }));
            else {
                i.i |= 1;
                {
                    let h = d;
                    for (; h = h.parentNode || h.host;)
                        if (h["s-p"]) {
                            ke(i, i.C = h);
                            break;
                        }
                }
                l.t && Object.entries(l.t).map((([h, [a]]) => { if (31 & a && Object.prototype.hasOwnProperty.call(d, h)) {
                    let s = d[h];
                    delete d[h], d[h] = s;
                } })), ((h, a, s) => M(this, null, function* () { let f; try {
                    if (!(32 & a.i) && (a.i |= 32, f = h.constructor, customElements.whenDefined(h.localName).then((() => a.i |= 128)), f && f.style)) {
                        let v;
                        typeof f.style == "string" && (v = f.style);
                        let w = we(s);
                        if (!D.has(w)) {
                            let g = () => { };
                            ((p, m, y) => { let u = D.get(p); Y && y ? (u = u || new CSSStyleSheet, typeof u == "string" ? u = m : u.replaceSync(m)) : u = m, D.set(p, u); })(w, v, !!(1 & s.i)), g();
                        }
                    }
                    let S = a.C, O = () => ee(a, !0);
                    S && S["s-rc"] ? S["s-rc"].push(O) : O();
                }
                catch (S) {
                    $(S, h), a.A && (a.A(), a.A = void 0), a.L && a.L(h);
                } }))(d, i, l);
            }
            c();
        } })(this), o && o.call(this); }, disconnectedCallback() { (d => M(null, null, function* () { A.has(d) && A.delete(d), d.shadowRoot && A.has(d.shadowRoot) && A.delete(d.shadowRoot); }))(this), r && r.call(this); }, __attachShadow() { if (this.shadowRoot) {
            if (this.shadowRoot.mode !== "open")
                throw Error(`Unable to re-use existing shadow root for ${n.p}! Mode is set to ${this.shadowRoot.mode} but Stencil only supports open shadow roots.`);
        }
        else
            Te.call(this, n); } }), Object.defineProperty(e, "is", { value: n.p, configurable: !0 }), Ke(e, n);
}
catch (o) {
    return $(o), e;
} };
var V, Qe = () => { if (typeof window > "u")
    return new Map; if (!V) {
    let e = window;
    e.Ionicons = e.Ionicons || {}, V = e.Ionicons.map = e.Ionicons.map || new Map;
} return V; };
var $e = e => { let t = U(e.src); return t || (t = te(e.name, e.icon, e.mode, e.ios, e.md), t ? et(t, e) : e.icon && (t = U(e.icon), t || (t = U(e.icon[e.mode]), t)) ? t : null); }, et = (e, t) => { let n = Qe().get(e); if (n)
    return n; try {
    return De(`svg/${e}.svg`);
}
catch (o) {
    console.log("e", o), console.warn(`[Ionicons Warning]: Could not load icon with name "${e}". Ensure that the icon is registered using addIcons or that the icon SVG data is passed directly to the icon component.`, t);
} }, te = (e, t, n, o, r) => (n = (n && H(n)) === "ios" ? "ios" : "md", o && n === "ios" ? e = H(o) : r && n === "md" ? e = H(r) : (e || !t || Le(t) || (e = t), R(e) && (e = H(e))), R(e) && e.trim() !== "" ? e.replace(/[a-z]|-|\d/gi, "") !== "" ? null : e : null), U = e => R(e) && (e = e.trim(), Le(e)) ? e : null, Le = e => e.length > 0 && /(\/|\.)/.test(e), R = e => typeof e == "string", H = e => e.toLowerCase(), Ne = (e, t = []) => { let n = {}; return t.forEach((o => { e.hasAttribute(o) && (e.getAttribute(o) !== null && (n[o] = e.getAttribute(o)), e.removeAttribute(o)); })), n; }, xe = e => e && e.dir !== "" ? e.dir.toLowerCase() === "rtl" : document?.dir.toLowerCase() === "rtl";
var Ie = e => { if (e.nodeType === 1) {
    if (e.nodeName.toLowerCase() === "script")
        return !1;
    for (let t = 0; t < e.attributes.length; t++) {
        let n = e.attributes[t].name;
        if (R(n) && n.toLowerCase().indexOf("on") === 0)
            return !1;
    }
    for (let t = 0; t < e.childNodes.length; t++)
        if (!Ie(e.childNodes[t]))
            return !1;
} return !0; }, N = new Map, Pe = new Map, oe;
function ne(e) { return N.set(e, ""), ""; }
var Re = Ee(class extends ye {
    constructor(e) { super(), e !== !1 && this.__registerHost(), this.__attachShadow(), this.iconName = null, this.inheritedAttributes = {}, this.didLoadIcon = !1, this.isVisible = !1, this.mode = tt(), this.lazy = !1, this.sanitize = !0; }
    componentWillLoad() { this.inheritedAttributes = Ne(this.el, ["aria-label"]); }
    connectedCallback() { this.waitUntilVisible(this.el, "50px", (() => { this.isVisible = !0, this.loadIcon(); })); }
    componentDidLoad() { this.didLoadIcon || this.loadIcon(); }
    disconnectedCallback() { this.io && (this.io.disconnect(), this.io = void 0); }
    waitUntilVisible(e, t, n) { if (!this.lazy || typeof window > "u" || !window.IntersectionObserver)
        return n(); let o = this.io = new window.IntersectionObserver((r => { r[0].isIntersecting && (o.disconnect(), this.io = void 0, n()); }), { rootMargin: t }); o.observe(e); }
    loadIcon() { if (this.isVisible) {
        let e = $e(this);
        e && (N.has(e) ? this.svgContent = N.get(e) : ((t, n) => Pe.get(t) || (typeof fetch < "u" && typeof document < "u" ? (o => o.startsWith("data:image/svg+xml"))(t) && (o => o.indexOf(";utf8,") !== -1)(t) ? Promise.resolve((function (o) { oe || (oe = new DOMParser); let r = oe.parseFromString(o, "text/html").querySelector("svg"); if (r)
            return N.set(o, r.outerHTML), r.outerHTML; throw Error("Could not parse svg from " + o); })(t)) : (function (o, r) { let d = fetch(o).then((i => i.text().then((l => { l && r !== !1 && (l = (h => { let a = document.createElement("div"); a.innerHTML = h; for (let f = a.childNodes.length - 1; f >= 0; f--)
            a.childNodes[f].nodeName.toLowerCase() !== "svg" && a.removeChild(a.childNodes[f]); let s = a.firstElementChild; if (s && s.nodeName.toLowerCase() === "svg") {
            let f = s.getAttribute("class") || "";
            if (s.setAttribute("class", (f + " s-ion-icon").trim()), Ie(s))
                return a.innerHTML;
        } return ""; })(l)); let c = l || ""; return N.set(o, c), c; })).catch((() => ne(o))))).catch((() => ne(o))); return Pe.set(o, d), d; })(t, n) : Promise.resolve(ne(t))))(e, this.sanitize).then((() => this.svgContent = N.get(e))), this.didLoadIcon = !0);
    } this.iconName = te(this.name, this.icon, this.mode, this.ios, this.md); }
    render() { let { flipRtl: e, iconName: t, inheritedAttributes: n, el: o } = this, r = this.mode || "md", d = !!t && (t.includes("arrow") || t.includes("chevron")) && e !== !1, i = e || d; return L(Q, Object.assign({ key: "0578c899781ca145dd8205acd9670af39b57cf2e", role: "img", class: Object.assign(Object.assign({ [r]: !0 }, ot(this.color)), { ["icon-" + this.size]: !!this.size, "flip-rtl": i, "icon-rtl": i && xe(o) }) }, n), this.svgContent ? L("div", { class: "icon-inner", innerHTML: this.svgContent }) : L("div", { class: "icon-inner" }, L("slot", null))); }
    static get assetsDirs() { return ["svg"]; }
    get el() { return this; }
    static get watchers() { return { name: [{ loadIcon: 0 }], src: [{ loadIcon: 0 }], icon: [{ loadIcon: 0 }], ios: [{ loadIcon: 0 }], md: [{ loadIcon: 0 }] }; }
    static get style() { return ":host{display:inline-block;width:1em;height:1em;font-size:1em;contain:layout style;fill:currentColor;box-sizing:content-box !important}:host .ionicon{stroke:currentColor}.ionicon-fill-none{fill:none}.ionicon-stroke-width{stroke-width:var(--ionicon-stroke-width, 32px)}.icon-inner{display:flex;align-items:center;justify-content:center;width:100%;height:100%}.ionicon,svg{display:block;height:100%;width:100%}::slotted(*){font-size:inherit !important}@supports (background: -webkit-named-image(i)){:host(.icon-rtl) .icon-inner{transform:scaleX(-1)}}@supports not selector(:dir(rtl)) and selector(:host-context([dir='rtl'])){:host(.icon-rtl) .icon-inner{transform:scaleX(-1)}}:host(.flip-rtl):host-context([dir='rtl']) .icon-inner{transform:scaleX(-1)}@supports selector(:dir(rtl)){:host(.flip-rtl:dir(rtl)) .icon-inner{transform:scaleX(-1)}:host(.flip-rtl:dir(ltr)) .icon-inner{transform:scaleX(1)}}:host(.icon-small){font-size:1.125rem !important}:host(.icon-large){font-size:2rem !important}:host(.ion-color){color:var(--ion-color-base) !important}:host(.ion-color-primary){--ion-color-base:var(--ion-color-primary, #3880ff)}:host(.ion-color-secondary){--ion-color-base:var(--ion-color-secondary, #0cd1e8)}:host(.ion-color-tertiary){--ion-color-base:var(--ion-color-tertiary, #f4a942)}:host(.ion-color-success){--ion-color-base:var(--ion-color-success, #10dc60)}:host(.ion-color-warning){--ion-color-base:var(--ion-color-warning, #ffce00)}:host(.ion-color-danger){--ion-color-base:var(--ion-color-danger, #f14141)}:host(.ion-color-light){--ion-color-base:var(--ion-color-light, #f4f5f8)}:host(.ion-color-medium){--ion-color-base:var(--ion-color-medium, #989aa2)}:host(.ion-color-dark){--ion-color-base:var(--ion-color-dark, #222428)}"; }
}, [257, "ion-icon", { mode: [1025], color: [1], ios: [1], md: [1], flipRtl: [4, "flip-rtl"], name: [513], src: [1], icon: [8], size: [1], lazy: [4], sanitize: [4], svgContent: [32], isVisible: [32] }, void 0, { name: [{ loadIcon: 0 }], src: [{ loadIcon: 0 }], icon: [{ loadIcon: 0 }], ios: [{ loadIcon: 0 }], md: [{ loadIcon: 0 }] }]), tt = () => typeof document < "u" && document.documentElement.getAttribute("mode") || "md", ot = e => e ? { "ion-color": !0, ["ion-color-" + e]: !0 } : null, ct = Re, at = function () { typeof customElements < "u" && ["ion-icon"].forEach((e => { e === "ion-icon" && (customElements.get(e) || customElements.define(e, Re)); })); };
export { ct as IonIcon, at as defineCustomElement };
