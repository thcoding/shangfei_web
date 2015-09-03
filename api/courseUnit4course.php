<?php 

$courseid = $postInfo["courseid"];
$user_id = $postInfo["userid"];
$leafcategory = array();//包含课程单元的课程目录节点（即叶子节点，不包含子目录节点）

//开始获取课程下的所有课程目录叶子节点（因为只有叶子节点真正包含课程单元）
$res = $mysql->query("select id,name from coursecategory where courseid=".$courseid." order by id");//查找courseid下所有的一级目录
while($arr = $mysql->fetch_array($res)){//取出一级目录
	$arr["open"] = true;
	$res2 = $mysql->query("select id,name from coursecategory where parentid=".$arr["id"]." order by id");//查找一级目录下的所有二级目录
	$num2 = $mysql->num_rows($res2);//一级目录下二级目录（子目录）的个数
	if($num2==0)$leafcategory[] = $arr["id"];//二级目录个数为0，说明该一级目录节点为叶子节点，下一行while语句为false
	while($arr2 = $mysql->fetch_array($res2)){//存在二级目录，继续按逻辑寻找三级目录
		$arr2["open"] = true;
		$res3 = $mysql->query("select id,name from coursecategory where parentid=".$arr2["id"]." order by id");
		$num3 = $mysql->num_rows($res3);
		if($num3==0)$leafcategory[] = $arr2["id"];
		while($arr3 = $mysql->fetch_array($res3)){
			$arr3["open"] = true;

			$res4 = $mysql->query("select id,name from coursecategory where parentid=".$arr3["id"]." order by id");
			$num4 = $mysql->num_rows($res4);
			if($num4==0)$leafcategory[] = $arr3["id"];
			while($arr4 = $mysql->fetch_array($res4)){
				$arr4["open"] = true;

				$res5 = $mysql->query("select id,name from coursecategory where parentid=".$arr4["id"]." order by id");
				$num5 = $mysql->num_rows($res5);
				if($num5==0)$leafcategory[] = $arr4["id"];
				while($arr5 = $mysql->fetch_array($res5)){
					$arr5["open"] = true;

					$res6 = $mysql->query("select id,name from coursecategory where parentid=".$arr5["id"]." order by id");
					$num6 = $mysql->num_rows($res6);
					if($num6==0)$leafcategory[] = $arr5["id"];
					while($arr6 = $mysql->fetch_array($res6)){
						$arr6["open"] = true;

						$res7 = $mysql->query("select id,name from coursecategory where parentid=".$arr6["id"]." order by id");
						$num7 = $mysql->num_rows($res7);
						if($num7==0)$leafcategory[] = $arr6["id"];
						while($arr7 = $mysql->fetch_array($res7)){
							$arr7["open"] = true;
							$arr6["children"][] = $arr7;
						}
						$arr5["children"][] = $arr6;
					}
					$arr4["children"][] = $arr5;
				}
				$arr3["children"][] = $arr4;
			}
			$arr2["children"][] = $arr3;
		}

		$arr["children"][] = $arr2;
	}

	$node["children"][] = $arr;
}
//课程下所有叶子节点目录获取完成

$host = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
$dirname = pathinfo($host)["dirname"];

//开始获取所有叶子目录节点下的课程单元（信息包含课程单元名称、课程单元版本名称、学习状态等）
$max = sizeof($leafcategory);//叶子目录节点数组的大小
$i = 0;
for($j = 0; $j < $max;$j++){//依次取出每个叶子目录节点

				//从该节点中选出所有课程单元版本
				$res = $mysql->query("select * from courseversion_rel_courseunitversion where coursecategoryid=".$leafcategory[$j]);
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

						$href = $lesson_attachment["indexfile"]==""?$lesson_attachment["path"]:$lesson_attachment["indexfile"];

						$commonfiledata = getCommonFileLearnStatus($user_id,$arr["id"]);

						$lesson_view_count = $commonfiledata["viewcount"];
						$lesson_total_time = $commonfiledata["totaltime"];
						$lesson_lastview_time = $commonfiledata["lasttime"];
						
						$returnInfo["list"]["courseUnit"][$i]["type"] = 0;//普通课件
						$returnInfo["list"]["courseUnit"][$i]["title"] = $lesson_courseunitName;
						$returnInfo["list"]["courseUnit"][$i]["url"] = $dirname."/".$href;
						$returnInfo["list"]["courseUnit"][$i]["status"] = $lesson_status;
						$returnInfo["list"]["courseUnit"][$i]["versionname"] = $lesson_courseunitversionName;

						//几个新增的参数
						$returnInfo["list"]["courseUnit"][$i]["unitversionid"] = $arr["id"];//单元版本id
						$returnInfo["list"]["courseUnit"][$i]["viewcount"] = $lesson_view_count;
						$returnInfo["list"]["courseUnit"][$i]["totaltime"] = $lesson_total_time;
						$returnInfo["list"]["courseUnit"][$i]["lasttime"] = $lesson_lastview_time;



					}
					else{//"SCORM/AICC"课件，可记录学习状态
						$lesson_status = ""; //学习状态：无状态、未学习、进行中、已完成（lp_item_view表中参数）
						$lesson_total_time= 0;   //学习时间（lp_item_view表中参数）
						$lesson_score = 0;        //*分数*由于每个item里都有一个分数，故暂时不知道用哪个分数；分数是什么意思
						$lesson_view_count = 0;   //学习次数（lp_view表中参数）
						$lesson_lastview_time = 0;//最后访问日期（lp_item_view表中参数）
						$lesson_remarks="";      //*备注*
							
							//根据userid和lp_id获得lp_view表中的id；
							$res_lp_view = $mysql->query("select * from lp_view where lp_id= $lp_id and user_id = $user_id ");
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
									$lesson_total_time+=$arr_lp_item_view["total_time"];//当前这个item的total_time

									//$lesson_view_count
									$lesson_view_count = $arr_lp_view["view_count"];//lp_view表中的view_count

									//$lesson_lastview_time;
									$lesson_lastview_time = $arr_lp_item_view["start_time"];//当前这个item的上次访问时间
								}

								if($incompleted_count!=0){//如果存在尚未完成的item
								$lesson_status = "进行中";
								}
								else{//所有lp_item_view都达到completed状态
								$lesson_status = "已完成";
								}
							}
							else{//尚未学习过该lp，则$lesson_status=尚未学习
								$lesson_status = "未学习";

							}
						
						$returnInfo["list"]["courseUnit"][$i]["type"] = 1;//scorm课件
						$returnInfo["list"]["courseUnit"][$i]["title"] = $lesson_courseunitName;
						$returnInfo["list"]["courseUnit"][$i]["url"] = "www.bnu.edu.cn";
						$returnInfo["list"]["courseUnit"][$i]["status"] = $lesson_status;
						$returnInfo["list"]["courseUnit"][$i]["versionname"] = $lesson_courseunitversionName;

						//几个新增的参数
						$returnInfo["list"]["courseUnit"][$i]["unitversionid"] = $arr["id"];//单元版本id
						$returnInfo["list"]["courseUnit"][$i]["viewcount"] = $lesson_view_count;
						$returnInfo["list"]["courseUnit"][$i]["totaltime"] = $lesson_total_time;
						$returnInfo["list"]["courseUnit"][$i]["lasttime"] = $lesson_lastview_time;
					}
					
					$i++;
				}

}

if($max==0||$i==0){//如果该课程无叶子目录节点，或叶子目录节点无课程单元，则赋一个无状态值
						$returnInfo["list"]["courseUnit"][0]["type"] = 0;
						$returnInfo["list"]["courseUnit"][0]["title"] = "该课程暂无课程单元";
						$returnInfo["list"]["courseUnit"][0]["url"] = "www.bnu.edu.cn";
						$returnInfo["list"]["courseUnit"][0]["status"] = "暂无状态";
						$returnInfo["list"]["courseUnit"][0]["versionname"] = "暂无版本信息";
}

function getCommonFileLearnStatus($userid,$unitversionid){//根据用户id和versionid获取状态
	global $mysql;
	$data = Array();

	$viewcount = 0;
	$totaltime = 0;
	$lasttime = 0;

	$res = $mysql->query("select * from commonfile_view where user_id=".$userid." and unitversion_id=".$unitversionid);
	if($arr = $mysql->fetch_array($res)){//表中有记录

		$viewcount = $arr["view_count"];
		$totaltime = $arr["total_time"];
		$lasttime = $arr["last_time"];
	
	}
	else{//表中无记录，该用户是第一次访问此附件，为表中插入一条新记录
		
		$mysql->query("insert into commonfile_view (user_id,unitversion_id,view_count,total_time,last_time) values ('$userid','$unitversionid','$viewcount','$totaltime','$lasttime')");
	}


	$data["viewcount"] = $viewcount;
	$data["totaltime"] = $totaltime;
	$data["lasttime"] = $lasttime;

	return $data;
}

?>

