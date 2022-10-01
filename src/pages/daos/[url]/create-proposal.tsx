import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import toast from "react-hot-toast";
import { IMultiNFTVoting } from "types/forms";
import { useSigner, useSwitchNetwork } from "wagmi";
import Layout from "components/Layout/Layout";
import {
    handleTextChange,
    handleCheckboxChange,
    handleChangeBasic,
    handleTextChangeAddNewMember,
    handleAddArray,
    handleChangeBasicArray
} from "utils/handlers";
import {
    CheckboxGroup,
    InputText,
    Button,
    InputTextArea,
    RadioSelectorMulti
} from "components/Form";
import { ICreateProposal } from "types/forms";
import { BackButton } from "components/Button/";
import { useDialogState } from "ariakit";
import { validateForm } from "utils/validate";
import { createProposal } from "contract-interactions/writeGovernorContract";
import { useRouter } from "next/router";
import { Signer } from "ethers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance
} from "database/interactions";
import { handleNext, handleReset } from "components/Dialog/base-dialogs";
import { useMoralisQuery, useMoralis } from "react-moralis";
import { getChainNames } from "utils/blockchains";
import { ICreateProposalQuery } from "types/queryInterfaces";
import { CreateProposalDialog } from "components/Dialog/CreateProposalDialogs";
import { fetchDAO } from "network";
import { checkCorrectNetwork } from "logic";

const CreateProposal: NextPage = () => {
    const [formData, setFormData] = useState<ICreateProposal>({
        governorAddress: "",
        name: "",
        shortDescription: "",
        tokenAddress: "",
        tokenName: "",
        description: "",
        options: [],
        blockchain: [],
        enabledBlockchains: []
    });
    const router = useRouter();
    const [votingNFTs, setVotingNFTs] = useState<IMultiNFTVoting>();
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const { isInitialized } = useMoralis();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    const { fetch: DaoQuery } = useMoralisQuery(
        "DAO",
        (query) => {
            return query.equalTo("governorAddress", formData.governorAddress);
        },
        [formData.governorAddress],
        {
            autoFetch: false
        }
    );

    useEffect(() => {
        const query = router.query as ICreateProposalQuery;

        handleChangeBasic(query.governorAddress, setFormData, "governorAddress");
        handleChangeBasicArray(query.blockchains, setFormData, "enabledBlockchains");
        handleChangeBasic(query.chainId, setFormData, "chainId");
    }, [router]);

    useEffect(() => {
        if (formData.governorAddress) {
            console.log("fetch dao");

            const fetchLocalStorage = (newVotingTokens: IMultiNFTVoting) => {
                const tokensNames = [];

                const saved = localStorage.getItem(newVotingTokens.daoName + " NFTs");
                const initialValue = JSON.parse(saved);
                initialValue.map((object) => {
                    tokensNames.push(object.title);
                });

                return tokensNames;
            };

            const fetchData = async () => {
                const { newDao: dao } = await fetchDAO(isInitialized, DaoQuery);
                if (dao) {
                    const newVotingTokens: IMultiNFTVoting = {
                        daoAddress: dao.governorAddress,
                        tokenAddress: dao.tokenAddress,
                        daoName: dao.name
                    };

                    setVotingNFTs(() => newVotingTokens);
                    handleAddArray(fetchLocalStorage(newVotingTokens), setVotingNFTs, "tokenNames");
                }
            };

            fetchData().catch(console.error);
        }
    }, [formData.governorAddress]);

    async function createProposalContract(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateForm(formData, ["options"])) {
            return;
        }

        if (!(await checkCorrectNetwork(signerData, formData.chainId, switchNetwork))) {
            return;
        }

        handleReset(setActiveStep);
        confirmDialog.toggle();

        let proposalId;
        console.log("0", formData.tokenAddress);
        try {
            proposalId = await createProposal(
                formData.governorAddress,
                signerData as Signer,
                formData.name,
                formData.tokenAddress
            );
            handleNext(setActiveStep);
            handleNext(setActiveStep);
            handleChangeBasic(proposalId, setFormData, "proposalId");
            handleNext(setActiveStep);
        } catch (error) {
            console.log(error);
            confirmDialog.toggle();
            toast.error("Please approve transaction to create DAO");
            return;
        }

        try {
            const chainId = await signerData.getChainId();
            handleChangeBasic(chainId.toString(), setFormData, "chainId");
            const moralisProposal = getMoralisInstance(MoralisClassEnum.PROPOSAL);
            setFieldsIntoMoralisInstance(moralisProposal, formData);
            moralisProposal.set("proposalId", proposalId);
            moralisProposal.set("chainId", chainId);
            await saveMoralisInstance(moralisProposal);
        } catch (error) {
            confirmDialog.toggle();
            toast.error("Сouldn't save your DAO. Please try again");
            return;
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <BackButton />
                    <form
                        className="mx-auto flex max-w-4xl flex-col gap-4"
                        onSubmit={createProposalContract}
                    >
                        <h1 className="text-highlighter">New Proposal</h1>
                        <InputText
                            label="Title"
                            name="name"
                            placeholder="Title of purpose"
                            handleChange={(event) => {
                                handleTextChange(event, setFormData);
                            }}
                        />
                        <InputTextArea
                            label="Short Description"
                            name="shortDescription"
                            placeholder="A short description of your proposal"
                            maxLength={250}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                        />
                        <InputTextArea
                            label="Description"
                            name="description"
                            placeholder="A full description of your proposal"
                            maxLength={3000}
                            handleChange={(event) => handleTextChange(event, setFormData)}
                            isRequired
                        />
                        <CheckboxGroup
                            label="Proposal Blockchain"
                            description="You can choose one or more blockchains"
                            images={true}
                            values={[...getChainNames()]}
                            enabledValues={formData.enabledBlockchains}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
                        />
                        <p>Choose voting token</p>
                        {votingNFTs ? (
                            <RadioSelectorMulti
                                name="tokenAddress"
                                labels={[...votingNFTs.tokenNames]}
                                handleChange={(event) => {
                                    // setting tokenName
                                    const currentTokenName =
                                        event.currentTarget.nextSibling.textContent.slice(1);
                                    handleChangeBasic(currentTokenName, setFormData, "tokenName");

                                    // setting tokenAddress
                                    handleTextChangeAddNewMember(event, setFormData);
                                }}
                                values={votingNFTs.tokenAddress}
                            />
                        ) : (
                            <></>
                        )}
                        <Button className="mt-5">Create Proposal</Button>
                    </form>
                </section>

                <CreateProposalDialog
                    dialog={confirmDialog}
                    formData={formData}
                    activeStep={activeStep}
                />
            </Layout>
        </div>
    );
};

export default CreateProposal;
