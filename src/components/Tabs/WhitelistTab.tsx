import * as React from "react";
import { useState } from "react";
import { getLogoURI } from "interactions/contract";
import { Signer } from "ethers";
import { CopyTextButton, MockupTextCard } from "components";
import { IWhitelistRecord } from "types";

const renderValue = (chain: string) => {
    const image = getLogoURI(chain);
    return <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />;
};

interface IWhitelistTab {
    whitelist: IWhitelistRecord[];
    signer: Signer;
    isLoaded: boolean;
    chainId: number;
    governorUrl: string;
    addToWhitelist: Function;
}

export const WhitelistTab = ({ whitelist, isLoaded, addToWhitelist }: IWhitelistTab) => {
    const [click, setClick] = useState(false);

    return whitelist && whitelist.length !== 0 ? (
        <div className="grid grid-flow-row gap-4">
            <div className="grid grid-cols-7 px-4 py-2 text-base-content/50">
                <div>Wallet Address</div>
                <div className={"justify-self-center"}>Blockchain</div>
                <div className={"justify-self-center"}>NFT</div>
                <p className={"col-span-2 justify-self-center"}>Notes</p>
                <p className={"col-span-2 justify-self-end mr-20"}>Action</p>
            </div>

            {whitelist.map((wl, index) => {
                const walletAddress = wl.walletAddress;
                const votingTokenName = wl.votingTokenName;
                const votingTokenAddress = wl.votingTokenAddress;
                const note = wl.note;
                const blockchainSelected = wl.blockchainSelected;
                return (
                    <div className="grid grid-cols-7 items-center px-4 py-2 bg-base-300 rounded-2xl" key={index}>
                        <div>{<CopyTextButton copyText={walletAddress} />}</div>
                        <div className={"justify-self-center"}>{renderValue(blockchainSelected[0])}</div>
                        <div className={"justify-self-center"}>{votingTokenName}</div>
                        <p className="col-span-2 text-sm line-clamp-3 text-center justify-self-center">{note}</p>

                        {isLoaded && (
                            <div className={"col-span-2 btn-group justify-self-end"}>
                                <button
                                    className="btn btn-sm bg-success border-base-200"
                                    onClick={async () => {
                                        setClick(true);
                                        await addToWhitelist(walletAddress, votingTokenAddress);
                                        setClick(false);
                                    }}
                                    disabled={click}
                                >
                                    {click ? "Loading..." : "Add"}
                                </button>
                                <button
                                    className="btn btn-sm bg-error border-base-200"
                                    onClick={async () => {
                                        await addToWhitelist(walletAddress, votingTokenAddress, true);
                                    }}
                                    disabled={click}
                                >
                                    {"Delete"}
                                </button>
                            </div>
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
