import React, { useEffect } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import '../stylesheets/Alert.css';

function Alert({ status, message, alert, openAlert }) {
    // change timer after 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            openAlert(false, false, '');
        }, 3000);

        return () => clearInterval(interval);

        // eslint-disable-next-line
    }, []);

    return (
        <div className='alert__modal' style={{ display: `${alert ? 'flex' : 'none' }` }}>
            {status && <CheckCircleIcon />}
            {!status && <CancelIcon />}
            <p className='font-light'>{message}</p>
        </div>
    );
}

export default Alert;
