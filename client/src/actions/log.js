import axios from 'axios';
import _ from 'lodash'

export const logIsLoading = (bool) => ({
  type: 'LOG_IS_LOADING',
  payload: bool
});

export const clearLogState = () => ({
  type: 'CLEAR_LOG_STATE'
});

// SET_LOG
export const setLog = log => ({
  type: 'SET_LOG',
  payload: log
});

export const startSetLog = (id) => {
  return async dispatch => {
    dispatch(logIsLoading(true))
    return axios.get(`${process.env.API_URL}/log/${id}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      await dispatch(setLog(response.data));
    })
    .catch(error => {
      dispatch(logIsLoading(false))
      console.log(error.response.data.message)
    })
  };
};

// SET_LOG_STATS
export const setLogStats = log => ({
  type: 'SET_LOG_STATS',
  payload: log
});

export const startSetLogStats = (id) => {
  return async dispatch => {
    dispatch(logIsLoading(true))
    return axios.get(`${process.env.API_URL}/logStats/${id}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      await dispatch(setLogStats(response.data));
    })
    .catch(error => {
      dispatch(logIsLoading(false))
      console.log(error.response.data.message)
    })
  };
};
