import * as React from "react";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import Layout, { CopyTextButton, DAOCard, MockupLoadingNFT, NFTCard } from "components";
import Image from "next/image";
import ASSETS from "assets";
import { LinkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IDAOPageForm, INFTVoting } from "types";
import { fetchNFTsForMember, getTotalProposals } from "interactions/contract";
import { getAllMemberRecords, getDaosForMember } from "interactions/database";
import { useLocalStorage } from "usehooks-ts";

const Home: NextPage = () => {
    const { address, isConnected } = useAccount();
    const [userAddress, setUserAddress] = useState("");

    const [memberDaos, setMemberDaos] = useState<IDAOPageForm[]>();
    const [memberNfts, setMemberNfts] = useState<INFTVoting[]>();

    const [storageDaos, setStorageDaos] = useLocalStorage("homeDaos", null);
    const [storageNfts, setStorageNfts] = useLocalStorage("homeNfts", null);

    useEffect(() => {
        setMemberDaos(storageDaos);
        setMemberNfts(storageNfts);

        const loadingLargeData = async (DAOsList: IDAOPageForm[]) => {
            const newDAOs = await Promise.all(
                DAOsList!.map(async (dao) => {
                    return {
                        ...dao,
                        totalProposals: await getTotalProposals(dao.governorAddress!, dao.chainId!),
                    };
                })
            );
            setMemberDaos(() => newDAOs);
        };

        const loadingData = async () => {
            const memberRecords = await getAllMemberRecords(address);
            getDaosForMember(memberRecords).then((daos) => {
                if (daos.length > 0) {
                    console.log("load daos " + daos);
                    setMemberDaos(daos);
                    loadingLargeData(daos).then();

                    setStorageDaos(daos);
                }
            });
            fetchNFTsForMember(memberRecords).then((nfts) => {
                if (nfts.length > 0) {
                    console.log("load nfts" + nfts);
                    setMemberNfts(nfts);

                    setStorageNfts(nfts);
                }
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
                    <div className={"info flex flex-col w-full gap-8 md:ml-6"}>
                        <div className={"info-row-1 flex flex-col md:flex-row justify-between items-center"}>
                            <div className="dao-label hover:text-base-content">
                                <CopyTextButton copyText={userAddress} />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={
                        "flex flex-col justify-between text-center h-52 p-3 bg-base-200 border-base-300 rounded-2xl border-2"
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
                        <button className="form-submit-button w-28">Deposit</button>
                        <button className="form-neutral-button w-28">Withdraw</button>
                    </div>
                </div>

                <div className="grid grid-flow-row w-full">
                    <h1 className="text-highlighter mb-8">Member DAOs</h1>
                    <ul className={"flex flex-col gap-6"}>
                        {memberDaos &&
                            memberDaos.map((dao, index) => (
                                <DAOCard key={index} daoObject={dao} lastElement={!(index !== memberDaos.length - 1)} />
                            ))}
                    </ul>
                </div>

                <div className="grid grid-flow-row w-full">
                    <h1 className="text-highlighter mb-8">Member NFTs</h1>
                    <div className="nft-cards-grid">
                        {memberNfts ? (
                            memberNfts.map((nft, index) => <NFTCard key={index} nftObject={nft} />)
                        ) : (
                            <MockupLoadingNFT chain={1} />
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    ) : (
        <Layout className={"layout-base"}>
            <div className={"app-section mt-20"}>
                <div
                    className={
                        "bg-base-200 p-10 grid grid-flow-row gap-16 justify-center border-2 border-base-300 rounded-xl w-1/2"
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
