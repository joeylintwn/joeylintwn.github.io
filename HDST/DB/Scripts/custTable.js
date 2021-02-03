
$(window).ready(function () {

    dynamicLoadCss("Scripts/table.css");
    var div_grid = document.getElementById('div_grid');
    var toolbar = $("#div_grid");

    toolbar.append(CreateToolBar());
    var mytable = document.createElement("div");
    mytable.id = "grid";
    mytable.className = "table";
    div_grid.appendChild(mytable);
});
function CreateToolBar() {
    var container = $("<div style='padding-top: 8px;display: inline-block;'></div>");

    container.append($("<button onclick='btnAddUser_onclick()' style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/add.png'/><span style='margin-left: 4px; position: relative; '>新增</span></button>"));

    container.append($("<button onclick='btnSearch_onclick()' style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/search.png'/><span style='margin-left: 4px; position: relative; '>查詢</span></button>"));
    return container;
}
function createGrid(datalist, domID, dataCssFunc, cssClass) {
    //====在原本的資料每一欄都增加動作按鈕(依需求客變)==============
    if (datalist != null) { //動作
        for (var i = 0; i < datalist.length; i++) {
            datalist[i].Action = '<button  onclick="gvRowEdit_onclick(\'' + i + '\')">編輯</button>'
                + '<button   onclick="gvRowDel_onclick(\'' + i + '\')">刪除</button>';
        }
    }
    //=============================

    var tbHtml = '<table border="1"   class="' + cssClass + '"><tr>';
    for (i in m_Columns) {
        if (m_Columns[i].hidden == false) {
            tbHtml = tbHtml + '<th vertical-align="middle">' + m_Columns[i].text + '</th>';
        }
    }
    tbHtml = tbHtml + '<th vertical-align="middle" width="120px">動作</th>';
    tbHtml = tbHtml + '</tr>';
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
    tbHtml = tbHtml + '</table>';
    $("#" + domID).html("");
    $("#" + domID).append(tbHtml);
}