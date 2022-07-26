import { Signer, ContractFactory } from "ethers";
import { GOVERNOR_ABI, GOVERNOR_BYTECODE } from "abis";
import { GOVERNANCE_NFT_ABI, GOVERNANCE_NFT_BYTECODE } from "abis";

export const CreateGovernorContract = (signer: Signer): ContractFactory => {
    return new ContractFactory(GOVERNOR_ABI, GOVERNOR_BYTECODE, signer);
};

export const CreateNFTContract = (signer: Signer): ContractFactory => {
    return new ContractFactory(GOVERNANCE_NFT_ABI, GOVERNANCE_NFT_BYTECODE, signer);
};
