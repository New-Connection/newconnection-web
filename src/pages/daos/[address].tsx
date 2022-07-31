import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import Image from "next/image";
import basicAvatar from "assets/basic_avatar.jpg";
import discordLogo from "assets/social/discord.png";
import twitterLogo from "assets/social/twitter.png";
import globeLogo from "assets/social/globe.png";
import contractLogo from "assets/smart-contract.png";
import { Box } from "@mui/system";
import { Tab, Tabs } from "@mui/material";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useState } from "react";
import { DAOPageForm } from "types/forms";
import { getChainScanner } from "utils/network";
import NFTExample from "assets/nft-example.png";
import { ExternalLinkIcon, GlobeAltIcon } from "@heroicons/react/solid";
import BlockchainExample from "assets/chains/Polygon.png";
import Link from "next/link";

interface QueryUrlParams extends ParsedUrlQuery {
    address: string;
}

interface DAOPageProps {
    address: string;
}

export const getServerSideProps: GetServerSideProps<DAOPageProps, QueryUrlParams> = async (
    context
) => {
    const { address } = context.params as QueryUrlParams;

    const result: DAOPageProps = {
        address: address.toString(),
    };

    return {
        props: result,
    };
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const DAOPage: NextPage<DAOPageProps> = ({ address }) => {
    const [tabState, setTabState] = React.useState(0);
    const [DAO, setDAO] = useState<DAOPageForm>();

    const { fetch } = useMoralisQuery(
        "DAO",
        (query) => query.equalTo("contractAddress", address),
        [],
        {
            autoFetch: false,
        }
    );

    const fetchDB = () => {
        fetch({
            onSuccess: (results) => {
                const moralisInstance = results[0];
                const newDao: DAOPageForm = {
                    name: moralisInstance.get("name"),
                    description: moralisInstance.get("description"),
                    goals: moralisInstance.get("goals"),
                    profileImage: moralisInstance.get("profileImage"),
                    coverImage: moralisInstance.get("coverImage"),
                    tokenAddress: moralisInstance.get("tokenAddress"),
                    votingPeriod: moralisInstance.get("votingPeriod"),
                    quorumPercentage: moralisInstance.get("quorumPercentage"),
                    type: moralisInstance.get("type"),
                    blockchain: moralisInstance.get("blockchain"),
                    contractAddress: moralisInstance.get("contractAddress"),
                    chainId: moralisInstance.get("chainId"),
                    //todo: parse below values
                    discordURL: "",
                    twitterURL: "",
                    URL: "",
                    scanURL: getChainScanner(
                        moralisInstance.get("chainId"),
                        moralisInstance.get("contractAddress")
                    ),
                    totalVotes: 0,
                    totalMembers: 0,
                    totalProposals: 0,
                    activeProposals: 0,
                };
                setDAO(() => newDao);
            },
            onError: (error) => {
                console.log("Error fetching db query" + error);
            },
        });
    };

    useEffect(() => {
        fetchDB();
    }, []);

    const handleTabStateChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabState(newValue);
    };

    const StatisticCard = ({ label, counter }) => {
        return (
            <div className="group flex flex-col justify-between border-2 border-[#CECECE] rounded-lg w-1/4 h-36 pt-2 pl-4 pr-4 pb-3 hover:bg-[#7343DF] cursor-pointer">
                <div className={"text-gray-400 group-hover:text-white"}>{label}</div>
                <div className={"flex justify-end text-black text-5xl group-hover:text-white"}>
                    {counter || 0}
                </div>
            </div>
        );
    };

    const MockupTextCard = ({ label, text }) => {
        return (
            <div className="text-center my-32">
                <div className="font-semibold">{label}</div>
                <p className={"text-gray-400"}>{text}</p>
            </div>
        );
    };

    const ImageLink = ({ url, image }) => {
        return (
            <a href={url} target={"_blank"}>
                <Image height={"25"} width={"25"} src={image} />
            </a>
        );
    };

    const NFTCard = ({ tokenAddress, chainId, daoTitle }) => {
        return (
            <a href={getChainScanner(chainId, tokenAddress)} target={"_blank"} className="nft-card">
                {/* //Wrap to div for center elements */}
                <div className="flex justify-center">
                    <Image src={NFTExample} className="rounded-t-md" objectFit="contain" />
                </div>

                <div className="p-4 gap-y-6">
                    <p>{daoTitle}: Membership </p>
                    <div className="flex pt-4 justify-between">
                        <p className="font-light text-sm text-[#AAAAAA]">Type: Art</p>
                        <Image src={BlockchainExample} height="24" width="24" />
                    </div>
                </div>
            </a>
        );
    };

    return DAO ? (
        <div>
            <Head>
                <title>{DAO.name}</title>
            </Head>
            <Layout className="layout-base mt-20">
                <div className="cover h-36 w-full relative justify-center">
                    <Image src={basicAvatar} layout={"fill"} />
                </div>

                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className="dao-info flex justify-between">
                        <div className="flex">
                            <div className="mt-[-50px] ">
                                <Image
                                    src={basicAvatar}
                                    height={"150px"}
                                    width={"150px"}
                                    className="rounded-xl"
                                />
                            </div>
                            <h1 className="dao-label">{DAO.name}</h1>
                        </div>
                        <Link
                            href={{
                                pathname: "/daos/add-new-member",
                                query: { daoName: DAO.name, nftAddress: DAO.tokenAddress },
                            }}
                        >
                            <button className="secondary-button mt-6">Become a member</button>
                        </Link>
                    </div>
                    <div className="flex justify-between gap-10 w-full">
                        <div className="flex w-1/2 justify-between">
                            <a href={DAO.URL} target={"_blank"} className={"hover:text-[#7343DF]"}>
                                About DAO
                            </a>
                            <a
                                href={DAO.scanURL}
                                target={"_blank"}
                                className="hover:text-[#7343DF] flex gap-3"
                            >
                                Smart Contract
                                <ExternalLinkIcon className="h-6 w-5" />
                            </a>
                            <a href={DAO.URL} target={"_blank"} className="hover:text-[#7343DF]">
                                DAO Blockchains
                            </a>
                        </div>
                        <div className="flex w-1/3 justify-end gap-7">
                            <ImageLink url={DAO.discordURL} image={discordLogo} />
                            <ImageLink url={DAO.twitterURL} image={twitterLogo} />
                            <a href={DAO.URL}>
                                <GlobeAltIcon className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    <div className="dao-statistics flex flex-row justify-between">
                        <StatisticCard label={"Total votes"} counter={DAO.totalVotes} />
                        <StatisticCard label={"Total proposals"} counter={DAO.totalProposals} />
                        <StatisticCard label={"Total members"} counter={DAO.totalMembers} />
                    </div>

                    <div className="dao-proposals-members">
                        <div className="flex justify-between">
                            <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
                                <Tabs
                                    textColor={"inherit"}
                                    TabIndicatorProps={{
                                        sx: {
                                            backgroundColor: "#6858CB",
                                        },
                                    }}
                                    value={tabState}
                                    onChange={handleTabStateChange}
                                    aria-label="tabs"
                                >
                                    <Tab
                                        label={`Proposals`}
                                        className={"font-semibold text-lg capitalize"}
                                    />
                                    <Tab
                                        label={`Members`}
                                        className={"font-semibold text-lg capitalize"}
                                    />
                                </Tabs>
                            </Box>

                            <Link
                                href={{
                                    pathname: "/create-proposal",
                                    query: { governorAddress: DAO.contractAddress },
                                }}
                            >
                                <button className="secondary-button">Add new proposal</button>
                            </Link>
                        </div>
                        <TabPanel value={tabState} index={0}>
                            {DAO.totalProposals ? (
                                DAO.totalProposals
                            ) : (
                                <MockupTextCard
                                    label={"No proposals here yet"}
                                    text={
                                        "You should first add NFTs so that members can vote " +
                                        "then click the button “Add new proposal” and initiate a proposal"
                                    }
                                />
                            )}
                        </TabPanel>
                        <TabPanel value={tabState} index={1}>
                            {DAO.totalMembers ? (
                                DAO.totalMembers
                            ) : (
                                <MockupTextCard
                                    label="No members here yet"
                                    text="You should first add NFTs for members"
                                />
                            )}
                        </TabPanel>
                    </div>

                    <>
                        <div className="flex flex-row justify-between mb-4 ">
                            <h3 className="text-black font-normal text-2xl">Membership NFTs</h3>
                            <button className="settings-button cursor-not-allowed">Add NFT</button>
                        </div>
                        {DAO.tokenAddress ? (
                            <div className="flex justify-between">
                                <NFTCard
                                    chainId={DAO.chainId}
                                    tokenAddress={DAO.tokenAddress}
                                    daoTitle={DAO.name}
                                />
                            </div>
                        ) : (
                            <MockupTextCard
                                label={"No NFT membership"}
                                text={
                                    "You should first add NFTs so that members can vote " +
                                    "then click the button “Add new proposal” and initiate a proposal"
                                }
                            />
                        )}
                    </>
                </section>
            </Layout>
        </div>
    ) : (
        <div>
            <Head>
                <title>Not found</title>
            </Head>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <MockupTextCard
                        label={"DAO not found"}
                        text={"Sorry, DAO not fount. Please try to reload page"}
                    />
                </section>
            </Layout>
        </div>
    );
};

export default DAOPage;
