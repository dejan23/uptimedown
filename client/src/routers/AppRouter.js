import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../components/HomePage';
import Signup from '../components/Signup';
import ValidateUser from '../components/ValidateUser';
import ResendEmail from '../components/ResendEmail';
import ResetPasswordByEmail from '../components/ResetPasswordByEmail';
import ActivateNewPassword from '../components/ActivateNewPassword';
import Login from '../components/Login';
import Logout from '../components/Logout';
import Features from '../components/Features';
import About from '../components/About';
import Contact from '../components/Contact';

import Dashboard from '../components/user/Dashboard';
import CheckSingle from '../components/user/CheckSingle';
import CheckNew from '../components/user/CheckNew';
import CheckEdit from '../components/user/CheckEdit';
import AccountOptions from '../components/user/AccountOptions';

import NotFoundPage from '../components/NotFoundPage';


export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
      <div className="container">
        <Route path='/' component={Navbar}/>
        <Switch>
          <Route exact path='/' component={HomePage}/>
          <PublicRoute exact path='/signup' component={Signup}/>
          <PublicRoute exact path='/accounts/validate/:id' component={ValidateUser}/>
          <PublicRoute exact path='/accounts/resend-email' component={ResendEmail}/>
          <PublicRoute exact path='/accounts/reset-password' component={ResetPasswordByEmail}/>
          <PublicRoute exact path='/accounts/activate-new-password/' component={ActivateNewPassword}/>
          <PublicRoute exact path='/login' component={Login}/>
          <PublicRoute exact path='/logout' component={Logout}/>
          {/* <PublicRoute exact path='/features' component={Features}/> */}
          <PublicRoute exact path='/about' component={About}/>
          <PublicRoute exact path='/contact' component={Contact}/>
          <PrivateRoute exact path='/user/account-settings' component={AccountOptions}/>
          <PrivateRoute exact path='/user/account-password' component={AccountOptions}/>
          <PrivateRoute exact path='/user/account-delete' component={AccountOptions}/>
          <PrivateRoute exact path='/user/new-check' component={CheckNew}/>
          <PrivateRoute exact path='/user/:id/edit-check' component={CheckEdit}/>
          <PrivateRoute exact path='/user/dashboard' component={Dashboard}/>
          <PrivateRoute exact path='/user/:id' component={CheckSingle}/>
          <Route component={NotFoundPage} />
        </Switch>
        <Footer />
      </div>
  </Router>
)

export default AppRouter;
