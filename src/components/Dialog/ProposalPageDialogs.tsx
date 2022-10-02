import { StepperDialog } from "./base-dialogs";
import React from "react";
import { IProposalPageDialog } from "./dialogInterfaces";

export const ProposalVoteDialog = ({ dialog, activeStep }: IProposalPageDialog) => {
    return (
        <StepperDialog
            dialog={dialog}
            className="dialog"
            activeStep={activeStep}
            isClose={true}
        >
            <p className="ml-7 mb-7">Voted successfully!</p>

            <button
                className="form-submit-button"
                onClick={() => {
                    dialog.toggle();
                }}
            >
                Back to proposal
            </button>
        </StepperDialog>
    );
};