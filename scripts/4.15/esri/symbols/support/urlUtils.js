// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define(["require","exports","../../core/urlUtils"],function(k,c,d){function g(b,a,e){return a.imageData?d.makeData({mediaType:a.contentType||"image/png",isBase64:!0,data:a.imageData}):f(a.url,e)}function f(b,a){return!a||"service"!==a.origin&&"portal-item"!==a.origin||!a.layer||"feature"!==a.layer.type&&"stream"!==a.layer.type||d.isAbsolute(b)||!a.layer.parsedUrl?d.fromJSON(b,a):d.join(a.layer.parsedUrl.path,"images",b)}function h(b,a,e,c){d.isDataProtocol(b)?(b=d.dataComponents(b),a.contentType=
b.mediaType,a.imageData=b.data,e&&e.imageData===a.imageData&&e.url&&d.write(e.url,a,"url",c)):d.write(b,a,"url",c)}Object.defineProperty(c,"__esModule",{value:!0});c.readImageDataOrUrl=g;c.read=f;c.writeImageDataAndUrl=h;c.urlPropertyDefinition={json:{read:{source:["imageData","url"],reader:g},write:{writer:function(b,a,c,d){h(b,a,this.source,d)}}}};c.sourcePropertyDefinition={readOnly:!0,json:{read:{source:["imageData","url"],reader:function(b,a,c){b={};a.imageData&&(b.imageData=a.imageData);a.contentType&&
(b.contentType=a.contentType);a.url&&(b.url=f(a.url,c));return b}}}}});