import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { formatAddress } from "utils/address";
import type { GetServerSideProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import Image from "next/image";
import { Moralis } from "moralis-v1";
import ASSETS from "assets/index";
import { getChainScanner, getTokenSymbol } from "utils/blockchains";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Tabs from "components/Tabs/Tabs";
import { IDAOPageForm, INFTVoting, IProposalPageForm, IWhitelistPageForm } from "types/forms";
import { ClipboardCopyIcon, ExternalLinkIcon, GlobeAltIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useDialogState } from "ariakit";
import { CustomDialog, StepperDialog } from "components/Dialog";
import { useSigner, useSwitchNetwork } from "wagmi";
import { isIpfsAddress, loadImage } from "utils/ipfsUpload";
import { getGovernorOwnerAddress } from "contract-interactions/";
import { IDaoQuery } from "types/queryInterfaces";
import { isValidHttpUrl } from "utils/transformURL";
import { handleChangeBasic } from "utils/handlers";
import { createTreasurySteps, SpinnerLoading } from "components/Dialog/Stepper";
import { InputAmount } from "components/Form";
import {
    fetchDAO,
    fetchProposal,
    fetchNFT,
    fetchTreasuryBalance,
    fetchWhitelist,
} from "network/index";
import { BlockchainImage } from "components/Icons/BlockchainImage";
import { MockupLoadingNFT } from "components/Mockup/Loading";
import { MockupTextCard } from "components/Mockup";
import { NFTCard, NFTImage } from "components/Cards/NFTCard";
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
    const firstUpdate = useRef(true);
    const [isLoaded, setIsLoaded] = useState(false);

    // DB states
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

    // DB queries
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

    // FUNCTIONS
    // ----------------------------------------------------------------------
    const fetchIsOwner = async () => {
        DAO &&
        signerData &&
        (await signerData.getAddress()) ===
            (await getGovernorOwnerAddress(DAO.governorAddress, DAO.chainId))
            ? setIsOwner(true)
            : setIsOwner(false);
    };

    // Fetching DAO in general
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

    useEffect(() => {
        loadingDAO().catch((e) => console.log("Error when Loading DAO", e));
    }, [isInitialized]);

    // Loading data
    useEffect(() => {
        if (DAO && firstUpdate.current) {
            localStorage.setItem(DAO.name, JSON.stringify(DAO));
            loadingProposals().catch(console.error);
            loadingWhitelist().catch(console.error);
            loadingNFT().catch(console.error);
            loadingTreasuryBalance().catch(console.error);

            firstUpdate.current = false;
        }
    }, [DAO]);

    // Owner check
    useEffect(() => {
        fetchIsOwner().catch(console.error);
    }, [DAO, signerData]);

    // Loading...
    useEffect(() => {
        if (DAO && proposals && NFTs && signerData && !isLoaded) {
            const fetchIsLoaded = async () => {
                console.log("loaded");
                setIsLoaded(true);
            };

            fetchIsLoaded().catch(console.error);
        }
    });

    //
    // CUSTOM COMPONENTS
    // ----------------------------------------------------------------------
    const ImageLink = ({ url, image }) => {
        return (
            <a href={url} target={"_blank"}>
                <Image height={"25"} width={"25"} src={image} />
            </a>
        );
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
            addTreasureMoralis(DAOMoralisInstance, treasuryAddress, createTreasuryDialog);
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
        <div>
            <Layout className="layout-base mt-0">
                <div className="cover h-36 w-full relative justify-center">
                    <Image
                        priority={true}
                        src={!isIpfsAddress(DAO.coverImage) ? DAO.coverImage : ASSETS.daoCoverMock}
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
                    <div className="lg:flex md:flex lg:justify-between gap-10 justify-between w-full">
                        <div className="flex lg:w-1/3 gap-10 items-center">
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
                                <ImageLink
                                    url={isValidHttpUrl(DAO.discordURL)}
                                    image={ASSETS.discord}
                                />
                            ) : null}
                            {DAO.twitterURL ? (
                                <ImageLink
                                    url={isValidHttpUrl(DAO.twitterURL)}
                                    image={ASSETS.twitter}
                                />
                            ) : null}

                            {DAO.websiteURL ? (
                                <a href={isValidHttpUrl(DAO.websiteURL)} target="_blank">
                                    <GlobeAltIcon className="h-6 w-6" />
                                </a>
                            ) : null}
                        </div>
                        <Link
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
                </section>
                <CustomDialog dialog={detailNFTDialog} className="h-full items-center text-center">
                    {currentNFT ? (
                        <div className="w-full">
                            <NFTImage className="rounded-lg h-14 w-14" image={currentNFT.image} />
                            <p className="mt-4 text-black">{`${currentNFT.title}`}</p>
                            <a
                                href={getChainScanner(DAO.chainId, currentNFT.tokenAddress)}
                                target={"_blank"}
                                className="hover:text-purple flex justify-center"
                            >
                                Smart Contract
                                <ExternalLinkIcon className="h-6 w-5" />
                            </a>
                            {
                                <button
                                    className={`secondary-button w-full h-12 mt-4 mb-6 
                            ${buttonState === "Success" ? "bg-green" : ""} 
                            ${buttonState === "Error" ? "bg-red" : ""}`}
                                    onClick={mintButton}
                                >
                                    {buttonState}
                                </button>
                            }
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
                                        <BlockchainImage chain={DAO.blockchain[0]} />
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
                            src={
                                !isIpfsAddress(DAO.profileImage)
                                    ? DAO.profileImage
                                    : ASSETS.daoLogoMock
                            }
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
                                    <ClipboardCopyIcon className="h-6 w-5" />
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <form
                        onSubmit={(event) => {
                            setSending(() => true);
                            contributeToTreasuryButton(event);
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
                                    <SpinnerLoading />
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
