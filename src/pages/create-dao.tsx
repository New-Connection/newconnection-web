import React from "react";
import { NextPage } from "next"; // it's just type
import Layout from "components/Layout";
import Head from "next/head";

function CreateDAO() {
    return (
        <>
            <Head>
                <title>Create Dao</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 dark:bg-[#161818]">
                <h1>Hello DAO</h1>
            </Layout>
        </>
    );
}

export default CreateDAO;
