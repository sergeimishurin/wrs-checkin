'use strict';

/**
 * @ngdoc service
 * @name checkinApp.state
 * @description
 * # state
 * Factory in the checkinApp.
 */
angular.module('checkinApp')
  .factory('States', function ($resource, ENV) {
    return $resource(ENV.apiEndpoint + '/client/states', {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });
