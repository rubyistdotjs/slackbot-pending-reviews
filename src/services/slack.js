const { IncomingWebhook } = require('@slack/webhook');

const { SLACK_WEBHOOK_URL } = process.env;
const incomingWebhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

function pendingReviewRequestedToMembers(members, pullRequest) {
  const { html_url, title, user, requested_reviewers } = pullRequest;
  const repository = pullRequest.head.repo.name;

  const githubReviewers = requested_reviewers.map((reviewer) => reviewer.login);
  const slackReviewers = members
    .filter((member) => githubReviewers.includes(member.githubUsername))
    .map((member) => `<@${member.slackId}>`)
    .join(', ');

  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*<${html_url}|${title}>*\nBy *${user.login}* on the repository *${repository}*\nPending reviewers: ${slackReviewers}`,
    },
  };
}

function pendingReviewRequestedToTeamEmptyTemplate({ name, now }) {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Good morning ${name} :kissing_heart:.\n\n<!date^${now}^Today {date}|Today>, there are ... :scream: OMG no pending review requests, do some people even work in this team ?`,
      },
    },
  ];
}

function pendingReviewRequestedToTeamTemplate({ name, now, pendingReviews }) {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Good morning ${name} :kissing_heart:.\n\n<!date^${now}^Today {date}|Today>, there are ${pendingReviews.length} pull requests awaiting your approval.`,
      },
    },
    { type: 'divider' },
    ...pendingReviews,
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
  ];
}

function notifyPendingReviewRequestedToTeam({
  name,
  slackChannel,
  members,
  pullRequests,
  now = Math.round(Date.now() / 1000),
}) {
  const pendingReviews = pullRequests.map((pullRequest) =>
    pendingReviewRequestedToMembers(members, pullRequest),
  );

  return incomingWebhook.send({
    channel: slackChannel,
    blocks:
      pendingReviews.length > 0
        ? pendingReviewRequestedToTeamTemplate({ name, now, pendingReviews })
        : pendingReviewRequestedToTeamEmptyTemplate({ name, now }),
  });
}

module.exports = {
  incomingWebhook,
  notifyPendingReviewRequestedToTeam,
};
