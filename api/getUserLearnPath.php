<?php 
include "../inc/mysql.php";
include "../inc/function.php";
include "function.php";

$userid = $postInfo["userid"];

$res = $mysql->query("select * from lp_view where user_id=".$userid);
while($arr = $mysql->fetch_array($res)){
	$returnInfo["list"]["lp_view"][] = $arr;
	//error_log(date("[Y-m-d H:i:s]")."\n", 3, "../php_err.log");
	$resItemView = $mysql->query("select * from lp_item_view where lp_view_id=".$arr["id"]);
	while($arrItemView = $mysql->fetch_array($resItemView)){
		$returnInfo["list"]["lp_item_view"][] = $arrItemView;
	}
}

?>