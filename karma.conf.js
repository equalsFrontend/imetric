module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    files: [
		'bower_components/jquery/dist/jquery.js',
		
		'bower_components/angular/angular.js',
		'bower_components/angular-animate/angular-animate.js',
		'bower_components/angular-mocks/angular-mocks.js',
		'bower_components/angular-route/angular-route.js',
		'bower_components/angular-hotkeys/angular-hotkeys.js',
		'bower_components/angular-sanitize/angular-sanitize.js',
		'bower_components/angular-ui-router/release/angular-ui-router.js',
		
		'bower_components/underscore/underscore.js',

		'bower_components/firebase/firebase.js',
		
		'bower_components/highcharts/highcharts.js',
		'bower_components/highcharts/modules/exporting.js',
		'bower_components/highcharts/modules/exporting-csv.js',
		'bower_components/highcharts-ng/src/highcharts-ng.js',
		
		'bower_components/lodash/lodash.js',

		'client/**/*.js',
		'test/**/*Spec.js'
	],
    
    // list of files to exclude
    exclude: [
    
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};