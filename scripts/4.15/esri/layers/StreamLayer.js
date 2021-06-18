// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/generatorHelper ../core/tsSupport/decorateHelper ../core/tsSupport/awaiterHelper ../core/tsSupport/declareExtendsHelper ../core/tsSupport/assignHelper ../geometry ../PopupTemplate ../renderers ../request ../symbols ../core/deprecate ../core/Error ../core/global ../core/jsonMap ../core/Logger ../core/maybe ../core/MultiOriginJSONSupport ../core/promiseUtils ../core/accessorSupport/decorators ../core/accessorSupport/ensureType ./Layer ./mixins/ArcGISService ./mixins/OperationalLayer ./mixins/PortalLayer ./mixins/RefreshableLayer ./mixins/ScaleRangeLayer ./mixins/TemporalLayer ./support/commonProperties ./support/featureReductionUtils ./support/Field ./support/FieldsIndex ./support/fieldUtils ./support/fieldUtils ./support/LabelClass ./support/labelingInfo ./support/PurgeOptions ../renderers/support/jsonUtils ../renderers/support/styleUtils ../support/popupUtils ../symbols/support/ElevationInfo ../symbols/support/jsonUtils ../tasks/support/Query".split(" "),
function(ca,da,z,d,A,B,k,l,C,f,D,m,t,E,F,G,H,I,J,u,c,K,L,M,N,O,P,Q,R,g,n,S,T,U,v,V,W,w,p,X,Y,Z,x,aa){var q=H.getLogger("esri.layers.StreamLayer"),ba=new G.default({esriGeometryPoint:"point",esriGeometryMultipoint:"multipoint",esriGeometryPolyline:"polyline",esriGeometryPolygon:"polygon"});return function(y){function a(b){b=y.call(this,b)||this;b.copyright=null;b.definitionExpression=null;b.displayField=null;b.elevationInfo=null;b.featureReduction=null;b.fields=null;b.geometryDefinition=null;b.geometryType=
null;b.labelsVisible=!0;b.labelingInfo=null;b.legendEnabled=!0;b.objectIdField=null;b.operationalLayerType="ArcGISStreamLayer";b.popupEnabled=!0;b.popupTemplate=null;b.purgeOptions=new w;b.screenSizePerspectiveEnabled=!0;b.sourceJSON=null;b.spatialReference=l.SpatialReference.WGS84;b.type="stream";b.url=null;return b}B(a,y);a.prototype.normalizeCtorArgs=function(b,a){return"string"===typeof b?k({url:b},a):b};a.prototype.load=function(b){var a=this;"WebSocket"in F||u.reject(new E("stream-layer:websocket-unsupported",
"WebSocket is not supported in this browser. StreamLayer will not have real-time connection with the stream service."));var c=I.isSome(b)?b.signal:null;this.addResolvingPromise(this.loadFromPortal({supportedTypes:["Stream Service"]},b).catch(function(b){return b}).then(function(){return a._fetchService(c)}));return u.resolve(this)};Object.defineProperty(a.prototype,"defaultPopupTemplate",{get:function(){return this.createPopupTemplate()},enumerable:!0,configurable:!0});a.prototype.readFeatureReduction=
function(b,a){return n.read(b,a)};a.prototype.writeWebSceneFeatureReduction=function(b,a,c,d){n.writeTarget(b,a,"layerDefinition.featureReduction",d)};Object.defineProperty(a.prototype,"fieldsIndex",{get:function(){return new T(this.fields)},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"maximumTrackPoints",{get:function(){t.deprecatedProperty(q,"maximumTrackPoints",{replacement:"purgeOptions.maxObservations",version:"4.15"});return this.purgeOptions.maxObservations},set:function(b){t.deprecatedProperty(q,
"maximumTrackPoints",{replacement:"purgeOptions.maxObservations",version:"4.15"});var a=this.purgeOptions.clone();a.maxObservations=b;this.purgeOptions=a},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"renderer",{set:function(b){U.fixRendererFields(b,this.fields);this._set("renderer",b)},enumerable:!0,configurable:!0});a.prototype.readRenderer=function(b,a,c){a=a.layerDefinition||a;var d=a.drawingInfo&&a.drawingInfo.renderer||void 0,h,e;if(d)(h=p.read(d,a,c)||void 0)||q.error("Failed to create renderer",
{rendererDefinition:a.drawingInfo.renderer,layer:this,context:c});else if(a.defaultSymbol)x.read(a.defaultSymbol,a,c),a.types&&a.types.length?(h=new f.UniqueValueRenderer({defaultSymbol:e,field:a.typeIdField}),a.types.forEach(function(a){d.addUniqueValueInfo(a.id,x.read(a.symbol,a,c))})):h=new f.SimpleRenderer({symbol:e});else if("Table"!==a.type){switch(a.geometryType){case "esriGeometryPoint":case "esriGeometryMultipoint":e=new m.SimpleMarkerSymbol;break;case "esriGeometryPolyline":e=new m.SimpleLineSymbol;
break;case "esriGeometryPolygon":e=new m.SimpleFillSymbol}h=e&&new f.SimpleRenderer({symbol:e})}return h};a.prototype.writeRenderer=function(a,c,d,r){p.writeTarget(a,c,d,r)};a.prototype.writeWebSceneRenderer=function(a,c,d,r){p.writeTarget(a,c,"layerDefinition.drawingInfo.renderer",r)};a.prototype.createPopupTemplate=function(a){return Y.createPopupTemplate(this,a)};a.prototype.createQuery=function(){var a=new aa;a.returnGeometry=!0;a.outFields=["*"];a.where=this.definitionExpression||"1\x3d1";return a};
a.prototype.getFieldDomain=function(a,c){if(!this.fields)return null;var b=null;this.fields.some(function(c){c.name===a&&(b=c.domain);return!!b});return b};a.prototype.getField=function(a){return this.fieldsIndex.get(a)};a.prototype._fetchService=function(a){return A(this,void 0,void 0,function(){var c;return z(this,function(b){switch(b.label){case 0:return this.sourceJSON?[3,2]:[4,D(this.parsedUrl.path,{query:k({f:"json"},this.parsedUrl.query),responseType:"json",signal:a})];case 1:c=b.sent().data,
this.sourceJSON=k({},c,{objectIdField:"__esri_stream_id__"}),b.label=2;case 2:return this.read(this.sourceJSON,{origin:"service",url:this.parsedUrl}),v.fixRendererFields(this.renderer,this.fields),v.fixTimeInfoFields(this.timeInfo,this.fields),[2,X.loadStyleRenderer(this,{origin:"service"})]}})})};d([c.property({type:String})],a.prototype,"copyright",void 0);d([c.property({readOnly:!0,dependsOn:["fields","title"]})],a.prototype,"defaultPopupTemplate",null);d([c.property({type:String})],a.prototype,
"definitionExpression",void 0);d([c.property({type:String})],a.prototype,"displayField",void 0);d([c.property({type:Z})],a.prototype,"elevationInfo",void 0);d([c.reader("featureReduction",["layerDefinition.featureReduction"])],a.prototype,"readFeatureReduction",null);d([c.writer("web-scene","featureReduction",{"layerDefinition.featureReduction":{types:n.webSceneFeatureReductionTypes}})],a.prototype,"writeWebSceneFeatureReduction",null);d([c.property({type:[S]})],a.prototype,"fields",void 0);d([c.property({readOnly:!0,
dependsOn:["fields"]})],a.prototype,"fieldsIndex",null);d([c.property({type:l.Extent})],a.prototype,"geometryDefinition",void 0);d([c.property({type:["point","polygon","polyline","multipoint"],json:{read:{reader:ba.read}}})],a.prototype,"geometryType",void 0);d([c.property(g.labelsVisible)],a.prototype,"labelsVisible",void 0);d([c.property({type:[V],json:{read:{source:"layerDefinition.drawingInfo.labelingInfo",reader:W.reader},write:{target:"layerDefinition.drawingInfo.labelingInfo"}}})],a.prototype,
"labelingInfo",void 0);d([c.property(g.legendEnabled)],a.prototype,"legendEnabled",void 0);d([c.property({type:["show","hide"]})],a.prototype,"listMode",void 0);d([c.property({type:K.Integer})],a.prototype,"maximumTrackPoints",null);d([c.property({type:String})],a.prototype,"objectIdField",void 0);d([c.property({value:"ArcGISStreamLayer",type:["ArcGISStreamLayer"]})],a.prototype,"operationalLayerType",void 0);d([c.property(g.popupEnabled)],a.prototype,"popupEnabled",void 0);d([c.property({type:C,
json:{read:{source:"popupInfo"},write:{target:"popupInfo"}}})],a.prototype,"popupTemplate",void 0);d([c.property({type:w})],a.prototype,"purgeOptions",void 0);d([c.property({types:f.rendererTypes,json:{origins:{service:{write:{target:"drawingInfo.renderer",enabled:!1}}},write:{target:"layerDefinition.drawingInfo.renderer"}}})],a.prototype,"renderer",null);d([c.reader("service","renderer",["drawingInfo.renderer","defaultSymbol","type"]),c.reader("renderer",["layerDefinition.drawingInfo.renderer","layerDefinition.defaultSymbol",
"layerDefinition.type"])],a.prototype,"readRenderer",null);d([c.writer("renderer")],a.prototype,"writeRenderer",null);d([c.writer("web-scene","renderer",{"layerDefinition.drawingInfo.renderer":{types:f.webSceneRendererTypes}})],a.prototype,"writeWebSceneRenderer",null);d([c.property(g.screenSizePerspectiveEnabled)],a.prototype,"screenSizePerspectiveEnabled",void 0);d([c.property({type:l.SpatialReference,json:{origins:{service:{read:{source:"spatialReference"}}}}})],a.prototype,"spatialReference",
void 0);d([c.property({json:{read:!1}})],a.prototype,"type",void 0);d([c.property(g.url)],a.prototype,"url",void 0);return a=d([c.subclass("esri.layers.StreamLayer")],a)}(c.declared(R.TemporalLayer(Q.ScaleRangeLayer(P.RefreshableLayer(M.ArcGISService(N.OperationalLayer(O.PortalLayer(J.MultiOriginJSONMixin(L)))))))))});