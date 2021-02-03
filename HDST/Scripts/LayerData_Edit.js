var scope = null;
var keys;
//TableName須跟資料表設定的文字相同
var PositionName = [
    { TableName: 'HDST.SDE.CitySEPoint', X_Name: 'TM2_X97', Y_Name: 'TM2_Y97', GeoName: 'Shape' }
];
var PositionItem = { TableName: '', X_Name: '', Y_Name: '' };
$(function () {
    SetMenuActive(4);
    for (var i = 0; i < PositionName.length; i++) {
        if (PositionName[i].TableName == TableName) {
            PositionItem = PositionName[i];
        }
    }
});

function btnGetPosition_onclick() {
    window.open(MapUrl + "?CheckX=1");
}

app.controller('siteCtrl', ngDetail);
function ngDetail($scope, $http, $cookies) {
    var m_Token = '';//權限token由使用者登入後取得

    scope = $scope;
    this.scope = scope;

    //=============主程式區塊=====================
    //取得外部傳來的token
    m_Token = $cookies.get('Token');
    scope.querydata = {};
    scope.editdata = {};
    scope.id = 'EditLayerData';
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

        scope.Columns = [];

        //自動產生列表
        db.SelectTable('HDST.INFORMATION_SCHEMA.COLUMNS', "TABLE_NAME = '" + TableName.replace("HDST.SDE.", "") + "'", function (d) {
            if (d.isSuccess == true) {
                var data = d.Result;
                for (var i in data) {
                    //排除掉GEO欄位
                    if (data[i].DATA_TYPE != 'geometry') {
                        scope.Columns.push({ text: data[i].COLUMN_NAME, datafield: data[i].COLUMN_NAME, align: 'center', type: 'string' });
                    }
                }
                scope.Columns.push({ text: '動作', datafield: 'Action', width: '160px', align: 'center', type: 'string', enabletooltips: false });

            }
        });
    };

    //查詢 
    scope.QueryLayerList = function () {
        db.SelectTable(TableName, scope.getFilterbyObj(scope.querydata), function (d) {
            if (d.isSuccess == true) {
                scope.datalist = d.Result;
                keys = Object.keys(scope.datalist[0]);
                for (var i = 0; i < scope.datalist.length; i++) {
                    scope.datalist[i].Action = '<div class="FunBtn" style="display:inline-block;" onclick="EditTableContent(\'' + scope.datalist[i][keys[0]] + '\')">編輯</div>';
                    scope.datalist[i].Action += '<div class="FunBtn" style="display:inline-block;" onclick="ShowPosition(\'' + LayerID + '\', \'' + scope.datalist[i][keys[0]] + '\')">定位</div>';
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
                filter = filter + " and " + key + "=" + ($.isNumeric(v) ? v : "'" + v + "'");
            }
        }
        return filter;
    };

    scope.initDataGrid();
    scope.QueryLayerList();
}
//編輯資料
function EditTableContent(key) {
    db.SelectTable(TableName, keys[0] + "='" + key + "'", function (d) {
        if (d.isSuccess) {
            var html = "";
            for (var i in d.Result[0]) {
                html += '<div>';
                html += '<div>' + i + "</div>";
                var item = PositionName.filter(function (obj) {
                    return obj.X_Name == i || obj.Y_Name == i;
                });

                if (item.length > 0) {
                    //綁定XY座標
                    if (i == item[0].X_Name) {
                        html += '<input type="text" id="twd97E" ng-model="editdata.' + i + '" ' + (i == keys[0] ? 'readonly' : '') + '/>';
                        html += '<button type="button" class="btn btn-success" style="margin: 0 5px;" onclick = "btnGetPosition_onclick()" > 定位</button > ';
                    } else if (i == item[0].Y_Name) {
                        html += '<input type="text" id="twd97N" ng-model="editdata.' + i + '" ' + (i == keys[0] ? 'readonly' : '') + '/>';
                    }
                } else {
                    html += '<input type="text" ng-model="editdata.' + i + '" ' + (i == keys[0] ? 'readonly' : '') + '/>';
                }
                
                html += '</div>';
            }
            html += '<div>';
            html += '<button type="button" class="FunBtn" onclick="Save_onclick()">儲存</button>';
            html += '<button type="button" class="FunBtn" onclick="Cancal_onclick()">取消</button>';
            html += '</div>';

            scope.editdata = d.Result[0];
            scope.EditContenHtml = html;
            scope.$apply();

            $("#" + scope.divGrid).hide();
            $("#EditContent").show();
        } else {
            alert(d.ErrorMsg);
        }
    });
}
//儲存資料
function Save_onclick() {
    scope.editdata[PositionItem.X_Name] = $("#twd97E", '#EditContent').val();
    scope.editdata[PositionItem.Y_Name] = $("#twd97N", '#EditContent').val();
    //修改GEO欄位
    scope.editdata[PositionItem.GeoName] = 'Point(' + $("#twd97E", '#EditContent').val() + ' ' + $("#twd97N", '#EditContent').val() + ')'


    db.UpdateTable(TableName, scope.editdata, keys[0], function (d) {
        if (d.isSuccess) {
            alert('更新成功');
            scope.QueryLayerList();
            Cancal_onclick();
        } else {
            alert(d.ErrorMsg);
        }
    });
}
//返回編輯清單
function Cancal_onclick() {
    $("#" + scope.divGrid).show();
    $("#EditContent").hide();
    scope.editdata = {};
}
function ShowPosition(layerid, objectid) {
    var pos = {};
    pos.layerid = layerid;
    pos.objid = objectid;
    window.open(MapUrl + "?pos=" + JSON.stringify(pos));
}