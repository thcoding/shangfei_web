<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>商飞学习管理系统</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="../css/default.css">
        <link rel="stylesheet" type="text/css" href="../css/main.css">
        <link rel="stylesheet" type="text/css" href="../css/zTreeStyle/zTreeStyle.css">
        <link rel="stylesheet" type="text/css" href="../themes/icon.css">
            <link rel="stylesheet" type="text/css" href="../themes/default/easyui.css">    <script type="text/javascript" src="../js/jquery.min.js"></script>
                <script type="text/javascript" src="../js/jquery.easyui.min.js"></script>
                <script type="text/javascript" src="../js/jquery.min.js"></script>
                <script type="text/javascript" src="../js/jquery.ztree.all-3.5.min.js"></script>
                <script type="text/javascript" src="../js/function.js"></script>
                <script type="text/javascript" src="../js/navigation.js"></script>

                <?php
                session_start();
                include "../inc/config.php";
                setcookie(session_name(), session_id(), time() + $sessionTime, "/");
                if (!(isset($_SESSION["userid"]) && $_SESSION["userid"] != 0)) {
                    header("Location:../index.php");
                    exit();
                }

                include "../inc/mysql.php";
                include "../inc/function.php";
                include "../inc/navigation_admin.php";

                function getNodes($parentId) {
                    global $mysql;
                    $arrTemp = array();

                    $res = $mysql->query("select id,name,parentid from coursecategory where parentid=" . $parentId . " order by id");
                    $num = $mysql->num_rows($res);
                    while ($arr = $mysql->fetch_array($res)) {
                        $arr["open"] = true;
                        $arrTemp["children"][] = $arr;
                        $res2 = $mysql->query("select id,name,parentid from coursecategory where parentid=" . $arr["id"] . " order by id");
                        $num2 = $mysql->num_rows($res2);
                        echo $num2 . "aa ";
                        if ($num2 > 0) {
                            getNodes($arr["id"]);
                        }
                    }
                    return $arrTemp;
                }

//print_r(getNodes(7));
//die();

                $link = "courseUnit_for_courseCategory.php";

                @$id = $_GET["id"];
                @$catid = $_POST["catid"];

                $res = $mysql->query("select * from courseversion_rel_courseunitversion where coursecategoryid=" . $catid);
                $arr = $mysql->fetch_array($res);
                $courseUnitIds = $arr["courseunitids"];
                $courseUnitVersionIds = $arr["courseunitversionids"];
                $courseUnitGroupIds = $arr["courseunitgroupids"];


                $res = $mysql->query("select id,name from coursecategory where courseid=" . $id . " order by id"); //查找courseid下所有的一级目录
                while ($arr = $mysql->fetch_array($res)) {//取出一级目录
                    $arr["open"] = true;
                    $arr["catid"] = $arr["id"];
                    $res2 = $mysql->query("select id,name from coursecategory where parentid=" . $arr["id"] . " order by id"); //查找一级目录下的所有二级目录
                    $num2 = $mysql->num_rows($res2); //一级目录下二级目录的个数
                    if ($num2 == 0)
                        $arr["url"] = $link . "?catid=" . $arr["id"]; //二级目录个数为0，说明该一级目录为叶子节点，下一行while语句为false
                    while ($arr2 = $mysql->fetch_array($res2)) {//存在二级目录，继续按逻辑寻找三级目录
                        $arr2["open"] = true;
                        $arr2["catid"] = $arr2["id"];
                        $res3 = $mysql->query("select id,name from coursecategory where parentid=" . $arr2["id"] . " order by id");
                        $num3 = $mysql->num_rows($res3);
                        if ($num3 == 0)
                            $arr2["url"] = $link . "?catid=" . $arr2["id"];
                        while ($arr3 = $mysql->fetch_array($res3)) {
                            $arr3["open"] = true;
                            $arr3["catid"] = $arr3["id"];
                            $res4 = $mysql->query("select id,name from coursecategory where parentid=" . $arr3["id"] . " order by id");
                            $num4 = $mysql->num_rows($res4);
                            if ($num4 == 0)
                                $arr3["url"] = $link . "?catid=" . $arr3["id"];
                            while ($arr4 = $mysql->fetch_array($res4)) {
                                $arr4["open"] = true;
                                $arr4["catid"] = $arr4["id"];
                                $res5 = $mysql->query("select id,name from coursecategory where parentid=" . $arr4["id"] . " order by id");
                                $num5 = $mysql->num_rows($res5);
                                if ($num5 == 0)
                                    $arr4["url"] = $link . "?catid=" . $arr4["id"];
                                while ($arr5 = $mysql->fetch_array($res5)) {
                                    $arr5["open"] = true;
                                    $arr5["catid"] = $arr5["id"];
                                    $res6 = $mysql->query("select id,name from coursecategory where parentid=" . $arr5["id"] . " order by id");
                                    $num6 = $mysql->num_rows($res6);
                                    if ($num6 == 0)
                                        $arr5["url"] = $link . "?catid=" . $arr5["id"];
                                    while ($arr6 = $mysql->fetch_array($res6)) {
                                        $arr6["open"] = true;
                                        $arr6["catid"] = $arr6["id"];
                                        $res7 = $mysql->query("select id,name from coursecategory where parentid=" . $arr6["id"] . " order by id");
                                        $num7 = $mysql->num_rows($res7);
                                        if ($num7 == 0)
                                            $arr6["url"] = $link . "?catid=" . $arr6["id"];
                                        while ($arr7 = $mysql->fetch_array($res7)) {
                                            $arr7["open"] = true;
                                            $arr7["catid"] = $arr7["id"];
                                            $arr6["children"][] = $arr7;
                                        }
                                        $arr5["children"][] = $arr6;
                                    }
                                    $arr4["children"][] = $arr5;
                                }
                                $arr3["children"][] = $arr4;
                            }
                            $arr2["children"][] = $arr3;
                        }

                        $arr["children"][] = $arr2;
                    }

                    $node["children"][] = $arr;
                }

                @$nodes = "children:" . json_encode($node["children"], JSON_UNESCAPED_UNICODE);
                ?>

                <style type="text/css">
                    div#rMenu {position:absolute; visibility:hidden; top:0; background-color: #555;text-align: left;padding: 0px;


                    }

                    .ztree li span.button.add {margin-left:2px; margin-right: -1px; background-position:-144px 0; vertical-align:top; *vertical-align:middle}

                    div#rMenu div{margin:0;padding:0}
                    /**
                    div#rMenu ul li{
                        margin: 1px 0;
                        padding: 0 5px;
                        cursor: pointer;
                        list-style: none outside none;
                        background-color: #DFDFDF;
                        font-size:15px;
                    }
                    **/
                </style>

                <SCRIPT type="text/javascript">
                    <!--
                    var setting = {
                        view: {
                            addHoverDom: addHoverDom,
                            removeHoverDom: removeHoverDom,
                            selectedMulti: false
                        },
                        edit: {
                            enable: true,
                            editNameSelectAll: true,
                            showRemoveBtn: showRemoveBtn,
                            showRenameBtn: showRenameBtn
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            beforeDrag: beforeDrag,
                            beforeEditName: beforeEditName,
                            beforeRemove: beforeRemove,
                            beforeRename: beforeRename,
                            onRemove: onRemove,
                            onRename: onRename,
                            beforeClick: beforeClick
                        }
                    };

                    var zNodes = [
                        {id:<?php echo $id; ?>, name: "<?php echo $_GET['title']; ?>", open: true, isCourse: true,<?php echo $nodes; ?>}
                    ];
                    var log, className = "dark";
                    var jsoncontent = {"coursecategoryid": "null", "courseunitids": ",", "courseunitversionids": ",", "versionname": null, "versiondescription": null, "userid": null, "courseunitgroupids": ","}
                    var arrIds = new Array();
                    var catid;
                    function beforeClick(treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.selectNode(treeNode);
                        catid = treeNode.catid;
                        courseUnitVersionIds = ",";
                        $.ajax({
                            type: "POST",
                            url: "courseCategory_for_course_include.php",
                            data: "catid=" + catid,
                            dataType: "html",
                            success: function (msg) {
                                $("#nodecontent").html(msg);
                            }
                        });
                        $.ajax({
                            type: "POST",
                            url: "courseCategory_for_course_json_include.php",
                            data: "catid=" + catid,
                            dataType: "json",
                            success: function (msg) {

                                jsoncontent = msg;

                                if (!jsoncontent || !jsoncontent.courseunitversionids)
                                    courseUnitVersionIds = ",";
                                else
                                    courseUnitVersionIds = jsoncontent.courseunitversionids;
                            }
                        });
                        return true;

                    }
                    var courseUnitIds0 = courseUnitIds = jsoncontent.courseunitids ? jsoncontent.courseunitids : ",";
                    var courseUnitVersionIds0 = courseUnitVersionIds = jsoncontent.courseunitversionids ? jsoncontent.courseunitversionids : ",";
                    var courseUnitGroupIds0 = courseUnitGroupIds = jsoncontent.courseunitgroupids ? jsoncontent.courseunitgroupids : ",";
                    jsoncontent.coursecategoryid = catid;

                    var postType = 0;
                    function beforeDrag(treeId, treeNodes) {
                        return false;
                    }
                    function beforeEditName(treeId, treeNode) {
                        className = (className === "dark" ? "" : "dark");
                        showLog("[ " + getTime() + " beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.selectNode(treeNode);
                        var isCourse = zTree.getSelectedNodes()[0].isCourse ? 1 : 0;
                        if (isCourse) {
                            alert("请在课程属性中修改课程名。");
                            return false;
                        }
                        return confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？");
                    }
                    function beforeRemove(treeId, treeNode) {
                        className = (className === "dark" ? "" : "dark");
                        showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.selectNode(treeNode);
                        var isCourse = zTree.getSelectedNodes()[0].isCourse ? 1 : 0;
                        if (isCourse) {
                            alert("不能删除课程节点的。");
                            return false;
                        }
                        return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
                    }
                    function onRemove(e, treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.selectNode(treeNode);
                        var isCourse = zTree.getSelectedNodes()[0].isCourse ? 1 : 0;
                        if (isCourse) {
                            alert("不能删除课程节点的。");
                            return false;
                        }
                        var nodes = zTree.getSelectedNodes();


                        if (nodes && nodes.length > 0) {

                            if (nodes[0].children && nodes[0].children.length > 0) {
                                var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";

                                if (confirm(msg) == true) {
                                    zTree.removeNode(nodes[0]);
                                    var id = nodes[0].id;
                                    var name = "";
                                    var isCourse = 0;

                                    $.ajax({
                                        type: "POST",
                                        url: "saveCourseCategory.php",
                                        data: "id=" + id + "&name=" + name + "&isCourse=" + isCourse + "&type=delete",
                                        success: function (msg) {
                                        }
                                    });
                                }
                            } else {

                                zTree.removeNode(nodes[0]);
                                var id = nodes[0].id;
                                if (!id)
                                    id = nodes[0].catid;
                                var name = "";
                                var isCourse = 0;
                                $.ajax({
                                    type: "POST",
                                    url: "saveCourseCategory.php",
                                    data: "id=" + id + "&name=" + name + "&isCourse=" + isCourse + "&type=delete",
                                    success: function (msg) {
                                    }
                                });
                            }
                        }
                    }
                    function beforeRename(treeId, treeNode, newName, isCancel) {
                        className = (className === "dark" ? "" : "dark");

                        if (newName.length == 0) {
                            alert("节点名称不能为空.");
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                            setTimeout(function () {
                                zTree.editName(treeNode)
                            }, 10);
                            return false;
                        }
                        return true;
                    }
                    function onRename(e, treeId, treeNode, isCancel) {
                        var id = treeNode.id;
                        if (!id)
                            id = treeNode.catid;
                        var name = treeNode.name;
                        var isCourse = 0;
                        $.ajax({
                            type: "POST",
                            url: "saveCourseCategory.php",
                            data: "id=" + id + "&name=" + name + "&isCourse=" + isCourse + "&type=update",
                            success: function (msg) {
                            }
                        });

                    }

                    function showRemoveBtn(treeId, treeNode) {
                        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                        var sNodes = treeObj.getNodes();
                        if (sNodes.length > 0) {
                            var node = sNodes[0];
                            if(node==treeNode){
                                return false;
                            }else{
                                return true;
                            }
                        }
                        else {
                            return true;
                        }
                        //return !treeNode.isParent;
                    }
                    function showRenameBtn(treeId, treeNode) {
                        return true;
                        //return !treeNode.isLastNode;
                    }
                    function showLog(str) {
                        if (!log)
                            log = $("#log");
                        log.append("<li class='" + className + "'>" + str + "</li>");
                        if (log.children("li").length > 8) {
                            log.get(0).removeChild(log.children("li")[0]);
                        }
                    }
                    function getTime() {
                        var now = new Date(),
                                h = now.getHours(),
                                m = now.getMinutes(),
                                s = now.getSeconds(),
                                ms = now.getMilliseconds();
                        return (h + ":" + m + ":" + s + " " + ms);
                    }

                    var newCount = 1;
                    function addHoverDom(treeId, treeNode) {

                        var sObj = $("#" + treeNode.tId + "_span");
                        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
                            return;
                        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                                + "' title='add node' onfocus='this.blur();'></span>";
                        sObj.after(addStr);
                        var btn = $("#addBtn_" + treeNode.tId);
                        if (btn)
                            btn.bind("click", function () {
                                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                                zTree.selectNode(treeNode);

                                var name = "自定义章节";
                                var isCourse = zTree.getSelectedNodes()[0].isCourse ? 1 : 0;
                                var id = zTree.getSelectedNodes()[0].id;
                                if (!id)
                                    id = zTree.getSelectedNodes()[0].catid;
                                var nodeId;//id与catid有重复之嫌，可以改掉，此时为空，在数据库保存时才会产生一个id值，通过ajax返回
                                //url已被废，可以全部删掉
                                var newNode = {name: name, id: nodeId, url: "courseUnit_for_courseCategory.php?catid=" + nodeId};

                                if (zTree.getSelectedNodes()[0]) {
                                    newNode.checked = zTree.getSelectedNodes()[0].checked;
                                    zTree.addNodes(zTree.getSelectedNodes()[0], newNode);

                                } else {
                                    zTree.addNodes(null, newNode);
                                }
                                $.ajax({
                                    type: "POST",
                                    async: false,
                                    url: "saveCourseCategory.php",
                                    data: "id=" + id + "&name=" + name + "&isCourse=" + isCourse + "&type=add",
                                    success: function (msg) {
                                        nodeId = msg;//返回节点catid
                                        nds = zTree.getSelectedNodes()[0].children;
                                        nds[nds.length - 1].catid = nodeId;//取新增节点的id
                                    }
                                });
                                return false;
                            });
                    }
                    ;
                    function removeHoverDom(treeId, treeNode) {
                        $("#addBtn_" + treeNode.tId).unbind().remove();
                    }
                    ;
                    function selectAll() {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
                    }
                    function setIframeSrc(type) {
                        postType = type;
                        if (type == 13) {
                            $("#pager_list").attr("src", "courseUnitlist.php");
                        } else {
                            $("#pager_list").attr("src", "courseUnitGroupList.php");
                        }
                        $(".div_Mask").show();
                        $(".div_wait").show();
                    }
                    function f_remove(type, cuid, id) {
                        //if(confirm("确定要移除吗？")){
                        $.ajax({
                            type: "GET",
                            url: "delete.php",
                            data: "type=" + type + "&cuid=" + cuid + "&id=" + id,
                            success: function (msg) {
                                //$("body").html(msg);
                            }
                        });
                        //}
                    }

                    $(function () {

                        $.fn.zTree.init($("#treeDemo"), setting, zNodes);

                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");


                        $(window).scroll(function () {
                            $("#footer").css({"left": "0", "bottom": "0"});
                        });

                        $("#div_wait button").click(function () {

                            if ($(this).html() == "确定") {
                                /*$("#pager_list").contents().find("input[type='checkbox']:checked").each(function(){
                                 alert($(this).val());
                                 })*/

                                //courseUnitIds是从json中获取的
                                //alert("type="+postType+"&courseUnitVersion="+courseUnitVersionIds+"&courseUnitGroup="+courseUnitGroupIds+"&toCourseCategoryId="+catid);
                                $.ajax({
                                    type: "POST",
                                    url: "fenpei.php",
                                    data: "type=" + postType + "&courseUnit=" + courseUnitIds + "&courseUnitVersion=" + courseUnitVersionIds + "&courseUnitGroup=" + courseUnitGroupIds + "&toCourseCategoryId=" + catid,
                                    success: function (msg) {
                                        $(".div_Mask").hide();
                                        $(".div_wait").hide();
                                        $("#nodecontent").html("<div>添加成功</div>");


                                    }
                                });
                            } else {
                                //似乎没有用
                                // courseUnitIds = courseUnitIds0;
                                // courseUnitVersionIds = courseUnitVersionIds0;
                                // courseUnitGroupIds = courseUnitGroupIds0;
                                $(".div_Mask").hide();
                                $(".div_wait").hide();
                            }
                        });
                        $("#pager_list").load(function () {

                            //是否应该选中
                            $("#pager_list").contents().find(".item_check").each(function () {
                                //alert(courseUnitIds.indexOf(","+$(this).val()+","));
                                if (courseUnitIds.indexOf("," + $(this).val() + ",") > -1) {
                                    $(this).attr("checked", true);
                                }
                            })
                            $("#pager_list").contents().find(".subitem_check").each(function () {
                                //alert(courseUnitIds.indexOf(","+$(this).val()+","));
                                if (courseUnitVersionIds.indexOf("," + $(this).val() + ",") > -1) {
                                    $(this).attr("checked", true);
                                }
                            })
                            //新的选择
                            $("#pager_list").contents().find(".item_check").click(function () {
                                if ($(this).is(':checked')) {
                                    //alert($(this).val());
                                    courseUnitIds += $(this).val() + ",";
                                } else {
                                    courseUnitIds = courseUnitIds.replace("," + $(this).val() + ",", ",");
                                }
                            })
                            $("#pager_list").contents().find(".subitem_check").click(function () {
                                if ($(this).is(':checked')) {

                                    courseUnitVersionIds += $(this).val() + ",";
                                    //alert(courseUnitVersionIds);
                                    //alert($(this).val());
                                    $(this).parent("label").siblings().children(".subitem_check").each(function () {
                                        if (this.checked) {
                                            this.checked = false;
                                            courseUnitVersionIds = courseUnitVersionIds.replace("," + $(this).val() + ",", ",");
                                        }
                                    });
                                } else {
                                    courseUnitVersionIds = courseUnitVersionIds.replace("," + $(this).val() + ",", ",");
                                }
                            })
                        });
                    });


                </SCRIPT>
                </head>
                <body>
                    <div class="div_Mask" id="div_Mask"></div>
                    <div class="div_wait" id="div_wait" style="position: absolute;left: 50%;top: 10%;width: 800px;margin-left: -400px;height:530px;max-height:530px;overflow:hidden"><div class="div_pager_list" id="div_pager_list">
                            <iframe name="pager_list" id="pager_list" src="" width="800px" height="500px;" frameborder="0"></iframe></div><div style="text-align:center"><button>确定</button> <button>取消</button></div></div>
                    <div id="wrapper">

                        <div class="clear">&nbsp;</div>
                        <div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
                            <!--   Begin Of script Output   -->
                            <div id="content" class="maxcontent">

                                <div id="content_with_menu">
                                    <div id="container" style="padding: 0px">


                                        <div id="p" class="easyui-panel" title="课程详情" style="width:735px;height:500px;padding: 10px" data-options="footer:'#ft'">
                                            <div class="easyui-layout" data-options="fit:true">
                                                <div data-options="region:'west',split:true" style="width:350px;padding:5px;">
                                                    <div style="color: green;padding-left: 15px;font-size: 110%"><img src="../img/helps.png" title="帮助信息">&nbsp;&nbsp; 通过添加节点组织课程:</div>
                                                    <ul id="treeDemo" class="ztree" style="font-size:20px;border: 0px;margin-top: 0px; overflow-y: auto;background-color: #ffffff;"></ul>
                                                </div>
                                                <div id="nodecontent" data-options="region:'center'" style="padding:10px">
                                                    <div>本课程详细信息：</div>


                                                </div>
                                            </div>
                                        </div>
                                        <div id="ft" style="padding:5px;">
                                            中国商飞
                                        </div>
                                    </div>
                                </div>
                            </div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
                        </div> <!-- end of #main" started at the end of banner.inc.php -->

                        <div class="push"></div>
                    </div> <!-- end of #wrapper section -->


                    <!--
                    <div id="rMenu">
                    
                    
                        <ul >
                            <li id="m_add" onclick="addTreeNode();">增加目录节点</li>
                            <li id="m_del" onclick="removeTreeNode();">删除目录节点</li>
                            <li id="m_rename" onclick="editTreeNode();">重命名</li>
                        </ul>
                    </div>
                    -->
<?php include "../inc/footer.php"; ?>

                </body>

                </html>
