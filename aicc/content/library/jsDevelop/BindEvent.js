//该js专门绑定事件使用
//该js文件不会再最终生成的课件页面引入
$(function () {
    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        modal_this = this
        $(document).on('focusin.modal', function (e) {
            if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
                &&
                !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                modal_this.$element.focus()
            }
        })
    };
    $("body").on("keyup", ".pValidPositiveFloat,.pValidForbidSpecialCharacter,.pValidPositiveAndNegativeNumbers,.pValidOnlyInputThreeNumPositiveInt,.pValidPositiveAndNegativeNumbersForBoard,.pMaxIsFiveHundred,.pMaxIsOneHundred,.pMaxIsFifty", function (eve) {
        var target = $(eve.target);

        if (target.hasClass("pValidPositiveFloat")) {
            //                    console.log(/^\d+[.]?\d*/.exec($(target).val()));
            $(target).val(/^\d+[.]?\d*/.exec($(target).val()));
        }
        if (target.hasClass("pValidForbidSpecialCharacter")) {
            var pattern = new RegExp("[`~!@#$^&*()=_|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]");

            $(target).val($(target).val().replace(pattern, ''));
        }
        if (target.hasClass("pValidPositiveAndNegativeNumbers")) {
            //                    console.log(/^\d+[.]?\d*/.exec($(target).val()));
            $(target).val(/^[-+]?[0-9]*/.exec($(target).val()));   //验证正负整数 0 负数输入4位 正数输入3位
            if ($(target).val().indexOf("-") == 0) {
                if ($(target).val().length > 4) {
                    $(target).val($(target).val().substring(0, 4));
                }
            } else if ($(target).val().length > 3) {
                $(target).val($(target).val().substring(0, 3));
            }
        }
        if (target.hasClass("pValidPositiveAndNegativeNumbersForBoard")) {
            //                    console.log(/^\d+[.]?\d*/.exec($(target).val()));
            $(target).val(/^[-+]?[0-9]*/.exec($(target).val()));   //验证正负整数 0 负数 正数输入5位
            if ($(target).val().indexOf("-") == 0) {
                if ($(target).val().length > 5) {
                    $(target).val($(target).val().substring(0, 5));
                }
            } else {
                if ($(target).val().length > 4) {
                    $(target).val($(target).val().substring(0, 4));
                }
            }
        }
        //只能输入三位正整数   目前适用于（1.动画执行次数 2.图片比例 3.文本框宽度）
        if (target.hasClass("pValidOnlyInputThreeNumPositiveInt")) {
            var threeIntValue = $(target).val();
            threeIntValue = threeIntValue.replace(/\D/g, '');
            if (threeIntValue.length > 3) {
                threeIntValue = threeIntValue.substring(0, 3);
            }
            $(target).val(threeIntValue);
        }
        //只针对图片比例（最大只能输入500）
        if (target.hasClass("pMaxIsFiveHundred")) {
            var valFiveHundred = $(target).val();
            if (parseInt(valFiveHundred) > 500) {
                valFiveHundred = '500';
            }
            $(target).val(valFiveHundred);
        }

        //只针对视频比例（最大只能输入100）
        if (target.hasClass("pMaxIsOneHundred")) {
            var valOneHundred = $(target).val();
            if (parseInt(valOneHundred) > 100) {
                valOneHundred = '100';
            }
            $(target).val(valOneHundred);
        }
        //只针对椭圆比例（最大只能输入50）
        if (target.hasClass("pMaxIsFifty")) {
            var valOneHundred = $(target).val();
            if (parseInt(valOneHundred) > 50) {
                valOneHundred = '50';
            }
            $(target).val(valOneHundred);
        }
    });

    $("#inactionArea").contextMenu({
        selector: '.customeTemplate',
        autoHide: !0,
        show: function () {
            //                switch (Globle.CurrentModel.get("pType")) {
            //                    case "Board":
            //                        this.items.fold1.remove();
            //                        break;
            //                }
        },
        callback: function (key, options) {
            switch (key) {
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
                            data: { context: this },
                            okEventProcess: function () {
                                console.log("删除模板");
                                this.attributes.data.context.remove();
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
            "delete": {
                name: GetTranslateUI('Tdelete'), icon: "",
                disabled: function () {//控制整体是否显示粘贴菜单

                }
            }
        }
    });
    //    $("#btnSelectPageAndLayer").on("shown.bs.popover", function (event) {
    //        //        console.log(event);
    //        $(".arrow").css("top", "20%").parent().css("top", $("#btnSelectPageAndLayer").offset().top - 10);
    //    })
    //    .popover({
    //        trigger: "focus",
    //        container: "body",
    //        html: !0,
    //        title: "切换编辑对象",
    //        content: '<div style="width:120px;"><button id="btnEditPage"  type="button" class="btn btn btn-lg btn-block">'
    //                   + ' <span class="glyphicon glyphicon-file">&nbsp;页</span>'
    //                + '</button>'
    //                + '<button id="btnEditLayer" type="button"  class="btn btn-lg btn-block">'
    //                   + ' <span class="glyphicon glyphicon-align-justify">&nbsp;层</span>'
    //                + '</button>'
    //                + '</div>'
    //                + ''
    //                + ''
    //                + ''
    //                + ''
    //                + ''
    //    });
    //绑定模板按钮事件
    $("#btnPageTemplate").on("shown.bs.popover", function (event) {
        //        console.log(event);
        //        alert("sdf");
        $(".arrow").css("top", "5%").parent().css("top", $("#btnPageTemplate").offset().top);
    })
    .popover({
        trigger: "focus",
        container: "body",
        html: !0,
        title: GetTranslateUI('TUselayouttemplates'),
        content: function () {
            //            return "sdfsdfsdf";
            //            console.log(_.template($("#layoutTemlate").html())());
            //            var tempStr = _.template($("#layoutTemlate").html())();
            //            console.log(tempStr.toString())
            return _.template($("#layoutTemlate").html())();
        }
    });

    $("#inactionArea").on("click", ".customeTemplate img", function (event) {

        console.log("customeTemplate" + event.currentTarget.attributes.customType.value);
        var container = $(this).parents(".customeTemplate");
        $(this).parents(".customeTemplate").remove();
        switch (event.currentTarget.attributes.customType.value) {
            case "img":
                ResourceViewInstance.btnResourceFileClick({
                    pTop: parseFloat(container.css("top")),
                    pLeft: parseFloat(container.css("left")),
                    pWidth: parseFloat(container.css("width")),
                    pHeight: parseFloat(container.css("height"))
                });
                break;

            case "txt":
                ResourceViewInstance.showRichTextClick({
                    pTop: parseFloat(container.css("top")),
                    pLeft: parseFloat(container.css("left")),
                    pWidth: parseFloat(container.css("width")),
                    pHeight: parseFloat(container.css("height"))
                });
                break;

            default:
                alert(GetTranslateUI('TIllegalOperation'));
                location.reload();
        }

    });

    $("body").on("click", "#layoutTemlateContaner img", function (event) {
        console.log(this.name);
        var titleWidth, titleTop, titleLeft;
        titleWidth = 160;
        titleTop = 60;
        titleLeft = (Globle.BoardWidth / 2 - titleWidth / 2 + 10);
        $(".layoutTemplate", "#" + Globle.CurrentBoard.get("pid") + "").hide();
        var tempTemplate = _.template($("#customTemplate").html());
        switch (this.name) {
            case "removeTemplate":
                $(".layoutTemplate", "#" + Globle.CurrentBoard.get("pid") + "").hide();
                break;
            case "layoutCross":
                if ($(".crossTemplate", "#" + Globle.CurrentBoard.get("pid") + "").length > 0) {
                    $(".crossTemplate", "#" + Globle.CurrentBoard.get("pid") + "").show();
                }
                else {
                    $("#" + Globle.CurrentBoard.get("pid") + "").append(_.template($("#crossTemplate").html())({
                        width: Globle.BoardWidth,
                        height: Globle.BoardHeight,
                        titleWidth: titleWidth,
                        titleTop: titleTop,
                        titleLeft: titleLeft
                    }))
                    .append(tempTemplate({
                        Width: 300,
                        Height: 150,
                        left: 100,
                        top: 90,
                        className: "crossTemplate layoutTemplate"
                    }))
                    .append(tempTemplate({
                        Width: 300,
                        Height: 150,
                        left: 563,
                        top: 90,
                        className: "crossTemplate layoutTemplate"
                    }))
                    .append(tempTemplate({
                        Width: 300,
                        Height: 150,
                        left: 100,
                        top: 290,
                        className: "crossTemplate layoutTemplate"
                    }))
                    .append(tempTemplate({
                        Width: 300,
                        Height: 150,
                        left: 563,
                        top: 290,
                        className: "crossTemplate layoutTemplate"
                    }));
                }
                break;

            case "layoutLongString":
                if ($(".longStringTemplate", "#" + Globle.CurrentBoard.get("pid") + "").length > 0) {
                    $(".longStringTemplate", "#" + Globle.CurrentBoard.get("pid") + "").show();
                }
                else
                    $("#" + Globle.CurrentBoard.get("pid") + "").append(_.template($("#longStringTemplate").html())({
                        width: Globle.BoardWidth, height: Globle.BoardHeight,
                        titleWidth: titleWidth,
                        titleTop: titleTop,
                        titleLeft: titleLeft
                    }))
                    .append(tempTemplate({
                        Width: 280,
                        Height: 460,
                        left: 25,
                        top: 30,
                        className: "longStringTemplate layoutTemplate"
                    }))
                    .append(tempTemplate({
                        Width: 280,
                        Height: 410,
                        left: 370,
                        top: 70,
                        className: "longStringTemplate layoutTemplate"
                    }))
                    .append(tempTemplate({
                        Width: 280,
                        Height: 460,
                        left: 700,
                        top: 30,
                        className: "longStringTemplate layoutTemplate"
                    }));
                break;

            case "layoutSlash":
                if ($(".slashTemplate", "#" + Globle.CurrentBoard.get("pid") + "").length > 0) {
                    $(".slashTemplate", "#" + Globle.CurrentBoard.get("pid") + "").show();
                }
                else {
                    var dotArray = new Array();
                    dotArray.push(_.template('<div style="width: <%=titleWidth %>px; height: 0px; border: 1px dashed; position: absolute; top: <%=titleTop %>px;left: <%=titleLeft %>px;"></div>')({
                        titleWidth: titleWidth,
                        titleTop: titleTop,
                        titleLeft: titleLeft
                    }));
                    var j = 0;
                    var split = 2;
                    var iMax = Globle.BoardWidth / 4;
                    var verticalStep = (Globle.BoardHeight - Globle.BoardWidth / 2) / iMax;
                    var vertical = verticalStep;
                    for (var i = 0; i < iMax; i++) {
                        dotArray.push('<div style="width: 0px; height: 0px; border: 1px dashed; position: absolute; left: ' + (j + split) + 'px; top: ' + (vertical + j) + 'px;"></div>');
                        vertical += verticalStep;
                        j += 2;
                        split += 2;
                    }
                    $("#" + Globle.CurrentBoard.get("pid") + "").append('<div class="slashTemplate layoutTemplate">' + dotArray.join("") + '</div>')
                     .append(tempTemplate({
                         Width: 400,
                         Height: 250,
                         left: 25,
                         top: 240,
                         className: "slashTemplate layoutTemplate"
                     }))
                    .append(tempTemplate({
                        Width: 400,
                        Height: 250,
                        left: 522,
                        top: 25,
                        className: "slashTemplate layoutTemplate"
                    }));
                }
                break;

            case "layoutSun":
                if ($(".sunTemplate", "#" + Globle.CurrentBoard.get("pid") + "").length > 0) {
                    $(".sunTemplate", "#" + Globle.CurrentBoard.get("pid") + "").show();
                }
                else
                    $("#" + Globle.CurrentBoard.get("pid") + "").append(_.template($("#sunTemplate").html())({
                        width: Globle.BoardWidth,
                        height: Globle.BoardHeight,
                        titleWidth: titleWidth,
                        titleTop: titleTop,
                        titleLeft: titleLeft
                    }))
                     .append(tempTemplate({
                         Width: 600,
                         Height: 410,
                         left: 25,
                         top: 70,
                         className: "sunTemplate layoutTemplate"
                     }))
                    .append(tempTemplate({
                        Width: 280,
                        Height: 215,
                        left: 700,
                        top: 25,
                        className: "sunTemplate layoutTemplate"
                    }))
                    .append(tempTemplate({
                        Width: 280,
                        Height: 215,
                        left: 700,
                        top: 300,
                        className: "sunTemplate layoutTemplate"
                    }));
                break;

            default:
                alert(GetTranslateUI('TIllegaltemplateparameters'));
                location.reload();

        }

        $(".customeTemplate ").draggable().resizable({
            handles: 'ne, se, sw, nw, n, e, s, w'
        });
    });

    //    $("body").on("click", "#btnEditPage,#btnEditLayer", function (event) {
    //        Globle.MemoCollectionManager.Clear();
    //        switch (this.id) {
    //            case "btnEditPage":
    //                console.log("btnEditPage");
    //                //隐藏树结构区域
    //                //显示layer区域
    //                $("#jstree_demo").show().next().hide();
    //                $("#btnSelectPageAndLayer").children("span:first").show().end().children("span:last").hide();

    //                //如果上一次有选中的节点,那么再次选中该节点,否则不做处理
    //                var jstreeObj = $.jstree.reference("#jstree_demo");
    //                var previousSelectedNode = jstreeObj.get_selected();
    //                jstreeObj.deselect_all();
    //                jstreeObj.select_node(previousSelectedNode);

    //                Globle.LayoutObj.center.children.layout1.show("south");
    //                SetButtonVisible();
    //                break;

    //            case "btnEditLayer":
    //                console.log("btnEditLayer");
    //                $("#jstree_demo").hide().next().show();
    //                $("#btnSelectPageAndLayer").children("span:first").hide().end().children("span:last").show();
    //                //隐藏当前画板,隐藏当前属性区域
    //                $(".pageboard").hide();
    //                $("#currentPageInfo").empty();
    //                //异步请求服务端,获取当前cbt的layer数据
    //                //如果获取过,那么就不再重复获取
    //                if (!$.jstree.reference("#layer_demo"))
    //                    LoadLayer();

    //                //如果上一次有选中的节点,那么再次选中该节点,否则不做处理
    //                var jstreeObj = $.jstree.reference("#layer_demo");
    //                var previousSelectedNode = jstreeObj.get_selected();
    //                jstreeObj.deselect_all();
    //                jstreeObj.select_node(previousSelectedNode);
    //                //隐藏字幕编辑区域
    //                Globle.LayoutObj.center.children.layout1.hide("south");
    //                //设置按钮是否可以使用
    //                SetButtonVisible({ btnLayer: false, btnBugFlag: false, btnSave: false, btnPageTemplate: false, btnTimeline: false });
    //                break;

    //            default:
    //                alert("非法操作!");
    //                location.reload();
    //                break;
    //        }
    //    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        //        console.log(e.target);
        switch (e.target.attributes.tabtype && e.target.attributes.tabtype.value) {
            case "动作控制":
                //构建出当前page的所有action,并可以排序
                SortCollection(Globle.AnimationBaseModelCollection);
                var actionList = Globle.AnimationBaseModelCollection.where({
                    "IsWaitTrigger": !1,
                    "BelongToBoardID": Globle.CurrentBoard.get("pid"),
                    "IsCanSort": true
                });

                var temp = $("#actionFlag", "#actionSequenceControl").empty();
                if (actionList.length == 0) {
                    temp.append(GetTranslateUI('TArtboardwithinthecurrentelementisnotsetaction'));
                };
                var i = 1;
                var tempModelName = "";
                var tempString = '<div style=" padding: 3px 3px 3px 3px;margin-bottom: 5px;"><ul class="ui-sortable nav nav-pills nav-stacked">';
                var tempElement;
                _.each(actionList, function (v, key, list) {
                    tempElement = Globle.AllModelCollection.get(parseInt(v.get("BelongToElementID")));
                    tempString += ("<li elementID='" + tempElement.attributes.pid + "' SequenceID='" + v.get("SequenceID") + "' actionID='" + v.id + "' class='active'><a href='#'><span class='badge pull-right'>" + (i++) + "</span>" + v.get("name") + "(" + tempElement.get("pName") + ")</a></li>");
                });

                tempString += "</ul></div>";

                temp.append(tempString);

                InitSorted1("#actionSequenceControl", function (event, ui) {
                    Globle.Transaction.Begin = !0;
                    var i = -1;
                    ui.item.parent().children().each(function () {
                        this.attributes['SequenceID'].value = (++i);
                        $(".badge", this).text(i + 1);
                        var t = Globle.AnimationBaseModelCollection.get(this.attributes['actionID'].value);
                        t.attributes["SequenceID"] = this.attributes['SequenceID'].value;
                        t.save();
                    });

                    Globle.Transaction.GoDo('mix');

                    SortCollection(Globle.AnimationBaseModelCollection);
                });

                break;

            case "所有元素": //显示当前page所有元素

                var tempAllElementTabHtml = _.template($("#allElementTabTemplate").html())();

                $("#allElementDivFlag").empty().append(tempAllElementTabHtml);

                InitSorted1("#allElementSequenceControl", function (event, ui) {
                    Globle.Transaction.Begin = !0;
                    var i = ui.item.parent().children().length + 100;
                    ui.item.parent().children().each(function () {
                        this.attributes['SequenceID'].value = (i--);
                        var t = Globle.AllModelCollection.get(parseInt(this.attributes['elementID'].value));
                        t.attributes["SequenceID"] = this.attributes['SequenceID'].value;
                        t.save();
                    });

                    Globle.Transaction.GoDo('mix');

                    SortCollection(Globle.AllModelCollection, function (item) {
                        //依次设置每个元素的z-index
                        $("#" + item.attributes["pid"]).css("z-index", parseInt(item.attributes["SequenceID"]));

                    });
                });


                break;

            default:
                break;
        }
    });

    $("#currentPageAllElement").on("click", ".deleteElement", function () {

        new CommonPopupModalView({
            model: new CommonMessageModal({
                title: GetTranslateUI('TWarning'),
                message: GetTranslateUI('TConfirmdeleteit') + "?",
                isShowSaveButton: !1,
                isShowCancelButton: !0,
                isShowOkButton: !0,
                ContentTemplateID: "#SureMessageModalTemplate",
                data: { "event": this },
                okEventProcess: function () {
                    var tempModel = Globle.AllModelCollection.get(parseInt(this.get("data").event.attributes["modelID"].value));
                    if (!tempModel) return false;
                    Globle.CurrentModel = tempModel;
                    Globle.AllModelCollection.remove(tempModel);

                    if (Globle.LastError.hasError()) {
                        Globle.LastError.ShowError();
                    }
                    else
                        Globle.MemoCollectionManager.AddMemo(ElementBaseModel.CreateMemo(tempModel, "Delete"));
                }
            })
        }).showModal();
    });

    $("#currentPageAllElement,#actionSequenceControl").on("mouseleave mouseenter", "li", function (eve) {

        switch (eve.type) {
            case "mouseleave":
                console.log("mouseleave");
                $("#" + $(this).attr("elementID")).removeClass("cursorOverElementActive");
                break;

            case "mouseenter":
                $("#" + $(this).attr("elementID")).addClass("cursorOverElementActive");
                console.log("mouseenter");
                break;
        }
    });


    $("#currentPageAllElement").on("click", ".eyeElement", function (event) {
        //如果当前是显示,那么就隐藏,如果当前隐藏,那么显示
        var tempClickElement = $(event.currentTarget);
        if (tempClickElement.hasClass("glyphicon-eye-open")) {
            tempClickElement.removeClass("glyphicon-eye-open").addClass("glyphicon-eye-close");
            $("#" + tempClickElement.attr("modelID")).hide();
        }
        else {
            tempClickElement.removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open");
            $("#" + tempClickElement.attr("modelID")).show();
        }
    });

    //点击之后标记当前元素
    $("#currentPageAllElement").on("click", ".signElement", function (event) {
        var tempClickElement = $(event.currentTarget);
        $('#' + tempClickElement.attr("modelID") + '').mousedown();
        //        $('.pcontent.ui-draggable').not('#' + tempClickElement.attr("modelID") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
        //        if (!$('#' + tempClickElement.attr("modelID") + '').hasClass("pactive")) {
        //            $('#' + tempClickElement.attr("modelID") + '').addClass("pactive");
        //        }
        //        $('#' + tempClickElement.attr("modelID") + '').children("div.ui-resizable-handle").show();
    });


    $("#currentPageAllElement").on("click", ".allEye", function (event) {
        //隐藏当前页面所有元素
        //第一次点击,全部隐藏,第二次点击,全部显示
        console.log(event);
        if (!$(event.target).attr("clicked")) {
            $(_.map($("#allElementDivFlag li"), function (item) { return "#" + item.attributes.elementid.value }).join()).hide();
            $(event.target).attr("clicked", "1");
            $("#allElementDivFlag .eyeElement").removeClass("glyphicon-eye-open").addClass("glyphicon-eye-close");
        }
        else {
            $(_.map($("#allElementDivFlag li"), function (item) { return "#" + item.attributes.elementid.value }).join()).show();
            $(event.target).removeAttr('clicked');
            $("#allElementDivFlag .eyeElement").removeClass("glyphicon-eye-close").addClass("glyphicon-eye-open");
        }
    });
    //    //    var isClickEventBubble = 0; //专用于画板与画板内元素的控制
    //    // 绑定在预览窗口的click事件
    //    $("#myModalPreviewAction").on("click", ".SelfIsTrigger", function (event) {

    //        coreControlAction(event);

    //    });

    //    $("#myModalPreviewAction").on("click", "[pType=board]", function (event) {
    //        if (!controlClickEventBubble)
    //            coreControlAction(event);
    //    });

    $("body").on("click", "#stopDrawBeizer,#CancelDrawPoint,#deleteDrawPoint", function (event) {

        switch (event.currentTarget.id) {
            case "stopDrawBeizer":
                $("#stopDrawBeizer").hide();
                //保存路径数据
                //            debugger;
                Globle.CurrentAnimationModel.set({ "AnimationJSONData": encodeURIComponent(Globle.BeizerAnimation.serializeData()), silent: !0 });

                Globle.CurrentAnimationModel.save();

                Globle.BeizerAnimation.clearPath();

                $('#animationContainer_' + Globle.CurrentBoard.get("pid") + '').remove();

                Globle.CurrentAnimationModel = null;
                break;

            case "CancelDrawPoint":
                $("#stopDrawBeizer,#deleteDrawPoint,#CancelDrawPoint").hide();

                Globle.BeizerAnimation.clearPath();
                $('#animationContainer_' + Globle.CurrentBoard.get("pid") + '').remove();

                Globle.CurrentAnimationModel = null;
                $.unblockUI();
                break;

            case "deleteDrawPoint":
                Globle.BeizerAnimation.removeLastPoint();
                break;
        }


        //                $("#ele1").show();
    });

    //    $("body").on("click", "#deleteDrawPoint", function () {
    //      
    //        //                $("#ele1").show();
    //    });

    //    Globle.ScriptDescriptionEditor = CKEDITOR.appendTo('ckEditorScriptDescription',
    //				{
    //				    toolbar: [{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic'] },
    //	                            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
    //	                            { name: 'links', items: ['Link', 'Unlink'] },
    //	                            { name: 'others', items: ['-'] }
    //	                            ],
    //				    removeButtons: "About",
    //				    height: 580
    //				},
    //				''
    //	);
    //脚本描述中的双击事件
    $("#ckEditorScriptDescription").dblclick(function (event) {
        var pageID = parseInt($.jstree.reference("#jstree_demo").get_selected()[0]);
        var fileUrl = GenerateRequestURL(window.location.protocol + "//" + window.location.host + "/lcms/HTMLTemplate/Animation/AnimationResource/page/ScriptDescription.htm");
        var left = parseInt(window.screen.width) - 600;
        var tempWindow = window.open(fileUrl + "?pageID=" + pageID, "", "height=600,width=600,top=0,left=" + left + ",resizable=Yes,status=No,scrollbars=No");
        tempWindow.focus();
    });
    $('#btnAdd').click(function () {

        var tableElement = $("#sectionTable");

        if (tableElement.find('textarea').length >= 20) {
            alert('Has reached the maximum number of Section');
            return false;
        }
        var tempSectionObj = new SectionModel({
            audioModel: !0,
            unitItemID: parseInt($.jstree.reference("#jstree_demo").get_selected()[0])
        });
        var trContent = GenerateSectionTr(tempSectionObj);

        tableElement.append(trContent);
        InitUploadify(tempSectionObj.get("pid"));


        var tempElement = tableElement.find('textarea:last');
        tempElement.select();

        $(window).scrollTop(tempElement.offset().top + tempElement.height());
    });

    $('#sectionTable').delegate('.sectionOutDiv', 'mouseover mouseout', function (eve) {
        //        switch (eve.type) {
        //            case "mouseover":
        //                $(this).children(".btn-group").show();
        //                break;

        //            case "mouseout":
        //                $(this).children(".btn-group").hide();
        //                break;
        //        }
    });

    $('#sectionTable').delegate('textarea', 'blur', function (eve) {

        //        alert("sdf");
        //自动保存字幕
        $(eve.target).parents(".sectionOutDiv").children("label:first").click();
    });

    $('#sectionTable').delegate('select', 'change', function (eve) {
        //改变之后,将用户选择的值,更新到数据库

        //如果是setAdvance,那么需要判断是否显示延迟时间设置框
        if ($(eve.target).hasClass("setAdvance")) {
            $(eve.target).parents(".sectionOutDiv").find(".setDelaySecond").val(0);
            if ($(eve.target).val() == "auto") {
                $(eve.target).parents(".sectionOutDiv").find(".delayClass").show();
            }
            else {
                $(eve.target).parents(".sectionOutDiv").find(".delayClass").hide();
            }
        }
        isSetAdvanceSelectChange = true;//标记是否触发的的是selectchange事件//
        $(eve.target).parents(".sectionOutDiv").children("label:first").click();
        isSetAdvanceSelectChange = false;
    });


    $('#sectionTable').delegate('label', 'click', function (eve) {
        
        //只对 : 试听,录音,发音这4个按钮进行提醒,其他按钮不提醒
        var areyousureConfirm = function () {
            if (!confirm(GetTranslateUI("TAreYouSure"))) {
                return false;
            }
            return true;
        }

        var tempClickElement = $(eve.target);
        var sectionTr = tempClickElement.parents(".sectionOutDiv");
        var preSectionTr = sectionTr.prev();
        var hiddenElement = sectionTr.find(".hiddenValue");
        var tempTextAreaElement = sectionTr.find("textarea");
        var tempAdvanceSection = sectionTr.find(".setAdvance").val();
        var tempDelaySecond = sectionTr.find(".setDelaySecond").val();
        var tempPreSectionID = preSectionTr.find(".hiddenValue").attr("sectionID");
        var blockSectionTr = function () {
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
        };

        var blockSectionCommand = function () {
            $(".sectionCommond").block({
                message: "<img src='../Animation/AnimationResource/images/48x48Loading.png' />",
                overlayCSS: {
                    opacity: 0.8,
                    backgroundColor: "#E6E3E3"
                },
                css: {
                    top: "5%"
                }
            });
        };

        var SectionModelObj = new SectionModel({
            sectionText: encodeURIComponent(tempTextAreaElement.val()),
            htmlControl: tempTextAreaElement,
            unitItemID: parseInt($.jstree.reference("#jstree_demo").get_selected()[0]),
            sectionID: hiddenElement.attr("sectionID"),
            advanceSection: tempAdvanceSection,
            delaySecond: tempDelaySecond,
            puppetSectionID: hiddenElement.attr("puppetSectionID"),
            PreSectionID: tempPreSectionID
        });

        switch (tempClickElement.attr("type")) {
            case "saveSecton":
             //   if ((!isSetAdvanceSelectChange) && (!areyousureConfirm())) return false;
                //保存字幕，仅保存section
                if (tempTextAreaElement.val().length > 999) {
                    alert(GetTranslateUI('TSubtitleslengthnotmorethan999characters'));
                    return;
                }
                blockSectionTr();
                SaveSection(SectionModelObj
                , function () {
                    sectionTr.unblock();
                    //将更新后的SectionModelObj加入到Globle.CurrentSectoinArray 数组
                    if (!_.some(Globle.CurrentSectoinArray, function (item) {
                        if (item.get("sectionID") == SectionModelObj.get("sectionID")) {

                            return true;
                    }
                        return false;
                    })) {
                        //说明没有加入过数组中, 那么就加入进去
                        Globle.CurrentSectoinArray.push(SectionModelObj);
                    }
                }
                , function () {
                    sectionTr.unblock();
                });
                break;

            case "playerAudio": //试听
                if (!areyousureConfirm()) return false;

                blockSectionTr();

                SaveSection(SectionModelObj
                , function () {
                    sectionTr.unblock();
                    playAudio(hiddenElement.attr("sectionID"), "false");
                }, function () {
                    sectionTr.unblock();
                });

                break;

            case "recordAudio": //录音
                if (!areyousureConfirm()) return false;

                //如果没有保存section，那么自动保存一下
                if (hiddenElement.attr("sectionID") == "") {

                    blockSectionTr();
                    SaveSection(SectionModelObj
                    , function () {
                        sectionTr.unblock();
                        //记得将新生成的mp3地址更新到字幕集合中
                        playAudio(hiddenElement.attr("sectionID"), "true");
                    }, function () {
                        sectionTr.unblock();
                    });
                }
                else
                    playAudio(hiddenElement.attr("sectionID"), "true");
                break;

            case "generateAudio": //生成声音
                if (!areyousureConfirm()) return false;

                //生成声音，然后自动播放声音
                //首先更新section
                blockSectionCommand();

                SaveSection(SectionModelObj
                , function () {
                    GenerateAudio(sectionTr.find("textarea"), function (sectionModelTemp) {
                        $(".sectionCommond").unblock();
                        playAudio(hiddenElement.attr("sectionID"), "false");

                        //将新的mp3地址更新到字幕集合中
                        var tempCurrentSection = _.find(Globle.CurrentSectoinArray, function (itemp) { return itemp.get("sectionID") == sectionModelTemp.get("sectionID"); });

                        tempCurrentSection && (tempCurrentSection.set({
                            "mp3Url": sectionModelTemp.get("mp3Url"),
                            silent: !0
                        }));

                    }, function () {
                        $(".sectionCommond").unblock();
                    });
                }
                , function () {
                    $(".sectionCommond").unblock();
                });

                break;

            case "uploadAudio":

                break;

            case "deleteAudio":
                //如果sectionID不存在，说明没有持久化到服务端，那么直接删除
                if (hiddenElement.attr("sectionID") == "") {
                    hiddenElement.parents(".sectionOutDiv").remove();
                }
                else {
                    new CommonPopupModalView({
                        model: new CommonMessageModal({
                            title: GetTranslateUI('TWarning'),
                            message: GetTranslateUI('TConfirmdeleteit') + "?",
                            isShowSaveButton: !1,
                            isShowCancelButton: !0,
                            isShowOkButton: !0,
                            ContentTemplateID: "#SureMessageModalTemplate",
                            data: { "sectionTr": sectionTr, "hiddenElement": hiddenElement },
                            okEventProcess: function () {

                                var trueLocation = GenerateRequestURL("/lcms/Files/OperateAnimationHTMLTemplate.ashx");

                                var preSectionTr = this.get("data").hiddenElement.parents('.sectionOutDiv').prev();
                                var nextSectionTr = this.get("data").hiddenElement.parents('.sectionOutDiv').next();

                                $.ajax({
                                    context: this,
                                    type: "post",
                                    url: trueLocation,
                                    data: {
                                        actionType: "deleteSection",
                                        unitItemID: this.get("data").hiddenElement.attr("unititemid"),
                                        sectionID: this.get("data").hiddenElement.attr("sectionID"),
                                        PuppetSectionID: this.get("data").hiddenElement.attr("puppetSectionID"),
                                        PreSectionID: preSectionTr.find(".hiddenValue").attr("sectionID"),
                                        PrePuppetSectionID: preSectionTr.find(".hiddenValue").attr("puppetsectionid"),
                                        NextSectionID: nextSectionTr.find(".hiddenValue").attr("sectionID"),
                                        NextPuppetSectionID: nextSectionTr.find(".hiddenValue").attr("puppetsectionid")
                                    },
                                    success: function (data) {
                                        var tempsectionID = (this.get("data").hiddenElement.attr("sectionID"));

                                        //从缓存的字幕集合中删除当前字幕
                                        _.each(Globle.CurrentSectoinArray, function (itemp, index) {
                                            if (itemp.get("sectionID") == tempsectionID) {
                                                Globle.CurrentSectoinArray.splice(index, 1);
                                                //                                            break;
                                            }
                                        });


                                        this.get("data").hiddenElement.parents(".sectionOutDiv").remove();
                                    },
                                    beforeSend: function () {
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
                                    complete: function () {
                                        this.get("data").sectionTr.unblock();
                                    }
                                });
                            }
                        })
                    }).showModal();
                }
                break;
        }
    });

    $(".pelesyshelper").click(function (event) {
        switch ($(event.currentTarget).attr("type")) {
            case "sectionHelper":
                var fileUrl = window.location.protocol + "//" + window.location.host + "/Lcms/HTMLTemplate/Animation/AnimationResource/page/sectionHelper.htm";
                var tempWindow = window.open(fileUrl, "", "height=650,width=1155,resizable=Yes,status=No,scrollbars=No");
                tempWindow.focus();
                break;

            case "":
                break;
        }
    });

    $("#btnUnDo").click(function (event) {
        console.log("undo click");
        var tempMemoModel = Globle.MemoCollectionManager.GetPreviousMemo();
        if (!tempMemoModel)
            return;
        switch (tempMemoModel.attributes.modelContent.attributes.pType) {
            case "Arrow":
                ElementBaseModel.UnDoMemo(tempMemoModel);
                break;
            case "AdvanceArrow":
                ElementBaseModel.UnDoMemo(tempMemoModel);
                break;

            default:
                ElementBaseModel.UnDoMemo((tempMemoModel));
                break;
        }

    });
    $("#btnReDo").click(function (event) {
        console.log("redo click");
        var tempMemoModel = Globle.MemoCollectionManager.GetNextMemo();

        tempMemoModel && ElementBaseModel.ReDoMemo((tempMemoModel));
    });

    //    alert('bindevent');
});
