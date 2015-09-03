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
<script type="text/javascript">
    $(function(){
       $("#sel_order").change(function(){
              $("#btn_search").click();
           });
    });
</script>
<div id="container">
<div class="info">课程单元列表</div>
<div class="wrap">
				<form action="" method="get">
					<?php
					//初始化相关参数
					$searchType = isset($_GET["searchType"])?$_GET["searchType"]:1;
					//通过关键字搜索相关课程单元
					$keyword = isset($_GET["k"])?$_GET["k"]:"";?>
					<?php
					//获取当前排序方式
					$order = isset($_GET["order"])?$_GET["order"]:1;					
					?>
					<table border='1' width='100%' cellspacing='0' cellpadding='0'>
				<tr>
					<td colspan="2">
					<input name="k" value="<?php echo $keyword;?>" type="text" placeholder="请输入关键字...">
					<button id="btn_search" type="submit">搜索课程单元</button>
					</td>
				</tr>
				<tr>
					<td colspan="2"><label><input type="radio" name="searchType" value=1 <?php if($searchType==1){					
					?>checked<?php } ?>>按课程单元名</label> <label><input type="radio" name="searchType" value=2 <?php if($searchType==2){	
					?>checked<?php } ?>>按创建者</label><label><input type="radio" name="searchType" value=3 <?php if($searchType==3){	
					?>checked<?php } ?>>按创建时间(格式:年-月-日，可缺省)</label></td>
				</tr>
			</table>
				</form>
			</div>
<div class="wrap">
<?php
include "../inc/class/page_courseUnit.php";
$f = new page();			

$self = $_SERVER["PHP_SELF"];

$userid = 0;
@$aim = isset($_GET["aim"]) ? $_GET["aim"] : 1;
if($_SESSION["role"]==ADMIN){
	if(isset($_GET["userid"])) $userid = $_GET["userid"];
}else{
	$userid = $_SESSION["userid"];
}

$linkPage = "$self";
//$userid = isset($_GET["userid"])?$_GET["userid"]:0;
if($aim==1)//为课程目录分配课程单元,显示版本信息
$f->fenye($page,$order,$linkPage,$userid,$keyword,$searchType,0,1,1);
else
$f->fenye($page,$order,$linkPage,$userid,$keyword,$searchType,0,1,0);//为课程单元组分配课程单元，不显示版本信息
?>
</div>
</div>