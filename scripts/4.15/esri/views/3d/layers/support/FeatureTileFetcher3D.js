// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/declareExtendsHelper ../../../../core/tsSupport/decorateHelper ../../../../core/tsSupport/assignHelper ../../../../core/tsSupport/awaiterHelper ../../../../core/tsSupport/generatorHelper ../../../../core/Accessor ../../../../core/arrayUtils ../../../../core/Handles ../../../../core/Logger ../../../../core/maybe ../../../../core/now ../../../../core/promiseUtils ../../../../core/scheduling ../../../../core/SetUtils ../../../../core/watchUtils ../../../../core/accessorSupport/decorators ../../../../geometry/support/aaBoundingRect ../../../../layers/graphics/dehydratedFeatures ../../../../tasks/support/QuantizationParameters ../../../../tasks/support/Query ./featureReference ./FeatureTile ../../terrain/tileUtils ../../../support/Scheduler".split(" "),
function(z,w,N,m,ba,r,u,O,P,Q,R,p,C,q,S,D,T,l,x,v,U,E,F,G,V,W){function A(h){return"dummy-tile-full-extent"===h.id}function X(h){for(var b=0,a=0;a<h.length;a++){var c=h[a];c.features&&0<c.features.length&&c.alive&&(b=Math.max(b,c.descriptor.lij[0]))}return b}function H(h){return p.isNone(h)?new Set:D.createSetFromValues(h.map(function(b){return b.name}))}function I(h,b){if(p.isNone(h)||p.isNone(b))return H(b);for(var a=new Set,c=0;c<b.length;c++){var e=b[c].name;h.has(e)&&a.add(e)}return a}Object.defineProperty(w,
"__esModule",{value:!0});var J=R.getLogger("esri.views.3d.layers.support.FeatureTileFetcher3D");z=function(h){function b(a){a=h.call(this,a)||this;a.useTileCount=!1;a.updating=!1;a.updatingTotal=0;a.updatingRemaining=0;a.expectedFeatureDiff=0;a.maximumNumberOfFeaturesExceeded=!1;a.maximumNumberOfFeaturesExceededThrottle=1E3;a.maximumNumberOfFeaturesExceededNext=0;a._fullRatio=1;a._farRatio=1;a.changes={updates:{adds:[],removes:[]},adds:[],removes:[]};a.handles=new Q;a._dirty=!1;a.featureTiles=new Map;
a.displayingFeatureReferences=new Map;a.numDisplayingFeatureReferences=0;a.suspended=!0;a.pendingEdits=null;return a}N(b,h);Object.defineProperty(b.prototype,"maximumNumberOfFeatures",{set:function(a){a=a||Infinity;var c=this._get("maximumNumberOfFeatures");a===c||1>a||(this._set("maximumNumberOfFeatures",a),this.maximumFeaturesUpdated(c,a))},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"memoryFactor",{set:function(a){this.memoryFactor!==a&&(this._set("memoryFactor",a),this.setDirty())},
enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"lodFactor",{set:function(a){this.lodFactor!==a&&(this._set("lodFactor",a),this.supportsResolution&&this.refetch())},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"memoryForUnusedFeatures",{get:function(){var a=0;this.featureTiles.forEach(function(c){return a+=c.estimatedUnusedSize});return a},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"totalVertices",{get:function(){var a=0;this.featureTiles.forEach(function(c){return a+=
c.numVertices});return a},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"totalFeatures",{get:function(){var a=0;this.featureTiles.forEach(function(c){return a+=c.numFeatures});return a},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"filterExtent",{set:function(a){if(a&&this.context.tilingScheme&&!a.spatialReference.equals(this.context.tilingScheme.spatialReference))J.error("#filterExtent\x3d","extent needs to be in the same spatial reference as the tiling scheme");
else{var c=this._get("filterExtent");c===a||c&&a&&c.equals(a)||(a=a?a.clone():null,this._set("filterExtent",a),this.reclip(a,c))}},enumerable:!0,configurable:!0});b.prototype.initialize=function(){var a=this;this.handles.add(T.on(this,"tileDescriptors","change",function(){return a.setDirty()},function(){return a.setDirty()}));this.objectIdField=this.context.objectIdField;this.FeatureReferenceClass=this.context.capabilities.supportsMultipleResolutions?F.MultiFeatureReference:F.SingleFeatureReference;
var c=this.context.scheduler;p.isSome(c)&&this.handles.add(c.registerTask(W.Task.FEATURE_TILE_FETCHER,function(c){return a.update(c)},function(){return a._dirty||0<a.maximumNumberOfFeaturesExceededNext}));this.setDirty()};b.prototype.destroy=function(){var a=this;this.handles&&(this.handles.destroy(),this.handles=null);this.featureTiles.forEach(function(c){a.cancelFetchTile(c);a.removeTile(c)});this.featureTiles.clear();this.displayingFeatureReferences.clear();this.pendingEdits&&(this.pendingEdits.controller.abort(),
this.pendingEdits=null)};Object.defineProperty(b.prototype,"paused",{get:function(){return this.suspended||!!this.pendingEdits},enumerable:!0,configurable:!0});b.prototype.restart=function(){var a=this;this.featureTiles.forEach(function(c){a.cancelFetchTile(c);a.clearTile(c);a.resetFetchTile(c)});p.isSome(this.context.memoryCache)&&this.context.memoryCache.clear();this.setDirty()};b.prototype.refetch=function(){var a=this;this.featureTiles.forEach(function(c){a.cancelFetchTile(c);a.resetFetchTile(c)});
p.isSome(this.context.memoryCache)&&this.context.memoryCache.clear();this.setDirty()};b.prototype.suspend=function(){this.suspended||(this.suspended=!0,this.pause(),this.setDirty())};b.prototype.resume=function(){this.suspended&&(this.suspended=!1,this.unpause())};b.prototype.pause=function(){var a=this;this.paused&&(this.featureTiles.forEach(function(c){return a.cancelFetchTile(c)}),this.updated())};b.prototype.unpause=function(){this.paused||(this.setDirty(),this.updated())};Object.defineProperty(b.prototype,
"availableFields",{get:function(){var a=null;this.featureTiles.forEach(function(c){c.displayingFeatures&&0!==c.displayingFeatures.length&&(p.isNone(a)?a=D.createSetFromValues(P.keysOfSet(c.availableFields)):a.forEach(function(b){c.availableFields.has(b)||p.unwrap(a).delete(b)}))});return p.isSome(a)?a:new Set},enumerable:!0,configurable:!0});b.prototype.applyEdits=function(a){var c=this;this.pendingEdits||(this.pendingEdits={edits:q.resolve(),count:0,controller:q.createAbortController()},this.pause());
this.pendingEdits.count++;var b=this.pendingEdits.edits.then(function(){return a.result.catch(function(a){if(q.isAbortError(a))throw a;return null}).then(function(a){return a?(c.applyEditsDeleteFeatures(a.deletedFeatures),c.applyEditsAddUpdateFeatures(a.addedFeatures,a.updatedFeatures,c.pendingEdits.controller.signal).then(function(){return a})):a}).then(function(a){0===--c.pendingEdits.count&&(c.pendingEdits=null,p.isSome(c.context.memoryCache)&&c.context.memoryCache.clear(),c.unpause(),c.updated());
return a})});this.pendingEdits.edits=b;this.updated();return b};b.prototype.applyEditsDeleteFeatures=function(a){var c=this;if(0!==a.length){var b=new Set;a.forEach(function(a){return b.add(a.objectId)});this.featureTiles.forEach(function(a){if(a.features){var e=a.features.filter(function(a){return!b.has(v.getObjectId(a,c.objectIdField))});e.length!==a.features.length&&(a.setFeatures(e,0,a.availableFields),c.invalidateCounts())}})}};b.prototype.applyEditsAddUpdateFeatures=function(a,c,b){return r(this,
void 0,void 0,function(){var e,n,f,g=this;return u(this,function(d){switch(d.label){case 0:e=[];n=new Set;a.forEach(function(a){return e.push(a.objectId)});c.forEach(function(a){e.push(a.objectId);n.add(a.objectId)});if(0===e.length)return[2];f=[];this.featureTiles.forEach(function(a){(a=g.applyEditsAddUpdateTile(a,e,n,b))&&f.push(a)});return[4,q.eachAlways(f)];case 1:return d.sent(),[2]}})})};b.prototype.applyEditsAddUpdateTile=function(a,c,b,d){return r(this,void 0,void 0,function(){var e,f,g,k,
y,B,K,h=this;return u(this,function(n){switch(n.label){case 0:if(!a.features)return[2];e=this.createQuery(a);e.resultType=void 0;e.cacheHint=!1;e.objectIds=c;return[4,this.queryFeatures(e,d)];case 1:f=n.sent();g=null;0<b.size&&(k=a.features.filter(function(a){return!b.has(v.getObjectId(a,h.objectIdField))}),k.length!==a.features.length&&(g=k));if(0<f.features.length)for(g||(g=a.features.slice()),y=0,B=f.features;y<B.length;y++)K=B[y],g.push(K);g&&(a.setFeatures(g,0,I(a.availableFields,f.fields)),
this.invalidateCounts());return[2]}})})};b.prototype.queryFeatures=function(a,c){return this.context.query.queryFeaturesDehydrated(a,{signal:c,timeout:Y})};b.prototype.setDirty=function(){this._dirty=!0;this.updated()};b.prototype.update=function(a){var c=this;this.maximumNumberOfFeaturesExceededNext&&C()>=this.maximumNumberOfFeaturesExceededNext&&this.updateMaximumNumberOfFeaturesExceeded();if(this._dirty&&this.constructed){this._dirty=!1;var b=this.getListOfTiles();this.markTilesNotAlive(b);if(a.run(function(){return c.addTiles(b,
a)})&&a.run(function(){return c.filterExtentTiles(b,a)})&&a.run(function(){return c.removeTiles(b,a)})&&!a.done){var d=this.sortTiles(b);a.run(function(){return c.displayTiles(d,a)})&&a.run(function(){return c.fetchTiles(d,a)})&&a.run(function(){return c.updateMemoryEstimates(d,a)})||this.setDirty();this.updated()}else this.setDirty()}};b.prototype.markTilesNotAlive=function(a){for(var c=0;c<a.length;c++)a[c].alive=!1};b.prototype.addTiles=function(a,c){var b=this;if(this.suspended)return!1;this.tileDescriptors.forEach(function(e){var d=
b.featureTiles.get(e.id);d?d.alive=!0:c.done||(a.push(b.addTile(e)),c.madeProgress())});return c.hasProgressed};b.prototype.filterExtentTiles=function(a,c){for(var b=0;b<a.length;b++){var d=a[b];if(c.done)break;d.alive&&(d.filtered=!d.intersects(this.filterExtent),d.filtered&&(this.clearTile(d),c.madeProgress()))}return c.hasProgressed};b.prototype.removeTiles=function(a,c){for(var b=a.length-1;0<=b&&!c.done;b--){var d=a[b];d.alive||(this.removeTile(d),b!==a.length-1&&(a[b]=a[a.length-1]),a.pop(),
c.madeProgress())}return c.hasProgressed};b.prototype.sortTiles=function(a){a.sort(function(a,b){return a.descriptor.loadPriority-b.descriptor.loadPriority});return a};b.prototype.displayTiles=function(a,c){for(var b=this,d=this.updateRatio(a),n=function(a){if(!c.run(function(){var c=1>b._fullRatio?d(a)*b._farRatio:1;a.reduceFeatures(c,b.memoryFactor,b.objectIdField)&&b.setDirty();return b.showTile(a)}))return f.setDirty(),"break"},f=this,g=0;g<a.length&&"break"!==n(a[g]);g++);return c.hasProgressed};
b.prototype.fetchTiles=function(a,c){var b=this;if(this.paused)return!1;for(var d=!1,n=function(a){if(!a.needsFetching)return"continue";var b=p.isSome(f.context.memoryCache)&&f.context.memoryCache.pop(a.id);if(b)return a.cache=b,f.setDirty(),f.scheduleUpdated(),c.madeProgress(),"continue";if(f.needsNumFeatures(a)){var b=q.createAbortController(),e=f.fetchTileCount(a,b.signal);f._handleRequest(a,e,b,function(){return a.numFeatures=G.FAILED_FEATURE_COUNT});d=!0;c.madeProgress()}if(c.done)return{value:!0}},
f=this,g=0;g<a.length;g++){var k=a[g],k=n(k);if("object"===typeof k)return k.value}if(d)return c.hasProgressed;for(var n=function(a){if(a.needsFetching){var d=q.createAbortController(),e=h.fetchTile(a,d.signal);h._handleRequest(a,e,d,function(c){a.setFeatures([],0,null);b.invalidateCounts();a.featuresMissing=!1;b.context.logFetchError(J,c)});c.madeProgress();if(c.done)return{value:!0}}},h=this,g=0;g<a.length;g++)if(k=a[g],k=n(k),"object"===typeof k)return k.value;return c.hasProgressed};b.prototype.updateMemoryEstimates=
function(a,c){var b=this;a.some(function(a){return c.run(function(){return a.updateMemoryEstimates()})?!1:(b.setDirty(),!0)});return c.hasProgressed};b.prototype.reclip=function(a,c){var b=this;this.constructed&&(this.featureTiles.forEach(function(d){d.displayingFeatures&&0!==d.displayingFeatures.length&&(d.intersection(c,L),d.intersection(a,M),x.equals(L,M)||b.hideTileFeatures(d))}),this.featureTiles.forEach(function(a){return b.showTile(a)}),this.updated())};b.prototype.updated=function(){var a=
this,c=0;this.paused||this.featureTiles.forEach(function(a){return a.isFetching?++c:0});var b=this._dirty||0<c||!!this.pendingEdits;this._set("updating",b);if(b){var d=b=0,n=0,f=0,g=0,k=0,h=this.displayingFeatureReferences.size/this.numDisplayingFeatureReferences;this.featureTiles.forEach(function(c){++n;if(c.isFetching&&c.hasPreciseFeatureCount){var b=a.maximumFeaturesForTile(c)*(1-c.emptyFeatureRatio);k+=b-(c.displayingFeatures?c.displayingFeatures.length*h:0)}c.needsFetching?++g:0<c.numFeatures&&
(++f,d+=c.numFeatures)});var g=g+c,l=0;d?(b=d,l=Math.min(g*d/f,d)):(b=n,l=g);k=Math.min(this.maximumNumberOfFeatures-this.features.length,k);this._set("updatingTotal",b);this._set("updatingRemaining",l);this._set("expectedFeatureDiff",k)}else this._set("updatingTotal",0),this._set("updatingRemaining",0),this._set("expectedFeatureDiff",0);this.debugger&&this.debugger.update();this.updating||(this.maximumNumberOfFeaturesExceededNext=this.maximumNumberOfFeaturesExceededNext||C()+this.maximumNumberOfFeaturesExceededThrottle)};
b.prototype.updateMaximumNumberOfFeaturesExceeded=function(){if(!this.updating){var a=!1;this.featureTiles.forEach(function(c){a=a||c.perTileMaximumNumberOfFeaturesExceeded});this.maximumNumberOfFeaturesExceededNext=0;this._set("maximumNumberOfFeaturesExceeded",a)}};b.prototype.updateRatio=function(a){for(var c=X(a),b=function(a){return 1/(1<<Math.max(0,c-a.descriptor.lij[0]))},d=0,n=0,f=0;f<a.length;f++)var g=a[f],k=g.numFeatures,d=d+k,n=n+k*b(g);this._fullRatio=Math.min(1,this.maximumNumberOfFeatures/
d);this._farRatio=this.maximumNumberOfFeatures/n;this.scheduleUpdated();return b};b.prototype.maximumFeaturesUpdated=function(a,c){var b=this;a!==c&&(c>a&&this.featureTiles.forEach(function(a){if(a.featuresMissing){var c=b.maximumFeaturesForTile(a);a.features&&(a.features.length>=c||5===a.fetchStatus)||(b.cancelFetchTile(a),b.resetFetchTile(a))}}),this.setDirty())};b.prototype.addTile=function(a){a=new G.FeatureTile(a);this.featureTiles.set(a.id,a);this.resetFetchTile(a);this.referenceDisplayingFeaturesFromRelatedTiles(a);
return a};b.prototype.referenceDisplayingFeaturesFromRelatedTiles=function(a){var c=this,b=a.descriptor.resolution;this.featureTiles.forEach(function(d){if(d.displayingFeatures&&a!==d&&(!a.descriptor.lij||!d.descriptor.lij||V.tilesAreRelated(a.descriptor.lij,d.descriptor.lij))){a.displayingFeatures=a.displayingFeatures||[];var e=0;for(d=d.displayingFeatures;e<d.length;e++){var f=d[e];a.displayingFeatures.push(f);f=c.displayingFeatureReferences.get(v.getObjectId(f,c.objectIdField));f.ref(f.feature,
b);c.numDisplayingFeatureReferences++}}});a.featureLimit=a.displayingFeatures?a.displayingFeatures.length:0};b.prototype.removeTile=function(a){this.clearTile(a);this.featureTiles.delete(a.id)};b.prototype.resetFetchTile=function(a){a.filtered=!a.intersects(this.filterExtent);a.filtered?a.needsFetching&&(a.fetchStatus=4):a.fetchStatus=0};b.prototype.cancelFetchTile=function(a){var c=a.requestController;p.isSome(c)&&(a.requestController=null,a.resetFetching(),c.abort())};b.prototype.fetchTileCount=
function(a,c){return r(this,void 0,void 0,function(){var b;return u(this,function(d){switch(d.label){case 0:return b=a,[4,this.fetchCount(a,c)];case 1:return b.numFeatures=d.sent(),this.updateRatio(this.getListOfTiles()),[2,3===a.fetchStatus?1:0]}})})};b.prototype.fetchTile=function(a,c){return r(this,void 0,void 0,function(){var b,d,n,f,g,k,h,l,m,p,t;return u(this,function(e){switch(e.label){case 0:b=this.maximumFeaturesForTile(a);if(0>=b)return a.setFeatures([],0,null),a.featuresMissing=!1,[2,4];
d=this.getMaxRecordCount(a);n=Math.ceil(b/d);if(A(a)||!this.context.capabilities.supportsMaxRecordCountFactor||a.numFeatures<=b&&n>E.MAX_MAX_RECORD_COUNT_FACTOR)return[2,this.fetchPagedTile(a,c)];f=this.createQuery(a);f.maxRecordCountFactor=Math.ceil(b/d);a.isRefetching&&a.features&&0<a.features.length&&(g=Math.ceil(a.features.length/(1-a.emptyFeatureRatio)/d),f.maxRecordCountFactor=Math.max(g+1,f.maxRecordCountFactor));return[4,this.queryFeatures(f,c)];case 1:return k=e.sent(),h=k.features,l=k.exceededTransferLimit,
m=k.fields,p=l?f.maxRecordCountFactor>=E.MAX_MAX_RECORD_COUNT_FACTOR?5:4:5,a.featuresMissing=h.length<a.numFeatures||l,t=this._removeEmptyFeatures(h),a.setFeatures(h,t,H(m)),this.invalidateCounts(),[2,p]}})})};b.prototype.fetchCount=function(a,c){return r(this,void 0,void 0,function(){return u(this,function(b){return[2,this.context.query.queryFeatureCount(this.createFeatureCountQuery(a),{signal:c})]})})};b.prototype.fetchPagedTile=function(a,c){return r(this,void 0,void 0,function(){var b,d,n,f,g,
k,h,l,m,p,t,q,r;return u(this,function(e){switch(e.label){case 0:f=d=b=0,g=this.maximumFeaturesForTile(a)-f,k=this.getMaxRecordCount(a),h=null,e.label=1;case 1:return l=this.createQuery(a),m=this.setPagingParameters(l,b,g,k),[4,this.queryFeatures(l,c)];case 2:return p=e.sent(),t=p.features,q=p.exceededTransferLimit,r=p.fields,m&&(b+=l.num),f+=t.length,d+=this._removeEmptyFeatures(t),a.featuresMissing=b<a.numFeatures||q,n=n?n.concat(t):t,h=I(h,r),a.setFeatures(n,d,h),this.invalidateCounts(),this.setDirty(),
g=this.maximumFeaturesForTile(a)-f,!m||!q||0>=g?[2,q?4:5]:[3,1];case 3:return[2]}})})};b.prototype.createFeatureCountQuery=function(a){a=this.createQuery(a);this.context.capabilities.supportsCacheHint&&(a.resultType=void 0,a.cacheHint=!0);return a};b.prototype.createQuery=function(a){var b=this.context.createQuery(),e=a.descriptor.extent;e&&(b.geometry=x.toExtent(e,this.context.tilingScheme.spatialReference));this.setResolutionParams(b,a);this.useTileQuery(a)?b.resultType="tile":this.context.capabilities.supportsCacheHint&&
(b.cacheHint=!0);return b};b.prototype.setPagingParameters=function(a,b,e,d){if(!this.context.capabilities.supportsPagination)return!1;a.start=b;0<e&&this.context.capabilities.supportsMaxRecordCountFactor?(a.maxRecordCountFactor=Math.ceil(e/d),a.num=Math.min(a.maxRecordCountFactor*d,e)):a.num=Math.min(d);return!0};b.prototype.getEffectiveTileResolution=function(a){if(null==a.descriptor.resolution)return null;var b="global"===this.context.viewingMode?this.context.tilingScheme.resolutionAtLevel(3):
Infinity;return Math.min(a.descriptor.resolution,b)/this.lodFactor};Object.defineProperty(b.prototype,"supportsResolution",{get:function(){return this.context.capabilities.supportsMultipleResolutions&&"point"!==this.context.geometryType},enumerable:!0,configurable:!0});b.prototype.setResolutionParams=function(a,b){this.supportsResolution&&(b=this.getEffectiveTileResolution(b),null!=b&&(this.context.capabilities.supportsQuantization?a.quantizationParameters=new U.default({mode:"view",originPosition:"upper-left",
tolerance:b,extent:this.context.fullExtent}):"polyline"===this.context.geometryType&&(a.maxAllowableOffset=b)))};b.prototype._removeEmptyFeatures=function(a){for(var b=a.length,e=0;e<a.length;)v.hasVertices(a[e].geometry)?++e:(a[e]=a[a.length-1],--a.length);return b-a.length};b.prototype.needsNumFeatures=function(a){return this.useTileCount&&a.needsFeatureCount&&!A(a)};b.prototype.getMaxRecordCount=function(a){var b=this.context,e=b.tileMaxRecordCount,b=b.maxRecordCount;return this.useTileQuery(a)&&
p.isSome(e)&&0<e&&this.context.capabilities.supportsResultType?e:p.isSome(b)&&0<b?b:Z};b.prototype.useTileQuery=function(a){return A(a)&&this.context.capabilities.supportsCacheHint?!1:this.context.capabilities.supportsResultType};b.prototype._handleRequest=function(a,b,e,d){var c=this;a.fetchStatus=a.needsRefetching?3:2;a.requestController=e;var f=!1;b.then(function(b){a.requestController=null;a.fetchStatus=b}).catch(function(b){a.requestController===e&&(a.requestController=null,a.fetchStatus=4);
q.isAbortError(b)?f=!0:d(b)}).then(function(){f||c.setDirty();c.scheduleUpdated()})};b.prototype.scheduleUpdated=function(){var a=this;this.handles&&!this.handles.has("scheduleUpdated")&&this.handles.add(S.schedule(function(){a.handles.remove("scheduleUpdated");a.updated()}),"scheduleUpdated")};b.prototype.showTile=function(a){if(a.displayingFeatures&&!a.needsDisplayUpdate)return!1;var b=a.features;if(0===a.featureLimit||!b)return b=a.displayingFeatures&&0<a.displayingFeatures.length,this.hideTileFeatures(a),
a.displayingFeatures=[],b;var e=a.descriptor.resolution,d=this.changes.updates,h=this.changes.adds,f=Math.min(a.featureLimit,b.length);a.featureLimit=f;for(var g=0;g<f;++g){var k=b[g],l=v.getObjectId(k,this.objectIdField),m=this.displayingFeatureReferences.get(l);m?(k=m.ref(k,e),k.oldVersion!==k.newVersion&&(d.removes.push(k.oldVersion),d.adds.push(k.newVersion))):(this.displayingFeatureReferences.set(l,new this.FeatureReferenceClass(k,e)),h.push(k));this.numDisplayingFeatureReferences++}this.hideTileFeatures(a);
this.applyChanges();a.displayingFeatures=b.slice(0,f);return!0};b.prototype.hideTile=function(a){this.cancelFetchTile(a);this.hideTileFeatures(a)};b.prototype.hideTileFeatures=function(a){if(a.displayingFeatures){for(var b=this.changes.updates,e=this.changes.removes,d=0,h=a.displayingFeatures;d<h.length;d++){var f=v.getObjectId(h[d],this.objectIdField),g=this.displayingFeatureReferences.get(f);g&&((g=g.unref(a.descriptor.resolution),this.numDisplayingFeatureReferences--,g)?g.oldVersion!==g.newVersion&&
(null==g.newVersion?(this.displayingFeatureReferences.delete(f),e.push(g.oldVersion)):(b.adds.push(g.newVersion),b.removes.push(g.oldVersion))):console.error("Hiding unreferenced feature"))}this.applyChanges();a.displayingFeatures=null}};b.prototype.applyChanges=function(){var a=this.changes.updates;0<a.removes.length&&(this.features.removeMany(a.removes),a.removes.length=0);0<a.adds.length&&(this.features.addMany(a.adds),a.adds.length=0);for(var a=this.changes.adds,b=this.changes.removes,e=Math.min(a.length,
b.length),d=0;d<e;){var h=Math.min(d+aa,e);this.features.addMany(a.slice(d,h));this.features.removeMany(b.slice(d,h));d=h}a.length>e&&this.features.addMany(0===d?a:a.slice(d));b.length>e&&this.features.removeMany(0===d?b:b.slice(d));a.length=0;b.length=0};b.prototype.clearTile=function(a){this.hideTile(a);a.features&&p.isSome(this.context.memoryCache)&&this.context.memoryCache.put(a.id,a.cache,16+a.estimatedSize);a.setFeatures(null,0,null);this.invalidateCounts()};b.prototype.invalidateCounts=function(){this.notifyChange("totalVertices");
this.notifyChange("totalFeatures");this.notifyChange("memoryForUnusedFeatures")};b.prototype.getListOfTiles=function(){var a=Array(this.featureTiles.size),b=0;this.featureTiles.forEach(function(c){return a[b++]=c});return a};Object.defineProperty(b.prototype,"storedFeatures",{get:function(){return this.getListOfTiles().reduce(function(a,b){return a+(b.features?b.features.length:0)},0)},enumerable:!0,configurable:!0});b.prototype.maximumFeaturesForTile=function(a){var b=a.hasPreciseFeatureCount?a.numFeatures:
Infinity;return Math.min(Math.ceil((a.hasPreciseFeatureCount?b:this.maximumNumberOfFeatures)*(1>this._fullRatio?this._farRatio:1)/(1-a.emptyFeatureRatio)),b)};Object.defineProperty(b.prototype,"test",{get:function(){var a=this;return{update:function(b){return a.update(b)},getFeatureTileById:function(b){return a.featureTiles.get(b)},forEachFeatureTile:function(b){return a.featureTiles.forEach(b)}}},enumerable:!0,configurable:!0});m([l.property({constructOnly:!0})],b.prototype,"features",void 0);m([l.property()],
b.prototype,"tileDescriptors",void 0);m([l.property({value:Infinity})],b.prototype,"maximumNumberOfFeatures",null);m([l.property({value:1})],b.prototype,"memoryFactor",null);m([l.property({value:1})],b.prototype,"lodFactor",null);m([l.property()],b.prototype,"useTileCount",void 0);m([l.property({readOnly:!0})],b.prototype,"updating",void 0);m([l.property({readOnly:!0})],b.prototype,"updatingTotal",void 0);m([l.property({readOnly:!0})],b.prototype,"updatingRemaining",void 0);m([l.property({readOnly:!0})],
b.prototype,"expectedFeatureDiff",void 0);m([l.property({readOnly:!0})],b.prototype,"memoryForUnusedFeatures",null);m([l.property({readOnly:!0})],b.prototype,"maximumNumberOfFeaturesExceeded",void 0);m([l.property({constructOnly:!0})],b.prototype,"maximumNumberOfFeaturesExceededThrottle",void 0);m([l.property({readOnly:!0})],b.prototype,"totalVertices",null);m([l.property({readOnly:!0})],b.prototype,"totalFeatures",null);m([l.property()],b.prototype,"filterExtent",null);m([l.property({constructOnly:!0})],
b.prototype,"context",void 0);return b=m([l.subclass("esri.views.3d.layers.support.FeatureTileFetcher3D")],b)}(l.declared(O));w.FeatureTileFetcher3D=z;w.contextCapabilitiesFromLayer=function(h){var b=h.capabilities.query;a:switch(h.geometryType){case "polyline":h=!0;break a;case "polygon":h=h.capabilities&&h.capabilities.query&&h.capabilities.query.supportsQuantization;break a;default:h=!1}return{supportsMultipleResolutions:h,supportsPagination:!(!b||!b.supportsPagination),supportsResultType:!(!b||
!b.supportsResultType),supportsCacheHint:!(!b||!b.supportsCacheHint),supportsQuantization:!(!b||!b.supportsQuantization),supportsQuantizationEditMode:!(!b||!b.supportsQuantizationEditMode),supportsMaxRecordCountFactor:!(!b||!b.supportsMaxRecordCountFactor),supportsFormatPBF:!(!b||!b.supportsFormatPBF)}};var Z=2E3,L=x.create(),M=x.create(),Y=6E5,aa=200;w.default=z});