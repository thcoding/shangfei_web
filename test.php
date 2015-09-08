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
echo $percent;
$arrs = isset($_GET["arrs"])?$_GET["arrs"]:0;
error_log(date("[Y-m-d H:i:s]").$arrs."\n", 3, "php_err.log");

?>
<input type="hidden" name="x" value="1"><input type="hidden" name="y" value="12">

case 16: //课程单元组分配到课程
			error_log(date("[Y-m-d H:i:s]")."fenpei.php 16"."\n", 3, "../php_err.log");
			@$courseUnit        = $_POST["courseUnit"];
			@$courseUnitVersion = $_POST["courseUnitVersion"];
			@$courseUnitGroup   = $_POST["courseUnitGroup"];
			@$toCourseCategoryId = $_POST["toCourseCategoryId"];
			$arrCourseunitId = explode(",",$courseUnitVersion);//待添加的课程单元数组
			$unitids1 = "";
			//为单元组添加这些单元
			foreach($arrCourseunitId as $courseunitId)
				if($toCourseCategoryId!=""){
					$resCategory = $mysql->query("select * from courseversion_rel_courseunitversion where coursecategoryid=".$toCourseCategoryId);
					$arrCategory = $mysql->fetch_array($resCategory);
					if($arrCategory){//表中存在该字段
						$unitids0 = $arrCategory["courseunitversionids"];//获取该组中所有用户id
						$arrUnitversionIds = explode(",",$unitids0);//切割为用户id数组
						$unitIsIn = in_array(strval($courseunitId),$arrUnitversionIds);
						if(!$unitIsIn){//该组中尚无该用户，添加之
							$unitids1 = $unitids0.strval($courseunitId).",";
							$mysql->query("update courseversion_rel_courseunitversion set courseunitversionids='$unitids1' where coursecategoryid=".$toCourseCategoryId);
						}
					}else{//此组为新的单元组，尚未分配过课程单元
						$unitids1 = ",".strval($courseunitId).",";
						$mysql->query("insert courseversion_rel_courseunitversion (coursecategoryid,courseunitids,courseunitversionids) values ('$toCourseCategoryId',',','$unitids1')");
					}
				}
			}
			$mysql->query("replace into courseversion_rel_courseunitversion (coursecategoryid,courseunitids,courseunitversionids,courseunitgroupids) values ('".$toCourseCategoryId."','".$courseUnit."','".$courseUnitVersion."','".$courseUnitGroup."')");
			break;