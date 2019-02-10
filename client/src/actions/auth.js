import axios from 'axios';
import {history} from '../routers/AppRouter';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  CLEAR_MESSAGE,
  CLEAR_ALERT,
  SUCCESS_MESSAGE
} from './types';


export const clearAlert = () => ({
  type: CLEAR_ALERT
})

export const authError = (error) => ({
  type: AUTH_ERROR,
  payload: error
})

export const successMessage = (message) => ({
    type: SUCCESS_MESSAGE,
    payload: message
})

export const clearMessage = () => ({
    type: CLEAR_MESSAGE,
    payload: null
})

export function registerUser(formData) {
  return function(dispatch) {
    return axios.post(`${process.env.ROOT_URL}/api/accounts/signup`, formData)
    .then(response => {
      dispatch(successMessage(response.data.message))
      return response.data.success
    })
    .catch(error => dispatch(authError(error.response.data.message)));
  };
}

export function loginUser(formData) {
  return function(dispatch) {
    return axios.post(`${process.env.ROOT_URL}/api/accounts/login`, formData)
      .then(async (response) => {
        await localStorage.setItem('username', response.data.username);
        await localStorage.setItem('id', response.data.id);
        await localStorage.setItem('token', response.data.token);
        await dispatch({
          type: AUTH_USER
        });
        await dispatch(successMessage(response.data.message))
        return response.data.success
      })
      .catch(error => dispatch(authError(error.response.data.message)));
  };
}



export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('id');
  return {type: UNAUTH_USER};
}

export const setUserProfile = profile => ({
  type: 'SET_USER_PROFILE',
  payload: profile
});

export function startSetUserProfile() {
  return function(dispatch) {
    return axios.get(`${process.env.ROOT_URL}/api/accounts/profile`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(response => {
      dispatch(setUserProfile(response.data.user))
    })
    .catch(error => dispatch(authError(response.data.message)));
  };
}

export function startSetResetPassword({currentPassword, newPassword}) {
  return function(dispatch) {
    return axios.post(`${process.env.ROOT_URL}/api/accounts/reset-password`, {currentPassword, newPassword}, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(response => {
      // dispatch(successMessage(response.data.message))
      return response.data.message;
    })
    .catch((error) => {
      if(error.response) {
        return dispatch(authError(error.response.data.message));
      }
      dispatch(authError('Connection error'));
    })
  };
}

export function startSetDeleteUser() {
  return dispatch => {
    return axios.delete(`${process.env.ROOT_URL}/api/accounts/user`, {
      headers: {authorization: localStorage.getItem('token')}
    })
      .then(response => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        history.push('/logout');
        dispatch({
          type: AUTH_USER
        });
      })
      .catch((error) => {
        return error.response.data
      })
  };
};
