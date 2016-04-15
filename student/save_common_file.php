<?php

include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/config.php";

$unitversionid = $_GET["vid"];
$userid = $_GET["uid"];
	

	$lasttime = time();

	$res = $mysql->query("select * from commonfile_view where user_id= $userid and unitversion_id = $unitversionid");
	error_log(date("[Y-m-d H:i:s]")."res"."\n", 3, "../php_err.log");
	if($arr = $mysql->fetch_array($res)){//表中有记录
		error_log(date("[Y-m-d H:i:s]")."有记录"."\n", 3, "../php_err.log");
		$viewcount = $arr["view_count"]+1;
	
		$mysql->query("update commonfile_view set view_count='$viewcount',last_time='$lasttime' where user_id=".$userid." and unitversion_id=".$unitversionid);
	
		$returnInfo["status"] = "success";
	
	}
	else{//表中无记录，新增一条记录	
		error_log(date("[Y-m-d H:i:s]")."无记录"."\n", 3, "../php_err.log");
		$mysql->query("insert into commonfile_view (user_id,unitversion_id,view_count,total_time,last_time) values ('$userid','$unitversionid','1','0','$lasttime')");
	}


?>