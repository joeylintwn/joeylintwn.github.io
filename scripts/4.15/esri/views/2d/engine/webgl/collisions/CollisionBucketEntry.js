// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../../../core/libs/gl-matrix-2/vec2"],function(p,k,l){Object.defineProperty(k,"__esModule",{value:!0});p=function(){function b(){this._reference=null}Object.defineProperty(b.prototype,"dirty",{get:function(){return this.reference&&this.reference.isDirty},set:function(d){this.reference&&this.reference.hasData&&(d||this.reference.isDirty)&&(this.reference.isDirty=d)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"index",{get:function(){return this._reference&&
this._reference.labelIndex},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"reference",{get:function(){return this._reference},set:function(d){this._reference=d},enumerable:!0,configurable:!0});b.prototype.reset=function(d,g,b){d=d.state;var p=b.layerView.tileRenderer,h=this.reference;if(!h||!h.hasData)return!1;g&&(h.isDirty=!0);g=h.transforms.labelMat2d;for(var k=g[4],u=g[5],q=0,v=h.displayObjects;q<v.length;q++)for(var m=v[q],r=p.featuresView.attributeView,r=b.hasVV()?r.getVVSize(m.id):
0,t=0,m=m.metrics;t<m.length;t++){var c=m[t];b.hasVV()&&c.computeVVOffset(r,b.vvEval);var n=c.bounds.center,a=c.bounds.centerT;h.isDirty&&(c.minZoom=-1);var e=l.vec2.copy(a,c.anchor);d.rotation?l.vec2.transformMat2d(e,e,g):(a[0]=e[0]+k,a[1]=e[1]+u);l.vec2.add(a,e,n);a[0]+=c.offsetX;a[1]+=c.offsetY;if(c.boxes)for(n=0,a=c.boxes;n<a.length;n++){var e=a[n],f=e.centerT;l.vec2.add(f,c.anchor,e.center);d.rotation?l.vec2.transformMat2d(f,f,g):(f[0]+=k,f[1]+=u)}}return!0};return b}();k.default=p});