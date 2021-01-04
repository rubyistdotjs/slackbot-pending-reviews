const eachSeries = require('async/eachSeries');
const mapSeries = require('async/mapSeries');

const config = require('./config');
const githubApi = require('./services/github');
const slack = require('./services/slack');

function reviewerIsDeveloper(reviewer) {
  return config.developerGithubUsernames.includes(reviewer.login);
}

function hasDeveloperReviewRequests(pull) {
  return pull.requested_reviewers.some(reviewerIsDeveloper);
}

async function fetchRepositoryPullRequests(repository) {
  const pullRequests = await githubApi.traversePagination({
    endpoint: githubApi.getOpenedPullRequests,
    params: {
      repository,
    },
  });

  return pullRequests.filter(hasDeveloperReviewRequests);
}

async function fetchOrganizationRepositories() {
  const repositories = await githubApi.traversePagination({
    endpoint: githubApi.getOrganizationRepositories,
    params: {
      organization: config.organization,
    },
  });

  return repositories.map((repository) => repository.full_name);
}

async function fetchOrganisationPullRequests() {
  const repositories = await fetchOrganizationRepositories();
  const pulls = await mapSeries(repositories, fetchRepositoryPullRequests);
  return pulls.flat();
}

function pushPullRequestInRelevantTeams(teams, pullRequest) {
  const usernames = pullRequest.requested_reviewers.map((r) => r.login);

  return teams.map((team) => {
    if (team.members.some((m) => usernames.includes(m.githubUsername))) {
      return {
        ...team,
        pullRequests: [...team.pullRequests, pullRequest],
      };
    } else {
      return team;
    }
  });
}

function attachPullRequestsToTeams(pullRequests) {
  const initialTeams = config.teams.map((team) => ({
    ...team,
    pullRequests: [],
  }));

  return pullRequests.reduce(pushPullRequestInRelevantTeams, initialTeams);
}

module.exports.notifyPendingReviews = async () => {
  const pullRequests = await fetchOrganisationPullRequests();
  const teamWithPullRequests = attachPullRequestsToTeams(pullRequests);

  await eachSeries(teamWithPullRequests, async function notifyTeam(team) {
    try {
      await slack.notifyPendingReviewRequestedToTeam(team);
    } catch (e) {
      console.error(e);
    }
  });

  return null;
};
