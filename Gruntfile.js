module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.initConfig({
		  
		'pkg': grunt.file.readJSON('package.json'),
		
		'meta': {
		'jsFilesForTesting': [
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
		  ]
		},
		
		'karma': {
		  'development': {
		    'configFile': 'karma.conf.js',
		    'options': {
		      'files': [
		        '<%= meta.jsFilesForTesting %>',
		        'client/**/*.js'
		      ],
		    }
		  },
		  'dist': {
			  'options': {
		          'configFile': 'karma.conf.js',
		          'files': [
		            '<%= meta.jsFilesForTesting %>',
		            'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
		          ],
		       }
	      },
	      'minified': {
	          'options': {
	            'configFile': 'karma.conf.js',
	            'files': [
	              '<%= meta.jsFilesForTesting %>',
	              'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js'
	            ],
	         }
	       }
		},
		
		'jshint': {
			'beforeconcat': ['client/**/*.js'],
			'options': {
				'smarttabs': true
			}
		},
		
		'concat': {
		    'dist': {
		      'src': ['client/**/*.js'],
		      'dest': 'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
		    }
		},
		
		'uglify': {
			'options': {
		      'mangle': false
		    },  
		    'dist': {
		      'files': {
		        'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.namelower %>-<%= pkg.version %>.js']
		      }
		    }
		},
		'jsdoc': {
			'src': ['client/**/*.js'],
			'options': {
				'destination': 'doc'
			}
		}
	});
	
	//the 'test' task is used to run the unit tests
	grunt.registerTask('test', ['karma:development']);
	
	//the 'compile' task is used to simply compile the code into the dist folder for development
	grunt.registerTask('compile', [
	  'jshint',
	  'concat'
	]);
	
	grunt.registerTask('build', [
      'jshint',
      'concat',
      'uglify',
      'jsdoc'
    ]);
	
	//the 'build' task lints, tests, concats, tests, minifies, tests and then builds the docs
	grunt.registerTask('build-test',
	[
	  'jshint',
	  'karma:development',
	  'concat',
      'karma:dist',
	  'uglify',
      'karma:minified',
      'jsdoc'
	]);
  
};