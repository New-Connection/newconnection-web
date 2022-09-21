import * as React from "react";
import type { NextPage } from "next";
import Layout from "components/Layout/Layout";
import Link from "next/link";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import basicAvatar from "assets/basic-dao-logo.png";
import { useMoralis } from "react-moralis";
import { IDAOPageForm } from "types/forms";
import { isIpfsAddress, loadImage } from "utils/ipfsUpload";
import { getTotalProposals } from "contract-interactions/viewGovernorContract";
import { useNetwork } from "wagmi";
import { isBlockchainSupported } from "utils/blockchains";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DAOsPage: NextPage = () => {
    const [DAOs, setDAOs] = useState<IDAOPageForm[]>();
    const firstUpdate = useRef(true);

    const { fetch: DAOsQuery } = useMoralisQuery(
        "DAO",
        (query) => query.notEqualTo("objectId", ""),
        [],
        {
            autoFetch: false,
        }
    );
    const { chain } = useNetwork();
    const { isInitialized } = useMoralis();

    //
    // FUNCTIONS
    // ----------------------------------------------------------------------

    const fetchDB = () => {
        if (isInitialized) {
            DAOsQuery({
                onSuccess: (results) => {
                    const daos = results.map((dao) => {
                        const url = dao.get("url");
                        const contractAddress = dao.get("contractAddress");
                        const name = dao.get("name");
                        const description = dao.get("description");
                        const chainId = dao.get("chainId");
                        let profileImage = dao.get("profileImage");
                        const isActive = true;
                        const totalProposals = 0;
                        const totalVotes = 0;

                        return {
                            url,
                            name,
                            contractAddress,
                            description,
                            profileImage,
                            totalVotes,
                            totalProposals,
                            isActive,
                            chainId,

                            //mock
                            blockchain: [],
                            goals: "",
                            coverImage: null,
                            tokenAddress: [""],
                            votingPeriod: "",
                            type: [],
                            quorumPercentage: "",
                        } as IDAOPageForm;
                    });

                    setDAOs(() => daos);
                },
                onError: (error) => {
                    console.log("Error fetching db query" + error);
                },
            });
        }
    };

    const fetchLargeData = async () => {
        const newDAOs = await Promise.all(
            DAOs!.map(async (dao) => {
                return {
                    ...dao,
                    totalProposals: await getTotalProposals(dao.contractAddress!, dao.chainId!),
                    profileImage: await loadImage(dao.profileImage),
                } as IDAOPageForm;
            })
        );
        setDAOs(() => newDAOs);
    };

    //
    // EFFECTS
    // ----------------------------------------------------------------------

    // if we use isInitialized we call fetch only once when reload page or move to new page
    useEffect(() => {
        fetchDB();
    }, [isInitialized]);

    useIsomorphicLayoutEffect(() => {
        if (DAOs && firstUpdate.current) {
            firstUpdate.current = false;
            fetchLargeData();
        }
    });

    //
    // CUSTOM COMPONENTS
    // ----------------------------------------------------------------------

    const DAOCard = ({ name, description, profileImage, address, isActive, proposals }) => {
        return (
            <Link href={`/daos/${address}`}>
                <div
                    className={
                        "flex justify-between w-full lg:h-40 h-50 p-3 border-b-2 border-gray cursor-pointer active:bg-gray"
                    }
                >
                    <div className="flex gap-10 w-10/12">
                        <div className="w-28 h-28">
                            <Image
                                width={"150"}
                                height={"150"}
                                layout={"responsive"}
                                priority={true}
                                src={!isIpfsAddress(profileImage) ? profileImage : basicAvatar}
                                className="rounded-2xl"
                            />
                        </div>
                        <div className="w-5/6 grid grid-cols-1 content-between">
                            <div className="w-full">
                                <p className="lg:text-lg text-base uppercase font-semibold cursor-pointer">
                                    {name}
                                </p>
                                <div className="text-gray-500 line-clamp-2">{description}</div>
                            </div>

                            <p
                                className={
                                    "text-gray2 text-sm cursor-pointer mb-1.5 hover:text-gray3 active:text-gray2"
                                }
                            >
                                View more
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:w-32 w-24 text-center text-xs">
                        {isActive ? (
                            <span className="badge-active">Active voting now</span>
                        ) : (
                            <span className="badge-active text-black">No active voting</span>
                        )}
                        <div className={"flex flex-col gap-3 mt-4"}>
                            <div className={"flex justify-between"}>
                                <p className={"text-gray2"}>Proposals:</p>
                                <p>{proposals || 0}</p>
                            </div>
                            {/* <div className={"flex justify-between"}>
                                <p className={"text-gray2"}>Votes:</p>
                                <p className="text-black">{votes || 0}</p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-highlighter">DAOs</h1>
                            <Link href="./create-new-dao">
                                <button
                                    className="secondary-button h-10"
                                    disabled={!isBlockchainSupported(chain)}
                                >
                                    Create DAO
                                </button>
                            </Link>
                        </div>

                        <ul>
                            {DAOs &&
                                DAOs.map((dao, index) => {
                                    return (
                                        <DAOCard
                                            key={index}
                                            name={dao.name}
                                            description={dao.description}
                                            address={dao.url}
                                            profileImage={dao.profileImage}
                                            isActive={dao.isActive}
                                            proposals={dao.totalProposals}
                                        />
                                    );
                                })}
                        </ul>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default DAOsPage;
