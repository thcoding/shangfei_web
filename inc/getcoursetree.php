<?php
include "../inc/mysql.php";
include "../inc/function.php";

session_start();
include "../inc/config.php";
$courseid=$_SESSION["courseid"];
$userid=$_SESSION["userid"];
$tree=getCourseTreeByid($userid,$courseid);
echo "[".$tree."]";
function getCourseTreeByid($userid,$courseid){//通过用户id和课程id获取课程目录及学习状态的json串，返回给界面调用
global $mysql;
$id = $courseid;
$res = $mysql->query("select id,name from coursecategory where courseid=".$id." order by id");//查找courseid下所有的一级目录
logger("userid:$userid; courseid:$courseid;");
$arr["id"]=$courseid;
while($arr = $mysql->fetch_array($res)){//取出一级目录
	$arr["open"] = true;
	$res2 = $mysql->query("select id,name from coursecategory where parentid=".$arr["id"]." order by id");//查找一级目录下的所有二级目录

    $num2 = $mysql->num_rows($res2);//一级目录下二级目录的个数
	if($num2==0){//二级目录个数为0，说明该一级目录为叶子节点，下一行while语句为false，开始为其添加课程单元的children
		$arr["children"] = getCourseUnitsByCategoryid($userid,$arr["id"]);
	}
	while($arr2 = $mysql->fetch_array($res2)){//存在二级目录，继续按逻辑寻找三级目录
		$arr2["open"] = true;
		$res3 = $mysql->query("select id,name from coursecategory where parentid=".$arr2["id"]." order by id");

        $num3 = $mysql->num_rows($res3);
		if($num3==0){
			$arr2["children"] = getCourseUnitsByCategoryid($userid,$arr2["id"]);
		}
		while($arr3 = $mysql->fetch_array($res3)){
			$arr3["open"] = true;

			$res4 = $mysql->query("select id,name from coursecategory where parentid=".$arr3["id"]." order by id");
			$num4 = $mysql->num_rows($res4);
			if($num4==0){
				$arr3["children"] = getCourseUnitsByCategoryid($userid,$arr3["id"]);
			}
			while($arr4 = $mysql->fetch_array($res4)){
				$arr4["open"] = true;

				$res5 = $mysql->query("select id,name from coursecategory where parentid=".$arr4["id"]." order by id");
				$num5 = $mysql->num_rows($res5);
				if($num5==0){
					$arr4["children"] = getCourseUnitsByCategoryid($userid,$arr4["id"]);
				};
				while($arr5 = $mysql->fetch_array($res5)){
					$arr5["open"] = true;

					$res6 = $mysql->query("select id,name from coursecategory where parentid=".$arr5["id"]." order by id");
					$num6 = $mysql->num_rows($res6);
					if($num6==0){
						$arr5["children"] = getCourseUnitsByCategoryid($userid,$arr5["id"]);
					};
					while($arr6 = $mysql->fetch_array($res6)){
						$arr6["open"] = true;

						$res7 = $mysql->query("select id,name from coursecategory where parentid=".$arr6["id"]." order by id");
						$num7 = $mysql->num_rows($res7);
						if($num7==0){
							$arr6["children"] = getCourseUnitsByCategoryid($userid,$arr6["id"]);
						}
						while($arr7 = $mysql->fetch_array($res7)){
								$arr7["open"] = true;
								$arr7["name"] = $arr7["name"];
								$arr7["status"] = "";
								$arr7["totaltime"] = "";
								$arr7["score"] = "";
								$arr7["viewcount"] = "";
								$arr7["lasttime"] = "";
								$arr7["remark"] = "";
								$arr7["itemurl"] = "";
							$arr6["children"][] = $arr7;
						}
							$arr6["name"] = $arr6["name"];
							$arr6["status"] = "";
							$arr6["totaltime"] = "";
							$arr6["score"] = "";
							$arr6["viewcount"] = "";
							$arr6["lasttime"] = "";
							$arr6["remark"] = "";
							$arr6["itemurl"] = "";
						$arr5["children"][] = $arr6;
					}
						$arr5["name"] = $arr5["name"];
						$arr5["status"] = "";
						$arr5["totaltime"] = "";
						$arr5["score"] = "";
						$arr5["viewcount"] = "";
						$arr5["lasttime"] = "";
						$arr5["remark"] = "";
						$arr5["itemurl"] = "";
					$arr4["children"][] = $arr5;
				}
					$arr4["name"] = $arr4["name"];
					$arr4["status"] = "";
					$arr4["totaltime"] = "";
					$arr4["score"] = "";
					$arr4["viewcount"] = "";
					$arr4["lasttime"] = "";
					$arr4["remark"] = "";
					$arr4["itemurl"] = "";
				$arr3["children"][] = $arr4;
			}
				$arr3["name"] = $arr3["name"];
				$arr3["status"] = "";
				$arr3["totaltime"] = "";
				$arr3["score"] = "";
				$arr3["viewcount"] = "";
				$arr3["lasttime"] = "";
				$arr3["remark"] = "";
				$arr3["itemurl"] = "";
			$arr2["children"][] = $arr3;
		}
			$arr2["name"] = $arr2["name"];
			$arr2["status"] = "";
			$arr2["totaltime"] = "";
			$arr2["score"] = "";
			$arr2["viewcount"] = "";
			$arr2["lasttime"] = "";
			$arr2["remark"] = "";
			$arr2["itemurl"] = "";
		$arr["children"][] = $arr2;
	}
		$arr["name"] = $arr["name"];
		$arr["status"] = "";
		$arr["totaltime"] = "";
		$arr["score"] = "";
		$arr["viewcount"] = "";
		$arr["lasttime"] = "";
		$arr["remark"] = "";
		$arr["itemurl"] = "";
	$node["children"][] = $arr;
}

		$courseinfo = getCourseinfoById($id);
        $node["id"]="";
		$node["name"] = $courseinfo["title"];
		$node["status"] = "";
		$node["totaltime"] = "";
		$node["score"] = "";
		$node["viewcount"] = "";
		$node["lasttime"] = "";
		$node["remark"] = "";
		$node["itemurl"] = "";
//@$nodes = "children:".json_encode($node["children"],JSON_UNESCAPED_UNICODE);
//return json_encode($node,JSON_UNESCAPED_UNICODE);

return   json_encode($node,JSON_UNESCAPED_UNICODE);
}
function vtime($time) {
    $output = '';
    foreach (array(86400 => '天', 3600 => '小时', 60 => '分', 1 => '秒') as $key => $value) {
        if ($time >= $key) $output .= floor($time/$key) . $value;
        $time %= $key;
    }
    return $output;
}
function getCourseUnitsByCategoryid($userid,$categoryid){//通过用户id和目录id获取目录下的带有状态的课程单元，返回课程单元数组
    $courseunits = Array();
    global $mysql;
    //从该节点中选出所有课程单元版本
    $res = $mysql->query("select * from courseversion_rel_courseunitversion where coursecategoryid=".$categoryid);
    $arr = $mysql->fetch_array($res);//选出所有关于这个单元的版本记录
    $ids = substr($arr["courseunitversionids"],1,-1);//这个单元版本号的字符串
    //die("select * from coursegroup_rel_courseunitversion where coursegroupid=".$_GET["catid"]);
    $res = $mysql->query("select * from courseunitversion_rel_attachment where deleted=0 and id in ($ids) order by time desc");//选出目录下所包含的所有课程单元版本
    $courseunitArr = Array();
    while($arr = $mysql->fetch_array($res)){//得到courseunitversion_rel_attachment表中的一列
        //**获取lp_id**
        $lp_id = $arr["lpid"];

        //**获取附件信息，如果是普通文件，则供下载使用**
        $lesson_attachment = getAttachmentinfoById($arr["attachmentid"]);

        //获得课程单元名称**
        $lesson_courseunitInfo = getCourseUnitinfoById($arr["courseunitid"]);
        $lesson_courseunitName = $lesson_courseunitInfo["title"];
		//如果课程单元已被删除（或彻底删除），则不需要以下信息，重新执行下一次的while循环
		if(!$lesson_courseunitInfo||$lesson_courseunitInfo["deleted"]==1)
			continue;

        //获得课程单元版本名称**
        $lesson_courseunitversionName = $arr["versionname"];

        //获得课程单元版本类型**
        $lesson_packageType = $arr["lpid"]?"SCORM/AICC":"普通文件";

        //获得各种学习过程信息
        if($lesson_packageType!="SCORM/AICC"){//非"SCORM/AICC"课件，无学习过程
            $lesson_status = "无状态"; //学习状态：无状态、未学习、进行中、已完成
            $lesson_total_time = 0;   //学习时间
            $lesson_score = 0;        //分数
            $lesson_view_count=0;   //学习次数
            $lesson_lastview_time = 0;//最后访问日期
            $lesson_remarks="";      //备注

            $unitres = $mysql->query("SELECT * FROM `commonfile_view` where user_id = $userid and unitversion_id = ".$arr['id']."");
            $unitarr = $mysql->fetch_array($unitres);
            if ($unitarr) {
                //$lesson_status = "已完成"; //学习状态：无状态、未学习、进行中、已完成
                $lesson_total_time = vtime($unitarr['total_time']);   //学习时间
                $lesson_view_count = $unitarr['view_count'];   //学习次数
                $lesson_lastview_time = $unitarr['last_time'];//最后访问日期
            }
			
			$lesson_lastview_time = $lesson_lastview_time!=0?date('Y-m-d H:i:s',$lesson_lastview_time):"未开始";

            $href = $lesson_attachment["indexfile"]==""?$lesson_attachment["path"]:$lesson_attachment["indexfile"];

            $courseunit["name"] = $lesson_courseunitName."(".$lesson_courseunitversionName.")";
            $courseunit["status"] = $lesson_status;
            $courseunit["totaltime"] = vtime($lesson_total_time);
            $courseunit["score"] = $lesson_score;
            $courseunit["viewcount"] = $lesson_view_count;
            $courseunit["lasttime"] = $lesson_lastview_time;
            $courseunit["remark"] = $lesson_remarks;
            $courseunit["itemurl"] = "<a href='".$href."'><img src='../img/down.gif' alt='下载' title='下载'></a>";

            $courseunits[] = $courseunit;
        }
        else{//"SCORM/AICC"课件，可记录学习状态
            $lesson_status = ""; //学习状态：无状态、未学习、进行中、已完成（lp_item_view表中参数）
            $lesson_total_time= 0;   //学习时间（lp_item_view表中参数）
            $lesson_score = 0;        //*分数*由于每个item里都有一个分数，故暂时不知道用哪个分数；分数是什么意思
            $lesson_view_count = 0;   //学习次数（lp_view表中参数）
            $lesson_lastview_time = 0;//最后访问日期（lp_item_view表中参数）
            $lesson_remarks="";      //*备注*
            $lesson_view_status="";
                //根据userid和lp_id获得lp_view表中的id；
                $res_lp_view = $mysql->query("select * from lp_view where lp_id= $lp_id and user_id = $userid ");
                $arr_lp_view = $mysql->fetch_array($res_lp_view);
                $lp_view_id = $arr_lp_view["id"];

                if($lp_view_id){//已经学习过该lp，则开始获取所有lp_item_view的信息（一个或多个）
                    //根据lp_view_id获得lp_item_view表中所有的lp_item_view信息
                    $res_lp_item_view = $mysql->query("select * from lp_item_view where lp_view_id= $lp_view_id ");

                    //根据每个lp_item_view的status判断lp中尚未完成的个数，如果存在尚未完成的item,则$lesson_status=incompeled
                    $incompleted_count = 0;//该lp中status为尚未完成的item个数；
                    while($arr_lp_item_view = $mysql->fetch_array($res_lp_item_view)){//依次取出lp_item_view信息

                        //$lesson_status
                        $lesson_item_status = $arr_lp_item_view["status"];//当前这个item的status
                        if(($lesson_item_status!='completed')&&($lesson_item_status!='complete')){//如果该item尚未完成
                            $incompleted_count++;
                        }
                        //$lesson_total_time
                        $lesson_total_time=$lesson_total_time+$arr_lp_item_view["total_time"];//当前这个item的total_time
                        $lesson_score=$arr_lp_item_view["score"];
                        //$lesson_view_count
                        $lesson_view_count =+ $arr_lp_item_view["view_count"];//lp_view表中的view_count
                        $lesson_view_status=$arr_lp_item_view["status"];
                        //$lesson_lastview_time;
                        $lesson_lastview_time = date('Y-m-d H:i:s',$arr_lp_item_view["start_time"]);//当前这个item的上次访问时间
                    }

                    if($incompleted_count!=0){//如果存在尚未完成的item，不只有一个item
                    $lesson_status = "进行中";

                    }
                    else{//所有lp_item_view都达到completed状态
                    $lesson_status = "已完成";
                    }
                    if($lesson_view_status=="F"){
                        $lesson_status="考试失败" ;
                    }
                    if($lesson_view_status=="P"){
                        $lesson_status="考试通过" ;
                    }

                }
                else{//尚未学习过该lp，则$lesson_status=尚未学习
                    $lesson_status = "未学习";

                }

            $courseunit["name"] = $lesson_courseunitName."(".$lesson_courseunitversionName.")";
            $courseunit["status"] = $lesson_status;
            $courseunit["totaltime"] = vtime($lesson_total_time);
            $courseunit["score"] = $lesson_score;
            $courseunit["viewcount"] = $lesson_view_count;
            $courseunit["lasttime"] = $lesson_lastview_time;
            $courseunit["remark"] = $lesson_remarks;
            $lp_id=$arr["lpid"];
            $res_lp = $mysql->query("select * from lp where id= $lp_id");
            $arr_lp = $mysql->fetch_array($res_lp);
            $type=1;//scorm
            $url='../admin/scorm/lp_view.php?id='.$lp_id;

            if($arr_lp["lp_type"]==3&&$arr_lp["lp_interface"]==0){
                $type=2;//普通aicc
                $url = "../upload/scorm/$arr_lp[parentdir]/main.html";

            }
            if($arr_lp["lp_type"]==3&&$arr_lp["lp_interface"]==1){
                $type=3;//考试aicc
                $url = "../upload/scorm/$arr_lp[parentdir]/xg.html?AICC_SID=$lp_id&AICC_URL=http%3a%2f%2flocalhost%3a8080%2fadmin%2fMyLessonAiccProcessor.php";
            }
            $dir=$arr_lp["parentdir"];
           $dir=phpescape($dir);
            //$dir=settype($d,"string");
            $courseunit["itemurl"] = "<a href=\"javascript:void(0);\" onclick=\"LaunchDueItem('$dir','$lp_id','$type')\" target=\"_blank\"><img src=\"../img/look.gif\" alt=\"查看\" title=\"查看\"></a>";
            $courseunits[] = $courseunit;
        }
    }

    return $courseunits;
}
function phpescape($str){
    preg_match_all("/[\x80-\xff].|[\x01-\x7f]+/",$str,$newstr);
    $ar = $newstr[0];
    $reString="";
    foreach($ar as $k=>$v){
        if(ord($ar[$k])>=127){
            $tmpString=bin2hex(iconv("GBK","ucs-2",$v));
            if (!eregi("WIN",PHP_OS)){
                $tmpString = substr($tmpString,2,2).substr($tmpString,0,2);
            }
            $reString.="%u".$tmpString;
        } else {
            $reString.= rawurlencode($v);
        }
    }
    return $reString;
}
?>
