import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import '../stylesheets/Footer.css';

function Footer() {
    const history = useHistory();

    const goTo = (path, search) => {
        window.scrollTo(0, 0);
        history.push({ pathname: path, search: search });
    };

    return (
        <div className='footer'>
            {/* navigation links */}
            <div className='footer__nav'>

                {/* additional information */}
                <div className='footer__section'>
                    <h2>MY ACCOUNT</h2>
                    <h2 onClick={() => goTo('/user', '?tab=profile')}>Profile</h2>
                    <h2 onClick={() => goTo('/user', '?tab=orders')}>Orders</h2>
                    <h2 onClick={() => goTo('/user', '?tab=wishlist')}>Wishlist</h2>
                </div>
                <div className='footer__section'>
                    <h2>SERVICES</h2>
                    <h2 onClick={() => goTo('/contact-us')}>Contact Us</h2>
                    <h2 onClick={() => goTo('/store-locations')}>Store Locations</h2>
                    <h2 onClick={() => goTo('/terms-and-conditions')}>Terms &amp; Conditions</h2>
                </div>

                {/* items categories */}
                <div className='footer__section'>
                    <h2>SHOP</h2>
                    <div className='footer__shop'>
                        <h2 onClick={() => goTo('/electronics')}>Electronics</h2>
                        <h2 onClick={() => goTo('/fabrics')}>Fabrics</h2>
                        <h2 onClick={() => goTo('/furnitures')}>Furnitures</h2>
                        <h2 onClick={() => goTo('/housekeeping')}>Housekeeping</h2>
                        <h2 onClick={() => goTo('/kitchenwares')}>Kitchenwares</h2>
                        <h2 onClick={() => goTo('/storages')}>Storages</h2>
                    </div>
                </div>

                {/* subscribe section */}
                <div className='footer__section footer__subscribe'>
                    <h2>SUBSCRIBE</h2>
                    <h2>Subscribe for news on latest products and special offers. No spams!</h2>
                    
                    <form>
                        <TextField type='email' placeholder='EMAIL ADDRESS' style={{ marginTop: '10px' }} required />
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
