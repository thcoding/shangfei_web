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
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">我的课程列表</div>
			<div class="search">
				<form action="" method="get" class="cf form-wrapper">
					<?php
					$keyword = isset($_GET["k"])?$_GET["k"]:"";?>
					<input name="k" value="<?php echo $keyword;?>" type="text" placeholder="请输入关键字...">
					<button type="submit">搜索课程</button>
					<?php
					$by1 = $by2 = $by3 = $by4 = $by5 = "";
					$order = 1;
					if(isset($_GET["order"])){
						switch($_GET["order"]){
							case 1:
								$by1 = "selected";
								$order = 1;
								break;
							case 2:
								$by2 = "selected";
								$order = 2;
								break;
							case 3:
								$by3 = "selected";
								$order = 3;
								break;
							case 4:
								$by4 = "selected";
								$order = 4;
								break;
							case 5:
								$by5 = "selected";
								$order = 5;
								break;
						}
					}					
					
					?>
					<table>
						<tr>
							<td>排序方式</td>
							<td>
								<select name="order">
								<option value="1" <?php echo $by1;?>>时间降序</option>
								<option value="2" <?php echo $by2;?>>时间升序</option>
								<option value="3" <?php echo $by3;?>>创建者</option>
								<option value="4" <?php echo $by4;?>>课程名称</option>
								<option value="5" <?php echo $by5;?>>课程类别</option>
								</select>
							</td>
						</tr>
					</table>
				</form>
			</div>
			<div class="wrap">
			<ul>
			<?php
				$userid = $_SESSION["userid"];
				$res = $mysql->query("select * from user_rel_course where userid=".$userid);
				$arr = $mysql->fetch_array($res);
				$ids = substr($arr["courseids"],1,-1);
				//排序与选择
				//排序
				$by = "order by ";
		switch($order){
			case 1:
				$by .= "time desc";
				break;
			case 2:
				$by .= "time";
				break;
			case 3:
				$by .= "userid";
				break;
			case 4:
				$by .= "title";
				break;
			case 5:
				$by .= "type desc";
				break;
		}
				//选择
				//die("select * from course where deleted=0 and id in ($ids) order by time desc");
				$res = $mysql->query("select * from course where deleted=0 and id in ($ids) and (title like '%".$keyword."%' or description like '%".$keyword."%') $by");
				$time = date("Y-m-d H:i:s");
				
				//显示课程列表（判断是否有课程）
				if(@$arr = mysql_fetch_array($res)){
				echo "<table border='1' width='100%' cellspacing='0' cellpadding='0'>
					<tr>
						<th width='20%' align='center' class='th1'>课程名称</th>
						<th width='10%' align='center' class='th1'>课程类别</th>
						<th width='10%' align='center' class='th1'>创建者</th>
						<th width='20%' align='center' class='th1'>创建时间</th>
						<th width='20%' align='center' class='th1'>课程开始时间</th>
						<th width='20%' align='center' class='th1'>课程结束时间</th>
					</tr>";
			    do{
				$userinfo = getUserinfoById($arr["userid"]);
				$type = $arr["type"]?"学习课程":"参考课程";
				echo "<tr><td><a href='courseCategory_for_course.php?id=$arr[id]&title=$arr[title]'>".$arr["title"]."</a></td><td>$type</td><td><a href=''>".$userinfo["realname"]."</a></td><td>$arr[time]</td><td>$arr[starttime]</td><td>$arr[endtime]</td></tr>";
                }
				while($arr = mysql_fetch_array($res));				
				echo "</table>";
				}
				else
				{
				echo "无相关课程记录！";
				}
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
