import { FormEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { useSigner, useSwitchNetwork } from "wagmi";
import toast from "react-hot-toast";
import { useDialogState } from "ariakit";
import { Signer } from "ethers";
import Link from "next/link";
import { ICreateDAO } from "types/forms";
import { validateForm } from "utils/validate";
import Layout from "components/Layout";
import {
    CheckboxGroup,
    DragAndDropImage,
    InputAmount,
    InputText,
    InputTextArea,
    Button,
} from "components/Form";
import {
    handleChangeBasic,
    handleCheckboxChange,
    handleImageChange,
    handleTextChange,
} from "utils/handlers";
import { deployGovernorContract } from "contract-interactions/useDeployGovernorContract";
import { BLOCKS_IN_DAY } from "utils/constants";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { StepperDialog } from "../components/Dialog";

import { CHAINS, CHAINS_IMG, TEST_CHAINS_IDS } from "utils/blockchains";
import { storeNFT } from "utils/ipfsUpload";

const DaoTypeValues = ["Grants", "Investment", "Social"];

interface QueryUrlParams extends ParsedUrlQuery {
    tokenAddress: string;
    enabledBlockchains: string[];
}

const CreateDAO: NextPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<ICreateDAO>({
        name: "",
        goals: "",
        profileImage: {},
        coverImage: {},
        tokenAddress: "",
        votingPeriod: "",
        quorumPercentage: "",
        type: [],
        blockchain: [],
        description: "",
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

    useEffect(() => {
        const query = router.query as QueryUrlParams;

        handleChangeBasic(query.tokenAddress, setFormData, "tokenAddress");
        handleChangeBasic(query.enabledBlockchains, setFormData, "enabledBlockchains");

        console.log(`tokenAddress from query: ${query.tokenAddress}`);
    }, []);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData)) {
            return;
        }

        switchNetwork(TEST_CHAINS_IDS[formData.blockchain[0]]);

        handleReset();
        confirmDialog.toggle();

        let profileImagePath;
        let coverImagePath;
        try {
            const profileImageUID = await storeNFT(
                formData.profileImage as File,
                formData.name,
                "Profile Image"
            );
            profileImagePath = profileImageUID.url;
            console.log(profileImagePath);
            handleChangeBasic(profileImagePath, setFormData, "profileImage");

            const coverImageUID = await storeNFT(
                formData.coverImage as File,
                formData.name,
                "Cover Image"
            );
            coverImagePath = coverImageUID.url;
            console.log(coverImagePath);
            handleChangeBasic(coverImagePath, setFormData, "coverImage");
        } catch (error) {
            confirmDialog.toggle();
            handleReset();
            toast.error("Couldn't save your NFT on IPFS. Please try again");
            return;
        }

        let contract;
        try {
            console.log(formData);
            contract = await deployGovernorContract(signer_data as Signer, {
                name: formData.name,
                tokenAddress: formData.tokenAddress,
                votingPeriod: +formData.votingPeriod * BLOCKS_IN_DAY,
                quorumPercentage: +formData.quorumPercentage,
            });
            handleNext();
            await contract.deployed();
            handleNext();
            handleNext();
            handleChangeBasic(contract.address, setFormData, "contractAddress");
        } catch (error) {
            confirmDialog.toggle();
            handleReset();
            toast.error("Please approve transaction to create DAO");
            return;
        }

        const chainId = await signer_data.getChainId();
        handleChangeBasic(chainId, setFormData, "chainId");

        try {
            const moralisDao = getMoralisInstance(MoralisClassEnum.DAO);
            setFieldsIntoMoralisInstance(moralisDao, formData);
            console.log("Contract Address for Moralis", contract.address);
            // use state not update immediately
            moralisDao.set("contractAddress", contract.address);
            moralisDao.set("chainId", chainId);
            moralisDao.set("profileImage", profileImagePath);
            moralisDao.set("coverImage", coverImagePath);
            await saveMoralisInstance(moralisDao);
        } catch (error) {
            confirmDialog.toggle();
            toast.error("Couldn't save your DAO on backend. Please try again");
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
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputText
                            label="NFT Address"
                            name="tokenAddress"
                            placeholder="NFT which will be used in DAO (Ox...)"
                            labelTitle="NFT Address"
                            pattern={"^0x[a-fA-F0-9]{40}$"}
                            value={formData.tokenAddress}
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
                        <CheckboxGroup
                            label={"DAO Type"}
                            description={"You can choose one or more types"}
                            values={DaoTypeValues}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "type")
                            }
                        />
                        <div className="flex flex-row">
                            <DragAndDropImage
                                label="Profile Image"
                                name="profileImage"
                                className="w-1/3 mr-10"
                                handleChange={(file) =>
                                    handleImageChange(file, setFormData, "profileImage")
                                }
                            />
                            <DragAndDropImage
                                label="Cover Image"
                                name="coverImage"
                                className="w-2/3"
                                handleChange={(file) =>
                                    handleImageChange(file, setFormData, "coverImage")
                                }
                            />
                        </div>
                        <CheckboxGroup
                            label={"DAO Blockchain"}
                            description={"You can choose one or more blockchains"}
                            values={CHAINS}
                            images={CHAINS_IMG}
                            enabledValues={formData.enabledBlockchains}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
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
                <StepperDialog dialog={confirmDialog} className="dialog" activeStep={activeStep}>
                    <p className="ml-7">Deployment successful!</p>
                    <p className="ml-7 mb-10">Contract Address: {formData.contractAddress}</p>
                    <Link href={`/daos/${formData.contractAddress}`}>
                        <button
                            className="form-submit-button"
                            onClick={() => {
                                confirmDialog.toggle();
                            }}
                        >
                            View DAO
                        </button>
                    </Link>
                </StepperDialog>
            </Layout>
        </div>
    );
};

export default CreateDAO;
