import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Head from "next/head";
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useState } from "react";
import Moralis from "moralis";
import Image from "next/image";
import basicAvatar from "assets/basic_avatar.jpg";

const DAOsPage: NextPage = () => {
    const [DAOs, setDAOs] = useState<Moralis.Object<Moralis.Attributes>[]>();

    const { fetch } = useMoralisQuery("DAO", (query) => query.notEqualTo("objectId", ""), [], {
        autoFetch: false,
    });

    const fetchDB = () => {
        fetch({
            onSuccess: (results) => {
                setDAOs(() => results);
            },
            onError: (error) => {
                console.log("Error fetching db query" + error);
            },
        });
    };

    useEffect(() => {
        fetchDB();
    }, []);

    const DAOCard = ({ name, description, profileImage, address, isActive, proposals, votes }) => {
        return (
            <Link href={`/daos/${address}`}>
                <div
                    className={
                        "flex justify-between w-full h-36 p-3 mt-3 rounded border-b-2 cursor-pointer"
                    }
                >
                    <div className={"flex gap-10 w-2/3 overflow-hidden"}>
                        <div className={"w-28 h-28"}>
                            <Image className={"w-28 h-28 rounded-2xl"} src={basicAvatar} />
                        </div>
                        <div className="w-2/3 ">
                            <p className={"text-lg uppercase font-semibold"}>{name}</p>
                            <p className={"text-gray-500 mt-2"}>{description}</p>
                            <Link href={`/daos/${address}`}>
                                <p className={"text-[#AAAAAA] text-sm"}>View more</p>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col w-32 text-center text-xs">
                        {isActive ? (
                            <p
                                className={
                                    "font-medium text-[#7343DF] border-none bg-[#F6F6F6] mb-3 px-2 border-2 h-8 text-center rounded-3xl pt-2.5"
                                }
                            >
                                Active voting now
                            </p>
                        ) : (
                            <p
                                className={
                                    "font-medium text-[#1B1A1D] border-none bg-[#F6F6F6] mb-3 px-2 border-2 h-8 text-center rounded-3xl pt-2.5"
                                }
                            >
                                No active voting
                            </p>
                        )}
                        <div className={"flex flex-col gap-3 mt-4"}>
                            <div className={"flex justify-between"}>
                                <div className={"text-gray-500"}>Proposals:</div>
                                <div>{proposals}</div>
                            </div>
                            <div className={"flex justify-between"}>
                                <div className={"text-gray-500"}>Votes:</div>
                                <div>{votes}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div>
            <Head>
                <title>DAOs</title>
            </Head>
            <Layout className="app-section mx-auto mt-32 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <div className={"flex justify-between items-center"}>
                        <h1 className={"text-highlighter"}>DAOs</h1>
                        <Link href="./create-new-dao">
                            <button className={"secondary-button h-10 "}>Create DAO</button>
                        </Link>
                    </div>

                    <ul>
                        {DAOs &&
                            DAOs.map((dao) => {
                                const address = dao.get("contractAddress");
                                const name = dao.get("name");
                                const description = dao.get("description");
                                const profileImage = dao.get("profileImage");

                                //todo: write to db
                                const isActive = true;
                                const proposals = 0;
                                const votes = 0;
                                return (
                                    <li key={address}>
                                        <DAOCard
                                            name={name}
                                            description={description}
                                            address={address}
                                            profileImage={profileImage}
                                            isActive={isActive}
                                            proposals={proposals}
                                            votes={votes}
                                        />
                                    </li>
                                );
                            })}
                    </ul>
                </section>
            </Layout>
        </div>
    );
};

export default DAOsPage;
