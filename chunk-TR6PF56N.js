import { b as st, c as at } from "@nf-internal/chunk-MA4MORD4";
import { b as tt, c as et, d as it, e as nt, f as rt } from "@nf-internal/chunk-QAKPNJZU";
import { c as X } from "@nf-internal/chunk-AFC3S5XK";
import { a as m, b as R, d as J, e as P } from "@nf-internal/chunk-JHI3MBHO";
import * as s from "@angular/core";
import { InjectionToken as O, inject as p, NgZone as xt, ApplicationRef as Pt, Injector as jt, createComponent as Mt, TemplateRef as Ct, EventEmitter as I, ViewContainerRef as Lt, EnvironmentInjector as _t, reflectComponentType as Nt, ElementRef as Vt } from "@angular/core";
import * as h from "@angular/router";
import { NavigationStart as Ft, NavigationCancel as Ut, NavigationError as Ht, PRIMARY_OUTLET as ot, ChildrenOutletContexts as kt, ActivatedRoute as It, Router as Wt } from "@angular/router";
import * as y from "@angular/common";
import { DOCUMENT as zt } from "@angular/common";
import { Subject as C, fromEvent as qt, BehaviorSubject as ct, combineLatest as Gt, of as Qt } from "rxjs";
import { __decorate as S } from "tslib";
import { filter as ut, switchMap as N, distinctUntilChanged as Kt } from "rxjs/operators";
import { NgControl as $t } from "@angular/forms";
var Yt = ["tabsInner"], Qe = (() => { class r {
    read(t) { lt().read(t); }
    write(t) { lt().write(t); }
    static \u0275fac = function (e) { return new (e || r); };
    static \u0275prov = s.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac, providedIn: "root" });
} return r; })(), lt = () => { let r = typeof window < "u" ? window : null; if (r != null) {
    let i = r.Ionic;
    return i?.queue ? i.queue : { read: t => r.requestAnimationFrame(t), write: t => r.requestAnimationFrame(t) };
} return { read: i => i(), write: i => i() }; }, dt = class {
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
}, Zt = (() => { class r {
    doc;
    _readyPromise;
    win;
    backButton = new C;
    keyboardDidShow = new C;
    keyboardDidHide = new C;
    pause = new C;
    resume = new C;
    resize = new C;
    constructor(t, e) { this.doc = t, e.run(() => { this.win = t.defaultView, this.backButton.subscribeWithPriority = function (a, o) { return this.subscribe(c => c.register(a, u => e.run(() => o(u)))); }, k(this.pause, t, "pause", e), k(this.resume, t, "resume", e), k(this.backButton, t, "ionBackButton", e), k(this.resize, this.win, "resize", e), k(this.keyboardDidShow, this.win, "ionKeyboardDidShow", e), k(this.keyboardDidHide, this.win, "ionKeyboardDidHide", e); let n; this._readyPromise = new Promise(a => { n = a; }), this.win?.cordova ? t.addEventListener("deviceready", () => { n("cordova"); }, { once: !0 }) : n("dom"); }); }
    is(t) { return at(this.win, t); }
    platforms() { return st(this.win); }
    ready() { return this._readyPromise; }
    get isRTL() { return this.doc.dir === "rtl"; }
    getQueryParam(t) { return Jt(this.win.location.href, t); }
    isLandscape() { return !this.isPortrait(); }
    isPortrait() { return this.win.matchMedia?.("(orientation: portrait)").matches; }
    testUserAgent(t) { let e = this.win.navigator; return !!(e?.userAgent && e.userAgent.indexOf(t) >= 0); }
    url() { return this.win.location.href; }
    width() { return this.win.innerWidth; }
    height() { return this.win.innerHeight; }
    static \u0275fac = function (e) { return new (e || r)(s.\u0275\u0275inject(zt), s.\u0275\u0275inject(s.NgZone)); };
    static \u0275prov = s.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac, providedIn: "root" });
} return r; })(), Jt = (r, i) => { i = i.replace(/[[\]\\]/g, "\\$&"); let e = new RegExp("[\\?&]" + i + "=([^&#]*)").exec(r); return e ? decodeURIComponent(e[1].replace(/\+/g, " ")) : null; }, k = (r, i, t, e) => { i && i.addEventListener(t, n => { e.run(() => { let a = n?.detail; r.next(a); }); }); }, T = (() => { class r {
    location;
    serializer;
    router;
    topOutlet;
    direction = j;
    animated = M;
    animationBuilder;
    guessDirection = "forward";
    guessAnimation;
    lastNavId = -1;
    constructor(t, e, n, a) { this.location = e, this.serializer = n, this.router = a, a && a.events.subscribe(o => { if (o instanceof Ft) {
        let c = o.restoredState ? o.restoredState.navigationId : o.id;
        this.guessDirection = this.guessAnimation = c < this.lastNavId ? "back" : "forward", this.lastNavId = this.guessDirection === "forward" ? o.id : c;
    } (o instanceof Ut || o instanceof Ht) && (this.direction = j, this.animated = M, this.animationBuilder = void 0); }), t.backButton.subscribeWithPriority(0, o => { this.pop(), o(); }); }
    navigateForward(t, e = {}) { return this.setDirection("forward", e.animated, e.animationDirection, e.animation), this.navigate(t, e); }
    navigateBack(t, e = {}) { return this.setDirection("back", e.animated, e.animationDirection, e.animation), this.navigate(t, e); }
    navigateRoot(t, e = {}) { return this.setDirection("root", e.animated, e.animationDirection, e.animation), this.navigate(t, e); }
    back(t = { animated: !0, animationDirection: "back" }) { return this.setDirection("back", t.animated, t.animationDirection, t.animation), this.location.back(); }
    pop() { return P(this, null, function* () { let t = this.topOutlet; for (; t;) {
        if (yield t.pop())
            return !0;
        t = t.parentOutlet;
    } return !1; }); }
    setDirection(t, e, n, a) { this.direction = t, this.animated = Xt(t, e, n), this.animationBuilder = a; }
    setTopOutlet(t) { this.topOutlet = t; }
    consumeTransition() { let t = "root", e, n = this.animationBuilder; return this.direction === "auto" ? (t = this.guessDirection, e = this.guessAnimation) : (e = this.animated, t = this.direction), this.direction = j, this.animated = M, this.animationBuilder = void 0, { direction: t, animation: e, animationBuilder: n }; }
    navigate(t, e) { if (Array.isArray(t))
        return this.router.navigate(t, e); {
        let n = this.serializer.parse(t.toString());
        return e.queryParams !== void 0 && (n.queryParams = m({}, e.queryParams)), e.fragment !== void 0 && (n.fragment = e.fragment), this.router.navigateByUrl(n, e);
    } }
    static \u0275fac = function (e) { return new (e || r)(s.\u0275\u0275inject(Zt), s.\u0275\u0275inject(y.Location), s.\u0275\u0275inject(h.UrlSerializer), s.\u0275\u0275inject(h.Router, 8)); };
    static \u0275prov = s.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac, providedIn: "root" });
} return r; })(), Xt = (r, i, t) => { if (i !== !1) {
    if (t !== void 0)
        return t;
    if (r === "forward" || r === "back")
        return r;
    if (r === "root" && i === !0)
        return "forward";
} }, j = "auto", M = void 0, yt = (() => { class r {
    get(t, e) { let n = L(); return n ? n.get(t, e) : null; }
    getBoolean(t, e) { let n = L(); return n ? n.getBoolean(t, e) : !1; }
    getNumber(t, e) { let n = L(); return n ? n.getNumber(t, e) : 0; }
    static \u0275fac = function (e) { return new (e || r); };
    static \u0275prov = s.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac, providedIn: "root" });
} return r; })(), te = new O("USERCONFIG"), L = () => { if (typeof window < "u") {
    let r = window.Ionic;
    if (r?.config)
        return r.config;
} return null; }, B = class {
    data;
    constructor(i = {}) { this.data = i, console.warn("[Ionic Warning]: NavParams has been deprecated in favor of using Angular's input API. Developers should migrate to either the @Input decorator or the Signals-based input API."); }
    get(i) { return this.data[i]; }
}, ee = new O("IonModalToken"), ie = (() => { class r {
    zone = p(xt);
    applicationRef = p(Pt);
    config = p(te);
    create(t, e, n, a) { return new V(t, e, this.applicationRef, this.zone, n, this.config.useSetInputAPI ?? !1, a); }
    static \u0275fac = function (e) { return new (e || r); };
    static \u0275prov = s.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac });
} return r; })(), V = class {
    environmentInjector;
    injector;
    applicationRef;
    zone;
    elementReferenceKey;
    enableSignalsSupport;
    customInjector;
    elRefMap = new WeakMap;
    elEventsMap = new WeakMap;
    constructor(i, t, e, n, a, o, c) { this.environmentInjector = i, this.injector = t, this.applicationRef = e, this.zone = n, this.elementReferenceKey = a, this.enableSignalsSupport = o, this.customInjector = c; }
    attachViewToDom(i, t, e, n) { return this.zone.run(() => new Promise(a => { let o = m({}, e); this.elementReferenceKey !== void 0 && (o[this.elementReferenceKey] = i); let c = ne(this.zone, this.environmentInjector, this.injector, this.applicationRef, this.elRefMap, this.elEventsMap, i, t, o, n, this.elementReferenceKey, this.enableSignalsSupport, this.customInjector); a(c); })); }
    removeViewFromDom(i, t) { return this.zone.run(() => new Promise(e => { let n = this.elRefMap.get(t); if (n) {
        n.destroy(), this.elRefMap.delete(t);
        let a = this.elEventsMap.get(t);
        a && (a(), this.elEventsMap.delete(t));
    } e(); })); }
}, ne = (r, i, t, e, n, a, o, c, u, l, d, f, g) => { let w = se(u); o.tagName.toLowerCase() === "ion-modal" && w.push({ provide: ee, useValue: o }); let Ot = jt.create({ providers: w, parent: g ?? t }), v = Mt(c, { environmentInjector: i, elementInjector: Ot }), D = v.instance, b = v.location.nativeElement; if (u)
    if (d && D[d] !== void 0 && console.error(`[Ionic Error]: ${d} is a reserved property when using ${o.tagName.toLowerCase()}. Rename or remove the "${d}" property from ${c.name}.`), f === !0 && v.setInput !== void 0) {
        let K = u, { modal: A, popover: $ } = K, Y = J(K, ["modal", "popover"]);
        for (let Z in Y)
            v.setInput(Z, Y[Z]);
        A !== void 0 && Object.assign(D, { modal: A }), $ !== void 0 && Object.assign(D, { popover: $ });
    }
    else
        Object.assign(D, u); if (l)
    for (let A of l)
        b.classList.add(A); let St = wt(r, D, b); return o.appendChild(b), e.attachView(v.hostView), v.changeDetectorRef.detectChanges(), n.set(b, v), a.set(b, St), b; }, re = [tt, et, it, nt, rt], wt = (r, i, t) => r.run(() => { let e = re.filter(n => typeof i[n] == "function").map(n => { let a = o => i[n](o.detail); return t.addEventListener(n, a), () => t.removeEventListener(n, a); }); return () => e.forEach(n => n()); }), ht = new O("NavParamsToken"), se = r => [{ provide: ht, useValue: r }, { provide: B, useFactory: ae, deps: [ht] }], ae = r => new B(r), oe = (r, i) => { let t = r.prototype; i.forEach(e => { Object.defineProperty(t, e, { get() { return this.el[e]; }, set(n) { this.z.runOutsideAngular(() => this.el[e] = n); } }); }); }, ce = (r, i) => { let t = r.prototype; i.forEach(e => { t[e] = function () { let n = arguments; return this.z.runOutsideAngular(() => this.el[e].apply(this.el, n)); }; }); }, Q = (r, i, t) => { t.forEach(e => r[e] = qt(i, e)); };
function x(r) { return function (t) { let { defineCustomElementFn: e, inputs: n, methods: a } = r; return e !== void 0 && e(), n && oe(t, n), a && ce(t, a), t; }; }
var ue = ["animated", "keepContentsMounted", "backdropBreakpoint", "backdropDismiss", "breakpoints", "canDismiss", "cssClass", "enterAnimation", "expandToScroll", "event", "focusTrap", "handle", "handleBehavior", "initialBreakpoint", "isOpen", "keyboardClose", "leaveAnimation", "mode", "presentingElement", "showBackdrop", "translucent", "trigger"], le = ["present", "dismiss", "onDidDismiss", "onWillDismiss", "setCurrentBreakpoint", "getCurrentBreakpoint"], ft = class F {
    z;
    template;
    isCmpOpen = !1;
    el;
    constructor(i, t, e) { this.z = e, this.el = t.nativeElement, this.el.addEventListener("ionMount", () => { this.isCmpOpen = !0, i.detectChanges(); }), this.el.addEventListener("didDismiss", () => { this.isCmpOpen = !1, i.detectChanges(); }), Q(this, this.el, ["ionModalDidPresent", "ionModalWillPresent", "ionModalWillDismiss", "ionModalDidDismiss", "ionBreakpointDidChange", "didPresent", "willPresent", "willDismiss", "didDismiss", "ionDragStart", "ionDragMove", "ionDragEnd"]); }
    static \u0275fac = function (t) { return new (t || F)(s.\u0275\u0275directiveInject(s.ChangeDetectorRef), s.\u0275\u0275directiveInject(s.ElementRef), s.\u0275\u0275directiveInject(s.NgZone)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: F, selectors: [["ion-modal"]], contentQueries: function (t, e, n) { if (t & 1 && s.\u0275\u0275contentQuery(n, Ct, 5), t & 2) {
            let a;
            s.\u0275\u0275queryRefresh(a = s.\u0275\u0275loadQuery()) && (e.template = a.first);
        } }, inputs: { animated: "animated", keepContentsMounted: "keepContentsMounted", backdropBreakpoint: "backdropBreakpoint", backdropDismiss: "backdropDismiss", breakpoints: "breakpoints", canDismiss: "canDismiss", cssClass: "cssClass", enterAnimation: "enterAnimation", expandToScroll: "expandToScroll", event: "event", focusTrap: "focusTrap", handle: "handle", handleBehavior: "handleBehavior", initialBreakpoint: "initialBreakpoint", isOpen: "isOpen", keyboardClose: "keyboardClose", leaveAnimation: "leaveAnimation", mode: "mode", presentingElement: "presentingElement", showBackdrop: "showBackdrop", translucent: "translucent", trigger: "trigger" }, standalone: !1 });
};
ft = S([x({ inputs: ue, methods: le })], ft);
var de = ["alignment", "animated", "arrow", "keepContentsMounted", "backdropDismiss", "cssClass", "dismissOnSelect", "enterAnimation", "event", "focusTrap", "isOpen", "keyboardClose", "leaveAnimation", "mode", "showBackdrop", "translucent", "trigger", "triggerAction", "reference", "size", "side"], he = ["present", "dismiss", "onDidDismiss", "onWillDismiss"], mt = class U {
    z;
    template;
    isCmpOpen = !1;
    el;
    constructor(i, t, e) { this.z = e, this.el = t.nativeElement, this.el.addEventListener("ionMount", () => { this.isCmpOpen = !0, i.detectChanges(); }), this.el.addEventListener("didDismiss", () => { this.isCmpOpen = !1, i.detectChanges(); }), Q(this, this.el, ["ionPopoverDidPresent", "ionPopoverWillPresent", "ionPopoverWillDismiss", "ionPopoverDidDismiss", "didPresent", "willPresent", "willDismiss", "didDismiss"]); }
    static \u0275fac = function (t) { return new (t || U)(s.\u0275\u0275directiveInject(s.ChangeDetectorRef), s.\u0275\u0275directiveInject(s.ElementRef), s.\u0275\u0275directiveInject(s.NgZone)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: U, selectors: [["ion-popover"]], contentQueries: function (t, e, n) { if (t & 1 && s.\u0275\u0275contentQuery(n, Ct, 5), t & 2) {
            let a;
            s.\u0275\u0275queryRefresh(a = s.\u0275\u0275loadQuery()) && (e.template = a.first);
        } }, inputs: { alignment: "alignment", animated: "animated", arrow: "arrow", keepContentsMounted: "keepContentsMounted", backdropDismiss: "backdropDismiss", cssClass: "cssClass", dismissOnSelect: "dismissOnSelect", enterAnimation: "enterAnimation", event: "event", focusTrap: "focusTrap", isOpen: "isOpen", keyboardClose: "keyboardClose", leaveAnimation: "leaveAnimation", mode: "mode", showBackdrop: "showBackdrop", translucent: "translucent", trigger: "trigger", triggerAction: "triggerAction", reference: "reference", size: "size", side: "side" }, standalone: !1 });
};
mt = S([x({ inputs: de, methods: he })], mt);
var fe = (r, i, t) => t === "root" ? Dt(r, i) : t === "forward" ? me(r, i) : pe(r, i), Dt = (r, i) => (r = r.filter(t => t.stackId !== i.stackId), r.push(i), r), me = (r, i) => (r.indexOf(i) >= 0 ? r = r.filter(e => e.stackId !== i.stackId || e.id <= i.id) : r.push(i), r), pe = (r, i) => r.indexOf(i) >= 0 ? r.filter(e => e.stackId !== i.stackId || e.id <= i.id) : Dt(r, i), H = (r, i) => { let t = r.createUrlTree(["."], { relativeTo: i }); return r.serializeUrl(t); }, Et = (r, i) => i ? r.stackId !== i.stackId : !0, ge = (r, i) => { if (!r)
    return; let t = Tt(i); for (let e = 0; e < t.length; e++) {
    if (e >= r.length)
        return t[e];
    if (t[e] !== r[e])
        return;
} }, Tt = r => r.split("/").map(i => i.trim()).filter(i => i !== ""), At = r => { r && (r.ref.destroy(), r.unlistenEvents()); }, W = class {
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
    constructor(i, t, e, n, a, o) { this.containerEl = t, this.router = e, this.navCtrl = n, this.zone = a, this.location = o, this.tabsPrefix = i !== void 0 ? Tt(i) : void 0; }
    createView(i, t) { let e = H(this.router, t), n = i?.location?.nativeElement, a = wt(this.zone, i.instance, n); return { id: this.nextId++, stackId: ge(this.tabsPrefix, e), unlistenEvents: a, element: n, ref: i, url: e }; }
    getExistingView(i) { let t = H(this.router, i), e = this.views.find(n => n.url === t); return e && e.ref.changeDetectorRef.reattach(), e; }
    setActive(i) { let t = this.navCtrl.consumeTransition(), { direction: e, animation: n, animationBuilder: a } = t, o = this.activeView, c = Et(i, o); c && (e = "back", n = void 0); let u = this.views.slice(), l, d = this.router; d.getCurrentNavigation ? l = d.getCurrentNavigation() : d.navigations?.value && (l = d.navigations.value), l?.extras?.replaceUrl && this.views.length > 0 && this.views.splice(-1, 1); let f = this.views.includes(i), g = this.insertView(i, e); f || i.ref.changeDetectorRef.detectChanges(); let w = i.animationBuilder; return a === void 0 && e === "back" && !c && w !== void 0 && (a = w), o && (o.animationBuilder = a), this.zone.runOutsideAngular(() => this.wait(() => (o && o.ref.changeDetectorRef.detach(), i.ref.changeDetectorRef.reattach(), this.transition(i, o, n, this.canGoBack(1), !1, a).then(() => ve(i, g, u, this.location, this.zone)).then(() => ({ enteringView: i, direction: e, animation: n, tabSwitch: c }))))); }
    canGoBack(i, t = this.getActiveStackId()) { return this.getStack(t).length > i; }
    pop(i, t = this.getActiveStackId()) { return this.zone.run(() => { let e = this.getStack(t); if (e.length <= i)
        return Promise.resolve(!1); let n = e[e.length - i - 1], a = n.url, o = n.savedData; if (o) {
        let u = o.get("primary");
        u?.route?._routerState?.snapshot.url && (a = u.route._routerState.snapshot.url);
    } let { animationBuilder: c } = this.navCtrl.consumeTransition(); return this.navCtrl.navigateBack(a, R(m({}, n.savedExtras), { animation: c })).then(() => !0); }); }
    startBackTransition() { let i = this.activeView; if (i) {
        let t = this.getStack(i.stackId), e = t[t.length - 2], n = e.animationBuilder;
        return this.wait(() => this.transition(e, i, "back", this.canGoBack(2), !0, n));
    } return Promise.resolve(); }
    endBackTransition(i) { i ? (this.skipTransition = !0, this.pop(1)) : this.activeView && Rt(this.activeView, this.views, this.views, this.location, this.zone); }
    getLastUrl(i) { let t = this.getStack(i); return t.length > 0 ? t[t.length - 1] : void 0; }
    getRootUrl(i) { let t = this.getStack(i); return t.length > 0 ? t[0] : void 0; }
    getActiveStackId() { return this.activeView ? this.activeView.stackId : void 0; }
    getActiveView() { return this.activeView; }
    hasRunningTask() { return this.runningTask !== void 0; }
    destroy() { this.containerEl = void 0, this.views.forEach(At), this.activeView = void 0, this.views = []; }
    getStack(i) { return this.views.filter(t => t.stackId === i); }
    insertView(i, t) { return this.activeView = i, this.views = fe(this.views, i, t), this.views.slice(); }
    transition(i, t, e, n, a, o) { if (this.skipTransition)
        return this.skipTransition = !1, Promise.resolve(!1); if (t === i)
        return Promise.resolve(!1); let c = i ? i.element : void 0, u = t ? t.element : void 0, l = this.containerEl; return c && c !== u && (c.classList.add("ion-page"), c.classList.add("ion-page-invisible"), l?.commit) ? l.commit(c, u, { duration: e === void 0 ? 0 : void 0, direction: e, showGoBack: n, progressAnimation: a, animationBuilder: o }) : Promise.resolve(!1); }
    wait(i) { return P(this, null, function* () { this.runningTask !== void 0 && (yield this.runningTask, this.runningTask = void 0); let t = this.runningTask = i(); return t.finally(() => this.runningTask = void 0), t; }); }
}, ve = (r, i, t, e, n) => typeof requestAnimationFrame == "function" ? new Promise(a => { requestAnimationFrame(() => { Rt(r, i, t, e, n), a(); }); }) : Promise.resolve(), Rt = (r, i, t, e, n) => { n.run(() => t.filter(a => !i.includes(a)).forEach(At)), i.forEach(a => { let c = e.path().split("?")[0].split("#")[0]; if (a !== r && a.url !== c) {
    let u = a.element;
    u.setAttribute("aria-hidden", "true"), u.classList.add("ion-page-hidden"), a.ref.changeDetectorRef.detach();
} }); }, be = (() => { class r {
    parentOutlet;
    nativeEl;
    activatedView = null;
    tabsPrefix;
    _swipeGesture;
    stackCtrl;
    proxyMap = new WeakMap;
    currentActivatedRoute$ = new ct(null);
    activated = null;
    get activatedComponentRef() { return this.activated; }
    _activatedRoute = null;
    name = ot;
    stackWillChange = new I;
    stackDidChange = new I;
    activateEvents = new I;
    deactivateEvents = new I;
    parentContexts = p(kt);
    location = p(Lt);
    environmentInjector = p(_t);
    inputBinder = p(Bt, { optional: !0 });
    supportsBindingToComponentInputs = !0;
    config = p(yt);
    navCtrl = p(T);
    set animation(t) { this.nativeEl.animation = t; }
    set animated(t) { this.nativeEl.animated = t; }
    set swipeGesture(t) { this._swipeGesture = t, this.nativeEl.swipeHandler = t ? { canStart: () => this.stackCtrl.canGoBack(1) && !this.stackCtrl.hasRunningTask(), onStart: () => this.stackCtrl.startBackTransition(), onEnd: e => this.stackCtrl.endBackTransition(e) } : void 0; }
    constructor(t, e, n, a, o, c, u, l) { this.parentOutlet = l, this.nativeEl = a.nativeElement, this.name = t || ot, this.tabsPrefix = e === "true" ? H(o, u) : void 0, this.stackCtrl = new W(this.tabsPrefix, this.nativeEl, o, this.navCtrl, c, n), this.parentContexts.onChildOutletCreated(this.name, this); }
    ngOnDestroy() { this.stackCtrl.destroy(), this.inputBinder?.unsubscribeFromRouteData(this); }
    getContext() { return this.parentContexts.getContext(this.name); }
    ngOnInit() { this.initializeOutletWithName(); }
    initializeOutletWithName() { if (!this.activated) {
        let t = this.getContext();
        t?.route && this.activateWith(t.route, t.injector);
    } new Promise(t => X(this.nativeEl, t)).then(() => { this._swipeGesture === void 0 && (this.swipeGesture = this.config.getBoolean("swipeBackEnabled", this.nativeEl.mode === "ios")); }); }
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
            if (n && e.route && (n.route = m({}, e.route)), this.activatedView.savedExtras = {}, e.route) {
                let a = e.route.snapshot;
                this.activatedView.savedExtras.queryParams = a.queryParams, this.activatedView.savedExtras.fragment = a.fragment;
            }
        }
        let t = this.component;
        this.activatedView = null, this.activated = null, this._activatedRoute = null, this.deactivateEvents.emit(t);
    } }
    activateWith(t, e) { if (this.isActivated)
        throw new Error("Cannot activate an already activated outlet"); this._activatedRoute = t; let n, a = this.stackCtrl.getExistingView(t); if (a) {
        n = this.activated = a.ref;
        let c = a.savedData;
        if (c) {
            let u = this.getContext();
            u.children.contexts = c;
        }
        this.updateActivatedRouteProxy(n.instance, t);
    }
    else {
        let c = t._futureSnapshot, u = this.parentContexts.getOrCreateContext(this.name).children, l = new ct(null), d = this.createActivatedRouteProxy(l, t), f = new z(d, u, this.location.injector), g = c.routeConfig.component ?? c.component;
        n = this.activated = this.outletContent.createComponent(g, { index: this.outletContent.length, injector: f, environmentInjector: e ?? this.environmentInjector }), l.next(n.instance), a = this.stackCtrl.createView(this.activated, t), this.proxyMap.set(n.instance, d), this.currentActivatedRoute$.next({ component: n.instance, activatedRoute: t });
    } this.inputBinder?.bindActivatedRouteToOutletComponent(this), this.activatedView = a, this.navCtrl.setTopOutlet(this); let o = this.stackCtrl.getActiveView(); this.stackWillChange.emit({ enteringView: a, tabSwitch: Et(a, o) }), this.stackCtrl.setActive(a).then(c => { this.activateEvents.emit(n.instance), this.stackDidChange.emit(c); }); }
    canGoBack(t = 1, e) { return this.stackCtrl.canGoBack(t, e); }
    pop(t = 1, e) { return this.stackCtrl.pop(t, e); }
    getLastUrl(t) { let e = this.stackCtrl.getLastUrl(t); return e ? e.url : void 0; }
    getLastRouteView(t) { return this.stackCtrl.getLastUrl(t); }
    getRootView(t) { return this.stackCtrl.getRootUrl(t); }
    getActiveStackId() { return this.stackCtrl.getActiveStackId(); }
    createActivatedRouteProxy(t, e) { let n = new It; return n._futureSnapshot = e._futureSnapshot, n._routerState = e._routerState, n.snapshot = e.snapshot, n.outlet = e.outlet, n.component = e.component, n._paramMap = this.proxyObservable(t, "paramMap"), n._queryParamMap = this.proxyObservable(t, "queryParamMap"), n.url = this.proxyObservable(t, "url"), n.params = this.proxyObservable(t, "params"), n.queryParams = this.proxyObservable(t, "queryParams"), n.fragment = this.proxyObservable(t, "fragment"), n.data = this.proxyObservable(t, "data"), n; }
    proxyObservable(t, e) { return t.pipe(ut(n => !!n), N(n => this.currentActivatedRoute$.pipe(ut(a => a !== null && a.component === n), N(a => a && a.activatedRoute[e]), Kt()))); }
    updateActivatedRouteProxy(t, e) { let n = this.proxyMap.get(t); if (!n)
        throw new Error("Could not find activated route proxy for view"); n._futureSnapshot = e._futureSnapshot, n._routerState = e._routerState, n.snapshot = e.snapshot, n.outlet = e.outlet, n.component = e.component, this.currentActivatedRoute$.next({ component: t, activatedRoute: e }); }
    static \u0275fac = function (e) { return new (e || r)(s.\u0275\u0275injectAttribute("name"), s.\u0275\u0275injectAttribute("tabs"), s.\u0275\u0275directiveInject(y.Location), s.\u0275\u0275directiveInject(s.ElementRef), s.\u0275\u0275directiveInject(h.Router), s.\u0275\u0275directiveInject(s.NgZone), s.\u0275\u0275directiveInject(h.ActivatedRoute), s.\u0275\u0275directiveInject(r, 12)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: r, selectors: [["ion-router-outlet"]], inputs: { animated: "animated", animation: "animation", mode: "mode", swipeGesture: "swipeGesture", name: "name" }, outputs: { stackWillChange: "stackWillChange", stackDidChange: "stackDidChange", activateEvents: "activate", deactivateEvents: "deactivate" }, exportAs: ["outlet"], standalone: !1 });
} return r; })(), z = class {
    route;
    childContexts;
    parent;
    constructor(i, t, e) { this.route = i, this.childContexts = t, this.parent = e; }
    get(i, t) { return i === It ? this.route : i === kt ? this.childContexts : this.parent.get(i, t); }
}, Bt = new O(""), Ce = (() => { class r {
    outletDataSubscriptions = new Map;
    bindActivatedRouteToOutletComponent(t) { this.unsubscribeFromRouteData(t), this.subscribeToRouteData(t); }
    unsubscribeFromRouteData(t) { this.outletDataSubscriptions.get(t)?.unsubscribe(), this.outletDataSubscriptions.delete(t); }
    subscribeToRouteData(t) { let { activatedRoute: e } = t, n = Gt([e.queryParams, e.params, e.data]).pipe(N(([a, o, c], u) => (c = m(m(m({}, a), o), c), u === 0 ? Qt(c) : Promise.resolve(c)))).subscribe(a => { if (!t.isActivated || !t.activatedComponentRef || t.activatedRoute !== e || e.component === null) {
        this.unsubscribeFromRouteData(t);
        return;
    } let o = Nt(e.component); if (!o) {
        this.unsubscribeFromRouteData(t);
        return;
    } for (let { templateName: c } of o.inputs)
        t.activatedComponentRef.setInput(c, a[c]); }); this.outletDataSubscriptions.set(t, n); }
    static \u0275fac = function (e) { return new (e || r); };
    static \u0275prov = s.\u0275\u0275defineInjectable({ token: r, factory: r.\u0275fac });
} return r; })(), Ke = () => ({ provide: Bt, useFactory: ke, deps: [Wt] });
function ke(r) { return r?.componentInputBindingEnabled ? new Ce : null; }
var Ie = r => typeof __zone_symbol__requestAnimationFrame == "function" ? __zone_symbol__requestAnimationFrame(r) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(r) : setTimeout(r), $e = (() => { class r {
    injector;
    elementRef;
    onChange = () => { };
    onTouched = () => { };
    lastValue;
    statusChanges;
    constructor(t, e) { this.injector = t, this.elementRef = e; }
    writeValue(t) { this.elementRef.nativeElement.value = this.lastValue = t, E(this.elementRef); }
    handleValueChange(t, e) { t === this.elementRef.nativeElement && (e !== this.lastValue && (this.lastValue = e, this.onChange(e)), E(this.elementRef)); }
    _handleBlurEvent(t) { t === this.elementRef.nativeElement ? (this.onTouched(), E(this.elementRef)) : t.closest("ion-radio-group") === this.elementRef.nativeElement && this.onTouched(); }
    registerOnChange(t) { this.onChange = t; }
    registerOnTouched(t) { this.onTouched = t; }
    setDisabledState(t) { this.elementRef.nativeElement.disabled = t; }
    ngOnDestroy() { this.statusChanges && this.statusChanges.unsubscribe(); }
    ngAfterViewInit() { let t; try {
        t = this.injector.get($t);
    }
    catch { } if (!t)
        return; t.statusChanges && (this.statusChanges = t.statusChanges.subscribe(() => E(this.elementRef))); let e = t.control; e && ["markAsTouched", "markAllAsTouched", "markAsUntouched", "markAsDirty", "markAsPristine"].forEach(a => { if (typeof e[a] < "u") {
        let o = e[a].bind(e);
        e[a] = (...c) => { o(...c), E(this.elementRef); };
    } }); }
    static \u0275fac = function (e) { return new (e || r)(s.\u0275\u0275directiveInject(s.Injector), s.\u0275\u0275directiveInject(s.ElementRef)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: r, hostBindings: function (e, n) { e & 1 && s.\u0275\u0275listener("ionBlur", function (o) { return n._handleBlurEvent(o.target); }); }, standalone: !1 });
} return r; })(), E = r => { Ie(() => { let i = r.nativeElement, t = i.value != null && i.value.toString().length > 0, e = ye(i); _(i, e); let n = i.closest("ion-item"); n && (t ? _(n, [...e, "item-has-value"]) : _(n, e)); }); }, ye = r => { let i = r.classList, t = []; for (let e = 0; e < i.length; e++) {
    let n = i.item(e);
    n !== null && we(n, "ng-") && t.push(`ion-${n.substring(3)}`);
} return t; }, _ = (r, i) => { let t = r.classList; t.remove("ion-valid", "ion-invalid", "ion-touched", "ion-untouched", "ion-dirty", "ion-pristine"), t.add(...i); }, we = (r, i) => r.substring(0, i.length) === i, De = ["color", "defaultHref", "disabled", "icon", "mode", "routerAnimation", "text", "type"], pt = class q {
    routerOutlet;
    navCtrl;
    config;
    r;
    z;
    el;
    constructor(i, t, e, n, a, o) { this.routerOutlet = i, this.navCtrl = t, this.config = e, this.r = n, this.z = a, o.detach(), this.el = this.r.nativeElement; }
    onClick(i) { let t = this.defaultHref || this.config.get("backButtonDefaultHref"); this.routerOutlet?.canGoBack() ? (this.navCtrl.setDirection("back", void 0, void 0, this.routerAnimation), this.routerOutlet.pop(), i.preventDefault()) : t != null && (this.navCtrl.navigateBack(t, { animation: this.routerAnimation }), i.preventDefault()); }
    static \u0275fac = function (t) { return new (t || q)(s.\u0275\u0275directiveInject(be, 8), s.\u0275\u0275directiveInject(T), s.\u0275\u0275directiveInject(yt), s.\u0275\u0275directiveInject(s.ElementRef), s.\u0275\u0275directiveInject(s.NgZone), s.\u0275\u0275directiveInject(s.ChangeDetectorRef)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: q, hostBindings: function (t, e) { t & 1 && s.\u0275\u0275listener("click", function (a) { return e.onClick(a); }); }, inputs: { color: "color", defaultHref: "defaultHref", disabled: "disabled", icon: "icon", mode: "mode", routerAnimation: "routerAnimation", text: "text", type: "type" }, standalone: !1 });
};
pt = S([x({ inputs: De })], pt);
var Ee = ["animated", "animation", "root", "rootParams", "swipeGesture"], Te = ["push", "insert", "insertPages", "pop", "popTo", "popToRoot", "removeIndex", "setRoot", "setPages", "getActive", "getByIndex", "canGoBack", "getPrevious"], gt = class G {
    z;
    el;
    constructor(i, t, e, n, a, o) { this.z = a, o.detach(), this.el = i.nativeElement, i.nativeElement.delegate = n.create(t, e), Q(this, this.el, ["ionNavDidChange", "ionNavWillChange"]); }
    static \u0275fac = function (t) { return new (t || G)(s.\u0275\u0275directiveInject(s.ElementRef), s.\u0275\u0275directiveInject(s.EnvironmentInjector), s.\u0275\u0275directiveInject(s.Injector), s.\u0275\u0275directiveInject(ie), s.\u0275\u0275directiveInject(s.NgZone), s.\u0275\u0275directiveInject(s.ChangeDetectorRef)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: G, inputs: { animated: "animated", animation: "animation", root: "root", rootParams: "rootParams", swipeGesture: "swipeGesture" }, standalone: !1 });
};
gt = S([x({ inputs: Ee, methods: Te })], gt);
var Ye = (() => { class r {
    locationStrategy;
    navCtrl;
    elementRef;
    router;
    routerLink;
    routerDirection = "forward";
    routerAnimation;
    constructor(t, e, n, a, o) { this.locationStrategy = t, this.navCtrl = e, this.elementRef = n, this.router = a, this.routerLink = o; }
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
    static \u0275fac = function (e) { return new (e || r)(s.\u0275\u0275directiveInject(y.LocationStrategy), s.\u0275\u0275directiveInject(T), s.\u0275\u0275directiveInject(s.ElementRef), s.\u0275\u0275directiveInject(h.Router), s.\u0275\u0275directiveInject(h.RouterLink, 8)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: r, selectors: [["", "routerLink", "", 5, "a", 5, "area"]], hostBindings: function (e, n) { e & 1 && s.\u0275\u0275listener("click", function (o) { return n.onClick(o); }); }, inputs: { routerDirection: "routerDirection", routerAnimation: "routerAnimation" }, standalone: !1, features: [s.\u0275\u0275NgOnChangesFeature] });
} return r; })(), Ze = (() => { class r {
    locationStrategy;
    navCtrl;
    elementRef;
    router;
    routerLink;
    routerDirection = "forward";
    routerAnimation;
    constructor(t, e, n, a, o) { this.locationStrategy = t, this.navCtrl = e, this.elementRef = n, this.router = a, this.routerLink = o; }
    ngOnInit() { this.updateTargetUrlAndHref(); }
    ngOnChanges() { this.updateTargetUrlAndHref(); }
    updateTargetUrlAndHref() { if (this.routerLink?.urlTree) {
        let t = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
        this.elementRef.nativeElement.href = t;
    } }
    onClick() { this.navCtrl.setDirection(this.routerDirection, void 0, void 0, this.routerAnimation); }
    static \u0275fac = function (e) { return new (e || r)(s.\u0275\u0275directiveInject(y.LocationStrategy), s.\u0275\u0275directiveInject(T), s.\u0275\u0275directiveInject(s.ElementRef), s.\u0275\u0275directiveInject(h.Router), s.\u0275\u0275directiveInject(h.RouterLink, 8)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: r, selectors: [["a", "routerLink", ""], ["area", "routerLink", ""]], hostBindings: function (e, n) { e & 1 && s.\u0275\u0275listener("click", function () { return n.onClick(); }); }, inputs: { routerDirection: "routerDirection", routerAnimation: "routerAnimation" }, standalone: !1, features: [s.\u0275\u0275NgOnChangesFeature] });
} return r; })(), Ae = r => { if (!r)
    return; let i = r.indexOf("#"), t = i >= 0 && i < r.length - 1 ? r.slice(i + 1) : void 0, e = i >= 0 ? r.slice(0, i) : r, n = e.indexOf("?"), a = n >= 0 ? e.slice(n + 1) : "", o; if (a) {
    let u = new URLSearchParams(a);
    o = {};
    for (let l of new Set(u.keys())) {
        let d = u.getAll(l);
        o[l] = d.length > 1 ? d : d[0];
    }
} if (!o && t === void 0)
    return; let c = {}; return o && (c.queryParams = o), t !== void 0 && (c.fragment = t), c; }, Je = (() => { class r {
    navCtrl;
    tabsInner;
    ionTabsWillChange = new I;
    ionTabsDidChange = new I;
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
    select(t) { let e = typeof t == "string", n = e ? t : t.detail.tab, a = e ? void 0 : t.detail.href; if (this.hasTab) {
        this.setActiveTab(n), this.tabSwitch();
        return;
    } let o = this.outlet.getActiveStackId() === n, c = `${this.outlet.tabsPrefix}/${n}`, u = Ae(a); if (e || t.stopPropagation(), o) {
        let l = this.outlet.getActiveStackId();
        if (this.outlet.getLastRouteView(l)?.url === c)
            return;
        let f = this.outlet.getRootView(n), g = f && c === f.url && f.savedExtras;
        return this.navCtrl.navigateRoot(c, R(m(m({}, g), u), { animated: !0, animationDirection: "back" }));
    }
    else {
        let l = this.outlet.getLastRouteView(n), d = l?.url || c, f = l?.savedExtras ?? (d === c ? u : void 0);
        return this.navCtrl.navigateRoot(d, R(m({}, f), { animated: !0, animationDirection: "back" }));
    } }
    setActiveTab(t) { let n = this.tabs.find(a => a.tab === t); if (!n) {
        console.error(`[Ionic Error]: Tab with id: "${t}" does not exist`);
        return;
    } this.leavingTab = this.selectedTab, this.selectedTab = n, this.ionTabsWillChange.emit({ tab: t }), n.el.active = !0; }
    tabSwitch() { let { selectedTab: t, leavingTab: e } = this; this.tabBar && t && (this.tabBar.selectedTab = t.tab), e?.tab !== t?.tab && e?.el && (e.el.active = !1), t && this.ionTabsDidChange.emit({ tab: t.tab }); }
    getSelected() { return this.hasTab ? this.selectedTab?.tab : this.outlet.getActiveStackId(); }
    detectSlotChanges() { this.tabBars.forEach(t => { let e = t.el.getAttribute("slot"); e !== this.tabBarSlot && (this.tabBarSlot = e, this.relocateTabBar()); }); }
    relocateTabBar() { let t = this.tabBar.el; this.tabBarSlot === "top" ? this.tabsInner.nativeElement.before(t) : this.tabsInner.nativeElement.after(t); }
    static \u0275fac = function (e) { return new (e || r)(s.\u0275\u0275directiveInject(T)); };
    static \u0275dir = s.\u0275\u0275defineDirective({ type: r, selectors: [["ion-tabs"]], viewQuery: function (e, n) { if (e & 1 && s.\u0275\u0275viewQuery(Yt, 7, Vt), e & 2) {
            let a;
            s.\u0275\u0275queryRefresh(a = s.\u0275\u0275loadQuery()) && (n.tabsInner = a.first);
        } }, hostBindings: function (e, n) { e & 1 && s.\u0275\u0275listener("ionTabButtonClick", function (o) { return n.select(o); }); }, outputs: { ionTabsWillChange: "ionTabsWillChange", ionTabsDidChange: "ionTabsDidChange" }, standalone: !1 });
} return r; })(), vt = class {
    ctrl;
    constructor(i) { this.ctrl = i; }
    create(i) { return this.ctrl.create(i || {}); }
    dismiss(i, t, e) { return this.ctrl.dismiss(i, t, e); }
    getTop() { return this.ctrl.getTop(); }
}, bt = class {
    shouldDetach(i) { return !1; }
    shouldAttach(i) { return !1; }
    store(i, t) { }
    retrieve(i) { return null; }
    shouldReuseRoute(i, t) { if (i.routeConfig !== t.routeConfig)
        return !1; let e = i.params, n = t.params, a = Object.keys(e), o = Object.keys(n); if (a.length !== o.length)
        return !1; for (let c of a)
        if (n[c] !== e[c])
            return !1; return !0; }
};
export { Qe as a, dt as b, Zt as c, T as d, yt as e, te as f, B as g, ee as h, ie as i, x as j, ft as k, mt as l, be as m, Ke as n, Ie as o, $e as p, E as q, pt as r, gt as s, Ye as t, Ze as u, Je as v, vt as w, bt as x };
