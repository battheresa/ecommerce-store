import React, { useState, useEffect } from 'react';

import { fetchStoreLocations } from '../services/Gateway';

import Subheader from './Subheader';
import '../stylesheets/StoreLocation.css';


function StoreLocation() {
    // declare variables: setLocations('abc'); equal to locations = 'abc'
    const [ map, setMap ] = useState('');
    const [ locations, setLocations ] = useState([]);

    // declare functions: function functionname() {} or const functionname = () => {}

    //output of fetchStoreLocations is response
    useEffect(() => {
        fetchStoreLocations().then(content => {
            setMap(content[0].link);
            setLocations(content);
        });
    }, []);

    return (
        <div class='storeLocation'>
            <Subheader path={['home', 'store locations']} />

            <div class='storeLocation__container'>

                <div className='storeLocation__section'>
                    {locations.map((loc, i) => (
                        <div className='storeLocation__address' onClick={() => setMap(loc.link)} style={{ borderBottom: `${i === locations.length - 1 ? 'none' : '0.8px solid black'}` }}>
                            <h4>{loc.name}</h4>
                            <div>
                                <h6><small className='font-bold font-wide'>ADDRESS:</small></h6>
                                <p className='font-light'>{loc.address}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='storeLocation__map'>
                    <iframe title='store-locations' src={map}/>
                </div>
            </div>
            
        </div>
    );
}

export default StoreLocation;
