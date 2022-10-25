import { timestampToDate } from "utils";
import { BlockchainIcon, CopyTextButton } from "components";
import React from "react";
import classNames from "classnames";
import { ICardProposal, IInformationCard, IProposalCard, IVotingCounter } from "./cardsInterfaces";

export const ProposalCard = ({
    title,
    shortDescription,
    tokenName,
    isActive,
    chainId,
    forVotes,
    againstVotes,
    deadline,
}: IProposalCard) => {
    const againstV = +againstVotes! ?? 0;
    const forV = +forVotes! ?? 0;
    return (
        <div className="rounded-2xl bg-base-300 cursor-pointer active:bg-base-300 justify-between py-4 px-6">
            <div className="flex justify-between pb-6">
                <p className="font-medium text-xl">{title}</p>
                <div>
                    <div className="flex gap-5">
                        {isActive && (
                            <p className="hidden md:block font-light text-sm pt-1">
                                Ends {timestampToDate(deadline || 0)}
                            </p>
                        )}
                        <ProposalActivityBadge isActive={isActive} />
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="grid grid-cols-1 gap-2 content-between md:w-3/4">
                    <p className="w-full h-24 font-normal line-clamp-3">{shortDescription}</p>
                    <div className="flex gap-5">
                        <div className="flex gap-5">
                            <p className="text-base-content/50">For</p>
                            <p className="font-medium">{tokenName}</p>
                        </div>
                        <BlockchainIcon chain={chainId} />
                    </div>
                </div>

                <div className="hidden md:flex gap-10 items-left justify-between pt-1">
                    <VotingCounter counter={forV.toString()} option={"For"} />
                    <VotingCounter counter={againstV.toString()} option={"Against"} />
                </div>
            </div>
        </div>
    );
};

export const ProposalActivityBadge = ({ isActive }) => {
    return (
        <div>
            {isActive ? (
                <p className="badge-active mr-0 px-5 py-0.5 rounded-full">Active</p>
            ) : (
                <p className="badge-non-active mr-0 px-5 py-0.5 rounded-full">Closed</p>
            )}
        </div>
    );
};

const DetailProposalCard = ({ title, children, className }: ICardProposal) => {
    return (
        <div className={classNames("w-full h-64 border-2 border-base-300 rounded-xl mt-6 p-4", className)}>
            <p className="text-primary mb-4 text-lg">{title}</p>
            <div>{children}</div>
        </div>
    );
};

export const AboutProposalCard = ({ proposalData }: IInformationCard) => {
    return (
        <DetailProposalCard title="About" className="lg:w-1/3 w-full">
            <div className="text-sm h-44 overflow-y-auto">{proposalData.description}</div>
        </DetailProposalCard>
    );
};

export const InfoProposalCard = ({ proposalData }: IInformationCard) => {
    const InfoRow = ({ name, value }) => {
        return (
            <div className={"flex justify-between"}>
                <div className={"text-base-content/50"}>{name}</div>
                <div>{value}</div>
            </div>
        );
    };

    return (
        <DetailProposalCard title="Info" className="lg:w-1/3 w-full">
            <div className={"flex flex-col h-44 justify-between"}>
                <InfoRow name={"Start date"} value={timestampToDate(proposalData.startDateTimestamp)} />
                <InfoRow name={"End date"} value={timestampToDate(proposalData.endDateTimestamp)} />
                <InfoRow name={"Voting NFT"} value={proposalData.tokenName} />
                <InfoRow name={"Submitted by"} value={<CopyTextButton copyText={proposalData.ownerAddress} />} />
                <InfoRow name={"Proposal ID"} value={<CopyTextButton copyText={proposalData.proposalId} />} />
            </div>
        </DetailProposalCard>
    );
};

export const VotingResultsCard = ({ proposalData }: IInformationCard) => {
    return (
        <DetailProposalCard title="Voting Results" className="lg:w-1/3 w-full">
            <div className="flex gap-10 justify-around pt-1">
                <VotingCounter counter={proposalData.forVotes} option={"For"} />
                <VotingCounter counter={proposalData.againstVotes} option={"Against"} />
            </div>
        </DetailProposalCard>
    );
};

export const VotingCounter = ({ counter, option }: IVotingCounter) => {
    return (
        <div className="text-center">
            <div className="indicator relative px-5 py-3 text-base-content">
                <p className="text-2xl font-light">{counter}</p>
                <span
                    className={classNames(
                        "indicator-item badge badge-xs",
                        option === "Against" ? "badge-error" : "badge-success"
                    )}
                ></span>
            </div>
            <p>{option}</p>
        </div>
    );
};
