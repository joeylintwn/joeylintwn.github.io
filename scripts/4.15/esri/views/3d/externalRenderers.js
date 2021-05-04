// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define(["require","exports","../../core/libs/gl-matrix-2/mat4f64","./externalRenderers/ExternalRendererStore","./support/projectionUtils"],function(w,b,u,v,h){function l(a,d){m.add(a,d)}function n(a,d){m.remove(a,d)}function p(a){a._stage.renderView.setNeedsRender()}function q(a,d,b,c,g,f,k){c=c||a.spatialReference;return h.bufferToBuffer(d,c,b,g,a.renderCoordsHelper.spatialReference,f,k)?g:null}function r(a,b,e,c,g,f,k){f=f||a.spatialReference;return h.bufferToBuffer(b,a.renderCoordsHelper.spatialReference,
e,c,f,g,k)?c:null}function t(a,b,e,c){c||(c=u.mat4f64.create());e=e||a.spatialReference;return h.computeLinearTransformation(e,b,c,a.renderCoordsHelper.spatialReference)?c:null}Object.defineProperty(b,"__esModule",{value:!0});var m=new v;b.add=l;b.remove=n;b.requestRender=p;b.toRenderCoordinates=q;b.fromRenderCoordinates=r;b.renderCoordinateTransformAt=t;b.bind=function(a){return{add:l.bind(this,a),remove:n.bind(this,a),requestRender:p.bind(this,a),toRenderCoordinates:q.bind(this,a),fromRenderCoordinates:r.bind(this,
a),renderCoordinateTransformAt:t.bind(this,a)}}});