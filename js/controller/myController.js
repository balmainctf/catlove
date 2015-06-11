'use strict';

var myControllerModule = angular.module('myControllerModule',['myFilterModule']);

myControllerModule.controller('listController',function($scope,getListFactory,$rootScope){

	//判断$rootScope.mobiles里是否有数据
	if(angular.isUndefined($rootScope.mobiles)){

		//不存在全局变量则请求服务器
		var data = {'chose':'all'};

		//控制器获取服务请求的数据
		var result = getListFactory.query('contro/list.php',data);		

		//第一种请求方式
		//调用承诺API获取数据 .resolve 
		// result.then(function(e){
		// 	//console.log(e);
		// 	$scope.mobiles = e.result;

		// 	//保存数据(不推荐)
		// 	$rootScope.mobiles = e.result;
		// });

		//第二种请求方式，获取service返回的$http对象,接收了这个对象后就可以在控制器里写回调函数了
		result.success(function(e){
			$scope.mobiles = e.result;
			$rootScope.mobiles = e.result;
		}).error(function(e){});


	}else{
		//存在则直接赋值
		$scope.mobiles = $rootScope.mobiles;

	}



	
});

myControllerModule.controller('showController', ['$scope', '$state','$stateParams','getListFactory','$rootScope','$filter',function($scope,$state,$stateParams,getListFactory,$rootScope,$filter){
	//获取路由上的id
	//console.log($stateParams.id);
	var data = {id:$stateParams.id};


	//从服务器端获取数据
	// var result = getListFactory.query('contro/list.php',data);
	// //调用承诺API获取数据 .resolve 
	// result.then(function(e){
	// 	//console.log(e);
	// 	$scope.mobile = e.result;
	// });
	
	//console.log($rootScope.mobiles);

	//第二种方法从$rootscope全局里读取数据中筛选数据
	//过滤器第二个参数放在后面挂号里
	$scope.mobile = $filter('selectJson')($rootScope.mobiles,data);

	//$rootScope.mobiles = null;

	//返回列表页
	$scope.goBack = function(){
		$state.go('list');
	}

}]);