import { FormEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import { useSigner } from "wagmi";
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
    SubmitButton,
} from "components/Form";
import {
    handleChangeBasic,
    handleCheckboxChange,
    handleImageChange,
    handleTextChange,
} from "utils/handlers";
import { deployGovernorContract } from "contract-interactions/useDeployGovernorContract";
import { BLOCKS_IN_DAY } from "utils/constants";
import { BeatLoader } from "react-spinners";
import { LoadingDialog } from "components/Dialog";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import { CHAINS, CHAINS_IMG } from "utils/blockchains";

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

interface QueryUrlParams extends ParsedUrlQuery {
    tokenAddress: string;
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
    const [confirmFromBlockchain, setConfirmFromBlockchain] = useState(false);
    const confirmDialog = useDialogState();

    useEffect(() => {
        const query = router.query as QueryUrlParams;

        handleChangeBasic(query.tokenAddress, setFormData, "tokenAddress");

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

        confirmDialog.toggle();

        let contractAddress;
        try {
            contractAddress = await deployGovernorContract(signer_data as Signer, {
                name: formData.name,
                tokenAddress: formData.tokenAddress,
                votingPeriod: +formData.votingPeriod * BLOCKS_IN_DAY,
                quorumPercentage: +formData.quorumPercentage,
            });
            handleChangeBasic(contractAddress, setFormData, "contractAddress");
            setConfirmFromBlockchain(true);
        } catch (error) {
            confirmDialog.toggle();
            setConfirmFromBlockchain(false);
            toast.error("Please approve transaction to create DAO");
            return;
        }

        try {
            const chainId = await signer_data.getChainId();
            handleChangeBasic(chainId, setFormData, "chainId");

            const moralisDao = getMoralisInstance(MoralisClassEnum.DAO);
            setFieldsIntoMoralisInstance(moralisDao, formData);
            moralisDao.set("contractAddress", contractAddress);
            moralisDao.set("chainId", chainId);
            await saveMoralisInstance(moralisDao);
        } catch (error) {
            confirmDialog.toggle();
            setConfirmFromBlockchain(false);
            toast.error("Сouldn't save your DAO. Please try again");
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
                        <div className="flex justify-between">
                            <InputAmount
                                label="Voting Period"
                                name="votingPeriod"
                                className="w-2/5"
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
                            values={CHAINS}
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

                        <SubmitButton className="mt-5 nav-button">Create Contract</SubmitButton>
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
