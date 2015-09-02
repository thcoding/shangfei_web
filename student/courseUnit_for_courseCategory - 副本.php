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
<script type="text/javascript" src="../js/jquery.ztree.all-3.5.min.js"></script>
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
    });
	   $("#player").click(function(){
	   });//传递
	function f_remove(type,cuid,id){
		//if(confirm("确定要移除吗？")){
			$.ajax({				
				type: "GET",
				url: "delete.php",
				data:"type="+type+"&cuid="+cuid+"&id="+id,
				success:function(msg){
					//$("body").html(msg);
				}
			});
		//}
	}
</script>

<?php 
session_start();
include "../inc/config.php";
setcookie(session_name(),session_id(),time()+600,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../index.php");
	exit();
}

include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/student_header_in_studentdir.php";


@$catid = $_GET["catid"];

$res = $mysql->query("select * from courseversion_rel_courseunitversion where coursecategoryid=".$catid);
$arr = $mysql->fetch_array($res);
$courseUnitIds = $arr["courseunitids"];
$courseUnitVersionIds = $arr["courseunitversionids"];
$courseUnitGroupIds = $arr["courseunitgroupids"];

?>

</head>
<body>

<div id="wrapper">
<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">		
			<div class="info">课程单元列表 &nbsp; </div>
			<div class="list_courseUnit">
			<ul>
			<?php
				//从该课程中选出课程单元版本
				$res = $mysql->query("select * from courseversion_rel_courseunitversion where coursecategoryid=".$_GET["catid"]);
				$arr = $mysql->fetch_array($res);//选出所有关于这个单元的版本记录
				$ids = substr($arr["courseunitversionids"],1,-1);//这个单元版本号的字符串
				//die("select * from coursegroup_rel_courseunitversion where coursegroupid=".$_GET["catid"]);
				$res = $mysql->query("select * from courseunitversion_rel_attachment where deleted=0 and id in ($ids) order by time desc");
				$courseunitArr = Array();
				while($arr = $mysql->fetch_array($res)){
					if(@$courseunitArr[$arr["courseunitid"]]["id"] == ""){
						$courseunitArr[$arr["courseunitid"]] = getCourseUnitinfoById($arr["courseunitid"]);
					}
					if($courseunitArr[$arr["courseunitid"]]["lpid"]){
						echo "<li><a href='scormShow.php?id=".$courseunitArr[$arr["courseunitid"]]["lpid"]."' target='_blank'><img src='../img/scorm.png' width='25' title='Scorm'>".$courseunitArr[$arr["courseunitid"]]["title"]."</a></li>";
					}else{
						$attachmentArr = getAttachmentinfoById($arr["attachmentid"]);
						$href= $attachmentArr["indexfile"]==""?$attachmentArr["path"]:$attachmentArr["indexfile"];
						$filename=basename($href);
						if(substr($filename, strrpos($filename, '.') + 1)=="xml"){
						$xmlurl=$href;
						$dir=dirname($href);
						if (is_dir($dir)) //取与xml文件同级目录下的模型文件
						{
							if ($dh = opendir($dir))
								{	
									while (($file = readdir($dh)) !== false)
										{	
											if(substr($file, strrpos($file, '.') + 1)=="unity3d"){
											$modelurl=$dir.$file;
											}
										 }
										 closedir($dh);
								}
						}
						echo "<li>".$courseunitArr[$arr["courseunitid"]]["title"]."<span><a href=
						'../modelplayer/chaizhuang/chaizhuang.php?modelurl=$modelurl&xmlurl=$xmlurl'><img src='../img/player.png'>
					</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>";
						}else{
							echo "<li>".$courseunitArr[$arr["courseunitid"]]["title"]."<span><a href=
						'$href'><img src='../img/player.png'>
					</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>";
						}
					}
					
				}
			?>
			</ul>
			</div>
		</div>
	</div>

<div class="menu" id="menu">

<div class="create_portal">
<ul>
<li><a href="mycourse.php">我的课程</a></li>
<li><a href="mycourse_in.php">进行中的课程</li>
<li><a href="mycourse_undo.php">未开始的课程</li>
<li><a href="mycourse_expire.php">已过期的课程</li>
</ul>
</div>

</div></div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
