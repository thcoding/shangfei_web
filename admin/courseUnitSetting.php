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
    
    var checkinput = function() {
        var f = true;
        $("[type='number']").each(function() {
            if (!f) return;
            var num = parseInt(this.value);
            if (num < 0) {
               $(this).focus();
               alert("分数、时长不能小于0");
               f = false;
           }
        });
        return f;
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

@$id = $_GET["id"];
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">添加/编辑课程单元</div>
			<form action="save.php?type=3" method="post" enctype="multipart/form-data" onsubmit="return checkinput();">
				<?php
				if($id){
					$res = $mysql->query("select * from courseunit where id=".$id);
					$arr = $mysql->fetch_array($res);
					$title = $arr["title"];
					$description = $arr["description"];
					$key = $arr["key"];
					$startTime = $arr["starttime"];
					$endTime = $arr["endtime"];
					$totalScore = $arr["totalscore"];
					$passScore = $arr["passscore"];
					$timelength = $arr["timelength"];
					}
				else{
					$title = $description = $key = $yes = $startTime = $endTime = $totalScore =$passScore =$timelength="";
				}
				?>
				<table>
					<tr>
						<td>标题</td>
						<td><input type="text" name="title" required="required" value="<?php echo $title;?>"><span class="required">*</span></td>
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
						<td><input style="width:250px;" type="text" name="startTime" id="title" required="required" value="<?php echo $startTime;?>" class="Wdate" onClick="WdatePicker({minDate:'%y-%M-%d %H:%m:%s',dateFmt:'yyyy-MM-dd HH:mm:ss'})"><span class="required">*</span></td>
					</tr>
					<tr>
						<td>结束时间：</td>
						<td><input style="width:250px;" type="text" name="endTime" id="title" required="required" value="<?php echo $endTime;?>" class="Wdate" onClick="WdatePicker({minDate:'%y-%M-%d %H:%m:%s',dateFmt:'yyyy-MM-dd HH:mm:ss'})"><span class="required">*</span></td>
					</tr>
					<tr>
						<td>满分分数</td>
						<td><input type="number" name="totalscore" required="required" value="<?php echo $totalScore;?>"><span class="required">*</span></td>
					</tr>
					<tr>
						<td>及格分数</td>
						<td><input type="number" name="passscore" required="required" value="<?php echo $passScore;?>"><span class="required">*</span></td>
					</tr>
					<tr>
						<td>学习时长</td>
						<td><input type="number" name="timelength" required="required" value="<?php echo $timelength;?>">min<span class="required">*</span></td>
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
