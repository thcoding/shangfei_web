<!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>商飞学习管理系统</title>

<style type="text/css" media="screen, projection">
/*<![CDATA[*/
@import "../css/default.css";
@import "../css/main.css";
@import "../css/zTreeStyle/zTreeStyle.css";
/*]]>*/
</style>

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="../themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../themes/icon.css">

    <script type="text/javascript" src="../js/jquery.min.js"></script>
    <script type="text/javascript" src="../js/jquery.easyui.min.js"></script>


<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript" src="../js/function.js"></script>
<script type="text/javascript" src="../js/slides.min.jquery.js"></script>

<script type="text/javascript">
    function LaunchDueItem(id) {

            var url = '../admin/scorm/lp_view.php?id=' + id;
            var name = 'lp_view';
            var specs = 'menubar=no,toolbar=no,location=no,status=no,directories=no,history=no,resizable=yes';
            var subWin = window.open(url, name, specs);
            if (subWin) {
                subWin.focus();
                subWinTime = new Date();
                // $.blockUI();
                // idOfSetInterval = setInterval("checkSubWin();", 1000);
            } else {
                alert('Your browser prevented opening a take course window.\r\n\r\nPlease Modify your browser settings.');
            }


    }
</script>
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
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });
    });
	function f_remove(type,cuid,id){
		//if(confirm("确定要移除吗？")){
			$.ajax({				
				type: "GET",
				url: "delete.php",
				data:"type="+type+"&cuid="+cuid+"&id="+id,
				success:function(msg){
					//$("body").html(msg);
				}
			});
		//}
	}
</script>

<?php 
session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+600,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../index.php");
	exit();
}
$_SESSION["courseid"]=$_GET["id"];

include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/student_header_in_studentdir.php";



?>

<style type="text/css">
div#rMenu {position:absolute; visibility:hidden; top:0; background-color: #555;text-align: left;padding: 2px;}
div#rMenu ul{margin:0;padding:0}
div#rMenu ul li{
	margin: 1px 0;
	padding: 0 5px;
	cursor: pointer;
	list-style: none outside none;
	background-color: #DFDFDF;
	font-size:16px;
}
</style>

<SCRIPT type="text/javascript">
</SCRIPT>

</head>
<body>

<div id="wrapper">
<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent" style="width:1050px ">

	<div>

		<div class="info">课程目录 &nbsp;</div>
            <table title="Folder Browser" class="easyui-treegrid" style="width:1030px;height:500px"
                   data-options="
				url: '../inc/getcoursetree.php',
				method: 'get',
				rownumbers: false,
				idField: 'id',
				treeField: 'name'
			">
                <thead>
                <tr>
                    <th data-options="field:'name'" width="300">目录</th>
                    <th data-options="field:'status'" width="100" align="left">状态</th>
                    <th data-options="field:'totaltime'" width="100" align="left">总时间</th>
                    <th data-options="field:'score'" width="100">分数</th>
                    <th data-options="field:'viewcount'" width="70" >学习次数</th>
                    <th data-options="field:'lasttime'" width="130">上次访问</th>
                    <th data-options="field:'remark'" width="100" >备注</th>
                    <th data-options="field:'itemurl'" width="100">进入学习</th>




                </tr>
                </thead>
            </table>





	</div>
<!--
<div class="menu" id="menu">

<div class="create_portal">
<ul>
<li><a href="mycourse.php">我的课程</a></li>
<li><a href="mycourse_in.php">进行中的课程</li>
<li><a href="mycourse_undo.php">未开始的课程</li>
<li><a href="mycourse_expire.php">已过期的课程</li>
</ul>
</div>

</div></div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
-->
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
