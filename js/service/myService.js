'use strict';

var myServiceModule = angular.module('myServiceModule',[]);

myServiceModule.factory('getListFactory', ['$http','$q',function($http,$q){
	var service = {
		query : function(url,d){
			// 第一种方法: 声明延后执行，表示要去监控后面的执行
			// var deferred = $q.defer();
			// $http({
			// 	method:"post",
			// 	data:d,
			// 	url:url,
			// 	cache:false,
			// 	timeout:10000,
			// 	headers: {
			// 		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			// 	}
			// }).success(function(e){
			// 	// 声明执行成功，即http请求数据成功，可以返回数据了
			// 	deferred.resolve(e);
			// }).error(function(e){
			// 	//console.log(e);
			// });
			// // 返回承诺，这里并不是最终数据，而是访问最终数据的API
			// return deferred.promise;

			//第二种方法:return $http

			return $http({
				method:"post",
				data:d,
				url:url,
				cache:false,
				timeout:10000,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
				}				
			});
		}
	};
	return service;
}]);