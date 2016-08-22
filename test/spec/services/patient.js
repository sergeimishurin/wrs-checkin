'use strict';

describe('Service: patient', function () {

  // load the service's module
  beforeEach(module('checkinApp'));

  // instantiate service
  var patient;
  beforeEach(inject(function (_patient_) {
    patient = _patient_;
  }));

  it('should do something', function () {
    expect(!!patient).toBe(true);
  });

});
