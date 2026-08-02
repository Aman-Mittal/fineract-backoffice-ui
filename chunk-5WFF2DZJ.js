import { a as g } from "@nf-internal/chunk-OEP6Y7EQ";
import { b as v, f as Y, g as H, h as P, k as N } from "@nf-internal/chunk-6V6Z65ZI";
import { a as k } from "@nf-internal/chunk-3IHVGUEN";
import { a as U, d as K, e as J } from "@nf-internal/chunk-HVYRPTZH";
import { a as h, b as $, c as z, d as W, e as w, f as I, o as G, p as X } from "@nf-internal/chunk-CQE4ZXWS";
import { b as M } from "@nf-internal/chunk-JYWXGWOM";
import { e as p } from "@nf-internal/chunk-JHI3MBHO";
var fe = (e, t, o, i, n) => ge(e[1], t[1], o[1], i[1], n).map(s => he(e[0], t[0], o[0], i[0], s)), he = (e, t, o, i, n) => n * (3 * t * Math.pow(n - 1, 2) + n * (-3 * o * n + 3 * o + i * n)) - e * Math.pow(n - 1, 3), ge = (e, t, o, i, n) => ve((i -= n) - 3 * (o -= n) + 3 * (t -= n) - (e -= n), 3 * o - 6 * t + 3 * e, 3 * t - 3 * e, e).filter(s => s >= 0 && s <= 1), ve = (e, t, o, i) => { if (e === 0)
    return ((a, l, f) => { let u = l * l - 4 * a * f; return u < 0 ? [] : [(-l + Math.sqrt(u)) / (2 * a), (-l - Math.sqrt(u)) / (2 * a)]; })(t, o, i); let n = (3 * (o /= e) - (t /= e) * t) / 3, s = (2 * t * t * t - 9 * t * o + 27 * (i /= e)) / 27; if (n === 0)
    return [Math.pow(-s, .3333333333333333)]; if (s === 0)
    return [Math.sqrt(-n), -Math.sqrt(-n)]; let d = Math.pow(s / 2, 2) + Math.pow(n / 3, 3); if (d === 0)
    return [Math.pow(s / 2, .5) - t / 3]; if (d > 0)
    return [Math.pow(-s / 2 + Math.sqrt(d), .3333333333333333) - Math.pow(s / 2 + Math.sqrt(d), .3333333333333333) - t / 3]; let c = Math.sqrt(Math.pow(-n / 3, 3)), m = Math.acos(-s / (2 * Math.sqrt(Math.pow(-n / 3, 3)))), r = 2 * Math.pow(c, 1 / 3); return [r * Math.cos(m / 3) - t / 3, r * Math.cos((m + 2 * Math.PI) / 3) - t / 3, r * Math.cos((m + 4 * Math.PI) / 3) - t / 3]; };
var te = e => ne(e), oe = (e, t) => (typeof e == "string" && (t = e, e = void 0), te(e).includes(t)), ne = (e = window) => { if (e === void 0)
    return []; e.Ionic = e.Ionic || {}; let t = e.Ionic.platforms; return t == null && (t = e.Ionic.platforms = we(e), t.forEach(o => e.document.documentElement.classList.add(`plt-${o}`))), t; }, we = e => { let t = h.get("platform"); return Object.keys(ee).filter(o => { let i = t?.[o]; return typeof i == "function" ? i(e) : ee[o](e); }); }, D = e => !!b(e, /iPad/i) || !(!b(e, /Macintosh/i) || !L(e)), Q = e => b(e, /android|sink/i), L = e => be(e, "(any-pointer:coarse)"), Z = e => ie(e) || se(e), ie = e => !!(e.cordova || e.phonegap || e.PhoneGap), se = e => { let t = e.Capacitor; return !!(t?.isNative || t?.isNativePlatform && t.isNativePlatform()); }, b = (e, t) => t.test(e.navigator.userAgent), be = (e, t) => { var o; return (o = e.matchMedia) === null || o === void 0 ? void 0 : o.call(e, t).matches; }, ee = { ipad: D, iphone: e => b(e, /iPhone/i), ios: e => b(e, /iPhone|iPod/i) || D(e), android: Q, phablet: e => { let t = e.innerWidth, o = e.innerHeight, i = Math.min(t, o), n = Math.max(t, o); return i > 390 && i < 520 && n > 620 && n < 800; }, tablet: e => { let t = e.innerWidth, o = e.innerHeight, i = Math.min(t, o), n = Math.max(t, o); return D(e) || (s => Q(s) && !b(s, /mobile/i))(e) || i > 460 && i < 820 && n > 780 && n < 1400; }, cordova: ie, capacitor: se, electron: e => b(e, /electron/i), pwa: e => { var t; return !(!(!((t = e.matchMedia) === null || t === void 0) && t.call(e, "(display-mode: standalone)").matches) && !e.navigator.standalone); }, mobile: L, mobileweb: e => L(e) && !Z(e), desktop: e => !L(e), hybrid: Z }, O, y = e => e && X(e) || O, ye = (e = {}) => { if (typeof window > "u")
    return; let t = window.document, o = window, i = o.Ionic = o.Ionic || {}, n = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, $(o)), { persistConfig: !1 }), i.config), W(o)), e); h.reset(n), h.getBoolean("persistConfig") && z(o, n), ne(o), i.config = h, i.mode = O = h.get("mode", t.documentElement.getAttribute("mode") || (oe(o, "ios") ? "ios" : "md")), h.set("mode", O), t.documentElement.setAttribute("mode", O), t.documentElement.classList.add(O), h.getBoolean("_testing") && h.set("animated", !1); let s = c => { var m; return (m = c.tagName) === null || m === void 0 ? void 0 : m.startsWith("ION-"); }, d = c => ["ios", "md"].includes(c); G(c => { for (; c;) {
    let m = c.mode || c.getAttribute("mode");
    if (m) {
        if (d(m))
            return m;
        s(c) && w('Invalid ionic mode: "' + m + '", expected: "ios" or "md"');
    }
    c = c.parentElement;
} return O; }); };
var Ue = e => { try {
    if (e instanceof A)
        return e.value;
    if (!Ee() || typeof e != "string" || e === "")
        return e;
    if (e.includes("onload="))
        return "";
    let t = document.createDocumentFragment(), o = document.createElement("div");
    t.appendChild(o), o.innerHTML = e, Oe.forEach(d => { let c = t.querySelectorAll(d); for (let m = c.length - 1; m >= 0; m--) {
        let r = c[m];
        r.parentNode ? r.parentNode.removeChild(r) : t.removeChild(r);
        let a = F(r);
        for (let l = 0; l < a.length; l++)
            q(a[l]);
    } });
    let i = F(t);
    for (let d = 0; d < i.length; d++)
        q(i[d]);
    let n = document.createElement("div");
    n.appendChild(t);
    let s = n.querySelector("div");
    return s !== null ? s.innerHTML : n.innerHTML;
}
catch (t) {
    return I("sanitizeDOMString", t), "";
} }, q = e => { if (e.nodeType && e.nodeType !== 1)
    return; if (typeof NamedNodeMap < "u" && !(e.attributes instanceof NamedNodeMap))
    return void e.remove(); for (let o = e.attributes.length - 1; o >= 0; o--) {
    let i = e.attributes.item(o), n = i.name;
    if (!Me.includes(n.toLowerCase())) {
        e.removeAttribute(n);
        continue;
    }
    let s = i.value, d = e[n];
    (s != null && s.toLowerCase().includes("javascript:") || d != null && d.toLowerCase().includes("javascript:")) && e.removeAttribute(n);
} let t = F(e); for (let o = 0; o < t.length; o++)
    q(t[o]); }, F = e => e.children != null ? e.children : e.childNodes, Ee = () => { var e; let t = window, o = (e = t?.Ionic) === null || e === void 0 ? void 0 : e.config; return !o || (o.get ? o.get("sanitizerEnabled", !0) : o.sanitizerEnabled === !0 || o.sanitizerEnabled === void 0); }, Me = ["class", "id", "href", "src", "name", "slot"], Oe = ["script", "style", "iframe", "meta", "link", "object", "embed"], A = class {
    constructor(t) { this.value = t; }
};
var Ke = !1;
var Qe = (e, t) => t.closest(e) !== null, Ze = (e, t) => typeof e == "string" && e.length > 0 ? Object.assign({ "ion-color": !0, [`ion-color-${e}`]: !0 }, t) : t, et = e => { let t = {}; return (o => o !== void 0 ? (Array.isArray(o) ? o : o.split(" ")).filter(i => i != null).map(i => i.trim()).filter(i => i !== "") : [])(e).forEach(o => t[o] = !0), t; }, Se = /^[a-z][a-z0-9+\-.]*:/, tt = (e, t, o, i) => p(null, null, function* () { if (e != null && e[0] !== "#" && !Se.test(e)) {
    let n = document.querySelector("ion-router");
    if (n)
        return t?.preventDefault(), n.push(e, o, i);
} return !1; });
var _ = e => g().duration(e ? 400 : 300), xe = e => { let t, o, i = e.width + 8, n = g(), s = g(); e.isEndSide ? (t = i + "px", o = "0px") : (t = -i + "px", o = "0px"), n.addElement(e.menuInnerEl).fromTo("transform", `translateX(${t})`, `translateX(${o})`); let d = y(e) === "ios", c = d ? .2 : .25; return s.addElement(e.backdropEl).fromTo("opacity", .01, c), _(d).addAnimation([n, s]); }, Ce = e => { let t, o, i = y(e), n = e.width; e.isEndSide ? (t = -n + "px", o = n + "px") : (t = n + "px", o = -n + "px"); let s = g().addElement(e.menuInnerEl).fromTo("transform", `translateX(${o})`, "translateX(0px)"), d = g().addElement(e.contentEl).fromTo("transform", "translateX(0px)", `translateX(${t})`), c = g().addElement(e.backdropEl).fromTo("opacity", .01, .32); return _(i === "ios").addAnimation([s, d, c]); }, Ie = e => { let t = y(e), o = e.width * (e.isEndSide ? -1 : 1) + "px", i = g().addElement(e.contentEl).fromTo("transform", "translateX(0px)", `translateX(${o})`); return _(t === "ios").addAnimation(i); }, Le = (() => { let e = new Map, t = [], o = (r, a = !1) => p(null, null, function* () { if (yield m(), r === "start" || r === "end") {
    let l = t.filter(u => u.side === r && !u.disabled);
    if (l.length >= 1)
        return l.length > 1 && a && w(`menuController queried for a menu on the "${r}" side, but ${l.length} menus were found. The first menu reference will be used. If this is not the behavior you want then pass the ID of the menu instead of its side.`, l.map(u => u.el)), l[0].el;
    let f = t.filter(u => u.side === r);
    if (f.length >= 1)
        return f.length > 1 && a && w(`menuController queried for a menu on the "${r}" side, but ${f.length} menus were found. The first menu reference will be used. If this is not the behavior you want then pass the ID of the menu instead of its side.`, f.map(u => u.el)), f[0].el;
}
else if (r != null)
    return c(l => l.menuId === r); return c(l => !l.disabled) || (t.length > 0 ? t[0].el : void 0); }), i = () => p(null, null, function* () { return yield m(), s(); }), n = (r, a) => { e.set(r, a); }, s = () => c(r => r._isOpen), d = () => t.some(r => r.isAnimating), c = r => { let a = t.find(r); if (a !== void 0)
    return a.el; }, m = () => Promise.all(Array.from(document.querySelectorAll("ion-menu")).map(r => new Promise(a => v(r, a)))); return n("reveal", Ie), n("push", Ce), n("overlay", xe), M == null || M.addEventListener("ionBackButton", r => { let a = s(); a && r.detail.register(J, () => a.close()); }), { registerAnimation: n, get: o, getMenus: () => p(null, null, function* () { return yield m(), t.map(r => r.el); }), getOpen: i, isEnabled: r => p(null, null, function* () { let a = yield o(r); return !!a && !a.disabled; }), swipeGesture: (r, a) => p(null, null, function* () { let l = yield o(a); return l && (l.swipeGesture = r), l; }), isAnimating: () => p(null, null, function* () { return yield m(), d(); }), isOpen: r => p(null, null, function* () { if (r != null) {
        let a = yield o(r);
        return a !== void 0 && a.isOpen();
    } return (yield i()) !== void 0; }), enable: (r, a) => p(null, null, function* () { let l = yield o(a); return l && (l.disabled = !r), l; }), toggle: r => p(null, null, function* () { let a = yield o(r, !0); return !!a && a.toggle(); }), close: r => p(null, null, function* () { let a = yield r !== void 0 ? o(r, !0) : i(); return a !== void 0 && a.close(); }), open: r => p(null, null, function* () { let a = yield o(r, !0); return !!a && a.open(); }), _getOpenSync: s, _createAnimation: (r, a) => { let l = e.get(r); if (!l)
        throw new Error("animation not registered"); return l(a); }, _register: r => { t.indexOf(r) < 0 && t.push(r); }, _unregister: r => { let a = t.indexOf(r); a > -1 && t.splice(a, 1); }, _setOpen: (r, a, l, f) => p(null, null, function* () { if (d())
        return !1; if (a) {
        let u = yield i();
        u && r.el !== u && (yield u.setOpen(!1, !1));
    } return r._setOpen(a, l, f); }) }; })();
var pt = (e, t, o, i, n, s) => p(null, null, function* () { var d; if (e)
    return e.attachViewToDom(t, o, n, i); if (!(s || typeof o == "string" || o instanceof HTMLElement))
    throw new Error("framework delegate is missing"); let c = typeof o == "string" ? (d = t.ownerDocument) === null || d === void 0 ? void 0 : d.createElement(o) : o; return i && i.forEach(m => c.classList.add(m)), n && Object.assign(c, n), t.appendChild(c), yield new Promise(m => v(c, m)), c; }), ft = (e, t) => { if (t) {
    if (e)
        return e.removeViewFromDom(t.parentElement, t);
    t.remove();
} return Promise.resolve(); }, re = () => { let e, t; return { attachViewToDom: (d, c, ...m) => p(null, [d, c, ...m], function* (o, i, n = {}, s = []) { var r, a; let l; if (e = o, i) {
        let u = typeof i == "string" ? (r = e.ownerDocument) === null || r === void 0 ? void 0 : r.createElement(i) : i;
        s.forEach(S => u.classList.add(S)), Object.assign(u, n), e.appendChild(u), l = u, yield new Promise(S => v(u, S));
    }
    else if (e.children.length > 0 && (e.tagName === "ION-MODAL" || e.tagName === "ION-POPOVER") && !(l = e.children[0]).classList.contains("ion-delegate-host")) {
        let u = (a = e.ownerDocument) === null || a === void 0 ? void 0 : a.createElement("div");
        u.classList.add("ion-delegate-host"), s.forEach(S => u.classList.add(S)), u.append(...e.children), e.appendChild(u), l = u;
    } let f = document.querySelector("ion-app") || document.body; return t = document.createComment("ionic teleport"), e.parentNode.insertBefore(t, e), f.appendChild(e), l ?? e; }), removeViewFromDom: () => (e && t && (t.parentNode.insertBefore(e, t), t.remove()), Promise.resolve()) }; };
var C = '[tabindex]:not([tabindex^="-"]):not([hidden]):not([disabled]), input:not([type=hidden]):not([tabindex^="-"]):not([hidden]):not([disabled]), textarea:not([tabindex^="-"]):not([hidden]):not([disabled]), button:not([tabindex^="-"]):not([hidden]):not([disabled]), select:not([tabindex^="-"]):not([hidden]):not([disabled]), ion-checkbox:not([tabindex^="-"]):not([hidden]):not([disabled]), ion-radio:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable:not([tabindex^="-"]):not([hidden]):not([disabled]), .ion-focusable[disabled="false"]:not([tabindex^="-"]):not([hidden])', ae = (e, t) => { let o = e.querySelector(C); ce(o, t ?? e); }, le = (e, t) => { let o = Array.from(e.querySelectorAll(C)); ce(o.length > 0 ? o[o.length - 1] : null, t ?? e); }, ce = (e, t) => { let o = e, i = e?.shadowRoot; if (i && (o = i.querySelector(C) || e), o) {
    let n = o.closest("ion-radio-group");
    n ? n.setFocus() : N(o);
}
else
    t.focus(); }, R = 0, Ae = 0, T = new WeakMap, j = e => { var t; return e.showBackdrop !== !1 && !(((t = e.backdropBreakpoint) !== null && t !== void 0 ? t : 0) > 0); }, E = e => ({ create: t => _e(e, t), dismiss: (t, o, i) => je(document, t, o, e, i), getTop: () => p(null, null, function* () { return x(document, e); }) }), Te = E("ion-alert"), Pe = E("ion-action-sheet"), Ne = E("ion-loading"), ke = E("ion-modal"), De = E("ion-picker-legacy"), qe = E("ion-popover"), Fe = E("ion-toast"), St = e => { typeof document < "u" && Re(document); let t = R++; e.overlayIndex = t; }, xt = e => (e.hasAttribute("id") || (e.id = "ion-overlay-" + ++Ae), e.id), _e = (e, t) => typeof window < "u" && window.customElements !== void 0 ? window.customElements.whenDefined(e).then(() => { let o = document.createElement(e); return o.classList.add("overlay-hidden"), Object.assign(o, Object.assign(Object.assign({}, t), { hasController: !0 })), V(document).appendChild(o), new Promise(i => v(o, i)); }) : Promise.resolve(), de = (e, t) => { let o = e, i = e?.shadowRoot; i && (o = i.querySelector(C) || e), o ? N(o) : t.focus(); }, Re = e => { R === 0 && (R = 1, e.addEventListener("focus", t => { ((o, i) => { let n = x(i, "ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker-legacy,ion-popover"), s = o.target; n && s && (n.classList.contains(We) || (n.shadowRoot ? (() => { if (n.contains(s))
    n.lastFocus = s;
else if (s.tagName === "ION-TOAST")
    de(n.lastFocus, n);
else {
    let d = n.lastFocus;
    ae(n), d === i.activeElement && le(n), n.lastFocus = i.activeElement;
} })() : (() => { if (n === s)
    n.lastFocus = void 0;
else if (s.tagName === "ION-TOAST")
    de(n.lastFocus, n);
else {
    let d = P(n);
    if (!d.contains(s))
        return;
    let c = d.querySelector(".ion-overlay-wrapper");
    if (!c)
        return;
    if (c.contains(s) || s === d.querySelector("ion-backdrop"))
        n.lastFocus = s;
    else {
        let m = n.lastFocus;
        ae(c, n), m === i.activeElement && le(c, n), n.lastFocus = i.activeElement;
    }
} })())); })(t, e); }, !0), e.addEventListener("ionBackButton", t => { let o = x(e); o?.backdropDismiss && t.detail.register(K, () => { o.dismiss(void 0, B); }); }), U() || e.addEventListener("keydown", t => { if (t.key === "Escape") {
    let o = x(e);
    o?.backdropDismiss && o.dismiss(void 0, B);
} })); }, je = (e, t, o, i, n) => { let s = x(e, i, n); return s ? s.dismiss(t, o) : Promise.reject("overlay does not exist"); }, me = (e, t) => ((o, i) => (i === void 0 && (i = "ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker-legacy,ion-popover,ion-toast"), Array.from(o.querySelectorAll(i)).filter(n => n.overlayIndex > 0)))(e, t).filter(o => !o.classList.contains("overlay-hidden")), x = (e, t, o) => { let i = me(e, t); return (o === void 0 ? i : i.filter(n => n.id === o)).slice(-1)[0]; }, ue = (e = !1) => { let t = V(document).querySelector("ion-router-outlet, #ion-view-container-root"); t && (e ? t.setAttribute("aria-hidden", "true") : t.removeAttribute("aria-hidden")); }, Ct = (e, t, o, i, n) => p(null, null, function* () { var s, d; if (e.presented)
    return; e.el.tagName !== "ION-TOAST" && Be(e.el); let c = e.el, m = c.tagName !== "ION-TOAST" && c.focusTrap !== !1 && j(c); if (e.presented = !0, e.willPresent.emit(), m) {
    let l = V(document).querySelector("ion-router-outlet, #ion-view-container-root");
    l && l.contains(c) || ue(!0), document.body.classList.add(k);
} (s = e.willPresentShorthand) === null || s === void 0 || s.emit(); let r = y(e), a = e.enterAnimation ? e.enterAnimation : h.get(t, r === "ios" ? o : i); if ((yield pe(e, a, e.el, n)) && (e.didPresent.emit(), (d = e.didPresentShorthand) === null || d === void 0 || d.emit()), e.keyboardClose && (document.activeElement === null || !e.el.contains(document.activeElement))) {
    let l = P(e.el).querySelector('[role="dialog"][tabindex]'), f = l ?? e.el;
    try {
        f.focus({ preventScroll: !0 });
    }
    catch {
        f.focus();
    }
} e.el.removeAttribute("aria-hidden"), e.el.removeAttribute("inert"); }), Be = e => p(null, null, function* () { let t = document.activeElement; if (!t)
    return; t.blur(); let o = t?.shadowRoot; o && (t = o.querySelector(C) || t), yield e.onDidDismiss(), document.activeElement !== null && document.activeElement !== document.body || t.focus(); }), It = (e, t, o, i, n, s, d) => p(null, null, function* () { var c, m; if (!e.presented)
    return !1; let r = (M !== void 0 ? me(M) : []).filter(l => l.tagName !== "ION-TOAST" && l.focusTrap !== !1 && j(l)), a = e.el; a.tagName !== "ION-TOAST" && a.focusTrap !== !1 && j(a) && r.length === 1 && r[0].id === a.id && (ue(!1), document.body.classList.remove(k)), e.presented = !1; try {
    e.el.style.setProperty("pointer-events", "none"), e.willDismiss.emit({ data: t, role: o }), (c = e.willDismissShorthand) === null || c === void 0 || c.emit({ data: t, role: o });
    let l = y(e), f = e.leaveAnimation ? e.leaveAnimation : h.get(i, l === "ios" ? n : s);
    o !== ze && (yield pe(e, f, e.el, d)), e.didDismiss.emit({ data: t, role: o }), (m = e.didDismissShorthand) === null || m === void 0 || m.emit({ data: t, role: o }), (T.get(e) || []).forEach(u => u.destroy()), T.delete(e), e.el.classList.add("overlay-hidden"), e.el.style.removeProperty("pointer-events"), e.el.lastFocus !== void 0 && (e.el.lastFocus = void 0);
}
catch (l) {
    I(`[${e.el.tagName.toLowerCase()}] - `, l);
} return e.el.remove(), !0; }), V = e => e.querySelector("ion-app") || e.body, pe = (e, t, o, i) => p(null, null, function* () { o.classList.remove("overlay-hidden"); let n = t(e.el, i); e.animated && h.getBoolean("animated", !0) || n.duration(0), e.keyboardClose && n.beforeAddWrite(() => { let d = o.ownerDocument.activeElement; d?.matches("input,ion-input, ion-textarea") && d.blur(); }); let s = T.get(e) || []; return T.set(e, [...s, n]), yield n.play(), !0; }), Lt = (e, t) => { let o, i = new Promise(n => o = n); return Ve(e, t, n => { o(n.detail); }), i; }, Ve = (e, t, o) => { let i = n => { H(e, t, i), o(n); }; Y(e, t, i); }, At = e => e === "cancel" || e === B, $e = e => e(), Tt = (e, t) => { if (typeof e == "function")
    return h.get("_zoneGate", $e)(() => { try {
        return e(t);
    }
    catch (o) {
        throw o;
    } }); }, B = "backdrop", ze = "gesture", Pt = 39, Nt = e => { let t, o = !1, i = re(), n = (s = !1) => { if (t && !s)
    return { delegate: t, inline: o }; let { el: d, hasController: c, delegate: m } = e; return o = d.parentNode !== null && !c, t = o ? m || i : m, { inline: o, delegate: t }; }; return { attachViewToDom: s => p(null, null, function* () { let { delegate: d } = n(!0); if (d)
        return yield d.attachViewToDom(e.el, s); let { hasController: c } = e; if (c && s !== void 0)
        throw new Error("framework delegate is missing"); return null; }), removeViewFromDom: () => { let { delegate: s } = n(); s && e.el !== void 0 && s.removeViewFromDom(e.el.parentElement, e.el); } }; }, kt = () => { let e, t = () => { e && (e(), e = void 0); }; return { addClickListener: (o, i) => { t(); let n = i !== void 0 ? document.getElementById(i) : null; n ? e = ((s, d) => { let c = () => { d.present(); }; return s.addEventListener("click", c), () => { s.removeEventListener("click", c); }; })(n, o) : w(`[${o.tagName.toLowerCase()}] - A trigger element with the ID "${i}" was not found in the DOM. The trigger element must be in the DOM when the "trigger" property is set on an overlay component.`, o); }, removeClickListener: t }; }, We = "ion-disable-focus-trap";
var Yt = e => { let { swiper: t, extendParams: o } = e, i = { effect: void 0, direction: "horizontal", initialSlide: 0, loop: !1, parallax: !1, slidesPerView: 1, spaceBetween: 0, speed: 300, slidesPerColumn: 1, slidesPerColumnFill: "column", slidesPerGroup: 1, centeredSlides: !1, slidesOffsetBefore: 0, slidesOffsetAfter: 0, touchEventsTarget: "container", freeMode: !1, freeModeMomentum: !0, freeModeMomentumRatio: 1, freeModeMomentumBounce: !0, freeModeMomentumBounceRatio: 1, freeModeMomentumVelocityRatio: 1, freeModeSticky: !1, freeModeMinimumVelocity: .02, autoHeight: !1, setWrapperSize: !1, zoom: { maxRatio: 3, minRatio: 1, toggle: !1 }, touchRatio: 1, touchAngle: 45, simulateTouch: !0, touchStartPreventDefault: !1, shortSwipes: !0, longSwipes: !0, longSwipesRatio: .5, longSwipesMs: 300, followFinger: !0, threshold: 0, touchMoveStopPropagation: !0, touchReleaseOnEdges: !1, iOSEdgeSwipeDetection: !1, iOSEdgeSwipeThreshold: 20, resistance: !0, resistanceRatio: .85, watchSlidesProgress: !1, watchSlidesVisibility: !1, preventClicks: !0, preventClicksPropagation: !0, slideToClickedSlide: !1, loopAdditionalSlides: 0, noSwiping: !0, runCallbacksOnInit: !0, coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: !0 }, flipEffect: { slideShadows: !0, limitRotation: !0 }, cubeEffect: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: .94 }, fadeEffect: { crossFade: !1 }, a11y: { prevSlideMessage: "Previous slide", nextSlideMessage: "Next slide", firstSlideMessage: "This is the first slide", lastSlideMessage: "This is the last slide" } }; t.pagination && (i.pagination = { type: "bullets", clickable: !1, hideOnClick: !1 }), t.scrollbar && (i.scrollbar = { hide: !0 }), o(i); };
export { fe as a, te as b, oe as c, y as d, ye as e, Ue as f, A as g, Ke as h, Qe as i, Ze as j, et as k, tt as l, Le as m, pt as n, ft as o, re as p, ae as q, le as r, Te as s, Pe as t, Ne as u, ke as v, De as w, qe as x, Fe as y, St as z, xt as A, x as B, Ct as C, It as D, Lt as E, At as F, Tt as G, B as H, ze as I, Pt as J, Nt as K, kt as L, We as M, Yt as N };
/*! Bundled license information:

@ionic/core/components/p-hHmYLOfE.js:
@ionic/core/components/p-DOFCbuQR.js:
@ionic/core/components/p-k_E4tX5Z.js:
@ionic/core/components/p-DiVJyqlX.js:
@ionic/core/components/p-BnqQlm7c.js:
@ionic/core/components/p-DnL1c9_X.js:
@ionic/core/components/p-BWEZufiK.js:
@ionic/core/components/index.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
