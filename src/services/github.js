const axios = require('axios');

const { GITHUB_API_URL, GITHUB_API_ACCESS_TOKEN } = process.env;

const api = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_API_ACCESS_TOKEN}`,
  },
});

function getOpenedPullRequests(repository) {
  return api.get(`repos/${repository}/pulls`, {
    params: {
      state: 'open',
      sort: 'created',
      direction: 'desc',
    },
  });
}

module.exports = {
  api,
  getOpenedPullRequests,
};
