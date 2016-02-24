<?php 

$database = $postInfo["database"];
logger($database,'apilog.txt');
//获得lp_item_view的数组
$obj = json_decode($database,true);

//开始遍历更新lp_item_view
for($i = 0; $i < sizeof($obj["lp_item_view"]); $i++) {
	logger($obj["lp_item_view"][$i]["id"],'apilog.txt');
	$sql = "UPDATE lp_item_view	SET total_time = '".$obj["lp_item_view"][$i]["total_time"]."',"
			."lesson_location = '".$obj["lp_item_view"][$i]["lesson_location"]."',"
			."status = '".$obj["lp_item_view"][$i]["status"]."',"
			."start_time = '".$obj["lp_item_view"][$i]["start_time"]."',"
			."view_count = '".$obj["lp_item_view"][$i]["view_count"]
			."' WHERE id = ".$obj["lp_item_view"][$i]["id"];
	$mysql->query($sql);
}


?>

