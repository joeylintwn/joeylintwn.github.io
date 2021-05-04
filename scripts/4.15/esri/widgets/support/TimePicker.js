// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.15/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/decorateHelper ../../core/tsSupport/declareExtendsHelper dojo/i18n!./nls/TimePicker ../../intl ../../moment ../../core/events ../../core/accessorSupport/decorators ../Widget ./TimePickerViewModel ./widget".split(" "),function(z,A,n,t,u,g,v,w,h,x,q,p){var l={hour:"numeric",minute:"numeric"},y=["ArrowDown","ArrowLeft","ArrowRight","ArrowUp","Tab"];return function(r){function b(a){a=r.call(this,a)||this;a._activeTime=null;a.value=null;a.viewModel=new q;return a}
t(b,r);b.prototype.render=function(){var a=this._activeTime||this.viewModel.value;return p.tsx("div",{class:"esri-time-picker esri-widget"},p.tsx("input",{afterUpdate:this._handleInputUpdate,"aria-label":u.inputTitle,bind:this,class:this.classes("esri-time-picker__input","esri-input"),onblur:this._handleInputBlur,onfocus:this._handleInputFocus,onkeydown:this._handleInputKeydown,onclick:this._handleInputClick,onpaste:this._handleInputPaste,onwheel:this._handleInputWheel,value:g.formatDate(a.valueOf(),
l)}))};b.prototype._handleInputBlur=function(){this._activeTime.isValid()&&(this.viewModel.value=this._activeTime);this._activePart=this._activeTime=null};b.prototype._handleInputUpdate=function(a){this._selectPart(a,this._activePart)};b.prototype._selectPart=function(a,c){var e=this._activeTime;if(e){var e=g.formatDate(e.valueOf(),l),b=e.indexOf(":");if("hours"===c)a.setSelectionRange(0,b);else{var d=b+1,b=d+2;"minutes"===c?a.setSelectionRange(d,b):(e=e.length,"meridiem"===c&&a.setSelectionRange(b+
1,e))}}};b.prototype._handleInputFocus=function(a){this._activePart="hours";this._activeTime=this.viewModel.value.clone().startOf("minute");this._selectPart(a.target,"hours")};b.prototype._caretIndexToPartName=function(a){var c=this._activeTime.format("LT"),b=c.indexOf(":"),c=c.indexOf(" ");return a<=b?"hours":a>b&&a<=c?"minutes":"meridiem"};b.prototype._handleInputKeydown=function(a){var c=a.ctrlKey,b=a.metaKey,m=a.shiftKey,d=w.eventKey(a),f=this._activeTime,k=this._activePart,g=/\d/.test(d),h=/^a|p$/i.test(d),
c=b||c;if(-1<y.indexOf(d)||g||"meridiem"===k&&h&&!c){if("ArrowLeft"===d)this._activePart=this._prevPart();else if("ArrowRight"===d)this._activePart=this._nextPart();else if("Tab"===d){f=m?this._prevPart():this._nextPart();if(f===this._activePart)return;this._activePart=f}else"ArrowUp"===d?this._shift("up",f,k):"ArrowDown"===d?this._shift("down",f,k):g?this._setTime(f,k,Number(d)):h&&(m=d.toLowerCase(),d=f.hour(),("a"===m&&12<=d||"p"===m&&12>d)&&this._shift("up",f,k));a.preventDefault();a.stopImmediatePropagation()}else c||
(a.preventDefault(),a.stopImmediatePropagation())};b.prototype._handleInputClick=function(a){a=a.target;this._activePart=null;this.renderNow();this._activePart=this._caretIndexToPartName(a.selectionStart)};b.prototype._getOrderedParts=function(){return-1<g.formatDate(this._activeTime.valueOf(),l).indexOf(" ")?["hours","minutes","meridiem"]:["hours","minutes"]};b.prototype._prevPart=function(){var a=this._getOrderedParts(),c=a.indexOf(this._activePart)-1;return a[Math.max(c,0)]};b.prototype._nextPart=
function(){var a=this._getOrderedParts(),c=a.indexOf(this._activePart)+1;return a[Math.min(c,a.length-1)]};b.prototype._setTime=function(a,c,b){if("hours"===c){c=-1<g.formatDate(a.valueOf(),l).indexOf(" ")?12:24;var e=""+a.hour()%c,d=Number(""+e+b);2===e.length||d>c?a.hour(b):d<=c&&a.hour(d)}else"minutes"===c&&(c=""+a.minute(),e=Number(""+c+b),2===c.length||59<e?a.minute(b):59>e&&a.minute(e))};b.prototype._handleInputPaste=function(a){var b=a.clipboardData.getData("text/plain"),b=v(b);b.isValid()&&
(this._activeTime=b);a.preventDefault();a.stopImmediatePropagation()};b.prototype._handleInputWheel=function(a){this._shift(0>a.deltaY?"up":"down",this._activeTime,this._activePart)};b.prototype._shift=function(a,b,e){if(a&&b&&e)b["up"===a?"add":"subtract"]("meridiem"===e?12:1,"hours"===e?"hour":"minutes"===e?"minute":"hours")};n([h.aliasOf("viewModel.value")],b.prototype,"value",void 0);n([h.property({type:q}),p.renderable("viewModel.value")],b.prototype,"viewModel",void 0);return b=n([h.subclass("esri.widgets.support.TimePicker")],
b)}(h.declared(x))});