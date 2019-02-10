import React from 'react';
import { Field, reduxForm, isSubmitting } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startSetResetPasswordByEmail } from '../actions/user';
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

class ResetPasswordByEmail extends React.Component {
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
    this.props.startSetResetPasswordByEmail(values)
      .then((res) => {
        if(res.error || res.success === false) {
          this.setState({
            isLoading: false,
            savedMessage: (
              <div className="alert">
                {res.error || res.message}
              </div>
            )
         })
       } else {
         this.setState({
           // isLoading: false,
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
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <div>
        <form className="login-container" onSubmit={handleSubmit(this.submitForm.bind(this))}>
          <div className="login-wrapper">
            <div className="login-title">
              <h2>Request new password</h2>
              <p>Type the email you signed up with</p>
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

            </div>
            <div style={{margin: '20px 0'}} className="login-submit">
              <button className="login-button" type="submit" disabled={this.state.isLoading || pristine}>Send new password</button>
              <p style={{margin: '10px 0'}}>Make sure you change the new password after logging in!</p>
              <p style={{margin: '10px 0'}}>Don't have an account? <Link to='/signup'>Signup</Link></p>
            </div>

            {this.state.savedMessage}

            </div>
        </form>
      </div>
    );
  }
}

ResetPasswordByEmail = connect(null, { startSetResetPasswordByEmail })(ResetPasswordByEmail);

export default reduxForm({
  form: 'ResetPasswordByEmail-form'
})(ResetPasswordByEmail)
