// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ../../../../core/tsSupport/decorateHelper ../../../../core/libs/gl-matrix-2/vec3f64 ../core/shaderLibrary/Slice.glsl ../core/shaderLibrary/Transform.glsl ../core/shaderLibrary/attributes/InstancedDoublePrecision.glsl ../core/shaderLibrary/attributes/VerticalOffset.glsl ../core/shaderLibrary/output/OutputHighlight.glsl ../core/shaderLibrary/shading/PhysicallyBasedRenderingParameters.glsl ../core/shaderLibrary/shading/ReadShadowMap.glsl ../core/shaderLibrary/shading/VisualVariables.glsl ../core/shaderLibrary/util/Camera.glsl ../core/shaderLibrary/util/DoublePrecision.glsl ../core/shaderTechnique/ReloadableShaderModule ../core/shaderTechnique/ShaderTechnique ../core/shaderTechnique/ShaderTechniqueConfiguration ../lib/DefaultVertexAttributeLocations ../materials/internal/MaterialUtil ./DefaultMaterial.glsl ../../../webgl/Program".split(" "),
function(l,g,h,d,m,n,p,q,r,t,u,v,w,x,y,z,e,b,A,k,B,C){Object.defineProperty(g,"__esModule",{value:!0});e=function(b){function a(){return null!==b&&b.apply(this,arguments)||this}h(a,b);a.prototype.initializeProgram=function(f){var b=a.shader.get(),c=this.configuration,b=b.build({output:c.output,viewingMode:f.viewingMode,receiveShadows:c.receiveShadows,slicePlaneEnabled:c.slicePlaneEnabled,sliceHighlightDisabled:c.sliceHighlightDisabled,sliceEnabledForVertexPrograms:!1,symbolColor:c.symbolColors,vvSize:c.vvSize,
vvColor:c.vvColor,vvInstancingEnabled:!0,instanced:c.instanced,instancedColor:c.instancedColor,instancedDoublePrecision:c.instancedDoublePrecision,useOldSceneLightInterface:!1,pbrMode:c.usePBR?c.isSchematic?2:1:0,hasMetalnessAndRoughnessTexture:c.hasMetalnessAndRoughnessTexture,hasEmissionTexture:c.hasEmissionTexture,hasOcclusionTexture:c.hasOcclusionTexture,hasNormalTexture:c.hasNormalTexture,hasColorTexture:c.hasColorTexture,receiveAmbientOcclusion:c.receiveAmbientOcclusion,useCustomDTRExponentForWater:!1,
normalType:c.normalsTypeDerivate?3:0,doubleSidedMode:c.doubleSidedMode,vertexTangets:c.vertexTangents,attributeTextureCoordinates:c.hasMetalnessAndRoughnessTexture||c.hasEmissionTexture||c.hasOcclusionTexture||c.hasNormalTexture||c.hasColorTexture?1:0,textureAlphaPremultiplied:c.textureAlphaPremultiplied,attributeColor:c.vertexColors,screenSizePerspectiveEnabled:c.screenSizePerspective,verticalOffsetEnabled:c.verticalOffset,offsetBackfaces:c.offsetBackfaces,doublePrecisionRequiresObfuscation:y.doublePrecisionRequiresObfuscation(f.rctx),
alphaDiscardMode:c.alphaDiscardMode,supportsTextureAtlas:!1});return new C(f.rctx,b.generateSource("vertex"),b.generateSource("fragment"),A.Default3D)};a.prototype.bindPass=function(f,a,b){var c=this.configuration.output;0===c?(this.program.setUniform3fv("ambient",a.ambient),this.program.setUniform3fv("diffuse",a.diffuse),this.program.setUniform4fv("externalColor",a.externalColor),this.program.setUniform1i("colorMixMode",k.colorMixModes[a.colorMixMode]),this.program.setUniform1f("opacity",a.opacity),
this.program.setUniform1f("layerOpacity",a.layerOpacity),this.configuration.usePBR&&u.PhysicallyBasedRenderingParameters.bindUniforms(this.program,a,this.configuration.isSchematic)):1===c||3===c?this.program.setUniform2fv("nearFar",b.nearFar):4===c&&t.OutputHighlight.bindOutputHighlight(f,this.program,b);w.VisualVariables.bindUniformsForSymbols(this.program,a);r.VerticalOffset.bindUniforms(this.program,a,b);k.bindScreenSizePerspective(a.screenSizePerspective,this.program);"mask"!==a.textureAlphaMode&&
"maskBlend"!==a.textureAlphaMode||this.program.setUniform1f("textureAlphaCutoff",a.textureAlphaCutoff)};a.prototype.bindDraw=function(a){var b=this.configuration.instancedDoublePrecision?m.vec3f64.fromValues(a.viewInvTransp[3],a.viewInvTransp[7],a.viewInvTransp[11]):a.origin;p.Transform.bindUniformsCustomOrigin(this.program,b,a.view);(0===this.configuration.output||1===this.configuration.output&&this.configuration.screenSizePerspective||2===this.configuration.output&&this.configuration.screenSizePerspective||
4===this.configuration.output&&this.configuration.screenSizePerspective)&&x.Camera.bindUniformsCustomOrigin(this.program,b,a.viewInvTransp);2===this.configuration.output&&this.program.setUniformMatrix4fv("viewNormal",a.viewInvTransp);this.configuration.instancedDoublePrecision&&q.InstancedDoublePrecision.bindCustomOrigin(this.program,b);n.Slice.bindUniforms(this.program,this.configuration,a.slicePlane,b);0===this.configuration.output&&v.ReadShadowMap.bindViewCustomOrigin(this.program,a,b)};a.prototype.bindInstance=
function(a){this.program.setUniformMatrix4fv("model",a.transformation);this.program.setUniformMatrix4fv("modelNormal",a.transformationNormal)};a.prototype.initializePipeline=function(){return null};a.shader=new z.ReloadableShaderModule(B,"./DefaultMaterial.glsl",l);return a}(e.ShaderTechnique);g.DefaultMaterialTechnique=e;e=function(e){function a(){var a=null!==e&&e.apply(this,arguments)||this;a.output=0;a.alphaDiscardMode=1;a.doubleSidedMode=0;a.isSchematic=!1;a.vertexColors=!1;a.offsetBackfaces=
!1;a.symbolColors=!1;a.vvSize=!1;a.vvColor=!1;a.verticalOffset=!1;a.receiveShadows=!1;a.slicePlaneEnabled=!1;a.sliceHighlightDisabled=!1;a.receiveAmbientOcclusion=!1;a.screenSizePerspective=!1;a.textureAlphaPremultiplied=!1;a.hasColorTexture=!1;a.usePBR=!1;a.hasMetalnessAndRoughnessTexture=!1;a.hasEmissionTexture=!1;a.hasOcclusionTexture=!1;a.hasNormalTexture=!1;a.instanced=!1;a.instancedColor=!1;a.instancedDoublePrecision=!1;a.vertexTangents=!1;a.normalsTypeDerivate=!1;return a}h(a,e);d([b.parameter({count:7})],
a.prototype,"output",void 0);d([b.parameter({count:4})],a.prototype,"alphaDiscardMode",void 0);d([b.parameter({count:3})],a.prototype,"doubleSidedMode",void 0);d([b.parameter()],a.prototype,"isSchematic",void 0);d([b.parameter()],a.prototype,"vertexColors",void 0);d([b.parameter()],a.prototype,"offsetBackfaces",void 0);d([b.parameter()],a.prototype,"symbolColors",void 0);d([b.parameter()],a.prototype,"vvSize",void 0);d([b.parameter()],a.prototype,"vvColor",void 0);d([b.parameter()],a.prototype,"verticalOffset",
void 0);d([b.parameter()],a.prototype,"receiveShadows",void 0);d([b.parameter()],a.prototype,"slicePlaneEnabled",void 0);d([b.parameter()],a.prototype,"sliceHighlightDisabled",void 0);d([b.parameter()],a.prototype,"receiveAmbientOcclusion",void 0);d([b.parameter()],a.prototype,"screenSizePerspective",void 0);d([b.parameter()],a.prototype,"textureAlphaPremultiplied",void 0);d([b.parameter()],a.prototype,"hasColorTexture",void 0);d([b.parameter()],a.prototype,"usePBR",void 0);d([b.parameter()],a.prototype,
"hasMetalnessAndRoughnessTexture",void 0);d([b.parameter()],a.prototype,"hasEmissionTexture",void 0);d([b.parameter()],a.prototype,"hasOcclusionTexture",void 0);d([b.parameter()],a.prototype,"hasNormalTexture",void 0);d([b.parameter()],a.prototype,"instanced",void 0);d([b.parameter()],a.prototype,"instancedColor",void 0);d([b.parameter()],a.prototype,"instancedDoublePrecision",void 0);d([b.parameter()],a.prototype,"vertexTangents",void 0);d([b.parameter()],a.prototype,"normalsTypeDerivate",void 0);
return a}(b.ShaderTechniqueConfiguration);g.DefaultMaterialTechniqueConfiguration=e});