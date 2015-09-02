<?php

if(isset($_GET["page"])){

	if(is_numeric($_GET["page"])){
	
		if($_GET["page"] > 0){		
			$page = $_GET["page"];		
		}else{		
			$page = 1;		
		}
	
	}else{	
		$page = 1;	
	}

}else{
	$page = 1;
}

class page{

//共两个分页显示模式
//$select 是否处于分页复选模式
//$deleted 是否只显示已删除的用户
	function fenye ($page,$order,$linkPage,$userid,$keyword,$deleted=0,$select=0){

		global $page_size;

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
				$by .= "userid";
				break;
			case 4:
				$by .= "title";
				break;
			case 5:
				$by .= "type desc";
				break;
		}
		
		$where = "where deleted=".$deleted;
		if($keyword!="") $where .= " and (title like '%".$keyword."%' or description like '%".$keyword."%')";
		if($userid) $where .= " and userid=".$userid;

		$sql = "select * from course $where";

		//echo $sql;
		//die();

		$result = mysql_query($sql);//在course表中查询所有课程信息

		$amount = mysql_num_rows($result);   //表中的总纪录数

		if($amount){
			$page_total = ceil($amount / $page_size);	
		}else{
			echo("没有记录");
			return;
		}

		if($page > $page_total){
			$page = $page_total;
		}

		$page_start = ($page - 1) * $page_size;

		if($select){
			echo "<table border='1' width='100%' cellspacing='0' cellpadding='0'>
					<tr>
						<th width='10%' align='center' class='th1'></th>
						<th width='20%' align='center' class='th1'>课程名称</th>
						<th width='20%' align='center' class='th1'>课程类别</th>
						<th width='10%' align='center' class='th1'>创建者</th>
						<th width='15%' align='center' class='th1'>课程开始时间</th>
						<th width='15%' align='center' class='th1'>课程结束时间</th>
					</tr>";
		}
		else{
			echo "<table border='1' width='100%' cellspacing='0' cellpadding='0'>
						<tr>
							<th width='20%' align='center' class='th1'>课程名称</th>
							<th width='10%' align='center' class='th1'>课程类别</th>
							<th width='10%' align='center' class='th1'>创建者</th>
							<th width='15%' align='center' class='th1'>创建时间</th>
							<th width='15%' align='center' class='th1'>课程开始时间</th>
							<th width='15%' align='center' class='th1'>课程结束时间</th>
							<th width='15%' align='center' class='th1'>操作</th>
						</tr>";
		}

		$res = mysql_query("select * from course $where $by limit $page_start,$page_size");//在course表中查询符合条件的所有课程
		//输出课程
		if($deleted){//只显示已删除的课程
			while($arr = mysql_fetch_array($res)){
				$userinfo = getUserinfoById($arr["userid"]);
				$type = $arr["type"]?"学习课程":"参考课程";
				echo "<tr><td><a href='courseCategory_for_course.php?id=$arr[id]&title=$arr[title]'>".$arr["title"]."</a></td><td>$type</td><td><a href=''>".$userinfo["realname"]."</a></td><td>$arr[time]</td><td>$arr[starttime]</td><td>$arr[endtime]</td><td><a href='revertTodo.php?type=2&id=$arr[id]'><img src='../img/document-revert.png' width='22' title='恢复' alt='恢复'></a> <a href='delete.php?type=102&id=$arr[id]' title='彻底删除' alt='彻底删除'><img src='../img/delete.png'></a></td></tr>";
			}
		}else{//只显示未删除的课程
			if($select){//分页复选模式
				while($arr = mysql_fetch_array($res)){
					$userinfo = getUserinfoById($arr["userid"]);
					$type = $arr["type"]?"学习课程":"参考课程";
						echo "<tr>
						<td><input type='checkbox' value='".$arr["id"]."'></td>
						<td>".$arr["title"]."</td>
						<td>$type</td>
						<td>".$userinfo["realname"]."</td>
						<td>".$arr["starttime"]."</td>
						<td>".$arr["endtime"]."</td>
						</tr>";
					}
			}
			else{//正常显示
				while($arr = mysql_fetch_array($res)){
					$userinfo = getUserinfoById($arr["userid"]);
					$type = $arr["type"]?"学习课程":"参考课程";
                    $title = urlencode($arr['title']);
					echo "<tr><td><a href='courseCategory_for_course.php?id=$arr[id]&title=$title'>".$arr["title"]."</a></td><td>$type</td><td><a href=''>".$userinfo["realname"]."</a></td><td>$arr[time]</td><td>$arr[starttime]</td><td>$arr[endtime]</td><td><a href='javascript:;' onclick='copy(\"$arr[id]\")'><img src='../img/copy.png' width='22' title='复制' alt='复制'></a> <a href='courseAdd.php?id=$arr[id]'><img src='../img/edit.png' title='编辑' alt='编辑'></a> <a href='delete.php?type=4&id=$arr[id]' title='删除' alt='删除'><img src='../img/delete.png'></a></td></tr>";
				}
			}
		}		

		echo "</table>";

		//显示[1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11]
		function pp($a,$page,$page_total,$linkpage,$userid){

			global $page_size,$keyword,$order;

			for($i = $page - $a;$i <= $page + $a;$i++){
			
				if($i > 0 && $i <= $page_total){
				
					if($i == $page){			
						echo " <font color='red'>[$i]</font> ";			
					}else{			
						echo " <a href='$linkpage"."page=$i&userid=$userid&k=$keyword&order=$order'>[$i]</a> ";			
					}
				
				}
			
			}

		}

		$page_up = $page - 1;
		$page_down = $page + 1;

		if($page == 1){
			$s = "首页 | 上一页 | ";
		}else{
			$s = "<a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=$order'>首页</a> | 
				<a href='$linkPage"."page=$page_up&userid=$userid&k=$keyword&order=$order'>上一页</a> | ";
		}

		if($page == $page_total){
			$x = " | 下一页 | 尾页<br />";
		}else{
			$x = " | <a href='$linkPage"."page=$page_down&userid=$userid&k=$keyword&order=$order'>下一页</a> | 
				<a href='$linkPage"."page=$page_total&userid=$userid&k=$keyword&order=$order'>尾页</a><br />";
		}

		echo "<p /><center>共 $amount 条记录，每页显示 $page_size 条<br />";

		echo $s;

		pp(5,$page,$page_total,"$linkPage",$userid);

		echo $x;

		echo "转到第<input type='text' size=1 maxlength=7 value=$page onchange='window.location=\"$linkPage"."userid=$userid&k=$keyword&order=$order&page=\"+this.value'>页&nbsp;&nbsp;<font color=blue>跳转</font>&nbsp;&nbsp;共 $page_total 页，当前第 $page 页";

	}
}
?>