import React, { useState, useEffect } from "react";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import toast from "react-hot-toast";

import Layout from "components/Layout/Layout";
import { Button, InputText, BlockchainSelector, InputTextArea } from "components/Form";
import BackButton from "components/Button/backButton";
import { NFTCardMockup } from "components/Cards/NFTCard";
import { validateForm } from "utils/validate";
import { IAddNewMember } from "types/forms";
import {
    handleTextChangeAddNewMember,
    handleSelectorChangeNewMember,
    handleChangeBasicNewMember,
    handleChangeBasicArray,
} from "utils/handlers";

import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";

interface QueryUrlParams extends ParsedUrlQuery, NodeJS.Dict<string | string[]> {
    daoName: string;
    nftAddress: string;
    daoAddress: string;
    blockchains: string[];
}

export const getServerSideProps = async (context: NextPageContext) => {
    const { query } = context;
    return { props: { query } };
};

const AddNewMember: NextPage = () => {
    const [formData, setFormData] = useState<IAddNewMember>({
        daoName: "",
        walletAddress: "",
        daoAddress: "",
        nftID: [0],
        blockchainSelected: "",
        blockchainEnabled: [],
        note: "",
    });
    const router = useRouter();

    useEffect(() => {
        const query = router.query as QueryUrlParams;
        console.log("query:" + router.query.daoAddress);
        handleChangeBasicNewMember(query.daoAddress, setFormData, "daoAddress");
        handleChangeBasicNewMember(query.daoName, setFormData, "daoName");
        handleChangeBasicArray(query.blockchains, setFormData, "blockchainEnabled");
        // console.log(`DAO Address from query: ${formData.blockchainEnabled}`);
        // console.log(`DAO Address from query: ${formData.blockchainEnabled[1]}`);
    }, []);

    // if
    // let disabledBlockchains = CHAINS.filter((x) => !formData.blockchainEnabled.includes(x));
    // console.log("disabledBlockchain",formData.blockchainEnabled);

    async function sendSignatureRequest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        // TODO: Need to create Signature Request
        // https://wagmi.sh/examples/sign-in-with-ethereum
        // if (!signer_data) {
        //     toast.error("Please connect wallet");
        //     return;
        // }
        if (!validateForm(formData, ["note"])) {
            return;
        }
        console.log(formData);
        try {
            //const toastID = toast.loading("Please wait...", { position: "bottom-center" });
            const moralisProposal = getMoralisInstance(MoralisClassEnum.WHITELIST);
            setFieldsIntoMoralisInstance(moralisProposal, formData);
            await saveMoralisInstance(moralisProposal);
            //toast.dismiss(toastID);
            toast.success("Wallet was saved", {
                duration: 4000,
                className: "bg-red",
                position: "bottom-center",
            });
            form.reset();
        } catch (error) {
            toast.error("Couldn't save your . Please try again");
            return;
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <BackButton />
                    <form
                        className="mx-auto flex max-w-4xl flex-col gap-4"
                        onSubmit={sendSignatureRequest}
                    >
                        <h1 className="text-highlighter">Become a member of</h1>
                        <h1 className="text-highlighter mt-0 text-purple">{formData.daoName}</h1>
                        <InputText
                            label="Wallet"
                            name="walletAddress"
                            placeholder="Your wallet address"
                            labelTitle="Your wallet address"
                            maxLength={42}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <label>
                            <div className="input-label">Membership NFT</div>
                        </label>
                        <NFTCardMockup className="border-purple border-4 rounded-xl" />

                        {formData.blockchainEnabled.length > 0 ? (
                            <BlockchainSelector
                                name="blockchainSelected"
                                label="Choose your priority blockchain"
                                enabledValues={formData.blockchainEnabled}
                                handleChange={(event) => {
                                    return handleSelectorChangeNewMember(
                                        event,
                                        setFormData,
                                        "blockchainSelected"
                                    );
                                }}
                            />
                        ) : (
                            <></>
                        )}
                        <InputTextArea
                            name="note"
                            label="Note (optional)"
                            placeholder="You can add note and type something for DAO’s admin"
                            maxLength={2000}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <Button className="mt-5 w-full">Send a request</Button>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default AddNewMember;
