import{a as o}from"@nf-internal/chunk-DDDW7KJV";var n;(function(e){e.Unimplemented="UNIMPLEMENTED",e.Unavailable="UNAVAILABLE"})(n||(n={}));var t;(function(e){e.Body="body",e.Ionic="ionic",e.Native="native",e.None="none"})(t||(t={}));var a={getEngine(){let e=o();if(e?.isPluginAvailable("Keyboard"))return e.Plugins.Keyboard},getResizeMode(){let e=this.getEngine();return e?.getResizeMode?e.getResizeMode().catch(i=>{if(i.code!==n.Unimplemented)throw i}):Promise.resolve(void 0)}};export{t as a,a as b};
/*! Bundled license information:

@ionic/core/dist/esm/keyboard-CUw4ekVy.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
