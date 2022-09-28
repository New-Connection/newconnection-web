import * as React from "react";
import ASSETS from "assets";
import Image from "next/image";
import classNames from "classnames";
import { formatAddress } from "utils/address";
import { BlockchainImage } from "../Icons/BlockchainImage";
import { INFTVoting } from "types/forms";
import { DisclosureState } from "ariakit";
import { ButtonState } from "types/daoIntefaces";


interface INFTImage {
    image?: string;
    className?: string;
    index?: number;
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

interface INFTCard {
    nftObject: INFTVoting;
    setCurrentNFT: React.Dispatch<React.SetStateAction<INFTVoting>>;
    setButtonState: React.Dispatch<React.SetStateAction<ButtonState>>
    detailNFTDialog: DisclosureState;
    chain: number | string;
}

export const NFTCard = ({ nftObject, setCurrentNFT, setButtonState, detailNFTDialog, chain }: INFTCard) => {
    return (
        <button
            className="nft-card"
            onClick={() => {
                setButtonState("Mint");
                setCurrentNFT(nftObject);
                detailNFTDialog.toggle();
            }}
        >
            {/* //Wrap to div for center elements */}
            <NFTImage image={nftObject.image} />
            <div className="p-4 gap-y-6">
                <div className="flex justify-between">
                    <p className="text-start">{nftObject.title}</p>
                    <p className="font-light text-sm text-purple">{nftObject.price}</p>
                </div>
                <div className="flex pt-4 justify-between">
                    <p className="font-light text-sm text-[#AAAAAA]">
                        {formatAddress(nftObject.tokenAddress)}
                    </p>
                    <BlockchainImage chain={chain} />
                </div>
            </div>
        </button>
    );
};