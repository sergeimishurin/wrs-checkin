'use strict';

describe('Service: auth/interceptor', function () {

  // load the service's module
  beforeEach(module('checkinApp'));

  // instantiate service
  var auth/interceptor;
  beforeEach(inject(function (_auth/interceptor_) {
    auth/interceptor = _auth/interceptor_;
  }));

  it('should do something', function () {
    expect(!!auth/interceptor).toBe(true);
  });

});
