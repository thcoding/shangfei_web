//说明: 
//1. 该文件不会在课件包中存在;
//2. 该文件作用: 提供快捷键功能;(比如上下左右移动)

$(document).bind('keydown', "ctrl+s", function (e) {
    e.preventDefault();
    if (!IsCanShortCut(e.data.keys)) {
        return false;
    }

    switch (Globle.CurrentBoard.get("pType")) {
        case "board":
            $("#btnSave").click();
            break;

        case "layer":
            $("#btnLayerSave").click();
            break;
    }
    return false;
}).bind('keydown', "up", function (e) {
    e.preventDefault();
    if (!IsCanShortCut(e.data.keys)) {
        return false;
    }

    //点击一次, 向上移动一像素
    Globle.CurrentModel.set({
        silent: !1,
        "pTop": (Globle.CurrentModel.get("pTop") - 1)
    }).save();

    $("#" + Globle.CurrentModel.get("pid")).css("top", Globle.CurrentModel.get("pTop") + "px");

    return false;
}).bind('keydown', "down", function (e) {
    e.preventDefault();
    if (!IsCanShortCut(e.data.keys)) {
        return false;
    }

    //点击一次, 向上移动一像素
    Globle.CurrentModel.set({
        silent: !1,
        "pTop": (Globle.CurrentModel.get("pTop") + 1)
    }).save();

    $("#" + Globle.CurrentModel.get("pid")).css("top", Globle.CurrentModel.get("pTop") + "px");

    return false;
}).bind('keydown', "left", function (e) {
    e.preventDefault();
    if (!IsCanShortCut(e.data.keys)) {
        return false;
    }

    //点击一次, 向上移动一像素
    Globle.CurrentModel.set({
        silent: !1,
        "pLeft": (Globle.CurrentModel.get("pLeft") - 1)
    }).save();

    $("#" + Globle.CurrentModel.get("pid")).css("left", Globle.CurrentModel.get("pLeft") + "px");

    return false;
}).bind('keydown', "right", function (e) {
    e.preventDefault();
    if (!IsCanShortCut(e.data.keys)) {
        return false;
    }

    //点击一次, 向上移动一像素
    Globle.CurrentModel.set({
        silent: !1,
        "pLeft": (Globle.CurrentModel.get("pLeft") + 1)
    }).save();

    $("#" + Globle.CurrentModel.get("pid")).css("left", Globle.CurrentModel.get("pLeft") + "px");

    return false;
}).bind('keydown', "ctrl+c", function (e) {
    e.preventDefault();
    if (!IsCanShortCut(e.data.keys)) {
        return false;
    }
    copyElement();
    //    $("#btnUnDo").click();

    return false;
}).bind('keydown', "ctrl+v", function (e) {
    e.preventDefault();
    if (!IsCanShortCut(e.data.keys)) {
        return false;
    }
    pasterElement();
    //    $("#btnReDo").click();

    return false;
}).bind('keydown', "ctrl+d", function (e) {
    e.preventDefault();
//    Globle.CurrentBoard = this.model;
    Globle.CurrentModel = null;
    $('.pcontent').removeClass("pactive").children("div.ui-resizable-handle").hide();

    //通知属性面板
    Globle.CurrentBoard.set({
        "pUpdateAttributeView": !Globle.CurrentBoard.get("pUpdateAttributeView"),
        "pUpdateTriggerView": !Globle.CurrentBoard.get("pUpdateTriggerView")
    });
    $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected").removeClass("ui-selected");
    return false;
});

//判断能否执行快捷键
function IsCanShortCut(shortCutType) {
    var result = false;

    if ($(".blockMsg").length <= 0) {//如果正在生成, 那么不能操作任何快捷键
        switch (shortCutType) {
            case "ctrl+s":
                if (Globle.CurrentBoard) {
                    result = true;
                }
            case "ctrl+d":
            case "ctrl+c":
            case "up":
            case "down":
            case "right":
            case "left":
            case "del":
                //要求必须有当前元素可以操作
                if (Globle.CurrentModel)
                    result = true;
                break;
            case "ctrl+v":
                if (Globle.CopyElement)
                    result = true;
                break;
        }
    }
    return result;
}