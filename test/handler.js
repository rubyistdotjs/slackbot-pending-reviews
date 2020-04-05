const { expect } = require('chai');
const sinon = require('sinon');

const githubApi = require('../src/services/github');
const slack = require('../src/services/slack');
const { notifyPendingReviews } = require('../src/handler');

const casterlyRockRes = require('./__fixtures__/casterly-rock-pull-requests');
const winterfellRes = require('./__fixtures__/winterfell-pull-requests');

describe('handlers', function () {
  describe('notifyPendingReviews', function () {
    let getOpenedPullRequestsStub;
    let notifyReviewRequestedStub;

    before(function () {
      getOpenedPullRequestsStub = sinon.stub(
        githubApi,
        'getOpenedPullRequests',
      );

      getOpenedPullRequestsStub.onFirstCall().resolves(casterlyRockRes);
      getOpenedPullRequestsStub.onSecondCall().resolves(winterfellRes);

      notifyReviewRequestedStub = sinon.stub(slack, 'notifyReviewRequested');
      notifyReviewRequestedStub.resolves(null);
    });

    afterEach(function () {
      sinon.resetHistory();
    });

    after(function () {
      sinon.restore();
    });

    it('calls githubApi.getOpenedPullRequests twice', async function () {
      await notifyPendingReviews();
      expect(getOpenedPullRequestsStub).to.have.been.calledTwice;
    });

    it('calls githubApi.getOpenedPullRequests once for the repository stark/winterfell', async function () {
      await notifyPendingReviews();
      expect(getOpenedPullRequestsStub).to.have.been.calledWith(
        'stark/winterfell',
      );
    });

    it('calls githubApi.getOpenedPullRequests once for the repository lannister/casterly-rock', async function () {
      await notifyPendingReviews();
      expect(getOpenedPullRequestsStub).to.have.been.calledWith(
        'lannister/casterly-rock',
      );
    });

    it('calls slack.notifyReviewRequested once with the formatted pull requests', async function () {
      await notifyPendingReviews();
      expect(notifyReviewRequestedStub).to.have.been.calledOnceWith([
        {
          head: { repo: { name: 'lannister' } },
          requested_reviewers: [{ login: 'sansa' }, { login: 'jon' }],
          title: 'Pull Request CasterlyRock 1',
          user: { login: 'arya' },
        },
        {
          head: { repo: { name: 'lannister' } },
          requested_reviewers: [{ login: 'rubyistdotjs' }, { login: 'arya' }],
          title: 'Pull Request CasterlyRock 3',
          user: { login: 'jon' },
        },
        {
          head: { repo: { name: 'stark' } },
          requested_reviewers: [{ login: 'jon' }],
          title: 'Pull Request Winterfell 1',
          user: { login: 'arya' },
        },
      ]);
    });
  });
});
