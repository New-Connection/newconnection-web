import * as React from "react";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import Layout, { CopyTextButton, DAOCard, MockupLoadingNFT, NFTCard, ViewAllButton } from "components";
import Image from "next/image";
import ASSETS from "assets";
import { LinkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IDAOPageForm, INFTVoting } from "types";
import { fetchNFTsForMember, getTotalProposals } from "interactions/contract";
import { getAllMemberRecords, getDaosForMember } from "interactions/database";
import { useLocalStorage } from "usehooks-ts";

const VISIBLE_ELEMENTS = 3;

const Home: NextPage = () => {
    const { address, isConnected } = useAccount();
    const [userAddress, setUserAddress] = useState("");

    const [homeDaos, setHomeDaos] = useState<IDAOPageForm[]>();
    const [homeNfts, setHomeNfts] = useState<INFTVoting[]>();

    const [storageHomeDaos, setStorageDaos] = useLocalStorage("homeDaos", null);
    const [storageHomeNfts, setStorageNfts] = useLocalStorage("homeNfts", null);

    useEffect(() => {
        setHomeDaos(storageHomeDaos);
        setHomeNfts(storageHomeNfts);

        const loadingLargeData = async (DAOsList: IDAOPageForm[]) => {
            const newDAOs = await Promise.all(
                DAOsList!.map(async (dao) => {
                    return {
                        ...dao,
                        totalProposals: await getTotalProposals(dao.governorAddress!, dao.chainId!),
                    };
                })
            );
            setHomeDaos(() => newDAOs);
        };

        const loadingData = async () => {
            const memberRecords = await getAllMemberRecords(address);
            getDaosForMember(memberRecords).then((daos) => {
                console.log("load daos " + daos);
                setHomeDaos(daos);
                loadingLargeData(daos).then();

                setStorageDaos(daos);
            });
            fetchNFTsForMember(memberRecords).then((nfts) => {
                console.log("load nfts" + nfts);
                setHomeNfts(nfts);

                setStorageNfts(nfts);
            });
        };

        if (isConnected) {
            setUserAddress(address);
            loadingData().catch((e) => {
                console.log("Error when loading DAOs", e);
            });
        }
    }, [address]);

    return userAddress ? (
        <Layout className="layout-base">
            <section className="dao app-section grid grid-flow-row gap-16">
                <div className="dao-header flex flex-col md:flex-row items-center">
                    <div className="avatar">
                        <div className="w-32 rounded-full">
                            <Image src={ASSETS.daoNFTMock} height={"175px"} width={"175px"} className="rounded-full" />
                        </div>
                    </div>
                    <div className={"info ml-6"}>
                        <div className="dao-label hover:text-base-content">
                            <CopyTextButton copyText={userAddress} />
                        </div>
                    </div>
                </div>
                <div
                    className={
                        "flex flex-col justify-between text-center h-52 p-3 bg-base-200 border-base-200 rounded-2xl border-2"
                    }
                >
                    <div className={"flex justify-center text-2xl pt-3"}>
                        <a
                            target={"_blank"}
                            className="flex hover:text-primary gap-3 pl-5 items-center content-center text-base-content"
                        >
                            My balance
                            <LinkIcon className="h-6 w-5" />
                        </a>
                    </div>
                    <p className={"text-2xl font-medium"}>$ {0}</p>
                    <div className={"flex justify-center gap-4"}>
                        <button className="main-button w-1/5">Deposit</button>
                        <button className="secondary-button w-1/5">Withdraw</button>
                    </div>
                </div>

                <div className="grid grid-flow-row w-full">
                    <h1 className="text-highlighter mb-8">Member DAOs</h1>
                    <ul className={"flex flex-col gap-6"}>
                        {homeDaos &&
                            homeDaos
                                .slice(0, VISIBLE_ELEMENTS)
                                .map((dao, index) => (
                                    <DAOCard
                                        key={index}
                                        daoObject={dao}
                                        lastElement={!(index !== homeDaos.length - 1)}
                                    />
                                ))}
                    </ul>
                    {homeDaos.length > VISIBLE_ELEMENTS && (
                        <ViewAllButton label={"View all DAOs"} pathname={"home/daos/"} />
                    )}
                </div>

                <div className="grid grid-flow-row w-full">
                    <h1 className="text-highlighter mb-8">Member NFTs</h1>
                    <div className="nft-cards-grid">
                        {homeNfts ? (
                            homeNfts
                                .slice(0, VISIBLE_ELEMENTS)
                                .map((nft, index) => <NFTCard key={index} nftObject={nft} />)
                        ) : (
                            <MockupLoadingNFT chain={1} />
                        )}
                    </div>
                    {homeNfts.length > VISIBLE_ELEMENTS && (
                        <ViewAllButton label={"View all NFTs"} pathname={"home/nfts/"} />
                    )}
                </div>
            </section>
        </Layout>
    ) : (
        <Layout className={"layout-base"}>
            <div className={"app-section mt-20"}>
                <div
                    className={
                        "bg-base-200 p-10 grid grid-flow-row gap-16 justify-center border-2 border-base-200 rounded-xl w-1/2"
                    }
                >
                    <div className={"text-2xl"}>
                        {"Please connect wallet"}
                        <div className={"flex gap-5 justify-center mt-4"}>
                            <Image src={ASSETS.metamask} height={"30px"} width={"30px"} />
                            <Image src={ASSETS.walletConnect} height={"30px"} width={"30px"} />
                            <Image src={ASSETS.web3Auth} height={"30px"} width={"30px"} />
                        </div>
                    </div>

                    <div className={"flex justify-center"}>
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
