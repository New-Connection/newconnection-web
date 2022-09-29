import { addNFTSteps, createNFTSteps, StepperDialog } from "./base-dialogs/Stepper";
import { formatAddress } from "utils/address";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import React from "react";
import { useRouter } from "next/router";
import { ICreateNftDialog } from "./dialogInterfaces";
import Link from "next/link";
import { getChainNames } from "utils/blockchains";

export const AddNftDialog = ({ dialog, activeStep, formData }: ICreateNftDialog) => {
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
            <div className="flex ml-7 mb-10">
                Contract Address:
                <div
                    className={"flex ml-4 text-lightGray hover:text-gray5 hover:cursor-pointer"}
                    onClick={() => navigator.clipboard.writeText(formData.contractAddress)}
                >
                    {formatAddress(formData.contractAddress)}
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

export const CreateNftDialog = ({ dialog, formData, activeStep }: ICreateNftDialog) => {
    return (
        <StepperDialog
            dialog={dialog}
            className="dialog"
            activeStep={activeStep}
            steps={createNFTSteps}
        >
            <p className="ml-7">Deployment successful!</p>
            <div className="flex ml-7 mb-10">
                Contract Address:
                <div
                    className={"flex ml-4 text-lightGray hover:text-gray5 hover:cursor-pointer"}
                    onClick={() => navigator.clipboard.writeText(formData.contractAddress)}
                >
                    {formatAddress(formData.contractAddress)}
                    <ClipboardCopyIcon className="h-6 w-5" />
                </div>
            </div>
            <Link
                href={{
                    pathname: "create-dao",
                    query: {
                        tokenAddress: formData.contractAddress,
                        enabledBlockchains: getChainNames().filter((chain) => formData[chain]),
                    },
                }}
            >
                <button
                    className="form-submit-button"
                    onClick={() => {
                        dialog.toggle();
                    }}
                >
                    Go to DAO creation page
                </button>
            </Link>
        </StepperDialog>
    );
};
