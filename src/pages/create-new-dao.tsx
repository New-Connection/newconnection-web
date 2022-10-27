import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";

import Layout, { BackButton, Button } from "components";
import { isBlockchainSupported } from "interactions/contract";
import { useNetwork } from "wagmi";
import classNames from "classnames";

interface ICard {
    title: string;
    subtitle: string;
    buttonTitle: string;
    linkToPage: string;
    isDisabled?: boolean;
}

const CreateNewDAO: NextPage = () => {
    const { chain } = useNetwork();
    const [isChainSupported, setIsChainSupported] = useState(false);

    useEffect(() => {
        setIsChainSupported(() => isBlockchainSupported(chain));
    }, [chain]);

    const Card = ({ title, subtitle, buttonTitle, linkToPage, isDisabled = false }: ICard) => {
        return (
            <div className="grid grid-flow-row border-2 border-base-200 rounded-lg py-4 px-4 gap-4">
                <p className="input-label font-medium text-lg">{title}</p>
                <p className="pb-6">{subtitle}</p>
                <Link href={{ pathname: linkToPage }}>
                    <Button
                        type={"button"}
                        className={classNames("w-full", isDisabled ? "cursor-not-allowed" : "cursor-pointer")}
                        disabled={isDisabled}
                    >
                        <a>{buttonTitle}</a>
                    </Button>
                </Link>
            </div>
        );
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <BackButton />
                        <h1 className="text-highlighter">Create new DAO</h1>
                        <p className="input-label text-lg font-medium">NFT smart contract</p>
                        <p className="pb-4">
                            To create your DAO, you first need to add a created NFT collection or mint a new one in our
                            system
                        </p>
                        <div className="lg:flex gap-10">
                            <Card
                                title="Existing NFT collection (Comming Soon)"
                                subtitle="Add NFT smart contract if you have an existing collection"
                                buttonTitle="Add a created NFT"
                                linkToPage="./create-nft"
                                isDisabled={true}
                            />

                            <Card
                                title="New NFT collection"
                                subtitle="If you don't have any NFT collections created, you can mint them here"
                                buttonTitle="Mint NFT"
                                linkToPage="./create-nft"
                                isDisabled={!isChainSupported}
                            />
                        </div>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default CreateNewDAO;
