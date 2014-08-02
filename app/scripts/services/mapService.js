define(['angular', 'gmaps', 'app'], function(angular, GMaps, app) {
	//console.log("Defining services");
	return app.service('mapService', function($http, $q){
		console.log("Starting mapService");

		var icons = {
			"green" : "/images/marker_green.png",
			"blue" : "/images/marker_blue.png",
			"pink" : "/images/marker_pink.png"
		}

		this.initMap = function(options){
			return new GMaps(options);
		};

		this.addGreenMarker = function(map, options){
			options.icon = "green";
			this.addMarker(map, options);
		}

		this.addBlueMarker = function(map, options){
			options.icon = "blue";
			this.addMarker(map, options);
		}

		this.addPinkMarker = function(map, options){
			options.icon = "pink";
			this.addMarker(map, options);
		}


		this.addMarker = function(map, options){
			map.addMarker({
				lat: options.latitude, 
				lng: options.longitude,
				title: options.title,
				icon: icons[options.icon]
			});
		}

	
	});
});