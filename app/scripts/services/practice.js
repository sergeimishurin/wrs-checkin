'use strict';

/**
 * @ngdoc service
 * @name checkinApp.practice
 * @description
 * # practice
 * Factory in the checkinApp.
 */
angular.module('checkinApp')
  .factory('Practice', function ($resource, ENV) {
      return $resource(ENV.apiEndpoint + '/client/primary-location', {}, {
          query: {
              method: 'GET',
              isArray: false
          }
      });
  });
