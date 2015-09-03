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
/*]]>*/
</style>

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript" src="../js/slides.min.jquery.js"></script>
 
<script type="text/javascript">
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });
	   $("#title").focus();
    });
	function checkScorm(){
		if($("#user_file").val()==""){
			alert("请选择文件");
			$("#user_file").focus();
			return false;
		}
		return true;
	}
</script>
</head>
<body>

<div id="wrapper">

<?php 
session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../index.php");
	exit();
}

include "../inc/mysql.php";
include "../inc/admin_header_in_admindir_for_courseunitnav.php";
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">导入Scorm/Aicc</div>
			<div class="list_courseUnit">
			<br>
			<br>
			<form action="scorm/lp_upload.php" method="post" enctype="multipart/form-data" onsubmit="return checkScorm()">
				请选择课程单元包：<input type="file" name="file" id="user_file">
				<button type="submit">上传</button>				
			</form>
			<img style="float:right;" src='../img/instructor-projection.png'>
			</div>
		</div>
	</div>

<div class="menu" id="menu">

<div class="create_portal">
<ul>
<li><a href="courseUnit.php">课程单元</a></li>
<li><a href="courseUnitGroup.php">课程单元组</a></li>
</ul>
</div>

</div></div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
