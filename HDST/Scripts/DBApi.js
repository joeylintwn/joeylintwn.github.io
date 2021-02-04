//Version 1.1
function DBApi(APIUrl, Token, DBKey) {
    //如果要用檢視表當做顯示表格，注意所有輸入表格欄位的欄名需一致，否則輸入介面時無法對應到
    this.DBKey = DBKey;
    if (Token == undefined) {
        Token = '';
    }
    this.getToken = function (UserID, UserPWD, ip, isAD, fn) {
        AjaxQuery(APIUrl + 'getToken', {
            UserId: UserID,
            PassWord: UserPWD,
            userip: ip,
            isAD: isAD
        }, function (data) {
            //debugger;
            if (data.isSuccess) {
                Token = data.Result;
            } else {
                alert("帳號密碼錯誤，登入失敗!!");
            }
            fn(data);
        });
    }
    this.GetVaildKey = function (fn) {
        AjaxQuery(APIUrl + 'GetVaildKey', null, fn);

    }
    this.GetDBKeys = function (fn) {
        AjaxQuery(APIUrl + 'GetDBKeys', null, fn);
    }
    this.GetColumn = function (TableName, fn, DBKey) {
        if (DBKey == undefined) DBKey = this.DBKey;

        AjaxQuery(APIUrl + 'GetJQGridColumns', {
            Token: Token,
            TableName: TableName,
            DBKey: DBKey
        },
            function (data) {
                fn(data);

            });

    }
    this.GetTableList = function (fn, DBKey) {
        if (DBKey == undefined) DBKey = this.DBKey;
        AjaxQuery(APIUrl + 'GetTableList', {
            Token: Token,
            DBKey: DBKey
        },
            function (data) {
                fn(data);

            });

    }
    this.GetDataList = function (TalbeName, QueryObj, fn) {
        var qdata = {
            Token: Token,
            TableName: TalbeName,
            QueryObj: JSON.stringify(QueryObj),
            DBKey: this.DBKey
        };
        AjaxQuery(APIUrl + 'GetDataList', qdata, function (data) {
            fn(data);
        });
    }

    this.Select = function (QueryObj, fn) {
        if (QueryObj.TableName == undefined || QueryObj.TableName == null) {
            fn(null);
            return;
        }
        QueryObj.Token = Token;
        if (QueryObj.DBKey == undefined)
            QueryObj.DBKey = this.DBKey;
        var Url = APIUrl + "SelectTable";
        AjaxQuery(Url, QueryObj, fn);
    }
    this.SelectTable = function (TableName, Filter, fn) {
        if (TableName == undefined || TableName == null) {
            fn(null);
            return;
        }
        var Url = APIUrl + "SelectTable";
        AjaxQuery(Url, {
            Token: Token,
            TableName: TableName,
            Filter: Filter,
            Field: "*",
            DBKey: this.DBKey
        }, fn);
    }

    this.SelectTableField = function (TableName, Filter, Field, isDistinct, fn) {
        if (TableName == undefined || TableName == null) {
            fn(null);
            return;
        }
        var Url = APIUrl + "SelectTable";
        AjaxQuery(Url, {
            Token: Token,
            TableName: TableName,
            Filter: Filter,
            isDistinct: isDistinct,
            Field: Field,
            DBKey: this.DBKey
        }, fn);
    }
    this.GetDistinctValues = function (TableName, Filter, Field, fn) {
        var Url = APIUrl + "SelectTable";
        AjaxQuery(Url, {
            Token: Token,
            TableName: TableName,
            Filter: Filter,
            isDistinct: true,
            Field: Field,
            DBKey: this.DBKey
        }, fn);
    }

    this.RegistUser = function (editData, VaildKey, inputKey, fn) {

        var data = {
            VaildKey: VaildKey,
            inputKey: inputKey,
            Json: JSON.stringify(editData)
        };
        var saveUserUrl = APIUrl + 'RegistUser';
        AjaxQuery(saveUserUrl, data, fn);
    }
    this.UpdateTable = function (TableName, editData, PrimKey, fn) {
        if (PrimKey == undefined) PrimKey = "id";
        var data = {
            Token: Token,
            Json: JSON.stringify(editData),
            TableName: TableName,
            PrimKey: PrimKey, //決定是要編輯或新增
            DBKey: this.DBKey

        };
        var saveUserUrl = APIUrl + 'UpdateTable';
        AjaxPost(saveUserUrl, data, fn);
    }
    this.InsertTable = function (TableName, editData, fn) {
        var data = {
            Token: Token,
            Json: JSON.stringify(editData),
            TableName: TableName,
            DBKey: this.DBKey  // 新增
        };
        var saveUserUrl = APIUrl + 'UpdateTable';
        AjaxPost(saveUserUrl, data, fn);
    }
    this.DeleteRows = function (TableName, PrimKey, Values, fn) {
        if (PrimKey == undefined) PrimKey = "id";
        var url = APIUrl + 'DeleteRows';
        var data = {
            Token: Token,
            TableName: TableName,
            PrimKey: PrimKey,
            Values: Values,
            DBKey: this.DBKey
        };

        AjaxPost(url, data, fn);

    }

    this.DeleteData = function (TableName, PrimKey, Value, fn) {
        if (PrimKey == undefined) PrimKey = "id";
        var url = APIUrl + 'DeleteData';
        var data = {
            Token: Token,
            TableName: TableName,
            PrimKey: PrimKey,
            Value: Value,
            DBKey: this.DBKey
        };

        AjaxQuery(url, data, fn);

    }
    this.CustAPI = function (FuncName, ParameterJson, fn) {

        var Url = APIUrl + "CustAPI";
        AjaxQuery(Url, {
            Token: Token,
            FuncName: FuncName,
            ParameterJson: JSON.stringify(ParameterJson),
            DBKey: this.DBKey
        }, fn);
    }

    this.getPhotoListByGID = function (TableName, cameraid, fn) {
        var purl = APIUrl + "getPhotoListByGID?Token=" + Token + "&TableName=" + TableName + "&GID=" + cameraid;
        AjaxQuery(purl, {}, fn);

    }

    this.GetUserInfo = function (fn) {
        var purl = APIUrl + "GetUserInfo?Token=" + Token;
        AjaxQuery(purl, {}, fn);

    }
    this.UploadFiles = function (files, SubPath, id, retFunc) {
        var Url = APIUrl + "UploadFiles";
        var QueryData = new FormData();
        //## 將檔案append FormData
        for (var f in files) {
            QueryData.append("RequestUploadedFile[]", files[f]);
        }
        QueryData.append("SubPath", SubPath);
        QueryData.append("ID", id);

        // 傳入 resolve 與 reject，表示資料成功與失敗
        $.ajax({
            type: 'Post',
            url: Url,
            data: QueryData,
            contentType: false,         // 告诉jQuery不要去這置Content-Type
            processData: false,         // 告诉jQuery不要去處理發送的數據 
            dataType: "json",
            success: function (res) {
                if (QueryData != null) {
                    retFunc(res, QueryData);

                } else {
                    retFunc(res);

                };
            },
            error: function (e, r, h) {

                if (e.status != 520)
                    alert(' (status:' + r + ' error:' + h + ')');

            }

        });
    }

    this.GetPlanDetail = function (TableName, fn) {

        AjaxQuery('../api/land/' + 'GetPlanDetail', {
            Token: Token,
            TableName: TableName,
        },
            function (data) {
                fn(data);

            });
    }
    this.AskJoinPlan = function (PlaneID, fn) {

        AjaxQuery('../api/land/' + 'AskJoinPlan', {
            Token: Token,
            PlaneID: PlaneID,
        },
            function (data) {
                fn(data);

            });
    }
    this.CombinGID = function (gids, fn) {
        var qdata = {
            GIDs: gids
        };
        AjaxQuery(APIUrl + 'CombinGID', qdata, function (data) {
            fn(data);
        });
    }
    function AjaxPost(url, QueryData, retFunc) {

        $.ajax({
            type: 'Post',
            url: url,
            data: QueryData,
            dataType: "json",
            success: function (data) {
                if (QueryData != null) {
                    retFunc(data, QueryData);
                } else {
                    retFunc(data);
                };
            },
            error: function (e, r, h) {
                if (e.status != 520)
                    alert(' (status:' + r + ' error:' + h + ')');
            }
        });
    }
    function AjaxQuery(url, QueryData, retFunc) {
        $.ajax({
            type: 'GET',
            url: url,
            data: QueryData,
            dataType: "json",
            success: function (data) {
                if (QueryData !== null) {
                    retFunc(data, QueryData)
                } else {
                    retFunc(data)
                };
            },
            error: function (e, r, h) {
                if (e.status !== 520)
                    alert(' (status:' + r + ' error:' + h + ')');
            }
        });
    }

}
