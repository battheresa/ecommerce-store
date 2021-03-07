import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { MenuItem } from '@material-ui/core';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import { auth } from '../services/firebase';
import { useStateValue } from '../services/StateProvider';

import Authentication from './Authentication';
import '../stylesheets/Header.css';

function Header() {
    const [ { user, cart }, dispatch ] = useStateValue();
    const history = useHistory();
    const location = useLocation();

    const [ keyword, setKeyword ] = useState('');
    const [ search, setSearch ] = useState(false);

    const [ shopDropdown, setShopDropdown ] = useState(false);
    const [ profileDropdown, setProfileDropdown ] = useState(false);
    const [ loginModal, setLoginModal ] = useState(false);

    const setOpen = (mode) => setLoginModal(mode);

    // mouse click listener
    useEffect(() => {
        const clickOutside = (event) => {
            setSearch(event.target.parentNode.id === 'header__search-field');
            setShopDropdown(event.target.parentNode.id === 'header__shop-dropdown');
            setProfileDropdown(event.target.parentNode.id === 'header__profile-dropdown');
        }

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    // search by category
    const searchCategory = (path) => {
        setShopDropdown(false);
        history.push(path);
    };

    // search by keyword
    const searchKeyword = (event) => {
        event.preventDefault();
        setKeyword('');
        setSearch(false);
        history.push({ pathname: '/search', search: `?keyword=${keyword}` });
    };

    // open profile
    const openProfile = () => {
        setProfileDropdown(false);
        history.push({ pathname: '/user', search: `?tab=profile` });
    };

    // logout
    const logout = () => {
        setProfileDropdown(false);
        auth.signOut();

        if (location.pathname === '/user')
            history.push('/');
    };

    return (
        <div className='flex-center-row header'>

            {/* shop, store locations */}
            <div className='header__nav'>

                {/* shop */}
                <div className='header__dropdown'>
                    
                    {/* shop link */}
                    <h2 className='font-wide header__menu' style={{ color: `${shopDropdown ? '#7F7F7F' : ''}` }} onClick={() => setShopDropdown(true)}>SHOP</h2>

                    {/* shop dropdown */}
                    <div id='header__shop-dropdown' className='popup-menu' style={{ display: `${shopDropdown ? 'flex' : 'none'}`, top: '40px' }}>
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
                    <h2 className='font-wide'>CART ({cart.length})</h2>
                </div>

                {/* login */}
                <div className='header__dropdown'>
                    <div className='header__menu' onClick={() => user ? setProfileDropdown(true) : setLoginModal(true)}>
                        <PermIdentityOutlinedIcon className='header__icon' fontSize='small' />
                        <h2 className='font-wide'>{user ? 'PROFILE' : 'LOGIN'}</h2>
                    </div>

                    {/* profile dropdown */}
                    <div id='header__profile-dropdown' className='popup-menu' style={{ display: `${profileDropdown ? 'flex' : 'none'}`, top: '40px', right: '40px', width: '150px' }}>
                        <MenuItem onClick={() => openProfile()}>My Profile</MenuItem>
                        <MenuItem onClick={() => logout()}>Logout</MenuItem>
                    </div>
                </div>

                {/* search */}
                <div className='header__search' onClick={() => setSearch(true)}>

                    {/* search icon */}
                    <div className='header__menu' style={{ margin: '0', color: `${search ? '#7F7F7F' : ''}` }}>
                        <SearchOutlinedIcon />
                    </div>

                    {/* search field */}
                    <form id='header__search-field' onSubmit={(e) => searchKeyword(e)} className='header__search-field' style={{ display: `${search ? 'flex' : 'none'}` }}>
                        <input type='text' placeholder='SEARCH' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    </form>
                </div>
            </div>

            {/* authentication modal */}
            <Authentication open={loginModal} setOpen={setOpen} />
        </div>
    );
}

export default Header;
