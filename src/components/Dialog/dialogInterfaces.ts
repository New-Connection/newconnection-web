import { DisclosureState } from "ariakit";
import { ICreateNFT, IDAOPageForm, INFTVoting, IProposal } from "types/forms";
import { ButtonState } from "types/daoIntefaces";
import * as React from "react";

export interface IAddNftDialog {
    dialog: DisclosureState,
    formData: ICreateNFT,
    activeStep: number,
}

export interface IDetainNftDialog {
    dialog: DisclosureState,
    DAO: IDAOPageForm,
    currentNFT: INFTVoting,
    buttonState: ButtonState,
    mintButton: () => Promise<void>
}

export interface IContributeTreasuryDialog {
    dialog: DisclosureState,
    DAO: IDAOPageForm,
    sending: boolean,
    setSending: React.Dispatch<React.SetStateAction<boolean>>,
    contributeAmount: string,
    setContributeAmount: React.Dispatch<React.SetStateAction<string>>,
    contributeToTreasuryButton: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
}

export interface ICreateTreasuryDialog {
    dialog: DisclosureState,
    DAO: IDAOPageForm,
    createTreasuryStep: number
}

export interface IProposalPageDialogs {
    dialog: DisclosureState,
    formData: IProposal,
    activeStep: number,
}