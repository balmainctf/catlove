'use strict';

var myFilterModule = angular.module('myFilterModule',[]);

myFilterModule.filter('cnSelect',function(){

	//也可以用ng-switch来实现
	return function(input){
		var selectName = '';
		var selcetPid = '';
		switch(input){
			case '':
				selectName = '全部';
				break;
			case '0':
				selectName = '苹果';
				break;
			case '1':
				selectName = '三星';
				break;							
		}
		return selectName;
	}

});

myFilterModule.filter('selectJson',function(){
	return function(input,obj){
		for (var i = 0,len = input.length; i < len; i++) {
			var q = input[i];
			if(q.id == obj.id) return q;
		}
	}
});