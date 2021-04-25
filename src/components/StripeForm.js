import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { TextField, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';

import axios from '../services/axios';
import { getSubtotal } from '../services/Reducer';
import { useStateValue } from '../services/StateProvider';
import { saveOrdersByUserId } from '../services/Gateway';

import ProductSummary from './ProductSummary';
import StripeTextField from './StripeTextField';
import '../stylesheets/StripeForm.css';

function StripeForm({ openAlert, openLogin }) {
    const history = useHistory();
    const [ { user, cart, promo, delivery }, dispatch ] = useStateValue();

    var subtotal = getSubtotal(cart);
    var discount = promo ? (promo.unit === 'dollars') ? promo.discount : subtotal * promo.discount / 100 : 0;
    var total = subtotal + (delivery ? delivery.cost : 0) - discount;

    const stripe = useStripe();
    const elements = useElements();
    const [ reviewModal, setReviewModal ] = useState(false);

    // mouse click listener
    useEffect(() => {
        const clickOutside = (event) => {
            if (event.target.id === 'stripeForm__order-modal')
                setReviewModal(false);
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    // get secret key
    const makePurchase = async (event) => {
        event.preventDefault();
        
        await axios({
            method: 'POST',
            url: `/purchase/order?total=${Math.round(total * 100)}`
        }).then(async (response) => {
            // console.log('secret: ', response.data.secret);

            await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardNumberElement)
            }).then(async (result) => {
                // console.log('payment method:', result.paymentMethod);
                
                await stripe.confirmCardPayment(response.data.secret, { 
                    payment_method: result.paymentMethod.id
                }).then(payload => {
                    // console.log('payload: ', payload);

                    const order = {
                        id: payload.paymentIntent.id,
                        date: new Date().getTime(),
                        total: total,
                        status: 'preparing',
                        products: cart,
                    }

                    saveOrdersByUserId(user.id, order).then(() => {
                        dispatch({ type: 'EMPTY_CART' });
                        openAlert(true, true, 'Order placed successfully!');
                        history.push('/');
                    });
                });
            });
        });
    };

    return (
        <div className='stripeForm'>
            <form onSubmit={(e) => makePurchase(e)} className='stripeForm__form'>

                {/* card info */}
                <div className='stripeForm__card'>
                    <div style={{ gridColumn: '1 / span 2' }}>
                        <p className='font-wide font-bold'>CARD NUMBER: </p>
                        <TextField InputProps={{ inputComponent: StripeTextField, inputProps: { component: CardNumberElement } }} required fullWidth />
                    </div>
                    <div>
                        <p className='font-wide font-bold'>EXPIRATION DATE: </p>
                        <TextField InputProps={{ inputComponent: StripeTextField, inputProps: { component: CardExpiryElement } }} required fullWidth />
                    </div>
                    <div>
                        <p className='font-wide font-bold'>CVC: </p>
                        <TextField InputProps={{ inputComponent: StripeTextField, inputProps: { component: CardCvcElement } }} required fullWidth />
                    </div>
                </div>

                {/* summary */}
                <div className='stripeForm__summary-group'>
                    <p className='font-light font-wide' style={{ flex: '1' }}>SUBTOTAL: </p>
                    <p className='font-light font-wide'>HK${subtotal}</p>
                </div>
                <div className='stripeForm__summary-group'>
                    <p className='font-light font-wide' style={{ flex: '1' }}>PROMO CODE ({promo?.code.toUpperCase()}): </p>
                    <p className='font-light font-wide'>-HK${discount}</p>
                </div>
                <div className='stripeForm__summary-group'>
                    <p className='font-light font-wide' style={{ flex: '1' }}>DELIVERY ({delivery?.method.toUpperCase()}): </p>
                    <p className='font-light font-wide'>HK${delivery?.cost}</p>
                </div>
                <div className='stripeForm__summary-group'>
                    <p className='font-bold font-wide' style={{ flex: '1' }}>TOTAL: </p>
                    <p className='font-bold font-wide'>HK${total}</p>
                </div>

                {/* buttons */}
                <div className='stripeForm__button-group'>
                    <Button onClick={() => setReviewModal(true)} variant='outlined'>REVIEW ORDER</Button>
                    <Button type='submit' variant='contained'>CONFIRM PAYMENT</Button>
                </div>
            </form>

            {/* review order modal */}
            <div id='stripeForm__order-modal' className='modal-background' style={{ display: `${reviewModal ? 'flex' : 'none'}` }}>
                <div className='stripeForm__order-modal'>

                    {/* header and close button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <h4>REVIEW ORDERS</h4>
                        <IconButton style={{ width: 'fit-content' }} onClick={() => setReviewModal(false)}><CloseIcon /></IconButton>
                    </div>

                    {/* orders */}
                    {cart?.map((product, i) => (
                        <ProductSummary key={i} product={product} editable={false} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StripeForm;
