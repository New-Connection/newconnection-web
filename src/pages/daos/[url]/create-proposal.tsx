import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { ICreateProposal, IDAOPageForm, INFTVoting } from "types/forms";
import { useSigner, useSwitchNetwork } from "wagmi";
import Layout from "components/Layout/Layout";
import { handleAddArray, handleChangeBasic, handleTextChange } from "utils/handlers";
import { Button, CheckboxGroup, InputText, InputTextArea, RadioSelectorNFT } from "components/Form";
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
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { handleNext, handleReset } from "components/Dialog/base-dialogs";
import { ICreateProposalQuery } from "types/queryInterfaces";
import { CreateProposalDialog } from "components/Dialog/CreateProposalDialogs";
import { checkCorrectNetwork } from "logic";
import { handleContractError } from "utils/errors";

const CreateProposal: NextPage = () => {
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
        // enabledBlockchains: []
    });
    const router = useRouter();
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();

    const [NFTs, setNFTs] = useState<INFTVoting[]>();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const query = router.query as ICreateProposalQuery;
        const DAO: IDAOPageForm = JSON.parse(localStorage.getItem(query.url));

        if (DAO) {
            handleChangeBasic(DAO.governorAddress, setFormData, "governorAddress");
            handleChangeBasic(DAO.url, setFormData, "governorUrl");
            handleAddArray(DAO.blockchain, setFormData, "blockchain");
            handleChangeBasic(+DAO.chainId, setFormData, "chainId");
        }

        setNFTs(JSON.parse(localStorage.getItem(query.url + " NFTs")));
        // handleChangeBasicArray(query.blockchains, setFormData, "enabledBlockchains");
    }, [router]);

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
            handleContractError(error, { dialog: confirmDialog });
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
                                className={"text-highlighter text-purple capitalize md:ml-4"}>{`${formData?.governorUrl}`}</div>
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
                        <CheckboxGroup
                            label="Proposal Blockchain"
                            images={true}
                            values={formData.blockchain}
                            // description="You can choose one or more blockchains"
                            // values={[...getChainNames()]}
                            // enabledValues={formData.enabledBlockchains}
                            // handleChange={(event) =>
                            //     handleCheckboxChange(event, formData, setFormData, "blockchain")
                            // }
                        />
                        <div className={"input-label"}>Choose voting token</div>
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
