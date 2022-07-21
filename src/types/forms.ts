export interface ICreate {
    name: string;
    description: string;
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
    contractAddress?: string;
    chainId?: number;
}

export interface DAOPageForm extends CreateDAO {
    discordURL?: string;
    twitterURL?: string;
    URL?: string;
    scanURL?: string;
    totalVotes?: number;
    totalMembers?: number;
    totalProposals?: number;
    activeProposals?: number;
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

export interface CreateNFT extends ICreate, IBlockchains {
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
