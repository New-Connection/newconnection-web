import React, { useState } from "react";
import Layout, {
    AddNftDialog,
    BackButton,
    Button,
    DragAndDropImage,
    InputAmount,
    InputSupplyOfNFT,
    InputText,
    InputTextArea,
} from "components";
import { Signer } from "ethers";
import { useSigner, useSwitchNetwork } from "wagmi";
import { GetServerSideProps, NextPage } from "next";
import { IAddNftQuery, ICreateNFT, IDAOPageForm } from "types";
import {
    handleChangeBasic,
    handleContractError,
    handleImageChange,
    handleNftSupplyChange,
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
import { useCounter, useEffectOnce, useReadLocalStorage } from "usehooks-ts";

export const getServerSideProps: GetServerSideProps = async (context) => ({
    props: context.params,
});

const AddNewNFT: NextPage<IAddNftQuery> = ({ url }) => {
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

    const storageDao = useReadLocalStorage<IDAOPageForm>(url);

    useEffectOnce(() => {
        fetchQuery();
    });

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
                        <div className="grid grid-cols-2">
                            <div className={"grid grid-flow-row"}>
                                <InputText
                                    label="Name"
                                    name="name"
                                    className={"max-w-2xl"}
                                    placeholder="NFT Name"
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                                <InputTextArea
                                    label="Description"
                                    name="description"
                                    className={"max-w-2xl"}
                                    placeholder="A short description about NFT collection(Max. 250 words)"
                                    maxLength={2000}
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputText
                                        label="Symbol"
                                        name="symbol"
                                        placeholder="Short NFT name"
                                        handleChange={(event) => {
                                            handleTextChange(event, setFormData);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex">
                                <div className="divider divider-horizontal" />
                                <DragAndDropImage
                                    height={"h-full"}
                                    label="Image"
                                    name="file"
                                    handleChange={(file) => handleImageChange(file, setFormData, "file")}
                                />
                            </div>
                        </div>

                        <div className={"mb-4"}>
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
                        </div>
                        <label className={"label"}>
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
                        <Button className="mt-5 w-2/3 self-center">Create Contract</Button>
                    </form>
                </section>

                <AddNftDialog dialog={confirmDialog} formData={formData} activeStep={activeStep} />
            </Layout>
        </div>
    );
};

export default AddNewNFT;
