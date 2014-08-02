define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
		//console.log("defining routes...");
		
		$routeProvider.when('/', {
			templateUrl: 'views/home.html',
			controller: "HomeCtrl"
		});

		$routeProvider.when('/espace_proprio/:proprio_id', {
			templateUrl: 'views/esp_prop.html',
			controller: 'ProprietaireCtrl'
		});

		$routeProvider.when('/search/', {
			templateUrl: 'views/search.html',
			controller: 'SearchCtrl'
		});

		$routeProvider.otherwise({redirectTo: '/'});
		
	}]);

});