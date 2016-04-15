<?php

class mysql{
	
	function mysql($database){
	
		$m_host = "127.0.0.1:3306";
		$m_name = "root";
		$m_pass = "root";

        /*$m_name = "root";
        $m_pass = "welcome";*/

		$link   =   $this -> linkdatabase($m_host,$m_name,$m_pass);
		$this   ->    selectdatabase($database,$link);
		$this   ->    query("set names utf8");
	
	}

	function linkdatabase($m_host,$m_name,$m_pass){
	
		$link   =   @mysql_connect($m_host,$m_name,$m_pass) or die("服务器连接失败".mysql_error());

		return $link;
	
	}

	function selectdatabase($database,$link){
	
		@mysql_select_db($database,$link) or die("数据库选择失败".mysql_error());
	
	}

	function query($sql){
	
		return @mysql_query($sql);
		
	}

	function num_rows($result){
	
		return @mysql_num_rows($result);
	
	}
/**
*获取当前行数据,返回关联数组
*/

	function fetch_array($result){
	
		return @mysql_fetch_array($result,MYSQL_ASSOC);
	
	}

	function insert_id(){
	
		return @mysql_insert_id();
	
	}

	function affected_rows($result) {

		return @mysql_affected_rows($result);

	}

	function escape_string($string) {
		return get_magic_quotes_gpc() ? mysql_real_escape_string(stripslashes($string)) : mysql_real_escape_string($string);
	}

}

$mysql = new mysql("shangfei");
date_default_timezone_set("PRC");

?>