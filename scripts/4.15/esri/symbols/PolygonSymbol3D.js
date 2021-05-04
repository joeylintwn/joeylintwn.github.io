// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/Collection ../core/Error ../core/lang ../core/maybe ../core/accessorSupport/decorators ./ExtrudeSymbol3DLayer ./FillSymbol3DLayer ./IconSymbol3DLayer ./LineSymbol3DLayer ./ObjectSymbol3DLayer ./Symbol3D ./TextSymbol3DLayer ./WaterSymbol3DLayer".split(" "),function(A,B,t,g,c,u,h,v,e,l,k,m,n,p,w,x,q){var y=c.ofType({base:null,key:"type",typeMap:{extrude:l,fill:k,icon:m,line:n,object:p,text:x,water:q}}),
z=c.ofType({base:null,key:"type",typeMap:{extrude:l,fill:k,icon:m,line:n,object:p,water:q}});return function(c){function b(a){a=c.call(this,a)||this;a.type="polygon-3d";return a}t(b,c);f=b;b.prototype.writeSymbolLayers=function(a,b,c,d){var r=a.filter(function(a){return"text"!==a.type});d&&d.messages&&r.length<a.length&&(a=a.find(function(a){return"text"===a.type}),d.messages.push(new u("symbol-layer:unsupported","Symbol layers of type 'text' cannot be persisted in PolygonSymbol3D",{symbolLayer:a})));
b[c]=r.map(function(a){return a.write({},d)}).toArray()};b.prototype.clone=function(){return new f({styleOrigin:h.clone(this.styleOrigin),symbolLayers:h.clone(this.symbolLayers),thumbnail:h.clone(this.thumbnail)})};b.fromJSON=function(a){var b=new f;b.read(a);if(2===b.symbolLayers.length&&"fill"===b.symbolLayers.getItemAt(0).type&&"line"===b.symbolLayers.getItemAt(1).type){var c=b.symbolLayers.getItemAt(0),d=b.symbolLayers.getItemAt(1);!d.enabled||a.symbolLayers&&a.symbolLayers[1]&&!1===a.symbolLayers[1].enable||
(c.outline={size:d.size,color:v.isSome(d.material)?d.material.color:null});b.symbolLayers.removeAt(1)}return b};b.fromSimpleFillSymbol=function(a){return new f({symbolLayers:[k.fromSimpleFillSymbol(a)]})};var f;g([e.property({type:y,json:{type:z}})],b.prototype,"symbolLayers",void 0);g([e.writer("web-scene","symbolLayers")],b.prototype,"writeSymbolLayers",null);g([e.enumeration.serializable()({PolygonSymbol3D:"polygon-3d"})],b.prototype,"type",void 0);return b=f=g([e.subclass("esri.symbols.PolygonSymbol3D")],
b)}(e.declared(w))});