<?php

session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(isset($_SESSION["role"]) && ($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER)){
	include "../inc/mysql.php";
	$userid = $_SESSION["userid"];
	$time = date("Y-m-d H:i:s");
	
	$id       = $_POST["id"];
	$name     = $_POST["name"];
	$isCourse = $_POST["isCourse"];
	$type     = $_POST["type"];
	
	if($type=="add"){
		if($isCourse){
			$mysql->query("insert into coursecategory (`courseid`,`name`,`parentid`,`userid`,`time`) values ('$id','$name','0','$userid','$time')");
		}else{
			$mysql->query("insert into coursecategory (`courseid`,`name`,`parentid`,`userid`,`time`) values ('0','$name','$id','$userid','$time')");
		}
		echo $mysql->insert_id();
	}elseif($type=="update"){  //update
		$mysql->query("update coursecategory set `name`='$name' where id='$id'");
	}else{ //delete
		$mysql->query("delete from coursecategory where id='$id'");
	}
	
}else{
	die("What are you doing?");
}

?>