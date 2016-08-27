'use strict';

describe('Directive: format', function () {

  // load the directive's module
  beforeEach(module('checkinApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<format></format>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the format directive');
  }));
});
