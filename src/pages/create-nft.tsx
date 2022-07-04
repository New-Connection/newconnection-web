import React, { useState } from "react";
import {
    InputAmount,
    InputText,
    SubmitButton,
    BlockchainSelector,
    TypeSelector,
    DragAndDropImage,
} from "components/Form";
import toast from "react-hot-toast";
import { CreateNFTContract } from "contract-interactions/useCreateNFTContract";
import { Signer, BigNumber } from "ethers";
import { useSigner } from "wagmi";
import { NextPage } from "next";
import Head from "next/head";
import Layout from "components/Layout/Layout";
import { CreateNFT } from "types/forms";
import { handleTextChange, handleImageChange, handleSelectorChange } from "utils/handlers";
import { validateForm } from "utils/validate";

// TODO:
// Check ipfs approver

const CreateNFT: NextPage = () => {
    const [formData, setFormData] = useState<CreateNFT>({
        name: "",
        description: "",
        image: "",
        count: "",
        price: "",
        blockchain: "Ethereum",
        role: "Member",
        collectionName: "",
        twitterURL: "",
        discordURL: "",
    });

    const { data: signer_data } = useSigner();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData, ["collectionName", "twitterURL", "discordURL"])) {
            return;
        }

        const factory = CreateNFTContract(signer_data as Signer);
        const contract = await factory.deploy(
            formData.name,
            formData.description,
            BigNumber.from(formData.count)
        );
        await contract.deployed();
        toast.success(`Contract Address: ${contract.address}`);
        console.log(`Deployment successful! Contract Address: ${contract.address}`);
    }

    return (
        <div>
            <Head>
                <title>NC: Create NFT</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
                        <h1 className="font-exo my-2 text-2xl font-semibold text-[#3D3D3D]">
                            Create NFT
                        </h1>
                        <InputText
                            label="Name"
                            name="name"
                            placeholder="NFT Name"
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputText
                            label="Description"
                            className="pt-1.5 pb-14"
                            name="description"
                            placeholder="A short descption about NFT collection(Max. 250 words)"
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <DragAndDropImage
                            label="Image"
                            name="image"
                            handleChange={(file) => handleImageChange(file, setFormData, "image")}
                        />
                        <div className="flex justify-between">
                            <InputAmount
                                label={"Number of NFT"}
                                name="count"
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                            <InputAmount
                                label={"Price"}
                                placeholder="0 (Max. 0)"
                                name="price"
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                            <BlockchainSelector
                                label={"Type of blockchain"}
                                name={"blockchain"}
                                handlerChange={(event) =>
                                    handleSelectorChange(event, setFormData, "blockchain")
                                }
                            />
                        </div>
                        <div className="flex justify-between">
                            <TypeSelector
                                label={"Role"}
                                name="role"
                                handlerChange={(event) =>
                                    handleSelectorChange(event, setFormData, "role")
                                }
                            />
                            <InputText
                                label={"Collection (optional)"}
                                name="collectionName"
                                placeholder="Collection name"
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                        </div>
                        <div className="flex space-x-4">
                            <InputText
                                label={"Twitter (optional)"}
                                name="twitterURL"
                                placeholder="Enter your twitter handler"
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                            <InputText
                                label={"Discord (optional)"}
                                name="discordURL"
                                placeholder="Enter your discord server"
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                        </div>
                        <SubmitButton className="mt-5">
                            {/* <BeatLoader size={6} color="white" /> */}
                            Create Contract
                        </SubmitButton>
                    </form>
                </section>
            </Layout>
        </div>
    );
};

export default CreateNFT;
