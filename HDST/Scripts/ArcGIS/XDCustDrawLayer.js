

/**
 * arcgis的自訂做畫圖層

*/
function XDCustDrawLayer(omap, LayerName) {
    var map = omap;
    var gLayer = map.getGraphicsLayer(LayerName);
    this.baseLayer = gLayer;

    this.clearPaths = function () {
        gLayer.clear();
        //map.DrawTool.clear();
        //map.clearSelection();

    }
    /**
 * 增加一個marker
*/
    this.addMarker = function (pt, iconUrl, id, txt, draggable) {
        var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(iconUrl, 20, 20);
        var grap = new esri.Graphic(pt, pictureMarkerSymbol);
        grap.id = id;
        gLayer.add(grap);

        //=======================
        if (txt != undefined) {
            var _font = new esri.symbol.Font();
            _font.setSize(18);
            _font.setWeight(esri.symbols.Font.WEIGHT_BOLD);
            var pt2 = new Point(grap.geometry.x, grap.geometry.y, map.spatialReference);
            var textSymbol = new esri.symbol.TextSymbol();
            textSymbol.setText(symtext[i]);
            textSymbol.setColor(new Color([0, 0, 0]));
            textSymbol.setFont(_font);
            textSymbol.setKerning(true);
            textSymbol.setOffset(0, -6);
            var grap = new esri.Graphic(pt2, textSymbol);
            grap.id = "t" + i;
            map.graphics.add(grap);
        }
        return grap;
    }
    //將wkt轉換成其他坐標    this.addImage = function (pt, myImagePath, base64str, id, txt, draggable) {
        var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol({ "angle": 0, "xoffset": 0, "yoffset": 0, "type": "esriPMS", "url": myImagePath, "imageData": base64str, "contentType": "image/png", "width": 18, "height": 18 });
        var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(iconUrl, 20, 20);
        var grap = new esri.Graphic(pt, pictureMarkerSymbol);
        grap.id = id;
        gLayer.add(grap);
        //=======================
        if (txt != undefined) {
            var _font = new esri.symbol.Font();
            _font.setSize(18);
            _font.setWeight(esri.symbols.Font.WEIGHT_BOLD);
            var pt2 = new Point(grap.geometry.x, grap.geometry.y, map.spatialReference);
            var textSymbol = new esri.symbol.TextSymbol();
            textSymbol.setText(symtext[i]);
            textSymbol.setColor(new Color([0, 0, 0]));
            textSymbol.setFont(_font);
            textSymbol.setKerning(true);
            textSymbol.setOffset(0, -6);
            var grap = new esri.Graphic(pt2, textSymbol);
            grap.id = "t" + i;
            map.graphics.add(grap);
        }
        return grap;
    }

    this.toWKT = function (geo, transA, toB) {

        switch (geo.type) {
            case "point":
                return PointToWKT(geo);
            case "polygon":
                return PolygonToWKT(geo);
            case "polyline":
                return LineToWKT(geo);
            case Default:
                alert("不支援");
        }


    }
    //將取消該功能 改由 createpolygon 取代
    this.DrawPolygon = function (path, style) {
        alert("將取消該功能 改由 CreatePolygon 取代")
        return this.CreatePolygon(path, style);
    }

    XDCustDrawLayer.prototype.getFeatureFromWKT = function (WKT) {
        var geo;//試過成功
        if (wkt.toUpperCase().indexOf("POLYGON") >= 0) {
            geo = WktToPolygon(wkt, map.spatialReference);
        } else if (wkt.toUpperCase().indexOf("POLYLINE") >= 0) {
            geo = WktToPolyline(wkt, map.spatialReference);

        } else if (wkt.toUpperCase().indexOf("POINT") >= 0) {
            geo = WktToPolyline(wkt, map.spatialReference);
        }
        return geo;
    }




    XDCustDrawLayer.prototype.DrawGeoFromWKT = function (wkt, transA, toB, style) {
        var geo = this.getFeatureFromWKT(wkt)
        switch (geo.type) {
            case "point":
                this.addMarker(geo);

                break;
            case "polygon":
                this.CreatePolygon(geo, style);
                break;
            case "polyline":
                this.CreatePolyLine(geo, style);
                break;
            case Default:
                alert("不支援");
        }
        return geo;
    }

    XDCustDrawLayer.prototype.DrawGeoFromWKTs = function (wkts, transA, toB, style) {
        var format = new ol.format.WKT();
        var features = []
        var g = wkts.split(';');
        for (i = 0; i < g.length; i++) {
            var feature = this.DrawGeoFromWKT(g[i], transA, toB, style);
            features.push(feature);
        }
        return features;
    }

    XDCustDrawLayer.prototype.getBoundsFromFeatures = function (features) {
        var bounds;
        for (i in features) {
            var feature = features[i];
            if (bounds == null) {
                bounds = feature.getGeometry().getExtent()
            } else {
                bounds = bounds.Union(feature.getGeometry().getExtent());
            }
        }
        return bounds;
    }


    XDCustDrawLayer.prototype.CreateText = function (path, text, style) {
        style = new ol.style.Style({

            text: new ol.style.Text({
                textAlign: "Start",
                textBaseline: "Middle",
                font: 'Normal 20px Arial',
                text: text,
                fill: new ol.style.Fill({
                    color: '#ffa500'
                }),

                offsetX: 0,
                offsetY: 0,
                rotation: 0
            })
        });
        var c = new ol.geom.Point(path);
        var feat = new ol.Feature(c);
        feat.setStyle(style);
        this.source.addFeature(feat);

        return feat;

    }
    XDCustDrawLayer.prototype.CreateCircle = function (path, style) {

        if (style == null) {
            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 100, 50, 0.3)'
                }),
                stroke: new ol.style.Stroke({
                    width: 2,
                    color: 'rgba(255, 100, 50, 0.8)'
                }),
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: 'rgba(55, 200, 150, 0.5)'
                    }),
                    stroke: new ol.style.Stroke({
                        width: 1,
                        color: 'rgba(55, 200, 150, 0.8)'
                    }),
                    radius: 7
                }),
            });

        }

        var radius = 500;
        var c = new ol.geom.Circle(path, radius);
        var circleFeature = new ol.Feature(c);

        this.source.addFeature(circleFeature);

        return c;

    }

    XDCustDrawLayer.prototype.CreateMultiPolygon = function (path, feat) {
        feat.bounds = new google.maps.LatLngBounds();
        var geos = [];
        for (i in path) {
            try {
                if (path[i].length > 0) {
                    var geo = new google.maps.Polygon(this.geodesicOptions);
                    geo.setMap(this.map.basemap);
                    geo.setPath(path[i]);
                    for (k = 0; k < path[i].length; k++) {
                        feat.bounds.extend(path[i][k]);
                    }
                    geos.push(geo);
                }
            }
            catch (e) {
                alert(e.toString());
            }
        }
        this.Geometrys[feat.Shapeindex] = geos;
        return geos;

    }
    /** 
 * arcgis的Polygon
 * @param geo Arcgis Geometry 物件
 * @param style Arcgis Symbol 物件
 * @returns {Polygon} 
 * @constructor 
 */
    XDCustDrawLayer.prototype.CreatePolygon = function (geo, style) {
        //畫圖

        var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color([255, 52, 250]), 3), new esri.Color([255, 52, 250, 0.25]));
        var grap = new esri.Graphic(geo, sfs);
        gLayer.add(grap);
        return grap;
    }
    XDCustDrawLayer.prototype.CreatePolyline2 = function (geo, style) {
        if (style == undefined) {
            style = {
                "color": [255, 0, 0, 255],
                "width": 4, "type": "esriSLS", "style": "esriSLSSolid"
            }
        }
        else {
            style = {
                "color": [0, 255, 255],
                "width": 4, "type": "esriSLS", "style": "esriSLSDash"
            }
        }
        var polylineJson = {
            geometry: geo,
            "symbol": style
        };
        var gc = new esri.Graphic(polylineJson);
        var linesymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new esri.Color([0, 255, 255]), 3);
        linesymbol.setMarker({
            style: "arrow",
            placement: "end"
        });
        gc.symbol = linesymbol;
        gLayer.add(gc);

        return gc;
    }

    XDCustDrawLayer.prototype.CreatePolyLine = function (geo, style) {
        //alert('AAA');
        if (style == undefined) {
            style = {
                "color": [255, 0, 0, 255],
                "width": 4, "type": "esriSLS", "style": "esriSLSSolid"
            }
        }
        else {
            style = {
                "color": [0, 255, 255],
                "width": 4, "type": "esriSLS", "style": "esriSLSDash"
            }
        }
        var polylineJson = {
            geometry: geo,
            "symbol": style
        };
        var gc = new esri.Graphic(polylineJson);
        var linesymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new esri.Color([0, 255, 255]),3);
        linesymbol.setMarker({
            style: "arrow",
            placement: "start"
        });
        gc.symbol = linesymbol;
        gLayer.add(gc);

        return gc;
    }

    XDCustDrawLayer.prototype.DrawFeature = function (feat) {
        if (feat.GeoType == 1) {
            // map.setCenter(feat.GeoData[0].lat(), feat.GeoData[0].lng(), map.zoom);
            map.CustDrawLayer.addMarker(feat.GeoData.getGeometry(), "../GMap/pin.png", feat.Shapeindex, "", false);
        }
        else if (feat.GeoType == 2) {
            map.CustDrawLayer.CreatePolyLine(feat.GeoData, new Object)

        }
        else if (feat.GeoType == 3) {
            if (feat.GeoData.isMulti) {
                var bound;
                for (i in feat.GeoData) {
                    var geo = feat.GeoData[i];
                    if (i == 0) {
                        var pt = map.CustDrawLayer.DrawPolygon(geo, ovOptions.polygonOptionsc);
                        bound = pt.bounds;
                    } else {
                        bound.extend(pt)
                    }
                }
                map.fitBounds(bound);
            } else {
                var pt = map.CustDrawLayer.DrawPolygon(feat.GeoData, ovOptions.polygonOptions);

            }
        }


    }
}

