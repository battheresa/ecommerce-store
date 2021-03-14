import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button, TextField } from '@material-ui/core';

import { auth } from '../services/firebase';
import '../stylesheets/Authentication.css';

// show message when login fail

function Authentication({ open, setOpen }) {
    const history = useHistory();
    const [ menu, setMenu ] = useState(true);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

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
    }, []);

    // login
    const login = (event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email, password).then((auth) => {
            if (auth) {
                setOpen(false);
                setEmail('');
                setPassword('');
                history.push('/');
            }
        });
    }

    // signup 
    const signup = (event) => {
        event.preventDefault();

        auth.createUserWithEmailAndPassword(email, password).then((auth) => {
            if (auth) {
                setOpen(false);
                setEmail('');
                setPassword('');
                history.push('/user');
            }
        });
    }

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
        </div>
    );
}

export default Authentication;
