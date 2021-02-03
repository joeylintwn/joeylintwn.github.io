
function MeasureInit() {
    var symbol, geomTask, s_geometry, geometry;
    var chklab;
    var Calculate = "0";
    var DrawTool;
    var Times = 1; // Measure 次數;
    var checkuseDraw = true;
    var ObjColor = "#FF0000";//一般繪圖    var ObjOutLineColor = "#FF0000";//一般繪圖外框
    var WordColor = "#FF0000";
    var Italy = false;//斜體
    var Bold = false;//粗體
    var underline = false;//底線
    var fontsize = "20";//字型大小

    var LineWidth = "1"; 
    require([
        "esri/Color",
        "esri/symbols/TextSymbol",
        "esri/symbols/Font",
        "esri/toolbars/draw",
        "esri/graphic",
        "esri/tasks/GeometryService",
        "esri/tasks/AreasAndLengthsParameters",
        "esri/tasks/LengthsParameters",
        "dojo/_base/lang",
        "esri/geometry/Extent",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/SpatialReference", "esri/geometry/Point",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "dojo/domReady!"
    ], function (
        Color, TextSymbol, Font, Draw, Graphic, GeometryService, AreasAndLengthsParameters, LengthsParameters, lang, Extent, SimpleMarkerSymbol, SpatialReference, Point,
        SimpleLineSymbol, SimpleFillSymbol
    ) {
            DrawTool = new Draw(map);
            DrawTool.on("draw-end", addToMap);

            var geometryService = new GeometryService("http://118.163.96.187/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            geometryService.on("areas-and-lengths-complete", outputAreaAndLength);
            geometryService.on("lengths-complete", outputLength);
            this.stopMeasrue = function () {
                if (typeof (DrawTool) !== "undefined") {
                    DrawTool.deactivate();
                }
            }
            this.myActivateTool = function (label) {
                stopMeasrue();
                var tool = label.toUpperCase().replace(/ /g, "_");
                DrawTool.setLineSymbol(new SimpleLineSymbol("solid", new Color("blue"), 2));
                DrawTool.activate(Draw[tool], { showTooltips: false });
                map.hideZoomSlider();
            }
            

            this.startMeasure = function () {
                if (DrawTool != undefined) {
                    DrawTool.finishDrawing();
                    DrawTool.deactivate();
                }

            }
            this.addPointToMap = function (x, y) {
                //畫點
                var sprf = new SpatialReference(102443);
                var point = new Point;
                point.x = x;
                point.y = y;
                point.spatialReference = sprf;
                var symBlue = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([0, 0, 0]), 1),
                    new Color([0, 0, 255, 1]));//藍色
                var grap = new Graphic(point, symBlue); 
                var mapcenterPoint = new Point(parseFloat(x), parseFloat(y), new SpatialReference({ wkid: 102443 }));
                map.centerAndZoom(mapcenterPoint, 10);
                var graphicsLayer = map.getLayer("MDrawLayer");
                graphicsLayer.add(grap);
            }
            function ZoomToGeometry(selectedFeatureExtent) {
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
                var ii = selectedFeatureExtent.xmin - (widthExpand / 2);
                var ii2 = selectedFeatureExtent.ymin - (heightExpand / 2);
                var ii3 = selectedFeatureExtent.xmax + (widthExpand / 2);
                var ii4 = selectedFeatureExtent.ymax + (heightExpand / 2);
                var displayExtent = new Extent(
                    selectedFeatureExtent.xmin - (widthExpand / 2),
                    selectedFeatureExtent.ymin - (heightExpand / 2),
                    selectedFeatureExtent.xmax + (widthExpand / 2),
                    selectedFeatureExtent.ymax + (heightExpand / 2),
                    map.spatialReference);
                map.setExtent(displayExtent);
            }
            this.addLineToMap = function (line) {
                //畫線
                //console.log(line);
                var arr1 = new Array();
                var poi = line.split(',');
                for (var i = 0; i < poi.length; i++) {
                    var temp = poi[i].trim().split(' ');
                    var x = temp[0];
                    var y = temp[1];
                    arr1[i] = [x, y];
                }
                var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new esri.Color([255, 52, 250]), 3), new esri.Color([255, 52, 250, 0.25]));
                var Polyline = new esri.geometry.Polyline();
                Polyline.addPath(arr1);  
                Polyline.spatialReference = new SpatialReference(102443);//chris
                var grap = new Graphic(Polyline, sfs);
                var graphicsLayer = map.getLayer("MDrawLayer");
                graphicsLayer.add(grap);
                var extent = Polyline.getExtent();
                ZoomToGeometry(extent);
                //console.log(extent);
            }
            this.addPolygonToMap = function (o) {
                //畫面
                //console.log(o);
                var arr1 = new Array();
                var poi = o.split(',');
                for (var i = 0; i < poi.length; i++) {
                    var point = new Point;
                    var temp = poi[i].trim().split(' ');
                    var x = temp[0];
                    var y = temp[1];
                    arr1[i] = [x, y];
                }
                var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new esri.Color([255, 52, 250]), 3), new esri.Color([255, 52, 250, 0.25]));
                var Polyline = new esri.geometry.Polygon();
                Polyline.addRing(arr1);
                Polyline.spatialReference = new SpatialReference(102443);//chris
                var grap = new Graphic(Polyline, sfs);
                var graphicsLayer = map.getLayer("MDrawLayer");
                graphicsLayer.add(grap);
                var extent = Polyline.getExtent();
                ZoomToGeometry(extent);
            }

            function addToMap(evt) {
                s_geometry = evt.geometry;
                var symbol;
                DrawTool.deactivate();
                map.showZoomSlider();
                //alert(s_geometry.type);
                switch (s_geometry.type) {
                    case "polyline":
                        symbol = new SimpleLineSymbol("solid", new Color(ObjColor), LineWidth);
                        if (Calculate == "0") {
                            calcLength(s_geometry);
                        } 
                        break;
                    case "point":
                        //繪圖樣本設定
                        if (ObjColor == "") {
                            symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
                                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([0, 0, 0, 0]), 1),
                                new Color([0, 0, 0, 0]));
                        } else {
                            symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
                                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([0, 0, 0, 0]), 1),
                                new Color(ObjColor));
                        }
                        
                    case "polygon":
                        if (chklab != "") {
                            switch (chklab) {
                                case "Polygon":
                                    symbol = new SimpleFillSymbol();
                                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                            ObjOutLineColor, 2),
                                        new Color(ObjColor));
                                    if (Calculate == "0") {
                                        calcArea(s_geometry);
                                    } 
                                    break;
                                case "Circle":
                                    debugger;
                                    symbol = new SimpleFillSymbol();
                                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                            new Color([255, 0, 0]), 2),
                                        ObjOutLineColor);
                                    break;
                                case "Rectangle":
                                    //debugger;
                                    symbol = new SimpleFillSymbol();
                                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                            new Color([255, 0, 0]), 2),
                                        ObjOutLineColor);
                                    break;
                            }
                        }
                        break;
                    default:
                        symbol = new SimpleFillSymbol();
                        break;
                }

                if (DrawTool.onAddToMap != null) {
                    DrawTool.onAddToMap(evt);
                }
                //console.log(s_geometry);
                var graphicalc = new Graphic(s_geometry, symbol);
                if (checkuseDraw == true) {
                    graphicalc.id = 'LittleDraw' + Times.toString();
                    var graphicsLayer = map.getLayer("MDrawLayer");
                    graphicsLayer.add(graphicalc);
                }
                else {
                    graphicalc.id = 'Measure' + Times.toString();
                    map.graphics.add(graphicalc);
                }
                Times += 1;
            }

            // 計算距離
            function calcLength(geometry) {
                var lengthParams = new LengthsParameters();
                lengthParams.polylines = [geometry];
                lengthParams.lengthUnit = GeometryService.UNIT_KILOMETER;
                lengthParams.geodesic = true;
                geometryService.lengths(lengthParams);
            }

            function outputLength(evtObj) {
                //debugger;
                var result = evtObj.result;
                var length = result.lengths[0];

                var Txt = ''
                if (length < 1) {
                    Txt = '距離 = ' + formatNumber((length * 1000), 0) + '公尺';
                } else {
                    Txt = '距離 = ' + formatNumber(length, 3) + '公里';
                }
                var textSymbol = new TextSymbol(Txt).setColor(new Color([128, 0, 0])).setAlign(Font.ALIGN_START).setFont(new Font("14pt").setWeight(Font.WEIGHT_BOLD)).setOffset(0, 5);
                var graphicText = new Graphic(s_geometry.getPoint(0, 0), textSymbol);
                graphicText.id = 'MeasureTxt' + Times.toString();
                map.graphics.add(graphicText);
                Times++;
            }

        this.DrawWordToMap = function (geomery, word) {
            var font = "";
            var x = "none";
            if (underline == true) {
                x = "underline";
            }
            if (Italy == true) {
                if (Bold == true) {
                    font = new esri.symbol.Font(fontsize + "pt", esri.symbol.Font.STYLE_ITALIC, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD, "Microsoft JhengHei").setDecoration(x);
                    //font = new Font(fontsize + "pt", Font.STYLE_ITALIC, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, "Courier");
                }
                else {
                    font = new esri.symbol.Font(fontsize + "pt", esri.symbol.Font.STYLE_ITALIC, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.VARIANT_NORMAL, "Microsoft JhengHei").setDecoration(x);
                    //font = new Font(fontsize + "pt", Font.STYLE_ITALIC, Font.VARIANT_NORMAL, "Courier");
                }
            }
            else {
                if (Bold == true) {
                    font = new esri.symbol.Font(fontsize + "pt", esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.VARIANT_NORMAL, "Microsoft JhengHei").setDecoration(x);
                    //font = new Font(fontsize + "pt", Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, "Courier");
                }
                else {
                    font = new esri.symbol.Font(fontsize + "pt", esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.VARIANT_NORMAL, "Microsoft JhengHei").setDecoration(x);
                   // font = new Font(fontsize + "pt", Font.VARIANT_NORMAL, "Courier");
                }

            }
            //setDecoration "underline" | "line-through" | "none"
            
            var displayText = word;
            
            symBlue = new esri.symbol.TextSymbol(displayText, font, new dojo.Color(new Color(WordColor)));  
            //var textSymbol = new TextSymbol(word).setColor(new Color(WordColor)).setDecoration(x).setAlign(Font.DECORATION_UNDERLINE).setFont(font).setOffset(0, 5);
            var graphicText = new Graphic(geomery, symBlue);
            graphicText.id = 'MeasureTxt' + Times.toString();
            map.graphics.add(graphicText);
        }

            // 計算面積
            function calcArea(geometry) {
                var areasAndLengthParams = new AreasAndLengthsParameters();
                areasAndLengthParams.lengthUnit = GeometryService.UNIT_KILOMETER;
                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_KILOMETERS;
                areasAndLengthParams.calculationType = "geodesic";
                geometryService.simplify([geometry], function (simplifiedGeometries) {
                    areasAndLengthParams.polygons = simplifiedGeometries;
                    geometryService.areasAndLengths(areasAndLengthParams);
                });
            }

            function outputAreaAndLength(evtObj) {
                var result = evtObj.result;
                var area = result.areas[0];

                var Txt = ''
                if (area < 1) {
                    Txt = '面積 = ' + formatNumber((area * 1000000), 0) + '平方公尺';
                } else {
                    Txt = '面積 = ' + formatNumber(area, 3) + '平方公里';
                }
                var textSymbol = new TextSymbol(Txt).setColor(new Color([128, 0, 0])).setAlign(Font.ALIGN_START).setFont(new Font("14pt").setWeight(Font.WEIGHT_BOLD));
                var graphicText = new Graphic(s_geometry.getCentroid(), textSymbol);
                graphicText.id = 'MeasureTxt' + Times.toString();
                map.graphics.add(graphicText);
                Times++;
            }
            function formatNumber(number, point) {
                if (typeof (number) === "string") {
                    number = parseFloat(number);
                }
                var number = number.toFixed(point) + '';
                var x = number.split('.');
                var x1 = x[0];
                var x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            }

        });

    this.activateTool = function (label) {
        DrawTool.onAddToMap = null;
        chklab = label;
        myActivateTool(label);
    }

    this.SetDrawMethod = function (Method, Color, width, Listen, useDraw, OutLineColor) {
        if (useDraw === undefined) {
            checkuseDraw = false;
        }
        //console.log(Method);
        if (Method == "Point" & Color == null) {
            ObjColor = "";
        }
        else {
            ObjColor = Color;
        }        

        if (Method == "Point" & OutLineColor == null) {
            ObjOutLineColor = "";
        } else {
            ObjOutLineColor = OutLineColor
        }

        LineWidth = width;
        this.Method = Method;
        if (Method == "Polygon" || Method == "MeasureArea") {
            this.activateTool("Polygon");
            Calculate = "0";
        } else if (Method == "Polyline") {
            this.activateTool('Polyline');
            Calculate = "1";
        } else if (Method == "MeasureDistance") {
            this.activateTool('Polyline');
            Calculate = "0";
        } else if (Method == 'Circle') {
            this.activateTool('Circle');
        } else if (Method == 'Rect') {
            this.activateTool('Rectangle');
        } else if (Method == 'Point' || Method == "Text") {
            this.activateTool('Point');
        } else if (Method == "AreaPolygon") {
            this.activateTool("Polygon");
            Calculate = "1";
        }
        //每次都將之清除        DrawTool.onAddToMap = Listen;
    }
    this.DrawObjMethod = function (Method, Listen) {

    }

    this.setColor = function (colorhex) {
        ObjColor = colorhex;
    }
    this.setWordColor = function (colorhex) {
        WordColor = colorhex;
    }
    this.sewWordToMap = function (x, word, bold1, italy1, underline1,fontSize1,color) {
        Bold = bold1;
        Italy = italy1;
        underline = underline1;
        fontsize = fontSize1;
        WordColor = color;
        DrawWordToMap(x, word);
    }
    this.setObjToMap = function (x, y) {
        addPointToMap(x, y);
    }
    this.setLineObjToMap = function (str) {
        //console.log(str.trimEnd());
        var arr = str.split('), (');        
        for (var i = 0; i < arr.length; i++) {
            var line = arr[i].replace(/\(/g, '').replace(/\)/g, '').trim();
            addLineToMap(line);
        }
        //console.log(str.replace(/\(/g, '').replace(/\)/g, ''));
    }
    this.setPolygonToMap = function (str) {
       // console.log(str);
        var arr = str.split('), (');
        for (var i = 0; i < arr.length; i++) {
            //addPolygonToMap
            var line = arr[i].replace(/\(/g, '').replace(/\)/g, '').trim();
            //by jay 由於在伺服器上require會有讀取延遲會造成讀不到function
            //所以設一個timeout
            setTimeout(function () {
                addPolygonToMap(line);
            }, 1000);
            //addLineToMap(line);
        }
    }
}
