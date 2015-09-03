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
	function f_remove(type,cid,id){
		//if(confirm("确定要移除吗？")){
			$.ajax({				
				type: "GET",
				url: "delete.php",
				data:"type="+type+"&cid="+cid+"&id="+id,
				success:function(msg){
					//$("body").html(msg);
				}
			});
		//}
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
include "../inc/navigation_admin.php";
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
		
			<div class="info">【<?php echo $_GET["title"];?>】的课程列表</div>
			<div class="list_courseUnit">
			<ul>
			<?php
				$rel_userid = $_GET["id"];
				$res = $mysql->query("select * from user_rel_course where userid=".$_GET["id"]);
				$arr = $mysql->fetch_array($res);
				$ids = substr($arr["courseids"],1,-1);
				//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
				$res = $mysql->query("select * from course where deleted=0 and id in ($ids) order by time desc");
				while($arr = $mysql->fetch_array($res)){
					echo "<li><span><a href='javascript:;' onclick='if(confirm(\"确定要移除吗？\")){f_remove(52,$arr[id],$_GET[id]);$(this).parent().parent().remove();}'><img src='../img/delete.png'></a></span><a href='courseCategory_for_course_rel_user.php?id=$arr[id]&title=$arr[title]&rel_userid=$rel_userid'>".$arr["title"]."</a></li>";
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
