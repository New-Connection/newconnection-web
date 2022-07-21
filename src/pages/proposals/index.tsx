import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Layout from "components/Layout";

const ProposalsPage: NextPage = () => {
    return (
        <div>
            <Head>
                <title>DAOs</title>
            </Head>
            <Layout className="app-section mx-auto mt-32 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className={"flex justify-between items-center"}>
                        <h1 className={"text-highlighter"}>Proposals</h1>
                        <Link href="./">
                            <button className={"secondary-button h-10 "}>Add new proposal</button>
                        </Link>
                    </div>

                    <div className={"text-center my-32"}>
                        <div className={"font-semibold"}>Soon...</div>
                        <p className={"text-gray-400"}>There will be list of all DAOs proposals</p>
                    </div>
                </section>
            </Layout>
        </div>
    );
};

export default ProposalsPage;
