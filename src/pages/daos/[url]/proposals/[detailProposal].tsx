import React, { useEffect, useState } from "react";
import { useSigner, useSwitchNetwork } from "wagmi";
import { useDialogState } from "ariakit";
import toast from "react-hot-toast";
import type { GetServerSideProps, NextPage } from "next";
import Layout, {
    AboutProposalCard,
    BackButton,
    Button,
    InfoProposalCard,
    MockupLoadingProposals,
    ProposalActivityBadge,
    ProposalVoteDialog,
    RadioSelector,
    VotingResultsCard,
} from "components";
import { handleContractError, handleTextChangeAddNewMember, validateForm } from "utils";
import { IDetailProposalProps, IDetailProposalQuery, IProposal, IProposalDetail, IProposalPageForm } from "types";
import { castVote, checkCorrectNetwork, getProposer, proposalSnapshot } from "interactions/contract";
import { useRouter } from "next/router";
import { useCounter, useReadLocalStorage } from "usehooks-ts";

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
    const { data: signerData } = useSigner();
    const { switchNetwork } = useSwitchNetwork();
    const [proposalData, setProposalData] = useState<IProposalDetail>();
    const confirmDialog = useDialogState();
    const { count: activeStep, increment: incrementActiveStep, reset: resetActiveStep } = useCounter(0);

    const router = useRouter();
    const url = (router.query as IDetailProposalQuery).url;
    const storageProposals = useReadLocalStorage<IProposalPageForm[]>(`${url} Proposals`);

    useEffect(() => {
        const savedProposals: IProposalPageForm[] = storageProposals;

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
        resetActiveStep();
        confirmDialog.toggle();
        try {
            const tx = await castVote(proposalData!.governorAddress, signerData, detailProposal, formData!.voteResult);
            console.log(tx);
            toast.success("Your vote is send");
        } catch (e: any) {
            handleContractError(e, { dialog: confirmDialog });
        }
        incrementActiveStep();
        incrementActiveStep();
        incrementActiveStep();
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
