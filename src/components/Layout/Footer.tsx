import * as React from "react";
import Image from "next/image";
import { Separator } from "ariakit/separator";

import Discord from "assets/social/Discord-Icon.png";
import Twitter from "assets/social/Twitter-Icon.png";

const Footer = () => {
    const SpaceBetweenButtons = () => {
        return <div className="w-4 h-auto inline-block"></div>;
    };

    return (
        <footer className="absolute bottom-0 w-full h-16">
            <Separator
                orientation="horizontal"
                className="mt-16 mb-6 h-0 w-full border-t-2 border-[#6858CB]"
            />
            <div className="flex justify-between">
                <p className="align-middle pt-4 pl-2">contact@newconnection.xyz</p>
                <div className="pt-4">
                    <button className="cursor-not-allowed">Terms</button>
                    <SpaceBetweenButtons />
                    <button className="cursor-not-allowed">Privacy</button>
                </div>
                <div className="pr-4 pb-2">
                    <button className="cursor-not-allowed h-16 w-16 bg-[#F6F6F6] rounded-md">
                        <Image src={Discord} />
                    </button>
                    <SpaceBetweenButtons />
                    <a href="https://twitter.com/NewConnectionX" target="_blank" rel="noreferrer">
                        <button className="h-16 w-16 bg-[#F6F6F6] rounded-md">
                            <Image src={Twitter} />
                        </button>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
