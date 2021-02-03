Vue.component('x-tablist', httpVueLoader('../Api/My/xWidgets/TabContent'));
Vue.component('x-position', httpVueLoader('../Api/My/xWidgets/PositionTool'));
Vue.component('x-tableeditor', httpVueLoader('../Widgets/TableEditorVue/index.vue'));
//Vue.component('x-tableeditor', httpVueLoader('../Api/My/xWidgets/TableEditorVue'));
Vue.component('x-loader', httpVueLoader('../Api/My/xWidgets/Loading'));
Vue.component('x-widget', {
    template: '<div><div  :id="\'x_widget_\' + widget.id"></div></div>',
    props: ["widget"],
    mounted: function () {
        $.ajax({
            url: this.widget.interface.include,
            sender: this,
            success: function (data) {
                var item = $("#" + "x_widget_" + this.sender.widget.id);
                var widget = this.sender.widget;

                item.ready(function () {
                    if (widget.initKey) {
                        widget.window = map;
                        widget.interface.init(widget, widget.initKey);
                    }
                });

                item.html(data);
            }
        });
    }

});
//即時載入動態編譯的widget如果該元件需要綁定，可以用這個
Vue.component('xvue-widget', {
    props: ["widget"],
    data: function () {
        return this.widget;
    },
    created: function () {
        // this.$set(this.widget, 'widget', this.widget);
        debugger;
        var my = this;
        this.widget.vm = my;
        my.$apply = function () {
            my.$forceUpdate();
        }
        $.ajax({
            url: this.widget.include,
            sender: this,
            success: function (sdata) {

                this.sender.html = sdata;

                this.sender.$forceUpdate();
            }
        });
    },
    render: function (h) {

        if (!this.templateRender || (this.html && this.beforeTemplate != this.html)) {

            var compiledTemplate = Vue.compile(this.html);
            this.templateRender = compiledTemplate.render;
            this.templateRenderFns = compiledTemplate.staticRenderFns;
            this.beforeTemplate = this.html;
        }
        return h('div', [
            (this.templateRender ?
                this.templateRender() :
                '')
        ]);
    },
    staticRenderFns: function () { // I fail to understand this
        return this.templateRenderFns;
    }()
})
function XWidget(option) {
    this.events = {};
    this.id = "";
    this.Title = "";
    this.icon = "";
    this.class = '';
    this.OpenModal=true;
    this.interface = {
        parent: this,
        type: 'Modal',
        resizable: true,   //可調整視窗大小
        draggable: true,   //可拖曳
        backdrop: "static",  //背景關閉功能
        minimize: true,  //視窗縮小功能
        modalCentered: true,    //強制置中功能；(將使width設置失效,resizable功能受影響)
        //modalResponsive: "modal-xl",   //modal自適應 modal-sm , modal-lg , modal-xl , modal-custom
        headerStyle: {
            padding: "0.2rem 1rem", //預設1rem 1rem  (padding:高 寬)
            background: "#343a40",
            color: "#ffffff"
        },
        
        init: function (scp, initfucname) {

            if (initfucname) {
                scp.window[initfucname](map, this);
            }
            return true;
        },

        toJSON: function (key) {
            // Clone object to prevent accidentally performing modification on the original objec      
            function clone() {
                var obj = {};
                for (var key in this) {
                    obj[key] = this[key];
                }
                return obj;
            }
            var cloneObj = clone();
            delete cloneObj.parent;
            return cloneObj;
        }
    }
    for (var key in option) {
        if (key == "interface") {
            for (var op in option.interface) {
                this.interface[op] = option.interface[op];
            }
        } else {
            this[key] = option[key];
        }
    }
}
XWidget.prototype.addEventListener = function (evt, func) {
    if (!this.events[evt]) this.events[evt] = {};
    var handler = { key: evt + Math.floor(Math.random() * 100000), func: func };
    this.events[evt][handler.key] = func;
    return handler;
}

XWidget.prototype.bindModal = function (id) {
    //確定找得到物件並執行一次性綁定
    if (!this.isBindModal && $(id).length > 0) {
        var s = this;
        $(id).on('shown.bs.modal', function () {
            s.trigger("onShow");
        });
        this.isBindModal = true;
    }
    return id;
}
XWidget.prototype.removeEventListener = function (evt, handler) {
    delete this.events[evt][handler.key];
}
XWidget.prototype.trigger = function (evt) {
    if (this.events[evt]) {
        for (var key in this.events[evt]) {
            var h = this.events[evt][key];
            h();
        }
    }
}
XWidget.prototype.click = function () {
    for (var key in this.events.click) {
        var h = this.events.click[key];
        h();
    }
}

function XApplication() {
    var scp = this;
    this.webMode = '';
    this.elementstyle = { FontObject: { Value: 0, Unit: "px" } };
    this.SearchInput = true;
    this.EditInput = false;
    this.widgetSearch = '';
    this.sWidget = "";//當前編輯Widget
    this.hideTypeIcon = true;
    this.editWidgetTitle = false;
    this.widgetSelectedIndex = -1;
    this.editSelectedElement = "";
    this.widgetdata = new XWidget();
    this.widgetsList = new Array();
    this.MenuListProperties = {
        body: {
            backgroundColor: "#343a40",
            color: '#ffffff',
            fontSize: '1rem'
        },
        title: {
            color: '#ffffff',
            fontSize: '1rem'
        },
        item: {
            color: '#ffffff',
            fontSize: '1rem'

        },
        itemHover: {
            color: '#8888ff',
            fontSize: '1rem'
        }
    };
    this.MenuList = [];
    this.CollapseGroupList = [{ "Title": "屬性", "id": "PropertiesBox" }]  //屬性編輯
    this.MenuClick = function (sender) {
        if (sender.interface != undefined && sender.interface.type == "Modal") {
            initModalItem(sender);
        }
        if (sender.click)
            sender.click();
    }
    this.MenuCloseModal = function (id) {
        var target = "#Modal" + id;
        $(target).modal('hide');
    }
    //----------Modal縮小放大初始化----------
    this.modalCloseBtn = function (e, item) {
       
        //let id = $(e.currentTarget).closest(".modal").attr("ID")
        //$(e.currentTarget).closest(".modal").removeClass("min");
        //$(e.currentTarget).closest(".modal-dialog").addClass(id + "-dialog");
        ////fontawesome5以後只能用data-icon改變圖標
        //$(e.currentTarget).next('.modalMinimize').find("i").removeClass('fa fa-clone').addClass('fa fa-minus');
        //$(".modal-backdrop").hide();
    }
    this.miniBtn = function (e, item) {
        let $modalCon = "Modal" + item.id

        let $apnData = $("#Modal" + item.id);

        let $modal = "#" + $modalCon;


        $($modal + " .modal-dialog").removeAttr('style');
        $($modal + " .modal-content").removeAttr('style');
        $($modal).toggleClass("min");


        //$("#" + $modalCon + " .modal-dialog").toggleClass($modalCon + "-dialog");
        if ($($modal).hasClass("min")) {
            $(e.currentTarget).find("i").removeClass('fa fa-minus').addClass('fa fa-clone');
            $(".minmaxCon").append($apnData);
            $(".modal-backdrop").hide();
            //縮小時應禁用drag&resize
            if ($($modal + " .modal-dialog").hasClass("ui-draggable"))
                $($modal + " .modal-dialog").draggable('disable');
            if ($($modal + " .modal-content").hasClass("ui-resizable"))
                $($modal + " .modal-content").resizable('disable');
        }
        else {
            if (!item.interface.draggable && item.interface.backdrop)
                $(".modal-backdrop").show();
            $(e.currentTarget).find("i").removeClass('fa fa-clone').addClass('fa fa-minus');
            $("#myApp").append($apnData);
            //放大時應啟用drag&resize
            if ($($modal + " .modal-dialog").hasClass("ui-draggable"))
                $($modal + " .modal-dialog").draggable('enable')
            if ($($modal + " .modal-content").hasClass("ui-resizable"))
                $($modal + " .modal-content").resizable('enable');
            //若有設置寬度，放大時應還原寬度
            item.interface.width != undefined ? $($modal + " .modal-content").width(item.interface.width + "px") : ""
        };
    }
    this.GetNodeProperty = function (prop, event) {
        var Scope = this;
        if (Scope.webMode == "Edit" && Scope.editSelectedElement != event.currentTarget) {



            if ($(Scope.editSelectedElement).hasClass('edit-selected'))
                $(Scope.editSelectedElement).removeClass('edit-selected')

            Scope.editSelectedElement = event.currentTarget;

            $(Scope.editSelectedElement).addClass('edit-selected')
            Scope.elementstyle = prop;

            Scope.elementstyle.FontObject = new xFontSize();
            Scope.elementstyle.FontObject.Value = SplitNumAndString(Scope.elementstyle.fontSize).number;
            Scope.elementstyle.FontObject.Unit = SplitNumAndString(Scope.elementstyle.fontSize).string;

        }
    }
    this.ExportSetting = function () {
        var aSet = ["ToolbarList", "ToolbarListProperties", "MenuList", "MenuListProperties", "LeftToolbarListProperties", "LeftToolbarList", "treeview", "CollapseGroupList"]
        this.ExportString = "";
        debugger;
        for (let i = 0; i < aSet.length; i++) {
            let op = this[aSet[i]]
            if (op) {
                op = getOption(op);
                console.log("Scope." + aSet[i] + "=" + JSON.stringify(op))
                this.ExportString += "Scope." + aSet[i] + "=" + JSON.stringify(op) + "\n";
            }
        }
        $('#ExportSettingModal').modal('show');
    }
    this.ImportSetting = function () {

        this.ImportString = "";

        $('#ImportSettingModal').modal('show');
    }
    this.isWidgetModify = false;
    //選擇Widget
    this.singleSelect = function (index, widget) {
        if (this.widgetSelectedIndex === index) {
            this.widgetSelectedIndex = -1;
            this.widgetSelected = new Object;
            return;
        }
        this.widgetSelectedIndex = index;

        this.widgetSelected = widget;
    }
    //加入Widget並開始編輯
    this.InsertWidget = function () {
        this.isWidgetModify = false;
        this.ShowModalPage(2);
        this.widgetdata = new XWidget();

        delete this.widgetdata.interface.parent;

        //帶入預設選項

        this.widgetdata.class = this.widgetSelected.class;
        this.widgetdata.id = "btn_" + this.widgetSelected.name;
        this.widgetdata.Title = this.widgetSelected.text;
        this.widgetdata.interface.include = "./rest/XGIS/Widgets/" + this.widgetSelected.name;
    }
    this.DeleteArrayElement = function (index, sArray) {
        Scope[sArray].splice(index, 1);
        alert('已刪除')
    }
    this.EditArrayElement = function (index, sArray) {
        $('#WidgetsModal').modal('show');
        this.widgetdata = this[sArray][index];
        this.ShowModalPage(2);
        this.isWidgetModify = true;
    }
    this.AddWidget = function () {
        this[this.sWidget].push(this.widgetdata);
        alert("已加入");
        $('#WidgetsModal').modal('hide');
        this.ShowModalPage(1);
        this.isWidgetModify = false;
    }
    this.EditWidget = function () {
        alert("已編輯");
        $('#WidgetsModal').modal('hide');
        this.ShowModalPage(1);
        this.isWidgetModify = false;
    }
    //---------------編輯模式----------------
    this.onKeypress = function (ev) {
        var oEvent = ev || event;   //處理兼容
        Scope.KeyBoardString = Scope.KeyBoardString || "";
        Scope.KeyBoardString += String.fromCharCode(oEvent.keyCode);
        if (Scope.KeyBoardString.indexOf("23379448") > -1 && Scope.webMode != "Edit") {
            alert("進入編輯模式");
            Scope.webMode = "Edit";
            Scope.KeyBoardString = "";
        }
        else if (Scope.KeyBoardString.indexOf("23379448") > -1 && Scope.webMode == "Edit") {
            alert("退出編輯模式");
            Scope.webMode = "View";
            Scope.KeyBoardString = "";
        }
    };
    //取得widgets的列表
    this.InsertNewWidget = function (sArray) {
        $.ajax({
            url: "../api/XGISWidget/GetWidgetsList",
            type: "GET",
            dataType: "jsonp",
            sender: this,
            success: function (data) {
                $('#WidgetsModal').modal('show');
                this.sender.ShowModalPage(1);
                this.sender.widgetSelectedIndex = -1;
                this.sender.widgetsList = data;

                this.sender.sWidget = sArray;
                //this.sender.$apply();
            }
        })
    }
    this.ShowModalPage = function (option) {
        switch (option) {
            case 1:
                this.SearchInput = true;
                this.EditInput = false;
                break;
            case 2:
                this.SearchInput = false;
                this.EditInput = true;
                break;

        }
    }

    this.ToolbarClick = function (sender) {

        $("#" + sender.id).parent().siblings('.swiper-slide').children('div').removeClass('iframe_button_active');  // 刪除其兄弟元素類名
        $("#" + sender.id).addClass('iframe_button_active');                    // 添加自身類名



        if (sender.interface != undefined && sender.interface.type == "Modal") {
            initModalItem(sender);
        }
    }

    this.LeftToolbarClick = function (sender) {
        if (sender.interface != undefined && sender.interface.type == "Modal") {
            initModalItem(sender);
        }
    }

    this.ShowPanel_ChangeWidth = function () {

        if ($('.left_menu').hasClass('open')) {
            $('.left_menu').css('transform', 'translateX(0)');
            $('#map').css("margin-left", '0');
            $('.left_menu').css('opacity', '0');
            $('.left_menu').removeClass('open');
        } else {
            $('.left_menu').css('transform', 'translateX(100%)');
            $('#map').css("margin-left", $('.left_menu').width() + "px");
            $('.left_menu').css('opacity', '1');
            $('.left_menu').addClass('open');
        }
    }

    function initModalItem(item) {
     
        $("#Modal" + item.id + " .modal-content").width(item.interface.width);
        $("#Modal" + item.id + " .modal-body").height(item.interface.height);

        $("#Modal" + item.id).on('shown.bs.modal', function (e) {
            //若拖曳,隱藏背景黑框
            if (item.interface.draggable)
                $(".modal-backdrop").hide();
            else
                $(".modal-backdrop").show();
        })
        $("#Modal" + item.id).on('hide.bs.modal', function (e) {
            let $modalCon = "Modal" + item.id
            let $apnData = $("#Modal" + item.id);
            let $modal = "#" + $modalCon;
            $("#myApp").append($apnData);

            $($modal+".modal").removeClass("min");
            $($modal + " .modal-dialog").addClass($modalCon + "-dialog");
            //fontawesome5以後只能用data-icon改變圖標
            $($modal + " .modalMinimize").find("i").removeClass('fa fa-clone').addClass('fa fa-minus');
            $(".modal-backdrop").hide();
        })
        //resize
        if (item.interface.type == "Modal" && item.interface.resizable) {
            $("#Modal" + item.id + " .modal-content").resizable({
                minHeight: 300,
                minWidth: 300
            });
        }
        else {
            if ($("#Modal" + item.id + " .modal-content").hasClass('ui-resizable'))
                $("#Modal" + item.id + " .modal-content").resizable('destroy');
        }
        //drag
        if (item.interface.type == "Modal" && item.interface.draggable) {

            $("#Modal" + item.id + " .modal-dialog").draggable({
                handle: ".modal-header"         //拖曳目標
            });
            $("#Modal" + item.id + " .modal-dialog").draggable("enable");
        }
        else {
            if ($("#Modal" + item.id + " .modal-dialog").hasClass("ui-draggable"))
                $("#Modal" + item.id + " .modal-dialog").draggable('disable');
        }
    }
    function xFontSize() {
        this.Value = 0;
        this.Unit = "px";
    }
    function getOption(option) {
        if (Array.isArray(option)) {
            for (let op in option) {
                delete option[op].Window
                if (option[op].interface != undefined) {
                    delete option[op].interface.parent
                    delete option[op].interface.Scope

                }
            }
            return option
        }
        return option
    }
    function SplitNumAndString(s) {
        var num;
        if (s.match(/\d[\.]\d+/) != null) {
            num = s.match(/\d[\.]\d+/)[0];
        }
        else {
            num = s.match(/\d+/)[0];
        }


        var str = s.replace(num, "");
        return { number: num, string: str }
    }
    function objToString(obj) {
        var str = '';
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + ':' + obj[p] + '\n';
            }
        }
        return "{" + str + "}";
    }
    function copyBoard() {
        $("#ExportString").select();
        document.execCommand("Copy");
        alert("Copy!!");
    }
    function excuteBoard() {
        var script = document.createElement("script");
        script.innerHTML = this.Scope.ImportString;
        document.body.appendChild(script);
        this.Scope.$apply();
        alert("Import!!")
        $('#ImportSettingModal').modal('hide');
    }


    $('#WidgetsModal').on('hidden.bs.modal', function (e) {
        this.ShowModalPage(1);
        Scope.isWidgetModify = false;
    })

    this.SaveMap = function () {


    }
    this.LoadMap = function (MapKey) {


    }
    this.LoadXApplication = function (APPName) {

        //$scope.MenuList = [];
        //var plist = JSON.parse(json);
        //plist.forEach(function (item, i) {
        //    $scope.MenuList.push(new XWidget(item));
        //});
    }
    this.toJSON = function (key) {
        debugger;
        var scp = this;
        function clone() {
            var obj = {};
            for (var key in scp) {

                obj[key] = scp[key];
            }
            return obj;
        }

        const cloneObj = clone();
        delete cloneObj.vm;
        console.log(cloneObj)
        return cloneObj;
    }
    this.SaveXApplication = function (APPName) {
        debugger;
        var json = JSON.stringify(this);

        AjaxPost(map.XGISServiceUrl + "RestService/SaveApplication",
            {
                APPName: APPName,
                Title: "系統測試",
                JSON: json
            },
            function (d) {
                debugger;
            });

    }
}