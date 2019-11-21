import React from 'react'
import Board from 'react-trello'
import Issues from '../../../api/issues/issues'
import { withTracker } from 'meteor/react-meteor-data';
import { USER_TYPE, ISSUE_STATE } from '../../../constants';
import Spinner from '../../components/Spinner'; 


class App extends React.Component {
    
    constructor(props) {
    super(props);
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
              id: 'lane1',
              title: 'Backlog',
              cards: 
                  backlog
                // {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: true},
                // {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
              
              // label: data.lanes[0].cards.length, 
            },
            {
              id: 'lane2',
              title: 'ToDo',
              label: '0/0',
              cards: todo 
              // [
              //   {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: true},
              //   {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
              // ]
            },
            {
              id: 'lane3',
              title: 'InProgress',
              label: '0/0',
              cards: inProgress 
              // [
              //   {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: true},
              //   {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
              // ] 
            },
            {
              id: 'lane4',
              title: 'Done',
              label: '0/0',
              cards: completed
              // [
              //   {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: true},
              //   {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
              // ]
            }
          ]
        }
        return <Board data={data} />
      // const ppp = data.lanes[0].cards.length;
      // console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnn");
      // console.log(ppp);
      }
      return <Spinner/>
    }
}

export default withTracker(()=> {
    const issuesSub = [Meteor.subscribe('issues.stateCount')];
    const propsReady = issuesSub.every(handle => handle.ready());

    let backlog = null;
    let todo = null;
    let inProgress = null;
    let completed = null;

    if(propsReady) {
    backlog = Issues.find({ state: ISSUE_STATE.BACKLOG.id });
    todo = Issues.find({ state: ISSUE_STATE.TODO.id });
    inProgress = Issues.find({ state: ISSUE_STATE.INPROGRESS.id });
    completed = Issues.find({ state: ISSUE_STATE.DONE.id });
    }

    return {
        backlog, todo, inProgress, completed, propsReady
    };
})(App);