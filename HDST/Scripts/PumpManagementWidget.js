
//欄位轉查詢條件
var getFilterbyObj = function (qData) {
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

//取得嵌入頁面
var GetContentPage = function (id) {
    var html = "";
    $.ajax({
        url: ServerUrl + 'WaterAdmin/PumpManagement/' + id,
        datatype: 'text',
        type: 'get',
        async: false
    }).done(
        function (d) {
            html = d;
        }
    );
    return html;
};