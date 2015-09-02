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
<script type="text/javascript" src="../js/slides.min.jquery.js"></script>
<script type="text/javascript" src="../js/navigation.js"></script>
 
<script type="text/javascript">
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });
	   $("#username").focus();
    });
	function check(){		
		if($("#userid").val()==0){
			if($("#username").val()==""){
				alert("请输入用户名");
				$("#username").focus();
				return false;
			}
			if($("#password").val()==""){
				alert("请输入密码");
				$("#password").focus();
				return false;
			}
		}
		if ($("#mail").val()!= "") {
			var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
			isok= reg.test($("#mail").val());
		   if (!isok) {
				alert("邮箱格式不正确，请重新输入！");
				$("#mail").focus();
				return false;
			}
		}
		return true;
	}
	function checkUsername(obj){
		var obj = $(obj);
		$.ajax({				
			type: "POST",
			url: "checkUsername.php",
			data:"username="+obj.val(),
			success:function(msg){
				if(msg!=0){
					alert("该用户名已经存在，请更换！");
					obj.focus();
				}
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

$userid = isset($_GET["id"])?$_GET["id"]:0;
$username = $password = $role = $realname = $mail = $department = "";
if($userid){
	$arr = getUserinfoById($userid);
	$username   = $arr["username"];
	$realname   = $arr["realname"];
	$mail       = $arr["mail"];
	$department = $arr["department"];
	$role       = $arr["role"];
}
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">添加/编辑用户</div>
			<div class="list_courseUnit">
			<form action="save.php?type=5" method="post" onsubmit="return check();">
			<table>
				<tr>
					<td>用户名：</td>
					<td><?php if($userid){?><?php echo $username;?><?php }else{?><input style="width:200px;" type="text" name="username" id="username"><span class="required">*</span><?php }?></td>
				</tr>
				<tr>
					<td>密 &nbsp; 码：</td>
					<td><input style="width:200px;" type="password" name="password" id="password"><?php if($userid){?>不修改请留空<?php }else{?><span class="required">*</span><?php }?></td>
				</tr>
				<tr>
					<td>真实姓名：</td>
					<td><input style="width:200px;" type="text" name="realname" id="realname" required="required" value="<?php echo $realname;?>"><span class="required">*</span></td>
				</tr>
				<tr>
					<td>邮 &nbsp; 箱：</td>
					<td><input style="width:200px;" type="email" name="mail" id="mail" value="<?php echo $mail;?>"></td>
				</tr>
				<tr>
					<td>角 &nbsp; 色：</td>
					<td>
						<select name="role">
							<option value="1" <?php if($role==ADMIN) echo "selected";?>>管理员</option>
							<option value="2" <?php if($role==TEACHER) echo "selected";?>>教员</option>
							<option value="3" <?php if($role==STUDENT || $role==0) echo "selected";?>>学员</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>部 &nbsp; 门：</td>
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
			<img style="float:right;" src='../img/instructor-projection.png'>
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
