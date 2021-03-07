import React, { useState } from 'react';
import { Slider, Checkbox, Button } from '@material-ui/core';
import '../stylesheets/ProductSearchFilter.css';

function ProductSearchFilter({ products, update, initialState }) {
    const [ filterColor, setFilterColor ] = useState(initialState.colors);
    const [ filterMaterial, setFilterMaterial ] = useState(initialState.materials);
    const [ priceRange, setPriceRange ] = useState(initialState.prices);

    // update price range as slider moves
    const changePriceRange = (event, newPrice) => {
        setPriceRange(newPrice);
    };

    // material ui requirement for slider
    const priceRangeText = (price) => {
        return `$${price}`;
    };

    // update filter choices
    const changeChecked = (filter, text) => {
        if (filter === 'materials') {
            const newFilters = [...filterMaterial];
            newFilters.find(content => content.text === text).checked = !newFilters.find(content => content.text === text).checked;
            setFilterMaterial(newFilters);
            return;
        }

        if (filter === 'colors') {
            const newFilters = [...filterColor];
            newFilters.find(content => content.text === text).checked = !newFilters.find(content => content.text === text).checked;
            setFilterColor(newFilters);
            return;
        }
    };

    // reset filter choices
    const resetFilter = () => {
        const colors = [...filterColor];
        colors.forEach(content => content.checked = false);
        setFilterColor(colors);

        const materials = [...filterMaterial];
        materials.forEach(content => content.checked = false);
        setFilterMaterial(materials);
    
        setPriceRange(initialState.prices);
        update(products);
    };

    // search filter 
    const searchFilter = () => {
        var result = [];

        // if want to filter colors or materials
        if (filterColor.find(col => col.checked === true) !== undefined || filterMaterial.find(mat => mat.checked === true) !== undefined) {
            var temp = [];

            products.forEach(content => {
                filterColor.forEach(col => {
                    if (col.checked) {
                        if (content.item.color.length === 1 && content.item.color.includes(col.text))
                            temp.push(content);

                        if (content.variation === col.text.toLowerCase().split(' ')[0])
                            temp.push(content);
                    }
                });

                filterMaterial.forEach(mat => {
                    if (mat.checked) {
                        if (content.item.material.length === 1 && content.item.material.includes(mat.text))
                            temp.push(content);

                        if (content.variation === mat.text.toLowerCase().split(' ')[0])
                            temp.push(content);
                    }
                });
            });

            // filter price
            temp.forEach(content => {
                if (content.price >= priceRange[0] && content.price <= priceRange[1])
                    result.push(content);
            });
        }
        else {
            // filter price only
            products.forEach(content => {
                if (content.price >= priceRange[0] && content.price <= priceRange[1])
                    result.push(content);
            });
        }

        // update array
        update(result);
    };

    // filter options components
    const Filter = ({ type, content }) => {
        return (
            <div className='productSearchFilter__options'>
                <Checkbox 
                    name={content.text} 
                    checked={content.checked} 
                    onChange={() => changeChecked(type, content.text)}
                    color='default'
                    style={{ transform: 'scale(0.75)', marginTop: '-2px', color: 'black' }}
                />
                <p className='font-light'>{content.text.toUpperCase()} ({content.quantity})</p>
            </div>
        );
    };

    return (
        <div className='productSearchFilter'>

            {/* color filter */}
            <div>
                <h6 className='font-bold font-wide'>COLOR</h6>
                {filterColor.map((content, i) => (
                    <Filter key={i} type='colors' content={content} />
                ))}
            </div>

            {/* material filter */}
            <div>
                <h6 className='font-bold font-wide'>MATERIAL</h6>
                {filterMaterial.map((content, i) => (
                    <Filter key={i} type='materials' content={content} />
                ))}
            </div>

            {/* price filter */}
            <div>
                <h6 id='price-range-slider' className='font-bold font-wide'>PRICE RANGE</h6>
                {(priceRange[0] !== 10000 && priceRange[1] !== 0) && 
                    <Slider 
                        value={priceRange} 
                        min={initialState.prices[0]}
                        max={initialState.prices[1]}
                        onChange={changePriceRange} 
                        valueLabelDisplay='auto' 
                        aria-labelledby='price-range-slider' 
                        getAriaValueText={priceRangeText} 
                        style={{ color: 'black' }} 
                    />
                }
                <p className='font-light'><small>PRICE: ${priceRange[0]} - ${priceRange[1]}</small></p>
            </div>

            {/* filter button */}
            <Button variant='outlined' color='primary' style={{ marginBottom: '10px' }} onClick={() => resetFilter()}><p className='font-wide'>CLEAR FILTER</p></Button>
            <Button variant='contained' color='primary' onClick={() => searchFilter()}><p className='font-wide'>SEARCH</p></Button>
        </div>
    );
}

export default ProductSearchFilter;
