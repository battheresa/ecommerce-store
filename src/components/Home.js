import React, { useState, useEffect } from 'react';

import { IconButton } from '@material-ui/core';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';

import Carousel from './Carousel';
import ProductContainer from './ProductContainer';

import dataFile from '../data.json';
import '../stylesheets/Home.css';

// NOTE : change accessories to travel goods

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
        setLastPage(num === 0 ? true : false);
        setFirstPage(num === totalPages.length ? true : false);  
    };

    // get products at page num
    const getProducts = (num) => {
        const last = num * perPage;
        const first = last - perPage;

        return [...display].splice(first, last);
    }

    // re-filter display products when menu change
    const changeMenu = (num) => {
        setMenu(num);
        setCurPage(1);

        if (num === 0) {
            setDisplay(data.filter(content => {
                return content.item.sale !== 0;
            }));
        }
        else if (num === 1) {
            setDisplay(data.filter(content => {
                return content.item.trending === true;
            }));
        }
        else if (num === 2) {
            setDisplay(data.filter(content => {
                return content.item.newArrival === true;
            }));
        }
        else if (num === 3) {
            setDisplay(data.filter(content => {
                return content.item.limitedEdition === true;
            }));
        }
    };


    // fetch and expand products
    useEffect(() => {
        if (!data.length) {
            for (let category in dataFile) {
                dataFile[category].forEach(product => {
                    if (product.galleryBy !== 'general') {    
                        product[product.galleryBy].forEach(variant => {
                            setData(data => [...data, { item: product, variation: variant.toLowerCase().split(' ')[0] } ]);
                        });
                    }
                    else {
                        setData(data => [...data, { item: product, variation: 'general' } ]);
                    }
                });
            }
        }

        // eslint-disable-next-line
    }, []);

    // get all items for current menu
    useEffect(() => {
        setDisplay(data.filter(content => {
            return content.item.sale !== 0;
        }));

    }, [data]);

    // get initial current display
    useEffect(() => {
        setTotalPages(Math.ceil(display.length / perPage));

        setFirstPage(true);
        setLastPage(Math.ceil(display.length / perPage) === 1 ? true : false);
    }, [display]);
    

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
                <IconButton className='home__products-arrow' style={{ marginLeft: '-30px' }} disabled={firstPage} onClick={() => changePage(curPage + 1)}>
                    <ArrowBackIosOutlinedIcon />
                </IconButton>

                {/* product carousel */}
                <div className='home__products-display'>               
                    {Array(totalPages).fill().map((_, i) => (
                        <ProductContainer key={i} products={getProducts(i + 1)} curPage={curPage + i} />
                    ))}
                </div>

                {/* forward arrow */}
                <IconButton className='home__products-arrow' style={{ marginRight: '-30px' }} disabled={lastPage} onClick={() => changePage(curPage - 1)}>
                    <ArrowForwardIosOutlinedIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default Home;


// backend cases:
// 1. price by: standard, size, material
// 2. gallery by: general, color, material
