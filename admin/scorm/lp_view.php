<!DOCTYPE html
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>商飞学习管理系统</title>
    <style type="text/css">
        #audiotext{
            border-style:none;
            padding:8px 30px;
            line-height:24px;
            color:#fff;
            font:16px "Microsoft YaHei", Verdana, Geneva, sans-serif;
            cursor:pointer;
            border:1px #ae7d0a solid;
            -webkit-box-shadow:inset 0px 0px 1px #fff;
            -moz-box-shadow:inset 0px 0px 1px #fff;
            box-shadow:inset 0px 0px 1px #fff;
            -webkit-border-radius:4px;
            -moz-border-radius:4px;
            border-radius:4px;
            text-shadow:1px 1px 0px #b67f01;
            background-color:#feb100;
            background-image: -webkit-gradient(linear, 0 0%, 0 100%, from(#feb100), to(#e8a201));
            background-image: -webkit-linear-gradient(top, #feb100 0%, #e8a201 100%);
            background-image: -moz-linear-gradient(top, #feb100 0%, #e8a201 100%);
            background-image: -ms-linear-gradient(top, #feb100 0%, #e8a201 100%);
            background-image: -o-linear-gradient(top, #feb100 0%, #e8a201 100%);
            background-image: linear-gradient(top, #feb100 0%, #e8a201 100%);
        }
    </style>
<style type="text/css" media="screen, projection">
/*<![CDATA[*/
@import "../../css/default.css";
@import "../../css/course_navigation.css";
@import "../../css/main.css";
/*]]>*/


</style>

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<script type="text/javascript" src="../../js/jquery.js"></script>
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
    window.onload = function(){
        window.open (<?php echo $src;?>,'newwindow','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no,status=no');
    }
    $(function(){
       $(window).scroll(function(){
         $("#footer").css({"left":"0","bottom":"0"});
       });
	   $("#title").focus();
    });

</script>
</head>
<body>

<div id="wrapper">

<?php 
session_start();
setcookie(session_name(),session_id(),time()+600,"/");
if(!(isset($_SESSION["userid"]) && $_SESSION["userid"]!=0)){
	header("Location:../../index.php");
	exit();
}

include "../../inc/mysql.php";
include "../../inc/function.php";
include "../../inc/config.php";

//if($_SESSION["role"]==STUDENT){
//	include "../../inc/student_header_childof_studentdir.php";
//}else{
//	include "../../inc/admin_header_childof_admindir.php";
//}

include "learnpath.class.php";
include "learnpathItem.class.php";
include_once "lib/database.lib.php";
$lp_id = $_GET["id"];

$userid = $_SESSION["userid"];

$lp_obj = new learnpath($lp_id,$userid);
$lp_type = $lp_obj->get_type();
$lp_item_id = $lp_obj->get_current_item_id();

$_SESSION["lpobject"] = serialize($lp_obj);

if (!isset($src))
 {
 	$src = '';
	switch($lp_type)
	{
		case 1:
			$lp_obj->stop_previous_item();
			$htmlHeadXtra[] = '<script src="scorm_api.php" type="text/javascript" language="javascript"></script>';
			$prereq_check = $lp_obj->prerequisites_match($lp_item_id);
			if($prereq_check === true){
				$src = $lp_obj->get_link('http',$lp_item_id);
				$lp_obj->start_current_item(); //starts time counter manually if asset
			}else{
				$src = 'blank.php?error=prerequisites';
			}
			break;
		case 2:
			//save old if asset
			$lp_obj->stop_previous_item(); //save status manually if asset
			
			$htmlHeadXtra[] = '<script src="scorm_api.php" type="text/javascript" language="javascript"></script>';
			$prereq_check = $lp_obj->prerequisites_match($lp_item_id);
			
			if($prereq_check === true){
				$src = $lp_obj->get_link('http',$lp_item_id);

				//echo ($lp_item_id." | ".$src);
				
				$lp_obj->start_current_item(); //starts time counter manually if asset

			}else{
				$src = 'blank.php?error=prerequisites';
			}
			
			break;
		case 3:
			//aicc
			$lp_obj->stop_previous_item(); //save status manually if asset
			$htmlHeadXtra[] = '<script src="scorm_api.php" type="text/javascript" language="javascript"></script>';
			$htmlHeadXtra[] = '<script src="'.$lp_obj->get_js_lib().'" type="text/javascript" language="javascript"></script>';
			$prereq_check = $lp_obj->prerequisites_match($lp_item_id);
			if($prereq_check === true){
				$src = $lp_obj->get_link('http',$lp_item_id);
				$lp_obj->start_current_item(); //starts time counter manually if asset
			}else{
				$src = 'blank.php';
			}
			break;
		case 4:
			break;
	}
}

for($i=0; $i<count($htmlHeadXtra); $i++){
	echo $htmlHeadXtra[$i];
}
?>


<div id="main" style="width:1225px"> <!-- start of #main wrapper for #content and #menu divs -->
<!--   Begin Of script Output   -->

<div id="learningPathMain" style="margin-top:5px;margin-bottom:5px;background-color:#666666; ">

	<div id="learningPathLeftZone" style="float:left;width:200px;height:100%;">

	<div id="toc_id" name="toc_name"  style="padding:0;margin-top:0px;height:60%;width:100%">
        <div id="learningPathToc" style="font-size:9pt;margin:0;">
		<?php
		echo $lp_obj->get_html_toc();
		?>
	<!-- end log message layout -->
        </div>
        </div>
	<!-- end toc layout -->

	</div>

	<!-- end learningPathLeftZone layout -->

	<div id="learningPathRightZone" style="margin-left:205px;height:100%;background-color:#666666;">
		<?php
        if($lp_obj->get_total_items_count()>1){

          echo"<div style = 'text-align:right;' >";
          echo "<a href='#' onclick= 'javascript:switch_item($lp_item_id,\"previous\");setTimeout(\"window.location.reload()\", 50);return false;'><img src='../../img/left.png' width='30'></a>
			<a href= '#' onclick = 'javascript:switch_item($lp_item_id,\"next\");setTimeout(\"window.location.reload()\", 50);return false;' ><img src = '../../img/right.png' width = '30' ></a >
		    </div >";
        } 
        ?>

		<iframe id="content_id" name="content_name" src="<?php echo $src;?>" border="0" frameborder="0" class="autoHeight" style="width:100%;height:750px"></iframe>
	</div>

</div></div> <div class="clear">&nbsp;</div> <!-- 'clearing' div to make sure that footer stays below the main and right column sections -->
</div> <!-- end of #main" started at the end of banner.inc.php -->





</body>
</html>
