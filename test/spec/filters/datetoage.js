'use strict';

describe('Filter: dateToAge', function () {

  // load the filter's module
  beforeEach(module('checkinApp'));

  // initialize a new instance of the filter before each test
  var dateToAge;
  beforeEach(inject(function ($filter) {
    dateToAge = $filter('dateToAge');
  }));

  it('should return the input prefixed with "dateToAge filter:"', function () {
    var text = 'angularjs';
    expect(dateToAge(text)).toBe('dateToAge filter: ' + text);
  });

});
