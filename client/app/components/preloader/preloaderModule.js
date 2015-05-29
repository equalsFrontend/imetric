/*jshint -W099*/
/**
 * Preloader Module
 * @module /components/preloader/
 */

(function(){

	"use strict";
	
	var preloaderModule = angular.module('iMetric.components.preloader', [
	    'iMetric.components.preloader.directives',
	    'iMetric.components.preloader.services'
	])
	
	.controller("PreloaderController", ["$scope", 
	                                    "$rootScope", 
	                                    "PreloaderService",
	                                    "$state",
	                                    function($scope, 
	                                    		 $rootScope,
	                                    		 PreloaderService,
	                                    		 $state){
		
		$scope.greeting = "Preloader Module";
		
		$('body').addClass('loading');
		
		PreloaderService.start().then(function(data) {
			
			console.log("preloader complete, received this data: ");
			
			console.log(data);
			
			$scope.data = data;
			
			setTimeout(function(){
				$state.go('dashboard.notifications');
			}, 2000);
			
		}); 
		
	}]);
	
})();