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
import {
    AddToWhitelist,
    addTreasury,
    checkCorrectNetwork,
    contributeToTreasury,
    fetchNFT,
    fetchTreasuryBalance,
    getChainScanner,
    getGovernorOwnerAddress,
    mint,
} from "interactions/contract";
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
import { LinkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { useAccount, useSigner, useSwitchNetwork } from "wagmi";
import { handleChangeBasic, handleContractError, isValidHttpUrl } from "utils";
import {
    addValueToDao,
    deleteWhitelistRecord,
    getAllMembers,
    getAllProposals,
    getDao,
    getWhitelist,
    saveMember,
} from "interactions/database";
import classNames from "classnames";
import toast from "react-hot-toast";
import { useBoolean, useCounter, useLocalStorage } from "usehooks-ts";

export const getServerSideProps: GetServerSideProps<DAOPageProps, IDaoQuery> = async (context) => {
    const { url } = context.params as IDaoQuery;

    const result: DAOPageProps = {
        url: url.toString(),
    };
    return {
        props: result,
    };
};

const LOADING_COUNTER = 2;

const DAOPage: NextPage<DAOPageProps> = ({ url }) => {
    const { data: signerData } = useSigner();
    const { address: signerAddress } = useAccount();
    const { switchNetwork } = useSwitchNetwork();
    const { count: loadingCounter, increment: incrementLoadingCounter, reset: resetLoadingCounter } = useCounter(0);
    const isLoaded = loadingCounter >= LOADING_COUNTER && signerData != null;
    const { value: notFound, setTrue: setNotFound } = useBoolean(false);
    const { count: selectedTab, setCount: setSelectedTab } = useCounter(0);

    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [whitelist, setWhitelist] = useState<IWhitelistRecord[]>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const [members, setMembers] = useState<IMember[]>();

    // NFT section
    const [NFTs, setNFTs] = useState<INFTVoting[]>();
    const [currentNFT, setCurrentNFT] = useState<INFTVoting>();
    const [buttonState, setButtonState] = useState<ButtonState>("Mint");
    const detailNFTDialog = useDialogState();

    // Treasury section
    const { value: isOwner, setTrue: setOwnerTrue, setFalse: setOwnerFalse } = useBoolean(false);
    const [treasuryBalance, setTreasuryBalance] = useState("0");
    const {
        count: createTreasuryStep,
        increment: incrementCreateTreasuryStep,
        reset: resetCreateTreasuryStep,
    } = useCounter(0);
    const [contributeAmount, setContributeAmount] = useState("0");
    const { value: sending, setValue: setSending } = useBoolean(false);
    const createTreasuryDialog = useDialogState();
    const contributeTreasuryDialog = useDialogState();

    // Local storage
    const [storageDao, setStorageDao] = useLocalStorage(url, null);
    const [storageNFTs, setStorageNFTs] = useLocalStorage(`${url} NFTs`, null);
    const [storageProposals, setStorageProposals] = useLocalStorage(`${url} Proposals`, null);

    // EFFECTS
    // ----------------------------------------------------------------------
    const loadingWhitelist = async () => {
        const whitelist = await getWhitelist(url);
        if (whitelist) {
            console.log("load whitelist");
            setWhitelist(() => whitelist);
        }
    };
    useEffect(() => {
        setDAO(storageDao);
        setNFTs(storageNFTs);
        setProposals(storageProposals);

        resetLoadingCounter();

        const loadingDAO = async () => {
            const newDao = await getDao(url);
            if (newDao) {
                setDAO(newDao);
                setStorageDao(newDao);
                return newDao;
            }
        };

        const loadingProposals = async () => {
            const proposals = await getAllProposals(url);
            if (proposals) {
                console.log("load proposals");
                setProposals(proposals);
                setStorageProposals(proposals);
                incrementLoadingCounter();
            }
        };

        const loadingNFT = async (dao: IDAOPageForm) => {
            const nftsArray = await fetchNFT(dao, signerAddress);
            if (nftsArray) {
                console.log("load nfts");
                setNFTs(nftsArray);
                setStorageNFTs(nftsArray);
                return nftsArray;
            }
        };

        const loadingTreasuryBalance = async (dao: IDAOPageForm) => {
            const treasuryBalance = await fetchTreasuryBalance(dao);
            if (treasuryBalance) {
                setTreasuryBalance(treasuryBalance);
            }
        };

        const loadingMembers = async () => {
            const newMembers = await getAllMembers(url);
            if (newMembers) {
                setMembers(() => newMembers);
            }
        };

        const updateMember = async (nfts: INFTVoting[]) => {
            const tokens: string[] = [];
            let votingPower = 0;

            nfts.forEach((nft) => {
                const votePower = nft.tokenMintedByMember;
                if (votePower > 0) {
                    tokens.push(nft.tokenAddress);
                    votingPower += votePower;
                }
            });

            const member: IMember = {
                memberAddress: signerAddress,
                governorUrl: url,
                memberTokens: [...tokens],
                role: "Member",
                votingPower: votingPower,
            };

            await saveMember(member);

            incrementLoadingCounter();
        };

        loadingDAO()
            .then((dao) => {
                if (dao) {
                    console.log("dao loaded");
                    loadingWhitelist().then();
                    loadingTreasuryBalance(dao).then();
                    loadingProposals().then();
                    loadingNFT(dao).then((nfts) => nfts && signerAddress && updateMember(nfts));
                    loadingMembers().then();
                } else {
                    setNotFound();
                }
            })
            .catch((e) => {
                console.log("Error when Loading DAO", e);
                setNotFound();
            });
    }, [signerAddress]);

    // Owner check
    useEffect(() => {
        const fetchIsOwner = async () => {
            DAO && signerData && signerAddress === (await getGovernorOwnerAddress(DAO.governorAddress, DAO.chainId))
                ? setOwnerTrue()
                : setOwnerFalse();
        };

        fetchIsOwner().catch(console.error);
    }, [DAO, signerData]);

    // FUNCTIONS
    // ----------------------------------------------------------------------
    console.log(NFTs);
    const addTreasuryAndSave = async () => {
        const treasuryAddress = await addTreasury(
            DAO,
            createTreasuryDialog,
            signerData,
            incrementCreateTreasuryStep,
            resetCreateTreasuryStep,
            switchNetwork
        );
        if (treasuryAddress) {
            handleChangeBasic(treasuryAddress, setDAO, "treasuryAddress");
            console.log("db save", treasuryAddress);
            await addValueToDao(url, "treasuryAddress", treasuryAddress);
        }
    };

    const addToWhitelist = async (walletAddress: string, votingTokenAddress: string, isRejected: boolean = false) => {
        let status;
        if (!isRejected) {
            if (!(await checkCorrectNetwork(signerData, DAO.chainId, switchNetwork))) {
                return;
            }

            console.log("voting token " + votingTokenAddress);
            status = await AddToWhitelist({
                addressNFT: votingTokenAddress,
                walletAddress: walletAddress,
                signer: signerData,
            });
        }
        try {
            if (status || isRejected) {
                await deleteWhitelistRecord(DAO.url, walletAddress, votingTokenAddress);
                loadingWhitelist().then();
                isRejected ? toast.success("Whitelist request refected") : toast.success("Wallet added to Whitelist");
            }
        } catch (e) {
            handleContractError(e);
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
                        <div className="avatar">
                            <div className="w-32 rounded-full">
                                <Image
                                    src={DAO.profileImage}
                                    height={"175px"}
                                    width={"175px"}
                                    className="rounded-full"
                                />
                            </div>
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
                                        <button className={"secondary-button"} disabled={!isLoaded}>
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
                                        className="hover:text-primary dao-about-button items-center"
                                    >
                                        About
                                        <LinkIcon className="h-3.5 w-3.5" />
                                    </a>
                                    <div className="dao-about-button items-center">
                                        Blockchain
                                        <BlockchainIcon chain={DAO.blockchain[0]} />
                                    </div>
                                </div>
                                <div className={"links flex gap-5"}>
                                    {DAO.discordURL && (
                                        <a href={isValidHttpUrl(DAO.discordURL)} target={"_blank"}>
                                            <div className="bg-base-200 rounded-full h-9 w-9 grid place-items-center">
                                                <DiscordIcon width="19" height="20" />
                                            </div>
                                        </a>
                                    )}
                                    {DAO.twitterURL && (
                                        <a href={isValidHttpUrl(DAO.twitterURL)} target={"_blank"}>
                                            <div className="bg-base-200 rounded-full h-9 w-9 grid place-items-center">
                                                <TwitterIcon width="18" height="20" />
                                            </div>
                                        </a>
                                    )}

                                    {DAO.websiteURL && (
                                        <a href={isValidHttpUrl(DAO.websiteURL)} target="_blank">
                                            <div className="bg-base-200 rounded-full h-9 w-9 grid place-items-center">
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
                                    "flex flex-col justify-between border-2 text-center bg-base-200 border-base-300 rounded-2xl h-52 p-3 md:w-4/5"
                                }
                            >
                                <div className={"flex justify-center text-2xl pt-3"}>
                                    <a
                                        href={getChainScanner(DAO.chainId, DAO.treasuryAddress)}
                                        target={"_blank"}
                                        className="flex hover:text-primary gap-3 pl-5 items-center content-center text-base-content"
                                    >
                                        Treasury
                                        <LinkIcon className="h-6 w-5" />
                                    </a>
                                </div>
                                <p className={"text-2xl font-medium"}>$ {treasuryBalance}</p>
                                <div className={"pb-3"}>
                                    <button
                                        className="form-submit-button"
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
                                    <button className="secondary-button" disabled={true}>
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
                                            : "secondary-button h-full w-full",
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
                                                // DAOMoralisInstance={DAOMoralisInstance}
                                                DAO={DAO}
                                                proposals={proposals}
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
                                                governorUrl={url}
                                                whitelist={whitelist}
                                                isLoaded={isLoaded}
                                                signer={signerData}
                                                chainId={DAO.chainId}
                                                addToWhitelist={addToWhitelist}
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
                            <h3 className="text-base-content font-normal text-2xl">Membership NFTs</h3>
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
                                            isLoaded={isLoaded}
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
            <div className="cover h-48 w-full relative justify-center bg-base-200 animate-pulse"></div>
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
