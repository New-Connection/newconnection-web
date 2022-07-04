export interface ICreate {
    name: string;
    description: string;
}

export interface CreateDAO extends ICreate {
    goals: string;
    profileImage: object;
    coverImage: object;
    type: string[];
    blockchain: string[];
    description: string;
}

export interface CreateNFT extends ICreate {
    image: string;
    count: string;
    price: string;
    blockchain: string;
    role: string;
    collectionName?: string;
    twitterURL?: string;
    discordURL?: string;
    contractAddress?: string;
}
