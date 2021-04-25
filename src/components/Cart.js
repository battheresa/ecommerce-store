import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button, MenuItem, TextField } from '@material-ui/core';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

import { getSubtotal } from '../services/Reducer';
import { useStateValue } from '../services/StateProvider';
import { fetchAllCodes, fetchAllDeliveryMethod } from '../services/Gateway';

import Subheader from './Subheader';
import ProductSummary from './ProductSummary';
import '../stylesheets/Cart.css';

function Cart() {
    const history = useHistory();
    const [ { cart }, dispatch ] = useStateValue();

    const subtotal = getSubtotal(cart);

    const [ destination, setDestination ] = useState('Kowloon');
    const [ destOptions, setDestOptions ] = useState([]);
    const [ destDropdown, setDestDropdown ] = useState(false);
    
    const [ delivery, setDelivery ] = useState('Standard');
    const [ deliveryOptions, setDeliveryOptions ] = useState([]);
    const [ deliveryDropdown, setDeliveryDropdown ] = useState(false);
    
    const [ promocode, setPromocode ] = useState('');
    const [ existingPromo, setExistingPromo ] = useState([]);

    useEffect(() => {
        fetchAllDeliveryMethod().then(content => {
            setDestOptions(content[0].cost);
            setDeliveryOptions(content);
        });

        fetchAllCodes().then(content => {
            setExistingPromo(content);
        });

        const clickOutside = (event) => {
            setDestDropdown(event.target.parentNode.id === 'cart__destination-dropdown');
            setDeliveryDropdown(event.target.parentNode.id === 'cart__delivery-dropdown');
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };

        // eslint-disable-next-line
    }, []);

    const changeDestSelect = (value) => {
        setDestination(value);
        setDestDropdown(false);
    }

    const changeDeliverySelect = (value) => {
        setDelivery(value);
        setDeliveryDropdown(false);
    }

    const getDelivery = (method) => {
        return deliveryOptions?.find(item => item.method === method)?.cost.find(loc => loc.name === destination).price || 0;
    }

    const getDiscount = (code) => {
        const discount = existingPromo?.find(item => item.code === code);

        if (!discount)
            return 0;

        if (discount.unit === '$')
            return discount.discount;

        if (getSubtotal(cart) > 0)
            return Math.round(getSubtotal(cart) * discount.discount / 100);

        return 0;
    }

    const setupCheckout = () => {
        const selectedDelivery = {
            method: delivery,
            cost: getDelivery(delivery),
        };

        dispatch({
            type: 'SET_CHECKOUT',
            promo: existingPromo?.find(item => item.code === promocode),
            delivery: selectedDelivery,
        })

        history.push('/checkout');
    }

    return (
        <div className='cart'>
            <Subheader path={['home', 'cart']} />

            <div className='cart__container'>

                {/* cart products */}
                <div className='cart__cart'>
                    {cart?.length > 0 && cart?.map((product) => (
                        <ProductSummary key={product.name} product={product} editable={true} />
                    ))}

                    {cart?.length === 0 && <div className='cart__empty'>
                        <ShoppingCartOutlinedIcon style={{ fontSize: '80px', color: '#7F7F7F', marginBottom: '10px' }} />
                        <h4 className='font-bold' style={{ color: '#7F7F7F' }}>YOUR CART IS CURRENTLY EMPTY...</h4>
                    </div>}
                </div>

                <div className='cart__summary'>

                    {/* destination */}
                    <div className='cart__dropdown'>
                        <h6 className='font-bold font-wide'>DELIVER TO: </h6>
                        
                        <TextField type='text' value={destination} variant='outlined' onClick={() => setDestDropdown(true)} fullWidth />
                        <div id='cart__destination-dropdown' className='popup-menu' style={{ display: `${destDropdown ? 'flex' : 'none'}`, top: '28px', width: '100%' }}>
                            {destOptions?.map((item) => (
                                <MenuItem key={item.name} onClick={() => changeDestSelect(item.name)}>{item.name}</MenuItem>
                            ))}
                        </div>
                    </div>

                    {/* delivery */}
                    <div className='cart__dropdown'>
                        <h6 className='font-bold font-wide'>DELIVERY METHOD: </h6>

                        <TextField type='text' value={delivery} variant='outlined' onClick={() => setDeliveryDropdown(true)} fullWidth />
                        <div id='cart__delivery-dropdown' className='popup-menu' style={{ display: `${deliveryDropdown ? 'flex' : 'none'}`, top: '28px', width: '100%' }}>
                            {deliveryOptions?.map((item) => (
                                <MenuItem key={item.method} onClick={() => changeDeliverySelect(item.method)}>{item.method}</MenuItem>
                            ))}
                        </div>
                    </div>

                    {/* promo code */}
                    <div className='cart__dropdown'>
                        <h6 className='font-bold font-wide'>PROMO CODE: </h6>

                        <TextField type='text' value={promocode} placeholder='PROMO CODE' variant='outlined' onChange={(e) => setPromocode(e.target.value)} fullWidth />
                    </div>

                    {/* cost summary */}
                    <div className='cart__cost'>
                        <div>
                            <h6 className='font-light' style={{ flex: 1 }}>SUBTOTAL: </h6>
                            <h6 className='font-light'>${subtotal}</h6>
                        </div>
                        <div>
                            <h6 className='font-light' style={{ flex: 1 }}>DELIVERY: </h6>
                            <h6 className='font-light'>${getDelivery(delivery)}</h6>
                        </div>
                        <div>
                            <h6 className='font-light' style={{ flex: 1 }}>PROMO CODE: </h6>
                            <h6 className='font-light'>-${getDiscount(promocode)}</h6>
                        </div>
                        <div>
                            <h6 className='font-bold' style={{ flex: 1 }}>TOTAL: </h6>
                            <h5 className='font-bold'>${subtotal + getDelivery(delivery) - getDiscount(promocode)}</h5>
                        </div>
                        <Button style={{ marginTop: '20px' }} variant='contained' onClick={() => setupCheckout()}>PROCEED TO CHECKOUT</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
