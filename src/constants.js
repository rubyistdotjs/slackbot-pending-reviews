const { stringToArray, splitUsernames } = require('./utils');
const { DEVELOPER_USERNAMES, GITHUB_REPOSITORIES } = process.env;

const developers = stringToArray(DEVELOPER_USERNAMES);
const developerUsernames = developers.map(splitUsernames);
const developerGithubUsernames = developerUsernames.map((u) => u.github);

module.exports = {
  GITHUB_REPOSITORIES: stringToArray(GITHUB_REPOSITORIES),
  DEVELOPER_USERNAMES: developerUsernames,
  DEVELOPER_GITHUB_USERNAMES: developerGithubUsernames,
};
