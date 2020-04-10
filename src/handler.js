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

function hasMore(res) {
  return res.headers.link && res.headers.link.includes('rel="next"');
}

async function getRepositoryPullRequests(repository, page = 1) {
  const res = await githubApi.getOpenedPullRequests({ repository, page });
  const pullRequests = res.data.filter(pullHasDeveloperReviewRequests);

  if (hasMore(res)) {
    const nextPrs = await getRepositoryPullRequests(repository, page + 1);
    return [...pullRequests, ...nextPrs];
  } else {
    return pullRequests;
  }
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
