const { DEVELOPER_USERNAMES } = require('./constants');

function findSlackUsernameByGithubUsername(githubUsername) {
  const dev = DEVELOPER_USERNAMES.find((u) => u.github === githubUsername);
  return dev ? dev.slack : null;
}

module.exports = {
  findSlackUsernameByGithubUsername,
};
