<?php
return array(
	//'配置项'=>'配置值'
    //数据库配置文件
    'DB_TYPE' => 'mysql',
    'DB_HOST' => 'localhost',
    'DB_NAME' => 'shangfei',
    'DB_USER' => 'root',
    'DB_PWD'  => 'root',
    'DB_PORT'=> '3306',
    'DB_PREFIX'=>'TMS_',
    // 开启路由
    'URL_CASE_INSENSITIVE' => true,
    'URL_ROUTER_ON'   => true,
    'URL_PATHINFO_DEPR' => '/',
    'URL_MODEL' => 2,
    'URL_ROUTE_RULES' => array( //定义路由规则
        'news/:year/:month/:day' => array('News/archive', 'status=1'),
        'news/:id'               => 'News/read',
        'news/read/:id'          => '/news/:1',
    ),
);