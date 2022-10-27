import React, { useState } from "react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { ICreateProposal, IDAOPageForm, INFTVoting, IQuery } from "types";
import { useSigner, useSwitchNetwork } from "wagmi";
import Layout, {
    BackButton,
    Button,
    CreateProposalDialog,
    InputText,
    InputTextArea,
    RadioSelectorNFT,
} from "components";
import { handleAddArray, handleChangeBasic, handleContractError, handleTextChange, validateForm } from "utils";
import { useDialogState } from "ariakit";
import { checkCorrectNetwork, createProposal, createTransferProposal, getTokenSymbol } from "interactions/contract";
import { Signer } from "ethers";
import { saveNewProposal } from "interactions/database";
import { useCounter, useEffectOnce, useReadLocalStorage } from "usehooks-ts";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const getServerSideProps: GetServerSideProps = async (context) => ({
    props: context.params,
});

const CreateProposal: NextPage<IQuery> = ({ url }) => {
    const [formData, setFormData] = useState<ICreateProposal>({
        governorAddress: "",
        governorUrl: "",
        name: "",
        shortDescription: "",
        tokenAddress: "",
        tokenName: "",
        description: "",
        options: [],
        blockchain: [],
        type: "voting",
        // enabledBlockchains: []
    });
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();

    const [NFTs, setNFTs] = useState<INFTVoting[]>();
    const confirmDialog = useDialogState();
    const { count: activeStep, increment: incrementActiveStep, reset: resetActiveStep } = useCounter(0);

    const storageDao = useReadLocalStorage<IDAOPageForm>(url);
    const storageNFTs = useReadLocalStorage<INFTVoting[]>(`${url} NFTs`);

    useEffectOnce(() => {
        const DAO: IDAOPageForm = storageDao;

        if (DAO) {
            handleChangeBasic(DAO.governorAddress, setFormData, "governorAddress");
            handleChangeBasic(DAO.url, setFormData, "governorUrl");
            handleAddArray(DAO.blockchain, setFormData, "blockchain");
            handleChangeBasic(+DAO.chainId, setFormData, "chainId");
            handleChangeBasic(getTokenSymbol(+DAO.chainId), setFormData, "currency");
            handleChangeBasic(DAO.treasuryAddress ? DAO.treasuryAddress : "", setFormData, "treasuryAddress");
        }

        setNFTs(storageNFTs);
    });

    async function createProposalContract(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const ignoreFields = ["options"].concat(
            formData.type === "voting" && ["receiverAddress", "receiveAmount", "treasuryAddress"]
        );

        if (!validateForm(formData, ignoreFields)) {
            return;
        }

        if (!(await checkCorrectNetwork(signerData, formData.chainId, switchNetwork))) {
            return;
        }

        resetActiveStep();
        confirmDialog.toggle();

        let proposalId;
        try {
            proposalId =
                formData.type === "voting"
                    ? await createProposal(
                          formData.governorAddress,
                          signerData as Signer,
                          formData.name,
                          formData.tokenAddress
                      )
                    : await createTransferProposal(
                          formData.governorAddress,
                          signerData,
                          formData.name,
                          formData.tokenAddress,
                          formData.treasuryAddress,
                          formData.receiverAddress,
                          formData.receiveAmount
                      );
            incrementActiveStep();
            incrementActiveStep();
            handleChangeBasic(proposalId, setFormData, "proposalId");
            incrementActiveStep();
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            return;
        }

        try {
            const chainId = await signerData.getChainId();
            const proposal: ICreateProposal = {
                ...formData,
                chainId: chainId,
                proposalId: proposalId,
            };

            await saveNewProposal(proposal);
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            return;
        }
    }

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={createProposalContract}>
                        <BackButton />
                        <div className="text-highlighter items-center flex flex-col md:flex-row">
                            New Proposal for
                            <div
                                className={"text-highlighter text-primary capitalize md:ml-4"}
                            >{`${formData?.governorUrl}`}</div>
                        </div>
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

                        <label className="label">
                            <div className="flex gap-2 items-center">
                                <span className="input-label">Proposal Type</span>
                                <div
                                    data-tip="Treasury is needed for executing proposal"
                                    className={"tooltip tooltip-bottom"}
                                >
                                    <InformationCircleIcon className={"h-4 w-4 text-base-content"} />
                                </div>
                            </div>
                        </label>

                        <div className="btn-group">
                            <input
                                type="radio"
                                name="type"
                                data-title="Voting"
                                className="btn radio-button"
                                onClick={() => {
                                    setFormData((prevState) => ({ ...prevState, type: "voting" }));
                                    handleChangeBasic("", setFormData, "receiveAmount");
                                    handleChangeBasic("", setFormData, "receiverAddress");
                                }}
                                defaultChecked
                            />
                            <input
                                type="radio"
                                name="type"
                                data-title="Executing"
                                disabled={!formData.treasuryAddress}
                                className="btn radio-button"
                                onClick={() => {
                                    setFormData((prevState) => ({ ...prevState, type: "executing" }));
                                }}
                            />
                        </div>

                        {formData.type === "executing" && (
                            <div className={"executing-block flex justify-between"}>
                                <InputText
                                    label="Member's wallet address"
                                    pattern={"^0x[a-fA-F0-9]{40}$"}
                                    name="receiverAddress"
                                    className={"max-w-lg"}
                                    placeholder="0x..."
                                    handleChange={(event) => {
                                        handleTextChange(event, setFormData);
                                    }}
                                />
                                <div className="form-control">
                                    <label className="label">
                                        <span className="input-label">Enter amount</span>
                                    </label>
                                    <label className="input-group">
                                        <span className={"uppercase input-field bg-base-300"}>{formData.currency}</span>
                                        <input
                                            name={"receiveAmount"}
                                            type="number"
                                            step={0.001}
                                            min={0.001}
                                            max={10}
                                            placeholder="0.01"
                                            className="input-field w-40"
                                            onChange={(event) => handleTextChange(event, setFormData)}
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        <label className="label">
                            <span className={"input-label"}>Choose voting token</span>
                        </label>
                        {NFTs && (
                            <RadioSelectorNFT
                                name={"tokenAddress"}
                                chainId={formData.chainId}
                                className={"nft-cards-grid"}
                                handleChange={(event, votingNFT) => {
                                    handleChangeBasic(votingNFT.title, setFormData, "tokenName");
                                    handleChangeBasic(votingNFT.tokenAddress, setFormData, "tokenAddress");
                                }}
                                values={NFTs}
                            />
                        )}
                        <Button className="mt-5">Create Proposal</Button>
                    </form>
                </section>

                <CreateProposalDialog dialog={confirmDialog} formData={formData} activeStep={activeStep} />
            </Layout>
        </div>
    );
};

export default CreateProposal;
