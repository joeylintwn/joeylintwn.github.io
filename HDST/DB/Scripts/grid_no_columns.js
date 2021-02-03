var m_Token = '';//權限token由使用者登入後取得
//=======jqGrid相關========
var m_datafields = [];
var urSource = null;
//====angularJS 初始化======
var scope;
var db = new DBApi("../api/db/");

var app = app.controller('siteCtrl', function ($scope, $http, $cookies) {

    scope = $scope;
    m_Token = $cookies.get('Token');

    if (m_Token == null) {
        alert('沒有權限，請先登入');
        window.location = 'login.html';

    } else {

        if ($cookies.get('APIUrl') != null) {
            db = new DBApi($cookies.get('APIUrl'), m_Token);
        } else {
            db = new DBApi("../api/db/", m_Token);
        }
        init();
    }
    function init() {


        //可在前面加入checkbox
        m_Columns.splice(0, 0, {
            text: '選取', editable: true, type: 'string',
            threestatecheckbox: false, datafield: 'chk', columntype: 'checkbox',
            align: 'center', width: 40
        })


        //=========設定搜尋的項目=============================
        for (var i in m_Columns) {
            var c = m_Columns[i];
            if (c.editable == undefined) c.editable = false;  //預設為不可編輯            m_datafields.push({ name: c.datafield, type: c.type });//jqxgrd的欄位型別定義
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
        //debugger;
        //var toolbar =$("#div_ToolBar");
        //toolbar.append(CreateToolBarUI());
        scope.SearchHtml = getBootstrapTemplateHTML(scope.SearchInputs, 'querydata');
        scope.InputHtml = getBootstrapTemplateHTML(scope.inputs, 'editdata');



        getDataList();

    }
    //取得外部傳來的token



    //=====資料存檔
    scope.SaveData = function () {
        if (scope.myForm.$valid) {


            db.UpdateTable(m_TableName, scope.editdata, (scope.editdata[m_PrimKey] != undefined ? m_PrimKey : ""),
                function (d) {
                    if (d.isSuccess == false) alert(d.ErrorMsg);
                    else {
                        if (scope.editdata[m_PrimKey] != undefined) {
                            alert('修改成功');
                        }
                        else {
                            alert("新增成功");
                        }

                        $("#div_Inputs").css("display", "none");
                        $("#div_grid").css("display", "");
                        //history.go(-1);//回到上一頁





                        getDataList();
                    }
                });


        } else {
            alert('部份欄位空白');
        }
    };//自動產生 對應 div input-directive ==(不需要可刪除)

}
)

//取得資料列表
function getDataList() {

    $("#div_grid").css("display", "");
    $("#div_Search").css("display", "none");
    db.GetDataList(m_TableName,
        scope.querydata,
        function (data) {
            scope.datalist = data.Result;
            /* if (scope.datalist != null) { //動作
                 for (var i = 0; i < scope.datalist.length; i++) {
                          scope.datalist[i].Action = '<span class="System_content_right_table_BTN" onclick="gvRowEdit_onclick(\'' + i + '\')">編輯</span>'
                     + '<span class="System_content_right_table_BTN" onclick="gvRowDel_onclick(\'' + i + '\')">刪除</span>';
                     }
             }*/
            //選擇jqxgrid 樣版，還是使用傳統table
            //  createTableUI(scope.datalist, "grid");
            
            createGrid(scope.datalist, "div_grid");
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
    $("#div_Search").css("display", "none");
    $("#div_Inputs").css("display", "none");
    $("#div_grid").css("display", "");
}
