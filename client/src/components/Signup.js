import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser, clearAlert } from '../actions/auth';
import FlashMessage from './FlashMessage';

// -------------- validation ----------
const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength20 = maxLength(20)
const maxLength40 = maxLength(40)
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
const minLength3 = minLength(3)
const requiredEmail = value => (value ? undefined : 'Please enter an email')
const requiredUsername = value => (value ? undefined : 'Please enter a username')
const requiredPassword = value => (value ? undefined : 'Please enter a password')
const requiredPasswordConfirm = value => (value ? undefined : 'Please enter a password confirmation')
const matchPassword = (value, values) => ( value === values.password ? undefined : 'Passwords must match')
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
// -------------- end validation --------

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <input {...input} placeholder={label} type={type} />
    {touched &&
     error &&
     <div className="error">{error}</div>}
  </div>
)

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  componentWillUnmount() {
    if(this.props.errorMessage) {
      this.props.clearAlert();
    }
  }

  submitForm = values => {
    this.setState({
      isLoading: true
    })
    this.props.registerUser(values)
      .then(success => {
       if(success === true) {
         // return this.props.history.push('/login')
         return this.props.history.push({
          pathname: '/login',
          state: { message: 'Account successfully created. Please check your inbox (or spam folder) for activation link.' }
        })
       }
       this.setState({
         isLoading: false
      })

     })
      .catch(err => {
        this.setState({
          isLoading: false
        })
      })
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

  render() {
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <form className="signup-container" onSubmit={handleSubmit(this.submitForm.bind(this))}>
        <div className="signup-wrapper">
          <div className="signup-title">
            <h2>This only takes a few seconds</h2>
            <p>Please enter a valid email, you will be sent confirmation email
            to complete sign up process</p>
          </div>

          <div className="signup-info">
            <div className="signup-username">
              <p>Username</p>
              <Field
                name="username"
                type="text"
                label="johndoe3"
                validate={[requiredUsername, maxLength20, minLength3]}
                component={renderField}
              />
            </div>

            <div className="signup-email">
              <p>Email</p>
              <Field
                name="email"
                type="text"
                label="johndoe@outcast.com"
                validate={[requiredEmail, email, maxLength40]}
                component={renderField}
              />
            </div>

            <div className="signup-password">
              <p>Password</p>
              <Field
                name="password"
                type="password"
                label="min 3 characters"
                validate={[requiredPassword, maxLength20, minLength3]}
                component={renderField}
              />
            </div>

            <div className="signup-password">
              <p>Confirm password</p>
              <Field
                name="passwordConfirm"
                type="password"
                label="confirm password"
                validate={[requiredPasswordConfirm, matchPassword]}
                component={renderField}
              />
            </div>

          </div>
          {this.renderAlert()}

          <div className="signup-submit">
            <button className="signup-button" type="submit" disabled={this.state.isLoading || pristine}>Signup</button>
            {/* <p>By signing up, you agree to our Terms of Use and Privacy Policy</p> */}
            <p>Already have an account? <Link to='/login'>Login</Link></p>
            <p>Haven't received confirmation email? <Link to='/accounts/resend-email'>Resend email</Link></p>
          </div>
          <div className="login-demoacc">
            <strong>demo account</strong>
            <br />
            user: demo@demo.com
            <br />
            password: demo
          </div>
          </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error
  }
}

Signup = connect(mapStateToProps, { registerUser, clearAlert })(Signup);

export default reduxForm({
  form: 'signup-form'
})(Signup);
