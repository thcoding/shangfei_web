<?php

$username = $postInfo["username"];
$password = $postInfo["password"];

$res = $mysql->query("select * from user where username='$username'");
$arr = $mysql->fetch_array($res);

if($mysql->num_rows($res)==0){
	$returnInfo["object"]["id"] = "0";
	$returnInfo["object"]["info"] = "用户名不存在";
}else if($arr["password"] == md5($password)){
	$arr["info"] = "登录成功";
	$returnInfo["object"] = $arr;
}else{
	$returnInfo["object"]["id"] = "0";
	$returnInfo["object"]["info"] = "密码错误";
}

?>