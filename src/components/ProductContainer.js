import React from 'react';
import ProductCard from './ProductCard';
import '../stylesheets/ProductContainer.css';

function ProductContainer({ products, curPage, mode }) {
    return (
        <div className={`productContainer productContainer__${mode}`} style={{ transform: `translateX(${(curPage - 1) * 100}%)` }}>
            {products.map((content, i) => ( 
                <ProductCard key={i} id={content.id} item={content.item} variation={content.variation} />
            ))}
        </div>
    );
}

export default ProductContainer;
