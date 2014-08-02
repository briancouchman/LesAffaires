define(['app', 'gmaps', 'jquery'], function (app, GMaps, $) {
	'use strict';
	return app.controller('ProprietaireCtrl', ['$scope', '$routeParams', 'locationService', 
		function($scope, $routeParams, locationService){
			//Initialize map
			var map = new GMaps({
				el: 'map_proprio',
				lat: 45.55, 
				lng: -73.6967,
				zoom: 11,
				enableNewStyle: true
			});

			var proprio_id = $routeParams.proprio_id;
			$scope.locations =
				locationService.getLocations(proprio_id).then (function(result){
					$scope.locations = result;
					angular.forEach($scope.locations, function(_location, idx){
						console.log(_location);
						map.addMarker({
							lat: _location.address.latitude, 
							lng: _location.address.longitude
						});
					});
				});


			$scope.selectLocation = function(id){
				console.log("id=" + id);
				$scope.locationSelected = locationService.getLocationById(id, $scope.locations);
				console.log("$scope.locationSelected=" + $scope.locationSelecte);

				$("html, body").animate({ scrollTop: $(document).height() }, 500);
			};

			$scope.locationSelected = false;
		}
	])
});