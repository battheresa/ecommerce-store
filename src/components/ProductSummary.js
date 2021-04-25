import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/Delete';

import { useStateValue } from '../services/StateProvider';
import '../stylesheets/ProductSummary.css';

// TODO: save updates to reducer

function ProductSummary({ product, editable }) {
    const [ {}, dispatch ] = useStateValue();
    const [ quantity, setQuantity ] = useState(product.quantity);

    // update quantity of product in cart
    const updateQuantity = (value) => {
        setQuantity(value);

        const item = {
            id: product.id,
            quantity: value,
        }

        dispatch({
            type: 'UPDATE_CART',
            item: item,
        });
    }

    // remove product from cart
    const removeItem = () => {
        const item = {
            id: product.id,
            size: product.size,
            material: product.material,
            color: product.color
        }

        dispatch({
            type: 'REMOVE_CART',
            item: item,
        });
    }

    return (
        <div className='productSummary'>
            
            {/* image */}
            <img src={product.image} alt={product.name} />

            {/* detail */}
            <div className='productSummary__body'>

                {/* product name */}
                <h6 className='font-bold font-wide'>{product.name.toUpperCase()}</h6>

                {/* product details */}
                <div className='productSummary__body-detail' style={{ gridTemplateColumns: `${editable ? '2fr 2fr 1fr 1fr' : '3fr 2fr 1fr'}` }}>

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
                            <IconButton style={{ width: 'fit-content' }} onClick={() => updateQuantity(Math.max(1, quantity - 1))}>
                                <RemoveIcon style={{ fontSize: '12px' }} />
                            </IconButton>

                            <input className='productSummary__body-input' type='number' value={Math.max(1, Math.min(100, quantity))} onChange={(e) => updateQuantity(e.target.value)} /> 

                            <IconButton style={{ width: 'fit-content' }} onClick={() => updateQuantity(Math.min(100, quantity + 1))}>
                                <AddIcon style={{ fontSize: '12px' }} />
                            </IconButton>
                        </div>}
                    </div>

                    {/* price */}
                    <div className='productSummary__body-section'>
                        <h6><small>PRICE:</small></h6>
                        <p className='font-light'>{product.price}</p>
                    </div>

                    {/* delete from cart */}
                    {editable && <div>
                        <IconButton style={{ width: 'fit-content', marginTop: '-6px' }} onClick={() => removeItem()}>
                            <DeleteIcon fontSize='small' />
                        </IconButton>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default ProductSummary;
