import * as React from "react";
import { DisclosureState } from "ariakit";
import { Dialog, DialogHeading } from "ariakit/dialog";
import classNames from "classnames";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import Typography from "@mui/material/Typography";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { BeatLoader } from "react-spinners";

interface LoadingDialogProps {
    dialog: DisclosureState;
    className?: string;
}

const steps = [
    {
        label: "Waiting for the confirmation in your wallet",
        description: ``,
    },
    {
        label: "Waiting for the confirmation from blockchain",
        description: "",
    },
    {
        label: "Done",
        description: "",
    },
];

export const StepperDialog = ({ dialog, className }: LoadingDialogProps) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const SpinnerLoading = () => {
        return (
            <div role="status">
                <svg
                    className="inline mr-2 w-7 h-7 animate-spin text-gray-600 fill-[#6858CB]"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    /> */}
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        );
    };

    return (
        <Dialog
            state={dialog}
            className={classNames("dialog", className)}
            hideOnInteractOutside={false}
            hideOnEscape={false}
        >
            <div className="h-full">
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <div className="flex gap-2">
                                {index === activeStep ? (
                                    //step for rn active message
                                    <>
                                        <SpinnerLoading />
                                        <div className="text-xl text-[#1C1823]">{step.label}</div>
                                    </>
                                ) : index > activeStep - 1 ? (
                                    //steps for next messages
                                    <>
                                        <CheckCircleIcon className="h-7 w-7 fill-[#CCCCCC]" />
                                        <div className="text-xl text-[#CCCCCC]">{step.label}</div>
                                    </>
                                ) : (
                                    //steps for previous messages
                                    <>
                                        <CheckCircleIcon className="h-7 w-7 stroke-1 fill-[#6858CB]" />
                                        <div className="text-xl text-[#1C1823]">{step.label}</div>
                                    </>
                                )}
                            </div>
                            <StepContent>
                                <Typography>{step.description}</Typography>
                                <div className="mt-2">
                                    <button
                                        onClick={handleNext}
                                        className="bg-[#6858CB] text-white py-2 px-4 rounded-2xl"
                                    >
                                        {index === steps.length - 1 ? "Finish" : "Continue"}
                                    </button>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <div className={"p-3"}>
                        {/* <div>All steps completed - you&apos;re finished</div> */}
                        <button
                            onClick={() => {
                                dialog.toggle();
                                handleReset();
                            }}
                            className="mt-1 mr-1 py-2 px-4 rounded-2xl bg-[#6858CB] text-white"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </Dialog>
    );
};
