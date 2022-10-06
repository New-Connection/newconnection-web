import { NextPage } from "next";
import Link from "next/link";
import Layout from "components/Layout";
import * as React from "react";
import { useEffect, useState } from "react";
import { IDAOPageForm, IProposalPageForm } from "types/forms";
import { ProposalCard } from "components/Cards/";
import { useRouter } from "next/router";
import { BackButton } from "components/Button/";
import { IProposalsQuery } from "types/queryInterfaces";
import { MockupLoadingProposals } from "components/Mockup/Loading";

const ProposalsPage: NextPage = () => {
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const router = useRouter();

    useEffect(() => {
        const fetchQuery = () => {
            const query = router.query as IProposalsQuery;

            const newDao = {} as IDAOPageForm;
            newDao.governorAddress = query.governorAddress;
            newDao.chainId = +query.chainId;
            newDao.url = query.governorUrl;
            console.log(query.governorUrl + " Proposals");

            setDAO(() => newDao);

            const savedProposals = JSON.parse(localStorage.getItem(query.governorUrl + " Proposals"));
            if (savedProposals) {
                setProposals(savedProposals);
            }
        };

        fetchQuery();
    }, [router]);

    return proposals && (
        <div>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <BackButton />
                    <div className="text-highlighter items-center flex flex-col md:flex-row">
                        Proposals for
                        <div className={"text-highlighter text-purple capitalize md:ml-4"}>{`${DAO?.url}`}</div>
                    </div>

                    {proposals && proposals.length !== 0 ? (
                        <ul>
                            {proposals.map((proposal) => {
                                const proposalId = proposal.proposalId;
                                return (
                                    <Link href={`../${DAO.url}/proposals/${proposalId}`} key={proposalId}>
                                        <li
                                            key={proposalId}
                                            className="border-b-2 border-gray cursor-pointer active:bg-gray"
                                        >
                                            <ProposalCard
                                                title={proposal.name}
                                                description={proposal.description}
                                                shortDescription={proposal.shortDescription}
                                                governorName={DAO?.name}
                                                chainId={DAO?.chainId}
                                                isActive={proposal.isActive}
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
    );
};

export default ProposalsPage;
