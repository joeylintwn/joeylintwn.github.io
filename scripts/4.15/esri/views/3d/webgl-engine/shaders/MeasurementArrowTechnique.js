// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ../../../../core/tsSupport/decorateHelper ../../../../core/tsSupport/assignHelper ../core/shaderLibrary/Transform.glsl ../core/shaderTechnique/ReloadableShaderModule ../core/shaderTechnique/ShaderTechnique ../core/shaderTechnique/ShaderTechniqueConfiguration ../lib/DefaultVertexAttributeLocations ./MeasurementArrow.glsl ../../../webgl/Program ../../../webgl/renderState".split(" "),function(k,e,g,l,d,m,n,p,h,q,r,t,f){Object.defineProperty(e,
"__esModule",{value:!0});d=function(c){function a(a,b){return c.call(this,a,b)||this}g(a,c);a.prototype.initializeProgram=function(u){var b=a.shader.get().build();return new t(u.rctx,b.generateSource("vertex"),b.generateSource("fragment"),q.Default3D)};a.prototype.bindPass=function(a,b){this.program.setUniform1f("width",b.width);this.program.setUniform1f("outlineSize",b.outlineSize);this.program.setUniform4fv("outlineColor",b.outlineColor);this.program.setUniform1f("stripeLength",b.stripeLength);
this.program.setUniform4fv("stripeEvenColor",b.stripeEvenColor);this.program.setUniform4fv("stripeOddColor",b.stripeOddColor)};a.prototype.bindDraw=function(a){m.Transform.bindUniforms(this.program,a)};a.prototype.initializePipeline=function(){return f.makePipelineState({polygonOffset:this.configuration.polygonOffsetEnabled&&{factor:0,units:-4},depthTest:{func:513},depthWrite:f.defaultDepthWriteParams,colorWrite:f.defaultColorWriteParams})};Object.defineProperty(a.prototype,"primitiveType",{get:function(){return 5},
enumerable:!0,configurable:!0});a.shader=new n.ReloadableShaderModule(r,"./MeasurementArrow.glsl",k);return a}(p.ShaderTechnique);e.MeasurementArrowTechnique=d;d=function(c){function a(){var a=null!==c&&c.apply(this,arguments)||this;a.polygonOffsetEnabled=!1;return a}g(a,c);l([h.parameter()],a.prototype,"polygonOffsetEnabled",void 0);return a}(h.ShaderTechniqueConfiguration);e.MeasurementArrowTechniqueConfiguration=d});