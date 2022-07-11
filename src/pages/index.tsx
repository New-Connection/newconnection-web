import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import Image from "next/image";
import { useAccount } from "wagmi";
import Link from "next/link";
import BasicAvatar from "assets/basic_avatar.jpg";

const Home: NextPage = () => {
    const { address } = useAccount();
    console.log(address);

    // Wallet information when connect wallet
    const AccountInfo = () => {
        return (
            <div className="flex p-4 gap-5 content-center">
                <Image src={BasicAvatar} width={"100"} height={"100"} />
                <div className="">
                    <h1>Hello,</h1>
                    <p className="text-2xl font-bold">{address}</p>
                </div>
            </div>
        );
    };

    // Header for reccomendation
    const ReccomendationHeader = () => {
        return (
            <>
                <div className="flex justify-between my-7">
                    <p className="font-bold text-xl">Reccomendation DAO</p>
                    <Link href="./create-nft">
                        <button className="secondary-button">Create DAO</button>
                    </Link>
                </div>
                <p>We suggest you take a look at DAO or create your own</p>
            </>
        );
    };

    // DAO element

    return (
        <div>
            <Head>
                <title>New Connection: Home</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    {address ? (
                        <div>
                            <AccountInfo />
                            <ReccomendationHeader />
                            <div className="flex my-4 gap-16">
                                <Image src={BasicAvatar} width="150" height="150" layout="fixed" />
                                <div className="w-3/5 justify-between-col">
                                    <p className="text-lg font-bold">DAO Name</p>
                                    <p className="truncate">
                                        A DAO, or “Decentralized Autonomous Organization,” is a
                                        community-led entity with no central authority. It is fully
                                        autonomous and transparent: smart contracts lay the
                                        foundational rules, execute the agreed upon decisions, and
                                        at any point, proposals, voting, and even the very code
                                        itself can be publicly audited.
                                    </p>
                                    <button>View more</button>
                                </div>
                                <div>
                                    <p>Active voting now</p>
                                    <p className="text-gray-500 text-sm">Proporsals {}</p>
                                    <p className="text-gray-500 text-sm">Voting {}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <h1>Please connect wallet</h1>
                    )}
                </section>
            </Layout>
        </div>
    );
};

export default Home;
