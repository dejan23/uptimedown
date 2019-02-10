import React from 'react';
import {connect} from 'react-redux';
import { startSetValidateUser} from '../actions/user'
import {history} from '../routers/AppRouter';

class ValidateUser extends React.Component {
  constructor(props) {
    super(props);
    this.props.startSetValidateUser(this.props.match.params.id)
  }


  tick() {
    history.push('/login')
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  renderMessage() {
    if(this.props.validate && this.props.validate.success === true) {
      this.timerID = setTimeout(
        () => this.tick(),
        5000
      );
      return (
        <p style={{textAlign: 'center', opacity: '0.7', margin: '10% auto', fontSize: '20px'}}>
          <i>Your account has been successfully activated, feel free to log in.</i><br />
          <i style={{opacity: '0.5', fontSize: '14px'}}>You will be redirected to the login page in 5 seconds...</i>
        </p>
      )
    }

    if(this.props.validate && this.props.validate.success === false) {
      return (
        <p style={{textAlign: 'center', opacity: '0.7', margin: '10% auto', fontSize: '20px'}}>
          <i>{this.props.validate.message}</i><br />
          <i style={{opacity: '0.5', fontSize: '14px'}}>Resend the activation email?</i>
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
  validate: state.user.validate
})

export default connect(mapStateToProps, { startSetValidateUser })(ValidateUser);
