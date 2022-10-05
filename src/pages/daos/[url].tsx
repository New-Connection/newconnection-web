import * as React from "react";
import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import Image from "next/image";
import { Moralis } from "moralis-v1";
import { getChainScanner } from "utils/blockchains";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { IDAOPageForm, INFTVoting, IProposalPageForm, IWhitelistPageForm } from "types/forms";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { useSigner, useSwitchNetwork } from "wagmi";
import { getGovernorOwnerAddress } from "contract-interactions/";
import { IDaoQuery } from "types/queryInterfaces";
import { isValidHttpUrl } from "utils/transformURL";
import { handleChangeBasic } from "utils/handlers";
import { fetchDAO, fetchNFT, fetchProposals, fetchTreasuryBalance, fetchWhitelist } from "network/index";
import { BlockchainIcon, DiscordIcon, TwitterIcon, WebsiteIcon } from "components/Icons/";
import { MockupLoadingDetailDAOPage, MockupLoadingNFT } from "components/Mockup/Loading";
import { MockupTextCard } from "components/Mockup";
import { NFTCard } from "components/Cards/NFTCard";
import { ProposalsListTab, Tabs, WhitelistTab } from "components/Tabs/";
import { DAOPageProps } from "types/pagePropsInterfaces";
import { ButtonState } from "types/daoIntefaces";
import { addTreasureMoralis, addTreasury, checkCorrectNetwork, contributeToTreasury, mint } from "logic/index";
import { ContributeTreasuryDialog, CreateTreasuryDialog, DetailNftDialog } from "components/Dialog/DaoPageDialogs";
import classNames from "classnames";

export const getServerSideProps: GetServerSideProps<DAOPageProps, IDaoQuery> = async (context) => {
    const { url } = context.params as IDaoQuery;

    const result: DAOPageProps = {
        url: url.toString(),
    };
    return {
        props: result,
    };
};

const DAOPage: NextPage<DAOPageProps> = ({ url }) => {
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const { isInitialized } = useMoralis();
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // Moralis states
    const [DAO, setDAO] = useState<IDAOPageForm>();
    const [DAOMoralisInstance, setDAOMoralisInstance] = useState<Moralis.Object<Moralis.Attributes>>();
    const [WhitelistMoralisInstance, setWhitelistMoralisInstance] = useState<Moralis.Object<Moralis.Attributes>[]>();
    const [whitelist, setWhitelist] = useState<IWhitelistPageForm[]>();
    const [proposals, setProposals] = useState<IProposalPageForm[]>();
    const [NFTs, setNFTs] = useState<INFTVoting[]>();
    const [currentNFT, setCurrentNFT] = useState<INFTVoting>();

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

    // Moralis queries
    const { fetch: DAOsQuery } = useMoralisQuery("DAO", (query) => query.equalTo("url", url), [], {
        autoFetch: false,
    });
    const { fetch: WhitelistQuery } = useMoralisQuery(
        "Whitelist",
        (query) => query.equalTo("daoAddress", DAO?.governorAddress),
        [DAO],
        { autoFetch: false }
    );
    const { fetch: ProposalQuery } = useMoralisQuery(
        "Proposal",
        (query) => query.equalTo("governorAddress", DAO?.governorAddress) && query.equalTo("chainId", DAO?.chainId),
        [DAO],
        {
            autoFetch: false,
        }
    );
    // EFFECTS
    // ----------------------------------------------------------------------

    // Fetching DAO in general
    useEffect(() => {
        const loadingDAO = async () => {
            const data = await fetchDAO(isInitialized, DAOsQuery);
            if (data) {
                setDAO(() => data.newDao);
                // not used
                // data.newDao.totalProposals= await getTotalProposals(DAO!.governorAddress!, DAO!.chainId!);
                // data.newDao.totalMembers= await getNumberOfMintedTokens(DAO!.tokenAddress[0]!, DAO!.chainId!);
                setDAOMoralisInstance(() => data.moralisInstance);
            }
        };

        loadingDAO().catch((e) => {
            console.log("Error when Loading DAO", e);
            setNotFound(true);
        });
    }, [isInitialized]);

    // Loading data
    const loadingWhitelist = async () => {
        const data = await fetchWhitelist(WhitelistQuery);
        if (data) {
            setWhitelist(data.whitelist);
            setWhitelistMoralisInstance(data.moralisInstance);
        }
    };
    useEffect(() => {
        if (DAO) {
            console.log("start loading");
            const loadingProposals = async () => {
                const proposals = await fetchProposals(ProposalQuery);
                if (proposals) {
                    setProposals(() => proposals);
                }
            };

            const loadingNFT = async () => {
                const nftsArray = await fetchNFT(DAO);
                if (nftsArray) {
                    localStorage.setItem(DAO.name + " NFTs", JSON.stringify(nftsArray));
                    setNFTs(nftsArray);
                }
            };

            const loadingTreasuryBalance = async () => {
                const treasuryBalance = await fetchTreasuryBalance(DAO);
                if (treasuryBalance) {
                    setTreasuryBalance(treasuryBalance);
                }
            };

            localStorage.setItem(DAO.name, JSON.stringify(DAO));
            loadingProposals().catch(console.error);
            loadingWhitelist().catch(console.error);
            loadingNFT().catch(console.error);
            loadingTreasuryBalance().catch(console.error);
        }
    }, [DAO]);

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

    // Loaded check
    useEffect(() => {
        if (DAO && proposals && NFTs && signerData && !isLoaded) {
            const fetchIsLoaded = async () => {
                console.log("loaded");
                setIsLoaded(true);
            };

            fetchIsLoaded().catch(console.error);
        }
    });

    // FUNCTIONS
    // ----------------------------------------------------------------------

    const deleteFromWhitelist = async (walletAddress: string) => {
        console.log("deleting");
        WhitelistMoralisInstance
            ? WhitelistMoralisInstance.find((wl) => wl.get("walletAddress") === walletAddress)
                ?.destroy()
                .then()
                .catch(console.error)
            : 0;
        //  rerender
        loadingWhitelist().catch(console.error);
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
                                            query: {
                                                governorAddress: DAO.governorAddress,
                                                daoName: DAO.name,
                                                blockchains: DAO.blockchain,
                                                tokenAddress: DAO.tokenAddress,
                                            },
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
                                        className="flex hover:text-purple gap-3 items-center content-center text-black2"
                                    >
                                        Treasury
                                        <ExternalLinkIcon className="h-6 w-5" />
                                    </a>
                                </div>
                                <div className={"text-5xl"}>$ {treasuryBalance}</div>
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
                                    <button className="secondary-button w-full" disabled={true}>
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
                                    query: {
                                        governorAddress: DAO.governorAddress,
                                        blockchains: DAO.blockchain,
                                        tokenAddress: DAO.tokenAddress,
                                        daoName: DAO.name,
                                        chainId: DAO.chainId,
                                    },
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
                                    label: "Whitelist",
                                    index: 1,
                                    Component: () => {
                                        return (
                                            <WhitelistTab
                                                whitelist={whitelist}
                                                signer={signerData}
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
                                query: {
                                    governorAddress: DAO.governorAddress,
                                    blockchains: [DAO.blockchain[0]],
                                    chainId: DAO.chainId,
                                },
                            }}
                        />
                    </div>

                    <div className={"dao-nft"}>
                        <div className="flex flex-row justify-between mb-4 ">
                            <h3 className="text-black font-normal text-2xl">Membership NFTs</h3>
                            <Link
                                href={{
                                    pathname: `${url}/add-new-nft`,
                                    query: {
                                        url: url,
                                        governorAddress: DAO.governorAddress,
                                        blockchain: DAO.blockchain,
                                    },
                                }}
                            >
                                <button className={"secondary-button"} disabled={!isOwner}>
                                    Add NFT
                                </button>
                            </Link>
                        </div>
                        {DAO.tokenAddress ? (
                            <div
                                className="place-items-center mt-8 grid gap-10 md:max-w-none md:grid-cols-2 md:gap-20 lg:gap-24 lg:max-w-none lg:grid-cols-3">
                                {NFTs ? (
                                    NFTs.map((nft, index) => (
                                        <NFTCard
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
