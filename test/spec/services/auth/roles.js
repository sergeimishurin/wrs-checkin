'use strict';

describe('Service: auth/roles', function () {

  // load the service's module
  beforeEach(module('checkinApp'));

  // instantiate service
  var auth/roles;
  beforeEach(inject(function (_auth/roles_) {
    auth/roles = _auth/roles_;
  }));

  it('should do something', function () {
    expect(!!auth/roles).toBe(true);
  });

});
