<?php
/**
 * Created by PhpStorm.
 * User: wuwu
 * Date: 2015/6/24
 * Time: 0:55
 */
include "../inc/mysql.php";
include "../inc/function.php";


@$catid =$_POST["catid"] ;

if ($catid == "undefined") {
    die("课程根目录不支持添加课程单元，请创建子目录。");
}

$res = $mysql->query("select * from courseversion_rel_courseunitversion where coursecategoryid=".$catid);
$arr = $mysql->fetch_array($res);

$courseUnitIds = $arr["courseunitids"];
$courseUnitVersionIds = $arr["courseunitversionids"];
$courseUnitGroupIds = $arr["courseunitgroupids"];
$arrjson=json_encode($arr,JSON_UNESCAPED_UNICODE);



echo "<div class=\"info\">课程单元列表 &nbsp; <a href=\"javascript:;\" onclick=\"setIframeSrc(13);\"><img src=\"../img/add.jpg\" width=\"15\" title=\"添加课程单元\" alt=\"添加课程单元\"></a></div>
                            <div class=\"list_courseUnit\">
                                <ul>";


                        $ids = substr($courseUnitVersionIds,1,-1);
                        //die("select * from courseunit where deleted=0 and id in ($ids) order by time desc");
                        $res = $mysql->query("select * from courseunitversion_rel_attachment where deleted=0 and id in ($ids) order by time desc");
                        //$courseunitArr = Array();
                    while($arr = $mysql->fetch_array($res)){

                        $courseunitinfo = getCourseUnitinfoById($arr["courseunitid"]);//通过版本获取课程单元的信息
                        echo "<li><span><a href='javascript:;' onclick='if(confirm(\"确定要移除吗？\")){f_remove(341,".$arr["id"].",$catid);$(this).parent().parent().remove();}'><img src='../img/delete.png'></a></span><a href='courseUnitShow.php?id=".$courseunitinfo["id"]."'>".$courseunitinfo["title"]."(".$arr["versionname"].")"."</a></li>";
                    }


echo "</ul>";

/**
</div>

<div class="info">课程单元组列表</div>
<div class="list_courseUnit">
    <ul>
        <?php

        $res = $mysql->query("select * from courseversion_rel_courseunitversion where courseid=".$catid);
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
 ******/

 ?>