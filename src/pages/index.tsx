import * as React from "react";
import { FC } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useAccount } from "wagmi";
import Link from "next/link";
import ASSETS from "assets/index";
import { useDialogState } from "ariakit";
import { Tabs } from "components/Tabs/";
import { DAOCard } from "components/Cards/";
import { useIsMounted } from "hooks";
import DAOsPage from "./daos/index";

import { TabsType } from "types/tabs";

const TabOne: FC = () => {
    return (
        <div>
            {/* //     <DAOCard />
        //     <DAOCard />
        //     <DAOCard /> */}
        </div>
    );
};

const TabTwo: FC = () => {
    return (
        <div>
            <p>Administration</p>
            {/* <DAOCard />
            <DAOCard />
            <DAOCard /> */}
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
    const { address, isConnected } = useAccount();
    const isMounted = useIsMounted();
    const confirmDialog = useDialogState();
    // Just mock up for test DAO profile, NFT section and po
    const USERDATA = true;

    const [selectedTab, setSelectedTab] = React.useState<number>(tabs[0].index);
    // Wallet information when connect wallet
    const AccountInfo = () => {
        return (
            <div className="flex p-4 gap-5 content-center">
                <Image src={ASSETS.daoLogoMock} width={"100"} height={"100"} />
                <div>
                    <p>Hello,</p>
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
                    <Link href="./create-new-dao">
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
                {/* <DAOCard />
                <DAOCard />
                <DAOCard /> */}
                <ViewAll />
            </>
        );
    };

    const ProposalsSection = () => {
        return (
            <div className="my-24">
                <div className="flex my-20 gap-2">
                    <p className="text-lg font-bold">My Proposal</p>
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

    const TabsSection = () => {
        return (
            <>
                <ReccomendationHeader title="My DAOs" />
                <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
                <ViewAll />
            </>
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
            <DAOsPage />
            {/* <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    {isMounted && isConnected ? (
                        <div>
                            <AccountInfo />
                            {USERDATA ? <TabsSection /> : <ReccomendationSection />}
                            <ProposalsSection />
                            <NFTSection />
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between">
                                <NFTCardMockup />
                                <NFTCardMockup />
                                <NFTCardMockup />
                            </div>
                            <ProposalCard />
                            <ProposalCard />
                            <ProposalCard />
                        </div>
                    )}
                </section>
            </Layout> */}
        </div>
    );
};

export default Home;
