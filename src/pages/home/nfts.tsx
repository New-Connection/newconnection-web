import { NextPage } from "next";
import Layout, { BackButton, CopyTextButton, MockupLoadingNFT, NFTCard } from "components";
import * as React from "react";
import { useState } from "react";
import { INFTVoting, IQuery } from "types";
import { useEffectOnce, useReadLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";
import Image from "next/image";
import ASSETS from "assets";

const HomeNfts: NextPage<IQuery> = () => {
    const { address, isConnected } = useAccount();
    const [userAddress, setUserAddress] = useState("");

    const [homeNfts, setHomeNfts] = useState<INFTVoting[]>();

    const storageHomeNfts = useReadLocalStorage<INFTVoting[]>("homeNfts");

    useEffectOnce(() => {
        isConnected && setUserAddress(address);

        setHomeNfts(storageHomeNfts);
    });

    return (
        homeNfts && (
            <div>
                <Layout className="layout-base">
                    <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                        <BackButton />
                        <div className="dao-header flex flex-col md:flex-row items-center">
                            <div className="avatar">
                                <div className="w-32 rounded-full">
                                    <Image
                                        src={ASSETS.daoNFTMock}
                                        height={"175px"}
                                        width={"175px"}
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                            <div className={"info ml-6"}>
                                <div className="dao-label hover:text-base-content">
                                    <CopyTextButton copyText={userAddress} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-flow-row w-full">
                            <h1 className="text-highlighter mb-8">Member NFTs</h1>
                            <div className="nft-cards-grid">
                                {homeNfts ? (
                                    homeNfts.map((nft, index) => <NFTCard key={index} nftObject={nft} />)
                                ) : (
                                    <MockupLoadingNFT chain={1} />
                                )}
                            </div>
                        </div>
                    </section>
                </Layout>
            </div>
        )
    );
};

export default HomeNfts;
