import React, { useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import Layout from "components/Layout/Layout";
import { handleTextChange, handleCheckboxChange, handleDatePicker } from "utils/handlers";
import {
    CheckboxGroup,
    DragAndDropImage,
    InputText,
    SubmitButton,
    InputTextArea,
    ComponentDateTimePicker,
} from "components/Form";
import { ICreateProposal } from "types/forms";
import BackButton from "assets/elements/BackButton.png";

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
        // startDate: new Date.now(),
        // endData:
    });

    const TitleForm = () => {
        return (
            <InputText
                label={"Title"}
                name="name"
                placeholder="Title of purpose"
                handleChange={(event) => {
                    handleTextChange(event, setFormData);
                }}
            />
        );
    };

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

    // TODO Change to text into date
    const DateForm = () => {
        return (
            <>
                <p>Voting Time</p>
                <div className="flex justify-between gap-10">
                    {/* TODO: New to change it for drag and drop */}
                    <InputText
                        label="Start Date"
                        name="startDate"
                        placeholder="Start Date and Time"
                        handleChange={(event) => handleTextChange(event, setFormData)}
                        className="w-1/2"
                    />
                    <InputText
                        label="End Date"
                        name="endDate"
                        placeholder="End Date and Time"
                        handleChange={(event) => handleTextChange(event, setFormData)}
                        className="w-1/2"
                    />
                </div>
            </>
        );
    };

    // const OptionsForm = (nameLabel: string) => {
    //     return (
    //         <InputText
    //             label={nameLabel}
    //             name="options"
    //             placeholder="Title of purpose"
    //             handleChange={(event) => {
    //                 // TODO: Need to create handler for array
    //                 // handleTextChange(event, setFormData);
    //             }}
    //         />
    //     );
    // };

    const DatePicker = () => {};

    return (
        <div>
            <Layout className="app-section mx-auto mt-32 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4">
                        <Link href="/create-dao">
                            <button className="flex gap-1">
                                <Image src={BackButton} width={40} height={20} />
                                <p className="text-xl">Back</p>
                            </button>
                        </Link>

                        <h1 className="text-highlighter">New Proporsal</h1>
                        <TitleForm />
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

                        <div className="flex w-full gap-10">
                            <ComponentDateTimePicker label="Start Date" className="w-1/2" />
                            <ComponentDateTimePicker label="End Date" className="w-1/2" />
                        </div>

                        <CheckboxGroup
                            label={"Proposal Blockchain"}
                            description={"You can choose one or more blockchains"}
                            values={BlockchainValues}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
                        />
                        <DateForm />
                        <SubmitButton className="mt-5">Create Proporsal</SubmitButton>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default CreateProporsal;
