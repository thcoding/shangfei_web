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
setcookie(session_name(),session_id(),time()+600,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:index.php");
	exit();
}

include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/student_header_in_studentdir.php";
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
		
			<div class="info">【<?php echo $_GET["title"];?>】所含有的课程列表</div>
			<div class="list_courseUnit">
			<ul>
			<?php

				$res = $mysql->query("select * from coursegroup where groupid=".$_GET["id"]);
				$arr = $mysql->fetch_array($res);
				$ids = substr($arr["courseids"],1,-1);
				//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
				$res = $mysql->query("select * from course where deleted=0 and id in ($ids) order by time desc");
				$time = date("Y-m-d H:i:s");
				while($arr = $mysql->fetch_array($res)){
					if($arr["starttime"]>$time){
						echo "<li><a href='javascript:;' onclick='alert(\"课程未开始\")'>".$arr["title"]."</a> 【未开始】</li>";
					}else if($arr["starttime"]<=$time && $arr["endtime"]>=$time){
						echo "<li><a href='courseUnit_for_course.php?id=$arr[id]&title=$arr[title]'>".$arr["title"]."</a> 【进行中】</li>";
					}else if($arr["endtime"]<$time){
						echo "<li><a href='javascript:;' onclick='alert(\"课程已过期\")'>".$arr["title"]."</a> 【已过期】</li>";
					}
				}
			?>
			</ul>
			</div>

			<div class="info">【<?php echo $_GET["title"];?>】所含有的课程组列表</div>
			<div class="list_courseUnit">
			<ul>
			<?php

				$res = $mysql->query("select * from coursegroup where groupid=".$_GET["id"]);
				$arr = $mysql->fetch_array($res);
				$ids = substr($arr["coursegroupids"],1,-1);
				//die("select * from group where deleted=0 and id in ($ids) order by time desc");
				$res = $mysql->query("select * from `group` where deleted=0 and id in ($ids) order by time desc");
				while($arr = $mysql->fetch_array($res)){
					echo "<li><a href='course_for_group.php?id=$arr[id]&title=$arr[title]'>".$arr["title"]."</a></li>";
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
