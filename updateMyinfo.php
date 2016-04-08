<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<?php
//更新个人信息
session_start();
include "inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
$userid = $_SESSION["userid"];
include "inc/mysql.php";
$password    = $_POST["password"];
$realname    = $_POST["realname"];
@$mail       = trim($_POST["mail"]);
@$department = trim($_POST["department"]);

$mypassword = $password?",password='".md5($password)."'":"";//更新个人密码

$mysql->query("update `user` set realname='$realname',mail='$mail',department='$department' $mypassword where id=".$userid);

echo "<script>alert('更新成功！');location.href='userinfo.php'</script>";

?>