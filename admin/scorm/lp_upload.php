<?php

/* For licensing terms, see /dokeos_license.txt */

/**
 * Learning Path
 * Script managing the learnpath upload. To best treat the uploaded file, make sure we can identify it.
 * Upload: This script allow to upload files into Learning path
 * @package dokeos.learnpath
 * @author Yannick Warnier
 */
//flag to allow for anonymous user - needs to be set before global.inc.php
$use_anonymous = true;
$parentDir = time();

//$up_folder = "../upload/files/".$parentDir."/";

$course_dir = '../upload/scorm/' . $parentDir . "/";
if (!file_exists($course_dir))
    mkdir($course_dir);


$uncompress = 1;

//error_log('New LP - lp_upload.php',0);
/*
 * check the request method in place of a variable from POST
 * because if the file size exceed the maximum file upload
 * size set in php.ini, all variables from POST are cleared !
 */

if ($_SERVER['REQUEST_METHOD'] == 'POST' && count($_FILES) > 0 && !empty($_FILES['file']['name'])
) {

    // A file upload has been detected, now deal with the file...
    //directory creation

    require_once('learnpath.class.php');
    require_once('lib/database.lib.php');
    //require_once('function.php');
    require_once('../inc/mysql.php');
    require_once('../inc/function.php');
    require_once('../inc/unzip.class.php');
    require_once('../inc/lib/pclzip/pclzip.lib_original.php');

    $stopping_error = false;
    $time = date("Y-m-d H:i:s");

	$title = $_FILES['file']['name'];
	$srcfile  = $_FILES['file']['tmp_name'];
	$size = round($_FILES['file']['size']/1000);
	//get name of the zip file without the extension
	$extension = file_ext($title);
	$filename = date("YmdHis-").rand(1000,9999).".".$extension;
	$file_base_name = str_replace('.'.$extension,'',$filename);

    //$file_base_name = replace_dangerous_char(trim($file_base_name),'strict');
    //move_uploaded_file($srcfile,$course_dir.iconv("GBK","UTF-8",$s));
    move_uploaded_file($srcfile, $course_dir . $filename);
    //die("insert into attachment(title,size,type,path,time,unzip) values ('$title','$size','$extension','".$course_dir.$filename."','$time','1')");
    $mysql->query("insert into attachment(title,size,type,path,time,unzip) values ('$title','$size','$extension','" . $course_dir . $filename . "','$time','1')");
    $attachmentId = $mysql->insert_id();
    $unzip = new unzip();
    $unzip->extract_zip($course_dir . $filename, $course_dir . $file_base_name . "/");
    $type = learnpath::get_package_type($course_dir . $filename, $filename);
    switch ($type) {
        case 'scorm':

            require_once('scorm.class.php');
            //require_once api_get_path(LIBRARY_PATH).'searchengine.lib.php';
            $oScorm = new scorm();
            //$manifest = $oScorm->import_package($_FILES['file'],$current_dir);
            $manifest = $course_dir . $file_base_name . "/imsmanifest.xml";
            if (!empty($manifest)) {
                $oScorm->parse_manifest($manifest);
                $oScorm->import_manifest($parentDir);
            } else {
                //show error message stored in $oScrom->error_msg
                //logger("error: lp_upload->switch(scorm)->empty(manifest)");
                die("不是符合标准的scorm课程包。");
            }

            $proximity = '';
            if (!empty($_REQUEST['content_proximity'])) {
                $proximity = $mysql->escape_string($_REQUEST['content_proximity']);
            }
            $maker = '';
            if (!empty($_REQUEST['content_maker'])) {
                $maker = $mysql->escape_string($_REQUEST['content_maker']);
            }
            $oScorm->set_proximity($proximity);
            $oScorm->set_maker($maker);
            $oScorm->set_parentDir($parentDir . "/" . $file_base_name);
            $oScorm->set_jslib('scorm_api.php');
            /* if (api_get_setting('search_enabled') === 'true' && extension_loaded('xapian')) {
              $searchkey = new SearchEngineManager();
              $searchkey->course_code = api_get_course_id();
              $searchkey->idobj = $oScorm->get_id();
              $searchkey->value = $_REQUEST['terms'];
              $searchkey->tool_id = TOOL_LEARNPATH;

              $learn = new learnpath(api_get_course_id(), $oScorm->get_id(), api_get_user_id());
              $learn->search_engine_save();

              } */

            break;
        case 'aicc':
            require_once('aicc.class.php');
            $oAICC = new aicc();
            $config_dir = $oAICC->import_package($_FILES['file']);
            if (!empty($config_dir)) {
                $oAICC->parse_config_files($config_dir);
                $oAICC->import_aicc(api_get_course_id());
            }
            $proximity = '';
            if (!empty($_REQUEST['content_proximity'])) {
                $proximity = $mysql->escape_string($_REQUEST['content_proximity']);
            }
            $maker = '';
            if (!empty($_REQUEST['content_maker'])) {
                $maker = $mysql->escape_string($_REQUEST['content_maker']);
            }
            $oAICC->set_proximity($proximity);
            $oAICC->set_maker($maker);
            $oAICC->set_jslib('aicc_api.php');
            break;
        case 'oogie':
            require_once('openoffice_presentation.class.php');
            //$take_slide_name = empty($_POST['take_slide_name']) ? false : true;
            $take_slide_name = true;
            $o_ppt = new OpenofficePresentation($take_slide_name);
            $first_item_id = $o_ppt->convert_document($_FILES['file']);
            break;
        case 'woogie':
            require_once('openoffice_text.class.php');
            $split_steps = $_POST['split_steps'];
            $o_doc = new OpenofficeText($split_steps);
            $first_item_id = $o_doc->convert_document($_FILES['file']);
            break;
        case '':
        default:
            die("未知的课程包类型，请检查scorm课程压缩包是否正确。");
            //return "lp_upload.php error";
    }
} // end if is_uploaded_file

header('location:courseUnitShow.php?id=' . $courseunitId);
?>
