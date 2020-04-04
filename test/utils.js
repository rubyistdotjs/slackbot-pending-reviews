const { expect } = require('chai');

const { stringToArray } = require('../src/utils');

describe('utils', function () {
  describe('stringToArray', function () {
    it('returns an empty array when passing undefined', function () {
      expect(stringToArray(undefined)).to.eql([]);
    });

    it('returns an empty array when passing null', function () {
      expect(stringToArray(null)).to.eql([]);
    });

    it('returns an empty array when passing an object', function () {
      expect(stringToArray({ a: 'a', b: 'b', c: 'c' })).to.eql([]);
    });

    it('returns an empty array when passing an array', function () {
      expect(stringToArray(['a', 'b', 'c'])).to.eql([]);
    });

    it('returns an empty array when passing a number', function () {
      expect(stringToArray(10)).to.eql([]);
    });

    it('returns an empty array when passing a float', function () {
      expect(stringToArray(1.1)).to.eql([]);
    });

    it('returns an empty array when passing an empty string', function () {
      expect(stringToArray('')).to.eql([]);
    });

    it('returns an empty array when passing a string filled with spaces', function () {
      expect(stringToArray('     ')).to.eql([]);
    });

    it('returns an empty array when passing a string filled with spaces and commas', function () {
      expect(stringToArray(',  ,,  , ,   ')).to.eql([]);
    });

    it('returns an array with the items contained in the string', function () {
      expect(stringToArray(', a,   b,c')).to.eql(['a', 'b', 'c']);
    });

    context('when specifing # as a delimiter', function () {
      it('returns an array with the items contained in the string', function () {
        expect(stringToArray('# a#   b#c', '#')).to.eql(['a', 'b', 'c'], '#');
      });
    });
  });
});
