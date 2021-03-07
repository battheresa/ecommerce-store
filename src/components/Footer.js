import React from 'react';
import { Button, TextField } from '@material-ui/core';
import '../stylesheets/Footer.css';

// TODO: navigation, subscribe

function Footer() {
    return (
        <div className='footer'>
            {/* navigation links */}
            <div className='footer__nav'>

                {/* additional information */}
                <div className='footer__section'>
                    <h2>MY ACCOUNT</h2>
                    <h2>Profile</h2>
                    <h2>Orders</h2>
                    <h2>Wishlist</h2>
                </div>
                <div className='footer__section'>
                    <h2>SERVICES</h2>
                    <h2>Contact Us</h2>
                    <h2>Store Locations</h2>
                    <h2>Return &amp; Refunds</h2>
                    <h2>Terms &amp; Conditions</h2>
                </div>

                {/* items categories */}
                <div className='footer__section'>
                    <h2>SHOP</h2>
                    <div className='footer__shop'>
                        <h2>Electronics</h2>
                        <h2>Fabrics</h2>
                        <h2>Furnitures</h2>
                        <h2>Housekeeping</h2>
                        <h2>Kitchenwares</h2>
                        <h2>Storages</h2>
                    </div>
                </div>

                {/* subscribe section */}
                <div className='footer__section footer__subscribe'>
                    <h2>SUBSCRIBE</h2>
                    <h2>Subscribe for news on latest products and special offers. No spams!</h2>
                    
                    <form>
                        <TextField 
                            type='email' 
                            placeholder='EMAIL ADDRESS' 
                            size='small' 
                            style={{ marginTop: '10px' }}
                            inputProps={{ style: { fontSize: 16, fontWeight: 300, wordSpacing: 3 } }}
                            required 
                        />
                        <Button variant='contained'><p className='font-bold font-wide'>SUBSCRIBE</p></Button>
                    </form>
                </div>
            </div>

            {/* copyright */}
            <div className='footer__copyright'>
                <h3 className='font-light'>No rights reserved. All images and product information are from <a href='https://www.muji.com/hk-en/'>Muji</a>.</h3>
            </div>
        </div>
    );
}

export default Footer;
