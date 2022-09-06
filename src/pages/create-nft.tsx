import React, { useState } from "react";
import {
    DragAndDropImage,
    InputAmount,
    InputText,
    Button,
    TypeSelector,
    InputTextArea,
    InputSupplyOfNFT,
} from "components/Form";
import Link from "next/link";
import toast from "react-hot-toast";
import { Signer } from "ethers";
import { useSigner, useSwitchNetwork } from "wagmi";
import { NextPage } from "next";
import Layout from "components/Layout/Layout";
import { ICreateNFT } from "types/forms";
import {
    handleChangeBasic,
    handleImageChange,
    handleNftSupplyChange,
    handleSelectorChange,
    handleTextChange,
} from "utils/handlers";
import { validateForm } from "utils/validate";
import { useDialogState } from "ariakit";
import { StepperDialog } from "components/Dialog";
import { deployNFTContract } from "contract-interactions/useDeployNFTContract";
import BackButton from "components/Button/backButton";
import { storeNFT } from "utils/ipfsUpload";
import { CHAINS, CHAINS_IMG, TEST_CHAINS_IDS } from "utils/blockchains";
import { chainIds, layerzeroEndpoints } from "utils/layerzero";
import { setURI } from "contract-interactions/stateNFTContract";
import { createNFTSteps } from "components/Dialog/Stepper";
import { getSupplyNumber } from "contract-interactions/viewNftContract";

const CreateNFT: NextPage = () => {
    const [formData, setFormData] = useState<ICreateNFT>({
        name: "",
        description: "",
        file: {},
        NFTtype: "Member",
        symbol: "",
        price: 0,
        contractAddress: "",
        ipfsAddress: "",
        blockchain: "",
    });

    const { data: signer_data } = useSigner();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    const { switchNetwork } = useSwitchNetwork();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const calculateSupply = () => {
        return formData[
            CHAINS.find((chain) => {
                const supply = formData[chain];
                return supply !== 0 && supply !== "" && supply !== undefined;
            })
        ];
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }
        if (!validateForm(formData, ["ipfsAddress", "contractAddress", "price"])) {
            return;
        }

        switchNetwork(TEST_CHAINS_IDS[formData.blockchain]);

        handleReset();
        confirmDialog.toggle();

        let fullPath: string;
        try {
            const UID = await storeNFT(formData.file as File, formData.name, formData.description!);
            console.log(UID);
            fullPath = UID.url;
            console.log(fullPath);
            handleChangeBasic(fullPath, setFormData, "ipfsAddress");
        } catch (error) {
            confirmDialog.toggle();
            handleReset();
            toast.error("Couldn't save your NFT on IPFS. Please try again");
            return;
        }

        let contract;
        try {
            const chainId = await signer_data.getChainId();
            const endpoint: string =
                layerzeroEndpoints[chainIds[chainId]] || layerzeroEndpoints["not-supported"];

            contract = await deployNFTContract(signer_data as Signer, {
                name: formData.name,
                symbol: formData.symbol,
                price: formData.price.toString(),
                layerzeroEndpoint: endpoint,
                //todo: need to calculate when few blockchains
                startMintId: 0,
                endMintId: calculateSupply(),
            });
            handleNext();
            await contract.deployed();
            console.log(`Deployment successful! Contract Address: ${contract.address}`);
            const supplyNFT = await getSupplyNumber(contract.address, chainId);
            handleNext();
            const setTx = await setURI(contract.address, signer_data, fullPath);
            handleNext();
            await setTx.wait();
            handleNext();
            handleNext();
            handleChangeBasic(contract.address, setFormData, "contractAddress");
        } catch (error) {
            console.log(error);
            confirmDialog.toggle();
            handleReset();
            toast.error("Please approve transaction to create DAO");
            return;
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <BackButton />
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={onSubmit}>
                        <h1 className="text-highlighter">Add NFT</h1>
                        <div className="w-full lg:flex">
                            <div className="lg:w-2/3 w-full">
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
                                        label="Membership type"
                                        name="NFTtype"
                                        handleChange={(event) =>
                                            handleSelectorChange(event, setFormData, "NFTtype")
                                        }
                                        className="w-1/2 mt-6"
                                    />
                                    <InputText
                                        label="Symbol"
                                        name="symbol"
                                        placeholder="Short NFT name"
                                        handleChange={(event) => {
                                            handleTextChange(event, setFormData);
                                        }}
                                        className="w-1/2"
                                    />
                                </div>

                                <InputAmount
                                    label="Price"
                                    placeholder="Price in ETH"
                                    name="price"
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                    className="w-full"
                                    min={0}
                                    step={0.0001}
                                    max={10}
                                />
                                <label>
                                    <div className="input-label"> NFT Supply</div>
                                </label>
                                <div className="grid w-full grid-cols-4 gap-4">
                                    {CHAINS.map(
                                        (chain) => (
                                            // chain === "Polygon" ? (
                                            <InputSupplyOfNFT
                                                key={chain}
                                                label={chain}
                                                name={chain}
                                                image={CHAINS_IMG[chain]}
                                                handleChange={(event) => {
                                                    handleNftSupplyChange(
                                                        event,
                                                        setFormData,
                                                        chain,
                                                        "blockchain"
                                                    );
                                                }}
                                                isDisabled={
                                                    chain !== formData.blockchain &&
                                                    formData.blockchain !== ""
                                                }
                                            />
                                        )
                                        // )
                                        // : (
                                        //     <InputSupplyOfNFT
                                        //         key={chain}
                                        //         label={chain}
                                        //         name={chain}
                                        //         image={CHAINS_IMG[chain]}
                                        //         handleChange={(event) => {
                                        //             handleTextChange(event, setFormData);
                                        //         }}
                                        //         isDisabled={true}
                                        //     />
                                        // )
                                    )}
                                </div>
                            </div>
                            <div className="lg:w-1/3 lg:ml-10">
                                <DragAndDropImage
                                    label="Image"
                                    name="file"
                                    handleChange={(file) =>
                                        handleImageChange(file, setFormData, "file")
                                    }
                                />
                            </div>
                        </div>
                        <Button className="mt-5 w-2/3">Create Contract</Button>
                    </form>
                </section>

                <StepperDialog
                    dialog={confirmDialog}
                    className="dialog"
                    activeStep={activeStep}
                    steps={createNFTSteps}
                >
                    <p className="ml-7">Deployment successful!</p>
                    <p className="ml-7 mb-10">Contract Address: {formData.contractAddress}</p>
                    <Link
                        href={{
                            pathname: "create-dao",
                            query: {
                                tokenAddress: formData.contractAddress,
                                enabledBlockchains: CHAINS.filter((chain) => formData[chain]),
                            },
                        }}
                    >
                        <button
                            className="form-submit-button"
                            onClick={() => {
                                confirmDialog.toggle();
                            }}
                        >
                            Go to DAO creation page
                        </button>
                    </Link>
                </StepperDialog>
            </Layout>
        </div>
    );
};

export default CreateNFT;
