/*jshint -W099*/
/**
 * Notifications Directives
 * @module /components/notifications/preloaderDirectives
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var notificationsDirectives = angular.module('iMetric.components.notifications.directives', [])

	.directive('notification', ['$rootScope', 
	                            'PATHS', function($rootScope, 
	                            				  PATHS) {
		
		var dir = {};
		
		dir.restrict = "E";
		
		dir.templateUrl = PATHS.NOTIFICATIONS + 'notification.html';
		
		dir.link = function(scope, element){
			console.log(element);
			
			var closeButton = element[0].querySelector('.notification-close');
			
			$(element).addClass('visible');
			
			$(closeButton).on('click', function(){
				
				$(element[0]).hide("fast");
			});
		};
		
		return dir;
	}]);
	
})();