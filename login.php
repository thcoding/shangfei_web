<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<?php
//包含相关php文件
include "inc/mysql.php";
include "inc/config.php";

//获取index.php中输入的用户名和密码
@$username = trim($_POST["username"]);
@$password = trim($_POST["password"]);

//从数据库中uer表中获取该用户名相关信息
$res_user = $mysql->query("select * from user where username='$username'");
$arr_user = $mysql->fetch_array($res_user);

if($arr_user["password"] == md5($password)){//判断用户密码是否符合
	if($arr_user["deleted"])die("<script>alert('您的帐号已被删除');location.href='index.php'</script>");

	$userid = $arr_user["id"];
	//从userlogin表中获取用户session信息
	$res_userlogin = $mysql->query("select * from userlogin where userid=".$userid);
	$arr_userlogin = $mysql->fetch_array($res_userlogin);
	if($mysql->num_rows($res_userlogin)>0){
		if(filesize(session_save_path()."/sess_".$arr_userlogin["sessionid"])>0 && (time()-filemtime(session_save_path()."/sess_".$arr_userlogin["sessionid"]))<$sessionTime){//已有用户登录，不允许登录
			die("<script>alert('该用户已经登录');location.href='index.php'</script>");
		}else{ //用户登录时间已过，正常登录
			session_start();
			setcookie(session_name(),session_id(),time()+$sessionTime,"/");

			$sessionid = session_id();	
			$mysql->query("REPLACE into userlogin(userid,sessionid) values ('$userid','$sessionid')");//在userlogin表中添加用户session信息

			$_SESSION["userid"]   = $userid;
			$_SESSION["username"] = $arr_user["username"];
			$_SESSION["realname"] = $arr_user["realname"];
			$_SESSION["role"]     = $arr_user["role"];
			if($arr_user["role"] == STUDENT){//根据用户角色跳转至相应用户界面
				header("Location:student/mycourse.php");
			}else{
				header("Location:admin/courseUnit.php");
			}
		}
	}else{//用户未登录过，正常登录
		session_start();
		setcookie(session_name(),session_id(),time()+$sessionTime,"/");

		$sessionid = session_id();	
		$mysql->query("REPLACE into userlogin(userid,sessionid) values ('$userid','$sessionid')");

		$_SESSION["userid"]   = $userid;
        $_SESSION["username"] = $arr_user["username"];
		$_SESSION["realname"] = $arr_user["realname"];
		$_SESSION["role"]     = $arr_user["role"];
		if($arr_user["role"] == STUDENT){//根据用户角色跳转至相应用户界面
			header("Location:student/mycourse.php");
		}else{
			header("Location:admin/courseUnit.php");
		}
	}

	
}else{
	echo "<script>alert('用户名或密码错误，请重新输入！');location.href='index.php'</script>";
}

?>