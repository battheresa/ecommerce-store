import React, { useState, useEffect } from 'react';

import { IconButton, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { db } from '../firebase';
import { useStateValue } from '../services/StateProvider';

import Subheader from './Subheader';
import ProductContainer from './ProductContainer';
import '../stylesheets/ProductDetail.css';

// TODO: add to cart, add to wishlist

function ProductDetail() {
    const [ { looking }, dispatch ] = useStateValue();

    const [ product, setProduct ] = useState();
    const [ quantity, setQuantity ] = useState(0);
    const [ image, setImage ] = useState();
    
    const [ related, setRelated ] = useState([]);

    // fetch data from database
    useEffect(() => {
        if (looking.item !== null) {
            setProduct({
                id: looking.id,
                item: looking.item,
                variation: looking.variation,
                price: looking.price
            });
        }
        else {
            db.collection('products').doc(looking.id).get().then(doc => (
                setProduct({ 
                    id: looking.id,
                    item: doc.data(),
                    variation: looking.variation,
                    price: looking.price
                })
            ));
        }
    }, [looking]);

    // set initial image and get products from †he same category
    useEffect(() => {
        // set initial image
        setImage(product?.item.gallery[product?.variation][0]);

        // get related products
        db.collection('products').get().then(collection => {
            collection.forEach(doc => {
                if (doc.data().category === product?.item.category && doc.id !== product?.id) {
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

                                setRelated(data => [...data, { id: doc.id, item: doc.data(), variation: variant.toLowerCase().split(' ')[0], price: curPrice } ]);
                            }
                        }
                    }
                    else {
                        setRelated(data => [...data, { id: doc.id, item: doc.data(), variation: 'standard', price: doc.data().price[0] } ]);
                    }
                }
            });
        });
    }, [product]);

    // change options
    const changeOption = (group, changeTo, index) => {
        if (product?.item[group].length === 1)
            return;

        setProduct({ 
            id: product.id,
            item: product.item,
            variation: changeTo.toLowerCase().split(' ')[0],
            price: product.item.priceBy === 'standard' ? product.price : product.item.price[index]
        });
    }

    // options component
    const ProductOption = ({ menu }) => {
        if (product?.item[menu].length > 0) {
            return (
                <div>
                    <h6><small>{menu.toUpperCase()} :</small></h6>
                    <div className='productDetail__option'>
                        {product?.item[menu].map((option, i) => (
                            <p key={i} onClick={() => changeOption(menu, option, i)}
                               className={`font-light ${(option.toLowerCase().split(' ')[0] === product?.variation || product?.item[menu].length === 1) && 'productDetail__option-selected'}`}>
                                {option}
                            </p>
                        ))}
                    </div>
                </div>
            );
        }

        return ( <p></p> );
    }

    return (
        <div className='productDetail'>
            {/* subheader */}
            <Subheader path={['home', product?.item.category, product?.item.name]} />

            {/* product details */}
            <div className='productDetail__product'>

                {/* product gallery */}
                <div className='productDetail__product-gallery'>

                    {/* small image section */}
                    <div className='productDetail__product-gallery-panel'>
                        {product?.item.gallery[product?.variation].map((img, i) => (
                            <img key={`a${i}`} src={img} alt={img} onClick={() => setImage(img)} />
                        ))}

                        {product?.variation !== 'standard' && product?.item.gallery['standard']?.map((img, i) => (
                            <img key={`b${i}`} src={img} alt={img} onClick={() => setImage(img)} />
                        ))}
                    </div>

                    {/* large image section */}
                    <img src={image} alt={image} />
                </div>

                {/* product details and ordering */}
                <div className='productDetail__product-details'>

                    {/* name */}
                    <h4>{product?.item.name.toUpperCase()}</h4>

                    {/* sale price */}
                    {product?.item.sale !== 0 && <h4 className='font-wide font-light'>
                        <span style={{ color: '#7F7F7F', textDecoration: 'line-through'}}>HK${product?.price}</span> HK${product?.price - product?.item.sale}
                    </h4>}

                    {/* normal price */}
                    {product?.item.sale === 0 && <h4 className='font-wide font-light'>HK${product?.price}</h4>}
                    
                    {/* description */}
                    <div>
                        <h6><small>PRODUCT DESCRIPTION :</small></h6>
                        <p className='font-light'>{product?.item.description}</p>
                    </div>

                    {/* options */}
                    <ProductOption menu='color' />
                    <ProductOption menu='size' />
                    <ProductOption menu='material' />

                    {/* quantity */}
                    <div className='productDetail__product-quantity'>
                        <h6><small>QUANTITY :</small></h6>
                        <div>
                            <IconButton style={{ width: 'fit-content' }} onClick={() => setQuantity(Math.max(0, quantity - 1))}>
                                <RemoveIcon fontSize='small' />
                            </IconButton>

                            <input className='productDetail__product-input' type='number' value={Math.max(0, Math.min(100, quantity))} onChange={(e) => setQuantity(e.target.value)} /> 

                            <IconButton style={{ width: 'fit-content' }} onClick={() => setQuantity(Math.min(100, quantity + 1))}>
                                <AddIcon fontSize='small' />
                            </IconButton>
                        </div>
                    </div>

                    {/* buttons */}
                    <div className='productDetail__product-buttons'>
                        <Button variant='contained' color='primary'>ADD TO CART</Button>
                        <div><FavoriteBorderIcon /><p>ADD TO WISHLIST</p></div>
                    </div>
                </div>
            </div>

            {/* related products */}
            <div className='productDetail__related'>
                <h6 className='font-bold'>YOU MIGHT ALSO LIKE</h6>

                <div className='productDetail__related-panel'>
                    <ProductContainer products={related.slice(0, 4)} size='tiny' />
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
