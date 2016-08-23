'use strict';

describe('Service: pharmacy', function () {

  // load the service's module
  beforeEach(module('checkinApp'));

  // instantiate service
  var pharmacy;
  beforeEach(inject(function (_pharmacy_) {
    pharmacy = _pharmacy_;
  }));

  it('should do something', function () {
    expect(!!pharmacy).toBe(true);
  });

});
