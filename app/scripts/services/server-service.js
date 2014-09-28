define(['angular', 'app'], function(angular, app) {
  //console.log("Defining services");
  return app.service('serverService', function($http, $q){
    console.log("Starting serverService");

    var server = "http://localhost:5000";

    /**
     * Sends a list of addresses t the server, so that a PDF is generated
     * with the right format and with theses addresses on
     * @param list an array of addresses
     * @param callback the function to be executed when the server returns the response successfully
     * @return returns the promise created for the http call
     */
    this.generateShippingLabels = function(list){
      return $http.post(server + '/shippings/labels', list).error(function(data, status, headers, config) {
        console.log("PDF generation failed. Error " + status);
      });
    },

    this.generatePaletteLabels = function(list){
      return $http.post(server + '/palettes/labels', list).error(function(data, status, headers, config) {
        console.log("PDF generation failed. Error " + status);
      });
    },

    this.generateInvoice = function(list){
      return $http.post(server + '/invoice', list).error(function(data, status, headers, config) {
        console.log("PDF generation failed. Error " + status);
      });
    },


    this.calculateShipping = function(address, pages){
      return $http.post(server + '/shipping/' + pages, address).error(function(data, status, headers, config) {
        console.log("Shiping generation failed. Error " + status);
      });
    }

    this.calculatePalette = function(address){
      return $http.post(server + '/palettes', address).error(function(data, status, headers, config) {
        console.log("Palette generation failed. Error " + status);
      });
    }

    this.getConfiguration = function(){
      return $http.get(server + "/config").error(function(data, status, headers, config){
        console.log("Error getting the configuration from the server.");
      })
    }

    this.saveConfiguration = function(config){
      return $http.post(server + "/config", config).error(function(data, status, headers, config){
        console.log("Error sending the configuration from the server.");
      })
    }
  });
});
