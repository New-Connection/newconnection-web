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
    description: string;
    contractAddress?: string;
}

export interface CreateNFT extends ICreate {
    image: File | null;
    count: string;
    price: string;
    blockchain: string;
    role: string;
    collectionName?: string;
    twitterURL?: string;
    discordURL?: string;
    contractAddress?: string;
}
