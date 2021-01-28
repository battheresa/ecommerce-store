import React from 'react';

import Carousel from './Carousel';
import ProductCard from './ProductCard';

import '../stylesheets/Home.css';


function Home() {
    return (
        <div className='home'>
            {/* carousel */}
            <Carousel />

            {/* menu */}
            <div className='home__menu'>
                
            </div>

            {/* products */}
            <div className='home__products'>
                <ProductCard />
            </div>
        </div>
    );
}

export default Home;
