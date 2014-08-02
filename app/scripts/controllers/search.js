define(['app','jquery'], function (app, $) {
	'use strict';
	return app.controller('SearchCtrl', ['$scope', '$routeParams', 'locationService', 'mapService',
		function($scope, $routeParams, locationService, mapService){
			//Initialize map
			var map = mapService.initMap({
				el: 'map_search',
				lat: 45.55, 
				lng: -73.6967,
				zoom: 11,
				enableNewStyle: true
			});

			$scope.locations =
				locationService.getAllLocations().then (function(result){
					$scope.locations = result;
					angular.forEach($scope.locations, function(_location, idx){
						console.log(_location);

						var map_options = {
							latitude: _location.address.latitude, 
							longitude: _location.address.longitude,
							title: _location.address.civicNumber + " " + _location.address.streetName
						};
						if(_location.bedroomCount == 2){
							mapService.addGreenMarker(map, map_options);
						}
						if(_location.bedroomCount == 3){
							mapService.addBlueMarker(map, map_options);
						}
						if(_location.bedroomCount > 4){
							mapService.addPinkMarker(map, map_options);
						}
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