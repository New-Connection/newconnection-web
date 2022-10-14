import * as React from "react";
import { useState } from "react";
import { formatAddress } from "utils";
import { getLogoURI } from "interactions/contract";
import { Signer } from "ethers";
import { MockupTextCard } from "components";
import { IWhitelistRecord } from "types";

const renderValue = (chain: string) => {
    const image = getLogoURI(chain);
    return <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />;
};

interface IWhitelistTab {
    whitelist: IWhitelistRecord[];
    signer: Signer;
    isLoaded: boolean;
    isOwner: boolean;
    chainId: number;
    governorUrl: string;
    addToWhitelist: Function;
}

export const WhitelistTab = ({ whitelist, isOwner, isLoaded, addToWhitelist, }: IWhitelistTab) => {
    const [click, setClick] = useState(false);

    return whitelist && whitelist.length !== 0 ? (
        <div className="w-full justify-between space-y-5 gap-5">
            <div className="flex text-gray2 pb-4 pt-0">
                <div className="flex w-2/4">
                    <div className="w-1/3">Wallet Address</div>
                    <div className="w-1/3">Blockchain</div>
                    <div className="w-1/3">NFT</div>
                </div>
                <p className="w-1/4">Notes</p>
                {isOwner && <p className="w-1/4 text-center">Action</p>}
            </div>

            {whitelist.map((wl, index) => {
                const walletAddress = wl.walletAddress;
                const votingTokenName = wl.votingTokenName;
                const votingTokenAddress = wl.votingTokenAddress;
                const note = wl.note;
                const blockchainSelected = wl.blockchainSelected;
                return (
                    <div className="flex w-full" key={index}>
                        <div className="flex w-2/4">
                            <div className="w-1/3">{formatAddress(walletAddress)}</div>
                            <div className="w-1/3 pl-7">{renderValue(blockchainSelected[0])}</div>
                            <div className="w-1/3">{votingTokenName}</div>
                        </div>
                        <p className="w-1/4 text-sm line-clamp-3 text-center">{note}</p>

                        {isOwner && isLoaded && (
                            <button
                                className="w-1/4 settings-button py-2 px-4 bg-white border-gray2 border-2 btn-state"
                                onClick={async () => {
                                    setClick(true);
                                    await addToWhitelist(walletAddress, votingTokenAddress);
                                    setClick(false);
                                }}
                                disabled={click}
                            >
                                {click ? <p className="text-gray2">Loading...</p> : <p>Add</p>}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    ) : (
        <div className="text-center">
            <MockupTextCard
                label={"No whitelist requests here yet"}
                text={
                    "You can send a request to join the DAO by clicking the become a member button" +
                    "then click the button “Add new proposals” and initiate a proposals"
                }
            />
        </div>
    );
};
