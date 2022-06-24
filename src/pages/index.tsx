import * as React from "react";

import Layout from "components/Layout";
import Head from "next/head";

const Home = () => {
    return (
        <>
            <Head>
                <title>New Connection</title>
            </Head>
            <Layout className="dark: flex flex-col gap-[30px] dark:bg-[#161818]" noBanner={false}>
                <div>Home</div>
            </Layout>
        </>
    );
};

export default Home;
