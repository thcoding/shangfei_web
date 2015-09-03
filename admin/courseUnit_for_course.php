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
<?php 
session_start();
setcookie(session_name(),session_id(),time()+$sessionTime,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../index.php");
	exit();
}

include "../inc/mysql.php";
include "../inc/function.php";
include "../inc/admin_header_in_admindir_for_coursenav.php";

@$id = $_GET["id"];

$res = $mysql->query("select * from courseversion_rel_courseunitversion where courseid=".$id);
$arr = $mysql->fetch_array($res);
$courseUnitIds = $arr["courseunitids"];
$courseUnitVersionIds = $arr["courseunitversionids"];
$courseUnitGroupIds = $arr["courseunitgroupids"];
?>
<script type="text/javascript">
    var arrIds = new Array();
	var courseUnitIds0 = courseUnitIds = "<?php echo $courseUnitIds?$courseUnitIds:",";?>";
	var courseUnitVersionIds0 = courseUnitVersionIds = "<?php echo $courseUnitVersionIds?$courseUnitVersionIds:",";?>";
	var courseUnitGroupIds0 = courseUnitGroupIds = "<?php echo $courseUnitGroupIds?$courseUnitGroupIds:",";?>";
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
             alert('w'+postType);
				$.ajax({				
					type: "POST",
					url: "fenpei.php",
					data:"type="+postType+"&courseUnit="+courseUnitIds+"&courseUnitVersion="+courseUnitVersionIds+"&courseUnitGroup="+courseUnitGroupIds+"&toCourseId=<?php echo $_GET['id'];?>",
					success:function(msg){
						location.reload();
					}
				});
			}else{
				courseUnitIds = courseUnitIds0;
				courseUnitVersionIds = courseUnitVersionIds0;
				courseUnitGroupIds = courseUnitGroupIds0
				$(".div_Mask").hide();
				$(".div_wait").hide();
			}
		});
		$("#pager_list").load(function(){
			
			//是否应该选中
			$("#pager_list").contents().find("input[type='checkbox']").each(function(){
				//alert(courseUnitIds.indexOf(","+$(this).val()+","));
				if(courseUnitIds.indexOf(","+$(this).val()+",")>-1){
					$(this).attr("checked",true);
				}
			})
			$("#pager_list").contents().find("input[type='radio']").each(function(){
				//alert(courseUnitIds.indexOf(","+$(this).val()+","));
				if(courseUnitVersionIds.indexOf(","+$(this).val()+",")>-1){
					$(this).attr("checked",true);
				}
			})

			$("#pager_list").contents().find("input[type='checkbox']").click(function(){
				if($(this).is(':checked')){
					//alert($(this).val());
					courseUnitIds += $(this).val()+",";
				}else{
					courseUnitIds = courseUnitIds.replace(","+$(this).val()+",",",");
				}
			})
			$("#pager_list").contents().find("input[type='radio']").click(function(){
				if($(this).is(':checked')){
					//alert($(this).val());
					courseUnitVersionIds += $(this).val()+",";
				}else{
					courseUnitVersionIds = courseUnitVersionIds.replace(","+$(this).val()+",",",");
				}
			})
		}); 
    });
	function setIframeSrc(type){
		postType = type;
		if(type==13){
			$("#pager_list").attr("src","courseUnitlist.php");			
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
				data:"type="+type+"&cuid="+cuid+"&id="+id,
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
		
			<div class="info">【<?php echo $_GET["title"];?>】所含有的课程单元列表 &nbsp; <a href="javascript:;" onclick="setIframeSrc(13);"><img src="../img/add.jpg" width="15" title="添加课程单元" alt="添加课程单元"></a></div>
			<div class="list_courseUnit">
			<ul>
			<?php

				$ids = substr($courseUnitVersionIds,1,-1);
				//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
				$res = $mysql->query("select * from courseunitversion_rel_attachment where deleted=0 and id in ($ids) order by time desc");
				echo "select * from courseunitversion_rel_attachment where deleted=0 and id in ($ids) order by time desc";
				die();
				$courseunitArr = Array();
				while($arr = $mysql->fetch_array($res)){
					if(@$courseunitArr[$arr["courseunitid"]]["id"] == ""){
						$courseunitArr[$arr["courseunitid"]] = getCourseUnitinfoById($arr["courseunitid"]);
					}
					if($courseunitArr[$arr["courseunitid"]]["lpid"]){
						echo "<li><span><a href='javascript:;' onclick='if(confirm(\"确定要移除吗？\")){f_remove(341,".$arr["id"].",$_GET[id]);$(this).parent().parent().remove();}'><img src='../img/delete.png'></a></span><a href='scormShow.php?id=".$courseunitArr[$arr["courseunitid"]]["lpid"]."' target='_blank'><img src='../img/scorm.png' width='25' title='Scorm'>".$courseunitArr[$arr["courseunitid"]]["title"]."</a></li>";
					}else{
						echo "<li><span><a href='javascript:;' onclick='if(confirm(\"确定要移除吗？\")){f_remove(341,".$arr["id"].",$_GET[id]);$(this).parent().parent().remove();}'><img src='../img/delete.png'></a></span><a href='courseUnitShow.php?id=".$courseunitArr[$arr["courseunitid"]]["id"]."'>".$courseunitArr[$arr["courseunitid"]]["title"]."</a></li>";
					}
				}
			?>
			</ul>
			</div>

			
			<div class="list_courseUnit">
			<ul>
			<?php

				$res = $mysql->query("select * from courseversion_rel_courseunitversion where courseid=".$id);
				$arr = $mysql->fetch_array($res);
				$ids = substr($arr["courseunitgroupids"],1,-1);
				//die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
				$res = $mysql->query("select * from `group` where deleted=0 and id in ($ids) order by time desc");
				while($arr = $mysql->fetch_array($res)){
					echo "<li><span><a href='javascript:;' onclick='if(confirm(\"确定要移除吗？\")){f_remove(342,$arr[id],$_GET[id]);$(this).parent().parent().remove();}'><img src='../img/delete.png'></a></span><a href='courseUnit_for_group.php?id=$arr[id]&title=$arr[title]'>".$arr["title"]."</a></li>";
				}
			?>
			</ul>
			</div>
		</div>
		<div class="actions">
			<a href="courseSetting.php?id=<?php echo $id;?>">设置</a>
		</div>
	</div>
</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>

</body>
</html>
