/*jshint -W099*/
/**
 * Notifications Module
 * @module /components/notifications/
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var notificationsModule = angular.module('iMetric.components.notifications', [
	    'iMetric.components.notifications.directives',
	    'iMetric.components.notifications.services'
	])
	
	//this controller is for controller the scope
	.controller('NotificationsController', ['$scope', 
	                                        '$rootScope', 
	                                        'NotificationRelayService',
	                                         function($scope, 
	                                        		  $rootScope,
	                                        		  NotificationRelayService){
				
		/*$scope.$on("NOTIFY-" + EVENTS.EVENT_ACCEL_ADDED, function(event, args){

			
			
		});*/
		
	}])
	
	//view specific methods & properties
	.controller('NotificationsViewController', ['$scope', 
	                                            '$rootScope', 
	                                            'NotificationRelayService',
	                                            function($scope, 
	                                            		 $rootScope,
	                                            		 NotificationRelayService){
		
		$scope.storage = NotificationRelayService.storage;
		
	}])
	
	//popup specific methods and properties
	.controller('NotificationPopupController', ['$scope', 
	                                            '$rootScope', 
	                                            'NotificationRelayService',
	                                            function($scope, 
	                                            		 $rootScope,
	                                            		 NotificationRelayService){

		$scope.queue = NotificationRelayService.queue;
				
	}]);
	
})();