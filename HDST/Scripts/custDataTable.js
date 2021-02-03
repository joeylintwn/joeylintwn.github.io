var isLoadJqxGrid = false;
$(window).ready(function () {


    dynamicLoadCss("../Scripts/jqDataTables/jquery.dataTables.min.css");
    dynamicLoadCss("../Scripts/jqDataTables/jquery.dataTables.min.css");

    if ($().DataTable == undefined) {

        dynamicLoadJS("../Scripts/jqDataTables/jquery.dataTables.min.js", function (e) {

            if ($().DataTable == undefined) {
                dynamicLoadJS("../Scripts/jqDataTables/jquery.dataTables.min.js", function (e) {
                    dynamicLoadJS("../Scripts/jqDataTables/jquery.dataTables.rowGroup.js", function (e) {
                        isLoadJqxGrid = true;
                    });

                });
            } else {
                dynamicLoadJS("../Scripts/jqDataTables/jquery.dataTables.rowGroup.js", function (e) {

                    isLoadJqxGrid = true;
                });
            }

        });

    } else {
        isLoadJqxGrid = true;
    }

});
function CreateToolBar() {
    var container = $("<div style='padding-top: 8px;display: inline-block;'></div>");

    container.append($("<button onclick='btnAddUser_onclick()' style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/add.png'/><span style='margin-left: 4px; position: relative; '>新增</span></button>"));

    container.append($("<button onclick='btnSearch_onclick()' style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/search.png'/><span style='margin-left: 4px; position: relative; '>查詢</span></button>"));
    return container;
}
function createDataListRWD(option, columnWidth) {    
    var Columns = option.Columns;
    var datalist = option.datalist;
    var domID = option.divGrid;    
    var tbKey = domID + '_table';
    $("#" + domID).empty();

    if ($("#" + tbKey).length == 0) {
        if (option.gridColumnsHtml == undefined) option.gridColumnsHtml = "";
    }
    var cs = [];

    Columns.forEach(function (c, idx) {
        if (c.hidden == false || c.hidden == undefined) {
            cs.push({ name: c.datafield, title: c.text, attribute: (c.attribute != undefined ? c.attribute:null)});
        }
    });

    var datas = []
    datalist.forEach(function (data, idx) {
        var row = [];
        cs.forEach(function (c, cdx) {
            if (c.name != 'chk')
                row.push(data[c.name])
            else
                row.push('<input type="checkbox" onchange="angular.element(this).scope().datalist[' + idx + '].chk=this.value;" />');
        });
        datas.push(row)
    });

    var tbOption = {
        destroy: true,
        responsive: true,
        data: datas,
        pageLength: 10,
        paging: option.gridPaging == undefined ? true : option.gridPaging,
        searching: option.gridSearch == undefined ? true : option.gridSearch,
        scrollX: true

    };
    if (option.gridHeight != undefined) {
        tbOption.scrollY = option.gridHeight;
    }
    //======尚未初始化====
    // columns: cs,
    if (option.gridColumnsHtml == "") {
        tbOption.columns = cs;
    }

    if (option.gridRowsGroup != undefined) {
        tbOption.rowsGroup = option.gridRowsGroup;
        tbOption.bSort = false;
    }
    var myhtml = "";
    var myColumnTitle = "";
    
    datas.forEach(function (data, idx) {
        myhtml += '<div class="table-row">';
        cs.forEach(function (column, index) {
            if (column.attribute != 'element') {
                myhtml += '<div class="table-content" style="width:' + columnWidth[index] + '"><label class="table-columnName">' + column.title + '</label>' + '<span class="table-data ellipsis" data-toggle="tooltip" title="' + data[index] + '">' + data[index] + '</span></div>';
            } else {
                myhtml += '<div class="table-content" style="width:' + columnWidth[index] + '"><label class="table-columnName table-button">' + column.title + '</label>' + '<span class="table-data">' + data[index] + '</span></div>';
            }

        })
        myhtml += "</div>";
    })
    cs.forEach(function (column, index) {
        if (column.attribute != 'element') {
            myColumnTitle += '<div id="column_' + column.name + '" class="table-columnTitle" onclick="angular.element(this).scope().sortDataList(this.id);" style="width:' + columnWidth[index] + '">' + column.title + '<i class="fa fa-sort"></i></div>';
        } else {
            myColumnTitle += '<div id="column_' + column.name + '" class="table-columnTitle" style="cursor:default;width:' + columnWidth[index] + '">' + column.title + '</div>';
        }        
    })
    $("#" + domID).append('<div class="col-12 row table-columnTitles">' + myColumnTitle + '</div><div id="' + tbKey + '" class="col-12 display">' + myhtml + '</div><div class="text-center"><span style="color:red">查詢結果：共' + datas.length + '筆資料</span></div>');
    if ($(window).width() - 250 > 550) {
        $(".table-row").each(function () {
            $(this).addClass("row");
            $(this).addClass("hideBoxShadow");
        });
        $(".table-content").each(function () {
            $(this).removeClass("w-100percent");
            $(this).addClass("hideLabel");
        });
        //$(".table-data").each(function () {
        //    $(this).addClass("ellipsis");
        //});
        $(".table-columnTitles").css("display", "");
        $(".table-button").css("display", "");
        $(".table-columnTitle").removeClass("w-100percent");
    } else {
        $(".table-row").each(function () {
            $(this).removeClass("row");
            $(this).removeClass("hideBoxShadow");
        });
        $(".table-content").each(function () {
            $(this).removeClass("hideLabel");
            $(this).addClass("w-100percent");
        });
        //$(".table-data").each(function () {
        //    $(this).removeClass("ellipsis");
        //});
        $(".table-columnTitles").css("display", "none");
        $(".table-button").css("display", "none");
        $(".table-columnTitle").addClass("w-100percent");
    }
}
function createDataList(option) {
    if (isLoadJqxGrid == false) {
        setTimeout(function () {
            createDataList(option);
        }, 1000);
        return;
    }
    var Columns = option.Columns;
    var datalist = option.datalist;
    var domID = option.divGrid;

    var tbKey = domID + '_table';
    if ($("#" + tbKey).length == 0) {
        if (option.gridColumnsHtml == undefined) option.gridColumnsHtml = "";
        $("#" + domID).append('<table id="' + tbKey + '" class="display" style="width:100%;">' + option.gridColumnsHtml + '</table>');
    }
    var cs = [];

    Columns.forEach(function (c, idx) {
        if (c.hidden == false || c.hidden == undefined) {
            cs.push({ name: c.datafield, title: c.text });
        }
    });

    var datas = []
    datalist.forEach(function (data, idx) {
        var row = [];
        cs.forEach(function (c, cdx) {
            if (c.name != 'chk')
                row.push(data[c.name])
            else
                row.push('<input type="checkbox" onchange="angular.element(this).scope().datalist[' + idx + '].chk=this.value;" />');
        });
        datas.push(row)
    });

    var tbOption = {
        destroy: true,
        responsive: true,
        data: datas,
        pageLength: 10,
        paging: option.gridPaging == undefined ? true : option.gridPaging,
        searching: option.gridSearch == undefined ? true : option.gridSearch,
        scrollX: true,
        bSort : false

    };
    if (option.gridHeight != undefined) {
        tbOption.scrollY = option.gridHeight;
    }
    //======尚未初始化====
    // columns: cs,
    if (option.gridColumnsHtml == "") {
        tbOption.columns = cs;
    }

    if (option.gridRowsGroup != undefined) {
        tbOption.rowsGroup = option.gridRowsGroup;
        tbOption.bSort = false;
    }

    $('#' + tbKey).DataTable(tbOption);
   

}
//主要資料表的內容建立
function createDataListHtml(Columns, datalist, domID, dataCssFunc) {
    var tbHtml = '<table id="' + domID + '" class="display"><thead><tr>';
    for (i in Columns) {
        if (Columns[i].hidden == false) {
            tbHtml = tbHtml + '<th vertical-align="middle">' + Columns[i].text + '</th>';
        }
    }
    tbHtml = tbHtml + '<th vertical-align="middle" width="120px">動作</th>';
    tbHtml = tbHtml + '</tr></thead><tbody>';
    for (j in datalist) {
        tbHtml = tbHtml + '<tr>';
        for (i in Columns) {
            if (Columns[i].hidden == false) {
                if (dataCssFunc == null || dataCssFunc == undefined) {
                    tbHtml = tbHtml + '<td vertical-align="middle">' + datalist[j][Columns[i].datafield] + '</td>';
                } else {
                    tbHtml = tbHtml + '<td vertical-align="middle">' + dataCssFunc(j, i, datalist[j][Columns[i].datafield]) + '</td>';
                }

            }
        }
        tbHtml = tbHtml + '<td vertical-align="middle">' + datalist[j].Action + '</td>';
        tbHtml = tbHtml + '</tr>';
    }
    tbHtml = tbHtml + '</tbody></table>';
    return tbHtml;

}
function createColumnGrid(Columns, datalist, domID, dataCssFunc, cssClass) {
    if (isLoadJqxGrid == false) {
        setTimeout(function () {
            createColumnGrid(Columns, datalist, domID, dataCssFunc, cssClass);
        }, 1000);
        return;
    }
    var tbkey = "tb" + domID;
    //====在原本的資料每一欄都增加動作按鈕(依需求客變)==============
    if (datalist != null) { //動作
        for (var i = 0; i < datalist.length; i++) {
            datalist[i].Action = '<button  onclick="gvRowEdit_onclick(\'' + i + '\')">編輯</button>'
                + '<button   onclick="gvRowDel_onclick(\'' + i + '\')">刪除</button>';
        }
    }
    //=============================
    var tbHtml = createDataListHtml(Columns, datalist, tbkey, dataCssFunc);


    var mainGrid = $("#" + domID);
    var myConent = $("#" + domID + "Conent");
    var myTalbe = $('#' + tbkey).DataTable();
    if (myConent.length == 0) {
        mainGrid.append(CreateToolBar());
        mainGrid.append("<div id='" + domID + "Conent' ></div > ");
        myConent = $("#" + domID + "Conent");

    } else {
        myConent.html("");
        if (myTalbe.length == 1) {
            myTalbe.DataTable().clear().draw();
        }
    }

    myConent.append(tbHtml);


    $('#' + tbkey).DataTable();


}
function createGrid(datalist, domID, dataCssFunc, cssClass) {
    if (isLoadJqxGrid == false) {
        setTimeout(function () {
            createGrid(datalist, domID, dataCssFunc, cssClass);
        }, 1000);
        return;
    }
    var tbkey = "tb" + domID;
    //====在原本的資料每一欄都增加動作按鈕(依需求客變)==============
    if (datalist != null) { //動作
        for (var i = 0; i < datalist.length; i++) {
            datalist[i].Action = '<button  onclick="gvRowEdit_onclick(\'' + i + '\')">編輯</button>'
                + '<button   onclick="gvRowDel_onclick(\'' + i + '\')">刪除</button>';
        }
    }
    //=============================
    var tbHtml = '<table id="' + tbkey + '" class="display"><thead><tr>';
    for (i in m_Columns) {
        if (m_Columns[i].hidden == false) {
            tbHtml = tbHtml + '<th vertical-align="middle">' + m_Columns[i].text + '</th>';
        }
    }
    tbHtml = tbHtml + '<th vertical-align="middle" width="120px">動作</th>';
    tbHtml = tbHtml + '</tr></thead><tbody>';
    for (j in datalist) {
        tbHtml = tbHtml + '<tr>';
        for (i in m_Columns) {
            if (m_Columns[i].hidden == false) {
                if (dataCssFunc == undefined) {
                    tbHtml = tbHtml + '<td vertical-align="middle">' + datalist[j][m_Columns[i].datafield] + '</td>';
                } else {
                    tbHtml = tbHtml + '<td vertical-align="middle">' + dataCssFunc(j, i, datalist[j][m_Columns[i].datafield]) + '</td>';
                }

            }
        }
        tbHtml = tbHtml + '<td vertical-align="middle">' + datalist[j].Action + '</td>';
        tbHtml = tbHtml + '</tr>';
    }
    tbHtml = tbHtml + '</tbody></table>';



    var mainGrid = $("#" + domID);
    var myConent = $("#" + domID + "Conent");
    var myTalbe = $('#' + tbkey).DataTable();
    if (myConent.length == 0) {
        mainGrid.append(CreateToolBar());
        mainGrid.append("<div id='" + domID + "Conent' ></div > ");
        myConent = $("#" + domID + "Conent");

    } else {
        myConent.html("");
        if (myTalbe.length == 1) {
            myTalbe.DataTable().clear().draw();
        }
    }

    myConent.append(tbHtml);


    $('#' + tbkey).DataTable();


}