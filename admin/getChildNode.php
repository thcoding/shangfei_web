<?php

session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(isset($_SESSION["role"]) && ($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER)){
	include "../inc/mysql.php";
	
	switch($_GET["type"]){
		case 1: //课程单元组（含版本信息）
			$res = $mysql->query("select * from courseunitgroup where groupid=".$_GET["id"]);
			$arr = $mysql->fetch_array($res);
			$ids = substr($arr["courseunitids"],1,-1);
			//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
			$res = $mysql->query("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
			$str = "<ul>";
			while($arr = $mysql->fetch_array($res)){
				$str .= "<li><label><input type='checkbox' name='courseUnit[]' value='$arr[id]' title='创建日期：$arr[time]'>".$arr["title"]."</label>";
				$res1 = $mysql->query("select * from courseunitversion_rel_attachment where deleted=0 and courseunitid=".$arr["id"]);
				$i=1;
				$num = $mysql->num_rows($res1);
				if($num>1){
					$str .= "<ul>";
					while($arr1 = $mysql->fetch_array($res1)){
						$c = $i++==$num ? "checked" : "";
						$str .= "<li><label><input type='radio' value='$arr1[id]' name='v-$arr[id]' $c title='创建日期：$arr1[time]'>$arr1[versionname]</label></li>";
					}
					$str .= "</ul>";
				}
				$str .= "</li>";
			}
			echo $str."</ul>";
			break;
		case 2:  //课程组
			$res = $mysql->query("select * from coursegroup where groupid=".$_GET["id"]);
			$arr = $mysql->fetch_array($res);
			$ids = substr($arr["courseids"],1,-1);
			//die("select * from course where deleted=0 and id in ($ids) order by time desc");
			$res = $mysql->query("select * from course where deleted=0 and id in ($ids) order by time desc");
			$str = "<ul>";
			while($arr = $mysql->fetch_array($res)){
				$str .= "<li title='创建日期：$arr[time]'><label><input type='checkbox' name='course[]' value='$arr[id]'>".$arr["title"]."</label></li>";
			}
			echo $str."</ul>";
			break;
		case 3:  //用户组
			$res = $mysql->query("select * from usergroup where groupid=".$_GET["id"]);
			$arr = $mysql->fetch_array($res);
			$ids = substr($arr["userids"],1,-1);
			//die("select * from user where deleted=0 and id in ($ids) order by time desc");
			$res = $mysql->query("select * from user where deleted=0 and id in ($ids) order by time desc");
			$str = "<ul>";
			while($arr = $mysql->fetch_array($res)){
				$str .= "<li title='创建日期：$arr[time]'><label><input type='checkbox' name='user[]' value='$arr[id]'>".$arr["realname"]."</label></li>";
			}
			echo $str."</ul>";
			break;
		case 4: //课程单元组（不含版本信息）
			$res = $mysql->query("select * from courseunitgroup where groupid=".$_GET["id"]);
			$arr = $mysql->fetch_array($res);
			$ids = substr($arr["courseunitids"],1,-1);
			//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
			$res = $mysql->query("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
			$str = "<ul>";
			while($arr = $mysql->fetch_array($res)){
				$str .= "<li><label><input type='checkbox' name='courseUnit[]' value='$arr[id]' title='创建日期：$arr[time]'>".$arr["title"]."</label></li>";
			}
			echo $str."</ul>";
			break;
	}
}else{
	die("What are you doing?");
}


?>