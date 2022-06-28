import governanceNFT from "abis/GovernanceNFT";
import governor from "abis/Governor";

import { ethers, Signer } from "ethers";

export const createFactoryNFT = (bitecode: any, signer: Signer) =>
    new ethers.ContractFactory(governanceNFT, bitecode, signer);

export const createFactoryGovernor = (bitecode: any, signer: Signer) =>
    new ethers.ContractFactory(governor, bitecode, signer);
