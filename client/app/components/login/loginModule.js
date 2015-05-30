/*jshint -W099*/
/**
 * Login Module
 * @module /components/login/
 * @namespace LoginControllers
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var loginModule = angular.module('iMetric.components.login', [
	    'iMetric.components.login.directives',
	    'iMetric.components.login.services'
	])
	
	
	.controller("LoginControllers", ["$scope", 
	                                "$rootScope", 
	                                "LoginService",
	                                "$state",
	                                function($scope, 
	                                		 $rootScope,
	                                		 LoginService,
	                                    	 $state){

		
		$scope.loggedIn = 0;
		
		/**
         * @function LoginControllers.authDataCallback 
         * @memberof LoginControllerss
         * @param {object} authData - Data returned by the login
         * @author Alex Boisselle
         * @description authentication callback fired once LoginService.login has returned the promise
         */
		$scope.authDataCallback = function(authData) {
			if (authData) {
				
				$scope.loggedIn = 1;
				
				setTimeout(function(){
					$state.go('loading');
				}, 300);
				
				$rootScope.currentUser = authData.uid;
				
			} else {
				
				console.log("User is logged out");

				$('.btn-signin').removeClass('active');
			}
		};
		
		/**
         * @function LoginControllers.attemptLogin
         * @memberof LoginControllers
         * @author Alex Boisselle
         * @description if the un and pw fields are entered, fire the login service
         * @fires LoginService.login
         */
		$scope.attemptLogin = function(){
						
			if($scope.user.email && $scope.user.password){
				
				$('.btn-signin').addClass('active');
				
				LoginService.login($scope.user.email, $scope.user.password);
			}
		};
		
		//test if user has session already going
		$rootScope.firebase.onAuth($scope.authDataCallback);
		
		//if the user has no logged in before, this is a fresh instance
		//add a listener to the loggedIn var to set the visibility of the form
		if(!$scope.loggedIn){
			$rootScope.$watch('loggedIn', function(value){
				if(value === 0 || !value){
					
					console.log("should show login form");
					
					$scope.loggedIn = 0;
					
				}
			});
		}
		
	}]);
})();