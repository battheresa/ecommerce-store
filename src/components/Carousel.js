import React, { useState, useEffect } from 'react';

import Shelf from '../resources/shelf.png';
import Lamp from '../resources/lamp.png';
import Chair from '../resources/chair.png';

import '../stylesheets/Carousel.css';

function Carousel() {
    // data on each carousel slide
    const data = [
        { title: 'COMFORT DESIGNS.', body: 'Designed by professional designers that will give you the best comfort you could ever ask for.', image: Chair },
        { title: 'PREMIUM QUALITY.', body: 'Made from high quality materials that is worth what you are paying for.', image: Lamp },
        { title: 'UNIQUELY YOURS.', body: 'Work with us to create items that are customised just for you.', image: Shelf }, 
        { title: 'COMFORT DESIGNS.', body: 'Designed by professional designers that will give you the best comfort you could ever ask for.', image: Chair },
        { title: 'PREMIUM QUALITY.', body: 'Made from high quality materials that is worth what you are paying for.', image: Lamp },
        { title: 'UNIQUELY YOURS.', body: 'Work with us to create items that are customised just for you.', image: Shelf }, 
    ];

    //  slide counter
    const [ slide, setSlide ] = useState(0);

    // change slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setSlide(slide === 5 ? 0 : slide + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [slide]);

    // change slide manually
    const changeSlide = (page) => {
        if (slide === 5 && page === 0) {
            setSlide(0);
            return;
        }

        const first = Math.abs(slide - page);
        const second = Math.abs(slide - (page + 3));

        setSlide(first > second ? page + 3 : page);
    };

    // position of each slide
    const getPosition = (cur, index) => {
        const table = [
            [300, 200, 100, 0, -100, -200], 
            [-200, 300, 200, 100, 0, -100], 
            [-100, -200, 300, 200, 100, 0], 
            [0, -100, -200, 300, 200, 100], 
            [100, 0, -100, -200, 300, 200], 
            [200, 100, 0, -100, -200, 300]
        ];

        return table[cur][index];
    };

    // check if page is active
    const isActive = (page) => {
        return slide === page || slide === page + 3;
    };

    return (
        <div className='carousel'>
            {/* carousel */}
            {data.map((content, i) => (
                <div key={i} className='carousel__slide'>

                    {/* carousel text */}
                    <div className='carousel__text' style={{ display: `${slide === i ? 'none' : 'flex'}`, transform: `translateY(${getPosition(slide, i)}%)` }}>
                        <h1>{content.title}</h1>
                        <h5 className='font-light'>{content.body}</h5>
                    </div>

                    {/* carousel image */}
                    <div className='carousel__image' style={{ display: `${slide === i ? 'none' : 'flex'}`, transform: `translateY(${getPosition(slide, i)}%)` }} >
                        <img src={content.image} alt={content.title}/>
                    </div>
                </div>
            ))}

            {/* carousel page number */}
            <div className='carousel__pages'>
                <div className={`carousel__page ${!isActive(0) && 'carousel__page-inactive'}`} onClick={() => changeSlide(0)}>
                    <p>01</p>
                    <div className={`carousel__page-line ${!isActive(0) && 'carousel__page-line-inactive'}`} />
                </div>
                <div className={`carousel__page ${!isActive(1) && 'carousel__page-inactive'}`} onClick={() => changeSlide(1)}>
                    <p>02</p>
                    <div className={`carousel__page-line ${!isActive(1) && 'carousel__page-line-inactive'}`} />
                </div>
                <div className={`carousel__page ${!isActive(2) && 'carousel__page-inactive'}`} onClick={() => changeSlide(2)}>
                    <p>03</p>
                    <div className={`carousel__page-line ${!isActive(2) && 'carousel__page-line-inactive'}`} />
                </div>
            </div>
        </div>
    );
}

export default Carousel;
