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
import Alert from './components/Alert';
import Authentication from './components/Authentication';

import Home from './components/Home';
import User from './components/User';
import ProductDetail from './components/ProductDetail';
import ProductSearch from './components/ProductSearch';
import StoreLocation from './components/StoreLocation';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ContactUs from './components/ContactUs';
import TermsConditions from './components/TermsConditions';

import './App.css';

function App() {
    const [ {}, dispatch ] = useStateValue();
    const [ promise, setPromise ] = useState('');

    const [ login, setLogin ] = useState(false);

    const [ alert, setAlert ] = useState(false);
    const [ alertStatus, setAlertStatus ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState('');

    // open login modal
    const openLogin = (mode) => setLogin(mode);

    // open alert modal
    const openAlert = (mode, status, message) => {
        setAlert(mode);
        setAlertStatus(status);
        setAlertMessage(message);
    };

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

                    {/* header */}
                    <Header openLogin={openLogin} />
                    
                    {/* body */}
                    <Switch>
                        <Route exact path='/'>
                            <Home />
                        </Route>
                        <Route path='/product'>
                            <ProductDetail openAlert={openAlert} openLogin={openLogin} />
                        </Route>
                        <Route path='/checkout'>
                            {promise && <Elements stripe={promise}>
                                <Checkout openAlert={openAlert} />
                            </Elements>}

                            {!promise && <div style={{ height: '50vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                        </Route>
                        <Route path='/store-locations'>
                            <StoreLocation />
                        </Route>
                        <Route path='/contact-us'>
                            <ContactUs openAlert={openAlert} />
                        </Route>
                        <Route path='/cart'>
                            <Cart />
                        </Route>
                        <Route path='/user'>
                            <User openAlert={openAlert} openLogin={openLogin} />
                        </Route>
                        <Route path='/terms-and-conditions'>
                            <TermsConditions />
                        </Route>
                        <Route path='/'>
                            <ProductSearch />
                        </Route>
                    </Switch>

                    {/* footer */}
                    <Footer />

                    {/* modal and alerts */}
                    {login && <Authentication login={login} openLogin={openLogin} openAlert={openAlert} />}
                    {alert && <Alert status={alertStatus} message={alertMessage} alert={alert} openAlert={openAlert} />}

                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}

export default App;
