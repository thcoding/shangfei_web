<?php
include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/config.php";

setCoursetoUser();
function setCoursetoUser(){//1.将课程分配给用户
                            //2.将课程分配用户组
                            //3.将课程组分配给用户
                            //4.课程组到用户组

	global $mysql;

	//请求的信息，均为数组
	$courseids = $_POST["course_ids"]?$_POST["course_ids"]:0;
	$userids = $_POST["user_ids"]?$_POST["user_ids"]:0;
    $coursegroupids=$_POST["course_group_ids"]?$_POST["course_group_ids"]:0;
    $usergroupids=$_POST["user_group_ids"]?$_POST["user_group_ids"]:0;
	//需要返回的信息
	$returninfo = Array();//$returninfo["data"] = $data; $returninfo["info"] = $info;$returninfo["status"] = $status;
		$data = "";
		$info = "";
		$status = 200;
	
	if($courseids==0||$userids==0||$coursegroupids==0||$usergroupids==0){//请求出错，没有课程id或用户id
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
    $newcoursegroupstr=",";
    for($i=0; $i<count($coursegroupids); $i++){//获取课程组字符串
        $newcoursegroupstr = str_replace(",".$coursegroupids[$i].",",",",$newcoursegroupstr);
        $newcoursegroupstr .= $coursegroupids[$i].",";
    }
	//开始为用户分配课程
    /*****修改
    name：wuqi
    time：2015/9/5
    新需求:向用户组添加用户和向课程组添加课程后会用户会自动注册上课程
    ====>>修改*1.为用户分配课程
     *********2.用户组分配课程组
     * *******3.为用户分配课程组
     * *******4.为用户组分配课程
     ******/
    //1.为用户分配课程
	for($i=0; $i<count($userids); $i++){

		$newcourse_tempstr = $newcoursestr;
		
		$res = $mysql->query("select * from user_rel_course where userid=".$userids[$i]);//获取到用户
		$arr = $mysql->fetch_array($res);//获得用户数组

        //修改user_rel_coures表
		if($arr){//表中已有该用户关联课程的数据
			$courseids0      = $arr["courseids"];//获得原有的课程id
			$arr_temp = explode(",",$courseids0);
			
			for($m=0; $m<count($arr_temp); $m++){
				$newcourse_tempstr = str_replace(",".$arr_temp[$m].",",",",$newcourse_tempstr);//如果有重复课程，则删除
			}
				
			$newcourse_tempstr = $arr["courseids"].substr($newcourse_tempstr,1);
			$mysql->query("update user_rel_course set courseids=".$newcourse_tempstr."where userid=".$userids[$i]);
		}else{//表中暂无该用户关联的课程的数据，insert
			$mysql->query("insert into user_rel_course (userid,courseids,) values ('".$userids[$i]."','".$newcoursestr."')");
		}	
			
	}


    //2.用户组分配课程组
    for($i=0; $i<count($usergroupids); $i++){

        $newcoursegroup_tempstr = $newcoursegroupstr;
        $res = $mysql->query("select * from usergroup_rel_course where usergroupid=".$usergroupids[$i]);//获取到用户
        $arr = $mysql->fetch_array($res);//获得用户组

        //修改usergroup_rel_coures表
        if($arr){//表中已有该用户关联课程的数据
            $coursegroupids0 = $arr["coursegroupids"];//获得原有的课程id
            $arr_temp = explode(",",$coursegroupids0);

            for($m=0; $m<count($arr_temp); $m++){
                $newcoursegroup_tempstr = str_replace(",".$arr_temp[$m].",",",",$newcoursegroup_tempstr);//如果有重复课程，则删除
            }

            $newcoursegroup_tempstr = $arr["coursegroupids"].substr($newcoursegroup_tempstr,1);
            $mysql->query("update usergroup_rel_course set coursegroupids='$newcoursegroup_tempstr' where usergroupid=".$usergroupids[$i]);
        }else{//表中暂无该用户关联的课程的数据，insert
            $mysql->query("insert into usergroup_rel_course (usergroupid,coursegroupids) values ('".$usergroupids[$i]."','".$newcoursegroupstr."')");
        }

    }



    //3.为用户分配课程组
    //user_rel_course表
    //coursegroup===>>>user
    for($i=0; $i<count($userids); $i++){

        $newcoursegroup_tempstr = $newcoursegroupstr;
        $res = $mysql->query("select * from user_rel_course where userid=".$userids[$i]);//获取到用户
        $arr = $mysql->fetch_array($res);//获得用户

        //修改user_rel_coures表
        if($arr){//表中已有该用户关联课程的数据
            $coursegroupids0 = $arr["coursegroupids"];//获得原有的课程id
            $arr_temp = explode(",",$coursegroupids0);

            for($m=0; $m<count($arr_temp); $m++){
                $newcoursegroup_tempstr = str_replace(",".$arr_temp[$m].",",",",$newcoursegroup_tempstr);//如果有重复课程，则删除
            }

            $newcoursegroup_tempstr = $arr["coursegroupids"].substr($newcoursegroup_tempstr,1);
            $mysql->query("update user_rel_course set coursegroupids='$newcoursegroup_tempstr' where userid=".$userids[$i]);
        }else{//表中暂无该用户关联的课程的数据，insert
            $mysql->query("insert into user_rel_course (userid,coursegroupids) values ('".$userids[$i]."','".$newcoursegroupstr."')");
        }

    }


    //4.为用户组分配课程
    //usergroup_rel_course表
    for($i=0; $i<count($usergroupids); $i++){

        $newcourse_tempstr = $newcoursestr;
        $res = $mysql->query("select * from usergroup_rel_course where usergroupid=".$usergroupids[$i]);//获取到用户组
        $arr = $mysql->fetch_array($res);//获得用户组

        //修改usergroup_rel_coures表
        if($arr){//表中已有该用户关联课程的数据
            $courseids0 = $arr["courseids"];//获得原有的课程id
            $arr_temp = explode(",",$courseids0);

            for($m=0; $m<count($arr_temp); $m++){
                $newcourse_tempstr = str_replace(",".$arr_temp[$m].",",",",$newcourse_tempstr);//如果有重复课程，则删除
            }

            $newcourse_tempstr = $arr["courseids"].substr($newcourse_tempstr,1);
            $mysql->query("update usergroup_rel_course set courseids='$newcourse_tempstr' where usergroupid=".$usergroupids[$i]);
        }else{//表中暂无该用户关联的课程的数据，insert
            $mysql->query("insert into usergroup_rel_course (usergroupid,courseids) values ('".$usergroupids[$i]."','".$newcoursestr."')");
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