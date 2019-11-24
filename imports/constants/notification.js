const NOTIFICATION_CATEGORIES = Object.freeze({
  COMMENT: { id: 'COMMENT', name: 'New Comment' },
  UPVOTE: { id: 'UPVOTE', name: 'New Upvote' },
  ISSUE_STATE_CHANGE: {
    id: 'ISSUE_STATE_CHANGE',
    name: 'Issue state changed',
  },
});

const NOTIFICATION_STATE = Object.freeze({
  READ: { id: 'READ', name: 'Read' },
  UNREAD: { id: 'UNREAD', name: 'UNREAD' },
});

export { NOTIFICATION_CATEGORIES, NOTIFICATION_STATE };
