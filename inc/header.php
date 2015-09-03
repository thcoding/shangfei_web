<?php
$isLogin = false;
if(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0){
	$isLogin = true;
}
?>
<div id="header">
	<div id="header2">		

		<div class="headerinner">
			
			<?php
			if($isLogin){//如果已经登录，则显示登出按钮
			?>
			<ul id="logout">	<li><span><a href="logout.php"><span>退出 (<?php echo $_SESSION["realname"];?>)</span></a></span></li></ul>
			<?php }?>

			<ul id="dokeostabs">
				<a href='index.php'><li id="current" class="tab_mycampus_current"><div><span>首页</span></div></li></a>
				<?php
				
				if($isLogin){//根据角色为角色分配标题导航栏
				
				if($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER){//管理员、教员
				?>
				<a href='admin/courseUnit.php'><li class="tab_mycampus"><div><span>课程单元</span></div></li></a>
				<?php }else{//学员?>
				<a href='student/mycourse.php'><li class="tab_mycampus"><div><span>我的课程</span></div></li></a>
				<?php }?>
				<?php 
				if($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER){//管理员、教员
				?>
				<a href='admin/course.php'><li class="tab_mycampus"><div><span>课程</span></div></li></a>
				<?php }?>
				<?php 
				if($_SESSION["role"]==ADMIN){//仅管理员
				?>
				<a href='admin/user.php'><li class="tab_mycampus"><div><span>用户</span></div></li></a>
				<a href='admin/setting.php'><li class="tab_mycampus"><div><span>系统设置</span></div></li></a>
				<?php }//任何人 ?>
				<a href='myinfo.php'><li class="tab_mycampus"><div><span>个人资料</span></div></li></a>
				<?php }?>
			</ul>
		</div>
	</div>		

</div> <!-- end of the whole #header section -->