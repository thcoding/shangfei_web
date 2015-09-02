<ul>
<?php

include "../inc/function.php";
include "../inc/mysql.php";
include "../inc/config.php";

session_start();
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(isset($_SESSION["role"]) && ($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER)){

	$file = $_POST["file"];
	$id   = $_POST["id"];
	//file_put_contents("fasfs.html","update attachment set indexfile='$file' where id=".$id);

	$mysql->query("update attachment set indexfile='$file' where id=".$id);
		

}else{
	die("What are you doing?");
}


?>
</ul>