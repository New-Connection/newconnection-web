import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSigner } from "wagmi";

import Layout from "components/Layout/Layout";
import {
    handleTextChange,
    handleCheckboxChange,
    handleDatePicker,
    handleChangeBasic,
} from "utils/handlers";
import { CheckboxGroup, InputText, SubmitButton, InputTextArea } from "components/Form";
import { ICreateProposal } from "types/forms";
import BackButton from "components/Button/backButton";
import { useDialogState } from "ariakit";
import { validateForm } from "utils/validate";
import { CHAINS } from "utils/blockchains";
import { createProposal } from "../contract-interactions/stateGovernorContract";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { mintClick } from "../contract-interactions/useMintFunctions";
import { Signer } from "ethers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "../database/interactions";
import { BeatLoader } from "react-spinners";
import { LoadingDialog } from "../components/Dialog";

interface QueryUrlParams extends ParsedUrlQuery {
    governorAddress: string;
}

const CreateProposal: NextPage = () => {
    const [formData, setFormData] = useState<ICreateProposal>({
        governorAddress: "",
        name: "",
        shortDescription: "",
        description: "",
        options: [],
        blockchain: [],
    });
    const router = useRouter();

    const { data: signer_data } = useSigner();

    const [confirmFromBlockchain, setConfirmFromBlockchain] = useState(false);
    const confirmDialog = useDialogState();

    useEffect(() => {
        const query = router.query as QueryUrlParams;

        handleChangeBasic(query.governorAddress, setFormData, "governorAddress");

        console.log(`governorAddress from query: ${query.governorAddress}`);
    }, []);

    async function createProposalContract(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log();
        // await mintClick("0x6DF6474553A8B1cDe0Cc6Bc4c72d814CC2565B8F", signer_data as Signer);
        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData, ["description", "options"])) {
            return;
        }

        confirmDialog.toggle();

        // TODO: Create Proporsal
        let proposalId;
        try {
            proposalId = await createProposal(
                formData.governorAddress,
                signer_data as Signer,
                formData.name
            );

            handleChangeBasic(proposalId, setFormData, "proposalId");

            setConfirmFromBlockchain(true);
        } catch (error) {
            console.log(error);
            confirmDialog.toggle();
            setConfirmFromBlockchain(false);
            toast.error("Please approve transaction to create DAO");
            return;
        }

        try {
            const chainId = await signer_data.getChainId();
            handleChangeBasic(chainId, setFormData, "chainId");

            const moralisProposal = getMoralisInstance(MoralisClassEnum.PROPOSAL);
            setFieldsIntoMoralisInstance(moralisProposal, formData);
            moralisProposal.set("proposalId", proposalId);
            moralisProposal.set("chainId", chainId);
            await saveMoralisInstance(moralisProposal);
        } catch (error) {
            confirmDialog.toggle();
            setConfirmFromBlockchain(false);
            toast.error("Сouldn't save your DAO. Please try again");
            return;
        }
    }

    const FileAndLinkForm = () => {
        return (
            <div className="flex justify-between gap-10">
                {/* TODO: New to change it for drag and drop */}
                <InputText
                    label="File (optional)"
                    name="file"
                    placeholder="Attached file"
                    handleChange={(event) => handleTextChange(event, setFormData)}
                    className="w-1/2"
                />
                <InputText
                    label="Link Forum (optional)"
                    name="linkForum"
                    placeholder="Link to discussion forum"
                    handleChange={(event) => handleTextChange(event, setFormData)}
                    className="w-1/2"
                />
            </div>
        );
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form
                        className="mx-auto flex max-w-4xl flex-col gap-4"
                        onSubmit={createProposalContract}
                    >
                        <BackButton />

                        <h1 className="text-highlighter">New Proporsal</h1>
                        <InputText
                            label="Title"
                            name="name"
                            placeholder="Title of purpose"
                            handleChange={(event) => {
                                handleTextChange(event, setFormData);
                            }}
                        />
                        <InputTextArea
                            label="Short Description"
                            name="shortDescription"
                            placeholder="A short description of your proporsal"
                            maxLength={250}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputTextArea
                            label="Description (optional)"
                            name="description"
                            placeholder="A full description of your proporsal"
                            maxLength={3000}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <FileAndLinkForm />

                        <CheckboxGroup
                            label="Proposal Blockchain"
                            description="You can choose one or more blockchains"
                            values={CHAINS}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
                        />
                        <SubmitButton className="mt-5">Create Proporsal</SubmitButton>
                    </form>
                </section>
                <LoadingDialog
                    dialog={confirmDialog}
                    title="Loading into Blockchain"
                    className="dialog"
                >
                    {
                        <div>
                            {confirmFromBlockchain ? (
                                <>
                                    <p>Proposal created successful!</p>
                                    <p>Proposal Id: {formData.proposalId}</p>
                                    <Link href={`/daos/${formData.governorAddress}`}>
                                        <button
                                            className="form-submit-button"
                                            onClick={() => {
                                                confirmDialog.toggle();
                                            }}
                                        >
                                            View DAO
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <p>Please confirm transaction in wallet</p>
                                    <BeatLoader />
                                </>
                            )}
                        </div>
                    }
                </LoadingDialog>
            </Layout>
        </div>
    );
};

export default CreateProposal;