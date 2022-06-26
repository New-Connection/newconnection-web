import React from 'react';

import logo from "../../assets/logo.png"

const Logo = () => {
    return(
        <div className="flex">
            <img className='h-11 w-5 pr-2' src={logo.src} alt='logo'/>
            <span>new<br />connection</span>
        </div>
    )
}

export default Logo;