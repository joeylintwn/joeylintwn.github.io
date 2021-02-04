function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
var querystring = '?' + location.search.split('?')[1];
function querystringRemove(removename) {
    var querystring_ar = location.search.split('&');
    var returnstr = "";
    $.each(querystring_ar, function (i, qval) {
        if (qval.split('=')[0] == removename) {
        } else {
            returnstr += qval+'&'
        }
    })
    returnstr = returnstr.substr(0, returnstr.length - 1);
    console.log(returnstr);
    querystring = returnstr;
}

function MenuSwitch(url) {
    console.log(url);
    window.location = url;
}



//============

function dynamicLoadCss(url) {
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = url;
    head.appendChild(mycss);
}
function dynamicLoadJS(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var myscript = document.createElement("script");
    myscript.type = "text/javascript";
    myscript.src = url;
    head.appendChild(myscript);
    myscript.onload = callback;
}

//=======輸入樣版設計==========================
function getBootstrapTemplateHTML(inputs, bindKey) {
    var myInput = "";
    for (p in inputs) {
        var ml = getBootstrapTemplate(inputs[p], bindKey);
        myInput = myInput + ml + "\r\n";
    }
    return "<div class='form-group row w-100'>" + myInput + "</div>";
}

function getHtmlBindingDirective($compile) {
    return {
        replace: true,
        template: '',
        link: function (myScope, element, attrs) {
            myScope.$watch(function () {
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
function getDirective($compile, key) {
    return {
        replace: true,
        template: '',
        link: function (myScope, element) {
            var el = angular.element(getBootstrapTemplateForAnglur(myScope.input, key));
            el.attr("class", "input-group col-md-6 col-12 row no-gutters mt-1");
            $compile(el)(myScope);
            element.replaceWith(el);
        }
    }

}
function getBootstrapTemplateForAnglur(input, bindKey) {

    // el.append('<label >{{input.text}}</label>');
    var tag = ' <div   class="input-group-prepend col-4"><span  class="input-group-text w-100 justify-content-center">' + input.text + '</span></div>\r\n';
    tag = tag + appendControl(input, bindKey) + "\r\n";
    return tag + "</div>";


}
function getBootstrapTemplate(input, bindKey) {

    // el.append('<label >{{input.text}}</label>');
    var tag = '<div  class="input-group col-md-6 col-12 row no-gutters mt-1">\r\n<div   class="input-group-prepend col-4"><span  class="input-group-text w-100 justify-content-center">' + input.text + '</span></div>\r\n';
    tag = tag + appendControl(input, bindKey) + "\r\n";
    return tag + "</div> ";


}
function getBootstrapTemplate1(input, bindKey) {

    var tag = '<label >' + input.text + '</label>';
    tag += '<div  class="form-group"> ';
    tag += + appendControl(input, bindKey);
    return "<div>" + tag + "</div>";


}
function getTableTemplateHTML(inputs, bindKey) {
    var myInput = "<table>\r\n";
    for (p in inputs) {
        var el = "<tr>" + getTableTemplate(inputs[p], bindKey) + "<tr>";
        myInput = myInput + el + "\r\n";
    }
    return myInput + "</table>";
}
function getTableTemplate(input, bindKey) {
    var tag = '<th width="120px">' + input.text + '</th>\r\n<td>';
    tag = tag + appendControl(input, bindKey);
    return tag + "</td>\r\n";

}
//輸入樣版元件
function appendControl(input, bindKey) {
    //ToDO 目前只支援下拉選單，未來可以在增加
    var ngRequired = ((!input.isNullable) && bindKey == 'editdata').toString().toLowerCase(); //編輯才需要判斷

    switch (input.ControlType) {
        case 'DropDownList':
            var tag = "<select  style='width:120px' name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' ng-options='label for (label, value) in  " + input.datafield + "_Option' class='form-control col-8'" +
                " ng-required='" + ngRequired + "' "
            if (input.ChildField != undefined && input.ChildField != "") {
                tag += "ng-change='on_SelectChange(" + '"' + bindKey + '","' + input.datafield + '","' + input.ChildField + '",' + bindKey + "." + input.datafield + ")'";
            }
            tag += ">\r\n<option value=''>-- 請選擇 --</option>\r\n</select>";
            return tag;
            break;
        case 'AutoComplete':
            var tag = "<input onclick='this.value=" + '""' + "'  placeholder='請輸入或選擇'  style='width:150px' list='" + input.datafield +
                "' name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8'" +
                " ng-required='" + ngRequired + "' />\r\n"

            tag += "<datalist id='" + input.datafield + "'>\r\n<option ' ng-repeat='item in " + input.datafield + "_List'  value='{{ item }}'></option>\r\n</datalist>";
            return tag;
            break;
        case "Password":
            return "<input   name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='password' ng-required='" + ngRequired + "' />";
            break;
        case "CheckBox":
            return "<label class='wrap'><input name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' class='form-check-input' type='checkbox' ng-required='" + ngRequired + "' /><span class='checkmark'></span></label>";
            break;
        case "CheckBoxList"://已測試過ok(格式為 , 分隔)
            var tag = "<label ng-repeat='label in  " + input.datafield + "_List' >" +
                '<input type="checkbox" ng-click="onCheckList_Click(' + bindKey + ",'" + input.datafield + "'" + ',label)" ' +
                'ng-checked="getCheckListValue(' + bindKey + "." + input.datafield + ',label)" />{{::label}}<br /></label> ';
            return tag;

            break;
        case "RadioButtonList":
            var tag = "<label ng-repeat='(label, value) in  " + input.datafield + "_Option' >" +
                '<input type="radio" name="' + bindKey + "_" + input.datafield + '" ng-model="' + bindKey + "." + input.datafield + '" value="{{value}}">{{label}}</label > ';
            return tag;

            break;
        case "Date":
            return "<input   name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='Date' ng-required='" + ngRequired + "' />";
            break;
        case "DateTime":
            return "<div  class='form-control col-8'><input   name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "'  type='date' ng-required='" + ngRequired + "' />" +
                "<input   name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' type='time' ng-required='" + ngRequired + "' /></div>";
            break;
        case "Time":
            return "<input   name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='time' ng-required='" + ngRequired + "' />";
            break;

        case "File":
            return "<div  class='form-control col-8'>" +
                "<a target='_blank' href='DownloadFile.ashx?SubPath=" + m_TableName + "&ID={{" + bindKey + "." + m_PrimKey + "}}&FileName={{" + bindKey + "." + input.datafield + "}}'><span     name='" + bindKey + "_" + input.datafield + "' ng-bind='" + bindKey + "." + input.datafield +
                "'   /></a><input type='button' style='position: absolute; right: 0;' value='選擇檔案'  onclick='openfile(" + '"' + bindKey + "_" + input.datafield + '"' + ")';></input>" +
                "<input  style='display:none'  name='" + bindKey + "_" + input.datafield + "' id='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' class='form-control file-upload' type='file' onchange='return CheckFile(this);' ng-required='" + ngRequired + "' /></div>";
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
                        "<input  class='form-control' type='" + dtype + "'  name='" + bindKey + "_" + input.datafield + "__from' ng-model='" + bindKey + "." + input.datafield +
                        "__from'    ng-required='" + ngRequired + "' />~" +
                        "<input  class='form-control' type='" + dtype + "'    name='" + bindKey + "_" + input.datafield + "__to' ng-model='" + bindKey + "." + input.datafield +
                        "__to' ng-required='" + ngRequired + "' />\r\n</div>";

                } else if (input.ControlType == "RangeDate") {

                    return "<div class='input-group col-8'>\r\n" +
                        "<input style='font-size:8px;'  class='form-control' type='" + dtype + "'  name='" + bindKey + "_" + input.datafield + "__from' ng-model='" + bindKey + "." + input.datafield +
                        "__from'    ng-required='" + ngRequired + "' />~" +
                        "<input  style='font-size:8px;' class='form-control' type='" + dtype + "'    name='" + bindKey + "_" + input.datafield + "__to' ng-model='" + bindKey + "." + input.datafield +
                        "__to' ng-required='" + ngRequired + "' />\r\n</div>";

                }

                break;

            }
            return "<input  type='" + dtype + "'   name='" + bindKey + "_" + input.datafield + "' ng-model='" + bindKey + "." + input.datafield +
                "' class='form-control col-8' type='text' ng-required='" + ngRequired + "' />";
            //{{" + bindKey + "." + input.datafield + " }}
            break;
    }
}
function openfile(f) {

    $("#" + f).trigger("click");
}
function decodeImage(key, imgDomID) {

    var len = parseInt(key.substring(0, 2));
    var Vkey = key.substring(2, len + 2);
    $("#" + imgDomID).attr('src', 'data:image/jpeg;base64,' + key.substring(len + 2));
    return Vkey;
}
//getSelectValue過度時期，之後拿悼
function getSelectValue(CKey, TableName, txtField, valField, filter) {
    alert("getSelectValue 已改成setSelectValue");
}

function setSelectValue(CKey, TableName, txtField, valField, filter, callback) {

    db.GetDistinctValues(TableName, filter, txtField + "," + valField,
        function (data) {
            var p = [];
            if (data.isSuccess) {
                if (data.Result.length > 0) {

                    for (var i in data.Result) {
                        var value = parseInt(data.Result[i][valField]);
                        if (isNaN(value)) {
                            p[data.Result[i][txtField]] = data.Result[i][valField];
                        } else {
                            p[data.Result[i][txtField]] = value;
                        }
                    }

                }
            }
            scope[CKey] = p;
            if (callback != null) {
                callback(data);
            }
            scope.$apply();
        });
}
function setAutoComplteValue(CKey, TableName, valField, filter, callback) {
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
            scope[CKey] = p;
            if (callback != null) {
                callback(data);
            }
            scope.$apply();
        });
}
function RasieInputData(scp, c) {


    //===========產生下拉選單資料=============
    if (c.ControlType == "DropDownList" || c.ControlType == "AutoComplete" || c.ControlType == "CheckBoxList" || c.ControlType == "RadioButtonList") {
        scp[c.datafield + "_Option"] = new Object;
        scp[c.datafield + "_List"] = [];
        if (c.BindTable === '') {
            db.SelectTable('ValueMapping',
                "TableName='" + m_TableName + "' and FieldName='" + c.datafield + "'",
                function (data) {
                    if (data.isSuccess) {
                        if (data.Result.length > 0) {
                            var p = scp[data.Result[0].FieldName + "_Option"];
                            var pList = scp[data.Result[0].FieldName + "_List"];
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
                        alert("RasieInputData錯誤(ValueMapping):" + data.ErrorMsg);
                    }
                });
        } else if (c.BindTable !== '') {
            if (c.ControlType == "AutoComplete" || c.ControlType == "CheckBoxList") {
                setAutoComplteValue(c.datafield + "_List", c.BindTable, c.BindValueField, "1=1");

            } else {
                setSelectValue(c.datafield + "_Option", c.BindTable, c.BindDataField, c.BindValueField, "1=1");
            }

        }

    }
    scp.getFilter = function (Columns, bindKey, ParentField) {

        var c;
        for (var i in Columns) {
            c = Columns[i];
            if (c.datafield.toLowerCase() == ParentField.toLowerCase()) {
                var value = $("select[name='" + bindKey + "_" + ParentField + "'] :selected").text();
                if (c.ParentField != null && c.ParentField != "") {
                    return ParentField + "='" + value + "' and " + this.getFilter(Columns, bindKey, c.ParentField);
                } else {
                    return ParentField + "='" + value + "'";
                }

                break;
            }
        }
    }
    //========增加連動下拉============
    scp.on_SelectChange = function (bindKey, ParentField, ChildField, value) {
        var c;
        for (var i in m_Columns) {
            c = m_Columns[i];
            if (c.datafield == ChildField) {
                break;
            }
        }
        var filter = this.getFilter(m_Columns, bindKey, ParentField);
        //debugger;
        $("select[name='" + bindKey + "_" + ParentField + "']").attr('disabled', true);
        var sel = $("select[name='" + bindKey + "_" + ChildField + "']");
        sel.attr('disabled', true);
        sel.text("");
        sel.append("<option>讀取中...</option>");

        if (c.ControlType == "AutoComplete") {
            setAutoComplteValue(c.datafield + "_List",
                c.BindTable, c.BindValueField, filter,
                function (d) {
                    $("select[name='" + bindKey + "_" + ParentField + "']").attr('disabled', false);
                    $("select[name='" + bindKey + "_" + ChildField + "']").attr('disabled', false);
                });

        } else {
            setSelectValue(c.datafield + "_Option", c.BindTable, c.BindDataField, c.BindValueField, filter,
                function (d) {
                    $("select[name='" + bindKey + "_" + ParentField + "']").attr('disabled', false);
                    $("select[name='" + bindKey + "_" + ChildField + "']").attr('disabled', false);
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






}




function AjaxQuery(url, QueryData, retFunc) {
    $.ajax({
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
        db.UploadFiles(allFile, m_TableName, pid, function (ret) {
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
            debugger;
            var attr = f.name.replace("editdata_", "");
            scope.editdata[attr] = file.name;
            scope.$apply();
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

    var tab_text = createTableHtml(datalist,Columns);


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
        element.setAttribute('download', m_TableName + ".xls");
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
