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
<script type="text/javascript" src="../js/My97DatePicker/WdatePicker.js"></script>
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

@$id = $_GET["id"];
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">课程设置</div>
			<form action="save.php?type=4" method="post" enctype="multipart/form-data" onsubmit="return checkFile()">
				<?php
					$yes = $no = $type1 = $type0 = "";
					$res = $mysql->query("select * from course where id=".$id);
					$arr = $mysql->fetch_array($res);
					$title = $arr["title"];
					$description = $arr["description"];
					$key = $arr["key"];
					$startTime = $arr["starttime"];
					$endTime = $arr["endtime"];
					$alwaysUpdate = $arr["alwaysupdate"];
					$type = $arr["type"];
					
					if($alwaysUpdate){
						$yes = "checked";
					}else{
						$no = "checked";
					}
					if($type){
						$type1 = "checked";
					}else{
						$type0 = "checked";
					}
				?>
				<table>
					<tr>
						<td>标题<span class="required">*</span></td>
						<td><input type="text" name="title" value="<?php echo $title;?>"></td>
					</tr>
					<tr>
						<td>描述</td>
						<td><textarea name="description" rows="3" cols="35"><?php echo $description;?></textarea></td>
					</tr>
					<tr>
						<td>密钥</td>
						<td><input type="text" name="key" value="<?php echo $key;?>"></td>
					</tr>
					<tr>
					<td>开始时间：</td>
						<td><input readonly style="width:250px;" type="text" name="startTime" id="title" value="<?php echo $startTime;?>" class="Wdate" onClick="WdatePicker({minDate:'%y-%M-%d %H:%m:%s',dateFmt:'yyyy-MM-dd HH:mm:ss'})"></td>
					</tr>
					<tr>
						<td>结束时间：</td>
						<td><input readonly style="width:250px;" type="text" name="endTime" id="title" value="<?php echo $endTime;?>" class="Wdate" onClick="WdatePicker({minDate:'%y-%M-%d %H:%m:%s',dateFmt:'yyyy-MM-dd HH:mm:ss'})"></td>
					</tr>
					<tr>
						<td>课程类别：</td>
						<td><label><input type="radio" name="courseType" value="1"<?php echo $type1;?>>学习课程</label> <label><input type="radio" name="courseType" value="0" <?php echo $type0;?>>参考课程</label></td>
					</tr>
					<tr>
						<td>是步更新：</td>
						<td><label><input type="radio" name="alwaysUpdate" value="1"<?php echo $yes;?>>是</label> <label><input type="radio" name="alwaysUpdate" value="0" <?php echo $no;?>>否</label></td>
					</tr>
					<tr>
						<td><input type="hidden" name="id" value="<?php echo $id;?>"><button type="submit">确定</button></td>
						<td><button type="reset">重置</button></td>
					</tr>
				</table>
			</form>
		</div>
	</div>
</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>
</body>
</html>
