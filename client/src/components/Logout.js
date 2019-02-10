import React from 'react';
import {connect} from 'react-redux';
import { logoutUser } from '../actions/auth';
import { clearUserState } from '../actions/user'
import {history} from '../routers/AppRouter';

class Logout extends React.Component {
  componentWillMount() {
    this.props.logoutUser();
    this.timerID = setTimeout(
      () => this.tick(),
      2000
    );
  }

  tick() {
    history.push('/')
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    this.props.clearUserState();
  }

  render() {
    return (
      <div>
        <p style={{textAlign: 'center', opacity: '0.7', margin: '10% auto', fontSize: '20px'}}>
          <i>Sorry to see you go...</i><br />
          <i style={{opacity: '0.5', fontSize: '14px'}}>You will be redirected to the home page in 2 seconds...</i>
        </p>
      </div>
    );
  }
}

export default connect(null, { logoutUser, clearUserState })(Logout);
