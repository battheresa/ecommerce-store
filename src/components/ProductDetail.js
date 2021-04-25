import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { IconButton, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { useStateValue } from '../services/StateProvider';
import { fetchByIdAndVariation, fetchRelated, updateUser } from '../services/Gateway';

import Subheader from './Subheader';
import ProductContainer from './ProductContainer';
import '../stylesheets/ProductDetail.css';

function ProductDetail({ openAlert, openLogin }) {
    const [ { user }, dispatch ] = useStateValue();
    const history = useHistory();
    const location = useLocation();

    const [ product, setProduct ] = useState();
    const [ quantity, setQuantity ] = useState(1);
    const [ image, setImage ] = useState();
    const [ inWishlist, setInWishlist ] = useState();

    const [ related, setRelated ] = useState([]);

    const [ size, setSize ] = useState('');
    const [ material, setMaterial ] = useState('');
    const [ color, setColor ] = useState('');
    
    // fetch product
    useEffect(() => {
        const id = location.search.split('&')[0].split('=')[1];
        const variation = location.search.split('&')[1].split('=')[1];

        fetchByIdAndVariation(id, variation).then(content => {
            setProduct(content)

            setSize(content.item.size.find(a => a.toLowerCase() === variation) ? variation : content.item.size[0] ? content.item.size[0] : '');
            setMaterial(content.item.material.find(a => a.toLowerCase() === variation) ? variation : content.item.material[0] ? content.item.material[0] : '');
            setColor(content.item.color.find(a => a.toLowerCase() === variation) ? variation : content.item.color[0] ? content.item.color[0] : '');

            if (user && user.wishlist)
                setInWishlist(user.wishlist.includes(content.id));
        });
    }, [user, location.search]);

    // set initial image and get products from †he same category
    useEffect(() => {
        setImage(product?.item.gallery[product.variation][0]);
        fetchRelated(product?.id, product?.item.category).then(content => setRelated(content));
    }, [product]);

    // add to cart
    const addToCart = () => {
        const item = {
            id: product.id,
            image: image,
            name: product.item.name,
            price: product.price,
            quantity: quantity,
            size: size,
            material: material,
            color: color,
        }

        dispatch({
            type: 'ADD_CART',
            item: item,
        });
    };

    // add to wishlist
    const addToWishlist = () => {
        if (!user) {
            openLogin(true);
            return;
        }
        
        var newWishlist = user.wishlist;
        newWishlist.push(product.id);

        updateUser(user.id, { wishlist : newWishlist }).then(() => {
            setInWishlist(true);
            openAlert(true, true, 'Added to wishlist!');
        });
    };

    // remove from wishlist
    const removeFromWishlist = () => {
        var newWishlist = user.wishlist;
        newWishlist.splice(user.wishlist.indexOf(product.id), 1);

        updateUser(user.id, { wishlist : newWishlist }).then(() => {
            setInWishlist(false);
            openAlert(true, true, 'Removed from wishlist!');
        });
    };

    // change options
    const changeOption = (group, changeTo, index) => {
        switch (group) {
            case 'size': 
                setSize(changeTo);
                break;

            case 'material': 
                setMaterial(changeTo);
                break;

            case 'color': 
                setColor(changeTo);
                break;
            
            default:
                break;
        }

        if (product?.item[group].length === 1)
            return;

        setProduct({ 
            id: product.id,
            item: product.item,
            variation: changeTo.toLowerCase().split(' ')[0],
            price: product.item.priceBy === 'standard' ? product.price : product.item.price[index]
        });

        history.push({ pathname: '/product', search: `?id=${product.id}&variant=${changeTo.toLowerCase().split(' ')[0]}` });
    };

    // options component
    const ProductOption = ({ menu }) => {
        if (product?.item[menu].length <= 0) 
            return ( <p></p> );

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
    };

    return (
        <div className='productDetail'>
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
                            <IconButton style={{ width: 'fit-content' }} onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <RemoveIcon fontSize='small' />
                            </IconButton>

                            <input className='productDetail__product-input' type='number' value={Math.max(1, Math.min(100, quantity))} onChange={(e) => setQuantity(e.target.value)} /> 

                            <IconButton style={{ width: 'fit-content' }} onClick={() => setQuantity(Math.min(100, quantity + 1))}>
                                <AddIcon fontSize='small' />
                            </IconButton>
                        </div>
                    </div>

                    {/* buttons */}
                    <div className='productDetail__product-buttons'>
                        <Button variant='contained' color='primary' onClick={() => addToCart()}>ADD TO CART</Button>
                        <div onClick={() => inWishlist ? removeFromWishlist() : addToWishlist()}>{inWishlist ? <FavoriteIcon style={{ color: '#cc3333' }} /> : <FavoriteBorderIcon style={{ color: '#de6d6d' }} />}<p>ADD TO WISHLIST</p></div>
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
