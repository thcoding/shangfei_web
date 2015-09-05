<!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <?php 
//TODO: delete php code in this page
    session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../index.php");
	exit();
}
?>

<head>
<title>商飞学习管理系统</title>

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="../css/default.css">
<link rel="stylesheet" type="text/css" href="../css/main.css">
<link rel="stylesheet" type="text/css" href="../themes/icon.css">
<link rel="stylesheet" type="text/css" href="../themes/default/easyui.css">
        
<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript" src="../js/function.js"></script>
<script type="text/javascript" src="../js/slides.min.jquery.js"></script>
<script type="text/javascript" src="../js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="../js/jquery.min.js"></script>
<script type="text/javascript" src="../js/navigation.js"></script>

<script type="text/javascript">
        (function ($) {
           try {
                var a = $.ui.mouse.prototype._mouseMove; 
                $.ui.mouse.prototype._mouseMove = function (b) { 
                b.button = 1; a.apply(this, [b]); 
                } 
            }catch(e) {}
        } (jQuery));
    </script>
 
<script type="text/javascript">
    var cid_arr = [];
    var uid_arr = [];
    var getCidArr = function() {
        return cid_arr;
    }
    var getUidArr = function() {
        return uid_arr;
    }
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       }); 
       $("#distribute").click(function(){
           //课程组
           course_ids = [];
           for (var i in cid_arr) {
               if (cid_arr[i] == "") continue;
               course_ids.push(i);
           }
           if (course_ids.length == 0) {
               alert("请至少选择一个课程。");
               return;
           }
           //用户组
           user_ids = [];
           for (var i in uid_arr) {
               if (uid_arr[i] == "") continue;
               user_ids.push(i);
           }
           if (user_ids.length == 0) {
               alert("请至少选择一个用户。");
               return;
           }
           $.post("course_to_user_confirm.php",
           {course_ids:course_ids, user_ids:user_ids},
           function(result, status) {
              if (status !== "success"){
                  alert("网络不正常哟");
                  return;
              } 
              result = $.parseJSON(result);
              if (result['status'] != 200) {
                  alert("服务器有点问题，请于开发人员联系 T.T, 失败代码：" + result['status']);
                  return;
              }
              alert("分配成功！");
           });
       });
    });
    


add_window = null;
var save_courseids = function() {
    var cidstr = ",";
    $("#course_list li input").each(function(){
        if (this.checked){
            cidstr += this.value + ",";
        }
    })
    $("#cids").text(cidstr);
}
var save_course_groupids = function() {
    var cgidstr = ",";
    $("#course_group_list li input").each(function(){
        if (this.checked){
            cgidstr += this.value + ",";
        }
    })
    $("#cgids").text(cgidstr);
}
var save_userids = function() {
    var uidstr = ",";
    $("#user_list li input").each(function(){
        if (this.checked){
            uidstr += this.value + ",";
        }
    })
    $("#uids").text(uidstr);
}
var save_user_groupids = function() {
    var ugidstr = ",";
    $("#user_group_list li input").each(function(){
        if (this.checked){
            ugidstr += this.value + ",";
        }
    })
    $("#ugids").text(ugidstr);
}

var open_page = function(type) {
    page_title = "";
    if (type === "course") {
        save_courseids();
        page_title = "添加课程";
    } else if (type === "course_group") {
        save_course_groupids();
        page_title = "添加课程组";
    } else if (type === "user") {
        save_userids();
        page_title = "添加用户";
    } else if (type === "user_group") {
        save_user_groupids();
        page_title = "添加用户组";
    }
    if (add_window != null) add_window.close();
    var iWidth=600; //弹出窗口的宽度;
    var iHeight=600; //弹出窗口的高度
    var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
    add_window = window.open('course_choose_item.php?type=' + type, 
                             page_title, 
                             'width=' + iWidth + ',height=' + iHeight + ', top=' + iTop + ', left=' + iLeft + ', scrollbars=yes');
}
//handle checked data from open window
var page_submit = function(type, id_arr) {
    
    if (type == "course_group" || type == "user_group") {
        typelist = type.substr(0, type.indexOf('_')) + "_list";
    } else {
        typelist = type + "_list";
    }
    $("#" + typelist).empty();
    for (var i in id_arr) {
        if (id_arr[i] == "") continue;
        $("#" + typelist).prepend("<li><input type='checkbox' checked='true' value='" + i + "'/><span>" + id_arr[i] + "</span></li>");
    }
    if (type == "course" || type == "course_group") {
        cid_arr = id_arr;
        $("#" + typelist + " li input:checkbox").click(function(){
            id = this.value;
            if (this.checked) {
                cid_arr[id] = $(this).next().html();
            } else {
                cid_arr[id] = "";
            }
        });
    } else if (type == "user" || type == "user_group") {
        uid_arr = id_arr;
        $("#" + typelist + " li input:checkbox").click(function(){
            id = this.value;
            if (this.checked) {
                uid_arr[id] = $(this).next().html();
            } else {
                uid_arr[id] = "";
            }
        });
    }
    
}

</script>
</head>
<body>
    <?php


include "../inc/navigation_admin.php";
?>
<div id="wrapper">


<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="cids" style="visibility: hidden;"></div>
<div id="uids" style="visibility: hidden;"></div>
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
		<div class="info">将课程（组）分配到用户（组）</div>
            <div id="cc" class="easyui-layout"  style="width:700px;height:500px;">
                <div data-options="region:'west'" style="padding:1px; width:49%; ">
                    <div class="easyui-panel" title="课程列表" style="width:100%;height:100%;padding:2px; "
                        data-options="iconCls:'icon-save',closable:false,tools:'#tool_course'">
                        <ul id="course_list" style='list-style-type:none; margin:1px; padding:5px;'>
                        </ul>
                    </div>
                    <div id="tool_course">
                        <a href="javascript:void(0)" class="icon-add easyui-tooltip"  title="添加课程" onclick="open_page('course');"></a>
                        <a href="javascript:void(0)"  class="icon-add-group easyui-tooltip" title="添加课程组" onclick="open_page('course_group');"></a>
                    </div>
                </div>
                <div data-options="region:'center'" style="padding:1px; width:49%;">
                    <div class="easyui-panel" title="用户列表" style="width:100%;height:100%;padding:2px; "
                        data-options="iconCls:'icon-save',closable:false,tools:'#tool_user'">
                        <ul id="user_list" style='list-style-type:none; margin:1px; padding:5px;' >
                        </ul>
                    </div>
            
                     <div id="tool_user">
                        <a href="javascript:void(0)" class="icon-add easyui-tooltip" title="添加用户" onclick="open_page('user');"></a>
                        <a href="javascript:void(0)" class="icon-add-group easyui-tooltip" title="添加用户组" onclick="open_page('user_group');"></a>
                    </div>
                </div>
                <div data-options="region:'south'" style="height:40px;">
                    <div style="text-align:center"><button id="distribute" >确定分配</button></div>
                </div>
            </div>
            <div class="clear"></div>
		</div><!-- container -->
	</div>
</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
