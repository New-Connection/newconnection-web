import { addNFTSteps, StepperDialog } from "./base-dialogs/Stepper";
import { formatAddress } from "utils/address";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import React from "react";
import { useRouter } from "next/router";
import { IAddNftDialog } from "./dialogInterfaces";

export const AddNftDialog = ({ dialog, activeStep, formData }: IAddNftDialog) => {
    const router = useRouter();

    return (
        <StepperDialog
            dialog={dialog}
            className="dialog"
            activeStep={activeStep}
            steps={addNFTSteps}
        >
            <p className="ml-7">Deployment successful!</p>

            {/*TODO: make function*/}
            <div className="flex ml-7 mb-10">Contract Address:
                <div
                    className={
                        "flex ml-4 text-lightGray hover:text-gray5 hover:cursor-pointer"
                    }
                    onClick={() =>
                        navigator.clipboard.writeText(formData.contractAddress)
                    }
                >
                    {formatAddress(formData.contractAddress)}
                    <ClipboardCopyIcon className="h-6 w-5" />
                </div>
            </div>
            <button
                className="form-submit-button"
                onClick={() => {
                    dialog.toggle();
                    router.back()
                }}
            >
                Back to DAO
            </button>
        </StepperDialog>
    )
}