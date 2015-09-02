<?php

include "../inc/mysql.php";
include "../inc/function.php";
include "function.php";

date_default_timezone_set("PRC");

//$str = 'oeYVTKfneyJtb2R1bGVpZCI6NCwiZ3JvdXBpZCI6MTB9';
@$str = trim($_POST["json"]);

$postInfo = json_decode(base64_decode(substr($str,8)),true);
$moduleid = $postInfo["moduleid"];

file_put_contents("log","moduleid=".$postInfo["moduleid"]."|".GetIP()."|".$str."|".date("Y-m-d H:i:s")."\n",FILE_APPEND);

if(in_array($moduleid,array(1,2,3,4,5))){
	$returnInfo["result"] = 1;
}else{
	$returnInfo["result"] = 0;
}


switch ($moduleid){
	case 1:  //登录接口
		include "login.php";
		break;
	case 2:  //我的课程接口
		include "mycourse.php";
		break;
	case 3:  //课程下的课程单元及课程单元组列表接口
		include "courseUnit4course.php";
		break;
	case 4:  //课程单元组下的课程单元及课程单元组列表接口
		include "courseUnit4group.php";
		break;
	case 5:  //课程组下的课程及课程组列表接口
		include "course4group.php";
		break;
	case 6:  //课程组下的课程及课程组列表接口
		include "save_common_file_learn_status.php";
		break;
}

echo make8().base64_encode(json_encode($returnInfo,JSON_UNESCAPED_UNICODE));

?>