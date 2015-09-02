<!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>商飞学习管理系统</title>

<style type="text/css" media="screen, projection">
/*<![CDATA[*/
@import "css/default.css";
@import "css/main.css";
/*]]>*/
</style>

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/slides.min.jquery.js"></script>
<script type="text/javascript" src="js/navigation.js"></script>

</head>
<body>

<div id="wrapper">

<?php 
session_start();
include "inc/config.php";
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
include "inc/navigation_root.php";
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">
<?php
if(isset($_SESSION["userid"]) && $_SESSION["userid"]>0){//判断用户是否已经登录
?>
<div id="content_with_menu">
<?php }else{
?>
<div id="content_with_menu_unlogin">
<?php }
?>
<script type='text/javascript'>
$(function(){
	$("#username").focus();
	$('#slides').mouseover(function () {
		$('#nextbutton').show();
});
$('#slides').mouseout(function () {
		$('#nextbutton').hide();
});
$('#slides').slides({
	preload: true,
	preloadImage: 'img/loading.gif',
	play: 6000,
	pause: 2000,
	hoverPause: true,
	animationStart: function(current){
		$('.slide_caption').animate({
			bottom:-35
		},100);
	},
	animationComplete: function(current){
		$('.slide_caption').animate({
			bottom:0
		},200);
		if (window.console && console.log) {
			// example return of current slide number
			console.log('animationComplete on slide: ', current);
		};
	},
	slidesLoaded: function() {
		$('.slide_caption').animate({
			bottom:0
		},200);
	}
});
});
</script>
<div id="container">
	<div class="siteName">商飞学习管理系统</div>
		<div id="example">
			
			<div id="slides">
				<div class="slides_container"><div class="slide"><img src="img/slide01.jpg" width="720" height="240" title="ARJ21新支线飞机首次走出国门" alt="ARJ21新支线飞机首次走出国门"><div class="slide_caption" style="bottom:0"><p>ARJ21新支线飞机首次走出国门</p></div></div><div class="slide"><img src="img/slide02.jpg" width="720" height="240" title="中国商用飞机有限责任公司" alt="中国商用飞机有限责任公司"><div class="slide_caption" style="bottom:0"><p>中国商用飞机有限责任公司</p></div></div><div class="slide"><img src="img/slide03.jpg" width="720" height="240" title="更安全*更经济*更舒适*更环保" alt="更安全*更经济*更舒适*更环保"><div class="slide_caption" style="bottom:0"><p>更安全*更经济*更舒适*更环保</p></div></div></div>
				<div id="nextbutton" style="display:none;">
				<a href="#" class="prev"><img src="img/arrow-prev.png" width="24" height="43" alt="Arrow Prev"></a>
				<a href="#" class="next"><img src="img/arrow-next.png" width="24" height="43" alt="Arrow Next"></a>
				</div>
			</div>
		</div>		
	</div>
	<table style="width: 730px;" class="white">
		<tr>
			<td><!-- table for the cells of content -->
			<table style="width: 730px;margin:0px;" class="cellscontent">
				
				<tr>
					<td valign="top"><!-- tableau gauche pour les 4 items -->
					<table cellspacing="10" style="width: 100%;" class="quatreitems_scenario table_actions table_actions_rows">
						
						<tr>
							<td class="section_white" style="padding: 10px;">
							<h2>单元重组</h2>
							课程单元可重组，优秀通用的课程单元可以通过加入新<br>的课程重复利用，减少开发成本，提高课程开发效率<img width="64" vspace="0" hspace="0" height="64" border="0" align="right"src="img/plane.png"></td>
							<td class="section_white" style="padding: 10px;">
							<h2>学习跟踪</h2>
							学习系统可以及时的跟踪学习者的学习进度，学习者下次<BR>进入时智能读取学习进度，节省学习时间<img width="64" vspace="0" hspace="0" height="64" border="0" align="right" src="img/track.png"></td>
						</tr>
						<tr>
							<td class="section_white" style="padding: 10px;">
							<h2>支持多种课件标准</h2>
							本学习系统不仅支持多媒体学习资源图片，文档和视频，<BR> 还支持多种电子课件标准，比如scorm2004等<img width="64" vspace="0" hspace="0" height="64" border="0" align="right" src="img/bag.png"></td>
							<td class="section_white" style="padding: 10px;">
							<h2>移动学习</h2>
							本学习系统的移动客户端同时支持在线和离线学习，方便<BR>学习者随时随地查阅学习内容，了解课程信息<img width="64" vspace="0" hspace="0" height="64" border="0" align="right" src="img/mobile.png"></td>
						</tr>
						
					</table>
					<!-- fin tableau gauche pour les 4 items --></td>
				</tr>
				
			</table>
			<!-- end table for the cells of content --></td>
		</tr>            
	</table>
</div>

<div class="menu" id="menu">

<?php
if(isset($_SESSION["userid"]) && $_SESSION["userid"]>0){//判断用户是否已经登录
?>

<?php }
else{//用户尚未登录，则填写信息后，跳转到login.php?>
<form  action="login.php" method="post" name="formLogin" id="formLogin">
<div ><label>用户名</label></div><div><input name="username" id="username" type="text" /></div><div ><label>密码</label></div><div><input name="password" type="password" /></div><div ><label></label></div><div><button class="login" name="submitAuth" type="submit" >登录</button></div>

	<div class="clear">
		&nbsp;
	</div>
</form>
<?php }?>

</div></div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php if(isset($_SESSION["userid"]) && $_SESSION["userid"]>0)include "inc/footer.php";?>

</body>
</html>
