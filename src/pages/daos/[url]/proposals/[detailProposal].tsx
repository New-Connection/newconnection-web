import React, { useEffect, useState } from "react";
import { useSigner, useSwitchNetwork } from "wagmi";
import { useDialogState } from "ariakit";
import toast from "react-hot-toast";
import type { GetServerSideProps, NextPage } from "next";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Layout from "components/Layout/Layout";
import { BackButton } from "components/Button/";
import { Button, RadioSelector } from "components/Form";
import { validateForm } from "utils/validate";
import { handleNext, handleReset } from "components/Dialog/base-dialogs";
import { IProposal, IProposalDetail } from "types/forms";
import { handleTextChangeAddNewMember } from "utils/handlers";
import { castVote } from "contract-interactions/writeGovernorContract";
import { IDetailProposalQuery } from "types/queryInterfaces";
import { IDetailProposalProps } from "types/pagePropsInterfaces";
import { ProposalVoteDialog } from "components/Dialog/ProposalPageDialogs";
import { checkCorrectNetwork } from "logic";
import { fetchDetailProposal } from "network/fetchProposals";
import {
    AboutProposalCard,
    InfoProposalCard,
    ProposalActivityBadge,
    VotingResultsCard,
} from "components/Cards/ProposalCard";
import { handleContractError } from "utils/errors";
import { MockupLoadingProposals } from "components/Mockup/Loading";

export const getServerSideProps: GetServerSideProps<IDetailProposalProps, IDetailProposalQuery> = async (context) => {
    const { detailProposal } = context.params as IDetailProposalQuery;
    const result: IDetailProposalProps = {
        detailProposal: detailProposal,
    };
    return {
        props: result,
    };
};

const DetailProposal: NextPage<IDetailProposalProps> = ({ detailProposal }) => {
    const [formData, setFormData] = useState<IProposal>({
        voteResult: undefined,
        txConfirm: "",
    });
    const [activeStep, setActiveStep] = useState(0);
    const { data: signerData } = useSigner();
    const confirmDialog = useDialogState();
    const { isInitialized } = useMoralis();
    const [proposalData, setProposal] = useState<IProposalDetail>();
    const { switchNetwork } = useSwitchNetwork();

    const { fetch: ProposalDetailQuery } = useMoralisQuery(
        "Proposal",
        (query) => query.equalTo("proposalId", detailProposal),
        [],
        {
            autoFetch: false,
        }
    );

    useEffect(() => {
        const loadingProposal = async () => {
            if (isInitialized) {
                const newProposal = await fetchDetailProposal(ProposalDetailQuery);
                if (newProposal) {
                    setProposal(() => newProposal);
                }
            }
        };

        loadingProposal().catch(console.error);
    }, [isInitialized]);

    // send voted
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!(await checkCorrectNetwork(signerData, proposalData.chainId, switchNetwork))) {
            return;
        }

        if (!validateForm(formData, ["name", "txConfirm"])) {
            return;
        }
        handleReset(setActiveStep);
        confirmDialog.toggle();
        try {
            const tx = await castVote(proposalData!.governorAddress, signerData, detailProposal, formData!.voteResult);
            console.log(tx);
            toast.success("Your vote is send");
        } catch (e: any) {
            handleContractError(e, { dialog: confirmDialog });
        }
        handleNext(setActiveStep, 3);
    }

    return proposalData ? (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={onSubmit}>
                        <BackButton />
                        <div className="flex justify-between">
                            <h1 className="text-highlighter capitalize w-1/2">{proposalData.name}</h1>
                            <ProposalActivityBadge isActive={proposalData.isActive} />
                        </div>
                        <p className="pb-4">{proposalData.shortDescription}</p>
                        <div className="flex gap-6 pb-10">
                            <AboutProposalCard proposalData={proposalData} />
                            <InfoProposalCard proposalData={proposalData} />
                            <VotingResultsCard proposalData={proposalData} />
                        </div>
                        <RadioSelector
                            name="voteResult"
                            labels={["Against", "In favor"]}
                            handleChange={(event) => handleTextChangeAddNewMember(event, setFormData)}
                        />
                        <Button className="mt-10">
                            <p>Vote</p>
                        </Button>
                    </form>
                </section>

                <ProposalVoteDialog dialog={confirmDialog} formData={formData} activeStep={activeStep} />
            </Layout>
        </div>
    ) : (
        <div>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <MockupLoadingProposals chain={proposalData?.chainId} />
                </section>
            </Layout>
        </div>
    );
};

export default DetailProposal;
