
//#region FormData

/* 
    取得FormData
    formID: 包住整個要取model的所有物件之區塊 div id..
    getType: 目前分三種
    Model(單一物件)
    List(字串陣列)
    ListModel(物件list..使用listName)
    listName: 若getType=ListModel時..用以指示list屬性名稱...未指定則表示整個model為list
*/
function GetFormData(formID, getType, listName) {
    var TagName = "";
    var InputType = "";
    var Name = "";
    var Model = (getType == "List" ? [] : {});
    var ListModel = [];
    var TempModel = {};
    var ListIndex = 0;
    var IsList = false;

    var handleTag = function (obj) {
        TagName = obj.tagName.toLowerCase();
        var $obj = $(obj);
        Name = $obj.attr("name");
        var NameArray = Name.split(".");
        IsList = NameArray.length > 1;
        if (IsList) {
            Name = NameArray[0];
            ListIndex = NameArray[1];
        }
        switch (TagName) {
            default: InputType = ""; break;
            case "input": InputType = $obj.attr('type').toLowerCase(); break;
            case "div":
                if ($obj.hasClass('jqx-datetimeinput')) InputType = "date";
                break;
        }
    }

    var setValue = function (tempValue) {
        if (tempValue == null || $.trim(tempValue) == "") return;
        switch (getType) {
            case "Model":
                Model[Name] = tempValue;
                break;
            case "List":
                Model.push(tempValue);
                break;
            case "ListModel":
                if (IsList) {
                    if (!TempModel.hasOwnProperty(ListIndex)) {
                        TempModel[ListIndex] = {};
                    }
                    TempModel[ListIndex][Name] = tempValue;
                }
                else
                    Model[Name] = tempValue;
        }
    }

    var bindModel = function (obj) {
        var tempValue = "";
        if (TagName == "input") {
            switch (InputType) {
                case "date":
                case "number":
                case "text":
                case "hidden":
                case "password":
                    tempValue = $(obj).val();
                    break;
                case "checkbox":
                    tempValue = ($(obj).attr("checked") == "checked");
                    break;
                case "radio":
                    var _R = false;

                    if ($(obj).prop("checked") != undefined) {
                        _R = $(obj).prop("checked")
                    } else {
                        _R = $(obj).attr("checked") == "checked"
                    }

                    if (_R) {
                        tempValue = $(obj).val();
                    }
                    break;
            }
            
        } else if (TagName == "select") {
            tempValue = $(obj).val();
        } else if (TagName == "textarea") {
            tempValue = $(obj).val();
        } else if (TagName == "span") {
            tempValue = $(obj).text();
        } else if (TagName == "div" && InputType == "date") {
            tempValue = $(obj).val();
        }
        setValue(tempValue);
    }

    $("#" + formID).find("[name]").each(function (i, obj) {
        handleTag(obj);
        bindModel(obj);
    });

    if (getType == "ListModel") {
        for (var i in TempModel) {
            ListModel.push(TempModel[i]);
        }

        if (listName != null && listName != "") {
            Model[listName] = ListModel;
        }
        else Model = ListModel;
    }

    return Model;
}

/* 
    將FormData依name放入指定的html tag中
    參數 formID,getType,listName說明同GetFormData
    getType暫不支援List
    Model: 為傳入的FormData
    filter: 需濾掉的屬性array
*/
function SetFormData(formID, Model, getType, listName, filter) {
    var TagName = "";
    var InputType = "";
    var Name = "";
    var ListModel = [];
    var TempModel = {};
    var ListIndex = 0;
    var IsList = false;

    var handleTag = function (obj) {
        TagName = obj.tagName.toLowerCase();
        var $obj = $(obj);
        Name = $obj.attr("name");
        var NameArray = Name.split(".");
        IsList = NameArray.length > 1;
        if (IsList) {
            Name = NameArray[0];
            ListIndex = NameArray[1];
        }
        switch (TagName) {
            default: InputType = ""; break;
            case "input": InputType = $obj.attr('type').toLowerCase(); break;
            case "div":
                if ($obj.hasClass('jqx-datetimeinput'))
                    InputType = "date";

                break;
        }
    }

    var getValue = function () {
        var tempValue = "";
        switch (getType) {
            case "Model":
                tempValue = Model[Name];
                break;
            case "ListModel":
                if (IsList) {
                    if (listName != null && listName != "") {
                        tempValue = Model[listName][ListIndex][Name];
                    }
                    tempValue = Model[ListIndex][Name];
                }
                else
                    tempValue = Model[Name];
        }

        return tempValue;
    }

    var bindModel = function (obj) {
        var tempValue = "";
        tempValue = getValue();
        if (TagName == "input") {
            switch (InputType) {
                case "number":
                case "text":
                case "hidden":
                case "password":
                case "date":
                    $(obj).val(tempValue);
                    break;
                case "checkbox":
                    if (tempValue)
                        $(obj).attr("checked", "checked");
                    else
                        $(obj).removeAttr("checked");
                    break;
                case "radio":
                    if (tempValue == null) break;
                    if (tempValue == $(obj).val()) {
                        $(obj).attr("checked", "checked");
                    }
                    else
                        $(obj).removeAttr("checked");
                    break;
            }
        } else if (TagName == "select") {
            $(obj).val(tempValue);
        } else if (TagName == "textarea") {
            $(obj).text(tempValue);
        } else if (TagName == "span") {
            $(obj).text(tempValue);
        } else if (TagName == "div" && InputType == "date") {
            $(obj).val(tempValue);
        }
    }

    $("#" + formID).find("[name]").each(function (i, obj) {
        if (filter != null) {
            if (filter.indexOf($(this).attr("name")) > -1) return true;
        }
        handleTag(obj);
        bindModel(obj);
    });
}

//#endregion

//#region Ajax

/*
    統一管理ajax呼叫
*/
function AjaxCommon(dataType, url, data, successFn, msg, async, contentType, noReplace) {
    if (msg == null || msg == "") {
        msg = "ajax error";
    }
    var ajaxObj = {
        type: 'POST', dataType: dataType, url: url,
        data: data,
        beforeSend: function (xhr, settings) {
            if (noReplace) { }
            else
                settings.data = settings.data.replace(/%5B/g, ".").replace(/%5D=/g, "=");
        },
        success: function (d) {
            if (successFn)
                successFn.call(this, d);
        }, error: function (e, r, h) {
            if (e.status != 520)
                alert(msg + ' (status:' + r + ' error:' + h + ')');
        }
    };
    if (async != null && async == false) {
        ajaxObj["async"] = false;
    }
    if (contentType != null && contentType != "") {
        ajaxObj["contentType"] = contentType;
    }

    return $.ajax(ajaxObj);
}
function AjaxJsonP(url, data, successFn, msg, async, contentType, noReplace) {
    return AjaxCommon('jsonp', url, data, successFn, msg, async, contentType, noReplace);
}
function AjaxJson(url, data, successFn, msg, async, contentType, noReplace) {
    return AjaxCommon('json', url, data, successFn, msg, async, contentType, noReplace);
}
function AjaxText(url, data, successFn, msg, async, contentType, noReplace) {
    return AjaxCommon('text', url, data, successFn, msg, async, contentType, noReplace);
}
function AjaxGisGet(url, data, msg) {
    var ret = {};
    $.ajax({
        type: 'POST', dataType: 'JSON', url: url + '/query', cache: false, async: false,
        data: data,
        success: function (data) {
            var d = [];
            if (data != null && data.features != null) {
                for (var i = 0; i < data.features.length; i++) {
                    d.push(data.features[i].attributes);
                }
            }
            ret = d;
        },
        error: function (e, r, h) {
            alert(msg + ' (status:' + r + ' error:' + h + ')');
        }
    })
    return ret;
}
function AjaxGisQuery(url, data, successFn, msg) {
    $.ajax({
        type: "POST", cache: false, async: false, dataType: "jsonp",
        url: url + "/query",                                                                        /*, orderByFields: 'Name ASC'*/
        data: data,
        success: function (data) {
            var d = [];
            if (data != null && data.features != null) {
                for (var i = 0; i < data.features.length; i++) {
                    d.push(data.features[i].attributes);
                }
            }

            if (successFn)
                successFn.call(this, d);
        },
        error: function (e, r, h) {
            alert(msg + ' (status:' + r + ' error:' + h + ')');
        }
    });
}
function AjaxGisQueryGeo(url, data, successFn, msg) {
    $.ajax({
        type: "POST", cache: false, async: false, dataType: "jsonp",
        url: url + "/query",                                                                        /*, orderByFields: 'Name ASC'*/
        data: data,
        success: function (data) {
            var d = [];
            var geo = {};
            if (data != null && data.features != null) {
                for (var i = 0; i < data.features.length; i++) {
                    var objID = data.features[i].attributes.OBJECTID == 0 ? data.features[i].attributes.OBJECTID_1 : data.features[i].attributes.OBJECTID;
                    geo[objID] = data.features[i].geometry;
                    d.push(data.features[i].attributes);
                }
            }

            if (successFn)
                successFn.call(this, d, geo);
        },
        error: function (e, r, h) {
            alert(msg + ' (status:' + r + ' error:' + h + ')');
        }
    });
}
function AjaxGisGetGeo(url, data, msg) {
    var ret = {};
    $.ajax({
        type: 'POST', dataType: 'JSON', url: url + '/query', cache: false, async: false,
        data: data,
        success: function (data) {
            var d = [];
            if (data != null && data.features != null) {
                for (var i = 0; i < data.features.length; i++) {
                    d.push(data.features[i].geometry);
                }
            }
            ret = d;
        },
        error: function (e, r, h) {
            alert(msg + ' (status:' + r + ' error:' + h + ')');
        }
    })
    return ret;
}
$(document).ajaxStop(function () {
    if ($("#jqxLoader").length > 0) {
        $("#jqxLoader").jqxLoader('close');
    }
})
$(document).ajaxComplete(function (event, xhr, settings) {
    if (xhr.status == 520)
        alert(xhr.responseText);
});
//#endregion

//#region JqWidget
var JqxDateSetting = { animationType: 'fade', width: '120px', height: '20px', formatString: 'yyyy/MM/dd' };
var JqxPopSettings = {
    position: 'top',
    isModal: true,
    showCloseButton: true
};
var localizationobj = {
    pagergotopagestring: "頁數移至:",
    pagershowrowsstring: "頁&emsp;&emsp;分頁筆數:",
    pagerrangestring: "&emsp;總筆數:",
    pagernextbuttonstring: "下一頁",
    pagerpreviousbuttonstring: "上一頁",
    sortascendingstring: "升冪",
    sortdescendingstring: "降冪",
    sortremovestring: "取消排序",
    emptydatastring: "無資料",
    pagerfirstbuttonstring: "第一頁",
    pagerlastbuttonstring: "最後頁"
    //firstDay: 1,
    //percentsymbol: "%",
    //currencysymbol: "€",
    //currencysymbolposition: "before",
    //decimalseparator: ".",
    //thousandsseparator: ","
};

function GetPopSetting(obj) {
    if (obj != null) return $.extend({}, JqxPopSettings, obj);
    else return JqxPopSettings;
}
function GetMainPopSetting(title, offset, width, height, selector, top) {
    top = top || 0;
    var obj = {
        offset: { left: offset, top: top },
        arrowOffsetValue: -99999,
        title: title,
        width: width + 'px',
        height: height + 'px',
        selector: selector
    };
    return GetPopSetting(obj);
}
function GetMapPopSetting(title, offset, width, height, selector, arrowOffset, top) {
    //debugger;
    top = top || 0;
    var obj = {
        offset: { left: offset, top: top },
        arrowOffsetValue: arrowOffset,
        title: title,
        width: width + 'px',
        height: height + 'px',
        selector: selector,
        isModal: false,
        autoClose: false,
        position: 'bottom',
        showCloseButton: false
    };
    return GetPopSetting(obj);
}
function GetJqxDateSetting(setting) {
    return $.extend({}, JqxDateSetting, setting);
}
function JqxLoading(start) {
    start = (start == null ? true : start);
    if ($("#jqxLoader").length > 0) {
        if (start)
            $("#jqxLoader").jqxLoader('open');
        else 
            $("#jqxLoader").jqxLoader('close');
    }
}
//TreeGrid
function findRootSelect(parent) {
    if (parent == null) return;
    if (!newSelect.hasOwnProperty(parent.FunID)) {
        newSelect[parent.FunID] = "Y";
    }
    findRootSelect(parent.parent);
}
function getTreeGridCheckedID(treeGridID) {
    newSelect = {};
    var checkedRows = $("#" + treeGridID).jqxTreeGrid('getCheckedRows');
    for (var i = 0; i < checkedRows.length; i++) {
        var rowData = checkedRows[i];
        newSelect[rowData.FunID] = "Y";
        findRootSelect(rowData.parent);
    }

    var selList = [];
    for (var i in newSelect) {
        selList.push(i);
    }
    return selList;
}

//#endregion

//#region 驗証物件
function RgExp() {
    this.positiveIntegerHaveZero = /^\\d+$/ //非負整數（正整數   +   0）     
    this.positiveInteger = /^[0-9]*[1-9][0-9]*$/ //正整數      
    this.negativeInteger = /^-[0-9]*[1-9][0-9]*$/ //負整數     
    this.integer = /^-?\d+$/ //整數
}
function ValidRule(input, msg, ruleEvent, type, length) {
    this.type = type;
    this.input = input;
    this.msg = msg;
    this.ruleEvent = ruleEvent;
    this.ruleExp = new RgExp();
    this.isEmpty = function (val) {
        return (val == null || $.trim(val) == "");
    }
    this.validate = function () {
        var ret = true;
        var $obj = $(this.input);
        if (ruleEvent) {
            ret = ruleEvent.call(this, $obj);
            if (ret == null) {
                alert('程式錯誤!自訂驗檢方法無回傳值');
                return false;
            }
        }
        else {
            switch (type) {
                default:
                case "val":
                    ret = ($.trim($obj.val()) != "");
                    break;
                case "ip":
                    ret = ($.trim($obj.val()) != "") && parseInt($obj.val()) >= 0 && parseInt($obj.val()) <= 255;
                    break;
                case "ip2":
                    ret = $.trim($obj.val()) == "*" || ($.trim($obj.val()) != "") && parseInt($obj.val()) >= 0 && parseInt($obj.val()) <= 255;
                    break;
            }
        }
        if (!ret) {
            alert(msg);
            if ($obj.focus)
                $obj.focus();
        }
        return ret;
    }
}
function Validator() {
    this.rules = [];
    this.validate = function () {
        var ret = true;
        if (this.rules.length > 0) {
            for (var i = 0; i < this.rules.length; i++) {
                if (!this.rules[i].validate()) {
                    ret = false;
                    break;
                }
            }
        }
        return ret;
    }
}
function IsNumber(val) {
    return (val != "" && !isNaN(val));
}
function IsEmpty(val) {
    return (val == null || val == "");
}
function tryParseFloat(val) {
    if (IsNumber(val))
        return parseFloat(val);
    else
        return 0;
}
var NoActionCodes = [37, 38, 39, 40];
function comTxtInt_onkeyup(input, e, fn) { 
    if (NoActionCodes.indexOf(e.keyCode) > -1) return false;
    input.value = input.value.replace(/[^\d]/g, "");
    fn();
}
function comTxtIP_onkeyup(input, e, fn) {
    if (NoActionCodes.indexOf(e.keyCode) > -1) return false;
    input.value = input.value.replace(/[^\d\*]/g, "");
    fn();
}
function comTxtNum_onkeyup(input, e, fn) {
    if (NoActionCodes.indexOf(e.keyCode) > -1) return false;
    input.value = input.value.replace(/[^\d\.]/g, "");
    fn();
}
//#endregion

//#region 產生控制項
function buildSelectText(jData, id, type) {
    var sel;
    if (type == "0") sel = "";
    else sel = "<option value=''>請選擇</option>";
    for (var i = 0; i < jData.length; i++) {
        sel += "<option value='" + jData[i].CodeValue + "'>" + jData[i].CodeText + "</option>";
    }
    $("#" + id + "").html(sel);
}
function buildSelectText2(jData, id, type, map) {
    var sel;
    var value = "CodeValue", text = "CodeText", price = "";
    if (type == "0") sel = "";
    else sel = "<option value=''>請選擇</option>";
    if (map != null) {
        value = map["value"];
        text = map["text"];
        price = map["price"];
    }

    for (var i = 0; i < jData.length; i++) {
        if (price != "")
            sel += "<option price='" + jData[i][price] + "' value='" + jData[i][value] + "'>" + jData[i][text] + "</option>";
        else
            sel += "<option value='" + jData[i][value] + "'>" + jData[i][text] + "</option>";
    }
    $("#" + id + "").html(sel);
}
function buildSelectTextNoValue(jData, id, type) {
    var sel;
    if (type == "0") sel = "";
    else sel = "<option value=''>請選擇</option>";
    for (var i = 0; i < jData.length; i++) {
        sel += "<option>" + jData[i].CodeText + "</option>";
    }
    $("#" + id + "").html(sel);
}
function buildSelectTextNoValue2(jData, id, type, map) {
    var sel;
    var text = "CodeText", price = "";
    if (type == "0") sel = "";
    else sel = "<option value=''>請選擇</option>";
    if (map != null) {
        text = map["text"];
        price = map["price"];
    }

    for (var i = 0; i < jData.length; i++) {
        if (price != "")
            sel += "<option price='" + jData[i][price] + "' >" + jData[i][text] + "</option>";
        else
            sel += "<option>" + jData[i].CodeText + "</option>";
    }
    $("#" + id + "").html(sel);
}

function buildSelectTextByArray(arr, id, type) {
    var sel = "";
    if (type == "0") sel = "";
    else sel = "<option value=''>請選擇</option>";
    for (var i = 0; i < arr.length; i++) {
        sel += "<option>" + arr[i] + "</option>";
    }
    $("#" + id + "").html(sel);
}
//#endregion


//json陣列排序
function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}