const { IncomingWebhook } = require('@slack/webhook');
const { SLACK_WEBHOOK_URL, SLACK_CHANNEL } = process.env;
const { DEVELOPER_USERNAMES } = require('../constants');

function findSlackUsername(githubUsername) {
  const dev = DEVELOPER_USERNAMES.find((u) => u.github === githubUsername);
  return dev ? dev.slack : null;
}

const incomingWebhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

function notifyReviewRequestedPullRequest(pullRequest) {
  const reviewers = pullRequest.requested_reviewers
    .map((pull) => findSlackUsername(pull.login))
    .filter((u) => u !== null)
    .map((username) => `<@${username}>`)
    .join(', ');

  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*<${pullRequest.html_url}|${pullRequest.title}>*\nBy *${pullRequest.user.login}* on the repository *${pullRequest.head.repo.name}*\nPending reviewers: ${reviewers}`,
    },
  };
}

function notifyReviewRequested(pullRequests) {
  const now = Math.round(Date.now() / 1000);

  return incomingWebhook.send({
    channel: SLACK_CHANNEL,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:wave: Good morning everyone.\n\n<!date^${now}^Today {date}|Today>, there is ${pullRequests.length} pull requests awaiting your wisdom.`,
        },
      },
      { type: 'divider' },
      ...pullRequests.map(notifyReviewRequestedPullRequest),
      {
        type: 'divider',
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Show all my review requests',
            },
            url: 'https://github.com/pulls/review-requested',
          },
        ],
      },
    ],
  });
}

module.exports = {
  incomingWebhook,
  notifyReviewRequested,
};
