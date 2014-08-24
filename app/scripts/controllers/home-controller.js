define(['app'], function (app) {
	'use strict';
	return app.controller('HomeCtrl', ['$scope','$upload', '$http', '$location', 'newspaperService', 'serverService',
            function($scope, $upload, $http, $location, newspaperService, serverService){
                console.log("Starting Home Controller");

                var filesToUpload;
								$scope.addresses = [];
                $scope.onFileSelect = function($files) {
                    filesToUpload = $files;
                    for (var i = 0; i < $files.length; i++) {
                        var file = $files[i];
                        console.log(file.name + " selected");
                    }
                }

                $scope.upload = function(){
                    //$files: an array of files selected, each file has name, size, and type.
                   var $files = filesToUpload;
                   for (var i = 0; i < $files.length; i++) {
                      var file = $files[i];
                      console.log("Uploading " + file.name);
                      $scope.upload = $upload.upload({
                        url: 'http://localhost:5000/upload', //upload.php script, node.js route, or servlet url
                        // method: 'POST' or 'PUT',
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {myObj: $scope.myModelObj},
                        file: file, // or list of files: $files for html5 only
                        /* set the file formData name ('Content-Desposition'). Default is 'file' */
                        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                        //formDataAppender: function(formData, key, val){}
                      }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                      }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
												$scope.addresses = data.addresses;
                      });
                      //.error(...)
                      //.then(success, error, progress);
                      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
                    }
                    /* alternative way of uploading, send the file binary with the file's content-type.
                       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
                       It could also be used to monitor the progress of a normal http post/put request with large data*/
                    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
                  };




							$scope.numberOfPages = 0;
							$scope.thresholdForBoxes = -1;
							$scope.thresholdForLetters = -1;

							$scope.calculateThresholds = function(){
								var itemWeight = newspaperService.getNewspaperWeight($scope.numberOfPages);
								$scope.thresholdForBoxes = 	newspaperService.getThresholdForBoxes(itemWeight);
								$scope.thresholdForLetters = newspaperService.getThresholdForLetters();
							}

							$scope.fitsInABox = function (item) {
						    return item.quantity <= $scope.thresholdForBoxes && item.quantity > $scope.thresholdForLetters;
						  };
							$scope.fitsInALetter = function (item) {
								return item.quantity <= $scope.thresholdForLetters;
							};


							$scope.generateBoxes = function(){
								var list = [];
								angular.forEach($scope.addresses, function(address, idx){
									if(newspaperService.fitsInABox(address, $scope.thresholdForBoxes, $scope.thresholdForLetters)){
										list.push(address);
									}
								});
								serverService.generatePDF(list, function(filename){ $scope.boxesPDFFilename = filename});
							}

							$scope.generateLetters = function(){
								var list = [];
								angular.forEach($scope.addresses, function(address, idx){
									if(newspaperService.fitsInALetter(address, $scope.thresholdForLetters)){
										list.push(address);
									}
								});
								serverService.generatePDF(list, function(filename){ $scope.lettersPDFFilename = filename});
							}

							$scope.showPDF = function(filename){
								console.log(filename);
								$location.path = "http://localhost:5000/pdf/" + filename;
							}
					}

       ]).filter('fitsInABox', ['newspaperService'], function(newspaperService) {
				return function(item) {
					return newspaperService.fitsInABox(item, $scope.thresholdForBoxes, $scope.thresholdForLetters);
				}
			}).filter('fitsInALetter', ['newspaperService'], function(newspaperService) {
				return function(item) {
					return newspaperService.fitsInALetter(item, $scope.thresholdForLetters);
				}
			}).filter('fitsInAMono', ['newspaperService'], function(newspaperService) {
				return function(item) {
					return newspapaerService.fitsInAMono(item, $scope.thresholdForBoxes);
				}
			});
});
