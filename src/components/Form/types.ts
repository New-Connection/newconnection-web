import * as React from "react";
import { BaseSyntheticEvent, ChangeEvent } from "react";

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
    className?: string;
    defaultValue?: string;
    disablesValues?: string[];
    handleChange?: (event: BaseSyntheticEvent) => boolean;
}

export interface IRadioSelector {
    name: string;
    labels: string[];
    className?: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

}

export interface IDragAndDropProps {
    name: string;
    label: string;
    className?: string;
    handleChange: (file: File) => void;
    hoverTitle?: string;
    multipleFiles?: boolean;
}

export interface InputWithTokenElement extends InputTextProps {
    handleTokenChange: (token: string) => void;
    tokens: string[];
}

export interface InputWithTokenSelectProps extends InputTextProps {
    handleTokenChange: (token: string) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    tokenOptions: string[];
}

export interface InputAmountWithDaysProps {
    name: string;
    selectInputName: string;
    label: string;
    isRequired: boolean;
    className?: string;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
    images?: object;
    enabledValues?: string[];
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface IDatePicker {
    label: string;
    value: Date | null;
    handleChange: () => void;
}
