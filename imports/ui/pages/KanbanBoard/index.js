import React from 'react';
import Board from 'react-trello';
import Issues from '../../../api/issues/issues';
import { withTracker } from 'meteor/react-meteor-data';
import { USER_TYPE, ISSUE_STATE } from '../../../constants';
import Spinner from '../../components/Spinner';
import { issueUpdateState } from '../../../api/issues/methods';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  handleDragEnd(cardId, sourceLaneId, targetLaneId, position, cardDetails) {
    issueUpdateState.call({ issueId: cardId, newState: targetLaneId });
  }

  render() {
    let data = null;
    if (this.props.propsReady) {
      const backlog = this.props.backlog;
      const todo = this.props.todo;
      const inProgress = this.props.inProgress;
      const completed = this.props.completed;

      data = {
        lanes: [
          {
            id: ISSUE_STATE.BACKLOG.id,
            title: 'Backlog',
            cards: backlog.map(issue => {
              return {
                id: issue._id,
                title: issue.title,
                description: issue.description,
                draggable: true,
              };
            }),
          },
          {
            id: ISSUE_STATE.TODO.id,
            title: 'ToDo',
            cards: todo.map(issue => {
              return {
                id: issue._id,
                title: issue.title,
                description: issue.description,
                draggable: true,
              };
            }),
          },
          {
            id: ISSUE_STATE.INPROGRESS.id,
            title: 'InProgress',
            cards: inProgress.map(issue => {
              return {
                id: issue._id,
                title: issue.title,
                description: issue.description,
                draggable: true,
              };
            }),
          },
          {
            id: ISSUE_STATE.DONE.id,
            title: 'Done',
            cards: completed.map(issue => {
              return {
                id: issue._id,
                title: issue.title,
                description: issue.description,
                draggable: true,
              };
            }),
          },
        ],
      };
      return (
        <Board
          style={{ backgroundColor: '#e8eaf6' }}
          laneStyle={{ backgroundColor: '#3f51b5', color: 'white' }}
          data={data}
          handleDragEnd={this.handleDragEnd}
          hideCardDeleteIcon
        />
      );
    }
    return <Spinner />;
  }
}

export default withTracker(() => {
  const issuesSub = [Meteor.subscribe('issues.stateCount', Meteor.user()._id)];
  const propsReady = issuesSub.every(handle => handle.ready());

  let backlog = null;
  let todo = null;
  let inProgress = null;
  let completed = null;

  if (propsReady) {
    backlog = Issues.find({ state: ISSUE_STATE.BACKLOG.id }).fetch();
    todo = Issues.find({ state: ISSUE_STATE.TODO.id }).fetch();
    inProgress = Issues.find({ state: ISSUE_STATE.INPROGRESS.id }).fetch();
    completed = Issues.find({ state: ISSUE_STATE.DONE.id }).fetch();
  }

  return {
    backlog,
    todo,
    inProgress,
    completed,
    propsReady,
  };
})(App);
