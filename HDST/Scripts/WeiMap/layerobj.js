require(['dojo/_base/declare', "dojo/Evented", "esri/layers/WMTSLayer", "esri/layers/WMTSLayerInfo", "esri/layers/TileInfo", "esri/geometry/Extent",
    "esri/SpatialReference", "esri/layers/WMSLayer", "esri/layers/WMSLayerInfo", "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/symbols/SimpleFillSymbol",
    "esri/graphic", "dojo/_base/lang", "dojo/_base/array", "esri/layers/LabelLayer", "esri/symbols/TextSymbol",
    "esri/renderers/SimpleRenderer", "esri/tasks/query", "esri/renderers/ClassBreaksRenderer", "extras/WeiYiRoadLayer",
    "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/tasks/QueryTask",
    "esri/geometry/Polygon", "esri/renderers/UniqueValueRenderer", "esri/symbols/SimpleLineSymbol", "esri/Color",
    "esri/renderers/HeatmapRenderer", "extras/WeiRainLayer", "esri/dijit/PopupTemplate", "esri/geometry/Multipoint",
    "esri/layers/WebTiledLayer", "esri/geometry/Polyline", "esri/layers/KMLLayer", "esri/tasks/ProjectParameters",
    "extras/WeiChart"],
    function (declare, Evented, WMTSLayer, WMTSLayerInfo, TileInfo, Extent, SpatialReference, WMSLayer, WMSLayerInfo,
        ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, FeatureLayer, InfoTemplate, SimpleFillSymbol,
        Graphic, lang, arrayUtils, LabelLayer, TextSymbol, SimpleRenderer, Query, ClassBreaksRenderer, WeiYiRoadLayer,
        Point, SimpleMarkerSymbol, PictureMarkerSymbol, QueryTask, Polygon, UniqueValueRenderer, SimpleLineSymbol,
        Color, HeatmapRenderer, WeiRainLayer, PopupTemplate, Multipoint, WebTiledLayer, Polyline, KMLLayer,
        ProjectParameters, WeiChart) {
        var WeiLayer = declare("WeiLayer", [Evented], {
            url: '',
            layer: null,
            layertype: '',
            map: null,
            arc: null,
            id: '',
            visible: false,
            pointSymbol: null,
            lineSymbol: null,
            polygonSymbol: null,
            caselist: null,
            ImageurlList: [],
            Snappingable: false,
            showLabels: true,
            _tempGraphic: null,
            _tempLayerClickGraphic: null,
            _isShowFeatureData: true,
            _labelLayer: null,
            _render: null,
            _weiroadlayerbreaks: {},
            _getinfo: null,
            _layerDefinitions: [],

            constructor: function (options) {
                this.url = options.url;
                this.layer = null;
                this.layertype = options.layertype || OpLayerType.nlsc97;
                this.map = null;
                this.id = options.id;
                this.visible = options.visible || false;
                this.caselist = options.caselist || null;
                this.ImageurlList = options.ImageurlList || [];
                this.Snappingable = options.Snappingable || false;
                this.showLabels = options.showLabels == undefined ? true : options.showLabels;
            },
            show: function () {
                if (this._check()) {
                    this.layer.show();
                }
            },
            hide: function () {
                if (this._check()) {
                    this.map.infoWindow.hide();
                    if (this.layer instanceof FeatureLayer) {
                        this.layer.clearSelection();
                    }
                    this.map.graphics.remove(this._tempGraphic);
                    this.layer.hide();

                }
            },
            AddToMap: function () {
                switch (this.layertype) {
                    case OpLayerType.nlsc97:
                        this._addwmtsnlsc(this.map.extent);
                        break;
                    case OpLayerType.nlscwms:
                        this._addwmsnlsc(this.map.extent);
                        break;
                    case OpLayerType.tgos97:
                        this._addtgos();
                        break;
                    case OpLayerType.tgos97image:
                        this._addtgosimage();
                        break;
                    case OpLayerType.ntpctiled:
                        this._addntpctiled();
                        break;
                    case OpLayerType.ntpcdynamic:
                        this._addntpcdynamic();
                        break;
                    case OpLayerType.mapserviceLayer:
                        this._addmapserviceLayer();
                        break;
                    case OpLayerType.featureLayer:
                        this._addfeatureserviceLayer();
                        break;
                    case OpLayerType.selectfeatureLayer:
                        this._addselectfeatureserviceLayer();
                        break;
                    case OpLayerType.aso97:
                        this._addAsoLayer(this.map.extent);
                        break;
                    case OpLayerType.weiRainLayer:
                        this._addWeiRainLayer(this.caselist, this.ImageurlList);
                        break;
                    case OpLayerType.KmlLayer:
                        this._addKmlLayer();
                        break;
                }
            },
            getLegend: function () {
                var root = this;
                var end = this.layer.url.toLowerCase().indexOf('/mapserver');
                var mapservicesurl = this.layer.url.substring(0, end + 10);
                var index = -1;
                if (this.layer instanceof FeatureLayer) {
                    index = this.layer.url.substring(end + 11, this.layer.url.length);
                }
                var handle = esri.request({
                    url: mapservicesurl + '/legend',
                    content: {
                        f: "json"
                    },
                    callbackParamName: 'callback',
                    handleAs: 'json',
                    load: lang.hitch(this, function (data) {
                        var layerLookup = {};
                        if (index > -1) {
                            var alayer = dojo.filter(data.layers, function (item) {
                                return item.layerId == index;
                            })[0];
                            var layerInfo = arrayUtils.map(alayer.legend, function (layer, index) {
                                return {
                                    label: layer.label,
                                    url: "data:image/png;base64," + layer.imageData
                                };
                            });
                            layerLookup['' + index] = layerInfo;
                        }
                        else {
                            for (i = 0; i < data.layers.length; i++) {
                                var alayer = dojo.filter(data.layers, function (item) {
                                    return item.layerId == data.layers[i].layerId;
                                })[0];

                                var layerInfo = arrayUtils.map(alayer.legend, function (layer, index) {
                                    return {
                                        label: layer.label,
                                        url: "data:image/png;base64," + layer.imageData
                                    };
                                });
                                layerLookup['' + data.layers[i].layerId] = layerInfo;
                            }
                        }
                        root.emit('LegendReturn', layerLookup);
                    }),
                    error: lang.hitch(this, function (err) {
                        alert(err);
                    })
                });


            },
            setOpacity: function (opacity) {
                if (this.layertype == OpLayerType.mapserviceLayer || this.layertype == OpLayerType.featureLayer) {
                    this.layer.setOpacity(opacity);
                }
                else {
                    alert('this layer can not set opacity!');
                }
            },
            setFeatureInfo: function (getinfo) {
                this._getinfo = getinfo;
                var root = this;
                if (this.layertype == OpLayerType.featureLayer) {
                    this.layer.on("click", function (evt) {
                        //debugger;
                        if (root.arc._tempGraphic != null) {
                            root.map.graphics.remove(root.arc._tempGraphic);
                        }
                        if (root._isShowFeatureData) {
                            var o = null;
                            if (evt.graphic.attributes.OBJECTID == undefined) {
                                o = getinfo(evt.graphic.attributes)
                            }
                            else {
                                o = getinfo(evt.graphic.attributes.OBJECTID);
                            }
                            root.map.infoWindow.setTitle(o.title);
                            root.map.infoWindow.setContent(o.content);
                            root.map.infoWindow.resize(o.w, o.h);
                            root.map.infoWindow.show(evt.mapPoint);

                            //debugger;
                            if (evt.graphic.geometry.type == 'polygon') {
                                root.arc._tempGraphic = new Graphic(evt.graphic.geometry, root.arc.defPolygonSymbol);
                                root.map.graphics.add(root.arc._tempGraphic);
                            }
                            else if (evt.graphic.geometry.type == 'polyline') {
                                root.arc._tempGraphic = new Graphic(evt.graphic.geometry, root.arc.defLineSymbol);
                                root.map.graphics.add(root.arc._tempGraphic);
                            }
                            else if (evt.graphic.geometry.type == 'point') {
                                //debugger;
                                root.arc._tempGraphic = new Graphic(evt.graphic.geometry, new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 0, 255]), 1), new Color([0, 255, 0, 0])));
                                root.map.graphics.add(root.arc._tempGraphic);
                            }
                        }
                        else {
                            root.layer.clearSelection();
                        }

                    });
                }
                else if (this.layer instanceof WeiYiRoadLayer) {
                    //debugger;
                    this.layer.fun = getinfo;
                }
                else {
                    alert('this layer can not set FeatureInfo!');
                }

            },
            setFeatureCickable: function (clickable) {
                this._isShowFeatureData = clickable;
            },
            getfraturesbyXY: function (x, y) {
                var p = new Point(x, y, this.map.spatialReference);
                this.getfraturesbyGeo(p);
            },
            getfraturesbyGeo: function (g) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('this layer not support!');
                    return;
                }
                var root = this;
                var query = new Query();
                query.outFields = ["OBJECTID"];
                //debugger;
                if (g.length != null && g.length > 0) {
                    var mg = Multipoint(this.map.spatialReference);
                    for (i = 0; i < g.length; i++) {
                        mg.addPoint(g[i]);
                    }
                    query.spatialRelationship = Query.SPATIAL_REL_RELATION;
                    query.geometry = mg;
                }
                else {
                    if (g.type == 'polygon') {
                        query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;//Query.SPATIAL_REL_CONTAINS; 
                    }
                    else if (g.type == 'point') {
                        query.spatialRelationship = Query.SPATIAL_REL_WITHIN;
                    }
                    else if (g.type == 'polyline') {
                        query.spatialRelationship = Query.SPATIAL_REL_CROSSES;
                    }
                    query.geometry = g;
                }

                query.returnGeometry = true;
                this.layer.setSelectionSymbol(this.arc.defPolygonSymbol);
                this.layer.selectFeatures(query, FeatureLayer.MODE_ONDEMAND, function (result) {
                    var gs = arrayUtils.map(result, function (g, index) {
                        return {
                            attributes: g.attributes,
                            objid: g.attributes.OBJECTID,
                            g: g.geometry
                        };
                    });
                    root.emit('QueryCompleted', gs);
                });
            },
            getfeatures: function (strwhere) {
                //debugger;
                if (!this.layer instanceof FeatureLayer) {
                    alert('this layer not support!');
                    return;
                }
                //if (this.arc._tempGraphic != null) {
                //    this.map.graphics.remove(this._tempGraphic);
                //}
                var root = this;
                if (root.arc._tempGraphic != null) {
                    root.map.graphics.remove(root.arc._tempGraphic);
                }

                var query = new Query();
                query.outFields = ["OBJECTID"];
                query.where = strwhere;
                query.maxAllowableOffset = 0.0000001;
                query.returnGeometry = true;
                this.layer.setSelectionSymbol(this.arc.defPolygonSymbol);
                this.layer.selectFeatures(query, FeatureLayer.MODE_SELECTION, function (result) {

                    var gs = arrayUtils.map(result, function (g, index) {
                        return {
                            attributes: g.attributes,
                            objid: g.attributes.OBJECTID,
                            g: g.geometry
                        };
                    });
                    if (root._getinfo != null) {
                        root.map.infoWindow.hide();
                        //root.arc.fitGeometry([gs[0].g]);
                        var o = root._getinfo(gs[0].objid);
                        root.map.infoWindow.setTitle(o.title);
                        root.map.infoWindow.setContent(o.content);
                        root.map.infoWindow.resize(o.w, o.h);
                        //root.arc.loadDrawGraphic([gs[0].g], 1);

                        if (gs[0].g instanceof Polygon) {
                            root.arc._tempGraphic = new Graphic(gs[0].g, root.arc.defPolygonSymbol);
                            root.map.graphics.add(root.arc._tempGraphic);
                            root.map.infoWindow.show(gs[0].g.getPoint(0, 0));
                            root.arc.fitGeometry([gs[0].g]);
                        }
                        else if (gs[0].g instanceof Polyline) {
                            root.arc._tempGraphic = new Graphic(gs[0].g, root.arc.defLineSymbol);
                            root.map.graphics.add(root.arc._tempGraphic);
                            root.map.infoWindow.show(gs[0].g.getPoint(0, 0));
                            root.arc.fitGeometry([gs[0].g]);
                        }
                        else if (gs[0].g instanceof Point) {
                            root.arc._tempGraphic = new Graphic(gs[0].g, new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 0, 255]), 1), new Color([0, 255, 0, 0])));
                            root.map.graphics.add(root.arc._tempGraphic);
                            root.map.infoWindow.show(gs[0].g);
                            root.arc.fitGeometry([gs[0].g]);
                        }
                    }
                    root.emit('QueryCompleted', gs);
                });

            },
            getSpatialFeatures: function (geometry) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('this layer not support!');
                    return;
                }
                var root = this;
                geometry.spatialReference = this.map.spatialReference;
                var g = new Polygon(this.map.spatialReference);
                g.addRing(geometry.rings[0]);
                var queryTask = new QueryTask(this.layer.url);
                var query = new Query();
                query.returnGeometry = true;
                query.outFields = ["OBJECTID"];
                query.geometry = g;
                query.spatialRelationship = Query.SPATIAL_REL_CONTAINS;
                queryTask.execute(query, function (result) {
                    var gs = arrayUtils.map(result.features, function (g, index) {
                        return {
                            attributes: g.attributes,
                            objid: g.attributes.OBJECTID,
                            g: g.geometry
                        };
                    });
                    root.emit('QueryCompleted', gs);
                }, function (error) {
                    //debugger;
                });

            },
            showText: function (field) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('this layer not support!');
                    return;
                }
                if (this._labelLayer != null) {
                    return;
                }
                this._labelLayer = new LabelLayer({ id: this.id + 'lab', mode: "DYNAMIC" });
                var symbol = new TextSymbol();
                symbol.font.setSize("8pt");
                symbol.font.setFamily("arial");
                var renderer = new SimpleRenderer(symbol);
                this._labelLayer.addFeatureLayer(this.layer, renderer, "{" + field + "}");
                this.map.addLayer(this._labelLayer);
            },
            setBreakPolygonRenderer: function (arg) {
                var symbol = new SimpleFillSymbol();
                symbol.setColor(new Color([150, 150, 150, 0.5]));
                var renderer = new ClassBreaksRenderer(symbol, arg.field);
                for (i = 0; i < arg.range.length; i++) {
                    var redColor = Color.fromHex(arg.range[i].color);
                    renderer.addBreak(arg.range[i].Min, arg.range[i].Max, new SimpleFillSymbol().setColor(redColor));
                }
                this.layer.setRenderer(renderer);

                this.layer.refresh();
                if (this._labelLayer != null) {
                    this._labelLayer.refresh();
                }
            },
            addWeiRoadLayerIcon: function (casetype, iconpath, w, h) {
                var intstatus = parseInt(casetype);
                intstatus = 1000000 + intstatus;
                var iconinfo = {};
                iconinfo.path = iconpath;
                iconinfo.h = h;
                iconinfo.w = w;
                this._weiroadlayerbreaks[intstatus] = iconinfo;
            },
            loadWeiChartData: function (caselist) {
                //debugger;
                var root = this;
                var gs = [];
                for (i = 0; i < caselist.length; i++) {
                    var pt = new Point(caselist[i].x, caselist[i].y, root.map.spatialReference);
                    var g = new Graphic(pt, null, { "value": caselist[i].value, "code": caselist[i].code });
                    gs.push(g);
                }
                this.layer = new WeiChart({
                    "id": "test",
                    "data": gs
                });
                root.map.addLayer(this.layer);
            },
            loadWeiRoadLayerData: function (caselist) {
                var root = this;
                var distance = root.map.getScale() / 3500;
                if (root.layer != null) {
                    root.map.removeLayer(root.layer);
                }
                var caseInfo = {};
                caseInfo.data = arrayUtils.map(caselist, function (p) {
                    var latlng = new Point(parseFloat(p.LocX), parseFloat(p.LocY), root.map.spatialReference);
                    var attributes = {
                        "CaseKey": p.CaseKey,
                        "CaseType": p.CaseType,
                        "AreaType": p.AreaType,
                        "CaseArea": p.CaseArea
                    };
                    return {
                        "x": latlng.x,
                        "y": latlng.y,
                        "attributes": attributes
                    };
                });
                //debugger;
                this.layer = new WeiYiRoadLayer({
                    "data": caseInfo.data,
                    "distance": distance,
                    "id": "clusters",
                    "labelColor": "#fff",
                    "labelOffset": 5,
                    "resolution": root.map.extent.getWidth() / root.map.width,
                    "singleColor": "#888",
                    "showSingles": true,
                    "PSymbol": root.polygonSymbol,
                    "LSymbol": root.lineSymbol,
                    "PointSymbol": root.pointSymbol
                });

                var defaultSym = new SimpleMarkerSymbol();
                root._renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

                var blue = new PictureMarkerSymbol(mapimgroot + "regionalicon-blue.png", 42, 42).setOffset(0, 15);
                var green = new PictureMarkerSymbol(mapimgroot + "regionalicon-blue.png", 52, 52).setOffset(0, 15);
                var red = new PictureMarkerSymbol(mapimgroot + "regionalicon-blue.png", 60, 60).setOffset(0, 15);
                root._renderer.addBreak(2, 9, blue);
                root._renderer.addBreak(10, 99, green);
                root._renderer.addBreak(100, 100001, red);
                for (var key in root._weiroadlayerbreaks) {
                    root._renderer.addBreak(key, key, new PictureMarkerSymbol(root._weiroadlayerbreaks[key].path, root._weiroadlayerbreaks[key].w, root._weiroadlayerbreaks[key].h));  //A1
                }
                this.layer.setRenderer(root._renderer);
                root.map.addLayer(this.layer);


            },
            markFeature: function (key, values) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('此圖層不支援!only for FeatureLayer');
                    return;
                }
                switch (this.layer.geometryType) {
                    case "esriGeometryPolygon":
                        var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
                        defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
                        var renderer = new UniqueValueRenderer(defaultSymbol, key);
                        for (i = 0; i < values.length; i++) {
                            renderer.addValue(values[i], new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0.5])));
                        }
                        this.layer.setRenderer(renderer);
                        this.layer.refresh();
                        break;
                    case "esriGeometryPolyline":
                        break;
                    case "esriGeometryPoint":
                        break;
                }
            },
            toHeatmap: function (keyfield, funtitle, funcontent) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('此圖層不支援!only for FeatureLayer');
                    return;
                }
                var template = new InfoTemplate();
                var ftitle = "${" + keyfield + ":" + funtitle + "}";
                var fcontent = "${" + keyfield + ":" + funcontent + "}";
                template.setTitle(ftitle);
                template.setContent(fcontent);
                this.layer.setInfoTemplate(template);

                var heatmapRenderer = new HeatmapRenderer({
                    blurRadius: 20,
                    colors: ["rgba(0, 0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 0)"],
                    //maxPixelIntensity: 150,
                    //minPixelIntensity: 10
                });
                this.layer.setRenderer(heatmapRenderer);
            },
            setDefinition: function (expression) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('此圖層不支援!only for FeatureLayer');
                    return;
                }
                this.layer.setDefinitionExpression(expression);
            },
            setDefinitions: function (index, expression) {
                if (!this.layer instanceof ArcGISDynamicMapServiceLayer) {
                    alert('此圖層不支援!only for ArcGISDynamicMapServiceLayer');
                    return;
                }
                this._layerDefinitions[index] = expression
                this.layer.setLayerDefinitions(this._layerDefinitions);
            },
            showSubLayer: function (id) {
                //debugger;
                if (!this.layer instanceof ArcGISDynamicMapServiceLayer) {
                    alert('this layer not support!');
                    return;
                }
                var ids = this.layer.visibleLayers == null ? [] : this.layer.visibleLayers;
                if (ids.indexOf(id) < 0) {
                    var vids = [];
                    for (var k = 0; k < ids.length; k++) {
                        var alayer = dojo.filter(this.layer.layerInfos, function (item) {
                            return item.id == ids[k];
                        })[0];
                        if (alayer.parentLayerId > 0) {
                            vids.push(ids[k]);
                        }
                        else if (alayer.subLayerIds == null) {
                            vids.push(ids[k]);
                        }
                    }
                    vids.push(id);
                    this.layer.setVisibleLayers(vids);
                }
            },
            hideSubLayer: function (id) {
                if (!this.layer instanceof ArcGISDynamicMapServiceLayer) {
                    alert('this layer not support!');
                    return;
                }
                var ids = this.layer.visibleLayers;
                var idindex = ids.indexOf(id);
                if (idindex > -1) {
                    var vids = [];
                    for (var k = 0; k < ids.length; k++) {
                        var alayer = dojo.filter(this.layer.layerInfos, function (item) {
                            return item.id == ids[k];
                        })[0];
                        if (alayer.parentLayerId > 0) {
                            if (ids[k] != id) {
                                vids.push(ids[k]);
                            }
                        }
                        else if (alayer.subLayerIds == null) {
                            if (ids[k] != id) {
                                vids.push(ids[k]);
                            }
                        }
                    }
                    this.layer.setVisibleLayers(vids);
                }
            },
            getSubVisableLayer: function () {
                if (!this.layer instanceof ArcGISDynamicMapServiceLayer) {
                    alert('this layer not support!');
                    return;
                }
                var ids = this.layer.visibleLayers;
                var vids = [];
                for (var k = 0; k < ids.length; k++) {
                    var alayer = dojo.filter(this.layer.layerInfos, function (item) {
                        return item.id == ids[k];
                    })[0];
                    if (alayer.parentLayerId > 0) {
                        vids.push(ids[k]);
                    }
                }
                return vids;
            },
            selectFeatures: function (where) {
                var root = this;
                var query = new Query();
                query.where = where;
                this.layer.setSelectionSymbol(this.arc.defPolygonSymbol);
                this.layer.selectFeatures(query, FeatureLayer.SELECTION_ADD, function (e) { root.emit('SelectCompleted', e) }, function (e) { });
            },
            selectGeoFeatures: function (x, y) {
                var root = this;
                var query = new Query();
                query.spatialRelationship = Query.SPATIAL_REL_WITHIN;
                query.geometry = new Point(x, y, this.map.spatialReference);
                this.layer.setSelectionSymbol(this.arc.defPolygonSymbol);
                this.layer.selectFeatures(query, FeatureLayer.SELECTION_ADD, function (e) { root.emit('SelectCompleted', e) }, function (e) { debugger; });
            },
            clearSelection: function () {
                this.layer.clearSelection();
            },
            clearClickGraphic: function () {
                if (this._tempLayerClickGraphic != null) {
                    this.map.graphics.remove(this._tempLayerClickGraphic);
                }
            },
            refresh: function () {
                this.layer.refresh();
            },
            _check: function () {
                if (this.map == null) {
                    alert('this layer not add to map');
                    return false;
                }
                else {
                    return true;
                }
            },
            _addtgos: function () {
                this.url = this.url == '' ? 'https://210.242.163.56/TgosProxy/proxy.ashx?http://api.tgos.nat.gov.tw/TileAgent/TGOSMAP.aspx' : this.url;

                this.layer = new SGSTileLayer(this.url, "", 0);
                this.layer.id = this.id;
                this.layer.visible = this.visible;
                //debugger;
                this.map.addLayer(this.layer);
            },
            _addtgosimage: function () {
                this.url = this.url == '' ? 'https://210.242.163.56/TgosProxy/proxy.ashx?http://api.tgos.nat.gov.tw/TileAgent/F2IMAGE.aspx' : this.url;

                this.layer = new SGSTileLayer(this.url, "", 0);
                this.layer.id = this.id;
                this.layer.visible = this.visible;
                //debugger;
                this.map.addLayer(this.layer);
            },
            _addwmtsnlsc: function (aExtent) {
                var tileInfo2 = new TileInfo({
                    "dpi": 90.714,
                    "format": "image/jpg",
                    "compressionQuality": 0,
                    "spatialReference": { wkid: 102443 },//"wkid": "102443"
                    "rows": 256,
                    "cols": 256,
                    "origin": {
                        "x": 50164.24,//-5952806.24528,
                        "y": 2999826.99//1.0971946007528E7
                    },
                    "lods": [
                        {
                            "level": 0,
                            "resolution": 3307.2982812632295,
                            "scale": 12500000
                        },
                        {
                            "level": 1,
                            "resolution": 2645.8386250105837,
                            "scale": 10000000
                        },
                        {
                            "level": 2,
                            "resolution": 1322.9193125052918,
                            "scale": 5000000
                        },
                        {
                            "level": 3,
                            "resolution": 661.4596562526459,
                            "scale": 2500000
                        },
                        {
                            "level": 4,
                            "resolution": 264.5838625010584,
                            "scale": 1000000
                        },
                        {
                            "level": 5,
                            "resolution": 132.2919312505292,
                            "scale": 500000
                        },
                        {
                            "level": 6,
                            "resolution": 66.1459656252646,
                            "scale": 250000
                        },
                        {
                            "level": 7,
                            "resolution": 26.458386250105836,
                            "scale": 100000
                        },
                        {
                            "level": 8,
                            "resolution": 13.229193125052918,
                            "scale": 50000
                        },
                        {
                            "level": 9,
                            "resolution": 6.614596562526459,
                            "scale": 25000
                        },
                        {
                            "level": 10,
                            "resolution": 2.6458386250105836,
                            "scale": 10000
                        },
                        {
                            "level": 11,
                            "resolution": 1.3229193125052918,
                            "scale": 5000
                        },
                        {
                            "level": 12,
                            "resolution": 0.6614596562526459,
                            "scale": 2500
                        },
                        {
                            "level": 13,
                            "resolution": 0.26458386250105836,
                            "scale": 1000
                        }
                    ]
                });
                var tileExtent2 = new Extent(50000, 2397000, 641000, 3000000, new SpatialReference({ wkid: 102443 }));
                var layerInfo2 = new WMTSLayerInfo({
                    tileInfo: tileInfo2,
                    fullExtent: tileExtent2,
                    initialExtent: aExtent,
                    identifier: "EMAP3826",
                    tileMatrixSet: "EPSG:3826",
                    format: "png",
                    style: "_null"
                });

                var resourceInfo = {
                    version: "1.0.0",
                    layerInfos: [layerInfo2], //layerInfo1, 
                    copyright: "open layer"
                };

                var options = {
                    serviceMode: "KVP",
                    resourceInfo: resourceInfo,
                    layerInfo: layerInfo2
                };

                //this.url = this.url == '' ? 'http://landmaps.nlsc.gov.tw/Maps97/wmts' : this.url;
                this.url = this.url == '' || this.url == null ? 'https://wmts.nlsc.gov.tw/97/wmts?' : this.url;
                //   this.layer = new WMTSLayer(this.url, options); //jack Mark
                //======jack=(預設電子地圖)===============
                //var urlTemplate = 'http://210.69.148.40/arcgis/rest/services/YiLanTerrain_3826_2013_20141231/MapServer/tile/{level}/{row}/{col}'; 
                //'http://maps.nlsc.gov.tw/S_Maps/wmts/EMAP5_OPENDATA/default/GoogleMapsCompatible/{level}/{row}/{col}';
                var urlTemplate = 'https://wmts.nlsc.gov.tw/97/wmts/PHOTO3826/default/default028mm/{level}/{row}/{col}';
                //https://wmts.nlsc.gov.tw/97/wmts/PHOTO3826/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}
                
                this.layer = new WebTiledLayer(urlTemplate, {
                    tileInfo: tileInfo2,
                    id: this.id,
                    visible: this.visible,
                    fullExtent: tileExtent2,
                    initialExtent: aExtent
                });
                //============================
                this.map.addLayer(this.layer);
            },
            _addWeiRainLayer: function (caselist, ImageurlList) {
                //debugger;
                var popupTemplate = PopupTemplate();
                popupTemplate.setContent(function (e) {
                    var table = "<table >";

                    table += "<tr>";
                    table += "<th align='left' width='80px'>";
                    table += "名稱:";
                    table += "</th>";
                    table += "<td>";
                    table += e.attributes.Name;
                    table += "</td>";
                    table += "</tr>";

                    table += "<tr>";
                    table += "<th align='left' width='80px'>";
                    table += "雨量:";
                    table += "</th>";
                    table += "<td>";
                    table += e.attributes.Amount + "毫米";
                    table += "</td>";
                    table += "</tr>";

                    table += "</table>";

                    return table;
                });
                this.layer = new WeiRainLayer({
                    "data": caselist,
                    "Template": popupTemplate,
                    "ImageurlList": ImageurlList
                });
                this.map.addLayer(this.layer);
            },
            _addAsoLayer: function (aExtent) {
                var layer1 = new WMSLayerInfo({
                    name: this.id,
                    title: this.id

                });
                var resourceInfo = {
                    extent: aExtent,
                    layerInfos: [layer1]
                };
                //this.url = this.url == '' ? 'https://wra.e-land.gov.tw/proxy/proxy.ashx?http://wms.afasi.gov.tw/asofb/wms' : this.url;
                this.url = this.url == '' ? 'http://wms.afasi.gov.tw/asofb/wms' : this.url;
                this.layer = new WMSLayer(this.url, {
                    resourceInfo: resourceInfo,
                    visibleLayers: ['ATIS_MNC'],
                    format: 'image/jpeg',
                    visible: this.visible
                });
                this.layer.imageFormat = 'image/jpeg';

                this.map.addLayer(this.layer);
            },
            _addwmsnlsc: function (aExtent) {
                var layer1 = new WMSLayerInfo({
                    name: this.id,
                    title: this.id
                });
                var resourceInfo = {
                    extent: aExtent,
                    layerInfos: [layer1]
                };

                this.url = this.url == '' ? 'http://maps.nlsc.gov.tw/S_Maps/wms' : this.url;
                this.layer = new WMSLayer(this.url, {
                    resourceInfo: resourceInfo,
                    visibleLayers: ['PHOTO2'],
                    visible: this.visible
                });
                this.layer.version = '1.1.1';

                this.map.addLayer(this.layer);
            },
            _addntpctiled: function () {
                this.url = this.url == '' ? 'https://gis1.ntpc.gov.tw/gis/rest/services/map/MapServer' : this.url;
                this.layer = new ArcGISTiledMapServiceLayer(this.url, {
                    id: this.id,
                    visible: this.visible
                });
                this.map.addLayer(this.layer);
            },
            _addntpcdynamic: function () {
                this.url = this.url == '' ? 'https://gis1.ntpc.gov.tw/gis/rest/services/map/MapServer' : this.url;
                this.layer = new ArcGISDynamicMapServiceLayer(this.url, {
                    id: this.id,
                    visible: this.visible
                })
                this.map.addLayer(this.layer);
            },
            _addmapserviceLayer: function () {
                this.layer = new ArcGISDynamicMapServiceLayer(this.url, {
                    id: this.id,
                    visible: this.visible
                })
                //this.layer.setDisableClientCaching(true);
                this.map.addLayer(this.layer);
            },
            _addfeatureserviceLayer: function () {
                this.layer = new FeatureLayer(this.url, {
                    id: this.id,
                    visible: this.visible,
                    showLabels: this.showLabels,
                    outFields: ["*"]//,
                    //infoTemplate: new InfoTemplate("World Regions", "Region: ${編號}")
                });
                var root = this;
                this.layer.on('click', function (evt) {
                    //debugger;
                    if (root._tempLayerClickGraphic != null) {
                        root.map.graphics.remove(root._tempLayerClickGraphic);
                    }
                    if (evt.graphic.geometry.type == 'point') {
                        root._tempLayerClickGraphic = new Graphic(evt.graphic.geometry, new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 0, 255]), 1), new Color([0, 255, 0, 0])));
                    }
                    else if (evt.graphic.geometry.type == 'polyline') {
                        root._tempLayerClickGraphic = new Graphic(evt.graphic.geometry, root.arc.defLineSymbol);
                    }
                    else if (evt.graphic.geometry.type == 'polygon') {
                        root._tempLayerClickGraphic = new Graphic(evt.graphic.geometry, root.arc.polygonSymbol);
                    }
                    //root.map.graphics.add(root._tempLayerClickGraphic);
                    var o = evt.graphic.attributes;
                    o.g = evt.graphic.geometry;
                    root.emit('LayerClick', o);
                });

                this.map.addLayer(this.layer);
            },
            _addselectfeatureserviceLayer: function () {
                this.layer = new FeatureLayer(this.url, {
                    mode: FeatureLayer.MODE_SELECTION,
                    id: this.id,
                    visible: this.visible,
                    outFields: ["*"]//,
                    //infoTemplate: new InfoTemplate("World Regions", "Region: ${編號}")
                });
                var root = this;
                this.layer.on('click', function (evt) {
                    //debugger;
                    if (root._tempLayerClickGraphic != null) {
                        root.map.graphics.remove(root._tempLayerClickGraphic);
                    }
                    if (evt.graphic.geometry.type == 'point') {
                        root._tempLayerClickGraphic = new Graphic(evt.graphic.geometry, new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([204, 0, 255]), 1), new Color([0, 255, 0, 0])));
                    }
                    else if (evt.graphic.geometry.type == 'polyline') {
                        root._tempLayerClickGraphic = new Graphic(evt.graphic.geometry, root.arc.defLineSymbol);
                    }
                    else if (evt.graphic.geometry.type == 'polygon') {
                        root._tempLayerClickGraphic = new Graphic(evt.graphic.geometry, root.arc.polygonSymbol);
                    }
                    root.map.graphics.add(root._tempLayerClickGraphic);
                    var o = evt.graphic.attributes;
                    o.g = evt.graphic.geometry;
                    root.emit('LayerClick', o);
                });

                this.map.addLayer(this.layer);

            },
            _addKmlLayer: function () {
                var root = this;
                this.layer = new KMLLayer(this.url);
                this.layer.visible = false;
                this.map.addLayer(this.layer);
                this.layer.on("load", function (evt) {
                    var kmlGeoms = arrayUtils.map(evt.layer.getLayers()[0].graphics, function (g) {
                        return g.geometry;
                    });
                    var params = new ProjectParameters();
                    params.geometries = kmlGeoms;
                    params.outSR = root.map.spatialReference;
                    var a = root.arc.geometryService;
                    a.project(params, function (projectedgeometrys) {
                        root.emit('LoadKmlCompleted', projectedgeometrys);
                    }, function (e) {
                        //debugger;
                    });
                });
            }
        });


        return WeiLayer;
    });