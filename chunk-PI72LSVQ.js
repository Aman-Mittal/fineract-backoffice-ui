import{a}from"@nf-internal/chunk-DDDW7KJV";var c;(function(n){n.Heavy="HEAVY",n.Medium="MEDIUM",n.Light="LIGHT"})(c||(c={}));var s;(function(n){n.Success="SUCCESS",n.Warning="WARNING",n.Error="ERROR"})(s||(s={}));var e={getEngine(){let n=a();if(n?.isPluginAvailable("Haptics"))return n.Plugins.Haptics},available(){if(!this.getEngine())return!1;let t=a();return t?.getPlatform()==="web"?typeof navigator<"u"&&navigator.vibrate!==void 0:!0},impact(n){let t=this.getEngine();t&&t.impact({style:n.style})},notification(n){let t=this.getEngine();t&&t.notification({type:n.type})},selection(){this.impact({style:c.Light})},selectionStart(){let n=this.getEngine();n&&n.selectionStart()},selectionChanged(){let n=this.getEngine();n&&n.selectionChanged()},selectionEnd(){let n=this.getEngine();n&&n.selectionEnd()}},i=()=>e.available(),r=()=>{i()&&e.selection()},g=()=>{i()&&e.selectionStart()},l=()=>{i()&&e.selectionChanged()},u=()=>{i()&&e.selectionEnd()},d=n=>{i()&&e.impact(n)};export{c as a,r as b,g as c,l as d,u as e,d as f};
/*! Bundled license information:

@ionic/core/dist/esm/haptic-DzAMWJuk.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
