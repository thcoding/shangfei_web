//该js专业用于存储初始化的一些js function
//不保存元素绑定事件等js function
var x = screen.availWidth;
var y = screen.availHeight;
window.moveTo(0, 0);
//alert(x + "," + y);
window.resizeTo(x, y);

//设置是否debug信息
if (location.href.indexOf("log") < 0) {
    window.console = { log: function () { } };
}

//初始设置的参数------------------------------------------------------------------------------开始
Globle.BugFlagMaxHeight = 300;
Globle.BugFlagMaxWidth = 500;
Globle.BugFlagMinHeight = 50;
Globle.BugFlagMinWidth = 100;
Globle.DragDelayTime = 200; //拖拽元素时,延迟时间
//---------高度宽度设置为1000*500---------
Globle.BoardWidth = 1000; //画板的宽度
Globle.BoardHeight = 550; //画板的高度
 
Globle.MaxElementNumberPerPage = 200; //设定一个画板内可以插入几个元素.
Globle.VariableSuffix = "_Pelesys"; //变量的后缀
Globle.BrowerType = ""; //标记浏览器类型,值为:ie,chrome,firefox
Globle.IsMultipleSelectStatu = !1; //标记当前是否处于多选状态---已废弃
//初始设置的参数-------------------------------------------------------------------------------结束
Globle.CurrentPhase = ""; //表示当前课件所在的阶段
Globle.CurrentUserIsAssign = ""; //表示当前登陆者是不是被分配人
Globle.CurrentUserIsOwner = ""; //表示当前登陆者是不是创建者
Globle.CurrentIsUnitItemProgram = ""; //表示当前登陆者是不是创建者
Globle.CurrentIsUnitItemProfood = ""; //表示当前登陆者是不是创建者
Globle.CurrentUserIsAuditor = ""; //表示当前登陆者是不是校审流程中的校审人员  getQueryString("CbtUnitID");
Globle.AllResourceLoaded = !1; //标记 页面是否载入完毕,如果载入完毕,为true
Globle.LastError = Backbone.Model.extend({
},
{
    defaults: {
        errorID: 0,
        errorMessage: ""
    },
    hasError: function () {
        return (Globle.LastError.defaults.errorID != 0);
    },
    setError: function (paras) {//如果不传递参数,清空错误信息
        paras || (paras = {
            errorID: 0,
            errorMessage: ""
        });
        _.extend(Globle.LastError.defaults, paras);
    },
    ShowError: function (error) {
        alert(error || Globle.LastError.defaults.errorMessage);
        //show之后,将error标志置为空,防止后续showerror调用
        location.reload();
        Globle.LastError.defaults.errorID = 0;
    }
});
Globle.SuppertBrowers = {
    ie: 11,
    firefox: 27,
    chrome: 33,
    safari: 5
}; //设定支持哪些浏览器

//用于修复一些旧数据使用,以免每次都要点击一次"生成"按钮;
// 比如: 修复从右方飞入动作时, 画板被撑大的错误效果
function FixCompatibilityOldData() {
    $("[ptype=board]").css({
        "overflow": "hidden",
        "position": "relative"
    });
}
//专门针对html标签中的属性, 进行翻译
//这些属性, 比如title,无法调用fun直接翻译, 故统一在这个方法中翻译
function TranslateHTMLUI() {
    $("#btnUnDo").attr("title", GetTranslateUI('Tundo'));
    $("#btnReDo").attr("title", GetTranslateUI('Tredo'));
    $("title").text(GetTranslateUI('TAnimationEditPage'));
}


//目前只提供给: webform类型,用来修改pFileUrl的地址
function GenerateWebFormLocalResourceLocation(fileUrl, isPreview) {
    //如果是为了预览,这时候还没有打包,那么应该把路径指向资源库位置
    fileUrl = fileUrl.replace(".zip", "");
    if (isPreview) {

        fileUrl += "/" + new Array(fileUrl.split("/")).pop().pop().toString().substring(36) + ".html";
    }
    else {
        //说明是打包后的文件,那么地址应该修改为相对目录
        var tempArray = fileUrl.split("/");
        fileUrl = tempArray.pop();
        fileUrl = tempArray.pop() + "/" + fileUrl;
    }

    console.log(fileUrl);
    return fileUrl;
}

//页面载入后, 修改一些html标签使用;
//比如webform文件格式,要修改一下iframe的src
function InitSpecialHtml() {

    console.log("InitSpecialHtml [ptype=webform]");

    $("[pcontenttype=localResource]").each(function () {
        var $this = $(this);

        var model = Globle.AllModelCollection.get(parseInt($this.attr("id")));

        if (window.location.href.indexOf("_HTMLTemplate_Preview.htm") >= 0) {
            //预览状态
            //psrc = "../../../UploadLocalResource/LocalResource/75/42b15db7-d45d-49dc-91f9-830f70b4d3d2donghua/42b15db7-d45d-49dc-91f9-830f70b4d3d2donghua.html"
            var tempFilePath = $this.children("iframe").attr("psrc");

            $this.children("iframe").attr({
                "src": tempFilePath
            });
        }
        else if ((window.location.href.indexOf("_HTMLTemplate.htm") >= 0) || (window.location.href.indexOf("_HTMLTemplate_forcrewpad.htm") >= 0)) {
            //学习状态,也就是非预览状态
            var tempFilePath = GenerateWebFormLocalResourceLocation($this.children("iframe").attr("psrc"), false);

            $this.children("iframe").attr({
                "src": tempFilePath
            });
        }
    });
}



$(function () {

    FixCompatibilityOldData();
    TranslateHTMLUI();

    if (window.location.href.indexOf("ModalContainerForAnimation.htm") >= 0) {

        $(".ui-layout-pane-center").css("background-color", "rgb(240, 237, 237)");
        $(".ui-layout-pane-north").css({ "overflow": "visible", "z-index": "3" }); //解决上方导航条被下方遮盖的问题.
        //解决辅助线定位问题
        $("#guide-h").css({ "width": Globle.BoardWidth + "px", "left": "20px" });
        $("#guide-v").css({ "height": Globle.BoardHeight + "px", "top": "20px" });

        //设置全局的blockUI---------------------------------------------------------------------------开始
        $.blockUI.defaults.forceIframe = !0; //强制使用iframe遮盖
        $.blockUI.defaults.overlayCSS = {
            backgroundColor: 'transparent', //默认透明颜色,用于频繁的保存使用
            opacity: 0 //透明度;
        };
        $.blockUI.defaults.message =
       '<div class="progress progress-striped active">'
        + '<div class="progress-bar"  role="progressbar"  style="width: 100%">'
        + '</div>'
        + '</div>';

        $.blockUI.defaults.css = {
            padding: 0,
            margin: 0,
            width: '30%',
            top: '20%',
            left: '35%',
            textAlign: 'center',
            color: 'green',
            border: '0px solid #aaa',
            backgroundColor: 'transparent',
            cursor: 'wait'
        };
        //设置全局的blockUI---------------------------------------------------------------------------结束

        //第一次载入的时候,不要透明颜色,因为要显示logo
        $.blockUI({
            css: {
                top: '0px'
                , left: "0px"
                , width: "100%"
                , height: "100%"
            },
            overlayCSS: {
                backgroundColor: '#FBFBFB',
                opacity: 1
                //                background: "-webkit-radial-gradient(circle, #FCF8F8, #BBB)"
            },
            message: "<div style='width:100%;height:100%;'>"
                       + "<div style='float:left;margin: 20px 0 0 20px;'><img style='height:110px;width:138px;' src='AnimationResource/images/logo_COMAC.png'/></div>"
                       + "<div style='float:right;margin: 20px 20px 0 0;'><img src='AnimationResource/images/Pelesys.png'/></div>"
                       + "<div></div>"
                       + "<div><table style='margin: 0px auto;'><tr><td colspan='2' style='line-height: 700px;'><img src='AnimationResource/images/airPort" + _.random(1, 3) + ".png'/></td></tr><tr><td style='line-height: 100px;position: relative;top: -260px;'>"
                       + GetTranslateUI('TPleaseWaitYouWillOpenTheAnimationEditorCoursewareRelevantDataIsBeingLoaded') + "."
                       + "</td><td style='line-height: 100px;position: relative;top: -260px;'><img style='height:50px;width:50px;' src='AnimationResource/images/loading1.gif'/></td></tr><table></div>"
                       + "</div>"
        });
        Globle.CurrentPhase = getQueryString("Phase");
        Globle.CurrentUserIsAssign = getQueryString("IsAssign");
        Globle.CurrentUserIsOwner = getQueryString("IsOwner");
        Globle.CurrentUserIsAuditor = getQueryString("IsAuditor");
        Globle.CurrentIsUnitItemProgram = getQueryString("IsUnitItemProgram");
        Globle.CurrentIsUnitItemProfood = getQueryString("IsUnitItemProfood");

        InitMutipleElement();

        //SetButtonShowByPhaseAndUser1();
        //        console.log(getQueryString("CbtUnitID"));
    }
    if (!browserSuppert(Globle.SuppertBrowers)) {
        alert(GetTranslateUI('TBrowserVersionIsTooLowPleaseUpgradeOrInstallOtherBrowsers'));
        window.location.href = GenerateRequestURL(window.location.protocol + "//" + window.location.host + "/Lcms/HTMLTemplate/Animation/AnimationResource/page/browser-old.htm");
    }

});

//(function checkIsRemind() {

//    try {
//        if ($.cookie('isRemind') != "0") {
//            var fileUrl = window.location.protocol + "//" + window.location.host + "/Lcms/HTMLTemplate/Animation/AnimationResource/page/helper.htm";
//            var tempWindow = window.open(fileUrl, "", "height=300,width=600,resizable=Yes,status=No,scrollbars=No");
//            tempWindow.focus();
//        }
//    } catch (e) {

//    }
//})();

//初始化多选功能
function InitMutipleElement() {
    $("#plscreen").selectable({
        appendTo: "body",
        filter: "[IsSupportMultipleSelect='true']",
        distance: 10,
        create: function (event, ui) {
            console.log("create");
        },
        selected: function (event, ui) {
            console.log("selected");
        },
        selecting: function (event, ui) {
            console.log("selecting");
        },
        unselected: function (event, ui) {
            console.log("unselected");
        },
        stop: function (event, ui) {
            console.log("stop");
        },
        start: function (event, ui) {
            console.log("start");
        }

    });
}

var tempInterval = setInterval(function () {
    if (Globle.AllResourceLoaded) {
        $.unblockUI();
        clearInterval(tempInterval);

        //        if (window.location.href.indexOf("ModalContainerForAnimation.htm") >= 0) {
        //            $(".pageboard").selectable({
        //                filter: ".pcontent",
        //                distance: 30,
        //                stop: function (event, ui) {
        ////                    alert('wer');
        //                    Globle.IsMultipleSelectStatu = !0;
        //                    var MultipleAttributePanelViewObj = new MultipleAttributePanelView();

        //                }
        //            });
        //        }
    }
}, 4000);

function SetButtonShowByPhaseAndUser1() {
    if (Globle.CurrentUserIsOwner == "1") {
        $("#ForProgramming").hide();
        //隐藏字幕编辑区域---开始
        //Globle.LayoutObj.east.resizer.hide("east");
        //Globle.LayoutObj.east.pane.hide("east");
        //Globle.LayoutObj.panes.east.hide();
        Globle.LayoutObj.hide("east");
        Globle.LayoutObj.center.children.layout1.hide("south");
        //隐藏字幕编辑区域----结束
    }
    if (Globle.CurrentIsUnitItemProgram == "1" && Globle.CurrentUserIsAssign == "1") {
        $("#ForTesting").hide();
        $("#ForProgramming").show();
        Globle.LayoutObj.show("east");
        Globle.LayoutObj.center.children.layout1.show("south");
    }
    else if (Globle.CurrentIsUnitItemProfood == "1" && Globle.CurrentUserIsAuditor == "1") {
        $("#ForProgramming").hide();
        $("#ForTesting").show();
        //隐藏字幕编辑区域---开始
        Globle.LayoutObj.hide("east");
        Globle.LayoutObj.center.children.layout1.hide("south");
    }
    if (!Globle.CurrentIsUnitItemProfood == "1" && !Globle.CurrentIsUnitItemProgram == "1") {

        //        if (phM.IsAssigned || phM.IsAuditor)
        //        {
        //            hfIsAssign.Value = "1";
        //            hfisAuditor.Value = "1";
        //            btnEditAnimation.Visible = true;
        //        }
    }
}
