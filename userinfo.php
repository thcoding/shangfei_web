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
		<div style="border-radius: 15px;width: 500px;">
				<table style="font-size: 18px;border: 1px;">
					<tr>
						<td rowspan="5">
							<img src="img/indexheader.jpg" width=150 height=150 style="border-radius: 15px;">
						</td>
						<td></td>
					</tr>
            <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>用户名：</td>
                <td>&nbsp;&nbsp;<?php echo $username;?></td>
            </tr>

            <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>真实姓名：</td>
                <td>&nbsp;&nbsp;<?php echo $realname;?></td>
            </tr>

            <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>邮箱：</td>
                <td>&nbsp;&nbsp;<?php echo $mail;?></td>
            </tr>
            <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>部门：</td>
                <td>&nbsp;&nbsp;<?php echo $departmentArr[$department];?></td>
            </tr>
            <tr>
                <td align="center">
					<a href="myinfo.php" style="color:blue;font-size:14px;text-decoration:underline">修改个人信息</a>					
				</td>
            </tr>
			<?php 
			if(@$_SESSION["role"] != ADMIN){//如果不是管理员，则显示所修课程信息
			?>
            <tr>
                <td></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>课程总数：</td>
                <td><a href="student/mycourse.php">&nbsp;&nbsp;<?php
                    $student=getStuStatistics($userid);
                    echo $student;?></a></td>
            </tr>
            <tr>
                <td></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>过期课程：</td>
                <td><a href="student/mycourse.php?status=3">&nbsp;&nbsp;<?php
                    $student=getStuStatistics($userid,1,-1);
                    echo $student;?></a></td>
            </tr>
            <tr><td></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>考试总数：</td>
                <td>&nbsp;&nbsp;0</td>
            </tr>
            <tr><td></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>考试补考：</td>
                <td>&nbsp;&nbsp;0</td>
            </tr>
			<?php 
				}
			?>
        </table>

		</div>
		<div id="container">			
		</div>
	</div>
</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "inc/footer.php";?>

</body>
</html>
