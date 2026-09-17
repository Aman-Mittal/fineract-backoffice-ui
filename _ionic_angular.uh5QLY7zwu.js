import { a as At } from "@nf-internal/chunk-7XPDQI7C";
import { b as Ko } from "@nf-internal/chunk-4IFEOWOO";
import { a as Qo } from "@nf-internal/chunk-OUQRWMAI";
import { a as L } from "@nf-internal/chunk-B5XQ7TKQ";
import { i as Uo } from "@nf-internal/chunk-5BITKP6U";
import { b as qo, c as zt } from "@nf-internal/chunk-H4B3ZOLY";
import { c as Tt, d as wt, e as St, f as Mt, g as Rt, h as Et, i as kt } from "@nf-internal/chunk-QKUPCOKR";
import "@nf-internal/chunk-UEP2XE3O";
import { a as V } from "@nf-internal/chunk-LX4F463G";
import "@nf-internal/chunk-YK4F7Q7H";
import "@nf-internal/chunk-PJKO2XHO";
import "@nf-internal/chunk-ZNX7NM6F";
import "@nf-internal/chunk-TZEWLQBP";
import { d as Xo } from "@nf-internal/chunk-C2WRTRKV";
import { a as Ho, b as Wo, d as jt } from "@nf-internal/chunk-EETP6BN4";
import { t as Yo } from "@nf-internal/chunk-NG3GO5GG";
import { a as mi, b as zo, c as fi, d as yt, e as Dt, f as xt, g as gi, h as hi, i as w, k as Ao, l as Fo, m as Bo, n as Po, o as Oo, p as R, q as No, r as Lo, s as Vo, t as _o, u as Zo, v as Go, w as D, x as vi } from "@nf-internal/chunk-TR6PF56N";
import "@nf-internal/chunk-MA4MORD4";
import "@nf-internal/chunk-QZVVYYUJ";
import "@nf-internal/chunk-6RFMZFTA";
import "@nf-internal/chunk-QAKPNJZU";
import "@nf-internal/chunk-AFC3S5XK";
import "@nf-internal/chunk-5OCVSD5Y";
import "@nf-internal/chunk-QIAUKDMS";
import "@nf-internal/chunk-OU2VS4HL";
import "@nf-internal/chunk-JYWXGWOM";
import { a as N } from "@nf-internal/chunk-J5343RMQ";
import "@nf-internal/chunk-55MUSWHY";
import { a as k, b as z, d as O, e as ko } from "@nf-internal/chunk-JHI3MBHO";
import "@angular/core";
import { NG_VALUE_ACCESSOR as Ii } from "@angular/forms";
import * as v from "@angular/core";
var Ft = (() => { class i extends R {
    constructor(t, n) { super(t, n); }
    writeValue(t) { this.elementRef.nativeElement.checked = this.lastValue = t, No(this.elementRef); }
    _handleIonChange(t) { this.handleValueChange(t, t.checked); }
    static \u0275fac = function (n) { return new (n || i)(v.\u0275\u0275directiveInject(v.Injector), v.\u0275\u0275directiveInject(v.ElementRef)); };
    static \u0275dir = v.\u0275\u0275defineDirective({ type: i, selectors: [["ion-checkbox"], ["ion-toggle"]], hostBindings: function (n, c) { n & 1 && v.\u0275\u0275listener("ionChange", function (m) { return c._handleIonChange(m.target); }); }, standalone: !1, features: [v.\u0275\u0275ProvidersFeature([{ provide: Ii, useExisting: i, multi: !0 }]), v.\u0275\u0275InheritDefinitionFeature] });
} return i; })();
import "@angular/core";
import { NG_VALUE_ACCESSOR as Ci } from "@angular/forms";
import * as I from "@angular/core";
var Bt = (() => { class i extends R {
    el;
    constructor(t, n) { super(t, n), this.el = n; }
    handleInputEvent(t) { this.handleValueChange(t, t.value); }
    registerOnChange(t) { this.el.nativeElement.tagName === "ION-INPUT" || this.el.nativeElement.tagName === "ION-INPUT-OTP" ? super.registerOnChange(n => { t(n === "" ? null : parseFloat(n)); }) : super.registerOnChange(t); }
    static \u0275fac = function (n) { return new (n || i)(I.\u0275\u0275directiveInject(I.Injector), I.\u0275\u0275directiveInject(I.ElementRef)); };
    static \u0275dir = I.\u0275\u0275defineDirective({ type: i, selectors: [["ion-input", "type", "number"], ["ion-input-otp", 3, "type", "text"], ["ion-range"]], hostBindings: function (n, c) { n & 1 && I.\u0275\u0275listener("ionInput", function (m) { return c.handleInputEvent(m.target); }); }, standalone: !1, features: [I.\u0275\u0275ProvidersFeature([{ provide: Ci, useExisting: i, multi: !0 }]), I.\u0275\u0275InheritDefinitionFeature] });
} return i; })();
import "@angular/core";
import { NG_VALUE_ACCESSOR as bi } from "@angular/forms";
import * as C from "@angular/core";
var Pt = (() => { class i extends R {
    constructor(t, n) { super(t, n); }
    _handleChangeEvent(t) { this.handleValueChange(t, t.value); }
    static \u0275fac = function (n) { return new (n || i)(C.\u0275\u0275directiveInject(C.Injector), C.\u0275\u0275directiveInject(C.ElementRef)); };
    static \u0275dir = C.\u0275\u0275defineDirective({ type: i, selectors: [["ion-select"], ["ion-radio-group"], ["ion-segment"], ["ion-datetime"]], hostBindings: function (n, c) { n & 1 && C.\u0275\u0275listener("ionChange", function (m) { return c._handleChangeEvent(m.target); }); }, standalone: !1, features: [C.\u0275\u0275ProvidersFeature([{ provide: bi, useExisting: i, multi: !0 }]), C.\u0275\u0275InheritDefinitionFeature] });
} return i; })();
import "@angular/core";
import { NG_VALUE_ACCESSOR as yi } from "@angular/forms";
import * as b from "@angular/core";
var Ot = (() => { class i extends R {
    constructor(t, n) { super(t, n); }
    _handleInputEvent(t) { this.handleValueChange(t, t.value); }
    static \u0275fac = function (n) { return new (n || i)(b.\u0275\u0275directiveInject(b.Injector), b.\u0275\u0275directiveInject(b.ElementRef)); };
    static \u0275dir = b.\u0275\u0275defineDirective({ type: i, selectors: [["ion-input", 3, "type", "number"], ["ion-input-otp", "type", "text"], ["ion-textarea"], ["ion-searchbar"]], hostBindings: function (n, c) { n & 1 && b.\u0275\u0275listener("ionInput", function (m) { return c._handleInputEvent(m.target); }); }, standalone: !1, features: [b.\u0275\u0275ProvidersFeature([{ provide: yi, useExisting: i, multi: !0 }]), b.\u0275\u0275InheritDefinitionFeature] });
} return i; })();
import "@angular/core";
import { __decorate as a } from "tslib";
import "@angular/core";
import { fromEvent as Di } from "rxjs";
var xi = (i, o) => { let t = i.prototype; o.forEach(n => { Object.defineProperty(t, n, { get() { return this.el[n]; }, set(c) { this.z.runOutsideAngular(() => this.el[n] = c); }, configurable: !0 }); }); }, ji = (i, o) => { let t = i.prototype; o.forEach(n => { t[n] = function () { let c = arguments; return this.z.runOutsideAngular(() => this.el[n].apply(this.el, c)); }; }); }, p = (i, o, t) => { t.forEach(n => i[n] = Di(o, n)); };
function r(i) { return function (t) { let { defineCustomElementFn: n, inputs: c, methods: d } = i; return n !== void 0 && n(), c && xi(t, c), d && ji(t, d), t; }; }
import * as e from "@angular/core";
var s = ["*"], _ = class Nt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Nt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Nt, selectors: [["ion-accordion"]], inputs: { disabled: "disabled", mode: "mode", readonly: "readonly", toggleIcon: "toggleIcon", toggleIconSlot: "toggleIconSlot", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
_ = a([r({ inputs: ["disabled", "mode", "readonly", "toggleIcon", "toggleIconSlot", "value"] })], _);
var Z = class Lt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange"]); }
    static \u0275fac = function (t) { return new (t || Lt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Lt, selectors: [["ion-accordion-group"]], inputs: { animated: "animated", disabled: "disabled", expand: "expand", mode: "mode", multiple: "multiple", readonly: "readonly", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Z = a([r({ inputs: ["animated", "disabled", "expand", "mode", "multiple", "readonly", "value"] })], Z);
var G = class Vt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionActionSheetDidPresent", "ionActionSheetWillPresent", "ionActionSheetWillDismiss", "ionActionSheetDidDismiss", "didPresent", "willPresent", "willDismiss", "didDismiss"]); }
    static \u0275fac = function (t) { return new (t || Vt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Vt, selectors: [["ion-action-sheet"]], inputs: { animated: "animated", backdropDismiss: "backdropDismiss", buttons: "buttons", cssClass: "cssClass", enterAnimation: "enterAnimation", header: "header", htmlAttributes: "htmlAttributes", isOpen: "isOpen", keyboardClose: "keyboardClose", leaveAnimation: "leaveAnimation", mode: "mode", subHeader: "subHeader", translucent: "translucent", trigger: "trigger" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
G = a([r({ inputs: ["animated", "backdropDismiss", "buttons", "cssClass", "enterAnimation", "header", "htmlAttributes", "isOpen", "keyboardClose", "leaveAnimation", "mode", "subHeader", "translucent", "trigger"], methods: ["present", "dismiss", "onDidDismiss", "onWillDismiss"] })], G);
var H = class _t {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionAlertDidPresent", "ionAlertWillPresent", "ionAlertWillDismiss", "ionAlertDidDismiss", "didPresent", "willPresent", "willDismiss", "didDismiss"]); }
    static \u0275fac = function (t) { return new (t || _t)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: _t, selectors: [["ion-alert"]], inputs: { animated: "animated", backdropDismiss: "backdropDismiss", buttons: "buttons", cssClass: "cssClass", enterAnimation: "enterAnimation", header: "header", htmlAttributes: "htmlAttributes", inputs: "inputs", isOpen: "isOpen", keyboardClose: "keyboardClose", leaveAnimation: "leaveAnimation", message: "message", mode: "mode", subHeader: "subHeader", translucent: "translucent", trigger: "trigger" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
H = a([r({ inputs: ["animated", "backdropDismiss", "buttons", "cssClass", "enterAnimation", "header", "htmlAttributes", "inputs", "isOpen", "keyboardClose", "leaveAnimation", "message", "mode", "subHeader", "translucent", "trigger"], methods: ["present", "dismiss", "onDidDismiss", "onWillDismiss"] })], H);
var W = class Zt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Zt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Zt, selectors: [["ion-app"]], standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
W = a([r({ methods: ["setFocus"] })], W);
var X = class Gt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Gt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Gt, selectors: [["ion-avatar"]], standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
X = a([r({})], X);
var q = class Ht {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionBackdropTap"]); }
    static \u0275fac = function (t) { return new (t || Ht)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Ht, selectors: [["ion-backdrop"]], inputs: { stopPropagation: "stopPropagation", tappable: "tappable", visible: "visible" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
q = a([r({ inputs: ["stopPropagation", "tappable", "visible"] })], q);
var K = class Wt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Wt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Wt, selectors: [["ion-badge"]], inputs: { color: "color", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
K = a([r({ inputs: ["color", "mode"] })], K);
var Q = class Xt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionFocus", "ionBlur"]); }
    static \u0275fac = function (t) { return new (t || Xt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Xt, selectors: [["ion-breadcrumb"]], inputs: { active: "active", color: "color", disabled: "disabled", download: "download", href: "href", mode: "mode", rel: "rel", routerAnimation: "routerAnimation", routerDirection: "routerDirection", separator: "separator", target: "target" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Q = a([r({ inputs: ["active", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "separator", "target"] })], Q);
var U = class qt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionCollapsedClick"]); }
    static \u0275fac = function (t) { return new (t || qt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: qt, selectors: [["ion-breadcrumbs"]], inputs: { color: "color", itemsAfterCollapse: "itemsAfterCollapse", itemsBeforeCollapse: "itemsBeforeCollapse", maxItems: "maxItems", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
U = a([r({ inputs: ["color", "itemsAfterCollapse", "itemsBeforeCollapse", "maxItems", "mode"] })], U);
var Y = class Kt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionFocus", "ionBlur"]); }
    static \u0275fac = function (t) { return new (t || Kt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Kt, selectors: [["ion-button"]], inputs: { buttonType: "buttonType", color: "color", disabled: "disabled", download: "download", expand: "expand", fill: "fill", form: "form", href: "href", mode: "mode", rel: "rel", routerAnimation: "routerAnimation", routerDirection: "routerDirection", shape: "shape", size: "size", strong: "strong", target: "target", type: "type" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Y = a([r({ inputs: ["buttonType", "color", "disabled", "download", "expand", "fill", "form", "href", "mode", "rel", "routerAnimation", "routerDirection", "shape", "size", "strong", "target", "type"] })], Y);
var J = class Qt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Qt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Qt, selectors: [["ion-buttons"]], inputs: { collapse: "collapse" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
J = a([r({ inputs: ["collapse"] })], J);
var $ = class Ut {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Ut)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Ut, selectors: [["ion-card"]], inputs: { button: "button", color: "color", disabled: "disabled", download: "download", href: "href", mode: "mode", rel: "rel", routerAnimation: "routerAnimation", routerDirection: "routerDirection", target: "target", type: "type" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
$ = a([r({ inputs: ["button", "color", "disabled", "download", "href", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] })], $);
var ee = class Yt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Yt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Yt, selectors: [["ion-card-content"]], inputs: { mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ee = a([r({ inputs: ["mode"] })], ee);
var te = class Jt {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Jt)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Jt, selectors: [["ion-card-header"]], inputs: { color: "color", mode: "mode", translucent: "translucent" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
te = a([r({ inputs: ["color", "mode", "translucent"] })], te);
var ne = class $t {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || $t)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: $t, selectors: [["ion-card-subtitle"]], inputs: { color: "color", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ne = a([r({ inputs: ["color", "mode"] })], ne);
var oe = class en {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || en)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: en, selectors: [["ion-card-title"]], inputs: { color: "color", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
oe = a([r({ inputs: ["color", "mode"] })], oe);
var ie = class tn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange", "ionFocus", "ionBlur"]); }
    static \u0275fac = function (t) { return new (t || tn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: tn, selectors: [["ion-checkbox"]], inputs: { alignment: "alignment", checked: "checked", color: "color", disabled: "disabled", errorText: "errorText", helperText: "helperText", indeterminate: "indeterminate", justify: "justify", labelPlacement: "labelPlacement", mode: "mode", name: "name", required: "required", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ie = a([r({ inputs: ["alignment", "checked", "color", "disabled", "errorText", "helperText", "indeterminate", "justify", "labelPlacement", "mode", "name", "required", "value"] })], ie);
var re = class nn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || nn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: nn, selectors: [["ion-chip"]], inputs: { color: "color", disabled: "disabled", mode: "mode", outline: "outline" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
re = a([r({ inputs: ["color", "disabled", "mode", "outline"] })], re);
var ae = class on {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || on)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: on, selectors: [["ion-col"]], inputs: { offset: "offset", offsetLg: "offsetLg", offsetMd: "offsetMd", offsetSm: "offsetSm", offsetXl: "offsetXl", offsetXs: "offsetXs", pull: "pull", pullLg: "pullLg", pullMd: "pullMd", pullSm: "pullSm", pullXl: "pullXl", pullXs: "pullXs", push: "push", pushLg: "pushLg", pushMd: "pushMd", pushSm: "pushSm", pushXl: "pushXl", pushXs: "pushXs", size: "size", sizeLg: "sizeLg", sizeMd: "sizeMd", sizeSm: "sizeSm", sizeXl: "sizeXl", sizeXs: "sizeXs" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ae = a([r({ inputs: ["offset", "offsetLg", "offsetMd", "offsetSm", "offsetXl", "offsetXs", "pull", "pullLg", "pullMd", "pullSm", "pullXl", "pullXs", "push", "pushLg", "pushMd", "pushSm", "pushXl", "pushXs", "size", "sizeLg", "sizeMd", "sizeSm", "sizeXl", "sizeXs"] })], ae);
var se = class rn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionScrollStart", "ionScroll", "ionScrollEnd"]); }
    static \u0275fac = function (t) { return new (t || rn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: rn, selectors: [["ion-content"]], inputs: { color: "color", fixedSlotPlacement: "fixedSlotPlacement", forceOverscroll: "forceOverscroll", fullscreen: "fullscreen", scrollEvents: "scrollEvents", scrollX: "scrollX", scrollY: "scrollY" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
se = a([r({ inputs: ["color", "fixedSlotPlacement", "forceOverscroll", "fullscreen", "scrollEvents", "scrollX", "scrollY"], methods: ["getScrollElement", "scrollToTop", "scrollToBottom", "scrollByPoint", "scrollToPoint"] })], se);
var ce = class an {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionCancel", "ionChange", "ionFocus", "ionBlur"]); }
    static \u0275fac = function (t) { return new (t || an)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: an, selectors: [["ion-datetime"]], inputs: { cancelText: "cancelText", clearText: "clearText", color: "color", dayValues: "dayValues", disabled: "disabled", doneText: "doneText", firstDayOfWeek: "firstDayOfWeek", formatOptions: "formatOptions", highlightedDates: "highlightedDates", hourCycle: "hourCycle", hourValues: "hourValues", isDateEnabled: "isDateEnabled", locale: "locale", max: "max", min: "min", minuteValues: "minuteValues", mode: "mode", monthValues: "monthValues", multiple: "multiple", name: "name", preferWheel: "preferWheel", presentation: "presentation", readonly: "readonly", showAdjacentDays: "showAdjacentDays", showClearButton: "showClearButton", showDefaultButtons: "showDefaultButtons", showDefaultTimeLabel: "showDefaultTimeLabel", showDefaultTitle: "showDefaultTitle", size: "size", titleSelectedDatesFormatter: "titleSelectedDatesFormatter", value: "value", yearValues: "yearValues" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ce = a([r({ inputs: ["cancelText", "clearText", "color", "dayValues", "disabled", "doneText", "firstDayOfWeek", "formatOptions", "highlightedDates", "hourCycle", "hourValues", "isDateEnabled", "locale", "max", "min", "minuteValues", "mode", "monthValues", "multiple", "name", "preferWheel", "presentation", "readonly", "showAdjacentDays", "showClearButton", "showDefaultButtons", "showDefaultTimeLabel", "showDefaultTitle", "size", "titleSelectedDatesFormatter", "value", "yearValues"], methods: ["confirm", "reset", "cancel"] })], ce);
var le = class sn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || sn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: sn, selectors: [["ion-datetime-button"]], inputs: { color: "color", datetime: "datetime", disabled: "disabled", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
le = a([r({ inputs: ["color", "datetime", "disabled", "mode"] })], le);
var de = class cn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || cn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: cn, selectors: [["ion-fab"]], inputs: { activated: "activated", edge: "edge", horizontal: "horizontal", vertical: "vertical" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
de = a([r({ inputs: ["activated", "edge", "horizontal", "vertical"], methods: ["close"] })], de);
var pe = class ln {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionFocus", "ionBlur"]); }
    static \u0275fac = function (t) { return new (t || ln)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: ln, selectors: [["ion-fab-button"]], inputs: { activated: "activated", closeIcon: "closeIcon", color: "color", disabled: "disabled", download: "download", form: "form", href: "href", mode: "mode", rel: "rel", routerAnimation: "routerAnimation", routerDirection: "routerDirection", show: "show", size: "size", target: "target", translucent: "translucent", type: "type" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
pe = a([r({ inputs: ["activated", "closeIcon", "color", "disabled", "download", "form", "href", "mode", "rel", "routerAnimation", "routerDirection", "show", "size", "target", "translucent", "type"] })], pe);
var ue = class dn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || dn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: dn, selectors: [["ion-fab-list"]], inputs: { activated: "activated", side: "side" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ue = a([r({ inputs: ["activated", "side"] })], ue);
var me = class pn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || pn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: pn, selectors: [["ion-footer"]], inputs: { collapse: "collapse", mode: "mode", translucent: "translucent" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
me = a([r({ inputs: ["collapse", "mode", "translucent"] })], me);
var fe = class un {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || un)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: un, selectors: [["ion-grid"]], inputs: { fixed: "fixed" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
fe = a([r({ inputs: ["fixed"] })], fe);
var ge = class mn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || mn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: mn, selectors: [["ion-header"]], inputs: { collapse: "collapse", mode: "mode", translucent: "translucent" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ge = a([r({ inputs: ["collapse", "mode", "translucent"] })], ge);
var he = class fn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || fn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: fn, selectors: [["ion-icon"]], inputs: { color: "color", flipRtl: "flipRtl", icon: "icon", ios: "ios", lazy: "lazy", md: "md", mode: "mode", name: "name", sanitize: "sanitize", size: "size", src: "src" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
he = a([r({ inputs: ["color", "flipRtl", "icon", "ios", "lazy", "md", "mode", "name", "sanitize", "size", "src"] })], he);
var ve = class gn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionImgWillLoad", "ionImgDidLoad", "ionError"]); }
    static \u0275fac = function (t) { return new (t || gn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: gn, selectors: [["ion-img"]], inputs: { alt: "alt", src: "src" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ve = a([r({ inputs: ["alt", "src"] })], ve);
var Ie = class hn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionInfinite"]); }
    static \u0275fac = function (t) { return new (t || hn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: hn, selectors: [["ion-infinite-scroll"]], inputs: { disabled: "disabled", position: "position", threshold: "threshold" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ie = a([r({ inputs: ["disabled", "position", "threshold"], methods: ["complete"] })], Ie);
var Ce = class vn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || vn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: vn, selectors: [["ion-infinite-scroll-content"]], inputs: { loadingSpinner: "loadingSpinner", loadingText: "loadingText" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ce = a([r({ inputs: ["loadingSpinner", "loadingText"] })], Ce);
var be = class In {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionInput", "ionChange", "ionBlur", "ionFocus"]); }
    static \u0275fac = function (t) { return new (t || In)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: In, selectors: [["ion-input"]], inputs: { autocapitalize: "autocapitalize", autocomplete: "autocomplete", autocorrect: "autocorrect", autofocus: "autofocus", clearInput: "clearInput", clearInputIcon: "clearInputIcon", clearOnEdit: "clearOnEdit", color: "color", counter: "counter", counterFormatter: "counterFormatter", debounce: "debounce", disabled: "disabled", enterkeyhint: "enterkeyhint", errorText: "errorText", fill: "fill", helperText: "helperText", inputmode: "inputmode", label: "label", labelPlacement: "labelPlacement", max: "max", maxlength: "maxlength", min: "min", minlength: "minlength", mode: "mode", multiple: "multiple", name: "name", pattern: "pattern", placeholder: "placeholder", readonly: "readonly", required: "required", shape: "shape", spellcheck: "spellcheck", step: "step", type: "type", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
be = a([r({ inputs: ["autocapitalize", "autocomplete", "autocorrect", "autofocus", "clearInput", "clearInputIcon", "clearOnEdit", "color", "counter", "counterFormatter", "debounce", "disabled", "enterkeyhint", "errorText", "fill", "helperText", "inputmode", "label", "labelPlacement", "max", "maxlength", "min", "minlength", "mode", "multiple", "name", "pattern", "placeholder", "readonly", "required", "shape", "spellcheck", "step", "type", "value"], methods: ["setFocus", "getInputElement"] })], be);
var ye = class Cn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionInput", "ionChange", "ionComplete", "ionBlur", "ionFocus"]); }
    static \u0275fac = function (t) { return new (t || Cn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Cn, selectors: [["ion-input-otp"]], inputs: { autocapitalize: "autocapitalize", color: "color", disabled: "disabled", fill: "fill", inputmode: "inputmode", length: "length", pattern: "pattern", readonly: "readonly", separators: "separators", shape: "shape", size: "size", type: "type", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ye = a([r({ inputs: ["autocapitalize", "color", "disabled", "fill", "inputmode", "length", "pattern", "readonly", "separators", "shape", "size", "type", "value"], methods: ["setFocus"] })], ye);
var De = class bn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || bn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: bn, selectors: [["ion-input-password-toggle"]], inputs: { color: "color", hideIcon: "hideIcon", mode: "mode", showIcon: "showIcon" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
De = a([r({ inputs: ["color", "hideIcon", "mode", "showIcon"] })], De);
var xe = class yn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || yn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: yn, selectors: [["ion-item"]], inputs: { button: "button", color: "color", detail: "detail", detailIcon: "detailIcon", disabled: "disabled", download: "download", href: "href", lines: "lines", mode: "mode", rel: "rel", routerAnimation: "routerAnimation", routerDirection: "routerDirection", target: "target", type: "type" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
xe = a([r({ inputs: ["button", "color", "detail", "detailIcon", "disabled", "download", "href", "lines", "mode", "rel", "routerAnimation", "routerDirection", "target", "type"] })], xe);
var je = class Dn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Dn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Dn, selectors: [["ion-item-divider"]], inputs: { color: "color", mode: "mode", sticky: "sticky" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
je = a([r({ inputs: ["color", "mode", "sticky"] })], je);
var Te = class xn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || xn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: xn, selectors: [["ion-item-group"]], standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Te = a([r({})], Te);
var we = class jn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || jn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: jn, selectors: [["ion-item-option"]], inputs: { color: "color", disabled: "disabled", download: "download", expandable: "expandable", href: "href", mode: "mode", rel: "rel", target: "target", type: "type" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
we = a([r({ inputs: ["color", "disabled", "download", "expandable", "href", "mode", "rel", "target", "type"] })], we);
var Se = class Tn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionSwipe"]); }
    static \u0275fac = function (t) { return new (t || Tn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Tn, selectors: [["ion-item-options"]], inputs: { side: "side" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Se = a([r({ inputs: ["side"] })], Se);
var Me = class wn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionDrag"]); }
    static \u0275fac = function (t) { return new (t || wn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: wn, selectors: [["ion-item-sliding"]], inputs: { disabled: "disabled" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Me = a([r({ inputs: ["disabled"], methods: ["getOpenAmount", "getSlidingRatio", "open", "close", "closeOpened"] })], Me);
var Re = class Sn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Sn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Sn, selectors: [["ion-label"]], inputs: { color: "color", mode: "mode", position: "position" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Re = a([r({ inputs: ["color", "mode", "position"] })], Re);
var Ee = class Mn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Mn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Mn, selectors: [["ion-list"]], inputs: { inset: "inset", lines: "lines", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ee = a([r({ inputs: ["inset", "lines", "mode"], methods: ["closeSlidingItems"] })], Ee);
var ke = class Rn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Rn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Rn, selectors: [["ion-list-header"]], inputs: { color: "color", lines: "lines", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ke = a([r({ inputs: ["color", "lines", "mode"] })], ke);
var ze = class En {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionLoadingDidPresent", "ionLoadingWillPresent", "ionLoadingWillDismiss", "ionLoadingDidDismiss", "didPresent", "willPresent", "willDismiss", "didDismiss"]); }
    static \u0275fac = function (t) { return new (t || En)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: En, selectors: [["ion-loading"]], inputs: { animated: "animated", backdropDismiss: "backdropDismiss", cssClass: "cssClass", duration: "duration", enterAnimation: "enterAnimation", htmlAttributes: "htmlAttributes", isOpen: "isOpen", keyboardClose: "keyboardClose", leaveAnimation: "leaveAnimation", message: "message", mode: "mode", showBackdrop: "showBackdrop", spinner: "spinner", translucent: "translucent", trigger: "trigger" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ze = a([r({ inputs: ["animated", "backdropDismiss", "cssClass", "duration", "enterAnimation", "htmlAttributes", "isOpen", "keyboardClose", "leaveAnimation", "message", "mode", "showBackdrop", "spinner", "translucent", "trigger"], methods: ["present", "dismiss", "onDidDismiss", "onWillDismiss"] })], ze);
var Ae = class kn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionWillOpen", "ionWillClose", "ionDidOpen", "ionDidClose"]); }
    static \u0275fac = function (t) { return new (t || kn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: kn, selectors: [["ion-menu"]], inputs: { contentId: "contentId", disabled: "disabled", maxEdgeStart: "maxEdgeStart", menuId: "menuId", side: "side", swipeGesture: "swipeGesture", type: "type" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ae = a([r({ inputs: ["contentId", "disabled", "maxEdgeStart", "menuId", "side", "swipeGesture", "type"], methods: ["isOpen", "isActive", "open", "close", "toggle", "setOpen"] })], Ae);
var Fe = class zn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || zn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: zn, selectors: [["ion-menu-button"]], inputs: { autoHide: "autoHide", color: "color", disabled: "disabled", menu: "menu", mode: "mode", type: "type" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Fe = a([r({ inputs: ["autoHide", "color", "disabled", "menu", "mode", "type"] })], Fe);
var Be = class An {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || An)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: An, selectors: [["ion-menu-toggle"]], inputs: { autoHide: "autoHide", menu: "menu" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Be = a([r({ inputs: ["autoHide", "menu"] })], Be);
var Pe = class Fn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Fn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Fn, selectors: [["ion-nav-link"]], inputs: { component: "component", componentProps: "componentProps", routerAnimation: "routerAnimation", routerDirection: "routerDirection" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Pe = a([r({ inputs: ["component", "componentProps", "routerAnimation", "routerDirection"] })], Pe);
var Oe = class Bn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Bn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Bn, selectors: [["ion-note"]], inputs: { color: "color", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Oe = a([r({ inputs: ["color", "mode"] })], Oe);
var Ne = class Pn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Pn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Pn, selectors: [["ion-picker"]], inputs: { mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ne = a([r({ inputs: ["mode"] })], Ne);
var Le = class On {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange"]); }
    static \u0275fac = function (t) { return new (t || On)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: On, selectors: [["ion-picker-column"]], inputs: { color: "color", disabled: "disabled", mode: "mode", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Le = a([r({ inputs: ["color", "disabled", "mode", "value"], methods: ["setFocus"] })], Le);
var Ve = class Nn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Nn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Nn, selectors: [["ion-picker-column-option"]], inputs: { color: "color", disabled: "disabled", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ve = a([r({ inputs: ["color", "disabled", "value"] })], Ve);
var _e = class Ln {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionPickerDidPresent", "ionPickerWillPresent", "ionPickerWillDismiss", "ionPickerDidDismiss", "didPresent", "willPresent", "willDismiss", "didDismiss"]); }
    static \u0275fac = function (t) { return new (t || Ln)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Ln, selectors: [["ion-picker-legacy"]], inputs: { animated: "animated", backdropDismiss: "backdropDismiss", buttons: "buttons", columns: "columns", cssClass: "cssClass", duration: "duration", enterAnimation: "enterAnimation", htmlAttributes: "htmlAttributes", isOpen: "isOpen", keyboardClose: "keyboardClose", leaveAnimation: "leaveAnimation", mode: "mode", showBackdrop: "showBackdrop", trigger: "trigger" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
_e = a([r({ inputs: ["animated", "backdropDismiss", "buttons", "columns", "cssClass", "duration", "enterAnimation", "htmlAttributes", "isOpen", "keyboardClose", "leaveAnimation", "mode", "showBackdrop", "trigger"], methods: ["present", "dismiss", "onDidDismiss", "onWillDismiss", "getColumn"] })], _e);
var Ze = class Vn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Vn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Vn, selectors: [["ion-progress-bar"]], inputs: { buffer: "buffer", color: "color", mode: "mode", reversed: "reversed", type: "type", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ze = a([r({ inputs: ["buffer", "color", "mode", "reversed", "type", "value"] })], Ze);
var Ge = class _n {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionFocus", "ionBlur"]); }
    static \u0275fac = function (t) { return new (t || _n)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: _n, selectors: [["ion-radio"]], inputs: { alignment: "alignment", color: "color", disabled: "disabled", justify: "justify", labelPlacement: "labelPlacement", mode: "mode", name: "name", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ge = a([r({ inputs: ["alignment", "color", "disabled", "justify", "labelPlacement", "mode", "name", "value"] })], Ge);
var He = class Zn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange"]); }
    static \u0275fac = function (t) { return new (t || Zn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Zn, selectors: [["ion-radio-group"]], inputs: { allowEmptySelection: "allowEmptySelection", compareWith: "compareWith", errorText: "errorText", helperText: "helperText", name: "name", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
He = a([r({ inputs: ["allowEmptySelection", "compareWith", "errorText", "helperText", "name", "value"] })], He);
var We = class Gn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange", "ionInput", "ionFocus", "ionBlur", "ionKnobMoveStart", "ionKnobMoveEnd"]); }
    static \u0275fac = function (t) { return new (t || Gn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Gn, selectors: [["ion-range"]], inputs: { activeBarStart: "activeBarStart", color: "color", debounce: "debounce", disabled: "disabled", dualKnobs: "dualKnobs", label: "label", labelPlacement: "labelPlacement", max: "max", min: "min", mode: "mode", name: "name", pin: "pin", pinFormatter: "pinFormatter", snaps: "snaps", step: "step", ticks: "ticks", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
We = a([r({ inputs: ["activeBarStart", "color", "debounce", "disabled", "dualKnobs", "label", "labelPlacement", "max", "min", "mode", "name", "pin", "pinFormatter", "snaps", "step", "ticks", "value"] })], We);
var Xe = class Hn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionRefresh", "ionPull", "ionStart", "ionPullStart", "ionPullEnd"]); }
    static \u0275fac = function (t) { return new (t || Hn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Hn, selectors: [["ion-refresher"]], inputs: { closeDuration: "closeDuration", disabled: "disabled", mode: "mode", pullFactor: "pullFactor", pullMax: "pullMax", pullMin: "pullMin", snapbackDuration: "snapbackDuration" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Xe = a([r({ inputs: ["closeDuration", "disabled", "mode", "pullFactor", "pullMax", "pullMin", "snapbackDuration"], methods: ["complete", "cancel", "getProgress"] })], Xe);
var qe = class Wn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Wn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Wn, selectors: [["ion-refresher-content"]], inputs: { pullingIcon: "pullingIcon", pullingText: "pullingText", refreshingSpinner: "refreshingSpinner", refreshingText: "refreshingText" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
qe = a([r({ inputs: ["pullingIcon", "pullingText", "refreshingSpinner", "refreshingText"] })], qe);
var Ke = class Xn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Xn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Xn, selectors: [["ion-reorder"]], standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ke = a([r({})], Ke);
var Qe = class qn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionItemReorder", "ionReorderStart", "ionReorderMove", "ionReorderEnd"]); }
    static \u0275fac = function (t) { return new (t || qn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: qn, selectors: [["ion-reorder-group"]], inputs: { disabled: "disabled" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Qe = a([r({ inputs: ["disabled"], methods: ["complete"] })], Qe);
var Ue = class Kn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Kn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Kn, selectors: [["ion-ripple-effect"]], inputs: { type: "type" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ue = a([r({ inputs: ["type"], methods: ["addRipple"] })], Ue);
var Ye = class Qn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Qn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Qn, selectors: [["ion-row"]], standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Ye = a([r({})], Ye);
var Je = class Un {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionInput", "ionChange", "ionCancel", "ionClear", "ionBlur", "ionFocus"]); }
    static \u0275fac = function (t) { return new (t || Un)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Un, selectors: [["ion-searchbar"]], inputs: { animated: "animated", autocapitalize: "autocapitalize", autocomplete: "autocomplete", autocorrect: "autocorrect", cancelButtonIcon: "cancelButtonIcon", cancelButtonText: "cancelButtonText", clearIcon: "clearIcon", color: "color", debounce: "debounce", disabled: "disabled", enterkeyhint: "enterkeyhint", inputmode: "inputmode", maxlength: "maxlength", minlength: "minlength", mode: "mode", name: "name", placeholder: "placeholder", searchIcon: "searchIcon", showCancelButton: "showCancelButton", showClearButton: "showClearButton", spellcheck: "spellcheck", type: "type", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
Je = a([r({ inputs: ["animated", "autocapitalize", "autocomplete", "autocorrect", "cancelButtonIcon", "cancelButtonText", "clearIcon", "color", "debounce", "disabled", "enterkeyhint", "inputmode", "maxlength", "minlength", "mode", "name", "placeholder", "searchIcon", "showCancelButton", "showClearButton", "spellcheck", "type", "value"], methods: ["setFocus", "getInputElement"] })], Je);
var $e = class Yn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange"]); }
    static \u0275fac = function (t) { return new (t || Yn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Yn, selectors: [["ion-segment"]], inputs: { color: "color", disabled: "disabled", mode: "mode", scrollable: "scrollable", selectOnFocus: "selectOnFocus", swipeGesture: "swipeGesture", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
$e = a([r({ inputs: ["color", "disabled", "mode", "scrollable", "selectOnFocus", "swipeGesture", "value"] })], $e);
var et = class Jn {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || Jn)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: Jn, selectors: [["ion-segment-button"]], inputs: { contentId: "contentId", disabled: "disabled", layout: "layout", mode: "mode", type: "type", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
et = a([r({ inputs: ["contentId", "disabled", "layout", "mode", "type", "value"] })], et);
var tt = class $n {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || $n)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: $n, selectors: [["ion-segment-content"]], standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
tt = a([r({})], tt);
var nt = class eo {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionSegmentViewScroll"]); }
    static \u0275fac = function (t) { return new (t || eo)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: eo, selectors: [["ion-segment-view"]], inputs: { disabled: "disabled", swipeGesture: "swipeGesture" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
nt = a([r({ inputs: ["disabled", "swipeGesture"] })], nt);
var ot = class to {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange", "ionCancel", "ionDismiss", "ionFocus", "ionBlur"]); }
    static \u0275fac = function (t) { return new (t || to)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: to, selectors: [["ion-select"]], inputs: { cancelText: "cancelText", color: "color", compareWith: "compareWith", disabled: "disabled", errorText: "errorText", expandedIcon: "expandedIcon", fill: "fill", helperText: "helperText", interface: "interface", interfaceOptions: "interfaceOptions", justify: "justify", label: "label", labelPlacement: "labelPlacement", mode: "mode", multiple: "multiple", name: "name", okText: "okText", placeholder: "placeholder", required: "required", selectedText: "selectedText", shape: "shape", toggleIcon: "toggleIcon", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ot = a([r({ inputs: ["cancelText", "color", "compareWith", "disabled", "errorText", "expandedIcon", "fill", "helperText", "interface", "interfaceOptions", "justify", "label", "labelPlacement", "mode", "multiple", "name", "okText", "placeholder", "required", "selectedText", "shape", "toggleIcon", "value"], methods: ["open"] })], ot);
var it = class no {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || no)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: no, selectors: [["ion-select-modal"]], inputs: { cancelText: "cancelText", header: "header", multiple: "multiple", options: "options" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
it = a([r({ inputs: ["cancelText", "header", "multiple", "options"] })], it);
var rt = class oo {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || oo)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: oo, selectors: [["ion-select-option"]], inputs: { disabled: "disabled", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
rt = a([r({ inputs: ["disabled", "value"] })], rt);
var at = class io {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || io)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: io, selectors: [["ion-skeleton-text"]], inputs: { animated: "animated" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
at = a([r({ inputs: ["animated"] })], at);
var st = class ro {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || ro)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: ro, selectors: [["ion-spinner"]], inputs: { color: "color", duration: "duration", name: "name", paused: "paused" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
st = a([r({ inputs: ["color", "duration", "name", "paused"] })], st);
var ct = class ao {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionSplitPaneVisible"]); }
    static \u0275fac = function (t) { return new (t || ao)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: ao, selectors: [["ion-split-pane"]], inputs: { contentId: "contentId", disabled: "disabled", when: "when" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ct = a([r({ inputs: ["contentId", "disabled", "when"] })], ct);
var A = class so {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || so)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: so, selectors: [["ion-tab"]], inputs: { component: "component", tab: "tab" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
A = a([r({ inputs: ["component", "tab"], methods: ["setActive"] })], A);
var E = class co {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || co)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: co, selectors: [["ion-tab-bar"]], inputs: { color: "color", mode: "mode", selectedTab: "selectedTab", translucent: "translucent" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
E = a([r({ inputs: ["color", "mode", "selectedTab", "translucent"] })], E);
var lt = class lo {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || lo)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: lo, selectors: [["ion-tab-button"]], inputs: { disabled: "disabled", download: "download", href: "href", layout: "layout", mode: "mode", rel: "rel", selected: "selected", tab: "tab", target: "target" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
lt = a([r({ inputs: ["disabled", "download", "href", "layout", "mode", "rel", "selected", "tab", "target"] })], lt);
var dt = class po {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || po)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: po, selectors: [["ion-text"]], inputs: { color: "color", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
dt = a([r({ inputs: ["color", "mode"] })], dt);
var pt = class uo {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange", "ionInput", "ionBlur", "ionFocus"]); }
    static \u0275fac = function (t) { return new (t || uo)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: uo, selectors: [["ion-textarea"]], inputs: { autoGrow: "autoGrow", autocapitalize: "autocapitalize", autofocus: "autofocus", clearOnEdit: "clearOnEdit", color: "color", cols: "cols", counter: "counter", counterFormatter: "counterFormatter", debounce: "debounce", disabled: "disabled", enterkeyhint: "enterkeyhint", errorText: "errorText", fill: "fill", helperText: "helperText", inputmode: "inputmode", label: "label", labelPlacement: "labelPlacement", maxlength: "maxlength", minlength: "minlength", mode: "mode", name: "name", placeholder: "placeholder", readonly: "readonly", required: "required", rows: "rows", shape: "shape", spellcheck: "spellcheck", value: "value", wrap: "wrap" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
pt = a([r({ inputs: ["autoGrow", "autocapitalize", "autofocus", "clearOnEdit", "color", "cols", "counter", "counterFormatter", "debounce", "disabled", "enterkeyhint", "errorText", "fill", "helperText", "inputmode", "label", "labelPlacement", "maxlength", "minlength", "mode", "name", "placeholder", "readonly", "required", "rows", "shape", "spellcheck", "value", "wrap"], methods: ["setFocus", "getInputElement"] })], pt);
var ut = class mo {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || mo)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: mo, selectors: [["ion-thumbnail"]], standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ut = a([r({})], ut);
var mt = class fo {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || fo)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: fo, selectors: [["ion-title"]], inputs: { color: "color", size: "size" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
mt = a([r({ inputs: ["color", "size"] })], mt);
var ft = class go {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionToastDidPresent", "ionToastWillPresent", "ionToastWillDismiss", "ionToastDidDismiss", "didPresent", "willPresent", "willDismiss", "didDismiss"]); }
    static \u0275fac = function (t) { return new (t || go)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: go, selectors: [["ion-toast"]], inputs: { animated: "animated", buttons: "buttons", color: "color", cssClass: "cssClass", duration: "duration", enterAnimation: "enterAnimation", header: "header", htmlAttributes: "htmlAttributes", icon: "icon", isOpen: "isOpen", keyboardClose: "keyboardClose", layout: "layout", leaveAnimation: "leaveAnimation", message: "message", mode: "mode", position: "position", positionAnchor: "positionAnchor", swipeGesture: "swipeGesture", translucent: "translucent", trigger: "trigger" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ft = a([r({ inputs: ["animated", "buttons", "color", "cssClass", "duration", "enterAnimation", "header", "htmlAttributes", "icon", "isOpen", "keyboardClose", "layout", "leaveAnimation", "message", "mode", "position", "positionAnchor", "swipeGesture", "translucent", "trigger"], methods: ["present", "dismiss", "onDidDismiss", "onWillDismiss"] })], ft);
var gt = class ho {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement, p(this, this.el, ["ionChange", "ionFocus", "ionBlur"]); }
    static \u0275fac = function (t) { return new (t || ho)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: ho, selectors: [["ion-toggle"]], inputs: { alignment: "alignment", checked: "checked", color: "color", disabled: "disabled", enableOnOffLabels: "enableOnOffLabels", errorText: "errorText", helperText: "helperText", justify: "justify", labelPlacement: "labelPlacement", mode: "mode", name: "name", required: "required", value: "value" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
gt = a([r({ inputs: ["alignment", "checked", "color", "disabled", "enableOnOffLabels", "errorText", "helperText", "justify", "labelPlacement", "mode", "name", "required", "value"] })], gt);
var ht = class vo {
    z;
    el;
    constructor(o, t, n) { this.z = n, o.detach(), this.el = t.nativeElement; }
    static \u0275fac = function (t) { return new (t || vo)(e.\u0275\u0275directiveInject(e.ChangeDetectorRef), e.\u0275\u0275directiveInject(e.ElementRef), e.\u0275\u0275directiveInject(e.NgZone)); };
    static \u0275cmp = e.\u0275\u0275defineComponent({ type: vo, selectors: [["ion-toolbar"]], inputs: { color: "color", mode: "mode" }, standalone: !1, ngContentSelectors: s, decls: 1, vars: 0, template: function (t, n) { t & 1 && (e.\u0275\u0275projectionDef(), e.\u0275\u0275projection(0)); }, encapsulation: 2 });
};
ht = a([r({ inputs: ["color", "mode"] })], ht);
import { ViewContainerRef as wi } from "@angular/core";
import * as u from "@angular/core";
import * as Jo from "@angular/common";
import * as vt from "@angular/router";
var Si = ["outletContent"], Mi = ["*"], S = (() => { class i extends Bo {
    parentOutlet;
    outletContent;
    constructor(t, n, c, d, m, T, B, Eo) { super(t, n, c, d, m, T, B, Eo), this.parentOutlet = Eo; }
    static \u0275fac = function (n) { return new (n || i)(u.\u0275\u0275injectAttribute("name"), u.\u0275\u0275injectAttribute("tabs"), u.\u0275\u0275directiveInject(Jo.Location), u.\u0275\u0275directiveInject(u.ElementRef), u.\u0275\u0275directiveInject(vt.Router), u.\u0275\u0275directiveInject(u.NgZone), u.\u0275\u0275directiveInject(vt.ActivatedRoute), u.\u0275\u0275directiveInject(i, 12)); };
    static \u0275cmp = u.\u0275\u0275defineComponent({ type: i, selectors: [["ion-router-outlet"]], viewQuery: function (n, c) { if (n & 1 && u.\u0275\u0275viewQuery(Si, 7, wi), n & 2) {
            let d;
            u.\u0275\u0275queryRefresh(d = u.\u0275\u0275loadQuery()) && (c.outletContent = d.first);
        } }, standalone: !1, features: [u.\u0275\u0275InheritDefinitionFeature], ngContentSelectors: Mi, decls: 3, vars: 0, consts: [["outletContent", ""]], template: function (n, c) { n & 1 && (u.\u0275\u0275projectionDef(), u.\u0275\u0275elementContainerStart(0, null, 0), u.\u0275\u0275projection(2), u.\u0275\u0275elementContainerEnd()); }, encapsulation: 2, changeDetection: 1 });
} return i; })();
import * as l from "@angular/core";
import * as ei from "@angular/common";
var Ri = ["outlet"], Ei = [[["", "slot", "top"]], "*", [["ion-tab"]]], ki = ["[slot=top]", "*", "ion-tab"], zi = ["*ngIf", "tabs.length > 0"];
function Ai(i, o) { if (i & 1) {
    let t = l.\u0275\u0275getCurrentView();
    l.\u0275\u0275elementStart(0, "ion-router-outlet", 5, 1), l.\u0275\u0275listener("stackWillChange", function (c) { l.\u0275\u0275restoreView(t); let d = l.\u0275\u0275nextContext(); return l.\u0275\u0275resetView(d.onStackWillChange(c)); })("stackDidChange", function (c) { l.\u0275\u0275restoreView(t); let d = l.\u0275\u0275nextContext(); return l.\u0275\u0275resetView(d.onStackDidChange(c)); }), l.\u0275\u0275elementEnd();
} }
function Fi(i, o) { i & 1 && l.\u0275\u0275projection(0, 2, zi); }
var Io = (() => { class i extends Go {
    outlet;
    tabBar;
    tabBars;
    tabs;
    static \u0275fac = (() => { let t; return function (c) { return (t || (t = l.\u0275\u0275getInheritedFactory(i)))(c || i); }; })();
    static \u0275cmp = l.\u0275\u0275defineComponent({ type: i, selectors: [["ion-tabs"]], contentQueries: function (n, c, d) { if (n & 1 && l.\u0275\u0275contentQuery(d, E, 5)(d, E, 4)(d, A, 4), n & 2) {
            let m;
            l.\u0275\u0275queryRefresh(m = l.\u0275\u0275loadQuery()) && (c.tabBar = m.first), l.\u0275\u0275queryRefresh(m = l.\u0275\u0275loadQuery()) && (c.tabBars = m), l.\u0275\u0275queryRefresh(m = l.\u0275\u0275loadQuery()) && (c.tabs = m);
        } }, viewQuery: function (n, c) { if (n & 1 && l.\u0275\u0275viewQuery(Ri, 5, S), n & 2) {
            let d;
            l.\u0275\u0275queryRefresh(d = l.\u0275\u0275loadQuery()) && (c.outlet = d.first);
        } }, standalone: !1, features: [l.\u0275\u0275InheritDefinitionFeature], ngContentSelectors: ki, decls: 6, vars: 2, consts: [["tabsInner", ""], ["outlet", ""], [1, "tabs-inner"], ["tabs", "true", 3, "stackWillChange", "stackDidChange", 4, "ngIf"], [4, "ngIf"], ["tabs", "true", 3, "stackWillChange", "stackDidChange"]], template: function (n, c) { n & 1 && (l.\u0275\u0275projectionDef(Ei), l.\u0275\u0275projection(0), l.\u0275\u0275elementStart(1, "div", 2, 0), l.\u0275\u0275template(3, Ai, 2, 0, "ion-router-outlet", 3)(4, Fi, 1, 0, "ng-content", 4), l.\u0275\u0275elementEnd(), l.\u0275\u0275projection(5, 1)), n & 2 && (l.\u0275\u0275advance(3), l.\u0275\u0275property("ngIf", c.tabs.length === 0), l.\u0275\u0275advance(), l.\u0275\u0275property("ngIf", c.tabs.length > 0)); }, dependencies: [ei.NgIf, S], styles: ["[_nghost-%COMP%]{display:flex;position:absolute;inset:0;flex-direction:column;width:100%;height:100%;contain:layout size style}.tabs-inner[_ngcontent-%COMP%]{position:relative;flex:1;contain:layout size style}"], changeDetection: 1 });
} return i; })();
import "@angular/core";
import * as g from "@angular/core";
var Pi = ["*"], Co = (() => { class i extends Lo {
    constructor(t, n, c, d, m, T) { super(t, n, c, d, m, T); }
    static \u0275fac = function (n) { return new (n || i)(g.\u0275\u0275directiveInject(S, 8), g.\u0275\u0275directiveInject(yt), g.\u0275\u0275directiveInject(Dt), g.\u0275\u0275directiveInject(g.ElementRef), g.\u0275\u0275directiveInject(g.NgZone), g.\u0275\u0275directiveInject(g.ChangeDetectorRef)); };
    static \u0275cmp = g.\u0275\u0275defineComponent({ type: i, selectors: [["ion-back-button"]], standalone: !1, features: [g.\u0275\u0275InheritDefinitionFeature], ngContentSelectors: Pi, decls: 1, vars: 0, template: function (n, c) { n & 1 && (g.\u0275\u0275projectionDef(), g.\u0275\u0275projection(0)); }, encapsulation: 2 });
} return i; })();
import "@angular/core";
import * as f from "@angular/core";
var Oi = ["*"], bo = (() => { class i extends Vo {
    constructor(t, n, c, d, m, T) { super(t, n, c, d, m, T); }
    static \u0275fac = function (n) { return new (n || i)(f.\u0275\u0275directiveInject(f.ElementRef), f.\u0275\u0275directiveInject(f.EnvironmentInjector), f.\u0275\u0275directiveInject(f.Injector), f.\u0275\u0275directiveInject(w), f.\u0275\u0275directiveInject(f.NgZone), f.\u0275\u0275directiveInject(f.ChangeDetectorRef)); };
    static \u0275cmp = f.\u0275\u0275defineComponent({ type: i, selectors: [["ion-nav"]], standalone: !1, features: [f.\u0275\u0275InheritDefinitionFeature], ngContentSelectors: Oi, decls: 1, vars: 0, template: function (n, c) { n & 1 && (f.\u0275\u0275projectionDef(), f.\u0275\u0275projection(0)); }, encapsulation: 2 });
} return i; })();
import "@angular/core";
import * as M from "@angular/core";
var yo = (() => { class i extends _o {
    static \u0275fac = (() => { let t; return function (c) { return (t || (t = M.\u0275\u0275getInheritedFactory(i)))(c || i); }; })();
    static \u0275dir = M.\u0275\u0275defineDirective({ type: i, selectors: [["", "routerLink", "", 5, "a", 5, "area"]], standalone: !1, features: [M.\u0275\u0275InheritDefinitionFeature] });
} return i; })();
var Do = (() => { class i extends Zo {
    static \u0275fac = (() => { let t; return function (c) { return (t || (t = M.\u0275\u0275getInheritedFactory(i)))(c || i); }; })();
    static \u0275dir = M.\u0275\u0275defineDirective({ type: i, selectors: [["a", "routerLink", ""], ["area", "routerLink", ""]], standalone: !1, features: [M.\u0275\u0275InheritDefinitionFeature] });
} return i; })();
import "@angular/core";
import * as h from "@angular/core";
import * as It from "@angular/common";
function Ni(i, o) { if (i & 1 && (h.\u0275\u0275elementStart(0, "div", 1), h.\u0275\u0275elementContainer(1, 2), h.\u0275\u0275elementEnd()), i & 2) {
    let t = h.\u0275\u0275nextContext();
    h.\u0275\u0275advance(), h.\u0275\u0275property("ngTemplateOutlet", t.template);
} }
var xo = (() => { class i extends Ao {
    static \u0275fac = (() => { let t; return function (c) { return (t || (t = h.\u0275\u0275getInheritedFactory(i)))(c || i); }; })();
    static \u0275cmp = h.\u0275\u0275defineComponent({ type: i, selectors: [["ion-modal"]], standalone: !1, features: [h.\u0275\u0275InheritDefinitionFeature], decls: 1, vars: 1, consts: [["class", "ion-delegate-host ion-page", 4, "ngIf"], [1, "ion-delegate-host", "ion-page"], [3, "ngTemplateOutlet"]], template: function (n, c) { n & 1 && h.\u0275\u0275template(0, Ni, 2, 1, "div", 0), n & 2 && h.\u0275\u0275property("ngIf", c.isCmpOpen || c.keepContentsMounted); }, dependencies: [It.NgIf, It.NgTemplateOutlet], encapsulation: 2 });
} return i; })();
import "@angular/core";
import * as y from "@angular/core";
import * as Ct from "@angular/common";
function Li(i, o) { if (i & 1 && y.\u0275\u0275elementContainer(0, 1), i & 2) {
    let t = y.\u0275\u0275nextContext();
    y.\u0275\u0275property("ngTemplateOutlet", t.template);
} }
var jo = (() => { class i extends Fo {
    static \u0275fac = (() => { let t; return function (c) { return (t || (t = y.\u0275\u0275getInheritedFactory(i)))(c || i); }; })();
    static \u0275cmp = y.\u0275\u0275defineComponent({ type: i, selectors: [["ion-popover"]], standalone: !1, features: [y.\u0275\u0275InheritDefinitionFeature], decls: 1, vars: 1, consts: [[3, "ngTemplateOutlet", 4, "ngIf"], [3, "ngTemplateOutlet"]], template: function (n, c) { n & 1 && y.\u0275\u0275template(0, Li, 1, 1, "ng-container", 0), n & 2 && y.\u0275\u0275property("ngIf", c.isCmpOpen || c.keepContentsMounted); }, dependencies: [Ct.NgIf, Ct.NgTemplateOutlet], encapsulation: 2 });
} return i; })();
import { forwardRef as Vi } from "@angular/core";
import { MaxValidator as _i, NG_VALIDATORS as Zi } from "@angular/forms";
import * as x from "@angular/core";
var Gi = { provide: Zi, useExisting: Vi(() => To), multi: !0 }, To = (() => { class i extends _i {
    static \u0275fac = (() => { let t; return function (c) { return (t || (t = x.\u0275\u0275getInheritedFactory(i)))(c || i); }; })();
    static \u0275dir = x.\u0275\u0275defineDirective({ type: i, selectors: [["ion-input", "type", "number", "max", "", "formControlName", ""], ["ion-input", "type", "number", "max", "", "formControl", ""], ["ion-input", "type", "number", "max", "", "ngModel", ""]], hostVars: 1, hostBindings: function (n, c) { n & 2 && x.\u0275\u0275attribute("max", c._enabled ? c.max : null); }, standalone: !1, features: [x.\u0275\u0275ProvidersFeature([Gi]), x.\u0275\u0275InheritDefinitionFeature] });
} return i; })();
import { forwardRef as Hi } from "@angular/core";
import { MinValidator as Wi, NG_VALIDATORS as Xi } from "@angular/forms";
import * as j from "@angular/core";
var qi = { provide: Xi, useExisting: Hi(() => wo), multi: !0 }, wo = (() => { class i extends Wi {
    static \u0275fac = (() => { let t; return function (c) { return (t || (t = j.\u0275\u0275getInheritedFactory(i)))(c || i); }; })();
    static \u0275dir = j.\u0275\u0275defineDirective({ type: i, selectors: [["ion-input", "type", "number", "min", "", "formControlName", ""], ["ion-input", "type", "number", "min", "", "formControl", ""], ["ion-input", "type", "number", "min", "", "ngModel", ""]], hostVars: 1, hostBindings: function (n, c) { n & 2 && j.\u0275\u0275attribute("min", c._enabled ? c.min : null); }, standalone: !1, features: [j.\u0275\u0275ProvidersFeature([qi]), j.\u0275\u0275InheritDefinitionFeature] });
} return i; })();
import "@angular/core";
var Ki = i => { let { swiper: o, extendParams: t } = i, n = { effect: void 0, direction: "horizontal", initialSlide: 0, loop: !1, parallax: !1, slidesPerView: 1, spaceBetween: 0, speed: 300, slidesPerColumn: 1, slidesPerColumnFill: "column", slidesPerGroup: 1, centeredSlides: !1, slidesOffsetBefore: 0, slidesOffsetAfter: 0, touchEventsTarget: "container", freeMode: !1, freeModeMomentum: !0, freeModeMomentumRatio: 1, freeModeMomentumBounce: !0, freeModeMomentumBounceRatio: 1, freeModeMomentumVelocityRatio: 1, freeModeSticky: !1, freeModeMinimumVelocity: .02, autoHeight: !1, setWrapperSize: !1, zoom: { maxRatio: 3, minRatio: 1, toggle: !1 }, touchRatio: 1, touchAngle: 45, simulateTouch: !0, touchStartPreventDefault: !1, shortSwipes: !0, longSwipes: !0, longSwipesRatio: .5, longSwipesMs: 300, followFinger: !0, threshold: 0, touchMoveStopPropagation: !0, touchReleaseOnEdges: !1, iOSEdgeSwipeDetection: !1, iOSEdgeSwipeThreshold: 20, resistance: !0, resistanceRatio: .85, watchSlidesProgress: !1, watchSlidesVisibility: !1, preventClicks: !0, preventClicksPropagation: !0, slideToClickedSlide: !1, loopAdditionalSlides: 0, noSwiping: !0, runCallbacksOnInit: !0, coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: !0 }, flipEffect: { slideShadows: !0, limitRotation: !0 }, cubeEffect: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: .94 }, fadeEffect: { crossFade: !1 }, a11y: { prevSlideMessage: "Previous slide", nextSlideMessage: "Next slide", firstSlideMessage: "This is the first slide", lastSlideMessage: "This is the last slide" } }; o.pagination && (n.pagination = { type: "bullets", clickable: !1, hideOnClick: !1 }), o.scrollbar && (n.scrollbar = { hide: !0 }), t(n); };
import * as ti from "@angular/core";
var Qi = (() => { class i extends D {
    constructor() { super(Tt); }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275prov = ti.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac, providedIn: "root" });
} return i; })();
import "@angular/core";
import * as ni from "@angular/core";
var Ui = (() => { class i {
    create(t) { return V(t); }
    easingTime(t, n, c, d, m) { return L(t, n, c, d, m); }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275prov = ni.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac, providedIn: "root" });
} return i; })();
import "@angular/core";
import * as oi from "@angular/core";
var Yi = (() => { class i extends D {
    constructor() { super(wt); }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275prov = oi.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac, providedIn: "root" });
} return i; })();
import "@angular/core";
import * as F from "@angular/core";
var Ji = (() => { class i {
    zone;
    constructor(t) { this.zone = t; }
    create(t, n = !1) { return n && Object.getOwnPropertyNames(t).forEach(c => { if (typeof t[c] == "function") {
        let d = t[c];
        t[c] = (...m) => this.zone.run(() => d(...m));
    } }), N(t); }
    static \u0275fac = function (n) { return new (n || i)(F.\u0275\u0275inject(F.NgZone)); };
    static \u0275prov = F.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac, providedIn: "root" });
} return i; })();
import "@angular/core";
import * as ii from "@angular/core";
var $i = (() => { class i extends D {
    constructor() { super(St); }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275prov = ii.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac, providedIn: "root" });
} return i; })();
import "@angular/core";
import * as ri from "@angular/core";
var er = (() => { class i extends zo {
    constructor() { super(At); }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275prov = ri.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac, providedIn: "root" });
} return i; })();
import { Injector as tr, EnvironmentInjector as nr, inject as So } from "@angular/core";
import * as ai from "@angular/core";
var Mo = (() => { class i extends D {
    angularDelegate = So(w);
    injector = So(tr);
    environmentInjector = So(nr);
    constructor() { super(Mt); }
    create(t) { let d = t, { injector: n } = d, c = O(d, ["injector"]); return super.create(z(k({}, c), { delegate: this.angularDelegate.create(this.environmentInjector, this.injector, "modal", n) })); }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275prov = ai.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac });
} return i; })();
import "@angular/core";
import * as si from "@angular/core";
var or = (() => { class i extends D {
    constructor() { super(Rt); }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275prov = si.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac, providedIn: "root" });
} return i; })();
import { Injector as ir, inject as Ro, EnvironmentInjector as rr } from "@angular/core";
var P = class extends D {
    angularDelegate = Ro(w);
    injector = Ro(ir);
    environmentInjector = Ro(rr);
    constructor() { super(Et); }
    create(o) { let c = o, { injector: t } = c, n = O(c, ["injector"]); return super.create(z(k({}, n), { delegate: this.angularDelegate.create(this.environmentInjector, this.injector, "popover", t) })); }
};
import "@angular/core";
import * as ci from "@angular/core";
var ar = (() => { class i extends D {
    constructor() { super(kt); }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275prov = ci.\u0275\u0275defineInjectable({ token: i, factory: i.\u0275fac, providedIn: "root" });
} return i; })();
import { CommonModule as cr, DOCUMENT as lr } from "@angular/common";
import { APP_INITIALIZER as dr, NgZone as pr } from "@angular/core";
var sr = jt || (() => { }), li = sr;
var di = (i, o) => ko(null, null, function* () { if (!(typeof window > "u"))
    return yield li(), Yo(JSON.parse('[["ion-menu_3",[[289,"ion-menu-button",{"color":[513],"disabled":[4],"menu":[1],"autoHide":[4,"auto-hide"],"type":[1],"visible":[32]},[[16,"ionMenuChange","visibilityChanged"],[16,"ionSplitPaneVisible","visibilityChanged"]]],[289,"ion-menu",{"contentId":[513,"content-id"],"menuId":[513,"menu-id"],"type":[1025],"disabled":[1028],"side":[513],"swipeGesture":[4,"swipe-gesture"],"maxEdgeStart":[2,"max-edge-start"],"isPaneVisible":[32],"isEndSide":[32],"isOpen":[64],"isActive":[64],"open":[64],"close":[64],"toggle":[64],"setOpen":[64]},[[16,"ionSplitPaneVisible","onSplitPaneChanged"],[2,"click","onBackdropClick"]],{"type":[{"typeChanged":0}],"disabled":[{"disabledChanged":0}],"side":[{"sideChanged":0}],"swipeGesture":[{"swipeGestureChanged":0}]}],[257,"ion-menu-toggle",{"menu":[1],"autoHide":[4,"auto-hide"],"visible":[32]},[[16,"ionMenuChange","visibilityChanged"],[16,"ionSplitPaneVisible","visibilityChanged"]]]]],["ion-input-password-toggle",[[33,"ion-input-password-toggle",{"color":[513],"showIcon":[1,"show-icon"],"hideIcon":[1,"hide-icon"],"type":[1025]},null,{"type":[{"onTypeChange":0}]}]]],["ion-fab_3",[[289,"ion-fab-button",{"color":[513],"activated":[4],"disabled":[4],"download":[1],"href":[1],"rel":[1],"routerDirection":[1,"router-direction"],"routerAnimation":[16],"target":[1],"show":[4],"translucent":[4],"type":[1],"form":[1],"size":[1],"closeIcon":[1,"close-icon"]},null,{"disabled":[{"disabledChanged":0}]}],[257,"ion-fab",{"horizontal":[1],"vertical":[1],"edge":[4],"activated":[1028],"close":[64],"toggle":[64]},null,{"activated":[{"activatedChanged":0}]}],[257,"ion-fab-list",{"activated":[4],"side":[1]},null,{"activated":[{"activatedChanged":0}]}]]],["ion-refresher_2",[[0,"ion-refresher-content",{"pullingIcon":[1025,"pulling-icon"],"pullingText":[1,"pulling-text"],"refreshingSpinner":[1025,"refreshing-spinner"],"refreshingText":[1,"refreshing-text"]}],[32,"ion-refresher",{"pullMin":[2,"pull-min"],"pullMax":[2,"pull-max"],"closeDuration":[1,"close-duration"],"snapbackDuration":[1,"snapback-duration"],"pullFactor":[2,"pull-factor"],"disabled":[4],"nativeRefresher":[32],"state":[32],"complete":[64],"cancel":[64],"getProgress":[64]},null,{"disabled":[{"disabledChanged":0}]}]]],["ion-back-button",[[33,"ion-back-button",{"color":[513],"defaultHref":[1025,"default-href"],"disabled":[516],"icon":[1],"text":[1],"type":[1],"routerAnimation":[16]}]]],["ion-toast",[[33,"ion-toast",{"overlayIndex":[2,"overlay-index"],"delegate":[16],"hasController":[4,"has-controller"],"color":[513],"enterAnimation":[16],"leaveAnimation":[16],"cssClass":[1,"css-class"],"duration":[2],"header":[1],"layout":[1],"message":[1],"keyboardClose":[4,"keyboard-close"],"position":[1],"positionAnchor":[1,"position-anchor"],"buttons":[16],"translucent":[4],"animated":[4],"icon":[1],"htmlAttributes":[16],"swipeGesture":[1,"swipe-gesture"],"isOpen":[4,"is-open"],"trigger":[1],"revealContentToScreenReader":[32],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]},null,{"swipeGesture":[{"swipeGestureChanged":0}],"isOpen":[{"onIsOpenChange":0}],"trigger":[{"triggerChanged":0}]}]]],["ion-card_5",[[289,"ion-card",{"color":[513],"button":[4],"type":[1],"disabled":[4],"download":[1],"href":[1],"rel":[1],"routerDirection":[1,"router-direction"],"routerAnimation":[16],"target":[1]}],[32,"ion-card-content"],[289,"ion-card-header",{"color":[513],"translucent":[4]}],[289,"ion-card-subtitle",{"color":[513]}],[289,"ion-card-title",{"color":[513]}]]],["ion-item-option_3",[[289,"ion-item-option",{"color":[513],"disabled":[4],"download":[1],"expandable":[4],"href":[1],"rel":[1],"target":[1],"type":[1]}],[32,"ion-item-options",{"side":[1],"fireSwipeEvent":[64]}],[0,"ion-item-sliding",{"disabled":[4],"state":[32],"getOpenAmount":[64],"getSlidingRatio":[64],"open":[64],"close":[64],"closeOpened":[64]},null,{"disabled":[{"disabledChanged":0}]}]]],["ion-accordion_2",[[305,"ion-accordion",{"value":[1],"disabled":[4],"readonly":[4],"toggleIcon":[1,"toggle-icon"],"toggleIconSlot":[1,"toggle-icon-slot"],"state":[32],"isNext":[32],"isPrevious":[32],"hasInteracted":[32]},null,{"value":[{"valueChanged":0}]}],[289,"ion-accordion-group",{"animated":[4],"multiple":[4],"value":[1025],"disabled":[4],"readonly":[4],"expand":[1],"requestAccordionToggle":[64],"getAccordions":[64]},[[0,"keydown","onKeydown"]],{"value":[{"valueChanged":0}],"disabled":[{"disabledChanged":0}],"readonly":[{"readonlyChanged":0}]}]]],["ion-infinite-scroll_2",[[32,"ion-infinite-scroll-content",{"loadingSpinner":[1025,"loading-spinner"],"loadingText":[1,"loading-text"]}],[0,"ion-infinite-scroll",{"threshold":[1],"disabled":[4],"position":[1],"isLoading":[32],"complete":[64]},null,{"threshold":[{"thresholdChanged":0}],"disabled":[{"disabledChanged":0}]}]]],["ion-reorder_2",[[289,"ion-reorder",null,[[2,"click","onClick"]]],[0,"ion-reorder-group",{"disabled":[4],"state":[32],"complete":[64]},null,{"disabled":[{"disabledChanged":0}]}]]],["ion-segment_2",[[289,"ion-segment-button",{"contentId":[513,"content-id"],"disabled":[1028],"layout":[1],"type":[1],"value":[8],"checked":[32],"setFocus":[64]},null,{"value":[{"valueChanged":0}]}],[289,"ion-segment",{"color":[513],"disabled":[4],"scrollable":[4],"swipeGesture":[4,"swipe-gesture"],"value":[1032],"selectOnFocus":[4,"select-on-focus"],"activated":[32]},[[16,"ionSegmentViewScroll","handleSegmentViewScroll"],[0,"keydown","onKeyDown"]],{"color":[{"colorChanged":0}],"swipeGesture":[{"swipeGestureChanged":0}],"value":[{"valueChanged":0}],"disabled":[{"disabledChanged":0}]}]]],["ion-chip",[[289,"ion-chip",{"color":[513],"outline":[4],"disabled":[4]}]]],["ion-input",[[294,"ion-input",{"color":[513],"autocapitalize":[1],"autocomplete":[1],"autocorrect":[1],"autofocus":[4],"clearInput":[4,"clear-input"],"clearInputIcon":[1,"clear-input-icon"],"clearOnEdit":[4,"clear-on-edit"],"counter":[4],"counterFormatter":[16],"debounce":[2],"disabled":[516],"enterkeyhint":[1],"errorText":[1,"error-text"],"fill":[1],"inputmode":[1],"helperText":[1,"helper-text"],"label":[1],"labelPlacement":[1,"label-placement"],"max":[8],"maxlength":[2],"min":[8],"minlength":[2],"multiple":[4],"name":[1],"pattern":[1],"placeholder":[1],"readonly":[516],"required":[4],"shape":[1],"spellcheck":[4],"step":[1],"type":[1],"value":[1032],"hasFocus":[32],"isInvalid":[32],"setFocus":[64],"getInputElement":[64]},[[2,"click","onClickCapture"]],{"debounce":[{"debounceChanged":0}],"type":[{"onTypeChange":0}],"value":[{"valueChanged":0}],"dir":[{"onDirChanged":0}]}]]],["ion-searchbar",[[34,"ion-searchbar",{"color":[513],"animated":[4],"autocapitalize":[1],"autocomplete":[1],"autocorrect":[1],"cancelButtonIcon":[1,"cancel-button-icon"],"cancelButtonText":[1,"cancel-button-text"],"clearIcon":[1,"clear-icon"],"debounce":[2],"disabled":[4],"inputmode":[1],"enterkeyhint":[1],"maxlength":[2],"minlength":[2],"name":[1],"placeholder":[1],"searchIcon":[1,"search-icon"],"showCancelButton":[1,"show-cancel-button"],"showClearButton":[1,"show-clear-button"],"spellcheck":[4],"type":[1],"value":[1025],"focused":[32],"noAnimate":[32],"setFocus":[64],"getInputElement":[64]},null,{"lang":[{"onLangChanged":0}],"dir":[{"onDirChanged":0}],"debounce":[{"debounceChanged":0}],"value":[{"valueChanged":0}],"showCancelButton":[{"showCancelButtonChanged":0}]}]]],["ion-toggle",[[289,"ion-toggle",{"color":[513],"name":[1],"checked":[1028],"disabled":[4],"errorText":[1,"error-text"],"helperText":[1,"helper-text"],"value":[1],"enableOnOffLabels":[4,"enable-on-off-labels"],"labelPlacement":[1,"label-placement"],"justify":[1],"alignment":[1],"required":[4],"activated":[32],"isInvalid":[32],"hintTextId":[32]},null,{"disabled":[{"disabledChanged":0}]}]]],["ion-nav_2",[[257,"ion-nav",{"delegate":[16],"swipeGesture":[1028,"swipe-gesture"],"animated":[4],"animation":[16],"rootParams":[16],"root":[1],"push":[64],"insert":[64],"insertPages":[64],"pop":[64],"popTo":[64],"popToRoot":[64],"removeIndex":[64],"setRoot":[64],"setPages":[64],"setRouteId":[64],"getRouteId":[64],"getActive":[64],"getByIndex":[64],"canGoBack":[64],"getPrevious":[64],"getLength":[64]},null,{"swipeGesture":[{"swipeGestureChanged":0}],"root":[{"rootChanged":0}]}],[0,"ion-nav-link",{"component":[1],"componentProps":[16],"routerDirection":[1,"router-direction"],"routerAnimation":[16]}]]],["ion-tab_2",[[257,"ion-tab",{"active":[1028],"delegate":[16],"tab":[1],"component":[1],"setActive":[64]},null,{"active":[{"changeActive":0}]}],[257,"ion-tabs",{"useRouter":[1028,"use-router"],"selectedTab":[32],"select":[64],"getTab":[64],"getSelected":[64],"setRouteId":[64],"getRouteId":[64]}]]],["ion-textarea",[[294,"ion-textarea",{"color":[513],"autocapitalize":[1],"autofocus":[4],"clearOnEdit":[4,"clear-on-edit"],"debounce":[2],"disabled":[516],"fill":[1],"inputmode":[1],"enterkeyhint":[1],"maxlength":[2],"minlength":[2],"name":[1],"placeholder":[1],"readonly":[516],"required":[4],"spellcheck":[4],"cols":[514],"rows":[2],"wrap":[1],"autoGrow":[516,"auto-grow"],"value":[1025],"counter":[4],"counterFormatter":[16],"errorText":[1,"error-text"],"helperText":[1,"helper-text"],"label":[1],"labelPlacement":[1,"label-placement"],"shape":[1],"hasFocus":[32],"isInvalid":[32],"setFocus":[64],"getInputElement":[64]},[[2,"click","onClickCapture"]],{"debounce":[{"debounceChanged":0}],"value":[{"valueChanged":0}],"dir":[{"onDirChanged":0}]}]]],["ion-backdrop",[[33,"ion-backdrop",{"visible":[4],"tappable":[4],"stopPropagation":[4,"stop-propagation"]},[[2,"click","onMouseDown"]]]]],["ion-loading",[[34,"ion-loading",{"overlayIndex":[2,"overlay-index"],"delegate":[16],"hasController":[4,"has-controller"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"message":[1],"cssClass":[1,"css-class"],"duration":[2],"backdropDismiss":[4,"backdrop-dismiss"],"showBackdrop":[4,"show-backdrop"],"spinner":[1025],"translucent":[4],"animated":[4],"htmlAttributes":[16],"isOpen":[4,"is-open"],"trigger":[1],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]},null,{"isOpen":[{"onIsOpenChange":0}],"trigger":[{"triggerChanged":0}]}]]],["ion-breadcrumb_2",[[289,"ion-breadcrumb",{"collapsed":[4],"last":[4],"showCollapsedIndicator":[4,"show-collapsed-indicator"],"color":[1],"active":[4],"disabled":[4],"download":[1],"href":[1],"rel":[1],"separator":[4],"target":[1],"routerDirection":[1,"router-direction"],"routerAnimation":[16]}],[289,"ion-breadcrumbs",{"color":[513],"maxItems":[2,"max-items"],"itemsBeforeCollapse":[2,"items-before-collapse"],"itemsAfterCollapse":[2,"items-after-collapse"],"collapsed":[32],"activeChanged":[32]},[[0,"collapsedClick","onCollapsedClick"]],{"maxItems":[{"maxItemsChanged":0}],"itemsBeforeCollapse":[{"maxItemsChanged":0}],"itemsAfterCollapse":[{"maxItemsChanged":0}]}]]],["ion-tab-bar_2",[[289,"ion-tab-button",{"disabled":[4],"download":[1],"href":[1],"rel":[1],"layout":[1025],"selected":[1028],"tab":[1],"target":[1]},[[8,"ionTabBarChanged","onTabBarChanged"]]],[289,"ion-tab-bar",{"color":[513],"selectedTab":[1,"selected-tab"],"translucent":[4],"keyboardVisible":[32]},null,{"selectedTab":[{"selectedTabChanged":0}]}]]],["ion-datetime-button",[[289,"ion-datetime-button",{"color":[513],"disabled":[516],"datetime":[1],"datetimePresentation":[32],"dateText":[32],"timeText":[32],"datetimeActive":[32],"selectedButton":[32]}]]],["ion-route_4",[[0,"ion-route",{"url":[1],"component":[1],"componentProps":[16],"beforeLeave":[16],"beforeEnter":[16]},null,{"url":[{"onUpdate":0}],"component":[{"onUpdate":0}],"componentProps":[{"onComponentProps":0}]}],[0,"ion-route-redirect",{"from":[1],"to":[1]},null,{"from":[{"propDidChange":0}],"to":[{"propDidChange":0}]}],[0,"ion-router",{"root":[1],"useHash":[4,"use-hash"],"canTransition":[64],"push":[64],"back":[64],"printDebug":[64],"navChanged":[64]},[[8,"popstate","onPopState"],[4,"ionBackButton","onBackButton"]]],[257,"ion-router-link",{"color":[513],"href":[1],"rel":[1],"routerDirection":[1,"router-direction"],"routerAnimation":[16],"target":[1]}]]],["ion-avatar_3",[[289,"ion-avatar"],[289,"ion-badge",{"color":[513]}],[257,"ion-thumbnail"]]],["ion-col_3",[[257,"ion-col",{"offset":[1],"offsetXs":[1,"offset-xs"],"offsetSm":[1,"offset-sm"],"offsetMd":[1,"offset-md"],"offsetLg":[1,"offset-lg"],"offsetXl":[1,"offset-xl"],"pull":[1],"pullXs":[1,"pull-xs"],"pullSm":[1,"pull-sm"],"pullMd":[1,"pull-md"],"pullLg":[1,"pull-lg"],"pullXl":[1,"pull-xl"],"push":[1],"pushXs":[1,"push-xs"],"pushSm":[1,"push-sm"],"pushMd":[1,"push-md"],"pushLg":[1,"push-lg"],"pushXl":[1,"push-xl"],"size":[1],"sizeXs":[1,"size-xs"],"sizeSm":[1,"size-sm"],"sizeMd":[1,"size-md"],"sizeLg":[1,"size-lg"],"sizeXl":[1,"size-xl"]},[[9,"resize","onResize"]]],[257,"ion-grid",{"fixed":[4]}],[257,"ion-row"]]],["ion-img",[[1,"ion-img",{"alt":[1],"src":[1],"loadSrc":[32],"loadError":[32]},null,{"src":[{"srcChanged":0}]}]]],["ion-input-otp",[[294,"ion-input-otp",{"autocapitalize":[1],"color":[513],"disabled":[516],"fill":[1],"inputmode":[1],"length":[2],"pattern":[1],"readonly":[516],"separators":[1],"shape":[1],"size":[1],"type":[1],"value":[1032],"inputValues":[32],"hasFocus":[32],"previousInputValues":[32],"setFocus":[64]},null,{"value":[{"valueChanged":0}],"separators":[{"processSeparators":0}],"length":[{"processSeparators":0}]}]]],["ion-progress-bar",[[33,"ion-progress-bar",{"type":[1],"reversed":[4],"value":[2],"buffer":[2],"color":[513]}]]],["ion-range",[[289,"ion-range",{"color":[513],"debounce":[2],"name":[1],"label":[1],"dualKnobs":[4,"dual-knobs"],"min":[2],"max":[2],"pin":[4],"pinFormatter":[16],"snaps":[4],"step":[2],"ticks":[4],"activeBarStart":[1026,"active-bar-start"],"disabled":[4],"value":[1026],"labelPlacement":[1,"label-placement"],"ratioA":[32],"ratioB":[32],"activatedKnob":[32],"focusedKnob":[32],"hoveredKnob":[32],"pressedKnob":[32]},null,{"debounce":[{"debounceChanged":0}],"dualKnobs":[{"dualKnobsChanged":0}],"min":[{"minChanged":0}],"max":[{"maxChanged":0}],"step":[{"stepChanged":0}],"activeBarStart":[{"activeBarStartChanged":0}],"disabled":[{"disabledChanged":0}],"value":[{"valueChanged":0}]}]]],["ion-segment-content",[[257,"ion-segment-content"]]],["ion-segment-view",[[289,"ion-segment-view",{"disabled":[4],"swipeGesture":[4,"swipe-gesture"],"isManualScroll":[32],"setContent":[64]},[[1,"scroll","handleScroll"],[1,"touchstart","handleScrollStart"],[1,"touchend","handleTouchEnd"]]]]],["ion-split-pane",[[289,"ion-split-pane",{"contentId":[513,"content-id"],"disabled":[4],"when":[8],"visible":[32],"isVisible":[64]},null,{"visible":[{"visibleChanged":0}],"disabled":[{"updateState":0}],"when":[{"updateState":0}]}]]],["ion-text",[[257,"ion-text",{"color":[513]}]]],["ion-select-modal",[[34,"ion-select-modal",{"header":[1],"cancelText":[1,"cancel-text"],"multiple":[4],"options":[16]}]]],["ion-datetime_3",[[289,"ion-datetime",{"color":[1],"name":[1],"disabled":[4],"formatOptions":[16],"readonly":[4],"isDateEnabled":[16],"showAdjacentDays":[4,"show-adjacent-days"],"min":[1025],"max":[1025],"presentation":[1],"cancelText":[1,"cancel-text"],"doneText":[1,"done-text"],"clearText":[1,"clear-text"],"yearValues":[8,"year-values"],"monthValues":[8,"month-values"],"dayValues":[8,"day-values"],"hourValues":[8,"hour-values"],"minuteValues":[8,"minute-values"],"locale":[1],"firstDayOfWeek":[2,"first-day-of-week"],"titleSelectedDatesFormatter":[16],"multiple":[4],"highlightedDates":[16],"value":[1025],"showDefaultTitle":[4,"show-default-title"],"showDefaultButtons":[4,"show-default-buttons"],"showClearButton":[4,"show-clear-button"],"showDefaultTimeLabel":[4,"show-default-time-label"],"hourCycle":[1,"hour-cycle"],"size":[1],"preferWheel":[4,"prefer-wheel"],"showMonthAndYear":[32],"activeParts":[32],"workingParts":[32],"isTimePopoverOpen":[32],"forceRenderDate":[32],"confirm":[64],"reset":[64],"cancel":[64],"getDefaultPart":[64]},null,{"formatOptions":[{"formatOptionsChanged":0}],"disabled":[{"disabledChanged":0}],"min":[{"minChanged":0}],"max":[{"maxChanged":0}],"presentation":[{"presentationChanged":0}],"yearValues":[{"yearValuesChanged":0}],"monthValues":[{"monthValuesChanged":0}],"dayValues":[{"dayValuesChanged":0}],"hourValues":[{"hourValuesChanged":0}],"minuteValues":[{"minuteValuesChanged":0}],"value":[{"valueChanged":0}]}],[34,"ion-picker-legacy",{"overlayIndex":[2,"overlay-index"],"delegate":[16],"hasController":[4,"has-controller"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"buttons":[16],"columns":[16],"cssClass":[1,"css-class"],"duration":[2],"showBackdrop":[4,"show-backdrop"],"backdropDismiss":[4,"backdrop-dismiss"],"animated":[4],"htmlAttributes":[16],"isOpen":[4,"is-open"],"trigger":[1],"presented":[32],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64],"getColumn":[64]},null,{"isOpen":[{"onIsOpenChange":0}],"trigger":[{"triggerChanged":0}]}],[32,"ion-picker-legacy-column",{"col":[16]},null,{"col":[{"colChanged":0}]}]]],["ion-action-sheet",[[34,"ion-action-sheet",{"overlayIndex":[2,"overlay-index"],"delegate":[16],"hasController":[4,"has-controller"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"buttons":[16],"cssClass":[1,"css-class"],"backdropDismiss":[4,"backdrop-dismiss"],"header":[1],"subHeader":[1,"sub-header"],"translucent":[4],"animated":[4],"htmlAttributes":[16],"isOpen":[4,"is-open"],"trigger":[1],"activeRadioId":[32],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]},[[0,"keydown","onKeydown"]],{"buttons":[{"buttonsChanged":0}],"isOpen":[{"onIsOpenChange":0}],"trigger":[{"triggerChanged":0}]}]]],["ion-alert",[[34,"ion-alert",{"overlayIndex":[2,"overlay-index"],"delegate":[16],"hasController":[4,"has-controller"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"cssClass":[1,"css-class"],"header":[1],"subHeader":[1,"sub-header"],"message":[1],"buttons":[16],"inputs":[1040],"backdropDismiss":[4,"backdrop-dismiss"],"translucent":[4],"animated":[4],"htmlAttributes":[16],"isOpen":[4,"is-open"],"trigger":[1],"isButtonGroupWrapped":[32],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64]},[[4,"keydown","onKeydown"]],{"isOpen":[{"onIsOpenChange":0}],"trigger":[{"triggerChanged":0}],"buttons":[{"buttonsChanged":0}],"inputs":[{"inputsChanged":0}]}]]],["ion-modal",[[289,"ion-modal",{"hasController":[4,"has-controller"],"overlayIndex":[2,"overlay-index"],"delegate":[16],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"breakpoints":[16],"expandToScroll":[4,"expand-to-scroll"],"initialBreakpoint":[2,"initial-breakpoint"],"backdropBreakpoint":[2,"backdrop-breakpoint"],"handle":[4],"handleBehavior":[1,"handle-behavior"],"component":[1],"componentProps":[16],"cssClass":[1,"css-class"],"backdropDismiss":[4,"backdrop-dismiss"],"showBackdrop":[4,"show-backdrop"],"animated":[4],"presentingElement":[16],"htmlAttributes":[16],"isOpen":[4,"is-open"],"trigger":[1],"keepContentsMounted":[4,"keep-contents-mounted"],"focusTrap":[4,"focus-trap"],"canDismiss":[4,"can-dismiss"],"isSheetModal":[32],"presented":[32],"present":[64],"dismiss":[64],"onDidDismiss":[64],"onWillDismiss":[64],"setCurrentBreakpoint":[64],"getCurrentBreakpoint":[64]},[[9,"resize","onWindowResize"]],{"isOpen":[{"onIsOpenChange":0}],"trigger":[{"triggerChanged":0}],"breakpoints":[{"breakpointsChanged":0}]}]]],["ion-picker",[[289,"ion-picker",{"exitInputMode":[64]},[[1,"touchstart","preventTouchStartPropagation"]]]]],["ion-picker-column",[[257,"ion-picker-column",{"disabled":[4],"value":[1032],"color":[513],"numericInput":[4,"numeric-input"],"ariaLabel":[32],"isActive":[32],"scrollActiveItemIntoView":[64],"setValue":[64],"setFocus":[64]},null,{"aria-label":[{"ariaLabelChanged":0}],"value":[{"valueChange":0}]}]]],["ion-picker-column-option",[[289,"ion-picker-column-option",{"disabled":[4],"value":[8],"color":[513],"ariaLabel":[32]},null,{"aria-label":[{"onAriaLabelChange":0}]}]]],["ion-popover",[[289,"ion-popover",{"hasController":[4,"has-controller"],"delegate":[16],"overlayIndex":[2,"overlay-index"],"enterAnimation":[16],"leaveAnimation":[16],"component":[1],"componentProps":[16],"keyboardClose":[4,"keyboard-close"],"cssClass":[1,"css-class"],"backdropDismiss":[4,"backdrop-dismiss"],"event":[8],"showBackdrop":[4,"show-backdrop"],"translucent":[4],"animated":[4],"htmlAttributes":[16],"triggerAction":[1,"trigger-action"],"trigger":[1],"size":[1],"dismissOnSelect":[4,"dismiss-on-select"],"reference":[1],"side":[1],"alignment":[1025],"arrow":[4],"isOpen":[4,"is-open"],"keyboardEvents":[4,"keyboard-events"],"focusTrap":[4,"focus-trap"],"keepContentsMounted":[4,"keep-contents-mounted"],"presented":[32],"presentFromTrigger":[64],"present":[64],"dismiss":[64],"getParentPopover":[64],"onDidDismiss":[64],"onWillDismiss":[64]},null,{"trigger":[{"onTriggerChange":0}],"triggerAction":[{"onTriggerChange":0}],"isOpen":[{"onIsOpenChange":0}]}]]],["ion-checkbox",[[289,"ion-checkbox",{"color":[513],"name":[1],"checked":[1028],"indeterminate":[1028],"disabled":[4],"errorText":[1,"error-text"],"helperText":[1,"helper-text"],"value":[8],"labelPlacement":[1,"label-placement"],"justify":[1],"alignment":[1],"required":[4],"isInvalid":[32],"hasLabelContent":[32],"hintTextId":[32],"setFocus":[64]}]]],["ion-item_8",[[289,"ion-item-divider",{"color":[513],"sticky":[4]}],[32,"ion-item-group"],[289,"ion-note",{"color":[513]}],[1,"ion-skeleton-text",{"animated":[4]}],[294,"ion-label",{"color":[513],"position":[1],"noAnimate":[32]},null,{"color":[{"colorChanged":0}],"position":[{"positionChanged":0}]}],[289,"ion-list-header",{"color":[513],"lines":[1]}],[289,"ion-item",{"color":[513],"button":[4],"detail":[4],"detailIcon":[1,"detail-icon"],"disabled":[516],"download":[1],"href":[1],"rel":[1],"lines":[1],"routerAnimation":[16],"routerDirection":[1,"router-direction"],"target":[1],"type":[1],"multipleInputs":[32],"focusable":[32],"isInteractive":[32],"hasSlottedIndicatorControl":[32]},[[0,"ionColor","labelColorChanged"],[0,"ionStyle","itemStyle"]],{"button":[{"buttonChanged":0}]}],[32,"ion-list",{"lines":[1],"inset":[4],"closeSlidingItems":[64]}]]],["ion-app_8",[[0,"ion-app",{"setFocus":[64]}],[292,"ion-footer",{"collapse":[1],"translucent":[4],"keyboardVisible":[32]}],[257,"ion-router-outlet",{"mode":[1025],"delegate":[16],"animated":[4],"animation":[16],"swipeHandler":[16],"commit":[64],"setRouteId":[64],"getRouteId":[64]},null,{"swipeHandler":[{"swipeHandlerChanged":0}]}],[257,"ion-content",{"color":[513],"fullscreen":[4],"fixedSlotPlacement":[1,"fixed-slot-placement"],"forceOverscroll":[1028,"force-overscroll"],"scrollX":[4,"scroll-x"],"scrollY":[4,"scroll-y"],"scrollEvents":[4,"scroll-events"],"recalculateDimensions":[64],"getScrollElement":[64],"getBackgroundElement":[64],"scrollToTop":[64],"scrollToBottom":[64],"scrollByPoint":[64],"scrollToPoint":[64]},[[9,"resize","onResize"]],{"fullscreen":[{"fullscreenChanged":0}]}],[292,"ion-header",{"collapse":[1],"translucent":[4]}],[289,"ion-title",{"color":[513],"size":[1]},null,{"size":[{"sizeChanged":0}]}],[289,"ion-toolbar",{"color":[513]},[[0,"ionStyle","childrenStyle"]]],[294,"ion-buttons",{"collapse":[4]}]]],["ion-select_3",[[289,"ion-select",{"cancelText":[1,"cancel-text"],"color":[513],"compareWith":[1,"compare-with"],"disabled":[4],"fill":[1],"errorText":[1,"error-text"],"helperText":[1,"helper-text"],"interface":[1],"interfaceOptions":[8,"interface-options"],"justify":[1],"label":[1],"labelPlacement":[1,"label-placement"],"multiple":[4],"name":[1],"okText":[1,"ok-text"],"placeholder":[1],"selectedText":[1,"selected-text"],"toggleIcon":[1,"toggle-icon"],"expandedIcon":[1,"expanded-icon"],"shape":[1],"value":[1032],"required":[4],"isExpanded":[32],"hasFocus":[32],"isInvalid":[32],"hintTextId":[32],"open":[64]},null,{"disabled":[{"styleChanged":0}],"isExpanded":[{"styleChanged":0}],"placeholder":[{"styleChanged":0}],"value":[{"styleChanged":0}]}],[1,"ion-select-option",{"disabled":[4],"value":[8]}],[34,"ion-select-popover",{"header":[1],"subHeader":[1,"sub-header"],"message":[1],"multiple":[4],"options":[16]}]]],["ion-spinner",[[1,"ion-spinner",{"color":[513],"duration":[2],"name":[1],"paused":[4]}]]],["ion-radio_2",[[289,"ion-radio",{"color":[513],"name":[1],"disabled":[4],"value":[8],"labelPlacement":[1,"label-placement"],"justify":[1],"alignment":[1],"checked":[32],"buttonTabindex":[32],"setFocus":[64],"setButtonTabindex":[64]},null,{"value":[{"valueChanged":0}]}],[292,"ion-radio-group",{"allowEmptySelection":[4,"allow-empty-selection"],"compareWith":[1,"compare-with"],"name":[1],"value":[1032],"helperText":[1,"helper-text"],"errorText":[1,"error-text"],"isInvalid":[32],"hintTextId":[32],"setFocus":[64]},[[4,"keydown","onKeydown"]],{"value":[{"valueChanged":0}]}]]],["ion-ripple-effect",[[1,"ion-ripple-effect",{"type":[1],"addRipple":[64]}]]],["ion-button_2",[[289,"ion-button",{"color":[513],"buttonType":[1025,"button-type"],"disabled":[516],"expand":[513],"fill":[1537],"routerDirection":[1,"router-direction"],"routerAnimation":[16],"download":[1],"href":[1],"rel":[1],"shape":[513],"size":[513],"strong":[4],"target":[1],"type":[1],"form":[1],"isCircle":[32]},null,{"disabled":[{"disabledChanged":0}],"aria-checked":[{"onAriaChanged":0}],"aria-label":[{"onAriaChanged":0}],"aria-pressed":[{"onAriaChanged":0}]}],[1,"ion-icon",{"mode":[1025],"color":[1],"ios":[1],"md":[1],"flipRtl":[4,"flip-rtl"],"name":[513],"src":[1],"icon":[8],"size":[1],"lazy":[4],"sanitize":[4],"svgContent":[32],"isVisible":[32]},null,{"name":[{"loadIcon":0}],"src":[{"loadIcon":0}],"icon":[{"loadIcon":0}],"ios":[{"loadIcon":0}],"md":[{"loadIcon":0}]}]]]]'), o); });
(function () { if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var i = HTMLElement;
    window.HTMLElement = function () { return Reflect.construct(i, [], this.constructor); }, HTMLElement.prototype = i.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, i);
} })();
var pi = (i, o, t) => () => { let n = o.defaultView; if (n && typeof window < "u") {
    zt(z(k({}, i), { _zoneGate: d => t.run(d) }));
    let c = "__zone_symbol__addEventListener" in o.body ? "__zone_symbol__addEventListener" : "addEventListener";
    return di(n, { exclude: ["ion-tabs"], syncQueue: !0, raf: Oo, jmp: d => t.runOutsideAngular(d), ael(d, m, T, B) { d[c](m, T, B); }, rel(d, m, T, B) { d.removeEventListener(m, T, B); } });
} };
var ui = [_, Z, G, H, W, X, q, K, Q, U, Y, J, $, ee, te, ne, oe, ie, re, ae, se, ce, le, de, pe, ue, me, fe, ge, he, ve, Ie, Ce, be, ye, De, xe, je, Te, we, Se, Me, Re, Ee, ke, ze, Ae, Fe, Be, Pe, Oe, Ne, Le, Ve, _e, Ze, Ge, He, We, Xe, qe, Ke, Qe, Ue, Ye, Je, $e, et, tt, nt, ot, it, rt, at, st, ct, A, E, lt, dt, pt, ut, mt, ft, gt, ht];
import * as bt from "@angular/core";
var Gc = [...ui, xo, jo, Ft, Bt, Pt, Ot, Io, S, Co, bo, yo, Do, wo, To], ur = (() => { class i {
    static forRoot(t = {}) { return { ngModule: i, providers: [{ provide: xt, useValue: t }, { provide: dr, useFactory: pi, multi: !0, deps: [xt, lr, pr] }, w, Po()] }; }
    static \u0275fac = function (n) { return new (n || i); };
    static \u0275mod = bt.\u0275\u0275defineNgModule({ type: i });
    static \u0275inj = bt.\u0275\u0275defineInjector({ providers: [Mo, P], imports: [cr] });
} return i; })();
export { Yi as ActionSheetController, Qi as AlertController, w as AngularDelegate, Ui as AnimationController, Ft as BooleanValueAccessor, Dt as Config, mi as DomController, Ji as GestureController, Gi as ION_MAX_VALIDATOR, qi as ION_MIN_VALIDATOR, _ as IonAccordion, Z as IonAccordionGroup, G as IonActionSheet, H as IonAlert, W as IonApp, X as IonAvatar, Co as IonBackButton, q as IonBackdrop, K as IonBadge, Q as IonBreadcrumb, U as IonBreadcrumbs, Y as IonButton, J as IonButtons, $ as IonCard, ee as IonCardContent, te as IonCardHeader, ne as IonCardSubtitle, oe as IonCardTitle, ie as IonCheckbox, re as IonChip, ae as IonCol, se as IonContent, ce as IonDatetime, le as IonDatetimeButton, de as IonFab, pe as IonFabButton, ue as IonFabList, me as IonFooter, fe as IonGrid, ge as IonHeader, he as IonIcon, ve as IonImg, Ie as IonInfiniteScroll, Ce as IonInfiniteScrollContent, be as IonInput, ye as IonInputOtp, De as IonInputPasswordToggle, xe as IonItem, je as IonItemDivider, Te as IonItemGroup, we as IonItemOption, Se as IonItemOptions, Me as IonItemSliding, Re as IonLabel, Ee as IonList, ke as IonListHeader, ze as IonLoading, To as IonMaxValidator, Ae as IonMenu, Fe as IonMenuButton, Be as IonMenuToggle, wo as IonMinValidator, xo as IonModal, hi as IonModalToken, bo as IonNav, Pe as IonNavLink, Oe as IonNote, Ne as IonPicker, Le as IonPickerColumn, Ve as IonPickerColumnOption, _e as IonPickerLegacy, jo as IonPopover, Ze as IonProgressBar, Ge as IonRadio, He as IonRadioGroup, We as IonRange, Xe as IonRefresher, qe as IonRefresherContent, Ke as IonReorder, Qe as IonReorderGroup, Ue as IonRippleEffect, S as IonRouterOutlet, Ye as IonRow, Je as IonSearchbar, $e as IonSegment, et as IonSegmentButton, tt as IonSegmentContent, nt as IonSegmentView, ot as IonSelect, it as IonSelectModal, rt as IonSelectOption, at as IonSkeletonText, st as IonSpinner, ct as IonSplitPane, A as IonTab, E as IonTabBar, lt as IonTabButton, Io as IonTabs, dt as IonText, pt as IonTextarea, ut as IonThumbnail, mt as IonTitle, ft as IonToast, gt as IonToggle, ht as IonToolbar, ur as IonicModule, vi as IonicRouteStrategy, qo as IonicSafeString, Ki as IonicSlides, $i as LoadingController, er as MenuController, Mo as ModalController, yt as NavController, gi as NavParams, Bt as NumericValueAccessor, or as PickerController, fi as Platform, P as PopoverController, yo as RouterLinkDelegate, Do as RouterLinkWithHrefDelegate, Pt as SelectValueAccessor, Ot as TextValueAccessor, ar as ToastController, V as createAnimation, N as createGesture, Uo as getIonPageElement, Ho as getPlatforms, L as getTimeGivenProgression, Ko as iosTransitionAnimation, Wo as isPlatform, Qo as mdTransitionAnimation, Xo as openURL };
/*! Bundled license information:

@ionic/core/dist/esm/index.js:
@ionic/core/dist/esm/app-globals-D0C5S4hU.js:
@ionic/core/dist/esm/loader.js:
@ionic/core/loader/index.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
