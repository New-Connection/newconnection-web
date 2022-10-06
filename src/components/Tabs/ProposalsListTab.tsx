import { IDAOPageForm, IProposalPageForm } from "types/forms";
import { saveMoralisInstance } from "database/interactions";
import Link from "next/link";
import { ProposalCard } from "components/Cards/";
import { MockupTextCard } from "../Mockup";
import { MockupLoadingProposals } from "../Mockup/Loading";
import * as React from "react";
import { Moralis } from "moralis-v1";
import { ArrowUpRightIcon } from "components/Icons";

interface IProposalListTab {
    DAOMoralisInstance: Moralis.Object<Moralis.Attributes>;
    DAO: IDAOPageForm;
    proposals: IProposalPageForm[];
    daoUrl: string;
}

export const ProposalsListTab = ({ proposals, DAOMoralisInstance, daoUrl, DAO }: IProposalListTab) => {
    const visibleProposalsLength: number = 3;
    let activeProposals: IProposalPageForm[];
    if (proposals && proposals.length > 0 && DAOMoralisInstance) {
        activeProposals = proposals.filter((proposals) => proposals.isActive);
        const isActive = DAOMoralisInstance.get("isActive");
        if ((activeProposals.length > 0 && !isActive) || (activeProposals.length === 0 && isActive)) {
            DAOMoralisInstance.set("isActive", !isActive);
            saveMoralisInstance(DAOMoralisInstance);
        }
        return (
            <>
                <ul>
                    {activeProposals.slice(0, visibleProposalsLength).map((proposal) => {
                        const proposalId = proposal.proposalId;
                        const name = proposal.name;
                        const description = proposal.description;
                        const tokenName = proposal.tokenName;
                        const shortDescription = proposal.shortDescription;
                        const isActive = proposal.isActive;
                        const forVotes = proposal.forVotes;
                        const againstVotes = proposal.againstVotes;
                        const deadline = proposal.endDateTimestamp;
                        return (
                            <Link href={`${daoUrl}/proposals/${proposalId}`} key={proposalId}>
                                <li
                                    key={proposalId}
                                    className="border-b-2 mb-4 last:pb-0 border-gray cursor-pointer active:bg-gray"
                                >
                                    <ProposalCard
                                        title={name}
                                        description={description}
                                        shortDescription={shortDescription}
                                        tokenName={tokenName}
                                        chainId={DAO?.chainId}
                                        isActive={isActive}
                                        forVotes={forVotes}
                                        againstVotes={againstVotes}
                                        deadline={deadline}
                                    />
                                </li>
                            </Link>
                        );
                    })}
                </ul>
                {(proposals.length > visibleProposalsLength || activeProposals.length < visibleProposalsLength) && (
                    <div className={"flex flex-col "}>
                        {activeProposals.length === 0 && (
                            <MockupTextCard label={"No active proposals"} text={"You can view previous proposals"} />
                        )}

                        <div className={"flex justify-center"}>
                            <Link
                                href={{
                                    pathname: `${daoUrl}/proposals/`,
                                }}
                            >
                                <button
                                    className="flex gap-2 bg-white text-black2 hover:underline active:text-gray2 mt-4">
                                    View all proposals
                                    <div className="mt-[0.125rem]">
                                        <ArrowUpRightIcon />
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </>
        );
    } else if (proposals && proposals.length === 0) {
        return (
            <MockupTextCard
                label={"No proposals here yet"}
                text={
                    "You should first add NFTs so that members can vote " +
                    "then click the button “Add new proposal” and initiate a proposal"
                }
            />
        );
    } else {
        return <MockupLoadingProposals chain={DAO.blockchain[0]} />;
    }
};
