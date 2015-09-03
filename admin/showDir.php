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
	var globalDir = "";
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });
	   $("#div_wait button").click(function(){
			if($(this).html()=="确定"){
				if($("#dirname").val()!=""){
					$.ajax({				
						type: "POST",
						url: "createDir.php",
						data:"dir="+globalDir+"&dirname="+$("#dirname").val(),
						success:function(msg){
							location.reload();
						}
					});
				}else{
					alert("请输入文件夹名称");
				}
				
			}else{
				$(".div_Mask").hide();
				$(".div_wait").hide();
			}
		})
    });	
	function createDir(dir){
		globalDir = dir;
		$(".div_Mask").show();
		$(".div_wait").show();
	}
</script>
</head>
<body>

<div class="div_Mask" id="div_Mask"></div>
<div class="div_wait" id="div_wait"><div style="text-align:center">文件夹名称：<input type="text" id="dirname"><br><br><button>确定</button> <button>取消</button></div></div>

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
include "../inc/function.php";
include "../inc/admin_header_in_admindir_for_courseunitnav.php";
$dir = (isset($_GET["dir"]) && substr($_GET["dir"],0,16)=="../upload/files/")?$_GET["dir"]:"../upload/files/";//只允许列出"../upload/files/"目录下的文件

?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">课程单元文档详情</div>
			<span class="required">*将会替换掉重名文件，请谨慎操作。</span><br><br>
			<form action="uploadSingleFile.php" method="post" enctype="multipart/form-data" onsubmit="return checkFile()">
				请选择文件：<input type="file" name="file" id="file" onchange="checkZip()">
				<button type="submit">上传</button>
				<input type="hidden" name="dir" value="<?php echo $dir;?>">		
			</form>
			<button style="float:right;margin-top:-30px;" onclick="createDir('<?php echo $dir;?>');">创建文件夹</button>
			<div class="wrap">
				<ul>
				<?php
				$dirArr = dir_list($dir);
				echo "<li><a href='?dir=".substr($dir,0,strrpos(substr($dir,0,-1),"/"))."'><img src='../img/back.gif'>父级目录</a></li>";
				for($i=0; $i<count($dirArr); $i++){
					if(is_dir($dirArr[$i])){
						echo "<li><a href='?dir=".iconv("gb2312","utf-8",$dirArr[$i])."/'><img src='../img/folder.gif'>".iconv("gb2312","utf-8",str_replace($dir."/","",$dirArr[$i]))."</a></li>";
					}else{
						echo "<li><img src='../img/text.gif'>".iconv("gb2312","utf-8",str_replace($dir."/","",$dirArr[$i]))."</li>";
					}
					
				}
				?>
				</ul>
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
