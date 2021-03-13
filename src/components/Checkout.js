import React, { useState, useEffect } from 'react';

import { TextField } from '@material-ui/core';

import { useStateValue } from '../services/StateProvider';

import Subheader from './Subheader';
import StripeForm from './StripeForm';
import '../stylesheets/Checkout.css';

// TODO: review checkout (wait for component from cart page)

function Checkout() {
    const [ { user }, dispatch ] = useStateValue();
    const defaultAddress = user?.addresses.find(content => content.default === true);

    const [ addressModal, setAddressModal ] = useState();

    const [ firstname, setFirstname ] = useState(user?.firstname);
    const [ lastname, setLastname ] = useState(user?.lastname);
    const [ email, setEmail ] = useState(user?.email);
    const [ address1, setAddress1 ] = useState(defaultAddress?.country === 'Hong Kong (SAR)' ? defaultAddress?.address1 : '');
    const [ address2, setAddress2 ] = useState(defaultAddress?.country === 'Hong Kong (SAR)' ? defaultAddress?.address2 : '');
    const [ district, setDistrict ] = useState(defaultAddress?.country === 'Hong Kong (SAR)' ? defaultAddress?.district : '');

    // mouse click listener
    useEffect(() => {
        const clickOutside = (event) => {
            if (event.target.id === 'checkout__address-modal')
                setAddressModal(false);
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    return (
        <div className='checkout'>
            <Subheader path={['home', 'cart', 'checkout']} />

            <div className='checkout__content'>

                {/* general info */}
                <div className='checkout__personal'>

                    {/* first and last name */}
                    <p className='font-wide font-bold'>NAME: </p>
                    <div className='checkout__oneline'>
                        <TextField type='text' placeholder='JOHN' value={firstname} onChange={(e) => setFirstname(e.target.value)} style={{ marginBottom: '15px' }} required fullWidth />
                        <TextField type='text' placeholder='DOE' value={lastname} onChange={(e) => setLastname(e.target.value)} style={{ marginBottom: '15px' }} required fullWidth />
                    </div>

                    {/* email address */}
                    <p className='font-wide font-bold' style={{ marginTop: '10px' }}>EMAIL ADDRESS: </p>
                    <TextField type='email' placeholder='JOHNDOE@EXAMPLE.COM' value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '15px' }} required fullWidth />

                    {/* delivery address */}
                    <div className='checkout__oneline'> 
                        <p className='font-wide font-bold' style={{ marginTop: '10px' }}>DELIVERY ADDRESS: </p>
                        {user && <p className='font-light checkout__change-address-button' onClick={() => setAddressModal(true)}><small>CHANGE ADDRESS</small></p>}
                    </div>
                    <div className='checkout__multiline'>
                        <TextField type='text' placeholder='ADDRESS 1' value={address1} onChange={(e) => setAddress1(e.target.value)} style={{ marginBottom: '15px' }} required fullWidth />
                        <TextField type='text' placeholder='ADDRESS 2' value={address2} onChange={(e) => setAddress2(e.target.value)} style={{ marginBottom: '15px' }} fullWidth />
                    </div>
                    <div className='checkout__oneline'> 
                        <TextField type='text' placeholder='DISTRICT' value={district} onChange={(e) => setDistrict(e.target.value)} style={{ marginBottom: '15px' }} required fullWidth />
                        <TextField type='text' placeholder='COUNTRY' value={'Hong Kong (SAR)'} style={{ marginBottom: '15px' }} fullWidth />
                    </div>

                    {/* delivery note */}
                    <p className='font-light font-wide' style={{ color: 'crimson', marginTop: '-8px', opacity: '0.8' }}><small>IMPORTANT NOTE: We only ship within Hong Kong.</small></p>
                </div>

                {/* payment info */}
                <StripeForm />
            </div>

            {/* change address modal */}
            <div id='checkout__address-modal' className='modal-background' style={{ display: `${addressModal ? 'flex' : 'none'}` }}>
                <div className='checkout__address-modal'>
                    <h4>YOUR ADDRESSES</h4>

                    {user?.addresses.map(content => (
                        <div>
                            <h6>{content.name}</h6>
                            <p className='font-light'>{content.address1} {content.address2} {content.country} {content.zipcode}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Checkout;
