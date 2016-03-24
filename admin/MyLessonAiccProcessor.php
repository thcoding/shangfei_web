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
    if($mysql->num_rows($res_lp_view)==0&&strpos($aicc_data,"[core]")!==false){
        $mysql->query("insert into lp_view (lp_id,user_id,view_count,last_item,progress)
                                    VALUES ('".$lpid."','".$userid."',1,1,0)");
    }
    $res_lp_view=$mysql->query($sql);
    $arr_lp_view=$mysql->fetch_array($res_lp_view);
    $lpviewid=$arr_lp_view["id"];
    $lastitemid=$arr_lp_view["last_item"];
    $_SESSION["lpviewid"]=$lpviewid;
    $_SESSION["lastitemid"]=$lastitemid;
    $userId=$_SESSION["userid"];
    $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
    $res_lp_item_view=$mysql->query($sql);
    $arr_lp_item_view=$mysql->fetch_array($res_lp_item_view);
    //flash 返回的数据 $aicc_data
    if($mysql->num_rows($res_lp_item_view)!=0){
        if($aicc_data!=""&&isset($aicc_data)==1) {
            //从解析aicc返回的数据格式中
            if(strpos($aicc_data,"[core]")!==false) {
                $start_time=$_SESSION["aicctime"];//最后一次访问时间
                unset ($_SESSION["aicctime"]);
                $lpviewid=$_SESSION["lpviewid"];
                $stringtime = trim(intercept_str("time=", "\n", $aicc_data));
                $total_time = (time()-$start_time)+$arr_lp_item_view["total_time"];
                $score = trim(intercept_str("score=", "\n", $aicc_data));
                $status = trim(intercept_str("lesson_status=", "\n", $aicc_data));
                $visited= trim(intercept_str("visited=", "\n", $aicc_data));
                //trim(intercept_str("aicc_data=", "\n", $aicc_data));;//suspend_data
                $lesson_location = trim(intercept_str("lesson_location=", "\n", $aicc_data));
                $core_data = $_SESSION["aicc_data"];
                $core_exit = $visited;
                $max_score = "100";
                $view_count = $arr_lp_item_view["view_count"] + 1;
                $mysql->query("update lp_item_view SET start_time='$start_time', view_count='$view_count',total_time='$total_time',score='$score',status='$status',suspend_data='$core_data',core_exit='$core_exit' WHERE lp_view_id='".$lpviewid."'");
            }else{
                $core_data=$aicc_data.$_SESSION["aicc_data"];
                $_SESSION["aicc_data"]=$core_data;
            }
            $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
            $res=$mysql->query($sql);
            $arr=$mysql->fetch_array($res);
            if($mysql->num_rows($res)!=0){
                $core_data=$arr["suspend_data"];
                $lesson_location=$arr["lesson_location"];
                $status=$arr["status"];
                $score=$arr["score"];
                $total_time=$arr["total_time"];
                $visited=$arr["core_exit"];
            }
            $core_data=';';
            echo '
            error=0
            error_text=Successful
            aicc_data='.$core_data.'
            [core]
            lesson_location=3
            lesson_status='.$status.'
            score='.$score.'
            time='.$total_time.'
            [core_lesson]
            visited='.$visited;
        }else{
            //从数据库中拿，传回给flash
            $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
            $res=$mysql->query($sql);
            $arr=$mysql->fetch_array($res);
            $core_data=$arr["suspend_data"];
            $lesson_location=$arr["lesson_location"];
            $status=$arr["status"];
            $score=$arr["score"];
            $visited=$arr["core_exit"];
            $total_time=$arr["total_time"];

            echo'
            error=0
            error_text=Successful
            aicc_data='.$core_data.';'.'
            [core]
            lesson_location='.$lesson_location.'
            lesson_status='.$status.'
            score='.$score.'
            time='.$total_time.'
	        [core_lesson]
            visited='.$visited;
        }
    }else{
        //第一次打开
        if($aicc_data!=""&&isset($aicc_data)==1) {
            //解析aicc_data
            if(strpos($aicc_data,"[core]")!==false) {
                $lpviewid=$_SESSION["lpviewid"];
                $lastitemid=$_SESSION["lastitemid"];
                $start_time=$_SESSION["aicctime"];
                unset ($_SESSION["aicctime"]);
                $stringtime = trim(intercept_str("time=", "\n", $aicc_data));
                $total_time = (time()-$start_time)+$arr_lp_item_view["total_time"];
                $score = trim(intercept_str("score=", "\n", $aicc_data));
                $status = trim(intercept_str("lesson_status=", "\n", $aicc_data));
                $lesson_location = trim(intercept_str("lesson_location=", "\n", $aicc_data));
                $visited= trim(intercept_str("visited=", "\n", $aicc_data));
                $core_exit = $visited;
                $max_score = "100";
                $core_data = $_SESSION["aicc_data"];//trim(intercept_str("aicc_data=", "\n", $aicc_data));;//suspend_data
                $sql="insert into lp_item_view (lp_item_id,lp_view_id,view_count,start_time,total_time,
                      status,suspend_data,lesson_location,core_exit,max_score,score)
                      VALUES ('" . $lastitemid . "','" . $lpviewid . "',1,'" . $start_time . "','" . $total_time . "','" . $status . "','" . $core_data . "','" . $lesson_location . "','".$core_exit."','" . $max_score ."','".$score. "')";
                $mysql->query($sql);
            }else{
                //可以放入session
                $aicc_data=trim($aicc_data);
                $core_data=$aicc_data.$_SESSION["aicc_data"];
                $_SESSION["aicc_data"]=$core_data;

            }
        }else{
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
            echo '
            error=0
            error_text=Successful
            aicc_data='.$core_data.';'.'
            [core]
            lesson_location='.$lesson_location.'
            lesson_status='.$status.'
            score='.$score.'
            time='.$total_time.'
            [core_lesson]
            visited='.$visited;
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


