import * as React from "react";
import { BaseSyntheticEvent, ChangeEvent } from "react";
import { INFTVoting } from "types/forms";

export interface InputTextProps {
    name: string;
    label: string;
    value?: string;
    labelTitle?: string;
    isRequired?: boolean;
    disabled?: boolean;
    className?: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
}

export interface InputAmountProps {
    name: string;
    label?: string;
    labelTitle?: string;
    isRequired?: boolean;
    className?: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    step?: number;
    image?: object;
    isDisabled?: boolean;
}

export interface ISelectorProps {
    name: string;
    label: string;
    enabledValues?: string[];
    className?: string;
    defaultValue?: string;
    handleChange?: (event: BaseSyntheticEvent) => boolean;
}

export interface IRadioSelectorClickOption {
    tokenName: string;
    tokenAddress: string;
}

export interface IRadioSelector {
    name: string;
    labels: string[];
    className?: string;
    values?: string[];
    handleChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, option?: IRadioSelectorClickOption) => void;
}

export interface IRadioSelectorNFT {
    name: string;
    chainId:number;
    values: INFTVoting[];
    className?: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, selectedNFT: INFTVoting) => void;
}

export interface IDragAndDropProps {
    name: string;
    label: string;
    className?: string;
    handleChange: (file: File) => void;
    hoverTitle?: string;
    multipleFiles?: boolean;
}

export interface ButtonProps {
    disabled?: boolean;
    type?: "submit" | "button";
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export interface CheckboxProps {
    label: string;
    description?: string;
    values: string[];
    images?: boolean;
    enabledValues?: string[];
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
