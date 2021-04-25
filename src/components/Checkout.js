import React, { useState, useEffect } from 'react';

import { TextField } from '@material-ui/core';
import { useStateValue } from '../services/StateProvider';

import Subheader from './Subheader';
import AddressCard from './AddressCard';
import StripeForm from './StripeForm';
import '../stylesheets/Checkout.css';

function Checkout({ openAlert, openLogin }) {
    const [ { user }, dispatch ] = useStateValue();
    const [ addressModal, setAddressModal ] = useState();

    const [ firstname, setFirstname ] = useState('');
    const [ lastname, setLastname ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ address1, setAddress1 ] = useState('');
    const [ address2, setAddress2 ] = useState('');
    const [ district, setDistrict ] = useState('');

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

    // set default values for fields
    useEffect(() => {
        if (user && user.addresses) {
            const defaultAddress = user.addresses.find(content => content.default === true);

            if (defaultAddress && defaultAddress.country === 'Hong Kong (SAR)') {
                setAddress1(defaultAddress.address1);
                setAddress2(defaultAddress.address2);
                setDistrict(defaultAddress.district);
            }

            setFirstname(user.firstname);
            setLastname(user.lastname);
            setEmail(user.email);
        }
    }, [user]);

    const onSelectAddress = (address) => {
        setAddress1(address.address1);
        setAddress2(address.address1);
        setDistrict(address.district);

        setAddressModal(false);
    }

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
                    <p className='font-light font-wide' style={{ color: 'crimson', marginTop: '-8px', opacity: '0.8' }}><small>IMPORTANT NOTE: Shipment available within Hong Kong only.</small></p>
                </div>

                {/* payment info */}
                <StripeForm openAlert={openAlert} openLogin={openLogin} />
            </div>

            {/* change address modal */}
            <div id='checkout__address-modal' className='modal-background' style={{ display: `${addressModal ? 'flex' : 'none'}` }}>
                <div className='checkout__address-modal'>
                    <h4>YOUR ADDRESSES</h4>

                    <div className='checkout__address-list'>
                        {user?.addresses?.map((content, i) => (<div onClick={() => onSelectAddress(content)}>
                            <AddressCard key={i} address={content} size={'small'} editable={false} />
                        </div>))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
