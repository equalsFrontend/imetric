/*jshint -W099*/
/**
 * Login Services
 * @module /components/login/loginServices
 * @namespace LoginServices
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var loginServices = angular.module('iMetric.components.login.services', [])
	
	.factory('LoginService', ['$q', 
	                          '$rootScope', 
                              function($q,
                            		   $rootScope){
		return {
			/**
             * @function LoginServices.login 
             * @memberof LoginServices
             * @param {string} un - username
             * @param {string} pw - password
             * @author Alex Boisselle
             * @description logs user into firebase
             * @returns Payload of user data
             */
            login: function(un, pw) {
            	            	
                var startDefer = $q.defer();
                
                $rootScope.firebase.authWithPassword({
                	email    : un,
                	password : pw
                }, function(error, authData) {
	            	if (error) {
	            		alert('Sorry, but your credentials are incorrect. Please try again.');

	    				$('.btn-signin').removeClass('active');
	            	} else {
	                    //console.log("Authenticated successfully with payload:", authData);
	            	}
                });
                	
                return startDefer.promise;
            },
            
            /**
             * @function LoginServices.logout 
             * @memberof LoginServices
             * @author Alex Boisselle
             * @description sets rootscope login to false, which invokes a view change on login screen
             * @fires firebase.unauth
             */
            logout: function(){
            	
            	console.log("LOGOUT");
            	
            	$rootScope.loggedIn = "false";
            	
    			$rootScope.firebase.unauth();
    			
            }
        };
	}]);
	
})();