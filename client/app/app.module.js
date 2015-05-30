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