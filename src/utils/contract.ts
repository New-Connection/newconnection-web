import { GOVERNANCE_NFT_ABI } from "contracts";
import { GOVERNOR_ABI } from "contracts";

import { ContractFactory, Signer } from "ethers";

export const createFactoryNFT = (bitecode: any, signer: Signer) =>
    new ContractFactory(GOVERNANCE_NFT_ABI, bitecode, signer);

export const createFactoryGovernor = (bitecode: any, signer: Signer) =>
    new ContractFactory(GOVERNOR_ABI, bitecode, signer);
