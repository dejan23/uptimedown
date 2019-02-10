import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  SUCCESS_MESSAGE,
  CLEAR_MESSAGE,
  CLEAR_ALERT
} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case AUTH_USER:
      return { ...state, authenticated: true, id: localStorage.getItem('id') }
    case UNAUTH_USER:
      return { ...state, authenticated: false }
    case AUTH_ERROR:
      return { ...state, error: action.payload }
    case SUCCESS_MESSAGE:
      return { ...state, success: action.payload, message: 'Saved' }
    case CLEAR_ALERT:
      return { ...state, error: null  }
    case CLEAR_MESSAGE:
      return { ...state, success: action.payload, message: null }
  }

  return state;
}
