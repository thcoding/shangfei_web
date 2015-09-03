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
<script type="text/javascript" src="../js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="../js/navigation.js"></script>
 
<script type="text/javascript">
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });       
    });
	function copy(id){
		$.ajax({				
			type: "POST",
			url: "copy.php",
			data:"id="+id,
			success:function(msg){
				//$("body").html(msg);
				alert("复制成功！");
				location.reload();
			}
		});
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
include "../inc/function.php";
include "../inc/navigation_admin.php";
?>
    <script type="text/javascript">
        $(function(){
           $("#sel_order").change(function(){
              $("#btn_search").click();
           });
        });
    </script>
<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">课程列表 &nbsp; <a href="courseAdd.php"><img src="../img/add_course.png" width="30" title="创建课程" alt="创建课程"></a></div>
			<div class="wrap">
				<form action="" method="get">
					<?php
					//初始化相关参数
					$searchType = isset($_GET["searchType"])?$_GET["searchType"]:1;
					$startTime = isset($_GET["startTime"])?$_GET["startTime"]:"";
					$endTime = isset($_GET["endTime"])?$_GET["endTime"]:"";
					//通过关键字搜索相关课程
					$keyword = isset($_GET["k"])?$_GET["k"]:"";?>						 
					<?php
					//获取当前排序方式
					$order = isset($_GET["order"])?$_GET["order"]:1;					
					?>
				<table border='1' width='100%' cellspacing='0' cellpadding='0'>
				<tr>
					<td colspan="2">
					<input name="k" value="<?php echo $keyword;?>" type="text" placeholder="请输入关键字...">
					<button id="btn_search" type="submit">搜索课程</button>
					</td>
				</tr>
				<tr>
					<td colspan="2"><label><input type="radio" name="searchType" value=1 <?php if($searchType==1){					
					?>checked<?php } ?>>按课程名</label> <label><input type="radio" name="searchType" value=2 <?php if($searchType==2){	
					?>checked<?php } ?>>按课程类别</label><label><input type="radio" name="searchType" value=3 <?php if($searchType==3){	
					?>checked<?php } ?>>按创建者</label><label><input type="radio" name="searchType" value=4 <?php if($searchType==4){	
					?>checked<?php } ?>>按创建时间(格式:年-月-日，可缺省)</label></td>
				</tr>
				<tr>
					<td colspan="2">请选择课程有效区间</td>
				</tr>
				<tr>
					<td>课程开始时间：</td>
					<td><input style="width:250px;" type="text" name="startTime" id="title" value="<?php echo $startTime;?>" class="Wdate" onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"></td>
				</tr>
				<tr>
					<td>课程结束时间：</td>
					<td><input style="width:250px;" type="text" name="endTime" id="title" value="<?php echo $endTime;?>" class="Wdate" onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"></td>
				</tr>
			</table>			
				</form>
			</div>
			<div class="wrap">
			<?php
			include "../inc/class/page_course.php";//呈现课程列表
			$page_course = new page();//初始化课程列表页面

			$self = $_SERVER["PHP_SELF"];
			$userid = 0;
			if($_SESSION["role"]==ADMIN){
				if(isset($_GET["userid"])) $userid = $_GET["userid"];
			}else{
				$userid = $_SESSION["userid"];
			}

			$linkPage = "$self";
			//$userid = isset($_GET["userid"])?$_GET["userid"]:0;
			$page_course->fenye($page,$order,$linkPage,$userid,$keyword,$searchType,$startTime,$endTime);//课程列表页面实现分页功能
			?>
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
