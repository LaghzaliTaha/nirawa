angular.module('animateApp',['ui.router','Routes','controllers','Services'])

.controller('mainController',['$scope','$window','$location',function($scope,$window,$location){
	if($window.sessionStorage.token === undefined){
			$scope.signin=1 ;
	}else{
		  $location.path('/');
	}

}]) ;

