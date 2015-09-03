<?php
include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/config.php";

setCoursetoUser();
function setCoursetoUser(){//将课程分配给课程组

	global $mysql;

	//请求的信息，均为数组
	$courseids = $_POST["course_ids"]?$_POST["course_ids"]:0;
	$userids = $_POST["user_ids"]?$_POST["user_ids"]:0;

	//需要返回的信息
	$returninfo = Array();//$returninfo["data"] = $data; $returninfo["info"] = $info;$returninfo["status"] = $status;
		$data = "";
		$info = "";
		$status = 200;
	
	if($courseids==0||$userids==0){//请求出错，没有课程id或用户id
		$data = "";
		$info = "未选择用户或课程";
		$status = 400;
	    
		$returninfo["data"] = $data;
		$returninfo["info"] = $info;
		$returninfo["status"] = $status;

		echo json_encode($returninfo,JSON_UNESCAPED_UNICODE);		
		return;
	}
	
	$newcoursestr = ",";
	for($i=0; $i<count($courseids); $i++){//获取课程字符串
		$newcoursestr = str_replace(",".$courseids[$i].",",",",$newcoursestr);
		$newcoursestr .= $courseids[$i].",";
	}

	//开始为用户分配课程
	for($i=0; $i<count($userids); $i++){

		$newcourse_tempstr = $newcoursestr;
		
		$res = $mysql->query("select * from user_rel_course where userid=".$userids[$i]);//获取到用户
		$arr = $mysql->fetch_array($res);//获得用户数组

		if($arr){//表中已有该用户关联课程的数据
			$courseids0      = $arr["courseids"];//获得原有的课程id
			$arr_temp = explode(",",$courseids0);
			
			for($m=0; $m<count($arr_temp); $m++){
				$newcourse_tempstr = str_replace(",".$arr_temp[$m].",",",",$newcourse_tempstr);//如果有重复课程，则删除
			}
				
			$newcourse_tempstr = $arr["courseids"].substr($newcourse_tempstr,1);
			$mysql->query("update user_rel_course set courseids='$newcourse_tempstr' where userid=".$userids[$i]);
		}else{//表中暂无该用户关联的课程的数据，insert
			$mysql->query("insert into user_rel_course (userid,courseids) values ('".$userids[$i]."','".$newcoursestr."')");
		}	
			
	}

	
		$data = "分配成功";
		$info = "";
		$status = 200;
	    
		$returninfo["data"] = $data;
		$returninfo["info"] = $info;
		$returninfo["status"] = $status;

		echo json_encode($returninfo,JSON_UNESCAPED_UNICODE);		
}

?>