define(['angular', 'app'], function(angular, app) {
	//console.log("Defining services");
	return app.service('lastfmService', function($http, $q){
		//console.log("Starting service");
		
		var server = "http://ws.audioscrobbler.com/2.0/";
		var key = "85db691149b9f4f75d72f34f9f16f620";

		var format = "&format=json"


		var _get = function(url){
			var deferred = $q.defer();
			
			$http.get(url)
				 .success(function(data){
					deferred.resolve(data);
				 }).error(function(data){
					deferred.reject(data.message)	
				 });

			return deferred.promise;
		}



		/**
		 * 
		 */
		this.getArtistsByName = function(options){

			var url = server + "?" + "method=artist.search" + "&api_key=" + key + format
			
			if(typeof options.name === "undefined"){
				throw new Error("Artist name must be define as {name: 'artist name'}");
			}
			url += "&artist=" + options.name;
			
			if(typeof options.limit !== "undefined"){
				url += "&limit=" + limit;
			}

			return _get(url);
		};



		/**
		 * 
		 */
		this.getSimilarArtists = function(options){
			//console.log("Getting " + server + "/velo/signalisation");

			var url = server + "?" + "method=artist.getSimilar" + "&api_key=" + key + format;
			
			if(typeof options.mbid !== "undefined"){
				url += "&mbid=" + options.mbid;
			}else
			if(typeof options.name !== "undefined"){
				url += "&artist=" + options.name;
			}
			
			if(typeof options.limit !== "undefined"){
				url += "&limit=" + limit;
			}

			return _get(url);
		}
	});
});