// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../../core/tsSupport/extendsHelper ../../../../../core/libs/gl-matrix-2/vec3 ../../../../../core/libs/gl-matrix-2/vec3f64 ./MomentumController ../../utils/navigationUtils".split(" "),function(b,f,h,e,g,k,l){Object.defineProperty(f,"__esModule",{value:!0});var m=g.vec3f64.create(),c=g.vec3f64.create();b=function(b){function d(a,c){a=b.call(this,a,4)||this;a.momentum=c;return a}h(d,b);d.prototype.momentumStep=function(a,b){var d=this.momentum.value1(a);a=this.momentum.value2(a);
e.vec3.copy(c,b.eye);e.vec3.normalize(c,c);e.vec3.cross(this.momentum.axis2,c,this.momentum.axis1);l.applyRotationWithTwoAxes(b,m,this.momentum.axis1,d,this.momentum.axis2,a)};return d}(k.MomentumController);f.PanSphericalMomentumController=b});