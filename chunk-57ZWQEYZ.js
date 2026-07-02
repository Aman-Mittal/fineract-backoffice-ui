import{b as V,c as Ie}from"./chunk-SQPUV6TU.js";import{a as Ae,b as ke,c as Re,d as Be,f as Fe,g as Le,i as je,j as ze,l as Ne,m as Ve,o as Ke,p as $e,q as Qe,r as qe}from"./chunk-6ZL2MKM3.js";import{b as Pe,c as He}from"./chunk-XD2TCZVW.js";import{a as we}from"./chunk-M2VLAFPL.js";import{a as ve,d as De,g as xe}from"./chunk-A4IK5XSQ.js";import{a as T}from"./chunk-7522MUSK.js";import{a as x}from"./chunk-I7SHAYLX.js";import{a as Je,b as Xe}from"./chunk-EC7GARYE.js";import{a as w,b as E}from"./chunk-T76LAP2A.js";import{a as Ye,b as Ue,c as We,f as Ze,g as Ge}from"./chunk-HJRHKHA3.js";import{b as Ee,c as Oe}from"./chunk-WDMJJGRC.js";import{d as Te}from"./chunk-RD72EWTU.js";import{c as z,d as N}from"./chunk-QDOHDYXD.js";import{J as Ce,L as be,ca as Se,ea as ye,h as _e,pa as Me}from"./chunk-7CSDADT4.js";import{$ as X,$b as pe,Ba as ie,Bb as b,Bc as u,Cb as S,Cc as f,Db as y,E as Z,Gb as oe,H as G,Hb as se,Ib as c,Jb as o,Kb as s,Lb as M,Mb as B,Nb as O,Ob as le,Pb as ce,Qb as de,Rb as me,Rc as ge,Sb as q,Uc as I,Wb as _,Xa as r,Yb as d,Z as J,Zb as F,_b as v,ac as he,ba as h,bb as ne,bc as L,cc as j,e as H,eb as ae,g as U,ha as $,ia as Q,ic as Y,ja as ee,kb as C,kc as p,lb as re,lc as ue,mb as k,mc as D,pa as g,qb as R,ua as te,ya as A,yc as fe,z as W}from"./chunk-3KLCUQMO.js";var it=(()=>{class t{helpTextKey;static \u0275fac=function(n){return new(n||t)};static \u0275cmp=C({type:t,selectors:[["app-help-icon"]],inputs:{helpTextKey:"helpTextKey"},decls:4,vars:6,consts:[["matTooltipPosition","above","aria-hidden","false",1,"help-icon",3,"matTooltip"]],template:function(n,i){n&1&&(o(0,"mat-icon",0),u(1,"translate"),u(2,"translate"),p(3," help_outline "),s()),n&2&&(c("matTooltip",f(1,2,i.helpTextKey)),b("aria-label",f(2,4,"COMMON.HELP")))},dependencies:[E,w,T,x,N,z],styles:[".help-icon[_ngcontent-%COMP%]{font-size:18px;height:18px;width:18px;color:#757575;cursor:help;vertical-align:middle;margin-left:8px}.help-icon[_ngcontent-%COMP%]:hover{color:#1976d2}"]})}return t})();var nt=(()=>{class t{columnName;template=h(ne);static \u0275fac=function(n){return new(n||t)};static \u0275dir=k({type:t,selectors:[["","appCellTemplate",""]],inputs:{columnName:[0,"appCellTemplate","columnName"]}})}return t})();var ct=["mat-sort-header",""],dt=["*",[["","matSortHeaderIcon",""]]],mt=["*","[matSortHeaderIcon]"];function pt(t,l){t&1&&(ee(),B(0,"svg",3),le(1,"path",4),O())}function ht(t,l){t&1&&(B(0,"div",2),v(1,1,null,pt,2,0),O())}var at=new X("MAT_SORT_DEFAULT_OPTIONS"),P=(()=>{class t{_defaultOptions;_initializedStream=new U(1);sortables=new Map;_stateChanges=new H;active;start="asc";get direction(){return this._direction}set direction(e){this._direction=e}_direction="";disableClear;disabled=!1;sortChange=new g;initialized=this._initializedStream;constructor(e){this._defaultOptions=e}register(e){this.sortables.set(e.id,e)}deregister(e){this.sortables.delete(e.id)}sort(e){this.active!=e.id?(this.active=e.id,this.direction=e.start?e.start:this.start):this.direction=this.getNextSortDirection(e),this.sortChange.emit({active:this.active,direction:this.direction})}getNextSortDirection(e){if(!e)return"";let n=e?.disableClear??this.disableClear??!!this._defaultOptions?.disableClear,i=ut(e.start||this.start,n),a=i.indexOf(this.direction)+1;return a>=i.length&&(a=0),i[a]}ngOnInit(){this._initializedStream.next()}ngOnChanges(){this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete(),this._initializedStream.complete()}static \u0275fac=function(n){return new(n||t)(ae(at,8))};static \u0275dir=k({type:t,selectors:[["","matSort",""]],hostAttrs:[1,"mat-sort"],inputs:{active:[0,"matSortActive","active"],start:[0,"matSortStart","start"],direction:[0,"matSortDirection","direction"],disableClear:[2,"matSortDisableClear","disableClear",I],disabled:[2,"matSortDisabled","disabled",I]},outputs:{sortChange:"matSortChange"},exportAs:["matSort"],features:[A]})}return t})();function ut(t,l){let e=["asc","desc"];return t=="desc"&&e.reverse(),l||e.push(""),e}var rt=(()=>{class t{_sort=h(P,{optional:!0});_columnDef=h(Ae,{optional:!0});_changeDetectorRef=h(ge);_focusMonitor=h(Ce);_elementRef=h(ie);_ariaDescriber=h(Se,{optional:!0});_renderChanges;_animationsDisabled=Me();_recentlyCleared=te(null);_sortButton;id;arrowPosition="after";start;disabled=!1;get sortActionDescription(){return this._sortActionDescription}set sortActionDescription(e){this._updateSortActionDescription(e)}_sortActionDescription="Sort";disableClear;constructor(){h(be).load(Te);let e=h(at,{optional:!0});this._sort,e?.arrowPosition&&(this.arrowPosition=e?.arrowPosition)}ngOnInit(){!this.id&&this._columnDef&&(this.id=this._columnDef.name),this._sort.register(this),this._renderChanges=W(this._sort._stateChanges,this._sort.sortChange).subscribe(()=>this._changeDetectorRef.markForCheck()),this._sortButton=this._elementRef.nativeElement.querySelector(".mat-sort-header-container"),this._updateSortActionDescription(this._sortActionDescription)}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(()=>{Promise.resolve().then(()=>this._recentlyCleared.set(null))})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._sort.deregister(this),this._renderChanges?.unsubscribe(),this._sortButton&&this._ariaDescriber?.removeDescription(this._sortButton,this._sortActionDescription)}_toggleOnInteraction(){if(!this._isDisabled()){let e=this._isSorted(),n=this._sort.direction;this._sort.sort(this),this._recentlyCleared.set(e&&!this._isSorted()?n:null)}}_handleKeydown(e){(e.keyCode===32||e.keyCode===13)&&(e.preventDefault(),this._toggleOnInteraction())}_isSorted(){return this._sort.active==this.id&&(this._sort.direction==="asc"||this._sort.direction==="desc")}_isDisabled(){return this._sort.disabled||this.disabled}_getAriaSortAttribute(){return this._isSorted()?this._sort.direction=="asc"?"ascending":"descending":"none"}_renderArrow(){return!this._isDisabled()||this._isSorted()}_updateSortActionDescription(e){this._sortButton&&(this._ariaDescriber?.removeDescription(this._sortButton,this._sortActionDescription),this._ariaDescriber?.describe(this._sortButton,e)),this._sortActionDescription=e}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=C({type:t,selectors:[["","mat-sort-header",""]],hostAttrs:[1,"mat-sort-header"],hostVars:3,hostBindings:function(n,i){n&1&&_("click",function(){return i._toggleOnInteraction()})("keydown",function(m){return i._handleKeydown(m)})("mouseleave",function(){return i._recentlyCleared.set(null)}),n&2&&(b("aria-sort",i._getAriaSortAttribute()),Y("mat-sort-header-disabled",i._isDisabled()))},inputs:{id:[0,"mat-sort-header","id"],arrowPosition:"arrowPosition",start:"start",disabled:[2,"disabled","disabled",I],sortActionDescription:"sortActionDescription",disableClear:[2,"disableClear","disableClear",I]},exportAs:["matSortHeader"],attrs:ct,ngContentSelectors:mt,decls:4,vars:17,consts:[[1,"mat-sort-header-container","mat-focus-indicator"],[1,"mat-sort-header-content"],[1,"mat-sort-header-arrow"],["viewBox","0 -960 960 960","focusable","false","aria-hidden","true"],["d","M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"]],template:function(n,i){n&1&&(F(dt),B(0,"div",0)(1,"div",1),v(2),O(),S(3,ht,3,0,"div",2),O()),n&2&&(Y("mat-sort-header-sorted",i._isSorted())("mat-sort-header-position-before",i.arrowPosition==="before")("mat-sort-header-descending",i._sort.direction==="desc")("mat-sort-header-ascending",i._sort.direction==="asc")("mat-sort-header-recently-cleared-ascending",i._recentlyCleared()==="asc")("mat-sort-header-recently-cleared-descending",i._recentlyCleared()==="desc")("mat-sort-header-animations-disabled",i._animationsDisabled),b("tabindex",i._isDisabled()?null:0)("role",i._isDisabled()?null:"button"),r(3),y(i._renderArrow()?3:-1))},styles:[`.mat-sort-header {
  cursor: pointer;
}

.mat-sort-header-disabled {
  cursor: default;
}

.mat-sort-header-container {
  display: flex;
  align-items: center;
  letter-spacing: normal;
  outline: 0;
}
[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container, [mat-sort-header].cdk-program-focused .mat-sort-header-container {
  border-bottom: solid 1px currentColor;
}
.mat-sort-header-container::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-sort-header-content {
  display: flex;
  align-items: center;
}

.mat-sort-header-position-before {
  flex-direction: row-reverse;
}

@keyframes _mat-sort-header-recently-cleared-ascending {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-25%);
    opacity: 0;
  }
}
@keyframes _mat-sort-header-recently-cleared-descending {
  from {
    transform: translateY(0) rotate(180deg);
    opacity: 1;
  }
  to {
    transform: translateY(25%) rotate(180deg);
    opacity: 0;
  }
}
.mat-sort-header-arrow {
  height: 12px;
  width: 12px;
  position: relative;
  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1), opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  overflow: visible;
  color: var(--mat-sort-arrow-color, var(--mat-sys-on-surface));
}
.mat-sort-header.cdk-keyboard-focused .mat-sort-header-arrow, .mat-sort-header.cdk-program-focused .mat-sort-header-arrow, .mat-sort-header:hover .mat-sort-header-arrow {
  opacity: 0.54;
}
.mat-sort-header .mat-sort-header-sorted .mat-sort-header-arrow {
  opacity: 1;
}
.mat-sort-header-descending .mat-sort-header-arrow {
  transform: rotate(180deg);
}
.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow {
  transform: translateY(-25%);
}
.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow {
  transition: none;
  animation: _mat-sort-header-recently-cleared-ascending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.mat-sort-header-recently-cleared-descending .mat-sort-header-arrow {
  transition: none;
  animation: _mat-sort-header-recently-cleared-descending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.mat-sort-header-animations-disabled .mat-sort-header-arrow {
  transition-duration: 0ms;
  animation-duration: 0ms;
}
.mat-sort-header-arrow > svg, .mat-sort-header-arrow [matSortHeaderIcon] {
  width: 24px;
  height: 24px;
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -12px 0 0 -12px;
  transform: translateZ(0);
}
.mat-sort-header-arrow, [dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow {
  margin: 0 0 0 6px;
}
.mat-sort-header-position-before .mat-sort-header-arrow, [dir=rtl] .mat-sort-header-arrow {
  margin: 0 6px 0 0;
}
`],encapsulation:2,changeDetection:0})}return t})(),ot=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=re({type:t});static \u0275inj=J({imports:[ye]})}return t})();var st=(()=>{class t{label="Search";placeholder="Search...";tooltipText="Filter list results";searchChange=new g;searchSubject=new H;subscription;ngOnInit(){this.subscription=this.searchSubject.pipe(Z(400),G()).subscribe(e=>{this.searchChange.emit(e)})}onInput(e){let n=e.target.value;this.searchSubject.next(n.trim())}ngOnDestroy(){this.subscription?.unsubscribe()}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=C({type:t,selectors:[["app-search-filter"]],inputs:{label:"label",placeholder:"placeholder",tooltipText:"tooltipText"},outputs:{searchChange:"searchChange"},decls:6,vars:3,consts:[["appearance","outline",1,"search-field",3,"matTooltip"],["matInput","",3,"input","placeholder"],["matSuffix",""]],template:function(n,i){n&1&&(o(0,"mat-form-field",0)(1,"mat-label"),p(2),s(),o(3,"input",1),_("input",function(m){return i.onInput(m)}),s(),o(4,"mat-icon",2),p(5,"search"),s()()),n&2&&(c("matTooltip",i.tooltipText),r(2),ue(i.label),r(),c("placeholder",i.placeholder))},dependencies:[we,xe,ve,De,He,Pe,E,w,T,x],styles:[".search-field[_ngcontent-%COMP%]{width:100%;max-width:400px}"]})}return t})();var gt=[[["","headerActions",""]],[["","filters",""]]],_t=["[headerActions]","[filters]"],Ct=t=>({$implicit:t}),bt=(t,l)=>l.key;function St(t,l){t&1&&(o(0,"div",1),M(1,"mat-spinner",14),s())}function yt(t,l){if(t&1&&M(0,"app-help-icon",2),t&2){let e=d();c("helpTextKey",e.helpTextKey)}}function Mt(t,l){if(t&1){let e=q();o(0,"button",15),_("click",function(){$(e);let i=d();return Q(i.onCreate())}),o(1,"mat-icon"),p(2,"add"),s(),p(3),u(4,"translate"),s()}if(t&2){let e=d();r(3),D(" ",f(4,1,e.createButtonLabel)," ")}}function vt(t,l){if(t&1){let e=q();o(0,"div",6)(1,"app-search-filter",16),u(2,"translate"),u(3,"translate"),_("searchChange",function(i){$(e);let a=d();return Q(a.onSearch(i))}),s(),M(4,"app-help-icon",17),s()}if(t&2){let e=d();r(),c("label",f(2,2,e.searchLabel))("placeholder",f(3,4,e.searchPlaceholder))}}function Dt(t,l){if(t&1&&(o(0,"th",20),p(1),u(2,"translate"),s()),t&2){let e=d().$implicit;c("mat-sort-header",e.key)("disabled",!e.sortable),r(),D(" ",f(2,3,e.label)," ")}}function xt(t,l){t&1&&me(0)}function Tt(t,l){if(t&1&&R(0,xt,1,0,"ng-container",23),t&2){let e=d().$implicit,n=d().$implicit,i=d();c("ngTemplateOutlet",i.columnTemplates[n.key])("ngTemplateOutletContext",fe(2,Ct,e))}}function wt(t,l){if(t&1&&(o(0,"span",22),p(1),s()),t&2){let e=d().$implicit,n=d().$implicit,i=d();c("matTooltip",i.getTooltipText(e,n.key)),r(),D(" ",i.getCellValue(e,n.key)," ")}}function Et(t,l){if(t&1&&(o(0,"td",21),S(1,Tt,1,4,"ng-container")(2,wt,2,2,"span",22),s()),t&2){let e=d().$implicit,n=d();r(),y(n.columnTemplates[e.key]?1:2)}}function Ot(t,l){if(t&1&&(ce(0,9),R(1,Dt,3,5,"th",18)(2,Et,3,1,"td",19),de()),t&2){let e=l.$implicit;c("matColumnDef",e.key)}}function It(t,l){t&1&&M(0,"tr",24)}function Pt(t,l){t&1&&M(0,"tr",25)}function Ht(t,l){if(t&1&&(o(0,"tr",26)(1,"td",27),p(2),u(3,"translate"),s()()),t&2){let e=d();r(),b("colspan",e.displayedColumns.length),r(),D(" ",f(3,2,"COMMON.NO_DATA")," ")}}var Qi=(()=>{class t{title="";helpTextKey="";createButtonLabel="";columns=[];data=[];totalRecords=0;pageSize=10;pageIndex=0;pageSizeOptions=[5,10,25,100];showSearch=!0;searchLabel="COMMON.SEARCH";searchPlaceholder="COMMON.SEARCH_PLACEHOLDER";localLogic=!1;isLoading=!1;create=new g;searchChange=new g;sortChange=new g;pageChange=new g;cellTemplates;paginator;sort;dataSource=new qe([]);columnTemplates={};get displayedColumns(){return this.columns.map(e=>e.key)}ngOnChanges(e){e.data&&(this.dataSource.data=this.data,this.localLogic&&this.paginator&&(this.dataSource.paginator=this.paginator))}ngAfterContentInit(){this.cellTemplates.forEach(e=>{this.columnTemplates[e.columnName]=e.template})}ngAfterViewInit(){this.localLogic&&(this.dataSource.paginator=this.paginator,this.dataSource.sort=this.sort)}onCreate(){this.create.emit()}onSearch(e){this.localLogic&&(this.dataSource.filter=e.trim().toLowerCase(),this.dataSource.paginator&&this.dataSource.paginator.firstPage()),this.searchChange.emit(e)}onSort(e){this.sortChange.emit(e)}onPage(e){this.pageChange.emit(e)}getCellValue(e,n){let i=n.split("."),a=e;for(let m of i){if(a==null)return;a=a[m]}return a&&typeof a=="object"&&"value"in a?a.value:a}getTooltipText(e,n){let i=this.getCellValue(e,n);return i==null?"":String(i)}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=C({type:t,selectors:[["app-data-table"]],contentQueries:function(n,i,a){if(n&1&&pe(a,nt,4),n&2){let m;L(m=j())&&(i.cellTemplates=m)}},viewQuery:function(n,i){if(n&1&&he(V,5)(P,5),n&2){let a;L(a=j())&&(i.paginator=a.first),L(a=j())&&(i.sort=a.first)}},hostVars:1,hostBindings:function(n,i){n&2&&b("title",null)},inputs:{title:"title",helpTextKey:"helpTextKey",createButtonLabel:"createButtonLabel",columns:"columns",data:"data",totalRecords:"totalRecords",pageSize:"pageSize",pageIndex:"pageIndex",pageSizeOptions:"pageSizeOptions",showSearch:"showSearch",searchLabel:"searchLabel",searchPlaceholder:"searchPlaceholder",localLogic:"localLogic",isLoading:"isLoading"},outputs:{create:"create",searchChange:"searchChange",sortChange:"sortChange",pageChange:"pageChange"},features:[A],ngContentSelectors:_t,decls:22,vars:14,consts:[[1,"data-table-card"],[1,"loading-overlay"],[3,"helpTextKey"],[1,"header-actions"],["mat-raised-button","","color","primary"],[1,"table-header"],[1,"search-container"],[1,"table-container"],["mat-table","","matSort","",1,"mat-elevation-z1",3,"matSortChange","dataSource"],[3,"matColumnDef"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["class","mat-row",4,"matNoDataRow"],["aria-label","Select page",3,"page","length","pageSize","pageIndex","pageSizeOptions"],["diameter","40"],["mat-raised-button","","color","primary",3,"click"],[3,"searchChange","label","placeholder"],["helpTextKey","HELP.SEARCH_DESC"],["mat-header-cell","",3,"mat-sort-header","disabled",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["mat-header-cell","",3,"mat-sort-header","disabled"],["mat-cell",""],[1,"truncate-text",3,"matTooltip"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["mat-header-row",""],["mat-row",""],[1,"mat-row"],[1,"mat-cell"]],template:function(n,i){n&1&&(F(gt),o(0,"mat-card",0),S(1,St,2,0,"div",1),o(2,"mat-card-header")(3,"mat-card-title"),p(4),u(5,"translate"),S(6,yt,1,1,"app-help-icon",2),s(),o(7,"div",3),S(8,Mt,5,3,"button",4),v(9),s()(),o(10,"mat-card-content")(11,"div",5),S(12,vt,5,6,"div",6),v(13,1),s(),o(14,"div",7)(15,"table",8),_("matSortChange",function(m){return i.onSort(m)}),oe(16,Ot,3,1,"ng-container",9,bt),R(18,It,1,0,"tr",10)(19,Pt,1,0,"tr",11)(20,Ht,4,4,"tr",12),s(),o(21,"mat-paginator",13),_("page",function(m){return i.onPage(m)}),s()()()()),n&2&&(r(),y(i.isLoading?1:-1),r(3),D(" ",f(5,12,i.title)," "),r(2),y(i.helpTextKey?6:-1),r(2),y(i.createButtonLabel?8:-1),r(4),y(i.showSearch?12:-1),r(3),c("dataSource",i.dataSource),r(),se(i.columns),r(2),c("matHeaderRowDef",i.displayedColumns),r(),c("matRowDefColumns",i.displayedColumns),r(2),c("length",i.totalRecords)("pageSize",i.pageSize)("pageIndex",i.pageIndex)("pageSizeOptions",i.pageSizeOptions))},dependencies:[Qe,ke,Be,ze,Fe,Re,Ne,Le,je,Ve,Ke,$e,Ie,V,ot,P,rt,Ge,Ye,We,Ze,Ue,Oe,Ee,E,w,T,x,Xe,Je,N,it,st,_e,z],styles:[".data-table-card[_ngcontent-%COMP%]{margin:24px;position:relative}mat-card-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}mat-card-title[_ngcontent-%COMP%]{display:flex;align-items:center;margin:0}.header-actions[_ngcontent-%COMP%]{margin-left:auto;display:flex;gap:8px}.table-header[_ngcontent-%COMP%]{display:flex;justify-content:flex-start;align-items:center;gap:16px;margin-bottom:8px}.search-container[_ngcontent-%COMP%]{display:flex;align-items:center}.table-container[_ngcontent-%COMP%]{overflow:auto}table[_ngcontent-%COMP%]{width:100%}.loading-overlay[_ngcontent-%COMP%]{position:absolute;inset:0;background:#fff9;z-index:10;display:flex;align-items:center;justify-content:center;border-radius:12px}.truncate-text[_ngcontent-%COMP%]{display:inline-block;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}"]})}return t})();export{it as a,nt as b,Qi as c};
