import { StringLike } from "ariakit/ts/form/__utils";

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
    file: object;
    NFTtype: string;
    collectionName: string;
    royalties: number;
    symbol: string;
    price: number;
    blockchain: string;
    numberOfNFT: number;
    contractAddress?: string;
    ipfsAddress?: string;
    
}
