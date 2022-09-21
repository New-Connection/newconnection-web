import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import type { GetServerSideProps, NextPage, NextPageContext } from "next";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSigner } from "wagmi";
import { IDAOPageForm, IProposalPageForm, IVotingNFTs } from "types/forms";
import Layout from "components/Layout/Layout";
import { handleTextChange, handleCheckboxChange, handleChangeBasic } from "utils/handlers";
import { CheckboxGroup, InputText, Button, InputTextArea } from "components/Form";
import { ICreateProposal } from "types/forms";
import BackButton from "components/Button/backButton";
import { useDialogState } from "ariakit";
import { validateForm } from "utils/validate";
import { CHAINS } from "utils/blockchains";
import { createProposal } from "contract-interactions/writeGovernorContract";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Signer } from "ethers";
import {
    getMoralisInstance,
    MoralisClassEnum,
    saveMoralisInstance,
    setFieldsIntoMoralisInstance,
} from "database/interactions";
import { StepperDialog } from "components/Dialog";
import { useMoralisQuery, useMoralis } from "react-moralis";

interface QueryUrlParams extends ParsedUrlQuery {
    address: string;
    governorAddress: string;
}

export const getServerSideProps = async (context: NextPageContext) => {
    const { query } = context;
    return { props: { query } };
};

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CreateProposal: NextPage = () => {
    const [formData, setFormData] = useState<ICreateProposal>({
        address: "",
        governorAddress: "",
        name: "",
        shortDescription: "",
        tokenAddress: "",
        description: "",
        options: [],
        blockchain: [],
        enabledBlockchains: [],
    });
    const router = useRouter();
    const [votingNFTs, setVotingNFTs] = useState<IVotingNFTs>();
    const { data: signer_data } = useSigner();
    //const [governorAddress, setGovernorAddress] = useState(null);
    //console.log("1", governorAddress);
    const { isInitialized } = useMoralis();
    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);
    const firstUpdate = useRef(true);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const { fetch } = useMoralisQuery(
        "DAO",
        (query) => {
            return query.equalTo("contractAddress", formData.governorAddress);
        },
        [formData.governorAddress],
        {
            autoFetch: false,
        }
    );

    const fetchData = async () => {
        console.log("isInitialized: ", isInitialized);
        if (isInitialized) {
            console.log("After Fetch Data");
            await fetch({
                onSuccess: async (results) => {
                    const votingTokens = results[0];
                    const newVotingTokens: IVotingNFTs = {
                        daoAddress: votingTokens.get("contractAddress"),
                        daoTokenAddresess: votingTokens.get("tokenAddress"),
                    };
                    setVotingNFTs(() => newVotingTokens);
                    // TODO: DELETE
                    handleChangeBasic(votingNFTs.daoTokenAddresess[0], setFormData, "tokenAddress");
                },
                onError: (error) => {
                    console.log("Error fetching db query" + error);
                },
            });
        }
    };

    const setupData = async () => {
        const query = router.query as QueryUrlParams;

        handleChangeBasic(query.address, setFormData, "address");
        handleChangeBasic(query.governorAddress, setFormData, "governorAddress");
        handleChangeBasic(query.blockchain, setFormData, "enabledBlockchains");
        //setGovernorAddress(query.governorAddress);
    };

    useEffect(() => {
        setupData();
    }, [isInitialized]);

    useIsomorphicLayoutEffect(() => {
        if (formData.governorAddress && firstUpdate.current) {
            console.log("IsomorphicLayout", formData.governorAddress);
            firstUpdate.current = false;
            fetchData();
        }
    });

    async function createProposalContract(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // await mintClick("0x6DF6474553A8B1cDe0Cc6Bc4c72d814CC2565B8F", signer_data as Signer);
        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData, ["options"])) {
            return;
        }
        handleReset();
        confirmDialog.toggle();

        let proposalId;
        try {
            proposalId = await createProposal(
                formData.governorAddress,
                signer_data as Signer,
                formData.name,
                votingNFTs.daoTokenAddresess[0]
            );
            handleNext();
            handleNext();
            handleChangeBasic(proposalId, setFormData, "proposalId");
            handleNext();
        } catch (error) {
            console.log(error);
            confirmDialog.toggle();
            toast.error("Please approve transaction to create DAO");
            return;
        }

        try {
            const chainId = await signer_data.getChainId();
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
                        {/* <FileAndLinkForm /> */}

                        <CheckboxGroup
                            label="Proposal Blockchain"
                            description="You can choose one or more blockchains"
                            values={[...CHAINS]}
                            enabledValues={formData.enabledBlockchains}
                            handleChange={(event) =>
                                handleCheckboxChange(event, formData, setFormData, "blockchain")
                            }
                        />
                        {votingNFTs ? <h1>{votingNFTs.daoTokenAddresess}</h1> : <></>}
                        <Button className="mt-5">Create Proposal</Button>
                    </form>
                </section>
                <StepperDialog dialog={confirmDialog} className="dialog" activeStep={activeStep}>
                    <p>Proposal created successful!</p>
                    <p>Proposal Id: {formData.proposalId}</p>
                    <Link href={`/daos/${formData.address}`}>
                        <button
                            className="form-submit-button"
                            onClick={() => {
                                confirmDialog.toggle();
                            }}
                        >
                            Back to DAO
                        </button>
                    </Link>
                </StepperDialog>
            </Layout>
        </div>
    );
};

export default CreateProposal;
