import { NextPage } from "next";
import Layout, { BackButton, CopyTextButton, DAOCard } from "components";
import * as React from "react";
import { useState } from "react";
import { IDAOPageForm, IQuery } from "types";
import { useEffectOnce, useReadLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";
import Image from "next/image";
import ASSETS from "assets";

const HomeDaos: NextPage<IQuery> = () => {
    const { address, isConnected } = useAccount();
    const [userAddress, setUserAddress] = useState("");

    const [homeDaos, setHomeDaos] = useState<IDAOPageForm[]>();

    const storageHomeDaos = useReadLocalStorage<IDAOPageForm[]>("homeDaos");

    useEffectOnce(() => {
        isConnected && setUserAddress(address);

        setHomeDaos(storageHomeDaos);
    });

    return (
        homeDaos && (
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
                            <h1 className="text-highlighter mb-8">Member DAOs</h1>
                            <ul className={"flex flex-col gap-6"}>
                                {homeDaos &&
                                    homeDaos.map((dao, index) => (
                                        <DAOCard
                                            key={index}
                                            daoObject={dao}
                                            lastElement={!(index !== homeDaos.length - 1)}
                                        />
                                    ))}
                            </ul>
                        </div>
                    </section>
                </Layout>
            </div>
        )
    );
};

export default HomeDaos;
