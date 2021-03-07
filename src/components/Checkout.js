import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import axios from '../services/axios';

function Checkout() {
    const [ input, setInput ] = useState(0);
    const [ secret, setSecret ] = useState(true);

    const [ error, setError ] = useState(null);
    const [ disabled, setDisabled ] = useState(true);

    const stripe = useStripe();
    const elements = useElements();

    const getSecret = async () => {
        const response = await axios({
            method: 'POST',
            url: `/purchase/order?total=${Math.round(input * 100)}`
        });

        setSecret(response.data.secret);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        await getSecret();

        const payload = await stripe.confirmCardPayment(secret, { 
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        console.log(payload);
    }

    const handleChange = (e) => {
        setError(e.error ? e.error.message : '');
        setDisabled(e.empty);
    };

    return (
        <div className='checkout'>
            <CardElement onChange={handleChange} />
            <input value={input} onChange={(e) => setInput(e.target.value)} type='number'/>
            <button onClick={handlePayment} disabled={disabled || error}>purchase</button>
        </div>
    );
}

export default Checkout;
