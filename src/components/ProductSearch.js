import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Subheader from './Subheader';
import { db } from '../firebase';
import '../stylesheets/ProductSearch.css';
import ProductContainer from './ProductContainer';

function ProductSearch() {
    const location = useLocation();
    const [ products, setProducts ] = useState([]);

    const [ filterMaterial, setFilterMaterial ] = useState([]);
    const [ filterColor, setFilterColor ] = useState([]);

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
    
    return (
        <div className='productSearch'>
            <Subheader path={['home', location.pathname.split('/')[1]]} />
            
            <div className='productSearch__container'>
                <div className='productSearch__filters'>
                    <div>
                        <h6 className='font-bold'>COLOR</h6>
                        {filterColor.map((content, i) => (
                            <p key={i} className='font-light'>{content.color.toUpperCase()} ({content.quantity})</p>
                        ))}
                    </div>

                    <div>
                        <h6 className='font-bold'>MATERIAL</h6>
                        {filterMaterial.map((content, i) => (
                            <p key={i} className='font-light'>{content.material.toUpperCase()} ({content.quantity})</p>
                        ))}
                    </div>

                    <div>
                        <h6>PRICE</h6>
                    </div>
                </div>

                <div className='productSearch__results'>
                    <div className='productSearch__results-header'>
                        <div style={{ flex: 1 }}><h6 className='font-bold'>SORT BY</h6></div>

                        <div><p>1 2 3</p></div>
                    </div>

                    <div className='productSearch__results-products'>
                        <ProductContainer products={products} curPage={1} mode='large' />
                    </div>

                    <div className='productSearch__results-footer'>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductSearch;
