import * as React from "react";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Layout, { BackButton, LockIcon } from "components";
import { IChatsQuery, IDAOPageForm, INFTVoting } from "types";
import { formatAddress } from "utils";
import { checkTokensOwnership } from "interactions/contract";

const ChatsPage: NextPage = () => {
    const router = useRouter();
    const { address } = useAccount();

    const [NFTs, setNFTs] = useState<INFTVoting[]>();
    const [ownedTokenAddresses, setOwnedTokenAddresses] = useState([]);

    const [activeChat, setActiveChat] = useState(null);
    const [isChatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const query = router.query as IChatsQuery;
        const DAO: IDAOPageForm = JSON.parse(localStorage.getItem(query.url));
        const savedNfts: INFTVoting[] = JSON.parse(localStorage.getItem(query.url + " NFTs"));

        //todo remove


        if (DAO && savedNfts) {
            const chainId = DAO.chainId;

            setNFTs(savedNfts);
            checkTokensOwnership(
                savedNfts.map((NFT) => NFT.tokenAddress),
                address,
                chainId
            ).then(value => setOwnedTokenAddresses(value.tokens));

            checkTokensOwnership(
                savedNfts.map((NFT) => NFT.tokenAddress),
                address,
                chainId
            ).catch(console.error);
        }
    }, [router, address]);

    return (
        <div>
            <Layout className="layout-base max-w-full">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <BackButton />
                        <div className="flex justify-between items-center">
                            <h1 className="text-highlighter">Membership chats</h1>
                        </div>
                        <div className="container mx-auto rounded-lg border-t border-[#ccc]">
                            <div className="flex flex-row justify-between bg-white">
                                {/* User chat*/}

                                <div
                                    className="flex flex-col h-[calc(100vh-190px-165px)] w-2/5 overflow-y-auto border-r-2 border-gray pb-4">
                                    {NFTs &&
                                        NFTs.map((nft, index) => (
                                            <button
                                                className={
                                                    activeChat === nft.tokenAddress
                                                        ? "chat-button border-l-4 border-purple"
                                                        : "chat-button cursor-pointer disabled:cursor-not-allowed disabled:text-gray2"
                                                }
                                                key={index}
                                                type={"button"}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setActiveChat(() => nft.tokenAddress);
                                                    setChatOpen(true);
                                                }}
                                                disabled={!ownedTokenAddresses.includes(nft.tokenAddress)}
                                            >
                                                <div className="w-full">
                                                    <div className="text-lg font-semibold">{nft.title}</div>
                                                    {/*<span className="text-gray-500">DAO members</span>*/}
                                                </div>
                                                {!ownedTokenAddresses.includes(nft.tokenAddress) && <LockIcon />}
                                            </button>
                                        ))}
                                </div>

                                {/* Messanger IFRAME */}

                                {isChatOpen && NFTs ? (
                                    <div className="w-full flex flex-col justify-between h-[calc(100vh-190px-165px)]">
                                        <iframe
                                            src={`https://newconnection.click/${
                                                NFTs.map((NFT) => NFT.tokenAddress)[activeChat]
                                            }/${formatAddress(address)}`}
                                            width="100"
                                            height="100"
                                            className="w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full px-5 flex flex-col justify-between">
                                        <div className="flex flex-col mt-5 items-center content-center">
                                            <p>Join to one of DAOs and get NFT-membership to get access</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default ChatsPage;
