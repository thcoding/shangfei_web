<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<?php

session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(isset($_SESSION["role"]) && ($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER)){
	include "../inc/mysql.php";
	include "../inc/function.php";
	$userid = $_SESSION["userid"];
	switch($_REQUEST["type"]){
		case 1: //课程单元(组)分配到课程单元组

			@$courseUnitArr        = $_POST["courseUnit"];
			@$courseUnitGroupArr   = $_POST["courseUnitGroup"];
			@$toCourseUnitGroupArr = $_POST["toCourseUnitGroup"];

			if(count($courseUnitArr)==0 && count($courseUnitGroupArr)==0){
				echo "<script>alert('请在左侧至少选择一个课程单元或课程单元组');location.href='courseUnit_to_group.php'</script>";
				break;
			}
			if(count($toCourseUnitGroupArr)==0){
				echo "<script>alert('请在右侧至少选择一个课程单元组');location.href='courseUnit_to_group.php'</script>";
				break;
			}

			$str1 = $str2 = ",";
			for($i=0; $i<count($courseUnitArr); $i++){
				$str1 = str_replace(",".$courseUnitArr[$i].",",",",$str1);
				$str1 .= $courseUnitArr[$i].",";
			}
			for($i=0; $i<count($courseUnitGroupArr); $i++){
				$str2 .= $courseUnitGroupArr[$i].",";
			}

			for($i=0; $i<count($toCourseUnitGroupArr); $i++){

				$str3 = $str1;
				$str4 = $str2;

				$res = $mysql->query("select * from courseunitgroup where groupid=".$toCourseUnitGroupArr[$i]);
				$arr = $mysql->fetch_array($res);
				if($arr){
					$courseunitids0      = $arr["courseunitids"];
					$courseunitgroupids0 = $arr["courseunitgroupids"];
					$arr1 = explode(",",$courseunitids0);
					for($m=0; $m<count($arr1); $m++){
						$str3 = str_replace(",".$arr1[$m].",",",",$str3);
					}
					$arr2 = explode(",",$courseunitgroupids0);
					for($m=0; $m<count($arr2); $m++){
						$str4 = str_replace(",".$arr2[$m].",",",",$str4);
					}
					$str3 = $arr["courseunitids"].substr($str3,1);
					$str4 = $arr["courseunitgroupids"].substr($str4,1);
				}

				$mysql->query("replace into courseunitgroup (groupid,courseunitids,courseunitgroupids) values ('".$toCourseUnitGroupArr[$i]."','".$str3."','".str_replace(",".$toCourseUnitGroupArr[$i].",",",",$str4)."')");
			}		
			
			echo "<script>alert('分配成功');location.href='courseUnit_to_group.php'</script>";
			break;
		
		case 2: //课程(组)分配到课程组

			@$courseArr        = $_POST["course"];
			@$courseGroupArr   = $_POST["courseGroup"];
			@$toCourseGroupArr = $_POST["toCourseGroup"];

			if(count($courseArr)==0 && count($courseGroupArr)==0){
				echo "<script>alert('请在左侧至少选择一个课程或课程组');location.href='course_to_group.php'</script>";
				break;
			}
			if(count($toCourseGroupArr)==0){
				echo "<script>alert('请在右侧至少选择一个课程组');location.href='course_to_group.php'</script>";
				break;
			}

			$str1 = $str2 = ",";
			for($i=0; $i<count($courseArr); $i++){
				$str1 = str_replace(",".$courseArr[$i].",",",",$str1);
				$str1 .= $courseArr[$i].",";
			}
			for($i=0; $i<count($courseGroupArr); $i++){
				$str2 .= $courseGroupArr[$i].",";
			}

			for($i=0; $i<count($toCourseGroupArr); $i++){

				$str3 = $str1;
				$str4 = $str2;

				$res = $mysql->query("select * from coursegroup where groupid=".$toCourseGroupArr[$i]);
				$arr = $mysql->fetch_array($res);
				if($arr){
					$courseids0      = $arr["courseids"];
					$coursegroupids0 = $arr["coursegroupids"];
					$arr1 = explode(",",$courseids0);
					for($m=0; $m<count($arr1); $m++){
						$str3 = str_replace(",".$arr1[$m].",",",",$str3);
					}
					$arr2 = explode(",",$coursegroupids0);
					for($m=0; $m<count($arr2); $m++){
						$str4 = str_replace(",".$arr2[$m].",",",",$str4);
					}
					$str3 = $arr["courseids"].substr($str3,1);
					$str4 = $arr["coursegroupids"].substr($str4,1);
				}
				//die("replace into coursegroup (groupid,courseids,coursegroupids) values ('".$toCourseGroupArr[$i]."','".$str3."','".str_replace(",".$toCourseGroupArr[$i].",",",",$str4)."')");
				$mysql->query("replace into coursegroup (groupid,courseids,coursegroupids) values ('".$toCourseGroupArr[$i]."','".$str3."','".str_replace(",".$toCourseGroupArr[$i].",",",",$str4)."')");
			}		
			
			echo "<script>alert('分配成功');location.href='course_to_group.php'</script>";
			break;

		case 3: //课程单元(组)分配到课程（组）
			@$courseUnitArr      = $_POST["courseUnit"];
			@$courseUnitGroupArr = $_POST["courseUnitGroup"];
			@$courseArr          = $_POST["course"];
			@$courseGroupArr     = $_POST["courseGroup"];

			if(count($courseUnitArr)==0 && count($courseUnitGroupArr)==0){
				echo "<script>alert('请在左侧至少选择一个课程单元或课程单元组');location.href='courseUnit_to_course.php'</script>";
				break;
			}
			if(count($courseArr)==0 && count($courseGroupArr)==0){
				echo "<script>alert('请在右侧至少选择一个课程或课程组');location.href='courseUnit_to_course.php'</script>";
				break;
			}

			$str1 = $str2 = $str5 = ",";
			for($i=0; $i<count($courseUnitArr); $i++){
				$versionid = (isset($_POST["v-".$courseUnitArr[$i]]) && $_POST["v-".$courseUnitArr[$i]]>0)?$_POST["v-".$courseUnitArr[$i]]:getLastestCourseUnitVersionidBycuid($courseUnitArr[$i]);
				$str1 = str_replace(",".$versionid.",",",",$str1);
				$str1 .= $versionid.",";

				$str5 .= $courseUnitArr[$i].","; //courseUnitIds;

			}
			for($i=0; $i<count($courseUnitGroupArr); $i++){
				$str2 .= $courseUnitGroupArr[$i].",";
			}

			for($i=0; $i<count($courseArr); $i++){

				$str3 = $str1;
				$str4 = $str2;

				$res = $mysql->query("select * from courseversion_rel_courseunitversion where courseid=".$courseArr[$i]);
				$arr = $mysql->fetch_array($res);
				if($arr){
					$courseunitversionids0 = $arr["courseunitversionids"];
					$courseunitids0 = $arr["courseunitids"];
					$courseunitgroupids0 = $arr["courseunitgroupids"];
					$arr3 = explode(",",$courseunitids0);
					for($m=0; $m<count($arr3); $m++){
						$str5 = str_replace(",".$arr3[$m].",",",",$str5);
					}
					$arr1 = explode(",",$courseunitversionids0);
					for($m=0; $m<count($arr1); $m++){
						$str3 = str_replace(",".$arr1[$m].",",",",$str3);
					}
					$arr2 = explode(",",$courseunitgroupids0);
					for($m=0; $m<count($arr2); $m++){
						$str4 = str_replace(",".$arr2[$m].",",",",$str4);
					}
					$str5 = $arr["courseunitids"].substr($str5,1);
					$str3 = $arr["courseunitversionids"].substr($str3,1);
					$str4 = $arr["courseunitgroupids"].substr($str4,1);

					$mysql->query("update courseversion_rel_courseunitversion set courseunitids='$str5',courseunitversionids='$str3',courseunitgroupids='$str4' where courseid=".$courseArr[$i]);
				}else{
					$mysql->query("insert into courseversion_rel_courseunitversion (courseid,courseunitids,courseunitversionids,courseunitgroupids) values ('".$courseArr[$i]."','".$str5."','".$str3."','".$str4."')");
				}				
			}
			
			for($i=0; $i<count($courseGroupArr); $i++){

				$str3 = $str1;
				$str4 = $str2;

				$res = $mysql->query("select * from coursegroup_rel_courseunitversion where coursegroupid=".$courseGroupArr[$i]);
				$arr = $mysql->fetch_array($res);
				if($arr){
					$courseunitversionids0 = $arr["courseunitversionids"];
					$courseunitgroupids0 = $arr["courseunitgroupids"];
					$arr1 = explode(",",$courseunitversionids0);
					for($m=0; $m<count($arr1); $m++){
						$str3 = str_replace(",".$arr1[$m].",",",",$str3);
					}
					$arr2 = explode(",",$courseunitgroupids0);
					for($m=0; $m<count($arr2); $m++){
						$str4 = str_replace(",".$arr2[$m].",",",",$str4);
					}
					$str3 = $arr["courseunitversionids"].substr($str3,1);
					$str4 = $arr["courseunitgroupids"].substr($str4,1);
					//die("update coursegroup_rel_courseunitversion set coursegroupid='".$courseGroupArr[$i]."',courseunitversionids='$str3',courseunitgroupids='$str4'");
					$mysql->query("update coursegroup_rel_courseunitversion set coursegroupid='".$courseGroupArr[$i]."',courseunitversionids='$str3',courseunitgroupids='$str4'");
				}else{
					$mysql->query("insert into coursegroup_rel_courseunitversion (coursegroupid,courseunitversionids,courseunitgroupids,userid) values ('".$courseGroupArr[$i]."','".$str3."','".$str4."','$userid')");
				}				
			}
			
			echo "<script>alert('分配成功');location.href='courseUnit_to_course.php'</script>";
			break;

		case 4: //用户(组)分配到用户组

			@$userArr        = $_POST["user"];
			@$userGroupArr   = $_POST["userGroup"];
			@$touserGroupArr = $_POST["toUserGroup"];

			if(count($userArr)==0 && count($userGroupArr)==0){
				echo "<script>alert('请在左侧至少选择一个用户或用户组');location.href='user2group.php'</script>";
				break;
			}
			if(count($touserGroupArr)==0){
				echo "<script>alert('请在右侧至少选择一个用户组');location.href='user2group.php'</script>";
				break;
			}

			$str1 = $str2 = ",";
			for($i=0; $i<count($userArr); $i++){
				$str1 = str_replace(",".$userArr[$i].",",",",$str1);
				$str1 .= $userArr[$i].",";
			}
			for($i=0; $i<count($userGroupArr); $i++){
				$str2 .= $userGroupArr[$i].",";
			}

			for($i=0; $i<count($touserGroupArr); $i++){

				$str3 = $str1;
				$str4 = $str2;

				$res = $mysql->query("select * from usergroup where groupid=".$touserGroupArr[$i]);
				$arr = $mysql->fetch_array($res);
				if($arr){
					$userids0      = $arr["userids"];
					$usergroupids0 = $arr["usergroupids"];
					$arr1 = explode(",",$userids0);
					for($m=0; $m<count($arr1); $m++){
						$str3 = str_replace(",".$arr1[$m].",",",",$str3);
					}
					$arr2 = explode(",",$usergroupids0);
					for($m=0; $m<count($arr2); $m++){
						$str4 = str_replace(",".$arr2[$m].",",",",$str4);
					}
					$str3 = $arr["userids"].substr($str3,1);
					$str4 = $arr["usergroupids"].substr($str4,1);
				}
				//die("replace into usergroup (groupid,userids,usergroupids) values ('".$touserGroupArr[$i]."','".$str3."','".str_replace(",".$touserGroupArr[$i].",",",",$str4)."')");
				$mysql->query("replace into usergroup (groupid,userids,usergroupids) values ('".$touserGroupArr[$i]."','".$str3."','".str_replace(",".$touserGroupArr[$i].",",",",$str4)."')");
			}		
			
			echo "<script>alert('分配成功');location.href='user2group.php'</script>";
			break;
		
		case 5: //课程(组)分配到用户（组）
			@$courseArr      = $_POST["course"];
			@$courseGroupArr = $_POST["courseGroup"];
			@$userArr        = $_POST["user"];
			@$userGroupArr   = $_POST["userGroup"];

			if(count($courseArr)==0 && count($courseGroupArr)==0){
				echo "<script>alert('请在左侧至少选择一个课程或课程组');location.href='course_to_user.php'</script>";
				break;
			}
			if(count($userArr)==0 && count($userGroupArr)==0){
				echo "<script>alert('请在右侧至少选择一个用户或用户组');location.href='course_to_user.php'</script>";
				break;
			}

			$str1 = $str2 = ",";
			for($i=0; $i<count($courseArr); $i++){
				$str1 = str_replace(",".$courseArr[$i].",",",",$str1);
				$str1 .= $courseArr[$i].",";
			}
			for($i=0; $i<count($courseGroupArr); $i++){
				$str2 .= $courseGroupArr[$i].",";
			}

			for($i=0; $i<count($userArr); $i++){

				$str3 = $str1;
				$str4 = $str2;

				$res = $mysql->query("select * from user_rel_course where userid=".$userArr[$i]);
				$arr = $mysql->fetch_array($res);
				if($arr){
					$courseids0      = $arr["courseids"];
					$coursegroupids0 = $arr["coursegroupids"];
					$arr1 = explode(",",$courseids0);
					for($m=0; $m<count($arr1); $m++){
						$str3 = str_replace(",".$arr1[$m].",",",",$str3);
					}
					$arr2 = explode(",",$coursegroupids0);
					for($m=0; $m<count($arr2); $m++){
						$str4 = str_replace(",".$arr2[$m].",",",",$str4);
					}
					$str3 = $arr["courseids"].substr($str3,1);
					$str4 = $arr["coursegroupids"].substr($str4,1);

					$mysql->query("update user_rel_course set courseids='$str3',coursegroupids='$str4' where userid=".$userArr[$i]);
				}else{
					$mysql->query("insert into user_rel_course (userid,courseids,coursegroupids) values ('".$userArr[$i]."','".$str3."','".$str4."')");
				}				
			}
			
			for($i=0; $i<count($userGroupArr); $i++){

				$str3 = $str1;
				$str4 = $str2;

				$res = $mysql->query("select * from usergroup_rel_course where usergroupid=".$userGroupArr[$i]);
				$arr = $mysql->fetch_array($res);
				if($arr){
					$courseids0      = $arr["courseids"];
					$coursegroupids0 = $arr["coursegroupids"];
					$arr1 = explode(",",$courseids0);
					for($m=0; $m<count($arr1); $m++){
						$str3 = str_replace(",".$arr1[$m].",",",",$str3);
					}
					$arr2 = explode(",",$coursegroupids0);
					for($m=0; $m<count($arr2); $m++){
						$str4 = str_replace(",".$arr2[$m].",",",",$str4);
					}
					$str3 = $arr["courseids"].substr($str3,1);
					$str4 = $arr["coursegroupids"].substr($str4,1);

					$mysql->query("update usergroup_rel_course set courseids='$str3',coursegroupids='$str4' where usergroupid=".$userGroupArr[$i]);
				}else{
					$mysql->query("insert into usergroup_rel_course (usergroupid,courseids,coursegroupids) values ('".$userGroupArr[$i]."','".$str3."','".$str4."')");
				}				
			}
			
			echo "<script>alert('分配成功');location.href='course_to_user.php'</script>";
			break;
		case 11: //课程单元(组)分配到课程单元组
			@$courseUnit        = $_POST["courseUnit"];
			@$courseUnitGroup   = $_POST["courseUnitGroup"];
			@$toCourseUnitGroup = $_POST["toCourseUnitGroup"];

			$mysql->query("replace into courseunitgroup (groupid,courseunitids,courseunitgroupids) values ('".$toCourseUnitGroup."','".$courseUnit."','".$courseUnitGroup."')");
			break;
		case 13: //课程单元(组)分配到课程
			@$courseUnit        = $_POST["courseUnit"];
			@$courseUnitVersion = $_POST["courseUnitVersion"];
			@$courseUnitGroup   = $_POST["courseUnitGroup"];
			@$toCourseCategoryId = $_POST["toCourseCategoryId"];

			$mysql->query("replace into courseversion_rel_courseunitversion (coursecategoryid,courseunitids,courseunitversionids,courseunitgroupids) values ('".$toCourseCategoryId."','".$courseUnit."','".$courseUnitVersion."','".$courseUnitGroup."')");
			break;
		case 14: //为用户组分配用户
			@$user        = $_POST["user"];
			@$userGroup   = $_POST["userGroup"];


            //筛选选新增的userid
            $res=$mysql->query("select * from usergroup WHERE groupid=".$userGroup);
            $newuserids=$user;
            $arr=$mysql->fetch_array($res);
            $olduserids=substr($arr["userids"],1,-1);
            $arr_olduserids=explode(",",$olduserids);
            for($i=0;$i<count($arr_olduserids);$i++){
                $newuserids=str_replace(",".$arr_olduserids[$i].",",",",$newuserids);
            }
            $mysql->query("replace into usergroup (groupid,userids) values ('".$userGroup."','".$user."')");
            //更新所有的用户的课程、课程组（user_rel_coure表）
            $user=$newuserids;
            $user=substr($user,1,-1);
            $open=fopen("c:/log.txt","a" );


            //获取usergroup的课程ids和课程组（usergroup_rel_course表）

            $res=$mysql->query("select * from usergroup_rel_course where usergroupid =".$userGroup);
            $arr=$mysql->fetch_array($res);
            $courseids=$arr["courseids"];

            $coursegroupids=substr($arr["coursegroupids"],1,-1);
            $arr_coursegroup=explode(",",$coursegroupids);
            for($i=0;$i<count($arr_coursegroup);$i++) {
                $res = $mysql->query("select * from coursegroup where groupid=" .$arr_coursegroup[$i]);
                $arr=$mysql->fetch_array($res);
                $courseids=$arr["courseids"].substr($courseids,1);
            }

            $arr_courseids=explode(",",$courseids);
            $arr_unique_courseids=array_unique($arr_courseids);
            $newaddcourseids="";
            for($m=0;$m<count($arr_unique_courseids);$m++){
                $newaddcourseids=$newaddcourseids.",".$arr_unique_courseids[$m];

            }


            //去掉重复项
            //将上述信息更新$coursegroupids和$newaddcourseids
            //表user_rel_coure表
            $res=$mysql->query("select * from user_rel_course where userid =".$user);
            $arr=$mysql->fetch_array($res);
            $oldcourseids=$arr["courseids"];
            //除掉重复项
            for($m=0;$m<count($arr_unique_courseids);$m++){
                $oldcourseids=str_replace(",".$arr_unique_courseids[$m].",",",",$oldcourseids);
            }
            $courseids=$oldcourseids.substr($newaddcourseids,1).",";



            $res=$mysql->query("select * from user_rel_course where userid=".$user);
            $arr=$mysql->fetch_array($res);
            $oldcoursegroupids=$arr['coursegroupids'];
            $newcoursegroupids=$oldcoursegroupids.$coursegroupids.",";
            //$newcoursegroupids=$coursegroupids;
            $courseids=substr($courseids,1);

            fwrite($open,"groupid".$newcoursegroupids);
            fwrite($open,"==========");
            fwrite($open,"courseid".$courseids);
            fwrite($open,"userid".$user);

            $res=mysql_query("select * from user_rel_course where userid=".$user);
            fwrite($open,"count".mysql_num_rows($res));
            if(mysql_num_rows($res)) {
                $mysql->query("update  user_rel_course set courseids='$courseids' where userid=".$user);
                $mysql->query("update  user_rel_course set coursegroupids='$newcoursegroupids' where userid=".$user);
            } else{
                fwrite($open,"success".mysql_num_rows($res));
                fclose($open);
                //插入新纪录
                $mysql->query("insert into user_rel_course (userid,courseids) VALUES ('" . $user . "','" . $courseids . "')");
                $mysql->query("insert into user_rel_course (userid,coursegroupids) VALUES ('" . $user . "','" . $newcoursegroupids . "')");
            }
            break;
		case 15: //为课程组分配课程
			@$course        = $_POST["course"];
			@$courseGroup   = $_POST["courseGroup"];
            //1.查看usergroup_rel_course
            $res=$mysql->query("select * from coursegroup where groupid=".$courseGroup);
            $arr = $mysql->fetch_array($res);
            $courseidstr=$arr["courseids"];
            $courseids=explode(",",$courseidstr);//老
            $newcoursestr=$course;
            for($i=0; $i<count($courseids); $i++){
                //获取新增的课程id
                $course = str_replace(",".$courseids[$i].",",",",$course);
            }
            $mysql->query("replace into coursegroup (groupid,courseids) values ('".$courseGroup."','".$newcoursestr."')");//更改课程组中课程的数据
            //相应的修改user_rel_course表

            //2.更新所有拥有该课程组的所有用户
            $res=$mysql->query("select * from user_rel_course where coursegroupids like '%".$courseGroup."%'");
            while($arr=$mysql->fetch_array($res)) {
                $arr_course=explode(",",$course);
                $belongcourseidsstr=$arr["courseids"];
                for($i=0; $i<count($arr_course); $i++){
                    $belongcourseidsstr = str_replace(",".$arr_course[$i].",",",",$belongcourseidsstr);
                }
                $newcourseidsstr=$belongcourseidsstr.substr($course,1);
                $mysql->query("update user_rel_course set courseids='$newcourseidsstr' where userid=" . $arr["userid"]);
            }

            break;
	}	

}else{
	die("What are you doing?");
}


?>