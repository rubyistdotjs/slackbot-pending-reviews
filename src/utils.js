function stringToArray(string, delimiter = ',') {
  if (string == null || string.constructor !== String) return [];

  return string
    .split(delimiter)
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

function splitUsernames(string) {
  const [github, slack] = stringToArray(string, '#');
  return { github, slack };
}

module.exports = {
  stringToArray,
  splitUsernames,
};
