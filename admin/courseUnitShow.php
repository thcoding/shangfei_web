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
 
<script type="text/javascript">
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });
	   
		$("#div_wait button").click(function(){
			if($(this).html()=="确定"){
				if($("input[name='indexfile']:checked").val()){
					$.ajax({				
						type: "POST",
						url: "setIndexFile.php",
						data:"file="+$("input[name='indexfile']:checked").val()+"&id="+globalId,
						success:function(msg){
							location.reload();
						}
					});
				}else{
					alert("请选中一个文件作为入口文件");
				}
				
			}else{
				$(".div_Mask").hide();
				$(".div_wait").hide();
			}
		})
    });
</script>
</head>
<body>

<div class="div_Mask" id="div_Mask"></div>
<div class="div_wait" id="div_wait"><div class="indexfile" id="indexfile"></div><div style="text-align:center"><button>确定</button> <button>取消</button></div></div>

<div id="wrapper">

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

@$id = $_GET["id"];
?>

<div class="clear">&nbsp;</div>
<div id="main"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->
<div id="content" class="maxcontent">

	<div id="content_with_menu">
		<div id="container">
			<div class="info">课程单元详情</div>
			<form action="upload.php" method="post" enctype="multipart/form-data" onsubmit="return checkFile()">
				请选择课程单元包：<input type="file" name="file" id="file" onchange="checkZip()">				
				<span id="isUnzip">是否解压：<label><input type="radio" name="unzip" value="1" checked>是</label> <label><input type="radio" name="unzip" value="0">否</label></span>
				<button type="submit">上传</button>
				<input type="hidden" name="id" value="<?php echo $id;?>">
				<p>
				<div>&nbsp; &nbsp; 课程单元包类型：<select name="packageType"><option value="1" selected>普通文件</option><option value="2">SCORM文件</option><option value="3">AICC文件</option></select></div>
				<?php
					$res = $mysql->query("select * from courseunitversion_rel_attachment where deleted=0 and courseunitid=".$id);
					if($mysql->num_rows($res)>0){
				?>				
				<p>
				<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 操作方式：<label><input type="radio" name="rewrite" value="1" checked>覆盖掉</label><select name="versionid">
				<?php					
					while($arr = $mysql->fetch_array($res)){
						echo "<option value='$arr[id]'>".$arr["versionname"]."</option>";
					}
				?>
				</select><label><input type="radio" name="rewrite" value="0" >生成新的版本</label><span id="newVersion"><input type="text" name="versionname" id="versionname"><span class="required">*</span></span></div>
				<?php }?>
			</form>

			<div class="wrap">
				<table border="1" cellspacing="0" cellpadding="0" width="100%">
					<tr>
						<th>编号</th>
						<th>版本名称</th>
						<th>类型</th>
						<th>课程包大小</th>
						<th>文件类型</th>
						<th>是否已解压</th>
						<th>起始文件</th>
						<th>文档目录</th>
						<th>操作</th>
					</tr>
				<?php
					$i=1;
					$res = $mysql->query("select * from courseunitversion_rel_attachment where deleted=0 and courseunitid=".$id);//查询课程单元中所有学习包版本
					while($arr = $mysql->fetch_array($res)){
						$attachmentArr = getAttachmentinfoById($arr["attachmentid"]);//获取附件信息
						if($attachmentArr["size"]>1048576){
							$size = round($attachmentArr["size"]/1048576,2)."GB";
						}else if($attachmentArr["size"]>1024){
							$size = round($attachmentArr["size"]/1024,2)."MB";
						}else{
							$size = $attachmentArr["size"]."KB";
						}
						$packageType = $arr["lpid"]?"SCORM/AICC":"普通文件";
                        if($packageType=="SCORM/AICC"){
                            $reslp= $mysql->query("select * from lp where id=".$arr["lpid"]);
                            $arrlp=$mysql->fetch_array($reslp);
                            $jslib=$arrlp["js_lib"];
                            $packageType=strstr($jslib,"aicc");
                            if(strstr($jslib,"aicc")){
                                $packageType="AICC";
                                if($arrlp["lp_interface"]==0) {
                                    $viewsrc = "../upload/scorm/" . $arrlp["parentdir"] . "/main.html";
                                }else{
                                    $hosturl=$_SERVER['SERVER_NAME'].'%3a'.$_SERVER['SERVER_PORT'];
                                    $viewsrc = "../upload/scorm/" . $arrlp["parentdir"] . "/xg.html?AICC_SID=$arr[lpid]&AICC_URL=http%3a%2f%2f$hosturl%2fadmin%2fMyLessonAiccProcessor.php";
                                }
                                //$viewsrc="scorm/lp_view.php?id=$arr[lpid]";
                            }else{
                                $packageType="SCORM";
                                $viewsrc="scorm/lp_view.php?id=$arr[lpid]";
                            }

                        }
						if($attachmentArr["type"]=="zip"){
							if($arr["lpid"]>0){//SCORM/AICC文件

                                echo "<tr><td>".$i++."</td><td>".$arr["versionname"]."</td><td>".$attachmentArr["type"]."</td><td>".$size."</td><td>".$packageType."</td><td>是</td><td>不可用</td><td>不可用</td>";
								echo "<td><a href='$viewsrc' target='_blank'><img src='../img/look.gif' alt='查看' title='查看'></a><a href='delete.php?type=6&id=".$arr["id"]."&cid=$id'><img src='../img/delete.png' alt='删除' title='删除'></a></td></tr>";

							}else{
								echo "<tr><td>".$i++."</td><td>".$arr["versionname"]."</td><td>".$attachmentArr["type"]."</td><td>".$size."</td><td>".$packageType."</td><td>".($attachmentArr["unzip"]?"是":"否")."</td><td><a href='javascript:;' title='点击设置' onclick='setIndexFile(\"".pathinfo($attachmentArr["path"],PATHINFO_DIRNAME)."/unzip/\",$attachmentArr[id])'>设置入口文件</a></td><td><a href='showDir.php?dir=".pathinfo($attachmentArr["path"],PATHINFO_DIRNAME)."/unzip/' target='_blank'>查看</a></td>";
								if($attachmentArr["indexfile"]){
									echo "<td><a href='".$attachmentArr["indexfile"]."' target='_blank'><img src='../img/look.gif' alt='查看' title='查看'></a>";
								}else{
									echo "<td><a href='javascript:;' onclick='alert(\"请先设置起始文件\");setIndexFile(\"".pathinfo($attachmentArr["path"],PATHINFO_DIRNAME)."/unzip/\",$attachmentArr[id])' target='_blank'><img src='../img/look.gif' alt='查看' title='查看'></a>";
								}
								echo "<a href='".$attachmentArr["path"]."'><img src='../img/down.gif' alt='下载' title='下载'></a><a href='delete.php?type=6&id=".$arr["id"]."&cid=$id'><img src='../img/delete.png' alt='删除' title='删除'></a></td></tr>";
							}
							
						}else{
							echo "<tr><td>".$i++."</td><td>".$arr["versionname"]."</td><td>".$attachmentArr["type"]."</td><td>".$size."</td><td>".$packageType."</td><td>不可用</td><td>不可用</td><td>不可用</td>";
							echo "<td><a href='".$attachmentArr["path"]."'><img src='../img/down.gif' alt='下载' title='下载'></a><a href='delete.php?type=6&id=".$arr["id"]."&cid=$id'><img src='../img/delete.png' alt='删除' title='删除'></a></td></tr>";
						}
					}
				?>
				</table>
			</div>
			
		</div>
		<div class="actions">
			<a href="courseUnitSetting.php?id=<?php echo $id;?>">设置</a>
		</div>
	</div>

</div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->

<div class="push"></div>
</div> <!-- end of #wrapper section -->

<?php include "../inc/footer.php";?>
</body>
</html>
