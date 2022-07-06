import * as React from "react";
import type { GetStaticProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
    // const response = await fetch("https://jsonplaceholder.typicode.com/users");
    // const data = await response.json();
    const data: DAOProps[] = [
        {
            address: "0xEEBea2b30E921765C2d07741C4BbA8E48Fa734af",
        },
        {
            address: "0xa299893a8F91448E7653Fd71555f7742d7ED6F90",
        },
    ];

    if (!data) {
        return {
            notFound: true,
        };
    }

    return {
        props: { daos: data },
    };
};

interface DAOProps {
    address: string;
}

interface DAOsPageProps {
    daos: DAOProps[];
}

const DAOsPage: NextPage<DAOsPageProps> = ({ daos }) => {
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
                            daos.map(({ address }) => (
                                <li key={address}>
                                    <Link href={`/daos/${address}`}>{address}</Link>
                                </li>
                            ))}
                    </ul>
                </section>
            </Layout>
        </div>
    );
};

export default DAOsPage;
