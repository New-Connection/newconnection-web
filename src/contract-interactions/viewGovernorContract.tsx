import { ethers } from "ethers";
import { GOVERNOR_ABI } from "abis";
import { getBlocksPerDay, getSecondsPerBlock } from "utils/blockchains";
import { provider } from "components/Web3";

enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed,
}

export async function getGovernorName(contractAddress: string, chainId: number) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    return await governor.name();
}

export async function getGovernorInfoURI(contractAddress: string, chainId: number) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    return await governor.governorInfoURI();
}

export async function getGovernorOwnerAddress(contractAddress: string, chainId: number) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    return await governor.owner();
}

export async function getTotalProposals(contractAddress: string, chainId: number) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    return (await governor.getTotalProposals()).toString();
}

export async function isProposalActive(
    contractAddress: string,
    chainId: number,
    proposalId: string
) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    const proposalState = await governor.state(proposalId);
    return proposalState == ProposalState.Active;
}

export async function proposalDeadline(
    contractAddress: string,
    chainId: number,
    proposalId: string
) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    const votingPeriod = (await governor.votingPeriod()).toNumber();
    const blockNumber = (await governor.proposalSnapshot(proposalId)).toNumber();
    return (await baseProvider.getBlock(blockNumber)).timestamp + getSecondsPerBlock(chainId) * votingPeriod;
}

export async function proposalSnapshot(
    contractAddress: string,
    chainId: number,
    proposalId: string
) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    const blockNumber = (await governor.proposalSnapshot(proposalId)).toNumber();
    return (await baseProvider.getBlock(blockNumber)).timestamp;
}

export async function proposalForVotes(
    contractAddress: string,
    chainId: number,
    proposalId: string
): Promise<string> {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    const votes = await governor.proposalVotes(proposalId);
    return votes["forVotes"].toString();
}

export async function proposalAgainstVotes(
    contractAddress: string,
    chainId: number,
    proposalId: string
): Promise<string> {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    const votes = await governor.proposalVotes(proposalId);
    return votes["againstVotes"].toString();
}
