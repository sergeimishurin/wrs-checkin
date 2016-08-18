'use strict';

describe('Service: auth/events', function () {

  // load the service's module
  beforeEach(module('checkinApp'));

  // instantiate service
  var auth/events;
  beforeEach(inject(function (_auth/events_) {
    auth/events = _auth/events_;
  }));

  it('should do something', function () {
    expect(!!auth/events).toBe(true);
  });

});
