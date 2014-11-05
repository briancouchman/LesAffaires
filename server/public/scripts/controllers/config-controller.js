define(['app'], function (app) {
	'use strict';
	return app.controller('ConfigCtrl', ['$scope', 'serverService',
      function($scope, serverService){
        console.log("Starting Config Controller");

				//$scope.isActive = function (viewLocation) {
				//	return viewLocation === $location.path();
			//	};



        serverService.getConfiguration().success(function(config){
			$scope.config = config;
		})



				$scope.saveConfig = function(){

					serverService.saveConfiguration($scope.config).success(function(config){
						console.log("Successfully saved");
						$scope.successMessage = "La configuration a ete sauvegardee";
					});

				}
			}
  ]);
});
