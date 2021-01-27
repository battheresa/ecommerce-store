import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import '../stylesheets/Header.css';

// TODO: authentication

function Header() {
    const history = useHistory();

    const [ dropdown, setDropdown ] = useState(false);
    const [ search, setSearch ] = useState(false);
    const [ modal, setModal ] = useState(false);
    const [ menu, setMenu ] = useState(true);   // true = login, false = signup

    useEffect(() => {
        const clickOutside = (event) => {
            if (event.target.parentNode.id !== 'header__dropdown-content') 
                setDropdown(false);
            
            if (event.target.parentNode.id !== 'header__search-field') 
                setSearch(false);
            
            if (event.target.id === 'header__modal') 
                setModal(false);
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    return (
        <div className='flex-center-row header'>
            {/* shop, store locations */}
            <div className='header__nav'>

                {/* shop */}
                <div className='header__dropdown' onClick={() => setDropdown(true)}>
                    
                    {/* shop link */}
                    <h2 className='font-wide header__menu' style={{ color: `${dropdown ? '#7F7F7F' : ''}` }}>SHOP</h2>

                    {/* shop dropdown */}
                    <div id='header__dropdown-content' className='header__dropdown-content' style={{ display: `${dropdown ? 'block' : 'none'}` }}>
                        <p>ACCESSORIES</p>
                        <p>ELECTRONICS</p>
                        <p>FABRICS</p>
                        <p>FURNITURES</p>
                        <p>HOUSEKEEPING</p>
                        <p>KITCHENWARES</p>
                        <p>STATIONARIES</p>
                        <p>STORAGES</p>
                    </div>
                </div>

                {/* store locations */}
                <h2 className='font-wide header__menu' onClick={() => history.push('/store-locations')}>STORE LOCATIONS</h2>
            </div>

            {/* logo */}
            <h1 className='header__logo' onClick={() => history.push('/')}>STORE</h1>

            {/* cart, login, search */}
            <div className='header__nav' style={{ justifyContent: 'flex-end' }}>

                {/* cart */}
                <div className='header__menu' onClick={() => history.push('/cart')}>
                    <ShoppingCartOutlinedIcon className='header__icon' fontSize='small' />
                    <h2 className='font-wide'>CART (0)</h2>
                </div>

                {/* login */}
                <div className='header__menu' onClick={() => setModal(true)}>
                    <PermIdentityOutlinedIcon className='header__icon' fontSize='small' />
                    <h2 className='font-wide'>LOGIN</h2>
                </div>

                {/* search */}
                <div className='header__search' onClick={() => setSearch(true)}>

                    {/* search icon */}
                    <div className='header__menu' style={{ margin: '0', color: `${search ? '#7F7F7F' : ''}` }}>
                        <SearchOutlinedIcon />
                    </div>

                    {/* search field */}
                    <form id='header__search-field' className='header__search-field' style={{ display: `${search ? 'flex' : 'none'}` }}>
                        <input type='text' placeholder='SEARCH' />
                        <SearchOutlinedIcon />
                    </form>
                </div>
            </div>

            {/* login modal */}
            <div id='header__modal' className='header__modal' style={{ display: `${modal ? 'flex' : 'none'}` }}>
                <div className='header__modal-content'>

                    {/* login modal menu */}
                    <div className='header__modal-menu'>
                        <h1 style={{ color: `${menu ? 'black' : '#CCCCCC'}` }} onClick={() => setMenu(true)}><small>LOGIN</small></h1>
                        <h1 style={{ color: `${menu ? '#CCCCCC' : 'black'}` }} onClick={() => setMenu(false)}><small>SIGNUP</small></h1>
                    </div>

                    {/* login modal form */}
                    <form className='header__modal-form'>
                        <input type='email' placeholder='EMAIL ADDRESS' />
                        <input type='password' placeholder='PASSWORD' />
                        <button>{menu ? 'LOGIN' : 'SIGNUP'}</button>
                    </form>
                    
                </div>
            </div>
        </div>
    );
}

export default Header;
