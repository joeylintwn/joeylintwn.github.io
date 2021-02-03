//========用法說明=======================
//*在原本的jqxgrid表格內做編輯的動作
//===========================================
var m_Columns;//欄位
var m_datafields = [];
var urSource = null;
//====angularJS 初始化======
var scope;
var db = new DBApi("../api/db/");

var app = angular.module('myApp', ['ngCookies']).controller('siteCtrl', function ($scope, $http, $cookies) {
     scope = $scope;
    m_Token = $cookies.get('Token');
    if (m_Token == "") {
        alert('沒有權限，請先登入');
        window.location = 'login.html';
    } else {
      if ($cookies.get('APIUrl')!=null){
             db = new DBApi($cookies.get('APIUrl'),m_Token);
          }else{
             db = new DBApi("../api/db/", m_Token);
        }
        init();
    }
    function init() {

        db.GetColumn(m_TableName, function (data) {
            m_Columns = data.Result;

            //=========設定搜尋的項目=============================
            for (var i in m_Columns) {
                var c = m_Columns[i];
                if (c.editable == undefined) c.editable = false;  //預設為不可編輯
                if (["isShowGrid", "isInput", "isSearch"].indexOf(c.datafield) >= 0) {
                    c.columntype = 'checkbox'
                    c.editable = true;
                }
                if ("CNAME" == c.datafield) {
                    c.editable = true;
                }
                m_datafields.push({ name: c.datafield, type: c.type });
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
                    scope.inputs[c.datafield] = c;
                    scope.inputs.push(c);
                }
                RasieInputData(scope, c)
            }

            db.GetTableList(function (data) {
                for (var i in data.Result) {
                    var t = data.Result[i];
                    scope.TableName_Option[t.TABLE_NAME] = t.TABLE_NAME;
                }
                scope.querydata.TableName = "UserInfo";

                scope.$apply(); //勿刪否則會沒有搜尋介面                getDataList();

            });
            scope.onTableNameChange = function () {
                getDataList();
            }
        })
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
).directive('inputDirective', function ($compile) {
    return {
        replace: true,
        template: '',
        link: function (myScope, element) {
            var el = angular.element(getBootstrapTemplate(myScope.input, 'editdata'));
            //var el = getTableTemplate(myScope, 'editdata');
            $compile(el)(myScope);
            element.append(el);
        }
    }
}).directive('searchDirective', function ($compile) {
    return {
        replace: true,
        template: '',
        link: function (myScope, element) {
            var el = angular.element(getBootstrapTemplate(myScope.input, 'querydata'));
            //var el = getTableTemplate(myScope, 'querydata');
            $compile(el)(myScope);
            element.append(el);
        }
    }
});
//====================================
//初始化表格




function createJqXGridUI(datalist, domID) {
    if (urSource == null) {
        urSource = {
            localdata: datalist,
            dataType: 'array',
            datafields: m_datafields
        };
        var dataAdapter = new $.jqx.dataAdapter(urSource);

        $("#" + domID).jqxGrid(
            {
                width: '100%',
                height: '100%',
                showtoolbar: true,
                toolbarheight: 40,
                rendertoolbar: function (toolbar) {
                    //上方工具列                    var container = $("<div style='margin: 5px;'></div>");
                    var editButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/add.png'/><span style='margin-left: 4px; position: relative; '>修改</span></div>").jqxButton();
                    editButton.click(function (event) {
                        var selectedrowindex = $("#grid").jqxGrid('getselectedrowindex');
                        gvRowEdit_onclick(selectedrowindex);
                    });
                    container.append(editButton);
                    var deleteButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/delete.png'/><span style='margin-left: 4px; position: relative; '>刪除</span></div>").jqxButton();
                    deleteButton.click(function (event) {
                        var selectedrowindex = $("#grid").jqxGrid('getselectedrowindex');
                        gvRowDel_onclick(selectedrowindex);
                    });
                    container.append(deleteButton);
                    container.append($("<div onclick='btnSaveGrid_onclick()' style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/search.png'/>" +
                        "<span style='margin-left: 4px; position: relative; '>資料表異動存檔</span></div>").jqxButton());

                    toolbar.append(container);
                },
                columnsheight: 30,
                rowsheight: 35,
                theme: 'custom',
                autoheight: false,
                enabletooltips: true,
                editable: true,
                pageable: true,
                localization: localizationobj,
                pagermode: 'simple',
                pagesize: 20,
                source: dataAdapter,
                sortable: true,
                selectionmode: 'singlerow',
                columns: m_Columns
            });
        //==========設定CheckBox=============
        $("#" + domID).on('cellendedit', function (event, p) {
            var args = event.args;
            urSource.localdata[args.rowindex][args.datafield] = args.value;
            urSource.localdata[args.rowindex].isChanged = true; //有異動過的記錄，多筆修改時會用到
        });
        //==============================
    } else {
        urSource.localdata = datalist;
        $("#" + domID).jqxGrid('updatebounddata', 'cells');
    }

}
//取得資料列表
function getDataList() {

    $("#div_grid").css("display", "");

    db.GetDataList(m_TableName,
        scope.querydata,
        function (data) {
            scope.datalist = data.Result;
            db.GetColumn(scope.querydata.TableName,
                function (r) {
                    cs = r.Result;
                    for (var i in cs) {
                        var c = cs[i];
                        var isfind = false;
                        for (j in scope.datalist) {
                            var obj = scope.datalist[j];
                            if (obj.EName == c.datafield) {
                                isfind = true;
                                break;
                            }
                        }
                        if (isfind == false) {
                            scope.datalist.push({ EName: c.datafield, TableName: scope.querydata.TableName });
                        }
                    }
                    createJqXGridUI(scope.datalist, "grid");
                }
            );

        });
}

function gvRowDel_onclick(index) {
    if (index < 0) {
        alert("請選擇資料");
        return;
    }
    if (!confirm("確定要刪除此筆資料嗎?")) return false;
    var fn = function (d) {
        if (d.isSuccess) {
            alert('刪除成功');
            getDataList();
        }
        else {
            alert(d.ErrorMsg);
        }
    }
    db.DeleteData(m_TableName, m_PrimKey, scope.datalist[index][m_PrimKey], fn);
}

function btnClearQuery_onclick() {
    scope.querydata = new Object;
    scope.$apply();
}
function btnSaveGrid_onclick() {
    var changeData = [];
    for (var i in scope.datalist) {
        var ob = scope.datalist[i];
        if (ob.isChanged) {
            changeData.push(ob);
        }
    }
    if (changeData.length > 0) {
        db.UpdateTable(m_TableName, changeData, m_PrimKey,
            function (d) {
                if (d.isSuccess == false) alert(d.ErrorMsg);
                else {

                    alert('修改成功');
                    getDataList();
                }
            });
    } else {
        alert('沒有需更新異動的資料');
    }
}
function btnSearch_onclick() {

    $("#div_grid").css("display", "none");

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
    scope.editdata = JSON.parse(JSON.stringify(scope.datalist[index]));  //覆置一份
    _ModifyUser_init(false);
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

    $("#div_Inputs").css("display", "none");
    $("#div_grid").css("display", "");
}