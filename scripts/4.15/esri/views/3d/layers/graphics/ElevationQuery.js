// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/generatorHelper ../../../../core/tsSupport/awaiterHelper ../../../../core/tsSupport/assignHelper ../../../../geometry ../../../../core/arrayUtils ../../../../core/asyncUtils ../../../../core/maybe ../../../../core/promiseUtils ../../../../core/scheduling".split(" "),function(h,k,r,t,v,w,x,y,u,f,z){Object.defineProperty(k,"__esModule",{value:!0});h=function(){function b(a,c){this.spatialReference=a;this.view=c}b.prototype.getElevation=function(a,c,
d){return this.view.elevationProvider.getElevation(a,c,0,this.spatialReference,d)};b.prototype.queryElevation=function(a,c,d,b,e){return t(this,void 0,void 0,function(){return r(this,function(f){return[2,this.view.elevationProvider.queryElevation(a,c,0,this.spatialReference,d,b,e)]})})};return b}();k.ViewElevationProvider=h;h=function(){function b(a,c,d){this.spatialReference=a;this._getElevationQueryProvider=c;this._queries=[];this._isScheduled=!1;this._queryOptions=v({},d,{ignoreInvisibleLayers:!0})}
b.prototype.queryElevation=function(a,c,d,b){void 0===b&&(b=0);return t(this,void 0,void 0,function(){var e=this;return r(this,function(g){return[2,f.create(function(g,l){var n={x:a,y:c,minDemResolution:b,result:{resolve:g,reject:l},signal:d};e._queries.push(n);f.onAbort(d,function(){x.remove(e._queries,n);l(f.createAbortError())});e._scheduleDoQuery()})]})})};b.prototype._scheduleDoQuery=function(){var a=this;this._isScheduled||(z.schedule(function(){return a._doQuery()}),this._isScheduled=!0)};
b.prototype._doQuery=function(){return t(this,void 0,void 0,function(){var a,b,d,h,e,g,k,l,n,q,p,m;return r(this,function(c){switch(c.label){case 0:this._isScheduled=!1;a=this._queries;this._queries=[];if(0===a.length)return[2];b=a.map(function(a){return[a.x,a.y]});d=a.reduce(function(a,b){return Math.min(a,b.minDemResolution)},Infinity);h=new w.Multipoint({points:b,spatialReference:this.spatialReference});e=this._getElevationQueryProvider();if(!e)return a.forEach(function(a){return a.result.reject()}),
[2];g=1<a.length&&a.some(function(a){return!!a.signal})?f.createAbortController():null;k=u.isSome(g)?g.signal:a[0].signal;u.isSome(g)&&(l=0,a.forEach(function(b){return f.onAbort(b.signal,function(){l++;b.result.reject(f.createAbortError());l===a.length&&g.abort()})}));n=v({},this._queryOptions,{minDemResolution:d,signal:k});return[4,y.result(e.queryElevation(h,n))];case 1:q=c.sent();for(p=0;p<a.length;p++)m=a[p],u.isSome(m.signal)&&m.signal.aborted?m.result.reject(f.createAbortError()):!1===q.ok?
m.result.reject(q.error):m.result.resolve(q.value.geometry.points[p][2]);return[2]}})})};return b}();k.ElevationQuery=h});