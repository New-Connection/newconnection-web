import React, { useState, useEffect } from "react";
import {
    DragAndDropImage,
    InputAmount,
    InputText,
    Button,
    TypeSelector,
    InputTextArea,
    InputSupplyOfNFT
} from "components/Form";
import { useRouter } from "next/router";
import { Signer } from "ethers";
import { useMoralisQuery, useMoralis } from "react-moralis";
import { useSigner, useSwitchNetwork } from "wagmi";
import { NextPage } from "next";
import Layout from "components/Layout/Layout";
import { ICreateNFT } from "types/forms";
import {
    handleChangeBasic,
    handleImageChange,
    handleNftSupplyChange,
    handleSelectorChange,
    handleTextChange
} from "utils/handlers";
import { validateForm } from "utils/validate";
import { useDialogState } from "ariakit";
import { handleNext, handleReset } from "components/Dialog/base-dialogs";
import { BackButton } from "components/Button/";
import { storeNFT } from "utils/ipfsUpload";
import { CHAINS, getChainNames, getLogoURI } from "utils/blockchains";
import { chainIds, layerzeroEndpoints } from "utils/layerzero";
import { addToken, deployNFTContract } from "contract-interactions";
import { IAddNftQuery } from "types/queryInterfaces";
import { AddNftDialog } from "components/Dialog/CreateNftDialogs";
import { checkCorrectNetwork } from "logic";
import { fetchDAO } from "network";
import { handleContractError } from "utils/errors";

const AddNewNFT: NextPage = () => {
    const [formData, setFormData] = useState<ICreateNFT>({
        name: "",
        description: "",
        file: {},
        NFTtype: "Member",
        symbol: "",
        price: 0,
        contractAddress: "",
        governorAddress: "",
        ipfsAddress: "",
        blockchain: ""
    });

    const router = useRouter();
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const { isInitialized } = useMoralis();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    const { fetch: DaoQuery } = useMoralisQuery(
        "DAO",
        (query) => query.equalTo("governorAddress", formData.governorAddress),
        [formData.governorAddress],
        {
            autoFetch: false
        }
    );

    useEffect(() => {
        fetchQuery();
    }, [router]);

    const fetchQuery = () => {
        const query = router.query as IAddNftQuery;
        handleChangeBasic(query.governorAddress, setFormData, "governorAddress");
        handleChangeBasic(query.blockchain, setFormData, "blockchain");
    };

    const calculateSupply = () => {
        return formData[
            getChainNames().find((chain) => {
                const supply = formData[chain];
                return supply !== 0 && supply !== "" && supply !== undefined;
            })
            ];
    };

    const saveNewNFTContractAddress = async (nftTokenAddress: string) => {
        console.log("nft token address", nftTokenAddress);
        const { moralisInstance } = await fetchDAO(isInitialized, DaoQuery);
        if (moralisInstance && nftTokenAddress) {
            moralisInstance.addUnique("tokenAddress", nftTokenAddress);
            await moralisInstance.save();
        }
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateForm(formData, ["ipfsAddress", "contractAddress", "price"])) {
            return;
        }

        if (!(await checkCorrectNetwork(signerData, CHAINS[formData.blockchain].id, switchNetwork))) {
            return;
        }

        handleReset(setActiveStep);
        confirmDialog.toggle();

        let fullPath: string;
        try {
            const UID = await storeNFT(formData.file as File, formData.name, formData.description!);
            console.log(UID);
            fullPath = UID.url;
            console.log(fullPath);
            handleChangeBasic(fullPath, setFormData, "ipfsAddress");
        } catch (error) {
            handleContractError(error, confirmDialog);
            handleReset(setActiveStep);
            return;
        }

        let contract;
        try {
            const chainId = await signerData.getChainId();
            const endpoint: string =
                layerzeroEndpoints[chainIds[chainId]] || layerzeroEndpoints["not-supported"];

            contract = await deployNFTContract(signerData as Signer, {
                name: formData.name,
                symbol: formData.symbol,
                price: formData.price.toString(),
                baseURI: fullPath,
                layerzeroEndpoint: endpoint,
                //todo: need to calculate when few blockchains
                startMintId: 0,
                endMintId: calculateSupply()
            });
            handleNext(setActiveStep);

            await contract.deployed();
            console.log(`Deployment successful! Contract Address: ${contract.address}`);
            handleNext(setActiveStep);

            const addTx = await addToken(formData.governorAddress, signerData, contract.address);
            handleNext(setActiveStep);

            await addTx.wait();
            handleNext(setActiveStep);

            handleChangeBasic(contract.address, setFormData, "contractAddress");
            await saveNewNFTContractAddress(contract.address);
            handleNext(setActiveStep);
        } catch (error) {
            handleContractError(error, confirmDialog);
            handleReset(setActiveStep);
            return;
        }
        try {
        } catch (error) {
            handleContractError(error, confirmDialog);
            handleReset(setActiveStep);
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
                                    {getChainNames().map((chain) => (
                                        // chain === "Polygon" ? (
                                        <InputSupplyOfNFT
                                            key={chain}
                                            label={chain}
                                            name={chain}
                                            image={getLogoURI(chain)}
                                            handleChange={(event) => {
                                                handleNftSupplyChange(
                                                    event,
                                                    setFormData,
                                                    chain,
                                                    "blockchain"
                                                );
                                                fetchQuery();
                                            }}
                                            isDisabled={chain !== formData.blockchain}
                                        />
                                    ))}
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

                <AddNftDialog dialog={confirmDialog} formData={formData} activeStep={activeStep} />
            </Layout>
        </div>
    );
};

export default AddNewNFT;
