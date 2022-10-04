import React from "react";
import { NextPage } from "next";
import Link from "next/link";

import Layout from "components/Layout/Layout";
import { Button } from "components/Form";
import { BackButton } from "components/Button/";
import { isBlockchainSupported } from "utils/blockchains";
import { useNetwork } from "wagmi";

interface ICard {
    title: string;
    subtitle: string;
    buttonTitle: string;
    linkToPage: string;
    isDisabled?: boolean;
}

const CreateNewDAO: NextPage = () => {
    const { chain } = useNetwork();

    const Card = ({ title, subtitle, buttonTitle, linkToPage, isDisabled = false }: ICard) => {
        return (
            <div className="w-full border-2 border-[#F2F4F4] rounded-lg pb-6 px-4">
                <p className="input-label font-medium text-lg">{title}</p>
                <p className="pb-6">{subtitle}</p>
                <Link href={{ pathname: linkToPage }}>
                    <a>
                        <Button type={"button"} className="mt-5 mb-5 py-4 border-2 w-full" disabled={isDisabled}>
                            {buttonTitle}
                        </Button>
                    </a>
                </Link>
            </div>
        );
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <BackButton />
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
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
                                linkToPage="/create-nft"
                                isDisabled={true}
                            />

                            <Card
                                title="New NFT collection"
                                subtitle="If you don't have any NFT collections created, you can mint them here"
                                buttonTitle="Mint NFT"
                                linkToPage="/create-nft"
                                isDisabled={!isBlockchainSupported(chain)}
                            />
                        </div>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default CreateNewDAO;
