import React from 'react';
import notfound from '../assets/image/no-data.gif'

const NoDatafound = () => {
    return (
        <div className='text-center'>
            <img className='img-fluid' src={notfound} alt="" />
        </div>
    );
};

export default NoDatafound;