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
<script type="text/javascript" src="../js/slides.min.jquery.js"></script>
<script type="text/javascript">
        (function ($) {
           try {
                var a = $.ui.mouse.prototype._mouseMove; 
                $.ui.mouse.prototype._mouseMove = function (b) { 
                b.button = 1; a.apply(this, [b]); 
                } 
            }catch(e) {}
        } (jQuery));
    </script>
 
<script type="text/javascript">
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });
	   $("#title").focus();
    });
	function SetWinHeight(obj) 
	{ 
	var win=obj; 
	if (document.getElementById) 
	{ 
	if (win && !window.opera) 
	{ 
	if (win.contentDocument && win.contentDocument.body.offsetHeight){
		if(win.contentDocument.body.offsetHeight<600){
			win.height = 600;//设置最小高度
		   }else{
			win.height = win.contentDocument.body.offsetHeight+50;
			}
		//win.height = win.contentDocument.body.offsetHeight; 
	}else if(win.Document && win.Document.body.scrollHeight){ 
		win.height = win.Document.body.scrollHeight+50;
	}
	} 
	} 
	} 
</script>
</head>
<body>

<div id="wrapper">

<?php 
session_start();
setcookie(session_name(),session_id(),time()+600,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:index.php");
	exit();
}

include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/student_header_in_studentdir.php";
$lp_id = $_GET["id"]
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<iframe width="740" align="center" height="100%" id="showDetail" name="showDetail" onload="Javascript:SetWinHeight(this)" frameborder="0" scrolling=""></iframe>
		</div>
	</div>

<div class="menu" id="menu">

<div class="create_portal">
<ul style="padding-left: 10px;">
<?php
$lpInfo = getLpInfoByLpid($lp_id);
$parentDir = $lpInfo["parentdir"];
$res = $mysql->query("select * from lp_item where parent_item_id=0 and lp_id=".$lp_id." order by display_order");
while($arr = $mysql->fetch_array($res)){
	if($arr["path"]!=""){
		echo "<li><a href='../upload/scorm/".$parentDir."/".$arr["path"]."' target='showDetail'>".$arr["title"]."</a></li>";
	}else{
		echo "<li>".$arr["title"]."<ul style='padding-left:20px;'>";
		$res1 = $mysql->query("select * from lp_item where parent_item_id=".$arr["id"]." and lp_id=".$lp_id." order by display_order");
		while($arr1 = $mysql->fetch_array($res1)){
			if($arr1["path"]!=""){
				echo "<li><a href='../upload/scorm/".$parentDir."/".$arr1["path"]."' target='showDetail'>".$arr1["title"]."</a></li>";
			}else{
			
			}	
		}
		echo "</ul></li>";
	}	
}

?>
</ul>
</div>

</div></div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
