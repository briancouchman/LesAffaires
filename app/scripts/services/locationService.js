define(['angular', 'app'], function(angular, app) {
	//console.log("Defining services");
	return app.service('locationService', function($http, $q){
		console.log("Starting locationService");

		var server = "http://localhost:8080/api"

		this.getLocations = function(proprio_id){
			var url = server + "/owner/" + proprio_id + "/properties";

			var deferred = $q.defer();
			$http.get(url)
				 .success(function(data){
					deferred.resolve(data);
				 }).error(function(data){
					deferred.reject(data)	
				 });
			return deferred.promise;
		};



		
		this.getAllLocations = function(){
			var url = server + "/properties";

			var deferred = $q.defer();
			$http.get(url)
				 .success(function(data){
					deferred.resolve(data);
				 }).error(function(data){
					deferred.reject(data)	
				 });
			return deferred.promise;
		};


		this.getLocationById = function(id, locations){
			var _location = null;
			angular.forEach(locations, function(_loc, idx){
				if(_location == null && _loc.id == id){
					_location = _loc;
				}
			});
			return _location;
		}

	});
});