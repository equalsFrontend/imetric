/*jshint -W099*/
/**
 * Preloader Services
 * @module /components/preloader/preloaderServices
 */

(function(){

	"use strict";
	
	var preloaderServices = angular.module('iMetric.components.preloader.services', [])
	
	.factory('PreloaderService', ['$q', 
	                              '$rootScope', 
	                              function($q,
	                            		   $rootScope){
		return {
            /**
             * @function PreloaderService.start
             * @returns A promise that eventually resolves to the username of the first user
             */
            start: function() {
            	            	
            	var _this = this;
            	
                var startDefer = $q.defer();
                
                $rootScope.firebase.on('value', function(snapshot){
                	
                	_this.data = snapshot.val();
                	
                	startDefer.resolve(snapshot.val());
                });
                	
                return startDefer.promise;
            },
            /**
             * @property data
             * @returns the sum of data returning from the db
             */
            data: {}
        };
	}]);
})();