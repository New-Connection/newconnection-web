import React, { useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSigner } from "wagmi";

import Layout from "components/Layout/Layout";
import { handleTextChange, handleCheckboxChange, handleDatePicker } from "utils/handlers";
import { CheckboxGroup, InputText, SubmitButton, InputTextArea } from "components/Form";
import { ICreateProposal } from "types/forms";
import BackButton from "components/Button/BackButton";

const BlockchainValues = [
    "Arbitrum",
    "Aurora",
    "Avalanche",
    "Binance",
    "Ethereum",
    "Fantom",
    "Optimism",
    "Polygon",
];

const CreateProporsal: NextPage = () => {
    const [formData, setFormData] = useState<ICreateProposal>({
        name: "",
        shortDescription: "",
        description: "",
        options: [],
        blockchain: [],
    });
    const { data: signer_data } = useSigner();

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

    async function createProporsalContract(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        // TODO: Create Proporsal
        try {
        } catch (error) {
            toast.error("Please approve transaction to create DAO");
            return;
        }
    }

    return (
        <div>
            <Layout className="app-section mx-auto mt-32 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <BackButton linkToBack="/create-dao" />

                <section className="relative w-full">
                    <form
                        className="mx-auto flex max-w-4xl flex-col gap-4"
                        onSubmit={createProporsalContract}
                    >
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
                            label={"Proposal Blockchain"}
                            description={"You can choose one or more blockchains"}
                            values={BlockchainValues}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
                        />
                        <SubmitButton className="mt-5">Create Proporsal</SubmitButton>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default CreateProporsal;
