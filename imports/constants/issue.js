const ISSUE_CATEGORIES = Object.freeze({
  WATER: { id: 'water', name: 'Water' },
  ELECTRICITY: { id: 'electricity', name: 'Electricity' },
  ROAD: { id: 'road', name: 'Road' },
  UNIVERSITY: { id: 'university', name: 'University' },
  TRAFFIC: { id: 'traffic', name: 'Traffic' },
  SCHOOL: { id: 'school', name: 'School' },
});

const ISSUE_STATE = Object.freeze({
  BACKLOG: { id: 'backlog', name: 'Backlog' },
  TODO: { id: 'todo', name: 'ToDo' },
  INPROGRESS: { id: 'inprogress', name: 'In-Progress' },
  DONE: { id: 'done', name: 'Done' },
});

export { ISSUE_CATEGORIES, ISSUE_STATE };
