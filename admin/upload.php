<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<?php

set_time_limit(0);
date_default_timezone_set("PRC");
session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
include "../inc/unzip.class.php";
include "../inc/function.php";
include "../inc/mysql.php";

$courseunitId = $_POST["id"];
@$rewrite      = $_POST["rewrite"];
$unzip        = $_POST["unzip"];
$packageType  = $_POST["packageType"];
@$versionname  = $_POST["versionname"];

if($packageType==1){  //普通文件
	$up_folder = "../upload/files/".$courseunitId."/";
	if(!file_exists($up_folder)) mkdir($up_folder);

	if(isset($_FILES['file'])){
		if($_FILES['file']['error'] == 0){
			$srcfile  = $_FILES['file']['tmp_name'];
			$title = $_FILES['file']['name'];
			$size = round($_FILES['file']['size']/1000);
			$ext = file_ext($title);
			$destfile = $up_folder.date("YmdHis-").rand(1000,9999).".".$ext;
			$time = date("Y-m-d H:i:s");
			$userid = $_SESSION["userid"];
			if(move_uploaded_file($srcfile,$destfile)){

				$mysql->query("insert into attachment(title,size,type,path,time,unzip) values ('$title','$size','$ext','$destfile','$time','$unzip')");
				$attachmentId = $mysql->insert_id();
		
				$res = $mysql->query("select * from courseunitversion_rel_attachment where deleted=0 and courseunitid=".$courseunitId);
				if($mysql->num_rows($res)==0){
					$mysql->query("insert into courseunitversion_rel_attachment (courseunitid,attachmentid,versionname,userid,time) values ('$courseunitId','$attachmentId','默认版本','$userid','$time')");
				}else{
					if($rewrite){
						$mysql->query("update courseunitversion_rel_attachment set attachmentid='$attachmentId',userid='$userid',lpid='0' where id=".$_POST["versionid"]);
					}else{
						$mysql->query("insert into courseunitversion_rel_attachment (courseunitid,attachmentid,versionname,userid,time) values ('$courseunitId','$attachmentId','".$versionname."','$userid','$time')");
					}
				}

				if($unzip && $ext=="zip"){
					$unzip = new unzip();
					$unzip->extract_zip($destfile,$up_folder."unzip/");
				}

				header("Location:courseUnitShow.php?id=".$courseunitId);

			}else{
				die("上传文件时发生错误");
			}
		}
	}
}else if($packageType==2){ // SCORM/AICC
	$userid = $_SESSION["userid"];
	include "scorm/lp_upload.php";
}

?>