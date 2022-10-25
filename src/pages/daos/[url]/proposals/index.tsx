import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Layout, { BackButton, MockupLoadingProposals, ProposalCard } from "components";
import * as React from "react";
import { useState } from "react";
import { IDAOPageForm, IProposalPageForm, IQuery } from "types";
import { useEffectOnce, useReadLocalStorage } from "usehooks-ts";

export const getServerSideProps: GetServerSideProps = async (context) => ({
    props: context.params,
});

const ProposalsPage: NextPage<IQuery> = ({ url }) => {
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();

    const storageDao = useReadLocalStorage<IDAOPageForm>(url);
    const storageProposals = useReadLocalStorage<IProposalPageForm[]>(`${url} Proposals`);

    useEffectOnce(() => {
        setDAO(storageDao);
        setProposals(storageProposals);
    });

    return (
        proposals &&
        DAO && (
            <div>
                <Layout className="layout-base">
                    <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                        <BackButton />
                        <div className="text-highlighter items-center flex flex-col md:flex-row">
                            Proposals for
                            <div className={"text-highlighter text-primary capitalize md:ml-4"}>{`${DAO.url}`}</div>
                        </div>

                        {proposals && proposals.length !== 0 ? (
                            <ul className={"mt-4 flex flex-col gap-4"}>
                                {proposals.map((proposal) => {
                                    const proposalId = proposal.proposalId;
                                    return (
                                        <Link href={`../${DAO.url}/proposals/${proposalId}`} key={proposalId}>
                                            <li key={proposalId}>
                                                <ProposalCard
                                                    title={proposal.name}
                                                    description={proposal.description}
                                                    shortDescription={proposal.shortDescription}
                                                    tokenName={proposal.tokenName}
                                                    // governorName={DAO?.name}
                                                    chainId={DAO.chainId}
                                                    proposalState={proposal.proposalState}
                                                    forVotes={proposal.forVotes}
                                                    againstVotes={proposal.againstVotes}
                                                    deadline={proposal.endDateTimestamp}
                                                />
                                            </li>
                                        </Link>
                                    );
                                })}
                            </ul>
                        ) : (
                            <MockupLoadingProposals chain={DAO.chainId} />
                        )}
                    </section>
                </Layout>
            </div>
        )
    );
};

export default ProposalsPage;
