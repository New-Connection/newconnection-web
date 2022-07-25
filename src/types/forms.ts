export interface ICreate {
    name: string;
    description?: string;
}

export interface CreateDAO extends ICreate {
    goals: string;
    profileImage: object;
    coverImage: object;
    tokenAddress: string;
    votingPeriod: string;
    quorumPercentage: string;
    type: string[];
    blockchain: string[];
    description: string;
    contractAddress?: string;
}

export interface IBlockchains {
    Polygon?: any;
    Ethereum?: any;
    Arbitrum?: any;
    Binance?: any;
    Avalanche?: any;
    Fantom?: any;
    Optimism?: any;
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
    shortDescription: string;
    file?: object;
    linkForum?: object;
    options: string[];
    blockchain: string[];
}
