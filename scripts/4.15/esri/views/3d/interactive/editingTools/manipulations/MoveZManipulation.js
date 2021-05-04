// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../../core/tsSupport/decorateHelper ../../../../../core/tsSupport/extendsHelper ../../../../../core/tsSupport/generatorHelper ../../../../../core/tsSupport/awaiterHelper ../../../../../core/colorUtils ../../../../../core/Evented ../../../../../core/Handles ../../../../../core/mathUtils ../../../../../core/maybe ../../../../../core/libs/gl-matrix-2/mat4 ../../../../../core/libs/gl-matrix-2/mat4f64 ../../../../../core/libs/gl-matrix-2/vec3 ../../../../../core/libs/gl-matrix-2/vec3f64 ../../Manipulator3D ../../manipulatorUtils ../manipulatorDragUtils ../settings ./config ./Manipulation ./moveUtils ../../../webgl-engine/lib/Geometry ../../../webgl-engine/lib/GeometryUtil".split(" "),
function(q,w,L,A,M,N,B,C,D,E,F,t,G,f,n,H,r,u,g,v,I,J,x,y){Object.defineProperty(w,"__esModule",{value:!0});q=function(q){function d(a){var c=q.call(this)||this;c._handles=new D;c._radius=v.DISC_RADIUS;c.events=new C;c._tool=a.tool;c._view=a.view;null!=a.radius&&(c._radius=a.radius);c.createManipulator();c.forEachManipulator(function(a){return c._tool.manipulators.add(a)});return c}A(d,q);d.prototype.destroy=function(){var a=this;this._handles.destroy();this.forEachManipulator(function(c){a._tool.manipulators.remove(c);
c.destroy()})};d.prototype.forEachManipulator=function(a){a(this._manipulator,0)};d.prototype.createGraphicDragPipeline=function(a,c){var l=this,p=F.expect(a.graphic.geometry).spatialReference;return J.createGraphicMoveDragPipeline(a,c,function(a){return l.createDragPipeline(a,p)})};d.prototype.createDragPipeline=function(a,c){var l=this._view;return u.createManipulatorDragEventPipeline(this._manipulator,function(p,b,h,g){b=b.next(u.screenToZConstrained(l,p.renderLocation,c)).next(u.addScreenDelta());
a(p,b,h,g)})};Object.defineProperty(d.prototype,"radius",{get:function(){return this._radius},set:function(a){a!==this._radius&&(this._radius=a,this.updateManipulator())},enumerable:!0,configurable:!0});d.prototype.updateManipulator=function(){var a=this._radius/v.DISC_RADIUS,c=g.settings.zManipulator.height*a,l=g.settings.zManipulator.coneHeight*a,p=g.settings.zManipulator.coneWidth*a,a=g.settings.zManipulator.width*a,b=[n.vec3f64.fromValues(0,0,0),n.vec3f64.fromValues(0,0,c)],b=new x(y.createTubeGeometry(b,
a/2,16,!1),"move-z"),h=y.createConeGeometry(l,p/2,16,!1),h=new x(h),l=[n.vec3f64.fromValues(0,0,0),n.vec3f64.fromValues(0,0,c+l)],d=function(a){var b=G.mat4f64.create();t.mat4.translate(b,b,[0,0,c]);t.mat4.rotateX(b,b,Math.PI/2);a&&(a=1+2*a/p,t.mat4.scale(b,b,[a,a,a]));return b}(0),e=function(a,b){b=B.darken(g.settings.zManipulator.color,b);return[b.r/255,b.g/255,b.b/255,g.settings.zManipulator.color.a*a]},k=r.createManipulatorMaterial(e(1,.25),1),f=r.createManipulatorMaterial(e(1,0),1),m=r.createManipulatorMaterial(e(.7,
0),g.settings.zManipulator.occludedFlag),e=r.createManipulatorMaterial(e(.85,0),g.settings.zManipulator.occludedFlag);this._manipulator.renderObjects=[{geometry:h,transform:d,material:k,stateMask:1},{geometry:b,material:k,stateMask:1},{geometry:h,transform:d,material:f,stateMask:2},{geometry:b,material:f,stateMask:2},{geometry:h,transform:d,material:m,stateMask:1},{geometry:b,material:m,stateMask:1},{geometry:h,transform:d,material:e,stateMask:2},{geometry:b,material:e,stateMask:2}];this._manipulator.radius=
a/2+2;this._manipulator.collisionType={type:"line",paths:[l]}};d.prototype.createManipulator=function(){var a=this,c=new H.Manipulator3D({view:this._view,autoScaleRenderObjects:!1,worldSized:!1,selectable:!1,cursor:"ns-resize",elevationInfo:this.elevationInfo,worldOriented:!0,collisionPriority:1.6});c.applyObjectTransform=function(c){var d=a._view.state.camera,b=z;a._view.renderCoordsHelper.toRenderCoords(a._manipulator.elevationAlignedLocation,b);var h=f.vec3.dist(d.eye,b),l=d.computeRenderPixelSizeAtDist(h),
e=f.vec3.subtract(m,b,d.eye);f.vec3.normalize(e,e);var k=K;a._view.renderCoordsHelper.worldUpAtPosition(z,k);b=Math.abs(f.vec3.dot(e,k));e=f.vec3.cross(m,e,k);k=f.vec3.cross(m,e,k);b=E.clamp(b,.01,1);d=1-Math.sqrt(1-b*b)/b/d.fullWidth;b=a._radius/v.DISC_RADIUS*g.settings.zManipulator.width;f.vec3.scale(k,f.vec3.normalize(k,k),(1/d-1)*h+l*b);c[12]-=m[0];c[13]-=m[1];c[14]-=m[2]};this._manipulator=c;this.updateManipulator()};return d}(I.Manipulation);w.MoveZManipulation=q;var z=n.vec3f64.create(),m=
n.vec3f64.create(),K=n.vec3f64.create()});