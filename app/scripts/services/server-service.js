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
    this.generateLabels = function(list){
      return $http.post(server + '/labels', list).error(function(data, status, headers, config) {
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
  });
});
