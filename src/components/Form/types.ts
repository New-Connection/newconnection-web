import * as React from "react";
import { BaseSyntheticEvent, ChangeEvent } from "react";

export interface InputElement {
    name: string;
    label: string;
    isRequired?: boolean;
    className?: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
}

export interface Selector {
    name: string;
    label: string;
    className?: string;
    handlerChange?: (event: BaseSyntheticEvent) => boolean;
}

export interface IDragAndDrop {
    name: string;
    label: string;
    className?: string;
    handleChange?: (file: File | File[]) => void;
    hoverTitle?: string;
    multipleFiles?: boolean;
}

export interface InputWithTokenElement extends InputElement {
    handleTokenChange: (token: string) => void;
    tokens: string[];
}

export interface InputWithTokenSelectProps extends InputElement {
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
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
