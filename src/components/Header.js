import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, TextField, MenuItem } from '@material-ui/core';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import '../stylesheets/Header.css';

// TODO: authentication, search

function Header() {
    const history = useHistory();

    const [ dropdown, setDropdown ] = useState(false);
    const [ search, setSearch ] = useState(false);
    const [ loginModal, setLoginModal ] = useState(false);
    const [ menu, setMenu ] = useState(true);

    // mouse click listener
    useEffect(() => {
        const clickOutside = (event) => {
            setDropdown(event.target.parentNode.id === 'header__dropdown-content');            
            setSearch(event.target.parentNode.id === 'header__search-field');
            
            if (event.target.id === 'header__modal')
                setLoginModal(false);
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    // click search by category
    const searchCategory = (path) => {
        history.push(path);
        setDropdown(false);
    };

    return (
        <div className='flex-center-row header'>
            {/* shop, store locations */}
            <div className='header__nav'>

                {/* shop */}
                <div className='header__dropdown'>
                    
                    {/* shop link */}
                    <h2 className='font-wide header__menu' style={{ color: `${dropdown ? '#7F7F7F' : ''}` }} onClick={() => setDropdown(true)}>SHOP</h2>

                    {/* shop dropdown */}
                    <div id='header__dropdown-content' className='popup-menu' style={{ display: `${dropdown ? 'flex' : 'none'}`, top: '40px' }}>
                        <MenuItem onClick={() => searchCategory('/electronics')}>Electronics</MenuItem>
                        <MenuItem onClick={() => searchCategory('/fabrics')}>Fabrics</MenuItem>
                        <MenuItem onClick={() => searchCategory('/furnitures')}>Furnitures</MenuItem>
                        <MenuItem onClick={() => searchCategory('/housekeeping')}>Housekeeping</MenuItem>
                        <MenuItem onClick={() => searchCategory('/kitchenwares')}>Kitchenwares</MenuItem>
                        <MenuItem onClick={() => searchCategory('/storages')}>Storages</MenuItem>
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
                <div className='header__menu' onClick={() => setLoginModal(true)}>
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
                    </form>
                </div>
            </div>

            {/* login modal */}
            <div id='header__modal' className='modal-background' style={{ display: `${loginModal ? 'flex' : 'none'}` }}>
                <div className='header__modal'>

                    {/* login modal menu */}
                    <div className='header__modal-menu'>
                        <h1 style={{ color: `${menu ? 'black' : '#CCCCCC'}` }} onClick={() => setMenu(true)}><small>LOGIN</small></h1>
                        <h1 style={{ color: `${menu ? '#CCCCCC' : 'black'}` }} onClick={() => setMenu(false)}><small>SIGNUP</small></h1>
                    </div>

                    {/* login modal form */}
                    <form className='header__modal-form'>
                        <TextField type='email' placeholder='EMAIL ADDRESS' style={{ marginBottom: '15px' }} required />
                        <TextField type='password' placeholder='PASSWORD' style={{ marginBottom: '15px' }} required />
                        <Button variant='contained' color='primary'><p className='font-bold font-wide'>{menu ? 'LOGIN' : 'SIGNUP'}</p></Button>
                    </form>
                    
                </div>
            </div>
        </div>
    );
}

export default Header;
