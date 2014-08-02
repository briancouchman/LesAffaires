define(['angular', 'app'], function(angular, app) {
	//console.log("Defining services");
	return app.service('googleService', function($http, $q){
		//console.log("Starting service");

		var apiKey = "AIzaSyBvAezal1D_pk_234E84zNsN8VQGNBnkL8";
		
		var googleApi = "http://maps.googleapis.com/maps/api/geocode/json?key=" + apiKey + "&";

		this.getLatLong = function(address){
			var deferred = $q.defer();
			//console.log("Getting " + server + "/velo/signalisation");
			var parameters = "adress=" + encodeURIComponent(address);
			console.log("calling " + googleApi + parameters);
			$http.get(googleApi + parameters)
				 .success(function(data){
					var results = data.results;
					if(data.status == "OK"){
						deferred.resolve(results[0].geometry.location);
					}else{	
						deferred.reject(data);
					}
				 }).error(function(data){
					deferred.reject(data)	
				 });
			return deferred.promise;
		}
	});
});