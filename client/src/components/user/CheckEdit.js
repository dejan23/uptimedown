import React from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingPage from '../LoadingPage';
import moment from 'moment';
import { Field, reduxForm, isSubmitting } from 'redux-form';
import { startSetCheck, startEditCheck } from '../../actions/check';
import { history } from '../../routers/AppRouter';


// -------------- validation ----------
const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength20 = maxLength(20)
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
const minLength3 = minLength(3)
const requiredProtocol = value => (value ? undefined : 'Please select a protocol')
const requiredUrl = value => (value ? undefined : 'Please enter a url')

var expression = /^(?!https?).*$/;
var regex = new RegExp(expression);
const noProtocol = value => (value.match(regex) ? undefined : 'Please enter without protocol')

const requiredSuccessCodes = value => (value ? undefined : 'Please select at least one success code')
const requiredMethod = value => (value ? undefined : 'Please select a method')
const requiredTimeout = value => (value ? undefined : 'Please select a timeout option')
// -------------- end validation --------

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <input {...input} placeholder={label} type={type} />
    {touched &&
     error &&
     <div className="error">{error}</div>}
  </div>
)

const renderProtocolSelector = ({ input, meta: { touched, error } }) => (
  <div>
    <select {...input}>
      <option value="">select</option>

      <option value="http">http</option>
      <option value="https">https</option>
    </select>
    {touched && error && <span>{error}</span>}
  </div>
)

const renderMethodSelector = ({ input, meta: { touched, error } }) => (
  <div>
    <select {...input}>
      <option value="">select</option>

      <option value="get">GET</option>
      <option value="post">POST</option>
      <option value="put">PUT</option>
      <option value="delete">DELETE</option>
    </select>
    {touched && error && <span>{error}</span>}
  </div>
)

const renderTimeoutSelector = ({ input, meta: { touched, error } }) => (
  <div>
    <select {...input}>
      <option value="">select</option>

      <option value="3">3 sec</option>
      <option value="5">5 sec</option>
      <option value="10">10 sec</option>
      <option value="20">20 sec</option>
      <option value="30">30 sec</option>
    </select>
    {touched && error && <span>{error}</span>}
  </div>
)


let optionsList = [{id: 1, name: '200'}, {id: 2, name: '201'}, {id: 3, name: '301'}, {id: 4, name: '302'}, {id: 5, name: '400'}, {id: 6, name: '403'},
                   {id: 7, name: '404'}, {id: 8, name: '406'}, {id: 9, name: '500'}]
const checkboxGroup = ({label, required, options, input, meta}) => {
  return options.map((option, index) => {
    return (
      <div className="checkbox" key={index}>
        <label>
          <input type="checkbox"
            name={`${input.name}[${index}]`}
            value={option.name}
            checked={input.value.indexOf(option.name) !== -1}
            onChange={(event) => {
              const newValue = [...input.value];
              if (event.target.checked) {
                newValue.push(option.name);
              } else {
                newValue.splice(newValue.indexOf(option.name), 1);
              }

              return input.onChange(newValue);
            }}/>
            {option.name}
          </label>
        </div>)
      });
    }

class CheckEdit extends React.Component {
  constructor(props) {
    super(props);
    this.props.startSetCheck(props.match.params.id)
    this.state = {
      isLoading: false,
      savedMessage: false
    };
  }

  submitForm = (values) => {
    this.setState({
      isLoading: true
    })
    this.props.startEditCheck(values, this.props.match.params.id)
      .then((res) => {
        if(res) {
          this.setState({
            isLoading: false
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

  renderForm() {
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <div className="check-form-wrapper">
        <div className="check-form">
          <div className="check-form-title">
            <h2>Edit Check</h2>
          </div>
          <div className="check-form-content">

            <form className="check-form-container" onSubmit={handleSubmit(this.submitForm.bind(this))}>
              <div className="check-form-wrapper">

                <div className="check-form-group">
                  <div className="check-form-item">
                    <p>Protocol</p>
                    <Field
                      name="protocol"
                      type="text"
                      label="protocol"
                      validate={requiredProtocol}
                      component={renderProtocolSelector}
                    />
                  </div>

                  <div className="check-form-item">
                    <p>Url <span><i style={{opacity: '0.5'}}>(not including protocol)</i></span></p>
                    <Field
                      name="url"
                      type="text"
                      label="mywebsite.com"
                      validate={[requiredUrl, noProtocol, minLength3, maxLength20]}
                      component={renderField}
                    />
                  </div>
                </div>

                <div className="check-form-item">
                  <p>Success Codes <span><i style={{opacity: '0.5'}}>(HTTP codes that should represent "up")</i></span></p>

                  <div className="check-form-item-checkbox">
                    <Field
                      name="successCodes"
                      validate={requiredSuccessCodes}
                      component={checkboxGroup}
                      options={optionsList}
                    />
                  </div>

                </div>

                <div className="check-form-group">
                  <div className="check-form-item">
                    <p>HTTP Method</p>
                    <Field
                      name="method"
                      type="text"
                      label="method"
                      validate={requiredMethod}
                      component={renderMethodSelector}
                    />
                  </div>

                  <div className="check-form-item">
                    <p>Timeout</p>
                    <Field
                      name="timeoutSeconds"
                      type="text"
                      label="timeout"
                      validate={requiredTimeout}
                      component={renderTimeoutSelector}
                    />
                  </div>
                </div>

                <div className="check-form-submit">
                  <button className="check-form-button" type="submit" disabled={this.state.isLoading || pristine}>Save</button>
                  <p>or</p>
                  <Link className="check-form-button-cancel" to={`/user/${this.props.match.params.id}`}>Cancel</Link>
                </div>

              </div>
            </form>
          </div>
        </div>
        <div className="check-form-info-text">
          <p>*Timeout seconds means how much time to wait for website to respond before consider that it is down.</p>
          <p>*After edit check wait up to 3 minutes to see change.</p>
        </div>
      </div>
    )
  }

  render() {
    if(this.props.loading) {
      return (
        <LoadingPage />
      )
    }

    return (
      <div>
        {
            this.props.check && this.props.check.userId === localStorage.getItem('id') ?
            this.renderForm() :
            <div>not allowed</div>
        }
      </div>

    )
  }
}

CheckEdit = reduxForm({
  form: 'check-edit'
})(CheckEdit)

const mapStateToProps = (state, props) => ({
  check: state.check.check,
  initialValues: state.check.check,
  loading: state.check.checkIsLoading
})

CheckEdit = connect(mapStateToProps, { startSetCheck, startEditCheck })(CheckEdit);

export default CheckEdit
