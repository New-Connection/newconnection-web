import * as React from "react";
import Image from "next/image";

import Discord from "assets/social/Discord-Icon.png";
import Twitter from "assets/social/Twitter-Icon.png";

const Footer = () => {
    const SpaceBetweenButtons = () => {
        return <div className="w-4 h-auto inline-block"></div>;
    };

    return (
        <footer className="absolute bottom-0 w-full h-16">
            <div className="flex justify-between">
                <p className="align-middle pt-4 pl-2">contact@newconnection.xyz</p>
                <div className="pt-4">
                    <button>Terms</button>
                    <SpaceBetweenButtons />
                    <button>Privacy</button>
                </div>
                <div className="pr-4 pb-2">
                    <button className="h-16 w-16 bg-[#F6F6F6] rounded-md">
                        <Image src={Discord} />
                    </button>
                    <SpaceBetweenButtons />
                    <button className="h-16 w-16 bg-[#F6F6F6] rounded-md">
                        <Image src={Twitter} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
