// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../core/mathUtils"],function(E,t,D){function v(f,d,a){var q=f.byteLength/(4*d),w=new Uint32Array(f,0,q*d);f=new Uint32Array(q);var l=a&&a.minReduction||0,h=a&&a.originalIndices||null,e=a&&a.componentOffsets||null,c=0;if(e)for(a=0;a<e.length-1;a++){var r=e[a+1]-e[a];r>c&&(c=r)}else c=q;var n=Math.floor(1.1*c)+1;if(null==m||m.length<2*n)m=new Uint32Array(D.nextHighestPowerOfTwo(2*n));for(a=0;a<2*n;a++)m[a]=0;var c=0,x=(r=!!e&&!!h)?h.length:q,u=r?new Uint32Array(h.length):
null,y=0!==l?Math.ceil(7.84*1.96/(l*l)*l*(1-l)):x,p=1,t=e?e[1]:x;for(a=0;a<x;a++){if(a===y){var b=1-c/a;if(b+1.96*Math.sqrt(b*(1-b)/a)<l)return null;y*=2}if(a===t){for(b=0;b<2*n;b++)m[b]=0;if(h)for(b=e[p-1];b<e[p];b++)u[b]=f[h[b]];t=e[++p]}for(var B=r?h[a]:a,b=B*d,k,g=k=0;g<d;g++)k=w[b+g]+k|0,k=k+(k<<11)+(k>>>2)|0;k>>>=0;for(var g=k%n,C=c;0!==m[2*g+1];){if(m[2*g]===k){var v=m[2*g+1]-1,z=v*d;a:{for(var A=0;A<d;A++)if(w[b+A]!==w[z+A]){z=!1;break a}z=!0}if(z){C=f[v];break}}g++;g>=n&&(g-=n)}C===c&&(m[2*
g]=k,m[2*g+1]=B+1,c++);f[B]=C}if(0!==l&&1-c/q<l)return null;if(r){for(a=e[p-1];a<u.length;a++)u[a]=f[h[a]];f=u}q=new Uint32Array(d*c);for(a=c=0;a<x;a++)if(f[a]===c){b=(r?h[a]:a)*d;l=w;e=b;n=q;u=c*d;y=d;for(p=0;p<y;p++)n[u+p]=l[e+p];c++}if(h&&!r){d=new Uint32Array(h.length);for(a=0;a<d.length;a++)d[a]=f[h[a]];f=d}return{buffer:q.buffer,indices:f,uniqueCount:c}}Object.defineProperty(t,"__esModule",{value:!0});t.deduplicate=v;var m=null;t.default=v});