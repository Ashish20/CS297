import React from 'react'
import Board from 'react-trello'
import Issues from '../../../api/issues/issues'
import { withTracker } from 'meteor/react-meteor-data';
import { USER_TYPE, ISSUE_STATE } from '../../../constants';
import Spinner from '../../components/Spinner'; 
import {issueUpdateState} from '../../../api/issues/methods';
import '../../../api/issues/methods'

class App extends React.Component {
    
    constructor(props) {
    super(props);
    }

    handleDragEnd(cardId, sourceLaneId, targetLaneId, position, cardDetails) {
      issueUpdateState.call({issueId:cardId, newState:targetLaneId});

      Meteor.call(
        'sendEmail',
        'Abhijeet <abhijeetb9890@gmail.com>',
        'abhute@uci.edu',
        'Hello from Meteor!',
        'This is a test of Email.send.'
      );
    }
  
  render() {

    let data = null;
    if(this.props.propsReady) {

      const backlog = this.props.backlog;
      const todo = this.props.todo;
      const inProgress = this.props.inProgress;
      const completed = this.props.completed;

      console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
      
      data = {
          lanes: [
            {
              id: ISSUE_STATE.BACKLOG.id,
              title: 'Backlog',
              cards: 
                  backlog.map(issue => {
                    return ({
                      id: issue._id,
                    title: issue.title,
                    description: issue.description,
                    draggable: true,
                    })
                  }
                  )
            //     [{id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: true},
            //     {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
            // ]
              // label: data.lanes[0].cards.length, 
            },
            {
              id: ISSUE_STATE.TODO.id,
              title: 'ToDo',
              label: '0/0',
              cards: 
              todo.map(issue => {
                return ({
                  id: issue._id,
                title: issue.title,
                description: issue.description,
                draggable: true,
                })
              }
              ) 
              // [
              //   {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: true},
              //   {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
              // ]
            },
            {
              id: ISSUE_STATE.INPROGRESS.id,
              title: 'InProgress',
              label: '0/0',
              cards: 
              inProgress.map(issue => {
                return ({
                  id: issue._id,
                title: issue.title,
                description: issue.description,
                draggable: true,
                })
              }
              ) 
              // [
              //   {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: true},
              //   {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
              // ] 
            },
            {
              id: ISSUE_STATE.DONE.id,
              title: 'Done',
              label: '0/0',
              cards: 
              completed.map(issue => {
                return ({
                  id: issue._id,
                title: issue.title,
                description: issue.description,
                draggable: true,
                })
              }
              )
              // [ 
              //   {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: true},
              //   {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
              // ]
            }
          ]
        }
        return <Board data={data} handleDragEnd={this.handleDragEnd} className = "whole"/>
      // const ppp = data.lanes[0].cards.length;
      // console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnn");
      // console.log(ppp);
      }
      return <Spinner/>
    }
}

export default withTracker(()=> {
    const issuesSub = [Meteor.subscribe('issues.stateCount', Meteor.userId())];
    const propsReady = issuesSub.every(handle => handle.ready());

    let backlog = null;
    let todo = null;
    let inProgress = null;
    let completed = null;
    let ownerId = ''

    if(propsReady) {
    backlog = Issues.find({ state: ISSUE_STATE.BACKLOG.id }).fetch();
    todo = Issues.find({ state: ISSUE_STATE.TODO.id }).fetch();
    inProgress = Issues.find({ state: ISSUE_STATE.INPROGRESS.id }).fetch();
    completed = Issues.find({ state: ISSUE_STATE.DONE.id } ).fetch();
    }

    return {
        backlog, todo, inProgress, completed, propsReady
    };
})(App);

Meteor.methods({

});