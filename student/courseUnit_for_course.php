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
@import "../css/zTreeStyle/zTreeStyle.css";
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

function getNodes($parentId){
	global $mysql;
	$arrTemp = array();
	
	$res = $mysql->query("select id,name,parentid from coursecategory where parentid=".$parentId." order by id");
	$num = $mysql->num_rows($res);
	while($arr = $mysql->fetch_array($res)){
		$arr["open"] = true;
		$arrTemp["children"][] = $arr;
		$res2 = $mysql->query("select id,name,parentid from coursecategory where parentid=".$arr["id"]." order by id");
		$num2 = $mysql->num_rows($res2);
		echo $num2."aa ";
		if($num2>0){
			getNodes($arr["id"]);
		}
	}
	return $arrTemp;
}

//print_r(getNodes(7));
//die();

$link = "../student/courseUnit_for_courseCategory.php";

@$id = $_GET["id"];
$res = $mysql->query("select id,name from coursecategory where courseid=".$id." order by id");
while($arr = $mysql->fetch_array($res)){
	$arr["open"] = true;
	$res2 = $mysql->query("select id,name from coursecategory where parentid=".$arr["id"]." order by id");
	$num2 = $mysql->num_rows($res2);
	if($num2==0)$arr["url"] = $link."?catid=".$arr["id"];
	while($arr2 = $mysql->fetch_array($res2)){
		$arr2["open"] = true;
		$res3 = $mysql->query("select id,name from coursecategory where parentid=".$arr2["id"]." order by id");
		$num3 = $mysql->num_rows($res3);
		if($num3==0)$arr2["url"] = $link."?catid=".$arr2["id"];
		while($arr3 = $mysql->fetch_array($res3)){
			$arr3["open"] = true;

			$res4 = $mysql->query("select id,name from coursecategory where parentid=".$arr3["id"]." order by id");
			$num4 = $mysql->num_rows($res4);
			if($num4==0)$arr3["url"] = $link."?catid=".$arr3["id"];
			while($arr4 = $mysql->fetch_array($res4)){
				$arr4["open"] = true;

				$res5 = $mysql->query("select id,name from coursecategory where parentid=".$arr4["id"]." order by id");
				$num5 = $mysql->num_rows($res5);
				if($num5==0)$arr4["url"] = $link."?catid=".$arr4["id"];
				while($arr5 = $mysql->fetch_array($res5)){
					$arr5["open"] = true;

					$res6 = $mysql->query("select id,name from coursecategory where parentid=".$arr5["id"]." order by id");
					$num6 = $mysql->num_rows($res6);
					if($num6==0)$arr5["url"] = $link."?catid=".$arr5["id"];
					while($arr6 = $mysql->fetch_array($res6)){
						$arr6["open"] = true;

						$res7 = $mysql->query("select id,name from coursecategory where parentid=".$arr6["id"]." order by id");
						$num7 = $mysql->num_rows($res7);
						if($num7==0)$arr6["url"] = $link."?catid=".$arr6["id"];
						while($arr7 = $mysql->fetch_array($res7)){
							$arr7["open"] = true;
							$arr6["children"][] = $arr7;
						}
						$arr5["children"][] = $arr6;
					}
					$arr4["children"][] = $arr5;
				}
				$arr3["children"][] = $arr4;
			}
			$arr2["children"][] = $arr3;
		}

		$arr["children"][] = $arr2;
	}

	$node["children"][] = $arr;
}

$nodes = "children:".json_encode($node["children"],JSON_UNESCAPED_UNICODE);
?>

<style type="text/css">
div#rMenu {position:absolute; visibility:hidden; top:0; background-color: #555;text-align: left;padding: 2px;}
div#rMenu ul{margin:0;padding:0}
div#rMenu ul li{
	margin: 1px 0;
	padding: 0 5px;
	cursor: pointer;
	list-style: none outside none;
	background-color: #DFDFDF;
	font-size:16px;
}
</style>

<SCRIPT type="text/javascript">
var setting = {
	view: {
		dblClickExpand: true
	},
	edit: {
		enable: false,
		editNameSelectAll: true
	},
	callback: {
		onRightClick: OnRightClick,
	}
};

var zNodes =[
	{id:<?php echo $id;?>, name:"<?php echo $_GET['title'];?>", open:true, isCourse:true,<?php echo $nodes;?>}
];



function zTreeOnClick(event, treeId, treeNode) {
	alert(treeNode.tId + ", " + treeNode.name);
};

function OnRightClick(event, treeId, treeNode) {

}


var zTree, rMenu;
$(document).ready(function(){
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	zTree = $.fn.zTree.getZTreeObj("treeDemo");
	rMenu = $("#rMenu");
});
</SCRIPT>

</head>
<body>

<div id="wrapper">
<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="zTreeDemoBackground left">
				<ul id="treeDemo" class="ztree"></ul>
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
