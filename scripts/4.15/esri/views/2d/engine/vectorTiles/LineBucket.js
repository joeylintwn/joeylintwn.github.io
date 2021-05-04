// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ../../../../core/has ../../../../symbols/cim/enums ./Bucket ./style/StyleLayer ../webgl/TurboLine ../webgl/mesh/templates/util".split(" "),function(D,E,w,F,r,x,y,t,u){var v=1/3.8,z=function(b){return function(a){a.entry0=b._lineVertexBuffer.index;b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.prevNormal.x,a.prevNormal.y,0,-1,a.distance,b._ddValues);a.entry2=b._lineVertexBuffer.index;b._lineVertexBuffer.add(a.currentVertex.x,
a.currentVertex.y,-a.prevNormal.x,-a.prevNormal.y,0,1,a.distance,b._ddValues);a.exit0=b._lineVertexBuffer.index;b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.nextNormal.x,a.nextNormal.y,0,-1,a.distance,b._ddValues);a.exit2=b._lineVertexBuffer.index;b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.nextNormal.x,-a.nextNormal.y,0,1,a.distance,b._ddValues)}},A=function(b){return function(a){b._lineIndexBuffer.add(a.leftExit0,a.rightEntry0,a.leftExit2);b._lineIndexBuffer.add(a.rightEntry0,
a.rightEntry2,a.leftExit2)}},B=function(b){return function(a){var e=b._joinType===r.JoinType.MITER?b._miterLimitCosine:b._roundLimitCosine,c=a.isCap&&b._capType!==r.CapType.BUTT,d=!1;.97<a.cosine?(a.exit0=a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.bisector.x/a.cosine,a.bisector.y/a.cosine,0,-1,a.distance,b._ddValues),a.exit2=a.entry2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.bisector.x/a.cosine,-a.bisector.y/
a.cosine,0,1,a.distance,b._ddValues)):a.cosine<1-.97?(a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.prevNormal.x,a.prevNormal.y,0,-1,a.distance,b._ddValues),a.entry2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.prevNormal.x,-a.prevNormal.y,0,1,a.distance,b._ddValues),a.exit0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.nextNormal.x,a.nextNormal.y,0,-1,a.distance,
b._ddValues),a.exit2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.nextNormal.x,-a.nextNormal.y,0,1,a.distance,b._ddValues)):a.canSplit?(t.splitVertex(),0<a.sign?(a.splitInner?(a.exit0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.leftInner.x,a.leftInner.y,0,-1,a.distance,b._ddValues),a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.rightInner.x,a.rightInner.y,0,-1,
a.distance,b._ddValues)):(a.exit0=a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.bisector.x/a.cosine,a.bisector.y/a.cosine,0,-1,a.distance,b._ddValues)),a.cosine<e?(d=!a.isCap,a.entry2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.prevNormal.x,-a.prevNormal.y,0,1,a.distance,b._ddValues),a.exit2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.nextNormal.x,-a.nextNormal.y,
0,1,a.distance,b._ddValues)):a.splitOuter?(d=d||a.gapOuter,a.entry2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.leftOuter.x,-a.leftOuter.y,0,1,a.distance,b._ddValues),a.exit2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.rightOuter.x,-a.rightOuter.y,0,1,a.distance,b._ddValues)):(a.entry2=a.exit2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.bisector.x/a.cosine,-a.bisector.y/
a.cosine,0,1,a.distance,b._ddValues))):(a.splitInner?(a.exit2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.leftInner.x,-a.leftInner.y,0,1,a.distance,b._ddValues),a.entry2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.rightInner.x,-a.rightInner.y,0,1,a.distance,b._ddValues)):(a.exit2=a.entry2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.bisector.x/a.cosine,-a.bisector.y/
a.cosine,0,1,a.distance,b._ddValues)),a.cosine<e?(d=!a.isCap,a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.prevNormal.x,a.prevNormal.y,0,-1,a.distance,b._ddValues),a.exit0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.nextNormal.x,a.nextNormal.y,0,-1,a.distance,b._ddValues)):a.splitOuter?(d=d||a.gapOuter,a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.leftOuter.x,
a.leftOuter.y,0,-1,a.distance,b._ddValues),a.exit0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.rightOuter.x,a.rightOuter.y,0,-1,a.distance,b._ddValues)):(a.exit0=a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.bisector.x/a.cosine,a.bisector.y/a.cosine,0,-1,a.distance,b._ddValues)))):0<a.sign?(a.exit0=a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.bisector.x/
a.cosine,a.bisector.y/a.cosine,0,-1,a.distance,b._ddValues),a.cosine<e?(d=!a.isCap,a.entry2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.prevNormal.x,-a.prevNormal.y,0,1,a.distance,b._ddValues),a.exit2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.nextNormal.x,-a.nextNormal.y,0,1,a.distance,b._ddValues)):(a.entry2=a.exit2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.bisector.x/
a.cosine,-a.bisector.y/a.cosine,0,1,a.distance,b._ddValues))):(a.exit2=a.entry2=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.bisector.x/a.cosine,-a.bisector.y/a.cosine,0,1,a.distance,b._ddValues),a.cosine<e?(d=!a.isCap,a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.prevNormal.x,a.prevNormal.y,0,-1,a.distance,b._ddValues),a.exit0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,
a.nextNormal.x,a.nextNormal.y,0,-1,a.distance,b._ddValues)):(a.exit0=a.entry0=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.bisector.x/a.cosine,a.bisector.y/a.cosine,0,-1,a.distance,b._ddValues)));a.canSplit&&(a.splitInner||a.splitOuter)||d||c?(e=a.entry1=a.exit1=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,0,0,0,0,a.distance,b._ddValues)):e=a.entry1=a.exit1=null;if(d&&b._joinType!==r.JoinType.ROUND)b._lineIndexBuffer.add(e,
0<a.sign?a.exit2:a.entry0,0<a.sign?a.entry2:a.exit0);else if(c&&b._capType===r.CapType.ROUND||d&&b._joinType===r.JoinType.ROUND){var h=d=c=void 0,m=void 0,f=void 0,k=void 0;if(a.isCap){var g=Math.PI,f=Math.ceil(g/.8),k=g/f;a.isFirstVertex?(c=a.prevNormal.x,d=a.prevNormal.y,h=a.entry0,m=a.entry2):a.isLastVertex&&(c=-a.nextNormal.x,d=-a.nextNormal.y,h=a.exit2,m=a.exit0)}else g=2*Math.acos(a.cosine),f=Math.ceil(g/.8),k=g/f,c=0<a.sign?-a.prevNormal.x:a.nextNormal.x,d=0<a.sign?-a.prevNormal.y:a.nextNormal.y,
h=0<a.sign?a.entry2:a.exit0,m=0<a.sign?a.exit2:a.entry0;for(var g=Math.cos(k),k=Math.sin(k),p=k*c+g*d,c=g*c-k*d,d=p,l=void 0,p=void 0,n=0;n<f;++n){l=p;if(n<f-1)if(a.isCap){var q=a.isFirstVertex?-1:1,p=b._lineVertexBuffer.index;b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,c,d,q,0,a.distance,b._ddValues)}else p=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,c,d,0,a.sign,a.distance,b._ddValues);b._lineIndexBuffer.add(0===n?h:l,e,n===f-1?m:p);l=k*
c+g*d;c=g*c-k*d;d=l}}else c&&b._capType===r.CapType.SQUARE&&(c=a.isFirstVertex?1:-1,h=d=void 0,b._hasPattern?(d=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,a.prevNormal.x-c*a.inbound.x,a.prevNormal.y-c*a.inbound.y,-c,-1,a.distance,b._ddValues),h=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.prevNormal.x-c*a.inbound.x,-a.prevNormal.y-c*a.inbound.y,-c,1,a.distance,b._ddValues)):(d=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,
a.currentVertex.y,a.prevNormal.x-c*a.inbound.x,a.prevNormal.y-c*a.inbound.y,0,-1,a.distance,b._ddValues),h=b._lineVertexBuffer.index,b._lineVertexBuffer.add(a.currentVertex.x,a.currentVertex.y,-a.prevNormal.x-c*a.inbound.x,-a.prevNormal.y-c*a.inbound.y,0,1,a.distance,b._ddValues)),0<c?(b._lineIndexBuffer.add(e,a.entry2,h),b._lineIndexBuffer.add(e,h,d),b._lineIndexBuffer.add(e,d,a.entry0)):(b._lineIndexBuffer.add(e,h,a.exit2),b._lineIndexBuffer.add(e,d,h),b._lineIndexBuffer.add(e,a.exit0,d)))}},C=
function(b){return function(a){b._lineIndexBuffer.add(a.leftExit0,a.rightEntry0,null!=a.leftExit1?a.leftExit1:a.leftExit2);b._lineIndexBuffer.add(a.rightEntry0,null!=a.rightEntry1?a.rightEntry1:a.rightEntry2,null!=a.leftExit1?a.leftExit1:a.leftExit2);null!=a.leftExit1&&null!=a.rightEntry1?(b._lineIndexBuffer.add(a.leftExit1,a.rightEntry1,a.leftExit2),b._lineIndexBuffer.add(a.rightEntry1,a.rightEntry2,a.leftExit2)):null!=a.leftExit1?b._lineIndexBuffer.add(a.leftExit1,a.rightEntry2,a.leftExit2):null!=
a.rightEntry1&&b._lineIndexBuffer.add(a.rightEntry1,a.rightEntry2,a.leftExit2)}};return function(b){function a(a,c,d,h){c=b.call(this,a,c)||this;c._tessellationOptions={};c.tessellationProperties={_lineVertexBuffer:null,_lineIndexBuffer:null,_hasPattern:null,_ddValues:null,_capType:null,_joinType:null,_miterLimitCosine:null,_roundLimitCosine:null};if(a.hasDataDrivenLine!==d.isDataDriven())throw Error("incompatible line buffer");c.tessellationProperties._lineVertexBuffer=d;c.tessellationProperties._lineIndexBuffer=
h;c.tessellationProperties._hasPattern=a.getPaintValue("line-pattern",c.zoom)||0<a.getPaintValue("line-dasharray",c.zoom).length;c._isThinLine=a.isThinLine;c._tessellationCallbacks=c._isThinLine?{vertex:z(c.tessellationProperties),bridge:A(c.tessellationProperties)}:{vertex:B(c.tessellationProperties),bridge:C(c.tessellationProperties)};return c}w(a,b);Object.defineProperty(a.prototype,"lineIndexStart",{get:function(){return this._lineIndexStart},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,
"lineIndexCount",{get:function(){return this._lineIndexCount},enumerable:!0,configurable:!0});a.prototype.assignBufferInfo=function(a){a._lineIndexStart=this._lineIndexStart;a._lineIndexCount=this._lineIndexCount};a.prototype.processFeatures=function(a){this._lineIndexStart=this.tessellationProperties._lineIndexBuffer.index;this._lineIndexCount=0;var b=this.layer,d=this.zoom,e=b.hasDataDrivenLine;a&&a.setExtent(this.layerExtent);for(var m=[1,1,1,1],f=1,k=1,g=0,p=this._features;g<p.length;g++){var l=
p[g],n=new y.LineLayout(b,d,l);!this.tessellationProperties._hasPattern&&b.hasDataDrivenColor&&(m=b.getPaintValue("line-color",d,l));b.hasDataDrivenOpacity&&(f=b.getPaintValue("line-opacity",d,l));b.hasDataDrivenWidth&&(k=b.getPaintValue("line-width",d,l));var q=void 0;if(e&&(q={color:m,opacity:f,size:Math.max(Math.min(k,256),0)},0>=q.size||0>=q.opacity||0>=q.color[3]))continue;this.tessellationProperties._capType=n.cap;this.tessellationProperties._joinType=n.join;this.tessellationProperties._miterLimitCosine=
u.getLimitCosine(n.miterLimit);this.tessellationProperties._roundLimitCosine=u.getLimitCosine(n.roundLimit);l=l.getGeometry(a);this._processFeature(l,q)}t.cleanup()};a.prototype._processFeature=function(a,b){if(a)for(var c=a.length,e=0;e<c;e++)this._processGeometry(a[e],b)};a.prototype._processGeometry=function(a,b){if(!(2>a.length)){for(var c=a[0],e=1,m,f;e<a.length;)m=a[e].x-c.x,f=a[e].y-c.y,1E-6>m*m+f*f?a.splice(e,1):(c=a[e],++e);2>a.length||(c=this.tessellationProperties._lineIndexBuffer.index,
this._tessellationOptions.trackDistance=this.tessellationProperties._hasPattern,this._tessellationOptions.initialDistance=0,this._tessellationOptions.thin=this._isThinLine,this._tessellationOptions.wrapDistance=65535,this._tessellationOptions.outerBisectorAutoSplitThreshold=v,this._tessellationOptions.enableOuterBisectorSplit=this.tessellationProperties._hasPattern,this._tessellationOptions.innerBisectorAutoSplitThreshold=v,this._tessellationOptions.enableInnerBisectorSplit=this.tessellationProperties._hasPattern,
this.tessellationProperties._ddValues=b,t.tessellate(a,this._tessellationOptions,this._tessellationCallbacks),this._lineIndexCount+=3*(this.tessellationProperties._lineIndexBuffer.index-c))}};return a}(x)});