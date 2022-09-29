import * as React from "react";
import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import Image from "next/image";
import { Moralis } from "moralis-v1";
import ASSETS from "assets/index";
import { getChainScanner } from "utils/blockchains";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Tabs from "components/Tabs/Tabs";
import { IDAOPageForm, INFTVoting, IProposalPageForm, IWhitelistPageForm } from "types/forms";
import { ExternalLinkIcon, GlobeAltIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { useSigner, useSwitchNetwork } from "wagmi";
import { isIpfsAddress, loadImage } from "utils/ipfsUpload";
import { getGovernorOwnerAddress } from "contract-interactions/";
import { IDaoQuery } from "types/queryInterfaces";
import { isValidHttpUrl } from "utils/transformURL";
import { handleChangeBasic } from "utils/handlers";
import {
    fetchDAO,
    fetchProposal,
    fetchNFT,
    fetchTreasuryBalance,
    fetchWhitelist,
} from "network/index";
import { BlockchainImage } from "components/Icons/BlockchainImage";
import { MockupLoadingDAO, MockupLoadingNFT } from "components/Mockup/Loading";
import { MockupTextCard } from "components/Mockup";
import { NFTCard } from "components/Cards/NFTCard";
import { ProposalsListTab } from "components/Tabs/ProposalsListTab";
import { WhitelistTab } from "components/Tabs/WhitelistTab";
import { DAOPageProps } from "types/pagePropsInterfaces";
import { ButtonState } from "types/daoIntefaces";
import {
    checkCorrectNetwork,
    mint,
    contributeToTreasury,
    addTreasury,
    addTreasureMoralis,
} from "logic/index";
import {
    ContributeTreasuryDialog,
    CreateTreasuryDialog,
    DetailNftDialog,
} from "components/Dialog/daoPageDialogs";

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

    const [DAOMoralisInstance, setDAOMoralisInstance] =
        useState<Moralis.Object<Moralis.Attributes>>();
    const { isInitialized } = useMoralis();

    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // Moralis states
    const [DAO, setDAO] = useState<IDAOPageForm>();
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
        (query) =>
            query.equalTo("governorAddress", DAO?.governorAddress) &&
            query.equalTo("chainId", DAO?.chainId),
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
                data.newDao.profileImage = await loadImage(data.newDao.profileImage);
                data.newDao.coverImage = await loadImage(data.newDao.coverImage);
                setDAOMoralisInstance(() => data.moralisInstance);
            }
        };

        loadingDAO().catch((e) => {
            console.log("Error when Loading DAO", e);
            setNotFound(true);
        });
    }, [isInitialized]);

    // Loading data
    useEffect(() => {
        if (DAO) {
            console.log("start loading");
            const loadingProposals = async () => {
                const proposals = await fetchProposal(ProposalQuery);
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

            const loadingWhitelist = async () => {
                const whitelist = await fetchWhitelist(WhitelistQuery);
                if (whitelist) {
                    setWhitelist(whitelist);
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
            (await signerData.getAddress()) ===
                (await getGovernorOwnerAddress(DAO.governorAddress, DAO.chainId))
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
        await mint(
            currentNFT.tokenAddress,
            DAO,
            signerData,
            switchNetwork,
            setButtonState,
            isOwner
        );
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
        <Layout className="layout-base mt-0">
            <div className="cover h-36 w-full relative justify-center">
                <Image
                    priority={true}
                    src={!isIpfsAddress(DAO.coverImage) ? DAO.coverImage : ASSETS.daoCoverMock}
                    layout={"fill"}
                />
            </div>

            <section className="dao app-section flex h-full flex-1 flex-col gap-[50px]">
                <div className="dao-info lg:flex md:flex xl:flex justify-between items-center">
                    <div className="flex">
                        <div className="mt-[-50px]">
                            <Image
                                src={
                                    !isIpfsAddress(DAO.profileImage)
                                        ? DAO.profileImage
                                        : ASSETS.daoLogoMock
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
                            className={
                                isLoaded
                                    ? "secondary-button"
                                    : "secondary-button bg-gray hover:bg-gray"
                            }
                            disabled={!isLoaded}
                        >
                            Become a member
                        </button>
                    </Link>
                </div>

                <div className="dao-links lg:flex md:flex lg:justify-between gap-10 justify-between w-full">
                    <div className="dao-links-social flex lg:w-1/3 gap-10 items-center">
                        <a
                            href={DAO.scanURL}
                            target={"_blank"}
                            className="hover:text-purple text-xs flex px-[10px] py-[4px] h-[24px] bg-gray text-black gap-1 rounded-full"
                        >
                            Contract
                            <ExternalLinkIcon className="h-4 w-3" />
                        </a>
                        <div className="flex px-[10px] py-[4px] h-[24px] bg-gray text-black gap-1 rounded-full items-center">
                            <p className="text-xs">Blockchain</p>
                            <BlockchainImage chain={DAO.blockchain[0]} />
                        </div>

                        {DAO.discordURL ? (
                            <a href={isValidHttpUrl(DAO.discordURL)} target={"_blank"}>
                                <Image height={"25"} width={"25"} src={ASSETS.discord} />
                            </a>
                        ) : null}
                        {DAO.twitterURL ? (
                            <a href={isValidHttpUrl(DAO.twitterURL)} target={"_blank"}>
                                <Image height={"25"} width={"25"} src={ASSETS.twitter} />
                            </a>
                        ) : null}

                        {DAO.websiteURL ? (
                            <a href={isValidHttpUrl(DAO.websiteURL)} target="_blank">
                                <GlobeAltIcon className="h-6 w-6" />
                            </a>
                        ) : null}
                    </div>

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
                            className={
                                isLoaded
                                    ? "secondary-button gradient-btn-color"
                                    : "secondary-button bg-gray hover:bg-gray"
                            }
                            disabled={!isLoaded}
                        >
                            DAO Chats
                        </button>
                    </Link>
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
                                <ExternalLinkIcon className="h-6 w-5" />
                            </a>
                        </div>
                    ) : (
                        <div className={"flex justify-center text-xl text-gray5"}>Treasury</div>
                    )}
                    <div className={"text-4xl"}>$ {treasuryBalance}</div>
                    <div>
                        {!DAO.treasuryAddress && isOwner ? (
                            <button className="form-submit-button" onClick={addTreasuryAndSave}>
                                Add treasury
                            </button>
                        ) : !DAO.treasuryAddress ? (
                            <button
                                className="secondary-button bg-gray hover:bg-gray"
                                disabled={true}
                            >
                                Treasury not added
                            </button>
                        ) : (
                            <button
                                className="form-submit-button w-1/5"
                                onClick={async () => {
                                    if (
                                        !(await checkCorrectNetwork(
                                            signerData,
                                            DAO.chainId,
                                            switchNetwork
                                        ))
                                    ) {
                                        return;
                                    }
                                    contributeTreasuryDialog.toggle();
                                }}
                            >
                                Contribute
                            </button>
                        )}
                    </div>
                </div>

                <div className="dao-proposals-members lg:w-full">
                    <Tabs
                        selectedTab={selectedTab}
                        onClick={setSelectedTab}
                        tabs={[
                            {
                                label: "PROPOSALS",
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
                                label: "WHITELIST",
                                index: 1,
                                Component: () => {
                                    return (
                                        <WhitelistTab
                                            whitelist={whitelist}
                                            signer={signerData}
                                            chainId={DAO.chainId}
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
                            <button
                                className={
                                    isOwner
                                        ? "secondary-button bg-purple text-white"
                                        : "secondary-button bg-gray hover:bg-gray"
                                }
                                disabled={!isOwner}
                            >
                                Add NFT
                            </button>
                        </Link>
                    </div>
                    {DAO.tokenAddress ? (
                        <div className="flex justify-between">
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
    ) : (
        <Layout className="layout-base">
            <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                {notFound ? (
                    <MockupTextCard
                        label={"DAO not found"}
                        text={"Sorry, DAO not fount. Please try to reload page"}
                    />
                ) : (
                    <MockupLoadingDAO />
                )}
            </section>
        </Layout>
    );
};

export default DAOPage;
