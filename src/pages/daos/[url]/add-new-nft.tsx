import React, { useEffect, useState } from "react";
import Layout, {
    AddNftDialog,
    BackButton,
    Button,
    DragAndDropImage,
    InputAmount,
    InputSupplyOfNFT,
    InputText,
    InputTextArea,
    TypeSelector,
} from "components";
import { useRouter } from "next/router";
import { Signer } from "ethers";
import { useSigner, useSwitchNetwork } from "wagmi";
import { NextPage } from "next";
import { IAddNftQuery, ICreateNFT, IDAOPageForm } from "types";
import {
    handleChangeBasic,
    handleContractError,
    handleImageChange,
    handleNftSupplyChange,
    handleSelectorChange,
    handleTextChange,
    storeNFT,
    validateForm,
} from "utils";
import { useDialogState } from "ariakit";
import {
    addToken,
    chainIds,
    checkCorrectNetwork,
    deployNFTContract,
    getChain,
    getChainNames,
    getLogoURI,
    layerzeroEndpoints,
} from "interactions/contract";
import { addValueToDaoArray } from "interactions/database";
import { useCounter, useReadLocalStorage } from "usehooks-ts";

const AddNewNFT: NextPage = () => {
    const [formData, setFormData] = useState<ICreateNFT>({
        name: "",
        description: "",
        file: {},
        // NFTtype: "Member",
        symbol: "",
        price: 0,
        contractAddress: "",
        governorAddress: "",
        ipfsAddress: "",
        blockchain: "",
        governorUrl: "",
    });

    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const confirmDialog = useDialogState();
    const { count: activeStep, increment: incrementActiveStep, reset: resetActiveStep } = useCounter(0);

    const router = useRouter();
    const url = (router.query as IAddNftQuery).url;
    const storageDao = useReadLocalStorage<IDAOPageForm>(url);

    useEffect(() => {
        fetchQuery();
    }, [router]);

    const fetchQuery = () => {
        const DAO: IDAOPageForm = storageDao;

        if (DAO) {
            handleChangeBasic(DAO.governorAddress, setFormData, "governorAddress");
            handleChangeBasic(DAO.url, setFormData, "governorUrl");
            handleChangeBasic(DAO.blockchain[0], setFormData, "blockchain");
        }
    };

    const calculateSupply = () => {
        return formData[
            getChainNames().find((chain) => {
                const supply = formData[chain];
                return supply !== 0 && supply !== "" && supply !== undefined;
            })
            ];
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateForm(formData, ["ipfsAddress", "contractAddress", "price"])) {
            return;
        }

        const chainId = getChain(formData.blockchain).id;
        if (!(await checkCorrectNetwork(signerData, chainId, switchNetwork))) {
            return;
        }

        resetActiveStep();
        confirmDialog.toggle();

        try {
            const path = await storeNFT(formData.file as File);
            console.log(path);
            handleChangeBasic(path, setFormData, "ipfsAddress");

            const chainId = await signerData.getChainId();
            const endpoint: string = layerzeroEndpoints[chainIds[chainId]] || layerzeroEndpoints["not-supported"];

            const contract = await deployNFTContract(signerData as Signer, {
                name: formData.name,
                symbol: formData.symbol,
                price: formData.price.toString(),
                baseURI: path,
                layerzeroEndpoint: endpoint,
                //todo: need to calculate when few blockchains
                startMintId: 0,
                endMintId: calculateSupply(),
            });
            incrementActiveStep();

            await contract.deployed();
            console.log(`Deployment successful! Contract Address: ${contract.address}`);
            incrementActiveStep();

            const addTx = await addToken(formData.governorAddress, signerData, contract.address);
            incrementActiveStep();

            await addTx.wait();
            incrementActiveStep();

            handleChangeBasic(contract.address, setFormData, "contractAddress");

            await addValueToDaoArray(formData.governorUrl, "tokenAddress", contract.address);

            incrementActiveStep();
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            resetActiveStep();
            return;
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={onSubmit}>
                        <BackButton />
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
                                        handleChange={(event) => handleSelectorChange(event, setFormData, "NFTtype")}
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
                                    {getChainNames()
                                        // TODO: remove when few blockchains
                                        .filter((chain) => formData.blockchain === chain)
                                        .map((chain) => (
                                            <InputSupplyOfNFT
                                                key={chain}
                                                label={chain}
                                                name={chain}
                                                image={getLogoURI(chain)}
                                                handleChange={(event) => {
                                                    handleNftSupplyChange(event, setFormData, chain, "blockchain");
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
                                    handleChange={(file) => handleImageChange(file, setFormData, "file")}
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
