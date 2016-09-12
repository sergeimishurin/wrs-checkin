'use strict';

angular.module('checkinApp')
  .controller('PracticeLoginCtrl', function ($rootScope, $scope, $state, AuthService) {
    $scope.user = {};
    $scope.errorMessage = '';

    $scope.login = function () {
      var credentials = {
        'grant_type': 'client_credentials',
        'client_id': '983266',
        'client_secret': 'sicJ0n7B8PQb7HRqWRnQGC64EDObDKqJ'
      };
      // var credentials = {
      //   'login': $scope.practice_credentials.username,
      //   'password': $scope.practice_credentials.password,
      // };

      AuthService.practiceLogin(credentials).then(function (response) {
        // $rootScope.practice_info = response.practice_info;

        //Temp Data
        $rootScope.practice_info = {};
        $rootScope.practice_info.address = '2004 Route 17M Goshen NY 10924-5210';
        $rootScope.practice_info.phone = '(845) 294-0661';
        $rootScope.practice_info.fax = '(845) 818-9646';
        $rootScope.practice_info.name = 'ENT Sspecialty Care';
        $rootScope.practice_info.logo = 'images/logo_ent_white.png'
        window.sessionStorage.setItem('practice_info', JSON.stringify($rootScope.practice_info));

        $state.go('welcome');
      }, function (response) {
          $scope.errorMessage = "Something goes wrong! Please try again later!";
      });
    };
  });
