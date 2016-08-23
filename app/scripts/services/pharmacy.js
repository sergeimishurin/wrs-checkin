'use strict';

/**
 * @ngdoc service
 * @name checkinApp.pharmacy
 * @description
 * # pharmacy
 * Factory in the checkinApp.
 */
angular.module('checkinApp')
  .factory('Pharmacy', function ($resource, ENV) {
      return $resource(ENV.apiEndpoint + '/client/pharmacies', {}, {
          query: {
              method: 'GET',
              isArray: false
          }
      });
  });
