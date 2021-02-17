import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import axios from './axios';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import ProductSearch from './components/ProductSearch';
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

            {/*
            {promise && <Elements stripe={promise}>
            <Checkout />
            </Elements>}
            */}

            <BrowserRouter>
                <Header />
                
                <Switch>
                    <Route exact path='/'>
                        <Home />
                    </Route>
                    <Route path='/product'>
                        <ProductDetail />
                    </Route>
                    <Route path='/store-locations'>
                        <h1>store locations</h1>
                    </Route>
                    <Route path='/cart'>
                        <h1>cart</h1>
                    </Route>
                    <Route path='/'>
                        <ProductSearch />
                    </Route>
                </Switch>

                <Footer />
            </BrowserRouter>
            
        </div>
    );
}

export default App;
