import * as React from "react";
import ASSETS from "assets";
import Image from "next/image";
import classNames from "classnames";
import { formatAddress } from "utils/address";
import { BlockchainIcon } from "components/Icons/";
import { INFTVoting } from "types/forms";
import { DisclosureState } from "ariakit";
import { ButtonState } from "types/daoIntefaces";

interface INFTImage {
    image?: string;
    className?: string;
    index?: number;
}


interface INFTCard {
    nftObject: INFTVoting;
    chain?: number | string;
    className?: string,
}

interface INFTCardWithDialog extends INFTCard {
    nftObject: INFTVoting;
    setCurrentNFT?: React.Dispatch<React.SetStateAction<INFTVoting>>;
    setButtonState?: React.Dispatch<React.SetStateAction<ButtonState>>;
    detailNFTDialog?: DisclosureState;
    chain: number | string;
}

export const NFTImage = ({ className, image }: INFTImage) => {
    return (
        <div className="flex justify-center">
            {
                <Image
                    src={image ? image : ASSETS.daoNFTMock}
                    width={"200"}
                    height={"200"}
                    className={classNames("rounded-t-md", className)}
                />
            }
        </div>
    );
};

export function NFTCardWithDialog({
    nftObject,
    setCurrentNFT,
    setButtonState,
    detailNFTDialog,
    chain
}: INFTCardWithDialog) {
    return (
        <div>
            <button
                onClick={() => {
                    setButtonState("Mint");
                    setCurrentNFT(nftObject);
                    detailNFTDialog.toggle();
                }}
            >
                <NFTCard nftObject={nftObject} chain={chain} />
            </button>
        </div>
    );
}

export const NFTCard = ({ nftObject, chain, className = "nft-card" }: INFTCard) => {
    return (
        <div className={className}>
            <div className="flex-shrink-0">
                <img className="h-72 w-full object-cover" src={nftObject.image} alt="" />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white px-6 pt-2 pb-6">
                <div className="flex-1">
                    <div className="mt-1 flex justify-between">
                        <p className="text-base font-medium text-black mt-1">{nftObject.title}</p>
                        {/* TODO: Pass variable how many minted NFT and how many left */}
                        <p className="text-base font-medium ml-4 mt-1 text-gray2">
                            {nftObject.totalMinted}/{nftObject.totalSupply}
                        </p>
                    </div>
                </div>
                <div className="mt-[0.75rem] flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <p className="text-sm font-normal text-black">{formatAddress(nftObject.tokenAddress)}</p>
                    </div>
                    <div className="ml-3 flex gap-2">
                        <p className="text-sm font-normal text-purple">{nftObject.price}</p>
                        <BlockchainIcon chain={chain} />
                    </div>
                </div>
            </div>
        </div>
    );
};
