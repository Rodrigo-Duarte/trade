'use strict'

const Advisor = require('../advisor.js')
var chai = require('chai');
chai.use(require('chai-datetime'));
chai.should();

describe('Advisor', function() {
  describe('advise()', function() {
    it('should work :D', function() {
        var subject = new Advisor()
        subject.advise().should.equal(-1)
        subject.advise().should.equalDate(new Date('2011-01-01T00:02:00Z'))
    });
  });
});
