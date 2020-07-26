import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from "react-redux";
import * as serviceWorker from './serviceWorker';
// import createStore from "redux";

// const store = createStore(window.REDUX_DATA)

ReactDOM.hydrate(
    <BrowserRouter>
        <App />
    </BrowserRouter>, document.getElementById('root'));

serviceWorker.register();