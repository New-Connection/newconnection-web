import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { ICreateProposal, ICreateProposalQuery, IDAOPageForm, INFTVoting } from "types";
import { useSigner, useSwitchNetwork } from "wagmi";
import Layout, {
    BackButton,
    Button,
    CheckboxGroup,
    CreateProposalDialog,
    InputText,
    InputTextArea,
    RadioSelectorNFT,
} from "components";
import { handleAddArray, handleChangeBasic, handleContractError, handleTextChange, validateForm } from "utils";
import { useDialogState } from "ariakit";
import { checkCorrectNetwork, createProposal } from "interactions/contract";
import { useRouter } from "next/router";
import { Signer } from "ethers";
import { saveNewProposal, } from "interactions/database";
import { useCounter, useReadLocalStorage } from "usehooks-ts";

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
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();

    const [NFTs, setNFTs] = useState<INFTVoting[]>();
    const confirmDialog = useDialogState();
    const { count: activeStep, increment: incrementActiveStep, reset: resetActiveStep } = useCounter(0);

    const router = useRouter();
    const url = (router.query as ICreateProposalQuery).url;
    const storageDao = useReadLocalStorage<IDAOPageForm>(url);
    const storageNFTs = useReadLocalStorage<INFTVoting[]>(`${url} NFTs`);

    useEffect(() => {
        const DAO: IDAOPageForm = storageDao;

        if (DAO) {
            handleChangeBasic(DAO.governorAddress, setFormData, "governorAddress");
            handleChangeBasic(DAO.url, setFormData, "governorUrl");
            handleAddArray(DAO.blockchain, setFormData, "blockchain");
            handleChangeBasic(+DAO.chainId, setFormData, "chainId");
        }

        setNFTs(storageNFTs);
    }, [router]);

    async function createProposalContract(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateForm(formData, ["options"])) {
            return;
        }

        if (!(await checkCorrectNetwork(signerData, formData.chainId, switchNetwork))) {
            return;
        }

        resetActiveStep();
        confirmDialog.toggle();

        let proposalId;
        try {
            proposalId = await createProposal(
                formData.governorAddress,
                signerData as Signer,
                formData.name,
                formData.tokenAddress
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
