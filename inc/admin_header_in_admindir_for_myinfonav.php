<div id="header">
	<div id="header2">
		<div class="headerinner">

			<ul id="logout">	<li><span><a href="logout.php"><span>退出 (<?php echo $_SESSION["realname"];?>)</span></a></span></li></ul>

			<ul id="dokeostabs">
				<a href='index.php'><li class="tab_mycampus"><div><span>首页</span></div></li></a>
				<a href='admin/courseUnit.php'><li class="tab_mycampus"><div><span>课程单元</span></div></li></a>
				<a href='admin/course.php'><li class="tab_mycampus"><div><span>课程</span></div></li></a>
				<?php 
				if($_SESSION["role"]==ADMIN){
				?>
				<a href='admin/user.php'><li class="tab_mycampus"><div><span>用户</span></div></li></a>
				<a href='admin/setting.php'><li class="tab_mycampus"><div><span>系统设置</span></div></li></a>
				<?php } ?>
				<a href='myinfo.php'><li class="tab_mycampus_current" id="current"><div><span>个人资料</span></div></li></a>
			</ul>
		</div>
	</div>		

</div> <!-- end of the whole #header section -->