import { Dispatch, SetStateAction } from "react";

export const handleNext = (setActiveStep: Dispatch<SetStateAction<number>>) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
};

export const handleReset = (setActiveStep: Dispatch<SetStateAction<number>>) => {
    setActiveStep(0);
};
