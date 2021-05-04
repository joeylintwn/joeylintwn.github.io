// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../core/tsSupport/assignHelper ../../../core/tsSupport/extendsHelper ../../../Color ./size ./support/colors ./support/SymbologyBase ./support/utils".split(" "),function(e,y,n,p,d,k,q,r,f){function l(b,c,a,g){if(c=q[c]){var d=c[b.numColors]||c.stops,h="mesh"!==b.geometryType&&b.worldScale?b.view:null;switch(b.geometryType){case "point":case "multipoint":return t({name:c.name,tags:c.tags,colors:d,noDataColor:a.noDataColor,opacity:1,sizeScheme:g,outline:a.outline,size:a.size},
h);case "polyline":return u({name:c.name,tags:c.tags,colors:d,noDataColor:a.noDataColor,opacity:1,sizeScheme:g,width:a.width},h);case "polygon":return g&&g.marker&&null!=a.markerSize&&(g.marker.size=a.markerSize),v({name:c.name,tags:c.tags,colors:d,noDataColor:a.noDataColor,opacity:a.fillOpacity,outline:a.outline,sizeScheme:g},h);case "mesh":return w({name:c.name,tags:c.tags,colors:d,noDataColor:a.noDataColor,opacity:a.fillOpacity})}}}function t(b,c){return{name:b.name,tags:b.tags.slice(),colors:b.colors.map(function(a){return new d(a)}),
noDataColor:new d(b.noDataColor),outline:{color:new d(b.outline.color),width:b.outline.width},size:c?f.toWorldScale(b.size,c):b.size,sizeScheme:b.sizeScheme,opacity:b.opacity}}function u(b,c){return{name:b.name,tags:b.tags.slice(),colors:b.colors.map(function(a){return new d(a)}),noDataColor:new d(b.noDataColor),width:c?f.toWorldScale(b.width,c):b.width,sizeScheme:b.sizeScheme,opacity:b.opacity}}function v(b,c){var a=b.sizeScheme;a.marker.size=c?f.toWorldScale(a.marker.size,c):a.marker.size;return{name:b.name,
tags:b.tags.slice(),colors:b.colors.map(function(a){return new d(a)}),noDataColor:new d(b.noDataColor),outline:{color:new d(b.outline.color),width:b.outline.width},sizeScheme:a,opacity:b.opacity}}function w(b){return{name:b.name,tags:b.tags.slice(),colors:b.colors.map(function(b){return new d(b)}),noDataColor:new d(b.noDataColor),opacity:b.opacity}}e={color:[153,153,153,.25],width:"1px"};var x={default:{name:"default",label:"Default",description:"Default theme for visualizing features by their predominant category.",
schemes:{point:{light:{common:{noDataColor:"#aaaaaa",outline:e,size:"8px"},primary:"predominant-v1",secondary:"predominant-v2 predominant-v3 predominant-v4 predominant-v5 predominance-race predominance-money predominance-race-ethnic predominance-rainbow predominance-sequence".split(" ")},dark:{common:{noDataColor:"#aaaaaa",outline:{color:[26,26,26,.25],width:"1px"},size:"8px"},primary:"predominant-v2",secondary:"predominant-v1 predominant-v3 predominant-v4 predominant-v5 predominance-race predominance-money predominance-race-ethnic predominance-rainbow predominance-sequence".split(" ")}},
polyline:{light:{common:{noDataColor:"#aaaaaa",width:"2px"},primary:"predominant-v1",secondary:"predominant-v2 predominant-v3 predominant-v4 predominant-v5 predominance-race predominance-money predominance-race-ethnic predominance-rainbow predominance-sequence".split(" ")},dark:{common:{noDataColor:"#aaaaaa",width:"2px"},primary:"predominant-v2",secondary:"predominant-v1 predominant-v3 predominant-v4 predominant-v5 predominance-race predominance-money predominance-race-ethnic predominance-rainbow predominance-sequence".split(" ")}},
polygon:{light:{common:{noDataColor:"#aaaaaa",outline:e,fillOpacity:.8,markerSize:"8px"},primary:"predominant-v1",secondary:"predominant-v2 predominant-v3 predominant-v4 predominant-v5 predominance-race predominance-money predominance-race-ethnic predominance-rainbow predominance-sequence".split(" ")},dark:{common:{noDataColor:"#aaaaaa",outline:{color:[153,153,153,.25],width:"1px"},fillOpacity:.8,markerSize:"8px"},primary:"predominant-v2",secondary:"predominant-v1 predominant-v3 predominant-v4 predominant-v5 predominance-race predominance-money predominance-race-ethnic predominance-rainbow predominance-sequence".split(" ")}}}}};
return new (function(b){function c(){return b.call(this,{themeDictionary:x})||this}p(c,b);c.prototype.getSchemes=function(a){var b=this.getRawSchemes({theme:"default",basemap:a.basemap,geometryType:a.geometryType,basemapTheme:a.basemapTheme});if(b){var c=b.schemesInfo,d=b.basemapId,b=b.basemapTheme,e=c.common,f=k.getSchemes({basemap:a.basemap,geometryType:a.geometryType,worldScale:a.worldScale,view:a.view}),m=f&&f.primaryScheme;return{primaryScheme:l(a,c.primary,e,m),secondarySchemes:c.secondary.map(function(b){return l(a,
b,e,m)}).filter(Boolean),basemapId:d,basemapTheme:b}}};c.prototype.getSchemeByName=function(a){return this.filterSchemesByName(a)};c.prototype.getSchemesByTag=function(a){return this.filterSchemesByTag(a)};c.prototype.cloneScheme=function(a){if(a)return a=n({},a),a.colors=a.colors.map(function(a){return new d(a)}),a.noDataColor&&(a.noDataColor=new d(a.noDataColor)),"outline"in a&&a.outline&&(a.outline={color:a.outline.color&&new d(a.outline.color),width:a.outline.width}),"sizeScheme"in a&&a.sizeScheme&&
(a.sizeScheme=k.cloneScheme(a.sizeScheme)),a};return c}(r))});