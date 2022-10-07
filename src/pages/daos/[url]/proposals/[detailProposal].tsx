import React, { useEffect, useState } from "react";
import { useSigner, useSwitchNetwork } from "wagmi";
import { useDialogState } from "ariakit";
import toast from "react-hot-toast";
import type { GetServerSideProps, NextPage } from "next";
import Layout from "components/Layout/Layout";
import { BackButton } from "components/Button/";
import { Button, RadioSelector } from "components/Form";
import { validateForm } from "utils/functions";
import { handleNext, handleReset } from "components/Dialog/base-dialogs";
import { IProposal, IProposalDetail, IProposalPageForm } from "types/pages";
import { handleTextChangeAddNewMember } from "utils/handlers/eventHandlers";
import { castVote } from "interactions/contract/basic/writeGovernorContract";
import { IDetailProposalProps, IDetailProposalQuery } from "types/pageQueries";
import { ProposalVoteDialog } from "components/Dialog/ProposalPageDialogs";
import {
    AboutProposalCard,
    InfoProposalCard,
    ProposalActivityBadge,
    VotingResultsCard,
} from "components/Cards/ProposalCard";
import { handleContractError } from "utils/handlers/errorHandlers";
import { MockupLoadingProposals } from "components/Mockup/Loading";
import { useRouter } from "next/router";
import { checkCorrectNetwork, getProposer, proposalSnapshot } from "interactions/contract";

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

    const [proposalData, setProposalData] = useState<IProposalDetail>();

    const { data: signerData } = useSigner();

    const router = useRouter();
    const { switchNetwork } = useSwitchNetwork();

    const confirmDialog = useDialogState();
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const query = router.query;
        const savedProposals: IProposalPageForm[] = JSON.parse(localStorage.getItem(query.url + " Proposals"));

        const loadingProposal = async () => {
            if (savedProposals) {
                const proposal: IProposalDetail = savedProposals.find((prop) => prop.proposalId === detailProposal);
                if (proposal) {
                    setProposalData(() => proposal);

                    const startTimestamp = await proposalSnapshot(
                        proposal.governorAddress,
                        proposal.chainId,
                        proposal.proposalId
                    );
                    const proposer = await getProposer(proposal.governorAddress, proposal.chainId, proposal.proposalId);

                    setProposalData((prevState) => ({
                        ...prevState,
                        startDateTimestamp: startTimestamp,
                        ownerAddress: proposer,
                    }));
                }
            }
        };

        loadingProposal().catch(console.error);
    }, [router]);

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
