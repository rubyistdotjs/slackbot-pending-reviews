const { expect } = require('chai');

const {
  DEVELOPER_USERNAMES,
  DEVELOPER_GITHUB_USERNAMES,
  GITHUB_REPOSITORIES,
} = require('../src/constants');

describe('constants', function () {
  describe('DEVELOPER_USERNAMES', function () {
    it('returns an array of developer usernames', function () {
      expect(DEVELOPER_USERNAMES).eql([
        { github: 'arya', slack: 'ABC00A0AB' },
        { github: 'sansa', slack: 'ABC01A1AB' },
        { github: 'jon', slack: 'ABC02A2AB' },
      ]);
    });
  });

  describe('DEVELOPER_GITHUB_USERNAMES', function () {
    it('returns an array of developer github usernames', function () {
      expect(DEVELOPER_GITHUB_USERNAMES).eql(['arya', 'sansa', 'jon']);
    });
  });

  describe('GITHUB_REPOSITORIES', function () {
    it('returns an array of github repositories', function () {
      expect(GITHUB_REPOSITORIES).eql([
        'stark/winterfell',
        'lannister/casterly-rock',
      ]);
    });
  });
});
