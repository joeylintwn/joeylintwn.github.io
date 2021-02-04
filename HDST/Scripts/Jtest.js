function setTopmenu(textarray) {
    var tempstr = '';
    $.each(textarray, function (i, textarray_val) {
        if (textarray_val != undefined) { 
        tempstr += '<div class="content_right_breadcrumb_text">' + textarray_val + '</div>'
        + '<div class="content_right_breadcrumb_arrow"></div>';
        }
    });
    $('#Bread_Crumbs').html(tempstr);
}

//---object filter
//回傳陣列裡符合條件的Object
function zf_objfilter(tgobj, cond1, val1, cond2, val2, cond3, val3) {
    cond1 = cond1 || false;
    cond2 = cond2 || false;
    cond3 = cond3 || false;
    console.log('條件:' + cond1 + val1 + ',' + cond2 + val2 + ',' + cond3 + val3);
    var result = tgobj.filter(function (e) {
        return e[cond1] == val1 && (cond2 ? e[cond2] == val2 : 1 == 1) && (cond3 ? e[cond3] == val3 : 1 == 1);

    });
    console.log('-objfilter回傳-')
    console.log(result)
    return result;
}
//===object filter

//字串取代全部,str,orgstr 原始字串,repstr 取代字中
function replaceAll(str, orgstr, repstr) {
    if (orgstr != '') {

        /*
        while (str.indexOf(orgstr) > -1) {
            //console.log(str.indexOf(orgstr));
            str = str.substring(0, str.indexOf(orgstr)) + repstr + str.substring(str.indexOf(orgstr) + orgstr.length, str.length);
        }
        */

        if (orgstr != '') {
            var re = new RegExp(orgstr, 'g');
            str = str.replace(re, repstr);
        }

    }
    return str;
}