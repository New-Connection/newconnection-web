import * as React from "react";
import { DiscordIcon, TwitterIcon } from "components";

const Footer = () => {
    return (
        <footer
            className="footer footer-center grid-flow-row md:grid-flow-col py-4 px-8 border-t-2 border-primary/80 rounded-2xl">
            <div className="grid md:grid-flow-col md:justify-self-start gap-10">
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

            <div className="grid grid-flow-col gap-4 md:justify-self-end">
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
        </footer>
    );
};

export default Footer;
