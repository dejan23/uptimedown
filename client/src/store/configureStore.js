import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/index';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = compose;

export default () => {
  const store = createStore(
    combineReducers(reducers),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
}
