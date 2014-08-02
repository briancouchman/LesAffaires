define(['app', 'facebook', 'jquery'], function (app, FB, $) {
	'use strict';
	return app.controller('FacebookCtrl', ['$scope',
		function($scope){
			FB.init({
				appId      : '1443942939179765',
				status     : true, // check login status
				cookie     : true, // enable cookies to allow the server to access the session
				xfbml      : true  // parse XFBML
			});
			
			
			var loginBtn = $('#login');
			var logoutBtn = $('#logout');
			$scope.username = "nobody";

			var updateName = function(username){
				console.log("changing username to : " + username);
				$scope.username = username;
			}



			$('#login').click(function(event){
				FB.login(function(response) {
					if (response.authResponse) {
						console.log('Welcome!  Fetching your information.... ')
						FB.api('/me', function(response) {
							console.log('Good to see you, ' + response.name + '.');
							updateName(response.name);
						});
						loginBtn.hide();
						logoutBtn.show();
					} else {
						console.log('User cancelled login or did not fully authorize.');
					}
				 });
			});

			$('#logout').click(function(event){
				FB.logout(function(response) {
					loginBtn.show();
					logoutBtn.hide();
				});
			});
			
			FB.getLoginStatus(function(response) {
				console.log(response);
				if(response.status == "connected"){
					loginBtn.hide();
					logoutBtn.show();
					FB.api('/me', function(response) {
						console.log('Good to see you, ' + response.name + '.');
					});
				} else {
					loginBtn.show();
					logoutBtn.hide();
				}
			});
		 
		}
	])
});