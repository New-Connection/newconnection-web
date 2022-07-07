import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import { getName } from "contract-interactions/viewGovernorContract";
import { ParsedUrlQuery } from "querystring";
import { DAOProps } from "./index";
import { getDAO } from "./data-example";

interface QueryUrlParams extends ParsedUrlQuery {
    address: string;
}

interface DAOPageProps {
    name: string;
    address: string;
    discordURL?: string;
    twitterURL?: string;
    totalVotes?: number;
    totalMembers?: number;
    activeProposals?: number;
    NFT?: string;
}

export const getServerSideProps: GetServerSideProps<DAOPageProps, QueryUrlParams> = async (
    context
) => {
    // const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    // const data = await response.json();
    const { address } = context.params as QueryUrlParams;

    const data: DAOProps | undefined = await getDAO(address);

    if (!data) {
        return {
            notFound: true,
        };
    }

    const result: DAOPageProps = {
        name: await getName(address, data.chainId),
        address: address.toString(),
    };

    return {
        props: result,
    };
};

const DAOPage: NextPage<DAOPageProps> = ({ name, address }) => {
    return (
        <div>
            <Head>
                <title>{name.toUpperCase()}</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <h1>{name.toUpperCase()}</h1>
                    <div>Hi</div>
                    <div>{address}</div>
                </section>
            </Layout>
        </div>
    );
};

export default DAOPage;
