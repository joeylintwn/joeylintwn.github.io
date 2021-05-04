// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/tsSupport/paramHelper ../core/tsSupport/assignHelper ../geometry ../request ../core/jsonMap ../core/accessorSupport/decorators ../core/accessorSupport/ensureType ../geometry/support/jsonUtils ./Task ./operations/generalize ./operations/lengths ./operations/offset ./operations/relation ./operations/trimExtend ./support/GeneralizeParameters ./support/LengthsParameters ./support/OffsetParameters ./support/ProjectParameters ./support/RelationParameters ./support/TrimExtendParameters".split(" "),
function(I,J,q,m,K,e,h,f,r,k,t,g,u,v,w,x,y,z,A,B,C,D,E,F){var n=new r.JSONMap({MGRS:"mgrs",USNG:"usng",UTM:"utm",GeoRef:"geo-ref",GARS:"gars",DMS:"dms",DDM:"ddm",DD:"dd"}),G=t.ensureType(D);return function(p){function b(a){a=p.call(this,a)||this;a.url=null;return a}q(b,p);b.prototype.areasAndLengths=function(a,b){a=e({},this.parsedUrl.query,{f:"json"},a.toJSON());b=this._asValidOptions(a,b);return f(this.parsedUrl.path+"/areasAndLengths",b).then(function(a){return a.data})};b.prototype.autoComplete=
function(a,b,c){var d=a[0].spatialReference;a=e({},this.parsedUrl.query,{f:"json",sr:JSON.stringify(d.toJSON()),polygons:JSON.stringify(this._encodeGeometries(a).geometries),polylines:JSON.stringify(this._encodeGeometries(b).geometries)});c=this._asValidOptions(a,c);return f(this.parsedUrl.path+"/autoComplete",c).then(function(a){return(a.data.geometries||[]).map(function(a){return new h.Polygon({spatialReference:d,rings:a.rings})})})};b.prototype.buffer=function(a,b){var c=e({},this.parsedUrl.query,
{f:"json"},a.toJSON()),d=a.outSpatialReference||a.geometries[0].spatialReference;a=this._asValidOptions(c,b);return f(this.parsedUrl.path+"/buffer",a).then(function(a){return(a.data.geometries||[]).map(function(a){return new h.Polygon({spatialReference:d,rings:a.rings})})})};b.prototype.convexHull=function(a,b){var c=a[0].spatialReference;a=e({},this.parsedUrl.query,{f:"json",sr:JSON.stringify(c.toJSON()),geometries:JSON.stringify(this._encodeGeometries(a))});b=this._asValidOptions(a,b);return f(this.parsedUrl.path+
"/convexHull",b).then(function(a){return g.fromJSON(a.data.geometry).set({spatialReference:c})})};b.prototype.cut=function(a,b,c){var d=a[0].spatialReference,l=a.map(function(a){return a.toJSON()});a=e({},this.parsedUrl.query,{f:"json",sr:JSON.stringify(d.toJSON()),target:JSON.stringify({geometryType:g.getJsonType(a[0]),geometries:l}),cutter:JSON.stringify(b.toJSON())});c=this._asValidOptions(a,c);return f(this.parsedUrl.path+"/cut",c).then(function(a){a=a.data;return{cutIndexes:a.cutIndexes,geometries:(a.geometries||
[]).map(function(a){return g.fromJSON(a).set({spatialReference:d})})}})};b.prototype.densify=function(a,b){var c=a.geometries[0].spatialReference;a=e({},this.parsedUrl.query,{f:"json"},a.toJSON());b=this._asValidOptions(a,b);return f(this.parsedUrl.path+"/densify",b).then(function(a){return(a.data.geometries||[]).map(function(a){return g.fromJSON(a).set({spatialReference:c})})})};b.prototype.difference=function(a,b,c){var d=a[0].spatialReference;a={query:e({},this.parsedUrl.query,{f:"json",sr:JSON.stringify(d.toJSON()),
geometries:JSON.stringify(this._encodeGeometries(a)),geometry:JSON.stringify({geometryType:g.getJsonType(b),geometry:b.toJSON()})})};if(this.requestOptions||c)a=e({},this.requestOptions,c,a);return f(this.parsedUrl.path+"/difference",a).then(function(a){return(a.data.geometries||[]).map(function(a){return g.fromJSON(a).set({spatialReference:d})})})};b.prototype.distance=function(a,b){a=e({},this.parsedUrl.query,{f:"json"},a.toJSON());b=this._asValidOptions(a,b);return f(this.parsedUrl.path+"/distance",
b).then(function(a){return(a=a.data)&&a.distance})};b.prototype.fromGeoCoordinateString=function(a,b){var c={};c.sr=null!=a.sr&&"object"===typeof a.sr?a.sr.wkid||JSON.stringify(a.sr):a.sr;c.strings=JSON.stringify(a.strings);c.conversionType=n.toJSON(a.conversionType||"mgrs");c.conversionMode=a.conversionMode;a=e({},this.parsedUrl.query,{f:"json"},c);b=this._asValidOptions(a,b);return f(this.parsedUrl.path+"/fromGeoCoordinateString",b).then(function(a){return a.data.coordinates})};b.prototype.generalize=
function(a,b){a=A.from(a);var c=a.toJSON();a=v.generalizeToRESTParameters(a);a=e({},this.parsedUrl.query,{f:"json"},a);var d=c.geometries[0].spatialReference;b=this._asValidOptions(a,b);return f(this.parsedUrl.path+"/generalize",b).then(function(a){return(a.data.geometries||[]).map(function(a){return g.fromJSON(a).set({spatialReference:d})})})};b.prototype.intersect=function(a,b,c){var d=a[0].spatialReference;a=e({},this.parsedUrl.query,{f:"json",sr:JSON.stringify(d.toJSON()),geometries:JSON.stringify(this._encodeGeometries(a)),
geometry:JSON.stringify({geometryType:g.getJsonType(b),geometry:b.toJSON()})});c=this._asValidOptions(a,c);return f(this.parsedUrl.path+"/intersect",c).then(function(a){return(a.data.geometries||[]).map(function(a){return g.fromJSON(a).set({spatialReference:d})})})};b.prototype.labelPoints=function(a,b){var c=a.map(function(a){return a.toJSON()}),d=a[0].spatialReference;a=e({},this.parsedUrl.query,{f:"json",sr:d.wkid?d.wkid:JSON.stringify(d.toJSON()),polygons:JSON.stringify(c)});b=this._asValidOptions(a,
b);return f(this.parsedUrl.path+"/labelPoints",b).then(function(a){return(a.data.labelPoints||[]).map(function(a){return g.fromJSON(a).set({spatialReference:d})})})};b.prototype.lengths=function(a,b){a=B.from(a);a=w.lengthsToRESTParameters(a);a=e({},this.parsedUrl.query,{f:"json"},a);b=this._asValidOptions(a,b);return f(this.parsedUrl.path+"/lengths",b).then(function(a){return a.data})};b.prototype.offset=function(a,b){a=C.from(a);var c=x.offsetToRESTParameters(a),c=e({},this.parsedUrl.query,{f:"json"},
c),d=a.geometries[0].spatialReference;a=this._asValidOptions(c,b);return f(this.parsedUrl.path+"/offset",a).then(function(a){return(a.data.geometries||[]).map(function(a){return g.fromJSON(a).set({spatialReference:d})})})};b.prototype.project=function(a,b){var c=this;a=G(a);var d=e({},this.parsedUrl.query,{f:"json"},a.toJSON()),l=a.outSpatialReference,h=g.getJsonType(a.geometries[0]);a=this._asValidOptions(d,b);return f(this.parsedUrl.path+"/project",a).then(function(a){return c._decodeGeometries(a.data,
h,l)})};b.prototype.relation=function(a,b){a=E.from(a);a=y.relationToRESTParameters(a);a=e({},this.parsedUrl.query,{f:"json"},a);b=this._asValidOptions(a,b);return f(this.parsedUrl.path+"/relation",b).then(function(a){return a.data.relations})};b.prototype.reshape=function(a,b,c){var d=a.spatialReference;a=e({},this.parsedUrl.query,{f:"json",sr:JSON.stringify(d.toJSON()),target:JSON.stringify({geometryType:g.getJsonType(a),geometry:a.toJSON()}),reshaper:JSON.stringify(b.toJSON())});c=this._asValidOptions(a,
c);return f(this.parsedUrl.path+"/reshape",c).then(function(a){return g.fromJSON(a.data.geometry).set({spatialReference:d})})};b.prototype.simplify=function(a,b){var c=this,d=a[0].spatialReference,h=e({},this.parsedUrl.query,{f:"json",sr:d.wkid?d.wkid:JSON.stringify(d.toJSON()),geometries:JSON.stringify(this._encodeGeometries(a))}),H=g.getJsonType(a[0]);a=this._asValidOptions(h,b);return f(this.parsedUrl.path+"/simplify",a).then(function(a){return c._decodeGeometries(a.data,H,d)})};b.prototype.toGeoCoordinateString=
function(a,b){var c={};c.sr=null!=a.sr&&"object"===typeof a.sr?a.sr.wkid||JSON.stringify(a.sr):a.sr;c.coordinates=JSON.stringify(a.coordinates);c.conversionType=n.toJSON(a.conversionType||"mgrs");c.conversionMode=a.conversionMode;c.numOfDigits=a.numOfDigits;c.rounding=a.rounding;c.addSpaces=a.addSpaces;a=e({},this.parsedUrl.query,{f:"json"},c);b=this._asValidOptions(a,b);return f(this.parsedUrl.path+"/toGeoCoordinateString",b).then(function(a){return a.data.strings})};b.prototype.trimExtend=function(a,
b){a=F.from(a);var c=z.trimExtendToRESTParameters(a),c=e({},this.parsedUrl.query,{f:"json"},c),d=a.sr;a=this._asValidOptions(c,b);return f(this.parsedUrl.path+"/trimExtend",a).then(function(a){return(a.data.geometries||[]).map(function(a){return new h.Polyline({spatialReference:d,paths:a.paths})})})};b.prototype.union=function(a,b){var c=a[0].spatialReference;a=e({},this.parsedUrl.query,{f:"json",sr:JSON.stringify(c.toJSON()),geometries:JSON.stringify(this._encodeGeometries(a))});b=this._asValidOptions(a,
b);return f(this.parsedUrl.path+"/union",b).then(function(a){return g.fromJSON(a.data.geometry).set({spatialReference:c})})};b.prototype._asValidOptions=function(a,b){a={query:a};if(this.requestOptions||b)a=e({},this.requestOptions,b,a);return a};b.prototype._encodeGeometries=function(a){for(var b=[],c=a.length,e=0;e<c;e++)b.push(a[e].toJSON());return{geometryType:g.getJsonType(a[0]),geometries:b}};b.prototype._decodeGeometries=function(a,b,c){var d=g.getGeometryType(b);a=a.geometries;var f=[],h=
{spatialReference:c.toJSON()};a.forEach(function(a,b){f[b]=new d(e({},a,h))});return f};b.prototype._toProjectGeometry=function(a){var b=a.spatialReference.toJSON();return a instanceof h.Extent?new h.Polygon({rings:[[[a.xmin,a.ymin],[a.xmin,a.ymax],[a.xmax,a.ymax],[a.xmax,a.ymin],[a.xmin,a.ymin]]],spatialReference:b}):new h.Polyline({paths:[[].concat(a.points)],spatialReference:b})};b.prototype._fromProjectedGeometry=function(a,b,c){return"extent"===b?(a=a.rings[0],new h.Extent(a[0][0],a[0][1],a[2][0],
a[2][1],c)):new h.Multipoint({points:a.paths[0],spatialReference:c.toJSON()})};b.UNIT_METER=9001;b.UNIT_GERMAN_METER=9031;b.UNIT_FOOT=9002;b.UNIT_SURVEY_FOOT=9003;b.UNIT_CLARKE_FOOT=9005;b.UNIT_FATHOM=9014;b.UNIT_NAUTICAL_MILE=9030;b.UNIT_SURVEY_CHAIN=9033;b.UNIT_SURVEY_LINK=9034;b.UNIT_SURVEY_MILE=9035;b.UNIT_KILOMETER=9036;b.UNIT_CLARKE_YARD=9037;b.UNIT_CLARKE_CHAIN=9038;b.UNIT_CLARKE_LINK=9039;b.UNIT_SEARS_YARD=9040;b.UNIT_SEARS_FOOT=9041;b.UNIT_SEARS_CHAIN=9042;b.UNIT_SEARS_LINK=9043;b.UNIT_BENOIT_1895A_YARD=
9050;b.UNIT_BENOIT_1895A_FOOT=9051;b.UNIT_BENOIT_1895A_CHAIN=9052;b.UNIT_BENOIT_1895A_LINK=9053;b.UNIT_BENOIT_1895B_YARD=9060;b.UNIT_BENOIT_1895B_FOOT=9061;b.UNIT_BENOIT_1895B_CHAIN=9062;b.UNIT_BENOIT_1895B_LINK=9063;b.UNIT_INDIAN_FOOT=9080;b.UNIT_INDIAN_1937_FOOT=9081;b.UNIT_INDIAN_1962_FOOT=9082;b.UNIT_INDIAN_1975_FOOT=9083;b.UNIT_INDIAN_YARD=9084;b.UNIT_INDIAN_1937_YARD=9085;b.UNIT_INDIAN_1962_YARD=9086;b.UNIT_INDIAN_1975_YARD=9087;b.UNIT_FOOT_1865=9070;b.UNIT_RADIAN=9101;b.UNIT_DEGREE=9102;b.UNIT_ARCMINUTE=
9103;b.UNIT_ARCSECOND=9104;b.UNIT_GRAD=9105;b.UNIT_GON=9106;b.UNIT_MICRORADIAN=9109;b.UNIT_ARCMINUTE_CENTESIMAL=9112;b.UNIT_ARCSECOND_CENTESIMAL=9113;b.UNIT_MIL6400=9114;b.UNIT_BRITISH_1936_FOOT=9095;b.UNIT_GOLDCOAST_FOOT=9094;b.UNIT_INTERNATIONAL_CHAIN=109003;b.UNIT_INTERNATIONAL_LINK=109004;b.UNIT_INTERNATIONAL_YARD=109001;b.UNIT_STATUTE_MILE=9093;b.UNIT_SURVEY_YARD=109002;b.UNIT_50KILOMETER_LENGTH=109030;b.UNIT_150KILOMETER_LENGTH=109031;b.UNIT_DECIMETER=109005;b.UNIT_CENTIMETER=109006;b.UNIT_MILLIMETER=
109007;b.UNIT_INTERNATIONAL_INCH=109008;b.UNIT_US_SURVEY_INCH=109009;b.UNIT_INTERNATIONAL_ROD=109010;b.UNIT_US_SURVEY_ROD=109011;b.UNIT_US_NAUTICAL_MILE=109012;b.UNIT_UK_NAUTICAL_MILE=109013;b.UNIT_SQUARE_INCHES="esriSquareInches";b.UNIT_SQUARE_FEET="esriSquareFeet";b.UNIT_SQUARE_YARDS="esriSquareYards";b.UNIT_ACRES="esriAcres";b.UNIT_SQUARE_MILES="esriSquareMiles";b.UNIT_SQUARE_MILLIMETERS="esriSquareMillimeters";b.UNIT_SQUARE_CENTIMETERS="esriSquareCentimeters";b.UNIT_SQUARE_DECIMETERS="esriSquareDecimeters";
b.UNIT_SQUARE_METERS="esriSquareMeters";b.UNIT_ARES="esriAres";b.UNIT_HECTARES="esriHectares";b.UNIT_SQUARE_KILOMETERS="esriSquareKilometers";m([k.property()],b.prototype,"url",void 0);return b=m([k.subclass("esri.tasks.GeometryService")],b)}(k.declared(u))});