import React from 'react';
import { useHistory } from 'react-router-dom';

import { useStateValue } from '../services/StateProvider';
import '../stylesheets/ProductCard.css';

function ProductCard({ id, item, variation, price }) {
    const history = useHistory();

    // save selected product to context
    const seeDetail = () => {
        window.scrollTo(0, 0);
        history.push({ pathname: '/product', search: `?id=${id}&variant=${variation}` });
    };
    
    return (
        <div className='productCard' onClick={() => seeDetail()}>
            {/* image */}
            <img className='productCard__image' src={item.gallery[variation][0]} alt={item.gallery[variation][0]} />

            {/* name */}
            <p className='font-wide font-bold' style={{ textAlign: 'center' }}>{item.name.toUpperCase()}</p>

            {/* sale price */}
            {item.sale !== 0 && <p className='font-wide font-light'>
                <span style={{ color: '#7F7F7F', textDecoration: 'line-through'}}>HK${price}</span> HK${price - item.sale}
            </p>}

            {/* normal price */}
            {item.sale === 0 && <p className='font-wide font-light'>HK${price}</p>}

            {/* tags */}
            <div className='productCard__tag'>
                {item.trending && <div style={{ color: 'rgb(77, 131, 219)', backgroundColor: 'rgba(77, 131, 219, 0.1)' }}>
                    <p>TRENDING</p>
                </div>}

                {item.newArrival && <div style={{ color: 'rgb(123, 191, 75)', backgroundColor: 'rgba(123, 191, 75, 0.1)' }}>
                    <p>NEW ARRIVALS</p>
                </div>}

                {item.limitedEdition && <div style={{ color: 'rgb(219, 77, 77)', backgroundColor: 'rgba(219, 77, 77, 0.1)' }}>
                    <p>LIMITED EDITION</p>
                </div>}
            </div>
        </div>
    );
}

export default ProductCard;
