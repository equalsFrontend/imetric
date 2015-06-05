/*jshint -W099*/

/**
 * iMetric
 * @module app
 * @namespace App
 * @author Alex Boisselle
 */

(function(){
	
	"use strict";
	
	/**
	 * Setup of main Metric AngularJS application, with components and Restangular as dep.
	 *
	 * @see app/components
	 */
	var app = angular.module('iMetric',
		[   
			'ui.router',
			'ngAnimate',
			'highcharts-ng',
		 	'swipe',
		 	'iMetric.components.login',
		 	'iMetric.components.preloader',
		 	'iMetric.components.dashboard',
		 	'iMetric.components.drivers',
		 	'iMetric.components.notifications'
	    ]   
	)
		
	.constant("CONFIG", (function(){
		
		return {
			NAME: 'iMetric',
			VERSION: '1.0.0',
			API: 'http://blistering-heat-5543.firebaseapp.com/doc',
			GIT: 'https://github.com/equalsFrontend/imetric.git'
		};
		
	}))
	
	.constant("PATHS", (function(){
		
		var appPath = "client/app/";
		
		if(dist){
			appPath = "../client/app/";
		}
		
		return {
			FIREBASE : "https://blistering-heat-5543.firebaseio.com",
			TEST : "test/",
			CLIENT : "client/",
				APP  	 :  appPath,
				ASSETS 	 : "assets/",
					IMAGES 	: "assets/img/",
					STUB 		: "assets/stub/",
				COMPONENTS : appPath + "components/",
					LOGIN : appPath + "components/login/",
					DASHBOARD : appPath + "components/dashboard/",
					DRIVERS : appPath + "components/drivers/",
					NOTIFICATIONS : appPath + "components/notifications/",
					MENU 		: appPath + "components/menu/",
					PRELOADER : appPath + "components/preloader/"
		};
		
	})())
	
	.constant("EVENTS", (function(){
		return {
			/** 
			 *  @constant
			 *  @default 
			 */
			EVENT_DRIVER_ADDED: "driver_added",

			/** 
			 *  @constant
			 *  @default 
			 */
			EVENT_DRIVER_REMOVED: "driver_removed",

			/** 
			 *  @constant
			 *  @default 
			 */
			EVENT_ACCEL_ADDED: "accel_added",

			/** 
			 *  @constant
			 *  @default 
			 */
			EVENT_ACCEL_REMOVED: "accel_removed",

			/** 
			 *  @constant 
			 *  @default 
			 */
			EVENT_DECEL_ADDED: "decel_added",
			
			/** 
			 *  @constant 
			 *  @default 
			 */
			EVENT_DECEL_REMOVED: "decel_removed",

			/** 
			 *  @constant
			 *  @default 
			 */
			EVENT_STOP_ADDED: "stop_added",

			/** 
			 *  @constant
			 *  @default 
			 */
			EVENT_STOP_REMOVED: "stop_removed",

			/** 
			 *  @constant
			 *  @default 
			 */
			EVENT_STEADY_ADDED: "steady_added",

			/** 
			 *  @constant
			 *  @default 
			 */
			EVENT_STEADY_REMOVED: "steady_removed"
		};
	})())
	
	/*
	 * CONFIG: Main App
	 * 
	 * This config section configures the routing and sets the resource 
	 * white list to allow same origin resource loads or not
	 */
	.config(['$stateProvider', 
	         '$urlRouterProvider',
	         '$locationProvider',
	         'PATHS',
	         function($stateProvider,  
	        		  $urlRouterProvider,
	        		  $locationProvider,
	        		  PATHS) { // template routing
				
		$locationProvider.html5Mode(false).hashPrefix('!');
		
		$stateProvider
        .state('login', {
            url: '/login',
            views: {
            	'main': {
                    templateUrl: PATHS.LOGIN + 'loginView.html'
            	}
            }
        })
        .state('loading', {
            url: '/loading',
            views: {
            	'main': {
                    templateUrl: PATHS.PRELOADER + 'preloaderView.html'
            	}
            }
        })
        .state('dashboard', {
            url: '/dashboard',
            views: {
            	'main': {
                    templateUrl: PATHS.DASHBOARD + 'dashboardView.html'
            	},
            	'main.notifications@dashboard': {
        			templateUrl: PATHS.NOTIFICATIONS + 'notificationPartial.html'
        		}
            }
        })
        .state('dashboard.drivers', {
            url: '/drivers',
            views: {
            	'main.data': {
                    templateUrl: PATHS.DRIVERS + 'driversView.html'
            	}
            }
        })
        .state('dashboard.notifications', {
            url: '/notifications',
            views: {
            	'main.data': {
                    templateUrl: PATHS.NOTIFICATIONS + 'notificationsView.html'
            	}
            }
        })
        .state('dashboard.stats', {
            url: '/stats',
            views: {
            	'main.data': {
                    templateUrl: PATHS.DASHBOARD + 'statsPartial.html'
            	}
            }
        })
        .state('dashboard.map', {
            url: '/map',
            views: {
            	'main.data': {
                    templateUrl: PATHS.DASHBOARD + 'mapPartial.html'
            	}
            }
        });
		
		$urlRouterProvider.otherwise("/login");
		
	}])
	
	/*
	 * RUN: Main App
	 * 
	 * This decides whether or not to set the preloader, depending on IE
	 */
	.run(['$location',
	      '$rootScope',
	      '$state',
	      '$stateParams',
	      'PATHS',
	      function($location,
	    		   $rootScope,
	    		   $state,
	    		   $stateParams,
	    		   PATHS){


		//sets the state and state params to root for access when setting "active" tabs
		$rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        
		$rootScope.firebase = new Firebase(PATHS.FIREBASE);
        
		/**
         * @function App.$onMany 
         * @memberof App
         * @author Alex Boisselle
         * @param {array} events - a list of events to watch
         * @param {function} fn - a common callback for each of them
         * @description lets you bind to multiple event broadcasts in a clean way with a common callback fn
         * @fires $on
         */
		$rootScope.$onMany = function(events, fn) {
			for(var i = 0; i < events.length; i++) {
				this.$on(events[i], fn);
			}
	    };
		
		$location.path('/login');
	}])
	
	.controller('MainController', ['$rootScope',
	                               '$scope',
	                               '$state',
	                               'PreloaderService', 
	                               function($rootScope, 
	                            		    $scope,
	                            		    $state,
	                            		    PreloaderService){
	
		$scope.name = "MainController";
				
	}])
		
	.controller('HeaderController', ['$rootScope', function($rootScope){
		
	}]);
})();
/*jshint -W099*/
/**
 * Preloader Directives
 * @module /components/preloader/preloaderDirectives
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var preloaderDirectives = angular.module('Metric.components.preloader.directives', []);
	
})();
/*jshint -W099*/
/**
 * Example Module
 * @module /components/example/
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var preloaderModule = angular.module('Metric.components.preloader', [
	    'Metric.components.preloader.directives'
	]);
	
})();
/*jshint -W099*/
/**
 * Preloader Services
 * @module /components/preloader/preloaderServices
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var preloaderServices = angular.module('Metric.components.preloader.services', []);
	
})();
/*jshint -W099*/
/**
 * Dashboard Directives
 * @module /components/dashboard/dashboardDirectives
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var dashboardDirectives = angular.module('iMetric.components.dashboard.directives', [])
	
	.directive('highlighter', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
		    scope: {
		      model: '=highlighter'
		    },
		    link: function(scope, element) {
		    	
        		element.addClass('highlight-off');
        		
		    	scope.$watch('model', function (nv, ov) {
		    	   if (nv !== ov) {
		        		// apply class
		        		element.removeClass('highlight-off');
		        		element.addClass('highlight-on');

		          		// auto remove after some delay
		          		$timeout(function () {
		        	  		element.removeClass('highlight-on');
			        		element.addClass('highlight-off');
		          		}, 1000);
		        	}
		       });
		    }
	    };
	}]);
})();
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
/*jshint -W099*/
/**
 * Dashboard Services
 * @module /components/dashboard/gridServices
 * @namepsace DashboardServices
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var dashboardServices = angular.module('iMetric.components.dashboard.services', []);
	
})();
/*jshint -W099*/
/**
 * Drivers Directives
 * @module /components/drivers/driversDirectives
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var driversDirectives = angular.module('iMetric.components.drivers.directives', []);
	
})();
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
				
		var width = window.innerWidth * 0.8;
		
		if(width > 1000){
			width = 1000;
		}
		
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
				width: width,
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
		
		
		$scope.driverClickHandler = function(event){
			var el = event.currentTarget;
			
			if($($(el).parent()).hasClass('active')){
				$($(el).parent()).removeClass('active');
			} else {
				$($(el).parent()).addClass('active');
			}
		};
		
		$scope.driverSwipeUpHandler = function(event){
			var el = event.currentTarget;
			
			$($($(el).parent()).parent()).removeClass('active');
		};
		
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
/*jshint -W099*/
/**
 * Login Directives
 * @module /components/login/loginDirectives
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var loginDirectives = angular.module('iMetric.components.login.directives', []);
	
})();
/*jshint -W099*/
/**
 * Login Module
 * @module /components/login/
 * @namespace LoginControllers
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var loginModule = angular.module('iMetric.components.login', [
	    'iMetric.components.login.directives',
	    'iMetric.components.login.services'
	])
	
	
	.controller("LoginControllers", ["$scope", 
	                                "$rootScope", 
	                                "LoginService",
	                                "$state",
	                                function($scope, 
	                                		 $rootScope,
	                                		 LoginService,
	                                    	 $state){

		
		$scope.loggedIn = 0;
		
		/**
         * @function LoginControllers.authDataCallback 
         * @memberof LoginControllerss
         * @param {object} authData - Data returned by the login
         * @author Alex Boisselle
         * @description authentication callback fired once LoginService.login has returned the promise
         */
		$scope.authDataCallback = function(authData) {
			if (authData) {
				
				$scope.loggedIn = 1;
				
				setTimeout(function(){
					$state.go('loading');
				}, 300);
				
				$rootScope.currentUser = authData.uid;
				
			} else {
				
				console.log("User is logged out");

				$('.btn-signin').removeClass('active');
			}
		};
		
		/**
         * @function LoginControllers.attemptLogin
         * @memberof LoginControllers
         * @author Alex Boisselle
         * @description if the un and pw fields are entered, fire the login service
         * @fires LoginService.login
         */
		$scope.attemptLogin = function(){
						
			if($scope.user.email && $scope.user.password){
				
				$('.btn-signin').addClass('active');
				
				LoginService.login($scope.user.email, $scope.user.password);
			}
		};
		
		//test if user has session already going
		$rootScope.firebase.onAuth($scope.authDataCallback);
		
		//if the user has no logged in before, this is a fresh instance
		//add a listener to the loggedIn var to set the visibility of the form
		if(!$scope.loggedIn){
			$rootScope.$watch('loggedIn', function(value){
				if(value === 0 || !value){
					
					console.log("should show login form");
					
					$scope.loggedIn = 0;
					
				}
			});
		}
		
	}]);
})();
/*jshint -W099*/
/**
 * Login Services
 * @module /components/login/loginServices
 * @namespace LoginServices
 * @author Alex Boisselle
 * @date May 2015
 */

(function(){

	"use strict";
	
	var loginServices = angular.module('iMetric.components.login.services', [])
	
	.factory('LoginService', ['$q', 
	                          '$rootScope', 
                              function($q,
                            		   $rootScope){
		return {
			/**
             * @function LoginServices.login 
             * @memberof LoginServices
             * @param {string} un - username
             * @param {string} pw - password
             * @author Alex Boisselle
             * @description logs user into firebase
             * @returns Payload of user data
             */
            login: function(un, pw) {
            	                   	
                var loginDefer = $q.defer();
                
                if(un == "alex"){
                	console.log("it's me");
                } else {
                	console.log("it's not me");
                }
                
                $rootScope.firebase.authWithPassword({
                	email    : un,
                	password : pw
                }, function(error, authData) {
	            	if (error) {
	            		alert('Sorry, but your credentials are incorrect. Please try again.');

	    				$('.btn-signin').removeClass('active');
	            	} else {
	            		return true;
	            	}
                });
                	
                return loginDefer.promise;
            },
            
            /**
             * @function LoginServices.logout 
             * @memberof LoginServices
             * @author Alex Boisselle
             * @description sets rootscope login to false, which invokes a view change on login screen
             * @fires firebase.unauth
             */
            logout: function(){
            	
            	console.log("LOGOUT");
            	
            	$rootScope.loggedIn = "false";
            	
    			$rootScope.firebase.unauth();
    			
            }
        };
	}]);
	
})();
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

				if (!$rootScope.$$phase) { // i.e. first click after fetching from firebase
					/* jshint ignore:start */
	 					$rootScope.$apply(function () {
	 						_this.queue[uniqueId] = eventObj;
	 					});
	 					/* jshint ignore:end */
				}
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
/*jshint -W099*/
/**
 * Preloader Directives
 * @module /components/preloader/preloaderDirectives
 */

(function(){

	"use strict";
	
	var preloaderDirectives = angular.module('iMetric.components.preloader.directives', []);
	
})();
/*jshint -W099*/
/**
 * Preloader Module
 * @module /components/preloader/
 */

(function(){

	"use strict";
	
	var preloaderModule = angular.module('iMetric.components.preloader', [
	    'iMetric.components.preloader.directives',
	    'iMetric.components.preloader.services'
	])
	
	.controller("PreloaderController", ["$scope", 
	                                    "$rootScope", 
	                                    "PreloaderService",
	                                    "$state",
	                                    function($scope, 
	                                    		 $rootScope,
	                                    		 PreloaderService,
	                                    		 $state){
		
		$scope.greeting = "Preloader Module";
		
		$('body').addClass('loading');
		
		PreloaderService.start().then(function(data) {
			
			console.log("preloader complete, received this data: ");
			
			console.log(data);
			
			$scope.data = data;
			
			setTimeout(function(){
				$state.go('dashboard.notifications');
			}, 2000);
			
		}); 
		
	}]);
	
})();
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