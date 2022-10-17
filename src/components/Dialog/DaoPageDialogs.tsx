import { createTreasurySteps, CustomDialog, SpinnerLoading, StepperDialog } from "./base-dialogs";
import * as React from "react";
import { BlockchainIcon, CopyTextButton, InputAmount, NFTImage } from "components";
import { getChainScanner, getTokenSymbol } from "interactions/contract";
import { LinkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { IContributeTreasuryDialog, ICreateTreasuryDialog, IDetainNftDialog } from "./dialogInterfaces";

export const DetailNftDialog = ({ dialog, DAO, currentNFT, buttonState, mintButton }: IDetainNftDialog) => {
    return (
        <CustomDialog dialog={dialog} className="h-full items-center text-center">
            {currentNFT && (
                <>
                    <NFTImage className="rounded-lg h-14 w-14" image={currentNFT.image} />
                    <div className="mt-4 text-base-content">{`${currentNFT.title}`}</div>
                    <a
                        href={getChainScanner(DAO.chainId, currentNFT.tokenAddress)}
                        target={"_blank"}
                        className="hover:text-primary flex justify-center"
                    >
                        Smart Contract
                        <LinkIcon className="h-6 w-5" />
                    </a>

                    <div className={"flex justify-center"}>
                        <button
                            className={`secondary-button w-1/2 h-12 mt-4 mb-6 justify-center
                            ${buttonState === "Success" && "bg-success"} 
                            ${buttonState === "Error" && "bg-error"}`}
                            onClick={mintButton}
                        >
                            {buttonState}
                        </button>
                    </div>

                    <p className="w-full mt-8 text-start text-base-content">Details</p>
                    <ul className="py-6 w-full divide-y divide-slate-200">
                        <li className="flex py-4 justify-between">
                            <p className="font-light text-base-content/50">{"Type"}</p>
                            <p className="font-normal text-base-content">{currentNFT.type}</p>
                        </li>
                        <li className="flex py-4 justify-between">
                            <p className="font-light text-base-content/50">{"Price"}</p>
                            <p className="font-normal text-base-content">{currentNFT.price}</p>
                        </li>
                        <li className="flex py-4 justify-between">
                            <p className="font-light text-base-content/50">{"Supply"}</p>
                            <p className="font-normal text-base-content">
                                {currentNFT.totalMinted}/{currentNFT.totalSupply}
                            </p>
                        </li>
                        <li className="flex py-4 justify-between">
                            <p className="font-light text-base-content/50 mr-4">{"Address"}</p>
                            <div className="font-normal text-base-content">
                                <CopyTextButton copyText={currentNFT.tokenAddress} />
                            </div>
                        </li>
                        <li className="flex py-4 justify-between">
                            <p className="font-light text-base-content/50">{"Blockchain"}</p>
                            <div className="font-normal text-base-content">
                                <BlockchainIcon chain={DAO.blockchain[0]} />
                            </div>
                        </li>
                    </ul>
                </>
            )}
        </CustomDialog>
    );
};

export const ContributeTreasuryDialog = ({
    dialog,
    DAO,
    sending,
    setSending,
    contributeAmount,
    setContributeAmount,
    contributeToTreasuryButton,
}: IContributeTreasuryDialog) => {
    return (
        <CustomDialog dialog={dialog} className="">
            <div className={"flex items-center gap-2"}>
                <Image src={DAO.profileImage} height={"50px"} width={"50px"} className="rounded-xl" />
                <div>
                    <div className={"text-xl capitalize font-semibold"}>{DAO.name} treasury</div>
                    {DAO.treasuryAddress ? <CopyTextButton copyText={DAO.treasuryAddress} /> : <></>}
                </div>
            </div>
            <form
                onSubmit={(event) => {
                    setSending(() => true);
                    contributeToTreasuryButton(event).then();
                }}
            >
                <InputAmount
                    placeholder={"Amount in " + getTokenSymbol(DAO.chainId)}
                    name="price"
                    handleChange={(event) => setContributeAmount(() => event.target.value)}
                    className="w-full"
                    min={0.0001}
                    step={0.0001}
                    max={10}
                />
                <div className={"flex justify-center"}>
                    {!sending ? (
                        <button
                            disabled={+contributeAmount === 0}
                            className="secondary-button h-12 mt-4 mb-2 gradient-btn-color transition delay-150 hover:reverse-gradient-btn-color"
                        >
                            Send
                        </button>
                    ) : (
                        <div className={"flex mt-4 gap-2"}>
                            <div className={"w-7"}>
                                <SpinnerLoading />
                            </div>
                            <div className="text-xl text-base-content">Waiting confirmation from blockchain</div>
                        </div>
                    )}
                </div>
            </form>
        </CustomDialog>
    );
};

export const CreateTreasuryDialog = ({ dialog, DAO, createTreasuryStep }: ICreateTreasuryDialog) => {
    return (
        <StepperDialog dialog={dialog} className="dialog" activeStep={createTreasuryStep} steps={createTreasurySteps}>
            <p className="ml-7">Deployment successful!</p>
            <div className="flex ml-7 mb-10">
                <div className={"mr-4"}>Treasury Address:</div>
                <CopyTextButton copyText={DAO.treasuryAddress} />
            </div>
            <button
                className="form-submit-button"
                onClick={() => {
                    dialog.toggle();
                }}
            >
                Close
            </button>
        </StepperDialog>
    );
};
