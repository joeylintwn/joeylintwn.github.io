var map, tb
var MemoList = [];
var GetPosition = [];
var PoxyUrl = 'https://wra.e-land.gov.tw/proxy/proxy.ashx?';

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
    str += "<div class='btn btn-primary position' title='" + JSON.stringify(data) + "'  '>";
    str += '<input type="hidden" value="' + data.x + '" name="x">';
    str += '<input type="hidden" value="' + data.y + '" name="y">';
    str += btnName;
    str += "</div>";
    str += '<div class="btn btn-primary glyphicon glyphicon-remove" style="padding:9px;margin-top:-1px;" onclick="DeletePositionBtn(this)"></div>';//刪除的小按鈕
    str += "</div>";//結束-包覆按鈕組的容器
    return str;
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

