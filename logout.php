<?php
//用户登出，注销session
session_start();
$_SESSION["userid"]   = null;
$_SESSION["realname"] = null;
$_SESSION["role"]     = null;
$_SESSION["courseid"] = null;
session_destroy();
header("Location:index.php");


?>