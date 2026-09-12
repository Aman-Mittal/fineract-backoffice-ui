import { a as g } from "@nf-internal/chunk-QAKPNJZU";
import { c as v, g as Y, h as H, i as P, l as N } from "@nf-internal/chunk-AFC3S5XK";
import { a as k } from "@nf-internal/chunk-5OCVSD5Y";
import { a as U, d as K, e as J } from "@nf-internal/chunk-QIAUKDMS";
import { a as h, b as $, c as z, d as W, e as w, f as I, o as G, p as X } from "@nf-internal/chunk-OU2VS4HL";
import { b as M } from "@nf-internal/chunk-JYWXGWOM";
import { e as p } from "@nf-internal/chunk-JHI3MBHO";
var fe = (e, t, n, i, o) => ge(e[1], t[1], n[1], i[1], o).map((s => he(e[0], t[0], n[0], i[0], s))), he = (e, t, n, i, o) => o * (3 * t * Math.pow(o - 1, 2) + o * (-3 * n * o + 3 * n + i * o)) - e * Math.pow(o - 1, 3), ge = (e, t, n, i, o) => ve((i -= o) - 3 * (n -= o) + 3 * (t -= o) - (e -= o), 3 * n - 6 * t + 3 * e, 3 * t - 3 * e, e).filter((s => s >= 0 && s <= 1)), ve = (e, t, n, i) => { if (e === 0)
    return ((a, l, f) => { let u = l * l - 4 * a * f; return u < 0 ? [] : [(-l + Math.sqrt(u)) / (2 * a), (-l - Math.sqrt(u)) / (2 * a)]; })(t, n, i); let o = (3 * (n /= e) - (t /= e) * t) / 3, s = (2 * t * t * t - 9 * t * n + 27 * (i /= e)) / 27; if (o === 0)
    return [Math.pow(-s, .3333333333333333)]; if (s === 0)
    return [Math.sqrt(-o), -Math.sqrt(-o)]; let d = Math.pow(s / 2, 2) + Math.pow(o / 3, 3); if (d === 0)
    return [Math.pow(s / 2, .5) - t / 3]; if (d > 0)
    return [Math.pow(-s / 2 + Math.sqrt(d), .3333333333333333) - Math.pow(s / 2 + Math.sqrt(d), .3333333333333333) - t / 3]; let c = Math.sqrt(Math.pow(-o / 3, 3)), m = Math.acos(-s / (2 * Math.sqrt(Math.pow(-o / 3, 3)))), r = 2 * Math.pow(c, 1 / 3); return [r * Math.cos(m / 3) - t / 3, r * Math.cos((m + 2 * Math.PI) / 3) - t / 3, r * Math.cos((m + 4 * Math.PI) / 3) - t / 3]; };
var te = e => oe(e), ne = (e, t) => (typeof e == "string" && (t = e, e = void 0), te(e).includes(t)), oe = (e = window) => { if (e === void 0)
    return []; e.Ionic = e.Ionic || {}; let t = e.Ionic.platforms; return t == null && (t = e.Ionic.platforms = we(e), t.forEach((n => e.document.documentElement.classList.add(`plt-${n}`)))), t; }, we = e => { let t = h.get("platform"); return Object.keys(ee).filter((n => { let i = t?.[n]; return typeof i == "function" ? i(e) : ee[n](e); })); }, D = e => !!b(e, /iPad/i) || !(!b(e, /Macintosh/i) || !L(e)), Q = e => b(e, /android|sink/i), L = e => be(e, "(any-pointer:coarse)"), Z = e => ie(e) || se(e), ie = e => !!(e.cordova || e.phonegap || e.PhoneGap), se = e => { let t = e.Capacitor; return !!(t?.isNative || t?.isNativePlatform && t.isNativePlatform()); }, b = (e, t) => t.test(e.navigator.userAgent), be = (e, t) => { var n; return (n = e.matchMedia) === null || n === void 0 ? void 0 : n.call(e, t).matches; }, ee = { ipad: D, iphone: e => b(e, /iPhone/i), ios: e => b(e, /iPhone|iPod/i) || D(e), android: Q, phablet: e => { let t = e.innerWidth, n = e.innerHeight, i = Math.min(t, n), o = Math.max(t, n); return i > 390 && i < 520 && o > 620 && o < 800; }, tablet: e => { let t = e.innerWidth, n = e.innerHeight, i = Math.min(t, n), o = Math.max(t, n); return D(e) || (s => Q(s) && !b(s, /mobile/i))(e) || i > 460 && i < 820 && o > 780 && o < 1400; }, cordova: ie, capacitor: se, electron: e => b(e, /electron/i), pwa: e => { var t; return !(!(!((t = e.matchMedia) === null || t === void 0) && t.call(e, "(display-mode: standalone)").matches) && !e.navigator.standalone); }, mobile: L, mobileweb: e => L(e) && !Z(e), desktop: e => !L(e), hybrid: Z }, O, y = e => e && X(e) || O, ye = (e = {}) => { if (typeof window > "u")
    return; let t = window.document, n = window, i = n.Ionic = n.Ionic || {}, o = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, $(n)), { persistConfig: !1 }), i.config), W(n)), e); h.reset(o), h.getBoolean("persistConfig") && z(n, o), oe(n), i.config = h, i.mode = O = h.get("mode", t.documentElement.getAttribute("mode") || (ne(n, "ios") ? "ios" : "md")), h.set("mode", O), t.documentElement.setAttribute("mode", O), t.documentElement.classList.add(O), h.getBoolean("_testing") && h.set("animated", !1); let s = c => { var m; return (m = c.tagName) === null || m === void 0 ? void 0 : m.startsWith("ION-"); }, d = c => ["ios", "md"].includes(c); G((c => { for (; c;) {
    let m = c.mode || c.getAttribute("mode");
    if (m) {
        if (d(m))
            return m;
        s(c) && w('Invalid ionic mode: "' + m + '", expected: "ios" or "md"');
    }
    c = c.parentElement;
} return O; })); };
var Ue = e => { try {
    if (e instanceof A)
        return e.value;
    if (!Ee() || typeof e != "string" || e === "")
        return e;
    if (e.includes("onload="))
        return "";
    let t = document.createDocumentFragment(), n = document.createElement("div");
    t.appendChild(n), n.innerHTML = e, Oe.forEach((d => { let c = t.querySelectorAll(d); for (let m = c.length - 1; m >= 0; m--) {
        let r = c[m];
        r.parentNode ? r.parentNode.removeChild(r) : t.removeChild(r);
        let a = F(r);
        for (let l = 0; l < a.length; l++)
            q(a[l]);
    } }));
    let i = F(t);
    for (let d = 0; d < i.length; d++)
        q(i[d]);
    let o = document.createElement("div");
    o.appendChild(t);
    let s = o.querySelector("div");
    return s !== null ? s.innerHTML : o.innerHTML;
}
catch (t) {
    return I("sanitizeDOMString", t), "";
} }, q = e => { if (e.nodeType && e.nodeType !== 1)
    return; if (typeof NamedNodeMap < "u" && !(e.attributes instanceof NamedNodeMap))
    return void e.remove(); for (let n = e.attributes.length - 1; n >= 0; n--) {
    let i = e.attributes.item(n), o = i.name;
    if (!Me.includes(o.toLowerCase())) {
        e.removeAttribute(o);
        continue;
    }
    let s = i.value, d = e[o];
    (s != null && s.toLowerCase().includes("javascript:") || d != null && d.toLowerCase().includes("javascript:")) && e.removeAttribute(o);
} let t = F(e); for (let n = 0; n < t.length; n++)
    q(t[n]); }, F = e => e.children != null ? e.children : e.childNodes, Ee = () => { var e; let t = window, n = (e = t?.Ionic) === null || e === void 0 ? void 0 : e.config; return !n || (n.get ? n.get("sanitizerEnabled", !0) : n.sanitizerEnabled === !0 || n.sanitizerEnabled === void 0); }, Me = ["class", "id", "href", "src", "name", "slot"], Oe = ["script", "style", "iframe", "meta", "link", "object", "embed"], A = class {
    constructor(t) { this.value = t; }
};
var Ke = !1;
var Qe = (e, t) => t.closest(e) !== null, Ze = (e, t) => typeof e == "string" && e.length > 0 ? Object.assign({ "ion-color": !0, [`ion-color-${e}`]: !0 }, t) : t, et = e => { let t = {}; return (n => n !== void 0 ? (Array.isArray(n) ? n : n.split(" ")).filter((i => i != null)).map((i => i.trim())).filter((i => i !== "")) : [])(e).forEach((n => t[n] = !0)), t; }, Se = /^[a-z][a-z0-9+\-.]*:/, tt = (e, t, n, i) => p(null, null, function* () { if (e != null && e[0] !== "#" && !Se.test(e)) {
    let o = document.querySelector("ion-router");
    if (o)
        return t?.preventDefault(), o.push(e, n, i);
} return !1; });
var _ = e => g().duration(e ? 400 : 300), xe = e => { let t, n, i = e.width + 8, o = g(), s = g(); e.isEndSide ? (t = i + "px", n = "0px") : (t = -i + "px", n = "0px"), o.addElement(e.menuInnerEl).fromTo("transform", `translateX(${t})`, `translateX(${n})`); let d = y(e) === "ios", c = d ? .2 : .25; return s.addElement(e.backdropEl).fromTo("opacity", .01, c), _(d).addAnimation([o, s]); }, Ce = e => { let t, n, i = y(e), o = e.width; e.isEndSide ? (t = -o + "px", n = o + "px") : (t = o + "px", n = -o + "px"); let s = g().addElement(e.menuInnerEl).fromTo("transform", `translateX(${n})`, "translateX(0px)"), d = g().addElement(e.contentEl).fromTo("transform", "translateX(0px)", `translateX(${t})`), c = g().addElement(e.backdropEl).fromTo("opacity", .01, .32); return _(i === "ios").addAnimation([s, d, c]); }, Ie = e => { let t = y(e), n = e.width * (e.isEndSide ? -1 : 1) + "px", i = g().addElement(e.contentEl).fromTo("transform", "translateX(0px)", `translateX(${n})`); return _(t === "ios").addAnimation(i); }, Le = (() => { let e = new Map, t = [], n = (r, a = !1) => p(null, null, function* () { if (yield m(), r === "start" || r === "end") {
    let l = t.filter((u => u.side === r && !u.disabled));
    if (l.length >= 1)
        return l.length > 1 && a && w(`menuController queried for a menu on the "${r}" side, but ${l.length} menus were found. The first menu reference will be used. If this is not the behavior you want then pass the ID of the menu instead of its side.`, l.map((u => u.el))), l[0].el;
    let f = t.filter((u => u.side === r));
    if (f.length >= 1)
        return f.length > 1 && a && w(`menuController queried for a menu on the "${r}" side, but ${f.length} menus were found. The first menu reference will be used. If this is not the behavior you want then pass the ID of the menu instead of its side.`, f.map((u => u.el))), f[0].el;
}
else if (r != null)
    return c((l => l.menuId === r)); return c((l => !l.disabled)) || (t.length > 0 ? t[0].el : void 0); }), i = () => p(null, null, function* () { return yield m(), s(); }), o = (r, a) => { e.set(r, a); }, s = () => c((r => r._isOpen)), d = () => t.some((r => r.isAnimating)), c = r => { let a = t.find(r); if (a !== void 0)
    return a.el; }, m = () => Promise.all(Array.from(document.querySelectorAll("ion-menu")).map((r => new Promise((a => v(r, a)))))); return o("reveal", Ie), o("push", Ce), o("overlay", xe), M == null || M.addEventListener("ionBackButton", (r => { let a = s(); a && r.detail.register(J, (() => a.close())); })), { registerAnimation: o, get: n, getMenus: () => p(null, null, function* () { return yield m(), t.map((r => r.el)); }), getOpen: i, isEnabled: r => p(null, null, function* () { let a = yield n(r); return !!a && !a.disabled; }), swipeGesture: (r, a) => p(null, null, function* () { let l = yield n(a); return l && (l.swipeGesture = r), l; }), isAnimating: () => p(null, null, function* () { return yield m(), d(); }), isOpen: r => p(null, null, function* () { if (r != null) {
        let a = yield n(r);
        return a !== void 0 && a.isOpen();
    } return (yield i()) !== void 0; }), enable: (r, a) => p(null, null, function* () { let l = yield n(a); return l && (l.disabled = !r), l; }), toggle: r => p(null, null, function* () { let a = yield n(r, !0); return !!a && a.toggle(); }), close: r => p(null, null, function* () { let a = yield r !== void 0 ? n(r, !0) : i(); return a !== void 0 && a.close(); }), open: r => p(null, null, function* () { let a = yield n(r, !0); return !!a && a.open(); }), _getOpenSync: s, _createAnimation: (r, a) => { let l = e.get(r); if (!l)
        throw new Error("animation not registered"); return l(a); }, _register: r => { t.indexOf(r) < 0 && t.push(r); }, _unregister: r => { let a = t.indexOf(r); a > -1 && t.splice(a, 1); }, _setOpen: (r, a, l, f) => p(null, null, function* () { if (d())
        return !1; if (a) {
        let u = yield i();
        u && r.el !== u && (yield u.setOpen(!1, !1));
    } return r._setOpen(a, l, f); }) }; })();
var pt = (e, t, n, i, o, s) => p(null, null, function* () { var d; if (e)
    return e.attachViewToDom(t, n, o, i); if (!(s || typeof n == "string" || n instanceof HTMLElement))
    throw new Error("framework delegate is missing"); let c = typeof n == "string" ? (d = t.ownerDocument) === null || d === void 0 ? void 0 : d.createElement(n) : n; return i && i.forEach((m => c.classList.add(m))), o && Object.assign(c, o), t.appendChild(c), yield new Promise((m => v(c, m))), c; }), ft = (e, t) => { if (t) {
    if (e)
        return e.removeViewFromDom(t.parentElement, t);
    t.remove();
} return Promise.resolve(); }, re = () => { let e, t; return { attachViewToDom: (d, c, ...m) => p(null, [d, c, ...m], function* (n, i, o = {}, s = []) { var r, a; let l; if (e = n, i) {
        let u = typeof i == "string" ? (r = e.ownerDocument) === null || r === void 0 ? void 0 : r.createElement(i) : i;
        s.forEach((S => u.classList.add(S))), Object.assign(u, o), e.appendChild(u), l = u, yield new Promise((S => v(u, S)));
    }
    else if (e.children.length > 0 && (e.tagName === "ION-MODAL" || e.tagName === "ION-POPOVER") && !(l = e.children[0]).classList.contains("ion-delegate-host")) {
        let u = (a = e.ownerDocument) === null || a === void 0 ? void 0 : a.createElement("div");
        u.classList.add("ion-delegate-host"), s.forEach((S => u.classList.add(S))), u.append(...e.children), e.appendChild(u), l = u;
    } let f = document.querySelector("ion-app") || document.body; return t = document.createComment("ionic teleport"), e.parentNode.insertBefore(t, e), f.appendChild(e), l ?? e; }), removeViewFromDom: () => (e && t && (t.parentNode.insertBefore(e, t), t.remove()), Promise.resolve()) }; };
var C = '[tabindex]:not([tabindex^="-"]):not([hidden]):not([disabled]), input:not([type=hidden]):not([tabindex^="-"]):not([hidden]):not([disabled]), textarea:not([tabindex^="-"]):not([hidden]):not([disabled]), button:not([tabindex^="-"]):not([hidden]):not([disabled]), select:not([tabindex^="-"]):not([hidden]):not([disabled]), ion-checkbox:not([tabindex^="-"]):not([hidden]):not([disabled]), ion-radio:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable[disabled="false"]:not([tabindex^="-"]):not([hidden])', ae = (e, t) => { let n = e.querySelector(C); ce(n, t ?? e); }, le = (e, t) => { let n = Array.from(e.querySelectorAll(C)); ce(n.length > 0 ? n[n.length - 1] : null, t ?? e); }, ce = (e, t) => { let n = e, i = e?.shadowRoot; if (i && (n = i.querySelector(C) || e), n) {
    let o = n.closest("ion-radio-group");
    o ? o.setFocus() : N(n);
}
else
    t.focus(); }, j = 0, Ae = 0, T = new WeakMap, R = e => { var t; return e.showBackdrop !== !1 && !(((t = e.backdropBreakpoint) !== null && t !== void 0 ? t : 0) > 0); }, E = e => ({ create: t => _e(e, t), dismiss: (t, n, i) => Re(document, t, n, e, i), getTop: () => p(null, null, function* () { return x(document, e); }) }), Te = E("ion-alert"), Pe = E("ion-action-sheet"), Ne = E("ion-loading"), ke = E("ion-modal"), De = E("ion-picker-legacy"), qe = E("ion-popover"), Fe = E("ion-toast"), St = e => { typeof document < "u" && je(document); let t = j++; e.overlayIndex = t; }, xt = e => (e.hasAttribute("id") || (e.id = "ion-overlay-" + ++Ae), e.id), _e = (e, t) => typeof window < "u" && window.customElements !== void 0 ? window.customElements.whenDefined(e).then((() => { let n = document.createElement(e); return n.classList.add("overlay-hidden"), Object.assign(n, Object.assign(Object.assign({}, t), { hasController: !0 })), V(document).appendChild(n), new Promise((i => v(n, i))); })) : Promise.resolve(), de = (e, t) => { let n = e, i = e?.shadowRoot; i && (n = i.querySelector(C) || e), n ? N(n) : t.focus(); }, je = e => { j === 0 && (j = 1, e.addEventListener("focus", (t => { ((n, i) => { let o = x(i, "ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker-legacy,ion-popover"), s = n.target; o && s && (o.classList.contains(We) || (o.shadowRoot ? (() => { if (o.contains(s))
    o.lastFocus = s;
else if (s.tagName === "ION-TOAST")
    de(o.lastFocus, o);
else {
    let d = o.lastFocus;
    ae(o), d === i.activeElement && le(o), o.lastFocus = i.activeElement;
} })() : (() => { if (o === s)
    o.lastFocus = void 0;
else if (s.tagName === "ION-TOAST")
    de(o.lastFocus, o);
else {
    let d = P(o);
    if (!d.contains(s))
        return;
    let c = d.querySelector(".ion-overlay-wrapper");
    if (!c)
        return;
    if (c.contains(s) || s === d.querySelector("ion-backdrop"))
        o.lastFocus = s;
    else {
        let m = o.lastFocus;
        ae(c, o), m === i.activeElement && le(c, o), o.lastFocus = i.activeElement;
    }
} })())); })(t, e); }), !0), e.addEventListener("ionBackButton", (t => { let n = x(e); n?.backdropDismiss && t.detail.register(K, (() => { n.dismiss(void 0, B); })); })), U() || e.addEventListener("keydown", (t => { if (t.key === "Escape") {
    let n = x(e);
    n?.backdropDismiss && n.dismiss(void 0, B);
} }))); }, Re = (e, t, n, i, o) => { let s = x(e, i, o); return s ? s.dismiss(t, n) : Promise.reject("overlay does not exist"); }, me = (e, t) => ((n, i) => (i === void 0 && (i = "ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker-legacy,ion-popover,ion-toast"), Array.from(n.querySelectorAll(i)).filter((o => o.overlayIndex > 0))))(e, t).filter((n => !n.classList.contains("overlay-hidden"))), x = (e, t, n) => { let i = me(e, t); return (n === void 0 ? i : i.filter((o => o.id === n))).slice(-1)[0]; }, ue = (e = !1) => { let t = V(document).querySelector("ion-router-outlet, #ion-view-container-root"); t && (e ? t.setAttribute("aria-hidden", "true") : t.removeAttribute("aria-hidden")); }, Ct = (e, t, n, i, o) => p(null, null, function* () { var s, d; if (e.presented)
    return; e.el.tagName !== "ION-TOAST" && Be(e.el); let c = e.el, m = c.tagName !== "ION-TOAST" && c.focusTrap !== !1 && R(c); if (e.presented = !0, e.willPresent.emit(), m) {
    let l = V(document).querySelector("ion-router-outlet, #ion-view-container-root");
    l && l.contains(c) || ue(!0), document.body.classList.add(k);
} (s = e.willPresentShorthand) === null || s === void 0 || s.emit(); let r = y(e), a = e.enterAnimation ? e.enterAnimation : h.get(t, r === "ios" ? n : i); if ((yield pe(e, a, e.el, o)) && (e.didPresent.emit(), (d = e.didPresentShorthand) === null || d === void 0 || d.emit()), e.keyboardClose && (document.activeElement === null || !e.el.contains(document.activeElement))) {
    let l = P(e.el).querySelector('[role="dialog"][tabindex]'), f = l ?? e.el;
    try {
        f.focus({ preventScroll: !0 });
    }
    catch {
        f.focus();
    }
} e.el.removeAttribute("aria-hidden"), e.el.removeAttribute("inert"); }), Be = e => p(null, null, function* () { let t = document.activeElement; if (!t)
    return; t.blur(); let n = t?.shadowRoot; n && (t = n.querySelector(C) || t), yield e.onDidDismiss(), document.activeElement !== null && document.activeElement !== document.body || t.focus(); }), It = (e, t, n, i, o, s, d) => p(null, null, function* () { var c, m; if (!e.presented)
    return !1; let r = (M !== void 0 ? me(M) : []).filter((l => l.tagName !== "ION-TOAST" && l.focusTrap !== !1 && R(l))), a = e.el; a.tagName !== "ION-TOAST" && a.focusTrap !== !1 && R(a) && r.length === 1 && r[0].id === a.id && (ue(!1), document.body.classList.remove(k)), e.presented = !1; try {
    e.el.style.setProperty("pointer-events", "none"), e.willDismiss.emit({ data: t, role: n }), (c = e.willDismissShorthand) === null || c === void 0 || c.emit({ data: t, role: n });
    let l = y(e), f = e.leaveAnimation ? e.leaveAnimation : h.get(i, l === "ios" ? o : s);
    n !== ze && (yield pe(e, f, e.el, d)), e.didDismiss.emit({ data: t, role: n }), (m = e.didDismissShorthand) === null || m === void 0 || m.emit({ data: t, role: n }), (T.get(e) || []).forEach((u => u.destroy())), T.delete(e), e.el.classList.add("overlay-hidden"), e.el.style.removeProperty("pointer-events"), e.el.lastFocus !== void 0 && (e.el.lastFocus = void 0);
}
catch (l) {
    I(`[${e.el.tagName.toLowerCase()}] - `, l);
} return e.el.remove(), !0; }), V = e => e.querySelector("ion-app") || e.body, pe = (e, t, n, i) => p(null, null, function* () { n.classList.remove("overlay-hidden"); let o = t(e.el, i); e.animated && h.getBoolean("animated", !0) || o.duration(0), e.keyboardClose && o.beforeAddWrite((() => { let d = n.ownerDocument.activeElement; d?.matches("input,ion-input, ion-textarea") && d.blur(); })); let s = T.get(e) || []; return T.set(e, [...s, o]), yield o.play(), !0; }), Lt = (e, t) => { let n, i = new Promise((o => n = o)); return Ve(e, t, (o => { n(o.detail); })), i; }, Ve = (e, t, n) => { let i = o => { H(e, t, i), n(o); }; Y(e, t, i); }, At = e => e === "cancel" || e === B, $e = e => e(), Tt = (e, t) => { if (typeof e == "function")
    return h.get("_zoneGate", $e)((() => { try {
        return e(t);
    }
    catch (n) {
        throw n;
    } })); }, B = "backdrop", ze = "gesture", Pt = 39, Nt = e => { let t, n = !1, i = re(), o = (s = !1) => { if (t && !s)
    return { delegate: t, inline: n }; let { el: d, hasController: c, delegate: m } = e; return n = d.parentNode !== null && !c, t = n ? m || i : m, { inline: n, delegate: t }; }; return { attachViewToDom: s => p(null, null, function* () { let { delegate: d } = o(!0); if (d)
        return yield d.attachViewToDom(e.el, s); let { hasController: c } = e; if (c && s !== void 0)
        throw new Error("framework delegate is missing"); return null; }), removeViewFromDom: () => { let { delegate: s } = o(); s && e.el !== void 0 && s.removeViewFromDom(e.el.parentElement, e.el); } }; }, kt = () => { let e, t = () => { e && (e(), e = void 0); }; return { addClickListener: (n, i) => { t(); let o = i !== void 0 ? document.getElementById(i) : null; o ? e = ((s, d) => { let c = () => { d.present(); }; return s.addEventListener("click", c), () => { s.removeEventListener("click", c); }; })(o, n) : w(`[${n.tagName.toLowerCase()}] - A trigger element with the ID "${i}" was not found in the DOM. The trigger element must be in the DOM when the "trigger" property is set on an overlay component.`, n); }, removeClickListener: t }; }, We = "ion-disable-focus-trap";
var Yt = e => { let { swiper: t, extendParams: n } = e, i = { effect: void 0, direction: "horizontal", initialSlide: 0, loop: !1, parallax: !1, slidesPerView: 1, spaceBetween: 0, speed: 300, slidesPerColumn: 1, slidesPerColumnFill: "column", slidesPerGroup: 1, centeredSlides: !1, slidesOffsetBefore: 0, slidesOffsetAfter: 0, touchEventsTarget: "container", freeMode: !1, freeModeMomentum: !0, freeModeMomentumRatio: 1, freeModeMomentumBounce: !0, freeModeMomentumBounceRatio: 1, freeModeMomentumVelocityRatio: 1, freeModeSticky: !1, freeModeMinimumVelocity: .02, autoHeight: !1, setWrapperSize: !1, zoom: { maxRatio: 3, minRatio: 1, toggle: !1 }, touchRatio: 1, touchAngle: 45, simulateTouch: !0, touchStartPreventDefault: !1, shortSwipes: !0, longSwipes: !0, longSwipesRatio: .5, longSwipesMs: 300, followFinger: !0, threshold: 0, touchMoveStopPropagation: !0, touchReleaseOnEdges: !1, iOSEdgeSwipeDetection: !1, iOSEdgeSwipeThreshold: 20, resistance: !0, resistanceRatio: .85, watchSlidesProgress: !1, watchSlidesVisibility: !1, preventClicks: !0, preventClicksPropagation: !0, slideToClickedSlide: !1, loopAdditionalSlides: 0, noSwiping: !0, runCallbacksOnInit: !0, coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: !0 }, flipEffect: { slideShadows: !0, limitRotation: !0 }, cubeEffect: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: .94 }, fadeEffect: { crossFade: !1 }, a11y: { prevSlideMessage: "Previous slide", nextSlideMessage: "Next slide", firstSlideMessage: "This is the first slide", lastSlideMessage: "This is the last slide" } }; t.pagination && (i.pagination = { type: "bullets", clickable: !1, hideOnClick: !1 }), t.scrollbar && (i.scrollbar = { hide: !0 }), n(i); };
export { fe as a, te as b, ne as c, y as d, ye as e, Ue as f, A as g, Ke as h, Qe as i, Ze as j, et as k, tt as l, Le as m, pt as n, ft as o, re as p, ae as q, le as r, Te as s, Pe as t, Ne as u, ke as v, De as w, qe as x, Fe as y, St as z, xt as A, x as B, Ct as C, It as D, Lt as E, At as F, Tt as G, B as H, ze as I, Pt as J, Nt as K, kt as L, We as M, Yt as N };
/*! Bundled license information:

@ionic/core/components/p-hHmYLOfE.js:
@ionic/core/components/p-DOFCbuQR.js:
@ionic/core/components/p-k_E4tX5Z.js:
@ionic/core/components/p-DiVJyqlX.js:
@ionic/core/components/p-B3qf4bEn.js:
@ionic/core/components/p-CTdRooFV.js:
@ionic/core/components/p-B2nSfLHH.js:
@ionic/core/components/index.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
