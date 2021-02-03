require(['dojo/_base/declare', "esri/map", "dojo/parser", "dojo/Evented", "dojo/on",
    "esri/geometry/Extent", "esri/SpatialReference", "esri/config", "esri/toolbars/navigation", "esri/geometry/Point",
    "esri/tasks/GeometryService", "esri/dijit/LocateButton", "esri/tasks/ProjectParameters", "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters", "esri/tasks/Geoprocessor", "esri/geometry/Polygon", "esri/toolbars/draw", "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/graphic", "esri/tasks/FeatureSet", "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/Polyline", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "dojo/_base/array", "extras/WeiYiRoadLayer",
            "esri/request", "dojo/dom", "dojo/_base/lang", "dojo/json", "esri/geometry/scaleUtils", "esri/InfoTemplate", "esri/layers/FeatureLayer",
            "esri/tasks/BufferParameters", "esri/dijit/Measurement", "extras/WeiRainLayer", "esri/dijit/Legend", "esri/tasks/LengthsParameters",
             "esri/units", "esri/geometry/geodesicUtils", "esri/tasks/PrintTemplate", "esri/toolbars/edit", "esri/SnappingManager",
             "esri/sniff", "dojo/keys", "esri/geometry/Geometry", "esri/geometry/Multipoint" ,
            "dijit/layout/TabContainer",
            "dijit/layout/ContentPane",
            "dijit/form/Select",
            "dijit/form/ComboBox",
            "dojo/store/Memory",
            "dijit/layout/BorderContainer"],
     function (declare, map, parser, Evented, on, Extent, SpatialReference, esriConfig, Navigation, Point, GeometryService,
         LocateButton, ProjectParameters, PrintTask, PrintParameters, Geoprocessor, Polygon, Draw, SimpleFillSymbol, SimpleLineSymbol,
         Color, Graphic, FeatureSet, PictureMarkerSymbol, Polyline, SimpleMarkerSymbol, Color, arrayUtils, WeiYiRoadLayer, request,
         dom, lang, JSON, scaleUtils, InfoTemplate, FeatureLayer, BufferParameters, Measurement, WeiRainLayer, Legend, LengthsParameters,
         Units, geodesicUtils, PrintTemplate, Edit, SnappingManager, has, keys, Geometry, Multipoint) {
         var WeiMap = declare("WeiMap", [Evented], {
             arcMap: null,
             domDiv: "map",
             mapExtent: null,
             navToolbar: null,
             //--- Process/Service Objects
             printTask: null,
             geometryService: null,
             userLocateBtn: null,
             drawTool: null,
             drawCurGroupId: null,
             drawArrays: [],
             measureTool: null,
             currTool : '',
             fenceToShpGP: null,
             fenceToShpDraw: null,
             fenceLayerName: null,
             fenceTmpGraphic: null,
             fenceSymbol: null,
             fenceQueryJob: null,
             fenceJobStatus: null,
             fenceJobFailed: null,
             //--- Default Symbol
             defPointSymbol: null,
             defLineSymbol: null,
             defPolygonSymbol: null,
             drawPointSymbol: null,
             drawLineSymbol: null,
             drawPolygonSymbol: null,
             drawcolor :null, 
             
             gmlNewPointSymbol: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 1), new Color([0, 0, 0, 1])),
             gmlDeletePointSymbol: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([255, 0, 0, 1])),
             gmlUpdatePointSymbol: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 153, 0]), 1), new Color([0, 153, 0, 1])),
             gmlMarkFacPointSymbol: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 0, 255]), 1), new Color([0, 255, 0, 0])),
             gmlNewLineSymbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 3),
             gmlUpdateLineSymbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 153, 0]), 3),
             gmlDeleteLineSymbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 3),
             gmlMarkFacLineSymbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 0, 255]), 3),

             loadfun :null,
             measurement : null,

             _ismovecenter: false,
             _currlocation:null,
             _islocation: false,
             _currentscale: 0,
             _tempGraphic: null,
             _tempGraphictxt: null,
             _CurrPolygon: null,
             _CurrPolyline: null,
             _CurrPoint :null,
             _isbufferclick: false,
             _bufferdistance: 0,
             _drawGraphic: null,
             _isDraging: false,
             _isDrawing: false,
             _editToolbar: null,
             _editStart: false,
             _gmlfeatures: [],  

             constructor: function (options) {
                 //parser.parse();
                 this.domDiv = options.div || 'map';

                 var minx = options.minx || Number.MIN_VALUE;
                 var miny = options.miny || Number.MIN_VALUE;
                 var maxx = options.maxx || Number.MAX_VALUE;
                 var maxy = options.maxy || Number.MAX_VALUE;
                 var wkid = options.wkid || 102443;
                 this.mapExtent = new Extent(minx, miny, maxx, maxy, new SpatialReference(wkid));
                 this._initialBase();
             },
             _initialBase: function () {
                 
                 //--- 建立ArcgisMap物件
                 //debugger;
                 //this.mapExtent = new Extent(e.minx, e.miny, 346755.2810787978, 2787368.3745819633, new SpatialReference(e.wkid));
                 this.arcMap = new map(this.domDiv, {
                     extent: this.mapExtent,
                     sliderStyle: 'large',
                     showLabels: true,
                     //sliderPosition: "bottom-right",
                     logo: false
                 });
                 this.arcMap.enableMapNavigation();
                 this.navToolbar = new Navigation(this.arcMap);



                 //--- 建立Default Symbols
                 this.defPointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 1), new Color([0, 0, 0, 1]));
                 this.defLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 3);
                 this.defPolygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                                            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                                new dojo.Color([255, 0, 0, 1]), 2), new dojo.Color([255, 255, 0, 0.3]));
                 this.drawPointSymbol= this.defPointSymbol;
                 this.drawLineSymbol = this.defLineSymbol;
                 this.drawPolygonSymbol = this.defPolygonSymbol;
                 //this.defPolygonSymbol = new SimpleFillSymbol().setColor(new Color([184, 184, 184, 0.5])),
                 //this.defPolygonSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([141, 141, 141]), 3));
                 this.drawPointSymbol = this.defPointSymbol;


                 var root = this;

                 //--- 建立Default Draw Tool
                 this.drawTool = new Draw(this.arcMap);
                 //--- 連結drawTool onDrawEnd event --> Fire arcMapCtrl的Event: [DrawEnd](groupId)
                 dojo.connect(this.drawTool, "onDrawEnd", function (geometry) {
                     if (root.drawCurGroupId != -999) {
                         if (geometry instanceof Polygon) {
                             if (root.drawcolor != null) {
                                 root.drawPolygonSymbol.outline.setColor(root.drawcolor);
                             }
                             root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.drawPolygonSymbol, { "id": root.drawCurGroupId })));
                         }
                         else if (geometry instanceof Polyline) {
                             if (root.drawcolor != null) {
                                 root.drawLineSymbol.setColor(root.drawcolor);
                             }
                             root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.drawLineSymbol, { "id": root.drawCurGroupId })));
                         }
                         else if (geometry instanceof Point) {
                             if (root.drawcolor != null) {
                                 root.drawPointSymbol.setColor(root.drawcolor);
                             }
                             root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.drawPointSymbol, { "id": root.drawCurGroupId })));
                         }
                     }
                     root.emit('DrawEnd', root.drawCurGroupId);
                 });

                 //---建立Edit Tool
                 this._editToolbar = new Edit(this.arcMap);
                 this._editToolbar.on("deactivate", function (evt) {
                     //debugger;
                     if (evt.info.isModified) {
                         if (evt.graphic.attributes != null && evt.graphic.attributes.id != null) {
                             root.emit('EditEnd', { id: evt.graphic.attributes.id, g: evt.graphic.geometry });
                         }
                     }
                 });

                 //--- 建立 測量 Draw Toll
                 this.measureTool = new Draw(this.arcMap);
                 dojo.connect(this.measureTool, "onDrawEnd", function (geometry) {
                     root.currTool = '';
                     root._CurrPolyline = null;
                     root._CurrPolygon = null;
                     root._CurrPoint = null;

                     if (geometry.type == 'polyline') {
                         root._tempGraphic = root.arcMap.graphics.add(new Graphic(geometry, root.defLineSymbol));
                     }
                     else if (geometry.type == 'polygon') {
                         root._tempGraphic = root.arcMap.graphics.add(new Graphic(geometry, root.defPolygonSymbol));
                     }
                     //var lengthParams = new LengthsParameters();
                     //lengthParams.polylines = [geometry];
                     //lengthParams.lengthUnit = GeometryService.UNIT_METER;
                     //lengthParams.geodesic = true;
                     //root._tempGraphic = root.arcMap.graphics.add(new Graphic(geometry, root.defLineSymbol));
                     //if (root.geometryService == null) {
                     //    alert('需設定geomtryService ! ');
                     //    return;
                     //}
                     //root.geometryService.lengths(lengthParams, function (distances) {
                     //    //alert(distances.lengths[0].toFixed(2));
                     //});

                     root.measureTool.deactivate();
                 });

                 //--- 連結Map event並Fire arcMapCtrl的Events
                 //--- 連結Map onMouseMove evant --> Fire arcMapCtrl的Event: [MouseMove]({x,y})
                 dojo.connect(this.arcMap, 'onMouseMove', function (theMap) {
                     try {
                         var mpoint = root.arcMap.toMap(theMap.screenPoint);
                         root.emit('MouseMove', { x: mpoint.x.toFixed(2), y: mpoint.y.toFixed(2) });

                         if (root.currTool == "distance") {
                            
                             var temppolyine = new Polyline(root.arcMap.spatialReference);
                             if (root._CurrPolyline != null && root._CurrPolyline.paths.length > 0) {
                                 temppolyine.addPath(root._CurrPolyline.paths[0]);
                                 var pointcount = root._CurrPolyline.paths[0].length;
                                 temppolyine.insertPoint(0, pointcount, new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference));
                                 var geo = esri.geometry.webMercatorToGeographic(temppolyine);
                                 var lengths = geodesicUtils.geodesicLengths([geo], Units.METERS);
                                 showlable(lengths[0].toFixed(2), new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference));
                             }
                             else if (root._CurrPoint != null) {
                                 temppolyine.addPath([root._CurrPoint, new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference)]);
                                 var geo = esri.geometry.webMercatorToGeographic(temppolyine);
                                 var lengths = geodesicUtils.geodesicLengths([geo], Units.METERS);    //esriMeters
                                 showlable(lengths[0].toFixed(2), new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference));
                             }
                             function showlable(text, point) {
                                 text = text + "m";
                                 root.arcMap.graphics.remove(root._tempGraphictxt);
                                 var sms = new esri.symbol.TextSymbol(text, new esri.symbol.Font("20pt", esri.symbol.Font.STYLE_ITALIC,
                                 esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD, "Courier"), new dojo.Color("red"));
                                 root._tempGraphictxt = new esri.Graphic(point, sms);

                                 root.arcMap.graphics.add(root._tempGraphictxt);
                             }
                         }
                         else if (root.currTool == "area") {
                             var temppolygon = new Polygon(root.arcMap.spatialReference);
                             if (root._CurrPolygon != null && root._CurrPolygon.rings.length > 0) {
                                 //debugger;
                                 temppolygon.addRing(root._CurrPolygon.rings[0]);
                                 var pointcount = root._CurrPolygon.rings[0].length;
                                 temppolygon.insertPoint(0, pointcount, new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference));
                                 var geo = esri.geometry.webMercatorToGeographic(temppolygon);
                                 var areas = geodesicUtils.geodesicAreas([geo], Units.METERS);
                                 showarealable(Math.abs(areas[0].toFixed(2)), new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference));
                             }
                             else if (root._CurrPoint != null) {
                                 temppolygon.addRing([root._CurrPoint, new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference)]);
                                 var geo = esri.geometry.webMercatorToGeographic(temppolygon);
                                 var areas = geodesicUtils.geodesicAreas([geo], Units.METERS);    //esriMeters
                                 showarealable(Math.abs(areas[0].toFixed(2)), new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference));
                             }
                             function showarealable(text, point) {
                                 text = text + "m²";
                                 root.arcMap.graphics.remove(root._tempGraphictxt);
                                 var sms = new esri.symbol.TextSymbol(text, new esri.symbol.Font("20pt", esri.symbol.Font.STYLE_ITALIC,
                                 esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD, "Courier"), new dojo.Color("red"));
                                 root._tempGraphictxt = new esri.Graphic(point, sms);

                                 root.arcMap.graphics.add(root._tempGraphictxt);
                             }
                         }
                     }
                     catch (e) {
                     }
                 });

                 dojo.connect(this.arcMap, 'onMouseUp', function (theMap) {
                     if (root._isDraging) {
                         var mpoint = root.arcMap.toMap(theMap.screenPoint);
                         root.emit('DragEnd', { x: mpoint.x, y: mpoint.y });
                         root._isDraging = false;
                     }
                     if (!root._isDrawing) {
                         root.arcMap.enablePan();
                     }
                 });

                 dojo.connect(this.arcMap, 'onClick', function (theMap) {
                     var mpoint = root.arcMap.toMap(theMap.screenPoint);
                     if (root._ismovecenter) {
                         theMap.mapPoint.setSpatialReference(root.arcMap.spatialReference);
                         root.arcMap.centerAt(theMap.mapPoint);
                         root._ismovecenter = false;
                     }
                     if (root._isbufferclick) {
                         root._isbufferclick = false;
                         if (root.geometryService == null) {
                             alert('需設定geomtryService ! ');
                             return;
                         }
                         //debugger;
                         var fun = eval(root.loadfun);
                         if (fun != null) {
                             fun();
                         }
                         var params = new BufferParameters();
                         params.geometries = [mpoint];
                         params.distances = [root._bufferdistance];
                         params.unit = GeometryService.UNIT_METER;
                         params.outSpatialReference = root.arcMap.spatialReference;
                         root.geometryService.buffer(params, function (gs) {
                             root.emit('BufferCompleted', gs[0]);
                         });
                     }
                     if (root.currTool == 'distance') {
                         if (root._CurrPolyline == null) {
                             root._CurrPolyline = new Polyline(root.arcMap.spatialReference);
                             root._CurrPoint = new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference);
                         }
                         else {
                             if (root._CurrPoint != null) {
                                 root._CurrPolyline.addPath([root._CurrPoint, new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference)]);
                                 root._CurrPoint = null;
                             }
                             else {
                                 var pointcount = root._CurrPolyline.paths[0].length;
                                 root._CurrPolyline.insertPoint(0, pointcount, new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference));
                             }
                         }
                     }
                     if (root.currTool == 'area') {
                         if (root._CurrPolygon == null) {
                             root._CurrPolygon = new Polygon(root.arcMap.spatialReference);
                             root._CurrPoint = new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference);
                         }
                         else {
                             if (root._CurrPoint != null) {
                                 root._CurrPolygon.addRing([root._CurrPoint, new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference)]);
                                 root._CurrPoint = null;
                             }
                             else {
                                 var pointcount = root._CurrPolygon.rings[0].length;
                                 root._CurrPolygon.insertPoint(0, pointcount, new Point(mpoint.x, mpoint.y, root.arcMap.spatialReference));
                             }
                         }
                     }

                     if (root.arcMap.snappingManager.alwaysSnap) {
                         //debugger;
                         var deferred = root.arcMap.snappingManager.getSnappingPoint(theMap.screenPoint);
                         deferred.then(function (value) {
                             //debugger;
                             if (value !== undefined) {
                                 root.emit('Snapping', { x: mpoint.x.toFixed(2), y: mpoint.y.toFixed(2) });
                             }
                         },
                         function (error) {
                             console.log('failure');
                         });
                     }
                     else {
                         root.emit('Click', { x: mpoint.x.toFixed(2), y: mpoint.y.toFixed(2) });
                     }
                 });

                 dojo.connect(this.arcMap, 'onExtentChange', function (e) {
                     root.navToolbar.deactivate();
                     if (!root._islocation) {
                         root._currentscale = root.arcMap.getScale();
                     }
                     else {
                         root._islocation = false;
                     }
                     //root.toPan();
                     root.emit('ScaleChange', root.arcMap.getScale());
                 });

                 dojo.connect(this.arcMap, 'onLoad', function (e) {
                     root.arcMap.graphics.on("mouse-drag", function (evt) {
                         //debugger;
                         if (root._drawGraphic  != null && root._drawGraphic.attributes.draw == true) {
                             //root.arcMap.disablePan();
                             root._isDraging = true;
                             var mpoint = root.arcMap.toMap(evt.screenPoint)
                             root._drawGraphic.setGeometry(mpoint);
                         }
                     })

                     root.arcMap.graphics.on("click", function (evt) {
                         if (evt.graphic.attributes != null && evt.graphic.attributes.fun != null && evt.graphic.attributes.fun == "loc") {
                             root.arcMap.graphics.remove(evt.graphic);
                         }
                         if (evt.graphic.attributes != null && evt.graphic.attributes.id != null) {
                             root.emit('GraphicsClick', evt.graphic.attributes.id );
                         }
                         if (root._editStart) {
                             //debugger;
                             if (evt.graphic.attributes != null && evt.graphic.attributes.id != null) {
                                 root._editToolbar.activate(Edit.EDIT_VERTICES, evt.graphic);
                             }
                         }
                     })


                     var symbol = new SimpleMarkerSymbol( SimpleMarkerSymbol.STYLE_CROSS,15,
                                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255, 0, 0, 0.5]), 5),null);
                     root.arcMap.enableSnapping({
                         snapPointSymbol: symbol,
                         tolerance: 20,
                         snapKey: keys.CTRL// keys.ALT
                     });
                    
                 });

                 dojo.connect(this.arcMap.infoWindow, 'onHide', function (e) {
                     //debugger;
                     if (root._tempGraphic != null) {
                         root.arcMap.graphics.remove(root._tempGraphic);
                     }
                 });
             },
             //--- Enable Function Method
             enableProxy: function (proxy_url) {
                 esriConfig.defaults.io.proxyUrl = proxy_url;
                 esriConfig.defaults.io.alwaysUseProxy = true;
             },
             enableGeometryService: function (geo_service_url) {
                 this.geometryService = new GeometryService(geo_service_url);
                 esriConfig.defaults.geometryService = this.geometryService;
             },
             enablePrintTask: function (print_task_url) {
                 this.printTask = new PrintTask(print_task_url);
             },
             enableUserLocateBtn: function (dom_div) {
                 var root = this;
                 this.userLocateBtn = new LocateButton({
                     map: this.arcMap
                 }, dom_div);
                 //this.userLocateBtn.startup();
                 //--- 連結userLocateBtn onlocate event and Handle
                 dojo.connect(this.userLocateBtn, 'onlocate', function (e) {
                     if (e.error != null) {
                         var p = new Point(327229, 2736110, root.arcMap.spatialReference);
                         root.arcMap.centerAt(p);
                         root.arcMap.setScale(10000);
                         return;
                     }

                     var ulocSR = new esri.SpatialReference({ "wkid": 4326 });  //WGS84
                     locPoint = new Point(e.position.coords.longitude, e.position.coords.latitude, ulocSR);
                     if (root.arcMap.spatialReference.wkid != 4326) {
                         var params = new ProjectParameters();
                         params.geometries = [locPoint];
                         params.outSR = root.arcMap.spatialReference;
                         root.geomtryService.project(params, function (projectedPoints) {
                             root._currlocation = projectedPoints[0];
                             root.arcMap.centerAt(projectedPoints[0]);
                             root.arcMap.setScale(root._currentscale);
                         }, function (e) {
                             //debugger;
                         });
                     }
                     else
                         root.arcMap.centerAt(locPoint);

                 });
             },
             setScale:function(scale){
                 this.arcMap.setScale(scale);
             },
             enableFenceToShp: function (gp_service_url) {
                 this.fenceToShpGP = new Geoprocessor(gp_service_url);
                 this.fenceToShpDraw = new Draw(this.arcMap);
                 this.fenceSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
                 this.fenceQueryJob = function () {
                     var features = [];
                     features.push(this.fenceTmpGraphic);
                     var feaSet = new FeatureSet();
                     feaSet.features = features;
                     var clipLayers = [];
                     clipLayers.push(this.fenceLayerName);
                     var defQuery = {
                         'Layers_to_Clip': clipLayers,
                         'Area_of_Interest': feaSet
                     };
                     return defQuery;
                 };
                 this.fenceJobStatus = function (jobinfo) {
                 };
                 this.fenceJobFailed = function (error) {
                     //debugger;
                 };

                 var root = this;
                 dojo.connect(this.fenceToShpDraw, "onDrawEnd", function (geometry) {
                     var fun = eval(root.loadfun);
                     if (fun != null) {  
                         fun();
                     }
                     if (root.fenceTmpGraphic != null) {
                         root.arcMap.graphics.remove(root.fenceTmpGraphic);
                     }
                     root.fenceToShpDraw.deactivate();
                     var graphic = new Graphic(geometry, root.fenceSymbol);
                     root.fenceTmpGraphic = root.arcMap.graphics.add(graphic);
                     root.fenceToShpGP.submitJob(root.fenceQueryJob(), function (jobinfo) {
                         root.fenceToShpGP.getResultData(jobinfo.jobId, "Output_Zip_File", function (result, messages) {
                             root.emit('FenceToShpCompleted', {});
                             open(result.value.url);
                         }, function (e) {
                         });
                     }, root.fenceJobStatus, root.fenceJobFailed);
                 });
             },
             removeLayer:function (layer){
                 if (!layer instanceof WeiLayer) {
                     alert('物件錯誤');
                 }
                 this.arcMap.removeLayer(layer.layer);
             },
             addLayer: function (layer) {
                 if (!layer instanceof WeiLayer) {
                     alert('物件錯誤');
                 }
                 layer.map = this.arcMap;
                 layer.arc = this;
                 layer.AddToMap();
             },
             setloadfunction: function (fun){
                 this.loadfun = fun;
             },
             moveCenter: function () {
                 this._ismovecenter = true;
             },
             toFullExtent: function () {  
                 this.mapExtent.setSpatialReference(this.arcMap.spatialReference);
                 this.arcMap.setExtent(this.mapExtent, true);
             },
             toPrevExtent: function () {
                 this.navToolbar.zoomToPrevExtent();
             },
             toNextExtent: function () {
                 this.navToolbar.zoomToNextExtent();
             },
             toZoomIn: function () {
                 //this.arcMap.disablePan();
                 this.navToolbar.activate(Navigation.ZOOM_IN);
             },
             toZoomOut: function () {
                 //this.arcMap.disablePan();
                 this.navToolbar.activate(Navigation.ZOOM_OUT);
             },
             toPan: function () {
                 this.navToolbar.activate(Navigation.PAN);
             },
             connectYiApi: function () {
                 init_yitown(); //鄉鎮市

                 init_yivillage(); //村里
                 init_yiroad(); //道路
                 init_yicrossroad(); //交叉路口
                 init_yipoi(); //重要地標
                 init_yiaddress(); //門牌

                 init_yicadaster(); //地籍
                 init_yilanduse(); //都市計畫區
                 yilandmap = this.arcMap;
             },
             toLocation: function () {
                 if (this._currlocation != null) {
                     this.arcMap.centerAt(this._currlocation);
                 }
                 else {
                     this._islocation = true;
                     this.userLocateBtn.locate();
                 }
             },
             LocationCoord: function (x, y, scale) {
                 


                 var m_scale = scale || 5000;
                 var symbol = null;

                 if (this.defPointSymbol != null) {
                     symbol = this.defPointSymbol;
                 }
                 else {
                     symbol = new PictureMarkerSymbol(Mappointimg, 28, 28);
                 }
                 var pt = new Point(x, y, this.arcMap.spatialReference);
                 //debugger;
                 if (this._drawGraphic != null) {  //若有設置可拖拉圖示則更動定位點至該圖示

                     this.arcMap.graphics.remove(this._drawGraphic);
                     this.putDrawicon(x, y);
                 }
                 else {
                     if (this._tempGraphic != null) {
                         this.arcMap.graphics.remove(this._tempGraphic);
                     }
                     this._tempGraphic = new Graphic(pt, symbol);
                     this.arcMap.graphics.add(this._tempGraphic);
                 }
                 var root = this;
                 root.arcMap.setScale(m_scale); 
                 this.arcMap.centerAt(pt);
                 
                 if (scale != 0) {
                     setTimeout(function () {
                         
                         
                     }, 1000);
                 }
             },
             SetGraphicToMap: function (_data) {
                 console.log(_data);
                 var geometry = _data;
                 if (geometry.includes("MULTILINESTRING") == true) {
                     //console.log(_data);
                     geometry = geometry.replace("MULTILINESTRING", "");
                     var arr = geometry.split('), (');
                     for (var i = 0; i < arr.length; i++) {
                         var line = arr[i].replace(/\(/g, '').replace(/\)/g, '').trim();
                         var arr1 = new Array();
                         var poi = line.split(',');
                         for (var j = 0; j < poi.length; j++) {
                             var temp = poi[j].trim().split(' ');
                             var x = temp[0];
                             var y = temp[1];
                             arr1[j] = [x, y];
                         }
                         var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
                             new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                 new esri.Color([255, 52, 250]), 3), new esri.Color([255, 52, 250, 0.25]));
                         var Polyline = new esri.geometry.Polyline();
                         Polyline.addPath(arr1);
                         Polyline.spatialReference = new SpatialReference(102443);//chris
                         var grap = new Graphic(Polyline, sfs);
                         console.log(grap);
                         this.arcMap.graphics.add(grap); 
                         this.arcMap.setExtent(Polyline.getExtent());
                     }
                 }
                 if (geometry.includes("MULTIPOINT") == true) {
                     geometry = geometry.replace("MULTIPOINT", "")
                     geometry = geometry.replace(/\(/g, '').replace(/\)/g, '');
                     var arr = geometry.split(',');
                     var arr1 = new Array();
                     for (var j = 0; j < arr.length; j++) {
                         var x = arr[j].trim().split(' ');
                         var sprf = new SpatialReference(102443);
                         var point = new Point;
                         point.x = x[0];
                         point.y = x[1];
                         arr1[j] = [x[0], x[1]];
                         point.spatialReference = sprf;
                         var symBlue = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
                             new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                 new Color([0, 0, 0]), 1),
                             new Color([0, 0, 255, 1]));//藍色
                         var grap = new Graphic(point, symBlue);
                         this.arcMap.graphics.add(grap);
                     }
                     var Polyline = new esri.geometry.Polygon();
                     Polyline.addRing(arr1);
                     Polyline.spatialReference = new SpatialReference(102443);//chris
                     this.arcMap.setExtent(Polyline.getExtent());
                    //console.log(Polyline.getExtent());
                 }
                 if (geometry.includes("MULTIPOLYGON") == true) {
                     geometry = geometry.replace("MULTIPOLYGON ", "");
                     var arr = geometry.split('), (');
                     for (var i = 0; i < arr.length; i++) {
                         var line = arr[i].replace(/\(/g, '').replace(/\)/g, '').trim();
                         var arr1 = new Array();
                         var poi = line.split(',');
                         for (var j = 0; j < poi.length; j++) {
                             var point = new Point;
                             var temp = poi[j].trim().split(' ');
                             var x = temp[0];
                             var y = temp[1];
                             arr1[j] = [x, y];
                         }
                         var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
                             new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                 new esri.Color([255, 52, 250]), 3), new esri.Color([255, 52, 250, 0.25]));
                         var Polyline = new esri.geometry.Polygon();
                         Polyline.addRing(arr1);
                         Polyline.spatialReference = new SpatialReference(102443);//chris
                         var grap = new Graphic(Polyline, sfs);
                         this.arcMap.graphics.add(grap); 
                         this.arcMap.setExtent(Polyline.getExtent());
                     }
                 }
             },
             ViewReport: function (_data) {
                 var x = _data.POINT_X;
                 var y = _data.POINT_Y;

                 var _point = new Point(x, y, this.arcMap.spatialReference);

                 var infoTemplate = new InfoTemplate();

                 var graphic = new Graphic(_point, new PictureMarkerSymbol(Mappointimg, 28, 28));

                 var d = new Date(parseInt(_data.dateline.replace("/Date(", "").replace(")", "")));
                 var month = '' + (d.getMonth() + 1);
                 var day = '' + d.getDate();
                 var year = d.getFullYear();
                 var dateline = [year, month, day].join('/');

                 infoTemplate.setContent(
                     "<b>案件編號: </b>" + _data.csid + "<br/>" +
                     "<b>鄉鎮: </b>" + _data.town + "<br/>" +
                     "<b>地段: </b>" + _data.sec_cns + "<br/>" +
                     "<b>地號: </b>" + _data.land_no + "<br/>" +
                     "<b>97座標X: </b>" + _data.POINT_X + "<br/>" +
                     "<b>97座標Y: </b>" + _data.POINT_Y + "<br/>" +
                     "<b>建立日期: </b>" + dateline + "<br/>" +
                     "<b>陳情人: </b>" + _data.informant + "<br/>" +
                     "<b>陳情人電話: </b>" + _data.phone + "<br/>" +
                     "<b>陳情人電子信箱: </b>" + _data.email + "<br/>" +
                     "<b>案件進度: </b>" + _data.process + "<br/>" +
                     "<b>長官批示: </b>" + _data.instructions + "<br/>" +
                     "<b>" + _data.pic
                 );

                 graphic.setInfoTemplate(infoTemplate);

                 //畫點
                 this.arcMap.graphics.add(graphic);

                 //把目標置中

                 this.arcMap.setScale(1037);
                 this.arcMap.centerAt(_point);
             },
             ViewDegreeDeclare: function (_data) {
                 var x = _data.POINT_X;
                 var y = _data.POINT_Y;

                 var _point = new Point(x, y, this.arcMap.spatialReference);

                 var infoTemplate = new InfoTemplate();

                 var graphic = new Graphic(_point, new PictureMarkerSymbol(Mappointimg, 28, 28));

                 var d = new Date(parseInt(_data.dateline.replace("/Date(", "").replace(")", "")));
                 var month = '' + (d.getMonth() + 1);
                 var day = '' + d.getDate();
                 var year = d.getFullYear();
                 var dateline = [year, month, day].join('/');

                 infoTemplate.setContent(
                     "<b>填報日期: </b>" + dateline + "<br/>" +
                     "<b>鄉鎮: </b>" + _data.town + "<br/>" +
                     "<b>填報人: </b>" + _data.填報人 + "<br/>" +
                     "<b>填報度數: </b>" + _data.wateruse + "<br/>" +
                     "<b>QRCODE: </b>" + _data.tbno + "<br/>" +
                     "<b>水權/臨時用水狀號: </b>" + _data.enrollment_no + "<br/>" +
                     "<b>水井流水編號: </b>" + _data.lbid + "<br/>" +
                     "<b>是否異常: </b>" + _data.situation + "<br/>" +
                     "<b>" + _data.wateruse_photo + "</b>"
                 );

                 graphic.setInfoTemplate(infoTemplate);

                 //畫點
                 this.arcMap.graphics.add(graphic);

                 //把目標置中

                 this.arcMap.setScale(1037);
                 this.arcMap.centerAt(_point);
             },
             ViewProjectMent: function (_data) {
                 for (var i in _data) {
                     var _point = new Point(_data[i].seat_x, _data[i].seat_y, this.arcMap.spatialReference);

                     var infoTemplate = new InfoTemplate();

                     var graphic = new Graphic(_point, new PictureMarkerSymbol(Mappointimg, 28, 28));
                     
                     var proj_type = "";
                     switch (_data[i].proj_type.toString()) {
                         case "0":
                             proj_type = "可行性評估";
                             break;
                         case "1":
                             proj_type = "規劃案";
                             break;
                         case "2":
                             proj_type = "設計案";
                             break;
                         case "3":
                             proj_type = "工程案(含維護)";
                             break;
                         case "4":
                             proj_type = "竣工";
                             break;
                     }

                     infoTemplate.setContent(
                         "<b>發包類別: </b>" + proj_type + "<br/>" +
                         "<b>案件年度: </b>" + _data[i].proj_year + "<br/>" +
                         "<b>案件編號: </b>" + _data[i].proj_num + "<br/>" +
                         "<b>案件名稱: </b>" + _data[i].proj_name + "<br/>" +
                         "<b>所屬鄉鎮市: </b>" + _data[i].seat_town + "<br/>" +
                         "<b>所屬水系: </b>" + _data[i].seat_water + "<br/>" +
                         "<b>工程類別: </b>" + _data[i].proj_class
                     );

                     graphic.setInfoTemplate(infoTemplate);

                     //畫點
                     this.arcMap.graphics.add(graphic);
                 }
             },
             ViewCaseQuery: function(_data) {
                 var TotalExtent = null;
                 
                 for (var i in _data) {
                     var polygonDdata = null;

                     if (_data[i].LandTown != null && _data[i].LandSec_cns != null && _data[i].Land_no != null) {
                         var ServiceUrl2 = "https://wragis.e-land.gov.tw/arcgis/rest/services/HDST/HDST_m/MapServer/2003";
                         var _where = "鄉鎮市區名='" + _data[i].LandTown + "' and 地段名稱='" + _data[i].LandSec_cns + "' and 地號='" + _data[i].Land_no + "'";
                         var data = { f: "pjson", where: _where, outFields: "地號", orderByFields: '地號 ASC', returnGeometry: true, returnDistinctValues: false };
                         var geo = AjaxGisGetGeo(ServiceUrl2, data, "");
                         polygonDdata = geo[0].rings;
                     }

                     //如果沒有位置資料就拿工程位置
                     //if (_data[i].Position == null) {
                         
                     //}
                     //else {
                     //    //原本的資料是JSON陣列字串
                     //    //var reStr = _data[i].Position.replace(/\”/g, '"').replace(/，/g, ',');
                     //    //var _polygonJson = $.parseJSON(reStr);
                     //    //polygonDdata = _polygonJson[0].rings;
                     //}

                     if (polygonDdata == null) { continue; }

                     var _spatialReference = this.arcMap.spatialReference

                     var _polygon = new Polygon({ rings: polygonDdata, "spatialReference": _spatialReference });

                     var infoTemplate = new InfoTemplate();
                     infoTemplate.setContent(
                         "<b>申請人: </b>" + _data[i].UserName + "<br/>" +
                         "<b>申請年度: </b>" + _data[i].UseYear + "<br/>" +
                         "<b>申請日期: </b>" + _data[i].UseDay + "<br/>" +
                         "<b>鄉鎮: </b>" + _data[i].Town + "<br/>" +
                         "<b>申請類別: </b>" + _data[i].UseClass + "<br/>" +
                         "<b>工程名稱: </b>" + _data[i].UseContent + "<br/>" +
                         "<b>通訊地址: </b>" + _data[i].LocalAddr + "<br/>" +
                         "<b>申請(工程)土地位置: </b>" + _data[i].UseLand + "<br/>" +
                         "<b>水道名稱: </b>" + _data[i].WaterwayName + "<br/>" +
                         "<b>溝渠地號: </b>" + _data[i].UseLand
                     );

                     
                     

                     var _SimpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 1]));

                     var graphic = new Graphic(_polygon, _SimpleFillSymbol);

                     graphic.setInfoTemplate(infoTemplate);

                     
                     this.arcMap.graphics.add(graphic);

                     //合併範圍
                     if (TotalExtent == null) {
                         TotalExtent = _polygon.getExtent();
                     }
                     else {
                         TotalExtent.union(_polygon.getExtent());
                     }
                     
                 }

                 if (TotalExtent != null) {
                     this.arcMap.setExtent(TotalExtent);
                 }
             },
             viewWell_Industry_Basic_Index: function (_data) {
                 //業者基本資料
                 debugger;
                 var WellExtent = null;//顯示範圍
                 var _spatialReference = this.arcMap.spatialReference
                 for (let i in _data) {

                     var infoTemplate = new InfoTemplate();

                     infoTemplate.setContent(
                         "<b>業者流水號: </b>" + _data[i].Industry_serial_number + "<br/>" +
                         "<b>業者編號: </b>" + _data[i].Vendor_ID + "<br/>" +
                         "<b>業者(事業)名稱: </b>" + _data[i].Business_name + "<br/>" +
                         "<b>代表人或負責人姓名: </b>" + _data[i].Name_representative_peron + "<br/>" +
                         "<b>營業處所(縣市): </b>" + _data[i].County + "<br/>" +
                         "<b>營業處所(鄉鎮市區): </b>" + _data[i].Town + "<br/>" +
                         "<b>營業處所地址: </b>" + _data[i].ADDRESS + "<br/>" +
                         "<b>聯絡電話: </b>" + _data[i].Contact_phone_number + "<br/>" +
                         "<b>用水標的: </b>" + _data[i].USALL + "<br/>" +
                         "<b>引用水源: </b>" + _data[i].Water_source + "<br/>" +
                         "<b>溫泉區流水號: </b>" + _data[i].Hot_spring_area_serial_number + "<br/>" +
                         "<b>溫泉區名稱: </b>" + _data[i].Spring_vein_partition_name + "<br/>" +
                         "<b>溫泉露頭名稱: </b>" + _data[i].Hot_spring_outcrop_name + "<br/>" +
                         "<b>溫泉開發完工證明文件字號: </b>" + _data[i].development_completion_certificate + "<br/>" +
                         "<b>水權狀號: </b>" + _data[i].Water_status_number + "<br/>" +
                         "<b>取供方式: </b>" + _data[i].Take_way + "<br/>" +
                         "<b>設立日期: </b>" + _data[i].Set_date + "<br/>" +
                         "<b>位置定位_經度E(度): </b>" + _data[i].LON + "<br/>" +
                         "<b>位置定位_緯度N(度) : </b>" + _data[i].LAT + "<br/>" +
                         "<b>位置定位TWD97_X(m): </b>" + _data[i].TWD97_X + "<br/>" +
                         "<b>位置定位TWD97_Y(m): </b>" + _data[i].TWD97_Y + "<br/>" +
                         "<b>備註: </b>" + _data[i].MEMO + "<br/>" +
                         "<b>資料維護人員: </b>" + _data[i].RECNAM + "<br/>" +
                         "<b>資料維護日期: </b>" + _data[i].DATREC + "<br/>" +
                         "<b>照片: </b>" + _data[i].Photo 
                     );
                     if (!_data[i].TWD97_X && !_data[i].TWD97_Y)
                         continue;
                     let _point = new Point(_data[i].TWD97_X, _data[i].TWD97_Y, this.arcMap.spatialReference);

                     let graphic = new Graphic(_point, new PictureMarkerSymbol(Mappointimg, 28, 28));

                     graphic.setInfoTemplate(infoTemplate);
                     //畫點
                     let timer = null;
                     let self = this;
                     timer = setInterval(function () {
                         if (self.arcMap.graphics) {
                             self.arcMap.graphics.add(graphic);
                             clearInterval(timer);
                         }
                     }, 1000)
                     this.arcMap.centerAndZoom(_point, 7);

                     //為了取得顯示範圍
                     var _polygon = new Polygon({ rings: [[[_data[i].TWD97_X, _data[i].TWD97_Y]]], "spatialReference": _spatialReference });

                     if (WellExtent == null) {
                         WellExtent = _polygon.getExtent();
                     }
                     else {
                         WellExtent.union(_polygon.getExtent());
                     }
                 }
                 //移動到設定的範圍
                 if (WellExtent != null) {
                     this.arcMap.setExtent(WellExtent);
                 }
             },
             viewWell_Basic_Index: function (_data) {
                 //水井基本資料
                 debugger;
                 var WellExtent = null;//顯示範圍
                 var _spatialReference = this.arcMap.spatialReference
                 for (let i in _data) {

                     var infoTemplate = new InfoTemplate();

                     infoTemplate.setContent(
                         "<b>水井流水號: </b>" + _data[i].Hot_water_well_serial_number + "<br/>" +
                         "<b>水井編號: </b>" + _data[i].Hot_spring_well_number + "<br/>" +
                         "<b>水井辨識標籤編號: </b>" + _data[i].Well_identification_label_number + "<br/>" +
                         "<b>水權狀號: </b>" + _data[i].Water_status_number + "<br/>" +
                         "<b>水井名稱: </b>" + _data[i].Hot_spring_well_name + "<br/>" +
                         "<b>所屬業者流水號: </b>" + _data[i].Industry_serial_number + "<br/>" +
                         "<b>所屬業者(事業)名稱: </b>" + _data[i].Business_name + "<br/>" +
                         "<b>溫泉區名稱: </b>" + _data[i].Spring_vein_partition_name + "<br/>" +
                         "<b>溫泉露頭名稱: </b>" + _data[i].Hot_spring_outcrop_name + "<br/>" +
                         "<b>設置日期: </b>" + _data[i].Set_date + "<br/>" +
                         "<b>位置定位_經度E(度): </b>" + _data[i].LON + "<br/>" +
                         "<b>位置定位_緯度N(度): </b>" + _data[i].LAT + "<br/>" +
                         "<b>位置定位TWD97_X(m): </b>" + _data[i].TWD97_X + "<br/>" +
                         "<b>位置定位TWD97_Y(m): </b>" + _data[i].TWD97_Y + "<br/>" +
                         "<b>位置說明: </b>" + _data[i].Location_description + "<br/>" +
                         "<b>備註: </b>" + _data[i].MEMO + "<br/>" +
                         "<b>資料維護人員: </b>" + _data[i].RECNAM + "<br/>" +
                         "<b>資料維護日期 : </b>" + _data[i].DATREC + "<br/>" +
                         "<b>照片: </b>" + _data[i].Photo + "<br/>" +
                         "<b>新舊案別: </b>" + _data[i].NewOldCase 
                     );
                     if (!_data[i].TWD97_X && !_data[i].TWD97_Y)
                         continue;
                     let _point = new Point(_data[i].TWD97_X, _data[i].TWD97_Y, this.arcMap.spatialReference);

                     let graphic = new Graphic(_point, new PictureMarkerSymbol(Mappointimg, 28, 28));

                     graphic.setInfoTemplate(infoTemplate);
                     //畫點
                     let timer = null;
                     let self = this;
                     timer = setInterval(function () {
                         if (self.arcMap.graphics) {
                             self.arcMap.graphics.add(graphic);
                             clearInterval(timer);
                         }
                     }, 1000)

                     //為了取得顯示範圍
                     var _polygon = new Polygon({ rings: [[[_data[i].TWD97_X, _data[i].TWD97_Y]]], "spatialReference": _spatialReference });

                     if (WellExtent == null) {
                         WellExtent = _polygon.getExtent();
                     }
                     else {
                         WellExtent.union(_polygon.getExtent());
                     }
                 }
                 //移動到設定的範圍
                 if (WellExtent != null) {
                     this.arcMap.setExtent(WellExtent);
                 }
             },
             ViewWell_Index: function (_data) {
                 //複合式查詢

                 var WellExtent = null;//顯示範圍
                 var _spatialReference = this.arcMap.spatialReference
                 for (var i in _data) {

                     var infoTemplate = new InfoTemplate();

                     infoTemplate.setContent(
                         "<b>鄉鎮市: </b>" + _data[i].town + "<br/>" +
                         "<b>水井編號: </b>" + _data[i].wellno + "<br/>" +
                         "<b>所有人: </b>" + _data[i].owner + "<br/>" +
                         "<b>用水標的: </b>" + _data[i].target + "<br/>" +
                         "<b>水權狀號: </b>" + _data[i].well_number + "<br/>" +
                         "<b>地段: </b>" + _data[i].sec_cns + "<br/>" +
                         "<b>地號: </b>" + _data[i].land_no + "<br/>" +
                         "<b>用途說明: </b>" + _data[i].use_memo + "<br/>" +
                         "<b>QRCode: </b>" + _data[i].qrcode
                     );

                     var _point = new Point(_data[i].POINT_X, _data[i].POINT_Y, this.arcMap.spatialReference);

                     var graphic = new Graphic(_point, new PictureMarkerSymbol(Mappointimg, 28, 28));

                     graphic.setInfoTemplate(infoTemplate);
                     //畫點
                     this.arcMap.graphics.add(graphic);

                     //為了取得顯示範圍
                     var _polygon = new Polygon({ rings: [[[_data[i].POINT_X, _data[i].POINT_Y]]], "spatialReference": _spatialReference });

                     if (WellExtent == null) {
                         WellExtent = _polygon.getExtent();
                     }
                     else {
                         WellExtent.union(_polygon.getExtent());
                     }
                 }
                 //移動到設定的範圍
                 if (WellExtent != null) {
                     this.arcMap.setExtent(WellExtent);
                 }
             },
             clearTempGraphic: function () {
                 this.drawArrays = [];
                 this.arcMap.graphics.clear();
             },
             Print: function (obj) {
                 var params = new PrintParameters();
                 params.map = this.arcMap;

                 var template = new PrintTemplate();
                 if (obj != undefined) {
                     template.exportOptions = {
                         width : obj.width,
                         height : obj.height,
                         dpi : obj.dpi
                     }
                     params.template = template;
                 }

                 var root = this;
                 this.printTask.execute(params, function (result) {
                     root.emit('PrintCompleted', result.url);
                 });
             },
             customizedprint: function (obj) {
                 var template = new PrintTemplate();
                 //template.exportOptions = {
                 //    width: 500,
                 //    height: 1400,
                 //    dpi: 96
                 //};
                 //template.format = "PDF";
                 template.preserveScale = true;
                 if (obj.scale != null) {
                     template.outScale = obj.scale;
                 }
                 template.layout = 'A3 Portrait';
                 template.layoutOptions = {
                     //"authorText": "testsdasdasdasdasdasdasdsadasdasdasdasdasdasda",
                     //"copyrightText": "<copyright info here>",
                     //"legendLayers": [],
                     "titleText": "歷史航照影像圖            圖號:" + obj.mapno,
                     "scalebarUnit": "Miles",
                     "customTextElements": [{ "Content": obj.content }]
                 };


                 var params = new PrintParameters();
                 params.map = this.arcMap;
                 params.template = template;

                 var root = this;
                 this.printTask.execute(params, function (result) {
                     root.emit('PrintCompleted', result.url);
                 });
             },
             fenceToShp: function (layername) {
                 this.fenceLayerName = layername;
                 this.fenceToShpDraw.activate(Draw.POLYGON);
             },
             startMeasure: function (div) {
                 esri.bundle.widgets.measurement.NLS_area = "量測面積";
                 esri.bundle.widgets.measurement.NLS_distance = "量測距離";
                 esri.bundle.widgets.measurement.NLS_location = "座標資訊"

                 this.measurement = new Measurement({
                     map: this.arcMap,
                     defaultAreaUnit: Units.SQUARE_METERS,
                     defaultLengthUnit: Units.METERS
                 }, dom.byId(div));
                 this.measurement.startup();

             },
             stopMeasure:function(){
                 this.measurement.setTool("area", false);
                 this.measurement.setTool("distance", false);
                 this.measurement.setTool("location", false);
                 this.measurement.clearResult();
             },
             startDrawGraphic: function (gType, groupId, hexcolor) {
                 if (hexcolor != null) {
                     this.drawcolor = Color.fromHex(hexcolor);
                 }
                 var retgType = null;
                 switch (gType) {
                     case OpgType.Polygon:
                         retgType = Draw.POLYGON;
                         break;
                     case OpgType.Line:
                         retgType = Draw.POLYLINE;
                         break;
                     case OpgType.Point:
                         retgType = Draw.POINT;
                         break;
                 }
                 this._isDrawing = true;
                 //this.arcMap.disablePan();
                 this.drawTool.activate(retgType);
                 this.drawCurGroupId = groupId;

             },
             stopDrawGraphic: function () {
                 this._isDrawing = false;
                 this.arcMap.enablePan();
                 this.drawTool.deactivate();
             },
             getDrawGraphics: function (groupId) {
                 var graphics = dojo.filter(this.drawArrays, function (item) {
                     return item.attributes.id == groupId;
                 });
                 if (graphics.length > 0) {
                     var ret = [];
                     var gs = arrayUtils.map(graphics, function (g, index) {
                         return {
                             g: g.geometry
                         };
                     });
                     if (gs.length > 0) {
                         for (i = 0; i < gs.length ; i++) {
                             ret.push(gs[i].g);
                         }
                     }
                     return ret;
                 }
                 return null;
             },
             fitGeometry: function (geometrys) {
                 var root = this;
                 var et = null;
                 geometrys.forEach(function ShowResults(geometry, index, ar) {
                     if (geometry instanceof Polygon) {
                         et = et == null ? geometry.getExtent() : et.union(geometry.getExtent());
                     }
                     else if (geometry instanceof Polyline) {
                         try {
                             et = et == null ? geometry.getExtent() : et.union(geometry.getExtent());
                         } catch (ex) {
                             console.log("error index is " + index);
                             console.log(ex);
                         }
                     }
                     else if (geometry instanceof Point) {
                         et = et == null ? root._fun_point2Extent(geometry) : et.union(root._fun_point2Extent(geometry));
                     }
                     else if (geometry instanceof Multipoint) {
                         et = et == null ? geometry.getExtent() : et.union(geometry.getExtent());
                     } 
                 })
                 et.setSpatialReference(this.arcMap.spatialReference);
                 //this.arcMap.setExtent(this._bounds, true);
                 this.arcMap.setExtent(et, true);
             },
             fitGeometryXY:function(xys){
                 var geometrys = [];
                 for (i = 0; i < xys.length; i++) {
                     geometrys.push(new Point(xys[i][0], xys[i][1], this.arcMap.spatialReference));
                 }
                 this.fitGeometry(geometrys);
             },
             startupLegend: function (div, layers) {
                 var layerInfo = arrayUtils.map(layers, function (layer, index) {
                     return { layer: layer.layer.layer, title: layer.layer.id };
                 });
                 if (layerInfo.length > 0) {
                     var legendDijit = new Legend({
                         map: this.arcMap,
                         layerInfos: layerInfo
                     }, div);
                     legendDijit.startup();
                 }
             },
             startEdit: function (id) {
                 if (id == null) {
                     this._editStart = true;
                 }
                 else {
                     for (j = 0; j < this.arcMap.graphics.graphics.length; j++) {
                         if (this.arcMap.graphics.graphics[j].attributes != null && this.arcMap.graphics.graphics[j].attributes.id == id) {
                             this._editToolbar.activate(Edit.EDIT_VERTICES, this.arcMap.graphics.graphics[j]);
                             break;
                         }
                     }
                 }
             },
             endEdit: function () {
                 this._editStart = false;
                 this._editToolbar.deactivate();
             },
             startGmlLock: function () {
                 this.arcMap.snappingManager.alwaysSnap = true;
             },
             endGmlLock: function () {
                 this.arcMap.snappingManager.alwaysSnap = false;
             },
             _fun_point2Extent:function(point){
                 var offset = 10;
                 var ex = new Extent(point.x - offset, point.y - offset, point.x + offset, point.y + offset, this.arcMap.spatialReference);

                 return ex;
             },
             loadDrawGraphic: function (geometrys, groupId) {
                 var root = this;
                 root.drawCurGroupId = groupId;
                 geometrys.forEach(function ShowResults(geometry, index, ar) {
                     geometry.setSpatialReference(root.arcMap.spatialReference);
                     if (geometry instanceof Polygon) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.defPolygonSymbol, { "id": root.drawCurGroupId })));
                     }
                     else if (geometry instanceof Polyline) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.defLineSymbol, { "id": root.drawCurGroupId })));
                     }
                     else if (geometry instanceof Point) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.drawPointSymbol, { "id": root.drawCurGroupId })));
                     }
                 })     
             },
             removeDrawGraphic:function(groupId){
                 var graphics = dojo.filter(this.drawArrays, function (item) {
                     return item.attributes.id == groupId;
                 });
                 if (graphics.length > 0) {
                     for (i = 0; i < graphics.length; i++) {
                         this.arcMap.graphics.remove(graphics[i]);
                     }
                 }
                 this.drawArrays = [];
                 if (this.arcMap.graphics.graphics.length > 0) {
                     for (i = 0; i < this.arcMap.graphics.graphics.length; i++) {
                         if (this.arcMap.graphics.graphics[i].attributes !=null && this.arcMap.graphics.graphics[i].attributes.id != null) {
                             this.drawArrays.push(this.arcMap.graphics.graphics[i]);
                         }
                     }
                 }  
             },
             createWeiRoadLayer: function (caselist) {
                 //debugger;
                 var  weiroadlayer = new LayerCtrl({
                     id: 'Road'
                 });
                 weiroadlayer.layer.map = this.arcMap;
                 weiroadlayer.caselist = caselist;
                 //debugger;
                 weiroadlayer.layer.polygonSymbol = this.defPolygonSymbol;
                 weiroadlayer.layer.lineSymbol = this.defLineSymbol;
                 weiroadlayer.layer.pointSymbol = this.defPointSymbol;

                 return weiroadlayer;
             },
             setDrawPointIcon: function (path, w, h) {
                 this.defPointSymbol = new PictureMarkerSymbol(path, w, h);
             },
             putDrawicon: function (x, y) {
                 var geometry = new Point(x, y, this.arcMap.spatialReference);
                 this._drawGraphic = this.arcMap.graphics.add(new Graphic(geometry, this.defPointSymbol, { "draw": true }));
             },
             measureDistance: function () {
                 this.currTool = 'distance';
                 if (this._tempGraphic != null) {
                     this.arcMap.graphics.remove(this._tempGraphic);
                 }
                 if (this._tempGraphictxt != null) {
                     this.arcMap.graphics.remove(this._tempGraphictxt);
                 }
                 this.measureTool.activate(Draw.POLYLINE);
   
             },
             measureArea: function(){
                 this.currTool = 'area';
                 if (this._tempGraphic != null) {
                     this.arcMap.graphics.remove(this._tempGraphic);
                 }
                 if (this._tempGraphictxt != null) {
                     this.arcMap.graphics.remove(this._tempGraphictxt);
                 }
                 this.measureTool.activate(Draw.POLYGON);
             },
             loadSharpZip: function (path, id) {
                 //debugger;
                 var root = this;
                 var portalUrl = "https://www.arcgis.com";
                 var fileName = path.split(".")[0];
                 var params = {
                     'name': fileName,
                     'targetSR': this.arcMap.spatialReference,
                     'maxRecordCount': 1000,
                     'enforceInputFileSizeLimit': true,
                     'enforceOutputJsonSizeLimit': true
                 };
                 var extent = scaleUtils.getExtentForScale(this.arcMap, 40000);
                 var resolution = extent.getWidth() / this.arcMap.width;
                 params.generalize = true;
                 params.maxAllowableOffset = resolution;
                 params.reducePrecision = true;
                 params.numberOfDigitsAfterDecimal = 0;
                 var myContent = {
                     'filetype': 'shapefile',
                     'publishParameters': JSON.stringify(params),
                     'f': 'json',
                     'callback.html': 'textarea'
                 };
                 request({
                     url: portalUrl + '/sharing/rest/content/features/generate',
                     content: myContent,
                     form: dom.byId(id),
                     handleAs: 'json',
                     load: lang.hitch(this, function (response) {
                         //debugger;
                         if (response.error) {
                             root.emit('UploadShpZipCompleted', { Issuccess: false, Info: error.message, features: null });
                             return;
                         }
                         if (response.featureCollection.layers.length > 1) {
                             root.emit('UploadShpZipCompleted', { Issuccess: false, Info: "超過一層", features: null });
                             return;
                         }
                         if (response.featureCollection.layers[0].featureSet.features.length == 0) {
                             root.emit('UploadShpZipCompleted', { Issuccess: false, Info: "圖層無物件", features: null });
                             return;
                         }
                         if (!t_addlayer && response.featureCollection.layers[0].featureSet.features[0].geometry.rings == null) {
                             root.emit('UploadShpZipCompleted', { Issuccess: false, Info: "圖層非Polygon", features: null });
                             return;
                         }
                         if (t_addlayer && response.featureCollection.layers[0].featureSet.features[0].geometry.paths != null) {
                             var layerName = response.featureCollection.layers[0].layerDefinition.name;

                             for (j = 0; j < response.featureCollection.layers[0].featureSet.features.length; j++) {
                                 var po = new Polyline(root.arcMap.spatialReference);
                                 for (i = 0; i < response.featureCollection.layers[0].featureSet.features[j].geometry.paths.length; i++) {
                                     po.addPath(response.featureCollection.layers[0].featureSet.features[j].geometry.paths[i]);
                                 }
                                 response.featureCollection.layers[0].featureSet.features[j].geometry = po;
                             }

                             root.emit('UploadShpZipCompleted', { Issuccess: true, Info: layerName, features: response.featureCollection.layers[0].featureSet.features });
                             return;
                         }
                         if (t_addlayer && response.featureCollection.layers[0].featureSet.features[0].geometry.x != null) {
                             var layerName = response.featureCollection.layers[0].layerDefinition.name;

                             for (j = 0; j < response.featureCollection.layers[0].featureSet.features.length; j++) {
                                 var po = new Point(response.featureCollection.layers[0].featureSet.features[j].geometry.x, response.featureCollection.layers[0].featureSet.features[j].geometry.y, root.arcMap.spatialReference);
                                 response.featureCollection.layers[0].featureSet.features[j].geometry = po;
                             }

                             root.emit('UploadShpZipCompleted', { Issuccess: true, Info: layerName, features: response.featureCollection.layers[0].featureSet.features });
                             return;
                         }
                         var layerName = response.featureCollection.layers[0].layerDefinition.name;
                        
                         for (j = 0; j < response.featureCollection.layers[0].featureSet.features.length; j++) {
                             var po = new Polygon(root.arcMap.spatialReference);
                             for (i = 0; i < response.featureCollection.layers[0].featureSet.features[j].geometry.rings.length; i++) {
                                 po.addRing(response.featureCollection.layers[0].featureSet.features[j].geometry.rings[i]);
                             }
                             response.featureCollection.layers[0].featureSet.features[j].geometry = po;
                         }

                         root.emit('UploadShpZipCompleted', { Issuccess: true, Info: layerName, features: response.featureCollection.layers[0].featureSet.features });

                         //debugger;
                         //var fullExtent;
                         //var layers = [];

                         //arrayUtils.forEach(response.featureCollection.layers, function (layer) {
                         //    var infoTemplate = new InfoTemplate("Details", "${*}");
                         //    var featureLayer = new FeatureLayer(layer, {
                         //        infoTemplate: infoTemplate
                         //    });
                         //    //associate the feature with the popup on click to enable highlight and zoom to
                         //    featureLayer.on('click', function (event) {
                         //        this.arcMap.infoWindow.setFeatures([event.graphic]);
                         //    });
                         //    //change default symbol if desired. Comment this out and the layer will draw with the default symbology
                         //    //changeRenderer(featureLayer);
                         //    fullExtent = fullExtent ?
                         //      fullExtent.union(featureLayer.fullExtent) : featureLayer.fullExtent;
                         //    layers.push(featureLayer);
                         //});
                         //debugger;
                         //fullExtent.setSpatialReference(this.arcMap.spatialReference);
                         //this.arcMap.addLayers(layers);
                         //this.arcMap.setExtent(fullExtent.expand(1.25), true);
                     }),
                     error: lang.hitch(this, function (error) {
                         root.emit('UploadShpZipCompleted', {Issuccess: false, Info: error.message, features:null});
                     })
                 });
             
             },
             bufferClick: function (m) {
                 this._isbufferclick = true;
                 this._bufferdistance = m;
             },
             pointBuffer: function (x, y, m) {
                 this._bufferdistance = m;

                 var mpoint = new Point(x, y, this.arcMap.spatialReference);

                 if (this.geometryService == null) {
                     alert('需設定geomtryService ! ');
                     return;
                 }
                 //debugger;
                 var fun = eval(this.loadfun);
                 if (fun != null) {
                     fun();
                 }
                 var params = new BufferParameters();
                 params.geometries = [mpoint];
                 params.distances = [this._bufferdistance];
                 params.unit = GeometryService.UNIT_METER;
                 params.outSpatialReference = this.arcMap.spatialReference;

                 var root = this;
                 this.geometryService.buffer(params, function (gs) {
                     root.emit('BufferCompleted', gs[0]);
                 });
             },
             gBuffer :function(geometry, m) {
                 this._bufferdistance = m;

                 geometry.setSpatialReference(this.arcMap.spatialReference);

                 if (this.geometryService == null) {
                     alert('需設定geomtryService ! ');
                     return;
                 }
                 //debugger;
                 var fun = eval(this.loadfun);
                 if (fun != null) {
                     fun();
                 }
                 var params = new BufferParameters();
                 params.geometries = [geometry];
                 params.distances = [this._bufferdistance];
                 params.unit = GeometryService.UNIT_METER;
                 params.outSpatialReference = this.arcMap.spatialReference;

                 var root = this;
                 this.geometryService.buffer(params, function (gs) {
                     root.emit('BufferCompleted', gs[0]);
                 });
             },
             insertGmlFeature: function (feature) {
                 //debugger;
                 this.removeGmlFeature(feature);

                 if (feature.points.length > 1) { //線

                     var Symbol = feature.OPCode == 0 ? this.gmlNewLineSymbol : feature.OPCode == 1 ? this.gmlUpdateLineSymbol : this.gmlDeleteLineSymbol;

                     var gLine = new Polyline(this.arcMap.spatialReference);
                     var paths = [];
                     for (i = 0; i < feature.points.length; i++) {
                         paths[i] = new Point(feature.points[i].x, feature.points[i].y, this.arcMap.spatialReference);
                     }
                     gLine.addPath(paths);
                     var graphic = new esri.Graphic(gLine, Symbol, { FacNum: feature.FacNum, CategCode: feature.CategCode });
                     this._gmlfeatures.push(graphic);
                     this.arcMap.graphics.add(graphic);
                 }
                 else {  //點

                     var Symbol = feature.OPCode == 0 ? this.gmlNewPointSymbol : feature.OPCode == 1 ? this.gmlUpdatePointSymbol : this.gmlDeletePointSymbol;

                     var gPoint = new Point(feature.points[0].x, feature.points[0].y, this.arcMap.spatialReference);
                     
                     var graphic = new esri.Graphic(gPoint, Symbol, { FacNum: feature.FacNum, CategCode: feature.CategCode });
                     this._gmlfeatures.push(graphic);
                     this.arcMap.graphics.add(graphic);
                 }
             },
             remarkGmlFeature: function (feature){
                 if (this._tempGraphic != null) {
                     this.arcMap.graphics.remove(this._tempGraphic);
                 }
                 if (feature.points.length > 1) { //線

                     var Symbol = this.gmlMarkFacLineSymbol;

                     var gLine = new Polyline(this.arcMap.spatialReference);
                     var paths = [];
                     for (i = 0; i < feature.points.length; i++) {
                         paths[i] = new Point(feature.points[i].x, feature.points[i].y, this.arcMap.spatialReference);
                     }
                     gLine.addPath(paths);
                     this._tempGraphic = new esri.Graphic(gLine, Symbol, { FacNum: feature.FacNum, CategCode: feature.CategCode });
                     this.arcMap.graphics.add(this._tempGraphic);
                 }
                 else {  //點

                     debugger;
                     var Symbol = this.gmlMarkFacPointSymbol;
                     var gPoint = new Point(feature.points[0].x, feature.points[0].y, this.arcMap.spatialReference);
                     this._tempGraphic = new esri.Graphic(gPoint, Symbol, { FacNum: feature.FacNum, CategCode: feature.CategCode });
                     this.arcMap.graphics.add(this._tempGraphic);
                 }
             },
             getHeatImg: function () {
                 if (this.arcMap._mapImageLyr != null) {
                     return this.arcMap._mapImageLyr._mapImages[this.arcMap._mapImageLyr._mapImages.length - 1].href;
                 }
                 else {
                     return "";
                 }
             },
             stringtogeometry: function (str) {
                 //str = '{"rings":[[[326579.23248291015,2769415.123474121],[326784.28887939453,2769481.270690918],[326929.81268310546,2769203.452270508],[326030.2106933594,2768588.283508301],[325613.4832763672,2768561.824523926],[325606.8687133789,2768912.404724121],[326579.23248291015,2769415.123474121]],[[328715.787109375,2768780.1102905273],[328887.76971435546,2768806.569091797],[328881.15509033203,2768813.183898926],[330184.2548828125,2768151.7119140625],[330290.0902709961,2768032.646911621],[328715.787109375,2768780.1102905273]]]}';
                 var g = null;
                 if (str.indexOf("x") > 0) {
                     g = new Point(JSON.parse(str));
                     g.setSpatialReference(this.arcMap.spatialReference);
                 }
                 else if (str.indexOf("paths") > 0) {
                     g = new Polyline(JSON.parse(str));
                     g.setSpatialReference(this.arcMap.spatialReference);
                 }
                 else if (str.indexOf("rings") > 0) {
                     g = new Polygon(JSON.parse(str));
                     g.setSpatialReference(this.arcMap.spatialReference);
                 }
                 else if (str.indexOf("points") > 0) {
                     g = new Multipoint(JSON.parse(str));
                     g.setSpatialReference(this.arcMap.spatialReference);
                 }
                 return g;
             },
             removeGmlFeature: function (feature) {
                 if (this._gmlfeatures.length == 0) {
                     return;
                 }
                 for (i = 0; i < this._gmlfeatures.length ; i++) {
                     if (this._gmlfeatures[i].attributes.FacNum == feature.FacNum && this._gmlfeatures[i].attributes.CategCode == feature.CategCode) {
                         this.arcMap.graphics.remove(this._gmlfeatures[i]);
                         this._gmlfeatures.splice(i, 1);
                         break;
                     }
                 }
             }
         });


         return WeiMap;
     });