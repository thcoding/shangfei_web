
<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript">
    $(function(){
       $("#sel_order").change(function(){
              $("#btn_search").click();
           });
    });
</script>
<?php
if($y==11){
?>

<div><b>课程单元</b> &nbsp; &nbsp; &nbsp; <a href="?x=1&y=12">课程</a> &nbsp; &nbsp; &nbsp; <a href="?x=1&y=13">用户</a></div>
<br><br>
<div class="search">
<form action="" method="get">
	<?php
	$keyword = isset($_GET["k"])?$_GET["k"]:"";
	$by1 = $by2 = $by3 = $by4 = "";
	$order = 1;
	if(isset($_GET["order"])){
		switch($_GET["order"]){
			case 1:
				$by1 = "selected";
				$order = 1;
				break;
			case 2:
				$by2 = "selected";
				$order = 2;
				break;
			case 3:
				$by3 = "selected";
				$order = 3;
				break;
			case 4:
				$by4 = "selected";
				$order = 4;
				break;
		}
	}					
	
	?>
	<table>
		<tr>
			<td>搜索关键词</td>
			<td><input name="k" value="<?php echo $keyword;?>"></td>
		</tr>
		<tr>
			<td>排序方式</td>
			<td>
				<select id="sel_order" name="order">
				<option value="1" <?php echo $by1;?>>创建时间降序</option>
				<option value="2" <?php echo $by2;?>>创建时间升序</option>
				<option value="3" <?php echo $by3;?>>创建者</option>
				<option value="4" <?php echo $by4;?>>课程单元名称</option>
				</select>
			</td>
		</tr>
		<tr>
			<td colspan="2"><input type="hidden" name="x" value="1"><input type="hidden" name="y" value="11"><input id="btn_search" type="submit" value="提交"></td>
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
if($_SESSION["role"]==ADMIN){
	if(isset($_GET["userid"])) $userid = $_GET["userid"];
}else{
	$userid = $_SESSION["userid"];
}

$linkPage = "$self?x=1&y=11";
//$userid = isset($_GET["userid"])?$_GET["userid"]:0;
$f->fenye($page,$order,$linkPage,$userid,$keyword,1);
?>
</div>
<?php
}else if($y==12){
?>
<div><a href="?x=1&y=11">课程单元</a> &nbsp; &nbsp; &nbsp; <b>课程</b> &nbsp; &nbsp; &nbsp; <a href="?x=1&y=13">用户</a></div>
<br><br>
<div class="search">
<form action="" method="get">
	<?php
	$keyword = isset($_GET["k"])?$_GET["k"]:"";
	$by1 = $by2 = $by3 = $by4 = "";
	$order = 1;
	if(isset($_GET["order"])){
		switch($_GET["order"]){
			case 1:
				$by1 = "selected";
				$order = 1;
				break;
			case 2:
				$by2 = "selected";
				$order = 2;
				break;
			case 3:
				$by3 = "selected";
				$order = 3;
				break;
			case 4:
				$by4 = "selected";
				$order = 4;
				break;
		}
	}					
	
	?>
	<table>
		<tr>
			<td>搜索关键词</td>
			<td><input name="k" value="<?php echo $keyword;?>"></td>
		</tr>
		<tr>
			<td>排序方式</td>
			<td>
				<select id="sel_order" name="order">
				<option value="1" <?php echo $by1;?>>创建时间降序</option>
				<option value="2" <?php echo $by2;?>>创建时间升序</option>
				<option value="3" <?php echo $by3;?>>创建者</option>
				<option value="4" <?php echo $by4;?>>课程名称</option>
				</select>
			</td>
		</tr>
		<tr>
			<td colspan="2"><input type="hidden" name="x" value="1"><input type="hidden" name="y" value="12"><input id="btn_search" type="submit" value="提交"></td>
		</tr>
	</table>
</form>
</div>
<div class="wrap">
<?php
include "../inc/class/page_course.php";
$f = new page();

$self = $_SERVER["PHP_SELF"];
$userid = 0;
if($_SESSION["role"]==ADMIN){
if(isset($_GET["userid"])) $userid = $_GET["userid"];
}else{
$userid = $_SESSION["userid"];
}

$linkPage = "$self?x=1&y=12";
//$userid = isset($_GET["userid"])?$_GET["userid"]:0;
$f->fenye($page,$order,$linkPage,$userid,$keyword,1);
?>
</div>
<?php
}else if($y==13){
?>
<div><a href="?x=1&y=11">课程单元</a> &nbsp; &nbsp; &nbsp; <a href="?x=1&y=12">课程</a> &nbsp; &nbsp; &nbsp; <b>用户</b></div>
<br><br>
<div class="search">
<form action="" method="get">
	<?php
	$username = isset($_GET["username"])?$_GET["username"]:"";
	$realname = isset($_GET["realname"])?$_GET["realname"]:"";
	$by1 = $by2 = $by3 = "";
	$order = 1;
	if(isset($_GET["order"])){
		switch($_GET["order"]){
			case 1:
				$by1 = "selected";
				$order = 1;
				break;
			case 2:
				$by2 = "selected";
				$order = 2;
				break;
			case 3:
				$by3 = "selected";
				$order = 3;
				break;
		}
	}					
	
	?>
	<table>
		<tr>
			<td>用户名</td>
			<td><input name="username" value="<?php echo $username;?>"></td>
		</tr>
		<tr>
			<td>真实姓名</td>
			<td><input name="realname" value="<?php echo $realname;?>"></td>
		</tr>
		<tr>
			<td>排序方式</td>
			<td>
				<select id="sel_order" name="order">
				<option value="1" <?php echo $by1;?>>创建时间降序</option>
				<option value="2" <?php echo $by2;?>>创建时间升序</option>
				<option value="3" <?php echo $by3;?>>部门</option>
				</select>
			</td>
		</tr>
		<tr>
			<td colspan="2"><input type="hidden" name="x" value="1"><input type="hidden" name="y" value="13"><input id="btn_search" type="submit" value="提交"></td>
		</tr>
	</table>
</form>
</div>
<div class="wrap">
<?php
include "../inc/class/page_user.php";
$f = new page();

$by = "order by time desc";

$self = $_SERVER["PHP_SELF"];

$linkPage = "$self?x=1&y=13";

$f->fenye($page,$order,$linkPage,0,$username,$realname,1);
?>
</div>
<?php
}else{
?>
<div><a href="?x=1&y=11">课程单元</a> &nbsp; &nbsp; &nbsp; <a href="?x=1&y=12">课程</a> &nbsp; &nbsp; &nbsp; <a href="?x=1&y=13">用户</a></div>
<?php
}
?>