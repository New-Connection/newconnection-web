import * as React from "react";
import type { GetStaticProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import Link from "next/link";
import { getDAOs } from "./example/data-example";
import { getAllMoralisObjects } from "database/interactions";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useState } from "react";
import Moralis from "moralis";
import { moralisAppId, moralisServerUrl } from "../../utils/constants";

export interface DAOProps {
    address: string;
    chainId: number;
}

interface DAOsPageProps {
    daos: DAOProps[];
}

export const getStaticProps: GetStaticProps<DAOsPageProps> = async () => {
    // const response = await fetch("https://jsonplaceholder.typicode.com/users");
    // const data = await response.json();
    const data = await getDAOs();

    // console.log("!!!!" + s);

    if (!data) {
        return {
            notFound: true,
        };
    }

    return {
        props: { daos: await getDAOs() },
    };
};

const DAOsPage: NextPage<DAOsPageProps> = ({ daos }) => {
    Moralis.start({
        appId: moralisAppId,
        serverUrl: moralisServerUrl,
    }).then();

    const [DAOs, setDAOs] = useState<Moralis.Object<Moralis.Attributes>[]>();

    const { fetch } = useMoralisQuery("DAO", (query) => query.notEqualTo("objectId", ""), [], {
        autoFetch: false,
    });

    const fetchDB = () => {
        //todo parse into normal objects
        fetch({
            onSuccess: (results) => {
                setDAOs(() => results);
            },
            onError: (error) => {
                console.log("Error fetching db query" + error);
            },
        });
    };

    useEffect(() => {
        fetchDB();
    }, []);

    return (
        <div>
            <Head>
                <title>DAOs</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <h1>DAOs</h1>
                    <ul>
                        {daos &&
                            daos.map(({ address, chainId }) => (
                                <li key={address}>
                                    <Link href={`/daos/${address}`}>{address}</Link> (Network:
                                    {chainId})
                                </li>
                            ))}
                    </ul>
                </section>
            </Layout>
        </div>
    );
};

export default DAOsPage;
