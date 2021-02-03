var objLayerEvent = null;

//*******************************************
//---- ArcGis Event Handler ---------------
//*******************************************
var Layer_EventType = {
    EV_onLegendReturn: 1,
    EV_onQueryCompleted: 2,
    EV_onSubLayerVisibleChanged: 3,
    EV_onLayerClick: 4,
    EV_onSelectCompleted: 5,
    EV_onLoadKmlCompleted: 6
}
function LayerEventHandler(objLayerCtrl) {
    this.objLayerCtrl = objLayerCtrl;
}


//***************
//函式名稱：LayerCtrl(options)
//函式用途：物件類別之初始參數
//傳入參數：圖層物件
//傳回參數：無
//函式說明：實作一物件類別，並設定物件相關初始參數
//***************
function LayerCtrl(options) {
    this.layer = new WeiLayer(options);
    this.caselist = null;

    if (objLayerEvent == null)
        objLayerEvent = new LayerEventHandler(this);

    this.SetEventHandle(Layer_EventType.EV_onLegendReturn, CustomLayerEvent_onLegendReturn);
    this.SetEventHandle(Layer_EventType.EV_onQueryCompleted, CustomLayerEvent_onQueryCompleted);
    this.SetEventHandle(Layer_EventType.EV_onSubLayerVisibleChanged, CustomLayerEvent_onSubLayerVisibleChanged);
    this.SetEventHandle(Layer_EventType.EV_onLayerClick, CustomLayerEvent_onLayerClick);
    this.SetEventHandle(Layer_EventType.EV_onSelectCompleted, CustomLayerEvent_onSelectCompleted);
    this.SetEventHandle(Layer_EventType.EV_onLoadKmlCompleted, CustomLayerEvent_onLoadKmlCompleted);
    
    //#region layer event  
    this.layer.on("LegendReturn", function (lookup) {
        if (objLayerEvent.objLayerCtrl.event_onLegendReturn != null) {
            objLayerEvent.objLayerCtrl.event_onLegendReturn(lookup);
        }
    });
    this.layer.on("QueryCompleted", function (gs) {
        if (objLayerEvent.objLayerCtrl.event_onQueryCompleted != null) {
            objLayerEvent.objLayerCtrl.event_onQueryCompleted(gs);
        }
    });

    this.layer.on("LayerClick", function (attributes) {
        if (objLayerEvent.objLayerCtrl.event_onLayerClick != null) {
            objLayerEvent.objLayerCtrl.event_onLayerClick(attributes);
        }
    });

    this.layer.on("SelectCompleted", function (datas) {
        if (objLayerEvent.objLayerCtrl.event_onSelectCompleted != null) {
            objLayerEvent.objLayerCtrl.event_onSelectCompleted(datas);
        }
    });

    this.layer.on("LoadKmlCompleted", function (geometrys) {
        if (objLayerEvent.objLayerCtrl.event_onLoadKmlCompleted != null) {
            objLayerEvent.objLayerCtrl.event_onLoadKmlCompleted(geometrys);
        }
    });

    

    //#endregion

   
}



//***************
//函式名稱：new LayerCtrl
//函式用途：物件類別
//傳入參數：無
//傳回參數：無
//函式說明：實作一物件類別，並設定物件相關函式
//***************
LayerCtrl.prototype.show = show;
LayerCtrl.prototype.hide = hide;
LayerCtrl.prototype.setOpacity = setOpacity;
LayerCtrl.prototype.setFeatureInfo = setFeatureInfo;
LayerCtrl.prototype.setFeatureCickable = setFeatureCickable;
LayerCtrl.prototype.getLegend = getLegend;
LayerCtrl.prototype.showText = showText;
LayerCtrl.prototype.getfeatures = getfeatures;
LayerCtrl.prototype.setBreakPolygonRenderer = setBreakPolygonRenderer;
LayerCtrl.prototype.loadWeiRoadLayerData = loadWeiRoadLayerData;
LayerCtrl.prototype.addWeiRoadLayerIcon = addWeiRoadLayerIcon;
LayerCtrl.prototype.getSpatialFeatures = getSpatialFeatures;
LayerCtrl.prototype.showSubLayer = showSubLayer;
LayerCtrl.prototype.hideSubLayer = hideSubLayer;
LayerCtrl.prototype.markFeature = markFeature;
LayerCtrl.prototype.getSubVisableLayer = getSubVisableLayer;
LayerCtrl.prototype.toHeatmap = toHeatmap;
LayerCtrl.prototype.setDefinition = setDefinition;
LayerCtrl.prototype.getfraturesbyGeo = getfraturesbyGeo;
LayerCtrl.prototype.getfraturesbyXY = getfraturesbyXY;
LayerCtrl.prototype.selectFeatures = selectFeatures;
LayerCtrl.prototype.selectGeoFeatures = selectGeoFeatures;
LayerCtrl.prototype.clearSelection = clearSelection;
LayerCtrl.prototype.setDefinitions = setDefinitions;
LayerCtrl.prototype.refresh = refresh;
LayerCtrl.prototype.loadWeiChartData = loadWeiChartData;
LayerCtrl.prototype.clearClickGraphic = clearClickGraphic;

//---- Event Handlers
LayerCtrl.prototype.SetEventHandle = SetEventHandle;
LayerCtrl.prototype.event_onLegendReturn = null;
LayerCtrl.prototype.event_onQueryCompleted = null;
LayerCtrl.prototype.event_onSubLayerVisibleChanged = null;
LayerCtrl.prototype.event_onLayerClick = null;
LayerCtrl.prototype.event_onSelectCompleted = null;
LayerCtrl.prototype.event_onLoadKmlCompleted = null;

//***************
//函式名稱：show()
//函式用途：顯示
//傳入參數：無
//傳回參數：無
//函式說明：顯示
//***************
function show() {
    this.layer.show();
}

//***************
//函式名稱：hide()
//函式用途：隱藏
//傳入參數：無
//傳回參數：無
//函式說明：隱藏
//***************
function hide() {
    this.layer.hide();
}

//***************
//函式名稱：setOpacity(opacity)
//函式用途：設定透明度
//傳入參數：設定透明度(only for mapserviceLayer & featureLayer)
//傳回參數：無
//函式說明：設定透明度
//***************
function setOpacity(opacity) {
    this.layer.setOpacity(opacity);
}

//函式名稱：setFeatureInfo(getinfo)
//函式用途：設定點選feature 顯示資訊(only for featureLayer)
//傳入參數：顯示內容
//傳回參數：無
//函式說明：設定點選feature 顯示資訊(only for featureLayer)
//***************
function setFeatureInfo(getinfo) {
    this.layer.setFeatureInfo(getinfo);
}

//函式名稱：setFeatureCickabl(clickable)
//函式用途：設定圖徵是否可點選瀏覽其屬性(預設為true)
//傳入參數：boolean
//傳回參數：無
//函式說明：設定圖徵是否可點選瀏覽其屬性(預設為true)
//***************
function setFeatureCickable(clickable) {
    this.layer.setFeatureCickable(clickable);
}

//函式名稱：getLegend()
//函式用途：取得圖例
//傳入參數：無
//傳回參數：無
//函式說明：取得圖例
//***************
function getLegend() {
    return this.layer.getLegend();
}

//函式名稱：showText(field)
//函式用途：顯示圖徵文字
//傳入參數：field : 顯示屬性欄位
//傳回參數：無
//函式說明：顯示圖徵文字
//***************
function showText(field) {
    return this.layer.showText(field);
}

//函式名稱：getfeatures(where)
//函式用途：查詢圖層
//傳入參數：where : 查詢條件
//傳回參數：無
//函式說明：查詢圖層
//***************
function getfeatures(where) {
    return this.layer.getfeatures(where);
}

//函式名稱：setBreakPolygonRenderer(arg)
//函式用途：設定區塊根據指定欄位落於區間設定顏色
//傳入參數：arg :{field:欄位,
//                range:[{Min,Max,clor}...]
//               } 
//傳回參數：無
//函式說明：設定區塊根據指定欄位落於區間設定顏色
//***************
function setBreakPolygonRenderer(arg) {
    return this.layer.setBreakPolygonRenderer(arg);
}


//函式名稱：loadWeiRoadLayerData(caselist)
//函式用途：載入WeiLoadLayer Data caselist: []
//傳入參數：無
//傳回參數：無
//函式說明：載入WeiLoadLayer Data caselist: []
//***************
function loadWeiRoadLayerData() {
    return this.layer.loadWeiRoadLayerData(this.caselist);
}


//函式名稱：addWeiRoadLayerIcon(casetype, iconpath, w, h)
//函式用途：設定案件類型的icon
//傳入參數：無
//傳回參數：無
//函式說明：設定案件類型的icon
//***************
function addWeiRoadLayerIcon(casetype, iconpath, w, h) {
    this.layer.addWeiRoadLayerIcon(casetype, iconpath, w, h);
}

//函式名稱：getSpatialFeatures(geometry)
//函式用途：由空間內查詢圖層
//傳入參數：geometry : Polygon
//傳回參數：無
//函式說明：由空間內查詢圖層
//***************
function getSpatialFeatures(geometry) {
    this.layer.getSpatialFeatures(geometry);
}


//函式名稱：showSubLayer(id) 
//函式用途：顯示 子圖層
//傳入參數：id : layer id
//傳回參數：無
//函式說明：觸發子圖層開關事件 尚未實作
//***************
function showSubLayer(id) {
    this.layer.showSubLayer(id);
}

//函式名稱：hideSubLayer(id) 
//函式用途：隱藏 子圖層
//傳入參數：id : layer id
//傳回參數：無
//函式說明：觸發子圖層開關事件 尚未實作
//***************
function hideSubLayer(id) {
    this.layer.hideSubLayer(id);
}

//函式名稱：getSubVisableLayer() 
//函式用途：取得顯示 圖層
//傳入參數：無
//傳回參數：無
//函式說明：無
//***************
function getSubVisableLayer() {
    return this.layer.getSubVisableLayer();
}


//函式名稱：markFeature(key, values)
//函式用途：標註指定屬性, 值
//傳入參數：key : featrue attribute, values : [值...]
//傳回參數：無
//函式說明：標註指定屬性, 值
//***************
function markFeature(key, values) {
    this.layer.markFeature(key, values);
}


//函式名稱：toHeatmap()
//函式用途：熱點展示
//傳入參數：keyfield:點選回傳欄位, funtitle:取得標頭函式, funcontent:取得內容函式
//傳回參數：無
//函式說明：熱點展示
//***************
function toHeatmap(keyfield, funtitle, funcontent) {
    this.layer.toHeatmap(keyfield, funtitle, funcontent);
}

//函式名稱：setDefinition(expression)
//函式用途：設定圖層顯示條件
//傳入參數：expression : 條件
//傳回參數：無
//函式說明：設定圖層顯示條件
//***************
function setDefinition(expression) {
    this.layer.setDefinition(expression);
}

//函式名稱：getfraturesbyGeo(geo)
//函式用途：查詢圖台幾何物件(包含)
//傳入參數：geo : 幾何物件
//傳回參數：無
//函式說明：查詢圖台幾何物件(包含)
//***************
function getfraturesbyGeo(geo) {
    //debugger;
    this.layer.getfraturesbyGeo(geo);
}

//函式名稱：getfraturesbyXY(x, y)
//函式用途：查詢圖台幾何物件(包含)
//傳入參數：x, y : 坐標
//傳回參數：無
//函式說明：查詢圖台幾何物件(包含)
//***************
function getfraturesbyXY(x, y) {
    this.layer.getfraturesbyXY(x, y);
}

//函式名稱：selectFeatures(where)
//函式用途：選擇物件
//傳入參數：where : 條件
//傳回參數：無
//函式說明：選擇物件
//***************
function selectFeatures(where) {
    this.layer.selectFeatures(where);
}

//函式名稱：selectGeoFeatures(x, y)
//函式用途：x, y :坐標
//傳入參數：g : 幾何
//傳回參數：無
//函式說明：選擇物件
//***************
function selectGeoFeatures(x, y) {
    this.layer.selectGeoFeatures(x, y);
}


//函式名稱：clearSelection()
//函式用途：清除選擇物件
//傳入參數：無
//傳回參數：無
//函式說明：清除選擇物件
//***************
function clearSelection() {
    this.layer.clearSelection();
}

//函式名稱：setDefinitions(index, expression)
//函式用途：設定圖層顯示條件
//傳入參數：index: 圖層index, expression : 條件
//傳回參數：無
//函式說明：設定圖層顯示條件
//***************
function setDefinitions(index, expression) {
    this.layer.setDefinitions(index, expression);
}

//函式名稱：refresh()
//函式用途：refresh 該圖層
//傳入參數：無
//傳回參數：無
//函式說明：refresh 該圖層
//***************
function refresh() {
    this.layer.refresh();
}

//函式名稱：loadWeiChartData()
//函式用途：Test
//傳入參數：無
//傳回參數：無
//函式說明：無
//***************
function loadWeiChartData() {
    this.layer.loadWeiChartData(this.caselist);
}

//函式名稱：clearClickGraphic()
//函式用途：清除圖層點選Graphic
//傳入參數：無
//傳回參數：無
//函式說明：無
//***************
function clearClickGraphic() {
    this.layer.clearClickGraphic();
}



//***************
//函式名稱：SetEventHandle()
//函式用途：設定EventHandle
//傳入參數：evtType:Layer_EventType, function name
//傳回參數：無
//函式說明：設定EventHandle
//***************
function SetEventHandle(evtType, func) {
    switch (evtType) {
        case Layer_EventType.EV_onLegendReturn:
            this.event_onLegendReturn = func;
            break;
        case Layer_EventType.EV_onQueryCompleted:
            this.event_onQueryCompleted = func;
            break;
        case Layer_EventType.EV_onSubLayerVisibleChanged:
            this.event_onSubLayerVisibleChanged = func;
            break;
        case Layer_EventType.EV_onLayerClick:
            this.event_onLayerClick = func;
            break;
        case Layer_EventType.EV_onSelectCompleted:
            this.event_onSelectCompleted = func;
            break;
        case Layer_EventType.EV_onLoadKmlCompleted:
            this.event_onLoadKmlCompleted = func;
            break;
    }
}