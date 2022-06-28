import { VoidSigner } from "ethers";
import * as React from "react";
import { ChangeEventHandler } from "react";

export interface InputElement {
    name: string;
    label: string;
    isRequired: boolean;
    className?: string;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    optional?: boolean;
    maxLength?: number;
    pattern?: string;
}

export interface TextAreaElement {
    name: string;
    label: string;
    isRequired: boolean;
    className?: string;
    handleChange?: ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    optional?: boolean;
    maxLength?: number;
    pattern?: string;
}

export interface Selector {
    name: string;
    label: string;
    className?: string;
    handlerChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IDragAndDrop {
    name: string;
    label: string;
    className?: string;
    handlerChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
