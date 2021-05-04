// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/Collection ../../core/JSONSupport ../../core/lang ../../core/accessorSupport/decorators ./SearchLayer".split(" "),function(n,p,g,c,h,k,l,b,m){var e=h.ofType(m);return function(f){function a(a){a=f.call(this,a)||this;a.addressSearchEnabled=!0;a.enabled=!0;a.hintText=null;a.layers=new e;return a}g(a,f);d=a;a.prototype.readAddressSearchEnabled=function(a){return!a};a.prototype.writeAddressSearchEnabled=
function(a,b,c){b[c]=!a};a.prototype.clone=function(){return new d(l.clone({addressSearchEnabled:this.addressSearchEnabled,enabled:this.enabled,hintText:this.hintText,layers:this.layers}))};var d;c([b.property({type:Boolean,json:{read:{source:"disablePlaceFinder"},write:{target:"disablePlaceFinder"},default:!0,origins:{"web-scene":{read:!1,write:!1}}}})],a.prototype,"addressSearchEnabled",void 0);c([b.reader("addressSearchEnabled")],a.prototype,"readAddressSearchEnabled",null);c([b.writer("addressSearchEnabled")],
a.prototype,"writeAddressSearchEnabled",null);c([b.property({type:Boolean,json:{write:!0,default:!0}})],a.prototype,"enabled",void 0);c([b.property({type:String,json:{write:!0}})],a.prototype,"hintText",void 0);c([b.property({type:e,json:{write:{enabled:!0,isRequired:!0}}})],a.prototype,"layers",void 0);return a=d=c([b.subclass("esri.webdoc.applicationProperties.Search")],a)}(b.declared(k.JSONSupport))});