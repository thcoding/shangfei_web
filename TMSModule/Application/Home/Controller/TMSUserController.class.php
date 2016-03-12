<?php
namespace Home\Controller;
use Think\Controller\RestController;

class TMSUserController extends RestController{
    protected $allowMethod    = array('get','post','put'); // REST允许的请求类型列表
    protected $allowType      = array('html','xml','json'); // REST允许请求的资源类型列表
    /*/api/administration/Users*/
    /*public function insert_post_json(){
        $TMSUser= D("TMSUser");
        if(!IS_POST){
            $data['userId']=I('post.CRMPERSONID');
            $data['userName']=I('post.CRMPERSONNAME');
            $data['customerName']=I('post.CRMCUSTOMERNAME');
            $data['CERNO']=I('post.CERTNO');
            if($TMSUser->create()){
                $result=$TMSUser->add($data);
                if($result){
                    $this->success("用户注册成功!",'/TMSModule');
                    echo "{'id',$result}";
                }else{
                    $this->error("数据添加错误!");
                    echo '数据添加错误!';
                }
            }else{
                $this->error($TMSUser->getError());
                echo $TMSUser->getError();
            }
        }else{
            $this->error('没有发送post','/TMSModule');
        }
        $this->response($data,'json');
    }*/
    public function insert(){
        $TMSUser= D("TMSUser");
        if(IS_POST){
            $data['userId']=I('post.CRMPERSONID');
            $data['userName']=I('post.CRMPERSONNAME');
            $data['customerName']=I('post.CRMCUSTOMERNAME');
            $data['CERNO']=I('post.CERTNO');
            if($TMSUser->create()){
                $result=$TMSUser->add($data);
                if($result){
                    $this->success("用户注册成功!",'/TMSModule');
                    echo "{'id',$result}";
                }else{
                    $this->error("数据添加错误!");
                    echo '数据添加错误!';
                }
            }else{
                $this->error($TMSUser->getError());
                    echo $TMSUser->getError();
            }
        }else{
            $this->error('没有发送post','/TMSModule');
        }
    }
}