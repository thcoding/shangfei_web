<?php
/**
 * Created by PhpStorm.
 * User: wuwu
 * Date: 2016/1/12
 * Time: 18:46
 */
session_start();
setcookie(session_name(),session_id(),time()+600,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
    header("Location:../../index.php");
    exit();
}
include "../../inc/mysql.php";
include "../../inc/function.php";
include "../../inc/config.php";
$userid=$_SESSION["userid"];
$actionType=isset($_GET["type"])?$_GET["type"]:1;
$nowTime=isset($_GET["newTime"])?$_GET["newTime"]:1;
$lpItemId=isset($_GET["lpItemId"])?$_GET["lpItemId"]:0;
$lpId=isset($_GET["lpId"])?$_GET["lpId"]:0;
/*
 * @author wuqi
 * 针对商飞scorm2004包的无法记录时间的bug
 *
 */
switch($actionType){
    case "start":
    {
        $_SESSION["ItemStartTime"]=$nowTime;
        break;
    }
    case "setTime":
    {
        $ItemStartTime=$_SESSION["ItemStartTime"];
        $ItemTotalTime=$nowTime-$ItemStartTime;
        $res_lp_view_item=$mysql->query("select * from lp_item_view where lp_item_id= $lpItemId");
        $view_item_num=0;
        echo "lpItemId".$lpItemId;
        while($arr_lp_view_item= $mysql->fetch_array($res_lp_view_item)){
            $lpViewId=$arr_lp_view_item["lp_view_id"];
            echo "lpViewId".$lpViewId;
            $res_lp_view=$mysql->query("select * from lp_view where lp_id= $lpId AND id=$lpViewId");
            while($arr_lp_view=$mysql->fetch_array($res_lp_view)){
                $view_item_num++;
                $lp_view_id=$arr_lp_view["id"];
            }
        }
        if($view_item_num==1){
            $ItemTotalTime=$ItemTotalTime/1000;
            $mysql->query("update lp_item_view set total_time='$ItemTotalTime'where lp_item_id= $lpItemId AND lp_view_id=$lp_view_id");
            $_SESSION["ItemStartTime"]=0;
        }
        break;
    }
    default:
        echo "no this ".$actionType." actionType";
}

?>