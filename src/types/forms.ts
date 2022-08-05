export interface ICreate {
    name: string;
    description?: string;
}

export interface ICreateDAO extends ICreate {
    goals: string;
    profileImage: any;
    coverImage: any;
    tokenAddress: string;
    votingPeriod: string;
    quorumPercentage: string;
    type: string[];
    blockchain: string[];
    contractAddress?: string;
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
}

export interface IMembershipForm {
    walletAddress?: string;
    note?: string;
    blockchainSelected?: string;
}

export interface IBlockchains {
    Polygon?: string;
    Ethereum?: string;
    Arbitrum?: string;
    Binance?: string;
    Avalanche?: string;
    Fantom?: string;
    Optimism?: string;
}

export interface ICreateNFT extends ICreate, IBlockchains {
    file: object;
    NFTtype: string;
    collectionName: string;
    royalties: number;
    symbol: string;
    price: number;
    // numberOfNFT: { [blockchainName: string]: number };
    contractAddress?: string;
    ipfsAddress?: string;
}

export interface ICreateProposal extends ICreate {
    proposalId?: string;
    governorAddress: string;
    chainId?: number;
    shortDescription: string;
    file?: object;
    linkForum?: object;
    options: string[];
    blockchain: string[];
}

export interface IAddNewMember {
    daoName: string;
    walletAddress: string;
    daoAddress: string;
    nftID: number[];
    blockchainSelected: string;
    blockchainEnabled: string[];
    note?: string;
}

export interface IProposalDetail {
    title: string;
    shortDescription: string;
    description?: string
    startDate?: Date;
    endDate?: Date;
    results?: number;
    ownerAddress?: string;
}
