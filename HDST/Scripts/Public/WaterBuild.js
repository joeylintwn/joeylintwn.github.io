﻿
//#region FormData
var PoxyUrl = 'https://wra.e-land.gov.tw/proxy/proxy.ashx?';
/* 
    取得FormData
    formID: 包住整個要取model的所有物件之區塊 div id..
    getType: 目前分三種

    Model(單一物件)
    List(字串陣列)
    ListModel(物件list..使用listName)
    listName: 若getType=ListModel時..用以指示list屬性名稱...未指定則表示整個model為list
*/
function btnLogout_onclick() {
    window.location = '../HSDS/Logout';
}

function btnGoIndex_onclick() {
    window.location="Index.html"
}

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
                    if ($(obj).attr("checked") == "checked") {
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

//json格式轉SQLGeo
function JsonToSQLGeo(JsonStr) {
    debugger
    var geo = JSON.parse(JsonStr)
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
    return anaData
}


var map, tb
var MemoList = [];
var GetPosition = [];
//打開地圖
function OpenMap() {
    var divtag = $('#map')
    if (divtag.html() == '') {
        LoadMap();
    }

    $('#map-block').show();
    $('html').css('overflow-y', 'hidden');
}

function LoadMap() {
    initMap();

    //地圖-確定按鈕
    $("#map-close").on("click", function () {
        //把暫存的資料儲存到資料清單
        for (var i in MemoList) {
            GetPosition.push(MemoList[i]);
        }

        GetMapPosition();

        //清除現有的圖形
        var clearMap = map.getLayer("案件圖層")
        if (clearMap != undefined) {
            clearMap.clear();
        }
        MemoList = [];
        $('html').css('overflow-y', 'auto');
    });

    //地圖-取消按鈕
    $("#map-cancel").on("click", function () {
        debugger
        //復原原始網頁
        $("body").css("overflow", "auto");
        //關閉地圖
        $("#map-block").hide();
        //清除現有的圖形
        var clearMap = map.getLayer("案件圖層")
        if (clearMap != undefined) {
            clearMap.clear();
        }
        //清除暫存資料
        MemoList = [];
        $('html').css('overflow-y', 'auto');
        //關閉表單
        //$('#jqxwindow').jqxWindow('close');
    });

}

//地圖點選相關
function GetMapPosition() {
    $("body").css("overflow", "auto");//復原原始網頁
    $("#map-block").hide();//關閉地圖
    var tabStr = "";
    for (var i = 0; i < GetPosition.length; i++) {
        if (GetPosition[i] == null) { continue; }

        var _datas = GetPosition[i];
        //產生按鈕
        tabStr += addPositionBtn(_datas, "點位" + (i + 1));
    }
    $("#Position").html(tabStr);
}

//標案位置按鈕
function addPositionBtn(data, btnName) {
    var str = "";
    //區塊
    str += "<div class='btn-group btn-box'>"; //開始-包覆按鈕組的容器
    str += "<div class='btn btn-primary btn-sm position' title='" + JSON.stringify(data) + "'  '>";
    str += '<input type="hidden" value="' + data.x + '" name="x">';
    str += '<input type="hidden" value="' + data.y + '" name="y">';
    str += btnName;
    str += "</div>";
    str += '<div class="btn btn-danger btn-sm mr-1"  onclick="DeletePositionBtn(this)"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z" /><path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z" /></svg ></div>';//刪除的小按鈕
    str += "</div>";//結束-包覆按鈕組的容器
    return str;


}

//刪除標案位址按鈕
function DeletePositionBtn(_this) {
    $(_this).parent().remove();
}

//地圖初始化
function initMap() {
    require([
        "esri/map", "esri/toolbars/draw", "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol",
        "esri/graphic", "esri/geometry/Point", "esri/SpatialReference",
        "esri/Color", "dojo/dom", "dojo/on", "esri/InfoTemplate",
        "esri/layers/GraphicsLayer", "dojo/domReady!"
    ], function (
        Map, Draw, ArcGISTiledMapServiceLayer,
        SimpleMarkerSymbol, SimpleFillSymbol,
        Graphic, Point, SpatialReference,
        Color, dom, on, InfoTemplate,
        GraphicsLayer
    ) {
            map = new Map("map", { logo: false });

            map.on("load", initToolbar);

            var tiled = new ArcGISTiledMapServiceLayer(PoxyUrl + "http://210.69.148.40/ArcGIS/rest/services/YiLanTerrain_3826_2013_20141231/MapServer/", {
                displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            });
            map.addLayer(tiled);

            var mapcenterPoint = new Point(318781.93468763, 2729999.40020877, new SpatialReference({ wkid: 102443 }));
            map.centerAndZoom(mapcenterPoint, 7);

            //點
            var markerSymbol = new SimpleMarkerSymbol();
            markerSymbol.setPath("M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z");

            markerSymbol.setColor(new Color([230, 0, 0, 0.77]));
            markerSymbol.setStyle(SimpleMarkerSymbol.STYLE_PATH);
            markerSymbol.setSize(26);

            function initToolbar() {
                tb = new Draw(map);
                tb.on("draw-end", addGraphic);

                // 事件委託，因此每個單獨的按鈕不需要點擊處理程序
                on(dom.byId("CreatPosition"), "click", function (evt) {
                    var tool = "multipoint";
                    //map.disableMapNavigation();//允許滑鼠拉動或縮放地圖

                    tb.activate(tool);
                });
            }

            function addGraphic(evt) {
                //停用工具欄並清除現有的圖形
                tb.deactivate();
                //map.enableMapNavigation();//禁止滑鼠拉動或縮放地圖

                // 找出要使用的符號
                var symbol;
                var _GraphicsLayer;
                if (evt.geometry.type === "multipoint") {
                    //畫點
                    symbol = markerSymbol;

                    var queryLayer = map.getLayer('案件圖層');

                    //建立GraphicsLayer
                    if (map.getLayer('案件圖層') != undefined && queryLayer != null) {
                        _GraphicsLayer = queryLayer;
                    } else {
                        _GraphicsLayer = new GraphicsLayer();
                    }

                    for (var i = 0; i < evt.geometry.points.length; i++) {
                        var XYObj = new Object();
                        XYObj.type = evt.geometry.type;
                        XYObj.x = evt.geometry.points[i][0];
                        XYObj.y = evt.geometry.points[i][1];
                        GetPosition.push(XYObj);
                        var _point = new Point(evt.geometry.points[i][0], evt.geometry.points[i][1]);
                        //新增一個點
                        _GraphicsLayer.add(new Graphic(_point, symbol));
                    }

                    map.addLayer(_GraphicsLayer);
                }
            }
        });
}

