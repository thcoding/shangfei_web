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
<script type="text/javascript" src="../js/navigation.js"></script>
 
<script type="text/javascript">
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });       
    });
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
include "../inc/function.php";
include "../inc/navigation_admin.php";
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">课程组 &nbsp; <a href="courseGroupAdd.php"><img src="../img/add_coursegroup.png" width="30" title="创建课程组" alt="创建课程组"></a></div>
			<div class="list_courseUnit">
			<ul>
			<?php
				if($_SESSION["role"]==ADMIN){
					$whereRole = "";
				}else{
					$whereRole = "and userid=".$_SESSION["userid"];
				}
				$res = $mysql->query("select * from `group` where deleted=0 and type=3 $whereRole order by time desc");
				while($arr = $mysql->fetch_array($res)){
					$userinfo = getUserinfoById($arr["userid"]);
					echo "<li><span><a href='courseGroupAdd.php?id=$arr[id]&title=$arr[title]'><img src='../img/edit.png'></a> <a href='delete.php?type=41&id=$arr[id]'><img src='../img/delete.png'></a></span><a href='course_for_group.php?id=$arr[id]&title=$arr[title]'>".$arr["title"]."</a> <span title='创建者'>【".$userinfo["realname"]."】</span></li>";
				}
			?>
			</ul>
			</div>
		</div>
	</div>
</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
