/// <reference path="jquery-2.0.3.min.js" />

///////////////////////////////////////////////////////////////////////////////
// Custom jQuery

jQuery.registerNamespace = function () {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = window;
        for (j = 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
};

///////////////////////////////////////////////////////////////////////////////
// Custom Raphael

//http://zreference.com/raphael-animation-along-a-path/
(function () {
    Raphael.fn.addGuides = function () {
        this.ca.guide = function (g) {
            return {
                guide: g
            };
        };
        this.ca.rotateAlong = function (r) {
            return {
                rotateAlong: r
            };
        };

        this.ca.along = function (percent) {
            var g = this.attr("guide");
            var len = g.getTotalLength();
            var r = this.attr("rotateAlong");

            var point = g.getPointAtLength(percent * len);
            var nextSample = g.getPointAtLength((percent + .001) * len)
            var a = 0;
            if (r) {
                a = point.alpha;
                if (nextSample.x >= point.x && nextSample.y <= point.y) {
                    a -= 180;
                }
            }
            var offsetX = this.attrs.width / 2;
            var offsetY = this.attrs.height / 2;

            //$("#output").html(point.alpha + ", a: " + a);
            var t = {
                transform: "t" + (point.x - offsetX) + " " + (point.y - offsetY) + "r" + a
            };
            return t;
        };
    };
})();

//请求后台,请求当前页面的脚本描述内容
function RenderScriptDescription(data1) {
    var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");


    $.getJSON(trueLocation, { actionType: "scriptDescription", pageID: data1.id }, function (data, status, xhr) {
        if (data.result == "ok") {
            $("#ckEditorScriptDescription").html(decodeURIComponent(data.message));
        }
        else if (data.result == "error") {
            alert(data.message + GetTranslateUI('TRequesterrorpleasetryagain') + "!");
        }
        else if (data == "") {
            alert(GetTranslateUI('TRequesterrorpleasetryagain') + "!");
        }
    });
}

function coreControlAction(event) {

    console.log(event.currentTarget.id);
    if (event.currentTarget.id == '') {
        return;
    }
    else if ($(event.originalEvent.srcElement).parents("[pType=ImageSlide]").attr("pType") == "ImageSlide") {
        //        isClickEventBubble = 1;
        return;
    }
    else {
        event.stopPropagation();
    }
    //处理逻辑
    //全局存储一个timeLine的数组,格式为:[元素id]=timeline实例
    //点击一个元素或者画板,首先去全局timeline数组中查找.找到即可执行;如果未找到,那么新构建一个timeline的实例并存储到全局中;
    //判断触发器目标元素是否正在执行动画,如果正在执行,立即结束.

    var clickState = -1; //要执行的动作:0:点击前,1:点击后
    //针对button元素特殊处理,button有2个状态,点击前和点击后
    if (event.currentTarget.attributes.pType.value == "ButtonType") {
        if ($(event.currentTarget).attr("clicked")) {
            //说明点击过,因此现在应该执行点击后的事件
            clickState = 1;
            $(event.currentTarget).removeAttr("clicked")
            .children("img").first().show()
            .end()
            .last().hide();

        } else {
            clickState = 0; //说明没有点击过,因此现在应该执行点击前的事件
            $(event.currentTarget).attr("clicked", "clicked")
             .children("img").last().show()
            .end()
            .first().hide();
        }
    }

    switch (clickState) {
        case -1:
            //该逻辑目的: 如果以前已经缓存过,那么现在就直接执行.
            //但是现在针对文字的放大出现和缩小消失,再次执行,就会出现问题,故该代码临时注销.
            //            if (Globle.ExecutingTimeLineCollection[event.currentTarget.id]) {
            //                console.log("restart");
            //                Globle.ExecutingTimeLineCollection[event.currentTarget.id].restart();
            //                return;
            //            }
            break;

        case 0:
            if (Globle.ExecutingTimeLineCollection[event.currentTarget.id + "_beforeClick"]) {
                Globle.ExecutingTimeLineCollection[event.currentTarget.id + "_beforeClick"].restart();
                return;
            }
            break;

        case 1:
            if (Globle.ExecutingTimeLineCollection[event.currentTarget.id + "_afterClick"]) {
                Globle.ExecutingTimeLineCollection[event.currentTarget.id + "_afterClick"].restart();
                return;
            }
            break;
    }

    var tL = new TimelineLite({
        paused: true
    });

    var tempTriggerArray = (function () {
        switch (clickState) {
            case -1:
                return Globle.TriggerModelCollection.where({
                    "BelongToElementID": parseInt(event.currentTarget.id) + Globle.VariableSuffix
                });
                break;

            case 0:
                return Globle.TriggerModelCollection.where({
                    "BelongToElementID": parseInt(event.currentTarget.id) + Globle.VariableSuffix,
                    "pType": "beforeClickTrigger"
                });
                break;

            case 1:
                return Globle.TriggerModelCollection.where({
                    "BelongToElementID": parseInt(event.currentTarget.id) + Globle.VariableSuffix,
                    "pType": "afterClickTrigger"
                });
                break;
        }
    })();

    var triggerTimeLineArray = new Array();

    for (i = 0; i < tempTriggerArray.length; i++) {
        console.log(tempTriggerArray[i]);

        var tLTempTrigger = new TimelineLite();

        var actionIdTemp = tempTriggerArray[i].get("ControlAnimationModelArray");
        //得到该触发器关联的动作

        var actionTempArray = Globle.AnimationBaseModelCollection.select(function (item) {

            return _.indexOf(actionIdTemp, item.id.toString()) >= 0;

        });

        //按照触发器的ControlAnimationModelArray次序,对actionTempArray排序
        var actionTempArraySorted = new Array();
        var temp123 = '';
        for (k = 0; k < actionIdTemp.length; k++) {

            temp123 = _.where(actionTempArray, { id: (actionIdTemp[k]) })[0];

            if (!temp123)
                temp123 = _.where(actionTempArray, { id: parseInt(actionIdTemp[k]) })[0];

            actionTempArraySorted.push(temp123);
        }
        actionTempArray = actionTempArraySorted;

        var tempArray = new Array();
        for (j = 0; j < actionTempArray.length; j++) {
            var nextAction = null;
            try {
                nextAction = actionTempArray[i + 1];
            } catch (e) {
                nextAction = null;
            }
            var tweenInstanceObj = GetTweenInstanceAction(actionTempArray[j], nextAction);
            //如果下一个动作执行方式是:与上一个动作同时执行,那么就new一个array
            //如果下一个动作执行方式是:上一个动作执行完毕后,顺序执行,那么就把array清空
            if (actionTempArray[j + 1] && actionTempArray[j + 1].get("ActionMethod") == 2) {
                tempArray.push(tweenInstanceObj);
            }
            else {
                if (tempArray.length != 0) {
                    tempArray.push(tweenInstanceObj);
                    tLTempTrigger.add(tempArray);
                    tempArray = new Array();

                }
                else {
                    tempArray = new Array();
                    tLTempTrigger.add(tweenInstanceObj);
                }
            }
        }
        triggerTimeLineArray.push(tLTempTrigger);
    }

    tL.add(triggerTimeLineArray);
    tL.play();

    switch (clickState) {
        case -1:
            Globle.ExecutingTimeLineCollection[event.currentTarget.id] = tL;
            break;

        case 0:
            Globle.ExecutingTimeLineCollection[event.currentTarget.id + "_beforeClick"] = tL;
            break;

        case 1:
            Globle.ExecutingTimeLineCollection[event.currentTarget.id + "_afterClick"] = tL;
            break;
    }
}

function changeWebFormSelect(val) {
    Globle.CurrentModel.set({
        pContentType: $(val).val(),
        silent: !0
    });
    Globle.CurrentModel.save();
    $("#" + Globle.CurrentModel.get("pid") + "_urlPanel").hide();
    $("#" + Globle.CurrentModel.get("pid") + "_embedPanel").hide();
    $("#" + Globle.CurrentModel.get("pid") + "_localResourcePanel").hide();

    switch ($(val).val()) {
        case "url":
            $("#" + Globle.CurrentModel.get("pid") + "_urlPanel").show();
            break;

        case "embed":
            $("#" + Globle.CurrentModel.get("pid") + "_embedPanel").show();
            break;

        case "localResource":
            $("#" + Globle.CurrentModel.get("pid") + "_localResourcePanel").show();

            break;
    }
}

//
function InitModel(idArray, unitItemPageContentID, isForLayer) {

    var trueLocation = GenerateRequestURL("../../../../lcms/Files/OperateAnimationHTMLTemplate.ashx");

    $.ajax({
        async: false,
        url: trueLocation,
        data: { "actionType": (isForLayer ? "GetLayerInitModel" : "GetInitModel"), "idArray[]": idArray, "unitItemPageContentID": unitItemPageContentID },
        dataType: "json",
        success: function (data, status, xhr) {
            //console.log(data);
            //判断model的类型,按照类型初始化各个model,并添加到相应的集合中
            if (data.result != "error") {
                GenerateModel(data, undefined, isForLayer);
                $('.blockOverlay').attr('title', "初始化成功！");
            }
            else
                alert(GetTranslateUI('TThenetworkisbusypleasetryagainlater') + ".\r" + data.message);
        },
        error: function (e1, e2) {
            alert(GetTranslateUI('TThenetworkisbusypleasetryagainlater') + ".\r" + e2);
        },
        beforeSend: function () {
            if (Globle.AllResourceLoaded)
                $.blockUI({ message: GetTranslateUI('TclickTypeTrigger') + "...." + $.blockUI.defaults.message });
        },
        complete: function () {
            if (Globle.AllResourceLoaded)
                $.unblockUI();
            Globle.AllResourceLoaded = !0;
        }
    });
}

String.prototype.Trim = function (trimChar) {
    trimChar || (trimChar = '');
    switch (trimChar) {
        case "":
            return this.replace(/(^\s*)|(\s*$)/g, "");
            break;

        case ",":
            return this.replace(/(^,*)|(,*$)/g, "");
            break;
    }
}

function GenerateModel(data, isSilent, isForLayer) {
    isSilent || (isSilent = !1);
    isForLayer || (isForLayer = !1);
    if ($.trim(data) == '')
        return false;
    Globle.IsInit = !0;
    _.each(data, function (item) {
        //console.log(item.value.pType)
        //初始化元素
        //        item = decodeURIComponent(item);
        if (item.BelongToBoardID != '') {
            item.BelongToBoardID += Globle.VariableSuffix;
        }
        if (item.BelongToElementID != '') {
            item.BelongToElementID += Globle.VariableSuffix;
        }

        //-----------------------------------------------开始
        //解决ImageArray数据错误, 该bug表述如下:
        // 新建一个层,加一个背景图. 关闭页面;
        // 重新打开页面, 删除该层, 左边树出现错误,数据库出现错误
        if (item.value.ImageInsert) {
            item.value.ImageInsert = !1;
        }

        //-----------------------------------------------结束

        switch (item.value.pType) {
            case "board": //说明是画板
                var boardItem = new BoardModel();
                boardItem.id = item.key;
                boardItem.set(item.value);
                boardItem.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                if (item.BelongToBoardID != '') {
                    boardItem.set({
                        pParentElementID: item.BelongToBoardID,
                        silent: !0
                    });
                }
                Globle.BoardModelCollection.add(boardItem, { silent: isSilent });
                break;

            case "ManuallyResource": //说明是手工关联的文件
                var ManuallyModelItem = new ManuallyModel();
                ManuallyModelItem.id = item.key;
                ManuallyModelItem.set(item.value);
                ManuallyModelItem.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                if (item.BelongToBoardID != '') {
                    ManuallyModelItem.set({
                        pParentElementID: item.BelongToBoardID,
                        silent: !0
                    });
                }
                Globle.ManaullyModelCollection.add(ManuallyModelItem, { silent: isSilent });
                break;


            case "layer":
                if (isForLayer) {//说明是在层的创建页面使用
                    var boardItem = new BoardModel();
                    boardItem.id = item.key;
                    boardItem.set(item.value);
                    boardItem.attributes.pid = item.key + Globle.VariableSuffix;
                    boardItem.attributes.pMaterialUsageID = item.MaterialUsageIDArray.Trim(',');
                    if (item.BelongToBoardID != '') {
                        boardItem.set({
                            pParentElementID: item.BelongToBoardID,
                            BelongToLayerID: item.BelongToLayerID,
                            silent: !0
                        });
                    }
                    Globle.BoardModelCollection.add(boardItem, { silent: isSilent });
                }
                else {//说明是在画板的页面使用,当做普通元素处理
                    var boardItem = new BoardModel();
                    boardItem.id = item.key;
                    boardItem.set(item.value);
                    boardItem.attributes.pid = item.key + Globle.VariableSuffix;
                    boardItem.attributes.pMaterialUsageID = item.MaterialUsageIDArray.Trim(',');
                    if (item.BelongToBoardID != '') {
                        boardItem.set({
                            pParentElementID: item.BelongToBoardID,
                            BelongToLayerID: item.BelongToLayerID,
                            silent: !0
                        });
                    };
                    //当层中什么都没有的时候，不能给ContentChildrenModel赋值
                    if (decodeURIComponent(item.childrenModelValue) != '') {
                        boardItem.ContentChildrenModel = JSON.parse(decodeURIComponent(item.childrenModelValue));
                    }
                    Globle.AllModelCollection.add(boardItem, { silent: isSilent });

                    if (isSilent) {
                        //isSilent等于true,那么手动将层内元素插入到集合中
                        //在页面中插入一个层,然后预览该页面时,要过滤一下页面中的层包含的视频,音频,Glstudio
                        var tempResult = BoardModel.InitAllChildrenModel(boardItem, '', true);
                        if (tempResult != '') {
                            _.each(tempResult[1], function (item, index) {
                                switch (item.value.pType) {
                                    case "GlStudio":
                                        var glFlag = Globle.AllModelCollection.where({ "pid": item.pid });
                                        if (glFlag[0].get("isLayerContent")) {
                                            if (location.href.indexOf("_Preview.htm") >= 0)
                                                CreateGlsObject(item.pid + "_preview", "object_" + item.pid, "../" + item.value.pFileUrl);
                                            else {
                                                //说明是学习状态,那么需要将文件路径更新为根路径
                                                CreateGlsObject(item.pid + "_preview", "object_" + item.pid, item.value.pFileUrl.substr(item.value.pFileUrl.lastIndexOf('/') + 1));
                                            }
                                        }
                                        break;
                                }
                            });
                        }
                    }
                }
                break;

            case "ButtonType": //说明是button
                var ButtonModelObj = new ButtonModel();
                ButtonModelObj.id = item.key;
                ButtonModelObj.set(item.value);
                //                ButtonModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                ButtonModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                var tempImageArray = ButtonModelObj.get("ImageArray");
                var imageNumber = tempImageArray.length;
                tempImageArray = new Array();
                var materialUsageIDArray = item.MaterialUsageIDArray.Trim(",").split(",");
                for (var i = 0; i < imageNumber; i++) {
                    var tempImageModel = new ImageModel(item.value.ImageArray[i]);
                    tempImageModel.set({
                        pMaterialUsageID: materialUsageIDArray[i],
                        silent: !0
                    });
                    tempImageArray.push(tempImageModel);
                }

                ButtonModelObj.set({
                    "ImageArray": tempImageArray,
                    silent: !0
                });

                Globle.AllModelCollection.add(ButtonModelObj, { silent: isSilent });
                break;

            case "RichText": //文本框
                var richTextModel = new RichTextModel();
                richTextModel.id = item.key;
                //                item.value.pTextContent = decodeURIComponent(item.value.pTextContent);注销原因: 要保持实体里一直存储的都是编码过的字符.只在显示后,反编码回来

                richTextModel.set(item.value);
                //                richTextModel.attributes.pid = item.key + Globle.VariableSuffix;
                richTextModel.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(richTextModel, { silent: isSilent });
                break;

            case "Correct": //正确
            case "Incorrect": //文本框
                var richTextModel = new RichTextModel();
                richTextModel.id = item.key;
                //                item.value.pTextContent = decodeURIComponent(item.value.pTextContent);注销原因: 要保持实体里一直存储的都是编码过的字符.只在显示后,反编码回来

                richTextModel.set(item.value);
                //                richTextModel.attributes.pid = item.key + Globle.VariableSuffix;
                richTextModel.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(richTextModel, { silent: isSilent });

            case "WebForm":
                var webFormModel = new WebFormModel();
                webFormModel.id = item.key;

                webFormModel.set(item.value);
                //                richTextModel.attributes.pid = item.key + Globle.VariableSuffix;
                webFormModel.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(webFormModel, { silent: isSilent });
                break;

            case "BugFlag": //bug标签
                var BugFlagModelObj = new BugFlagModel();
                BugFlagModelObj.id = item.key;
                item.value.pBugContent = item.value.pBugContent.replace(/_n_/g, "\n");
                BugFlagModelObj.set(item.value);
                //                BugFlagModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                BugFlagModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(BugFlagModelObj, { silent: isSilent });
                break;

            case "Audio": //mp3素材
                var AudioModelObj = new AudioModel();
                AudioModelObj.id = item.key;
                AudioModelObj.set(item.value);
                //                AudioModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                AudioModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(AudioModelObj, { silent: isSilent });
                break;

            case "Flash": //mp3素材
                var flashModelObj = new FlashModel();
                flashModelObj.id = item.key;
                flashModelObj.set(item.value);
                //                flashModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                flashModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(flashModelObj, { silent: isSilent });
                break;

            case "GlStudio": //GlStudio素材
                var glStudioModelObj = new GlStudioModel();
                glStudioModelObj.id = item.key;
                glStudioModelObj.set(item.value);
                //                glStudioModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                glStudioModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(glStudioModelObj, { silent: isSilent });
                break;

            case "Catia": //Catia素材
                var CatiaModelObj = new CatiaModel();
                CatiaModelObj.id = item.key;
                CatiaModelObj.set(item.value);
                //                CatiaModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                CatiaModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(CatiaModelObj, { silent: isSilent });
                break;

            case "Video": //mp4素材
                var VideoModelObj = new VideoModel();
                VideoModelObj.id = item.key;
                VideoModelObj.set(item.value);
                //                VideoModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                VideoModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(VideoModelObj, { silent: isSilent });
                break;

            case "Image": //图片素材
                var ImageModelObj = new ImageModel();
                ImageModelObj.id = item.key;
                ImageModelObj.set(item.value);
                //                ImageModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                //                //                修改materialUsageID
                //                ImageModelObj.attributes.pMaterialUsageID = item.MaterialUsageIDArray.Trim(",");
                ImageModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(ImageModelObj, { silent: isSilent });
                break;

            case "Arrow": //图片素材
            case "AdvanceArrow":
                var SVGModelObj = new SVGModel();
                SVGModelObj.id = item.key;
                SVGModelObj.set(item.value);
                SVGModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(SVGModelObj, { silent: isSilent });
                break;
            case "Circle":
                var SVGModelObj = new SVGModel();
                SVGModelObj.id = item.key;
                SVGModelObj.set(item.value);
                SVGModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                if (item.value.pBorderWidth == undefined) {
                    SVGModelObj.set({
                        pBorderWidth: 2
                    });
                }
                if (item.value.pCircleRadius == undefined) {
                    SVGModelObj.set({
                        pCircleRadius: 20
                    });
                }
                if (item.value.pBorderColor == undefined) {
                    SVGModelObj.set({
                        pBorderColor: item.value.color
                    });
                }
                Globle.AllModelCollection.add(SVGModelObj, { silent: isSilent });
                break;
            case "Ellipse":
                var SVGModelObj = new SVGModel();
                SVGModelObj.id = item.key;
                SVGModelObj.set(item.value);
                SVGModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(SVGModelObj, { silent: isSilent });
            case "Box":
                var SVGModelObj = new SVGModel();
                SVGModelObj.id = item.key;
                SVGModelObj.set(item.value);
                SVGModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                if (item.value.pBorderWidth == undefined) {
                    SVGModelObj.set({
                        pBorderWidth: 15
                    });
                }
                if (item.value.pBorderColor == undefined) {
                    SVGModelObj.set({
                        pBorderColor: item.value.color
                    });
                }
                Globle.AllModelCollection.add(SVGModelObj, { silent: isSilent });
                break;
            case "ImageSlide": //幻灯片
                var ImageSlideModelObj = new ImageSlideModel();
                ImageSlideModelObj.id = item.key;
                ImageSlideModelObj.set(item.value);

                ImageSlideModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                ImageSlideModelObj.set({
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });

                var tempImageArray = ImageSlideModelObj.get("ImageArray");
                var imageNumber = tempImageArray.length;
                tempImageArray = new Array();
                var materialUsageIDArray = item.MaterialUsageIDArray.Trim(",").split(",");
                for (var i = 0; i < imageNumber; i++) {
                    var tempImageModel = new ImageModel(item.value.ImageArray[i]);
                    tempImageModel.set({
                        pMaterialUsageID: materialUsageIDArray[i],
                        silent: !0
                    });
                    tempImageArray.push(tempImageModel);
                }

                ImageSlideModelObj.set({
                    "ImageArray": tempImageArray,
                    silent: !0
                });

                Globle.AllModelCollection.add(ImageSlideModelObj, { silent: isSilent });
                break;

            case "ImageSequence": //序列帧
                var ImageSequenceModelObj = new ImageSequenceModel();
                ImageSequenceModelObj.id = item.key;
                ImageSequenceModelObj.set(item.value);

                ImageSequenceModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                ImageSequenceModelObj.set({
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });

                var tempImageModel = new ImageModel(
                    item.value.ImageModel
                );
                tempImageModel.set({
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    silent: !0
                });

                ImageSequenceModelObj.set({
                    "ImageModel": tempImageModel,
                    silent: !0
                });

                Globle.AllModelCollection.add(ImageSequenceModelObj, { silent: isSilent });
                break;

            case "ImageRotate": //滑动动画
                var ImageRotateModelObj = new ImageRotateModel();
                ImageRotateModelObj.id = item.key;
                ImageRotateModelObj.set(item.value);
                //                ImageRotateModelObj.attributes.pid = item.key + Globle.VariableSuffix;

                ImageRotateModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });

                var tempImageArray = ImageRotateModelObj.get("ImageArray");
                var imageNumber = tempImageArray.length + 2;
                tempImageArray = new Array();
                var materialUsageIDArray = item.MaterialUsageIDArray.Trim(",").split(",");

                for (var i = 2; i < imageNumber; i++) {
                    var tempImageModel = new ImageModel(item.value.ImageArray[i - 2]);
                    tempImageModel.set({
                        pMaterialUsageID: materialUsageIDArray[i - 2],
                        silent: !0
                    });
                    tempImageArray.push(tempImageModel);
                }

                ImageRotateModelObj.set({
                    "ImageArray": tempImageArray,
                    silent: !0
                });

                Globle.AllModelCollection.add(ImageRotateModelObj, { silent: isSilent });
                break;

            case "SVG": //svg
                var SVGModelObj = new SVGModel();
                SVGModelObj.id = item.key;
                SVGModelObj.set(item.value);
                //                SVGModelObj.attributes.pid = item.key + Globle.VariableSuffix;
                SVGModelObj.set({
                    pid: item.key + Globle.VariableSuffix,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(','),
                    pParentElementID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AllModelCollection.add(SVGModelObj, { silent: isSilent });
                break;

            case "clickTrigger": //初始化触发器
            case "beforeClickTrigger":
            case "afterClickTrigger":
                var triggerObj = new TriggerModel();
                triggerObj.id = item.key;
                triggerObj.set(item.value);
                triggerObj.attributes.pid = item.key + Globle.VariableSuffix;
                //                初始化触发器要触发的动作的id
                var tempArray = (item.ActionIDArray.replace(/^,+|,+$/g, "").split(","));
                //                triggerObj.attributes.
                //                tempArray = _.map(tempArray, function (item) { return (parseInt(item)) })
                triggerObj.set({
                    ControlAnimationModelArray: tempArray,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongToLayerID: item.BelongToLayerID,
                    silent: !0
                });

                Globle.TriggerModelCollection.add(triggerObj, { silent: isSilent });
                break;
        }
        //初始化元素的动作
        switch (item.value.actionType) {
            case "GoToPage": //
                var GoToPageModel = new AnimationModel(item.value);
                GoToPageModel.id = item.key;
                GoToPageModel.set({
                    pid: GoToPageModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    GoToPageID: item.GoToPageID,
                    pMaterialUsageID: item.MaterialUsageIDArray.Trim(',').split(","),
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(GoToPageModel, { silent: isSilent });
                break;

            case "PlayControl": //控制视频或者音频的播放和暂停
            case "SlideControl":
            case "ChangeSection": //控制字幕切换
                var PlayControlModel = new AnimationModel(item.value);
                PlayControlModel.id = item.key;
                PlayControlModel.set({
                    pid: PlayControlModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(PlayControlModel, { silent: isSilent });
                break;

            case "FlyIn": //飞入
                var flyInModel = new AnimationModel(item.value);
                flyInModel.id = item.key;
                flyInModel.set({
                    name: GetTranslateUI('TflyIn'),
                    pid: flyInModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(flyInModel, { silent: isSilent });
                break;
            case "FlyOut": //飞出
                var flyoutModel = new AnimationModel(item.value);
                flyoutModel.id = item.key;
                flyoutModel.set({
                    name: GetTranslateUI('TflyOut'),
                    pid: flyoutModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(flyoutModel, { silent: isSilent });
                break;
            case "FadeIn":
                var FadeInModel = new AnimationModel(item.value);
                FadeInModel.id = item.key;
                FadeInModel.set({
                    name: GetTranslateUI('TfadeIn'),

                    pid: FadeInModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(FadeInModel, { silent: isSilent });
                break;
            case "FadeOut":
                var FadeOutModel = new AnimationModel(item.value);
                FadeOutModel.id = item.key;
                FadeOutModel.set({
                    name: GetTranslateUI('TfadeOut'),

                    pid: FadeOutModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(FadeOutModel, { silent: isSilent });
                break;
            case "ZoomOut":
                var ZoomOutModel = new AnimationModel(item.value);
                ZoomOutModel.id = item.key;
                ZoomOutModel.set({
                    name: GetTranslateUI('TzoomAppear'),

                    pid: ZoomOutModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(ZoomOutModel, { silent: isSilent });
                break;

            case "ZoomInOut":
                var ZoomInOutModel = new AnimationModel(item.value);
                ZoomInOutModel.id = item.key;
                ZoomInOutModel.set({
                    name: GetTranslateUI('Tzoom'),

                    pid: ZoomInOutModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(ZoomInOutModel, { silent: isSilent });
                break;

            case "ZoomIn":
                var ZoomInModel = new AnimationModel(item.value);
                ZoomInModel.id = item.key;
                ZoomInModel.set({
                    name: GetTranslateUI('TreducedOccur'),

                    pid: ZoomInModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(ZoomInModel, { silent: isSilent });
                break;
            case "RotateType":
                var RotateModel = new AnimationModel(item.value);
                RotateModel.id = item.key;
                RotateModel.set({
                    name: GetTranslateUI('Trotate'),

                    pid: RotateModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(RotateModel, { silent: isSilent });
                break;
            case "BezierType":
                var BezierModel = new AnimationModel(item.value);
                BezierModel.id = item.key;
                BezierModel.set({
                    name: GetTranslateUI('TcurveBezier'),

                    pid: BezierModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    AnimationJSONData: decodeURIComponent(BezierModel.get("AnimationJSONData")),
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(BezierModel, { silent: isSilent });
                break;
            case "ComplexAnimationType":
                var complexAnimationModel = new AnimationModel(item.value);
                complexAnimationModel.id = item.key;
                complexAnimationModel.set({
                    name: GetTranslateUI('TcompositeAnimation'),

                    pid: complexAnimationModel.id + Globle.VariableSuffix,
                    BelongToElementID: item.BelongToElementID,
                    BelongToBoardID: item.BelongToBoardID,
                    BelongLayerID: item.BelongToLayerID,
                    silent: !0
                });
                Globle.AnimationBaseModelCollection.add(complexAnimationModel, { silent: isSilent });
                break;
        }
    });
    Globle.IsInit = !1;
}

function SortCollection(collecton, everyItemCallBack, direction) {
    collecton.comparator = function (item) {
        console.log(everyItemCallBack + " :comparator" + item.get("SequenceID"));
        everyItemCallBack && everyItemCallBack(item);
        if (direction == 'descending')
            return parseInt("-" + item.get("SequenceID"));
        else
            return parseInt(item.get("SequenceID"));
    };

    collecton.sort({ silent: true });

    collecton.comparator = null;
}

function CreateGlsObject(targetDivId, objectId, componentFileName, isGetHtmlStr) {

    var temp = '';
    switch (Globle.BrowerType) {
        case "ie":
            temp = '<object width="100%" height="100%" id="' + objectId + '" classid="clsid:2BD70499-E075-4059-8384-B7AB7E8AAB1F"'
                + GenerateRequestURL('codebase="' + location.origin + '/lcms/HTMLTemplate/Animation/AnimationResource/GlStudio/GLSPlayer.ocx#version=4,0,5,0"')
                + 'viewtext="">'
                + '<param name="_ExtentX" value="10583">'
                + '<span class="errstyle">Failed to load GLS Player! </span>'
                + '<param name="Enabled" value="1">'
                + '<param name="wmode" value="transparent">'
                + '<param name="ComponentFileName" value="' + componentFileName + '">'
                + '</object>';
            break;

        case "chrome":
            temp = '<object id="' + objectId + GenerateRequestURL('" codebase="' + location.origin + '/lcms/HTMLTemplate/Animation/AnimationResource/GlStudio/GLSPlayer.ocx#version=4,0,5,0" width="100%" height="100%" viewtext="" clsid="{2BD70499-E075-4059-8384-B7AB7E8AAB1F}" type="application/x-itst-activex">')
            + '<span class="errstyle">Failed to load GLS Player! </span>'
            + '<param name="Enabled" value="1">'
            + '<param name="wmode" value="transparent">'
            + '<param name="ComponentFileName" value="' + componentFileName + '">'
            + '</object>';
            break;

        default:
            temp = '<object id="' + objectId + GenerateRequestURL('" codebase="' + location.origin + '/lcms/HTMLTemplate/Animation/AnimationResource/GlStudio/GLSPlayer.ocx#version=4,0,5,0" width="100%" height="100%" viewtext="" clsid="{2BD70499-E075-4059-8384-B7AB7E8AAB1F}" type="application/x-itst-activex">')
            + '<span class="errstyle">Failed to load GLS Player! </span>'
            + '<param name="Enabled" value="1">'
            + '<param name="wmode" value="transparent">'
            + '<param name="ComponentFileName" value="' + componentFileName + '">'
            + '</object>';
            break;
    }

    if (isGetHtmlStr) {
        return temp
    }

    var d = document.getElementById(targetDivId);

    d.innerHTML = temp;


}

//当某个动作执行完毕时,会调用该方法.
//目前用于处理幻灯片,视频等元素与动作的协调问题
//特别注意: 当一个元素设置多个动作,那么会多次调用该方法.但是方法体只执行一次,因为在第一句代码里判断了是否是最后一个动作
function OnCompleteEvent(actionParameter) {

    try {
        if (TweenMax.isTweening($("#" + actionParameter.get("BelongToElementID") + "_preview")[0])) {
            return;
        }
        var currentTempModel = Globle.AllModelCollection.get(parseInt(actionParameter.get("BelongToElementID")));
        if (currentTempModel && (currentTempModel.get("isAutoPlay") || (currentTempModel.get("IsAutoPlay")))) {
            console.log("play------------------");
            switch (currentTempModel.get("pType")) {
                case "Video":
                    //处理逻辑:
                    //1. 如果是视频元素,进行如下处理
                    //2. 如果设置为自动播放,那么使用js播放该视频
                    var playNumber = parseInt(currentTempModel.get("pAutoPlayNumber"));
                    if (currentTempModel.get("isLayerContent")) {
                        jwplayer("preview_player_" + currentTempModel.get("pid") + "_preview").play();
                        Globle.CountArray || (Globle.CountArray = new Array());
                        Globle.CountArray[currentTempModel.get("pid")] = 1;
                        jwplayer("preview_player_" + currentTempModel.get("pid") + "_preview").onComplete(function () {
                            if (Globle.CountArray[currentTempModel.get("pid")] < playNumber + 1) {
                                Globle.CountArray[currentTempModel.get("pid")] = Globle.CountArray[currentTempModel.get("pid")] + 1;
                                jwplayer("preview_player_" + currentTempModel.get("pid") + "_preview").play();
                            }
                            else {

                            }
                        });
                    }
                    else {
                        jwplayer("preview_player_" + currentTempModel.get("pid")).play();
                        Globle.CountArray || (Globle.CountArray = new Array());
                        Globle.CountArray[currentTempModel.get("pid")] = 1;
                        jwplayer("preview_player_" + currentTempModel.get("pid")).onComplete(function () {
                            if (Globle.CountArray[currentTempModel.get("pid")] < playNumber + 1) {
                                Globle.CountArray[currentTempModel.get("pid")] = Globle.CountArray[currentTempModel.get("pid")] + 1;
                                jwplayer("preview_player_" + currentTempModel.get("pid")).play();
                            }
                            else {

                            }
                        });
                    }
                    break;

                case "ImageSlide":
                    //要判断是否是最后一个动作,只有最后一个动作执行完毕后,才会触发
                    //                    console.log("------------------------------------------------");
                    //                    //                    console.log(TweenMax.getTweensOf($("#" + actionParameter.get("BelongToElementID") + "_preview")[0]));
                    //                    //                    console.log(TweenMax.isTweening($("#" + actionParameter.get("BelongToElementID") + "_preview")[0]));
                    //                    //                    if (!TweenMax.isTweening($("#" + actionParameter.get("BelongToElementID") + "_preview")[0])) {
                    //                    //                        console.log("OnCompleteEvent-----------start");
                    //                    $("#" + currentTempModel.get("pid") + "_preview_carousel-example-generic").carousel();
                    //                    }
                    //                    else {
                    //                        console.log("OnCompleteEvent----------stop");
                    //                    }
                    break;
            }
        }

    } catch (e) {

    }
}

var flagTop;
var flagLeft;
function GetTweenInstanceAction(actionItem, nextActionItem) {
    //    console.log(actionItem, actionArray, actionArray.length);
    //开始组织当前元素所有的动作
    var tempElement = $("#" + actionItem.get("BelongToElementID") + "_preview");

    switch (actionItem.get("actionType")) {
        case "ComplexAnimationType": //复合动画
            console.log(actionItem.get("BelongToElementID") + "complex animation");
            var oldTop = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pTop"));
            var oldWidth = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pWidth"));
            var oldLeft = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pLeft"));
            var oldHeight = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pHeight"));
            var oldTransparent = parseFloat(Globle.AllModelCollection.get(parseFloat(actionItem.get("BelongToElementID"))).get("pTransparent"));
            flagLeft = parseInt(actionItem.get("ComplexLeft"));
            flagTop = parseInt(actionItem.get("ComplexTop"));
            return (TweenMax.to(tempElement[0], parseFloat(actionItem.get("duration")),
                    {
                        delay: parseInt(actionItem.get("delay")),
                        repeat: parseInt(actionItem.get("repeatCount")),
                        left: parseInt(actionItem.get("ComplexLeft")),
                        top: parseInt(actionItem.get("ComplexTop")),
                        width: parseInt(actionItem.get("ComplexWidth")),
                        height: parseInt(actionItem.get("ComplexHeight")),
                        opacity: parseFloat(actionItem.get("ComplexOpacity")),
                        fontSize: parseInt(actionItem.get("ComplexFontSize")),
                        repeatDelay: 0,
                        onStart: function (s) {
                            s.target.style.display = "";
                            var oldOpacity = $(s.target).attr("selfOpacity");
                            if (oldOpacity) {
                                s.target.style.opacity = oldOpacity;
                            }
                        },
                        onStartParams: ["{self}"],
                        onComplete: function (actionParameter) {
                            //                            jwplayer("preview_player_2335_Pelesys").play();
                            OnCompleteEvent(actionParameter);
                        },
                        onCompleteParams: [actionItem],
                        startAt: {
                            top: oldTop,
                            left: oldLeft,
                            width: oldWidth,
                            height: oldHeight,
                            opacity: oldTransparent
                        }
                    }
                  ));

            break;

        case "FlyOut":
            console.log(actionItem.get("BelongToElementID") + "FlyOut:" + (Globle.BoardWidth - parseInt(tempElement.css("left")) + parseInt(tempElement.width())));

            return (TweenMax.to(tempElement[0], parseFloat(actionItem.get("duration")),
                    {
                        left: (function () {
                            var tempPx = 0;
                            switch (parseInt(actionItem.get("ActionDirection"))) {
                                case 0:
                                case 1:
                                    if (flagLeft != undefined) {
                                        tempPx = flagLeft;
                                        flagLeft = undefined;
                                    } else {
                                        tempPx = Math.abs(parseInt(tempElement.css("left")));
                                    }
                                    break;
                                case 2:
                                    //                                    if (flagLeft != undefined) {
                                    //                                        tempPx = -flagLeft;
                                    //                                    } else {
                                    tempPx = -parseInt(tempElement[0].style.width);
                                    //                                    }
                                    console.log(tempPx, -parseInt(tempElement[0].style.width));
                                    break;

                                case 3:
                                    //                                    tempPx = (Globle.BoardWidth - parseInt(tempElement.width())); //画板宽度-元素宽度
                                    tempPx = (Globle.BoardWidth); //画板宽度-元素宽度
                                    break;
                            }
                            return tempPx;
                        })(this),
                        top: (function () {
                            var tempPx = 0;
                            switch (parseInt(actionItem.get("ActionDirection"))) {
                                case 0:
                                    tempPx = parseInt("-" + tempElement.height());
                                    break;

                                case 1:
                                    //                                    tempPx = (Globle.BoardHeight - parseInt(tempElement.height()))
                                    tempPx = (Globle.BoardHeight);
                                    break;

                                case 2:
                                case 3:
                                    if (flagTop != undefined) {
                                        tempPx = flagTop;
                                        flagTop = undefined;
                                    } else {
                                        tempPx = parseInt(tempElement.css("top"));
                                    }
                                    console.log(tempPx, parseInt(tempElement.css("top")));
                                    break;
                            }
                            return tempPx;
                        })(this),
                        delay: parseInt(actionItem.get("delay")),
                        repeat: parseInt(actionItem.get("repeatCount")),
                        repeatDelay: 0,
                        onStart: function (s) {
                            s.target.style.display = ""; //飞出之前,要先将该元素显示出来
                            var oldOpacity = $(s.target).attr("selfOpacity");
                            if (oldOpacity) {
                                s.target.style.opacity = oldOpacity;
                            }
                        },
                        onStartParams: ["{self}"],
                        onComplete: function (s) {
                            //                            console.log(actionItem.get("BelongToElementID"));
                            //飞出之后,立即隐藏
                            s.target.style.display = "none";
                        },
                        onCompleteParams: ["{self}"]
                    }
                  ));
            break;

        case "FlyIn":
            console.log(actionItem.get("BelongToElementID") + "FlyIn animation");

            return (TweenMax.to(tempElement[0], parseFloat(actionItem.get("duration")),
                    {
                        top: parseInt(tempElement.css("top")),
                        left: parseInt(tempElement.css("left")),
                        delay: parseInt(actionItem.get("delay")),
                        repeat: parseInt(actionItem.get("repeatCount")),
                        repeatDelay: 0,
                        onComplete: function (actionParameter) {
                            //                            jwplayer("preview_player_2335_Pelesys").play();
                            OnCompleteEvent(actionParameter);
                        },
                        onCompleteParams: [actionItem],
                        onStart: function (s) {
                            s.target.style.display = "";
                            try {
                                var oldOpacity = $(s.target).attr("selfOpacity");
                                if (oldOpacity) {
                                    s.target.style.opacity = oldOpacity;
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                        },
                        onStartParams: ["{self}"],
                        startAt: {
                            top: (function () {
                                var tempPx = 0;
                                switch (parseInt(actionItem.get("ActionDirection"))) {
                                    case 0:
                                        tempPx = parseInt("-" + tempElement.height());
                                        break;

                                    case 1:
                                        tempPx = parseInt(Globle.BoardHeight)
                                        break;

                                    case 2:
                                    case 3:
                                        tempPx = parseInt(tempElement.css("top"));
                                        break;
                                }
                                return tempPx;
                            })(this),
                            left: (function () {
                                var tempPx = 0;
                                switch (parseInt(actionItem.get("ActionDirection"))) {
                                    case 0:
                                    case 1:
                                        tempPx = parseInt(tempElement.css("left"));
                                        break;
                                    case 2:
                                        //                                console.log(Globle.BoardWidth);
                                        tempPx = -parseInt(tempElement[0].style.width);
                                        break;

                                    case 3:

                                        tempPx = parseInt(Globle.BoardWidth); //画板宽度-元素宽度
                                        break;
                                }
                                return tempPx;
                            })(this)
                        }
                    }
                    ));
            break;

        case "FadeIn": //出现,渐现
            //            console.log(actionItem.get("BelongToElementID") + "FadeIn渐现 animation");

            var startEndOpacity = calcActionOpacity(tempElement, actionItem);

            console.log(actionItem.get("BelongToElementID") + "FadeIn渐现 animation" + startEndOpacity);

            return (TweenMax.to(tempElement[0], (function () {
                if (parseFloat(actionItem.get("duration")) == 0)
                    return 0.001;
                //                alert(parseFloat(actionItem.get("duration")));
                return parseFloat(actionItem.get("duration"))
            })(),
            {
                opacity: startEndOpacity[1],
                delay: parseInt(actionItem.get("delay")),
                repeat: parseInt(actionItem.get("repeatCount")),
                repeatDelay: 0,
                onStart: function (s) {

                    s.target.style.display = "";

                },
                onStartParams: ["{self}"],
                onComplete: function (actionParameters) {
                    OnCompleteEvent(arguments[0]);
                    arguments[1].target.style.display = "";
                },
                onCompleteParams: [actionItem, "{self}"],
                startAt: { opacity: startEndOpacity[0] }
            }
            ));
            break;

        case "FadeOut": //渐隐
            //            console.log(actionItem.get("BelongToElementID") + "FadeOut animation");

            var startEndOpacity = calcActionOpacity(tempElement, actionItem);

            console.log(actionItem.get("BelongToElementID") + "FadeOut渐隐 animation" + startEndOpacity);

            return (TweenMax.fromTo(tempElement[0],
             (function () {
                 if (parseFloat(actionItem.get("duration")) == 0)
                     return 0.001;
                 return parseFloat(actionItem.get("duration"));
             })()
            ,
            {
                opacity: startEndOpacity[0]
            },
            {
                opacity: startEndOpacity[1],
                delay: parseInt(actionItem.get("delay")),
                repeat: parseInt(actionItem.get("repeatCount")),
                repeatDelay: 0,
                onStart: function (s) {
                    s.target.style.display = "";
                },
                onStartParams: ["{self}"],
                onComplete: function (s) {
                    s.target.style.display = "none";
                },
                onCompleteParams: ['{self}']
            }
            ));
            break;

        case "ZoomOut": //放大出现
            console.log(actionItem.get("BelongToElementID") + "ZoomOut animation");
            var rotate = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pRotate"));
            return (TweenMax.to(tempElement[0], parseFloat(actionItem.get("duration")),
            {
                scaleX: 1,
                scaleY: 1,
                delay: parseInt(actionItem.get("delay")),
                repeat: parseInt(actionItem.get("repeatCount")),
                repeatDelay: 0,
                onStart: function (s) {
                    s.target.style.display = "";
                    try {
                        //解决问题1:-------------------------------------开始
                        //问题描述:
                        //元素设置渐隐,然后设置放大出现.
                        //放大出现动画没有效果.
                        //解决思路:
                        //1.在放大出现开始时,将元素的透明度设置为元素本身的透明度.
                        //2.元素标签里, 加一个属性,专门标记 元素旧的透明度selfOpacity.
                        //3.selfOpacity在执行渐隐动作时, 动态添加到元素的属性中.请查看渐隐里的设置
                        //4.除了渐隐动画, 所有动画都要这么解决.
                        var oldOpacity = $(s.target).attr("selfOpacity");
                        if (oldOpacity) {
                            s.target.style.opacity = oldOpacity;
                        }

                        //解决问题1--------------------------------------结束
                        //                        s.target.style.opacity = 1;
                    }
                    catch (e) {
                        console.log(e);
                    }
                },
                onStartParams: ["{self}"],
                onComplete: function (actionParameter) {
                    //                            jwplayer("preview_player_2335_Pelesys").play();
                    OnCompleteEvent(actionParameter);
                },
                onCompleteParams: [actionItem],
                startAt:
                 {
                     rotation: rotate,//因为元素本身可以旋转，因此要这行代码
                     scaleX: 0,
                     scaleY: 0
                 }
            }
            ));
            break;

        case "ZoomInOut": //放大缩小
            console.log("ZoomInOut animation");
            var rotate = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pRotate"));

            console.log("-----" + rotate);

            return (TweenMax.to(tempElement[0], parseFloat(actionItem.get("duration")),
            {
                scaleX: parseFloat(actionItem.get("ZoomInOut")),
                scaleY: parseFloat(actionItem.get("ZoomInOut")),
                delay: parseInt(actionItem.get("delay")),
                repeat: parseInt(actionItem.get("repeatCount")),
                repeatDelay: 0,
                onStart: function (s) {
                    s.target.style.display = "";
                    var oldOpacity = $(s.target).attr("selfOpacity");
                    if (oldOpacity) {
                        s.target.style.opacity = oldOpacity;
                    }
                },
                onStartParams: ["{self}"],
                onComplete: function (actionParameter) {
                    //                            jwplayer("preview_player_2335_Pelesys").play();
                    OnCompleteEvent(actionParameter);
                },
                onCompleteParams: [actionItem],
                startAt: {
                    //                    rotation: (function () {
                    //                        console.log("-----" + rotate);
                    //                        return 770;
                    //                    })(),
                    rotation: rotate,
                    scaleX: 1,
                    scaleY: 1
                }
            }
            ));
            break;

        case "ZoomIn": //缩小消失
            console.log("ZoomIn animation");

            var oldTransparent = parseFloat(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pTransparent"));
            var rotate = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pRotate"));
            return (TweenMax.to(tempElement[0], parseFloat(actionItem.get("duration")),
            {
                scaleX: 0,
                scaleY: 0,
                delay: parseInt(actionItem.get("delay")),
                repeat: parseInt(actionItem.get("repeatCount")),
                repeatDelay: 0,
                onStart: function (s) {
                    s.target.style.display = "";
                    var oldOpacity = $(s.target).attr("selfOpacity");
                    if (oldOpacity) {
                        s.target.style.opacity = oldOpacity;
                    }
                },
                onComplete: function (s) {
                    tempElement[0].style.display = "none";
                },
                onStartParams: ["{self}"],
                startAt: {
                    rotation: rotate, //因为元素本身可以旋转，因此要这行代码
                    opacity: oldTransparent,
                    scaleX: 1,
                    scaleY: 1
                }
            }
            ));
            break

        case "RotateType": //旋转
            console.log("RotateType");
            //            var id = (tempElement[0].id).substring(0, (tempElement[0].id).indexOf("_preview"));
            var rotate = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pRotate"));
            //            console.log(tempElement[0].style.webkitTransform.replace(/[^0-9]/ig, ""));
            return (TweenMax.to(tempElement[0], parseFloat(actionItem.get("duration")),
            {
                rotation: parseInt(actionItem.get("RotateDirection")) == 2 ? parseInt(rotate) == 0 ? parseInt(actionItem.get("RotateAngle")) : parseInt(actionItem.get("RotateAngle")) + parseInt(rotate) : null, //Z轴
                rotationX: parseInt(actionItem.get("RotateDirection")) == 0 ? parseInt(actionItem.get("RotateAngle")) : null, //X轴
                rotationY: parseInt(actionItem.get("RotateDirection")) == 1 ? parseInt(actionItem.get("RotateAngle")) : null, //Y轴
                delay: parseInt(actionItem.get("delay")),
                repeat: parseInt(actionItem.get("repeatCount")),
                transformOrigin: parseInt(actionItem.get("RotateDirection")) == 2 ? (parseInt(actionItem.get("RotateXPoint")) == 0 && parseInt(actionItem.get("RotateYPoint")) == 0) ? null : "" + parseInt(actionItem.get("RotateXPoint")) + "px " + parseInt(actionItem.get("RotateYPoint")) + "px" : null, //因为只是针对Z轴旋转才能设置旋转点，所以方向不等于2的设置NULL
                repeatDelay: 0,
                onStart: function (s) {
                    s.target.style.display = "";
                    try {
                        console.log("onStart");
                        var oldOpacity = $(s.target).attr("selfOpacity");
                        if (oldOpacity) {
                            s.target.style.opacity = oldOpacity;
                        }
                        //                        console.log(tempElement[0].style.webkitTransform);
                        //                        s.target.style.opacity = 1;
                        //                        tempElement[0].style.webkitTransform = 'rotate(0deg)';
                    }
                    catch (e) {
                        console.log(e);
                    }
                },
                onComplete: function (actionParameter) {
                    //                            jwplayer("preview_player_2335_Pelesys").play();
                    OnCompleteEvent(actionParameter);
                },
                onCompleteParams: [actionItem],
                onStartParams: ["{self}"],
                startAt: {
                    rotation: rotate,
                    rotationX: 0, //X轴
                    rotationY: 0 //Y轴
                }
            }
            ));
            break

        case "BezierType":
            //计算每个点
            var tempJsonObj
            if ((typeof actionItem.get("AnimationJSONData")) == 'string')
                tempJsonObj = $.parseJSON(actionItem.get("AnimationJSONData").replace(/\\"/g, '"'));
            else
                tempJsonObj = actionItem.get("AnimationJSONData");

            console.log(tempJsonObj);

            tempJsonObj = _.map(tempJsonObj.pointData, function (value, key, list) {

                return { x: value.pointX - parseInt(tempElement.width() / 2) - parseInt(tempElement.css("left")), y: value.pointY - parseInt(tempElement.height() / 2) - parseInt(tempElement.css("top")) };

            });
            console.log(tempJsonObj);
            var rotate = parseInt(Globle.AllModelCollection.get(parseInt(actionItem.get("BelongToElementID"))).get("pRotate"));
            return (TweenMax.to(tempElement[0], parseFloat(actionItem.get("duration")),
                        {
                            delay: parseInt(actionItem.get("delay")),
                            repeat: parseInt(actionItem.get("repeatCount")),
                            repeatDelay: 0,
                            bezier: {
                                type: "thru",
                                values: tempJsonObj,
                                autoRotate: actionItem.get("isAlongCurve")
                            },
                            onStart: function (s) {
                                s.target.style.display = "";
                                var oldOpacity = $(s.target).attr("selfOpacity");
                                if (oldOpacity) {
                                    s.target.style.opacity = oldOpacity;
                                }
                            },
                            onStartParams: ["{self}"],
                            onComplete: function (s, actionParameter) {

                                OnCompleteEvent(actionParameter);
                                //                                console.log("sdf");
                                if (nextActionItem && (nextActionItem.get("actionType") == "FlyOut")) {
                                    var tempElement = $(s.target);
                                    var tempLeft = tempElement.css("left");
                                    var tempTop = tempElement.css("top");
                                    var tempMatrix = getMatrix(tempElement);
                                    var tempMatrixArray = tempMatrix.replace(/^matrix(3d)?\((.*)\)$/, '$2').split(/, /);
                                    //                                console.log(tempMatrixArray);
                                    switch (parseInt(nextActionItem.get("ActionDirection"))) {
                                        case 2:
                                        case 3:
                                            console.log("leftright");
                                            setMatrix(tempElement, tempMatrix.replace(tempMatrixArray[4], "0"));
                                            tempElement
                                            .css({
                                                'left': (parseInt(tempLeft) + parseInt(tempMatrixArray[4])) + "px"
                                            });
                                            break;
                                        case 0:
                                        case 1:
                                            console.log("updown");
                                            setMatrix(tempElement, tempMatrix.replace(tempMatrixArray[5], "0"));
                                            tempElement.css({
                                                'top': (parseInt(tempTop) + parseInt(tempMatrixArray[5])) + "px"
                                            });
                                            break;
                                    }
                                }

                                //                                console.log($("#1314_Pelesys_preview").css("left"));

                                //                            console.log(actionItem.get("BelongToElementID"));
                                //飞出之后,立即隐藏
                                //                            s.target.style.display = "none";
                            },
                            onCompleteParams: ["{self}", actionItem],
                            startAt: {
                                rotation: rotate
                            }
                        }
                        ));
            break;

        case "GoToPage":
            return (TweenMax.delayedCall(0, function () {
                console.log('GoToPage');
                if (window.parent.location.href.indexOf("/PreviewAllPage") > 0) {
                    //说明是在预览模式下,那么应该打开预览的子页面
                    location.href = actionItem.get("GoToPageID") + "_LayerHTMLTemplate_preview.htm?return=" + location.href.split('/')[location.href.split('/').length - 1];
                }
                else if (location.href.toLowerCase().indexOf("_forcrewpad") > 0) {
                    //说明是在crewpad浏览模式下
                    location.href = "../layer/" + actionItem.get("GoToPageID") + "_LayerHTMLTemplate_forcrewpad.htm?return=" + location.href.split('/')[location.href.split('/').length - 1];
                }
                else {
                    //说明是在pc浏览模式下
                    location.href = "../layer/" + actionItem.get("GoToPageID") + "_LayerHTMLTemplate.htm?return=" + location.href.split('/')[location.href.split('/').length - 1];
                }
            }
            ));
            break;
            break;
        case "PlayControl":
            return (TweenMax.to(tempElement[0], 0.001,
                        {
                            onStart: function (s) {
                                var belongElementID = actionItem.get("BelongToElementID");
                                var playState = actionItem.get("PlayState");
                                //1：播放   2：暂停
                                if (playState == "1") {
                                    if ($("#preview_player_" + belongElementID).length > 0) {
                                        if (jwplayer("preview_player_" + belongElementID).getState() == "PAUSED" || jwplayer("preview_player_" + belongElementID).getState() == "IDLE") {
                                            jwplayer("preview_player_" + belongElementID).play();
                                        }
                                    }
                                    else if ($("#preview_player_" + belongElementID + "_preview").length > 0) {
                                        if (jwplayer("preview_player_" + belongElementID + "_preview").getState() == "PAUSED" || jwplayer("preview_player_" + belongElementID + "_preview").getState() == "IDLE") {
                                            jwplayer("preview_player_" + belongElementID + "_preview").play();
                                        }
                                    }
                                }
                                else if (playState == "2") {
                                    if ($("#preview_player_" + belongElementID).length > 0) {
                                        if (jwplayer("preview_player_" + belongElementID).getState() == "PLAYING") {
                                            jwplayer("preview_player_" + belongElementID).pause();
                                        }
                                    }
                                    else if ($("#preview_player_" + belongElementID + "_preview").length > 0) {
                                        if (jwplayer("preview_player_" + belongElementID + "_preview").getState() == "PLAYING") {
                                            jwplayer("preview_player_" + belongElementID + "_preview").pause();
                                        }
                                    }
                                }

                            }
                        }
                        ));
            break;
        case "SlideControl":
            console.log("幻灯片控制");
            return (TweenMax.to(tempElement[0], 0.001,
                        {
                            onStart: function (s) {
                                var targetBelongElementID = actionItem.get("BelongToElementID");
                                //                                var slidElementControl = actionItem.get("SlidElementControl");
                                if ($("#" + targetBelongElementID + "_preview").css("display") == "none") {
                                    return;
                                }
                                switch (actionItem.get("SlidElementControl")) {
                                    case "prev":
                                        $("#" + targetBelongElementID + "_preview_carousel-example-generic").carousel('prev');
                                        break;

                                    case "next":
                                        $("#" + targetBelongElementID + "_preview_carousel-example-generic").carousel('next');
                                        break;

                                    case "setElementTo":
                                        $("#" + targetBelongElementID + "_preview_carousel-example-generic").carousel(parseInt(actionItem.get("SlidSetElementTo")));
                                        break;

                                }
                                $("#" + targetBelongElementID + "_preview_carousel-example-generic").carousel("pause")
                            }
                        }
                        ));
            break;

        case "ChangeSection":
            console.log("字幕切换控制");
            return (TweenMax.to(tempElement[0], 0.001,
                        {
                            onStart: function (s) {
                                //                                var targetBelongElementID = actionItem.get("BelongToElementID");
                                //                                var slidElementControl = actionItem.get("SlidElementControl");
                                //parent.sendToActionScript('la', '2')
                                var tempIndex = parseInt(actionItem.get("SlidSetElementTo"));
                                if (tempIndex == 0)
                                    tempIndex = 1;
                                parent.sendToActionScript("la", tempIndex + 1);
                            }
                        }
                        ));
            break;

        default:
            alert(GetTranslateUI('clickTypeTrigger') + "!");
            break;
    }
}

//计算透明度,返回数组（起始值，终点值）
function calcActionOpacity(currentElement, currentAction) {
    if (currentElement.attr("a0")) {
        var a0 = currentElement.attr("a0");
        var a1 = currentElement.attr("a1");
        var a2 = currentElement.attr("a2");

        if (a2 == "FadeOut") {//渐隐
            if (currentAction.get("actionType") == "FadeIn") {//渐现
                var temp = a0;
                a0 = a1;
                a1 = temp;
            }
            //            else {
            //                var temp = a0;
            //                a0 = a0;
            //                a1 = a1;
            //            }
        }
        else {
            if (currentAction.get("actionType") == "FadeOut") {//渐隐
                var temp = a0;
                a0 = a1;
                a1 = temp;
            }
        }

        currentElement.attr({
            "a0": a0,
            "a1": a1,
            "a2": currentAction.get("actionType")
        });
        return [parseFloat(a0), parseFloat(a1)];
    }
    else {
        if (currentAction.get("actionType") == 'FadeIn') {
            currentElement.attr({
                "a0": 0,
                "a1": currentElement.css("opacity"),
                "a2": currentAction.get("actionType")
            });
        }
        else {
            currentElement.attr({
                "a0": currentElement.css("opacity"),
                "a1": 0,
                "a2": currentAction.get("actionType")
            });
        }

        return [parseFloat(currentElement.attr("a0")), parseFloat(currentElement.attr("a1"))]
    }
}



function getMatrix(obj) {
    var matrix = obj.css("-webkit-transform") ||
                 obj.css("-moz-transform") ||
                 obj.css("-ms-transform") ||
                 obj.css("-o-transform") ||
                 obj.css("transform");
    return matrix;
};

function setMatrix(obj, value) {
    obj.css("-webkit-transform", value);
    obj.css("-moz-transform", value);
    obj.css("-ms-transform", value);
    obj.css("-o-transform", value);
    obj.css("transform", value);
};

//判断model本身是否是别人的触发器
function SelfIsTrigger(modelID) {
    //搜索当前页面所有的触发器是否是参数指定的值,是的话,返回true,否则,返回false
    try {
        return (Globle.TriggerModelCollection.where({ "BelongToElementID": modelID.replace("_preview", "") }).length > 0);
    } catch (e) {
        return false;
    }
}

//判断浏览的支持情况,返回true,表示支持
browserSuppert = function (e) {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var sB;
    (sB = ua.match(/msie ([\d.]+)/)) ? Sys.ie = sB[1] :
            (sB = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = sB[1] :
            (sB = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = sB[1] :
            (sB = ua.match(/opera.([\d.]+)/)) ? Sys.opera = sB[1] :
            (sB = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = sB[1] : 0;

    navigator.appName.indexOf("Microsoft Internet Explorer") >= 0 && (Globle.BrowerType = 'ie');
    navigator.userAgent.indexOf("rv:11.0") >= 0 && (Globle.BrowerType = 'ie');
    //以下进行测试
    return (Sys.ie && (Globle.BrowerType = 'ie') && (parseInt(Sys.ie) >= e.ie)) || (Sys.firefox && (parseInt(Sys.firefox) >= e.firefox)) || (Sys.chrome && (Globle.BrowerType = 'chrome') && (parseInt(Sys.chrome) >= e.chrome)) || (Sys.safari && (parseInt(Sys.safari) >= e.safari)) || ((!Sys.ie) & (!Sys.firefox) & (!Sys.chrome) & (!Sys.safari))

}

//判断页面载入时,是否自动播放一些动画
//目前只需要判断幻灯片
function StartOtherAnimation() {
    //处理逻辑:
    //1. 找到当前页面的所有幻灯片;
    //2. 过滤出需要自动播放的幻灯片
    //3. 加入到timeline中;

    var AutoTimeLine = new TimelineLite();
    var tweenArray = new Array();
    GetCurrentBoardAllElementsByType("ImageSlide").forEach(function (item) {
        if (item.get("IsAutoPlay")) {
            console.log("play------------------");

            tweenArray.push(TweenMax.delayedCall(parseFloat(item.get("DelaySecond")), function (itemPara) {
                //                                alert(itemPara);
                $("#" + itemPara + "_preview_carousel-example-generic")
                                                .on('slid.bs.carousel', function (event) {
                                                    //计算是否达到循环次数
                                                    //处理逻辑:
                                                    //1. 首先要求是自动播放;
                                                    //存储格式为:id,次数; 次数从1开始计数

                                                    Globle.CountArray || (Globle.CountArray = new Array());
                                                    var currentTemp = Globle.CountArray[this.attributes.id.value];
                                                    if (currentTemp) {
                                                        Globle.CountArray[this.attributes.id.value] += 1;
                                                    }
                                                    else {
                                                        //说明不存在
                                                        Globle.CountArray[this.attributes.id.value] = 1;
                                                    }

                                                    var tempImageSild = Globle.AllModelCollection.get(parseInt(this.attributes.id.value));
                                                    if (tempImageSild) {
                                                        if ((parseInt(tempImageSild.get("PlayCount")) + 1) == ((Globle.CountArray[this.attributes.id.value] + 1) / tempImageSild.get("ImageArray").length)) {
                                                            //说明到达循环上限;
                                                            $("#" + this.attributes.id.value).carousel("pause");
                                                            if (tempImageSild.get("PlayEndIsHide")) {
                                                                $("#" + this.attributes.id.value).hide();
                                                            }
                                                        }
                                                    }
                                                })
                                                .carousel();
            }, [item.get("pid")]));
        }
    });
    AutoTimeLine.add(tweenArray);
}


//开始自动播放设置自动播放的音频或者视频
function StartMedia() {
    if (document.cookie.indexOf("jwplayerAutoStart") == -1) {
        //        var AutoTimeLine = new TimelineLite();
        //        var tweenArray = new Array();
        //过滤一遍视频元素,初始化每个视频元素
        GetCurrentBoardAllElementsByType("Video").forEach(function (item) {
            if (item.get("isAutoPlay")) {
                if (item.get("isLayerContent")) {
                    //处理逻辑:
                    //1. 如果视频元素有动作,那么就不自动播放,需要等待动作执行完毕之后,再播放
                    var currActionCount = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": item.get("pid") });
                    var currPlayControlActionCount = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": item.get("pid"), "actionType": "PlayControl" });
                    if (currActionCount.length == currPlayControlActionCount.length) {
                        console.log("play------------------");
                        var playNumber = parseInt(item.get("pAutoPlayNumber"));
                        jwplayer("preview_player_" + item.get("pid") + "_preview").play();
                        Globle.CountArray || (Globle.CountArray = new Array());
                        Globle.CountArray[item.get("pid")] = 1;
                        //                        tweenArray.push(TweenMax.delayedCall(0.0, function (itemPara) {
                        jwplayer("preview_player_" + item.get("pid") + "_preview").onComplete(function () {
                            if (Globle.CountArray[item.get("pid")] < playNumber + 1) {
                                Globle.CountArray[item.get("pid")] = Globle.CountArray[item.get("pid")] + 1;
                                jwplayer("preview_player_" + item.get("pid") + "_preview").play();
                            }
                            else {

                            }
                        });
                        //                        }, [item.get("pid")]));
                    }
                }
                else {
                    //处理逻辑:
                    //1. 如果视频元素有动作,那么就不自动播放,需要等待动作执行完毕之后,再播放
                    var currActionCount = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": item.get("pid") });
                    var currPlayControlActionCount = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": item.get("pid"), "actionType": "PlayControl" });
                    if (currActionCount.length == currPlayControlActionCount.length) {
                        console.log("play------------------");
                        var playNumber = parseInt(item.get("pAutoPlayNumber"));
                        jwplayer("preview_player_" + item.get("pid")).play();
                        Globle.CountArray || (Globle.CountArray = new Array());
                        Globle.CountArray[item.get("pid")] = 1;
                        jwplayer("preview_player_" + item.get("pid")).onComplete(function () {
                            if (Globle.CountArray[item.get("pid")] < playNumber + 1) {
                                Globle.CountArray[item.get("pid")] = Globle.CountArray[item.get("pid")] + 1;
                                jwplayer("preview_player_" + item.get("pid")).play();
                            }
                            else {

                            }
                        });
                    }
                }
            }
        });
        //过滤一遍元素,初始化每个音频元素
        GetCurrentBoardAllElementsByType("Audio").forEach(function (item) {
            if (location.href.toLowerCase().indexOf("_forcrewpad") < 0 && window.top.location.href.indexOf("launchSCO.html") < 0) {
                if (item.get("isAutoPlay")) {
                    var delayTime = parseInt(item.get("pDelayPlaySecond")) * 1000;
                    var playNumber = parseInt(item.get("pAutoPlayNumber"));
                    Globle.CountArray || (Globle.CountArray = new Array());
                    Globle.CountArray[item.get("pid")] = 1;
                    if (item.get("isLayerContent")) {
                        setTimeout(function () {
                            jwplayer("preview_player_" + item.get("pid") + "_preview").play();
                        }, delayTime);
                        jwplayer("preview_player_" + item.get("pid") + "_preview").onComplete(function () {
                            if (Globle.CountArray[item.get("pid")] < playNumber + 1) {
                                Globle.CountArray[item.get("pid")] = Globle.CountArray[item.get("pid")] + 1;
                                jwplayer("preview_player_" + item.get("pid") + "_preview").play();
                            }
                        });

                    }
                    else {
                        setTimeout(function () {
                            jwplayer("preview_player_" + item.get("pid")).play();
                        }, delayTime);
                        jwplayer("preview_player_" + item.get("pid")).onComplete(function () {
                            if (Globle.CountArray[item.get("pid")] < playNumber + 1) {
                                Globle.CountArray[item.get("pid")] = Globle.CountArray[item.get("pid")] + 1;
                                jwplayer("preview_player_" + item.get("pid")).play();
                            }
                        });
                    }
                }
            }
        });
    }
}
//页面载入时,组织自动执行的动作序列,以及自动播放的视频或者音频
function GenerateAutoAction() {
    StartMedia();
    StartOtherAnimation();
    SortCollection(Globle.AnimationBaseModelCollection);

    var tL = new TimelineLite({
        paused: true
    });

    var tempArray = new Array();

    var tempActionArray = Globle.AnimationBaseModelCollection.where({
        "IsWaitTrigger": !1,
        "BelongToBoardID": Globle.CurrentBoard.get("pid")
    });

    for (i = 0; i < tempActionArray.length; i++) {
        var nextAction = null;
        try {
            nextAction = tempActionArray[i + 1];
        } catch (e) {
            nextAction = null;
        }

        var tweenInstanceObj = GetTweenInstanceAction(tempActionArray[i], nextAction);

        //如果下一个动作执行方式是:与上一个动作同时执行,那么就new一个array
        //如果下一个动作执行方式是:上一个动作执行完毕后,顺序执行,那么就把array清空
        if (tempActionArray[i + 1] && tempActionArray[i + 1].get("ActionMethod") == 2) {
            tempArray.push(tweenInstanceObj);
        }
        else {
            if (tempArray.length != 0) {
                tempArray.push(tweenInstanceObj);
                tL.add(tempArray);
                tempArray = new Array();
            }
            else {
                tempArray = new Array();
                tL.add(tweenInstanceObj);
            }
        }
    }

    tL.play();
}

function PasterElementAction(PasterdActionModel) {
    switch (PasterdActionModel.attributes.actionType) {
        case "FlyIn": //飞入
            var flyInModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "FlyIn" })[0];
            if (!flyInModel) {
                flyInModel = new AnimationModel({
                    "BelongToElementID": Globle.CurrentModel.get("pid"),
                    "isNew": !1,
                    "name": GetTranslateUI('TflyIn'),
                    "actionType": "FlyIn",
                    "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                    "ActionDirection": PasterdActionModel.attributes.ActionDirection,
                    "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                    "delay": PasterdActionModel.attributes.delay,
                    "duration": PasterdActionModel.attributes.duration,
                    "repeatCount": PasterdActionModel.attributes.repeatCount,
                    "SequenceID": GetCurrentElementsActionSequence()
                });

                SavePasterAction(flyInModel);
                Globle.AnimationBaseModelCollection.add(flyInModel);
            }
            else {
                //                flyInModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                //                flyInModel.ActionDirection = PasterdActionModel.attributes.ActionDirection;
                //                flyInModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                //                flyInModel.delay = PasterdActionModel.attributes.delay;
                //                flyInModel.duration = PasterdActionModel.attributes.duration;
                //                flyInModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                SetValueForPasterAction(flyInModel, PasterdActionModel);
                flyInModel.set({
                    ActionDirection: PasterdActionModel.attributes.ActionDirection
                });
                SavePasterAction(flyInModel);
            }
            break;

        case "FlyOut": //飞出
            if (Globle.CurrentModel.attributes.pType != 'Video') {
                var flyoutModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "FlyOut" })[0];
                if (!flyoutModel) {
                    flyoutModel = new AnimationModel({
                        "BelongToElementID": Globle.CurrentModel.get("pid"),
                        "isNew": !1,
                        "name": GetTranslateUI('TflyOut'),
                        "actionType": "FlyOut",
                        "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                        "ActionDirection": PasterdActionModel.attributes.ActionDirection,
                        "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                        "delay": PasterdActionModel.attributes.delay,
                        "duration": PasterdActionModel.attributes.duration,
                        "repeatCount": PasterdActionModel.attributes.repeatCount,
                        "SequenceID": GetCurrentElementsActionSequence()
                    });
                    SavePasterAction(flyoutModel);
                    Globle.AnimationBaseModelCollection.add(flyoutModel);
                }
                else {
                    //                flyoutModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                    //                flyoutModel.ActionDirection = PasterdActionModel.attributes.ActionDirection;
                    //                flyoutModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                    //                flyoutModel.delay = PasterdActionModel.attributes.delay;
                    //                flyoutModel.duration = PasterdActionModel.attributes.duration;
                    //                flyoutModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                    SetValueForPasterAction(flyoutModel, PasterdActionModel);
                    flyoutModel.set({
                        ActionDirection: PasterdActionModel.attributes.ActionDirection
                    });
                    SavePasterAction(flyoutModel);
                }
            }
            break;

        case "FadeIn": //渐现
            var FadeInModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "FadeIn" })[0];
            if (!FadeInModel) {
                FadeInModel = new AnimationModel({
                    "BelongToElementID": Globle.CurrentModel.get("pid"),
                    "isNew": !1,
                    "name": GetTranslateUI('TfadeIn'),
                    "actionType": "FadeIn",
                    "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                    "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                    "delay": PasterdActionModel.attributes.delay,
                    "duration": PasterdActionModel.attributes.duration,
                    "repeatCount": PasterdActionModel.attributes.repeatCount,
                    "SequenceID": GetCurrentElementsActionSequence()
                });
                SavePasterAction(FadeInModel);
                Globle.AnimationBaseModelCollection.add(FadeInModel);
            }
            else {
                //                FadeInModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                //                FadeInModel.ActionDirection = PasterdActionModel.attributes.ActionDirection;
                //                FadeInModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                //                FadeInModel.delay = PasterdActionModel.attributes.delay;
                //                FadeInModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                SetValueForPasterAction(FadeInModel, PasterdActionModel);
                SavePasterAction(FadeInModel);
            }
            break;

        case "FadeOut": //渐隐
            if (Globle.CurrentModel.attributes.pType != 'Video') {
                var FadeOutModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "FadeOut" })[0];
                if (!FadeOutModel) {
                    FadeOutModel = new AnimationModel({
                        "BelongToElementID": Globle.CurrentModel.get("pid"),
                        "isNew": !1,
                        "name": GetTranslateUI('TfadeOut'),
                        "actionType": "FadeOut",
                        "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                        "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                        "delay": PasterdActionModel.attributes.delay,
                        "duration": PasterdActionModel.attributes.duration,
                        "repeatCount": PasterdActionModel.attributes.repeatCount,
                        "SequenceID": GetCurrentElementsActionSequence()
                    });
                    SavePasterAction(FadeOutModel);
                    Globle.AnimationBaseModelCollection.add(FadeOutModel);
                }
                else {
                    //                FadeOutModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                    //                FadeOutModel.ActionDirection = PasterdActionModel.attributes.ActionDirection;
                    //                FadeOutModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                    //                FadeOutModel.delay = PasterdActionModel.attributes.delay;
                    //                FadeOutModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                    SetValueForPasterAction(FadeOutModel, PasterdActionModel);
                    SavePasterAction(FadeOutModel);
                }
            }
            break;

        case "ZoomOut": //放大出现
            if (Globle.CurrentModel.attributes.pType != 'Video') {
                var ZoomOutModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "ZoomOut" })[0];
                if (!ZoomOutModel) {
                    ZoomOutModel = new AnimationModel({
                        "BelongToElementID": Globle.CurrentModel.get("pid"),
                        "isNew": !1,
                        "name": GetTranslateUI('TzoomAppear'),
                        "actionType": "ZoomOut",
                        "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                        "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                        "delay": PasterdActionModel.attributes.delay,
                        "duration": PasterdActionModel.attributes.duration,
                        "repeatCount": PasterdActionModel.attributes.repeatCount,
                        "SequenceID": GetCurrentElementsActionSequence()
                    });
                    SavePasterAction(ZoomOutModel);
                    Globle.AnimationBaseModelCollection.add(ZoomOutModel);
                }
                else {
                    //                ZoomOutModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                    //                ZoomOutModel.ActionDirection = PasterdActionModel.attributes.ActionDirection;
                    //                ZoomOutModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                    //                ZoomOutModel.delay = PasterdActionModel.attributes.delay;
                    //                ZoomOutModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                    SetValueForPasterAction(ZoomOutModel, PasterdActionModel);
                    SavePasterAction(ZoomOutModel);
                }
            }
            break;

        case "ZoomIn": //缩小消失
            if (Globle.CurrentModel.attributes.pType != 'Video') {
                var ZoomInModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "ZoomIn" })[0];
                if (!ZoomInModel) {
                    ZoomInModel = new AnimationModel({
                        "BelongToElementID": Globle.CurrentModel.get("pid"),
                        "isNew": !1,
                        "name": GetTranslateUI('TreducedOccur'),
                        "actionType": "ZoomIn",
                        "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                        "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                        "delay": PasterdActionModel.attributes.delay,
                        "duration": PasterdActionModel.attributes.duration,
                        "repeatCount": PasterdActionModel.attributes.repeatCount,
                        "SequenceID": GetCurrentElementsActionSequence()
                    });
                    SavePasterAction(ZoomInModel);
                    Globle.AnimationBaseModelCollection.add(ZoomInModel);
                }
                else {
                    //                ZoomInModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                    //                ZoomInModel.ActionDirection = PasterdActionModel.attributes.ActionDirection;
                    //                ZoomInModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                    //                ZoomInModel.delay = PasterdActionModel.attributes.delay;
                    //                ZoomInModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                    SetValueForPasterAction(ZoomInModel, PasterdActionModel);
                    SavePasterAction(ZoomInModel);
                }
            }
            break;
        case "ZoomInOut": //放大缩小
            if (Globle.CurrentModel.attributes.pType != 'Video') {
                var ZoomInModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "ZoomInOut" })[0];
                if (!ZoomInModel) {
                    ZoomInModel = new AnimationModel({
                        "BelongToElementID": Globle.CurrentModel.get("pid"),
                        "isNew": !0,
                        "name": GetTranslateUI('Tzoom'),
                        "actionType": "ZoomInOut",
                        "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                        "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                        "delay": PasterdActionModel.attributes.delay,
                        "duration": PasterdActionModel.attributes.duration,
                        "repeatCount": PasterdActionModel.attributes.repeatCount,
                        "ZoomInOut": PasterdActionModel.attributes.ZoomInOut,
                        "SequenceID": GetCurrentElementsActionSequence()
                    });
                    SavePasterAction(ZoomInModel);
                    Globle.AnimationBaseModelCollection.add(ZoomInModel);
                }
                else {
                    SetValueForPasterAction(ZoomInModel, PasterdActionModel);
                    ZoomInModel.set({
                        ZoomInOut: PasterdActionModel.attributes.ZoomInOut
                    });
                    SavePasterAction(ZoomInModel);
                }
            }
            break;
        case "RotateType": //旋转 
            if (Globle.CurrentModel.attributes.pType != 'Video') {
                var RotateModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "RotateType" })[0];
                if (!RotateModel) {
                    RotateModel = new AnimationModel({
                        "BelongToElementID": Globle.CurrentModel.get("pid"),
                        "isNew": !1,
                        "name": GetTranslateUI('Trotate'),
                        "actionType": "RotateType",
                        "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                        "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                        "delay": PasterdActionModel.attributes.delay,
                        "duration": PasterdActionModel.attributes.duration,
                        "repeatCount": PasterdActionModel.attributes.repeatCount,
                        "RotateAngle": PasterdActionModel.attributes.RotateAngle,
                        "RotateDirection": PasterdActionModel.attributes.RotateDirection,
                        "SequenceID": GetCurrentElementsActionSequence()
                    });
                    SavePasterAction(RotateModel);
                    Globle.AnimationBaseModelCollection.add(RotateModel);
                }
                else {
                    //                RotateModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                    //                RotateModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                    //                RotateModel.delay = PasterdActionModel.attributes.delay;
                    //                RotateModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                    //                RotateModel.RotateAngle = PasterdActionModel.attributes.RotateAngle;
                    //                RotateModel.RotateDirection = PasterdActionModel.attributes.RotateDirection;
                    SetValueForPasterAction(RotateModel, PasterdActionModel);
                    RotateModel.set({
                        RotateAngle: PasterdActionModel.attributes.RotateAngle,
                        RotateDirection: PasterdActionModel.attributes.RotateDirection
                    });
                    SavePasterAction(RotateModel);
                }
            }
            break;

        case "BezierType": //曲线
            if (Globle.CurrentModel.attributes.pType != 'RichText' || Globle.CurrentModel.attributes.pType != 'Video') {

                var BezierModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "BezierType" })[0];
                if (!BezierModel) {
                    BezierModel = new AnimationModel({
                        "BelongToElementID": Globle.CurrentModel.get("pid"),
                        "isNew": !1,
                        "name": GetTranslateUI('TcurveBezier'),
                        "actionType": "BezierType",
                        "isAlongCurve": PasterdActionModel.attributes.isAlongCurve,
                        "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                        "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                        "delay": PasterdActionModel.attributes.delay,
                        "duration": PasterdActionModel.attributes.duration,
                        "repeatCount": PasterdActionModel.attributes.repeatCount,
                        "AnimationJSONData": PasterdActionModel.attributes.AnimationJSONData,
                        "SequenceID": GetCurrentElementsActionSequence()
                    });
                    SavePasterAction(BezierModel);
                    Globle.AnimationBaseModelCollection.add(BezierModel);
                }
                else {
                    //                    BezierModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                    //                    BezierModel.ActionDirection = PasterdActionModel.attributes.ActionDirection;
                    //                    BezierModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                    //                    BezierModel.delay = PasterdActionModel.attributes.delay;
                    //                    BezierModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                    //                    BezierModel.isAlongCurve = PasterdActionModel.attributes.isAlongCurve;

                    SetValueForPasterAction(BezierModel, PasterdActionModel);
                    BezierModel.set({
                        isAlongCurve: PasterdActionModel.attributes.isAlongCurve
                    });
                    SavePasterAction(BezierModel);
                }
            }

            break;

        case "ComplexAnimationType": //复合动画
            if (Globle.CurrentModel.attributes.pType != 'Video') {
                var complexModel = Globle.AnimationBaseModelCollection.where({ "BelongToElementID": Globle.CurrentModel.get("pid"), "actionType": "ComplexAnimationType" })[0];
                if (!complexModel) {
                    complexModel = new AnimationModel({
                        "BelongToElementID": Globle.CurrentModel.get("pid"),
                        "isNew": !1,
                        "name": GetTranslateUI('TcompositeAnimation'),
                        "actionType": "ComplexAnimationType",
                        "ComplexHeight": PasterdActionModel.attributes.ComplexHeight,
                        "ComplexWidth": PasterdActionModel.attributes.ComplexWidth,
                        "ComplexLeft": PasterdActionModel.attributes.ComplexLeft,
                        "ComplexTop": PasterdActionModel.attributes.ComplexTop,
                        "ActionMethod": PasterdActionModel.attributes.ActionMethod,
                        "IsWaitTrigger": PasterdActionModel.attributes.IsWaitTrigger,
                        "delay": PasterdActionModel.attributes.delay,
                        "duration": PasterdActionModel.attributes.duration,
                        "repeatCount": PasterdActionModel.attributes.repeatCount,
                        "ComplexOpacity": PasterdActionModel.attributes.ComplexOpacity,
                        "ComplexFontSize": PasterdActionModel.attributes.ComplexFontSize,
                        "SequenceID": GetCurrentElementsActionSequence()
                        //                            ,"ComplexFontSize":parseInt($("#"+Globle.CurrentModel.get("pid")).css("font-size"))
                    });

                    SavePasterAction(complexModel);
                    Globle.AnimationBaseModelCollection.add(complexModel);
                }
                else {
                    //                complexModel.ComplexHeight = PasterdActionModel.attributes.ComplexHeight;
                    //                complexModel.ComplexWidth = PasterdActionModel.attributes.ComplexWidth;
                    //                complexModel.ComplexLeft = PasterdActionModel.attributes.ComplexLeft;
                    //                complexModel.ComplexTop = PasterdActionModel.attributes.ComplexTop;
                    //                complexModel.ActionMethod = PasterdActionModel.attributes.ActionMethod;
                    //                complexModel.IsWaitTrigger = PasterdActionModel.attributes.IsWaitTrigger;
                    //                complexModel.delay = PasterdActionModel.attributes.delay;
                    //                complexModel.duration = PasterdActionModel.attributes.duration;
                    //                complexModel.repeatCount = PasterdActionModel.attributes.repeatCount;
                    //                complexModel.ComplexOpacity = PasterdActionModel.attributes.ComplexOpacity;
                    //                complexModel.ComplexFontSize = PasterdActionModel.attributes.ComplexFontSize;
                    SetValueForPasterAction(complexModel, PasterdActionModel);
                    BezierModel.set({
                        ComplexHeight: PasterdActionModel.attributes.ComplexHeight,
                        ComplexWidth: PasterdActionModel.attributes.ComplexWidth,
                        ComplexLeft: PasterdActionModel.attributes.ComplexLeft,
                        ComplexTop: PasterdActionModel.attributes.ComplexTop,
                        ComplexOpacity: PasterdActionModel.attributes.ComplexOpacity,
                        ComplexFontSize: PasterdActionModel.attributes.ComplexFontSize
                    });
                    SavePasterAction(complexModel);
                }
            }
            break;
        default:
            //                    alert("不支持该动作");
            break;
    }
}

function SavePasterAction(tm) {
    tm.save();
}

function SetValueForPasterAction(TargetAction, SourceAction) {
    TargetAction.set({
        ActionMethod: SourceAction.attributes.ActionMethod,
        IsWaitTrigger: SourceAction.attributes.IsWaitTrigger,
        delay: SourceAction.attributes.delay,
        duration: SourceAction.attributes.duration,
        repeatCount: SourceAction.attributes.repeatCount,
        silent: !0
    });
}

//此方法用来处理自动播放音频时候，音频的摆放位置
function CrewPadAutoPlayAudio() {
    //处理逻辑：
    //1.如果页面中存在音频，并且音频是不可见的，则将其设置为可见
    //2.并且设置成播放完毕隐藏
    if (GetCurrentBoardAllElementsByType("Audio").length > 0) {
        var autoPlayAudios = Globle.AllModelCollection.where({
            "pParentElementID": Globle.CurrentBoard.get("pid"),
            "pType": "Audio",
            "isAutoPlay": !0
        });
        if (autoPlayAudios.length > 0) {
            _.each(autoPlayAudios, function (item, index) {
                $("#" + item.get("pid") + "_preview").css({
                    "display": "block",
                    "left": "1200px"
                });
            });
            var firstAutoPlayAudio = autoPlayAudios[0];
            $("#" + firstAutoPlayAudio.get("pid") + "_preview").css({
                "top": "510px",
                "left": "393px",
                "display": "block",
                "z-index": "999999"
            });
            IndexAudioComplete(autoPlayAudios, 0);
        }
        else {
            $(".AudioPanel").css("display", "none");
        }
    }
}

function IndexAudioComplete(autoPlayAudios, index) {
    jwplayer("preview_player_" + autoPlayAudios[index].get("pid")).onComplete(function () {
        if ($(".AudioPanel").css("display") == "none") {
            return;
        }
        //如果原来音频不显示控制条的话
        if (autoPlayAudios[index].get("isPadPlayShow") == "show") {
            $("#" + autoPlayAudios[index].get("pid") + "_preview").css({
                "left": autoPlayAudios[index].get("pLeft") + "px",
                "top": autoPlayAudios[index].get("pTop") + "px",
                "z-index": autoPlayAudios[index].get("SequenceID")
            })
        }
        else {
            $("#" + autoPlayAudios[index].get("pid") + "_preview").css({
                "left": "1200px"
            });
        }
        if (index + 1 < autoPlayAudios.length) {
            $("#" + autoPlayAudios[index + 1].get("pid") + "_preview").css({
                "top": "510px",
                "left": "393px",
                "z-index": "999999"
            });
            IndexAudioComplete(autoPlayAudios, index + 1);
        }
        else {
            $(".AudioPanel").css("display", "none");
        }
    });
}


