define(['angular', 'app'], function(angular, app) {
  //console.log("Defining services");
  return app.service('serverService', function($http, $q){
    console.log("Starting serverService");

    this.generatePDF = function(list, callback){
      var promise = $http.post('http://localhost:5000/pdf', list)
      promise.success(function(data, status, headers, config) {
        callback.call(this, data);
        console.log("File name generated : " + data);
      }).error(function(data, status, headers, config) {
        console.log("ooops");
      });
    }
  });
});
