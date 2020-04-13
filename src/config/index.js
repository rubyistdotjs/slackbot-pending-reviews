const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const environement = process.env.NODE_ENV || 'development';

const configFilepath = path.resolve(__dirname, `./${environement}.yml`);
const configFile = fs.readFileSync(configFilepath, 'utf8');
const config = yaml.safeLoad(configFile);

const developers = config.teams.map((team) => team.members).flat();
const developerGithubUsernames = developers.map((dev) => dev.githubUsername);

module.exports = {
  ...config,
  developers,
  developerGithubUsernames,
};
