// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/generatorHelper ../../../../core/tsSupport/awaiterHelper ../../../../core/asyncUtils ../../../../core/has ../../../../core/lang ../../../../core/promiseUtils ../../../../core/urlUtils ../../../../libs/draco/DracoDecoder ./I3SBinaryReader ./I3SMaterialUtil ./I3SUtil".split(" "),function(m,T,y,z,p,Q,R,n,q,S,u,G,r){m=function(){function b(a,e,d,c,g,b){this.streamDataController=e;this.logger=d;this.defaultGeometrySchema=c;this.requiredAttributes=g;this.options=
b;this.layerUrl=a.parsedUrl.path;this.geometryDefinitions=a.geometryDefinitions;if(a.materialDefinitions){var f=a.textureSetDefinitions;this.materialAndTextures=a.materialDefinitions.map(function(a){return G.getMaterialAndTextures(f,a)})}}b.prototype.load=function(a,e,d){return this.streamDataController.request(a,e,{signal:d})};b.prototype.loadAttribute=function(a,e,d){return this.load(this.layerUrl+"/nodes/"+a.resources.attributes+"/attributes/"+e.key+"/0","binary",d).then(function(a){return u.readBinaryAttribute(e,
a)})};b.prototype.loadAttributes=function(a,e,d){var c=this;return n.eachAlways(e.map(function(e){return c.loadAttribute(a,e.attributeStorageInfo,d)})).then(function(d){for(var b={},f=0;f<e.length;++f)if(d[f].value)b[e[f].name]=d[f].value;else{if(n.isAbortError(d[f].error))throw d[f].error;c.logger.error("Failed to load attributeData for '"+e[f].name+"' on node '"+a.id+"'",d[f].error)}return b})};b.prototype.loadNodeData=function(a,e){return z(this,void 0,void 0,function(){var d,b,g,h,f,v,A,w,m,t,
n,B,q,C,x,D,r,H,I,z,J,E,K,L,M,F,N,O,P;return y(this,function(c){switch(c.label){case 0:d=null!=this.requiredAttributes&&a.resources.attributes?p.result(this.loadAttributes(a,this.requiredAttributes,e)):null;var k=this.geometryDefinitions;c={bufferDefinition:null,bufferIndex:0};if(!(null==k||0>a.resources.geometryDefinition)&&(k=0<=a.resources.geometryDefinition?k[a.resources.geometryDefinition].geometryBuffers:null,null!=k))for(var l=0;l<k.length;l++)if(null!=k[l].compressedAttributes){if("draco"===
k[l].compressedAttributes.encoding&&S.isSupported()&&!Q("disable-feature:i3s-draco")){c.bufferIndex=l;c.bufferDefinition=k[l];break}}else c.bufferIndex=l,c.bufferDefinition=k[l];b=c;g=b.bufferDefinition;h=b.bufferIndex;f=a.resources.geometry?p.result(this.loadGeometry(a,h,e)):null;return a.resources.hasSharedResource?[4,this.loadShared(a,e)]:[3,2];case 1:return A=c.sent(),[3,3];case 2:A=null,c.label=3;case 3:return v=A,m=(w=this.materialAndTextures&&0<=a.resources.materialDefinition?this.materialAndTextures[a.resources.materialDefinition]:
null!=v?G.getMaterialAndTexturesFromShared(v):null)&&w.material,t=w&&w.textures,this.options.loadFeatureData?[4,this.loadFeatureData(a,e)]:[3,5];case 4:return B=c.sent(),[3,6];case 5:B=null,c.label=6;case 6:n=B;q=this.options.loadFeatureData?this.collectGeometries(n):this.meshPyramidGeometryData(m);C=null!=t&&0<t.length?p.result(this.loadTextures(a,t,e)):null;D=x=null;if(!f)return[3,8];H=(r=p).assertResult;return[4,f];case 7:x=H.apply(r,[c.sent()]);k=this.defaultGeometrySchema;l=v;if(k&&l&&l.materialDefinitions){var y=
Object.keys(l.materialDefinitions)[0];!l.materialDefinitions[y].params.vertexRegions&&k.vertexAttributes.region&&(k=R.clone(k),delete k.vertexAttributes.region)}I=k;D=(z=!(!g||!g.compressedAttributes||"draco"!==g.compressedAttributes.encoding))?u.createGeometryIndexFromAttributes(g.compressedAttributes.attributes):g?u.createGeometryIndexFromDefinition(g,a.vertexCount,a.numFeatures):u.createGeometryIndexFromSchema(x,I);c.label=8;case 8:if(!C)return[3,10];L=(K=p).assertResult;return[4,C];case 9:return E=
L.apply(K,[c.sent()]),[3,11];case 10:E=null,c.label=11;case 11:J=E;if(!d)return[3,13];O=(N=p).assertResult;return[4,d];case 12:return F=O.apply(N,[c.sent()]),[3,14];case 13:F={},c.label=14;case 14:return P=(M=F)?{attributeData:M,loadedAttributes:this.requiredAttributes}:null,[2,{allGeometryData:q,attributeDataInfo:P,geometryBuffer:x,geometryIndex:D,requiredTextures:t,textureData:J}]}})})};b.addAbsoluteHrefTexture=function(a,e){a=a.textureDefinitions;if(null!=a)for(var d=0,c=Object.keys(a);d<c.length;d++)for(var b=
0,h=a[c[d]].images;b<h.length;b++){var f=h[b];Array.isArray(f.href)?f.hrefConcat=f.href.map(function(a){return q.makeAbsolute(a,e)}):f.hrefConcat=q.makeAbsolute(f.href,e)}};b.fixTextureEncodings=function(a){a=a.textureDefinitions;if(null!=a)for(var b in a){var d=a[b];if(Array.isArray(d.encoding))for(var c=0;c<d.encoding.length;c++){var g=d.encoding[c];"data:"===g.substring(0,5)&&(d.encoding[c]=g.substring(5))}else g=d.encoding,"data:"===g.substring(0,5)&&(d.encoding=g.substring(5))}};b.prototype.loadShared=
function(a,e){var d=this.layerUrl+"/nodes/"+a.resources.geometry+"/shared";return this.load(d,"json",e).then(function(a){b.fixTextureEncodings(a);b.addAbsoluteHrefTexture(a,d);return a})};b.prototype.loadTexture=function(a,b,d,c,g,h){return g===r.DDS_ENCODING_STRING?this.load(a,"binary",h).then(function(a){return{id:b,usage:d,data:a,encoding:g}}):this.load(a,"image",h).then(function(a){var e=a;if(c&&4096<=a.width*a.height){var e=Math.ceil(a.width/2),f=Math.ceil(a.height/2),h=document.createElement("canvas");
h.width=e;h.height=f;h.getContext("2d").drawImage(a,0,0,e,f);e=h}return{id:b,usage:d,data:e,encoding:g}})};b.prototype.loadTextures=function(a,e,d){var c=this,g=this.options.textureFormat===b.TextureFormat.Compressed,h=this.options.textureFormat===b.TextureFormat.Downsampled,f=this.options.textureUsageMask;return n.all(e.map(function(b){if(0===(b.usage&f))return null;var e=r.selectEncoding(b.encodings,g);return null==e?(c.logger.error("No known encoding for texture found on node "+a.id),n.reject()):
c.loadTexture(c.layerUrl+"/nodes/"+(a.resources.texture||a.id)+"/textures/"+e.name,b.id,b.usage,h,e.encoding,d)}))};b.prototype.meshPyramidGeometryData=function(a){return[{featureIds:[],geometries:[{type:"ArrayBufferView",params:{material:a}}],featureDataPosition:[0,0,0]}]};b.prototype.collectGeometries=function(a){var b=[],d=0;for(a=a.featureData;d<a.length;d++){var c=a[d],g=c.geometries;if(null!=g)for(var h=0;h<g.length;h++)b.push({featureIds:[c.id],featureDataPosition:c.position,geometries:[g[h]]});
else null!=c.position&&b.push({featureIds:[c.id],featureDataPosition:c.position,geometries:null})}return b};b.prototype.loadFeatureData=function(a,b){return this.load(this.layerUrl+"/nodes/"+a.id+"/features/0","json",b)};b.prototype.loadGeometry=function(a,b,d){return this.load(this.layerUrl+"/nodes/"+a.resources.geometry+"/geometries/"+b,"binary",d)};return b}();(function(b){b=b.TextureFormat||(b.TextureFormat={});b[b.Compressed=0]="Compressed";b[b.Normal=1]="Normal";b[b.Downsampled=2]="Downsampled"})(m||
(m={}));return m});