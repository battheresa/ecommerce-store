import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox } from '@material-ui/core';

import { updateUser } from '../services/Gateway';
import { useStateValue } from '../services/StateProvider';
import '../stylesheets/AddressModal.css';

function AddressModal({ address, open, setOpen, openAlert }) {
    const [ { user }, dispatch ] = useStateValue();
    const [ menu, setMenu ] = useState(false);

    const [ name, setName ] = useState('');
    const [ isDefault, setIsDefault ] = useState(false);
    const [ address1, setAddress1 ] = useState('');
    const [ address2, setAddress2 ] = useState('');
    const [ district, setDistrict ] = useState('');

    // mouse click listener
    useEffect(() => {
        const clickOutside = (event) => {
            if (event.target.id === 'addressModal') 
                setOpen(null, false);
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };

        // eslint-disable-next-line
    }, []);

    // set initial values
    useEffect(() => {
        setMenu(address.name === '');
        setName(address.name);
        setIsDefault(address.default);
        setAddress1(address.address1);
        setAddress2(address.address2);
        setDistrict(address.district);
    }, [address]);

    // add new address
    const addAddress = () => {
        var newAddress = user.addresses;

        if (isDefault) {
            newAddress.forEach(item => {
                item.default = false;
            });
        }

        newAddress.push({
            name: name,
            default: isDefault,
            address1: address1,
            address2: address2,
            district: district,
            country: 'Hong Kong (SAR)'
        });
        
        updateUser(user.id, { addresses: newAddress }).then(() => {
            setOpen(null, false);
            openAlert(true, true, 'Address added!');
        });
    };
    
    // update address
    const updateAddress = () => {
        var newAddress = user.addresses;

        if (isDefault) {
            newAddress.forEach(item => {
                item.default = false;
            });
        }

        newAddress[newAddress.indexOf(address)] = {
            name: name,
            default: isDefault,
            address1: address1,
            address2: address2,
            district: district,
            country: 'Hong Kong (SAR)'
        };

        updateUser(user.id, { addresses: newAddress }).then(() => {
            setOpen(null, false);
            openAlert(true, true, 'Address updated!');
        });
    };

    // delete address 
    const deleteAddress = () => {
        var newAddress = user.addresses;
        newAddress.splice(newAddress.indexOf(address), 1);
                
        updateUser(user.id, { addresses: newAddress }).then(() => {
            setOpen(null, false);
            openAlert(true, true, 'Address deleted!');
        });
    };

    return (
        <div id='addressModal' className='modal-background' style={{ display: `${open ? 'flex' : 'none'}` }}>
            <div className='addressModal__modal'>

                {/* header */}
                <h4>{address ? 'EDIT ADDRESS' : 'CREATE NEW ADDRESS'}</h4>
                
                {/* table form */}
                <table className='table-first-col-left addressModal-table'>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td><TextField value={name} onChange={(e) => setName(e.target.value)} fullWidth /></td>
                            <td style={{ width: '50px' }}></td>
                        </tr>
                        <tr>
                            <td>Address 1</td>
                            <td><TextField value={address1} onChange={(e) => setAddress1(e.target.value)} fullWidth /></td>
                        </tr>
                        <tr>
                            <td>Address 2</td>
                            <td><TextField value={address2} onChange={(e) => setAddress2(e.target.value)} fullWidth /></td>
                        </tr>
                        <tr>
                            <td>District</td>
                            <td><TextField value={district} onChange={(e) => setDistrict(e.target.value)} fullWidth /></td>
                        </tr>
                        <tr>
                            <td>Country</td>
                            <td><TextField value={'Hong Kong (SAR)'} disabled fullWidth /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <Checkbox color='primary' checked={isDefault} onChange={() => setIsDefault(!isDefault)} /><span className='font-light' style={{ marginRight: '20px' }}>Set as default</span>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <Button variant='contained' style={{ width: '120px', marginTop: '15px' }} onClick={() => menu ? addAddress() :  updateAddress()}>SAVE</Button>
                                <Button variant='outlined' style={{ width: '120px', marginTop: '15px', marginLeft: '15px' }} onClick={() => deleteAddress()}>DELETE</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddressModal;
