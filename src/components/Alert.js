import React, { useState, useEffect } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import '../stylesheets/Alert.css';

function Alert({ status, message, open, setOpen }) {
    // change timer after 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setOpen(false);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='alert__modal' style={{ display: `${open ? 'flex' : 'none' }` }}>
            {status && <CheckCircleIcon />}
            {!status && <CancelIcon />}
            <p className='font-light'>{message}</p>
        </div>
    );
}

export default Alert;
