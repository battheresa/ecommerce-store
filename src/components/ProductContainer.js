import React from 'react';
import ProductCard from './ProductCard';
import '../stylesheets/ProductContainer.css';

function ProductContainer({ products, size }) {
    return (
        <div className={`productContainer productContainer__${size}`} >
            {products.map((content, i) => ( 
                <ProductCard key={i} id={content.id} item={content.item} variation={content.variation} />
            ))}
        </div>
    );
}

export default ProductContainer;
