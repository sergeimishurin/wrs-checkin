/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: practice', function () {

    // load the service's module
    beforeEach(module('checkinApp.services.Practice'));

    // instantiate service
    var practice;
    beforeEach(inject(function (_practice_) {
      practice = _practice_;
    }));

    it('should do something', function () {
      expect(!!practice).toBe(true);
    });

  });
});
