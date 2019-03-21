import React from 'react';
import { Field, reduxForm } from 'redux-form'
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { startSetDeleteUser } from '../../actions/auth';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <input {...input} placeholder={label} type={type} />
    {touched &&
      error &&
      <div className="error">{error}</div>}
  </div>
)

// -------------- validation ----------
const requiredUsername = value => (value ? undefined : 'Please enter your username to delete account')
// -------------- end validation --------

class AccountDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      savedMessage: false,
      errorMessage: false
    };
  }

  renderAlert() {
    if (this.state.errorMessage) {
      return (
        <div className="alert">
          <strong>Oops!</strong> {this.state.errorMessage}
        </div>
      )
    }
  }

  submitForm = values => {
    const usernameFromStorage = localStorage.getItem('username');
    if (values.username === usernameFromStorage) {
      this.props.startSetDeleteUser()
        .then((res) => {
          if (res.success === false) {
            this.setState({
              isLoading: false,
              savedMessage: (
                <div className="alert">
                  {res.message}
                </div>
              )
            })
          }
        })
        .catch(err => {
          this.setState({
            isLoading: false,
            savedMessage: (
              <div className="alert">
                Connection error.
            </div>
            )
          })
        })
    } else {
      this.setState({
        errorMessage: 'You misspelled you username'
      })
    }

  }

  render() {
    const { handleSubmit, pristine, disabled } = this.props;
    const usernameFromStorage = localStorage.getItem('username');

    return (
      <form className="profile-form-wrapper" onSubmit={handleSubmit(this.submitForm.bind(this))}>
        <div className="profile-form">
          <div className="profile-form-top">
            <div className="profile-form-left">
              <div className="profile-form-left-username">
                <h3>{usernameFromStorage}</h3>
              </div>
              <div className="profile-form-left-menu">
                <NavLink activeClassName="profile-form-menu-active" className="profile-form-left-menu-item" to={`/user/dashboard`}>Go to Dashboard</NavLink>
                <NavLink activeClassName="profile-form-menu-active" className="profile-form-left-menu-item" to={`/user/account-settings`}>Account Settings</NavLink>
                <NavLink activeClassName="profile-form-menu-active" className="profile-form-left-menu-item" to={`/user/account-password`}>Account Password</NavLink>
                <NavLink activeClassName="profile-form-menu-active" className="profile-form-left-menu-item" to={`/user/account-delete`}>Account Delete</NavLink>

              </div>
            </div>

            <div className="profile-form-right">
              <div className="profile-form-title">
                <h2>Account Settings</h2>
                <p>Delete your account.</p>
              </div>

              <div className="profile-form-group">

                <div className="profile-form-item">
                  <p style={{ color: 'red' }}>Once you delete your account, there is no going back. Please be certain.<br />
                    Every check, log and event will be deleted permanently.</p>
                  <p>Enter your username and click Delete Account</p>
                  <Field
                    name="username"
                    type="text"
                    label="username"
                    validate={requiredUsername}
                    component={renderField}
                  />
                </div>

              </div>
              {this.state.savedMessage}
              {this.renderAlert()}
            </div>
          </div>
          <div className="profile-form-bottom">
            <div className="profile-form-button">
              <button type="submit" className="signup-button" disabled={this.state.isLoading || pristine}>Delete Account</button>
            </div>
          </div>

        </div>
      </form>
    )
  }
}

AccountDelete = reduxForm({
  form: 'account-delete',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true
})(AccountDelete)

export default connect(null, { startSetDeleteUser })(AccountDelete);
