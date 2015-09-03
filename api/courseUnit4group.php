<?php 

$groupid = $postInfo["groupid"];

$res = $mysql->query("select * from courseunitgroup where groupid=".$groupid);
$arr = $mysql->fetch_array($res);
$ids = substr($arr["courseunitids"],1,-1);
//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
$res = $mysql->query("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
//echo "select * from courseunitversion_rel_attachment where deleted=0 and id in ($ids) order by time desc";
//die();

while($arr = $mysql->fetch_array($res)){
	$returnInfo["list"]["courseUnit"][] = $arr;
}

$res = $mysql->query("select * from courseunitgroup where groupid=".$groupid);
$arr = $mysql->fetch_array($res);
$ids = substr($arr["courseunitgroupids"],1,-1);
//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
$res = $mysql->query("select * from `group` where deleted=0 and id in ($ids) order by time desc");
while($arr = $mysql->fetch_array($res)){
	$returnInfo["list"]["courseUnitGroup"][] = $arr;
}

?>