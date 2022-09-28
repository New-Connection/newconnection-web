import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { useSigner } from "wagmi";
import { useDialogState } from "ariakit";
import toast from "react-hot-toast";
import { ParsedUrlQuery } from "querystring";
import type { GetServerSideProps, NextPage } from "next";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Layout from "components/Layout/Layout";
import BackButton from "components/Button/backButton";
import { Button, RadioSelector } from "components/Form";
import { validateForm } from "utils/validate";
import { handleNext, handleReset, StepperDialog } from "components/Dialog";
import { IProposalDetail } from "types/forms";
import { handleTextChangeAddNewMember } from "utils/handlers";
import { MockupTextCard } from "components/Mockup";
import { castVote, VotingType } from "contract-interactions/writeGovernorContract";

interface QueryUrlParams extends ParsedUrlQuery {
    detailProposal: string;
}

interface DetailProposalProps {
    detailProposal: string;
}

export const getServerSideProps: GetServerSideProps<DetailProposalProps, QueryUrlParams> = async (
    context
) => {
    const { detailProposal } = context.params as QueryUrlParams;
    const result: DetailProposalProps = {
        detailProposal: detailProposal,
    };
    return {
        props: result,
    };
};

interface IProposal {
    voteResult: VotingType;
    txConfirm?: string;
}

const DetailProposal: NextPage<DetailProposalProps> = ({ detailProposal }) => {
    const [formData, setFormData] = useState<IProposal>({
        voteResult: undefined,
        txConfirm: "",
    });
    const [activeStep, setActiveStep] = useState(0);
    const { data: signer_data } = useSigner();
    const confirmDialog = useDialogState();
    const { isInitialized } = useMoralis();
    const [proposalData, setProposal] = useState<IProposalDetail>();

    const { fetch } = useMoralisQuery(
        "Proposal",
        (query) => query.equalTo("proposalId", detailProposal),
        [],
        {
            autoFetch: false,
        }
    );

    const fetchData = async () => {
        if (isInitialized) {
            await fetch({
                onSuccess: async (results) => {
                    const proposal = results[0];
                    const newProposal: IProposalDetail = {
                        title: proposal.get("name"),
                        description: proposal.get("description"),
                        shortDescription: proposal.get("shortDescription"),
                        governorAddress: proposal.get("governorAddress"),
                    };
                    setProposal(() => newProposal);
                    //console.log(newProposal);
                },
                onError: (error) => {
                    console.log("Error fetching db query" + error);
                },
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [isInitialized]);

    interface ICardProposal {
        title: string;
        children?: React.ReactNode;
        className?: string;
    }

    const CardProposal = ({ title, children, className }: ICardProposal) => {
        return (
            <div
                className={classNames(
                    "w-full h-64 border-2 border-gray rounded-xl mt-6 p-4",
                    className
                )}
            >
                <p className="text-purple mb-4 text-lg">{title}</p>
                {children}
            </div>
        );
    };

    const AboutCard = ({ description }) => {
        return (
            <CardProposal title="About" className="lg:w-1/3 w-full">
                <p className="text-sm line-clamp-6">{description}</p>
            </CardProposal>
        );
    };

    // send voted
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!signer_data) {
            toast.error("Please connect wallet");
            return;
        }

        if (!validateForm(formData, ["name", "txConfirm"])) {
            return;
        }
        handleReset(setActiveStep);
        confirmDialog.toggle();
        try {
            const tx = await castVote(
                proposalData!.governorAddress,
                signer_data,
                detailProposal,
                formData!.voteResult
            );
            console.log(tx);
            confirmDialog.toggle();
            toast.success("Your vote is send");
        } catch (e: any) {
            if (e.code === 4001) {
                confirmDialog.toggle();
                toast.error("User reject transaction");
                return;
            } else if (e.error.code === -32603) {
                confirmDialog.toggle();
                toast.error("User already voted");
                return;
            } else {
                confirmDialog.toggle();
                toast.error(e.message);
                return;
            }
        }
        handleNext(setActiveStep, 3);
    }

    return proposalData ? (
        <div>
            <Layout className="layout-base">
                <BackButton />
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={onSubmit}>
                        <div className="flex">
                            <h1 className="text-highlighter w-1/2">{proposalData.title}</h1>
                            {/* <BadgeIsActive isActive={false} /> */}
                        </div>
                        <p className="pb-4">{proposalData.shortDescription}</p>
                        <div className="flex gap-6 pb-10">
                            <AboutCard description={proposalData.description} />
                        </div>
                        <RadioSelector
                            name="voteResult"
                            labels={["Against", "In favor"]}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <Button className="mt-10">
                            <p>Vote</p>
                        </Button>
                    </form>
                </section>
                <StepperDialog
                    dialog={confirmDialog}
                    className="dialog"
                    activeStep={activeStep}
                    isClose={true}
                >
                    <p className="ml-7">Deployment successful!</p>
                    <p className="ml-7 mb-10">Contract Address: {formData.txConfirm}</p>

                    <button
                        className="form-submit-button"
                        onClick={() => {
                            confirmDialog.toggle();
                        }}
                    >
                        Back to proposal
                    </button>
                </StepperDialog>
            </Layout>
        </div>
    ) : (
        <div>
            <Layout className="layout-base">
                <section className="app-section flex h-full flex-1 flex-col gap-[50px]">
                    <MockupTextCard
                        label={"DAO not found"}
                        text={"Sorry, DAO not fount. Please try to reload page"}
                    />
                </section>
            </Layout>
        </div>
    );
};

export default DetailProposal;
