import { GovernorNFTABI } from "abis/GovernanceNFT";
import governor from "abis/Governor";

import { ContractFactory, Signer } from "ethers";

export const createFactoryNFT = (bitecode: any, signer: Signer) =>
    new ContractFactory(GovernorNFTABI, bitecode, signer);

export const createFactoryGovernor = (bitecode: any, signer: Signer) =>
    new ContractFactory(governor, bitecode, signer);
