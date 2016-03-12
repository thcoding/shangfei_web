<?php
namespace Home\Model;
use Think\Model;
class TMSUserModel extends Model {
    protected $tableName ='registeruser';
    protected $_validate= array(array('userId','require','注册id必填'),array('userName','require','人员姓名必填'),array('customerName','require','所属客户名称必填'),array('CERNO','require','证件号必填'));
    //protected $_auto=array();

}