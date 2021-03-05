import React from 'react';
import ReactDOM from 'react-dom';

import { StateProvider } from './services/StateProvider';
import reducer, { initialState } from './services/Reducer';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <StateProvider reducer={reducer} initialState={initialState}>
            <App />
        </StateProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
