import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ThemeProvider } from '@material-ui/core/styles';

import axios from './services/axios';
import { auth } from './services/firebase';
import { fetchUserById } from './services/Gateway';
import { useStateValue } from './services/StateProvider';
import { theme } from './stylesheets/Theme';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import ProductSearch from './components/ProductSearch';
import Checkout from './components/Checkout';
import StoreLocation from './components/StoreLocation';
import ContactUs from './components/ContactUs';
import './App.css';

function App() {
    const [ {}, dispatch ] = useStateValue();
    const [ promise, setPromise ] = useState('');

    useEffect(() => {
        // fetch and set user
        auth.onAuthStateChanged(authUser => {
            if (authUser) {
                fetchUserById(authUser.uid).then(user => {
                    if (user)
                        dispatch({ type: 'SET_USER', user: user });
                });
            }
            else {
                dispatch({ type: 'SET_USER', user: null });
            }
        });

        // fetch stripe key
        const getPromise = async () => {
            await axios.get('/key').then((response) => {
                setPromise(loadStripe(response.data));
            });
        };

        getPromise();

        // eslint-disable-next-line
    }, []);

    return (
        <div className='app'>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Header />
                    
                    <Switch>
                        <Route exact path='/'>
                            <Home />
                        </Route>
                        <Route path='/product'>
                            <ProductDetail />
                        </Route>
                        <Route path='/checkout'>
                            {promise && <Elements stripe={promise}>
                                <Checkout />
                            </Elements>}

                            {!promise && <div style={{ height: '50vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                        </Route>
                        <Route path='/store-locations'>
                            <StoreLocation />
                        </Route>
                        <Route path='/contact-us'>
                            <ContactUs />
                        </Route>
                        <Route path='/cart'>
                            <h1>cart</h1>
                        </Route>
                        <Route path='/user'>
                            <User />
                        </Route>
                        <Route path='/'>
                            <ProductSearch />
                        </Route>
                    </Switch>

                    <Footer />
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}

export default App;
