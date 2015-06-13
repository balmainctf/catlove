'use strict';

var app = angular.module('demoShow',['ionic','myControllerModule','myServiceModule','myFilterModule','ngAnimate','ngCookies']);

app.run(function($rootScope,$state,$ionicPlatform){
	  
	  //ionic配置
	  $ionicPlatform.ready(function() {

		    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		    }
		    if (window.StatusBar) {

		      StatusBar.styleLightContent();
		    }
	  });

});

//ui.router路由配置
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	//默认路由
	// $urlRouterProvider.otherwise('/tab/main');

	// $stateProvider.state('tab',{
 //    	url: '/tab',
 //    	abstract: true,
 //    	templateUrl: "templates/tabs.html"
 //    }).state('tab.main',{
 //    	url: '/main',
 //    	views: {
	// 	      'tab-main': {
	// 	        templateUrl: 'templates/main.html',
	// 	        controller: 'mainController'
	// 	      }
 //    	}
 //    }).state('tab.list',{
 //    	url: '/list',
 //    	views: {
	// 	      'tab-list': {
	// 	        templateUrl: 'templates/list.html',
	// 	        controller: 'listController'
	// 	      }
 //    	}
 //    }).state('tab.test',{
 //    	url: '/test',
 //    	views: {
	// 	      'tab-test': {
	// 	        templateUrl: 'templates/test.html',
	// 	        controller: 'testController'
	// 	      }
 //    	}
 //    }).state('show',{
 //    	url: '/show:id',
 //        templateUrl: 'templates/show.html',
 //        controller: 'showController'
    	
 //    });



	$urlRouterProvider.otherwise('/menu/tab/main');

	$stateProvider.state('menu',{
    	url: '/menu',
    	abstract: true,
    	templateUrl: "templates/menu.html",
    	controller:'menuController'
    }).state('menu.tab',{
    	url: '/tab',
    	views: {
		      'menuContent': {
		        templateUrl: 'templates/tabs.html',
		        controller: 'mainController'
		      }
    	}
    }).state('menu.tab.main',{
    	url: '/main',
    	views: {
		      'tab-main': {
		        templateUrl: 'templates/main.html',
		        controller: 'mainController'
		      }
    	}
    }).state('menu.tab.list',{
    	url: '/list',
    	views: {
		      'tab-list': {
		        templateUrl: 'templates/list.html',
		        controller: 'listController'
		      }
    	}
    }).state('menu.tab.test',{
    	url: '/test',
    	views: {
		      'tab-test': {
		        templateUrl: 'templates/test.html',
		        controller: 'testController'
		      }
    	}
    }).state('show',{
    	url: '/show:id',
        templateUrl: 'templates/show.html',
        controller: 'showController'
    	
    });



}]);

