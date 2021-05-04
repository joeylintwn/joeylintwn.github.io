// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define(["require","exports","@dojo/framework/shim/array","./RandomLCG"],function(n,h,l,u){function p(a,b,c,d){d=d||q;for(var e=Math.max(0,d.last-10),g=e;g<c;++g)if(a[g]===b)return d.last=g;c=Math.min(e,c);for(g=0;g<c;++g)if(a[g]===b)return d.last=g;return-1}function r(a,b){return-1===a.indexOf(b)}function t(a,b,c){return!a.some(b.bind(null,c))}function v(a){return a}Object.defineProperty(h,"__esModule",{value:!0});h.find=l.find;h.findIndex=l.findIndex;h.includes=l.includes;h.unique=function(a,b){return b?
a.filter(function(a,d,e){return l.findIndex(e,b.bind(null,a))===d}):a.filter(function(a,b,e){return e.indexOf(a)===b})};h.equals=function(a,b,c){if(!a&&!b)return!0;if(!a||!b||a.length!==b.length)return!1;if(c)for(var d=0;d<a.length;d++){if(!c(a[d],b[d]))return!1}else for(d=0;d<a.length;d++)if(a[d]!==b[d])return!1;return!0};h.difference=function(a,b,c){var d;c?(d=b.filter(t.bind(null,a,c)),a=a.filter(t.bind(null,b,c))):(d=b.filter(r.bind(null,a)),a=a.filter(r.bind(null,b)));return{added:d,removed:a}};
h.intersect=function(a,b,c){return a&&b?c?a.filter(function(a){return-1<l.findIndex(b,function(b){return c(a,b)})}):a.filter(function(a){return-1<b.indexOf(a)}):[]};var w=!!Array.prototype.fill;h.constant=function(a,b){if(w)return Array(a).fill(b);for(var c=Array(a),d=0;d<a;d++)c[d]=b;return c};h.range=function(a,b){void 0===b&&(b=a,a=0);for(var c=Array(b-a),d=a;d<b;d++)c[d-a]=d;return c};h.binaryIndexOf=function(a,b,c){for(var d=a.length,e=0,g=d-1;e<g;){var f=e+Math.floor((g-e)/2);b>a[f]?e=f+1:g=
f}g=a[e];return c?b>=a[d-1]?-1:g===b?e:e-1:g===b?e:-1};h.flatten=function(a){return a.reduce(function(a,c){return a.concat(c||[])},[])};n=function(){return function(){this.last=0}}();h.PositionHint=n;var q=new n;h.indexOf=p;h.removeUnordered=function(a,b,c,d){var e=null==c?a.length:c;d=p(a,b,e,d);if(-1!==d)return a[d]=a[e-1],null==c&&a.pop(),b};var k=new Set;h.removeUnorderedMany=function(a,b,c,d,e,g){void 0===c&&(c=a.length);void 0===d&&(d=b.length);if(0===d||0===c)return c;k.clear();for(var f=0;f<
d;++f)k.add(b[f]);e=e||q;for(f=b=Math.max(0,e.last-10);f<c;++f)if(k.has(a[f])&&(g&&g.push(a[f]),k.delete(a[f]),a[f]=a[c-1],--c,--f,0===k.size||0===c))return k.clear(),c;for(f=0;f<b;++f)if(k.has(a[f])&&(g&&g.push(a[f]),k.delete(a[f]),a[f]=a[c-1],--c,--f,0===k.size||0===c))return k.clear(),c;k.clear();return c};h.pickRandom=function(a,b,c){var d=a.length;if(b>=d)return a.slice(0);c=(m.seed=c)?function(){return m.getFloat()}:Math.random;for(var e=new Set,g=[];g.length<b;){var f=Math.floor(c()*d);e.has(f)||
(e.add(f),g.push(a[f]))}return g};h.shuffle=function(a,b){b=(m.seed=b)?function(){return m.getFloat()}:Math.random;for(var c=a.length-1;0<c;c--){var d=Math.floor(b()*(c+1)),e=a[c];a[c]=a[d];a[d]=e}return a};var m=new u;h.keysOfMap=function(a){var b=Array(a.size),c=0;a.forEach(function(a,e){return b[c++]=e});return b};h.keysOfSet=function(a,b){void 0===b&&(b=v);var c=Array(a.size),d=0;a.forEach(function(a){return c[d++]=b(a)});return c};h.fromMapValues=function(a){if(Array.from)return Array.from(a.values());
var b=Array(a.size),c=0;a.forEach(function(a){return b[c++]=a});return b};h.remove=function(a,b){var c=a.indexOf(b);return-1!==c?(a.splice(c,1),b):null}});