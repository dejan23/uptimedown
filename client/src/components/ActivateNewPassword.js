import React from 'react';
import {connect} from 'react-redux';
import { startSetActivateNewPassword} from '../actions/user'
import {history} from '../routers/AppRouter';
import queryString from 'query-string';

class ActivateNewPassword extends React.Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(this.props.location.search)
    if(!this.props.location.search) {
      history.push('/')
    }
    this.props.startSetActivateNewPassword(values.token)
  }


  tick() {
    history.push('/login')
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  renderMessage() {
    if(this.props.newPasswordActivate && this.props.newPasswordActivate.success === true) {
      this.timerID = setTimeout(
        () => this.tick(),
        5000
      );
      return (
        <p style={{textAlign: 'center', opacity: '0.7', margin: '10% auto', fontSize: '20px'}}>
          <i>Your new password is activated.</i><br />
          <i>Be sure to change it after you login for security reasons.</i><br />
          <i style={{opacity: '0.5', fontSize: '14px'}}>You will be redirected to the login page in 5 seconds...</i>
        </p>
      )
    }

    if(this.props.newPasswordActivate && this.props.newPasswordActivate.success === false) {
      return (
        <p style={{textAlign: 'center', opacity: '0.7', margin: '10% auto', fontSize: '20px'}}>
          <i>{this.props.newPasswordActivate.message}</i><br />
        </p>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderMessage()}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  newPasswordActivate: state.user.newPasswordActivate
})

export default connect(mapStateToProps, { startSetActivateNewPassword })(ActivateNewPassword);
