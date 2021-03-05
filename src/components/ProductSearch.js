import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';

import Subheader from './Subheader';
import ProductContainer from './ProductContainer';

import { db } from '../firebase';
import '../stylesheets/ProductSearch.css';

// TODO: price filter

function ProductSearch() {
    const location = useLocation();
    const [ products, setProducts ] = useState([]);

    const perPage = 12;
    const [ curPage, setCurPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);

    const [ firstPage, setFirstPage ] = useState(true);
    const [ lastPage, setLastPage ] = useState(false);

    const [ filterMaterial, setFilterMaterial ] = useState([]);
    const [ filterColor, setFilterColor ] = useState([]);

    // change page products
    const changePage = (num) => {
        setCurPage(num);
        setLastPage(num === totalPages ? true : false);
        setFirstPage(num === 1 ? true : false);  
    };

    // get products at page num
    const getProducts = (num) => {
        const last = num * perPage;
        const first = last - perPage;

        return [...products].splice(first, last);
    }

    // fetch data and expand + track all material and color filters
    useEffect(() => {
        if (!products.length) {
            var materials = [];
            var colors = [];

            db.collection('products').onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    if (doc.data().category === location.pathname.slice(1)) {
                        if (doc.data().galleryBy !== 'standard') {
                            for (let variant in doc.data().gallery) {
                                if (variant !== 'standard')
                                    setProducts(data => [...data, { id: doc.id, item: doc.data(), variation: variant.toLowerCase().split(' ')[0] } ]);
                            }
                        }
                        else {
                            setProducts(data => [...data, { id: doc.id, item: doc.data(), variation: 'standard' } ]);
                        }
                        
                        // look for material filters
                        doc.data().material.forEach(mat => {                              
                            const exist = materials.find(content => {
                                return content.material === mat;
                            });
                
                            if (!exist) {
                                materials.push({ material: mat, quantity: 1 });
                            }
                            else {
                                materials.find(content => {
                                    return content.material === mat;
                                }).quantity += 1;
                            }
                        });

                        // look for color filters
                        doc.data().color.forEach(col => {                              
                            const exist = colors.find(content => {
                                return content.color === col;
                            });
                
                            if (!exist) {
                                colors.push({ color: col, quantity: 1 });
                            }
                            else {
                                colors.find(content => {
                                    return content.color === col;
                                }).quantity += 1;
                            }
                        });

                    }
                });

                setFilterMaterial(materials);
                setFilterColor(colors);
            });
        }

        // eslint-disable-next-line
    }, []);

    // update variables when products are loaded
    useEffect(() => {
        setTotalPages(Math.ceil(products.length / perPage));
        setLastPage(Math.ceil(products.length / perPage) === 1 ? true : false);

        // eslint-disable-next-line
    }, [products]);

    // subcomponent for page numbers
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
    }
    
    return (
        <div className='productSearch'>
            <Subheader path={['home', location.pathname.split('/')[1]]} />
            
            <div className='productSearch__container'>

                {/* side bar */}
                <div className='productSearch__filters'>

                    {/* color filter */}
                    <div>
                        <h6 className='font-bold'>COLOR</h6>
                        {filterColor.map((content, i) => (
                            <p key={i} className='font-light'>{content.color.toUpperCase()} ({content.quantity})</p>
                        ))}
                    </div>

                    {/* material filter */}
                    <div>
                        <h6 className='font-bold'>MATERIAL</h6>
                        {filterMaterial.map((content, i) => (
                            <p key={i} className='font-light'>{content.material.toUpperCase()} ({content.quantity})</p>
                        ))}
                    </div>

                    {/* price filter */}
                    <div>
                        <h6>PRICE</h6>
                    </div>
                </div>

                {/* products search results */}
                <div className='productSearch__results'>

                    {/* sort order and pagination */}
                    <div className='productSearch__results-header'>
                        <div style={{ flex: 1 }}><h6 className='font-bold'>SORT BY</h6></div>

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
}

export default ProductSearch;
