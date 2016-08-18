'use strict';

/**
 * @ngdoc service
 * @name checkinApp.auth/events
 * @description
 * # auth/events
 * Constant in the checkinApp.
 */
angular.module('checkinApp')
  .constant('AuthEvents',{
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })

  .constant('ErrorEvents', {
    notFound: 'page-not-found'
  });
