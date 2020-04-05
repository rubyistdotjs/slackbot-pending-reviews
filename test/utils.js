const { expect } = require('chai');

const { stringToArray, stringToUsernames } = require('../src/utils');

describe('utils', function () {
  describe('stringToArray', function () {
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

  describe('stringToUsernames', function () {
    const expectedError = 'Expected a string with format "github#slack"';

    it('throws an error when passing an empty string', function () {
      expect(() => stringToUsernames('')).to.throw(expectedError);
    });

    it('throws an error when passing a string filled with spaces', function () {
      expect(() => stringToUsernames('     ')).to.throw(expectedError);
    });

    it('throws an error when passing a string with only one username', function () {
      expect(() => stringToUsernames('github')).to.throw(expectedError);
    });

    it('throws an error when passing a string with two empty usernames', function () {
      expect(() => stringToUsernames('  #')).to.throw(expectedError);
    });

    it('throws an error when passing a string with more than two usernames', function () {
      expect(() => stringToUsernames('username1#username2#username3')).to.throw(
        expectedError,
      );
    });

    it('returns a username object', function () {
      expect(stringToUsernames('github#slack')).to.eql({
        github: 'github',
        slack: 'slack',
      });
    });
  });
});
