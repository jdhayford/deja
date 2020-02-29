import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'connected-react-router';
import { Main } from './Frames';
import GlobalCssStyles from './utils/GlobalCssStyles';
import { createReduxStore, history } from './store';

const store = createReduxStore();

window.store = store;
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Main />
        </ConnectedRouter>
        <GlobalCssStyles />
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root') || document.createElement('div'));
