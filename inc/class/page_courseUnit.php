<?php

$page = 1;	
if(isset($_GET["page"]) &&
   is_numeric($_GET["page"]) &&
   $_GET["page"] > 0){
	$page = $_GET["page"];		
}

//排序方式常量定义
define("TIME_DESC",1);//创建时间降序（默认）
define("TIME_ASC",2);//教创建时间升序
define("TITLE_DESC",3);//课程单元名称降序
define("TITLE_ASC",4);//课程单元名称升序
define("CREATOR_DESC",5);//创建者降序
define("CREATOR_ASC",6);//创建者升序


//关键词类型常量定义
define("TITLE",1);
define("CREATOR",2);
define("CREATE_TIME",3);

//共三个分页显示模式
//$select 是否处于分页复选模式
//$version 是否显示版本信息
//$deleted 是否只显示已删除的课程单元
class page{

	function fenye ($page,$order,$linkPage,$userid,$keyword,$searchType,$deleted=0,$select=0,$version=0){

		global $page_size;

		$linkPage .= strpos($linkPage,"?")>0?"&":"?";

		//$self = $_SERVER["PHP_SELF"];

		$by = "order by ";
		switch($order){
			case TIME_DESC:
				$by .= "time desc";
				break;
			case TIME_ASC:
				$by .= "time asc";
				break;
			case TITLE_DESC:
				$by .= "title desc";
				break;
			case TITLE_ASC:
				$by .= "title asc";
				break;
			case CREATOR_DESC:
				$by .= "userid desc";
				break;
			case CREATOR_ASC:
				$by .= "userid asc";
				break;
		}
		
		$where = "where deleted=".$deleted;
		if($keyword!=""){
			switch($searchType){
			case TITLE:
				$where .= " and (title like '%".$keyword."%' or description like '%".$keyword."%')";
				break;
			case CREATOR:
				$where .= " and (userid in (select id from user where realname like '%".$keyword."%'))";
				break;
			case CREATE_TIME:
				$where .= " and (time like '%".$keyword."%')";
				break;
			}
		}
		if($userid) $where .= " and userid=".$userid;

		$sql = "select * from courseunit $where";

		//die($sql);

		$result = mysql_query($sql);

		$amount = mysql_num_rows($result);   //表中的总纪录数

		if($amount){
			$page_total = ceil($amount / $page_size);	
		}else{
			echo ("没有记录");
			return;
		}

		if($page > $page_total){
			$page = $page_total;
		}

		$page_start = ($page - 1) * $page_size;

		//页面相关参数
		$linkTail = '&searchType='.$searchType;

		if($select){
			echo "<table border='1' width='100%' cellspacing='0' cellpadding='0'>
					<tr>";
            if (!$version) echo "<th width='10%' align='center' class='th1'></th>";
			echo "<th width='40%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>课程单元名称</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=4"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=3"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
					<th width='10%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>创建者</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=6"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=5"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
					<th width='15%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>创建时间</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=2"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=1"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
				</tr>";
		}else{
			echo "<table border='1' width='100%' cellspacing='0' cellpadding='0'>
					<tr>
						<th width='40%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>课程单元名称</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=4"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=3"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
						<th width='10%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>创建者</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=6"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=5"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
						<th width='15%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>创建时间</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=2"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=1"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
						<th width='10%' align='center' class='th1'>操作</th>
					</tr>";
		}

		

		$res = mysql_query("select * from courseunit $where $by limit $page_start,$page_size");
		if($deleted){//只显示已删除的课程单元
			while($arr = mysql_fetch_array($res)){
				//if($arr["lpid"]){
					//$title = "<a href='scormShow.php?id=$arr[lpid]' target='_blank'><img src='../img/scorm.png' width='25' title='Scorm'>".$arr["title"]."</a>";
				//}else{
					$title = "<a href='courseUnitShow.php?id=$arr[id]'>".$arr["title"]."</a>";	
				//}
				$userinfo = getUserinfoById($arr["userid"]);
				echo "<tr><td>$title</td><td><a href=''>".$userinfo["realname"]."</a></td><td>$arr[time]</td><td><a href='revertTodo.php?type=1&id=$arr[id]'><img src='../img/document-revert.png' width='22' title='恢复' alt='恢复'></a> <a href='delete.php?type=101&id=$arr[id]'><img src='../img/delete.png' title='彻底删除' alt='彻底删除'></a></td></tr>";
			}
		}else{//只显示未删除的课程单元
			if($select){//分页复选模式显示
				if($version){//显示课程单元所有版本信息
					$index = 0;
					while($arr = mysql_fetch_array($res)){
						$index++;
						$title = "<a href='courseUnitShow.php?id=$arr[id]' target='_blank'>".$arr["title"]."</a>";
						$userinfo = getUserinfoById($arr["userid"]);
						echo "<tr><td>".$title."<br>";
							$res_courseunitversion_rel_attachment = mysql_query("select * from courseunitversion_rel_attachment where deleted=0 and courseunitid=".$arr["id"]);
							$i=1;
							$num = mysql_num_rows($res_courseunitversion_rel_attachment);
							if($num>=1){
								while($arr_courseunitversion_rel_attachment = mysql_fetch_array($res_courseunitversion_rel_attachment)){
									//$c = $i++==$num ? "checked" : "";
									echo "<label><input class='subitem_check' type='checkbox' value='$arr_courseunitversion_rel_attachment[id]' name='v-$arr[id]' title='创建日期：$arr_courseunitversion_rel_attachment[time]'>$arr_courseunitversion_rel_attachment[versionname]</label> &nbsp;";
								}
							}
						echo "</td><td><a href=''>".$userinfo["realname"]."</a></td><td>$arr[time]</td></tr>";
					}
				}else{//不显示课程单元所有版本信息
					while($arr = mysql_fetch_array($res)){
						$title = "<a href='courseUnitShow.php?id=$arr[id]' target='_blank'>".$arr["title"]."</a>";
						$userinfo = getUserinfoById($arr["userid"]);
						echo "<tr><td><input type='checkbox' value='".$arr["id"]."'></td><td>$title</td><td><a href=''>".$userinfo["realname"]."</a></td><td>$arr[time]</td></tr>";
					}
				}
			}else{//正常显示，即只显示课程单元列表
				while($arr = mysql_fetch_array($res)){
					//if($arr["lpid"]){
						//$title = "<a href='scormShow.php?id=$arr[lpid]' target='_blank'><img src='../img/scorm.png' width='25' title='Scorm'>".$arr["title"]."</a>";
					//}else{
						$title = "<a href='courseUnitShow.php?id=$arr[id]'>".$arr["title"]."</a>";	
					//}
					$userinfo = getUserinfoById($arr["userid"]);
					echo "<tr><td>$title</td><td><a href=''>".$userinfo["realname"]."</a></td><td>$arr[time]</td><td><a href='courseUnitSetting.php?id=$arr[id]&title=$arr[title]'><img src='../img/edit.png' title='编辑' alt='编辑'></a> <a href='delete.php?type=3&id=$arr[id]'><img src='../img/delete.png' title='删除' alt='删除'></a></td></tr>";
				}
			}			
		}
		

		echo "</table>";

		//显示[1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11]
		function pp($a,$page,$page_total,$linkpage,$userid){

			global $page_size,$keyword,$order,$searchType;

			for($i = $page - $a;$i <= $page + $a;$i++){
			
				if($i > 0 && $i <= $page_total){
				
					if($i == $page){			
						echo " <font color='red'>[$i]</font> ";			
					}else{			
						echo " <a href='$linkpage"."page=$i&userid=$userid&k=$keyword&order=$order&searchType=$searchType'>[$i]</a> ";			
					}
				
				}
			
			}

		}

		$page_up = $page - 1;
		$page_down = $page + 1;

		if($page == 1){
			$s = "首页 | 上一页 | ";
		}else{
			$s = "<a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=$order"."$linkTail'>首页</a> | 
				<a href='$linkPage"."page=$page_up&userid=$userid&k=$keyword&order=$order"."$linkTail'>上一页</a> | ";
		}

		if($page == $page_total){
			$x = " | 下一页 | 尾页<br />";
		}else{
			$x = " | <a href='$linkPage"."page=$page_down&userid=$userid&k=$keyword&order=$order"."$linkTail'>下一页</a> | 
				<a href='$linkPage"."page=$page_total&userid=$userid&k=$keyword&order=$order"."$linkTail'>尾页</a><br />";
		}

		echo "<p /><center>共 $amount 条记录，每页显示 $page_size 条<br />";

		echo $s;

		pp(5,$page,$page_total,"$linkPage",$userid);

		echo $x;

		echo "转到第<input type='text' size=1 maxlength=7 value=$page onchange='window.location=\"$linkPage"."userid=$userid&k=$keyword&order=$order&searchType=$searchType&page=\"+this.value'>页&nbsp;&nbsp;<font color=blue>跳转</font>&nbsp;&nbsp;共 $page_total 页，当前第 $page 页";

	}
}
?>