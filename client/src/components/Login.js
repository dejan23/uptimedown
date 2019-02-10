import React from 'react';
import { Field, reduxForm, isSubmitting } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser, clearAlert } from '../actions/auth';
import FlashMessage from './FlashMessage';

// -------------- validation ----------
const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength45 = maxLength(45)
const requiredEmail = value => (value ? undefined : 'Please enter an email')
const requiredPassword = value => (value ? undefined : 'Please enter a password')
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

class Login extends React.Component {
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
    this.props.loginUser(values)
      .then(success => {
       if(success === true) {
         return this.props.history.push('/user/dashboard')
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
    // if(this.props.location.state) {
    //   return (
    //     <FlashMessage props={this.props.location.state.message}/>
    //   )
    // }


    return (

      <div>
        {this.props.location.state && <FlashMessage props={this.props.location.state.message}/>}
        <form className="login-container" onSubmit={handleSubmit(this.submitForm.bind(this))}>
          <div className="login-wrapper">
            <div className="login-title">
              <h2>Login</h2>
              <p>Welcome back!</p>
            </div>

            <div className="login-info">
              <div className="login-email">
                <p>Email</p>
                <Field
                  name="email"
                  type="text"
                  label="enter your email address"
                  validate={[requiredEmail, email, maxLength45]}
                  component={renderField}
                />
              </div>

              <div className="login-password">
                <p>Password</p>
                <Field
                  name="password"
                  type="password"
                  label="enter your password"
                  validate={requiredPassword}
                  component={renderField}
                />
              </div>
            </div>
            {this.renderAlert()}
            <div className="login-submit">
              <button className="login-button" type="submit" disabled={this.state.isLoading || pristine}>Login</button>
              <p><Link to='/accounts/reset-password'>Forgot password?</Link></p>
              <p>Don't have an account? <Link to='/signup'>Signup</Link></p>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error
  }
}

Login = connect(mapStateToProps, { loginUser, clearAlert })(Login);

export default reduxForm({
  form: 'login-form'
})(Login)
