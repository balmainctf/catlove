<?php
/**
 *
 * @file      
 * @author    soraping(soraping@163.com)
 * @date      
 * @version   
 * 
 */
//获取POST数据
$arr = file_get_contents('php://input',true);
//获取的是json字符串
//var_dump($arr);

//转换成数组
$deArr = json_decode($arr,true);

//var_dump($deArr);

$list = array(
		array('pid'=>0,'id'=>0,'name'=>'iphone5','price'=>'4000','imgurl'=>'http://localhost:8080/test/images/iphone5.jpg'),
		array('pid'=>0,'id'=>1,'name'=>'iphone5s','price'=>'5000','imgurl'=>'http://localhost:8080/test/images/iphone5s.jpg'),
		array('pid'=>0,'id'=>2,'name'=>'iphone6','price'=>'6000','imgurl'=>'http://localhost:8080/test/images/iphone6.jpg'),
		array('pid'=>1,'id'=>3,'name'=>'sanxin5','price'=>'1000','imgurl'=>'http://localhost:8080/test/images/sanxin5.jpg'),
		array('pid'=>1,'id'=>4,'name'=>'sanxin5s','price'=>'2000','imgurl'=>'http://localhost:8080/test/images/sanxin5s.jpg'),
		array('pid'=>1,'id'=>5,'name'=>'sanxin6','price'=>'3000','imgurl'=>'http://localhost:8080/test/images/sanxin6.jpg'),	
		array('pid'=>1,'id'=>6,'name'=>'sanxin7','price'=>'3000','imgurl'=>'http://localhost:8080/test/images/sanxin7.jpg')
);

$result =array();

if(!isset($deArr['id'])){
	$result = array(
		'result'=>$list

	);
}else{
	$result = array(
		'result'=>$list[$deArr['id']]
	);
}

echo json_encode($result);