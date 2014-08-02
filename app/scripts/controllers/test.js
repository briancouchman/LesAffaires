define(['app', 'gmaps', 'jquery', 'jqplot',], function (app, GoogleMap, $) {
	'use strict';
	return app.controller('TestCtrl', ['$scope',
			function($scope){
				console.log("Starting controller TestCtrl");
				$scope.greeting="Hola!";

				$("#output").html("Yeah");

				var mapEl = document.getElementById('map');
				new GoogleMap(mapEl);

				$.jqplot('plot',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]]);
			}
	])
});