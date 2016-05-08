function GenerateRequestURL(requestNameURL) {

    if (location.href.indexOf("cis.comac.cc") >= 0) {
        //在lcms前加大写LMS
        return requestNameURL.replace('/lcms/', '/LMS/lcms/');
    }
    else {
        //不加大写LMS
        return requestNameURL;
    }
}

$(function () {
    $(".navigation").on("click", "img", function () {
        if (this.attributes.src.value.toLowerCase().indexOf("disable") >= 0)
            return;
        switch (this.attributes.type.value) {
            case "prev":
                gotoPage('prev');
                break;

            case "next":
                gotoPage('next');
                break;
        }
    });
    var data = JSON.parse(decodeURI(Request.QueryString("data")));
    Globle = {};
    Globle.PageIDArray = data.PageIDArray;
    Globle.CurrentPageID = data.CurrentPageID;
    Globle.CbtUnitID = data.CbtUnitID;
    Globle.Type = data.Type;
    gotoPage('current');
});

Request = {
    QueryString: function (item) {
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return svalue ? svalue[1] : svalue;
    }
}
function gotoPage(direction) {
    var currentIndex = _.indexOf(Globle.PageIDArray, Globle.CurrentPageID);
    switch (direction) {
        case "prev":
            $("img[type='next']").attr("src", "AnimationResource/images/next.png");
            if (currentIndex == 1) {
                $("img[type='prev']").attr("src", "AnimationResource/images/prevDisable.png");
            }
            Globle.CurrentPageID = Globle.PageIDArray[currentIndex - 1];

            break;

        case "next":
            $("img[type='prev']").attr("src", "AnimationResource/images/pre.png");
            if (currentIndex == (Globle.PageIDArray.length - 2)) {
                $("img[type='next']").attr("src", "AnimationResource/images/nextDisable.png");
            }
            Globle.CurrentPageID = Globle.PageIDArray[currentIndex + 1];

            break;

        case "current":
            if (currentIndex == 0) {
                $("img[type='prev']").attr("src", "AnimationResource/images/prevDisable.png");
            }
            else
                $("img[type='prev']").attr("src", "AnimationResource/images/pre.png");
            if (currentIndex == (Globle.PageIDArray.length - 1)) {
                $("img[type='next']").attr("src", "AnimationResource/images/nextDisable.png");
            }
            else
                $("img[type='next']").attr("src", "AnimationResource/images/next.png");

            break;
    }

    $.ajax({
        async: false,
        url: getUrl(Globle.CurrentPageID),
        success: function () {
            $("#pagecontent").attr("src", getUrl(Globle.CurrentPageID));
        },
        error: function () {
            alert(opener.GetTranslateUI('TThenextpagehasnotbeengeneratedPleasegeneratedpreview') + "!");
            location.reload();
        }
    });
    LoadSection();
}
function sendToActionScript(method, value) {

    switch (method) {
        case "lu":
            //执行返回
            console.log(value);
            window.frames['pagecontent'].window.location.href = window.frames['pagecontent'].window.location.search.replace('?return=', '');
            break;

        case "la":
            //切换字幕
            var sectionIndex = value - 1; //  parseInt(value.replace('method=playAudioOfSection,param=s', ''));
            try {
                var sectonModel = Globle.CurrentPageSectionCollection[sectionIndex];
                //切换字幕同时要切换配音
                $(".section").text(decodeURI(sectonModel.sectionText));
                console.log(sectionIndex);
                var fileList = TidySection(sectionIndex, !0);

                //                fileList.push({
                //                    file: location.origin + "/lcms/CBTUnitFiles/" + decodeURIComponent(sectonModel.mp3Url).replace("../CBTUnitFiles/", ""),
                //                    pindex: sectionIndex,
                //                    isLa: !0
                //                });


                jwplayer('player').load(fileList);
                jwplayer('player').play();
            } catch (e) {
                alert(opener.GetTranslateUI('TInvalidsubtitlespleaserecheckthesubtitlemayproducethewrongreasonssubtitlespackagedbeforebeingdeletedyotherusers') + ".");
            }
            break;
    }
}

function GenerateID(str) {
    var pad = "00000"
    return pad.substring(0, pad.length - str.length) + str
}
function getUrl(pageid) {
    if (Globle.Type == "layer")
        return "../../CBTUnitFiles/cu" + GenerateID(Globle.CbtUnitID) + "/MediaFiles/" + pageid + "_LayerHTMLTemplate_Preview.htm?r=" + Date.now();
    else
        return "../../CBTUnitFiles/cu" + GenerateID(Globle.CbtUnitID) + "/MediaFiles/" + pageid + "_HTMLTemplate_Preview.htm?r=" + Date.now();
}
function TidySection(sectionIndex, isCallSection) {
    isCallSection || (isCallSection = false);
    var fileList = new Array();
    var isFindWait = false;

    _.each(Globle.CurrentPageSectionCollection, function (item, index) {

        if (index < sectionIndex)
            return;
        if (isFindWait)
            return;


        if (index == 0) {
            //针对第一条字幕
            fileList.push({
                file: GenerateRequestURL(location.origin + "/lcms/CBTUnitFiles/" + decodeURIComponent(item.mp3Url).replace("../CBTUnitFiles/", "")),
                pindex: index,
                isLa: isCallSection
            });

            if (item.advanceSection == "wait") {

                isFindWait = true;

            }
        }
        else if (item.advanceSection == "wait") {
            fileList.push({
                file: GenerateRequestURL(location.origin + "/lcms/CBTUnitFiles/" + decodeURIComponent(item.mp3Url).replace("../CBTUnitFiles/", "")),
                pindex: index,
                isLa: isCallSection
            });

            isFindWait = true;
        }
        else {
            fileList.push({
                file: GenerateRequestURL(location.origin + "/lcms/CBTUnitFiles/" + decodeURIComponent(item.mp3Url).replace("../CBTUnitFiles/", "")),
                pindex: index,
                isLa: isCallSection
            });
        }

    });
    return fileList;
}
//载入当前页面的字幕，字幕如果有配音，那么自动播放配音
//播放完毕第一个后，切换到第二个字幕，并播放声音；
function LoadSection() {
    var trueLocation = GenerateRequestURL("/lcms/Files/OperateAnimationHTMLTemplate.ashx");
    $.ajax({
        url: trueLocation,
        dataType: 'json',
        data: {
            'actionType': 'loadSection',
            'unitItemID': parseInt(Globle.CurrentPageID),
            'loadAll': true,
            'rdm': Math.random()
        },
        success: function (result) {
            console.log(result);
            var trContent = '';
            switch (result.result) {
                case "error":
                    alert(opener.GetTranslateUI('TSubtitlesfailedtoload'));
                    return;
                    break;
                default:

            }
            if (result.length == 0) {
                //将上一页的字幕和发音清除
                $(".section").text('');
                jwplayer('player').pause();

                return;
            }

            //            //处理逻辑:
            //            //1. 如果每个字幕都没有声音,那么直接显示最后一个字幕即可;
            //            //2. 如果有个字幕有声音, 那么直接显示该字幕即可.
            //            var findHasSectionIndex = 0;
            //            var isFindHasMp3 = !1;
            //            _.each(result, function (item, index) {
            //                if (index % 2 == 1) {
            //                    if ($.trim(item.mp3Url) != "") {
            //                        findHasSectionIndex = index;
            //                    }
            //                    else {
            //                        isFindHasMp3 = !0;
            //                    }
            //                }
            //            });

            Globle.CurrentPageSectionCollection = result;
            //            if (isFindHasMp3)
            //                $(".section").text(decodeURIComponent(Globle.CurrentPageSectionCollection[result.length - 1].sectionText));
            //            else
            $(".section").text(decodeURIComponent(Globle.CurrentPageSectionCollection[0].sectionText));


            //            var fileList = TidySection(isFindHasMp3 && (findHasSectionIndex == 0 ? result.length - 2 : findHasSectionIndex - 1));
            var fileList = TidySection();
            jwplayer('player').load(fileList);
            jwplayer('player').play();
        },
        error: function (p1, p2, p3) {
            alert(p2 + '\r' + opener.GetTranslateUI('TSubtitlesfailedtoload') + ",Network error, please refresh and try again");
        }
    });
}

