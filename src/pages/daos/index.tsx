import * as React from "react";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useNetwork } from "wagmi";
import Layout, { DAOCard } from "components";
import { IDAOPageForm } from "types";
import { getTotalProposals, isBlockchainSupported } from "interactions/contract";
import { fetchDAOs } from "interactions/database";

const DAOsPage: NextPage = () => {
    const [DAOs, setDAOs] = useState<IDAOPageForm[]>();
    const { chain } = useNetwork();
    const { isInitialized } = useMoralis();

    const { fetch: DAOsQuery } = useMoralisQuery("DAO", (query) => query.notEqualTo("objectId", ""), [], {
        autoFetch: false,
    });

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
                <button className="secondary-button h-10 disabled:bg-gray" disabled={!isBlockchainSupported(chain)}>
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
                                DAOs.map((dao, index) => (
                                    <DAOCard key={index} daoObject={dao} lastElement={!(index !== DAOs.length - 1)} />
                                ))}
                        </ul>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default DAOsPage;
