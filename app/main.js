require.config({
	baseUrl: "scripts",
	paths: {
		angular: '../bower_components/angular/angular',
		angularRoute: '../bower_components/angular-route/angular-route',
		angularMocks: '../bower_components/angular-mocks/angular-mocks',
                angularFileUpload: '../bower_components/ng-file-upload/angular-file-upload',
		jquery: '../bower_components/jquery/dist/jquery',
		'bootstrap' : '../bower_components/bootstrap/dist/js/bootstrap'
	},
	shim: {
		'angular' : {
                    deps: [],
                    'exports' : 'angular'
                },
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		},
                'angularFileUpload': {
                    deps: ['angular'],
                    'exports': 'angular-file-upload'
                }, 
                
		'bootstrap': {
			deps:['jquery'],
			'exports':'bootstrap'
		}
	},
	priority: [
                "angular-file-upload-shim",
		"angular",
                "angular-file-upload"
	]
});

require( [
	'angular',
	'angularRoute',
        'angularFileUpload',
	'app',

	/*'services/',*/

	'controllers/home-controller',

	'routes'
], function(angular, app, routes) {
	'use strict';
	angular.bootstrap(document, ['showcase']);
});


require( ['bootstrap'], function(){});