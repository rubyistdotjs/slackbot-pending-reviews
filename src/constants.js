const { DEVELOPER_USERNAMES, GITHUB_REPOSITORIES } = process.env;
const {
  stringToArray,
  stringToUsernames,
  pluckGithubUsername,
} = require('./utils');

const developers = stringToArray(DEVELOPER_USERNAMES);
const developerUsernames = developers.map(stringToUsernames);
const developerGithubUsernames = developerUsernames.map(pluckGithubUsername);

module.exports = {
  GITHUB_REPOSITORIES: stringToArray(GITHUB_REPOSITORIES),
  DEVELOPER_USERNAMES: developerUsernames,
  DEVELOPER_GITHUB_USERNAMES: developerGithubUsernames,
};
