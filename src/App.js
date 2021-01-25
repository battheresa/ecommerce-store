import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import axios from './axios';
import Checkout from './components/Checkout';

import './App.css';


function App() {
    const [ promise, setPromise ] = useState('');

    useEffect(() => {
        const getPromise = async () => {
            await axios.get('/key').then((response) => {
                setPromise(loadStripe(response.data));
            });
        };

        getPromise();
    }, []);

    return (
        <div className='app'>
            {promise && <Elements stripe={promise}>
                <Checkout />
            </Elements>}
        </div>
    );
}

export default App;
