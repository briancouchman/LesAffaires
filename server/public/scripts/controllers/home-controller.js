define(['app'], function (app) {
	'use strict';
	return app.controller('HomeCtrl', ['$scope','$upload', '$http', '$location', 'newspaperService', 'serverService', 'addressService',
        function($scope, $upload, $http, $location, newspaperService, serverService, addressService){
            console.log("Starting Home Controller");

            var config = {};
            serverService.getConfiguration().success(function(_config){
                config = _config;
            });

            var isInPalette = function(company){
                var isInPalette= false;

                var distrib = config.palette.distrib.split(",");
                   console.log(distrib);

                for(var i = 0; i < distrib.length; i++){
                    if(company.toLowerCase() ==  distrib[i].toLowerCase()){
                        isInPalette = true;
                        break;
                    }
                }

                return isInPalette;
            }



            var splitAddresses = function(addresses){
                $scope.paletteAddresses = [], 	$scope.shippingAddresses = [];

                angular.forEach(addresses, function(address, idx){
                    if(isInPalette(address.company)){
                        $scope.paletteAddresses.push(address)
                    }else{
                        $scope.shippingAddresses.push(address)
                    }
                });
            }


            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };


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
                //$files: an array of files selected, each file has name, size, and type.
                var $files = filesToUpload;
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    console.log("Uploading " + file.name);
                    $scope.upload = $upload.upload({
                        url: '/upload', //upload.php script, node.js route, or servlet url
                        // method: 'POST' or 'PUT',
                        // headers: {'header-key': 'header-value'},
                        // withCredentials: true,
                        data: {myObj: $scope.myModelObj},
                        file: file // or list of files: $files for html5 only
                        /* set the file formData name ('Content-Desposition'). Default is 'file' */
                        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                        //formDataAppender: function(formData, key, val){}
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);

                        $scope.date = data.date;
                        $scope.addresses = data.addresses;
                        addressService.cleanIncompleteAddresses($scope.addresses);

                        splitAddresses($scope.addresses);

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



            var calculateShippings = function(){
                $scope.shippings = [];

                $scope.shippingTotals = {
                    quantity: 0,
                    box15: 0,
                    box17: 0,
                    envT7: 0,
                    envT6: 0
                }

                angular.forEach($scope.shippingAddresses, function(address, idx){
                    serverService.calculateShipping(address, $scope.numberOfPages).success(function(shipping){
                        console.log("shipping " + shipping);

                        $scope.shippings.push(shipping);


                        //update totals
                        $scope.shippingTotals.quantity += parseInt(shipping.address.quantity);

                        for(var i=0; i < shipping.box15.length; i++){
                            $scope.shippingTotals.box15++;
                        }

                        for(var i=0; i < shipping.box17.length; i++){
                            $scope.shippingTotals.box17++;
                        }

                        for(var i=0; i < shipping.envT7.length; i++){
                            $scope.shippingTotals.envT7++;
                        }

                        for(var i=0; i < shipping.envT6.length; i++){
                            $scope.shippingTotals.envT6++;
                        }

                    });
                })

            }

            var calculatePalettes = function(){
                $scope.paletteBlocks = [];

                angular.forEach($scope.paletteAddresses, function(address, idx){
                    serverService.calculatePalette(address).success(function(palettes){

                        //Put on each palette, the edition date found on the input Excel, to print on the palettes sheet
                        angular.forEach(palettes, function (palette){
                            palette.date = $scope.date;
                        });

                        console.log(palettes);
                        $scope.paletteBlocks.push(palettes);
                    })
                });
            }

            $scope.calculate = function(){
                calculateShippings();
                calculatePalettes();
            }

            $scope.generateShippingLabels = function(){
                serverService.generateShippingLabels($scope.shippings).success(function(filename){
                    serverService.getPDF(filename, 1);
                });
            }

            $scope.generatePaletteLabels = function(){
                serverService.generatePaletteLabels($scope.paletteBlocks).success(function(filename){
                    serverService.getPDF(filename, 1);
                });
            }

            $scope.generateInvoice = function(){
                serverService.generateInvoice($scope.shippings).success(function(filename){
                    serverService.getPDF(filename);
                });
            }
            $scope.numberOfPages = 40;
        }
    ]);
});
