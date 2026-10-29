if (typeof globalThis.ngServerMode === 'undefined') globalThis.ngServerMode = typeof window === 'undefined';
var t=[void 0];function c(){return t[0]}function i(n){let r=t[0];return t[0]=n,r}function s(n,r){let e=c();if(!e)throw new Error("Current injector is not set.");if(!n.\u0275prov)throw new Error("Token is not an injectable");return e.retrieve(n,r)}var u=Symbol("NotFound"),o=class extends Error{name="\u0275NotFound";constructor(r){super(r)}};function f(n){return n===u||n?.name==="\u0275NotFound"}export{c as a,i as b,s as c,u as d,o as e,f};
/*! Bundled license information:

@angular/core/fesm2022/_not_found-chunk.mjs:
  (**
   * @license Angular v22.2.3
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
