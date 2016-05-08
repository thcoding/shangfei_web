var ImageRotateFunction = function () {
    var first_img = this.find('img:first');
    var all_img = this.find('img');
    var img_count = all_img.length;
    if (img_count == 0) return;
    var img_width = first_img.width();
    var chg_width = parseInt(img_width / img_count); /* 感应区宽度*/
    var imgs_left = first_img.offset().left;

    //    all_img.toggle();
    //    first_img.toggle(); 
    var mouseX = 0;
    var start = false;
    var step = 20;
    var curr_step = 0; /* 当前感应区 */
    var curr_img = 0; /* 当前图片 */

    $(this).bind("mouseover touchstart", function (e) {/*鼠标移到本DIV*/
        start = true;
        if (start) {
            mouseX = e.screenX;
            /* 获取当前感应区 */
            curr_step = parseInt((mouseX - imgs_left) / chg_width);
            step = curr_step;
        }
    })
    .bind("mouseout touchend", function (e) {/*鼠标移出本DIV*/
        start = false;
    })
    .bind("mousemove touchmove", function (e) {
        if (start) {
            curr_step = parseInt((e.screenX - imgs_left) / chg_width);
            if (curr_step != step) {
                $(all_img[curr_img]).toggle(); /* 隐藏当前图片 */
                if (curr_step > step) {
                    curr_img = curr_img + 1;
                    if (curr_img >= img_count) curr_img = 0;
                } else {
                    curr_img = curr_img - 1;
                    if (curr_img < 0) curr_img = img_count - 1;
                }
                $(all_img[curr_img]).toggle();
                step = curr_step;
            }
        }
    })
};

function getQueryString(paramName) {
    paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var reg = "[\\?&]" + paramName + "=([^&#]*)";
    var regex = new RegExp(reg);
    var regResults = regex.exec(window.location.href);
    if (regResults == null) return "";
    else return regResults[1];
}

$(function () {

    Globle.CbtUnitID = getQueryString("CbtUnitID");
    Globle.UnitTopicID = getQueryString("TopicID");
    Globle.LanguageID = getQueryString("LanguageID");
    Globle.CreateByTranslation = decodeURI(getQueryString("CreateByTranslation"));

    //多选元素时,右边显示的属性区域-----------------------------------等待移到views1.js中------------开始------
    MultipleAttributePanelView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return $('#MultipleElementAttributeTemplate').html();
        },
        events: function () {
            var obj = {};
            var key = 'click #_MultipleElementAttributeTemplate .multipleAlign';
            obj[key] = 'multipleAlignClick';

            return obj;
        },
        initialize: function () {
            console.log("MultipleAttributePanelView initialize");
            //            this.template = this.generateTemplate();
            //            this.model.on("change:pUpdateInitView", this.pUpdateInitView, this);
            this.render();
        },
        multipleAlignClick: function (event) {
            alert('对齐');
            //            console.log(this.model.get("pid") + "clickRadio");
            //            this.model.set({
            //                silent: !0,
            //                "pInitControlVisible": $(event.currentTarget).find("input[type='radio']").val()
            //            });
            //            this.model.save();
        },
        render: function () {
            if (!Globle.IsMultipleSelectStatu)
                return;

            $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');

            $(".attributeHoldPlace").empty();

            console.log("MultipleAttributePanel render");
            if (Globle.IsInit) return;
            $("#MultipleModelAttributeHoldPlaceDiv").empty().append(this.generateTemplate());
            //            this.SetDataValue();
            return this;
        }
        //        pUpdateInitView: function () {
        //            this.render();
        //        },
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

    //多选元素时,右边显示的属性区域-----------------------------------等待移到views1.js中------------结束------


    //文本编辑框属性区域
    RichTextAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#CommonAttributeTemplate').html().replace("fieldsetHoldPlace", ""));
        },
        events: function () {

            var obj = {};
            var key2 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .elementName";
            obj[key2] = 'blurElementName';
            var key3 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .SetWHXYInfo";
            obj[key3] = 'blurTextSize';
            var key4 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .SetRotateTextBox";
            obj[key4] = 'blurElementRotate';

            var key5 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .SetTransparentTextBox";
            obj[key5] = "blurElementTransparent";

            var key6 = "blur #" + this.model.get("pid") + "_elementCommonAttribute #txtBorderWidth";
            obj[key6] = "blurRichTextBorderWidth";

            var key7 = "change #" + this.model.get("pid") + "_elementCommonAttribute #cboxRichTextBackGroundIsOpacity";
            obj[key7] = "changeBackGroundColorIsOpacity";

            return obj
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();

            this.model.bind("remove", this.ListenRemove, this);
            this.model.bind("change:pUpdateAttributeView", this.render, this);
            this.model.bind("change:pLeft", this.ListenpLeft, this);
            this.model.bind("change:pTop", this.ListenpTop, this);
            this.model.bind("change:pWidth", this.ListenPwidth, this);
            this.model.bind("change:pHeight", this.ListenpHeight, this);
            this.model.bind("change:pRotate", this.ListenpRotate, this);
            this.model.bind("change:pTransparent", this.ListenpTransparent, this);
        },
        render: function () {
            if (Globle.IsInit) return;
            //                    //console.log('render');
            $(".attributeHoldPlace").empty();
            $("#RichTextAttributeViewHoldPlaceDiv").empty()
					.append(this.template(this.model.toJSON()));
            $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');
            if ($("#sliderElementRotate", this.$el).children('a').length == 0) {
                ElementRotate(this.$el, this.model);
            }

            if ($("#sliderElementTransparentForImage", this.$el).children('a').length == 0) {
                ElementTransparentForImage(this.$el, this.model);
            }
            if (Globle.CurrentModel.get("pType") == "RichText") {
                $('#' + Globle.CurrentModel.get("pid") + '_richText_border_color')
                    .colorpicker({
                        strings: GetTranslateUI('TColorthemebasiccolormorecolorlesscolorreturn'),
                        showOn: 'focus'
                    })
                    .on('change.color', function (ev, color) {
                        if ("undefined" != typeof color) {
                            Globle.CurrentModel.set({ "pBorderColor": color == "" ? "#000000" : color });
                            Globle.CurrentModel.save();
                        }
                    });
                $('#' + Globle.CurrentModel.get("pid") + '_richText_backGroundColor_color')
                    .colorpicker({
                        strings: GetTranslateUI('TColorthemebasiccolormorecolorlesscolorreturn'),
                        showOn: 'focus'
                    })
                    .on('change.color', function (ev, color) {
                        if ("undefined" != typeof color) {
                            Globle.CurrentModel.set({ "pBackGroundColor": color == "" ? "#FFFFFF" : color });
                            Globle.CurrentModel.save();
                        }
                    });
            }

            //手动调节旋转的Slider 初始化
            return this;
        },
        blurElementName: function (data) {
            //            alert("斯蒂芬");
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
        }, blurElementTransparent: function (data) {
            //文本框变更素材透明度
            $("#sliderElementTransparentForImage", this.$el).slider("value", data.target.value);
            ChangeElementTransparent(this.model, data);
        },
        ListenpTransparent: function () {
            $("#Transparent", this.$el).val(this.model.get("pTransparent"));
            //同时设置splider的值
            $("#sliderElementTransparentForImage", this.$el).slider("value", this.model.get("pTransparent"));
        },
        blurElementRotate: function (data) {
            $("#sliderElementRotate", this.$el).slider("value", data.target.value);
            ChangeElementRotate(this.model, data); //方法在Utilities1中
        },
        blurRichTextBorderWidth: function (data) {
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

        },
        blurTextSize: function (data) {
            ChangeElementWHXY(this.model, data); //方法在Utilities1中
        },
        ListenRemove: function () {
            //            this.$el.empty();
            $(".attributeHoldPlace").empty();
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
        ListenpRotate: function () {
            $("#Rotate", this.$el).val(this.model.get("pRotate"));
            //同时设置splider的值
            $("#sliderElementRotate", this.$el).slider("value", this.model.get("pRotate"));
        },
        SetRichTextWidth: function () {

        }
    });

    //序列帧view的模态view
    SequenceSetPanelView = Backbone.View.extend({
        el: $("body"),
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_CommonModelPanel .btnCommonModalSave";
            obj[key] = 'Save';
            return obj;
        },
        generateTemplate: function () {
            return _.template($('#CommonTemplate').html().replace('contentBodyHoldPlace', $('#SequenceSetPanelTemplate').html()));
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();

        },
        render: function () {
            this.$el.append(this.template(this.model.toJSON()));
            return this;
        },
        Save: function (event) {
            this.undelegateEvents();

            //            console.log("save" + this.cid);
            imgLoad(this.model.get("ImageModel").get("pFileUrl"), function (width, height) {
                //                console.log(imgLoad);
                //                console.log(width, height);
                this.model.set({ "pWidth": parseInt(width / $("#txtFrame").val()), "pWidthX": width, "pHeight": height, "pFrame": $("#txtFrame").val(), silent: !0 });

                //如果不存在,则新建一个,如果存在,则通知编辑区域进行更新
                if (Globle.AllModelCollection.findWhere({ pid: this.model.get("pid") })) {
                    this.model.set({ "pFocus": !this.model.get("pFocus") });
                    this.model.save();
                    if (Globle.LastError.hasError()) {
                        //说明有错误
                        Globle.LastError.ShowError();
                    }
                }
                else {
                    this.model.save();
                    if (Globle.LastError.hasError()) {
                        //说明有错误
                        Globle.LastError.ShowError();
                    } else {
                        Globle.AllModelCollection.add(this.model);
                    }
                }
                $("[id$='_CommonModelPanel']").modal("hide");
            }, this);
        },
        ShowModal: function () {
            $("#" + this.model.get("pid") + "_CommonModelPanel")
			.on('show.bs.modal', function (e) {
			    $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);
			})
			.on('hide.bs.modal', function (e) {
			    $("#iframeModalHelper").show().css("z-index", "-111");
			    $(e.currentTarget).unbind("hide.bs.modal").unbind("show.bs.modal");
			    //将模态html从dom中移除
			    this.remove();
			})
			.modal("show");
        }
    });

    //显示在界面上供客户操作的RichText视图
    RichTextView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'RichTextMousedown';
            key = 'dblclick #' + this.model.get('pid') + "";
            obj[key] = 'RichTextDoubleClick';

            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'richTextMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'richTextMouseOutHideIcon';

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //监听model的imageurl
            this.model.bind("remove", this.ListenRemove, this);
            //监听文本框model的边框颜色
            this.model.bind("change:pBorderColor", this.ListenpBorderColor, this);
            //监听文本框model的背景颜色
            this.model.bind("change:pBackGroundColor", this.ListenpBackGroundColorColor, this);
            this.model.bind("change:pBorderWidth", this.ListenpRichTextBorderWidth, this);
            this.model.bind("change:pBackGroundIsOpacity", this.ListenpBackGroundColorIsOpacity, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template('<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;-ms-transform:rotate(<%=pRotate%>deg);-moz-transform:rotate(<%=pRotate%>deg);-o-transform:rotate(<%=pRotate%>deg);-webkit-transform:rotate(<%=pRotate%>deg);Opacity:<%=pTransparent%>;left:<%=pLeft %>px;z-index:<%=SequenceID %>; "><div id="middle_<%=pid%>"  style="width:100%;height:100%; border-width:<%=pBorderWidth%>px;border-color:<%=pBorderColor%>;border-style:solid;<% if(!pBackGroundIsOpacity){%> background:<%=pBackGroundColor%>;  <%} else {%> background:transparent; <% } %>"><div id="content_<%=pid%>"><%=decodeURIComponent(pTextContent) %></div></div></div> ');
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenImageUrl: function () {
            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenRemove: function () {
            //console.log("ListenpRemove"); 
            $("#" + this.model.get("pid") + "").remove();
        },
        ListenpBorderColor: function () {
            //更新文本框边框颜色,为该模板监听的事件
            $("#middle_" + this.model.get("pid") + "").css({ "border-color": this.model.get("pBorderColor") });
        },
        ListenpBackGroundColorIsOpacity: function () {
            if (this.model.get("pBackGroundIsOpacity")) {
                $("#middle_" + this.model.get("pid") + "").css({ "background": "transparent" });
            }
            else {
                $("#middle_" + this.model.get("pid") + "").css({ "background": this.model.get("pBackGroundColor") });
            }
        },
        ListenpBackGroundColorColor: function () {
            if (this.model.get("pBackGroundIsOpacity")) {
                $("#middle_" + this.model.get("pid") + "").css({ "background": "transparent" });
            }
            else {
                $("#middle_" + this.model.get("pid") + "").css({ "background": this.model.get("pBackGroundColor") });
            }
        },
        ListenpRichTextBorderWidth: function () {
            $("#middle_" + this.model.get("pid") + "").css({ "border-width": this.model.get("pBorderWidth") + "px" });
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.resizable({
					    handles: 'ne, se, sw, nw, n, e, s, w',
					    start: function (event, ui) {
					        startResize(event, ui);
					    },
					    resize: function (event, ui) {
					        ElementBaseModel.ResizableResize(event, ui);
					    },
					    stop: function (event, ui) {
					        Globle.CurrentModel.save();
					    }
					})
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					        dragCalcuteGuide(event, ui);
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();
            if (Globle.IsInit) return;
            this.activeImage();
        },
        RichTextMousedown: function (event) {
            console.log(event.type);

            Globle.CurrentModel = this.model;

            this.activeImage(event);

            ClickElement(event);

            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel"),
                "pUpdateInitView": !this.model.get("pUpdateInitView"),
                "pUpdateTriggerView": !this.model.get("pUpdateTriggerView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            console.log(event.type);
        },
        richTextMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#richTextIcon').length <= 0) {
                switch (this.model.get("pType")) {
                    case "RichText":
                        $('<img id="richTextIcon" src="../../images/Icon/24/Txt.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Txt" />').insertBefore($("#" + modelId)[0].firstChild);
                        break;

                    case "Correct":
                        $('<img id="richTextIcon" src="../../images/Icon/24/Correct.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Txt" />').insertBefore($("#" + modelId)[0].firstChild);
                        break;
                    case "Incorrect":
                        $('<img id="richTextIcon" src="../../images/Icon/24/Incorrect.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Txt" />').insertBefore($("#" + modelId)[0].firstChild);
                        break;
                    default:
                        alert("错误,请联系管理员");
                        break;
                }

            }
        },
        richTextMouseOutHideIcon: function () {
            if ($('#richTextIcon').length > 0) {
                $('#richTextIcon').remove();
            }
        },
        RichTextDoubleClick: function (events) {
            //双击之后,初始化为ckeditor格式供用户使用
            console.log(events.type);
            //            Globle.Editor.CreateEditor({ height: parseInt(this.model.get("pHeight")) - 50 }, this.model.get("pid"), this.model.get("pTextContent"));

            //弹出模态,让用户输入内容
            $("#CommonModal").on('show.bs.modal', function (e) {
                $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);

                $("#H2Tile", this).text(GetTranslateUI('TEditingtext'));
                $(".modal-dialog", this).width(800);
                $(".modal-body", this).height(500).empty();

                var configTemp = {
                    height: $(".modal-body", this).height() - 50,
                    toolbar: [
					{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic'] },
					{ name: 'styles', items: ['Font', 'FontSize', 'lineheight'] },
					{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'PasteText'] },
					{ name: 'colors', items: ['TextColor', 'BGColor', 'AreaBGColor'] },
					{ name: 'table', items: ['Table'] },
                    { name: 'justify', items: ['JustifyLeft', 'JustifyRight', 'JustifyBlock', 'JustifyCenter'] }
					]
                };
                Globle.Editor1 = CKEDITOR.appendTo($(".modal-body", this)[0],
				configTemp,
				decodeURIComponent(Globle.CurrentModel.get("pTextContent"))
				);
                Globle.Editor1.focus();
            }).on('shown.bs.modal', function (e) {
                $("#CommonModal .cke_wysiwyg_frame").contents().find(".cke_editable").css("background-color", Globle.CurrentModel.get("pCkEditorBackGroundColor"));
            }).on('hide.bs.modal', function (e) {

                $(e.currentTarget).unbind("hide.bs.modal").unbind("show.bs.modal");
                var color = $("#CommonModal .cke_wysiwyg_frame").contents().find(".cke_editable").css("background-color");
                if ("undefined" == typeof color) {
                    color = "#FFF";
                }
                $("#iframeModalHelper").css("z-index", "-11111").hide();

                var encodeData = encodeURIComponent($.trim(Globle.Editor1.getData()));
                $(".modal-body", this).empty();
                Globle.CurrentModel.set({
                    "pTextContent": encodeData,
                    "pCkEditorBackGroundColor": color,
                    silent: !0
                });
                Globle.CurrentModel.save();

                $("#content_" + Globle.CurrentModel.get("pid")).empty().append(decodeURIComponent(encodeData));

                Globle.Editor1 && (Globle.Editor1 = null);
            }).modal();
            event.stopImmediatePropagation();
            //            event.isImmediatePropagationStopped();
        },
        activeImage: function (event) {
            activeImage(this.model, event);
        }
    });

    //显示在界面上供客户操作的WebForm视图
    WebFormView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'WebFormMousedown';

            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'richTextMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'richTextMouseOutHideIcon';

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //监听model
            this.model.bind("remove", this.ListenRemove, this);

            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(WebFormModel.WebFormModelTemplateForLayerInit);
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenRemove: function () {
            //console.log("ListenpRemove"); 
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.resizable({
					    handles: 'ne, se, sw, nw, n, e, s, w',
					    start: function (event, ui) {
					        startResize(event, ui);
					    },
					    resize: function (event, ui) {
					        ElementBaseModel.ResizableResize(event, ui);
					    },
					    stop: function (event, ui) {
					        Globle.CurrentModel.save();
					    }
					})
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					        dragCalcuteGuide(event, ui);
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();
            if (Globle.IsInit) return;
            this.activeImage();
        },
        WebFormMousedown: function (event) {
            console.log(event.type);

            Globle.CurrentModel = this.model;

            this.activeImage(event);

            ClickElement(event);

            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateContentView": !this.model.get("pUpdateContentView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            console.log(event.type);
        },
        richTextMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#webFormIcon').length <= 0) {
                $('<img id="webFormIcon" src="../../images/Icon/24/webCon.png" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Txt" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        richTextMouseOutHideIcon: function () {
            if ($('#webFormIcon').length > 0) {
                $('#webFormIcon').remove();
            }
        },
        activeImage: function (event) {
            activeImage(this.model, event);
        }
    });

    //定义画板的视图
    BoardView = Backbone.View.extend({
        el: $("#inactionArea"),
        generateTemplate: function () {
            return _.template($('#boardTemplate').html());
        },
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'clickBoard';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.model.bind("change:pFileUrl", this.ListenpImageUrl, this);
            this.model.bind("change:backgroundColor", this.ListenBackGroundColor, this);
            this.model.bind("change:pFocus", this.ListenFocus, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.render();
        },
        ListenRemove: function () {
            $("#" + this.model.get("pid") + "").remove();
        },
        render: function () {
            this.$el.append(this.template(this.model.toJSON()));
            return this;
        },
        clickBoard: function (event) {
            //点击画板执行的事件
            console.log("click" + this.model.get("pType"));
            Globle.CurrentBoard = this.model;
            Globle.CurrentModel = null;
            $('.pcontent').removeClass("pactive").children("div.ui-resizable-handle").hide();

            //通知属性面板
            Globle.CurrentBoard.set({
                "pUpdateAttributeView": !Globle.CurrentBoard.get("pUpdateAttributeView"),
                "pUpdateTriggerView": !Globle.CurrentBoard.get("pUpdateTriggerView"),
                "pUpdateManuallyResourceView": !Globle.CurrentBoard.get("pUpdateManuallyResourceView")
            });

            ClickElement(event);

            //            Globle.Editor.Destory();
        },
        ListenpImageUrl: function () {
            //更新背景图片
            //                    //console.log('updateView');
            //            this.$el.find("#" + this.model.get("pid") + "").children("img").first().attr({ "src": this.model.get("pFileUrl") });
            var url = this.model.get("pFileUrl");
            if (url == "") {
                this.$el.find("#" + this.model.get("pid") + "").children("img").first().remove();
            }
            else {
                this.$el.find("#" + this.model.get("pid") + "").children("img").first().remove();
                this.$el.find("#" + this.model.get("pid") + "").append("<img src='" + url + "' style='width:100%;height:100%;' />");
            }

        },
        ListenFocus: function () {
            $('.pcontent').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //将其他画板隐藏,当前画板显示出来
            this.$el.find(".pageboard").not("#" + this.model.get("pid") + "").hide();
            this.$el.find("#" + this.model.get("pid") + "").show();
        },
        ListenBackGroundColor: function () {
            //更新画板背景颜色,为该模板监听的事件
            this.$el.find("#" + this.model.get("pid") + "").css({ "background-color": this.model.get("backgroundColor") });
        }
    });

    //显示在界面上供客户操作的mp4视频视图
    VideoView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //            //                    var key = 'click #' + this.model.get('pid') + "";
            //            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'videoMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'videoMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //监听model的imageurl
            //            this.model.bind("change:pFileUrl", this.ListenImageUrl, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(VideoModel.VideoTemplate);
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            VideoModel.CreatePlayer(this.model, "player_" + this.model.get("pid"), !1);
            return this;
        },
        ListenImageUrl: function () {
            //            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
				   .resizable({
				       handles: 'ne, se, sw, nw, n, e, s, w',
				       start: function (event, ui) {
				           startResize(event, ui);
				       },
				       resize: function (event, ui) {

				           ElementBaseModel.ResizableResize(event, ui);
				       },
				       stop: function (event, ui) {

				           Globle.CurrentModel.save();
				       }
				   }).draggable({
				       delay: Globle.DragDelayTime,
				       start: function (event, ui) {
				           startDraggable(event, ui);
				       },
				       drag: function (event, ui) {

				           Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
				           dragCalcuteGuide(event, ui);
				       },
				       stop: function (event, ui) {
				           stopCalcuteGuide(event, ui);
				       }
				   });
            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();
            Globle.IsInit || this.activeImage();
        },
        videoMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#videoIcon').length <= 0) {
                $('<img id="videoIcon" src="../../images/Icon/24/Video.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;" alt="Video" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        videoMouseOutHideIcon: function () {
            if ($('#videoIcon').length > 0) {
                $('#videoIcon').remove();
            }
        },
        imgMousedown: function (event) {
            Globle.CurrentModel = this.model;
            console.log("click active");
            this.activeImage(event);

            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel"),
                "pUpdateInitView": !this.model.get("pUpdateInitView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //显示在界面上供客户操作的GlStudio cab视图
    GlStudioView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'glStudioMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'glStudioMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //监听model的imageurl
            //            this.model.bind("change:pFileUrl", this.ListenImageUrl, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            //            return _.template('<div class="pcontent" id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; "><OBJECT ' + 'id="<%=pid>" ' + 'codeBase=' + location.origin + '/lcms/HTMLTemplate/Animation/AnimationResource/GlStudio/GLSPlayer.ocx#version=4,0,5,0 ' + 'classid="clsid:2BD70499-E075-4059-8384-B7AB7E8AAB1F" ' + 'width="100%" ' + 'height="100%" ' + 'VIEWTEXT>' + '<span class="errstyle">' + '	Failed to load GLS Player(GlPlayer载入失败请重新载入)!' + '</span>' + '<param name="Enabled" value="1">' + '<param name="ComponentFileName" value="<%=pFileUrl>">' + '</OBJECT></div>'); 
            return _.template(GlStudioModel.GlStudioTemplate);
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            CreateGlsObject(this.model.get("pid"), "object_" + this.model.get("pid"), this.model.get("pFileUrl"));
            return this;
        },
        ListenImageUrl: function () {
            //            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            //            return false;
            $('#' + this.model.get("pid") + '')
				  .draggable({
				      delay: Globle.DragDelayTime,
				      start: function (event, ui) {
				          startDraggable(event, ui);
				      },
				      drag: function (event, ui) {
				          Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
				          dragCalcuteGuide(event, ui);
				      },
				      stop: function (event, ui) {
				          stopCalcuteGuide(event, ui);
				      }
				  });
            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();
            Globle.IsInit || this.activeImage();
        },
        glStudioMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#glStudioIcon').length <= 0) {
                $('<img id="glStudioIcon" src="../../images/Icon/24/GLStudio.jpg" style="position: absolute; top:0px;left:-17px;width:16px;height:16px;"  alt="GLStudio" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        glStudioMouseOutHideIcon: function () {
            if ($('#glStudioIcon').length > 0) {
                $('#glStudioIcon').remove();
            }
        },
        imgMousedown: function (event) {
            //            return false;
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateManualMakeRelateResourceFileTemplateAttributeView": !this.model.get("pUpdateManualMakeRelateResourceFileTemplateAttributeView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();

            //            $("#currentPageInfo").empty();
            $(".attributeHoldPlace").empty();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //Catia View
    CatiaView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'catiaMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'catiaMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //监听model的imageurl
            //            this.model.bind("change:pFileUrl", this.ListenImageUrl, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(CatiaModel.CatiaTemplate());
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenImageUrl: function () {
            //            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            //            console.log('initializeDropAndResize');
            //            return false;
            $('#' + this.model.get("pid") + '')
				   .resizable({
				       handles: 'ne, se, sw, nw, n, e, s, w',
				       start: function (event, ui) {
				           startResize(event, ui);
				       },
				       resize: function (event, ui) {
				           Globle.CurrentModel.set({ "pWidth": ui.position.width, 'pHeight': ui.position.height });
				       },
				       stop: function (event, ui) {
				           Globle.CurrentModel.set({
				               "pWidth": ui.size.width,
				               'pHeight': ui.size.height,
				               'pTop': ui.position.top,
				               'pLeft': ui.position.left
				           });
				           Globle.CurrentModel.save();
				       }
				   }).draggable({
				       delay: Globle.DragDelayTime,
				       start: function (event, ui) {
				           startDraggable(event, ui);
				       },
				       drag: function (event, ui) {

				           dragCalcuteGuide(event, ui);
				           Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
				       },
				       stop: function (event, ui) {
				           stopCalcuteGuide(event, ui);
				       }
				   });
            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();
            Globle.IsInit || this.activeImage();
        },
        catiaMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#catiaIcon').length <= 0) {
                $('<img id="catiaIcon" src="../../images/Icon/24/Catia.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Catia" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        catiaMouseOutHideIcon: function () {
            if ($('#catiaIcon').length > 0) {
                $('#catiaIcon').remove();
            }
        },
        imgMousedown: function (event) {
            //            return false;
            Globle.CurrentModel = this.model;

            this.activeImage(event);

            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateManualMakeRelateResourceFileTemplateAttributeView": !this.model.get("pUpdateManualMakeRelateResourceFileTemplateAttributeView")

            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            //            $("#currentPageInfo").empty();
            $(".attributeHoldPlace").empty();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //Flash View
    FlashView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'flashMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'flashMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //监听model的imageurl
            //            this.model.bind("change:pFileUrl", this.ListenImageUrl, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(FlashModel.FlashTemplate);
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenImageUrl: function () {
            //            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            //            return false;
            $('#' + this.model.get("pid") + '')
				   .resizable({
				       handles: 'ne, se, sw, nw, n, e, s, w',
				       start: function (event, ui) {
				           startResize(event, ui);
				       },
				       resize: function (event, ui) {

				       },
				       stop: function (event, ui) {
				           Globle.CurrentModel.set({
				               "pWidth": ui.size.width,
				               'pHeight': ui.size.height,
				               'pTop': ui.position.top,
				               'pLeft': ui.position.left
				           });
				           Globle.CurrentModel.save();
				       }
				   }).draggable({
				       delay: Globle.DragDelayTime,
				       start: function (event, ui) {
				           startDraggable(event, ui);
				       },
				       drag: function (event, ui) {

				           dragCalcuteGuide(event, ui);
				       },
				       stop: function (event, ui) {
				           stopCalcuteGuide(event, ui);
				       }
				   });
            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();
            Globle.IsInit || this.activeImage();
        },
        flashMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#flashIcon').length <= 0) {
                $('<img id="flashIcon" src="../../images/Icon/24/Flash.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Flash" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        flashMouseOutHideIcon: function () {
            if ($('#flashIcon').length > 0) {
                $('#flashIcon').remove();
            }
        },
        imgMousedown: function (event) {
            console.log("imgMousedown");
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            //            this.model.set({ "pUpdateAttributeView": !this.model.get("pUpdateAttributeView") });
            //            this.model.set({ "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel") });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            //            $("#currentPageInfo").empty();
            $(".attributeHoldPlace").empty();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //显示在界面上供客户操作的audio视图
    AudioView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //            //                    var key = 'click #' + this.model.get('pid') + "";
            //            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'audioMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'audioMouseOutHideIcon';
            return obj;
        },
        initialize: function () {

            this.template = this.generateTemplate();
            this.render();
            //监听model的imageurl
            this.model.bind("change:pFileUrl", this.ListenImageUrl, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            //            return _.template('<div class="pcontent" id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; background-image:url(\'../Animation/AnimationResource/images/music.png\');"><audio autoPlay="autoplay"><source src="<%=pFileUrl %>" type="audio/mpeg">Your browser does not support the audio element</audio></div> ');
            return _.template('<div class="pcontent" id="<%=pid %>" style="width:<%=parseInt(pWidth)+14 %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;"><div id="player_<%=pid %>"></div> <span id="moveSpan" style="cursor: move;margin: 0px;float: right;position: relative;top: -30px;" class="glyphicon glyphicon-move"></span></div>');
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            AudioModel.CreatePlayer(this.model, "player_" + this.model.get("pid"), !1);
            return this;
        },
        ListenImageUrl: function () {
            //            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.draggable({
					    handle: "#moveSpan",
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    delay: Globle.DragDelayTime,
					    drag: function (event, ui) {

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					    },
					    stop: function (event, ui) {
					        Globle.CurrentModel.save();
					    }
					});
            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();
            Globle.IsInit || this.activeImage();
        },
        audioMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#audioIcon').length <= 0) {
                $('<img id="audioIcon" src="../../images/Icon/24/Audio.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Audio" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        audioMouseOutHideIcon: function () {
            if ($('#audioIcon').length > 0) {
                $('#audioIcon').remove();
            }
        },
        imgMousedown: function (event) {
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({ "pUpdateAttributeView": !this.model.get("pUpdateAttributeView") });
            this.model.set({ "pUpdateInitView": !this.model.get("pUpdateInitView") });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            //            $("#currentPageInfo").empty();
            //            $("#elementInfo").empty();
            activeImage(this.model, event);


            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //显示在界面上供客户操作的Arrow视图
    ArrowView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(ArrowModel.ArrowTemplate);
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.resizable({
					    handles: 'ne, se, sw, nw, n, e, s, w',
					    start: function (event, ui) {
					        startResize(event, ui);
					    },
					    resize: function (event, ui) {

					        ElementBaseModel.ResizableResize(event, ui);
					    },
					    stop: function (event, ui) {
					        Globle.CurrentModel.save();
					    }
					})
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {
					        dragCalcuteGuide(event, ui);

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            Globle.IsInit || this.activeImage();
        },
        imgMousedown: function (event) {
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel"),
                "pUpdateInitView": !this.model.get("pUpdateInitView"),
                "pUpdateTriggerView": !this.model.get("pUpdateTriggerView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();

            $("#pageSetPanel a[href='#currentInfo']").tab('show');
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();

            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //显示在界面上供客户操作的BugFlag视图
    BugFlagView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            var key1 = 'dblclick #' + this.model.get('pid') + "";
            obj[key1] = 'imgDbClick';

            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template('<div class="pcontent" id="<%=pid %>" style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px;z-index:<%=SequenceID %>; "><div class="bugContainer"><div class="bugContent" style="<%=pBoxShadowCSS %>"><%=pBugContent%></div><bugflags style="<%=pSArrowDirectCSS%>"><bugflagi style="<%=pIArrowDirectCSS%>"></bugflagi></bugflags></div></div> ');
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					 .resizable({
					     maxHeight: Globle.BugFlagMaxHeight,
					     maxWidth: Globle.BugFlagMaxWidth,
					     minHeight: Globle.BugFlagMinHeight,
					     minWidth: Globle.BugFlagMinWidth,
					     handles: 'ne, se, sw, nw, n, e, s, w',
					     start: function (event, ui) {
					         startResize(event, ui);
					     },
					     resize: function (event, ui) {

					         Globle.CurrentModel.set({ "pWidth": ui.size.width, 'pHeight': ui.size.height });
					         //更新小箭头,当拖动右边的2个角时而且箭头方向为right和down,才需要更新小箭头.
					         //left和top只要有一个更新,说明是左边的2个角
					         //                             console.log(ui.originalPosition.left, ui.position.left, ui.originalPosition.top, ui.position.top);
					         if (((Globle.CurrentModel.get("pArrowDirect") == "right") || (Globle.CurrentModel.get("pArrowDirect") == "down"))) {
					             //                                 console.log(ui.originalElement.left != ui.position.left);
					             switch (Globle.CurrentModel.get("pArrowDirect")) {
					                 case "right":
					                     $("bugflags", "#" + Globle.CurrentModel.get("pid") + "").css({
					                         "left": (parseInt(ui.size.width)) + "px"
					                     });
					                     break;
					                 case "down":
					                     $("bugflags", "#" + Globle.CurrentModel.get("pid") + "").css({
					                         "top": (parseInt(ui.size.height)) + "px"
					                     });
					                     break;
					             }
					         }
					     },
					     stop: function (event, ui) {
					         Globle.CurrentModel.set({
					             pSArrowDirectCSS: $("bugflags", "#" + Globle.CurrentModel.get("pid") + "").attr("style"),
					             pLeft: ui.position.left,
					             pTop: ui.position.top,
					             silent: !0
					         });
					         Globle.CurrentModel.save();
					     }
					 })
					.draggable({
					    delay: Globle.DragDelayTime,
					    drag: function (event, ui) {

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					    },
					    stop: function (event, ui) {
					        Globle.CurrentModel.save();
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            Globle.IsInit || this.activeImage();
        },
        imgMousedown: function (event) {
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateInitView": !this.model.get("pUpdateInitView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        imgDbClick: function (event) {
            console.log("imgDbClick");

            //弹出模态,让用户输入内容
            $("#CommonModal").on('show.bs.modal', function (e) {
                //                $.blockUI();
                //                console.log(this);

                $("#iframeModalHelper").show().css("z-index", $(this).css("z-index") - 1);

                $("#H2Tile", this).text(GetTranslateUI('TEditingbugdescription'));
                $(".modal-dialog", this).width(800);
                $(".modal-body", this).height(500).empty();

                var configTemp = {
                    height: $(".modal-body", this).height() - 50,
                    toolbar: [
					{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'FontSize'] },
					{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] }
					]
                };

                Globle.Editor1 = CKEDITOR.appendTo($(".modal-body", this)[0],
				configTemp,
				Globle.CurrentModel.get("pBugContent")
				);
                Globle.Editor1.focus();

            }).on('hide.bs.modal', function (e) {
                //                $.unblockUI();
                $(e.currentTarget).unbind("hide.bs.modal").unbind("show.bs.modal");

                //                console.log("sdf");


                $('#CommonModal').off('hide.bs.modal.prevent')

                $("#iframeModalHelper").css("z-index", "-11111").hide();
                $(".modal-body", this).empty();
                Globle.CurrentModel.set({
                    "pBugContent": Globle.Editor1.getData(),
                    silent: !0
                });
                Globle.CurrentModel.save();

                $(".bugContent", "#" + Globle.CurrentModel.get("pid") + "").empty().append(Globle.CurrentModel.get("pBugContent"));

                Globle.Editor1 && (Globle.Editor1 = null);

            })
            $("#CommonModal").modal('show');

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();

            $("#pageSetPanel a[href='#currentInfo']").tab('show');
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();

            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    LayerView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'layerMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'layerMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.render();
            //监听model的imageurl
            //            this.model.bind("change:pFileUrl", this.ListenImageUrl, this);
            this.model.bind("remove", this.ListenRemove, this);

            this.initializeDropAndResize();
        },
        generateHTML: function () {
            //生成html,逻辑上:
            //首先生成layerhtml,然后,生成layer内的所有元素.
            //然后生成包含的所有动作和触发器,这些要加入到Globle的collection中           
            return BoardModel.InitAllChildrenModel(this.model);
        },
        render: function () {
            var tempResult = this.generateHTML();
            $('#' + this.model.get("pParentElementID") + '').append(tempResult[0]);
            //初始化视频和音频
            _.each(tempResult[1], function (item, index) {
                switch (item.value.pType) {
                    case "Audio":
                        AudioModel.CreatePlayer(item.value, "preview_player_" + item.pid, !1);
                        break;

                    case "Video":
                        VideoModel.CreatePlayer(item.value, "preview_player_" + item.pid, !1);
                        break;

                    case "GlStudio":
                        CreateGlsObject(item.pid, "object_" + item.pid, item.value.pFileUrl);
                        break;

                    default:
                        alert(GetTranslateUI('TIllegalOperation') + "!");
                        location.reload();
                        break;
                }
            });
            return this;
        },

        ListenImageUrl: function () {
            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
								.resizable({
								    handles: 'ne, se, sw, nw, n, e, s, w',
								    start: function (event, ui) {
								        startResize(event, ui);
								    },
								    resize: function (event, ui) {

								        Globle.CurrentModel.set({ "pWidth": ui.size.width, 'pHeight': ui.size.height, "pTop": ui.position.top, 'pLeft': ui.position.left });
								    },
								    stop: function (event, ui) {
								        Globle.CurrentModel.save();
								    }
								})
								.draggable({
								    delay: Globle.DragDelayTime,
								    start: function (event, ui) {
								        startDraggable(event, ui);
								    },
								    drag: function (event, ui) {

								        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
								        dragCalcuteGuide(event, ui);
								    },
								    stop: function (event, ui) {
								        stopCalcuteGuide(event, ui);
								    }
								});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            Globle.IsInit || this.activeImage();
        },
        layerMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            var pType = $(data.target).attr('ptype');
            //            if (pType == 'layer') {
            if ($('#layerIcon').length <= 0) {
                $('<img id="layerIcon" src="../../images/Icon/24/Layer.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Layer" />').insertBefore($("#" + modelId)[0].firstChild);
            }
            //            }
            //            else {
            //                if ($('#layerIcon').length <= 0) {
            //                    $('<img id="layerIcon" src="../../images/Icon/24/Layer.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Layer" />').insertBefore($(data.target).parents("[ptype='layer']").first('div')[0].firstChild);
            //                }
            //            }
        },
        layerMouseOutHideIcon: function () {
            if ($('#layerIcon').length > 0) {
                $('#layerIcon').remove();
            }
        },
        imgMousedown: function (event) {
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel"),
                "pUpdateInitView": !this.model.get("pUpdateInitView"),
                "pUpdateTriggerView": !this.model.get("pUpdateTriggerView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();

            $("#pageSetPanel a[href='#currentInfo']").tab('show');
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();

            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });


    //显示在界面上供客户操作的image视图
    ImageView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            //            var key1 = 'click #' + this.model.get('pid') + "";
            //            obj[key1] = 'imgClickShowIcon';

            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'imgMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'imgMouseOutHideIcon';

            var key4 = 'click #' + this.model.get('pid') + "";
            obj[key4] = 'imgMouseClickShowRotateIcon';

            //            var key5 = 'blur'; //点击素材旋转功能
            //            obj[key5] = 'imgMouseBlurShowRotateIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            //监听model的imageurl
            this.model.bind("change:pFileUrl", this.ListenImageUrl, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(ImageModel.ImageTemplate);
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },

        ListenImageUrl: function () {
            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.resizable({
					    handles: 'ne, se, sw, nw, n, e, s, w',
					    start: function (event, ui) {
					        startResize(event, ui);
					    },
					    resize: function (event, ui) {

					        ElementBaseModel.ResizableResize(event, ui);
					    },
					    stop: function (event, ui) {
					        $("#guide-v, #guide-h").hide();

					        //                            console.log(_.map(Globle.CurrentModel));

					        Globle.CurrentModel.save();
					        //查找当前动画model集合,更新贝赛尔曲线各个点的坐标
					        var action = Globle.AnimationBaseModelCollection.where({
					            "BelongToElementID": event.target.id,
					            "actionType": "BezierType"
					        })[0];
					        if (action) {

					            var jsonObj = '';
					            if ((typeof action.get("AnimationJSONData")) == 'string')
					                jsonObj = $.parseJSON(decodeURIComponent(action.get("AnimationJSONData")));
					            else
					                jsonObj = action.get("AnimationJSONData");

					            jsonObj.pointData[0].pointX += ((ui.size.width - ui.originalSize.width) / 2);
					            jsonObj.pointData[0].pointY += ((ui.size.height - ui.originalSize.height) / 2);

					            action.set({ "AnimationJSONData": encodeURIComponent(JSON.stringify(jsonObj)), silent: !0 });

					            action.save();
					        }
					    }
					})
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					        dragCalcuteGuide(event, ui);
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					        //查找当前动画model集合,更新贝赛尔曲线各个点的坐标
					        //					        var action = GetActionsByRelateElementID("BezierType")[0];
					        var action = Globle.AnimationBaseModelCollection.where({
					            "BelongToElementID": event.target.id,
					            "actionType": "BezierType"
					        })[0];

					        if (action) {

					            var jsonObj = '';
					            if ((typeof action.get("AnimationJSONData")) == 'string')
					                jsonObj = $.parseJSON(decodeURIComponent(action.get("AnimationJSONData")));
					            else
					                jsonObj = action.get("AnimationJSONData");

					            jsonObj.imageTop = ui.position.top;
					            jsonObj.imageLeft = ui.position.left;

					            _.forEach(jsonObj.pointData, function (item) {
					                item.pointX += (ui.position.left - ui.originalPosition.left);
					                item.pointY += (ui.position.top - ui.originalPosition.top);
					            });
					            action.set({ "AnimationJSONData": encodeURIComponent(JSON.stringify(jsonObj)), silent: !0 });

					            action.save();
					        }
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            Globle.IsInit || this.activeImage();
        },
        //        imgClickShowIcon: function (data) {
        //            if ($('#imgIcon').length <= 0) {
        //                $('<img id="imgIcon" src="../../images/Icon/img.png" style="position: absolute; top:5px;; left:5px;width:16px;height:16px;"  alt="Img" />').insertBefore(data.target);
        //            }
        //        },
        imgMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#imgIcon').length <= 0) {
                $('<img id="imgIcon" src="../../images/Icon/24/Img.jpg" style="position: absolute; top:0px;left:-17px;width:16px;height:16px;"  alt="Img" />').insertBefore($("#" + modelId)[0].firstChild);
            }

        },
        imgMouseOutHideIcon: function () {
            if ($('#imgIcon').length > 0) {
                $('#imgIcon').remove();
            }
        },
        //        imgMouseClickShowRotateIcon: function () { 这段注释代码是为了实现点击图片直接旋转的功能，但是现在一点击旋转按钮 整个元素就会执行droppable，并且禁止droppable时会报错。以后再做这段功能
        //            var modelId = this.model.get("pid");
        //            ($('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '')).find("#imgRotateIcon").remove();
        //            if ($('#imgRotateIcon').length <= 0) {
        //                $('<img id="imgRotateIcon" src="../../images/Icon/rotate_cw.png" style="position: absolute; top:16px;left:-17px;width:16px;height:16px;"  alt="Img" />').insertBefore($("#" + modelId)[0].firstChild);
        //                $('#imgRotateIcon').mousedown(function () {
        //                    $('#' + modelId + '').droppable({ disabled: true });
        //                    console.log($('#' + modelId + ''));
        //                    RotateElement(modelId);
        //                });
        //            }

        //        },
        //        imgMouseBlurShowRotateIcon: function () {
        //            //            if ($('#imgRotateIcon').length > 0) {
        //            //                $('#imgRotateIcon').remove();
        //            //            }
        //        },
        imgMousedown: function (event) {
            Globle.CurrentModel = this.model;
            ClickElement(event);
            this.activeImage(event);
            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel"),
                "pUpdateInitView": !this.model.get("pUpdateInitView"),
                "pUpdateTriggerView": !this.model.get("pUpdateTriggerView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();


            activeImage(this.model, event);
        }
    });


    //显示在界面上供客户操作的 svg 视图
    SVGView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'svgMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'svgMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();

            this.model.bind("change:color", this.ListenColor, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            switch (this.model.get("pType")) {
                case "Arrow":
                    return _.template(SVGModel.SVGTemplateArrow);
                    break;
                case "AdvanceArrow":
                    return _.template(SVGModel.SVGTemplateAdvanceArrow);
                    break;
                case "Box":
                    return _.template(SVGModel.SVGTemplateBox);
                    break;

                case "Circle":
                    return _.template(SVGModel.SVGTemplateCircle);
                    break;
                case "Ellipse":
                    return _.template(SVGModel.SVGTemplateEllipse);
                    break;
                case "SVG":
                    return _.template(SVGModel.SVGTemplate);
                    break;
            }
        },
        render: function () {
            //            debugger;
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()).replace(/\\\"/g, '\"'));
            return this;
        },
        //        ListenImageUrl: function () {
        //            $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        //        },
        ListenColor: function () {
            //            alert('sdf');
            switch (this.model.get("pType")) {
                case "AdvanceArrow":
                case "Arrow":
                    this.$el.find("#" + this.model.get("pid") + " path").attr({
                        "stroke": this.model.get("color"),
                        "fill": this.model.get("color")
                    });
                    break;

                case "Box":
                    this.$el.find("#" + this.model.get("pid") + " rect").attr({
                        "stroke": this.model.get("color")
                    });
                    break;

                case "Circle":
                    this.$el.find("#" + this.model.get("pid") + " circle").attr({
                        "stroke": this.model.get("color")
                    });
                    break;
            }
            //            this.$el.find("#" + this.model.get("pid") + "").css({ "background-color": this.model.get("backgroundColor") });
        },
        ListenRemove: function () {
            //console.log("ListenpRemove"); 
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.resizable({
					    handles: 'ne, se, sw, nw, n, e, s, w',
					    start: function (event, ui) {
					        startResize(event, ui);
					    },
					    resize: function (event, ui) {

					        ElementBaseModel.ResizableResize(event, ui);

					        //如果是box类型,处理逻辑:
					        //1.更新外围div宽高.由jquery自带更新
					        //2.更新svg自身宽高
					        //3.更新svg内容的宽高
					        if (Globle.CurrentModel.attributes.pType == 'Box') {
					            ui.originalElement.children("svg").attr({
					                "width": ui.size.width + "px",
					                "height": ui.size.height + "px"
					            });
					            ui.originalElement.children('svg').children("rect").attr({
					                "width": ui.size.width,
					                "height": ui.size.height
					            });
					        }
					        //如果是高级箭头类型
					        if (Globle.CurrentModel.attributes.pType == 'AdvanceArrow') {
					            if (ui.originalSize != null && ui.size != null) {
					                var ow = ui.originalSize.width;
					                var oh = ui.originalSize.height;
					                var nw = ui.size.width;
					                var nh = ui.size.height;
					                var cw = ow - nw;
					                var ch = nh - oh;
					                var testh = oh - nh;
					                var hPrevSize = $(this).attr("prevSize-height");
					                if (hPrevSize == undefined) {
					                    hPrevSize = oh;
					                }
					                $(this).attr("prevSize-height", nh);

					                if (nh < 10) {
					                    nh = 10;
					                }
					                var line_height = nh - 14;
					                if (nh - 14 > 10) {
					                    line_height = nh * .5;
					                }
					                if (nh > 15) {
					                    changeArrow($(this).find("svg"), nw - 8, Globle.CurrentModel.get("pArrowColor"), line_height, nh, hPrevSize);
					                }
					            }
					        }
					    },
					    stop: function (event, ui) {
					        //如果是高级箭头类型
					        if (Globle.CurrentModel.attributes.pType == 'AdvanceArrow') {
					            Globle.CurrentModel.set({
					                "pArrowStrokeWidth": $(this).find("svg>path:eq(0)").css("stroke-width"), //专用于箭头第一个Path的宽度
					                "pArrowSvgPath1": $(this).find("svg>path:eq(0)").attr("d"), //专用于箭头第一个Path的d值
					                "pArrowSvgPath2": $(this).find("svg>path:eq(1)").attr("d")//专用于箭头第二个Path的d值
					            });
					        }
					        Globle.CurrentModel.save();
					    }
					})
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {

					        dragCalcuteGuide(event, ui);
					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            Globle.IsInit || this.activeImage();
        },
        svgMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#svgIcon').length <= 0) {
                $('<img id="svgIcon" src="../../images/Icon/24/SVG.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="SVG" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        svgMouseOutHideIcon: function () {
            if ($('#svgIcon').length > 0) {
                $('#svgIcon').remove();
            }
        },
        imgMousedown: function (event) {
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel")
            });
            switch (this.model.get("pType")) {
                case "Box":
                case "Circle":
                case "Arrow":
                case "AdvanceArrow":
                case "Ellipse":
                    //这几类元素具有初始面板和触发器设定面板
                    this.model.set({
                        "pUpdateTriggerView": !this.model.get("pUpdateTriggerView"),
                        "pUpdateInitView": !this.model.get("pUpdateInitView")
                    });
                    break;
            }
            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });
    //显示在界面上供客户操作的image序列帧视图
    ImageSequenceView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'sequenceMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'sequenceMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();

            this.model.on("change:pFocus", this.ListenFocus, this);

            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(ImageSequenceModel.ImageSequenceTemplate);
        },
        render: function () {

            //            console.log("render");
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenRemove: function () {
            //console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {

					        dragCalcuteGuide(event, ui);
					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            if (Globle.IsInit) return;
            this.activeImage();
        },
        ListenFocus: function () {
            //先将原来的删除,然后再次render,因为对于序列帧动画,只要更新了一部分,相当于从新渲染
            $("#" + this.model.get("pid") + "").remove();
            this.render().initializeDropAndResize();
        },
        sequenceMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#sequenceIcon').length <= 0) {
                $('<img id="sequenceIcon" src="../../images/Icon/24/Sequence.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Sequence" />').appendTo($("#" + modelId)[0]);
            }
        },
        sequenceMouseOutHideIcon: function () {
            if ($('#sequenceIcon').length > 0) {
                $('#sequenceIcon').remove();
            }
        },
        imgMousedown: function (event) {
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({ "pUpdateAttributeView": !this.model.get("pUpdateAttributeView") });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //imageSlide类型右边显示的属性视图
    ImageSlideAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#imageSlideAttributeInfoTemplate').html());
        },
        events: function () {
            var obj = {};

            var key = "click #" + this.model.get("pid") + "_elementAttribute .updatePicture";
            obj[key] = 'updatePicture';

            var key1 = "click #" + this.model.get("pid") + "_elementAttribute .deletePicture";
            obj[key1] = 'deletePicture';

            var key2 = "blur #" + this.model.get("pid") + "_elementAttribute .elementName";
            obj[key2] = 'blurElementName';

            var key3 = "blur #" + this.model.get("pid") + "_elementAttribute .txtImageSlideChangeSize";
            obj[key3] = 'changeImgSlideSize';

            var key4 = "blur #" + this.model.get("pid") + "_elementAttribute .SetWHXYInfo";
            obj[key4] = 'changeWHXY';

            var key = "click #" + this.model.get("pid") + "_addResourceToSlideElement";
            obj[key] = 'addNewImage';

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

        },
        render: function () {
            //                    //console.log('render');
            if (Globle.IsInit) return;
            $(".attributeHoldPlace").empty();
            $("#ImageSlideAttributeViewHoldPlace", this.$el).empty()
					.append(this.template(this.model.toJSON()));
            $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');

            //只有幻灯片有此排序功能
            if (this.model.get("pType") == "ImageSlide") {
                InitSorted1("#" + this.model.get("pid") + "_elementAttribute", function (event, ui) {
                    //                        var i = -1;
                    //                        ui.item.parent().children().each(function () {
                    //                            this.attributes['SequenceID'].value = (++i);
                    //                        });
                    //处理逻辑:
                    //1. 得到更新后的顺序;
                    //2. 更新ImageSlide实体的ImageArray;
                    //3. 更新html内的index;
                    //4. 更新画板内的元素
                    var OldImageArray = Globle.CurrentModel.get("ImageArray");
                    var NewImageArray = new Array();

                    var i = -1;
                    ui.item.parent().children().each(function () {
                        NewImageArray.push(OldImageArray[this.attributes['sequenceid'].value]);
                        this.attributes['SequenceID'].value = (++i);
                        //更新按钮index
                        $("[index]", this).attr("index", this.attributes['SequenceID'].value);
                        //更新画板内的元素
                        $("#" + Globle.CurrentModel.get("pid") + "_carousel-example-generic .carousel-inner img")[i].src = $(".puppet img", this).attr("src");
                    });

                    Globle.CurrentModel.set({
                        "ImageArray": NewImageArray,
                        silent: !0
                    }).save();
                    if (Globle.LastError.hasError()) {
                        Globle.LastError.ShowError();
                    }
                });
            }
            return this;
        },
        addNewImage: function () {
            //处理逻辑:
            //1. 打开资源库;
            //2. 将选中图片, 插入到当前model的imageArray,最后一个位置.
            //3. 更新当前model到服务端;
            //4. 更新画板内元素
            //5. 更新右边属性元素;
            switch (this.model.get("pType")) {
                case "ImageSlide":
                    Globle.IsUpdateModel = !0;
                    Globle.ClickType = "Slid";
                    this.model.set({
                        CurrentImageIndex: $("#" + this.model.get("pid") + "_elementAttribute li").length, //设置index为最大值+1,欺骗以后的处理代码,以和Button的处理逻辑一致
                        "isDeleteSubImage": !1,
                        silent: !0
                    });

                    break;
            }

            openSelectResource(3);

            //            alert('');
        },
        ListenRemove: function () {
            //            this.$el.empty();
            $(".attributeHoldPlace").empty();
        },
        deletePicture: function (event) {
            //                    Globle.AllModelCollection.remove(this.model);
            //判断,如果删除的是最后一张图片,那么就把整个mode删除
            //删除一张图,就重排一下index

            if (this.model.get("ImageArray").length == 1)
                Globle.AllModelCollection.remove(this.model);
            else {
                var tempDeleteImage = this.model.get("ImageArray")[event.target.attributes['index'].value];
                this.model.get("ImageArray").splice(event.target.attributes['index'].value, 1);
                this.model.set({
                    "pFocus": !this.model.get("pFocus"),
                    "deleteSubImageIDArray": tempDeleteImage.get("pMaterialUsageID")
                });
                this.model.IsDeleteResource = true;
                this.model.save();
                this.model.IsDeleteResource = false;
            }
            this.model.set({
                "deleteSubImageIDArray": "",
                silent: !0
            });

            this.RemoveLiImage(event);
        },
        RemoveLiImage: function (event) {
            //移除当前删除的li
            //更新整个li列表的index
            var tempULElement = $(event.target).parents("ul");
            $(event.target).parents("li").remove();
            var i = -1;
            tempULElement.children().each(function () {
                this.attributes['SequenceID'].value = (++i);
                //更新按钮index
                $("[index]", this).attr("index", this.attributes['SequenceID'].value);
                //更新画板内的元素
                $("#" + Globle.CurrentModel.get("pid") + "_carousel-example-generic .carousel-inner img")[i].src = $(".puppet img", this).attr("src");
            });

            $("#" + Globle.CurrentModel.get("pid") + "_carousel-example-generic .carousel-inner img:gt(" + (i) + ")").parent().remove();

        },
        changeWHXY: function (data) {
            ChangeElementWHXY(this.model, data);
            var pType = this.model.get("pType");
            if (pType == "ImageSlide") {
                if (data.target.id == "width") {
                    $("#" + this.model.get("pid") + " .carousel-inner .item").css("width", data.target.value);
                }
                else if (data.target.id == "height") {
                    $("#" + this.model.get("pid") + " .carousel-inner .item").css("height", data.target.value);
                }
            }
        },
        blurElementName: function (data) {
            //            alert("斯蒂芬");
            //            console.log(data);
            this.model.set({
                silent: !0,
                pName: data.target.value
            });
            this.model.save();
        },
        changeImgSlideSize: function (data) {
            var pType = this.model.get("pType");
            var imgSlideSrc = this.model.get("ImageArray")[0].get("pFileUrl");
            imgLoad(imgSlideSrc, function (imgSlideWidthOld, imgSlideHeightOld) {
                var imgSlideWidthNew;
                var imgSlideHeightNew;
                if (data.target.value != "") {
                    var percentSize = parseInt(data.target.value);
                    if (isNaN(percentSize)) {
                        return;
                    }
                    else {
                        percentSize = percentSize > 500 ? 500 : percentSize;
                        imgSlideWidthNew = (parseInt((percentSize / 100) * parseInt(imgSlideWidthOld))) + "px";
                        imgSlideHeightNew = (parseInt((percentSize / 100) * parseInt(imgSlideHeightOld))) + "px";
                    }
                }
                else {
                    return;
                }
                AddResizeMemo();

                this.model.set({
                    pWidth: imgSlideWidthNew.substring(0, imgSlideWidthNew.indexOf("px")),
                    pHeight: imgSlideHeightNew.substring(0, imgSlideHeightNew.indexOf("px"))
                });
                this.model.save();

                if (Globle.LastError.hasError()) {
                    Globle.LastError.ShowError();
                    location.reload();
                }

                $("#" + this.model.get("pid")).css("width", imgSlideWidthNew);
                $("#" + this.model.get("pid")).css("height", imgSlideHeightNew);
                //幻灯片转换
                if (pType == "ImageSlide") {
                    $("#" + this.model.get("pid") + " .carousel-inner .item").css("width", imgSlideWidthNew);
                    $("#" + this.model.get("pid") + " .carousel-inner .item").css("height", imgSlideHeightNew);
                }
            }, this);
        },
        updatePicture: function (event) {
            //            console.log('updatePicture');
            //                    console.log(this);
            this.model.set({
                CurrentImageIndex: event.target.attributes['index'].value,
                "isDeleteSubImage": !1,
                silent: !0
            });

            Globle.IsUpdateModel = !0;

            switch (this.model.get("pType")) {
                case "ImageSlide":
                    Globle.ClickType = "Slid";
                    break;

                case "Image":
                    Globle.ClickType = "Resource";
                    break;

                case "ImageRotate":
                    Globle.ClickType = "Rotate";
                    break;

                case "ButtonType":
                    Globle.ClickType = "Button";
                    break;

                default:
                    alert(GetTranslateUI('TIllegalparameter'));
                    break;
            }

            openSelectResource(2);
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
        ListenUpdateView: function (event) {
            //                    console.log(event);
            //            console.log("ListenUpdateView_ImageSlideAttributeView");

            switch (event.get("pType")) {
                case "ImageSlide":
                    this.render();
                    break;

                case "Image":
                    this.ListenPwidth();
                    this.ListenpHeight();
                    this.ListenpLeft();
                    this.ListenpTop();
                    $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');
                    break;

                case "ImageRotate":
                    this.render();
                    break;

                case "ButtonType":
                    this.render();
                    break;

                default:
                    alert(GetTranslateUI('TIllegalparameter'));
                    break;
            }

            //通知已设置动作属性的面板进行渲染
            this.addActionRender();

        },
        addActionRender: function () {
            //                    //在全局动作集合中,找到当前model涉及到的所有动作,并显示在动作右边的属性面板中
            //                    var actionList = GetActionsByRelateElementID();
            //                    //                    //console.log(actionList);
            //                    var tempStr = '';
            //                    actionList.forEach(function (item) {
            //                        tempStr += (_.template($("#settedActionRowTemplate").html())(item.toJSON()));
            //                    }, this);
            //                    $(".settedAction", this.$el).empty().append(tempStr);
        }
    });

    //类型右边显示的属性视图
    CommonResourceAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#CommonResourceTemplate').html());
        },
        events: function () {
            var obj = {};

            var key = "click #" + this.model.get("pid") + "_CommonResourceTemplate .updatePicture";
            obj[key] = 'updatePicture';

            //            var key1 = "click #" + this.model.get("pid") + "_elementAttribute .deletePicture";
            //            obj[key1] = 'deletePicture';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();

            this.model.bind("remove", this.ListenRemove, this);
            this.model.bind("change:pUpdateAttributeView", this.ListenUpdateView, this);
        },
        render: function () {
            console.log('CommonResourceAttributeView');
            if (Globle.IsInit) return;

            $("#CommonResourceTemplateHoldPlaceDiv").empty()
            .append(this.template(this.model.toJSON()));
            $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');
            return this;
        },
        ListenRemove: function () {
            //            this.$el.empty();
            $(".attributeHoldPlace").empty();
        },
        deletePicture: function (event) {

        },
        updatePicture: function (event) {
            console.log('updatePicture');
            //                                console.log(this);
            this.model.set({
                CurrentImageIndex: event.target.attributes['index'].value,
                "isDeleteSubImage": !1,
                silent: !0
            });

            Globle.IsUpdateModel = !0;

            switch (this.model.get("pType")) {

                case "ButtonType":
                    Globle.ClickType = "Button";
                    break;

                default:
                    alert(GetTranslateUI('TIllegalparameter'));
                    break;
            }

            openSelectResource(2);
        },
        ListenUpdateView: function (event) {
            //                                console.log(event);
            console.log("ListenUpdateView_CommonResourceTemplateView");

            switch (event.get("pType")) {

                case "ButtonType":
                    this.render();
                    break;

                default:
                    alert(GetTranslateUI('TIllegalparameter'));
                    break;
            }
        }
    });
    //划动轮转动画的view
    ImageRotateView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'imageRotateMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'imageRotateMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("change:pFocus", this.ListenFocus, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(ImageRotateModel.ImageRotateTemplate());
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenFocus: function () {
            console.log("ListenFocus_ImageSlideView");

            _.each(this.model.get("ImageArray"), function (item, index) {
                $('#' + this.model.get("pid") + ' img', this.$el)[index].src = item.get('pFileUrl');
            }, this);
        },
        ListenRemove: function () {
            console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.resizable({
					    handles: 'ne, se, sw, nw, n, e, s, w',
					    start: function (event, ui) {
					        startResize(event, ui);
					    },
					    resize: function (event, ui) {

					        ElementBaseModel.ResizableResize(event, ui);
					    },
					    stop: function (event, ui) {
					        Globle.CurrentModel.save();
					    }
					})
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					        dragCalcuteGuide(event, ui);
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            if (Globle.IsInit) return;
            this.activeImage();
        },
        imageRotateMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#imageRotateIcon').length <= 0) {
                $('<img id="imageRotateIcon" src="../../images/Icon/24/SlideRotate.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="ImageRotate" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        imageRotateMouseOutHideIcon: function () {
            if ($('#imageRotateIcon').length > 0) {
                $('#imageRotateIcon').remove();
            }
        },
        imgMousedown: function (event) {
            console.log(event.type);
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({ "pUpdateAttributeView": !this.model.get("pUpdateAttributeView") });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //button iew
    ButtonView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("change:pFocus", this.ListenFocus, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template('<div class="pcontent" id="<%=pid %>" <% if(IsSupportMultipleSelect){ %> IsSupportMultipleSelect=true  <% } %> style="width:<%=pWidth %>px;height:<%=pHeight %>px; position:absolute; top:<%=pTop %>px;left:<%=pLeft %>px; z-index:<%=SequenceID %>;">'
					 + $("#buttonViewTemplate").html() + '</div> ');
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenFocus: function () {
            console.log("ListenFocus_ButtonView");
            $('#' + this.model.get("pid") + ' img', this.$el)[0].src = this.model.get("ImageArray")[0].get('pFileUrl');
            //            _.each(this.model.get("ImageArray"), function (item, index) {
            //                $('#' + this.model.get("pid") + ' img', this.$el)[index].src = item.get('pFileUrl');
            //            }, this);
        },
        ListenRemove: function () {
            console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.resizable({
					    handles: 'ne, se, sw, nw, n, e, s, w',
					    start: function (event, ui) {
					        startResize(event, ui);
					    },
					    resize: function (event, ui) {
					        ElementBaseModel.ResizableResize(event, ui);
					    },
					    stop: function (event, ui) {
					        Globle.CurrentModel.save();
					    }
					})
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					        dragCalcuteGuide(event, ui);
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            if (Globle.IsInit) return;
            this.activeImage();
        },
        imgMousedown: function (event) {
            console.log(event.type);
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"),
                "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel"),
                "pUpdateInitView": !this.model.get("pUpdateInitView"),
                "pUpdateTriggerView": !this.model.get("pUpdateTriggerView")
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide();
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show();
        }
    });

    //显示在界面上供客户操作的imageSlide视图,幻灯片
    ImageSlideView = Backbone.View.extend({
        el: $("#inactionArea"),
        events: function () {
            var obj = {};
            var key = 'mousedown #' + this.model.get('pid') + "";
            obj[key] = 'imgMousedown';
            //                    var key = 'click #' + this.model.get('pid') + "";
            //                    obj[key] = 'imgMousedown';

            var key2 = 'mouseover #' + this.model.get('pid') + "";
            obj[key2] = 'slideMouseOverShowIcon';

            var key3 = 'mouseout #' + this.model.get('pid') + "";
            obj[key3] = 'slideMouseOutHideIcon';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();
            this.model.bind("change:pFocus", this.ListenFocus, this);
            this.model.bind("remove", this.ListenRemove, this);
            this.initializeDropAndResize();
        },
        generateTemplate: function () {
            return _.template(ImageSlideModel.ImageSlideTemplate());
        },
        render: function () {
            $('#' + this.model.get("pParentElementID") + '').append(this.template(this.model.toJSON()));
            return this;
        },
        ListenImageArray: function () {
            //                    $("#" + this.model.get("pid") + " img")[0].src = this.model.get("pFileUrl");
        },
        ListenFocus: function () {
            console.log("ListenFocus_ImageSlideView");

            _.each(this.model.get("ImageArray"), function (item, index) {
                if ($('#' + this.model.get("pid") + '_carousel-example-generic img', this.$el)[index]) {
                    $('#' + this.model.get("pid") + '_carousel-example-generic img', this.$el)[index].src = item.get('pFileUrl');
                }
                else {
                    //说明是新添加的image,那么动态插入一个image节点
                    var cloneDiv = $('#' + this.model.get("pid") + '_carousel-example-generic img', this.$el).first().parent().clone().removeClass("active");
                    cloneDiv.children("img").attr("src", item.get('pFileUrl'));
                    $('#' + this.model.get("pid") + '_carousel-example-generic  .carousel-inner', this.$el).append(cloneDiv);
                }

            }, this);
        },
        ListenRemove: function () {
            console.log("ListenpRemove");
            $("#" + this.model.get("pid") + "").remove();
        },
        initializeDropAndResize: function () {
            $('#' + this.model.get("pid") + '')
					.resizable({
					    handles: 'ne, se, sw, nw, n, e, s, w',
					    start: function (event, ui) {
					        startResize(event, ui);
					    },
					    resize: function (event, ui) {

					        //更新该view内的每个item的宽和高
					        $(".item", this).width(ui.size.width).height(ui.size.height);
					        ElementBaseModel.ResizableResize(event, ui);
					    },
					    stop: function (event, ui) {
					        Globle.CurrentModel.save();
					    }
					})
					.draggable({
					    delay: Globle.DragDelayTime,
					    start: function (event, ui) {
					        startDraggable(event, ui);
					    },
					    drag: function (event, ui) {

					        Globle.CurrentModel.set({ "pTop": ui.position.top, 'pLeft': ui.position.left });
					        dragCalcuteGuide(event, ui);
					    },
					    stop: function (event, ui) {
					        stopCalcuteGuide(event, ui);
					    }
					});

            $('.pcontent.ui-draggable').children("div.ui-resizable-handle").hide();

            Globle.IsInit || this.activeImage();
        },
        slideMouseOverShowIcon: function (data) {
            var modelId = this.model.get("pid");
            if ($('#slideIcon').length <= 0) {
                $('<img id="slideIcon" src="../../images/Icon/24/Slide.jpg" style="position: absolute; top:0px; left:-17px;width:16px;height:16px;"  alt="Slide" />').insertBefore($("#" + modelId)[0].firstChild);
            }
        },
        slideMouseOutHideIcon: function () {
            if ($('#slideIcon').length > 0) {
                $('#slideIcon').remove();
            }
        },
        imgMousedown: function (event) {
            console.log(event.type);
            Globle.CurrentModel = this.model;

            this.activeImage(event);
            this.model.set({
                "pUpdateAttributeView": !this.model.get("pUpdateAttributeView"), //该值改变,通知更新属性区域
                "pUpdateSetPanelAttributeView": !this.model.get("pUpdateSetPanelAttributeView"), //该值改变,通知设置区域,比如设置自动播放
                "pUpdateInitView": !this.model.get("pUpdateInitView"), //该值改变,通知初始设置区域更新
                "pUpdateAnimationAttributePanel": !this.model.get("pUpdateAnimationAttributePanel")//该值改变, 通知"动作设置区域"更新
            });

            event.stopImmediatePropagation();
            event.isImmediatePropagationStopped();
            //                    //console.log(event);
        },
        activeImage: function (event) {
            //            Globle.Editor.Destory();
            activeImage(this.model, event);
            //            $('.pcontent.ui-draggable').not('#' + this.model.get("pid") + '').removeClass("pactive").children("div.ui-resizable-handle").hide(); ;
            //            $('#' + this.model.get("pid") + '').hasClass("pactive") || $('#' + this.model.get("pid") + '').addClass("pactive").children("div.ui-resizable-handle").show(); ;
        }
    });
    //序列帧属性窗口
    ImageSequenceAttributeView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#CommonAttributeTemplate').html().replace("fieldsetHoldPlace", $('#ImageSequenceResourceTemplate').html()));
        },
        events: function () {

            var obj = {};

            var key = "click #" + this.model.get("pid") + "_elementCommonAttribute .updatePicture";
            obj[key] = 'updatePicture';

            var key1 = "click #" + this.model.get("pid") + "_elementCommonAttribute .deletePicture";
            obj[key1] = 'deletePicture';

            var key2 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .elementName";
            obj[key2] = 'blurElementName'

            var key3 = "blur #" + this.model.get("pid") + "_elementCommonAttribute .SetWHXYInfo";
            obj[key3] = 'changeImageSizePostion';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.render();

            this.model.bind("remove", this.ListenRemove, this);
            this.model.bind("change:pUpdateAttributeView", this.render, this);
            this.model.bind("change:pLeft", this.ListenpLeft, this);
            this.model.bind("change:pTop", this.ListenpTop, this);
            this.model.bind("change:ImageSequenceAttributeView", this.ListenpFileResourceFromLocation, this);

            //            this.model.bind("change:pWidth", this.ListenPwidth, this);
            //            this.model.bind("change:pHeight", this.ListenpHeight, this);

        },
        render: function () {
            //                    //console.log('render');
            if (Globle.IsInit) return;
            $(".attributeHoldPlace").empty();
            $("#ImageSequenceAttributeViewHoldPlaceDiv").empty()
					.append(this.template(this.model.toJSON()));
            $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');
            return this;
        },
         ListenpFileResourceFromLocation: function () {
            $(".ResourceSource", this.$el).text(ProcessResourceSource(this.model.get("ImageModel").get("pResourceType"), this.model.get("ImageModel").get("pFileResourceFromLocation")).cut(0, 10)).attr("title", ProcessResourceSource(this.model.get("ImageModel").get("pResourceType"), this.model.get("ImageModel").get("pFileResourceFromLocation")));
        },
        ListenRemove: function () {
            //            this.$el.empty();
            $(".attributeHoldPlace").empty();
        },
        deletePicture: function (event) {
            Globle.AllModelCollection.remove(this.model);
        },
        changeImageSizePostion: function (data) {

            ChangeElementWHXY(this.model, data);

        },
        blurElementName: function (data) {
            //            alert("斯蒂芬");
            //            console.log(data);
            this.model.set({
                silent: !0,
                pName: data.target.value
            });
            this.model.save();
        },
        updatePicture: function (event) {
            //            console.log('updatePicture');

            //首先弹出素材选择框,得到用户选择的图片,更新当前model,然后弹出设置窗体
            //弹出模态,让用户输入图片的帧数,在设置窗体关闭时,更新编辑区域
            Globle.ClickType = "Sequence";
            Globle.IsUpdateModel = !0;
            openSelectResource(2);
            //            this.model.set({ "ImageModel": this.model.get("ImageModel").set({ "pFileUrl": window.location.origin + "/lcms/HTMLTemplate/Animation/AnimationResource/images/test2.jpg" }) });
            //            this.model.save();
            //            new SequenceSetPanelView({ model: this.model }).ShowModal();

            //            //更新本属性窗体中的img和位置信息
            //            $("#imageID").attr("src", this.model.get("ImageModel").get("pFileUrl"));
        },
        //        ListenPwidth: function () {
        //            $("#width", this.$el).text(this.model.get("pWidth"));
        //        },
        //        ListenpHeight: function () {
        //            $("#height", this.$el).text(this.model.get("pHeight"));
        //        },
        ListenpLeft: function () {
            //            console.log(this.model.get("pLeft"));
            $("#left", this.$el).val(this.model.get("pLeft"));
        },
        ListenpTop: function () {
            $("#top", this.$el).val(this.model.get("pTop"));
        }
        //                ListenUpdateView: function (event) {
        //                    //                    console.log(event);
        //                    $("#elementAndPageInfoPanel a[href='#elementInfo']").tab('show');
        //                }
    });

    //动作属性面板的view
    AnimationAttributePanelView = Backbone.View.extend({
        el: $('#elementInfo'),
        generateTemplate: function () {
            return _.template($('#AnimationTemplate').html());
        },
        events: function () {
            var obj = {};
            var key = 'click #' + this.model.get('pid') + "_addaction";
            console.log(key);
            obj[key] = 'addActionClick';
            return obj;
        },
        initialize: function () {
            this.template = this.generateTemplate();
            this.model.on("change:pUpdateAnimationAttributePanel", this.pUpdateAnimationAttributePanel, this);

            this.collection = Globle.AnimationBaseModelCollection;

            this.collection.unbind("add", this.addActionRender);
            this.collection.unbind("remove", this.updateSettedActionPanel);

            this.collection.bind("add", this.addActionRender, this);
            this.collection.bind("remove", this.updateSettedActionPanel, this);

            this.render();
        },
        render: function () {
            console.log("render");
            if (Globle.IsInit) return;
            //            if (!$('#' + this.model.get('pid') + '_AnimationAttribute').length)
            $("#AnimationSetHoldPlaceDiv").empty().append(this.template(this.model.toJSON()));
            //            this.addActionRender();
            return this;
        },
        pUpdateAnimationAttributePanel: function () {
            console.log("pUpdateAnimationAttributePanel");
            if (Globle.IsInit) {
                return;
            }
            this.render();
            this.updateSettedActionPanel();
        },
        addActionRender: function () {
            if (Globle.IsInit) {
                return;
            }
            console.log("AnimationAttributePanelView.addActionRender");
            ////            this.model.save();
            this.updateSettedActionPanel();
        },
        updateSettedActionPanel: function () {
            console.log("updateSettedActionPanel");

            //在全局动作集合中,找到当前model涉及到的所有动作,并显示在动作右边的属性面板中 
            SortCollection(Globle.AnimationBaseModelCollection);
            var actionList = Globle.AnimationBaseModelCollection.where({
                "BelongToElementID": Globle.CurrentModel == null ? Globle.CurrentBoard.get("pid") : Globle.CurrentModel.get("pid"),
                "IsCanSort": true
            });
            //                    //console.log(actionList);
            var tempStr = '';
            actionList.forEach(function (item) {
                tempStr += (_.template($("#settedActionRowTemplate").html())(item.toJSON()));
            }, this);
            $(".settedAction", this.$el).empty().append(tempStr);
        },
        addToCollection: function (tm) {

            tm.set({
                silent: !0,
                "SequenceID": GetCurrentBoardMaxZIndex() + 1
            });

            tm.save();
            if (Globle.LastError.hasError()) {
                //说明有错误
                Globle.LastError.ShowError();
            }
            else {
                Globle.AnimationBaseModelCollection.add(tm);
                switch (tm.get("actionType")) {

                    case "ComplexAnimationType":
                        ForComplexAnimationModal(tm);
                        break;

                    default:
                        new AninamalSettingPanelView({ model: tm });
                        break;
                }
            }
        },
        addActionClick: function (event) {
            //            console.log(event);
            console.log("锁定的");


            var values = $(".animationtype", this.$el).val();

            //处理逻辑:
            //1. 如果是新建,那么就将SequenceID设置为最大值
            //2. 如果不是新建,那么不用管理SequenceID;

            switch (values) {
                case "1": //添加飞入动作到当前选中的model中
                    //console.log("1");

                    var flyInModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "FlyIn" })[0];
                    if (!flyInModel) {
                        var flyInModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('TflyIn'),
                            "actionType": "FlyIn"
                        });

                        this.addToCollection(flyInModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: flyInModel });

                    break;

                case "2": //添加飞出动作到当前选中的model中
                    //去全局动作集合中查找
                    //console.log("addActionClick");

                    var flyoutModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "FlyOut" })[0];
                    if (!flyoutModel) {
                        var flyoutModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('TflyOut'),
                            "actionType": "FlyOut"
                        });
                        this.addToCollection(flyoutModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: flyoutModel });

                    break;

                case "3": //渐现动画
                    //去全局动作集合中查找
                    //console.log("渐现动画");

                    var FadeInModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "FadeIn" })[0];
                    if (!FadeInModel) {
                        FadeInModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('TfadeIn'),
                            "actionType": "FadeIn"
                        });
                        this.addToCollection(FadeInModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: FadeInModel });
                    break;

                case "4": //渐隐动画
                    //去全局动作集合中查找
                    //console.log("渐隐动画");

                    var FadeOutModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "FadeOut" })[0];
                    if (!FadeOutModel) {
                        FadeOutModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('TfadeOut'),
                            "actionType": "FadeOut"
                        });
                        this.addToCollection(FadeOutModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: FadeOutModel });
                    break;

                case "5": //放大动画
                    //去全局动作集合中查找
                    //console.log("放大动画");

                    var ZoomOutModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "ZoomOut" })[0];
                    if (!ZoomOutModel) {
                        ZoomOutModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('TzoomAppear'),
                            "actionType": "ZoomOut"
                        });
                        this.addToCollection(ZoomOutModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: ZoomOutModel });
                    break;

                case "6": //缩小动画
                    //去全局动作集合中查找
                    //console.log("缩小动画");

                    var ZoomInModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "ZoomIn" })[0];
                    if (!ZoomInModel) {
                        ZoomInModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('TreducedOccur'),
                            "actionType": "ZoomIn"
                        });
                        this.addToCollection(ZoomInModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: ZoomInModel });
                    break;

                case "10": //放大缩小
                    //去全局动作集合中查找
                    //console.log("放大缩小");

                    var ZoomInModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "ZoomInOut" })[0];
                    if (!ZoomInModel) {
                        ZoomInModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('Tzoom'),
                            "actionType": "ZoomInOut"
                        });
                        this.addToCollection(ZoomInModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: ZoomInModel });
                    break;

                case "7": //旋转动画
                    //去全局动作集合中查找
                    //console.log("旋转动画");

                    var RotateModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "RotateType" })[0];
                    if (!RotateModel) {
                        RotateModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('Trotate'),
                            "actionType": "RotateType"
                        });
                        this.addToCollection(RotateModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: RotateModel });
                    break;

                case "8": //曲线动画
                    //去全局动作集合中查找
                    //console.log("曲线动画");

                    var BezierModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "BezierType" })[0];
                    if (!BezierModel) {
                        BezierModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('TcurveBezier'),
                            "actionType": "BezierType"
                        });
                        this.addToCollection(BezierModel);
                    }
                    else
                        new AninamalSettingPanelView({ model: BezierModel });
                    break;

                case "9": //复合动画
                    var complexModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "ComplexAnimationType" })[0];
                    if (!complexModel) {
                        complexModel = new AnimationModel({
                            "BelongToElementID": Globle.CurrentModel.get("pid"),
                            "isNew": !0,
                            "name": GetTranslateUI('TcompositeAnimation'),
                            "actionType": "ComplexAnimationType"
                            //                            "ComplexHeight": Globle.CurrentModel.attributes.pHeight,
                            //                            "ComplexWidth": Globle.CurrentModel.attributes.pWidth,
                            //                            "ComplexLeft": Globle.CurrentModel.attributes.pLeft,
                            //                            "ComplexTop": Globle.CurrentModel.attributes.pTop
                            //                            ,"ComplexFontSize":parseInt($("#"+Globle.CurrentModel.get("pid")).css("font-size"))
                        });

                        this.addToCollection(complexModel);
                    }
                    else {
                        ForComplexAnimationModal(complexModel);
                        //                        new AninamalSettingPanelView({ model: complexModel });
                    }
                    break;

                default:
                    alert(GetTranslateUI('TThisoperationisnotsupported'));
                    break;
            }
        }
    });

    //    Globle.ResourcePanelView = Backbone.View.extend({
    //        el: $('#ResourceContent'),
    //        generateTemplate: function () {
    //            return _.template($('#ResourceResultTemplate').html());
    //        },
    //        events: {
    //            "click #previewPageResource": "previewPageResourceClick",
    //            "click #nextPageResource": "nextPageResourceClick",
    //            "click #btnInsert": "btnInsertClick"
    //        },
    //        initialize: function () {
    //            this.collection = Globle.ResourceModelCollection;

    //            this.collection.unbind("add", this.updateResourceResultPanelView);

    //            this.collection.on("add", this.updateResourceResultPanelView, this);
    //            this.template = this.generateTemplate();
    //            this.render();
    //        },
    //        render: function () {
    //            var tempHtml = '';
    //            Globle.ResourceModelCollection.forEach(function (item) {
    //                tempHtml += this.template(item.toJSON());
    //            }, this);

    //            $('#resultHolder').parent().children().not("#resultHolder").empty();
    //            $("#resultHolder").after(tempHtml);

    //            return this;
    //        },
    //        updateResourceResultPanelView: function () {
    //            this.render();
    //        },
    //        previewPageResourceClick: function () {
    //            GetResourseFiles("prev");
    //        },
    //        nextPageResourceClick: function () {
    //            GetResourseFiles("next");
    //        },
    //        addToCollection: function (tm) {
    //            if (Globle.LastError.hasError()) {
    //                //说明有错误
    //                Globle.LastError.ShowError();
    //            }
    //            else {
    //                Globle.CurrentModel = tm;

    //                Globle.AllModelCollection.add(tm);
    //            }
    //        }
    //    });
});
