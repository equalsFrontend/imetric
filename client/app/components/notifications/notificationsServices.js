/*jshint -W099*/
/**
 * Notifications Services
 * @module /components/notifications/notificationsServices
 * @namespace NotificationsService
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var notificationsServices = angular.module('iMetric.components.notifications.services', [])
	
	.factory('NotificationsService', ['$q', 
	                                 '$rootScope', 
	                                 function($q,
	                                		  $rootScope){
		return {
			/**
             * @function NotificationsService.broadcast
             * @memberof NotificationsService
             * @param  {object} details - details to provide to the notification controller to output
             * @author Alex Boisselle
             */
            broadcast: function(details) {
            	     
            	var notificationModel = {
            		id: details.id ? details.id : null,
            		type: details.type ? details.type : null,
            		driverId: details.driverId ? details.driverId : null,
            		driverName: details.driverName ? details.driverName : "",
            		mapCoords: details.mapCoords ? details.mapCoords : null,
            		description: details.description ? details.description : ""
            	};
                
            	
            }
        };
	}]);
})();