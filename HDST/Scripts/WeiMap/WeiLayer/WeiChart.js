
define([
    "dojo/_base/declare",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/graphic",
    "dojox/charting/Chart2D",
    "dojox/charting/themes/PlotKit/blue",
    "dojox/charting/action2d/Highlight",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/themes/Claro",
    "dojox/charting/themes/MiamiNice",
], function (
    declare,
    GraphicsLayer,
    Point,
    Graphic,
    Chart2D,
    theme,
    Highlight,
    Tooltip,
    Claro,
    MiamiNice
    ) {
    return declare("extras.WeiChart", esri.layers.GraphicsLayer, {
        constructor: function (options) {
            this._id = options.id || "";
            this._divId = options.chartDiv || "chart";
            this._charttype = options.chartType || "Columns";
            this._chartSize = options.size || 50;
            this._data = options.data || [];
        },
        //  
        _setMap: function (map, surface) {
            // GraphicsLayer will add its own listener here
            var div = this.inherited(arguments);
            return div;
        },
        _unsetMap: function () {
            this.inherited(arguments);
        },
        hide: function () {
            dojo.style(dojo.byId(this._divId), {
                "display": "none"
            });
        },
        show: function () {
            dojo.style(dojo.byId(this._divId), {
                "display": ""
            });
        },
        //拖拽
        _onPanStartHandler: function () {
            this.hide();
        },
        //缩放
        _onZoomStartHandler: function () {
            this.hide();
        },
        _onExtentChangeHandler: function () {
            //debugger;
            this._refresh(true);
        },
        _refresh: function (redraw) {
            var that = this;
            var gs = this._data;
            for (i = 0; i < gs.length; i++) {
                this._draw(gs[i], redraw);
            }
            this.show();
        },
        _draw: function (graphic, redraw) {
            if (!this._map) {
                return;
            }
            if (graphic instanceof Graphic)// 
            {
                var root = this;
                setTimeout(function () { root._drawChart(graphic, true) }, 1000);
            }
        },
        _drawChart: function (graphic, redraw) {
            var showMapPt = graphic.geometry,
                attribute = graphic.attributes;
            var showPt = this._map.toScreen(showMapPt);
            var id = attribute.code;
            //debugger;
            var series = [0, attribute.value];
            if (redraw && dojo.byId("div" + id) != null) {
               
                //dojo.byId(this._divId).removeChild(dojo.byId("div" + id));
                //dojo.byId(this._divId).innerHTML = "";
                dojo.byId("div" + id).innerHTML = "";
            }
            else {
                var _chartDiv = dojo.doc.createElement("div");
                _chartDiv.id = "div" + id;
                dojo.byId(this._divId).appendChild(_chartDiv);
            }
            //dojo.byId(this._divId).innerHTML = "";

            if (attribute) {
                //debugger;
                var _chartDiv = dojo.byId("div" + id);//dojo.doc.createElement("div");
                //_chartDiv.id = "div" + id;
                dojo.style(_chartDiv, {
                    "left": (showPt.x - this._chartSize / 4) + "px",
                    "top": (showPt.y - this._chartSize / 2) + "px",
                    "position": "absolute",
                    "width": this._chartSize + "px",
                    "height": this._chartSize * Math.log(attribute.value) + "px"
                });
                //dojo.byId(this._divId).appendChild(_chartDiv);

                var _chart = new Chart2D(_chartDiv);
                var _themes = dojox.charting.themes.PlotKit.blue;
                _themes.chart.fill = "transparent";
                _themes.chart.stroke = "transparent";
                _themes.plotarea.fill = "transparent";
                _chart.setTheme(_themes);
               
                //_chart.setTheme(dojox.charting.themes.MiamiNice);
                switch (this._charttype) {
                    case "Pie": { 
                        _chart.addPlot("default", {
                            type: this._charttype,
                            labels: false
                        });
                        break;
                    }
                    case "StackedColumns": { 
                        _chart.addPlot("default", {
                            type: this._charttype,
                            labels: false,
                            markers: true,
                            gap: 2
                        });
                        break;
                    }
                    case "Lines": { 
                        _chart.addPlot("default", {
                            type: this._charttype,
                            labels: false,
                            markers: true,
                            radius: 1,
                            tension: "X"
                        });
                        break;
                    }
                    default: { 
                        _chart.addPlot("default", {
                            type: this._charttype, styleFunc: function (item) {
                                var o = {
                                    type: this._charttype,
                                    markers: true,
                                    gap: 2,
                                    fill: "green"
                                };
                                if (item > 30) {
                                    o.fill = "red";
                                }
                                
                                return o;
                            }
                        });
                        //chart.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major" });
                        break;
                    }
                }
                _chart.addSeries(id, series, { stroke: { width: 3 } });
                //效果
                new Highlight(_chart, "default", { highlight: "lightskyblue" });
                new Tooltip(_chart, "default");
                _chart.render();
            }
        }
    });
});