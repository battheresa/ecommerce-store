import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';

import { auth } from '../services/firebase';
import { fetchUserById } from '../services/Gateway';
import { useStateValue } from '../services/StateProvider';

import Alert from './Alert';
import '../stylesheets/Authentication.css';

function Authentication({ open, setOpen }) {
    const [ {}, dispatch ] = useStateValue();
    const [ menu, setMenu ] = useState(true);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const [ alertModal, setAlertModal ] = useState(false);
    const [ alertStatus, setAlertStatus ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState('');

    // mouse click listener
    useEffect(() => {
        const clickOutside = (event) => {
            if (event.target.id === 'authentication')
                setOpen(false);
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };

        // eslint-disable-next-line
    }, []);

    // open alert modal
    const setOpenAlert = (status, message, mode) => {
        setAlertStatus(status);
        setAlertMessage(message);
        setAlertModal(mode);
    };

    // update user
    const updateUser = () => {
        setOpen(false);
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
    const login = (event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email, password).then((auth) => {
            if (auth) 
                updateUser();
        }).catch((error => {
            setOpenAlert(false, error.message, true);
        }));
    };

    // signup 
    const signup = (event) => {
        event.preventDefault();

        auth.createUserWithEmailAndPassword(email, password).then((auth) => {
            if (auth) 
                updateUser();
        }).catch(error => {
            console.log(error);
            setOpenAlert(false, error.message, true);
        });
    };

    return (
        <div id='authentication' className='modal-background' style={{ display: `${open ? 'flex' : 'none'}` }}>
            <div className='authentication__modal'>

                {/* login modal menu */}
                <div className='authentication__menu'>
                    <h1 style={{ color: `${menu ? 'black' : '#CCCCCC'}` }} onClick={() => setMenu(true)}><small>LOGIN</small></h1>
                    <h1 style={{ color: `${menu ? '#CCCCCC' : 'black'}` }} onClick={() => setMenu(false)}><small>SIGNUP</small></h1>
                </div>

                {/* login modal form */}
                <form onSubmit={(e) => menu ? login(e) : signup(e)} className='authentication__form'>
                    <TextField type='email' placeholder='EMAIL ADDRESS' value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '15px' }} required />
                    <TextField type='password' placeholder='PASSWORD' value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: '15px' }} required />
                    <Button variant='contained' color='primary' type='submit'><p className='font-bold font-wide'>{menu ? 'LOGIN' : 'SIGNUP'}</p></Button>
                </form>
            </div>

            {/* alert */}
            {alertModal && <Alert status={alertStatus} message={alertMessage} open={alertModal} setOpen={setOpenAlert} />}
        </div>
    );
}

export default Authentication;
