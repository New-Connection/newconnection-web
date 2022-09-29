import { formatAddress } from "utils/address";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { StepperDialog } from "./base-dialogs";
import React from "react";
import { ICreateDaoDialog } from "./dialogInterfaces";

export const CreateDaoDialog = ({ dialog, formData, activeStep }: ICreateDaoDialog) => {
    return (
        <StepperDialog dialog={dialog} className="dialog" activeStep={activeStep}>
            <p className="ml-7">Deployment successful!</p>
            <div className="flex ml-7 mb-10">Contract Address:
                <div
                    className={
                        "flex ml-4 text-lightGray hover:text-gray5 hover:cursor-pointer"
                    }
                    onClick={() =>
                        navigator.clipboard.writeText(formData.governorAddress)
                    }
                >
                    {formatAddress(formData.governorAddress)}
                    <ClipboardCopyIcon className="h-6 w-5" />
                </div>
            </div>
            <Link href={`/daos/${formData.url}`}>
                <button
                    className="form-submit-button"
                    onClick={() => {
                        dialog.toggle();
                    }}
                >
                    View DAO
                </button>
            </Link>
        </StepperDialog>
    )
}