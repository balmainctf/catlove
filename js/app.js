'use strict';

var app = angular.module('demoShow',['ui.router','myControllerModule','myServiceModule','myFilterModule']);

app.run(function($rootScope,$state){
	$rootScope.mobileName = '';
	$rootScope.orderName = 'id';
	$rootScope.orderbylist = 'false';

});

//ui.router路由配置
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	//默认路由
	$urlRouterProvider.otherwise('/list');

	$stateProvider.state('list', {
	    url: '/list',
	    controller: 'listController',
	    templateUrl: 'templates/list.html'
    }).state('show', {
	    url: '/show/:id',
	    templateUrl: 'templates/show.html',
	    controller: 'showController'
    });

}]);