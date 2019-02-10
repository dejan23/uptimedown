import { combineReducers } from 'redux';
import { reducer as formReducer} from 'redux-form';
import authReducer from './authReducer';
import userReducer from './userReducer';
import checkReducer from './checkReducer';
import logReducer from './logReducer';
import eventReducer from './eventReducer';

const rootReducer = {
  auth: authReducer,
  check: checkReducer,
  event: eventReducer,
  form: formReducer,
  log: logReducer,
  user: userReducer
};

export default rootReducer;
