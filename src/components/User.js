import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

import { Button, TextField, Checkbox, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { auth } from '../services/firebase';
import { useStateValue } from '../services/StateProvider';
import { updateUser, fetchByWishlist, fetchOrdersByUserId } from '../services/Gateway';

import Subheader from './Subheader';
import ProductSummary from './ProductSummary';
import ProductContainer from './ProductContainer';
import Authentication from './Authentication';
import AddressCard from './AddressCard';
import AddressModal from './AddressModal';
import Alert from './Alert';
import '../stylesheets/User.css';

function User() {
    const location = useLocation();
    const [ { user }, dispatch ] = useStateValue();
    const [ menu, setMenu ] = useState('profile');
    const [ loginModal, setLoginModal ] = useState(false);

    const [ selectedAddress, setSelectedAddress ] = useState({ name: '', default: false, address1: '', address2: '', district: '', country: 'Hong Kong (SAR)' });
    const [ addressModal, setAddressModal ] = useState(false);

    const [ alertModal, setAlertModal ] = useState(false);
    const [ alertStatus, setAlertStatus ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState('');
    
    const [ firstname, setFirstname ] = useState('');
    const [ lastname, setLastname ] = useState('');
    const [ gender, setGender ] = useState('');
    const [ orders, setOrders ] = useState([]);
    const [ wishlist, setWishlist ] = useState([]);
    const [ addresses, setAddresses ] = useState([]);
    
    const [ curEmail, setCurEmail ] = useState('');
    const [ newEmail, setNewEmail ] = useState('');
    
    const [ curPassword, setCurPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    // open login modal
    const setOpenLogin = (mode) => setLoginModal(mode);
    
    // open address modal
    const setOpenAddress = (address, mode) => {
        if (address === null) {
            setSelectedAddress({
                name: '',
                default: false, 
                address1: '',
                address2: '',
                district: '',
                country: 'Hong Kong (SAR)'
            });
            setAddressModal(mode);
            return;
        }
        
        setSelectedAddress(address);
        setAddressModal(mode);
    };

    // open alert modal
    const setOpenAlert = (status, message, mode) => {
        setAlertStatus(status);
        setAlertMessage(message);
        setAlertModal(mode);
    };

    // set tab
    useEffect(() => {
        setMenu(location.search.split('=')[1]);
    }, [location]);

    // load data when user updates
    useEffect(() => {
        if (user !== null && user.email !== undefined && user.email != null) {
            setFirstname(user.firstname);
            setLastname(user.lastname);
            setGender(user.gender);
            setAddresses(user.addresses);

            fetchOrdersByUserId(user.id).then(orders => {
                setOrders(orders);
            });

            if (user.wishlist) {
                fetchByWishlist(user.wishlist).then(products => {
                    setWishlist(products);
                });
            }
        }
    }, [user]);

    // update profile
    const updateProfile = () => {
        updateUser(user.id, {
            firstname: firstname, 
            lastname: lastname, 
            gender: gender
        }).then(response => {
            setOpenAlert(true, 'Profile updated!', true);
        });
    };

    // update email
    const updateEmail = () => {
        if (curEmail === '') {
            setOpenAlert(false, 'Please enter your current email.', true);
            return;
        }

        if (curEmail === newEmail) {
            setOpenAlert(false, 'Please enter a different email.', true);
            return;
        }

        auth.signInWithEmailAndPassword(curEmail, curPassword).then(credential => {
            credential.user.updateEmail(newEmail).then(response => {
                setOpenAlert(true, 'Email updated!', true);
            });;
        });

        updateUser(user.id, { email: newEmail });
    };

    // update password
    const updatePassword = () => {
        if (curPassword === '') {
            setOpenAlert(false, 'Please enter your current password.', true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setOpenAlert(false, 'Password does not match.', true);
            return;
        }

        auth.signInWithEmailAndPassword(user.email, curPassword).then(credential => {
            credential.user.updatePassword(newPassword).then(response => {
                setOpenAlert(true, 'Password updated!', true);
            });;
        });
    };

    return (
        <div className='user'>
            <Subheader path={['home', 'profile', menu]} />

            {!user && <div className='modal-background'>
                <Authentication open={true} setOpen={setOpenLogin} />
            </div>}

            <div className='user__content'>
                
                {/* sidebar */}
                <div className='user__sidebar'> 
                    <h6 className='font-bold font-wide' onClick={() => setMenu('profile')}>PROFILE</h6>
                    <h6 className='font-light font-wide user__submenu' onClick={() => setMenu('email')}>CHANGE EMAIL</h6>
                    <h6 className='font-light font-wide user__submenu' onClick={() => setMenu('password')}>CHANGE PASSWORD</h6>
                    <h6 className='font-bold font-wide' onClick={() => setMenu('addresses')}>ADDRESSES</h6>
                    <h6 className='font-bold font-wide' onClick={() => setMenu('orders')}>ORDERS</h6>
                    <h6 className='font-bold font-wide' onClick={() => setMenu('wishlist')}>WISHLIST</h6>
                </div>

                {/* profile tab */}
                <div className='user__body' style={{ display: `${menu === 'profile' ? 'block' : 'none'}` }}>
                    <h4>PROFILE</h4>
                    <table className='table-first-col-left'>
                        <tbody>
                            <tr>
                                <td>Firstname</td>
                                <td colSpan='3'><TextField value={firstname} onChange={(e) => setFirstname(e.target.value)} fullWidth /></td>
                                <td style={{ width: '200px' }}></td>
                            </tr>
                            <tr>
                                <td>Lastname</td>
                                <td colSpan='3'><TextField value={lastname} onChange={(e) => setLastname(e.target.value)} fullWidth /></td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>
                                    <Checkbox color='primary' checked={gender === 'male'} onChange={() => setGender('male')} /><span style={{ marginRight: '20px' }}>Male</span>
                                    <Checkbox color='primary' checked={gender === 'female'} onChange={() => setGender('female')} /><span style={{ marginRight: '20px' }}>Female</span>
                                    <Checkbox color='primary' checked={gender === 'other'} onChange={() => setGender('other')} /><span style={{ marginRight: '20px' }}>Other</span>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><Button variant='contained' style={{ width: '120px', marginTop: '15px' }} onClick={() => updateProfile()}>SAVE</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* email tab */}
                <div className='user__body' style={{ display: `${menu === 'email' ? 'block' : 'none'}` }}>
                    <h4>CHANGE EMAIL</h4>
                    <table className='table-first-col-left'>
                        <tbody>
                            <tr>
                                <td>Current Email</td>
                                <td><TextField type='email' value={curEmail} onChange={(e) => setCurEmail(e.target.value)} fullWidth /></td>
                                <td style={{ width: '200px' }}></td>
                            </tr>
                            <tr>
                                <td>Current Password</td>
                                <td><TextField type='password' value={curPassword} onChange={(e) => setCurPassword(e.target.value)} fullWidth /></td>
                                <td style={{ width: '200px' }}></td>
                            </tr>
                            <tr>
                                <td>New Email</td>
                                <td><TextField type='email' value={newEmail} onChange={(e) => setNewEmail(e.target.value)} fullWidth /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><Button variant='contained' style={{ width: '120px', marginTop: '15px' }} onClick={() => updateEmail()}>SAVE</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* password tab */}
                <div className='user__body' style={{ display: `${menu === 'password' ? 'block' : 'none'}` }}>
                    <h4>CHANGE PASSWORD</h4>
                    <table className='table-first-col-left'>
                        <tbody>
                            <tr>
                                <td>Current Password</td>
                                <td><TextField type='password' value={curPassword} onChange={(e) => setCurPassword(e.target.value)} fullWidth /></td>
                                <td style={{ width: '200px' }}></td>
                            </tr>
                            <tr>
                                <td>New Password</td>
                                <td><TextField type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth /></td>
                            </tr>
                            <tr>
                                <td>Confirm Password</td>
                                <td><TextField type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><Button variant='contained' style={{ width: '120px', marginTop: '15px' }} onClick={() => updatePassword()}>SAVE</Button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* addresses tab */}
                <div className='user__body' style={{ display: `${menu === 'addresses' ? 'block' : 'none'}` }}>
                    <h4>ADDRESSES</h4>
                    
                    {/* addresses */}
                    <div className='user__address'>
                        {addresses.map((address, i) => (
                            <AddressCard key={i} address={address} open={addressModal} setOpen={setOpenAddress} />
                        ))}

                        <div className='user__address-add'>
                            <IconButton style={{ borderRadius: 0, height: '100%' }} onClick={() => setOpenAddress(null, true)}><AddIcon color='primary' /></IconButton>
                        </div>
                    </div>

                    {/* address modal */}
                    <AddressModal address={selectedAddress} open={addressModal} setOpen={setOpenAddress} setAlert={setOpenAlert} />
                </div>

                {/* orders tab */}
                <div className='user__body' style={{ display: `${menu === 'orders' ? 'block' : 'none'}` }}>
                    <h4>ORDERS</h4>
                    {orders?.map((data, i) => (
                        <div key={i} className='user__order'>
                            <div className='user__order-header'>
                                <h6 className='font-bold font-wide'>ORDER ID:<span className='font-light font-wide' style={{ marginLeft: '10px' }}>{data.id}</span></h6>
                                <h6 className='font-bold font-wide'>DATE:<span className='font-light font-wide' style={{ marginLeft: '10px' }}>{moment(data.date.toDate()).format('L')}</span></h6>
                                <h6 className='font-bold font-wide'>STATUS:<span className='font-light font-wide' style={{ marginLeft: '10px' }}>{data.status.toUpperCase()}</span></h6>
                                <h6 className='font-bold font-wide'>TOTAL:<span className='font-light font-wide' style={{ marginLeft: '10px' }}>HK${data.total}</span></h6>
                            </div>

                            {data.products.map((product, i) => (
                                <ProductSummary key={i} product={product} editable={false} />
                            ))}
                        </div>
                    ))}

                </div>

                {/* wishlist tab */}
                <div className='user__body' style={{ display: `${menu === 'wishlist' ? 'block' : 'none'}` }}>
                    <h4>WISHLIST</h4>
                    {wishlist && <ProductContainer products={wishlist} size='large' />}
                </div>

                {/* alert modal */}
                {alertModal && <Alert status={alertStatus} message={alertMessage} open={alertModal} setOpen={setOpenAlert} />}
            </div>
        </div>
    );
}

export default User;
