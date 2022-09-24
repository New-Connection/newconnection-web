import React, { useState, useLayoutEffect } from "react";
import {
    DragAndDropImage,
    InputAmount,
    InputText,
    Button,
    TypeSelector,
    InputTextArea,
    InputSupplyOfNFT,
} from "components/Form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
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
    handleTextChange,
} from "utils/handlers";
import { validateForm } from "utils/validate";
import { useDialogState } from "ariakit";
import { ParsedUrlQuery } from "querystring";
import { handleNext, handleReset, StepperDialog } from "components/Dialog";
import BackButton from "components/Button/backButton";
import { storeNFT } from "utils/ipfsUpload";
import { CHAINS, getChainNames, getLogoURI } from "utils/blockchains";
import { chainIds, layerzeroEndpoints } from "utils/layerzero";
import { addNFTSteps } from "components/Dialog/Stepper";
import { addToken, deployNFTContract } from "contract-interactions";
import { formatAddress } from "utils/address";
import { ClipboardCopyIcon } from "@heroicons/react/solid";

interface QueryUrlParams extends ParsedUrlQuery {
    governorAddress: string;
    blockchain: string;
}

// export const getServerSideProps = async (context: NextPageContext) => {
//     const { query } = context;
//     return { props: { query } };
// };

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
        blockchain: "",
    });

    const router = useRouter();
    const { data: signer_data } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const { isInitialized } = useMoralis();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    const calculateSupply = () => {
        return formData[
            getChainNames().find((chain) => {
                const supply = formData[chain];
                return supply !== 0 && supply !== "" && supply !== undefined;
            })
            ];
    };
    const { fetch: DAOsQuery } = useMoralisQuery(
        "DAO",
        (query) => query.equalTo("governorAddress", formData.governorAddress),
        [formData.governorAddress],
        {
            autoFetch: false,
        }
    );

    const saveNewNFTContractAddress = async (nftTokenAddress: string) => {
        console.log("nft token address", nftTokenAddress);
        if (isInitialized && nftTokenAddress) {
            await DAOsQuery({
                onSuccess: async (results) => {
                    const moralisInstance = results[0];
                    console.log("Result", results);
                    console.log("Result Moralis Contract Address", nftTokenAddress);
                    moralisInstance.addUnique("tokenAddress", nftTokenAddress);
                    await moralisInstance.save();
                },
                onError: (error) => {
                    console.log("Error fetching saveNewNFTContractAddress query" + error);
                },
            });
        }
    };

    useLayoutEffect(() => {
        fetchQuery();
    }, [router]);

    const fetchQuery = () => {
        const query = router.query as QueryUrlParams;
        handleChangeBasic(query.governorAddress, setFormData, "governorAddress");
        handleChangeBasic(query.blockchain, setFormData, "blockchain");
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

        switchNetwork(CHAINS[formData.blockchain].id);

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
            confirmDialog.toggle();
            handleReset(setActiveStep);
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
                baseURI: fullPath,
                layerzeroEndpoint: endpoint,
                //todo: need to calculate when few blockchains
                startMintId: 0,
                endMintId: calculateSupply(),
            });
            handleNext(setActiveStep);

            await contract.deployed();
            console.log(`Deployment successful! Contract Address: ${contract.address}`);
            handleNext(setActiveStep);

            const addTx = await addToken(formData.governorAddress, signer_data, contract.address);
            handleNext(setActiveStep);

            await addTx.wait();
            handleNext(setActiveStep);

            handleChangeBasic(contract.address, setFormData, "contractAddress");
            await saveNewNFTContractAddress(contract.address);
            handleNext(setActiveStep);
        } catch (error) {
            console.log(error);
            confirmDialog.toggle();
            handleReset(setActiveStep);
            toast.error("Please approve transaction to create DAO");
            return;
        }
        try {
        } catch (error) {
            console.log(error);
            confirmDialog.toggle();
            handleReset(setActiveStep);
            toast.error("Can't save token into backend");
            return;
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <BackButton/>
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

                <StepperDialog
                    dialog={confirmDialog}
                    className="dialog"
                    activeStep={activeStep}
                    steps={addNFTSteps}
                >
                    <p className="ml-7">Deployment successful!</p>
                    <div className="flex ml-7 mb-10">Contract Address:
                        <div
                            className={
                                "flex ml-4 text-lightGray hover:text-gray5 hover:cursor-pointer"
                            }
                            onClick={() =>
                                navigator.clipboard.writeText(formData.contractAddress)
                            }
                        >
                            {formatAddress(formData.contractAddress)}
                            <ClipboardCopyIcon className="h-6 w-5"/>
                        </div>
                    </div>
                    <button
                        className="form-submit-button"
                        onClick={() => {
                            confirmDialog.toggle();
                            router.back()
                        }}
                    >
                        Back to DAO
                    </button>
                </StepperDialog>
            </Layout>
        </div>
    );
};

export default AddNewNFT;
