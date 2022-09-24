export interface ICreate {
    name: string;
    description?: string;
}

export interface ICreateDAO extends ICreate {
    url: string;
    goals: string;
    profileImage: any;
    coverImage: any;
    tokenAddress: string[];
    votingPeriod: string;
    quorumPercentage: string;
    type: string[];
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
    nftImage?: any;
    isActive?: boolean;
    treasuryAddress?: string;
}



export interface IMembershipForm {
    walletAddress?: string;
    note?: string;
    blockchainSelected?: string;
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

export interface ICreateNFT extends ICreate, IBlockchains {
    file: object;
    governorUrl?: string;
    NFTtype: string;
    symbol: string;
    price: number;
    blockchain: string;
    governorAddress?: string;
    // numberOfNFT: { [blockchainName: string]: number };
    contractAddress?: string;
    ipfsAddress?: string;
}

export interface ICreateProposal extends ICreate {
    address?: string;
    proposalId?: string;
    governorAddress: string;
    tokenAddress?: string;
    chainId?: number;
    shortDescription: string;
    file?: object;
    linkForum?: object;
    options: string[];
    blockchain: string[];
    enabledBlockchains?: string[];
}

export interface IProposalPageForm extends ICreateProposal {
    isActive?: boolean;
    forVotes?: string;
    againstVotes?: string;
    deadline?: number;
}

export interface INFTVoting {
    title?: string;
    type?: string;
    image?: string;
    tokenAddress: string;
    
}

export interface IMultiNFTVoting {
    daoAddress?: string;
    tokenAddress: string[];
    tokenNames?: string[];
    daoName: string;
} 

export interface IAddNewMember {
    daoName: string;
    walletAddress: string;
    daoAddress: string;
    tokenAddress: string[];
    tokenNames: string[];
    votingToken: string;
    blockchainSelected: string;
    note?: string;
}

export interface IProposalDetail {
    title: string;
    shortDescription: string;
    governorAddress: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    results?: number;
    ownerAddress?: string;
}
