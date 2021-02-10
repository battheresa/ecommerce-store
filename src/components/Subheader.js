import React from 'react';
import { useHistory } from 'react-router-dom';
import '../stylesheets/Subheader.css';

// TODO: make redirect automatically

function Subheader({ path }) {
    const history = useHistory();

    return (
        <div className='subheader'>
            {path?.map((location, i) => (
                <h3 key={i} className='font-light font-wide subheader__text'>{location?.toUpperCase()} {i < path.length - 1 && <span className='subheader__slash'>/</span>}</h3>
            ))}
        </div>
    );
}

export default Subheader;
