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
<script type="text/javascript" src="../js/navigation.js"></script>

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
include "../inc/navigation_admin.php";

@$catid = 70;
@$groupid = $_GET["id"];

$res = $mysql->query("select * from usergroup where groupid=".$groupid);
$arr = $mysql->fetch_array($res);
$userIds = $arr["userids"];
?>
<script type="text/javascript">
    var arrIds = new Array();
	var userIds0 = userIds = "<?php echo $userIds?$userIds:",";?>";
	var userGroup = "<?php echo $groupid?$groupid:",";?>";
	var postType = 0;
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });
	   $("#div_wait button").click(function(){
			if($(this).html()=="确定"){
				/*$("#pager_list").contents().find("input[type='checkbox']:checked").each(function(){
					alert($(this).val());
				})*/
				//alert(courseUnitIds);
				$.ajax({				
					type: "POST",
					url: "fenpei.php",
					data:"type="+postType+"&user="+userIds+"&userGroup="+userGroup,
					success:function(msg){
						location.reload();
					}
				});
			}else{
				userIds = userIds0;
				$(".div_Mask").hide();
				$(".div_wait").hide();
			}
		});
		$("#pager_list").load(function(){
			
			//是否应该选中
			$("#pager_list").contents().find("input[type='checkbox']").each(function(){
				//alert(courseUnitIds.indexOf(","+$(this).val()+","));
				if(userIds.indexOf(","+$(this).val()+",")>-1){
					$(this).attr("checked",true);
				}
			})
			$("#pager_list").contents().find("input[type='checkbox']").click(function(){
				if($(this).is(':checked')){
					//alert($(this).val());
					userIds += $(this).val()+",";
				}else{
					userIds = userIds.replace(","+$(this).val()+",",",");
				}
			})
		}); 
    });
	function setIframeSrc(type){
		postType = type;
		if(type==14){
			$("#pager_list").attr("src","userlist.php");			
		}else{
			$("#pager_list").attr("src","courseUnitGroupList.php");
		}
		$(".div_Mask").show();
		$(".div_wait").show();
	}
	function f_remove(type,cuid,id){
		//if(confirm("确定要移除吗？")){
			$.ajax({				
				type: "GET",
				url: "delete.php",
				data:"type="+type+"&cid="+cuid+"&id="+id,
				success:function(msg){
					//$("body").html(msg);
				}
			});
		//}
	}
</script>
</head>
<body>

<div class="div_Mask" id="div_Mask"></div>
<div class="div_wait" id="div_wait" style="position: absolute;left: 50%;top: 10%;width: 800px;margin-left: -400px;height:530px;max-height:530px;overflow:hidden"><div class="div_pager_list" id="div_pager_list"><iframe name="pager_list" id="pager_list" src="" width="800px" height="500px;" frameborder="0"></iframe></div><div style="text-align:center"><button>确定</button> <button>取消</button></div></div>

<div id="wrapper">

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
		
			<div class="info">【<?php echo $_GET["title"];?>】所含有的用户列表&nbsp; <a href="javascript:;" onclick="setIframeSrc(14);"><img src="../img/add.jpg" width="15" title="添加用户到用户组" alt="添加用户到用户组"></a></div>
			<div class="list_courseUnit">
			<ul>
			<?php

				$res = $mysql->query("select * from usergroup where groupid=".$_GET["id"]);
				$arr = $mysql->fetch_array($res);
				$ids = substr($arr["userids"],1,-1);
				//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
				$res = $mysql->query("select * from user where deleted=0 and id in ($ids) order by time desc");
				while($arr = $mysql->fetch_array($res)){
					echo "<li><span><a href='javascript:;' onclick='if(confirm(\"确定要移除吗？\")){f_remove(54,$arr[id],$_GET[id]);$(this).parent().parent().remove();}'><img src='../img/delete.png'></a></span><a href='course_for_user.php?id=$arr[id]&title=$arr[realname]'>".$arr["realname"]."</a></li>";
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
