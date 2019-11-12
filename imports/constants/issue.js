const ISSUE_CATEGORIES = Object.freeze({
  WATER: { id: 'WATER', name: 'Water' },
  ELECTRICITY: { id: 'ELECTRICITY', name: 'Electricity' },
  ROAD: { id: 'ROAD', name: 'Road' },
  UNIVERSITY: { id: 'UNIVERSITY', name: 'University' },
  TRAFFIC: { id: 'TRAFFIC', name: 'Traffic' },
  SCHOOL: { id: 'SCHOOL', name: 'School' },
});

const ISSUE_STATE = Object.freeze({
  BACKLOG: { id: 'BACKLOG', name: 'Backlog' },
  TODO: { id: 'TODO', name: 'ToDo' },
  INPROGRESS: { id: 'INPROGRESS', name: 'In-Progress' },
  DONE: { id: 'DONE', name: 'Done' },
});

export { ISSUE_CATEGORIES, ISSUE_STATE };
