import * as React from "react";
import { Separator } from "ariakit/separator";

import { DiscordIcon, TwitterIcon } from "components/Icons/";

const Footer = () => {
    return (
        <footer className="absolute bottom-0 w-full h-16 sm:h-24 border-t-2 border-purple pt-6">
            <div className="max-w-screen-xl pb-8 px-4 mx-auto sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between sm:space-y-2">
                    <div className="flex justify-center sm:justify-start ">
                        <p className="text-sm">contact@newconnection.xyz</p>
                    </div>

                    <div className="mt-4 text-sm text-center items-center text-gray-400 lg:text-center lg:mt-0 space-x-4">
                        <button className="cursor-not-allowed hover:text-gray2">Terms</button>
                        <button className="cursor-not-allowed hover:text-gray2">Privacy</button>
                    </div>
                    <div className="flex justify-center sm:justify-start space-x-2 mt-4">
                        <button className="flex pl-[0.6em] items-center cursor-not-allowed w-[60px] h-[60px] bg-gray rounded-md fill-purple hover:fill-gray2">
                            <DiscordIcon />
                        </button>
                        <a
                            href="https://twitter.com/NewConnectionX"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <button className="w-[60px] h-[60px] pl-[0.6em] bg-gray rounded-md fill-[#1DA1F2] hover:bg-purple hover:fill-white">
                                <TwitterIcon />
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
