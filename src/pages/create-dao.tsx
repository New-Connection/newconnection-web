import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { NextPage } from "next";
import { useSigner, useSwitchNetwork } from "wagmi";
import toast from "react-hot-toast";
import { useDialogState } from "ariakit";
import { Signer } from "ethers";
import Link from "next/link";
import { ICreate, ICreateDAO } from "types/forms";
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
    handleChangeBasicSimple,
} from "utils/handlers";
import { deployGovernorContract } from "contract-interactions/";
import { BLOCKS_IN_DAY } from "utils/constants";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { useRouter } from "next/router";
import { StepperDialog, handleReset, handleNext } from "components/Dialog/base-dialogs";
import { CHAINS, getChainNames } from "utils/blockchains";
import { storeNFT } from "utils/ipfsUpload";
import { useMoralisQuery } from "react-moralis";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import { formatAddress } from "utils/address";
import { ICreateDaoQuery } from "types/queryInterfaces";

const DaoTypeValues = ["Grants", "Investment", "Social"];

const createUrl = (name: string): string => {
    // console.log("url: ", name);
    return name.replace(/ /g, "-");
};

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
        type: [],
        blockchain: [],
        description: "",
        isActive: false,
    });

    const { data: signer_data } = useSigner();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    const { switchNetwork } = useSwitchNetwork();

    const { fetch: urlFetch } = useMoralisQuery(
        "DAO",
        (query) => query.equalTo("url", formData.url),
        [formData.url],
        {
            autoFetch: false,
        }
    );

    const checkUrlAvailability = async () => {
        let available = false;
        await urlFetch({
            onSuccess: (results) => {
                available = results.length === 0;
            },
            onError: (e) => {
                console.log("error" + e)
            }
        });
        return available;
    };

    const handleDaoNameUrlChange = <T extends ICreate,
        E extends HTMLInputElement | HTMLTextAreaElement>(
        event: ChangeEvent<E>,
        set: Dispatch<SetStateAction<T>>,
        field: string
    ) => {
        set((prev) => ({ ...prev, [event.target.name]: event.target.value }));
        handleChangeBasic(createUrl(event.target.value), set, field);
    };

    useEffect(() => {
        const query = router.query as ICreateDaoQuery;
        handleChangeBasicSimple(query.tokenAddress, setFormData, "tokenAddress");
        handleChangeBasic(query.enabledBlockchains, setFormData, "enabledBlockchains");
    }, []);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData)) {
            return;
        }

        const isUrlAvailable = await checkUrlAvailability();
        if (!isUrlAvailable) {
            toast.error("Name unavailable");
            return;
        }
        console.log(formData.url);

        switchNetwork(CHAINS[formData.blockchain[0]].id);

        handleReset(setActiveStep);
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
            handleReset(setActiveStep);
            toast.error("Couldn't save your NFT on IPFS. Please try again");
            return;
        }

        let contract;
        try {
            contract = await deployGovernorContract(signer_data as Signer, {
                name: formData.name,
                tokenAddress: formData.tokenAddress[0],
                votingPeriod: +formData.votingPeriod * BLOCKS_IN_DAY,
                quorumPercentage: +formData.quorumPercentage,
            });
            handleNext(setActiveStep);
            await contract.deployed();
            handleNext(setActiveStep);
            handleNext(setActiveStep);
            handleChangeBasic(contract.address, setFormData, "governorAddress");
        } catch (error) {
            confirmDialog.toggle();
            handleReset(setActiveStep);
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
            moralisDao.set("governorAddress", contract.address);
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
                            handleChange={(event) =>
                                handleDaoNameUrlChange(event, setFormData, "url")
                            }
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
                            images={true}
                            description={"You can choose one or more blockchains"}
                            values={[...getChainNames()]}
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
                    <div className="flex ml-7 mb-10">Contract Address:
                        <div
                            className={
                                "flex ml-4 text-lightGray hover:text-gray5 hover:cursor-pointer"
                            }
                            onClick={() =>
                                navigator.clipboard.writeText(formData.governorAddress)
                            }
                        >
                            {formatAddress(formData.governorAddress)}
                            <ClipboardCopyIcon className="h-6 w-5" />
                        </div>
                    </div>
                    <Link href={`/daos/${formData.url}`}>
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
