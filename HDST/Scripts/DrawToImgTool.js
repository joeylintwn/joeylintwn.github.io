var StarDraw = false;
var isDrawing = false;
var context = null;
var canvas = null;
var stap = 0;//步驟
var MySrc = null;//原始資料
var Src = null;//原始物件

var isDirection = false;//是否開始繪畫水流方向
var isStartDirection = true;//是否開始繪畫水流方向起始座標
var isEndDirection = true;//是否開始繪畫水流方向結束座標
var StartDirection = { X: null, Y: null };//水流方向起始座標
var EndDirection = { X: null, Y: null };//水流方向結束座標

/**
 * 
 * @param {string} id
 */
function EditPicture(id, strokeStyle) {
    //預設顏色
    if (strokeStyle == null) { strokeStyle = 'red'; }

    Src = $('#' + id);
    MySrc = Src.find('img').attr('src');

    btnClear_onclick();//初始化畫板

    context.setLineDash([6, 6]);

    context.lineWidth = 1;//畫筆粗細
    context.strokeStyle = strokeStyle;//畫筆顏色

    $('#EditContent').append(canvas);//塞入視窗

    var _top = $(window).scrollTop();
    $('#divDrawWindow').jqxWindow('move', 50, _top);

    $('#divDrawWindow').jqxWindow('open');
    $('#EditContent').children().click();

    //點下滑鼠 開始繪圖
    $(canvas).unbind('mousedown').on('mousedown', function (e) {
        var S_Top = $('#divDrawWindow').offset().top;
        var S_Left = $('#divDrawWindow').offset().left;


        var x = e.pageX - canvas.offsetLeft - S_Left;
        var y = e.pageY - S_Top - canvas.offsetTop;
        if (StarDraw == true) {
            isDrawing = true;
            context.beginPath();
            context.moveTo(x, y);
        }

        if (isDirection) {
            if (isStartDirection === true) {
                StartDirection.X = x;
                StartDirection.Y = y;
            }
            if (isEndDirection === true) {
                EndDirection.X = x;
                EndDirection.Y = y;
            }
        }
    });
    $(canvas).unbind('mousemove').on('mousemove', function (e) {
        if (isDrawing) {
            var M_Top = $('#divDrawWindow').offset().top;
            var M_Left = $('#divDrawWindow').offset().left;

            var x1 = (e.pageX - canvas.offsetLeft - M_Left);
            var y1 = (e.pageY - M_Top - canvas.offsetTop);

            context.lineTo(x1, y1);
            context.stroke();
        }
    });
    $(canvas).unbind('mouseup').on('mouseup', function () {
        var state = null;
        if (isDrawing) {
            isDrawing = false;

            $('#Undo').prop('disabled', false);//上一步 解除鎖定
            //儲存步驟
            state = context.getImageData(0, 0, canvas.width, canvas.height);
            window.history.pushState(state, null);
            stap++;
        }

        if (isDirection === true) {
            if (isStartDirection === true) {
                //點擊第一次位置後
                isStartDirection = false;
                isEndDirection = true;
                //canvas.title = "請點擊終點";
                $(canvas).jqxTooltip({ content: '<b>提示:</b><i>請點擊終點</i>'});
            } else if (isEndDirection === true) {
                //點擊第二次位置後
                isEndDirection = false;
                $(canvas).jqxTooltip('destroy');
            }

            //點完起點和終點 開始畫箭頭
            if (isStartDirection === false && isEndDirection === false) {
                drawArrow(context, StartDirection.X, StartDirection.Y, EndDirection.X, EndDirection.Y, 30, 30, 2, 'red');
                $('#Direction').removeClass('btn-primary').addClass('btn-default');
                isDirection = false;

                $('#Undo').prop('disabled', false);

                //儲存步驟
                state = context.getImageData(0, 0, canvas.width, canvas.height);
                window.history.pushState(state, null);
                stap++;
            }

        }
    });
    $('#Clear').unbind('click').on('click', btnClear_onclick);
    $('#Undo').unbind('click').on('click', btnUndo_onclick);
    $('#Direction').unbind('click').on('click', btnDirection_onclick);
    $('#Draw').unbind('click').on('click', btnDraw_onclick);
    $('#SavePicture').unbind('click').on('click', btnSavePicture);
    window.addEventListener('popstate', changeStep, false);
}

/**
* 畫箭頭
* @param {Object} ctx    canvas對象
* @param {Object} fromX  起點x
* @param {Object} fromY  起點y
* @param {Object} toX    終點x
* @param {Object} toY    終點y
* @param {Object} theta  箭頭夾角
* @param {Object} headlen 斜邊長度
* @param {Object} width 箭頭寬度
* @param {Object} color 颜色
*/
function drawArrow(ctx, fromX, fromY, toX, toY, theta, headlen, width, color) {
    
    ctx.setLineDash([]);//先設定成實線

    theta = typeof(theta) !== 'undefined' ? theta : 30;
    headlen = typeof(theta) !== 'undefined' ? headlen : 30;
    width = typeof(width) !== 'undefined' ? width : 10;
    color = typeof(color) !== 'color' ? color : '#f00';
    // 計算各角度和對應的P2,P3座標
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
    ctx.save();
    ctx.beginPath();
    var arrowX = fromX - topX, arrowY = fromY - topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
    ctx.setLineDash([6, 6]);//再改回虛線
}

function changeStep(e) {
    // 清除畫布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 透過 e.state 取得先前存到 window.history 的狀態
    if (e.state) {
        context.putImageData(e.state, 0, 0);
    }
}


//清除畫板
function btnClear_onclick() {
    if (canvas == null) {
        canvas = document.createElement('canvas');
    }
    //把圖片加入畫板
    context = canvas.getContext('2d');
    base_image = new Image();
    base_image.src = MySrc;
    canvas.width = base_image.width;
    canvas.height = base_image.height;
    context.strokeStyle = "red";
    context.setLineDash([6, 6]);//再改回虛線
    base_image.onload = function () {
        //(圖片,X,Y)
        context.drawImage(base_image, 0, 0);

        //存入第一步驟
        let state = context.getImageData(0, 0, canvas.width, canvas.height);
        window.history.pushState(state, null);
        stap = 0;
        $('#Undo').prop('disabled', true);//設定上一步鎖定
    };
}

/*上一步*/
function btnUndo_onclick() {
    if (stap > 0) {
        window.history.go(-1);
        stap--;
    }

    if (stap <= 0) {
        //沒有步驟了 鎖定
        $('#Undo').prop('disabled', true);
    }
}

//水流方向
function btnDirection_onclick() {
    isDirection = !isDirection;
    //檢查是不是處於繪畫模式
    if (StarDraw == true) {
        //解除繪畫模式
        $('#Draw').click();
    }

    if (isDirection) {
        //canvas.title = "請點擊起始點";
        $(canvas).jqxTooltip({ content: '<b>提示:</b><i>請點擊起始點</i>', position: 'mouse', name: 'movieTooltip' });
        isStartDirection = true;
        $('#Direction').removeClass('btn-default').addClass('btn-primary');
    } else {
        //取消
        isStartDirection = false;
        isEndDirection = false;
        canvas.title = "";
        $('#Direction').removeClass('btn-primary').addClass('btn-default');
        $(canvas).jqxTooltip('destroy');
    }
}

/*畫虛線*/
function btnDraw_onclick() {
    StarDraw = !StarDraw;
    if (StarDraw) {
        $('#Draw').removeClass('btn-default').addClass('btn-primary');
    }
    else {
        $('#Draw').removeClass('btn-primary').addClass('btn-default');
    }
}

/* 儲存圖片 */
function btnSavePicture() {
    alert('警告：此功能的儲存只有儲存在前台，必須要按下方的儲存才會儲存到資料庫。');

    var base64 = canvas.toDataURL("image/jpg");
    var id = Src[0].id;

    Src.find('img').attr('src', base64);//替換改好的圖片

    var fileImg = $('input[type=file]#file' + id);
    //建立一個新物件
    var NewFileInput = '照片<button>選擇檔案</button><input type="text" id="file' + id + '" value="修改過的圖片.jpg" /><div class="btn btn-default" style="right;" onclick="EditPicture(\'' + id + '\')">編輯圖片</div>';
    fileImg.parent().html(NewFileInput);
    fileImg = $('input[type=text]#file' + id);
    fileImg.css({ 'border': 'none' });

    //由於基於瀏覽器安全性不能用javascript來設定files，所以偽造一個假物件
    fileImg.files = [];
    fileImg.files.push(base64.replace('data:image/png;base64,', ''));
    
    //刪除步驟
    for (var i = 0; i <= stap; i++) {
        window.history.back();
    }
    
    
    $('#divDrawWindow').jqxWindow('close');
}