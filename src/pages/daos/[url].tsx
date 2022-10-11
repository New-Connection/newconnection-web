import * as React from "react";
import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Layout, {
    BlockchainIcon,
    ContributeTreasuryDialog,
    CreateTreasuryDialog,
    DetailNftDialog,
    DiscordIcon,
    MembersListTab,
    MockupLoadingDetailDAOPage,
    MockupLoadingNFT,
    MockupTextCard,
    NFTCardWithDialog,
    ProposalsListTab,
    Tabs,
    TwitterIcon,
    WebsiteIcon,
    WhitelistTab,
} from "components";
import Image from "next/image";
import { Moralis } from "moralis-v1";
import {
    addTreasureMoralis,
    addTreasury,
    checkCorrectNetwork,
    contributeToTreasury,
    getChainScanner,
    getGovernorOwnerAddress,
    mint,
} from "interactions/contract";
import { useMoralis } from "react-moralis";
import {
    ButtonState,
    DAOPageProps,
    IDAOPageForm,
    IDaoQuery,
    IMember,
    INFTVoting,
    IProposalPageForm,
    IWhitelistRecord,
} from "types";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { useSigner, useSwitchNetwork } from "wagmi";
import { handleChangeBasic, isValidHttpUrl } from "utils";
import {
    fetchDAO,
    fetchMembers,
    fetchNFT,
    fetchProposals,
    fetchTreasuryBalance,
    fetchWhitelist,
} from "interactions/database";
import classNames from "classnames";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<DAOPageProps, IDaoQuery> = async (context) => {
    const { url } = context.params as IDaoQuery;

    const result: DAOPageProps = {
        url: url.toString(),
    };
    return {
        props: result,
    };
};

const INITIAL_LOADING_COUNTER = 2;

const DAOPage: NextPage<DAOPageProps> = ({ url }) => {
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const router = useRouter();
    const [loadingCounter, setLoadingCounter] = useState(INITIAL_LOADING_COUNTER);
    const isLoaded = loadingCounter <= 0 && signerData != null;
    const [notFound, setNotFound] = useState(false);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    // Moralis states
    const { isInitialized } = useMoralis();
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [DAOMoralisInstance, setDAOMoralisInstance] = useState<Moralis.Object<Moralis.Attributes>>();
    const [WhitelistMoralisInstance, setWhitelistMoralisInstance] = useState<Moralis.Object<Moralis.Attributes>[]>();
    const [whitelist, setWhitelist] = useState<IWhitelistRecord[]>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const [NFTs, setNFTs] = useState<INFTVoting[]>();
    const [currentNFT, setCurrentNFT] = useState<INFTVoting>();
    const [members, setMembers] = useState(new Map<string, IMember>());

    // NFT section
    const [buttonState, setButtonState] = useState<ButtonState>("Mint");
    const detailNFTDialog = useDialogState();

    // Treasury section
    const [isOwner, setIsOwner] = useState(false);
    const [treasuryBalance, setTreasuryBalance] = useState("0");
    const [createTreasuryStep, setCreateTreasuryStep] = useState(0);
    const [contributeAmount, setContributeAmount] = useState("0");
    const [sending, setSending] = useState(false);
    const createTreasuryDialog = useDialogState();
    const contributeTreasuryDialog = useDialogState();

    // EFFECTS
    // ----------------------------------------------------------------------

    const loadingWhitelist = async () => {
        const { whitelist, moralisInstance } = await fetchWhitelist(url);
        if (whitelist && moralisInstance) {
            console.log("load whitelist");
            setWhitelist(() => whitelist);
            setWhitelistMoralisInstance(() => moralisInstance);
        }
    };
    useEffect(() => {
        const query = router.query as IDaoQuery;
        setDAO(JSON.parse(localStorage.getItem(query.url)));
        setNFTs(JSON.parse(localStorage.getItem(query.url + " NFTs")));
        setProposals(JSON.parse(localStorage.getItem(query.url + " Proposals")));

        setLoadingCounter(INITIAL_LOADING_COUNTER);

        const loadingDAO = async () => {
            const { newDao, moralisInstance } = await fetchDAO(url);
            if (newDao && moralisInstance) {
                console.log(newDao);
                localStorage.setItem(url, JSON.stringify(newDao));
                setDAO(() => newDao);
                setDAOMoralisInstance(() => moralisInstance);
                return newDao;
            }
        };

        const loadingProposals = async () => {
            const proposals = await fetchProposals(url);
            if (proposals) {
                console.log("load proposals");
                localStorage.setItem(url + " Proposals", JSON.stringify(proposals));
                setProposals(() => proposals);
                setLoadingCounter((prevState) => (prevState < 0 ? INITIAL_LOADING_COUNTER : prevState - 1));
            }
        };

        const loadingNFT = async (dao: IDAOPageForm) => {
            const nftsArray = await fetchNFT(dao);
            if (nftsArray) {
                console.log("load nfts");
                localStorage.setItem(url + " NFTs", JSON.stringify(nftsArray));
                setNFTs(nftsArray);
                setLoadingCounter((prevState) => (prevState < 0 ? INITIAL_LOADING_COUNTER : prevState - 1));
            }
        };

        const loadingTreasuryBalance = async (dao: IDAOPageForm) => {
            const treasuryBalance = await fetchTreasuryBalance(dao);
            if (treasuryBalance) {
                setTreasuryBalance(treasuryBalance);
            }
        };

        const loadingMembers = async (dao: IDAOPageForm) => {
            const newMembers = await fetchMembers(dao);
            if (newMembers) {
                setMembers(() => newMembers);
            }
        };

        isInitialized &&
        loadingDAO()
            .then((dao) => {
                if (dao) {
                    console.log("dao loaded");
                    loadingWhitelist().then();
                    loadingTreasuryBalance(dao).then();
                    loadingProposals().then();
                    loadingNFT(dao).then();
                    loadingMembers(dao).then();
                } else {
                    setNotFound(true);
                }
            })
            .catch((e) => {
                console.log("Error when Loading DAO", e);
                setNotFound(true);
            });
    }, [isInitialized]);

    // Owner check
    useEffect(() => {
        const fetchIsOwner = async () => {
            DAO &&
            signerData &&
            (await signerData.getAddress()) === (await getGovernorOwnerAddress(DAO.governorAddress, DAO.chainId))
                ? setIsOwner(true)
                : setIsOwner(false);
        };

        fetchIsOwner().catch(console.error);
    }, [DAO, signerData]);

    // FUNCTIONS
    // ----------------------------------------------------------------------

    const deleteFromWhitelist = async (walletAddress: string) => {
        console.log("deleting");
        WhitelistMoralisInstance
            ? WhitelistMoralisInstance.find((wl) => wl.get("walletAddress") === walletAddress)
                ?.destroy()
                .then(() => loadingWhitelist().catch(console.error))
                .catch(console.error)
            : 0;
    };

    const addTreasuryAndSave = async () => {
        const treasuryAddress = await addTreasury(
            DAO,
            createTreasuryDialog,
            signerData,
            setCreateTreasuryStep,
            switchNetwork
        );
        if (treasuryAddress) {
            handleChangeBasic(treasuryAddress, setDAO, "treasuryAddress");
            console.log("moralis save", treasuryAddress);
            await addTreasureMoralis(DAOMoralisInstance, treasuryAddress, createTreasuryDialog);
        }
    };

    const mintButton = async () => {
        await mint(currentNFT.tokenAddress, DAO, signerData, switchNetwork, setButtonState, isOwner);
    };

    const contributeToTreasuryButton = async (e: React.FormEvent<HTMLFormElement>) => {
        await contributeToTreasury(
            e,
            signerData,
            DAO,
            switchNetwork,
            setSending,
            contributeTreasuryDialog,
            contributeAmount
        );
    };

    return DAO ? (
        <div>
            <div className="cover h-48 w-full relative justify-center">
                <Image priority={true} src={DAO.coverImage} layout={"fill"} />
            </div>
            <Layout className="layout-base">
                <section className="dao app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className="dao-header flex flex-col md:flex-row items-center -mt-10">
                        <div className={"logo"}>
                            <Image src={DAO.profileImage} height={"175px"} width={"175px"} className="rounded-full" />
                        </div>
                        <div className={"info flex flex-col w-full gap-8 md:ml-6"}>
                            <div className={"info-row-1 flex flex-col md:flex-row justify-between items-center"}>
                                <div className={"dao-name"}>
                                    <div className="dao-label capitalize">{DAO.name}</div>
                                </div>
                                <div className={"member-button"}>
                                    <Link
                                        href={{
                                            pathname: `${url}/add-new-member`,
                                        }}
                                    >
                                        <button
                                            className={"secondary-button disabled:bg-gray disabled:hover:bg-gray"}
                                            disabled={!isLoaded}
                                        >
                                            Become a member
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className={"info-row-2 flex justify-between"}>
                                <div className={"about flex flex-col gap-2 md:flex-row md:gap-10"}>
                                    <a
                                        href={DAO.scanURL}
                                        target={"_blank"}
                                        className="hover:text-purple dao-about-button items-center"
                                    >
                                        About
                                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                                    </a>
                                    <div className="dao-about-button items-center">
                                        Blockchain
                                        <BlockchainIcon chain={DAO.blockchain[0]} />
                                    </div>
                                </div>
                                <div className={"links flex gap-5"}>
                                    {DAO.discordURL && (
                                        <a href={isValidHttpUrl(DAO.discordURL)} target={"_blank"}>
                                            <div className="bg-gray rounded-full h-9 w-9 grid place-items-center">
                                                <DiscordIcon width="19" height="20" />
                                            </div>
                                        </a>
                                    )}
                                    {DAO.twitterURL && (
                                        <a href={isValidHttpUrl(DAO.twitterURL)} target={"_blank"}>
                                            <div className="bg-gray rounded-full h-9 w-9 grid place-items-center">
                                                <TwitterIcon width="18" height="20" />
                                            </div>
                                        </a>
                                    )}

                                    {DAO.websiteURL && (
                                        <a href={isValidHttpUrl(DAO.websiteURL)} target="_blank">
                                            <div className="bg-gray rounded-full h-9 w-9 grid place-items-center">
                                                <WebsiteIcon width="19" height="20" />
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="treasury-and-chat flex flex-col gap-3 md:flex-row md:justify-between">
                        {DAO.treasuryAddress ? (
                            <div
                                className={
                                    "flex flex-col justify-between border-2 text-center border-lightGray rounded-2xl h-52 p-3 md:w-4/5"
                                }
                            >
                                <div className={"flex justify-center text-2xl text-gray5 pt-3"}>
                                    <a
                                        href={getChainScanner(DAO.chainId, DAO.treasuryAddress)}
                                        target={"_blank"}
                                        className="flex hover:text-purple gap-3 pl-5 items-center content-center text-black2"
                                    >
                                        Treasury
                                        <ExternalLinkIcon className="h-6 w-5" />
                                    </a>
                                </div>
                                <p className={"text-2xl font-medium"}>$ {treasuryBalance}</p>
                                <div className={"pb-3"}>
                                    <button
                                        className="form-submit-button border-none text-gray3 hover:underline active:text-gray2"
                                        onClick={async () => {
                                            if (!(await checkCorrectNetwork(signerData, DAO.chainId, switchNetwork))) {
                                                return;
                                            }
                                            contributeTreasuryDialog.toggle();
                                        }}
                                    >
                                        Contribute
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {isOwner ? (
                                    <button className="secondary-button w-full" onClick={addTreasuryAndSave}>
                                        Add treasury
                                    </button>
                                ) : (
                                    <button className="secondary-button w-full disabled:cursor-default" disabled={true}>
                                        Treasury not added
                                    </button>
                                )}
                            </div>
                        )}
                        <div>
                            <Link
                                className={"dao-links-chats"}
                                href={{
                                    pathname: `${url}/chats`,
                                }}
                            >
                                <button
                                    className={classNames(
                                        isLoaded
                                            ? "secondary-button gradient-btn-color hover:bg-gradient-to-tl w-full"
                                            : "secondary-button bg-gray hover:bg-gray h-full w-full",
                                        DAO.treasuryAddress && "rounded-2xl h-full"
                                    )}
                                    disabled={!isLoaded}
                                >
                                    DAO Chats
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="dao-proposals-members lg:w-full">
                        <Tabs
                            selectedTab={selectedTab}
                            onClick={setSelectedTab}
                            tabs={[
                                {
                                    label: "Proposals",
                                    index: 0,
                                    Component: () => {
                                        return (
                                            <ProposalsListTab
                                                DAOMoralisInstance={DAOMoralisInstance}
                                                DAO={DAO}
                                                proposals={proposals}
                                                daoUrl={url}
                                            />
                                        );
                                    },
                                },
                                {
                                    label: "Members",
                                    index: 1,
                                    Component: () => {
                                        return <MembersListTab members={members} nfts={NFTs} />;
                                    },
                                },
                                isOwner && {
                                    label: "Whitelist",
                                    index: 2,
                                    Component: () => {
                                        return (
                                            <WhitelistTab
                                                whitelist={whitelist}
                                                isLoaded={isLoaded}
                                                signer={signerData}
                                                isOwner={isOwner}
                                                chainId={DAO.chainId}
                                                deleteFunction={deleteFromWhitelist}
                                            />
                                        );
                                    },
                                },
                            ]}
                            isLoaded={isLoaded}
                            url={{
                                pathname: `${url}/create-proposal`,
                            }}
                        />
                    </div>

                    <div className={"dao-nft"}>
                        <div className="flex flex-row justify-between mb-4 ">
                            <h3 className="text-black font-normal text-2xl">Membership NFTs</h3>
                            {isOwner && isLoaded && (
                                <Link
                                    href={{
                                        pathname: `${url}/add-new-nft`,
                                    }}
                                >
                                    <button className={"secondary-button"} disabled={!isOwner}>
                                        Add NFT
                                    </button>
                                </Link>
                            )}
                        </div>
                        {DAO.tokenAddress ? (
                            <div className="nft-cards-grid">
                                {NFTs ? (
                                    NFTs.map((nft, index) => (
                                        <NFTCardWithDialog
                                            nftObject={nft}
                                            setButtonState={setButtonState}
                                            setCurrentNFT={setCurrentNFT}
                                            detailNFTDialog={detailNFTDialog}
                                            chain={DAO.blockchain[0]}
                                            key={index}
                                        />
                                    ))
                                ) : (
                                    <MockupLoadingNFT chain={DAO.blockchain[0]} />
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
                    </div>
                </section>

                <div className={"dialogs"}>
                    <DetailNftDialog
                        dialog={detailNFTDialog}
                        DAO={DAO}
                        currentNFT={currentNFT}
                        buttonState={buttonState}
                        mintButton={mintButton}
                    />

                    <ContributeTreasuryDialog
                        dialog={contributeTreasuryDialog}
                        DAO={DAO}
                        sending={sending}
                        setSending={setSending}
                        contributeAmount={contributeAmount}
                        setContributeAmount={setContributeAmount}
                        contributeToTreasuryButton={(e) => contributeToTreasuryButton(e)}
                    />

                    <CreateTreasuryDialog
                        dialog={createTreasuryDialog}
                        DAO={DAO}
                        createTreasuryStep={createTreasuryStep}
                    />
                </div>
            </Layout>
        </div>
    ) : (
        <div>
            <div className="cover h-48 w-full relative justify-center bg-gray animate-pulse"></div>
            <Layout className="layout-base">
                <section className="dao app-section flex h-full flex-1 flex-col gap-[50px]">
                    {notFound ? (
                        <MockupTextCard
                            label={"DAO not found"}
                            text={"Sorry, DAO not fount. Please try to reload page"}
                        />
                    ) : (
                        <MockupLoadingDetailDAOPage />
                    )}
                </section>
            </Layout>
        </div>
    );
};

export default DAOPage;
