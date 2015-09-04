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
	<li><a href="mycourse.php">我的课程</a>
	<ul>
		<li><a href="mycourse.php?status=1">进行中的课程</a></li>
		<li><a href="mycourse.php?status=2">未开始的课程</a></li>
		<li><a href="mycourse.php?status=3">已结束的课程</a></li>
	</ul>			
		<div class="clear"></div>
	</li>
	<li><a href="#"></a></li>
	<li><a href="#"></a></li>
	<li><a href="#"></a></li>
	<li style="height: 40px;width: auto"><a href="../myinfo.php"><?php echo $_SESSION["username"];?>（<?php echo $_SESSION["realname"];?>）</a>
	<ul>
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
