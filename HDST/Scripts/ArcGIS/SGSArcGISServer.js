
dojo.declare("SGSTileLayer", esri.layers.TiledMapServiceLayer,
    {
        constructor: function (sUrl, serviceRes, nLayer, isProxy) {

            this._url = sUrl;
            this._resource = null;
            this._layer = nLayer;
            this.isProxy = isProxy;
            var pThis = this;
            var url = sUrl + "/GetCacheConfig?FORMAT=JSON";
            $.getScript(url, function () {
                var pNodeRes = result.Infomation;
                if (!pNodeRes)
                    return;
                this._resource = pNodeRes.ResourceName;			//取得TGOS圖磚服務名稱
                var ImgWidth = parseInt(pNodeRes.TileWidth);
                var ImgHeight = parseInt(pNodeRes.TileHeight);
                var dCLeft = parseFloat(pNodeRes.CornerLeft);
                var dCLower = parseFloat(pNodeRes.CornerLower);

                var pEnv = pNodeRes.Envelope;
                var dCacheLeft = parseFloat(pEnv.Left);
                var dCacheTop = parseFloat(pEnv.Top);
                var dCacheRight = parseFloat(pEnv.Right);
                var dCacheBottom = parseFloat(pEnv.Bottom);

                pThis.spatialReference = new esri.SpatialReference({ wkid: 3857 });

                pThis.initialExtent = (pThis.fullExtent = new esri.geometry.Extent(dCacheLeft, dCacheBottom, dCacheRight, dCacheTop, pThis.spatialReference));

                var resolutions = new Array();
                var pSclss = pNodeRes.Scales;
                var pScls = pSclss.Scale;
                //console.log(pScls);
                if (pScls) {
                    if (pScls.length > 0) {
                        for (var i = 0; i < pScls.length; i++) {
                            var pScl = pScls[i];
                            var dem;
                            if (pScl.Denominator)
                                dem = parseFloat(pScl.Denominator);
                            else
                                dem = parseFloat(pScl._text);
                            var fac = parseFloat(pScl.Factor);
                            resolutions.push({ level: i, scale: dem, resolution: fac });
                        }
                    }
                }

                pThis.tileInfo = new esri.layers.TileInfo(
                    {
                        "dpi": "96",
                        "format": "image/png",
                        "compressionQuality": 0,
                        "spatialReference": { "wkid": "3857" },
                        "rows": ImgWidth,
                        "cols": ImgHeight,
                        "origin": { "x": dCLeft, "y": dCLower },
                        "lods": resolutions
                    });
                pThis.loaded = true;
                pThis.onLoad(pThis);


            }
            );


            //LoadScript(url, function () {

            //});

        },
        getTileUrl: function (level, row, col) {
            
            var scnt = this.tileInfo.lods.length;
            var sUrl;
            if (this.isProxy == true) {
                sUrl = "./ArcGIS/tgosProxy.ashx?" + this._url + "/GetCacheImage?" + "S=" + level + "&X=" + col + "&Y=" + (-row - 1) + "&L=" + this._layer;
            } else {
                sUrl = this._url + "/GetCacheImage?APPID=iXU5l27hitiQ/5Hkzu49scMBuI5TxTUtrQGnFhW23ENR1vlEjx97bA==&APIKEY=cGEErDNy5yN/1fQ0vyTOZrghjE+jIU6ubRcZ1A1O+zxNBo1roTNLf5Dq9bzq3jhRaiq+4HW4+iFBHA9xfkySHXqeZaZqH6cF74wq93rto/WnzzlRynBJvkDefRcgiG+4H/PSUj8ysRF7MDW5xEYcHTNFVuEdz27f+d7TF8jvTyItgFVjlYWF3RONkJH5OntOyZWXu5vhgnTSSe/sAyLF1NS1h+rV+RWWHyQsVpVBawir87QGF0iLGR3MegBqTJfaH9DO6yM+oRl7El5cpH3vvsPwKF9TrwPnK0foNZw3+Wk/TFMgiAu/3PcAkZ/OJWX71/J77XV+xDIc+8cNBfVBwyTjqxWs/TV7xgsep7TiRZTc9WpY+nixp7aEh9MFTw/dbw+L1dMeTBz933Ll5XNRVBOYNSLR+tUm&S=" + level + "&X=" + col + "&Y=" + (-row - 1) + "&L=" + this._layer;
            }


            return sUrl;
        }
    });