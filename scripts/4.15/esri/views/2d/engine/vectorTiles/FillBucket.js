// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ../../../../core/ArrayPool ../../../../core/libs/earcut/earcut ./Bucket ../webgl/Geometry".split(" "),function(F,G,C,A,D,E,x){return function(B){function h(b,a,d,e,m,g){a=B.call(this,b,a)||this;if(b.hasDataDrivenFill!==d.isDataDriven())throw Error("incompatible fill buffer");if(b.hasDataDrivenOutline!==m.isDataDriven())throw Error("incompatible outline buffer");a._fillVertexBuffer=d;a._fillIndexBuffer=e;a._outlineVertexBuffer=m;a._outlineIndexBuffer=
g;return a}C(h,B);Object.defineProperty(h.prototype,"fillIndexStart",{get:function(){return this._fillIndexStart},enumerable:!0,configurable:!0});Object.defineProperty(h.prototype,"fillIndexCount",{get:function(){return this._fillIndexCount},enumerable:!0,configurable:!0});Object.defineProperty(h.prototype,"outlineIndexStart",{get:function(){return this._outlineIndexStart},enumerable:!0,configurable:!0});Object.defineProperty(h.prototype,"outlineIndexCount",{get:function(){return this._outlineIndexCount},
enumerable:!0,configurable:!0});h.prototype.assignBufferInfo=function(b){b._fillIndexStart=this._fillIndexStart;b._fillIndexCount=this._fillIndexCount;b.layer.getPaintProperty("fill-outline-color")?(b._outlineIndexStart=this._outlineIndexStart,b._outlineIndexCount=this._outlineIndexCount):(b._outlineIndexStart=0,b._outlineIndexCount=0)};h.prototype.processFeatures=function(b){this._fillIndexStart=this._fillIndexBuffer.index;this._fillIndexCount=0;this._outlineIndexStart=this._outlineIndexBuffer.index;
this._outlineIndexCount=0;var a=this.layer,d=this.zoom,e=a.hasDataDrivenFill,m=a.hasDataDrivenOutline;b&&b.setExtent(this.layerExtent);var g=a.getPaintValue("fill-pattern",d),c=a.getPaintValue("fill-antialias",d)&&void 0===g,y=[1,1,1,1],q=[1,1,1,1],n=1;if(a.outlineUsesFillColor){if(c&&!a.hasDataDrivenOpacity){var p=a.getPaintValue("fill-opacity",d),k=a.getPaintValue("fill-opacity",d+1);1>p&&1>k&&(c=!1)}c&&!a.hasDataDrivenColor&&(p=a.getPaintValue("fill-color",d),k=a.getPaintValue("fill-color",d+1),
1>p[3]&&1>k[3]&&(c=!1))}p=0;for(k=this._features;p<k.length;p++){var f=k[p];!g&&a.hasDataDrivenColor&&(y=a.getPaintValue("fill-color",d,f));a.hasDataDrivenOpacity&&(n=a.getPaintValue("fill-opacity",d,f));!g&&a.hasDataDrivenOutlineColor&&(q=a.getPaintValue("fill-outline-color",d,f));var l=void 0;e&&(l={color:y,opacity:n});var h=void 0;m&&(h={color:a.outlineUsesFillColor?y:q,opacity:n});f=f.getGeometry(b);this._processFeature(f,c,a.outlineUsesFillColor,l,h)}};h.prototype._processFeature=function(b,
a,d,e,m){if(b){var g=b.length;if(a&&(!d||!m||1===m.color[3]*m.opacity))for(a=0;a<g;a++)this._processOutline(b[a],m);var c;for(a=0;a<g;a++)m=h._area(b[a]),128<m?(void 0!==c&&this._processFill(b,c,e),c=[a]):-128>m&&void 0!==c&&c.push(a);void 0!==c&&this._processFill(b,c,e)}};h.prototype._processOutline=function(b,a){var d=this._outlineVertexBuffer,e=this._outlineIndexBuffer,m=e.index,g,c,h,q=new x.Point(0,0),n=new x.Point(0,0),p=new x.Point(0,0),k=-1,f=-1,l=-1,r=-1,w=-1,z=!1,t=b.length;if(!(2>t)){var v=
b[0];for(g=b[t-1];t&&g.isEqual(v);)--t,g=b[t-1];if(!(2>t-0)){for(v=0;v<t;++v){0===v?(g=b[t-1],c=b[0],h=b[1],q.assignSub(c,g),q.normalize(),q.rightPerpendicular()):(g=c,c=h,h=v!==t-1?b[v+1]:b[0],q.assign(n));g=this._isClipEdge(g,c);-1===r&&(z=g);n.assignSub(h,c);n.normalize();n.rightPerpendicular();l=q.x*n.y-q.y*n.x;p.assignAdd(q,n);p.normalize();var u=-p.x*-q.x+-p.y*-q.y,u=Math.abs(0!==u?1/u:1);8<u&&(u=8);0<=l?(l=d.add(c.x,c.y,q.x,q.y,0,1,a),-1===r&&(r=l),0<=k&&0<=f&&0<=l&&!g&&e.add(k,f,l),f=d.add(c.x,
c.y,u*-p.x,u*-p.y,0,-1,a),-1===w&&(w=f),0<=k&&0<=f&&0<=l&&!g&&e.add(k,f,l),k=f,f=l,l=d.add(c.x,c.y,p.x,p.y,0,1,a),0<=k&&0<=f&&0<=l&&!g&&e.add(k,f,l),f=d.add(c.x,c.y,n.x,n.y,0,1,a)):(l=d.add(c.x,c.y,u*p.x,u*p.y,0,1,a),-1===r&&(r=l),0<=k&&0<=f&&0<=l&&!g&&e.add(k,f,l),f=d.add(c.x,c.y,-q.x,-q.y,0,-1,a),-1===w&&(w=f),0<=k&&0<=f&&0<=l&&!g&&e.add(k,f,l),k=f,f=l,l=d.add(c.x,c.y,-p.x,-p.y,0,-1,a),0<=k&&0<=f&&0<=l&&!g&&e.add(k,f,l),k=d.add(c.x,c.y,-n.x,-n.y,0,-1,a));0<=k&&0<=f&&0<=l&&!g&&e.add(k,f,l)}0<=k&&
0<=f&&0<=r&&!z&&e.add(k,f,r);0<=k&&0<=r&&0<=w&&!z&&e.add(k,w,r);this._outlineIndexCount+=3*(e.index-m)}}};h.prototype._processFill=function(b,a,d){var e;1<a.length&&(e=[]);for(var m=0,g=0;g<a.length;g++){var c=a[g];0!==m&&e.push(m);m+=b[c].length}for(var g=2*m,m=A.acquire(),h=0;h<a.length;h++)for(var c=a[h],c=b[c],q=c.length,n=0;n<q;++n)m.push(c[n].x),m.push(c[n].y);b=D.earcut(m,e,2);a=b.length;if(0<a){e=this._fillVertexBuffer.index;for(h=0;h<g;)this._fillVertexBuffer.add(m[h++],m[h++],d);for(d=0;d<
a;)this._fillIndexBuffer.add(e+b[d++],e+b[d++],e+b[d++]);this._fillIndexCount+=a}A.release(m)};h.prototype._isClipEdge=function(b,a){return b.x===a.x?-64>=b.x||4160<=b.x:b.y===a.y?-64>=b.y||4160<=b.y:!1};h._area=function(b){for(var a=0,d=b.length-1,e=0;e<d;e++)a+=(b[e].x-b[e+1].x)*(b[e].y+b[e+1].y);a+=(b[d].x-b[0].x)*(b[d].y+b[0].y);return.5*a};return h}(E)});