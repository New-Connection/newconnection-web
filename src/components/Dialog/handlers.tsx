import { Dispatch, SetStateAction } from "react";

export const handleNext = (
    setActiveStep: Dispatch<SetStateAction<number>>,
    defaultStep: number = 1
) => {
    setActiveStep((prevActiveStep) => prevActiveStep + defaultStep);
};

export const handleReset = (setActiveStep: Dispatch<SetStateAction<number>>) => {
    setActiveStep(0);
};
