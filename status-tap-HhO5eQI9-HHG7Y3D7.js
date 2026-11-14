if (typeof globalThis.ngServerMode === 'undefined') globalThis.ngServerMode = typeof window === 'undefined';
import{f as r,i}from"@nf-internal/chunk-Z566QIT4";import{b as s}from"@nf-internal/chunk-ZXGUCQ42";import"@nf-internal/chunk-WNPQ27XR";import{j as a,k as m}from"@nf-internal/chunk-KZE7F3YI";import{e as n}from"@nf-internal/chunk-GMSR7DWL";var y=()=>{let o=window;o.addEventListener("statusTap",()=>{a(()=>{let c=o.innerWidth,d=o.innerHeight,e=document.elementFromPoint(c/2,d/2);if(!e)return;let t=r(e);t&&new Promise(p=>s(t,p)).then(()=>{m(()=>n(null,null,function*(){t.style.setProperty("--overflow","hidden"),yield i(t,300),t.style.removeProperty("--overflow")}))})})})};export{y as startStatusTap};
/*! Bundled license information:

@ionic/core/dist/esm/status-tap-HhO5eQI9.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
