import * as React from "react";
import { useState } from "react";
import { formatAddress } from "utils/address";
import { AddToWhitelist } from "contract-interactions";
import { Signer } from "ethers";
import toast from "react-hot-toast";
import { MockupTextCard } from "../Mockup";
import { getLogoURI } from "utils/blockchains";
import { useSwitchNetwork } from "wagmi";
import { IWhitelistRecord } from "types/forms";
import { checkCorrectNetwork } from "logic";
import { handleContractError } from "utils/errors";

const renderValue = (chain: string) => {
    const image = getLogoURI(chain);
    return <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />;
};

interface IWhitelistTab {
    whitelist: IWhitelistRecord[];
    signer: Signer;
    chainId: number;
    deleteFunction: Function;
}

export const WhitelistTab = ({ whitelist, signer, chainId, deleteFunction }: IWhitelistTab) => {
    const [click, setClick] = useState(false);
    const { switchNetwork } = useSwitchNetwork();

    return whitelist && whitelist.length !== 0 ? (
        <div className="w-full justify-between space-y-5 gap-5">
            <div className="flex text-gray2 justify-between text-center pb-4 pt-0">
                <div className="flex w-2/4 pr-3">
                    <div className="flex w-1/3">Wallet Address</div>
                    <div className="flex w-1/3">Blockchain</div>
                    <div className="flex w-1/3">NFT</div>
                </div>
                <p className="w-1/4">Notes</p>
                <p className="w-1/4">Action</p>
            </div>
            {whitelist.map((wl, index) => {
                const walletAddress = wl.walletAddress;
                const votingTokenName = wl.votingTokenName;
                const votingTokenAddress = wl.votingTokenAddress;
                const note = wl.note;
                const blockchainSelected = wl.blockchainSelected;
                return (
                    <div className="w-full flex gap-5" key={index}>
                        <div className="flex w-2/4">
                            <div className=" flex w-1/3">{formatAddress(walletAddress)}</div>
                            <div className="flex pl-5 w-1/3">{renderValue(blockchainSelected[0])}</div>
                            <div className="flex w-1/3">{votingTokenName}</div>
                        </div>
                        <p className="w-1/4 text-sm line-clamp-3 text-center">{note}</p>

                        <button
                            className="w-1/4 settings-button py-2 px-4 bg-white border-gray2 border-2 btn-state"
                            onClick={async () => {
                                if (!(await checkCorrectNetwork(signer, chainId, switchNetwork))) {
                                    return;
                                }

                                setClick(true);
                                try {
                                    console.log(votingTokenAddress);
                                    const status = await AddToWhitelist({
                                        addressNFT: votingTokenAddress,
                                        walletAddress: walletAddress,
                                        signer: signer,
                                    });

                                    status
                                        ? toast.success("Wallet added to Whitelist")
                                        : toast.error("Only owner of DAO can add a new members");
                                    setClick(false);

                                    deleteFunction(walletAddress);
                                } catch (error) {
                                    handleContractError(error);
                                }
                                setClick(false);
                            }}
                            disabled={click}
                        >
                            {click ? <p className="text-gray2">Loading...</p> : <p>Add</p>}
                        </button>
                    </div>
                );
            })}
        </div>
    ) : (
        <div className="text-center">
            <MockupTextCard
                label={"No members here yet"}
                text={
                    "You can join DAO click to become member" +
                    "then click the button “Add new proposals” and initiate a proposals"
                }
            />
        </div>
    );
};
