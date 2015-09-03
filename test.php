<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<?php

//包含相关php文件
include "inc/mysql.php";
include "inc/config.php";

$keyword = "张";
$resCreator = mysql_query("select * from user where realname like '%".$keyword."%'");
while($arr = mysql_fetch_array($resCreator)){
	//echo $arr["realname"];
}
similar_text("参考","参考课程",$percent);
echo $percent

?>
<input type="hidden" name="x" value="1"><input type="hidden" name="y" value="12">