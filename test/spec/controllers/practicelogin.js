'use strict';

describe('Controller: PracticeloginCtrl', function () {

  // load the controller's module
  beforeEach(module('checkinApp'));

  var PracticeloginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PracticeloginCtrl = $controller('PracticeloginCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PracticeloginCtrl.awesomeThings.length).toBe(3);
  });
});
