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



//排序方式常量定义
define("TIME_DESC",1);//创建时间降序（默认）
define("TIME_ASC",2);//教创建时间升序
define("TITLE_DESC",3);//课程名称降序
define("TITLE_ASC",4);//课程名称升序
define("TYPE_DESC",5);//课程类别降序
define("TYPE_ASC",6);//课程类别升序
define("CREATOR_DESC",7);//创建者降序
define("CREATOR_ASC",8);//创建者升序
define("STARTTIME_DESC",9);//课程开始时间降序
define("STARTTIME_ASC",10);//课程开始时间升序
define("ENDTIME_DESC",11);//课程结束时间降序
define("ENDTIME_ASC",12);//课程结束时间升序

//关键词类型常量定义
define("TITLE",1);
define("TYPE",2);
define("CREATOR",3);
define("CREATE_TIME",4);

//课程状态定义
define("STATUS_All",0);
define("STATUS_IN",1);
define("STATUS_UNDO",2);
define("STATUS_EXPIRE",3);

class page{


//共两个分页显示模式
//$select 是否处于分页复选模式
//$deleted 是否只显示已删除的用户
	function fenye ($page,$order,$linkPage,$userid,$keyword,$searchType=1,$startTime="",$endTime="",$status=0){

		global $page_size;

		$linkPage .= strpos($linkPage,"?")>0?"&":"?";

		//$self = $_SERVER["PHP_SELF"];
		//排序
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
			case TYPE_DESC:
				$by .= "type desc";
				break;
			case TYPE_ASC:
				$by .= "type asc";
				break;
			case CREATOR_DESC:
				$by .= "userid desc";
				break;
			case CREATOR_ASC:
				$by .= "userid asc";
				break;
			case STARTTIME_DESC:
				$by .= "starttime desc";
				break;
			case STARTTIME_ASC:
				$by .= "starttime asc";
				break;
			case ENDTIME_DESC:
				$by .= "endtime desc";
				break;
			case ENDTIME_ASC:
				$by .= "endtime asc";
				break;
		}
		//选择未删除的课程
		$where = "where deleted=0";

		
		//选出该用户所拥有的所有课程id
		$res = mysql_query("select * from user_rel_course where userid=".$userid);
		$arr = mysql_fetch_array($res);
		$ids = substr($arr["courseids"],1,-1);
		$where .=" and id in ($ids)";

		//选出符合的关键字
		if($keyword!=""){
			switch($searchType){
			case TITLE:
				$where .= " and (title like '%".$keyword."%' or description like '%".$keyword."%')";
				break;
			case TYPE:
				similar_text($keyword,"参考课程",$percent[0]);
				similar_text($keyword,"学习课程",$percent[1]);
				if($percent[0]>=40.0&&$percent[1]>=40.0){
					$where .= " and (type in (0,1))";
				}else if($percent[0]>=40.0&&$percent[1]<40.0){
					$where .= " and (type in (0))";
				}else if($percent[0]<40.0&&$percent[1]>=40.0){
					$where .= " and (type in (1))";
				}else{
					$where .= " and (type in (-1))";
				}
				break;
			case CREATOR:
				$where .= " and (userid in (select id from user where realname like '%".$keyword."%'))";
				break;
			case CREATE_TIME:
				$where .= " and (time like '%".$keyword."%')";
				break;
			}
		}
		if($startTime!=""){
			$where .= " and (DATE_FORMAT( startTime, '%Y-%m-%d %H:%i:%S') >='".$startTime."')";
		}
		if($endTime!=""){
			$where .= " and (DATE_FORMAT( endTime, '%Y-%m-%d %H:%i:%S') <='".$endTime."')";
		}
		
		//根据时间状态继续筛选
		$timeNow = date("Y-m-d H:i:s");//当前时间
		switch($status){
			case STATUS_All:
				break;
			case STATUS_IN:
				$where .= " and (DATE_FORMAT( endTime, '%Y-%m-%d %H:%i:%S') >='".$timeNow."')";
				$where .= " and (DATE_FORMAT( startTime, '%Y-%m-%d %H:%i:%S') <='".$timeNow."')";
				break;
			case STATUS_UNDO:
				$where .= " and (DATE_FORMAT( startTime, '%Y-%m-%d %H:%i:%S') >='".$timeNow."')";
				break;
			case STATUS_EXPIRE:
				$where .= " and (DATE_FORMAT( endTime, '%Y-%m-%d %H:%i:%S') <='".$timeNow."')";
				break;
			}
		
		$sql = "select * from course $where";

		//echo $sql;
		//die();

		$result = mysql_query($sql);//在course表中查询所有课程信息


		$amount = mysql_num_rows($result);   //表中的总纪录数

		if($amount){
			$page_total = ceil($amount / $page_size);	
		}else{
			echo("无相关课程记录");
			return;
		}

		if($page > $page_total){
			$page = $page_total;
		}

		$page_start = ($page - 1) * $page_size;
		
		//页面相关参数
		$linkTail = '&searchType='.$searchType.'&startTime='.$startTime.'&endTime='.$endTime.'&status='.$status;

		//输出表头
			echo "<table border='1' width='100%' cellspacing='0' cellpadding='0'>
						<tr>
							<th width='18%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>课程名称</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=4"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=3"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
							<th width='12%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>课程类别</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=6"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=5"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
							<th width='10%' align='center' ><table style='border:0px; margin:auto'><tr><td>创建者</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=8"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=7"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
							<th width='15%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>创建时间</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=2"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=1"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
							<th width='15%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>课程开始时间</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=10"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=9"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
							<th width='15%' align='center' class='th1'><table style='border:0px; margin:auto'><tr><td>课程结束时间</td>
							<td>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=12"."$linkTail'><img src='../img/asc.png' width='8'></a></div>
							<div><a href='$linkPage"."page=1&userid=$userid&k=$keyword&order=11"."$linkTail'><img src='../img/desc.png' width='8'></a></div>
							</td>
							</tr></table></th>
						</tr>";


		$res = mysql_query("select * from course $where $by limit $page_start,$page_size");//在course表中查询符合条件的所有课程
		//输出课程

				while($arr = mysql_fetch_array($res)){
					$userinfo = getUserinfoById($arr["userid"]);
					$type = $arr["type"]?"学习课程":"参考课程";
                    echo "<tr><td><a href='courseCategory_for_course.php?id=$arr[id]&title=$arr[title]'>".$arr["title"]."</a></td><td>$type</td><td><a href=''>".$userinfo["realname"]."</a></td><td>$arr[time]</td><td>$arr[starttime]</td><td>$arr[endtime]</td></tr>";
				}

		

		echo "</table>";

		//显示[1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11]
		function pp($a,$page,$page_total,$linkpage,$userid){

			global $page_size,$keyword,$order,$searchType,$startTime,$endTime,$status;

			for($i = $page - $a;$i <= $page + $a;$i++){
			
				if($i > 0 && $i <= $page_total){
				
					if($i == $page){			
						echo " <font color='red'>[$i]</font> ";			
					}else{			
						echo " <a href='$linkpage"."page=$i&userid=$userid&k=$keyword&order=$order&searchType=$searchType&startTime=$startTime&endTime=$endTime&status=$status'>[$i]</a> ";			
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

		echo "转到第<input type='text' size=1 maxlength=7 value=$page onchange='window.location=\"$linkPage"."userid=$userid&k=$keyword&order=$order&searchType=$searchType&startTime=$startTime&endTime=$endTime&status=$status&page=\"+this.value'>页&nbsp;&nbsp;<font color=blue>跳转</font>&nbsp;&nbsp;共 $page_total 页，当前第 $page 页";

	}
}
?>