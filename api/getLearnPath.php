<?php 

$lpid = $postInfo["lpid"];

$res = $mysql->query("select * from lp where id=".$lpid);
while($arr = $mysql->fetch_array($res)){
	$returnInfo["list"]["lp"][] = $arr;
	//error_log(date("[Y-m-d H:i:s]")."\n", 3, "../php_err.log");
	$resItem = $mysql->query("select * from lp_item where lp_id=".$arr["id"]);
	while($arrItem = $mysql->fetch_array($resItem)){
		$returnInfo["list"]["lp_item"][] = $arrItem;
	}
}

?>