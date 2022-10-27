import { ethers } from "ethers";
import { GOVERNOR_ABI } from "abis";
import { getSecondsPerBlock } from "interactions/contract";
import { provider } from "components";

export enum ProposalState {
    Pending = 0 as any,
    Active = 1 as any,
    Canceled = 2 as any,
    Defeated = 3 as any,
    Succeeded = 4 as any,
    Queued = 5 as any,
    Expired = 6 as any,
    Executed = 7 as any,
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

export async function getProposalState(contractAddress: string, chainId: number, proposalId: string) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    return await governor.state(proposalId);
}

export async function proposalDeadline(contractAddress: string, chainId: number, proposalId: string) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    const proposalVotingPeriod = (await governor.votingPeriod()).toNumber();
    const proposalStartBlock = (await governor.proposalSnapshot(proposalId)).toNumber();
    return (
        (await baseProvider.getBlock(proposalStartBlock))?.timestamp +
        getSecondsPerBlock(chainId) * proposalVotingPeriod
    );
}

export async function proposalSnapshot(contractAddress: string, chainId: number, proposalId: string) {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    const blockNumber = (await governor.proposalSnapshot(proposalId)).toNumber();
    return (await baseProvider.getBlock(blockNumber))?.timestamp;
}

export async function proposalForVotes(contractAddress: string, chainId: number, proposalId: string): Promise<string> {
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

export async function getProposer(contractAddress: string, chainId: number, proposalId: string): Promise<string> {
    let baseProvider = provider({ chainId });
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, baseProvider);
    return await governor.getProposer(proposalId);
}
