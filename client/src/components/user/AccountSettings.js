import React from 'react';
import { Field, reduxForm } from 'redux-form'
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { startSetUserUpdate, clearMessage2 } from '../../actions/user';

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

class AccountSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      savedMessage: false
    };
  }

  submitForm = values => {
    this.setState({
      isLoading: true,
      savedMessage: false
    })
    this.props.startSetUserUpdate(values)
      .then((res) => {
        if(res.success === false) {
          this.setState({
            isLoading: false,
            savedMessage: (
              <div className="alert">
                {res.message}
              </div>
            )
         })
       } else {
         this.setState({
           isLoading: false,
           savedMessage: (
             <div className="success-short">
               <i className="fas fa-check"></i> {res.message}
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
  }

  render() {
    const { handleSubmit, pristine } = this.props;
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
                <NavLink activeClassName="profile-form-menu-active red" className="profile-form-left-menu-item" to={`/user/account-delete`}>Account Delete</NavLink>

              </div>
            </div>

            <div className="profile-form-right">
              <div className="profile-form-title">
                <h2>Account Settings</h2>
                <p>Update your account general info.</p>
              </div>

              <div className="profile-form-group">
                <div className="profile-form-item">
                  <div>
                    <p>Email:</p>
                    <Field
                      name="email"
                      type="text"
                      label="john@doe.com"
                      component={renderField}
                    />
                  </div>
                </div>
                <div className="profile-form-item">
                  <p>Username:</p>
                  <Field
                    name="username"
                    type="text"
                    label="John"
                    component={renderField}
                  />
                </div>
              </div>

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


AccountSettings = reduxForm({
  form: 'account-settings',
  destroyOnUnmount: true
})(AccountSettings)

AccountSettings = connect(
  state => ({
    initialValues: state.user.user,
    savedMessage: state.user.savedMessage
  }),
  { startSetUserUpdate, clearMessage2 }
)(AccountSettings)

export default AccountSettings
