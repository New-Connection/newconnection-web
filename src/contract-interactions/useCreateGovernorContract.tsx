import { Signer, ContractFactory } from "ethers";
import { GOVERNOR_ABI, GOVERNOR_BYTECODE } from "abis";

export const CreateGovernorContract = (signer: Signer): ContractFactory => {
    return new ContractFactory(GOVERNOR_ABI, GOVERNOR_BYTECODE, signer);
};
