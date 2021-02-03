//2020/05/13 將下拉選項改由function來設定

/////用法<x-include>
Vue.component('x-include', {
    props: {
        include: {
            type: String,
            required: true,
        }, xInit: {
            type: Object
        }
    },
    mounted: function () {
        $.ajax({
            url: this.include,
            sender: this,
            success: function (sdata) {

                this.sender[this.sender.templatekey] = sdata;

                this.sender.$forceUpdate();
            }
        });

        const timer = Date.now();
        this.templatekey = "temp" + Math.floor(Math.random() * timer);
        this[this.templatekey] = "loading";

    },
    beforeCreate: function () {
        //

        var parent = this.$parent;
        //访问父实例上的属性
        Object.setPrototypeOf(this, parent);
        // data的值虽然是绑定在vm上，实质是访问_data上对应的值
        Object.defineProperty(this, '_data', {
            get: function () {
                return parent._data
            },
            set: function () {
            },
        });

        // 类似于data
        Object.defineProperty(this, '_prop', {
            get: function () {
                return parent._prop;
            },
            set: function () {

            },
        });

    },
    render: function (h) {
        if (this[this.templatekey]) {
            console.log("render virtual DOM")
            var res = Vue.compile(this[this.templatekey]);

            this.templateRender = res.render;

            // staticRenderFns belong into $options, 
            // appearantly
            this.$options.staticRenderFns = []

            // clean the cache of static elements
            // this is a cache with the results from the staticRenderFns
            this._staticTrees = []

            // Fill it with the new staticRenderFns
            for (var i in res.staticRenderFns) {
                //staticRenderFns.push(res.staticRenderFns[i]);
                this.$options.staticRenderFns.push(res.staticRenderFns[i])
            }


        }

        return h('div', [
            (this.templateRender ?
                this.templateRender() :
                'loading...')
        ]);

    }
});
Vue.component('x-bindhtml', {

    props: {
        template: {
            type: String,
            required: true,
        }

    },
    beforeCreate: function () {
        var parent = this.$parent;
        //访问父实例上的属性
        Object.setPrototypeOf(this, parent);
        // data的值虽然是绑定在vm上，实质是访问_data上对应的值
        Object.defineProperty(this, '_data', {
            get: function () {
                return parent._data
            },
            set: function () {
            },
        });

        // 类似于data
        Object.defineProperty(this, '_prop', {
            get: function () {
                return parent._prop;
            },
            set: function () {

            },
        });

    },
    created: function () {


    },
    render: function (h) {

        console.log("render virtual DOM")
        if (this.template != this.beforetmp) {
            var res = Vue.compile(this.template);
            this.beforetmp = this.template;
            this.templateRender = res.render;

            // staticRenderFns belong into $options, 
            // appearantly
            this.$options.staticRenderFns = []

            // clean the cache of static elements
            // this is a cache with the results from the staticRenderFns
            this._staticTrees = []

            // Fill it with the new staticRenderFns
            for (var i in res.staticRenderFns) {
                //staticRenderFns.push(res.staticRenderFns[i]);
                this.$options.staticRenderFns.push(res.staticRenderFns[i])
            }
        }

        if (!this.templateRender) {
            return h('div', 'loading...');
        } else { // If there is a template, I'll show it
            return this.templateRender();
        }
    }
})
//用法<x-load> 異步組件
Vue.component('x-load', function (resolve, reject) {
    //這功能目前ie也可以使用
    //只能載一次，沒什麼用處，來源要變成也只能是一個網址。要想辦法從外部傳入網址


    var src = 'testVue.vue';
    var mytemplate = "";
    $.ajax({
        url: src,
        success: function (html) {
            mytemplate = html;
        }
    }).then(function () {
        resolve({
            //  render: res.render,
            //  staticRenderFns: res.staticRenderFns,
            template: mytemplate,
            props: ["pp", "say"]

        });
    });
});

//2020/03/14 修正autocomplet ID識別問題(同fileid的問題)，增加自動語言轉換
function ChangeLang(lang) {
    for (var key in lang) {
        $("." + key).text(lang[key]);
    }
}


function getMobileDetail(scope, maincolumn) {
    var itemHtml = "";
    scope.Columns.forEach(function (c, i) {
        if (c.hidden == false || c.hidden == undefined) {
            if (c.datafield != maincolumn && c.datafield != "Action") {
                if (maincolumn == undefined)
                    maincolumn = c.datafield;
                else
                    itemHtml += '<div><span class="ItemField">' + c.text + ':</span>' +
                        '<span class="ItemValue">{{data.' + c.datafield + '}}</span></div>';

            }
        }
    });


    var html = '<section class="ItemList">';
    html += '<div class="ItemData" v-for="data in datalist">';
    html += '<div   class="ItemInfo">';
    html += ' <h3 style="font-weight: 600">{{data.' + maincolumn + '}}</h3>';
    html += '<div id="item_line"></div>';
    html += itemHtml;
    html += "</div>";
    html += ' <div style="padding-top:10px;text-align:center" v-html="data.Action"></div>';
    html += "</div>";
    html += "</section>";

    return html;
}
/// 最新 2020/03/06 jack 增加gisapi 增加mobileui
function GisApi(scope) {
    scope.getGISAction = function (Wkt) {
        return '<button type="button"   onclick="VueScopes[\'' + scope.id + '\'] .Position (\'' + Wkt + '\');">定位</button>'
        //    + '<button   onclick="VueScopes[\'' + scope.id + '\'].Navigation(\'' + Wkt + '\');">路徑規劃</button>';
    }
    scope.FindLBS = function () {
        var gps = window.top.GetGPSPoint();
        if (gps == null) {
            alert('您尚未開啟gps服務，或目前無法取得您的位置!!，請嘗試關悼網頁，重新進入!!,或是使用行政區查詢');
            return;
        }
        var Geometry = 'POINT(' + gps.x + ' ' + gps.y + ')';
        this.getDataList("geo.STDistance('" + Geometry + "')<" + $("#selDist").val());

    };
    scope.Position = function (Wkt) {
        if (window.parent.map != null) {
            var map = window.parent.map;
            var feat = map.CustDrawLayer.DrawGeoFromWKT(Wkt);
            if (feat.type == "point") {//ARCGIS試過可用
                map.setCenter(feat.x, feat.y, 18);
                map.CustDrawLayer.clearPaths();
                map.CustDrawLayer.addMarker(map.CreatePoint(feat.x, feat.y),
                    '//www.ysong.com.tw/IlanHsds/images/green-pin.png', 1, "");
            } else {
                map.fitBounds(feat.getGeometry().getExtent());
                map.basemap.getView().setZoom(18);
            }
            this.hide();
        }
    }
    scope.hide = function () {
        var srcs = window.location.href.split("/");
        var ifrm = window.parent.$("iframe[src*='" + srcs[srcs.length - 1] + "']").attr('targetid');
        window.parent.$("#" + ifrm).modal('hide');
    }
    scope.Navigation = function (Wkt) {

        if (window.parent.map != null) {
            var map = window.parent.map;

            var pt = map.TransWKT(Wkt, "EPSG:" + map.SRID, "EPSG:4326");
            var cord = pt.Geometry.getCoordinates();
            map.Navigation(cord[1], cord[0]);

        }
        //定位到google上面做路徑規劃
    }

}
//========IE不支援trimLeft與trimRight所以需要下面程式碼===============
if (typeof String.prototype.trimLeft !== 'function') {
    String.prototype.trimLeft = function () {
        return this.replace(/^\s+/, "");
    }
}

if (typeof String.prototype.trimRight !== 'function') {
    String.prototype.trimRight = function () {
        return this.replace(/\s+$/, "");
    }
}
//==========解決ie不支援datepicker================================
function CheckIEVersion() {
    var userAgent = navigator.userAgent; //取得瀏覽器的userAgent字串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判斷是否IE<11瀏覽器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判斷是否IE的Edge瀏覽器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isEdge) {
        return 'edge';//edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1;//不是ie瀏覽器
    }
}
if (CheckIEVersion() != -1) {

    if ($('input[type=date]').datepicker == undefined) {
        dynamicLoadCss("//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
        dynamicLoadJS("//code.jquery.com/ui/1.12.1/jquery-ui.js", function () {
        });
    }
}
function padLeft(str, length) {
    str = str.toString();
    if (str.length >= length)
        return str;
    else
        return padLeft("0" + str, length);
}
Date.prototype.toISOString = function () {
    if (this == null)
        return this
    else {
        var datatime = this.getFullYear() + "-" + padLeft(this.getMonth() + 1, 2) + "-" + padLeft(this.getDate(), 2) + "T"
            + padLeft(this.getHours(), 2) + ":" + padLeft(this.getMinutes(), 2) + ":" + padLeft(this.getSeconds(), 2);

        return datatime;
    }
    //return moment(this).format("YYYY-MM-DDTHH:mm:ss");
};
Date.prototype.toDateString = function () {
    if (this == null)
        return this
    else {
        var datatime = this.getFullYear() + "-" + padLeft(this.getMonth() + 1, 2) + "-" + padLeft(this.getDate(), 2);


        return datatime;
    }
    //return moment(this).format("YYYY-MM-DDTHH:mm:ss");
};
function setJqueryUIDatapicker(scope) {
    $('input[type=date]').datepicker({
        onSelect: function (dateText, inst) {
            scope[$(this).attr("v-model").split(".")[0]][$(this).attr("v-model").split(".")[1]] = new Date(dateText);
            alert("IE");
        }
    });
    $('input[type=date]').datepicker("option", "dateFormat", "yy-mm-dd");
}

//===================================================
function dynamicLoadCss(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = url;
    head.appendChild(mycss);
    mycss.onload = callback;
}
function dynamicLoadJS(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var myscript = document.createElement("script");
    myscript.type = "text/javascript";
    myscript.src = url;
    head.appendChild(myscript);
    myscript.onload = callback;
}

function querystring(key) {

    try {
        var a = new RegExp(key + "=([^&#=]*)");
        return decodeURIComponent(a.exec(window.location.search)[1]);
    } catch (e) {
        return undefined;
    }
}
/// 最新 2019/11/26 jack 修正checkboxlist的control bug
function getEsriTemplateHTML(inputs, bindKey, scp) {
    var myInput = "";
    for (p in inputs) {
        var input = inputs[p];
        var tag = '<div col-12 row no-gutters mt-1">\r\n<div class="col-12"><span class="w-100">' + input.text + '</span></div>\r\n';
        tag = tag + appendControl(input, bindKey, scp, "class='form-control col-12'") + "\r\n";

        var ml = tag + "</div> ";


        myInput = myInput + ml + "\r\n";
    }
    return "<div class='form-group row w-100'>" + myInput + "</div>";
}


//=======輸入樣版設計==========================
function getBootstrapTemplateHTML(inputs, bindKey, scp) {
    var myInput = "";
    for (p in inputs) {
        var ml = getBootstrapTemplate(inputs[p], bindKey, scp);
        myInput = myInput + ml + "\r\n";
    }
    console.log(myInput);
    return "<div class='form-group row w-100'>" + myInput + "</div>";
}

function CustgetBootstrapTemplateHTML(inputs, bindKey, scp) {
    var myInput = "";
    for (p in inputs) {
        var ml = CustgetBootstrapTemplate(inputs[p], bindKey, scp);
        myInput = myInput + ml + "\r\n";
    }
    console.log(myInput);
    return "<div>" + myInput + "</div>";
}
function CustgetBootstrapTemplateHTML_wb(inputs, bindKey, scp) {
    var myInput = "";
    for (p in inputs) {
        var ml = CustgetBootstrapTemplate_wb(inputs[p], bindKey, scp);
        myInput = myInput + ml + "\r\n";
    }
    console.log(myInput);
    return "<div>" + myInput + "</div>";
}
function getHtmlBindingDirective($compile) {
    return {
        replace: true,
        template: '',
        link: function (myScope, element, attrs) {
            myScope.$watch(function () {
                //字數過長


                return myScope.$eval(attrs.bindHtmlCompile);
            }, function (value) {
                // Incase value is a TrustedValueHolderType, sometimes it
                // needs to be explicitly called into a string in order to
                // get the HTML string.
                element.html(value && value.toString());
                // If scope is provided use it, otherwise use parent scope
                $compile(element.contents())(myScope);
            });
        }
    }
}

function getBootstrapTemplateForAnglur(input, bindKey) {

    // el.append('<label >{{input.text}}</label>');
    var tag = ' <div   class="input-group-prepend col-4"><span  class="input-group-text w-100 justify-content-center">' + input.text + '</span></div>\r\n';
    tag = tag + appendControl(input, bindKey) + "\r\n";
    return tag + "</div>";


}
function getBootstrapTemplate(input, bindKey, scp) {

    // el.append('<label >{{input.text}}</label>');
    var tag = '<div  class="input-group col-md-6 col-12 row no-gutters mt-1">\r\n<div   class="input-group-prepend col-4"><span  class="input-group-text w-100 justify-content-center">' + input.text + '</span></div>\r\n';
    tag = tag + appendControl(input, bindKey, scp) + "\r\n";
    if (appendControl(input, bindKey, scp).indexOf("textarea") != -1) {
        tag = tag.replace("col-4", "col-4 col-md-2");
        tag = tag.replace("col-md-6", "");
        return tag + "</div> ";
    }
    else {
        return tag + "</div> ";
    }


}
function CustgetBootstrapTemplate(input, bindKey, scp) {

    // el.append('<label >{{input.text}}</label>');
    var tag = '<div  class="input-group   form-group row ">\r\n<div   class="input-group-prepend col-4" ><span  class="input-group-text w-100 justify-content-center"    id = "' + bindKey + '_' + input.datafield + '">' + input.text + '</span></div>\r\n';
    tag = tag + CustAppendControl(input, bindKey, scp) + "\r\n";
    if (CustAppendControl(input, bindKey, scp).indexOf("textarea") != -1) {
        tag = tag.replace("col-4", "col-4 col-md-2");
        tag = tag.replace("col-md-6", "");
        return tag + "</div> ";
    }
    else {
        return tag + "</div> ";
    }


}
function CustgetBootstrapTemplate_wb(input, bindKey, scp) {
    // el.append('<label >{{input.text}}</label>');
    var tag = '<div  class="input-group   form-group row ">\r\n<div  style="width:150px;"  class="input-group-prepend " ><span  class="input-group-text w-100 justify-content-center" style="white-space:pre-wrap;"    id = "' + bindKey + '_' + input.datafield + '">' + input.text + '</span></div>\r\n';
    tag = tag + CustAppendControl_wb(input, bindKey, scp) + "\r\n";
    if (CustAppendControl_wb(input, bindKey, scp).indexOf("textarea") != -1) {
        tag = tag.replace("col-4", "col-4 col-md-2");
        tag = tag.replace("col-md-6", "");
        return tag + "</div> ";
    }
    else {
        return tag + "</div> ";
    }


}
function getBootstrapTemplate1(input, bindKey, scp) {

    var tag = '<label >' + input.text + '</label>';
    tag += '<div  class="form-group"> ';
    tag += + appendControl(input, bindKey, scp);
    return "<div>" + tag + "</div>";


}
function getTableTemplateHTML(inputs, bindKey, scp) {
    var myInput = "<table>\r\n";
    for (p in inputs) {
        var el = "<tr>" + getTableTemplate(inputs[p], bindKey, scp) + "<tr>";
        myInput = myInput + el + "\r\n";
    }
    return myInput + "</table>";
}
function getTableTemplate(input, bindKey, scp) {
    var tag = '<th width="120px">' + input.text + '</th>\r\n<td>';
    tag = tag + appendControl(input, bindKey, scp);
    return tag + "</td>\r\n";

}
//輸入樣版元件
function appendControl(input, bindKey, scp, custTag) {
    if (custTag == undefined) custTag = "";

    //ToDO 目前只支援下拉選單，未來可以在增加
    var ngRequired = ((!input.isNullable) && bindKey == 'editdata') ? "required='required'" : '';  //編輯才需要判斷

    switch (input.ControlType) {
        case 'Dropdown':
        case 'DropDown':
        case 'DropDownList':
            var tag = "<select class='form-control' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag +
                " " + ngRequired;
            if (input.ChildField != undefined && input.ChildField != "") {
                tag += "v-on:change='on_SelectChange(" + '"' + bindKey + '","' + input.datafield + '","' + input.ChildField + '",' + bindKey + "." + input.datafield + ")'";
            }
            tag += ">\r\n<option value=''>-- 請選擇 --</option>\r\n" +
                "<option  v-for=' (value, label)   in   DropOptions." + input.datafield + "' :value='value'>{{label}}</option>" +
                "</select>";
            return tag;
            break;
        case 'SelectCheckBoxs':
            //還未加入chekbox 之後再搞
            var tag = "<select  name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "'  " + custTag +
                " " + ngRequired;
            if (input.ChildField != undefined && input.ChildField != "") {
                tag += "v-on:change='on_SelectChange(" + '"' + bindKey + '","' + input.datafield + '","' + input.ChildField + '",' + bindKey + "." + input.datafield + ")'";
            }
            tag += " multiple>" + "<option  v-for=' (value, label)   in  DropOptions." + input.datafield + "' :value='value'>{{label}}</option>" + "</select>";
            return tag;
            break;
        case 'AutoComplete':
            var tag = "<input onclick='this.value=" + '""' + "'  placeholder='請輸入或選擇'  style='width:120px' list='scp_" + scp.$id + "_" + input.datafield +
                "' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8'" +
                " " + ngRequired + " />\r\n"

            tag += "<datalist id='scp_" + scp.$id + "_" + input.datafield + "'><option  v-for='item in DropList." + input.datafield + "' >{{item}}</option>\r\n</datalist>";
            return tag;

            break;
        case "Password":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='password'  " + ngRequired + " />";
            break;
        case "CheckBox":
            return "<label class='wrap'><input name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-check-input' type='checkbox' " + ngRequired + " /><span class='checkmark'></span></label>";
            break;
        case "CheckBoxList"://已測試過ok(格式為 , 分隔)
            var tag = "<div style='float:left'><label    style='display: block;'  v-for='(value, label) in  DropOptions." + input.datafield + "' >" +
                '<input  type="checkbox" @click="onCheckList_Click(' + bindKey + ",'" + input.datafield + "'" + ',value)" ' +
                'v-bind:checked="getCheckListValue(' + bindKey + "." + input.datafield + ',value)" />{{label}}</label></div> ';
            return tag;

            break;
        case "RadioButtonList":

            var tag = "<label v-for='(value, label) in  DropOptions." + input.datafield + "' >" +
                '<input type="radio" name="' + bindKey + "_" + input.datafield + '" v-model="' + bindKey + "." + input.datafield +
                '" :value="value">{{label}}<br /></label > ';
            return tag;

            break;
        case "Date":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='date'  " + ngRequired + " />";
            break;
        case "DateTime":
            return "<input  class='form-control col-8'  name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "'  type='datetime-local' " + ngRequired + "  />";

            //        "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
            //      "' type='time'  " + ngRequired + "  /></div>";
            break;
        case "Time":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='time'  " + ngRequired + "  />";
            break;
        case "File":

            return "<div  class='form-control'>" +
                "<a target='_blank' :href='\"../api/db/DownloadFiles/" + scp.TableName + "/\"+" + bindKey + "." + scp.PrimKey + ' + "?FileName=" + ' + bindKey + "." + input.datafield + "'>" +
                "<span   name='" + bindKey + "_" + input.datafield + "' v-text='" + bindKey + "." + input.datafield +
                "'   /></a>" +
                "<input  style='display:none'  name='" + input.datafield + "' scpid='" + scp.id + "' id='" + scp.id + "_" + input.datafield + "'" +
                "' class='form-control file-upload' type='file'  @change='fileChanged'" + ngRequired +
                "/><input type='button' class=' ' style='position: absolute; right: 0;line-height:1.2;top:50%;transform:translate(0, -50%);' value='選擇檔案'  onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ");'></input></div>";
            //
            //
            break;

        case "ImageFile":
            //return `<div  class='form-control'>
            //    <a target='_blank' :href="'../api/db/DownloadFiles/${scp.TableName}/'+ ${bindKey}.${scp.PrimKey}  +'?FileName='+ ${bindKey}.${input.datafield}">
            //        <span   name="${bindKey}_${input.datafield}">
            //        {{${bindKey}.${input.datafield}}}
            //        </span>
            //    </a>
            //    <input  style='display:none'  name="${input.datafield}"  scpid="${scp.id}" id="${scp.id}_${input.datafield}"   class='form-control file-upload' type='file' @change='fileChanged'  ${ngRequired} />
            //     </div>
            //    <div class='input-group-append'><img src='../images/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile("${scp.id}_${input.datafield}")' /></div>`;
            //break;
            return "<div  class='form-control'>" +
                "<a target='_blank' :href='\"../api/db/DownloadFiles/" + scp.TableName + "/\"+" + bindKey + "." + scp.PrimKey + ' + "?FileName=" + ' + bindKey + "." + input.datafield + "'>" +
                "<span   name='" + bindKey + "_" + input.datafield + "' v-text='" + bindKey + "." + input.datafield +
                "'   /></a>" +
                "<input  style='display:none'  name='" + input.datafield + "'  scpid='" + scp.id + "' id='" + scp.id + "_" + input.datafield + "'   class='form-control file-upload' type='file' @change='fileChanged' " + ngRequired + " /></div>" +

                "<div class='input-group-append'><img src='../images/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(\"" + scp.id + "_" + input.datafield + "\")' /></div>";
            break;
        //    case "ImageFile":
        //return "<div  class='form-control'>" +
        //    "<a target='_blank' :href='../api/db/DownloadFiles/" + scp.TableName + "/{{" + bindKey + "." + scp.PrimKey + "}}?FileName={{" + bindKey + "." + input.datafield + "}}'><span   name='" + bindKey + "_" + input.datafield + "' v-bind='" + bindKey + "." + input.datafield +
        //    "'   /></a>" +
        //    "<input  style='display:none'  name='" + scp.id + "_" + input.datafield + "' id='" + scp.id + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
        //    "' class='form-control file-upload' type='file' onchange='return angular.element(this).scope().fileChanged(this,\"" + input.datafield + "\");'  " + ngRequired +
        //    " :src='{{files[0].name}}'/></input></div><div class='input-group-append'><img src='../ s/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ")'/></div>";
        //break;
        //case "ImageFile":
        //    return "<div  class='form-control'>" +
        //        "<a target='_blank' :href='../api/db/DownloadFiles/" + scp.TableName + "/{{" + bindKey + "." + scp.PrimKey + "}}?FileName={{" + bindKey + "." + input.datafield + "}}'><span   name='" + bindKey + "_" + input.datafield + "' v-bind='" + bindKey + "." + input.datafield +
        //        "'   /></a>" +
        //        "<input  style='display:none'  name='" + scp.id + "_" + input.datafield + "' id='" + scp.id + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
        //        "' class='form-control file-upload' type='file' onchange='return angular.element(this).scope().fileChanged(this,\"" + input.datafield + "\");'  " + ngRequired +
        //        " :src='{{files[0].name}}'/></input></div><div class='input-group-append'><img src='../ s/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ")'/></div>";
        //    break;
        case "GeometryPoint":
            var DrawType = "Point";
            return "<input readonly='true' id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/><div class='input-group-append'>" +
                "<input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "GeometryLine":
            var DrawType1 = "Polyline";
            return "<input readonly='true' id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/>" +
                "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType1 + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "GeometryPolygon":
            var DrawType2 = "Polygon";
            return "<input  readonly='true'  id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/>" +
                "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType2 + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "Geometry":
            return "<div  class='form-control'>" + "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMapDialog()'/></div></div>";

            break;


        case "DetailBox":
            var key = input.BindTable + "_" + input.datafield;
            VueScopes[key] = '<x-include="' + "'GridDetail.html'" + '" ng-init=' + '"'
                + 'TableName=' + "'" + input.BindTable + "';"
                + 'id=' + "'" + bindKey + "_" + input.BindTable + "_" + input.datafield + "';" + '"  ng-if="true"></x-include>';

            str = ' <x-bindhtml   :template="' + key + '"' +
                ' class="panel panel-no-border panel-gray trailer-1"  >' +
                '</x-bindhtml>';
            return str;
            break;
        case "VaildKey":
            db.GetVaildKey(function (data) {

                scp.VaildKey = input.datafield + "|" + decodeImage(data.Result, "imgKey");
            });
            return "<input class='form-control' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "required='true' type='text' placeholder='請輸入驗證碼' /> <img id='imgKey' style='z-index:20;position: absolute;right: 0px;top:50%; transform: translate(-15px, -50%);width:100px;height:34px;'/>";
            break;
        case "TextArea":

            return "<textarea   class='form-control col-10' rows='4'  name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + " " + ngRequired + " ></textarea>";

            break;
        default:
            var dtype = "";
            if (input.ControlType == null || input.ControlType == "") {
                dtype = "text";//預設為text
            } else {
                dtype = input.ControlType.replace("Range", "").toLowerCase();
            }

            //若是bindkey=搜尋狀態，則改為有區間的查詢模式
            if (bindKey == "querydata") {
                if (input.ControlType == "RangeNumber") {
                    return "<div  class='input-group col-8'>\r\n" +
                        "<input  class='form-control' type='" + dtype + "'  name='" + bindKey + "_" + input.datafield + "__from' v-model='" + bindKey + "." + input.datafield +
                        "__from'  " + ngRequired + "  />~" +
                        "<input  class='form-control' type='" + dtype + "'    name='" + bindKey + "_" + input.datafield + "__to' v-model='" + bindKey + "." + input.datafield +
                        "__to'  " + ngRequired + "  />\r\n</div>";

                } else if (input.ControlType == "RangeDate") {

                    return "<div class='input-group col-8'>\r\n" +
                        "<input  class='form-control' type='" + dtype + "'  name='" + bindKey + "_" + input.datafield + "__from' v-model='" + bindKey + "." + input.datafield +
                        "__from'  " + ngRequired + "  />~" +
                        "<input   class='form-control' type='" + dtype + "'    name='" + bindKey + "_" + input.datafield + "__to' v-model='" + bindKey + "." + input.datafield +
                        "__to' " + ngRequired + " />\r\n</div>";

                }
            }
            return "<input  class='form-control' type='" + dtype + "'   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "   " + ngRequired + " />";
            //{{" + bindKey + "." + input.datafield + " }}
            break;
    }
}

//輸入樣版元件
function CustAppendControl(input, bindKey, scp, custTag) {
    if (custTag == undefined) custTag = "";

    //ToDO 目前只支援下拉選單，未來可以在增加
    var ngRequired = ((!input.isNullable) && bindKey == 'editdata') ? "required='required'" : '';  //編輯才需要判斷


    switch (input.ControlType) {
        case 'Dropdown':
        case 'DropDown':
        case 'DropDownList':
            var tag = "<select :disabled='isView' class='form-control' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag +
                " " + ngRequired;
            if (input.ChildField != undefined && input.ChildField != "") {
                tag += "v-on:change='on_SelectChange(" + '"' + bindKey + '","' + input.datafield + '","' + input.ChildField + '",' + bindKey + "." + input.datafield + ")'";
            }
            tag += ">\r\n<option value=''>-- 請選擇 --</option>\r\n" +
                "<option  v-for=' (value, label)   in   DropOptions." + input.datafield + "' :value='value'>{{label}}</option>" +
                "</select>";
            return tag;
            break;
        case 'SelectCheckBoxs':
            //還未加入chekbox 之後再搞
            var tag = "<select  name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "'  " + custTag +
                " " + ngRequired;
            if (input.ChildField != undefined && input.ChildField != "") {
                tag += "v-on:change='on_SelectChange(" + '"' + bindKey + '","' + input.datafield + '","' + input.ChildField + '",' + bindKey + "." + input.datafield + ")'";
            }
            tag += " multiple>" + "<option  v-for=' (value, label)   in  DropOptions." + input.datafield + "' :value='value'>{{label}}</option>" + "</select>";
            return tag;
            break;
        case 'AutoComplete':
            var tag = "<input onclick='this.value=" + '""' + "'  placeholder='請輸入或選擇'  style='width:120px' list='scp_" + scp.$id + "_" + input.datafield +
                "' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8'" +
                " " + ngRequired + " />\r\n"

            tag += "<datalist id='scp_" + scp.$id + "_" + input.datafield + "'><option  v-for='item in DropList." + input.datafield + "' >{{item}}</option>\r\n</datalist>";
            return tag;

            break;
        case "Password":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='password'  " + ngRequired + " />";
            break;
        case "CheckBox":
            return "<label class='wrap'><input name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-check-input' type='checkbox' " + ngRequired + " /><span class='checkmark'></span></label>";
            break;
        case "CheckBoxList"://已測試過ok(格式為 , 分隔)
            var tag = "<div style='float:left'><label    style='display: block;'  v-for='(value, label) in  DropOptions." + input.datafield + "' >" +
                '<input  type="checkbox" @click="onCheckList_Click(' + bindKey + ",'" + input.datafield + "'" + ',value)" ' +
                'v-bind:checked="getCheckListValue(' + bindKey + "." + input.datafield + ',value)" />{{label}}</label></div> ';
            return tag;

            break;
        case "RadioButtonList":

            var tag = "<label v-for='(value, label) in  DropOptions." + input.datafield + "' >" +
                '<input type="radio" name="' + bindKey + "_" + input.datafield + '" v-model="' + bindKey + "." + input.datafield + '" :value="value">{{label}}</label > ';
            return tag;

            break;
        case "Date":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='date'  " + ngRequired + " />";
            break;
        case "DateTime":
            return "<input  class='form-control col-8'  name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "'  type='datetime-local' " + ngRequired + "  />";

            //        "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
            //      "' type='time'  " + ngRequired + "  /></div>";
            break;
        case "Time":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='time'  " + ngRequired + "  />";
            break;
        case "File":

            return "<div  class='form-control'>" +
                "<a target='_blank' :href='\"../api/db/DownloadFiles/" + scp.TableName + "/\"+" + bindKey + "." + scp.PrimKey + ' + "?FileName=" + ' + bindKey + "." + input.datafield + "'>" +
                "<span   name='" + bindKey + "_" + input.datafield + "' v-text='" + bindKey + "." + input.datafield +
                "'   /></a>" +
                "<input  style='display:none'  name='" + input.datafield + "' scpid='" + scp.id + "' id='" + scp.id + "_" + input.datafield + "'" +
                "' class='form-control file-upload' type='file'  @change='fileChanged'" + ngRequired +
                "/><input type='button' class=' ' style='position: absolute; right: 0;line-height:1.2;top:50%;transform:translate(0, -50%);' value='選擇檔案'  onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ");'></input></div>";
            //
            //
            break;

        case "ImageFile":
            //return `<div  class='form-control'>
            //    <a target='_blank' :href="'../api/db/DownloadFiles/${scp.TableName}/'+ ${bindKey}.${scp.PrimKey}  +'?FileName='+ ${bindKey}.${input.datafield}">
            //        <span   name="${bindKey}_${input.datafield}">
            //        {{${bindKey}.${input.datafield}}}
            //        </span>
            //    </a>
            //    <input  style='display:none'  name="${input.datafield}"  scpid="${scp.id}" id="${scp.id}_${input.datafield}"   class='form-control file-upload' type='file' @change='fileChanged'  ${ngRequired} />
            //     </div>
            //    <div class='input-group-append'><img src='../images/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile("${scp.id}_${input.datafield}")' /></div>`;
            //break;
            return "<div  class='form-control'>" +
                "<a target='_blank' :href='\"../api/db/DownloadFiles/" + scp.TableName + "/\"+" + bindKey + "." + scp.PrimKey + ' + "?FileName=" + ' + bindKey + "." + input.datafield + "'>" +
                "<span   name='" + bindKey + "_" + input.datafield + "' v-text='" + bindKey + "." + input.datafield +
                "'   /></a>" +
                "<input  style='display:none'  name='" + input.datafield + "'  scpid='" + scp.id + "' id='" + scp.id + "_" + input.datafield + "'   class='form-control file-upload' type='file' @change='fileChanged' " + ngRequired + " /></div>" +

                "<div class='input-group-append'><img src='../images/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(\"" + scp.id + "_" + input.datafield + "\")' /></div>";
            break;
        //    case "ImageFile":
        //return "<div  class='form-control'>" +
        //    "<a target='_blank' :href='../api/db/DownloadFiles/" + scp.TableName + "/{{" + bindKey + "." + scp.PrimKey + "}}?FileName={{" + bindKey + "." + input.datafield + "}}'><span   name='" + bindKey + "_" + input.datafield + "' v-bind='" + bindKey + "." + input.datafield +
        //    "'   /></a>" +
        //    "<input  style='display:none'  name='" + scp.id + "_" + input.datafield + "' id='" + scp.id + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
        //    "' class='form-control file-upload' type='file' onchange='return angular.element(this).scope().fileChanged(this,\"" + input.datafield + "\");'  " + ngRequired +
        //    " :src='{{files[0].name}}'/></input></div><div class='input-group-append'><img src='../ s/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ")'/></div>";
        //break;
        //case "ImageFile":
        //    return "<div  class='form-control'>" +
        //        "<a target='_blank' :href='../api/db/DownloadFiles/" + scp.TableName + "/{{" + bindKey + "." + scp.PrimKey + "}}?FileName={{" + bindKey + "." + input.datafield + "}}'><span   name='" + bindKey + "_" + input.datafield + "' v-bind='" + bindKey + "." + input.datafield +
        //        "'   /></a>" +
        //        "<input  style='display:none'  name='" + scp.id + "_" + input.datafield + "' id='" + scp.id + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
        //        "' class='form-control file-upload' type='file' onchange='return angular.element(this).scope().fileChanged(this,\"" + input.datafield + "\");'  " + ngRequired +
        //        " :src='{{files[0].name}}'/></input></div><div class='input-group-append'><img src='../ s/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ")'/></div>";
        //    break;
        case "GeometryPoint":
            var DrawType = "Point";
            return "<input readonly='true' id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/><div class='input-group-append'>" +
                "<input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "GeometryLine":
            var DrawType1 = "Polyline";
            return "<input readonly='true' id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/>" +
                "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType1 + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "GeometryPolygon":
            var DrawType2 = "Polygon";
            return "<input  readonly='true'  id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/>" +
                "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType2 + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "Geometry":
            return "<div  class='form-control'>" + "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMapDialog()'/></div></div>";

            break;


        case "DetailBox":
            var key = input.BindTable + "_" + input.datafield;
            VueScopes[key] = '<x-include="' + "'GridDetail.html'" + '" ng-init=' + '"'
                + 'TableName=' + "'" + input.BindTable + "';"
                + 'id=' + "'" + bindKey + "_" + input.BindTable + "_" + input.datafield + "';" + '"  ng-if="true"></x-include>';

            str = ' <x-bindhtml   :template="' + key + '"' +
                ' class="panel panel-no-border panel-gray trailer-1"  >' +
                '</x-bindhtml>';
            return str;
            break;
        case "VaildKey":
            db.GetVaildKey(function (data) {

                scp.VaildKey = input.datafield + "|" + decodeImage(data.Result, "imgKey");
            });
            return "<input class='form-control' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "required='true' type='text' placeholder='請輸入驗證碼' /> <img id='imgKey' style='z-index:20;position: absolute;right: 0px;top:50%; transform: translate(-15px, -50%);width:100px;height:34px;'/>";
            break;
        case "TextArea":

            return "<textarea   class='form-control col-10' rows='4'  name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + " " + ngRequired + "  ></textarea>";

            break;
        default:
            var dtype = "";
            if (input.ControlType == null || input.ControlType == "") {
                dtype = "text";//預設為text
            } else {
                dtype = input.ControlType.replace("Range", "").toLowerCase();
            }

            //若是bindkey=搜尋狀態，則改為有區間的查詢模式
            if (bindKey == "querydata") {
                if (input.ControlType == "RangeNumber") {
                    return "<div  class='input-group col-8'>\r\n" +
                        "<input  class='form-control' type='" + dtype + "'  name='" + bindKey + "_" + input.datafield + "__from' v-model='" + bindKey + "." + input.datafield +
                        "__from'  " + ngRequired + "  />~" +
                        "<input  class='form-control' type='" + dtype + "'    name='" + bindKey + "_" + input.datafield + "__to' v-model='" + bindKey + "." + input.datafield +
                        "__to'  " + ngRequired + "  />\r\n</div>";

                } else if (input.ControlType == "RangeDate") {

                    return "<div class='input-group col-8'>\r\n" +
                        "<input  class='form-control' type='" + dtype + "'  name='" + bindKey + "_" + input.datafield + "__from' v-model='" + bindKey + "." + input.datafield +
                        "__from'  " + ngRequired + "  />~" +
                        "<input   class='form-control' type='" + dtype + "'    name='" + bindKey + "_" + input.datafield + "__to' v-model='" + bindKey + "." + input.datafield +
                        "__to' " + ngRequired + " />\r\n</div>";

                }
            }
            return "<input :disabled='isView' class='form-control' type='" + dtype + "'   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "   " + ngRequired + " />";
            //{{" + bindKey + "." + input.datafield + " }}
            break;
    }
}
function CustAppendControl_wb(input, bindKey, scp, custTag) {
    if (custTag == undefined) custTag = "";

    //ToDO 目前只支援下拉選單，未來可以在增加
    var ngRequired = ((!input.isNullable) && bindKey == 'editdata') ? "required='required'" : '';  //編輯才需要判斷


    switch (input.ControlType) {
        case 'Dropdown':
        case 'DropDown':
        case 'DropDownList':
            var tag = "<select class='form-control' style='height:auto;' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag +
                " " + ngRequired;
            if (input.ChildField != undefined && input.ChildField != "") {
                tag += "v-on:change='on_SelectChange(" + '"' + bindKey + '","' + input.datafield + '","' + input.ChildField + '",' + bindKey + "." + input.datafield + ")'";
            }
            tag += ">\r\n<option value=''>-- 請選擇 --</option>\r\n" +
                "<option  v-for=' (value, label)   in   DropOptions." + input.datafield + "' :value='value'>{{label}}</option>" +
                "</select>";
            return tag;
            break;
        case 'SelectCheckBoxs':
            //還未加入chekbox 之後再搞
            var tag = "<select  style='height:auto;' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "'  " + custTag +
                " " + ngRequired;
            if (input.ChildField != undefined && input.ChildField != "") {
                tag += "v-on:change='on_SelectChange(" + '"' + bindKey + '","' + input.datafield + '","' + input.ChildField + '",' + bindKey + "." + input.datafield + ")'";
            }
            tag += " multiple>" + "<option  v-for=' (value, label)   in  DropOptions." + input.datafield + "' :value='value'>{{label}}</option>" + "</select>";
            return tag;
            break;
        case 'AutoComplete':
            var tag = "<input style='height:auto;' onclick='this.value=" + '""' + "'  placeholder='請輸入或選擇'  style='width:120px' list='scp_" + scp.$id + "_" + input.datafield +
                "' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8'" +
                " " + ngRequired + " />\r\n"

            tag += "<datalist id='scp_" + scp.$id + "_" + input.datafield + "'><option  v-for='item in DropList." + input.datafield + "' >{{item}}</option>\r\n</datalist>";
            return tag;

            break;
        case "Password":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='password'  " + ngRequired + " />";
            break;
        case "CheckBox":
            return "<label class='wrap'><input name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-check-input' type='checkbox' " + ngRequired + " /><span class='checkmark'></span></label>";
            break;
        case "CheckBoxList"://已測試過ok(格式為 , 分隔)
            var tag = "<div style='float:left'><label    style='display: block;'  v-for='(value, label) in  DropOptions." + input.datafield + "' >" +
                '<input  type="checkbox" @click="onCheckList_Click(' + bindKey + ",'" + input.datafield + "'" + ',value)" ' +
                'v-bind:checked="getCheckListValue(' + bindKey + "." + input.datafield + ',value)" />{{label}}</label></div> ';
            return tag;

            break;
        case "RadioButtonList":

            var tag = "<label v-for='(value, label) in  DropOptions." + input.datafield + "' >" +
                '<input type="radio" name="' + bindKey + "_" + input.datafield + '" v-model="' + bindKey + "." + input.datafield + '" :value="value">{{label}}</label > ';
            return tag;

            break;
        case "Date":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='date'  " + ngRequired + " />";
            break;
        case "DateTime":
            return "<input  class='form-control col-8'  name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "'  type='datetime-local' " + ngRequired + "  />";

            //        "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
            //      "' type='time'  " + ngRequired + "  /></div>";
            break;
        case "Time":
            return "<input   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='time'  " + ngRequired + "  />";
            break;
        case "File":

            return "<div  class='form-control' style='height:auto;'>" +
                "<a target='_blank' :href='\"../api/db/DownloadFiles/" + scp.TableName + "/\"+" + bindKey + "." + scp.PrimKey + ' + "?FileName=" + ' + bindKey + "." + input.datafield + "'>" +
                "<span   name='" + bindKey + "_" + input.datafield + "' v-text='" + bindKey + "." + input.datafield +
                "'   /></a>" +
                "<input  style='display:none'  name='" + input.datafield + "' scpid='" + scp.id + "' id='" + scp.id + "_" + input.datafield + "'" +
                "' class='form-control file-upload' type='file'  @change='fileChanged'" + ngRequired +
                "/><input type='button' class=' ' style='position: absolute; right: 0;line-height:1.2;top:50%;transform:translate(0, -50%);' value='選擇檔案'  onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ");'></input></div>";
            //
            //
            break;

        case "ImageFile":
            //return `<div  class='form-control'>
            //    <a target='_blank' :href="'../api/db/DownloadFiles/${scp.TableName}/'+ ${bindKey}.${scp.PrimKey}  +'?FileName='+ ${bindKey}.${input.datafield}">
            //        <span   name="${bindKey}_${input.datafield}">
            //        {{${bindKey}.${input.datafield}}}
            //        </span>
            //    </a>
            //    <input  style='display:none'  name="${input.datafield}"  scpid="${scp.id}" id="${scp.id}_${input.datafield}"   class='form-control file-upload' type='file' @change='fileChanged'  ${ngRequired} />
            //     </div>
            //    <div class='input-group-append'><img src='../images/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile("${scp.id}_${input.datafield}")' /></div>`;
            //break;
            return "<div  class='form-control' style='height:auto;'>" +
                "<a target='_blank' :href='\"../api/db/DownloadFiles/" + scp.TableName + "/\"+" + bindKey + "." + scp.PrimKey + ' + "?FileName=" + ' + bindKey + "." + input.datafield + "'>" +
                "<span   name='" + bindKey + "_" + input.datafield + "' v-text='" + bindKey + "." + input.datafield +
                "'   /></a>" +
                "<input  style='display:none'  name='" + input.datafield + "'  scpid='" + scp.id + "' id='" + scp.id + "_" + input.datafield + "'   class='form-control file-upload' type='file' @change='fileChanged' " + ngRequired + " /></div>" +

                "<div class='input-group-append'><img src='../images/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(\"" + scp.id + "_" + input.datafield + "\")' /></div>";
            break;
        //    case "ImageFile":
        //return "<div  class='form-control'>" +
        //    "<a target='_blank' :href='../api/db/DownloadFiles/" + scp.TableName + "/{{" + bindKey + "." + scp.PrimKey + "}}?FileName={{" + bindKey + "." + input.datafield + "}}'><span   name='" + bindKey + "_" + input.datafield + "' v-bind='" + bindKey + "." + input.datafield +
        //    "'   /></a>" +
        //    "<input  style='display:none'  name='" + scp.id + "_" + input.datafield + "' id='" + scp.id + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
        //    "' class='form-control file-upload' type='file' onchange='return angular.element(this).scope().fileChanged(this,\"" + input.datafield + "\");'  " + ngRequired +
        //    " :src='{{files[0].name}}'/></input></div><div class='input-group-append'><img src='../ s/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ")'/></div>";
        //break;
        //case "ImageFile":
        //    return "<div  class='form-control'>" +
        //        "<a target='_blank' :href='../api/db/DownloadFiles/" + scp.TableName + "/{{" + bindKey + "." + scp.PrimKey + "}}?FileName={{" + bindKey + "." + input.datafield + "}}'><span   name='" + bindKey + "_" + input.datafield + "' v-bind='" + bindKey + "." + input.datafield +
        //        "'   /></a>" +
        //        "<input  style='display:none'  name='" + scp.id + "_" + input.datafield + "' id='" + scp.id + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
        //        "' class='form-control file-upload' type='file' onchange='return angular.element(this).scope().fileChanged(this,\"" + input.datafield + "\");'  " + ngRequired +
        //        " :src='{{files[0].name}}'/></input></div><div class='input-group-append'><img src='../ s/camera.svg' class='input-group-text p-0' style='width:34px;cursor:pointer;' onclick='openfile(" + '"' + scp.id + "_" + input.datafield + '"' + ")'/></div>";
        //    break;
        case "GeometryPoint":
            var DrawType = "Point";
            return "<input readonly='true' id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/><div class='input-group-append'>" +
                "<input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "GeometryLine":
            var DrawType1 = "Polyline";
            return "<input readonly='true' id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/>" +
                "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType1 + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "GeometryPolygon":
            var DrawType2 = "Polygon";
            return "<input  readonly='true'  id='" + scp.id + input.datafield + "' class='form-control' type='text' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "/>" +
                "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMap(" + '"' + DrawType2 + '","' + scp.id + input.datafield + '"' + ")'/></div>";
            break;
        case "Geometry":
            return "<div  class='form-control'>" + "<div class='input-group-append'><input type='button' value='圖面繪製' class='btn btn-info' onclick='DrawToMapDialog()'/></div></div>";

            break;


        case "DetailBox":
            var key = input.BindTable + "_" + input.datafield;
            VueScopes[key] = '<x-include="' + "'GridDetail.html'" + '" ng-init=' + '"'
                + 'TableName=' + "'" + input.BindTable + "';"
                + 'id=' + "'" + bindKey + "_" + input.BindTable + "_" + input.datafield + "';" + '"  ng-if="true"></x-include>';

            str = ' <x-bindhtml   :template="' + key + '"' +
                ' class="panel panel-no-border panel-gray trailer-1"  >' +
                '</x-bindhtml>';
            return str;
            break;
        case "VaildKey":
            db.GetVaildKey(function (data) {

                scp.VaildKey = input.datafield + "|" + decodeImage(data.Result, "imgKey");
            });
            return "<input class='form-control' name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "required='true' type='text' placeholder='請輸入驗證碼' /> <img id='imgKey' style='z-index:20;position: absolute;right: 0px;top:50%; transform: translate(-15px, -50%);width:100px;height:34px;'/>";
            break;
        case "TextArea":

            return "<textarea   class='form-control col-10' rows='4'  name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + " " + ngRequired + "  ></textarea>";

            break;
        default:
            var dtype = "";
            if (input.ControlType == null || input.ControlType == "") {
                dtype = "text";//預設為text
            } else {
                dtype = input.ControlType.replace("Range", "").toLowerCase();
            }

            //若是bindkey=搜尋狀態，則改為有區間的查詢模式
            if (bindKey == "querydata") {
                if (input.ControlType == "RangeNumber") {
                    return "<div  class='input-group col-8'>\r\n" +
                        "<input  class='form-control' type='" + dtype + "'  name='" + bindKey + "_" + input.datafield + "__from' v-model='" + bindKey + "." + input.datafield +
                        "__from'  " + ngRequired + "  />~" +
                        "<input  class='form-control' type='" + dtype + "'    name='" + bindKey + "_" + input.datafield + "__to' v-model='" + bindKey + "." + input.datafield +
                        "__to'  " + ngRequired + "  />\r\n</div>";

                } else if (input.ControlType == "RangeDate") {

                    return "<div class='input-group col-8'>\r\n" +
                        "<input  class='form-control' type='" + dtype + "'  name='" + bindKey + "_" + input.datafield + "__from' v-model='" + bindKey + "." + input.datafield +
                        "__from'  " + ngRequired + "  />~" +
                        "<input   class='form-control' type='" + dtype + "'    name='" + bindKey + "_" + input.datafield + "__to' v-model='" + bindKey + "." + input.datafield +
                        "__to' " + ngRequired + " />\r\n</div>";

                }
            }
            return "<input  class='form-control' style='height:auto;' type='" + dtype + "'   name='" + bindKey + "_" + input.datafield + "' v-model='" + bindKey + "." + input.datafield +
                "' " + custTag + "   " + ngRequired + " />";
            //{{" + bindKey + "." + input.datafield + " }}
            break;
    }
}
function openfile(f) {
    $("#" + f).trigger("click");
}
function DrawToMap(method, id) {
    //是否開啟地圖

    var isopenMap = window.parent.map == undefined;
    if (isopenMap == true) {
        //另開啟圖台的方式
        window.open('./OL3Map.html?DrawType=' + method + '&returnCtr=' + id, '圖面繪製', config = 'height=500,width=500');
    } else {
        //單獨坐在系統上面
        window.parent.map.CustDrawLayer.clearPaths();
        window.parent.$('#myModal').modal('hide');
        window.parent.map.DrawTool.SetDrawMethod(method,
            function (d) {

                $('#' + id).val(d.WKT);
                $('#' + id).change();

                window.parent.$('#myModal').modal('show');
            });
        //console.log(parent);
    }
}

function SetValue(coor, column) {
    console.log(coor);
    $('#' + column).val(coor.WKT);
    $('#' + column).change();
}
function CustSetValue(coor, column) {
    console.log("圖面選擇內容", coor);
    var aColumn = column.split(",")
    debugger;
    VueScopes[scope.id].editdata[aColumn[0]] = coor.TWD97.x + "," + coor.TWD97.y;
    VueScopes[scope.id].editdata[aColumn[1]] = coor.WGS84.x + "," + coor.WGS84.y;
    if (aColumn[2]) {
        VueScopes[scope.id].OftenOption[aColumn[2]][0] = coor.KM;
        VueScopes[scope.id].OftenOption[aColumn[2]][1] = coor.M;
        VueScopes[scope.id].editdata[aColumn[2]] = VueScopes[scope.id].OftenOption[aColumn[2]].join(",")
    }
}
function decodeImage(key, imgDomID) {
    var img = $("#" + imgDomID);
    var len = parseInt(key.substring(0, 2));
    var Vkey = key.substring(2, len + 2);

    if (img.length > 0) {

        img.attr('src', 'data:image/jpeg;base64,' + key.substring(len + 2));
    } else {
        setTimeout(function () { decodeImage(key, imgDomID); }, 1000);
    }
    return Vkey;
}


function setSelectValue(scp, CKey, TableName, txtField, valField, filter, callback) {
    scp.DropOptions[CKey] = {
        '讀取中...': 'loading'
    };
    if (scp.$apply) scp.$apply();

    db.GetDistinctValues(TableName, filter, txtField + "," + valField,
        function (data) {
            var p = new Object; //var p=[];這裡如果用陣列，會綁定不到
            if (data.isSuccess) {

                if (data.Result.length > 0) {

                    for (var i in data.Result) {
                        //先轉成數字
                        if (data.Result[i][valField] != null) {
                            var slen = data.Result[i][valField].toString().length;
                            //避免開頭為0的字串如('013432'),paserInt後變13432

                            var value = parseInt(data.Result[i][valField]);
                            //如果轉失敗代表是字串
                            if (isNaN(value) || value.toString().length != slen) {//長度要一樣才是正確的數字
                                p[data.Result[i][txtField]] = data.Result[i][valField];
                            } else {

                                p[data.Result[i][txtField]] = value;
                            }
                        }
                    }

                }
            }
            scp.DropOptions[CKey] = p;
            if (callback != null) {
                callback(data);
            }

            scp.$apply();
        });
}
function setAutoComplteValue(scp, CKey, TableName, valField, filter, callback) {
    scp.DropList[CKey] = ['讀取中...'];

    db.GetDistinctValues(TableName, filter, valField,
        function (data) {
            var p = [];
            if (data.isSuccess) {
                if (data.Result.length > 0) {
                    for (var i in data.Result) {
                        p.push(data.Result[i][valField]);
                    }
                }
            }
            scp.DropList[CKey] = p;
            if (callback != null) {
                callback(data);
            }
            scp.$apply();
        });
}




function AjaxQuery(url, QueryData, retFunc) {
    return $.ajax({
        type: 'GET',
        url: url,
        data: QueryData,
        dataType: "json",
        success: function (data) {
            if (QueryData !== null) {
                retFunc(data, QueryData)
            } else {
                retFunc(data)
            };
        },
        error: function (e, r, h) {
            if (e.status !== 520)
                alert(' (status:' + r + ' error:' + h + ')');
        }
    });
}
function UploadFiles(d, fn) {
    var pid = "";
    if (scope.editdata[m_PrimKey] == undefined) {
        pid = d.Result[0]
    } else {
        pid = scope.editdata[m_PrimKey];
    }
    var files = $('input[type="file"]');
    var allFile = [];
    for (var i = 0; i < files.length; i++) {
        var file = files[i].files[0];
        allFile.push(file);
    }
    if (allFile.length > 0) {
        db.UploadFiles(allFile, scope.TableName, pid, function (ret) {
            fn(ret);
        });
    } else {
        fn({ Result: "no data", isSuccess: true });
    }


    return true;
}
function CheckFile(f) {
    var file = f.files[0];
    if (file != undefined) {
        if (file.size > 200000000) {
            alert('檔案大小:限200MB');
            f.value = '';
            return false;
        } else {

            var attr = f.name.replace("editdata_", "");

            var validExtensions = new Array();
            var extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            validExtensions[0] = 'doc';
            validExtensions[1] = 'docx';
            validExtensions[2] = 'pdf';
            validExtensions[3] = 'jpg';
            validExtensions[4] = 'jpeg';
            validExtensions[5] = 'png';

            for (var i = 0; i < validExtensions.length; i++) {
                if (extension == validExtensions[i]) {
                    return true;
                }
            }

            alert('檔案格式：限doc、docx、pdf、jpg、jpeg、png');
            f.value = '';
            return false;
        }
    }
}
function ExportExcell(datalist, Columns) {

    var tab_text = createTableHtml(datalist, Columns);


    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "download.xls");
    }
    else {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
        element.setAttribute('download', scope.TableName + ".xls");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

    }

}
function createTableHtml(datalist, Columns, cssClass) {

    var tbHtml = '<table border="1"   class="' + cssClass + '"><tr>';
    for (i in Columns) {
        if (Columns[i].hidden == false && Columns[i].datafield != "Action" && Columns[i].text != "") {
            tbHtml = tbHtml + '<th vertical-align="middle">' + Columns[i].text + '</th>';
        }
    }
    tbHtml = tbHtml + '</tr>';
    for (j in datalist) {
        tbHtml = tbHtml + '<tr>';
        for (i in Columns) {
            if (Columns[i].hidden == false && Columns[i].datafield != "Action" && Columns[i].text != "") {
                if (datalist[j][Columns[i].datafield] == null) {
                    tbHtml = tbHtml + '<td vertical-align="middle"></td>';
                } else {
                    tbHtml = tbHtml + '<td vertical-align="middle">' + datalist[j][Columns[i].datafield] + '</td>';
                }

            }
        }
        tbHtml = tbHtml + '</tr>';
    }
    tbHtml = tbHtml + '</table>';
    return tbHtml;
}

//解決自數過長


function tooLong() {
    $('.input-group-text').each(function () {

        $(this).attr('style', 'width:${$(this).parent(".input-group-prepend").width()}px!important;text-overflow:ellipsis;display:inline-block;overflow:hidden;');
        $(this).attr('title', $(this).text());
    })
}
var VueScopes = [];
function x_include(item, callback) {

    var includes = $(item).find("div[x-include]");
    var k = 0;

    if (includes.length > 0) {
        for (var i = 0; i < includes.length; i++) {
            var item = includes[i];
            var src = $(item).attr("x-include").replace("'", '').replace("'", '');
            var attr = $(item).attr("x-init");

            $.ajax({
                url: src,
                sender: $(item),
                success: function (data) {
                    this.sender.ready(function () {
                        k++;
                        var scp = {};
                        if (attr) scp = JSON.parse(attr);
                        VueScopes[scp.id] = scp;
                        scp.$apply = function () {
                            if (scp.vm)
                                scp.vm.$forceUpdate();
                            //內部樣版的更新
                            for (let i in scp) {
                                if (i.indexOf("vm") > -1) {
                                    if (scp[i].$forceUpdate) {
                                        scp[i].$forceUpdate();
                                    }
                                }
                            }
                        }

                        callback(scp);
                        x_include(item, function () {
                            if (k == includes.length) {
                                //callback();
                            }
                        });

                    });

                    this.sender.html(data);
                }

            });
        }
    } else {

        if (callback != undefined) {
            callback();
        }
    }
}

function XRaiseInput(scp) {
    //=======下拉選單===============
    scp.DropOptions = {};
    scp.DropList = [];
    //=====================
    //========增加連動下拉事件============
    scp.on_SelectChange = function (bindKey, ParentField, ChildField, value, callback) {
        var c;
        var cs;
        if (scp.Columns != undefined)
            cs = scp.Columns;
        else
            cs = m_Columns;
        for (var i in cs) {
            c = cs[i];
            if (c.datafield == ChildField) {
                break;
            }
        }
        var filter = this.getFilter(cs, bindKey, ParentField);

        $("select[name='" + bindKey + "_" + ParentField + "']").attr('disabled', true);
        var sel = $("select[name='" + bindKey + "_" + ChildField + "']");
        sel.attr('disabled', true);
        sel.text("");
        if (sel.length > 1) {
            alert("[name='" + bindKey + "_" + ChildField + "'] 找到重覆物件,可能會造成無法綁定資料，請確認");

        }




        if (c.ControlType == "AutoComplete") {

            setAutoComplteValue(scp, c.datafield,
                c.BindTable, c.BindValueField, filter,
                function (d) {
                    $("select[name='" + bindKey + "_" + ParentField + "']").attr('disabled', false);
                    $("select[name='" + bindKey + "_" + ChildField + "']").attr('disabled', false);
                });

        } else {

            setSelectValue(scp, c.datafield, c.BindTable, c.BindDataField, c.BindValueField, filter,
                function (d) {
                    $("select[name='" + bindKey + "_" + ParentField + "']").attr('disabled', false);
                    $("select[name='" + bindKey + "_" + ChildField + "']").attr('disabled', false);


                    if (callback != undefined) {
                        callback(sel, d);
                    }
                });
        }


    };
    //========CheckBoxList===============
    scp.getCheckListValue = function (s, v) {
        if (s == null) return false;
        var idx = s.indexOf(v);
        if (idx > -1) {

            return true;
        }
        else { //無
            return false;
        }
    }
    //點選Checkbox
    scp.onCheckList_Click = function (data, key, v) {
        //取得傳入的角色在user.Roles的Index

        var p = data[key];//this.user[key];

        if (p == null || p == "") {
            s = [];
        } else {
            s = p.split(",");

        }
        var idx = s.indexOf(v);

        if (idx > -1) {
            //無
            s.splice(idx, 1);
        }
        else {
            s.push(v);
        }

        data[key] = s.join(",");
    };
    scp.custGetCheckListValue = function (option, index) {
        if (!option) return false;
        if (option[index] > 0)
            return true
        else
            return false
    }
    scp.custOnCheckList_Click = function (data, key, index) {

        var arr = data[key].split(",");
        arr[index] == 0 ? arr[index] = 1 : arr[index] = 0;
        scp.OftenOption[key][index] == 0 ? scp.OftenOption[key][index] = 1 : scp.OftenOption[key][index] = 0;
        data[key] = arr.join(",");
    };
    scp.custOnCheckList_Change = function (data, key, index, e) {

        var arr = data[key].split(",");
        arr[index] = e.currentTarget.value;
        scp.OftenOption[key][index] = e.currentTarget.value;
        data[key] = arr.join(",");
    };
    //點選Radiobox
    scp.custGetRadioListValue = function (option, index) {
        if (!option) return false;
        if (option[index] > 0)
            return true
        else
            return false
    }
    scp.custOnRadioList_Click = function (data, key, index) {
        var arr = data[key].split(",");
        arr.forEach(function (item, i, array) {
            array[i] = 0;
        })
        arr[index] = 1;
        scp.OftenOption[key].forEach(function (item, i, array) {
            array[i] = 0;
        })
        scp.OftenOption[key][index] = 1
        data[key] = arr.join(",");
        VueScopes[scp.id].$forceUpdate();
    };
    //===========連動下拉條件==================
    scp.getFilter = function (Columns, bindKey, ParentField) {

        var c;
        for (var i in Columns) {
            c = Columns[i];
            if (c.datafield.toLowerCase() == ParentField.toLowerCase()) {
                var value = this[bindKey][ParentField];
                if (value == null || value == undefined) {

                    value = '';

                }
                try {
                    if (c.ParentField != null && c.ParentField != "") {
                        return ParentField + "='" + value.toString().trimRight() + "' and " + this.getFilter(Columns, bindKey, c.ParentField);
                    } else {
                        return ParentField + "='" + value.toString().trimRight() + "'";
                    }
                } catch (e) {

                }

                break;
            }
        }
    }

    scp.RaiseInputData = function () {
        for (var i in this.Columns) {
            var c = this.Columns[i];
            if (c.isSearch) {//需配合div_Search
                this.querydata[c.datafield] = "";
                this.SearchInputs.push(c);
            }
            if (c.isInput) {//配合div_Inputs
                this.editdata[c.datafield] = "";
                this.inputs.push(c);
            }
            if (c.datafield == "geo" || c.datafield == "geom") { //SQLSERVER
                new GisApi(this);
                this.GeoKey = c.datafield;
            }
            RaiseInputData(this, c)
        }
        this.inputs.sort(function (a, b) {
            return a.SortIndex - b.SortIndex
        })



        //======================================== 

        this.SearchHtml = getBootstrapTemplateHTML(this.SearchInputs, 'querydata', scp);

        this.InputHtml = getBootstrapTemplateHTML(this.inputs, 'editdata', scp);

        this.CustInputHtml = CustgetBootstrapTemplateHTML(this.inputs, 'editdata', scp);

        this.CustInputHtml_wb = CustgetBootstrapTemplateHTML_wb(this.inputs, 'editdata', scp);
    }
    function RaiseInputData(scp, c, callback) {
        //===========產生下拉選單資料=============
        if (c.ControlType == "DropDownList" || c.ControlType == "AutoComplete" ||
            c.ControlType == "CheckBoxList" || c.ControlType == "RadioButtonList" || c.ControlType == "SelectCheckBoxs") {

            scp.DropOptions[c.datafield] = new Object;
            scp.DropList[c.datafield] = [];
            if (c.BindTable === '') {
                db.SelectTable('ValueMapping',
                    "TableName='" + scp.TableName + "' and FieldName='" + c.datafield + "'",
                    function (data) {
                        if (data.isSuccess) {
                            if (data.Result.length > 0) {
                                var p = scp.DropOptions[data.Result[0].FieldName];
                                var pList = scp.DropList[data.Result[0].FieldName];

                                for (var i in data.Result) {
                                    var value = parseInt(data.Result[i].DataValue);
                                    if (isNaN(value)) {
                                        p[data.Result[i].DataText] = data.Result[i].DataValue;
                                    } else {
                                        p[data.Result[i].DataText] = value;
                                    }
                                    pList.push(data.Result[i][c.BindValueField]);
                                }
                                scp.$apply();
                            }
                        } else {
                            alert("RaiseInputData錯誤(ValueMapping):" + data.ErrorMsg);
                        }
                    });
            } else if (c.BindTable !== '') {
                if (c.ControlType == "AutoComplete") {
                    setAutoComplteValue(scp, c.datafield, c.BindTable, c.BindValueField, "1=1", callback);

                } else {

                    setSelectValue(scp, c.datafield, c.BindTable, c.BindDataField, c.BindValueField, "1=1", callback);
                }

            }

        }
    }

}

