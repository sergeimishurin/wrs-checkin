'use strict';

/**
 * @ngdoc directive
 * @name checkinApp.directive:patientHeader
 * @description
 * # patientHeader
 */
angular.module('checkinApp')
  .directive('patientHeader', function ($location) {
    return {
      templateUrl: 'views/pages/patient/components/header.html',
      restrict: 'E',
      scope:{
        title:"@",
        info:"@info",
        image:"@image"
      },
      link: function(scope){
        scope.patientLogout = function(){
          $location.path('welcome');
        }
      }
    };
  });
