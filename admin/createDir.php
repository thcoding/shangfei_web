<?php
$dir = $_POST["dir"];
$dirname = $_POST["dirname"];

//file_put_contents("aaa",$dir.$dirname);

mkdir(iconv("utf-8","gb2312",$dir."/".$dirname));

?>