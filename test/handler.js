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

      getOpenedPullRequestsStub.onFirstCall().resolves(winterfellRes[0]);
      getOpenedPullRequestsStub.onSecondCall().resolves(casterlyRockRes[0]);
      getOpenedPullRequestsStub.onThirdCall().resolves(casterlyRockRes[1]);

      notifyReviewRequestedStub = sinon.stub(slack, 'notifyReviewRequested');
      notifyReviewRequestedStub.resolves(null);
    });

    afterEach(function () {
      sinon.resetHistory();
    });

    after(function () {
      sinon.restore();
    });

    it('calls githubApi.getOpenedPullRequests thrice', async function () {
      await notifyPendingReviews();
      expect(getOpenedPullRequestsStub).to.have.been.calledThrice;
    });

    it('calls githubApi.getOpenedPullRequests once for the repository stark/winterfell', async function () {
      await notifyPendingReviews();
      expect(getOpenedPullRequestsStub).to.have.been.calledWith({
        repository: 'stark/winterfell',
        page: 0,
      });
    });

    it('calls githubApi.getOpenedPullRequests twice for the repository lannister/casterly-rock', async function () {
      await notifyPendingReviews();

      expect(getOpenedPullRequestsStub).to.have.been.calledWith({
        repository: 'lannister/casterly-rock',
        page: 0,
      });

      expect(getOpenedPullRequestsStub).to.have.been.calledWith({
        repository: 'lannister/casterly-rock',
        page: 1,
      });
    });

    it('calls slack.notifyReviewRequested once with the formatted pull requests', async function () {
      await notifyPendingReviews();
      expect(notifyReviewRequestedStub).to.have.been.calledOnceWith([
        {
          head: { repo: { name: 'stark' } },
          requested_reviewers: [{ login: 'jon' }],
          title: 'Pull Request Winterfell 1',
          user: { login: 'arya' },
        },
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
          head: { repo: { name: 'lannister' } },
          requested_reviewers: [
            { login: 'rubyistdotjs' },
            { login: 'arya' },
            { login: 'sansa' },
          ],
          title: 'Pull Request CasterlyRock 6',
          user: { login: 'jon' },
        },
      ]);
    });
  });
});
