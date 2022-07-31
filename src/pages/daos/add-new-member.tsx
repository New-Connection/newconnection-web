import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import Layout from "components/Layout/Layout";
import { SubmitButton, InputText, BlockchainSelector, InputTextArea } from "components/Form";
import BackButton from "components/Button/backButton";
import NFTCardMockup from "components/Cards/NFTCard";

import { IAddNewMember } from "types/forms";
import {
    handleTextChangeAddNewMember,
    handleSelectorChangeNewMember,
    handleChangeBasicNewMember,
} from "utils/handlers";

interface QueryUrlParams extends ParsedUrlQuery {
    daoName: string;
    nftAddress: string;
}

const AddNewMember: NextPage = () => {
    const [formData, setFormData] = useState<IAddNewMember>({
        walletAddress: "",
        nftID: "",
        blockchainSelected: "",
        note: "",
        daoName: "",
    });

    const router = useRouter();
    useEffect(() => {
        const query = router.query as QueryUrlParams;
        handleChangeBasicNewMember(query.nftAddress, setFormData, "nftID");
        handleChangeBasicNewMember(query.daoName, setFormData, "daoName");
        console.log(`governorAddress from query: ${query.daoName}`);
    }, []);
    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <BackButton />
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <h1 className="text-highlighter">Become a member of</h1>
                        <h1 className="text-highlighter mt-0 text-purple">{formData.daoName}</h1>
                        <InputText
                            label="Wallet"
                            name="walletAddress"
                            placeholder="Your wallet adress"
                            labelTitle="Your wallet adress"
                            maxLength={42}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <label>
                            <div className="input-label">Membership NFT</div>
                        </label>
                        <NFTCardMockup className="border-purple border-4 rounded-xl" />

                        <BlockchainSelector
                            name="blockchainSelected"
                            label="Choose your priopity blockchain"
                            handleChange={(event) => {
                                return handleSelectorChangeNewMember(
                                    event,
                                    setFormData,
                                    "blockchainSelected"
                                );
                            }}
                        />
                        <InputTextArea
                            name="note"
                            label="Note (optional)"
                            placeholder="You can add note and type something for DAO’s admin"
                            maxLength={2000}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <SubmitButton className="mt-5 w-full">Send a request</SubmitButton>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default AddNewMember;
