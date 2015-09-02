<?php
//在管理员添加用户时检查用户名是否已经存在
include "../inc/config.php";

session_start();
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(isset($_SESSION["role"])){
	include "../inc/mysql.php";
	$res = $mysql->query("select * from user where username='".$_POST["username"]."'");//查询user表
	echo $mysql->num_rows($res);
}else{
	die("What are you doing?");
}


?>