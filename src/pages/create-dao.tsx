import { FormEvent, useState } from "react";
import { NextPage } from "next";
import Layout from "components/Layout";
import Head from "next/head";
import { useSigner } from "wagmi";
import {
    DragAndDropImage,
    InputText,
    InputTextArea,
    SubmitButton,
    CheckboxGroup,
    InputAmount,
} from "components/Form";
import {
    handleTextChange,
    handleImageChange,
    handleCheckboxChange,
    handleChangeBasic,
} from "utils/handlers";
import { CreateDAO } from "types/forms";
import { validateForm } from "utils/validate";
import toast from "react-hot-toast";
import { useDialogState } from "ariakit";
import { Signer } from "ethers";
import { deployGovernorContract } from "../contract-interactions/useDeployGovernorContract";
import { BLOCKS_IN_DAY } from "../utils/constants";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import { LoadingDialog } from "../components/Dialog";
import Moralis from "moralis";

const DaoTypeValues = ["Grants", "Investment", "Social"];
const BlockchainValues = [
    "Arbitrum",
    "Aurora",
    "Avalanche",
    "Binance",
    "Ethereum",
    "Fantom",
    "Optimism",
    "Polygon",
];

const DaoObject = Moralis.Object.extend("Dao");
Moralis.Object.registerSubclass("Dao", DaoObject);

const CreateDAO: NextPage = () => {
    const [formData, setFormData] = useState<CreateDAO>({
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
    const [confirmFromBlockchain, setConfirmFromBlockchain] = useState(false);
    const confirmDialog = useDialogState();

    const saveObject = async () => {
        const daoObject = new DaoObject();

        for (const formDataKey in formData) {
            daoObject.set(formDataKey, formData[formDataKey]);
        }
        await daoObject.save().then(
            (dao) => {
                console.log("New DAO created with id: " + dao.id);
            },
            (error) => {
                toast.error(`Failed to create dao, please try again. Error(${error.message})`);
            }
        );
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData)) {
            return;
        }

        confirmDialog.toggle();

        const contractAddress = await deployGovernorContract(signer_data as Signer, {
            name: formData.name,
            tokenAddress: formData.tokenAddress,
            votingPeriod: +formData.votingPeriod * BLOCKS_IN_DAY,
            quorumPercentage: +formData.quorumPercentage,
        });
        handleChangeBasic(contractAddress, setFormData, "contractAddress");

        await saveObject();

        setConfirmFromBlockchain(true);
    };

    return (
        <div>
            <Head>
                <title>New Connection: Create DAO</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8">
                <section className="relative w-full">
                    <form className="mx-auto flex flex-col max-w-2xl gap-4" onSubmit={onSubmit}>
                        <h1 className="font-exo my-2 text-2xl font-semibold">Create DAO</h1>
                        <div className="flex flex-row">
                            <h2 className={"my-2 text-xl font-medium"}>DAO Name and Goals</h2>
                        </div>
                        <div className="flex flex-row">
                            <DragAndDropImage
                                label="Profile Image"
                                name="profileImage"
                                className={"w-1/3 mr-10"}
                                handleChange={(file) =>
                                    handleImageChange(file, setFormData, "profileImage")
                                }
                            />
                            <DragAndDropImage
                                label="Cover Image"
                                name="coverImage"
                                className={"w-2/3"}
                                handleChange={(file) =>
                                    handleImageChange(file, setFormData, "coverImage")
                                }
                            />
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
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputText
                            label="DAO Goals"
                            name="goals"
                            placeholder="Сlear DAO goals"
                            labelTitle="Сlear DAO goals"
                            maxLength={100}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <div className="flex justify-between">
                            <InputAmount
                                label={"Voting Period"}
                                name="votingPeriod"
                                className={"w-2/5"}
                                labelTitle="Length of period during which people can cast their vote."
                                placeholder="Voting period in days"
                                min={1}
                                max={10000}
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
                        <CheckboxGroup
                            label={"DAO Blockchain"}
                            description={"You can choose one or more blockchains"}
                            values={BlockchainValues}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
                        />
                        <InputTextArea
                            name={"description"}
                            label={"DAO Description"}
                            // isRequired
                            maxLength={2000}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />

                        <SubmitButton className="mt-5">Create Contract</SubmitButton>
                    </form>
                </section>
                <LoadingDialog
                    dialog={confirmDialog}
                    title="Loading into Blockchain"
                    className="dialog"
                >
                    {
                        <div>
                            {confirmFromBlockchain ? (
                                <>
                                    <p>Deployment successful!</p>
                                    <p>Contract Address: {formData.contractAddress}</p>
                                    <Link href="/">
                                        <button
                                            className="form-submit-button"
                                            onClick={() => {
                                                confirmDialog.toggle();
                                            }}
                                        >
                                            Back Home
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <p>Please confirm transaction in wallet</p>
                                    <BeatLoader />
                                </>
                            )}
                        </div>
                    }
                </LoadingDialog>
            </Layout>
        </div>
    );
};

export default CreateDAO;
