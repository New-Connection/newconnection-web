import GovernorContract from "abis/GovernorContract.json";
import GovernanceNFT from "abis/GovernanceNFT.json";

export const GOVERNANCE_NFT_ABI = GovernanceNFT.abi as [];
export const GOVERNANCE_NFT_BYTECODE = GovernanceNFT.bytecode as string;
export const GOVERNOR_ABI = GovernorContract.abi as [];
export const GOVERNOR_BYTECODE = GovernorContract.bytecode as string;
