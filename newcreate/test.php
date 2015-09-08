<?php
/**
 * Created by PhpStorm.
 * User: wuwu
 * Date: 2015/9/6
 * Time: 23:09
 */
$res=mysql_query("select * from where userid=".$user);
if(!mysql_num_rows($res)) {
    echo "record doesn't exist~~~~~!!!!!!";
}else{
    // echo mysql_num_rows($result)."\n";
    echo $row['userid'];
    echo $row['task'];
}