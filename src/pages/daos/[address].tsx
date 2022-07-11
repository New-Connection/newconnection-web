import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import { getName } from "contract-interactions/viewGovernorContract";
import { ParsedUrlQuery } from "querystring";
import { DAOProps } from "./index";
import { getDAO } from "./example/data-example";
import Image from "next/image";
import Cover from "pages/daos/example/images/cover.jpg";
import Logo from "pages/daos/example/images/logo.png";
import discordLogo from "assets/social/discord.png";
import twitterLogo from "assets/social/twitter.png";
import globeLogo from "assets/social/globe.png";
import contractLogo from "assets/smart-contract.png";
import { Box } from "@mui/system";
import { Tab, Tabs } from "@mui/material";

interface QueryUrlParams extends ParsedUrlQuery {
    address: string;
}

interface DAOPageProps {
    name: string;
    address: string;
    discordURL?: string;
    twitterURL?: string;
    URL?: string;
    scanURL?: string;
    totalVotes?: number;
    totalMembers?: number;
    totalProposals?: number;
    activeProposals?: number;
    NFT?: string;
}

export const getServerSideProps: GetServerSideProps<DAOPageProps, QueryUrlParams> = async (
    context
) => {
    // const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    // const data = await response.json();
    const { address } = context.params as QueryUrlParams;

    const dao: DAOProps | undefined = await getDAO(address);

    if (!dao) {
        return {
            notFound: true,
        };
    }

    const result: DAOPageProps = {
        name: await getName(address, dao.chainId),
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

const DAOPage: NextPage<DAOPageProps> = ({
    name,
    address,
    URL,
    discordURL,
    twitterURL,
    scanURL,
    totalVotes,
    totalMembers,
    totalProposals,
    NFT,
}) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <Head>
                <title>{name.toUpperCase()}</title>
            </Head>
            <Layout className="mx-auto mt-0 flex w-full flex-col space-y-6 pb-8 bg-[#ffffff]">
                <div className="cover h-40 w-full relative justify-center">
                    <Image src={Cover} layout={"fill"} />
                    <button
                        className={
                            "bg-gray-300 border-gray-400 border-2 hover:text-[#23BD8F] absolute bottom-5 right-5 p-2"
                        }
                    >
                        Edit DAO Profile
                    </button>
                </div>
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className="dao-info flex">
                        <div className="mt-[-50px] ">
                            <Image src={Logo} height={"150px"} width={"150px"} />
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex ml-3 w-full justify-between">
                                <h1 className={"text-2xl font-semibold"}>{name}</h1>
                                <div className="flex w-[100px] justify-between">
                                    <a href={discordURL}>
                                        <Image height={"25"} width={"25"} src={discordLogo} />
                                    </a>
                                    <a href={twitterURL}>
                                        <Image height={"25"} width={"25"} src={twitterLogo} />
                                    </a>
                                    <a href={URL}>
                                        <Image height={"25"} width={"25"} src={globeLogo} />
                                    </a>
                                </div>
                            </div>
                            <div className="flex ml-3 w-1/2 justify-between">
                                <a href={URL} className={"hover:text-[#23BD8F]"}>
                                    About DAO
                                </a>
                                <a href={scanURL} className={"hover:text-[#23BD8F]"}>
                                    Smart Contract
                                    <Image height={"20"} width={"20"} src={contractLogo} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="dao-statistics flex flex-row justify-between">
                        <div className="flex flex-col justify-between rounded border-2 border-gray-400 w-1/4 h-28 pt-2 pl-2 pr-4 pb-4">
                            <div className={"text-gray-400"}>Total votes</div>
                            <div className={"flex text-black justify-end text-3xl"}>
                                {totalVotes || 0}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between rounded border-2 border-gray-400 w-1/4 h-28 pt-2 pl-2 pr-4 pb-4">
                            <div className={"text-gray-400"}>Total proposals</div>
                            <div className={"flex text-black justify-end text-3xl"}>
                                {totalProposals || 0}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between rounded border-2 border-gray-400 w-1/4 h-28 pt-2 pl-2 pr-4 pb-4">
                            <div className={"text-gray-400"}>Total members</div>
                            <div className={"flex text-black justify-end text-3xl"}>
                                {totalMembers || 0}
                            </div>
                        </div>
                    </div>

                    <div className="dao-proposals-members">
                        <div className={"flex justify-between"}>
                            <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
                                <Tabs
                                    textColor={"inherit"}
                                    TabIndicatorProps={{
                                        sx: {
                                            backgroundColor: "black",
                                        },
                                    }}
                                    value={value}
                                    onChange={handleChange}
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
                            <button className={"bg-gray-300 border-2 border-gray-400 p-2"}>
                                Add new proposal
                            </button>
                        </div>
                        <TabPanel value={value} index={0}>
                            {totalProposals ? (
                                totalProposals
                            ) : (
                                <div className={"text-center"}>
                                    <div className={"font-semibold"}>No proposals here yet</div>
                                    You should first add NFTs so that members can vote then click
                                    the button “Add new proposal” and initiate a proposal
                                </div>
                            )}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {totalMembers ? (
                                totalMembers
                            ) : (
                                <div className={"text-center"}>
                                    <div className={"font-semibold"}>No members here yet</div>
                                    You should first add NFTs for members
                                </div>
                            )}
                        </TabPanel>
                    </div>

                    <div className="dao-nfts">
                        <div className="flex flex-row justify-between">
                            <h3 className={"font-semibold text-lg"}>Membership NFTs</h3>
                            <button className={"bg-gray-300 border-2 border-gray-400 p-2"}>
                                Add NFT
                            </button>
                        </div>
                        {NFT ? (
                            <div>{NFT}</div>
                        ) : (
                            <div className={"text-center"}>
                                <div className={"font-semibold"}>No NFT membership</div>
                                You should first add NFTs so that members can vote Then click the
                                button “Add new proposal” and initiate a proposal
                            </div>
                        )}
                    </div>
                </section>
            </Layout>
        </div>
    );
};

export default DAOPage;
