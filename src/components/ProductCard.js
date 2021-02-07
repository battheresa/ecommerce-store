import React from 'react';
import { useHistory } from 'react-router-dom';
import '../stylesheets/ProductCard.css';

function ProductCard({ item, variation }) {
    const history = useHistory();
    
    return (
        <div className='productCard' onClick={() => history.push('/product')}>
            <img className='productCard__image' src={item.gallery[variation][0]} alt={item.gallery[variation][0]} />
            <p className='font-wide font-bold'>{item.name.toUpperCase()}</p>

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

            {item.sale && <p className='font-wide font-light'>
                <span style={{ color: '#7F7F7F', textDecoration: 'line-through'}}>HK${item.price}</span> HK${item.price - item.sale}
            </p>}

            {!item.sale && <p className='font-wide font-light'>HK${item.price}</p>}
            
        </div>
    );
}

export default ProductCard;
