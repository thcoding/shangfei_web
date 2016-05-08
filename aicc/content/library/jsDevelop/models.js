
//model------开始

var CommonMessageModal = Backbone.Model.extend({
    defaults: {
        pid: _.uniqueId("ele"),
        title: "",
        message: "", //显示的内容
        isShowSaveButton: !1,
        isShowCancelButton: !1,
        isShowOkButton: !1,
        okEventProcess: "", //点击ok按钮执行的事件体
        cancelEventProcess: "", //点击cancel按钮执行的事件体
        ContentTemplateID: "", //存储内容模板的id,带#号,
        data: "", //传递到本model事件处理的参数,比如okEventProcess事件,
        RemoveAttributesToJSON: ["data"]//优化,该字段存储不需要持久化到服务端的一些字段
    }
});

//所有元素类型的超类
var ElementBaseModel = Backbone.Model.extend({
    //    url: ""
    toStringForStaticHtml: function () {
        return "";
    }
}
, {
    GetFileIDArray: function (model) {
        if (!model) return;
        //以_|*_*|_作为间隔符
        switch (model.get("IsSupportMultipleFile")) {
            case true:
                var temp = _.map(model.attributes.ImageArray, function (item) {
                    return item.attributes.pFileID;
                });
                return temp.join("_|*_*|_");
                break;

            case false:
                if (model.attributes.ImageModel)
                    return model.attributes.ImageModel.attributes.pFileID
                else
                    return model.attributes.pFileID;
                break;
        }
    },
    GetExtendFileIDArray: function (model) {
        if (!model) return;
        //以_|*_*|_作为间隔符
        switch (model.get("IsSupportMultipleFile")) {
            case true:
                var temp = _.map(model.attributes.ImageArray, function (item) {
                    return item.attributes.pExtendFileID;
                });
                return temp.join("_|*_*|_");
                break;

            case false:
                if (model.attributes.ImageModel)
                    return model.attributes.ImageModel.attributes.pExtendFileID
                else
                    return model.attributes.pExtendFileID;
                break;
        }
    },
    GetFileResourceTypeArray: function (model) {
        if (!model) return;
        //以_|*_*|_作为间隔符
        switch (model.get("IsSupportMultipleFile")) {
            case true:
                var temp = _.map(model.attributes.ImageArray, function (item) {
                    return item.attributes.pResourceType;
                });
                return temp.join("_|*_*|_");
                break;

            case false:
                if (model.attributes.ImageModel)
                    return model.attributes.ImageModel.attributes.pResourceType
                else
                    return model.attributes.pResourceType;
                break;
        }
    },
    GetFileUrlArray: function (model) {
        if (!model) return;
        //以_|*_*|_作为间隔符
        switch (model.get("IsSupportMultipleFile")) {
            case true:
                var temp = _.map(model.attributes.ImageArray, function (item) {
                    return item.attributes.pFileUrl;
                });
                return temp.join("_|*_*|_");
                break;

            case false:
                if (model.attributes.ImageModel)
                    return model.attributes.ImageModel.attributes.pFileUrl
                else
                    return model.attributes.pFileUrl;
                break;
        }
    },
    GetFileThumbnailUrlArray: function (model) {
        if (!model) return;
        //以_|*_*|_作为间隔符
        switch (model.get("IsSupportMultipleFile")) {
            case true:
                var temp = _.map(model.attributes.ImageArray, function (item) {
                    return item.attributes.pThumbImageUrl;
                });
                return temp.join("_|*_*|_");
                break;

            case false:
                if (model.attributes.ImageModel)
                    return model.attributes.ImageModel.attributes.pThumbImageUrl
                else
                    return model.attributes.pThumbImageUrl;
                break;
        }
    },
    GetFileNameArray: function (model) {
        if (!model) return;
        //以_|*_*|_作为间隔符
        switch (model.get("IsSupportMultipleFile")) {
            case true:
                var temp = _.map(model.attributes.ImageArray, function (item) {
                    return item.attributes.pName;
                });
                return temp.join("_|*_*|_");
                break;

            case false:
                if (model.attributes.ImageModel)
                    return model.attributes.ImageModel.attributes.pName
                else
                    return model.attributes.pName;
                break;
        }
    },
    GetFileVersionArray: function (model) {
        if (!model) return;
        //以_|*_*|_作为间隔符
        switch (model.get("IsSupportMultipleFile")) {
            case true:
                var temp = _.map(model.attributes.ImageArray, function (item) {
                    return item.attributes.pVersoin;
                });
                return temp.join("_|*_*|_");
                break;

            case false:
                if (model.attributes.ImageModel)
                    return model.attributes.ImageModel.attributes.pVersoin
                else
                    return model.attributes.pVersoin;
                break;
        }
    },
    GetMaterialUsageIDArray: function (model) {
        if (!model) return;
        //以_|*_*|_作为间隔符
        switch (model.get("IsSupportMultipleFile")) {
            case true:
                if (model.get("actionType") == 'GoToPage') {
                    return model.get("pMaterialUsageID").join("_|*_*|_");
                }

                var temp = _.map(model.attributes.ImageArray, function (item) {
                    return item.attributes.pMaterialUsageID;
                });
                return temp.join("_|*_*|_");

                break;

            case false:
                //首先尝试从imageMode属性中得到,如果得不到,再直接从model中获得
                if (model.attributes.ImageModel)
                    return model.attributes.ImageModel.attributes.pMaterialUsageID
                else
                    return model.attributes.pMaterialUsageID;
                break;
        }
    },
    UpdateIDArray: function (method, model, result) {
        model.set({
            pid: model.id + Globle.VariableSuffix,
            silent: !0
        });
        if (result.MaterialUsageIDArray == '' || result.ResourceIDArray == "")
            return;
        var resourceIDArray = result.ResourceIDArray.split("_|*_*|_");
        var materialUsageIDArray = result.MaterialUsageIDArray.split("_|*_*|_");

        switch (model.get("IsSupportMultipleFile")) {
            case true:
                if (method == 'create') {
                    _.each(model.attributes.ImageArray, function (item, index) {
                        item.attributes.pFileID = resourceIDArray[index];
                        item.attributes.pMaterialUsageID = materialUsageIDArray[index];
                    });

                    //对gotopage单独处理，因为gotopage与其他动作类型有个区别，那就是gotopage也有MaterialUsage字段，故create之后，要记得更新gotopage的这个字段值
                    if (model.get("actionType") == 'GoToPage') {
                        model.set({
                            silent: !0,
                            pMaterialUsageID: materialUsageIDArray
                        });
                    }
                }
                else if (method == 'update') {
                    //只更新CurrentImageIndex的fileid和MaterialUsageID
                    model.get("ImageArray")[model.get("CurrentImageIndex")].attributes.pFileID = resourceIDArray[0];
                    model.get("ImageArray")[model.get("CurrentImageIndex")].attributes.pMaterialUsageID = materialUsageIDArray[0];
                }
                break;

            case false:
                if (model.attributes.ImageModel) {
                    model.attributes.ImageModel.pFileID = resourceIDArray[0];
                    model.attributes.ImageModel.attributes.pMaterialUsageID = materialUsageIDArray[0];
                }
                else {
                    model.attributes.pFileID = resourceIDArray[0];
                    model.attributes.pMaterialUsageID = materialUsageIDArray[0];
                }
                break;
        }
    },
    CreateMemo: function (model, operateType) {
        return new MemoModel({
            operateType: operateType,
            modelContent: model,
            pLeft: model.attributes.pLeft,
            pTop: model.attributes.pTop,
            pWidth: model.attributes.pWidth,
            pHeight: model.attributes.pHeight,
            pRotate: model.attributes.pRotate,
            pTransparent: model.attributes.pTransparent,
            pArrowStrokeWidth: (function () {
                if (model.attributes.pType == "AdvanceArrow") {
                    return model.attributes.pArrowStrokeWidth;
                }
                else {
                    return "";
                }
            })(), //专为箭头使用
            pArrowSvgPath1: (function () {
                if (model.attributes.pType == "AdvanceArrow") {
                    return model.attributes.pArrowSvgPath1;
                }
                else {
                    return "";
                }
            })(), //专用于箭头第一个Path的d值
            pArrowSvgPath2: (function () {
                if (model.attributes.pType == "AdvanceArrow") {
                    return model.attributes.pArrowSvgPath2;
                }
                else {
                    return "";
                }
            })() //专用于箭头第二个Path的d值
        });
    },
    UnDoMemo: function (memoModel) {
        console.log("ElementBaseModel.UnDoMemo");
        switch (memoModel.attributes.operateType) {
            case "Create":
                //撤销该动作,即删除该model
                Globle.AllModelCollection.remove(memoModel.attributes.modelContent);

                break;

            case "Delete":
                //撤销该动作,即再次创建该model
                memoModel.attributes.modelContent.id = null;
                memoModel.attributes.modelContent.save();
                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError();
                }
                else {
                    Globle.CurrentModel = memoModel.attributes.modelContent;

                    Globle.AllModelCollection.add(memoModel.attributes.modelContent);
                }
                break;

            case "Move":
            case "Resize":
                //撤销该动作,即移动到上一个位置
                var targetMoveModel = Globle.AllModelCollection.get(memoModel.attributes.modelContent.id);

                if (!targetMoveModel) {
                    alert(GetTranslateUI('TAninternalerroroccurredwillrefreshthecurrentpage'));
                    location.href = location.href;
                    return false;
                }

                //设置当前操作的元素为激活元素
                $("#" + memoModel.attributes.modelContent.attributes.pid).mousedown();

                //                console.log(memoModel.attributes.modelContent.attributes.pLeft, memoModel.attributes.modelContent.attributes.pTop);

                if (targetMoveModel.attributes.pType == "AdvanceArrow") {
                    targetMoveModel.set({
                        "pLeft": memoModel.attributes.pLeft,
                        "pTop": memoModel.attributes.pTop,
                        "pWidth": memoModel.attributes.pWidth,
                        "pHeight": memoModel.attributes.pHeight,
                        "pRotate": memoModel.attributes.pRotate,
                        "pTransparent": memoModel.attributes.pTransparent,
                        "pArrowStrokeWidth": (function () {
                            return memoModel.attributes.pArrowStrokeWidth;
                        })(),
                        "pArrowSvgPath1": (function () {
                            return memoModel.attributes.pArrowSvgPath1;
                        })(),
                        "pArrowSvgPath2": (function () {
                            return memoModel.attributes.pArrowSvgPath2;
                        })(),
                        silent: true
                    }).save();
                }
                else {
                    targetMoveModel.set({
                        "pLeft": memoModel.attributes.pLeft,
                        "pTop": memoModel.attributes.pTop,
                        "pWidth": memoModel.attributes.pWidth,
                        "pHeight": memoModel.attributes.pHeight,
                        "pRotate": memoModel.attributes.pRotate,
                        "pTransparent": memoModel.attributes.pTransparent,
                        silent: true
                    }).save();
                }

                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError(GetTranslateUI('TWithdrawanerroroccurswillrefreshthecurrentpage') + "!");
                    location.reload();
                }
                else {
                    $("#" + targetMoveModel.attributes.pid).css({
                        left: memoModel.attributes.pLeft,
                        top: memoModel.attributes.pTop,
                        width: memoModel.attributes.pWidth,
                        height: memoModel.attributes.pHeight,
                        "-webkit-transform": "rotate(" + memoModel.attributes.pRotate + "deg)",
                        "-ms-transform": "rotate(" + memoModel.attributes.pRotate + "deg)",
                        "-moz-transform": "rotate(" + memoModel.attributes.pRotate + "deg)",
                        "-o-transform": "rotate(" + memoModel.attributes.pRotate + "deg)",
                        opacity: memoModel.attributes.pTransparent
                    });
                    if (targetMoveModel.attributes.pType == "Box") {
                        $("#" + targetMoveModel.attributes.pid + " svg").attr({
                            "width": memoModel.attributes.pWidth + "px",
                            "height": memoModel.attributes.pHeight + "px"
                        });
                        $("#" + targetMoveModel.attributes.pid + " svg rect").attr({
                            "width": memoModel.attributes.pWidth,
                            "height": memoModel.attributes.pHeight
                        });
                    }
                    if (targetMoveModel.attributes.pType == "AdvanceArrow") {
                        $("#" + targetMoveModel.attributes.pid + " svg path:eq(0)").css("stroke-width", memoModel.attributes.pArrowStrokeWidth + "");
                        $("#" + targetMoveModel.attributes.pid + " svg path:eq(0)").attr("d", memoModel.attributes.pArrowSvgPath1 + "");
                        $("#" + targetMoveModel.attributes.pid + " svg path:eq(1)").attr("d", memoModel.attributes.pArrowSvgPath2 + "");
                    }
                }
                break;

            default:
                alert(GetTranslateUI('TIllegalOperation') + "!");
                break;
        }
    },
    ReDoMemo: function (memoModel) {
        console.log("ElementBaseModel.ReDoMemo");
        switch (memoModel.attributes.operateType) {
            case "Create":
                //如果操作的元素时layer,那么需要单独处理一下
                if (memoModel.attributes.modelContent.get("pType") == "layer") {
                    InsertLayerToPage(memoModel.attributes.modelContent.get("BelongToElementID"));
                }
                else {
                    //重置该动作,即再次创建该model
                    memoModel.attributes.modelContent.id = null;
                    memoModel.attributes.modelContent.save();
                    //                memoModel.attributes.pid = memoModel.attributes.modelContent.id;
                    if (Globle.LastError.hasError()) {
                        //说明有错误
                        Globle.LastError.ShowError();
                    }
                    else {
                        Globle.CurrentModel = memoModel.attributes.modelContent;

                        Globle.AllModelCollection.add(memoModel.attributes.modelContent);
                    }
                }
                break;

            case "Delete":
                Globle.AllModelCollection.remove(memoModel.attributes.modelContent);
                break;

            case "Move":
            case "Resize":
                //重置该动作,即移到原始位置
                var targetMoveModel = Globle.AllModelCollection.get(memoModel.attributes.modelContent.id);

                if (!targetMoveModel) {
                    alert(GetTranslateUI('TAnerroroccurswillrefreshthecurrentpage'));
                    location.reload();
                    return false;
                }
                //                console.log(memoModel.attributes.modelContent.attributes.pLeft, memoModel.attributes.modelContent.attributes.pTop);


                if (targetMoveModel.attributes.pType == "AdvanceArrow") {
                    targetMoveModel.set({
                        "pLeft": memoModel.attributes.pLeft,
                        "pTop": memoModel.attributes.pTop,
                        "pWidth": memoModel.attributes.pWidth,
                        "pHeight": memoModel.attributes.pHeight,
                        "pRotate": memoModel.attributes.pRotate,
                        "pTransparent": memoModel.attributes.pTransparent,
                        "pArrowStrokeWidth": (function () {
                            return memoModel.attributes.pArrowStrokeWidth;
                        })(),
                        "pArrowSvgPath1": (function () {
                            return memoModel.attributes.pArrowSvgPath1;
                        })(),
                        "pArrowSvgPath2": (function () {
                            return memoModel.attributes.pArrowSvgPath2;
                        })(),
                        silent: true
                    }).save();
                } else {
                    targetMoveModel.set({
                        "pLeft": memoModel.attributes.pLeft,
                        "pTop": memoModel.attributes.pTop,
                        "pWidth": memoModel.attributes.pWidth,
                        "pHeight": memoModel.attributes.pHeight,
                        "pRotate": memoModel.attributes.pRotate,
                        "pTransparent": memoModel.attributes.pTransparent,
                        silent: true
                    }).save();
                }

                if (Globle.LastError.hasError()) {
                    //说明有错误
                    Globle.LastError.ShowError(GetTranslateUI('TRedoerrorswillrefreshthepage') + "!");
                    location.reload();
                }
                else {

                    $("#" + targetMoveModel.attributes.pid).css({
                        left: memoModel.attributes.pLeft,
                        top: memoModel.attributes.pTop,
                        width: memoModel.attributes.pWidth,
                        height: memoModel.attributes.pHeight,
                        "-webkit-transform": "rotate(" + memoModel.attributes.pRotate + "deg)",
                        "-ms-transform": "rotate(" + memoModel.attributes.pRotate + "deg)",
                        "-moz-transform": "rotate(" + memoModel.attributes.pRotate + "deg)",
                        "-o-transform": "rotate(" + memoModel.attributes.pRotate + "deg)",
                        opacity: memoModel.attributes.pTransparent
                    });
                    if (targetMoveModel.attributes.pType == "Box") {
                        $("#" + targetMoveModel.attributes.pid + " svg").attr({
                            "width": memoModel.attributes.pWidth + "px",
                            "height": memoModel.attributes.pHeight + "px"
                        });
                        $("#" + targetMoveModel.attributes.pid + " svg rect").attr({
                            "width": memoModel.attributes.pWidth,
                            "height": memoModel.attributes.pHeight
                        });
                    }
                    if (targetMoveModel.attributes.pType == "AdvanceArrow") {
                        $("#" + targetMoveModel.attributes.pid + " svg path:eq(0)").css("stroke-width", memoModel.attributes.pArrowStrokeWidth + "");
                        $("#" + targetMoveModel.attributes.pid + " svg path:eq(0)").attr("d", memoModel.attributes.pArrowSvgPath1 + "");
                        $("#" + targetMoveModel.attributes.pid + " svg path:eq(1)").attr("d", memoModel.attributes.pArrowSvgPath2 + "");
                    }
                }

                break;

            default:
                alert(GetTranslateUI('TIllegalOperation') + "!");
                location.reload();
                break;
        }
    },
    ResizableResize: function (event, ui) {
        Globle.CurrentModel.set({
            "pWidth": ui.size.width,
            'pHeight': ui.size.height,
            'pTop': ui.position.top,
            'pLeft': ui.position.left
        });
    }
});
//备忘录超类
var MemoBaseModel = Backbone.Model.extend({});

var MemoModel = MemoBaseModel.extend({
    defaults:
    {
        operateType: "", //记录当前的操作类型,一共4种:移动,删除,创建,大小
        modelContent: "", //存储model实体
        pLeft: 0,
        pTop: 0,
        pWidth: 0,
        pHeight: 0,
        pRotate: 0,
        pTransparent: 1,
        pArrowStrokeWidth: "17.5px", //专用于箭头第一个Path的宽度
        pArrowSvgPath1: "M 35 17 L 192 17", //专用于箭头第一个Path的d值
        pArrowSvgPath2: "M 4 17 L 40 1 L 40 17 L 40 34 L 4 17 Z" //专用于箭头第二个Path的d值
    }
});



var TriggerBaseModel = Backbone.Model.extend({});

var TriggerModel = TriggerBaseModel.extend({
    defaults: {
        pid: _.uniqueId("ele"),
        title: "", //显示在弹出框中的标题位置
        pType: "", //触发器的类型,比如:点击类型触发器clickTrigger,点击前触发器beforeClickTrigger,点击后触发器afterClickTrigger
        pName: GetTranslateUI('TClicktoTrigger'), //触发器的名字,用来显示在界面上
        BelongToElementID: "", //该触发器的宿主,该值记录宿主的pid
        BelongToBoardID: "", //冗余数据,但是操作方便,记录 宿主的宿主pid
        isShowSaveButton: !1,
        isShowCancelButton: !1,
        isShowOkButton: !1,
        BelongToLayerID: '',
        ContentTemplateID: "", //存储内容模板的id,带#号
        ControlAnimationModelArray: "", //记录该触发器要控制哪些动作model,是一个array对象,记录的是id,字符串格式
        //        data: "", //传递到本model事件处理的参数,比如okEventProcess事件,该字段注销原因: 不需要将该data传递到服务端,如果实际需要使用,可以动态加进去
        RemoveAttributesToJSON: ["data"] //优化,该字段存储不需要持久化到服务端的一些字段
    }
});

////每个页面都有一个全局变量设置,比如触发器的设置
//var GlobleSet = ElementBaseModel.extend({
//    defaults: {
//        pid: 0,
//        pType: "PageSet",
//        BelongToPageID: 0
//    },
//    initialize: function () {
//        //初始化id
//        this.set({
//            pid: _.uniqueId("PageSet"), 
//            silent: !0
//        });
//    }
//});
//GlStudio model
var GlStudioModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !1, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pElementName: GetTranslateUI('TGLStudioinformation'),
        pType: "GlStudio",
        pTop: 0,
        pLeft: 0,
        pWidth: 400,
        pHeight: 318,
        //资源固有属性定义 开始
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        pFileUrl: "",
        pName: "GlStudio",
        pVersion: "",
        pFileResourceFromLocation: "",//记录素材的位置,如果是本地素材库,那么显示:"所在文件夹/文件名"; 如果是统一资源库, 那么显示:"来自统一资源库",因为统一资源库没有返回相关数据; 注意: 修改资源时,注意更新该字段
        IsSupportMultipleSelect: !0, //标记是否支持多选
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        BelongToLayerID: '',
        isAnimationPanel: !0,
        RelateIpaFullPath: "", //存储对应的ipa文件的全路径
        IsCanEditWidthHeight: !1, //是否支持设置宽高,如果为true,显示时,是readonly
        //        IsCanEditTopLeft: !0, //是否支持设置纵向横向,如果为true,显示时,是readonly
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        pUpdateManualMakeRelateResourceFileTemplateAttributeView: !0////该值改变,通知关联资源区域更新
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return $(_.template('<div pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> id="<%=pid %>_preview" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;"></div>')(this.toJSON())).append(CreateGlsObject(this.get("pid"), "object_" + this.get("pid") + "_Preview", this.get("pFileUrl"), !0)).get(0).outerHTML;
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
, {
    FilterGenerateGlStudio: function ($html) {
        _.each($html.find("[ptype='GlStudio']"), function (item) {
            $(item).empty().append('<img style="width:100%;height:100%;" src="/lcms/images/file/32/GLStudio.png" />');
        });
    },
    GlStudioTemplate: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; padding:10px; border:1px solid;"></div>',
    GlStudioTemplateForLayer: '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; padding:10px; border:1px solid;"></div>',
    GlStudioTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; padding:10px; border:1px solid;"></div>'
});

//Arrow Model
var ArrowModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index
        pType: "Arrow",
        pElementName: GetTranslateUI('TArrowbasicinformation'),
        pArrowDirect: "", //标记箭头的方向,有:up,down,left,right
        pTop: 20,
        pLeft: 20,
        pWidth: 120,
        pHeight: 60,
        //资源固有属性定义 开始
        pFileID: "",
        pResourceType: "",
        pVersoin: "",
        pFileUrl: "",
        pName: GetTranslateUI('TArrowTools'),
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0, //无用
        pIsTriggerControl: !0, //标记该model是否支持作为触发器的触发条件
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        pUpdateTriggerView: !0, //该值改变，通知更新触发器区域
        pUpdateInitView: !0, //该值改变,通知更新初始化区域
        BelongToLayerID: '',
        pInitControlVisible: 1//保存页面初始状态:显示还是隐藏
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return _.template('<div pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> id="<%=pid %>_preview" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;  z-index:<%=SequenceID %>; <%if(pInitControlVisible=="2"){%> display:none; <%} %>"><%if(pFileUrl!=""&&pFileUrl!="#"){ %><img src="<%=pFileUrl %>" style="width:100%;height:100%;" /><%} %></div>')(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
, {
    ArrowTemplate: '<div class="pcontent" id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>; "><img style="width:100%;height:100%;" src="<%=pFileUrl %>" alt="<%=pName %>"></div> ',
    ArrowTemplateForLayer: '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;  z-index:<%=SequenceID %>;"><img style="width:100%;height:100%;" src="<%=pFileUrl %>" alt="<%=pName %>"></div> ',
    ArrowTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;  z-index:<%=SequenceID %>;"><img style="width:100%;height:100%;" src="<%=pFileUrl %>" alt="<%=pName %>"></div> '
}
);

//Catia Model
var CatiaModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        pType: "Catia",
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !1, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pElementName: GetTranslateUI('TCatiainformation'),
        RelateIpaFullPath: "", //按照jk设计的播放catia方式, 该字段存储第三方平台上针对特定文件的地址, 类似于:www.3dvia.com/models/DFD34599JIJIJL/Product1-3d-xml-file中的DFD34599JIJIJL
        pTop: 0,
        pLeft: 0,
        pWidth: 400,
        pHeight: 400,
        //资源固有属性定义 开始
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        BelongToLayerID: '',
        IsSupportMultipleSelect: !0, //标记是否支持多选
        pVersoin: "",
        pFileUrl: "",
        pName: "Catia",
        pFileResourceFromLocation: "",//记录素材的位置,如果是本地素材库,那么显示:"所在文件夹/文件名"; 如果是统一资源库, 那么显示:"来自统一资源库",因为统一资源库没有返回相关数据; 注意: 修改资源时,注意更新该字段
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        pUpdateManualMakeRelateResourceFileTemplateAttributeView: !0////该值改变,通知关联资源区域更新
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return _.template('<div pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> id="<%=pid %>_preview" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><object width="100%" height="100%" id="viewer_<%=pid %>" classid="clsid:5ABD296B-F8A0-436C-B2F7-B19170C43D28"><param name="DocumentFile" value="<%=pFileUrl %>"></object></div>')(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
},
{
    FilterGenerateCatia: function ($html) {
        _.each($html.find("[ptype='Catia']"), function (item) {
            $(item).empty().append('<img style="width:100%;height:100%;" src="/lcms/images/file/32/catia.png" />');
        });
    },
    DynamicFormate: function () {
        var tempObjStr = '';
        switch (Globle.BrowerType) {
            case "ie":
                tempObjStr = '<object width="100%" height="100%" id="viewer_catia_<%=pid %>" classid="clsid:5ABD296B-F8A0-436C-B2F7-B19170C43D28"><param name="DocumentFile" value="<%=pFileUrl %>"></object>';
                break;

            case "chrome":
                tempObjStr = '<object width="100%" height="100%" id="viewer_catia_<%=pid %>" clsid="{5ABD296B-F8A0-436C-B2F7-B19170C43D28}" type="application/x-itst-activex"><param name="DocumentFile" value="<%=pFileUrl %>"></object>';
                break;

            default:
                tempObjStr = '<object width="100%" height="100%" id="viewer_catia_<%=pid %>" classid="clsid:5ABD296B-F8A0-436C-B2F7-B19170C43D28"><param name="DocumentFile" value="<%=pFileUrl %>"></object>';
                break;
        }
        return tempObjStr;
    },
    CatiaTemplate: function () {
        return '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; padding:10px; border:1px solid;">' + CatiaModel.DynamicFormate() + '</div>';
    },
    CatiaTemplateForLayer: function () {
        return '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; padding:10px; border:1px solid;">' + CatiaModel.DynamicFormate() + '</div>';
    },
    CatiaTemplateForLayerPreview: function () {
        return '<div id="<%=pid %>"  <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> pType="<%=pType %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; padding:10px; border:1px solid;">' + CatiaModel.DynamicFormate() + '</div>'
    }
});

//Flash Model
var FlashModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        pType: "Flash",
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pTop: 0,
        pLeft: 0,
        pWidth: 400,
        pHeight: 300,
        //资源固有属性定义 开始
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        pVersoin: "",
        pFileUrl: "",
        pName: "",
        BelongToLayerID: '',
        pFileResourceFromLocation: "",//记录素材的位置,如果是本地素材库,那么显示:"所在文件夹/文件名"; 如果是统一资源库, 那么显示:"来自统一资源库",因为统一资源库没有返回相关数据; 注意: 修改资源时,注意更新该字段
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //资源固有属性定义 结束
        IsSupportMultipleSelect: !0, //标记是否支持多选
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pUpdateAttributeView: !0//该值改变,通知更新属性区域
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return _.template('<div pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> id="<%=pid %>_preview" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="100%" height="100%" id="Untitled-1_<%=pid %>"><param name="allowScriptAccess" value="sameDomain" /><param name="movie" value="mymovie.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed src="<%=pFileUrl%>" quality="high"bgcolor="#ffffff" width="100%" height="100%" name="mymovie" align="middle" allowscriptaccess="sameDomain"type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object></div>')(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
},
{
    FlashTemplate: '<div class="pcontent"  pType="<%=pType %>" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>; "><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="100%" height="100%" id="Untitled-1"><param name="allowScriptAccess" value="sameDomain" /><param name="movie" value="mymovie.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed play="false" src="<%=pFileUrl%>" quality="high"bgcolor="#ffffff" width="100%" height="100%" name="<%=pid %>_embed" id="<%=pid %>_embed" align="middle" allowscriptaccess="sameDomain"type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object></div>',

    FlashTemplateForLayer: '<div id="<%=pid %>"  pType="<%=pType %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>; "><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="100%" height="100%" id="Untitled-1"><param name="allowScriptAccess" value="sameDomain" /><param name="movie" value="mymovie.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed src="<%=pFileUrl%>" quality="high"bgcolor="#ffffff" width="100%" height="100%" name="mymovie" align="middle" allowscriptaccess="sameDomain"type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object></div>',

    FlashTemplateForLayerPreview: '<div id="<%=pid %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> pType="<%=pType %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>; "><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="100%" height="100%" id="Untitled-1"><param name="allowScriptAccess" value="sameDomain" /><param name="movie" value="mymovie.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><embed src="<%=pFileUrl%>" quality="high"bgcolor="#ffffff" width="100%" height="100%" name="mymovie" align="middle" allowscriptaccess="sameDomain"type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object></div>'
});

var SectionModel = Backbone.Model.extend({
    defaults: {
        pid: "",
        sectionID: "",
        sectionText: "",
        ResourceTypeID: "",
        unitItemID: "",
        //        更新时用到的字段----开始
        advanceSection: "",
        puppetSectionID: "", //每个section都有一个隐藏的section
        PreSectionID: "", //当前字幕的上一个字幕,如果是第一条字幕,该条为空
        delaySecond: 0, //如果是自动播放,那么可以设置延迟多长时间
        htmlControl: ""//缓存点击的哪个control,jquery对象
        //        更新时用到的字段----结束
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("uploadify"),
            silent: !0
        });
    }
});

//BugFlag model 
var BugFlagModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index
        pType: "BugFlag",
        pElementName: GetTranslateUI('TBuglabelBasicInformation'),
        pIsCourse: !1, //标记该model是否是课件的内容,保存到静态页面中
        pName: GetTranslateUI('TbugFlag'),
        pTop: 120,
        pLeft: 110,
        pWidth: 200,
        pHeight: 100,
        //        //资源固有属性定义 开始
        //        pFileID: "",
        //        pFileUrl: "",
        //        pName: "",
        //        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //        //资源固有属性定义 结束
        pSArrowDirectCSS: "", //箭头S的css
        pIArrowDirectCSS: "", //箭头I的css
        pBoxShadowCSS: "", //阴影的css
        pArrowDirect: "up", //标记箭头的方向,主要用于拖拽时动态更新箭头位置使用.
        pBugContent: GetTranslateUI('TDoubleclickonthedescriptionofthepreparationBug'), //bug的内容
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        BelongToLayerID: '',
        pUpdateInitView: !0, //标记是否更新初始显示配置的面板
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pUpdateAttributeView: !0//该值改变,通知更新属性区域
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return "";
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
});

//视频 model
var VideoModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pType: "Video",
        pElementName: GetTranslateUI('TThebasicpropertiesofthevideoelement'),
        pTop: 150,
        pLeft: 150,
        pWidth: 350,
        pHeight: 250,
        isShowControlBar: !0, //是否显示控制条
        isAutoPlay: !1, //是否自动播放
        isRepeatPlay: !1, //是否循环播放.
        isCompleteHide: !1, //播放完毕,是否隐藏
        //资源固有属性定义 开始
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        pVersoin: "",
        pFileUrl: "",
        pFileResourceFromLocation: "",//记录素材的位置,如果是本地素材库,那么显示:"所在文件夹/文件名"; 如果是统一资源库, 那么显示:"来自统一资源库",因为统一资源库没有返回相关数据; 注意: 修改资源时,注意更新该字段
        pName: GetTranslateUI('Tvideo'),
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        BelongToLayerID: '',
        IsSupportMultipleSelect: !0, //标记是否支持多选
        isAnimationPanel: !0,
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        pInitControlVisible: 1, //保存页面初始状态:显示还是隐藏
        pUpdateInitView: !0, //标记video的属性面板是否更新
        pAutoPlayNumber: 0   //自动播放视频时,重复播放次数，默认是0次
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return _.template('<div pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> id="<%=pid %>_preview" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>; <%if(pInitControlVisible=="2"){%> display:none; <%} %>"><div id="preview_player_<%=pid %>"></div></div>')(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
, {
    FilterGenerateVideo: function ($html) {//将传递进来的$对象中包含的video标签,替换为video图标
        _.each($html.find("[ptype='Video']"), function (item) {
            $(item).empty().css("backgroundColor", 'black').append('<img style="width:100%;height:100%;" src="/lcms/HTMLTemplate/Animation/AnimationResource/images/mp4.jpg" />');
        });
    },
    VideoTemplate: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><div id="player_<%=pid %>"></div></div>',
    VideoTemplateForLayer: '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><div id="preview_player_<%=pid %>"></div></div>',
    VideoTemplateForLayerPreview: '<div id="<%=pid %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> pType="<%=pType %>" style="<%if(pInitControlVisible=="2"){%> display:none; <%} %>width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><div id="preview_player_<%=pid %>"></div></div>',
    CreatePlayer: function (modelp, elementID, isPreview) {//第二个参数:控制是否点击播放的功能,因为预览时,播放功能才会启用
        isPreview = (isPreview || !1);

        var model = modelp;
        if (modelp instanceof VideoModel) {
            model = {
                isShowControlBar: modelp.get("isShowControlBar"),
                pFileUrl: modelp.get("pFileUrl"),
                isAutoPlay: modelp.get("isAutoPlay"),
                isRepeatPlay: modelp.get("isRepeatPlay"),
                isCompleteHide: modelp.get("isCompleteHide"),
                pThumbImageUrl: model.get("pThumbImageUrl")
            };
        }
        console.log(model.isShowControlBar);
        //        //    return false;
        jwplayer(elementID).setup({
            //                debugger
            file: model.pFileUrl, //"http://localhost:8888/lcms/images/ResourceImg/Img/Door_open_201433111732.mp4",
            image: isPreview ? "" : model.pThumbImageUrl, // "../../images/ResourceImg/Img/cemiantu.jpg",
            //            autostart: (isPreview ? model.isAutoPlay : !1),
            controls: (isPreview ? model.isShowControlBar : !1),
            repeat: model.isRepeatPlay,
            primary: "html5",
            width: "100%",
            height: "100%",
            customeContext: model
        })
        .onComplete(function (event) {
            //            console.log("call back oncomplete");
            console.log(this);

            if (this.config.customeContext.isCompleteHide) {
                this.remove();
                $("#" + event.id).parent().remove();
                //                console.log($("#" + elementID));
                //                console.log("call back oncomplete111");
            }
        })
        .onDisplayClick(function (event) {
            if (isPreview) {
                this.setControls(this.config.customeContext.isShowControlBar);
                this.play();
            }
        });
    }
});

////该model代表一个"统一资源库"或者"本地资源库"中的一个资源
////目前用在Glstudio和Catia的一个属性
//var StandardAloneResourceFileModel = Backbone.Model.extend({
//    defaults: {
//        
//        pFileID: "",
//        pMaterialUsageID: "",
//        pResourceType: "",
//        pVersoin: "",
//        pFileUrl: "",
//        pName: "",
//        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
//        //资源固有属性定义 结束
//        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
//        pFocus: !1,
//        isAnimationPanel: !0,
//        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
//        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
//        pUpdateAttributeView: !0//该值改变,通知更新属性区域
//    },
//    initialize: function () {
//        //初始化id
//        this.set({
//            pid: _.uniqueId("ele"),
//            silent: !0
//        });
//    }
//});

//mp3 model
var AudioModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !1, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pElementName: GetTranslateUI('TThebasicpropertiesoftheaudioelements'),
        pType: "Audio",
        pTop: 100,
        pLeft: 100,
        pWidth: 200,
        pHeight: 30,
        isShowControlBar: !0, //是否显示控制条
        isAutoPlay: !1, //是否自动播放
        isRepeatPlay: !1, //是否循环播放.
        isCompleteHide: !1, //播放完毕,是否隐藏
        //资源固有属性定义 开始
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        pVersoin: "",
        pFileUrl: "",
        pName: "",
        pFileResourceFromLocation: "",//记录素材的位置,如果是本地素材库,那么显示:"所在文件夹/文件名"; 如果是统一资源库, 那么显示:"来自统一资源库",因为统一资源库没有返回相关数据; 注意: 修改资源时,注意更新该字段
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        BelongToLayerID: '',
        pDelayPlaySecond: 0,    //当MP3自动播放的时候，延迟播放时间，默认是0秒
        pAutoPlayNumber: 0   //自动播放MP3时,重复播放次数，默认是0次
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        //        return _.template('<audio autoPlay="autoplay"><source src="<%=pFileUrl %>" type="audio/mpeg">Your browser does not support the audio element</audio>')(this.toJSON());
        return _.template('<div pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> id="<%=pid %>_preview" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>; "><div id="preview_player_<%=pid %>"></div></div>')(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
, {
    AudioModelTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=parseInt(pWidth)+14 %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><div id="preview_player_<%=pid %>"></div> </div>',
    AudioModelTemplateForLayerInit: '<div id="<%=pid %>" style="width:<%=parseInt(pWidth)+14 %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><div id="preview_player_<%=pid %>"></div> </div>',
    CreatePlayer: function (modelp, elementID, isPreview) {//第二个参数:是否是预览
        var model = modelp;
        if (modelp instanceof AudioModel) {
            model = {
                isShowControlBar: modelp.get("isShowControlBar"),
                pFileUrl: modelp.get("pFileUrl"),
                isAutoPlay: modelp.get("isAutoPlay"),
                isRepeatPlay: modelp.get("isRepeatPlay"),
                pWidth: modelp.get("pWidth"),
                pHeight: modelp.get("pHeight"),
                isCompleteHide: modelp.get("isCompleteHide")
            };
        }

        isPreview = (isPreview || !1);
        console.log(model.isShowControlBar);
        //        //    return false;
        jwplayer(elementID).setup({
            //                debugger
            file: model.pFileUrl, //"http://localhost:8888/lcms/images/ResourceImg/Img/Door_open_201433111732.mp4",
            //            autostart: (isPreview ? model.isAutoPlay : !1),
            repeat: model.isRepeatPlay,
            primary: "html5",
            width: model.pWidth,
            height: model.pHeight,
            customeContext: model
        })
        .onReady(function (event) {

            if (isPreview && !this.config.customeContext.isShowControlBar) {
                //                this.remove();
                //                $("#" + event.id).parent().remove();
                $("#" + elementID).hide();
                //                console.log($("#" + elementID));
                //                console.log("call back oncomplete111");
            }
        })
        .onComplete(function (event) {
            //            console.log("call back oncomplete");
            console.log(this);

            if (this.config.customeContext.isCompleteHide) {
                //                this.remove();
                $("#" + event.id).parent().hide();
                //                console.log($("#" + elementID));
                //                console.log("call back oncomplete111");
            }
        })
    }
});
//手动关联的素材模型
var ManuallyModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        IsSupportMultipleFile: false,
        pType: "ManuallyResource",

        //资源固有属性定义 开始
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        pVersoin: "",
        pFileUrl: "",
        pName: "",
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性

        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return alert("cuowu");
    },
    toStringForStaticHtml: function () {
        return alert("cuowu");
    }
})

//图片model
var ImageModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pType: "Image",
        pIsTriggerControl: !0, //标记该model是否支持作为触发器的触发条件
        pTop: 200,
        pLeft: 200,
        pWidth: 250,
        pHeight: 100,
        //资源固有属性定义 开始
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        pVersoin: "",
        pFileUrl: "",
        pName: "",
        pFileResourceFromLocation: "",//记录素材的位置,如果是本地素材库,那么显示:"所在文件夹/文件名"; 如果是统一资源库, 那么显示:"来自统一资源库",因为统一资源库没有返回相关数据; 注意: 修改资源时,注意更新该字段
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        pExtendFileID: "", //对于统一资源库, 每个素材都有一个extendFileID,要维持该字段, 因为复制粘贴要使用
        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        IsSupportMultipleSelect: !0, //标记是否支持多选
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        pUpdateTriggerView: !0, //该值改变，通知更新触发器区域
        //        pIsTrigger: !0, //标记本身是否是一个触发器(即:是否是别人的触发条件)
        pUpdateInitView: !0, //该值改变,通知更新初始化区域
        pInitControlVisible: 1, //保存页面初始状态:显示还是隐藏
        pRotate: 0,
        pTransparent: 1,
        BelongToLayerID: ''
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return _.template("<img pType='<%=pType %>' id='<%=pid %>_preview' <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class='SelfIsTrigger pcontent' <%}else{%> class='SelfNotIsTrigger pcontent' <%}%> style='width:<%=pWidth %>px;height:<%=pHeight %>px;position:absolute;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;  z-index:<%=SequenceID %>; <%if(pInitControlVisible=='2'){%> display:none; <%} %> ' src='<%=pFileUrl %>' />")(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
,
{
    ImageTemplate: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;webkitTransform：rotate(<%=pRotate%>deg); height:<%=pHeight %>px; position:absolute;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg); top:<%=pTop %>px;left:<%=pLeft %>px;Opacity:<%=pTransparent%>; z-index:<%=SequenceID %>;"><img src="<%=pFileUrl %>" alt="<%=pName %>"></div> ',
    ImageTemplateForLayer: '<div id="<%=pid %>" style="-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);width:<%=pWidth %>px;Opacity:<%=pTransparent%>;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><img src="<%=pFileUrl %>" alt="<%=pName %>" style="width:100%;height:100%;"></div> ',
    ImageTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);Opacity:<%=pTransparent%>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;<%if(pInitControlVisible=="2"){%> display:none; <%} %> "><img src="<%=pFileUrl %>" alt="<%=pName %>" style="width:100%;height:100%;"></div> '
});
//
var SVGModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pElementName: GetTranslateUI('TSVGinformation'),
        pType: "SVG",
        pTop: 200,
        pLeft: 200,
        pWidth: 300,
        pHeight: 250,
        //资源固有属性定义 开始
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        pVersoin: "",
        pFileUrl: "",
        pFileContent: "", //该属性只用于SVG,用来存储SVG文件的实际内容,供模板直接使用
        pName: "",
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        IsSupportMultipleSelect: !0, //标记是否支持多选
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        pIsTriggerControl: !0, //标记该model是否支持作为触发器的触发条件
        pUpdateTriggerView: !0, //该值改变，通知更新触发器区域
        pUpdateInitView: !0, //该值改变,通知更新初始化区域
        pInitControlVisible: 1,
        color: "red", //该属性只对小工具(箭头,方框等)有用,记录颜色使用
        pRotate: 0, //旋转角度
        BelongToLayerID: '',
        pTransparent: 1, //透明度
        pBorderWidth: 10, //该属性表示的是小工具的边框宽度
        pBorderColor: "Red", //该属性表示的是小工具的边框颜色
        pBackGroundColor: "none", //该属性表示的是小工具的背景颜色       
        pBackGroundIsOpacity: !0, //该属性标示的是小工具填充颜色是否透明
        pCircleRadius: 20, //该属性标示的是圆形小工具的半径比例
        pArrowColor: "Red", //专用于箭头的颜色，默认为红色
        pArrowStrokeWidth: "17.5px", //专用于箭头第一个Path的宽度
        pArrowSvgPath1: "M 35 17 L 192 17", //专用于箭头第一个Path的d值
        pArrowSvgPath2: "M 4 17 L 40 1 L 40 17 L 40 34 L 4 17 Z", //专用于箭头第二个Path的d值
        IsCanEditWidthHeight: !0,   //是否能编辑元素的宽和高，目前只适用于箭头和椭圆
        pEllipseRX: "50", //专门适用于椭圆小工具
        pEllipseRY: "50" //专门适用于椭圆小工具
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        var templateStr = "";
        switch (this.get("pType")) {
            case "Arrow":
                templateStr = SVGModel.ArrowTemplate;
                break;
            case "AdvanceArrow":
                templateStr = SVGModel.AdvanceArrowTemplate;
                break;
            case "Box":
                templateStr = SVGModel.BoxTemplate;
                break;

            case "Circle":
                templateStr = SVGModel.CircleTemplate;
                break;
            case "Ellipse":
                templateStr = SVGModel.EllipseTemplate;
                break;
            case "SVG":
                templateStr = '<%=pFileContent %>';
                break;
        }
        return _.template('<div pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> id="<%=pid %>_preview" style=" z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;<%if(pInitControlVisible=="2"){%> display:none; <%} %> top:<%=pTop %>px;left:<%=pLeft %>px; ">' + templateStr + '</div>')(this.toJSON()).replace(/\\\"/g, '\"');

    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
, {
    //前三个供toString()使用-------------------开始
    CircleTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 44 44" width="100%" height="100%" version="1.1"><circle <%if(pBackGroundIsOpacity){ %> fill="none" <% }else{ %> fill="<%=pBackGroundColor%>" <%}%> stroke="<%=pBorderColor %>" stroke-width="<%=pBorderWidth %>" cx="22" cy="22" r="<%=pCircleRadius %>" /></svg>',

    EllipseTemplate: '<svg width="100%" height="100%"><ellipse cx="50%" cy="50%" rx="<%=pEllipseRX%>%" ry="<%=pEllipseRY%>%" style="<%if(pBackGroundIsOpacity){ %> fill:none <% }else{ %> fill:<%=pBackGroundColor%> <%}%>; stroke:<%=pBorderColor%>;stroke-width:<%=pBorderWidth%>"></ellipse></svg>',

    BoxTemplate: '<svg width="100%"  version="1.1" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke-width= "<%=pBorderWidth %>" <%if(pBackGroundIsOpacity){ %> fill="none" <% }else{ %> fill="<%=pBackGroundColor%>" <%}%> style="stroke: <%=pBorderColor %>;"/></svg>',

    ArrowTemplate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" version="1.1"><path fill="none" stroke="<%=color %>" stroke-linejoin="round" stroke-width="2" transform="translate(0)" d="M 96 53 L 68 53 M 70 53 L 8 53" version="1.1"></path><path fill="<%=color %>" stroke="<%=color %>" transform="translate(0)" d="M 4 53 L 24 48 L 24 58 L 4 53 Z" version="1.1"></path></svg>',

    AdvanceArrowTemplate: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1"><path pointer-events="visibleStroke" stroke-linejoin="round" transform="translate(0)" d="<%=pArrowSvgPath1%>" version="1.1" style="stroke: <%=pArrowColor%>; fill: <%=pArrowColor%>; stroke-width: <%=pArrowStrokeWidth%>;"></path><path pointer-events="all" transform="translate(0)" d="<%=pArrowSvgPath2%>" version="1.1" style="stroke: <%=pArrowColor%>; fill: <%=pArrowColor%>;"></path></svg>',


    //-----------------------------------------结束
    //供SVGView使用----------开始
    SVGTemplate: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;top:<%=pTop %>px;left:<%=pLeft %>px; "><%=pFileContent %></div> ',
    SVGTemplateArrow: '<div class="pcontent" id="<%=pid %>" style="z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" version="1.1"><path fill="none" stroke="<%=color %>" stroke-linejoin="round" stroke-width="2" transform="translate(0)" d="M 96 53 L 68 53 M 70 53 L 8 53" version="1.1"></path><path fill="<%=color %>" stroke="<%=color %>" transform="translate(0)" d="M 4 53 L 24 48 L 24 58 L 4 53 Z" version="1.1"></path></svg></div> ',

    SVGTemplateAdvanceArrow: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1"><path pointer-events="visibleStroke" stroke-linejoin="round" transform="translate(0)" d="<%=pArrowSvgPath1%>" version="1.1" style="stroke: <%=pArrowColor%>; fill: <%=pArrowColor%>; stroke-width: <%=pArrowStrokeWidth%>;"></path><path pointer-events="all" transform="translate(0)" d="<%=pArrowSvgPath2%>" version="1.1" style="stroke: <%=pArrowColor%>; fill: <%=pArrowColor%>;"></path></svg></div> ',


    SVGTemplateBox: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;top:<%=pTop %>px;left:<%=pLeft %>px; "><svg width="100%"  version="1.1" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke-width= "<%=pBorderWidth %>" <%if(pBackGroundIsOpacity){ %> fill="none" <% }else{ %> fill="<%=pBackGroundColor%>" <%}%> style="stroke: <%=pBorderColor %>;"/></svg></div> ',
    SVGTemplateCircle: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 44 44" width="100%" height="100%" version="1.1"><circle <%if(pBackGroundIsOpacity){ %> fill="none" <% }else{ %> fill="<%=pBackGroundColor%>" <%}%> stroke="<%=pBorderColor %>" stroke-width="<%=pBorderWidth %>" cx="22" cy="22" r="<%=pCircleRadius %>" /></svg></div> ',

    SVGTemplateEllipse: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;top:<%=pTop %>px;left:<%=pLeft %>px; "><svg width="100%" height="100%"><ellipse cx="50%" cy="50%" rx="<%=pEllipseRX%>%" ry="<%=pEllipseRY%>%" style="<%if(pBackGroundIsOpacity){ %> fill:none <% }else{ %> fill:<%=pBackGroundColor%> <%}%>; stroke:<%=pBorderColor%>;stroke-width:<%=pBorderWidth%>"></ellipse></svg></div> ',
    //-----------------------结束
    //供插入到page中的Layer使用----------------------------------------------------开始(没有class="pcontent")
    SVGTemplateForLayer: '<div id="<%=pid %>" style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; -webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg); top:<%=pTop %>px;left:<%=pLeft %>px; "><%=pFileContent %></div> ',
    //preview与不preview的区别仅在于: 是否有触发器的判断,因为要显示手形鼠标
    SVGTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;<%if(pInitControlVisible=="2"){%> display:none; <%} %>height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><%=pFileContent %></div> ',
    SVGBoxTemplateForLayer: '<div id="<%=pid %>" style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; -webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg); top:<%=pTop %>px;left:<%=pLeft %>px; "><svg width="100%"  version="1.1" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke-width= "<%=pBorderWidth %>" <%if(pBackGroundIsOpacity){ %> fill="none" <% }else{ %> fill="<%=pBackGroundColor%>" <%}%> style="stroke: <%=pBorderColor %>;"/></svg></div> ',
    //preview与不preview的区别仅在于: 是否有触发器的判断,因为要显示手形鼠标
    SVGBoxTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;<%if(pInitControlVisible=="2"){%> display:none; <%} %>height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><svg width="100%"  version="1.1" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke-width= "<%=pBorderWidth %>" <%if(pBackGroundIsOpacity){ %> fill="none" <% }else{ %> fill="<%=pBackGroundColor%>" <%}%> style="stroke: <%=pBorderColor %>;"/></svg></div> ',
    SVGCircleTemplateForLayer: '<div id="<%=pid %>" style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; -webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg); top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 44 44" width="100%" height="100%" version="1.1"><circle <%if(pBackGroundIsOpacity){ %> fill="none" <% }else{ %> fill="<%=pBackGroundColor%>" <%}%> stroke="<%=pBorderColor %>" stroke-width="<%=pBorderWidth %>" cx="22" cy="22" r="<%=pCircleRadius %>" /></svg></div> ',
    SVGEllipseTemplateForLayer: '<div id="<%=pid %>" style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; -webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg); top:<%=pTop %>px;left:<%=pLeft %>px; "><svg width="100%" height="100%"><ellipse cx="50%" cy="50%" rx="<%=pEllipseRX%>%" ry="<%=pEllipseRY%>%" style="<%if(pBackGroundIsOpacity){ %> fill:none <% }else{ %> fill:<%=pBackGroundColor%> <%}%>; stroke:<%=pBorderColor%>;stroke-width:<%=pBorderWidth%>"></ellipse></svg></div> ',
    //preview与不preview的区别仅在于: 是否有触发器的判断,因为要显示手形鼠标
    SVGCircleTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;<%if(pInitControlVisible=="2"){%> display:none; <%} %>;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 44 44" width="100%" height="100%" version="1.1"><circle <%if(pBackGroundIsOpacity){ %> fill="none" <% }else{ %> fill="<%=pBackGroundColor%>" <%}%> stroke="<%=pBorderColor %>" stroke-width="<%=pBorderWidth %>" cx="22" cy="22" r="<%=pCircleRadius %>" /></svg></div> ',
    SVGEllipseTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;<%if(pInitControlVisible=="2"){%> display:none; <%} %>;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><svg width="100%" height="100%"><ellipse cx="50%" cy="50%" rx="<%=pEllipseRX%>%" ry="<%=pEllipseRY%>%" style="<%if(pBackGroundIsOpacity){ %> fill:none <% }else{ %> fill:<%=pBackGroundColor%> <%}%>; stroke:<%=pBorderColor%>;stroke-width:<%=pBorderWidth%>"></ellipse></svg></div> ',


    SVGArrowTemplateForLayer: '<div id="<%=pid %>" style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; -webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg); top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" version="1.1"><path fill="none" stroke="<%=color %>" stroke-linejoin="round" stroke-width="2" transform="translate(0)" d="M 96 53 L 68 53 M 70 53 L 8 53" version="1.1"></path><path fill="<%=color %>" stroke="<%=color %>" transform="translate(0)" d="M 4 53 L 24 48 L 24 58 L 4 53 Z" version="1.1"></path></svg></div> ',
    //preview与不preview的区别仅在于: 是否有触发器的判断,因为要显示手形鼠标
    SVGArrowTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;<%if(pInitControlVisible=="2"){%> display:none; <%} %>;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" version="1.1"><path fill="none" stroke="<%=color %>" stroke-linejoin="round" stroke-width="2" transform="translate(0)" d="M 96 53 L 68 53 M 70 53 L 8 53" version="1.1"></path><path fill="<%=color %>" stroke="<%=color %>" transform="translate(0)" d="M 4 53 L 24 48 L 24 58 L 4 53 Z" version="1.1"></path></svg></div> ',


    SVGAdvanceArrowTemplateForLayer: '<div id="<%=pid %>" style="z-index:<%=SequenceID %>;width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; -webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg); top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1"><path pointer-events="visibleStroke" stroke-linejoin="round" transform="translate(0)" d="<%=pArrowSvgPath1%>" version="1.1" style="stroke: <%=pArrowColor%>; fill: <%=pArrowColor%>; stroke-width: <%=pArrowStrokeWidth%>;"></path><path pointer-events="all" transform="translate(0)" d="<%=pArrowSvgPath2%>" version="1.1" style="stroke: <%=pArrowColor%>; fill: <%=pArrowColor%>;"></path></svg></div> ',
    //preview与不preview的区别仅在于: 是否有触发器的判断,因为要显示手形鼠标
    SVGAdvanceArrowTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="z-index:<%=SequenceID %>;-webkit-transform:rotate(<%=pRotate%>deg);-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);left:<%=pLeft %>px;top:<%=pTop %>px;Opacity:<%=pTransparent%>;width:<%=pWidth %>px;<%if(pInitControlVisible=="2"){%> display:none; <%} %>;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1"><path pointer-events="visibleStroke" stroke-linejoin="round" transform="translate(0)" d="<%=pArrowSvgPath1%>" version="1.1" style="stroke: <%=pArrowColor%>; fill: <%=pArrowColor%>; stroke-width: <%=pArrowStrokeWidth%>;"></path><path pointer-events="all" transform="translate(0)" d="<%=pArrowSvgPath2%>" version="1.1" style="stroke: <%=pArrowColor%>; fill: <%=pArrowColor%>;"></path></svg></div>'
    //-----------------------------------------------------------------------------结束
});
//幻灯片model
var ImageSlideModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        pElementName: GetTranslateUI('TslidShow'), //显示在右边属性面板中的名字
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !0, //标记该model是否包含多个file
        pType: "ImageSlide",
        pName: GetTranslateUI('TslidShow'),
        pTop: 100,
        pLeft: 300,
        pWidth: 300,
        pHeight: 200,
        ImageArray: '', //保存所有的image
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        deleteSubImageIDArray: "", //标记是删除的是子集(ImageArrayid),如果是多个,以逗号分隔,字符串类型
        CurrentImageIndex: null, //标记当前正在操作的image的索引
        IsAutoPlay: !0, //是否自动播放
        IsSupportMultipleSelect: !0, //标记是否支持多选
        IntervalSecond: 2, //如果自动播放,时间间隔几秒,默认2秒
        IsShowControlPanel: !0, //是否显示控制区域.左右两个箭头
        IsShowPageIndicators: !1, //是否显示分页符
        IsShowSlid: !0, //是否已slid形式显示幻灯片
        PlayCount: 1, //播放次数,如果自动播放,该属性才会起作用
        DelaySecond: 0, //开始时间, 如果自动播放,该属性才会起作用
        PlayEndIsHide: !1, //播放完毕是否隐藏,如果自动播放,该属性才会起作用.如果不勾选,播放指定次数后,停在那里
        pInitControlVisible: 1,
        pUpdateAnimationAttributePanel: !0, //该值改变, 通知"动作设置区域"更新
        pUpdateSetPanelAttributeView: !0, // //该值改变,通知设置区域,比如设置自动播放
        pUpdateInitView: !0, //该值改变,通知初始设置区域更新
        pTransparent: 1
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> style="width:<%=pWidth %>px; <%if(pInitControlVisible=="2"){%> display:none; <%} %> height:<%=pHeight %>px; position:absolute; z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px; ">'
                     + $("#slidImageTemplate").html().replace(/<%=pid %>/g, "<%=pid %>_preview") + '</div>')(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> style="width:<%=pWidth %>px; <%if(pInitControlVisible=="2"){%> display:none; <%} %> height:<%=pHeight %>px; position:absolute; z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px; "><img style="width:100%;height:100%;" src="' + this.attributes.ImageArray[0].attributes.pFileUrl + '"></div>')(this.toJSON());
    }
},
{

    ImageSlideTemplate: function () {
        return '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>; ">'
                     + $("#slidImageTemplate").html().replace("data-ride=\"carousel\"", "") + '</div> ';
    },
    ImageSlideTemplateForLayer: function () {
        return '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px; <%if(pInitControlVisible=="2"){%> display:none; <%} %> left:<%=pLeft %>px; z-index:<%=SequenceID %>; ">'
                     + $("#slidImageTemplate").html() + '</div> ';
    },
    ImageSlideTemplateForLayerPreview: function () {
        return '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; <%if(pInitControlVisible=="2"){%> display:none; <%} %> top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>; ">'
                     + $("#slidImageTemplate").html() + '</div> ';
    }
});

//按钮model
var ButtonModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !0, //标记该model是否包含多个file
        pType: "ButtonType",
        pName: GetTranslateUI('TCustomButton'),
        pElementName: GetTranslateUI('TButtonBasicInformation'),
        pTop: 100,
        pLeft: 300,
        pWidth: 100,
        pHeight: 30,
        ImageArray: '', //保存所有的image
        pIsTriggerControl: !0, //标记该model是否支持作为触发器的触发条件
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        IsSupportMultipleSelect: !0, //标记是否支持多选
        isAnimationPanel: !0,
        BelongToLayerID: '',
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        deleteSubImageIDArray: "", //标记是删除的是子集(ImageArrayid),如果是多个,以逗号分隔,字符串类型
        pInitControlVisible: 1, //保存页面初始状态:显示还是隐藏
        CurrentImageIndex: null, //标记当前正在操作的image的索引
        pTransparent: 1
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        //不判断是否是触发器,因为该元素本身就可点击使用;
        return _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" class="SelfIsTrigger pcontent" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;<%if(pInitControlVisible=="2"){%> display:none; <%} %>">'
                     + $("#buttonViewTemplate").html() + '</div> ')(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
,
{
    ButtonModelTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><%_.each(ImageArray,function(item1,index){%><img style="width:100%;height:100%;display:<%=(index==0?"":"none") %>"  src="<%=item1.pFileUrl%>"/><%}) %></div> ',
    ButtonModelTemplateForLayerInit: '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><%_.each(ImageArray,function(item1,index){%><img style="width:100%;height:100%;display:<%=(index==0?"":"none") %>"  src="<%=item1.pFileUrl%>"/><%}) %></div> '
});

//Rotate model 滑动轮转
var ImageRotateModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        pElementName: GetTranslateUI('TRotaryslide'), //显示在右边属性面板中的名字
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !0, //标记该model是否包含多个file
        pType: "ImageRotate",
        pName: GetTranslateUI('TRotaryslide'),
        pTop: 120,
        pLeft: 320,
        pWidth: 300,
        pHeight: 200,
        IsSupportMultipleSelect: !0, //标记是否支持多选
        ImageArray: '', //保存所有的image
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        BelongToLayerID: '',
        deleteSubImageIDArray: "",
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        CurrentImageIndex: null//标记当前正在操作的image的索引
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%>  style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;">'
                     + $("#ImageRotateTemplate").html() + '</div>')(this.toJSON());
    },
    toStringForStaticHtml: function () {
        return _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;z-index:<%=SequenceID %>; "><img style="width:100%;height:100%;" src="' + this.attributes.ImageArray[0].attributes.pFileUrl + '"></div>')(this.toJSON());
    }
}
, {
    ImageRotateTemplate: function () {
        return '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;">'
                     + $("#ImageRotateTemplate").html() + '</div> ';
    },
    ImageRotateTemplateForLayer: function () {
        return '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;">'
                     + $("#ImageRotateTemplate").html() + '</div> ';
    },
    ImageRotateTemplateForLayerPreview: function () {
        return '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%> class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;">'
                     + $("#ImageRotateTemplate").html() + '</div> ';
    }
});

//序列帧model
var ImageSequenceModel = ElementBaseModel.extend({
    defaults: {
        pElementName: GetTranslateUI('TFrameanimationsequence'), //显示在右边属性面板中的名字
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index 
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pid: 0,
        pName: GetTranslateUI('TsequenceOfFrames'),
        pType: "ImageSequence",
        pWidth: 100,
        pWidthX: 1,
        pHeight: 100,
        pTop: 110,
        pLeft: 310,
        ImageModel: '', //保存所有的image
        pIsTriggerControl: !0, //标记该model是否支持作为触发器的触发条件
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        IsSupportMultipleSelect: !0, //标记是否支持多选
        isAnimationPanel: !0,
        pFrame: 0, //播放帧数,
        BelongToLayerID: '',
        pUpdateAttributeView: !0//该值改变,通知更新属性区域
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        return _.template('<div pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%>  id="<%=pid %>_preview" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px; background: url("<%=ImageModel.get("pFileUrl") %>") no-repeat 0 0;"></div>')(this.toJSON());

    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
,
{
    ImageSequenceTemplate: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;z-index:<%=SequenceID %>; background-image: url(\'<%=ImageModel.get("pFileUrl") %>\')"></div>',
    ImageSequenceTemplateForLayer: '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px; background-image: url("<%=ImageModel.pFileUrl %>")"></div>',
    ImageSequenceTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px; background-image: url("<%=ImageModel.pFileUrl %>")"></div>'
});

//文本框model
var RichTextModel = ElementBaseModel.extend({
    defaults: {
        pElementName: GetTranslateUI('TTextAreaInformation'), //显示在右边属性面板中的名字
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index
        pIsTriggerControl: !0, //标记该model是否支持作为触发器的触发条件
        pid: 0,
        IsSupportMultipleFile: !1, //标记该model是否包含多个file
        pName: GetTranslateUI('TTextBox'),
        pType: "RichText",
        pTop: 220,
        pLeft: 220,
        pWidth: 140,
        pHeight: 50,
        pTextContent: GetTranslateUI('TDoubleclickthetextboxtoeditthetext'), //解码后是"双击文本框编辑文本",保存输入的数据
        //资源固有属性定义 开始-----//注销原因:没有引用统一资源库的资源
        pFileID: "",
        pMaterialUsageID: "",
        pResourceType: "",
        pVersoin: "",
        pFileUrl: "",
        pName: "",
        pThumbImageUrl: "", //对于图片类型,有一个单独的缩略图地址属性
        //资源固有属性定义 结束
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        isAnimationPanel: !0,
        pUpdateAnimationAttributePanel: !0, //标记是否更新动作面板
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        pUpdateTriggerView: !0, //该值改变，通知更新触发器区域
        pUpdateInitView: !0, //该值改变,通知更新初始化区域
        pInitControlVisible: 1, //保存页面初始状态:显示还是隐藏
        pRotate: 0,
        pTransparent: 1,
        BelongToLayerID: '',
        IsSupportMultipleSelect: !0, //标记是否支持多选
        isShowBorder: !1, //该属性表示的是否显示文本框的边框
        pBorderWidth: 0, //该属性表示的是文本框的边框宽度
        pBorderColor: "#000000", //该属性表示的是文本框的边框颜色
        pBackGroundColor: "#FFFFFF", //该属性表示的是文本框的背景颜色
        pBackGroundIsOpacity: !0, //判断文本的背景颜色是否透明，默认为透明
        pCkEditorBackGroundColor: "#FFF"
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        switch (this.get("pType")) {

            case "RichText":
                return _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%>  style="border-width:<%=pBorderWidth%>px;border-color:<%=pBorderColor%>;border-style:solid;<% if(!pBackGroundIsOpacity){%> background:<%=pBackGroundColor%>;  <%} else {%> background:transparent; <% }%>;width:<%=pWidth %>px;-webkit-transform:rotate(<%=pRotate %>deg);Opacity:<%=pTransparent%>;height:<%=pHeight %>px; position:absolute;z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px; <%if(pInitControlVisible=="2"){%> display:none; <%} %>"><%=decodeURIComponent(pTextContent)%></div>')(this.toJSON());
                break;


            case "Correct":
            case "Incorrect":
                return _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" class="SelfIsTrigger pcontent" style="border-width:<%=pBorderWidth%>px;border-color:<%=pBorderColor%>;border-style:solid;<% if(!pBackGroundIsOpacity){%> background:<%=pBackGroundColor%>;  <%} else {%> background:transparent; <% }%>;width:<%=pWidth %>px;-webkit-transform:rotate(<%=pRotate %>deg);Opacity:<%=pTransparent%>;height:<%=pHeight %>px; position:absolute;z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px; <%if(pInitControlVisible=="2"){%> display:none; <%} %>"><%=decodeURIComponent(pTextContent)%></div>')(this.toJSON());
                break;

            default:
                alert("错误,请联系管理员");
                break;
        }




    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
,
{
    RichTextModelTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;z-index:<%=SequenceID %>; "><div id="content_<%=pid%>" style="width:100%;height:100%;border-width:<%=pBorderWidth%>px;border-color:<%=pBorderColor%>;border-style:solid;<% if(!pBackGroundIsOpacity){%> background:<%=pBackGroundColor%>;  <%} else {%> background:transparent; <% }%>"><%=pTextContent %></div></div>',
    RichTextModelTemplateForLayerInit: '<div id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;z-index:<%=SequenceID %>; "><div id="content_<%=pid%>" style="width:100%;height:100%;border-width:<%=pBorderWidth%>px;border-color:<%=pBorderColor%>;border-style:solid;<% if(!pBackGroundIsOpacity){%> background:<%=pBackGroundColor%>;  <%} else {%> background:transparent; <% }%>"><%=pTextContent %></div></div>'
});

//网页内容model
var WebFormModel = ElementBaseModel.extend({
    defaults: {
        pElementName: GetTranslateUI('TWebForm'), //显示在右边属性面板中的名字
        SequenceID: 0, //对应元素的z-index
        IsSuppotZIndex: !0, //标记当前model是否支持设置z-index
        pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件
        pid: 0,
        IsSupportMultipleFile: !1, //标记该model是否包含多个file

        pFileID: "",
        pFileName: "",
        pFileUrl: "#",//存储zip文件解压后html的页面地址
        pMaterialUsageID: "",
        pName: GetTranslateUI('TWebForm'),
        pType: "WebForm",
        pTop: 220,
        pLeft: 220,
        pWidth: 200,
        pHeight: 300,
        pTextContentUrl: "",//存储url
        pTextContentEmbed: "",
        pContentType: "localResource", //内容类型, 枚举值url,embed, localResource
        // pContentType: "url", //内容类型, 枚举值url和embed
        pParentElementID: ""/*这个属性是动态的,应该为所属的画板的id*/,
        pFocus: !1,
        IsSupportMultipleSelect: !0, //标记是否支持多选
        isAnimationPanel: !0,
        pUpdateAttributeView: !0, //该值改变,通知更新属性区域
        pUpdateContentView: !0, //该值改变,通知内容属性区域
        BelongToLayerID: ''
    },
    initialize: function () {
        //初始化id
        this.set({
            pid: _.uniqueId("ele"),
            silent: !0
        });
    },
    toString: function () {
        var temp = null;
        switch (this.get("pContentType")) {
            case "url":
                temp = _.template('<div pType="<%=pType %>" pContentType="<%=pContentType%>" id="<%=pid %>_preview" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%>  style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px;"><iframe style="width:100%;height:100%;" src="<%=decodeURIComponent(pTextContentUrl)%>" ></iframe></div>')(this.toJSON());


                break;

            case "embed":
                temp = _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" pContentType="<%=pContentType%>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%>  style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px;"><%=decodeURIComponent(pTextContentEmbed)%></div>')(this.toJSON());

                break;

            case "localResource":
                temp = _.template('<div pType="<%=pType %>" id="<%=pid %>_preview" pContentType="<%=pContentType%>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger pcontent" <%}else{%> class="SelfNotIsTrigger pcontent" <%}%>  style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute;z-index:<%=SequenceID %>; top:<%=pTop %>px;left:<%=pLeft %>px;"><iframe style="width:100%;height:100%;" psrc="<%=GenerateWebFormLocalResourceLocation(decodeURIComponent(pFileUrl),true)%>" ></iframe></div>')(this.toJSON());
                break;
        }
        return temp;
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
}
,
{
    WebFormModelTemplateForLayerPreview: '<div id="<%=pid %>" pType="<%=pType %>" <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class="SelfIsTrigger" <%}else{%> class="SelfNotIsTrigger" <%}%> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;z-index:<%=SequenceID %>; "><%if(pContentType=="embed") { %><%=decodeURIComponent(pTextContentEmbed)%> <%} else if (pContentType=="url") {%>  <iframe style="width:100%;height:100%;" src="<%=decodeURIComponent(pTextContentUrl)%>" ></iframe>  <%} else if (pContentType=="localResource") {%>  <iframe style="width:100%;height:100%;" src="<%=GenerateWebFormLocalResourceLocation(decodeURIComponent(pFileUrl),true)%>" ></iframe> %></div>',
    WebFormModelTemplateForLayerInit: '<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %>  style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;z-index:<%=SequenceID %>;background: rgba(218, 218, 218, 0.701961);"></div>'
});




//画布model,Layer的model
var BoardModel = ElementBaseModel.extend({
    defaults: {
        pid: 0,
        pType: "board",
        pTitle: "", //层的名字,目前画板不提供修改该属性的值
        pTop: 0,
        pLeft: 0,
        pWidth: 1000,
        pHeight: 550,
        //资源固有属性定义 开始
        pFileID: "",
        pFileUrl: "#",
        pName: "",
        pMaterialUsageID: "",
        //资源固有属性定义 结束
        BelongToElementID: "", //该字段专用于layer元素,用于维持一个layer的原始layerID,该字段本来应该是空的,但是现在用来记录当前layer model的原始layerID,redo,undo操作要使用
        pParentElementID: "inactionArea", /*这个属性是动态的,应该为所属的画板的id*/
        pFocus: !1,
        isAnimationPanel: !0,
        backgroundColor: "#FFF",
        pUpdateAttributeView: !0,
        pIsTriggerControl: !0,
        pUpdateTriggerView: !1,
        pInitControlVisible: 1,
        IsSupportMultipleFile: false,
        BelongToLayerID: '',
        SequenceID: 0, //对应元素的z-index
        pUpdateManuallyResourceView: !0, //手工关联素材区域是否更新
        IsSuppotZIndex: !1 //标记当前model是否支持设置z-index
        //        isAutoAnimation: !1 //每个页面都有一个触发器设置,该值记录 :是否页面载入就自动播放动画效果,false:点击播放; true: 自动播放
        //        TemplateHTML: "<div style='width:<%=pWidth %>px;height:<%=pHeight %>px;border:1px solid black; background-color:<%=backgroundColor %>; background-image: url(<%=pFileUrl %>);' id='<%=pid %>' class='pageboard' ></div>"
    },
    initialize: function () {
        //初始化id
        if (this.get("pid") == '') {
            this.set({
                pid: _.uniqueId("ele"),
                silent: !0
            });
        }
    },
    toString: function (ptype) {//预览时使用
        ptype = (ptype || this.attributes.pType);
        switch (ptype) {
            case "layer":
                console.log("渲染-layer");
                return (BoardModel.InitAllChildrenModel(this, "_preview")[0][0]).outerHTML;
                break;

            case "board":
                return _.template("<div pType='<%=pType %>' <%if(pIsTriggerControl&&SelfIsTrigger(pid)){%>  class='SelfIsTrigger pcontent'<%}else{%> class='SelfNotIsTrigger pcontent'<%}%> style='width:<%=pWidth %>px;height:<%=pHeight %>px; background-color:<%=backgroundColor %>; overflow:hidden; position:relative; ' id='<%=pid %>_preview' ><%if(pFileID!=''&&pFileUrl!='#'&&pFileUrl!=''){ %><img src='<%=pFileUrl %>' style='width:100%;height:100%;' /><%} %></div>")(this.toJSON());
                break;

            default:
                alert(GetTranslateUI('TIllegalOperation'));
                break;
        }
    },
    toStringForStaticHtml: function () {
        return this.toString();
    }
},
{
    FilterCurrentBoardAllElement: function ($html) {//将画板内的元素特殊处理一遍.目前只处理:视频,catia,glstudio
        //将元素本身过滤掉
        $html.find("#" + Globle.CurrentModel.get("pid") + "_preview").hide();
        //        .end().css("opacity", "0.3");

        VideoModel.FilterGenerateVideo($html);
        GlStudioModel.FilterGenerateGlStudio($html);
        CatiaModel.FilterGenerateCatia($html);
    },
    toStringForAnimation: function () {//用户绘制贝赛尔曲线时使用. 返回画板本身.
        var ptype = "board";
        switch (ptype) {
            case "layer":
                console.log("渲染-layer");
                return (BoardModel.InitAllChildrenModel(Globle.CurrentBoard, "_preview")[0][0]).outerHTML;
                break;

            case "board":
                return _.template("<div style='width:<%=parseInt(pWidth)-2 %>px;height:<%=parseInt(pHeight)-2 %>px;z-index:-1;position:relative;top:-<%=parseInt(pHeight)+3 %>px; background-color:<%=backgroundColor %>; ' ><%if(pFileID!=''&&pFileUrl!='#'&&pFileUrl!=''){ %><img src='<%=pFileUrl %>' style='width:100%;height:100%;' /><%} %></div>")(Globle.CurrentBoard.toJSON());
                break;

            default:
                alert(GetTranslateUI('TIllegalOperation'));
                break;
        }
    },
    //专为layer服务
    //初始化layer本身以及内部包含的元素,触发器,动作.
    //isOnlyReturnAudioOmitAndAddGlobleCollection如果等于true,说明不需要插入html内容,只是把层的元素和触发器等加入到全局集合中,以及将视频,音频,Glstudio元素返回,供后续使用
    InitAllChildrenModel: function (layerModel, isPreviewStr, isOnlyReturnAudioOmitAndAddGlobleCollection) {
        isPreviewStr || (isPreviewStr = "");
        isOnlyReturnAudioOmitAndAddGlobleCollection || (isOnlyReturnAudioOmitAndAddGlobleCollection = false);
        //        debugger;        

        var resultHTMLArray = new Array();
        //        if (isPreviewStr == "_preview")
        layerModel.attributes.pid += isPreviewStr
        var layerObjOuterStr = '';
        if (!isOnlyReturnAudioOmitAndAddGlobleCollection) {
            if ($.trim(isPreviewStr) == '') {
                var layerObjOuterStr = (_.template($("#LayerTemplate").html())(layerModel.toJSON()));
            }
            else {
                var layerObjOuterStr = (_.template($("#LayerTemplateForPreview").html())(layerModel.toJSON()));
            }
        }
        layerModel.attributes.pid = layerModel.attributes.pid.replace(isPreviewStr, "");
        //存储哪些元素需要在附加到页面上后,再初始化一次.
        var mediaID = new Array();
        var layerContentModelArray = layerModel.ContentChildrenModel;
        //当layerModel.ContentChildrenModel为null或者未定义时候，不用循环
        if (layerModel.ContentChildrenModel) {
            for (var i = 0; i < layerContentModelArray.length; i++) {
                //可能会有图片,文字,动作,触发器等类型
                var tempObj = JSON.parse(decodeURIComponent(layerContentModelArray[i].PageContent));
                tempObj.pid = layerContentModelArray[i].key + Globle.VariableSuffix + isPreviewStr;
                tempObj.id = layerContentModelArray[i].key;
                tempObj.BelongToBoardID = tempObj.pParentElementID = layerContentModelArray[i].BelongToBoardID + Globle.VariableSuffix;
                tempObj.BelongToElementID = layerContentModelArray[i].BelongToElementID + Globle.VariableSuffix;
                tempObj.BelongToLayerID = layerContentModelArray[i].BelongToLayerID;
                switch (tempObj.pType) {
                    case "ButtonType": //说明是button
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(ButtonModel.ButtonModelTemplateForLayerPreview)(tempObj));
                        }
                        else {//说明初始化显示使用
                            resultHTMLArray.push(_.template(ButtonModel.ButtonModelTemplateForLayerInit)(tempObj));
                            var ButtonModelObj = new ButtonModel(tempObj);
                            ButtonModelObj.id = tempObj.id;
                            ButtonModelObj.set({
                                isLayerContent: true,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                pid: tempObj.pid,
                                silent: true
                            });
                            Globle.AllModelCollection.add(ButtonModelObj, { silent: true });
                        }
                        break;
                    case "RichText": //文本框
                        tempObj.pTextContent = decodeURIComponent(tempObj.pTextContent);
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(RichTextModel.RichTextModelTemplateForLayerPreview)(tempObj));
                        }
                        else {//说明初始化显示使用
                            resultHTMLArray.push(_.template(RichTextModel.RichTextModelTemplateForLayerInit)(tempObj));
                            var RichTextModelObj = new RichTextModel(tempObj);
                            RichTextModelObj.id = tempObj.id;
                            RichTextModelObj.set({
                                isLayerContent: true,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                pid: tempObj.pid,
                                silent: true
                            });
                            Globle.AllModelCollection.add(RichTextModelObj, { silent: true });
                        }
                        break;
                    case "WebForm": //
                        //                        tempObj.pTextContent = decodeURIComponent(tempObj.pTextContent);
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(WebFormModel.WebFormModelTemplateForLayerPreview)(tempObj));
                        }
                        else {//说明初始化显示使用
                            resultHTMLArray.push(_.template(WebFormModel.WebFormModelTemplateForLayerInit)(tempObj));
                            var WebFormModelModelObj = new WebFormModel(tempObj);
                            WebFormModelModelObj.id = tempObj.id;
                            WebFormModelModelObj.set({
                                isLayerContent: true,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                pid: tempObj.pid,
                                silent: true
                            });
                            Globle.AllModelCollection.add(WebFormModelModelObj, { silent: true });
                        }
                        break;
                    case "Audio": //mp3素材
                        mediaID.push({
                            pid: tempObj.pid,
                            value: tempObj
                        });
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(AudioModel.AudioModelTemplateForLayerPreview)(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(AudioModel.AudioModelTemplateForLayerInit)(tempObj));
                            var AudioModelObj = new AudioModel(tempObj);
                            AudioModelObj.id = tempObj.id;
                            AudioModelObj.set({
                                isLayerContent: true,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                pid: tempObj.pid,
                                silent: true
                            });
                            Globle.AllModelCollection.add(AudioModelObj, { silent: true });
                        }
                        break;
                    case "Flash": //mp3素材
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(FlashModel.FlashTemplateForLayerPreview)(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(FlashModel.FlashTemplateForLayer)(tempObj));
                            var FlashModelObj = new FlashModel(tempObj);
                            FlashModelObj.id = tempObj.id;
                            FlashModelObj.set({
                                isLayerContent: true,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                pid: tempObj.pid,
                                silent: true
                            });
                            Globle.AllModelCollection.add(FlashModelObj, { silent: true });
                        }
                        break;
                    case "GlStudio": //GlStudio素材
                        mediaID.push({
                            pid: tempObj.pid,
                            value: tempObj
                        });
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(GlStudioModel.GlStudioTemplateForLayerPreview)(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(GlStudioModel.GlStudioTemplateForLayer)(tempObj));
                            var GlStudioModelObj = new GlStudioModel(tempObj);
                            GlStudioModelObj.id = tempObj.id;
                            GlStudioModelObj.set({
                                isLayerContent: true,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                pid: tempObj.pid,
                                silent: true
                            });
                            Globle.AllModelCollection.add(GlStudioModelObj, { silent: true });
                        }
                        break;
                    case "Catia": //Catia素材
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(CatiaModel.CatiaTemplateForLayerPreview())(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(CatiaModel.CatiaTemplateForLayer())(tempObj));
                            var CatiaModelObj = new CatiaModel(tempObj);
                            CatiaModelObj.id = tempObj.id;
                            CatiaModelObj.set({
                                isLayerContent: true,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                pid: tempObj.pid,
                                silent: true
                            });
                            Globle.AllModelCollection.add(CatiaModelObj, { silent: true });
                        }
                        break;
                    case "Video": //mp4素材
                        mediaID.push({
                            pid: tempObj.pid,
                            value: tempObj
                        });
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(VideoModel.VideoTemplateForLayerPreview)(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(VideoModel.VideoTemplateForLayer)(tempObj));
                            var VideoModelObj = new VideoModel(tempObj);
                            VideoModelObj.id = tempObj.id;
                            VideoModelObj.set({
                                isLayerContent: true,
                                pid: tempObj.pid,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                silent: true
                            });
                            Globle.AllModelCollection.add(VideoModelObj, { silent: true });
                        }
                        break;
                    case "Image": //图片素材
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(ImageModel.ImageTemplateForLayerPreview)(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(ImageModel.ImageTemplateForLayer)(tempObj));
                            var ImageModelObj = new ImageModel(tempObj);
                            ImageModelObj.id = tempObj.id;
                            ImageModelObj.set({
                                isLayerContent: true,
                                pid: tempObj.pid,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                silent: true
                            });
                            Globle.AllModelCollection.add(ImageModelObj, { silent: true });
                        }
                        break;
                    case "Arrow":
                    case "Circle":
                    case "Ellipse":
                    case "Box":
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(eval("SVGModel.SVG" + tempObj.pType + "TemplateForLayerPreview"))(tempObj).replace(/\\"/g, '\'').replace(/\+/g, ' '));
                        }
                        else {
                            resultHTMLArray.push(_.template(eval("SVGModel.SVG" + tempObj.pType + "TemplateForLayer"))(tempObj).replace(/\\"/g, '\'').replace(/\+/g, ' '));
                            var SVGModelObj = new SVGModel(tempObj);
                            SVGModelObj.id = tempObj.id;
                            SVGModelObj.set({
                                isLayerContent: true,
                                pid: tempObj.pid,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                silent: true
                            });
                            Globle.AllModelCollection.add(SVGModelObj, { silent: true });
                        }
                        break;
                    case "AdvanceArrow":
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(eval("SVGModel.SVG" + tempObj.pType + "TemplateForLayerPreview"))(tempObj).replace(/\\"/g, '\'').replace(/\+/g, ' '));
                        }
                        else {
                            resultHTMLArray.push(_.template(eval("SVGModel.SVG" + tempObj.pType + "TemplateForLayer"))(tempObj).replace(/\\"/g, '\'').replace(/\+/g, ' '));
                            var SVGModelObj = new SVGModel(tempObj);
                            SVGModelObj.id = tempObj.id;
                            SVGModelObj.set({
                                isLayerContent: true,
                                pid: tempObj.pid,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                silent: true
                            });
                            Globle.AllModelCollection.add(SVGModelObj, { silent: true });
                        }
                        break;
                    case "ImageSlide": //幻灯片
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(ImageSlideModel.ImageSlideTemplateForLayerPreview())(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(ImageSlideModel.ImageSlideTemplateForLayer())(tempObj));
                            var ImageSlideModelObj = new ImageSlideModel(tempObj);
                            ImageSlideModelObj.id = tempObj.id;
                            ImageSlideModelObj.set({
                                isLayerContent: true,
                                pid: tempObj.pid,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                silent: true
                            });
                            Globle.AllModelCollection.add(ImageSlideModelObj, { silent: true });
                        }
                        break;
                    case "ImageSequence": //序列帧
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(ImageSequenceModel.ImageSequenceTemplateForLayerPreview)(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(ImageSequenceModel.ImageSequenceTemplateForLayer)(tempObj));
                            var ImageSequenceModelObj = new ImageSequenceModel(tempObj);
                            ImageSequenceModelObj.id = tempObj.id;
                            ImageSequenceModelObj.set({
                                isLayerContent: true,
                                pid: tempObj.pid,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                silent: true
                            });
                            Globle.AllModelCollection.add(ImageSequenceModelObj, { silent: true });
                        }
                        break;
                    case "ImageRotate": //滑动动画
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(ImageRotateModel.ImageRotateTemplateForLayerPreview())(tempObj));
                        }
                        else {
                            resultHTMLArray.push(_.template(ImageRotateModel.ImageRotateTemplateForLayer())(tempObj));
                            var ImageRotateModelObj = new ImageRotateModel(tempObj);
                            ImageRotateModelObj.id = tempObj.id;
                            ImageRotateModelObj.set({
                                isLayerContent: true,
                                pid: tempObj.pid,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                silent: true
                            });
                            Globle.AllModelCollection.add(ImageRotateModelObj, { silent: true });
                        }
                        break;
                    case "SVG": //svg
                        //                    tempObj.pFileContent = tempObj.pFileContent;
                        if (isPreviewStr != "") {//说明是预览使用
                            resultHTMLArray.push(_.template(SVGModel.SVGTemplateForLayerPreview)(tempObj).replace(/\\"/g, '\'').replace(/\+/g, ' '));
                        }
                        else {
                            resultHTMLArray.push(_.template(SVGModel.SVGTemplateForLayer)(tempObj).replace(/\\"/g, '\'').replace(/\+/g, ' '));
                            var SVGModelObj = new SVGModel(tempObj);
                            SVGModelObj.id = tempObj.id;
                            SVGModelObj.set({
                                isLayerContent: true,
                                pid: tempObj.pid,
                                BelongToLayerID: tempObj.BelongToLayerID,
                                silent: true
                            });
                            Globle.AllModelCollection.add(SVGModelObj, { silent: true });
                        }
                        break;

                    case "clickTrigger": //初始化触发器
                    case "beforeClickTrigger":
                    case "afterClickTrigger":
                        //                    debugger;                    
                        var ControlAnimationModelArrayTemp = layerContentModelArray[i].ActionIDArray.Trim(',').split(",");
                        if ((ControlAnimationModelArrayTemp.length == 1) && (ControlAnimationModelArrayTemp[0] == ''))
                            ControlAnimationModelArrayTemp = new Array();
                        var triggerObj = new TriggerModel(tempObj);
                        triggerObj.set({
                            pid: tempObj.pid,
                            BelongToLayerID: tempObj.BelongToLayerID,
                            ControlAnimationModelArray: ControlAnimationModelArrayTemp
                        });
                        tempObj.id = tempObj.id;

                        Globle.TriggerModelCollection.add(triggerObj, { silent: true });
                        break;
                }
                //            tempObj = ((tempObj.PageContent));
                if (!isPreviewStr && tempObj.actionType) {
                    //                debugger;
                    var tempAimationObj = new AnimationModel(tempObj);
                    tempAimationObj.id = layerContentModelArray[i].key;
                    tempAimationObj.set({
                        pid: layerContentModelArray[i].key + Globle.VariableSuffix,
                        //                    BelongToElementID: layerContentModelArray[i].BelongToElementID,
                        //                    BelongToBoardID: layerContentModelArray[i].BelongToBoardID,
                        BelongLayerID: layerModel.id.toString(), //在动作集合里能够区分动作是由于layer带入的还是画板本身添加的.这样在删除当前画板引入的层时,可以将层引入的动作从Globle.AnimationBaseModelCollection集合中删除(不需要发送到服务器,服务器的数据在删除layer时,已经把该动作删除过了)
                        silent: true
                    });

                    Globle.AnimationBaseModelCollection.add(tempAimationObj);
                }
                //            switch (tempObj.actionType) {
                //                case "clickTrigger": //初始化触发器
                //                case "beforeClickTrigger":
                //                case "afterClickTrigger":

                //                    break;
                //                case "GoToPage": //
                //                    break;
                //                case "FlyIn": //飞入
                //                   
                //                    break;
                //                case "FlyOut": //飞出
                //                    break;
                //                case "FadeIn":
                //                    break;
                //                case "FadeOut":
                //                    break;
                //                case "ZoomOut":
                //                    break;
                //                case "ZoomIn":
                //                    break;
                //                case "RotateType":
                //                    break;
                //                case "BezierType":
                //                    break;
                //                case "ComplexAnimationType": //飞出
                //                    break;
                //            }
            }
        }
        return [$(layerObjOuterStr).append(resultHTMLArray.join("")), mediaID];
    }
});
//所有动画的基类
var AnimationBaseModel = Backbone.Model.extend({});
//动画model,所有的动画都是用该model,因此某些属性可能对于某些动作是空的.
var AnimationModel = AnimationBaseModel.extend({
    defaults: {
        pid: '0',
        BelongToElementID: '', //该动作属于哪一个元素,格式:元素的pid
        actionType: '',
        name: '',
        delay: 0, //延迟时间(秒)
        repeatCount: 0, //重复次数
        duration: 1, //持续时间(秒)
        isNew: !0,
        ZoomInOut: 0, //对放大缩小动作起作用.记录倍数
        AnimationJSONData: "",
        BelongToLayerID: '',
        IsSupportMultipleFile: !0,
        pMaterialUsageID: "",
        isAlongCurve: !1, //按法线运动
        BelongToBoardID: '', //格式:board的pid
        SequenceID: 0,
        IsCanSort: !0, //当前动作是否支持排序，例如GotoPage  不支持
        IsWaitTrigger: !1, //该动作是否等待触发器执行
        ActionMethod: 1, //动作的执行方式:1:接上一个动作执行,2: 与上一个动作同时执行.
        ActionDirection: 0, //0:上方;1:下方;2:左方;3:右方;标记动作的方向,比如飞出的方向.
        //该属性只针对复合动画-------------------------开始
        ComplexHeight: "", //高度
        ComplexWidth: "", //宽度
        ComplexOpacity: "", //透明度
        ComplexFontSize: "14", //字体大小
        ComplexBackgroundColor: "red",
        ComplexLeft: "", //横向位置
        ComplexTop: "", //纵向位置
        //该属性只针对复合动画-------------------------结束
        //旋转动画使用的属性------------------------------开始
        RotateAngle: 360, //旋转角度
        RotateDirection: 0, //旋转的方向 0为X ，1为Y，2为Z
        RotateXPoint: 0, //针对旋转方向为Z轴时，让用户设定以素材上X轴的哪个点旋转，单位px。
        RotateYPoint: 0, //针对旋转方向为Z轴时，让用户设定以素材上Y轴的哪个点旋转，单位px。
        //旋转动画使用的属性------------------------------结束
        GoToPageID: "", //保存触发器要跳转到那一页,该字段记录的是ItemId
        //触发器控制音频视频播放盒暂停用到的属性--------------开始
        PlayState: "1", //1表示播放  2表示暂停
        //触发器控制音频视频播放盒暂停用到的属性--------------开始
        //触发器控制 幻灯片跳转到哪一页----------------------------------开始
        SlidSetElementTo: 0, //默认跳转到第一页,索引,从0开始,int格式,字幕切换也用到该字段
        SlidElementControl: ""//值为:prev,next,setElementTo.分别代表上一页,下一页,指定页
        //触发器控制 幻灯片跳转到哪一页----------------------------------结束
    },
    initialize: function () {
        this.set({
            "pid": _.uniqueId(),
            silent: !0,
            BelongToBoardID: ($.trim(this.attributes.BelongToBoardID)) || (Globle.CurrentBoard && Globle.CurrentBoard.get("pid"))
        });
    }
});

//资源的model
var ResourceFileModel = Backbone.Model.extend({
    defaults: {
        ID: '0',
        Name: '',
        FileType: '',
        UpdatedDate: '',
        Attention: '',
        Thumbnail: '',
        DownloadPath: ''
    },
    initialize: function () {
        //        this.set({
        //            "pid": _.uniqueId(),
        //            silent: !0
        //        });
    }
});

//model------结束

//collection ------------开始

Globle || (Globle = {});
//定义元素类型的集合
var ElementModelCollection = Backbone.Collection.extend({
    model: ElementBaseModel
});
//定义触发器的集合
var TriggerModelCollection = Backbone.Collection.extend({
    model: TriggerBaseModel
});
//定义画板类型的集合
var BoardModelCollection = Backbone.Collection.extend({
    model: ElementBaseModel
});
//定义动画类型的集合
var AnimationBaseModelCollection = Backbone.Collection.extend({
    model: AnimationBaseModel
});
//memo集合,提供添加和删除memo方法
var MemoCollectionManager = Backbone.Collection.extend({
    model: MemoBaseModel
});

//定义资源的集合
var ResourceModelCollection = Backbone.Collection.extend({
    model: ResourceFileModel,
    defaults: {
        pageNumber: 1,
        pageSize: 7
    }
});

//声明一个全局的memo集合管理者,管理所有元素的memo
//有undo,才会有redo
Globle.MemoCollectionManager = (function () {
    var MaxUnDoCount = 10;
    var MemoCollectionObjUndo = new MemoCollectionManager();
    var MemoCollectionObjRedo = new MemoCollectionManager();
    return {
        AddMemo: function (memo) {
            if (MemoCollectionObjUndo.length > 10) {
                var tempMemo = MemoCollectionObjUndo.first();
                MemoCollectionObjUndo.remove(tempMemo, { silent: true });
            }

            $("#btnUnDo").css("opacity", 1);
            $("#btnReDo").css("opacity", 0.3);
            MemoCollectionObjUndo.add(memo);
            MemoCollectionObjRedo.reset();
        },
        GetPreviousMemo: function () {
            if (MemoCollectionObjUndo.length == 0) {
                return;
            }
            $("#btnReDo").css("opacity", 1);
            var tempMemo = MemoCollectionObjUndo.last();
            MemoCollectionObjUndo.remove(tempMemo, { silent: true });
            var tempMemoClone = tempMemo.clone();
            if (MemoCollectionObjUndo.length == 0) {
                $("#btnUnDo").css("opacity", 0.3);
            }
            //如果当前不是create或者delete,那么需要想redo列表加入当前的状态
            switch (tempMemo.attributes.operateType) {
                case "Delete":
                case "Create":
                    break;

                case "Move":
                case "Resize":
                    tempMemoClone.attributes.pLeft = tempMemo.attributes.modelContent.attributes.pLeft;
                    tempMemoClone.attributes.pTop = tempMemo.attributes.modelContent.attributes.pTop;
                    tempMemoClone.attributes.pWidth = tempMemo.attributes.modelContent.attributes.pWidth;
                    tempMemoClone.attributes.pHeight = tempMemo.attributes.modelContent.attributes.pHeight;

                    tempMemoClone.attributes.pRotate = tempMemo.attributes.modelContent.attributes.pRotate;
                    tempMemoClone.attributes.pTransparent = tempMemo.attributes.modelContent.attributes.pTransparent;

                    if (tempMemo.attributes.modelContent.attributes.pType == "AdvanceArrow") {
                        tempMemoClone.attributes.pArrowStrokeWidth = tempMemo.attributes.modelContent.attributes.pArrowStrokeWidth;
                        tempMemoClone.attributes.pArrowSvgPath1 = tempMemo.attributes.modelContent.attributes.pArrowSvgPath1;
                        tempMemoClone.attributes.pArrowSvgPath2 = tempMemo.attributes.modelContent.attributes.pArrowSvgPath2;
                    }
                    break;
                default:
                    alert(GetTranslateUI('TIllegalparameter'));
                    return;
                    break;
            }
            MemoCollectionObjRedo.add(tempMemoClone);

            return tempMemo;
        },
        GetNextMemo: function () {
            if (MemoCollectionObjRedo.length == 0) {
                return;
            }
            $("#btnUnDo").css("opacity", 1);
            var tempMemo = MemoCollectionObjRedo.last();
            var tempMemoClone = tempMemo.clone();

            MemoCollectionObjRedo.remove(tempMemo, { silent: true });


            if (MemoCollectionObjRedo.length == 0) {
                $("#btnReDo").css("opacity", 0.3);
            }

            //如果当前不是create或者delete,那么需要想redo列表加入当前的状态
            switch (tempMemo.attributes.operateType) {
                case "Delete":
                case "Create":
                    break;

                case "Move":
                case "Resize":
                    tempMemoClone.attributes.pLeft = tempMemo.attributes.modelContent.attributes.pLeft;
                    tempMemoClone.attributes.pTop = tempMemo.attributes.modelContent.attributes.pTop;
                    tempMemoClone.attributes.pWidth = tempMemo.attributes.modelContent.attributes.pWidth;
                    tempMemoClone.attributes.pHeight = tempMemo.attributes.modelContent.attributes.pHeight;
                    tempMemoClone.attributes.pRotate = tempMemo.attributes.modelContent.attributes.pRotate;
                    tempMemoClone.attributes.pTransparent = tempMemo.attributes.modelContent.attributes.pTransparent;
                    if (tempMemo.attributes.modelContent.attributes.pType == "AdvanceArrow") {
                        tempMemoClone.attributes.pArrowStrokeWidth = tempMemo.attributes.modelContent.attributes.pArrowStrokeWidth;
                        tempMemoClone.attributes.pArrowSvgPath1 = tempMemo.attributes.modelContent.attributes.pArrowSvgPath1;
                        tempMemoClone.attributes.pArrowSvgPath2 = tempMemo.attributes.modelContent.attributes.pArrowSvgPath2;
                    }
                    break;
                default:
                    alert(GetTranslateUI('TIllegalparameter'));
                    return;
                    break;
            }

            MemoCollectionObjUndo.add(tempMemoClone);

            return tempMemo;
        },
        Clear: function () {
            $("#btnUnDo , #btnReDo").css("opacity", 0.3);
            MemoCollectionObjRedo.reset();
            MemoCollectionObjUndo.reset();
        },
        GetPrivateFileds: function () {
            return [MemoCollectionObjUndo, MemoCollectionObjRedo];
        }
    }
})();


Globle.ManaullyModelCollection = new ElementModelCollection();

//声明一个全局的元素集合,存储所有的元素 model,在每个元素 model里有一个属性,标记着该元素 model的父元素
Globle.AllModelCollection = new ElementModelCollection();

Globle.AllModelCollection.bind("add", function (item) {

    console.log("Globle.AllModelCollection.ListenAdd");

    switch (item.get("pType")) {
        case "layer":
            item.set({
                pElementName: GetTranslateUI('Tlayer'),
                silent: true
            });
            new LayerView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TriggerAttributePanelView({ model: item });
            break;


        case "ButtonType":
            //显示供用户操作的image
            new ButtonView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //渲染button使用的素材属性面板
            new CommonResourceAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TwoStatusTriggerAttributePanelView({ model: item });
            break;

        case "Arrow":
            //显示供用户操作的image
            new SVGView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //初始化颜色面板
            new BaseColorCommonAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TriggerAttributePanelView({ model: item });
            break;
        case "Circle":
            //显示供用户操作的image
            new SVGView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TriggerAttributePanelView({ model: item });
            break;
        case "Ellipse":
            //显示供用户操作的image
            new SVGView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TriggerAttributePanelView({ model: item });
            break;
        case "Box":
            //显示供用户操作的image
            new SVGView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TriggerAttributePanelView({ model: item });
            break;
        case "AdvanceArrow":
            //显示供用户操作的image
            new SVGView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TriggerAttributePanelView({ model: item });
            break;

        case "Image":
            //显示供用户操作的image
            new ImageView({ model: item });
            //显示image的属性面板
            new ImageAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TriggerAttributePanelView({ model: item });

            break;

        case "SVG":
            //显示供用户操作的image
            new SVGView({ model: item });
            //显示image的属性面板
            new BaseCommonAttributeView({ model: item });
            //                    //渲染动作面板
            //                    new AnimationAttributePanelView({ model: item });
            //            new BaseRotataeCommonAttributeView({ model: item });
            break;

        case "ImageSlide": //幻灯片
            //显示供用户操纵的imageSlide
            new ImageSlideView({ model: item });
            //显示image的属性面板
            new ImageSlideAttributeView({ model: item });
            //显示比如"自动播放"设置的界面
            new BaseSlidElementCommonSetPanelAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            break;

        case "ImageSequence"://序列帧
            //显示供用户操纵的imageSquence
            new ImageSequenceView({ model: item });
            //显示image Sequence的属性面板
            new ImageSequenceAttributeView({ model: item });
            break;

        case "ImageRotate"://滑动轮转
            //显示供用户操纵的imageRotate
            new ImageRotateView({ model: item });
            //显示image Rotate的属性面板
            new ImageSlideAttributeView({ model: item });
            break;

        case "RichText":
            //显示供用户操纵的RichText
            new RichTextView({ model: item });
            //显示RichText的属性面板
            new RichTextAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //渲染触发器面板
            new TriggerAttributePanelView({ model: item });
            break;

        case "BugFlag":
            //显示供用户操纵的RichText
            new BugFlagView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //显示bug的特有属性
            new BugFlagAttributeView({ model: item });
            break;

        case "WebForm":
            //显示供用户操纵的RichText
            new WebFormView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //显示WebForm的特有属性
            new WebFormAttributeView({ model: item });
            break;

        case "Audio":
            //显示供用户操作的Audio
            new AudioView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //显示视频的控制面板
            new VideoAttributeView({ model: item });
            break;

        case "Video":
            //显示供用户操作的Video
            new VideoView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });

            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });
            //显示视频的控制面板
            new VideoAttributeView({ model: item });
            break;

        case "GlStudio":
            //显示供用户操作的GlStudio
            new GlStudioView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });
            //渲染右边关联资源的面板
            new ManualMakeRelateResourceFileTemplateAttributeView({ model: item });


            break;

        case "Catia":
            //显示供用户操作的Catia
            new CatiaView({ model: item });
            //显示基本属性面板
            new BaseCommonAttributeView({ model: item });

            //渲染右边关联资源的面板
            new ManualMakeRelateResourceFileTemplateAttributeView({ model: item });

            break;

        case "Flash":
            //显示供用户操作的flash
            new FlashView({ model: item });
            break;

        case "Correct":
        case "Incorrect":
            //显示供用户操纵的Correct和Incorrect
            new RichTextView({ model: item });
            //显示RichText的属性面板
            new RichTextAttributeView({ model: item });
            //渲染动作面板
            new AnimationAttributePanelView({ model: item });
            //渲染初始属性的面板
            new InitAttributePanelView({ model: item });

            break;

        default:
            alert("未定义功能");
            break;
    }
}, this);
Globle.AllModelCollection.bind("remove", function (item) {

    console.log("AllModelCollection.remove");

    Globle.Transaction.Begin = !0;

    var temp = GetActionsByRelateElementID(null, item);
    //如果是画板引入的layer,那么需要从动作集合中,将由于引入layer而带进来的动作(该动作仅限于layer内部元素带入的动作),删除掉;
    if (item.get("pType") == "layer") {
        Globle.AnimationBaseModelCollection.where({ "BelongLayerID": item.id.toString() }).forEach(function (i) {
            temp.push(i);
        });
    }
    Globle.AnimationBaseModelCollection.remove(temp, { silent: !0 });

    var tempActionIDArray = new Array();

    //将该元素附加的动作,全部删除
    _.each(temp, function (element) {
        console.log("destroy Animation");
        tempActionIDArray.push(element.id.toString());
        element.destroy();
    });

    var lengthActionArrayID = 0;
    //将动作涉及到的触发器,更新actionIDArray字段
    Globle.TriggerModelCollection.forEach(function (item, index) {

        //       if(item.get("ControlAnimationModelArray").indexOf())
        lengthActionArrayID = item.get("ControlAnimationModelArray").length;
        item.set({
            "ControlAnimationModelArray": _.difference(item.get("ControlAnimationModelArray"), tempActionIDArray),
            silent: true
        });
        if (lengthActionArrayID != item.get("ControlAnimationModelArray").length) {
            //说明更新过actionArrayID,那么就保存该触发器
            item.save();
        }
    });

    if (Globle.LastError.hasError()) {
        Globle.LastError.ShowError();
        location.reload();
    }
    else {

        var tempTriggerModels = Globle.TriggerModelCollection.where({ "BelongToElementID": item.get("pid") });

        console.log("destroy trigger");
        Globle.TriggerModelCollection.remove(tempTriggerModels, { silent: !1 });

        if (Globle.LastError.hasError()) {
            Globle.LastError.ShowError();
            location.href = location.href;
        }
        else {
            console.log("destroy element");
            item.destroy();

            Globle.CurrentModel = null;
            //当前model被删除后,将当前画板设置为选中状态
            Globle.CurrentBoard.set({ "pUpdateAttributeView": !Globle.CurrentBoard.get("pUpdateAttributeView") });
        }
    }
    if (item.get("pType") == "layer") {
        Globle.Transaction.GoDo("delete");
    }
    else
        Globle.Transaction.GoDo("mix");
}, this);

//声明一个全局的画板集合,存储所有的画板model
Globle.BoardModelCollection = new BoardModelCollection();
Globle.BoardModelCollection.bind("add", function (item) {
    console.log("BoardModelCollection.add");
    //显示供用户操作的画板
    new BoardView({ model: item });
    //显示画板的属性面板
    new BoardAttributePanelView({ model: item });

    //页面触发器
    //渲染触发器面板
    new TriggerAttributePanelView({ model: item });

    //手工关联统一资源库的文件，以供后期数据追溯使用
    //如果是layer，那么没有该设置属性
    if (item.get("pType") == "board") {
        new ManuallyAttributePanelView({ model: item });
    }
}, this);

Globle.BoardModelCollection.bind("remove", function (item) {
    console.log("BoardModelCollection.remove");
    //要删除该层内包含的所有元素和动作,触发器等
    //不触发相应集合的remove事件,这里统一处理
    Globle.Transaction.Begin = !0;

    var elementArray = Globle.AllModelCollection.where({
        "pParentElementID": item.attributes.pid
    });
    _.each(elementArray, function (element) {
        element.destroy({ silent: !0 });
    });
    Globle.AllModelCollection.remove(elementArray, { silent: !0 });
    //删除所有动作
    var actionArray = Globle.AnimationBaseModelCollection.where({
        "BelongToBoardID": item.attributes.pid
    });
    _.each(actionArray, function (element) {
        element.destroy({ silent: !0 });
    });
    Globle.AnimationBaseModelCollection.remove(actionArray, { silent: !0 });
    //删除所有触发器
    var tempTriggerModels = Globle.TriggerModelCollection.where({ "BelongToElementID": item.attributes.pid });
    _.each(tempTriggerModels, function (element) {
        element.destroy({ silent: !0 });
    });
    Globle.TriggerModelCollection.remove(tempTriggerModels, { silent: !0 });

    Globle.Transaction.GoDo("delete");

    if (Globle.LastError.hasError()) {
        Globle.LastError.ShowError(GetTranslateUI('TDeleteerror') + "!");
        location.reload();
    }
    else {
        item.destroy();
    }
}, this);

//声明一个全局的动画集合,存储所有的动画model
Globle.AnimationBaseModelCollection = new AnimationBaseModelCollection();

//声明一个全局的触发器集合,存储所有的触发器model
Globle.TriggerModelCollection = new TriggerModelCollection();
Globle.TriggerModelCollection.bind("remove", function (model) {
    //绑定remove事件,当用户删除一个触发器时,也要把触发器从服务端删除
    model.destroy();

}, this);

//被复制的元素
Globle.CopyElement = null;
//被复制的动作
Globle.CopyAction = null;
Globle.OpenWindowParm = null;
//标记当前选中的Model
Globle.CurrentModel = null;
//标记当前选中的画板
Globle.CurrentBoard = null;
//标记当前的某个动画model
Globle.CurrentAnimationModel = null;
//一个页面只有一个该对象,因为一次只能进行一次设置,这个属性公用 
Globle.BeizerAnimation = null;
//记录当前页面内所有设置过的Bezer曲线实例,主要用于预览功能使用,注意:预览关闭时记得清空该数组
Globle.BeizerAnimationList = new Array();
//主要用于设置元素的z-index时,使用的.记得预览关闭时重置该变量,开始工作时,也要重置该变量
Globle.I = 0;
//全局只有一个editor的实例,因为用户一次只能编辑一个文字区域
//由pagedesign页面传入进来的参数,用来载入树结构
Globle.CbtUnitID = 1281;
//由pagedesign页面传入进来的参数,用在bug建立时使用
Globle.CreateByTranslation = "";
//由pageDesign页面传递的参数,用来载入树结构使用
Globle.UnitTopicID = 1657844;
//当前编辑的CbtUnit的语言id,由pagedesgin页面传入
Globle.LanguageID = 1;
//全局的开关,用来控制第一次初始化各个model 
Globle.IsInit = !1;
//记录顶部点击的是哪一个按钮
Globle.ClickType = null;
//标记是否点击过save按钮
Globle.ClickSaved = !1;
//全局只有一个资源view
Globle.ResourcePanelView = null;
//标记是否更新模式，专用于各个元素属性面板中的更新按钮。
Globle.IsUpdateModel = !1;
//对于大量的删除操作或者批量的其他需要与服务端交互的操作,要使用事务,
//使用方法全文搜索,有例子,事务只能用于删除和更新
Globle.Transaction = {
    OperateIDArray: new Array(), //要操作的id数组
    MaterialUsageIDArray: new Array(), // MaterialUsage表的id
    ActionIDArray: new Array(), // 如果是触发器,该值保存的是触发器要触发的动作的id
    ModelTypeArray: new Array(), //元素的类型,当删除的是动作时,后台需要更新触发器的actionIDArray字段
    MethodArray: new Array(),
    Begin: !1,
    IsDoing: !1,
    MixData: new Array(),
    Clear: function () {
        this.OperateIDArray = new Array();
        this.IsDoing = !1;
        this.MixData = new Array();
        this.MaterialUsageIDArray = new Array();
        this.ActionIDArray = new Array();
        this.ModelTypeArray = new Array();
        this.MethodArray = new Array();
    },
    GoDo: function (method) {
        var isSuccess = !1;
        try {
            this.Begin = !1;
            this.IsDoing = !0;
            //手动调用backbone的sync方法
            Backbone.sync(method);

            isSuccess = !0;

            if (Globle.LastError.hasError()) {
                Globle.LastError.ShowError();
                location.href = location.href;
            }
        }
        catch (e) {
            alert(GetTranslateUI('TDeletefailed') + "\r\n" + e.message);
            location.href = location.href;
        }
        finally {
            this.Clear();
        }
        return isSuccess;
    }
};
//存储临时的timeline实例.
//格式为:[元素id]=timeline实例
//点击一个元素或者画板,首先去全局timeline数组中查找.找到即可执行;如果未找到,那么新构建一个timeline的实例并存储到全局中;
Globle.ExecutingTimeLineCollection = new Array();


Globle.Editor1 = null; //是Globle.Editor 的进化版,保存ckEditor的实例
//collection-------------结束

var imgLoad = function (url, callback, context) {
    var img = new Image();

    img.src = url;
    if (img.complete) {
        callback.call(context, img.width, img.height);
    } else {
        img.onload = function () {
            callback.call(context, img.width, img.height);
            img.onload = null;
        };
    };
};

//播放
function divPlay(item, isPlayAllAction) {
    //每次播放,要重新初始化一下该数组
    Globle.ExecutingTimeLineCollection = new Array();

    console.log("debug");
    var tempResult = GetAllModelHTML();

    var tempHtmlContent = tempResult[0];
    var tempElementList = tempResult[1];

    $('#myModalPreviewAction')
    .on('show.bs.modal', function (e) {
        // do something...
        //隐藏object的div,再模态关闭时重新显示出来.因为object无法遮盖
        $("div object").parent().hide();
        $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);
        var test = Globle.CurrentBoard.toString('board');
        $("#prevewModalBody_board").empty().html(test).find("#" + Globle.CurrentBoard.get("pid") + "_preview").append(tempHtmlContent);

        //过滤一遍视频元素,初始化每个视频元素
        GetCurrentBoardAllElementsByType("Video").forEach(function (item) {
            VideoModel.CreatePlayer(item, "preview_player_" + item.get("pid"), !0);
        });
        //过滤一遍元素,初始化每个音频元素
        GetCurrentBoardAllElementsByType("Audio").forEach(function (item) {
            AudioModel.CreatePlayer(item, "preview_player_" + item.get("pid"), !0);
        });
        //增加脚本DIV开始
        $("#SectionForPreViewDiv").remove();
        $("#prevewModalBody_board").parent().parent().append(LoadExistedSectionForPreView());
        //增加脚本DIV结束
    })
    .on('shown.bs.modal', function (e) {
        //生成不等待触发器的动作

        GenerateAutoAction();
    })
    .modal("show")
    .on('hide.bs.modal', function (e) {

        $("#iframeModalHelper").css("z-index", "-11111").hide();
        $(e.currentTarget).unbind("hide.bs.modal").unbind("show.bs.modal").unbind("shown.bs.modal");


        $("div object").parent().show();
        Globle.BeizerAnimationList = new Array();
        Globle.I = 0;
        $("#prevewModalBody_board").empty();
    });
    GreenSockAnimationElementSelf(tempElementList);
}

//var tL = null;
//       
//处理元素自带的动画,比如序列帧动画,划动轮转动画
function GreenSockAnimationElementSelf() {

    _.filter(Globle.AllModelCollection.models, function (item1) {
        if ((item1.get("pParentElementID") == Globle.CurrentBoard.get("pid"))) {

            switch (item1.get("pType")) {
                case "ImageSequence":
                    var steppedEase = new SteppedEase(1);
                    var TLELementSelf = new TimelineMax({ repeat: -1 });;
                    var singleWidth = item1.get("pWidthX") / item1.get("pFrame");
                    for (var i = item1.get("pFrame") ; i > 0; i--) {
                        TLELementSelf.add(TweenMax.fromTo("#" + item1.get("pid") + "_preview", 0.1, { backgroundPosition: '-' + singleWidth * i + 'px 0px' }, { backgroundPosition: '-' + singleWidth * (i - 1) + 'px 0px', ease: steppedEase }));
                    }
                    break;

                case "ImageRotate":
                    ImageRotateFunction.call($("#" + item1.get("pid") + "_preview"));
                    break;

                default:
                    break;
            }
            return !0;
        }
        return !1;
    });
}

function ResourceTreeInit(item) {
    //            return;
    $("#" + item.id + "").jstree({
        "plugins": ["state", "types", "wholerow"],
        "core": {
            "animation": 0,
            "check_callback": true,
            'data': [
                           { "id": "ajson1", "parent": "#", "text": "S1000D数据", "state": { "opened": 1 }, "type": "S1000DType", "icon": "AnimationResource/images/S1000DType.png" },
                           { "id": "ajson2", "parent": "ajson1", "text": "DM数据", "state": { "selected": 1 }, "type": "S1000DFile", "icon": "AnimationResource/images/S1000DFile.png" },
                           { "id": "ajson3", "parent": "ajson1", "text": "S1000D数据", "type": "S1000DFile", "icon": "AnimationResource/images/S1000DFile.png" },
                           { "id": "ajson4", "parent": "#", "text": "成果物数据", "state": { "opened": 1 }, "type": "ProductType", "icon": "AnimationResource/images/ProductType.png" },
                           { "id": "ajson5", "parent": "ajson4", "text": "PPT课件", "type": "ProductFile", "icon": "AnimationResource/images/ProductFile.png" },
                           { "id": "ajson6", "parent": "ajson4", "text": "CBT课件", "type": "ProductFile", "icon": "AnimationResource/images/ProductFile.png" }
            ]
        }
    });
}
//得到当前画板所有的元素
//参数：搜索条件,搜索某一类型的元素--------------------
function GetCurrentBoardAllElementsByType(pType) {
    return Globle.AllModelCollection.where({
        "pParentElementID": Globle.CurrentBoard.get("pid"),
        "pType": pType
    })
};
//得到当前画板中不属于层中的幻灯片的model集合
function GetCurrentBoardNotLayerSlideModel(pType) {
    return Globle.AllModelCollection.where({
        "pParentElementID": Globle.CurrentBoard.get("pid"),
        "pType": pType,
        "isLayerContent": undefined
    })
};
function divEdit(event) {
    //                    //console.log(event);
    //得到当前点击的是哪一条action,
    //初始化一个相应set的view
    var action = Globle.AnimationBaseModelCollection.get(parseInt(event.attributes.actionid.value));
    if (!action) {
        alert(GetTranslateUI('TDataerrorclickontheconfirmationwillrefreshthepageMeanwhilepleasecontacttheadministrator') + ".");
        location.reload();
        return;
    }
    //一定能找到一个action
    switch (action.get("actionType")) {
        case "FlyOut":
        case "FlyIn":
        case "FadeIn":
        case "FadeOut":
        case "ZoomOut":
        case "ZoomIn":
        case "RotateType":
        case "BezierType":
        case "ZoomInOut":
            new AninamalSettingPanelView({ model: action });
            break;

        case "ComplexAnimationType":
            ForComplexAnimationModal(action);
            break;

        default:
            alert(GetTranslateUI('TIllegalOperation') + "!");
            break;
    }
}
function divDelete(event) {
    new CommonPopupModalView({
        model: new CommonMessageModal({
            title: GetTranslateUI('TWarning'),
            message: GetTranslateUI('TConfirmdeleteit') + "?",
            isShowSaveButton: !1,
            isShowCancelButton: !0,
            isShowOkButton: !0,
            ContentTemplateID: "#SureMessageModalTemplate",
            data: { "event": event, "model": this.model },
            okEventProcess: function () {
                Globle.Transaction.Begin = !0;

                var tempAction = Globle.AnimationBaseModelCollection.get(parseInt(this.get("data").event.attributes["actionID"].value));

                //也要删除触发器中已设置的动作id
                Globle.TriggerModelCollection.where({ "BelongToBoardID": Globle.CurrentBoard.get("pid") }).forEach(function (item) {
                    item.set({
                        ControlAnimationModelArray: _.without(item.get("ControlAnimationModelArray"), (tempAction.id.toString())),
                        silent: !0
                    }).save();
                });

                if (Globle.LastError.hasError())
                    Globle.LastError.ShowError();

                tempAction.destroy({ wait: !0, silent: !0 });

                Globle.Transaction.GoDo("mix");

                Globle.AnimationBaseModelCollection.remove(tempAction);
            }
        })
    }).showModal();
}
//预览当前页面所有元素的所有动作
function PreviewCurrentPageALLAction() {
    divPlay('', !0);
}

//task5678注释的功能代码
var imgLoad = function (url, callback, context) {
    var img = new Image();

    img.src = url;
    if (img.complete) {
        callback.call(context, img.width, img.height);
    } else {
        img.onload = function () {
            callback.call(context, img.width, img.height);
            img.onload = null;
        };
    };
};
