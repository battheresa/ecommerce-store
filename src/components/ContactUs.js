import React, { useState } from 'react';
import { Button, TextField} from '@material-ui/core';

import Alert from './Alert';
import Subheader from './Subheader';
import '../stylesheets/ContactUs.css';

// TODO: send a message (maybe?)

function ContactUs() {
    const [ alertModal, setAlertModal ] = useState(false);
    const [ alertStatus, setAlertStatus ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState('');

    // open alert modal
    const setOpenAlert = (status, message, mode) => {
        setAlertStatus(status);
        setAlertMessage(message);
        setAlertModal(mode);
    };

    return (
        <div className='contactUs'>
            <Subheader path={['home', 'contact us']} />

            <div className='contactUs__container'>

                {/* input fields */}
                <div className='contactUs__section'>
                    <h6 className='font-light'>Feel free to leave a message for us on any of your concerns or queries. We will try our best to contact you back within 2 working days.</h6>

                    <div className='contactUs__input'>
                        <p className='font-wide font-bold'>YOUR NAME: </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '15px' }}>
                            <TextField placeholder='First Name'/>
                            <TextField placeholder='Last Name'/>
                        </div>
                    </div>

                    <div className='contactUs__input'>
                        <p className='font-wide font-bold'>EMAIL ADDRESS: </p>
                        <TextField placeholder='Email address' fullWidth />
                    </div>
                        
                    <div className='contactUs__input'>
                        <p className='font-wide font-bold'>SUBJECT: </p>
                        <TextField placeholder='Subject' fullWidth />
                    </div>
                </div>
                
                {/* message */}
                <div className='contactUs__section-message'>
                    <p className='font-wide font-bold'>MESSAGE: </p>
                    <TextField placeholder='Type your message here' rows={12} multiline fullWidth />

                    {/* button */}
                    <div className='contactUs__button'>
                        <Button variant='contained' onClick={() => setOpenAlert(true, 'Message Sent!', true)}>SEND</Button>
                    </div>
                </div>
            </div>

            {alertModal && <Alert status={alertStatus} message={alertMessage} open={alertModal} setOpen={setOpenAlert} />}
        </div>
    );
}

export default ContactUs;