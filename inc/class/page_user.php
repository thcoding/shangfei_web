<?php

$page = 1;	
if(isset($_GET["page"]) &&
   is_numeric($_GET["page"]) &&
   $_GET["page"] > 0){
	$page = $_GET["page"];		
}


$role = 0;
if(isset($_GET["role"])) $role = $_GET["role"];

class page{
//共两个分页显示模式
//$select 是否处于分页复选模式
//$deleted 是否只显示已删除的用户
	function fenye ($page,$order,$linkPage,$role,$username,$realname,$deleted=0,$select=0){

		global $page_size,$departmentArr;

		$linkPage .= strpos($linkPage,"?")>0?"&":"?";

		//$self = $_SERVER["PHP_SELF"];

		$by = "order by ";
		switch($order){
			case 1:
				$by .= "time desc";
				break;
			case 2:
				$by .= "time";
				break;
			case 3:
				$by .= "department desc";
				break;
		}
		
		$where = "where deleted=".$deleted;
		if($role) $where .= " and role=".$role;
		if($username) $where .= " and username like '%".$username."%'";
		if($realname) $where .= " and realname like '%".$realname."%'";

		$sql = "select * from `user` $where";

		$result = mysql_query($sql);

		$amount = mysql_num_rows($result);   //表中的总纪录数

		if($amount){
			$page_total = ceil($amount / $page_size);	
		}else{
			echo ("没有记录");
			return null;
		}

		if($page > $page_total){
			$page = $page_total;
		}

		$page_start = ($page - 1) * $page_size;

		if($select){
			echo "<table border='1' width='100%' cellspacing='0' cellpadding='0'>
					<tr>
						<th width='10%' align='center' class='th1'></th>
						<th width='20%' align='center' class='th1'>用户名</th>
						<th width='20%' align='center' class='th1'>姓名</th>
						<th width='10%' align='center' class='th1'>类别</th>
						<th width='15%' align='center' class='th1'>部门</th>
						<th width='25%' align='center' class='th1'>创建时间</th>
					</tr>";
		}else{
			echo "<table border='1' width='100%' cellspacing='0' cellpadding='0'>
					<tr>
						<th width='10%' align='center' class='th1'>用户名</th>
						<th width='10%' align='center' class='th1'>真实姓名</th>
						<th width='10%' align='center' class='th1'>邮箱</th>
						<th width='10%' align='center' class='th1'>部门</th>
						<th width='10%' align='center' class='th1'>创建时间</th>
						<th width='10%' align='center' class='th1'>操作</th>
					</tr>";
		}


		$res = mysql_query("select * from user $where $by limit $page_start,$page_size");
		if($deleted){//只显示已删除的用户
			while($arr = mysql_fetch_array($res)){
				$realname = $arr["realname"]!="" ? $arr["realname"] : "未填写";
				echo "<tr><td><a href='course_for_user.php?id=$arr[id]&title=".$realname."'>$arr[username]</a></td><td>$realname</td><td>$arr[mail]</td><td>".($arr["department"]?$departmentArr[$arr["department"]]:"<span style='color:#999'>未选择</span>")."</td><td>$arr[time]</td><td><a href='revertTodo.php?type=3&id=$arr[id]'><img src='../img/document-revert.png' width='22' title='恢复' alt='恢复'></a> <a href='delete.php?type=103&id=$arr[id]'><img src='../img/delete.png' title='彻底删除' alt='彻底删除'></a></td></tr>";
			}
		}else{//只显示未删除的用户
			if($select){//分页复选模式
				while($arr = mysql_fetch_array($res)){
					$username = $arr["username"];
					$realname = $arr["realname"]!="" ? $arr["realname"] : "未填写";
					if($arr["role"]=='1')
						$role = "管理员";
					else if($arr["role"]=='2')
						$role = "教员";
					else if($arr["role"]=='3')
						$role = "学员";
					else
						$role = "无身份";
					switch($arr["department"]){
						case 0: 
							$department = "暂无部门";
						break;
						case 1:  
							$department = "生产部";
						break;
						case 2: 
							$department = "测试部";
						break;
						case 3: 
							$department = "装机部";
						break;
						case 4: 
							$department = "试飞部";
						break;
						case 5: 
							$department = "维修部";
						break;
						default: 
							$department = "暂无部门";
						break;
					
					}
						echo "<tr><td><input type='checkbox' value='".$arr["id"]."'>
						</td>
						<td>$username</td>
						<td>$realname</td>
						<td>$role</td>
						<td>$department</td>
						<td>$arr[time]</td>
						</tr>";
					}
			}
			else{//正常显示
				while($arr = mysql_fetch_array($res)){
					$realname = $arr["realname"]!="" ? $arr["realname"] : "未填写";
					echo "<tr><td><a href='course_for_user.php?id=$arr[id]&title=".$realname."'>$arr[username]</a></td><td>$realname</td><td>$arr[mail]</td><td>".($arr["department"]?$departmentArr[$arr["department"]]:"<span style='color:#999'>未选择</span>")."</td><td>$arr[time]</td><td><a href='userAdd.php?id=$arr[id]'><img src='../img/edit.png' title='编辑' alt='编辑'></a> <a href='delete.php?type=5&id=$arr[id]'><img src='../img/delete.png' title='删除' alt='删除'></a></td></tr>";
				}
			}
		}		

		echo "</table>";

		//显示[1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11]
		function pp($a,$page,$page_total,$linkpage,$role){

			global $page_size;

			for($i = $page - $a;$i <= $page + $a;$i++){
			
				if($i > 0 && $i <= $page_total){
				
					if($i == $page){			
						echo " <font color='red'>[$i]</font> ";			
					}else{			
						echo " <a href='$linkpage"."page=$i&$role=$role'>[$i]</a> ";			
					}
				
				}
			
			}

		}

		$page_up = $page - 1;
		$page_down = $page + 1;

		if($page == 1){
			$s = "首页 | 上一页 | ";
		}else{
			$s = "<a href='$linkPage"."page=1&role=$role'>首页</a> | 
				<a href='$linkPage"."page=$page_up&role=$role'>上一页</a> | ";
		}

		if($page == $page_total){
			$x = " | 下一页 | 尾页<br />";
		}else{
			$x = " | <a href='$linkPage"."page=$page_down&role=$role'>下一页</a> | 
				<a href='$linkPage"."page=$page_total&role=$role'>尾页</a><br />";
		}

		echo "<p /><center>共 $amount 条记录，每页显示 $page_size 条<br />";

		echo $s;

		pp(5,$page,$page_total,"$linkPage",$role);

		echo $x;

		echo "转到第<input type='text' size=1 maxlength=7 value=$page onchange='window.location=\"$linkPage"."role=$role&page=\"+this.value'>页&nbsp;&nbsp;<font color=blue>跳转</font>&nbsp;&nbsp;共 $page_total 页，当前第 $page 页";

	}
}
?>