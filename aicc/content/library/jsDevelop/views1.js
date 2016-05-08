//这是view.js的补充js,因为view.js文件太大
//这个js里填写的view,不需要在最终生成模板时使用.因此这里编制的view,都是编辑时使用的view
$(function () {
    //自定义一个公共弹出框的view,model为要显示的内容.
    //model要求:
    //1. 有控制三个按钮是否显示的属性
    //2. 具有title属性,显示在模态的标题栏.
    //3. ContentTemplateID属性,模态内容里显示的内容的模板id
    CommonPopupModalView = Backbone.View.extend({
        el: $("body"),
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_CommonModelPanel1 .btnCommonModalSave";
            obj[key] = 'btnCommonModalSave';

            key = 'click #' + this.model.get('pid') + "_CommonModelPanel1 .btnCommonModalCancel";
            obj[key] = 'btnCommonModalCancel';

            key = 'click #' + this.model.get('pid') + "_CommonModelPanel1 .btnCommonModalOk";
            obj[key] = 'btnCommonModalOk';

            this.unBindPreEvent(obj);

            return obj;
        },
        unBindPreEvent: function (t) {
            var eventSplitter = /\s+/;
            var names;
            for (var i in t) {
                names = i.split(eventSplitter);
                $("body").off(names[0], (names[1] + " " + names[2]));
            };
        },
        showModal: function (afterCallBack, css) { //将弹出框显示出来

            var title = GetTranslateUI('TSet');
            var message = $("#CommonTemplate1").html();

            title = this.model.get("title");
            message = message.replace("contentBodyHoldPlace", $(this.model.get("ContentTemplateID")).html());;

            message = _.template(message)(this.model.toJSON());

            var tempCss = {
                top: "10%",
                width: "30%",
                left: "30%"
            };

            tempCss = $.extend(tempCss, css);

            $.blockUI({
                title: title,
                theme: !0,
                themedCSS: tempCss,
                focusInput: !1,
                message: message
            });
            afterCallBack && afterCallBack(this.model);
        },
        btnCommonModalSave: function () {
            this.ColseModal();
            switch (this.model.get("pType")) {
                case "clickTrigger":
                case "afterClickTrigger":
                case "beforeClickTrigger":
                    this.ProcessClickTrigger();
                    break;

                default:
                    break;
            };
            _.isFunction(this.model.get("saveEventProcess")) && this.model.get("saveEventProcess").call(this.model);
        },
        btnCommonModalCancel: function () {
            console.log("Cancel");
            this.ColseModal();
            _.isFunction(this.model.get("cancelEventProcess")) && this.model.get("cancelEventProcess").call(this.model);
        },
        btnCommonModalOk: function () {
            console.log("Ok");
            this.ColseModal();
            _.isFunction(this.model.get("okEventProcess")) && this.model.get("okEventProcess").call(this.model);
        },
        ColseModal: function () {
            console.log("ColseModal");
            $.unblockUI();
        },
        ClearPreviousAnimation: function () {//删除上一次设置的动作(这些动作与触发器时复合关系)
            var animationArrayID = this.model.get("ControlAnimationModelArray");
            var animationModelDelete = _.filter(Globle.AnimationBaseModelCollection.models, function (item) {
                if (animationArrayID.indexOf(item.id.toString()) >= 0) {
                    if ((item.get("actionType") == "GoToPage")
                    || (item.get("actionType") == "PlayControl")
                    || (item.get("actionType") == "SlideControl")
                    || (item.get("actionType") == "ChangeSection")) {
                        return true;
                    }
                }
                return false;
            });

            if (animationModelDelete.length > 0) {
                Globle.Transaction.Begin = !0;
                _.each(animationModelDelete, function (item) {
                    item.destroy();
                });
                Globle.Transaction.GoDo("delete");

                if (Globle.LastError.hasError())
                    Globle.LastError.showError(GetTranslateUI('TDeletemodelerrorpleaserecordthestepscontacttheadministrator') + ".");
            }
        },
        ProcessClickTrigger: function () {
            var typeId = $("#selTriggerType").val();
            //触发器控制普通动画（例如飞入、飞出等）
            if (typeId == "0") {
                if (!this.model.isNew()) {
                    this.ClearPreviousAnimation();
                }
                //根据用户选择,将该model持久化到服务端,
                //持久化成功后,将触发器model加入到collection                    
                var tempCollection = new Array();
                //清空之后,重新加入
                //更新动作的顺序
                var tempAnimationObj = null;

                _.each($("#settedAnimationPanelDiv").find("li"), function (item) {
                    tempCollection.push("" + parseInt(item.attributes.id.value) + "");
                });

                //如果没有添加任何动作,那么不添加触发器
                if (tempCollection.length == 0) {
                    alert(GetTranslateUI('TThetriggerdoesnotaddanyaction'));
                    if (!this.model.isNew()) {
                        this.model.destroy();
                        this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                    }
                    return false;
                }
                this.model.set({
                    ControlAnimationModelArray: tempCollection,
                    silent: false
                }).save();

                if (Globle.LastError.hasError())
                    Globle.LastError.showError();
                else {
                    //将TriggerModel加入到TriggerModelCollection
                    //如果加入过,就不用再次加入
                    if (!Globle.TriggerModelCollection.get(this.model.id)) {
                        Globle.TriggerModelCollection.add(this.model);
                    }
                    this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                }

            }
                //触发器控制的是GoToPage
            else if (typeId == "1") {
                var createGoToPageModel = function () {
                    //新建goToPage
                    var tempBelongToElementID = (function () {
                        if (Globle.CurrentModel) {
                            return Globle.CurrentModel.get("pid");
                        }
                        else {
                            //说明是为画板添加触发器
                            return Globle.CurrentBoard.get("pid");
                        }
                    })();
                    AnimationModelObj = new AnimationModel({
                        actionType: "GoToPage",
                        BelongToBoardID: Globle.CurrentBoard.get("pid"),
                        BelongToElementID: tempBelongToElementID,
                        GoToPageID: gotoPageID,
                        pMaterialUsageID: new Array(),
                        IsWaitTrigger: !0,
                        IsCanSort: false
                    });
                    AnimationModelObj.save();

                    if (Globle.LastError.hasError())
                        Globle.LastError.showError();
                    else {
                        Globle.AnimationBaseModelCollection.add(AnimationModelObj, { silent: true });
                        tempCollection.push("" + parseInt(AnimationModelObj.id) + "");
                        this.model.set({
                            ControlAnimationModelArray: tempCollection,
                            silent: false
                        }).save();

                        if (Globle.LastError.hasError())
                            Globle.LastError.showError();
                        else {
                            //将TriggerModel加入到TriggerModelCollection
                            //如果加入过, 就不用再次加入
                            if (!Globle.TriggerModelCollection.get(this.model.id)) {
                                Globle.TriggerModelCollection.add(this.model);
                            }
                            this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                        }
                    }
                };
                if (!this.model.isNew()) {
                    this.ClearPreviousAnimation();
                }
                //说明是gotopage
                var tempCollection = new Array();
                var gotoPageID = $("#selGoToPage").val();

                //首先搜索是否已经存在该gotopage
                var AnimationModelObj = null;
                if (this.model.isNew()) {
                    createGoToPageModel.call(this);
                }
                else {
                    createGoToPageModel.call(this);
                }
            }
                //视频音频播放控制
            else if (typeId == "2") {
                var createPlayControlModel = function () {
                    //说明一定是新建PlayControl
                    for (var i = 0; i < arrTemp.length; i++) {
                        var AnimationModelPlayControlObj = null;
                        AnimationModelPlayControlObj = new AnimationModel({
                            actionType: "PlayControl",
                            BelongToBoardID: Globle.CurrentBoard.get("pid"),
                            BelongToElementID: arrTemp[i].elePId,
                            IsWaitTrigger: !0,
                            IsCanSort: false,
                            ActionMethod: "2",
                            PlayState: arrTemp[i].playState
                        });
                        AnimationModelPlayControlObj.save();
                        if (Globle.LastError.hasError()) {
                            Globle.LastError.showError();
                        }
                        else {
                            Globle.AnimationBaseModelCollection.add(AnimationModelPlayControlObj, { silent: true });
                            tempCollection.push("" + parseInt(AnimationModelPlayControlObj.id) + "");
                        }
                    }
                    //                    AnimationModelPlayControlObj = new AnimationModel({
                    //                        actionType: "PlayControl",
                    //                        BelongToBoardID: Globle.CurrentBoard.get("pid"),
                    //                        BelongToElementID: elementPId,
                    //                        IsWaitTrigger: !0,
                    //                        IsCanSort: false,
                    //                        PlayState: animationPlayState
                    //                    });
                    //                    AnimationModelPlayControlObj.save();
                    if (Globle.LastError.hasError())
                        Globle.LastError.showError();
                    else {
                        //                        Globle.AnimationBaseModelCollection.add(AnimationModelPlayControlObj, { silent: true });
                        //                        tempCollection.push("" + parseInt(AnimationModelPlayControlObj.id) + "");
                        //如果没有添加任何动作,那么不添加触发器
                        if (tempCollection.length == 0) {
                            alert(GetTranslateUI('TThetriggerdoesnotaddanyaction'));
                            if (!this.model.isNew()) {
                                this.model.destroy();
                                this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                            }
                            return false;
                        }
                        this.model.set({
                            ControlAnimationModelArray: tempCollection,
                            silent: false
                        }).save();
                        if (Globle.LastError.hasError())
                            Globle.LastError.showError();
                        else {
                            //将TriggerModel加入到TriggerModelCollection
                            //如果加入过, 就不用再次加入
                            if (!Globle.TriggerModelCollection.get(this.model.id)) {
                                Globle.TriggerModelCollection.add(this.model);
                            }
                            this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                        }
                    }
                };
                if (!this.model.isNew()) {
                    this.ClearPreviousAnimation();
                }
                //说明是PlayControl
                var tempCollection = new Array();
                var arrTemp = new Array();
                var elementCheckedArr = $(".radioPlayName:checked");
                for (var i = 0; i < elementCheckedArr.length; i++) {
                    var arr = {
                        "elePId": $(elementCheckedArr[i]).siblings(".hidAnimationPid").val(),
                        "playState": $(elementCheckedArr[i]).siblings("span").find(".radioPlayState:checked").next("label").next(".hidPlayState").val()
                    };
                    arrTemp.push(arr);
                }
                //                var elementPId = $(".radioPlayName:checked").siblings(".hidAnimationPid").val();
                //                var animationPlayState = $(".radioPlayState:checked").siblings(".hidPlayState").val();
                //                var AnimationModelPlayControlObj = null;
                createPlayControlModel.call(this);
            }
                //幻灯片指定播放页面
            else if (typeId == "3") {
                console.log(GetTranslateUI('TSavedesignatedslide'));
                //处理逻辑:
                //1. 如果当前触发器已经存在,那么直接将触发器已关联的动作(目前只限于gotoPage,PlayControl,SlideControl)删除;
                //2. 将用户选择的幻灯片控制行为,依次保存到数据库中,每个幻灯片是个独立的数据,并加入到全局集合中;
                //3. 将保存过的动作,依次加入到当前触发器的ControlAnimationModelArray;
                //4. 保存当前触发器.并加入到全局集合中.
                if (!this.model.isNew()) {
                    this.ClearPreviousAnimation();
                }
                //处理用户选择的幻灯片
                //如果用户没有选择"上一页,下一页,指定页"等,那么就当做没有选择该幻灯片;
                //如果用户没勾选幻灯片,那么就当做没有选择幻灯片;
                //如果用户一个都没有勾选,那么提示用户"未勾选幻灯片",关闭该模态.return false;
                //如果用户勾选幻灯片,但是一个幻灯片都没有指定操作方式,那么提示用户"某设置幻灯片操作方式",关闭模态,return false;
                if ($(":checked", "#divSlidElementControl").not("option,[type='radio']").length == 0) {
                    alert(GetTranslateUI('TYoudidnotselectanyslide') + ".");
                    this.model.destroy();
                    this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                    return false;
                }
                var animationArrayID = new Array();
                _.each($(":checked", "#divSlidElementControl").not("option,[type='radio']"), function (item) {
                    item = $(item);
                    var tempFilter = item.parents("li").find("[type=radio]").filter(":checked");
                    var SlidElementControlTemp = tempFilter.attr("pname");
                    var SlidSetElementTo = 0;
                    if (SlidElementControlTemp == "setElementTo") {
                        SlidSetElementTo = tempFilter.parent().children("select").val();
                    }

                    if (SlidElementControlTemp) {
                        var AnimationTempSlidControlObj = null;
                        AnimationTempSlidControlObj = new AnimationModel({
                            actionType: "SlideControl",
                            BelongToBoardID: Globle.CurrentBoard.get("pid"),
                            BelongToElementID: parseInt(item.attr("id")) + Globle.VariableSuffix,
                            IsWaitTrigger: !0,
                            IsCanSort: false,
                            ActionMethod: "2",
                            SlidElementControl: SlidElementControlTemp,
                            SlidSetElementTo: SlidSetElementTo
                        });
                        AnimationTempSlidControlObj.save();

                        if (Globle.LastError.hasError()) {
                            Globle.LastError.showError();
                        }
                        else {
                            Globle.AnimationBaseModelCollection.add(AnimationTempSlidControlObj, { silent: true });
                            animationArrayID.push(AnimationTempSlidControlObj.id);
                        }
                    }
                });

                //保存触发器
                this.model.set({
                    ControlAnimationModelArray: animationArrayID,
                    silent: false
                }).save();
                if (Globle.LastError.hasError())
                    Globle.LastError.showError();
                else {
                    //将TriggerModel加入到TriggerModelCollection
                    //如果加入过, 就不用再次加入
                    if (!Globle.TriggerModelCollection.get(this.model.id)) {
                        Globle.TriggerModelCollection.add(this.model);
                    }
                    this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                }
            }
                //字幕切换设置
            else if (typeId == "4") {
                console.log(GetTranslateUI('TSavedesignatedsubtitles'));
                //处理逻辑:
                //1. 如果当前触发器已经存在,那么直接将触发器已关联的动作删除;
                //2. 将用户选择的字幕控制行为,保存到数据库中,并加入到全局集合中;
                //3. 将保存过的动作,依次加入到当前触发器的ControlAnimationModelArray;
                //4. 保存当前触发器.并加入到全局集合中.
                if (!this.model.isNew()) {
                    this.ClearPreviousAnimation();
                }
                //处理用户选择的字幕
                //如果用户没勾选幻灯片,那么就当做没有选择幻灯片;
                //如果用户一个都没有勾选,那么提示用户"未勾选字幕",关闭该模态.return false;
                if ($(":checked", "#divChangeSectionControl").length == 0) {
                    alert(GetTranslateUI('TYoudidnotselectanysubtitle') + ".");
                    this.model.destroy();
                    this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                    return false;
                }
                var animationArrayID = new Array();
                var tempBelongToElementID = (function () {
                    if (Globle.CurrentModel) {
                        return Globle.CurrentModel.get("pid");
                    }
                    else {
                        //说明是为画板添加触发器
                        return Globle.CurrentBoard.get("pid");
                    }
                })();
                _.each($(":checked", "#divChangeSectionControl"), function (item) {
                    item = $(item);
                    var SlidSetElementTo = 0;
                    SlidSetElementTo = parseInt(item.attr("index")) + parseInt(item.attr("index"));

                    var AnimationTempChangeSectionControlObj = null;
                    AnimationTempChangeSectionControlObj = new AnimationModel({
                        actionType: "ChangeSection",
                        BelongToBoardID: Globle.CurrentBoard.get("pid"),
                        BelongToElementID: tempBelongToElementID,
                        IsWaitTrigger: !0,
                        IsCanSort: false,
                        ActionMethod: "2",
                        SlidSetElementTo: SlidSetElementTo
                    });
                    AnimationTempChangeSectionControlObj.save();

                    if (Globle.LastError.hasError()) {
                        Globle.LastError.showError();
                    }
                    else {
                        Globle.AnimationBaseModelCollection.add(AnimationTempChangeSectionControlObj, { silent: true });
                        animationArrayID.push(AnimationTempChangeSectionControlObj.id);
                    }

                });

                //保存触发器
                this.model.set({
                    ControlAnimationModelArray: animationArrayID,
                    silent: false
                }).save();
                if (Globle.LastError.hasError())
                    Globle.LastError.showError();
                else {
                    //将TriggerModel加入到TriggerModelCollection
                    //如果加入过, 就不用再次加入
                    if (!Globle.TriggerModelCollection.get(this.model.id)) {
                        Globle.TriggerModelCollection.add(this.model);
                    }
                    this.model.get("data").set({ "pUpdateTriggerView": !this.model.get("data").get("pUpdateTriggerView") });
                }
            }
        }
    });

    //重写backbone的同步方式
    //    Backbone.emulateJSON = true
    Backbone.sync = function (method, model, options) {
        console.log("sync  " + method + "   " + (model && model.id) + (Globle.Transaction.Begin ? " ---in Transaction" : " ---not in Transaction"));

        if (Globle.Transaction.Begin) {
            Globle.Transaction.OperateIDArray.push(model.id);
            Globle.Transaction.ModelTypeArray.push(model.get("pType") || model.get("actionType") || "lajiData");

            var tempMaterialUsageID = ElementBaseModel.GetMaterialUsageIDArray(model);

            if (tempMaterialUsageID) {
                Globle.Transaction.MaterialUsageIDArray.push("_|*_*|_" + tempMaterialUsageID);
            }
            else
                Globle.Transaction.MaterialUsageIDArray.push("_|*_*|_lajiData");
            //事务可能包含要更新的触发器,也就是ControlAnimationModelArray属性
            if (model && ((model.get("pType") == "clickTrigger") || (model.get("pType") == "beforeClickTrigger") || (model.get("pType") == "afterClickTrigger"))) {
                Globle.Transaction.ActionIDArray.push("_|*_*|_" + model.attributes.ControlAnimationModelArray.join());
            }
            else
                Globle.Transaction.ActionIDArray.push("_|*_*|_lajiData");
            Globle.Transaction.MethodArray.push(method);
            Globle.Transaction.MixData.push('_|*_*|_' + JSON.stringify(model.toJSON()));
        }
        else {

            console.log(Globle.Transaction.IsDoing && "Doing Translation");

            var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");

            $.ajax({
                method: "post",
                async: false,
                url: trueLocation,
                data: {
                    "actionType": "SaveModel",
                    "cbtUnitID": Globle.CbtUnitID,
                    "method": (function () {
                        if (!model) return method;
                        if (model.get("ImageInsert") == !0) {
                            return "create";
                        }
                        return method;
                    })(),
                    "UnitItemPageContentID": Globle.Transaction.IsDoing ? Globle.Transaction.OperateIDArray.toString() : model.id,
                    "UnitItemID": parseInt($.jstree.reference("#jstree_demo").get_selected()[0]),
                    "model": encodeURIComponent(method == "mix" ? Globle.Transaction.MixData.toString() : (method == "delete" ? "" : JSON.stringify(model.toJSON()))), //如果是delete,那么不需要传递该字段
                    "pType": ((method == "mix")) ? "" : (model && (model.get("pType") || model.get("actionType")) || ""), //如果pType为空,说明是动作类型,那就保存actionType
                    "IsOperateElementModel": (model && ((model.get("pType") == "clickTrigger"))) ? !1 : (Boolean(model && model.get("pType"))), //标记当前操作的实体,是动作类型还是元素类型,因为这个涉及到新建元素时的业务逻辑
                    "Prefix": Globle.VariableSuffix,
                    "IsUpdateResource": Globle.IsUpdateModel,
                    "CreateByTranslation": encodeURIComponent(Globle.CreateByTranslation),
                    "FileIDArray": ElementBaseModel.GetFileIDArray(model),
                    "ExtendFileIDArray": ElementBaseModel.GetExtendFileIDArray(model),
                    "FileResourceTypeArray": ElementBaseModel.GetFileResourceTypeArray(model),
                    "FileUrlArray": ElementBaseModel.GetFileUrlArray(model),
                    "FileThumbnailUrlArray": ElementBaseModel.GetFileThumbnailUrlArray(model),
                    "FileNameArray": encodeURIComponent(ElementBaseModel.GetFileNameArray(model)),
                    "FileVersionArray": ElementBaseModel.GetFileVersionArray(model),
                    "MaterialUsageIDArray": Globle.Transaction.IsDoing ? Globle.Transaction.MaterialUsageIDArray.join("").toString() : ElementBaseModel.GetMaterialUsageIDArray(model),
                    "CurrentImageIndex": (model && model.get("CurrentImageIndex")) >= 0 ? model.get("CurrentImageIndex") : "-1",
                    "deleteSubImageIDArray": model && model.get("deleteSubImageIDArray") && model.get("deleteSubImageIDArray").toString(),
                    "ImageInsert": (model && model.get("ImageInsert")) ? model.get("ImageInsert") : false,
                    "BelongToBoardID": parseInt(model && (model.attributes.BelongToBoardID || model.attributes.pParentElementID) || -1), //元素,动作,触发器都有此属性
                    "BelongToElementID": parseInt(model && (model.attributes.BelongToElementID) || -1), //动作和触发器有此属性,
                    "PlayControlID": parseInt(model && (model.attributes.BelongToElementID) || -1),
                    "goToPageID": parseInt(model && (model.attributes.GoToPageID) || -1), //如果保存的是gotopage动作,那么有用
                    "ActionIDArray": Globle.Transaction.IsDoing ? Globle.Transaction.ActionIDArray.join("").toString() : (model && ((model.get("pType") == "clickTrigger") || (model.get("pType") == "beforeClickTrigger") || (model.get("pType") == "afterClickTrigger")) && (model.attributes.ControlAnimationModelArray.join()) || "-1"), //触发器有此属性
                    "ModelTypeArray": Globle.Transaction.IsDoing ? Globle.Transaction.ModelTypeArray.toString() : "",
                    "MethodArray": Globle.Transaction.IsDoing ? Globle.Transaction.MethodArray.toString() : "",
                    "IsDeleteResource": model && model.IsDeleteResource || 'false', //对当个元素的素材,操作"删除按钮"使用
                    "CurrentBoardType": Globle.CurrentBoard.get("pType"), //标记当前画板的类型,用于:在层中添加元素时,要把元素的UnitItem置为null使用;
                    "RelateIpaFullPath": model && model.get("RelateIpaFullPath") || ""//针对glstudio元素,需要单独设置ipa地址
                },
                success: function (data) {

                    if (data.result == "error") {
                        Globle.LastError.setError({ errorID: 1001, errorMessage: data.message });
                        //                    alert("网络繁忙,请稍后再试!\r" + data.message);
                    }

                    else {
                        Globle.LastError.setError();
                        if (!Globle.Transaction.IsDoing) {
                            model.id = data.UnitItemPageContentID;
                            if (method == "create" || method == "update") {
                                ElementBaseModel.UpdateIDArray((function () {
                                    if (model.get("ImageInsert") == !0) {
                                        return "create";
                                    }
                                    return method;
                                })(),
                                 model,
                                 data);
                            }
                        }
                        $('.blockOverlay').attr('title', GetTranslateUI('TSuccessfullysaved') + "！");
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
                    $.blockUI({ message: GetTranslateUI('TBackgroundSavingpleasewait') + "..." });
                }
            });
        }
    };

    //手工关联文件右边属性面板的view
    ManuallyAttributePanelView = Backbone.View.extend({
        el: function () {
            return $('#currentPageInfo');
        },
        generateTemplate: function () {
            return _.template($('#ManuallyResourceTemplate').html());
        },
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_addManuallyResoucre";
            obj[key] = '_addManuallyResoucre';

            key = 'click #' + this.model.get('pid') + "_ManuallyResourceTemplate .glyphicon-remove";
            obj[key] = 'glyphiconremoveClick';

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.model.on("change:pUpdateManuallyResourceView", this.pUpdateManuallyResourceView, this);
            this.render();
        },
        render: function () {
            console.log("ManuallyAttributePanelView render");
            if (Globle.IsInit) return;

            $("#ManuallyAttributePanelViewHoldPlaceDivForCurrentPageInfo")
            .empty()
            .append(this.template(this.model.toJSON()));

            return this;
        },
        pUpdateManuallyResourceView: function () {
            this.render();
        },
        glyphiconremoveClick: function (event) {
            console.log("glyphiconremoveClick");

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
                        //                    alert("ok");
                        console.log(parseInt($(this.get("data").event.target).attr("ID")));

                        var manuallyResourceObj = Globle.ManaullyModelCollection.get(parseInt($(this.get("data").event.target).attr("ID")));

                        manuallyResourceObj.destroy();

                        if (Globle.LastError.hasError()) {
                            Globle.LastError.showError(GetTranslateUI('TDeletemodelerrorpleaserecordthestepscontacttheadministrator') + ".");
                            return;
                        }
                        Globle.ManaullyModelCollection.remove(manuallyResourceObj);

                        if (Globle.LastError.hasError()) {
                            //说明有错误
                            Globle.LastError.ShowError(GetTranslateUI('TNetworkerrornotdeletedsuccessfully') + "!");
                        } else {
                            this.get("data").model.set({ "pUpdateManuallyResourceView": !this.get("data").model.get("pUpdateManuallyResourceView") });
                        }
                    }
                })
            }).showModal(null
            , {
                width: "400px",
                left: "40%"
            });
        },
        _addManuallyResoucre: function () {
            //打开资源库，供用户选择
            Globle.ClickType = "ManuallySelectResoure";
            ResourceViewInstance.ShowResourceViewPanel(100);
        },
        ShowPopupModal: function (model, isNew) {

        }
    });

    //触发器右边属性面板的view
    TriggerAttributePanelView = Backbone.View.extend({
        el: function () {
            switch (this.model.get("pType")) {
                case "board":
                    return $('#currentPageInfo');
                    break;

                case "layer":
                    //当layer是作为元素插入时,仍然返回elementInfo
                    if (Globle.CurrentBoard && Globle.CurrentBoard.get("pType") == "layer")
                        return $('#currentPageInfo');
                    else if (Globle.IsInit && this.model.get("pParentElementID") == "inactionArea")//载入层,初始化时,使用
                        return $('#currentPageInfo');
                    else if (this.model.get("pParentElementID") != "inactionArea")//说明是画板中的层
                        return $('#elementInfo')
                    else
                        return $('#elementInfo')
                    break;

                default:
                    return $('#elementInfo');
                    break;
            }
        },
        generateTemplate: function () {
            return _.template($('#TriggerTemplate').html());
        },
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_TriggerTemplate ._addClickTrigger";
            obj[key] = '_addClickTrigger';

            key = 'click #' + this.model.get('pid') + "_TriggerTemplate .glyphicon-remove";
            obj[key] = 'glyphiconremoveClick';

            key = 'click #' + this.model.get('pid') + "_TriggerTemplate .glyphicon-pencil";
            obj[key] = 'glyphiconpencilClick';

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.model.on("change:pUpdateTriggerView", this.pUpdateTriggerView, this);
            this.render();
        },
        render: function () {
            console.log("TriggerAttributePanelView render");
            if (Globle.IsInit) return;
            //            debugger;
            //            $(".attributeHoldPlace").empty();
            switch (this.$el.attr("id")) {
                case "currentPageInfo":
                    $("#TriggerAttributePanelViewHoldPlaceDivForCurrentPageInfo").empty()
                    .append(this.template(this.model.toJSON()));
                    break;

                case "elementInfo":
                    $("#TriggerAttributePanelViewHoldPlaceDiv").empty()
                    .append(this.template(this.model.toJSON()));
                    break;
            }
            return this;
        },
        pUpdateTriggerView: function () {
            this.render();
        },
        glyphiconremoveClick: function (event) {
            console.log("glyphiconremoveClick");

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
                        //                    alert("ok");
                        console.log(parseInt($(this.get("data").event.target).attr("triggerID")));
                        var TiggerControlAnimationPIDArr = Globle.TriggerModelCollection.get(parseInt($(this.get("data").event.target).attr("triggerID"))).get("ControlAnimationModelArray");
                        if (TiggerControlAnimationPIDArr.length != 0) {
                            var animationModelDelete = _.filter(Globle.AnimationBaseModelCollection.models, function (item) {
                                if (TiggerControlAnimationPIDArr.indexOf(item.id.toString()) >= 0) {
                                    if ((item.get("actionType") == "GoToPage")
                                    || (item.get("actionType") == "PlayControl")
                                     || (item.get("actionType") == "SlideControl")
                                      || (item.get("actionType") == "ChangeSection")) {
                                        return true;
                                    }
                                }
                                return false;
                            });

                            if (animationModelDelete.length > 0) {
                                Globle.Transaction.Begin = !0;
                                _.each(animationModelDelete, function (item) {
                                    item.destroy();
                                });
                                Globle.Transaction.GoDo("delete");

                                if (Globle.LastError.hasError())
                                    Globle.LastError.showError(GetTranslateUI('TDeletemodelerrorpleaserecordthestepscontacttheadministrator') + ".");
                            }
                        }
                        Globle.TriggerModelCollection.remove(Globle.TriggerModelCollection.get(parseInt($(this.get("data").event.target).attr("triggerID"))));
                        if (Globle.LastError.hasError()) {
                            //说明有错误
                            Globle.LastError.ShowError(GetTranslateUI('TNetworkerrornotdeletedsuccessfully') + "!");
                        } else {
                            this.get("data").model.set({ "pUpdateTriggerView": !this.get("data").model.get("pUpdateTriggerView") });
                        }
                    }
                })
            }).showModal(null
            , {
                width: "400px",
                left: "40%"
            });

        },
        glyphiconpencilClick: function (event) {
            console.log("glyphiconpencilClick");
            //找到model,让用户重新设置
            var tempModel = Globle.TriggerModelCollection.get(parseInt($(event.target).attr("triggerID")));
            tempModel.set({
                "data": this.model,
                silent: !0
            });

            this.ShowPopupModal(tempModel, false);
        },
        _addClickTrigger: function () {

            //            if ($(".triggerClick", "#" + this.model.get('pid') + "_TriggerTemplate")[0]) {
            //                this.glyphiconpencilClick({
            //                    target: $(".triggerClick", "#" + this.model.get('pid') + "_TriggerTemplate")[0]
            //                });
            //                return;
            //            };

            var TriggerModelObj = new TriggerModel({
                isShowOkButton: !1,
                isShowCancelButton: !0,
                isShowSaveButton: !0,
                pType: "clickTrigger",
                BelongToBoardID: Globle.CurrentBoard.get("pid"),
                BelongToElementID: (function () {
                    switch (this.model.get("pType")) {
                        case "board":
                        case "layer":
                            //如果当前画板的类型是board,那么说明:这时编辑的触发器实际是层使用时的触发器,也就是说,要返回当前layer元素的pid
                            if (Globle.CurrentBoard.get("pType") == "board") {
                                if (Globle.CurrentModel == null) {
                                    //说明当前点击的是画板,然后往画板插入触发器
                                    return Globle.CurrentBoard.get("pid");
                                }
                                return Globle.CurrentModel.get("pid");
                            }
                            else
                                return Globle.CurrentBoard.get("pid");
                            break;

                        default:
                            return Globle.CurrentModel.get("pid");
                            break;
                    }
                }).call(this),
                ContentTemplateID: "#TriggerSetParameterTemplate",
                silent: !0,
                title: GetTranslateUI('TTriggerparametersettings'),
                data: this.model
            });
            this.ShowPopupModal(TriggerModelObj, true);
        },
        ShowPopupModal: function (model, isNew) {
            new CommonPopupModalView({ model: model }).showModal(function (m) {
                if (!isNew) {
                    var tempModel = m;
                    var animationArrayID = tempModel.get("ControlAnimationModelArray");
                    var animationModel = Globle.AnimationBaseModelCollection.get(animationArrayID[0]);
                    if (animationModel.get("actionType") == "GoToPage") {
                        $("#selTriggerType option[value='1']").attr("selected", "selected");
                        selectChangeType("1", animationModel.get("GoToPageID"));
                    }
                    else if (animationModel.get("actionType") == "PlayControl") {
                        $("#selTriggerType option[value='2']").attr("selected", "selected");
                        selectChangeType("2");
                    }
                    else if (animationModel.get("actionType") == "SlideControl") {
                        $("#selTriggerType option[value='3']").attr("selected", "selected");
                        selectChangeType("3");
                    }
                    else if (animationModel.get("actionType") == "ChangeSection") {
                        $("#selTriggerType option[value='4']").attr("selected", "selected");
                        selectChangeType("4");
                    }
                        //                    var isCanSort = (animationModel && animationModel.get("IsCanSort"));
                        //                    if (!isCanSort && (isCanSort != undefined)) {

                        //                        //                        var gotoPageID = animationModel.get("GoToPageID");

                        //                    }
                    else {
                        $("#selTriggerType option[value='0']").attr("selected", "selected");
                    }
                }
                else {
                    $(":checked", "#divSlidElementControl").not("option").prop("checked", false);
                }
                InitSorted1("#settedAnimationPanelDiv", function (event, ui) {
                    var i = -1;
                    ui.item.parent().children().each(function () {
                        this.attributes['SequenceID'].value = (++i);
                    });
                });
                //隔行变色
                $("#divTrigger li:even").addClass("one");
                $("#divTrigger li:odd").addClass("two");
            }
            , {
                left: "40%",
                width: "350px",
                height: "600px"
            });
        }
    });

    //初始设置view
    InitAttributePanelView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#InitTemplate').html());
        },
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_InitTemplate .radio";
            obj[key] = 'clickRadio';
            return obj;
        },
        initialize: function () {
            console.log("initialize");
            this.template = this.generateTemplate();
            this.model.on("change:pUpdateInitView", this.pUpdateInitView, this);
            this.render();
        },
        clickRadio: function (event) {
            console.log(this.model.get("pid") + "clickRadio");
            this.model.set({
                silent: !0,
                "pInitControlVisible": $(event.currentTarget).find("input[type='radio']").val()
            });
            this.model.save();
        },
        render: function () {
            console.log("InitAttributePanelView render");
            if (Globle.IsInit) return;
            $("#InitHoldPlaceDiv").empty().append(this.template(this.model.toJSON()));
            this.SetDataValue();
            return this;
        },
        pUpdateInitView: function () {
            this.render();
        },
        SetDataValue: function () {
            //更新选中值
            if (this.model.get("pInitControlVisible") == "2") {
                $("#optionsRadios1Show").removeAttr("checked");
                $("#optionsRadios2Hide").attr("checked", !0);
            }
            else {
                $("#optionsRadios1Show").attr("checked", !0);
                $("#optionsRadios2Hide").removeAttr("checked");
            }
        }
    });

    //动作参数设置的view
    AninamalSettingPanelView = Backbone.View.extend({
        el: $('#modelPanel'),
        generateTemplate: function () {
            return _.template($('#flyoutsetpanelTemplate').html());
        },
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_flyOutPanel .btnFlyOutModalSave";
            obj[key] = 'ClickSave';

            key = 'click #' + this.model.get('pid') + "_flyOutPanel .btnFlyOutModalClose";
            obj[key] = 'ClickClose';

            key = 'click #' + this.model.get('pid') + "_flyOutPanel .btnDrawPath";
            obj[key] = 'ClickDrawPath';

            key = 'change #' + this.model.get('pid') + "_flyOutPanel .ZAxisForTransformOrigin";
            obj[key] = 'ChangeZShowXY';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            //            Globle.CurrentAnimationModel = this.model;
            this.render();
        },
        render: function () {
            $("#modelPanel").append(this.template(this.model.toJSON()));

            $('#' + this.model.get('pid') + "_flyOutPanel").on('show.bs.modal', function (e) {
                //                $.blockUI();
                console.log("showwwww2222");
                $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);
            }).on('hide.bs.modal', function (e) {
                console.log("hide11111");
                //                $.unblockUI();
                $(e.currentTarget).unbind("hide.bs.modal").unbind("show.bs.modal");

                $("#iframeModalHelper").css("z-index", "-11111").hide();
            }).modal("show");
            return this;
        },
        ChangeZShowXY: function (event) {
            if ($(event.target).val() == "2") {
                $("#zShowHideTr").show();
                $("#zShowHideTr1").show();
            }
            else {
                $("#zShowHideTr").hide();
                $("#zShowHideTr1").hide();
            }
        },
        ClickSave: function (event) {
            this.HideIframeHelperLayout();
            console.log("ClickSave");
            //更新模型的通用属性
            this.model.set({
                "delay": $("#txtDelayTime", this.$el).val(),
                "duration": $("#txtDurationTime", this.$el).val(),
                "repeatCount": $("#txtRepeat", this.$el).val(),
                "IsWaitTrigger": ($("#chkIsWaitTrigger:checked").length == 0 ? !1 : !0),
                "ActionMethod": $("#actionMethod").val(),
                "isNew": !1,
                silent: !0
            });
            //更新模型的特殊属性
            switch (this.model.get("actionType")) {
                case "BezierType":
                    //处理逻辑:
                    //1. 先解密一下(对一个字符串多次解密,还是原来的字符串);
                    //2. 在加密一下;
                    //这是为了解决用户第一次打开页面时,直接编辑曲线,造成的问题
                    var tempEncoding = decodeURIComponent(this.model.attributes.AnimationJSONData);
                    tempEncoding = encodeURIComponent(tempEncoding);
                    this.model.set({
                        "isAlongCurve": ($("#chkIsFollowPath:checked").length == 0 ? !1 : !0),
                        "AnimationJSONData": tempEncoding,
                        silent: !0
                    })
                    break;

                case "FlyOut":
                case "FlyIn":
                    this.model.set({ "ActionDirection": $("#actionDirection").val(), silent: !0 })
                    break;

                case "ComplexAnimationType":
                    this.model.set({
                        "ComplexHeight": $("#txtElementHeight").val(),
                        "ComplexWidth": $("#txtElementWidth").val(),
                        "ComplexOpacity": $("#txtElementTransparent").val(),
                        "ComplexFontSize": $("#txtElementFontSize").val(),
                        "ComplexLeft": $("#txtElementLeft").val(),
                        "ComplexTop": $("#txtElementTop").val(),
                        silent: !0
                    });
                    break;
                case "RotateType":
                    this.model.set({
                        "RotateAngle": $("#txtRotateAngle").val(),
                        "RotateDirection": $("#RotateAngleDirection").val(),
                        "RotateXPoint": $("#RotateAngleDirection").val() == "2" ? $("#txtRotateXPoint").val() : 0,
                        "RotateYPoint": $("#RotateAngleDirection").val() == "2" ? $("#txtRotateYPoint").val() : 0,
                        silent: !0
                    });
                    break;

                case "ZoomInOut":
                    this.model.set({
                        "ZoomInOut": $("#txtZoomInOut").val(),
                        silent: !0
                    });
                    break;
            };

            this.model.save();

            this.ClearTemplateHTML();

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
        },
        HideIframeHelperLayout: function () {
            $("#iframeModalHelper").css("z-index", "-11111").hide();
        },
        ClickClose: function (event) {

            this.ClearTemplateHTML();

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
        },
        ClearTemplateHTML: function () {
            $(".modal-backdrop.fade").remove();
            this.$el.empty();
        },
        ClickDrawPath: function (event) {

            //在点击"绘制路径"时,将当前页面的配置参数保存
            this.ClickSave(event);


            this.HideIframeHelperLayout();
            this.ClearTemplateHTML();

            console.log('ClickDrawPath');
            Globle.CurrentAnimationModel = this.model;


            StartDrawBeizer();
            //添加一个结束绘制的按钮
            ShowAssistDrawButton();

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
        }
    });

    //画板的属性面板
    BoardAttributePanelView = Backbone.View.extend({
        el: $('#currentPageInfo'),
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_boardAttribute .updatePicture";
            obj[key] = 'updatePicture';
            key = 'click #' + this.model.get('pid') + "_boardAttribute .deletePicture";
            obj[key] = 'deletePicture';

            //            var key1 = "blur #" + this.model.get('pid') + "_boardAttribute #" + this.model.get('pid') + "_bg_color";
            //            obj[key1] = "updateBackGroundColor";

            switch (this.model.get("pType")) {
                case "layer":
                    //对于layer,能够修改layer的名称,因此需要多绑定一个修改的事件
                    var key2 = "blur #" + this.model.get("pid") + "_boardAttribute .elementName";
                    obj[key2] = 'blurElementName';
                    break;
            }

            return obj;
        },
        blurElementName: function (data) {
            //            console.log(data);
            this.model.set({
                silent: !0,
                pTitle: data.target.value
            });
            this.model.save();

            if (Globle.LastError.hasError()) {
                Globle.LastError.ShowError();
                location.reload();
            }
            else {
                var jstObj = $.jstree.reference("#layer_demo");
                jstObj.set_text(jstObj.get_selected(), data.target.value.cut(0, 5));
            }

            //通知触发器区域更新
            this.model.set({
                "pUpdateTriggerView": !this.model.get("pUpdateTriggerView")
            });
        },
        generateTemplate: function () {
            return _.template($('#currentBoardAttributeTemplate').html());
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //将属性面板绑定到model
            //                    this.model.bind("change:pFocus", this.render, this);//已过时,激活属性面板使用pUpdateAttributeView属性
            this.model.bind("change:pUpdateAttributeView", this.render, this);
            this.model.bind("remove", this.ListenRemove, this);

        },
        ListenRemove: function () {
            $(".attributeHoldPlace").empty();
            //            this.$el.empty();
        },
        //        updateBackGroundColor: function (data) {
        //            Globle.CurrentBoard.set({ "backgroundColor": data.target.value });
        //            Globle.CurrentBoard.save();
        //        },
        render: function () {
            if (Globle.IsInit) return;

            $(".attributeHoldPlace").empty();

            $("#BoardAttributePanelViewHoldPlaceDiv").empty().append(this.template(this.model.toJSON()));

            if (this.model.get("pType") == "board") {
                $('#' + this.model.get("pid") + '_bg_color')
                    .colorpicker({
                        strings: GetTranslateUI('TColorthemebasiccolormorecolorlesscolorreturn'),
                        showOn: 'focus'
                    })
                    .on('change.color', function (ev, color) {
                        if ("undefined" != typeof color) {
                            Globle.CurrentBoard.set({ "backgroundColor": color == "" ? "#FFF" : color });
                            Globle.CurrentBoard.save();
                        }
                    });
            }
            $("#elementAndPageInfoPanel a[href='#currentPageInfo']").tab('show');
            return this;
        },
        deletePicture: function () {
            //                    //console.log('delete');
            //删除画板的背景图片,更新当前画板的model的image属性,画板视图监听该属性改变
            this.model.set({
                "pFileUrl": "",
                "pFileID": "",
                "pMaterialUsageID": "",
                "deleteSubImageIDArray": this.model.get("pMaterialUsageID")
            });
            this.model.IsDeleteResource = true;
            this.SaveModel();
            this.model.IsDeleteResource = false;
        },
        updatePicture: function () {
            //                    //console.log('update');
            Globle.ClickType = "Board";
            Globle.IsUpdateModel = !0;
            openSelectResource(2);
        },
        SaveModel: function () {
            this.model.save();
        }
    });
    //bug标签的属性面板
    BugFlagAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_btnLeftArrow";
            obj[key] = '_btnLeftArrow';
            key = 'click #' + this.model.get('pid') + "_btnRightArrow";
            obj[key] = '_btnRightArrow';
            key = 'click #' + this.model.get('pid') + "_btnUpArrow";
            obj[key] = '_btnUpArrow';
            key = 'click #' + this.model.get('pid') + "_btnDownArrow";
            obj[key] = '_btnDownArrow';
            return obj;
        },
        generateTemplate: function () {
            return _.template($('#BugFlagAttributeTemplate').html());
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //将属性面板绑定到model
            this.model.bind("change:pUpdateInitView", this.render, this);
        },
        render: function () {
            if (Globle.IsInit) return;

            $("#BugFlagAttributeViewHoldPlaceDiv").empty().append(this.template(this.model.toJSON()));

            return this;
        },
        _btnLeftArrow: function () {
            console.log("_btnLeftArrow");

            $("bugflags", "#" + this.model.get("pid") + "").css({
                "border-color": "transparent red transparent transparent",
                "top": "20px",
                "left": " -20px"
            });
            $("bugflagi", "#" + this.model.get("pid") + "").css({
                "top": "-10px",
                "left": "-9px",
                "border-color": "transparent #FFF transparent transparent"
            });
            $(".bugContent", "#" + this.model.get("pid") + "").css("box-shadow", "3px 0px 4px red");

            this.SaveModel("left");
        },
        _btnRightArrow: function () {
            console.log("_btnRightArrow");
            $("bugflags", "#" + this.model.get("pid") + "").css({
                "border-color": "transparent transparent transparent red",
                "top": "20px",
                "left": (parseInt(this.model.get("pWidth"))) + "px"
            });
            $("bugflagi", "#" + this.model.get("pid") + "").css({
                "top": "-10px",
                "left": "-11px",
                "border-color": "transparent transparent transparent #FFF"
            });
            $(".bugContent", "#" + this.model.get("pid") + "").css("box-shadow", "-3px 0px 4px red");

            this.SaveModel("right");
        },
        _btnUpArrow: function () {
            console.log("_btnUpArrow");

            $("bugflags", "#" + this.model.get("pid") + "").css({
                "border-color": " transparent  transparent  red transparent",
                "top": "-20px",
                "left": " 20px"
            });
            $("bugflagi", "#" + this.model.get("pid") + "").css({
                "top": "-9px",
                "left": "-10px",
                "border-color": "transparent transparent #FFF transparent"
            });
            $(".bugContent", "#" + this.model.get("pid") + "").css("box-shadow", "3px 1px 4px red");


            this.SaveModel("up");
        },
        _btnDownArrow: function () {
            console.log("_btnDownArrow");

            $("bugflags", "#" + this.model.get("pid") + "").css({
                "border-color": "red transparent transparent transparent",
                "top": (parseInt(this.model.get("pHeight"))) + "px",
                "left": "20px"
            });
            $("bugflagi", "#" + this.model.get("pid") + "").css({
                "top": "-11px",
                "left": "-10px",
                "border-color": "#FFF transparent transparent  transparent"
            });
            $(".bugContent", "#" + this.model.get("pid") + "").css("box-shadow", "3px 0px 4px red");


            this.SaveModel("down");
        },
        SaveModel: function (temppArrowDirect) {
            this.model.set({
                pArrowDirect: temppArrowDirect,
                pSArrowDirectCSS: $("bugflags", "#" + this.model.get("pid") + "").attr("style"),
                pIArrowDirectCSS: $("bugflagi", "#" + this.model.get("pid") + "").attr("style"),
                pBoxShadowCSS: $(".bugContent", "#" + this.model.get("pid") + "").attr("style"),
                silent: !0
            });
            this.model.save();
        }
    });

    //webform属性面板
    WebFormAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        events: function () {
            var obj = {};
            var key = 'blur #' + this.model.get('pid') + "_urlText";
            obj[key] = 'blurWebForm';
            key = 'blur #' + this.model.get('pid') + "_embedContentText";

           
            obj[key] = 'blurWebForm';

            key = 'click #' + this.model.get('pid') + "_localResourceContentText";
            obj[key] = 'blurWebForm';
            return obj;
        },
        generateTemplate: function () {
            return _.template($('#WebFormAttributeTemplate').html());
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //将属性面板绑定到model
            this.model.bind("change:pUpdateContentView", this.render, this);
            this.model.bind("change:pFileUrl", this.ListenpFileUrl, this);
        },
        render: function () {
            if (Globle.IsInit) return;

            $("#WebFormAttributeViewHoldPlaceDiv").empty().append(this.template(this.model.toJSON()));

            return this;
        },
    
        ListenpFileUrl: function () {
            switch (this.model.get("pContentType")) {
                case "localResource":
                    $("#" + this.model.get('pid') + "_localResourceContentText").val(this.model.get("pFileName"));

                    break;

            }
        },
        blurWebForm: function () {
            switch (this.model.get("pContentType")) {
                case "url":
                    if ($("#" + this.model.get('pid') + "_urlText").val().indexOf("http") != 0) {
                        $("#" + this.model.get('pid') + "_urlText").val("http://" + $("#" + this.model.get('pid') + "_urlText").val());
                    }
                    this.model.set({
                        pTextContentUrl: encodeURIComponent($("#" + this.model.get('pid') + "_urlText").val().replace(/'/g, '\\\'')),
                        silent: !0
                    });
                    break;

                case "embed":
                    this.model.set({
                        pTextContentEmbed: encodeURIComponent($("#" + this.model.get('pid') + "_embedContentText").val()),
                        silent: !0
                    });
                    break;

                
                case "localResource":
                    //处理逻辑:
                    //1. 打开资源库.本地资源库,直接过滤zip文件,统一资源库不过滤.
                    //2. 将用户选择的zip文件,更新到model的相应字段中
                    Globle.ClickType = "localResource";
                    Globle.IsUpdateModel = !0;
                    openSelectResource(this.model.get("pContentType"));

                    //this.model.set({
                    //    pTextContentUrl: encodeURIComponent($("#" + this.model.get('pid') + "_localResourceContentText").val()),
                    //    silent: !0
                    //});
                    break;

            }
            this.model.save();
        }
    });

    //视频的属性面板
    VideoAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_VideoAttributeTemplate .isShowControlBar";
            obj[key] = 'isShowControlBar';
            key = 'click #' + this.model.get('pid') + "_VideoAttributeTemplate .isAutoPlay";
            obj[key] = 'isAutoPlay';
            key = 'click #' + this.model.get('pid') + "_VideoAttributeTemplate .isRepeat";
            obj[key] = 'isRepeat';
            key = 'click #' + this.model.get('pid') + "_VideoAttributeTemplate .isCompleteHide";
            obj[key] = 'isCompleteHide';

            //音频延迟播放时间
            key = 'blur #' + this.model.get('pid') + "_VideoAttributeTemplate .delayPlayTime";
            obj[key] = 'setDelayPlayTime';

            //音频和视频自动播放次数
            key = 'blur #' + this.model.get('pid') + "_VideoAttributeTemplate .autoPlayNumber";
            obj[key] = 'setAutoPlayNumber';

            return obj;
        },
        generateTemplate: function () {
            return _.template($('#VideoAttributeTemplate').html());
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //将属性面板绑定到model
            this.model.bind("change:pUpdateInitView", this.render, this);
            this.model.bind("change:pWidth", this.ListenPwidth, this);
            this.model.bind("change:pHeight", this.ListenpHeight, this);
            this.model.bind("change:pLeft", this.ListenpLeft, this);
            this.model.bind("change:pTop", this.ListenpTop, this);
        },
        render: function () {
            if (Globle.IsInit) return;

            $("#VideoAttributeViewHoldPlaceDiv").empty().append(this.template(this.model.toJSON()));

            return this;
        },
        isShowControlBar: function (event) {
            console.log(event);
            this.model.set({
                "isShowControlBar": $(event.currentTarget)[0].checked,
                silent: !0
            });
            this.SaveModel();
        },
        isAutoPlay: function (event) {
            this.model.set({
                "isAutoPlay": $(event.currentTarget)[0].checked,
                silent: !0
            });
            this.SaveModel();
            if (this.model.get("pType") == "Audio") {
                if ($(event.currentTarget)[0].checked) {
                    $(event.currentTarget).parent("label").siblings("#" + this.model.get("pid") + "_spanDelayPlayTime").css("display", "block");
                    $(event.currentTarget).parent("label").siblings("#" + this.model.get("pid") + "_spanAutoPlayNumber").css("display", "block");
                }
                else {
                    $(event.currentTarget).parent("label").siblings("#" + this.model.get("pid") + "_spanDelayPlayTime").css("display", "none");
                    $(event.currentTarget).parent("label").siblings("#" + this.model.get("pid") + "_spanAutoPlayNumber").css("display", "none");
                }
            }
            else if (this.model.get("pType") == "Video") {
                if ($(event.currentTarget)[0].checked) {
                    $(event.currentTarget).parent("label").siblings("#" + this.model.get("pid") + "_spanAutoPlayNumber").css("display", "block");
                }
                else {
                    $(event.currentTarget).parent("label").siblings("#" + this.model.get("pid") + "_spanAutoPlayNumber").css("display", "none");
                }
            }
        },
        setDelayPlayTime: function (event) {
            if (this.model.get("pType") == "Audio" && this.model.get("isAutoPlay")) {
                this.model.set({
                    "pDelayPlaySecond": $(event.currentTarget).val() == "" ? 0 : parseInt($(event.currentTarget).val()),
                    silent: !0
                });
                this.SaveModel();
            }
        },
        setAutoPlayNumber: function (event) {
            if ((this.model.get("pType") == "Video" || this.model.get("pType") == "Audio") && this.model.get("isAutoPlay")) {
                this.model.set({
                    "pAutoPlayNumber": $(event.currentTarget).val() == "" ? 0 : parseInt($(event.currentTarget).val()),
                    silent: !0
                });
                this.SaveModel();
            }
        },
        ListenPwidth: function () {
            $("#width", this.$el).val(this.model.get("pWidth"));
        },
        ListenpHeight: function () {
            $("#height", this.$el).val(this.model.get("pHeight"));
        },
        ListenpLeft: function () {
            $("#left", this.$el).val(this.model.get("pLeft"));
        },
        ListenpTop: function () {
            $("#top", this.$el).val(this.model.get("pTop"));
        },
        isRepeat: function (event) {
            this.model.set({
                "isRepeatPlay": $(event.currentTarget)[0].checked,
                silent: !0
            });
            this.SaveModel();
        },
        isCompleteHide: function (event) {
            this.model.set({
                "isCompleteHide": $(event.currentTarget)[0].checked,
                silent: !0
            });
            this.SaveModel();
        },
        SaveModel: function () {
            this.model.save();
        }
    });
    //关联资源文件,比如catia和glstudio以及关联文本等功能,需要将现有资源链接到另外一个资源.的view
    ManualMakeRelateResourceFileTemplateAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#ManualMakeRelateResourceFileTemplate').html());
        },
        events: function () {
            var obj = {};

            switch (this.model.get("pType")) {
                case "Catia":
                    //直接让用户输入wrl的地址, 地址格式请参考jk发的文档
                    var key = 'blur #' + this.model.get('pid') + "_MakeRelateResourceFile_TextBox";
                    obj[key] = 'blur_MakeRelateResourceFile_TextBox';
                    break;

                case "GlStudio":
                    var key = 'click #' + this.model.get('pid') + "_MakeRelateResourceFile";
                    obj[key] = 'clickMakeRelateResourceFile';
                    break;
            }

            return obj;
        },
        initialize: function () {
            console.log("ManualMakeRelateResourceFileTemplateAttributeView  initialize");
            this.template = this.generateTemplate();
            this.model.on("change:pUpdateManualMakeRelateResourceFileTemplateAttributeView", this.pUpdateInitView, this);
            this.render();
        },
        blur_MakeRelateResourceFile_TextBox: function (event) {
            console.log(event);
            this.model.set({
                silent: !0,
                RelateIpaFullPath: event.target.value
            });
            this.model.save();
        },
        clickMakeRelateResourceFile: function (event) {
            console.log(this.model.get("pid") + " clickMakeRelateResourceFile");

            //处理逻辑:
            //1. 打开资源库.本地资源库,直接过滤ipa文件,统一资源库不过滤.
            //2. 将用户选择的ipa文件,更新到model的相应字段中
            Globle.ClickType = "MakeRelateFile";
            //            Globle.IsUpdateModel = !0;

            switch (this.model.get("pType")) {
                //                case "Catia":                                                                                            
                //                    openSelectResource(12); //wrl后缀文件                                                                                            
                //                    break;                                                                                            

                case "GlStudio":
                    openSelectResource(10);
                    break;
            }
        },
        render: function () {
            console.log("ManualMakeRelateResourceFileTemplateAttributeView render");
            if (Globle.IsInit) return;
            $("#ManualMakeRelateResourceFilePlaceDiv").empty().append(this.template(this.model.toJSON()));
            //            this.SetDataValue();
            return this;
        },
        pUpdateInitView: function () {
            this.render();
        }
        //        SetDataValue: function () {
        //            //更新选中值
        //            if (this.model.get("pInitControlVisible") == "2") {
        //                $("#optionsRadios1Show").removeAttr("checked");
        //                $("#optionsRadios2Hide").attr("checked", !0);
        //            }
        //            else {
        //                $("#optionsRadios1Show").attr("checked", !0);
        //                $("#optionsRadios2Hide").removeAttr("checked");
        //            }
        //        }
    });
    //公共右边显示的颜色的视图--
    BaseColorCommonAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#ColorTemplate').html());
        },
        events: function () {
            var obj = {};

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("remove", this.ListenRemove, this);
            this.model.bind("change:pUpdateAttributeView", this.render, this);
        },
        render: function () {
            if (Globle.IsInit) return;
            //                    //console.log('BaseColorCommonAttributeView render');

            if (!$('#' + this.model.get("pid") + '_bg_color').hasClass("colorPicker")) {
                //已经初始化,就不需要再次初始化
                $("#BaseColorCommonAttributeViewHoldPlaceDiv").empty().append(this.template(this.model.toJSON()));
                //            $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');
                $('#' + this.model.get("pid") + '_bg_color')
                    .colorpicker({
                        strings: GetTranslateUI('TColorthemebasiccolormorecolorlesscolorreturn'),
                        showOn: 'focus'
                    })
                    .on('change.color', function (ev, color) {
                        if ("undefined" != typeof color) {
                            Globle.CurrentModel.set({ "color": color == "" ? "#red" : color });
                            Globle.CurrentModel.save();
                        }
                    });
            }
            return this;
        },
        ListenRemove: function () {
            //            this.$el.empty();
            $(".attributeHoldPlace").empty();
        }
    });

    //    BaseRotataeCommonAttributeView = Backbone.View.extend({
    //        el: $('#elementInfo'),
    //        generateTemplate: function () {
    //            return _.template($('#ElementRotateTemplate').html());
    //        },
    //        events: function () {
    //            var obj = {};
    //            var key = "blur #" + this.model.get("pid") + "_RotateTemplate .SetRotateTextBox";
    //            obj[key] = "blurElementRotate";
    //            return obj;
    //        },
    //        initialize: function () {
    //            this.template = this.generateTemplate();
    //            this.render();
    //            this.model.bind("change:pRotate", this.ListenpRotate, this);
    //        },
    //        render: function () {
    //            if (Globle.IsInit) return;
    //            //                    //console.log('BaseColorCommonAttributeView render');
    //            if ($('#' + this.model.get('pid') + "_sliderElementRotate").children('a').length == 0) {
    //                ElementRotate($('#' + this.model.get('pid') + "_sliderElementRotate"), this.model);
    //            }

    //            return this;
    //        }, 
    //        ListenpRotate: function () {
    //            $("#Rotate", $('#' + this.model.get('pid') + "_sliderElementRotate")).val(this.model.get("pRotate"));
    //        },
    //        blurElementRotate: function (data) {
    //            $('#' + this.model.get('pid') + "_sliderElementRotate").slider("value", data.target.value);
    //            ChangeElementRotate(this.model, data); //方法在Utilities1中
    //        }

    //    });

    //公共,右边显示的类似幻灯片的元素,可以具有的设置属性,比如是否自动播放 视图
    BaseSlidElementCommonSetPanelAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#ImageSlideSetPanelTemplate').html());
        },
        events: function () {
            var obj = {};
            var key = "blur #" + this.model.get("pid") + "_intervalSecond";
            obj[key] = 'BlurIntervalSecond';

            var key = "change #" + this.model.get("pid") + "_autoPlay";
            obj[key] = 'changeCheckbox';

            var key = "change #" + this.model.get("pid") + "_IsShowControlPanel";
            obj[key] = 'changeCheckbox'

            var key = "change #" + this.model.get("pid") + "_IsShowPageIndicators";
            obj[key] = 'changeCheckbox'

            var key = "change #" + this.model.get("pid") + "_IsShowSlid";
            obj[key] = 'changeCheckbox'

            var key = "blur #" + this.model.get("pid") + "_PlayCount";
            obj[key] = 'BlurIntervalSecond'

            var key = "blur #" + this.model.get("pid") + "_sildDelaySecond";
            obj[key] = 'BlurIntervalSecond'

            var key = "change #" + this.model.get("pid") + "_PlayEndIsHide";
            obj[key] = 'changeCheckbox'

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("remove", this.ListenRemove, this);
            this.model.bind("change:pUpdateSetPanelAttributeView", this.render, this);
        },
        render: function () {
            if (Globle.IsInit) return;
            console.log('BaseSlidElementCommonSetPanelAttributeView render');

            $("#PlayerControlHoldPlaceDiv").empty().append(this.template(this.model.toJSON()));

            return this;
        },
        ListenRemove: function () {
            //            this.$el.empty();
            $(".attributeHoldPlace").empty();
        },
        BlurIntervalSecond: function () {
            var tempIntervalSecond = $("#" + this.model.get("pid") + "_intervalSecond").val();
            if (tempIntervalSecond == 0) {
                $("#" + this.model.get("pid") + "_intervalSecond").val(1);
                tempIntervalSecond = 1;
            }

            var prevIsShowSlid = this.model.get("IsShowSlid");

            this.model.set({
                silent: !0,
                IntervalSecond: tempIntervalSecond,
                IsAutoPlay: $("#" + this.model.get("pid") + "_autoPlay").prop("checked"),
                IsShowPageIndicators: $("#" + this.model.get("pid") + "_IsShowPageIndicators").prop("checked"),
                IsShowControlPanel: $("#" + this.model.get("pid") + "_IsShowControlPanel").prop("checked"),
                IsShowSlid: $("#" + this.model.get("pid") + "_IsShowSlid").prop("checked"),
                PlayCount: $("#" + this.model.get("pid") + "_PlayCount").val(),
                DelaySecond: $("#" + this.model.get("pid") + "_sildDelaySecond").val(),
                PlayEndIsHide: $("#" + this.model.get("pid") + "_PlayEndIsHide").prop("checked")
            }).save();

            if (Globle.LastError.hasError()) {
                //说明有错误
                Globle.LastError.ShowError(GetTranslateUI('TNetworkerrorsuccessisnotset') + "!");
            }
            else {
                if (!this.model.get("IsShowSlid") && prevIsShowSlid && this.model.get("IsAutoPlay")) {

                    alert(GetTranslateUI('TSlideruninnonSildformrepetitionparameterisinvalid') + '.');
                }
            }
        },
        changeCheckbox: function () {
            if ($("#" + this.model.get("pid") + "_autoPlay").prop("checked")) {
                $(".dependentAutoPlay", "#" + this.model.get("pid") + "_ImageSlideSetPanelTemplate").show();
            }
            else
                $(".dependentAutoPlay", "#" + this.model.get("pid") + "_ImageSlideSetPanelTemplate").hide();
            this.BlurIntervalSecond();
        }
    });

    //image类型右边显示的属性的视图:位置,大小属性
    ImageAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#imageAttributeInfo').html());
        },
        events: function () {

            var obj = {};

            var key = "click #" + this.model.get("pid") + "_elementAttribute .updatePicture";
            obj[key] = 'updatePicture';

            var key1 = "click #" + this.model.get("pid") + "_elementAttribute .deletePicture";
            obj[key1] = 'deletePicture';

            var key2 = "blur #" + this.model.get("pid") + "_elementAttribute .elementName";
            obj[key2] = 'blurElementName';

            var key3 = "blur #" + this.model.get("pid") + "_elementAttribute .txtImgChangeSize";
            obj[key3] = 'changeImgSize';

            var key4 = "blur #" + this.model.get("pid") + "_elementAttribute .SetWHXYInfo";
            obj[key4] = 'changeImageSizePostion';

            var key5 = "blur #" + this.model.get("pid") + "_elementAttribute .SetRotateTextBox";
            obj[key5] = "blurElementRotate";

            var key6 = "blur #" + this.model.get("pid") + "_elementAttribute .SetTransparentTextBox";
            obj[key6] = "blurElementTransparent";
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("remove", this.ListenRemove, this);
            this.model.bind("change:pUpdateAttributeView", this.ListenUpdateView, this);
            this.model.bind("change:pWidth", this.ListenPwidth, this);
            this.model.bind("change:pHeight", this.ListenpHeight, this);
            this.model.bind("change:pLeft", this.ListenpLeft, this);
            this.model.bind("change:pTop", this.ListenpTop, this);
            this.model.bind("change:pRotate", this.ListenpRotate, this);
            this.model.bind("change:pTransparent", this.ListenpTransparent, this);
            this.model.bind("change:pFileResourceFromLocation", this.ListenpFileResourceFromLocation, this);
            //            this.collection = Globle.AnimationBaseModelCollection;
            //            this.collection.bind("add", this.addActionRender, this);
            //            this.collection.bind("remove", this.addActionRender, this);
        },
        render: function () {
            if (Globle.IsInit) return;
            //                    //console.log('render');
            $(".attributeHoldPlace").empty();

            $("#ImageAttributeViewHoldPlaceDiv").empty()
                    .append(this.template(this.model.toJSON()));

            $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');
            if ($("#sliderElementRotate", this.$el).children('a').length == 0) {
                ElementRotate(this.$el, this.model);
            }

            if ($("#sliderElementTransparentForImage", this.$el).children('a').length == 0) {
                ElementTransparentForImage(this.$el, this.model);
            }
            return this;
        },
        blurElementRotate: function (data) {
            $("#sliderElementRotate", this.$el).slider("value", data.target.value);
            ChangeElementRotate(this.model, data); //方法在Utilities1中
        },
        ListenRemove: function () {
            //            this.$el.empty();
            $(".attributeHoldPlace").empty();
        },
        ListenpFileResourceFromLocation: function () {
          $(".ResourceSource", this.$el).text(ProcessResourceSource(this.model.get("pResourceType"), this.model.get("pFileResourceFromLocation")).cut(0, 10)).attr("title", ProcessResourceSource(this.model.get("pResourceType"), this.model.get("pFileResourceFromLocation")));
       },
        ListenpTransparent: function () {
            $("#Transparent", this.$el).val(this.model.get("pTransparent"));
            //同时设置splider的值
            $("#sliderElementTransparentForImage", this.$el).slider("value", this.model.get("pTransparent"));
        },
        blurElementTransparent: function (data) {
            //文本框变更素材透明度
            $("#sliderElementTransparentForImage", this.$el).slider("value", data.target.value);
            ChangeElementTransparent(this.model, data);
        },
        deletePicture: function () {
            Globle.AllModelCollection.remove(this.model);
        },
        updatePicture: function () {
            //更新当前model的imageurl属性信息
            //console.log('updatePicture');
            Globle.ClickType = "Resource";
            Globle.IsUpdateModel = !0;
            openSelectResource(2);
        },
        changeImageSizePostion: function (data) {

            ChangeElementWHXY(this.model, data);

        },
        blurElementName: function (data) {
            //            console.log(data);
            this.model.set({
                silent: !0,
                pName: data.target.value
            });
            this.model.save();

            //通知触发器区域更新
            this.model.set({
                "pUpdateTriggerView": !this.model.get("pUpdateTriggerView")
            });
        },
        changeImgSize: function (data) {
            var imgSrc = this.model.get("pFileUrl");
            imgLoad(imgSrc, function (imgWidthOld, imgHeightOld) {
                var imgWidthNew;
                var imgHeightNew;
                if (data.target.value != "") {
                    var percentSize = parseInt(data.target.value);
                    if (isNaN(percentSize)) {
                        return;
                    }
                    else {
                        percentSize = percentSize > 500 ? 500 : percentSize;
                        imgWidthNew = (parseInt((percentSize / 100) * parseInt(imgWidthOld))) + "px";
                        imgHeightNew = (parseInt((percentSize / 100) * parseInt(imgHeightOld))) + "px";
                    }
                }
                else {
                    return;
                }

                AddResizeMemo();

                this.model.set({
                    pWidth: imgWidthNew.substring(0, imgWidthNew.indexOf("px")),
                    pHeight: imgHeightNew.substring(0, imgHeightNew.indexOf("px"))
                });
                this.model.save();

                if (Globle.LastError.hasError()) {
                    Globle.LastError.ShowError();
                    location.reload();
                }

                $("#" + this.model.get("pid")).css("width", imgWidthNew);
                $("#" + this.model.get("pid")).css("height", imgHeightNew);
            }, this);
        },
        ListenPwidth: function () {
            //            console.log($("#width", this.$el));
            $("#width", this.$el).val(this.model.get("pWidth"));
        },
        ListenpHeight: function () {
            $("#height", this.$el).val(this.model.get("pHeight"));
        },
        ListenpLeft: function () {
            $("#left", this.$el).val(this.model.get("pLeft"));
        },
        ListenpTop: function () {
            $("#top", this.$el).val(this.model.get("pTop"));
        },
        ListenpRotate: function () {
            $("#Rotate", this.$el).val(this.model.get("pRotate"));
            //同时设置splider的值
            $("#sliderElementRotate", this.$el).slider("value", this.model.get("pRotate"));
        },
        ListenUpdateView: function () {
            if (Globle.IsInit) return;
            this.render();
        }
    });

    //公共右边显示的属性的视图:位置,大小属性
    BaseCommonAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#CommonAttributeTemplate').html().replace("fieldsetHoldPlace", ""));
        },
        events: function () {
            var obj = {};
            var key1 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .txtCommonChangeSize";
            obj[key1] = 'changeCommonSize';
            var key2 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .elementName";
            obj[key2] = 'blurElementName';
            var key3 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .SetWHXYInfo";
            obj[key3] = 'changeImageSizePostion';
            var key4 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .SetRotateTextBox";
            obj[key4] = "blurElementRotate";

            var key5 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .SetTransparentTextBox";
            obj[key5] = "blurElementTransparent";

            switch (this.model.get("pType")) {
                case "Box":
                    var key6 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .pToolsBorderWidth";
                    obj[key6] = "blurBoxBorderWidth";
                    key6 = "change #" + this.model.get("pid") + "_elementCommonAttribute #" + this.model.get("pid") + "_cboxToolBackGroundIsOpacity";
                    obj[key6] = "changeBackGroundColorIsOpacity";
                    break;
                case "Circle":
                    var key7 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .pToolsBorderWidth";
                    obj[key7] = "blurBoxBorderWidth";
                    key7 = "change #" + this.model.get("pid") + "_elementCommonAttribute #" + this.model.get("pid") + "_cboxToolBackGroundIsOpacity";
                    obj[key7] = "changeBackGroundColorIsOpacity";
                    key7 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .pToolsCircularRadius";
                    obj[key7] = "blurBoxCircularRadius";
                    break;
                case "Ellipse":
                    var key8 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .pToolsBorderWidth";
                    obj[key8] = "blurBoxBorderWidth";
                    key8 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .pToolsEllipseRadiusX";
                    obj[key8] = "blurEllipseRadius";
                    key8 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .pToolsEllipseRadiusY";
                    obj[key8] = "blurEllipseRadius";
                    key8 = "change #" + this.model.get("pid") + "_elementCommonAttribute #" + this.model.get("pid") + "_cboxToolBackGroundIsOpacity";
                    obj[key8] = "changeBackGroundColorIsOpacity";
                    break;
                case "AdvanceArrow":
                    break;
                default:
                    break;
            }
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("remove", this.ListenRemove, this);
            this.model.bind("change:pUpdateAttributeView", this.ListenUpdateView, this);
            this.model.bind("change:pWidth", this.ListenPwidth, this);
            this.model.bind("change:pHeight", this.ListenpHeight, this);
            this.model.bind("change:pLeft", this.ListenpLeft, this);
            this.model.bind("change:pTop", this.ListenpTop, this);
            this.model.bind("change:pRotate", this.ListenpRotate, this);
            this.model.bind("change:pTransparent", this.ListenpTransparent, this);
            switch (this.model.get("pType")) {
                case "Box":
                    this.model.bind("change:pBorderWidth", this.ListenpBorderWidth, this);
                    this.model.bind("change:pBorderColor", this.ListenpBorderColor, this);
                    this.model.bind("change:pBackGroundColor", this.ListenpBackGroundColor, this);
                    this.model.bind("change:pBackGroundIsOpacity", this.ListenpBackGroundColor, this);
                    break;
                case "Circle":
                    this.model.bind("change:pBorderWidth", this.ListenpBorderWidth, this);
                    this.model.bind("change:pBorderColor", this.ListenpBorderColor, this);
                    this.model.bind("change:pBackGroundColor", this.ListenpBackGroundColor, this);
                    this.model.bind("change:pBackGroundIsOpacity", this.ListenpBackGroundColor, this);
                    this.model.bind("change:pCircleRadius", this.ListenpCircleRadius, this);
                    break;
                case "AdvanceArrow":
                    this.model.bind("change:pArrowColor", this.ListenpArrowColor, this);
                    break;
                case "Ellipse":
                    this.model.bind("change:pBorderColor", this.ListenpBorderColor, this);
                    this.model.bind("change:pBorderWidth", this.ListenpBorderWidth, this);
                    this.model.bind("change:pEllipseRX", this.pToolsEllipseRadiusX, this);
                    this.model.bind("change:pEllipseRY", this.pToolsEllipseRadiusY, this);
                    this.model.bind("change:pBackGroundColor", this.ListenpBackGroundColor, this);
                    this.model.bind("change:pBackGroundIsOpacity", this.ListenpBackGroundColor, this);
                    break;
                default:
                    break;
            }
        },
        render: function () {
            if (Globle.IsInit) return;
            $(".attributeHoldPlace").empty();
            $("#BaseCommonAttributeViewHodPlaceDiv").empty()
                    .append(this.template(this.model.toJSON()));
            $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');
            if (this.model.get("pType") == "Arrow") {
                if ($("#sliderElementRotate", this.$el).children('a').length == 0) {
                    ElementRotate(this.$el, this.model);
                }

                if ($("#sliderElementTransparentForImage", this.$el).children('a').length == 0) {
                    ElementTransparentForImage(this.$el, this.model);
                }
            }

            if (this.model.get("pType") == "AdvanceArrow") {
                if ($("#sliderElementRotate", this.$el).children('a').length == 0) {
                    ElementRotate(this.$el, this.model);
                }

                if ($("#sliderElementTransparentForImage", this.$el).children('a').length == 0) {
                    ElementTransparentForImage(this.$el, this.model);
                }
                $('#' + Globle.CurrentModel.get("pid") + '_Tool_backGroundColor_color')
                    .colorpicker({
                        strings: GetTranslateUI('TColorthemebasiccolormorecolorlesscolorreturn'),
                        showOn: 'focus'
                    })
                    .on('change.color', function (ev, color) {
                        if ("undefined" != typeof color) {
                            Globle.CurrentModel.set({ "pArrowColor": color == "" ? "Red" : color });
                            Globle.CurrentModel.save();
                        }
                    });
            }
            if (this.model.get("pType") == "Box" || this.model.get("pType") == "Circle" || this.model.get("pType") == "Ellipse") {
                $('#' + Globle.CurrentModel.get("pid") + '_Tool_border_color')
                    .colorpicker({
                        strings: GetTranslateUI('TColorthemebasiccolormorecolorlesscolorreturn'),
                        showOn: 'focus'
                    })
                    .on('change.color', function (ev, color) {
                        if ("undefined" != typeof color) {
                            Globle.CurrentModel.set({ "pBorderColor": color == "" ? "Red" : color });
                            Globle.CurrentModel.save();
                        }
                    });
                $('#' + Globle.CurrentModel.get("pid") + '_Tool_backGroundColor_color')
                    .colorpicker({
                        strings: GetTranslateUI('TColorthemebasiccolormorecolorlesscolorreturn'),
                        showOn: 'focus'
                    })
                    .on('change.color', function (ev, color) {
                        if ("undefined" != typeof color) {
                            Globle.CurrentModel.set({ "pBackGroundColor": color == "" ? "none" : color });
                            Globle.CurrentModel.save();
                        }
                    });
            }
            return this;
        },
        changeBackGroundColorIsOpacity: function (data) {
            if ($(data.target).prop("checked")) {
                this.model.set({
                    "pBackGroundIsOpacity": !0
                });
            }
            else {
                this.model.set({
                    "pBackGroundIsOpacity": !1
                });
            }
            this.model.save();
            if (Globle.LastError.hasError()) {
                Globle.LastError.ShowError();
                location.reload();
            }
        },
        pToolsEllipseRadiusX: function () {
            $("#" + this.model.get("pid") + " svg>ellipse").attr("rx", this.model.get("pEllipseRX") + "%");
        },
        pToolsEllipseRadiusY: function () {
            $("#" + this.model.get("pid") + " svg>ellipse").attr("ry", this.model.get("pEllipseRY") + "%");
        },
        ListenpArrowColor: function () {
            if (this.model.get("pType") == "AdvanceArrow") {
                $("#" + this.model.get("pid") + " svg>path").css({
                    "fill": this.model.get("pArrowColor"),
                    "stroke": this.model.get("pArrowColor")
                });
            }
        },
        ListenpBackGroundColor: function () {
            switch (this.model.get("pType")) {
                case "Box":
                    if (this.model.get("pBackGroundIsOpacity")) {
                        $("#" + this.model.get("pid") + " svg>rect").attr("fill", "none");
                    }
                    else {
                        $("#" + this.model.get("pid") + " svg>rect").attr("fill", this.model.get("pBackGroundColor"));
                    }
                    break;
                case "Circle":
                    if (this.model.get("pBackGroundIsOpacity")) {
                        $("#" + this.model.get("pid") + " svg>circle").attr("fill", "none");
                    }
                    else {
                        $("#" + this.model.get("pid") + " svg>circle").attr("fill", this.model.get("pBackGroundColor"));
                    }
                    break;
                case "Ellipse":
                    if (this.model.get("pBackGroundIsOpacity")) {
                        $("#" + this.model.get("pid") + " svg>ellipse").css("fill", "none");
                    }
                    else {
                        $("#" + this.model.get("pid") + " svg>ellipse").css("fill", this.model.get("pBackGroundColor"));
                    }
                    break;
                default:
                    break;
            }
        },
        ListenpCircleRadius: function () {
            if (this.model.get("pType") == "Circle") {
                $("#" + this.model.get("pid") + " svg>circle").attr("r", this.model.get("pCircleRadius"));
            }
        },
        ListenpBorderColor: function () {
            switch (this.model.get("pType")) {
                case "Box":
                    $("#" + this.model.get("pid") + " svg>rect").css("stroke", this.model.get("pBorderColor"));
                    break;
                case "Circle":
                    $("#" + this.model.get("pid") + " svg>circle").attr("stroke", this.model.get("pBorderColor"));
                    break;
                case "AdvanceArrow":
                    break;
                case "Ellipse":
                    $("#" + this.model.get("pid") + " svg>ellipse").css("stroke", this.model.get("pBorderColor"));
                    break;
                default:
                    break;
            }
        },
        ListenpBorderWidth: function () {
            switch (this.model.get("pType")) {
                case "Box":
                    $("#" + this.model.get("pid") + " svg>rect").attr("stroke-width", this.model.get("pBorderWidth"));
                    break;
                case "Circle":
                    $("#" + this.model.get("pid") + " svg>circle").attr("stroke-width", this.model.get("pBorderWidth"));
                    break;
                case "AdvanceArrow":
                    break;
                case "Ellipse":
                    $("#" + this.model.get("pid") + " svg>ellipse").css("stroke-width", this.model.get("pBorderWidth"));
                    break;
                default:
                    break;
            }
        },
        blurEllipseRadius: function (data) {
            var target = $(data.target);
            var value = parseInt(target.val());
            //说明是椭圆的X半径
            if (target.hasClass("pToolsEllipseRadiusX")) {
                if (!isNaN(value)) {
                    this.model.set({
                        "pEllipseRX": value + ""
                    });
                }
                else {
                    this.model.set({
                        "pEllipseRX": "50"
                    });
                }
            }
            else if (target.hasClass("pToolsEllipseRadiusY")) {
                if (!isNaN(value)) {
                    this.model.set({
                        "pEllipseRY": value + ""
                    });
                }
                else {
                    this.model.set({
                        "pEllipseRY": "50"
                    });
                }
            }
            this.model.save();
            if (Globle.LastError.hasError()) {
                Globle.LastError.ShowError();
                location.reload();
            }
        },
        blurBoxCircularRadius: function (data) {
            if (this.model.get("pType") == "Circle") {
                if (data.target.value != "") {
                    this.model.set({
                        "pCircleRadius": data.target.value
                    });
                }
                else {
                    this.model.set({
                        "pCircleRadius": 20
                    });
                }
                this.model.save();
                if (Globle.LastError.hasError()) {
                    Globle.LastError.ShowError();
                    location.reload();
                }
            }
        },
        blurBoxBorderWidth: function (data) {
            if (data.target.value != "") {
                this.model.set({
                    "pBorderWidth": data.target.value
                });
            }
            else {
                this.model.set({
                    "pBorderWidth": 0
                });
            }
            this.model.save();
            if (Globle.LastError.hasError()) {
                Globle.LastError.ShowError();
                location.reload();
            }
        },
        ListenRemove: function () {
            $(".attributeHoldPlace").empty();
        },
        changeImageSizePostion: function (data) {
            ChangeElementWHXY(this.model, data);
        },
        blurElementTransparent: function (data) {
            //文本框变更素材透明度
            $("#sliderElementTransparentForImage", this.$el).slider("value", data.target.value);
            ChangeElementTransparent(this.model, data);
        },
        blurElementRotate: function (data) {
            $("#sliderElementRotate", this.$el).slider("value", data.target.value);
            ChangeElementRotate(this.model, data); //方法在Utilities1中
        },
        ListenpTransparent: function () {
            $("#Transparent", this.$el).val(this.model.get("pTransparent"));
            //同时设置splider的值
            $("#sliderElementTransparentForImage", this.$el).slider("value", this.model.get("pTransparent"));
        },
        ListenpRotate: function () {
            $("#Rotate", this.$el).val(this.model.get("pRotate"));
            //同时设置splider的值
            $("#sliderElementRotate", this.$el).slider("value", this.model.get("pRotate"));
        },
        changeCommonSize: function (data) {
            var pType = this.model.get("pType");
            if (pType == "Video") {
                var videoWidthOld = "700";
                var videoHeightOld = "500";
                var videoWidthNew;
                var videoHeightNew;
                if (data.target.value != "") {
                    var percentSize = parseInt(data.target.value);
                    if (isNaN(percentSize)) {
                        return;
                    }
                    else {
                        percentSize = percentSize > 100 ? 100 : percentSize;
                        videoWidthNew = (parseInt((percentSize / 100) * parseInt(videoWidthOld))) + "px";
                        videoHeightNew = (parseInt((percentSize / 100) * parseInt(videoHeightOld))) + "px";
                    }
                }
                else {
                    return;
                }

                AddResizeMemo();

                this.model.set({
                    pWidth: videoWidthNew.substring(0, videoWidthNew.indexOf("px")),
                    pHeight: videoHeightNew.substring(0, videoHeightNew.indexOf("px"))
                });
                this.model.save();

                if (Globle.LastError.hasError()) {
                    Globle.LastError.ShowError();
                    location.reload();
                }

                $("#" + this.model.get("pid")).css("width", videoWidthNew);
                $("#" + this.model.get("pid")).css("height", videoHeightNew);
            }
        },
        blurElementName: function (data) {
            //            console.log(data);

            switch (this.model.get("pType")) {

                case "layer":
                    //layer的名字属性是pTitle
                    this.model.set({
                        silent: !0,
                        pTitle: data.target.value
                    });
                    break;

                default:
                    this.model.set({
                        silent: !0,
                        pName: data.target.value
                    });
                    break;
            }

            this.model.save();

            //通知触发器区域更新
            this.model.set({
                "pUpdateTriggerView": !this.model.get("pUpdateTriggerView")
            });
        },

        ListenPwidth: function () {
            //            console.log($("#width", this.$el));
            $("#width", this.$el).val(this.model.get("pWidth"));
        },
        ListenpHeight: function () {
            $("#height", this.$el).val(this.model.get("pHeight"));
        },
        ListenpLeft: function () {
            $("#left", this.$el).val(this.model.get("pLeft"));
        },
        ListenpTop: function () {
            $("#top", this.$el).val(this.model.get("pTop"));
        },
        ListenUpdateView: function () {
            if (Globle.IsInit) return;
            this.render();
        }
    });

    //具有两种状态的触发器属性view(一般是:点击前,点击后)
    TwoStatusTriggerAttributePanelView = Backbone.View.extend({
        el: function () {
            switch (this.model.get("pType")) {
                case "board": ""
                    return $('#currentPageInfo');
                    break;

                default:
                    return $('#elementInfo');
                    break;
            }
        },
        generateTemplate: function () {
            return _.template($('#TwoStatusTriggerTemplate').html());
        },
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_TwoStatusTriggerTemplate ._addBeforeClickTrigger";
            obj[key] = '_addBeforeClickTrigger';

            key = 'click #' + this.model.get('pid') + "_TwoStatusTriggerTemplate ._addAfterClickTrigger";
            obj[key] = '_addAfterClickTrigger';

            key = 'click #' + this.model.get('pid') + "_TwoStatusTriggerTemplate .glyphicon-pencil";
            obj[key] = 'glyphiconpencilClick';

            key = 'click #' + this.model.get('pid') + "_TwoStatusTriggerTemplate .glyphicon-remove";
            obj[key] = 'glyphiconremoveClick';

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.model.on("change:pUpdateTriggerView", this.pUpdateTriggerView, this);
            this.render();
        },
        render: function () {
            console.log("TwoStatusTriggerAttributePanelView render");
            if (Globle.IsInit) return;
            //            debugger;
            switch (this.$el.attr("id")) {
                case "currentPageInfo":
                    $("#TwoStatusTriggerAttributePanelViewHoldPlaceDivForCurrentPageInfo").empty()
                    .append(this.template(this.model.toJSON()));
                    break;

                case "elementInfo":
                    $("#TwoStatusTriggerAttributePanelViewHoldPlaceDiv").empty()
                    .append(this.template(this.model.toJSON()));
                    break;
            }


            return this;
        },
        pUpdateTriggerView: function () {
            this.render();
        },
        glyphiconremoveClick: function (event) {
            console.log("glyphiconremoveClick");

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
                        //                    alert("ok");
                        console.log(parseInt($(this.get("data").event.target).attr("triggerID")));
                        var TiggerControlAnimationPIDArr = Globle.TriggerModelCollection.get(parseInt($(this.get("data").event.target).attr("triggerID"))).get("ControlAnimationModelArray");
                        if (TiggerControlAnimationPIDArr.length != 0) {
                            var animationModelDelete = _.filter(Globle.AnimationBaseModelCollection.models, function (item) {
                                if (TiggerControlAnimationPIDArr.indexOf(item.id.toString()) >= 0) {
                                    if ((item.get("actionType") == "GoToPage")
                                    || (item.get("actionType") == "PlayControl")
                                    || (item.get("actionType") == "SlideControl")
                                    || (item.get("actionType") == "ChangeSection")) {
                                        return true;
                                    }
                                }
                                return false;
                            });

                            if (animationModelDelete.length > 0) {
                                Globle.Transaction.Begin = !0;
                                _.each(animationModelDelete, function (item) {
                                    item.destroy();
                                });
                                Globle.Transaction.GoDo("delete");

                                if (Globle.LastError.hasError())
                                    Globle.LastError.showError(GetTranslateUI('TDeletemodelerrorpleaserecordthestepscontacttheadministrator') + ".");
                            }
                        }
                        Globle.TriggerModelCollection.remove(Globle.TriggerModelCollection.get(parseInt($(this.get("data").event.target).attr("triggerID"))));
                        if (Globle.LastError.hasError()) {
                            //说明有错误
                            Globle.LastError.ShowError(GetTranslateUI('TNetworkerrornotdeletedsuccessfully') + "!");
                        } else {
                            this.get("data").model.set({ "pUpdateTriggerView": !this.get("data").model.get("pUpdateTriggerView") });
                        }
                    }
                })
            }).showModal(null
                            , {
                                width: "400px",
                                left: "40%"
                            });

        },
        glyphiconpencilClick: function (event) {
            console.log("glyphiconpencilClick");
            //找到model,让用户重新设置
            var tempModel = Globle.TriggerModelCollection.get(parseInt($(event.target).attr("triggerID")));
            tempModel.set({
                "data": this.model,
                silent: !0
            });

            this.ShowPopupModal(tempModel, false);
        },
        _addBeforeClickTrigger: function () {
            console.log('_addBeforeClickTrigger');

            //            if ($(".beforeClickType", "#" + this.model.get('pid') + "_TwoStatusTriggerTemplate")[0]) {
            //                this.glyphiconpencilClick({
            //                    target: $(".beforeClickType", "#" + this.model.get('pid') + "_TwoStatusTriggerTemplate")[0]
            //                });
            //                return;
            //            }

            var TriggerModelObj = new TriggerModel({
                isShowOkButton: !1,
                isShowCancelButton: !0,
                isShowSaveButton: !0,
                pType: "beforeClickTrigger",
                BelongToBoardID: Globle.CurrentBoard.get("pid"),
                BelongToElementID: (function () {
                    switch (this.model.get("pType")) {
                        case "board":
                            return Globle.CurrentBoard.get("pid");
                            break;

                        default:
                            return Globle.CurrentModel.get("pid");
                            break;
                    }
                }).call(this),
                ContentTemplateID: "#TriggerSetParameterTemplate",
                silent: !0,
                title: GetTranslateUI('TTriggerparametersettings'),
                data: this.model
            });
            this.ShowPopupModal(TriggerModelObj, true);
        },
        _addAfterClickTrigger: function () {
            console.log('_addAfterClickTrigger');

            //            if ($(".afterClickType", "#" + this.model.get('pid') + "_TwoStatusTriggerTemplate")[0]) {
            //                this.glyphiconpencilClick({
            //                    target: $(".afterClickType", "#" + this.model.get('pid') + "_TwoStatusTriggerTemplate")[0]
            //                });
            //                return;
            //            }

            var TriggerModelObj = new TriggerModel({
                isShowOkButton: !1,
                isShowCancelButton: !0,
                isShowSaveButton: !0,
                pType: "afterClickTrigger",
                BelongToBoardID: Globle.CurrentBoard.get("pid"),
                BelongToElementID: (function () {
                    switch (this.model.get("pType")) {
                        case "board":
                            return Globle.CurrentBoard.get("pid");
                            break;

                        default:
                            return Globle.CurrentModel.get("pid");
                            break;
                    }
                }).call(this),
                ContentTemplateID: "#TriggerSetParameterTemplate",
                silent: !0,
                title: GetTranslateUI('TTriggerparametersettings'),
                data: this.model
            });
            this.ShowPopupModal(TriggerModelObj, true);
        },
        ShowPopupModal: function (model, isNew) {
            new CommonPopupModalView({ model: model }).showModal(function (m) {
                if (!isNew) {
                    //                    var tempModel = m;
                    //                    var animationArrayID = tempModel.get("ControlAnimationModelArray");
                    //                    var animationModel = Globle.AnimationBaseModelCollection.get(animationArrayID[0]);
                    //                    var isCanSort = animationModel.get("IsCanSort");
                    //                    if (!isCanSort) {
                    //                        $("#selTriggerType option[value='1']").attr("selected", "selected");
                    //                        selectChangeType("1", animationModel.get("GoToPageID"));
                    //                    }
                    var tempModel = m;

                    var animationArrayID = tempModel.get("ControlAnimationModelArray");
                    var animationModel = Globle.AnimationBaseModelCollection.get(animationArrayID[0]);
                    if (animationArrayID.length == 1 && animationModel.get("actionType") == "GoToPage") {
                        $("#selTriggerType option[value='1']").attr("selected", "selected");
                        selectChangeType("1", animationModel.get("GoToPageID"));
                    }
                    else if (animationModel.get("actionType") == "PlayControl") {
                        $("#selTriggerType option[value='2']").attr("selected", "selected");
                        selectChangeType("2");
                    }
                    else if (animationModel.get("actionType") == "SlideControl") {
                        $("#selTriggerType option[value='3']").attr("selected", "selected");
                        selectChangeType("3");
                    }
                    else if (animationModel.get("actionType") == "ChangeSection") {
                        $("#selTriggerType option[value='4']").attr("selected", "selected");
                        selectChangeType("4");
                    }
                    else {
                        $("#selTriggerType option[value='0']").attr("selected", "selected");
                    }
                }
                else {
                    $(":checked", "#divSlidElementControl").not("option").prop("checked", false);
                }
                InitSorted1("#settedAnimationPanelDiv", function (event, ui) {
                    var i = -1;
                    ui.item.parent().children().each(function () {
                        this.attributes['SequenceID'].value = (++i);
                    });
                });
            }
             , {
                 left: "40%",
                 width: "350px",
                 height: "600px"
             });
        }
    });

    //为按钮定义视图,用来执行相应的事件
    var ResourceView = Backbone.View.extend({
        el: $("#topMenuBar"),
        events: {
            "click #btnResourceFile": "btnResourceFileClick",
            "click #btnRichText": "showRichTextClick",
            "click #btnPreviewPage": "previewPageClick",
            "click #btnPreviewPage1": "previewPageClick",
            "click #btnSlid": "SlidButtonClick",
            "click #btnSequence": "SequenceClick",
            "click #btnRotate": "btnRotateClick",
            "click #btnSave": "btnSaveClick",
            "click #btnAudio": "btnAudioClick",
            "click #btnMp4": "btnMp4Click",
            "click #btnAddGlStudio": "btnAddGlStudioClick",
            "click #btnAddCatia": "btnAddCatiaClick",
            "click #btnFlash": "btnFlashClick",
            "click #btnSVG": "btnSVGClick",
            "click #btnLinkRichText": "btnLinkRichText",
            //            "click #btnUpArrow": "btnUpArrow",
            //            "click #btnDownArrow": "btnDownArrow",
            "click #btnLeftArrow": "btnCircleClick",
            //            "click #btnRightArrow": "btnRightArrow",
            "click #btnBugFlag": "btnBugFlag",
            "click #btnBugFlag1": "btnBugFlag",
            "click #btnButton": "btnButtonClick",
            "click #btnLayer": "btnLayerClick",
            "click #btnTimeline": "btnTimelineClick",
            "click #btnEditPage": "btnEditPageClick",
            "click #btnEditLayer": "btnEditLayerClick",
            "click #btnLayerSave": "btnLayerSaveClick",
            //            "click #btnPreviewAllPage": "btnPreviewAllPageClick",
            "click #btnCircle": "btnCircleClick",
            "click #btnBox": "btnCircleClick",
            "click #btnEllipse": "btnCircleClick",
            "click #btnWebForm": "btnWebFormClick",
            "click #btnCorrect": "showRichTextClick",
            "click #btnIncorrect": "showRichTextClick"
        },
        btnWebFormClick: function (event) {
            
            Globle.ClickType = "localResource";

            this.preValid() && this.ShowResourceViewPanel(Globle.ClickType);
        },
        btnCircleClick: function (event) {
            if (!this.preValid()) {
                return;
            }
            Globle.ClickType = "Circle";

            console.log("btnCircleClick:" + event.currentTarget.id);

            //            var ArrowModelObj = new ArrowModel();

            //            ArrowModelObj.set({
            //                pParentElementID: Globle.CurrentBoard.get("pid"),
            //                silent: !0,
            //                pFileUrl: "AnimationResource/images/circle.png",
            //                pType: "Circle",
            //                pElementName: "圆形基本信息",
            //                pName: "圆形工具"
            //            }).save();

            //            this.addToCollection(ArrowModelObj);

            //new 一个用户操作的 SVG model
            //将该model加入到集合中
            var SVGModelObj = new SVGModel();

            SVGModelObj.set({
                pParentElementID: Globle.CurrentBoard.get("pid"),
                silent: !0,
                SequenceID: GetCurrentElementsBigZIndex() + 1,
                IsCanEditWidthHeight: (function () {
                    switch (event.currentTarget.id) {
                        case "btnLeftArrow":
                            //                        case "btnEllipse":
                            return !1;
                            break;
                        default:
                            return !0;
                            break;
                    }
                })(),
                pWidth: (function () {
                    switch (event.currentTarget.id) {
                        case "btnCircle":
                            return 300;
                            break;
                        case "btnEllipse":
                            return 300;
                            break;
                        case "btnBox":
                            return 300;
                            break;
                        case "btnLeftArrow":
                            return 200;
                            break;
                    }
                })(),
                pHeight: (function () {
                    switch (event.currentTarget.id) {
                        case "btnCircle":
                            return 300;
                            break;
                        case "btnEllipse":
                            return 180;
                            break;
                        case "btnBox":
                            return 250;
                            break;
                        case "btnLeftArrow":
                            return 35;
                            break;
                    }
                })(),
                pBorderWidth: (function () {
                    switch (event.currentTarget.id) {
                        case "btnCircle":
                            return 2;
                            break;
                        case "btnEllipse":
                            return 1;
                            break;
                        case "btnBox":
                            return 15;
                            break;
                    }
                })(),
                pType: (function () {
                    switch (event.currentTarget.id) {
                        case "btnCircle":
                            return "Circle";
                            break;

                        case "btnBox":
                            return "Box";
                            break;

                        case "btnLeftArrow":
                            return "AdvanceArrow";
                            break;
                        case "btnEllipse":
                            return "Ellipse";
                            break;
                    }
                })(),
                pElementName: (function () {
                    switch (event.currentTarget.id) {
                        case "btnCircle":
                            return GetTranslateUI('TBasicinformationcircular');
                            break;

                        case "btnBox":
                            return GetTranslateUI('TBasicinformationbox');
                            break;

                        case "btnLeftArrow":
                            return GetTranslateUI('TArrowbasicinformation');
                            break;
                        case "btnEllipse":
                            return GetTranslateUI('TEllipse');
                            break;
                    }
                })(),
                pName: (function () {
                    switch (event.currentTarget.id) {
                        case "btnCircle":
                            return GetTranslateUI('TCircularTools');
                            break;

                        case "btnBox":
                            return GetTranslateUI('TBoxTools');
                            break;

                        case "btnLeftArrow":
                            return GetTranslateUI('TArrowTools');
                            break;
                        case "btnEllipse":
                            return GetTranslateUI('TEllipseTools');
                            break;
                    }
                })()
            }).save();
            AddModelToCollection(SVGModelObj);

        },
        //        btnBoxClick: function () {
        //            if (!this.preValid()) {
        //                return;
        //            }
        //            Globle.ClickType = "Box";

        //            console.log("btnBoxClick");

        //            var ArrowModelObj = new ArrowModel();

        //            ArrowModelObj.set({
        //                pParentElementID: Globle.CurrentBoard.get("pid"),
        //                silent: !0,
        //                pFileUrl: "AnimationResource/images/box.png",
        //                pType: "Box",
        //                pElementName: "方框基本信息",
        //                pName: "方框工具"
        //            }).save();

        //            this.addToCollection(ArrowModelObj);
        //        },
        //        btnPreviewAllPageClick: function () {
        //            window.open();
        //        },
        btnLayerSaveClick: function (callBack) {
            //生成子页面使用;
            //如果当前选中的是root,那么提醒用户要选择layer才能执行生成操作
            if ($.jstree.reference("#layer_demo").get_selected()[0] == 'root') {
                alert(GetTranslateUI('TPleasechoosetoexecutetheresultinglayeronthetreeandthenclickgenerate'));
                return false;
            }
            //            Globle.ClickSaved = !0;
            console.log(event.type);
            //将动态生成的每个page内容,保存为htm 
            //用于显示在pageDesign页面中
            var currentPageContent = GetAllModelHTML()[0];
            currentPageContent = $(Globle.CurrentBoard.toString('board')).append(currentPageContent)[0].outerHTML;

            console.log(currentPageContent);

            var isSuccess = !1;
            var selectedNodeID = $.jstree.reference("#layer_demo").get_selected()[0];

            var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");

            $.ajax({
                async: true,
                method: "post",
                url: trueLocation,
                data: {
                    "actionType": "GenerateLayerHTML",
                    "cbtUnitID": Globle.CbtUnitID,
                    "unitItemPageContentID": $.jstree.reference("#layer_demo").get_node(selectedNodeID).li_attr.UnitItemPageContentID,
                    "currentPageContent": encodeURIComponent(currentPageContent)
                },
                success: function (data) {
                    switch (data.result) {
                        case "commonError":
                            alert(GetTranslateUI('TThenetworkisbusypleasetryagainlater') + "!\r" + data.message);
                            break;
                        case "InterfaceError":
                            alert(GetTranslateUI('TInterfaceexceptionspleasetryagainlater') + "!\r" + data.message);
                            break;

                        default:
                            $('.blockOverlay').attr('title', GetTranslateUI('TGeneratesuccess') + "！");
                            isSuccess = !0;
                            break;
                    }
                },
                complete: function () {
                    //                    $("#iframeModalHelper").css("z-index", "-11111").hide();
                    $.unblockUI();
                    if (isSuccess) {
                        _.isFunction(callBack) && callBack();
                        //                        $("#iframeModalHelper").show().css("z-index", $('.blockOverlay').css("z-index") - 1);
                        $.blockUI({
                            css: {
                                top: '30%',
                                left: "40%",
                                width: "418px",
                                height: "97px",
                                backgroundColor: "#F5EDED",
                                border: "1px solid"
                            },
                            overlayCSS: {
                                backgroundColor: '#FBFBFB',
                                opacity: 0.8
                                //                background: "-webkit-radial-gradient(circle, #FCF8F8, #BBB)"
                            },
                            message: GetTranslateUI('TPleasewaitwhilethefileisbeinggeneratedtemporarilyunabletocarryoutanyoperation') + ".<img src='AnimationResource/images/loading2.gif'/>",
                            timeout: 1000
                            //                            onUnblock: function () {
                            //                                $("#iframeModalHelper").css("z-index", "-11111").hide();
                            //                            }
                        });
                    }
                },
                beforeSend: function () {
                    $.blockUI({
                        css: {
                            top: '30%',
                            left: "40%",
                            width: "418px",
                            height: "97px",
                            backgroundColor: "#F5EDED",
                            border: "1px solid"
                        },
                        overlayCSS: {
                            backgroundColor: '#FBFBFB',
                            opacity: 0.8
                            //                background: "-webkit-radial-gradient(circle, #FCF8F8, #BBB)"
                        },
                        message: GetTranslateUI('TPleasewaitwhilethefileisbeinggeneratedtemporarilyunabletocarryoutanyoperation') + ".<img src='AnimationResource/images/loading2.gif'/>"
                    });
                }
            });
        },
        btnEditLayerClick: function () {
            Globle.MemoCollectionManager.Clear();
            console.log("btnEditLayer");
            $("#jstree_demo").hide().next().show();
            $("#btnSelectPageAndLayer").children("span:first").hide().end().children("span:last").show();
            //隐藏当前画板,隐藏当前属性区域
            $(".pageboard").hide();
            $(".attributeHoldPlace").empty();
            //异步请求服务端,获取当前cbt的layer数据
            //如果获取过,那么就不再重复获取
            if (!$.jstree.reference("#layer_demo"))
                LoadLayer();

            //如果上一次有选中的节点,那么再次选中该节点,否则将Globle.CurrentBoard置为null
            var jstreeObj = $.jstree.reference("#layer_demo");
            var previousSelectedNode = jstreeObj.get_selected();
            if (previousSelectedNode[0] == 'root' || previousSelectedNode[0] == undefined)
                Globle.CurrentBoard = null;
            jstreeObj.deselect_all();
            jstreeObj.select_node(previousSelectedNode);
            //隐藏字幕编辑区域
            Globle.LayoutObj.center.children.layout1.hide("south");
           
            //设置按钮是否可以使用
            SetButtonVisible({ btnLayer: false, btnBugFlag: false, btnBugFlag1: false, btnPageTemplate: false, btnLayerSave: true, btnSave: false, btnCorrect: false, btnIncorrect: false, btnWebForm: false });
          
        },
        btnEditPageClick: function () {
            Globle.MemoCollectionManager.Clear();
            console.log("btnEditPage");
            //隐藏树结构区域
            //显示layer区域
            $("#jstree_demo").show().next().hide();
            $("#btnSelectPageAndLayer").children("span:first").show().end().children("span:last").hide();

            //如果上一次有选中的节点,那么再次选中该节点,否则不做处理
            var jstreeObj = $.jstree.reference("#jstree_demo");
            var previousSelectedNode = jstreeObj.get_selected();
            jstreeObj.deselect_all();
            jstreeObj.select_node(previousSelectedNode);

            Globle.LayoutObj.center.children.layout1.show("south");
            SetButtonVisible({ btnLayerSave: false, btnCorrect: true, btnIncorrect: true, btnWebForm: true });
            
        },
        btnTimelineClick: function () {
            var fileUrl = GenerateRequestURL(window.location.protocol + "//" + window.location.host + "/Lcms/HTMLTemplate/Animation/AnimationResource/page/ShowTimeline.htm");
            var left = parseInt(window.screen.width) - 600;
            var tempWindow = window.open(fileUrl, "", "height=600,width=800,top=0,left=" + left + ",resizable=No,status=No,scrollbars=No");
            tempWindow.focus();
        },
        btnLayerClick: function () {
            Globle.ClickType = "Layer";
            if (!this.preValid())
                return;
            new CommonPopupModalView({
                model: new CommonMessageModal({
                    title: GetTranslateUI('TPleaseselectthelayer'),
                    message: "",
                    isShowSaveButton: !1,
                    isShowCancelButton: !0,
                    isShowOkButton: !0,
                    ContentTemplateID: "#SelectLayerTemplate",
                    data: { "event": event },
                    okEventProcess: function () {
                        if ($("#layerTable :checked").length == 0) {
                            return;
                        }
                        console.log("ok");
                        var arrayObj = new Array();

                        arrayObj.push({
                            id: parseInt($("#layerTable :checked").attr("id")),
                            value: $("#layerTable :checked").attr("value")
                        });
                        CallBack(arrayObj)
                    }
                })
            }).showModal(function () {

                var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");

                //载入层
                $.ajax({
                    method: "post",
                    async: false,
                    url: trueLocation,
                    data: {
                        "actionType": "GetLayer",
                        "cbtUnitID": getQueryString("CbtUnitID")
                    },
                    success: function (data) {
                        $("#tip").text("");
                        if (data.result == "error") {

                        }
                        else {
                            var templateObj = _.template($("#SelectLayerContentTemplate").html());
                            var tempLayerHTML = '';
                            _.each(data, function (item) {
                                tempLayerHTML += templateObj((item));
                            });
                            if (tempLayerHTML == '') {
                                $("#tip").text(GetTranslateUI('TCurrentCbtUnitnotestablishedanylayer'));
                                return;
                            }
                            $("#layerTable").append(tempLayerHTML);
                            //隔行变色
                            $("#layerTable tr:even").addClass("one");
                            $("#layerTable tr:odd").addClass("two");
                        }
                    },
                    complete: function () {

                    },
                    beforeSend: function () {
                        $("#tip").text(GetTranslateUI('TLoading') + "...");
                    }
                });
            }
            , {
                width: "300px",
                left: "40%",
                height: "330px"
            });
        },
        btnButtonClick: function () {
            Globle.ClickType = "Button";
            this.preValid() && this.ShowResourceViewPanel(2);
        },
        btnSVGClick: function () {
            Globle.ClickType = "SVG";
            //GlStudio
            this.preValid() && this.ShowResourceViewPanel(8);
        },
        btnAddGlStudioClick: function () {
            Globle.ClickType = "GlStudio";
            //GlStudio
            this.preValid() && this.ShowResourceViewPanel(6);
        },
        btnFlashClick: function () {
            Globle.ClickType = "Flash";
            //GlStudio
            this.preValid() && this.ShowResourceViewPanel(9);
        },
        btnAddCatiaClick: function () {
            Globle.ClickType = "Catia";
            //GlStudio
            this.preValid() && this.ShowResourceViewPanel(7);
        },
        btnResourceFileClick: function (obj) {
            obj || (obj = {});
            (obj.type == "click") && (obj = {});
            Globle.ClickType = "Resource";
            Globle.CustomTemplate = obj; //由模板内调用,记得用后清空
            this.preValid() && this.ShowResourceViewPanel(11);
        },
        showRichTextClick: function (obj) {

            //            console.log("richText");

            //                    this.preValid() && this.ShowResourceViewPanel();

            obj || (obj = {});

            if (obj.currentTarget && (obj.currentTarget.id == "btnIncorrect" || obj.currentTarget.id == "btnCorrect")) {
                //只针对新添加的menu: 正确和错误
                if (!this.preValid()) {
                    return;
                }
                //                (obj.type == "click") && (obj = {});//免得有太多多余没用的属性
                var richTextObj = new RichTextModel();

                richTextObj.set({
                    pType: (function () {
                        if (obj.currentTarget.id == "btnIncorrect") {
                            return "Incorrect";
                        }
                        else {
                            return "Correct";
                        }
                    })(),
                    pElementName: (function () {
                        if (obj.currentTarget.id == "btnIncorrect") {
                            return GetTranslateUI('TIncorrect'); //显示在右边属性面板中的名字;
                        }
                        else {
                            return GetTranslateUI('TCorrect'); //显示在右边属性面板中的名字;
                        }
                    })(),
                    pIsTriggerControl: !1, //标记该model是否支持作为触发器的触发条件,
                    pTextContent: GetTranslateUI('TCorrectDoubleclickthetextboxtoeditthetext'), //解码后是"预览当前页可以查看效果,双击文本框编辑文本"
                    pName: (function () {
                        if (obj.currentTarget.id == "btnIncorrect") {
                            return GetTranslateUI('TIncorrect'); //显示在右边属性面板中的名字;
                        }
                        else {
                            return GetTranslateUI('TCorrect'); //显示在右边属性面板中的名字;
                        }
                    })(),
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    SequenceID: GetCurrentElementsBigZIndex() + 1,
                    pHeight: 70,
                    silent: !0
                }).save();
                this.addToCollection(richTextObj);
            }
            else {
                (obj.type == "click") && (obj = {});
                if (!this.preValid()) {
                    return;
                }

                var richTextObj = new RichTextModel(obj);

                richTextObj.set({
                    pName: GetTranslateUI('TTextBox'),
                    pParentElementID: Globle.CurrentBoard.get("pid"),
                    SequenceID: GetCurrentElementsBigZIndex() + 1,
                    silent: !0
                }).save();
                this.addToCollection(richTextObj);
            }
        },
        btnLinkRichText: function () {
            if (!this.preValid()) {
                return;
            }
            console.log("btnLinkRichText");
            alert(GetTranslateUI('Subsequentaddfunctionalitynotcurrentlydeveloped'));
        },
        //        btnUpArrow: function () {
        //            if (!this.preValid()) {
        //                return;
        //            }
        //            Globle.ClickType = "UpArrow";

        //            console.log("btnUpArrow");

        //            var ArrowModelObj = new ArrowModel();

        //            ArrowModelObj.set({
        //                pParentElementID: Globle.CurrentBoard.get("pid"),
        //                silent: !0,
        //                pFileUrl: "AnimationResource/images/arrow_up.png",
        //                pArrowDirect: "up"
        //            }).save();

        //            this.addToCollection(ArrowModelObj);
        //        },
        //        btnDownArrow: function () {
        //            if (!this.preValid()) {
        //                return;
        //            }
        //            console.log("btnDownArrow");

        //            Globle.ClickType = "DownArrow"

        //            var ArrowModelObj = new ArrowModel();

        //            ArrowModelObj.set({
        //                pParentElementID: Globle.CurrentBoard.get("pid"),
        //                silent: !0,
        //                pFileUrl: "AnimationResource/images/arrow_down.png",
        //                pArrowDirect: "down"
        //            }).save();
        //            this.addToCollection(ArrowModelObj);
        //        },
        //        btnLeftArrow: function () {
        //            if (!this.preValid()) {
        //                return;
        //            }
        //            console.log("btnLeftArrow");
        //            Globle.ClickType = "LeftArrow"

        //            var ArrowModelObj = new ArrowModel();

        //            ArrowModelObj.set({
        //                pParentElementID: Globle.CurrentBoard.get("pid"),
        //                silent: !0,
        //                pFileUrl: "AnimationResource/images/arrow_left.png",
        //                pArrowDirect: "left"
        //            }).save();

        //            this.addToCollection(ArrowModelObj);
        //        },
        addToCollection: function (tm) {
            if (Globle.LastError.hasError()) {
                //说明有错误
                Globle.LastError.ShowError();
            }
            else {
                Globle.MemoCollectionManager.AddMemo(ElementBaseModel.CreateMemo(tm, "Create"));
                Globle.CurrentModel = tm;

                Globle.AllModelCollection.add(tm);
            }
        },
        //        btnRightArrow: function () {
        //            if (!this.preValid()) {
        //                return;
        //            }
        //            console.log("btnRightArrow");

        //            Globle.ClickType = "RightArrow"

        //            var ArrowModelObj = new ArrowModel();

        //            ArrowModelObj.set({
        //                pParentElementID: Globle.CurrentBoard.get("pid"),
        //                silent: !0,
        //                pFileUrl: "AnimationResource/images/arrow_right.png",
        //                pArrowDirect: "right"
        //            }).save();

        //            this.addToCollection(ArrowModelObj);
        //        },
        btnBugFlag: function () {
            if (!this.preValid()) {
                return;
            }
            console.log("btnBugFlag");

            Globle.ClickType = "BugFlag"

            var BugFlagModelObj = new BugFlagModel();

            BugFlagModelObj.set({
                pParentElementID: Globle.CurrentBoard.get("pid"),
                SequenceID: GetCurrentElementsBigZIndex() + 1,
                silent: !0
            }).save();
            this.addToCollection(BugFlagModelObj);

        },
        previewPageClick: function () {
            //            this.preValid() && PreviewCurrentPageALLAction();
            if (!this.preValid()) {
                return;
            }
            var data = {};
            if (Globle.CurrentBoard.get("pType") == "layer") {
                data = {
                    PageIDArray: _.map($.jstree.reference("#layer_demo").get_json()[0].children, function (item) { return item.id }),
                    CurrentPageID: $.jstree.reference("#layer_demo").get_selected()[0],
                    CbtUnitID: Globle.CbtUnitID,
                    Type: "layer"
                };
                this.btnLayerSaveClick(function () {
                    var sUrl = "PreviewAllPage.htm?data=" + encodeURI(JSON.stringify(data));
                    var popWindow = window.open(sUrl, "", "height=" + 800 + ",width=" + 1200 + ",top=" + 0 + ",left=" + 0 + ",resizable=No,status=No,scrollbars=No");

                    try {
                        popWindow.focus();
                    } catch (e) {
                        alert(GetTranslateUI("TWindowBlockPop"));
                    }

                });
            }
            else {
                data = {
                    PageIDArray: _.map($.jstree.reference("#jstree_demo").get_json(), function (item) { return item.id }),
                    CurrentPageID: $.jstree.reference("#jstree_demo").get_selected()[0],
                    CbtUnitID: Globle.CbtUnitID,
                    Type: "page"
                };
                this.btnSaveClick({ type: "previewPageClick" }, function () {
                    var sUrl = "PreviewAllPage.htm?data=" + encodeURI(JSON.stringify(data));
                    var popWindow = window.open(sUrl, "", "height=" + 800 + ",width=" + 1200 + ",top=" + 0 + ",left=" + 0 + ",resizable=No,status=No,scrollbars=No");

                    try {
                        popWindow.focus();
                    } catch (e) {
                        alert(GetTranslateUI("TWindowBlockPop"));
                    }
                });
            }
        },
        preValid: function () {
            if (!Globle.CurrentBoard) {
                //如果没有选中当前画板,那么提示用户要先选择一个page
                //                        alert("请先选择一个Page");
                $("#alertMessagePanel")
                .on('show.bs.modal', function (e) {
                    $("#Div3", e.currentTarget).html(GetTranslateUI('TFirstselectapage') + "!");
                    $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);
                })
                .on('hide.bs.modal', function (e) {
                    $("#iframeModalHelper").show().css("z-index", "-111");
                    $(e.currentTarget).unbind("hide.bs.modal").unbind("show.bs.modal");
                })
                .modal("show");
                return false;
            }
            if (Globle.MaxElementNumberPerPage <= GetCurrentBoardAllElements().length) {
                $("#alertMessagePanel")
                .on('show.bs.modal', function (e) {
                    $("#Div3", e.currentTarget).html(GetTranslateUI('TThenumberofelementsexceedsthethresholdcurrentpage') + ":" + Globle.MaxElementNumberPerPage + ".</br>" + GetTranslateUI('TToomanyelementsmayresultwhenlearningcoursewarecoursewareloadsslowlypleasedeleteunnecessaryelements'));
                    $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);
                })
                .on('hide.bs.modal', function (e) {
                    $("#iframeModalHelper").show().css("z-index", "-111");
                    $(e.currentTarget).unbind("hide.bs.modal").unbind("show.bs.modal");
                })
                .modal("show");

                return false;
            }

            if (!checkAllElementLegal()) {
                return false;
            }

            return true;
        },
        SlidButtonClick: function () {
            Globle.ClickType = "Slid";
            //幻灯片
            this.preValid() && this.ShowResourceViewPanel(3);
        },
        btnRotateClick: function () {
            Globle.ClickType = "Rotate";
            //图片轮转
            this.preValid() && this.ShowResourceViewPanel(3);
        },
        SequenceClick: function () {
            Globle.ClickType = "Sequence";
            this.preValid() && this.ShowResourceViewPanel(2);
        },
        btnAudioClick: function () {
            Globle.ClickType = "Audio";
            this.preValid() && this.ShowResourceViewPanel(5);
        },
        btnMp4Click: function () {
            Globle.ClickType = "Video";
            this.preValid() && this.ShowResourceViewPanel(4);
        },
        ShowResourceViewPanel: function (type) {
            //            $('#ResourceFilePanel').on('show.bs.modal', function (e) {

            //                //                console.log("show");
            //                $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);
            //            }).on('hide.bs.modal', function (e) {
            //                //                console.log("hide");

            //                $(e.currentTarget).unbind("hide.bs.modal").unbind("show.bs.modal");

            //                $("#iframeModalHelper").css("z-index", "-11111").hide();
            //            }).modal("show");
            //弹出素材选择界面
            openSelectResource(type);
        },
        btnSaveClick: function (event, callBack) {
            //画板的生成方法
            if ((!Globle.CurrentBoard) || (Globle.CurrentBoard.attributes.pType == "layer")) {
                alert(GetTranslateUI('TPleasefirstselectapageandthentogenerateoperating') + "!");
                return;
            }

            Globle.ClickSaved = !0;
            console.log(event.type);
            //将动态生成的每个page内容,保存为htm 
            //用于显示在pageDesign页面中
            var currentPageContent = GetAllModelHTML(!0)[0];
            currentPageContent = $(Globle.CurrentBoard.toString()).append(currentPageContent)[0].outerHTML;
            //用于显示在打包完成后,包含js动作的内容
            var currentPageDynamicContent = GetAllModelHTML()[0];
            currentPageDynamicContent = $(Globle.CurrentBoard.toString()).append(currentPageDynamicContent)[0].outerHTML;

            console.log(currentPageContent);

            var isSuccess = !1;
            var selectedNodeID = $.jstree.reference("#jstree_demo").get_selected()[0];

            var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");

            $.ajax({
                async: true,
                method: "post",
                url: trueLocation,
                data: {
                    "actionType": "GenerateHTML",
                    "cbtUnitID": Globle.CbtUnitID,
                    "UnitItemID": parseInt(selectedNodeID),
                    "unitItemPageContentID": $.jstree.reference("#jstree_demo").get_node(selectedNodeID).li_attr.UnitItemPageContentID,
                    "currentPageContent": encodeURIComponent(currentPageContent),
                    "currentPageDynamicContent": encodeURIComponent(currentPageDynamicContent)
                },
                success: function (data) {
                    switch (data.result) {
                        case "commonError":
                            alert(GetTranslateUI('TThenetworkisbusypleasetryagainlater') + "!\r" + data.message);
                            break;
                        case "InterfaceError":
                            alert(GetTranslateUI('TInterfaceexceptionspleasetryagainlater') + "!\r" + data.message);
                            break;

                        default:
                            $('.blockOverlay').attr('title', GetTranslateUI('TGeneratesuccess') + "！");
                            isSuccess = !0;
                            break;
                    }
                },
                complete: function () {
                    //                    $("#iframeModalHelper").css("z-index", "-11111").hide();
                    $.unblockUI();
                    if (isSuccess) {
                        _.isFunction(callBack) && callBack();
                        //                        return;
                        $.blockUI({
                            css: {
                                top: '30%',
                                left: "40%",
                                width: "418px",
                                height: "97px",
                                //                            fontSize: "13px"
                                backgroundColor: "#F5EDED",
                                border: "1px solid"
                            },
                            overlayCSS: {
                                backgroundColor: '#FBFBFB',
                                opacity: 0.8
                                //                background: "-webkit-radial-gradient(circle, #FCF8F8, #BBB)"
                            },
                            message: GetTranslateUI('TGeneratesuccess') + "！<img src='AnimationResource/images/loading2.gif'/>",
                            timeout: 1000
                            //                            onUnblock: function () {
                            //                                $("#iframeModalHelper").css("z-index", "-11111").hide();
                            //                            }
                        });
                    }
                },
                beforeSend: function () {
                    $.blockUI({
                        css: {
                            top: '30%',
                            left: "40%",
                            width: "418px",
                            height: "97px",
                            //                            fontSize: "13px"
                            backgroundColor: "#F5EDED",
                            border: "1px solid"
                        },
                        overlayCSS: {
                            backgroundColor: '#FBFBFB',
                            opacity: 0.8
                            //                background: "-webkit-radial-gradient(circle, #FCF8F8, #BBB)"
                        },
                        message: GetTranslateUI('TPleasewaitwhilethefileisbeinggeneratedtemporarilyunabletocarryoutanyoperation') + ".<img src='AnimationResource/images/loading2.gif'/>"
                    });
                }
            });
        }
    });
    ResourceViewInstance = new ResourceView();

    if (window.location.href.indexOf("ModalContainerForAnimation.htm") >= 0) {
        Globle.LayoutObj = $('#container').layout({
            applyDemoStyles: true,
            west__size: 215,
            east__size: 300,
            north__size: 50,
            west__resizable: false,
            east__resizable: false,
            north__resizable: false,
            center__childOptions: {
                center__paneSelector: "#plscreen",
                south__paneSelector: "#PanelSection",
                south__size: 110
            }
        });

        var trueLocation = GenerateRequestURL("/lcms/Files/CBTUnitStructure.aspx");


        $('#jstree_demo').jstree({
            "plugins": ["state", "types", "wholerow", "themes"],
            "core": {
                //            "themes": {
                //                "dir": false,
                //                "dots": false,
                //                "stripes": false,
                //                "variant": false
                //            },
                "animation": 0,
                //            "check_callback": true,
                "data": {
                    "url": trueLocation,
                    "data": function ($node) {
                        return {
                            "action": "getstructureForTemplate",
                            "topicID": $node.attr ? $node.attr("id") : Globle.UnitTopicID,
                            "rand": Math.random()
                        };
                    },
                    "error": function (request, status, exception) {
                        if (exception != "") {
                            alert('getstructure(): ' + status.toString());
                        }
                    }

                }
            },
            "types": {
                "root": {
                    "icon": "AnimationResource/images/Organizaton.png",
                    "valid_children": ["topic"]
                },
                "topic": {
                    "icon": "AnimationResource/images/topic.png",
                    "valid_children": ["page", "topic"]
                },
                "page": {
                    "icon": "AnimationResource/images/page.png",
                    "valid_children": []
                }
            }
        })
            .on('select_node.jstree', function (e, data) {
                //                alert(data.instance.get_node(data.selected[0]).id);

                //                console.log(data.instance.get_node(data.selected[0]).text);
                Globle.CopyElement = null;
                Globle.CopyAction = null;
                var selectedNode = data.instance.get_node(data.selected[0]);
                //查找是否已存在画板,不存在新建一个
                ClickTreeNode({
                    id: selectedNode.id,
                    UnitItemPageContentID: selectedNode.li_attr.UnitItemPageContentID,
                    node: selectedNode,
                    isClicked: selectedNode.isClicked ? !0 : !1
                });
                //标记节点是否点击过
                selectedNode.isClicked = !0;

                //请求后台,请求当前页面的脚本描述内容
                RenderScriptDescription({ id: selectedNode.id });
                //请求得到当前page的字幕
                LoadExistedSection();
            })
        //          .on("ready.jstree", function (e, data) {
        //              console.log(e.name);
        //              $.blockUI({ message: "载入CBT结构数据,请稍后..." });
        //          })
          .on("loaded.jstree", function (e, data) {
              //              console.log(e.name);
              //              $.unblockUI();
              //              $.unblockUI();
              //              Globle.AllResourceLoaded = !0;
              //树载入完毕后,初始化选中的page
              console.log("loaded");
              //开始循环载入所有的page相关的信息,等待该方法执行结束
              //                InitModel(_.map(data.instance.get_json(), function (n) { return n.id }));

              data.instance.select_node("#" + getQueryString("PageID") + "");
          });
    }

    if (window.location.href.indexOf("ModalContainerForAnimation.htm") >= 0) {

        ResourceTreeInit($('#resourceTree')[0]);

        $("#inactionArea").contextMenu({
            selector: '.ui-selected',
            autoHide: !0,
            show: function (e) {
                //                switch (Globle.CurrentModel.get("pType")) {
                //                    case "Board":
                //                        this.items.fold1.remove();
                //                        break;
                //                }
            },
            callback: function (key, options) {
                switch (key) {
                    case "ToLeft":
                        //靠左对齐
                        //处理逻辑:
                        //1. 得到所有的选中元素;
                        //2. 计算出最左边的元素的left;
                        //3. 将第一步得到的元素, 统一设置第二步得到的元素;
                        var selectedElements = $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected");
                        var MinLeft = Number.MAX_VALUE;
                        $.each(selectedElements, function (index, item) {
                            if (parseInt($(item).css("left")) < MinLeft) {
                                MinLeft = parseInt($(item).css("left"));
                            }
                        });
                        Globle.Transaction.Begin = !0;
                        $.each(selectedElements, function (index, item) {
                            $(item).css({ "left": MinLeft })
                            item = Globle.AllModelCollection.get(parseInt($(item).attr("id")));
                            item.set({ "pLeft": MinLeft }).save();
                        });
                        Globle.Transaction.GoDo('mix');
                        break;
                    case "ToRight":
                        //靠右对齐
                        //处理逻辑:
                        //1. 得到所有的选中元素;
                        //2. 计算出(元素的left+该元素的宽度)的最大值, 等于所有元素应该到达的最右边边框值
                        //3. 将第一步得到的元素, 统一设置第二步得到的元素;
                        var selectedElements = $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected");
                        var MaxLeft = Number.MIN_VALUE;
                        $.each(selectedElements, function (index, item) {
                            var $item = $(item);
                            var tempLeft = (parseInt($item.css("left"))) + (parseInt($item.css("width")))
                            if (tempLeft > MaxLeft) {
                                MaxLeft = tempLeft;
                            }
                        });

                        Globle.Transaction.Begin = !0;
                        $.each(selectedElements, function (index, item) {
                            var $item = $(item);
                            var tempLeft = MaxLeft - parseInt($item.css("width"));
                            $item.css({ "left": tempLeft });
                            item = Globle.AllModelCollection.get(parseInt($item.attr("id")));
                            item.set({ "pLeft": tempLeft }).save();
                        });
                        Globle.Transaction.GoDo('mix');
                        break;
                    case "ToUp":
                        var selectedElements = $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected");
                        var MinLeft = Number.MAX_VALUE;
                        $.each(selectedElements, function (index, item) {
                            if (parseInt($(item).css("top")) < MinLeft) {
                                MinLeft = parseInt($(item).css("top"));
                            }
                        });
                        Globle.Transaction.Begin = !0;
                        $.each(selectedElements, function (index, item) {
                            $(item).css({ "top": MinLeft })
                            item = Globle.AllModelCollection.get(parseInt($(item).attr("id")));
                            item.set({ "pTop": MinLeft }).save();
                        });
                        Globle.Transaction.GoDo('mix');
                        break;
                    case "ToDown":
                        //靠下对齐
                        //处理逻辑:
                        //1. 得到所有的选中元素;
                        //2. 计算出(元素的top+该元素的高度)的最大值, 等于所有元素应该到达的最下边边框值
                        //3. 将第一步得到的元素, 统一设置第二步得到的元素;
                        var selectedElements = $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected");
                        var MaxTop = Number.MIN_VALUE;
                        $.each(selectedElements, function (index, item) {
                            var $item = $(item);
                            var tempLeft = (parseInt($item.css("top"))) + (parseInt($item.css("height")))
                            if (tempLeft > MaxTop) {
                                MaxTop = tempLeft;
                            }
                        });

                        Globle.Transaction.Begin = !0;
                        $.each(selectedElements, function (index, item) {
                            var $item = $(item);
                            var tempLeft = MaxTop - parseInt($item.css("height"));
                            $item.css({ "top": tempLeft });
                            item = Globle.AllModelCollection.get(parseInt($item.attr("id")));
                            item.set({ "pTop": tempLeft }).save();
                        });
                        Globle.Transaction.GoDo('mix');
                        break;
                    case "ToCenterByElement":
                        //垂直居中: 所有元素的中心点水平移动到以画板中心点的垂直线上;
                        //处理逻辑:
                        //1. 得到画板的中心点坐标;
                        //2. 移动选中元素到目标位置;
                        var BoardCenterTolerance = parseInt(Globle.CurrentBoard.get("pWidth") / 2);
                        var selectedElements = $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected");

                        Globle.Transaction.Begin = !0;
                        $.each(selectedElements, function (index, item) {
                            var $item = $(item);
                            var tempToleranceLeft = parseInt($item.css("left")) + parseInt(BoardCenterTolerance - parseInt($item.css("Left")) - parseInt($item.css("Width")) / 2);
                            $item.css({ "left": tempToleranceLeft });
                            item = Globle.AllModelCollection.get(parseInt($item.attr("id")));
                            item.set({ "pLeft": tempToleranceLeft }).save();
                        });
                        Globle.Transaction.GoDo('mix');
                        break;

                    case "ToCenterByBoard":
                        //水平居中: 所有元素的中心点垂直移动到以(画板)的中心点的水平线上;

                        //处理逻辑:
                        //1. 得到画板的中心点坐标;
                        //2. 移动选中元素到目标位置;
                        var BoardCenterTolerance = parseInt(Globle.CurrentBoard.get("pHeight") / 2);
                        var selectedElements = $("#" + Globle.CurrentBoard.get("pid")).children(".ui-selected");

                        Globle.Transaction.Begin = !0;
                        $.each(selectedElements, function (index, item) {
                            var $item = $(item);
                            var tempToleranceLeft = parseInt($item.css("top")) + parseInt(BoardCenterTolerance - parseInt($item.css("top")) - parseInt($item.css("height")) / 2);
                            $item.css({ "top": tempToleranceLeft });
                            item = Globle.AllModelCollection.get(parseInt($item.attr("id")));
                            item.set({ "pTop": tempToleranceLeft }).save();
                        });
                        Globle.Transaction.GoDo('mix');
                        break;
                }
            },
            items: {
                "ToLeft": {
                    "name": GetTranslateUI("ToLeft"), icon: "",
                    disabled: function (e) {
                        //只有处于多选状态的元素, 才可使用该选项
                    }
                },
                "ToRight": {
                    "name": GetTranslateUI("ToRight"), icon: "",
                    disabled: function () {
                        //只有处于多选状态的元素, 才可使用该选项
                    }
                },
                "ToUp": {
                    "name": GetTranslateUI("ToUp"), icon: "",
                    disabled: function () {
                        //只有处于多选状态的元素, 才可使用该选项
                    }
                },
                "ToDown": {
                    "name": GetTranslateUI("ToDown"), icon: "",
                    disabled: function () {
                        //只有处于多选状态的元素, 才可使用该选项
                    }
                },
                "ToCenterByElement": {
                    "name": GetTranslateUI("ToCenterByElement"), icon: "",
                    disabled: function () {
                        //只有处于多选状态的元素, 才可使用该选项
                    }
                },
                "ToCenterByBoard": {
                    "name": GetTranslateUI("ToCenterByBoard"), icon: "",
                    disabled: function () {
                        //只有处于多选状态的元素, 才可使用该选项
                    }
                }
            }
        });

        //为所有元素,绑定一个右键上下文菜单.放在各自的view中也可以,但是总体写一个觉得比较好
        $("#inactionArea").contextMenu({
            selector: '.pcontent,.pageboard',
            autoHide: !0,
            show: function () {
                //                switch (Globle.CurrentModel.get("pType")) {
                //                    case "Board":
                //                        this.items.fold1.remove();
                //                        break;
                //                }
            },
            callback: function (key, options) {
                //                var m = "clicked: " + key;
                //                window.console && console.log(m) || alert(m);

                //                return;

                switch (key) {
                    case "zindexTop": //置于顶层
                    case "zindexBottom":
                    case "zindexPrev":
                    case "zindexNext":
                        switch (key) {
                            case "zindexTop": //置于顶层
                                SetZindex(Globle.CurrentModel.get("pid"), 'movefront');
                                break;
                            case "zindexBottom":
                                SetZindex(Globle.CurrentModel.get("pid"), 'moveback');
                                break;
                            case "zindexPrev":
                                SetZindex(Globle.CurrentModel.get("pid"), 'moveforward');
                                break;
                            case "zindexNext":
                                SetZindex(Globle.CurrentModel.get("pid"), 'movebackward');
                                break;
                        }
                        //按照最新设置的zindex,重新设置每个model的SequenceID

                        Globle.Transaction.Begin = !0;
                        _.each(Globle.AllModelCollection.where({ "pParentElementID": Globle.CurrentBoard.get("pid") }), function (item) {
                            item.attributes.SequenceID = document.getElementById(item.attributes.pid).style.zIndex;
                            item.save();
                        });
                        Globle.Transaction.GoDo('mix');

                        break;

                    case "copy": //复制元素
                        copyElement();
                        break;
                        //                    case "CopyAction": //复制动作                                                                                                                                                                                                    
                        //                        Globle.CopyAction = GetActionsByRelateElementID(null, null);                                                                                                                                                                                                    

                        //                        break;                                                                                                                                                                                                    
                    case "paster": //粘贴元素
                        pasterElement();

                        break;
                        //                    case "PasteAction": //粘贴动作                                                                                                                                                                                                   
                        //                                                                                                                                                                                                                           
                        //                        break;                                                                                                                                                                                                   
                    case "delete":
                        //删除当前元素model,把该model关联的所有动画model也全部删除
                        //也要删除关联的所有触发器,这些删除操作放在remove监听事件里处理
                        new CommonPopupModalView({
                            model: new CommonMessageModal({
                                title: GetTranslateUI('TWarning'),
                                message: GetTranslateUI('TConfirmdeleteit') + "?",
                                isShowSaveButton: !1,
                                isShowCancelButton: !0,
                                isShowOkButton: !0,
                                ContentTemplateID: "#SureMessageModalTemplate",
                                okEventProcess: function () {

                                    var tempCurrentModel = Globle.CurrentModel;
                                    Globle.AllModelCollection.remove(Globle.CurrentModel);
                                    if (Globle.LastError.hasError()) {
                                        //说明有错误
                                        Globle.LastError.ShowError(GetTranslateUI('TNetworkerrornotdeletedsuccessfully'));
                                    }
                                    else
                                        Globle.MemoCollectionManager.AddMemo(ElementBaseModel.CreateMemo(tempCurrentModel, "Delete"));
                                }
                            })
                        }).showModal(null
                            , {
                                width: "400px",
                                left: "40%"
                            });
                        break;
                    default:
                        alert(GetTranslateUI('TInvalidcommand'));
                        break;
                }
            },
            items: {
                //             "zindexTop": { name: "置于顶层", icon: "glyphicon glyphicon-open" },
                //                "zindexBottom": { name: "置于低层", icon: "glyphicon glyphicon-save" },
                //                "zindexPrev": { name: "上移一层", icon: "glyphicon glyphicon-arrow-up" },
                //                "zindexNext": { name: "下移一层", icon: "glyphicon glyphicon-arrow-down" },
                //                "sep1": "---------",
                //                "copy": { name: "复制", icon: "glyphicon glyphicon-copyright-mark" },
                //                "paste": { name: "粘贴", icon: "glyphicon glyphicon-book" },
                //                "delete": { name: "删除", icon: "glyphicon glyphicon-remove" }
                //            "edit": { name: "Edit", icon: "edit" },
                "zindexTop": {
                    name: GetTranslateUI('TBringtoFront'), icon: "", disabled: function () {
                        //                    return true;
                        //画板没有该功能
                        //音频元素没有该功能
                        if (Globle.CurrentModel == null)
                            return true;
                        else if (Globle.CurrentModel.attributes.pType == 'Audio'
                        || Globle.CurrentModel.attributes.pType == 'Video') {
                            return true;
                        }
                        else if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board'
                         || Globle.CurrentBoard.attributes.pType == 'layer')) {
                            return true;
                        }
                        else
                            return false;
                    }
                },
                "zindexBottom": {
                    name: GetTranslateUI('TSendtoBack'), icon: "", disabled: function () {
                        //                    return true;
                        //画板没有该功能
                        //音频元素没有该功能
                        if (Globle.CurrentModel == null)
                            return true;
                        else if (Globle.CurrentModel.attributes.pType == 'Audio'
                        || Globle.CurrentModel.attributes.pType == 'Video') {
                            return true;
                        }
                        else if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board'
                         || Globle.CurrentBoard.attributes.pType == 'layer')) {
                            return true;
                        }
                        else
                            return false;
                    }
                },
                "zindexPrev": {
                    name: GetTranslateUI('TBringtoaFront'), icon: "", disabled: function () {
                        //                    return true;
                        //画板没有该功能
                        //音频元素没有该功能
                        if (Globle.CurrentModel == null)
                            return true;
                        else if (Globle.CurrentModel.attributes.pType == 'Audio'
                        || Globle.CurrentModel.attributes.pType == 'Video') {
                            return true;
                        }
                        else if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board'
                         || Globle.CurrentBoard.attributes.pType == 'layer')) {
                            return true;
                        }
                        else
                            return false;
                    }
                },
                "zindexNext": {
                    name: GetTranslateUI('TSendtoaBack'), icon: "", disabled: function () {
                        //                    return true;
                        //画板没有该功能
                        //音频元素没有该功能
                        if (Globle.CurrentModel == null)
                            return true;
                        else if (Globle.CurrentModel.attributes.pType == 'Audio'
                        || Globle.CurrentModel.attributes.pType == 'Video') {
                            return true;
                        }
                        else if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board'
                         || Globle.CurrentBoard.attributes.pType == 'layer')) {
                            return true;
                        }
                        else
                            return false;
                    }
                },
                "sep1": "---------",
                "copy": {
                    "name": GetTranslateUI('TCopy'), icon: "",
                    //                    "items": {
                    //                        "CopyElement": { name: "复制元素", icon: "",
                    //                            disabled: function () {
                    //                                if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board' || Globle.CurrentBoard.attributes.pType == 'layer')) {
                    //                                    return true;
                    //                                }
                    //                                switch (Globle.CurrentModel.get("pType")) {

                    //                                    case "Arrow":
                    //                                    case "Box":
                    //                                    case "Circle":
                    //                                    case "BugFlag": //bug标签
                    //                                    case "RichText":
                    //                                        return true; //禁用
                    //                                        break;
                    //                                }
                    //                            }
                    //                        },
                    //                        "CopyAction": { name: "复制动作", icon: "",
                    //                            disabled: function () {
                    //                                if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board' || Globle.CurrentBoard.attributes.pType == 'layer')) {
                    //                                    return true;
                    //                                }
                    //                                switch (Globle.CurrentModel.get("pType")) {                                                                                                                        
                    //                                    case "ImageRotate": //滑动轮转
                    //                                    case "Audio": //音频
                    //                                    case "ImageSlide": //幻灯片
                    //                                    case "BugFlag": //bug标签
                    //                                    case "Flash": //Flash
                    //                                    case "Catia":
                    //                                    case "ImageSequence": //序列帧
                    //                                    case "GlStudio":
                    //                                    case "SVG":
                    //                                    case "ButtonType":
                    //                                        return true; //禁用
                    //                                        break;
                    //                                }
                    //                            }
                    //                        }
                    //                    },
                    disabled: function () {//控制整体是否显示复制菜单
                        if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board' || Globle.CurrentBoard.attributes.pType == 'layer')) {
                            return true;
                        }
                        switch (Globle.CurrentModel.get("pType")) {
                            //case "Arrow": //2014.8.11 AM 10:59和贝贝讨论这版先把这三个小工具的复制去掉，等商飞提出再求改                                                                                                                                                                             
                            //                            case "Box":                                                
                            //                            case "Circle":                                                
                            case "BugFlag":
                                return true; //禁用
                                break;
                        }
                    }
                },
                "paster": {
                    "name": GetTranslateUI('TPaste'), icon: "",
                    //                    "items": {
                    //                        "PasteElement": { name: "粘贴元素", icon: "",
                    //                            disabled: function () {//控制整体是否显示粘贴菜单
                    //                                if (Globle.CopyElement == null) {
                    //                                    return true;
                    //                                } else {
                    //                                    if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board' || Globle.CurrentBoard.attributes.pType == 'layer')) {
                    //                                        return false;
                    //                                    }
                    //                                    switch (Globle.CurrentModel.get("pType")) {
                    //                                        case "RichText":
                    //                                        case "Arrow":
                    //                                        case "Box":
                    //                                        case "Circle":
                    //                                            return true; //禁用
                    //                                            break;
                    //                                    }
                    //                                }
                    //                            }
                    //                        },
                    //                        "PasteAction": { name: "粘贴动作", icon: "",
                    //                            disabled: function () {
                    //                                if (Globle.CopyAction == null) {
                    //                                    return true;
                    //                                } else {
                    //                                    if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board' || Globle.CurrentBoard.attributes.pType == 'layer')) {
                    //                                        return true;
                    //                                    }
                    //                                    switch (Globle.CurrentModel.get("pType")) {
                    //                                        //                                        case "Video": //视频                                                                                                                          
                    //                                        case "ImageRotate": //滑动轮转
                    //                                        case "Audio": //音频
                    //                                        case "ImageSlide": //幻灯片
                    //                                        case "BugFlag": //bug标签
                    //                                        case "Flash": //Flash
                    //                                        case "Catia":
                    //                                        case "ImageSequence": //序列帧
                    //                                        case "GlStudio":
                    //                                        case "SVG":
                    //                                        case "ButtonType":
                    //                                            return true; //禁用
                    //                                            break;
                    //                                    }
                    //                                }
                    //                            }
                    //                        }
                    //                    },
                    disabled: function () {//控制整体是否显示粘贴菜单
                        if (Globle.CopyElement == null && Globle.CopyAction == null) {
                            return true;
                        } else {
                            if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board' || Globle.CurrentBoard.attributes.pType == 'layer')) {
                                return false;
                            }
                            switch (Globle.CurrentModel.get("pType")) {
                                //case "Arrow": //2014.8.11 AM 10:59和贝贝讨论这版先把这三个小工具的复制去掉，等商飞提出再求改                                                                                                                                                                             
                                //                                case "Box":                                                
                                //                                case "Circle":                                                
                                case "BugFlag":
                                    return true;
                                    break;
                            }
                        }
                    }
                },
                "delete": {
                    name: GetTranslateUI('Tdelete'), icon: "",
                    disabled: function () {//控制整体是否显示粘贴菜单
                        if (Globle.CurrentModel == null && (Globle.CurrentBoard.attributes.pType == 'board' || Globle.CurrentBoard.attributes.pType == 'layer')) {
                            return true;
                        }
                    }
                }
            }
        });
    }


});