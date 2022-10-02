import GovernorContract from "abis/GovernorContract.json";
import GovernanceNFT from "abis/GovernanceNFT.json";
import Treasury from "abis/Treasury.json"

export const GOVERNANCE_NFT_ABI = GovernanceNFT.abi as [];
export const GOVERNANCE_NFT_BYTECODE = GovernanceNFT.bytecode as string;
export const GOVERNANCE_NFT_NAME = GovernanceNFT.contractName as string;

export const GOVERNOR_ABI = GovernorContract.abi as [];
export const GOVERNOR_BYTECODE = GovernorContract.bytecode as string;
export const GOVERNOR_NAME = GovernorContract.contractName as string;

export const TREASURY_ABI = Treasury.abi as [];
export const TREASURY_BYTECODE = Treasury.bytecode as string;
