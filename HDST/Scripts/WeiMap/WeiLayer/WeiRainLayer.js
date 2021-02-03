dojo.provide("extras.WeiRainLayer");

dojo.require("esri.layers.graphics");


dojo.declare("extras.WeiRainLayer", esri.layers.GraphicsLayer, {
    constructor: function (options) {
        this._regionalData = options.data || [];
        this._Template = options.Template || new esri.dijit.PopupTemplate({ "title": "", "description": "{*}" });
        this._ImageurlList = options.ImageurlList || [];
    },
    clear: function () {
    },
    _setMap: function (map, surface) {

        this._setrender();
        this._regionalGraphic(map);

        var div = this.inherited(arguments);
        return div;
    },
    _setrender: function () {
        var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(100);
        var renderer = new esri.renderer.ClassBreaksRenderer(
             defaultSym,
             "Amount"
           );
        //debugger;
        var rain1 = new esri.symbol.PictureMarkerSymbol(this._ImageurlList[0], 32, 32).setOffset(0, 0);
        var rain2 = new esri.symbol.PictureMarkerSymbol(this._ImageurlList[1], 32, 32).setOffset(0, 0);
        var rain3 = new esri.symbol.PictureMarkerSymbol(this._ImageurlList[2], 32, 32).setOffset(0, 0);
        var rain4 = new esri.symbol.PictureMarkerSymbol(this._ImageurlList[3], 32, 32).setOffset(0, 0);
        renderer.addBreak(0, 50, rain1);
        renderer.addBreak(50, 130, rain2);
        renderer.addBreak(130, 200, rain3);
        renderer.addBreak(200, 1000, rain4);

        this.setRenderer(renderer);
    },
    _regionalGraphic: function (map) {
        //debugger;
        for (var i = 0 ; i < this._regionalData.length; i++) {
            var point = new esri.geometry.Point(this._regionalData[i].X, this._regionalData[i].Y, map.spatialReference);
            var gp = new esri.Graphic(point,
              null,
              {
                  "Name": this._regionalData[i].Name,
                  "Amount": this._regionalData[i].Amount
              }
            );
            this.add(gp);
            var font = new esri.symbol.Font();
            font.setSize("12pt");
            font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
            var label = new esri.symbol.TextSymbol(this._regionalData[i].Name)
                .setColor(new dojo.Color("#0066FF"))
                .setOffset(0, 10)
                .setFont(font);
            var g = new esri.Graphic(point,
              label,
               {
                   "Name": this._regionalData[i].Name,
                   "Amount": this._regionalData[i].Amount
               },
               this._Template
            );
            this.add(g);
        }
    }
});