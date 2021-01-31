import React from 'react';
import { useHistory } from 'react-router-dom';
import '../stylesheets/ProductCard.css';

// TODO: strike price for sales and tags

function ProductCard({ item, variation }) {
    const history = useHistory();
    
    return (
        <div className='productCard' onClick={() => history.push('/product')}>
            <img className='productCard__image' src={item.gallery[variation][0]} alt={item.gallery[variation][0]} />
            <p className='font-wide font-bold'>{item.name.toUpperCase()}</p>

            {item.sale && <p className='font-wide font-light'>
                <span style={{ color: '#7F7F7F', textDecoration: 'line-through'}}>HK${item.price}</span> HK${item.price - item.sale}
            </p>}
            
        </div>
    );
}

export default ProductCard;
