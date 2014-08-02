define(['app', 'gmaps', 'jquery'], function (app, GMaps, $) {
	'use strict';
	return app.controller('LocataireMapCtrl', ['$scope', 'locService',
		function($scope, locService){
			
			var map = new GMaps({
				el: 'map',
				lat: 45.55, 
				lng: -73.5667,
				zoom: 10,
				enableNewStyle: true,
				/*markerClusterer: function(map) {
					return new MarkerClusterer(map, [], {
						maxZoom: 12
					});
				}*/
			});



			var promise = locService.getLocations();
			promise.then(function(locations){
				console.log(locations.length + " received");
				angular.forEach(locations, function(loc, idx){
					console.log(loc.geo.lat + " / " + loc.geo.long);
					map.addMarker({
						lat: loc.geo.lat, 
						lng: loc.geo.long
					});
				});
			});
		
			
		}
	])
});