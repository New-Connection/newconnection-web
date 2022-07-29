import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Layout from "components/Layout";
import Moralis from "moralis";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useState } from "react";
import Image from "next/image";
import basicAvatar from "../../assets/basic_avatar.jpg";

const ProposalsPage: NextPage = () => {
    const [Proposals, setProposals] = useState<Moralis.Object<Moralis.Attributes>[]>();

    const { fetch } = useMoralisQuery("Proposal", (query) => query.notEqualTo("objectId", ""), [], {
        autoFetch: false,
    });

    const fetchDB = () => {
        fetch({
            onSuccess: (results) => {
                setProposals(() => results);
            },
            onError: (error) => {
                console.log("Error fetching db query" + error);
            },
        });
    };

    useEffect(() => {
        fetchDB();
    }, []);

    const ProposalCard = ({ name, description, id, isActive, votesFor, votesAgainst }) => {
        return (
            <Link href={`/proposals/${id}`}>
                <div
                    className={
                        // border-[#6858CB]
                        "flex justify-between w-full h-36 p-3 mt-3 rounded border-b-2 cursor-pointer"
                    }
                >
                    <div className={"flex gap-3 w-2/3 overflow-hidden"}>
                        <div className="w-2/3">
                            <p className={"text-lg uppercase font-semibold"}>{name}</p>
                            <p className={"text-gray-500 "}>{description}</p>
                        </div>
                    </div>

                    <div className="flex flex-col w-32 text-center text-xs">
                        {isActive ? (
                            <p
                                className={
                                    "font-semibold border-gray-200 bg-gray-200 mb-3 px-1 border-2 rounded-3xl"
                                }
                            >
                                Active voting now
                            </p>
                        ) : (
                            <p className={""}>No active voting</p>
                        )}
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex justify-between"}>
                                <div className={"text-gray-500"}>Votes For:</div>
                                <div>{votesFor}</div>
                            </div>
                            <div className={"flex justify-between"}>
                                <div className={"text-gray-500"}>Votes Against:</div>
                                <div>{votesAgainst}</div>
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
                        <h1 className={"text-highlighter"}>Proposals</h1>
                        <Link href="./">
                            <button className={"secondary-button h-10 "}>Add new proposal</button>
                        </Link>
                    </div>

                    <ul>
                        {Proposals &&
                            Proposals.map((proposal) => {
                                const id = proposal.get("id");
                                const name = proposal.get("name");
                                const description = proposal.get("description");

                                //TODO: write to db
                                const isActive = true;
                                const votesFor = 0;
                                const votesAgainst = 0;
                                return (
                                    <li key={id}>
                                        <ProposalCard
                                            name={name}
                                            description={description}
                                            id={id}
                                            isActive={isActive}
                                            votesFor={votesFor}
                                            votesAgainst={votesAgainst}
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

export default ProposalsPage;
