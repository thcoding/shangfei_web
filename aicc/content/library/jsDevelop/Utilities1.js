//该文件存储的js,不会再最终的课件中出现.
//因此该文件内,不要写关于最终课件使用的js,和课件有关的js请写在该文件的上一个文件中


//处理资源的来源字段
//如果是本地素材库,那么显示:"所在文件夹/文件名"; 如果是统一资源库, 那么显示:"来自统一资源库",因为统一资源库没有返回相关数据
function ProcessResourceSource(resourceType, pFileResourceFromLocation) {
    if (resourceType == 1) {
        //说明是本地资源库
        return pFileResourceFromLocation;
    }
    else {
        return GetTranslateUI("TSourceUniformResourceLibrary");
    }
} 

//检查当前页面的所有素材元素的MaterialUsageIDArray字段是否为空，如果为空，那么将该元素加个红色边框，并提示用户错误元素，让其手动删除
function checkAllElementLegal() {
    var errorString = '当前页面存在以下错误数据（使用红色方框标出，请将错误元素删除后重新添加）：';
    var template = _.template($("#errorElementTemplate").html());
    var result = true;
    try {
        _.each(GetCurrentBoardAllElements(), function (item) {
            var ptype = item.get("pType");
            if ((ptype == 'Image') || (ptype == 'Audio') || (ptype == 'Flash') || (ptype == 'GlStudio') || (ptype == 'Catia') || (ptype == 'Video') || (ptype == 'ImageRotate')) {
                if (item.get("pMaterialUsageID") == '') {
                    result = false;
                    errorString += template(item.toJSON());
                    $("#" + item.get("pid")).addClass("ErrorElementFlag");
                }
            }

            if ((ptype == 'ButtonType') || (ptype == 'ImageSlide') || (ptype == 'ImageRotate')) {
                _.each(item.get("ImageArray"), function (item1) {
                    if (item1.get("pMaterialUsageID") == '') {
                        result = false;
                        errorString += template(item.toJSON());
                        $("#" + item.get("pid")).addClass("ErrorElementFlag");
                    }
                });
            }

            if ((ptype == 'ImageSequence')) {
                if (item.get("ImageModel").get("pMaterialUsageID") == '') {
                    result = false;
                    errorString += template(item.toJSON());
                    $("#" + item.get("pid")).addClass("ErrorElementFlag");
                }
            }
        });
        if (!result) {
            alert(errorString);
        }
    } catch (e) {
        result = false;
        alert("检查数据时出现问题，请联系管理员\r\n" + e.message);
    }
    return result;
}


var MIN_DISTANCE = 10; // minimum distance to "snap" to a guide
var guides = []; // no guides available ... 
var innerOffsetX, innerOffsetY; // we'll use those during drag ... 

//点击某个元素时,执行该fun
function ClickElement(event) {
    if (($(event.target).parent().attr("ptype") == 'board') && event.type == "mousedown") {
        //当画板添加背景元素后，需要单独处理
        $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected").removeClass("ui-selected");
        //        return false;
    } else if ((($(event.target).attr("ptype") == 'board') || (event.target.id == 'plscreen')) && event.type == "mousedown") {
        $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected").removeClass("ui-selected");
    } else if ((($(event.target).attr("ptype") == 'layer')) && event.type == "mousedown") {
        $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected").removeClass("ui-selected");
    } else if (($(event.target).parent().attr("ptype") == 'layer') && event.type == "mousedown") {
        //当层添加背景元素后，需要单独处理
        $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected").removeClass("ui-selected");
        //        return false;
    }
}

function activeImage(model, event) {
    var $currentElement = $('#' + model.get("pid") + '');
    //处理逻辑:
    //1. 如果为按着ctrl点击,那么认为是用户在多选
    try {
        if (event.ctrlKey) {
            if ($currentElement.hasClass("ui-selected")) {
                $currentElement.removeClass("ui-selected");
            }
            else {
                $currentElement.addClass("ui-selected");
            }
        }
    } catch (e) {

    }


    $("#pageSetPanel a[href='#currentInfo']").tab('show');

    $('.pcontent.ui-draggable').not($currentElement).removeClass("pactive").children("div.ui-resizable-handle").hide();
    $currentElement.hasClass("pactive") || $currentElement.addClass("pactive").children("div.ui-resizable-handle").show();
}

function copyElement() {
    if (Globle.CurrentModel == null) {
        if (Globle.CurrentBoard != null && Globle.CurrentBoard.attributes.pType == 'board') {
            Globle.ClickType = "Board";
        }
    } else {
        var TempType = Globle.CurrentModel.get("pType");
        switch (TempType) {
            case "ImageSlide": //幻灯片
                Globle.ClickType = "Slid";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "layer": //层
                Globle.ClickType = "Layer";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "Image":
                Globle.ClickType = "Resource";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "RichText":
                //                                    ResourceViewForRichTextPaster = new ResourceView();
                //                                    ResourceViewForRichTextPaster.showRichTextClick({
                //                                    pBackGroundColor:
                //                                    });

                Globle.ClickType = "Text";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "Arrow":
                Globle.ClickType = "Arrow";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "Box":
                Globle.ClickType = "Box";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "Circle":
                Globle.ClickType = "Circle";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "Ellipse":
                Globle.ClickType = "Ellipse";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "AdvanceArrow":
                Globle.ClickType = "AdvanceArrow";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
            case "ImageRotate":
                Globle.ClickType = "Rotate";
                break;

            case "ButtonType":
                Globle.ClickType = "Button";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;

            case "GlStudio":
                Globle.ClickType = "GlStudio";
                break;
            case "Flash":
                Globle.ClickType = "Flash";
                break;
            case "Catia":
                Globle.ClickType = "Catia";
                break;

            case "Video":
                Globle.ClickType = "Video";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;

            case "Audio":
                Globle.ClickType = "Audio";
                break;

            case "SVG":
                Globle.ClickType = "SVG";
                break;

            case "ImageSequence":
                Globle.ClickType = "Sequence";
                break;
            case "Correct":
                Globle.ClickType = "Correct";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
            case "Incorrect":
                Globle.ClickType = "Correct";
                Globle.CopyAction = GetActionsByRelateElementID(null, null);
                break;
             case "WebForm":
                    Globle.ClickType = "localResource";
                break;
           
            default:
                alert(GetTranslateUI('TIllegalparameter'));
                break;
        }
        Globle.CopyElement = Globle.CurrentModel;
    }
}

function pasterElement() {
    if (Globle.CopyElement == null) {
        alert(GetTranslateUI('TElementhasnotbeenreplicated'));
    } else {
        var arr = new Array();
        if ((Globle.CopyElement.attributes.pType == "RichText") || (Globle.CopyElement.attributes.pType == "Correct") || (Globle.CopyElement.attributes.pType == "Incorrect")) {
            var tpye = "";
            switch (Globle.CopyElement.get("pType")) {
                case "RichText":
                    ResourceViewInstance.showRichTextClick({
                        pBackGroundColor: Globle.CopyElement.attributes.pBackGroundColor,
                        pBorderColor: Globle.CopyElement.attributes.pBorderColor,
                        pBorderWidth: Globle.CopyElement.attributes.pBorderWidth,
                        pTextContent: Globle.CopyElement.attributes.pTextContent,
                        pHeight: Globle.CopyElement.attributes.pHeight,
                        pWidth: Globle.CopyElement.attributes.pWidth,
                        pBackGroundIsOpacity: Globle.CopyElement.attributes.pBackGroundIsOpacity,
                        currentTarget: {
                            id: "btnRichText"
                        }
                    });
                    break;
                case "Correct":
                    ResourceViewInstance.showRichTextClick({
                        pBackGroundColor: Globle.CopyElement.attributes.pBackGroundColor,
                        pBorderColor: Globle.CopyElement.attributes.pBorderColor,
                        pBorderWidth: Globle.CopyElement.attributes.pBorderWidth,
                        pTextContent: Globle.CopyElement.attributes.pTextContent,
                        pHeight: Globle.CopyElement.attributes.pHeight,
                        pWidth: Globle.CopyElement.attributes.pWidth,
                        pBackGroundIsOpacity: Globle.CopyElement.attributes.pBackGroundIsOpacity,
                        currentTarget: {
                            id: "btnCorrect"
                        }
                    });
                    break;
                case "Incorrect":
                    ResourceViewInstance.showRichTextClick({
                        pBackGroundColor: Globle.CopyElement.attributes.pBackGroundColor,
                        pBorderColor: Globle.CopyElement.attributes.pBorderColor,
                        pBorderWidth: Globle.CopyElement.attributes.pBorderWidth,
                        pTextContent: Globle.CopyElement.attributes.pTextContent,
                        pHeight: Globle.CopyElement.attributes.pHeight,
                        pWidth: Globle.CopyElement.attributes.pWidth,
                        pBackGroundIsOpacity: Globle.CopyElement.attributes.pBackGroundIsOpacity,
                        currentTarget: {
                            id: "btnIncorrect"
                        }
                    });
                    break;

            }

        }
      
            //else if (Globle.CopyElement.attributes.pType == "WebForm") {
            //    var WebFormObj = new WebFormModel();
            //    WebFormObj.set({
            //        pParentElementID: Globle.CurrentBoard.get("pid"),
            //        pTextContentUrl: Globle.CopyElement.get("pTextContentUrl"),
            //        pTextContentEmbed: Globle.CopyElement.get("pTextContentEmbed"),
            //        pContentType: Globle.CopyElement.get("pContentType"),
            //        pTop: Globle.CopyElement.get("pTop"),
            //        pLeft: Globle.CopyElement.get("pLeft"),
            //        pWidth: Globle.CopyElement.get("pWidth"),
            //        pHeight: Globle.CopyElement.get("pHeight")
            //    }).save();
            //    AddModelToCollection(WebFormObj);
            //}
        else if ((Globle.CopyElement.get("pType") == "Arrow") || (Globle.CopyElement.get("pType") == "Box") || (Globle.CopyElement.get("pType") == "Circle") || (Globle.CopyElement.get("pType")) == "AdvanceArrow" || (Globle.CopyElement.get("pType")) == "Ellipse") {
            var SVGModelObj = new SVGModel();

            SVGModelObj.set({
                pParentElementID: Globle.CurrentBoard.get("pid"),
                silent: !0,
                SequenceID: GetCurrentElementsBigZIndex() + 1,
                pRotate: Globle.CopyElement.attributes.pRotate,
                pTransparent: Globle.CopyElement.attributes.pTransparent,
                pWidth: Globle.CopyElement.attributes.pWidth,
                pHeight: Globle.CopyElement.attributes.pHeight,
                pInitControlVisible: Globle.CopyElement.attributes.pInitControlVisible,
                color: Globle.CopyElement.attributes.color
                //                pBorderWidth: Globle.CopyElement.get("pBorderWidth")
            });
            switch (Globle.CopyElement.get("pType")) {
                case "Arrow":
                    SVGModelObj.set({
                        pType: "Arrow",
                        pElementName: GetTranslateUI('TArrowbasicinformation'),
                        pName: GetTranslateUI('TArrowTool')
                    });
                    break;
                case "AdvanceArrow":
                    SVGModelObj.set({
                        pType: "AdvanceArrow",
                        pElementName: GetTranslateUI('TArrowbasicinformation'),
                        pName: GetTranslateUI('TArrowTool'),
                        pArrowColor: Globle.CopyElement.get("pArrowColor") == undefined ? 12 : Globle.CopyElement.get("pArrowColor"),
                        pArrowStrokeWidth: Globle.CopyElement.get("pArrowStrokeWidth") == undefined ? 12 : Globle.CopyElement.get("pArrowStrokeWidth"),
                        pArrowSvgPath1: Globle.CopyElement.get("pArrowSvgPath1") == undefined ? 12 : Globle.CopyElement.get("pArrowSvgPath1"),
                        pArrowSvgPath2: Globle.CopyElement.get("pArrowSvgPath2") == undefined ? 12 : Globle.CopyElement.get("pArrowSvgPath2"),
                        IsCanEditWidthHeight: !1
                    });
                    break;
                case "Box":
                case "Circle":
                    if (Globle.CopyElement.get("pType") == "Box") {
                        SVGModelObj.set({
                            pType: "Box",
                            pElementName: GetTranslateUI('TBasicinformationbox'),
                            pName: GetTranslateUI('TBoxTools')
                        });
                    } else if ((Globle.CopyElement.get("pType") == "Circle")) {
                        SVGModelObj.set({
                            pType: "Circle",
                            pElementName: GetTranslateUI('TBasicinformationcircular'),
                            pName: GetTranslateUI('TCircularTools')
                        });
                    }

                    SVGModelObj.set({
                        pBorderWidth: Globle.CopyElement.get("pBorderWidth") == undefined ? 12 : Globle.CopyElement.get("pBorderWidth"),
                        pBorderColor: Globle.CopyElement.get("pBorderColor") == undefined ? "Red" : Globle.CopyElement.get("pBorderColor"),
                        pBackGroundColor: Globle.CopyElement.get("pBackGroundColor") == undefined ? "none" : Globle.CopyElement.get("pBackGroundColor"),
                        pBackGroundIsOpacity: Globle.CopyElement.get("pBackGroundIsOpacity") == undefined ? !0 : Globle.CopyElement.get("pBackGroundIsOpacity")
                    });
                    break;
                case "Ellipse":
                    SVGModelObj.set({
                        pType: "Ellipse",
                        pElementName: GetTranslateUI('TBasicinformationEllipse'),
                        pName: GetTranslateUI('TEllipseTools'),
                        pBorderWidth: Globle.CopyElement.get("pBorderWidth") == undefined ? 1 : Globle.CopyElement.get("pBorderWidth"),
                        pEllipseRX: Globle.CopyElement.get("pEllipseRX") == undefined ? "50" : Globle.CopyElement.get("pEllipseRX"),
                        pEllipseRY: Globle.CopyElement.get("pEllipseRY") == undefined ? "50" : Globle.CopyElement.get("pEllipseRY"),
                        IsCanEditWidthHeight: !0
                    });
                    break;

            }
            SVGModelObj.save();
            AddModelToCollection(SVGModelObj);
        } else {
            switch (Globle.CopyElement.attributes.pType) {
                case "ImageSlide":
                case "ImageRotate":
                    for (var i = 0; i < Globle.CopyElement.attributes.ImageArray.length; i++) {//针对幻灯片和滑动轮转
                        var fileID = Globle.CopyElement.attributes.ImageArray[i].attributes.pFileID; //所选文件的ID
                        var filePath = Globle.CopyElement.attributes.ImageArray[i].attributes.pFileUrl; //所选文件的下载路径
                        var fileThumbnailPath = Globle.CopyElement.attributes.ImageArray[i].attributes.pThumbImageUrl; //所选文件的缩略图路径
                        var fileName = Globle.CopyElement.attributes.ImageArray[i].attributes.pName; // 所选文件的文件名称
                        var version = Globle.CopyElement.attributes.ImageArray[i].attributes.pVersoin;
                        var resourceType = Globle.CopyElement.attributes.ImageArray[i].attributes.pResourceType;
                        var elementHeight = Globle.CopyElement.attributes.pHeight;
                        var elementWidth = Globle.CopyElement.attributes.pWidth;
                        //                                        var elementTop = Globle.CopyElement.attributes.pTop;
                        //                                        var elementLeft = Globle.CopyElement.attributes.pLeft;
                        var element = { "fileID": fileID, "filePath": filePath, "resourceType": resourceType, "ThumbnailPath": "../" + fileThumbnailPath, "fileName": fileName, "version": version, "height": elementHeight, "width": elementWidth };
                        arr.push(element);
                    }
                    break;
                case "layer":
                    var element = { "value": Globle.CopyElement.id };
                    arr.push(element);
                    break;
                default: //针对其他可以复制的元素
                    var pFrame = 0;
                    switch (Globle.CopyElement.attributes.pType) {//因为序列帧和按钮的文件路径存储位置和其他文件不同
                        case "ImageSequence":
                            var filePath = Globle.CopyElement.attributes.ImageModel.attributes.pFileUrl;
                            pFrame = Globle.CopyElement.attributes.pFrame;
                            break;
                        case "ButtonType":
                            var filePath = Globle.CopyElement.attributes.ImageArray[0].attributes.pFileUrl;
                            break;
                        default:
                            var filePath = Globle.CopyElement.attributes.pFileUrl;
                            break;
                    }

                    var fileID = Globle.CopyElement.attributes.pFileID; //所选文件的ID
                    //                                    var filePath = Globle.CopyElement.attributes.pFileUrl; 
                    var fileThumbnailPath = Globle.CopyElement.attributes.pThumbImageUrl; //所选文件的缩略图路径
                    var fileName = Globle.CopyElement.attributes.pName; // 所选文件的文件名称
                    var version = Globle.CopyElement.attributes.pVersoin;
                    var resourceType = Globle.CopyElement.attributes.pResourceType;
                    var elementHeight = Globle.CopyElement.attributes.pHeight;
                    var elementWidth = Globle.CopyElement.attributes.pWidth;
                    var pExtendFileID = Globle.CopyElement.attributes.pExtendFileID

                    //                                    var elementTop = Globle.CopyElement.attributes.pTop;
                    //                                    var elementLeft = Globle.CopyElement.attributes.pLeft;
                    var element = {
                        "fileID": fileID,
                        "filePath": filePath,
                        "resourceType": resourceType,
                        "ThumbnailPath": "../" + fileThumbnailPath,
                        "fileName": fileName,
                        "version": version,
                        "height": elementHeight,
                        "width": elementWidth,
                        "pFrame": pFrame,
                        "pExtendFileID": pExtendFileID
                    };
                  
                    if (Globle.CopyElement.attributes.pType == "WebForm") {
                        element = {
                            "fileID": fileID,
                            "filePath": filePath,
                            "resourceType": resourceType,
                            "ThumbnailPath": "../" + fileThumbnailPath,
                            "fileName": Globle.CopyElement.attributes.pFileName,
                            "version": version,
                            "height": elementHeight,
                            "width": elementWidth,
                            "pFrame": pFrame,
                            "pExtendFileID": pExtendFileID,

                            "pTextContentUrl": Globle.CopyElement.attributes.pTextContentUrl,
                            "pTextContentEmbed": Globle.CopyElement.attributes.pTextContentEmbed,
                            "pContentType": Globle.CopyElement.attributes.pContentType
                        };
                    }

                    arr.push(element);
                    break;
            }
            CallBack(arr, true);
        }
        //以下为粘贴动作方法
        if (Globle.CopyAction != null) {
            if (Globle.CopyAction.length != 0) {
                for (var i = 0; i < Globle.CopyAction.length; i++) {
                    PasterElementAction(Globle.CopyAction[i]);
                }
            }
        }
        //                            if (Globle.CopyAction.length != 0) {
        //                                for (var i = 0; i < Globle.CopyAction.length; i++) {
        //                                    PasterElementAction(Globle.CopyAction[i]);
        //                                }
        //                            }
    }
}

////多选元素状态时,会调用该方法.
////取消多选的元素
//function UnSelectMultipleElement(event) {
//    if (!Globle.IsMultipleSelectStatu)
//        return;

//    if ($(event.currentTarget).hasClass("ui-selected")) {
//        return;
//    }

//    Globle.IsMultipleSelectStatu = !1;
//    $(".ui-selected").removeClass('ui-selected');
//}

function startResize(event, ui) {
    AddResizeMemo();
}

function AddResizeMemo() {
    Globle.MemoCollectionManager.AddMemo(ElementBaseModel.CreateMemo(Globle.CurrentModel, "Resize"));
}

function AddMoveMemo() {
    Globle.MemoCollectionManager.AddMemo(ElementBaseModel.CreateMemo(Globle.CurrentModel, "Move"));
}

function startDraggable(event, ui) {
    AddMoveMemo();
    startCalcuteGuide(event, ui);

    //    ClacMultipleElementPostion();
}

//当拖动处于多选状态的元素时, 同时也要移动其他多选的元素,
//存储到数据库的处理, 需要与拖动结束事件配合
//处理逻辑:
//1. 如果当前操作的元素是不是多选元素, 直接返回false;
//2. 否则, 直接移动其他元素的css,造成视觉上是统一拖动;  
function ClacMultipleElementPostion(event, ui) {
    var $current = $(event.target);
    if ($current.hasClass("ui-selected")) {
        $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected").not($current).css({
            "left": function (index, value) {
                //                console.log("oldvalue: " + parseFloat(value) + " relative left: " + (ui.position.left - ui.originalPosition.left));
                //                return parseFloat(value);
                return Globle.AllModelCollection.get(parseInt(this.id)).get("pLeft") + ui.position.left - ui.originalPosition.left;
                //                return parseFloat(value) + ui.position.left - ui.originalPosition.left;
            },
            "top": function (index, value) {
                return Globle.AllModelCollection.get(parseInt(this.id)).get("pTop") + ui.position.top - ui.originalPosition.top;
                //                return parseFloat(value)
                //                return parseFloat(value) + ui.position.top - ui.originalPosition.top;
            }
        });
    }
    else
        return false;
}

//判断当前幻灯片在当前正在设置的触发器中. 是否是已经设置过控制操作的
function JudgeIsCheckedSlidElement(pid, triggerPid) {
    triggerPid = parseInt(triggerPid);
    try {
        var controlAnimationModelArray = Globle.TriggerModelCollection.get(triggerPid).get("ControlAnimationModelArray");
    } catch (e) {
        var controlAnimationModelArray = undefined;
    }

    if (controlAnimationModelArray) {
        return _.intersection(controlAnimationModelArray, _.map(Globle.AnimationBaseModelCollection.where({ "BelongToElementID": pid }),
        function (item1) {
            return item1.id.toString();
        })).length > 0;
    }
    else {
        return false;
    }
    return Globle.AnimationBaseModelCollection.where({ "BelongToElementID": pid }).length > 0;
}

//供设置幻灯片的模板调用
function ProcessJudgeSlidElement(item, triggerPid) {

    triggerPid = parseInt(triggerPid);
    try {
        var controlAnimationModelArray = Globle.TriggerModelCollection.get(triggerPid).get("ControlAnimationModelArray");
    } catch (e) {
        var controlAnimationModelArray = undefined;
    }

    var controlTemp = new Array();
    if (controlAnimationModelArray) {
        var controlIDArray = _.intersection(controlAnimationModelArray, _.map(Globle.AnimationBaseModelCollection.where({ "BelongToElementID": item.get("pid") }),
        function (item1) {
            return item1.id.toString();
        }));
        controlTemp[0] = Globle.AnimationBaseModelCollection.get(controlIDArray[0]);
    }
    else {
        controlTemp[0] = undefined;
    }

    item.set({
        pname: controlTemp[0] && controlTemp[0].get("SlidElementControl"),
        silent: true,
        id: item.id,
        selectindex: controlTemp[0] && controlTemp[0].get("SlidSetElementTo")
    });
    return _.template($("#ForSlidElementLiTemplate").html())(item.toJSON());
}

//加载元素透明度Slider
function ElementTransparent() {
    $("#sliderElementTransparent").slider({
        min: 0,
        max: 1,
        step: 0.01,
        value: $("#txtElementTransparent").val(),
        animate: false,
        slide: function (event, ui) {
            $("#txtElementTransparent").val(ui.value);
            setTransparency("" + ui.value + "");
        }
    });
}

//设置透明度
function setTransparency(txtValue) {
    var reg = /^[1-9]\d*$/;
    var val = txtValue;
    if (parseFloat(val) > 1) {
        val = 1;

    }
    if (parseFloat(val) < 0) {
        val = 0;

    }
    $("#txtElementTransparent").val(val);
    $("#sliderElementTransparent").slider("value", val);
    $("#" + Globle.CurrentModel.get("pid") + "_preview_preview").css("Opacity", val);
}


//在旋转文本框中输入数字后，将文本框失去焦点后执行的方法
function ChangeElementRotate(model, data) {
    var reg = /^[1-9]\d*$/;
    var val = parseInt(data.target.value);
    if (parseInt(val) > 360) {
        val = 360;
    }
    if (parseInt(val) < 0) {
        val = 0;
    }
    $("#" + model.get("pid")).css("-webkit-transform", "rotate(" + val + "deg)");
    $("#" + model.get("pid")).css("-ms-transform", "rotate(" + val + "deg)");
    $("#" + model.get("pid")).css("-moz-transform", "rotate(" + val + "deg)");
    $("#" + model.get("pid")).css("-o-transform", "rotate(" + val + "deg)");

    AddResizeMemo();

    model.set({
        "pRotate": val,
        silent: !0
    });
    model.save();

    if (Globle.LastError.hasError()) {
        Globle.LastError.ShowError();
        location.reload();
    }
}

//改变素材元素的透明度
function ChangeElementTransparent(model, data) {
    var reg = /^[1-9]\d*$/;
    var val = data.target.value;

    if (parseFloat(val) > 1) {
        val = 1;
        data.target.value = 1;
    }
    if (parseFloat(val) < 0) {
        val = 0;
        data.target.value = 0;
    }
    if (val.length >= 5) {
        if (val.substring(0, 4)) {
            val = data.target.value = val.substring(0, 4);
        }
    }
    $("#" + model.get("pid")).css("opacity", val);
    AddResizeMemo();
    model.set({
        "pTransparent": val,
        silent: !0
    });
    model.save();
    if (Globle.LastError.hasError()) {
        Globle.LastError.ShowError();
        location.reload();
    }
}

//初始化旋转的Slider滚动条的方法
function ElementTransparentForImage(val, model) {

    $("#sliderElementTransparentForImage").slider({
        min: 0,
        max: 1,
        step: 0.01,
        value: model.get("pTransparent"),
        animate: false,
        start: function (event, ui) {
            AddResizeMemo();
        },
        slide: function (event, ui) {
            //            $("#Rotate", val).val(ui.value);
            SetELementTransparent("" + ui.value + "");
        },
        stop: function (event, ui) {
            Globle.CurrentModel.save();
        }
    });
}

//设置素材元素透明度
function SetELementTransparent(val) {
    $("#" + Globle.CurrentModel.get("pid")).css("Opacity", val);
    Globle.CurrentModel.set("pTransparent", val);
}

//在WHXY四个任意一个文本框中输入数字后，将文本框失去焦点后执行的方法
function ChangeElementWHXY(model, data) {
    AddResizeMemo();

    var val = parseInt(data.target.value == "" ? 0 : data.target.value);
    switch (data.target.id) {
        case "width":
            $("#" + model.get("pid")).css("width", val + "px");
            model.set({
                "pWidth": val,
                silent: !0
            });

            break;
        case "height":

            $("#" + model.get("pid")).css("height", val + "px");
            model.set({
                "pHeight": val,
                silent: !0
            });

            break;
        case "left":


            $("#" + model.get("pid")).css("left", val + "px");
            model.set({
                "pLeft": val,
                silent: !0
            });

            break;
        case "top":
            $("#" + model.get("pid")).css("top", val + "px");
            model.set({
                "pTop": val,
                silent: !0
            });

            break;
    }

    //处理逻辑:
    //1. 如果是box类型,需要对svg内再次处理;
    if (model.attributes.pType == 'Box') {
        $("#" + model.get("pid")).children("svg").attr({
            "width": model.attributes.pWidth + "px",
            "height": model.attributes.pHeight + "px"
        })
        .children("rect").attr({
            "width": model.attributes.pWidth,
            "height": model.attributes.pHeight
        });
    }
    model.save();

    if (Globle.LastError.hasError()) {
        Globle.LastError.ShowError();
        location.reload();
    }
}

//得到当前画板内所有动作, 然后得到最大SequenceID
function GetCurrentBoardMaxZIndex() {
    var allSupportZindexModelCollection = Globle.AnimationBaseModelCollection.where({ 'BelongToBoardID': Globle.CurrentBoard.get('pid') });
    var maxZIndex = 0;
    _.each(allSupportZindexModelCollection, function (item) {
        if (parseInt(item.get('SequenceID')) >= maxZIndex) {
            maxZIndex = parseInt(item.get('SequenceID'));
        }
    });
    return maxZIndex;
}

//得到当前页面中所有元素的最大的Z-Index(前提是得支持z-index属性)
function GetCurrentElementsBigZIndex() {
    var allSupportZindexModelCollection = Globle.AllModelCollection.where({ 'IsSuppotZIndex': true, 'pParentElementID': Globle.CurrentBoard.get('pid') });
    var maxZIndex = 0;
    _.each(allSupportZindexModelCollection, function (item) {
        if (parseInt(item.get('SequenceID')) > maxZIndex) {
            maxZIndex = parseInt(item.get('SequenceID'));
        }
    });
    return maxZIndex;
}

//得到当前页面的当前画板中所有元素动作的Sequence的最大值
function GetCurrentElementsActionSequence() {
    var allSupportZindexModelCollection = Globle.AnimationBaseModelCollection.where({ 'BelongToBoardID': Globle.CurrentBoard.get('pid') });
    if (allSupportZindexModelCollection != null) {
        return allSupportZindexModelCollection.length + 1;
    }
    return 0;
}

//初始化旋转的Slider滚动条的方法
function ElementRotate(val, model) {

    $("#sliderElementRotate").slider({
        min: 0,
        max: 360,
        step: 1,
        value: model.get("pRotate"),
        animate: false,
        start: function (event, ui) {
            AddResizeMemo();
        },
        slide: function (event, ui) {
            //            $("#Rotate", val).val(ui.value);
            SetELementRotate("" + ui.value + "");
        },
        stop: function (event, ui) {
            Globle.CurrentModel.save();
            if (Globle.LastError.hasError()) {
                Globle.LastError.ShowError();
                location.reload();
            }
        }
    });
}

//拖动旋转的Slider滚动条中执行的方法
function SetELementRotate(value) {
    $("#" + Globle.CurrentModel.get("pid")).css("-webkit-transform", "rotate(" + value + "deg)"); //-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);
    $("#" + Globle.CurrentModel.get("pid")).css("-ms-transform", "rotate(" + value + "deg)");
    $("#" + Globle.CurrentModel.get("pid")).css("-moz-transform", "rotate(" + value + "deg)");
    $("#" + Globle.CurrentModel.get("pid")).css("-o-transform", "rotate(" + value + "deg)");
    Globle.CurrentModel.set("pRotate", value);

}

function SetButtonShowByPhaseAndUser() {
    if (Globle.CurrentUserIsOwner) {
        //        $("#btnRichText").hide();
        //        //隐藏字幕编辑区域---开始
        //        $("#PanelSection").hide();
        //        $("#PanelSection-resizer").hide();
        //        //隐藏字幕编辑区域----结束
    }

}

//function RotateElement(id) { 点击素材旋转功能，现在做问题多多，先完成大功能
//    var degree;
//    
//    $("#imgRotateIcon").mousemove(function (e) {
//        var mouse_x = e.pageX;
//        var mouse_y = e.pageY;
//        var radians = Math.atan2(mouse_x - 10, mouse_y - 10);
//        degree = (radians * (180 / Math.PI) * -1) + 90;
//        $("#" + Globle.CurrentModel.get("pid")).css("-webkit-transform", "rotate(" + parseInt(degree) + "deg)"); //-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);
//        $("#" + Globle.CurrentModel.get("pid")).css("-ms-transform", "rotate(" + parseInt(degree) + "deg)");
//        $("#" + Globle.CurrentModel.get("pid")).css("-moz-transform", "rotate(" + parseInt(degree) + "deg)");
//        $("#" + Globle.CurrentModel.get("pid")).css("-o-transform", "rotate(" + parseInt(degree) + "deg)");
//    });

//    $("#imgRotateIcon").mouseup(function () {
//        
//    });
//}

//根绝选择的触发器类型，显示不同的东西

function selectChangeType(type, gotoPageID) {
    $("#divSlidElementControl,#divAudioAndVideoControl,#divGoToPage,#divTrigger,#fdOrder,#divChangeSectionControl").hide();

    //触发器控制跳转到子页面
    if (type == "1") {
        $("#divSlidElementControl").parents(".blockMsg").css("height", "");
        $("#divGoToPage").show();
        $("#divGoToPage").children().remove();
        var topicID = getQueryString("TopicID");
        //        var pageID = parseInt($.jstree.reference("#jstree_demo").get_selected()[0]);
        var LoadedCallBack = function () {
            var jsTreeJson = $.jstree.reference("#layer_demo").get_json()[0].children;

            var strHtml = "<ul style=\"list-style-type:none\"><li><label>" + GetTranslateUI('TgoTo') + "：</label><select id='selGoToPage'>";

            for (var i = 0; i < jsTreeJson.length; i++) {

                strHtml += "<option value='" + jsTreeJson[i].id + "' title='" + jsTreeJson[i].a_attr.fullText + "' >" + jsTreeJson[i].text + "</option>";

            }
            strHtml += "</select></li></ul><label style='float:left;'>" + GetTranslateUI('TSubpageslayer') + "</label>";
            $("#divGoToPage").html(strHtml);
            $("#selGoToPage option[value='" + gotoPageID + "']").attr("selected", "selected");
        };
        if (!$.jstree.reference("#layer_demo")) {
            LoadLayer(LoadedCallBack);
        }
        else
            LoadedCallBack();
    }
        //触发器控制动画
    else if (type == "0") {
        $("#divTrigger").show();
        $("#fdOrder").show();
    }
        //触发器控制视频或者音频的播放问题
    else if (type == "2") {
        $("#divAudioAndVideoControl").show();
        //        var checkArr = $("#divAudioAndVideoControl > ul > li > label > .radioPlayName");
        //        for (var i = 0; i < checkArr.length; i++) {
        //            if ($(checkArr[i]).checked) {
        //                $(checkArr[i]).siblings("span").css("display", "block");
        //            }
        //            else {
        //                $(checkArr[i]).siblings("span").css("display", "none");
        //            }
        //        }
        $("#divSlidElementControl").parents(".blockMsg").css("height", "");
    }
        //触发器控制幻灯片
    else if (type == "3") {
        $("#divSlidElementControl").show();
        $("#divSlidElementControl").parents(".blockMsg").css("height", "");
    }
        //触发器控制切换字幕
    else if (type == "4") {
        $("#divChangeSectionControl").show();
        $("#divChangeSectionControl").parents(".blockMsg").css("height", "");
    }
}


//得到当前选中model的action
function GetActionsByRelateElementID(actionType, currentModel) {
    if (actionType)
        return Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": actionType });
    else
        return Globle.AnimationBaseModelCollection.where({ "BelongToElementID": currentModel ? currentModel.get("pid") : Globle.CurrentModel.get("pid") });
}
//得到当前画板所有model的所有action
function GetCurrentBoardAllActions(byIsCanSort) {
    if (byIsCanSort == undefined) {
        byIsCanSort = true;
    }
    var animationBaseModelCollection = new Array();
    var tempAnimationBaseModelCollection = Globle.AnimationBaseModelCollection.where({
        "BelongToBoardID": Globle.CurrentBoard.get("pid"),
        "IsCanSort": byIsCanSort
    });
    for (var i = 0; i < tempAnimationBaseModelCollection.length; i++) {
        var modelTemp = Globle.AllModelCollection.get(parseInt(tempAnimationBaseModelCollection[i].get("BelongToElementID")));
        if (!modelTemp.get("isLayerContent")) {
            if (animationBaseModelCollection.indexOf(tempAnimationBaseModelCollection[i]) < 0) {
                animationBaseModelCollection.push(tempAnimationBaseModelCollection[i]);
            }
        }
    }
    return animationBaseModelCollection;
}

//得到当前画板所有的元素
function GetCurrentBoardAllElements() {
    return Globle.AllModelCollection.where({ "pParentElementID": Globle.CurrentBoard.get("pid") });
}


//再次打开触发器模态中的播放控制选项的时候,判断上次视频或者音频是否被选中进行控制(专门针对播放控制)
function JudgeAudioAndVideoLastIsChecked(ControlAnimationModelArray, elementID) {
    if (ControlAnimationModelArray.length > 0) {
        var animaitonArr = Globle.AnimationBaseModelCollection.where({
            "actionType": "PlayControl",
            "BelongToElementID": elementID
        });
        for (var i = 0; i < animaitonArr.length; i++) {
            if (ControlAnimationModelArray.indexOf("" + animaitonArr[i].id + "") > -1) {
                return true;
            }
        }
    }
    return false;
}
//判断上次添加的触发器中当前视频（音频）是播放（play）还是暂停(stop)
function JudgeAudioAndVideoIsPlayOrStop(ControlAnimationModelArray, elementID) {
    if (ControlAnimationModelArray.length > 0) {
        var animaitonArr = Globle.AnimationBaseModelCollection.where({
            "actionType": "PlayControl",
            "BelongToElementID": elementID
        });
        for (var i = 0; i < animaitonArr.length; i++) {
            if (ControlAnimationModelArray.indexOf("" + animaitonArr[i].id + "") > -1) {
                return animaitonArr[i].get("PlayState");
            }
        }
    }
    return "0";
}

function ForSlidElementCheckbox(ele) {
    if ($(ele).prop("checked")) {
        $(ele).parents("li").find("ul").show();
    }
    else {
        $(ele).parents("li").find("ul").hide();
    }
}

//播放控制显示隐藏播放和暂停单选框
function ForPlayControlCheckbox(ele) {
    if ($(ele).prop("checked")) {
        $(ele).siblings("span").show();
    }
    else {
        $(ele).siblings("span").hide();
    }
}

//得到当前页面所有的视频（mp4）或者音频（mp3）
function GetCurrentBoardAllAudioAndVideo() {
    var allAudioAndVideoModelCollection = new Array();
    var audioCollection = Globle.AllModelCollection.where({
        "pParentElementID": Globle.CurrentBoard.get("pid"),
        "pType": "Audio",
        "isLayerContent": undefined
    });
    var videoCollection = Globle.AllModelCollection.where({
        "pParentElementID": Globle.CurrentBoard.get("pid"),
        "pType": "Video",
        "isLayerContent": undefined
    });
    if (audioCollection.length > 0) {
        for (var i = 0; i < audioCollection.length; i++) {
            allAudioAndVideoModelCollection.push(audioCollection[i]);
        }
    }
    if (videoCollection.length > 0) {
        for (var i = 0; i < videoCollection.length; i++) {
            allAudioAndVideoModelCollection.push(videoCollection[i]);
        }
    }
    return allAudioAndVideoModelCollection;
}


//调整图片宽度高度位置
function OntxtElementWidthKeyUp(txtName, txtValue, height, width) {
    var reg = /^[0-9]\d*$/;
    var wid = $("#" + Globle.CurrentBoard.get("pid")).css("width").substring(0, $("#" + Globle.CurrentBoard.get("pid")).css("width").indexOf('px'));
    var hei = $("#" + Globle.CurrentBoard.get("pid")).css("height").substring(0, $("#" + Globle.CurrentBoard.get("pid")).css("width").indexOf('px'));
    switch (txtName) {
        case 'txtElementWidth':
            if (reg.test(txtValue)) {

                if (parseInt(txtValue) > parseInt(wid) - parseInt(width)) {
                    txtValue = parseInt(wid) - parseInt(width);

                }
                $("#" + Globle.CurrentModel.get("pid") + "_preview_preview").css("width", txtValue + "px");
                $("#txtElementWidth").val(txtValue);
            }

            break;
        case 'txtElementHeight':
            if (reg.test(txtValue)) {

                if (parseInt(txtValue) > parseInt(hei) - parseInt(height)) {
                    txtValue = parseInt(hei) - parseInt(height);

                }
                $("#" + Globle.CurrentModel.get("pid") + "_preview_preview").css("height", txtValue + "px");
                $("#txtElementHeight").val(txtValue);
            }
            break;
        case 'txtElementLeft':
            if (reg.test(txtValue)) {
                if (parseInt(txtValue) > parseInt(wid) - parseInt(height)) {
                    txtValue = parseInt(wid) - parseInt(height);
                }
                $("#" + Globle.CurrentModel.get("pid") + "_preview_preview").css("left", (parseInt(txtValue) + 16) + "px");
                $("#txtElementLeft").val(txtValue);
            }
            break;
        case 'txtElementTop':
            if (reg.test(txtValue)) {
                if (parseInt(txtValue) > parseInt(hei) - parseInt(width)) {
                    txtValue = parseInt(hei) - parseInt(width);
                }
                $("#" + Globle.CurrentModel.get("pid") + "_preview_preview").css("top", (parseInt(txtValue) + 8) + "px");
                $("#txtElementTop").val(txtValue);
            }
            break;
        default:
            break;
    }

}

//调整图片宽度高度位置
function OntxtElementWidthHeightXYKeyUp(txtName, txtValue, height, width) {
    var reg = /^[0-9]\d*$/;
    //    var wid = $("#" + Globle.CurrentBoard.get("pid") + "_preview").css("width").substring(0, $("#" + Globle.CurrentBoard.get("pid") + "_preview").css("width").indexOf('px'));
    //    var hei = $("#" + Globle.CurrentBoard.get("pid") + "_preview").css("height").substring(0, $("#" + Globle.CurrentBoard.get("pid") + "_preview").css("width").indexOf('px'));
    //    console.log(Globle.CurrentModel);

    switch (txtName) {
        case 'txtElementWidth':
            if (reg.test(txtValue)) {


                $("#" + Globle.CurrentModel.get("pid")).css("width", txtValue + "px");
                //                $("#txtElementW").val(txtValue);
                Globle.CurrentModel.set("pWidth", txtValue);
            }

            break;
        case 'txtElementHeight':
            if (reg.test(txtValue)) {


                $("#" + Globle.CurrentModel.get("pid")).css("height", txtValue + "px");
                //                $("#txtElementH").val(txtValue);
                Globle.CurrentModel.set("pWidth", txtValue);
            }
            break;
        case 'txtElementLeft':
            if (reg.test(txtValue)) {

                $("#" + Globle.CurrentModel.get("pid")).css("left", txtValue + "px");
                //                $("#txtElementLeft").val(txtValue);
                Globle.CurrentModel.set("pLeft", txtValue);
            }
            break;
        case 'txtElementTop':
            if (reg.test(txtValue)) {

                $("#" + Globle.CurrentModel.get("pid")).css("top", txtValue + "px");
                //                $("#txtElementTop").val(txtValue);
                Globle.CurrentModel.set("pTop", txtValue);
            }
            break;
        default:
            break;
    }
    Globle.CurrentModel.save();

}


function setWordSize(txtValue) {
    $("#content_" + Globle.CurrentModel.get("pid") + "_preview").css("font-size", parseInt(txtValue) + "px");
}

//保存脚本之后反馈到父页面中的div中
function showScriptDescriptionoOnParentPage(data) {
    $("#ckEditorScriptDescription").html(data);
}

//把脚本描述中的内容传递给子页面中的编辑器中
function passScriptDescriptionToSubPage() {
    return $("#ckEditorScriptDescription").html();
}
//得到当前页面所有的动画集合
function GetCurrentPageAutoAnimationCollection() {
    return Globle.AnimationBaseModelCollection.where({ BelongToBoardID: Globle.CurrentBoard.get("pid"), IsWaitTrigger: false, IsCanSort: true });
}
//根据元素ID（pid）得到元素名称pName
function GetCurrentModelName(belongToElementID) {
    try {
        var eleTemp = Globle.AllModelCollection.where({ pid: belongToElementID })[0];
        if (eleTemp.get("pType") == "layer") {
            return eleTemp.get("pTitle");
        }
        else {
            return eleTemp.get("pName");
        }
    } catch (e) {
        return "";
    }

}
//得到当前页面的所有的触发器集合
function GetCurrenPageTriggerModelCollection(triggerPid) {
    if (triggerPid == "") {
        var triggerModelCollection = new Array();
        var triggerModelCollectionTemp = Globle.TriggerModelCollection.where({ BelongToBoardID: Globle.CurrentBoard.get("pid"), BelongToLayerID: '' });
        for (var i = 0; i < triggerModelCollectionTemp.length; i++) {
            //得到当前触发器控制的动画ID数组
            var controlAnimationModelArray = triggerModelCollectionTemp[i].get("ControlAnimationModelArray");
            //当前触发器没有控制动画（是不会出现此种情况的）
            if (controlAnimationModelArray.length == 0) {
                continue;
            }
            else {
                if (Globle.AnimationBaseModelCollection.where({ BelongToBoardID: Globle.CurrentBoard.get("pid"), pid: controlAnimationModelArray[0] + "_Pelesys" }).length == 0) {
                    continue;
                }
                else {
                    var controlAnimation = Globle.AnimationBaseModelCollection.where({ BelongToBoardID: Globle.CurrentBoard.get("pid"), pid: controlAnimationModelArray[0] + "_Pelesys" })[0];
                    var controlAnimationType;
                    if (controlAnimation == null) {
                        return;
                    }
                    else {
                        controlAnimationType = controlAnimation.get("actionType");
                    }
                    if (typeof (controlAnimationType) == "undefined") {
                        return;
                    }
                        //以下四种类型触发器控制动画不需要显示在时间线页面
                    else if (controlAnimationType == "GoToPage" || controlAnimationType == "SlideControl" || controlAnimationType == "PlayControl" || controlAnimationType == "ChangeSection") {
                        continue;
                    }
                    else {
                        triggerModelCollection.push(triggerModelCollectionTemp[i]);
                    }
                }
            }
        }
        return triggerModelCollection;
    }
    else {
        return Globle.TriggerModelCollection.where({ BelongToBoardID: Globle.CurrentBoard.get("pid"), pid: triggerPid });
    }
}
//根据动画ID得到当前动画
function GetCurrentAnimationByPId(id) {
    var currentAnimaitonCollection = Globle.AnimationBaseModelCollection.where({ BelongToBoardID: Globle.CurrentBoard.get("pid"), pid: id + "_Pelesys", IsCanSort: true });
    if (currentAnimaitonCollection.length == 0) {
        return null;
    }
    else {
        return Globle.AnimationBaseModelCollection.where({ BelongToBoardID: Globle.CurrentBoard.get("pid"), pid: id + "_Pelesys", IsCanSort: true })[0];
    }
}

 //时间线中更新动画的时间参数
function TimeLineEditAnimationProp(animationID, delay, repeatCount, duration) {
    var animationModel = Globle.AnimationBaseModelCollection.get(parseInt(animationID));
    if (animationModel) {
        animationModel.set({
            delay: isNaN(parseInt(delay)) ? 0 : parseInt(delay),
            repeatCount: isNaN(parseInt(repeatCount)) ? 0 : parseInt(repeatCount),
            duration: isNaN(parseInt(duration)) ? 0 : parseInt(duration)
        }).save();
        if (Globle.LastError.hasError()) {
            Globle.LastError.ShowError();
            location.reload();
            return "error";
        }
    }
    return "ok";
}

//解决双击脚本描述区域时候，出现大片蓝色选中区域的问题
document.ondblclick = function (e) {
    var r;
    if (e) {
        r = window.getSelection(); r.removeAllRanges();
    }
    else {
        var r = document.selection.createRange();
        if (r.text.length > 0) { r.move('character', r.text.length); r.select(); }
    }
}



//控制每个按钮是否显示或隐藏
//该方法只提供给层和页切换时使用
function SetButtonVisible(buttonJson) {
    $("#inactionArea .layoutTemplate").hide();
    var DefaultButtonJson = {
        btnRichText: true,
        btnLinkRichText: true,
        btnResourceFile: true,
        btnAudio: true,
        btnMp4: true,
        btnSlid: true,
        btnSequence: true,
        btnRotate: true,
        btnAddGlStudio: true,
        btnButton: true,
        btnLayer: true,
        btnFlash: true,
        btnSVG: true,
        btnLeftArrow: true,
        btnRightArrow: true,
        btnUpArrow: true,
        btnDownArrow: true,
        btnBugFlag: true, btnBugFlag1: true,
        btnSave: true,
        btnPageTemplate: true,
        btnTimeline: true,
        btnLayerSave: false,
        btnWebForm: false
    };
    DefaultButtonJson = $.extend(DefaultButtonJson, buttonJson);
    var hideIdArray = '', showIdArray = '';
    _.each(DefaultButtonJson, function (value, key) {
        if (value) {
            showIdArray += ",#" + key;
        }
        else {
            hideIdArray += ",#" + key;
        }
    });

    $(showIdArray.substring(1)).show();
    $(hideIdArray.substring(1)).hide();
}

//载入layer
function LoadLayer(loadedCallBack) {
    var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");

    $('#layer_demo').jstree({
        "plugins": ["state", "types", "wholerow", "themes", "contextmenu"],
        "core": {
            "animation": 0,
            "data": {
                "url": trueLocation,
                "data": function ($node) {
                    return {
                        "actionType": "loadLayer",
                        "cbtUnitID": $node.attr ? $node.attr("id") : Globle.CbtUnitID,
                        "rand": Math.random()
                    };
                },
                "error": function (request, status, exception) {
                    if (exception != "") {
                        alert('getlayerstructure(): ' + status.toString());
                    }
                }
            }
        },
        "types": {
            "layer": {
                "icon": "AnimationResource/images/layers.png"
            }
        },
        "contextmenu": {
            "items": function (node) {
                console.log(node);
                return {
                    "create": null,
                    "rename": null,
                    "remove": null,
                    "addLayer": {
                        "label": GetTranslateUI('TNewLayer'),
                        "icon": "layerContextMenuClass",
                        "action": function () {
                            console.log('新建层');
                            var BoardItem = new BoardModel({
                                "pTitle": GetTranslateUI('TCustomlayer'),
                                "pType": "layer",
                                "IsSuppotZIndex": !1//是否支持排序
                            });
                            Globle.CurrentBoard = BoardItem;
                            BoardItem.save();
                            if (Globle.LastError.hasError()) {
                                //说明保存失败
                                //提示用户,并且刷新页面
                                Globle.LastError.ShowError(GetTranslateUI("TSavefailsreloadthepage"));
                                location.reload();
                            }
                            else {
                                Globle.BoardModelCollection.add(BoardItem);
                                //刷新当前树
                                $.jstree.reference("#layer_demo").refresh();
                            }
                        },
                        "_disabled ": true
                    },
                    "deleteLayer": {
                        "label": GetTranslateUI('TDeleteLayer'),
                        "icon": "layerContextMenuClass",
                        "action": function () {
                            new CommonPopupModalView({
                                model: new CommonMessageModal({
                                    title: GetTranslateUI('TWarning'),
                                    message: GetTranslateUI('TConfirmdeleteit'),
                                    isShowSaveButton: !1,
                                    isShowCancelButton: !0,
                                    isShowOkButton: !0,
                                    ContentTemplateID: "#SureMessageModalTemplate",
                                    okEventProcess: function () {

                                        var deleteLayerFun = function () {
                                            $.jstree.reference("#layer_demo").deselect_all();

                                            var tempCurrentModel = Globle.CurrentBoard;
                                            Globle.BoardModelCollection.remove(Globle.CurrentBoard);
                                            if (Globle.LastError.hasError()) {
                                                //说明有错误
                                                Globle.LastError.ShowError("网络错误,未删除成功!");
                                                location.reload();
                                            }
                                            else {
                                                //选中root,然后刷新
                                                $.jstree.reference("#layer_demo").select_node("#root");
                                                $.jstree.reference("#layer_demo").refresh();
                                            }
                                        };

                                        //修改bug,bug表述:------------------------------------------开始
                                        // 删除一个已经使用层时,报错,错误原因是键被引用.
                                        //修改方式:
                                        //1. 在删除一个层时,首先判断该层是否已经被页面使用(插入到页面或被页面跳转到层的方式使用),
                                        // 如果已经使用,那么提示用户, 已经被使用某个画板使用,无法删除,如果想删除,请首先删除画板内的层;
                                        $.ajax({
                                            method: "get",
                                            async: false,
                                            url: trueLocation,
                                            data: {
                                                "actionType": "CheckDeleteLayer",
                                                "cbtUnitID": Globle.CbtUnitID,
                                                "unitItemPageContentID": Globle.CurrentBoard.id
                                            },
                                            success: function (data) {
                                                switch (data.result) {
                                                    case "ok":
                                                        deleteLayerFun();
                                                        break;

                                                    case "no":
                                                        alert(GetTranslateUI("TThislayerhasbeenusedfirstdeletethepagereferencedlayer"));
                                                        location.reload();
                                                        break;

                                                    case "error":
                                                        alert(data.message);
                                                        break;

                                                    default:
                                                        alert(GetTranslateUI("TDeletelayererrorsafterclickingOKtorefreshpage"));
                                                        location.reload();
                                                        break;
                                                }

                                            },
                                            complete: function () {
                                                //                console.log("hide111111111111");
                                                $.unblockUI();
                                                //                $("#iframeModalHelper").css("z-index", "-11111").hide();
                                            },
                                            beforeSend: function () {
                                                //                console.log("show111111111111");
                                                //                $("#iframeModalHelper").show().css("z-index", 9999999999999999);
                                                $.blockUI({ message: "后台正在删除,请稍后..." });
                                            }
                                        })
                                        //----------------------------------------------------------结束
                                    }
                                })
                            }).showModal(null
                            , {
                                width: "400px",
                                left: "40%"
                            });
                        },
                        "_disabled": false
                    }
                }
            }
        }
    })
    .on('select_node.jstree', function (e, data) {
        //翻译根节点
        data.instance.set_text(["root"], GetTranslateUI('TCurrentcoursewarelayer'));

        Globle.CopyElement = null;
        Globle.CopyAction = null;
        //如果是根节点,直接返回
        var selectedNode = data.instance.get_node(data.selected[0]);
        if (selectedNode.id == "root") {
            $("#layerH5").hide();
            $("#layerFieldSet").hide();
            $("#layerBackGroundImage").hide();
            $("#pageSetPanel > li:eq(2)").hide();
            //            Globle.LayoutObj.hide("east");
            //解决层会莫名其妙隐藏的问题
            $("#container div[ptype='board']").siblings("div[ptype='layer']").css("display", "none");
            return;
        }
        else {
            $("#layerH5").show();
            $("#layerFieldSet").show();
            $("#layerBackGroundImage").show();
        }
        //查找是否已存在画板,不存在新建一个
        ClickTreeNode({
            id: selectedNode.id,
            UnitItemPageContentID: selectedNode.li_attr.UnitItemPageContentID,
            node: selectedNode,
            isClicked: selectedNode.isClicked ? !0 : !1
        }, true);
        //标记节点是否点击过
        selectedNode.isClicked = !0;
    })
    //    .on("refresh.jstree", function (e, data) {
    //        //翻译根节点
    //        data.instance.set_text(["root"], GetTranslateUI('TCurrentcoursewarelayer'));
    //    })
    .on("ready.jstree", function (e, data) {
        console.log("ready");
        if (!_.isFunction(loadedCallBack))//如果为function,说明是触发器调用,这时不需要unblockUI
            $.unblockUI();
    })
    .on("loaded.jstree", function (e, data) {
        //              console.log(e.name);
        if (!_.isFunction(loadedCallBack))//如果为function,说明是触发器调用,这时不需要blockUI
            $.blockUI({ message: GetTranslateUI('TLoadlayerdatalater') + "..." });
        console.log("loaded");
        //开始循环载入所有的page相关的信息,等待该方法执行结束
        //                InitModel(_.map(data.instance.get_json(), function (n) { return n.id }));
        //默认选中根节点
        data.instance.select_node(data.instance.get_json()[0]);

        loadedCallBack && loadedCallBack();


        //翻译根节点
        data.instance.set_text(["root"], GetTranslateUI('TCurrentcoursewarelayer'));
    });
}

//点击树节点执行的事件
function ClickTreeNode(data, isForLayer) {
    Globle.MemoCollectionManager.Clear();

    console.log(data);
    //点击一个page,才会去后台请求该page包含的所有内容
    //判断:如果当前已存在画板的div,那么说明已经请求过了,就不用再次请求了
    if (!data.isClicked)
        InitModel(data.id, data.UnitItemPageContentID, isForLayer);

    //找到当前的画板
    //未找到,新建一个画板
    Globle.CurrentBoard = Globle.BoardModelCollection.get(data.UnitItemPageContentID);
    if (!Globle.CurrentBoard) {
        //如果当前页面没有画板,那么创建一个
        var boardItem = new BoardModel();
        Globle.CurrentBoard = boardItem;
        Globle.IsInit || boardItem.save();
        if (Globle.LastError.hasError()) {
            //说明保存失败
            //提示用户,并且刷新页面
            Globle.LastError.ShowError(GetTranslateUI("TSavefailsreloadthepage"));
        }
        else {
            Globle.BoardModelCollection.add(boardItem);

            data.node.li_attr.UnitItemPageContentID = boardItem.id;
            Globle.CurrentBoard.set({ "pFocus": !Globle.CurrentBoard.get("pFocus") });
            Globle.CurrentBoard.set({ "pUpdateAttributeView": !Globle.CurrentBoard.get("pUpdateAttributeView") });
        }
    }
    else {
        Globle.CurrentBoard.set({ "pFocus": !Globle.CurrentBoard.get("pFocus") });
        Globle.CurrentBoard.set({ "pUpdateAttributeView": !Globle.CurrentBoard.get("pUpdateAttributeView") });
    }
    if (Globle.CurrentBoard.get("pType") == "layer") {
        $("#pageSetPanel > li:eq(2)").hide();
    }
    else if (Globle.CurrentBoard.get("pType") == "board") {
        $("#pageSetPanel > li:eq(2)").show();
    }
}

//新复合动画弹出框
function ForComplexAnimationModal(complexModel) {
    complexModel.set({
        title: GetTranslateUI('TComplexanimationsettings'),
        isShowSaveButton: !0,
        isShowCancelButton: !0,
        isShowOkButton: !1,
        ContentTemplateID: "#EmptyTemplate",
        saveEventProcess: function () {
            this.set({
                "delay": $("#txtDelayTime", this.$el).val(),
                "duration": $("#txtDurationTime", this.$el).val(),
                "repeatCount": $("#txtRepeat", this.$el).val(),
                "IsWaitTrigger": ($("#chkIsWaitTrigger:checked").length == 0 ? !1 : !0),
                "ActionMethod": $("#actionMethod").val(),
                "isNew": !1,
                "ComplexHeight": $("#txtElementHeight").val(),
                "ComplexWidth": $("#txtElementWidth").val(),
                "ComplexOpacity": $("#txtElementTransparent").val(),
                // "ComplexFontSize": $("#txtElementFontSize").val(),
                "ComplexLeft": $("#txtElementLeft").val(),
                "ComplexTop": $("#txtElementTop").val(),
                silent: !0
            });
            this.save();
            //            $(".ui-dialog-content").css("overflow", "hidden");
            $(".emptyHolder").remove();
            //                                var tempCurrentModel = Globle.CurrentModel;
            //                                Globle.AllModelCollection.remove(Globle.CurrentModel);
            //                                if (Globle.LastError.hasError()) {
            //                                    //说明有错误
            //                                    Globle.LastError.ShowError("网络错误,未删除成功!");
            //                                }
            //                                else
            //                                    Globle.MemoCollectionManager.AddMemo(ElementBaseModel.CreateMemo(tempCurrentModel, "Delete"));
        }
    });
    new CommonPopupModalView({
        model: complexModel
    }).showModal(function () {
        $(".emptyHolder").empty().append(($(BoardModel.toStringForAnimation()).append(GetAllModelHTML(!0)[0])).css({ "top": Globle.CurrentBoard.get("pTop"), "left": Globle.CurrentBoard.get("pLeft"), "width": Globle.CurrentBoard.get("pWidth"), "height": Globle.CurrentBoard.get("pHeight"), "position": "relative", "Opacity": "1", "border": "1px solid #e5e5e5" }));
        BoardModel.FilterCurrentBoardAllElement($('.emptyHolder'));
        //        $(".emptyHolder").append(Globle.CurrentBoard.toString("board"));
        //       $(".emptyHolder").children("div").css({ "Opacity": "0","z-index":"0" });
        var newAnimationModel = Globle.AnimationBaseModelCollection.where({ BelongToBoardID: Globle.CurrentBoard.get("pid"), BelongToElementID: Globle.CurrentModel.get("pid"), actionType: "ComplexAnimationType" })[0];

        switch (Globle.CurrentModel.attributes.pType) {

            case "Image":
                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="position:absolute;width:' + Globle.CurrentModel.attributes.pWidth + 'px;height:' + Globle.CurrentModel.attributes.pHeight + 'px;  top:' + (parseInt(Globle.CurrentModel.attributes.pTop) + 8) + 'px;left:' + (parseInt(Globle.CurrentModel.attributes.pLeft) + 16) + 'px;-webkit-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-ms-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-moz-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);Opacity:' + Globle.CurrentModel.get("pTransparent") + ';-o-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg); z-index:' + Globle.CurrentModel.attributes.SequenceID + ';"><img src="' + Globle.CurrentModel.attributes.pFileUrl + '" alt="' + Globle.CurrentModel.attributes.pName + '" style="width:100%;height:100%; "/></div> ';

                var changDiv = '<div style="position:absolute;border:1px red dashed;width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px;top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px;-webkit-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-ms-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-moz-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);Opacity:' + newAnimationModel.get("ComplexOpacity") + ';-o-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);"><img src="' + Globle.CurrentModel.attributes.pFileUrl + '" alt="' + Globle.CurrentModel.attributes.pName + '" style="width:100%;height:100%; "/></div>';
                break;
            case "Box":
                var fillColor = "none";
                if (Globle.CurrentModel.get("pBackGroundIsOpacity")) {
                    fillColor = "none";
                }
                else {
                    fillColor = Globle.CurrentModel.get("pBackGroundColor");
                }
                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="width:' + Globle.CurrentModel.attributes.pWidth + 'px;height:' + Globle.CurrentModel.attributes.pHeight + 'px; position:absolute;Opacity:' + Globle.CurrentModel.get("pTransparent") + ';top:' + (parseInt(Globle.CurrentModel.attributes.pTop) + 8) + 'px;left:' + (parseInt(Globle.CurrentModel.attributes.pLeft) + 16) + 'px;z-index:' + Globle.CurrentModel.attributes.SequenceID + '; "><svg width="100%" height="100%" version="1.1"><rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" fill="' + fillColor + '" stroke= "' + Globle.CurrentModel.get("pBorderColor") + '" stroke-width= "' + Globle.CurrentModel.get("pBorderWidth") + '" /></svg></div> ';

                var changDiv = '<div style="border:1px red dashed; width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px;Opacity:' + newAnimationModel.get("ComplexOpacity") + '; position:absolute;top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px;"><svg width="' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px" height="' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px" version="1.1"><rect x="0" y="0" rx="0" ry="0" width="' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + '" height="' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + '" fill="' + fillColor + '" stroke= "' + Globle.CurrentModel.get("pBorderColor") + '" stroke-width= "' + Globle.CurrentModel.get("pBorderWidth") + '" /></svg></div> ';
                break;
            case "Circle":
                var fillColor = "none";
                if (Globle.CurrentModel.get("pBackGroundIsOpacity")) {
                    fillColor = "none";
                }
                else {
                    fillColor = Globle.CurrentModel.get("pBackGroundColor");
                }
                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="width:' + Globle.CurrentModel.attributes.pWidth + 'px;height:' + Globle.CurrentModel.attributes.pHeight + 'px; position:absolute;top:' + (parseInt(Globle.CurrentModel.attributes.pTop) + 8) + 'px;Opacity:' + Globle.CurrentModel.get("pTransparent") + ';left:' + (parseInt(Globle.CurrentModel.attributes.pLeft) + 16) + 'px;z-index:' + Globle.CurrentModel.attributes.SequenceID + '; "><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 44 44" width="100%" height="100%" version="1.1"><circle fill="' + fillColor + '" stroke="' + Globle.CurrentModel.get("pBorderColor") + '" stroke-width="' + Globle.CurrentModel.get("pBorderWidth") + '" cx="22" cy="22" r="' + Globle.CurrentModel.get("pCircleRadius") + '" /></svg></div> ';

                var changDiv = '<div style="border:1px red dashed; width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px; position:absolute;top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;Opacity:' + newAnimationModel.get("ComplexOpacity") + ';left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px; "><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 44 44" width="100%" height="100%" version="1.1"><circle fill="' + fillColor + '" stroke="' + Globle.CurrentModel.get("pBorderColor") + '" stroke-width="' + Globle.CurrentModel.get("pBorderWidth") + '" cx="22" cy="22" r="' + Globle.CurrentModel.get("pCircleRadius") + '" /></svg></div> ';
                break;
            case "Ellipse":
                var fillColor = "none";
                if (Globle.CurrentModel.get("pBackGroundIsOpacity")) {
                    fillColor = "none";
                }
                else {
                    fillColor = Globle.CurrentModel.get("pBackGroundColor");
                }
                var pEllipseRX = Globle.CurrentModel.get("pEllipseRX") + "%";
                var pEllipseRY = Globle.CurrentModel.get("pEllipseRY") + "%";
                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="width:' + Globle.CurrentModel.attributes.pWidth + 'px;height:' + Globle.CurrentModel.attributes.pHeight + 'px; position:absolute;top:' + (parseInt(Globle.CurrentModel.attributes.pTop) + 8) + 'px;Opacity:' + Globle.CurrentModel.get("pTransparent") + ';left:' + (parseInt(Globle.CurrentModel.attributes.pLeft) + 16) + 'px;z-index:' + Globle.CurrentModel.attributes.SequenceID + '; "><svg width="100%" height="100%"><ellipse cx="50%" cy="50%" rx="' + pEllipseRX + '" ry="' + pEllipseRY + '" style="fill:' + fillColor + ';stroke:' + Globle.CurrentModel.get("pBorderColor") + ';stroke-width:' + Globle.CurrentModel.get("pBorderWidth") + '"></ellipse></svg></div> ';

                var changDiv = '<div style="border:1px red dashed; width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px; position:absolute;top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;Opacity:' + newAnimationModel.get("ComplexOpacity") + ';left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px; "><svg width="100%" height="100%"><ellipse cx="50%" cy="50%" rx="' + pEllipseRX + '" ry="' + pEllipseRY + '" style="fill:' + fillColor + ';stroke:' + Globle.CurrentModel.get("pBorderColor") + ';stroke-width:' + Globle.CurrentModel.get("pBorderWidth") + '"></ellipse></svg></div> ';
                break;
            case "Arrow":
                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="-webkit-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-ms-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-moz-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-o-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);Opacity:' + Globle.CurrentModel.get("pTransparent") + ';width:' + Globle.CurrentModel.attributes.pWidth + 'px;height:' + Globle.CurrentModel.attributes.pHeight + 'px; position:absolute;top:' + (parseInt(Globle.CurrentModel.attributes.pTop) + 8) + 'px;left:' + (parseInt(Globle.CurrentModel.attributes.pLeft) + 16) + 'px;z-index:' + Globle.CurrentModel.attributes.SequenceID + '; "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" version="1.1"><path fill="none" stroke="' + Globle.CurrentModel.get("color") + '" stroke-linejoin="round" stroke-width="2" transform="translate(0)" d="M 96 53 L 68 53 M 70 53 L 8 53" version="1.1"></path><path fill="' + Globle.CurrentModel.get("color") + '" stroke="' + Globle.CurrentModel.get("color") + '" transform="translate(0)" d="M 4 53 L 24 48 L 24 58 L 4 53 Z" version="1.1"></path></svg></div> ';

                var changDiv = '<div style="border:1px red dashed;-webkit-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-ms-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-moz-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-o-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);Opacity:' + newAnimationModel.get("ComplexOpacity") + ';width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px; position:absolute;top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" version="1.1"><path fill="none" stroke="' + Globle.CurrentModel.get("color") + '" stroke-linejoin="round" stroke-width="2" transform="translate(0)" d="M 96 53 L 68 53 M 70 53 L 8 53" version="1.1"></path><path fill="' + Globle.CurrentModel.get("color") + '" stroke="' + Globle.CurrentModel.get("color") + '" transform="translate(0)" d="M 4 53 L 24 48 L 24 58 L 4 53 Z" version="1.1"></path></svg></div> ';
                break;
            case "AdvanceArrow":
                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="-webkit-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-ms-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-moz-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-o-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);Opacity:' + Globle.CurrentModel.get("pTransparent") + ';width:' + Globle.CurrentModel.attributes.pWidth + 'px;height:' + Globle.CurrentModel.attributes.pHeight + 'px; position:absolute;top:' + (parseInt(Globle.CurrentModel.attributes.pTop) + 8) + 'px;left:' + (parseInt(Globle.CurrentModel.attributes.pLeft) + 16) + 'px;z-index:' + Globle.CurrentModel.attributes.SequenceID + '; "><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1"><path pointer-events="visibleStroke" stroke-linejoin="round" transform="translate(0)" d="' + Globle.CurrentModel.attributes.pArrowSvgPath1 + '" version="1.1" style="stroke: ' + Globle.CurrentModel.attributes.pArrowColor + '; fill: ' + Globle.CurrentModel.attributes.pArrowColor + '; stroke-width: ' + Globle.CurrentModel.attributes.pArrowStrokeWidth + ';"></path><path pointer-events="all" transform="translate(0)" d="' + Globle.CurrentModel.attributes.pArrowSvgPath2 + '" style="stroke: ' + Globle.CurrentModel.attributes.pArrowColor + '; fill: ' + Globle.CurrentModel.attributes.pArrowColor + ';"></path></svg></div> ';

                var changDiv = '<div style="border:1px red dashed;-webkit-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-ms-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-moz-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-o-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);Opacity:' + newAnimationModel.get("ComplexOpacity") + ';width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px; position:absolute;top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px;"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1"><path pointer-events="visibleStroke" stroke-linejoin="round" transform="translate(0)" d="' + Globle.CurrentModel.attributes.pArrowSvgPath1 + '" version="1.1" style="stroke: ' + Globle.CurrentModel.attributes.pArrowColor + '; fill: ' + Globle.CurrentModel.attributes.pArrowColor + '; stroke-width: ' + Globle.CurrentModel.attributes.pArrowStrokeWidth + ';"></path><path pointer-events="all" transform="translate(0)" d="' + Globle.CurrentModel.attributes.pArrowSvgPath2 + '" style="stroke: ' + Globle.CurrentModel.attributes.pArrowColor + '; fill: ' + Globle.CurrentModel.attributes.pArrowColor + ';"></path></svg></div> ';
                break;
                //background:' + Globle.CurrentModel.attributes.pBackGroundIsOpacity == true ? 'transparent' : Globle.CurrentModel.attributes.pBackGroundColor + ';                                                                                                                     
            case "RichText":
                var backGroundRichText;
                if (Globle.CurrentModel.get("pBackGroundIsOpacity")) {
                    backGroundRichText = "transparent";
                }
                else {
                    backGroundRichText = Globle.CurrentModel.get("pBackGroundColor");
                }
                var borderColor = Globle.CurrentModel.get("pBorderColor");


                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="position:absolute;border:1px solid transparent;width:' + Globle.CurrentModel.attributes.pWidth + 'px;height:' + Globle.CurrentModel.attributes.pHeight + 'px;-webkit-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-ms-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-moz-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);Opacity:' + Globle.CurrentModel.get("pTransparent") + ';-o-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);  top:' + (parseInt(Globle.CurrentModel.attributes.pTop) + 8) + 'px;left:' + (parseInt(Globle.CurrentModel.attributes.pLeft) + 16) + 'px;z-index:' + Globle.CurrentModel.attributes.SequenceID + ';"><div id="content_' + Globle.CurrentModel.get("pid") + '_preview" style="width:100%;height:100%;border-style:solid;border-color:' + borderColor + ';border-width:' + Globle.CurrentModel.get("pBorderWidth") + 'px;background:' + backGroundRichText + '; ">' + $("#content_" + Globle.CurrentModel.get("pid") + "").html() + '</div></div> ';

                var changDiv = '<div style="position:absolute;border:1px red dashed;width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px;top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px;-webkit-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-ms-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);-moz-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);Opacity:' + newAnimationModel.get("ComplexOpacity") + ';-o-transform:rotate(' + Globle.CurrentModel.get("pRotate") + 'deg);"><div id="content_' + Globle.CurrentModel.get("pid") + '_preview" style="width:100%;height:100%;border-style:solid;border-color:' + borderColor + ';border-width:' + Globle.CurrentModel.get("pBorderWidth") + 'px;background:' + backGroundRichText + '; ">' + $("#content_" + Globle.CurrentModel.get("pid") + "").html() + '</div></div> ';
                break;
            case "ButtonType":
                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="position:absolute;width:' + Globle.CurrentModel.attributes.pWidth + 'px;Opacity:' + Globle.CurrentModel.get("pTransparent") + ';height:' + Globle.CurrentModel.attributes.pHeight + 'px;  top:' + (parseInt(Globle.CurrentModel.attributes.pTop) + 8) + 'px;left:' + (parseInt(Globle.CurrentModel.attributes.pLeft) + 16) + 'px; z-index:' + Globle.CurrentModel.attributes.SequenceID + ';"><img src="' + Globle.CurrentModel.attributes.ImageArray[0].get("pFileUrl") + '" alt="' + Globle.CurrentModel.attributes.pName + '" style="width:100%;height:100%; "/></div> ';

                var changDiv = '<div style="position:absolute;width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;Opacity:' + newAnimationModel.get("ComplexOpacity") + ';height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px;top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px;"><img src="' + Globle.CurrentModel.attributes.ImageArray[0].get("pFileUrl") + '" alt="' + Globle.CurrentModel.attributes.pName + '" style="width:100%;height:100%; "/></div> ';
                break;

            case "ImageSlide":
                var str = '<div class="pcontent" id="' + Globle.CurrentModel.get("pid") + '_preview_preview" style="position:absolute;width:' + Globle.CurrentModel.attributes.pWidth + 'px;Opacity:' + Globle.CurrentModel.get("pTransparent") + ';height:' + Globle.CurrentModel.attributes.pHeight + 'px;  top:' + (Globle.CurrentModel.attributes.pTop + 8) + 'px;left:' + (Globle.CurrentModel.attributes.pLeft + 16) + 'px; z-index:' + Globle.CurrentModel.attributes.SequenceID + ';"><img src="' + Globle.CurrentModel.attributes.ImageArray[0].attributes.pFileUrl + '" alt="' + Globle.CurrentModel.attributes.ImageArray[0].attributes.pName + '" style="width:100%;height:100%; "/></div> ';

                var changDiv = '<div style="position:absolute;border:1px red dashed;width:' + (newAnimationModel.get("ComplexWidth") == '' ? Globle.CurrentModel.get("pWidth") : newAnimationModel.get("ComplexWidth")) + 'px;height:' + (newAnimationModel.get("ComplexHeight") == '' ? Globle.CurrentModel.get("pHeight") : newAnimationModel.get("ComplexHeight")) + 'px;Opacity:' + newAnimationModel.get("ComplexOpacity") + ';top:' + (parseInt(newAnimationModel.get("ComplexTop") == '' ? Globle.CurrentModel.get("pTop") : newAnimationModel.get("ComplexTop")) + 8) + 'px;left:' + (parseInt(newAnimationModel.get("ComplexLeft") == '' ? Globle.CurrentModel.get("pLeft") : newAnimationModel.get("ComplexLeft")) + 16) + 'px;"><img src="' + Globle.CurrentModel.attributes.ImageArray[0].attributes.pFileUrl + '" alt="' + Globle.CurrentModel.attributes.ImageArray[0].attributes.pName + '" style="width:100%;height:100%; "/></div>';

                break;
        }

        //      $(".emptyHolder").children("div");
        $(".emptyHolder").append(changDiv).append(str);
        //        $(".emptyHolder").append(($(BoardModel.toStringForAnimation()).append(GetAllModelHTML(!0)[0])).css({ "top": "0px", "position": "absolute","z-index":"0" }));

        setComplexModelWHXYValue(newAnimationModel);

    }
    , {
        top: "3%",
        width: "1380px",
        left: "1%"
    });
    $("#" + Globle.CurrentBoard.get("pid") + "_preview").css({ "border": "1px solid rgb(240,237,237)", "overflow": "hidden", "position": "relative" }); //position:absolute position:relative


    switch (Globle.CurrentModel.attributes.pType) {
        case "Arrow":
        case "AdvanceArrow":
        case "Image":
        case "ButtonType":
        case "Circle":
        case "Ellipse":
        case "Box":
        case "ImageSlide":
            setComplexResizableAndDraggable();
            break;
        case "RichText":
            setComplexResizableAndDraggable();
            break;
    }

    ElementTransparent();
}

function setComplexModelWHXYValue(newAnimation) {
    $("#txtElementWidth").val(newAnimation.get("ComplexWidth") == '' ? Globle.CurrentModel.attributes.pWidth : newAnimation.get("ComplexWidth"));
    $("#txtElementHeight").val(newAnimation.get("ComplexHeight") == '' ? Globle.CurrentModel.attributes.pHeight : newAnimation.get("ComplexHeight"));
    $("#txtElementTop").val(newAnimation.get("ComplexTop") == '' ? Globle.CurrentModel.attributes.pTop : newAnimation.get("ComplexTop"));
    $("#txtElementLeft").val(newAnimation.get("ComplexLeft") == '' ? Globle.CurrentModel.attributes.pLeft : newAnimation.get("ComplexLeft"));
    $("#txtElementTransparent").val(newAnimation.get("ComplexOpacity") == '' ? Globle.CurrentModel.attributes.pTransparent : newAnimation.get("ComplexOpacity"));
    //    $("#sliderElementTransparent").slider("value", newAnimation.get("ComplexOpacity") == '' ? Globle.CurrentModel.attributes.pTransparent : newAnimation.get("ComplexOpacity"));
}

//设置复合动画画板中元素的拖拽和拉伸动作  txtElementWidth
function setComplexResizableAndDraggable() {
    if (Globle.CurrentModel.get("pType") == "AdvanceArrow") {
        $('#' + Globle.CurrentModel.get("pid") + '_preview_preview').draggable({
            delay: Globle.DragDelayTime,
            drag: function (event, ui) {
                $("#txtElementTop").val(parseInt(ui.position.top) - 8);
                $("#txtElementLeft").val(parseInt(ui.position.left) - 16);
            }
        });
    }
    else {
        $('#' + Globle.CurrentModel.get("pid") + '_preview_preview')
            .resizable({
                handles: 'n, e, s, w,ne, se, sw, nw',
                resize: function (event, ui) {

                    $("#txtElementWidth").val(parseInt(ui.size.width));
                    $("#txtElementHeight").val(parseInt(ui.size.height));
                    $("#txtElementTop").val(parseInt(ui.position.top) - 8);
                    $("#txtElementLeft").val(parseInt(ui.position.left) - 16);
                }
            }).draggable({
                delay: Globle.DragDelayTime,
                drag: function (event, ui) {

                    $("#txtElementTop").val(parseInt(ui.position.top) - 8);
                    $("#txtElementLeft").val(parseInt(ui.position.left) - 16);
                }
            });
    }
    $(".ui-icon", $('#' + Globle.CurrentModel.get("pid") + '_preview_preview')).css({ "width": "8px", "height": "8px" });
}


function startCalcuteGuide(event, ui) {
    //    var tempCurrentModel = Globle.CurrentModel.clone();
    //    console.log(tempCurrentModel.get("pLeft"));
    guides = $.map($(".pcontent").not(this), computeGuidesForElement);
    innerOffsetX = event.originalEvent.offsetX;
    innerOffsetY = event.originalEvent.offsetY;
}


//返回的字符串,不含board
function GetAllModelHTML(isStatic) {
    var tempHtmlContent = '';
    var tempElementList = new Array();
    //循环当前画板内当前的model,将modle加入到字符串中
    _.filter(Globle.AllModelCollection.models, function (item1) {
        if (item1.get("pParentElementID") == Globle.CurrentBoard.get("pid")) {
            //不处理layer内的元素,layer内的元素,有layer内部进行统一处理
            if (item1.get('isLayerContent')) {
                console.log("is layer children");
                return !1;
            }
            else {
                console.log("not layer children");
                tempElementList.push(item1.get("pid"));
                tempHtmlContent += (isStatic ? item1.toStringForStaticHtml() : item1.toString());
                return !0;
            }
        }
        return !1;
    });
    return [tempHtmlContent, tempElementList];
}
function dragCalcuteGuide(event, ui) {
    ClacMultipleElementPostion(event, ui);

    //如果处于多选状态, 那么就不计算了
    var $current = $(event.target);
    if ($current.hasClass("ui-selected"))
        return false;

    // iterate all guides, remember the closest h and v guides
    var guideV, guideH, distV = MIN_DISTANCE + 1, distH = MIN_DISTANCE + 1, offsetV, offsetH, currentBoardTemp;
    currentBoardTemp = $("#" + Globle.CurrentBoard.attributes.pid);
    var chosenGuides = { top: { dist: MIN_DISTANCE + 1 }, left: { dist: MIN_DISTANCE + 1 } };
    var $t = $(this);
    var pos = { top: event.originalEvent.pageY - innerOffsetY - currentBoardTemp.offset().top, left: event.originalEvent.pageX - innerOffsetX - $("#" + Globle.CurrentBoard.attributes.pid).offset().left };
    var w = $t.outerWidth() - 1;
    var h = $t.outerHeight() - 1;
    var elemGuides = computeGuidesForElement(null, pos, w, h);
    $.each(guides, function (i, guide) {
        $.each(elemGuides, function (i, elemGuide) {
            if (guide.type == elemGuide.type) {
                var prop = guide.type == "h" ? "top" : "left";
                var d = Math.abs(elemGuide[prop] - guide[prop]);
                if (d < chosenGuides[prop].dist) {
                    chosenGuides[prop].dist = d;
                    chosenGuides[prop].offset = elemGuide[prop] - pos[prop];
                    chosenGuides[prop].guide = guide;
                }
            }
        });
    });
    var tempGuideH = $("#guide-h");
    if (chosenGuides.top.dist <= MIN_DISTANCE) {
        var tempCenter = document.getElementsByClassName("ui-layout-center")[0];
        tempGuideH.css("top", chosenGuides.top.guide.top + (currentBoardTemp.offset().top - parseInt(tempCenter.style.top))).show();
        ui.position.top = chosenGuides.top.guide.top - chosenGuides.top.offset;
    }
    else {
        tempGuideH.hide();
        ui.position.top = pos.top;
    }
    var tempGuideV = $("#guide-v");
    if (chosenGuides.left.dist <= MIN_DISTANCE) {
        var tempWest = document.getElementsByClassName("ui-layout-resizer-west")[0];
        tempGuideV.css("left", chosenGuides.left.guide.left + (currentBoardTemp.offset().left - parseInt(tempWest.style.left) - parseInt(tempWest.style.width))).show();
        ui.position.left = chosenGuides.left.guide.left - chosenGuides.left.offset;
    }
    else {
        tempGuideV.hide();
        ui.position.left = pos.left;
    }
}

function stopCalcuteGuide(event, ui) {
    $("#guide-v, #guide-h").hide();

    var $current = $(event.target);
    if ($current.hasClass("ui-selected")) {
        var selectedElements = $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected");

        Globle.Transaction.Begin = !0;
        $.each(selectedElements, function (index, item) {
            var $item = $(item);
            item = Globle.AllModelCollection.get(parseInt($item.attr("id")));
            item.set({
                "pLeft": parseInt($item.css("left")),
                "pTop": parseInt($item.css("top"))
            }).save();
        });
        Globle.Transaction.GoDo('mix');

        //        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
        //        Globle.CurrentModel.save();
    }
    else {
        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
        Globle.CurrentModel.save();
    }



}
function computeGuidesForElement(elem, pos, w, h) {
    if (elem != null) {
        var $t = $(elem);
        pos = $t.offset();
        pos = { left: pos.left - $("#" + Globle.CurrentBoard.attributes.pid).offset().left, top: pos.top - $("#" + Globle.CurrentBoard.attributes.pid).offset().top };
        w = $t.outerWidth() - 1;
        h = $t.outerHeight() - 1;
    }

    return [
                            { type: "h", left: pos.left, top: pos.top },
                            { type: "h", left: pos.left, top: pos.top + h },
                                { type: "v", left: pos.left, top: pos.top },
                               { type: "v", left: pos.left + w, top: pos.top },
    //    // you can add _any_ other guides here as well (e.g. a guide 10 pixels to the left of an element)
                                { type: "h", left: pos.left, top: pos.top + h / 2 },
                                { type: "v", left: pos.left + w / 2, top: pos.top }
    ];
}

//包装一个div
function wrapDiv(divid) {
    this.DivID = divid;
    this.CurrentWrapDiv = null;
    this.CurrentWrapDivFunction = function () {
        this.CurrentWrapDiv = $('#' + this.DivID);
    }
    this.CurrentWrapDivFunction();
    this.Left = 0;
    this.LeftFunction = function () {
        this.Left = this.CurrentWrapDiv.offset().left;
    };
    this.LeftFunction();
    this.Top = 0;
    this.TopFunction = function () {
        this.Top = this.CurrentWrapDiv.offset().top;
    }
    this.TopFunction();
    this.Right = 0;
    this.RightFunction = function () {
        this.Right = this.Left + this.CurrentWrapDiv.width();
    };
    this.RightFunction();
    this.Bottom = 0;
    this.BottomFunction = function () {
        this.Bottom = this.Top + this.CurrentWrapDiv.height();
    };
    this.BottomFunction();

}
//定义一个静态方法
wrapDiv.prototype.CompareTo =
           function (firstDiv, otherdiv) {
               //如果重叠,返回true,否则返回false
               //左部分重叠
               var result = false;
               if ((otherdiv.Right >= firstDiv.Left) && (otherdiv.Right <= firstDiv.Right)) {
                   if (otherdiv.Top <= firstDiv.Bottom && otherdiv.Bottom >= firstDiv.Top)
                       return true;
                   else
                       result = false;
               } //上部分重叠
               if ((otherdiv.Bottom >= firstDiv.Top) && (otherdiv.Bottom <= firstDiv.Bottom)) {
                   if (otherdiv.Left <= firstDiv.Right && otherdiv.Right >= firstDiv.Left)
                       return true;
                   else
                       result = false;
               }
               //右部分重叠
               if ((otherdiv.Left >= firstDiv.Left) && (otherdiv.Left <= firstDiv.Right)) {
                   if (otherdiv.Top <= firstDiv.Bottom && otherdiv.Bottom >= firstDiv.Top)
                       return true;
                   else
                       result = false;
               }
               //下部分重叠
               if ((otherdiv.Top >= firstDiv.Top) && (otherdiv.Top <= firstDiv.Bottom)) {
                   if (otherdiv.Left <= firstDiv.Right && otherdiv.Right >= firstDiv.Left)
                       return true;
                   else
                       result = false;
               }
               return result;
           };

//设置指定的div的z-index
function SetZindex(divid, direction) {
    var divTemp = new wrapDiv(divid);
    //得到所有的可以控制的div
    //得到相关的所有div
    var divArray = new Array();
    var i = 0;
    $('.pcontent').each(function () {
        if (this.id != divid) {
            if (true) {

                var tempzindex = this.style.zIndex;
                if (tempzindex == '')
                    tempzindex = 0;
                divArray[i++] = { 'divid': this.id, 'zindex': tempzindex };
            }
        }
        else {
            var tempzindex = this.style.zIndex;
            if (tempzindex == '')
                tempzindex = 0;
            divArray[i++] = { 'divid': this.id, 'zindex': tempzindex };
        }
    });

    if (divArray.length == 0)
        return;
    BullingSort(divArray);
    switch (direction) {
        case 'movebackward':
            //下移一层
            $.each(divArray, function (index, value) {
                if (value.divid == divid) {
                    var tempDiv = divArray[index - 1];
                    divArray[index - 1] = divArray[index];
                    divArray[index] = tempDiv;
                    return false;
                }
            });
            break;
        case 'moveforward':
            //上移一层
            $.each(divArray, function (index, value) {
                if (value.divid == divid) {
                    var tempDiv = divArray[index];
                    divArray[index] = divArray[index + 1];
                    divArray[index + 1] = tempDiv;
                    return false;
                }
            });
            break;
        case 'moveback':
            //移至最后
            //把目标元素移到最前方
            var tempDiv = null;
            $.each(divArray, function (index, value) {
                if (value.divid == divid) {
                    tempDiv = divArray[index];
                    divArray[index] = null;
                    return false;
                }
            });
            divArray.unshift(tempDiv);
            break;
        case 'movefront':
            //移至最前
            var tempDiv = null;
            $.each(divArray, function (index, value) {
                if (value.divid == divid) {
                    tempDiv = divArray[index];
                    divArray[index] = null;
                    return false;
                }
            });
            divArray.push(tempDiv);
            break;
    }
    var i = 0;
    $.each(divArray, function (index, value) {
        if (divArray[index] != null)
            document.getElementById(value.divid).style.zIndex = i++;
    });
}

function BullingSort(arrayParam) {
    var i = 0, j = 0;
    for (i = 1; i < arrayParam.length; i++) {
        for (j = 0; j < arrayParam.length - i; j++) {
            if (parseInt(arrayParam[j].zindex) > parseInt(arrayParam[j + 1].zindex)) {
                var temp = arrayParam[j + 1];
                arrayParam[j + 1] = arrayParam[j];
                arrayParam[j] = temp;
            }
        }
    }
}

String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                }
                else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
}

String.prototype.cut = function (left, right) {
    if (this.length > right)
        return this.substring(left, right) + "...";
    return this;
}

//触发器参数设置里的checkbox控件事件
function ProcessTriggerParametersSet(checkbox) {
    //    console.log($(checkbox));

    if (checkbox.checked) {
        var tempLi = '<li sequenceid="0" id="' + $(checkbox).parent().find(":hidden").val() + '_triggerAction" class="active"><a href="#">' + $(checkbox).parent().text() + '<input type="hidden" value="' + $(checkbox).parent().find(":hidden").val() + '"/><span class="glyphicon glyphicon-list pull-right"></span></a> </li>';
        $("ul", "#settedAnimationPanelDiv").append(tempLi);
    }
    else {
        $("ul", "#settedAnimationPanelDiv").find("#" + $(checkbox).parent().find(":hidden").val() + "_triggerAction").remove();
    }
}


//初始化可排序的li
function InitSorted1(pidstr, stopCallBack) {
    try {
        $(".ui-sortable", pidstr).destroy();
    } catch (e) {
        $(".ui-sortable", pidstr).sortable({
            stop: function (event, ui) {
                stopCallBack && stopCallBack(event, ui);
            },
            delay: 300
        });
    }
}

//开始绘制贝塞尔曲线
function StartDrawBeizer() {
    //    debugger;

    var tempBoardContainer = $('<div id="animationContainer_' + Globle.CurrentBoard.get("pid") + '" class="animationContainer_board"></div>')
        .css({
            "width": Globle.BoardWidth + "px",
            "height": Globle.BoardHeight + "px",
            "position": "absolute",
            "z-index": "99999",
            //            "background-color": Globle.CurrentBoard.get("backgroundColor"),
            "border": "1px solid"
        })
        .append($(BoardModel.toStringForAnimation()).append(GetAllModelHTML(!0)[0]));
    ;

    //    var tempBoardContainer = $(BoardModel.toStringForAnimation()).attr({
    //        id: "animationContainer_" + Globle.CurrentBoard.get("pid"),
    //        "class": "animationContainer_board"
    //    });

    PopBoard(tempBoardContainer, { color: '#333' }, { opacity: 1 });

    if (Globle.CurrentAnimationModel.get("AnimationJSONData")) {
        if (!Globle.BeizerAnimation) {
            //说明是从服务端载入的上一次的贝塞尔曲线数据

        }
        else
            Globle.BeizerAnimation.remove();
        Globle.BeizerAnimation = new Galaxy.Controls.BezierAnimation('animationContainer_' + Globle.CurrentBoard.get("pid"), $.parseJSON(decodeURIComponent(Globle.CurrentAnimationModel.get("AnimationJSONData").replace(/\\/g, ''))));
    }
    else {

        //得到要设置曲线的对象
        //        var tempObj = $("#" + Globle.CurrentModel.get("pid") + "").find("img");
        //        if (tempObj.length == 0) {
        //            //说明是svg格式的箭头工具
        var tempDiv = $("#" + Globle.CurrentModel.get("pid") + "");
        //        var tempObj = $("<img src='../Animation/AnimationResource/images/kongbai.png'  />");
        //        tempObj.appendTo("<div style='width:" + tempDiv.css("width") + "; height:" + tempDiv.css("height") + ";top:" + tempDiv.css("top") + ";left:" + tempDiv.css("left") + "'></div>");
        //        }

        Globle.BeizerAnimation = new Galaxy.Controls.BezierAnimation('animationContainer_' + Globle.CurrentBoard.get("pid"), {
            imageUrl: '../Animation/AnimationResource/images/kongbai.png',
            imageWidth: 10,
            imageHeight: 10,
            imageTop: parseInt(tempDiv.css("top")) + parseInt(tempDiv.css("height")) / 2 - 5,
            imageLeft: parseInt(tempDiv.css("left")) + parseInt(tempDiv.css("width")) / 2 - 5
        });
    }
    Globle.BeizerAnimation.init();
    Globle.BeizerAnimation.commandMode = "R";

    //对附加的画板内的元素,处理视频元素和glstudio元素,以及catia元素.
    //将视频替换为图标,glstudio替换为图标.catia替换为图标
    BoardModel.FilterCurrentBoardAllElement($('#animationContainer_' + Globle.CurrentBoard.get("pid")));
    $("#" + Globle.CurrentModel.get("pid") + "_preview").show().css("opacity", "1");
}

//在画板旁边增加一个结束绘制的按钮和删除绘制节点的按钮
function ShowAssistDrawButton() {
    $("#stopDrawBeizer").length ? $("#stopDrawBeizer,#deleteDrawPoint").show() : $("#animationContainer_" + Globle.CurrentBoard.get("pid") + "").parent().append('<div id="divDrawButton"><button type="button" class="btn btn-info" id="stopDrawBeizer">' + GetTranslateUI('TEndDraw') + '</button><button type="button" class="btn btn-danger" id="deleteDrawPoint">' + GetTranslateUI('TDeleteNode') + '</button><button type="button" class="btn btn-success" id="CancelDrawPoint">' + GetTranslateUI('TCanceldraw') + '</button></div>');
}

//执行该function,会弹出一个画板的模态,参数为模态要填充的内容
function PopBoard(modalContent, css, overlayCSS) {
    var tempLeft = calculateClientWidth(Globle.BoardWidth);
    var cssTemp = $.extend({
        top: '10%',
        left: tempLeft + "px",
        width: Globle.BoardWidth + "px",
        cursor: "crosshair"
    }, css);

    var overlayCSSTemp = $.extend({
        backgroundColor: '#fff',
        opacity: 0.8,
        cursor: "wait"
    }, overlayCSS);

    $.blockUI({
        css: cssTemp,
        overlayCSS: overlayCSSTemp,
        message: modalContent
    });
}
//计算模态的边距
function calculateClientWidth(modalWidth) {
    var clientWidth;
    try {
        clientWidth = document.documentElement.clientWidth;
    }
    catch (e) {
        clientWidth = document.body.clientWidth;
    }

    clientWidth = (clientWidth - modalWidth) / 2;
    return clientWidth;
}
//如果上次选择过,那么返回true,反之,返回false
function JudgeIsCheckedChangeSectionElement(index, triggerID) {
    //判断逻辑:
    //1. 找到触发器,如果未找到触发器,返回false;
    //2. 通过触发器,找到对应的动作,如果未找到,返回false;
    //3. 找到动作,查找动作SlidSetElementTo属性/2,如果==index,那么返回true,否则返回false;
    triggerPid = parseInt(triggerID);
    try {
        var controlAnimationModelArray = Globle.TriggerModelCollection.get(triggerPid).get("ControlAnimationModelArray");
    } catch (e) {
        var controlAnimationModelArray = undefined;
    }

    if (controlAnimationModelArray) {
        controlAnimationModelArray = Globle.AnimationBaseModelCollection.where({ "pid": controlAnimationModelArray[0] + Globle.VariableSuffix })[0];
        if (!controlAnimationModelArray)
            return false;
        else {
            if (index == (parseInt(controlAnimationModelArray.get("SlidSetElementTo")) / 2))
                return true;
            else
                return false;
        }
    }
    else {
        return false;
    }
}
function ForChangeSectionRadio(ele) {
    //    alert($(ele).prop("checked"));
    if ($(ele).attr("clicked")) {
        $(ele)
        .prop("checked", false)
        .removeAttr("clicked");
    }
    else {
        $(ele)
        .attr("clicked", "1");
    }
}

///载入以前已经添加过的section  
//点击tree节点时,动态载入  
function LoadExistedSection() {
    $("#sectionTable").empty();
    var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");
    $.ajax({
        url: trueLocation,
        dataType: 'json',
        data: {
            'actionType': 'loadSection',
            'unitItemID': parseInt($.jstree.reference("#jstree_demo").get_selected()[0]),
            'loadAll': false,
            'rdm': Math.random()
        },
        success: function (result) {
            console.log(result);
            var trContent = '';
            switch (result.result) {
                case "error":
                    alert("字幕载入失败");
                    return;
                    break;
                default:
                    break;
            }
            //缓存当前页面的字幕数组,供其他功能使用
            Globle.CurrentSectoinArray = new Array();
            _.each(result, function (item) {
                var tempSectionModel = new SectionModel(item);
                Globle.CurrentSectoinArray.push(tempSectionModel);
                trContent = GenerateSectionTr(tempSectionModel);
                $("#sectionTable").append(trContent);
                InitUploadify(tempSectionModel.get("pid"));
            });
            //            $("#sectionTable").append(trContent);
        },
        error: function (p1, p2, p3) {
            alert(p2 + '\r' + "字幕载入失败,Network error, please refresh and try again");
        }
    });
}

//加载预览时下面的字幕    
function LoadExistedSectionForPreView() {
    var str = "";
    //    str = "<div id=\"SectionForPreViewDiv\" class=\"modal-content\" style=\"margin-top:20px;\"><div class=\"modal-header\" style=\"padding:10px 0px 10px 15px; \"><h5 class=\"modal-title\" id=\"myModalLabel\">字幕</h5> </div>";
    //    str = "<div id=\"SectionForPreViewDiv\" class=\"modal-body\" style=\"padding: 0px;\"><table style=\"width:100%;word-break:break-all;\">";


    str = "<div id=\"SectionForPreViewDiv\" class=\"modal-content\" style=\"margin-top:10px;border-radius:0px;\">";

    //    str = "<div id=\"SectionForPreViewDiv\">";

    var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");

    $.ajax({
        url: trueLocation,
        dataType: 'json',
        async: false,
        data: {
            'actionType': 'loadSection',
            'unitItemID': parseInt($.jstree.reference("#jstree_demo").get_selected()[0]),
            'rdm': Math.random()
        },
        success: function (result) {
            //            console.log(result);
            //            var trContent = '';
            //            switch (result.result) {
            //                case "error":
            //                    alert("字幕载入失败");
            //                    return;
            //                    break;
            //                default:

            //            }
            //            _.each(result, function (item) {
            //                str+="<tr><td>" + item.sectionText+"</td></tr>";
            //            });
            if (result != "") {
                for (var i = 0; i < 1; i++) {
                    str += "<div class=\"modal-body\" style=\"padding: 10px 0px 10px 10px;\">" + decodeURIComponent(result[i].sectionText) + "</div>"
                    //                str += "<tr><td style=\"border-bottom:1px gray solid;height:30px;\">" + decodeURIComponent(result[i].sectionText) + "</td></tr>";
                }
            }

            //            str += "</table></div></div>"

            //            $("#sectionTable").append(trContent);
        }
        //        ,error: function (p1, p2, p3) {
        //            alert(p2 + '\r' + "字幕载入失败,Network error, please refresh and try again");
        //        }
    });
    return str;
}

function GenerateSectionTr(returnValue) {
    return _.template($("#SectionTemplate").html())(returnValue.toJSON());
}

//仅保存字幕
//新建和更新
function SaveSection(SectionModelObj, successCallBack, errorCallBack) {
    var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");
    //生成section
    $.ajax({
        type: "post",
        url: trueLocation,
        data: {
            actionType: "SaveSection",
            sectionText: SectionModelObj.get("sectionText"),
            unitItemID: SectionModelObj.get("unitItemID"),
            sectionID: SectionModelObj.get("sectionID"),
            advanceSection: SectionModelObj.get("advanceSection"),
            cbtUnitID: Globle.CbtUnitID,
            puppetSectionID: SectionModelObj.get("puppetSectionID"),
            delaySecond: SectionModelObj.get("delaySecond"),
            PreSectionID: SectionModelObj.get("PreSectionID")
        },
        success: function (data) {
            var tempControl = SectionModelObj.get("htmlControl");
            var hiddenControl = tempControl.parent().parent().find(".hiddenValue");
            switch (data.result) {
                case "ok":
                    hiddenControl.attr({
                        "sectionID": data.unitsectionid
                    });
                    SectionModelObj.set({
                        "sectionID": data.unitsectionid,
                        silent: !0
                    });

                    //如果hiddenControl中puppetSectionID为空,那么说明是新建
                    if (hiddenControl.attr("puppetSectionID") == '') {
                        hiddenControl.attr({
                            "puppetSectionID": data.puppetSectionID
                        });
                        SectionModelObj.set({
                            "puppetSectionID": data.puppetSectionID,
                            silent: !0
                        });
                    }

                    //生成成功之后,要更新缓存字幕的集合
                    var tempCurrentSection = _.find(Globle.CurrentSectoinArray, function (itemp) { return itemp.get("sectionID") == data.unitsectionid; });

                    tempCurrentSection && (tempCurrentSection.set({
                        "sectionText": SectionModelObj.get("sectionText"),
                        silent: !0
                    }));

                    successCallBack && successCallBack();
                    break;
                case "error":
                    alert(data.message);
                    location.href = location.href;
                    errorCallBack && errorCallBack();
                    break;
            }
        },
        error: function (error) {
            alert(data.message);
            location.href = location.href;
            errorCallBack && errorCallBack();
        }
    });
}

function playAudio(sectionID, isRecordEnable) {
    //载入录音的html页面,将当前的sectionID,CbtUnitID传递给该录音页面
    //动态加入iframe到当前dom树中,如果已经存在,则重新赋值.
    //为了覆盖控件，需要在弹出框之下 附件一个iframe，使用iframe遮住ocx，然后，使用div遮盖这个iframe
    //        console.log(this);

    $("#CommonModal").on('show.bs.modal', function (e) {
        console.log(this);

        $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);
        $("#H2Tile").text(GetTranslateUI('Tlisten'));
        //        if (isRecordEnable == false) {
        //            $(".modal-dialog", this).width(505);
        //        } else {
        $(".modal-dialog", this).width(505);
        //        }
        var trueLocation = '';

        $(".modal-body", this).height((function () {
            if (isRecordEnable == "false") {
                trueLocation = "PlayerAudio.htm";
                return 65;
            }
            else {
                //说明是录制
                trueLocation = GenerateRequestURL("../../../../lcms/Files/TestAudioUploadPlayer.html");
                return 200;
            }
        })()).empty().append('<iframe src="" frameborder="0" scrolling="auto" width="100%" height="100%" style="margin-top: 0px;"name="iframeAudioContent" id="iframeAudioContent"></iframe>').find("iframe").attr("src", trueLocation + "?cbtUnitID=" + Globle.CbtUnitID + "&sectionID=" + sectionID + "&isRecordEnable=" + isRecordEnable);

    }).on('hide.bs.modal', function (e) {
        //        alert("hide.bs.modal");
        $("#CommonModal").unbind("hide").unbind("show");
        $("#iframeModalHelper").css("z-index", "-11111").hide();
        $(".modal-body", this).empty();
    }).modal();

};

function CloseModal(modalID) {
    $(modalID).modal('hide');
}

//生成声音
function GenerateAudio(eve, successCallBack, errorCallBack) {
    var tempElement = eve;
    //注销原因: 可以为空
    //    if ($.trim(tempElement.val()) == '') {
    //        return false;
    //    }
    if ($.trim(tempElement.val()).length >= 1000) {
        alert('Too long');
        errorCallBack && errorCallBack();
        return false;
    }

    var tempHiddenElement = tempElement.parent().parent().find(".hiddenValue");

    var SectionModelObj = new SectionModel({
        sectionText: tempElement.val(),
        audioModel: true,
        htmlControl: tempElement,
        unitItemID: parseInt($.jstree.reference("#jstree_demo").get_selected()[0]),
        sectionID: tempHiddenElement.attr("sectionID")
    });


    var trueLocation = GenerateRequestURL("../../../../lcms/Files/TTSHandler.ashx");

    //生成mp3声音
    $.ajax({
        type: "post",
        url: trueLocation,
        data: {
            actionType: "generateAudio",
            cbtUnitID: Globle.CbtUnitID,
            sectionText: encodeURI(SectionModelObj.get("sectionText")),
            unitItemID: SectionModelObj.get("unitItemID"),
            sectionID: SectionModelObj.get("sectionID")
        },
        error: function (xhr, message, error) {
            alert("error");
            errorCallBack && errorCallBack();
        }
    });

    //检测是否生成成功
    var whileCheck = function (i) {
        if (i >= 20) {
            alert("生成音频失败,请检查是否文本内容过长");
            errorCallBack && errorCallBack();
            return;
        }

        //        console.log(SectionModelObj.get("cbtUnitID"), SectionModelObj.get("fileName"));
        //        console.log(Date.now());

        var trueLocation = GenerateRequestURL("../../../../lcms/Files/TTSHandler.ashx");

        $.ajax({
            type: "post",
            url: trueLocation,
            data: {
                actionType: "checkAudioIsExists",
                cbtUnitID: SectionModelObj.get("cbtUnitID"),
                sectionID: SectionModelObj.get("sectionID")
            },
            success: function (data) {
                switch (data.result) {
                    case "ok":
                        switch (data.isExist) {
                            case "true": //说明生成成功
                                //                                console.log(decodeURI(data.filePath));
                                SectionModelObj.set({
                                    mp3Url: data.filePath,
                                    silent: !0
                                });
                                successCallBack && successCallBack(SectionModelObj);
                                break;
                            case "false": //继续查询
                                setTimeout(function () {
                                    whileCheck(++i)
                                }, 4000);
                                break;
                        }
                        break;

                    case "error":
                        //服务器错误,继续请求
                        setTimeout(function () {
                            whileCheck(++i)
                        }, 4000);
                        break;
                }
            },
            error: function (xht, error, e) {
                alert("生成音频失败,点击确定重新载入当前页面");
                errorCallBack && errorCallBack();
            }
        });
    };
    setTimeout(function () {
        whileCheck(0)
    }, 8000);

};

//初始化上传控件
function InitUploadify(id) {
    var tempID = "#" + id;
    var sectionTr = $(tempID).parents(".sectionOutDiv");
    var hiddenElement = sectionTr.find(".hiddenValue");

    var trueLocation = GenerateRequestURL("../../../lcms/Files/UploadAudio.aspx");
    var trueLocation1 = GenerateRequestURL("../../../lcms/js/jqueryUploadify3.2/uploadify.swf");
    $(tempID).uploadify({
        overrideEvents: ['onUploadError', 'onSelectError', 'onDialogClose', 'onUploadProgress'],
        method: 'post',
        uploader: trueLocation,
        swf: trueLocation1,
        fileTypeDesc: '选择文件',
        fileTypeExts: '*.mp3',
        fileSizeLimit: '10MB',
        buttonText: GetTranslateUI('Tupload'),
        buttonClass: '',
        queueSizeLimit: 1,
        multi: false,
        width: '54',
        height: '34',
        onUploadProgress: function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
            var percent = Math.round((bytesUploaded / bytesTotal) * 100);
            $('.blockMsg').text('processed' + ' (' + percent + ')%');
        },
        onUploadStart: function (file) {
            if (hiddenElement.attr("sectionID") == "") {
                $(tempID).uploadify('stop');
                $(tempID).uploadify('cancel');
                $(tempID).uploadify('cancel', '*');
                return;
            }
            $(tempID).uploadify('settings', 'formData', { 'sectionID': hiddenElement.attr("sectionID"), 'cbtUnitID': Globle.CbtUnitID, "audioModel": "3" });
            sectionTr.block({
                message: "<img src='../Animation/AnimationResource/images/48x48Loading.png' />",
                overlayCSS: {
                    opacity: 0.8,
                    backgroundColor: "#E6E3E3"
                },
                css: {
                    top: "5%"
                }
            });
        },
        onDialogOpen: function () {

        },
        onUploadSuccess: function (file, data, response) {
            data = jQuery.parseJSON(data);
            switch (data.result) {
                case "ok":
                    hiddenElement.attr({
                        "audioModel": "3"
                    });

                    //上传成功之后,要更新缓存字幕的集合
                    var tempCurrentSection = _.find(Globle.CurrentSectoinArray, function (itemp) { return itemp.get("sectionID") == data.sectionID; });

                    tempCurrentSection && (tempCurrentSection.set({
                        "mp3Url": data.FileUrl,
                        silent: !0
                    }));


                    break;
                case "error":
                    alert("上传文件出现问题:" + data.message);
                    location.href = location.href;
                    break;
            };
            sectionTr.find("label").removeClass("active");
            sectionTr.find("[type='uploadAudio']").addClass("active");
        },
        onUploadComplete: function (file) {
            sectionTr.unblock();
        },
        onUploadError: function (file, errorCode, errorMsg, errorString) {
            if (errorString != "Cancelled" && (errorString != "Stopped"))
                alert(errorString);
        },
        onDialogClose: function (queueData) {

            if (hiddenElement.attr("sectionID") == "") {
                $(tempID).uploadify('stop');
                $(tempID).uploadify('cancel');
                $(tempID).uploadify('cancel', '*');
                alert("请首先保存字幕");
                return false;
            }
        },
        onSelectError: function (file, errorCode, errorMsg, errorString) {
            var tempMsg = "";
            switch (errorCode) {
                case -100:
                    tempMsg = 'The number of files that have been uploaded exceeds the system limit of {0}!';
                    tempMsg = tempMsg.format($(tempID).uploadify('settings', 'queueSizeLimit'));
                    break;
                case -110:
                    tempMsg = 'File [{0}] size exceeds the system limit of {1} size!';
                    tempMsg = tempMsg.format(file.name, $(tempID).uploadify('settings', 'fileSizeLimit'));
                    break;
                case -120:
                    tempMsg = 'File [{0}] size exception!';
                    tempMsg = tempMsg.format(file.name);
                    break;
            }
            alert(tempMsg);
            return false;
        },
        onFallback: function () {
            alert('没有安装Flash插件,请首先安装该插件');
            location.href = location.href;
        }
    });

    $(tempID).css({
        "height": "34px",
        "width": "54px",
        "position": "relative"
    });
    $(tempID + "-button").css({
        "background": "none",
        "border": "0px",
        "border-radius": "0px",
        "top": "-40px",
        "position": "relative"
    })
    .prev().css({
        "position": "relative"
    });
    $(tempID + "-queue").remove();
}


//1表示文本， 2 表示单选图片， 3 表示多选图片， 4 表示视频， 5表示音频， 6 表示Glstudio， 7 表示Catia， 8 表示SVG， 9 表示Flash
function openSelectResource(type) {

    PopBoard((type >= 1000) ? "请选择层" : "请选择资源文件", { cursor: "wait" });
    var url;
    var winName = 'Select Resource';
    var width = screen.availWidth / 6 * 5.6;
    var height = screen.availHeight / 5 * 4.6;

    if (type.toString() == "1000") {
        url = "SelectLayer.htm?cbtUnitID=" + Globle.CbtUnitID;
        width = 150;
        height = 400;
    } else {
        url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm) + "&Type=" + type.toString();
    }
    //    switch (type.toString()) {
    //        case '1':
    //            url = url + "&Type=1";
    //            break;
    //        case '2':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=2&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '3':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=3&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '4':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=4&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '5':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=5&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '6':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=6&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '7':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=7&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '8':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=8&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '9':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=9&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '10':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=10&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '11':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=11&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case '12':
    //            url = "../../Files/SelectResourceForPageEdit.aspx?IsAnimation=1&Type=12&Parm=" + encodeURIComponent(Globle.OpenWindowParm == null ? "none" : Globle.OpenWindowParm);
    //            break;
    //        case "1000": //选择层插入
    //            url = "SelectLayer.htm?cbtUnitID=" + Globle.CbtUnitID;
    //            width = 150;
    //            height = 400;
    //            break;
    //    }

    var tempOpen = window.open(url, winName, "fullscreen=1,toolbar=0,location=0,directories=0,status=0,menubar=0,resizable=1,width=" + width + ",height=" + height + ",scrollbars=1,top=" + (screen.height - height) / 2 + ',left=' + (screen.width - width) / 2);
    tempOpen.focus();
}

function AddModelToCollection(tm) {
    if (Globle.LastError.hasError()) {
        //说明有错误
        Globle.LastError.ShowError();
    }
    else {
        if (tm.get("pType") == "ManuallyResource") {
            Globle.ManaullyModelCollection.add(tm);
        }
        else {
            Globle.MemoCollectionManager.AddMemo(ElementBaseModel.CreateMemo(tm, "Create"));
            Globle.CurrentModel = tm;

            Globle.AllModelCollection.add(tm);
        }
    }
}

function InsertLayerToPage(layerID) {

    var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");


    $.getJSON(trueLocation
            , {
                actionType: "InsertLayerToPage", UnitItemPageContentID: layerID,
                UnitItemID: $.jstree.reference("#jstree_demo").get_selected()[0],
                CBTUnitID: Globle.CbtUnitID,
                CurrentBoardID: Globle.CurrentBoard.id
            }
            , function (data, status, xhr) {
                switch (data.result) {
                    case "error":
                        alert("插入出现错误,将自动刷新当前页面,\n" + data.message);
                        location.reload();
                        break;

                    case "ok":
                        var tempBoardModelObj = data.children[0];
                        var BoardModelObj = new BoardModel(JSON.parse(decodeURIComponent(tempBoardModelObj.PageContent)));
                        BoardModelObj.set({
                            pid: tempBoardModelObj.key + Globle.VariableSuffix,
                            pParentElementID: tempBoardModelObj.BelongToBoardID + Globle.VariableSuffix,
                            BelongToElementID: tempBoardModelObj.BelongToElementID,
                            IsSuppotZIndex: true
                        });
                        BoardModelObj.ContentChildrenModel = data.children.slice(1),
                        BoardModelObj.id = tempBoardModelObj.key;

                        AddModelToCollection(BoardModelObj);
                        break;

                    default:
                        alert("非法操作,将自动刷新当前页面");
                        location.reload();
                        break;
                }
            });
}



function CopyLayerToPage(layerID) {

    var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");


    $.getJSON(trueLocation
            , {
                actionType: "CopyLayerToPage", UnitItemPageContentID: layerID,
                UnitItemID: $.jstree.reference("#jstree_demo").get_selected()[0],
                CBTUnitID: Globle.CbtUnitID, CurrentUserID: getQueryString('CurrUser'),
                CurrentBoardID: Globle.CurrentBoard.id
            }
            , function (data, status, xhr) {
                switch (data.result) {
                    case "error":
                        alert("粘贴出现错误,将自动刷新当前页面,\n" + data.message);
                        location.reload();
                        break;

                    case "ok":

                        var tempBoardModelObj = data.children[0];
                        var BoardModelObj = new BoardModel(JSON.parse(decodeURIComponent(tempBoardModelObj.PageContent)));
                        BoardModelObj.set({
                            pid: tempBoardModelObj.key + Globle.VariableSuffix,
                            pParentElementID: tempBoardModelObj.BelongToBoardID + Globle.VariableSuffix,
                            BelongToElementID: tempBoardModelObj.BelongToElementID,
                            IsSuppotZIndex: true
                        });
                        BoardModelObj.ContentChildrenModel = data.children.slice(1),
                        BoardModelObj.id = tempBoardModelObj.key;

                        AddModelToCollection(BoardModelObj);
                        break;

                    default:
                        alert("非法操作,将自动刷新当前页面");
                        location.reload();
                        break;
                }
            });
}

function OntxtElementRotatekeyUp(valueRotate) {
    Globle.CurrentModel.set("pRotate", valueRotate);
    Globle.CurrentModel.save();
}

//存储用户选择本地素材时的节点、名称、页数、扩展名
function GetBroswerParm(parm) {
    Globle.OpenWindowParm = parm;
}



function CallBack(fileArray, isCopy) {
    $.unblockUI();
    if (fileArray.length == 0) {
        //        alert("没有选择任何素材");
        return;
    }

    console.log(fileArray);
    //------------------------------------------------------
    //2.6功能 当选中多个素材时，用素材的文件名排序
    if (fileArray.length > 1) {
        fileArray = fileArray.sort(function (a, b) {
            if (a.fileName < b.fileName) {
                return -1
            }; if (a.fileName > b.fileName) {
                return 1
            };
        });
    }
    //------------------------------------------------------



    //    return;
    //    var t1 = '';
    //    $.each(fileArray, function (index, item) {
    //        t1 += "{fileID : " + item.fileID + "\nfilePath : " + item.filePath + "\nresourceType : " + item.resourceType + "\nThumbnailPath : " + item.ThumbnailPath + "\nfileName : " + item.fileName + "\nversion:" + item.version + "}\n";
    //    });
    //    console.log(t1);

    //得到选中的图片 
    //            var selectFileList = _.map($(":checked", ".resultpanel"), function (item) { return item.attributes["fileurl"].value });
    //            if (selectFileList.length == 0)
    //                return false;

    //    var selectFileList =
    //                [
    //                {
    //                    fileID: 23,
    //                    filePath: "http://localhost:8081/lcms/images/ResourceImg/Img/A380_GoAround_97.png",
    //                    resourceType: 1,
    //                    fileName: "测试图片123",
    //                    ThumbnailPath: "http://localhost:8081/lcms/images/ResourceImg/Img/A380_GoAround_97.png",
    //                    version: "1.1"
    //    left top  mouse  width height 
    //                },
    //                {
    //                    fileID: 3,
    //                    filePath: "http://localhost:8081/lcms/images/ResourceImg/Img/A380_GoAround_73.png",
    //                    resourceType: 2,
    //                    fileName: "测试图片321",
    //                    ThumbnailPath: "http://localhost:8081/lcms/images/ResourceImg/Img/A380_GoAround_73.png",
    //                    version: "1.1"
    //                }
    //                ];

    var selectFileList = fileArray;

    switch (Globle.ClickType) {
        case "Layer":
            //将layer当做一个普通的model加入到Globle.AllModelCollection中
            //将layer包含的model在layer范围内初始化一下
            if (isCopy) {
                CopyLayerToPage(selectFileList[0].value);
            } else {
                var tempObj = JSON.parse(decodeURIComponent(selectFileList[0].value));

                InsertLayerToPage(tempObj[0].key);
            }
            break;
        
        case "localResource":

            if (Globle.IsUpdateModel) {
                Globle.CurrentModel.set({
                    pFileID: selectFileList[0].fileID,
                    pFileUrl: selectFileList[0].filePath,
                    pFileName: selectFileList[0].fileName,
                    pResourceType: selectFileList[0].resourceType,
                    pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",

                    pVersoin: selectFileList[0].version
                }).save();

                Globle.IsUpdateModel = !1;

                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError();
                }
            }
            else {
                var WebFormModelObj = new WebFormModel();
                if (isCopy) {
                    WebFormModelObj.set({
                        pFileID: selectFileList[0].fileID,
                        pFileUrl: selectFileList[0].filePath,
                        pFileName: selectFileList[0].fileName,
                        pThumbImageUrl: selectFileList[0].ThumbnailPath,
                        pResourceType: selectFileList[0].resourceType,
                        pParentElementID: Globle.CurrentBoard.get("pid"),
                        SequenceID: GetCurrentElementsBigZIndex() + 1,
                        pMaterialUsageID: selectFileList[0].fileID,
                        pVersoin: selectFileList[0].version,
                        pFocus: !0,
                        pWidth: selectFileList[0].width,
                        pHeight: selectFileList[0].height,
                        "pTextContentUrl": selectFileList[0].pTextContentUrl,
                        "pTextContentEmbed": selectFileList[0].pTextContentEmbed,
                        "pContentType": selectFileList[0].pContentType,
                        pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : ""
                    }).save();
                }
                else {
                    WebFormModelObj.set({

                        pFileID: selectFileList[0].fileID,
                        pFileUrl: selectFileList[0].filePath,
                        pFileName: selectFileList[0].fileName,
                        pThumbImageUrl: selectFileList[0].ThumbnailPath,
                        pResourceType: selectFileList[0].resourceType,
                        pParentElementID: Globle.CurrentBoard.get("pid"),
                        SequenceID: GetCurrentElementsBigZIndex() + 1,
                        pMaterialUsageID: selectFileList[0].fileID,
                        pVersoin: selectFileList[0].version,
                        pFocus: !0,
                        pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "" ,
                        pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
                    }).save();
                }
                AddModelToCollection(WebFormModelObj);
            }

            break;

        case "Board":
            if (Globle.IsUpdateModel) {
                //如果是第一次替换图片,相当于是插入图片
                if (Globle.CurrentBoard.get("pMaterialUsageID") == '')
                    Globle.CurrentBoard.set({
                        ImageInsert: !0,
                        silent: !0
                    });
                else
                    Globle.CurrentBoard.set({
                        ImageInsert: !1,
                        silent: !0
                    });
                //                    ImageInsert: !0, //标记当前的操作是插入操作,在该元素保存完毕后,需要将该属性重置为false;
                Globle.CurrentBoard.set({
                    CurrentImageIndex: 0,
                    pFileID: selectFileList[0].fileID,
                    pFileUrl: encodeURI(selectFileList[0].filePath),
                    //                    pMaterialUsageID: selectFileList[0].fileID,
                    pName: selectFileList[0].fileName,
                    pThumbImageUrl: encodeURI(selectFileList[0].ThumbnailPath),
                    pResourceType: selectFileList[0].resourceType,
                    pVersoin: selectFileList[0].version,
                    pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",

                    pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
                });

                Globle.CurrentBoard.save();
                Globle.IsUpdateModel = !1;
                Globle.CurrentBoard.set({ ImageInsert: !1, silent: !0 });
                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError();
                }
            }
            break;

        case "Resource": //Image

            if (Globle.IsUpdateModel) {
                Globle.CurrentModel.set({
                    pFileID: selectFileList[0].fileID,
                    pFileUrl: selectFileList[0].filePath,
                    pName: selectFileList[0].fileName,
                    pThumbImageUrl: selectFileList[0].ThumbnailPath,
                    pResourceType: selectFileList[0].resourceType,
                    pVersoin: selectFileList[0].version,
                    pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                    pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
                }).save();

                Globle.IsUpdateModel = !1;

                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError();
                }
            }
            else {
                //new 一个用户操作的image model
                //将该model加入到image集合中

                for (var i = 0; i < selectFileList.length; i++) {

                    (function (selectFile) {

                        console.log("第" + i + "个素材");

                        var ImageModelObj = new ImageModel(Globle.CustomTemplate);
                        Globle.CustomTemplate = {};

                        var imgSrc = selectFile.filePath;
                        var oWidth;
                        var oHeight;
                        var imgResource = selectFile;

                        imgLoad(
                          imgSrc,
                          function (width, height) {
                              oWidth = parseInt(width);
                              oHeight = parseInt(height);
                              ImageModelObj.set({
                                  pFileID: imgResource.fileID,
                                  pFileUrl: imgResource.filePath,
                                  pName: imgResource.fileName,
                                  pThumbImageUrl: imgResource.ThumbnailPath,
                                  pResourceType: imgResource.resourceType,
                                  pParentElementID: Globle.CurrentBoard.get("pid"),
                                  SequenceID: GetCurrentElementsBigZIndex() + 1,
                                  //                    pMaterialUsageID: selectFileList[0].fileID,
                                  pVersoin: imgResource.version,
                                  pFocus: !0,
                                  pWidth: isCopy == true ? imgResource.width : oWidth,
                                  pHeight: isCopy == true ? imgResource.height : oHeight,
                                  pExtendFileID: imgResource.resourceType == 2 ? imgResource.pExtendFileID : "",
                                  pFileResourceFromLocation: imgResource.pFileResourceFromLocation
                              }).save();
                              AddModelToCollection(ImageModelObj);
                          },
                          this)
                    })(selectFileList[i]);
                }
            }
            break;

        case "Slid": //幻灯片
            if (Globle.IsUpdateModel) {
                var tempImageArray = Globle.CurrentModel.get("ImageArray");

                if (tempImageArray[Globle.CurrentModel.get("CurrentImageIndex")]) {
                    //说明是更新一张现有的图片
                    tempImageArray[Globle.CurrentModel.get("CurrentImageIndex")]
                    .set({
                        pFileID: selectFileList[0].fileID,
                        pFileUrl: selectFileList[0].filePath,
                        pName: selectFileList[0].fileName,
                        pThumbImageUrl: selectFileList[0].ThumbnailPath,
                        pResourceType: selectFileList[0].resourceType,
                        pVersoin: selectFileList[0].version,
                       pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",

                        pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
                    });
                }
                else {
                    //表明是新插入图片
                    //处理逻辑:
                    //1.

                    var imageNumber = selectFileList.length;

                    for (var i = 0; i < imageNumber; i++) {
                        var tempImageModel = new ImageModel({
                            pFileID: selectFileList[i].fileID,
                            pFileUrl: selectFileList[i].filePath,
                            pName: selectFileList[i].fileName,
                            pThumbImageUrl: selectFileList[i].ThumbImageUrl,
                            pResourceType: selectFileList[i].resourceType,
                            //                        pMaterialUsageID: selectFileList[i].fileID,
                            pParentElementID: Globle.CurrentBoard.get("pid"),
                            pVersoin: selectFileList[i].version,
                            pFileResourceFromLocation: selectFileList[i].pFileResourceFromLocation,
                           pExtendFileID: selectFileList[i].resourceType == 2 ? selectFileList[i].pExtendFileID : "",

                            silent: !0
                        });
                        tempImageArray.push(tempImageModel);
                    }

                    //                    var tempImageModel = new ImageModel({
                    //                        pFileID: selectFileList[0].fileID,
                    //                        pFileUrl: selectFileList[0].filePath,
                    //                        pName: selectFileList[0].fileName,
                    //                        //                        pMaterialUsageID: selectFileList[0].fileID,
                    //                        pThumbImageUrl: selectFileList[0].ThumbnailPath,
                    //                        pResourceType: selectFileList[0].resourceType,
                    //                        pVersoin: selectFileList[0].version

                    //                    });
                    //                    tempImageArray.push(tempImageModel);

                    Globle.CurrentModel.set({
                        "ImageInsert": !0, //标记当前的操作是插入操作,在该元素保存完毕后,需要将该属性重置为false;
                        "ImageArray": tempImageArray,
                        pParentElementID: Globle.CurrentBoard.get("pid"),
                        silent: !0
                    });
                }

                Globle.CurrentModel.save();
                Globle.IsUpdateModel = !1;

                Globle.CurrentModel.set({
                    "pFocus": !Globle.CurrentModel.get("pFocus"),
                    "ImageInsert": !1, //标记当前的操作是插入操作,在该元素保存完毕后,需要将该属性重置为false;
                    "pUpdateAttributeView": !Globle.CurrentModel.get("pUpdateAttributeView"), //该值改变,通知更新属性区域
                    "pUpdateSetPanelAttributeView": !Globle.CurrentModel.get("pUpdateSetPanelAttributeView"), //该值改变,通知设置区域,比如设置自动播放
                    "pUpdateInitView": !Globle.CurrentModel.get("pUpdateInitView"), //该值改变,通知初始设置区域更新
                    "pUpdateAnimationAttributePanel": !Globle.CurrentModel.get("pUpdateAnimationAttributePanel")//该值改变, 通知"动作设置区域"更新
                });

                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError();
                }
            }
            else {
                //new 一个用户操作的image model
                //将该model加入到image集合中
                var ImageSlideModelObj = new ImageSlideModel();

                var tempImageArray = ImageSlideModelObj.get("ImageArray");
                tempImageArray = new Array();
                var imageNumber = selectFileList.length;

                for (var i = 0; i < imageNumber; i++) {
                    var tempImageModel = new ImageModel({
                        pFileID: selectFileList[i].fileID,
                        pFileUrl: selectFileList[i].filePath,
                        pName: selectFileList[i].fileName,
                        pThumbImageUrl: selectFileList[i].ThumbImageUrl,
                        pResourceType: selectFileList[i].resourceType,
                        //                        pMaterialUsageID: selectFileList[i].fileID,
                        pParentElementID: Globle.CurrentBoard.get("pid"),
                        pVersoin: selectFileList[i].version,
                        //task5688注释功能代码  pExtendFileID: selectFileList[i].resourceType == 2 ? selectFileList[i].pExtendFileID : "",

                        silent: !0,
                        pWidth: isCopy == true ? selectFileList[i].width : 300,
                        pHeight: isCopy == true ? selectFileList[i].height : 200,
                        pFileResourceFromLocation: selectFileList[i].pFileResourceFromLocation
                    });
                    tempImageArray.push(tempImageModel);
                }

                ImageSlideModelObj.set({
                    "ImageArray": tempImageArray,
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    SequenceID: GetCurrentElementsBigZIndex() + 1,
                    pWidth: isCopy == true ? selectFileList[0].width : 300,
                    pHeight: isCopy == true ? selectFileList[0].height : 200,
                    silent: !0
                }).save();

                AddModelToCollection(ImageSlideModelObj);
            }
            break;

        case "Button": //按钮
            if (Globle.IsUpdateModel) {
                var tempImageArray = Globle.CurrentModel.get("ImageArray");

                if (tempImageArray[Globle.CurrentModel.get("CurrentImageIndex")]) {
                    tempImageArray[Globle.CurrentModel.get("CurrentImageIndex")]
                    .set({
                        pFileID: selectFileList[0].fileID,
                        pFileUrl: selectFileList[0].filePath,
                        pName: selectFileList[0].fileName,
                        pThumbImageUrl: selectFileList[0].ThumbnailPath,
                        pResourceType: selectFileList[0].resourceType,
                        pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                        pVersoin: selectFileList[0].version,
                        pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
                    });
                }
                else {
                    //说明没有第二个image

                    var tempImageModel = new ImageModel({
                        pFileID: selectFileList[0].fileID,
                        pFileUrl: selectFileList[0].filePath,
                        pName: selectFileList[0].fileName,
                        //                        pMaterialUsageID: selectFileList[0].fileID,
                        pThumbImageUrl: selectFileList[0].ThumbnailPath,
                        pResourceType: selectFileList[0].resourceType,
                        pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                        pVersoin: selectFileList[0].version,
                        pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation

                    });
                    tempImageArray.push(tempImageModel);

                    Globle.CurrentModel.set({
                        "ImageInsert": !0, //标记当前的操作是插入操作,在该元素保存完毕后,需要将该属性重置为false;
                        "ImageArray": tempImageArray,
                        pParentElementID: Globle.CurrentBoard.get("pid"),
                        silent: !0
                    });
                }

                Globle.CurrentModel.set({
                    "pFocus": !Globle.CurrentModel.get("pFocus"),
                    "pUpdateAttributeView": !Globle.CurrentModel.get("pUpdateAttributeView"),
                    "pUpdateInitView": !Globle.CurrentModel.get("pUpdateInitView"),
                    "pUpdateAnimationAttributePanel": !Globle.CurrentModel.get("pUpdateAnimationAttributePanel"),
                    "pUpdateTriggerView": !Globle.CurrentModel.get("pUpdateTriggerView")
                });

                Globle.CurrentModel.save();

                Globle.IsUpdateModel = !1;
                Globle.CurrentModel.set({
                    "ImageInsert": !1,
                    silent: !0
                });
                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError();
                }
            }
            else {
                //new 一个用户操作的image model
                //将该model加入到image集合中
                var ButtonModelObj = new ButtonModel();

                var tempImageArray = ButtonModelObj.get("ImageArray");
                tempImageArray = new Array();
                var imageNumber = selectFileList.length;

                for (var i = 0; i < imageNumber; i++) {
                    var tempImageModel = new ImageModel({
                        pFileID: selectFileList[i].fileID,
                        pFileUrl: selectFileList[i].filePath,
                        pName: selectFileList[i].fileName,
                        pThumbImageUrl: selectFileList[i].ThumbImageUrl,
                        pResourceType: selectFileList[i].resourceType,
                        pExtendFileID: selectFileList[i].resourceType == 2 ? selectFileList[i].pExtendFileID : "",
                        //                        pMaterialUsageID: selectFileList[i].fileID,
                        pParentElementID: Globle.CurrentBoard.get("pid"),
                        pVersoin: selectFileList[i].version,
                        silent: !0,
                        pWidth: isCopy == true ? selectFileList[i].width : 100,
                        pHeight: isCopy == true ? selectFileList[i].height : 30,
                     pFileResourceFromLocation: selectFileList[i].pFileResourceFromLocation
                    });
                    tempImageArray.push(tempImageModel);
                }

                ButtonModelObj.set({
                    "ImageArray": tempImageArray,
                    SequenceID: GetCurrentElementsBigZIndex() + 1,
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    silent: !0
                }).save();

                AddModelToCollection(ButtonModelObj);
            }
            break;

        case "Rotate":
            if (Globle.IsUpdateModel) {

                Globle.CurrentModel.get("ImageArray")[Globle.CurrentModel.get("CurrentImageIndex")].set({
                    pFileID: selectFileList[0].fileID,
                    pFileUrl: selectFileList[0].filePath,
                    pName: selectFileList[0].fileName,
                    pThumbImageUrl: selectFileList[0].ThumbnailPath,
                    pResourceType: selectFileList[0].resourceType,
                    pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                    pVersoin: selectFileList[0].version,
                    pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation

                });
                Globle.CurrentModel.set({
                    "pFocus": !Globle.CurrentModel.get("pFocus"),
                    "pUpdateAttributeView": !Globle.CurrentModel.get("pUpdateAttributeView")
                });

                Globle.CurrentModel.save();
                Globle.IsUpdateModel = !1;
                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError();
                }
            }
            else {
                //new 一个用户操作的image model
                //将该model加入到image集合中
                var ImageRotateObj = new ImageRotateModel();

                var tempImageArray = ImageRotateObj.get("ImageArray");
                tempImageArray = new Array();
                var imageNumber = selectFileList.length;

                for (var i = 0; i < imageNumber; i++) {
                    var tempImageModel = new ImageModel({
                        pFileID: selectFileList[i].fileID,
                        pFileUrl: selectFileList[i].filePath,
                        pName: selectFileList[i].fileName,
                        pThumbImageUrl: selectFileList[i].ThumbImageUrl,
                        pResourceType: selectFileList[i].resourceType,
                        //                        pMaterialUsageID: selectFileList[i].fileID,
                        pVersoin: selectFileList[i].version,
                        pExtendFileID: selectFileList[i].resourceType == 2 ? selectFileList[i].pExtendFileID : "",
                        silent: !0,
                        pWidth: isCopy == true ? selectFileList[i].width : 300,
                        pHeight: isCopy == true ? selectFileList[i].height : 200,
                        pFileResourceFromLocation: selectFileList[i].pFileResourceFromLocation
                    });
                    tempImageArray.push(tempImageModel);
                }

                ImageRotateObj.set({
                    "ImageArray": tempImageArray,
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    SequenceID: GetCurrentElementsBigZIndex() + 1,
                    pWidth: isCopy == true ? selectFileList[0].width : 300,
                    pHeight: isCopy == true ? selectFileList[0].height : 200,
                    silent: !0
                }).save();

                AddModelToCollection(ImageRotateObj);
            }
            break;

        case "Sequence":
            if (Globle.IsUpdateModel) {
                Globle.CurrentModel.set({
                    "ImageModel": Globle.CurrentModel.get("ImageModel").set({
                        pFileID: selectFileList[0].fileID,
                        pFileUrl: encodeURI(selectFileList[0].filePath),
                        pName: selectFileList[0].fileName,
                        pThumbImageUrl: selectFileList[0].ThumbnailPath,
                        pResourceType: selectFileList[0].resourceType,
                        pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                        pVersoin: selectFileList[0].version,
                        pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation

                    })
                });
                Globle.CurrentModel.save();
                Globle.IsUpdateModel = !1;
                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError();
                }
                else {
                    new SequenceSetPanelView({ model: Globle.CurrentModel }).ShowModal();

                    //更新本属性窗体中的img和位置信息
                    $("#imageID").attr("src", Globle.CurrentModel.get("ImageModel").get("pFileUrl"));


                     Globle.CurrentModel.set({
                        "ImageSequenceAttributeView": !Globle.CurrentModel.get("ImageSequenceAttributeView")
                    });

                }
            }
            else {
                //new 一个用户操作的序列帧 model
                //将该model加入到全局集合中
                var ImageSequenceModelObj = new ImageSequenceModel();

                var tempImageModel = new ImageModel({
                    pFileID: selectFileList[0].fileID,
                    pFileUrl: encodeURI(selectFileList[0].filePath),
                    pName: selectFileList[0].fileName,
                    pThumbImageUrl: selectFileList[0].ThumbnailPath,
                    pResourceType: selectFileList[0].resourceType,
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    //                    pMaterialUsageID: selectFileList[0].fileID,
                    pVersoin: selectFileList[0].version,
                    pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                    silent: !0,
                    pWidth: isCopy == true ? selectFileList[0].width : 100,
                    pHeight: isCopy == true ? selectFileList[0].height : 100,
                    pFrame: isCopy == true ? selectFileList[0].pFrame : 0,
                   pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
                });


                ImageSequenceModelObj.set({
                    "ImageModel": tempImageModel,
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    SequenceID: GetCurrentElementsBigZIndex() + 1,
                    pWidth: isCopy == true ? selectFileList[0].width : 100,
                    pHeight: isCopy == true ? selectFileList[0].height : 100,
                    silent: !0
                });

                Globle.CurrentModel = ImageSequenceModelObj;

                //            Globle.AllModelCollection.add(ImageSequenceModelObj);//这里不添加,等待用户填写完帧数后,点击保存时再加入
                if (!isCopy) {
                    //弹出模态,让用户输入图片的帧数
                    new SequenceSetPanelView({ model: ImageSequenceModelObj }).ShowModal();
                } else {
                    ImageSequenceModelObj.save();
                    AddModelToCollection(ImageSequenceModelObj);
                }
            }
            break;

        case "Audio":
            //new 一个用户操作的audio model
            //将该model加入到集合中
            for (var i = 0; i < selectFileList.length; i++) {
                var AudioModelObj = new AudioModel();

                AudioModelObj.set({
                    pFileID: selectFileList[i].fileID,
                    pFileUrl: selectFileList[i].filePath,
                    pName: selectFileList[i].fileName,
                    pThumbImageUrl: selectFileList[i].ThumbnailPath,
                    pResourceType: selectFileList[i].resourceType,
                    pVersoin: selectFileList[i].version,
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    pExtendFileID: selectFileList[i].resourceType == 2 ? selectFileList[i].pExtendFileID : "",
                    pFocus: !0,
                    pWidth: isCopy == true ? selectFileList[i].width : 200,
                    pHeight: isCopy == true ? selectFileList[i].height : 30,
                    pFileResourceFromLocation: selectFileList[i].pFileResourceFromLocation
                }).save();

                AddModelToCollection(AudioModelObj);
            }



            break;

        case "Video":
            //new 一个用户操作的Video model
            //将该model加入到集合中
            for (var i = 0; i < selectFileList.length; i++) {
                var VideoModelObj = new VideoModel();

                VideoModelObj.set({
                    pFileID: selectFileList[i].fileID,
                    pFileUrl: selectFileList[i].filePath,
                    pName: selectFileList[i].fileName,
                    pResourceType: selectFileList[i].resourceType,
                    pVersoin: selectFileList[i].version,
                    pThumbImageUrl: "/lcms/HTMLTemplate/Animation/AnimationResource/images/mp4.jpg",
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    SequenceID: GetCurrentElementsBigZIndex() + 1,
                    pExtendFileID: selectFileList[i].resourceType == 2 ? selectFileList[i].pExtendFileID : "",
                    pFocus: !0,
                    pWidth: isCopy == true ? selectFileList[i].width : 350,
                    pHeight: isCopy == true ? selectFileList[i].height : 250,
                    pFileResourceFromLocation: selectFileList[i].pFileResourceFromLocation
                }).save();

                AddModelToCollection(VideoModelObj);
            }

            break;

        case "GlStudio":
            //new 一个用户操作的GlStudio model
            //将该model加入到集合中


            new CommonPopupModalView({
                model: new CommonMessageModal({
                    title: "GLStudio宽高设置",
                    isShowSaveButton: !1,
                    isShowCancelButton: !0,
                    isShowOkButton: !0,
                    ContentTemplateID: "#InitGLStudioTemplate",
                    data: { "event": event, "model": this.model },
                    okEventProcess: function () {
                        //                    alert("ok");
                        var reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;

                        if (!reg.test($("#txtGLHeight").val())) {
                            alert("输入格式错误，请输入正整数！");
                        }
                        else if (!reg.test($("#txtGLWidth").val())) {
                            alert("输入格式错误，请输入正整数！");
                        }
                        else {
                            var StudioModelObj = new GlStudioModel();

                            StudioModelObj.set({
                                pFileID: selectFileList[0].fileID,
                                pFileUrl: selectFileList[0].filePath,
                                pName: selectFileList[0].fileName,
                                pThumbImageUrl: selectFileList[0].ThumbnailPath,
                                pResourceType: selectFileList[0].resourceType,
                                pVersoin: selectFileList[0].version,
                                pParentElementID: Globle.CurrentBoard.get("pid"),
                                pFocus: !0,
                               pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",

                                pWidth: isCopy == true ? selectFileList[0].width : $("#txtGLWidth").val(),
                                pHeight: isCopy == true ? selectFileList[0].height : $("#txtGLHeight").val(),
                               pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
                            }).save();
                            AddModelToCollection(StudioModelObj);
                        }
                    }
                })
            }).showModal(null
                            , {
                                height: "165px",
                                width: "430px",
                                left: "40%"
                            });
            break;

        case "Catia":
            //new 一个用户操作的 Catia model
            //将该model加入到集合中
            var CatiaModelObj = new CatiaModel();

            CatiaModelObj.set({
                pFileID: selectFileList[0].fileID,
                pFileUrl: selectFileList[0].filePath,
                pName: selectFileList[0].fileName,
                pThumbImageUrl: selectFileList[0].ThumbnailPath,
                pResourceType: selectFileList[0].resourceType,
                pVersoin: selectFileList[0].version,
                pParentElementID: Globle.CurrentBoard.get("pid"),
                pFocus: !0,
                pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",

                pWidth: isCopy == true ? selectFileList[0].width : 400,
                pHeight: isCopy == true ? selectFileList[0].height : 400,
                pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
            }).save();
            AddModelToCollection(CatiaModelObj);

            break;

        case "Flash":
            //new 一个用户操作的 Catia model
            //将该model加入到集合中
            var FlashModelObj = new FlashModel();

            FlashModelObj.set({
                pFileID: selectFileList[0].fileID,
                pFileUrl: selectFileList[0].filePath,
                pName: selectFileList[0].fileName,
                pThumbImageUrl: selectFileList[0].ThumbnailPath,
                pResourceType: selectFileList[0].resourceType,
                pVersoin: selectFileList[0].version,
                pParentElementID: Globle.CurrentBoard.get("pid"),
                pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                pFocus: !0,
                SequenceID: GetCurrentElementsBigZIndex() + 1,
                pWidth: isCopy == true ? selectFileList[0].width : 400,
                pHeight: isCopy == true ? selectFileList[0].height : 300,
                pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
            }).save();
            AddModelToCollection(FlashModelObj);

            break;

        case "SVG":
            $.blockUI({
                message: "正在初始化该SVG...,请稍后." + $.blockUI.defaults.message
            });
            $.ajax({
                async: false,
                url: selectFileList[0].filePath,
                dataType: "html",
                context: this,
                success: function (data) {
                    //                            console.log(data);
                    //                            return false;
                    //                            data = data.replace();
                    //                            debugger;
                    //                            console.log("sdfeeeeeeeeeeeeee");
                    data = data.replace(/\r/ig, "").replace(/\n/ig, "").replace(/"/g, "\\\"");
                    //new 一个用户操作的 SVG model
                    //将该model加入到集合中
                    var SVGModelObj = new SVGModel();

                    SVGModelObj.set({
                        pFileID: selectFileList[0].fileID,
                        pFileContent: data,
                        pFileUrl: selectFileList[0].filePath, // window.location.origin + "/lcms/HTMLTemplate/Animation/AnimationResource/images/testReplace.jpg", /// <reference path="../images/animated-overlay.gif" />
                        pName: selectFileList[0].fileName,
                        pThumbImageUrl: selectFileList[0].ThumbnailPath, // window.location.origin + "/lcms/HTMLTemplate/Animation/AnimationResource/images/testReplace.jpg",
                        SequenceID: GetCurrentElementsBigZIndex() + 1,
                        pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                        pResourceType: selectFileList[0].resourceType,
                        pVersoin: selectFileList[0].version,
                       pParentElementID: Globle.CurrentBoard.get("pid"),
                        pFocus: !0,
                        pWidth: isCopy == true ? selectFileList[0].width : 300,
                        pHeight: isCopy == true ? selectFileList[0].height : 250,
                        pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
                    }).save();
                    AddModelToCollection(SVGModelObj);
                },
                error: function (error) {
                    alert("网络繁忙,请稍后再试\r" + error);
                    location.href = location.href;
                    return false;
                },
                beforeSend: function () {
                    //                    $.blockUI({
                    //                        message: "正在初始化该SVG...,请稍后." + $.blockUI.defaults.message
                    //                    });
                },
                complete: function () {
                    //                    $.unblockUI();
                }
            });
            $.unblockUI();
            break;

        case "MakeRelateFile": //对于glstudio元素, 设置对应的ipa文件
            if (selectFileList[0].resourceType == 1) {
                //如果是本地资源库,那么加上http开头的路径
                selectFileList[0].filePath = location.origin + "/lcms/" + selectFileList[0].filePath.substring(6);
            }
            Globle.CurrentModel.set({
                RelateIpaFullPath: selectFileList[0].filePath,
                silent: !0
            }).save();

            $("#" + Globle.CurrentModel.get("pid") + "_MakeRelateResourceFile").parents("#" + Globle.CurrentModel.get("pid") + "_ManualMakeRelateResourceFileTemplate").find(".RelateIpaFullPath").val(selectFileList[0].filePath);

            break;

        case "ManuallySelectResoure": //对于画板元素, 设置对应的手工关联文件
            if (selectFileList[0].resourceType == 1) {
                //如果是本地资源库，就是错的
                alert("参数错误");
                return;
            }
            //new 一个用户操作的 ManuallyModel 
            //将该model加入到ManuallyModel的集合中
            var ManuallyModelObj = new ManuallyModel();

            ManuallyModelObj.set({
                pFileID: selectFileList[0].fileID,
                pFileUrl: selectFileList[0].filePath,
                pName: selectFileList[0].fileName,
                pThumbImageUrl: selectFileList[0].ThumbnailPath,
                pResourceType: selectFileList[0].resourceType,
                pExtendFileID: selectFileList[0].resourceType == 2 ? selectFileList[0].pExtendFileID : "",
                pVersoin: selectFileList[0].version,
                pParentElementID: Globle.CurrentBoard.get("pid"),
                pFileResourceFromLocation: selectFileList[0].pFileResourceFromLocation
            }).save();

            AddModelToCollection(ManuallyModelObj);

            //需要通知画板单独更新一下该区域
            Globle.CurrentBoard.set({
                "pUpdateManuallyResourceView": !Globle.CurrentBoard.get("pUpdateManuallyResourceView")
            });

            break;

        default:
            alert("非法参数");
            break;
    }
}

function CloseBlockUI() {
    $.unblockUI();
}

//通过触发器ID得到当前触发器控制的动作的类型
function GetAnimationTypeByTriggerID(triggerID) {
    try {
        var triggerTemp = Globle.TriggerModelCollection.get(parseInt(triggerID));
        var animationTemp = triggerTemp.get("ControlAnimationModelArray");
        var type = Globle.AnimationBaseModelCollection.get(animationTemp[0]).get("actionType");
        return type;
    } catch (e) {
        return "";
    }
}

//改变自动动画的顺序
function ChangeAutoAnimationOrder(endAnimationPid, beginAnimationPid) {
    var autoAnimation = Globle.AnimationBaseModelCollection.where({
        "IsWaitTrigger": !1,
        "BelongToBoardID": Globle.CurrentBoard.get("pid"),
        "IsCanSort": true
    });
    var endSequenceID = Globle.AnimationBaseModelCollection.get(parseInt(endAnimationPid)).get("SequenceID"); //目标位置
    var beginSequenceID = Globle.AnimationBaseModelCollection.get(parseInt(beginAnimationPid)).get("SequenceID"); //开始位置

    //如果开始位置的动作序号大于结束位置的动作序号

    Globle.Transaction.Begin = !0;
    if (parseInt(beginSequenceID) > parseInt(endSequenceID)) {
        for (var i = 0; i < autoAnimation.length; i++) {
            var m = autoAnimation[i];
            if (parseInt(m.get("SequenceID")) >= parseInt(endSequenceID) && parseInt(m.get("SequenceID")) < parseInt(beginSequenceID)) {
                m.attributes["SequenceID"] = parseInt(m.get("SequenceID")) + 1 + "";
                m.save();
            }
            else if (parseInt(m.get("SequenceID")) == parseInt(beginSequenceID)) {
                m.attributes["SequenceID"] = parseInt(endSequenceID) + "";
                m.save();
            }
            else {
                continue;
            }
        }
    }
        //如果开始位置的动作序号小于结束位置的动作序号
    else if (parseInt(beginSequenceID) < parseInt(endSequenceID)) {
        for (var i = 0; i < autoAnimation.length; i++) {
            var m = autoAnimation[i];
            if (parseInt(m.get("SequenceID")) > parseInt(beginSequenceID) && parseInt(m.get("SequenceID")) <= parseInt(endSequenceID)) {
                m.attributes["SequenceID"] = parseInt(m.get("SequenceID")) - 1 + "";
                m.save();
            }
            else if (parseInt(m.get("SequenceID")) == parseInt(beginSequenceID)) {
                m.attributes["SequenceID"] = parseInt(endSequenceID) + "";
                m.save();
            }
            else {
                continue;
            }
        }
    }

    Globle.Transaction.GoDo('mix');

    SortCollection(Globle.AnimationBaseModelCollection);
    //ShowActionControl();
}

//改变触发器动画的顺序
function ChangeTriggerAnimationOrder(triggerID, endAnimationPid, beginAnimationPid) {
    var triggerTemp = Globle.TriggerModelCollection.get(parseInt(triggerID));
    if (!triggerTemp) {
        return;
    }
    //定义新的触发器动作执行的顺序
    var actionTempArraySorted = new Array();
    var actionTempArray = triggerTemp.get("ControlAnimationModelArray");

    var endIndex = actionTempArray.indexOf(parseInt(endAnimationPid) + "");
    var beginIndex = actionTempArray.indexOf(parseInt(beginAnimationPid) + "");

    //如果这两个动作都存在数组中，则继续


    if (endIndex > -1 && beginIndex > -1) {

        Globle.Transaction.Begin = !0;

        if (endIndex < beginIndex) {
            for (var i = 0; i < actionTempArray.length; i++) {
                if (i == endIndex) {
                    actionTempArraySorted.push(actionTempArray[beginIndex]);
                }
                else if (i > endIndex && i <= beginIndex) {
                    actionTempArraySorted.push(actionTempArray[i - 1]);
                }
                else {
                    actionTempArraySorted.push(actionTempArray[i]);
                }
            }
        }
        else if (endIndex > beginIndex) {
            for (var i = 0; i < actionTempArray.length; i++) {
                if (i == endIndex) {
                    actionTempArraySorted.push(actionTempArray[beginIndex]);
                }
                else if (i >= beginIndex && i < endIndex) {
                    actionTempArraySorted.push(actionTempArray[i + 1]);
                }
                else {
                    actionTempArraySorted.push(actionTempArray[i]);
                }
            }
        }
        triggerTemp.set({ "ControlAnimationModelArray": actionTempArraySorted });
        triggerTemp.save();

        Globle.Transaction.GoDo('mix');
    }
    else {
        return;
    }
}


//改变箭头大小时候的方法
function changeArrow(t, lw, color, sw, nh, hprev) {
    var divElement = t;
    var txt_arrow_w = lw;
    var txt_arrow_c = color;
    var txt_arrow_sw = Math.abs(sw);
    var currentContainer_height = nh;
    var hprevHeight = hprev;
    var stpe = Math.floor(currentContainer_height / 2) + "";

    var svge = divElement.find("path:first");
    var svge2 = divElement.find("path:last");
    var svgeAll = divElement.find("path");
    var dafaultLineStorke = 5;
    var dafaultMaxStorke = 1000;
    var lineAbsolutePosition;
    if (txt_arrow_w != "") {
        var d = svge.attr("d");
        var reg = /\s(L\s\d{1,})\s(\d{1,})/;
        var regMinD = /M\s(\d{1,})\s(\d{1,})/;
        var r = d.match(reg);
        if (r != null) {
            var line_M1 = parseInt(d.match(regMinD)[1]);
            if (txt_arrow_w > line_M1) {
                lineAbsolutePosition = txt_arrow_w;
            } else {
                lineAbsolutePosition = line_M1;
            }
            var line_L1 = d.replace(reg, " L " + lineAbsolutePosition + " " + stpe);
            var line_value = line_L1.replace(regMinD, "M " + nh + " " + stpe);
            svge.attr("d", line_value);
        }
    }
    if (txt_arrow_c != "") {
        svgeAll.css("stroke", txt_arrow_c);
        svgeAll.css("fill", txt_arrow_c);
    }
    if (txt_arrow_sw != "") {
        var regp2 = /(L\s\d{1,}\s\d{1,})/;
        var d1 = svge2.attr("d");
        var d2 = /(\d{1,})\s(\d+)/;
        var line_m1 = /M\s(\d{1,})\s(\d{1,})/;
        var arrayDPath = new Array(); //M 4 53 L 20 47 L 20 53 L 20 59 L 4 53 Z  //M 4 8 L 20 2 L 20 8 L 20 14 L 4 8 Z
        arrayDPath = d1.split(regp2);
        var newDValue, pathLval1, pathLval2, pathL, path1sw;
        newDValue = d1;
        if (arrayDPath.length == 9) {
            path1sw = svge.css("stroke-width").replace("px", "");
            if ((txt_arrow_sw > 0 && txt_arrow_sw <= dafaultMaxStorke) && (path1sw > 0 && path1sw <= dafaultMaxStorke)) {
                if (txt_arrow_sw == 1) {
                    newDValue = "M " + parseInt(parseInt(arrayDPath[0].match(d2)[1]) + 2) + " " + arrayDPath[0].match(d2)[2] + " ";
                } else {
                    newDValue = arrayDPath[0].replace(line_m1, "M $1 " + stpe);
                }
                for (var i = 1; i < arrayDPath.length; i = i + 2) {
                    pathLval1 = arrayDPath[i].match(d2)[1];
                    pathLval2 = arrayDPath[i].match(d2)[2];
                    var sw_change = hprevHeight - nh;
                    if (i == 1) {
                        pathL = arrayDPath[i].replace(d2, parseInt(parseInt(pathLval1) - sw_change) + " " + "1");
                    } else if (i == 3) {
                        pathL = " " + arrayDPath[i].replace(d2, parseInt(parseInt(pathLval1) - sw_change) + " " + stpe);
                    }
                    else if (i == 5) {
                        pathL = " " + arrayDPath[i].replace(d2, parseInt(parseInt(pathLval1) - sw_change) + " " + parseInt(parseInt(currentContainer_height) - 1));

                    } else if (i == 7) {
                        pathL = " " + arrayDPath[i].replace(d2, "$1 " + stpe);
                    }
                    else {
                        pathL = " " + arrayDPath[i];
                    }
                    newDValue += pathL;
                }
                newDValue += arrayDPath[8];
                svge.css("stroke-width", txt_arrow_sw + "px");
                svge2.attr("d", newDValue);
            }
        }
    }
}