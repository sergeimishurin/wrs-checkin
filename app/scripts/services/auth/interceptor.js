'use strict';

/**
 * @ngdoc service
 * @name checkinApp.auth/interceptor
 * @description
 * # auth/interceptor
 * Factory in the checkinApp.
 */
angular.module('checkinApp')
  .factory('auth/interceptor', function ($rootScope, $q, AuthEvents, ErrorEvents, $location, ENV) {

    return {
      // optional method
      'request': function (config) {

        if(config.url.indexOf(ENV.apiEndpoint) !== -1 && ($location.path() !== '/practice-login' || config.url.indexOf('/client/primary-location') !== -1) ) {
          config.url = config.url + (config.url.indexOf('?') === -1 ? '?' : '&') + 'access_token=' + window.sessionStorage.access_token;
        }

        return config;
      },

      // optional method
      'requestError': function (rejection) {
        // do something on error
        //if (canRecover(rejection)) {
        //  return responseOrNewPromise
        //}
        return $q.reject(rejection);
      },

      // optional method
      'response': function (response) {
        // do something on success
        return response;
      },

      // optional method
      'responseError': function (rejection) {
        $rootScope.$broadcast({
          401: AuthEvents.notAuthenticated,
          403: AuthEvents.notAuthorized,
          404: ErrorEvents.notFound,
          419: AuthEvents.sessionTimeout,
          440: AuthEvents.sessionTimeout
        }[rejection.status], rejection);

        return $q.reject(rejection);
      }
    };
  }).config(function ($httpProvider) {
  $httpProvider.interceptors.push('auth/interceptor');
});
