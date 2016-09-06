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
          return res.data;
        });
    };

    // var practiceLogin = function(credentials) {
    //   return $http({
    //     method: 'POST',
    //     url: "https://dev56.waitingroomsolutions.com/~thovhannisyan/master/practice_new/checkinPracticeLogin.php",
    //     data: $.param(credentials),
    //     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    //   }).then(function(res) {
    //     window.sessionStorage.setItem('access_token', res.data.access_token);
    //     return res.data;
    //   });
    // };

    var practiceLogin = function(credentials) {
      return $http
        .post(ENV.apiEndpoint + "/oauth/token", credentials)
        .then(function(res) {
          window.sessionStorage.setItem('access_token', res.data.access_token);
          return res.data;
        });
    };

    return {
      patientLogin: patientLogin,
      practiceLogin: practiceLogin,
    };
  });
