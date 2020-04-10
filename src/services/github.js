const axios = require('axios');

const { GITHUB_API_URL, GITHUB_API_ACCESS_TOKEN } = process.env;

const api = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_API_ACCESS_TOKEN}`,
  },
});

function getOpenedPullRequests({ repository, page }) {
  return api.get(`repos/${repository}/pulls`, {
    params: {
      state: 'open',
      sort: 'created',
      direction: 'desc',
      page,
      per_page: 100,
    },
  });
}

module.exports = {
  api,
  getOpenedPullRequests,
};
