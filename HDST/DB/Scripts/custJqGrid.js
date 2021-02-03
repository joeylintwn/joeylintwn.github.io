var isLoadJqGrid = false;


$(window).ready(function () {
    dynamicLoadCss("/Scripts/jqgrid-4.6.0/themes/ui.jqgrid.css");
    dynamicLoadCss("/Scripts/jqgrid-4.6.0/themes/ui.multiselect.css");
    dynamicLoadCss("/Scripts/jqgrid-4.6.0/themes/redmond/jquery-ui-custom.css");
    dynamicLoadJS("/Scripts/jqgrid-4.6.0/js/grid.locale-cn.js"); // < !--jqGrid中文化-->
    dynamicLoadJS("/Scripts/jqgrid-4.6.0/js/jquery.jqGrid.js", function () {
        isLoadJqGrid = true;
    });
    var div_grid = document.getElementById('div_grid');
    var toolbar = $("#div_grid");

    toolbar.append(CreateToolBar());

    var mytable = document.createElement("table");
    mytable.id = "grid";

    var myPage = document.createElement("div");
    myPage.id = "pagerMain";
    div_grid.appendChild(mytable);
    div_grid.appendChild(myPage);

});
function CreateToolBar() {
    var container = $("<div style='padding-top: 8px;display: inline-block;'></div>");

    container.append($("<button onclick='btnAddUser_onclick()' style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/add.png'/><span style='margin-left: 4px; position: relative; '>新增</span></button>"));
    var editButton = $("<button style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/edit.png'/><span style='margin-left: 4px; position: relative; '>修改</span></button>");
    editButton.click(function (event) {
        var selectedrowindex = $("#grid").jqGrid('getGridParam', 'selrow');
        selectedrowindex = $("#grid").getGridRowById(selectedrowindex).rowIndex - 1;
        gvRowEdit_onclick(parseInt(selectedrowindex));
    });
    container.append(editButton);
    var deleteButton = $("<button style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/delete.png'/><span style='margin-left: 4px; position: relative; '>刪除</span></button>");
    deleteButton.click(function (event) {
        var selectedrowindex = $("#grid").jqGrid('getGridParam', 'selrow');
        selectedrowindex = $("#grid").getGridRowById(selectedrowindex).rowIndex - 1;
        gvRowDel_onclick(parseInt(selectedrowindex));
    });
    container.append(deleteButton);
    container.append($("<button onclick='btnSearch_onclick()' style='float: left; margin-left: 5px;'><img style='position: relative;' src='../images/search.png'/><span style='margin-left: 4px; position: relative; '>查詢</span></button> "));
    return container;
}
//< script src = "http://trirand.com/blog/jqgrid/js/jquery-ui-custom.min.js" type = "text/javascript" ></script > 
$(window).resize(fixGridSize);
//====動態調整寬度，只有用jqgrid時要用=============


function fixGridSize() {
    var outerwidth = $('#div_grid').width();
    $('#grid').setGridWidth(outerwidth); // setGridWidth method sets a new width to the grid dynamically

    var outerheight = $('#div_grid').height() - 90; //自動調整高度，如果不使用分頁，可以不調整
    $('#grid').setGridHeight(outerheight); // setGridWidth method sets a new width to the grid dynamically
}


function createGrid(datalist, domID, cssCallBack) {

    if (isLoadJqGrid == false) {
        setTimeout(function () {
            createGrid(datalist, domID);
        }, 1000);
        return;
    }
    //====在原本的資料每一欄都增加動作按鈕(依需求客變)==============
    if (datalist != null) { //動作
        for (var i = 0; i < datalist.length; i++) {
            datalist[i].Action = "<button onclick='gvRowEdit_onclick(" + i + ")'><img style='position: relative; ' src='../images/edit.png'/>編輯</button>"
                + "<button  onclick='gvRowDel_onclick(" + i + ")'><img style='position: relative;' src='../images/delete.png'/>刪除</button>";
        }
    }
    //=============================
    var cols = [];
    var colModels = [];

    m_Columns.forEach(function (item, id) {
        if (item.hidden == false) {
            cols.push(item.text);
            colModels.push({
                name: item.datafield,
                index: item.datafield,
                width: item.width,
                align: item.align,
                formatter: valueFormatter
            });
        }
    });
    cols.push('動作');
    colModels.push({
        name: 'Action',
        index: 'Action',
        width: '150px',
        align: 'left'
    });
    //固定都是grid，因為在初始化的時後 ，會在div內自動加一個table
    jQuery("#grid").jqGrid('clearGridData');
    jQuery("#grid").jqGrid('setGridParam', { data: datalist });
    jQuery("#grid").trigger('reloadGrid');

    jQuery("#grid").jqGrid({
        data: datalist,
        datatype: "local",
        height: '100%',
        colNames: cols,
        colModel: colModels,
        rowNum: 30,
        rowList: [15, 20, 30],
        pager: '#pagerMain',
        viewrecords: true,
        autowidth: true,
        shrinkToFit: true  //自動寬

    });
    jQuery("#" + domID).jqGrid('navGrid', '#pagerMain', { edit: false, add: false, del: false });


    $(".ui-state-default").addClass('ui-state-custom');

    fixGridSize();
    function valueFormatter(cellValue, opt, rowObject) {

        if (cssCallBack != undefined) {
            return cssCallBack(opt.rowId, opt.pos, cellValue, rowObject);
        } else {
            return cellValue;
        }

    }
}

