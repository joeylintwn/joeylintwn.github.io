<template>
  <div>
    <!--左方滾動標題-->

    <div id="menu">
      <x-bindhtml :template="LeftMenuHtml"></x-bindhtml>
    </div>
    <div class="body-content"
         style="background-color: #FAFAFA;">
             <x-loader :is-loading="TableIsLoading"></x-loader>
      <!--資料顯示介面介面-->
      <div v-show="GridShow">
        <button type="button"
                @click='AddNewData'
                style='float: left; margin-left: 5px;'>
          <img style='position: relative;'
               src='../images/add.png' /><span style='margin-left: 4px; position: relative; '>新增</span>
        </button>
        <div :id='"tool_" +divGrid'></div>
        <button type="button"
                @click='ShowSearchBox()'
                style="float: left; margin-left: 5px;"
                v-show="queryButtonShow">
          <img style='position: relative;'
               src='../images/search.png' /><span style='margin-left: 4px; position: relative; '>查詢</span>
        </button>
        <div style="clear:both"></div>

        <x-bindhtml :template="mobileHtml"></x-bindhtml>

        <div :id="divGrid"
             style="border:none;height:100%;min-height:500px">
        </div>

      </div>
      <!--搜尋介面-->
      <div v-show="SearchShow"
           class="System_content_right_Allinput_layout">
        <!--=========搜尋介面，使用樣版設定============-->

        <div class="form-inline">
          <x-bindhtml :template="SearchHtml"></x-bindhtml>

        </div>
        <div style="width:100%;margin:20px 0px; text-align:center">
          <input type="button"
                 class="FunBtn"
                 value="搜尋"
                 @click="getDataList()" />
          <input type="button"
                 class="FunBtn"
                 value="清空"
                 @click="ClearQuery()" />
          <input type="button"
                 class="FunBtn"
                 value="取消"
                 @click="CancelEdit()" />
        </div>

      </div>
      <!--輸入介面-->
      <form name="myForm"
            @submit="SaveData">
        <!--輸入介面POPUP-->
        <div v-if="isPopupInput"
             v-show="InputShow"
             role="dialog"
             class="modal fade"
             :id="popupModal">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button"
                        class="close"
                        data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div class="modal-body form-inline">
                <x-bindhtml :template="CustInputHtml"></x-bindhtml>

                <div v-show="DetailShow">
                  <x-bindhtml :template="DetailHtml"></x-bindhtml>

                </div>
              </div>
              <div class="modal-footer">
                <div style="width:100%;margin:20px 0px; text-align:center">
                  <input type="submit"
                         class="FunBtn"
                         value="儲存" />
                  <input type="button"
                         class="FunBtn"
                         value="取消"
                         @click="CancelEdit()" />
                </div>
              </div>
            </div>
          </div>

        </div>
        <!--輸入介面平面無POPUP-->
        <div v-if="!isPopupInput"
             v-show="InputShow">
          <!--<div></div>-->
          <!--放這裡-->
          <!--<x-inputhtml style="width:100%;"></x-inputhtml>-->
          <div v-show="DetailShow">
            <x-bindhtml :template="DetailHtml"></x-bindhtml>
            <!--<x-detailhtml style="width:100%;"></x-detailhtml>-->

          </div>
          <div style="width:100%;margin:20px 0px; text-align:center">
            <input type="submit"
                   class="FunBtn"
                   value="儲存" />
            <input type="button"
                   class="FunBtn"
                   value="取消"
                   @click="CancelEdit()" />
          </div>
        </div>
      </form>

    </div>
    <div class="modal fade"
         id="editImageModal"
         data-backdrop="static"
         data-keyboard="false"
         tabindex="-1"
         role="dialog">
      <div class="modal-dialog modal-xl"
           role="document">
        <div class="modal-content">
          <div class="modal-body">
            <x-painter :setting="{'minHeight':'80vh',height:'80px'}"
                       ref="painter">
              <!--*****按鍵*****-->
              <!--返回-->
              <div class="action"
                   @click="leaveEditImag()">
                <i class="fas fa-home"></i>
              </div>
              <!--存檔-->
              <div class="action"
                   @click="saveThisFile()">
                <i class="fas fa-save"></i>
              </div>
            </x-painter>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
<!-- mobileUI-- > section {
  padding: 0px;
  margin: 1vh 0;
}

#item_line {
  height: 1px;
  background: #b6ff00;
  margin: 5px;
}

.ItemList {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: wrap;
  flex-flow: wrap;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

.ItemData {
  min-width: 400px;
  width: 31%;
  margin: 1%;
  background: #fff;
  -webkit-box-shadow: 0px 3px 10px #0000001a;
  box-shadow: 0px 3px 10px #0000001a;
  border-radius: 10px;
  padding: 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.ItemInfo {
  min-height: 200px;
  color: black;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  margin-top: 10px;
}

.ItemField {
  font-weight: bold;
}

.ItemValue {
}
/* 圖片 */
.preview-img {
  max-width: 200px;
  border: gray solid 1px;
  padding: 10px 10px;
  border-radius: 5%;
}

.preview-img-header {
  padding: 0.5rem 1rem;
  text-align: center;
}

.preview-img-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 133px;
}

.image-tool-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.image-tool-upload {
  cursor: pointer;
  padding: 0.5rem;
  background: white;
  border: 1px solid red;
  float: left;
  margin-right: 10px;
}

.image-tool-edit {
  cursor: pointer;
  padding: 0.5rem;
  background: white;
  border: 1px solid red;
  float: left;
}
</style>
<script>
function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
function getLeftMenuHtml(scope) {
  var itemHtml = "";
  scope.Columns.filter(item => {
    return item.isInput;
  }).forEach(item => {
    itemHtml +=
      "<a class='menu-item' href='#editdata_" +
      item.datafield +
      "'>" +
      item.text +
      "</a>";
  });
  return "<div >" + itemHtml + "</div>";
}
///手機樣版
function getMobileDetail(scope, maincolumn) {
  var itemHtml = "";
  scope.Columns.forEach(function(c, i) {
    if (c.hidden == false || c.hidden == undefined) {
      if (c.datafield != maincolumn && c.datafield != "Action") {
        if (maincolumn == undefined) maincolumn = c.datafield;
        else
          itemHtml +=
            '<div><span class="ItemField">' +
            c.text +
            ":</span>" +
            '<span class="ItemValue">{{data.' +
            c.datafield +
            "}}</span></div>";
      }
    }
  });

  var html = '<section class="ItemList" style="display:none">';
  html += '<div class="ItemData" v-for="data in datalist">';
  html += '<div   class="ItemInfo">';
  html += ' <h3 style="font-weight: 600">{{data.' + maincolumn + "}}</h3>";
  html += '<div id="item_line"></div>';
  html += itemHtml;
  html += "</div>";
  html +=
    ' <div style="padding-top:10px;text-align:center" v-html="data.Action"></div>';
  html += "</div>";
  html += "</section>";

  return html;
}
function VueDetail(scope) {
  //==== 初始化======
  if (scope.PrimKey == undefined) scope.PrimKey = "id"; //資料表主key，要設對，才能做修改及刪除
  if (scope.DbKey == undefined) scope.DbKey = ""; //資料表主key，要設對，才能做修改及刪除
  //=====  (預設TableName=editTableName)===
  //===== 如果編輯的表與設定的表單不一樣，可修改editTableName
  //scope.editTableName = "MIS_Function";

  if (scope.editTableName == undefined) scope.editTableName = scope.TableName;
  //======================

  if (!scope.isPopupInput) scope.isPopupInput = false;
  if (scope.queryButtonShow == undefined) scope.queryButtonShow = true;

  //========dataGrid相關設定=================
  scope.divGrid = "gd" + scope.id;
  if (scope.gridSearch == undefined) scope.gridSearch = true;
  if (scope.gridAutoGetList == undefined) scope.gridAutoGetList = true;
  if (scope.gridPaging == undefined) scope.gridPaging = true;
  if (scope.gridChkbox == undefined) scope.gridChkbox = false;
  scope.GridShow = true;
  scope.DetailShow = false;
  scope.InputShow = false;
  scope.SearchShow = false;
  scope.SearchHtml = "";

  scope.mobileHtml = "";
  scope.InputHtml = "";
  scope.CustInputHtml = "";
  scope.DetailHtml = "";
  scope.LeftMenuHtml = "";

  scope.querydata = {};

  //初始化內容要放這裡，不然無法連動
  scope.editdata = {};
  scope.datalist = [];
  scope.RelationInfo = [];

  // scope.gridRowsGroup = []; //合併儲存格
  ///===============================================

  scope.jqx_urSource = null;
  scope.popupModal = "popupModal_" + scope.id;

  //=============主程式區塊=====================
  //取得外部傳來的token
  //=====資料存檔

  scope.Columns = [];
  scope.UploadFiles = function(d, fn) {
    var pid = "";

    if (scope.editdata[scope.PrimKey] == undefined) {
      pid = d.Result[0];
    } else {
      pid = scope.editdata[scope.PrimKey];
    }

    var files = $('input[type="file"]');
    var allFile = [];
    for (var i = 0; i < files.length; i++) {
      if (files[i].files.length > 0) {
        var file = files[i].files[0];
        allFile.push(file);
      }
    }
    if (allFile.length > 0) {
      db.UploadFiles(allFile, scope.TableName, pid, function(ret) {
        fn(ret);
      });
    } else {
      fn({ Result: "no data", isSuccess: true });
    }

    return true;
  };
  scope.CustUploadFiles = function(d, fn) {
    debugger;
    var pid = "";
    if (scope.editdata[scope.PrimKey] == undefined) {
      pid = d.Result[0];
    } else {
      pid = scope.editdata[scope.PrimKey];
    }

    var allFile = [];
    for (let i in scope.uploadedImg) {
      let fileName = "";
      let file;
      if (scope.uploadedImg[i]) {
        if (i === "T36_Base64") fileName = "正面.jpg";
        else if (i === "T38_Base64") fileName = "細部.jpg";
        else if (i === "T40_Base64") fileName = "左側.jpg";
        else if (i === "T42_Base64") fileName = "右側.jpg";

        if (scope.uploadedImg[i].indexOf("base64") != -1) {
          file = dataURLtoFile(scope.uploadedImg[i], fileName);
          allFile.push(file);
        }
      }
    }

    if (allFile.length > 0) {
      db.UploadFiles(allFile, scope.TableName, pid, function(ret) {
        fn(ret);
      });
    } else {
      fn({ Result: "no data", isSuccess: true });
    }

    return true;
  };
  scope.SaveData = function(myForm) {
    myForm.preventDefault();
    let isValid = scope.validForm();
 
    //scope.myForm.$valid
    if (isValid) {
       if(!scope.formatToDB()) return;
      if (scope.VaildKey != null) {
        scope.editdata.VaildKey = scope.VaildKey;
      }
      //新版本不論新增或修改，一律都傳primkey; 2020/4/20
      db.UpdateTable(
        scope.editTableName,
        scope.editdata,
        scope.PrimKey,
        function(d) {
          if (d.isSuccess == false) {
            //如果有錯誤
            if (scope.VaildKey != null) {
              db.GetVaildKey(function(data) {
                scope.VaildKey =
                  scope.VaildKey.split("|")[0] +
                  "|" +
                  decodeImage(data.Result, "imgKey");
              });
            }
            alert(d.ErrorMsg);
          } else {
            debugger;
            scope.CustUploadFiles(d, function(r) {
              if (r.isSuccess) {
                if (scope.editdata[scope.PrimKey]) {
                  alert("修改成功");
                } else {
                  //======新增時如果有副表，要同時異動=========
                  scope.RelationInfo.forEach(function(rel, i) {
                    var scpDetail =
                      VueScopes[
                        "rel_" + rel.RelationTable + (i == 0 ? "" : "_" + i)
                      ].scope;
                    var v = scpDetail.defValue[r.RelationKey];
                    var ds = [];

                    scpDetail.datalist.forEach(function(mm, i) {
                      var o = new Object();
                      o[scpDetail.PrimKey] = mm[scpDetail.PrimKey];
                      o[rel.RelationKey] = d.Result[0];
                      ds.push(o);
                    });

                    db.UpdateTable(
                      scpDetail.editTableName,
                      ds,
                      scpDetail.PrimKey,
                      function(res) {}
                    );
                  });
                  //====================
                  alert("新增成功");
                }
              } else {
                alert(
                  "上傳失敗，請使用編輯功能，重新上傳。錯誤訊息:" + r.ErrorMsg
                );
              }
              scope.getDataList();
              scope.CancelEdit();
            });
          }
        }
      );
    } 
  };
  scope.getFilterbyObj = function(qData) {
    if (scope.defValue != null) {
      for (var key in scope.defValue) {
        qData[key] = scope.defValue[key];
      }
    }
    var filter = "1=1";

    for (var key in qData) {
      var v = qData[key];
      if (v != undefined && v != "") {
        if (key.indexOf("__from") > 0) {
          if (!$.isNumeric(v)) {
            v = new Date(v); //解決日期查詢問題
            v = v.toDateString();
          }
          filter =
            filter +
            " and " +
            key.replace("__from", "") +
            ">=" +
            ($.isNumeric(v) ? v : "'" + v + "'");
        } else if (key.indexOf("__to") > 0) {
          if (!$.isNumeric(v)) {
            v = new Date(v); //解決日期查詢問題
            v = v.toDateString();
          }
          filter =
            filter +
            " and " +
            key.replace("__to", "") +
            "<=" +
            ($.isNumeric(v) ? v : "'" + v + "'");
        } else {
          //尚未在此解決日期問題
          filter =
            filter + " and " + key + "=" + ($.isNumeric(v) ? v : "'" + v + "'");
        }
      }
    }
    return filter;
  };

  scope.CheckWIndowSize = function() {
    if (window.innerWidth < 600) {
      $("#" + scope.divGrid).hide();
      $(".ItemList").show();
      scope.$apply();
    } else {
      $("#" + scope.divGrid).show();
      $(".ItemList").hide();
    }
  };
  $(window).resize(scope.CheckWIndowSize);

  scope.getDataList = function(filter) {
    scope.SearchShow = false;
    scope.GridShow = true;
    scope.TableIsLoading=true;
    if (scope.$apply) scope.$apply();
    if (filter == undefined)
      filter = scope.getFilterbyObj(scope.querydata) + " order by ID desc";
    db.SelectTable(scope.TableName, filter, function(data) {
      if (data.isSuccess) {
        scope.datalist = data.Result;
        //====在原本的資料每一欄都增加動作按鈕(依需求客變)==============

        if (scope.datalist != null) {
          //動作
          for (var i = 0; i < scope.datalist.length; i++) {
            //scope.datalist[i].Action = '<button   ng-click="RowEdit (\'' + i + '\') " data-toggle="modal" data-target="#{{popupModal}}">編輯</button>'
            //    + '<button   ng-click="RowDel(\'' + i + '\')">刪除</button>';

            scope.datalist[i].Action =
              '<button type="button"   onclick="VueScopes[\'' +
              scope.id +
              "'].RowEdit ('" +
              i +
              "');\">編輯</button>" +
              '<button type="button" onclick="VueScopes[\'' +
              scope.id +
              "'].RowDel('" +
              i +
              "')\">刪除</button>";
            if (scope.datalist[i].Geometry) {
              scope.datalist[i].Action += scope.getGISAction(
                scope.datalist[i].Geometry
              );
            }
            if (scope.datalist[i][scope.GeoKey]) {
              scope.datalist[i].Action += scope.getGISAction(
                scope.datalist[i][scope.GeoKey]
              );
            }
          }
        }

        createDataList(scope);
         scope.TableIsLoading=false;
        scope.CheckWIndowSize();
      } else {
        alert(data.ErrorMsg);
      }
    });
  };
  scope.RowDel = function(index) {
    var fn = function(d) {
      if (d.isSuccess) {
        alert("刪除成功");
        scope.getDataList();
      } else {
        alert(d.ErrorMsg);
      }
    };

    //=====先檢查是否有用chekbox，可多筆刪除============
    var delData = [];
    for (var i in scope.datalist) {
      var ob = scope.datalist[i];
      if (ob.chk) {
        delData.push(ob[scope.PrimKey]);
      }
    }

    if (delData.length > 0) {
      if (!confirm("確定要刪除已選取共" + delData.length + "筆資料嗎?"))
        return false;
      db.DeleteRows(scope.editTableName, scope.PrimKey, delData, fn);
      return;
    }
    if (index < 0) {
      alert("請選擇資料");
      return;
    }

    if (!confirm("確定要刪除此筆資料嗎?")) return false;

    db.DeleteData(
      scope.editTableName,
      scope.PrimKey,
      scope.datalist[index][scope.PrimKey],
      fn
    );
  };
  scope.RowEdit = function(index) {
    if (index < 0) {
      alert("請選擇資料");
      return;
    }
    for (let i in scope.uploadedImg) {
      scope.uploadedImg[i] = null;
    }
    //scope.editdata = new Object; 這樣會產生新的綁定物件
    // JSON.parse(JSON.stringify(scope.datalist[index]));  //覆置一份

    scope.Columns.forEach(function(item, i) {
      //覆置一份
      if (item.ControlType == "SelectCheckBoxs") {
        //轉換成陣列
        scope.editdata[item.datafield] = JSON.parse(
          scope.datalist[index][item.datafield]
        );
      } else {
        scope.editdata[item.datafield] = scope.datalist[index][item.datafield];
      } //日期格式需額外處理
      if (
        item.ControlType != null &&
        item.ControlType.toLowerCase().indexOf("date") >= 0
      ) {
        scope.editdata[item.datafield] = new Date(
          scope.datalist[index][item.datafield]
        );
      }
    });

    scope.Modify_init(false);
  };

  scope.ClearQuery = function() {
    // scope.querydata = new Object;這樣會產生新的綁定物件
    for (let key in scope.querydata) {
      scope.querydata[key] = "";
    }
  };
  scope.Position = function(Wkt) {
    if (window.parent.map != null)
      window.parent.map.CustDrawLayer.DrawGeoFromWKT(Wkt);
  };
  scope.ShowSearchBox = function() {
    scope.GridShow = false;

    scope.SearchShow = true;
    scope.InputShow = false;
    scope.$apply();
  };
  scope.AddNewData = function() {
    //scope.editdata = new Object;這樣會產生新的綁定物件
    for (let i in scope.uploadedImg) {
      scope.uploadedImg[i] = null;
    }
    for (let key in scope.editdata) {
      scope.editdata[key] = "";
    }
    //如果有預設值，強制填入
    if (scope.defValue != null) {
      for (var key in scope.defValue) {
        scope.editdata[key] = scope.defValue[key];
      }
    }
    //如果有預設值，手動填入

    scope.Modify_init(true);
  };
  scope.CancelEdit = function() {
    scope.SearchShow = false;
    scope.InputShow = false;
    scope.GridShow = true;
    if (scope.isPopupInput) {
      $("#" + scope.popupModal).modal("hide");
    }
    this.CheckWIndowSize();
    openLeftMenu(false);
    for (let i in scope.uploadedImg) {
      scope.uploadedImg[i] = null;
    }
    for (let key in scope.editdata) {
      scope.editdata[key] = "";
    }
    scope.$apply();
  };
  scope.Modify_init = function(isAdd) {
    scope.InputShow = true;
    openLeftMenu(true);
    if (scope.isPopupInput == false) {
      scope.GridShow = false;
    }

    $("input[type=file]").val(null); //清除所有檔案
    //===============================
    if (scope.isPopupInput) {
      $("#" + scope.popupModal).modal("show");
    }

    //=====可在這設定不可編輯的欄位===
    if (isAdd) {
      //代表要新增, 新增時，所有欄位應該都可以編輯
      $('input[name ="editdata_Username"]').removeAttr("disabled");
    } else {
      //修改時，可以指定欄位不能編輯
      $('input[name ="editdata_Username"]').attr("disabled", "disabled");
      scope.$apply();
    }
    //===========副表===========
    var t = new Date();
    var tikey = t.getHours() + t.getSeconds() + t.getMilliseconds();
    scope.RelationInfo.forEach(function(rel, i) {
      var scp = VueScopes["rel_" + rel.RelationTable + (i == 0 ? "" : "_" + i)];
      scp.queryButtonShow = false;
      if (rel.defValue != undefined) {
        scp.defValue = JSON.parse(rel.defValue);
      } else {
        scp.defValue = new Object(); //這樣會產生新的綁定物件
        //for (let key in scp.defValue) {
        //     scp.defValue[key]="";
        //}
      }

      if (isAdd) {
        scp.defValue[rel.RelationKey] = "-" + tikey;
      } else {
        scp.defValue[rel.RelationKey] = scope.editdata[scope.PrimKey];
      }
      if (scope.isPopupInput) {
        $("#" + scope.popupModal).on("shown.bs.modal", function(e) {
          $("#" + scope.popupModal).unbind("shown.bs.modal");

          scp.getDataList();
        });
      } else {
        scp.getDataList();
      }
    });

    scope.$apply();
  };
  //===========增加==================
  scope.fileChanged = function(dom) {
    var ele = dom.target;
    var scp = VueScopes[$(ele).attr("scpid")];
    scp.files = ele.files; //與anglurjs不同
    var file = ele.files[0];
    scp.editdata[ele.name] = file.name;

    scp.$apply();
    if (file != undefined) {
      if (file.size > 200000000) {
        alert("檔案大小:限200MB");
        file.value = "";
        return false;
      } else {
        var attr = file.name.replace("editdata_", "");

        var validExtensions = new Array();
        var extension = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        validExtensions[0] = "doc";
        validExtensions[1] = "docx";
        validExtensions[2] = "pdf";
        validExtensions[3] = "jpg";
        validExtensions[4] = "jpeg";
        validExtensions[5] = "png";
        validExtensions[6] = "mp4";
        validExtensions[7] = "avi";

        for (var i = 0; i < validExtensions.length; i++) {
          if (extension == validExtensions[i]) {
            return true;
          }
        }

        alert("檔案格式：限doc、docx、pdf、jpg、jpeg、png、mp4、avi");
        file.value = "";
        return false;
      }
    }
  };
  scope.CustFileChanged = function(dom, name, pos) {
    var ele = dom.target;
    var scp = VueScopes[$(ele).attr("scpid")];
    scp.files = ele.files; //與anglurjs不同
    var file = ele.files[0];
    //name固定
    scp.editdata[ele.name] = name;

    scp.$apply();
    if (file != undefined) {
      if (file.size > 200000000) {
        alert("檔案大小:限200MB");
        file.value = "";
        return false;
      } else {
        var validExtensions = new Array();
        var extension = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        validExtensions[0] = "doc";
        validExtensions[1] = "docx";
        validExtensions[2] = "pdf";
        validExtensions[3] = "jpg";
        validExtensions[4] = "jpeg";
        validExtensions[5] = "png";
        validExtensions[6] = "mp4";
        validExtensions[7] = "avi";
        for (var i = 0; i < validExtensions.length; i++) {
          if (extension == validExtensions[i]) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              scp.uploadedImg[pos] = reader.result;
            };
            return true;
          }
        }

        alert("檔案格式：限doc、docx、pdf、jpg、jpeg、png、mp4、avi");
        file.value = "";
        return false;
      }
    }
  };
  //================取得副表的設定====================

  db.SelectTable(
    "RelationInfo",
    "TableName='" + scope.TableName + "'",
    function(data) {
      if (data.isSuccess) {
        if (data.Result.length > 0) {
          data.Result.forEach(function(rel, i) {
            scope.RelationInfo.push(rel);
            scope.DetailShow = true;
            rel.scope = {
              TableName: rel.RelationTable,
              editTableName: rel.RelationTable,
              id: "rel_" + rel.RelationTable + (i == 0 ? "" : "_" + i),
              gridSearch: false,
              gridAutoGetList: false,
              gridPaging: false,
              gridHeight: rel.gridHeight,
              isPopupInput: true,
              PrimKey: rel.PrimKey,
              defValue: ""
            };

            //改這樣變成只有第一次有效

            scope.DetailHtml =
              '<x-gridvue :scope="RelationInfo[' +
              i +
              '].scope" style="width:100%"></x-gridvue>';
            scope.$apply(); //這邊一定要update 否則出錯
          });
        }
      }
    }
  );

  /////=================================

  //驗證
  scope.validForm = function() {
    try {
    } catch (error) {
      alert(error);
      return false;
    }

    return true;
  };
  //轉換格式
  scope.formatToDB = function() {
    if (!scope.editdata[scope.PrimKey]) {
      db.async = false;
      db.async = true;
    }
  };
}

function openLeftMenu(isUpdate) {
  if (isUpdate) {
    $("#menu").show();
    $(".body-content").css("width", "");
    $(".body-content").css("left", "var(--left-menu-width)");
  } else {
    $("#menu").hide();
    $(".body-content").css("width", "100%");
    $(".body-content").css("left", "0");
  }
}

module.exports = {
  props: ["scope"],
  data: function() {
    new VueDetail(this.scope);
    new XRaiseInput(this.scope);

    VueScopes[this.scope.id] = this;
    this.scope.$apply = function() {
      var scp = VueScopes[this.id];
      scp.$forceUpdate();
      scp.$children.forEach(function(item, i) {
        item.$forceUpdate();
      });
    };
    this.$apply = this.scope.$apply;
    var scope = this.scope;
    db.DBKey = this.scope.DBKey;

    db.GetColumn(scope.TableName, function(d) {
      scope.Columns = d.Result;
      scope.mobileHtml = getMobileDetail(scope);
      scope.LeftMenuHtml = getLeftMenuHtml(scope);
      //可在前面加入checkbox
      if (scope.gridChkbox) {
        scope.Columns.splice(0, 0, {
          text: "選取",
          editable: true,
          type: "string",
          threestatecheckbox: false,
          datafield: "chk",
          columntype: "checkbox",
          align: "center",
          width: 40
        });
      }
      scope.Columns.push({
        text: "動作",
        type: "string",
        threestatecheckbox: false,
        datafield: "Action"
      });

      //====搜尋表單與輸入表單自動產生(不需要可刪除)========================
      //=========angularJS 輸入樣版自動資料產生==================

      scope.InputShow = false;
      scope.SearchShow = false;

      scope.SearchInputs = []; //搜尋樣版
      scope.querydata = new Object();

      scope.inputs = []; //輸入樣版

      scope.RaiseInputData();

      //====使ie能支援html5 datepicker======
      if (CheckIEVersion() != -1) {
        scope.$apply();
        setJqueryUIDatapicker(scope);
      }
      db.async = true;
      if (scope.gridAutoGetList) {
        scope.getDataList();
      }
    });

    //新增的放這裡
    this.scope.nowEditImg = "";
    this.scope.uploadedImg = [];
    this.scope.OftenOption = {};
    this.scope.TableIsLoading=true;
    return this.scope;
  },
  mounted: function() {
    let self = this;
    self.scope.CheckWIndowSize();
    openLeftMenu(false);

    $("#editImageModal").on("shown.bs.modal", function(e) {
      self.$refs.painter.utilsCanvasInit();
      self.$refs.painter.utilsDrawImage(self.uploadedImg[self.nowEditImg]);
    });
  },
  created: function() {
    //新增的放這裡
    //OftenOption
  },
  methods: {
    CustDrawToMap(method, id) {
      //是否開啟地圖

      var isopenMap = window.parent.map == undefined;
      if (isopenMap == true)
        //另開啟圖台的方式
        window.open(
          "../ArcMapVue.html?DrawType=" +
            method +
            "&returnCtr=" +
            id +
            "&TableName=" +
            this.TableName,
          "圖面繪製",
          (config = "height=500,width=500")
        );
    },
    custOpenfile(column) {
      if (this.uploadedImg[column] === "" || !this.uploadedImg[column]) return;

      this.nowEditImg = column;
      $("#editImageModal").modal("show");
    },
    leaveEditImag() {
      this.$refs.painter.onClearAll();
      $("#editImageModal").modal("hide");
    },
    saveThisFile() {
      this.uploadedImg[this.nowEditImg] = this.$refs.painter.base64;
      alert(
        "警告：此功能的儲存只有儲存在前台，必須要按下方的儲存才會儲存到資料庫。"
      );
      this.$refs.painter.onClearAll();
      $("#editImageModal").modal("hide");
    }
  },
  computed: {},

  watch: {}
};
</script>
