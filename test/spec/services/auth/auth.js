'use strict';

describe('Service: auth/auth', function () {

  // load the service's module
  beforeEach(module('checkinApp'));

  // instantiate service
  var auth/auth;
  beforeEach(inject(function (_auth/auth_) {
    auth/auth = _auth/auth_;
  }));

  it('should do something', function () {
    expect(!!auth/auth).toBe(true);
  });

});
