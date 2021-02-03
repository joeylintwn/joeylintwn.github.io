var scope = null;
$(function () {
    SetMenuActive(4);
});

app.controller('siteCtrl', ngDetail);
function ngDetail($scope, $http, $cookies) {
    var m_Token = '';//權限token由使用者登入後取得

    scope = $scope;
    this.scope = scope;

    //=============主程式區塊=====================
    //取得外部傳來的token
    m_Token = $cookies.get('Token');
    scope.querydata = {};
    scope.id = 'LayerData';


    db = new DBApi(ApiUrl, m_Token, scope.DBKey);
    ///===============================================
    if (scope.PrimKey == undefined)
        scope.PrimKey = "id"; //資料表主key，要設對，才能做修改及刪除

    if (scope.DbKey == undefined)
        scope.DbKey = ""; //資料表主key，要設對，才能做修改及刪除

    scope.initDataGrid = function () {
        //========dataGrid相關設定=================
        scope.divGrid = 'gd' + scope.id;
        if (scope.gridSearch == undefined) scope.gridSearch = true;
        if (scope.gridAutoGetList == undefined) scope.gridAutoGetList = true;
        if (scope.gridPaging == undefined) scope.gridPaging = true;
        if (scope.gridChkbox == undefined) scope.gridChkbox = false;

        //scope.gridRowsGroup = []; //合併儲存格

        //定義欄位資訊 
        scope.Columns = [
            { text: '圖層名稱', datafield: 'Name', align: 'center', width: '25%', type: 'string' },
            { text: '生產單位', datafield: 'Unit', align: 'center', width: '10%', type: 'string' },
            { text: '分類', datafield: 'Classification', align: 'center', width: '15%', type: 'string' },
            { text: '權限', datafield: 'FileAuth', align: 'center', width: '5%', type: 'string' },
            { text: '圖資產製日期', datafield: 'LayerCreatDate', align: 'center', width: '15%', type: 'string' },
            { text: '資料型態', datafield: 'DataType', align: 'center', width: '5%', type: 'string' },
            { text: '動作', datafield: 'Action', align: 'center', width: '25%', type: 'string', enabletooltips: false }
        ];
    };
    

    //查詢 
    scope.QueryLayerList = function () {
        var filter = scope.getFilterbyObj(scope.querydata);
        var startDate1 = $('[name="LayerCreatDate1"]').val();
        var endDate1 = $('[name="LayerCreatDate2"]').val();
        if (startDate1 !== "") {
            filter += " and LayerCreatDate >='" + startDate1 + "'";
        }
        if (endDate1 !== "") {
            filter += " and LayerCreatDate <='" + endDate1 + "'";
        }
        console.log(filter);
        db.SelectTable('LayerList', filter, function (d) {
            if (d.isSuccess == true) {
                scope.datalist = d.Result;
                for (var i = 0; i < scope.datalist.length; i++) {
                    scope.datalist[i].LayerCreatDate = scope.datalist[i].LayerCreatDate.replace("T", " ");
                    scope.datalist[i].Action = '<div class="FunBtn" onclick="editLayer_onclicl(\'' + scope.datalist[i].TableName + '\', \'' + scope.datalist[i].LayerID + '\')">編輯</div>';
                }
                createDataList(scope);
            } else {
                alert(d.ErrorMsg);
            }
        });
    };

    //清空 
    scope.ClearQuery = function () {
        scope.querydata = new Object;
        $('#LayerCreatDate1').val('');
        $('#LayerCreatDate2').val('');
        scope.$apply();
    };

    scope.EditLayer = function () {
        document.location.href = EditUrl;
    };

    //欄位轉查詢條件
    scope.getFilterbyObj = function (qData) {
        if (scope.defValue != null) {
            for (var key in scope.defValue) {
                qData[key] = scope.defValue[key];
            }
        }
        var filter = "1=1"
        for (var key in qData) {
            var v = qData[key];
            if (key.indexOf("__from") > 0) {
                filter = filter + " and " + key.replace("__from", "") + ">=" + ($.isNumeric(v) ? v : "'" + v + "'");
            } else if (key.indexOf("__to") > 0) {
                var v = qData[key];
                filter = filter + " and " + key.replace("__to", "") + "<=" + ($.isNumeric(v) ? v : "'" + v + "'");
            } else {
                if (key == "LikeName") {
                    filter = filter + " and Name like '%" + v + "%'";
                } else if(v !== ""){
                    filter = filter + " and " + key + "='" + v + "'";
                }
                
                //filter = filter + " and " + key + "=" + ($.isNumeric(v) ? v : "'" + v + "'");
            }
        }
        return filter;
    };

    scope.initDataGrid();
    scope.QueryLayerList();
}

function editLayer_onclicl(TableName, LayerID) {
    document.location.href = EditUrl + '?TableName=' + TableName + "&LayerID=" + LayerID;
}
var extendWin = null;
function btnSetExtend_onclick() {
    extendWin = window.open(mapExtendUrl, "Extend1", "height=630,width=1000,left=50,top=50");
    extendWin.focus();
}

function drawExtend_callback(geo) {
    console.log(geo);
    $('[name="Boundary"]').val(geo);
    if (extendWin) {
        extendWin.close();
    }
    //$()
    //$("#txt_extend").val(geo);
    //if (extendWin) {
    //    extendWin.close();
    //}
}