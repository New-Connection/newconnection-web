import { ParsedUrlQuery } from "querystring";

export interface IDaoQuery extends ParsedUrlQuery {
    url: string;
}

export interface IChatsQuery extends ParsedUrlQuery {
    url: string;
    governorAddress: string;
    chainId: string;
}

export interface IDetailProposalQuery extends ParsedUrlQuery {
    detailProposal: string;
}

export interface IProposalsQuery extends ParsedUrlQuery {
    governorAddress: string;
    chainId: string;
    url: string;
}

export interface IAddMemberQuery extends ParsedUrlQuery {
    governorAddress: string;
    chainId: string;
    url: string;
    blockchains: string[];
}

export interface IAddNftQuery extends ParsedUrlQuery {
    url: string;
    governorAddress: string;
    blockchain: string;
}

export interface ICreateProposalQuery extends ParsedUrlQuery {
    governorAddress: string;
    url: string;
    blockchains: string[];
    chainId: string;
}

export interface ICreateDaoQuery extends ParsedUrlQuery {
    tokenAddress: string;
    enabledBlockchains: string[];
}
