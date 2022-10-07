import { Moralis } from "moralis-v1";

export enum MoralisClassEnum {
    DAO = "DAO",
    PROPOSAL = "Proposal",
    USER = "User",
    WHITELIST = "Whitelist",
}

export const DaoMoralisObject = Moralis.Object.extend(MoralisClassEnum.DAO);
export const ProposalMoralisObject = Moralis.Object.extend(MoralisClassEnum.PROPOSAL);
export const UserMoralisObject = Moralis.Object.extend(MoralisClassEnum.USER);
export const WhitelistMoralisObject = Moralis.Object.extend(MoralisClassEnum.WHITELIST);
Moralis.Object.registerSubclass("DAO", DaoMoralisObject);
Moralis.Object.registerSubclass("Proposal", ProposalMoralisObject);
Moralis.Object.registerSubclass("User", UserMoralisObject);
Moralis.Object.registerSubclass("Whitelist", WhitelistMoralisObject);
