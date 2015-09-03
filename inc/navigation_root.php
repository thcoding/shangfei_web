<?php
$isLogin = false;
if(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0){
	$isLogin = true;
}
?>
<div style="margin:0 auto; background:#262626">
<ul class="navigation">
	<li style="margin-left:200px"><a href="index.php">首页</a></li>
	<?php
		if($isLogin){//判断是否已登录
		?>

	<?php
	if($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER){//管理员、教员拥有的权限
				?>
	<li><a href="admin/courseUnit.php">课程单元</a>
		<ul>
			<li><a href="admin/courseUnitGroup.php">课程单元组</a></li>
		</ul>
		<div class="clear"></div>
	</li>
	<li><a href="admin/course.php">课程</a>
	<ul>
		<li><a href="admin/courseGroup.php">课程组</a></li>
		<li><a href="admin/course_to_user.php">注册课程</a></li>
	</ul>			
		<div class="clear"></div>
	</li>
	<?php
	if($_SESSION["role"]==ADMIN){//管理员拥有的权限
				?>
	<li><a href="admin/user.php">用户</a>
	<ul>
		<li><a href="admin/userGroup.php">用户组</a></li>
	</ul>			
		<div class="clear"></div>
	</li>
	<li><a href="#"></a></li>
	<?php
			}//if($_SESSION["role"]==ADMIN)
				?>
	<?php
	if($_SESSION["role"]==TEACHER){//教员,加2占位<li>?>
	<li><a href="#"></a></li>
	<li><a href="#"></a></li>
	<?php
			}//if($_SESSION["role"]==TEACHER)
				?>
	
	<?php
			}//if($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER)
	else if($_SESSION["role"]==STUDENT){
				?>
	<li><a href="student/mycourse.php">我的课程</a>
	<ul>
		<li><a href="student/mycourse_in.php">进行中的课程</a></li>
		<li><a href="student/mycourse_undo.php">未开始的课程</a></li>
		<li><a href="student/mycourse_expire.php">已结束的课程</a></li>
	</ul>			
		<div class="clear"></div>
	</li>
	<li><a href="#"></a></li>
	<li><a href="#"></a></li>
	<li><a href="#"></a></li>
	<?php
			}//else if($_SESSION["role"]==STUDENT)
				?>
	<li><a href="myinfo.php"><?php echo $_SESSION["username"];?>（<?php echo $_SESSION["realname"];?>）</a>
	<ul>
	<?php
	if($_SESSION["role"]==ADMIN){//管理员拥有的权限
				?>
		<li><a href="admin/setting.php">恢复已删除</a></li>
	<?php
			}//if($_SESSION["role"]==ADMIN)
				?>
		<li><a href="logout.php">退出登录</a></li>
	</ul>			
		<div class="clear"></div>
	</li>
	<?php 
	}//if(islogin)
				?>
</ul>

<div class="clear"></div>

</div>
