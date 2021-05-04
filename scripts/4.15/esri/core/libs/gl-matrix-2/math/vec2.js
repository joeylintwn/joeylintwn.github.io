// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define(["require","exports","./common"],function(t,d,h){function k(a,b,c){a[0]=b[0]-c[0];a[1]=b[1]-c[1];return a}function l(a,b,c){a[0]=b[0]*c[0];a[1]=b[1]*c[1];return a}function m(a,b,c){a[0]=b[0]/c[0];a[1]=b[1]/c[1];return a}function n(a,b){var c=b[0]-a[0];a=b[1]-a[1];return Math.sqrt(c*c+a*a)}function p(a,b){var c=b[0]-a[0];a=b[1]-a[1];return c*c+a*a}function q(a){var b=a[0];a=a[1];return Math.sqrt(b*b+a*a)}function r(a){var b=a[0];a=a[1];return b*b+a*a}Object.defineProperty(d,"__esModule",{value:!0});
d.copy=function(a,b){a[0]=b[0];a[1]=b[1];return a};d.set=function(a,b,c){a[0]=b;a[1]=c;return a};d.add=function(a,b,c){a[0]=b[0]+c[0];a[1]=b[1]+c[1];return a};d.subtract=k;d.multiply=l;d.divide=m;d.ceil=function(a,b){a[0]=Math.ceil(b[0]);a[1]=Math.ceil(b[1]);return a};d.floor=function(a,b){a[0]=Math.floor(b[0]);a[1]=Math.floor(b[1]);return a};d.min=function(a,b,c){a[0]=Math.min(b[0],c[0]);a[1]=Math.min(b[1],c[1]);return a};d.max=function(a,b,c){a[0]=Math.max(b[0],c[0]);a[1]=Math.max(b[1],c[1]);return a};
d.round=function(a,b){a[0]=Math.round(b[0]);a[1]=Math.round(b[1]);return a};d.scale=function(a,b,c){a[0]=b[0]*c;a[1]=b[1]*c;return a};d.scaleAndAdd=function(a,b,c,d){a[0]=b[0]+c[0]*d;a[1]=b[1]+c[1]*d;return a};d.distance=n;d.squaredDistance=p;d.length=q;d.squaredLength=r;d.negate=function(a,b){a[0]=-b[0];a[1]=-b[1];return a};d.inverse=function(a,b){a[0]=1/b[0];a[1]=1/b[1];return a};d.normalize=function(a,b){var c=b[0],d=b[1],c=c*c+d*d;0<c&&(c=1/Math.sqrt(c),a[0]=b[0]*c,a[1]=b[1]*c);return a};d.dot=
function(a,b){return a[0]*b[0]+a[1]*b[1]};d.cross=function(a,b,c){b=b[0]*c[1]-b[1]*c[0];a[0]=a[1]=0;a[2]=b;return a};d.lerp=function(a,b,c,d){var f=b[0];b=b[1];a[0]=f+d*(c[0]-f);a[1]=b+d*(c[1]-b);return a};d.random=function(a,b){b=b||1;var c=2*h.RANDOM()*Math.PI;a[0]=Math.cos(c)*b;a[1]=Math.sin(c)*b;return a};d.transformMat2=function(a,b,c){var d=b[0];b=b[1];a[0]=c[0]*d+c[2]*b;a[1]=c[1]*d+c[3]*b;return a};d.transformMat2d=function(a,b,c){var d=b[0];b=b[1];a[0]=c[0]*d+c[2]*b+c[4];a[1]=c[1]*d+c[3]*
b+c[5];return a};d.transformMat3=function(a,b,c){var d=b[0];b=b[1];a[0]=c[0]*d+c[3]*b+c[6];a[1]=c[1]*d+c[4]*b+c[7];return a};d.transformMat4=function(a,b,c){var d=b[0];b=b[1];a[0]=c[0]*d+c[4]*b+c[12];a[1]=c[1]*d+c[5]*b+c[13];return a};d.rotate=function(a,b,c,d){var f=b[0]-c[0];b=b[1]-c[1];var e=Math.sin(d);d=Math.cos(d);a[0]=f*d-b*e+c[0];a[1]=f*e+b*d+c[1];return a};d.angle=function(a,b){var c=a[0];a=a[1];var d=b[0];b=b[1];var g=c*c+a*a;0<g&&(g=1/Math.sqrt(g));var e=d*d+b*b;0<e&&(e=1/Math.sqrt(e));
c=(c*d+a*b)*g*e;return 1<c?0:-1>c?Math.PI:Math.acos(c)};d.str=function(a){return"vec2("+a[0]+", "+a[1]+")"};d.exactEquals=function(a,b){return a[0]===b[0]&&a[1]===b[1]};d.equals=function(a,b){var c=a[0];a=a[1];var d=b[0];b=b[1];return Math.abs(c-d)<=h.EPSILON*Math.max(1,Math.abs(c),Math.abs(d))&&Math.abs(a-b)<=h.EPSILON*Math.max(1,Math.abs(a),Math.abs(b))};d.len=q;d.sub=k;d.mul=l;d.div=m;d.dist=n;d.sqrDist=p;d.sqrLen=r});