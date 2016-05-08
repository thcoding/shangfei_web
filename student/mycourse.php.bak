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
<script type="text/javascript" src="../js/My97DatePicker/WdatePicker.js"></script>
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
</script>
</head>
<body>

<div id="wrapper">

<?php 
session_start();
setcookie(session_name(),session_id(),time()+600,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../index.php");
	exit();
}

include "../inc/mysql.php";
include "../inc/config.php";
include "../inc/function.php";
include "../inc/navigation_student.php";
$status=isset($_GET["status"])?$_GET["status"]:0;
if($status<4){
   $type="course";
}else{
    $type="exam";
}

?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">
                <?php
                if($type=="course") {
                echo"我的课程列表";}else{
                echo"我的考试列表";
                }
                ?>
            </div>
			<div class="wrap">
				<form action="" method="get">
					<?php
					//初始化相关参数
					$searchType = isset($_GET["searchType"])?$_GET["searchType"]:1;
					$startTime = isset($_GET["startTime"])?$_GET["startTime"]:"";
					$endTime = isset($_GET["endTime"])?$_GET["endTime"]:"";
					$status = isset($_GET["status"])?$_GET["status"]:0;
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
					<button id="btn_search" type="submit">
                        <?php
                        if($type=="course") {
                            echo"搜索课程";}else{
                            echo"搜索考试";
                        }
                        ?>
                        </button>
					</td>
				</tr>
				<tr>
					<td colspan="2"><label><input type="radio" name="searchType" value=1 <?php if($searchType==1){					
					?>checked<?php } ?>>
                            <?php
                            if($type=="course") {
                                echo"按课程名";}else{
                                echo"按考试名";
                            }
                            ?></label>
                        <?php
                        if($type=="course"){
                            echo '<label><input type="radio" name="searchType" value=2 > 按课程类别</label>';
                            if($searchType==2) {
                                echo '<label><input type="radio" name="searchType" value=2 checked> 按课程类别</label>';
                            }
                            }else{
                        }
                        ?><label><input type="radio" name="searchType" value=3 <?php if($searchType==3){
					?>checked<?php } ?>>按创建者</label><label><input type="radio" name="searchType" value=4 <?php if($searchType==4){	
					?>checked<?php } ?>>按创建时间(格式:年-月-日，可缺省)</label></td>
				</tr>
				<tr>
					<td colspan="2"><?php
                        if($type=="course") {
                            echo"请选择课程有效区间";}else{
                            echo"请选择考试有效区间";
                        }
                        ?></td>
				</tr>
				<tr>
					<td>
                        <?php
                        if($type=="course") {
                            echo"课程开始时间：";}else{
                            echo"考试开始时间：";
                        }
                        ?>
                        </td>
					<td><input style="width:250px;" type="text" name="startTime" id="title" value="<?php echo $startTime;?>" class="Wdate" onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"></td>
				</tr>
				<tr>
					<td><?php
                        if($type=="course") {
                            echo"课程结束时间：";}else{
                            echo"考试结束时间：";
                        }
                        ?></td>
					<td><input style="width:250px;" type="text" name="endTime" id="title" value="<?php echo $endTime;?>" class="Wdate" onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"></td>
				</tr>
			</table>			
				</form>
			</div>
			<div class="wrap">
			<ul>
			<?php
			include "page_course.php";//呈现课程列表
			$page_course = new page();//初始化课程列表页面

			$self = $_SERVER["PHP_SELF"];
			$userid = $_SESSION["userid"];

			$linkPage = "$self";
			//$userid = isset($_GET["userid"])?$_GET["userid"]:0;
            $typeflag=0;
            if($type=="course") {
                $typeflag=1;}else{
                $typeflag=2;
            }
			$page_course->fenye($page,$order,$linkPage,$userid,$keyword,$searchType,$startTime,$endTime,$status,$typeflag);//课程列表页面实现分页功能
			?>
			</ul>
			</div>

			<div class="info"></div>
			<div class="list_courseUnit">
			<ul>
			<?php

				//$res = $mysql->query("select * from user_rel_course where userid=".$userid);
				//$arr = $mysql->fetch_array($res);
				//$ids = substr($arr["coursegroupids"],1,-1);
				  //die("select * from group where deleted=0 and id in ($ids) order by time desc");
				//$res = $mysql->query("select * from `group` where deleted=0 and id in ($ids) order by time desc");
				//while($arr = $mysql->fetch_array($res)){
					//echo "<li><a href='course_for_group.php?id=$arr[id]&title=$arr[title]'>".$arr["title"]."</a></li>";
				//}
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
