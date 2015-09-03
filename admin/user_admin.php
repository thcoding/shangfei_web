<!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>商飞学习管理系统</title>

<style type="text/css" media="screen, projection">
/*<![CDATA[*/
@import "../css/default.css";
@import "../css/main.css";
/*]]>*/
</style>

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript" src="../js/function.js"></script>
<script type="text/javascript" src="../js/slides.min.jquery.js"></script>
 
<script type="text/javascript">
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });       
    });
</script>
</head>
<body>

<div id="wrapper">

<?php 
session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../index.php");
	exit();
}

include "../inc/mysql.php";
include "../inc/admin_header_in_admindir_for_usernav.php";
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">管理员列表</div>
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
								<select name="order">
								<option value="1" <?php echo $by1;?>>时间降序</option>
								<option value="2" <?php echo $by2;?>>时间升序</option>
								<option value="3" <?php echo $by3;?>>部门</option>
								</select>
							</td>
						</tr>
						<tr>
							<td colspan="2"><input type="submit" value="提交"></td>
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

			$linkPage = "$self";

			$f->fenye($page,$order,$linkPage,1,$username,$realname);
			?>
			</div>
		</div>
	</div>
</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
