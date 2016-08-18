'use strict';

/**
 * @ngdoc function
 * @name checkinApp.controller:PatientCtrl
 * @description
 * # PatientCtrl
 * Controller of the checkinApp
 */
angular.module('checkinApp')
  .controller('PatientCtrl', function ($scope, AuthService) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var today = new Date();

    var format_time = function (date_obj) {
      var hour = date_obj.getHours();
      var minute = date_obj.getMinutes();
      var amPM = (hour > 11) ? "pm" : "am";
      if (hour > 12) {
        hour -= 12;
      } else if (hour == 0) {
        hour = "12";
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      return hour + ":" + minute + ' ' + amPM;
    }

    $scope.today = {
      date: monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear(),
      time: format_time(today)
    };

    $scope.patientLogin = function(userdata){
       var credentials = {
        "first_name_initial": 'a',
        "last_name": 'test',
        "date_of_birth": '01/01/1990',
       };

      AuthService.patientLogin(credentials).then(function(response) {
        $scope.nextStep();
      }, function(response) {
      //  $scope.nextStep();
      });
    };

    $scope.steps = [
      {title: 'Step 1 Log in', passed: 0, active: 1},
      {title: 'Step 2 Patient Profile', passed: 0, active: 0},
      {title: 'Step 3 Pharmacy', passed: 0, active: 0},
      {title: 'Step 4 Co-Pay', passed: 0, active: 0},
      {title: 'Step 5 Finished', passed: 0, active: 0}
    ];

    $scope.currentStep = 0;

    $scope.nextStep = function () {
      var _count = $scope.steps.length;
      for (var i = 0; i < _count; i++) {
        if ($scope.steps[i].active === 0) {
          $scope.steps[i - 1].passed = 1;
          $scope.steps[i].active = 1;
          $scope.currentStep = i;
          break;
        }
      }
    };

    $scope.backStep = function () {
      for (var i = $scope.steps.length - 1; i > 0; i--) {
        if ($scope.steps[i].active === 1) {
          $scope.steps[i].active = 0;
          $scope.steps[i].passed = 0;
          $scope.steps[i - 1].passed = 0;
          $scope.steps[i - 1].active = 1;
          $scope.currentStep = i - 1;
          break;
        }
      }
    };


  });
