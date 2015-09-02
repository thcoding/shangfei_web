<?php
include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/config.php";

//@$str = trim($_POST["json"]);
//@$str = "{\"type\":\"course\", \"order_type\":\"time\", \"order_dir\":\"desc\", \"keyword\":\"\", \"page_index\":1}";
//$postInfo = json_decode($str,JSON_UNESCAPED_UNICODE);
//getCourseorUserInfo($postInfo);

//请求数据示例{"type":"course", "order_type":"time", "order_dir":"desc", "keyword":"商飞","page_index":"2"}
//单个课程的返回：{"data":[{"id":"1", "title":"course1", "time":"xxx", "creator":"user1"}, {...}], "info":"", "status":200}
getCourseorUserInfo();
function getCourseorUserInfo(){//获取postinfo
	
	global $mysql;
	$returntype = trim($_POST["type"]);
	//$returntype = "course_group";

	if($returntype=="course"){//返回的是课程

		//事先定义变量
		
		$deleted = 0;//deleted默认为0，即显示所有未删除的课程
		$page_size = 20;//每页记录20条信息
		$amount = 0;//表中记录总数，默认为0

		
		//接收到的信息
		@$order_type = trim($_POST["order_type"])?trim($_POST["order_type"]):"";//获取排序关键字
		@$order_dir = trim($_POST["order_dir"])?trim($_POST["order_dir"]):"desc";//获取排序方式			
		@$keyword = trim($_POST["keyword"])?trim($_POST["keyword"]):"";//获取搜索关键字
		@$page_index = trim($_POST["page_index"])?trim($_POST["page_index"]):1;//获取页码数


		//返回的信息
		$returninfo = Array();//$returninfo["data"] = $data; $returninfo["info"] = $info;$returninfo["status"] = $status;
			$data = Array();//$data["items"] = $items; $data["page_count"] = $page_count; $data["amount"] = $amount;
				$items = Array();//$items[] = $item;
					$item = Array();//$item["id"]=...;$item["title"]=...
				$page_count = 0;//页数默认为0
			$info = "";
			$status = 200;
		
		$by = "order by "; //为sql中的order by语句赋值
		if($order_type=="time")
			$by .= "time ".$order_dir;
		else if($order_type=="title")
			$by .= "title ".$order_dir;
		else if($order_type=="creator")
			$by .= "userid ".$order_dir;
		else
			$by .= "time desc";
		
		$where = "where deleted=".$deleted;//为sql查询条件where语句赋值
		if($keyword!="") $where .= " and (title like '%".$keyword."%' or description like '%".$keyword."%')";//如果存在关键字，则加该条件

		$sql = "select * from course $where";//先不管排序和分页问题，查出表中记录总数

		$result = mysql_query($sql);//在course表中查询所有课程信息
		$amount = mysql_num_rows($result);   //表中的总纪录数

		if($amount){//表中有记录数
			$page_count = ceil($amount / $page_size);	
		}else{
			$page_count = 0;//表中无记录，page_count = 0;
		}
		$page_start = ($page_index - 1) * $page_size;//从表中第几行开始取

		$res = mysql_query("select * from course $where $by limit $page_start,$page_size");//在course表中查询符合条件的所有课程
		while($arr = mysql_fetch_array($res)){//开始逐行获取课程
			
			$userinfo = getUserinfoById($arr["userid"]);
			//开始获取课程所需信息，并添加到item中
			$item["id"] = $arr["id"];
			$item["title"] = $arr["title"];
			$item["time"] = $arr["time"];
			$item["creator"] = $userinfo["realname"];
			//将item添加到items中
			$items[] = $item;
			}
		
		//为$data装载数据
		$data["items"] = $items;
		$data["page_count"] = $page_count;
		$data["amount"] = $amount;

		//为returninfo装载数据
		$returninfo["data"] = $data; 
		$returninfo["info"] = $info;
		$returninfo["status"] = $status;

		echo json_encode($returninfo,JSON_UNESCAPED_UNICODE);

	}
	else if($returntype=="user"){//返回的是用户
		
		//事先定义变量
		
		$deleted = 0;//deleted默认为0，即显示所有未删除的课程
		$page_size = 20;//每页记录20条信息
		$amount = 0;//表中记录总数，默认为0

		
		//接收到的信息
		@$order_type = trim($_POST["order_type"])?trim($_POST["order_type"]):"";//获取排序关键字
		@$order_dir = trim($_POST["order_dir"])?trim($_POST["order_dir"]):"desc";//获取排序方式			
		@$keyword = trim($_POST["keyword"])?trim($_POST["keyword"]):"";//获取搜索关键字
		@$page_index = trim($_POST["page_index"])?trim($_POST["page_index"]):1;//获取页码数


		//返回的信息
		$returninfo = Array();//$returninfo["data"] = $data; $returninfo["info"] = $info;$returninfo["status"] = $status;
			$data = Array();//$data["items"] = $items; $data["page_count"] = $page_count; $data["amount"] = $amount;
				$items = Array();//$items[] = $item;
					$item = Array();//$item["id"]=...;$item["title"]=...
				$page_count = 0;//页数默认为0
			$info = "";
			$status = 200;
		
		$by = "order by "; //为sql中的order by语句赋值
		if($order_type=="time")
			$by .= "time ".$order_dir;
		else if($order_type=="title")
			$by .= "realname ".$order_dir;
		else if($order_type=="creator")
			$by .= "id ".$order_dir;
		else
			$by .= "time desc";
		
		$where = "where deleted=".$deleted;//为sql查询条件where语句赋值
		if($keyword!="") $where .= " and (realname like '%".$keyword."%')";//如果存在关键字，则加该条件

		$sql = "select * from user $where";//先不管排序和分页问题，查出表中记录总数

		$result = mysql_query($sql);//在user表中查询所有课程信息
		$amount = mysql_num_rows($result);   //表中的总纪录数

		if($amount){//表中有记录数
			$page_count = ceil($amount / $page_size);	
		}else{
			$page_count = 0;//表中无记录，page_count = 0;
		}
		$page_start = ($page_index - 1) * $page_size;//从表中第几行开始取

		$res = mysql_query("select * from user $where $by limit $page_start,$page_size");//在course表中查询符合条件的所有课程
		while($arr = mysql_fetch_array($res)){//开始逐行获取用户
			
			//开始获取用户所需信息，并添加到item中
			$item["id"] = $arr["id"];
			$item["title"] = $arr["realname"];
			$item["time"] = $arr["time"];
			$item["creator"] = "无";
			//将item添加到items中
			$items[] = $item;
			}
		
		//为$data装载数据
		$data["items"] = $items;
		$data["page_count"] = $page_count;
		$data["amount"] = $amount;

		//为returninfo装载数据
		$returninfo["data"] = $data; 
		$returninfo["info"] = $info;
		$returninfo["status"] = $status;

		echo json_encode($returninfo,JSON_UNESCAPED_UNICODE);
	}
	else if(($returntype=="course_group")||($returntype=="user_group")){//返回的是组
		
		if($returntype=="course_group")
			$grouptype = 3;
		else if($returntype=="user_group")
			$grouptype = 1;
		
		//接收到的信息
		@$order_type = trim($_POST["order_type"]);//获取排序关键字
		@$order_dir = trim($_POST["order_dir"]);//获取排序方式			
		@$keyword = trim($_POST["keyword"]);//获取搜索关键字
		$deleted = 0;//deleted默认为0，即显示所有未删除的课程组
		@$page_index = trim($_POST["page_index"])?trim($_POST["page_index"]):1;//获取页码数
		$page_size = 10;//每页记录10条信息
		$amount = 0;//表中记录总数，默认为0

		//返回的信息
		$returninfo = Array();//$returninfo["data"] = $data; $returninfo["info"] = $info;$returninfo["status"] = $status;
			$data = Array();//$data["items"] = $items; $data["page_count"] = $page_count; $data["amount"] = $amount;
				$items = Array();//$items[] = $item;
					$item = Array();//$item["id"]=...;$item["title"]=...*对于组来说 $item["children"] = $items
				$page_count = 0;//页数默认为0
			$info = "";
			$status = 200;
		
		$by = "order by "; //为sql中的order by语句赋值

		if($grouptype==3){//课程组排序方式	
			if($order_type=="time")
				$by .= "time ".$order_dir;
			else if($order_type=="title")
				$by .= "title ".$order_dir;
			else if($order_type=="creator")
				$by .= "userid ".$order_dir;
			else
				$by .= "time desc";
		}else if($grouptype==1){//用户组排序方式	
			if($order_type=="time")
				$by .= "time ".$order_dir;
			else if($order_type=="title")
				$by .= "realname ".$order_dir;
			else if($order_type=="creator")
				$by .= "id ".$order_dir;
			else
				$by .= "time desc";
		}
		
		if($grouptype==1)//用户组
			$where = "where deleted=".$deleted." and type=1";//为sql查询条件where语句赋值，type = 1，为用户组
		else if($grouptype==3)//课程组
			$where = "where deleted=".$deleted." and type=3";//为sql查询条件where语句赋值，type = 3，为课程组
		
		if($keyword!=""){ //如果存在关键字，则为where加该条件
			if($grouptype==3)
				$where .= " and (title like '%".$keyword."%' or description like '%".$keyword."%')";
			else if($grouptype==1)	
				$where .= " and (realname like '%".$keyword."%')";
		}
		
		$sql = "select * from `group` $where";//先不管排序和分页问题，查出表中记录总数

		$result = mysql_query($sql);//在coursegroup表中查询所有课程组信息
		$amount = mysql_num_rows($result);   //表中的总纪录数

		if($amount){//表中有记录数
			$page_count = ceil($amount / $page_size);	
		}else{
			$page_count = 0;//表中无记录，page_count = 0;
		}
		$page_start = ($page_index - 1) * $page_size;//从表中第几行开始取

		$res = mysql_query("select * from `group` $where $by limit $page_start,$page_size");//在course表中查询符合条件的所有课程组
		while($arr = mysql_fetch_array($res)){//开始逐行获取课程组
			
			$userinfo = getUserinfoById($arr["userid"]);
			//开始获取课程组所需信息，并添加到item中
			$item["id"] = $arr["id"];
			$item["title"] = $arr["title"];
			$item["time"] = $arr["time"];
			$item["creator"] = $userinfo["realname"];

			$item["children"] = getChildren($arr["id"],$grouptype);//课程组应该包含children（目前只有课程），children格式为课程的item
			//将item添加到items中
			$items[] = $item;
			}
		
		//为$data装载数据
		$data["items"] = $items;
		$data["page_count"] = $page_count;
		$data["amount"] = $amount;

		//为returninfo装载数据
		$returninfo["data"] = $data; 
		$returninfo["info"] = $info;
		$returninfo["status"] = $status;

		echo json_encode($returninfo,JSON_UNESCAPED_UNICODE);

	}
	
	else{//无请求信息
		$returninfo["data"] = null; 
		$returninfo["info"] = "无请求信息！";
		$returninfo["status"] = 400;

		echo json_encode($returninfo,JSON_UNESCAPED_UNICODE);
	}

}

function getChildren($groupid,$grouptype){//获得group的children grouptype(1:用户（组）,2:课程单元（组），3：课程（组）)返回类型为item
	global $mysql;
	$childrenitems = Array();
		$childrenitem = Array();

	//开始获取组里面的个体
	if($grouptype==1){//获取用户

		$res = $mysql->query("select * from usergroup where groupid=".$groupid);
		$arr = $mysql->fetch_array($res);
		$userids = substr($arr["userids"],1,-1);//获取所有课程id
		$res_user = $mysql->query("select * from user where deleted=0 and id in ($userids) order by time desc");//根据courseid获取course表中的课程
		while($arr_user = $mysql->fetch_array($res_user)){//逐行取出用户

			//开始获取用户所需信息，并添加到item中
			$childrenitem["id"] = $arr_user["id"];
			$childrenitem["title"] = $arr_user["realname"];
			$childrenitem["time"] = $arr_user["time"];
			$childrenitem["creator"] = "无";
			$childrenitem["children"] = null;

			//将item添加到items中
			$childrenitems[] = $childrenitem;
		}
	}
	else if($grouptype==2){//获取课程单元
	}
	else if($grouptype==3){//获取课程

		$res = $mysql->query("select * from coursegroup where groupid=".$groupid);
		$arr = $mysql->fetch_array($res);
		$courseids = substr($arr["courseids"],1,-1);//获取所有课程id
		$res_course = $mysql->query("select * from course where deleted=0 and id in ($courseids) order by time desc");//根据courseid获取course表中的课程
		while($arr_course = $mysql->fetch_array($res_course)){//逐行取出课程

			$userinfo = getUserinfoById($arr_course["userid"]);
			//开始获取课程所需信息，并添加到item中
			$childrenitem["id"] = $arr_course["id"];
			$childrenitem["title"] = $arr_course["title"];
			$childrenitem["time"] = $arr_course["time"];
			$childrenitem["creator"] = $userinfo["realname"];
			$childrenitem["children"] = null;

			//将item添加到items中
			$childrenitems[] = $childrenitem;
		}
	}
	else{//$grouptype参数错误
	}

	//如果组里包含组，则开始获取组里面的组（以后再实现）

	return $childrenitems;  //返回items
}
function getCourseUnitsByCategoryid($userid,$categoryid){//通过用户id和目录id获取目录下的带有状态的课程单元，返回课程单元数组
    
}

?>