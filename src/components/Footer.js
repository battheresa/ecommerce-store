import React from 'react';
import '../stylesheets/Footer.css';

// TODO: navigation

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
                        <h2>Accessories</h2>
                        <h2>Electronics</h2>
                        <h2>Fabrics</h2>
                        <h2>Furnitures</h2>
                        <h2>Housekeeping</h2>
                        <h2>Kitchenwares</h2>
                        <h2>Stationaries</h2>
                        <h2>Storages</h2>
                    </div>
                </div>

                {/* subscribe section */}
                <div className='footer__section footer__subscribe'>
                    <h2>SUBSCRIBE</h2>
                    <h2>Subscribe for news on latest products and special offers. No spams!</h2>
                    
                    <form>
                        <input type='email' placeholder='EMAIL ADDRESS' />
                        <button>SUBSCRIBE</button>
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