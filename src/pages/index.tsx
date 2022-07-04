import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>New Connection: Home</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <h1>Home</h1>
                </section>
            </Layout>
        </div>
    );
};

export default Home;
