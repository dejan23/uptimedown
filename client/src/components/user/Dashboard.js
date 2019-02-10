import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { startSetChecks } from '../../actions/check';
import LoadingPage from '../LoadingPage';
import moment from 'moment';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.props.startSetChecks()
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      60000
    );
  }

  tick() {
  this.props.startSetChecks()
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  renderComponent() {
    if(this.props.checks.length === 0) {
      return (
        <div>
          There are no checks added
        </div>
      )
    } else {
      return this.props.checks.map((check) => {
        return (
          <Link to={`/user/${check._id}`} key={check._id} className="dashboard-check-content">
            <div className="dashboard-check-content-item shrink">{check.method}</div>
            <div className="dashboard-check-content-item shrink">{check.protocol}</div>
            <div className="dashboard-check-content-item">{check.url}</div>
            <div className="dashboard-check-content-item shrink">
              {
                check.state === 'up' ?
                <span style={{color: 'green'}}>{check.state}</span> :
                <span style={{color: 'red'}}>{check.state}</span>
              }
            </div>
            <div className="dashboard-check-content-item shrink">{check.responseTime}</div>
            <div className="dashboard-check-content-item">{moment(check.lastChecked).fromNow()}</div>
          </Link>
        )
      })
    }
  }

  submit = () => {
    this.props.startSetChecks()
  }

  render() {
    const upCount = this.props.checks && this.props.checks.filter((check) => {return check.state === 'up'})
    const pausedCount = this.props.checks && this.props.checks.filter((check) => {return check.state === 'paused'})
    const downCount = this.props.checks && this.props.checks.filter((check) => {return check.state === 'down'})

    return (
      <div className="dashboard-wrapper">
        <div className="dashboard">
          <div className="dashboard-title">
            <div className="dashboard-title-left">Total created checks: {this.props.checks && this.props.checks.length}</div>
            <div className="dashboard-title-center">
              <h2>Dashboard</h2>
              <p>You may create up to 25 checks</p>
            </div>
            <div className="dashboard-title-right">
              <span>Up: {!this.props.checks || upCount.length === 0 ? '0' : <span style={{color: '#0095ff'}}>{upCount && upCount.length}</span>} </span><br />
              <span>Paused: {!this.props.checks || pausedCount.length === 0 ? '0' : <span style={{color: '#0095ff'}}>{pausedCount && pausedCount.length}</span>} </span><br />
              <span>Down: {!this.props.checks || downCount.length === 0 ? '0' : <span style={{color: 'red'}}>{downCount && downCount.length}</span>} </span><br />
            </div>
          </div>
          <div className="dashboard-content">
            <div className="dashboard-check">
              <div className="dashboard-check-item shrink">Method</div>
              <div className="dashboard-check-item shrink">Protocol</div>
              <div className="dashboard-check-item">Url</div>
              <div className="dashboard-check-item shrink">State</div>
              <div className="dashboard-check-item shrink">Response Time</div>
              <div className="dashboard-check-item">Last Checked</div>
            </div>
            <div>{!this.props.checks ? <LoadingPage/> : this.renderComponent()}</div>
          </div>
        </div>
        <div className="dashboard-bottom">
          <div style={{marginBottom: '20px'}} className="dashboard-bottom-left">
            <p>*After adding a check wait up to 3 minutes to see status.</p>
            <p>*Automatic browser refresh occurres once every minute.</p>
            <p>*Click on individual check to see more details.</p>
          </div>
          <div className="dashboard-bottom-right">
            {
              this.props.checks && this.props.checks.length >= 25 ?
              <a className="dashboard-button-disabled">Max checks</a> :
              <Link className="dashboard-button" to={`/user/new-check`}>Add New Check</Link>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  checks: state.check.checks,
  loading: state.check.checkIsLoading
})

export default connect(mapStateToProps, {startSetChecks})(Dashboard);
