var isLoadJqxGrid = false;
$(window).ready(function () {
    dynamicLoadCss("../Scripts/Widgets/styles/jqx.base.css");
    dynamicLoadCss("../Scripts/Widgets/styles/jqx.custom.css");

    dynamicLoadJS("../Scripts/Widgets/jqxcore.js");
    dynamicLoadJS("../Scripts/Widgets/jqx-all2.js", function () {
        dynamicLoadJS("../Scripts/Widgets/jqxgrid.edit.js");
        dynamicLoadJS("../Scripts/Widgets/jqxcheckbox.js", function () {
            isLoadJqxGrid = true;
        });

    });
});
//=======JqGrid 的語言設定==============================
var localizationobj = {
    pagergotopagestring: "頁數移至:",
    pagershowrowsstring: "頁&emsp;&emsp;分頁筆數:",
    pagerrangestring: "&emsp;總筆數:",
    pagernextbuttonstring: "下一頁",
    pagerpreviousbuttonstring: "上一頁",
    sortascendingstring: "升冪",
    sortdescendingstring: "降冪",
    sortremovestring: "取消排序",
    emptydatastring: "無資料",
    pagerfirstbuttonstring: "第一頁",
    pagerlastbuttonstring: "最後頁"
    //firstDay: 1,
    //percentsymbol: "%",
    //currencysymbol: "€",
    //currencysymbolposition: "before",
    //decimalseparator: ".",
    //thousandsseparator: ","
};

function createDataList(option) {
    if (isLoadJqxGrid == false) {
        setTimeout(function () {
            createDataList(option);
        }, 1000);
        return;
    }






    var domID = option.divGrid;
    var isHasAction = false;
    if (option.jqx_urSource == undefined || option.jqx_urSource == null) {
        var m_datafields = [];
        //=========jqxgrd設定搜尋的項目=============================
        for (var i in option.Columns) {
            var c = option.Columns[i];
            if (c.editable == undefined) c.editable = false;  //預設為不可編輯            m_datafields.push({ name: c.datafield, type: c.type });//jqxgrd的欄位型別定義            if (c.datafield == "Action") {
                isHasAction = true;
            }
        }
        if (isHasAction == false) {
            var container = $("#tool_" + option.divGrid)

            if (container.children().length == 0) {
                var editButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/edit.png'/><span style='margin-left: 4px; position: relative; '>修改</span></div>").jqxButton();
                editButton.click(function (event) {
                    var selectedrowindex = $("#" + option.divGrid).jqxGrid('getselectedrowindex');
                    option.RowEdit(selectedrowindex);
                });
                container.append(editButton);
                //=============================================
                var deleteButton = $("<div  style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/delete.png'/><span style='margin-left: 4px; position: relative; '>刪除</span></div>").jqxButton();
                deleteButton.click(function (event) {
                    var selectedrowindex = $("#" + option.divGrid).jqxGrid('getselectedrowindex');
                    option.RowDel(selectedrowindex);
                });
                container.append(deleteButton);
            }
        }
        //=============================================

        option.jqx_urSource = {
            localdata: option.datalist,
            dataType: 'array',
            datafields: m_datafields
        };
        var dataAdapter = new $.jqx.dataAdapter(option.jqx_urSource);

        $("#" + domID).jqxGrid(
            {
                width: '100%',
                height: '100%',
                columnsheight: 30,
                pagesize: 20,
                rowsheight: 35,
                theme: 'custom',
                autoheight: false,
                enabletooltips: true,
                editable: true,
                pageable: true,
                localization: localizationobj,
                pagermode: 'simple',
                source: dataAdapter,
                sortable: true,
                selectionmode: 'singlerow',
                columns: option.Columns
            });
        //==========設定CheckBox=============
        $("#" + domID).on('cellendedit', function (event, p) {
            var args = event.args;
            option.jqx_urSource.localdata[args.rowindex][args.datafield] = args.value;
        });
        //==============================
    } else {
        option.jqx_urSource.localdata = option.datalist;
        $("#" + domID).jqxGrid('updatebounddata', 'cells');
    }
}
function CreateToolBarHtml(domID, scope) {

    var container = $("<div style='margin: 5px;'></div>");
    var newButton = $("<div   style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/add.png'/><span style='margin-left: 4px; position: relative; '>新增</span></div>").jqxButton();
    newButton.click(function () {
        if (scope != undefined) {
            scope.btnAddUser_onclick();
        } else {
            btnAddUser_onclick();
        }
    });
    container.append(newButton);



    var searchButton = $("<div  style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/search.png'/><span style='margin-left: 4px; position: relative; '>查詢</span></div>").jqxButton();
    searchButton.click(function () {
        if (scope != undefined) {
            scope.btnSearch_onclick();
        } else {
            btnSearch_onclick();
        }
    });
    container.append(searchButton);
    return container;
}

//初始化表格function createGrid(datalist, domID, scope) {
    if (isLoadJqxGrid == false) {
        setTimeout(function () {
            createGrid(datalist, domID, scope);
        }, 1000);
        return;
    }
    var div_grid = $('#div_grid');
    if ($('#grid').length == 0)
        div_grid.append("<div id='grid'></div>");



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
                    //上方工具列
                    toolbar.append(CreateToolBarUI(domID, scope));
                },
                columnsheight: 30,
                pagesize: 20,
                rowsheight: 35,
                theme: 'custom',
                autoheight: false,
                enabletooltips: true,
                editable: true,
                pageable: true,
                localization: localizationobj,
                pagermode: 'simple',
                source: dataAdapter,
                sortable: true,
                selectionmode: 'singlerow',
                columns: m_Columns
            });
        //==========設定CheckBox=============
        $("#" + domID).on('cellendedit', function (event, p) {
            var args = event.args;
            urSource.localdata[args.rowindex][args.datafield] = args.value;
        });
        //==============================
    } else {
        urSource.localdata = datalist;
        $("#" + domID).jqxGrid('updatebounddata', 'cells');
    }

}
function CreateToolBarUI(domID, scope) {

    var container = $("<div style='margin: 5px;'></div>");
    var newButton = $("<div   style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/add.png'/><span style='margin-left: 4px; position: relative; '>新增</span></div>").jqxButton();
    newButton.click(function () {
        if (scope != undefined) {
            scope.btnAddUser_onclick();
        } else {
            btnAddUser_onclick();
        }
    });
    container.append(newButton);


    var editButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/edit.png'/><span style='margin-left: 4px; position: relative; '>修改</span></div>").jqxButton();
    editButton.click(function (event) {
        var selectedrowindex = $("#grid").jqxGrid('getselectedrowindex');

        if (scope != undefined) {
            scope.gvRowEdit_onclick(selectedrowindex);
        } else {
            gvRowEdit_onclick(selectedrowindex);
        }

    });
    container.append(editButton);
    //=============================================
    var deleteButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/delete.png'/><span style='margin-left: 4px; position: relative; '>刪除</span></div>").jqxButton();
    deleteButton.click(function (event) {
        var selectedrowindex = $("#grid").jqxGrid('getselectedrowindex');

        if (scope != undefined) {
            scope.gvRowDel_onclick(selectedrowindex);
        } else {
            gvRowDel_onclick(selectedrowindex);
        }
    });
    container.append(deleteButton);
    //=============================================
    var searchButton = $("<div  style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/search.png'/><span style='margin-left: 4px; position: relative; '>查詢</span></div>").jqxButton();
    searchButton.click(function () {
        if (scope != undefined) {
            scope.btnSearch_onclick();
        } else {
            btnSearch_onclick();
        }
    });
    container.append(searchButton);
    return container;
}

//初始化表格 有換行功能的




function createJqXGridUI_2(datalist, domID) {
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
                    //上方工具列
                    toolbar.append(CreateToolBarUI());
                },
                autorowheight: true,
                columnsheight: 60,  //增加高度使其能斷行               
                theme: 'custom',
                autoheight: true,      //自動高，不使用分頁
                enabletooltips: true,
                editable: true,
                pageable: false, //自動高，不使用分頁
                localization: localizationobj,
                pagermode: 'simple',
                source: dataAdapter,
                sortable: true,
                selectionmode: 'singlerow',
                columns: m_Columns
            });
        //==========設定CheckBox=============
        $("#" + domID).on('cellendedit', function (event, p) {
            var args = event.args;
            urSource.localdata[args.rowindex][args.datafield] = args.value;
        });
        //==============================
    } else {
        urSource.localdata = datalist;
        $("#" + domID).jqxGrid('updatebounddata', 'cells');
    }

}