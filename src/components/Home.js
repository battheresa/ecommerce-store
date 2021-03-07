import React, { useState, useEffect } from 'react';

import { IconButton } from '@material-ui/core';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';

import Carousel from './Carousel';
import ProductContainer from './ProductContainer';

import { fetchPromotional } from '../services/Gateway';
import '../stylesheets/Home.css';

function Home() {
    const [ data, setData ] = useState([]);
    const [ display, setDisplay ] = useState([]);

    const perPage = 8;
    const [ curPage, setCurPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);

    const [ firstPage, setFirstPage ] = useState(true);
    const [ lastPage, setLastPage ] = useState(false);

    const [ menu, setMenu ] = useState(0);
    const text = ['SALES', 'TRENDING', 'NEW ARRIVALS', 'LIMITED EDITIONS'];

    // change page display
    const changePage = (num) => {
        setCurPage(num);
        setLastPage(num === totalPages ? true : false);
        setFirstPage(num === 1 ? true : false);  
    };

    // get products at page num
    const getProducts = (num) => {
        const last = num * perPage;
        const first = last - perPage;

        return [...display].splice(first, last);
    };

    // re-filter display products when menu change
    const changeMenu = (num) => {
        const menuText = ['sale', 'trending', 'newArrival', 'limitedEdition'];
        updateMenuDisplay(menuText[num]);
        setMenu(num);
    };

    // re-filter display products when menu change
    const updateMenuDisplay = (menu) => {
        setDisplay(data.filter(content => {
            return menu === 'sale' ? content.item[menu] !== 0 : content.item[menu] === true;
        }));

        const length = data.filter(content => {
            return menu === 'sale' ? content.item[menu] !== 0 : content.item[menu] === true;
        }).length;

        setCurPage(1);
        setTotalPages(Math.ceil(length / perPage));

        setFirstPage(true);
        setLastPage(Math.ceil(length / perPage) === 1 ? true : false);
    };

    // fetch promotionals products
    useEffect(() => { 
        fetchPromotional().then(content => setData(content)); 
    }, []);

    // get all items for initial menu
    useEffect(() => {
        updateMenuDisplay('sale');

        // eslint-disable-next-line
    }, [data]);

    return (
        <div className='home'>
            {/* carousel */}
            <Carousel />

            {/* menu */}
            <div className='home__menu'>
                {text.map((content, i) => (
                    <h3 key={i} onClick={() => changeMenu(i)} className={`font-wide ${menu !== i && 'home__menu-inactive'}`}>{content}</h3>
                ))}
            </div>

            {/* products */}
            <div className='home__products'>
                
                {/* back arrow */}
                <IconButton className='home__products-arrow' style={{ marginLeft: '-30px' }} disabled={firstPage} onClick={() => changePage(curPage - 1)}>
                    <ArrowBackIosOutlinedIcon />
                </IconButton>

                {/* product carousel */}
                <div className='home__products-display'>
                    <ProductContainer products={getProducts(curPage)} size='small' />
                </div>

                {/* forward arrow */}
                <IconButton className='home__products-arrow' style={{ marginRight: '-30px' }} disabled={lastPage} onClick={() => changePage(curPage + 1)}>
                    <ArrowForwardIosOutlinedIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default Home;
