import React, { useState, useEffect } from 'react';

import { fetchStoreLocations } from '../services/Gateway';

import Subheader from './Subheader';
import '../stylesheets/StoreLocation.css';

function StoreLocation() {
    const [ map, setMap ] = useState('');
    const [ locations, setLocations ] = useState([]);

    // get locations
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

                {/* locations list */}
                <div className='storeLocation__section'>
                    {locations.map((loc, i) => (
                        <div key={i} className={`${i === locations.length - 1 ? 'storeLocation__address-last' : 'storeLocation__address'}`} onClick={() => setMap(loc.link)}>
                            <h4>{loc.name.toUpperCase()}</h4>
                            <div>
                                <h6><small className='font-bold font-wide'>ADDRESS:</small></h6>
                                <p className='font-light'>{loc.address}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* locations map */}
                <div className='storeLocation__map'>
                    <iframe title='store-locations' src={map}/>
                </div>
            </div>
            
        </div>
    );
}

export default StoreLocation;
