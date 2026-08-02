import { a as r } from "@nf-internal/chunk-IQO3VMP7";
import { HttpClient as o, HttpBackend as a } from "@angular/common/http";
import * as c from "@angular/core";
import { InjectionToken as p, inject as n } from "@angular/core";
import { TranslateLoader as d } from "@ngx-translate/core";
var i = new p("TRANSLATE_HTTP_LOADER_CONFIG"), u = (() => { class e {
    http;
    config;
    constructor() { this.config = r({ prefix: "/assets/i18n/", suffix: ".json", enforceLoading: !1, useHttpBackend: !1 }, n(i)), this.http = this.config.useHttpBackend ? new o(n(a)) : n(o); }
    getTranslation(s) { let t = this.config.enforceLoading ? `?enforceLoading=${Date.now()}` : ""; return this.http.get(`${this.config.prefix}${s}${this.config.suffix}${t}`); }
    static \u0275fac = function (t) { return new (t || e); };
    static \u0275prov = c.\u0275\u0275defineInjectable({ token: e, factory: e.\u0275fac });
} return e; })();
function L(e = {}) { let f = e.useHttpBackend ?? !1; return [{ provide: i, useValue: e }, { provide: d, useClass: u, deps: [f ? a : o, i] }]; }
export { i as TRANSLATE_HTTP_LOADER_CONFIG, u as TranslateHttpLoader, L as provideTranslateHttpLoader };
