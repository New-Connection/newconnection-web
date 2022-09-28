import { BlockchainImage } from "../Icons/BlockchainImage";
import * as React from "react";

export const MockupLoadingProposals = ({ chain }: { chain: number | string }) => {
    return (
        <div className="nft-card w-full animate-pulse">
            {/* //Wrap to div for center elements */}
            <div className="mt-4 mx-4 h-2.5 w-full-8 bg-gray2 rounded"></div>
            <div className="mt-4 mx-4 h-2.5 w-full-8 bg-gray2 rounded"></div>
            <div className="mt-4 mx-4 h-2.5 w-full-8 bg-gray2 rounded"></div>
            <div className="mt-4 mx-4 h-2.5 w-full-8 bg-gray2 rounded"></div>
            <div className="p-4 gap-y-6">
                <div className="flex justify-between">
                    <div className="h-2.5 w-20 bg-gray2 rounded"></div>
                    <div className="h-2.5 w-8 bg-gray2 rounded"></div>
                </div>
                <div className="flex pt-4 justify-between">
                    <div className="h-2.5 w-14 bg-gray2 rounded"></div>
                    <BlockchainImage chain={chain} />
                </div>
            </div>
        </div>
    );
};

export const MockupLoadingNFT = ({ chain }: { chain: number | string }) => {
    return (
        <div className="nft-card animate-pulse ">
            {/* //Wrap to div for center elements */}
            <div className="mt-4 mx-4 h-36 w-full-8 bg-gray2 rounded"></div>
            <div className="p-4 gap-y-6">
                <div className="flex justify-between">
                    <div className="h-2.5 w-20 bg-gray2 rounded"></div>
                    <div className="h-2.5 w-8 bg-gray2 rounded"></div>
                </div>
                <div className="flex pt-4 justify-between">
                    <div className="h-2.5 w-14 bg-gray2 rounded"></div>
                    <BlockchainImage chain={chain} />
                </div>
            </div>
        </div>
    );
};

