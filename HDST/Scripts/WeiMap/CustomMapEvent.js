 //my name is jackdddddd
function CustomMapEvent_onMosueMove(objxy) {
    //objxy.x, objxy.y 坐標
    $("#sp_currXY").text(' ' + objxy.x + ',' + objxy.y);
    var p = twd97_to_wgs84(new CPoint3(objxy.x, objxy.y, 0));
    $("#sp_currWXY").text(' ' + p.X.toFixed(4) + ',' + p.Y.toFixed(4));


    var A = 0.00001549;
    var B = 0.000006521;
    var E67 = parseFloat(objxy.x) - 807.8 - A * parseFloat(objxy.x) - B * parseFloat(objxy.y);
    var N67 = parseFloat(objxy.y) + 248.6 - A * parseFloat(objxy.y) - B * parseFloat(objxy.x);
    //E67 = E97 - 807.8 - A * E97 - B * N97
    //N67 = N97 + 248.6 - A * N97 - B * E97
    //my name is jack
    $("#sp_curr67XY").text(' ' + E67.toFixed(2) + ',' + N67.toFixed(2));
}

function CustomMapEvent_onScaleChange(scale) {
    //scale 比例尺
    if (scale <= 5000) {
        if (!currLandmark) {
            landmarklayer.show();
            currLandmark = true;
        }
    } else {
        if (currLandmark) {
            landmarklayer.hide();
            currLandmark = false;
        }
    }
    $("#sp_mapRange").text(" 1:" + tryParseFloat(scale).toFixed(0));
    currScale = scale;
}

function CustomMapEvent_onDrawEnd(groupId) {
    //groupId 群組編號
    if (isStopDraw) {
        arc.stopDrawGraphic();
        isStopDraw = false;
    }
    
    if (cadType == "Fence") { //地藉查詢
        JqxLoading(true);
        var geo = arc.getDrawGraphics(groupId);
        bufferGeoHandle(geo);
        //if (currCadDef != '') cadastreLayer.setDefinition('');
        //cadastreLayer.getfraturesbyGeo(geo[0]);
        //if (currCadDef != '') cadastreLayer.setDefinition(currCadDef);
    }
    else if (cadType == 'EngPrj') {
        JqxLoading(true);
        var geo = arc.getDrawGraphics(groupId);
        EngPrjbufferGeoHandle(geo);
    }
    else if (cadType == 'EngBuffer') {
        var geo = arc.getDrawGraphics(groupId);
        EngPrjbufferGeoHandle(geo);
    }
    else if (cadType == 'WSBuffer') { //水利普查-環域分析
        var geo = arc.getDrawGraphics(groupId);
        WSBufferQueryHandle(geo);
    }
    else if (cadType == "Extend") { //查詢自定邊界
        var geo = arc.getDrawGraphics(groupId);
        if (geo != null && geo.length > 0) {
            var arr = geo[0].rings[0];
            var str = "";
            for (var i = 0; i < arr.length; i++) {
                str += arr[i][0] + ' ' + arr[i][1] + ',';
            }
            if (str != "") str = str.substring(0, str.length - 1);
            if (opener.drawExtend_callback) {
                opener.drawExtend_callback(str);
            }
        }

    }
}

function CustomMapEvent_onPrintCompleted(url) {
    //url print image url
    JqxLoading(false);
    setModal(false);
    open(url);
}
function CustomMapEvent_onClick(objxy) {
    
    if (t_coordate) {
        var p = twd97_to_wgs84(new CPoint3(objxy.x, objxy.y, 0));
        var A = 0.00001549;
        var B = 0.000006521;
        var E67 = parseFloat(objxy.x) - 807.8 - A * parseFloat(objxy.x) - B * parseFloat(objxy.y);
        var N67 = parseFloat(objxy.y) + 248.6 - A * parseFloat(objxy.y) - B * parseFloat(objxy.x);
        var info = 'TWD97：' + objxy.x + ',' + objxy.y + '\n';
        info += 'TWD67：' + E67.toFixed(2) + ',' + N67.toFixed(2) + '\n';
        info += 'WGS84：' + p.X.toFixed(4) + ',' + p.Y.toFixed(4);
        alert(info);
        t_coordate = false;
    }
}

function CustomMapEvent_onSnapping(objxy) {
    //debugger;
    //arc.stopDrawGraphic();
    //arc.EndGmlLock();
    //if (gmlSnappHandle != null) {
    //    gmlSnappHandle(objxy);
    //}
}

function CustomMapEvent_onUploadShpZipCompleted(info) {
    if (info == null) {
        JqxLoading(false);
        alert('上傳失敗無回應');
        setModal(false);
    }
    else if (!info.Issuccess) {
        JqxLoading(false);
        alert(info.Info);
        setModal(false);
    }
    else {
        if (!t_addlayer) {
            var geo = info.features[0].geometry;
            if (cadType == "eShpFile") {
                EngPrjbufferGeoHandle([geo]);
            } else {
                bufferGeoHandle([geo]);
            }
        }
        else {
            var geos = [];
            for (var i = 0 ; i < info.features.length; i++) {
                geos.push(info.features[i].geometry);
            }
            arc.loadDrawGraphic(geos, 777);
            arc.fitGeometry(geos);
            JqxLoading(false);
            setModal(false);
            t_addlayer = false;
        }
        //arc.loadDrawGraphic([geo], GraphicIndex);
        //GraphicIndex++;
        //arc.fitGeometry([geo]);
        //if (currCadDef != '') cadastreLayer.setDefinition('');
        //cadastreLayer.getfraturesbyGeo(geo);
        //if (currCadDef != '') cadastreLayer.setDefinition(currCadDef);
    }
    //for (i = 0; i < info.features.length; i++) {
    //    if (info.features[i].attributes.TOWNNAME == '宜蘭市') {
    //        fcadastrallayer.getSpatialFeatures(info.features[i].geometry);
    //        break;
    //    }
    //}
}

function CustomMapEvent_onBufferCompleted(geometry) {
    //geometry...環域polygon
    arc.loadDrawGraphic([geometry], GraphicIndex);
    GraphicIndex++;
    arc.fitGeometry([geometry]);

    if (cadType == 'WSBuffer') {
        //環域分析-水利普查圖層
        WSBufferQuerybyGeo(geometry);
    }
    else if (cadType == "EngQuery") {
        EngBuffQuerybyGeo(geometry);
    }
    else if (cadType == "EngBuffer" || cadType == "eShpFile" || cadType == "eKmlFile") {
        EngBuffQuerybyGeo(geometry);
    }else {
        if (currCadDef != '') cadastreLayer.setDefinition('');
        cadastreLayer.getfraturesbyGeo(geometry);
        if (currCadDef != '') cadastreLayer.setDefinition(currCadDef);
    }
}
function CustomMapEvent_onDragEnd(x, y) {

}

function CustomMapEvent_onFenceToShpCompleted() {
    JqxLoading(false);
    arc.mapCtrl.arcMap.graphics.remove(arc.mapCtrl.fenceTmpGraphic); //清掉圍籬
}

function CustomMapEvent_onGraphicClick(id) {
    arc.removeDrawGraphic(id);
}

function CustomMapEvent_onEditEnd(id, geometry) {
    //debugger;
}