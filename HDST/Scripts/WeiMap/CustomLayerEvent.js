function CustomLayerEvent_onLegendReturn(lookup) {
    //lookup = {[{url,label}]}
    $("#img_icon").attr('src', lookup[0][0].url);
}
function CustomLayerEvent_onQueryCompleted(features) {
    var objids = []; 
    var isValid = false; 
    JqxLoading(false);
    if (features.length > 1000) {
        alert('查出太多資料(超過1000筆)，請縮小查詢範圍重新查詢');
        if (cadType == "Fence") {
            arc.removeDrawGraphic(0);
            GraphicIndex = 0;
        }
    }
    else {
        $("#gv_mainCad").jqxGrid('clear');
        isValid = true;
        currCadLocShp = {};
        var filters = [];
        for (i = 0; i < features.length; i++) {
            if (filters.indexOf(features[i].attributes.地號) < 0) {
                filters.push(features[i].attributes.地號);
                currCadLocShp[features[i].objid] = features[i].g;
                objids.push(features[i].objid);
            }

        }
    }
    switch (cadType) {
        case "Pos":
            arc.fitGeometry([features[0].g]);
            break;
        case "Fence":
            btnStopDraw_onclick();
            if (isValid) {
                getCadQueryList(objids.join(","));
            }
            break;
        case "Buffer":
            setModal(false);
            if (isValid) {
                getCadQueryList(objids.join(","));
            }
            break;
        case "Landmark":
            cadType = "";
            arc.removeDrawGraphic(9999);
            arc.loadDrawGraphic([features[0].g], 9999);
            arc.fitGeometry([features[0].g]);
            //cadastreLayer.getfeatures("OBJECTID=" + objids[0]);
            if (isValid) {
                getCadQueryList(objids.join(","));
            }
            break;
        case "KmlFile":
        case "ShpFile":
            setModal(false);
            if (isValid) {
                getCadQueryList(objids.join(","));
            }
            break;
        case "EngQuery":
            btnStopDraw_onclick();
            if (isValid) {
                //cadType = "EngQuery";
                getEngQueryList(objids.join(","), features)
            }
            break;
        case "eLandmark":
            cadType = "";
            arc.removeDrawGraphic(9999);
            arc.loadDrawGraphic([features[0].g], 9999);
            arc.fitGeometry([features[0].g]);
            //cadastreLayer.getfeatures("OBJECTID=" + objids[0]);
            if (isValid) {
                getEngQueryList(objids.join(","));
            }
            break;
        case "eKmlFile":
        case "eShpFile":
        case "EngBuffer":
            setModal(false);
            if (isValid) {
                getEngQueryList(objids.join(","), features);
            }
            break;
        case "WSBuffer":
            if (objids.length > 0 && (features[0].attributes.OBJECTID_1 != null || features[0].attributes.OBJECTID != null)) {
                objids = [];
                for (i = 0; i < features.length; i++) {
                    if (features[0].attributes.OBJECTID != null)
                        objids.push(features[i].attributes.OBJECTID);
                    else
                        objids.push(features[i].attributes.OBJECTID_1);
                }

            }
            else if (features.length > 0) {
                if (features[0].attributes != undefined) {
                    if (features[0].attributes.tbno != undefined) {
                        objids = [];
                        for (i = 0; i < features.length; i++) {
                            objids.push(features[i].attributes.tbno);
                        }
                    }
                }
            }

            getWSQueryList(objids.join(","));
            break;

    }
}

function CustomLayerEvent_onSubLayerVisibleChanged() {
    debugger;
}
function CustomLayerEvent_onLoadKmlCompleted(geometrys) {
    //debugger;
    //kml上傳後處理
    JqxLoading(false);
    var geo = geometrys[0];
    if (!t_addlayer) {
        if (cadType == "eKmlFile") {
            EngPrjbufferGeoHandle([geo]);
        } else {
            bufferGeoHandle([geo]);
        }
    }
    else {
        arc.loadDrawGraphic(geometrys, 777);
        arc.fitGeometry(geometrys);
        setModal(false);
        t_addlayer = false;
    }
}

function CustomLayerEvent_onLayerClick(attr) {
    //debugger;
}

function CustomLayerEvent_onSelectCompleted(datas) {
    debugger;
}