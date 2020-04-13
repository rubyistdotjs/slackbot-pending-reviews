const axios = require('axios');

const { GITHUB_API_URL, GITHUB_API_ACCESS_TOKEN } = process.env;
const DEFAULT_PER_PAGE = 100;

const api = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_API_ACCESS_TOKEN}`,
  },
});

function getOrganizationRepositories({
  organization,
  page,
  per_page = DEFAULT_PER_PAGE,
}) {
  return api.get(`/orgs/${organization}/repos`, {
    params: {
      page,
      per_page,
    },
  });
}

function getOpenedPullRequests({
  repository,
  page,
  per_page = DEFAULT_PER_PAGE,
}) {
  return api.get(`repos/${repository}/pulls`, {
    params: {
      state: 'open',
      sort: 'created',
      direction: 'desc',
      page,
      per_page,
    },
  });
}

function hasNextPage({ headers }) {
  return headers.link && headers.link.includes('rel="next"');
}

async function traversePagination({
  endpoint,
  params,
  page = 0,
  per_page = DEFAULT_PER_PAGE,
}) {
  console.log(`${JSON.stringify(params)} ${page}`);
  const res = await endpoint({ ...params, page, per_page });

  if (hasNextPage(res)) {
    const nextRes = await endpoint({ ...params, page: page + 1, per_page });
    return [...res.data, ...nextRes.data];
  } else {
    return res.data;
  }
}

module.exports = {
  api,
  getOrganizationRepositories,
  getOpenedPullRequests,
  traversePagination,
  hasNextPage,
};
