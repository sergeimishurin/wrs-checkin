'use strict';

/**
 * @ngdoc function
 * @name checkinApp.controller:PracticeloginCtrl
 * @description
 * # PracticeloginCtrl
 * Controller of the checkinApp
 */
angular.module('checkinApp')
  .controller('PracticeLoginCtrl', function ($scope, $state, AuthService) {
    $scope.user = {};

    $scope.login = function(){

      var credentials = {
        'grant_type': 'client_credentials',
        'client_id': '983266',
        'client_secret': 'sicJ0n7B8PQb7HRqWRnQGC64EDObDKqJ'
      };

      AuthService.practiceLogin(credentials).then(function(response) {
        $state.go('welcome');
      }, function(response) {

      });
    };
  });
