import { Signer, ContractFactory } from "ethers";
import { GOVERNANCE_NFT_ABI, GOVERNANCE_NFT_BYTECODE } from "contracts";

export const CreateNFTContract = (signer: Signer): ContractFactory => {
    return new ContractFactory(GOVERNANCE_NFT_ABI, GOVERNANCE_NFT_BYTECODE, signer);
};
