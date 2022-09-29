import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Layout from "components/Layout";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IDAOPageForm, IProposalPageForm } from "types/forms";
import {
    isProposalActive,
    proposalAgainstVotes,
    proposalDeadline,
    proposalForVotes,
} from "contract-interactions";
import { ProposalCard } from "components/Cards/ProposalCard";
import * as React from "react";
import { useRouter } from "next/router";
import BackButton from "components/Button/backButton";
import { IProposalsQuery } from "types/queryInterfaces";
import { MockupLoadingProposals } from "components/Mockup/Loading";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const getServerSideProps = async (context: NextPageContext) => {
    const { query } = context;
    return { props: { query } };
};

const ProposalsPage: NextPage = () => {
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const firstUpdate = useRef(true);
    const router = useRouter();

    const { fetch: ProposalQuery } = useMoralisQuery(
        "Proposal",
        (query) =>
            query.equalTo("governorAddress", DAO?.governorAddress) &&
            query.equalTo("chainId", DAO?.chainId),
        [DAO],
        {
            autoFetch: false,
        }
    );

    const fetchProposal = async () => {
        await ProposalQuery({
            onSuccess: async (results) => {
                const proposals: IProposalPageForm[] = await Promise.all(
                    results.map(async (proposalMoralis) => {
                        const governorAddress = proposalMoralis.get("governorAddress");
                        const chainId = proposalMoralis.get("chainId");
                        const proposalId = proposalMoralis.get("proposalId");
                        const proposal: IProposalPageForm = {
                            name: proposalMoralis.get("name"),
                            governorAddress: governorAddress,
                            chainId: chainId,
                            proposalId: proposalId,
                            description: proposalMoralis.get("description"),
                            shortDescription: proposalMoralis.get("shortDescription"),
                            isActive: await isProposalActive(governorAddress, chainId, proposalId),
                            forVotes: await proposalForVotes(governorAddress, chainId, proposalId),
                            againstVotes: await proposalAgainstVotes(
                                governorAddress,
                                chainId,
                                proposalId
                            ),
                            deadline: await proposalDeadline(governorAddress, chainId, proposalId),
                            options: [],
                            blockchain: [],
                        };
                        return proposal;
                    })
                );
                setProposals(() => proposals);
            },
            onError: (error) => {
                console.log("Error fetching db query" + error);
            },
        });
    };

    useEffect(() => {
        const query = router.query as IProposalsQuery;
        console.log("query:" + router.query.daoAddress);

        const newDao = {} as IDAOPageForm;
        // newDao.url = query.address;
        newDao.governorAddress = query.governorAddress;
        newDao.name = query.name;
        newDao.chainId = +query.chainId;

        console.log(newDao);
        setDAO(() => newDao);
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (DAO && firstUpdate.current) {
            fetchProposal();
            firstUpdate.current = false;
        }
    });

    return DAO ? (
        <div>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <BackButton />
                    <div className={"flex justify-between items-center"}>
                        <h1 className={"text-highlighter cap"}>{DAO.name} Proposals</h1>
                    </div>

                    {proposals && proposals.length !== 0 ? (
                        <ul>
                            {proposals.map((proposal) => {
                                const proposalId = proposal.proposalId;
                                const name = proposal.name;
                                const description = proposal.description;
                                const shortDescription = proposal.shortDescription;
                                const isActive = proposal.isActive;
                                const forVotes = proposal.forVotes;
                                const againstVotes = proposal.againstVotes;
                                const deadline = proposal.deadline;
                                return (
                                    <Link href={`proposals/${proposalId}`} key={proposalId}>
                                        <li
                                            key={proposalId}
                                            className="border-b-2 border-gray cursor-pointer active:bg-gray"
                                        >
                                            <ProposalCard
                                                title={name}
                                                description={description}
                                                shortDescription={shortDescription}
                                                daoName={DAO?.name}
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
