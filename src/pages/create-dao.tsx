import React, { FormEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { useSigner, useSwitchNetwork } from "wagmi";
import toast from "react-hot-toast";
import { useDialogState } from "ariakit";
import { Signer } from "ethers";
import { ICreateDAO } from "types/forms";
import { validateForm } from "utils/validate";
import Layout from "components/Layout";
import { Button, CheckboxGroup, DragAndDropImage, InputAmount, InputText, InputTextArea } from "components/Form";
import {
    handleAddArray,
    handleChangeBasic,
    handleChangeBasicSimple,
    handleDaoNameUrlChange,
    handleImageChange,
    handleTextChange,
} from "utils/handlers";
import { deployGovernorContract } from "contract-interactions/";
import { CHAINS, getBlocksPerDay } from "utils/blockchains";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { useRouter } from "next/router";
import { handleNext, handleReset } from "components/Dialog/base-dialogs";
import { storeNFT } from "utils/ipfsUpload";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { ICreateDaoQuery } from "types/queryInterfaces";
import { CreateDaoDialog } from "components/Dialog/CreateDaoDialogs";
import { checkCorrectNetwork } from "logic";
import { fetchDAOs } from "network";
import { handleContractError } from "utils/errors";

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

    const { fetch: DAOsQuery } = useMoralisQuery("DAO", (query) => query.equalTo("url", formData.url), [formData.url], {
        autoFetch: false,
    });

    const checkUrlAvailability = async () => {
        const results = await fetchDAOs(isInitialized, DAOsQuery);
        return results && results.length === 0;
    };

    useEffect(() => {
        const query = router.query as ICreateDaoQuery;
        handleChangeBasicSimple(query.tokenAddress, setFormData, "tokenAddress");
        // handleAddArray(query.enabledBlockchains, setFormData, "enabledBlockchains");
        handleAddArray(query.enabledBlockchains, setFormData, "blockchain");
    }, [router]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);

        if (!validateForm(formData)) {
            return;
        }

        const isUrlAvailable = await checkUrlAvailability();
        if (!isUrlAvailable) {
            toast.error("Name unavailable");
            return;
        }

        if (!(await checkCorrectNetwork(signerData, CHAINS[formData.blockchain[0]].id, switchNetwork))) {
            return;
        }

        handleReset(setActiveStep);
        confirmDialog.toggle();

        let profileImagePath;
        let coverImagePath;
        try {
            profileImagePath = await storeNFT(formData.profileImage as File);
            console.log(profileImagePath);
            handleChangeBasic(profileImagePath, setFormData, "profileImage");

            coverImagePath = await storeNFT(formData.coverImage as File);
            console.log(coverImagePath);
            handleChangeBasic(coverImagePath, setFormData, "coverImage");
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            handleReset(setActiveStep);
            return;
        }

        let contract;
        try {
            contract = await deployGovernorContract(signerData as Signer, {
                name: formData.name,
                tokenAddress: formData.tokenAddress[0],
                votingPeriod: +formData.votingPeriod * getBlocksPerDay(CHAINS[formData.blockchain[0]]),
                quorumPercentage: +formData.quorumPercentage,
            });
            handleNext(setActiveStep);
            await contract.deployed();
            handleNext(setActiveStep);
            handleNext(setActiveStep);
            handleChangeBasic(contract.address, setFormData, "governorAddress");
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            handleReset(setActiveStep);
            return;
        }

        const chainId = await signerData.getChainId();
        handleChangeBasic(chainId, setFormData, "chainId");

        try {
            const moralisDao = getMoralisInstance(MoralisClassEnum.DAO);
            setFieldsIntoMoralisInstance(moralisDao, formData);
            console.log("Contract Address for Moralis", contract.address);
            // use state not update immediately
            moralisDao.set("governorAddress", contract.address);
            moralisDao.set("chainId", chainId);
            moralisDao.set("profileImage", profileImagePath);
            moralisDao.set("coverImage", coverImagePath);
            await saveMoralisInstance(moralisDao);
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            return;
        }
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex flex-col max-w-4xl gap-4" onSubmit={onSubmit}>
                        <h1 className="text-highlighter">Create DAO</h1>
                        <div className="flex flex-row">
                            <h2 className="my-2 text-xl font-medium">DAO Name and Goals</h2>
                        </div>
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
