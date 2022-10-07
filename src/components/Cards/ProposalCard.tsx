import { timestampToDate } from "utils";
import { BlockchainIcon, CopyTextButton } from "components";
import React from "react";
import classNames from "classnames";
import { ICardProposal, IInformationCard, IProposalCard } from "./cardsInterfaces";

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
        <div className="h-56 py-5 justify-between">
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
                            <p className="text-gray3">For</p>
                            <p className="font-medium">{tokenName}</p>
                        </div>
                        <BlockchainIcon chain={chainId} />
                    </div>
                </div>

                <div className="hidden md:flex gap-10 items-left justify-between pt-1">
                    <div className="text-center">
                        <div className="relative px-5 py-3 text-black">
                            <p className="text-2xl font-light">{forV}</p>
                            <span className="absolute top-0 right-0 px-1 py-1 translate-x-1/2 -translate-y-1/2 bg-green rounded-full text-xs text-white"></span>
                        </div>
                        <p>{"In favor"}</p>
                    </div>
                    <div className="text-center">
                        <div className="relative px-5 py-3 text-black">
                            <p className="text-2xl font-light">{againstV}</p>
                            <span className="absolute top-0 right-0 px-1 py-1 translate-x-1/2 -translate-y-1/2 bg-red rounded-full text-xs text-white"></span>
                        </div>
                        <p>{"Against"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProposalActivityBadge = ({ isActive }) => {
    return (
        <div>
            {isActive ? (
                <p className="text-green bg-gray px-5 py-0.5 rounded-full">Active</p>
            ) : (
                <p className="text-red bg-gray px-5 py-0.5 rounded-full">Closed</p>
            )}
        </div>
    );
};

const DetailProposalCard = ({ title, children, className }: ICardProposal) => {
    return (
        <div className={classNames("w-full h-64 border-2 border-gray rounded-xl mt-6 p-4", className)}>
            <p className="text-purple mb-4 text-lg">{title}</p>
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
                <div className={"text-gray2"}>{name}</div>
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
                <div className="text-center">
                    <div className="relative px-5 py-3 text-black">
                        <p className="text-2xl font-light">{proposalData.forVotes}</p>
                        <span className="absolute top-0 right-0 px-1 py-1 translate-x-1/2 -translate-y-1/2 bg-green rounded-full text-xs text-white"></span>
                    </div>
                    <p>{"In favor"}</p>
                </div>
                <div className="text-center">
                    <div className="relative px-5 py-3 text-black">
                        <p className="text-2xl font-light">{proposalData.againstVotes}</p>
                        <span className="absolute top-0 right-0 px-1 py-1 translate-x-1/2 -translate-y-1/2 bg-red rounded-full text-xs text-white"></span>
                    </div>
                    <p>{"Against"}</p>
                </div>
            </div>
        </DetailProposalCard>
    );
};
