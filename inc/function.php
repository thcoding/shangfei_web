<?php
//error_log(date("[Y-m-d H:i:s]").$returntype."\n", 3, "../php_err.log");//日志信息方法
function logger($content, $filepath = 'log.html') {
	file_put_contents("../" . $filepath,  date("Y-m-d H:i:s", time()). "\t" .$content  . "\r\n<br>", FILE_APPEND);
}
function getLpInfoByLpid($id){//����id��ȡscorm����Ϣ
	global $mysql;
	$res = $mysql->query("select * from lp where id=".$id);
	$arr = $mysql->fetch_array($res);
	return $arr;
}
function getUserinfoById($id){//����id��ȡ�û���Ϣ
	global $mysql;
	$res = $mysql->query("select * from user where id=".$id);
	$arr = $mysql->fetch_array($res);
	return $arr;
}
function getAttachmentinfoById($id){//����id��ȡ�γ̵�Ԫ������Ϣ
	global $mysql;
	$res = $mysql->query("select * from attachment where id=".$id);
	$arr = $mysql->fetch_array($res);
	return $arr;
}
function getCourseinfoById($id){//����id��ȡ�γ���Ϣ
	global $mysql;
	$res = $mysql->query("select * from course where id=".$id);
	$arr = $mysql->fetch_array($res);
	return $arr;
}
function getCourseUnitinfoById($id){//����id��ȡ�γ̵�Ԫ��Ϣ
	global $mysql;
	$res = $mysql->query("select * from courseunit where id=".$id);
	$arr = $mysql->fetch_array($res);
	return $arr;
}
function getLastestCourseUnitVersionidBycuid($id){  //cuid->courseunitId  ����id��ȡ�γ̵�Ԫ���һ���汾��Ϣ
	global $mysql;
	$res = $mysql->query("select id from courseunitversion_rel_attachment where courseunitid=".$id." and deleted=0 order by id desc limit 1");
	$arr = $mysql->fetch_array($res);
	return $arr["id"];
}
function getLastestCourseUnitAttachmentidBycuid($id){  //cuid->courseunitId  ����id��ȡ�γ̵�Ԫ���һ��������Ϣ
	global $mysql;
	$res = $mysql->query("select attachmentid from courseunitversion_rel_attachment where courseunitid=".$id." and deleted=0 order by id desc limit 1");
	$arr = $mysql->fetch_array($res);
	return $arr["attachmentid"];
}
function getSiteStatistics(){//��ȡ��ǰ���ÿγ̵�Ԫ���γ̡��û�����
	global $mysql;
	$res = $mysql->query("select count(*) as s from courseunit where deleted=0");
	$arr = $mysql->fetch_array($res);
	$info["courseunit"] = $arr["s"];

	$res = $mysql->query("select count(*) as s from course where deleted=0");
	$arr = $mysql->fetch_array($res);
	$info["course"] = $arr["s"];

	$res = $mysql->query("select count(*) as s from user where deleted=0");
	$arr = $mysql->fetch_array($res);
	$info["user"] = $arr["s"];

	return $info;
}
function getStuStatistics($userid){
    global $mysql;
    $res = $mysql->query("select courseids as s from user_rel_course where userid=".$userid);
    $arr = $mysql->fetch_array($res);
    $info["course"] = $arr["s"];
    $num=explode(",",$arr["s"]);
    return count($num)-2;
}
function isutf8($data){//����ַ��ı���
	return mb_detect_encoding($data, array('UTF-8', 'GB2312'));
}

function getImgWH($img,$width=580,$height=800){  //$width �����   $height ���߶�
	$return = Array();
	$dims = getimagesize($img);
	if($dims[0] > $width || $dims[1] > $height){
		if($width/$dims[0] > $height/$dims[1]){
			$return[0] = round($dims[0] * ($height/$dims[1]));
			$return[1] = $height;
		}else{
			$return[0] = $width;
			$return[1] = round($dims[1] * ($width/$dims[0]));
		}
	}else{
		$return[0] = $dims[0];
		$return[1] = $dims[1];
	}
	return $return;
}

function file_ext($filename) {
	return strtolower(trim(substr(strrchr($filename, '.'), 1)));
}

function dir_path($dirpath) {//��Ŀ¼��Ϣת��Ϊͳһ�Ľṹ
	$dirpath = str_replace('\\', '/', $dirpath);
	$dirpath = str_replace('//', '/', $dirpath);
	if(substr($dirpath, -1) != '/') $dirpath = $dirpath.'/';
	return $dirpath;
}
function dir_delete($dir) {//ɾ������Ŀ¼,�谤��ɾ��Ŀ¼�µ�Ŀ¼���ļ�
	$dir = dir_path($dir);
	if(!is_dir($dir)) return false;
	$list = glob($dir.'*');//Ѱ����*ģʽƥ��������ļ�·��
	if($list) {
		foreach($list as $v) {
			is_dir($v) ? dir_delete($v) : @unlink($v);//ɾ�����ļ�
		}
	}
    return @rmdir($dir);
}

function is_empty_dir($dir){//�ж�Ŀ¼�Ƿ�Ϊ��
	if(!is_dir($dir))return true;   //�����ڣ����ǿյ�
	$handle = opendir($dir);  
	while (($file = readdir($handle)) !== false){  
		if ($file != "." && $file != ".."){  
			closedir($handle);  
			return false;  
		}  
	}  
	closedir($handle);  
	return true;  
}

function dir_list($dir, $ds = array(), $fs = array()) {
	@$files = glob(iconv("utf-8","gb2312",$dir).'/*');
	if(!is_array($files)) return $ds;
	foreach($files as $file) {		
		if(is_dir($file)){
			$ds[] = ($file);
		}else{
			$fs[] = ($file);
		}
	}
	return array_merge($ds,$fs);
}
function addS($str){//Ϊ�ַ���ĩβ���һ���ַ�
	return $str."s";
}
function delS($str){//Ϊ�ַ������ٿ�ͷ��һ���ַ�
	return substr($str,0,-1);
}
function delArrayStr($arr,$str){//ɾ��arr�����е�str�ַ���
	$temp = Array();
	foreach($arr as $v){
		if($v != $str){
			$temp[] = $v;
		}
	}
	return $temp;
}
function first2upper($str){//���ַ�������ĸ��Ϊ��д
	return strtoupper(substr($str,0,1)).substr($str,1);
}
function api_get_user_id(){//��ȡ��ǰsession���û�id
	return $_SESSION["userid"];
}

?>