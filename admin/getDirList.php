<ul>
<?php

include "../inc/function.php";
include "../inc/config.php";

session_start();
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(isset($_SESSION["role"]) && ($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER)){
	$father = @isutf8($_GET["dir"])?iconv("UTF-8","gb2312",$_GET["dir"]):$_GET["dir"];
	$fileArr = dir_list($father);
	foreach($fileArr as $file){		
		$filename = str_replace($father."/","",$file);
		if(is_dir($file)){
			$file = iconv("gb2312","UTF-8",$file);
			$filename = iconv("gb2312","UTF-8",$filename);
			echo "<li><img src='../img/no-expanded.gif' dir='$file' onclick='showChildrenDir(\"$file\",this)'>".$filename."</li>";
		}else{
			$file = iconv("gb2312","UTF-8",$file);
			$filename = iconv("gb2312","UTF-8",$filename);
			echo "<li><label><input type='radio' name='indexfile' value='$file'>".$filename."</label></li>";
		}
		
	}
		

}else{
	die("What are you doing?");
}


?>
</ul>