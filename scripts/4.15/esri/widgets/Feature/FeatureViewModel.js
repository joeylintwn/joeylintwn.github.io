// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/tsSupport/assignHelper ../../core/tsSupport/generatorHelper ../../core/tsSupport/awaiterHelper ../../Graphic ../../intl ../../core/Error ../../core/Handles ../../core/lang ../../core/Logger ../../core/promiseUtils ../../core/string ../../core/throttle ../../core/watchUtils ../../core/accessorSupport/decorators ../../intl/date ../../intl/number ../../layers/support/fieldUtils ../../popup/content/TextContent ../../popup/content/support/ChartMediaInfoValueSeries ../../popup/support/FieldInfoFormat ../Attachments/AttachmentsViewModel ./support/featureUtils ./support/RelatedFeatures ../support/widget".split(" "),
function(L,aa,M,k,r,w,x,N,z,E,O,q,P,m,A,Q,R,g,S,F,T,U,V,W,G,u,X,H){function Y(){return x(this,void 0,void 0,function(){return w(this,function(g){return[2,m.create(function(d){L(["../../support/arcadeUtils"],function(a){d(a)})})]})})}function y(g){var d=/(\n)/gi;return"string"===typeof g?g.replace(d,'\x3cbr class\x3d"esri-text-new-line" /\x3e'):g}function B(g,d){return g&&"function"===typeof g.getField?g.getField(d):null}function C(g){return g.replace(/[\u00A0-\u9999<>\&]/gim,function(d){return"\x26#"+
d.charCodeAt(0)+";"})}var Z=["$datastore","$map","$layer"],v=P.getLogger("esri.widgets.FeatureViewModel"),J=/^\s*expression\//i,D=S.convertDateFormatToIntlOptions("short-date-short-time");return function(I){function d(a){var b=I.call(this,a)||this;b._handles=new O;b._featureAbortController=null;b._graphicChangedThrottled=Q.throttle(b._graphicChanged,1,b);b._effectivePopupTemplate=null;b._graphic=null;b._fieldInfoMap=null;b.attachmentsViewModel=new G;b.content=null;b.defaultPopupTemplateEnabled=!1;
b.formattedAttributes=null;b.graphic=null;b.lastEditInfo=null;b.title="";b.view=null;b._handles.add(R.init(b,"graphic graphic.sourceLayer.popupTemplate.title graphic.sourceLayer.popupTemplate.content graphic.sourceLayer.popupTemplate.expressionInfos graphic.sourceLayer.popupTemplate.fieldInfos graphic.sourceLayer.popupTemplate.lastEditInfoEnabled graphic.sourceLayer.popupTemplate.outFields graphic.sourceLayer.popupTemplate.relatedRecordsInfo graphic.popupTemplate.title graphic.popupTemplate.content graphic.popupTemplate.expressionInfos graphic.popupTemplate.fieldInfos graphic.popupTemplate.lastEditInfoEnabled graphic.popupTemplate.outFields graphic.popupTemplate.relatedRecordsInfo".split(" "),
function(){return b._graphicChangedThrottled()}));return b}M(d,I);d.prototype.destroy=function(){this._clear();this._cancelFeatureQuery();this._handles.destroy();this._graphic=this.graphic=this._handles=null;this._destroyAttachmentsViewModel();this._set("attachmentsViewModel",null)};Object.defineProperty(d.prototype,"spatialReference",{get:function(){return this.get("view.spatialReference")||null},set:function(a){void 0===a?this._clearOverride("spatialReference"):this._override("spatialReference",
a)},enumerable:!0,configurable:!0});Object.defineProperty(d.prototype,"map",{get:function(){return this.get("view.map")||null},set:function(a){void 0===a?this._clearOverride("map"):this._override("map",a)},enumerable:!0,configurable:!0});Object.defineProperty(d.prototype,"waitingForContent",{get:function(){return!!this._featureAbortController},enumerable:!0,configurable:!0});d.prototype._clear=function(){this._set("title","");this._set("content",null);this._set("formattedAttributes",null)};d.prototype._graphicChanged=
function(){return x(this,void 0,void 0,function(){var a,b,c,e;return w(this,function(f){switch(f.label){case 0:this._cancelFeatureQuery();this._clear();this._graphic=b=(a=this.graphic)?a.clone():null;if(!b)return[2];this._featureAbortController=c=m.createAbortController();f.label=1;case 1:return f.trys.push([1,3,,4]),[4,this._queryFeature({signal:c.signal})];case 2:return f.sent(),[3,4];case 3:return e=f.sent(),v.error("error","error loading template",e),[3,4];case 4:return this._featureAbortController=
null,[2]}})})};d.prototype._cancelFeatureQuery=function(){var a=this._featureAbortController;a&&a.abort();this._featureAbortController=null};d.prototype._compileContent=function(a){var b=this;if(a&&(a.nodeName||a&&H.hasDomNode(a)||H.isWidget(a)))return a;if(this._graphic){if("string"===typeof a)return this._compileText(new U({text:a})).text;if(Array.isArray(a))return a.map(function(a){if("attachments"===a.type)return b._compileAttachments(a);if("fields"===a.type)return b._compileFields(a);if("media"===
a.type)return b._compileMedia(a);if("text"===a.type)return b._compileText(a)});a&&v.warn("invalid content type.")}};d.prototype._destroyAttachmentsViewModel=function(){var a=this.attachmentsViewModel;a&&!a.destroyed&&a.destroy()};d.prototype._compileAttachments=function(a){this.attachmentsViewModel.graphic=this.graphic;return a};d.prototype._compileFields=function(a){var b=this,c=this._effectivePopupTemplate;a=q.clone(a);var e=c&&c.expressionInfos,c=a.fieldInfos?void 0:c&&c.fieldInfos,c=a.fieldInfos||
q.clone(c),f=[];c&&c.forEach(function(a){var c=a.fieldName.toLowerCase();if(!a.hasOwnProperty("visible")||a.visible)c=b._isExpressionField(c)?b._getExpressionInfo(e,c):null,a.label=c?c.title:a.label,f.push(a)});a.fieldInfos=f;return a};d.prototype._setImageValue=function(a){var b=a.value,c=a.formattedAttributes;a=a.layer;var e=b.linkURL,f=b.sourceURL;f&&(f=this._fixTokens(f,a),b.sourceURL=this._substituteAttributes(c,f));e&&(a=this._fixTokens(e,a),b.linkURL=this._substituteAttributes(c,a))};d.prototype._compileMedia=
function(a){var b=this,c=this._graphic;a=q.clone(a);var e=a.mediaInfos,f=c.attributes,d=u.getSourceLayer(c),l=this.formattedAttributes.global,g=r({},l,f);a.mediaInfos=e&&e.map(function(a){if(a=q.clone(a)){var c=a.title?b._processFieldsInLinks(a.title,g):"",e=a.caption?b._processFieldsInLinks(a.caption,g):"";a.title=c?b._substituteAttributes(l,c):"";a.caption=e?b._substituteAttributes(l,e):"";if("image"===a.type)return c=a.value,b._setImageValue({value:c,formattedAttributes:l,layer:d}),a.value.sourceURL?
a:void 0;if("pie-chart"===a.type||"line-chart"===a.type||"column-chart"===a.type||"bar-chart"===a.type)return c=a.value,b._setChartValue({value:c,chartType:a.type,attributes:f,formattedAttributes:l,layer:d}),a}}).filter(Boolean);return a};d.prototype._normalizeTemplateFields=function(a){var b=this._fieldInfoMap.get(a.toLowerCase());return"{"+(b&&b.fieldName||a)+"}"};d.prototype._substituteAttributes=function(a,b){var c=this;return(""+this._removeEmptyHref(A.replace(A.replace(b,function(a){return c._normalizeTemplateFields(a)}),
a))).trim()};d.prototype._compileText=function(a){if((a=q.clone(a))&&a.text){var b=this.formattedAttributes.global,c=this._processFieldsInLinks(a.text,r({},b,this._graphic.attributes));a.text=this._substituteAttributes(b,c)}return a};d.prototype._formatEditInfo=function(a,b){var c=a.creatorField,e=a.creationDateField,f=a.editorField;if(b){a=b[a.editDateField];if("number"===typeof a)return b=b[f],c=z.formatDate(a,D),{type:"edit",date:c,user:b};e=b[e];if("number"===typeof e)return b=b[c],c=z.formatDate(e,
D),{type:"create",date:c,user:b}}};d.prototype._compileLastEditInfo=function(){var a=this._effectivePopupTemplate,b=this._graphic;if(a){var a=a.lastEditInfoEnabled,c=b.get("sourceLayer.editFieldsInfo");if(a&&c)return this._formatEditInfo(c,b.attributes)}};d.prototype._compileTitle=function(a){var b=this._graphic.attributes,c=this.formattedAttributes.global;return a?(a=this._processFieldsInLinks(a,r({},c,b)),this._substituteAttributes(c,a)):""};d.prototype._getExpressionInfo=function(a,b){if(this._isExpressionField(b)){var c=
b.replace(J,"").toLowerCase(),e;a.some(function(a){return a.name.toLowerCase()===c?(e=a,!0):!1});return e}};d.prototype._fixTokens=function(a,b){return a.replace(/(\{([^\{\r\n]+)\})/g,function(a,e,f){return(a=B(b,f))?"{"+a.name+"}":e})};d.prototype._encodeAttributes=function(a){var b=a?q.clone(a):{};Object.keys(b).forEach(function(a){var c=b[a];"string"===typeof c&&(c=encodeURIComponent(c).replace(/\'/g,"\x26apos;"),b[a]=c)});return b};d.prototype._createfieldInfoMap=function(a,b){var c=this,e=new Map;
a&&a.forEach(function(a){var f=c._getFixedFieldName(a.fieldName,b);a.fieldName=f;e.set(f.toLowerCase(),a)});return e};d.prototype._formatAttributeValue=function(a){var b=a.value,c=a.fieldName,e=a.fieldInfos,f=a.fieldInfoMap;a=a.layer;if(null==b)return b;var d=this._getDomainName(c,b);return d||(d=this._getTypeName(c))?d:f.get(c.toLowerCase())?this._formatValueToFieldInfo(b,{fieldInfos:e,fieldName:c,layer:a}):(e=a&&a.fieldsIndex)&&e.isDateField(c)?z.formatDate(b,D):y(b)};d.prototype._formatAttributes=
function(a){var b=this,c=this._graphic,e=u.getSourceLayer(c),f=q.clone(c.attributes);this.addRelatedFeatureAttributes(f);var d=this._createfieldInfoMap(a,e);this._fieldInfoMap=d;Object.keys(f).forEach(function(c){f[c]=b._formatAttributeValue({fieldName:c,fieldInfos:a,fieldInfoMap:d,layer:e,value:f[c]})});return f};d.prototype._parseNumberFromString=function(a,b){return"string"!==typeof a||!b||null!=b.dateFormat||null==b.places&&null==b.digitSeparator||(b=Number(a),isNaN(b))?a:b};d.prototype._formatValueToFieldInfo=
function(a,b){var c=b.fieldName,e=this._getFieldInfo(b.fieldInfos,c),f=q.clone(e),e=b.preventPlacesFormatting;(b=B(b.layer,c))&&"date"===b.type&&(b=f.format||new W,b.dateFormat=b.dateFormat||"short-date-short-time",f.format=b);f=f&&f.format;a=this._parseNumberFromString(a,f);return"string"===typeof a||null==a||null==f?a:e?F.formatNumber(a,r({},F.convertNumberFormatToIntlOptions(f),{minimumFractionDigits:0,maximumFractionDigits:20})):f.format(a)};d.prototype._getDomainName=function(a,b){if(this.isRelatedField(a))return null;
var c=this._graphic,e=u.getSourceLayer(c);return e&&"function"===typeof e.getFieldDomain?(a=e.getFieldDomain(a,{feature:c}))&&"coded-value"===a.type?a.getName(b):null:null};d.prototype._getFieldInfo=function(a,b){if(a&&a.length&&b){var c=b.toLowerCase(),e=void 0;a.some(function(a){return a.fieldName&&a.fieldName.toLowerCase()===c?(e=a,!0):!1});return e}};d.prototype._getTypeName=function(a){if(this.isRelatedField(a))return null;var b=this._graphic,c=u.getSourceLayer(b);if(!c||"function"!==typeof c.getFeatureType)return null;
var e=c.typeIdField;return e&&a===e?(a=c.getFeatureType(b))?a.name:null:null};d.prototype._removeEmptyHref=function(a){return a.replace(/href=(""|'')/gi,"")};d.prototype._processFieldsInLinks=function(a,b){var c=this.get("_graphic.layer");a=this._fixTokens(a,c);var e=this._encodeAttributes(b),c=/href\s*=\s*(?:\"([^\"]+)\"|\'([^\']+)\')/gi;return a?a.replace(c,function(a,c,d){c=(""+(c||d)).trim();return A.replace(a,c&&"{"===c[0]?b:e)}):a};d.prototype._getTitle=function(){var a=this._effectivePopupTemplate,
b=this._graphic,a=a&&a.title,b="function"===typeof a?a.call(null,{graphic:b}):a;return m.isPromiseLike(b)?b:m.resolve(b)};d.prototype._getContent=function(){var a=this._effectivePopupTemplate,b=this._graphic,a=a&&a.content,b="function"===typeof a?a.call(null,{graphic:b}):a;return m.isPromiseLike(b)?b:m.resolve(b)};d.prototype._querySourceLayer=function(a,b){var c=a.layer,e=a.graphic,f=a.outFields;a=a.objectIds;var d=a[0];if("number"!==typeof d)return b="Could not query required fields for the specified feature. The feature's ID is invalid.",
c={layer:c,graphic:e,objectId:d,requiredFields:f},f=new E("layer-query-features-invalid-objectid",b,c),v.warn(b,c),m.reject(f);if("function"!==typeof c.queryFeatures)return b="The specified layer does not support the method 'queryFeatures'. The following fields will not be available.",c={layer:c,graphic:e,requiredFields:f},f=new E("layer-query-features-unsupported",b,c),v.warn(b,c),m.reject(f);e=c.createQuery();e.objectIds=a;e.outFields=f;e.returnGeometry=!0;return c.queryFeatures(e,b).then(function(a){return a.features[0]})};
d.prototype._queryRequiredFieldsFeature=function(a){var b=this,c=this._graphic,e=this._effectivePopupTemplate,f=c.sourceLayer;return f&&e?("function"===typeof f.load?f.load(a):m.resolve()).then(function(){var d=[c.attributes[f.objectIdField]];return e.getRequiredFields(f.fields).then(function(e){return T.featureHasFields(e,c)?null:b._querySourceLayer({layer:f,graphic:c,outFields:e,objectIds:d},a)})}):m.resolve(null)};d.prototype._queryFeature=function(a){var b=this,c=this._featureAbortController,
e=this._graphic;this._effectivePopupTemplate=e&&e.getEffectivePopupTemplate(this.defaultPopupTemplateEnabled);return m.eachAlways({content:this._getContent(),title:this._getTitle()}).then(function(f){var d=f.content.value,l=f.title.value;if(c===b._featureAbortController&&e){f=b._checkForRelatedFeatures(d,a);var g=b._createFormattedExpressions().then(function(a){e.attributes=r({},e.attributes,a)}),t=b._queryRequiredFieldsFeature(a).then(function(a){a&&(e.geometry=a.geometry,e.attributes=r({},e.attributes,
a.attributes))});return m.eachAlways([f,g,t]).then(function(){if(c===b._featureAbortController&&e){b._set("formattedAttributes",b._createFormattedAttributes(d));b._set("title",b._compileTitle(l));var a=b._compileLastEditInfo();b._set("lastEditInfo",a||null);a=b._compileContent(d);b._set("content",a||null);return a}})}})};d.prototype._isExpressionField=function(a){return J.test(a)};d.prototype._formatArcadeArray=function(a){return'\x3cul class\x3d"esri-widget__list"\x3e'+a.map(function(a){return"\x3cli\x3e"+
("string"===typeof a?y(C(a)):a)+"\x3c/li\x3e"}).join("")+"\x3c/ul\x3e"};d.prototype._formatArcadeDictionary=function(a){return'\x3ctable class\x3d"esri-widget__table"\x3e'+a.keys().map(function(b){var c=a.field(b),c="string"===typeof c?y(C(c)):c;return"\x3ctr\x3e\x3cth\x3e"+b+"\x3c/th\x3e\x3ctd\x3e"+c+"\x3c/td\x3e\x3c/tr\x3e"}).join("")+"\x3c/table\x3e"};d.prototype._createFormattedExpressions=function(){return x(this,void 0,void 0,function(){var a,b,c,e,d,g,l,n,t,h,p,k=this;return w(this,function(f){switch(f.label){case 0:return a=
this,b=a._effectivePopupTemplate,c=a._graphic,e=b&&b.expressionInfos,d=[],g={},e&&e.length?[4,Y()]:[2,g];case 1:l=f.sent();n=function(a){var b="expression/"+a.name,e=l.createSyntaxTree(a.expression),f=Z.filter(function(a){return l.hasVariable(e,a)});a=l.loadScriptDependencies(e,!0,f).then(function(){return x(k,void 0,void 0,function(){var a,d,h,n,K=this;return w(this,function(k){a=this.spatialReference;d=l.getViewInfo({spatialReference:a});h=l.createExecContext(c,d);h.useAsync=!0;this._addVarsToContext(l,
f,h,d);n=l.createFunction(e,h);return[2,l.executeAsyncFunction(n,h).then(function(a){g[b]="string"===typeof a?y(C(a)):Array.isArray(a)?K._formatArcadeArray(a):a&&"esri.arcade.Dictionary"===a.declaredClass?K._formatArcadeDictionary(a):a},function(a){return v.error("arcade-execution-error",a)})]})})});d.push(a)};t=0;for(h=e;t<h.length;t++)p=h[t],n(p);return[2,m.eachAlways(d).then(function(){return g})]}})})};d.prototype._addVarsToContext=function(a,b,c,e){var d=this.graphic,g=this.map;b.forEach(function(b){b=
b.toLowerCase();var f={map:g,spatialReference:e.sr};"$map"===b&&(c.vars[b]=a.convertMapToFeatureSetCollection(f));"$layer"===b&&(c.vars[b]=a.convertFeatureLayerToFeatureSet(d.sourceLayer,e.sr));"$datastore"===b&&(c.vars[b]=a.convertServiceUrlToWorkspace(d.sourceLayer.url,e.sr))})};d.prototype._createFormattedAttributes=function(a){var b=this,c=this._effectivePopupTemplate,e={global:this._formatAttributes(c&&c.fieldInfos),content:[]};Array.isArray(a)&&a.forEach(function(a,c){"fields"===a.type&&a.fieldInfos&&
(e.content[c]=b._formatAttributes(a.fieldInfos))});return e};d.prototype._getAllFieldInfos=function(a){var b=this._effectivePopupTemplate,c=[];(b=b&&b.fieldInfos)&&c.push.apply(c,b);if(!a||!Array.isArray(a))return c;a.forEach(function(a){"fields"===a.type&&c.push.apply(c,a&&a.fieldInfos)});return c};d.prototype._checkForRelatedFeatures=function(a,b){var c=this._graphic;a=this._getAllFieldInfos(a);return this.queryRelatedInfos(c,a,b)};d.prototype._getTooltip=function(a){var b=a.label;return"pie-chart"===
a.chartType?b:b+": "+a.value};d.prototype._getChartOption=function(a){var b=a.value,c=a.attributes,d=a.formattedAttributes,f=a.fieldName,g=a.relatedFieldName,l=a.fieldInfos,n=a.index;a=a.chartType;var k=u.getSourceLayer(this._graphic),h=b.normalizeField,b=b.tooltipField,h=h?this.isRelatedField(h)?c[this.getRelatedFieldInfo(h).fieldName]:c[h]:null,p=g&&void 0!==c[g]?c[g]:void 0!==c[f]?c[f]:d[f],p=void 0===p?null:p&&h?p/h:p,n=new V({x:n,y:p});if(this.isRelatedField(f))return d=this.getRelatedFieldInfo(f),
f=(f=this.getRelatedFieldInfo(b))?f.fieldName:null,l=this._formatValueToFieldInfo(p,{fieldInfos:l,fieldName:g,layer:k,preventPlacesFormatting:!!h}),g=d?d.label||d.fieldName:g,n.tooltip=this._getTooltip({label:f&&void 0!==c[f]?c[f]:g,value:l,chartType:a}),n;c=this._getFieldInfo(l,f);g=this._getFixedFieldName(f,k);c=c?c.label||c.fieldName:f;n.tooltip=this._getTooltip({label:b&&void 0!==d[b]?d[b]:c,value:d[g],chartType:a});return n};d.prototype._getFixedFieldName=function(a,b){return(b=B(b,a))?b.name:
a};d.prototype._getFixedFieldNames=function(a,b){var c=this;return a&&a.map(function(a){return c._getFixedFieldName(a,b)})};d.prototype._setChartValue=function(a){var b=this,c=a.value,d=a.attributes,f=a.formattedAttributes,g=a.chartType;a=a.layer;var l=this._effectivePopupTemplate,n=this.relatedInfoCount,k=c.fields,h=c.normalizeField;c.fields=this._getFixedFieldNames(k,a);h&&(c.normalizeField=this._getFixedFieldName(h,a));if(k.some(function(a){return!!(null!=f[a]||b.isRelatedField(a)&&n)})){var p=
l&&l.fieldInfos;k.forEach(function(a,e){b.isRelatedField(a)?c.series=c.series.concat(b._getRelatedChartInfos({fieldInfos:p,fieldName:a,formattedAttributes:f,chartType:g,value:c})):(a=b._getChartOption({value:c,index:e,attributes:d,chartType:g,formattedAttributes:f,fieldName:a,fieldInfos:p}),c.series.push(a))})}};d.prototype._getRelatedChartInfos=function(a){var b=this,c=a.fieldInfos,d=a.fieldName,f=a.formattedAttributes,g=a.chartType,l=a.value,k=[];a=this.getRelatedFieldInfo(d);var m=a.fieldName,
h=this.getRelatedInfo(a.layerId);if(!h)return k;a=h.relatedFeatures;h=h.relation;if(!h||!a)return k;h=h.cardinality;a.forEach(function(a,e){var h=a.attributes;h&&Object.keys(h).forEach(function(a){a===m&&k.push(b._getChartOption({value:l,index:e,attributes:h,formattedAttributes:f,fieldName:d,chartType:g,relatedFieldName:a,fieldInfos:c}))})});return"one-to-many"===h||"many-to-many"===h?k:[k[0]]};k([g.property()],d.prototype,"_featureAbortController",void 0);k([g.property({type:G})],d.prototype,"attachmentsViewModel",
void 0);k([g.property({readOnly:!0})],d.prototype,"content",void 0);k([g.property({type:Boolean})],d.prototype,"defaultPopupTemplateEnabled",void 0);k([g.property({readOnly:!0})],d.prototype,"formattedAttributes",void 0);k([g.property({type:N})],d.prototype,"graphic",void 0);k([g.property({readOnly:!0})],d.prototype,"lastEditInfo",void 0);k([g.property({dependsOn:["view"]})],d.prototype,"spatialReference",null);k([g.property({readOnly:!0})],d.prototype,"title",void 0);k([g.property({dependsOn:["view"]})],
d.prototype,"map",null);k([g.property({readOnly:!0,dependsOn:["_featureAbortController"]})],d.prototype,"waitingForContent",null);k([g.property()],d.prototype,"view",void 0);return d=k([g.subclass("esri.widgets.FeatureViewModel")],d)}(g.declared(X))});