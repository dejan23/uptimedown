import axios from 'axios';
import {history} from '../routers/AppRouter';

export const successMessage = (message) => ({
    type: 'SUCCESS_MESSAGE',
    payload: message
})

export const clearMessage2 = () => ({
    type: 'CLEAR_MESSAGE',
    payload: null
})

export const checkIsLoading = (bool) => ({
  type: 'CHECK_IS_LOADING',
  payload: bool
});

export const clearCheckState = () => ({
  type: 'CLEAR_CHECK_STATE'
});


// ADD_CHECK
export const startAddCheck = (values) => {
  return dispatch => {
    return axios.post(`${process.env.API_URL}/checks`, values,
        {
          headers: {authorization: localStorage.getItem('token')}
        }
      )
      .then(response => {
        history.push('/user/dashboard');
      })
  };
}

// SET_CHECKS ALL
export const setChecks = checks => ({
  type: 'SET_CHECKS',
  payload: checks
});

export const startSetChecks = () => {
  return async dispatch => {
    dispatch(checkIsLoading(true))
    return axios.get(`${process.env.API_URL}/checks/:id`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      await dispatch(setChecks(response.data.checks));
    })
    .catch(error => {
      dispatch(checkIsLoading(false))
      console.log(error.response.data.message)
    })
  };
};

// SET_CHECK
export const setCheck = check => ({
  type: 'SET_CHECK',
  payload: check
});

export const startSetCheck = (id) => {
  return async dispatch => {
    dispatch(checkIsLoading(true))
    return axios.get(`${process.env.API_URL}/checks/${id}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      await dispatch(setCheck(response.data.check));
    })
    .catch(error => {
      dispatch(checkIsLoading(false))
      console.log(error.response.data.message)
    })
  };
};

// SET_CHECK
export const setCheckCount = checkCount => ({
  type: 'SET_CHECK_COUNT',
  payload: checkCount
});

export const startSetCheckCount = () => {
  return async dispatch => {
    dispatch(checkIsLoading(true))
    return axios.get(`${process.env.API_URL}/accounts/user`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      await dispatch(setCheckCount(response.data.user.checks.length));
    })
    .catch(error => {
      dispatch(checkIsLoading(false))
      console.log(error.response.data.message)
    })
  };
};

// EDIT_CHECK
export function startEditCheck(values, id) {
  return dispatch => {
    return axios.put(`${process.env.API_URL}/checks/${id}`, values,
        {
          headers: {authorization: localStorage.getItem('token')}
        }
      )
      .then(response => {
        history.push(`/user/${id}`);
      })
  };
}

// DELETE_CHECK
export const startDeleteCheck = (id) => {
  return async dispatch => {
    return axios.delete(`${process.env.API_URL}/checks/${id}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      history.push('/user/dashboard')
    })
    .catch(error => {
      dispatch(checkIsLoading(false))
      console.log(error.response.data.message)
    })
  };
};

// Pause check
export const startPauseCheck = (id) => {
  return async dispatch => {
    return axios.get(`${process.env.API_URL}/check/pause/${id}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error.response.data.message)
    })
  };
};
