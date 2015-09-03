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
<div class="info">用户列表</div>
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
							<td colspan="2"><input id="btn_search" type="submit" value="提交"></td>
						</tr>
					</table>
				</form>
			</div>
<div class="wrap">
<?php
include "../inc/class/page_user.php";
$f = new page();			

$self = $_SERVER["PHP_SELF"];
$userid = 0;
if($_SESSION["role"]==ADMIN){
	if(isset($_GET["userid"])) $userid = $_GET["userid"];
}else{
	$userid = $_SESSION["userid"];
}

$linkPage = "$self";
//$userid = isset($_GET["userid"])?$_GET["userid"]:0;
$f->fenye($page,$order,$linkPage,0,$username,$realname,0,1);
?>
</div>
</div>