import { ParsedUrlQuery } from "querystring";

export interface IDaoQuery extends ParsedUrlQuery {
    url: string;
}

export interface IChatsQuery extends ParsedUrlQuery {
    governorUrl: string;
    governorAddress: string;
    chainId: string;
}

export interface IDetailProposalQuery extends ParsedUrlQuery {
    detailProposal: string;
}

export interface IProposalsQuery extends ParsedUrlQuery {
    name: string;
    governorAddress: string;
    chainId: string;
    url: string;
}

export interface IAddMemberQuery extends ParsedUrlQuery {
    governorAddress: string;
    chainId: string;
    governorUrl: string;
    blockchains: string[];
}

export interface IAddNftQuery extends ParsedUrlQuery {
    governorAddress: string;
    blockchain: string;
}

export interface ICreateProposalQuery extends ParsedUrlQuery {
    governorAddress: string;
    governorUrl: string;
    blockchains: string[];
    chainId: string;
}

export interface ICreateDaoQuery extends ParsedUrlQuery {
    tokenAddress: string;
    enabledBlockchains: string[];
}
