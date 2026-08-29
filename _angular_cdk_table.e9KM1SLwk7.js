import "@nf-internal/chunk-IQO3VMP7";
import * as r from "@angular/core";
import { InjectionToken as $, inject as c, ElementRef as R, TemplateRef as T, booleanAttribute as v, IterableDiffers as le, ViewContainerRef as O, afterNextRender as B, ChangeDetectorRef as Te, Injector as Oe, DOCUMENT as Me, EventEmitter as Fe, HostAttributeToken as Ne } from "@angular/core";
import { Subject as b, BehaviorSubject as Ie, isObservable as ze, of as oe, combineLatest as H, animationFrameScheduler as Be, asapScheduler as Ae } from "rxjs";
import { takeUntil as S, auditTime as Ve } from "rxjs/operators";
import * as Y from "@angular/core";
import { InjectionToken as he, inject as X, DOCUMENT as ue, signal as fe, EventEmitter as _e } from "@angular/core";
var me = new he("cdk-dir-doc", { providedIn: "root", factory: () => X(ue) }), pe = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function ge(i) { let a = i?.toLowerCase() || ""; return a === "auto" && typeof navigator < "u" && navigator?.language ? pe.test(navigator.language) ? "rtl" : "ltr" : a === "rtl" ? "rtl" : "ltr"; }
var J = (() => { class i {
    get value() { return this.valueSignal(); }
    valueSignal = fe("ltr");
    change = new _e;
    constructor() { let e = X(me, { optional: !0 }); if (e) {
        let t = e.body ? e.body.dir : null, n = e.documentElement ? e.documentElement.dir : null;
        this.valueSignal.set(ge(t || n || "ltr"));
    } }
    ngOnDestroy() { this.change.complete(); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275prov = Y.\u0275\u0275defineService({ token: i, factory: i.\u0275fac });
} return i; })();
import * as f from "@angular/core";
import { InjectionToken as De, forwardRef as bt, inject as I, NgZone as ve, RendererFactory2 as Se, ElementRef as Ot, Renderer2 as Mt, DOCUMENT as ke, ChangeDetectorRef as Ft, signal as Nt, Injector as It, effect as zt, ApplicationRef as Bt, DestroyRef as At, untracked as Vt, afterNextRender as Lt, booleanAttribute as Pt, ViewContainerRef as Qt, TemplateRef as $t, IterableDiffers as qt } from "@angular/core";
import { Subject as be, of as Kt, Observable as Yt, Subscription as Xt, animationFrameScheduler as Jt, asapScheduler as ei, isObservable as ti } from "rxjs";
import { distinctUntilChanged as ni, auditTime as Ee, filter as ri, startWith as oi, takeUntil as si, pairwise as ai, switchMap as li, shareReplay as ci } from "rxjs/operators";
import * as ee from "@angular/core";
import { inject as we, PLATFORM_ID as ye } from "@angular/core";
import { isPlatformBrowser as Ce } from "@angular/common";
var V;
try {
    V = typeof Intl < "u" && Intl.v8BreakIterator;
}
catch {
    V = !1;
}
var M = (() => { class i {
    _platformId = we(ye);
    isBrowser = this._platformId ? Ce(this._platformId) : typeof document == "object" && !!document;
    EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
    TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
    BLINK = this.isBrowser && !!(window.chrome || V) && typeof CSS < "u" && !this.EDGE && !this.TRIDENT;
    WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;
    IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
    ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
    SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275prov = ee.\u0275\u0275defineService({ token: i, factory: i.\u0275fac });
} return i; })();
import { isObservable as _t, of as mt } from "rxjs";
import { ConnectableObservable as Re } from "rxjs";
var L = class {
};
function F(i) { return i && typeof i.connect == "function" && !(i instanceof Re); }
var y = (function (i) { return i[i.REPLACED = 0] = "REPLACED", i[i.INSERTED = 1] = "INSERTED", i[i.MOVED = 2] = "MOVED", i[i.REMOVED = 3] = "REMOVED", i; })(y || {}), N = class {
    viewCacheSize = 20;
    _viewCache = [];
    applyChanges(a, e, t, n, o) { a.forEachOperation((s, l, d) => { let h, u; if (s.previousIndex == null) {
        let _ = () => t(s, l, d);
        h = this._insertView(_, d, e, n(s)), u = h ? y.INSERTED : y.REPLACED;
    }
    else
        d == null ? (this._detachAndCacheView(l, e), u = y.REMOVED) : (h = this._moveView(l, d, e, n(s)), u = y.MOVED); o && o({ context: h?.context, operation: u, record: s }); }); }
    detach() { for (let a of this._viewCache)
        a.destroy(); this._viewCache = []; }
    _insertView(a, e, t, n) { let o = this._insertViewFromCache(e, t); if (o) {
        o.context.$implicit = n;
        return;
    } let s = a(); return t.createEmbeddedView(s.templateRef, s.context, s.index); }
    _detachAndCacheView(a, e) { let t = e.detach(a); this._maybeCacheView(t, e); }
    _moveView(a, e, t, n) { let o = t.get(a); return t.move(o, e), o.context.$implicit = n, o; }
    _maybeCacheView(a, e) { if (this._viewCache.length < this.viewCacheSize)
        this._viewCache.push(a);
    else {
        let t = e.indexOf(a);
        t === -1 ? a.destroy() : e.remove(t);
    } }
    _insertViewFromCache(a, e) { let t = this._viewCache.pop(); return t && e.insert(t, a), t || null; }
};
import * as D from "@angular/core";
import { EventEmitter as wt, signal as yt } from "@angular/core";
var P = (() => { class i {
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275mod = D.\u0275\u0275defineNgModule({ type: i });
    static \u0275inj = D.\u0275\u0275defineInjector({});
} return i; })();
import "@angular/common";
var xe = 20, ie = (() => { class i {
    _platform = I(M);
    _listeners;
    _viewportSize = null;
    _change = new be;
    _document = I(ke);
    constructor() { let e = I(ve), t = I(Se).createRenderer(null, null); e.runOutsideAngular(() => { if (this._platform.isBrowser) {
        let n = o => this._change.next(o);
        this._listeners = [t.listen("window", "resize", n), t.listen("window", "orientationchange", n)];
    } this.change().subscribe(() => this._viewportSize = null); }); }
    ngOnDestroy() { this._listeners?.forEach(e => e()), this._change.complete(); }
    getViewportSize() { this._viewportSize || this._updateViewportSize(); let e = { width: this._viewportSize.width, height: this._viewportSize.height }; return this._platform.isBrowser || (this._viewportSize = null), e; }
    getViewportRect() { let e = this.getViewportScrollPosition(), { width: t, height: n } = this.getViewportSize(); return { top: e.top, left: e.left, bottom: e.top + n, right: e.left + t, height: n, width: t }; }
    getViewportScrollPosition() { if (!this._platform.isBrowser)
        return { top: 0, left: 0 }; let e = this._document, t = this._getWindow(), n = e.documentElement, o = n.getBoundingClientRect(), s = -o.top || e.body?.scrollTop || t.scrollY || n.scrollTop || 0, l = -o.left || e.body?.scrollLeft || t.scrollX || n.scrollLeft || 0; return { top: s, left: l }; }
    change(e = xe) { return e > 0 ? this._change.pipe(Ee(e)) : this._change; }
    _getWindow() { return this._document.defaultView || window; }
    _updateViewportSize() { let e = this._getWindow(); this._viewportSize = this._platform.isBrowser ? { width: e.innerWidth, height: e.innerHeight } : { width: 0, height: 0 }; }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275prov = f.\u0275\u0275defineService({ token: i, factory: i.\u0275fac });
} return i; })();
var ne = new De("CDK_VIRTUAL_SCROLL_VIEWPORT");
var te = (() => { class i {
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275mod = f.\u0275\u0275defineNgModule({ type: i });
    static \u0275inj = f.\u0275\u0275defineInjector({});
} return i; })(), re = (() => { class i {
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275mod = f.\u0275\u0275defineNgModule({ type: i });
    static \u0275inj = f.\u0275\u0275defineInjector({ imports: [P, te, P, te] });
} return i; })();
var z = class {
    applyChanges(a, e, t, n, o) { a.forEachOperation((s, l, d) => { let h, u; if (s.previousIndex == null) {
        let _ = t(s, l, d);
        h = e.createEmbeddedView(_.templateRef, _.context, _.index), u = y.INSERTED;
    }
    else
        d == null ? (e.remove(l), u = y.REMOVED) : (h = e.get(l), e.move(h, d), u = y.MOVED); o && o({ context: h?.context, operation: u, record: s }); }); }
    detach() { }
};
import "@angular/common";
var Le = [[["caption"]], [["colgroup"], ["col"]], "*"], Pe = ["caption", "colgroup, col", "*"];
function He(i, a) { i & 1 && r.\u0275\u0275projection(0, 2); }
function je(i, a) { i & 1 && (r.\u0275\u0275elementStart(0, "thead", 0), r.\u0275\u0275elementContainer(1, 1), r.\u0275\u0275elementEnd(), r.\u0275\u0275elementStart(2, "tbody", 0), r.\u0275\u0275elementContainer(3, 2)(4, 3), r.\u0275\u0275elementEnd(), r.\u0275\u0275elementStart(5, "tfoot", 0), r.\u0275\u0275elementContainer(6, 4), r.\u0275\u0275elementEnd()); }
function Ue(i, a) { i & 1 && r.\u0275\u0275elementContainer(0, 1)(1, 2)(2, 3)(3, 4); }
function We(i, a) { if (i & 1 && (r.\u0275\u0275elementStart(0, "th", 3), r.\u0275\u0275text(1), r.\u0275\u0275elementEnd()), i & 2) {
    let e = r.\u0275\u0275nextContext();
    r.\u0275\u0275styleProp("text-align", e.justify), r.\u0275\u0275advance(), r.\u0275\u0275textInterpolate1(" ", e.headerText, " ");
} }
function Qe(i, a) { if (i & 1 && (r.\u0275\u0275elementStart(0, "td", 4), r.\u0275\u0275text(1), r.\u0275\u0275elementEnd()), i & 2) {
    let e = a.$implicit, t = r.\u0275\u0275nextContext();
    r.\u0275\u0275styleProp("text-align", t.justify), r.\u0275\u0275advance(), r.\u0275\u0275textInterpolate1(" ", t.dataAccessor(e, t.name), " ");
} }
var C = new $("CDK_TABLE"), $e = new $("text-column-options"), U = (() => { class i {
    template = c(T);
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "cdkCellDef", ""]] });
} return i; })(), W = (() => { class i {
    template = c(T);
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "cdkHeaderCellDef", ""]] });
} return i; })(), qe = (() => { class i {
    template = c(T);
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "cdkFooterCellDef", ""]] });
} return i; })(), k = (() => { class i {
    _table = c(C, { optional: !0 });
    _hasStickyChanged = !1;
    get name() { return this._name; }
    set name(e) { this._setNameInput(e); }
    _name;
    get sticky() { return this._sticky; }
    set sticky(e) { e !== this._sticky && (this._sticky = e, this._hasStickyChanged = !0); }
    _sticky = !1;
    get stickyEnd() { return this._stickyEnd; }
    set stickyEnd(e) { e !== this._stickyEnd && (this._stickyEnd = e, this._hasStickyChanged = !0); }
    _stickyEnd = !1;
    cell;
    headerCell;
    footerCell;
    cssClassFriendlyName;
    _columnCssClassName;
    hasStickyChanged() { let e = this._hasStickyChanged; return this.resetStickyChanged(), e; }
    resetStickyChanged() { this._hasStickyChanged = !1; }
    _updateColumnCssClassName() { this._columnCssClassName = [`cdk-column-${this.cssClassFriendlyName}`]; }
    _setNameInput(e) { e && (this._name = e, this.cssClassFriendlyName = e.replace(/[^a-z0-9_-]/gi, "-"), this._updateColumnCssClassName()); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "cdkColumnDef", ""]], contentQueries: function (t, n, o) { if (t & 1 && r.\u0275\u0275contentQuery(o, U, 5)(o, W, 5)(o, qe, 5), t & 2) {
            let s;
            r.\u0275\u0275queryRefresh(s = r.\u0275\u0275loadQuery()) && (n.cell = s.first), r.\u0275\u0275queryRefresh(s = r.\u0275\u0275loadQuery()) && (n.headerCell = s.first), r.\u0275\u0275queryRefresh(s = r.\u0275\u0275loadQuery()) && (n.footerCell = s.first);
        } }, inputs: { name: [0, "cdkColumnDef", "name"], sticky: [2, "sticky", "sticky", v], stickyEnd: [2, "stickyEnd", "stickyEnd", v] } });
} return i; })(), E = class {
    constructor(a, e) { e.nativeElement.classList.add(...a._columnCssClassName); }
}, Ge = (() => { class i extends E {
    constructor() { super(c(k), c(R)); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["cdk-header-cell"], ["th", "cdk-header-cell", ""]], hostAttrs: ["role", "columnheader", 1, "cdk-header-cell"], features: [r.\u0275\u0275InheritDefinitionFeature] });
} return i; })(), Bi = (() => { class i extends E {
    constructor() { let e = c(k), t = c(R); super(e, t); let n = e._table?._getCellRole(); n && t.nativeElement.setAttribute("role", n); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["cdk-footer-cell"], ["td", "cdk-footer-cell", ""]], hostAttrs: [1, "cdk-footer-cell"], features: [r.\u0275\u0275InheritDefinitionFeature] });
} return i; })(), Ze = (() => { class i extends E {
    constructor() { let e = c(k), t = c(R); super(e, t); let n = e._table?._getCellRole(); n && t.nativeElement.setAttribute("role", n); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["cdk-cell"], ["td", "cdk-cell", ""]], hostAttrs: [1, "cdk-cell"], features: [r.\u0275\u0275InheritDefinitionFeature] });
} return i; })(), Ai = "<ng-container cdkCellOutlet></ng-container>", q = (() => { class i {
    template = c(T);
    _differs = c(le);
    columns;
    _columnsDiffer;
    ngOnChanges(e) { if (!this._columnsDiffer) {
        let t = e.columns && e.columns.currentValue || [];
        this._columnsDiffer = this._differs.find(t).create(), this._columnsDiffer.diff(t);
    } }
    getColumnsDiff() { return this._columnsDiffer.diff(this.columns); }
    extractCellTemplate(e) { return this instanceof ce ? e.headerCell.template : this instanceof de ? e.footerCell.template : e.cell.template; }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, features: [r.\u0275\u0275NgOnChangesFeature] });
} return i; })(), ce = (() => { class i extends q {
    _table = c(C, { optional: !0 });
    _hasStickyChanged = !1;
    get sticky() { return this._sticky; }
    set sticky(e) { e !== this._sticky && (this._sticky = e, this._hasStickyChanged = !0); }
    _sticky = !1;
    ngOnChanges(e) { super.ngOnChanges(e); }
    hasStickyChanged() { let e = this._hasStickyChanged; return this.resetStickyChanged(), e; }
    resetStickyChanged() { this._hasStickyChanged = !1; }
    static \u0275fac = (() => { let e; return function (n) { return (e || (e = r.\u0275\u0275getInheritedFactory(i)))(n || i); }; })();
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "cdkHeaderRowDef", ""]], inputs: { columns: [0, "cdkHeaderRowDef", "columns"], sticky: [2, "cdkHeaderRowDefSticky", "sticky", v] }, features: [r.\u0275\u0275InheritDefinitionFeature, r.\u0275\u0275NgOnChangesFeature] });
} return i; })(), de = (() => { class i extends q {
    _table = c(C, { optional: !0 });
    _hasStickyChanged = !1;
    get sticky() { return this._sticky; }
    set sticky(e) { e !== this._sticky && (this._sticky = e, this._hasStickyChanged = !0); }
    _sticky = !1;
    ngOnChanges(e) { super.ngOnChanges(e); }
    hasStickyChanged() { let e = this._hasStickyChanged; return this.resetStickyChanged(), e; }
    resetStickyChanged() { this._hasStickyChanged = !1; }
    static \u0275fac = (() => { let e; return function (n) { return (e || (e = r.\u0275\u0275getInheritedFactory(i)))(n || i); }; })();
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "cdkFooterRowDef", ""]], inputs: { columns: [0, "cdkFooterRowDef", "columns"], sticky: [2, "cdkFooterRowDefSticky", "sticky", v] }, features: [r.\u0275\u0275InheritDefinitionFeature, r.\u0275\u0275NgOnChangesFeature] });
} return i; })(), Ke = (() => { class i extends q {
    _table = c(C, { optional: !0 });
    when;
    static \u0275fac = (() => { let e; return function (n) { return (e || (e = r.\u0275\u0275getInheritedFactory(i)))(n || i); }; })();
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "cdkRowDef", ""]], inputs: { columns: [0, "cdkRowDefColumns", "columns"], when: [0, "cdkRowDefWhen", "when"] }, features: [r.\u0275\u0275InheritDefinitionFeature] });
} return i; })(), x = (() => { class i {
    _viewContainer = c(O);
    cells;
    context;
    static mostRecentCellOutlet = null;
    constructor() { i.mostRecentCellOutlet = this; }
    ngOnDestroy() { i.mostRecentCellOutlet === this && (i.mostRecentCellOutlet = null); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "cdkCellOutlet", ""]] });
} return i; })(), Vi = (() => { class i {
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275cmp = r.\u0275\u0275defineComponent({ type: i, selectors: [["cdk-header-row"], ["tr", "cdk-header-row", ""]], hostAttrs: ["role", "row", 1, "cdk-header-row"], decls: 1, vars: 0, consts: [["cdkCellOutlet", ""]], template: function (t, n) { t & 1 && r.\u0275\u0275elementContainer(0, 0); }, dependencies: [x], encapsulation: 2, changeDetection: 1 });
} return i; })(), Li = (() => { class i {
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275cmp = r.\u0275\u0275defineComponent({ type: i, selectors: [["cdk-footer-row"], ["tr", "cdk-footer-row", ""]], hostAttrs: ["role", "row", 1, "cdk-footer-row"], decls: 1, vars: 0, consts: [["cdkCellOutlet", ""]], template: function (t, n) { t & 1 && r.\u0275\u0275elementContainer(0, 0); }, dependencies: [x], encapsulation: 2, changeDetection: 1 });
} return i; })(), Pi = (() => { class i {
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275cmp = r.\u0275\u0275defineComponent({ type: i, selectors: [["cdk-row"], ["tr", "cdk-row", ""]], hostAttrs: ["role", "row", 1, "cdk-row"], decls: 1, vars: 0, consts: [["cdkCellOutlet", ""]], template: function (t, n) { t & 1 && r.\u0275\u0275elementContainer(0, 0); }, dependencies: [x], encapsulation: 2, changeDetection: 1 });
} return i; })(), Ye = (() => { class i {
    templateRef = c(T);
    _contentClassNames = ["cdk-no-data-row", "cdk-row"];
    _cellClassNames = ["cdk-cell", "cdk-no-data-cell"];
    _cellSelector = "td, cdk-cell, [cdk-cell], .cdk-cell";
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["ng-template", "cdkNoDataRow", ""]] });
} return i; })(), se = ["top", "bottom", "left", "right"], Q = class {
    _isNativeHtmlTable;
    _stickCellCss;
    _isBrowser;
    _needsPositionStickyOnElement;
    direction;
    _positionListener;
    _tableInjector;
    _elemSizeCache = new WeakMap;
    _resizeObserver = globalThis?.ResizeObserver ? new globalThis.ResizeObserver(a => this._updateCachedSizes(a)) : null;
    _updatedStickyColumnsParamsToReplay = [];
    _stickyColumnsReplayTimeout = null;
    _cachedCellWidths = [];
    _borderCellCss;
    _destroyed = !1;
    constructor(a, e, t = !0, n = !0, o, s, l) { this._isNativeHtmlTable = a, this._stickCellCss = e, this._isBrowser = t, this._needsPositionStickyOnElement = n, this.direction = o, this._positionListener = s, this._tableInjector = l, this._borderCellCss = { top: `${e}-border-elem-top`, bottom: `${e}-border-elem-bottom`, left: `${e}-border-elem-left`, right: `${e}-border-elem-right` }; }
    clearStickyPositioning(a, e) { (e.includes("left") || e.includes("right")) && this._removeFromStickyColumnReplayQueue(a); let t = []; for (let n of a)
        n.nodeType === n.ELEMENT_NODE && t.push(n, ...Array.from(n.children)); B({ write: () => { for (let n of t)
            this._removeStickyStyle(n, e); } }, { injector: this._tableInjector }); }
    updateStickyColumns(a, e, t, n = !0, o = !0) { if (!a.length || !this._isBrowser || !(e.some(w => w) || t.some(w => w))) {
        this._positionListener?.stickyColumnsUpdated({ sizes: [] }), this._positionListener?.stickyEndColumnsUpdated({ sizes: [] });
        return;
    } let s = a[0], l = s.children.length, d = this.direction === "rtl", h = d ? "right" : "left", u = d ? "left" : "right", _ = e.lastIndexOf(!0), m = t.indexOf(!0), p, G, Z; o && this._updateStickyColumnReplayQueue({ rows: [...a], stickyStartStates: [...e], stickyEndStates: [...t] }), B({ earlyRead: () => { p = this._getCellWidths(s, n), G = this._getStickyStartColumnPositions(p, e), Z = this._getStickyEndColumnPositions(p, t); }, write: () => { for (let w of a)
            for (let g = 0; g < l; g++) {
                let K = w.children[g];
                e[g] && this._addStickyStyle(K, h, G[g], g === _), t[g] && this._addStickyStyle(K, u, Z[g], g === m);
            } this._positionListener && p.some(w => !!w) && (this._positionListener.stickyColumnsUpdated({ sizes: _ === -1 ? [] : p.slice(0, _ + 1).map((w, g) => e[g] ? w : null) }), this._positionListener.stickyEndColumnsUpdated({ sizes: m === -1 ? [] : p.slice(m).map((w, g) => t[g + m] ? w : null).reverse() })); } }, { injector: this._tableInjector }); }
    stickRows(a, e, t) { if (!this._isBrowser)
        return; let n = t === "bottom" ? a.slice().reverse() : a, o = t === "bottom" ? e.slice().reverse() : e, s = [], l = [], d = []; B({ earlyRead: () => { for (let h = 0, u = 0; h < n.length; h++) {
            if (!o[h])
                continue;
            s[h] = u;
            let _ = n[h];
            d[h] = this._isNativeHtmlTable ? Array.from(_.children) : [_];
            let m = this._retrieveElementSize(_).height;
            u += m, l[h] = m;
        } }, write: () => { let h = o.lastIndexOf(!0); for (let u = 0; u < n.length; u++) {
            if (!o[u])
                continue;
            let _ = s[u], m = u === h;
            for (let p of d[u])
                this._addStickyStyle(p, t, _, m);
        } t === "top" ? this._positionListener?.stickyHeaderRowsUpdated({ sizes: l, offsets: s, elements: d }) : this._positionListener?.stickyFooterRowsUpdated({ sizes: l, offsets: s, elements: d }); } }, { injector: this._tableInjector }); }
    updateStickyFooterContainer(a, e) { this._isNativeHtmlTable && B({ write: () => { let t = a.querySelector("tfoot"); t && (e.some(n => !n) ? this._removeStickyStyle(t, ["bottom"]) : this._addStickyStyle(t, "bottom", 0, !1)); } }, { injector: this._tableInjector }); }
    destroy() { this._stickyColumnsReplayTimeout && clearTimeout(this._stickyColumnsReplayTimeout), this._resizeObserver?.disconnect(), this._destroyed = !0; }
    _removeStickyStyle(a, e) { if (!a.classList.contains(this._stickCellCss))
        return; for (let n of e)
        a.style[n] = "", a.classList.remove(this._borderCellCss[n]); se.some(n => e.indexOf(n) === -1 && a.style[n]) ? a.style.zIndex = this._getCalculatedZIndex(a) : (a.style.zIndex = "", this._needsPositionStickyOnElement && (a.style.position = ""), a.classList.remove(this._stickCellCss)); }
    _addStickyStyle(a, e, t, n) { a.classList.add(this._stickCellCss), n && a.classList.add(this._borderCellCss[e]), a.style[e] = `${t}px`, a.style.zIndex = this._getCalculatedZIndex(a), this._needsPositionStickyOnElement && (a.style.cssText += "position: -webkit-sticky; position: sticky; "); }
    _getCalculatedZIndex(a) { let e = { top: 100, bottom: 10, left: 1, right: 1 }, t = 0; for (let n of se)
        a.style[n] && (t += e[n]); return t ? `${t}` : ""; }
    _getCellWidths(a, e = !0) { if (!e && this._cachedCellWidths.length)
        return this._cachedCellWidths; let t = [], n = a.children; for (let o = 0; o < n.length; o++) {
        let s = n[o];
        t.push(this._retrieveElementSize(s).width);
    } return this._cachedCellWidths = t, t; }
    _getStickyStartColumnPositions(a, e) { let t = [], n = 0; for (let o = 0; o < a.length; o++)
        e[o] && (t[o] = n, n += a[o]); return t; }
    _getStickyEndColumnPositions(a, e) { let t = [], n = 0; for (let o = a.length; o > 0; o--)
        e[o] && (t[o] = n, n += a[o]); return t; }
    _retrieveElementSize(a) { let e = this._elemSizeCache.get(a); if (e)
        return e; let t = a.getBoundingClientRect(), n = { width: t.width, height: t.height }; return this._resizeObserver && (this._elemSizeCache.set(a, n), this._resizeObserver.observe(a, { box: "border-box" })), n; }
    _updateStickyColumnReplayQueue(a) { this._removeFromStickyColumnReplayQueue(a.rows), this._stickyColumnsReplayTimeout || this._updatedStickyColumnsParamsToReplay.push(a); }
    _removeFromStickyColumnReplayQueue(a) { let e = new Set(a); for (let t of this._updatedStickyColumnsParamsToReplay)
        t.rows = t.rows.filter(n => !e.has(n)); this._updatedStickyColumnsParamsToReplay = this._updatedStickyColumnsParamsToReplay.filter(t => !!t.rows.length); }
    _updateCachedSizes(a) { let e = !1; for (let t of a) {
        let n = t.borderBoxSize?.length ? { width: t.borderBoxSize[0].inlineSize, height: t.borderBoxSize[0].blockSize } : { width: t.contentRect.width, height: t.contentRect.height };
        n.width !== this._elemSizeCache.get(t.target)?.width && Xe(t.target) && (e = !0), this._elemSizeCache.set(t.target, n);
    } e && this._updatedStickyColumnsParamsToReplay.length && (this._stickyColumnsReplayTimeout && clearTimeout(this._stickyColumnsReplayTimeout), this._stickyColumnsReplayTimeout = setTimeout(() => { if (!this._destroyed) {
        for (let t of this._updatedStickyColumnsParamsToReplay)
            this.updateStickyColumns(t.rows, t.stickyStartStates, t.stickyEndStates, !0, !1);
        this._updatedStickyColumnsParamsToReplay = [], this._stickyColumnsReplayTimeout = null;
    } }, 0)); }
};
function Xe(i) { return ["cdk-cell", "cdk-header-cell", "cdk-footer-cell"].some(a => i.classList.contains(a)); }
var j = new $("STICKY_POSITIONING_LISTENER"), Hi = (() => { class i {
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["cdk-table", "recycleRows", ""], ["table", "cdk-table", "", "recycleRows", ""]] });
} return i; })(), Je = (() => { class i {
    viewContainer = c(O);
    elementRef = c(R);
    constructor() { let e = c(C); e._rowOutlet = this, e._outletAssigned(); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "rowOutlet", ""]] });
} return i; })(), et = (() => { class i {
    viewContainer = c(O);
    elementRef = c(R);
    constructor() { let e = c(C); e._headerRowOutlet = this, e._outletAssigned(); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "headerRowOutlet", ""]] });
} return i; })(), tt = (() => { class i {
    viewContainer = c(O);
    elementRef = c(R);
    constructor() { let e = c(C); e._footerRowOutlet = this, e._outletAssigned(); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "footerRowOutlet", ""]] });
} return i; })(), it = (() => { class i {
    viewContainer = c(O);
    elementRef = c(R);
    constructor() { let e = c(C); e._noDataRowOutlet = this, e._outletAssigned(); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275dir = r.\u0275\u0275defineDirective({ type: i, selectors: [["", "noDataRowOutlet", ""]] });
} return i; })(), nt = (() => {
    class i {
        _differs = c(le);
        _changeDetectorRef = c(Te);
        _elementRef = c(R);
        _dir = c(J, { optional: !0 });
        _platform = c(M);
        _viewRepeater;
        _viewportRuler = c(ie);
        _injector = c(Oe);
        _virtualScrollViewport = c(ne, { optional: !0, host: !0 });
        _positionListener = c(j, { optional: !0 }) || c(j, { optional: !0, skipSelf: !0 });
        _document = c(Me);
        _data;
        _renderedRange;
        _onDestroy = new b;
        _renderRows;
        _renderChangeSubscription = null;
        _columnDefsByName = new Map;
        _rowDefs;
        _headerRowDefs;
        _footerRowDefs;
        _dataDiffer;
        _defaultRowDef = null;
        _customColumnDefs = new Set;
        _customRowDefs = new Set;
        _customHeaderRowDefs = new Set;
        _customFooterRowDefs = new Set;
        _customNoDataRow = null;
        _headerRowDefChanged = !0;
        _footerRowDefChanged = !0;
        _stickyColumnStylesNeedReset = !0;
        _forceRecalculateCellWidths = !0;
        _cachedRenderRowsMap = new Map;
        _isNativeHtmlTable;
        _stickyStyler;
        stickyCssClass = "cdk-table-sticky";
        needsPositionStickyOnElement = !0;
        _isServer;
        _isShowingNoDataRow = !1;
        _hasAllOutlets = !1;
        _hasInitialized = !1;
        _headerRowStickyUpdates = new b;
        _footerRowStickyUpdates = new b;
        _disableVirtualScrolling = !1;
        _getCellRole() { if (this._cellRoleInternal === void 0) {
            let e = this._elementRef.nativeElement.getAttribute("role");
            return e === "grid" || e === "treegrid" ? "gridcell" : "cell";
        } return this._cellRoleInternal; }
        _cellRoleInternal = void 0;
        get trackBy() { return this._trackByFn; }
        set trackBy(e) { this._trackByFn = e; }
        _trackByFn;
        get dataSource() { return this._dataSource; }
        set dataSource(e) { this._dataSource !== e && (this._switchDataSource(e), this._changeDetectorRef.markForCheck()); }
        _dataSource;
        _dataSourceChanges = new b;
        _dataStream = new b;
        get multiTemplateDataRows() { return this._multiTemplateDataRows; }
        set multiTemplateDataRows(e) { this._multiTemplateDataRows = e, this._rowOutlet && this._rowOutlet.viewContainer.length && (this._forceRenderDataRows(), this.updateStickyColumnStyles()); }
        _multiTemplateDataRows = !1;
        get fixedLayout() { return this._virtualScrollEnabled() ? !0 : this._fixedLayout; }
        set fixedLayout(e) { this._fixedLayout = e, this._forceRecalculateCellWidths = !0, this._stickyColumnStylesNeedReset = !0; }
        _fixedLayout = !1;
        recycleRows = !1;
        contentChanged = new Fe;
        viewChange = new Ie({ start: 0, end: Number.MAX_VALUE });
        _rowOutlet;
        _headerRowOutlet;
        _footerRowOutlet;
        _noDataRowOutlet;
        _contentColumnDefs;
        _contentRowDefs;
        _contentHeaderRowDefs;
        _contentFooterRowDefs;
        _noDataRow;
        get renderedRows() { return this._renderRows; }
        constructor() { c(new Ne("role"), { optional: !0 }) || this._elementRef.nativeElement.setAttribute("role", "table"), this._isServer = !this._platform.isBrowser, this._isNativeHtmlTable = this._elementRef.nativeElement.nodeName === "TABLE", this._dataDiffer = this._differs.find([]).create((t, n) => this.trackBy ? this.trackBy(n.dataIndex, n.data) : n); }
        ngOnInit() { this._setupStickyStyler(), this._viewportRuler.change().pipe(S(this._onDestroy)).subscribe(() => { this._forceRecalculateCellWidths = !0; }); }
        ngAfterContentInit() { this._viewRepeater = this.recycleRows || this._virtualScrollEnabled() ? new N : new z, this._virtualScrollEnabled() && this._setupVirtualScrolling(this._virtualScrollViewport), this._hasInitialized = !0; }
        ngAfterContentChecked() { this._canRender() && this._render(); }
        ngOnDestroy() { this._stickyStyler?.destroy(), [this._rowOutlet?.viewContainer, this._headerRowOutlet?.viewContainer, this._footerRowOutlet?.viewContainer, this._cachedRenderRowsMap, this._customColumnDefs, this._customRowDefs, this._customHeaderRowDefs, this._customFooterRowDefs, this._columnDefsByName].forEach(e => { e?.clear(); }), this._headerRowDefs = [], this._footerRowDefs = [], this._defaultRowDef = null, this._headerRowStickyUpdates.complete(), this._footerRowStickyUpdates.complete(), this._onDestroy.next(), this._onDestroy.complete(), F(this.dataSource) && this.dataSource.disconnect(this); }
        renderRows() { this._renderRows = this._getAllRenderRows(); let e = this._dataDiffer.diff(this._renderRows); if (!e) {
            this._updateNoDataRow(), this.contentChanged.next();
            return;
        } let t = this._rowOutlet.viewContainer; this._viewRepeater.applyChanges(e, t, (n, o, s) => this._getEmbeddedViewArgs(n.item, s), n => n.item.data, n => { n.operation === y.INSERTED && n.context && this._renderCellTemplateForItem(n.record.item.rowDef, n.context); }), this._updateRowIndexContext(), e.forEachIdentityChange(n => { let o = t.get(n.currentIndex); o.context.$implicit = n.item.data; }), this._updateNoDataRow(), this.contentChanged.next(), this.updateStickyColumnStyles(); }
        addColumnDef(e) { this._customColumnDefs.add(e); }
        removeColumnDef(e) { this._customColumnDefs.delete(e); }
        addRowDef(e) { this._customRowDefs.add(e); }
        removeRowDef(e) { this._customRowDefs.delete(e); }
        addHeaderRowDef(e) { this._customHeaderRowDefs.add(e), this._headerRowDefChanged = !0; }
        removeHeaderRowDef(e) { this._customHeaderRowDefs.delete(e), this._headerRowDefChanged = !0; }
        addFooterRowDef(e) { this._customFooterRowDefs.add(e), this._footerRowDefChanged = !0; }
        removeFooterRowDef(e) { this._customFooterRowDefs.delete(e), this._footerRowDefChanged = !0; }
        setNoDataRow(e) { this._customNoDataRow = e; }
        updateStickyHeaderRowStyles() { let e = this._getRenderedRows(this._headerRowOutlet); if (this._isNativeHtmlTable) {
            let n = ae(this._headerRowOutlet, "thead");
            n && (n.style.display = e.length ? "" : "none");
        } let t = this._headerRowDefs.map(n => n.sticky); this._stickyStyler.clearStickyPositioning(e, ["top"]), this._stickyStyler.stickRows(e, t, "top"), this._headerRowDefs.forEach(n => n.resetStickyChanged()); }
        updateStickyFooterRowStyles() { let e = this._getRenderedRows(this._footerRowOutlet); if (this._isNativeHtmlTable) {
            let n = ae(this._footerRowOutlet, "tfoot");
            n && (n.style.display = e.length ? "" : "none");
        } let t = this._footerRowDefs.map(n => n.sticky); this._stickyStyler.clearStickyPositioning(e, ["bottom"]), this._stickyStyler.stickRows(e, t, "bottom"), this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement, t), this._footerRowDefs.forEach(n => n.resetStickyChanged()); }
        updateStickyColumnStyles() { let e = this._getRenderedRows(this._headerRowOutlet), t = this._getRenderedRows(this._rowOutlet), n = this._getRenderedRows(this._footerRowOutlet); (this._isNativeHtmlTable && !this.fixedLayout || this._stickyColumnStylesNeedReset) && (this._stickyStyler.clearStickyPositioning([...e, ...t, ...n], ["left", "right"]), this._stickyColumnStylesNeedReset = !1), e.forEach((o, s) => { this._addStickyColumnStyles([o], this._headerRowDefs[s]); }), this._rowDefs.forEach(o => { let s = []; for (let l = 0; l < t.length; l++)
            this._renderRows[l].rowDef === o && s.push(t[l]); this._addStickyColumnStyles(s, o); }), n.forEach((o, s) => { this._addStickyColumnStyles([o], this._footerRowDefs[s]); }), Array.from(this._columnDefsByName.values()).forEach(o => o.resetStickyChanged()); }
        stickyColumnsUpdated(e) { this._positionListener?.stickyColumnsUpdated(e); }
        stickyEndColumnsUpdated(e) { this._positionListener?.stickyEndColumnsUpdated(e); }
        stickyHeaderRowsUpdated(e) { this._headerRowStickyUpdates.next(e), this._positionListener?.stickyHeaderRowsUpdated(e); }
        stickyFooterRowsUpdated(e) { this._footerRowStickyUpdates.next(e), this._positionListener?.stickyFooterRowsUpdated(e); }
        _outletAssigned() { !this._hasAllOutlets && this._rowOutlet && this._headerRowOutlet && this._footerRowOutlet && this._noDataRowOutlet && (this._hasAllOutlets = !0, this._canRender() && this._render()); }
        _canRender() { return this._hasAllOutlets && this._hasInitialized; }
        _render() { this._cacheRowDefs(), this._cacheColumnDefs(), !this._headerRowDefs.length && !this._footerRowDefs.length && this._rowDefs.length; let t = this._renderUpdatedColumns() || this._headerRowDefChanged || this._footerRowDefChanged; this._stickyColumnStylesNeedReset = this._stickyColumnStylesNeedReset || t, this._forceRecalculateCellWidths = t, this._headerRowDefChanged && (this._forceRenderHeaderRows(), this._headerRowDefChanged = !1), this._footerRowDefChanged && (this._forceRenderFooterRows(), this._footerRowDefChanged = !1), this.dataSource && this._rowDefs.length > 0 && !this._renderChangeSubscription ? this._observeRenderChanges() : this._stickyColumnStylesNeedReset && this.updateStickyColumnStyles(), this._checkStickyStates(); }
        _getAllRenderRows() { if (!Array.isArray(this._data) || !this._renderedRange)
            return []; let e = [], t = Math.min(this._data.length, this._renderedRange.end), n = this._cachedRenderRowsMap; this._cachedRenderRowsMap = new Map; for (let o = this._renderedRange.start; o < t; o++) {
            let s = this._data[o], l = this._getRenderRowsForData(s, o, n.get(s));
            this._cachedRenderRowsMap.has(s) || this._cachedRenderRowsMap.set(s, new WeakMap);
            for (let d = 0; d < l.length; d++) {
                let h = l[d], u = this._cachedRenderRowsMap.get(h.data);
                u.has(h.rowDef) ? u.get(h.rowDef).push(h) : u.set(h.rowDef, [h]), e.push(h);
            }
        } return e; }
        _getRenderRowsForData(e, t, n) { return this._getRowDefs(e, t).map(s => { let l = n && n.has(s) ? n.get(s) : []; if (l.length) {
            let d = l.shift();
            return d.dataIndex = t, d;
        }
        else
            return { data: e, rowDef: s, dataIndex: t }; }); }
        _cacheColumnDefs() { this._columnDefsByName.clear(), A(this._getOwnDefs(this._contentColumnDefs), this._customColumnDefs).forEach(t => { this._columnDefsByName.has(t.name), this._columnDefsByName.set(t.name, t); }); }
        _cacheRowDefs() { this._headerRowDefs = A(this._getOwnDefs(this._contentHeaderRowDefs), this._customHeaderRowDefs), this._footerRowDefs = A(this._getOwnDefs(this._contentFooterRowDefs), this._customFooterRowDefs), this._rowDefs = A(this._getOwnDefs(this._contentRowDefs), this._customRowDefs); let e = this._rowDefs.filter(t => !t.when); this._defaultRowDef = e[0]; }
        _renderUpdatedColumns() { let e = (s, l) => { let d = !!l.getColumnsDiff(); return s || d; }, t = this._rowDefs.reduce(e, !1); t && this._forceRenderDataRows(); let n = this._headerRowDefs.reduce(e, !1); n && this._forceRenderHeaderRows(); let o = this._footerRowDefs.reduce(e, !1); return o && this._forceRenderFooterRows(), t || n || o; }
        _switchDataSource(e) { this._data = [], F(this.dataSource) && this.dataSource.disconnect(this), this._renderChangeSubscription && (this._renderChangeSubscription.unsubscribe(), this._renderChangeSubscription = null), e || (this._dataDiffer && this._dataDiffer.diff([]), this._rowOutlet && this._rowOutlet.viewContainer.clear()), this._dataSource = e; }
        _observeRenderChanges() { if (!this.dataSource)
            return; let e; F(this.dataSource) ? e = this.dataSource.connect(this) : ze(this.dataSource) ? e = this.dataSource : Array.isArray(this.dataSource) && (e = oe(this.dataSource)), this._renderChangeSubscription = H([e, this.viewChange]).pipe(S(this._onDestroy)).subscribe(([t, n]) => { this._data = t || [], this._renderedRange = n, this._dataStream.next(t), this.renderRows(); }); }
        _forceRenderHeaderRows() { this._headerRowOutlet.viewContainer.length > 0 && this._headerRowOutlet.viewContainer.clear(), this._headerRowDefs.forEach((e, t) => this._renderRow(this._headerRowOutlet, e, t)), this.updateStickyHeaderRowStyles(); }
        _forceRenderFooterRows() { this._footerRowOutlet.viewContainer.length > 0 && this._footerRowOutlet.viewContainer.clear(), this._footerRowDefs.forEach((e, t) => this._renderRow(this._footerRowOutlet, e, t)), this.updateStickyFooterRowStyles(); }
        _addStickyColumnStyles(e, t) { let n = Array.from(t?.columns || []).map(l => { let d = this._columnDefsByName.get(l); return d; }), o = n.map(l => l.sticky), s = n.map(l => l.stickyEnd); this._stickyStyler.updateStickyColumns(e, o, s, !this.fixedLayout || this._forceRecalculateCellWidths); }
        _getRenderedRows(e) { let t = []; for (let n = 0; n < e.viewContainer.length; n++) {
            let o = e.viewContainer.get(n);
            t.push(o.rootNodes[0]);
        } return t; }
        _getRowDefs(e, t) { if (this._rowDefs.length === 1)
            return [this._rowDefs[0]]; let n = []; if (this.multiTemplateDataRows)
            n = this._rowDefs.filter(o => !o.when || o.when(t, e));
        else {
            let o = this._rowDefs.find(s => s.when && s.when(t, e)) || this._defaultRowDef;
            o && n.push(o);
        } return n.length, n; }
        _getEmbeddedViewArgs(e, t) { let n = e.rowDef, o = { $implicit: e.data }; return { templateRef: n.template, context: o, index: t }; }
        _renderRow(e, t, n, o = {}) { let s = e.viewContainer.createEmbeddedView(t.template, o, n); return this._renderCellTemplateForItem(t, o), s; }
        _renderCellTemplateForItem(e, t) { for (let n of this._getCellTemplates(e))
            x.mostRecentCellOutlet && x.mostRecentCellOutlet._viewContainer.createEmbeddedView(n, t); this._changeDetectorRef.markForCheck(); }
        _updateRowIndexContext() { let e = this._rowOutlet.viewContainer; for (let t = 0, n = e.length; t < n; t++) {
            let s = e.get(t).context;
            s.count = n, s.first = t === 0, s.last = t === n - 1, s.even = t % 2 === 0, s.odd = !s.even, this.multiTemplateDataRows ? (s.dataIndex = this._renderRows[t].dataIndex, s.renderIndex = t) : s.index = this._renderRows[t].dataIndex;
        } }
        _getCellTemplates(e) { return !e || !e.columns ? [] : Array.from(e.columns, t => { let n = this._columnDefsByName.get(t); return e.extractCellTemplate(n); }); }
        _forceRenderDataRows() { this._dataDiffer.diff([]), this._rowOutlet.viewContainer.clear(), this.renderRows(); }
        _checkStickyStates() { let e = (t, n) => t || n.hasStickyChanged(); this._headerRowDefs.reduce(e, !1) && this.updateStickyHeaderRowStyles(), this._footerRowDefs.reduce(e, !1) && this.updateStickyFooterRowStyles(), Array.from(this._columnDefsByName.values()).reduce(e, !1) && (this._stickyColumnStylesNeedReset = !0, this.updateStickyColumnStyles()); }
        _setupStickyStyler() { let e = this._dir ? this._dir.value : "ltr", t = this._injector; this._stickyStyler = new Q(this._isNativeHtmlTable, this.stickyCssClass, this._platform.isBrowser, this.needsPositionStickyOnElement, e, this, t), (this._dir ? this._dir.change : oe()).pipe(S(this._onDestroy)).subscribe(n => { this._stickyStyler.direction = n, this.updateStickyColumnStyles(); }); }
        _setupVirtualScrolling(e) { let t = typeof requestAnimationFrame < "u" ? Be : Ae; this.viewChange.next({ start: 0, end: 0 }), e.renderedRangeStream.pipe(Ve(0, t), S(this._onDestroy)).subscribe(this.viewChange), e.attach({ dataStream: this._dataStream, measureRangeSize: (n, o) => this._measureRangeSize(n, o) }), H([e.renderedContentOffset, this._headerRowStickyUpdates]).pipe(S(this._onDestroy)).subscribe(([n, o]) => { if (!(!o.sizes || !o.offsets || !o.elements))
            for (let s = 0; s < o.elements.length; s++) {
                let l = o.elements[s];
                if (l) {
                    let d = o.offsets[s], h = n !== 0 ? Math.max(n - d, d) : -d;
                    for (let u of l)
                        u.style.top = `${-h}px`;
                }
            } }), H([e.renderedContentOffset, this._footerRowStickyUpdates]).pipe(S(this._onDestroy)).subscribe(([n, o]) => { if (!(!o.sizes || !o.offsets || !o.elements))
            for (let s = 0; s < o.elements.length; s++) {
                let l = o.elements[s];
                if (l)
                    for (let d of l)
                        d.style.bottom = `${n + o.offsets[s]}px`;
            } }); }
        _getOwnDefs(e) { return e.filter(t => !t._table || t._table === this); }
        _updateNoDataRow() { let e = this._customNoDataRow || this._noDataRow; if (!e)
            return; let t = this._rowOutlet.viewContainer.length === 0; if (t === this._isShowingNoDataRow)
            return; let n = this._noDataRowOutlet.viewContainer; if (t) {
            let o = n.createEmbeddedView(e.templateRef), s = o.rootNodes[0];
            if (o.rootNodes.length === 1 && s?.nodeType === this._document.ELEMENT_NODE) {
                s.setAttribute("role", "row"), s.classList.add(...e._contentClassNames);
                let l = s.querySelectorAll(e._cellSelector);
                for (let d = 0; d < l.length; d++)
                    l[d].classList.add(...e._cellClassNames);
            }
        }
        else
            n.clear(); this._isShowingNoDataRow = t, this._changeDetectorRef.markForCheck(); }
        _measureRangeSize(e, t) { if (e.start >= e.end || t !== "vertical")
            return 0; let n = this.viewChange.value, o = this._rowOutlet.viewContainer; e.start < n.start || e.end > n.end; let s = e.start - n.start, l = e.end - e.start, d, h; for (let m = 0; m < l; m++) {
            let p = o.get(m + s);
            if (p && p.rootNodes.length) {
                d = h = p.rootNodes[0];
                break;
            }
        } for (let m = l - 1; m > -1; m--) {
            let p = o.get(m + s);
            if (p && p.rootNodes.length) {
                h = p.rootNodes[p.rootNodes.length - 1];
                break;
            }
        } let u = d?.getBoundingClientRect?.(), _ = h?.getBoundingClientRect?.(); return u && _ ? _.bottom - u.top : 0; }
        _virtualScrollEnabled() { return !this._disableVirtualScrolling && this._virtualScrollViewport != null; }
        static \u0275fac = function (t) { return new (t || i); };
        static \u0275cmp = r.\u0275\u0275defineComponent({ type: i, selectors: [["cdk-table"], ["table", "cdk-table", ""]], contentQueries: function (t, n, o) { if (t & 1 && r.\u0275\u0275contentQuery(o, Ye, 5)(o, k, 5)(o, Ke, 5)(o, ce, 5)(o, de, 5), t & 2) {
                let s;
                r.\u0275\u0275queryRefresh(s = r.\u0275\u0275loadQuery()) && (n._noDataRow = s.first), r.\u0275\u0275queryRefresh(s = r.\u0275\u0275loadQuery()) && (n._contentColumnDefs = s), r.\u0275\u0275queryRefresh(s = r.\u0275\u0275loadQuery()) && (n._contentRowDefs = s), r.\u0275\u0275queryRefresh(s = r.\u0275\u0275loadQuery()) && (n._contentHeaderRowDefs = s), r.\u0275\u0275queryRefresh(s = r.\u0275\u0275loadQuery()) && (n._contentFooterRowDefs = s);
            } }, hostAttrs: [1, "cdk-table"], hostVars: 2, hostBindings: function (t, n) { t & 2 && r.\u0275\u0275classProp("cdk-table-fixed-layout", n.fixedLayout); }, inputs: { trackBy: "trackBy", dataSource: "dataSource", multiTemplateDataRows: [2, "multiTemplateDataRows", "multiTemplateDataRows", v], fixedLayout: [2, "fixedLayout", "fixedLayout", v], recycleRows: [2, "recycleRows", "recycleRows", v] }, outputs: { contentChanged: "contentChanged" }, exportAs: ["cdkTable"], features: [r.\u0275\u0275ProvidersFeature([{ provide: C, useExisting: i }, { provide: j, useValue: null }])], ngContentSelectors: Pe, decls: 5, vars: 2, consts: [["role", "rowgroup"], ["headerRowOutlet", ""], ["rowOutlet", ""], ["noDataRowOutlet", ""], ["footerRowOutlet", ""]], template: function (t, n) { t & 1 && (r.\u0275\u0275projectionDef(Le), r.\u0275\u0275projection(0), r.\u0275\u0275projection(1, 1), r.\u0275\u0275conditionalCreate(2, He, 1, 0), r.\u0275\u0275conditionalCreate(3, je, 7, 0)(4, Ue, 4, 0)), t & 2 && (r.\u0275\u0275advance(2), r.\u0275\u0275conditional(n._isServer ? 2 : -1), r.\u0275\u0275advance(), r.\u0275\u0275conditional(n._isNativeHtmlTable ? 3 : 4)); }, dependencies: [et, Je, it, tt], styles: [`.cdk-table-fixed-layout {
  table-layout: fixed;
}
`], encapsulation: 2, changeDetection: 1 });
    }
    return i;
})();
function A(i, a) { return i.concat(Array.from(a)); }
function ae(i, a) { let e = a.toUpperCase(), t = i.viewContainer.element.nativeElement; for (; t;) {
    let n = t.nodeType === 1 ? t.nodeName : null;
    if (n === e)
        return t;
    if (n === "TABLE")
        break;
    t = t.parentNode;
} return null; }
var ji = (() => { class i {
    _table = c(nt, { optional: !0 });
    _options = c($e, { optional: !0 });
    get name() { return this._name; }
    set name(e) { this._name = e, this._syncColumnDefName(); }
    _name;
    headerText;
    dataAccessor;
    justify = "start";
    columnDef;
    cell;
    headerCell;
    constructor() { this._options = this._options || {}; }
    ngOnInit() { this._syncColumnDefName(), this.headerText === void 0 && (this.headerText = this._createDefaultHeaderText()), this.dataAccessor || (this.dataAccessor = this._options.defaultDataAccessor || ((e, t) => e[t])), this._table && (this.columnDef.cell = this.cell, this.columnDef.headerCell = this.headerCell, this._table.addColumnDef(this.columnDef)); }
    ngOnDestroy() { this._table && this._table.removeColumnDef(this.columnDef); }
    _createDefaultHeaderText() { let e = this.name; return this._options && this._options.defaultHeaderTextTransform ? this._options.defaultHeaderTextTransform(e) : e[0].toUpperCase() + e.slice(1); }
    _syncColumnDefName() { this.columnDef && (this.columnDef.name = this.name); }
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275cmp = r.\u0275\u0275defineComponent({ type: i, selectors: [["cdk-text-column"]], viewQuery: function (t, n) { if (t & 1 && r.\u0275\u0275viewQuery(k, 7)(U, 7)(W, 7), t & 2) {
            let o;
            r.\u0275\u0275queryRefresh(o = r.\u0275\u0275loadQuery()) && (n.columnDef = o.first), r.\u0275\u0275queryRefresh(o = r.\u0275\u0275loadQuery()) && (n.cell = o.first), r.\u0275\u0275queryRefresh(o = r.\u0275\u0275loadQuery()) && (n.headerCell = o.first);
        } }, inputs: { name: "name", headerText: "headerText", dataAccessor: "dataAccessor", justify: "justify" }, decls: 3, vars: 0, consts: [["cdkColumnDef", ""], ["cdk-header-cell", "", 3, "text-align", 4, "cdkHeaderCellDef"], ["cdk-cell", "", 3, "text-align", 4, "cdkCellDef"], ["cdk-header-cell", ""], ["cdk-cell", ""]], template: function (t, n) { t & 1 && (r.\u0275\u0275elementContainerStart(0, 0), r.\u0275\u0275template(1, We, 2, 3, "th", 1)(2, Qe, 2, 3, "td", 2), r.\u0275\u0275elementContainerEnd()); }, dependencies: [k, W, Ge, U, Ze], encapsulation: 2, changeDetection: 1 });
} return i; })();
var Ui = (() => { class i {
    static \u0275fac = function (t) { return new (t || i); };
    static \u0275mod = r.\u0275\u0275defineNgModule({ type: i });
    static \u0275inj = r.\u0275\u0275defineInjector({ imports: [re] });
} return i; })();
export { E as BaseCdkCell, q as BaseRowDef, Ai as CDK_ROW_TEMPLATE, C as CDK_TABLE, Ze as CdkCell, U as CdkCellDef, x as CdkCellOutlet, k as CdkColumnDef, Bi as CdkFooterCell, qe as CdkFooterCellDef, Li as CdkFooterRow, de as CdkFooterRowDef, Ge as CdkHeaderCell, W as CdkHeaderCellDef, Vi as CdkHeaderRow, ce as CdkHeaderRowDef, Ye as CdkNoDataRow, Hi as CdkRecycleRows, Pi as CdkRow, Ke as CdkRowDef, nt as CdkTable, Ui as CdkTableModule, ji as CdkTextColumn, Je as DataRowOutlet, L as DataSource, tt as FooterRowOutlet, et as HeaderRowOutlet, it as NoDataRowOutlet, j as STICKY_POSITIONING_LISTENER, $e as TEXT_COLUMN_OPTIONS };
