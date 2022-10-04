import { BlockchainIcon } from "components/Icons/";
import * as React from "react";

const getLoadingStrings = (amount: number) => {
    const array = new Array(amount).fill(0);
    return (
        <div>
            {array.map((element, index) => (
                <div key={index} className="mt-4 mx-4 h-2.5 w-full-8 bg-gray2 rounded"></div>
            ))}
        </div>
    );
};

export const MockupLoadingDetailDAOPage = () => {
    return (
        <>
            <div className="dao-header lg:flex md:flex xl:flex items-center -mt-10">
                <div className={"bg-gray2 h-52 w-52 animate-pulse rounded-md"}></div>
                <div className={"info flex flex-col ml-6 w-full gap-8"}>
                    <div className={"info-row-1 flex justify-between items-center"}>
                        <div className={"dao-name bg-gray2 animate-pulse rounded-full"}>
                            <div className="text-gray2 dao-label capitalize px-2">DAO NAME HELLO</div>
                        </div>
                        <div className={"member-button"}>
                            <button
                                className={
                                    "secondary-button disabled:bg-gray disabled:hover:bg-gray animate-pulse text-gray2"
                                }
                                disabled={true}
                            >
                                Become a member
                            </button>
                        </div>
                    </div>
                    <div className={"info-row-2 flex justify-between"}>
                        <div className={"about flex gap-10"}>
                            <a target={"_blank"} className="dao-about-button">
                                About
                            </a>
                            <div className="dao-about-button items-center">
                                <p>Blockchain</p>
                            </div>
                        </div>
                        <div className={"links flex gap-5"}>
                            <div className="bg-gray2 rounded-full h-9 w-9 animate-pulse "></div>
                            <div className="bg-gray2 rounded-full h-9 w-9 animate-pulse"></div>
                            <div className="bg-gray2 rounded-full h-9 w-9 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const MockupLoadingDAO = () => {
    return (
        <div className="nft-card w-full animate-pulse">
            {/* //Wrap to div for center elements */}
            {getLoadingStrings(10)}
            <div className="p-4 gap-y-6">
                <div className="flex justify-between">
                    <div className="h-2.5 w-20 bg-gray2 rounded"></div>
                    <div className="h-2.5 w-8 bg-gray2 rounded"></div>
                </div>
                <div className="flex pt-4 justify-between">
                    <div className="h-2.5 w-14 bg-gray2 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export const MockupLoadingProposals = ({ chain }: { chain: number | string }) => {
    return (
        <div className="nft-card w-full animate-pulse">
            {/* //Wrap to div for center elements */}
            {getLoadingStrings(4)}
            <div className="p-4 gap-y-6">
                <div className="flex justify-between">
                    <div className="h-2.5 w-20 bg-gray2 rounded"></div>
                    <div className="h-2.5 w-8 bg-gray2 rounded"></div>
                </div>
                <div className="flex pt-4 justify-between">
                    <div className="h-2.5 w-14 bg-gray2 rounded"></div>
                    <BlockchainIcon chain={chain} />
                </div>
            </div>
        </div>
    );
};

export const MockupLoadingNFT = ({ chain }: { chain: number | string }) => {
    return (
        <div className="flex flex-col overflow-hidden w-72 rounded-lg border border-gray3">
            <div className="flex-shrink-0">
                <div className="animate-pulse h-72 w-full object-cover bg-gray2" />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white px-6 pt-2 pb-6">
                <div className="flex-1">
                    <div className="mt-1 flex justify-between">
                        <p className="text-base font-medium animation-pulse bg-gray2 text-gray2 mt-1">Nft membership</p>
                        {/* TODO: Pass variable how many minted NFT and how many left */}
                        <p className="text-base font-medium ml-4 mt-2 animate-pulse bg-gray2 text-gray2">499/500</p>
                    </div>
                </div>
                <div className="mt-[0.75rem] flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <p className="text-sm font-normal animate-pulse bg-gray2 text-gray2">0x0000...0000</p>
                    </div>
                    <div className="ml-3 flex gap-2">
                        <p className="text-sm font-normal animate-pulse bg-gray2 text-gray2">000</p>
                        <BlockchainIcon chain={chain} />
                    </div>
                </div>
            </div>
        </div>
    );
};
