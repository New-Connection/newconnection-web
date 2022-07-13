import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import Image from "next/image";
import { useAccount } from "wagmi";
import Link from "next/link";
import BasicAvatar from "assets/basic_avatar.jpg";
import ViewAllIcon from "assets/ViewAll.png";
import { Tab, TabList, TabPanel, useTabState } from "ariakit/tab";

const Home: NextPage = () => {
    const { address } = useAccount();
    console.log(address);
    // TAB's
    const defaultSelectedId = "default-selected-tab";
    const tab = useTabState({ defaultSelectedId });

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
    const ElementOfDAO = () => {
        return (
            <div className="flex my-4 gap-16">
                <Image src={BasicAvatar} width="125" height="125" layout="fixed" />
                <div className="w-3/5 justify-between">
                    <p className="text-lg font-bold">DAO Name</p>
                    {/* About style for paragraph https://codepen.io/ShanShahOfficial/pen/wvBYwaB */}
                    <p className="overflow-hidden leading-5 max-h-20 block text-ellipsis">
                        A DAO, or “Decentralized Autonomous Organization,” is a community-led entity
                        with no central authority. It is fully autonomous and transparent: smart
                        contracts lay the foundational rules, execute the agreed upon decisions, and
                        at any point, proposals, voting, and even the very code itself can be
                        publicly audited.
                    </p>
                    <button className="text-gray-500">View more</button>
                </div>
                <div>
                    <p>Active voting now</p>
                    <p className="text-gray-500 text-sm">Proporsals {}</p>
                    <p className="text-gray-500 text-sm">Voting {}</p>
                </div>
            </div>
        );
    };

    const ViewAll = () => {
        return (
            <div className="w-full mt-10 flex justify-center items-center">
                <button>
                    <div className="flex gap-2">
                        <p className="align-middle text-gray-400">View all DAOs</p>
                        {/* <Image src={ViewAllIcon} layout="fixed" height="15" width="30" /> */}
                    </div>
                </button>
            </div>
        );
    };

    // // Tabs list
    // const HeadTabs = () => {
    //     return (
    //         <TabList state={tab} className="tab-list" aria-label="DAOs">
    //             <Tab className="tab" id={defaultSelectedId}>
    //                 My DAOs
    //             </Tab>
    //             <Tab className="tab">Administration</Tab>
    //         </TabList>
    //     );
    // };

    // const TabsElement = () => {
    //     return (
    //         <>
    //             <HeadTabs />
    //             <TabPanel state={tab} tabId={defaultSelectedId}>
    //                 <ul>
    //                     <li>🍎 Apple</li>
    //                     <li>🍇 Grape</li>
    //                     <li>🍊 Orange</li>
    //                 </ul>
    //             </TabPanel>
    //             <TabPanel state={tab}>
    //                 <ul>
    //                     <li>🥕 Carrot</li>
    //                     <li>🧅 Onion</li>
    //                     <li>🥔 Potato</li>
    //                 </ul>
    //             </TabPanel>
    //         </>
    //     );
    // };

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
                            <ReccomendationHeader />
                            <ElementOfDAO />
                            <ElementOfDAO />
                            <ElementOfDAO />
                            <ViewAll />
                            {/* <TabsElement /> */}
                            <ProporsalsSection />
                            <NFTSection />
                        </div>
                    ) : (
                        <h1 className="text-center font-bold">Please connect wallet</h1>
                    )}
                </section>
            </Layout>
        </div>
    );
};

export default Home;
