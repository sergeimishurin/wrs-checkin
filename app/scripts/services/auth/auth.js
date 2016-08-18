'use strict';

/**
 * @ngdoc service
 * @name checkinApp.auth/auth
 * @description
 * # auth/auth
 * Service in the checkinApp.
 */
angular.module('checkinApp')
  .service('AuthService',  function ($http, ENV) {

    var patientLogin = function(credentials) {
      return $http
        .post(ENV.apiEndpoint + "/client/patient/checkin-login", credentials)
        .then(function(res) {
          window.sessionStorage.setItem('patient_id', res.data.id);
        });
    };

    var practiceLogin = function(credentials) {
      return $http
        .post(ENV.apiEndpoint + "/oauth/token", credentials)
        .then(function(res) {
          window.sessionStorage.setItem('access_token', res.data.access_token);
        });
    };

    return {
      patientLogin: patientLogin,
      practiceLogin: practiceLogin,
    };
  });
