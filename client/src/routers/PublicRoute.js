import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

export const PublicRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route {...rest} component={(props) => (
    isAuthenticated && props.match.path === '/login' ||
    isAuthenticated && props.match.path === '/signup' ||
    isAuthenticated && props.match.path === '/register/success' ||
    isAuthenticated && props.match.path === '/auth/verify/:token' ||
    isAuthenticated && props.match.path === '/auth/resend'
     ? (
      <Redirect to="/user/dashboard" />
    ) : (
      <div>
        <Component {...props}/>
      </div>
    )
  )}/>
)

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.authenticated
})

export default connect(mapStateToProps)(PublicRoute)
