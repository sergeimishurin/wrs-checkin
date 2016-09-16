'use strict';

/**
 * @ngdoc function
 * @name checkinApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the checkinApp
 */
angular.module('checkinApp')
  .controller('ReturnDeviceCtrl', function ($timeout, $state) {
    $timeout(function () {
      $state.go('practice');
    }, 15000);
  });
