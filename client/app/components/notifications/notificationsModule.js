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
	
	.controller('NotificationsViewController', ['$scope', 
	                                            '$rootScope', 
	                                            function($scope, 
	                                            		 $rootScope){
		
		$scope.greeting = "Notification view";
		
		$scope.closeNotification = function(event){
			var el = event.target,
				container = $($($(el).parent()).parent())[0],
				containerId = container.id;
			
			$('#' + containerId).hide("fast");
		};
		
		$scope.$on('newNotification', function(){
			console.log("View Controller: New Notification");
		});
		
	}])
	
	.controller('NotificationController', ['$scope', 
	                                            '$rootScope', 
	                                            function($scope, 
	                                            		 $rootScope){
		
		$scope.greeting = "Notification popup";
		
		$scope.closeNotification = function(event){
			var el = event.target,
				container = $($($(el).parent()).parent())[0],
				containerId = container.id;
		
			$('#' + containerId).hide("fast");
		};
		
		$scope.$on('newNotification', function(){
			console.log("View Controller: New Notification");
		});
	}]);
	
})();