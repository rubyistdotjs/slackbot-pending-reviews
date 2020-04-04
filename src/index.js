require('dotenv').config();
const mapSeries = require('async/mapSeries');

const { getOpenedPullRequests } = require('./src/services/github');
const { notifyReviewRequested } = require('./src/services/slack');
const {
  DEVELOPER_GITHUB_USERNAMES,
  GITHUB_REPOSITORIES,
} = require('./src/constants');

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

getRepositoriesPullRequests().then(notifyReviewRequested);
