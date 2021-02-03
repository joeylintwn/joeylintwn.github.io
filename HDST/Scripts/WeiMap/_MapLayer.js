//#region 變數宣告
//serviceURL來自MainMap
var layerSource = [];
var kmllayer = null;
var postUrl = serviceURL + "/5001";
var postContractUrl = serviceURL + "/5002"; //add sam
var postCheckAUrl = serviceURL + "/6012"; //add sam
var cadUrl = serviceURL + "/2003";
var cadType = "";
var engType = "";
var treeSource;
var engSource;
var cadSource;
var engYearSource;
var canExport = { Cadastral: true, WaterDoor: true, Pumping: true, Embanlment: true, Drainage: true };
var canDrag = false;
var landNo = {};
var engYear = '';
var layerFilterType = 0;
var layerFilterCity;
var currEngDef = '';
var currCadDef = '';
var currContractEngDef = '';  //add sam
var currCheckADef = '';//add sam
var ws6027XDef = '';
var ws6028XDef = '';
var ws60121XDef = '';
var ws60122XDef = '';
var ws60123XDef = '';
var currCadLocShp = {};
var currEngLocShp = {};
var ZooinLayerCode = "";
var LayerYear_60121 = [];
var LayerYear_60122 = [];
var LayerYear_60123 = [];
//#endregion

//#region 事件處理

function closeMaplayer_onclick() { //關閉控制面版
    $("#div_layerTab").fadeOut('fast');
    if (canDrag) {
        $("#div_drag").css({ width: '90px', height: '20px' });
    }
    $("#div_mapLayer").animate({ width: '90px', height: '20px' }, 'fast', function () {
        $("#div_layerBar").show();
        isPanelOpen = false;
        window_onresize();
    });

}
function openMaplayer_onclick() { //開啟控制面版
    $("#div_layerBar").fadeOut('fast');
    if (canDrag) {
        $("#div_drag").css({ width: '310px', height: '520px' });
    }
    $("#div_mapLayer").animate({ width: '310px', height: '550px' }, 'fast', function () {
        $("#div_layerTab").show();
        isPanelOpen = true;
        window_onresize();
    });

}

//#region 圖層清單
function getSubLayerID(pid) {
    var ppid = tryParseFloat(pid);
    var subLayers = layerSource.filter(function (obj) {
        return obj.LayerPID == ppid;
    })
    var ret = [];
    if (subLayers != null) {
        for (var i = 0; i < subLayers.length; i++) {
            ret.push(subLayers[i].LayerID);
        }
    }
    return ret;
}
//設定這邊才有屬性
function layerResponse(id, show) {
    var flag = id.toString();
    var isShowBoxLayer = false;
    switch (flag) {
        case "2003":
            canExport["Cadastral"] = show;
            if (show) cadastreLayer.show();
            else cadastreLayer.hide();
            isShowBoxLayer = true;
            break;
        case "3001":
            canExport["WaterDoor"] = show;
            if (show) waterGateLayer.show();
            else waterGateLayer.hide();
            isShowBoxLayer = true;
            break;
        case "3002":
            if (show) pumpingLayer.show();
            else pumpingLayer.hide();
            isShowBoxLayer = true;
            break;
        case "3003":
            canExport["Embanlment"] = show;
            if (show) regionLayer.show();
            else regionLayer.hide();
            isShowBoxLayer = true;
            break;
        case "3004":
            canExport["Drainage"] = show;
            if (show) dikeLayer.show();
            else dikeLayer.hide();
            isShowBoxLayer = true;
            break;
        case "5001":
            if (show) engLayer.show();
            else engLayer.hide();
            isShowBoxLayer = true;
            break;
        case "5002":  //add sam
            if (show) contractLayer.show();
            else contractLayer.hide();
            isShowBoxLayer = true;
            break;
        case "3009":
        case "3010":
        case "3012":
        case "3013":
        case "3014":

        case "4004":

        case "5002":
        case "5003":
        case "5004":

        case "6001":
        case "6002":
        case "6003":
        case "6004":
        case "6005":
        case "6006":
        case "6007":
        case "6008":
        case "6009":
        case "6010":
        case "6011":

        case "60121":
        case "60122":
        case "60123":

        case "6013":
        case "6014":
        case "6015":
        case "6016":
        case "6017":
        case "6018":
        case "6020":
        case "6023":
        case "6025":
        case "6027":
        case "6028":

        case "60291":
        case "60292":
        case "60293":

        case "60301":
        case "60302":
        case "60303":

        case "7001":
        case "7002":
        case "7003":
        case "7004":
        case "7005":
        case "9003":

        case "10001":
        case "11001":
        case "11004":

        case "12001":
        case "12002":
        case "12004":
        case "12005":
        case "12006":
        case "12007":

        case "130011":
        case "130012":
        case "13009":
        case "13010":

        case "14001":
        case "14002":

        case "15008":
        case "15009":
        // case "15011":

        case "16101":
        case "16102":
        case "16103":
        case "16201":
        case "16202":
        case "16203":
            if (show) eval("ws" + flag + "Layer.show()")
            else eval("ws" + flag + "Layer.hide()")
            isShowBoxLayer = true;
            break;

        case "11006":
        case "11008":
        case "13037":
        case "13038":
            isShowBoxLayer = true;
            break;
    }
    return isShowBoxLayer;
}
function cbLayer_onchange(e) { //圖層開關 checkbox 事件
    var value = e.value;
    var first = "";
    var subLayers = null;

    var customerLayer = [
        "601211", "601212", "601213", "601214",
        "601221", "601222", "601223", "601224",
        "601231", "601232", "601233", "601234",
        "60271", "60272", "60273", "60274",
        "60281", "60282", "60283", "60284"
    ]

    var isChecked = $(e).is(":checked");

    if (value == "8006") {
        if (isChecked == true) {
            testLayer.show();
        } else {
            testLayer.hide();
        }
    } else if (value.length <= 2) {
        subLayers = getSubLayerID(value);
        if (mapReady && subLayers != null) {
            for (var i = 0; i < subLayers.length; i++) {
                if (value == "8") {
                    if (isChecked == true) {
                        imagelayer.showSubLayer(tryParseFloat(subLayers[i]) - 8000);
                    } else {
                        imagelayer.hideSubLayer(tryParseFloat(subLayers[i]) - 8000);
                    }
                }
                else {
                    layerResponse(subLayers[i], isChecked);
                    if (isChecked == true) {
                        facilitiesLayer.showSubLayer(tryParseFloat(subLayers[i]));
                    }
                    else {
                        facilitiesLayer.hideSubLayer(tryParseFloat(subLayers[i]));
                    }
                }
            }
        }
        if (value != 2)
            $("input[type=checkbox][value^=" + value + "0]").prop("checked", isChecked);
        else {
            $("input[type=checkbox][value^=" + value + "003]").prop("checked", isChecked);
            $("input[type=checkbox][value^=" + value + "004]").prop("checked", isChecked);
        }
        if (value == 4) {
            $("input[type=checkbox][value^=20]").prop("checked", isChecked);

            var f03 = $("input[type=checkbox][value=2003]").is(":checked");
            var f04 = $("input[type=checkbox][value=2004]").is(":checked");

            $("input[type=checkbox][value^=2003]").prop("checked", isChecked || f03);
            $("input[type=checkbox][value^=2004]").prop("checked", isChecked || f04);
        }
    } else if (customerLayer.indexOf(value) >= 0) {

        //取得上一層ID
        first = value.substring(0, value.length - 1);
        //取得同一層IDs
        var SubLayer = layerSource.filter(function (obj) {
            return obj.LayerPID == first;
        });

        var FacStatusIDs = [];

        //歷遍同層圖層 看有哪些圖層開啟
        for (var i in SubLayer) {
            var target_checkbox = $('input[type="checkbox"][value="' + SubLayer[i].LayerID + '"]');
            if (target_checkbox.prop('checked') == true) {
                //取數字最後一個字
                FacStatusIDs.push("FacStatus=" + SubLayer[i].LayerID.toString().substring(SubLayer[i].LayerID.toString().length - 1));
            }
        }
        
        var MyDef = "";
        //先檢查有沒有過濾年分
        eval("MyDef = ws" + first + "XDef");
        debugger
        var MyLayerYear = eval("LayerYear_" + first);
        debugger
        if (FacStatusIDs.length > 0) {
            $('input[type="checkbox"][value="' + first + '"]').prop('checked', true);//強制上一層打勾

            if (MyLayerYear.length > 0) {
                var newDef = [];
                for (var i = 0; i < MyLayerYear.length; i++) {
                    newDef.push("(T06 LIKE'" + MyLayerYear[i] + "%' AND (" + FacStatusIDs.join(' OR ') + "))");
                }
                MyDef = newDef.join(' OR ');
            }
            else {
                //無篩選年分
                MyDef = FacStatusIDs.join(' OR ');
            }
            facilitiesLayer.showSubLayer(tryParseFloat(first));
        } else {
            $('input[type="checkbox"][value="' + first + '"]').prop('checked', false);//強制上一層取消打勾
            //無篩選年分
            MyDef = "1<>1";
            facilitiesLayer.hideSubLayer(tryParseFloat(first));
        }

        //避免關掉單一子圖層時關掉全部的屬性事件
        if (FacStatusIDs.length == 0) {
            layerResponse(first, false);
        } else {
            layerResponse(first, true);
        }
        //設定過濾wsXXXXXLayer.setDefinition(def);
        
        facilitiesLayer.setDefinitions(parseInt(first), MyDef);//全圖層
        eval("ws" + first + "Layer.setDefinition(MyDef)");//單一圖層
    } else {
        //一般圖層 取消勾選
        if (mapReady) {
            var id = tryParseFloat(value);
            if (id > 8000 && id < 8006) {
                imagelayer.showSubLayer(id - 8000);
            }
            else {
                if (isChecked) {
                    var isZooin = layerResponse(value, true);

                    if (isZooin == true) {
                        ZooinLayerCode = value;
                        fitGeoByDef("6");
                    }
                    facilitiesLayer.showSubLayer(id);
                    //斷面樁、防洪缺口 會自動跑掉所以要設定回原畫面
                    if (value == "6002" || value == "6006") {
                        mapFullExtent_onclick() //回到預設全景
                    }
                } else {
                    layerResponse(value, false);
                    facilitiesLayer.hideSubLayer(id);
                }
            }
        }

        ////取得當前圖層物件
        //var fLayer = layerSource.filter(function (obj) {
        //    return obj.LayerID == value;
        //})
        ////first = value.substring(0, 1);
        //first = fLayer[0].LayerPID;
        //$("input[type=checkbox][value=" + first + "]").attr("checked", "checked");

        //取得下一層圖層
        var SubLayer = layerSource.filter(function (obj) {
            return obj.LayerPID == value;
        });

        for (var i in SubLayer) {
            var target_checkbox = $('input[type="checkbox"][value="' + SubLayer[i].LayerID + '"]');
            if (target_checkbox.prop('checked') != isChecked) {
                target_checkbox.click();
            }
        }
    }

    //關閉照片編輯
    $('#FileUploadDielog').jqxWindow('close');
    getWaterCensusLayer(); //重新讀取水利普查已開啟的圖層

}

//圖層透明度調整
function divSlider_onslide(value) {

    if (mapReady)
        facilitiesLayer.setOpacity(value);
}

function btnLayerQuery_onclick() {
    var keyword = $("#txt_layerQuery").val();
    var items = $('#div_treeLayer').jqxTree('getItems');
    var query = layerSource.filter(function (obj) {
        return (obj.LayerName.indexOf(keyword) > -1);
    });

    var ids = [];
    var pids = [];
    for (var i = 0; i < query.length; i++) {
        if (query[i].LayerID.toString().length == 1) //父層有被抓到..另外紀錄

            pids.push(query[i].LayerID.toString());

        ids.push(query[i].LayerID.toString());
        if (query[i].LayerPID > 0 && query[i].LayerPID.toString().indexOf(ids) == -1) { //父層未有..加入父層
            ids.push(query[i].LayerPID.toString());
        }
    }
    var tempPid = "0";
    for (var i in items) {
        if (items[i].value != 0) {
            if (pids.indexOf(items[i].value) > -1) { //tempPid有值表示有search到父層...所有子層應出現
                tempPid = items[i].value.toString();
            }
            var pid = items[i].value.substring(0, 1).toString();
            if (pid == tempPid) {
                $("#" + items[i].id).show();
            }
            else if (ids.indexOf(items[i].value) > -1) {
                $("#" + items[i].id).show();
            }
            else {
                $("#" + items[i].id).hide();
            }
        }
    }
}
function btnLayerReset_onclick() {
    $("#txt_layerQuery").val("");
    var items = $('#div_treeLayer').jqxTree('getItems');
    for (var i in items) {
        $("#" + items[i].id).show();
    }
}

function aLayerFilter_onclick(type) {
    layerFilterType = type;
    $("[lytr]").hide();
    $("[lytr=" + type + "]").show();
    if (type == "1") {
        $("#div_filterLayer").jqxPopover('height', "80");
    } else {
        $("#div_filterLayer").jqxPopover('height', "50");
    }
    $("#div_filterLayer").jqxPopover('open');

}
function aLayerFilter2_onclick(type) {
    layerFilterType = type;
    var labelID = "";
    switch (type) {
        case 7:
            if ($('.LayerCB[value="6027"]').prop('checked') == false) { alert('請先開啟"水門巡查成果等級"圖層'); return; }
            labelID = "b_filterCheckYear";
            break;
        case 8:
            if ($('.LayerCB[value="6028"]').prop('checked') == false) { alert('請先開啟"抽水站巡查成果等級"圖層'); return; }
            labelID = "c_filterCheckYear";
            break;
        case 9:
            if ($('.LayerCB[value="60121"]').prop('checked') == false) { alert('請先開啟"定期檢查"圖層'); return; }
            labelID = "a_filterCheckAYear1";
            break;
        case 10:
            if ($('.LayerCB[value="60122"]').prop('checked') == false) { alert('請先開啟"不定期檢查"圖層'); return; }
            labelID = "a_filterCheckAYear2";
            break;
        case 11:
            if ($('.LayerCB[value="60123"]').prop('checked') == false) { alert('請先開啟"平時檢查"圖層'); return; }
            labelID = "a_filterCheckAYear3";
            break;
        case 12:
            labelID = "a_filterCheckResultYear1";
            break;
        case 13:
            labelID = "a_filterCheckResultYear2";
            break;
    }

    $("[lytr=" + type + "]").show();
    var now = new Date();
    var baseYear = 100;
    var lastYear = 112;

    //水利督導只能看前後2年
    if (isWRD === "1") {
        baseYear = now.getFullYear() - 1911 - 1;
        lastYear = now.getFullYear() - 1911 + 1;
    }

    var row = "<tr><td>年度:</td></tr><tr><td>";
    for (var i = baseYear; i < lastYear; i++) {
        row += "<label style='margin:5px 10px;'><input type='checkbox' data-type='" + layerFilterType + "' value='" + i + "' />" + i + "</label>";
    }
    row += "</tr></td>";

    $('.PanelForm2').html(row);

    //還原被勾起的checkbox
    var labeltxt = $('#' + labelID).text();
    labeltxt = labeltxt.replace("年度", "");
    var years = labeltxt.split("、");
    for (var i = 0; i < years.length; i++) {
        $('.PanelForm2 input[type="checkbox"][value="' + years[i] + '"]').prop('checked', true);
    }

    $("#div_filterLayer2").jqxPopover('open');

}
function btnCancalfilterLayer2_onclick() {
    var clk = $('label input[type="checkbox"]:checked', '.PanelForm2');
    for (var i = 0; i < clk.length; i++) {
        clk[i].click();
    }
    $('#div_filterLayer2').jqxPopover('close')
}
function selFilterCity_onchange(e) {
    var val = e.value;
    layerFilterCity = val;
    if (val == "") {
        $("#sel_filterSection").html("<option value=''>請選擇</option>");
        $("#sel_filterSection").trigger('change'); return false;
    }
    //地段
    var data = { f: "pjson", where: '"鄉鎮市代碼"=\'' + val + '\'', outFields: "地段代碼, 地段名稱", returnGeometry: false, returnDistinctValues: true, orderByFields: '地段名稱 ASC' };
    var fn = function (d) {
        buildSelectText2(d, "sel_filterSection", "1", { text: '地段名稱', value: '地段代碼' });
    }
    AjaxGisQuery(cadUrl, data, fn, "get selfilterSection error");
}
function selLayerFilter_onchange(e) {
    var val = e.value;
    var text = e[e.selectedIndex].label;
    var def = "";

    switch (layerFilterType) {
        case 1:
            // layerFilterCity
            text = $("#sel_filterCity > option:selected").text() + text;
            def = (val == "" ? '' : '鄉鎮市代碼=\'' + layerFilterCity + '\' and 地段代碼= \'' + val + '\'');
            facilitiesLayer.setDefinitions(2003, def);
            cadastreLayer.setDefinition(def);
            currCadDef = def;
            $("#a_filterSection").html(val == "" ? "篩選地段" : text);
            break;
        case 2:
            //debugger;
            def = (val == "" ? '' : 'YEAR= \'' + val + '\'');
            if ($("#sel_filterEngCity").val() != "") {
                def = (def == "" ? '' : def + ' AND ') + 'CITY=\'' + $("#sel_filterEngCity").val() + '\'';
            }
            facilitiesLayer.setDefinitions(5001, def);
            engLayer.setDefinition(def);
            currEngDef = def;
            $("#a_filterEngYear").html(val == "" ? "篩選年度" : text + '年度');
            break;
        case 3:
            def = (val == "" ? '' : 'CITY= \'' + val + '\'');
            if ($("#sel_filterEngYear").val() != "") {
                def = (def == "" ? '' : def + ' AND ') + 'YEAR=\'' + $("#sel_filterEngYear").val() + '\'';
            }
            facilitiesLayer.setDefinitions(5001, def);
            engLayer.setDefinition(def);
            currEngDef = def;
            $("#a_filterEngCity").html(val == "" ? "篩選鄉鎮" : text);
            break;
        case 4:
            //debugger;
            def = (val == "" ? '' : "Year='" + val + "'");
            facilitiesLayer.setDefinitions(5002, def);
            contractLayer.setDefinition(def);
            currContractEngDef = def;
            $("#a_filterContractEngYear").html(val == "" ? "篩選年度" : text + '年度');
            break;
        case 5:

            def = (val == "" ? '' : "T06 like '" + val + "%'");

            def += (正常 ? (def.indexOf('FacStatus') ? " OR FacStatus=1" : " AND (FacStatus=1") : "");
            def += 正常 ? ")" : "";

            facilitiesLayer.setDefinitions(6012, def);
            checkALayer.setDefinition(def);
            currCheckADef = def;
            $("#a_filterCheckAYear").html(val == "" ? "篩選年度" : text + '年度');
            break;
    }
    $("#div_filterLayer").jqxPopover('close');
    //圖層定義篩選後定位==
    if (def != "") JqxLoading(true);
    setTimeout(function () {
        //fitGeoByDef(layerFilterType == 1 ? "1" : layerFilterType == 4 ? "4" : layerFilterType == 5 ? "5" :"2");
        fitGeoByDef(layerFilterType.toString());
    }, 1000);

}

function selFilterCity2_onchange() {
    var def = "";
    var chk = $('.PanelForm2 input[type="checkbox"]:checked');
    var _type = $('.PanelForm2 input[type="checkbox"]').data('type');
    var fitType = "0";
    var layArr = [];
    var YearArr = [];
    switch (_type) {
        case 7:
            //水門
            fitType = "7";
            for (var i = 0; i < chk.length; i++) {
                layArr.push("T04 like '" + $(chk[i]).val() + "%'");
                YearArr.push($(chk[i]).val());
            }
            def = layArr.join(" OR ");

            //檢查有多少選項被勾起
            var arr_6027 = [];
            for (var i = 1; i <= 4; i++) {
                var _chk = $('[value="6027' + i + '"]').prop('checked');
                if (_chk == true) {
                    arr_6027.push('FacStatus=' + i);
                }
            }



            facilitiesLayer.setDefinitions(6027, def + " " + (layArr.length > 0 ? " AND " : "") + "(" + arr_6027.join(" OR ") + ")");
            ws6027Layer.setDefinition(def + " " + (layArr.length > 0 ? " AND " : "") + "(" + arr_6027.join(" OR ") + ")");
            ws6027XDef = def;
            $("#b_filterCheckYear").html(layArr.length == 0 ? "篩選年度" : YearArr.join("、") + '年度');
            break;
        case 8:
            //抽水站
            fitType = "8";
            for (var i = 0; i < chk.length; i++) {
                layArr.push("(T04 like '" + $(chk[i]).val() + "%')");
                YearArr.push($(chk[i]).val());
            }
            def = layArr.join(" OR ");

            //檢查有多少選項被勾起
            var arr_6028 = [];
            for (var i = 1; i <= 4; i++) {
                var _chk = $('[value="6028' + i + '"]').prop('checked');
                if (_chk == true) {
                    arr_6028.push('FacStatus=' + i);
                }
            }

            facilitiesLayer.setDefinitions(6028, def + " " + (layArr.length > 0 ? " AND " : "") + "(" + arr_6028.join(" OR ") + ")");
            ws6028Layer.setDefinition(def + " " + (layArr.length > 0 ? " AND " : "") + "(" + arr_6028.join(" OR ") + ")");
            ws6028XDef = def;
            $("#c_filterCheckYear").html(layArr.length == 0 ? "篩選年度" : YearArr.join("、") + '年度');
            break;
        case 9:
            //護岸 - 定期檢查
            var LayerYear = [];
            for (var i = 0; i < chk.length; i++) {
                LayerYear.push($(chk[i]).val());
                layArr.push("T06 like '" + $(chk[i]).val() + "%'");
                YearArr.push($(chk[i]).val());
            }
            LayerYear_60121 = LayerYear;

            //檢查有多少選項被勾起
            var arr_60121 = [];
            for (var j = 1; j <= 4; j++) {
                var _chk = $('[value="60121' + j + '"]').prop('checked');
                if (_chk == true) {
                    arr_60121.push('FacStatus=' + j);
                }
            }
            var FacStatusFilter = (arr_60121.length > 0 ? "(" + arr_60121.join(" OR ") + ")" : "")

            if (layArr.length > 0) {
                //有選擇年分
                var temparr = [];
                for (var i = 0; i < layArr.length; i++) {
                    temparr.push("(" + layArr[i] + " AND " + FacStatusFilter + ")")
                }
                def = temparr.join(" OR ");
            } else {
                //沒選擇年分
                def = FacStatusFilter;
            }

            
            facilitiesLayer.setDefinitions(parseInt("60121"), def);
            eval("ws60121Layer.setDefinition(def)");
            ws60121XDef = def;
            $("#a_filterCheckAYear1").html(layArr.length == 0 ? "篩選年度" : YearArr.join("、") + '年度');
            break;
        case 10:
            //護岸 - 不定期檢查
            var LayerYear = [];
            for (var i = 0; i < chk.length; i++) {
                LayerYear.push($(chk[i]).val());
                layArr.push("T06 like '" + $(chk[i]).val() + "%'");
                YearArr.push($(chk[i]).val());
            }
            LayerYear_60122 = LayerYear;

            //檢查有多少選項被勾起
            var arr_60122 = [];
            for (var j = 1; j <= 4; j++) {
                var _chk = $('[value="60122' + j + '"]').prop('checked');
                if (_chk == true) {
                    arr_60122.push('FacStatus=' + j);
                }
            }
            var FacStatusFilter = (arr_60122.length > 0 ? "(" + arr_60122.join(" OR ") + ")" : "")

            if (layArr.length > 0) {
                //有選擇年分
                var temparr = [];
                for (var i = 0; i < layArr.length; i++) {
                    temparr.push("(" + layArr[i] + " AND " + FacStatusFilter + ")")
                }
                def = temparr.join(" OR ");
            } else {
                //沒選擇年分
                def = FacStatusFilter;
            }

            facilitiesLayer.setDefinitions(parseInt("60122" + j), def);
            eval("ws60122Layer.setDefinition(def)");
            ws60122XDef = def;
            $("#a_filterCheckAYear2").html(layArr.length == 0 ? "篩選年度" : YearArr.join("、") + '年度');
            break;
        case 11:
            //護岸 - 平時檢查
            var LayerYear = [];
            for (var i = 0; i < chk.length; i++) {
                LayerYear.push($(chk[i]).val());
                layArr.push("T06 like '" + $(chk[i]).val() + "%'");
                YearArr.push($(chk[i]).val());
            }
            LayerYear_60123 = LayerYear;

            //檢查有多少選項被勾起
            var arr_60123 = [];
            for (var j = 1; j <= 4; j++) {
                var _chk = $('[value="60123' + j + '"]').prop('checked');
                if (_chk == true) {
                    arr_60123.push('FacStatus=' + j);
                }
            }
            var FacStatusFilter = (arr_60123.length > 0 ? "(" + arr_60123.join(" OR ") + ")" : "")

            if (layArr.length > 0) {
                //有選擇年分
                var temparr = [];
                for (var i = 0; i < layArr.length; i++) {
                    temparr.push("(" + layArr[i] + " AND " + FacStatusFilter + ")")
                }
                def = temparr.join(" OR ");
            } else {
                //沒選擇年分
                def = FacStatusFilter;
            }

            facilitiesLayer.setDefinitions(parseInt("60123" + j), def);
            eval("ws60123Layer.setDefinition(def)");
            ws60123XDef = def;
            $("#a_filterCheckAYear3").html(layArr.length == 0 ? "篩選年度" : YearArr.join("、") + '年度');
            break;
        case 12:
            //專案特別檢查
            for (var i = 0; i < chk.length; i++) {
                layArr.push("CheckDate like '" + $(chk[i]).val() + "%'");
                YearArr.push($(chk[i]).val());
            }
            def = layArr.join(" OR ");

            for (var i = 1; i <= 3; i++) {
                for (var j = 1; j <= 4; j++) {
                    facilitiesLayer.setDefinitions(parseInt("6030" + i.toString()), def);
                    eval("ws6030" + i.toString() + "Layer.setDefinition(\"" + def + "\")")
                }
            }
            $("#a_filterCheckResultYear1").html(layArr.length == 0 ? "篩選年度" : YearArr.join("、") + '年度');
            break;
        case 13:
            //臨時檢查
            for (var i = 0; i < chk.length; i++) {
                layArr.push("CheckDate like '" + $(chk[i]).val() + "%'");
                YearArr.push($(chk[i]).val());
            }
            def = layArr.join(" OR ");

            for (var i = 1; i <= 3; i++) {
                facilitiesLayer.setDefinitions(parseInt("6030" + i.toString()), def);
                eval("ws6030" + i.toString() + "Layer.setDefinition(\"" + def + "\")")
            }
            $("#a_filterCheckResultYear2").html(layArr.length == 0 ? "篩選年度" : YearArr.join("、") + '年度');
            break;
    }

    $("#div_filterLayer2").jqxPopover('close');
    //圖層定義篩選後定位==
    if (def != "") JqxLoading(true);
    setTimeout(function () {
        fitGeoByDef(fitType);
    }, 1000);
}

function fitGeoByDef(type) {
    var fitGeos = [];
    var temp = [];
    var data = { f: "pjson", where: '', outFields: "OBJECTID", returnGeometry: true };
    if (type == "1") {
        if (currCadDef != "") {
            data.where = currCadDef;
            temp = AjaxGisGetGeo(cadUrl, data, "get cad geo error");
        }
    } else if (type == "2") {
        if (currEngDef != "") {
            data.where = currEngDef;
            temp = AjaxGisGetGeo(postUrl, data, "get cad geo error");
        }
    }
    else if (type == "4") {
        //debugger;
        if (currContractEngDef != "") {
            data.where = currContractEngDef;
            temp = AjaxGisGetGeo(postContractUrl, data, "get cad geo error");
        }
    }
    else if (type == "5") {
        //debugger
        if (currCheckADef != "") {
            data.where = currCheckADef;
            temp = AjaxGisGetGeo(postCheckAUrl, data, "get cad geo error");
        }
    }
    else if (type == "6") {
        if (ZooinLayerCode != "") {
            data.where = "1=1";
            var isFID = ["13037", "13038"];
            if (isFID.indexOf(ZooinLayerCode) >= 0) {
                data.outFields = "FID"
            }
            temp = AjaxGisGetGeo(serviceURL + "/" + ZooinLayerCode, data, "get cad geo error");
            ZooinLayerCode = "";
        }
    }
    else if (type == "7") {
        //水門
        if (ws6027XDef != "") {
            data.where = ws6027XDef;
            temp = AjaxGisGetGeo(serviceURL + "/6027", data, "get cad geo error");
        }
    }
    else if (type == "8") {
        //抽水站
        if (ws6028XDef != "") {
            //debugger
            data.where = ws6028XDef;
            temp = AjaxGisGetGeo(serviceURL + "/6028", data, "get cad geo error");
        }
    }
    else if (type == "9") {
        //定期檢查
        if (ws60121XDef != "") {
            data.where = "(" + ws60121XDef + ")";
            temp = AjaxGisGetGeo(serviceURL + "/60121", data, "get cad geo error");
        }
    }
    else if (type == "10") {
        //不定期檢查
        if (ws60122XDef != "") {
            data.where = "(" + ws60122XDef + ") ";
            temp = AjaxGisGetGeo(serviceURL + "/60122", data, "get cad geo error");
        }
    }
    else if (type == "11") {
        //平時檢查
        if (ws60123XDef != "") {
            data.where = "(" + ws60123XDef + ") ";
            temp = AjaxGisGetGeo(serviceURL + "/60123", data, "get cad geo error");
        }
    }

    if (temp != null && temp.length > 0) {
        for (var i = 0; i < temp.length; i++) {
            fitGeos.push(arc.StringToGeometry(JSON.stringify(temp[i])));
        }

        arc.fitGeometry(fitGeos);
        //當只有一個點的時候 回到全畫面
        if (temp.length == 1) {
            arc.mapCtrl.toFullExtent();
        }
        //arc.loadDrawGraphic(fitGeos, "ttt");
    }
    JqxLoading(false);
}

//#endregion

//#region 地藉查詢

//function btnStartBufferQuery_onclick() { //環域
//    if (isModal) return false;
//    if (mapReady) {
//        cadType = "Buffer";
//        setModal(true);
//        var buffer = tryParseFloat($("#txt_bufferMeter").val());
//        buffer = (buffer == 0 ? 20 : buffer);
//        arc.bufferClick(buffer);
//    }
//}
function bufferGeoHandle(geo) {
    //前處理

    if (cadType == "ShpFile" || cadType == "KmlFile") {
        arc.loadDrawGraphic(geo, GraphicIndex);
        GraphicIndex++;
    }

    if (!$("#cb_buffer").is(":checked")) { //未勾選buffer
        if (cadType == "ShpFile" || cadType == "KmlFile") arc.fitGeometry(geo);
        if (currCadDef != '') cadastreLayer.setDefinition('');
        cadastreLayer.getfraturesbyGeo(geo[0]);
        if (currCadDef != '') cadastreLayer.setDefinition(currCadDef);
    }
    else {  //取buffer
        cadType = "Buffer";
        var bufferlen = tryParseFloat($("#txt_bufferMeter").val());
        bufferlen = (bufferlen == 0 ? 20 : bufferlen);
        arc.gBuffer(geo[0], bufferlen);
    }
    OpenCadastreLayer(); //打開地籍圖

}

function EngPrjbufferGeoHandle(geo) {

    currCadDef = $("#selEngType").val() == "" ? "" : "proj_isend=" + $("#selEngType").val();
    //前處理

    if (cadType == "eShpFile" || cadType == "eKmlFile") {
        arc.loadDrawGraphic(geo, GraphicIndex);
        GraphicIndex++;
    }

    //清空列表
    if (engSource != null) {
        engSource.localdata = [];
    }

    if (!$("#cb_buffer").is(":checked")) { //未勾選buffer
        //if (cadType == "eShpFile" || cadType == "eKmlFile") arc.fitGeometry(geo);
        //@* 格式轉成SQL環域分析接受的格式 *@

            if (geo[0].type == "polygon") {
            var anaData = "POLYGON";
            anaData += "(";
            for (var i in geo[0].rings) {
                anaData += "(";
                for (var j in geo[0].rings[i]) {
                    anaData += geo[0].rings[i][j][0];
                    anaData += " ";
                    anaData += geo[0].rings[i][j][1];
                    anaData += ",";
                }
                //去除逗點
                anaData = anaData.substring(0, anaData.length - 1);
                anaData += "),";
            }
            //去除逗點
            anaData = anaData.substring(0, anaData.length - 1);

            anaData += ")";
        } else if (geo[0].type == "polyline") {
            var anaData = "LINESTRING";
            for (var i in geo[0].paths) {
                anaData += "(";
                for (var j in geo[0].paths[i]) {
                    anaData += geo[0].paths[i][j][0];
                    anaData += " ";
                    anaData += geo[0].paths[i][j][1];
                    anaData += ",";
                }
                //去除逗點
                anaData = anaData.substring(0, anaData.length - 1);
                anaData += "),";
            }
            //去除逗點
            anaData = anaData.substring(0, anaData.length - 1);
        } else if (geo[0].type == "point") {
            var anaData = "POINT";
            anaData += "(";
            anaData += geo[0].x;
            anaData += " ";
            anaData += geo[0].y;
            anaData += ")";
        }

        data = { "Geo": anaData, "proj_isend": $("#selEngType").val() }

        var SQLQueryData = null;
        //查詢
        AjaxJson(EngByGeoUrl, data, function (d) { SQLQueryData = d; }, "工程案件分析發生錯誤", false);

        for (var i in SQLQueryData) {
            SQLQueryData[i].attributes = SQLQueryData[i];
            SQLQueryData[i].attributes.OBJECTID = SQLQueryData[i].id;
            SQLQueryData[i].g = {};
            var item = SQLQueryData[i];
            if (item.seat_Position.indexOf("MULTIPOINT") >= 0) {
                SQLQueryData[i].g.Type = "multipoint";

                var _points = item.seat_Position.replace("MULTIPOINT", "").trim()
                _points = _points.replace(/\(/g, "[").replace(/\)/g, "]").replace(/ /g, ",").replace(/,,/g, ",");

                _points = JSON.parse(_points);

                SQLQueryData[i].g.points = _points
            } else if (item.seat_Position.indexOf("MULTILINESTRING") >= 0) {
                SQLQueryData[i].g.Type = "polyline";

                var _paths = item.seat_Position.replace("MULTILINESTRING", "").trim()
                _paths = _paths.replace(/\(/g, "[").replace(/\)/g, "]").replace(/ /g, ",").replace(/,,/g, ",");

                _paths = JSON.parse(_paths);

                SQLQueryData[i].g.paths = _paths;
            } else if (item.seat_Position.indexOf("MULTIPOLYGON") >= 0) {
                SQLQueryData[i].g.Type = "polygon";

                var _rings = item.seat_Position.replace("MULTIPOLYGON", "").trim()
                _rings = _rings.replace(/\(/g, "[").replace(/\)/g, "]").replace(/ /g, ",").replace(/,,/g, ",");

                _rings = JSON.parse(_rings);

                SQLQueryData[i].g.rings = _rings;
            }
        }
        getEngQueryList("", SQLQueryData);//產列表



        //if (currCadDef != '') {
        //    ws16101Layer.setDefinition('');
        //    ws16102Layer.setDefinition('');
        //    ws16103Layer.setDefinition('');
        //    ws16201Layer.setDefinition('');
        //    ws16202Layer.setDefinition('');
        //    ws16203Layer.setDefinition('');
        //}
        //ws16101Layer.getfraturesbyGeo(geo[0]);
        //ws16102Layer.getfraturesbyGeo(geo[0]);
        //ws16103Layer.getfraturesbyGeo(geo[0]);
        //ws16201Layer.getfraturesbyGeo(geo[0]);
        //ws16202Layer.getfraturesbyGeo(geo[0]);
        //ws16203Layer.getfraturesbyGeo(geo[0]);

        //if (currCadDef != '') {
        //    ws16101Layer.setDefinition(currCadDef);
        //    ws16102Layer.setDefinition(currCadDef);
        //    ws16103Layer.setDefinition(currCadDef);
        //    ws16201Layer.setDefinition(currCadDef);
        //    ws16202Layer.setDefinition(currCadDef);
        //    ws16203Layer.setDefinition(currCadDef);
        //}
    }
    else {//取buffer
        cadType = "EngBuffer";
        var bufferlen = tryParseFloat($("#txt_bufferMeter").val());
        bufferlen = (bufferlen == 0 ? 20 : bufferlen);
        arc.gBuffer(geo[0], bufferlen);
    }
    OpenEngLayer() //打開工程案件圖層
}

//#region 圈選
function btnStartFenceQuery_onclick() { //畫面圈選
    if (isModal && modalType == "draw") btnStopDraw_onclick();
    if (GraphicIndex != 0) {
        //alert("圖面上已有繪製完成的圖層，請先清除"); return false;
        clearLayer_onclick();
    }
    if ($("#selFencType").val() == 1) {
        cadType = "EngPrj";
    }
    else {
        cadType = "Fence";
    }
    mapDraw_onclick();
}
function btnCancelFenceQuery_onclick() {
    cadType = "";
    btnStopDraw_onclick();
}
//#endregion

//#region 地號
function selCityCad_onchange(e) { //地段地號
    if (e.value == "") { $("#sel_sectionCad,#sel_noCad").html(""); return false; }
    landNo.Town = e.value;
    var whereStr = '"鄉鎮市代碼" = \'' + landNo.Town + '\'';
    var data = { f: "pjson", where: whereStr, outFields: "地段代碼, 地段名稱", returnGeometry: false, returnDistinctValues: true };
    var fn = function (d) {
        buildSelectText2(d, "sel_sectionCad", "1", { text: '地段名稱', value: '地段代碼' });
    }
    AjaxGisQuery(cadUrl, data, fn, "selcityCad change error");
}
function selSectionCad_onchange(e) {
    if (e.value == "") { $("#sel_noCad").html(""); return false; }
    landNo.Section = e.value;
    var whereStr = '"鄉鎮市代碼" = \'' + landNo.Town + '\' and "地段代碼" = \'' + landNo.Section + '\'';
    var data = { f: "pjson", where: whereStr, outFields: "地號", orderByFields: '地號 ASC', returnGeometry: false, returnDistinctValues: true };
    var fn = function (d) {
        buildSelectTextNoValue2(d, "sel_noCad", "1", { text: '地號' });
    }
    AjaxGisQuery(cadUrl, data, fn, "selyear change error");
}
//流域
function QueryWatershed() {
    //var isBuffer = $("#cb_buffer").prop("checked");//是否啟用環域
    var BufferRange = $("#txt_bufferMeter").val();//環域範圍
    var _name = $("#sel_Watershed option:selected").text();
    engSource = null;
    var url = serviceURL;

    var whereStr = "Name='" + _name + "'";
    var data = { f: "pjson", where: whereStr, outFields: "OBJECTID", returnGeometry: true };

    var fn = function (d, geo) {

        if (d != null) {
            var WatershedLocShp = {};

            for (var i = 0; i < d.length; i++) {
                var temp = geo[d[i].OBJECTID];
                WatershedLocShp[d[i].OBJECTID] = arc.StringToGeometry(JSON.stringify(temp));
            }
            var g = WatershedLocShp[d[0].OBJECTID];
            arc.removeDrawGraphic(9999);
            //是否啟用環域
            if ($("#cb_buffer").prop("checked") == true) {
                cadType = "EngBuffer";//設定查詢目標為工程

            } else {
                cadType = "EngQuery";
            }

            arc.loadDrawGraphic([g], 9999);
            arc.gBuffer(g, BufferRange);//環域分析
            arc.fitGeometry([g]);//目標置中
        }
    }

    AjaxGisQueryGeo(url + '/11004/query', data, fn, "流域查詢錯誤。");
}

//打開地籍圖

function OpenCadastreLayer() {
    // cadastreLayer.show();
    var checked = false;
    $('.LayerCB:checkbox').each(function () {
        if ($(this).val() == '2003') {
            if (!$(this).prop('checked')) $(this).trigger('click');
            checked = true;
        }
        if (checked) return false;
    });
}
//打開工程案件圖層
function OpenEngLayer() {
    var checked = false;
    $('.LayerCB:checkbox').each(function () {
        if ($("#selEngType").val() == "") {
            var OpenLayers = ['16101', '16102', '16103', '16201', '16202', '16203'];
            if (OpenLayers.indexOf($(this).val()) >= 0) {
                //如果該checkbox沒有被勾起 觸發該checkbox的click事件
                if (!$(this).prop('checked')) $(this).trigger('click');
            }
        } else if ($("#selEngType").val() == "0") { //施工中

            var OpenLayers = ['16101', '16102', '16103'];
            if (OpenLayers.indexOf($(this).val()) >= 0) {
                if (!$(this).prop('checked')) $(this).trigger('click');
            }
        } else if ($("#selEngType").val() == "1") { //已竣工

            var OpenLayers = ['16201', '16202', '16203'];
            if (OpenLayers.indexOf($(this).val()) >= 0) {
                if (!$(this).prop('checked')) $(this).trigger('click');
            }
        }
        if ($(this).val() == '16203') {
            checked = true;
        }
    });
}
//地段地號查詢
function btnLandNOQuery_onclick() {
    if (IsEmpty($("#sel_noCad").val())) { alert("請選擇地號"); return false; }
    landNo.No = $("#sel_noCad").val();
    if ($("#selFencType").val() == 1) {
        OpenEngLayer();//打開工程案件圖層
    } else {
        OpenCadastreLayer(); //打開地籍圖

    }

    //清空列表
    if (engSource != null) {
        engSource.localdata = [];
    }

    var whereStr = '"鄉鎮市代碼" = \'' + landNo.Town + '\' and "地段代碼" = \'' + landNo.Section + '\' and "地號"=\'' + landNo.No + '\'';
    var data = { f: "pjson", where: whereStr, outFields: "OBJECTID,鄉鎮市區名,地段名稱,地號,所有人姓名,面積", orderByFields: 'OBJECTID ASC', returnGeometry: true };
    var fn = function (d, geo) {
        //clearLayer_onclick();
        if ($("#selFencType").val() == 1) {
            currEngLocShp = {}

            for (var i = 0; i < d.length; i++) {
                var temp = geo[d[i].OBJECTID];
                currEngLocShp[d[i].OBJECTID] = arc.StringToGeometry(JSON.stringify(temp));
            }
            var g = currEngLocShp[d[0].OBJECTID];

            if ($("#cb_buffer").is(":checked")) {
                //debugger;
                EngPrjbufferGeoHandle([g]);
            }
            arc.removeDrawGraphic(9999);
            arc.loadDrawGraphic([g], 9999);
            arc.fitGeometry([g]);
        } else {
            if (d != null && d.length > 0) {
                currCadLocShp = {};
                for (var i = 0; i < d.length; i++) {
                    var temp = geo[d[i].OBJECTID];
                    currCadLocShp[d[i].OBJECTID] = arc.StringToGeometry(JSON.stringify(temp));
                }
                var g = currCadLocShp[d[0].OBJECTID];
                if ($("#cb_buffer").is(":checked")) {
                    bufferGeoHandle([g]);
                }
                arc.removeDrawGraphic(9999);
                arc.loadDrawGraphic([g], 9999);
                arc.fitGeometry([g]);

                //cadType = "Pos";
                //cadastreLayer.getfeatures("OBJECTID=" + d[0].OBJECTID);
            }
            for (var i = 0; i < d.length; i++) {
                d[i]["Action"] = '<a class="FunA" onclick="cadPos_onclick(\'' + d[i].OBJECTID + '\')">選取</a>';
            }
            //預設套疊正射影像
            var checker = $("input[type=checkbox][value=8001]");
            if (!checker.is(":checked")) {
                checker.attr("checked", "checked");
                checker.trigger('change');
            }
            //==
            $("#div_resultWin").jqxWindow({ collapsed: false });
            $("#div_resultWin").jqxWindow('open');
            if (cadSource == null) createGridCad(d);
            else {
                cadSource.localdata = d;
                $("#gv_mainCad").jqxGrid('clearselection');
                $("#gv_mainCad").jqxGrid('updatebounddata', 'cells');
            }
        }
    }
    AjaxGisQueryGeo(cadUrl, data, fn, "btnLandNOQuery click error");
}
//#endregion

//#region 地標
function selAreaCad_onchange(e) { //地標
    //if (e.value == "") { $("#sel_catCad,#sel_catSubCad,#sel_markCad").html(""); return false; }

    var model = GetFormData("div_formCad", "Model");
    model.QueryType = "2";
    var data = { mark: model };
    var fn = function (d) {
        buildSelectText2(d, "sel_catCad", "1", { text: 'SName', value: 'MSID' });
    }
    AjaxJson(landmarkUrl, data, fn, "selareaCad change error");
}
function selCatCad_onchange(e) {
    //if (e.value == "") { $("#sel_catSubCad,#sel_markCad").html(""); return false; }

    var model = GetFormData("div_formCad", "Model");
    model.QueryType = "3";
    var data = { mark: model };
    var fn = function (d) {
        buildSelectText2(d, "sel_catSubCad", "1", { text: 'FacilityNa', value: 'FacilityID' });
    }
    AjaxJson(landmarkUrl, data, fn, "selareaCad change error");
}
function selSubCatCad_onchange(e) {
    //if (e.value == "") { $("#sel_markCad").html(""); return false; }

    var model = GetFormData("div_formCad", "Model");
    model.QueryType = "4";
    var data = { mark: model };
    var fn = function (data) {
        var temp = "", d = [];
        for (var i = 0; i < data.length; i++) {
            if (temp != data[i]["POI_S"]) {
                temp == data[i]["POI_S"]
                d.push(data[i])
            }
        }
        buildSelectText2(d, "sel_markCad", "1", { text: 'POI_S', value: 'XY' });
    }
    AjaxJson(landmarkUrl, data, fn, "selcatCad change error");
}
function btnLandMarkQuery_onclick() {
    if (IsEmpty($("#sel_markCad").val())) { alert("請選擇地標"); return false; }
    var xys = $("#sel_markCad").val().split(",");
    if (mapReady && xys.length > 1) {
        if ($("#selFencType").val() == 1) {
            cadType = "eLandmark";
            engSource = null;
            currEngLocShp = {};
            var geo = arc.StringToGeometry('{"x":' + xys[0] + ',"y":' + xys[1] + '}');
            EngPrjbufferGeoHandle([geo]);
        } else {
            cadType = "Landmark";
            //arc.locationCoord(tryParseFloat(xys[0]), tryParseFloat(xys[1]), 1000);
            var geo = arc.StringToGeometry('{"x":' + xys[0] + ',"y":' + xys[1] + '}');
            bufferGeoHandle([geo]);
            //if (currCadDef != '') cadastreLayer.setDefinition('');
            //cadastreLayer.getfraturesbyXY(tryParseFloat(xys[0]), tryParseFloat(xys[1]));
            //if (currCadDef != '') cadastreLayer.setDefinition(currCadDef);
        }
    }
}
//#endregion

//#region 上傳shp
function btnBrowseShpFile_onclick() { //上傳shp
    if (isModal) return false;
    $("#txt_shpFile").val("");
    $('#div_shpFile').jqxFileUpload('browse');
}
function uploadShpFile_oninit() {
    $("#div_shpFile").jqxFileUpload({
        uploadUrl: '',
        multipleFilesUpload: false,
        fileInputName: 'file',
        accept: '.zip'
    });
    $('#div_shpFile').on('select', function (event) {
        $('#div_shpFile').jqxFileUpload('cancelAll');
        if ($("#selFencType").val() == 1) {
            cadType = "eShpFile";
        } else {
            cadType = "ShpFile";
        }
        JqxLoading(true);
        setModal(true);
        $("#txt_shpFile").val(event.args.file);
        var form = $("#div_shpFile > .jqx-file-upload-form").get(0);
        $("input[type=file]", form).attr("name", "file"); //關鍵
        form.id = "frm_shpFile";
        //debugger;
        arc.loadSharpZip(form)
    });
}
//#endregion

//#region 上傳kml
function btnBrowseKmlFile_onclick() { //上傳kml
    if (isModal) return false;
    $("#txt_kmlFile").val("");
    $('#div_kmlFile').jqxFileUpload('browse');
}
function uploadKmlFile_oninit() {
    $("#div_kmlFile").jqxFileUpload({
        uploadUrl: kmlUploadUrl,
        autoUpload: true,
        multipleFilesUpload: false,
        fileInputName: 'kmlfile',
        accept: '.kml'
    });
    $('#div_kmlFile').on('select', function (event) {
        $('#div_kmlFile').jqxFileUpload('cancelAll');
        if ($("#selFencType").val() == 1) {
            cadType = "eKmlFile";
        } else {
            cadType = "KmlFile";
        }
        JqxLoading(true);
        setModal(true);
        $("#txt_kmlFile").val(event.args.file);


    });
    $('#div_kmlFile').on('uploadEnd', function (event) {
        var res = event.args.response;
        var ret = res.split("|");
        //debugger
        if (ret.length > 1 && ret[0] == "Y") {
            if (kmllayer != null) arc.removeLayer(kmllayer);
            kmllayer = new LayerCtrl({
                url: kmlUrl + ret[1],
                id: 'kml',
                layertype: OpLayerType.KmlLayer,
            });
            arc.addLayer(kmllayer);
        } else {
            JqxLoading(false);
            setModal(false);
            alert('上傳失敗:' + ret[0]);
        }
    });
}
//#endregion

function btnExportCad_onclick() { //匯出結果
    if ($("#selFencType").val() == 1) {
        var d = engSource.localdata;

        var csv = "案件類型,合約類別,列管案件編號,案件年度,案件編號,計畫編號,辦理方式,案件名稱,核定文號,案件類別,所屬鄉鎮市,所屬水系,排水,預算年度,預算來源,預算金額,預算總金額,核定經費,發包經費,結算金額,公告日期,決標日期,執行單位,執行承辦,承辦人員,執行內容,案件狀態,備註\n";
        for (var i = 0; i < d.length; i++) {
            csv += d[i]["proj_type"] + ",";//案件類型
            csv += d[i]["contract_type"] + ",";//合約類別
            csv += d[i]["proj_tube_num"] + ",";//列管案件編號
            csv += d[i]["proj_year"] + ",";//案件年度
            csv += d[i]["proj_num"] + ",";//案件編號
            csv += d[i]["proj_no"] + ",";//計畫編號
            csv += d[i]["proj_mode"] + ",";//辦理方式
            csv += d[i]["proj_name"] + ",";//案件名稱
            csv += d[i]["proj_file_num"] + ",";//核定文號
            csv += d[i]["proj_class"] + ",";//案件類別
            csv += d[i]["seat_town"] + ",";//所屬鄉鎮市
            csv += d[i]["seat_water"] + ",";//所屬水系

            csv += d[i]["seat_river"] + ",";//排水
            csv += d[i]["src_but_year"] + ",";//預算年度
            csv += d[i]["src_but_org"] + ",";//預算來源
            csv += d[i]["src_but_money"] + ",";//預算金額
            csv += d[i]["src_but_money_total"] + ",";//預算總金額

            csv += d[i]["src_approved_money"] + ",";//核定經費
            csv += d[i]["src_contract_money"] + ",";//發包經費
            csv += d[i]["src_money_total"] + ",";//結算金額
            csv += d[i]["ann_date"] + ",";//公告日期
            csv += d[i]["decision_date"] + ",";//決標日期
            csv += d[i]["exe_unit"] + ",";//執行單位
            csv += d[i]["ext_contr"] + ",";//執行承辦
            csv += d[i]["exe_staff"] + ",";//承辦人員
            csv += d[i]["proj_content"] + ",";//執行內容
            switch (d[i]["proj_isend"].toString()) { //案件狀態

                case "0":
                    csv += "施工中,";
                    break;
                case "1":
                    csv += "已竣工,";
                    break;
                case "2":
                    csv += "規劃中,";
                    break;
                case "3":
                    csv += "設計中,";
                    break;
                case "4":
                    csv += "發包中,";
                    break;
            }
            csv += d[i]["memo"] + "\n"; //備註
        }
        var urlPlus = "";
        if (navigator.appVersion.indexOf("Win") != -1) { //for windows os
            urlPlus = "%EF%BB%BF";
        }
        if (window.navigator.msSaveOrOpenBlob) {  //for ie10以上
            var blob = new Blob([decodeURIComponent(urlPlus + encodeURIComponent(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, '工程案件查詢.csv');
        } else {
            var csvData = 'data:text/csv;charset=utf-8,' + urlPlus + encodeURIComponent(csv);
            $("#a_csv")
                .attr({
                    'download': '工程案件查詢.csv'
                    , 'href': csvData
                });
            $("#a_csv")[0].click();
        }
    } else {
        var d = cadSource.localdata;

        var csv = "鄉鎮市,地段,地號,所有人,面積\n";
        for (var i = 0; i < d.length; i++) {
            csv += d[i]["鄉鎮市區名"] + ",";
            csv += d[i]["地段名稱"] + ",";
            csv += d[i]["地號"] + ",";
            csv += d[i]["所有人姓名"] + ",";
            csv += d[i]["面積"] + "\n";
        }
        var urlPlus = "";
        if (navigator.appVersion.indexOf("Win") != -1) { //for windows os
            urlPlus = "%EF%BB%BF";
        }
        if (window.navigator.msSaveOrOpenBlob) {  //for ie10以上
            var blob = new Blob([decodeURIComponent(urlPlus + encodeURIComponent(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, '地籍宗地查詢.csv');
        } else {
            var csvData = 'data:text/csv;charset=utf-8,' + urlPlus + encodeURIComponent(csv);
            $("#a_csv")
                .attr({
                    'download': '地籍宗地查詢.csv'
                    , 'href': csvData
                });
            $("#a_csv")[0].click();
        }
    }
}

function btnOpenWinCad_onclick() {
    $("#gv_mainCad").jqxGrid('clearselection');
    $("#div_resultWin").jqxWindow('open');
}
function btnClearCad_onclick() {
    $("#cb_buffer").removeAttr("checked");
    $("#txt_bufferMeter").val(20);
    $("#sel_areaCad,#sel_cityCad,#txt_shpFile,#txt_kmlFile").val("");
    $("#sel_sectionCad,#sel_noCad,#sel_catSubCad,#sel_catCad,#sel_markCad").html("");
    $('#div_shpFile').jqxFileUpload('cancelAll');
    $('#div_kmlFile').jqxFileUpload('cancelAll');
}

//#endregion

//#region 定位
function rdPosType_onchange(e) { //座標定位
    $("[tr]").hide();
    $("[tr=" + e.value + "]").show();
    currPosType = e.value
}
function btnCoordPos_onclick() {
    var d = GetFormData("div_formCoord", "Model");
    if (IsEmpty(d.PosType)) return;

    var data = { coord: d };
    var fn = function (data) {
        if (data[0] == 0 || data[1] == 0) alert('座標輸入錯誤');
        else if (mapReady) {
            arc.locationCoord(data[0], data[1], currScale);
        }
    }
    AjaxJson(coordPosUrl, data, fn, "coord pos error");
}
function btnClearCoord_onclick() {
    var d = { X97: '', Y97: '', X84: '', Y84: '', X67: '', Y67: '', XD: '', XM: '', XS: '', YD: '', YM: '', YS: '' };
    SetFormData("div_formCoord", d, "Model");
}


function btnEngPos_onclick() { //工程範圍
    var objID = $("#sel_project").val()
    if (IsEmpty(objID)) { alert('請選擇工程計畫'); return false; }
    if (mapReady) {
        cadType = "Pos";
        if (currEngDef != '') engLayer.setDefinition('');
        engLayer.getfeatures("OBJECTID=" + objID);
        if (currEngDef != '') engLayer.setDefinition(currEngDef);
    }
    //var xys = engSource.filter(function (obj) {
    //    return obj.OBJECTID == objID;
    //})
    //if (xys != null && xys.length > 0) {
    //    var x = tryParseFloat(xys[0].SX_TW97);
    //    var y = tryParseFloat(xys[0].SY_TW97);
    //    if (x == 0 || y == 0) alert('該計畫範圍無起點資料');
    //    else if (mapReady) {
    //        arc.locationCoord(x, y, currScale);
    //    }
    //}
}
function selYear_onchange(e) {
    engYear = e.value;
    if (e.value == "") { btnClearEng_onclick(); return false; }
    $("#sel_project").html("");

    var data = { f: "pjson", where: "YEAR = " + e.value + " and CITY<>''", outFields: "CITY", returnGeometry: false, returnDistinctValues: true };
    var fn = function (d) {
        buildSelectTextNoValue2(d, "sel_city", "1", { text: 'CITY' });
    }
    AjaxGisQuery(postUrl, data, fn, "selyear change error");
}
function selCity_onchange(e) {
    if (e.value == "") { $("#sel_project").html(""); return false; }
    $("#sel_project").val("");

    var data = { f: "pjson", where: "YEAR = " + engYear + " and CITY = '" + e.value + "'", outFields: "OBJECTID,SX_TW97,SY_TW97,F123", orderByFields: 'F123 ASC', returnGeometry: false, returnDistinctValues: true };
    var fn = function (data) {
        var d = [], temp = "";
        for (var i = 0; i < data.length; i++) {
            if (temp != data[i].F123) {
                temp = data[i].F123;
                d.push(data[i])
            }
        }
        //engSource = d;
        buildSelectText2(d, "sel_project", "1", { text: 'F123', value: 'OBJECTID' });
    }
    AjaxGisQuery(postUrl, data, fn, "selyear change error");
}
function btnClearEng_onclick() {
    $("#sel_year").val("");
    $("#sel_city").html("");
    $("#sel_project").html("");
}

//#region 地標定位
function sellmCity_onchange() {
    var model = {
        Town_id: $('#sel_lmcity').val(),
        QueryType: "2",
    };
    var data = { mark: model };
    var fn = function (d) {
        buildSelectText2(d, "sel_lmcat", "1", { text: 'SName', value: 'MSID' });
    }
    AjaxJson(landmarkUrl, data, fn, "sellmCity change error");
}

function sellmCat_onchange() {
    var model = {
        Town_id: $('#sel_lmcity').val(),
        MSID: $('#sel_lmcat').val(),
        QueryType: "3",
    };
    var data = { mark: model };
    var fn = function (d) {
        buildSelectText2(d, "sel_lmSubcat", "1", { text: 'FacilityNa', value: 'FacilityID' });
    }
    AjaxJson(landmarkUrl, data, fn, "sellmCat change error");
}

function sellmSubCat_onchange() {
    var model = {
        Town_id: $('#sel_lmcity').val(),
        MSID: $('#sel_lmcat').val(),
        FacilityID: $('#sel_lmSubcat').val(),
        QueryType: "4",
    };
    var data = { mark: model };
    var fn = function (data) {
        var temp = "", d = [];
        for (var i = 0; i < data.length; i++) {
            if (temp != data[i]["POI_S"]) {
                temp == data[i]["POI_S"]
                d.push(data[i])
            }
        }
        buildSelectText2(d, "sel_landmark", "1", { text: 'POI_S', value: 'XY' });
    }
    AjaxJson(landmarkUrl, data, fn, "sellmSubCat change error");
}

function btnLankMarkPos_onclick() {
    if ($('#sel_landmark').val() == '') {
        alert('請選擇地標');
        return false;
    } else {
        var xys = $("#sel_landmark").val().split(",");
        if (mapReady) {
            arc.locationCoord(xys[0], xys[1], 2000);
        }
    }
}

function btnClearLankMark_onclick() {
    $("#sel_lmcity").val("");
    $("#sel_lmcat,#sel_lmSubcat,#sel_landmark").html("");
}
//#endregion 地標定位

//#endregion

//#endregion

//#region 開啟特定圖層連同定位功能
function waitSetLayerOpenLoc(layerid, objid) { //多包一層

    if (isPanelInit) {
        setLayerOpenLoc(layerid, objid)
    } else {
        setTimeout(waitSetLayerOpenLoc, 1000);
    }
}
function setLayerOpenLoc(layerid, objid) {
    var checker = $("input[type=checkbox][value=" + layerid + "]");
    if (checker == null) { alert('圖層不存在layerid=' + layerid); return false; }
    if (!checker.is(":checked")) {
        checker.attr("checked", "checked");
        checker.trigger('change');
    }

    //定點
    var data = { f: "pjson", where: 'OBJECTID=' + objid, outFields: "OBJECTID", returnGeometry: true };
    var geo = AjaxGisGetGeo(serviceURL + '/' + layerid, data, "loc get geo error");
    if (geo != null && geo.length > 0) {
        if (geo[0].x == undefined) {
            WSLocFeature(layerid, objid);
        } else {
            arc.locationCoord(geo[0].x, geo[0].y, 1000);
        }
    } else {
        alert('未找到圖層點位');
    }
}
//#endregion

//#region 資料載入
function updateMapLayer(d) {
    treeSource.localdata = d;
    var dataAdapter = new $.jqx.dataAdapter(treeSource);
    dataAdapter.dataBind();
    var records = dataAdapter.getRecordsHierarchy('LayerID', 'LayerPID', 'items', [{ name: 'LayerHtml', map: 'label' }]);
    console.log(records);
    $("#div_treeLayer").jqxTree({ source: records });
}
function createMapLayerUI() {
    treeSource = {
        datatype: "array",
        datafields: [
            { name: 'LayerID' },
            { name: 'LayerPID' },
            { name: 'LayerName' },
            { name: 'LayerHtml' }
        ],
        id: 'LayerID',
        localdata: getMapLayerSource()
    };

    var dataAdapter = new $.jqx.dataAdapter(treeSource);
    dataAdapter.dataBind();
    var records = dataAdapter.getRecordsHierarchy('LayerID', 'LayerPID', 'items', [{ name: 'LayerHtml', map: 'label' }, { name: 'LayerID', map: 'value' }]);
    console.log(records);
    $('#div_treeLayer').jqxTree({
        source: records,
        width: '280px',
        enableHover: false,
        theme: 'tree',
        animationShowDuration: 100,
        animationHideDuration: 100

    });
    $('#div_treeLayer').jqxTree('expandItem', $('#div_treeLayer li:first')[0]);

    $("#div_layerSilder").jqxSlider({
        showTicks: false,
        showButtons: false,
        height: '10px',
        width: 200,
        min: 0,
        max: 1
    });
    $('#div_layerSilder').on('slideEnd', function (event) {
        var value = event.args.value.toFixed(2);
        divSlider_onslide(value);
    });
    $('#div_layerSilder').val(1);

}

function getMapLayerSource() {
    if (layerSource.length == 0) {
        layerSource.push({ LayerName: "水利行政管理", LayerID: 0, LayerPID: -1 });
        layerSource.push({ LayerName: "地籍圖", LayerID: 2, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "地籍圖", LayerID: 2003, LayerPID: 2, checked: false });
        layerSource.push({ LayerName: "土地段別圖", LayerID: 2004, LayerPID: 2, checked: false });

        layerSource.push({ LayerName: "中央管河川", LayerID: 10, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "權管範圍", LayerID: 10001, LayerPID: 10, checked: false });
        layerSource.push({ LayerName: "河川區域", LayerID: 10002, LayerPID: 10, checked: false });

        layerSource.push({ LayerName: "縣管河川", LayerID: 11, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "河川起訖點", LayerID: 11001, LayerPID: 11, checked: false });
        layerSource.push({ LayerName: "水道治理計畫線", LayerID: 11002, LayerPID: 11, checked: false });
        layerSource.push({ LayerName: "用地範圍線", LayerID: 11003, LayerPID: 11, checked: false });
        layerSource.push({ LayerName: "權管範圍", LayerID: 11004, LayerPID: 11, checked: false });
        layerSource.push({ LayerName: "分區", LayerID: 11007, LayerPID: 11, checked: false });
        layerSource.push({ LayerName: "溪北", LayerID: 11006, LayerPID: 11007, checked: false });
        layerSource.push({ LayerName: "溪南", LayerID: 11008, LayerPID: 11007, checked: false });
        layerSource.push({ LayerName: "河川區域", LayerID: 11005, LayerPID: 11, checked: false });

        layerSource.push({ LayerName: "區域排水", LayerID: 12, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "河川起訖點", LayerID: 12001, LayerPID: 12, checked: false });
        layerSource.push({ LayerName: "權管範圍", LayerID: 12002, LayerPID: 12, checked: false });
        layerSource.push({ LayerName: "分區", LayerID: 12003, LayerPID: 12, checked: false });
        layerSource.push({ LayerName: "得子口溪", LayerID: 12004, LayerPID: 12003, checked: false });
        layerSource.push({ LayerName: "美福地區", LayerID: 12005, LayerPID: 12003, checked: false });
        layerSource.push({ LayerName: "三星地區", LayerID: 12006, LayerPID: 12003, checked: false });
        layerSource.push({ LayerName: "冬山河", LayerID: 12007, LayerPID: 12003, checked: false });
        layerSource.push({ LayerName: "巡查員分區圖", LayerID: 12008, LayerPID: 12, checked: false });

        layerSource.push({ LayerName: "水利設施", LayerID: 3, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "水門", LayerID: 3001, LayerPID: 3, checked: false });
        layerSource.push({ LayerName: "水門分區", LayerID: 3008, LayerPID: 3, checked: false });
        layerSource.push({ LayerName: "溪北", LayerID: 3009, LayerPID: 3008, checked: false });
        layerSource.push({ LayerName: "溪南", LayerID: 3010, LayerPID: 3008, checked: false });
        layerSource.push({ LayerName: "抽水站", LayerID: 3002, LayerPID: 3, checked: false });
        layerSource.push({ LayerName: "抽水站分區", LayerID: 3011, LayerPID: 3, checked: false });
        layerSource.push({ LayerName: "得子口溪", LayerID: 3012, LayerPID: 3011, checked: false });
        layerSource.push({ LayerName: "美福地區", LayerID: 3013, LayerPID: 3011, checked: false });
        layerSource.push({ LayerName: "冬山河", LayerID: 3014, LayerPID: 3011, checked: false });
        layerSource.push({ LayerName: "抽水站範圍圖", LayerID: 3007, LayerPID: 3, checked: false });
        //layerSource.push({ LayerName: "區域排水", LayerID: 3003, LayerPID: 3, checked: false });
        layerSource.push({ LayerName: "河堤", LayerID: 3004, LayerPID: 3, checked: false });
        //layerSource.push({ LayerName: "河川區域線圖", LayerID: 3005, LayerPID: 3, checked: false });

        layerSource.push({ LayerName: "水利普查", LayerID: 6, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "變異點圖", LayerID: 6001, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "斷面樁", LayerID: 6002, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "流量", LayerID: 6024, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "河川斷面線", LayerID: 6003, LayerPID: 6, checked: false });
        //layerSource.push({ LayerName: "破壞點", LayerID: 6004, LayerPID: 6, checked: false });
        //layerSource.push({ LayerName: "正常點", LayerID: 6005, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "防洪缺口", LayerID: 6006, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "制水門", LayerID: 6007, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "橋梁", LayerID: 6009, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "側溝", LayerID: 6026, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "自設河川斷面", LayerID: 6010, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "起訖點", LayerID: 6011, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "定期檢查", LayerID: 60121, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "正常", LayerID: 601211, LayerPID: 60121, checked: false });
        layerSource.push({ LayerName: "計畫改善", LayerID: 601212, LayerPID: 60121, checked: false });
        layerSource.push({ LayerName: "注意改善", LayerID: 601213, LayerPID: 60121, checked: false });
        layerSource.push({ LayerName: "立即改善", LayerID: 601214, LayerPID: 60121, checked: false });

        layerSource.push({ LayerName: "不定期檢查", LayerID: 60122, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "正常", LayerID: 601221, LayerPID: 60122, checked: false });
        layerSource.push({ LayerName: "計畫改善", LayerID: 601222, LayerPID: 60122, checked: false });
        layerSource.push({ LayerName: "注意改善", LayerID: 601223, LayerPID: 60122, checked: false });
        layerSource.push({ LayerName: "立即改善", LayerID: 601224, LayerPID: 60122, checked: false });

        layerSource.push({ LayerName: "平時檢查", LayerID: 60123, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "正常", LayerID: 601231, LayerPID: 60123, checked: false });
        layerSource.push({ LayerName: "計畫改善", LayerID: 601232, LayerPID: 60123, checked: false });
        layerSource.push({ LayerName: "注意改善", LayerID: 601233, LayerPID: 60123, checked: false });
        layerSource.push({ LayerName: "立即改善", LayerID: 601234, LayerPID: 60123, checked: false });

        layerSource.push({ LayerName: "專案特別檢查", LayerID: 6029, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "計畫改善", LayerID: 60291, LayerPID: 6029, checked: false });
        layerSource.push({ LayerName: "注意改善", LayerID: 60292, LayerPID: 6029, checked: false });
        layerSource.push({ LayerName: "立即改善", LayerID: 60293, LayerPID: 6029, checked: false });

        layerSource.push({ LayerName: "臨時檢查", LayerID: 6030, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "計畫改善", LayerID: 60301, LayerPID: 6030, checked: false });
        layerSource.push({ LayerName: "注意改善", LayerID: 60302, LayerPID: 6030, checked: false });
        layerSource.push({ LayerName: "立即改善", LayerID: 60303, LayerPID: 6030, checked: false });

        layerSource.push({ LayerName: "水門巡查成果等級", LayerID: 6027, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "正常", LayerID: 60271, LayerPID: 6027, checked: false });
        layerSource.push({ LayerName: "計畫改善", LayerID: 60272, LayerPID: 6027, checked: false });
        layerSource.push({ LayerName: "注意改善", LayerID: 60273, LayerPID: 6027, checked: false });
        layerSource.push({ LayerName: "立即改善", LayerID: 60274, LayerPID: 6027, checked: false });

        layerSource.push({ LayerName: "抽水站巡查成果等級", LayerID: 6028, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "正常", LayerID: 60281, LayerPID: 6028, checked: false });
        layerSource.push({ LayerName: "計畫改善", LayerID: 60282, LayerPID: 6028, checked: false });
        layerSource.push({ LayerName: "注意改善", LayerID: 60283, LayerPID: 6028, checked: false });
        layerSource.push({ LayerName: "立即改善", LayerID: 60284, LayerPID: 6028, checked: false });

        layerSource.push({ LayerName: "攔汙網線", LayerID: 6022, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "攔汙網", LayerID: 6018, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "竹筏", LayerID: 6023, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "植栽", LayerID: 6008, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "電纜線(含台灣固網)", LayerID: 6013, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "電纜線位置", LayerID: 6016, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "防汛道路警告牌調查_1070214", LayerID: 6025, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "高速公路下方積淹調查成果", LayerID: 6014, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "布袋蓮", LayerID: 6015, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "布袋蓮位置", LayerID: 6017, LayerPID: 6, checked: false });
        //layerSource.push({ LayerName: "垃圾熱點(線)", LayerID: 6019 LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "垃圾熱點位置", LayerID: 6020, LayerPID: 6, checked: false });
        layerSource.push({ LayerName: "羅東攔河堰集水區", LayerID: 6021, LayerPID: 6, checked: false });

        layerSource.push({ LayerName: "水利新建及修繕", LayerID: 5, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "工程", LayerID: 5001, LayerPID: 5, checked: false });
        layerSource.push({ LayerName: "開口合約工程", LayerID: 5002, LayerPID: 5, checked: false });
        layerSource.push({ LayerName: "復建工程", LayerID: 5003, LayerPID: 5, checked: false });
        layerSource.push({ LayerName: "臨時安全檢查", LayerID: 5004, LayerPID: 5, checked: false });
        layerSource.push({ LayerName: "工程案件", LayerID: 16000, LayerPID: 5 });
        layerSource.push({ LayerName: "施工中", LayerID: 16100, LayerPID: 16000, checked: false });
        layerSource.push({ LayerName: "點", LayerID: 16101, LayerPID: 16100, checked: false });
        layerSource.push({ LayerName: "線", LayerID: 16102, LayerPID: 16100, checked: false });
        layerSource.push({ LayerName: "面", LayerID: 16103, LayerPID: 16100, checked: false });
        layerSource.push({ LayerName: "已竣工", LayerID: 16200, LayerPID: 16000, checked: false });
        layerSource.push({ LayerName: "點", LayerID: 16201, LayerPID: 16200, checked: false });
        layerSource.push({ LayerName: "線", LayerID: 16202, LayerPID: 16200, checked: false });
        layerSource.push({ LayerName: "面", LayerID: 16203, LayerPID: 16200, checked: false });

        layerSource.push({ LayerName: "防災圖資", LayerID: 13, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "低窪地區", LayerID: 13008, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "歷史淹水區域", LayerID: 13005, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "200淹水潛勢圖(99年公告)", LayerID: 13021, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "350淹水潛勢圖(99年公告)", LayerID: 13022, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "450淹水潛勢圖(99年公告)", LayerID: 13023, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "600淹水潛勢圖(99年公告)", LayerID: 13024, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "6小時150mm淹水潛勢圖(107年公告)", LayerID: 13025, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "6小時250mm淹水潛勢圖(107年公告)", LayerID: 13026, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "6小時350mm淹水潛勢圖(107年公告)", LayerID: 13027, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "12小時200mm淹水潛勢圖(107年公告)", LayerID: 13028, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "12小時300mm淹水潛勢圖(107年公告)", LayerID: 13029, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "12小時400mm淹水潛勢圖(107年公告)", LayerID: 13030, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "24小時200mm淹水潛勢圖(107年公告)", LayerID: 13031, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "24小時350mm淹水潛勢圖(107年公告)", LayerID: 13032, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "24小時500mm淹水潛勢圖(107年公告)", LayerID: 13033, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "24小時650mm淹水潛勢圖(107年公告)", LayerID: 13034, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2004年", LayerID: 13011, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2007年", LayerID: 13012, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2008年", LayerID: 13013, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2009年", LayerID: 13014, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2010年", LayerID: 13015, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2011年", LayerID: 13016, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2012年", LayerID: 13017, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2013年", LayerID: 13018, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2015年", LayerID: 13019, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "2016年", LayerID: 13020, LayerPID: 13, checked: false });

        layerSource.push({ LayerName: "移動抽水機預佈位置", LayerID: 13002, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "移動抽水機分區", LayerID: 13036, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "溪北", LayerID: 13037, LayerPID: 13036, checked: false });
        layerSource.push({ LayerName: "溪南", LayerID: 13038, LayerPID: 13036, checked: false });
        layerSource.push({ LayerName: "自主防災社區推動範圍", LayerID: 13006, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "社區回饋歷史淹水範圍", LayerID: 13007, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "水尺", LayerID: 13003, LayerPID: 13, checked: false });        layerSource.push({ LayerName: "2019年", LayerID: 130031, LayerPID: 13003, checked: false });        layerSource.push({ LayerName: "2020年", LayerID: 130032, LayerPID: 13003, checked: false });
        layerSource.push({ LayerName: "宜蘭縣水位站", LayerID: 13009, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "宜蘭縣CCTV", LayerID: 13010, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "自主防災社區避難路線", LayerID: 13004, LayerPID: 13, checked: false });
        layerSource.push({ LayerName: "避難地點", LayerID: 13001, LayerPID: 13, checked: false });        layerSource.push({ LayerName: "2019年", LayerID: 130011, LayerPID: 13001, checked: false });        layerSource.push({ LayerName: "2020年", LayerID: 130012, LayerPID: 13001, checked: false });
        layerSource.push({ LayerName: "防汛備料", LayerID: 13035, LayerPID: 13, checked: false });

        layerSource.push({ LayerName: "溫泉圖資", LayerID: 7, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "露頭點位", LayerID: 7002, LayerPID: 7, checked: false });
        layerSource.push({ LayerName: "露頭範圍", LayerID: 7003, LayerPID: 7, checked: false });
        layerSource.push({ LayerName: "監測井", LayerID: 7005, LayerPID: 7, checked: false });
        layerSource.push({ LayerName: "水權", LayerID: 7004, LayerPID: 7, checked: false });
        layerSource.push({ LayerName: "宜蘭溫泉區", LayerID: 7001, LayerPID: 7, checked: false });
        layerSource.push({ LayerName: "地下水管制區", LayerID: 7006, LayerPID: 7, checked: false });

        layerSource.push({ LayerName: "水保圖資", LayerID: 15, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "簡易水土保持申報書", LayerID: 15008, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "水土保持計畫", LayerID: 15009, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "露營場域", LayerID: 15010, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "水土保持違規案件", LayerID: 15011, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "礦場", LayerID: 15005, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "山坡地露營區", LayerID: 15004, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "簡易水保", LayerID: 15006, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "坡地社區避難地點", LayerID: 15013, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "土石流潛勢溪流", LayerID: 15001, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "土石流潛勢溪流影響範圍", LayerID: 15002, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "特定水土保持區", LayerID: 15007, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "宜蘭縣山坡地範圍圖", LayerID: 15003, LayerPID: 15, checked: false });
        layerSource.push({ LayerName: "宜蘭縣山崩與地滑地質敏感區", LayerID: 15012, LayerPID: 15, checked: false });


        layerSource.push({ LayerName: "相關圖資", LayerID: 4, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "都市計畫使用分區", LayerID: 4002, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "門牌", LayerID: 4001, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "橋樑", LayerID: 4005, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "高架隧道", LayerID: 4007, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "鐵路", LayerID: 4006, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "道路名稱(1:5000顯示)", LayerID: 4003, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "道路範圍", LayerID: 4004, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "省道(里程數)", LayerID: 4022, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "省道", LayerID: 4018, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "縣道(里程數)", LayerID: 4023, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "縣道", LayerID: 4019, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "鄉道", LayerID: 4020, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "自行車道", LayerID: 4021, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "防汛道路", LayerID: 4024, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "水池", LayerID: 4014, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "河流_線", LayerID: 4008, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "河流_面", LayerID: 4009, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "農田水利會_圳路", LayerID: 4027, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "地面水", LayerID: 4013, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "地下水", LayerID: 4012, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "村里", LayerID: 4011, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "鄉鎮市", LayerID: 4010, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "公園綠地", LayerID: 4015, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "建築物", LayerID: 4016, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "建築區", LayerID: 4017, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "地下水井", LayerID: 14000, LayerPID: 4, checked: false });
        layerSource.push({ LayerName: "合法", LayerID: 14001, LayerPID: 14000, checked: false });
        layerSource.push({ LayerName: "非法", LayerID: 14002, LayerPID: 14000, checked: false });
        layerSource.push({ LayerName: "自來水水質水量保護區", LayerID: 4026, LayerPID: 4, checked: false });

        layerSource.push({ LayerName: "其他圖資", LayerID: 9, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "水利建造物", LayerID: 9003, LayerPID: 9, checked: false });

        layerSource.push({ LayerName: "影像圖", LayerID: 8, LayerPID: 0, checked: false });
        layerSource.push({ LayerName: "水利科航照", LayerID: 8001, LayerPID: 8, checked: false });
        layerSource.push({ LayerName: "農航所正射影像", LayerID: 8002, LayerPID: 8, checked: false });
        layerSource.push({ LayerName: "縣府委外正射影像_097", LayerID: 8003, LayerPID: 8, checked: false });
        layerSource.push({ LayerName: "縣府委外正射影像_098", LayerID: 8004, LayerPID: 8, checked: false });
        layerSource.push({ LayerName: "縣府委外正射影像_100", LayerID: 8005, LayerPID: 8, checked: false });
        layerSource.push({ LayerName: "國土測繪中心影像", LayerID: 8006, LayerPID: 8, checked: false });
    }
    var nowYear = new Date().getFullYear();
    for (var i = 0; i < layerSource.length; i++) {
        var layerID = layerSource[i].LayerID;
        if (i == 0) {
            layerSource[i].LayerHtml = layerSource[i].LayerName + "<div id='div_layerSilder' style='margin:5px 7px 3px 5px'></div>";
        }
        else if (layerID == 2003) {
            layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterSection' class='LayerBtn' onclick='aLayerFilter_onclick(1)'>篩選地段</a>";
        }
        else if (layerID == 5001) {
            layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' /><span>" + layerSource[i].LayerName + "</span>&emsp;<a id='a_filterEngYear' class='LayerBtn' onclick='aLayerFilter_onclick(2)'>篩選年度</a>&emsp;<a id='a_filterEngCity' class='LayerBtn' onclick='aLayerFilter_onclick(3)'>篩選鄉鎮</a>";
        }
        else if (layerID == 5002) {
            layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' /><span>" + layerSource[i].LayerName + "</span>&emsp;<a id='a_filterContractEngYear' class='LayerBtn' onclick='aLayerFilter_onclick(4)'>篩選年度</a>";
        }
        else if (layerID == 60121) {
            if (isWRD == "1") {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckAYear1' class='LayerBtn' onclick='aLayerFilter2_onclick(9)'>" + (nowYear - 1911) + "年度</a>";
            } else {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckAYear1' class='LayerBtn' onclick='aLayerFilter2_onclick(9)'>篩選年度</a>";
            }
        }
        else if (layerID == 60122) {
            if (isWRD == "1") {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckAYear2' class='LayerBtn' onclick='aLayerFilter2_onclick(10)'>" + (nowYear - 1911) + "年度</a>";
            } else {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckAYear2' class='LayerBtn' onclick='aLayerFilter2_onclick(10)'>篩選年度</a>";
            }
        }
        else if (layerID == 60123) {
            if (isWRD == "1") {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckAYear3' class='LayerBtn' onclick='aLayerFilter2_onclick(11)'>" + (nowYear - 1911) + "年度</a>";
            } else {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckAYear3' class='LayerBtn' onclick='aLayerFilter2_onclick(11)'>篩選年度</a>";
            }
        }
        else if (layerID == 6027) {
            if (isWRD == "1") {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='b_filterCheckYear' class='LayerBtn' onclick='aLayerFilter2_onclick(7)'>" + (nowYear - 1911) + "年度</a>";
            }
            else {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='b_filterCheckYear' class='LayerBtn' onclick='aLayerFilter2_onclick(7)'>篩選年度</a>";
            }
        }
        else if (layerID == 6028) {
            if (isWRD == "1") {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='c_filterCheckYear' class='LayerBtn' onclick='aLayerFilter2_onclick(8)'>" + (nowYear - 1911) + "年度</a>";
            } else {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='c_filterCheckYear' class='LayerBtn' onclick='aLayerFilter2_onclick(8)'>篩選年度</a>";
            }
        }
        else if (layerID == 6029) {
            if (isWRD == "1") {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckResultYear1' class='LayerBtn' onclick='aLayerFilter2_onclick(12)'>" + (nowYear - 1911) + "年度</a>";
            } else {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckResultYear1' class='LayerBtn' onclick='aLayerFilter2_onclick(12)'>篩選年度</a>";
            }
        }
        else if (layerID == 6030) {
            if (isWRD == "1") {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckResultYear2' class='LayerBtn' onclick='aLayerFilter2_onclick(13)'>" + (nowYear - 1911) + "年度</a>";
            } else {
                layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' />" + layerSource[i].LayerName + "&emsp;<a id='a_filterCheckResultYear2' class='LayerBtn' onclick='aLayerFilter2_onclick(13)'>篩選年度</a>";
            }
        }
        else if (layerID == 16000) {//工程案件
            layerSource[i].LayerHtml = layerSource[i].LayerName + "<div id='div_layerSilder' style='margin:5px 7px 3px 5px'></div>";
        }
        else {
            layerSource[i].LayerHtml = "<input class='LayerCB' type='checkbox' " + (layerSource[i].checked ? "checked" : "") + " onchange='cbLayer_onchange(this)' value='" + layerSource[i].LayerID + "' /><span>" + layerSource[i].LayerName + '</span>';
        }
    }
    return layerSource;
}
function createGridCad(d) {

    cadSource = {
        localdata: d,
        dataType: 'array',
        datafields: [
            { name: 'OBJECTID', type: 'string' },
            { name: 'Action', type: 'string' },
            { name: '鄉鎮市區名', type: 'string' },
            { name: '地段名稱', type: 'string' },
            { name: '地號', type: 'string' },
            { name: '所有人姓名', type: 'string' },
            { name: '面積', type: 'string' }
        ],
        id: 'OBJECTID'
    };
    var dataAdapter = new $.jqx.dataAdapter(cadSource);
    $("#gv_mainCad").jqxGrid(
        {
            width: 450,
            //columnsheight: 30,
            //rowsheight: 35,
            theme: 'custom',
            autoheight: true,
            enabletooltips: true,
            pageable: true,
            localization: localizationobj,
            pagermode: 'simple',
            source: dataAdapter,
            sortable: true,
            selectionmode: 'singlerow',
            columns: [
                { text: '鄉鎮市', datafield: '鄉鎮市區名', align: 'center', width: 60 },
                { text: '地段', datafield: '地段名稱', align: 'center', width: 100 },
                { text: '地號', datafield: '地號', align: 'center', cellsalign: 'center', width: 75 },
                { text: '所有人', datafield: '所有人姓名', align: 'center' },
                { text: '面積', datafield: '面積', align: 'center', cellsalign: 'right', width: 70 },
                { text: '動作', datafield: 'Action', align: 'center', cellsalign: 'center', width: 40 }
            ]
        });

}
//工程案件表格初始化
function createGridEng(d) {

    engSource = {
        localdata: d,
        dataType: 'array',
        datafields: [
            { name: 'OBJECTID', type: 'string' },
            { name: 'Action', type: 'string' },
            { name: 'proj_name', type: 'string' }//,
            //{ name: '地段名稱', type: 'string' },
            //{ name: '地號', type: 'string' },
            //{ name: '所有人姓名', type: 'string' },
            //{ name: '面積', type: 'string' }
        ],
        id: 'OBJECTID'
    };
    var dataAdapter = new $.jqx.dataAdapter(engSource);
    $("#gv_mainCad").jqxGrid(
        {
            width: 450,
            //columnsheight: 30,
            //rowsheight: 35,
            theme: 'custom',
            autoheight: true,
            enabletooltips: true,
            pageable: true,
            localization: localizationobj,
            pagermode: 'simple',
            source: dataAdapter,
            sortable: true,
            selectionmode: 'singlerow',
            columns: [
                { text: '案件名稱', datafield: 'proj_name', align: 'center', width: 410 },
                //{ text: '地段', datafield: '地段名稱', align: 'center', width: 100 },
                //{ text: '地號', datafield: '地號', align: 'center', cellsalign: 'center', width: 75 },
                //{ text: '所有人', datafield: '所有人姓名', align: 'center' },
                //{ text: '面積', datafield: '面積', align: 'center', cellsalign: 'right', width: 70 },
                { text: '動作', datafield: 'Action', align: 'center', cellsalign: 'center', width: 40 }
            ]
        });
}
//工程案件-年度
function createGridEngYear(d) {
    engYearSource = {
        localdata: d,
        dataType: 'array',
        datafields: [
            { name: 'id', type: 'string' },
            { name: 'Action', type: 'string' },
            { name: 'proj_year', type: 'string' },
            { name: 'proj_name', type: 'string' }
        ],
        id: 'id'
    };
    var dataAdapter = new $.jqx.dataAdapter(engYearSource);
    $("#gv_mainEngYear").jqxGrid(
        {
            width: 450,
            //columnsheight: 30,
            //rowsheight: 35,
            theme: 'custom',
            autoheight: true,
            enabletooltips: true,
            pageable: true,
            localization: localizationobj,
            pagermode: 'simple',
            source: dataAdapter,
            sortable: true,
            selectionmode: 'singlerow',
            columns: [
                { text: '案件名稱', datafield: 'proj_name', align: 'center', width: 70 },
                { text: '年度', datafield: 'proj_year', align: 'center', cellsalign: 'right', width: 70 },
                { text: '動作', datafield: 'Action', align: 'center', cellsalign: 'center', width: 40 }
            ]
        });

}
function cadPos_onclick(objid) {
    cadType = "";
    if (currCadLocShp.hasOwnProperty(objid)) {
        var geo = currCadLocShp[objid];
        arc.removeDrawGraphic(9999);
        arc.loadDrawGraphic([geo], 9999);
        arc.fitGeometry([geo]);
    }
}
//標示工程位置
function engPos_onclick(objid) {
    cadType = "WSBuffer";
    if (currEngLocShp.hasOwnProperty(objid)) {
        var geo = currEngLocShp[objid];
        arc.removeDrawGraphic(9999);
        arc.loadDrawGraphic([geo], 9999);
        arc.fitGeometry([geo]);
    }
}
//工程案件-年度定位
function engYearPos_onclick(objid) {
    var data = { f: "pjson", objectIds: objid, outFields: "OBJECTID", returnGeometry: true };
    var fn = function (d, geo) {
        if (d.length > 0) {
            var geodata = null;
            if (geo[objid].points != undefined) {
                //點

                geodata = arc.StringToGeometry(JSON.stringify(geo[objid]));
            } else if (geo[objid].rings != undefined) {
                //面

                geodata = arc.StringToGeometry(JSON.stringify(geo[objid]));
            } else if (geo[objid].paths != undefined) {
                //線

                geodata = arc.StringToGeometry(JSON.stringify(geo[objid]));
            }
            arc.removeDrawGraphic(9999);
            arc.loadDrawGraphic([geodata], 9999);
            arc.fitGeometry([geodata])
        }
    }
    AjaxGisQueryGeo(serviceURL + '/16101', data, fn, "工程案件-年度定位 error");
    AjaxGisQueryGeo(serviceURL + '/16102', data, fn, "工程案件-年度定位 error");
    AjaxGisQueryGeo(serviceURL + '/16103', data, fn, "工程案件-年度定位 error");
    AjaxGisQueryGeo(serviceURL + '/16201', data, fn, "工程案件-年度定位 error");
    AjaxGisQueryGeo(serviceURL + '/16202', data, fn, "工程案件-年度定位 error");
    AjaxGisQueryGeo(serviceURL + '/16203', data, fn, "工程案件-年度定位 error");
}
function getCadQueryList(objids) {
    objids = IsEmpty(objids) ? "0" : objids;

    esri.config.defaults.io.proxyUrl = proxyURL;
    esri.config.defaults.io.alwaysUseProxy = true;
    //預設套疊正射影像
    var checker = $("input[type=checkbox][value=8001]");
    if (!checker.is(":checked")) {
        checker.attr("checked", "checked");
        checker.trigger('change');
    }
    //==
    var data = { f: "pjson", outFields: "OBJECTID,鄉鎮市區名,地段名稱,地號,所有人姓名,面積", orderByFields: 'OBJECTID ASC', returnGeometry: false, returnDistinctValues: true, objectIds: objids };
    esri.request({
        url: cadUrl + "/query",
        content: data,
        callbackParamName: "callback",
        load: function (data) {
            var d = [];
            if (data != null && data.features != null) {
                for (var i = 0; i < data.features.length; i++) {
                    d.push(data.features[i].attributes);
                }
            }
            for (var i = 0; i < d.length; i++) {
                d[i]["Action"] = '<a class="FunA" onclick="cadPos_onclick(\'' + d[i].OBJECTID + '\')">選取</a>';
            }
            $("#div_resultWin").jqxWindow({ collapsed: false });
            $("#div_resultWin").jqxWindow('open');

            if (cadSource == null) createGridCad(d);
            else {
                cadSource.localdata = d;
                $("#gv_mainCad").jqxGrid('clearselection');
                $("#gv_mainCad").jqxGrid('updatebounddata', 'cells');
            }
        },
        error: esriConfig.defaults.io.errorHandler
    });
}
//工程案件 查詢
function getEngQueryList(objids, features) {
    objids = IsEmpty(objids) ? "0" : objids;
    esri.config.defaults.io.proxyUrl = proxyURL;
    esri.config.defaults.io.alwaysUseProxy = true;

    //打開工程圖層
    OpenEngLayer();
    //==
    var d = [];
    var geo = {};
    //currEngLocShp = {};

    for (var i = 0; i < features.length; i++) {
        if (features[i] != null && features[i].attributes != null) {
            //設定選取按鈕
            features[i].attributes.Action = '<a class="FunA" onclick="engPos_onclick(\'' + features[i].attributes.OBJECTID + '\',' + features[i].attributes.proj_isend + ',\'' + features[i].g.Type + '\')">選取</a>';
            d.push(features[i].attributes);

            var objID = features[i].attributes.OBJECTID == 0 ? features[i].attributes.OBJECTID_1 : features[i].attributes.OBJECTID;
            if (features[i].g.type == "multipoint") {
                geo[objID] = features[i].g.points;
                currEngLocShp[objID] = arc.StringToGeometry('{"x":' + features[i].g.points[0][0] + ',"y":' + features[i].g.points[0][1] + '}');
            } else if (features[i].g.type == "polyline") {
                geo[objID] = features[i].g;
                currEngLocShp[objID] = arc.StringToGeometry(JSON.stringify(geo[objID]));
            } else if (features[i].g.type == "polygon") {
                geo[objID] = features[i].g;
                currEngLocShp[objID] = arc.StringToGeometry(JSON.stringify(geo[objID]));
            }
        }
    }

    $("#div_resultWin").jqxWindow({ collapsed: false });
    $("#div_resultWin").jqxWindow('open');

    if (d.length > 0) {
        if (engSource == null) createGridEng(d);
        else {
            for (var i in d) {
                engSource.localdata.push(d[i]);
            }
        }
    }
    $("#gv_mainCad").jqxGrid('clearselection');
    $("#gv_mainCad").jqxGrid('updatebounddata', 'cells');
}
//工程管理-年度
function QueryEngYear() {
    var year = $('#sel_EngYear').val();
    var data = { 'proj_year_s': year, 'proj_year_e': year };
    engSource = null;
    //打開工程圖層
    OpenEngLayer();
    if (year != '') {
        var fn = function (d) {

            for (var i = 0; i < d.length; i++) {
                d[i].Action = '<a class="FunA" onclick="engYearPos_onclick(\'' + d[i].id + '\')">選取</a>';
            }

            $("#div_EngYearWin").jqxWindow({ collapsed: false });
            $("#div_EngYearWin").jqxWindow('open');

            if (d.length > 0) {
                if (engSource == null) createGridEngYear(d);
                else {
                    for (var i in d) {
                        engSource.localdata.push(d[i]);
                    }
                }
            }
            $("#gv_mainEngYear").jqxGrid('clearselection');
            $("#gv_mainEngYear").jqxGrid('updatebounddata', 'cells');
        }

        //送出資料
        AjaxJson(_MainPrjUrl, { postdata: data }, fn);
    } else {
        alert('請選擇年度')
    }
}


//工程案件-查詢-村里
function btnEngVillage_onclick() {
    var Village = $('#selEngVillage').val();
    if (Village != '') {
        var data = { f: "pjson", where: 'OBJECTID=\'' + Village + '\'', outFields: "OBJECTID", returnGeometry: true };
        engSource = null;
        //打開工程圖層
        OpenEngLayer();
        var fn = function (d, geo) {
            var id = d[0].OBJECTID;
            if (geo[id].rings != undefined) {
                var anaData = "POLYGON";
                anaData += "(";
                for (var i in geo[id].rings) {
                    anaData += "(";
                    for (var j in geo[id].rings[i]) {
                        anaData += geo[id].rings[i][j][0];
                        anaData += " ";
                        anaData += geo[id].rings[i][j][1];
                        anaData += ",";
                    }
                    //去除逗點
                    anaData = anaData.substring(0, anaData.length - 1);
                    anaData += "),";
                }
                //去除逗點
                anaData = anaData.substring(0, anaData.length - 1);

                anaData += ")";
            } else if (geo[id].polyline != undefined) {
                var anaData = "LINESTRING";
                for (var i in geo[id].paths) {
                    anaData += "(";
                    for (var j in geo[id].paths[i]) {
                        anaData += geo[id].paths[i][j][0];
                        anaData += " ";
                        anaData += geo[id].paths[i][j][1];
                        anaData += ",";
                    }
                    //去除逗點
                    anaData = anaData.substring(0, anaData.length - 1);
                    anaData += "),";
                }
                //去除逗點
                anaData = anaData.substring(0, anaData.length - 1);
            } else if (geo[id].point != undefined) {
                var anaData = "POINT";
                anaData += "(";
                anaData += geo[id].x;
                anaData += " ";
                anaData += geo[id].y;
                anaData += ")";
            }

            data = { "Geo": anaData, "proj_isend": $("#selEngType").val() }
            var fn2 = function (d) {
                for (var i = 0; i < d.length; i++) {
                    d[i].Action = '<a class="FunA" onclick="engYearPos_onclick(\'' + d[i].id + '\')">選取</a>';
                }

                $("#div_EngYearWin").jqxWindow({ collapsed: false });
                $("#div_EngYearWin").jqxWindow('open');

                if (d.length > 0) {
                    if (engSource == null) createGridEngYear(d);
                    else {
                        for (var i in d) {
                            engSource.localdata.push(d[i]);
                        }
                    }
                }
                $("#gv_mainEngYear").jqxGrid('clearselection');
                $("#gv_mainEngYear").jqxGrid('updatebounddata', 'cells');
            }

            var SQLQueryData = null;
            //查詢
            AjaxJson(EngByGeoUrl, data, fn2, "工程案件分析發生錯誤", false);
        }
        AjaxGisQueryGeo(serviceURL + '/4011', data, fn, '工程案件-村里-查詢')

    }
    else {
        alert('請選擇村里');
    }
}
//#endregion

//#region 頁面初始
function MapLayer_init() {
    if (canDrag) {
        $('#div_drag').show();
        $('#div_drag').jqxDragDrop({
            appendTo: 'body',
            feedback: 'original',
            onDrag: function (data, pos) {
                $('#div_mapLayer').css({ left: pos.left, top: pos.top });
            }
        });
    }

    var intBrowserW = 0;
    if (document.documentElement) {
        intBrowserW = document.documentElement.clientWidth;
    } else {
        intBrowserW = document.body.clientWidth;
    }
    if (intBrowserW < 1330) {
        var diff = intBrowserW - $(".Map_bg").width();
        $(".Map_RightContent_bg").css("right", (diff - 318) + 'px');
    }


    var y = ($(window).height() - 390) / 2;
    $("#div_resultWin,#div_EngYearWin").jqxWindow({
        showCollapseButton: true,
        autoOpen: false,
        height: 390,
        width: 480,
        position: { x: 20, y: y },
        resizable: false,
        dragArea: {
            left: -400,
            top: 60,
            width: 1750,
            height: $(window).height() - 60
        }
    });
    $("#div_resultWin,#div_EngYearWin").on('close', function () { arc.removeDrawGraphic(9999); })
    //Tab1
    _MapLayer_initTab1();

    //Tab2
    _MapLayer_initTab2();

    //Tab3
    _MapLayer_initTab3();

    //工程案件-村里-鄉鎮
    LoadEngTown();
    isPanelInit = true;
}
function _MapLayer_initTab1() {
    createMapLayerUI();
    $("input[name=PosType][value=97]").trigger('change');

    //篩選定義圖層UI
    var offset = $(".Map_content").width() - 290;
    $("#div_filterLayer").jqxPopover(GetMapPopSetting("", offset, 290, 50, $("#div_popover"), -99999, 180));
    $("#div_filterLayer2").jqxPopover(GetMapPopSetting("", offset, 290, 110, $("#div_popover"), -99999, 180));

    //地藉鄉鎮
    var data = { f: "pjson", where: "1=1", outFields: "鄉鎮市代碼, 鄉鎮市區名", returnGeometry: false, returnDistinctValues: true, orderByFields: '鄉鎮市區名 ASC' };
    var fn = function (d) {
        buildSelectText2(d, "sel_filterCity", "1", { text: '鄉鎮市區名', value: '鄉鎮市代碼' });
    }
    AjaxGisQuery(cadUrl, data, fn, "get selfilterCity error");

    //年度 鄉鎮
    var data = { f: "pjson", where: "YEAR<>0 and CITY<>''", outFields: "YEAR, CITY", returnGeometry: false, returnDistinctValues: true, orderByFields: 'YEAR ASC,CITY ASC' };
    var fn = function (d) {
        var yr = [];
        var city = [];
        for (var i = 0; i < d.length; i++) {
            if (yr.indexOf(d[i]["YEAR"]) < 0) yr.push(d[i]["YEAR"]);
            if (city.indexOf(d[i]["CITY"]) < 0) city.push(d[i]["CITY"]);
        }
        yr.sort();
        city.sort();
        var selyr, selcity;
        selyr = selcity = "<option value=''>請選擇</option>";
        for (var i = 0; i < yr.length; i++) {
            selyr += "<option>" + yr[i] + "</option>";
        }
        for (var i = 0; i < city.length; i++) {
            selcity += "<option>" + city[i] + "</option>";
        }
        $("#sel_filterEngYear").html(selyr);
        $("#sel_filterEngCity").html(selcity);
    }
    AjaxGisQuery(postUrl, data, fn, "get selfilterEng error");

    //
    var data = { f: "pjson", where: "Year<>'0'", outFields: "Year", returnGeometry: false, returnDistinctValues: true };
    var fn = function (d) {
        var yr = [];
        var city = [];
        for (var i = 0; i < d.length; i++) {
            if (yr.indexOf(d[i]["Year"]) < 0) yr.push(d[i]["Year"]);

        }
        yr.sort();
        var selyr
        selyr = selcity = "<option value=''>請選擇</option>";
        for (var i = 0; i < yr.length; i++) {
            selyr += "<option>" + yr[i] + "</option>";
        }
        $("#sel_filterContractEngYear").html(selyr);
    }
    AjaxGisQuery(postContractUrl, data, fn, "get selfilterEng error");

    // 護岸年度篩選來源設定 sam add
    var data = { f: "pjson", where: "T06<>''", outFields: "T06", returnGeometry: false, returnDistinctValues: true };
    var fn = function (d) {
        var yr = [];
        var city = [];
        for (var i = 0; i < d.length; i++) {
            if (yr.indexOf(d[i]["T06"].substring(0, 3)) < 0) yr.push(d[i]["T06"].substring(0, 3));
        }
        yr.sort();
        var selyr

        //2019-4-19 by jay 帳號設定的單位為水利署只能看到107年的選項
        if (isWRD == "1") {
            selyr += "<option>107</option>";
        }
        else {
            selyr = selcity = "<option value=''>請選擇</option>";
            for (var i = 0; i < yr.length; i++) { selyr += "<option>" + yr[i] + "</option>"; }
        }


        $("#sel_filterCheckAYear").html(selyr);
        $("#sel_filterCheckBYear").html(selyr);
        $("#sel_filterCheckCYear").html(selyr);
        $("#sel_filterCheckAYear2").html(selyr);
    }
    //debugger;
    AjaxGisQuery(postCheckAUrl, data, fn, "get selfilterEng error");

}
function _MapLayer_initTab2() {
    var data = { f: "pjson", where: "1=1", outFields: "鄉鎮市代碼,鄉鎮市區名", returnGeometry: false, returnDistinctValues: true };
    var fn = function (d) {
        buildSelectText2(d, "sel_cityCad", "1", { text: '鄉鎮市區名', value: '鄉鎮市代碼' });
    }
    AjaxGisQuery(cadUrl, data, fn, "get selcity error");

    var data2 = { mark: { QueryType: "1" } };
    var fn2 = function (d) {
        buildSelectText2(d, "sel_areaCad", "1", { text: 'Town', value: 'Town_id' });
    }
    AjaxJson(landmarkUrl, data2, fn2, "get selarea error");
    //-------------------------- 流域下拉初始化 -------------------------
    var data3_2 = { f: "pjson", where: "1=1", outFields: "流域", returnGeometry: false, returnDistinctValues: false, orderByFields: '流域' };
    var origin = [];

    var 縣管河川_權管範圍 = AjaxGisGet(serviceURL + "/11004", data3_2, "縣管河川_權管範圍發生錯誤。");
    var 區域排水_權管範圍 = AjaxGisGet(serviceURL + "/12002", data3_2, "區域排水_權管範圍發生錯誤。");

    var obj = {};
    //利用物件特性過濾重複的資料
    for (var i = 0; i < 縣管河川_權管範圍.length; i++) {
        obj[縣管河川_權管範圍[i][data3_2.outFields]] = "";
    }
    for (var i = 0; i < 區域排水_權管範圍.length; i++) {
        obj[區域排水_權管範圍[i][data3_2.outFields]] = "";
    }

    for (var item in obj) {
        origin.push(item);
    }
    origin.push("野溪");

    buildSelectTextByArray(origin, "sel_Watershed", "1");
    //-----------------------------------------------------------------
    uploadShpFile_oninit();
    uploadKmlFile_oninit();
}
function _MapLayer_initTab3() {
    var data = { f: "pjson", where: "YEAR <> 0", outFields: "YEAR", returnGeometry: false, returnDistinctValues: true };
    var fn = function (d) {
        buildSelectTextNoValue2(d, "sel_year", "1", { text: 'YEAR' });
    }
    AjaxGisQuery(postUrl, data, fn, "EngPos init error");

    var data2 = { mark: { QueryType: "1" } };
    var fn2 = function (d) {
        buildSelectText2(d, "sel_lmcity", "1", { text: 'Town', value: 'Town_id' });
    }
    AjaxJson(landmarkUrl, data2, fn2, "get selarea error");
}
//工程案件-村里-鄉鎮
function LoadEngTown() {
    var data = { f: "pjson", where: '1=1', outFields: "TOWNNAME, TOWNID", returnGeometry: false, returnDistinctValues: true };
    var fn = function (d) {
        buildSelectText2(d, "selEngTown", "1", { text: 'TOWNNAME', value: 'TOWNID' });
        //註冊change事件
        $('#selEngTown').on('change', function () { LoadEngVillage() }).change();
    }

    AjaxGisQuery(serviceURL + '/4010', data, fn, '工程案件-村里-鄉鎮')
}
//工程案件-村里-村里
function LoadEngVillage() {
    var TOWNID = $('#selEngTown').val();
    if (TOWNID != '') {
        var whereStr = 'TOWNID=\'' + TOWNID + '\''
        var data = { f: "pjson", where: whereStr, outFields: "OBJECTID, VILLNAME", returnGeometry: false, returnDistinctValues: true };
        var fn = function (d) {
            buildSelectText2(d, "selEngVillage", "1", { text: 'VILLNAME', value: 'OBJECTID' });
        }
        AjaxGisQuery(serviceURL + '/4011', data, fn, '工程案件-村里-村里')
    } else {
        $('#selEngVillage').html('<option value="">請選擇鄉鎮</option>');
    }
}
//切換工程案件與地籍宗
function onchange_selFencType() {
    var selVal = $("#selFencType").val();
    if (selVal == 1) {
        $(".eng-class").show();
    }
    else {
        $(".eng-class").hide();
    }
}

function JsonGeoToSQLPolygon(Geo) {
    var Polyg = " ((";
    for (var i = 0; i < Geo.length; i++) {
        var pos = Geo[i];
        Polyg += geo[i][0] + " " + geo[i][1] + ",";
    }
    Polyg = Polyg.substr(0, Polyg.length - 1) + "))";
    return data;
}
function JsonGeoToSQLLinestring(Geo) {
    var Lineg = " (";
    for (var i = 0; i < Geo.length; i++) {
        var pos = Geo[i];
        Lineg += geo[i][0] + " " + geo[i][1] + ",";
    }
    Lineg = Lineg.substr(0, Lineg.length - 1) + ")";
    return data;
}
function JsonGeoToSQLPoint(Geo) {

}
//#endregion

$(document).ready(function () {
    MapLayer_init();
})
