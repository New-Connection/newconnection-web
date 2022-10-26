import { createTreasurySteps, CustomDialog, SpinnerLoading, StepperDialog } from "./base-dialogs";
import * as React from "react";
import { BlockchainIcon, CopyTextButton, DetailNftListItem, InputAmount, NFTImage } from "components";
import { getChainScanner, getTokenSymbol } from "interactions/contract";
import { LinkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { IContributeTreasuryDialog, ICreateTreasuryDialog, IDetainNftDialog } from "./dialogInterfaces";
import Link from "next/link";
import classNames from "classnames";

export const DetailNftDialog = ({ dialog, DAO, currentNFT, buttonState, mintButton }: IDetainNftDialog) => {
    return (
        <CustomDialog dialog={dialog} className="h-full bg-base-100 items-center text-center">
            {currentNFT && (
                <div className={"grid grid-flow-row gap-4"}>
                    <NFTImage className="rounded-lg h-14 w-14" image={currentNFT.image} />
                    <div className="text-base-content text-xl">{`${currentNFT.title}`}</div>
                    <a
                        href={getChainScanner(DAO.chainId, currentNFT.tokenAddress)}
                        target={"_blank"}
                        className="hover:text-primary flex justify-center gap-2"
                    >
                        Smart Contract
                        <LinkIcon className="h-6 w-5" />
                    </a>

                    <div className={"flex justify-center h-12"}>
                        {currentNFT.tokenRequestApproved ? (
                            <button
                                className={classNames(
                                    "main-button",
                                    buttonState === "Success" && "bg-success",
                                    buttonState === "Error" && "bg-error"
                                )}
                                onClick={mintButton}
                            >
                                {buttonState}
                            </button>
                        ) : currentNFT.tokenRequestedByMember ? (
                            <button className={"main-button disabled:bg-base-200"} disabled>
                                Confirmation awaited
                            </button>
                        ) : (
                            <Link
                                href={{
                                    pathname: `${DAO.url}/add-new-member`,
                                }}
                            >
                                <button className={"main-button"}>Send request</button>
                            </Link>
                        )}
                    </div>

                    <p className="w-full text-xl text-start text-base-content">Details</p>
                    <ul className="w-full divide-y divide-slate-200">
                        {currentNFT.tokenMintedByMember > 0 && (
                            <li className="flex py-4 justify-between">
                                <div className="font-normal text-primary/75">{"Balance"}</div>
                                <div className="font-normal text-primary/50">{currentNFT.tokenMintedByMember}</div>
                            </li>
                        )}
                        <DetailNftListItem property={"Type"} value={currentNFT.type} />
                        <DetailNftListItem property={"Price"} value={currentNFT.price} />
                        <DetailNftListItem
                            property={"Supply"}
                            value={`${currentNFT.totalMinted}/${currentNFT.totalSupply}`}
                        />
                        <DetailNftListItem
                            property={"Address"}
                            value={<CopyTextButton copyText={currentNFT.tokenAddress} />}
                        />
                        <DetailNftListItem
                            property={"Blockchain"}
                            value={<BlockchainIcon chain={DAO.blockchain[0]} />}
                        />
                    </ul>
                </div>
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
                        <button disabled={+contributeAmount === 0} className="main-button h-12 mt-4 mb-2">
                            Send
                        </button>
                    ) : (
                        <div className={"flex mt-6 gap-2"}>
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
                className="dialog-button"
                onClick={() => {
                    dialog.toggle();
                }}
            >
                Close
            </button>
        </StepperDialog>
    );
};
