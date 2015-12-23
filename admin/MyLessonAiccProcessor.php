<?php
/**
 * Created by PhpStorm.
 * User: wuqi
 * Date: 2015/12/13
 * Time: 10:01
 */
session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
include "../inc/mysql.php";
include "../inc/function.php";

@$command=$_POST["command"]?$_POST["command"]:0;
@$SESSION_ID=$_POST["session_id"]?$_POST["session_id"]:0;
@$aicc_data=$_POST["AICC_DATA"]?$_POST["AICC_DATA"]:0;
@$lession_content=$_POST["AICC_DATA"]?$_POST["AICC_DATA"]:0;
$texthand=fopen("D:/aicc.txt","a");
$userid=$_SESSION["userid"];

if($SESSION_ID!=0){
    $lpid=$SESSION_ID;
    $sql="select * from lp_view where lp_id='".$lpid."' and user_id='".$userid."'";
    $res_lp_view=$mysql->query($sql);
    $arr_lp_view=$mysql->fetch_array($res_lp_view);
    if($mysql->num_rows($res_lp_view)!=0&&strpos($aicc_data,"[core]")!==false){
        $view_count=$arr_lp_view["view_count"]+1;
        fwrite($texthand,"\n更新");
        fwrite($texthand,"\n".$lpid);
        $mysql->query("update lp_view SET view_count='$view_count' WHERE lp_id='".$lpid."'");
    }
    if($mysql->num_rows($res_lp_view)==0&&strpos($aicc_data,"[core]")!==false){
        fwrite($texthand,"\n插入");
        $mysql->query("insert into lp_view (lp_id,user_id,view_count,last_item,progress)
                                    VALUES ('".$lpid."','".$userid."',1,1,0)");
    }
    $res_lp_view=$mysql->query($sql);
    $arr_lp_view=$mysql->fetch_array($res_lp_view);
    fwrite($texthand,"\n".$res_lp_view."xxxxxxxxxxx".$arr_lp_view."data".$aicc_data);
    $lpviewid=$arr_lp_view["id"];
    $lastitemid=$arr_lp_view["last_item"];
    $_SESSION["lpviewid"]=$lpviewid;
    $_SESSION["lastitemid"]=$lastitemid;
    $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
    $res_lp_item_view=$mysql->query($sql);
    $arr_lp_item_view=$mysql->fetch_array($res_lp_view);
    fwrite($texthand,"成功0".$aicc_data);
    //flash 返回的数据 $aicc_data
    if($mysql->num_rows($res_lp_item_view)!=0){
        fwrite($texthand,"成功".$aicc_data);
        if($aicc_data!=""&&!isset($aicc_data)==1) {
            //从解析aicc返回的数据格式中
            fwrite($texthand,"成功2");
            if(strpos($aicc_data,"[core]")!==false) {
                $start_time = time();
                $stringtime = trim(intercept_str("time=", "\n", $aicc_data));//时间字符串00:00:12
                $total_time = strtotime($stringtime) + strtotime($arr_lp_item_view["total_time"]);
                $score = trim(intercept_str("score=", "\n", $aicc_data));;
                $status = trim(intercept_str("lesson_status=", "\n", $aicc_data));;
                $core_data = $_SESSION["aicc_data"];//trim(intercept_str("aicc_data=", "\n", $aicc_data));;//suspend_data
                $lesson_location = trim(intercept_str("lesson_location=", "\n", $aicc_data));;
                $core_exit = "none";
                $max_score = 100;
                $view_count = $arr_lp_item_view["view_count"] + 1;
                //修改已有项
                fwrite($texthand,"修改lp_item_view表");
                $mysql->query("update lp_item_view SET view_count='$view_count',total_time='$total_time',
                        score='$score',status='$status',suspend_data='$core_data' WHERE lp_view_id='".$lpviewid."'");
            }else{
                //可以放入session
                $core_data=$aicc_data.$_SESSION["aicc_data"];
                $_SESSION["aicc_data"]=$core_data;
            }
            fwrite($texthand,"\n第一处");
            $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
            $res=$mysql->query($sql);
            $arr=$mysql->fetch_array($res);
            if($mysql->num_rows($res)!=0){
                $core_data=$arr["suspend_data"];
                $lesson_location=$arr["lesson_location"];
                $status=$arr["status"];
                $score=$arr["score"];
                $total_time=$arr["total_time"];
            }
            echo '
            error=0
            error_text=Successful
            aicc_data='.$core_data.'
            [core]
            lesson_location='.$lesson_location.'
            lesson_status='.$status.'
            score='.$score.'
            time='.$total_time.'
            [core_lesson]
            visited=0$#$0$#$0,1$#$I$#$1^#^0$#$1$#$1,2,0,3$#$IT$#$0^#^0$#$2$#$3,1,0,2$#$I$#$1^#^^**^0|^**^';
        }else{
            //从数据库中拿，传回给flash
            $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
            $res=$mysql->query($sql);
            $arr=$mysql->fetch_array($res);
            $core_data=$arr["suspend_data"];
            $lesson_location=$arr["lesson_location"];
            $status=$arr["status"];
            $score=$arr["score"];
            $total_time=$arr["total_time"];
            fwrite($texthand,"\n第二处xx".$core_data."xx".$lpid);
            echo'
            error=0
            error_text=Successful
            aicc_data=
            '.$core_data.'
            [core]
            lesson_location='.$lesson_location.'
            lesson_status='.$status.'
            score='.$score.'
            time='.$total_time.'
            [core_lesson]
            visited=0$#$0$#$0,1$#$I$#$1^#^0$#$1$#$1,2,0,3$#$IT$#$0^#^0$#$2$#$3,1,0,2$#$I$#$1^#^^**^0|^**^';
        }
    }else{
        //第一次打开
        fwrite($texthand,"请问企鹅的去1".$aicc_data."X".isset($aicc_data));
        if($aicc_data!=""&&isset($aicc_data)==1) {
            //解析aicc_data
            fwrite($texthand,"请问企鹅的去2");
            if(strpos($aicc_data,"[core]")!==false) {
                fwrite($texthand,"请问企鹅的去3");
                $lpviewid=$_SESSION["lpviewid"];
                $lastitemid=$_SESSION["lastitemid"];
                $start_time = time();
                $stringtime = trim(intercept_str("time=", "\n", $aicc_data));//时间字符串00:00:12
                $total_time = strtotime($stringtime) + strtotime($arr_lp_item_view["total_time"]);
                $score = trim(intercept_str("score=", "\n", $aicc_data));
                $status = trim(intercept_str("lesson_status=", "\n", $aicc_data));
                $core_data = $_SESSION["aicc_data"];//trim(intercept_str("aicc_data=", "\n", $aicc_data));;//suspend_data
                $lesson_location = trim(intercept_str("lesson_location=", "\n", $aicc_data));
                $core_exit = "none";
                $max_score = "100";
                fwrite($texthand,"差一步\n".$_SESSION["aicc_data"].$status."\n");
                $mysql->query("insert into lp_item_view (lp_item_id,lp_view_id,view_count,start_time,total_time,
                      status,suspend_data,lesson_location,core_exit,max_score,score)
                      VALUES ('" . $lastitemid . "','" . $lpviewid . "',1,'" . $start_time . "','" . $total_time . "','" . $status . "','" . $core_data . "','" . $lesson_location . "','".$core_exit."','" . $max_score ."','".$score. "')");
            }else{
                //可以放入session
                $aicc_data=trim($aicc_data);
                $core_data=$aicc_data.$_SESSION["aicc_data"];
                $_SESSION["aicc_data"]=$core_data;
                fwrite($texthand,"差一步\n".$_SESSION["aicc_data"].$status."\n");
            }
        }else{
            fwrite($texthand,"\n第三处");
            $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
            $res=$mysql->query($sql);
            $arr=$mysql->fetch_array($res);
            if($mysql->num_rows($res)!=0) {
                $core_data=$arr["suspend_data"];
                $lesson_location=$arr["lesson_location"];
                $status=$arr["status"];
                $score=$arr["score"];
                $total_time=$arr["total_time"];
            }
            fwrite($texthand,"#########################".$core_data);
            echo '
            error=0
            error_text=Successful
            aicc_data='.$core_data.'
            [core]
            lesson_location='.$lesson_location.'
            lesson_status='.$status.'
            score='.$score.'
            time='.$total_time.'
            [core_lesson]
            visited=0$#$0$#$0,1$#$I$#$1^#^0$#$1$#$1,2,0,3$#$IT$#$0^#^0$#$2$#$3,1,0,2$#$I$#$1^#^^**^0|^**^';
            }
        }


}
function intercept_str($start,$end,$str)
{
    if(empty($start)||empty($end)||empty($str))return "参数不正确";
    $strarr=explode($start,$str);
    $str=$strarr[1];
    $strarr=explode($end,$str);
    return $strarr[0];
}
fclose($texthand);
?>


