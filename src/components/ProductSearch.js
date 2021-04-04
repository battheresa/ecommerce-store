import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { IconButton, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';

import Subheader from './Subheader';
import ProductContainer from './ProductContainer';
import ProductSearchFilter from './ProductSearchFilter';

<<<<<<< HEAD
import { fetchByCategory } from '../services/Gateway';
=======
import { fetchByCategory, fetchByKeyword } from '../services/Gateway';
>>>>>>> 3e43ce5ab61890ce8e18924eaaa123180da019e7
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

    // update filtered products
    const updateFilteredProducts = (data) => setFilteredProducts(data);

    // sort products
    const sortProducts = (order) => {
        setIsOpen(false);

        if (order === 'low')
            filteredProducts.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
        else 
            filteredProducts.sort((a, b) => (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0));
    };

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

    // mouse click listener
    useEffect(() => {
        const clickOutside = (event) => setIsOpen(event.target.parentNode.id === 'productSearch__sort-menu');

        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };

        // eslint-disable-next-line
    }, []);

    // fetch products
    useEffect(() => {
<<<<<<< HEAD
        fetchByCategory(location.pathname.slice(1)).then(content => {
            setInitialState({
                colors: content.colors,
                materials: content.materials,
                prices: content.prices
            });

            setProducts(content.products);
        });
    }, [location.pathname]);
=======
        if (location.pathname === '/search') {    
            fetchByKeyword(location.search.split('=')[1]).then(content => {
                setInitialState({
                    colors: content.colors,
                    materials: content.materials,
                    prices: content.prices
                });

                setProducts(content.products);
            });
        }
        else {
            fetchByCategory(location.pathname.slice(1)).then(content => {
                setInitialState({
                    colors: content.colors,
                    materials: content.materials,
                    prices: content.prices
                });

                setProducts(content.products);
            });
        }
    }, [location]);
>>>>>>> 3e43ce5ab61890ce8e18924eaaa123180da019e7

    // update variables when products are loaded
    useEffect(() => {
        setFilteredProducts(products);
        setTotalPages(Math.ceil(products.length / perPage));
        setLastPage(Math.ceil(products.length / perPage) === 1 ? true : false);

        // eslint-disable-next-line
    }, [products]);

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

                            <div id='productSearch__sort-menu' className='popup-menu' style={{ display: `${isOpen ? 'flex' : 'none'}`, top: '0', left: '70px' }}>
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
