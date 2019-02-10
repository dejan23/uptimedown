import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { startSetCheck, startDeleteCheck, clearCheckState, startPauseCheck } from '../../actions/check';
import { startSetLog, startSetLogStats, clearLogState } from '../../actions/log';
import { startSetEvent, startSetEvents } from '../../actions/event';
import LoadingPage from '../LoadingPage';
import moment from 'moment';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import { Line } from 'react-chartjs-2';
import _ from 'lodash'
import Modal from 'react-modal';

Modal.setAppElement('#app')

function durationFormat(t) {
  var d = Math.floor(t / 86400000),
    h = ('0' + Math.floor(t / 3600000) % 24).slice(-2),
    m = ('0' + Math.floor(t / 60000) % 60).slice(-2),
    s = ('0' + Math.floor(t / 1000) % 60).slice(-2);
  return (d > 0 ? d + 'd ' : '') + (h > 0 ? h + 'h' + ':' : '') + (m > 0 ? m + 'm' + ':' : '') + (t > 60 ? s + 's' : s + 's');
}

class CheckSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      count: 0,
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.props.startSetCheck(props.match.params.id)
    this.props.startSetLog(props.match.params.id)
    this.props.startSetLogStats(props.match.params.id)
    this.props.startSetEvent(props.match.params.id)
    this.props.startSetEvents(props.match.params.id)
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.

  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  decrementCounter = async (state) => {
    if (this.state.count <= 0) {
      console.log('please no more')
    } else {
      await this.setState({ count: this.state.count - 1 })
      this.props.startSetEvents(this.props.match.params.id, this.state.count)
    }
  }

  incrementCounter = async (state, props) => {
    if (this.state.count === this.props.events.pages - 1) {
      console.log('no more')
    } else {
      await this.setState({ count: this.state.count + 1 })
      this.props.startSetEvents(this.props.match.params.id, this.state.count)
    }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 60000);
  }

  tick() {
    this.props.startSetCheck(this.props.match.params.id)
    this.props.startSetLog(this.props.match.params.id)
    this.props.startSetLogStats(this.props.match.params.id)
    this.props.startSetEvent(this.props.match.params.id)
    this.props.startSetEvents(this.props.match.params.id, this.state.count)
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    this.props.clearCheckState();
    this.props.clearLogState();
  }

  renderBar() {
    const { check } = this.props;
    if (this.props.check.length === 0) {
      return (
        <div>
          There are no checks added
        </div>
      )
    } else {
      return (
        <div onClick={this.refreshCheck} style={{ cursor: 'pointer' }} className="dashboard-check-content">
          <div className="dashboard-check-content-item shrink">{check.method}</div>
          <div className="dashboard-check-content-item shrink">{check.protocol}</div>
          <div className="dashboard-check-content-item">{check.url}</div>
          <div className="dashboard-check-content-item shrink">
            {
              check.state === 'up' ?
                <span style={{ color: 'green' }}>{check.state}</span> :
                <span style={{ color: 'red' }}>{check.state}</span>
            }
          </div>
          <div className="dashboard-check-content-item shrink">{check.responseTime}</div>
          <div className="dashboard-check-content-item">{moment(check.lastChecked).local().fromNow()}</div>
        </div>
      )
    }
  }

  renderServerStateInfo() {

    if (this.props.event && this.props.event.eventState === 'Down') {
      return (
        <span>Server is down {moment(this.props.event.eventTime).local().fromNow(true)} <span style={{ opacity: '0.5', fontWeight: '300' }}>- since {moment(this.props.event.eventTime).local().format('MMM Do, YYYY HH:mm:ss')}</span> </span>
      )
    }
    if (this.props.event && this.props.event.eventState === 'Up') {
      return (
        <span>Server is up {moment(this.props.event.eventTime).local().fromNow(true)} <span style={{ opacity: '0.5', fontWeight: '300' }}>- since {moment(this.props.event.eventTime).local().format('MMM Do, YYYY HH:mm:ss')}</span> </span>
      )
    }
    if (this.props.event && this.props.event.eventState === 'Paused') {
      return (
        <span>Server is paused {moment(this.props.event.eventTime).local().fromNow(true)} <span style={{ opacity: '0.5', fontWeight: '300' }}>- since {moment(this.props.event.eventTime).local().format('MMM Do, YYYY HH:mm:ss')}</span> </span>
      )
    }
  }

  renderMoreInfo() {
    const { check } = this.props;
    let todaysAvgResponsetime = this.props.log && this.props.log.dailyAvg


    if (this.props.check.length === 0) {
      return (
        <div>
          There are no checks added
        </div>
      )
    } else {
      return (
        <div className="dashboard-check-more-info">
          <div>Server is {check.state === 'up' ? <span style={{ color: 'green' }}>{check.state}</span> : <span style={{ color: 'red' }}>{check.state}</span>}</div>
          <div>Response time - <span style={{ color: '#0095ff' }}>{check.responseTime}</span></div>
          <div>Response code - <span style={{ color: '#0095ff' }}>{check.responseCode}</span></div> <br />
          <div>Todays avrage response time - {!todaysAvgResponsetime ? <span style={{ color: '#0095ff' }}>wait...</span> : <span style={{ color: '#0095ff' }}>{Math.round(todaysAvgResponsetime) + ' ms'}</span>}</div>
          <div> {this.renderServerStateInfo()} </div><br />

          <div>Timeout seconds - {check.timeoutSeconds} sec</div>
          <div>Status codes you consider as the server is up - {check.successCodes.join(", ")}</div>
          <div>Check interval every {check.interval} minutes</div>
          <div>Check created on {moment(check.createdAt).local().format('MMMM Do, YYYY HH:mm:ss')}</div>
          <div><Link style={{ textDecoration: 'none', color: '#0095ff', fontWeight: '300' }} target="_blank" to="/about">See the response codes information</Link></div>
        </div>
      )
    }
  }

  renderEvents() {
    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
    if (this.props.events.events.length === 0) {
      return (
        <div>
          There are no events
        </div>
      )
    } else {
      return this.props.events.events.map((event) => {
        return (
          <div key={event._id} className='dashboard-event'>
            <span>{event.state && event.state.capitalize()}</span>
            <span style={{ display: 'flex', justifyContent: 'center' }}>{moment(event.createdAt).local().format('MMM Do, YYYY HH:mm:ss')}</span>
            <span style={{ display: 'flex', justifyContent: 'center' }}>{event.responseCode && event.responseCode.capitalize()}</span>
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>{event.duration === null ? moment(event.createdAt).local().fromNow(true) : durationFormat(event.duration)}</span>
          </div>
        )
      })
    }
  }


  changePage = () => {
    this.props.startSetEvents(this.props.match.params.id, this.state.count)
  }

  refreshCheck = () => {
    this.props.startSetCheck(this.props.match.params.id)
    this.props.startSetLog(this.props.match.params.id)
    this.props.startSetLogStats(this.props.match.params.id)
    this.props.startSetEvent(this.props.match.params.id)
    this.props.startSetEvents(this.props.match.params.id, this.state.count)
  }

  deleteCheck = () => {
    this.props.startDeleteCheck(this.props.match.params.id)
    this.setState({
      isLoading: true
    })
    this.props.startDeleteCheck(this.props.match.params.id)
      .then((res) => {
        if (res) {
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

  pauseCheck = () => {
    this.setState({
      isLoading: true
    })
    this.props.startPauseCheck(this.props.match.params.id)
      .then(() => {
        this.setState({
          isLoading: false
        })
        this.props.startSetCheck(this.props.match.params.id)
        this.props.startSetEvents(this.props.match.params.id, this.state.count)
      })

  }

  render() {
    let hours = this.props.log && this.props.log.hours
    let hour = hours && hours.map((hour) => { return hour + 'h' })
    let hourlyAvg = [0];

    let days = this.props.log && this.props.log.days
    let day = days && days.map((day) => {
      if (day === 1)
        return 'Monday'
      if (day === 2)
        return 'Tuesday'
      if (day === 3)
        return 'Wednesday'
      if (day === 4)
        return 'Thursday'
      if (day === 5)
        return 'Friday'
      if (day === 6)
        return 'Saturday'
      if (day === 0)
        return 'Sunday'
    })
    let dayAvg = [0];

    if (this.props.log && this.props.log.hour.length !== null) {
      hourlyAvg = [];
      for (let hourValue of hours)
        hourlyAvg.push(this.props.log.hour[hourValue]);
    }

    if (this.props.log && this.props.log.weekDayAvg.length !== null) {
      dayAvg = [];
      for (let dayValue of days)
        dayAvg.push(this.props.log.weekDayAvg[dayValue]);
    }


    var data = {
      labels: !this.props.log ? [0] : hour,
      datasets: [
        {
          label: "Average response time in the last 24 hours (in ms)",
          pointRadius: 4,
          backgroundColor: [
            'rgba(0, 149, 255, 0.1)'
          ],
          borderColor: [
            'rgb(0, 149, 255)'
          ],
          data: !this.props.log ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : hourlyAvg
        }

      ]
    };
    var weekData = {
      labels: !this.props.log ? [] : day,
      datasets: [
        {
          label: "Average response time for every day in last week (in ms)",
          pointRadius: 4,
          backgroundColor: [
            'rgba(255, 87, 38, 0.1)'
          ],
          borderColor: [
            'rgb(255, 87, 38)'
          ],
          data: !this.props.log ? [0, 0, 0, 0, 0, 0, 0,] : dayAvg
        }

      ]
    };

    var monthData = {
      labels: !this.props.log ? [] : day,
      datasets: [
        {
          label: "Average response time for every day in last month (in ms)",
          pointRadius: 4,
          backgroundColor: [
            'rgba(130, 130, 130, 0.1)'
          ],
          borderColor: [
            'rgb(130, 130, 130)'
          ],
          data: !this.props.log ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : dayAvg
        }

      ]
    };
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard">
          <div className="dashboard-title">
            <Link className="check-form-button-cancel dashboard-title-left" to={`/user/dashboard`}>Go back to dashboard</Link>
            <h2>{!this.props.check ? <span>Loading...</span> : <Link target="_blank" to={`http://${this.props.check.url}`}>{this.props.check.url}</Link>}</h2>
            <div className="dashboard-title-right"></div>
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
            <ReactPlaceholder style={{ marginTop: '20px', height: '23px', opacity: '0.5' }} howLoadingAnimation type='text' rows={1} ready={!this.props.loading}>
              <div>{this.props.check && this.renderBar()}</div>
            </ReactPlaceholder>
          </div>
        </div>
        {/* <div>{this.props.check && this.renderMoreInfo()}</div> */}
        <div className="dashboard-bottom">
          <div className="dashboard-bottom-left">
            {this.props.check && this.renderMoreInfo()}
          </div>
          <div className="dashboard-bottom-right">
            <div>
              {this.props.check && <button disabled={this.state.isLoading} onClick={this.pauseCheck} style={{ marginRight: '5px', padding: '8px' }} className="dashboard-button">{this.props.check.pause ? <span>Start</span> : <span>Pause</span>}</button>}
              <Link style={{ marginRight: '5px', padding: '6px 20px' }} className="dashboard-button" to={`/user/${this.props.match.params.id}/edit-check`}>Edit</Link>
              <button onClick={this.openModal} className="dashboard-button-delete">Delete</button>
              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                className="modal"
                contentLabel="Delete check"
              >
                <h2 className="modal__title" ref={subtitle => this.subtitle = subtitle}>Confirm delete check</h2>

                <p className="modal__body">Are you sure you want to delete this check?</p>
                <button className="modal-button" onClick={this.deleteCheck} disabled={this.state.isLoading}>Yes, delete it</button>
                <button className="modal-button-cancel" onClick={this.closeModal}>Cancel</button>

              </Modal>
            </div>
            <div className="dashboard-check-info">
              <p>*Automatic browser refresh occurres once every minute.</p>
              <p>*Click on the check to refresh manually.</p>
              <p>*After editing or unpausing check wait up to 3 minutes to see change.</p>
            </div>
          </div>
        </div>
        <Line
          data={data}
          width={100}
          height={40}
          options={{
            maintainAspectRatio: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 20,
                bottom: 20
              }
            },
            legend: {
              display: true,
              labels: {
                boxWidth: false
              }
            },
            elements: {
              line: {
                tension: 0, // disables bezier curves
              }
            }
          }}
        ></Line>
        <div className='dashboard-statistics'>
          <h2 className='dashboard-statistics-title'>Statistics</h2>
          <div className='dashboard-statistics-timeInfo'>
            <div className='dashboard-statistics-timeInfo-left'>
              <h3>Uptime</h3>
              <p>Last 24 hours: <span>{!this.props.stats || this.props.stats === null ? <span>wait...</span> : `${this.props.stats.dayUpAvg}%`}</span></p>
              <p>Last week: <span>{!this.props.stats || this.props.stats === null ? <span>wait...</span> : `${this.props.stats.weekUpAvg}%`}</span></p>
              <p>Last month: <span>{!this.props.stats || this.props.stats === null ? <span>wait...</span> : `${this.props.stats.monthUpAvg}%`}</span></p>
            </div>
            <div className='dashboard-statistics-timeInfo-center'>
              <h3>Downtime</h3>
              <p>Last 24 hours: <span>{!this.props.stats || this.props.stats === null ? <span>wait...</span> : `${this.props.stats.dayDownAvg}%`}</span></p>
              <p>Last week: <span>{!this.props.stats || this.props.stats === null ? <span>wait...</span> : `${this.props.stats.weekDownAvg}%`}</span></p>
              <p>Last month: <span>{!this.props.stats || this.props.stats === null ? <span>wait...</span> : `${this.props.stats.monthDownAvg}%`}</span></p>
            </div>
            <div className='dashboard-statistics-timeInfo-right'>
              <h3>Avg Response Time</h3>
              <p>Last 24 hours: <span>{!this.props.log ? <span>wait...</span> : Math.round(this.props.log.dailyAvg) + ' ms'}</span></p>
              <p>Last week: <span>{!this.props.log ? <span>wait...</span> : Math.round(this.props.log.weeklyAvg) + ' ms'}</span></p>
              <p>Last month: <span>{!this.props.log ? <span>wait...</span> : Math.round(this.props.log.monthlyAvg) + ' ms'}</span></p>
            </div>
          </div>
          <Line
            data={weekData}
            width={100}
            height={40}
            options={{
              maintainAspectRatio: true,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              },
              layout: {
                padding: {
                  left: 0,
                  right: 0,
                  top: 20,
                  bottom: 20
                }
              },
              legend: {
                display: true,
                labels: {
                  boxWidth: false
                }
              },
              elements: {
                line: {
                  tension: 0, // disables bezier curves
                }
              }
            }}
          ></Line>
          {/* <Line
                data={monthData}
                width={100}
              	height={20}
                options={{
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero:true
                      }
                    }]
                  },
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      top: 20,
                      bottom: 20
                    }
                  },
                  legend: {
                    display: true,
                    labels: {
                      boxWidth: false
                    }
                  },
                  elements: {
                    line: {
                        tension: 0, // disables bezier curves
                    }
                  }
              	}}
                ></Line> */}
        </div>
        <div className='dashboard-events-container'>
          <h2 className='dashboard-events-title'>Events</h2>
          <div>
            <div className='dashboard-events'>
              <h3>Event</h3><h3 style={{ display: 'flex', justifyContent: 'center' }}>Time</h3><h3 style={{ display: 'flex', justifyContent: 'center' }}>Reason</h3><h3 style={{ display: 'flex', justifyContent: 'flex-end' }}>Duration</h3>
            </div>

            {this.props.events && this.renderEvents()}

            <div className='dashboard-events-footer'>
              <div className='dashboard-events-footer-left'>
                <span style={{ opacity: '0.6' }}>Total pages: {this.props.events && this.props.events.pages}</span>
              </div>
              <div className='dashboard-events-footer-center'>
                {this.state.count === 0 ? <span className='dashboard-events-footer-center-span-disabled'>Previous page </span> : <span className='dashboard-events-footer-center-span-active' value='-' onClick={this.decrementCounter}>Previous page </span>}
                - {this.state.count + 1} -
                  {this.props.events && (this.state.count === this.props.events.pages - 1) ? <span className='dashboard-events-footer-center-span-disabled'> Next page</span> : <span className='dashboard-events-footer-center-span-active' value='+' onClick={this.incrementCounter}> Next page</span>}
              </div>
              <div className='dashboard-events-footer-right'>
                <span style={{ opacity: '0.6' }}>Total events: {this.props.events && this.props.events.totalEvents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  check: state.check.check,
  log: state.log.log,
  stats: state.log.logStats,
  event: state.event.event,
  events: state.event.events,
  loading: state.check.checkIsLoading
})

export default connect(mapStateToProps, {
  startSetCheck,
  startDeleteCheck,
  clearCheckState,
  startPauseCheck,
  startSetLog,
  startSetEvent,
  startSetLogStats,
  startSetEvents,
  clearLogState
})(CheckSingle);
