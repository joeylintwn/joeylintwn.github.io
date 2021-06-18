// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/decorateHelper ../../../../core/tsSupport/declareExtendsHelper ../../../../core/Handles ../../../../core/accessorSupport/decorators ./TileTree3DDebugger ../../../support/WatchUpdatingTracking".split(" "),function(c,e,f,g,h,d,k,l){Object.defineProperty(e,"__esModule",{value:!0});c=function(c){function a(b){b=c.call(this,b)||this;b.watchUpdatingTracking=new l.WatchUpdatingTracking;b.handles=new h;return b}g(a,c);a.prototype.initialize=function(){var b=
this;this.handles.add(this.view.featureTiles.addClient());this.watchUpdatingTracking.addOnCollectionPropertyChange(this.view.featureTiles,"tiles",function(){return b.update()},2)};a.prototype.destroy=function(){this.handles&&(this.handles.destroy(),this.handles=null);this.watchUpdatingTracking.destroy()};a.prototype.update=function(){var b=this;this.clear();if(this.enabled){var a=this.view.featureTiles.tiles.toArray().sort(function(a,b){return a.loadPriority-b.loadPriority});this._update(a,function(a){a=
a.lij;return b.view.featureTiles.tilingScheme.getExtentGeometry(a[0],a[1],a[2])},{getLoadPriority:function(a){return a.loadPriority}})}};f([d.property({readOnly:!0})],a.prototype,"watchUpdatingTracking",void 0);f([d.property({readOnly:!0,aliasOf:"watchUpdatingTracking.updating"})],a.prototype,"updating",void 0);return a=f([d.subclass("esri.views.3d.layers.support.FeatureTileTree3DDebugger")],a)}(d.declared(k.TileTree3DDebugger));e.FeatureTileTree3DDebugger=c;e.default=c});