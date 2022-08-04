import * as React from "react";
import { formatAddress } from "utils/address";
import { FC } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { Signer } from "ethers";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import Image from "next/image";
import basicAvatar from "assets/basic_avatar.jpg";
import discordLogo from "assets/social/discord.png";
import twitterLogo from "assets/social/twitter.png";
import Moralis from "moralis";
import { CHAINS, CHAINS_IMG } from "utils/blockchains";
import { useMoralisQuery } from "react-moralis";
import Tabs from "components/Tabs/Tabs";
import { useEffect, useState } from "react";
import { IDAOPageForm, IMembershipForm } from "types/forms";
import { getChainScanner } from "utils/network";
import NFTExample from "assets/nft-example.png";
import { ExternalLinkIcon, GlobeAltIcon } from "@heroicons/react/solid";
import BlockchainExample from "assets/chains/Polygon.png";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { NFTDetailDialog } from "components/Dialog";
import classNames from "classnames";
import { useSigner } from "wagmi";
import { useMoralis } from "react-moralis";
import { loadImage } from "utils/ipfsUpload";
import { TabsType } from "types/tabs";
import { AddToWhitelist, mintReverseAndDelegation, mintNFT } from "contract-interactions/";
import toast from "react-hot-toast";

interface QueryUrlParams extends ParsedUrlQuery {
    address: string;
}

interface DAOPageProps {
    address: string;
}

const renderValue = (chain: string) => {
    const image = CHAINS_IMG[chain];
    return <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full" />;
};

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

type ButtonState = "Mint" | "Loading" | "Success" | "Error";

const DAOPage: NextPage<DAOPageProps> = ({ address }) => {
    const [click, setClick] = useState(false);
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [whitelist, setWhitelist] = useState<Moralis.Object<Moralis.Attributes>[]>();
    const [buttonState, setButtonState] = useState<ButtonState>("Mint");
    const detailNFTDialog = useDialogState();
    const { data: signer_data } = useSigner();
    const { isInitialized } = useMoralis();

    const { fetch } = useMoralisQuery(
        "DAO",
        (query) => query.equalTo("contractAddress", address),
        [],
        {
            autoFetch: false,
        }
    );

    const { fetch: fetchWhitelisQuery } = useMoralisQuery(
        "Whitelist",
        (query) => query.equalTo("daoAddress", address),
        [],
        {
            autoFetch: false,
        }
    );

    const TabOne: FC<{}> = () => {
        return (
            <div>
                <MockupTextCard
                    label={"No proposals here yet"}
                    text={
                        "You should first add NFTs so that members can vote " +
                        "then click the button “Add new proposal” and initiate a proposal"
                    }
                />
            </div>
        );
    };

    const TabTwo: FC<{}> = () => {
        return (
            <div className="text-center">
                {/* <AddToWhitelist /> */}
                <MockupTextCard
                    label={"No members here yet"}
                    text={
                        "You should first add NFTs for members" +
                        "then click the button “Add new proposal” and initiate a proposal"
                    }
                />
            </div>
        );
    };

    const fetchWhitelist = async () => {
        await fetchWhitelisQuery({
            onSuccess: (results) => {
                setWhitelist(() => results);
            },
            onError: (error) => {
                console.log("Error fetching db query" + error);
            },
        });
    };
    useEffect(() => {
        fetchWhitelist();
    }, [isInitialized]);

    // function removeItem(walletAddress: string) {
    //     console.log("hey");
    //     // remove items from sale ETH
    //     useMoralisQuery();
    //     const query = new Moralis.Query("Whitelist");
    //     console.log(query);
    //     query.equalTo("daoAddress", address);
    //     query.equalTo("walletAddress", walletAddress);
    //     const object = await query.first({ useMasterKey: true });
    //     console.log("Delete Object", object);
    //     if (object) {
    //         object.destroy({ useMasterKey: true }).then(
    //             () => {
    //                 console.log("The object was deleted from EthRemovedItems.");
    //             },
    //             (error) => {
    //                 console.log(error);
    //             }
    //         );
    //     }
    // }

    const TabThree: FC<{}> = () => {
        return whitelist ? (
            <div className="w-full justify-between space-y-5 gap-5">
                <div className="flex text-gray2 justify-between text-center pb-4 pt-0">
                    <div className="flex w-1/4 pr-3">
                        <p className="w-3/4 pr-4">Wallet Address</p>
                        <p className="w-1/3">Blockchain</p>
                    </div>
                    <p className="w-1/2">Notes</p>

                    <p className="w-1/4">Action</p>
                </div>
                {whitelist.map((wl, index) => {
                    const walletAddress = wl.get("walletAddress");
                    const note = wl.get("note");
                    const blockchainSelected = wl.get("blockchainSelected");
                    return (
                        <div className="w-full flex gap-5" key={index}>
                            <div className="flex w-1/4">
                                <p className="w-3/4 text-lg">{formatAddress(walletAddress)}</p>
                                <p className="w-1/4">{renderValue(blockchainSelected)}</p>
                            </div>
                            <p className="w-1/2 text-sm line-clamp-3 text-center">{note}</p>

                            <button
                                className="w-1/4 settings-button py-2 px-4 bg-white border-gray2 border-2 btn-state"
                                onClick={async () => {
                                    setClick(true);
                                    try {
                                        const status = await AddToWhitelist({
                                            addressNFT: DAO!.tokenAddress,
                                            walletAddress: walletAddress,
                                            signer: signer_data as Signer,
                                        });
                                        console.log("WL DELETE");
                                        status
                                            ? toast.success("Wallet added to Whitelist")
                                            : toast.error(
                                                  "Only owner of DAO can add a new members"
                                              );
                                        // TODO: DELETE ROW FROM MORALIS
                                        //removeItem(walletAddress);
                                        //toast.success("Wallet added to Whitelist");
                                        setClick(false);
                                    } catch (error) {
                                        toast.error("Please approve transaction to create DAO");
                                        return;
                                    }
                                    setClick(false);
                                }}
                                disabled={click}
                            >
                                {click ? <p className="text-gray2">Loading...</p> : <p>Add</p>}
                            </button>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center">
                <MockupTextCard
                    label={"No members here yet"}
                    text={
                        "You can join DAO click to become member" +
                        "then click the button “Add new proposal” and initiate a proposal"
                    }
                />
            </div>
        );
    };

    // Tabs Array
    const tabs: TabsType = [
        {
            label: "PROPOSALS",
            index: 1,
            Component: TabOne,
        },
        {
            label: "MEMBERS",
            index: 2,
            Component: TabTwo,
        },
        {
            label: "WHITELIST",
            index: 3,
            Component: TabThree,
        },
    ];
    const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);

    const fetchDB = async () => {
        if (isInitialized) {
            await fetch({
                onSuccess: async (results) => {
                    const moralisInstance = results[0];
                    // console.log("Parse Instance", moralisInstance);
                    const newDao: IDAOPageForm = {
                        name: moralisInstance.get("name"),
                        description: moralisInstance.get("description"),
                        goals: moralisInstance.get("goals"),
                        profileImage: await loadImage(moralisInstance.get("profileImage")),
                        coverImage: await loadImage(moralisInstance.get("coverImage")),
                        tokenAddress: moralisInstance.get("tokenAddress"),
                        votingPeriod: moralisInstance.get("votingPeriod"),
                        quorumPercentage: moralisInstance.get("quorumPercentage"),
                        type: moralisInstance.get("type"),
                        blockchain: moralisInstance.get("blockchain"),
                        contractAddress: moralisInstance.get("contractAddress"),
                        chainId: moralisInstance.get("chainId"),
                        //todo: parse below values
                        discordURL: moralisInstance.get("discordURL"),
                        twitterURL: moralisInstance.get("twitterURL"),
                        websiteURL: moralisInstance.get("websiteURL"),
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
        }
    };

    useEffect(() => {
        fetchDB();
    }, [isInitialized]);

    const StatisticCard = ({ label, counter }) => {
        return (
            <div className="group flex flex-col justify-between border-2 border-[#CECECE] rounded-lg w-1/4 h-36 pt-2 pl-4 pr-4 pb-3 hover:bg-[#7343DF] hover:border-purple cursor-pointer">
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
                <p className="text-gray-400">{text}</p>
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

    const DetailsInfo = ["Blockchain", "Type", "Collection"];

    interface INFTImage {
        image?: string;
        className?: string;
    }

    const NFTImage = ({ className }: INFTImage) => {
        return (
            <div className="flex justify-center">
                <Image
                    src={NFTExample}
                    className={classNames("rounded-t-md", className)}
                    objectFit="contain"
                />
            </div>
        );
    };

    const NFTCard = ({ tokenAddress, chainId, daoTitle }) => {
        return (
            <button className="nft-card" onClick={() => detailNFTDialog.toggle()}>
                {/* //Wrap to div for center elements */}
                <NFTImage />
                <div className="p-4 gap-y-6">
                    <p className="text-start">{daoTitle}: Membership </p>
                    <div className="flex pt-4 justify-between">
                        <p className="font-light text-sm text-[#AAAAAA]">Type: Art</p>
                        <Image src={BlockchainExample} height="24" width="24" />
                    </div>
                </div>
            </button>
        );
    };

    const LoadingSpinner = () => {
        return (
            <button
                disabled
                type="button"
                className="secondary-button w-full text-center h-12 text-gray-900 border pr-10"
            >
                <svg
                    role="status"
                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin text-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#E5E7EB"
                    />
                </svg>
                Loading...
            </button>
        );
    };

    async function mint() {
        if (!DAO) return null;
        setButtonState("Loading");
        try {
            const tx = await mintReverseAndDelegation(DAO.tokenAddress, signer_data as Signer);
            setButtonState("Success");
        } catch (e) {
            setButtonState("Error");
            console.log("Transaction canceled");
        }
        try {
            console.log("USE MINT NFT");
            const tx = await mintNFT(DAO.tokenAddress, signer_data as Signer);
            setButtonState("Success");
        } catch (e) {
            setButtonState("Error");
            console.log("Transaction canceled");
            return;
        }
    }

    return DAO ? (
        <div>
            <Head>
                <title>{DAO.name}</title>
            </Head>
            <Layout className="layout-base mt-0">
                <div className="cover h-36 w-full relative justify-center">
                    <Image src={DAO.coverImage ? DAO.coverImage : basicAvatar} layout={"fill"} />
                </div>

                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className="dao-info flex justify-between">
                        <div className="flex">
                            <div className="mt-[-50px] ">
                                <Image
                                    src={DAO.profileImage ? DAO.profileImage : basicAvatar}
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
                                query: {
                                    daoAddress: DAO.contractAddress,
                                    daoName: DAO.name,
                                    //TODO: DAO Blockchains supported
                                    blockchains: ["Polygon", "Avalanche"],
                                },
                            }}
                        >
                            <button className="secondary-button mt-6">Become a member</button>
                        </Link>
                    </div>
                    <div className="flex justify-between gap-10 w-full">
                        <div className="flex w-1/2 justify-between">
                            <a
                                href={DAO.websiteURL}
                                target={"_blank"}
                                className={"hover:text-purple"}
                            >
                                About DAO
                            </a>
                            <a
                                href={DAO.scanURL}
                                target={"_blank"}
                                className="hover:text-purple flex gap-3"
                            >
                                Smart Contract
                                <ExternalLinkIcon className="h-6 w-5" />
                            </a>
                            <a
                                href={DAO.websiteURL}
                                target={"_blank"}
                                className="hover:text-purple"
                            >
                                DAO Blockchains
                            </a>
                        </div>
                        <div className="flex w-1/3 justify-end gap-7">
                            {DAO.discordURL ? (
                                <ImageLink url={DAO.discordURL} image={discordLogo} />
                            ) : null}
                            {DAO.twitterURL ? (
                                <ImageLink url={DAO.twitterURL} image={twitterLogo} />
                            ) : null}

                            {DAO.websiteURL ? (
                                <a href={DAO.websiteURL}>
                                    <GlobeAltIcon className="h-6 w-6" />
                                </a>
                            ) : null}
                        </div>
                    </div>

                    <div className="dao-statistics flex flex-row justify-between">
                        <StatisticCard label={"Total votes"} counter={DAO.totalVotes} />
                        <StatisticCard label={"Total proposals"} counter={DAO.totalProposals} />
                        <StatisticCard label={"Total members"} counter={DAO.totalMembers} />
                    </div>

                    <div className="dao-proposals-members w-full">
                        <Tabs
                            selectedTab={selectedTab}
                            onClick={setSelectedTab}
                            tabs={tabs}
                            url={{
                                pathname: "/create-proposal",
                                query: { governorAddress: DAO.contractAddress },
                            }}
                        />
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
                <NFTDetailDialog
                    dialog={detailNFTDialog}
                    className="h-full items-center text-center "
                >
                    <NFTImage className="rounded-lg h-14 w-14" />
                    <p className="mt-4 text-black">Membership NFT</p>

                    <button className="secondary-button w-full h-12 mt-4 mb-2 gradient-btn-color cursor-not-allowed transition delay-150 hover:reverse-gradient-btn-color ">
                        Transfer
                    </button>
                    <p className="text-gray2 font-light text-sm">
                        Try to transfer your NFT to another network
                    </p>

                    <p className="w-full mt-12 text-start text-black">Details</p>
                    <ul className="py-6 divide-y divide-slate-200">
                        {DetailsInfo.map((element) => (
                            <li key={element} className="flex py-4 justify-between">
                                <p className="font-light text-gray2">{element}</p>
                                <p className="font-normal text-black">{element}</p>
                            </li>
                        ))}
                    </ul>
                    {
                        <button
                            className={`secondary-button w-full h-12 mt-4 mb-6 
                            ${buttonState === "Success" ? "bg-green" : ""} 
                            ${buttonState === "Error" ? "bg-red" : ""}`}
                            onClick={mint}
                        >
                            {buttonState}
                        </button>
                    }
                </NFTDetailDialog>
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
