import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/main.scss';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import LoadingPage from './components/LoadingPage';
import { AUTH_USER } from './actions/types';
import AppRouter from './routers/AppRouter';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </Provider>
)

let hasRender = false;
const renderApp = () => {
  if(!hasRender) {
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRender = true
  }
}

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

const token = localStorage.getItem('token')
if (token) {
  store.dispatch({ type: AUTH_USER })
  renderApp()
} else {
  renderApp()
}
