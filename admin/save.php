<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<?php

session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");

if(isset($_SESSION["role"]) && ($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER)){
	include "../inc/mysql.php";
	$userid = $_SESSION["userid"];
	$id = isset($_REQUEST["id"])?$_REQUEST["id"]:0;
	$time = date("Y-m-d H:i:s");

	switch($_REQUEST["type"]){
		case 3: //课程单元
			@$title = trim($_POST["title"]);
			@$description = trim($_POST["description"]);
			@$key = trim($_POST["key"]);
			@$totalScore = trim($_POST["totalscore"]);
			@$passScore = trim($_POST["passscore"]);
			@$timelength = trim($_POST["timelength"]);
			@$startTime = trim($_POST["startTime"]);
			@$endTime = trim($_POST["endTime"]);
		
			$timelength_avail = ceil((strtotime($endTime)-strtotime($startTime))/60);//计算课程单元生效时间
			if($timelength_avail<=0){//检查起止时间是否合法
				echo "<script>alert('结束时间不能早于开始时间，请重新输入！');location.href='courseUnitSetting.php?id=$id'</script>";
				break;
			}
			if($timelength_avail<$timelength){//检查学习时间是否合法
				echo "<script>alert('学习时长不能大于起止时间之差，请重新输入！');location.href='courseUnitSetting.php?id=$id'</script>";
				break;
			}
			if($totalScore<$passScore){//检查满分与及格分是否合法
				echo "<script>alert('满分分数不能小于及格分数，请重新输入！');location.href='courseUnitSetting.php?id=$id'</script>";
				break;
			}
			if($title != ""){
				if($id >0 ){					
					$mysql->query("update courseunit set title='$title',description='$description',`key`='$key',totalscore='$totalScore',passscore='$passScore',timelength='$timelength',starttime='$startTime',endtime='$endTime' where id=".$id);
					header("Location:courseUnitShow.php?id=".$id);
				}else{
					$mysql->query("insert into courseunit (title,description,`key`,totalscore,passscore,timelength,starttime,endtime,time,userid) values ('$title','$description','$key','$totalScore','$passScore','$timelength','$startTime','$endTime','$time','$userid')");
					header("Location:courseUnit.php");
				}				
			}else{
				echo "<script>alert('课程单元名称不能为空！');location.href='courseUnitSetting.php?id=$id'</script>";
			}
			break;
		case 31:  //课程单元组
			@$title = trim($_POST["title"]);
			
			if($title != ""){
				//die("insert into `group (title,userid,type,time) values ('$title','$userid','2','$time')");
				if($id >0 ){
					$mysql->query("update `group` set title='$title' where id=".$id);
				}else{
					$mysql->query("insert into `group` (title,userid,type,time) values ('$title','$userid','2','$time')");
				}
				header("Location:courseUnitGroup.php");
			}else{
				echo "<script>alert('课程单元组名称不能为空！');location.href='courseUnitGroupAdd.php'</script>";
			}
			break;
		case 4: //课程
			@$title = trim($_POST["title"]);
			@$description = trim($_POST["description"]);
			@$key = trim($_POST["key"]);
			@$startTime = trim($_POST["startTime"]);
			@$endTime = trim($_POST["endTime"]);
			@$alwaysUpdate = trim($_POST["alwaysUpdate"]);
			@$type = trim($_POST["courseType"]);
			//echo $title;
			//die("die");
			if((strtotime($endTime)-strtotime($startTime))<=0){//检查学习时间是否合法
				echo "<script>alert('结束时间不能早于开始时间，请重新输入！');location.href='courseAdd.php?id=$id'</script>";
				break;
			}
			if($title != ""){
				if($id >0 ){
					$mysql->query("update course set title='$title',description='$description',`key`='$key',starttime='$startTime',endtime='$endTime',alwaysupdate='$alwaysUpdate',type='$type' where id=".$id);
					header("Location:course.php");
				}else{
					$mysql->query("insert into course (title,description,`key`,time,userid,starttime,endtime,alwaysupdate,type) values ('$title','$description','$key','$time','$userid','$startTime','$endTime','$alwaysUpdate','$type')");
					header("Location:course.php");
				}				
			}else{
				echo "<script>alert('课程名称不能为空！');location.href='courseUnit.php'</script>";
			}
			break;
		case 41:  //课程组
			@$title = trim($_POST["title"]);

			if($title != ""){
				//die("insert into `group (title,userid,type,time) values ('$title','$userid','2','$time')");
				if($id >0 ){
					$mysql->query("update `group` set title='$title' where id=".$id);
				}else{
					$mysql->query("insert into `group` (title,userid,type,time) values ('$title','$userid','3','$time')");
				}
				header("Location:courseGroup.php");
			}else{
				echo "<script>alert('课程组名称不能为空！');location.href='courseGroupAdd.php'</script>";
			}
			break;
		case 5: //用户
			@$username = trim($_POST["username"]);
			if(trim($_POST["password"])!=""){
				@$password = md5(trim($_POST["password"]));
			}else{
				$password = "";
			}			
			@$realname   = trim($_POST["realname"]);
			@$role       = trim($_POST["role"]);
			@$mail       = trim($_POST["mail"]);
			@$department = trim($_POST["department"]);
			@$userGroupId = trim($_POST["userGroup"]);
			if($id >0 ){//已存在该用户，可以为用户组直接添加该用户id
				if($password != ""){
					$mysql->query("update user set password='$password',realname='$realname',role='$role',mail='$mail',department='$department' where id=".$id);
				}else{
					$mysql->query("update user set realname='$realname',role='$role',mail='$mail',department='$department' where id=".$id);
				}
				//为用户组添加该用户
				if($userGroupId!=""){
					$resUserGroup = $mysql->query("select * from usergroup where groupid=".$userGroupId);
					$arrUserGroup = $mysql->fetch_array($resUserGroup);
					if($arrUserGroup){//usergroup表中存在该字段
						$userids0      = $arrUserGroup["userids"];//获取该组中所有用户id
						$arrUser = explode(",",$userids0);//切割为用户id数组
						$userIsIn = in_array(strval($id),$arrUser);
						if(!$userIsIn){//该组中尚无该用户，添加之
							$userids1 = $userids0.strval($id).",";
							$mysql->query("update usergroup set userids='$userids1' where groupid=".$userGroupId);
						}
					}else{//此组为新的用户组，尚未分配过用户
						$userids1 = ",".strval($id).",";
						$mysql->query("insert usergroup (groupid,userids,usergroupids) values ('$userGroupId','$userids1',',')");
					}
				}
				echo "<script>alert('编辑成功！');location.href='user.php'</script>";
			}else{//不存在用户，需重新取到用户id再添加该用户到用户组，insert完毕用户后降序userid查找到第一条即为新的用户
				if($username != "" && $password != ""){
					$res = $mysql->query("select * from user where username='".$username."'");
					if($mysql->num_rows($res)){
						echo "<script>alert('该用户名已经存在，请更换！');location.href='userAdd.php'</script>";
					}else{
						$mysql->query("insert into user (username,password,realname,role,time,mail,department) values ('$username','$password','$realname','$role','$time','$mail','$department')");						
						$query="select * from user order by id desc";
						$result=mysql_query($query);
						$arrLast = mysql_fetch_array($result);
						//添加成功后立马获得这条记录
						if($arrLast&&$userGroupId!=""){
							$resUserGroup = $mysql->query("select * from usergroup where groupid=".$userGroupId);
							$arrUserGroup = $mysql->fetch_array($resUserGroup);
							if($arrUserGroup){//usergroup表中存在该字段
								$userids0      = $arrUserGroup["userids"];//获取该组中所有用户id
								$arrUser = explode(",",$userids0);//切割为用户id数组
								$userIsIn = in_array(strval($arrLast["id"]),$arrUser);
								if(!$userIsIn){//该组中尚无该用户，添加之
									$userids1 = $userids0.strval($arrLast["id"]).",";
									$mysql->query("update usergroup set userids='$userids1' where groupid=".$userGroupId);
								}
							}else{//此组为新的用户组，尚未分配过用户
								$userids1 = ",".strval($arrLast["id"]).",";
								$mysql->query("insert usergroup (groupid,userids,usergroupids) values ('$userGroupId','$userids1',',')");
							}
						}
						echo "<script>alert('添加成功！');location.href='userAdd.php'</script>";
					}					
				}else{
					echo "<script>alert('用户名和密码不能为空！');location.href='userAdd.php'</script>";
				}
			}
			break;
		case 51:  //用户组
			@$title = trim($_POST["title"]);

			if($title != ""){
				//die("insert into `group (title,userid,type,time) values ('$title','$userid','2','$time')");
				if($id >0 ){
					$mysql->query("update `group` set title='$title' where id=".$id);
				}else{
					$mysql->query("insert into `group` (title,userid,type,time) values ('$title','$userid','1','$time')");
				}
				header("Location:userGroup.php");
			}else{
				echo "<script>alert('用户组名称不能为空！');location.href='userGroupAdd.php'</script>";
			}
			break;
	}
	
}else{
	die("What are you doing?");
}

?>