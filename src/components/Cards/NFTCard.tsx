import * as React from "react";
import NFTExample from "assets/nft-example.png";
import Image from "next/image";
import BlockchainExample from "assets/chains/Polygon.png";
import { getChainScanner } from "utils/network";

interface INFTCard {
    tokenAddress: string;
    chainId: number;
}

const NFTCard = ({ tokenAddress, chainId }: INFTCard) => {
    return (
        <div className="border-solid border-4 w-1/4 rounded-md">
            {/* //Wrap to div for center elements */}
            <div className="flex justify-center">
                <Image src={NFTExample} className="rounded-t-md" objectFit="contain" />
            </div>

            <div className="p-4 gap-y-6">
                <p>NFT Membership title</p>
                <div className="flex pt-4 justify-between">
                    <p className="font-light text-sm text-[#AAAAAA]">Art</p>
                    <Image src={BlockchainExample} height="24" width="24" />
                </div>
            </div>
        </div>
    );
};

const NFTCardMockup = () => {
    return (
        <div className="border-solid border-4 w-1/4 rounded-md">
            {/* //Wrap to div for center elements */}
            <div className="flex justify-center">
                <Image src={NFTExample} className="rounded-t-md" objectFit="contain" />
            </div>

            <div className="p-4 gap-y-6">
                <p>NFT Membership title</p>
                <div className="flex pt-4 justify-between">
                    <p className="font-light text-sm text-[#AAAAAA]">Art</p>
                    <Image src={BlockchainExample} height="24" width="24" />
                </div>
            </div>
        </div>
    );
};

export default NFTCardMockup;
