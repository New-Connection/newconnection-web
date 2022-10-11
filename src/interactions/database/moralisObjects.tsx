import { Moralis } from "moralis-v1";

export enum MoralisClassEnum {
    DAO = "DAO",
    PROPOSAL = "Proposal",
    MEMBER = "Member",
    WHITELIST = "Whitelist",
    NFT = "NFT",
}

export const DaoMoralisClass = Moralis.Object.extend(MoralisClassEnum.DAO);
export const ProposalMoralisClass = Moralis.Object.extend(MoralisClassEnum.PROPOSAL);
export const MemberMoralisClass = Moralis.Object.extend(MoralisClassEnum.MEMBER);
export const WhitelistMoralisClass = Moralis.Object.extend(MoralisClassEnum.WHITELIST);
export const NftMoralisClass = Moralis.Object.extend(MoralisClassEnum.NFT);
Moralis.Object.registerSubclass("DAO", DaoMoralisClass);
Moralis.Object.registerSubclass("Proposal", ProposalMoralisClass);
Moralis.Object.registerSubclass("User", MemberMoralisClass);
Moralis.Object.registerSubclass("Whitelist", WhitelistMoralisClass);
Moralis.Object.registerSubclass("NFT", NftMoralisClass);
