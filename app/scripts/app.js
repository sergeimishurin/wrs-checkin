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
    'angularMoment'
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
      });


    //$locationProvider.html5Mode(false);
  });
