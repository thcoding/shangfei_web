<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<style type="text/css" media="screen, projection">
/*<![CDATA[*/
@import "../css/default.css";
@import "../css/main.css";
/*]]>*/
</style>

<?php 
session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../index.php");
	exit();
}

include "../inc/mysql.php";
include "../inc/function.php";

?>
<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript" src="../js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript">
    $(function(){
       $("#sel_order").change(function(){
              $("#btn_search").click();
           });
    });
</script>
<div id="container">
<div class="info">课程列表</div>
			<div class="wrap">
				<form action="" method="get">
					<?php
					$searchTpye = isset($_GET["searchType"])?$_GET["searchType"]:1;
					$startTime = isset($_GET["startTime"])?$_GET["startTime"]:"";
					$endTime = isset($_GET["endTime"])?$_GET["endTime"]:"";
					//通过关键字搜索相关课程
					$keyword = isset($_GET["k"])?$_GET["k"]:"";?>						 
					<?php
					//获取当前排序方式
					$order = isset($_GET["order"])?$_GET["order"]:1;					
					?>
				<table border='1' width='100%' cellspacing='0' cellpadding='0'>
				<tr>
					<td colspan="2">
					<input name="k" value="<?php echo $keyword;?>" type="text" placeholder="请输入关键字...">
					<button id="btn_search" type="submit">搜索课程</button>
					</td>
				</tr>
				<tr>
					<td colspan="2"><label><input type="radio" name="searchType" value=1 <?php if($searchTpye==1){					
					?>checked<?php } ?>>按课程名</label> <label><input type="radio" name="searchType" value=2 <?php if($searchTpye==2){	
					?>checked<?php } ?>>按课程类别</label><label><input type="radio" name="searchType" value=3 <?php if($searchTpye==3){	
					?>checked<?php } ?>>按创建者</label><label><input type="radio" name="searchType" value=4 <?php if($searchTpye==4){	
					?>checked<?php } ?>>按创建时间</label></td>
				</tr>
				<tr>
					<td colspan="2">请选择课程有效区间</td>
				</tr>
				<tr>
					<td>课程开始时间：</td>
					<td><input style="width:250px;" type="text" name="startTime" id="title" value="<?php echo $startTime;?>" class="Wdate" onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"></td>
				</tr>
				<tr>
					<td>课程结束时间：</td>
					<td><input style="width:250px;" type="text" name="endTime" id="title" value="<?php echo $endTime;?>" class="Wdate" onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"></td>
				</tr>
			</table>			
				</form>
			</div>
<div class="wrap">
			<?php
			include "../inc/class/page_course.php";//呈现课程列表
			$page_course = new page();//初始化课程列表页面

			$self = $_SERVER["PHP_SELF"];
			$userid = 0;
			if($_SESSION["role"]==ADMIN){
				if(isset($_GET["userid"])) $userid = $_GET["userid"];
			}else{
				$userid = $_SESSION["userid"];
			}
			$linkPage = "$self";
			//$userid = isset($_GET["userid"])?$_GET["userid"]:0;
			$page_course->fenye($page,$order,$linkPage,$userid,$keyword,$searchTpye,$startTime,$endTime,0,1);//课程列表页面实现分页复选功能
			?>
</div>
</div>