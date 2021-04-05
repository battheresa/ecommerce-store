import React from 'react';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';

import '../stylesheets/AddressCard.css';

function AddressCard({ address, setOpen }) { 
    return (
        <div className='addressCard'>
            
            {/* address name */}
            <div className='addressCard__header'>
                <div>
                    <h6 className='font-bold font-wide'>{address.name.toUpperCase()}</h6>
                    {address.default && <StarIcon className='addressCard__tag' style={{ fontSize: '16px' }} />}
                </div>

                <EditIcon className='addressCard__edit' fontSize='small' onClick={() => setOpen(address, true)} />
            </div>

            {/* address details */}
            <div className='addressCard__body'>
                <p className='font-light'>{address.address1}</p>
                <p className='font-light'>{address.address2}</p>
                <p className='font-light'>{address.district}, {address.country}</p>
            </div>
        </div>
    );
}

export default AddressCard;
