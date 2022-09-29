import { formatAddress } from "utils/address";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import { StepperDialog } from "./base-dialogs";
import React from "react";
import { useRouter } from "next/router";
import { ICreateProposalDialog } from "./dialogInterfaces";

export const CreateProposalDialog = ({ dialog, activeStep, formData }: ICreateProposalDialog) => {
    const router = useRouter();

    return (
        <StepperDialog dialog={dialog} className="dialog" activeStep={activeStep}>
            <p>Proposal created successful!</p>
            <div className="flex mb-10">
                Proposal Id:
                <div
                    className={"flex ml-4 text-lightGray hover:text-gray5 hover:cursor-pointer"}
                    onClick={() => navigator.clipboard.writeText(formData.proposalId)}
                >
                    {formatAddress(formData.proposalId)}
                    <ClipboardCopyIcon className="h-6 w-5" />
                </div>
            </div>
            <button
                className="form-submit-button"
                onClick={() => {
                    dialog.toggle();
                    router.back();
                }}
            >
                Back to DAO
            </button>
        </StepperDialog>
    );
};