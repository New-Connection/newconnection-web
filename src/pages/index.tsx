import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout";
import Head from "next/head";
import Example from "components/Example";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>New Connection: Home</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <Example />
                </section>
            </Layout>
        </div>
    );
};

export default Home;
