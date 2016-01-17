/**
 *
 * app.js
 *
 * This is the entry file for the application, mostly just setup and boilerplate
 * code. Routes are configured at the end of this file!
 *
 */

// Load the ServiceWorker, the Cache polyfill, the manifest.json file and the .htaccess file
import 'file?name=[name].[ext]!./serviceworker.js';
import 'file?name=[name].[ext]!./manifest.json';
import 'file?name=[name].[ext]!./.htaccess';

// Check for ServiceWorker support before trying to install it
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js').then(() => {
    // Registration was successful
  }).catch(() => {
    // Registration failed
  });
} else {
  // No ServiceWorker Support
}

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import FontFaceObserver from 'fontfaceobserver';
import { browserHistory } from 'react-router';

// Observer loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add the js-open-sans-loaded class to the body
openSansObserver.check().then(() => {
  document.body.classList.add('js-open-sans-loaded');
}, () => {
  document.body.classList.remove('js-open-sans-loaded');
});

// Import the pages
import App from './containers/App/App.react';

// Import the CSS file, which HtmlWebpackPlugin transfers to the build folder
import '../node_modules/sanitize.css/dist/sanitize.min.css';

// Create the store with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
import rootReducer from './rootReducer';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

// Make reducers hot reloadable, see http://mxs.is/googmo
if (module.hot) {
  module.hot.accept('./rootReducer', () => {
    const nextRootReducer = require('./rootReducer').default;
    store.replaceReducer(nextRootReducer);
  });
}

// Mostly boilerplate, except for the Routes. These are the pages you can go to,
// which are all wrapped in the App component, which contains the navigation etc
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
        <Route
          path="/"
          getComponent={function get(location, cb) {
            require.ensure(['./containers/HomePage/HomePage.react'], (require) => {
              const HomePage = require('./containers/HomePage/HomePage.react');
              cb(null, HomePage.default);
            }, 'HomePage');
          }}
        />
        <Route
          path="/readme"
          getComponent={function get(location, cb) {
            require.ensure(['./containers/ReadmePage/ReadmePage.react'], (require) => {
              const ReadmePage = require('./containers/ReadmePage/ReadmePage.react');
              cb(null, ReadmePage.default);
            }, 'ReadmePage');
          }}
        />
        <Route
          path="*"
          getComponent={function get(location, cb) {
            require.ensure(['./containers/NotFoundPage/NotFound.react'], (require) => {
              const NotFoundPage = require('./containers/NotFoundPage/NotFound.react');
              cb(null, NotFoundPage.default);
            }, 'NotFoundPage');
          }}
        />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);