import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSigner } from "wagmi";

import Layout from "components/Layout/Layout";
import { handleTextChange, handleCheckboxChange, handleChangeBasic } from "utils/handlers";
import { CheckboxGroup, InputText, Button, InputTextArea } from "components/Form";
import { ICreateProposal } from "types/forms";
import BackButton from "components/Button/backButton";
import { useDialogState } from "ariakit";
import { validateForm } from "utils/validate";
import { CHAINS } from "utils/blockchains";
import { createProposal } from "../contract-interactions/stateGovernorContract";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Signer } from "ethers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "../database/interactions";
import { StepperDialog } from "../components/Dialog";

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

    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleReset = () => {
        setActiveStep(0);
    };

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
        handleReset();
        confirmDialog.toggle();

        // TODO: Create Proporsal
        let proposalId;
        try {
            proposalId = await createProposal(
                formData.governorAddress,
                signer_data as Signer,
                formData.name
            );
            handleNext();
            handleNext();
            handleChangeBasic(proposalId, setFormData, "proposalId");
            handleNext();
        } catch (error) {
            console.log(error);
            confirmDialog.toggle();
            toast.error("Please approve transaction to create DAO");
            return;
        }

        try {
            const chainId = await signer_data.getChainId();
            handleChangeBasic(chainId.toString(), setFormData, "chainId");

            const moralisProposal = getMoralisInstance(MoralisClassEnum.PROPOSAL);
            setFieldsIntoMoralisInstance(moralisProposal, formData);
            moralisProposal.set("proposalId", proposalId);
            moralisProposal.set("chainId", chainId);
            await saveMoralisInstance(moralisProposal);
        } catch (error) {
            confirmDialog.toggle();
            toast.error("Сouldn't save your DAO. Please try again");
            return;
        }
    }

    const FileAndLinkForm = () => {
        return (
            <div className="flex justify-between gap-10 ">
                {/* TODO: New to change it for drag and drop */}
                <InputText
                    label="File (optional)"
                    name="file"
                    placeholder="Attached file"
                    handleChange={(event) => handleTextChange(event, setFormData)}
                    className="w-1/2"
                    disabled={true}
                />
                <InputText
                    label="Link Forum (optional)"
                    name="linkForum"
                    placeholder="Link to discussion forum"
                    handleChange={(event) => handleTextChange(event, setFormData)}
                    className="w-1/2"
                    disabled
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
                        {/* <FileAndLinkForm /> */}

                        <CheckboxGroup
                            label="Proposal Blockchain"
                            description="You can choose one or more blockchains"
                            values={CHAINS}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
                        />
                        <Button className="mt-5">Create Proporsal</Button>
                    </form>
                </section>
                <StepperDialog dialog={confirmDialog} className="dialog" activeStep={activeStep}>
                    <p>Proposal created successful!</p>
                    <p>Proposal Id: {formData.proposalId}</p>
                    <Link href={`/daos/${formData.governorAddress}`}>
                        <button
                            className="form-submit-button"
                            onClick={() => {
                                confirmDialog.toggle();
                            }}
                        >
                            Back to DAO
                        </button>
                    </Link>
                </StepperDialog>
            </Layout>
        </div>
    );
};

export default CreateProposal;
