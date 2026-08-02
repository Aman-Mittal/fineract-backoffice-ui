import { b as St, c as jt } from "@nf-internal/chunk-5WFF2DZJ";
import "@nf-internal/chunk-6YWW3CXD";
import "@nf-internal/chunk-H4U77IPQ";
import { b as At, c as Rt, d as Bt, e as Ot, f as Pt } from "@nf-internal/chunk-OEP6Y7EQ";
import { b as Tt } from "@nf-internal/chunk-6V6Z65ZI";
import "@nf-internal/chunk-3IHVGUEN";
import "@nf-internal/chunk-HVYRPTZH";
import "@nf-internal/chunk-CQE4ZXWS";
import "@nf-internal/chunk-JYWXGWOM";
import { a as v, b as L, d as Et, e as F } from "@nf-internal/chunk-JHI3MBHO";
import "@angular/core";
import * as Lt from "@angular/core";
var ne = (() => { class r {
    read(t) { Mt().read(t); }
    write(t) { Mt().write(t); }
    static \u0275fac = function (e) { return new (e || r); };
    static \u0275prov = Lt.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac, providedIn: "root" });
} return r; })();
var Mt = () => { let r = typeof window < "u" ? window : null; if (r != null) {
    let i = r.Ionic;
    return i?.queue ? i.queue : { read: t => r.requestAnimationFrame(t), write: t => r.requestAnimationFrame(t) };
} return { read: i => i(), write: i => i() }; };
var K = class {
    menuController;
    constructor(i) { this.menuController = i; }
    open(i) { return this.menuController.open(i); }
    close(i) { return this.menuController.close(i); }
    toggle(i) { return this.menuController.toggle(i); }
    enable(i, t) { return this.menuController.enable(i, t); }
    swipeGesture(i, t) { return this.menuController.swipeGesture(i, t); }
    isOpen(i) { return this.menuController.isOpen(i); }
    isEnabled(i) { return this.menuController.isEnabled(i); }
    get(i) { return this.menuController.get(i); }
    getOpen() { return this.menuController.getOpen(); }
    getMenus() { return this.menuController.getMenus(); }
    registerAnimation(i, t) { return this.menuController.registerAnimation(i, t); }
    isAnimating() { return this.menuController.isAnimating(); }
    _getOpenSync() { return this.menuController._getOpenSync(); }
    _createAnimation(i, t) { return this.menuController._createAnimation(i, t); }
    _register(i) { return this.menuController._register(i); }
    _unregister(i) { return this.menuController._unregister(i); }
    _setOpen(i, t, e) { return this.menuController._setOpen(i, t, e); }
};
import "@angular/core";
import { NavigationStart as ae, NavigationCancel as ce, NavigationError as ue } from "@angular/router";
import * as E from "@angular/core";
import { DOCUMENT as re } from "@angular/common";
import "@angular/core";
import { Subject as A } from "rxjs";
import * as x from "@angular/core";
var $ = (() => { class r {
    doc;
    _readyPromise;
    win;
    backButton = new A;
    keyboardDidShow = new A;
    keyboardDidHide = new A;
    pause = new A;
    resume = new A;
    resize = new A;
    constructor(t, e) { this.doc = t, e.run(() => { this.win = t.defaultView, this.backButton.subscribeWithPriority = function (o, s) { return this.subscribe(a => a.register(o, c => e.run(() => s(c)))); }, R(this.pause, t, "pause", e), R(this.resume, t, "resume", e), R(this.backButton, t, "ionBackButton", e), R(this.resize, this.win, "resize", e), R(this.keyboardDidShow, this.win, "ionKeyboardDidShow", e), R(this.keyboardDidHide, this.win, "ionKeyboardDidHide", e); let n; this._readyPromise = new Promise(o => { n = o; }), this.win?.cordova ? t.addEventListener("deviceready", () => { n("cordova"); }, { once: !0 }) : n("dom"); }); }
    is(t) { return jt(this.win, t); }
    platforms() { return St(this.win); }
    ready() { return this._readyPromise; }
    get isRTL() { return this.doc.dir === "rtl"; }
    getQueryParam(t) { return oe(this.win.location.href, t); }
    isLandscape() { return !this.isPortrait(); }
    isPortrait() { return this.win.matchMedia?.("(orientation: portrait)").matches; }
    testUserAgent(t) { let e = this.win.navigator; return !!(e?.userAgent && e.userAgent.indexOf(t) >= 0); }
    url() { return this.win.location.href; }
    width() { return this.win.innerWidth; }
    height() { return this.win.innerHeight; }
    static \u0275fac = function (e) { return new (e || r)(x.\u0275\u0275inject(re), x.\u0275\u0275inject(x.NgZone)); };
    static \u0275prov = x.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac, providedIn: "root" });
} return r; })();
var oe = (r, i) => { i = i.replace(/[[\]\\]/g, "\\$&"); let e = new RegExp("[\\?&]" + i + "=([^&#]*)").exec(r); return e ? decodeURIComponent(e[1].replace(/\+/g, " ")) : null; }, R = (r, i, t, e) => { i && i.addEventListener(t, n => { e.run(() => { let o = n?.detail; r.next(o); }); }); };
import * as _t from "@angular/common";
import * as H from "@angular/router";
var I = (() => { class r {
    location;
    serializer;
    router;
    topOutlet;
    direction = Y;
    animated = Z;
    animationBuilder;
    guessDirection = "forward";
    guessAnimation;
    lastNavId = -1;
    constructor(t, e, n, o) { this.location = e, this.serializer = n, this.router = o, o && o.events.subscribe(s => { if (s instanceof ae) {
        let a = s.restoredState ? s.restoredState.navigationId : s.id;
        this.guessDirection = this.guessAnimation = a < this.lastNavId ? "back" : "forward", this.lastNavId = this.guessDirection === "forward" ? s.id : a;
    } (s instanceof ce || s instanceof ue) && (this.direction = Y, this.animated = Z, this.animationBuilder = void 0); }), t.backButton.subscribeWithPriority(0, s => { this.pop(), s(); }); }
    navigateForward(t, e = {}) { return this.setDirection("forward", e.animated, e.animationDirection, e.animation), this.navigate(t, e); }
    navigateBack(t, e = {}) { return this.setDirection("back", e.animated, e.animationDirection, e.animation), this.navigate(t, e); }
    navigateRoot(t, e = {}) { return this.setDirection("root", e.animated, e.animationDirection, e.animation), this.navigate(t, e); }
    back(t = { animated: !0, animationDirection: "back" }) { return this.setDirection("back", t.animated, t.animationDirection, t.animation), this.location.back(); }
    pop() { return F(this, null, function* () { let t = this.topOutlet; for (; t;) {
        if (yield t.pop())
            return !0;
        t = t.parentOutlet;
    } return !1; }); }
    setDirection(t, e, n, o) { this.direction = t, this.animated = le(t, e, n), this.animationBuilder = o; }
    setTopOutlet(t) { this.topOutlet = t; }
    consumeTransition() { let t = "root", e, n = this.animationBuilder; return this.direction === "auto" ? (t = this.guessDirection, e = this.guessAnimation) : (e = this.animated, t = this.direction), this.direction = Y, this.animated = Z, this.animationBuilder = void 0, { direction: t, animation: e, animationBuilder: n }; }
    navigate(t, e) { if (Array.isArray(t))
        return this.router.navigate(t, e); {
        let n = this.serializer.parse(t.toString());
        return e.queryParams !== void 0 && (n.queryParams = v({}, e.queryParams)), e.fragment !== void 0 && (n.fragment = e.fragment), this.router.navigateByUrl(n, e);
    } }
    static \u0275fac = function (e) { return new (e || r)(E.\u0275\u0275inject($), E.\u0275\u0275inject(_t.Location), E.\u0275\u0275inject(H.UrlSerializer), E.\u0275\u0275inject(H.Router, 8)); };
    static \u0275prov = E.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac, providedIn: "root" });
} return r; })();
var le = (r, i, t) => { if (i !== !1) {
    if (t !== void 0)
        return t;
    if (r === "forward" || r === "back")
        return r;
    if (r === "root" && i === !0)
        return "forward";
} }, Y = "auto", Z = void 0;
import { InjectionToken as de } from "@angular/core";
import * as Nt from "@angular/core";
var _ = (() => { class r {
    get(t, e) { let n = X(); return n ? n.get(t, e) : null; }
    getBoolean(t, e) { let n = X(); return n ? n.getBoolean(t, e) : !1; }
    getNumber(t, e) { let n = X(); return n ? n.getNumber(t, e) : 0; }
    static \u0275fac = function (e) { return new (e || r); };
    static \u0275prov = Nt.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac, providedIn: "root" });
} return r; })();
var tt = new de("USERCONFIG"), X = () => { if (typeof window < "u") {
    let r = window.Ionic;
    if (r?.config)
        return r.config;
} return null; };
import { ApplicationRef as fe, createComponent as me, inject as et, InjectionToken as Ut, Injector as pe, NgZone as ge } from "@angular/core";
var B = class {
    data;
    constructor(i = {}) { this.data = i, console.warn("[Ionic Warning]: NavParams has been deprecated in favor of using Angular's input API. Developers should migrate to either the @Input decorator or the Signals-based input API."); }
    get(i) { return this.data[i]; }
};
import * as Ft from "@angular/core";
var Ht = new Ut("IonModalToken"), nt = (() => { class r {
    zone = et(ge);
    applicationRef = et(fe);
    config = et(tt);
    create(t, e, n, o) { return new it(t, e, this.applicationRef, this.zone, n, this.config.useSetInputAPI ?? !1, o); }
    static \u0275fac = function (e) { return new (e || r); };
    static \u0275prov = Ft.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac });
} return r; })();
var it = class {
    environmentInjector;
    injector;
    applicationRef;
    zone;
    elementReferenceKey;
    enableSignalsSupport;
    customInjector;
    elRefMap = new WeakMap;
    elEventsMap = new WeakMap;
    constructor(i, t, e, n, o, s, a) { this.environmentInjector = i, this.injector = t, this.applicationRef = e, this.zone = n, this.elementReferenceKey = o, this.enableSignalsSupport = s, this.customInjector = a; }
    attachViewToDom(i, t, e, n) { return this.zone.run(() => new Promise(o => { let s = v({}, e); this.elementReferenceKey !== void 0 && (s[this.elementReferenceKey] = i); let a = ve(this.zone, this.environmentInjector, this.injector, this.applicationRef, this.elRefMap, this.elEventsMap, i, t, s, n, this.elementReferenceKey, this.enableSignalsSupport, this.customInjector); o(a); })); }
    removeViewFromDom(i, t) { return this.zone.run(() => new Promise(e => { let n = this.elRefMap.get(t); if (n) {
        n.destroy(), this.elRefMap.delete(t);
        let o = this.elEventsMap.get(t);
        o && (o(), this.elEventsMap.delete(t));
    } e(); })); }
}, ve = (r, i, t, e, n, o, s, a, c, l, d, b, D) => { let j = be(c); s.tagName.toLowerCase() === "ion-modal" && j.push({ provide: Ht, useValue: s }); let ee = pe.create({ providers: j, parent: D ?? t }), w = me(a, { environmentInjector: i, elementInjector: ee }), M = w.instance, T = w.location.nativeElement; if (c)
    if (d && M[d] !== void 0 && console.error(`[Ionic Error]: ${d} is a reserved property when using ${s.tagName.toLowerCase()}. Rename or remove the "${d}" property from ${a.name}.`), b === !0 && w.setInput !== void 0) {
        let yt = c, { modal: U, popover: Dt } = yt, wt = Et(yt, ["modal", "popover"]);
        for (let xt in wt)
            w.setInput(xt, wt[xt]);
        U !== void 0 && Object.assign(M, { modal: U }), Dt !== void 0 && Object.assign(M, { popover: Dt });
    }
    else
        Object.assign(M, c); if (l)
    for (let U of l)
        T.classList.add(U); let ie = W(r, M, T); return s.appendChild(T), e.attachView(w.hostView), w.changeDetectorRef.detectChanges(), n.set(T, w), o.set(T, ie), T; }, Ce = [At, Rt, Bt, Ot, Pt], W = (r, i, t) => r.run(() => { let e = Ce.filter(n => typeof i[n] == "function").map(n => { let o = s => i[n](s.detail); return t.addEventListener(n, o), () => t.removeEventListener(n, o); }); return () => e.forEach(n => n()); }), Vt = new Ut("NavParamsToken"), be = r => [{ provide: Vt, useValue: r }, { provide: B, useFactory: ke, deps: [Vt] }], ke = r => new B(r);
import { __decorate as xe } from "tslib";
import { TemplateRef as Ee } from "@angular/core";
import { fromEvent as ye } from "rxjs";
var De = (r, i) => { let t = r.prototype; i.forEach(e => { Object.defineProperty(t, e, { get() { return this.el[e]; }, set(n) { this.z.runOutsideAngular(() => this.el[e] = n); } }); }); }, we = (r, i) => { let t = r.prototype; i.forEach(e => { t[e] = function () { let n = arguments; return this.z.runOutsideAngular(() => this.el[e].apply(this.el, n)); }; }); }, O = (r, i, t) => { t.forEach(e => r[e] = ye(i, e)); };
function y(r) { return function (t) { let { defineCustomElementFn: e, inputs: n, methods: o } = r; return e !== void 0 && e(), n && De(t, n), o && we(t, o), t; }; }
import * as f from "@angular/core";
var Te = ["animated", "keepContentsMounted", "backdropBreakpoint", "backdropDismiss", "breakpoints", "canDismiss", "cssClass", "enterAnimation", "expandToScroll", "event", "focusTrap", "handle", "handleBehavior", "initialBreakpoint", "isOpen", "keyboardClose", "leaveAnimation", "mode", "presentingElement", "showBackdrop", "translucent", "trigger"], Ae = ["present", "dismiss", "onDidDismiss", "onWillDismiss", "setCurrentBreakpoint", "getCurrentBreakpoint"], rt = class ot {
    z;
    template;
    isCmpOpen = !1;
    el;
    constructor(i, t, e) { this.z = e, this.el = t.nativeElement, this.el.addEventListener("ionMount", () => { this.isCmpOpen = !0, i.detectChanges(); }), this.el.addEventListener("didDismiss", () => { this.isCmpOpen = !1, i.detectChanges(); }), O(this, this.el, ["ionModalDidPresent", "ionModalWillPresent", "ionModalWillDismiss", "ionModalDidDismiss", "ionBreakpointDidChange", "didPresent", "willPresent", "willDismiss", "didDismiss", "ionDragStart", "ionDragMove", "ionDragEnd"]); }
    static \u0275fac = function (t) { return new (t || ot)(f.\u0275\u0275directiveInject(f.ChangeDetectorRef), f.\u0275\u0275directiveInject(f.ElementRef), f.\u0275\u0275directiveInject(f.NgZone)); };
    static \u0275dir = f.\u0275\u0275defineDirective({ type: ot, selectors: [["ion-modal"]], contentQueries: function (t, e, n) { if (t & 1 && f.\u0275\u0275contentQuery(n, Ee, 5), t & 2) {
            let o;
            f.\u0275\u0275queryRefresh(o = f.\u0275\u0275loadQuery()) && (e.template = o.first);
        } }, inputs: { animated: "animated", keepContentsMounted: "keepContentsMounted", backdropBreakpoint: "backdropBreakpoint", backdropDismiss: "backdropDismiss", breakpoints: "breakpoints", canDismiss: "canDismiss", cssClass: "cssClass", enterAnimation: "enterAnimation", expandToScroll: "expandToScroll", event: "event", focusTrap: "focusTrap", handle: "handle", handleBehavior: "handleBehavior", initialBreakpoint: "initialBreakpoint", isOpen: "isOpen", keyboardClose: "keyboardClose", leaveAnimation: "leaveAnimation", mode: "mode", presentingElement: "presentingElement", showBackdrop: "showBackdrop", translucent: "translucent", trigger: "trigger" }, standalone: !1 });
};
rt = xe([y({ inputs: Te, methods: Ae })], rt);
import { __decorate as Re } from "tslib";
import { TemplateRef as Be } from "@angular/core";
import * as m from "@angular/core";
var Oe = ["alignment", "animated", "arrow", "keepContentsMounted", "backdropDismiss", "cssClass", "dismissOnSelect", "enterAnimation", "event", "focusTrap", "isOpen", "keyboardClose", "leaveAnimation", "mode", "showBackdrop", "translucent", "trigger", "triggerAction", "reference", "size", "side"], Pe = ["present", "dismiss", "onDidDismiss", "onWillDismiss"], st = class at {
    z;
    template;
    isCmpOpen = !1;
    el;
    constructor(i, t, e) { this.z = e, this.el = t.nativeElement, this.el.addEventListener("ionMount", () => { this.isCmpOpen = !0, i.detectChanges(); }), this.el.addEventListener("didDismiss", () => { this.isCmpOpen = !1, i.detectChanges(); }), O(this, this.el, ["ionPopoverDidPresent", "ionPopoverWillPresent", "ionPopoverWillDismiss", "ionPopoverDidDismiss", "didPresent", "willPresent", "willDismiss", "didDismiss"]); }
    static \u0275fac = function (t) { return new (t || at)(m.\u0275\u0275directiveInject(m.ChangeDetectorRef), m.\u0275\u0275directiveInject(m.ElementRef), m.\u0275\u0275directiveInject(m.NgZone)); };
    static \u0275dir = m.\u0275\u0275defineDirective({ type: at, selectors: [["ion-popover"]], contentQueries: function (t, e, n) { if (t & 1 && m.\u0275\u0275contentQuery(n, Be, 5), t & 2) {
            let o;
            m.\u0275\u0275queryRefresh(o = m.\u0275\u0275loadQuery()) && (e.template = o.first);
        } }, inputs: { alignment: "alignment", animated: "animated", arrow: "arrow", keepContentsMounted: "keepContentsMounted", backdropDismiss: "backdropDismiss", cssClass: "cssClass", dismissOnSelect: "dismissOnSelect", enterAnimation: "enterAnimation", event: "event", focusTrap: "focusTrap", isOpen: "isOpen", keyboardClose: "keyboardClose", leaveAnimation: "leaveAnimation", mode: "mode", showBackdrop: "showBackdrop", translucent: "translucent", trigger: "trigger", triggerAction: "triggerAction", reference: "reference", size: "size", side: "side" }, standalone: !1 });
};
st = Re([y({ inputs: Oe, methods: Pe })], st);
import { ViewContainerRef as Le, inject as P, EventEmitter as G, EnvironmentInjector as _e, InjectionToken as Ne, reflectComponentType as Ve } from "@angular/core";
import { Router as Ue, ActivatedRoute as Yt, ChildrenOutletContexts as Zt, PRIMARY_OUTLET as Qt } from "@angular/router";
import { BehaviorSubject as Kt, combineLatest as Fe, of as He } from "rxjs";
import { distinctUntilChanged as We, filter as $t, switchMap as lt } from "rxjs/operators";
var Wt = (r, i, t) => t === "root" ? zt(r, i) : t === "forward" ? Se(r, i) : je(r, i), zt = (r, i) => (r = r.filter(t => t.stackId !== i.stackId), r.push(i), r), Se = (r, i) => (r.indexOf(i) >= 0 ? r = r.filter(e => e.stackId !== i.stackId || e.id <= i.id) : r.push(i), r), je = (r, i) => r.indexOf(i) >= 0 ? r.filter(e => e.stackId !== i.stackId || e.id <= i.id) : zt(r, i), N = (r, i) => { let t = r.createUrlTree(["."], { relativeTo: i }); return r.serializeUrl(t); }, z = (r, i) => i ? r.stackId !== i.stackId : !0, qt = (r, i) => { if (!r)
    return; let t = ct(i); for (let e = 0; e < t.length; e++) {
    if (e >= r.length)
        return t[e];
    if (t[e] !== r[e])
        return;
} }, ct = r => r.split("/").map(i => i.trim()).filter(i => i !== ""), ut = r => { r && (r.ref.destroy(), r.unlistenEvents()); };
var q = class {
    containerEl;
    router;
    navCtrl;
    zone;
    location;
    views = [];
    runningTask;
    skipTransition = !1;
    tabsPrefix;
    activeView;
    nextId = 0;
    constructor(i, t, e, n, o, s) { this.containerEl = t, this.router = e, this.navCtrl = n, this.zone = o, this.location = s, this.tabsPrefix = i !== void 0 ? ct(i) : void 0; }
    createView(i, t) { let e = N(this.router, t), n = i?.location?.nativeElement, o = W(this.zone, i.instance, n); return { id: this.nextId++, stackId: qt(this.tabsPrefix, e), unlistenEvents: o, element: n, ref: i, url: e }; }
    getExistingView(i) { let t = N(this.router, i), e = this.views.find(n => n.url === t); return e && e.ref.changeDetectorRef.reattach(), e; }
    setActive(i) { let t = this.navCtrl.consumeTransition(), { direction: e, animation: n, animationBuilder: o } = t, s = this.activeView, a = z(i, s); a && (e = "back", n = void 0); let c = this.views.slice(), l, d = this.router; d.getCurrentNavigation ? l = d.getCurrentNavigation() : d.navigations?.value && (l = d.navigations.value), l?.extras?.replaceUrl && this.views.length > 0 && this.views.splice(-1, 1); let b = this.views.includes(i), D = this.insertView(i, e); b || i.ref.changeDetectorRef.detectChanges(); let j = i.animationBuilder; return o === void 0 && e === "back" && !a && j !== void 0 && (o = j), s && (s.animationBuilder = o), this.zone.runOutsideAngular(() => this.wait(() => (s && s.ref.changeDetectorRef.detach(), i.ref.changeDetectorRef.reattach(), this.transition(i, s, n, this.canGoBack(1), !1, o).then(() => Me(i, D, c, this.location, this.zone)).then(() => ({ enteringView: i, direction: e, animation: n, tabSwitch: a }))))); }
    canGoBack(i, t = this.getActiveStackId()) { return this.getStack(t).length > i; }
    pop(i, t = this.getActiveStackId()) { return this.zone.run(() => { let e = this.getStack(t); if (e.length <= i)
        return Promise.resolve(!1); let n = e[e.length - i - 1], o = n.url, s = n.savedData; if (s) {
        let c = s.get("primary");
        c?.route?._routerState?.snapshot.url && (o = c.route._routerState.snapshot.url);
    } let { animationBuilder: a } = this.navCtrl.consumeTransition(); return this.navCtrl.navigateBack(o, L(v({}, n.savedExtras), { animation: a })).then(() => !0); }); }
    startBackTransition() { let i = this.activeView; if (i) {
        let t = this.getStack(i.stackId), e = t[t.length - 2], n = e.animationBuilder;
        return this.wait(() => this.transition(e, i, "back", this.canGoBack(2), !0, n));
    } return Promise.resolve(); }
    endBackTransition(i) { i ? (this.skipTransition = !0, this.pop(1)) : this.activeView && Gt(this.activeView, this.views, this.views, this.location, this.zone); }
    getLastUrl(i) { let t = this.getStack(i); return t.length > 0 ? t[t.length - 1] : void 0; }
    getRootUrl(i) { let t = this.getStack(i); return t.length > 0 ? t[0] : void 0; }
    getActiveStackId() { return this.activeView ? this.activeView.stackId : void 0; }
    getActiveView() { return this.activeView; }
    hasRunningTask() { return this.runningTask !== void 0; }
    destroy() { this.containerEl = void 0, this.views.forEach(ut), this.activeView = void 0, this.views = []; }
    getStack(i) { return this.views.filter(t => t.stackId === i); }
    insertView(i, t) { return this.activeView = i, this.views = Wt(this.views, i, t), this.views.slice(); }
    transition(i, t, e, n, o, s) { if (this.skipTransition)
        return this.skipTransition = !1, Promise.resolve(!1); if (t === i)
        return Promise.resolve(!1); let a = i ? i.element : void 0, c = t ? t.element : void 0, l = this.containerEl; return a && a !== c && (a.classList.add("ion-page"), a.classList.add("ion-page-invisible"), l.commit) ? l.commit(a, c, { duration: e === void 0 ? 0 : void 0, direction: e, showGoBack: n, progressAnimation: o, animationBuilder: s }) : Promise.resolve(!1); }
    wait(i) { return F(this, null, function* () { this.runningTask !== void 0 && (yield this.runningTask, this.runningTask = void 0); let t = this.runningTask = i(); return t.finally(() => this.runningTask = void 0), t; }); }
}, Me = (r, i, t, e, n) => typeof requestAnimationFrame == "function" ? new Promise(o => { requestAnimationFrame(() => { Gt(r, i, t, e, n), o(); }); }) : Promise.resolve(), Gt = (r, i, t, e, n) => { n.run(() => t.filter(o => !i.includes(o)).forEach(ut)), i.forEach(o => { let a = e.path().split("?")[0].split("#")[0]; if (o !== r && o.url !== a) {
    let c = o.element;
    c.setAttribute("aria-hidden", "true"), c.classList.add("ion-page-hidden"), o.ref.changeDetectorRef.detach();
} }); };
import * as p from "@angular/core";
import * as Jt from "@angular/common";
import * as Q from "@angular/router";
var ht = (() => { class r {
    parentOutlet;
    nativeEl;
    activatedView = null;
    tabsPrefix;
    _swipeGesture;
    stackCtrl;
    proxyMap = new WeakMap;
    currentActivatedRoute$ = new Kt(null);
    activated = null;
    get activatedComponentRef() { return this.activated; }
    _activatedRoute = null;
    name = Qt;
    stackWillChange = new G;
    stackDidChange = new G;
    activateEvents = new G;
    deactivateEvents = new G;
    parentContexts = P(Zt);
    location = P(Le);
    environmentInjector = P(_e);
    inputBinder = P(Xt, { optional: !0 });
    supportsBindingToComponentInputs = !0;
    config = P(_);
    navCtrl = P(I);
    set animation(t) { this.nativeEl.animation = t; }
    set animated(t) { this.nativeEl.animated = t; }
    set swipeGesture(t) { this._swipeGesture = t, this.nativeEl.swipeHandler = t ? { canStart: () => this.stackCtrl.canGoBack(1) && !this.stackCtrl.hasRunningTask(), onStart: () => this.stackCtrl.startBackTransition(), onEnd: e => this.stackCtrl.endBackTransition(e) } : void 0; }
    constructor(t, e, n, o, s, a, c, l) { this.parentOutlet = l, this.nativeEl = o.nativeElement, this.name = t || Qt, this.tabsPrefix = e === "true" ? N(s, c) : void 0, this.stackCtrl = new q(this.tabsPrefix, this.nativeEl, s, this.navCtrl, a, n), this.parentContexts.onChildOutletCreated(this.name, this); }
    ngOnDestroy() { this.stackCtrl.destroy(), this.inputBinder?.unsubscribeFromRouteData(this); }
    getContext() { return this.parentContexts.getContext(this.name); }
    ngOnInit() { this.initializeOutletWithName(); }
    initializeOutletWithName() { if (!this.activated) {
        let t = this.getContext();
        t?.route && this.activateWith(t.route, t.injector);
    } new Promise(t => Tt(this.nativeEl, t)).then(() => { this._swipeGesture === void 0 && (this.swipeGesture = this.config.getBoolean("swipeBackEnabled", this.nativeEl.mode === "ios")); }); }
    get isActivated() { return !!this.activated; }
    get component() { if (!this.activated)
        throw new Error("Outlet is not activated"); return this.activated.instance; }
    get activatedRoute() { if (!this.activated)
        throw new Error("Outlet is not activated"); return this._activatedRoute; }
    get activatedRouteData() { return this._activatedRoute ? this._activatedRoute.snapshot.data : {}; }
    detach() { throw new Error("incompatible reuse strategy"); }
    attach(t, e) { throw new Error("incompatible reuse strategy"); }
    deactivate() { if (this.activated) {
        if (this.activatedView) {
            let e = this.getContext();
            this.activatedView.savedData = new Map(e.children.contexts);
            let n = this.activatedView.savedData.get("primary");
            if (n && e.route && (n.route = v({}, e.route)), this.activatedView.savedExtras = {}, e.route) {
                let o = e.route.snapshot;
                this.activatedView.savedExtras.queryParams = o.queryParams, this.activatedView.savedExtras.fragment = o.fragment;
            }
        }
        let t = this.component;
        this.activatedView = null, this.activated = null, this._activatedRoute = null, this.deactivateEvents.emit(t);
    } }
    activateWith(t, e) { if (this.isActivated)
        throw new Error("Cannot activate an already activated outlet"); this._activatedRoute = t; let n, o = this.stackCtrl.getExistingView(t); if (o) {
        n = this.activated = o.ref;
        let a = o.savedData;
        if (a) {
            let c = this.getContext();
            c.children.contexts = a;
        }
        this.updateActivatedRouteProxy(n.instance, t);
    }
    else {
        let a = t._futureSnapshot, c = this.parentContexts.getOrCreateContext(this.name).children, l = new Kt(null), d = this.createActivatedRouteProxy(l, t), b = new dt(d, c, this.location.injector), D = a.routeConfig.component ?? a.component;
        n = this.activated = this.outletContent.createComponent(D, { index: this.outletContent.length, injector: b, environmentInjector: e ?? this.environmentInjector }), l.next(n.instance), o = this.stackCtrl.createView(this.activated, t), this.proxyMap.set(n.instance, d), this.currentActivatedRoute$.next({ component: n.instance, activatedRoute: t });
    } this.inputBinder?.bindActivatedRouteToOutletComponent(this), this.activatedView = o, this.navCtrl.setTopOutlet(this); let s = this.stackCtrl.getActiveView(); this.stackWillChange.emit({ enteringView: o, tabSwitch: z(o, s) }), this.stackCtrl.setActive(o).then(a => { this.activateEvents.emit(n.instance), this.stackDidChange.emit(a); }); }
    canGoBack(t = 1, e) { return this.stackCtrl.canGoBack(t, e); }
    pop(t = 1, e) { return this.stackCtrl.pop(t, e); }
    getLastUrl(t) { let e = this.stackCtrl.getLastUrl(t); return e ? e.url : void 0; }
    getLastRouteView(t) { return this.stackCtrl.getLastUrl(t); }
    getRootView(t) { return this.stackCtrl.getRootUrl(t); }
    getActiveStackId() { return this.stackCtrl.getActiveStackId(); }
    createActivatedRouteProxy(t, e) { let n = new Yt; return n._futureSnapshot = e._futureSnapshot, n._routerState = e._routerState, n.snapshot = e.snapshot, n.outlet = e.outlet, n.component = e.component, n._paramMap = this.proxyObservable(t, "paramMap"), n._queryParamMap = this.proxyObservable(t, "queryParamMap"), n.url = this.proxyObservable(t, "url"), n.params = this.proxyObservable(t, "params"), n.queryParams = this.proxyObservable(t, "queryParams"), n.fragment = this.proxyObservable(t, "fragment"), n.data = this.proxyObservable(t, "data"), n; }
    proxyObservable(t, e) { return t.pipe($t(n => !!n), lt(n => this.currentActivatedRoute$.pipe($t(o => o !== null && o.component === n), lt(o => o && o.activatedRoute[e]), We()))); }
    updateActivatedRouteProxy(t, e) { let n = this.proxyMap.get(t); if (!n)
        throw new Error("Could not find activated route proxy for view"); n._futureSnapshot = e._futureSnapshot, n._routerState = e._routerState, n.snapshot = e.snapshot, n.outlet = e.outlet, n.component = e.component, this.currentActivatedRoute$.next({ component: t, activatedRoute: e }); }
    static \u0275fac = function (e) { return new (e || r)(p.\u0275\u0275injectAttribute("name"), p.\u0275\u0275injectAttribute("tabs"), p.\u0275\u0275directiveInject(Jt.Location), p.\u0275\u0275directiveInject(p.ElementRef), p.\u0275\u0275directiveInject(Q.Router), p.\u0275\u0275directiveInject(p.NgZone), p.\u0275\u0275directiveInject(Q.ActivatedRoute), p.\u0275\u0275directiveInject(r, 12)); };
    static \u0275dir = p.\u0275\u0275defineDirective({ type: r, selectors: [["ion-router-outlet"]], inputs: { animated: "animated", animation: "animation", mode: "mode", swipeGesture: "swipeGesture", name: "name" }, outputs: { stackWillChange: "stackWillChange", stackDidChange: "stackDidChange", activateEvents: "activate", deactivateEvents: "deactivate" }, exportAs: ["outlet"], standalone: !1 });
} return r; })();
var dt = class {
    route;
    childContexts;
    parent;
    constructor(i, t, e) { this.route = i, this.childContexts = t, this.parent = e; }
    get(i, t) { return i === Yt ? this.route : i === Zt ? this.childContexts : this.parent.get(i, t); }
}, Xt = new Ne(""), ze = (() => { class r {
    outletDataSubscriptions = new Map;
    bindActivatedRouteToOutletComponent(t) { this.unsubscribeFromRouteData(t), this.subscribeToRouteData(t); }
    unsubscribeFromRouteData(t) { this.outletDataSubscriptions.get(t)?.unsubscribe(), this.outletDataSubscriptions.delete(t); }
    subscribeToRouteData(t) { let { activatedRoute: e } = t, n = Fe([e.queryParams, e.params, e.data]).pipe(lt(([o, s, a], c) => (a = v(v(v({}, o), s), a), c === 0 ? He(a) : Promise.resolve(a)))).subscribe(o => { if (!t.isActivated || !t.activatedComponentRef || t.activatedRoute !== e || e.component === null) {
        this.unsubscribeFromRouteData(t);
        return;
    } let s = Ve(e.component); if (!s) {
        this.unsubscribeFromRouteData(t);
        return;
    } for (let { templateName: a } of s.inputs)
        t.activatedComponentRef.setInput(a, o[a]); }); this.outletDataSubscriptions.set(t, n); }
    static \u0275fac = function (e) { return new (e || r); };
    static \u0275prov = p.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac });
} return r; })(), qe = () => ({ provide: Xt, useFactory: Ge, deps: [Ue] });
function Ge(r) { return r?.componentInputBindingEnabled ? new ze : null; }
import "@angular/core";
import { NgControl as Ke } from "@angular/forms";
var ft = r => typeof __zone_symbol__requestAnimationFrame == "function" ? __zone_symbol__requestAnimationFrame(r) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(r) : setTimeout(r);
import * as k from "@angular/core";
var In = (() => { class r {
    injector;
    elementRef;
    onChange = () => { };
    onTouched = () => { };
    lastValue;
    statusChanges;
    constructor(t, e) { this.injector = t, this.elementRef = e; }
    writeValue(t) { this.elementRef.nativeElement.value = this.lastValue = t, V(this.elementRef); }
    handleValueChange(t, e) { t === this.elementRef.nativeElement && (e !== this.lastValue && (this.lastValue = e, this.onChange(e)), V(this.elementRef)); }
    _handleBlurEvent(t) { t === this.elementRef.nativeElement ? (this.onTouched(), V(this.elementRef)) : t.closest("ion-radio-group") === this.elementRef.nativeElement && this.onTouched(); }
    registerOnChange(t) { this.onChange = t; }
    registerOnTouched(t) { this.onTouched = t; }
    setDisabledState(t) { this.elementRef.nativeElement.disabled = t; }
    ngOnDestroy() { this.statusChanges && this.statusChanges.unsubscribe(); }
    ngAfterViewInit() { let t; try {
        t = this.injector.get(Ke);
    }
    catch { } if (!t)
        return; t.statusChanges && (this.statusChanges = t.statusChanges.subscribe(() => V(this.elementRef))); let e = t.control; e && ["markAsTouched", "markAllAsTouched", "markAsUntouched", "markAsDirty", "markAsPristine"].forEach(o => { if (typeof e[o] < "u") {
        let s = e[o].bind(e);
        e[o] = (...a) => { s(...a), V(this.elementRef); };
    } }); }
    static \u0275fac = function (e) { return new (e || r)(k.\u0275\u0275directiveInject(k.Injector), k.\u0275\u0275directiveInject(k.ElementRef)); };
    static \u0275dir = k.\u0275\u0275defineDirective({ type: r, hostBindings: function (e, n) { e & 1 && k.\u0275\u0275listener("ionBlur", function (s) { return n._handleBlurEvent(s.target); }); }, standalone: !1 });
} return r; })();
var V = r => { ft(() => { let i = r.nativeElement, t = i.value != null && i.value.toString().length > 0, e = $e(i); mt(i, e); let n = i.closest("ion-item"); n && (t ? mt(n, [...e, "item-has-value"]) : mt(n, e)); }); }, $e = r => { let i = r.classList, t = []; for (let e = 0; e < i.length; e++) {
    let n = i.item(e);
    n !== null && Ye(n, "ng-") && t.push(`ion-${n.substring(3)}`);
} return t; }, mt = (r, i) => { let t = r.classList; t.remove("ion-valid", "ion-invalid", "ion-touched", "ion-untouched", "ion-dirty", "ion-pristine"), t.add(...i); }, Ye = (r, i) => r.substring(0, i.length) === i;
import { __decorate as Ze } from "tslib";
import "@angular/core";
import * as g from "@angular/core";
var Je = ["color", "defaultHref", "disabled", "icon", "mode", "routerAnimation", "text", "type"], pt = class gt {
    routerOutlet;
    navCtrl;
    config;
    r;
    z;
    el;
    constructor(i, t, e, n, o, s) { this.routerOutlet = i, this.navCtrl = t, this.config = e, this.r = n, this.z = o, s.detach(), this.el = this.r.nativeElement; }
    onClick(i) { let t = this.defaultHref || this.config.get("backButtonDefaultHref"); this.routerOutlet?.canGoBack() ? (this.navCtrl.setDirection("back", void 0, void 0, this.routerAnimation), this.routerOutlet.pop(), i.preventDefault()) : t != null && (this.navCtrl.navigateBack(t, { animation: this.routerAnimation }), i.preventDefault()); }
    static \u0275fac = function (t) { return new (t || gt)(g.\u0275\u0275directiveInject(ht, 8), g.\u0275\u0275directiveInject(I), g.\u0275\u0275directiveInject(_), g.\u0275\u0275directiveInject(g.ElementRef), g.\u0275\u0275directiveInject(g.NgZone), g.\u0275\u0275directiveInject(g.ChangeDetectorRef)); };
    static \u0275dir = g.\u0275\u0275defineDirective({ type: gt, hostBindings: function (t, e) { t & 1 && g.\u0275\u0275listener("click", function (o) { return e.onClick(o); }); }, inputs: { color: "color", defaultHref: "defaultHref", disabled: "disabled", icon: "icon", mode: "mode", routerAnimation: "routerAnimation", text: "text", type: "type" }, standalone: !1 });
};
pt = Ze([y({ inputs: Je })], pt);
import { __decorate as Xe } from "tslib";
import "@angular/core";
import * as h from "@angular/core";
var ti = ["animated", "animation", "root", "rootParams", "swipeGesture"], ei = ["push", "insert", "insertPages", "pop", "popTo", "popToRoot", "removeIndex", "setRoot", "setPages", "getActive", "getByIndex", "canGoBack", "getPrevious"], vt = class Ct {
    z;
    el;
    constructor(i, t, e, n, o, s) { this.z = o, s.detach(), this.el = i.nativeElement, i.nativeElement.delegate = n.create(t, e), O(this, this.el, ["ionNavDidChange", "ionNavWillChange"]); }
    static \u0275fac = function (t) { return new (t || Ct)(h.\u0275\u0275directiveInject(h.ElementRef), h.\u0275\u0275directiveInject(h.EnvironmentInjector), h.\u0275\u0275directiveInject(h.Injector), h.\u0275\u0275directiveInject(nt), h.\u0275\u0275directiveInject(h.NgZone), h.\u0275\u0275directiveInject(h.ChangeDetectorRef)); };
    static \u0275dir = h.\u0275\u0275defineDirective({ type: Ct, inputs: { animated: "animated", animation: "animation", root: "root", rootParams: "rootParams", swipeGesture: "swipeGesture" }, standalone: !1 });
};
vt = Xe([y({ inputs: ti, methods: ei })], vt);
import "@angular/core";
import * as u from "@angular/core";
import * as bt from "@angular/common";
import * as S from "@angular/router";
var ii = (() => { class r {
    locationStrategy;
    navCtrl;
    elementRef;
    router;
    routerLink;
    routerDirection = "forward";
    routerAnimation;
    constructor(t, e, n, o, s) { this.locationStrategy = t, this.navCtrl = e, this.elementRef = n, this.router = o, this.routerLink = s; }
    ngOnInit() { this.updateTargetUrlAndHref(), this.updateTabindex(), this.elementRef.nativeElement.addEventListener("click", this.onCaptureClick, { capture: !0 }); }
    ngOnChanges() { this.updateTargetUrlAndHref(); }
    ngOnDestroy() { this.elementRef.nativeElement.removeEventListener("click", this.onCaptureClick, { capture: !0 }); }
    onCaptureClick = t => { this.opensNatively(t) && t.stopImmediatePropagation(); };
    opensNatively(t) { if (t instanceof MouseEvent && (t.ctrlKey || t.metaKey || t.shiftKey || t.altKey))
        return !0; let e = this.elementRef.nativeElement.target; return e != null && e !== "" && e !== "_self"; }
    updateTabindex() { let t = ["ION-BACK-BUTTON", "ION-BREADCRUMB", "ION-BUTTON", "ION-CARD", "ION-FAB-BUTTON", "ION-ITEM", "ION-ITEM-OPTION", "ION-MENU-BUTTON", "ION-SEGMENT-BUTTON", "ION-TAB-BUTTON"], e = this.elementRef.nativeElement; t.includes(e.tagName) && e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex"); }
    updateTargetUrlAndHref() { if (this.routerLink?.urlTree) {
        let t = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
        this.elementRef.nativeElement.href = t;
    } }
    onClick(t) { this.navCtrl.setDirection(this.routerDirection, void 0, void 0, this.routerAnimation), t.preventDefault(); }
    static \u0275fac = function (e) { return new (e || r)(u.\u0275\u0275directiveInject(bt.LocationStrategy), u.\u0275\u0275directiveInject(I), u.\u0275\u0275directiveInject(u.ElementRef), u.\u0275\u0275directiveInject(S.Router), u.\u0275\u0275directiveInject(S.RouterLink, 8)); };
    static \u0275dir = u.\u0275\u0275defineDirective({ type: r, selectors: [["", "routerLink", "", 5, "a", 5, "area"]], hostBindings: function (e, n) { e & 1 && u.\u0275\u0275listener("click", function (s) { return n.onClick(s); }); }, inputs: { routerDirection: "routerDirection", routerAnimation: "routerAnimation" }, standalone: !1, features: [u.\u0275\u0275NgOnChangesFeature] });
} return r; })();
var ni = (() => { class r {
    locationStrategy;
    navCtrl;
    elementRef;
    router;
    routerLink;
    routerDirection = "forward";
    routerAnimation;
    constructor(t, e, n, o, s) { this.locationStrategy = t, this.navCtrl = e, this.elementRef = n, this.router = o, this.routerLink = s; }
    ngOnInit() { this.updateTargetUrlAndHref(); }
    ngOnChanges() { this.updateTargetUrlAndHref(); }
    updateTargetUrlAndHref() { if (this.routerLink?.urlTree) {
        let t = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
        this.elementRef.nativeElement.href = t;
    } }
    onClick() { this.navCtrl.setDirection(this.routerDirection, void 0, void 0, this.routerAnimation); }
    static \u0275fac = function (e) { return new (e || r)(u.\u0275\u0275directiveInject(bt.LocationStrategy), u.\u0275\u0275directiveInject(I), u.\u0275\u0275directiveInject(u.ElementRef), u.\u0275\u0275directiveInject(S.Router), u.\u0275\u0275directiveInject(S.RouterLink, 8)); };
    static \u0275dir = u.\u0275\u0275defineDirective({ type: r, selectors: [["a", "routerLink", ""], ["area", "routerLink", ""]], hostBindings: function (e, n) { e & 1 && u.\u0275\u0275listener("click", function () { return n.onClick(); }); }, inputs: { routerDirection: "routerDirection", routerAnimation: "routerAnimation" }, standalone: !1, features: [u.\u0275\u0275NgOnChangesFeature] });
} return r; })();
import { ElementRef as ri, EventEmitter as te } from "@angular/core";
import * as C from "@angular/core";
var oi = ["tabsInner"], si = r => { if (!r)
    return; let i = r.indexOf("#"), t = i >= 0 && i < r.length - 1 ? r.slice(i + 1) : void 0, e = i >= 0 ? r.slice(0, i) : r, n = e.indexOf("?"), o = n >= 0 ? e.slice(n + 1) : "", s; if (o) {
    let c = new URLSearchParams(o);
    s = {};
    for (let l of new Set(c.keys())) {
        let d = c.getAll(l);
        s[l] = d.length > 1 ? d : d[0];
    }
} if (!s && t === void 0)
    return; let a = {}; return s && (a.queryParams = s), t !== void 0 && (a.fragment = t), a; }, ai = (() => { class r {
    navCtrl;
    tabsInner;
    ionTabsWillChange = new te;
    ionTabsDidChange = new te;
    tabBarSlot = "bottom";
    hasTab = !1;
    selectedTab;
    leavingTab;
    constructor(t) { this.navCtrl = t; }
    ngAfterViewInit() { let t = this.tabs.length > 0 ? this.tabs.first : void 0; t && (this.hasTab = !0, this.setActiveTab(t.tab), this.tabSwitch()); }
    ngAfterContentInit() { this.detectSlotChanges(); }
    ngAfterContentChecked() { this.detectSlotChanges(); }
    onStackWillChange({ enteringView: t, tabSwitch: e }) { let n = t.stackId; e && n !== void 0 && this.ionTabsWillChange.emit({ tab: n }); }
    onStackDidChange({ enteringView: t, tabSwitch: e }) { let n = t.stackId; e && n !== void 0 && (this.tabBar && (this.tabBar.selectedTab = n), this.ionTabsDidChange.emit({ tab: n })); }
    select(t) { let e = typeof t == "string", n = e ? t : t.detail.tab, o = e ? void 0 : t.detail.href; if (this.hasTab) {
        this.setActiveTab(n), this.tabSwitch();
        return;
    } let s = this.outlet.getActiveStackId() === n, a = `${this.outlet.tabsPrefix}/${n}`, c = si(o); if (e || t.stopPropagation(), s) {
        let l = this.outlet.getActiveStackId();
        if (this.outlet.getLastRouteView(l)?.url === a)
            return;
        let b = this.outlet.getRootView(n), D = b && a === b.url && b.savedExtras;
        return this.navCtrl.navigateRoot(a, L(v(v({}, D), c), { animated: !0, animationDirection: "back" }));
    }
    else {
        let l = this.outlet.getLastRouteView(n), d = l?.url || a, b = l?.savedExtras ?? (d === a ? c : void 0);
        return this.navCtrl.navigateRoot(d, L(v({}, b), { animated: !0, animationDirection: "back" }));
    } }
    setActiveTab(t) { let n = this.tabs.find(o => o.tab === t); if (!n) {
        console.error(`[Ionic Error]: Tab with id: "${t}" does not exist`);
        return;
    } this.leavingTab = this.selectedTab, this.selectedTab = n, this.ionTabsWillChange.emit({ tab: t }), n.el.active = !0; }
    tabSwitch() { let { selectedTab: t, leavingTab: e } = this; this.tabBar && t && (this.tabBar.selectedTab = t.tab), e?.tab !== t?.tab && e?.el && (e.el.active = !1), t && this.ionTabsDidChange.emit({ tab: t.tab }); }
    getSelected() { return this.hasTab ? this.selectedTab?.tab : this.outlet.getActiveStackId(); }
    detectSlotChanges() { this.tabBars.forEach(t => { let e = t.el.getAttribute("slot"); e !== this.tabBarSlot && (this.tabBarSlot = e, this.relocateTabBar()); }); }
    relocateTabBar() { let t = this.tabBar.el; this.tabBarSlot === "top" ? this.tabsInner.nativeElement.before(t) : this.tabsInner.nativeElement.after(t); }
    static \u0275fac = function (e) { return new (e || r)(C.\u0275\u0275directiveInject(I)); };
    static \u0275dir = C.\u0275\u0275defineDirective({ type: r, selectors: [["ion-tabs"]], viewQuery: function (e, n) { if (e & 1 && C.\u0275\u0275viewQuery(oi, 7, ri), e & 2) {
            let o;
            C.\u0275\u0275queryRefresh(o = C.\u0275\u0275loadQuery()) && (n.tabsInner = o.first);
        } }, hostBindings: function (e, n) { e & 1 && C.\u0275\u0275listener("ionTabButtonClick", function (s) { return n.select(s); }); }, outputs: { ionTabsWillChange: "ionTabsWillChange", ionTabsDidChange: "ionTabsDidChange" }, standalone: !1 });
} return r; })();
var kt = class {
    ctrl;
    constructor(i) { this.ctrl = i; }
    create(i) { return this.ctrl.create(i || {}); }
    dismiss(i, t, e) { return this.ctrl.dismiss(i, t, e); }
    getTop() { return this.ctrl.getTop(); }
};
var It = class {
    shouldDetach(i) { return !1; }
    shouldAttach(i) { return !1; }
    store(i, t) { }
    retrieve(i) { return null; }
    shouldReuseRoute(i, t) { if (i.routeConfig !== t.routeConfig)
        return !1; let e = i.params, n = t.params, o = Object.keys(e), s = Object.keys(n); if (o.length !== s.length)
        return !1; for (let a of o)
        if (n[a] !== e[a])
            return !1; return !0; }
};
export { nt as AngularDelegate, _ as Config, tt as ConfigToken, ne as DomController, pt as IonBackButton, rt as IonModal, Ht as IonModalToken, vt as IonNav, st as IonPopover, ht as IonRouterOutlet, ai as IonTabs, It as IonicRouteStrategy, K as MenuController, I as NavController, B as NavParams, kt as OverlayBaseController, $ as Platform, y as ProxyCmp, ii as RouterLinkDelegateDirective, ni as RouterLinkWithHrefDelegateDirective, In as ValueAccessor, W as bindLifecycleEvents, qe as provideComponentInputBinding, ft as raf, V as setIonicClasses };
