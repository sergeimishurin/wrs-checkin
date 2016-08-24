'use strict';

describe('Directive: patientHeader', function () {

  // load the directive's module
  beforeEach(module('checkinApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<patient-header></patient-header>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the patientHeader directive');
  }));
});
