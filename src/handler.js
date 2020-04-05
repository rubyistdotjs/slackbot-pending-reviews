require('dotenv').config();
const mapSeries = require('async/mapSeries');

const { getOpenedPullRequests } = require('./services/github');
const { notifyReviewRequested } = require('./services/slack');
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
  const res = await getOpenedPullRequests(repository);
  return res.data.filter(pullHasDeveloperReviewRequests);
}

async function getRepositoriesPullRequests() {
  const pulls = await mapSeries(GITHUB_REPOSITORIES, getRepositoryPullRequests);
  return pulls.flat();
}

module.exports.notifyPendingReviews = async () => {
  const pullRequests = await getRepositoriesPullRequests();
  await notifyReviewRequested(pullRequests);

  return null;
};
