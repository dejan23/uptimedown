import React from 'react';

const About = () => (
  <div className="about-solo">
    <div className="about-solo-wrapper">
      <div className="about-solo-title"><h1>About Uptimedown</h1></div>
      <div className="about-solo-content">
        <div className="about-solo-content-item">
          <h3>Monitoring</h3>
          <p>We monitor your site to verify that your site works.
            Every three minutes we perform a check to see if your server is up.</p>

          <h3>How it works</h3>
          <ul>
            <li><i className="fas fa-arrow-right"></i> It asks for your websites headers and gets status codes like
               "200-ok", "404-not found", every 3 minutes</li>
            <li><i className="fas fa-arrow-right"></i> If the returned status code is etc. "200", "201", "301", it's all good</li>
            <li><i className="fas fa-arrow-right"></i> If the status code is "400+" and "500+", or there is not any, then there is some kind of a problem</li>
            <li><i className="fas fa-arrow-right"></i> If the site is not responding for the next 3 to 30 seconds we will consider that the site is down,
              and the alert will be sent to you.</li>
          </ul>

          <h3>Server location</h3>
          <p>Monitoring is performed from the server located in Paris.</p>
        </div>
      </div>

      <div style={{marginTop: '30px'}} className="about-solo-content-codes">
        <h3>HTTP Status Codes</h3>
          <div className="about-solo-content-item-codes">
          <div>
            <p style={{fontWeight: '500'}}>1×× Informational</p>
            <p>100 Continue</p>
            <p>101 Switching Protocols</p>
            <p>102 Processing</p> <br />
          </div>
          <div>
            <p style={{fontWeight: '500'}}>2×× Success</p>
            <p>200 OK</p>
            <p>201 Created</p>
            <p>202 Accepted</p>
            <p>203 Non-authoritative Information</p>
            <p>204 No Content</p>
            <p>205 Reset Content</p>
            <p>206 Partial Content</p>
            <p>207 Multi-Status</p>
            <p>208 Already Reported</p>
            <p>226 IM Used</p> <br />
          </div>
          <div>
            <p style={{fontWeight: '500'}}>3×× Redirection</p>
            <p>300 Multiple Choices</p>
            <p>301 Moved Permanently</p>
            <p>302 Found</p>
            <p>303 See Other</p>
            <p>304 Not Modified</p>
            <p>305 Use Proxy</p>
            <p>307 Temporary Redirect</p>
            <p>308 Permanent Redirect</p> <br />
          </div>
          <div>
            <p style={{fontWeight: '500'}}>4×× Client Error</p>
            <p>400 Bad Request</p>
            <p>401 Unauthorized</p>
            <p>402 Payment Required</p>
            <p>403 Forbidden</p>
            <p>404 Not Found</p>
            <p>405 Method Not Allowed</p>
            <p>406 Not Acceptable</p>
            <p>407 Proxy Authentication Required</p>
            <p>408 Request Timeout</p>
            <p>409 Conflict</p> <br />
          </div>
          <div>
            <p style={{fontWeight: '500'}}>5×× Server Error</p>
            <p>500 Internal Server Error</p>
            <p>501 Not Implemented</p>
            <p>502 Bad Gateway</p>
            <p>503 Service Unavailable</p>
            <p>504 Gateway Timeout</p>
            <p>505 HTTP Version Not Supported</p>
            <p>599 Network Connect Timeout Error</p> <br />
          </div>
        </div>
        <a target="_blank" href="https://httpstatuses.com/">See more info</a>
      </div>
    </div>
  </div>
)

export default About
