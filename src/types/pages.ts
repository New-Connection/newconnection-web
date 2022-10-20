import { VotingType } from "interactions/contract";
import React from "react";

export interface ICreate {
    name: string;
    description?: string;
}

export interface ICreateDAO extends ICreate {
    url: string;
    goals: string;
    profileImage: any;
    coverImage: any;
    isActive?: boolean;
    tokenAddress: string[];
    votingPeriod: string;
    quorumPercentage: string;
    blockchain: string[];
    governorAddress?: string;
    chainId?: number;
    discordURL?: string;
    twitterURL?: string;
    websiteURL?: string;
    enabledBlockchains?: string[];
}

export interface IDAOPageForm extends ICreateDAO {
    scanURL?: string;
    totalVotes?: number;
    totalMembers?: number;
    totalProposals?: number;
    activeProposals?: number;
    isActive?: boolean;
    treasuryAddress?: string;
}

export interface IBlockchains {
    Polygon?: number;
    Ethereum?: number;
    Arbitrum?: number;
    Binance?: number;
    Avalanche?: number;
    Fantom?: number;
    Optimism?: number;
}

export interface ICreateNFT extends ICreate {
    governorUrl?: string;
    file: object;
    symbol: string;
    price: number;
    blockchain: string;
    governorAddress?: string;
    // numberOfNFT: { [blockchainName: string]: number };
    contractAddress?: string;
    ipfsAddress?: string;
}

export interface ICreateProposal extends ICreate {
    proposalId?: string;
    governorAddress: string;
    governorUrl?: string;
    tokenAddress?: string;
    tokenName?: string;
    chainId?: number;
    shortDescription: string;
    file?: object;
    linkForum?: object;
    options?: string[];
    blockchain?: string[];
    enabledBlockchains?: string[];
}

export interface IProposalPageForm extends ICreateProposal {
    isActive?: boolean;
    forVotes?: string;
    againstVotes?: string;
    endDateTimestamp?: number;
}

export interface IProposalDetail extends IProposalPageForm {
    startDateTimestamp?: number;
    ownerAddress?: string;
}

export interface IProposal {
    voteResult: VotingType;
    txConfirm?: string;
}

export interface INFTVoting {
    title?: string;
    type?: string;
    image?: string;
    tokenAddress: string;
    price?: string;
    totalSupply?: string;
    totalMinted?: string;

    tokenRequestedByMember?: boolean;
    tokenRequestApproved?: boolean;
    tokenMintedByMember?: number;
}

export interface IWhitelistRecord {
    governorAddress: string;
    governorUrl: string;
    chainId: number;
    walletAddress?: string;
    votingTokenName?: string;
    votingTokenAddress?: string;
    note?: string;
    blockchainSelected?: string[];
}

export type TabsType = {
    label: string;
    index: number;
    Component: React.FC;
}[];

export interface IMember {
    governorUrl: string;
    memberAddress: string;
    memberTokens: string[];
    role: string;
    votingPower?: number;
}

export type ButtonState = "Mint" | "Loading" | "Success" | "Error";
