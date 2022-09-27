import * as React from "react";
import ASSETS from "assets";
import Image from "next/image";
import classNames from "classnames";

interface INFTCard {
    tokenAddress: string;
    chainId: number;
}

interface INFTCardMockup {
    className?: string;
}

const NFTCard = ({ tokenAddress, chainId, daoTitle, dialog }) => {
    return (
        <button className="nft-card" onClick={() => dialog.toggle()}>
            {/* //Wrap to div for center elements */}
            <div className="flex justify-center">
                <Image src={ASSETS.daoNFTMock} className="rounded-t-md" objectFit="contain" />
            </div>
            <div className="p-4 gap-y-6">
                <p className="text-start">{daoTitle}</p>
                <div className="flex pt-4 justify-between">
                    <p className="font-light text-sm text-[#AAAAAA]">Type: Unknown</p>
                    <Image src={ASSETS.Polygon} height="24" width="24" />
                </div>
            </div>
        </button>
    );
};

const NFTCardMockup = ({ className }: INFTCardMockup) => {
    return (
        <div className={classNames("nft-card", className)}>
            {/* //Wrap to div for center elements */}
            <div className="flex justify-center">
                <Image src={ASSETS.daoNFTMock} className="rounded-t-md" objectFit="contain" />
            </div>

            <div className="p-4 gap-y-6">
                <p>NFT Membership title</p>
                <div className="flex pt-4 justify-between">
                    <p className="font-light text-sm text-gray2">Art</p>
                    <Image src={ASSETS.Polygon} height="24" width="24" />
                </div>
            </div>
        </div>
    );
};

export { NFTCardMockup, NFTCard };
