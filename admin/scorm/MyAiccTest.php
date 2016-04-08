<?php
/**
 * Created by PhpStorm.
 * User: wuwu
 * Date: 2016/3/23
 * Time: 17:22
 */
include "../inc/config.php";
include "../inc/mysql.php";
include "../inc/function.php";
session_start();
setcookie(session_name(),session_id(),time()+$sessionTime,"/");

@$command=$_POST["command"]?$_POST["command"]:0;
@$SESSION_ID=$_POST["session_id"]?$_POST["session_id"]:0;
@$aicc_data=$_POST["AICC_DATA"]?$_POST["AICC_DATA"]:0;
@$lession_content=$_POST["AICC_DATA"]?$_POST["AICC_DATA"]:0;

$userid=$_SESSION["userid"];

if($SESSION_ID!=0&$SESSION_ID!=""){
    if($_SESSION["aicctime"]==""){
        $_SESSION["aicctime"]=time();
    }
    $lpid=$SESSION_ID;
    $sql="select * from lp_view where lp_id='".$lpid."' and user_id='".$userid."'";
    $res_lp_view=$mysql->query($sql);
    $arr_lp_view=$mysql->fetch_array($res_lp_view);

    if($mysql->num_rows($res_lp_view)!=0&&strpos($aicc_data,"[core]")!==false){
        $view_count=$arr_lp_view["view_count"]+1;
        $mysql->query("update lp_view SET view_count='$view_count' WHERE lp_id='".$lpid."'");
    }




}else{
    echo '<script>alert(\'您打开的课件有问题！\');</script>';
}

function intercept_str($start,$end,$str)
{
    if(empty($start)||empty($end)||empty($str))return "参数不正确";
    $strarr=explode($start,$str);
    $str=$strarr[1];
    $strarr=explode($end,$str);
    return $strarr[0];
}