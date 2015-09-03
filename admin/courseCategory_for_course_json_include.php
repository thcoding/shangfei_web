<?php
/**
 * Created by PhpStorm.
 * User: wuwu
 * Date: 2015/6/24
 * Time: 0:55
 */
include "../inc/mysql.php";

@$catid =$_POST["catid"] ;


$res = $mysql->query("select * from courseversion_rel_courseunitversion where coursecategoryid=".$catid);
$arr = $mysql->fetch_array($res);
if($arr==null){
   $sql="insert into courseversion_rel_courseunitversion(coursecategoryid) valuse(".$catid.");";
    $res = $mysql->query($sql);
    $arrjson=json_encode($arr,JSON_UNESCAPED_UNICODE);
}else {

    $courseUnitIds = $arr["courseunitids"];
    $courseUnitVersionIds = $arr["courseunitversionids"];
    $courseUnitGroupIds = $arr["courseunitgroupids"];
    $arrjson = json_encode($arr, JSON_UNESCAPED_UNICODE);


    echo $arrjson;
}
 ?>