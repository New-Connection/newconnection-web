import React from "react";
import { NextPage } from "next";
import Link from "next/link";

import Layout from "components/Layout/Layout";
import { SubmitButton } from "components/Form";

const CreateNewDAO: NextPage = () => {
    interface ICard {
        title: string;
        subtitle: string;
        buttonTitle: string;
        linkToPage: string;
        isDisabled?: boolean;
    }

    const Card = ({ title, subtitle, buttonTitle, linkToPage, isDisabled = false }: ICard) => {
        return (
            <div className="w-full border-2 border-[#F2F4F4] rounded-lg pb-6 px-4">
                <p className="input-label font-medium text-lg">{title}</p>
                <p className="pb-6">{subtitle}</p>
                <Link href={linkToPage}>
                    <SubmitButton className="mt-5 mb-5 py-4 border-2" disabled={isDisabled}>
                        {buttonTitle}
                    </SubmitButton>
                </Link>
            </div>
        );
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <h1 className="text-highlighter">Create new DAO</h1>
                        <p className="input-label text-lg font-medium">NFT smart contract</p>
                        <p className="pb-4">
                            To create your DAO, you first need to add a created NFT collection or
                            mint a new one in our system
                        </p>
                        <div className="flex gap-16">
                            <Card
                                title="Existing NFT collection (Comming Soon)"
                                subtitle="Add NFT smart contract if you have an existing collection"
                                buttonTitle="Add a created NFT"
                                linkToPage="create-nft"
                                isDisabled={true}
                            />

                            <Card
                                title="New NFT collection"
                                subtitle="If you don't have any NFT collections created, you can mint them here"
                                buttonTitle="Mint NFT"
                                linkToPage="create-nft"
                            />
                        </div>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default CreateNewDAO;
