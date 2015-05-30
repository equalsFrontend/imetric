/*jshint -W099*/
/**
 * Notifications Services
 * @module /components/notifications/notificationsServices
 * @namespace NotificationsServices
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var notificationsServices = angular.module('iMetric.components.notifications.services', [])
	
	.factory('NotificationRelayService', ['$rootScope', 
	                                      '$state',
	                                      function($rootScope,
	                                    		   $state){
	     		
 		return {
 			
 			/**
 	         * @function NotificationRelayService.relay 
 	         * @memberof NotificationsServices
 	         * @param {string} event - the title of the event (stored in constants)
 	         * @param {object} details - contains the key of the event, the event category and the event data
 	         * @author Alex Boisselle
 	         * @description transforms event for the controller to augment the DOM
 	         * @fires $rootScope.$broadcast()
 	         */
 			relay: function(event, details){
 				
 				console.log("notification relay service event " + event);
 				
 				var state = $state.current,
 					uniqueId = details.category + details.key,
 					_this = this,
 					
 					eventObj = {
 					id: uniqueId,
 					category: details.category,
 					data: details.data
 				};
 				
 				//if this event is not stored, store it
 				if(!this.storage.hasOwnProperty(uniqueId)){
 					this.storage[uniqueId] = eventObj;
 				}
 				
 				//if queue does not already hold this event
 				//add it, and after 2 seconds remove it
 				if(!this.queue.hasOwnProperty(uniqueId) && state.name.indexOf('notifications') < 0){
 					
 					this.addToQueue(uniqueId, eventObj);
 					
 					this.timer = setTimeout(function(){
 						 						
 						_this.removeFromQueue(uniqueId);
 						
 						clearTimeout(_this.timer);
 						
 					}, 8000);
 				}
 				
 				$rootScope.$broadcast("NOTIFY-" + event, eventObj);			
 			},
 			
 			/**
 	         * @function NotificationRelayService.addToQueue
 	         * @memberof NotificationsServices
 	         * @param {string} uniqueId - the unique id used as the key in the queue object
 	         * @param {object} eventObj - event object storing the id, category and data of the event
 	         * @author Alex Boisselle
 	         * @description places an event in the queue, needs rootscope apply to work
 	         */
 			addToQueue: function(uniqueId, eventObj){
 				var _this = this;

		/*		if (!$rootScope.$$phase) { // i.e. first click after fetching from firebase
		 			 jshint ignore:start 
	 					$rootScope.$apply(function () {*/
	 						_this.queue[uniqueId] = eventObj;
	 			/*		});
				     jshint ignore:end 
				}*/
 			},
 			
 			/**
 	         * @function NotificationRelayService.removeFromQueue
 	         * @memberof NotificationsServices
 	         * @param {string} uniqueId - the unique id used as the key in the queue object
 	         * @author Alex Boisselle
 	         * @description removes an event from the queue, needs rootscope apply to work
 	         */
 			removeFromQueue: function(uniqueId){
 				var _this = this;

				if (!$rootScope.$$phase) { // i.e. first click after fetching from firebase
		 			/* jshint ignore:start */
					    $rootScope.$apply(function () {
					    	delete _this.queue[uniqueId];
					    });
				    /* jshint ignore:end */
				}
			},
 			
			/**
 	         * @property {object} NotificationRelayService.queue - The queue that displays notif popups
 	         * @memberof NotificationsServices
 	         * @author Alex Boisselle
 	         */
 			queue: {},
 			
 			/**
 	         * @property {object} NotificationRelayService.storage - Storage of all events acquired in the session
 	         * @memberof NotificationsServices
 	         * @author Alex Boisselle
 	         */
 			storage: {}
 		};
 	}]);
})();