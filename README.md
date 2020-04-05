# SlackBot Pending Reviews

A Lambda that retrieve pull requests across multiple repositories through the GitHub API and sends a message on Slack reminding the desired developers that they have pending review requests.

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

```
serverless deploy --stage production --aws-profile AWS_PROFILE --function notify-pending-reviews --verbose
```
