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
<script type="text/javascript" src="../js/function.js"></script>
<script type="text/javascript" src="../js/slides.min.jquery.js"></script>
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
include "../inc/admin_header_in_admindir_for_coursenav.php";
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
		<div class="info">课程（组）分配到课程组</div>
		<form action="fenpei.php?type=2" method="post">
			<div class="fenpei_dk fl">
				<span>课程组</span>
				<div style="max-height:210px;overflow-y: auto; overflow-x:hidden;">
					<div class="list" id="groupList">				
					<ul>
					<?php
						if($_SESSION["role"]==ADMIN){
							$whereRole = "";
						}else{
							$whereRole = "and userid=".$_SESSION["userid"];
						}
						$res = $mysql->query("select * from `group` where deleted=0 and type=3 $whereRole order by time desc");
						while($arr = $mysql->fetch_array($res)){
							echo "<li title='创建日期：$arr[time]'><input type='checkbox' name='courseGroup[]' value='$arr[id]'><img src='../img/no-expanded.gif' id=$arr[id] type=2> ".$arr["title"]."</li>";							
						}
					?>
					</ul>
					</div>
				</div>

				<span>全部课程</span>
				<div style="max-height:210px;overflow-y: auto; overflow-x:hidden;">
					<div class="list">				
					<ul>
					<?php
						$res = $mysql->query("select * from course where deleted=0 $whereRole order by time desc");
						while($arr = $mysql->fetch_array($res)){
							echo "<li title='创建日期：$arr[time]'><label><input type='checkbox' name='course[]' value='$arr[id]'>".$arr["title"]."</label></li>";
						}
					?>
					</ul>
					</div>
				</div>
			</div>
			
			<img src="../img/arrow_right.jpg" width="120" style="margin-top:180px;">
			<div class="fenpei_dk fr">
				<span>课程组</span>
				<div style="max-height:440px;overflow-y: auto; overflow-x:hidden;">
					<div class="list">					
					<ul>
					<?php
						$res = $mysql->query("select * from `group` where deleted=0 and type=3 $whereRole order by time desc");
						while($arr = $mysql->fetch_array($res)){
							echo "<li title='创建日期：$arr[time]'><label><input type='checkbox' name='toCourseGroup[]' value='$arr[id]'>".$arr["title"]."</label></li>";
						}
					?>
					</ul>
					</div>
				</div>
			</div>
			
			<div class="clear"></div>
			<div style="text-align:center"><button type="submit">确定分配</button></div>
		</form>
		</div><!-- container -->
	</div>
</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
