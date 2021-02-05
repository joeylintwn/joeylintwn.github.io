/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/vue-cookies@1.7.0/vue-cookies.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(){var e={expires:"1d",path:"; path=/",domain:"",secure:"",sameSite:""},n={install:function(e){e.prototype.$cookies=this,e.$cookies=this},config:function(n,t,o,i,a){e.expires=n||"1d",e.path=t?"; path="+t:"; path=/",e.domain=o?"; domain="+o:"",e.secure=i?"; Secure":"",e.sameSite=a?"; SameSite="+a:""},get:function(e){var n=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null;if(n&&"{"===n.substring(0,1)&&"}"===n.substring(n.length-1,n.length))try{n=JSON.parse(n)}catch(e){return n}return n},set:function(n,t,o,i,a,r,s){if(!n)throw new Error("Cookie name is not find in first argument.");if(/^(?:expires|max\-age|path|domain|secure|SameSite)$/i.test(n))throw new Error("Cookie key name illegality, Cannot be set to ['expires','max-age','path','domain','secure','SameSite']\t current key name: "+n);t&&t.constructor===Object&&(t=JSON.stringify(t));var c="";if((o=void 0===o?e.expires:o)&&0!=o)switch(o.constructor){case Number:c=o===1/0||-1===o?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+o;break;case String:if(/^(?:\d{1,}(y|m|d|h|min|s))$/i.test(o)){var m=o.replace(/^(\d{1,})(?:y|m|d|h|min|s)$/i,"$1");switch(o.replace(/^(?:\d{1,})(y|m|d|h|min|s)$/i,"$1").toLowerCase()){case"m":c="; max-age="+2592e3*+m;break;case"d":c="; max-age="+86400*+m;break;case"h":c="; max-age="+3600*+m;break;case"min":c="; max-age="+60*+m;break;case"s":c="; max-age="+m;break;case"y":c="; max-age="+31104e3*+m;break;default:new Error("unknown exception of 'set operation'")}}else c="; expires="+o;break;case Date:c="; expires="+o.toUTCString()}return document.cookie=encodeURIComponent(n)+"="+encodeURIComponent(t)+c+(a?"; domain="+a:e.domain)+(i?"; path="+i:e.path)+(void 0===r?e.secure:r?"; Secure":"")+(void 0===s?e.sameSite:s?"; SameSite="+s:""),this},remove:function(n,t,o){return!(!n||!this.isKey(n))&&(document.cookie=encodeURIComponent(n)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(o?"; domain="+o:e.domain)+(t?"; path="+t:e.path),this)},isKey:function(e){return new RegExp("(?:^|;\\s*)"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)},keys:function(){if(!document.cookie)return[];for(var e=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),n=0;n<e.length;n++)e[n]=decodeURIComponent(e[n]);return e}};"object"==typeof exports?module.exports=n:"function"==typeof define&&define.amd?define([],function(){return n}):window.Vue&&Vue.use(n),"undefined"!=typeof window&&(window.$cookies=n)}();
//# sourceMappingURL=/sm/249aa170905bc695151d537a53f5010147b397025419bb055e0acd1ad7a0cae9.map