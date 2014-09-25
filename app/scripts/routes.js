define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
		//console.log("defining routes...");

		$routeProvider.when('/', {
			templateUrl: 'views/home.html',
			controller: "HomeCtrl"
		});


		$routeProvider.when('/config', {
			templateUrl: 'views/config.html',
			controller: 'ConfigCtrl'
		});

		$routeProvider.otherwise({redirectTo: '/'});

	}]);

});
