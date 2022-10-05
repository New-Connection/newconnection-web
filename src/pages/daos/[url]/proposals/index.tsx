import { NextPage } from "next";
import Link from "next/link";
import Layout from "components/Layout";
import { useMoralisQuery } from "react-moralis";
import * as React from "react";
import { useEffect, useState } from "react";
import { IDAOPageForm, IProposalPageForm } from "types/forms";
import { ProposalCard } from "components/Cards/";
import { useRouter } from "next/router";
import { BackButton } from "components/Button/";
import { IProposalsQuery } from "types/queryInterfaces";
import { MockupLoadingProposals } from "components/Mockup/Loading";
import { fetchProposals } from "network";

const ProposalsPage: NextPage = () => {
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const router = useRouter();

    const { fetch: ProposalQuery } = useMoralisQuery(
        "Proposal",
        (query) => query.equalTo("governorAddress", DAO?.governorAddress) && query.equalTo("chainId", DAO?.chainId),
        [DAO],
        {
            autoFetch: false,
        }
    );

    useEffect(() => {
        const fetchQuery = () => {
            const query = router.query as IProposalsQuery;

            const newDao = {} as IDAOPageForm;
            newDao.governorAddress = query.governorAddress;
            newDao.name = query.name;
            newDao.chainId = +query.chainId;
            newDao.url = query.url;

            console.log(newDao);
            setDAO(() => newDao);
        };

        fetchQuery();
    }, [router]);

    useEffect(() => {
        if (DAO) {
            const loadingProposals = async () => {
                const proposals = await fetchProposals(ProposalQuery);
                if (proposals) {
                    setProposals(() => proposals);
                }
            };

            console.log("dao load");
            loadingProposals().catch(console.error);
        }
    }, [DAO]);

    return DAO ? (
        <div>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <BackButton />
                    <div className={"flex justify-between items-center"}>
                        <h1 className={"text-highlighter cap capitalize"}>{DAO.name} Proposals</h1>
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
    ) : (
        <></>
    );
};

export default ProposalsPage;
