<?php
$isLogin = false;
if(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0){
	$isLogin = true;
}
?>
<div style="margin:0 auto; background:#262626">
<ul class="navigation">
	<li style="margin-left:200px"><a href="../index.php">首页</a></li>
	<?php
		if($isLogin){//判断是否已登录
		?>

	<?php
	if($_SESSION["role"]==ADMIN || $_SESSION["role"]==TEACHER){//管理员、教员拥有的权限
				?>
	<li><a href="courseUnit.php">课程单元</a>
		<ul>
			<li><a href="courseUnitGroup.php">课程单元组</a></li>
		</ul>
		<div class="clear"></div>
	</li>
	<li><a href="course.php">课程</a>
	<ul>
		<li><a href="courseGroup.php">课程组</a></li>
		<li><a href="course_to_user.php">注册课程</a></li>
	</ul>			
		<div class="clear"></div>
	</li>
	<?php
	if($_SESSION["role"]==ADMIN){//管理员拥有的权限
				?>
	<li><a href="user.php">用户</a>
	<ul>
		<li><a href="userGroup.php">用户组</a></li>
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
				?>
	<li style="height: 40px;width: auto"><a href="../myinfo.php" ><?php echo $_SESSION["username"];?>（<?php echo $_SESSION["realname"];?>）</a>
	<ul>
	<?php
	if($_SESSION["role"]==ADMIN){//管理员拥有的权限
				?>
		<li><a href="setting.php">恢复已删除</a></li>
	<?php
			}//if($_SESSION["role"]==ADMIN)
				?>
		<li><a href="../logout.php">退出登录</a></li>
	</ul>			
		<div class="clear"></div>
	</li>
	<?php 
	}//if(islogin)
				?>
</ul>

<div class="clear"></div>

</div>
