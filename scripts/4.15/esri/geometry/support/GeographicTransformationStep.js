// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define(["require","exports"],function(d,e){var b=0;return function(){function c(a){void 0===a&&(a=null);this.uid=b++;a?(this._wkt=void 0!==a.wkt?a.wkt:null,this._wkid=void 0!==a.wkid?a.wkid:-1,this._isInverse=void 0!==a.isInverse?!0===a.isInverse:!1):(this._wkt=null,this._wkid=-1,this._isInverse=!1)}c.fromGE=function(a){var b=new c;b._wkt=a.wkt;b._wkid=a.wkid;b._isInverse=a.isInverse;return b};Object.defineProperty(c.prototype,"wkt",{get:function(){return this._wkt},set:function(a){this._wkt=a;this.uid=
b++},enumerable:!0,configurable:!0});Object.defineProperty(c.prototype,"wkid",{get:function(){return this._wkid},set:function(a){this._wkid=a;this.uid=b++},enumerable:!0,configurable:!0});Object.defineProperty(c.prototype,"isInverse",{get:function(){return this._isInverse},set:function(a){this._isInverse=a;this.uid=b++},enumerable:!0,configurable:!0});c.prototype.getInverse=function(){var a=new c;a._wkt=this.wkt;a._wkid=this._wkid;a._isInverse=!this.isInverse;return a};return c}()});