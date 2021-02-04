var m_Token = '';//權限token由使用者登入後取得
//=======jqGrid相關========
var m_Columns;//欄位
var m_datafields = [];
var urSource = null;
//====angularJS 初始化======
var scope;
var db = new DBApi("../api/db/");
function querystring(key) {

    try {
        var a = new RegExp(key + "=([^&#=]*)");
        return decodeURIComponent(a.exec(window.location.search)[1]);
    } catch (e) {
        return undefined;
    }
}
var app = angular.module('myApp', ['ngCookies']).controller('siteCtrl', function ($scope, $http, $cookies) {
  
    scope = $scope;


    m_Token = $cookies.get('Token');
    if (querystring("TableName") != undefined)
        m_TableName = querystring("TableName")
    if (querystring("PrimKey") != undefined)
        m_PrimKey = querystring("PrimKey")
    if (querystring("DBKey") != undefined)
        var DBKey = querystring("DBKey")
    //if (m_Token == null || m_Token == "") {
    //    alert('沒有權限，請先登入');
    //    window.location = 'login.html';
    //    //   db.getToken("601", "601", function (r) {
    //    //    m_Token = r.Result;
    //    //  $cookies.put('Token', m_Token);
    //    // init();
    //    //});
    //} else {
    //    if ($cookies.get('APIUrl') != null) {
    //        db = new DBApi($cookies.get('APIUrl'), m_Token);
    //    } else {
    //        db = new DBApi("../api/db/", m_Token);
    //    }
        
    //}
    init();
    function init() {
        $("#jqxLoader1").jqxLoader({ width: 100, height: 60, imagePosition: 'top' });
        $('#jqxLoader1').jqxLoader('close');

        db.GetColumn(m_TableName, function (data) {
            m_Columns = data.Result;
            //可在前面加入checkbox
            //m_Columns.splice(0, 0, {
            //    text: '選取', editable: true, type: 'string',
            //    threestatecheckbox: false, datafield: 'chk', columntype: 'checkbox',
            //    align: 'center', width: 40
            //})
            //===========在表格增加動作按鈕================
            m_Columns.push({
                text: '動作', editable: false, type: 'string', datafield: 'Action', columntype: '',
                align: 'center', width: 140
            });
            //===========================================
            //=========設定搜尋的項目=============================
            for (var i in m_Columns) {
                var c = m_Columns[i];
                if (c.editable == undefined) c.editable = false;  //預設為不可編輯                m_datafields.push({ name: c.datafield, type: c.type });//jqxgrd的欄位型別定義
            }

            //====搜尋表單與輸入表單自動產生(不需要可刪除)========================
            //=========angularJS 輸入樣版自動資料產生==================
            scope.SearchInputs = [];//搜尋樣版
            scope.querydata = new Object;
            scope.inputs = [];//輸入樣版

            for (var i in m_Columns) {
                var c = m_Columns[i];

                if (c.isSearch) {//需配合div_Search
                    scope.SearchInputs.push(c);
                }
                if (c.isInput) {//配合div_Inputs

                    scope.inputs.push(c);
                }
                RasieInputData(scope, c)
            }
            //========================================
            scope.SearchHtml = getBootstrapTemplateHTML(scope.SearchInputs, 'querydata');
            scope.InputHtml = getBootstrapTemplateHTML(scope.inputs, 'editdata');
            scope.$apply(); //勿刪否則會沒有搜尋介面
            getDataList();
        })
    }

   



     
    //=====資料存檔
    scope.SaveData = function () {
        if (scope.myForm.$valid) {


            db.UpdateTable(m_TableName, scope.editdata, (scope.editdata[m_PrimKey] != undefined ? m_PrimKey : ""),
                async function (d) {
                    if (d.isSuccess == false) alert(d.ErrorMsg);
                    else {
                        UploadFiles(d, function (r) {
                            if (scope.editdata[m_PrimKey] != undefined) {
                                alert('修改成功');
                            }
                            else {
                                alert("新增成功");
                            }
                            $("#div_Inputs").css("display", "none");
                            $("#div_grid").css("display", "");
                            //history.go(-1);//回到上一頁                            getDataList();
                        });
                    }
                });


        } else {
            alert('部份欄位空白');
        }
    };//自動產生 對應 div input-directive ==(不需要可刪除)

}
).directive('bindHtmlCompile', getHtmlBindingDirective);
//====================================


function getFilterbyObj(qData) {
    var filter = "1=1";
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
}


//取得資料列表
function getDataList() {
    $('#jqxLoader1').jqxLoader('open');
    $("#div_grid").css("display", "");
    //$("#div_Search").css("display", "none");
    db.SelectTable(m_TableName,
        getFilterbyObj(scope.querydata),
        function (data) {
            $('#jqxLoader1').jqxLoader('close');
            //console.log(data.Result);
            scope.datalist = data.Result;
            //預設使用jqxgrid
            //選擇jqxgrid 樣版，還是使用傳統table
            var j = 0;
            switch (m_TableName) {
                case "CountyPit":
                    for (j = 0; j < scope.datalist.length; j++) {
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].CB_NUM + '\')"/>';
                    }
                    break;
                case "CountyHole":
                    for (j = 0; j < scope.datalist.length; j++) {
                        //scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].MH_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].MH_NUM + '\')"/>';
                    }
                    break;
                case "CountyPiple":
                    for (j = 0; j < scope.datalist.length; j++) {
                       // scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].CPI_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].CPI_NUM + '\')"/>';
                    }
                    break;
                case "CountyPipeline":
                    for (j = 0; j < scope.datalist.length; j++) {
                       // scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PI_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PI_NUM + '\')"/>';
                    }
                    break;
                case "抽水站":
                    for (j = 0; j < scope.datalist.length; j++) {
                        // scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PI_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].NAME + '\')"/>';
                    }
                    break;
                case "揚水站":
                    for (j = 0; j < scope.datalist.length; j++) {
                        // scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PI_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].Name + '\')"/>';
                    }
                    break;
                case "宜蘭縣污水下水道系統範圍圖層":
                    for (j = 0; j < scope.datalist.length; j++) {
                        // scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PI_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PlanName + '\')"/>';
                    }
                    break;
                case "LayerUserManageList_A":
                    for (j = 0; j < scope.datalist.length; j++) {
                        // scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PI_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].id + '\')"/>';
                    }
                    break;
                case "DOCase_PolyGon2":
                    console.log(scope.datalist);
                    for (j = 0; j < scope.datalist.length; j++) { 
                        // scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PI_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].ShapeIndex + '\')"/>';
                    }
                    break;
                case "管制人孔_20180312":
                    for (j = 0; j < scope.datalist.length; j++) {
                        // scope.datalist[j].Action = '<span class="System_content_right_table_BTN" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].PI_NUM + '\')">定位</span>';
                        scope.datalist[j].Action = '<input type="button" value="定位" onclick="gvRowLoc_onclick(\'' + scope.datalist[j].ShapeIndex + '\')"/>';
                    }
                    break;
            }
            createGrid1(scope.datalist, "grid", undefined, "table");
            //變更顏色的測試範例
            //    createGrid(scope.datalist, "grid", function (i, j, v) {

            //        if (v == 0) {
            //            return "<div  style='height:100%;width:100%;color:red;background-color:yellow'>" + v + "<div>"
            //        }
            //        return v;
            //    }, "table");
        });
}

function ReportTable() {
    $('#jqxLoader1').jqxLoader('open');
    PitPostAjaxQuery(Exporturl, {
        TableName: m_TableName,
        filter: getFilterbyObj(scope.querydata)
    }, function (data1) {
        $('#jqxLoader1').jqxLoader('close');
        window.open(data1);
       // console.log(data1);
       // console.log(data.Result);
    });
    //console.log(scope.querydata);
}

function PitPostAjaxQuery(url, QueryData, retFunc) {
    $.ajax({
        type: 'POST',
        url: url,
        data: QueryData,
        success: function (data) {
            if (QueryData != null) {
                retFunc(data, QueryData)
            } else {
                retFunc(data)
            };
        },
        error: function (e, r, h) {
            if (e.status != 520)
                console.log(' (status:' + r + ' error:' + h + ')');
        }
    });
}

function gvRowDel_onclick(index) {
    var fn = function (d) {
        if (d.isSuccess) {
            alert('刪除成功');
            getDataList();
        }
        else {
            alert(d.ErrorMsg);
        }
    }

    //=====先檢查是否有用chekbox，可多筆刪除============
    var delData = [];
    for (var i in scope.datalist) {
        var ob = scope.datalist[i];
        if (ob.chk) {
            delData.push(ob[m_PrimKey]);
        }
    }
    if (delData.length > 0) {
        if (!confirm("確定要刪除已選取共" + delData.length + "筆資料嗎?")) return false;
        db.DeleteRows(m_TableName, m_PrimKey, delData, fn);
        return;
    }
    if (index < 0) {
        alert("請選擇資料");
        return;
    }

    if (!confirm("確定要刪除此筆資料嗎?")) return false;

    db.DeleteData(m_TableName, m_PrimKey, scope.datalist[index][m_PrimKey], fn);
}

function btnClearQuery_onclick() {
    scope.querydata = new Object;
    scope.$apply();
}
function btnSearch_onclick() {

    $("#div_grid").css("display", "none");
    $("#div_Search").css("display", "");
}
function btnAddUser_onclick() {
    scope.editdata = new Object;
    _ModifyUser_init(true);
}
function gvRowEdit_onclick(index) {
    if (index < 0) {
        alert("請選擇資料");
        return;
    }
    scope.editdata = JSON.parse(JSON.stringify(scope.datalist[index]));  //覆置一份    _ModifyUser_init(false);
}
function _ModifyUser_init(isAdd) {
    $("#div_Inputs").css("display", "");
    $("#div_grid").css("display", "none");
    //===============================
    $('input[type=file]').val(null);//清除所有檔案
    scope.$apply();
    //=====可在這設定不可編輯的欄位===
    if (isAdd) {//代表要新增, 新增時，所有欄位應該都可以編輯
        $("#UserName").removeAttr("disabled");
    } else {
        //修改時，可以指定欄位不能編輯
        $("#UserName").attr("disabled", "disabled");
    }
}
function btnCancel_onclick() {
    //$("#div_Search").css("display", "none");
    //$("#div_Inputs").css("display", "none");
    $("#div_grid").css("display", "");
}
