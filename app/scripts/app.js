'use strict';

/**
 * @ngdoc overview
 * @name checkinApp
 * @description
 * # checkinApp
 *
 * Main module of the application.
 */
angular
  .module('checkinApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'config',
    'angularMoment',
    'ui.bootstrap',
    'ui.mask',
    'as.sortable',
    'ngMessages'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/practice-login');

    $stateProvider
      .state('practice', {
        url: '/practice-login',
        templateUrl: 'views/auth/practice-login.html',
        controller: 'PracticeLoginCtrl'
      })
      .state('patient', {
        url: '/patient-login',
        templateUrl: 'views/pages/patient/main.html',
        controller: 'PatientCtrl'
      })
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'views/pages/welcome.html'
      })
      .state('return', {
        url: '/return-device',
        templateUrl: 'views/pages/return.html'
      });
    //$locationProvider.html5Mode(false);\

  }).run(function ($rootScope, $location) {
  var practice_info = window.sessionStorage.getItem('practice_info');

  var emptyEvent = new Event("empty");


  if (practice_info == null) {
    $location.path('practice');
  } else {
    $rootScope.practice_info = JSON.parse(practice_info)
  }
});
