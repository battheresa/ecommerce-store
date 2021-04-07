import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';

import { auth } from '../services/firebase';
import { fetchUserById } from '../services/Gateway';
import { useStateValue } from '../services/StateProvider';

import '../stylesheets/Authentication.css';

function Authentication({ login, openLogin, openAlert }) {
    const [ {}, dispatch ] = useStateValue();
    const [ menu, setMenu ] = useState(true);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    // mouse click listener
    useEffect(() => {
        const clickOutside = (event) => {
            if (event.target.id === 'authentication')
                openLogin(false);
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };

        // eslint-disable-next-line
    }, []);

    // update user
    const updateUser = () => {
        openLogin(false);

        setEmail('');
        setPassword('');

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
    };

    // login
    const handleLogin = (event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email, password).then((auth) => {
            if (auth) 
                updateUser();
        }).catch((error => {
            openAlert(true, false, error.message);
        }));
    };

    // signup 
    const handleSignup = (event) => {
        event.preventDefault();

        auth.createUserWithEmailAndPassword(email, password).then((auth) => {
            if (auth) 
                updateUser();
        }).catch(error => {
            openAlert(true, false, error.message);
        });
    };

    return (
        <div id='authentication' className='modal-background' style={{ display: `${login ? 'flex' : 'none'}` }}>
            <div className='authentication__modal'>

                {/* login modal menu */}
                <div className='authentication__menu'>
                    <h1 style={{ color: `${menu ? 'black' : '#CCCCCC'}` }} onClick={() => setMenu(true)}><small>LOGIN</small></h1>
                    <h1 style={{ color: `${menu ? '#CCCCCC' : 'black'}` }} onClick={() => setMenu(false)}><small>SIGNUP</small></h1>
                </div>

                {/* login modal form */}
                <form onSubmit={(e) => menu ? handleLogin(e) : handleSignup(e)} className='authentication__form'>
                    <TextField type='email' placeholder='EMAIL ADDRESS' value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '15px' }} required />
                    <TextField type='password' placeholder='PASSWORD' value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: '15px' }} required />
                    <Button variant='contained' color='primary' type='submit'><p className='font-bold font-wide'>{menu ? 'LOGIN' : 'SIGNUP'}</p></Button>
                </form>
            </div>
        </div>
    );
}

export default Authentication;
