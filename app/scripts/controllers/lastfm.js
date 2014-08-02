define(['app', 'd3'], function (app, GMaps, $) {
	'use strict';
	return app.controller('LastFMCtrl', ['$scope', 'lastfmService', 'graphService',
		function($scope, lastfmService, graphService){
			
			$scope.similar = function(){
				var getMatchingArtists = function(){
					console.log("getMatchingArtists");
					var promise = lastfmService.getArtistsByName({name: $scope.artist});
					return promise.then(function(data){
						var artists = data.results.artistmatches.artist;

						console.log("%s artists matched", artists.length);

						return artists;
					});
				}

				var pickFirstMatchingArtist = function(artists){
					console.log("pickFirstMatchingArtist");
					var firstArtist = null;
					angular.forEach(artists, function(_artist, idx){
						if(firstArtist == null){
							//console.log(_artist);
							if(_artist.mbid != "" && _artist.name != "Undefined"){
								firstArtist = _artist;
							}
						}
					});
					$scope.artist = firstArtist.name;
					return firstArtist;
				}



				var getSimilarArtists = function(artist){
					console.log("getSimilarArtists");
					var promise = lastfmService.getSimilarArtists({mbid: artist.mbid, name: artist.name});
					return promise.then(function(data){
						return {
							name: artist.name, 
							similars: data.similarartists.artist
						};
					});
				}


				var buildSimilarTree = function(root, similars){
					var tree = {
						name: root,
						children: []
					};
					
					angular.forEach(similars, function(similar, idx){
						tree.children.push({name: similar.name});
					});
					
					return tree
				};


				var buildTree = function(options){
					var rebuildTree =  function(d){ 
						$scope.artist = d.name;
						getSimilarArtists({name: d.name}).then(buildTree);
					}

					graphService.buildCircularTree({ 
						json: buildSimilarTree(options.name, options.similars),
						onclick: rebuildTree
					});
				}

				//chain of events
				getMatchingArtists()
					.then(pickFirstMatchingArtist)
					.then(getSimilarArtists)
					.then(buildTree);
			}
		
		}
	]);

});