'use strict';

var myControllerModule = angular.module('myControllerModule',['ionic','myFilterModule']);


myControllerModule.controller('menuController', ['$scope', function($scope){
	
}])

myControllerModule.controller('mainController',function($scope,$state){
	//点击进入项目页
	$scope.goListPage = function(){
		$state.go('tab.list');
	}
});


myControllerModule.controller('testController', ['$scope','getListFactory','myPopup', function($scope,getListFactory,myPopup){
	
	$scope.user = {};
	//登录验证
	$scope.submitLogin = function(){
		var data = {
			username : $scope.user.name,
			password : $scope.user.pwd
		};

		var url = 'http://localhost:8080/http/login.php?username='+$scope.user.name+'&password='+$scope.user.pwd+'&callback=JSON_CALLBACK';

		var result = getListFactory.query(url);

		result.then(function(e){
			console.log(e);
			var result = e.result;
			if(result.key == 10010){
				var opt = {
					title : '错误提示信息',
					template : result.errorMsg,					
				};
				myPopup.puAlert(opt);
			}
			//$scope.mobiles = e.result;
		});

	}

	

	


}])

myControllerModule.controller('listController',function($scope,getListFactory,$rootScope,myPopup,$timeout,$filter){

	  $scope.mname = '';
	  $scope.orderName = 'id';
	  $scope.orderbylist = 'false';
	  $scope.listTitle = '列表页面';

	  $scope.shouldShowDelete = false;
	  $scope.shouldShowReorder = false;

	  $scope.select = [
	  		{name:'iphone',pid:'0'},
	  		{name:'sanxin',pid:'1'}
	  ];

	  $scope.mobile = {};

	  $scope.opt = {
	  	  searchName : '',
	  	  mobileName : ''
	  };

	  //切换select选项时
	  $scope.nameChange = function(){
	  	 $scope.opt.mobileName = $scope.mobile.name.pid;
	  	 getHttp();
	  }

	  //搜索框
	  $scope.searchChange = function(){
	  	  //console.log($scope.mobile.search);
	  	  $scope.opt.searchName = $scope.mobile.search;
	  	  getHttp();
	  }

	  var getHttp = function(){
	  	  	var host = 'http://localhost:8080/http/list.php';

	  	  	var opt = $scope.opt;
			var arr = [];
			for(var i in opt){
				if(opt[i]!==''){
					var p = i + '=' + opt[i];
					arr.push(p);
				}					
			}
		    var parm = arr.join('&');
		    if(parm !== null){
		    	parm += '&';
		    }

	  	  var url = host + '?' + parm + 'arch=a&callback=JSON_CALLBACK';

	  	  console.log(url);

		  var result = getListFactory.query(url);

		  //第一种请求方式
		  //调用承诺API获取数据 .resolve 
		  result.then(function(e){
			//console.log(e);
			$scope.mobiles = e.result;
		  });		  		
	  }

	  getHttp();


	  //列表删除
	  $scope.myDelete = function(id){
	  		var opt = {
				title : '来自星星的消息',
				template : '确定要删除id为 '+id+' 的栏目吗'
	  		};
	  		//console.log(myPopup.puConfirm(opt));
	  		myPopup.puConfirm(opt).then(function(res){
	  			if(res){
	  				myPopup.puAlert({template : '删除了id为 '+id+' 的栏目'});

	  				var newList = $filter('deleteId')($scope.mobiles,id);

	  				//$scope.mobiles = newList;
	  			}
	  		});
	  		
	  }

	  $scope.doRefresh = function(){

	  	  //生成随机数
	  	  var id = Math.ceil(Math.random() * 6);

	  	  console.log('下拉刷新');
		  $timeout( function() {  
		  	  //请求服务器
		  	  var result = getListFactory.query('http://localhost:8080/http/list.php?arch=b&id='+id+'&callback=JSON_CALLBACK');
		  	  result.then(function(e){
					$scope.mobiles.unshift(e.result);
			  });
		      //在数据更新完成后要$broadcast广播一个scroll.refreshComplete的事件，这个事件是让ion-refresher知道刷新已经完成，可以隐藏自己了
		      $scope.$broadcast('scroll.refreshComplete');
		      
	    }, 1000);  
	  }

	  //是否请求到数据标识
	  $scope.isLoadMore = true;

	  $scope.moreDataCanBeLoaded = function(){
	  	 //如果后端数据返回为空，则将ng-if设置为false
	  	 return $scope.isLoadMore;
	  }

	  $scope.loadMore = function(){
	  	 console.log('上拉刷新');
	  	 var id = Math.ceil(Math.random() * 6);
		 $timeout(function() {
		 	//如果没有数据，就直接返回
		 	if(!$scope.isLoadMore){
		 		$scope.$broadcast('scroll.infiniteScrollComplete');
		 		return;
		 	}
		  	var result = getListFactory.query('http://localhost:8080/http/list.php?arch=c&id='+id+'&callback=JSON_CALLBACK');
		  	result.then(function(e){
		  		//console.log(e);
		  		$scope.isLoadMore = e.isLoadMore;
		  		if(e.isLoadMore){
		  			$scope.mobiles.unshift(e.result);
		  		}else{
		  			console.log(e.errorMsg);
		  		}
			});	
			$scope.$broadcast('scroll.infiniteScrollComplete');
 		 },1000);

	  }

	  // $scope.$on('$stateChangeSuccess',function(){
	  // 		$scope.loadMore();
	  // });


	  //控制器获取服务请求的数据
	 //  var result = getListFactory.query('http://localhost:8080/http/list.php?arch=a&callback=JSON_CALLBACK');

	 //  //第一种请求方式
	 //  //调用承诺API获取数据 .resolve 
	 //  result.then(function(e){
		// //console.log(e);
		// $scope.mobiles = e.result;
	 //  });

	  //第二种请求方式，获取service返回的$http对象,接收了这个对象后就可以在控制器里写回调函数了
	  // result.success(function(e){

	  // 	$scope.mobiles = e.result;

	  // 	$rootScope.mobiles = e.result;
	  // }).error(function(e){});
	  




	
});

myControllerModule.controller('showController', ['$scope', '$state','$stateParams','getListFactory','$rootScope','$filter',function($scope,$state,$stateParams,getListFactory,$rootScope,$filter){
	//获取路由上的id
	//console.log($stateParams.id);
	var id = $stateParams.id;

	//从服务器端获取数据
	var result = getListFactory.query('http://localhost:8080/http/list.php?arch=b&id='+id+'&callback=JSON_CALLBACK');

	result.then(function(e){
		$scope.mobile = e.result;
	});

	//返回列表页
	$scope.goBack = function(){
		$state.go('tab.list');
	}

}]);