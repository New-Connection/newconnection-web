import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import toast from "react-hot-toast";
import Layout from "components/Layout/Layout";
import {
    Button,
    InputText,
    BlockchainSelector,
    InputTextArea,
    RadioSelector,
} from "components/Form";
import BackButton from "components/Button/backButton";
import { NFTCardMockup } from "components/Cards/NFTCard";
import { validateForm } from "utils/validate";
import { IAddNewMember } from "types/forms";
import {
    handleTextChangeAddNewMember,
    handleSelectorChangeNewMember,
    handleChangeBasicArray,
    handleChangeBasic,
    handleChangeBasicSimple,
    handleAddArray,
} from "utils/handlers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";

interface QueryUrlParams extends ParsedUrlQuery {
    daoName: string;
    nftAddress: string;
    governorAddress: string;
    blockchains: string[];
    tokenAddress: string[];
}

const AddNewMember: NextPage = () => {
    const [formData, setFormData] = useState<IAddNewMember>({
        daoName: "",
        walletAddress: "",
        daoAddress: "",
        tokenAddress: [],
        nftID: [0],
        blockchainSelected: "",
        blockchainEnabled: [],
        note: "",
    });
    const router = useRouter();

    useEffect(() => {
        const query = router.query as QueryUrlParams;
        console.log(query.tokenAddress);
        handleChangeBasic(query.governorAddress, setFormData, "daoAddress");
        handleChangeBasic(query.daoName, setFormData, "daoName");
        handleChangeBasicArray(query.blockchains, setFormData, "blockchainEnabled");
        handleAddArray(query.tokenAddress, setFormData, "tokenAddress");
        console.log(formData.tokenAddress);
    }, [router]);

    async function sendSignatureRequest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if (!validateForm(formData, ["note"])) {
            return;
        }

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
                            <div className="input-label">Choose voting tokens</div>
                        </label>
                        {formData ? (
                            <RadioSelector
                                name="tokenAddress"
                                labels={formData.tokenAddress}
                                handleChange={(event) =>
                                    handleTextChangeAddNewMember(event, setFormData)
                                }
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
