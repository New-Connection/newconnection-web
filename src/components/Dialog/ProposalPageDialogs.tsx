import { StepperDialog } from "./base-dialogs";
import React from "react";
import { IProposalPageDialog } from "./dialogInterfaces";

export const ProposalVoteDialog = ({ dialog, activeStep, formData }: IProposalPageDialog) => {
    return (
        <StepperDialog
            dialog={dialog}
            className="dialog"
            activeStep={activeStep}
            isClose={true}
        >
            <p className="ml-7">Voted successfully!</p>
            <p className="ml-7 mb-10">Transaction: {formData.txConfirm}</p>

            <button
                className="form-submit-button"
                onClick={() => {
                    dialog.toggle();
                }}
            >
                Back to proposal
            </button>
        </StepperDialog>
    )
}