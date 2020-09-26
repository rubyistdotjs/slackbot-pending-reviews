# SlackBot Pending Reviews

![](https://github.com/rubyistdotjs/slackbot-pending-reviews/workflows/Lint/badge.svg)

A Lambda that retrieve pull requests of all the repositories of an organization through the GitHub API and sends a message on Slack reminding the desired developers that they have pending review requests.

# Installation

```bash
# Clone the repo
git clone https://github.com/rubyistdotjs/slackbot-pending-reviews.git

cd slackbot-pending-reviews

# Install dependencies
npm install

# Setup env files
cp .env.example .env
cp .env.example .env.production
```

# Run locally

```bash
# Using .env
serverless invoke local --function notify-pending-reviews

# Using .env.production
serverless invoke local --function notify-pending-reviews --env production
```

# Deploy

```bash
NODE_ENV=production serverless deploy --aws-profile AWS_PROFILE --verbose
```

```bash
NODE_ENV=production serverless deploy --aws-profile AWS_PROFILE --function notify-pending-reviews --verbose
```
