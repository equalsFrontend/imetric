/*jshint -W099*/
/**
 * Drivers Services
 * @module /components/drivers/driversServices
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var driversServices = angular.module('iMetric.components.drivers.services', [])
	
	.factory('DriverEventRelayService', ['$rootScope', 
                                function($rootScope){
		
		return {
			
			/**
	         * @function DriverEventRelayService.relay 
	         * @memberof DriversServices
	         * @param {string} event - the title of the event (stored in constants)
	         * @param {object} details - contains the key of the event, the event category and the event data
	         * @author Alex Boisselle
	         * @description transforms event for the controller to augment the DOM
	         * @fires $rootScope.$broadcast()
	         */
			relay: function(event, details){
								
				var uniqueId = details.category + details.key,
					
					eventObj = {
					category: details.category,
					data: details.data
				};
				
				if(!this.storage.hasOwnProperty(uniqueId)){
					this.storage[uniqueId] = eventObj;
				}
				
				$rootScope.$broadcast(event, eventObj);			
			},
			
			/**
 	         * @property {object} DriverEventRelayService.storage - Storage of all driver events in the session
 	         * @memberof DriversServices
 	         * @author Alex Boisselle
 	         */
			storage: {}
		};
	}]);
})();