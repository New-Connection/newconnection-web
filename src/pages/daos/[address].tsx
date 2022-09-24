import * as React from "react";
import { formatAddress } from "utils/address";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { Signer } from "ethers";
import Layout from "components/Layout/Layout";
import { ParsedUrlQuery } from "querystring";
import Image from "next/image";
import basicAvatar from "assets/basic-dao-logo.png";
import basicCover from "assets/basic-dao-cover.png";
import discordLogo from "assets/social/discord.png";
import twitterLogo from "assets/social/twitter.png";
import Moralis from "moralis";
import { getChainScanner, getLogoURI, getTokenSymbol } from "utils/blockchains";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Tabs from "components/Tabs/Tabs";
import { IDAOPageForm, INFTVoting, IProposalPageForm } from "types/forms";
import { ClipboardCopyIcon, ExternalLinkIcon, GlobeAltIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { CustomDialog, handleNext, handleReset, StepperDialog } from "components/Dialog";
import classNames from "classnames";
import { useSigner, useSwitchNetwork } from "wagmi";
import { isIpfsAddress, loadImage } from "utils/ipfsUpload";
import { TabsType } from "types/tabs";
import {
    AddToWhitelist,
    mintReserveAndDelegation,
    mintNFT,
    getGovernorOwnerAddress,
    deployTreasuryContract,
    transferTreasuryOwnership,
    getTreasuryBalance,
} from "contract-interactions/";
import toast from "react-hot-toast";
import ProposalCard from "components/Cards/ProposalCard";
import {
    getNftName,
    getNumberOfMintedTokens,
    getTokenURI,
    getSymbol,
    getPrice,
} from "contract-interactions/viewNftContract";
import defaultImage from "assets/empty-token.webp";
import {
    getTotalProposals,
    isProposalActive,
    proposalAgainstVotes,
    proposalDeadline,
    proposalForVotes,
} from "contract-interactions/viewGovernorContract";
import { isValidHttpUrl } from "utils/transformURL";
import { handleChangeBasic } from "utils/handlers";
import { saveMoralisInstance } from "database/interactions";
import { createTreasurySteps, SpinnerLoading } from "components/Dialog/Stepper";
import { InputAmount } from "components/Form";
import { sendEthToAddress } from "contract-interactions/utils";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface QueryUrlParams extends ParsedUrlQuery {
    address: string;
}

interface DAOPageProps {
    address: string;
}

const renderValue = (chain: string) => {
    const image = getLogoURI(chain);
    return <img src={image.src} alt="" aria-hidden className="h-6 w-6 rounded-full"/>;
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
    const { data: signer_data } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const { isInitialized } = useMoralis();
    const firstUpdate = useRef(true);
    const [DAOMoralisInstance, setDAOMoralisInstance] = useState(null);

    // DB states
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [whitelist, setWhitelist] = useState<Moralis.Object<Moralis.Attributes>[]>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const [NFTs, setNFTs] = useState<INFTVoting[]>();
    const [currentNFT, setCurrentNFT] = useState<INFTVoting>();

    // DB queries
    const { fetch: DAOsQuery } = useMoralisQuery(
        "DAO",
        (query) => query.equalTo("url", address),
        [],
        {
            autoFetch: false,
        }
    );
    const { fetch: WhitelistQuery } = useMoralisQuery(
        "Whitelist",
        (query) =>
            query.equalTo("daoAddress", DAO?.governorAddress) &&
            query.equalTo("chainId", DAO?.chainId),
        [DAO],
        {
            autoFetch: false,
        }
    );
    const { fetch: ProposalQuery } = useMoralisQuery(
        "Proposal",
        (query) =>
            query.equalTo("governorAddress", DAO?.governorAddress) &&
            query.equalTo("chainId", DAO?.chainId),
        [DAO],
        {
            autoFetch: false,
        }
    );

    // nft section
    const [buttonState, setButtonState] = useState<ButtonState>("Mint");
    const detailNFTDialog = useDialogState();

    // treasury section
    const [isOwner, setIsOwner] = useState(false);
    const [treasuryBalance, setTreasuryBalance] = useState("0");
    const [createTreasuryStep, setCreateTreasuryStep] = useState(0);
    const [contributeAmount, setContributeAmount] = useState("0");
    const [sending, setSending] = useState(false);
    const createTreasuryDialog = useDialogState();
    const contributeTreasuryDialog = useDialogState();
    console.log("DAO Object", DAO);
    //
    // FUNCTIONS
    // ----------------------------------------------------------------------

    const fetchDAO = () => {
        if (isInitialized) {
            DAOsQuery({
                onSuccess: (results) => {
                    const moralisInstance = results[0];
                    const chainId = moralisInstance.get("chainId");
                    const governorAddress = moralisInstance.get("governorAddress");
                    const newDao: IDAOPageForm = {
                        url: moralisInstance.get("url"),
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
                        governorAddress: governorAddress,
                        chainId: chainId,
                        //todo: parse below values
                        discordURL: moralisInstance.get("discordURL"),
                        twitterURL: moralisInstance.get("twitterURL"),
                        websiteURL: moralisInstance.get("websiteURL"),
                        treasuryAddress: moralisInstance.get("treasuryAddress"),
                        scanURL: getChainScanner(chainId, governorAddress),
                        totalVotes: 0,
                        totalMembers: 0,
                        totalProposals: 0,
                        activeProposals: 0,
                    };
                    // console.log(newDao);
                    setDAOMoralisInstance(() => moralisInstance);
                    setDAO(() => newDao);
                },
                onError: (error) => {
                    console.log("Error fetching db query" + error);
                },
            });
        }
    };

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

    async function fetchNFTImage(tokenAddress) {
        const image = await loadImage(await getTokenURI(tokenAddress, DAO.chainId));
        //setNftImage(() => image);
        return image;
    }

    async function fetchNFTData() {
        const nftsArray: INFTVoting[] = await Promise.all(
            DAO!.tokenAddress!.map(async (tokenAddress, index) => {
                const nft: INFTVoting = {
                    title: await getNftName(tokenAddress, DAO.chainId),
                    type: await getSymbol(tokenAddress, DAO.chainId),
                    image: await fetchNFTImage(tokenAddress),
                    price: await getPrice(tokenAddress, DAO.chainId),
                    tokenAddress: tokenAddress,
                };
                return nft;
            })
        );
        localStorage.setItem(DAO.name + " NFTs", JSON.stringify(nftsArray));
        setNFTs(nftsArray);
    }

    const fetchTreasuryBalance = async () => {
        const balance = DAO.treasuryAddress
            ? await getTreasuryBalance(DAO.treasuryAddress, DAO.chainId)
            : 0;
        setTreasuryBalance(() => balance.toString().slice(0, 7));
    };

    const fetchLargeData = async () => {
        const newDAO = {
            ...DAO,
            totalProposals: await getTotalProposals(DAO!.governorAddress!, DAO!.chainId!),
            totalMembers: await getNumberOfMintedTokens(DAO!.tokenAddress[0]!, DAO!.chainId!),
            profileImage: await loadImage(DAO!.profileImage),
            coverImage: await loadImage(DAO!.coverImage),
        } as IDAOPageForm;
        console.log("DAO", DAO!.governorAddress!);
        setDAO(() => newDAO);
    };

    const mint = async (tokenAddress: string) => {
        if (!DAO) return null;
        // const chainID = await getChainId(signer_data as Signer);
        // const availableNFT = await getSupplyNumber(DAO.tokenAddress, chainID);
        // console.log("Available NFT", availableNFT.toString());
        // console.log("On chainID:", chainID);
        setButtonState("Loading");
        // 1. try to reserve for owner dao, if not it will try to normal mint function
        try {
            const tx = await mintReserveAndDelegation(tokenAddress, signer_data as Signer);
            if (tx) {
                if (tx.blockNumber) {
                    toast.success(`DONE ✅ successful mint!`);
                    console.log(tx);
                }
            }
            setButtonState("Success");
            return;
        } catch (e) {
            console.log("Transaction canceled");
        }
        try {
            console.log("Call MINT NFT function");
            await mintNFT(tokenAddress, signer_data as Signer);
            setButtonState("Success");
        } catch (e) {
            setButtonState("Error");
            console.log("Transaction canceled");
            return;
        }
    };

    const fetchIsOwner = async () => {
        if (
            (await signer_data.getAddress()) ===
            (await getGovernorOwnerAddress(DAO.governorAddress, DAO.chainId))
        ) {
            setIsOwner(true);
        }
    };

    const addTreasury = async () => {
        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        handleReset(setCreateTreasuryStep);
        createTreasuryDialog.toggle();

        const tx = switchNetwork(DAO.chainId);

        let treasuryContract;
        try {
            treasuryContract = await deployTreasuryContract(signer_data as Signer, {});
            handleNext(setCreateTreasuryStep);
            await treasuryContract.deployed();
            console.log(
                `Deployment successful! Treasury Contract Address: ${treasuryContract.address}`
            );
            handleNext(setCreateTreasuryStep);
            const renounceTx = await transferTreasuryOwnership(
                treasuryContract.address,
                DAO.governorAddress,
                signer_data
            );
            handleNext(setCreateTreasuryStep);
            await renounceTx.wait();
            handleNext(setCreateTreasuryStep);
            handleNext(setCreateTreasuryStep);

            handleChangeBasic(treasuryContract.address, setDAO, "treasuryAddress");
        } catch (error) {
            console.log(error);
            createTreasuryDialog.toggle();
            handleReset(setCreateTreasuryStep);
            toast.error("Please approve transaction to create Treasury");
            return;
        }

        try {
            if (DAOMoralisInstance) {
                DAO.treasuryAddress;
                DAOMoralisInstance.set("treasuryAddress", treasuryContract.address);
                await saveMoralisInstance(DAOMoralisInstance);
            }
        } catch (error) {
            createTreasuryDialog.toggle();
            toast.error("Couldn't save your DAO on database. Please try again");
            return;
        }
    };

    const contributeToTreasury = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        switchNetwork(DAO.chainId);

        try {
            const sendTx = await sendEthToAddress(
                DAO.treasuryAddress,
                contributeAmount,
                signer_data
            );
            await sendTx.wait(1);
            setSending(() => false);
        } catch (error) {
            console.log(error);
            contributeTreasuryDialog.hide();
            setSending(() => false);
            toast.error("Something went wrong");
            return;
        }

        toast.success("Successfully contributed!");
        contributeTreasuryDialog.hide();
        setSending(() => false);
    };

    //
    // EFFECTS
    // ----------------------------------------------------------------------

    useEffect(() => {
        fetchDAO();
    }, [isInitialized]);
    useIsomorphicLayoutEffect(() => {
        if (DAO && firstUpdate.current) {
            localStorage.setItem(DAO.name, JSON.stringify(DAO));
            console.log("save");
            fetchProposal();
            fetchWhitelist();
            fetchLargeData();
            fetchNFTData();
            fetchTreasuryBalance();
            firstUpdate.current = false;
        }
    });

    useIsomorphicLayoutEffect(() => {
        if (DAO && signer_data) {
            fetchIsOwner();
        }
    });

    //
    // TABS COMPONENTS & STATES
    // ----------------------------------------------------------------------

    const [click, setClick] = useState(false);

    const TabOne: FC<{}> = () => {
        return proposals && proposals.length !== 0 ? (
            <>
                <ul>
                    {proposals.slice(0, 3).map((proposal) => {
                        const proposalId = proposal.proposalId;
                        const name = proposal.name;
                        const description = proposal.description;
                        const shortDescription = proposal.shortDescription;
                        const isActive = proposal.isActive;
                        const forVotes = proposal.forVotes;
                        const againstVotes = proposal.againstVotes;
                        const deadline = proposal.deadline;
                        return (
                            <Link href={`${address}/proposals/${proposalId}`} key={proposalId}>
                                <li
                                    key={proposalId}
                                    className="border-b-2 border-gray cursor-pointer active:bg-gray"
                                >
                                    <ProposalCard
                                        title={name}
                                        description={description}
                                        shortDescription={shortDescription}
                                        chainId={DAO?.chainId}
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
                {proposals.length > 3 ? (
                    <div className={"flex justify-center"}>
                        <Link
                            href={{
                                pathname: `${address}/proposals/`,
                                query: {
                                    name: DAO.name,
                                    governorAddress: DAO.governorAddress,
                                    chainId: DAO.chainId
                                }
                            }}
                        >
                            <button className="secondary-button mt-4">View all proposals</button>
                        </Link>
                    </div>
                ) : (
                    <></>
                )}
            </>
        ) : (
            <div>
                <MockupTextCard
                    label={"No proposals here yet"}
                    text={
                        "You should first add NFTs so that members can vote " +
                        "then click the button “Add new proposals” and initiate a proposals"
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
                        "then click the button “Add new proposals” and initiate a proposals"
                    }
                />
            </div>
        );
    };

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
                        "then click the button “Add new proposals” and initiate a proposals"
                    }
                />
            </div>
        );
    };

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

    //
    // OTHER CUSTOM COMPONENTS
    // ----------------------------------------------------------------------

    const StatisticCard = ({ label, counter }) => {
        return (
            <div
                className="group flex flex-col justify-between border-2 border-[#CECECE] rounded-lg lg:w-1/4 w-2/5 h-36 pt-2 pl-4 pr-4 pb-3 hover:bg-[#7343DF] hover:border-purple cursor-pointer">
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
                <Image height={"25"} width={"25"} src={image}/>
            </a>
        );
    };

    const DetailsInfo = ["Blockchain", "Type", "Token Address"];

    interface INFTImage {
        image?: string;
        className?: string;
        index?: number;
    }

    const NFTImage = ({ className, image }: INFTImage) => {
        return (
            <div className="flex justify-center">
                {
                    <Image
                        src={image ? image : basicAvatar}
                        width={"200"}
                        height={"200"}
                        className={classNames("rounded-t-md", className)}
                    />
                }
            </div>
        );
    };

    const NFTCard = ({ nftObject }) => {
        return (
            <button
                className="nft-card"
                onClick={() => {
                    setCurrentNFT(nftObject);
                    detailNFTDialog.toggle();
                }}
            >
                {/* //Wrap to div for center elements */}
                <NFTImage image={nftObject.image}/>
                <div className="p-4 gap-y-6">
                    <div className="flex justify-between">
                        <p className="text-start">{nftObject.title}</p>
                        <p className="font-light text-sm text-purple">{nftObject.price}</p>
                    </div>
                    <div className="flex pt-4 justify-between">
                        <p className="font-light text-sm text-[#AAAAAA]">
                            {formatAddress(nftObject.tokenAddress)}
                        </p>
                        <BlockchainImage/>
                    </div>
                </div>
            </button>
        );
    };

    // TODO: Create maping for array of blockchains
    const BlockchainImage = () => {
        return (
            <Image
                src={DAO ? getLogoURI(DAO.blockchain[0]) : defaultImage}
                height={22}
                width={22}
                objectFit={"contain"}
                className="mb-4"
            />
        )
    };

    return DAO ? (
        <div>
            <Layout className="layout-base mt-0">
                <div className="cover h-36 w-full relative justify-center">
                    <Image
                        priority={true}
                        src={!isIpfsAddress(DAO.coverImage) ? DAO.coverImage : basicCover}
                        layout={"fill"}
                    />
                </div>

                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className="dao-info lg:flex md:flex xl:flex justify-between items-center">
                        <div className="flex">
                            <div className="mt-[-50px]">
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
                            <h1 className="dao-label capitalize">{DAO.name}</h1>
                        </div>
                        <Link
                            href={{
                                pathname: `${address}/add-new-member`,
                                query: {
                                    governorAddress: DAO.governorAddress,
                                    daoName: DAO.name,
                                    blockchains: DAO.blockchain,
                                    tokenAddress: DAO.tokenAddress,
                                },
                            }}
                        >
                            <button className="secondary-button">Become a member</button>
                        </Link>
                    </div>
                    <div className="lg:flex md:flex lg:justify-between gap-10 w-full">
                        <div className="flex lg:w-1/3 lg:justify-between justify-between gap-7">
                            <a
                                href={DAO.scanURL}
                                target={"_blank"}
                                className="hover:text-purple flex"
                            >
                                Smart Contract
                                <ExternalLinkIcon className="h-6 w-5"/>
                            </a>
                            <div className="hover:text-purple gap-4 flex">
                                <p>DAO Blockchains</p>
                                <BlockchainImage/>
                            </div>

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
                                    <GlobeAltIcon className="h-6 w-6"/>
                                </a>
                            ) : null}
                        </div>
                    </div>

                    <div
                        className={
                            "treasury flex flex-col justify-between border-2 text-center border-lightGray rounded-lg h-40 p-3"
                        }
                    >
                        {DAO.treasuryAddress ? (
                            <div className={"flex justify-center text-xl text-gray5"}>
                                <a
                                    href={getChainScanner(DAO.chainId, DAO.treasuryAddress)}
                                    target={"_blank"}
                                    className="hover:text-purple flex gap-3"
                                >
                                    Treasury
                                    <ExternalLinkIcon className="h-6 w-5"/>
                                </a>
                            </div>
                        ) : (
                            <div className={"flex justify-center text-xl text-gray5"}>Treasury</div>
                        )}

                        <div className={"text-4xl"}>$ {treasuryBalance}</div>
                        <div>
                            {!DAO.treasuryAddress && isOwner ? (
                                <button className="secondary-button" onClick={addTreasury}>
                                    Add treasury
                                </button>
                            ) : !DAO.treasuryAddress ? (
                                <button className="secondary-button" disabled={true}>
                                    Treasury not added
                                </button>
                            ) : (
                                <button
                                    className="form-submit-button w-1/5"
                                    onClick={() => {
                                        if (!signer_data) {
                                            toast.error("Please connect wallet");
                                            return;
                                        }
                                        switchNetwork(DAO.chainId);

                                        contributeTreasuryDialog.toggle();
                                    }}
                                >
                                    Contribute
                                </button>
                            )}
                        </div>
                    </div>

                    {/*<div className="dao-statistics flex flex-row justify-between">*/}
                    {/* <StatisticCard label={"Total votes"} counter={DAO.totalVotes} /> */}
                    {/*<StatisticCard label={"Total proposals"} counter={DAO.totalProposals} />*/}
                    {/*<StatisticCard label={"Total members"} counter={DAO.totalMembers} />*/}
                    {/*</div>*/}

                    <div className="dao-proposals-members lg:w-full">
                        <Tabs
                            selectedTab={selectedTab}
                            onClick={setSelectedTab}
                            tabs={tabs}
                            url={{
                                pathname: `${address}/create-proposal`,
                                query: {
                                    address: DAO.url,
                                    governorAddress: DAO.governorAddress,
                                    blockchains: [DAO.blockchain[0]],
                                    chainId: DAO.chainId,
                                }
                            }}
                        />
                    </div>

                    <>
                        <div className="flex flex-row justify-between mb-4 ">
                            <h3 className="text-black font-normal text-2xl">Membership NFTs</h3>
                            <Link
                                href={{
                                    pathname: `${address}/add-new-nft`,
                                    query: {
                                        url: address,
                                        governorAddress: DAO.governorAddress,
                                        blockchain: DAO.blockchain,
                                    },
                                }}
                            >
                                <button className="secondary-button bg-purple text-white">
                                    Add NFT
                                </button>
                            </Link>
                        </div>
                        {DAO.tokenAddress ? (
                            <div className="flex justify-between">
                                {NFTs ? (
                                    NFTs.map((nft, index) => (
                                        <NFTCard nftObject={nft} key={index}/>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                        ) : (
                            <MockupTextCard
                                label={"No NFT membership"}
                                text={
                                    "You should first add NFTs so that members can vote " +
                                    "then click the button “Add new proposals” and initiate a proposals"
                                }
                            />
                        )}
                    </>
                </section>
                <CustomDialog dialog={detailNFTDialog} className="h-full items-center text-center">
                    {currentNFT ? (
                        <div className="w-full">
                            <NFTImage className="rounded-lg h-14 w-14" image={currentNFT.image}/>
                            <p className="mt-4 text-black">{`${currentNFT.title}`}</p>
                            <a
                                href={getChainScanner(DAO.chainId, currentNFT.tokenAddress)}
                                target={"_blank"}
                                className="hover:text-purple flex justify-center"
                            >
                                Smart Contract
                                <ExternalLinkIcon className="h-6 w-5"/>
                            </a>
                            {
                                <button
                                    className={`secondary-button w-full h-12 mt-4 mb-6 
                            ${buttonState === "Success" ? "bg-green" : ""} 
                            ${buttonState === "Error" ? "bg-red" : ""}`}
                                    onClick={() => mint(currentNFT.tokenAddress)}
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
                            <ul className="py-6 w-full divide-y divide-slate-200">
                                <li className="flex py-4 justify-between">
                                    <p className="font-light text-gray2">{"Type"}</p>
                                    <p className="font-normal text-black">{currentNFT.type}</p>
                                </li>
                                <li className="flex py-4 justify-between">
                                    <p className="font-light text-gray2">{"Price"}</p>
                                    <p className="font-normal text-black">{currentNFT.price}</p>
                                </li>
                                <li className="flex py-4 justify-between">
                                    <p className="font-light text-gray2">{"Token Address"}</p>
                                    <p className="font-normal text-black">
                                        {formatAddress(currentNFT.tokenAddress)}
                                    </p>
                                </li>
                                <li className="flex py-4 justify-between">
                                    <p className="font-light text-gray2">{"Blockchain"}</p>
                                    <p className="font-normal text-black">
                                        <BlockchainImage/>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <></>
                    )}
                </CustomDialog>
                <CustomDialog
                    dialog={contributeTreasuryDialog}
                    className="items-center text-center"
                >
                    <div className={"flex items-center gap-2"}>
                        <Image
                            src={!isIpfsAddress(DAO.profileImage) ? DAO.profileImage : basicAvatar}
                            height={"50px"}
                            width={"50px"}
                            className="rounded-xl"
                        />
                        <div>
                            <div className={"text-xl capitalize font-semibold"}>
                                {DAO.name} treasury
                            </div>
                            {DAO.treasuryAddress ? (
                                <div
                                    className={
                                        "flex text-lightGray hover:text-gray5 hover:cursor-pointer"
                                    }
                                    onClick={() =>
                                        navigator.clipboard.writeText(DAO.treasuryAddress)
                                    }
                                >
                                    {formatAddress(DAO.treasuryAddress)}
                                    <ClipboardCopyIcon className="h-6 w-5"/>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <form
                        onSubmit={(event) => {
                            setSending(() => true);
                            contributeToTreasury(event);
                        }}
                    >
                        <InputAmount
                            placeholder={"Amount in " + getTokenSymbol(DAO.chainId)}
                            name="price"
                            handleChange={(event) => setContributeAmount(() => event.target.value)}
                            className="w-full"
                            min={0.0001}
                            step={0.0001}
                            max={10}
                        />
                        {!sending ? (
                            <button
                                disabled={+contributeAmount === 0}
                                className="secondary-button h-12 mt-4 mb-2 gradient-btn-color transition delay-150 hover:reverse-gradient-btn-color"
                            >
                                Send
                            </button>
                        ) : (
                            <div className={"flex mt-4 gap-2"}>
                                <div className={"w-7"}>
                                    <SpinnerLoading/>
                                </div>
                                <div className="text-xl text-black">
                                    Waiting confirmation from blockchain
                                </div>
                            </div>
                        )}
                    </form>
                </CustomDialog>
                <StepperDialog
                    dialog={createTreasuryDialog}
                    className="dialog"
                    activeStep={createTreasuryStep}
                    steps={createTreasurySteps}
                >
                    <p className="ml-7">Deployment successful!</p>
                    <p className="ml-7 mb-10">Treasury Contract Address: {DAO.treasuryAddress}</p>
                    <button
                        className="form-submit-button"
                        onClick={() => {
                            createTreasuryDialog.toggle();
                        }}
                    >
                        Close
                    </button>
                </StepperDialog>
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
