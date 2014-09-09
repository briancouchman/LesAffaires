define(['app'], function (app) {
	'use strict';
	return app.controller('HomeCtrl', ['$scope','$upload', '$http', 'newspaperService', 'serverService', 'addressService',
            function($scope, $upload, $http, newspaperService, serverService, addressService){
                console.log("Starting Home Controller");

                var filesToUpload;
								$scope.addresses = [];
								$scope.uploadError = null;
                $scope.onFileSelect = function($files) {
                    filesToUpload = $files;
                    for (var i = 0; i < $files.length; i++) {
                        var file = $files[i];
                        console.log(file.name + " selected");
                    }
                }

                $scope.uploadFile = function(){
										console.debug("upload");
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
                      }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
												$scope.addresses = data.addresses;
												addressService.cleanIncompleteAddresses($scope.addresses);

												$scope.uploadError = null;
												if($scope.addresses.length == 0){
													$scope.uploadError = "Le ficher selectionne ne contient aucune addresse. Verifiez les fichier et reessayez.";
												}
                      }).error(function(data, status, headers, config) {
												console.log(data);
												$scope.uploadError = "Le fichier séléctionné est invalide. Seuls les fichiers Excel sont acceptés";
											});
                    }
                    /* alternative way of uploading, send the file binary with the file's content-type.
                       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
                       It could also be used to monitor the progress of a normal http post/put request with large data*/
                    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
                  };

									$scope.calculateShippings = function(){
										$scope.shippings = [];

										$scope.totals = {
											quantity: 0,
											box15: 0,
											box17: 0,
											envT7: 0,
											envT6: 0
										}

										angular.forEach($scope.addresses, function(address, idx){
											serverService.calculateShipping(address, $scope.numberOfPages, function(shipping){
												console.log("shipping " + shipping);
												$scope.shippings.push(shipping);

												//update totals
												$scope.totals.quantity += parseInt(address.quantity);
												$scope.totals.box15 += shipping.box15;
												$scope.totals.box17 += shipping.box17;
												$scope.totals.envT7 += shipping.envT7;
												$scope.totals.envT6 += shipping.envT6;

											});
										})

									}



									$scope.generateLabels = function(){
										serverService.generateLabels($scope.shippings, function(filename){
											$scope.labelsFilename = filename
										})
									}

									$scope.generateInvoice = function(){
										serverService.generateInvoice($scope.shippings, function(filename){
											$scope.invoiceFilename = filename
										})
									}


							$scope.numberOfPages = 40;
						}
       ]);
});
