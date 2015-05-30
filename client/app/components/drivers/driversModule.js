/*jshint -W099*/
/**
 * 
 * @module /components/drivers/
 * @exports /compnents/drivers
 * @namespace DriversControllers
 * @author Alex Boisselle
 */

(function(){

	"use strict";
	
	var driversModule = angular.module('iMetric.components.drivers', [
	    'iMetric.components.drivers.directives',
	    'iMetric.components.drivers.services'
	])
	
	.controller('DriversControllers', ['$scope', 
	                                   '$rootScope',
	                                   'PATHS',
	                                   'EVENTS',
	                                   'DriverEventRelayService',
	                                   function($scope, 
	                                    		$rootScope,
	                                    		PATHS,
	                                    		EVENTS,
	                                    		DriverEventRelayService){
	
		$scope.driverProfiles = [];
				
		/**
         * @property {object} driverChartConfig - stores the config options for the driver panel chart
         * @memberof DriversControllers
         */
		$scope.driverChartConfig = {
				
			options: {
		        legend: {
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'middle',
		            borderWidth: 0
		        },

		        chart: {
		        	type: 'column',
		        	events: {
		        		redraw: function(event){
		        			console.log("draw chart");
		        		}
		        	}
		        }
			},
	  
			//this is what gets updated on entry & with push
			//and in turn redraws the chart
			series: [],
	  
			title: {
				text: 'Driver Event Summary'
			},
	  
			loading: false,
	  
			xAxis: {
				categories: ['Accelerations', 'Deccelerations', 'Stops', 'Steadys'],
				type: 'category',
				labels: {
					rotation: -45,
					style: {
						fontSize: '13px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			},
        
			useHighStocks: false,
	  
			size: {
				width: window.innerWidth * 0.8,
				height: 300
			},
	  
			func: function (chart) {
		  
			}
		};
		
		
		//the next few functions are purely transformation functions from db to chart avaiable formats
		
		/**
         * @function DriversControllers.updateDriverSeries
         * @memberof DriversControllers
         * @author Alex Boisselle
         * @description rebuild the chart's data set by each driver's data
         */
		$scope.updateDriverSeries = function(){
			
			$scope.driverChartConfig.series = [];
			
			for(var d in $scope.driverProfiles){
				var driverProfile = $scope.driverProfiles[d];
				
				$scope.driverChartConfig.series.push({
					name: driverProfile.name + " (" + driverProfile.grade + ")",
					data: [driverProfile.accelerations, 
					       driverProfile.decelerations, 
					       driverProfile.stops, 
					       driverProfile.steadys]
				});
			}
		};
		
		
		/**
         * @function DriversControllers.addDriver 
         * @memberof DriversControllers
         * @param {string} category - event category
         * @param {object} snapshot - firebase snapshot of the driver data
         * @author Alex Boisselle
         * @description adds driver to module's scope 
         * @fires updateDriverSeries
         */
		$scope.addDriver = function(category, snapshot){
			
			var driverId = snapshot.key(), 
				driverName = snapshot.val().name, 
				driverVehicle = snapshot.val().vehicle, 
				driverLocation = snapshot.val().location, 
				driverGrade = snapshot.val().grade;
			
			$scope.driverProfiles.push({
				id: driverId,
				name: driverName,
				grade: driverGrade,
				location: driverLocation,
				vehicle: driverVehicle,
				accelerations: 0,
				decelerations: 0,
				stops: 0,
				steadys: 0
			});
			
			if (!$scope.$$phase) { // i.e. first click after fetching from firebase
			    $scope.$apply();
			}
			
			$scope.updateDriverSeries();
		};
		
		
		/**
         * @function DriversControllers.addDriverEvent 
         * @memberof DriversControllers
         * @param {string} category - the category of event
         * @param {string} statDriverId - the id of the driver that fired the event
         * @author Alex Boisselle
         * @description event tracked, adds it to scope
         * @fires updateDriverSeries
         */
		$scope.addDriverEvent = function(category, statDriverId){
			for(var d in $scope.driverProfiles){
				var driverProfile = $scope.driverProfiles[d];
				
				if(statDriverId == driverProfile.id){
					if (!$scope.$$phase) { // i.e. first click after fetching from firebase
						/* jshint ignore:start */
						    $scope.$apply(function () {
						    	driverProfile[category] ++;
						    });
					    /* jshint ignore:end */
					} else {
						driverProfile[category] ++;
					}
				}
				
				$scope.updateDriverSeries();
			}
		};
		
		
		/**
         * @function DriversControllers.removeDriverEvent 
         * @memberof DriversControllers
         * @param {string} category - the category of event
         * @param {statDriverId} statDriverId - the id of the driver that fired the event
         * @author Alex Boisselle
         * @description event removed, removes it from scope
         * @fires updateDriverSeries
         */
		$scope.removeDriverEvent = function(category, statDriverId){
			for(var d in $scope.driverProfiles){
				var driverProfile = $scope.driverProfiles[d];
				
				if(statDriverId == driverProfile.id){
					if (!$scope.$$phase) { // i.e. first click after fetching from firebase
						/* jshint ignore:start */
						    $scope.$apply(function () {
						    	driverProfile[category] --;
						    });
					    /* jshint ignore:end */
					} else {
						driverProfile[category] --;
					}
				}
				
				$scope.updateDriverSeries();
			}
		};
			
		
		//events fired by dashboard are heard here to build data for charts
		/**
		 * @listens DashboardControllers#driver_added
		 */
		$scope.$on(EVENTS.EVENT_DRIVER_ADDED, function(event, args){

			$scope.addDriver(args.category, args.data);
		});
		
		/**
		 * @listens DashboardControllers#driver_removed
		 */
		$scope.$on(EVENTS.EVENT_DRIVER_REMOVED, function(event, args){

			$scope.removeDriver(args.category, args.data);
		});
		
		/**
		 * @listens DashboardControllers#accel_added
		 * @listens DashboardControllers#decel_added
		 * @listens DashboardControllers#stop_added
		 * @listens DashboardControllers#steady_added
		 */
		$scope.$onMany([
		    EVENTS.EVENT_ACCEL_ADDED,
		    EVENTS.EVENT_DECEL_ADDED,
		    EVENTS.EVENT_STOP_ADDED,
		    EVENTS.EVENT_STEADY_ADDED
		], function(event, args){
			console.log("accel added!!!");
			$scope.addDriverEvent(args.category, args.data);
		});
		
		
		/**
		 * @listens DashboardControllers#accel_removed
		 */
		$scope.$onMany([
		    EVENTS.EVENT_ACCEL_REMOVED,
		    EVENTS.EVENT_DECEL_REMOVED,
		    EVENTS.EVENT_STOP_REMOVED,
		    EVENTS.EVENT_STEADY_REMOVED
		], function(event, args){
			$scope.removeDriverEvent(args.category, args.data);
		});
		
		
		//when the controller is initialized we must first run through the driver 
		//event list to build the initial reports, afterwards is real time
		for(var e in DriverEventRelayService.storage){
			var event = DriverEventRelayService.storage[e];
			
			if(event.category == "drivers"){
				$scope.addDriver(event.category, event.data);
			} else {
				$scope.addDriverEvent(event.category, event.data);
			}
		}
		
	}]);
})();