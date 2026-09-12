import { a as p } from "@nf-internal/chunk-IQO3VMP7";
import * as o from "@angular/core";
import { InjectionToken as X, inject as h, ElementRef as Y, ChangeDetectorRef as H } from "@angular/core";
import { of as S, Subject as O, isObservable as g, forkJoin as tt, concat as j, defer as M } from "rxjs";
import { take as k, shareReplay as V, map as E, concatMap as et, switchMap as N } from "rxjs/operators";
function ft(e) { return e; }
var F = class {
}, _ = (() => { class e {
    handle(t) { return t.key; }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })(), b = class {
}, J = (() => { class e extends b {
    compile(t, n) { return t; }
    compileTranslations(t, n) { return t; }
    static \u0275fac = (() => { let t; return function (r) { return (t || (t = o.\u0275\u0275getInheritedFactory(e)))(r || e); }; })();
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })(), L = class {
}, U = (() => { class e extends L {
    getTranslation(t) { return S({}); }
    static \u0275fac = (() => { let t; return function (r) { return (t || (t = o.\u0275\u0275getInheritedFactory(e)))(r || e); }; })();
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })();
function y(e, i) { if (e === i)
    return !0; if (e === null || i === null)
    return !1; if (e !== e && i !== i)
    return !0; let t = typeof e, n = typeof i, r; if (t == n && t == "object")
    if (Array.isArray(e)) {
        if (!Array.isArray(i))
            return !1;
        if ((r = e.length) == i.length) {
            for (let s = 0; s < r; s++)
                if (!y(e[s], i[s]))
                    return !1;
            return !0;
        }
    }
    else {
        if (Array.isArray(i))
            return !1;
        if (c(e) && c(i)) {
            let s = Object.create(null);
            for (let a in e) {
                if (!y(e[a], i[a]))
                    return !1;
                s[a] = !0;
            }
            for (let a in i)
                if (!(a in s) && typeof i[a] < "u")
                    return !1;
            return !0;
        }
    } return !1; }
function u(e) { return typeof e < "u" && e !== null; }
function K(e) { return e !== void 0; }
function c(e) { return v(e) && !f(e) && e !== null; }
function v(e) { return typeof e == "object" && e !== null; }
function f(e) { return Array.isArray(e); }
function w(e) { return typeof e == "string"; }
function nt(e) { return typeof e == "function"; }
function D(e) { if (f(e))
    return e.map(i => D(i)); if (c(e)) {
    let i = {};
    return Object.keys(e).forEach(t => { i[t] = D(e[t]); }), i;
}
else
    return e; }
function R(e, i) { if (!v(e))
    return D(i); let t = D(e); return v(t) && v(i) && Object.keys(i).forEach(n => { c(i[n]) ? n in e ? t[n] = R(e[n], i[n]) : Object.assign(t, { [n]: i[n] }) : Object.assign(t, { [n]: i[n] }); }), t; }
function $(e, i) { let t = i.split("."); i = ""; do {
    i += t.shift();
    let n = !t.length;
    if (u(e)) {
        if (c(e) && K(e[i]) && (c(e[i]) || f(e[i]) || n)) {
            e = e[i], i = "";
            continue;
        }
        if (f(e)) {
            let r = parseInt(i, 10);
            if (K(e[r]) && (c(e[r]) || f(e[r]) || n)) {
                e = e[r], i = "";
                continue;
            }
        }
    }
    if (n) {
        e = void 0;
        continue;
    }
    i += ".";
} while (t.length); return e; }
function dt(e, i, t) { let n = i.split("."), r = e; for (let s = 0; s < n.length; s++) {
    let a = n[s];
    s === n.length - 1 ? r[a] = t : r = r[a] && c(r[a]) ? r[a] : {};
} }
function rt(e, i, t) { return R(e, at(i, t)); }
function at(e, i) { return e.split(".").reduceRight((t, n) => ({ [n]: t }), i); }
var C = class {
}, q = (() => { class e extends C {
    templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
    interpolate(t, n) { if (w(t))
        return this.interpolateString(t, n); if (nt(t))
        return this.interpolateFunction(t, n); }
    interpolateFunction(t, n) { return t(n); }
    interpolateString(t, n) { return n ? t.replace(this.templateMatcher, (r, s) => { let a = this.getInterpolationReplacement(n, s); return a !== void 0 ? a : r; }) : t; }
    getInterpolationReplacement(t, n) { return this.formatValue($(t, n)); }
    formatValue(t) { if (w(t))
        return t; if (typeof t == "number" || typeof t == "boolean")
        return t.toString(); if (t === null)
        return "null"; if (f(t))
        return t.join(", "); if (v(t))
        return typeof t.toString == "function" && t.toString !== Object.prototype.toString ? t.toString() : JSON.stringify(t); }
    static \u0275fac = (() => { let t; return function (r) { return (t || (t = o.\u0275\u0275getInheritedFactory(e)))(r || e); }; })();
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })(), P = (() => { class e {
    _onTranslationChange = new O;
    _onLangChange = new O;
    _onFallbackLangChange = new O;
    fallbackLang = null;
    currentLang;
    translations = {};
    languages = [];
    getTranslations(t) { return this.translations[t]; }
    setTranslations(t, n, r) { this.translations[t] = r && this.hasTranslationFor(t) ? R(this.translations[t], n) : n, this.addLanguages([t]), this._onTranslationChange.next({ lang: t, translations: this.getTranslations(t) }); }
    getLanguages() { return this.languages; }
    getCurrentLang() { return this.currentLang; }
    getFallbackLang() { return this.fallbackLang; }
    setFallbackLang(t, n = !0) { this.fallbackLang = t, n && this._onFallbackLangChange.next({ lang: t, translations: this.translations[t] }); }
    setCurrentLang(t, n = !0) { this.currentLang = t, n && this._onLangChange.next({ lang: t, translations: this.translations[t] }); }
    get onTranslationChange() { return this._onTranslationChange.asObservable(); }
    get onLangChange() { return this._onLangChange.asObservable(); }
    get onFallbackLangChange() { return this._onFallbackLangChange.asObservable(); }
    addLanguages(t) { this.languages = Array.from(new Set([...this.languages, ...t])); }
    hasTranslationFor(t) { return typeof this.translations[t] < "u"; }
    deleteTranslations(t) { delete this.translations[t]; }
    getTranslation(t) { let n = this.getValue(this.currentLang, t); return n === void 0 && this.fallbackLang != null && this.fallbackLang !== this.currentLang && (n = this.getValue(this.fallbackLang, t)), n; }
    getValue(t, n) { return $(this.getTranslations(t), n); }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })(), A = new X("TRANSLATE_CONFIG"), T = e => g(e) ? e : S(e), B = class {
}, x = (() => { class e {
    loadingTranslations;
    pending = !1;
    _translationRequests = {};
    lastUseLanguage = null;
    currentLoader = h(L);
    compiler = h(b);
    parser = h(C);
    missingTranslationHandler = h(F);
    store = h(P);
    extend = !1;
    get onTranslationChange() { return this.store.onTranslationChange; }
    get onLangChange() { return this.store.onLangChange; }
    get onFallbackLangChange() { return this.store.onFallbackLangChange; }
    get onDefaultLangChange() { return this.store.onFallbackLangChange; }
    constructor() { let t = p({ extend: !1, fallbackLang: null }, h(A, { optional: !0 })); t.lang && this.use(t.lang), t.fallbackLang && this.setFallbackLang(t.fallbackLang), t.extend && (this.extend = !0); }
    setFallbackLang(t) { this.getFallbackLang() || this.store.setFallbackLang(t, !1); let n = this.loadOrExtendLanguage(t); return g(n) ? (n.pipe(k(1)).subscribe({ next: () => { this.store.setFallbackLang(t); }, error: () => { } }), n) : (this.store.setFallbackLang(t), S(this.store.getTranslations(t))); }
    use(t) { this.lastUseLanguage = t, this.getCurrentLang() || this.store.setCurrentLang(t, !1); let n = this.loadOrExtendLanguage(t); return g(n) ? (n.pipe(k(1)).subscribe({ next: () => { this.changeLang(t); }, error: () => { } }), n) : (this.changeLang(t), S(this.store.getTranslations(t))); }
    loadOrExtendLanguage(t) { if (!this.store.hasTranslationFor(t) || this.extend)
        return this._translationRequests[t] = this._translationRequests[t] || this.loadAndCompileTranslations(t), this._translationRequests[t]; }
    changeLang(t) { t === this.lastUseLanguage && this.store.setCurrentLang(t); }
    getCurrentLang() { return this.store.getCurrentLang(); }
    loadAndCompileTranslations(t) { this.pending = !0; let n = this.currentLoader.getTranslation(t).pipe(V(1), k(1)); return this.loadingTranslations = n.pipe(E(r => this.compiler.compileTranslations(r, t)), V(1), k(1)), this.loadingTranslations.subscribe({ next: r => { this.store.setTranslations(t, r, this.extend), this.pending = !1; }, error: r => { this.pending = !1; } }), n; }
    setTranslation(t, n, r = !1) { let s = this.compiler.compileTranslations(n, t); this.store.setTranslations(t, s, r || this.extend); }
    getLangs() { return this.store.getLanguages(); }
    addLangs(t) { this.store.addLanguages(t); }
    getParsedResultForKey(t, n) { let r = this.getTextToInterpolate(t); if (u(r))
        return this.runInterpolation(r, n); let s = this.missingTranslationHandler.handle(p({ key: t, translateService: this }, n !== void 0 && { interpolateParams: n })); return s !== void 0 ? s : t; }
    getFallbackLang() { return this.store.getFallbackLang(); }
    getTextToInterpolate(t) { return this.store.getTranslation(t); }
    runInterpolation(t, n) { if (u(t))
        return f(t) ? this.runInterpolationOnArray(t, n) : c(t) ? this.runInterpolationOnDict(t, n) : this.parser.interpolate(t, n); }
    runInterpolationOnArray(t, n) { return t.map(r => this.runInterpolation(r, n)); }
    runInterpolationOnDict(t, n) { let r = {}; for (let s in t) {
        let a = this.runInterpolation(t[s], n);
        a !== void 0 && (r[s] = a);
    } return r; }
    getParsedResult(t, n) { return t instanceof Array ? this.getParsedResultForArray(t, n) : this.getParsedResultForKey(t, n); }
    getParsedResultForArray(t, n) { let r = {}, s = !1; for (let l of t)
        r[l] = this.getParsedResultForKey(l, n), s = s || g(r[l]); if (!s)
        return r; let a = t.map(l => T(r[l])); return tt(a).pipe(E(l => { let d = {}; return l.forEach((m, Q) => { d[t[Q]] = m; }), d; })); }
    get(t, n) { if (!u(t) || !t.length)
        throw new Error('Parameter "key" is required and cannot be empty'); return this.pending ? this.loadingTranslations.pipe(et(() => T(this.getParsedResult(t, n)))) : T(this.getParsedResult(t, n)); }
    getStreamOnTranslationChange(t, n) { if (!u(t) || !t.length)
        throw new Error('Parameter "key" is required and cannot be empty'); return j(M(() => this.get(t, n)), this.onTranslationChange.pipe(N(() => { let r = this.getParsedResult(t, n); return T(r); }))); }
    stream(t, n) { if (!u(t) || !t.length)
        throw new Error('Parameter "key" required'); return j(M(() => this.get(t, n)), this.onLangChange.pipe(N(() => { let r = this.getParsedResult(t, n); return T(r); }))); }
    instant(t, n) { if (!u(t) || t.length === 0)
        throw new Error('Parameter "key" is required and cannot be empty'); let r = this.getParsedResult(t, n); return g(r) ? Array.isArray(t) ? t.reduce((s, a) => (s[a] = a, s), {}) : t : r; }
    set(t, n, r = this.getCurrentLang()) { this.store.setTranslations(r, rt(this.store.getTranslations(r), t, w(n) ? this.compiler.compile(n, r) : this.compiler.compileTranslations(n, r)), !1); }
    reloadLang(t) { return this.resetLang(t), this.loadAndCompileTranslations(t); }
    resetLang(t) { delete this._translationRequests[t], this.store.deleteTranslations(t); }
    static getBrowserLang() { if (typeof window > "u" || !window.navigator)
        return; let t = this.getBrowserCultureLang(); return t ? t.split(/[-_]/)[0] : void 0; }
    static getBrowserCultureLang() { if (!(typeof window > "u" || typeof window.navigator > "u"))
        return window.navigator.languages ? window.navigator.languages[0] : window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage; }
    getBrowserLang() { return e.getBrowserLang(); }
    getBrowserCultureLang() { return e.getBrowserCultureLang(); }
    get defaultLang() { return this.getFallbackLang(); }
    get currentLang() { return this.store.getCurrentLang(); }
    get langs() { return this.store.getLanguages(); }
    setDefaultLang(t) { return this.setFallbackLang(t); }
    getDefaultLang() { return this.getFallbackLang(); }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })(), pt = (() => { class e {
    translateService = h(x);
    element = h(Y);
    _ref = h(H);
    key;
    lastParams;
    currentParams;
    onLangChangeSub;
    onFallbackLangChangeSub;
    onTranslationChangeSub;
    set translate(t) { t && (this.key = t, this.checkNodes()); }
    set translateParams(t) { y(this.currentParams, t) || (this.currentParams = t, this.checkNodes(!0)); }
    constructor() { this.onTranslationChangeSub || (this.onTranslationChangeSub = this.translateService.onTranslationChange.subscribe(t => { t.lang === this.translateService.currentLang && this.checkNodes(!0, t.translations); })), this.onLangChangeSub || (this.onLangChangeSub = this.translateService.onLangChange.subscribe(t => { this.checkNodes(!0, t.translations); })), this.onFallbackLangChangeSub || (this.onFallbackLangChangeSub = this.translateService.onFallbackLangChange.subscribe(t => { this.checkNodes(!0); })); }
    ngAfterViewChecked() { this.checkNodes(); }
    checkNodes(t = !1, n) { let r = this.element.nativeElement.childNodes; r.length || (this.setContent(this.element.nativeElement, this.key), r = this.element.nativeElement.childNodes), r.forEach(s => { let a = s; if (a.nodeType === 3) {
        let l;
        if (t && (a.lastKey = null), u(a.lookupKey))
            l = a.lookupKey;
        else if (this.key)
            l = this.key;
        else {
            let d = this.getContent(a), m = d.trim();
            m.length && (a.lookupKey = m, d !== a.currentValue ? (l = m, a.originalContent = d || a.originalContent) : a.originalContent && (l = a.originalContent.trim()));
        }
        this.updateValue(l, a, n);
    } }); }
    updateValue(t, n, r) { if (t) {
        if (n.lastKey === t && this.lastParams === this.currentParams)
            return;
        this.lastParams = this.currentParams;
        let s = a => { (a !== t || !n.lastKey) && (n.lastKey = t), n.originalContent || (n.originalContent = this.getContent(n)), w(a) ? n.currentValue = a : u(a) ? n.currentValue = JSON.stringify(a) : n.currentValue = n.originalContent || t, this.setContent(n, this.key ? n.currentValue : n.originalContent.replace(t, n.currentValue)), this._ref.markForCheck(); };
        if (u(r)) {
            let a = this.translateService.getParsedResult(t, this.currentParams);
            g(a) ? a.subscribe({ next: s }) : s(a);
        }
        else
            this.translateService.get(t, this.currentParams).subscribe(s);
    } }
    getContent(t) { return u(t.textContent) ? t.textContent : t.data; }
    setContent(t, n) { u(t.textContent) ? t.textContent = n : t.data = n; }
    ngOnDestroy() { this.onLangChangeSub && this.onLangChangeSub.unsubscribe(), this.onFallbackLangChangeSub && this.onFallbackLangChangeSub.unsubscribe(), this.onTranslationChangeSub && this.onTranslationChangeSub.unsubscribe(); }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275dir = o.\u0275\u0275defineDirective({ type: e, selectors: [["", "translate", ""], ["", "ngx-translate", ""]], inputs: { translate: "translate", translateParams: "translateParams" } });
} return e; })(), bt = (() => { class e {
    translate = h(x);
    _ref = h(H);
    value = "";
    lastKey = null;
    lastParams = [];
    onTranslationChange;
    onLangChange;
    onFallbackLangChange;
    updateValue(t, n, r) { let s = a => { this.value = a !== void 0 ? a : t, this.lastKey = t, this._ref.markForCheck(); }; if (r) {
        let a = this.translate.getParsedResult(t, n);
        g(a) ? a.subscribe(s) : s(a);
    } this.translate.get(t, n).subscribe(s); }
    transform(t, ...n) { if (!t || !t.length)
        return t; if (y(t, this.lastKey) && y(n, this.lastParams))
        return this.value; let r; if (u(n[0]) && n.length)
        if (w(n[0]) && n[0].length) {
            let s = n[0].replace(/(')?([a-zA-Z0-9_]+)(')?(\s)?:/g, '"$2":').replace(/:(\s)?(')(.*?)(')/g, ':"$3"');
            try {
                r = JSON.parse(s);
            }
            catch (a) {
                throw new SyntaxError(`Wrong parameter in TranslatePipe. Expected a valid Object, received: ${n[0]}`);
            }
        }
        else
            c(n[0]) && (r = n[0]); return this.lastKey = t, this.lastParams = n, this.updateValue(t, r), this._dispose(), this.onTranslationChange || (this.onTranslationChange = this.translate.onTranslationChange.subscribe(s => { (this.lastKey && s.lang === this.translate.getCurrentLang() || s.lang === this.translate.getFallbackLang()) && (this.lastKey = null, this.updateValue(t, r, s.translations)); })), this.onLangChange || (this.onLangChange = this.translate.onLangChange.subscribe(s => { this.lastKey && (this.lastKey = null, this.updateValue(t, r, s.translations)); })), this.onFallbackLangChange || (this.onFallbackLangChange = this.translate.onFallbackLangChange.subscribe(() => { this.lastKey && (this.lastKey = null, this.updateValue(t, r)); })), this.value; }
    _dispose() { typeof this.onTranslationChange < "u" && (this.onTranslationChange.unsubscribe(), this.onTranslationChange = void 0), typeof this.onLangChange < "u" && (this.onLangChange.unsubscribe(), this.onLangChange = void 0), typeof this.onFallbackLangChange < "u" && (this.onFallbackLangChange.unsubscribe(), this.onFallbackLangChange = void 0); }
    ngOnDestroy() { this._dispose(); }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275pipe = o.\u0275\u0275definePipe({ name: "translate", type: e, pure: !1 });
    static \u0275prov = o.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })();
function G(e) { return { provide: L, useClass: e }; }
function z(e) { return { provide: b, useClass: e }; }
function W(e) { return { provide: C, useClass: e }; }
function Z(e) { return { provide: F, useClass: e }; }
function Lt(e = {}) { return I(p({ compiler: z(J), parser: W(q), loader: G(U), missingTranslationHandler: Z(_) }, e), !0); }
function Ct(e = {}) { return I(p({ extend: !0 }, e), !1); }
function I(e = {}, i) { let t = []; e.loader && t.push(e.loader), e.compiler && t.push(e.compiler), e.parser && t.push(e.parser), e.missingTranslationHandler && t.push(e.missingTranslationHandler), i && t.push(P), (e.useDefaultLang || e.defaultLanguage) && (console.warn("The `useDefaultLang` and `defaultLanguage` options are deprecated. Please use `fallbackLang` instead."), e.useDefaultLang === !0 && e.defaultLanguage && (e.fallbackLang = e.defaultLanguage)); let n = { fallbackLang: e.fallbackLang ?? null, lang: e.lang, extend: e.extend ?? !1 }; return t.push({ provide: A, useValue: n }), t.push({ provide: x, useClass: x, deps: [P, L, b, C, F, A] }), t; }
var mt = (() => { class e {
    static forRoot(t = {}) { return { ngModule: e, providers: [...I(p({ compiler: z(J), parser: W(q), loader: G(U), missingTranslationHandler: Z(_) }, t), !0)] }; }
    static forChild(t = {}) { return { ngModule: e, providers: [...I(t, t.isolate ?? !1)] }; }
    static \u0275fac = function (n) { return new (n || e); };
    static \u0275mod = o.\u0275\u0275defineNgModule({ type: e });
    static \u0275inj = o.\u0275\u0275defineInjector({});
} return e; })();
export { _ as DefaultMissingTranslationHandler, B as ITranslateService, F as MissingTranslationHandler, A as TRANSLATE_SERVICE_CONFIG, b as TranslateCompiler, q as TranslateDefaultParser, pt as TranslateDirective, L as TranslateLoader, mt as TranslateModule, J as TranslateNoOpCompiler, U as TranslateNoOpLoader, C as TranslateParser, bt as TranslatePipe, x as TranslateService, P as TranslateStore, ft as _, I as defaultProviders, y as equals, $ as getValue, rt as insertValue, f as isArray, K as isDefined, u as isDefinedAndNotNull, c as isDict, nt as isFunction, v as isObject, w as isString, R as mergeDeep, Ct as provideChildTranslateService, Z as provideMissingTranslationHandler, z as provideTranslateCompiler, G as provideTranslateLoader, W as provideTranslateParser, Lt as provideTranslateService, dt as setValue };
