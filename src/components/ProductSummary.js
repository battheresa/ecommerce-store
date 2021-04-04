import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import '../stylesheets/ProductSummary.css';

// TODO: modify quantity

function ProductSummary({ product, editable }) {
    const [ quantity, setQuantity ] = useState(product.quantity);

    return (
        <div className='productSummary'>
            
            {/* image */}
            <img src={product.image} alt={product.name} />

            {/* detail */}
            <div className='productSummary__body'>

                {/* product name */}
                <h6 className='font-bold font-wide'>{product.name.toUpperCase()}</h6>

                {/* product details */}
                <div className='productSummary__body-detail' style={{ gridTemplateColumns: `${editable ? '2fr 2fr 1fr' : '3fr 2fr 1fr'}` }}>

                    {/* purchased variation */}
                    <div>
                        <div className='productSummary__body-section'>
                            <h6><small>ID:</small></h6>
                            <p className='font-light'>{product.id}</p>
                        </div>
                        {product.color !== '' && <div className='productSummary__body-section'>
                            <h6><small>COLOR:</small></h6>
                            <p className='font-light'>{product.color}</p>
                        </div>}
                        {product.size !== '' && <div className='productSummary__body-section'>
                            <h6><small>SIZE:</small></h6>
                            <p className='font-light'>{product.size}</p>
                        </div>}
                        {product.material !== '' && <div className='productSummary__body-section'>
                            <h6><small>MATERIAL:</small></h6>
                            <p className='font-light'>{product.material}</p>
                        </div>}
                    </div>

                    {/* quantity */}
                    <div className={`productSummary__body-section ${editable && 'productSummary__body-quantity'}`}>
                        <h6><small>QUANTITY :</small></h6>

                        {!editable && <p className='font-light'>{product.quantity}</p>}

                        {editable && <div className='productSummary__body-quantity'>
                            <IconButton style={{ width: 'fit-content' }} onClick={() => setQuantity(Math.max(0, quantity - 1))}>
                                <RemoveIcon style={{ fontSize: '12px' }} />
                            </IconButton>

                            <input className='productSummary__body-input' type='number' value={Math.max(0, Math.min(100, quantity))} onChange={(e) => setQuantity(e.target.value)} /> 

                            <IconButton style={{ width: 'fit-content' }} onClick={() => setQuantity(Math.min(100, quantity + 1))}>
                                <AddIcon style={{ fontSize: '12px' }} />
                            </IconButton>
                        </div>}
                    </div>

                    {/* price */}
                    <div className='productSummary__body-section'>
                        <h6><small>PRICE:</small></h6>
                        <p className='font-light'>{product.price}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductSummary;
