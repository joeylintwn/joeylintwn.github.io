/*
    startwebkit("x=N,y=N,旋轉=N,x縮放=N,y縮放=N,x軸旋轉=N,y軸旋轉=N,透明度=N,動態時間=1,目標=objectID,間隔時間=N,轉場=N");

    startwebkit(動態字串) 把setwebkit再多加上一層用中文字串字義的輸入方法,用意是方便後期其他人比較看得懂，要改寫也比較簡單
    基本用法: 用=接數值，如果接的是N，則為null ，維持原值不變
    var anistr = "x=500,y=500,旋轉=3600,x縮放=1,y縮放=1,x軸旋轉=360,y軸旋轉=360,透明度=1,動態時間=1,目標=pic1,間隔時間=1";
    x=500
    y=500
    旋轉=360 	旋轉角度360為一圈，需注意，如果己經轉到360度，再設為0，為逆向轉一圈，可以用+-值
    x縮放=1		縮放比例，1的話維持不動
    y縮放=1
    x軸旋轉=N 	同旋轉角度，只是為 3D X軸旋轉
    y軸旋轉=N
    透明度=1		透明度，0-1之間跟flash一樣，透明度最吃資源，盡量在0，1之間切換
    動態時間=2	以秒為單位，最低為0，要觸發動態事件為 0.1秒
    目標=pic1	移動的目標
    間隔時間=1 	等待多久後執行此動態(與上一個動態間的間隔)
    */

    //用來停止timeout的，放到裡面的都沒辦法做timeout動態，重新開啟把
    var stoptimeout = [];

    function startwebkit(startanistr) {

        var strar = startanistr.split(',');

        //原本想用if判斷輸入字串，但考慮到後面動態應該會越加越多，所以固定輸入的字串型態以加快處理速度
        var tx = strar[0]; tx = tx.substring(2, tx.length); if (tx == "N") { tx = null };
        var ty = strar[1]; ty = ty.substring(2, ty.length); if (ty == "N") { ty = null };
        var rt = strar[2]; rt = rt.substring(3, rt.length); if (rt == "N") { rt = null };
        var sx = strar[3]; sx = sx.substring(4, sx.length); if (sx == "N") { sx = null };
        var sy = strar[4]; sy = sy.substring(4, sy.length); if (sy == "N") { sy = null };
        var rx = strar[5]; rx = rx.substring(5, rx.length); if (rx == "N") { rx = null };
        var ry = strar[6]; ry = ry.substring(5, ry.length); if (ry == "N") { ry = null };
        var op = strar[7]; op = op.substring(4, op.length); if (op == "N") { op = null };
        var ts = strar[8]; ts = ts.substring(5, ts.length); if (ts == "N") { ts = null };
        var ds = strar[10]; ds = ds.substring(5, ds.length); if (ds == "N") { ds = null };
        var tr = strar[11]; tr = tr.substring(3, tr.length); if (tr == "N") { tr = null };
        var tz = null;

        if (strar.length > 12) {
            tz = strar[12]; tz = tz.substring(2, tz.length); if (tz == "N") { tz = null };
        }



        var targetid = strar[9]; targetid = targetid.substring(3, targetid.length); if (targetid == "N") { targetid = null };

        //$('#sp1').html(tx+"_"+ty+"_"+rt+"_"+sx+"_"+sy+"_"+rx+"_"+ry+"_"+op+"_"+targetid+"_"+ts);
        if (ds == null) {

            setwebkit(tx, ty, rt, sx, sy, rx, ry, op, targetid, ts, tr, tz);
        } else {

            setTimeout(function () {
                if (stoptimeout.indexOf(targetid) == -1) {
                    setwebkit(tx, ty, rt, sx, sy, rx, ry, op, targetid, ts, tr);
                }
            }, ds * 1000);

        }



    }


    //setwebkit(tx,ty,rt,sx,sy,rx,ry,op,targetid,ts) 設定webkit動態，絕對位置
    //drawsvg(tgid,tgimgpath,tgwidth,tgheight)  單純draw一個svg到canvas裡面
    //****Android 無法使用，style 取出來的值又不一樣，應與ios 6跟ios 7不同的方式類似，有要用到Android時需再改寫判斷
    //----------------------------------------------------------------------

    //tx ty 移動X軸Y軸，以原來top,left再加上去
    //rt 旋轉
    //sx sy 縮放x,y軸
    //op 透明度
    //targetid 元件名稱
    //ts 動態時間
    function setwebkit(tx, ty, rt, sx, sy, rx, ry, op, targetid, ts, tr, tz) {

        //取出style值
        //改成絕對位置


        var stylestr = $("#" + targetid).attr("style");

        var defx = $("#" + targetid).css("left");
        if (defx.indexOf("px") != -1) {
            //有值
            defx = defx.replace("px", "");
        } else {
            defx = 0;
        }

        var defy = $("#" + targetid).css("top");
        if (defy.indexOf("px") != -1) {
            //有值
            defy = defy.replace("px", "");
        } else {
            defy = 0;
        }

        var defrx = 0;
        var defry = 0;
        if (stylestr.indexOf("rotateX") != -1) {
            var tempss = stylestr.substr(stylestr.indexOf("rotateX(") + 8, 100);
            defrx = parseInt(stylestr.substr(stylestr.indexOf("rotateX(") + 8, tempss.indexOf('deg')));

            var tempss = stylestr.substr(stylestr.indexOf("rotateY(") + 8, 100);
            defry = parseInt(stylestr.substr(stylestr.indexOf("rotateY(") + 8, tempss.indexOf('deg')));




        }


        //如果沒有設定過translate的元件

        if (stylestr.indexOf("translateX") < 0) {
            //傳入值為null時做預設值，沒有動態
            if (tx == null) { tx = $("#" + targetid).position().left / scalerate }
            if (ty == null) { ty = $("#" + targetid).position().top / scalerate; }
            if (rt == null) { rt = 0; }
            if (sx == null) { sx = 1; }
            if (sy == null) { sy = 1; }
            if (rx == null) { rx = 0; }
            if (ry == null) { ry = 0; }
            if (op == null) { op = 1; }
            if (ts == null) { ts = 0; }
            if (tz == null) { tz = 0; }
            if (tr == null) { tr = "linear" }
            //動態設定
            if (stylestr.indexOf("transform-origin") == -1) {
                //沒有設定transform-origin的從左上角left =0 ,top =0做 tramsform中心點
                $("#" + targetid).css("-webkit-transform-origin", "0% 0%");
            }


            //$("#" + targetid).css("-webkit-transform-style", "preserve-3d");

            $("#" + targetid).css("-webkit-transition", "opacity " + ts + "s,-webkit-transform " + ts + "s " + tr);
            $("#" + targetid).css("-webkit-transform", "translateX(" + (tx - defx) + "px) translateY(" + (ty - defy) + "px) translateZ(" + (tz) + "px) rotate(" + rt + "deg) scale(" + sx + "," + sy + ") rotateX(" + rx + "deg) rotateY(" + ry + "deg) ");


            $("#" + targetid).css("opacity", "" + op + "");

        }
        else {




            //null的值不做變動
            if (tx != null) {
                stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("translateX("), stylestr.indexOf(")", stylestr.indexOf("translateX(")) + 1), "translateX(" + (tx - defx) + "px)");
            }
            if (ty != null) {
                stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("translateY("), stylestr.indexOf(")", stylestr.indexOf("translateY(")) + 1), "translateY(" + (ty - defy) + "px)");
            }
            //20161111增加可做+-值旋轉功能
            if (rt != null) {
                if (rt.indexOf('+') > -1 || rt.indexOf('-') > -1) {
                    nowrt = parseInt(stylestr.substring(stylestr.indexOf("rotate(") + 7, stylestr.indexOf("deg)", stylestr.indexOf("rotate("))));
                    if (rt.indexOf('+') > -1) {
                        rt = nowrt + parseInt(rt.replace('+', ''));
                    } else if (rt.indexOf('-') > -1) {
                        rt = nowrt - parseInt(rt.replace('-', ''));
                    }

                }

                stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("rotate("), stylestr.indexOf(")", stylestr.indexOf("rotate(")) + 1), "rotate(" + rt + "deg)");
            }
            if (sx != null && sy != null) {
                stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("scale("), stylestr.indexOf(")", stylestr.indexOf("scale(")) + 1), "scale(" + sx + "," + sy + ")");
            }
            if (rx != null) {
                stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("rotateX("), stylestr.indexOf(")", stylestr.indexOf("rotateX(")) + 1), "rotateX(" + (parseInt(rx) + parseInt(defrx)) + "deg)");
            }
            if (ry != null) {
                stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("rotateY("), stylestr.indexOf(")", stylestr.indexOf("rotateY(")) + 1), "rotateY(" + (parseInt(ry) + parseInt(defry)) + "deg)");
            }
            if (op != null) {
                stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("opacity:"), stylestr.indexOf(";", stylestr.indexOf("opacity:")) + 1), "opacity:" + op + ";");
            }




            $("#" + targetid).attr("style", stylestr);
            if (tr == null) {
                tr = "linear";
            }

            if (ts != null) {
                $("#" + targetid).css("-webkit-transition", "opacity " + ts + "s,-webkit-transform " + ts + "s " + tr);
            }

            if (tz != null) {
                stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("translateZ("), stylestr.indexOf(")", stylestr.indexOf("translateZ(")) + 1), "translateZ(" + (tz) + "px)");
            }




        }

    }



    //單純draw一個svg到canvas裡面，
    //tgid= canvas ID
    //tgimgpath = 圖檔的位置
    //tgwidth，tgheight = 畫出的大小
    //有需要帶完成執行動的的無法使用，Image需要大量重覆使用的也不要用
    function drawsvg(tgid, tgimgpath, tgwidth, tgheight) {
        var tmpimg = new Image;
        var tmptx = document.getElementById(tgid).getContext("2d");
        tmpimg.src = tgimgpath;
        tmpimg.onload = function () {
            tmptx.drawImage(tmpimg, 0, 0, tgwidth, tgheight);
        }

    }


    //----連續動態
    function startani(startaniar) {
        if (startaniar.length > 0) {
            var tstr = startaniar.shift();
            var ttime = tstr.split(',')[10]
            ttime = ttime.substring(5, ttime.length) * 1000;

            setTimeout(function () { startwebkit(tstr); startani(startaniar); }, ttime);
        }
    }

    //====連續動態

    //---動態暫停  這裡需要5個sp，記得

    function pausewebkit(tgid) {
        $("#" + tgid).css("-webkit-transition-property", "all");
        $("#" + tgid).css("-webkit-transition-duration", "100000s");
        //一定要有設定過transform的才有用
        $("#" + tgid).css("-webkit-transform", "");

    }
    //===動態暫停


    //---左右換方向
    function wbrotateY(targetid, ry) {
        var stylestr = $("#" + targetid).attr("style");
        if (stylestr.indexOf("transform") < 0) {
            //傳入值為null時做預設值，沒有動態
            //動態設定

            $("#" + targetid).css("-webkit-transition", "opacity 0s,-webkit-transform 0s");
            $("#" + targetid).css("-webkit-transform", "translateX(0px) translateY(0px) rotate(0deg) scale(1,1) rotateX(0deg) rotateY(0deg)");
            $("#" + targetid).css("opacity", "1");
            stylestr = $("#" + targetid).attr("style");

        }

        stylestr = stylestr.replace(stylestr.substring(stylestr.indexOf("rotateY("), stylestr.indexOf(")", stylestr.indexOf("rotateY(")) + 1), "rotateY(" + ry + "deg)");
        //	$("#"+targetid).attr("style",stylestr);
        $("#" + targetid).css("-webkit-transform", "rotateY(" + ry + "deg)");
        $("#" + targetid).css("-webkit-transition", "opacity 0s,-webkit-transform 0s ");
        //alert($("#"+targetid).attr("style"));

    }

    //整數亂數
    function useceil(min, max) {
        /// <summary>範圍內取1亂數</summary>
        /// <param name="min" type="int">亂數起點</param>
        /// <param name="max" type="int">亂數終點</param>
        return Math.ceil(Math.random() * (max - min + 1) + min - 1);
    }

    //亂數不重覆
    function selRandom(min, max, sel) {
        /// <summary>亂數不重覆陣列</summary>
        /// <param name="min" type="int">亂數起點</param>
        /// <param name="max" type="int">亂數終點</param>
        /// <param name="sel" type="int">取幾位數</param>
        var maxNum = max;
        var minNum = min;
        var selNum = sel - 1;
        var aArray = new Array;
        var i = 0, j = 0, k = 0;
        //alert(aArray[selNum]);
        while (aArray[selNum] == undefined) {
            var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            flag = 0;
            for (j = 0; j <= selNum; j++) {
                if (n == aArray[j]) {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                aArray[k] = n;
                k = k + 1;
            }
        }
        var sReturn = "";
        for (j = 0; j <= selNum; j++) {

            sReturn = sReturn + aArray[j] + ",";

        }
        return aArray;
    }

    //好用的jquery setfocus程式碼
    (function ($) {
        jQuery.fn.setfocus = function () {
            return this.each(function () {
                var dom = this;
                setTimeout(function () {
                    try { dom.focus(); } catch (e) { }
                }, 0);
            });
        };
    })(jQuery);

    (function ($) {
        jQuery.fn.iosfonttop = function () {
            /// <summary>ios自定義字型渲染後top下移修正</summary>
            ///20160607測試，高度偏差為1.343333倍，top偏差為font-size的0.27
            //這是專門修正font圖示用的，ios9上己經修正掉此問題，所以不用處理
            //注意，不要加line-height
            //注意，font - size一定要加，否則判斷取不到值
            //注意，不允許多字，只能用單一字元
            //ios9版終於修正這個bug，但目前ios開發還支援8.0，暫時不用
            return this.each(function () {
                //目前僅有ios有這個問題
                if (navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPhone") != -1) {
                    var dom = this;
                    //alert(dom.id + '___' + $('#' + dom.id).height() + '___' + (parseInt($('#' + dom.id).css('font-size').replace('px', '')) * 1.1) + '___' + $('#' + dom.id).innerHeight() + '___' + $('#scaletest_text').outerHeight());
                    //做高度比對，直接對高度>1.1的判斷為webkit渲染錯誤
                    if ($('#' + dom.id).height() > (parseInt($('#' + dom.id).css('font-size').replace('px', '')) * 1.1)) {
                        setTimeout(function () {
                            try { $('#' + dom.id).css('top', '-' + (parseInt($('#' + dom.id).css('font-size').replace('px', '')) * 0.27 + 'px')); } catch (e) { }
                        }, 0);
                    }

                }
            });
        };
    })(jQuery);


    //開啟小視窗，傳入目標div的ID，與fadeIn的毫秒數
    function divDisplayShow(id, sec) {
        if (sec == undefined) { sec = 0 }
        $('#' + id).fadeIn(sec);
        $('#' + id).css('z-index', '9');
    }


    function divDisplayHide(id, sec) {
        /// <summary>關閉小視窗</summary>
        /// <param name="id" type="str">傳入目標div的ID</param>
        /// <param name="sec" type="int">fadeIn的毫秒數</param>
        if (sec == undefined) { sec = 0 }
        $('#' + id).fadeOut(sec);
        $('#' + id).css('z-index', '');
    }



    var errorHandler = function (fileName, e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'Storage quota exceeded';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'File not found';
                break;
            case FileError.SECURITY_ERR:
                msg = 'Security error';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'Invalid modification';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'Invalid state';
                break;
            default:
                msg = 'Unknown error';
                break;
        };

        console.log('Error (' + fileName + '): ' + msg);
    }



    function writeToFile(fileName, data) {
        data = JSON.stringify(data, null, '\t');
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry) {
            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        console.log('Write of file "' + fileName + '"" completed.');
                    };
                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        console.log('Write failed: ' + e.toString());
                    };
                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(blob);
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }

    //cordova檢查檔案是否存在
    function checkToFile(fileName) {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry) {
            //檔案名稱，是否建立檔案，檔案存在動作，檔案不存在動作
            directoryEntry.getFile(fileName, { create: false }, function (fileEntry) {
                //alert('exist');
            }, function (fileEntry) {
                //alert('no exist');
            });
        }, errorHandler.bind(null, fileName));
    }

    function readFromFile(fileName, cb) {
        var pathToFile = cordova.file.externalDataDirectory + fileName;
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    //存入跟讀出的檔案格式轉為json
                    cb(JSON.parse(this.result));
                };
                reader.readAsText(file);
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }

    //size 720*180 top=1100
    var admobid = {}
    if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
        admobid = {
            banner: 'ca-app-pub-3940256099942544/6300978111',
            //banner: 'ca-app-pub-1542701942071586~5997451552',
            //ADMOB 的測試banner : ca-app-pub-3940256099942544/6300978111
            //interstitial: 'ca-app-pub-3940256099942544/1033173712',
            //常用5736字初級英文: ca-app-pub-1542701942071586/5141837233
            

        }
    } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios
        //admobid = {
        //    banner: 'ca-app-pub-3940256099942544/2934735716',
        //    interstitial: 'ca-app-pub-3940256099942544/4411468910',
        //}
    }

    var fileData;
    var rewardvideo_ok = false;
    function onDeviceReady() {
        index_init();
        //倒退鍵事件，一定要放在Cordova的onDeviceReady事件裡面
        document.addEventListener("backbutton", onBackKeyDown, false);

        //上架前再開下面這段，記得isTest: false
        //現在admob怪怪的，一直顯示正式的廣告，點到就挫賽了

        
        admob.banner.config({
            id: admobid.banner,
            size: 'BANNER', //320*50
            offsetTopBar: true,
            isTesting: true,
            autoShow: true,
            bannerAtTop: true,
            overlap: true
            //覆蓋在程式上層，20181202改為改上層，因為input/textarea 沒辦法preventDefault，會變會可以拖拉到超出螢幕
            //改為蓋在上層，然後上面100px 不要使用
        })


        admob.banner.prepare()
        


        //--影片廣告
        //沒有影片廣告的話可以註掉
        /*
        admob.rewardvideo.config({
            //id: '',
            isTesting: true,
            autoShow: false,
        })
        admob.rewardvideo.prepare();

        document.getElementById('showAd').disabled = true
        document.getElementById('showAd').onclick = function () {
            admob.rewardvideo.show()
        }
        */
        //==影片廣告




        //這一段是加入寫入檔案內容，因為localStorage在app關閉後不會保留，未來如果有用到需要持續保存資料時必需要寫入本地端檔案。
        /*
        writeToFile('data.json', { foo: 'bar' });
        //加入cordova.js
        setTimeout(function () {
            readFromFile('data.json', function (data) {
                fileData = data;
                alert('取出資料' + fileData.foo);
            });
        }, 3000)
        */

    }

    document.addEventListener('admob.banner.events.LOAD_FAIL', function (event) {
        console.log('admob_LOAD_FAIL' + event)
    })

    document.addEventListener('admob.banner.events.OPEN', function (event) {
        //admob重算畫面
        //alert(123);
        //打開之後隱藏廣告
        /*
        setTimeout(function () {
            admob.banner.hide();
        }, 2000)
        */
    })





    function onBackKeyDown() {

    }

//--影片廣告
    

    document.addEventListener('admob.rewardvideo.events.LOAD_FAIL', function (event) {
        rewardvideo_ok = false;
        console.log(event)
    })

    document.addEventListener('admob.rewardvideo.events.LOAD', function (event) {
        console.log(event)
        rewardvideo_ok = true;
        //document.getElementById('showAd').disabled = false
        $('#dv_showAd').show();
    })

    document.addEventListener('admob.rewardvideo.events.CLOSE', function (event) {
        console.log(event)
        rewardvideo_ok = false;
        $('#dv_showAd').hide();
        admob.rewardvideo.prepare();
    })

    document.addEventListener('admob.rewardvideo.events.REWARD', function (event) {
        setTimeout(function () {
            admob.banner.hide();
        }, 1000)
        //類型 coin / 數量 10
        //console.log(event.rewardAmount);
        //console.log(event.type);
        //console.log(event)
        //觀看影片後後隱藏banner
        /*
        setTimeout(function () {
            admob.banner.show();
        }, 20000)
        */
    })

    
    //==影片廣告



    //----判斷是否為IPAD或IPhone，更換偵聽事件為touch
    var isios = -1;
    if (navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("iPhone") != -1 || navigator.userAgent.indexOf("Android") != -1) {
        isios = 1;
    };
    var eventdown = 'mousedown';
    var eventmove = 'mousemove';
    var eventup = 'mouseup';
    var eventout = 'mouseupoutside';


    function setevent() {
        if (isios != -1) {
            eventdown = 'touchstart';
            eventmove = 'touchmove';
            eventup = 'touchend';
            eventout = 'touchendoutside';
            $.getScript("cordova.js", function () {
                document.addEventListener('deviceready', onDeviceReady, false);
            });

        }
    }
    setevent();
    //====判斷是否為IPAD，更換偵聽事件為touch
    var my_media;
    var firstplayiosaudio = 0;


    //--cordova 播放音檔
    function playAudio(url) {
        //console.log('呼叫播音檔-------------------');
        // Play the audio file at url
        if (firstplayiosaudio != 0) {
            my_media.stop();
            my_media.release();
        }
        firstplayiosaudio = 1;
        my_media = new Media(url,
            // success callback
            function () {

            },
            // error callback
           null, function () {
               if (arguments[0] == 4) //狀態碼4 = 播放完成或播放停止 play stopped
               {
                   //console.log('???');
               }
           }
          );

        // Play audio
        my_media.play();
    }
    //--cordova 播放音檔

    //--搭配savetxt.php做存入--

    function savetxt(fileName, poststr) {
        /// <summary>IOS/php存入文字檔</summary>
        /// <param name="fileName" type="str">檔案名稱</param>
        /// <param name="poststr" type="str">存檔內容</param>
        //console.log(fileName + '__' + poststr);
        saveloading.savecnt += 1;//搭配saveloading元件做loading畫面
        saveloading.saveing();
        if (isios != -1) {//IOS,Android用
            //alert('IOS 1');
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry) {
                // alert('IOS 2');
                //永遠新建檔案覆寫
                directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                    //alert('IOS 3');
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            //alert('IOS建立完成，讀取');
                            //存檔完成，開始讀取
                            fileEntry.file(function (file) {
                                var reader = new FileReader();
                                reader.onloadend = function (e) {
                                    //存入跟讀出的檔案格式轉為json
                                    //alert("IOS讀取完成: " + this.result);
                                    //console.log(fileName + '存檔完成')
                                    saveloading.savedone(fileName);
                                };
                                reader.readAsText(file);
                            }, errorHandler.bind(null, fileName));
                        };
                        fileWriter.onerror = function (e) {
                            // alert('write error');
                        };
                        fileWriter.write(poststr);
                    }, errorHandler.bind(null, fileName));
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        } else {//不是IOS，做php存入
            if (navigator.userAgent.indexOf("Electron") != -1) {//Electron
                alert('Electron');
                var fs = require('fs');
                try {
                    fs.writeFileSync(fileName, poststr, 'utf-8');
                    ajax_loading = 0;
                    saveloading.savedone(fileName);
                }
                catch (e) {
                    alert('Electron存檔錯誤!');
                }
            }else{//PHP
                $.ajax({
                    url: 'savetxt.php',
                    data: { filename: fileName, poststr: poststr },
                    type: 'POST',
                    timeout: 5000, //超過5秒沒回應就timeout
                    cache: false,
                    error: function (xhr, status, error) {
                        ajax_loading = 0;
                        //alert('php error: '+status);
                    },
                    success: function (data) {
                        //成功寫入資料
                        ajax_loading = 0;
                        saveloading.savedone(fileName);
                        //alert(data);
                        //alert('php save OK');
                    }
                });

            }
            
        }


    }
    //==搭配savetxt.php做存入==

    //--搭配readtxt.php做寫入--
    function loadtxt(fileName, func, nofilefunc) {
        /// <summary>IOS/php讀取文字檔</summary>
        /// <param name="fileName" type="str">檔案名稱</param>
        console.log(fileName);
        if (isios != -1) {//IOS,Android用
            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry) {
                //檔案名稱，是否建立檔案，檔案存在動作，檔案不存在動作
                directoryEntry.getFile(fileName, { create: false }, function (fileEntry) {
                    //檔案存在
                    var pathToFile = cordova.file.externalDataDirectory + fileName;
                    //alert('setting檔案存在，直接讀取' + pathToFile);
                    window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (e) {
                                //console.log('IOS有存檔' + fileName);
                                func(this.result);
                            };
                            reader.readAsText(file);
                        }, errorHandler.bind(null, fileName));
                    }, errorHandler.bind(null, fileName));

                }, function (fileEntry) {
                    //檔案不存在
                    //console.log('ios,無存檔:' + fileName)
                    nofilefunc();

                });
            }, errorHandler.bind(null, fileName));

        } else {//不是IOS，做php存入
            if (navigator.userAgent.indexOf("Electron") != -1) {//Electron
            }else{//PHP
            }

            $.ajax({
                type: "GET", url: fileName, cache: false, async: false,
                success: function (data) {
                    ajax_loading = 0;
                    //return data;
                    func(data);
                }, error: function (xhr, ajaxOptions, thrownError) {
                    if (xhr.status == 404) {
                        nofilefunc();
                    }
                }
            });
            /*
                    $.ajax({
                        url: 'readtxt.php',
                        data: { filename: fileName },
                        type: 'POST',
                        timeout: 5000, //超過5秒沒回應就timeout
                        cache: false,
                        error: function (xhr, status, error) {
                            ajax_loading = 0;
                            alert('php error: ' + status);
                        },
                        success: function (data) {
                            //成功取回資料
                            ajax_loading = 0;
                            //return data;
                            func(data);
                            //alert(data);
                        }
                    });
                    */
        }

    }


    //==搭配readtxt.php做寫入==


    //---判斷event.type 決定取xy的方式，做兼容Android+ipad+chrome用
    var outxy = { x: 0, y: 0 }
    var bodyxy = { x: 0, y: 0 }
    function getxy(event) {
        if (event.type.toString().indexOf('touch') > -1) {
            outxy = { x: parseInt(event.touches[0].pageX), y: parseInt(event.touches[0].pageY) }
        } else {
            outxy = { x: parseInt(event.pageX), y: parseInt(event.pageY) }
        }
        //index.html裡面處理scalestartx，scalerate
        bodyxy = { x: parseInt((outxy.x - scalestartx) / scalerate), y: parseInt((outxy.y - scalestarty) / scalerate) }
    }
    //===判斷event.type 決定取xy的方式

    //---IOS撥放音檔
    function playsoundios(src) {
        if (isios == -1) {
            //不是移動裝置
            $('#audio1').attr('src', src);
            document.getElementById('audio1').play();
        } else {
            callNativePlugin1(src);
        }
    }
    function callNativePlugin(returnSuccess) {
        HelloPlugin.callNativeFunction(nativePluginResultHandler, nativePluginErrorHandler, returnSuccess);
    }
    function callNativePlugin1(returnSuccess) {
        HelloPlugin1.callNativeFunction1(nativePluginResultHandler, nativePluginErrorHandler, returnSuccess);
    }
    function nativePluginResultHandler(result) { }
    function nativePluginErrorHandler(error) { }
    //===IOS撥放音檔



    function fn_dragstart(dragid, alignx, aligny, imgid, dragplace) {
        /// <summary>拖拉</summary>
        /// <param name="dragid" type="str">要被拖拉的id</param>
        /// <param name="alignx" type="int">(0-100)如果被拖拉的div內含有圖片(為AutoHtml產生的格式)，且需要重新定位webkit中心點時，傳入定位寬%數</param>
        /// <param name="aligny" type="int">傳入定位高%數</param>
        /// <param name="imgid" type="int">內含多個圖片，以此圖片id做重定寬高計算，如無傳入值，則用拖拉id，減去前面 'dv_'後做為定位圖片id</param>
        /// <param name="dragplace" type="str">特定區域才能拖拉</param>
        if (dragplace != undefined) {//有dragplace設定
            document.getElementById(dragplace).addEventListener(eventdown, function (event) {
                drag_place = event.currentTarget.id
            });
            document.getElementById(dragid).addEventListener(eventdown, function (event) {
                //if (drag_place == dragplace) { fn_dragstart_start(event) }
                 fn_dragstart_start(event) 
            });
        } else {
            document.getElementById(dragid).addEventListener(eventdown, function (event) {
                fn_dragstart_start(event)
            });
        }

        if (alignx != undefined) {
            fn_dvresize(dragid, alignx, aligny, imgid)
        }
    }

    function fn_dragstart1(dragid, alignx, aligny, imgid) {
        /// <summary>拖拉</summary>
        /// <param name="dragid" type="str">要被拖拉的id</param>
        /// <param name="alignx" type="int">(0-100)如果被拖拉的div內含有圖片(為AutoHtml產生的格式)，且需要重新定位webkit中心點時，傳入定位寬%數</param>
        /// <param name="aligny" type="int">傳入定位高%數</param>
        /// <param name="imgid" type="int">內含多個圖片，以此圖片id做重定寬高計算，如無傳入值，則用拖拉id，減去前面 'dv_'後做為定位圖片id</param>
        document.getElementById(dragid).addEventListener(eventdown, function (event) { fn_dragstart_start1(event) });
        if (alignx != undefined) {
            fn_dvresize(dragid, alignx, aligny, imgid)
        }
    }




    function fn_dragstart_start(event) {
        getxy(event);
        drag_id = event.currentTarget.id;
        drag_downx = outxy.x - $('#' + drag_id).position().left;
        drag_downy = outxy.y - $('#' + drag_id).position().top;
        drag_flag = 1;
        $('#' + drag_id).css('z-index', 1);
        startwebkit('x=N,y=N,旋轉=N,x縮放=N,y縮放=N,x軸旋轉=N,y軸旋轉=N,透明度=N,動態時間=0,目標=' + drag_id + ',間隔時間=N,轉場=N');
    }

    function fn_dragstart_start1(event) {
        getxy(event);
        drag_id = event.currentTarget.id;
        drag_downx = outxy.x - $('#' + drag_id).position().left;
        drag_downy = outxy.y - $('#' + drag_id).position().top;
        drag_flag = 1;
        $('#' + drag_id).css('z-index', 1);

    }

    function fn_dvresize(dvid, alignx, aligny, imgid) {
        var subid = '';
        if (imgid != undefined) {
            subid = dvid.substring(3, dvid.length);
        } else {
            subid = imgid;
        }
        $('#' + dvid).css('width', $('#' + imgid).width() + 'px');
        $('#' + dvid).css('height', $('#' + imgid).height() + 'px');
        $('#' + dvid).css('-webkit-transform-origin', alignx + '% ' + aligny + '%');
    }


    function fn_aligncenter(bgid, ctid, diffx, diffy) {
        /// <summary>放置於物件中心點，bgid包著ctid，ctid要放置在bgid中心點時使用</summary>
        /// <param name="bgid" type="String">要對齊的物件idID</param>
        /// <param name="ctid" type="String">要放在中心的物件ID</param>
        /// <param name="diffx" type="String">修正誤差X</param>
        /// <param name="diffy" type="String">修正誤差Y</param>
        var diffw = ($('#' + bgid).width() - $('#' + ctid).width()) / 2;
        var diffh = ($('#' + bgid).height() - $('#' + ctid).height()) / 2;
        if (diffx != undefined) {
            diffw = diffw + diffx;
        }
        if (diffy != undefined) {
            diffh = diffh + diffy;
        }
        //startwebkit('x=' + diffw + ',y=' + diffh + ',旋轉=N,x縮放=N,y縮放=N,x軸旋轉=N,y軸旋轉=N,透明度=N,動態時間=0,目標=' + ctid + ',間隔時間=N,轉場=N');
        $('#' + ctid).velocity({ left: diffw, top: diffh }, 0);
    }

    function fn_aligncenter_pos(ctid, alignid, alighx, aligny, alignw, alignh) {
        /// <summary>放置於物件中心點，要對齊背景某個點，ctid是圖的id，用來取對齊的寬高用，alignid為包圖的div，用來做移動位置用</summary>
        /// <param name="ctid" type="String">取寬高的物件</param>
        /// <param name="alignid" type="String">要移動的物件</param>
        /// <param name="alighx" type="int">要對齊的起點x</param>
        /// <param name="aligny" type="int">要對齊的起點y</param>
        /// <param name="alignw" type="int">要對齊的物件寬</param>
        /// <param name="alignh" type="int">要對齊的物件高</param>
        var diffw = (alignw - $('#' + ctid).width()) / 2;
        var diffh = (alignh - $('#' + ctid).height()) / 2;

        //startwebkit('x=' + (alighx + diffw) + ',y=' + (aligny + diffh) + ',旋轉=N,x縮放=1,y縮放=1,x軸旋轉=N,y軸旋轉=N,透明度=N,動態時間=0,目標=' + alignid + ',間隔時間=N,轉場=N');
        $('#' + alignid).velocity({ left: (alighx + diffw), top: (aligny + diffh) }, 0);
    }


    var playsound_id = '';
    var playsound_eventid = '';
    var playsound_pausing = 0;
    function soundplay(eventid, targetid, src, posx, posy, needpause) {
        /// <summary>播放音檔</summary>
        /// <param name="eventid" type="String">觸發發音的物件ID</param>
        /// <param name="targetid" type="String">傳入要消失的物件ID</param>
        /// <param name="src" type="String">撥放音檔路徑</param>
        /// <param name="posx" type="int">stop按鈕出現x</param>
        /// <param name="posy" type="int">stop按鈕出現y</param>
        /// <param name="needpause" type="String">是否產生pause按鈕，1=出現,0=不出現,undefined=不出現</param>
        if (eventid == playsound_eventid)//正在撥放不重覆觸發
        {
            if (playsound_pausing == 0) {
                return;
            }
        } else {
            $('#audio1').attr('src', '');
            $('#' + playsound_id).show();
        }
        playsound_eventid = eventid;
        playsound_id = targetid;
        if ($('#audio1').attr('src') != src) {
            $('#audio1').attr('src', src);
        }
        document.getElementById('audio1').play();
        if (needpause == undefined || needpause == 0) {
            startwebkit('x=' + posx + ',y=' + posy + ',旋轉=N,x縮放=N,y縮放=N,x軸旋轉=N,y軸旋轉=N,透明度=N,動態時間=0,目標=dv_snd_stop,間隔時間=N,轉場=N');
        } else {
            startwebkit('x=' + (posx - 45) + ',y=' + posy + ',旋轉=N,x縮放=N,y縮放=N,x軸旋轉=N,y軸旋轉=N,透明度=N,動態時間=0,目標=dv_snd_stop,間隔時間=N,轉場=N');
            startwebkit('x=' + (posx + 45) + ',y=' + posy + ',旋轉=N,x縮放=N,y縮放=N,x軸旋轉=N,y軸旋轉=N,透明度=N,動態時間=0,目標=dv_snd_pause,間隔時間=N,轉場=N');
            $('#dv_snd_pause').show();
            $('#dv_snd_pause').css('z-index', 1);
        }
        $('#dv_snd_stop').show();
        $('#dv_snd_stop').css('z-index', 1);
        $('#' + targetid).hide();
    }

    function soundstop() {
        soundpause();
        $('#audio1').attr('src', '');
        playsound_id = '';
        playsound_eventid = '';
        playsound_pausing = 0;
    }
    function soundend() {
        soundpause();
        playsound_id = '';
        playsound_eventid = '';
        playsound_pausing = 0;
    }

    function soundpause() {
        /// <summary>音檔內容重設</summary>
        document.getElementById('audio1').pause();
        $('#' + playsound_id).show();
        $('#dv_snd_stop').hide();
        $('#dv_snd_pause').hide();
        $('#dv_snd_stop').css('z-index', 0);
        $('#dv_snd_pause').css('z-index', 0);
        playsound_pausing = 1;
    }

    function chi_setpicfilename(chiword) {
        /// <summary>傳入中文字，傳出轉成wd接encodeURI檔名，用_取代%</summary>
        /// <param name="chiword" type="String">中文字，限1個字元</param>
        var tempstr = encodeURIComponent(chiword);
        while (tempstr.indexOf('%') != -1) {
            //tempstr = tempstr.replace('%', '_');
            tempstr = tempstr.replace('%', '');
        }
        //return 'wd'+tempstr;
        return tempstr;
    }

    function chi_getpicfilename(filename) {
        /// <summary>傳入wd開頭的encodeURI檔名，傳出中文字</summary>
        /// <param name="filename" type="String">檔案名稱ex: wd_E5_9F_8E 傳回為城</param>

        var tempstr = filename.substr(2, filename.length - 2)
        if (tempstr.length > 1) {
            while (tempstr.indexOf('_') != -1) {
                tempstr = tempstr.replace('_', '%');
            }
        }
        return decodeURIComponent(tempstr);
    }

    function getfulldate() {
        /// <summary>取得今天日期 2015-08-09 格式</summary>
        var newdate = new Date;
        var yy = newdate.getUTCFullYear();
        var mm = (newdate.getUTCMonth() + 1);
        var dd = newdate.getDate();
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (dd < 10) {
            dd = '0' + dd;
        }
        return yy + '-' + mm + '-' + dd;
    }

    function getfulldate1() {
        /// <summary>取得今天日期向後1個月 2015-08-09 格式</summary>
        var newdate = new Date;

        var yy = newdate.getUTCFullYear();
        var mm = (newdate.getUTCMonth() + 2);
        if (mm == 13) {//如果跳到13，月=1，年+1
            yy = yy + 1;
            mm = 1;
        }
        var dd = newdate.getDate();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm == 2 && dd > 28) {
            dd = 28
        }
        if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
            if (dd > 30) {
                dd = 30;
            }

        }


        return yy + '-' + mm + '-' + dd;
    }



    function aftertoday(datestr) {
        /// <summary>取得 datestr 是否還沒過期，格式 yyyy-MM-dd</summary>
        var newdate = new Date;
        var yy = newdate.getUTCFullYear();
        var mm = (newdate.getUTCMonth() + 1);
        var dd = newdate.getDate()
        var datestr_ar = datestr.split('-');
        var yy1 = parseInt(datestr_ar[0]);
        var mm1 = parseInt(datestr_ar[1]);
        var dd1 = parseInt(datestr_ar[2]);
        if (yy1 > yy) {
            return 1
        }

        if (yy1 == yy && mm1 > mm) {
            return 1
        }
        if (yy1 == yy && mm1 == mm && dd1 >= dd) {
            return 1
        }
        return 0;
    }

    function stripscript(s) {
        /// <summary>取代掉特殊符號</summary>
        //var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
        var pattern = new RegExp("[`~@#^*|{}\\[\\]<>/@#￥|\]") //除了\其他都清掉
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    }

    function d2h(d) {
        /// <summary>十進位轉16進位</summary>
        return d.toString(16);
    }


    function h2d(h) {
        /// <summary>16進位轉十進位</summary>
        return parseInt(h, 16);
    }

    function getengmonth(str) {
        /// <summary>傳回英文字月份簡寫</summary>
        /// <param name="str" type="String">字串，01-12代表月份</param>
        if (str == '01') {
            return 'Jan.'
        } else if (str == '02') {
            return 'Feb.'
        } else if (str == '03') {
            return 'Mar.'
        } else if (str == '04') {
            return 'Apr.'
        } else if (str == '05') {
            return 'May.'
        } else if (str == '06') {
            return 'Jun.'
        } else if (str == '07') {
            return 'Jul.'
        } else if (str == '08') {
            return 'Aug.'
        } else if (str == '09') {
            return 'Sept.'
        } else if (str == '10') {
            return 'Oct.'
        } else if (str == '11') {
            return 'Nov.'
        } else if (str == '12') {
            return 'Dec.'
        } else {
            return str;
        }
    }


    //---元件產生
    /*
    //自動插入Dom元件用法:
    //自動產生圖片、文字、打字框
    var output_ar1 = [
           //  Dom_id, 純文字,   X,   Y,   W, 大, 0,列,   文字,   字型 ,    顏色
           ['adv_exp', 'text', 110, 585, 300, 26, 0, 0, 'guǒ', 'Arial', '000000'],
           //  Dom_id, 類型 ,   X,   Y,  W,  H,   ,   ,  圖片檔名   註: X設為-1，為全畫面置中，W設為0或-1，自動依圖片大小
           ['adv_cwe', 'pic', 703, 581, 41, -1, -1, -1, 'bt_2.png'],
           // Dom_id ,     圖片+置中文字,   X,   Y,  W,  H,   , 列,           圖片檔名,   文字,     字型, 大, 顏色
           ['advcc_7', 'pic_text_center', 100, 653, 81, -1, -1, -1, 'exercise_cw2.png', '文字', fonttype, 72, 'F8ECD3'],
           // Dom_id ,  圖片+文字,   X,   Y,   W,  H,  ,  列,          圖片檔名,             文字,     字型, 大, 字x,字y, 字顏色
           ['dv_ans1', 'pic_text', 110, 357, 800, -1, -1, -1, 'exercise_us.png', ' ___________。', fonttype, 36, 100, 6, '5E2020'],//圖片+文字，文字設定位置, 字型
           //打字框:id,  類型 ,  x,   y,  w,  0,siz,  h,        提示字,  預設字
           ['dv_word3', 'typ1', 49, 419, 55, -1, 40, 55, 'Placeholder', 'Defaulttext']
    ];
                           //Dom陣列,  容器,  執行完呼叫函式
    ins_dom_wait_ar.push([output_ar1, 'sp1', 'ins_dom_result1']);
    //開始產生
    fn_ins_dom();
    */




    var ins_dom_wait_ar = [];
    var input_dom_ar = [];
    var ins_dom_appendid = '';
    var ins_dom_cnt = 0;
    var ins_dom_functionname = '';
    var ins_dom_defalut_lineheight = 0
    function fn_ins_dom() {
        if (ins_dom_wait_ar.length > 0) {
            ins_dom_cnt = 0;
            input_dom_ar = ins_dom_wait_ar[0][0];
            ins_dom_appendid = ins_dom_wait_ar[0][1];
            $('#' + ins_dom_appendid).html('');
            ins_dom_functionname = ins_dom_wait_ar[0][2];
        } else {
            return;
        }
        for (var i = 0; i < input_dom_ar.length; i++) {
            if (input_dom_ar[i][1] == 'text') {
                ins_dom_text(input_dom_ar[i][0], input_dom_ar[i][1], input_dom_ar[i][2], input_dom_ar[i][3], input_dom_ar[i][4], input_dom_ar[i][5], input_dom_ar[i][6], input_dom_ar[i][7], input_dom_ar[i][8], input_dom_ar[i][9], input_dom_ar[i][10]);
            } else if (input_dom_ar[i][1] == 'pic') {
                ins_dom_pic(input_dom_ar[i][0], input_dom_ar[i][1], input_dom_ar[i][2], input_dom_ar[i][3], input_dom_ar[i][4], input_dom_ar[i][5], input_dom_ar[i][6], input_dom_ar[i][7], input_dom_ar[i][8], input_dom_ar[i][9], input_dom_ar[i][10], input_dom_ar[i][11]);
            } else if (input_dom_ar[i][1] == 'typ1') {
                ins_dom_typ(input_dom_ar[i][0], input_dom_ar[i][1], input_dom_ar[i][2], input_dom_ar[i][3], input_dom_ar[i][4], input_dom_ar[i][5], input_dom_ar[i][6], input_dom_ar[i][7], input_dom_ar[i][8], input_dom_ar[i][9]);
            } else if (input_dom_ar[i][1] == 'pic_text_center') {
                ins_dom_pictext_c(input_dom_ar[i][0], input_dom_ar[i][1], input_dom_ar[i][2], input_dom_ar[i][3], input_dom_ar[i][4], input_dom_ar[i][5], input_dom_ar[i][6], input_dom_ar[i][7], input_dom_ar[i][8], input_dom_ar[i][9], input_dom_ar[i][10], input_dom_ar[i][11], input_dom_ar[i][12]);
            } else if (input_dom_ar[i][1] == 'pic_text') {
                ins_dom_pictext_p(input_dom_ar[i][0], input_dom_ar[i][1], input_dom_ar[i][2], input_dom_ar[i][3], input_dom_ar[i][4], input_dom_ar[i][5], input_dom_ar[i][6], input_dom_ar[i][7], input_dom_ar[i][8], input_dom_ar[i][9], input_dom_ar[i][10], input_dom_ar[i][11], input_dom_ar[i][12], input_dom_ar[i][13], input_dom_ar[i][14]);
            }
        }
    }
    //純文字
    function ins_dom_text(inid, intype, inx, iny, inw, insize, inmx, inmy, insstr, addtexttype, colorcode) {
        ///<summary>插入文字於DIV，不換行</summary>
        if (inw != -1) {
            $('#' + ins_dom_appendid).append('<div id="' + inid + '" style="position: absolute; left: ' + inx + 'px; top: ' + iny + 'px;width:' + inw + 'px;font-family: ' + addtexttype + '; color:#' + colorcode + ';font-size:' + insize + 'px;white-space:pre;line-height:' + (insize + inmy) + 'px" ></div>')
        } else {//自動寬度，搭配inx = -1自動置中
            $('#' + ins_dom_appendid).append('<div id="' + inid + '" style="position: absolute; left: ' + inx + 'px; top: ' + iny + 'px;font-family: ' + addtexttype + '; color:#' + colorcode + ';font-size:' + insize + 'px;white-space:pre;line-height:' + (insize + inmy) + 'px" ></div>')
        }

        var wd_size = insize;
        while (insstr.indexOf('<r>') != -1) {
            insstr = insstr.replace('<r>', '\r\n');
        }
        if (insstr.length > 0) {
            $('#' + inid).html(insstr);
            $('#' + inid).html('' + insstr + '');
        }

        if (inx == -1) {
            $('#' + inid).css('left', parseInt(512 - $('#' + (inid)).width() / 2) + 'px');
        }
        ins_dom_loaded();
    }
    //純圖片
    function ins_dom_pic(inid, intype, inx, iny, inw, insize, inmx, inmy, insstr) {
        $('#' + ins_dom_appendid).append('<div id="' + inid + '" style="position: absolute; left: ' + inx + 'px; top: ' + iny + 'px;" ></div>')
        var temppic = new Image();
        temppic.src = "img/" + insstr;
        temppic.onload = function () {
            if (inw == 0 || inw == -1) {
                $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" width=""  />');
            } else {
                if (insize != -1) {//有設定高度
                    $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" style="width:' + inw + 'px;height:' + insize + 'px" />');
                } else {
                    $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" width="' + inw + '" />');
                }

            }
            if (inx == '-1') {
                $('#' + inid).css('left', parseInt(512 - $('#' + (inid)).width() / 2) + 'px');
            }
            ins_dom_loaded();
        }
    }
    //圖片，文字自定位置
    function ins_dom_pictext_p(inid, intype, inx, iny, inw, insize, inmx, inmy, insstr, addtext, addtexttype, addtextsize, txx, tyy, colorcode) {
        $('#' + ins_dom_appendid).append('<div id="' + inid + '" style="position: absolute; left: ' + inx + 'px; top: ' + iny + 'px;" ></div>')
        var temppic = new Image();
        temppic.src = "img/" + insstr;
        temppic.onload = function () {
            if (inw == 0 || inw == -1) {
                $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" width=""  />');
            } else {
                if (insize != -1) {//有設定高度
                    $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" style="width:' + inw + 'px;height:' + insize + 'px" />');
                } else {
                    $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" width="' + inw + '" />');
                }
            }
            if (inx == '-1') {
                $('#' + inid).css('left', parseInt(512 - $('#' + (inid)).width() / 2) + 'px');
            }
            var addtextstr = "";

            if (inmy != '-1') {//設定為-1 時改為以字型大小為列高
                addtextstr = '<div id="pt_' + inid + '" style="position: absolute; left:' + txx + 'px; top:' + tyy + 'px;font-family: ' + addtexttype + '; color:#' + colorcode + ';font-size:' + addtextsize + 'px;white-space:pre;line-height:' + (addtextsize + inmy) + 'px"  >' + addtext + '</div>';
            } else {
                addtextstr = '<div id="pt_' + inid + '" style="position: absolute; left:' + txx + 'px; top:' + tyy + 'px;font-family: ' + addtexttype + '; color:#' + colorcode + ';font-size:' + addtextsize + 'px;white-space:pre;line-height:' + (addtextsize) + 'px"  >' + addtext + '</div>';
            }

            $('#' + inid).append(addtextstr);

            ins_dom_loaded();
        }
    }

    //圖片，文字置中
    function ins_dom_pictext_c(inid, intype, inx, iny, inw, insize, inmx, inmy, insstr, addtext, addtexttype, addtextsize, colorcode) {
        $('#' + ins_dom_appendid).append('<div id="' + inid + '" style="position: absolute; left: ' + inx + 'px; top: ' + iny + 'px;border:1px solid" ></div>')
        var temppic = new Image();
        temppic.src = "img/" + insstr;

        temppic.onload = function () {
            if (inw == 0 || inw == -1) {//沒設寬度
                $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" width=""  />');
            } else {
                if (insize != -1) {//有設定高度
                    $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" style="width:' + inw + 'px;height:' + insize + 'px" />');
                } else {//沒設高度
                    $('#' + inid).append('<img src="img/' + insstr + '" id="ig_' + inid + '" width="' + inw + '" />');
                }
            }
            if (inx == '-1') {
                $('#' + inid).css('left', parseInt(512 - $('#' + (inid)).width() / 2) + 'px');
            }
            var addtextstr = '';
            if (inmy != '-1') {//設定為-1 時改為以字型大小為列高
                addtextstr = '<div id="pt_' + inid + '" style="position: absolute; left:0px; top:0px;font-family: ' + addtexttype + '; color:#' + colorcode + ';font-size:' + addtextsize + 'px;white-space:pre;line-height:' + (addtextsize + inmy) + 'px"  >' + addtext + '</div>';
            } else {
                addtextstr = '<div id="pt_' + inid + '" style="position: absolute; left:0px; top:0px;font-family: ' + addtexttype + '; color:#' + colorcode + ';font-size:' + addtextsize + 'px;white-space:pre;line-height:' + (addtextsize) + 'px"  >' + addtext + '</div>';

            }

            $('#' + inid).append(addtextstr);
            startwebkit('x=N,y=N,旋轉=N,x縮放=N,y縮放=N,x軸旋轉=N,y軸旋轉=N,透明度=N,動態時間=0,目標=pt_' + inid + ',間隔時間=N,轉場=N,z=5');
            fn_aligncenter(inid, 'pt_' + inid, 0, -2);
            ins_dom_loaded();
        }

    }

    function ins_dom_typ(inid, intype, inx, iny, inw, insize, inmx, inmy, insstr, defaulttext) {
        if (defaulttext != '') {
            $('#' + ins_dom_appendid).append('<textarea id="' + inid + '" maxlength="200" style="position: absolute; left: ' + inx + 'px; top: ' + iny + 'px;width:' + inw + 'px;height:' + inmy + 'px;font-size:' + inmx + 'px;-webkit-overflow-scrolling:touch;" placeholder="' + insstr + '">' + defaulttext + '</textarea>')
        } else {
            $('#' + ins_dom_appendid).append('<textarea id="' + inid + '" maxlength="200" style="position: absolute; left: ' + inx + 'px; top: ' + iny + 'px;width:' + inw + 'px;height:' + inmy + 'px;font-size:' + inmx + 'px;-webkit-overflow-scrolling:touch;" placeholder="' + insstr + '"></textarea>')
        }
        ins_dom_loaded();
    }

    function ins_dom_loaded() {
        ins_dom_cnt = ins_dom_cnt + 1;
        if (ins_dom_cnt == input_dom_ar.length) {
            window[ins_dom_functionname]();
            if (ins_dom_wait_ar.length > 0) {
                ins_dom_wait_ar.splice(0, 1);
                if (ins_dom_wait_ar.length > 0) {
                    setTimeout(function () {
                        fn_ins_dom();
                    }, 100)

                }
            }

        }
    }
    //===元件產生


    //---IOS用發音Plugin，MyFirstChinese用，IOS原生發音可調大小聲
    var HelloPlugin = {
        callNativeFunction: function (success, fail, resultType) {
            return Cordova.exec(success, fail, "com.fareastbook.mypocketchinese.HelloPlugin", "nativeFunction", [resultType]);
        }
    };

    var HelloPlugin1 = {
        callNativeFunction1: function (success, fail, resultType) {
            return Cordova.exec(success, fail, "com.fareastbook.mypocketchinese.HelloPlugin", "nativeFunction1", [resultType]);
        }
    };
    //===IOS用發音Plugin

    //---貼上3D方塊
    function create_3d_cube(cubeparent, cubename, cubewidth, cubeheight, cubez, cubeperv, cubeword, cubeimg, cubex, cubey, cubefunc) {
        ///<summary>插入3d方塊
        //create_3d_cube('div_id','index_dom', 300, 200, 500, 2000, ['頂', '左', '後', '右', '底', '前'], ['img/1.png', 'img/2.png', 'img/3.png', 'img/4.png', 'img/5.png', 'img/6.png'], 300, 300);</summary>
        ///<summary>欲插入的div,3d方塊id,寬，長，高，3d偏移,方塊上貼字(6位陣列['頂', '左', '後', '右', '底', '前'],方塊圖(6位陣列順序同貼字),位置x,位置y,執行完呼叫程式(可不設定))</summary>

        var maxlen = 0;
        var minlen = 0;
        if (cubewidth > cubeheight) {
            maxlen = cubewidth;
            minlen = cubeheight;
        } else {
            maxlen = cubeheight;
            minlen = cubewidth;
        }
        if (maxlen < cubez) {
            maxlen = cubez;
        }
        if (minlen > cubez) {
            minlen = cubez;
        }
        $('#' + cubeparent).append('<div id="' + cubename + '_bg" style="position: absolute; width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; left:' + cubex + 'px; top:' + cubey + 'px; perspective: ' + cubeperv + 'px;"><div id="' + cubename + '_z" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; "><div id="' + cubename + '_xyz" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; "><div id="' + cubename + '" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; "><div id="' + cubename + '_1" style="position: absolute; left: 0px; top: 0px;"><img src="' + cubeimg[0] + '" id="ig_' + cubename + '_1" style="width:' + cubewidth + 'px;height:' + cubeheight + 'px"><div id="pt_' + cubename + '_1" style="position: absolute; left: 0px; top: 0px; font-family: \'Times New Roman\'; color: rgb(102, 0, 0);width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubeheight * 0.9) + 'px;">' + cubeword[0] + '</div></div><div id="' + cubename + '_2" style="position: absolute; left: 0px; top: 0px;border:1px solid"><img src="' + cubeimg[1] + '" id="ig_' + cubename + '_2" style="width:' + cubeheight + 'px;height:' + cubez + 'px"><div id="pt_' + cubename + '_2" style="position: absolute; left: 0px; top: 0px; font-family: \'Times New Roman\'; color: rgb(102, 0, 0); width: ' + cubeheight + 'px; height: ' + cubez + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;">' + cubeword[1] + '</div></div><div id="' + cubename + '_3" style="position: absolute; left: 0px; top: 0px;border:1px solid"><img src="' + cubeimg[2] + '" id="ig_' + cubename + '_3" style="width:' + cubewidth + 'px;height:' + cubez + 'px"><div id="pt_' + cubename + '_3" style="position: absolute; left: 0px; top: 0px; font-family: \'Times New Roman\'; color: rgb(102, 0, 0);width: ' + cubewidth + 'px; height: ' + cubez + 'px; font-size: ' + (minlen * 0.8) + 'px; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;">' + cubeword[2] + '</div></div><div id="' + cubename + '_6" style="position: absolute; left: 0px; top: 0px;border:1px solid"><img src="' + cubeimg[5] + '" id="ig_' + cubename + '_6" style="width:' + cubewidth + 'px;height:' + cubez + 'px"><div id="pt_' + cubename + '_6" style="position: absolute; left: 0px; top: 0px; font-family: \'Times New Roman\'; color: rgb(102, 0, 0);width: ' + cubewidth + 'px; height: ' + cubez + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;">' + cubeword[5] + '</div></div><div id="' + cubename + '_4" style="position: absolute; left: 0px; top: 0px;border:1px solid"><img src="' + cubeimg[3] + '" id="ig_' + cubename + '_4" style="width:' + cubeheight + 'px;height:' + cubez + 'px"><div id="pt_' + cubename + '_4" style="position: absolute; left: 0px; top: 0px; font-family: \'Times New Roman\'; color: rgb(102, 0, 0);width: ' + cubeheight + 'px; height: ' + cubez + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;">' + cubeword[3] + '</div></div><div id="' + cubename + '_5" style="position: absolute; left: 0px; top: 0px;border:1px solid"><img src="' + cubeimg[4] + '" id="ig_' + cubename + '_5" style="width:' + cubewidth + 'px;height:' + cubeheight + 'px"><div id="pt_' + cubename + '_5" style="position: absolute; left: 0px; top: 0px; font-family: \'Times New Roman\'; color: rgb(102, 0, 0);width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubeheight * 0.9) + 'px;">' + cubeword[4] + '</div></div></div></div></div></div>');
        $('#' + cubename + '_bg').css("-webkit-transform", "translateZ(-5000px)");
        $('#' + cubename).css('-webkit-transform-style', "preserve-3d");
        $('#' + cubename + '_xyz').css("-webkit-transform-style", "preserve-3d");
        $('#' + cubename + '_z').css("-webkit-transform-style", "preserve-3d");

        $('#' + cubename + '_1').velocity({ translateY: 0, rotateX: 90, translateZ: (cubez / 2) }, 0);//頂
        $('#' + cubename + '_5').velocity({ rotateX: -90, translateZ: (cubez / 2) }, 0);//底

        $('#' + cubename + '_2').velocity({ translateY: (cubeheight / 2) - (cubez / 2), rotateY: -90, translateZ: (cubeheight / 2) }, 0);//左
        $('#' + cubename + '_4').velocity({ translateY: (cubeheight / 2) - (cubez / 2), rotateY: 90, translateZ: cubewidth - (cubeheight / 2) }, 0);//右


        $('#' + cubename + '_6').velocity({ translateY: (cubeheight / 2) - (cubez / 2), translateZ: (cubeheight / 2) }, 0);//前
        $('#' + cubename + '_3').velocity({ translateY: (cubeheight / 2) - (cubez / 2), rotateY: 180, translateZ: (cubeheight / 2) }, 0);//後


        //z控制位置，方向，測度
        //xyz控制旋轉

        $('#' + cubename + '_xyz').css('border', '1px solid red');
        $('#' + cubename + '_z').css('border', '1px solid green');
        $('#' + cubename + '_z').velocity({ rotateX: -50, rotateY: -35 }, 1000).velocity({
            complete: function () {
                $('#' + cubename + '_xyz').velocity({ rotateZ: 360 }, 1000).velocity({ rotateZ: 720 }, 1000).velocity({ rotateZ: -360 }, 1000)
            }
        })




        if (cubefunc != null) {
            window[cubefunc](cubename);
        }
    }

    //---貼上3D方塊
    function create_3d_cube_css(cubeparent, cubename, cubewidth, cubeheight, cubez, cubeperv, cubeword, cubeimg, cubex, cubey, cubefunc, cubetextcolor, cubefontsize) {
        ///<summary>插入3d方塊
        //create_3d_cube('div_id','index_dom', 300, 200, 500, 2000, ['頂', '左', '後', '右', '底', '前'], ['img/1.png', 'img/2.png', 'img/3.png', 'img/4.png', 'img/5.png', 'img/6.png'], 300, 300);</summary>
        ///<summary>欲插入的div,3d方塊id,寬，長，高，3d偏移,方塊上貼字(6位陣列['頂', '左', '後', '右', '底', '前'],方塊圖(6位陣列順序同貼字),位置x,位置y,執行完呼叫程式(可不設定))</summary>

        var maxlen = 0;
        var minlen = 0;
        if (cubewidth > cubeheight) {
            maxlen = cubewidth;
            minlen = cubeheight;
        } else {
            maxlen = cubeheight;
            minlen = cubewidth;
        }
        if (maxlen < cubez) {
            maxlen = cubez;
        }
        if (minlen > cubez) {
            minlen = cubez;
        }



        (cubetextcolor == null) ? cubetextcolor = 'black' : '';
        (cubefontsize == null) ? cubefontsize = minlen : '';


        //$('#' + cubeparent).append('<div id="' + cubename + '_bg" style="position: absolute; width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; left:' + cubex + 'px; top:' + cubey + 'px; perspective: ' + cubeperv + 'px;"><div id="' + cubename + '_z" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; "><div id="' + cubename + '_xyz" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; "><div id="' + cubename + '" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; "><div id="' + cubename + '_1" style="position: absolute; left: 0px; top: 0px; width:' + cubewidth + 'px;height:' + cubeheight + 'px" class="' + cubeimg[0] + '"><div id="pt_' + cubename + '_1" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: red;width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubeheight * 0.9) + 'px;">' + cubeword[0] + '</div></div><div id="' + cubename + '_2" style="position: absolute; left: 0px; top: 0px;width:' + cubeheight + 'px;height:' + cubez + 'px" class="' + cubeimg[1] + '"><div id="pt_' + cubename + '_2" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: rgb(102, 0, 0); width: ' + cubeheight + 'px; height: ' + cubez + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;">' + cubeword[1] + '</div></div><div id="' + cubename + '_3" style="position: absolute; left: 0px; top: 0px;width:' + cubewidth + 'px;height:' + cubez + 'px" class="' + cubeimg[2] + '"><div id="pt_' + cubename + '_3" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: rgb(102, 0, 0);width: ' + cubewidth + 'px; height: ' + cubez + 'px; font-size: ' + (minlen * 0.8) + 'px; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;">' + cubeword[2] + '</div></div><div id="' + cubename + '_6" style="position: absolute; left: 0px; top: 0px;width:' + cubewidth + 'px;height:' + cubez + 'px" class="' + cubeimg[5] + '"><div id="pt_' + cubename + '_6" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: rgb(102, 0, 0);width: ' + cubewidth + 'px; height: ' + cubez + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;">' + cubeword[5] + '</div></div><div id="' + cubename + '_4" style="position: absolute; left: 0px; top: 0px;width:' + cubeheight + 'px;height:' + cubez + 'px" class="' + cubeimg[3] + '"><div id="pt_' + cubename + '_4" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: rgb(102, 0, 0);width: ' + cubeheight + 'px; height: ' + cubez + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubez * 0.9) + 'px;">' + cubeword[3] + '</div></div><div id="' + cubename + '_5" style="position: absolute; left: 0px; top: 0px;width:' + cubewidth + 'px;height:' + cubeheight + 'px" class="' + cubeimg[4] + '"><div id="pt_' + cubename + '_5" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: rgb(102, 0, 0);width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; font-size: ' + (minlen * 0.8) + 'px;text-align:center; white-space: pre-wrap; line-height: ' + (cubeheight * 0.9) + 'px;">' + cubeword[4] + '</div></div></div></div></div></div>');
        var tempstr = '<div id="' + cubename + '_bg" style="position: absolute; width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; left:' + cubex + 'px; top:' + cubey + 'px; perspective: ' + cubeperv + 'px;">'
        tempstr += '<div id="' + cubename + '_z" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; ">'
        tempstr += '<div id="' + cubename + '_xyz" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; ">'
        tempstr += '<div id="' + cubename + '" style="width: ' + cubewidth + 'px; height: ' + cubeheight + 'px; position: absolute; left: 0px; top: 0px; ">'
        tempstr += '<div id="' + cubename + '_1" style="position: absolute; left: 0px; top: 0px; width:' + cubewidth + 'px;height:' + cubeheight + 'px" class="' + cubeimg[0] + '">'
        tempstr += '<div id="pt_' + cubename + '_1" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color:' + cubetextcolor + '; font-size: ' + cubefontsize + 'px;text-align:center; white-space: pre-wrap;">' + cubeword[0] + '</div></div>'
        tempstr += '<div id="' + cubename + '_2" style="position: absolute; left: 0px; top: 0px;width:' + cubeheight + 'px;height:' + cubez + 'px" class="' + cubeimg[1] + '">'
        tempstr += '<div id="pt_' + cubename + '_2" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: ' + cubetextcolor + '; font-size: ' + cubefontsize + 'px;text-align:center; white-space: pre-wrap;">' + cubeword[1] + '</div></div>'
        tempstr += '<div id="' + cubename + '_3" style="position: absolute; left: 0px; top: 0px;width:' + cubewidth + 'px;height:' + cubez + 'px" class="' + cubeimg[2] + '">'
        tempstr += '<div id="pt_' + cubename + '_3" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: ' + cubetextcolor + '; font-size: ' + cubefontsize + 'px; text-align:center; white-space: pre-wrap; ">' + cubeword[2] + '</div></div>'
        tempstr += '<div id="' + cubename + '_6" style="position: absolute; left: 0px; top: 0px;width:' + cubewidth + 'px;height:' + cubez + 'px" class="' + cubeimg[5] + '">'
        tempstr += '<div id="pt_' + cubename + '_6" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color:' + cubetextcolor + '; font-size: ' + cubefontsize + 'px;text-align:center; white-space: pre-wrap;">' + cubeword[5] + '</div></div>'
        tempstr += '<div id="' + cubename + '_4" style="position: absolute; left: 0px; top: 0px;width:' + cubeheight + 'px;height:' + cubez + 'px" class="' + cubeimg[3] + '">'
        tempstr += '<div id="pt_' + cubename + '_4" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: ' + cubetextcolor + '; font-size: ' + cubefontsize + 'px;text-align:center; white-space: pre-wrap;">' + cubeword[3] + '</div></div>'
        tempstr += '<div id="' + cubename + '_5" style="position: absolute; left: 0px; top: 0px;width:' + cubewidth + 'px;height:' + cubeheight + 'px" class="' + cubeimg[4] + '">'
        tempstr += '<div id="pt_' + cubename + '_5" style="position: absolute; left: 0px; top: 0px; font-family:Arial,\'tfont\'; color: ' + cubetextcolor + '; font-size: ' + cubefontsize + 'px;text-align:center; white-space: pre-wrap;">' + cubeword[4] + '</div></div></div></div></div></div>';

        $('#' + cubeparent).append(tempstr);


        $('#' + cubename).css('-webkit-transform-style', "preserve-3d");
        $('#' + cubename + '_bg').css("-webkit-transform", "translateZ(-2000px)");
        $('#' + cubename + '_xyz').css("-webkit-transform-style", "preserve-3d");
        $('#' + cubename + '_z').css("-webkit-transform-style", "preserve-3d");

        $('#' + cubename + '_1').velocity({ translateY: 0, rotateX: 90, translateZ: (cubez / 2) }, 0);//頂
        $('#' + cubename + '_5').velocity({ rotateX: -90, translateZ: (cubez / 2) }, 0);//底

        $('#' + cubename + '_2').velocity({ translateY: (cubeheight / 2) - (cubez / 2), rotateY: -90, translateZ: (cubeheight / 2) }, 0);//左
        $('#' + cubename + '_4').velocity({ translateY: (cubeheight / 2) - (cubez / 2), rotateY: 90, translateZ: cubewidth - (cubeheight / 2) }, 0);//右


        $('#' + cubename + '_6').velocity({ translateY: (cubeheight / 2) - (cubez / 2), translateZ: (cubeheight / 2) }, 0);//前
        $('#' + cubename + '_3').velocity({ translateY: (cubeheight / 2) - (cubez / 2), rotateY: 180, translateZ: (cubeheight / 2) }, 0);//後


        //z控制位置，方向，測度
        //xyz控制旋轉
        /*
            $('#' + cubename + '_xyz').css('border', '1px solid red');
        $('#' + cubename + '_z').css('border', '1px solid green');
        $('#' + cubename + '_z').velocity({ rotateX: -50, rotateY: -35 }, 1000).velocity({
            complete: function () {
                $('#' + cubename + '_xyz').velocity({ rotateZ: 360 }, 1000).velocity({ rotateZ: 720 }, 1000)
            }
        })
        */



        if (cubefunc != null) {
            window[cubefunc](cubename);
        }
    }
    //===貼上3D方塊

    function arraytostring(arraytostring_ar) {
        var output_ar = '';
        for (var i = 0; i < arraytostring_ar.length ; i++) {
            if (i == arraytostring_ar.length - 1) {
                output_ar += '\'' + arraytostring_ar[i] + '\'';
            } else {
                output_ar += '\'' + arraytostring_ar[i] + '\'|';
            }
        }
        return output_ar;
    }

    //---20180818 Jtest
    //filter 出來需要的陣列，進行修改時還是對來源obj做修改
    /*
    var filterObj = object_ar.filter(function(e) {
        return e.Name.indexOf('3')>-1;
    });
    */

    //取object 的keys
    //console.log(Object.keys(filterObj[0]));

    //按下Ctrl + h ， 出現取代視窗 下面的使用Regular Expression 要記得點開，\x0D\x0A 代表\r\n ，取代成空白就合併成1行了
    //取出csv內容，存成string: fdarstr: `a1|a2,ab中|a3 |a4`b1 |b2|b3|b4`asdf|123|45|779`a|1|2|9`a|3|4|9`a|5|6|9`a3|5|6|9


    //filter 出來需要的陣列，進行修改時還是對來源obj做修改
    /*
    var filterObj = object_ar.filter(function(e) {
        return e.Name.indexOf('3')>-1;
    });
    */

    //取object 的keys
    //console.log(Object.keys(filterObj[0]));

    //按下Ctrl + h ， 出現取代視窗 下面的使用Regular Expression 要記得點開，\x0D\x0A 代表\r\n ，取代成空白就合併成1行了
    //取出csv內容，存成string: fdarstr: `a1|a2,ab中|a3 |a4`b1 |b2|b3|b4`asdf|123|45|779`a|1|2|9`a|3|4|9`a|5|6|9`a3|5|6|9

    //divobj.setProp(id, left, top, width, height, fontsize, color, content, value, title, imgsrc);
    /*註解: div元件操作 */
    function adddivobj() {
        var obj = {
            id: 'obj_1',
            left: 10,
            top: 10,
            width: 100,
            height: 100,
            fontsize: 20,
            color: 'white',
            bdcolor: '',
            bdsize: 1,
            //顯示內容
            content: '內容',
            //設定值
            value: '',
            //取值用
            title: '',
            align: 'center',
            appendtext: '',
            //background-image URL路徑/ # ,rgb( , rgba( 轉background-color
            imgsrc: 'img/blank.png',
            radius: '',
            hidden: false,
            editmode: '',
            maxlen: 0,
            setProp: function (id, left, top, width, height, fontsize, color, content, value, title, imgsrc, align, radius, hidden, fontfamily, bdcolor, bdsize, editmode, maxlen, editmult) {
                /// <summary>傳入object自動產生內容</summary>
                /// <param name="hidden">bool 是否隱藏</param>
                /// <param name="radius">int 圓角</param>
                /// <param name="align">str left/center對齊</param>
                /// <param name="content">str 內容</param>
                /// <param name="color">str 文字顏色</param>
                /// <param name="imgsrc">str 背景顏色: 色碼/圖檔路徑</param>
                /// <param name="fontfamily">str 字型設定</param>
                /// <param name="bdcolor">str 外框顏色</param>
                /// <param name="bdsize">int 外框大小</param>
                /// <param name="value">str 值</param>
                /// <param name="title">str 抬頭對應中文方便抓值</param>
                /// <param name="editmode">str 有值為文字框，值帶入placeholder</param>
                /// <param name="maxlen">int 搭配文字模式使用，輸入長度限制: 0 不限制</param>
                /// <param name="editmult">bool 搭配文字模式使用，是否多行</param>


                /// <returns></returns>
                //先還原預設，避免吃到上一個人的
                obj.id = 'obj_1';
                obj.left = 10;
                obj.top = 10;
                obj.width = 100;
                obj.height = 100;
                obj.fontsize = 20;
                obj.color = 'white';
                obj.content = '內容';
                obj.value = '';
                obj.fontfamily = 'Calibri,微軟正黑體';
                obj.position = 'absolute';
                obj.imgsrc = 'img/blank.png';
                obj.title = '';//title 拿來當屬性判斷用，不可繼承，每次產生必需為空
                obj.radius = '';
                obj.hidden = false;
                obj.bdcolor = '';
                obj.bdsize = 1;
                obj.editmode = '';
                obj.align = 'center',
                obj.editmult = false,


                (id != undefined) ? obj.id = id : '';
                (left != undefined) ? obj.left = left : '';
                (top != undefined) ? obj.top = top : '';
                (width != undefined) ? obj.width = width : '';
                (height != undefined) ? obj.height = height : '';
                (fontsize != undefined) ? obj.fontsize = fontsize : '';
                (color != undefined) ? obj.color = color : '';
                (content != undefined) ? obj.content = content : '';
                (value != undefined) ? obj.value = value : '';
                (title != undefined) ? obj.title = title : '';
                (imgsrc != undefined) ? obj.imgsrc = imgsrc : '';
                (align != undefined) ? obj.align = align : '';
                (radius != undefined) ? obj.radius = radius : '';
                (hidden != undefined) ? obj.hidden = hidden : '';
                (fontfamily != undefined) ? obj.fontfamily = fontfamily : '';
                (bdcolor != undefined) ? obj.bdcolor = bdcolor : '';
                (bdsize != undefined) ? obj.bdsize = bdsize : '';
                (editmode != undefined) ? obj.editmode = editmode : '';
                (maxlen != undefined) ? obj.maxlen = maxlen : '';
                (editmult != undefined) ? obj.editmult = editmult : '';


                this.appendtext += this.append();
            },
            fontfamily: 'Calibri,微軟正黑體',
            // relative ,absolute
            position: 'absolute',
            append: function (parentid) {
                /// <summary>貼入容器ID，不傳parentid 則回傳appendstr，做整批貼上用</summary>
                /// <summary> //append(id)，貼到容器上，appendtext清掉最後一個setProp的obj</summary>
                /// <summary> //append()回傳 最後一個setProp的obj的appendstr;</summary>
                /// <summary> //appendtemp(id)貼到容器上，清空全部obj的appendstr;</summary>
                /// <param name="min" type="int">亂數起點</param>
                /// <param name="max" type="int">亂數終點</param>

                //var appendstr = '<div id="' + obj.id + '" style="position:' + obj.position + ';left:' + obj.left + 'px;top:' + obj.top + 'px;overflow-x:hidden;overflow-y:auto;width:' + obj.width + 'px;height:' + obj.height + 'px;background-image:url(\'' + obj.imgsrc + '\');background-repeat:no-repeat;background-size:100% 100%;font-size:' + obj.fontsize + 'px;font-family:' + obj.fontfamily + ';color:' + obj.color + '" >';
                //---20181008 底色、img判斷
                var appendstr = '<div id="' + obj.id + '" style="position:' + obj.position + ';left:' + obj.left + 'px;top:' + obj.top + 'px;overflow-x:hidden;overflow-y:hidden;width:' + obj.width + 'px;height:' + obj.height + 'px;';
                (obj.imgsrc.indexOf('data:image/jpeg') > -1 || obj.imgsrc.indexOf('data:image/png') > -1 || obj.imgsrc.indexOf('.png') > -1 || obj.imgsrc.indexOf('.jpg') > -1 || obj.imgsrc.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + obj.imgsrc + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (obj.imgsrc.indexOf('#') == 0 || obj.imgsrc.indexOf('rgb(') == 0 || obj.imgsrc.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + obj.imgsrc + ';' : '';
                //===20181008 底色、img判斷
                appendstr += 'font-size:' + obj.fontsize + 'px;font-family:' + obj.fontfamily + ';color:' + obj.color + ';' + (obj.radius != '' ? '-webkit-border-radius: ' + obj.radius + 'px;' : '') + ';' + (obj.bdcolor != '' ? 'border:' + (obj.bdsize) + 'px solid ' + obj.bdcolor + ';' : '') + '" ' + (obj.hidden ? 'hidden="hidden" ' : '') + ' >';
                if (this.editmode != '') {
                    if (this.editmult) {
                        appendstr += '<textarea id="' + obj.id + '_textarea" style="width:' + obj.width + 'px;height:' + obj.height + 'px;text-align:' + obj.align + ';font-size:' + this.fontsize + 'px" value="' + obj.value + '" ' + obj.title + ' placeholder="' + this.editmode + '" ' + (parseInt(this.maxlen) > 0 ? 'maxlength=' + this.maxlen : '') + ' ></textarea></div>';
                    } else {
                        appendstr += '<input id="' + obj.id + '_input" type="text" style="color:' + obj.color + ';width:' + obj.width + 'px;height:' + obj.height + 'px;text-align:' + obj.align + ';font-size:' + this.fontsize + 'px" value="' + obj.value + '" ' + obj.title + ' placeholder="' + this.editmode + '" ' + (parseInt(this.maxlen) > 0 ? 'maxlength=' + this.maxlen : '') + ' ></div>';
                    }

                } else {
                    //appendstr += '<div style="width:' + obj.width + 'px;height:' + obj.height + 'px;display:table-cell;vertical-align:middle;text-align:' + obj.align + ';white-space:pre;word-break:keep-all" value="' + obj.value + '" ' + obj.title + '>' + obj.content + '</div></div>';//不換行設定
                    appendstr += '<div style="width:' + obj.width + 'px;height:' + obj.height + 'px;display:table-cell;vertical-align:middle;text-align:' + obj.align + ';white-space:pre-wrap;pre-break:break-all" value="' + obj.value + '" ' + obj.title + '>' + obj.content + '</div></div>';//換行設定
                }

                //white-space:pre-wrap 換行
                //white-space:pre 不換行

                //adddivobj/addtextobj append，不傳parentid 則回傳appendstr，做整批貼上用
                if ((parentid || '') == '') {
                    return appendstr;
                } else {
                    this.appendtext = this.appendtext.replace(appendstr, '');//有append了，把自己replace掉
                    $('#' + parentid).append(appendstr);
                }

            },
            appendtemp: function (parentid) {
                /// <summary>把累積到現在的appendtext 貼出去，然後清空</summary>
                /// <param name="parentid" type="str">容器</param>
                $('#' + (parentid || 'body_div')).append(this.appendtext);
                this.appendtext = '';
            }
        }
        return obj;
    }

    //---checkbox by div

    /*註解: 選擇元件 */
    function addchkobj(optionar, valuear, defaultval) {
        /// <summary>增加選擇物件</summary>
        /// <summary>var objchkdiv = addchkobj([6, 7, 8, 9, 10], [1, 2, 3, 4, 5]);</summary>
        /// <summary>objchkdiv.setProp('dv_difc', 100, 120, 5, false, 40)</summary>
        /// <summary>抓回傳值: $('#tgid').attr('value')</summary>
        /// <param name="optionar">陣列 :[1,2,3,4,5]，顯示的內容</param>
        /// <param name="valuear">陣列 :[1,2,3,4,5]，對應的回傳值</param>
        /// <param name="defaultval">陣列 :[1,2]預設已選的值</param>
        var obj = {
            id: 'chkobj_1',
            /*註解: relative ,absolute */
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            /*註解: 每行顯示個數 */
            cols: 1,
            /*註解: 是複選 */
            ismult: false,
            fontsize: 20,
            /*註解: background-image URL路徑 */
            imgsrcn: '#16a765',
            imgsrcy: '#fad165',
            /*註解: 顯示文字內容 */
            /*註解: 字體 ex: 微軟正黑體,Arial,Times New Roman */
            fontfamily: 'Calibri,微軟正黑體',
            /*註解: 文字顏色 */
            title: '',
            setProp: function (id, left, top, width, height, cols, ismult, fontsize, imgsrcn, imgsrcy, title) {
                (id != undefined) ? obj.id = id : '';
                (left != undefined) ? obj.left = left : '';
                (top != undefined) ? obj.top = top : '';
                (width != undefined) ? obj.width = width : '';
                (height != undefined) ? obj.height = height : '';
                (cols != undefined) ? obj.cols = cols : '';
                (ismult != undefined) ? obj.ismult = ismult : '';
                (fontsize != undefined) ? obj.fontsize = fontsize : '';
                (imgsrcn != undefined) ? obj.imgsrcn = imgsrcn : '';
                (imgsrcy != undefined) ? obj.imgsrcy = imgsrcy : '';
                (title != undefined) ? obj.title = title : '';

            },
            //貼入容器ID，必傳
            append: function (parentid) {

                var appendstr = '';
                appendstr += '<table id="' + obj.id + '" value="" ' + obj.title + ' style="position:absolute;left:' + obj.left + 'px;top:' + obj.top + 'px;" >'

                $.each(optionar, function (i, optionar_val) {
                    (i == 0) ? appendstr += '<tr>' : '';
                    appendstr += '<td>';
                    appendstr += '<div id="' + obj.id + '_' + i + '" style="width:' + obj.width + 'px;height:' + obj.height + 'px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:break-all;background-color:' + obj.imgsrcn + ';padding:0px;font-size:' + obj.fontsize + 'px;border:3px solid white" imgy="' + obj.imgsrcy + '" imgn="' + obj.imgsrcn + '" value="' + valuear[i] + '">'
                    //appendstr += '<div id="' + obj.id + '_' + i + '" style="width: ' + obj.width + 'px; height: ' + obj.height + 'px; display: table-cell; vertical-align: middle; text-align: center; white-space: pre; word-break: keep-all;background-color:' + obj.imgsrcn + ';font-size:' + obj.fontsize + 'px;border:3px solid white" imgy="' + obj.imgsrcy + '" imgn="' + obj.imgsrcn + '" value="' + valuear[i] + '">';
                    appendstr += (optionar_val == undefined) ? '' : optionar_val;
                    appendstr += '</div>'
                    appendstr += '</td>';

                    ((i + 1) % obj.cols == 0) ? appendstr += '</tr><tr>' : '';
                });
                appendstr += '</table>';
                $('#' + parentid).append(appendstr);

                if (defaultval != undefined) {
                    $.each(defaultval, function (i, defaultval_val) {
                        $('#' + obj.id + ' [value=' + defaultval_val + ']').each(function (j) {
                            //$(this).css('background-color', $(this).attr('imgy'));
                            $(this).css('border', '2px solid ' + $(this).attr('imgy'));
                            $(this).attr('selected', 'selected');
                        })
                    });

                    var valuestr = '';

                    $('#' + obj.id + ' div[selected=selected]').each(function (i) {
                        valuestr += $(this).attr('value');
                        valuestr += ',';
                    });
                    (valuestr.length > 0) ? valuestr = valuestr.substr(0, valuestr.length - 1) : '';
                    $('#' + obj.id).attr('value', valuestr);
                }
                //option selected 事件綁定
                $.each(optionar, function (i, optionar_val) {
                    document.getElementById(obj.id + '_' + i).addEventListener(eventup, function (event) {
                        var tgid = event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_'));

                        if ($(this).attr('selected') == 'selected') {
                            //$(this).css('background-color', $(this).attr('imgn'));
                            if (defaultval == undefined) {//沒有預設值的，才允許取消選取
                                $(this).css('border', '3px solid white');
                                $(this).removeAttr('selected');
                            }

                        } else {
                            if (!obj.ismult) {//不允許複選
                                var cnt = 0;

                                while ($('#' + tgid + '_' + cnt).length > 0) {
                                    $('#' + tgid + '_' + cnt).removeAttr('selected');
                                    //$('#' + tgid + '_' + cnt).css('background-color', $(this).attr('imgn'));
                                    $('#' + tgid + '_' + cnt).css('border', '3px solid white');

                                    cnt += 1;
                                }
                            }
                            //$(this).css('background-color', $(this).attr('imgy'));
                            $(this).css('border', '3px solid ' + $(this).attr('imgy'));
                            $(this).attr('selected', 'selected');
                        }

                        var valuestr = '';

                        $('#' + tgid + ' div[selected=selected]').each(function (i) {
                            valuestr += $(this).attr('value');
                            valuestr += ',';
                        });
                        (valuestr.length > 0) ? valuestr = valuestr.substr(0, valuestr.length - 1) : '';
                        //return 值用,隔開掛在 table上
                        $('#' + tgid).attr('value', valuestr);
                        obj.selectedfunc(event);

                    });
                });
            },
            selectedfunc: function (event) {

            }
        }
        return obj;
    }
    //===checkbox by div


    function addtextobj() {
        var obj = {
            id: 'obj_1',
            title: '',
            left: 10,
            top: 10,
            width: 100,
            height: 100,
            /*註解: disabled: true , false */
            disabled: false,
            /*註解: visable: true , false */
            visable: true,
            /*註解: 文字位置: left ,right ,center */
            align: 'center',
            fontsize: 20,
            /*註解: 顯示文字內容 */
            content: '',
            /*註解: 字體 ex: 微軟正黑體,Arial,Times New Roman */
            fontfamily: 'Calibri,微軟正黑體',
            /*註解: 文字顏色 */
            color: 'gray',
            //type : string 不限制 , int 正整數 ,number 帶小數點正數
            type: 'string',
            /*註解: relative ,absolute */
            position: 'absolute',
            maxlength: 40,
            appendtext: '',
            setProp: function (id, title, left, top, width, height, content, fontsize, color, align, disabled, visable, type) {
                //先還原預設，避免吃到上一個人的
                obj.id = 'obj_1',
                obj.title = '';//title 拿來當屬性判斷用，不可繼承，每次產生必需為空
                obj.left = 10,
                obj.top = 10,
                obj.width = 100,
                obj.height = 100,
                obj.fontsize = 20,
                obj.color = 'gray',
                obj.content = '',
                obj.value = '',
                obj.fontfamily = 'Calibri,微軟正黑體',
                obj.position = 'absolute',
                obj.type = 'string',
                obj.disabled = false,
                obj.visable = true,
                obj.align = 'center',

                (id != undefined) ? obj.id = id : '';
                (title != undefined) ? obj.title = title : '';
                (left != undefined) ? obj.left = left : '';
                (top != undefined) ? obj.top = top : '';
                (width != undefined) ? obj.width = width : '';
                (height != undefined) ? obj.height = height : '';
                (fontsize != undefined) ? obj.fontsize = fontsize : '';
                (color != undefined) ? obj.color = color : '';
                (content != undefined) ? obj.content = content : '';
                (align != undefined) ? obj.align = align : '';
                (disabled != undefined) ? obj.disabled = disabled : '';
                (visable != undefined) ? obj.visable = visable : '';
                (type != undefined) ? obj.type = type : '';
                this.appendtext += this.append();
            },
            /*註解: 貼入容器ID */
            append: function (parentid) {
                var appendstr = '<input type="text" id="' + obj.id + '" ' + obj.title + '  value="' + obj.content + '" style="text-align:' + obj.align + ';position:' + obj.position + ';left:' + obj.left + 'px;top:' + obj.top + 'px;width:' + obj.width + 'px;height:' + obj.height + 'px;font-size:' + obj.fontsize + 'px;font-family:' + obj.fontfamily + ';color:' + obj.color + '" ' + (obj.disabled ? 'disabled="disabled"' : '') + ' maxlength=' + obj.maxlength + ' ' + (obj.visable ? '' : 'hidden="hidden"') + ' ' + (obj.type == 'int' ? 'onkeyup="keyupisint(event)"' : '') + ' ' + (obj.type == 'number' ? 'onkeyup="keyupisnumber(event)"' : '') + ' >';
                if ((parentid || '') == '') {
                    return appendstr;
                } else {
                    this.appendtext = this.appendtext.replace(appendstr, '');//有append了，把自己replace掉
                    $('#' + parentid).append(appendstr);
                }
            },
        }
        return obj;
    }

    //var itemobj = findstrval_object(fdarstr);
    //console.log(itemobj[1]);

    //var savestr = findstrval_object2str(itemobj);
    //savetxt('123.txt', savestr);

    //字串轉Object: 行頭`,分隔_,
    function findstrval_object(str) {
        //object ,第1行固定prop
        var str_ar = str.substring(1, str.length).split('`');
        var object_ar = [];
        var propar = [];
        var cnt = 0;
        $.each(str_ar, function (i, str_arVal) {
            if (i == 0) {
                propar = str_arVal.split('¯');
                if (str_ar.length == 1) {//只有1筆，傳入表頭
                    var objtemp = {};
                    var propValue_Ar = str_arVal.split('¯');
                    $.each(propar, function (j, propar_val) {
                        objtemp[propar[j]] = propValue_Ar[j];
                    });
                    object_ar.push(objtemp);
                }
            } else {
                var objtemp = {};
                var propValue_Ar = str_arVal.split('¯');
                $.each(propar, function (j, propar_val) {
                    objtemp[propar[j]] = propValue_Ar[j];
                });
                object_ar.push(objtemp);
            }
        });
        return object_ar;
    }


    //Object轉字串: 行頭`,分隔_,
    function findstrval_object2str(obj, skipkey) {
        (skipkey == undefined) ? skipkey = false : '';
        var retstr = '';
        var keyar = Object.keys(obj[0]);
        if (!skipkey) {
            
            retstr += '`';
            $.each(keyar, function (i, keyar_val) {//標頭處理
                retstr += keyar_val + '¯';

            });

            retstr = retstr.substring(0, retstr.length - 1);
        }
        

        $.each(obj, function (i, obj_val) {
            retstr += '`';
            $.each(keyar, function (j, keyar_val) {
                retstr += replaceAll(replaceAll(String((obj_val[keyar_val] == undefined ? '' : obj_val[keyar_val])), '¯', ''), '`', '') + '¯';
            });
            retstr = retstr.substring(0, retstr.length - 1);
        });

        return retstr;

    }



    //fdarstr = null;


    /*
    //字串出現次數
    console.log(stridxcnt(fdarstr, '`'));

    //取第1欄完全相同第1筆
    var retstr = findstrval_first('1', fdarstr);
    console.log('取第1欄完全相同第1筆: ' + retstr);

    fdarstr = replaceAll(fdarstr, retstr, 'a2_500_#t1#t2#t4_a2content');
    console.log('replaceAll: ' + fdarstr);

    //取第1欄完全相同，全部
    var sssall = findstrval_first_match('a1', fdarstr);
    console.log('取第1欄完全相同，全部: ' + sssall);

    //取第1欄部份相同，全部
    var ssslike = findstrval_first_like('a2', fdarstr);
    console.log('取第1欄部份相同，全部: ' + ssslike);

    //取部份相同，全部
    var sssalllike = findstrval_all_like('8', fdarstr);
    console.log('取部份相同，全部: ' + sssalllike);

    //取特定欄部份，全部
    var sssidxlike = findstrval_idx_like('50', fdarstr, 1);
    console.log('取特定欄部份，全部: ' + sssidxlike);

    //取特定欄，數字比較
    var sssidxlike = findstrval_idx_int(100, fdarstr, 1, '>');
    console.log('取特定欄，數字比較: ');
    console.log(sssidxlike.split('`'));

    //逐一跑遍字串
    findstrval_run(fdarstr);
    */

    //---字串取值, 行頭`,分隔_
    function findstrval_first(id, str) {//只取第一筆完全符合
        var rtnstr = '';
        var startidx = str.indexOf('`' + id + '¯') + 1;
        if (startidx > 0) {//有值
            var endidx = str.indexOf('`', startidx);
            if (endidx < 0) {//沒值，最後一筆
                endidx = str.length;
            }
            //console.log(startidx + ',' + endidx);
            rtnstr = str.substring(startidx, endidx);
        }
        return rtnstr;
    }

    //取全部第一筆，完全符回
    function findstrval_first_match(id, str) {
        var rtnstr = '';
        var cnt = 0;
        while (str.length > 0) {
            //console.log(cnt + ': ' + str);
            //cnt += 1;
            var startidx = str.indexOf('`' + id + '¯') + 1;
            if (startidx > 0) {//有值
                var endidx = str.indexOf('`', startidx);
                if (endidx < 0) {//沒值，最後一筆
                    endidx = str.length;
                }
                rtnstr += '`' + str.substring(startidx, endidx);
                //console.log('剪前:'+str);
                str = str.substring(endidx, str.length);
                //console.log('剪後:' + str);
            } else {
                //rtnstr += str;
                str = '';
            }
        }
        return rtnstr;
    }

    //取全部第一筆，包含str
    function findstrval_first_like(id, str) {
        var rtnstr = '';
        var cnt = 0;
        while (str.length > 0) {
            var startidx = str.indexOf('`') + 1;
            if (startidx > 0) {//有值
                var endidx = str.indexOf('`', startidx);
                if (endidx < 0) {//沒值，最後一筆
                    endidx = str.length;
                }
                var tempstr = str.substring(startidx, str.indexOf('¯'))
                if (tempstr.indexOf(id) > -1) {
                    rtnstr += '`' + str.substring(startidx, endidx);
                }
                str = str.substring(endidx, str.length);
            } else {
                str = '';
            }
        }

        return rtnstr;
    }

    //取全部，任一欄包含str
    function findstrval_all_like(id, str) {
        var rtnstr = '';
        var cnt = 0;
        while (str.length > 0) {
            var startidx = str.indexOf('`') + 1;
            if (startidx > 0) {//有值
                var endidx = str.indexOf('`', startidx);
                if (endidx < 0) {//沒值，最後一筆
                    endidx = str.length;
                }
                var tempstr = str.substring(startidx, endidx);
                if (tempstr.indexOf(id) > -1) {
                    rtnstr += '`' + tempstr;
                }
                str = str.substring(endidx, str.length);
            } else {
                str = '';
            }
        }

        return rtnstr;
    }

    //取全部，特定欄包含str
    function findstrval_idx_like(id, str, idx) {
        var rtnstr = '';
        var cnt = 0;
        while (str.length > 0) {
            var startidx = str.indexOf('`') + 1;
            if (startidx > 0) {//有值
                var endidx = str.indexOf('`', startidx);
                if (endidx < 0) {//沒值，最後一筆
                    endidx = str.length;
                }
                var tempstr = str.substring(startidx, endidx);
                var tempstr1 = tempstr.split('¯')[idx] || '';
                if (tempstr1.indexOf(id) > -1) {
                    rtnstr += '`' + tempstr;
                }
                str = str.substring(endidx, str.length);
            } else {
                str = '';
            }
        }
        return rtnstr;
    }

    //取全部，特定欄，數字比較
    function findstrval_idx_int(id, str, idx, comp) {
        var rtnstr = '';
        var cnt = 0;
        while (str.length > 0) {
            var startidx = str.indexOf('`') + 1;
            if (startidx > 0) {//有值
                var endidx = str.indexOf('`', startidx);
                if (endidx < 0) {//沒值，最後一筆
                    endidx = str.length;
                }
                var tempstr = str.substring(startidx, endidx);
                var tempstr1 = tempstr.split('¯')[idx] || '';
                if (comp == '>' && tempstr1 != '') {//大於
                    if (parseFloat(tempstr1) > parseFloat(id)) {
                        rtnstr += '`' + tempstr;
                    }
                } else if (comp == '<' && tempstr1 != '') {//小於
                    if (parseFloat(tempstr1) < parseFloat(id)) {
                        rtnstr += '`' + tempstr;
                    }
                } else if (comp == '=' && tempstr1 != '') {//等於
                    if (parseFloat(tempstr1) == parseFloat(id)) {
                        rtnstr += '`' + tempstr;
                    }
                }

                str = str.substring(endidx, str.length);
            } else {
                str = '';
            }
        }

        return rtnstr;
    }

    //字串: 行頭`,分隔_，逐一執行
    function findstrval_run(str) {
        var cnt = 0;
        while (str.length > 0) {
            var startidx = str.indexOf('`') + 1;
            if (startidx > 0) {//有值
                var endidx = str.indexOf('`', startidx);
                if (endidx < 0) {//沒值，最後一筆
                    endidx = str.length;
                }
                rtnstr = '`' + str.substring(startidx, endidx);
                console.log(cnt + ': ' + rtnstr);
                cnt += 1;
                str = str.substring(endidx, str.length);

            } else {
                //rtnstr += str;
                str = '';
            }
        }
    }
    //===字串取值, 行頭`,分隔_


    //---CSV to Array

    //csv轉陣列,filename 檔案名稱
    //excel存文字檔(tab隔開),打開txt,編碼改unicode,副檔名改csv
    function csvReadLine(filename) {
        var retstr = '';
        $.ajax({
            type: "GET", url: filename, cache: false, async: false,
            success: function (str) {
                retstr = replaceAll("`" + replaceAll(replaceAll(replaceAll(replaceAll(replaceAll(str, "\r\n", "`"), "\n", "`"), "\t", '¯'), '_"', '¯'), '"_', '¯'), '`"', '`');
                retstr = retstr.substring(retstr, retstr.length - 1);
                //加壓縮
                console.log(retstr);
                retstr = LZString.compressToEncodedURIComponent(retstr);

                
            }
        });

        return retstr;
    }

    //===CSV to Array

    //---字串取代全部
    //console.log(fdarstr);
    //console.log(replaceAll(fdarstr, 'a1', 'ddd'));

    //console.log(replaceAll('`a1|a2,ab中|a3 |a4`b1 |b2|b3|b4`asdf|123|45|779`a|1|2|9`a|3|4|9`a|5|6|9`a3|5|6|9', '|', '¯'));
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

    //字串出現次數
    function stridxcnt(str, orgstr) {
        var cnt = 0;
        while (str.indexOf(orgstr) > -1) {
            cnt += 1;
            str = str.substring(str.indexOf(orgstr) + orgstr.length, str.length);
        }
        return cnt;
        /*
        var re = new RegExp(orgstr, 'g');
        return str.match(re).length;
        */
    }
    //===字串取代全部

    //---日期選擇器
    //日期選擇器
    //---日期選擇
    /*
    //var daystr = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate();

     document.getElementById('dtpk_dtstr').addEventListener(eventup, function (event) {
     //日期格式 2018-08-10
                    datetimepicker.init($(event.currentTarget).val(), event.currentTarget.id);
                })
    */
    //日期選擇器
    var datetimepicker = {
        //init, 傳入預設日期字串，回傳目標id
        init: function (datestr, tgid) {
            var divobj = adddivobj();
            var textobj = addtextobj();
            var appendtext = '';

            //預設帶入今天
            //var daystr = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate() + ',' + (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
            //var daystr = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate();

            //var d = new Date("2016-05-05,09:09:01");
            //javascript 允許日期最大至31天不報錯，超過月份最大天數自動進位，dd+1判斷月份!=NaN && 月份==mm
            var Today = new Date(datestr) || new Date();
            //var Today = new Date();

            var yy = Today.getFullYear();
            textobj.id = 'dtpk_yy';
            textobj.left = 200;
            textobj.top = 10;
            textobj.height = 90;
            textobj.width = 90;
            textobj.align = 'center';
            textobj.content = yy;
            appendtext += textobj.append();

            var mm = (Today.getMonth() + 1);
            textobj.id = 'dtpk_mm';
            textobj.left = 300;
            textobj.top = 10;
            textobj.height = 90;
            textobj.width = 90;
            textobj.content = mm;
            appendtext += textobj.append();

            var dd = Today.getDate();
            textobj.id = 'dtpk_dd';
            textobj.left = 400;
            textobj.top = 10;
            textobj.height = 90;
            textobj.width = 90;
            textobj.content = dd;
            appendtext += textobj.append();


            var hh = Today.getHours()
            var mn = Today.getMinutes()
            var ss = Today.getSeconds();
            //星期日 =0
            var days = Today.getDay();

            var maxdaystr = yy + '-' + (mm < 10 ? '0' : '') + mm + '-' + (dd < 10 ? '0' : '') + dd + ',' + (hh < 10 ? '0' : '') + hh + ':' + (mn < 10 ? '0' : '') + mn + ':' + (ss < 10 ? '0' : '') + ss;

            //console.log("今天日期是 " + yy + " 年 " + mm + " 月 " + dd + " 日 " + hh + " 時 " + mn + " 分 " + ss + " 秒 星期 " + days);
            //console.log(maxdaystr);

            var maxday = new Date(maxdaystr);
            //console.log(maxday);
            maxday.setMonth(maxday.getMonth() + 1);
            maxday.setDate(1);
            maxday.setDate(maxday.getDate() - 1);
            //console.log(maxday);
            var maxdd = maxday.getDate();
            maxday.setDate(1);
            var maxdays = maxday.getDay();
            //console.log('星期:' + maxdays);

            //回傳日期的textboxid
            textobj.id = 'dtpk_target';
            textobj.left = 200;
            textobj.top = 10;
            textobj.height = 90;
            textobj.width = 200;
            textobj.align = 'center';
            textobj.content = tgid;
            textobj.visable = false;
            appendtext += textobj.append();

            //日期容器，單獨append
            divobj.id = 'dtpk_container';
            divobj.height = 1280;
            divobj.width = 720;
            divobj.left = 0;
            divobj.top = 0;
            divobj.content = '';
            divobj.append('div1');

            //日期列表，單獨append
            divobj.id = 'dtpk_container1';
            divobj.height = 600;
            divobj.width = 700;
            divobj.left = 0;
            divobj.top = 100;
            divobj.content = '';
            divobj.append('dtpk_container');
            var dtstr = ['日', '一', '二', '三', '四', '五', '六'];
            var dateappendtext = '';
            for (var i = 0; i < 7; i++) {
                divobj.id = 'dtpkl_' + i;
                divobj.height = 85;
                divobj.width = 85;
                divobj.left = (((i) * divobj.width) % (divobj.width * 7));
                divobj.top = (0);
                divobj.content = (dtstr[i]);
                dateappendtext += divobj.append();
            }

            for (var i = 0; i < maxdd; i++) {
                divobj.id = 'dtpkn_' + i;
                divobj.height = 85;
                divobj.width = 85;
                divobj.left = (((maxdays + i) * divobj.width) % (divobj.width * 7));
                divobj.top = (Math.ceil(((maxdays + 1) + i) / 7) * divobj.height);
                divobj.content = (i + 1);
                dateappendtext += divobj.append();
            }
            $('#dtpk_container1').append(dateappendtext);
            document.getElementById('dtpk_container1').addEventListener(eventup, function (event) {
                var parenttg = $(event.target).parent();
                if (parenttg.attr('id').indexOf('dtpkn_') > -1) {
                    $('#dtpk_dd').val($(event.target).html());
                    //$('#dtpk_container1').find('div').each(function (i) {
                    //console.log($('#dtpk_container1 > div').length); //抓第1層
                    $('#dtpk_container1 > div').each(function (i) {
                        if ($(this).attr('id') != undefined) {
                            if ($(this).attr('id').indexOf('dtpkn_') > -1) {
                                //取消被選擇樣式
                                $(this).css('border', '0px');
                            }
                        }
                    })
                    //被選擇樣式修改
                    parenttg.css('border', '1px solid blue');
                }
            })

            //上個月
            divobj.id = 'dtpk_prev';
            divobj.left = 10;
            divobj.top = 10;
            divobj.height = 80;
            divobj.width = 80;
            divobj.content = '<';
            appendtext += divobj.append();

            //下個月
            divobj.id = 'dtpk_next';
            divobj.left = 100;
            divobj.top = 10;
            divobj.height = 80;
            divobj.width = 80;
            divobj.content = '>';
            appendtext += divobj.append();
            //確認
            divobj.id = 'dtpk_submit';
            divobj.left = 620;
            divobj.top = 1180;
            divobj.height = 80;
            divobj.width = 80;
            divobj.content = '確認';
            appendtext += divobj.append();

            //取消
            divobj.id = 'dtpk_cancel';
            divobj.left = 10;
            divobj.top = 1180;
            divobj.height = 80;
            divobj.width = 80;
            divobj.content = '取消';
            appendtext += divobj.append();


            $('#dtpk_container').append(appendtext);
            $('#dtpk_yy,#dtpk_mm,#dtpk_dd').attr('readonly', 'readonly');

            document.getElementById('dtpk_prev').addEventListener(eventup, function (event) {
                datetimepicker.next(-1);
            })

            document.getElementById('dtpk_next').addEventListener(eventup, function (event) {
                datetimepicker.next(+1);
            })

            /*
            一月: January ( Jan. )
    二月: February ( Feb. )
    三月: March ( Mar. )
    四月: April ( Apr. )
    五月: May ( May)
    六月: June ( Jun.)
    七月: July ( Jul.)
    八月: August ( Aug. )
    九月: September ( Sep.)
    十月: October ( Oct. )
    十一月: November ( Nov.)
    十二月: December ( Dec.)
            */
            document.getElementById('dtpk_mm').addEventListener(eventup, function (event) {
                //月份選擇
                var select_dtpkmm = selectobjgen('select_dtpkmm', ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                    ['一月: January', '二月: February', '三月: March', '四月: April', '五月: May', '六月: June', '七月: July', '八月: August', '九月: September', '十月: October', '十一月: November', '十二月: December']);
                select_dtpkmm.dvhehgit = 10;
                select_dtpkmm.title = '請選擇月份';
                select_dtpkmm.ismult = false;
                select_dtpkmm.bgimg = 'img/blank.png';
                select_dtpkmm.append('dtpk_container');
                select_dtpkmm.okfunc = function () {//選擇完成執行事件
                    var result = replaceAll(replaceAll(this.rtnstr, '¯', ''), '`', '');
                    if (result == '') {//沒選不變更
                        //return false;
                    } else {
                        $('#dtpk_mm').val(result);
                        $('#dtpk_dd').val('01');
                        datetimepicker.next(0);
                    }

                }
            })

            document.getElementById('dtpk_yy').addEventListener(eventup, function (event) {
                //年份選擇
                var input_dtpkyy = inputobjgen('input_dtpkyy', [''], ['請輸入年份']);
                input_dtpkyy.dvhehgit = 10;
                input_dtpkyy.bgimg = 'img/blank.png';
                input_dtpkyy.append('dtpk_container');
                input_dtpkyy.okfunc = function () {//選擇完成執行事件
                    var result = replaceAll(replaceAll(this.rtnstr, '¯', ''), '`', '');
                    if (!jQuery.isNumeric(result) || parseInt(result) < 0) {//數字檢查，是數字，且>0
                        alert('請輸入數字');
                        return false;
                    } else {
                        $('#dtpk_yy').val(result);
                        $('#dtpk_dd').val('01');
                        datetimepicker.next(0);
                    }
                }
            })


            document.getElementById('dtpk_submit').addEventListener(eventup, function (event) {
                var tgid = $('#dtpk_target').val();
                var yy = $('#dtpk_yy').val();
                var mm = ($('#dtpk_mm').val().length == 1 ? '0' : '') + $('#dtpk_mm').val();
                var dd = ($('#dtpk_dd').val().length == 1 ? '0' : '') + $('#dtpk_dd').val();
                $('#' + tgid).val(yy + '-' + mm + '-' + dd);
                $('#dtpk_container').remove();
            })

            document.getElementById('dtpk_cancel').addEventListener(eventup, function (event) {
                $('#dtpk_container').remove();
            })
        },
        next: function (addmonth) {
            var divobj = adddivobj();
            var textobj = addtextobj();
            var appendtext = '';

            var yy = $('#dtpk_yy').val();
            var mm = $('#dtpk_mm').val();
            var dd = $('#dtpk_dd').val();
            var hh = '00';
            var mn = '00';
            var ss = '00';

            var maxdaystr = yy + '-' + (mm < 10 ? '0' : '') + mm + '-' + (dd < 10 ? '0' : '') + dd + ',' + (hh < 10 ? '0' : '') + hh + ':' + (mn < 10 ? '0' : '') + mn + ':' + (ss < 10 ? '0' : '') + ss;
            var maxday = new Date(maxdaystr);
            console.log(maxday);
            maxday.setMonth(maxday.getMonth() + (addmonth + 1));
            maxday.setDate(1);
            maxday.setDate(maxday.getDate() - 1);
            console.log(maxday);
            var maxdd = maxday.getDate();
            maxday.setDate(1);
            var maxdays = maxday.getDay();
            console.log('星期:' + maxdays);

            $('#dtpk_container1').html('');
            var dtstr = ['日', '一', '二', '三', '四', '五', '六'];
            var dateappendtext = '';
            for (var i = 0; i < 7; i++) {
                divobj.id = 'dtpkl_' + i;
                divobj.height = 85;
                divobj.width = 85;
                divobj.left = (((i) * divobj.width) % (divobj.width * 7));
                divobj.top = (0);
                divobj.content = (dtstr[i]);
                dateappendtext += divobj.append();
            }

            for (var i = 0; i < maxdd; i++) {
                divobj.id = 'dtpkn_' + i;
                divobj.height = 85;
                divobj.width = 85;
                divobj.left = (((maxdays + i) * divobj.width) % (divobj.width * 7));
                divobj.top = (Math.ceil(((maxdays + 1) + i) / 7) * divobj.height);
                divobj.content = (i + 1);
                dateappendtext += divobj.append();
            }

            console.log(maxday);
            $('#dtpk_container1').append(dateappendtext);
            $('#dtpk_yy').val(maxday.getFullYear());
            $('#dtpk_mm').val((maxday.getMonth() + 1));
            $('#dtpk_dd').val(maxday.getDate());
        }
    }
    //===日期選擇

    //---基本線圖
    /*
     var chartbasic1 = chartbasicgen();
                chartbasic1.data.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];//顯示個數
                chartbasic1.data.datasets.push({
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255, 99, 132,0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [1,2,3,4,5,6,7,8,9,10],//資料，超過顯示個數的不出現，縱軸值由陣最min,max決定
                    fill: false,//x軸填滿
                });
                chartbasic1.init('div1', 20);

                //更新資料
                setTimeout(function () {
                    chartbasic1.data.datasets[0] = {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255, 99, 132,0.5)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: [1, 2, 9, 4, 5, 6, 7, 8, 9, 10],//資料，超過顯示個數的不出現，縱軸值由陣最min,max決定
                        fill: false,//x軸填滿
                    };
                    chartbasic1.chart.update();
                }, 2000)
    */
    //基本線圖
    function chartbasicgen() {
        var config = {
            type: 'line',
            data: {
                labels: [],
                datasets: [

                ]
            },
            options: {
                responsive: false,
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            },
            init: function (parentid, wi) {
                parentid = parentid || '';
                wi = wi || '40';
                if (parentid == '') {
                    $('body').append('<div  style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                } else {
                    console.log('parentid1:' + parentid);
                    $('#' + parentid).append('<div style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                }

                var ctx = document.getElementById(parentid + 'chart-area').getContext('2d');
                this['chart'] = new Chart(ctx, config);
            }
        };

        return config;
    }

    //===

    //---水平bar圖
    /*
     var charthbar1 = charthbargen();
            //縱軸個數
            charthbar1.data.labels = ['', 'February', 'March', 'April', 'May', 'June', 'July'];
            charthbar1.data.datasets.push({
                label: 'Dataset 1',
                backgroundColor: 'rgba(255, 99, 132,0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                //橫軸個數0為中線軸，正負值分左右兩邊，水平顯示，最小值不顯示(橫軸原點...第1項填0跟空白)
                data: [0,1,2,3,4,5]
            })

            charthbar1.init('div1', 30);

            setTimeout(function () {
                //更新數據
                charthbar1.data.datasets[0] ={
                    label: 'Dataset 1',
                    backgroundColor: 'rgba(255, 99, 132,0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    data: [0, 5, 2,4, 3, 5]
                }
                charthbar1.chart.update();

                //增加chart
                var charthbar2 = charthbargen();
                charthbar2.data.labels = ['', 'February', 'March', 'April', 'May', 'June', 'July'];
                charthbar2.data.datasets.push({
                    label: 'Dataset 1',
                    backgroundColor: 'rgba(255, 99, 132,0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    data: [0, 1, 2, 3, 4, 5]
                })
                charthbar2.init('div2', 30);
            }, 2000);
    */
    //水平bar圖
    function charthbargen() {
        var horizontalBarChartData = {
            type: 'horizontalBar',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: false,
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Chart.js Horizontal Bar Chart'
                }
            },
            init: function (parentid, wi) {
                parentid = parentid || '';
                wi = wi || '40';
                if (parentid == '') {
                    $('body').append('<div  style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                } else {
                    //console.log('parentid1:' + parentid);
                    $('#' + parentid).append('<div  style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                }
                var ctx = document.getElementById(parentid + 'chart-area').getContext('2d');
                this['chart'] = new Chart(ctx, horizontalBarChartData);
            }
        };

        return horizontalBarChartData;
    }
    //===水平bar圖

    //---pie圖
    /*
                //---新增pie圖
                var chartpie1 = chartpiegen();
                chartpie1.data.datasets.push({
                    data: [1,2,3,4,5],
                    backgroundColor: ['rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)'],
                    label: 'Dataset 1'
                })
                chartpie1.data.labels = ['一','二','三','四','五'];

                chartpie1.init('div1', 90);
                //===新增pie圖

                //---更新數據
                setTimeout(function () {
                    chartpie1.data.datasets[0].data = [5, 2, 33, 43, 53];
                    chartpie1.chart.update();
                }, 2000);
    */
    //pie圖
    function chartpiegen() {
        var chartpie = {
            type: 'pie',
            data: {
                datasets: [],
                labels: []
            },
            options: {
                responsive: true
            },
            //---20180830
            //產生pie圖, parentid容器id/body,wi寬度%, dataar資料,colorar色碼, labelar標示　
            init: function (parentid, wi) {
                parentid = parentid || '';
                wi = wi || '40';
                if (parentid == '') {
                    $('body').append('<div id="canvas-holder" style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                } else {
                    //console.log('parentid1:' + parentid);
                    $('#' + parentid).append('<div id="canvas-holder" style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                }
                var ctx = document.getElementById(parentid + 'chart-area').getContext('2d');
                this['chart'] = new Chart(ctx, chartpie);
            }
            //===20180830
        };
        return chartpie;
    }
    //===pie圖

    //---pie 扇狀分開
    /*
    var chartpolar1 = chartpolargen();
            chartpolar1.data.datasets.push({
                data: [1, 2, 3, 4, 5, 6, 7],//data, backgroundColor, labels個數必需相符
                backgroundColor: [
                    'rgba(255, 99, 132,0.5)',
                'rgba(255, 159, 64,0.5)',
                'rgba(255, 205, 86,0.5)',
                'rgba(75, 192, 192,0.5)',
                'rgba(54, 162, 235,0.5)',
                'rgba(153, 102, 255,0.5)',
                'rgba(201, 203, 207,0.5)'
                ],
                label: 'My dataset' // for legend
            })
            chartpolar1.data.labels = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'purple', 'grey'];
            chartpolar1.init('div1', 20);


            setTimeout(function () {
                //更新數值
                chartpolar1.data.datasets[0].data=[1, 2, 7, 4, 5, 6, 7]
                chartpolar1.chart.update();

                //新圖表
                var chartpolar2 = chartpolargen();
                chartpolar2.data.datasets.push({
                    data: [1, 2, 3, 4, 5, 6, 7],//data, backgroundColor, labels個數必需相符
                    backgroundColor: [
                        'rgba(255, 99, 132,0.5)',
                    'rgba(255, 159, 64,0.5)',
                    'rgba(255, 205, 86,0.5)',
                    'rgba(75, 192, 192,0.5)',
                    'rgba(54, 162, 235,0.5)',
                    'rgba(153, 102, 255,0.5)',
                    'rgba(201, 203, 207,0.5)'
                    ],
                    label: 'My dataset' // for legend
                })
                chartpolar2.data.labels = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'purple', 'grey'];
                chartpolar2.init('div2', 20);
            }, 2000);
    */
    //pie 扇狀分開
    function chartpolargen() {
        var config = {
            data: {
                datasets: [],
                labels: []
            },
            options: {
                responsive: true,
                legend: {
                    position: 'right',
                },
                title: {
                    display: false,
                    text: 'Chart.js Polar Area Chart'
                },
                scale: {
                    ticks: {
                        beginAtZero: true
                    },
                    reverse: false
                },
                animation: {
                    animateRotate: false,
                    animateScale: false
                }
            },
            init: function (parentid, wi) {
                parentid = parentid || '';
                wi = wi || '40';
                if (parentid == '') {
                    $('body').append('<div style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                    //$('body').append('<div style="width: 300px; height: 1280px; position: absolute; left: 0px; top: 0px; overflow: hidden; transform-origin: 0% 0% 0px; transform-style: preserve-3d; perspective: 1000px; transition: opacity 0s ease 0s, -webkit-transform 0s linear 0s; transform: translateX(0px) translateY(0px) translateZ(0px) rotate(0deg) rotateX(0deg) rotateY(0deg); opacity: 1; display: block;"><canvas id="' + parentid + 'chart-area"></canvas></div>')


                } else {
                    console.log('parentid1:' + parentid);
                    $('#' + parentid).append('<div style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area" ></canvas></div>')
                }
                var ctx = document.getElementById(parentid + 'chart-area').getContext('2d');
                this['chart'] = new Chart.PolarArea(ctx, config);
            }
        };
        return config;
    }
    //===pie 扇狀分開


    //---雷達圖
    /*
    var chartradar1 = new chartradargen();

            chartradar1.data.labels = ['一', '二', '三', '四', '五'];
            //增加資料，後續增加再繼續push或操作 chartradar.data.datasets
            chartradar1.data.datasets.push({
                backgroundColor: 'rgba(255,0,0,0.5)',
                borderColor: 'red',
                data: [1,2,3,4,5],//超過的個數會繼續轉圈到結束
                label: 'D0'
            })

            chartradar1.init('div1', 40);//後續要操作要用一個chart來接
             //var chart2 = chartradar.init('div2', 20);//後續要操作要用一個chart來接
            chartradar1.chart.update();//更新

            setTimeout(function () {
                chartradar1.data.datasets.push({
                    backgroundColor: 'rgba(0,255,0,0.5)',
                    borderColor: 'green',
                    data: [5, 4, 3, 2, 1],//超過的個數會繼續轉圈到結束
                    label: 'D0'
                })
                chartradar1.chart.update();//更新
                //chart2.update();//更新
            }, 2000)
    */
    //雷達圖
    function chartradargen() {
        var chartradar = {
            type: 'radar',
            data: {
                labels: [],//幾面
                datasets: [
                    /*//預設內容
                    {
                        backgroundColor: 'rgba(255,0,0,0.5)',
                        borderColor: 'red',
                        data: [1, 2, 3, 4, 5],//超過的個數會繼續轉圈到結束
                        label: 'D0'
                    }
                    */
                ]//資料
            },
            options: {
                maintainAspectRatio: true,
                spanGaps: false,
                elements: {
                    line: {
                        tension: 0.000001
                    }
                }
            },
            //產生radar圖, parentid容器id/body,wi寬度%
            init: function (parentid, wi) {
                parentid = parentid || '';
                wi = wi || '40';
                if (parentid == '') {
                    $('body').append('<div style="width: ' + wi + '%; margin: auto"><canvas id="' + parentid + 'chart-0"></canvas></div>');
                } else {
                    console.log('parentid1:' + parentid);
                    $('#' + parentid).append('<div style="width: ' + wi + '%; margin: auto"><canvas id="' + parentid + 'chart-0"></canvas></div>')
                }
                //return new Chart(parentid + 'chart-0', chartradar);
                this['chart'] = new Chart(parentid + 'chart-0', chartradar);
            }
        }
        return chartradar;
    }
    //===雷達圖

    //---bar圖
    /*
    var chartbar1 = chartbargen();
            chartbar1.data.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];//橫軸
            chartbar1.data.datasets.push({
                label: 'Dataset 1',
                backgroundColor: 'rgba(255, 99, 132,0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                data: [0,1,2,3,4,5,6]//縱軸
            })
            chartbar1.init('div1', 20);


            setTimeout(function () {
                //更新數據
                chartbar1.data.datasets[0] = {
                    label: 'Dataset 1',
                    backgroundColor: 'rgba(255, 99, 132,0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    data: [0, 5, 2, 4, 3, 5]
                }
                chartbar1.chart.update();

                //增加chart
                var chartbar2 = chartbargen();
                chartbar2.data.labels = ['', 'February', 'March', 'April', 'May', 'June', 'July'];
                chartbar2.data.datasets.push({
                    label: 'Dataset 1',
                    backgroundColor: 'rgba(255, 99, 132,0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    data: [0, 1, 2, 3, 4, 5]
                })
                chartbar2.init('div2', 30);
            }, 2000);
    */
    //bar圖
    function chartbargen() {
        var barChartData = {
            type: 'bar',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: false,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart'
                }
            },
            init: function (parentid, wi) {
                parentid = parentid || '';
                wi = wi || '40';
                if (parentid == '') {
                    $('body').append('<div  style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                } else {
                    $('#' + parentid).append('<div  style="width:' + wi + '%"><canvas id="' + parentid + 'chart-area"></canvas></div>')
                }

                var ctx = document.getElementById(parentid + 'chart-area').getContext('2d');
                this['chart'] = new Chart(ctx, barChartData);
            }
        };

        return barChartData;
    }

    //===bar圖

    //---選項產生
    /*
                var ss = selectobjgen('select1', [1, 2, 3, 4], ['一', '二', '三', '四'] );
                ss.okfunc = function () {//選擇完成執行事件
                    console.log(this.rtnstr + 'ok!!');
                }

                var ss1 = selectobjgen('select2', [4, 3, 2, 1], ['四', '三', '二', '一', ] );
                ss1.okfunc = function () {
                    console.log(this.rtnstr + 'ok1!!');
                }

                select_sald.selectedfunc = function (event) {//選取事件
                console.log('選了我' + event.currentTarget.id);
            }
            select_sald.unselectedfunc = function (event) {//取消選取事件
                console.log('取消了我' + event.currentTarget.id);
            }

            select_dtpkmm.setProp( 340, 100, 10, 'white', false, 2, '請選擇月份', null, null, null, 'img/Blank.png', null, '#ff0000',null);
            */
    //選項選擇
    function selectobjgen(id, valuear, textar, optar) {
        var selectobj = {
            id: id,
            ismult: true,//是複選
            /*註解: 值 */
            valuear: valuear,
            /*註解: 顯示內容 */
            textar: textar,
            /*註解: 選項attr */
            optar: optar,
            /*標題說明*/
            title: '',
            /*註解: relative ,absolute */
            fontsize: 40,
            /*註解: background-image URL路徑 */
            bgimg: '',
            /*註解: 確認背景 URL路徑 */
            okimg: '',
            /*註解: 取消背景 URL路徑 */
            cancelimg: '',
            /*註解: 確認顯示文字 */
            ok: '確認',
            /*註解: 取消顯示文字, 設''隱藏取消按鈕 */
            cancel: '取消',
            /*註解: 固定在下方欄，確認與取消中間的字串，拿來放合計 */
            footerimg: '',
            footer: '',
            /*註解: 字體 ex: 微軟正黑體,Arial,Times New Roman */
            fontfamily: 'Calibri,微軟正黑體',
            /*註解: 文字顏色 */
            color: 'white',
            /*註解: 選項分隔高度 */
            dvhehgit: 0,
            /*註解: 選項分隔高度 */
            selectable: true,
            /*後續搭配搜尋cols難改，原先是單純搜尋框針對index 做hide/show，用td做稍嫌麻煩*/
            cols: 1,
            width: 300,
            height: 80,
            setProp: function (width, height, fontsize, color, ismult, cols, title, footer, ok, cancel, bgimg, okimg, cancelimg, footerimg) {
                selectobj.width = 300;
                selectobj.height = 80;
                selectobj.fontsize = 40;
                selectobj.color = 'white';
                selectobj.ismult = true;
                selectobj.cols = 1;
                selectobj.title = '';
                selectobj.footer = '';
                selectobj.ok = '確認';
                selectobj.cancel = '取消';
                selectobj.bgimg = '';
                selectobj.okimg = '';
                selectobj.cancelimg = '';
                selectobj.footerimg = '';

                (width != undefined) ? selectobj.width = width : '';
                (height != undefined) ? selectobj.height = height : '';
                (fontsize != undefined) ? selectobj.fontsize = fontsize : '';
                (color != undefined) ? selectobj.color = color : '';
                (ismult != undefined) ? selectobj.ismult = ismult : '';
                (cols != undefined) ? selectobj.cols = cols : '';
                (title != undefined) ? selectobj.title = title : '';
                (footer != undefined) ? selectobj.footer = footer : '';
                (ok != undefined) ? selectobj.ok = ok : '';
                (cancel != undefined) ? selectobj.cancel = cancel : '';
                (bgimg != undefined) ? selectobj.bgimg = bgimg : '';
                (okimg != undefined) ? selectobj.okimg = okimg : '';
                (cancelimg != undefined) ? selectobj.cancelimg = cancelimg : '';
                (footerimg != undefined) ? selectobj.footerimg = footerimg : '';

            },
            /*註解: 貼入容器ID */
            append: function (appendid) {
                if (window[this.id]) {
                    if ($('#' + this.id).length == 0) {
                        console.log('已存在同名select，清空');
                        //沒有存在實際dom，記憶體殘渣，直接清
                        window[this.id] = null;
                    } else {
                        //有存在，同一畫面重覆定義
                        console.log('已存在同名select，停止');
                        return false;
                    }
                }
                window[this.id] = this;
                this.rtnstr = '';
                console.log(selectobj.bgimg);
                var appendstr = '<div id="' + this.id + '" style="position:absolute;left:0px;top:0px;overflow-x:hidden;overflow-y:hidden;width:720px;height:1280px;';
                (selectobj.bgimg.indexOf('.png') > -1 || selectobj.bgimg.indexOf('.jpg') > -1 || selectobj.bgimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.bgimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.bgimg.indexOf('#') == 0 || selectobj.bgimg.indexOf('rgb(') == 0 || selectobj.bgimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.bgimg + ';' : '';
                appendstr += ';font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '">'



                appendstr += '<div style="position:absolute;top:50px;left:0px;width:720px;height:1180px;overflow:auto;-webkit-overflow-scrolling:touch;">'
                appendstr += '<div id="' + this.id + '_option" style="width:720px;height:1180px;display:table-cell;vertical-align:middle;overflow:auto;-webkit-overflow-scrolling:touch;" title="scroll">'

                for (var i = 0; i < this.textar.length; i++) {
                    var optionar_val = this.textar[i];
                    var opt_val = this.textar[i];
                    if (this.optar != undefined && this.optar[i] != undefined) {
                        opt_val = this.optar[i];
                    }

                    appendstr += '<div id="c_' + this.id + '_' + i + '"style="width:' + (720 / this.cols) + 'px;height:' + this.height + 'px;display: inline-block;vertical-align:top;overflow:hidden;">';
                    appendstr += '<div style="width:' + this.width + 'px;height:' + this.height + 'px;margin-left:auto;margin-right:auto">';
                    appendstr += '<div id="' + this.id + '_' + i + '" style="width:' + this.width + 'px;height:' + this.height + 'px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal;background-image:url(\'img/select_n.png\');background-repeat:no-repeat;background-size:100% 100%; padding:10px" value="' + this.valuear[i] + '" ' + opt_val + '>' + optionar_val + '</div><div style="height:' + this.dvhehgit + 'px"></div>';
                    appendstr += '</div>';
                    appendstr += '</div>';

                    ((i + 1) % this.cols == 0) ? appendstr += '</tr><tr>' : '';
                }

                appendstr += '</div>'
                appendstr += '</div>'
                //標題
                appendstr += '<div style="position:absolute;left:0px;top:0px;width:100%">' + ((this.title != '') ? this.title : '');
                appendstr += '<div style="position:absolute;left:550px;top:0px"><input id="' + this.id + '_search" type="text" style="text-align:center;width:150px;background-color:transparent;border-color: transparent;border-bottom:1px solid gray;background-image:url(\'img/search.png\');background-repeat:no-repeat;background-size:40px;padding:0px 0px 0px 10px"  /></div>'
                appendstr += '</div>';

                //下方確認footer
                appendstr += '<div style="position:absolute;left:0px;top:1180px;width:720px;height:100px;">'
                appendstr += '<div style="position:absolute;left:80px;top:0px;overflow-x:hidden;overflow-y:hidden;width:540px;height:100px;';
                (selectobj.footerimg.indexOf('.png') > -1 || selectobj.footerimg.indexOf('.jpg') > -1 || selectobj.footerimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.footerimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.footerimg.indexOf('#') == 0 || selectobj.footerimg.indexOf('rgb(') == 0 || selectobj.footerimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.footerimg + ';' : '';
                appendstr += 'font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '"><div id="' + this.id + '_footer" style="width:540px;height:100px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal">' + this.footer + '</div></div>';
                //下方取消
                appendstr += '<div id="' + this.id + '_cancel" style="position:absolute;left:10px;top:10px;overflow-x:hidden;overflow-y:hidden;width:80px;height:80px;';
                (selectobj.cancelimg.indexOf('.png') > -1 || selectobj.cancelimg.indexOf('.jpg') > -1 || selectobj.cancelimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.cancelimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.cancelimg.indexOf('#') == 0 || selectobj.cancelimg.indexOf('rgb(') == 0 || selectobj.cancelimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.cancelimg + ';' : '';
                appendstr += 'font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '"><div style="width:80px;height:80px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal">' + this.cancel + '</div></div>'
                //下方確認
                appendstr += '<div id="' + this.id + '_ok" style="position:absolute;left:620px;top:10px;overflow-x:hidden;overflow-y:hidden;width:80px;height:80px;';
                (selectobj.okimg.indexOf('.png') > -1 || selectobj.okimg.indexOf('.jpg') > -1 || selectobj.okimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.okimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.okimg.indexOf('#') == 0 || selectobj.okimg.indexOf('rgb(') == 0 || selectobj.okimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.okimg + ';' : '';
                appendstr += 'font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '"><div style="width:80px;height:80px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal">' + this.ok + '</div></div>'
                appendstr += '</div>'
                appendstr += '</div>'

                $('#' + appendid).append(appendstr);
                //取消, remove
                document.getElementById(this.id + '_cancel').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_cancel', '');
                    if (window[objname].cancelfunc != null) {
                        window[objname].cancelfunc(event);
                    }
                    $('#' + window[event.currentTarget.id.replace('_cancel', '')].id).remove();
                    window[objname] = null;
                });

                if (this.cancel == '') {
                    $('#' + this.id + '_cancel').hide();
                }

                //確認
                document.getElementById(this.id + '_ok').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_ok', '');
                    window[objname].rtnar = [];
                    var cnt = 0;
                    while ($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).length > 0) {
                        if ($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).attr('selected') == 'selected') {
                            window[objname].rtnar.push($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).attr('value'));
                        }
                        cnt += 1;
                    }

                    //console.log('選取回傳:' + window[objname].rtnstr);
                    var okfunc = true;
                    if (window[objname].okfunc != null) {
                        okfunc = window[objname].okfunc(event);
                        if (okfunc == undefined) {
                            okfunc = true;
                        }
                    }

                    if (okfunc) {//okfunc 回傳true或不回傳，關閉選擇，否則卡住
                        $('#' + window[objname].id).remove();
                        window[objname] = null;
                    }
                });

                //搜尋
                document.getElementById(this.id + '_search').addEventListener('keyup', function (event) {
                    var objname = event.currentTarget.id.replace('_search', '');
                    if (window[objname].searchfunc != null) {
                        window[objname].searchfunc(event);
                    }
                });

                //option selected 事件綁定
                if (this.selectable) {
                    for (var i = 0; i < this.textar.length; i++) {
                        var optionar_val = this.textar[i];
                        document.getElementById(this.id + '_' + i).addEventListener(eventup, function (event) {
                            if ($(event.target).is('input') || $(event.target).is('textarea')) {
                                return false;
                            }
                            var objname = event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_'));

                            if ($(this).attr('selected') == 'selected') {
                                $(this).css('background-image', 'url(\'img/select_n.png\')');
                                $(this).removeAttr('selected');
                            } else {

                                if (!window[objname].ismult) {//不允許複選
                                    //console.log('不允許複選');
                                    var cnt = 0;
                                    while ($('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).length > 0) {
                                        $('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).removeAttr('selected');
                                        $('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).css('background-image', 'url(\'img/select_n.png\')');
                                        cnt += 1;
                                    }
                                }
                                $(this).css('background-image', 'url(\'img/select_y.png\')');
                                $(this).attr('selected', 'selected');

                            }


                            //執行選取事件
                            if ($(this).attr('selected') == 'selected' && window[objname].selectedfunc != null) {
                                window[objname].selectedfunc(event);
                            } else if ($(this).attr('selected') == undefined && window[objname].unselectedfunc != null) {
                                window[objname].unselectedfunc(event);
                            }
                        });
                    };
                }
            },
            selectedfunc: null,//ok回傳事件
            unselectedfunc: null,//ok回傳事件
            okfunc: null,//ok回傳事件
            cancelfunc: null,//cancel回傳事件
            //search事件，預設搜尋html()，如果html不是純文字，改寫判斷式
            searchfunc: function (event) {
                var objname = event.currentTarget.id.replace('_search', '');
                var cnt = 0;
                while ($('#' + objname + '_' + cnt).length > 0) {
                    if ($('#' + objname + '_' + cnt).html().indexOf($(event.currentTarget).val()) == -1) {
                        $('#c_' + objname + '_' + cnt).hide();
                    } else {
                        $('#c_' + objname + '_' + cnt).show();
                    }
                    cnt += 1;
                }
            },
            rtnar: []//回傳obj

        }
        //selectobj.append(appendid);
        return selectobj;
    }

    //===選項產生

    //---文字輸入
    /*
        //欄位不可重覆，_int: 欄位只能key正整數字,_number :欄位只能key正整數字含小數, _textarea: 文本型態
         var ss = inputobjgen('select_sale', [1, 2, 3, 4, 5, 6, 7, 8, 9], ['日期', '平台', '買家', '訂單編號', '總售價_int', '折扣_number', '手續費', '淨利', '備註_textarea']);
        ss.okfunc = function () {//選擇完成執行事件
            console.log(this.rtnstr + 'ok!!');
        }

        ss.setProp('#ff0000', '#00ff00', false, 40, 40, null, null, null, '新增卡庫', null, 40, null, 40);
    */
    //文字輸入
    function inputobjgen(id, valuear, textar, titlear) {
        (titlear == undefined) ? titlear = [] : '';
        var inputobj = {
            id: id,
            ismult: false,//是複選
            valuear: valuear,
            textar: textar,
            /*input最大輸入長度,預設10 */
            maxlength: 40,
            /*註解: relative ,absolute */
            fontsize: 40,
            /*註解: background-image URL路徑 */
            bgimg: 'img/blank.png',
            opimg: 'img/blank.png',
            /*註解: 確認背景 URL路徑 */
            okimg: '',
            /*註解: 取消背景 URL路徑 */
            cancelimg: '',
            /*註解: 標題*/
            title: '',
            /*註解: 確認顯示文字 */
            ok: '確認',
            okfontsize: 10,
            /*註解: 取消顯示文字，設''隱藏取消按鈕 */
            cancel: '取消',
            cancelfontsize: 10,
            /*註解: 字體 ex: 微軟正黑體,Arial,Times New Roman */
            fontfamily: 'Calibri,微軟正黑體',
            /*註解: 文字顏色 */
            labelcolor: 'white',
            color: 'white',
            /*註解: 選項分隔高度 */
            dvhehgit: 0,
            /*註解: 貼入容器ID */
            setProp: function (color, labelcolor, ismult, maxlength, fontsize, bgimg, okimg, cancelimg, title, ok, okfontsize, cancel, cancelfontsize) {
                (color != undefined) ? inputobj.color = color : '';
                (labelcolor != undefined) ? inputobj.labelcolor = labelcolor : '';
                (ismult != undefined) ? inputobj.ismult = ismult : '';
                (maxlength != undefined) ? inputobj.maxlength = maxlength : '';
                (fontsize != undefined) ? inputobj.fontsize = fontsize : '';
                (bgimg != undefined) ? inputobj.bgimg = bgimg : '';
                (okimg != undefined) ? inputobj.okimg = okimg : '';
                (cancelimg != undefined) ? inputobj.cancelimg = cancelimg : '';
                (title != undefined) ? inputobj.title = title : '';
                (ok != undefined) ? inputobj.ok = ok : '';
                (okfontsize != undefined) ? inputobj.okfontsize = okfontsize : '';
                (cancel != undefined) ? inputobj.cancel = cancel : '';
                (cancelfontsize != undefined) ? inputobj.cancelfontsize = cancelfontsize : '';
            },
            append: function (appendid) {
                if (window[this.id]) {
                    if ($('#' + this.id).length == 0) {
                        console.log('已存在同名select，清空');
                        //沒有存在實際dom，記憶體殘渣，直接清
                        window[this.id] = null;
                    } else {
                        //有存在，同一畫面重覆定義
                        console.log('已存在同名select，停止');
                        return false;
                    }
                }
                window[this.id] = this;
                this.rtnobj = {};

                var appendstr = '<div id="' + this.id + '" style="position:absolute;left:0px;top:0px;overflow-x:hidden;overflow-y:hidden;width:720px;height:1280px;';
                (inputobj.bgimg.indexOf('.png') > -1 || inputobj.bgimg.indexOf('.jpg') > -1 || inputobj.bgimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + inputobj.bgimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (inputobj.bgimg.indexOf('#') == 0 || inputobj.bgimg.indexOf('rgb(') == 0 || inputobj.bgimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + inputobj.bgimg + ';' : '';
                appendstr += ';font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.labelcolor + '">'

                appendstr += '<div style="position:absolute;top:0px;left:0px;width:720px;height:1180px;overflow-x:hidden;overflow-y:auto;">'
                appendstr += '<div id="' + this.id + '_option" style="width:720px;height:1180px;display:table-cell;vertical-align:middle;text-align:center;overflow:auto;-webkit-overflow-scrolling:touch;" title="scroll">'
                if (this.title != '') {
                    appendstr += '<div style="width:100%">' + this.title + '</div><div style="height:' + this.dvhehgit + 'px"></div>';
                }


                var opimgstr = '';
                (inputobj.opimg.indexOf('.png') > -1 || inputobj.opimg.indexOf('.jpg') > -1 || inputobj.opimg.indexOf('.bmp') > -1) ? opimgstr += 'background-image:url(\'' + inputobj.opimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (inputobj.opimg.indexOf('#') == 0 || inputobj.opimg.indexOf('rgb(') == 0 || inputobj.opimg.indexOf('rgba(') == 0) ? opimgstr += 'background-color:' + inputobj.opimg + ';' : '';

                for (var i = 0; i < this.textar.length; i++) {
                    var optionar_val = this.textar[i];
                    if (optionar_val.indexOf('_int') > -1) {//只能輸入正整數字
                        optionar_val = replaceAll(optionar_val, '_int', '');
                        appendstr += '<div id="' + this.id + '_' + i + '" style="width:720px;height:80px;display:table-cell;vertical-align:middle;text-align:left;white-space:pre-wrap;word-break:normal;' + opimgstr + '; padding:10px;text-align:center" value="' + this.valuear[i] + '">' + (titlear[i] || optionar_val) + '<div style="height:' + this.dvhehgit + 'px"></div><input id="i_' + this.id + '_' + i + '" type="text" style="width:80%;font-size:' + this.fontsize + 'px;height:' + (this.fontsize + 6) + 'px;text-align:center;color:' + this.color + '" maxlength="' + this.maxlength + '" ' + optionar_val + ' onkeyup="keyupisint(event)" type="number"><div style="height:' + this.dvhehgit + 'px"></div></div><div style="height:' + this.dvhehgit + 'px"></div>'
                    } else if (optionar_val.indexOf('_number') > -1) {//只能輸入正小數
                        optionar_val = replaceAll(optionar_val, '_number', '');
                        appendstr += '<div id="' + this.id + '_' + i + '" style="width:720px;height:80px;display:table-cell;vertical-align:middle;text-align:left;white-space:pre-wrap;word-break:normal;' + opimgstr + '; padding:10px;text-align:center" value="' + this.valuear[i] + '">' + (titlear[i] || optionar_val) + '<div style="height:' + this.dvhehgit + 'px"></div><input id="i_' + this.id + '_' + i + '" type="text" style="width:80%;font-size:' + this.fontsize + 'px;height:' + (this.fontsize + 6) + 'px;text-align:center;color:' + this.color + '" maxlength="' + this.maxlength + '" ' + optionar_val + ' onkeyup="keyupisnumber(event)" type="number"><div style="height:' + this.dvhehgit + 'px"></div></div><div style="height:' + this.dvhehgit + 'px"></div>'
                    } else if (optionar_val.indexOf('_textarea') > -1) {//文本型態
                        optionar_val = replaceAll(optionar_val, '_textarea', '');
                        appendstr += '<div id="' + this.id + '_' + i + '" style="width:720px;height:80px;display:table-cell;vertical-align:middle;text-align:left;white-space:pre-wrap;word-break:normal;' + opimgstr + '; padding:10px;text-align:center" value="' + this.valuear[i] + '">' + (titlear[i] || optionar_val) + '<div style="height:' + this.dvhehgit + 'px"></div><textarea id="i_' + this.id + '_' + i + '" type="text" style="width:80%;font-size:' + this.fontsize + 'px;height:' + ((this.fontsize + 6) * 3) + 'px;color:' + this.color + '" maxlength="' + this.maxlength + '" ' + optionar_val + '></textarea><div style="height:' + this.dvhehgit + 'px"></div></div><div style="height:' + this.dvhehgit + 'px"></div>'
                    } else {//不限制
                        appendstr += '<div id="' + this.id + '_' + i + '" style="width:720px;height:80px;display:table-cell;vertical-align:middle;text-align:left;white-space:pre-wrap;word-break:normal;' + opimgstr + '; padding:10px;text-align:center" value="' + this.valuear[i] + '">' + (titlear[i] || optionar_val) + '<div style="height:' + this.dvhehgit + 'px"></div><input id="i_' + this.id + '_' + i + '" type="text" style="width:80%;font-size:' + this.fontsize + 'px;height:' + (this.fontsize + 6) + 'px;text-align:center;color:' + this.color + '" maxlength="' + this.maxlength + '" ' + optionar_val + '><div style="height:' + this.dvhehgit + 'px"></div></div><div style="height:' + this.dvhehgit + 'px"></div>'
                    }
                }

                appendstr += '</div>'
                appendstr += '</div>'

                //下方選單
                appendstr += '<div style="position:absolute;left:0px;top:1180px;width:720px;height:100px;">'
                //取消
                appendstr += '<div id="' + this.id + '_cancel" style="position:absolute;left:10px;top:10px;overflow-x:hidden;overflow-y:hidden;width:80px;height:80px;';
                (inputobj.cancelimg.indexOf('.png') > -1 || inputobj.cancelimg.indexOf('.jpg') > -1 || inputobj.cancelimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + inputobj.cancelimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (inputobj.cancelimg.indexOf('#') == 0 || inputobj.cancelimg.indexOf('rgb(') == 0 || inputobj.cancelimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + inputobj.cancelimg + ';' : '';
                appendstr += ';font-size:' + this.okfontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '"><div style="width:80px;height:80px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal">' + this.cancel + '</div></div>'
                //確認
                appendstr += '<div id="' + this.id + '_ok" style="position:absolute;left:620px;top:10px;overflow-x:hidden;overflow-y:hidden;width:80px;height:80px;';
                (inputobj.okimg.indexOf('.png') > -1 || inputobj.okimg.indexOf('.jpg') > -1 || inputobj.okimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + inputobj.okimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (inputobj.okimg.indexOf('#') == 0 || inputobj.okimg.indexOf('rgb(') == 0 || inputobj.okimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + inputobj.okimg + ';' : '';
                appendstr += ';font-size:' + this.cancelfontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '"><div style="width:80px;height:80px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal">' + this.ok + '</div></div>'
                appendstr += '</div>'

                appendstr += '</div>'

                $('#' + appendid).append(appendstr);
                //取消, remove
                document.getElementById(this.id + '_cancel').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_cancel', '');
                    if (window[objname].cancelfunc != null) {
                        window[objname].cancelfunc(event);
                    }
                    $('#' + window[event.currentTarget.id.replace('_cancel', '')].id).remove();
                    window[objname] = null;
                });
                if (this.cancel == '') {
                    $('#' + this.id + '_cancel').hide();
                }

                //確認
                document.getElementById(this.id + '_ok').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_ok', '');

                    window[objname].rtnobj = {};
                    var cnt = 0;
                    while ($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).length > 0) {
                        //移除掉 _number , _int ,_textarea
                        window[objname].rtnobj[replaceAll(replaceAll(replaceAll(textar[cnt], '_number', ''), '_int', ''), '_textarea', '')] = $('#' + objname + ' [' + replaceAll(replaceAll(replaceAll(textar[cnt], '_number', ''), '_int', ''), '_textarea', '') + ']').val()
                        cnt += 1;
                    }


                    var okfunc = true;
                    if (window[objname].okfunc != null) {
                        okfunc = window[objname].okfunc(event);
                        if (okfunc == undefined) {
                            okfunc = true;
                        }
                    }

                    if (okfunc) {//okfunc 回傳true或不回傳，關閉選擇，否則卡住
                        $('#' + window[objname].id).remove();
                        window[objname] = null;
                    }

                });

                //option selected 事件綁定
                /*
                for (var i = 0; i < this.textar.length; i++) {
                    var optionar_val = this.textar[i];
                    document.getElementById(this.id + '_' + i).addEventListener(eventup, function (event) {
                        var objname = event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_'));

                        if ($(this).attr('selected') == 'selected') {
                            $(this).css('background-image', 'url(\'img/select_n.png\')');
                            $(this).removeAttr('selected');
                        } else {
                            if (!window[objname].ismult) {//不允許複選
                                var cnt = 0;
                                while ($('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).length > 0) {
                                    $('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).removeAttr('selected');
                                    $('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).css('background-image', 'url(\'img/select_n.png\')');
                                    cnt += 1;
                                }
                            }
                            $(this).css('background-image', 'url(\'img/select_y.png\')');
                            $(this).attr('selected', 'selected');

                        }

                    });
                };
                */

            },
            okfunc: null,//ok回傳事件
            cancelfunc: null,//cancel回傳事件
            rtnobj: {}//回傳obj

        }
        //inputobj.append(appendid);
        return inputobj;
    }
    //===文字輸入

    //--dbinit
    //---DB init
    /*
                //---起始資料庫設定
                dbprocess.dbstr = {
                    main: 'AYOwhgtgpg+mDmtEgCZQE4wO7yA',
                    food: 'AYOwhgtgpg+gLgTwA6wBZyA',
                    ex: 'AYOwhgtgpg+hCWIDOMAWAXIA',
                    foodtype: 'AYFwngDgpkA',
                    extype: 'AYOwhgtgpkA',
                    log: 'AYOwhgtgpg+gxgGzAZ2TALgTwA6wgSxDQAt0YB3AcyA'
                }

                dbprocess.init();
                dbprocess.dbinitchk = setInterval(function () {
                    if (dbprocess.initcnt == Object.keys(dbprocess.dbstr).length) {
                        //dbinit執行完畢
                        clearInterval(dbprocess.dbinitchk);
                        //alert('全部載完')
                        $('#sp1').append('全部載入' + '\r\n');
                        //程式進入點進入程式主畫面
                        bodyload(projectPath + '/main.html');
                    }
                }, 100);
                //===起始資料庫設定

                //---dbprocess.saveall() 做的非同步存檔檢查
        dbprocess.dbsavechk = setInterval(function () {
                    if (dbprocess.saveallcnt == Object.keys(dbprocess.dbstr).length) {
                        //dbinit執行完畢
                        clearInterval(dbprocess.dbsavechk);
                        console.log('done');//<--程式進入點
                    }
                }, 10);
                //===dbprocess.saveall() 做的非同步存檔檢查
        */

    //csv轉dbstr字串
    //console.log(csvReadLine('1_log.csv'));

    //註解: dbprocess操作
    var dbprocess = {
        dbstr: {
            /*
            main: 'AYOwhgtgpg+mDmtEgCZQE4wO7yA',
            food: 'AYOwhgtgpg+gLgTwA6wBZyA',
            ex: 'AYOwhgtgpg+hCWIDOMAWAXIA',
            foodtype: 'AYFwngDgpkA',
            extype: 'AYOwhgtgpkA',
            log: 'AYOwhgtgpg+gxgGzAZ2TALgTwA6wgSxDQAt0YB3AcyA'
            */
        },
        dbindex: {},
        dbobj: {},
        //Insert一筆，欄位數量需符合: dbprocess.dbinsobj(dbprocess.dbobj.log, ['1', '7892', '3','4','5','6']);
        dbinsobj: function (obj, value_ar) {
            var keyar = Object.keys(obj[0]);
            if (keyar.length == value_ar.length) {
                var newobj = {};
                $.each(keyar, function (i, keyar_val) {
                    //console.log(keyar_val);
                    newobj[keyar_val] = value_ar[i];
                });
                obj.push(newobj);
                //console.log('insert success');
            } else {
                console.log('insert 欄位數量不符');
            }
        },
        //儲存單檔, obj,obj name，存檔預設obj.name ***不要重覆***
        save: function (obj, name) {
            //console.log(obj[name]);
            var savestr = findstrval_object2str(obj[name])
            //console.log(console.log('存檔:' + savestr));
            var compressed = LZString.compressToEncodedURIComponent(savestr);
            //console.log(console.log('存檔壓:' + compressed));
            fileName = name + '.txt';

            savetxt(fileName, compressed);
        },
        //儲存全部, obj，依name個別存檔
        saveallcnt: 0,
        savall: function (obj) {
            dbprocess.saveallcnt = 0;
            var keyar = Object.keys(obj);
            var savestr = [];
            var savename = [];
            $.each(keyar, function (i, keyar_val) {

                savestr.push(findstrval_object2str(obj[keyar_val]));
                savename.push(keyar_val);
            });

            var savecnt = 0;
            while (savecnt < savename.length) {
                //console.log(savecnt);
                //console.log(savestr);
                //console.log(savestr[savecnt])
                var compressed = LZString.compressToEncodedURIComponent(savestr[savecnt]);
                var fileName = savename[savecnt] + '.txt';
                if (isios != -1) {//IOS,Android用
                    //alert('IOS 1');
                    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry) {
                        // alert('IOS 2');
                        //永遠新建檔案覆寫
                        directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                            //alert('IOS 3');
                            fileEntry.createWriter(function (fileWriter) {
                                fileWriter.onwriteend = function (e) {
                                    //存檔完成，開始讀取
                                    fileEntry.file(function (file) {
                                        var reader = new FileReader();
                                        reader.onloadend = function (e) {
                                            //存入跟讀出的檔案格式轉為json
                                            //alert("IOS存檔完成: " + this.result);
                                            //alert("IOS存檔完成: ");
                                            $('#sp1').append('IOS存檔完成<br>');
                                            dbprocess.saveallcnt += 1;
                                        };
                                        reader.readAsText(file);
                                    }, errorHandler.bind(null, fileName));
                                };
                                fileWriter.onerror = function (e) {
                                    // alert('write error');
                                };
                                //寫入資料
                                fileWriter.write(compressed);
                            }, errorHandler.bind(null, fileName));
                        }, errorHandler.bind(null, fileName));
                    }, errorHandler.bind(null, fileName));
                } else {
                    if (navigator.userAgent.indexOf("Electron") != -1) {//Electron
                        alert('Electron'+fileName);
                        var fs = require('fs');
                        try {
                            fs.writeFileSync(fileName, compressed, 'utf-8');
                            ajax_loading = 0;
                            dbprocess.saveallcnt += 1;
                        }
                        catch (e) {
                            alert('Electron存檔錯誤!');
                        }

                    } else {//PHP
                        $.ajax({
                            url: 'savetxt.php',
                            //寫入資料
                            data: { filename: fileName, poststr: compressed },
                            type: 'POST',
                            async: true,
                            timeout: 5000, //超過5秒沒回應就timeout
                            cache: false,
                            error: function (xhr, status, error) {
                                ajax_loading = 0;
                                alert('php error: ' + status);
                            },
                            success: function (data) {
                                //成功寫入資料
                                ajax_loading = 0;
                                dbprocess.saveallcnt += 1;
                                //alert(data);
                                //alert('php 存檔完成');
                                $('#sp1').append('php存檔完成<br>');
                            }
                        });
                    }
                }
                savecnt += 1;
            }
        },
        //init, dbprocess.dbstr，來源字串(共變),dbprocess.dbindex，目前操作index(共變)
        init: function () {
            var keyar = Object.keys(dbprocess.dbstr);
            
            $('#loadingtext').html(dbprocess.initcnt + '/' + (Object.keys(dbprocess.dbstr).length));
            $.each(keyar, function (i, keyar_val) {
                dbprocess.dbindex[keyar_val] = 0;
                var fileName = keyar_val + '.txt';
                
                if (isios != -1) {//IOS,Android用
                    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry) {
                        //檔案名稱，是否建立檔案，檔案存在動作，檔案不存在動作
                        directoryEntry.getFile(fileName, { create: false }, function (fileEntry) {
                            //檔案存在
                            var pathToFile = cordova.file.externalDataDirectory + fileName;
                            //alert('setting檔案存在，直接讀取' + pathToFile);
                            window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                                fileEntry.file(function (file) {
                                    var reader = new FileReader();
                                    reader.onloadend = function (e) {
                                        //alert('IOS有存檔' + fileName);
                                        $('#sp1').append('IOS有存檔' + fileName + '\r\n');
                                        //程式進人
                                        dbprocess.dbobj[keyar_val] = findstrval_object(LZString.decompressFromEncodedURIComponent(this.result));
                                        dbprocess.initcnt += 1;
                                        /*
                                        loadingpie1.options['animation'] = {//動畫設定
                                            duration: 2000
                                        }
                                        loadingpie1.data.datasets[0].data = [dbprocess.initcnt, Object.keys(dbprocess.dbstr).length - dbprocess.initcnt]
                                        loadingpie1.chart.update();
                                        $('#loadingtext').html(dbprocess.initcnt + '/' + (Object.keys(dbprocess.dbstr).length))
                                        */
                                    };
                                    reader.readAsText(file);
                                }, errorHandler.bind(null, fileName));
                            }, errorHandler.bind(null, fileName));

                        }, function (fileEntry) {
                            //檔案不存在
                            //alert('ios,無存檔:' + fileName)
                            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                                fileEntry.createWriter(function (fileWriter) {
                                    fileWriter.onwriteend = function (e) {
                                        //用預設的fdarstr存檔完成
                                        //alert('ios,無存檔+IOS建立完成:' + fileName);
                                        $('#sp1').append('ios,無存檔+IOS建立完成:' + fileName + '\r\n');
                                        //程式進人

                                        if (dbprocess.dbstr[keyar_val].indexOf('`') == 0) {
                                            dbprocess.dbobj[keyar_val] = findstrval_object(dbprocess.dbstr[keyar_val]);
                                        } else {
                                            dbprocess.dbobj[keyar_val] = findstrval_object(LZString.decompressFromEncodedURIComponent(dbprocess.dbstr[keyar_val]));
                                        }

                                        dbprocess.initcnt += 1;
                                        /*
                                        loadingpie1.options['animation'] = {//動畫設定
                                            duration: 2000
                                        }
                                        loadingpie1.data.datasets[0].data = [dbprocess.initcnt, Object.keys(dbprocess.dbstr).length - dbprocess.initcnt]
                                        loadingpie1.chart.update();
                                        $('#loadingtext').html(dbprocess.initcnt + '/' + (Object.keys(dbprocess.dbstr).length))
                                        */
                                    };
                                    fileWriter.onerror = function (e) {
                                    };
                                    if (dbprocess.dbstr[keyar_val].indexOf('`') == 0) {//是中文，存亂碼
                                        console.log('是中文，存亂碼');
                                        fileWriter.write(LZString.compressToEncodedURIComponent(dbprocess.dbstr[keyar_val]));
                                    } else {//不是中文，存原碼
                                        console.log('不是中文，存原碼');
                                        fileWriter.write(dbprocess.dbstr[keyar_val]);
                                    }

                                }, errorHandler.bind(null, fileName));
                            }, errorHandler.bind(null, fileName));
                        });
                    }, errorHandler.bind(null, fileName));

                } else {
                    //讀檔直接用ajax即可
                    $.ajax({
                        type: "GET", url: keyar_val + '.txt', cache: false, async: true,
                        success: function (str) {
                            
                            //console.log(keyar_val + '有存檔 讀取');
                            $('#sp1').append(keyar_val + '有存檔 讀取' + '\r\n');
                            dbprocess.dbobj[keyar_val] = findstrval_object(LZString.decompressFromEncodedURIComponent(str));
                            dbprocess.initcnt += 1;
                            /*
                            loadingpie1.options['animation'] = {//動畫設定
                                duration: 2000
                            }
                            loadingpie1.data.datasets[0].data = [dbprocess.initcnt, Object.keys(dbprocess.dbstr).length - dbprocess.initcnt]
                            loadingpie1.chart.update();
                            $('#loadingtext').html(dbprocess.initcnt + '/' + (Object.keys(dbprocess.dbstr).length))
                            */
                        }, error: function (msg) {
                            //if (msg.status == 404) {
                            if (msg.status == 0 || msg.status == 404) {//預設網站查無檔案回傳404，Electron回傳0
                                //console.log(keyar_val + '沒有存檔 使用dbstr預設');
                                $('#sp1').append(keyar_val + '沒有存檔 使用dbstr預設' + '\r\n');
                                if (dbprocess.dbstr[keyar_val].indexOf('`') == 0) {
                                    dbprocess.dbobj[keyar_val] = findstrval_object(dbprocess.dbstr[keyar_val]);
                                } else {
                                    dbprocess.dbobj[keyar_val] = findstrval_object(LZString.decompressFromEncodedURIComponent(dbprocess.dbstr[keyar_val]));
                                }

                                dbprocess.initcnt += 1;
                                /*
                                loadingpie1.options['animation'] = {//動畫設定
                                    duration: 2000
                                }
                                loadingpie1.data.datasets[0].data = [dbprocess.initcnt, Object.keys(dbprocess.dbstr).length - dbprocess.initcnt]
                                loadingpie1.chart.update();
                                $('#loadingtext').html(dbprocess.initcnt + '/' + (Object.keys(dbprocess.dbstr).length))
                                */
                            }
                        }
                    });
                }
            });
        },
        //pop object編輯
        edit: function (obj, name) {
            var itemindex = dbprocess.dbindex[name];
            var tgobj = obj[name];
            console.log(tgobj);
            //ios,android改body_div
            $('#body_div').append('<div id="dv_objedit" style="position:absolute;left:0;top:0px;width:720px;height:1280px;overflow:hidden;border:1px solid;background-color:white;z-index:999"></div>');

            var objtext = addtextobj();
            var objdiv = adddivobj();
            var appendtext = ''
            //object-> input
            var keyar = Object.keys(tgobj[0]);
            $.each(keyar, function (i, keyar_val) {
                objtext.id = 'txedit_' + keyar_val;
                objtext.label = keyar_val;
                objtext.left = 20;
                objtext.top = (i * 70) + 150;
                objtext.height = 60;
                objtext.width = 680;
                objtext.content = tgobj[itemindex][keyar_val];
                //objtext.append('dv_objedit');
                appendtext += objtext.append('dv_objedit');
            });

            //目前編輯object
            objtext.id = 'tx_dv_objedit';
            objtext.left = 30;
            objtext.top = 30;
            objtext.height = 40;
            objtext.width = 350;
            objtext.content = name;
            objtext.disabled = true;
            objtext.visable = false;
            //objtext.append('dv_objedit');
            appendtext += objtext.append('dv_objedit');

            //目前編輯idx
            objtext.id = 'tx_dv_objeditidx';
            objtext.left = 270;
            objtext.top = 10;
            objtext.height = 90;
            objtext.width = 80;
            objtext.content = itemindex;
            objtext.disabled = true;
            objtext.visable = true;
            objtext.align = 'center';
            //objtext.append('dv_objedit');
            appendtext += objtext.append('dv_objedit');


            //下一筆
            objdiv.id = 'dv_objeditnext';
            objdiv.left = 620;
            objdiv.top = 10;
            objdiv.height = 90;
            objdiv.width = 80;
            objdiv.content = '>';
            //objdiv.append('dv_objedit');
            appendtext += objtext.append('dv_objedit');



            //上一筆
            objdiv.id = 'dv_objeditprev';
            objdiv.left = 520;
            objdiv.top = 10;
            objdiv.height = 90;
            objdiv.width = 80;
            objdiv.content = '<';
            //objdiv.append('dv_objedit');
            appendtext += objdiv.append('dv_objedit');



            //增加
            objdiv.id = 'dv_objeditadd';
            objdiv.left = 20;
            objdiv.top = 10;
            objdiv.height = 90;
            objdiv.width = 100;
            objdiv.fontsize = 10;
            objdiv.content = '增';
            //objdiv.append('dv_objedit');
            appendtext += objdiv.append('dv_objedit');

            //刪除
            objdiv.id = 'dv_objeditdel';
            objdiv.left = 380;
            objdiv.top = 10;
            objdiv.height = 90;
            objdiv.width = 100;
            objdiv.fontsize = 10;
            objdiv.content = '刪';
            //objdiv.append('dv_objedit');
            appendtext += objdiv.append('dv_objedit');

            //存實體檔案
            objdiv.id = 'dv_objeditsave';
            objdiv.left = 150;
            objdiv.top = 10;
            objdiv.height = 90;
            objdiv.width = 100;
            objdiv.content = '存';
            //objdiv.append('dv_objedit');
            appendtext += objdiv.append('dv_objedit');
            $('#dv_objedit').append(appendtext);

            document.getElementById('dv_objeditnext').addEventListener(eventup, function (event, name) {
                var tgname = $('#tx_dv_objedit').val();
                var tgobj = dbprocess.dbobj[tgname];
                var tgindex = dbprocess.dbindex[tgname];
                //console.log(tgobj);
                //console.log(tgindex);

                //換頁就更新obj
                var keyar = Object.keys(tgobj[0]);
                $.each(keyar, function (i, keyar_val) {
                    tgobj[tgindex][keyar_val] = $('#txedit_' + keyar_val).val();
                });

                tgindex += 1;
                if (tgindex > tgobj.length - 1) {
                    tgindex = 0;
                }
                var keyar = Object.keys(tgobj[0]);

                $.each(keyar, function (i, keyar_val) {
                    $('#txedit_' + keyar_val).val(tgobj[tgindex][keyar_val]);
                });
                $('#tx_dv_objeditidx').val(tgindex);//顯示目前index
                dbprocess.dbindex[tgname] = tgindex;
            });

            document.getElementById('dv_objeditprev').addEventListener(eventup, function (event) {
                var tgname = $('#tx_dv_objedit').val();
                var tgobj = dbprocess.dbobj[tgname];
                var tgindex = dbprocess.dbindex[tgname];
                //console.log(tgobj);
                //console.log(tgindex);

                //換頁就更新obj
                var keyar = Object.keys(tgobj[0]);
                $.each(keyar, function (i, keyar_val) {
                    tgobj[tgindex][keyar_val] = $('#txedit_' + keyar_val).val();
                });

                tgindex -= 1;
                if (tgindex < 0) {
                    tgindex = tgobj.length - 1;
                }
                var keyar = Object.keys(tgobj[0]);
                $.each(keyar, function (i, keyar_val) {
                    $('#txedit_' + keyar_val).val(tgobj[tgindex][keyar_val]);
                });
                $('#tx_dv_objeditidx').val(tgindex);//顯示目前index
                dbprocess.dbindex[tgname] = tgindex;
            });

            document.getElementById('dv_objeditadd').addEventListener(eventup, function (event) {
                var tgname = $('#tx_dv_objedit').val();
                var tgobj = dbprocess.dbobj[tgname];
                var tgindex = dbprocess.dbindex[tgname];
                //console.log(tgobj);
                //console.log(tgindex);
                var keyar = Object.keys(tgobj[0]);
                var newobj = {};
                $.each(keyar, function (i, keyar_val) {
                    $('#txedit_' + keyar_val).val('');
                    newobj[keyar_val] = '';
                });
                tgobj.push(newobj);
                tgindex = tgobj.length - 1
                $('#tx_dv_objeditidx').val(tgindex);//顯示目前index
                dbprocess.dbindex[tgname] = tgindex;
                console.log('目前idx: ' + tgindex);
            });


            document.getElementById('dv_objeditdel').addEventListener(eventup, function (event) {

                var tgname = $('#tx_dv_objedit').val();
                var tgobj = dbprocess.dbobj[tgname];
                var tgindex = dbprocess.dbindex[tgname];
                //console.log(tgobj);
                //console.log(tgindex);

                if (tgobj.length < 2) {
                    //至少留一筆
                    return;
                }
                tgobj.splice(tgindex, 1);
                if (tgindex > tgobj.length - 1) {
                    tgindex = 0;
                }
                var keyar = Object.keys(tgobj[0]);

                $.each(keyar, function (i, keyar_val) {
                    $('#txedit_' + keyar_val).val(tgobj[tgindex][keyar_val]);
                });
                $('#tx_dv_objeditidx').val(tgindex);//顯示目前index
                dbprocess.dbindex[tgname] = tgindex;
                console.log('目前idx: ' + tgindex);

            });


            document.getElementById('dv_objeditsave').addEventListener(eventup, function (event) {
                var tgname = $('#tx_dv_objedit').val();
                var tgobj = dbprocess.dbobj[tgname];
                var tgindex = dbprocess.dbindex[tgname];
                console.log(tgobj);
                console.log(tgindex);

                var keyar = Object.keys(tgobj[0]);
                $.each(keyar, function (i, keyar_val) {
                    tgobj[tgindex][keyar_val] = $('#txedit_' + keyar_val).val();
                });

                dbprocess.save(dbprocess.dbobj, tgname);
                //dbprocess.savall(dbprocess.dbobj);
                console.log('done');
            });
        },
        initcnt: 0,
        //多兩個prop做計數器
        dbinitchk: null,
        dbsavechk: null
    }
    //==dbinit
    //===20180818 Jtest

    //---日期相差
    //回傳兩日期相差年-日
    function datediff(smalldt, bigdt) {
        //(365*24*60*60*1000) = 31536000000 //年
        //(24 * 60 * 60 * 1000) = 86400000 //日
        var d = new Date(bigdt);
        var dt = new Date(smalldt);
        console.log(d)
        console.log(dt)
        console.log((d - dt));
        var yy = Math.floor(Math.abs(d - dt) / 31536000000);
        var dd = Math.ceil((Math.abs(d - dt) - (yy * 31536000000)) / (86400000))
        return (yy + '-' + dd);
    }
    //===日期相差

    //強制輸入必為number 正數
    function keyupisnumber(event) {
        var tempval = $(event.currentTarget).val();
        if (!jQuery.isNumeric(tempval)) {
            //alert('須為數字，須大於0');
            $(event.target).val('');
        }
    }
    //強制輸入必為int 正數
    function keyupisint(event) {
        var tempval = $(event.currentTarget).val();
        if (!jQuery.isNumeric(tempval) || tempval.indexOf('.') > -1) {
            //alert('須為數字，須大於0');
            $(event.target).val('');
        }
    }

    //強制輸入必為number 正數
    function keyupisnumber(event) {
        var tempval = $(event.currentTarget).val();
        if (!jQuery.isNumeric(tempval)) {
            //alert('須為數字，須大於0');
            $(event.target).val('');
        }
    }
    //強制輸入必為int 正數
    function keyupisint(event) {
        var tempval = $(event.currentTarget).val();
        if (!jQuery.isNumeric(tempval) || tempval.indexOf('.') > -1) {
            //alert('須為數字，須大於0');
            $(event.target).val('');
        }
    }

    //var daystr = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate();
    //取日期字串 傳入日期字串 或 不傳:今天
    function getdatestr(datestr) {
        var Today = (datestr != undefined ? new Date(datestr) : new Date());
        //var Today = new Date();


        var yy = Today.getFullYear();
        var mm = (Today.getMonth() + 1);
        var dd = Today.getDate();

        var hh = Today.getHours()
        var mn = Today.getMinutes()
        var ss = Today.getSeconds();

        return yy + '' + (mm < 10 ? '0' : '') + mm + '' + (dd < 10 ? '0' : '') + dd + '' + (hh < 10 ? '0' : '') + hh + '' + (mn < 10 ? '0' : '') + mn + '' + (ss < 10 ? '0' : '') + ss;
    }

    //陣列轉csv
    function object2csv(obj, name) {
        var result = "";
        var savestr = findstrval_object2str(obj[name])
        console.log('savestr: ' + savestr);
        var str_ar = savestr.split('`');
        $.each(str_ar, function (i, val) {
            //去第1行空白跟第2行自動產生的表頭
            //if (i == str_ar.length || i < 1) { return }
            var valar = val.split('¯');
            $.each(valar, function (j, line_val) {
                if (line_val.indexOf("\"") > -1 || line_val.indexOf(",") > -1) {
                    line_val = "\"" + line_val.replace(/\"/g, '""') + "\"";
                }
                result += line_val + "\t";
            });
            result += "\r\n";
        });

        //console.log(result);

        var SaveTxtData = {
            filename: name + '_Export.txt',
            value: result
        };


        console.log(name);
        var savestr = findstrval_object2str(obj[name])
        var compressed = savestr;
        fileName = name + '_Export.txt';
        savetxt(fileName, compressed);

    }

    //---array 轉 object array
    //傳入array 跟key ，回傳1個單key的object
    function zf_ArrayToObject(array, key) {
        var rtnar = [];
        $.each(array, function (i, val) {
            var tempobj = {}
            tempobj[key] = val;
            rtnar.push(tempobj);
        });
        return rtnar;

    }
    //===array 轉 object array

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

    //---自定綁定事件+事件前固定執行
    var addevt = {
        up: function (tgid, func) {
            
            if (typeof tgid == 'string') {
                document.getElementById(tgid).addEventListener(eventup, function (e) {
                    if (scrollhave) { return false };//任何up事件如果有scroll過，取消執行
                    func(e);
                })
            } else if (typeof tgid == 'object') {
                $.each(tgid, function (i, tgid_val) {
                    document.getElementById(tgid_val).addEventListener(eventup, function (e) {
                        if (scrollhave) { return false };//任何up事件如果有scroll過，取消執行
                        func(e);
                    })
                })
                
            }
            
        },
        down: function (tgid, func) {
            if (typeof tgid == 'string') {
                document.getElementById(tgid).addEventListener(eventdown, function (e) {
                    getxy(event);
                    func(e);
                })
            } else if (typeof tgid == 'object') {
                $.each(tgid, function (i, tgid_val) {
                    document.getElementById(tgid_val).addEventListener(eventdown, function (e) {
                        getxy(event);
                        func(e);
                    })
                })
            }
            
            
        },
        move: function (tgid, func) {
            if (typeof tgid == 'string') {
                document.getElementById(tgid).addEventListener(eventmove, function (e) {
                    getxy(event);
                    func(e);
                })
            } else if (typeof tgid == 'object') {
                $.each(tgid, function (i, tgid_val) {
                    document.getElementById(tgid_val).addEventListener(eventmove, function (e) {
                        getxy(event);
                        func(e);
                    })
                })
            }
        },
        keyup: function (tgid, func) {
            if (typeof tgid == 'string') {
                document.getElementById(tgid).addEventListener('keyup', function (e) {
                    //按下ENTER，且不是TEXTAREA，關閉小鍵盤
                    if (event.keyCode == 13 && $(this).attr('type').toUpperCase() != 'TEXTAREA') {
                        $('#focusable').focus();
                    }
                    func(e);
                })
            } else if (typeof tgid == 'object') {
                $.each(tgid, function (i, tgid_val) {
                    document.getElementById(tgid_val).addEventListener('keyup', function (e) {
                        //按下ENTER，且不是TEXTAREA，關閉小鍵盤
                        if (event.keyCode == 13 && $(this).attr('type').toUpperCase() != 'TEXTAREA') {
                            $('#focusable').focus();
                        }
                        func(e);
                    })
                })
            }
        },
        keydown: function (tgid, func) {
            

            if (typeof tgid == 'string') {
                document.getElementById(tgid).addEventListener('keydown', function (e) {
                    //按下ENTER，且不是TEXTAREA，關閉小鍵盤
                    if (event.keyCode == 13 && $(this).attr('type').toUpperCase() != 'TEXTAREA') {
                        $('#focusable').focus();
                    }
                    func(e);
                })
            } else if (typeof tgid == 'object') {
                $.each(tgid, function (i, tgid_val) {
                    document.getElementById(tgid_val).addEventListener('keydown', function (e) {
                        //按下ENTER，且不是TEXTAREA，關閉小鍵盤
                        if (event.keyCode == 13 && $(this).attr('type').toUpperCase() != 'TEXTAREA') {
                            $('#focusable').focus();
                        }
                        func(e);
                    })
                })
            }
        },
        paste: function (tgid, func) {
            

            if (typeof tgid == 'string') {
                document.getElementById(tgid).addEventListener('paste', function (e) {
                    //按下ENTER，且不是TEXTAREA，關閉小鍵盤
                    if (event.keyCode == 13 && $(this).attr('type').toUpperCase() != 'TEXTAREA') {
                        $('#focusable').focus();
                    }
                    func(e);
                })
            } else if (typeof tgid == 'object') {
                $.each(tgid, function (i, tgid_val) {
                    document.getElementById(tgid_val).addEventListener('paste', function (e) {
                        //按下ENTER，且不是TEXTAREA，關閉小鍵盤
                        if (event.keyCode == 13 && $(this).attr('type').toUpperCase() != 'TEXTAREA') {
                            $('#focusable').focus();
                        }
                        func(e);
                    })
                })
            }
        },
        longpress: function (tgid, func) {
           

            if (typeof tgid == 'string') {
                document.getElementById(tgid).addEventListener(eventdown, function (e) {
                    window[tgid + '_pressing'] = true;
                });
                document.getElementById(tgid).addEventListener(eventup, function (e) {
                    console.log('scrollhave' + scrollhave)
                    window[tgid + '_pressing'] = null;
                    if (scrollhave) { return false };//任何up事件如果有scroll過，取消執行
                    func(e);
                })
            } else if (typeof tgid == 'object') {
                $.each(tgid, function (i, tgid_val) {
                    document.getElementById(tgid_val).addEventListener(eventdown, function (e) {
                        window[tgid + '_pressing'] = true;
                    });
                    document.getElementById(tgid_val).addEventListener(eventup, function (e) {
                        console.log('scrollhave' + scrollhave)
                        window[tgid + '_pressing'] = null;
                        if (scrollhave) { return false };//任何up事件如果有scroll過，取消執行
                        func(e);
                    })
                })
            }
        }
    }
    //===自定綁定事件+事件前固定執行


    //---client存檔
    function savetxtblob(filename, str) {
        //做個loading畫面避免後續資料太多
        //---20181009 轉csv亂碼，繁中的csv 預設編碼ANSI(?)
        //---不過SERVER端，需做browser的版本判斷，不支援直接disabled
        //轉TXT，用TAB隔開
        //var tabs = lines[line].split('\\t'); <--讀回來切tab
        //--這裡改編碼無效，click觸發是看「這張」html的編碼
        var csvContent = "data:text/txt;charset=utf-8,\ufeff";
        if (window.navigator.msSaveOrOpenBlob) {
            csvContent = "\ufeff";
        }

        csvContent += str
        console.log(csvContent);

        var blob = new Blob([csvContent], { type: 'text/txt' });//編確有問題可以改 text/txt;charset=utf-8;
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            var elem = window.document.createElement('a');
            //var encodedUri = encodeURI(csvContent); //預設用法，檔案太大無法傳
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    //---讀檔從拖拉txt
    function readtxtblob() {
        //拖拉讀檔，載入使用者自訂存檔內容
        if (typeof window.FileReader === 'undefined') {
            console.log('瀏覽器版本不支援!');
            return false;
        } else {
            $('#body_div').append('<div id="holder" style="width:200px;height:200px;border:1px solid black"></div>');
            var holder = document.getElementById('holder');

            holder.ondragover = function () {
                this.className = 'hover';
                return false;
            };

            holder.ondragend = function () {
                this.className = '';
                return false;
            };

            holder.ondrop = function (e) {
                this.className = '';
                e.preventDefault();

                var file = e.dataTransfer.files[0],
                    reader = new FileReader();
                reader.onload = function (event) {
                    console.log(event.target.result);
                    //holder.innerText = event.target.result;
                    //讀取完畢
                    //$('#loadedtxt').val(event.target.result);
                };
                console.log(file);
                reader.readAsText(file);


                return false;
            };
        }
    }
    //===讀檔從拖拉txt

    //---轉出word
    //xmlsrc: word轉xml檔案路徑, dataobj: {欄位:值}
    function towordxml(xmlsrc, dataobj) {
        /*
    123.xml，word轉出的xml檔，word裡需要填入的欄位用「開發人員選項」，「文字方塊」去放入，欄位名稱對應input id，
    找<w:t>$title</w:t>，有時候會被切開<w:t>$</w:t><w:t>title</w:t>，自己編輯xml合併即可
    */

        /*
        ------------作法(1)
        1. word表單建立轉xml
        2. xml打包進app
        3. 用下載方式存進download / call fileplugin 放到SD卡
        6. 編碼+加密
        ------------作法(2)
        4. call API參數傳遠端，doc檔放server端，doc檔可隨時改動
        5. server端可建帳號/資料夾管控，產出的文件檔可從電腦操作，不用再從手機拉出來

        */
        $.ajax({
            //type: "GET", url: '123.xml', cache: false, async: false,
            type: "GET", url: xmlsrc, cache: false, async: false,
            success: function (str) {
                var retstr = '';
                retstr = new XMLSerializer().serializeToString(str);
                var keyar = Object.keys(dataobj);
                $.each(keyar, function (i, keyar_val) {
                    retstr = replaceAll(retstr, ('$' + $(this).attr('id')), $(this).val());
                })

                var filename = 'output.xml';
                savetxtblob(filename, retstr);
            }
        });
    }
    //===轉出word


    //---橫向選擇
    /*
                var ss = selectobjgen('select1', [1, 2, 3, 4], ['一', '二', '三', '四'] );
                ss.okfunc = function () {//選擇完成執行事件
                    console.log(this.rtnstr + 'ok!!');
                }

                var ss1 = selectobjgen('select2', [4, 3, 2, 1], ['四', '三', '二', '一', ] );
                ss1.okfunc = function () {
                    console.log(this.rtnstr + 'ok1!!');
                }

                select_sald.selectedfunc = function (event) {//選取事件
                console.log('選了我' + event.currentTarget.id);
            }
            select_sald.unselectedfunc = function (event) {//取消選取事件
                console.log('取消了我' + event.currentTarget.id);
            }

            select_dtpkmm.setProp(0, 0, 340, 100, 10, 'white', false, 2, '請選擇月份', null, null, null, 'img/Blank.png', null, '#ff0000',null);
            */
    //選項選擇
    function selectobjgenv(id, valuear, textar, optar) {
        var selectobj = {
            id: id,
            ismult: true,//是複選
            /*註解: 值 */
            valuear: valuear,
            /*註解: 顯示內容 */
            textar: textar,
            /*註解: 選項attr */
            optar: optar,
            /*標題說明*/
            title: '',
            /*註解: relative ,absolute */
            fontsize: 40,
            /*註解: background-image URL路徑 */
            bgimg: '',
            /*註解: 確認背景 URL路徑 */
            okimg: '',
            /*註解: 取消背景 URL路徑 */
            cancelimg: '',
            /*註解: 確認顯示文字 */
            ok: '確認',
            /*註解: 取消顯示文字, 設''隱藏取消按鈕 */
            cancel: '取消',
            /*註解: 固定在下方欄，確認與取消中間的字串，拿來放合計 */
            footerimg: '',
            footer: '',
            /*註解: 字體 ex: 微軟正黑體,Arial,Times New Roman */
            fontfamily: 'Calibri,微軟正黑體',
            /*註解: 文字顏色 */
            color: 'white',
            /*註解: 選項分隔高度 */
            dvhehgit: 10,
            /*註解: 選項分隔高度 */
            selectable: true,
            /*後續搭配搜尋cols難改，原先是單純搜尋框針對index 做hide/show，用td做稍嫌麻煩*/
            cols: 1,
            width: 300,
            height: 80,
            panelleft: 10,
            paneltop: 10,
            panelw: 700,
            panelh: 80,
            setProp: function (panelleft, paneltop, panelw, panelh, width, height, fontsize, color, ismult, cols, title, footer, ok, cancel, bgimg, okimg, cancelimg, footerimg) {
                //(id != undefined) ? selectobj.id = id : '';
                (panelleft != undefined) ? selectobj.panelleft = panelleft : '';
                (paneltop != undefined) ? selectobj.paneltop = paneltop : '';
                (panelw != undefined) ? selectobj.panelw = panelw : '';
                (panelh != undefined) ? selectobj.panelh = panelh : '';
                (width != undefined) ? selectobj.width = width : '';
                (height != undefined) ? selectobj.height = height : '';
                (fontsize != undefined) ? selectobj.fontsize = fontsize : '';
                (color != undefined) ? selectobj.color = color : '';
                (ismult != undefined) ? selectobj.ismult = ismult : '';
                (cols != undefined) ? selectobj.cols = cols : '';
                (title != undefined) ? selectobj.title = title : '';
                (footer != undefined) ? selectobj.footer = footer : '';
                (ok != undefined) ? selectobj.ok = ok : '';
                (cancel != undefined) ? selectobj.cancel = cancel : '';
                (bgimg != undefined) ? selectobj.bgimg = bgimg : '';
                (okimg != undefined) ? selectobj.okimg = okimg : '';
                (cancelimg != undefined) ? selectobj.cancelimg = cancelimg : '';
                (footerimg != undefined) ? selectobj.footerimg = footerimg : '';

            },
            /*註解: 貼入容器ID */
            append: function (appendid) {
                if (window[this.id]) {
                    if ($('#' + this.id).length == 0) {
                        console.log('已存在同名select，清空');
                        //沒有存在實際dom，記憶體殘渣，直接清
                        window[this.id] = null;
                    } else {
                        //有存在，同一畫面重覆定義
                        console.log('已存在同名select，停止');
                        return false;
                    }
                }
                window[this.id] = this;
                this.rtnstr = '';
                console.log(selectobj.bgimg);
                var appendstr = '<div id="' + this.id + '" style="position:absolute;left:' + selectobj.panelleft + 'px;top:' + selectobj.paneltop + 'px;overflow:hidden;width:' + selectobj.panelw + 'px;height:' + selectobj.panelh + 'px;-webkit-overflow-scrolling:touch;';

                (selectobj.bgimg.indexOf('.png') > -1 || selectobj.bgimg.indexOf('.jpg') > -1 || selectobj.bgimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.bgimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.bgimg.indexOf('#') == 0 || selectobj.bgimg.indexOf('rgb(') == 0 || selectobj.bgimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.bgimg + ';' : '';
                appendstr += ';font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '" title="scroll">'


                //menu本體 top50 height -50 扣除title列高度
                //appendstr += '<div style="position:absolute;top:60px;left:0px;width:' + selectobj.panelw + 'px;height:' + (selectobj.panelh - 60) + 'px;overflow:auto;-webkit-overflow-scrolling:touch;white-space: pre;">'
                appendstr += '<div style="position:absolute;top:60px;left:0px;width:' + selectobj.panelw + 'px;height:' + (selectobj.panelh - 60) + 'px;overflow:auto;-webkit-overflow-scrolling:touch;' + (this.cols == 0 ? 'white-space: pre' : '') + '">'
                appendstr += '<div id="' + this.id + '_option" style="height:' + (selectobj.panelh - 150) + 'px;display:table-cell;vertical-align:middle;overflow:auto;-webkit-overflow-scrolling:touch;" title="scroll">'

                for (var i = 0; i < this.textar.length; i++) {
                    var optionar_val = this.textar[i];
                    var opt_val = this.textar[i];
                    if (this.optar != undefined && this.optar[i] != undefined) {
                        opt_val = this.optar[i];
                    }

                    //appendstr += '<div id="c_' + this.id + '_' + i + '"style="width:' + this.width + 'px;height:' + this.height + 'px;display: inline-block;vertical-align:top;overflow:hidden;margin-left:' + this.dvhehgit + 'px;-webkit-border-radius: 10px;">';
                    appendstr += '<div id="c_' + this.id + '_' + i + '"style="width:' + (this.cols == 0 ? this.width : parseInt((this.panelw - ((this.cols + 2) * this.dvhehgit)) / this.cols)) + 'px;height:' + this.height + 'px;display: inline-block;vertical-align:top;overflow:hidden;margin-left:' + this.dvhehgit + 'px;margin-top:' + this.dvhehgit + 'px">';
                    appendstr += '<div style="width:' + this.width + 'px;height:' + this.height + 'px;margin-left:auto;margin-right:auto;overflow:hidden">';
                    appendstr += '<div id="' + this.id + '_' + i + '" style="width:' + this.width + 'px;height:' + this.height + 'px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal;background-color:rgba(0,0,0,0.5); padding:10px" value="' + this.valuear[i] + '" ' + opt_val + '>' + optionar_val;
                    appendstr += '<img id="i_' + this.id + '_' + i + '"style="position:absolute;top:5px;left:5px;width:30px;height:30px;" src="img/check_circle_n.png">';
                    appendstr += '</div>';
                    appendstr += '</div>';
                    appendstr += '</div>';

                    ((i + 1) % this.cols == 0) ? appendstr += '</tr><tr>' : '';
                }

                appendstr += '</div>'
                appendstr += '</div>'
                //標題
                appendstr += '<div style="position:absolute;left:0px;top:0px;width:100%">' + ((this.title != '') ? this.title : '');
                appendstr += '<div style="position:absolute;left:' + (this.panelw - 170) + 'px;top:0px"><input id="' + this.id + '_search" type="text" style="text-align:center;width:150px;background-color:transparent;border-color: transparent;border-bottom:1px solid gray;background-image:url(\'img/search.png\');background-repeat:no-repeat;background-size:40px;padding:0px 0px 0px 10px;font-size:30px"  /></div>'
                appendstr += '</div>';

                //下方確認footer，都先hidden
                appendstr += '<div style="position:absolute;left:0px;top:1180px;width:720px;height:100px;" hidden>'
                appendstr += '<div style="position:absolute;left:80px;top:0px;overflow-x:hidden;overflow-y:auto;width:540px;height:100px;';
                (selectobj.footerimg.indexOf('.png') > -1 || selectobj.footerimg.indexOf('.jpg') > -1 || selectobj.footerimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.footerimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.footerimg.indexOf('#') == 0 || selectobj.footerimg.indexOf('rgb(') == 0 || selectobj.footerimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.footerimg + ';' : '';
                appendstr += 'font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '"><div id="' + this.id + '_footer" style="width:540px;height:100px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal">' + this.footer + '</div></div>';
                //下方取消
                appendstr += '<div id="' + this.id + '_cancel" style="position:absolute;left:10px;top:10px;overflow-x:hidden;overflow-y:auto;width:80px;height:80px;';
                (selectobj.cancelimg.indexOf('.png') > -1 || selectobj.cancelimg.indexOf('.jpg') > -1 || selectobj.cancelimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.cancelimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.cancelimg.indexOf('#') == 0 || selectobj.cancelimg.indexOf('rgb(') == 0 || selectobj.cancelimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.cancelimg + ';' : '';
                appendstr += 'font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '"><div style="width:80px;height:80px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal">' + this.cancel + '</div></div>'
                //下方確認
                appendstr += '<div id="' + this.id + '_ok" style="position:absolute;left:620px;top:10px;overflow-x:hidden;overflow-y:auto;width:80px;height:80px;';
                (selectobj.okimg.indexOf('.png') > -1 || selectobj.okimg.indexOf('.jpg') > -1 || selectobj.okimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.okimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.okimg.indexOf('#') == 0 || selectobj.okimg.indexOf('rgb(') == 0 || selectobj.okimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.okimg + ';' : '';
                appendstr += 'font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '"><div style="width:80px;height:80px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal">' + this.ok + '</div></div>'
                appendstr += '</div>'
                appendstr += '</div>'

                $('#' + appendid).append(appendstr);
                //取消, remove
                document.getElementById(this.id + '_cancel').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_cancel', '');
                    if (window[objname].cancelfunc != null) {
                        window[objname].cancelfunc(event);
                    }
                    $('#' + window[event.currentTarget.id.replace('_cancel', '')].id).remove();
                    window[objname] = null;
                });

                if (this.cancel == '') {
                    $('#' + this.id + '_cancel').hide();
                }

                //確認
                document.getElementById(this.id + '_ok').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_ok', '');
                    window[objname].rtnar = [];
                    var cnt = 0;
                    while ($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).length > 0) {
                        if ($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).attr('selected') == 'selected') {
                            window[objname].rtnar.push($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).attr('value'));
                        }
                        cnt += 1;
                    }

                    //console.log('選取回傳:' + window[objname].rtnstr);
                    var okfunc = true;
                    if (window[objname].okfunc != null) {
                        okfunc = window[objname].okfunc(event);
                        if (okfunc == undefined) {
                            okfunc = true;
                        }
                    }

                    if (okfunc) {//okfunc 回傳true或不回傳，關閉選擇，否則卡住
                        $('#' + window[objname].id).remove();
                        window[objname] = null;
                    }
                });

                //搜尋
                document.getElementById(this.id + '_search').addEventListener('keyup', function (event) {
                    var objname = event.currentTarget.id.replace('_search', '');
                    if (window[objname].searchfunc != null) {
                        window[objname].searchfunc(event);
                    }
                });

                //option selected 事件綁定
                if (this.selectable) {
                    for (var i = 0; i < this.textar.length; i++) {
                        var optionar_val = this.textar[i];
                        document.getElementById(this.id + '_' + i).addEventListener(eventup, function (event) {
                            if ($(event.target).is('input') || $(event.target).is('textarea')) {
                                return false;
                            }
                            var objname = event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_'));

                            if ($(this).attr('selected') == 'selected') {
                                //$(this).css('background-image', 'url(\'img/select_n.png\')');
                                $('#i_' + event.currentTarget.id).attr('src', 'img/check_circle_n.png');
                                $(this).removeAttr('selected');
                            } else {

                                if (!window[objname].ismult) {//不允許複選
                                    //console.log('不允許複選');
                                    var cnt = 0;
                                    while ($('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).length > 0) {
                                        $('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).removeAttr('selected');
                                        $('#i_' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).attr('src', 'img/check_circle_n.png');
                                        cnt += 1;
                                    }
                                }
                                $('#i_' + event.currentTarget.id).attr('src', 'img/check_circle_y.png');
                                $(this).attr('selected', 'selected');

                            }

                            //執行選取事件
                            if ($(this).attr('selected') == 'selected' && window[objname].selectedfunc != null) {
                                window[objname].selectedfunc(event);
                            } else if ($(this).attr('selected') == undefined && window[objname].unselectedfunc != null) {
                                window[objname].unselectedfunc(event);
                            }
                        });
                    };
                }
            },
            selectedfunc: null,//ok回傳事件
            unselectedfunc: null,//ok回傳事件
            okfunc: null,//ok回傳事件
            cancelfunc: null,//cancel回傳事件
            //search事件，預設搜尋html()，如果html不是純文字，改寫判斷式
            searchfunc: function (event) {
                var objname = event.currentTarget.id.replace('_search', '');
                var cnt = 0;
                while ($('#' + objname + '_' + cnt).length > 0) {
                    if ($('#' + objname + '_' + cnt).html().indexOf($(event.currentTarget).val()) == -1) {
                        $('#c_' + objname + '_' + cnt).hide();
                    } else {
                        $('#c_' + objname + '_' + cnt).show();
                    }
                    cnt += 1;
                }
            },
            rtnar: []//回傳obj
        }
        //selectobj.append(appendid);
        return selectobj;
    }

    //===橫向選擇

    //---Object選單
    /*
    傳入id, object陣列，會產生容器裡面放置陣列個數的div，每個div裡放隱型的input置入object的值
            var object_libr = objeditor('object_libr', dbprocess.dbobj.libr);
            object_libr.setProp(10, 10, 700, 550, 300, 140, 30, 'white', false, 2, '卡庫', null, null, null, '', '#3D9738', '#DE4334', null, null, '#F35369', '卡庫名稱');
            object_libr.showfunc = function (obj) {
                var divobj = adddivobj();
                divobj.setProp('', 40, 10, 140, 50, 30, 'white', obj['卡庫名稱'], null, null, '', 'left')
                divobj.setProp('', 30, 60, 240, 50, 20, 'white', obj['備註'], null, null, '', 'left')
                return divobj.appendtext;
            }
            object_libr.append('body_div');

    */
    //選項選擇
    function objeditor(id, objar) {
        var selectobj = {
            id: id,
            objar: objar,
            ismult: true,//是複選
            /*註解: 值 */
            /*註解: 顯示內容 */
            /*註解: 選項attr */
            /*標題說明*/
            title: '',
            /*註解: relative ,absolute */
            fontsize: 40,
            /*註解: background-image URL路徑 */
            bgimg: '',
            /*註解: 確認背景 URL路徑 */
            okimg: '',
            /*註解: 取消背景 URL路徑 */
            cancelimg: '',
            /*註解: 確認顯示文字 */
            ok: '確認',
            /*註解: 取消顯示文字, 設''隱藏取消按鈕 */
            cancel: '取消',
            /*註解: 固定在下方欄，確認與取消中間的字串，拿來放合計 */
            contentimg: 'rgba(0,0,0,0.3)',
            footerimg: '',
            footer: '',
            /*註解: 字體 ex: 微軟正黑體,Arial,Times New Roman */
            fontfamily: 'Calibri,微軟正黑體',
            /*註解: 文字顏色 */
            color: 'white',
            /*註解: 選項分隔高度 */
            dvhehgit: 10,
            /*註解: 選項分隔高度 */
            selectable: true,
            selectshow: true,
            searchfield: '',
            closeable: true,
            dragable: false,
            skipfirst: false,
            /*後續搭配搜尋cols難改，原先是單純搜尋框針對index 做hide/show，用td做稍嫌麻煩*/
            cols: 1,
            width: 300,
            height: 80,
            panelleft: 10,
            paneltop: 10,
            panelw: 700,
            panelh: 80,
            addmode: false,
            pagelength: 100,
            pageidx: 1,
            selectedidx :-1,
            searchobj:null,
            showfunc: function (name) {
                alert(name)
            },
            setProp: function (panelleft, paneltop, panelw, panelh, width, height, fontsize, color, ismult, cols, title, footer, ok, cancel, bgimg, okimg, cancelimg, footerimg, dvhehgit, contentimg, searchfield, selectshow, closeable, dragable, skipfirst, addmode, pagelength, pageidx) {
                /// <summary>傳入object自動產生內容</summary>
                /// <param name="panelleft">int :容器left</param>
                /// <param name="paneltop">int 容器top</param>
                /// <param name="dragable">bool 是否可拖拉</param>
                /// <param name="selectshow">bool 是否顯示選取勾</param>
                /// <param name="closeable">bool 是否顯示關閉</param>
                /// <param name="searchfield">string 用object 裡哪個key做搜尋欄位</param>
                /// <param name="skipfirst">bool 是否跳過第1行</param>
                /// <param name="color">str 字色/色碼</param>
                /// <param name="title">str 標題</param>
                /// <param name="ismult">bool 是否複選</param>
                /// <param name="cols">int 每行幾個元件</param>
                /// <param name="addmode">bool 新增模式</param>
                /// <param name="contentimg">str 列表底色/色碼</param>
                /// <param name="pagelength">int 每頁個數，預設為100</param>
                /// <param name="pageidx">int 當前頁數，預設為1</param>


                /// <returns></returns>
                //(id != undefined) ? selectobj.id = id : '';
                (panelleft != undefined) ? selectobj.panelleft = panelleft : '';
                (paneltop != undefined) ? selectobj.paneltop = paneltop : '';
                (panelw != undefined) ? selectobj.panelw = panelw : '';
                (panelh != undefined) ? selectobj.panelh = panelh : '';
                (width != undefined) ? selectobj.width = width : '';
                (height != undefined) ? selectobj.height = height : '';
                (fontsize != undefined) ? selectobj.fontsize = fontsize : '';
                (color != undefined) ? selectobj.color = color : '';
                (ismult != undefined) ? selectobj.ismult = ismult : '';
                (cols != undefined) ? selectobj.cols = cols : '';
                (title != undefined) ? selectobj.title = title : '';
                (footer != undefined) ? selectobj.footer = footer : '';
                (ok != undefined) ? selectobj.ok = ok : '';
                (cancel != undefined) ? selectobj.cancel = cancel : '';
                (bgimg != undefined) ? selectobj.bgimg = bgimg : '';
                (okimg != undefined) ? selectobj.okimg = okimg : '';
                (cancelimg != undefined) ? selectobj.cancelimg = cancelimg : '';
                (footerimg != undefined) ? selectobj.footerimg = footerimg : '';
                (dvhehgit != undefined) ? selectobj.dvhehgit = dvhehgit : '';
                (contentimg != undefined) ? selectobj.contentimg = contentimg : '';
                (searchfield != undefined) ? selectobj.searchfield = searchfield : '';
                (selectshow != undefined) ? selectobj.selectshow = selectshow : '';
                (closeable != undefined) ? selectobj.closeable = closeable : '';
                (dragable != undefined) ? selectobj.dragable = dragable : '';
                (skipfirst != undefined) ? selectobj.skipfirst = skipfirst : '';
                (addmode != undefined) ? selectobj.addmode = addmode : '';
                (pagelength != undefined) ? selectobj.pagelength = pagelength : '';
                (pageidx != undefined) ? selectobj.pageidx = pageidx : '';




            },
            /*註解: 貼入容器ID */
            append: function (appendid) {
                if (window[this.id]) {
                    if ($('#' + this.id).length == 0) {
                        //console.log('已存在同名select，清空');
                        //沒有存在實際dom，記憶體殘渣，直接清
                        window[this.id] = null;
                    } else {
                        //有存在，同一畫面重覆定義
                        //console.log('已存在同名select，停止');
                        return false;
                    }
                }
                window[this.id] = this;
                var divobj = adddivobj();
                this.rtnstr = '';
                //console.log(selectobj.bgimg);
                var appendstr = '<div id="' + this.id + '" style="position:absolute;left:' + selectobj.panelleft + 'px;top:' + selectobj.paneltop + 'px;overflow:hidden;width:' + selectobj.panelw + 'px;height:' + selectobj.panelh + 'px;';
                (selectobj.bgimg.indexOf('.png') > -1 || selectobj.bgimg.indexOf('.jpg') > -1 || selectobj.bgimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.bgimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                (selectobj.bgimg.indexOf('#') == 0 || selectobj.bgimg.indexOf('rgb(') == 0 || selectobj.bgimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.bgimg + ';' : '';
                appendstr += ';font-size:' + this.fontsize + 'px;font-family:' + this.fontfamily + ';color:' + this.color + '">'
                //標題，搜尋，關閉
                appendstr += '<div id="' + this.id + '_title" style="position:absolute;left:10px;top:10px;width:100%">' + ((this.title != '') ? this.title : '');
                appendstr += '<div style="position:absolute;left:' + (this.panelw - 220) + 'px;top:0px" ' + (this.searchfield == '' ? 'hidden' : '') + '><input id="' + this.id + '_search" type="text" style="text-align:center;width:150px;background-color:transparent;border-color: transparent;border-bottom:1px solid gray;background-image:url(\'img/search.png\');background-repeat:no-repeat;background-size:40px;padding:0px 0px 0px 10px;font-size:' + this.fontsize + 'px"  /></div>'
                //分頁設定

                //關閉
                divobj.setProp(this.id + '_close', (this.panelw - 60), 0, 40, 40, 30, 'white', '', null, null, imgs.cancel, 'center', null, !this.closeable);
                divobj.setProp(this.id + '_nosearch', 380, 0, 60, 60, 28, '#fbe983', '<img src="' + imgs.home + '" width="30px" style="">', '', '', 'rgba(0,0,0,0.5)', 'center', null, (this.addmode || this.searchfield == '' ? true : null), null, null, null);
                divobj.setProp(this.id + '_searchtext', 440, 0, 170, 60, 26, 'white', '', '', '搜尋', 'rgba(0,0,0,0.5)', null, null, (this.addmode || this.searchfield == '' ? true : null), 'Calibri,微軟正黑體', null, null, '輸入搜尋字元', 20, null);
                divobj.setProp(this.id + '_searchgo', 610, 0, 60, 60, 28, '#fbe983', '<img src="' + imgs2.cc203 + '" width="30px" style="">', '', '', 'rgba(0,0,0,0.5)', 'center', null, (this.addmode || this.searchfield == '' ? true : null), null, null, null);
                divobj.setProp(this.id + '_pagenow', 10, 0, 70, 60, 30, 'white', '', selectobj.pageidx, '頁碼', 'rgba(0,0,0,0.3)', null, null, (this.addmode || this.searchfield == '' ? true : null), 'Calibri,微軟正黑體', null, null, '999', 20, null);
                divobj.setProp(this.id + '_pagetotal', 80, 0, 90, 60, 30, 'white', '', '999', '頁數', 'rgba(0,0,0,0.5)', null, null, (this.addmode || this.searchfield == '' ? true : null), 'Calibri,微軟正黑體', null, null, '999', 20, null);
                appendstr += divobj.appendtext;
                divobj.appendtext = '';
                appendstr += '</div>';



                //menu本體 top50 height -50 扣除title列高度 //will-change:scroll-position
                appendstr += '<div style="position:absolute;top:70px;left:0px;width:' + selectobj.panelw + 'px;height:' + (selectobj.panelh - 70) + 'px;overflow:auto;-webkit-overflow-scrolling:touch;' + (this.cols == 0 ? 'white-space: nowrap;' : '') + 'will-change:scroll-position,transform" title="scroll">'
                appendstr += '<div id="' + this.id + '_option" style="height:' + (selectobj.panelh - 150) + 'px;display:table-cell;vertical-align:middle;" >'


                if (this.addmode) {
                    //新增模式，第1行是object欄位名稱
                    for (var i = 0; i < 1; i++) {

                        appendstr += '<div id="c_' + this.id + '_' + i + '"style="width:' + (this.panelw - 40) + 'px;height:' + (this.panelh - 200) + 'px;display: inline-block;vertical-align:top;overflow:hidden;margin-left:' + this.dvhehgit + 'px;margin-top:' + this.dvhehgit + 'px">';
                        appendstr += '<div style="width:' + (this.panelw - 40) + 'px;height:' + (this.panelh - 220) + 'px;margin-left:auto;margin-right:auto;overflow:hidden">';
                        //內容的框

                        appendstr += '<div id="' + this.id + '_' + i + '" style="width:' + (this.panelw - 60) + 'px;height:' + (this.panelh - 200) + 'px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal;-webkit-border-radius: 10px;';
                        (selectobj.contentimg.indexOf('.png') > -1 || selectobj.contentimg.indexOf('.jpg') > -1 || selectobj.contentimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.contentimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                        (selectobj.contentimg.indexOf('#') == 0 || selectobj.contentimg.indexOf('rgb(') == 0 || selectobj.contentimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.contentimg + ';' : '';
                        appendstr += 'padding:10px">';

                        //內容設定
                        appendstr += selectobj.showfunc(objar[i], i);
                        //隱藏欄位帶入內容

                        $.each(Object.keys(objar[0]), function (j, keyar_val) {
                            //appendstr += '<input ' + keyar_val + ' type="text" style="text-align:center;width:' + (selectobj.panelw-60) + 'px;font-size:40px" value="' + objar[i][keyar_val] + '" hidden readonly>';//帶值
                            appendstr += '<input ' + keyar_val + ' type="text" style="text-align:center;width:' + ((selectobj.panelw == undefined ? 1 : selectobj.panelw) - 60) + 'px;font-size:40px" hidden readonly>';//不帶值
                        });
                        appendstr += '<img id="i_' + this.id + '_' + i + '"style="position:absolute;top:5px;left:5px;width:30px;height:30px;" src="img/check_circle_n.png" ' + (this.selectshow ? '' : 'hidden') + '>';

                        appendstr += '</div>';
                        appendstr += '</div>';
                        appendstr += '</div>';


                    }
                } else {
                    //瀏覽模式
                    //不要避開第一欄表頭，後面條件查詢沒有表頭

                    var pageobj = this.objar.filter(function (item, index, array) {
                        return index >= ((selectobj.pageidx - 1) * selectobj.pagelength) && index < ((selectobj.pageidx) * selectobj.pagelength);    // 取得陣列中index 小於100
                    });


                    //取出內容

                    for (var i = 0; i < pageobj.length ; i++) {


                        if (this.skipfirst && i == 0) {
                            //跳過第一行
                        } else {
                            appendstr += '<div id="c_' + this.id + '_' + i + '"style="width:' + (this.cols == 0 ? this.width : parseInt((this.panelw - (this.dvhehgit * 2) - (this.cols * this.dvhehgit)) / this.cols)) + 'px;height:' + this.height + 'px;display: inline-block;vertical-align:top;overflow:hidden;margin-left:' + this.dvhehgit + 'px;margin-top:' + this.dvhehgit + 'px">';
                            appendstr += '<div style="width:' + this.width + 'px;height:' + this.height + 'px;margin-left:auto;margin-right:auto;overflow:hidden">';
                            //內容的框

                            appendstr += '<div id="' + this.id + '_' + i + '" style="width:' + this.width + 'px;height:' + this.height + 'px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal;-webkit-border-radius: 10px;';
                            (selectobj.contentimg.indexOf('.png') > -1 || selectobj.contentimg.indexOf('.jpg') > -1 || selectobj.contentimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + selectobj.contentimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                            (selectobj.contentimg.indexOf('#') == 0 || selectobj.contentimg.indexOf('rgb(') == 0 || selectobj.contentimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + selectobj.contentimg + ';' : '';
                            appendstr += 'padding:10px">';

                            //內容設定
                            appendstr += selectobj.showfunc(pageobj[i], i);
                            //隱藏欄位帶入內容

                            $.each(Object.keys(pageobj[0]), function (j, keyar_val) {
                                appendstr += '<input ' + keyar_val + ' type="text" style="text-align:center;width:' + selectobj.width + 'px" value="' + pageobj[i][keyar_val] + '" readonly hidden >';
                            });
                            appendstr += '<img id="i_' + this.id + '_' + i + '"style="position:absolute;top:5px;left:5px;width:30px;height:30px;" src="img/check_circle_n.png" ' + (this.selectshow ? '' : 'hidden') + '>';
                            appendstr += '</div></div></div>';
                        }

                    }

                    if ((this.skipfirst && pageobj.length == 1) || pageobj.length == 0) {
                        //跳過第一行且長度為1，或:長度為0，沒有內容
                        appendstr += '<div style="width:' + this.panelw + ';text-align:center">沒有內容可以顯示...</div>';
                    }

                }

                appendstr += '</div></div>'

                //搜尋功能+上一頁下一頁DOM
                appendstr += '<div id="' + this.id + '_searchbar" style="position:absolute;left:0px;top:' + (this.panelh - 60) + 'px;width:100%" ' + (this.addmode || this.searchfield == ''? 'hidden' : '') + '>';
                //分頁設定
                divobj.setProp(this.id + '_prev', 440, 0, 60, 60, 30, 'white', '<img src="' + imgs2.cc172 + '" width="60px" style="position:absolute;left:0px;top:-2px">', null, null, 'rgba(0,0,0,0.5)', 'center', '10', null, null, null, null);
                divobj.setProp(this.id + '_next', 540, 0, 60, 60, 30, 'white', '<img src="' + imgs2.cc173 + '" width="60px" style="position:absolute;left:0px;top:-2px">', null, null, 'rgba(0,0,0,0.5)', 'center', '10', null, null, null, 0);
                appendstr += divobj.appendtext;
                divobj.appendtext = '';
                appendstr += '</div>';


                //下方確認footer，都先hidden
                appendstr += '<div style="position:absolute;left:0px;top:'+(this.panelh -100)+'px;width:720px;height:100px;" ' + (this.addmode  ? '' : 'hidden') + ' >'


                divobj.setProp('', 80, 0, 540, 100, 30, 'white', this.footer, null, null, this.footerimg, 'center');
                appendstr += divobj.append();

                //下方取消
                divobj.setProp(this.id + '_cancel', 10, 10, 180, 80, 30, 'white', '<img src="' + imgs2.cc199 + '" width="30px" style="margin-top:5px">取消', null, null, selectobj.cancelimg, 'center', 10, null, null, 'white', 2);
                appendstr += divobj.append();

                //下方確認
                divobj.setProp(this.id + '_ok', 520, 10, 180, 80, 30, 'white', '<img src="' + imgs2.cc200 + '" width="30px" style="margin-top:5px">確認', null, null, selectobj.okimg, 'center', 10, null, null, 'white', 2);
                appendstr += divobj.append();

                appendstr += '</div>'
                appendstr += '</div>'

                //console.log(appendstr);
                $('#' + appendid).append(appendstr);

                //頁碼僅供讀取
                var maxpage = Math.ceil(objar.length / this.pagelength);
                $('#' + this.id + '_pagetotal_input').attr('readonly', 'readonly');
                $('#' + this.id + '_pagetotal_input').val(maxpage);
                
                //手key 頁碼
                addevt.keydown(this.id + '_pagenow_input', function (event) {
                    //console.log(event.keyCode);
                    if (event.keyCode == 13 && $('#' + event.currentTarget.id).attr('type').toUpperCase() != 'TEXTAREA') {
                        
                        var tgid = event.currentTarget.id.replace('_pagenow_input', '');
                        var result = $('#' + event.currentTarget.id).val();
                        var maxpage;

                        if (window[tgid].searchobj != null) {
                            maxpage = Math.ceil(window[tgid].searchobj.length / window[tgid].pagelength);
                        } else {
                            maxpage = Math.ceil(window[tgid].objar.length / window[tgid].pagelength);
                        }
                        if (!jQuery.isNumeric(result) || parseInt(result) < 0) {//數字檢查，是數字，且>0
                            $('#' + event.currentTarget.id).val('1');
                            return false;
                        } else {
                            console.log('in');
                            if (parseInt(result) > maxpage) {
                                window[tgid].pageidx = maxpage
                                $('#' + event.currentTarget.id).val(maxpage);
                            } else {
                                window[tgid].pageidx = parseInt(result);
                                $('#' + event.currentTarget.id).val(result);
                            }
                            

                            window[tgid].nextpagefunc(tgid);

                        }
                    }

                    
                });

                //取消搜尋
                addevt.up(this.id + '_nosearch', function (event) {
                    var tgid = event.currentTarget.id.replace('_nosearch', '');
                    $('#' + tgid + '_searchtext_input').val('');
                    window[tgid].searchgofunc($('#' + tgid + '_searchtext_input').val());
                });

                //下一頁
                addevt.up(this.id + '_next', function (event) {
                    var tgid = event.currentTarget.id.replace('_next', '');
                    var maxpage;
                    if (window[tgid].searchobj != null) {
                        maxpage = Math.ceil(window[tgid].searchobj.length / window[tgid].pagelength);
                    } else {
                        maxpage = Math.ceil(window[tgid].objar.length / window[tgid].pagelength);
                    }

                    window[tgid].pageidx += 1;
                    (window[tgid].pageidx > maxpage) ? window[tgid].pageidx = 1 : '';

                    $('#' + tgid + '_pagenow_input').val(window[tgid].pageidx);
                    window[tgid].nextpagefunc(tgid);
                });

                //上一頁
                addevt.up(this.id + '_prev', function (event) {
                    var tgid = event.currentTarget.id.replace('_prev', '');
                    var maxpage;
                    if (window[tgid].searchobj != null) {
                        maxpage = Math.ceil(window[tgid].searchobj.length / window[tgid].pagelength);
                    } else {
                        maxpage = Math.ceil(window[tgid].objar.length / window[tgid].pagelength);
                    }

                    window[tgid].pageidx -= 1;
                    (window[tgid].pageidx < 1) ? window[tgid].pageidx = maxpage : '';

                    $('#' + tgid + '_pagenow_input').val(window[tgid].pageidx);
                    window[tgid].nextpagefunc(tgid);
                });


                //搜尋
                addevt.up(this.id + '_searchgo', function (event) {
                    var tgid = event.currentTarget.id.replace('_searchgo', '');
                    
                    window[tgid].searchgofunc($('#' + tgid + '_searchtext_input').val());
                });

                //搜尋keyup
                addevt.keydown(this.id + '_searchtext_input', function (event) {
                    //console.log(event.keyCode);
                    if (event.keyCode == 13 && $('#' + event.currentTarget.id).attr('type').toUpperCase() != 'TEXTAREA') {

                        var tgid = event.currentTarget.id.replace('_searchtext_input', '');
                        window[tgid].searchgofunc($('#' + tgid + '_searchtext_input').val());
                    }

                });

                

                



                //取消, remove
                document.getElementById(this.id + '_cancel').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_cancel', '');
                    if (window[objname].cancelfunc != null) {
                        window[objname].cancelfunc(event);
                    }
                    $('#' + window[event.currentTarget.id.replace('_cancel', '')].id).remove();
                    window[objname] = null;
                });

                if (this.cancel == '') {
                    $('#' + this.id + '_cancel').hide();
                }

                //確認
                document.getElementById(this.id + '_ok').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_ok', '');
                    window[objname].rtnar = [];
                    var cnt = 0;
                    while ($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).length > 0) {
                        if ($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).attr('selected') == 'selected') {
                            window[objname].rtnar.push($('#' + event.currentTarget.id.replace('_ok', '_') + cnt).attr('value'));
                        }
                        cnt += 1;
                    }

                    //console.log('選取回傳:' + window[objname].rtnstr);
                    var okfunc = true;
                    if (window[objname].okfunc != null) {
                        okfunc = window[objname].okfunc(event);
                        if (okfunc == undefined) {
                            okfunc = true;
                        }
                    }

                    if (okfunc) {//okfunc 回傳true或不回傳，關閉選擇，否則卡住
                        $('#' + window[objname].id).remove();
                        window[objname] = null;
                    }
                });

                //搜尋
                $('#' + this.id + '_search').hide();
                document.getElementById(this.id + '_search').addEventListener('keyup', function (event) {
                    var objname = event.currentTarget.id.replace('_search', '');
                    if (window[objname].searchfunc != null) {
                        window[objname].searchfunc(event, window[objname].searchfield);
                    }
                });

                //關閉
                document.getElementById(this.id + '_close').addEventListener(eventup, function (event) {
                    var objname = event.currentTarget.id.replace('_close', '');
                    drag_flag = 0;
                    $('#' + window[objname].id).remove();
                    window[objname] = null;
                });

                //option selected 事件綁定
                if (this.selectable && this.addmode == false) {//可以選取，且不是新增模式
                    for (var i = 0; i < pageobj.length ; i++) {
                        if (this.skipfirst && i == 0) {
                            //跳過第一行
                        } else {
                            var optionar_val = i;
                            //console.log(this.id + '_' + i);
                            addevt.up(this.id + '_' + i, function (event) {

                                if ($(event.target).is('input') || $(event.target).is('textarea')) {
                                    return false;
                                }
                                var objname = event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_'));
                                //console.log(objname);

                                if ($(event.currentTarget).attr('selected') == 'selected') {
                                    //$(this).css('background-image', 'url(\'img/select_n.png\')');
                                    $('#i_' + event.currentTarget.id).attr('src', 'img/check_circle_n.png');
                                    $(event.currentTarget).removeAttr('selected');
                                } else {

                                    if (!window[objname].ismult) {//不允許複選
                                        //console.log('不允許複選');
                                        var cnt = 0;
                                        while ($('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).length > 0) {
                                            $('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).removeAttr('selected');
                                            $('#i_' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).attr('src', 'img/check_circle_n.png');
                                            cnt += 1;
                                        }
                                    }
                                    $('#i_' + event.currentTarget.id).attr('src', 'img/check_circle_y.png');
                                    $(event.currentTarget).attr('selected', 'selected');

                                }

                                //執行選取事件
                                if ($(event.currentTarget).attr('selected') == 'selected' && window[objname].selectedfunc != null) {
                                    window[objname].selectedfunc(event);
                                } else if ($(event.currentTarget).attr('selected') == undefined && window[objname].unselectedfunc != null) {
                                    window[objname].unselectedfunc(event);
                                }
                                window[objname].selectedidx = parseInt(replaceAll(event.currentTarget.id, window[objname].id + '_', ''));
                            })
                        };
                    }
                }
                //拖拉
                if (this.dragable) {
                    fn_dragstart(this.id, 0, 0, 0, this.id + '_title');
                }

                //append完執行事件
                
                if (this.afterappend != null) {
                    this.afterappend();
                }
            },
            afterappend:null,//append完執行事件
            selectedfunc: null,//ok回傳事件
            unselectedfunc: null,//ok回傳事件
            okfunc: null,//ok回傳事件
            cancelfunc: null,//cancel回傳事件
            //search事件，預設搜尋html()，如果html不是純文字，改寫判斷式
            searchfunc: function (event, searchfield) {
                var objname = event.currentTarget.id.replace('_search', '');
                //console.log(objname);
                var cnt = (window[objname].skipfirst ? 1 : 0);
                while ($('#' + objname + '_' + cnt).length > 0) {
                    var searchstr = '';
                    $('#' + objname + '_' + cnt + ' input').each(function () {
                        if (searchfield != '') {//有設定搜尋的欄位
                            if ($(this).attr(searchfield) == '') {
                                searchstr += $(this).val();
                            }
                        } else {
                            searchstr += $(this).val();
                        }

                    })
                    //console.log(searchstr);
                    if (searchstr.indexOf($(event.currentTarget).val()) == -1) {
                        $('#c_' + objname + '_' + cnt).hide();
                    } else {
                        $('#c_' + objname + '_' + cnt).show();
                    }
                    cnt += 1;
                }
            }, savefunc: function () {
                /// <summary>搭配新增模式使用，把user輸入的，填進我們預設產生(id_0)的input裡</summary>
                /// <summary>回傳Object</summary>
                var insertobj = {}
                $.each(Object.keys(objar[0]), function (j, keyar_val) {
                    //填值

                    $('#' + selectobj.id + '_0 [' + keyar_val + ']').val($('#' + selectobj.id + ' [' + keyar_val + ']').eq($('#' + selectobj.id + ' [' + keyar_val + ']').length - 1).val());
                    //console.log(selectobj.id + '_' + keyar_val + '_' + $('#' + selectobj.id + ' [' + keyar_val + ']').val());
                    //console.log(selectobj.id + '_' + keyar_val + '_' + $('#' + selectobj.id + '_0 [' + keyar_val + ']').val());
                    insertobj[keyar_val] = ($('#' + selectobj.id + '_0 [' + keyar_val + ']').val() || '');
                });
                return insertobj;
            }, nextpagefunc: function () {//下一頁
                $('#focusable').focus();
                //不要避開第一欄表頭，後面條件查詢沒有表頭
                var appendstr = '';
                if (this.searchobj != null) {//有搜尋結果用搜尋結果，否則用全部
                    var pageobj = this.searchobj.filter(function (item, index, array) {
                        return index >= ((selectobj.pageidx - 1) * selectobj.pagelength) && index < ((selectobj.pageidx) * selectobj.pagelength);    // 取得陣列中index 小於100
                    });
                } else {
                    var pageobj = this.objar.filter(function (item, index, array) {
                        return index >= ((selectobj.pageidx - 1) * selectobj.pagelength) && index < ((selectobj.pageidx) * selectobj.pagelength);    // 取得陣列中index 小於100
                    });
                }
                

                $('#' + this.id + '_option').html('');
                //取出內容
                for (var i = 0; i < pageobj.length ; i++) {


                    if (this.skipfirst && i == 0) {
                        //跳過第一行
                    } else {
                        appendstr += '<div id="c_' + this.id + '_' + i + '"style="width:' + (this.cols == 0 ? this.width : parseInt((this.panelw - (this.dvhehgit * 2) - (this.cols * this.dvhehgit)) / this.cols)) + 'px;height:' + this.height + 'px;display: inline-block;vertical-align:top;overflow:hidden;margin-left:' + this.dvhehgit + 'px;margin-top:' + this.dvhehgit + 'px">';
                        appendstr += '<div style="width:' + this.width + 'px;height:' + this.height + 'px;margin-left:auto;margin-right:auto;overflow:hidden">';
                        //內容的框

                        appendstr += '<div id="' + this.id + '_' + i + '" style="width:' + this.width + 'px;height:' + this.height + 'px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal;-webkit-border-radius: 10px;';
                        (this.contentimg.indexOf('.png') > -1 || this.contentimg.indexOf('.jpg') > -1 || this.contentimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + this.contentimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                        (this.contentimg.indexOf('#') == 0 || this.contentimg.indexOf('rgb(') == 0 || this.contentimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + this.contentimg + ';' : '';
                        appendstr += 'padding:10px">';

                        //內容設定
                        appendstr += this.showfunc(pageobj[i], i);
                        //隱藏欄位帶入內容

                        $.each(Object.keys(pageobj[0]), function (j, keyar_val) {
                            appendstr += '<input ' + keyar_val + ' type="text" style="text-align:center;width:' + this.width + 'px" value="' + pageobj[i][keyar_val] + '" readonly hidden >';
                        });
                        appendstr += '<img id="i_' + this.id + '_' + i + '"style="position:absolute;top:5px;left:5px;width:30px;height:30px;" src="img/check_circle_n.png" ' + (this.selectshow ? '' : 'hidden') + '>';
                        appendstr += '</div></div></div>';
                    }

                }

                if ((this.skipfirst && pageobj.length == 1) || pageobj.length == 0) {
                    //跳過第一行且長度為1，或:長度為0，沒有內容
                    appendstr += '<div style="width:' + this.panelw + ';text-align:center">沒有內容可以顯示...</div>';
                }

                $('#' + this.id + '_option').append(appendstr);


                for (var i = 0; i < pageobj.length ; i++) {
                    if (this.skipfirst && i == 0) {
                        //跳過第一行
                    } else {
                        var optionar_val = i;
                        addevt.up(this.id + '_' + i, function (event) {
                            if ($(event.target).is('input') || $(event.target).is('textarea')) {
                                return false;
                            }
                            var objname = event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_'));

                            if ($(event.currentTarget).attr('selected') == 'selected') {
                                //$(this).css('background-image', 'url(\'img/select_n.png\')');
                                $('#i_' + event.currentTarget.id).attr('src', 'img/check_circle_n.png');
                                $(event.currentTarget).removeAttr('selected');
                            } else {

                                if (!window[objname].ismult) {//不允許複選
                                    //console.log('不允許複選');
                                    var cnt = 0;
                                    while ($('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).length > 0) {
                                        $('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).removeAttr('selected');
                                        $('#i_' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).attr('src', 'img/check_circle_n.png');
                                        cnt += 1;
                                    }
                                }
                                $('#i_' + event.currentTarget.id).attr('src', 'img/check_circle_y.png');
                                $(event.currentTarget).attr('selected', 'selected');

                            }

                            //執行選取事件
                            if ($(event.currentTarget).attr('selected') == 'selected' && window[objname].selectedfunc != null) {
                                window[objname].selectedfunc(event);
                            } else if ($(event.currentTarget).attr('selected') == undefined && window[objname].unselectedfunc != null) {
                                window[objname].unselectedfunc(event);
                            }
                            window[objname].selectedidx = parseInt(replaceAll(event.currentTarget.id, window[objname].id + '_', ''));
                        })
                    };
                }


                this.selectedidx = -1;
                if (this.afterappend != null) {
                    this.afterappend();
                }
            },
            searchgofunc: function (searchstr) {//新版搜尋
                $('#focusable').focus();
                //不要避開第一欄表頭，後面條件查詢沒有表頭
                var appendstr = '';
                //console.log(searchstr);
                this.searchobj = this.objar.filter(function (item, index, array) {
                    var searchname_ar = selectobj.searchfield.split(',');//多欄位用,隔開
                    var newitem = {};
                    $.each(Object.keys(item), function (i, key_val) {
                        if (searchname_ar.indexOf(key_val) > -1) {
                            newitem[key_val] = item[key_val];//不是搜尋欄位的，清掉
                        } else {
                            newitem[key_val] = '';
                        }
                    });
                    //console.log(newitem);
                    var sourcestr = findstrval_object2str([newitem], true);
                    
                    //sourcestr = sourcestr.toLowerCase();
                    sourcestr = replaceAll(sourcestr, 'undefined', '');
                    return sourcestr.indexOf(searchstr) > -1//搜尋不分大小寫
                    //return sourcestr.indexOf(searchstr.toLowerCase()) > -1//搜尋不分大小寫
                });

                //設定新總頁數
                var maxpage = Math.ceil(this.searchobj.length / this.pagelength);
                $('#' + this.id + '_pagetotal_input').val(maxpage);
                $('#' + this.id + '_pagenow_input').val('1');
                this.pageidx = 1;

                
                var pageobj = this.searchobj.filter(function (item, index, array) {
                    return index >= ((selectobj.pageidx - 1) * selectobj.pagelength) && index < ((selectobj.pageidx) * selectobj.pagelength);    // 取得陣列中index 小於100
                });

                


                //console.log(pageobj);
                $('#' + this.id + '_option').html('');
                //取出內容
                for (var i = 0; i < pageobj.length ; i++) {


                    if (this.skipfirst && i == 0) {
                        //跳過第一行
                    } else {
                        appendstr += '<div id="c_' + this.id + '_' + i + '"style="width:' + (this.cols == 0 ? this.width : parseInt((this.panelw - (this.dvhehgit * 2) - (this.cols * this.dvhehgit)) / this.cols)) + 'px;height:' + this.height + 'px;display: inline-block;vertical-align:top;overflow:hidden;margin-left:' + this.dvhehgit + 'px;margin-top:' + this.dvhehgit + 'px">';
                        appendstr += '<div style="width:' + this.width + 'px;height:' + this.height + 'px;margin-left:auto;margin-right:auto;overflow:hidden">';
                        //內容的框

                        appendstr += '<div id="' + this.id + '_' + i + '" style="width:' + this.width + 'px;height:' + this.height + 'px;display:table-cell;vertical-align:middle;text-align:center;white-space:pre-wrap;word-break:normal;-webkit-border-radius: 10px;';
                        (this.contentimg.indexOf('.png') > -1 || this.contentimg.indexOf('.jpg') > -1 || this.contentimg.indexOf('.bmp') > -1) ? appendstr += 'background-image:url(\'' + this.contentimg + '\');background-repeat:no-repeat;background-size:100% 100%;' : '';
                        (this.contentimg.indexOf('#') == 0 || this.contentimg.indexOf('rgb(') == 0 || this.contentimg.indexOf('rgba(') == 0) ? appendstr += 'background-color:' + this.contentimg + ';' : '';
                        appendstr += 'padding:10px">';

                        //內容設定
                        appendstr += this.showfunc(pageobj[i], i);
                        //隱藏欄位帶入內容

                        $.each(Object.keys(pageobj[0]), function (j, keyar_val) {
                            appendstr += '<input ' + keyar_val + ' type="text" style="text-align:center;width:' + this.width + 'px" value="' + pageobj[i][keyar_val] + '" readonly hidden >';
                        });
                        appendstr += '<img id="i_' + this.id + '_' + i + '"style="position:absolute;top:5px;left:5px;width:30px;height:30px;" src="img/check_circle_n.png" ' + (this.selectshow ? '' : 'hidden') + '>';
                        appendstr += '</div></div></div>';
                    }

                }

                if ((this.skipfirst && pageobj.length == 1) || pageobj.length == 0) {
                    //跳過第一行且長度為1，或:長度為0，沒有內容
                    appendstr += '<div style="width:' + this.panelw + ';text-align:center">沒有內容可以顯示...</div>';
                }

                $('#' + this.id + '_option').append(appendstr);


                for (var i = 0; i < pageobj.length ; i++) {
                    if (this.skipfirst && i == 0) {
                        //跳過第一行
                    } else {
                        var optionar_val = i;
                        addevt.up(this.id + '_' + i, function (event) {
                            if ($(event.target).is('input') || $(event.target).is('textarea')) {
                                return false;
                            }
                            var objname = event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_'));

                            if ($(event.currentTarget).attr('selected') == 'selected') {
                                //$(this).css('background-image', 'url(\'img/select_n.png\')');
                                $('#i_' + event.currentTarget.id).attr('src', 'img/check_circle_n.png');
                                $(event.currentTarget).removeAttr('selected');
                            } else {

                                if (!window[objname].ismult) {//不允許複選
                                    //console.log('不允許複選');
                                    var cnt = 0;
                                    while ($('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).length > 0) {
                                        $('#' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).removeAttr('selected');
                                        $('#i_' + event.currentTarget.id.substring(0, event.currentTarget.id.lastIndexOf('_') + 1) + cnt).attr('src', 'img/check_circle_n.png');
                                        cnt += 1;
                                    }
                                }
                                $('#i_' + event.currentTarget.id).attr('src', 'img/check_circle_y.png');
                                $(event.currentTarget).attr('selected', 'selected');

                            }

                            //執行選取事件
                            if ($(event.currentTarget).attr('selected') == 'selected' && window[objname].selectedfunc != null) {
                                window[objname].selectedfunc(event);
                            } else if ($(event.currentTarget).attr('selected') == undefined && window[objname].unselectedfunc != null) {
                                window[objname].unselectedfunc(event);
                            }
                            window[objname].selectedidx = parseInt(replaceAll(event.currentTarget.id, window[objname].id + '_', ''));
                        })
                    };
                }
                this.selectedidx = -1;

                if (this.afterappend != null) {
                    this.afterappend();
                }

            },

            rtnar: []//回傳obj
        }
        //selectobj.append(appendid);
        return selectobj;
    }

    //===Object選單

    //---拍照
    var camerastart = {
        //拍完後貼入目標
        imgTarget: '',
        //拍完後存檔目標
        fileName: '',
        //傳入 拍完後貼入目標,拍完後存檔檔名
        start: function (imgTarget, fileName) {
            (imgTarget != undefined ? camerastart.imgTarget = imgTarget : '');
            (fileName != undefined ? camerastart.fileName = fileName : '');
            navigator.camera.getPicture(cameraonSuccess, cameraonFail, {
                quality: 25,
                targetWidth: 900,
                targetHeight: 1200,
                destinationType: Camera.DestinationType.DATA_URL
            });
        },
        reset: function () {
            camerastart.imgTarget = '';
            camerastart.fileName = '';
        }
    }

    function cameraonFail() {
        console.log('拍照失敗: ' + message);
    }
    function cameraonSuccess(imageData) {
        if (camerastart.imgTarget != '') {
            var image = document.getElementById(camerastart.imgTarget);
            image.src = "data:image/jpeg;base64," + imageData;
        }

        if (camerastart.fileName != '') {
            savetxt(camerastart.fileName + '.jpg', "data:image/jpeg;base64," + imageData);
        }
        //拍完清除檔名、target設定，避免蓋掉原本
        camerastart.imgTarget = '';
        camerastart.fileName = '';
        console.log('拍照完成: ' + imageData.length);
    }
    //===拍照

    //---錄音
    //recorder.start(x,y,fileName,w,h); 即可使用
    //recorder.start(50,600);
    var recorder = {
        start: function (x, y, fileName, width, height, parentid) {
            /// <summary>錄音</summary>
            /// <param name="x" type="int">x</param>
            /// <param name="y" type="int">y</param>
            /// <param name="fileName" type="str">檔名</param>
            /// <param name="width" type="int">寬</param>
            /// <param name="height" type="int">高</param>

            (fileName != undefined) ? recordFileName = fileName : recordFileName = 'DefalutRecord';//檔名設定
            var divobj = adddivobj();
            divobj.setProp('dv_micstop', 0, 0, 720, 1280, 30, null, '<img  src="' + imgs2.cc41 + '" width="60px" style=""><br>錄音中...<br>點擊任意處停止錄音', null, null, 'img/bg4.jpg', null, null, true);
            divobj.setProp('dv_micstart', x, y, width, height, 30, null, '<img  src="' + imgs2.cc40 + '" width="' + (width - 20) + 'px" style="">', null, null, 'rgba(0,0,0,0.8)', null, '10', null, null, 'white', 2);
            //divobj.setProp('dv_micstopplay', (x + width), y, width, height, 30, null, '', null, null, imgs2.cc98, null, null, true);
            divobj.setProp('dv_micstopplay', 0, 0, 720, 1280, 30, null, '<img  src="' + imgs2.cc98 + '" width="60px" style=""><br>播放中...<br>點擊任意處停止播放', null, null, 'img/bg4.jpg', null, null, true);
            divobj.setProp('dv_micplay', (x + width + 10), y, width, height, 30, null, '<img  src="' + imgs2.cc96 + '" width="' + (width - 20) + 'px" style="">', null, null, 'rgba(0,0,0,0.8)', null, 10, null, null, 'white', 2);
            if (parentid == undefined) {
                $('#body_div').append(divobj.appendtext);
            } else {
                $('#' + parentid).append(divobj.appendtext);
            }


            addevt.up('dv_micstart', function (event) {
                rc_record(fileName);
            })

            addevt.up('dv_micstop', function (event) {
                rc_stop(fileName);
            })

            addevt.up('dv_micstopplay', function (event) {
                rc_stop(fileName);
            })

            addevt.up('dv_micplay', function (event) {
                rc_play(fileName);
            })
        }

    }


    var mediaVar = null; //錄音檔元件
    var recordFileName = "DefalutRecord"; //錄音檔檔名
    var rc_status = null; //錄音狀態

    //錄音開始
    function rc_record(src) {
        //alert('開始錄音');
        if (rc_status == 'recording' || rc_status == 'playing') { return; }
        recordFileName = src + ".3gp";
        recordFileName = cordova.file.externalDataDirectory + recordFileName;

        createMedia(function () {
            //alert('cordova開始錄音' + recordFileName);
            rc_status = "recording";
            mediaVar.startRecord();
            $("#dv_micstart").hide();
            $("#dv_micstop").attr('zindex', $("#dv_micstop").css('z-index'));
            $("#dv_micstop").css('z-index', '1000');
            $("#dv_micstop").show();
            $("#dv_micplay").hide();
            $("#dv_micstopplay").hide();
        }, rc_onStatusChange);

    }


    function rc_play(src) {
        //播放
        if (rc_status == 'recording' || rc_status == 'playing') { return; }
        recordFileName = src + ".3gp";
        recordFileName = cordova.file.externalDataDirectory + recordFileName;
        createMedia(function () {
            rc_status = "playing";
            mediaVar.play();
            $("#dv_micstart").hide();
            $("#dv_micstop").hide();
            $("#dv_micstop").css('z-index', $("#dv_micstop").attr('zindex'));
            $("#dv_micplay").hide();
            $("#dv_micstopplay").attr('zindex', $("#dv_micstopplay").css('z-index'));
            $("#dv_micstopplay").css('z-index', '1000');
            $("#dv_micstopplay").show();

        });

    }

    //錄音停止
    function rc_stop(src) {
        //console.log('stop')
        recordFileName = src + ".3gp";
        if (mediaVar == null)
            return;

        if (rc_status == 'recording') {
            //正在錄音，停止錄音
            mediaVar.stopRecord();
            console.log("Recording stopped");
        }
        else if (rc_status == 'playing') {
            //正在播放，停止播放
            mediaVar.stop();
            console.log("Play stopped");
        }
        else {
            console.log("Nothing stopped");
        }

        $("#dv_micstart").show();
        $("#dv_micstop").hide();
        $("#dv_micstop").css('z-index', $("#dv_micstop").attr('zindex'));
        $("#dv_micplay").show();
        $("#dv_micstopplay").hide();
        $("#dv_micstopplay").css('z-index', $("#dv_micstopplay").attr('zindex'));

        rc_status = 'stopped';


    }

    //建立音檔串流
    function createMedia(onMediaCreated, mediaStatusCallback) {
        mediaStatusCallback = null;
        mediaVar = new Media(recordFileName, function () {
            console.log("Media created successfully");
            //alert(mediaVar.getDuration());

            $("#dv_micstart").show();
            $("#dv_micstop").hide();
            $("#dv_micstop").css('z-index', $("#dv_micstop").attr('zindex'));
            $("#dv_micplay").show();
            $("#dv_micstopplay").hide();
            $("#dv_micstopplay").css('z-index', $("#dv_micstopplay").attr('zindex'));

            rc_status = 'stopped';
        }, rc_onError, mediaStatusCallback);
        onMediaCreated();

    }


    function rc_onSuccess() {
        //播放音檔成功
        console.log("playAudio():Audio Success");
    }

    //音檔狀態變更事件
    function rc_onStatusChange() {
        if (arguments[0] == 4) //狀態碼4 = 播放完成或播放停止 play stopped
        {
            $("#dv_micstart").show();
            $("#dv_micstop").hide();
            $("#dv_micstop").css('z-index', $("#dv_micstop").attr('zindex'));
            $("#dv_micplay").show();
            $("#dv_micstopplay").hide();
            $("#dv_micstopplay").css('z-index', $("#dv_micstopplay").attr('zindex'));
        }
    }

    //錄音成功
    function rc_onSuccess() {
        //do nothing
    }

    function rc_onError(err) {
        if (typeof err.message != 'undefined')
            err = err.message;
        //錄不到一秒，檔案存檔失敗
        $("#dv_micstart").show();
        $("#dv_micstop").hide();
        $("#dv_micstop").css('z-index', $("#dv_micstop").attr('zindex'));
        $("#dv_micplay").show();
        $("#dv_micstopplay").hide();
        $("#dv_micstopplay").css('z-index', $("#dv_micstopplay").attr('zindex'));
        rc_status = 'stopped';
        console.log("錄音Error : " + err);
    }


    //--


    //===錄音

    //---載入圖檔
//imgs2.cc60 = img_set.imgcut2(6 * 103.5, 0 * 103.5, 70, 70, '#FF0000');//重設色碼

    var img_set = {
        init: function () {
            this.imgobj.src = 'img/icon.png';
            this.imgobj.addEventListener("load", function () {
                imgs.camera = img_set.imgcut(0, 0, 192, 192)
                imgs.check_circle_n = img_set.imgcut(192, 0, 192, 192)
                imgs.create_new_folder = img_set.imgcut(384, 0, 192, 192)
                imgs.micstopplay = img_set.imgcut(576, 0, 192, 192)
                imgs.micstop = img_set.imgcut(768, 0, 192, 192)
                imgs.micstart = img_set.imgcut(960, 0, 192, 192)
                imgs.micplay = img_set.imgcut(1152, 0, 192, 192)
                imgs.edit = img_set.imgcut(1342, 0, 192, 192)
                imgs.search = img_set.imgcut(1534, 0, 192, 192)
                imgs.check_circle_y = img_set.imgcut(1726, 0, 192, 192)
                imgs.settings = img_set.imgcut(0, 192, 192, 192)
                imgs.color_lens = img_set.imgcut(0, 192, 192, 192)
                imgs.cancel = img_set.imgcut(384, 192, 192, 192)
                imgs.pet = img_set.imgcut(576, 192, 192, 192)
                imgs.bookmarks = img_set.imgcut(768, 192, 192, 192)
                imgs.home = img_set.imgcut(960, 192, 192, 192)
                imgs.touch = img_set.imgcut(1152, 192, 192, 192)
                imgs.glass = img_set.imgcut(1342, 192, 192, 192)
                imgs.help = img_set.imgcut(1534, 192, 192, 192)
                imgs.shadow = img_set.imgcut(1726, 192, 192, 192)
                imgs.zoomout = img_set.imgcut(0, 384, 192, 192)
                imgs.zoomout1 = img_set.imgcut(192, 384, 192, 192)
                imgs.zoomout2 = img_set.imgcut(384, 384, 192, 192)
                imgs.zoomout3 = img_set.imgcut(576, 384, 192, 192)
                imgs.zoomout4 = img_set.imgcut(768, 384, 192, 192)
                imgs.star = img_set.imgcut(960, 384, 192, 192)
                imgs.star_yellow = img_set.imgcut(960, 384, 192, 192,'yellow')
                imgs.z0 = img_set.imgcut(0, 576, 200, 200)
                imgs.z1 = img_set.imgcut(200, 576, 200, 200)
                imgs.z2 = img_set.imgcut(400, 576, 200, 200)
                imgs.z3 = img_set.imgcut(600, 576, 200, 200)
                imgs.z4 = img_set.imgcut(800, 576, 200, 200)
                imgs.z5 = img_set.imgcut(0, 776, 200, 200)
                imgs.z6 = img_set.imgcut(200, 776, 200, 200)
                imgs.z7 = img_set.imgcut(400, 776, 200, 200)
                imgs.z8 = img_set.imgcut(600, 776, 200, 200)
                imgs.z9 = img_set.imgcut(800, 776, 200, 200)
                img_set.loadcnt += 1;//預載圖檔
                
            }, false);
            this.imgobj2.src = 'img/icon2.png';
            this.imgobj2.addEventListener("load", function () {
                img_set.loadcnt += 1;//預載圖檔
                
                for (var i = 0; i < 22; i++) {
                    for (var j = 0; j < 10; j++) {
                        imgs2['cc' + String(i) + String(j)] = img_set.imgcut2(j * 103.5, i * 103.5, 70, 70)
                    }
                }
            }, false);

        },
        imgobj: new Image(),
        imgobj2: new Image(),
        imgobj3: new Image(),
        imgcut: function (x, y, w, h, color) {
            var c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            var ctx = c.getContext("2d");
            ctx.drawImage(img_set.imgobj, x, y, w, h, 0, 0, w, h);
            if (color != undefined) {
                ctx.globalCompositeOperation = "source-in";
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, c.width, c.height);
            }

            return c.toDataURL()
        },
        imgcut2: function (x, y, w, h, color) {
            var c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            var ctx = c.getContext("2d");
            ctx.drawImage(img_set.imgobj2, x, y, w, h, 0, 0, w, h);
            if (color != undefined) {
                ctx.globalCompositeOperation = "source-in";
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, c.width, c.height);
            }
            return c.toDataURL()
        },
        imgcut3: function (x, y, w, h) {
            var c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            var ctx = c.getContext("2d");
            ctx.drawImage(img_set.imgobj3, x, y, w, h, 0, 0, w, h);


            return c.toDataURL()
        },
        loadcnt: 0,//載入圖檔進度
        
    }
    img_set.init();

    var imgs = {
        //拍照
        camera: null,
        //圓型勾
        check_circle_n: null,
        imgstr: function (id, absolute, x, y, width, height, imgsrc, style, memo, isdiv, divstr) {
            /// <summary>回傳img</summary>
            /// <param name="id" type="str">id</param>
            /// <param name="absolute" type="bool">是否絕對定位</param>
            /// <param name="x" type="int">x</param>
            /// <param name="y" type="int">y</param>
            /// <param name="width" type="int">width, null 不設定</param>
            /// <param name="height" type="int">height , null 不設定</param>
            /// <param name="imgsrc" type="str">圖片來源</param>
            /// <param name="style" type="str">css</param>
            /// <param name="memo" type="str">加在tag裡的註記</param>
            /// <param name="isdiv" type="bool">是否div</param>
            /// <param name="divstr" type="str">div內容</param>

            var rtnstr = '';
            if (isdiv) {
                rtnstr = '<div ' + ((id != undefined && id != '') ? 'id="' + id + '"' : '') + ' style="' + ((absolute) ? 'position:absolute;' : '') + ((width != undefined) ? 'width:' + width + 'px;' : '') + ((height != undefined) ? 'height:"' + height + 'px;' : '') + style + ';';
                ((imgsrc.indexOf('data:image/jpeg') > -1 || imgsrc.indexOf('data:image/png') > -1 || imgsrc.indexOf('.png') > -1 || imgsrc.indexOf('.jpg') > -1 || imgsrc.indexOf('.bmp') > -1) ? rtnstr += 'background-image:url(\'' + imgsrc + '\');background-repeat:no-repeat;background-size:100% 100%;' : '');
                ((imgsrc.indexOf('#') == 0 || imgsrc.indexOf('rgb(') == 0 || imgsrc.indexOf('rgba(') == 0) ? rtnstr += 'background-color:' + imgsrc + ';' : '');
                rtnstr += '" ' + ((memo != undefined && memo != '') ? memo + ' ' : '') + '>' + ((divstr != undefined) ? divstr : '') + '</div>';
                console.log(rtnstr);
            } else {
                rtnstr = '<img ' + ((id != undefined && id != '') ? 'id="' + id + '"' : '') + '  src="' + imgsrc + '" ' + ((width != undefined) ? 'width="' + width + 'px"' : '') + ' ' + ((height != undefined) ? 'height="' + height + 'px"' : '') + ' style="' + ((absolute) ? 'position:absolute;' : '') + style + '" ' + ((memo != undefined && memo != '') ? memo + ' ' : '') + '>';
            }

            return rtnstr;
        }
    }
    var imgs2 = {

    }
    //放自訂圖檔的地方
    var imgs3 = {

    }

    //自切圖檔
    function fn_cutimg(imgsrc, xx, yy, ww, hh, outname) {
        /// <summary>範圍內取1自切圖檔</summary>
        /// <summary>切完成放在 imgs3[outname] 物件裡面</summary>
        /// <summary>ex: fn_cutimg(projectPath + '/img/img1z.jpg', 0, 0, null, null, 'ans1');</summary>
        /// <param name="imgsrc" type="str">圖檔路徑</param>
        /// <param name="xx" type="int">切圖 x 起點</param>
        /// <param name="yy" type="int">切圖 y 起點</param>
        /// <param name="ww" type="int">切圖 y 起點</param>
        /// <param name="hh" type="int">切圖 y 起點</param>
        /// <param name="outname" type="str">放在imgs3 裡面的key值</param>
        var tempimg = new Image();
        tempimg.src = imgsrc;
        tempimg.addEventListener("load", function () {
            (ww == undefined) ? ww = tempimg.width : '';
            (hh == undefined) ? hh = tempimg.height : '';
            var c = document.createElement("canvas");
            c.width = ww;
            c.height = hh;
            var ctx = c.getContext("2d");
            ctx.drawImage(tempimg, xx, yy, ww, hh, 0, 0, ww, hh);
            imgs3[outname] = c.toDataURL();
        }, false);

    }
    //===載入圖檔




    //---色彩選擇器選色器
    //color_picker.init();
    //color_picker.selectfunc = function () {
    //}

    /*
    #4B79CF
    #37AD79
    #93AC12
    #9A673C
    #E3993A
    #D8521F
    #4F8A1C
    #B73621
    #B92D76
    #BB2F78
    #5D39B9
    #224E76
    */

    //var colorcode = ['#224E76','#37AD79','#4B79CF','#4F8A1C','#5D39B9','#93AC12','#9A673C','#B73621','#B92D76','#BB2F78','#D8521F','#E3993A']

    /*
    '#FFFFFF'
    '#00FF00'
    '#fbe983'
    '#9fe1e7'
    */
    var colorcode = [
        '#FF0000', '#cd74e6', '#0000FF', '#a47ae2', '#000000',
        '#224E76', '#37AD79', '#4B79CF', '#4F8A1C', '#5D39B9',
        '#93AC12', '#9A673C', '#B73621', '#B92D76', '#BB2F78',
        '#D8521F', '#E3993A', '#5980BA', '#167AC6', '#16a765',
        '#42d692', '#14C59B', '#cabdbf', '#FCAEF5', '#F35369',
        '#fa573c', '#f83a22', '#d06b64', '#ff7537', '#ffad46',
        '#BEC3C9', '#ac725e', '#7bd148', '#b3dc6c', '#f691b2',
        '#fad165', '#92e1c0', '#cca6ac', '#9fc6e7', '#4986e7',
        '#9a9cff', '#b99aff', '#c2c2c2'
    ];

    var color_picker = {
        init: function () {
            var color_pickerobj = objeditor('dv_colorpicker', zf_ArrayToObject(colorcode, 'color'));
            color_pickerobj.setProp(0, 0, 350, 370, 40, 40, 30, 'white', false, 5, '選色', null, null, null, 'rgba(0,0,0,0.5)', '#3D9738', '#DE4334', null, null, '', null, false, true, true);
            color_pickerobj.showfunc = function (obj) {
                var divobj = adddivobj();
                divobj.setProp('', 0, 0, 40, 40, 30, 'white', '', null, null, obj.color, 'left')
                return divobj.appendtext;
            }
            color_pickerobj.append('body_div');
            color_pickerobj.selectedfunc = function (event) {
                color_picker.selectedcolor = $('#' + event.currentTarget.id + ' [color]').val();//回傳色碼
                color_picker.selectfunc(event);
            }

        },
        selectedcolor: '',
        selectfunc: function () {
        },
    }

    //===色彩選擇器

    //---播放音檔
    function playsound(url, type) {
        /// <summary>播放音檔</summary>
        /// <param name="url" type="str">檔名</param>
        /// <param name="type" type="int">1: 是錄音檔</param>
        if (isios == -1) {

            $('#main_audio').attr('src', '');
            //$('#main_audio').attr('src', 'mp3/' + url + '.mp3');
            $('#main_audio').attr('src', projectPath + '/mp3/' + url + '.mp3');
            try {
                document.getElementById('main_audio').play();
            } catch (e) {
                console.log('沒音檔');
            }

        } else {
            if (type == 1) {
                //console.log('準備播音檔-------------------')
                playAudio(cordova.file.externalDataDirectory + url + '.3gp');//是錄音
            } else {
                playAudio(cordova.file.applicationDirectory + 'www/' + projectPath + '/mp3/' + url + '.mp3');
            }

        }
    }
    //===

    //---畫布
    function canvasgen(id, x, y, editmode,bgimg,stylemode) {
        /// <summary>產生畫布</summary>
        /// <param name="id" type="str">畫布id，不可含_</param>
        /// <param name="x" type="str">left</param>
        /// <param name="y" type="str">top</param>
        /// <param name="editmode" type="str">編輯模式，預設為true</param>
        /// <param name="bgimg" type="str">底層畫布</param>
        var obj = {
            id: id,
            /*lineWidth: 筆畫粗細 */
            lineWidth: "3",
            /*strokeStyle: 筆畫設定 */
            strokeStyle: "black",
            /*註解: 選項attr */
            bgcolor: 'white',
            bgimg: (bgimg == undefined ? '' : bgimg),
            left: (x == undefined ? 0 : x),
            top: (y == undefined ? 0 : y),
            stylemode: (stylemode == undefined ? 1 : stylemode),
            posstr: '',
            posar: [],
            pause: [0, 0],
            speed: 20,//1-5
            downflag: false,
            cleft: 0,
            ctop: 0,
            interval: null,
            //width: 720,//固定寬滿版
            //height:600,//固定高
            /*註解: 貼入容器ID */
            append: function (appendid) {
                if (window[this.id]) {
                    if ($('#' + this.id).length == 0) {
                        //console.log('已存在同名canvas，清空');
                        clearInterval(window[this.id].interval);
                        window[this.id].interval = null;

                        //沒有存在實際dom，記憶體殘渣，直接清
                        window[this.id] = null;
                    } else {
                        //有存在，同一畫面重覆定義
                        //console.log('已存在同名canvas，停止');
                        return false;
                    }
                }
                (editmode == undefined) ? editmode = true : '';//編輯模式，true開啟工具列，false關閉
                console.log('editmode:' + editmode);
                window[this.id] = this;
                this.rtnstr = '';
                var appendstr = '<div 畫布 id="' + this.id + '" style="position:absolute;left:' + obj.left + 'px;top:' + obj.top + 'px;overflow:hidden;width:720px;height:600px;">'
                appendstr += (obj.bgimg != '' ? '<img style="position:absolute;top:0px;left:0px;width:600px;height:600px;" src="' + obj.bgimg + '">' : '');
                (obj.bgimg != '' ? obj.bgcolor = 'rgba(0,0,0,0)' : '');
                appendstr += '<canvas id="canvas_' + this.id + '" style="position:absolute;left:0;top:0px;border:1px solid;background-color:' + obj.bgcolor + '" width="600" height="600" ></canvas>';
                appendstr += '<div id="mask_' + this.id + '" style="position:absolute;left:0;top:0px;width:720px;height:600px;" ></div>';
                appendstr += '<div id="maskf_' + this.id + '" style="position:absolute;left:0;top:0px;width:720px;height:600px;" hidden ></div>';
                appendstr += '</div>';

                $('#' + appendid).append(appendstr);

                //開始畫
                addevt.down('canvas_' + this.id, function (event) {
                    //outxy
                    var egid = event.currentTarget.id;
                    var tgid = replaceAll(egid, 'canvas_', '');
                    console.log(tgid);
                    var egidctx = tgid + 'ctx';
                    window[tgid].downflag = true;

                    window[egidctx] = document.getElementById(egid).getContext("2d");

                    window[egidctx].lineWidth = window[tgid].lineWidth;
                    window[egidctx].strokeStyle = window[tgid].strokeStyle;
                    window[egidctx].lineCap ='round';
                    


                    window[egidctx].beginPath();
                    window[tgid].cleft = $('#' + egid.replace('canvas_', '')).position().left + scalestartx;
                    window[tgid].ctop = $('#' + egid.replace('canvas_', '')).position().top + scalestarty

                    console.log(outxy.x + '_' + outxy.y);
                    var posx = outxy.x - window[tgid].cleft;
                    var posy = outxy.y - window[tgid].ctop;
                    //console.log(scalerate);
                    posx = posx / scalerate;
                    posy = posy / scalerate;
                    window[egidctx].moveTo(posx, posy);
                    window[tgid].posar.push([[window[tgid].lineWidth, window[tgid].strokeStyle]])
                    window[tgid].posar[window[tgid].posar.length - 1].push([posx, posy])
                    window[egidctx].stroke(); // Draw it
                })


                //逐點
                addevt.move('canvas_' + this.id, function (event) {
                    var egid = event.currentTarget.id;
                    var tgid = replaceAll(egid, 'canvas_', '');
                    if (window[tgid].downflag) {
                        //console.log(outxy.x + '_' + outxy.y);
                        var egidctx = tgid + 'ctx';
                        var posx = outxy.x - window[tgid].cleft;
                        var posy = outxy.y - window[tgid].ctop;
                        posx = posx / scalerate;
                        posy = posy / scalerate;
                        window[tgid].posar[window[tgid].posar.length - 1].push([posx, posy])
                        window[egidctx].lineTo(posx, posy);
                        window[egidctx].stroke(); // Draw it
                    }
                })

                var divobj = adddivobj();
                if (obj.stylemode == 1) {//編輯模式1設定右方顯示方式的不同
                    divobj.setProp(this.id + '_play', 610, 0, 90, 70, 30, 'white', '<img src="' + imgs2.cc96 + '" width="' + (editmode ? '20' : '50') + 'px" style="margin-bottom:0px">' + (editmode ? '播放' : ''), null, null, '#167AC6', null, 5, null, null, 'white', 2);
                    divobj.setProp(this.id + '_stop', 610, 90, 90, 70, 30, 'white', '<img src="' + imgs2.cc98 + '" width="' + (editmode ? '20' : '50') + 'px" style="margin-bottom:0px">' + (editmode ? '停止' : ''), null, null, '#167AC6', null, 5, true, null, 'white', 2);
                    divobj.setProp(this.id + '_pause', 610, 0, 90, 70, 30, 'white', '<img src="' + imgs2.cc97 + '" width="' + (editmode ? '20' : '50') + 'px" style="margin-bottom:0px">' + (editmode ? '暫停' : ''), null, null, '#167AC6', null, 5, true, null, 'white', 2);
                    divobj.setProp(this.id + '_save', 610, 445, 90, 70, 30, 'white', '<img src="' + imgs2.cc81 + '" width="20px" style="margin-bottom:0px">儲存', null, null, '#FF0000', null, 5, null, null, 'white', 2);
                    divobj.setProp(this.id + '_clear', 610, 525, 90, 70, 30, 'white', '<img src="' + imgs2.cc23 + '" width="20px" style="margin-top:0px">清空', null, null, '#9A673C', null, 5, null, null, 'white', 2);

                    $('#' + this.id).append(divobj.appendtext);

                    //選色
                    var colorchk = addchkobj([
                        '<div style="width:40px;height:40px;background-color:#000000"></div>',
                        '<div style="width:40px;height:40px;background-color:#FF0000"></div>',
                        '<div style="width:40px;height:40px;background-color:#00FF00"></div>',
                        '<div style="width:40px;height:40px;background-color:#0000FF"></div>',
                        '<div style="width:40px;height:40px;background-color:#5D39B9"></div>',
                        '<div style="width:40px;height:40px;background-color:#fad165"></div>'],
                        ['#000000', '#ff0000', '#00ff00', '#0000ff', '#5D39B9', '#fad165'], ['#000000']);
                    colorchk.setProp(this.id + '_color', 610, 165, 40, 40, 2, false, 20);
                    colorchk.selectedfunc = function (event) {
                        var egid = event.currentTarget.id;
                        var tgid = egid.substring(0, egid.indexOf('_color'));
                        window[tgid].strokeStyle = $(event.currentTarget).attr('value');
                    }

                    colorchk.append(this.id);



                    //選色
                    var sizechk = addchkobj([
                        '<img style="width:7px;height:7px;background-color:#ffffff;-webkit-border-radius:70px">',
                        '<img style="width:14px;height:14px;background-color:#ffffff;-webkit-border-radius:28px">',
                        '<img style="width:21px;height:21px;background-color:#ffffff;-webkit-border-radius:42px">',
                        '<img style="width:28px;height:28px;background-color:#ffffff;-webkit-border-radius:280px">',
                    ],
                        [3, 9, 15, 21], [3]);
                    sizechk.setProp(this.id + '_size', 610, 335, 40, 40, 2, false, 20);
                    sizechk.selectedfunc = function (event) {
                        var egid = event.currentTarget.id;
                        var tgid = egid.substring(0, egid.indexOf('_size'));
                        window[tgid].lineWidth = parseInt($(event.currentTarget).attr('value'));
                    }

                    sizechk.append(this.id);
                }else if (obj.stylemode == 2) {//編輯模式2
                    divobj.setProp(this.id + '_play', 605, 0, 90, 90, 30, 'white', '<img src="' + imgs2.cc96 + '" width=50px" >', null, null, '#4f8a1c', null, 10, null, null, 'white', 3);
                    divobj.setProp(this.id + '_stop', 605, 100, 90, 90, 30, 'white', '<img src="' + imgs2.cc98 + '" width=50px" >', null, null, '#ca0000', null, 10, true, null, 'white', 3);
                    divobj.setProp(this.id + '_pause', 605, 0, 90, 90, 30, 'white', '<img src="' + imgs2.cc97 + '" width=50px" >', null, null, '#167AC6', null, 10, true, null, 'white', 3);
                    divobj.setProp(this.id + '_save', 605, 445, 90, 90, 30, 'white', '<img src="' + imgs2.cc81 + '" width="50px" >', null, null, '#FF0000', null, 10, true, null, 'white', 3);
                    divobj.setProp(this.id + '_clear', 605, 505, 90, 90, 30, 'white', '<img src="' + imgs2.cc23 + '" width="50px" >', null, null, '#9A673C', null, 10, null, null, 'white', 3);

                    $('#' + this.id).append(divobj.appendtext);

                    //選色
                    var colorchk_divobj1 = adddivobj();
                    colorchk_divobj1.setProp('', 0, 0, 90, 60, 30, 'white', '<img src="' + imgs2.cc10 + '" width="50px" >', null, null, '#000000', null, null, null, null, null, null)
                    var colorchk_divobj2 = adddivobj();
                    colorchk_divobj2.setProp('', 0, 0, 90, 60, 30, 'white', '<img src="' + imgs2.cc10 + '" width="50px" >', null, null, '#FF0000', null, null, null, null, null, null)
                    var colorchk_divobj3 = adddivobj();
                    colorchk_divobj3.setProp('', 0, 0, 90, 60, 30, 'white', '<img src="' + imgs2.cc10 + '" width="50px" >', null, null, '#4f8a1c', null, null, null, null, null, null)
                    var colorchk_divobj4 = adddivobj();
                    colorchk_divobj4.setProp('', 0, 0, 90, 60, 30, 'white', '<img src="' + imgs2.cc10 + '" width="50px" >', null, null, '#0000ff', null, null, null, null, null, null)
                    var colorchk = addchkobj([
                        colorchk_divobj1.append(),
                        colorchk_divobj2.append(),
                        colorchk_divobj3.append(),
                        colorchk_divobj4.append()
                        ],
                        ['#000000', '#ff0000', '#4f8a1c', '#0000ff'], ['#000000']);
                    colorchk.setProp(this.id + '_color', 605, 210, 90, 66, 1, false, 20);
                    colorchk.selectedfunc = function (event) {
                        var egid = event.currentTarget.id;
                        var tgid = egid.substring(0, egid.indexOf('_color'));
                        window[tgid].strokeStyle = $(event.currentTarget).attr('value');
                    }

                    colorchk.append(this.id);



                    //選色
                    var sizechk = addchkobj([
                        '<img style="width:7px;height:7px;background-color:#ffffff;-webkit-border-radius:70px">',
                        '<img style="width:14px;height:14px;background-color:#ffffff;-webkit-border-radius:28px">',
                        '<img style="width:21px;height:21px;background-color:#ffffff;-webkit-border-radius:42px">',
                        '<img style="width:28px;height:28px;background-color:#ffffff;-webkit-border-radius:280px">',
                    ],
                        [3, 9, 15, 21], [3]);
                    sizechk.setProp(this.id + '_size', 605, 335, 40, 40, 2, false, 3);
                    sizechk.selectedfunc = function (event) {
                        var egid = event.currentTarget.id;
                        var tgid = egid.substring(0, egid.indexOf('_size'));
                        window[tgid].lineWidth = parseInt($(event.currentTarget).attr('value'));
                    }

                    sizechk.append(this.id);
                    $('#' + this.id + '_size').hide();
                }
                
                
                //console.log('editmode:' + editmode);
                if (!editmode) {//
                    $('#' + this.id + '_size').hide();
                    $('#' + this.id + '_color').hide();
                    $('#' + this.id + '_save').hide();
                    $('#' + this.id + '_clear').hide();
                    $('#maskf_' + this.id).show();//永不消失的mask
                }
                //先隱藏儲存
               // $('#' + this.id + '_save').hide();


                //清
                addevt.up(this.id + '_clear', function (event) {
                    var egid = event.currentTarget.id;
                    var tgid = replaceAll(egid, '_clear', '');
                    var egidctx = tgid + 'ctx';

                    clearInterval(window[tgid].interval);
                    window[tgid].interval = null;
                    window[tgid].pause = [0, 0];
                    $('#' + tgid + '_stop').hide();
                    $('#' + tgid + '_pause').hide();
                    $('#' + tgid + '_play').show();
                    $('#mask_' + tgid).hide();

                    window[egidctx] = document.getElementById('canvas_' + tgid).getContext("2d");
                    window[egidctx].lineWidth = window[tgid].lineWidth;
                    window[egidctx].strokeStyle = window[tgid].strokeStyle;

                    window[egidctx].stroke();
                    window[egidctx].clearRect(0, 0, $('#' + 'canvas_' + tgid).width(), $('#' + 'canvas_' + tgid).height());
                    window[tgid].posar = [];
                    window[tgid].posstr = '';

                })

                //播
                addevt.up(this.id + '_play', function (event) {
                    $(this).hide();
                    var egid = event.currentTarget.id;
                    var tgid = replaceAll(egid, '_play', '');
                    $('#' + tgid + '_stop').show();
                    $('#' + tgid + '_pause').show();
                    $('#' + tgid + '_play').hide();
                    var egidctx = tgid + 'ctx';
                    $('#mask_' + tgid).show();
                    //console.log(window[tgid].pause);//取出暫停點 [0,0] 從頭或按下stop

                    window[egidctx] = document.getElementById('canvas_' + tgid).getContext("2d");

                    window[egidctx].stroke();
                    if (window[tgid].pause[0] == 0 && window[tgid].pause[1] == 0) {//暫停重播不要清
                        window[egidctx].beginPath();
                        window[egidctx].stroke(); // Draw it
                        window[egidctx].clearRect(0, 0, $('#' + 'canvas_' + tgid).width(), $('#' + 'canvas_' + tgid).height());

                    }



                    if (!window[tgid].interval) {//沒東西在跑才能做
                        window[tgid].interval = setInterval(function () {
                            var rowno = window[tgid].pause[0];
                            var colno = window[tgid].pause[1];
                            //console.log('rowno: ' + rowno + '_' + colno);
                            var stopflag = false;
                            if (window[tgid].posar.hasOwnProperty(rowno)) {
                                //console.log('有行');
                                if (window[tgid].posar[rowno].hasOwnProperty(colno)) {
                                    //console.log('有列');
                                    //console.log('egidctx: ' + egidctx);
                                    if (colno == 0) {
                                        window[egidctx].lineWidth = window[tgid].posar[rowno][colno][0];
                                        window[egidctx].strokeStyle = window[tgid].posar[rowno][colno][1];
                                    } if (colno == 1) {
                                        window[egidctx].beginPath();
                                        var posx = window[tgid].posar[rowno][colno][0];
                                        var posy = window[tgid].posar[rowno][colno][1];
                                        window[egidctx].moveTo(posx, posy);
                                        window[egidctx].stroke(); // Draw it
                                    } else {
                                        var posx = window[tgid].posar[rowno][colno][0];
                                        var posy = window[tgid].posar[rowno][colno][1];
                                        //console.log('lineto: '+posx + '_' + posy);
                                        window[egidctx].stroke(); // Draw it
                                        window[egidctx].lineTo(posx, posy);
                                        window[egidctx].stroke(); // Draw it
                                    }
                                    colno += 1;
                                } else {
                                    //console.log('有行沒列，有沒有下一行');
                                    rowno += 1;
                                    colno = 0;
                                    if (window[tgid].posar.hasOwnProperty(rowno)) {
                                        if (window[tgid].posar[rowno].hasOwnProperty(colno)) {
                                            //console.log('有行沒列，有下一行，有列');
                                            window[egidctx].lineWidth = window[tgid].posar[rowno][colno][0];
                                            window[egidctx].strokeStyle = window[tgid].posar[rowno][colno][1];

                                            //console.log(window[tgid].posar[rowno][colno][0] + '_' + window[tgid].posar[rowno][colno][1])
                                            colno += 1;
                                        } else {
                                            //console.log('有行沒列，有下一行，沒列結束');
                                            stopflag = true;
                                        }
                                    } else {
                                        //console.log('結束');
                                        stopflag = true;
                                    }
                                }
                            } else {
                                //console.log('結束');
                                stopflag = true;
                            }

                            if (stopflag) {
                                clearInterval(window[tgid].interval);
                                window[tgid].interval = null;
                                //console.log('播完停止');
                                window[tgid].pause = [0, 0];
                                $('#' + tgid + '_stop').hide();
                                $('#' + tgid + '_pause').hide();
                                $('#' + tgid + '_play').show();
                                $('#mask_' + tgid).hide();
                            } else {
                                //console.log('---下一筆---')
                                //console.log(rowno + '_' + colno);
                                window[tgid].pause = [rowno, colno];
                            }


                        }, (500 / window[tgid].speed));
                    }
                })

                //止
                addevt.up(this.id + '_stop', function (event) {
                    $(this).hide();
                    var egid = event.currentTarget.id;
                    var tgid = replaceAll(egid, '_stop', '');
                    var egidctx = tgid + 'ctx';
                    clearInterval(window[tgid].interval);
                    window[tgid].interval = null;
                    window[tgid].pause = [0, 0];
                    $('#' + tgid + '_stop').hide();
                    $('#' + tgid + '_pause').hide();
                    $('#' + tgid + '_play').show();
                    $('#mask_' + tgid).hide();

                    //重繪

                    window[egidctx] = document.getElementById('canvas_' + tgid).getContext("2d");
                    window[egidctx].clearRect(0, 0, $('#' + 'canvas_' + tgid).width(), $('#' + 'canvas_' + tgid).height());
                    $.each(window[id].posar, function (i, posar_val) {
                        $.each(posar_val, function (j, posar_val_val) {
                            if (j == 0) {
                                window[egidctx].lineWidth = posar_val_val[0];
                                window[egidctx].strokeStyle = posar_val_val[1];

                            } else if (j == 1) {
                                window[egidctx].beginPath();
                                var posx = posar_val_val[0];
                                var posy = posar_val_val[1];
                                window[egidctx].moveTo(posx, posy);
                                window[egidctx].stroke(); // Draw it
                            } else {
                                var posx = posar_val_val[0];
                                var posy = posar_val_val[1];
                                //console.log('lineto: '+posx + '_' + posy);
                                window[egidctx].stroke(); // Draw it
                                window[egidctx].lineTo(posx, posy);
                                window[egidctx].stroke(); // Draw it

                            }
                        });
                    });
                })

                //暫
                document.getElementById(this.id + '_pause').addEventListener(eventup, function (event) {
                    $(this).hide();
                    var egid = event.currentTarget.id;
                    var tgid = replaceAll(egid, '_pause', '');
                    var egidctx = tgid + 'ctx';
                    clearInterval(window[tgid].interval);
                    window[tgid].interval = null;
                    $('#' + tgid + '_stop').hide();
                    $('#' + tgid + '_pause').hide();
                    $('#' + tgid + '_play').show();

                })

                //存
                document.getElementById(this.id + '_save').addEventListener(eventup, function (event) {
                    var egid = event.currentTarget.id;
                    var tgid = replaceAll(egid, '_save', '');
                    var egidctx = tgid + 'ctx';
                    window[tgid].posstr = '';

                    $.each(window[tgid].posar, function (i, posar_val) {
                        window[tgid].posstr += '[';
                        $.each(posar_val, function (j, pos_val) {
                            window[tgid].posstr += pos_val[0] + ',' + pos_val[1] + '_';
                        });
                    });

                    console.log(LZString.compressToEncodedURIComponent(window[tgid].posstr));

                    //savetxt(tgid + '.txt', LZString.compressToEncodedURIComponent(window[tgid].posstr));
                    getquery(LZString.compressToEncodedURIComponent(window[tgid].posstr));

                })

                //--讀入存檔
                $('#mask_' + this.id).show();
                getload(this.id);

                //----ios存檔
                /*
                loadtxt(id + '.txt', function loadcomp(str) {
                    //console.log(str);
                    //console.log(id + '有存檔 讀取');
                    window[id].posstr = LZString.decompressFromEncodedURIComponent(str);
                    //console.log(window[id].posstr);

                    var posar = window[id].posstr.split('[');
                    posar.splice(0, 1);
                    $.each(posar, function (i, posar_val) {
                        window[id].posar.push([]);
                        var posval_ar = posar_val.split('_');
                        $.each(posval_ar, function (j, posval_arval) {
                            var posval_arval_ar = posval_arval.split(',');
                            if (posval_arval_ar.length > 1) {
                                window[id].posar[window[id].posar.length - 1].push([parseInt(posval_arval_ar[0]), (j == 0) ? posval_arval_ar[1] : parseInt(posval_arval_ar[1])]);
                            }
                        });
                    });
                    //delete posar[0];

                    //console.log(posar);
                    //console.log(window[id].posar);

                    //重繪
                    var egidctx = id + 'ctx';
                    var tgid = id;

                    window[egidctx] = document.getElementById('canvas_' + tgid).getContext("2d");

                    $.each(window[id].posar, function (i, posar_val) {
                        $.each(posar_val, function (j, posar_val_val) {
                            if (j == 0) {
                                window[egidctx].lineWidth = posar_val_val[0];
                                window[egidctx].strokeStyle = posar_val_val[1];

                            } else if (j == 1) {
                                window[egidctx].beginPath();
                                var posx = posar_val_val[0];
                                var posy = posar_val_val[1];
                                window[egidctx].moveTo(posx, posy);
                                window[egidctx].stroke(); // Draw it
                            } else {
                                var posx = posar_val_val[0];
                                var posy = posar_val_val[1];
                                //console.log('lineto: '+posx + '_' + posy);
                                window[egidctx].stroke(); // Draw it
                                window[egidctx].lineTo(posx, posy);
                                window[egidctx].stroke(); // Draw it

                            }
                        });
                    });

                    $('#mask_' + tgid).hide();
                }, function () {
                    //console.log(id + '沒有存檔');
                    $('#mask_' + id).hide();
                });
                */
                //====ios存檔


                /*
                $.ajax({
                    type: "GET", url: id + '.txt', cache: false, async: true,
                    success: function (str) {

                });
                //==讀入存檔
                */
            },
            rtnar: [],//回傳obj
            save: function (tgid) {//觸發存檔
                window[tgid].posstr = '';
                $.each(window[tgid].posar, function (i, posar_val) {
                    window[tgid].posstr += '[';
                    $.each(posar_val, function (j, pos_val) {
                        window[tgid].posstr += pos_val[0] + ',' + pos_val[1] + '_';
                    });
                });

                //console.log(window[tgid].posstr);

                savetxt(tgid + '.txt', LZString.compressToEncodedURIComponent(window[tgid].posstr));
            }

        }
        //selectobj.append(appendid);
        return obj;
    }
    //===畫布
    var messagebox = {
        show: function (msg) {
            $('#body_div').css('-webkit-filter', 'blur(10px)');
            $('#body_msgc').html(msg || '');
            $('#body_msg').show();
        },
    }

    var saveloading = {
        bkexec:false,
        savecnt: 0,
        savestart: function () {
            if (!saveloading.bkexec) {
                $('#body_loading').show();
                $('#body_loading').css('background-image', '');
                $('#loadingtext').html('正在儲存<br>');
            }
        },
        saveing: function () {
            if (!saveloading.bkexec) {
            var loadingpie2 = chartpiegen();

            loadingpie2.data.datasets.push({
                data: [0, 1],
                backgroundColor: ['rgb(255, 99, 132)',
                        'rgb(255, 99, 132)'],
                label: 'Dataset 1'
            })
            loadingpie2.options['animation'] = {//動畫設定
                duration: 200
            }
            loadingpie2.options['legend'] = {//隱藏標簽
                display: false
            }

            loadingpie2.data.labels = ['', ''];
            loadingpie2.init('dv_loading', 20);
            
                $('#body_div').css('-webkit-filter', 'blur(10px)');
            }
            if (saveloading.savechk == null) {//沒人在跑才重新宣告
                saveloading.savechk = setInterval(function () {
                    if (saveloading.savecnt == 0) {
                        $('#loadingtext').append('畫面更新')
                        clearInterval(saveloading.savechk);
                        saveloading.savechk = null;
                        setTimeout(function () { saveloading.savecomplete() }, 200);
                    }
                }, 100);
            }
        },
        savedone: function (filename) {//儲存完成+1
            saveloading.savecnt -= 1;
            //console.log('尚餘 ' + saveloading.savecnt + ' 個檔案儲存中...');
            //$('#loadingtext').append(filename+' 存檔完成，尚餘 ' + saveloading.savecnt + ' 個檔案...<br>')
        },
        savecomplete: function () {//全部存完
            $('#body_div').css('-webkit-filter', '');
            $('#body_loading').hide();
            saveloading.bkexec = false;//預設要出loading畫面，所以每次存完把背景執行設為false
            //console.log('savecomplete');
            if (saveloading.callback != null) {//callback只做一次
                saveloading.callback();
                saveloading.callback = null;
            }
        },
        savechk: null,
        callback: function () {

        }


    }

    function fn_autofontsize(tgid, fontsize) {
        /// <summary>自動調整div裡的div字型size，只適用divobj產生的div</summary>
        /// <param name="tgid" type="str">id</param>
        /// <param name="fontsize" type="int">字型調整起點</param>
        var maxwidth = $('#' + tgid).width();
        var maxheight = $('#' + tgid).height();
        var obj = $('#dv_z0').find('div:first');
        var outwidth = obj.width();
        var outheight = obj.height();
        (fontsize == undefined) ? fontsize = 50 : '';


        console.log(maxwidth + '_' + maxheight);
        console.log(outwidth + '_' + outheight);

        do {
            obj.css('font-size', fontsize);
            var outwidth = obj.width();
            var outheight = obj.height();
            fontsize = fontsize - 1;
        } while ((outheight > maxheight || outwidth > maxwidth) && fontsize > 1);
    }

    //---pixi 專用區
    var pixiobj = {
        loadcnt: 0,
        diffx: 0,
        diffy: 0,
    }

    //===pixi 專用區