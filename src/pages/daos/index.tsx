import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import { IDAOPageForm } from "types/forms";
import { loadImage } from "utils/ipfsUpload";
import { getTotalProposals } from "contract-interactions/viewGovernorContract";
import { useNetwork } from "wagmi";
import { isBlockchainSupported } from "utils/blockchains";
import { DAOCard } from "components/Cards";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DAOsPage: NextPage = () => {
    const [DAOs, setDAOs] = useState<IDAOPageForm[]>();
    const firstUpdate = useRef(true);

    const { fetch: DAOsQuery } = useMoralisQuery(
        "DAO",
        (query) => query.notEqualTo("objectId", ""),
        [],
        {
            autoFetch: false,
        }
    );
    const { chain } = useNetwork();
    const { isInitialized } = useMoralis();

    const fetchDB = () => {
        if (isInitialized) {
            DAOsQuery({
                onSuccess: (results) => {
                    const daos = results.map((dao) => {
                        const url = dao.get("url");
                        const governorAddress = dao.get("governorAddress");
                        const name = dao.get("name");
                        const description = dao.get("description");
                        const chainId = dao.get("chainId");
                        let profileImage = dao.get("profileImage");
                        const isActive = dao.get("isActive");
                        const totalProposals = 0;
                        const totalVotes = 0;

                        return {
                            url,
                            name,
                            governorAddress: governorAddress,
                            description,
                            profileImage,
                            totalVotes,
                            totalProposals,
                            isActive,
                            chainId,

                            //mock
                            blockchain: [],
                            goals: "",
                            coverImage: null,
                            tokenAddress: [""],
                            votingPeriod: "",
                            type: [],
                            quorumPercentage: "",
                        } as IDAOPageForm;
                    });

                    setDAOs(() => daos);
                },
                onError: (error) => {
                    console.log(error);
                    console.log("Error fetching db query" + error);
                },
            });
        }
    };

    const fetchLargeData = async () => {
        const newDAOs = await Promise.all(
            DAOs!.map(async (dao) => {
                return {
                    ...dao,
                    totalProposals: await getTotalProposals(dao.governorAddress!, dao.chainId!),
                    profileImage: await loadImage(dao.profileImage),
                } as IDAOPageForm;
            })
        );
        setDAOs(() => newDAOs);
    };

    // if we use isInitialized we call fetch only once when reload page or move to new page
    useEffect(() => {
        fetchDB();
    }, [isInitialized]);

    useIsomorphicLayoutEffect(() => {
        if (DAOs && firstUpdate.current) {
            firstUpdate.current = false;
            fetchLargeData();
        }
    });

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-highlighter">DAOs</h1>
                            <Link href="./create-new-dao">
                                <button
                                    className="secondary-button h-10"
                                    disabled={!isBlockchainSupported(chain)}
                                >
                                    Create DAO
                                </button>
                            </Link>
                        </div>

                        <ul>
                            {DAOs &&
                                DAOs.map((dao, index) => {
                                    return (
                                        <DAOCard
                                            key={index}
                                            name={dao.name}
                                            description={dao.description}
                                            url={dao.url}
                                            profileImage={dao.profileImage}
                                            isActive={dao.isActive}
                                            proposals={dao.totalProposals}
                                        />
                                    );
                                })}
                        </ul>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default DAOsPage;
