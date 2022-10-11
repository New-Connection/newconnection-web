import React, { FormEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { useSigner, useSwitchNetwork } from "wagmi";
import toast from "react-hot-toast";
import { useDialogState } from "ariakit";
import { Signer } from "ethers";
import { ICreateDAO, ICreateDaoQuery } from "types";
import {
    handleAddArray,
    handleChangeBasic,
    handleChangeBasicSimple,
    handleContractError,
    handleDaoNameUrlChange,
    handleImageChange,
    handleTextChange,
    storeNFT,
    validateForm,
} from "utils";
import Layout, {
    Button,
    CheckboxGroup,
    CreateDaoDialog,
    DragAndDropImage,
    handleNext,
    handleReset,
    InputAmount,
    InputText,
    InputTextArea,
} from "components";
import { CHAINS, checkCorrectNetwork, deployGovernorContract, getBlocksPerDay } from "interactions/contract";
import {
    fetchDAO,
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "interactions/database";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

const CreateDAO: NextPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<ICreateDAO>({
        url: "",
        name: "",
        goals: "",
        profileImage: {},
        coverImage: {},
        tokenAddress: [],
        votingPeriod: "",
        quorumPercentage: "",
        blockchain: [],
        description: "",
        isActive: false,
    });

    const { data: signerData } = useSigner();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    const { switchNetwork } = useSwitchNetwork();
    const { isInitialized } = useMoralis();

    useEffect(() => {
        const query = router.query as ICreateDaoQuery;
        handleChangeBasicSimple(query.tokenAddress, setFormData, "tokenAddress");
        handleAddArray(query.enabledBlockchains, setFormData, "blockchain");
    }, [router]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);

        const checkUrlAvailability = async (url) => {
            const { newDao } = isInitialized && (await fetchDAO(url));
            console.log(newDao);
            return !newDao;
        };

        if (!validateForm(formData)) {
            return;
        }

        const isUrlAvailable = await checkUrlAvailability(formData.url);
        if (!isUrlAvailable) {
            toast.error("Name unavailable");
            return;
        }

        const chainId = CHAINS[formData.blockchain[0]].id;
        handleChangeBasic(chainId, setFormData, "chainId");
        if (!(await checkCorrectNetwork(signerData, CHAINS[formData.blockchain[0]].id, switchNetwork))) {
            return;
        }

        handleReset(setActiveStep);
        confirmDialog.toggle();

        const saveToDatabase = async (
            daoAddress: string,
            profileImagePath: string,
            coverImagePath: string,
            tokenAddress: string
        ) => {
            const daoInstance = getMoralisInstance(MoralisClassEnum.DAO);
            setFieldsIntoMoralisInstance(daoInstance, formData);
            console.log("Contract Address for Moralis", daoAddress);
            daoInstance.set("governorAddress", daoAddress);
            daoInstance.set("chainId", chainId);
            daoInstance.set("profileImage", profileImagePath);
            daoInstance.set("coverImage", coverImagePath);
            await saveMoralisInstance(daoInstance);

            const nftInstance = getMoralisInstance(MoralisClassEnum.NFT);
            nftInstance.set("tokenAddress", tokenAddress);
            nftInstance.set("chainId", chainId);
            nftInstance.set("governorAddress", daoAddress);
            await saveMoralisInstance(nftInstance);
        };

        try {
            const profileImagePath = await storeNFT(formData.profileImage as File);
            console.log(profileImagePath);
            handleChangeBasic(profileImagePath, setFormData, "profileImage");

            const coverImagePath = await storeNFT(formData.coverImage as File);
            console.log(coverImagePath);
            handleChangeBasic(coverImagePath, setFormData, "coverImage");

            const contract = await deployGovernorContract(signerData as Signer, {
                name: formData.name,
                tokenAddress: formData.tokenAddress[0],
                votingPeriod: (+formData.votingPeriod * getBlocksPerDay(formData.blockchain[0])).toString(),
                quorumPercentage: formData.quorumPercentage,
            });
            handleNext(setActiveStep);
            await contract.deployed();
            handleNext(setActiveStep);
            handleNext(setActiveStep);
            handleChangeBasic(contract.address, setFormData, "governorAddress");

            await saveToDatabase(contract.address, profileImagePath, coverImagePath, formData.tokenAddress[0]);
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            handleReset(setActiveStep);
        }
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex flex-col max-w-4xl gap-4" onSubmit={onSubmit}>
                        <h1 className="text-highlighter">Create DAO</h1>
                        <InputText
                            label="DAO Name"
                            name="name"
                            placeholder="Unique DAO name"
                            labelTitle="Unique DAO name"
                            maxLength={30}
                            handleChange={(event) => handleDaoNameUrlChange(event, setFormData, "url")}
                        />
                        <InputText
                            label="NFT Address"
                            name="tokenAddress"
                            placeholder="NFT which will be used in DAO (Ox...)"
                            labelTitle="NFT Address"
                            pattern={"^0x[a-fA-F0-9]{40}$"}
                            value={formData.tokenAddress[0]}
                            disabled={true}
                            // handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputText
                            label="DAO Goals"
                            name="goals"
                            placeholder="Сlear DAO goals"
                            labelTitle="Сlear DAO goals"
                            maxLength={100}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputTextArea
                            name={"description"}
                            label={"DAO Description"}
                            placeholder={"A description about the DAO and what it does"}
                            // isRequired
                            maxLength={2000}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <div className="flex justify-between">
                            <InputAmount
                                label="Voting Period"
                                name="votingPeriod"
                                className="w-2/5"
                                labelTitle="Length of period during which people can cast their vote."
                                placeholder="Voting period in days(1-7 days)"
                                min={1}
                                max={7}
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                            <InputAmount
                                label={"Quorum Percentage"}
                                name="quorumPercentage"
                                className={"w-2/5"}
                                labelTitle="Quorum percentage required for a proposal to pass."
                                placeholder="Quorum percentage (1-100)%"
                                min={1}
                                max={100}
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                        </div>
                        <div className="flex flex-row">
                            <DragAndDropImage
                                label="Profile Image"
                                name="profileImage"
                                className="w-1/3 mr-10"
                                handleChange={(file) => handleImageChange(file, setFormData, "profileImage")}
                            />
                            <DragAndDropImage
                                label="Cover Image"
                                name="coverImage"
                                className="w-2/3"
                                handleChange={(file) => handleImageChange(file, setFormData, "coverImage")}
                            />
                        </div>
                        <CheckboxGroup
                            label={"DAO Blockchain"}
                            images={true}
                            values={formData.blockchain}

                            // when few blockchains
                            // description={"You can choose one or more blockchains"}
                            // values={[...getChainNames()]}
                            // enabledValues={formData.enabledBlockchains}
                            // handleChange={(event) =>
                            //     handleCheckboxChange(event, formData, setFormData, "blockchain")
                            // }
                        />

                        <h2 className="mt-2 text-xl font-medium">Social profiles (optional)</h2>
                        <div className="flex w-full gap-10">
                            <InputText
                                label="Twitter"
                                name="twitterURL"
                                placeholder="twitter.com/username"
                                labelTitle="Twitter URL"
                                maxLength={100}
                                className="w-1/3"
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                            <InputText
                                label="Discord"
                                name="discordURL"
                                placeholder="discord.com/invite/invitation code"
                                labelTitle="Discord URL"
                                maxLength={100}
                                className="w-1/3"
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                            <InputText
                                label="Website"
                                name="websiteURL"
                                placeholder="website.io"
                                labelTitle="Website"
                                maxLength={100}
                                className="w-1/3"
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                        </div>

                        <Button className="mt-5 nav-button">Create Contract</Button>
                    </form>
                </section>

                <CreateDaoDialog dialog={confirmDialog} formData={formData} activeStep={activeStep} />
            </Layout>
        </div>
    );
};

export default CreateDAO;
