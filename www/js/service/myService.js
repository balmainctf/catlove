'use strict';

var myServiceModule = angular.module('myServiceModule',['ionic',]);


myServiceModule.factory('myPopup', ["$ionicPopup",'$timeout', function($ionicPopup,$timeout,$rootScope){
	
	var service = {
		//总方法
		init : function(opt){

		},
		//模拟alert,默认3秒内消失
		puAlert : function(opt){
			var _opt = {
				title : '来自星星的消息',
				template : '什么样的节奏最啊最摇摆',
			};
			if(opt){
				//继承
				_opt = angular.extend(_opt,opt);
			}
			var myAlert = $ionicPopup.alert(_opt);
			myAlert.then(function(res) {
			     console.log('你点击了确定');
			});
			//是否启用定时
			if(opt.isTimeOut){
				//验证是否为数字
				var time = 3;
				//演示3秒后自动推出
				$timeout(function() {
				     myAlert.close();
				}, (opt.time || time) * 1000);
			}

		},

		puConfirm : function(opt){
			var _opt = {
				title : '来自星星的消息',
				template : '什么样的节奏最啊最摇摆',
			};			
			if(opt){
				//继承
				_opt = angular.extend(_opt,opt);
			}
			var myAlert = $ionicPopup.confirm(_opt);
			return myAlert;
			/*myAlert.then(function(res) {
			     if(res){
			     	console.log('你点击了确定');
			     }else{
			     	console.log('你点击了否定');
			     }
			});*/		
		},

		puShow : function(opt){
			var _opt = {
				  title: '来自地球的消息', // String. The title of the popup.
				  subTitle: '什么意思', // String (optional). The sub-title of the popup.
				  template: '<input type="password" ng-model="data.wifi">', // String (optional). The html template to place in the popup body.
				  templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
				  scope: $scope, // Scope (optional). A scope to link to the popup content.
				  buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
				    text: 'Cancel',
				    type: 'button-default', 
				  }, {
				    text: 'OK',
				    type: 'button-positive',
				    onTap: function(e) {
			          if (!$scope.data.wifi) {
			            	e.preventDefault();
			          } else {
			            	console.log($scope.data.wifi);	
			          }
				    }
				  }]
			};
			if(opt){
				//继承
				_opt = angular.extend(_opt,opt);
			}
			var myShow = $ionicPopup.show(opt);
		}
	};

	return service;

}]);

myServiceModule.factory('getListFactory', ['$http','$q',function($http,$q){
	var service = {
		query : function(url,d){
			// 第一种方法: 声明延后执行，表示要去监控后面的执行
			var deferred = $q.defer();
			$http({
				method:"jsonp",
				data:d,
				url:url,
				cache:false,
				timeout:10000,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
				}
			}).success(function(e,status){
				// 声明执行成功，即http请求数据成功，可以返回数据了
				deferred.resolve(e);
			}).error(function(e,status){
				if(status == 404){
					var d = {errorMsg:'服务器连接超时',isLoadMore:false};
					deferred.resolve(d);
				}
			});
			// 返回承诺，这里并不是最终数据，而是访问最终数据的API
			return deferred.promise;

			//第二种方法:return $http这个对象,在控制层调用回调函数

			//return $http.jsonp(url);
		}
	};
	return service;
}]);