
<?php
/**
 * Created by PhpStorm.
 * User: wuwu
 * Date: 2015/9/6
 * Time: 23:09
 */
function Str_RemoveRepeatItem($str){//带，的字符串除掉重复项
    $arr=explode(",",$str);
    $list=array_merge(array_unique($arr));//array_unique索引号不变
    /*$list=array();
    foreach($arr as $item){
        $flag=false;
        foreach($list as $item2){
            if($item==$item2){
                $flag=true;
                break;
            }
        }
        if($flag==true){
            continue;
        }else{
            array_push($list,$item);
        }
    }*/
    $str=",";
    for($i=0;$i<count($list);$i++){
        if($list[$i]!="") {
            $str = $str . $list[$i] . ",";
        }
    }
    return $str;
}
echo Str_RemoveRepeatItem(",");