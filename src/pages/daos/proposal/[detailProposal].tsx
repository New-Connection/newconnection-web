import React, { useState } from "react";
import classNames from "classnames";
import { useSigner } from "wagmi";
import { useDialogState } from "ariakit";
import toast from "react-hot-toast";
import { ParsedUrlQuery } from "querystring";
import type { GetServerSideProps, NextPage } from "next";

import Layout from "components/Layout/Layout";
import BackButton from "components/Button/backButton";
import { Button, RadioSelector } from "components/Form";
import { formatAddress } from "utils/address";
import { validateForm } from "utils/validate";
import ProgressBar from "components/ProgressBar/ProgressBar";
import { StepperDialog } from "../../../components/Dialog";

import { handleTextChangeAddNewMember } from "utils/handlers";
import { useMoralis, useMoralisQuery } from "react-moralis";

interface QueryUrlParams extends ParsedUrlQuery {
    detailProposal: string;
}

interface DetailProposalProps {
    detailProposal: string;
}

export const getServerSideProps: GetServerSideProps<DetailProposalProps, QueryUrlParams> = async (
    context
) => {
    console.log("Context", context.params);
    const { detailProposal } = context.params as QueryUrlParams;
    console.log("Server", detailProposal);
    const result: DetailProposalProps = {
        detailProposal: detailProposal,
    };
    return {
        props: result,
    };
};

const DetailProposal: NextPage<DetailProposalProps> = ({ detailProposal }) => {
    const [formData, setFormData] = useState({
        voteResult: "",
        txConfirm: "",
    });
    const [activeStep, setActiveStep] = useState(0);
    const { data: signer_data } = useSigner();
    const confirmDialog = useDialogState();

    const { fetch } = useMoralisQuery(
        "Proposal",
        (query) => query.equalTo("proposalId", detailProposal),
        [],
        {
            autoFetch: false,
        }
    );

    const handleNext = (defaultStep = 1) => {
        setActiveStep((prevActiveStep) => prevActiveStep + defaultStep);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    interface ICardProposal {
        title: string;
        children?: React.ReactNode;
        className?: string;
    }

    interface IBadge {
        isActive: boolean;
    }

    const BadgeIsActive = ({ isActive }: IBadge) => {
        return (
            <div className="w-1/6 text-center pl-4 pt-5">
                {isActive ? (
                    <div className="bg-gray grid place-items-center rounded-2xl w-20 h-8 text-green">
                        Active
                    </div>
                ) : (
                    <div className="bg-gray grid place-items-center rounded-2xl w-20 h-8 text-red">
                        Closed
                    </div>
                )}
            </div>
        );
    };

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

    const AboutCard = () => {
        return (
            <CardProposal title="About" className="w-1/3">
                <p className="text-sm">
                    The goals of this proposal are to establish a budget for the $PSP holdings of
                    PeaksDAO unvested over a year. To do this, it seeks to lower the current staking
                    rewards, rebalance the risk vs LPs, and establish upper spending limits for
                    other DAO spending categories.
                </p>
            </CardProposal>
        );
    };

    const InfoCard = () => {
        return (
            <CardProposal title="Info" className="w-1/3">
                <ul className="space-y-6 text-graySupport">
                    <li className="flex justify-between text-sm">
                        <p>Start Date:</p>
                        <p className="text-black">June 21 2022, 19:33</p>
                    </li>
                    <li className="flex justify-between text-sm">
                        <p>End Date:</p>
                        <p className="text-black">June 21 2022, 19:33</p>
                    </li>
                    <li className="flex justify-between text-sm">
                        <p>Creator:</p>
                        <p className="text-black">
                            {formatAddress("0x533336d35cA55DC1e0d7cB3CB44187E138664280")}
                        </p>
                    </li>
                </ul>
            </CardProposal>
        );
    };

    const VotingResultsCard = () => {
        return (
            <CardProposal title="Voting Results" className="w-1/3">
                <div className="w-full gap-10">
                    <ProgressBar bgColor={1} percentage={55} title="In favor" />
                    <ProgressBar bgColor={3} percentage={45} title="Against" />
                </div>
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
        handleReset();
        confirmDialog.toggle();
        handleNext(3);
    }

    return (
        <div>
            <Layout className="layout-base">
                <BackButton />
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={onSubmit}>
                        <div className="flex">
                            <h1 className="text-highlighter w-1/2">{detailProposal}</h1>
                            <BadgeIsActive isActive={false} />
                        </div>
                        <p className="pb-4">
                            To create your DAO, you first need to add a created NFT collection or
                            mint a new one in our system
                        </p>
                        <div className="flex gap-6 pb-10">
                            <AboutCard />
                            <InfoCard />
                            <VotingResultsCard />
                        </div>
                        <RadioSelector
                            name="voteResult"
                            labels={["Against", "In favour"]}
                            handleChange={(event) =>
                                handleTextChangeAddNewMember(event, setFormData)
                            }
                        />
                        <Button className="mt-10">
                            <p>Vote</p>
                        </Button>
                    </form>
                </section>
                <StepperDialog dialog={confirmDialog} className="dialog" activeStep={activeStep}>
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
    );
};

export default DetailProposal;
