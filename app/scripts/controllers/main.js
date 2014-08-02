define(['app'], function (app) {
	'use strict';
	return app.controller('HomeCtrl', ['$scope', '$location',
		function($scope, $location){
			console.log("Initializing Main controller");

			$scope.proprioId = 1;

			$scope.showProprioId = false;


			$scope.showInputText = function(){
				$scope.showProprioId = true;
			}

			$scope.goToProprio = function(){
				$location.path('/espace_proprio/' + $scope.proprioId)
			}

			$scope.goToSearch = function(){
				$location.path('/search')
			}
		}
	]);
});