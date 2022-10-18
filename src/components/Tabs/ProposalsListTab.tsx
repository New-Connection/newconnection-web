import { IDAOPageForm, IProposalPageForm } from "types";
import Link from "next/link";
import { ArrowUpRightIcon, MockupLoadingProposals, MockupTextCard, ProposalCard } from "components";
import * as React from "react";
import { addValueToDao } from "interactions/database";
import { useTimeout } from "usehooks-ts";

interface IProposalListTab {
    DAO: IDAOPageForm;
    proposals: IProposalPageForm[];
}

export const ProposalsListTab = ({ proposals, DAO }: IProposalListTab) => {
    const visibleProposalsLength: number = 3;
    let activeProposals: IProposalPageForm[];
    proposals && (activeProposals = proposals.filter((proposals) => proposals.isActive));

    useTimeout(() => activeProposals && addValueToDao(DAO.url, "isActive", activeProposals.length !== 0).then(), 1500);

    return proposals && proposals.length > 0 ? (
        <>
            <ul className={"grid grid-flow-row mt-4 gap-4"}>
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
                        <Link href={`${DAO.url}/proposals/${proposalId}`} key={proposalId}>
                            <li
                                key={proposalId}
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
                                pathname: `${DAO.url}/proposals/`,
                            }}
                        >
                            <button className="flex gap-2 btn-link mt-8">
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
    ) : proposals && proposals.length === 0 ? (
        <MockupTextCard
            label={"No proposals here yet"}
            text={
                "You should first add NFTs so that members can vote " +
                "then click the button “Add new proposal” and initiate a proposal"
            }
        />
    ) : (
        <MockupLoadingProposals chain={DAO.blockchain[0]} />
    );
};
