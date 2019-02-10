import React from 'react';
import { Field, reduxForm } from 'redux-form'
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { startSetResetPassword, clearAlert } from '../../actions/auth';

// -------------- validation ----------
const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength20 = maxLength(20)
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
const minLength3 = minLength(3)
const requiredPassword = value => (value ? undefined : 'Please enter a password')
const requiredPasswordConfirm = value => (value ? undefined : 'Please enter a password confirmation')
const matchPassword = (value, values) => ( value === values.newPassword ? undefined : 'Passwords must match')
// -------------- end validation --------


const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <input {...input} placeholder={label} type={type} />
    {touched &&
     error &&
     <div className="error">{error}</div>}
  </div>
)

class AccountPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      savedMessage: false,
      errorMessage: false
    };
  }

  componentWillUnmount() {
    if(this.props.errorMessage) {
      this.props.clearAlert();
    }
  }

  renderAlert() {
    if(this.props.errorMessage) {
      return (
        <div className="alert">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      )
    }
  }

  renderMessage() {
    if(this.props.savedMessage) {
      return (
        <div className="success-short">
          {this.props.savedMessage}
        </div>
      )
    }
  }

  submitForm = values => {
    if(this.props.errorMessage) {
      this.props.clearAlert();
    }
    this.setState({
      isLoading: true,
      savedMessage: false,
      errorMessage: false
    })
    this.props.startSetResetPassword(values)
    .then((data) => {

      if(this.props.errorMessage) {
        return this.setState({
          isLoading: false
        })
      }
      this.props.reset()
     this.setState({
       isLoading: false,
       savedMessage: (
         <div className="success-short">
           <i className="fas fa-check"></i> Your password has been changed successfully.
         </div>
       )
    })
   })
    .catch(err => {
      console.log(err)
      this.setState({
        isLoading: false
      })
    })
  }

  render() {
    const { handleSubmit, pristine, disabled } = this.props;
    const usernameFromStorage = localStorage.getItem('username');
    const emailFromStorage = localStorage.getItem('email');

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
                <h2>Account Password</h2>
                <p>Update your account password here.</p>
              </div>

              <div className="profile-form-group">

                <div style={{marginBottom: '10px'}} className="profile-form-item">
                  <p>Enter current password:</p>
                  <Field
                    name="currentPassword"
                    type="password"
                    label="Enter Current Password"
                    validate={[requiredPassword, maxLength20, minLength3]}
                    component={renderField}
                  />
                </div>
                <div style={{marginBottom: '10px'}} className="profile-form-item">
                  <p>Choose new password:</p>
                  <Field
                    name="newPassword"
                    type="password"
                    label="Enter New Password"
                    validate={[requiredPassword, maxLength20, minLength3]}
                    component={renderField}
                  />
                </div>
                <div style={{marginBottom: '10px'}} className="profile-form-item">
                  <Field
                    name="newPasswordConfirm"
                    type="password"
                    label="Re-type New Password"
                    validate={[requiredPasswordConfirm, matchPassword]}
                    component={renderField}
                  />
                </div>
              </div>
              {this.renderAlert()}
              {this.state.savedMessage}
            </div>
          </div>
          <div className="profile-form-bottom">
            <div className="profile-form-button">
              <button type="submit" className="signup-button" disabled={this.state.isLoading || pristine}>Save</button>
            </div>
          </div>

        </div>
      </form>
    )
  }
}

AccountPassword = reduxForm({
  form: 'account-password',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true
})(AccountPassword)

const mapStateToProps = (state, props) => ({
  errorMessage: state.auth.error,
  savedMessage: state.auth.message
})

AccountPassword = connect(mapStateToProps, { startSetResetPassword, clearAlert })(AccountPassword)

export default AccountPassword;
