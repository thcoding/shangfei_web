<?php 

$database = $postInfo["database"];
logger($database,'apilog.txt');
//获得lp_item_view的数组
$obj = json_decode($database,true);

//开始遍历更新lp_item_view
for($i = 0; $i < sizeof($obj["lp_item_view"]); $i++) {

	$resItemView = $mysql->query("select * from lp_item_view where id=".$obj["lp_item_view"][$i]["id"]);
	while($arrItemView = $mysql->fetch_array($resItemView)){
		$returnInfo["list"]["lp_item_view"][] = $arrItemView;
	}
}


?>

