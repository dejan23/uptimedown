import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


class HomePage extends React.Component {
  render() {
    return (
      <div>

        <div className="intro">
          <div className="intro-content-wrapper">
            <div className="intro-content">
                <h1>Uptime monitoring system</h1>
                <p>We offer free, super simple uptime monitoring for HTTP/HTTPS sites of
                all kinds. When your site goes down, we'll send you an email to let you know.</p>
                <p>Start monitoring your websites now, registration takes less then a minute.</p>
                <div className="intro-content-buttons">
                  <Link to="/signup" className="intro-content-button-start center-mobile">Get Started</Link>
                </div>
            </div>
          </div>
        </div>

        <div className="features">
          <div className="features-wrapper">
            <div className="features-title"><h1>Features</h1></div>
            <div className="features-content">
              <div className="features-content-item">
                <i className="fas fa-3x fa-desktop"></i>
                <h3>Monitoring</h3>
                <p>We monitor your site to verify that your site works.<br/>
                   Every three minutes we perform a check to see if your server is up.</p>
              </div>
              <div className="features-content-item">
                <i className="fas fa-3x fa-check"></i>
                <h3>Checks</h3>
                <p>You can set up to 25 websites to monitor. <br/>
                  We support checks for HTTP and HTTPS websites.</p>
              </div>
              <div className="features-content-item">
                <i className="fas fa-3x fa-chart-line"></i>
                <h3>Charts</h3>
                <p>You can see average response time for every hour in the last 24 hours, as well as for every day in the last week.</p>
              </div>

            </div>
            <div className="features-content" style={{marginTop: '20px'}}>

              <div className="features-content-item">
                <i className="fas fa-3x fa-bell"></i>
                <h3>Alert</h3>
                <p>We will alert you if your sites go down via email. <br/>
                  <i>(We will implement alerts via SMS in the future)</i></p>
              </div>
              <div className="features-content-item">
                <i className="fas fa-3x fa-clipboard-list"></i>
                <h3>Logs</h3>
                <p>You will have 3 months history logs. <br />
                   Also, you can view uptime, downtime percentage for the last day, week and month.
                </p>
              </div>
              <div className="features-content-item">
                <i className="fas fa-3x fa-pause"></i>
                <h3>Pause for maintenance</h3>
                <p>You can pause monitoring for maintenance time or whatever reason.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about">
          <div className="about-wrapper">
            <div className="about-title"><h1>About Uptimedown</h1></div>
            <div className="about-content no-border-bottom">
              <div className="about-content-item">
                <i className="fas fa-3x fa-desktop"></i>
                <h3>Monitoring</h3>
                <p>It monitors your websites every 3 minutes
                  and alerts you if your sites are down.</p>

                <h3>How it works</h3>
                <ul>
                  <li><i className="fas fa-arrow-right"></i> It asks for your websites headers and gets status codes like
                     "200-ok", "404-not found", every 3 minutes</li>
                  <li><i className="fas fa-arrow-right"></i> If the returned status code is etc. "200", "201", "301", it's all good</li>
                  <li><i className="fas fa-arrow-right"></i> If the status code is "400+" and "500+", or there is not any, then there is some kind of a problem</li>
                  <li><i className="fas fa-arrow-right"></i> If the site is not responding for the next 3 to 30 seconds we will consider that the site is down,
                    and the alert will be sent to you.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="contact">
          <div className="contact-wrapper">
            <div className="contact-title"><h1>Contact</h1></div>
            <div className="contact-content">
              <div className="contact-content-item">
                <i className="fas fa-3x fa-envelope"></i>
                <p>For any questions, suggestions and feedback you can contact me at <br />
                  <b>dejan.dvte@gmail.com</b></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default connect(null, null)(HomePage)
