<!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>商飞学习管理系统</title>

<style type="text/css" media="screen, projection">
/*<![CDATA[*/
@import "css/default.css";
@import "css/main.css";
/*]]>*/
</style>

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/slides.min.jquery.js"></script>
<script type="text/javascript" src="js/navigation.js"></script>
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
	   $("#username").focus();
    });
	function check(){		
		
		return true;
	}
</script>
</head>
<body>

<div id="wrapper">

<?php 
session_start();
include "inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){//判断之前的session是否已经结束，如果结束，则重新登录
	header("Location:index.php");
	exit();
}

include "inc/mysql.php";
include "inc/function.php";
include "inc/navigation_root.php";



$userid = $_SESSION["userid"];

$arr = getUserinfoById($userid);//从数据库user表中获取用户信息
$username   = $arr["username"];
$realname   = $arr["realname"];
$mail       = $arr["mail"];
$department = $arr["department"];

?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">个人资料</div>
			<div class="list_courseUnit">
			<form action="updateMyinfo.php" method="post" onsubmit="return check();">
			<table>
				<tr>
					<td>用户名：</td>
					<td><?php echo $username;?></td>
				</tr>
				<tr>
					<td>密 &nbsp; 码：</td>
					<td><input style="width:200px;" type="password" name="password" id="password" value="">不修改请留空</td>
				</tr>
				<tr>
					<td>真实姓名：</td>
					<td><input style="width:200px;" type="text" name="realname" id="realname" value="<?php echo $realname;?>"></td>
				</tr>
				<tr>
					<td>邮箱：</td>
					<td><input style="width:200px;" type="text" name="mail" id="mail" value="<?php echo $mail;?>"></td>
				</tr>
				<tr>
					<td>部门：</td>
					<td>
						<select name="department" id="department">
							<?php
							foreach($departmentArr as $k=>$v){
								$s = $k==$department?"selected":"";
								echo "<option value='$k' $s>$v</option>";
							}
							?>							
						</select>
					</td>
				</tr>
				<tr>
					<td> </td>
					<td><input type="hidden" name="id" id="userid" value="<?php echo $userid;?>"><button type="submit" >确定</button></td>
				</tr>
			</table>
			
			</form>
			<img style="float:right;" src='img/instructor-projection.png'>
			</div>
		</div>
	</div>
</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "inc/footer.php";?>

</body>
</html>
