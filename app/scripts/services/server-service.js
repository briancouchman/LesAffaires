define(['angular', 'app'], function(angular, app) {
  //console.log("Defining services");
  return app.service('serverService', function($http, $q){
    console.log("Starting serverService");

    /**
     * Sends a list of addresses t the server, so that a PDF is generated
     * with the right format and with theses addresses on
     * @param list an array of addresses
     * @param callback the function to be executed when the server returns the response successfully
     * @return returns the promise created for the http call 
     */
    this.generatePDF = function(list, callback){
      var promise = $http.post('http://localhost:5000/pdf', list)
      promise.success(function(data, status, headers, config) {
        callback.call(this, data);
        console.log("File name generated : " + data);
      }).error(function(data, status, headers, config) {
        console.log("PDF generation failed. Error " + status);
      });
      return promise;
    }
  });
});
