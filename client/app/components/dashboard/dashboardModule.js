/*jshint -W099*/
/**
 * Dashboard Module
 * @module /components/dashboard/
 * @namespace DashboardControllers
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var dashboardModule = angular.module('iMetric.components.dashboard', [
	    'iMetric.components.dashboard.directives',
	    'iMetric.components.dashboard.services',
	    'iMetric.components.drivers.services'
	])
	
	
	
	.controller('DashboardController', ['$scope', 
	                                    '$rootScope',
	                                    'LoginService',
	                                    'PreloaderService',
	                                    'DriverEventRelayService',
	                                    'NotificationRelayService',
	                                    'PATHS',
	                                    'EVENTS',
	                                    function($scope, 
	                                    		 $rootScope,
	                                    		 LoginService,
	                                    		 PreloaderService,
	     	                                     DriverEventRelayService,
	     	                                     NotificationRelayService,
	                                    		 PATHS,
	                                    		 EVENTS){
		
		/**
         * @property {string} state - the current state of the application (NOT USED)
         * @memberof DashboardControllers
         */
		$scope.state = "dashboard";

		/**
         * @property {object} data - holds the data from the preloader for in-scope reference
         * @memberof DashboardControllers
         */
		$scope.data = PreloaderService.data;
		
		$scope.currentUser = $rootScope.currentUser;
		
		/**
         * @function DashboardControllers.logout 
         * @memberof DashboardControllers
         * @author Alex Boisselle
         * @description dom event handler
         * @fires LoginService.logout
         */
		$scope.logout = function(){
			LoginService.logout();
		};
		
		//firebase queries
		var driversQuery = new Firebase(PATHS.FIREBASE + '/drivers'),
			statsQuery = new Firebase(PATHS.FIREBASE + '/stats'),
			accQuery = new Firebase(PATHS.FIREBASE + '/stats/acceleration'),
			decQuery = new Firebase(PATHS.FIREBASE + '/stats/braking'),
			stopQuery = new Firebase(PATHS.FIREBASE + '/stats/stops'),
			steadyQuery = new Firebase(PATHS.FIREBASE + '/stats/steady');
		
		//driver added
		driversQuery.on("child_added", function(snapshot) {
			
			var event = {
				key: snapshot.key(),
				category: 'drivers',
				data: snapshot
			};
			
			/**
			 * @event DashboardControllers#driver_added
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} data - data snapshot from fb
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_DRIVER_ADDED, event);
		});		

		//driver removed
		driversQuery.on("child_removed", function(snapshot) {
			
			var event = {
				key: snapshot.key(),
				category: 'drivers',
				data: snapshot
			};
			
			/**
			 * @event DashboardControllers#driver_removed
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} data - data snapshot from fb
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_DRIVER_REMOVED, {category: 'drivers', data: snapshot});
		});	
		
		//accel tracked
		accQuery.on("child_added", function(snapshot){
						
			var event = {
				key: snapshot.key(),
				category: 'accelerations',
				data: snapshot.val().driver
			};
			
			/**
			 * @event DashboardControllers#accel_added
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} statDriverId - driver id
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_ACCEL_ADDED, event);
			
			NotificationRelayService.relay(EVENTS.EVENT_ACCEL_ADDED, event);
		});
		
		//accel removed
		accQuery.on("child_removed", function(snapshot){
			
			var event = {
				key: snapshot.key(),
				category: 'accelerations',
				data: snapshot.val().driver
			};
			
			/**
			 * @event DashboardControllers#accel_removed
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} statDriverId - driver id
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_ACCEL_REMOVED, event);
		});
		
		//brake tracked
		decQuery.on("child_added", function(snapshot){
			
			var event = {
				key: snapshot.key(),
				category: 'decelerations',
				data: snapshot.val().driver
			};
			
			/**
			 * @event DashboardControllers#decel_added
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} statDriverId - driver id
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_DECEL_ADDED, event);
		});
		
		//brake tracked
		decQuery.on("child_removed", function(snapshot){
			
			var event = {
				key: snapshot.key(),
				category: 'decelerations',
				data: snapshot.val().driver
			};
			
			/**
			 * @event DashboardControllers#decel_added
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} statDriverId - driver id
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_DECEL_REMOVED, event);
		});
		
		//stop tracked
		stopQuery.on("child_added", function(snapshot){
			
			var event = {
				key: snapshot.key(),
				category: 'stops',
				data: snapshot.val().driver
			};
			
			/**
			 * @event DashboardControllers#stop_added
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} statDriverId - driver id
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_STOP_ADDED, event);
		});
		
		//stop tracked
		stopQuery.on("child_removed", function(snapshot){
			
			var event = {
				key: snapshot.key(),
				category: 'stops',
				data: snapshot.val().driver
			};
			
			/**
			 * @event DashboardControllers#stop_added
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} statDriverId - driver id
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_STOP_REMOVED, event);
		});
		
		//steady tracked
		steadyQuery.on("child_added", function(snapshot){
			
			var event = {
				key: snapshot.key(),
				category: 'steadys',
				data: snapshot.val().driver
			};
			
			/**
			 * @event DashboardControllers#steady_added
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} statDriverId - driver id
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_STEADY_ADDED, event);
		});
		
		//steady tracked
		steadyQuery.on("child_removed", function(snapshot){
			
			var event = {
				key: snapshot.key(),
				category: 'steadys',
				data: snapshot.val().driver
			};
			
			/**
			 * @event DashboardControllers#steady_added
			 * @type {object}
			 * @memberof DashboardControllers
			 * @param {string} category - event category
			 * @param {object} statDriverId - driver id
			 */
			DriverEventRelayService.relay(EVENTS.EVENT_STEADY_REMOVED, event);
		});
		
	}])
	
	.controller('MapViewController', ['$scope', 
                                      '$rootScope',
                                      'PATHS',
                                      function($scope, 
                                    	       $rootScope,
                                    		   PATHS){
		
		var map, pointarray, heatmap;
		
		/**
         * @function initializeGmaps
         */
		function initializeGmaps() {
			var mapOptions = {
					zoom: 13,
					center: new google.maps.LatLng(37.774546, -122.433523),
					mapTypeId: google.maps.MapTypeId.SATELLITE
			};

			map = new google.maps.Map(document.getElementById('map-canvas'),
					 				  mapOptions);

			var pointArray = new google.maps.MVCArray(taxiData);

			heatmap = new google.maps.visualization.HeatmapLayer({
				data: pointArray
			});

			heatmap.setMap(map);
		}
		
		/**
         * @function toggleHeatmap
         */
		function toggleHeatmap() {
			heatmap.setMap(heatmap.getMap() ? null : map);
		}

		/**
         * @function changeGradient
         */
		function changeGradient() {
			var gradient = [
			    'rgba(0, 255, 255, 0)',
			    'rgba(0, 255, 255, 1)',
			    'rgba(0, 191, 255, 1)',
			    'rgba(0, 127, 255, 1)',
			    'rgba(0, 63, 255, 1)',
			    'rgba(0, 0, 255, 1)',
			    'rgba(0, 0, 223, 1)',
			    'rgba(0, 0, 191, 1)',
			    'rgba(0, 0, 159, 1)',
			    'rgba(0, 0, 127, 1)',
			    'rgba(63, 0, 91, 1)',
			    'rgba(127, 0, 63, 1)',
			    'rgba(191, 0, 31, 1)',
			    'rgba(255, 0, 0, 1)'
			];
			
			heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
		}

		/**
         * @function changeRadius
         */
		function changeRadius() {
			heatmap.set('radius', heatmap.get('radius') ? null : 20);
		}

		/**
         * @function changeOpacity
         */
		function changeOpacity() {
			heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
		}

		var taxiData = [
		 
		  new google.maps.LatLng(37.768244, -122.428138),
		  new google.maps.LatLng(37.767942, -122.428581),
		  new google.maps.LatLng(37.767482, -122.429094),
		  new google.maps.LatLng(37.767031, -122.429606),
		  new google.maps.LatLng(37.766732, -122.429986),
		  new google.maps.LatLng(37.766680, -122.430058),
		  new google.maps.LatLng(37.766633, -122.430109),
		  new google.maps.LatLng(37.766580, -122.430211),
		  new google.maps.LatLng(37.766367, -122.430594),
		  new google.maps.LatLng(37.765910, -122.431137),
		  new google.maps.LatLng(37.765353, -122.431806),
		  new google.maps.LatLng(37.764962, -122.432298),
		  new google.maps.LatLng(37.764868, -122.432486),
		  new google.maps.LatLng(37.764518, -122.432913),
		  new google.maps.LatLng(37.763435, -122.434173),
		  new google.maps.LatLng(37.762847, -122.434953),
		  new google.maps.LatLng(37.762291, -122.435935),
		  new google.maps.LatLng(37.762224, -122.436074),
		  new google.maps.LatLng(37.761957, -122.436892),
		  new google.maps.LatLng(37.761652, -122.438886),
		  new google.maps.LatLng(37.761284, -122.439955),
		  new google.maps.LatLng(37.761210, -122.440068),
		  new google.maps.LatLng(37.761064, -122.440720),
		  new google.maps.LatLng(37.761040, -122.441411),
		  new google.maps.LatLng(37.761048, -122.442324),
		  new google.maps.LatLng(37.760851, -122.443118),
		  new google.maps.LatLng(37.759977, -122.444591),
		  new google.maps.LatLng(37.759913, -122.444698),
		  new google.maps.LatLng(37.759623, -122.445065),
		  new google.maps.LatLng(37.758902, -122.445158),
		  new google.maps.LatLng(37.758428, -122.444570),
		  new google.maps.LatLng(37.757687, -122.443340),
		  new google.maps.LatLng(37.757583, -122.443240),
		  new google.maps.LatLng(37.757019, -122.442787),
		  new google.maps.LatLng(37.756603, -122.442322),
		  new google.maps.LatLng(37.756380, -122.441602),
		  new google.maps.LatLng(37.755790, -122.441382),
		  new google.maps.LatLng(37.754493, -122.442133),
		  new google.maps.LatLng(37.754361, -122.442206),
		  new google.maps.LatLng(37.753719, -122.442650),
		  new google.maps.LatLng(37.753096, -122.442915),
		  new google.maps.LatLng(37.751617, -122.443211),
		  new google.maps.LatLng(37.751496, -122.443246),
		  new google.maps.LatLng(37.750733, -122.443428),
		  new google.maps.LatLng(37.750126, -122.443536),
		  new google.maps.LatLng(37.750103, -122.443784),
		  new google.maps.LatLng(37.750390, -122.444010),
		  new google.maps.LatLng(37.750448, -122.444013),
		  new google.maps.LatLng(37.750536, -122.444040),
		  new google.maps.LatLng(37.750493, -122.444141),
		  new google.maps.LatLng(37.790859, -122.402808),
		  new google.maps.LatLng(37.790864, -122.402768),
		  new google.maps.LatLng(37.790995, -122.402539),
		  new google.maps.LatLng(37.791148, -122.402172),
		  new google.maps.LatLng(37.791385, -122.401312),
		  new google.maps.LatLng(37.791405, -122.400776),
		  new google.maps.LatLng(37.791288, -122.400528),
		  new google.maps.LatLng(37.791113, -122.400441),
		  new google.maps.LatLng(37.791027, -122.400395),
		  new google.maps.LatLng(37.791094, -122.400311),
		  new google.maps.LatLng(37.791211, -122.400183),
		  new google.maps.LatLng(37.791060, -122.399334),
		  new google.maps.LatLng(37.790538, -122.398718),
		  new google.maps.LatLng(37.790095, -122.398086),
		  new google.maps.LatLng(37.789644, -122.397360),
		  new google.maps.LatLng(37.789254, -122.396844),
		  new google.maps.LatLng(37.788855, -122.396397),
		  new google.maps.LatLng(37.788483, -122.395963),
		  new google.maps.LatLng(37.788015, -122.395365),
		  new google.maps.LatLng(37.787558, -122.394735),
		  new google.maps.LatLng(37.787472, -122.394323),
		  new google.maps.LatLng(37.787630, -122.394025),
		  new google.maps.LatLng(37.787767, -122.393987),
		  new google.maps.LatLng(37.787486, -122.394452),
		  new google.maps.LatLng(37.786977, -122.395043),
		  new google.maps.LatLng(37.786583, -122.395552),
		  new google.maps.LatLng(37.786540, -122.395610),
		  new google.maps.LatLng(37.786516, -122.395659),
		  new google.maps.LatLng(37.786378, -122.395707),
		  new google.maps.LatLng(37.786044, -122.395362),
		  new google.maps.LatLng(37.785598, -122.394715),
		  new google.maps.LatLng(37.785321, -122.394361),
		  new google.maps.LatLng(37.785207, -122.394236),
		  new google.maps.LatLng(37.785751, -122.394062),
		  new google.maps.LatLng(37.785996, -122.393881),
		  new google.maps.LatLng(37.786092, -122.393830),
		  new google.maps.LatLng(37.785998, -122.393899),
		  new google.maps.LatLng(37.785114, -122.394365),
		  new google.maps.LatLng(37.785022, -122.394441),
		  new google.maps.LatLng(37.784823, -122.394635),
		  new google.maps.LatLng(37.784719, -122.394629),
		  new google.maps.LatLng(37.785069, -122.394176),
		  new google.maps.LatLng(37.785500, -122.393650),
		  new google.maps.LatLng(37.785770, -122.393291),
		  new google.maps.LatLng(37.785839, -122.393159),
		  new google.maps.LatLng(37.782651, -122.400628),
		  new google.maps.LatLng(37.782616, -122.400599),
		  new google.maps.LatLng(37.782702, -122.400470),
		  new google.maps.LatLng(37.782915, -122.400192),
		  new google.maps.LatLng(37.783137, -122.399887),
		  new google.maps.LatLng(37.783414, -122.399519),
		  new google.maps.LatLng(37.783629, -122.399237),
		  new google.maps.LatLng(37.783688, -122.399157),
		  new google.maps.LatLng(37.783716, -122.399106),
		  new google.maps.LatLng(37.783798, -122.399072),
		  new google.maps.LatLng(37.783997, -122.399186),
		  new google.maps.LatLng(37.784271, -122.399538),
		  new google.maps.LatLng(37.784577, -122.399948),
		  new google.maps.LatLng(37.784828, -122.400260),
		  new google.maps.LatLng(37.784999, -122.400477),
		  new google.maps.LatLng(37.785113, -122.400651),
		  new google.maps.LatLng(37.785155, -122.400703),
		  new google.maps.LatLng(37.785192, -122.400749),
		  new google.maps.LatLng(37.785278, -122.400839),
		  new google.maps.LatLng(37.785387, -122.400857),
		  new google.maps.LatLng(37.785478, -122.400890),
		  new google.maps.LatLng(37.785526, -122.401022),
		  new google.maps.LatLng(37.785598, -122.401148),
		  new google.maps.LatLng(37.785631, -122.401202),
		  new google.maps.LatLng(37.785660, -122.401267),
		  new google.maps.LatLng(37.803986, -122.426035),
		  new google.maps.LatLng(37.804102, -122.425089),
		  new google.maps.LatLng(37.804211, -122.424156),
		  new google.maps.LatLng(37.803861, -122.423385),
		  new google.maps.LatLng(37.803151, -122.423214),
		  new google.maps.LatLng(37.802439, -122.423077),
		  new google.maps.LatLng(37.801740, -122.422905),
		  new google.maps.LatLng(37.801069, -122.422785),
		  new google.maps.LatLng(37.751266, -122.403355)
		];
		
		initializeGmaps();
		
		//google.maps.event.addDomListener(window, 'load', initializeGmaps);
	}]);
})();