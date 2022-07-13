import React, { useState } from "react";
import {
    BlockchainSelector,
    DragAndDropImage,
    InputAmount,
    InputText,
    SubmitButton,
    TypeSelector,
} from "components/Form";
import toast from "react-hot-toast";
import { Signer } from "ethers";
import { useSigner } from "wagmi";
import { NextPage } from "next";
import Head from "next/head";
import Layout from "components/Layout/Layout";
import { CreateNFT } from "types/forms";
import {
    handleChangeBasic,
    handleImageChange,
    handleSelectorChange,
    handleTextChange,
} from "utils/handlers";
import { validateForm } from "utils/validate";
import { useDialogState } from "ariakit";
import { LoadingDialog } from "../components/Dialog";
import { BeatLoader } from "react-spinners";
import { deployNFTContract } from "../contract-interactions/useDeployNFTContract";

import { ipfsFullPath, storeNFT } from "utils/ipfsUpload";
import { mintClick } from "contract-interactions/useMintFunctions";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";

const CreateNFT: NextPage = () => {
    const [formData, setFormData] = useState<CreateNFT>({
        name: "",
        description: "",
        ipfsAddress: "",
        image: null,
        count: "",
        price: "",
        blockchain: "Ethereum",
        role: "Member",
        collectionName: "",
        twitterURL: "",
        discordURL: "",
    });

    const { data: signer_data } = useSigner();
    const [error, setError] = useState(false);
    const [confirmFromBlockchain, setConfirmFromBlockchain] = useState(false);
    const confirmDialog = useDialogState();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (
            !validateForm(formData, [
                "collectionName",
                "twitterURL",
                "discordURL",
                "ipfsAddress",
                "contractAddress",
            ])
        ) {
            return;
        }

        confirmDialog.toggle();
        const UID = await storeNFT(formData.image!, formData.name, formData.description);
        console.log(UID);
        console.log(UID.ipnft);
        const fullPath = ipfsFullPath(UID.ipnft);
        console.log(fullPath);
        handleChangeBasic(fullPath, setFormData, "ipfsAddress");

        const contractAddress = await deployNFTContract(signer_data as Signer, {
            name: formData.name,
            symbol: formData.description,
            numberNFT: +formData.count,
        }).catch((error) => {
            console.log(error, "User is cancel transaction");
            return;
        });
        handleChangeBasic(contractAddress!, setFormData, "contractAddress");

        const moralisNft = getMoralisInstance(MoralisClassEnum.NFT);
        setFieldsIntoMoralisInstance(moralisNft, formData);
        moralisNft.set("contractAddress", contractAddress);
        moralisNft.set("ipfsAddress", fullPath);
        moralisNft.set("chainId", await signer_data.getChainId());
        await saveMoralisInstance(moralisNft);

        setConfirmFromBlockchain(true);
    }

    async function mint() {
        const tx = await mintClick(formData.contractAddress!, signer_data as Signer);
        console.log(tx);
    }

    return (
        <div>
            <Head>
                <title>NC: Create NFT</title>
            </Head>
            <Layout className="app-section mx-auto mt-32 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
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
                            name="description"
                            placeholder="A short description about NFT collection(Max. 250 words)"
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
                        <SubmitButton className="mt-5">Create Contract</SubmitButton>
                    </form>
                    <SubmitButton className="mt-5" onClick={mint}>
                        MINT
                    </SubmitButton>
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
                                    <p>Deployment successful!</p>
                                    <p>Contract Address: {formData.contractAddress}</p>
                                    {/* <Link href="/create-dao"> */}
                                    <button
                                        className="form-submit-button"
                                        onClick={() => {
                                            confirmDialog.toggle();
                                        }}
                                    >
                                        Next Steps
                                    </button>
                                    {/* </Link> */}
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

export default CreateNFT;
