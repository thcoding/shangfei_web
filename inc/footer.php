<?php
include_once "mysql.php";
include_once "function.php";
$info = getSiteStatistics();//获取数据库相关信息
?>
<div id="footer"> <!-- start of #footer section -->
	<div id="footerinner">
		<div id="bottom_corner"></div>
<span id="platformmanager">商飞学习管理系统 &nbsp; &nbsp; <span style="color:#999;font-weight:normal">
<?php
//网站访问统计
echo "课程单元统计：".$info["courseunit"]."，课程统计：".$info["course"]."，用户统计：".$info["user"];
?></span></span>&nbsp;
	</div>
</div> <!-- end of #footer -->