import React, { FormEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { useSigner, useSwitchNetwork } from "wagmi";
import toast from "react-hot-toast";
import { useDialogState } from "ariakit";
import { Signer } from "ethers";
import { ICreateDAO, ICreateDaoQuery, IMember } from "types";
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
    InputAmount,
    InputText,
    InputTextArea,
} from "components";
import { checkCorrectNetwork, deployGovernorContract, getBlocksPerDay, getChain } from "interactions/contract";
import { checkUrlAvailability, saveMember, saveNewDao } from "interactions/database";
import { useRouter } from "next/router";
import { useCounter } from "usehooks-ts";

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
    const { count: activeStep, increment: incrementActiveStep, reset: resetActiveStep } = useCounter(0);

    const { switchNetwork } = useSwitchNetwork();

    useEffect(() => {
        const query = router.query as ICreateDaoQuery;
        handleChangeBasicSimple(query.tokenAddress, setFormData, "tokenAddress");
        handleAddArray(query.enabledBlockchains, setFormData, "blockchain");
    }, [router]);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);

        if (!validateForm(formData)) {
            return;
        }

        if (!(await checkUrlAvailability(formData.url))) {
            toast.error("Name unavailable");
            return;
        }

        const chainId = getChain(formData.blockchain[0]).id;
        if (!(await checkCorrectNetwork(signerData, chainId, switchNetwork))) {
            return;
        }

        resetActiveStep();
        confirmDialog.toggle();

        try {
            const profileImagePath = await storeNFT(formData.profileImage as File);
            console.log(profileImagePath);
            const coverImagePath = await storeNFT(formData.coverImage as File);
            console.log(coverImagePath);

            const contract = await deployGovernorContract(signerData as Signer, {
                name: formData.name,
                tokenAddress: formData.tokenAddress[0],
                votingPeriod: (+formData.votingPeriod * getBlocksPerDay(formData.blockchain[0])).toString(),
                quorumPercentage: formData.quorumPercentage,
            });
            incrementActiveStep();
            await contract.deployed();
            incrementActiveStep();
            incrementActiveStep();
            handleChangeBasic(contract.address, setFormData, "governorAddress");

            await saveNewDao({
                ...formData,
                chainId: chainId,
                profileImage: profileImagePath,
                coverImage: coverImagePath,
                governorAddress: contract.address,
            } as ICreateDAO);

            const address = await signerData.getAddress();

            await saveMember({
                memberAddress: address,
                governorUrl: formData.url,
                memberTokens: [],
                role: "Admin",
            } as IMember);
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            resetActiveStep();
        }
    };

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex flex-col max-w-4xl gap-4" onSubmit={onSubmit}>
                        <h1 className="text-highlighter">Create DAO</h1>
                        <div className={"grid grid-cols-3"}>
                            <div className={"grid grid-rows-2"}>
                                <InputText
                                    label="DAO Name"
                                    name="name"
                                    className={"max-w-2xl"}
                                    placeholder="Unique DAO name"
                                    labelTitle="Unique DAO name"
                                    maxLength={30}
                                    handleChange={(event) => handleDaoNameUrlChange(event, setFormData, "url")}
                                />
                                <InputText
                                    label="DAO Goals"
                                    name="goals"
                                    className={"max-w-2xl"}
                                    placeholder="Сlear DAO goals"
                                    labelTitle="Сlear DAO goals"
                                    maxLength={100}
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                            </div>
                            <div className={"flex col-span-2"}>
                                <div className="divider divider-horizontal" />
                                <InputTextArea
                                    name={"description"}
                                    label={"DAO Description"}
                                    placeholder={"A description about the DAO and what it does"}
                                    height={"h-full"}
                                    className={"max-w-2xl"}
                                    maxLength={2000}
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-flow-row-dense grid-cols-3">
                            <DragAndDropImage
                                height={"h-48"}
                                label="Profile Image"
                                name="profileImage"
                                handleChange={(file) => handleImageChange(file, setFormData, "profileImage")}
                            />

                            <div className={"flex col-span-2"}>
                                <div className="divider divider-horizontal" />
                                <DragAndDropImage
                                    label="Cover Image"
                                    name="coverImage"
                                    height={"h-48"}
                                    handleChange={(file) => handleImageChange(file, setFormData, "coverImage")}
                                />
                            </div>
                        </div>

                        <InputText
                            label="NFT Address"
                            name="tokenAddress"
                            placeholder="NFT which will be used in DAO (Ox...)"
                            labelTitle="NFT Address"
                            pattern={"^0x[a-fA-F0-9]{40}$"}
                            value={formData.tokenAddress[0]}
                            disabled={true}
                            className={"max-w-lg"}
                            // handleChange={(event) => handleTextChange(event, setFormData)}
                        />

                        <div className="flex justify-between mb-4">
                            <InputAmount
                                label="Voting Period"
                                name="votingPeriod"
                                className="w-2/5"
                                measure={"Days"}
                                labelTitle="Length of period during which people can cast their vote."
                                placeholder="1-7 days"
                                min={1}
                                max={7}
                                handleChange={(event) => handleTextChange(event, setFormData)}
                            />
                            <InputAmount
                                label={"Quorum Percentage"}
                                name="quorumPercentage"
                                measure={"%"}
                                className={"w-2/5"}
                                labelTitle="Quorum percentage required for a proposal to pass."
                                placeholder="4 (recommended)"
                                min={1}
                                max={100}
                                handleChange={(event) => handleTextChange(event, setFormData)}
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

                        <Button className="mt-5 w-2/3 self-center">Create Contract</Button>
                    </form>
                </section>

                <CreateDaoDialog dialog={confirmDialog} formData={formData} activeStep={activeStep} />
            </Layout>
        </div>
    );
};

export default CreateDAO;
