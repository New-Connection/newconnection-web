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
            <div className="flex flex-col justify-between rounded border-2 border-[#6858CB] w-1/4 h-28 pt-2 pl-2 pr-4 pb-4">
                <div className={"text-gray-400"}>{label}</div>
                <div className={"flex text-black justify-end text-3xl"}>{counter || 0}</div>
            </div>
        );
    };

    const MockupTextCard = ({ label, text }) => {
        return (
            <div className={"text-center my-32"}>
                <div className={"font-semibold"}>{label}</div>
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

    const NFTCard = ({ tokenAddress, chainId }) => {
        return (
            <a href={getChainScanner(chainId, tokenAddress)} target={"_blank"}>
                <div className="flex flex-col justify-between rounded border-2 border-[#6858CB] w-52 h-52 p-3">
                    <Image src={basicAvatar} height={"150px"} width={"150px"} />
                    <div className={"text-gray-400"}>{"Membership NFT"}</div>
                </div>
            </a>
        );
    };

    return DAO ? (
        <div>
            <Head>
                <title>{DAO.name}</title>
            </Head>
            <Layout className="app-section mx-auto mt-20 flex w-full flex-col space-y-6 pb-8 bg-[#ffffff]">
                <div className="cover h-36 w-full relative justify-center">
                    <Image src={basicAvatar} layout={"fill"} />
                    <button className={"secondary-button absolute bottom-5 right-5 p-2"}>
                        Edit DAO Profile
                    </button>
                </div>

                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className="dao-info flex">
                        <div className="mt-[-50px] ">
                            <Image src={basicAvatar} height={"150px"} width={"150px"} />
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex ml-3 w-full justify-between">
                                <h1 className={"text-2xl font-semibold"}>{DAO.name}</h1>
                                <div className="flex w-[100px] justify-between">
                                    <ImageLink url={DAO.discordURL} image={discordLogo} />
                                    <ImageLink url={DAO.twitterURL} image={twitterLogo} />
                                    <ImageLink url={DAO.URL} image={globeLogo} />
                                </div>
                            </div>
                            <div className="flex ml-3 w-1/2 justify-between">
                                <a
                                    href={DAO.URL}
                                    target={"_blank"}
                                    className={"hover:text-[#23BD8F]"}
                                >
                                    About DAO
                                </a>
                                <a
                                    href={DAO.scanURL}
                                    target={"_blank"}
                                    className={"hover:text-[#23BD8F]"}
                                >
                                    Smart Contract
                                    <Image height={"20"} width={"20"} src={contractLogo} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="dao-statistics flex flex-row justify-between">
                        <StatisticCard label={"Total votes"} counter={DAO.totalVotes} />
                        <StatisticCard label={"Total proposals"} counter={DAO.totalProposals} />
                        <StatisticCard label={"Total members"} counter={DAO.totalMembers} />
                    </div>

                    <div className="dao-proposals-members">
                        <div className={"flex justify-between"}>
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
                                <button className={"secondary-button"}>Add new proposal</button>
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

                    <div className="dao-nfts">
                        <div className="flex flex-row justify-between mb-2">
                            <h3 className={"font-semibold text-lg"}>Membership NFTs</h3>
                            <button className={"secondary-button"}>Add NFT</button>
                        </div>
                        {DAO.tokenAddress ? (
                            <div className={"flex gap-6"}>
                                <NFTCard chainId={DAO.chainId} tokenAddress={DAO.tokenAddress} />
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
                    </div>
                </section>
            </Layout>
        </div>
    ) : (
        <div>
            <Head>
                <title>Not found</title>
            </Head>
            <Layout className="app-section mx-auto mt-32 flex w-full flex-col space-y-6 pb-8 bg-[#ffffff]">
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
