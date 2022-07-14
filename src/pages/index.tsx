import * as React from "react";
import { FC } from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import Image from "next/image";
import { useAccount } from "wagmi";
import Link from "next/link";
import BasicAvatar from "assets/basic_avatar.jpg";

import Tabs from "components/Tabs/Tabs";
import DAOCard from "components/Cards/DAOCard";
import NFTCard from "components/Cards/NFTCard";
import ProporsalCard from "components/Cards/ProporsalCard";

import { TabsType } from "types/tabs";

const TabOne: FC<{}> = () => {
    return (
        <div>
            <DAOCard />
            <DAOCard />
            <DAOCard />
        </div>
    );
};

const TabTwo: FC<{}> = () => {
    return (
        <div>
            <h1>Administration</h1>
            <DAOCard />
            <DAOCard />
            <DAOCard />
        </div>
    );
};

// Tabs Array
const tabs: TabsType = [
    {
        label: "Membership",
        index: 1,
        Component: TabOne,
    },
    {
        label: "Administration",
        index: 2,
        Component: TabTwo,
    },
];

const Home: NextPage = () => {
    const { address } = useAccount();
    // Just mock up for test DAO profile, NFT section and po
    const USERDATA = true;
    console.log(address);

    const [selectedTab, setSelectedTab] = React.useState<number>(tabs[0].index);
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
    const ReccomendationHeader = ({ title, isFirstTime = false }) => {
        return (
            <>
                <div className="flex justify-between my-7">
                    <p className="font-bold text-xl">{title}</p>
                    <Link href="./create-nft">
                        <button className="secondary-button">Create DAO</button>
                    </Link>
                </div>
                {isFirstTime ? <p>We suggest you take a look at DAO or create your own</p> : <></>}
            </>
        );
    };

    const ViewAll = () => {
        return (
            <div className="w-full mt-10 flex justify-center items-center">
                <button>
                    <p className="align-middle text-gray-400">View all DAOs</p>
                </button>
            </div>
        );
    };

    const ReccomendationSection = () => {
        return (
            <>
                <ReccomendationHeader title="Reccomendation DAO" isFirstTime={true} />
                <DAOCard />
                <DAOCard />
                <DAOCard />
                <ViewAll />
            </>
        );
    };

    const TabsSection = () => {
        return (
            <>
                <ReccomendationHeader title="My DAOs" />
                <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
                <ViewAll />
            </>
        );
    };

    const ProporsalsSection = () => {
        return (
            <div className="my-24">
                <div className="flex my-20 gap-2">
                    <p className="text-lg font-bold">My Proporsal</p>
                    <p className="text-lg font-bold  text-gray-400">0</p>
                </div>
                <div className="text-center my-32">
                    <p>No proposals here</p>
                    <p className="text-gray-400">
                        You should first join a DAO or create a new DAO to add a proposal
                    </p>
                </div>
            </div>
        );
    };

    const NFTSection = () => {
        return (
            <>
                <div className="flex mt-16 mb-6 gap-2">
                    <p className="text-lg font-bold">My NFTs</p>
                    <p className="text-lg font-bold  text-gray-400">0</p>
                </div>
                <div className="text-center my-32">
                    <p>No NFTs here</p>
                    <p className="text-gray-400">
                        You should first join a DAO and get NFT from its administrator
                    </p>
                </div>
            </>
        );
    };

    return (
        <div>
            <Head>
                <title>New Connection: Home</title>
            </Head>
            <Layout className="app-section mx-auto mt-32 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    {address ? (
                        <div>
                            <AccountInfo />
                            {USERDATA ? <TabsSection /> : <ReccomendationSection />}
                            <ProporsalsSection />
                            <NFTSection />
                        </div>
                    ) : (
                        //<h1 className="text-center font-bold">Please connect wallet</h1>
                        <div>
                            <div className="flex justify-between">
                                <NFTCard />
                                <NFTCard />
                                <NFTCard />
                            </div>
                            <ProporsalCard />
                            <ProporsalCard />
                            <ProporsalCard />
                        </div>
                    )}
                </section>
            </Layout>
        </div>
    );
};

export default Home;
