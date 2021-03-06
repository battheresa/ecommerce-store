import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { IconButton, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';

import Subheader from './Subheader';
import ProductContainer from './ProductContainer';
import ProductSearchFilter from './ProductSearchFilter';

import { db } from '../firebase';
import '../stylesheets/ProductSearch.css';

function ProductSearch() {
    const location = useLocation();
    const [ products, setProducts ] = useState([]);
    const [ filteredProducts, setFilteredProducts ] = useState([]);

    const perPage = 12;
    const [ curPage, setCurPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);

    const [ firstPage, setFirstPage ] = useState(true);
    const [ lastPage, setLastPage ] = useState(false);

    const [ initialState, setInitialState ] = useState(null);
    const [ isOpen, setIsOpen ] = useState(false);

    const updateFilteredProducts = (data) => setFilteredProducts(data);

    const sortProducts = (order) => {
        setIsOpen(false);

        if (order === 'low')
            filteredProducts.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
        else 
            filteredProducts.sort((a, b) => (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0));

    }

    // change page products
    const changePage = (num) => {
        setCurPage(num);
        setLastPage(num === totalPages ? true : false);
        setFirstPage(num === 1 ? true : false);  

        window.scrollTo(0, 0);
    };

    // get products at page num
    const getProducts = (num) => {
        const last = num * perPage;
        const first = last - perPage;

        return [...filteredProducts].splice(first, last);
    };

    // mouse click tracking
    useEffect(() => {
        const clickOutside = (event) => {
            if (event.target.parentNode.id !== 'productSearch__sort-menu') 
                setIsOpen(false);
        };

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    // fetch data and expand + track all material and color filters
    useEffect(() => {
        if (!products.length) {
            let materials = [];
            let colors = [];
            let prices = [10000, 0];

            db.collection('products').onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    if (doc.data().category === location.pathname.slice(1)) {

                        // expand products
                        if (doc.data().galleryBy !== 'standard') {
                            for (let variant in doc.data().gallery) {
                                if (variant !== 'standard') {
                                    let curPrice = doc.data().price[0];
                                    let index = -1;

                                    if (doc.data().priceBy !== 'standard') {
                                        // find index
                                        doc.data()[doc.data().priceBy].forEach((content, i) => {
                                            if (content.toLowerCase().split(' ')[0] === variant)
                                                index = i;
                                        });

                                        // set price
                                        if (index !== -1)
                                            curPrice = doc.data().price[index];
                                    }

                                    setProducts(data => [...data, { id: doc.id, item: doc.data(), variation: variant.toLowerCase().split(' ')[0], price: curPrice } ]);
                                }
                            }
                        }
                        else {
                            setProducts(data => [...data, { id: doc.id, item: doc.data(), variation: 'standard', price: doc.data().price[0] } ]);
                        }

                        // look for material filters
                        doc.data().material.forEach(mat => {                              
                            const exist = materials.find(content => {
                                return content.text === mat;
                            });
                
                            if (!exist) {
                                materials.push({ text: mat, quantity: 1, checked: false });
                            }
                            else {
                                materials.find(content => {
                                    return content.text === mat;
                                }).quantity += 1;
                            }
                        });

                        // look for color filters
                        doc.data().color.forEach(col => {                              
                            const exist = colors.find(content => {
                                return content.text === col;
                            });
                
                            if (!exist) {
                                colors.push({ text: col, quantity: 1, checked: false });
                            }
                            else {
                                colors.find(content => {
                                    return content.text === col;
                                }).quantity += 1;
                            }
                        });

                        // look for price filters
                        const low = Math.min(...doc.data().price);
                        const high = Math.max(...doc.data().price);

                        prices[0] = (low < prices[0]) ? low : prices[0];
                        prices[1] = (high > prices[1]) ? high : prices[1];
                    }
                });
            });

            setInitialState({
                prices: prices,
                colors: colors,
                materials: materials
            });
        }

        // eslint-disable-next-line
    }, []);

    // update variables when products are loaded
    useEffect(() => {
        setFilteredProducts(products);
        setTotalPages(Math.ceil(products.length / perPage));
        setLastPage(Math.ceil(products.length / perPage) === 1 ? true : false);

        // eslint-disable-next-line
    }, [products]);

    // components ---------------------------

    // page numbers component
    const Pagination = () => {
        return (
            <p>
                {/* back arrow */}
                <IconButton className='home__products-arrow' disabled={firstPage} onClick={() => changePage(curPage - 1)}>
                    <ArrowBackIosOutlinedIcon style={{ fontSize: '12px' }} />
                </IconButton>

                {/* page numbers */}
                {Array(totalPages).fill().map((_, i) => (
                    <span key={i} onClick={() => changePage(i + 1)} className='productSearch__page-number' style={{ textDecoration: `${i + 1 === curPage ? 'underline' : 'none' }` }}>{i + 1}</span>
                ))}

                {/* forward arrow */}
                <IconButton className='home__products-arrow' style={{ marginLeft: '10px' }} disabled={lastPage} onClick={() => changePage(curPage + 1)}>
                    <ArrowForwardIosOutlinedIcon style={{ fontSize: '12px' }} />
                </IconButton>
            </p>
        );
    };
    
    return (
        <div className='productSearch'>
            <Subheader path={['home', location.pathname.split('/')[1]]} />
            
            <div className='productSearch__container'>
                {products && initialState && <ProductSearchFilter products={products} update={updateFilteredProducts} initialState={initialState} />}

                {/* products search results */}
                <div className='productSearch__results'>

                    {/* sort order and pagination */}
                    <div className='productSearch__results-header'>
                        <div className='productSearch__results-sort'>
                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setIsOpen(true)}>
                                <h6 className='font-bold' style={{ marginRight: '10px' }}>SORT BY</h6>
                                <ExpandMoreIcon fontSize='small' color='primary' />
                            </div>

                            <div id='productSearch__sort-menu' className='productSearch__sort-menu' style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
                                <MenuItem onClick={() => sortProducts('low')}>Price low to high</MenuItem>
                                <MenuItem onClick={() => sortProducts('high')}>Price high to low</MenuItem>
                            </div>
                        </div>

                        <Pagination />
                    </div>

                    {/* products */}
                    <div className='productSearch__results-products'>
                        <ProductContainer products={getProducts(curPage)} size='large' />
                    </div>

                    {/* pagination */}
                    <div className='productSearch__results-footer'>
                        <Pagination />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSearch;
