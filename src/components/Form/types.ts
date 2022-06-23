import { VoidSigner } from 'ethers';
import * as React from 'react';

export interface InputElement {
  name: string;
  label: string;
  isRequired: boolean;
  className?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  optional?: boolean;
  pattern?: string;
}

export interface Selector {
  name: string;
  label: string;
  className?: string;
  handlerChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IDragAndDrop{
  name: string;
  label: string;
  className?: string;
  handlerChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hoverTitle?: string;
  multiplefiles?:boolean;
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
