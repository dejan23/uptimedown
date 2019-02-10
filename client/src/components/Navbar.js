import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

class Navbar extends React.Component {
  renderLinks () {
    if(this.props.authenticated) {
      return (
        <div className="header-content-right-dynamic">
          <div className="header-content-item">
            <NavLink activeClassName="active-navlink" to={`/user/dashboard`}>
              Dashboard
            </NavLink>
          </div>
          <div className="header-content-item">
            <NavLink activeClassName="active-navlink" to={`/user/account-settings`}>
              Account Settings
            </NavLink>
          </div>
          <div className="header-content-item">
            <NavLink activeClassName="active-navlink" to="/logout">
              Logout
            </NavLink>
          </div>
        </div>
      )
    } else {
      return (
        <div className="header-content-right-dynamic">
          <div className="header-content-item">
            <NavLink activeClassName="active-navlink" to={`/signup`}>
              Signup
            </NavLink>
          </div>
          <div className="header-content-item">
            <NavLink activeClassName="active-navlink" to={`/login`}>
              Login
            </NavLink>
          </div>
        </div>
      )
    }
  }


  render() {
    return (
      <div className="header">
        <div className="content-wrapper">
          <div className="header-content">
              <div className="header-content-left">
                <div className="header-brand">
                  <NavLink to="/">
                    Uptime<span>down</span><span style={{fontWeight: '300', fontSize: '13px'}}>(Beta)</span>
                  </NavLink>
                </div>

              </div>
              <div className="header-content-right">
                <div className="header-content-right-static">
                  <div className="header-content-item">
                    <NavLink exact activeClassName="active-navlink" to="/">
                    Home
                    </NavLink>
                  </div>

                  <div className="header-content-item">
                    <NavLink activeClassName="active-navlink" to="/about">
                    About
                    </NavLink>
                  </div>

                  <div className="header-content-item">
                    <NavLink activeClassName="active-navlink" to="/contact">
                      Contact
                    </NavLink>
                  </div>

                  <div className="header-content-item">
                    <span>|</span>
                  </div>

              </div>
              {this.renderLinks()}

            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  }
}

export default connect(mapStateToProps, null)(Navbar);
