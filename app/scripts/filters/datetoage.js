'use strict';

/**
 * @ngdoc filter
 * @name checkinApp.filter:dateToAge
 * @function
 * @description
 * # dateToAge
 * Filter in the checkinApp.
 */
angular.module('checkinApp')
  .filter('dateToAge', function (moment) {
    return function (_timestamp) {
        var dateString = moment.unix(_timestamp).format('YYYY-MM-DD');
        return moment().diff(dateString, 'years');
    };
  });
