import * as React from "react";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useNetwork } from "wagmi";

import Layout from "components/Layout/Layout";
import { IDAOPageForm } from "types/forms";
import { getTotalProposals } from "contract-interactions/viewGovernorContract";
import { isBlockchainSupported } from "utils/blockchains";
import { DAOCard } from "components/Cards";
import { fetchDAOs } from "network";

const DAOsPage: NextPage = () => {
    const [DAOs, setDAOs] = useState<IDAOPageForm[]>();
    const { chain } = useNetwork();
    const { isInitialized } = useMoralis();

    const { fetch: DAOsQuery } = useMoralisQuery(
        "DAO",
        (query) => query.notEqualTo("objectId", ""),
        [],
        {
            autoFetch: false,
        }
    );

    const loadingLargeData = async (DAOsList: IDAOPageForm[]) => {
        const newDAOs = await Promise.all(
            DAOsList!.map(async (dao) => {
                return {
                    ...dao,
                    totalProposals: await getTotalProposals(dao.governorAddress!, dao.chainId!),
                };
            })
        );
        setDAOs(() => newDAOs);
    };

    useEffect(() => {
        const loadindDAOs = async () => {
            const listOfDAOs = await fetchDAOs(isInitialized, DAOsQuery);
            if (listOfDAOs) {
                setDAOs(listOfDAOs);
                loadingLargeData(listOfDAOs).then();
            }
        };

        loadindDAOs().catch((e) => {
            console.log("Error when loading DAOs", e);
        });
    }, [isInitialized]);

    const CreateDAOButton = () => {
        return (
            <Link href="./create-new-dao">
                <button
                    className="secondary-button h-10 disabled:bg-gray"
                    disabled={!isBlockchainSupported(chain)}
                >
                    Create DAO
                </button>
            </Link>
        );
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        {/* HIGHLIGHTS AND CREATE DAO BUTTON */}
                        <div className="flex justify-between items-center">
                            <h1 className="text-highlighter">DAOs</h1>
                            <CreateDAOButton />
                        </div>
                        {/* LIST OF DAOs */}
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
