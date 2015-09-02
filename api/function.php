<?php

function make8(){
	//字母加数字
	$chars = 'abcdefghjkmnopqrstuvwxyz0123456789ABCDEFGHJKMNOPQRSTUVWXYZ';
	$string = "";
	for ($i = 0; $i < 8; $i++) {
		$str_tmp = $chars{mt_rand(0,strlen($chars)-1)};
		$string .= $str_tmp;
	}
	return $string;
}


function _encode($arr)
{
  $na = array();
  foreach ( $arr as $k => $value ) {  
    $na[_urlencode($k)] = _urlencode ($value);  
  }
  return addcslashes(urldecode(json_encode($na)),"\\r\\n");
}

function _urlencode($elem)
{
  if(is_array($elem)){
    foreach($elem as $k=>$v){
      $na[_urlencode($k)] = _urlencode($v);
    }
    return $na;
  }
  return urlencode($elem);
}
function GetIP(){
	if(!empty($_SERVER["HTTP_CLIENT_IP"])){
	  $cip = $_SERVER["HTTP_CLIENT_IP"];
	}
	elseif(!empty($_SERVER["HTTP_X_FORWARDED_FOR"])){
	  $cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
	}
	elseif(!empty($_SERVER["REMOTE_ADDR"])){
	  $cip = $_SERVER["REMOTE_ADDR"];
	}
	else{
	  $cip = "无法获取！";
	}
	return $cip;
}
?>