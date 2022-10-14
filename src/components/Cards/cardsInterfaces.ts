import { ButtonState, IDAOPageForm, INFTVoting, IProposalDetail } from "types";
import * as React from "react";
import { DisclosureState } from "ariakit";

export interface INFTImage {
    image?: string;
    className?: string;
    index?: number;
}

export interface INFTCard {
    nftObject: INFTVoting;
    chain?: number | string;
    className?: string;
}

export interface INFTCardWithDialog extends INFTCard {
    nftObject: INFTVoting;
    setCurrentNFT?: React.Dispatch<React.SetStateAction<INFTVoting>>;
    setButtonState?: React.Dispatch<React.SetStateAction<ButtonState>>;
    detailNFTDialog?: DisclosureState;
    chain: number | string;
}

export interface IProposalCard {
    title: string;
    shortDescription: string;
    chainId?: number;
    tokenName?: string;
    description?: string;
    governorName?: string;
    blockchain?: string[];
    isActive?: boolean;
    forVotes?: string;
    againstVotes?: string;
    deadline?: number;
}

export interface ICardProposal {
    title: string;
    children?: React.ReactNode;
    className?: string;
}

export interface IInformationCard {
    proposalData: IProposalDetail;
}

export interface IDAOCard {
    daoObject: IDAOPageForm;
    lastElement: any;
}