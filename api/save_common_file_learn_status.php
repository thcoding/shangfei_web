<?php 

$unitversionid = $postInfo["unitversionid"];
$userid = $postInfo["userid"];
$viewcount = $postInfo["viewcount"];
$totaltime = $postInfo["totaltime"];
$lasttime = $postInfo["lasttime"];

$res = $mysql->query("select * from commonfile_view where user_id=".$userid." and unitversion_id=".$unitversionid);
	if($arr = $mysql->fetch_array($res)){//表中有记录

		$mysql->query("update commonfile_view set view_count='$viewcount',total_time='$totaltime',last_time='$lasttime' where user_id=".$userid." and unitversion_id=".$unitversionid);

		$returnInfo["status"] = "success";
	
	}
	else{//参数传递错误，保存失败
		
		//$mysql->query("insert into commonfile_view (user_id,unitversion_id,view_count,total_time,last_time) values //('$userid','$unitversionid','$viewcount','$totaltime','$lasttime')");
		$returnInfo["status"] = "failed";
		$returnInfo["unitversionid"] = $unitversionid;
		$returnInfo["userid"] = $userid;
		$returnInfo["viewcount"] = $viewcount;
		$returnInfo["totaltime"] = $totaltime;
		$returnInfo["lasttime"] = $lasttime;
	}

?>

