import React, { useState } from "react";
import {
    DragAndDropImage,
    InputAmount,
    InputText,
    SubmitButton,
    TypeSelector,
    InputTextArea,
    InputSupplyOfNFT,
} from "components/Form";
import Link from "next/link";
import toast from "react-hot-toast";
import { Signer } from "ethers";
import { useSigner } from "wagmi";
import { NextPage } from "next";
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

import Ethereum from "assets/chains/Ethereum.png";
import Polygon from "assets/chains/Polygon.png";
import Arbitrum from "assets/chains/Arbitrum.png";
import Binance from "assets/chains/Binance.png";
import Avalanche from "assets/chains/Avalanche.png";
import Fantom from "assets/chains/Fantom.png";
import Optimism from "assets/chains/Optimism.png";

const chains = ["Ethereum", "Polygon", "Arbitrum", "Binance", "Avalanche", "Fantom", "Optimism"];

const images = {
    Ethereum: Ethereum,
    Polygon: Polygon,
    Arbitrum: Arbitrum,
    Binance: Binance,
    Avalanche: Avalanche,
    Fantom: Fantom,
    Optimism: Optimism,
};

const CreateNFT: NextPage = () => {
    const [formData, setFormData] = useState<CreateNFT>({
        name: "",
        description: "",
        file: {},
        NFTtype: "Member",
        collectionName: "",
        royalties: 0,
        symbol: "",
        price: 0,
        contractAddress: "",
        ipfsAddress: "",
        Polygon: "",
    });

    const { data: signer_data } = useSigner();
    const [confirmFromBlockchain, setConfirmFromBlockchain] = useState(false);
    const confirmDialog = useDialogState();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }
        console.log("Form Data", formData);
        if (
            !validateForm(formData, ["collectionName", "ipfsAddress", "contractAddress", "price"])
        ) {
            return;
        }

        confirmDialog.toggle();

        const UID = await storeNFT(formData.file as File, formData.name, formData.description);
        console.log(UID);
        console.log(UID.ipnft);
        const fullPath = ipfsFullPath(UID.ipnft);
        console.log(fullPath);
        handleChangeBasic(fullPath, setFormData, "ipfsAddress");

        let contractAddress;
        try {
            contractAddress = await deployNFTContract(signer_data as Signer, {
                name: formData.name,
                symbol: formData.symbol,
                numberNFT: +formData.Polygon!,
            });

            handleChangeBasic(contractAddress!, setFormData, "contractAddress");
            console.log("set true");
            setConfirmFromBlockchain(true);
        } catch (error) {
            confirmDialog.toggle();
            setConfirmFromBlockchain(false);
            toast.error("Please approve transaction to create DAO");
            return;
        }
    }
    return (
        <div>
            <Layout className="app-section mx-auto mt-32 flex w-full flex-col items-center space-y-6 pb-8 bg-[#ffffff]">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={onSubmit}>
                        <h1 className="text-highlighter">Add NFT</h1>
                        <div className="w-full flex">
                            <div className="w-2/3">
                                <InputText
                                    label="Name"
                                    name="name"
                                    placeholder="NFT Name"
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                                <InputTextArea
                                    label="Description"
                                    name="description"
                                    placeholder="A short description about NFT collection(Max. 250 words)"
                                    maxLength={2000}
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                                <div className="flex justify-between gap-10">
                                    <TypeSelector
                                        label="NFT type"
                                        name="NFTtype"
                                        handlerChange={(event) =>
                                            handleSelectorChange(event, setFormData, "NFTtype")
                                        }
                                        className="w-1/2 mt-6"
                                    />
                                    <InputText
                                        label="Collection (optional)"
                                        name="collectionName"
                                        placeholder="Collection name"
                                        handleChange={(event) =>
                                            handleTextChange(event, setFormData)
                                        }
                                        className="w-1/2"
                                    />
                                </div>
                                <div className="flex justify-between gap-10">
                                    <InputAmount
                                        label="Royalties"
                                        name="royalties"
                                        placeholder="NFT royalties"
                                        handleChange={(event) =>
                                            handleTextChange(event, setFormData)
                                        }
                                        className="w-1/2"
                                    />
                                    <InputText
                                        label={"Symbol"}
                                        name="symbol"
                                        placeholder="Short NFT name"
                                        handleChange={(event) => {
                                            handleTextChange(event, setFormData);
                                        }}
                                        className="w-1/2"
                                    />
                                </div>

                                <InputAmount
                                    label={"Price"}
                                    placeholder="Soon you will be able to set the price of your NFT, but for now skip this field"
                                    name="price"
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                    isRequired={false}
                                    className="w-full"
                                    isDisabled={true}
                                />
                                <label>
                                    <div className="input-label"> NFT Supply</div>
                                </label>
                                <div className="grid w-full grid-cols-4 gap-4">
                                    {chains.map((chain) =>
                                        chain === "Polygon" ? (
                                            <InputSupplyOfNFT
                                                key={chain}
                                                label={chain}
                                                name={chain}
                                                image={images[chain]}
                                                handleChange={(event) => {
                                                    handleTextChange(event, setFormData);
                                                }}
                                            />
                                        ) : (
                                            <InputSupplyOfNFT
                                                key={chain}
                                                label={chain}
                                                name={chain}
                                                image={images[chain]}
                                                handleChange={(event) => {
                                                    handleTextChange(event, setFormData);
                                                }}
                                                isDisabled={true}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="w-1/3 ml-10">
                                <DragAndDropImage
                                    label="Image"
                                    name="file"
                                    handleChange={(file) =>
                                        handleImageChange(file, setFormData, "file")
                                    }
                                />
                            </div>
                        </div>
                        <SubmitButton className="mt-5 w-2/3">Create Contract</SubmitButton>
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
                                    <p>Deployment successful!</p>
                                    <p>Contract Address: {formData.contractAddress}</p>
                                    <Link
                                        href={{
                                            pathname: "create-dao",
                                            query: { tokenAddress: formData.contractAddress },
                                        }}
                                    >
                                        <button
                                            className="form-submit-button"
                                            onClick={() => {
                                                confirmDialog.toggle();
                                            }}
                                        >
                                            Next Steps
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

export default CreateNFT;
