import { StepperDialog } from "./base-dialogs";
import React from "react";
import { IProposalPageDialogs } from "./dialogInterfaces";

export const ProposalVoteDialog = ({ dialog, activeStep, formData }: IProposalPageDialogs) => {
    return (
        <StepperDialog
            dialog={dialog}
            className="dialog"
            activeStep={activeStep}
            isClose={true}
        >
            <p className="ml-7">Votes successfully!</p>
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