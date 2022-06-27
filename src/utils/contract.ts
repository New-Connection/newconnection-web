import governanceNFT from 'src/abis/governanceNFT' 
import governor from 'src/abis/governor'

import { ethers, Signer } from 'ethers';

export const createFactoryNFT = (bitecode:any, signer: Signer) =>
    new ethers.ContractFactory(governanceNFT, bitecode, signer);

export const createFactoryGovernor = (bitecode:any, signer: Signer) =>
    new ethers.ContractFactory(governor, bitecode, signer);