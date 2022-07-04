import { BaseSyntheticEvent, ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
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
} from "components/Form";
import { handleTextChange, handleImageChange, handleCheckboxChange } from "utils/handlers";
import { CreateDAO } from "types/forms";
import { validateForm } from "utils/validate";
import toast from "react-hot-toast";

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

const CreateDAO: NextPage = () => {
    const [formData, setFormData] = useState<CreateDAO>({
        name: "",
        goals: "",
        profileImage: {},
        coverImage: {},
        type: [],
        blockchain: [],
        description: "",
    });

    const { data: signer_data } = useSigner();

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
        console.log("submited");
        // DIDN'T
        // const singer_right = await signer?.connect()
        // const factory = CreateNFTContract(bytecode=bytecodeERC20, singer_right})
        // const contract = await factory.deploy({name}, {description}, {count})
        // await contract.deployed()
        // console.log(`Deployment successful! Contract Address: ${contract.address}`)
    };

    return (
        <>
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
                            // isRequired
                            maxLength={30}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputText
                            label="DAO Goals"
                            name="goals"
                            placeholder="Сlear DAO goals"
                            maxLength={100}
                            // isRequired
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
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
            </Layout>
        </>
    );
};

export default CreateDAO;
