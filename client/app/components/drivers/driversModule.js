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
	    'iMetric.components.drivers.directives'
	])
	
	.controller('DriversControllers', ['$scope', 
	                                      '$rootScope',
	                                      'PATHS',
	                                      function($scope, 
	                                    		   $rootScope,
	                                    		   PATHS){
		
		var drivers = new Firebase(PATHS.FIREBASE + '/drivers'),
			stats = new Firebase(PATHS.FIREBASE + '/stats'),
			accQuery = new Firebase(PATHS.FIREBASE + '/stats/acceleration'),
			decQuery = new Firebase(PATHS.FIREBASE + '/stats/braking'),
			stopQuery = new Firebase(PATHS.FIREBASE + '/stats/stops'),
			steadyQuery = new Firebase(PATHS.FIREBASE + '/stats/steady');
	
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
         * @param {object} snapshot - firebase snapshot of the driver data
         * @author Alex Boisselle
         * @description adds driver to module's scope 
         * @fires updateDriverSeries
         */
		$scope.addDriver = function(snapshot){
			
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
         * @param {string} type - the type of event
         * @param {string} statDriverId - the id of the driver that fired the event
         * @author Alex Boisselle
         * @description event tracked, adds it to scope
         * @fires updateDriverSeries
         */
		$scope.addDriverEvent = function(type, statDriverId){
			for(var d in $scope.driverProfiles){
				var driverProfile = $scope.driverProfiles[d];
				
				if(statDriverId == driverProfile.id){
					if (!$scope.$$phase) { // i.e. first click after fetching from firebase
						/* jshint ignore:start */
						    $scope.$apply(function () {
						    	driverProfile[type] ++;
						    });
					    /* jshint ignore:end */
					} else {
						driverProfile[type] ++;
					}
				}
				
				$scope.updateDriverSeries();
			}
		};
		
		
		/**
         * @function DriversControllers.removeDriverEvent 
         * @memberof DriversControllers
         * @param {string} type - the type of event
         * @param {statDriverId} statDriverId - the id of the driver that fired the event
         * @author Alex Boisselle
         * @description event removed, removes it from scope
         * @fires updateDriverSeries
         */
		$scope.removeDriverEvent = function(type, statDriverId){
			for(var d in $scope.driverProfiles){
				var driverProfile = $scope.driverProfiles[d];
				
				if(statDriverId == driverProfile.id){
					if (!$scope.$$phase) { // i.e. first click after fetching from firebase
						/* jshint ignore:start */
						    $scope.$apply(function () {
						    	driverProfile[type] --;
						    });
					    /* jshint ignore:end */
					} else {
						driverProfile[type] --;
					}
				}
				
				$scope.updateDriverSeries();
			}
		};
		

		
		//driver added
		drivers.on("child_added", function(snapshot) {
			
			$scope.addDriver(snapshot);
		});		

		//driver removed
		drivers.on("child_removed", function(snapshot) {
			
			$scope.removeDriver(snapshot);
		});	
		
		
		//accel tracked
		accQuery.on("child_added", function(_snapshot){
			var statDriverId = _snapshot.val().driver;
										
			$scope.addDriverEvent('accelerations', statDriverId);
		});
		
		//accel removed
		accQuery.on("child_removed", function(_snapshot){
			var statDriverId = _snapshot.val().driver;
										
			$scope.removeDriverEvent('accelerations', statDriverId);
		});
		
		
		
		//brake tracked
		decQuery.on("child_added", function(_snapshot){
			var statDriverId = _snapshot.val().driver;
			
			$scope.addDriverEvent('decelerations', statDriverId);
		});
		
		//stop tracked
		stopQuery.on("child_added", function(_snapshot){
			var statDriverId = _snapshot.val().driver;
			
			$scope.addDriverEvent('stops', statDriverId);
		});
		
		//steady tracked
		steadyQuery.on("child_added", function(_snapshot){
			var statDriverId = _snapshot.val().driver;
			
			$scope.addDriverEvent('steadys', statDriverId);
		});
				
	}]);
	
})();