<template>
  <div>
    <!--左方滾動標題-->

    <div id="menu">
      <x-bindhtml :template="LeftMenuHtml"></x-bindhtml>
    </div>
    <div class="body-content"
         style="background-color: #FAFAFA;">
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
          <div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T06">檢查日期</span>
              </div>
              <input class='form-control'
                     type='date'
                     name='editdata_T06'
                     v-model='editdata.T06' />
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T08">天氣</span>
              </div>
              <label v-for='(value, label) in  DropOptions.T08'>
                <input type="radio"
                       name="editdata_T08"
                       v-model="editdata.T08"
                       :value="value">{{label}}
              </label>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T02">調查頻率</span>
              </div>
              <label v-for='(value, label) in  DropOptions.T02'>
                <input type="radio"
                       name="editdata_T02"
                       v-model="editdata.T02"
                       :value="value">{{label}}
              </label>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T03">渠道等級</span>
              </div>
              <label v-for='(value, label) in  DropOptions.T03'>
                <input type="radio"
                       name="editdata_T03"
                       v-model="editdata.T03"
                       :value="value">{{label}}
              </label>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T05">管理單位</span>
              </div>
              <label v-for='(value, label) in  DropOptions.T05'>
                <input type="radio"
                       name="editdata_T05"
                       v-model="editdata.T05"
                       :value="value">{{label}}
              </label>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T04">護岸型式</span>
              </div>
              <label v-for='(value, label) in  DropOptions.T04'>
                <input type="radio"
                       name="editdata_T04"
                       v-model="editdata.T04"
                       :value="value">{{label}}
              </label>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T10">鄉鎮市</span>
              </div>
              <select class='form-control'
                      name='editdata_T10'
                      v-model='editdata.T10'>
                <option value=''>-- 請選擇 --</option>
                <option v-for=' (value, label)   in   DropOptions.T10'
                        :value='value'>
                  {{label}}
                </option>
              </select>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T07">排水名稱</span>
              </div>
              <select class='form-control'
                      name='editdata_T07'
                      v-model='editdata.T07'>
                <option value=''>-- 請選擇 --</option>
                <option v-for=' (value, label)   in   DropOptions.T07'
                        :value='value'>
                  {{label}}
                </option>
              </select>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T09">排入之河川或排水</span>
              </div>
              <select class='form-control'
                      name='editdata_T09'
                      v-model='editdata.T09'>
                <option value=''>-- 請選擇 --</option>
                <option v-for=' (value, label)   in   DropOptions.T09'
                        :value='value'>
                  {{label}}
                </option>
              </select>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T15">地點說明</span>
              </div>
              <input class='form-control'
                     type='text'
                     name='editdata_T15'
                     v-model='editdata.T15' />
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T12">TM2-97</span>
              </div>
              <div class="p-0 col-8">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text w-100 justify-content-center"
                          id="editdata_T12"
                          style="min-width: 42px;">E:</span>
                  </div>
                  <div id='majorTableT12'
                       class='form-control'
                       type='text'
                       name='editdata_T12'><span v-if="editdata.T12">{{editdata.T12.split(",")[0]}}</span></div>
                </div>

                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text w-100 justify-content-center"
                          id="editdata_T12"
                          style="min-width: 42px;">N:</span>
                  </div>
                  <div id='majorTableT12'
                       class='form-control'
                       type='text'
                       name='editdata_T12'><span v-if="editdata.T12">{{editdata.T12.split(",")[1]}}</span></div>
                </div>
              </div>
            </div>

            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T13">WGS84</span>
              </div>
              <div class="p-0 col-8">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text w-100 justify-content-center"
                          id="editdata_T13"
                          style="min-width: 42px;">E:</span>
                  </div>
                  <div id='majorTableT13'
                       class='form-control'
                       type='text'
                       name='editdata_T13'><span v-if="editdata.T13">{{editdata.T13.split(",")[0]}}</span></div>
                </div>

                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text w-100 justify-content-center"
                          id="editdata_T13"
                          style="min-width: 42px;">N:</span>
                  </div>
                  <div id='majorTableT13'
                       class='form-control'
                       type='text'
                       name='editdata_T13'><span v-if="editdata.T13">{{editdata.T13.split(",")[1]}}</span></div>
                </div>
              </div>
            </div>
            <div class="input-group   form-group row ">
              <div class="col-12">
                <input type='button'
                       value='圖面繪製'
                       class='btn btn-info'
                       style="min-width:100%;"
                       @click='CustDrawToMap("Point","T12,T13")' />
              </div>

            </div>
            <!-- --客製化checkbox-- -->
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T11">檢查樁號</span>
              </div>
              <div class="col-8 p-0">
                <div>
                  <div class="input-group">
                    <input class='form-control'
                           type='text'
                           name='editdata_T11'
                           v-model="OftenOption.T11[0]"
                           @change="custOnCheckList_Change(editdata,'T11',0,$event)" />
                    <div class="input-group-append">
                      <span class="input-group-text w-100 justify-content-center"
                            style="min-width: 47px;">K+</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="input-group">
                    <input class='form-control'
                           type='text'
                           name='editdata_T11'
                           v-model="OftenOption.T11[1]"
                           @change="custOnCheckList_Change(editdata,'T11',1,$event)" />
                    <div class="input-group-append">
                      <span class="input-group-text w-100 justify-content-center"
                            style="min-width: 47px;">m</span>
                    </div>
                  </div>
                </div>
                <label>
                  <input type="checkbox"
                         name="editdata_T11"
                         v-model="OftenOption.T11[2]"
                         false-value="0"
                         true-value="1"
                         v-bind:checked="custGetCheckListValue(OftenOption.T17,2)">左岸
                </label>
                <label>
                  <input type="checkbox"
                         name="editdata_T11"
                         v-model="OftenOption.T11[3]"
                         false-value="0"
                         true-value="1"
                         v-bind:checked="custGetCheckListValue(OftenOption.T17,3)">右岸
                </label>
              </div>

            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T14">檢查範圍</span>
              </div>
              <div class="col-8 p-0">
                <div class="input-group">
                  <input class='form-control'
                         type='text'
                         name='editdata_T14'
                         v-model='editdata.T14' />
                  <div class="input-group-append">
                    <span class="input-group-text w-100 justify-content-center"
                          style="min-width: 47px;">公尺</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T22">設施旁現況</span>
              </div>
              <div style='float:left'>
                <label style='display: block;'
                       v-for='(value, label) in  DropOptions.T22'>
                  <input type="checkbox"
                         @click="onCheckList_Click(editdata,'T22',value)"
                         v-bind:checked="getCheckListValue(editdata.T22,value)" />{{label}}
                </label>
              </div>
            </div>
            <!--與日期連動-->
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T23">是否具有修護(最近)紀錄</span>
              </div>
              <label v-for='(value, label) in  DropOptions.T23'>
                <input type="radio"
                       @change="editdata.T24=''"
                       name="editdata_T23"
                       v-model="editdata.T23"
                       :value="value">{{label}}
              </label>
              <input type="date"
                     name="editdata_T24"
                     v-model="editdata.T24"
                     v-show="editdata.T23==1"
                     class="ml-2">
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T25">是否需報請專業單位進行進一步檢視</span>
              </div>
              <label v-for='(value, label) in  DropOptions.T25'>
                <input type="radio"
                       name="editdata_T25"
                       v-model="editdata.T25"
                       :value="value">{{label}}
              </label>
            </div>
            <!--增加常用選項-->
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T40">違規案件註記(駐衛警填寫區)</span>
              </div>
              <div class="col-8 p-0">
                <select style="min-width:150px;"
                        name='OftenOption_T40'
                        @change="editdata.T40=$event.target.value">
                  <option value=''>-- 請選擇 --</option>
                  <option v-for=' (value, label)   in   OftenOption.T40'
                          :value='value'>
                    {{label}}
                  </option>
                </select>
                <input class='form-control'
                       type='text'
                       name='editdata_T40'
                       v-model='editdata.T40' />
              </div>
            </div>
            <div class="input-group   form-group row ">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_FacStatus">護岸設施現況狀態</span>
              </div>
              <label v-for='(value, label) in  DropOptions.FacStatus'>
                <input type="radio"
                       name="editdata_FacStatus"
                       v-model="editdata.FacStatus"
                       :value="value">{{label}}
              </label>
            </div>
            <!--客製化checkbox-->
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=2">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T16">違規狀況(定期)</span>
              </div>
              <div style='float:left'>
                <label style='display: block;'>
                  <input type="checkbox"
                         v-model="OftenOption.T16[0]"
                         true-value="1"
                         false-value="0"
                         @click="custOnCheckList_Click(editdata,'T16',0)"
                         v-bind:checked="custGetCheckListValue(OftenOption.T16,0)" />[A]違章建築(有屋頂)
                </label>
                <label>
                  <input type="checkbox"
                         v-model="OftenOption.T16[1]"
                         true-value="1"
                         false-value="0"
                         @click="custOnCheckList_Click(editdata,'T16',1)"
                         v-bind:checked="custGetCheckListValue(OftenOption.T16,1)" />[B]瓜棚、種植(面積:長*寬)
                </label>
                <label>
                  長 <input type="number"
                         v-bind:disabled="OftenOption.T16[1]!='1'"
                         v-model="OftenOption.T16[2]"
                         @change="custOnCheckList_Change(editdata,'T16',2,$event)" />
                </label>
                <label>
                  寬 <input type="number"
                         v-bind:disabled="OftenOption.T16[1]!='1'"
                         v-model="OftenOption.T16[3]"
                         @change="custOnCheckList_Change(editdata,'T16',3,$event)" />
                </label>
                <label style='display: block;'>
                  <input type="checkbox"
                         v-model="OftenOption.T16[4]"
                         true-value="1"
                         false-value="0"
                         @click="custOnCheckList_Click(editdata,'T16',4)"
                         v-bind:checked="custGetCheckListValue(OftenOption.T16,4)" />[C]水管、電線、違建(無屋頂)
                </label>
                <label style='display: block;'>
                  <input type="checkbox"
                         v-model="OftenOption.T16[5]"
                         true-value="1"
                         false-value="0"
                         @click="custOnCheckList_Click(editdata,'T16',5)"
                         v-bind:checked="custGetCheckListValue(OftenOption.T16,5)" />[D]其他(詳後註記)
                </label>
                <div> {{OftenOption.T16}}</div>
                <div> {{editdata.T16}}</div>
              </div>
            </div>
            <!--客製化checkbox-->
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=2">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T17">環境狀況(定期)</span>
              </div>
              <div class="col-8 p-0">
                <div>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[0]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',0)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,0)" />維護情形良好
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[1]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',1)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,1)" />雜草過長（超過20公分）
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[2]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',2)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,2)" />垃圾過多
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[3]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',3)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,3)" />布袋蓮超過1/8河道寬
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[4]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',4)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,4)" />大萍超過1/8河道寬
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[5]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',5)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,5)" />樹枝
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[6]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',6)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,6)" />水草
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[7]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',7)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,7)" />水管
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[8]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',8)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,8)" />電線
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[9]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',9)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,9)" />淤積
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[10]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',10)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,10)" />雜物
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[11]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',11)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,11)" />動物
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[12]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',12)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,12)" />施工
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[13]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',13)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,13)" />高灘地，高灘地草過長已影響排水功能
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[14]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',14)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,14)" />植栽
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[15]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',15)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,15)" />無
                  </label>
                </div>
                <div style="margin-left:50px;">
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[16]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',16)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,16)" />有
                  </label>
                  (
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[17]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',17)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,17)" />正常
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[18]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',18)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,18)" />傾倒
                  </label>
                  <label>
                    <input type="number"
                           v-model="OftenOption.T17[19]"
                           v-bind:disabled="OftenOption.T17[18]!='1'"
                           @change="custOnCheckList_Change(editdata,'T17',19,$event)" />枝
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[20]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',20)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,20)" />乾枯
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[21]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',21)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,21)" />無木樁
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T17[22]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T17',22)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T17,22)" />木樁歪斜
                  </label>
                  <label>
                    <input type="number"
                           v-model="OftenOption.T17[23]"
                           v-bind:disabled="OftenOption.T17[22]!='1'"
                           @change="custOnCheckList_Change(editdata,'T17',23,$event)" />支
                  </label>
                  )
                </div>
                <div> {{OftenOption.T17}}</div>
                <div> {{editdata.T17}}</div>
              </div>
            </div>
            <!--客製化checkbox-->
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=2">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T18">結構狀況(定期)</span>
              </div>
              <div style='float:left'>
                <div>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T18[0]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T18',0)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T18,0)" />堤防破損、防汛道路損壞
                  </label>
                </div>
                <div>
                  <label>
                    <input type="radio"
                           name="editdata_T18_radio"
                           value="1"
                           v-model="OftenOption.T18[1]" />堤防
                  </label>
                  (
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T18[2]"
                           true-value="1"
                           false-value="0"
                           v-bind:disabled="OftenOption.T18[1]!='1'"
                           @click="custOnCheckList_Click(editdata,'T18',2)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T18,2)" />堤前
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T18[3]"
                           true-value="1"
                           false-value="0"
                           v-bind:disabled="OftenOption.T18[1]!='1'"
                           @click="custOnCheckList_Click(editdata,'T18',3)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T18,3)" />堤後
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T18[4]"
                           true-value="1"
                           false-value="0"
                           v-bind:disabled="OftenOption.T18[1]!='1'"
                           @click="custOnCheckList_Click(editdata,'T18',4)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T18,4)" />堤頂
                  </label>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T18[5]"
                           true-value="1"
                           false-value="0"
                           v-bind:disabled="OftenOption.T18[1]!='1'"
                           @click="custOnCheckList_Click(editdata,'T18',5)"
                           v-bind:checked="custGetCheckListValue(OftenOption.T18,5)" />堤腳
                  </label>
                  )
                </div>
                <div style="margin-left:60px;">
                  <label>
                    <input type="radio"
                           name="editdata_T18_radio"
                           value="2"
                           v-model="OftenOption.T18[1]" />崩塌
                  </label>
                  <label>
                    <input type="radio"
                           name="editdata_T18_radio"
                           value="3"
                           v-model="OftenOption.T18[1]" />裂縫
                  </label>
                  <label>
                    <input type="radio"
                           name="editdata_T18_radio"
                           value="4"
                           v-model="OftenOption.T18[1]" />掏空
                  </label>
                  <label>
                    <input type="radio"
                           name="editdata_T18_radio"
                           value="5"
                           v-model="OftenOption.T18[1]" />破洞
                  </label>
                  ，面積
                  <label>
                    <input type="number"
                           v-model="OftenOption.T18[6]"
                           v-bind:disabled="OftenOption.T18[1]!='5'"
                           @change="custOnCheckList_Change(editdata,'T18',6,$event)" />長
                  </label>
                  <label>
                    <input type="number"
                           v-model="OftenOption.T18[7]"
                           v-bind:disabled="OftenOption.T18[1]!='5'"
                           @change="custOnCheckList_Change(editdata,'T18',7,$event)" />寬
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox"
                           v-model="OftenOption.T18[8]"
                           true-value="1"
                           false-value="0"
                           @click="custOnCheckList_Click(editdata,'T18',8);"
                           v-bind:checked="custGetCheckListValue(OftenOption.T18,8)" />防汛道路
                  </label>
                  <label>
                    <input type="radio"
                           v-bind:disabled="OftenOption.T18[8]!=1"
                           name="editdata_T18_radio2"
                           value="1"
                           v-model="OftenOption.T18[9]" />崩塌
                  </label>
                </div>
                <div style="margin-left:82px">
                  <label>
                    <input type="radio"
                           v-bind:disabled="OftenOption.T18[8]!=1"
                           name="editdata_T18_radio2"
                           value="2"
                           v-model="OftenOption.T18[9]" />裂縫
                  </label>
                  ，面積
                  <label>
                    <input v-bind:disabled="OftenOption.T18[9]!='2'||OftenOption.T18[8]!=1"
                           type="number"
                           v-model="OftenOption.T18[10]"
                           @change="custOnCheckList_Change(editdata,'T18',10,$event)" />長
                  </label>
                  <label>
                    <input v-bind:disabled="OftenOption.T18[9]!='2'||OftenOption.T18[8]!=1"
                           type="number"
                           v-model="OftenOption.T18[11]"
                           @change="custOnCheckList_Change(editdata,'T18',11,$event)" />寬
                  </label>
                  <label>
                    <input v-bind:disabled="OftenOption.T18[9]!='2'||OftenOption.T18[8]!=1"
                           type="number"
                           v-model="OftenOption.T18[12]"
                           @change="custOnCheckList_Change(editdata,'T18',12,$event)" />深
                  </label>
                </div>
                <div> {{OftenOption.T18}}</div>
                <div> {{editdata.T18}}</div>
              </div>
            </div>
            <!--增加常用選項-->
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=2">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T36">重大問題敘述及因應對策建議、其他影響安全之問題：(定期)</span>
              </div>
              <div class="col-8 p-0">
                <select style="min-width:150px;"
                        name='OftenOption_T36'
                        @change="editdata.T36=$event.target.value">
                  <option value=''>-- 請選擇 --</option>
                  <option v-for=' (value, label)   in   OftenOption.T36'
                          v-bind:value='value'
                          :key='value'>
                    {{label}}
                  </option>
                </select>
                <input class='form-control'
                       type='text'
                       name='editdata_T36'
                       v-model='editdata.T36' />
              </div>
            </div>
            <!--增加常用選項-->
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=2">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T37">改善方式(定期)</span>
              </div>
              <div class="col-8 p-0">
                <select style="min-width:150px;"
                        name='OftenOption_T37'
                        @change="editdata.T37=$event.target.value">
                  <option value=''>-- 請選擇 --</option>
                  <option v-for=' (value, label)   in   OftenOption.T37'
                          v-bind:value='value'
                          :key='value'>
                    {{label}}
                  </option>
                </select>
                <input class='form-control'
                       type='text'
                       name='editdata_T37'
                       v-model='editdata.T37' />
              </div>
            </div>
            <!--客製化radio-->
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=1">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T19">事件類型(不定期)</span>
              </div>
              <div class="col-8">
                <div>
                  <label>
                    <input type="radio"
                           name="editdata_radio_T19"
                           @click="custOnRadioList_Click(editdata,'T19',0)" />地震
                    震度:
                    <input class=''
                           type='number'
                           @change="custOnCheckList_Change(editdata,'T19',0,$event)"
                           v-model="OftenOption.T19[0]" />
                  </label>
                </div>
                <div>
                  <label>
                    <input type="radio"
                           name="editdata_radio_T19"
                           @click="custOnRadioList_Click(editdata,'T19',1)" />颱風
                  </label>
                  :(
                  <label>
                    <input type="radio"
                           name="editdata_radio2_T19"
                           v-model="OftenOption.T19[1]"
                           value="1" />
                    輕度
                  </label>
                  <label>
                    <input type="radio"
                           name="editdata_radio2_T19"
                           v-model='OftenOption.T19[1]'
                           value="2" />
                    中度
                  </label>
                  <label>
                    <input type="radio"
                           name="editdata_radio2_T19"
                           v-model='OftenOption.T19[1]'
                           value="3" />
                    強烈以上
                  </label>
                  )
                </div>
                <div>
                  <label>
                    <input type="radio"
                           name="editdata_radio_T19"
                           @click="custOnRadioList_Click(editdata,'T19',2)" />豪雨
                  </label>
                </div>
                <div>{{OftenOption.T19}}</div>
                <div>{{editdata.T19}}</div>
              </div>
            </div>
            <!--增加常用選項-->
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=1">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T20">破壞現況說明(不定期)</span>
              </div>
              <div class="col-8 p-0">
                <select style="min-width:150px;"
                        name='OftenOption_T20'
                        @change="editdata.T20=$event.target.value">
                  <option value=''>-- 請選擇 --</option>
                  <option v-for=' (value, label)   in   OftenOption.T20'
                          v-bind:value='value'
                          :key='value'>
                    {{label}}
                  </option>
                </select>
                <input class='form-control'
                       type='text'
                       name='editdata_T20'
                       v-model='editdata.T20' />
              </div>
            </div>
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=1">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T21">發生日期(不定期)</span>
              </div>
              <input name='editdata_T21'
                     v-model='editdata.T21'
                     class='form-control col-8'
                     type='date' />
            </div>
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=1">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T38">破壞機制分析(不定期)</span>
              </div>
              <div class="col-8 p-0">
                <select style="min-width:150px;"
                        name='OftenOption_T38'
                        @change="editdata.T38=$event.target.value">
                  <option value=''>-- 請選擇 --</option>
                  <option v-for=' (value, label)   in   OftenOption.T38'
                          v-bind:value='value'
                          :key='value'>
                    {{label}}
                  </option>
                </select>
                <input class='form-control'
                       type='text'
                       name='editdata_T38'
                       v-model='editdata.T38' />
              </div>
            </div>
            <div class="input-group   form-group row "
                 v-show="editdata.FacStatus!=1 && editdata.T02!=1">
              <div class="input-group-prepend col-4">
                <span class="input-group-text w-100 justify-content-center"
                      id="editdata_T39">避免二次災害或災害擴大之對策、其他影響安全之問題(不定期)</span>
              </div>
              <div class="col-8 p-0">
                <select style="min-width:150px;"
                        name='OftenOption_T39'
                        @change="editdata.T39=$event.target.value">
                  <option value=''>-- 請選擇 --</option>
                  <option v-for=' (value, label)   in   OftenOption.T39'
                          v-bind:value='value'
                          :key='value'>
                    {{label}}
                  </option>
                </select>
                <input class='form-control'
                       type='text'
                       name='editdata_T39'
                       v-model='editdata.T39' />
              </div>
            </div>
            <!-- 客製化table -->
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">檢查項目</th>
                    <th scope="col"
                        style="min-width:59px">正常</th>
                    <th scope="col">計畫改善</th>
                    <th scope="col">注意改善</th>
                    <th scope="col">立即改善</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="editdata_T26">
                    <th>堤頂</th>
                    <td v-for='(value, label) in  DropOptions.T26'>
                      <input type="radio"
                             name="editdata_T26"
                             v-model="editdata.T26"
                             :value="value">{{label}}
                    </td>
                  </tr>
                  <tr id="editdata_T27">
                    <th>牆身</th>
                    <td v-for='(value, label) in  DropOptions.T27'>
                      <input type="radio"
                             name="editdata_T27"
                             v-model="editdata.T27"
                             :value="value">{{label}}
                    </td>
                  </tr>
                  <tr id="editdata_T28">
                    <th>前坡及後坡</th>
                    <td>
                      <input type="radio"
                             name="editdata_T28"
                             v-model="editdata.T28"
                             value="1" />

                    </td>
                    <td>
                      <div>
                        <input type="radio"
                               name="editdata_T28"
                               v-model="editdata.T28"
                               value="2" />邊坡有裂縫產生或其他異常現象，經檢視尚無危及防洪安全者。
                      </div>
                      <div>
                        <input type="radio"
                               name="editdata_T28"
                               v-model="editdata.T28"
                               value="2.1" />有違建，經檢視尚無危及防洪安全者。
                      </div>
                    </td>
                    <td>
                      <div>
                        <input type="radio"
                               name="editdata_T28"
                               v-model="editdata.T28"
                               value="3" />土堤邊坡有局部滑動、淘空、裂縫，經檢視評估無立即危及防洪安全，惟需持續注意其發展趨勢者。
                      </div>
                      <div>
                        <input type="radio"
                               name="editdata_T28"
                               v-model="editdata.T28"
                               value="3.1" />有違建，並未影響堤防結構安全，但對水流有影響者。
                      </div>
                    </td>
                    <td>
                      <div>
                        <input type="radio"
                               name="editdata_T28"
                               v-model="editdata.T28"
                               value="4" />邊坡滑動或土堤有滲水，有影響防洪安全之虞。
                      </div>
                      <div>
                        <input type="radio"
                               name="editdata_T28"
                               v-model="editdata.T28"
                               value="4.1" />有違建，足以影響堤防結構安全或嚴重影響水流者。
                      </div>
                    </td>
                  </tr>
                  <tr id="editdata_T29">
                    <th>基腳及其保護工</th>
                    <td v-for='(value, label) in  DropOptions.T29'>
                      <input type="radio"
                             name="editdata_T29"
                             v-model="editdata.T29"
                             :value="value">{{label}}
                    </td>
                  </tr>
                  <tr id="editdata_T30">
                    <th>高灘地</th>
                    <td v-for='(value, label) in  DropOptions.T30'>
                      <input type="radio"
                             name="editdata_T30"
                             v-model="editdata.T30"
                             :value="value">{{label}}
                    </td>
                  </tr>
                  <tr id="editdata_T31">
                    <th>水道狀況</th>
                    <td v-for='(value, label) in  DropOptions.T31'>
                      <input type="radio"
                             name="editdata_T31"
                             v-model="editdata.T31"
                             :value="value">{{label}}
                    </td>
                  </tr>
                  <tr id="editdata_T32">
                    <th>平行灌溉溝</th>
                    <td v-for='(value, label) in  DropOptions.T32'>
                      <input type="radio"
                             name="editdata_T32"
                             v-model="editdata.T32"
                             :value="value">{{label}}
                    </td>
                  </tr>
                  <tr id="editdata_T33">
                    <th>防汛搶險通路</th>
                    <td v-for='(value, label) in  DropOptions.T33'>
                      <input type="radio"
                             name="editdata_T33"
                             v-model="editdata.T33"
                             :value="value">{{label}}
                    </td>
                  </tr>
                  <tr id="editdata_T34">
                    <th>水防道路</th>
                    <td v-for='(value, label) in  DropOptions.T34'>
                      <input type="radio"
                             name="editdata_T34"
                             v-model="editdata.T34"
                             :value="value">{{label}}
                    </td>
                  </tr>
                  <tr id="editdata_T35">
                    <th>破堤施工</th>
                    <td v-for='(value, label) in  DropOptions.T35'>
                      <input type="radio"
                             name="editdata_T35"
                             v-model="editdata.T35"
                             :value="value">{{label}}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row ">
              <div class="col-6"
                   id="editdata_T42_Path">
                <input style='display:none'
                       name='T42_Path'
                       scpid='majorTable'
                       id='majorTable_T42_Path'
                       class='form-control file-upload'
                       type='file'
                       @change='CustFileChanged($event,"正面.png","T42_Base64")' />

                <!-- 圖片顯示 -->
                <div class="preview-img-header">正面</div>
                <div class="preview-img-wrap">
                  <div class="image-tool-wrap">
                    <div class="image-tool-upload"
                         onclick='openfile("majorTable_T42_Path")'><i class="fas fa-2x fa-camera"></i></div>
                    <div class="image-tool-edit"
                         v-show="editdata.T42_Path!='' && editdata.T42_Path"
                         @click='custOpenfile("T42_Base64")'><i class="fas fa-2x fa-edit"></i></div>
                  </div>
                  <div>
                    <img class="preview-img"
                         v-if="uploadedImg.T42_Base64"
                         :src="uploadedImg.T42_Base64"
                         alt="">
                    <div class="preview-img"
                         v-if="!uploadedImg.T42_Base64"
                         style="width: 200px;height: 200px;"></div>
                  </div>
                </div>
              </div>

              <div class="col-6"
                   id="editdata_T44_Path">
                <input style='display:none'
                       name='T44_Path'
                       scpid='majorTable'
                       id='majorTable_T44_Path'
                       class='form-control file-upload'
                       type='file'
                       @change='CustFileChanged($event,"細部.png","T44_Base64")' />

                <!-- 圖片顯示 -->
                <div class="preview-img-header">細部</div>
                <div class="preview-img-wrap">
                  <div class="image-tool-wrap">
                    <div class="image-tool-upload"
                         onclick='openfile("majorTable_T44_Path")'><i class="fas fa-2x fa-camera"></i></div>
                    <div class="image-tool-edit"
                         v-show="editdata.T44_Path!='' && editdata.T44_Path"
                         @click='custOpenfile("T44_Base64")'><i class="fas fa-2x fa-edit"></i></div>
                  </div>
                  <div>
                    <img class="preview-img"
                         v-if="uploadedImg.T44_Base64"
                         :src="uploadedImg.T44_Base64"
                         alt="">
                    <div class="preview-img"
                         v-if="!uploadedImg.T44_Base64"
                         style="width: 200px;height: 200px;"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row ">
              <div class="col-6"
                   id="editdata_T46_Path">
                <input style='display:none'
                       name='T46_Path'
                       scpid='majorTable'
                       id='majorTable_T46_Path'
                       class='form-control file-upload'
                       type='file'
                       @
                       @change='CustFileChanged($event,"左側.png","T46_Base64")' />

                <!-- 圖片顯示 -->
                <div class="preview-img-header">左側</div>
                <div class="preview-img-wrap">
                  <div class="image-tool-wrap">
                    <div class="image-tool-upload"
                         onclick='openfile("majorTable_T46_Path")'><i class="fas fa-2x fa-camera"></i></div>
                    <div class="image-tool-edit"
                         v-show="editdata.T46_Path!='' && editdata.T46_Path"
                         @click='custOpenfile("T46_Base64")'><i class="fas fa-2x fa-edit"></i></div>
                  </div>
                  <div>
                    <img class="preview-img"
                         v-if="uploadedImg.T46_Base64"
                         :src="uploadedImg.T46_Base64"
                         alt="">
                    <div class="preview-img"
                         v-if="!uploadedImg.T46_Base64"
                         style="width: 200px;height: 200px;"></div>
                  </div>
                </div>
              </div>

              <div class="col-6"
                   id="editdata_T48_Path">
                <input style='display:none'
                       name='T48_Path'
                       scpid='majorTable'
                       id='majorTable_T48_Path'
                       class='form-control file-upload'
                       type='file'
                       @change='CustFileChanged($event,"右側.png","T48_Base64")' />

                <!-- 圖片顯示 -->
                <div class="preview-img-header">右側</div>
                <div class="preview-img-wrap">
                  <div class="image-tool-wrap">
                    <div class="image-tool-upload"
                         onclick='openfile("majorTable_T48_Path")'><i class="fas fa-2x fa-camera"></i></div>
                    <div class="image-tool-edit"
                         v-show="editdata.T48_Path!='' && editdata.T48_Path"
                         @click='custOpenfile("T48_Base64")'><i class="fas fa-2x fa-edit"></i></div>
                  </div>
                  <div>
                    <img class="preview-img"
                         v-if="uploadedImg.T48_Base64"
                         :src="uploadedImg.T48_Base64"
                         alt="">
                    <div class="preview-img"
                         v-if="!uploadedImg.T48_Base64"
                         style="width: 200px;height: 200px;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      if (i === "T42_Base64") fileName = "正面.png";
      else if (i === "T44_Base64") fileName = "細部.png";
      else if (i === "T46_Base64") fileName = "左側.png";
      else if (i === "T48_Base64") fileName = "右側.png";
      if (scope.uploadedImg[i]) {
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
      scope.formatToDB();
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
              scope.GridShow = true;
              scope.InputShow = false;
              if (scope.isPopupInput) {
                $("#" + scope.popupModal).modal("hide");
              }
              scope.getDataList();
              scope.$apply();
            });
          }
        }
      );
    } else {
      alert("部份欄位空白");
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
    scope.OftenOption["T11"] = scope.editdata["T11"].split(",");
    scope.OftenOption["T16"] = scope.editdata["T16"].split(",");
    scope.OftenOption["T17"] = scope.editdata["T17"].split(",");
    scope.OftenOption["T18"] = scope.editdata["T18"].split(",");
    let data = scope.editdata.T06.split("/");
    data[0] = parseInt(data[0]) + 1911;
    scope.editdata.T06 = data.join("-");
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
    scope.editdata["T14"] = 100;
    scope.editdata["T11"] = "0,0,0,0";
    scope.OftenOption["T11"] = [0, 0, 0, 0];
    scope.editdata["T16"] = "0,0,0,0,0,0";
    scope.OftenOption["T16"] = [0, 0, 0, 0, 0, 0];
    scope.editdata["T17"] = "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
    scope.OftenOption["T17"] = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];

    scope.editdata["T18"] = "0,0,0,0,0,0,0,0,0,0,0,0,0";
    scope.OftenOption["T18"] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    scope.editdata["T19"] = "0,0,0";
    scope.OftenOption["T19"] = [0, 0, 0];

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
    scope.uploadedImg.T42_Base64 = null;
    scope.uploadedImg.T44_Base64 = null;
    scope.uploadedImg.T46_Base64 = null;
    scope.uploadedImg.T48_Base64 = null;
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
      // T06 檢查現況
      if (scope.editdata.T06 === "") {
        alert("必填!!!檢查日期");
        return false;
      }
      // T22 設施旁現況
      if (scope.editdata.T22 === "" || !scope.editdata.T22) {
        alert("必填!!!設施旁現況");
        return false;
      }
      //T25 是否需報請專業單位進行一步檢視
      if (scope.editdata.T25 === "" || !scope.editdata.T25) {
        alert("必填!!!是否需報請專業單位");
        return false;
      }
      //T18 結構狀況(定期)

      if (
        scope.editdata.T18.split(",")[1] === "1" &&
        scope.editdata.T18.split(",")[2] === "0" &&
        scope.editdata.T18.split(",")[3] === "0" &&
        scope.editdata.T18.split(",")[4] === "0" &&
        scope.editdata.T18.split(",")[5] === "0"
      ) {
        alert("必填!!!結構狀況(定期) 堤前 堤後 堤頂 堤腳");
        return false;
      } else if (scope.editdata.T18.split(",")[1] === "5") {
        if (
          scope.editdata.T18.split(",")[6] === "0" ||
          scope.editdata.T18.split(",")[7] === "0"
        )
          alert("必填!!!結構狀況(定期)  破洞 長 寬");
        return false;
      } else if (scope.editdata.T18.split(",")[8] === "1") {
        if (scope.editdata.T18.split(",")[8] === "0") {
          alert("必填!!!結構狀況(定期)  防汛道路 崩塌 裂縫");
          return false;
        } else if (scope.editdata.T18.split(",")[8] === "2") {
          if (
            scope.editdata.T18.split(",")[10] === "0" ||
            scope.editdata.T18.split(",")[11] === "0" ||
            scope.editdata.T18.split(",")[12] === "0"
          ) {
            alert("必填!!!結構狀況(定期)  防汛道路  裂縫 長 寬 深");
            return false;
          }
        }
      }

      //T12 T13 標示破壞點
      if (scope.editdata.T12 != "" || scope.editdata.T13 != "") {
        for (let i in scope.uploadedImg) {
          if (!scope.uploadedImg[i]) {
            alert("必填!!! 標示破壞點必上傳4張照片");
            return false;
          }
        }
      }
    } catch (error) {
      alert(error);
      return false;
    }

    return true;
  };
  //轉換格式
  scope.formatToDB = function() {
    let data = scope.editdata.T06.split("-");
    data[0] -= 1911;
    scope.editdata.T06 = data.join("/");
    if (!scope.editdata[scope.PrimKey]) {
      db.async = false;
      let lastNo;
      db.SelectTable(
        scope.TableName,
        "T01 is not null order by ID desc",
        function(d) {
          if (d.Result != null) lastNo = d.Result[0].T01;
        }
      );
      scope.editdata.T01 =
        "A-" +
        new Date().getFullYear() +
        new Date()
          .toISOString()
          .substring(0, 10)
          .split("-")[1] +
        new Date().getDate() +
        "-" +
        (parseInt(lastNo.split("-")[2]) + 1);

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
    this.$set(this.OftenOption, "T11", []);
    this.$set(this.OftenOption, "T16", []);
    this.$set(this.OftenOption, "T17", []);
    this.$set(this.OftenOption, "T19", []);
    this.$set(this.OftenOption, "T18", []);
    this.$set(this.OftenOption, "T40", { 常用1: "常用1", 常用2: "常用2" });
    this.$set(this.OftenOption, "T36", { 常用1: "常用1", 常用2: "常用2" });
    this.$set(this.OftenOption, "T37", { 常用1: "常用1", 常用2: "常用2" });
    this.$set(this.OftenOption, "T20", { 常用1: "常用1", 常用2: "常用2" });
    this.$set(this.OftenOption, "T38", { 常用1: "常用1", 常用2: "常用2" });
    this.$set(this.OftenOption, "T39", { 常用1: "常用1", 常用2: "常用2" });

    this.$set(this.uploadedImg, "T42_Base64", null);
    this.$set(this.uploadedImg, "T44_Base64", null);
    this.$set(this.uploadedImg, "T46_Base64", null);
    this.$set(this.uploadedImg, "T48_Base64", null);
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
            "&oldPosition=" +
            this.editdata.T12,
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

  watch: {
    "editdata.FacStatus": {
      handler(newValue) {
        if (newValue === 1) {
          this.editdata.T26 = 1;
          this.editdata.T27 = 1;
          this.editdata.T28 = 1;
          this.editdata.T29 = 1;
          this.editdata.T30 = 1;
          this.editdata.T31 = 1;
          this.editdata.T32 = 1;
          this.editdata.T33 = 1;
          this.editdata.T34 = 1;
          this.editdata.T35 = 1;

          this.editdata["T16"] = "0,0,0,0,0,0";
          this.OftenOption["T16"] = [0, 0, 0, 0, 0, 0];
          this.editdata["T17"] =
            "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
          this.OftenOption["T17"] = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
          this.editdata["T18"] = "0,0,0,0,0,0,0,0,0,0,0,0,0";
          this.OftenOption["T18"] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          this.editdata["T19"] = "0,0,0";
          this.OftenOption["T19"] = [0, 0, 0];
          this.editdata.T20 = null;
          this.editdata.T21 = null;
          this.editdata.T36 = null;
          this.editdata.T37 = null;
          this.editdata.T38 = null;
          this.editdata.T39 = null;
        }
      }
    },
    "editdata.T42_Path": {
      handler(newValue) {
        if (newValue && newValue != "" && this.editdata.ID)
          this.uploadedImg.T42_Base64 =
            "../api/db/DownloadFiles/" +
            this.TableName +
            "/" +
            this.editdata.ID +
            "?FileName=" +
            this.editdata.T42_Path;
      }
    },
    "editdata.T44_Path": {
      handler(newValue) {
        if (newValue && newValue != "" && this.editdata.ID)
          this.uploadedImg.T44_Base64 =
            "../api/db/DownloadFiles/" +
            this.TableName +
            "/" +
            this.editdata.ID +
            "?FileName=" +
            this.editdata.T44_Path;
      }
    },
    "editdata.T46_Path": {
      handler(newValue) {
        if (newValue && newValue != "" && this.editdata.ID)
          this.uploadedImg.T46_Base64 =
            "../api/db/DownloadFiles/" +
            this.TableName +
            "/" +
            this.editdata.ID +
            "?FileName=" +
            this.editdata.T46_Path;
      }
    },
    "editdata.T48_Path": {
      handler(newValue) {
        if (newValue && newValue != "" && this.editdata.ID)
          this.uploadedImg.T48_Base64 =
            "../api/db/DownloadFiles/" +
            this.TableName +
            "/" +
            this.editdata.ID +
            "?FileName=" +
            this.editdata.T48_Path;
      }
    },
    "OftenOption.T11": {
      handler(newValue) {
        let d = this.editdata.T11.split(",");
        d[2] = newValue[2];
        d[3] = newValue[3];
        this.editdata.T11 = d.join(",");
      }
    },
    "OftenOption.T16": {
      handler(newValue) {
        if (newValue[1] != "1") {
          let data = this.editdata.T16.split(",");
          let option = this.OftenOption.T16;
          data[2] = 0;
          data[3] = 0;
          this.editdata.T16 = data.join(",");
          option[2] = 0;
          option[3] = 0;
        }
      }
    },
    "OftenOption.T17": {
      handler(newValue) {
        if (newValue[18] != "1") {
          let data = this.editdata.T17.split(",");
          let option = this.OftenOption.T17;
          data[19] = 0;
          this.editdata.T17 = data.join(",");
          option[19] = 0;
        }
        if (newValue[22] != "1") {
          let data = this.editdata.T17.split(",");
          let option = this.OftenOption.T17;
          data[23] = 0;
          this.editdata.T17 = data.join(",");
          option[23] = 0;
        }
      }
    },
    "OftenOption.T18": {
      handler(newValue) {
        //堤防、崩塌、裂縫、掏空、破洞複選框
        let d = this.editdata.T18.split(",");
        d[1] = newValue[1];
        d[9] = newValue[9];
        this.editdata.T18 = d.join(",");
        if (newValue[1] != "1") {
          let data = this.editdata.T18.split(",");
          let option = this.OftenOption.T18;
          data[2] = 0;
          data[3] = 0;
          data[4] = 0;
          data[5] = 0;
          this.editdata.T18 = data.join(",");
          option[2] = 0;
          option[3] = 0;
          option[4] = 0;
          option[5] = 0;
        }
        if (newValue[1] != "5") {
          let data = this.editdata.T18.split(",");
          let option = this.OftenOption.T18;
          data[6] = 0;
          data[7] = 0;
          this.editdata.T18 = data.join(",");
          option[6] = 0;
          option[7] = 0;
        }
        //防汛道路
        if (newValue[8] != "1") {
          let data = this.editdata.T18.split(",");
          let option = this.OftenOption.T18;
          data[8] = 0;
          data[9] = 0;
          data[10] = 0;
          data[11] = 0;
          data[12] = 0;
          this.editdata.T18 = data.join(",");
          option[8] = 0;
          option[9] = 0;
          option[10] = 0;
          option[11] = 0;
          option[12] = 0;
        }
        if (newValue[9] != "2") {
          let data = this.editdata.T18.split(",");
          let option = this.OftenOption.T18;
          data[10] = 0;
          data[11] = 0;
          data[12] = 0;
          option[10] = 0;
          option[11] = 0;
          option[12] = 0;
          this.editdata.T18 = data.join(",");
        }
      }
    },
    "OftenOption.T19": {
      handler(newValue) {
        let d = this.editdata.T19.split(",");
        d[1] = newValue[1];
        this.editdata.T19 = d.join(",");
      }
    }
  }
};
</script>
