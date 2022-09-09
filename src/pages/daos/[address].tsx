import * as React from "react";
import { formatAddress } from "utils/address";
import { FC, useLayoutEffect, useRef } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { Signer } from "ethers";
import Layout from "components/Layout/Layout";
import { ParsedUrlQuery } from "querystring";
import Image from "next/image";
import basicAvatar from "assets/basic_avatar.jpg";
import discordLogo from "assets/social/discord.png";
import twitterLogo from "assets/social/twitter.png";
import Moralis from "moralis";
import { CHAINS_IMG } from "utils/blockchains";
import { useMoralisQuery, useMoralis } from "react-moralis";
import Tabs from "components/Tabs/Tabs";
import { useEffect, useState } from "react";
import { IDAOPageForm, IProposalPageForm } from "types/forms";
import { getChainScanner } from "utils/network";
import NFTExample from "assets/nft-example.png";
import { ExternalLinkIcon, GlobeAltIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { NFTDetailDialog } from "components/Dialog";
import classNames from "classnames";
import { useSigner } from "wagmi";
import { isIpfsAddress, loadImage } from "utils/ipfsUpload";
import { TabsType } from "types/tabs";
import {
    AddToWhitelist,
    mintReserveAndDelegation,
    mintNFT,
} from "contract-interactions/writeNFTContract";
import toast from "react-hot-toast";
import ProposalCard from "components/Cards/ProposalCard";
import {
    getNumAvailableToMint,
    getNumberOfMintedTokens,
    getSupplyNumber,
    getTokenURI,
} from "contract-interactions/viewNFTContract";
import defaultImage from "assets/empty-token.webp";
import {
    getTotalProposals,
    isProposalActive,
    proposalAgainstVotes,
    proposalDeadline,
    proposalForVotes,
} from "contract-interactions/viewGovernorContract";
import { isValidHttpUrl } from "utils/transformURL";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const [buttonState, setButtonState] = useState<ButtonState>("Mint");
    const [nftImage, setNFTImage] = useState([]);
    const detailNFTDialog = useDialogState();
    const { data: signer_data } = useSigner();
    const { isInitialized } = useMoralis();
    const firstUpdate = useRef(true);

    async function getChainId(singer: Signer) {
        return await singer.getChainId();
    }

    const { fetch: DAOsQuery } = useMoralisQuery(
        "DAO",
        (query) => query.equalTo("contractAddress", address),
        [],
        {
            autoFetch: false,
        }
    );

    const { fetch: WhitelistQuery } = useMoralisQuery(
        "Whitelist",
        (query) => query.equalTo("daoAddress", address),
        [],
        {
            autoFetch: false,
        }
    );

    const fetchWhitelist = async () => {
        await WhitelistQuery({
            onSuccess: (results) => {
                setWhitelist(() => results);
            },
            onError: (error) => {
                console.log("Error fetching db query" + error);
            },
        });
    };

    const { fetch: ProposalQuery } = useMoralisQuery(
        "Proposal",
        (query) => query.equalTo("governorAddress", address),
        [],
        {
            autoFetch: false,
        }
    );

    const fetchProposal = async () => {
        await ProposalQuery({
            onSuccess: async (results) => {
                const proposals: IProposalPageForm[] = await Promise.all(
                    results.map(async (proposalMoralis) => {
                        const governorAddress = proposalMoralis.get("governorAddress");
                        const chainId = proposalMoralis.get("chainId");
                        const proposalId = proposalMoralis.get("proposalId");
                        const proposal: IProposalPageForm = {
                            name: proposalMoralis.get("name"),
                            governorAddress: governorAddress,
                            chainId: chainId,
                            proposalId: proposalId,
                            description: proposalMoralis.get("description"),
                            shortDescription: proposalMoralis.get("shortDescription"),
                            isActive: await isProposalActive(governorAddress, chainId, proposalId),
                            forVotes: await proposalForVotes(governorAddress, chainId, proposalId),
                            againstVotes: await proposalAgainstVotes(
                                governorAddress,
                                chainId,
                                proposalId
                            ),
                            deadline: await proposalDeadline(governorAddress, chainId, proposalId),
                            options: [],
                            blockchain: [],
                        };
                        return proposal;
                    })
                );
                setProposals(() => proposals);
            },
            onError: (error) => {
                console.log("Error fetching db query" + error);
            },
        });
    };

    const TabOne: FC<{}> = () => {
        return proposals && proposals.length !== 0 ? (
            <ul>
                {proposals.map((proposal) => {
                    const proposalId = proposal.proposalId;
                    const name = proposal.name;
                    const description = proposal.description;
                    const shortDescription = proposal.shortDescription;
                    const isActive = proposal.isActive;
                    const forVotes = proposal.forVotes;
                    const againstVotes = proposal.againstVotes;
                    const deadline = proposal.deadline;
                    return (
                        <Link href={`/daos/proposal/${proposalId}`} key={proposalId}>
                            <li
                                key={proposalId}
                                className="border-b-2 border-gray cursor-pointer active:bg-gray"
                            >
                                <ProposalCard
                                    title={name}
                                    description={description}
                                    shortDescription={shortDescription}
                                    daoName={DAO?.name}
                                    isActive={isActive}
                                    forVotes={forVotes}
                                    againstVotes={againstVotes}
                                    deadline={deadline}
                                />
                            </li>
                        </Link>
                    );
                })}
            </ul>
        ) : (
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

    // function removeItem(walletAddress: string) {
    //
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
        return whitelist && whitelist.length !== 0 ? (
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
                                            addressNFT: DAO!.tokenAddress[0],
                                            walletAddress: walletAddress,
                                            signer: signer_data as Signer,
                                        });

                                        status
                                            ? toast.success("Wallet added to Whitelist")
                                            : toast.error(
                                                  "Only owner of DAO can add a new members"
                                              );
                                        // TODO: DELETE ROW FROM MORALIS
                                        // removeItem(walletAddress);
                                        // console.log("WL DELETE");
                                        // toast.success("Wallet added to Whitelist");
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
        // {
        //     label: "MEMBERS",
        //     index: 2,
        //     Component: TabTwo,
        // },
        {
            label: "WHITELIST",
            index: 2,
            Component: TabThree,
        },
    ];
    const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);

    const fetchDAO = () => {
        if (isInitialized) {
            DAOsQuery({
                onSuccess: (results) => {
                    const moralisInstance = results[0];
                    const chainId = moralisInstance.get("chainId");
                    const contractAddress = moralisInstance.get("contractAddress");
                    const newDao: IDAOPageForm = {
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
                        contractAddress: contractAddress,
                        chainId: chainId,
                        //todo: parse below values
                        discordURL: moralisInstance.get("discordURL"),
                        twitterURL: moralisInstance.get("twitterURL"),
                        websiteURL: moralisInstance.get("websiteURL"),
                        scanURL: getChainScanner(chainId, contractAddress),
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

    const fetchNftImage = async (tokenIndex: number) => {
        const image = await loadImage(
            await getTokenURI(DAO?.tokenAddress[tokenIndex]!, DAO?.chainId!)
        );
        return image;
        //setNFTImage[image];
    };

    useEffect(() => {
        fetchDAO();
        fetchProposal();
        fetchWhitelist();
    }, [isInitialized]);

    useEffect(() => {
        fetchNftImage(0);
    }, [DAO]);

    useIsomorphicLayoutEffect(() => {
        if (DAO && firstUpdate.current) {
            firstUpdate.current = false;
            fetchLargeData();
        }
    });

    const fetchLargeData = async () => {
        const newDAO = {
            ...DAO,
            totalProposals: await getTotalProposals(DAO!.contractAddress!, DAO!.chainId!),
            totalMembers: await getNumberOfMintedTokens(DAO!.tokenAddress[0]!, DAO!.chainId!),
            profileImage: await loadImage(DAO!.profileImage),
            coverImage: await loadImage(DAO!.coverImage),
        } as IDAOPageForm;
        setDAO(() => newDAO);
    };

    const StatisticCard = ({ label, counter }) => {
        return (
            <div className="group flex flex-col justify-between border-2 border-[#CECECE] rounded-lg lg:w-1/4 w-2/5 h-36 pt-2 pl-4 pr-4 pb-3 hover:bg-[#7343DF] hover:border-purple cursor-pointer">
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

    const DetailsInfo = ["Blockchain", "Type", "Token Address"];

    interface INFTImage {
        image?: string;
        className?: string;
        index?: number;
    }

    const NFTImage = ({ className, index }: INFTImage) => {
        let tempImage;
        return (
            <div className="flex justify-center">
                {
                    <Image
                        src={true ? basicAvatar : basicAvatar}
                        width={"200"}
                        height={"200"}
                        className={classNames("rounded-t-md", className)}
                    />
                }
            </div>
        );
    };

    const NFTCard = ({ tokenAddress, chainId, daoTitle }) => {
        return (
            <button className="nft-card" onClick={() => detailNFTDialog.toggle()}>
                {/* //Wrap to div for center elements */}
                <NFTImage index={chainId} />
                <div className="p-4 gap-y-6">
                    <p className="text-start">{daoTitle}</p>
                    <div className="flex pt-4 justify-between">
                        <p className="font-light text-sm text-[#AAAAAA]">Type: Unknown</p>
                        <BlockchainImage />
                    </div>
                </div>
            </button>
        );
    };

    async function mint() {
        if (!DAO) return null;
        setButtonState("Loading");
        // 1. try to reserve for owner dao, if not it will try to normal mint function
        try {
            await mintReserveAndDelegation(DAO.tokenAddress[0], signer_data as Signer);
            setButtonState("Success");
            return;
        } catch (e) {
            console.log("Transaction canceled");
        }
        try {
            console.log("Call MINT NFT function");
            await mintNFT(DAO.tokenAddress[0], signer_data as Signer);
            setButtonState("Success");
        } catch (e) {
            setButtonState("Error");
            console.log("Transaction canceled");
            return;
        }
    }

    // TODO: Create maping for array of blockchains
    const BlockchainImage = () => {
        return DAO ? (
            <Image
                src={CHAINS_IMG[DAO.blockchain[0]]["src"]}
                height={22}
                width={22}
                objectFit={"contain"}
                className="mb-4"
            />
        ) : (
            <Image
                src={defaultImage}
                height={22}
                width={22}
                objectFit={"contain"}
                className="mb-4"
            />
        );
    };

    return DAO ? (
        <div>
            <Layout className="layout-base mt-0">
                <div className="cover h-36 w-full relative justify-center">
                    <Image
                        src={!isIpfsAddress(DAO.coverImage) ? DAO.coverImage : basicAvatar}
                        layout={"fill"}
                    />
                </div>

                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className="dao-info lg:flex md:flex xl:flex justify-between">
                        <div className="flex">
                            <div className="mt-[-50px] ">
                                <Image
                                    src={
                                        !isIpfsAddress(DAO.profileImage)
                                            ? DAO.profileImage
                                            : basicAvatar
                                    }
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
                                    blockchains: DAO.blockchain,
                                },
                            }}
                        >
                            <button className="secondary-button mt-6">Become a member</button>
                        </Link>
                    </div>
                    <div className="lg:flex md:flex lg:justify-between gap-10 w-full">
                        <div className="flex lg:w-1/3 lg:justify-end justify-between gap-7">
                            {DAO.discordURL ? (
                                <ImageLink
                                    url={isValidHttpUrl(DAO.discordURL)}
                                    image={discordLogo}
                                />
                            ) : null}
                            {DAO.twitterURL ? (
                                <ImageLink
                                    url={isValidHttpUrl(DAO.twitterURL)}
                                    image={twitterLogo}
                                />
                            ) : null}

                            {DAO.websiteURL ? (
                                <a href={isValidHttpUrl(DAO.websiteURL)} target="_blank">
                                    <GlobeAltIcon className="h-6 w-6" />
                                </a>
                            ) : null}
                        </div>
                    </div>

                    <div className="dao-statistics flex flex-row justify-between">
                        {/* <StatisticCard label={"Total votes"} counter={DAO.totalVotes} /> */}
                        <StatisticCard label={"Total proposals"} counter={DAO.totalProposals} />
                        <StatisticCard label={"Total members"} counter={DAO.totalMembers} />
                    </div>

                    <div className="dao-proposals-members lg:w-full">
                        <Tabs
                            selectedTab={selectedTab}
                            onClick={setSelectedTab}
                            tabs={tabs}
                            url={{
                                pathname: "/daos/create-proposal",
                                query: {
                                    governorAddress: DAO.contractAddress,
                                    blockchain: DAO.blockchain[0],
                                },
                            }}
                        />
                    </div>

                    <>
                        <div className="flex flex-row justify-between mb-4 ">
                            <h3 className="text-black font-normal text-2xl">Membership NFTs</h3>
                            <Link
                                href={{
                                    pathname: "/daos/add-new-nft",
                                    query: {
                                        governorAddress: DAO.contractAddress,
                                        blockchain: DAO.blockchain,
                                    },
                                }}
                            >
                                <button className="settings-button bg-purple text-white">
                                    Add NFT
                                </button>
                            </Link>
                        </div>
                        {DAO.tokenAddress ? (
                            <div className="flex justify-between">
                                {DAO.tokenAddress.map((nftToken, index) => (
                                    <NFTCard
                                        chainId={index}
                                        tokenAddress={nftToken}
                                        daoTitle={DAO.name}
                                    />
                                ))}
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
                    <p className="mt-4 text-black">{`${DAO.name}`}</p>
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
                    {/* <button className="secondary-button w-full h-12 mt-4 mb-2 gradient-btn-color cursor-not-allowed transition delay-150 hover:reverse-gradient-btn-color ">
                        Transfer
                    </button>
                    <p className="text-gray2 font-light text-sm">
                        Try to transfer your NFT to another network
                    </p> */}
                    <p className="w-full mt-12 text-start text-black">Details</p>
                    <ul className="py-6 divide-y divide-slate-200">
                        {DetailsInfo.map((element) => (
                            <li key={element} className="flex py-4 justify-between">
                                <p className="font-light text-gray2">{element}</p>
                                <p className="font-normal text-black">{DAO.name}</p>
                            </li>
                        ))}
                    </ul>
                </NFTDetailDialog>
            </Layout>
        </div>
    ) : (
        <div>
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
