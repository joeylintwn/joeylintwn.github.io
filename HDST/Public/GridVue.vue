<template>
    <div>
        <div class style>
            <hr class="col-md-11 float-left" style="border:.25px solid #ff6a00;" />
            <div class="clearfix"></div>
            <div>
                <!--搜尋介面-->
                <div v-show="SearchShow" style="width:89%;">
                    <!--=========搜尋介面，使用樣版設定============-->
                    <div class="form-inline">
                        <div>
                            <div class="form-group row w-100">
                                <div class="input-group col-md-3 col-12 row no-gutters mt-1">
                                    <div class="input-group-prepend col-4">
                                        <span class="text-center d-flex align-items-center w-100 justify-content-center">申請年度:</span>
                                    </div>
                                    <select class="form-control" name="querydata_UseYear" v-model="querydata.UseYear">
                                        <option value selected>-- 請選擇 --</option>
                                        <option v-for=" (value, label)   in   UseYearDropOption"
                                                :value="value">
                                            {{label}}
                                        </option>
                                    </select>
                                </div>
                                <div class="input-group col-md-3 col-12 row no-gutters mt-1">
                                    <div class="input-group-prepend col-4">
                                        <span class="text-center d-flex align-items-center w-100 justify-content-center">鄉鎮:</span>
                                    </div>
                                    <select class="form-control" name="querydata_Town" v-model="querydata.Town">
                                        <option value>-- 請選擇 --</option>
                                        <option v-for=" (value, label)   in   TownDropOption" :value="value">{{label}}</option>
                                    </select>
                                </div>
                                <div class="input-group col-md-3 col-12 row no-gutters mt-1">
                                    <div class="input-group-prepend col-4">
                                        <span class="text-center d-flex align-items-center w-100 justify-content-center">水道名稱:</span>
                                    </div>
                                    <select class="form-control"
                                            name="querydata_WaterwayName"
                                            v-model="querydata.WaterwayName">
                                        <option value>-- 請選擇 --</option>
                                        <option v-for=" (value, label)   in   WaterNameDropOption"
                                                :value="value">
                                            {{label}}
                                        </option>
                                    </select>
                                </div>
                                <div class="input-group col-md-3 col-12 row no-gutters mt-1">
                                    <div class="input-group-prepend col-4">
                                        <span class="text-center d-flex align-items-center w-100 justify-content-center">申請類別:</span>
                                    </div>
                                    <select class="form-control"
                                            name="querydata_UseClass"
                                            v-model="querydata.UseClass">
                                        <option value>-- 請選擇 --</option>
                                        <option v-for=" (value, label)   in   DropOptions.UseClass"
                                                :value="value">
                                            {{label}}
                                        </option>
                                    </select>
                                </div>
                                <div class="input-group col-md-3 col-12 row no-gutters mt-1">
                                    <div class="input-group-prepend col-4">
                                        <span class="text-center d-flex align-items-center w-100 justify-content-center">申請人:</span>
                                    </div>
                                    <input class="form-control"
                                           type="text"
                                           name="querydata_UserName"
                                           v-model="querydata.UserName" />
                                </div>
                                <div class="input-group col-md-3 col-12 row no-gutters mt-1">
                                    <div class="input-group-prepend col-4">
                                        <span class="text-center d-flex align-items-center w-100 justify-content-center">許可文號:</span>
                                    </div>
                                    <input class="form-control"
                                           type="text"
                                           name="querydata_ConsentNum"
                                           v-model="querydata.ConsentNum" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="width:100%;margin:20px 0px; text-align:right">
                        <input type="button" class="FunBtn w-auto" value="查詢結果匯出" onclick="DownloadList()" />
                        <input type="button" class="FunBtn w-auto" value="搜尋結果佈點" onclick="MapPosition()" />
                        <input type="button" class="FunBtn" value="搜尋" @click="getDataList()" />
                        <input type="button" class="FunBtn" value="清空" @click="ClearQuery()" />
                    </div>
                </div>

                <!--資料顯示介面介面-->
                <div v-show="GridShow">
                    <hr class="col-md-11 float-left" style="border:.25px solid #ff6a00;" />
                    <div class="clearfix"></div>
                    <div style="width:89%;">
                        <div id="div_grid" style="margin:5px 0px 10px 30px;">
                            <div style="height:470px" id="grid"></div>
                        </div>
                    </div>
                </div>

                <!--輸入介面-->
                <form name="myForm" @submit="SaveData">
                    <!--輸入介面平面無POPUP-->
                    <div v-if="!isPopupInput" v-show="InputShow">
                        <div>
                            <div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_UserName">
                                            <span class="text-danger">*</span>申請人
                                        </span>
                                    </div>
                                    <input class="form-control"
                                           style="height:auto;"
                                           type="text"
                                           name="editdata_UserName"
                                           v-model="editdata.UserName"
                                           required
                                           :disabled="isView" />
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_UseYear">
                                            <span class="text-danger">*</span>申請年度
                                        </span>
                                    </div>
                                    <select class="form-control col-2"
                                            style="height:auto;"
                                            name="editdata_UseYear"
                                            v-model="editdata.UseYear"
                                            required
                                            :disabled="isView">
                                        <option value>-- 請選擇 --</option>
                                        <option v-for=" (value, label)   in   UseYearDropOption"
                                                :value="value">
                                            {{label}}
                                        </option>
                                    </select>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start" id="editdata_UseDay">
                                            <span class="text-danger">*</span>申請日期
                                        </span>
                                    </div>
                                    <input name="editdata_UseDay"
                                           v-model="editdata.UseDay"
                                           class="form-control col-2"
                                           type="date"
                                           required
                                           :disabled="isView" />
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start" id="editdata_Town">
                                            <span class="text-danger">*</span>鄉鎮
                                        </span>
                                    </div>
                                    <select class="form-control col-2"
                                            style="height:auto;"
                                            name="editdata_Town"
                                            v-model="editdata.Town"
                                            required
                                            :disabled="isView">
                                        <option value>-- 請選擇 --</option>
                                        <option v-for=" (value, label)   in   TownDropOption" :value="value">{{label}}</option>
                                    </select>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_UseClass">
                                            <span class="text-danger">*</span>申請類別
                                        </span>
                                    </div>
                                    <select class="form-control col-2"
                                            style="height:auto;"
                                            name="editdata_UseClass"
                                            v-model="editdata.UseClass"
                                            required
                                            :disabled="isView">
                                        <option value>-- 請選擇 --</option>
                                        <option v-for=" (value, label)   in   DropOptions.UseClass"
                                                :value="value">
                                            {{label}}
                                        </option>
                                    </select>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_UseContent">
                                            <span class="text-danger">*</span>工程名稱
                                        </span>
                                    </div>
                                    <input class="form-control"
                                           style="height:auto;"
                                           type="text"
                                           name="editdata_UseContent"
                                           v-model="editdata.UseContent"
                                           required
                                           :disabled="isView" />
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_LocalAddr">
                                            <span class="text-danger">*</span>通訊地址
                                        </span>
                                    </div>
                                    <input class="form-control"
                                           style="height:auto;"
                                           type="text"
                                           name="editdata_LocalAddr"
                                           v-model="editdata.LocalAddr"
                                           required
                                           :disabled="isView" />
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_HouseAddr">
                                            <span class="text-danger">*</span>戶籍地址
                                        </span>
                                    </div>
                                    <input class="form-control"
                                           style="height:auto;"
                                           type="text"
                                           name="editdata_HouseAddr"
                                           v-model="editdata.HouseAddr"
                                           required
                                           :disabled="isView" />
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_PhoneNum">申請人聯絡方式</span>
                                    </div>
                                    <input class="form-control"
                                           style="height:auto;"
                                           type="text"
                                           name="editdata_PhoneNum"
                                           v-model="editdata.PhoneNum"
                                           placeholder="格式不拘，數字即可"
                                           :disabled="isView" />
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              style="white-space: pre-wrap;"
                                              id="editdata_LandTown"><span class="text-danger">*</span>申請(工程)土地位置</span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <div class="form-row">
                                            <div class="col-4">
                                                <label for="editdata_LandTown">鄉鎮:</label>
                                                <select class="form-control"
                                                        id="editdata_LandTown"
                                                        v-model="editdata.LandTown"
                                                        required
                                                        @change="loadLandSection('LandSecDropOption',editdata.LandTown);editdata.LandSec_cns='';editdata.Land_no='';"
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   TownDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-4">
                                                <label for="editdata_LandSec_cns">地段:</label>
                                                <select class="form-control"
                                                        id="editdata_LandSec_cns"
                                                        v-model="editdata.LandSec_cns"
                                                        required
                                                        @change="loadLandNo('Land_noDropOption',editdata.LandTown,editdata.LandSec_cns);editdata.Land_no='';"
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   LandSecDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-4">
                                                <label for="editdata_Land_no">地號:</label>
                                                <select class="form-control"
                                                        id="editdata_Land_no"
                                                        v-model="editdata.Land_no"
                                                        required
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   Land_noDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_WaterwayName">
                                            <span class="text-danger">*</span>水道名稱
                                        </span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <div class="form-row">
                                            <div class="col-4">
                                                <label for="editdata_WaterwayName">水道名稱:</label>
                                                <select class="form-control"
                                                        style="height:auto;"
                                                        id="editdata_WaterwayName"
                                                        v-model="editdata.WaterwayName"
                                                        required
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   WaterWayNameDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-4">
                                                <label for="editdata_RegionRiver">排水:</label>
                                                <select class="form-control"
                                                        style="height:auto;"
                                                        id="editdata_RegionRiver"
                                                        v-model="editdata.RegionRiver"
                                                        required
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   RegionRiverDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              style="white-space: pre-wrap;"
                                              id="editdata_ApplyTown"><span class="text-danger">*</span>申請人土地</span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <div class="form-row">
                                            <div class="col-4">
                                                <label for="editdata_ApplyTown">鄉鎮:</label>
                                                <select class="form-control"
                                                        id="editdata_ApplyTown"
                                                        v-model="editdata.ApplyTown"
                                                        required
                                                        @change="loadLandSection('ApplyLandSecDropOption',editdata.ApplyTown);editdata.ApplySec_cns='';editdata.ApplyLand_no='';"
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   TownDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-4">
                                                <label for="editdata_ApplySec_cns">地段:</label>
                                                <select class="form-control"
                                                        id="editdata_ApplySec_cns"
                                                        v-model="editdata.ApplySec_cns"
                                                        required
                                                        @change="loadLandNo('ApplyLand_noDropOption',editdata.ApplyTown,editdata.ApplySec_cns);editdata.ApplyLand_no='';"
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   ApplyLandSecDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-4">
                                                <label for="editdata_ApplyLand_no">地號:</label>
                                                <select class="form-control"
                                                        id="editdata_ApplyLand_no"
                                                        v-model="editdata.ApplyLand_no"
                                                        required
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   ApplyLand_noDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_WaterTown">
                                            <span class="text-danger">*</span>設置地點
                                        </span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <div class="form-row">
                                            <div class="col-4">
                                                <label for="editdata_WaterTown">鄉鎮:</label>
                                                <select class="form-control"
                                                        style="height:auto;"
                                                        id="editdata_WaterTown"
                                                        v-model="editdata.WaterTown"
                                                        @change="loadLandSection('WaterLandSecDropOption',editdata.WaterTown);editdata.WaterSec_cns='';editdata.WaterLand_no='';"
                                                        required
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   TownDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-4">
                                                <label for="editdata_WaterSec_cns">地段:</label>
                                                <select class="form-control"
                                                        style="height:auto;"
                                                        id="editdata_WaterSec_cns"
                                                        v-model="editdata.WaterSec_cns"
                                                        @change="loadLandNo('WaterLand_noDropOption',editdata.WaterTown,editdata.WaterSec_cns);editdata.WaterLand_no='';"
                                                        required
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   WaterLandSecDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-4">
                                                <label for="editdata_WaterLand_no">地號:</label>
                                                <select class="form-control"
                                                        style="height:auto;"
                                                        id="editdata_WaterLand_no"
                                                        v-model="editdata.WaterLand_no"
                                                        required
                                                        :disabled="isView">
                                                    <option value>-- 請選擇 --</option>
                                                    <option v-for=" (value, label)   in   WaterLand_noDropOption"
                                                            :value="value">
                                                        {{label}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              style="white-space: pre-wrap;"
                                              id="editdata_OriginalPrice">當年度土地公告現值</span>
                                    </div>
                                    <input class="form-control"
                                           style="height:auto;"
                                           type="number"
                                           name="editdata_OriginalPrice"
                                           v-model="editdata.OriginalPrice"
                                           :disabled="isView" onkeyup="if(event.keyCode !=37 && event.keyCode != 39)value=value.replace(/\D/g,'')" min="0" />
                                    <div style="width:150px;" class="input-group-append">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_OriginalPrice">(元/平方公尺)</span>
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_UserArea">
                                            <span class="text-danger">*</span>使用面積
                                        </span>
                                    </div>
                                    <input class="form-control"
                                           style="height:auto;"
                                           type="number"
                                           name="editdata_UserArea"
                                           v-model="editdata.UserArea"
                                           required onkeyup="if(event.keyCode !=37 && event.keyCode != 39)value=value.replace(/\D/g,'')" min="0" />
                                    <div style="width:150px;" class="input-group-append">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_OriginalPrice">
                                            (m
                                            <sup>2</sup>)
                                        </span>
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start" id="editdata_Memo">
                                            <span class="text-danger">*</span>標案位置
                                        </span>
                                    </div>
                                    <div class="form-control form-control-lg" id="Position"></div>
                                    <div class="input-group-append" v-show="!isView">
                                        <input class="btn btn-outline-info"
                                               onclick="OpenMap()"
                                               type="button"
                                               value="點選點位"
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group-append" v-show="isView">
                                        <input class="btn btn-outline-info"
                                               onclick="MapPosition(VueScopes[scope.id].dataIndex)"
                                               type="button"
                                               value="定位" />
                                    </div>
                                </div>
                                <h4 class="text-center">上傳文件</h4>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_CadastralData">地籍資料</span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <a target="_blank"
                                           :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.CadastralData">
                                            <span name="editdata_CadastralData" v-text="editdata.CadastralData" />
                                        </a>
                                        <input style="display:none"
                                               name="CadastralData"
                                               scpid="majorTable"
                                               id="majorTable_CadastralData"
                                               class="form-control file-upload"
                                               type="file"
                                               accept=".doc,.docx,.pdf,.png,.jpeg,.jpg"
                                               @change="fileChanged" />
                                    </div>
                                    <div class="input-group-append">
                                        <input class="btn btn-success font-weight-bold"
                                               style="font-size:24px"
                                               onclick="openfile('majorTable_CadastralData')"
                                               type="button"
                                               value="+"
                                               :disabled="isView" />
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_PlaneLocation">平面位置圖</span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <a target="_blank"
                                           :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.PlaneLocation">
                                            <span name="editdata_PlaneLocation" v-text="editdata.PlaneLocation" />
                                        </a>
                                        <input style="display:none"
                                               name="PlaneLocation"
                                               scpid="majorTable"
                                               id="majorTable_PlaneLocation"
                                               class="form-control file-upload"
                                               type="file"
                                               accept=".doc,.docx,.pdf,.png,.jpeg,.jpg"
                                               @change="fileChanged" />
                                    </div>
                                    <div class="input-group-append">
                                        <input class="btn btn-success font-weight-bold"
                                               style="font-size:24px"
                                               onclick="openfile('majorTable_PlaneLocation')"
                                               type="button"
                                               value="+"
                                               :disabled="isView" />
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_DesignDiagram">設計圖</span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <a target="_blank"
                                           :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.DesignDiagram">
                                            <span name="editdata_DesignDiagram" v-text="editdata.DesignDiagram" />
                                        </a>
                                        <input style="display:none"
                                               name="DesignDiagram"
                                               scpid="majorTable"
                                               id="majorTable_DesignDiagram"
                                               class="form-control file-upload"
                                               type="file"
                                               accept=".doc,.docx,.pdf,.png,.jpeg,.jpg"
                                               @change="fileChanged" />
                                    </div>
                                    <div class="input-group-append">
                                        <input class="btn btn-success font-weight-bold"
                                               style="font-size:24px"
                                               onclick="openfile('majorTable_DesignDiagram')"
                                               type="button"
                                               value="+"
                                               :disabled="isView" />
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_Affidavit">切結書</span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <a target="_blank"
                                           :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.Affidavit">
                                            <span name="editdata_Affidavit" v-text="editdata.Affidavit" />
                                        </a>
                                        <input style="display:none"
                                               name="Affidavit"
                                               scpid="majorTable"
                                               id="majorTable_Affidavit"
                                               class="form-control file-upload"
                                               type="file"
                                               accept=".doc,.docx,.pdf,.png,.jpeg,.jpg"
                                               @change="fileChanged" />
                                    </div>
                                    <div class="input-group-append">
                                        <input class="btn btn-success font-weight-bold"
                                               style="font-size:24px"
                                               onclick="openfile('majorTable_Affidavit')"
                                               type="button"
                                               value="+"
                                               :disabled="isView" />
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_Consent">同意書</span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <a target="_blank"
                                           :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.Consent">
                                            <span name="editdata_Consent" v-text="editdata.Consent" />
                                        </a>
                                        <input style="display:none"
                                               name="Consent"
                                               scpid="majorTable"
                                               id="majorTable_Consent"
                                               class="form-control file-upload"
                                               type="file"
                                               accept=".doc,.docx,.pdf,.png,.jpeg,.jpg"
                                               @change="fileChanged" />
                                    </div>
                                    <div class="input-group-append">
                                        <input class="btn btn-success font-weight-bold"
                                               style="font-size:24px"
                                               onclick="openfile('majorTable_Consent')"
                                               type="button"
                                               value="+"
                                               :disabled="isView" />
                                    </div>
                                </div>
                                <div class="input-group form-group row">
                                    <div style="width:150px;" class="input-group-prepend">
                                        <span class="input-group-text w-100 justify-content-start"
                                              id="editdata_CurrentPhotos">現況照片</span>
                                    </div>
                                    <div class="form-control" style="height:auto;">
                                        <div v-if="editdata.CurrentPhotos">
                                            <template v-for="item in  editdata.CurrentPhotos.split('/')">
                                                <a target="_blank"
                                                   class="mr-2"
                                                   :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + item">
                                                    <span name="editdata_CurrentPhotos" v-text="item" />
                                                </a>
                                            </template>
                                        </div>

                                        <input style="display:none"
                                               name="CurrentPhotos"
                                               scpid="majorTable"
                                               id="majorTable_CurrentPhotos"
                                               class="form-control file-upload"
                                               type="file"
                                               @change="CustFileChanged"
                                               accept=".jpg,.jpeg,.png"
                                               multiple />
                                    </div>
                                    <div class="input-group-append">
                                        <input class="btn btn-success font-weight-bold"
                                               style="font-size:24px"
                                               onclick="openfile('majorTable_CurrentPhotos')"
                                               type="button"
                                               value="+"
                                               :disabled="isView" />
                                    </div>
                                </div>
                                <template v-if="isView||!isPublic">
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_CheckPrice">
                                                <span class="text-danger">*</span>審查費
                                            </span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="number"
                                               name="editdata_CheckPrice"
                                               v-model="editdata.CheckPrice"
                                               required
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_UsePrice">
                                                <span class="text-danger">*</span>使用費
                                            </span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="number"
                                               name="editdata_UsePrice"
                                               v-model="editdata.UsePrice"
                                               required
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_SecurityPrice">
                                                <span class="text-danger">*</span>保證金
                                            </span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="number"
                                               name="editdata_SecurityPrice"
                                               v-model="editdata.SecurityPrice"
                                               required
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_DeadlineS">
                                                <span class="text-danger">*</span>使用期限
                                            </span>
                                        </div>
                                        <input name="editdata_DeadlineS"
                                               v-model="editdata.DeadlineS"
                                               class="form-control col-8"
                                               type="date"
                                               required
                                               :disabled="isView" />
                                        <div class="input-group-append">
                                            <span class="input-group-text w-100 justify-content-start">~</span>
                                        </div>
                                        <input name="editdata_DeadlineE"
                                               v-model="editdata.DeadlineE"
                                               class="form-control col-8"
                                               type="date"
                                               required
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_Completion">完工狀態</span>
                                        </div>
                                        <select class="form-control"
                                                name="editdata_Completion"
                                                v-model="editdata.Completion"
                                                :disabled="isView">
                                            <option value>-- 請選擇 --</option>
                                            <option v-for=" (value, label)   in   DropOptions.Completion"
                                                    :value="value">
                                                {{label}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_ConsentYear">許可年度</span>
                                        </div>
                                        <select class="form-control"
                                                name="editdata_ConsentYear"
                                                v-model="editdata.ConsentYear"
                                                :disabled="isView">
                                            <option value selected>-- 請選擇 --</option>
                                            <option v-for=" (value, label)   in   UseYearDropOption"
                                                    :value="value">
                                                {{label}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_ConsentDay">許可日期</span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="date"
                                               name="editdata_ConsentDay"
                                               v-model="editdata.ConsentDay"
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_ConsentNum">許可文號</span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="text"
                                               name="editdata_ConsentNum"
                                               v-model="editdata.ConsentNum"
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_AgreeNum">水利會同意文號</span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="text"
                                               name="editdata_AgreeNum"
                                               v-model="editdata.AgreeNum"
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_ContrUser">
                                                <span class="text-danger">*</span>承辦人
                                            </span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="text"
                                               name="editdata_ContrUser"
                                               v-model="editdata.ContrUser"
                                               required
                                               :disabled="isView" />
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_Memo">案件備註</span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="text"
                                               name="editdata_Memo"
                                               v-model="editdata.Memo"
                                               :disabled="isView" />
                                    </div>
                                    <h4 class="text-center">上傳文件</h4>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_SignDocument">簽辦函文</span>
                                        </div>
                                        <div class="form-control" style="height:auto;">
                                            <a target="_blank"
                                               :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.SignDocument">
                                                <span name="editdata_SignDocument" v-text="editdata.SignDocument" />
                                            </a>
                                            <input style="display:none"
                                                   name="SignDocument"
                                                   scpid="majorTable"
                                                   id="majorTable_SignDocument"
                                                   class="form-control file-upload"
                                                   type="file"
                                                   @change="fileChanged" />
                                        </div>
                                        <div class="input-group-append">
                                            <input class="btn btn-success font-weight-bold"
                                                   style="font-size:24px"
                                                   onclick="openfile('majorTable_SignDocument')"
                                                   type="button"
                                                   value="+"
                                                   :disabled="isView" />
                                        </div>
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_CheckDocument">核准函文</span>
                                        </div>
                                        <div class="form-control" style="height:auto;">
                                            <a target="_blank"
                                               :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.CheckDocument">
                                                <span name="editdata_CheckDocument" v-text="editdata.CheckDocument" />
                                            </a>
                                            <input style="display:none"
                                                   name="CheckDocument"
                                                   scpid="majorTable"
                                                   id="majorTable_CheckDocument"
                                                   class="form-control file-upload"
                                                   type="file"
                                                     accept=".pdf"
                                                   @change="fileChanged" />

                                        </div>
                                        <div class="input-group-append">
                                            <input class="btn btn-success font-weight-bold"
                                                   style="font-size:24px"
                                                   onclick="openfile('majorTable_CheckDocument')"
                                                   type="button"
                                                   value="+"
                                                   :disabled="isView" />
                                        </div>
                                    </div>
                                    <!-- <div class="input-group form-group row">
                                                        <div style="width:150px;" class="input-group-prepend">
                                                          <span
                                                            class="input-group-text w-100 justify-content-start"
                                                            id="editdata_FilePath"
                                                          >申請文件路徑</span>
                                                        </div>
                                                        <div class="form-control" style="height:auto;">
                                                          <a
                                                            target="_blank"
                                                            :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.FilePath"
                                                          >
                                                            <span name="editdata_FilePath" v-text="editdata.FilePath" />
                                                          </a>
                                                          <input
                                                            style="display:none"
                                                            name="FilePath"
                                                            scpid="majorTable"
                                                            id="majorTable_FilePath"
                                                            class="form-control file-upload"
                                                            type="file"
                                                            @change="fileChanged"
                                                          />
                                                        </div>
                                                        <div class="input-group-append">
                                                          <input
                                                            class="btn btn-success font-weight-bold"
                                                            style="font-size:24px"
                                                            onclick="openfile('majorTable_FilePath')"
                                                            type="button"
                                                            value="+"
                                                            :disabled="isView"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div class="input-group form-group row">
                                                        <div style="width:150px;" class="input-group-prepend">
                                                          <span
                                                            class="input-group-text w-100 justify-content-start"
                                                            id="editdata_LogPath"
                                                          >督導記錄路徑</span>
                                                        </div>
                                                        <div class="form-control" style="height:auto;">
                                                          <a
                                                            target="_blank"
                                                            :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.LogPath"
                                                          >
                                                            <span name="editdata_LogPath" v-text="editdata.LogPath" />
                                                          </a>
                                                          <input
                                                            style="display:none"
                                                            name="LogPath"
                                                            scpid="majorTable"
                                                            id="majorTable_LogPath"
                                                            class="form-control file-upload"
                                                            type="file"
                                                            @change="fileChanged"
                                                          />
                                                        </div>
                                                        <div class="input-group-append">
                                                          <input
                                                            class="btn btn-success font-weight-bold"
                                                            style="font-size:24px"
                                                            onclick="openfile('majorTable_LogPath')"
                                                            type="button"
                                                            value="+"
                                                            :disabled="isView"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div class="input-group form-group row">
                                                        <div style="width:150px;" class="input-group-prepend">
                                                          <span
                                                            class="input-group-text w-100 justify-content-start"
                                                            id="editdata_ImagePath"
                                                          >照片路徑</span>
                                                        </div>
                                                        <div class="form-control" style="height:auto;">
                                                          <a
                                                            target="_blank"
                                                            :href="'../api/my/DownloadFiles/wb_Project/'+editdata.id + '?FileName=' + editdata.ImagePath"
                                                          >
                                                            <span name="editdata_ImagePath" v-text="editdata.ImagePath" />
                                                          </a>
                                                          <input
                                                            style="display:none"
                                                            name="ImagePath"
                                                            scpid="majorTable"
                                                            id="majorTable_ImagePath"
                                                            class="form-control file-upload"
                                                            type="file"
                                                            @change="fileChanged"
                                                          />
                                                        </div>
                                                        <div class="input-group-append">
                                                          <input
                                                            class="btn btn-success font-weight-bold"
                                                            style="font-size:24px"
                                                            onclick="openfile('majorTable_ImagePath')"
                                                            type="button"
                                                            value="+"
                                                            :disabled="isView"
                                                          />
                                                        </div>
                                    </div>-->
                                    <div class="d-flex justify-content-center">
                                        <label>
                                            <div class="polygon nopass-box">
                                                <div class="polygon-text">
                                                    <div class="form-check">
                                                        <input type="radio"
                                                               :value="4"
                                                               v-model="editdata.CheckProgress"
                                                               :disabled="isView" />
                                                        <span style="cursor: pointer;">審核未通過</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <label>
                                            <div class="polygon front-box">
                                                <div class="polygon-text">
                                                    <input type="radio"
                                                           :value="1"
                                                           v-model="editdata.CheckProgress"
                                                           :disabled="isView" />
                                                    <span style="cursor: pointer;">待審核</span>
                                                </div>
                                            </div>
                                        </label>
                                        <label>
                                            <div class="polygon middle-box">
                                                <div class="polygon-text">
                                                    <input type="radio"
                                                           :value="2"
                                                           v-model="editdata.CheckProgress"
                                                           :disabled="isView" />
                                                    <span style="cursor: pointer;">審核中</span>
                                                </div>
                                            </div>
                                        </label>
                                        <label>
                                            <div class="polygon back-box">
                                                <div class="polygon-text">
                                                    <input type="radio"
                                                           :value="3"
                                                           v-model="editdata.CheckProgress"
                                                           :disabled="isView||(!editdata.SignDocument || !editdata.CheckDocument)" />
                                                    <span style="cursor: pointer;">核准使用</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="input-group form-group row">
                                        <div style="width:150px;" class="input-group-prepend">
                                            <span class="input-group-text w-100 justify-content-start"
                                                  id="editdata_UndertakeMemo">承辦備註</span>
                                        </div>
                                        <input class="form-control"
                                               style="height:auto;"
                                               type="text"
                                               name="editdata_UndertakeMemo"
                                               v-model="editdata.UndertakeMemo"
                                               :disabled="isView" />
                                    </div>
                                </template>
                            </div>
                        </div>
                        <!--<x-inputhtml style="width:100%;"></x-inputhtml>-->
                        <div v-show="DetailShow">
                            <x-bindhtml :template="DetailHtml"></x-bindhtml>
                            <!--<x-detailhtml style="width:100%;"></x-detailhtml>-->
                        </div>
                        <div style="width:100%;margin:20px 0px; text-align:center">
                            <input type="submit" class="btn btn-primary" value="儲存" :disabled="isView" v-show="!isView" />
                            <input type="button" class="btn btn-warning" value="清除" @click="FormClear()"  v-show="!isView" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<style>
    .polygon {
        position: relative;
        width: 200px;
        height: 200px;
    }

        .polygon::after {
            width: 200px;
            height: 200px;
            content: "";
            position: absolute;
            cursor: pointer;
        }

        .polygon .polygon-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999;
            color: white;
            width: 100%;
            text-align: center;
        }

    .front-box::after {
        background: #ed7d31;
        clip-path: polygon(100% 50%, 80% 65%, 0 65%, 0 35%, 80% 35%);
    }

    .polygon.front-box .polygon-text {
        left: 40%;
    }

    .middle-box::after {
        background: #4472c4;
        clip-path: polygon(100% 50%, 80% 65%, 0 65%, 20% 50%, 0 35%, 80% 35%);
    }

    .back-box::after {
        background: #70ad47;
        clip-path: polygon(100% 50%, 80% 65%, 0 65%, 20% 50%, 0 35%, 80% 35%);
    }

    .nopass-box {
        margin-right: 30px;
    }

        .nopass-box::after {
            background: #dc3545;
            height: 60px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 5%;
        }
</style>
<script>
///手機樣版
function getMobileDetail(scope, maincolumn) {
  var itemHtml = "";
  scope.Columns.forEach(function (c, i) {
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
  scope.SearchShow = true;
  scope.SearchHtml = "";

  scope.mobileHtml = "";
  scope.InputHtml = "";
  scope.DetailHtml = "";
  scope.querydata = {};
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
  scope.UploadFiles = function (d, fn) {
    var pid = "";
    debugger;
    if (scope.editdata[scope.PrimKey] == undefined) {
      pid = d.Result[0];
    } else {
      pid = scope.editdata[scope.PrimKey];
    }

    var files = $('input[type="file"]');
    var allFile = [];
    for (var i = 0; i < files.length; i++) {
      if (files[i].files.length > 0) {
        if (files[i].files.length > 0) {
          for (let j = 0; j < files[i].files.length; j++) {
            allFile.push(files[i].files[j]);
          }
        } else {
          let file = files[i].files[0];
          allFile.push(file);
        }
      }
    }
    if (allFile.length > 0) {
      db.UploadFiles(allFile, scope.TableName, pid, function (ret) {
        fn(ret);
      });
    } else {
      fn({ Result: "no data", isSuccess: true });
    }

    return true;
  };
  scope.AddSysLog = function (txt, fn) {

    $.ajax({
      url: "../EngMgn/WaterBuild/AddSysLog",
      data: { msg: txt },
      type: "get",
      success: fn,
    });
  };
  scope.SaveData = function (myForm) {

    myForm.preventDefault();
    if ($("#Position").html() == "") {
      alert("請選擇標案位置");
      return;
    }

    //scope.myForm.$valid
    if (true) {
      if (scope.VaildKey != null) {
        scope.editdata.VaildKey = scope.VaildKey;
      }
      //新版本不論新增或修改，一律都傳primkey; 2020/4/20
      let jsonStr = JSON.stringify({ postdata: scope.editdata });

      db.UpdateTable(
        scope.editTableName,
        scope.editdata,
        scope.PrimKey,
        function (d) {
          if (d.isSuccess == false) {
            //如果有錯誤
            if (scope.VaildKey != null) {
              db.GetVaildKey(function (data) {
                scope.VaildKey =
                  scope.VaildKey.split("|")[0] +
                  "|" +
                  decodeImage(data.Result, "imgKey");
              });
            }
            alert(d.ErrorMsg);
          } else {
            if(d.Result.length==0)
            {
                alert("error! 請透過編輯功能重新上傳檔案");
                return;
            }
            scope.UploadFiles(d, function (r) {
              if (r.isSuccess) {
                //儲存位置
                if ($("#Position").html() != "") {
                  let Position = [];

                  for (var i = 0; i < $(".btn-box").length; i++) {
                    var _model = GetFormData(
                      "Position .btn-box:eq(" + i + ")",
                      "Model"
                    );
                    //設定ID

                    _model.wbid = d.Result[0];

                    //如果為地號座標

                    if (_model.x == undefined) {
                      _model.LandPosition = JsonToSQLGeo(
                        _model.LandPosition.replace(/＂/g, '"').replace(
                          /，/g,
                          ","
                        )
                      );
                    }
                    Position.push(_model);
                  }
                  db.DeleteData(
                    "wb_Project_Position",
                    "wbid",
                    _model.wbid,
                    function (d) {
                      db.UpdateTable(
                        "wb_Project_Position",
                        Position,
                        "id",
                        function (p) {
                          debugger;
                        }
                      );
                    }
                  );
                }

                if (scope.editdata[scope.PrimKey]) {
                  scope.AddSysLog("編輯成功");
                  alert("編輯成功");
                } else {
                  //====================
                  if (scope.editdata.Old_Case) {
                    scope.AddSysLog("續案成功");
                    alert("續案成功");
                  } else {
                    scope.AddSysLog("新增成功");
                    alert("新增成功");
                  }
                }
              } else {
                alert(
                  "上傳失敗，請使用編輯功能，重新上傳。錯誤訊息:" + r.ErrorMsg
                );
              }
              scope.CancelEdit();
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
  scope.getFilterbyObj = function (qData) {
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
            filter + " and " + key + "=" +  "'" + v + "'";
        }
      }
    }
    return filter;
  };

  scope.CheckWIndowSize = function () {};
  $(window).resize(scope.CheckWIndowSize);
  scope.getDataList = function (filter) {
    scope.SearchShow = true;
    scope.GridShow = true;
    if (scope.$apply) scope.$apply();
    if (filter == undefined) filter = scope.getFilterbyObj(scope.querydata);
    if (VueScopes[scope.id].isPublic) {
      filter += " and CreatUser='"+vm.UserName+"'";
    }
    filter += " order by id desc";
    db.SelectTable(
      scope.TableName,
      filter,
      function (data) {
        if (data.isSuccess) {
          scope.datalist = data.Result;
          //====在原本的資料每一欄都增加動作按鈕(依需求客變)==============

          if (scope.datalist) {
            //動作
            for (var i = 0; i < scope.datalist.length; i++) {
              if (VueScopes[scope.id].isPublic) {
                if (
                  scope.datalist[i].CheckProgress === 1 ||
                  !scope.datalist[i].CheckProgress
                ) {
                  scope.datalist[i].Action =
                    '<button type="button" class="btn btn-default"   onclick="VueScopes[\'' +
                    scope.id +
                    "'].RowView ('" +
                    i +
                    "');\">檢視</button>" +
                    '<button type="button" class="btn btn-default"  onclick="VueScopes[\'' +
                    scope.id +
                    "'].RowEdit('" +
                    i +
                    "')\">修改</button>" +
                    '<button type="button" class="btn btn-default"  onclick="VueScopes[\'' +
                    scope.id +
                    "'].RowDel('" +
                    i +
                    "')\">刪除</button>" +
                    '<button type="button" class="btn btn-default"  onclick="MapPosition(\'' +
                    i +
                    "')\">定位</button>" +
                    '<button type="button" class="btn btn-default"  onclick="VueScopes[\'' +
                    scope.id +
                    "'].RowCheck('" +
                    i +
                    "')\">送審</button>";
                } else if (scope.datalist[i].CheckProgress === 2) {
                  scope.datalist[i].Action =
                    '<button type="button" class="btn btn-default"   onclick="VueScopes[\'' +
                    scope.id +
                    "'].RowView ('" +
                    i +
                    "');\">檢視</button>" +
                    '<button type="button" class="btn btn-default"  onclick="MapPosition(\'' +
                    i +
                    "')\">定位</button>";
                }
                else if (scope.datalist[i].CheckProgress === 3) {
                  scope.datalist[i].Action =
                    '<button type="button" class="btn btn-default"   onclick="VueScopes[\'' +
                    scope.id +
                    "'].RowView ('" +
                    i +
                    "');\">檢視</button>" +
                    '<button type="button" class="btn btn-default"  onclick="MapPosition(\'' +
                    i +
                    "')\">定位</button>";
                }
              } else {
                scope.datalist[i].Action =
                  '<button type="button" class="btn btn-default"   onclick="VueScopes[\'' +
                  scope.id +
                  "'].RowView ('" +
                  i +
                  "');\">檢視</button>" +
                  '<button type="button" class="btn btn-default"   onclick="VueScopes[\'' +
                  scope.id +
                  "'].RowContinue ('" +
                  i +
                  "');\">續案</button>" +
                  '<button type="button" class="btn btn-default"  onclick="VueScopes[\'' +
                  scope.id +
                  "'].RowEdit('" +
                  i +
                  "')\">修改</button>" +
                  '<button type="button" class="btn btn-default"  onclick="VueScopes[\'' +
                  scope.id +
                  "'].RowDel('" +
                  i +
                  "')\">刪除</button>" +
                  '<button type="button" class="btn btn-default"  onclick="MapPosition(\'' +
                  i +
                  "')\">定位</button>" +
                  '<button type="button" class="btn btn-default"  onclick="VueScopes[\'' +
                  scope.id +
                  "'].RowExport('" +
                  i +
                  "')\">匯出</button>";
              }
            }
          }
          VueScopes[scope.id].createJqXGridUI(scope.datalist, "grid");

          scope.CheckWIndowSize();
        } else {
          alert(data.ErrorMsg);
        }
      },
      -1
    );
  };
  scope.RowDel = function (index) {
    var fn = function (d) {
    debugger;
      if (d.isSuccess) {
        alert("刪除成功");
          db.DeleteRows(
      "wb_Project_Position",
      "wbid",
    d.Result[0],
     function(){
    }
    );
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

    db.DeleteRows(
      scope.editTableName,
      scope.PrimKey,
      scope.datalist[index][scope.PrimKey],
      fn
    );
  };
  scope.RowEdit = function (index) {
    if (index < 0) {
      alert("請選擇資料");
      return;
    }
    scope.isView = false;
    scope.dataIndex = index;
    scope.Columns.forEach(function (item, i) {
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
        if (scope.editdata[item.datafield]) {
          scope.editdata[item.datafield] = new Date(
            scope.datalist[index][item.datafield]
          ).toDateString();
        }
      }
    });
    scope.getPositionBtn(scope.editdata.id);
    VueScopes[scope.id].loadLandSection(
      "LandSecDropOption",
      scope.editdata.LandTown
    );
    VueScopes[scope.id].loadLandNo(
      "Land_noDropOption",
      scope.editdata.LandTown,
      scope.editdata.LandSec_cns
    );
       VueScopes[scope.id].loadLandSection(
      "ApplyLandSecDropOption",
      scope.editdata.ApplyTown
    );
       VueScopes[scope.id].loadLandNo(
      "ApplyLand_noDropOption",
      scope.editdata.ApplyTown,
      scope.editdata.ApplySec_cns
    );
    VueScopes[scope.id].loadLandSection(
      "WaterLandSecDropOption",
      scope.editdata.WaterTown
    );
    VueScopes[scope.id].loadLandNo(
      "WaterLand_noDropOption",
      scope.editdata.WaterTown,
      scope.editdata.WaterSec_cns
    );
    scope.Modify_init(false);
  };
  scope.RowContinue = function (index) {
    if (index < 0) {
      alert("請選擇資料");
      return;
    }
    scope.isView = false;
    scope.dataIndex = index;
    scope.Columns.forEach(function (item, i) {
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
        if (scope.editdata[item.datafield]) {
          scope.editdata[item.datafield] = new Date(
            scope.datalist[index][item.datafield]
          ).toDateString();
        }
      }
    });
    scope.getPositionBtn(scope.editdata.id);
     VueScopes[scope.id].loadLandSection(
      "LandSecDropOption",
      scope.editdata.LandTown
    );
    VueScopes[scope.id].loadLandNo(
      "Land_noDropOption",
      scope.editdata.LandTown,
      scope.editdata.LandSec_cns
    );
       VueScopes[scope.id].loadLandSection(
      "ApplyLandSecDropOption",
      scope.editdata.ApplyTown
    );
       VueScopes[scope.id].loadLandNo(
      "ApplyLand_noDropOption",
      scope.editdata.ApplyTown,
      scope.editdata.ApplySec_cns
    );
    VueScopes[scope.id].loadLandSection(
      "WaterLandSecDropOption",
      scope.editdata.WaterTown
    );
    VueScopes[scope.id].loadLandNo(
      "WaterLand_noDropOption",
      scope.editdata.WaterTown,
      scope.editdata.WaterSec_cns
    );
    scope.editdata.Old_Case = scope.editdata.id;
    scope.editdata.id = undefined;
    scope.Modify_init(false);
  };
  scope.RowView = function (index) {
    if (index < 0) {
      alert("請選擇資料");
      return;
    }
    scope.isView = true;
    scope.dataIndex = index;

    scope.Columns.forEach(function (item, i) {
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
        if (scope.editdata[item.datafield]) {
          scope.editdata[item.datafield] = new Date(
            scope.datalist[index][item.datafield]
          ).toDateString();
        }
      }
    });
    scope.getPositionBtn(scope.editdata.id);
    debugger;
    VueScopes[scope.id].loadLandSection(
      "LandSecDropOption",
      scope.editdata.LandTown
    );
    VueScopes[scope.id].loadLandNo(
      "Land_noDropOption",
      scope.editdata.LandTown,
      scope.editdata.LandSec_cns
    );
       VueScopes[scope.id].loadLandSection(
      "ApplyLandSecDropOption",
      scope.editdata.ApplyTown
    );
       VueScopes[scope.id].loadLandNo(
      "ApplyLand_noDropOption",
      scope.editdata.ApplyTown,
      scope.editdata.ApplySec_cns
    );
    VueScopes[scope.id].loadLandSection(
      "WaterLandSecDropOption",
      scope.editdata.WaterTown
    );
    VueScopes[scope.id].loadLandNo(
      "WaterLand_noDropOption",
      scope.editdata.WaterTown,
      scope.editdata.WaterSec_cns
    );
    scope.Modify_init(false);
  };
    scope.RowExport=function(index){
     if (index < 0) {
      alert("請選擇資料");
      return;
    }
        db.AjaxQuery(
      "../api/my/wbProjectToPDF",
      { id: scope.datalist[index].id },
      function (data) {
       if(data.isSuccess)
        {
           var ori = window.location.origin;
        window.open( ori + "/HDST/ODSTemp/" + data.Result);
        }
    else
        alert(data.ErrorMsg)
      }
    );
    }
  scope.RowCheck = function (index) {
    if (index < 0) {
      alert("請選擇資料");
      return;
    }
    if (!confirm("確認送審?")) return false;
    db.UpdateTable(
      scope.editTableName,
      { CheckProgress: 2, id: scope.datalist[index][scope.PrimKey] },
      scope.PrimKey,
      function (data) {
        if (data.isSuccess) alert("送審成功");
        else alert("送審失敗");
        scope.getDataList();
      }
    );
  };
  scope.ClearQuery = function () {
    // scope.querydata = new Object;這樣會產生新的綁定物件
    for (let key in scope.querydata) {
      scope.querydata[key] = "";
    }
    scope.$apply();
  };
  scope.Position = function (Wkt) {
    if (window.parent.map != null)
      window.parent.map.CustDrawLayer.DrawGeoFromWKT(Wkt);
  };
  scope.ShowSearchBox = function () {
    scope.GridShow = false;

    scope.SearchShow = true;
    scope.InputShow = false;
    scope.$apply();
  };
  scope.AddNewData = function () {
    scope.isView = false;
        $("#Position").html("");
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
    //1:待審核,2:審核中,3:核准使用,4:審核未通過,
    scope.editdata.CheckProgress = 1;
    scope.editdata.CreatUser = vm.UserName;
    scope.Modify_init(true);
  };
  scope.FormClear = function () {
    let CheckProgress = scope.editdata.CheckProgress;
    let UserName = scope.editdata.CreatUser;
    for (let key in scope.editdata) {
      scope.editdata[key] = "";
    }
    //如果有預設值，強制填入
    scope.editdata.CheckProgress = CheckProgress;
    //scope.editdata.CreatUser = vm.UserName;;
  };
  scope.CancelEdit = function () {
    scope.SearchShow = true;
    scope.InputShow = false;
    scope.GridShow = true;
    if (scope.isPopupInput) {
      $("#" + scope.popupModal).modal("hide");
    }
    this.CheckWIndowSize();
    VueScopes[scope.id].enterQuery();
    $("#Position").html("");
    scope.$apply();
  };
  scope.Modify_init = function (isAdd) {
    scope.InputShow = true;
    scope.SearchShow = false;
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
    scope.RelationInfo.forEach(function (rel, i) {
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
        $("#" + scope.popupModal).on("shown.bs.modal", function (e) {
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
  scope.fileChanged = function (dom) {
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
        validExtensions[6] = "xls";
        validExtensions[7] = "xlsx";

        for (var i = 0; i < validExtensions.length; i++) {
          if (extension == validExtensions[i]) {
            return true;
          }
        }

        alert("檔案格式：限doc、docx、pdf、jpg、jpeg、png、xls、xlsx");
        file.value = "";
        scp.editdata[ele.name]="";
        return false;
      }
    }
  };
  scope.CustFileChanged = function (dom) {
    var ele = dom.target;
    var scp = VueScopes[$(ele).attr("scpid")];
    scp.files = ele.files; //與anglurjs不同
    var filelist = ele.files;
    scp.editdata[ele.name] = Array.from(filelist)
      .map(function (item) {
        return item.name;
      })
      .join("/");
    scp.$apply();
    if (filelist != undefined) {
      for (let j = 0; j < filelist.length; j++) {
        debugger;
        let file = filelist[j];
        if (file.size > 200000000) {
          alert("檔案大小:限200MB");
          file.value = "";
          return false;
        } else {
          var validExtensions = new Array();
          var extension = file.name
            .substring(file.name.lastIndexOf(".") + 1)
            .toLowerCase();
          validExtensions[0] = "jpg";
          validExtensions[1] = "jpeg";
          validExtensions[2] = "png";

          if (validExtensions.indexOf(extension) === -1) {
            alert("檔案格式：限jpg、jpeg、png");
            file.value = "";
            scp.editdata[ele.name]=null;
            return false;
          }
        }
      }
      return true;
    }
  };

  scope.getPositionBtn=function(id){
    db.SelectTable("wb_Project_Position","wbid="+id,function(data){
      if(data.Result.length>0)
      {
        if(GetMapPosition&&GetPosition)
          {
            GetPosition=[];
            for(let i in data.Result)
            {
              let op=data.Result[i]
              GetPosition.push(op)
            }
            GetMapPosition();
          }
          else
          alert("地圖相關JS未載入")
      }
    })
  }
  //================取得副表的設定====================

  db.SelectTable(
    "RelationInfo",
    "TableName='" + scope.TableName + "'",
    function (data) {
      if (data.isSuccess) {
        if (data.Result.length > 0) {
          data.Result.forEach(function (rel, i) {
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
              defValue: "",
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
}

module.exports = {
  props: ["scope", "isPublic"],
  data: function () {
    let scope = JSON.parse(JSON.stringify(this.scope));
    new VueDetail(scope);
    new XRaiseInput(scope);

    VueScopes[scope.id] = this;
    scope.$apply = function () {
      var scp = VueScopes[this.id];
      scp.$forceUpdate();
      scp.$children.forEach(function (item, i) {
        item.$forceUpdate();
      });
    };
    this.$apply = scope.$apply;

    db.DBKey = scope.DBKey;
    db.async = false;
    db.GetColumn(scope.TableName, function (d) {
      scope.Columns = d.Result;
      scope.mobileHtml = getMobileDetail(scope);
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
          width: 40,
        });
      }

      scope.Columns.push({
        text: "動作",
        type: "string",
        threestatecheckbox: false,
        datafield: "Action",
        width: 380,
      });
      for (var i in scope.Columns) {
        var c = scope.Columns[i];
        switch (c.datafield) {
          case "UserName":
            c.width = 150;
            break;
          case "UseYear":
            c.width = 80;
            break;
          case "UseDay":
            c.width = 80;
            c.cellsrenderer = VueScopes[scope.id].renderdate;
            break;
          case "Town":
            c.width = 80;
            break;
          case "UseClass":
            c.width = 80;
            break;
          case "Behavior_Name":
            c.width = 150;
            break;
          case "LocalAddr":
            c.width = 250;
            break;
          case "LandTown":
            c.width = 180;
            c.text = "申請(工程)土地位置";
            c.cellsrenderer = VueScopes[scope.id].renderLand;
            break;
          case "WaterwayName":
            c.width = 80;
            break;
          case "WaterTown":
            c.width = 80;
            c.text = "設置地點";
            c.cellsrenderer = VueScopes[scope.id].renderWater;
            break;
          case "CheckProgress":
            c.width = 100;
            c.cellsrenderer = VueScopes[scope.id].renderProgress;
            break;
          case "Action":
            break;
          default:
            break;
        }
        m_datafields.push({ name: c.datafield, type: c.type });
      }

      //====搜尋表單與輸入表單自動產生(不需要可刪除)========================
      //=========angularJS 輸入樣版自動資料產生==================

      scope.InputShow = false;
      scope.SearchShow = true;

      scope.SearchInputs = []; //搜尋樣版
      scope.querydata = new Object();

      scope.inputs = []; //輸入樣版

      scope.RaiseInputData();

      //====使ie能支援html5 datepicker======
      if (CheckIEVersion() != -1) {
        scope.$apply();
        setJqueryUIDatapicker(scope);
      }
      if (scope.gridAutoGetList) {
        // scope.getDataList();
      }
    });
    db.async = true;

    //是否檢視
    scope.isView = false;
    scope.dataIndex = null;
    scope.UseYearDropOption = {};
    //申請(工程)土地位置
    scope.TownDropOption = {};
    scope.LandSecDropOption = {};
    scope.Land_noDropOption = {};
    //申請人土地
    scope.ApplyLandSecDropOption = {};
    scope.ApplyLand_noDropOption = {};
    //設置地點
    scope.WaterLandSecDropOption = {};
    scope.WaterLand_noDropOption = {};
    //水道名稱
    scope.WaterNameDropOption = {};
    scope.WaterWayNameDropOption = {};
    //排水
    scope.RegionRiverDropOption = {};
    return scope;
  },
  mounted: function () {
    if (querystring("id")) {
      this.enterQuery();
      this.getDataList("id=" + querystring("id"));
    } else {
      this.enterAdd();
    }
    let self = this;

    axios({
      method: "post",
      url:
        "../proxy.ashx?c=json&url=https://map.e-land.gov.tw/yigis/ws_dataC.ashx?CMD=GETTOWN",
      params: {},
    })
      .then((response) => {
        response.data.forEach((item) => {
          self.TownDropOption[item.TOWNNAME] = item.TOWNNAME;
        });
        VueScopes.majorTable.$forceUpdate();
      })
      .catch(function (error) {
        // 请求失败处理
        console.log(error);
      });
    axios({
      method: "post",
      url:
        "https://wragis.e-land.gov.tw/arcgis/rest/services/HDST/HDST_m/MapServer/11004/query",
      params: {
        f: "pjson",
        where: "1=1",
        outFields: "Name",
        returnGeometry: false,
        returnDistinctValues: false,
        orderByFields: "Name",
      },
    })
      .then((response) => {
        response.data.features.forEach((item) => {
          self.WaterNameDropOption[item.attributes.Name] = item.attributes.Name;
          self.WaterWayNameDropOption[item.attributes.Name] =
            item.attributes.Name;
        });
        VueScopes.majorTable.$forceUpdate();
      })
      .catch(function (error) {
        // 请求失败处理
        console.log(error);
      });
    axios({
      method: "post",
      url:
        "https://wragis.e-land.gov.tw/arcgis/rest/services/HDST/HDST_m/MapServer/3003/query",
      params: {
        f: "pjson",
        where: "1=1",
        outFields: "RIVER_NAME",
        returnGeometry: false,
        returnDistinctValues: false,
      },
    })
      .then((response) => {
        response.data.features.forEach((item) => {
          self.WaterNameDropOption[item.attributes.RIVER_NAME] =
            item.attributes.RIVER_NAME;
          self.RegionRiverDropOption[item.attributes.RIVER_NAME] =
            item.attributes.RIVER_NAME;
        });
        VueScopes.majorTable.$forceUpdate();
      })
      .catch(function (error) {
        // 请求失败处理
        console.log(error);
      });
  },
  created: function () {
    for (let i = -10; i <= 1; i++) {
      let year = new Date().getFullYear();
      year = year + i - 1911;
      this.UseYearDropOption[year] = year;
    }
  },
  methods: {
    loadLandSection: function (option, town) {
      let self = this;
      if (town != "") {
        let filter = "鄉鎮市區名='" + town + "'";
        axios({
          method: "get",
          url:
            "https://wragis.e-land.gov.tw/arcgis/rest/services/HDST/HDST_m/MapServer/2003/query",
          params: {
            f: "pjson",
            where: filter,
            outFields: "地段名稱",
            returnGeometry: false,
            returnDistinctValues: true,
          },
        })
          .then((response) => {
            self[option] = {};
            response.data.features.forEach((item) => {
              self[option][item.attributes["地段名稱"]] =
                item.attributes["地段名稱"];
            });
            self.$forceUpdate();
          })
          .catch(function (error) {
            // 请求失败处理
            console.log(error);
          });
      } else {
        self[option] = {};
        self.$forceUpdate();
      }
    },
    loadLandNo: function (option, town, sec) {
      let self = this;
      if (town != "" && sec != "") {
        let filter = "鄉鎮市區名='" + town + "' and 地段名稱='" + sec + "'";
        axios({
          method: "get",
          url:
            "https://wragis.e-land.gov.tw/arcgis/rest/services/HDST/HDST_m/MapServer/2003/query",
          params: {
            f: "pjson",
            where: filter,
            outFields: "地號",
            returnGeometry: false,
            returnDistinctValues: true,
            orderByFields: "地號 ASC",
          },
        })
          .then((response) => {
            self[option] = {};
            response.data.features.forEach((item) => {
              self[option][item.attributes["地號"]] = item.attributes["地號"];
            });
            self.$forceUpdate();
          })
          .catch(function (error) {
            // 请求失败处理
            console.log(error);
          });
      } else {
        self[option] = {};
        self.$forceUpdate();
      }
    },
    enterAdd: function () {
      this.$emit("add-btn");
    },
    enterQuery: function () {
      this.$emit("query-btn");
    },
    createJqXGridUI: function (datalist, domID) {
      let self = this;
      if (isLoadJqxGrid == false) {
        setTimeout(function () {
          self.createJqXGridUI(datalist, domID);
        }, 1000);
        return;
      }
      if (urSource == null) {
        urSource = {
          localdata: datalist,
          dataType: "array",
          datafields: m_datafields,
        };
        var dataAdapter = new $.jqx.dataAdapter(urSource);

        $("#" + domID).jqxGrid({
          width: "100%",
          showtoolbar: false,
          rendertoolbar: function (toolbar) {
            //上方工具列
          },
          columnsheight: 20,
          rowsheight: 40,
          theme: "custom",
          autoheight: true,
          enabletooltips: true,
          pageable: true,
          localization: localizationobj,
          source: dataAdapter,
          sortable: true,
          selectionmode: "singlerow",
          autoshowcolumnsmenubutton: true,
          columns: VueScopes[scope.id].Columns,
        });
        //==========設定CheckBox=============
        $("#" + domID).on("cellendedit", function (event, p) {
          var args = event.args;
          urSource.localdata[args.rowindex][args.datafield] = args.value;
          urSource.localdata[args.rowindex].isChanged = true; //有異動過的記錄，多筆修改時會用到
        });
        //==============================
      } else {
        urSource.localdata = datalist;
        $("#" + domID).jqxGrid("updatebounddata", "cells");
      }
    },
    renderdate: function (
      row,
      columnfield,
      value,
      defaulthtml,
      columnproperties
    ) {
      if (value)
        return (
          "<div class='jqx-grid-cell-middle-align' style='margin-top: 12px;'>" +
          new Date(value).toDateString() +
          "</div>"
        );
      else
        return "<div class='jqx-grid-cell-middle-align' style='margin-top: 12px;'></div>";
    },
    renderLand: function (
      row,
      columnfield,
      value,
      defaulthtml,
      columnproperties
    ) {
      let str =
        (value ? value : "") +
        (this.datalist[row]
          ? this.datalist[row].LandSec_cns
            ? this.datalist[row].LandSec_cns
            : ""
          : "") +
        (this.datalist[row]
          ? this.datalist[row].Land_no
            ? this.datalist[row].Land_no
            : ""
          : "");
      return (
        "<div class='jqx-grid-cell-middle-align' style='margin-top: 12px;'>" +
        str +
        "</div>"
      );
    },
    renderWater: function (
      row,
      columnfield,
      value,
      defaulthtml,
      columnproperties
    ) {
      let str =
        (value ? value : "") +
        (this.datalist[row]
          ? this.datalist[row].WaterSec_cns
            ? this.datalist[row].WaterSec_cns
            : ""
          : "") +
        (this.datalist[row]
          ? this.datalist[row].WaterLand_no
            ? this.datalist[row].WaterLand_no
            : ""
          : "");
      return (
        "<div class='jqx-grid-cell-middle-align' style='margin-top: 12px;'>" +
        str +
        "</div>"
      );
    },
    renderProgress: function (
      row,
      columnfield,
      value,
      defaulthtml,
      columnproperties
    ) {
      let str = "";
      switch (value) {
        case 1:
          str = "待審核";
          break;
        case 2:
          str = "審核中";
          break;
        case 3:
          str = "核准使用";
          break;
        case 4:
          str = "審核未通過";
          break;
        default:
          str = "待審核";
          break;
      }
      return (
        "<div class='jqx-grid-cell-middle-align' style='margin-top: 12px;'>" +
        str +
        "</div>"
      );
    },

  },
  watch: {},
};
</script>
