define(['app', 'gmaps'], function (app, GMaps, $) {
	'use strict';
	return app.controller('BikeCtrl', ['$scope','dataService',
		function($scope, dataService){
			var map = new GMaps({
				el: 'bike_map',
				lat: 45.55, 
				lng: -73.5667,
				zoom: 10,
				enableNewStyle: true,
				markerClusterer: function(map) {
					return new MarkerClusterer(map, [], {
						maxZoom: 12
					});
				}
			});
			/*var mapEl = document.getElementById('bikeMap');
			var map = new GMap(mapEl, {
				center: new google.maps.LatLng(45.55, -73.5667),
				zoom: 11,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			*/
			/*$scope.myMarkers = [];

			$scope.mapOptions = {
			  center: new google.maps.LatLng(45.56, -73.5643),
			  zoom: 15,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};*/


			var promise = dataService.getBikes();
			promise.then(function(stations){
				console.log(stations.length + " received");
				angular.forEach(stations, function(station, idx){
					map.addMarker({
						lat: station.LAT, 
						lng: station.LONG
					});
				});
			});
		}
	])
});