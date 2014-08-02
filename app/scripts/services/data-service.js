define(['angular', 'app'], function(angular, app) {
	//console.log("Defining services");
	return app.service('dataService', function($http, $q){
		//console.log("Starting service");
		
		var server = "http://localhost:3000";
		this.getBikes = function(){
			var deferred = $q.defer();
			//console.log("Getting " + server + "/velo/signalisation");
			$http.get(server + "/velo/signalisation")
				 .success(function(data){
					deferred.resolve(data);
				 }).error(function(data){
					deferred.reject(data)	
				 });
			return deferred.promise;
		}
	});
});