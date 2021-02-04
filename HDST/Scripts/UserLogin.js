//帳秘輸入送出
//var logoutUrl = '@Url.Action("Logout", "HSDS", new {Area="" })';

//
function AjaxQuery(url, QueryData, retFunc) {
    
    $.ajax({
        type: 'GET',
        url: url,
        data: QueryData,
        dataType: "json",
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
