var jsMin = document.scripts[document.scripts.length - 1].src.indexOf(".min.js") > 0 ? ".min" : "";

function initMap(map) {
    map.Layers = [];
    $.getScript(HostUrl +"Scripts/ArcGIS/XDCustDrawlayer" + jsMin + ".js", function () {

        map.CustDrawLayer = new XDCustDrawLayer(map, "cust");
    });

    $.getScript(HostUrl + "Scripts/ArcGIS/wkt-arcgis" + jsMin + ".js");
    $.getScript(HostUrl + "Scripts/ArcGIS/jsonConverters" + jsMin + ".js");

    $.getScript(HostUrl + "Scripts/ArcGIS/Measure" + jsMin + ".js", function () {
        map.DrawTool = new MeasureInit();
    });

    map.getGraphicsLayer = function (GLayerName) {
        var gl;

        if (map.getLayer(GLayerName) != null) {
            gl = map.getLayer(GLayerName);

        }
        else {
            gl = new esri.layers.GraphicsLayer({
                id: GLayerName, "opacity": 1
            });
            map.addLayer(gl);
        }
        return gl;
    }
    //從config增加圖

    map.addLayersFromConfig = function (configUrl) {
        $.ajax({
            url: configUrl, type: 'GET',
            dataType: 'xml', //資料型態可以不設定，且此型態不可是text或html
            timeout: 1000,
            error: function (xml) {
                //alert('讀取xml錯誤' + xml); //當xml讀取失敗

                console.log('讀取xml錯誤' + xml);
                location.reload();
            },
            ajaxError: function (xml) {
                console.log('ajaxError');
            },
            success: function (xml) {
                //alert('AAA');
                //debugger;
                var obj = xmlToJson(xml);
                map.Parameters = obj.Parameters;
                for (i in obj.Parameters.LayerItems.Item) {
                    var maplayer = obj.Parameters.LayerItems;
                    var MapData = obj.Parameters.LayerItems.Item[i];

                    if (MapData.Type['#text'] == "TiledLayer") {
                        var URLdata = MapData.URL['#text'].split("MapServer/")
                        var FL = new esri.layers.ArcGISTiledMapServiceLayer(MapData.URL['#text'], {
                            id: MapData.ID['#text']
                        });
                        //FL.setVisibleLayers([Number(URLdata[1])]);
                        FL.setVisibility(false);
                        FL.name = MapData.ID['#text'];
                        map.addLayer(FL);
                    } else if (MapData.Type['#text'] == "DynamicLayer" || MapData.Type['#text'] == "FeatureLayer") {

                        var URLdata = MapData.URL['#text'].split("MapServer/")
                        var FL = new esri.layers.ArcGISDynamicMapServiceLayer(URLdata[0] + 'MapServer',
                            {
                                id: MapData.ID['#text']
                            });
                        FL.setVisibleLayers([Number(URLdata[1])]);
                        FL.setVisibility(false);
                        FL.name = MapData.ID['#text'];
                        var idenurl = FL.url;
                        FL.IdentifyTask = new esri.tasks.IdentifyTask(idenurl);
                        map.addLayer(FL);
                    }
                }
                var wParent = window.parent;
                if (wParent.onMapOpened != undefined) {
                    wParent.onMapOpened(map);
                }
            }, complete: function (xml) {
                //console.log('run complete');
            }
        }); // end of ajax

    }
    map.addWMTSLayer = function (url, layers, ShowName, isShow, callback) {
        $.getScript("./ARCGIS/XDWMTSLayer.js", function () {
            var custLayer = new XDWMTSLayer(url, layers);
            custLayer.id = ShowName;
            map.addLayer(custLayer);
            custLayer.setVisibility(isShow);
            var linfo = {
                LayerName: ShowName,
                isShow: isShow,
                baseLayer: custLayer,
                LayerID: custLayer.id,
                isSelectable: false
            };



            linfo.GeoType = 100; //代表為群組圖層
            linfo.setShow = function (Display) {
                this.isShow = Display;
                this.baseLayer.setVisibility(Display);
            }
            linfo.isTile = true;

            map.Layers.push(linfo);

            if (callback != null) callback();
            return linfo;
        });



    }

    map.addArcGISTileLayer = function (agoServiceURL, LName, isShow, Token, callback) {

        var agoLayer = new esri.layers.ArcGISTiledMapServiceLayer(agoServiceURL);

        agoLayer.name = LName;
        agoLayer.id = LName;
        agoLayer.setVisibility(isShow);

        var linfo = {
            LayerName: agoLayer.name,
            isShow: isShow,
            baseLayer: agoLayer,
            LayerID: agoLayer.id,
            isSelectable: false
        };


        linfo.GeoType = 100; //代表為群組圖層
        linfo.setShow = function (Display) {
            this.isShow = Display;
            this.baseLayer.setVisibility(Display);
        }
        linfo.isTile = true;

        map.Layers.push(linfo);

        map.addLayer(agoLayer);
        if (callback != null) callback();
        return linfo;
    }

    //Feature Layer
    map.addArcGISFeatureLayer = function (url, LName,grouplayer, isShow, Token, epsg, callback) {
        //console.log("AAA");
        //debugger;
        var layer = new esri.layers.FeatureLayer(url,
            {
                id: LName,
                outFields: ["*"],
            });
        //   FL.setVisibleLayers([0, 1]);//預設打開的圖層
        //layer.styling = true;
        layer.setVisibility(isShow);
        layer.name = LName;
        if (LName == "水門" || LName == "都市計畫使用分區" || LName == "道路名稱(1:5000顯示)" || LName == "門牌" || LName == "村里" || LName == "鄉鎮市" || LName == "臨時安全" || LName =="露頭點位") {
            var Param;
            switch (LName) {
                case "露頭點位":
                    Param ="{名稱}{編號}"
                    break;
                case "水門":
                    Param = "{Name}";
                    break;
                case "都市計畫使用分區":
                    Param = "{Use_}";
                    break;
                case "道路名稱(1:5000顯示)":
                    Param = "{ROADNAME}";
                    break;
                case "門牌":
                    Param = "{ADDRESSALL}";
                    break;
                case "村里":
                    Param = "{VILLNAME}";
                    break;
                case "鄉鎮市":
                    Param = "{TOWNNAME}";
                    break;
                case "臨時安全":
                    Param = "{RV_NAME}{PILE_NO}";
                    break;
            }
            var statesColor = new esri.Color("#000000");
            var statesLabel = new esri.symbol.TextSymbol().setColor(statesColor);
            statesLabel.font.setSize("15pt");
            statesLabel.font.setFamily("Microsoft JhengHei");
            var json = {
                "labelExpressionInfo": { "value": Param }
            };
            var labelClass = new esri.layers.LabelClass(json);
            labelClass.symbol = statesLabel; // symbol also can be set in LabelClass' json
            layer.setLabelingInfo([labelClass]);
            map.addLayer(layer);
        }
        else {
            map.addLayer(layer);
        }
        var linfo = {
            LayerName: layer.name,
            isShow: layer.visible,
            baseLayer: layer,
            LayerID: layer.id,
            GroupLayer: grouplayer,
            isTile: true
        };
        map.Layers.push(linfo);
        linfo.setShow = function (Display) {
            this.isShow = Display;
            this.baseLayer.setVisibility(Display);
        }
        layer.on("load", function () {
            $.getJSON(url + "?f=pjson", function (results) {
                //debugger;
                //console.log(results.drawingInfo.renderer.symbol.imageData);
                var imageData;
                try {
                    imageData = results.drawingInfo.renderer.symbol.imageData;
                }
                catch (ex) {

                }
                linfo.icon = imageData;
                if (callback != null && callback != "") callback();
            });
        })
        return linfo;
    }

    map.addArcGISFeatureLayer2 = function (url, LName, grouplayer,id1, isShow, Token, epsg, callback) {
        //debugger;
        var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url);
        var visibleLayerIds = [];
        visibleLayerIds.push(id1);
        
        //   FL.setVisibleLayers([0, 1]);//預設打開的圖層

        layer.setVisibility(isShow);
        layer.name = LName;
        map.addLayer(layer);
        layer.setVisibleLayers(visibleLayerIds);
        
        var linfo = {
            LayerName: layer.name,
            isShow: layer.visible,
            baseLayer: layer,
            LayerID: layer.id,
            GroupLayer: grouplayer,
            isTile: true
        };
        map.Layers.push(linfo);
        linfo.setShow = function (Display) {
            this.isShow = Display;
            this.baseLayer.setVisibility(Display);
        }
        layer.on("load", function () {
            $.getJSON(url + "?f=pjson", function (results) {
                //debugger;
                //console.log(results.drawingInfo.renderer.symbol.imageData);
                var imageData;
                try {
                    imageData = results.drawingInfo.renderer.symbol.imageData;
                }
                catch (ex) {

                }
                linfo.icon = imageData;
                if (callback != null && callback != "") callback();
            });
        })
        return linfo;
    }
    var url = "https://wragis.e-land.gov.tw/arcgis/rest/services/HDST_m_1070717/MapServer";

    var imgurl = "https://wragis.e-land.gov.tw/arcgis/rest/services/HDST/Raster/MapServer";

    map.addArcGISLayer = function (url, LName, isShow, Token, epsg, callback) {
        //console.log("BBB");
        //console.log(url);
        //console.log("AAA");
        //地籍圖 
        map.addArcGISFeatureLayer(url + "/2003","地籍圖", "地籍圖", false, "", "","");
        map.addArcGISFeatureLayer(url + "/2004", "土地段別圖","地籍圖", false, "", "");
        ////中央管河川

        map.addArcGISFeatureLayer(url + "/10001", "中央管河川-權管範圍", "中央管河川", false, "", "");
        map.addArcGISFeatureLayer(url + "/10002", "中央管河川-河川區域","中央管河川", false, "", "");
        ////縣管河川
        map.addArcGISFeatureLayer(url + "/11001", "縣管河川-河川起訖點","縣管河川", false, "", "");
        map.addArcGISFeatureLayer(url + "/11002", "水道治理計畫線","縣管河川", false, "", "");
        map.addArcGISFeatureLayer(url + "/11003", "用地範圍線","縣管河川", false, "", "");
        map.addArcGISFeatureLayer(url + "/11004", "縣管河川權管範圍","縣管河川", false, "", "");
        map.addArcGISFeatureLayer(url + "/11005", "縣管河川-河川區域","縣管河川", false, "", "");
        ////區域排水 
        map.addArcGISFeatureLayer(url + "/12001", "區域排水-河川起訖點","區域排水", false, "", "");
        map.addArcGISFeatureLayer(url + "/12002", "權管範圍 ","區域排水", false, "", "");
        ////水利設施
        map.addArcGISFeatureLayer(url + "/3001", "水門","水利設施", false, "", "");
        map.addArcGISFeatureLayer(url + "/3002", "抽水站","水利設施", false, "", "");
        map.addArcGISFeatureLayer(url + "/3007", "抽水站範圍圖","水利設施", false, "", "");
        map.addArcGISFeatureLayer(url + "/3004", "河堤","水利設施", false, "", "");
        ////水利普查 
        map.addArcGISFeatureLayer(url + "/6001", "變異點圖","水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6002", "斷面樁","水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6003", "河川斷面線","水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6024", "流量","水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6006", "防洪缺口", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6007", "制水門", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6009", "橋梁", "水利普查", false, "", "");
        //map.addArcGISFeatureLayer(url + "/6026", "側溝", "水利普查", false, "", "");
        map.addArcGISFeatureLayer2(url, "側溝", "水利普查", 6026, false, "", "");
        map.addArcGISFeatureLayer(url + "/6010", "自設河川斷面", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6012", "護岸巡查成果", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6022", "攔汙網線", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6018", "攔汙網", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6023", "竹筏", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6008", "植栽", "水利普查", false, "", "");
        //map.addArcGISFeatureLayer(url + "/6013", "電纜線(含台灣固網)", "水利普查", false, "", "");
        map.addArcGISFeatureLayer2(url, "電纜線(含台灣固網)", "水利普查", 6013, false, "", "");
        map.addArcGISFeatureLayer(url + "/6016", "電纜線位置", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6025", "防汛道路警告牌調查_1070214", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6014", "高速公路下方積淹調查成果", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6015", "布袋蓮", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6017", "布袋蓮位置", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6020", "垃圾熱點位置", "水利普查", false, "", "");
        map.addArcGISFeatureLayer(url + "/6021", "羅東攔河堰集水區", "水利普查", false, "", "");
        ////水利新建及修繕

        map.addArcGISFeatureLayer(url + "/5001", "工程", "水利新建及修繕", false, "", "");
        map.addArcGISFeatureLayer(url + "/5002", "開口合約工程", "水利新建及修繕", false, "", "");
        map.addArcGISFeatureLayer(url + "/5003", "復建工程", "水利新建及修繕", false, "", "");
        map.addArcGISFeatureLayer(url + "/5004", "臨時安全", "水利新建及修繕", false, "", "");
        ////防災圖資 
        //map.addArcGISFeatureLayer2 = function (url, LName, isShow, Token, epsg, callback)
        map.addArcGISFeatureLayer2(url, "低窪地區","防災圖資",13008, false, "", "");
        map.addArcGISFeatureLayer(url + "/13005", "歷史淹水區域", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13021", "200淹水潛勢圖(99年公告)", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13022", "350淹水潛勢圖(99年公告)", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13023", "450淹水潛勢圖(99年公告)", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13024", "600淹水潛勢圖(99年公告)", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13011", "2004年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13012", "2007年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13013", "2008年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13014", "2009年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13015", "2010年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13016", "2011年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13017", "2012年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13018", "2013年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13019", "2015年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13020", "2016年", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13002", "移動抽水機預佈位置", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13006", "自主防災社區推動範圍", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13007", "社區回饋歷史淹水範圍", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13003", "水尺", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13009", "宜蘭縣水位站", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/13010", "宜蘭縣CCTV", "防災圖資", false, "", "");
        //map.addArcGISFeatureLayer(url + "/13004", "自主防災社區避難路線", "防災圖資", false, "", "");
        map.addArcGISFeatureLayer2(url, "自主防災社區避難路線", "防災圖資", 13004, false, "", "");
        map.addArcGISFeatureLayer(url + "/13001", "避難地點", "防災圖資", false, "", "");
        ////溫泉圖資
        map.addArcGISFeatureLayer(url + "/7002", "露頭點位", "溫泉圖資", false, "", "");
        //map.addArcGISFeatureLayer(url + "/7003", "露頭範圍", "溫泉圖資", false, "", "");
        map.addArcGISFeatureLayer2(url, "露頭範圍", "溫泉圖資", 7003, false, "", "");
        map.addArcGISFeatureLayer(url + "/7005", "監測井", "溫泉圖資", false, "", "");
       // map.addArcGISFeatureLayer(url + "/7004", "水權", "溫泉圖資", false, "", "");
        map.addArcGISFeatureLayer2(url, "水權", "溫泉圖資", 7004, false, "", "");
        map.addArcGISFeatureLayer(url + "/7001", "宜蘭溫泉區", "溫泉圖資", false, "", "");
        ////水保圖資
        map.addArcGISFeatureLayer(url + "/15008", "簡易水土保持申報書", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15009", "水土保持計畫", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15010", "露營場域", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15011", "水土保持違規案件", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15005", "礦場", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15004", "山坡地露營區", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15006", "簡易水保", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15001", "土石流潛勢溪流", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15002", "土石流潛勢溪流影響範圍", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15007", "特定水土保持區", "水保圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/15003", "宜蘭縣山坡地範圍圖", "水保圖資", false, "", "");
        //相關圖資
        map.addArcGISFeatureLayer(url + "/4002", "都市計畫使用分區 ", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4001", "門牌", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4025", "地標", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4005", "橋樑", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4007", "高架隧道", "相關圖資", false, "", "");
       // map.addArcGISFeatureLayer(url + "/4006", "鐵路", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer2(url, "鐵路", "相關圖資", 4006, false, "", "");
        map.addArcGISFeatureLayer(url + "/4003", "道路名稱 (1:5000顯示)", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4004", "道路範圍", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4022", "省道(里程數)", "相關圖資", false, "", "");
        //map.addArcGISFeatureLayer(url + "/4018", "省道", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer2(url, "省道", "相關圖資", 4018, false, "", "");
        map.addArcGISFeatureLayer(url + "/4023", "縣道(里程數)", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4019", "縣道", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4020", "鄉道", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4021", "自行車道", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4024", "防汛道路", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4014", "水池", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4008", "河流_線", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4009", "河流_面", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4013", "地面水", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4012", "地下水", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/116", "鄉鎮市", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4011", "村里", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4015", "公園綠地", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer(url + "/4016", "建築物", "相關圖資", false, "", "");
        //map.addArcGISFeatureLayer(url + "/4017", "建築區", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer2(url, "建築區", "相關圖資", 4017, false, "", "");
        //map.addArcGISFeatureLayer(url + "/14001", "地下水井(合法)", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer2(url, "地下水井(合法)", "相關圖資", 14001, false, "", "");
        //map.addArcGISFeatureLayer(url + "/14002", "地下水井(非法)", "相關圖資", false, "", "");
        map.addArcGISFeatureLayer2(url, "地下水井(非法)", "相關圖資", 14002, false, "", "");
        //其他圖資
        map.addArcGISFeatureLayer(url + "/9002", "水利構造物", "其他圖資", false, "", "");
        //工程施工位置
        map.addArcGISFeatureLayer(url + "/16101", "施工中/點", "工程案件", false, "", "");
        map.addArcGISFeatureLayer(url + "/16102", "施工中/線", "工程案件", false, "", "");
        map.addArcGISFeatureLayer(url + "/16103", "施工中/面", "工程案件", false, "", "");

        map.addArcGISFeatureLayer(url + "/16201", "已竣工/點", "工程案件", false, "", "");
        map.addArcGISFeatureLayer(url + "/16202", "已竣工/線", "工程案件", false, "", "");
        map.addArcGISFeatureLayer(url + "/16203", "已竣工/面", "工程案件", false, "", "");
        //影像圖資
        //map.addArcGISFeatureLayer(imgurl + "/1", "水利科航照", "影像圖", false, "", "");
        //map.addArcGISFeatureLayer(imgurl + "/2", "農航所正射影像", "影像圖", false, "", "");
        //map.addArcGISFeatureLayer(imgurl + "/3", "縣府委外正射影像_097", "影像圖", false, "", "");
        //map.addArcGISFeatureLayer(imgurl + "/4", "縣府委外正射影像_098", "影像圖", false, "", "");
        //map.addArcGISFeatureLayer(imgurl + "/5", "縣府委外正射影像_100", "影像圖", false, "", "");
        map.addArcGISFeatureLayer2(imgurl, "水利科航照", "影像圖", 1, false, "", "");
        map.addArcGISFeatureLayer2(imgurl, "農航所正射影像", "影像圖", 2, false, "", "");
        map.addArcGISFeatureLayer2(imgurl, "縣府委外正射影像_097", "影像圖", 3, false, "", "");
        map.addArcGISFeatureLayer2(imgurl, "縣府委外正射影像_098", "影像圖", 4, false, "", "");
        map.addArcGISFeatureLayer2(imgurl, "縣府委外正射影像_100", "影像圖", 5, false, "", "");

        if (callback != null) callback();
    }

    map.exportMap = function (format, word, x, resultFunc) {
        debugger;
        format = "pdf";
        if (x == "是") {
            var url = 'https://wragis.e-land.gov.tw/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
            var printTask = new esri.tasks.PrintTask(url);
            var template = new esri.tasks.PrintTemplate();
            template.exportOptions = {
                width: 1024,
                height: 768,
                dpi: 96
            };
            template.format = format;
            template.layout = "Letter ANSI A Portrait";
            template.preserveScale = true;
            template.layoutOptions = {
                legendLayers: [],
                scalebarUnit: "Miles",
                titleText: word
            };
            var params = new esri.tasks.PrintParameters();
            params.map = map;
            params.template = template;
            printTask.execute(params, resultFunc);
        } else {
            //Letter ANSI A NoPortrait
            var url = 'https://wragis.e-land.gov.tw/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
            var printTask = new esri.tasks.PrintTask(url);
            var template = new esri.tasks.PrintTemplate();
            template.exportOptions = {
                width: 1024,
                height: 768,
                dpi: 96
            };
            template.format = format;
            template.layout = "Letter ANSI A NoPortrait";
            template.preserveScale = true;
            template.layoutOptions = {
                legendLayers: [],
                titleText: word
            };
            var params = new esri.tasks.PrintParameters();
            params.map = map;
            params.template = template;
            printTask.execute(params, resultFunc);
        }
    }
    //取得圖層基本資訊
    map.FindLayer = function (LayerNameOrID) {

        if (LayerNameOrID.toString().indexOf(".") > 0) {
            var ls = LayerNameOrID.toString().split(".")
            var layer;
            for (i in ls) {
                if (layer == null) {
                    layer = this.FindLayer(ls[i]);
                } else {
                    if (layer.baseLayer.layerInfos != undefined) {
                        var info = this.DeepFind(ls[i], layer.baseLayer.layerInfos);
                        info.oLayerName = layer.LayerName;
                        layer = info;
                    } else {
                        layer = this.DeepFind(ls[i], layer.Items);
                    }
                }
            }
            return layer;
        } else {
            return this.DeepFind(LayerNameOrID, this.Layers);
        };


    }
    map.DeepFind = function (LayerNameOrID, Layers) {
        var ret;
        for (var i in Layers) {
            var l = Layers[i];
            if (LayerNameOrID == l.LayerID || LayerNameOrID == l.LayerName || LayerNameOrID == l.id || LayerNameOrID == l.name) {
                return l;
            } else if (l.Items != null) {
                ret = this.DeepFind(LayerNameOrID, l.Items);
                if (ret != null) return ret
            } else if (l.isTile == false && l.baseLayer != null && l.baseLayer.layerInfos != undefined) {
                ret = this.DeepFind(LayerNameOrID, l.baseLayer.layerInfos);
                if (ret != null) return ret
            }
        }

    }

    map.fitBounds = function (selectedFeatureExtent) {
        //map.setExtent(selectedFeatureExtent);
        //if (selectedFeatureExtent != null) {
        //    minpt = esri.geometry.webMercatorToGeographic(new esri.geometry.Point(selectedFeatureExtent.xmin, selectedFeatureExtent.ymin, selectedFeatureExtent.spatialReference));
        //    maxpt = esri.geometry.webMercatorToGeographic(new esri.geometry.Point(selectedFeatureExtent.xmax, selectedFeatureExtent.ymax, selectedFeatureExtent.spatialReference));
        //    selectedFeatureExtent = new esri.geometry.Extent({
        //        "xmin": minpt.x, "ymin": minpt.y, "xmax": maxpt.x, "ymax": maxpt.y,
        //        "spatialReference": { "wkid": 4326 }
        //    });
        //}
        // 縮放至適當範圍

        if (selectedFeatureExtent == null)
            return;

        var widthExpand = 1000;
        var heightExpand = 1000;
        if (selectedFeatureExtent.getWidth() == 0 && selectedFeatureExtent.getHeight() == 0) {
            widthExpand = 100;
            heightExpand = 100;
        }
        else {
            var expandPercentage = 30;
            widthExpand = selectedFeatureExtent.getWidth() * (expandPercentage / 100);
            heightExpand = selectedFeatureExtent.getHeight() * (expandPercentage / 100);
        }
        var displayExtent = new esri.geometry.Extent(
            selectedFeatureExtent.xmin - (widthExpand / 2),
            selectedFeatureExtent.ymin - (heightExpand / 2),
            selectedFeatureExtent.xmax + (widthExpand / 2),
            selectedFeatureExtent.ymax + (heightExpand / 2),
            map.spatialReference);

        map.setExtent(displayExtent);

    }
    map.QueryByFilter = function (LayerName, Filter, isAttr, ShowField, retFunc, retry) {
        var url = "";
        if (LayerName.indexOf("http://") >= 0) {
            url = LayerName;
        }
        else {
            var LNode = map.FindLayer(LayerName);
            var Layer;
            if (LNode == null) {
                alert('找不到圖層');
            }
            if (LNode.oLayerName != undefined) {
                Layer = map.getLayer(LNode.oLayerName);
            } else {
            }
            url = Layer.url + '/' + LNode.id;
        }
        var query = new esri.tasks.Query();
        var queryTask = new esri.tasks.QueryTask(url);
        query.where = Filter;
        query.returnGeometry = true;
        query.outFields = ShowField.split(',');
        query.outSpatialReference = { wkid: 102100 };
        queryTask.execute(query, function (result) {
            // map.setExtent(result.features[0].geometry.getExtent());
            var bounds;
            for (i in result.features) {
                var p = result.features[i];
                //  var bounds = new google.maps.LatLngBounds();
                if (bounds == null) {
                    bounds = p.geometry.getExtent();
                } else {
                    bounds = bounds.union(p.geometry.getExtent());
                }
            }
            retFunc(result.features, bounds);
        });
    }
    //map.QueryByFilter = function (LayerName, Filter, isAttr, ShowField, retFunc, retry) {
    //    var url = "";
    //    if (LayerName.indexOf("http://") >= 0) {
    //        url = LayerName;
    //    }
    //    else {
    //        var LNode = map.FindLayer(LayerName);
    //        var Layer;
    //        if (LNode == null) {
    //            alert('找不到圖層');
    //        }
    //        if (LNode.oLayerName != undefined) {
    //            Layer = map.getLayer(LNode.oLayerName);
    //        } else {
    //        }
    //        url = Layer.url + '/' + LNode.id;
    //    }
    //    var query = new esri.tasks.Query();
    //    var queryTask = new esri.tasks.QueryTask(url);
    //    query.where = Filter;
    //    query.returnGeometry = true;
    //    query.outFields = ShowField.split(',');
    //    query.outSR = 102100;
    //    queryTask.execute(query, function (result) {
    //        // map.setExtent(result.features[0].geometry.getExtent());
    //        var bounds;
    //        for (i in result.features) {
    //            var p = result.features[i];
    //            //  var bounds = new google.maps.LatLngBounds();
    //            if (bounds == null) {
    //                bounds = p.geometry.getExtent();
    //            } else {
    //                bounds = bounds.union(p.geometry.getExtent());
    //            }
    //        }
    //        retFunc(result.features, bounds);
    //    });
    //}
    map.QueryByFilter2 = function (LayerName, Filter, isAttr, ShowField, retFunc, retry) {

    }
    map.QueryByFilter4 = function (LayerName, Filter, isAttr, ShowField,OrderField, retFunc, retrys) {
        var url = "";
        if (LayerName.indexOf("http://") >= 0) {
            url = LayerName;
        }
        else {
            var LNode = map.FindLayer(LayerName);
            var Layer;
            if (LNode == null) {
                alert('找不到圖層');
            }
            if (LNode.oLayerName != undefined) {
                Layer = map.getLayer(LNode.oLayerName);
            } else {
            }
            url = Layer.url + '/' + LNode.id;
        }
        var query = new esri.tasks.Query();
        //var queryTask = new esri.tasks.QueryTask("./proxy.ashx?" + url);
        var queryTask = new esri.tasks.QueryTask(url);
        //console.log(url);
        query.where = Filter;
        query.returnGeometry = false;
        query.returnDistinctValues = true
        query.orderByFields = [OrderField];
        query.outFields = ShowField.split(',');
        queryTask.execute(query, function (result) {
            retFunc(result);
        });
    }
    map.QueryByFilter3 = function (LayerName, Filter, isAttr, ShowField, retFunc, retry) {
        var url = "";
        if (LayerName.indexOf("http://") >= 0) {
            url = LayerName;
        }
        else {
            var LNode = map.FindLayer(LayerName);
            var Layer;
            if (LNode == null) {
                alert('找不到圖層');
            }
            if (LNode.oLayerName != undefined) {
                Layer = map.getLayer(LNode.oLayerName);
            } else {
            }
            url = Layer.url + '/' + LNode.id;
        }
        var query = new esri.tasks.Query();
        //var queryTask = new esri.tasks.QueryTask("./proxy.ashx?" + url);
        var queryTask = new esri.tasks.QueryTask(url);
        //console.log(url);
        query.where = Filter;
        query.returnGeometry = false;
        query.returnDistinctValues=true
        query.outFields = ShowField.split(',');
        queryTask.execute(query, function (result) {
            //console.log(result);
            // map.setExtent(result.features[0].geometry.getExtent());
            //var bounds;
            //for (i in result.features) {
            //    var p = result.features[i];
            //    //  var bounds = new google.maps.LatLngBounds();
            //    if (bounds == null) {
            //        bounds = p.geometry.getExtent();
            //    } else {
            //        bounds = bounds.union(p.geometry.getExtent());
            //    }
            //}
            //retFunc(result.features, bounds);
            retFunc(result);
        });
    }
    map.QueryByFeature = function (LayerName, geom, isAttr, retFunc) {
        var url = "";
        if (LayerName.indexOf("http://") >= 0) {
            url = LayerName;
        }
        else {
            var LNode = map.FindLayer(LayerName);
            var Layer;
            if (LNode == null) {
                alert('找不到圖層');
            }
            if (LNode.oLayerName != undefined) {
                Layer = map.getLayer(LNode.oLayerName);
            } else {
            }
            url = Layer.url + '/' + LNode.id;
        }


        var query = new esri.tasks.Query();
        var queryTask = new esri.tasks.QueryTask(url);
        query.geometry = geom;
        query.returnGeometry = true;
        query.outFields = ["*"];
        queryTask.execute(query, function (result) {
            // map.setExtent(result.features[0].geometry.getExtent());
            var bounds;
            for (i in result.features) {
                var p = result.features[i];
                //  var bounds = new google.maps.LatLngBounds();
                if (bounds == null) {
                    bounds = p.geometry.getExtent();
                } else {
                    bounds = bounds.union(p.geometry.getExtent());
                }
            }

            retFunc(result.features, bounds);
        });
    }




    map.addTGosMap = function () {
        $.getScript("./Scripts/ArcGIS/SGSArcGISServer.min.js", function () {
            // TGOS電子地圖
            var sgsLayer = new SGSTileLayer("http://api.tgos.nat.gov.tw/TileAgent/TGOSMAP_W.aspx", "", 0, true);
            sgsLayer.id = "TGOSMAP_W";
            sgsLayer.minScale = 2311162;
            sgsLayer.minScale = 2257;
            map.addLayer(sgsLayer, 0);
            sgsLayer.hide();
            //  福衛二號混合圖
            var sgsLayer2 = new SGSTileLayer("http://api.tgos.nat.gov.tw/TileAgent/ROADMAP_W.aspx", "", 0, true);
            sgsLayer2.id = "ROADMAP_W";
            map.addLayer(sgsLayer2, 0);
            sgsLayer2.hide();
            //通用版電子地圖
            var sgsLayer3 = new SGSTileLayer("http://api.tgos.nat.gov.tw/TileAgent/NLSCMAP_W.aspx", "", 0, true);
            sgsLayer3.id = "NLSCMAP_W";
            map.addLayer(sgsLayer3, 0);
            sgsLayer3.hide();
            //福衛二號影像
            var sgsLayer4 = new SGSTileLayer("http://api.tgos.nat.gov.tw/TileAgent/F2IMAGE_W.aspx", "", 0, true);
            sgsLayer4.id = "F2IMAGE_W";
            map.addLayer(sgsLayer4, 0);
            sgsLayer4.hide();
        });
    }
}