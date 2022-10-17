import * as React from "react";
import { DiscordIcon, TwitterIcon } from "components";

const Footer = () => {
    return (
        <footer className="absolute bottom-0 w-full h-16 sm:h-24 border-t-2 border-primary/80 rounded-2xl pt-4">
            <div className="max-w-screen-xl pb-6 px-4 mx-auto sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between sm:space-y-2">
                    <div className="flex mt-4 text-sm text-center items-center lg:text-center lg:mt-0 space-x-8">
                        <div className="flex justify-center sm:justify-start bg-base-300 rounded-2xl p-2">
                            <p className="text-sm">contact@newconnection.xyz</p>
                        </div>

                        <button className="cursor-not-allowed hover:text-base-content/25 bg-base-300 rounded-2xl p-2">
                            Terms
                        </button>
                        <button className="cursor-not-allowed hover:text-base-content/25 bg-base-300 rounded-2xl p-2">
                            Privacy
                        </button>
                    </div>

                    <div className="flex justify-center sm:justify-start space-x-2 mt-4">
                        <button
                            className="grid place-items-center cursor-not-allowed w-[50px] h-[50px] bg-base-300 rounded-md hover:bg-primary/75 ">
                            <DiscordIcon height="33" width="35" />
                        </button>
                        <a href="https://twitter.com/NewConnectionX" target="_blank" rel="noreferrer">
                            <button
                                className="w-[50px] h-[50px] grid place-items-center bg-base-300 rounded-md hover:bg-primary/75">
                                <TwitterIcon height="26" width="30" />
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
