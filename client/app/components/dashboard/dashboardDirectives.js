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