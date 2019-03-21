import axios from 'axios';
import {history} from '../routers/AppRouter';
import _ from 'lodash'

export const clearEventState = () => ({
  type: 'CLEAR_EVENT_STATE'
});

export const eventIsLoading = (bool) => ({
  type: 'EVENT_IS_LOADING',
  payload: bool
});

// SET_EVENT
export const setEvent = event => ({
  type: 'SET_EVENT',
  payload: event
});

export const startSetEvent = (id) => {
  return async dispatch => {
    return axios.get(`${process.env.API_URL}/event/${id}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      await dispatch(setEvent(response.data));

    })
    .catch(error => {
      console.log(error.response.data.message)
    })
  };
};

// SET_EVENTS
export const setEvents = events => ({
  type: 'SET_EVENTS',
  payload: events
});

export const startSetEvents = (id, page) => {
  return async dispatch => {
    return axios.get(`${process.env.API_URL}/events/${id}?page=${page}`, {
      headers: {authorization: localStorage.getItem('token')}
    })
    .then(async (response) => {
      await dispatch(setEvents(response.data));

    })
    .catch(error => {
      console.log(error.response.data.message)
    })
  };
};
