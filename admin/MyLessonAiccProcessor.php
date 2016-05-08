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
$texthand=fopen("C:/aiccs.txt","a");
@$command=$_POST["command"]?$_POST["command"]:"";
@$SESSION_ID=$_POST["session_id"]?$_POST["session_id"]:"";
@$aicc_data=$_POST["AICC_DATA"]?$_POST["AICC_DATA"]:"";
@$lession_content=$_POST["AICC_DATA"]?$_POST["AICC_DATA"]:"";
$userid=$_SESSION["userid"];

$core_data="";
$lesson_location="";
$status="";
$score="";
$total_time="";
$visited="";
fwrite($texthand,'SESSION_ID'.$SESSION_ID);
if($SESSION_ID!=0){
    //flash文件有post数据返回时
    fwrite($texthand,'SESSION_ID'.$SESSION_ID.$command);
    if(!isset($_SESSION["aicctime"])){
        $_SESSION["aicctime"]=time();
    }
    $lpid=$SESSION_ID;
    //处理lp_view
    $arr_lp_view=updateOrInsert_lp_view($lpid,$userid,$mysql,$aicc_data);
    $lpviewid=$arr_lp_view["id"];
    $lastitemid=$arr_lp_view["last_item"];
    //处理lp_item_view
    $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
    $res_lp_item_view=$mysql->query($sql);
    $arr_lp_item_view=$mysql->fetch_array($res_lp_item_view);
    //flash 返回的数据 $aicc_data

    fwrite($texthand, "flash返回的数据1".$aicc_data);
    fwrite($texthand,"返回");
    if($mysql->num_rows($res_lp_item_view)!=0){
        fwrite($texthand, "flash返回的数据2".isset($aicc_data));
        if($aicc_data!=""&&isset($aicc_data)==1) {
            //从解析aicc返回的数据格式中
            fwrite($texthand, "flash返回的数据3".$aicc_data);
            if(strpos($aicc_data,"[core]")!==false) {
                fwrite($texthand, "flash返回的数据4".$aicc_data);
                $start_time=$_SESSION["aicctime"];//最后一次访问时间
                unset ($_SESSION["aicctime"]);
                //$lpviewid=$_SESSION["lpviewid"];
                $stringtime = trim(intercept_str("time=", "\n", $aicc_data));
                $total_time = (time()-$start_time)+$arr_lp_item_view["total_time"];
                $score = trim(intercept_str("score=", "\n", $aicc_data));
                $status = trim(intercept_str("lesson_status=", "\n", $aicc_data));
                $visited= trim(intercept_str("visited=", "\n", $aicc_data));
                $lesson_location = trim(intercept_str("lesson_location=", "\n", $aicc_data));
                $core_data = $_SESSION["aicc_data"];
                $core_exit = $visited;
                $max_score = "100";
                $view_count = $arr_lp_item_view["view_count"] + 1;
                $mysql->query("update lp_item_view SET start_time='$start_time', view_count='$view_count',total_time='$total_time',score='$score',status='$status',suspend_data='$core_data',core_exit='$core_exit' WHERE lp_view_id='".$lpviewid."'");
            }else{
                fwrite($texthand,'神奇'.$core_data);
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
            fwrite($texthand, "flash返回的数据3".$aicc_data);
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
            visited='.$visited;
        }else{
            //从数据库中拿，传回给flash
            $sql="select * from lp_item_view where lp_view_id='".$lpviewid."'";
            $res=$mysql->query($sql);
            $arr=$mysql->fetch_array($res);
            fwrite($texthand,"从数据库中拿，传回给flash".$mysql->num_rows($res));
            if($mysql->num_rows($res)!=0){
                $core_data=$arr["suspend_data"];
                $lesson_location=$arr["lesson_location"];
                $status=$arr["status"];
                $score=$arr["score"];
                $visited=$arr["core_exit"];
                $total_time=$arr["total_time"];
                fwrite($texthand,"从数据库中拿xxxxx，传回给flash1".'error=0
                    error_text=Successful
                    aicc_data='.$core_data.'
                    [core]
                    lesson_location='.$lesson_location.'
                    lesson_status='.$status.'
                    score='.$score.'
                    time='.$total_time.'
                    [core_lesson]
                    visited='.$visited);
                echo
                    'error=0
                    error_text=Successful
                    aicc_data='.$core_data.'
                    [core]
                    lesson_location='.$lesson_location.'
                    lesson_status='.$status.'
                    score='.$score.'
                    time='.$total_time.'
                    [core_lesson]
                    visited='.$visited;
            }else{
                fwrite($texthand,"从数据库中拿，传回给flash2");
                echo
                'error=0
                    error_text=Successful
                    aicc_data=
                    [core]
                    lesson_location=
                    lesson_status=
                    score=
                    time=
                    [core_lesson]
                    visited=visited';
            }


        }
    }else{
        //第一次打开
        fwrite($texthand, "xxxxxx".isset($aicc_data));
        if($aicc_data!=""&&isset($aicc_data)==1) {
            //解析aicc_data
            fwrite($texthand, "xxxxxx".strpos($aicc_data,"[core]"));
            if(strpos($aicc_data,"[core]")!==false) {
                //$lpviewid=$_SESSION["lpviewid"];
                //$lastitemid=$_SESSION["lastitemid"];
                fwrite($texthand,"写入数据库lpviewid".$lpviewid);
                $start_time=$_SESSION["aicctime"];

                $stringtime = trim(intercept_str("time=", "\n", $aicc_data));
                $total_time = (time()-$start_time)+$arr_lp_item_view["total_time"];
                $score = trim(intercept_str("score=", "\n", $aicc_data));
                $status = trim(intercept_str("lesson_status=", "\n", $aicc_data));
                $lesson_location = trim(intercept_str("lesson_location=", "\n", $aicc_data));
                $visited= trim(intercept_str("visited=", "\n", $aicc_data));
                $core_exit = $visited;
                $max_score = "100";
                $core_data = $_SESSION["aicc_data"];
                fwrite($texthand, "写入数据库2".$aicc_data);
                $sql="insert into lp_item_view (lp_item_id,lp_view_id,view_count,start_time,total_time,
                      status,suspend_data,lesson_location,core_exit,max_score,score)
                      VALUES ('" . $lastitemid . "','" . $lpviewid . "',1,'" . $start_time . "','" . $total_time . "','" . $status . "','" . $core_data . "','" . $lesson_location . "','".$core_exit."','" . $max_score ."','".$score. "')";
                $mysql->query($sql);
                fwrite($texthand, "是否写入数据库这条记录".mysql_error());
            }else{
                //可以放入session11
                $aicc_data=trim($aicc_data);
                $core_data=$aicc_data.$_SESSION["aicc_data"];
                $_SESSION["aicc_data"]=$core_data;

            }
        }else{
            $core_data="";
            $lesson_location="";
            $status="";
            $score="";
            $total_time="";
            $sql="select * from lp_item_view where lp_view_id='".$lpviewid;
            $res=$mysql->query($sql);
            $arr=$mysql->fetch_array($res);
            fwrite($texthand, "读取数据库aicc记录");
            fwrite($texthand, "echo");
            if($mysql->num_rows($res)!=0) {
                $core_data=$arr["suspend_data"];
                $lesson_location=$arr["lesson_location"];
                $status=$arr["status"];
                $score=$arr["score"];
                $total_time=$arr["total_time"];
                $visited=$arr["core_exit"];
                fwrite($texthand, "echo1".$aicc_data);
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
                visited='.$visited;

            }else{
                fwrite($texthand, "echo2".$aicc_data);
                echo
                'error=0
                error_text=Successful
                aicc_data=
                [core]
                lesson_location=
                lesson_status=
                score=
                time=
                [core_lesson]
                visited=visited';
            }
        }
    }
}else{
    echo "<script>alert('flash课件出错');</script>";
}
fwrite($texthand,"结束");
function intercept_str($start,$end,$str)
{
    if(empty($start)||empty($end)||empty($str))return "参数不正确";
    $strarr=explode($start,$str);
    $str=$strarr[1];
    $strarr=explode($end,$str);
    return $strarr[0];
}
//处理lp_view记录表

function updateOrInsert_lp_view($lpid,$userid,$mysql,$aicc_data)
{
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
    return $arr_lp_view;
}
//处理lp_view_item记录表
