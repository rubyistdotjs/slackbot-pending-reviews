const mapSeries = require('async/mapSeries');

const githubApi = require('./services/github');
const slack = require('./services/slack');
const {
  DEVELOPER_GITHUB_USERNAMES,
  GITHUB_REPOSITORIES,
} = require('./constants');

function reviewerIsDeveloper(reviewer) {
  return DEVELOPER_GITHUB_USERNAMES.includes(reviewer.login);
}

function pullHasDeveloperReviewRequests(pull) {
  return pull.requested_reviewers.some(reviewerIsDeveloper);
}

async function getRepositoryPullRequests(repository) {
  const res = await githubApi.getOpenedPullRequests(repository);
  return res.data.filter(pullHasDeveloperReviewRequests);
}

async function getRepositoriesPullRequests() {
  const pulls = await mapSeries(GITHUB_REPOSITORIES, getRepositoryPullRequests);
  return pulls.flat();
}

module.exports.notifyPendingReviews = async () => {
  const pullRequests = await getRepositoriesPullRequests();
  await slack.notifyReviewRequested(pullRequests);

  return null;
};
