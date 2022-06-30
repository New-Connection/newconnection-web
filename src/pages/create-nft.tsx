import Layout from "components/Layout";
import * as React from "react";
import { NextPage } from "next"; // it's just type
import NFTSection from "components/NFT";
import Head from "next/head";

const CreateNFT: NextPage = () => {
    return (
        <div>
            <Head>
                <title>NC: Create NFT</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <NFTSection />
            </Layout>
        </div>
    );
};

export default CreateNFT;
