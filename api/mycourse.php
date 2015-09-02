<?php 

$userid = $postInfo["userid"];

$res = $mysql->query("select * from user_rel_course where userid=".$userid);
$arr = $mysql->fetch_array($res);
$ids = substr($arr["courseids"],1,-1);
//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
$res = $mysql->query("select * from course where deleted=0 and id in ($ids) order by time desc");

while($arr = $mysql->fetch_array($res)){
	$returnInfo["list"]["course"][] = $arr;
}


$res = $mysql->query("select * from user_rel_course where userid=".$userid);
$arr = $mysql->fetch_array($res);
$ids = substr($arr["coursegroupids"],1,-1);
//die("select * from group where deleted=0 and id in ($ids) order by time desc");
$res = $mysql->query("select * from `group` where id=5");
while($arr = $mysql->fetch_array($res)){
	$returnInfo["list"]["courseGroup"][] = $arr;
}

?>