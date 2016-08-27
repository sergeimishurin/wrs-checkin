'use strict';

describe('Directive: currencyFormat', function () {

  // load the directive's module
  beforeEach(module('checkinApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<currency-format></currency-format>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the currencyFormat directive');
  }));
});
