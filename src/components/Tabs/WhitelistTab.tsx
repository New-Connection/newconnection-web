import * as React from "react";
import { useState } from "react";
import { formatAddress, handleContractError } from "utils";
import { AddToWhitelist, checkCorrectNetwork, getLogoURI } from "interactions/contract";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import { MockupTextCard } from "components";
import { useSwitchNetwork } from "wagmi";
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
    deleteFunction: Function;
}

export const WhitelistTab = ({ whitelist, signer, isOwner, isLoaded, chainId, deleteFunction }: IWhitelistTab) => {
    const [click, setClick] = useState(false);
    const { switchNetwork } = useSwitchNetwork();

    const addToWhitelist = async (walletAddress: string, votingTokenAddress: string) => {
        if (!(await checkCorrectNetwork(signer, chainId, switchNetwork))) {
            return;
        }

        setClick(true);
        console.log("voting token " + votingTokenAddress);
        const status = await AddToWhitelist({
            addressNFT: votingTokenAddress,
            walletAddress: walletAddress,
            signer: signer,
        });

        try {
            if (status) {
                await deleteFunction(walletAddress);

                toast.success("Wallet added to Whitelist");
            }
        } catch (e) {
            handleContractError(e);
        }

        setClick(false);
    };

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
                                    await addToWhitelist(walletAddress, votingTokenAddress);
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
