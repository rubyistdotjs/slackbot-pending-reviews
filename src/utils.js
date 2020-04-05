function stringToArray(string, delimiter = ',') {
  return string
    .split(delimiter)
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

function stringToUsernames(string) {
  const usernames = stringToArray(string, '#');

  if (usernames.length !== 2) {
    throw new TypeError('Expected a string with format "github#slack"');
  }

  return { github: usernames[0], slack: usernames[1] };
}

function pluckGithubUsername({ github }) {
  return github;
}

module.exports = {
  stringToArray,
  stringToUsernames,
  pluckGithubUsername,
};
