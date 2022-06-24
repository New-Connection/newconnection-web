import React from "react";

import logo from "assets/logo.png";

const Logo = () => {
    return (
        <div className="flex">
            <img className="h-11 w-5 pr-2" src={logo.src} alt="logo" />
            <p>
                new
                <br />
                connection
            </p>
        </div>
    );
};

export default Logo;
